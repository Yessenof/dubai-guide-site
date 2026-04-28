#!/usr/bin/env bash
# Check and optionally fix ADMIN_EMAIL on the Cloudways server.
# Run from macOS Terminal (needs interactive SSH password):
#   ./scripts/check-admin-email.sh

set -uo pipefail

SSH_USER="master_asumzwhebx"
SERVER="165.245.187.15"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
ENV_FILE="/home/master/applications/dgcmdxxpjx/public_html/.env.local"
CORRECT_EMAIL="zhanbatyresenov@gmail.com"
LOGIN_URL="https://phpstack-1618074-6379172.cloudwaysapps.com/admin/login"

if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH=( ssh -S "$SOCKET" "$SSH_USER@$SERVER" )
  echo "Using existing ControlMaster socket."
else
  SSH=( ssh "$SSH_USER@$SERVER" )
  echo "No ControlMaster socket — SSH will prompt for password."
fi

echo ""
echo "=== Checking ADMIN_EMAIL ==="
echo ""

# Extract ADMIN_EMAIL line safely — print only that line with annotations
SERVER_OUT=$("${SSH[@]}" bash -s << 'SCRIPT'
set -uo pipefail
ENV_FILE="/home/master/applications/dgcmdxxpjx/public_html/.env.local"
CORRECT_EMAIL="zhanbatyresenov@gmail.com"

# Extract raw line containing ADMIN_EMAIL
RAW_LINE=$(grep '^ADMIN_EMAIL=' "$ENV_FILE" || true)

if [ -z "$RAW_LINE" ]; then
  echo "STATUS:missing"
  echo "EMAIL_RAW:"
else
  # Extract value after the first =
  RAW_VAL="${RAW_LINE#ADMIN_EMAIL=}"
  echo "EMAIL_RAW:${RAW_VAL}"

  # Check for common issues
  # Trim leading/trailing whitespace for comparison
  TRIMMED=$(printf '%s' "$RAW_VAL" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

  # Check for surrounding quotes
  HAS_QUOTES="false"
  if [[ "$TRIMMED" == \"*\" ]] || [[ "$TRIMMED" == \'*\' ]]; then
    HAS_QUOTES="true"
  fi

  # Check length
  LEN=${#RAW_VAL}
  TRIMMED_LEN=${#TRIMMED}

  echo "EMAIL_LEN:${LEN}"
  echo "EMAIL_TRIMMED_LEN:${TRIMMED_LEN}"
  echo "EMAIL_HAS_QUOTES:${HAS_QUOTES}"

  # Check if it matches expected value
  if [ "$TRIMMED" = "$CORRECT_EMAIL" ]; then
    echo "STATUS:correct"
  elif [ -z "$TRIMMED" ]; then
    echo "STATUS:blank"
  else
    echo "STATUS:mismatch"
  fi
fi

# Check for invisible/non-ASCII characters in the line (print hex of first 60 bytes)
printf '%s' "$RAW_LINE" | head -c 60 | xxd | head -3
SCRIPT
)

echo "--- Server response ---"
echo "$SERVER_OUT"
echo "-----------------------"
echo ""

# Parse
_get() { printf '%s\n' "$SERVER_OUT" | grep "^$1:" | head -1 | cut -d: -f2-; }

STATUS=$(_get STATUS)
EMAIL_RAW=$(_get EMAIL_RAW)
EMAIL_LEN=$(_get EMAIL_LEN)
EMAIL_HAS_QUOTES=$(_get EMAIL_HAS_QUOTES)

echo "Status:       $STATUS"
echo "Raw value:    [$EMAIL_RAW]"
echo "Length:       $EMAIL_LEN"
echo "Has quotes:   $EMAIL_HAS_QUOTES"
echo ""

# Decide action
if [ "$STATUS" = "correct" ]; then
  echo "✅ ADMIN_EMAIL is already correct: $CORRECT_EMAIL"
  echo "   No change needed."
  NEED_FIX="false"
else
  echo "⚠️  ADMIN_EMAIL is '$STATUS' — will update to: $CORRECT_EMAIL"
  NEED_FIX="true"
fi

if [ "$NEED_FIX" = "true" ]; then
  echo ""
  echo "Updating ADMIN_EMAIL on server..."

  "${SSH[@]}" bash -s << FIXSCRIPT
set -uo pipefail
ENV_FILE="$ENV_FILE"
NEW_EMAIL="$CORRECT_EMAIL"

python3 - "\$ENV_FILE" "\$NEW_EMAIL" << 'PYEOF'
import sys, re
path      = sys.argv[1]
new_email = sys.argv[2]
with open(path) as f:
    content = f.read()
if re.search(r'^ADMIN_EMAIL=', content, re.MULTILINE):
    content = re.sub(r'^ADMIN_EMAIL=.*', f'ADMIN_EMAIL={new_email}', content, flags=re.MULTILINE)
else:
    content = content.rstrip('\n') + '\nADMIN_EMAIL=' + new_email + '\n'
with open(path, 'w') as f:
    f.write(content)
print('WRITE_DONE:true')
PYEOF
FIXSCRIPT

  echo ""
  echo "Restarting PM2 with --update-env..."
  "${SSH[@]}" bash -s << 'PM2SCRIPT'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent
pm2 restart guidex-production --update-env
echo "PM2_DONE:true"
PM2SCRIPT

  sleep 3

  # Verify the fix
  echo ""
  echo "Verifying ADMIN_EMAIL after fix..."
  VERIFY_OUT=$("${SSH[@]}" "grep '^ADMIN_EMAIL=' '$ENV_FILE'")
  echo "After fix: [$VERIFY_OUT]"
else
  echo ""
  echo "Restarting PM2 with --update-env (to ensure env is loaded fresh)..."
  "${SSH[@]}" bash -s << 'PM2SCRIPT'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent
pm2 restart guidex-production --update-env
echo "PM2_DONE:true"
PM2SCRIPT
  sleep 3
fi

# Verify login endpoint
HTTP=$(curl -sk -o /dev/null -w "%{http_code}" "$LOGIN_URL")
echo ""
echo "=== Final ==="
echo "/admin/login HTTP: $HTTP"
echo ""
echo "Use this exact email in the browser login form:"
echo "  $CORRECT_EMAIL"
echo ""
echo "Open in INCOGNITO: $LOGIN_URL"

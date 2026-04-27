#!/usr/bin/env bash
# Reset the admin email and/or password for the Cloudways production deployment.
#
# Run this from your macOS Terminal (not Claude Code):
#   ./scripts/reset-admin-credentials.sh
#
# What it does:
#   1. SSHs to the server and backs up .env.local
#   2. Shows current ADMIN_EMAIL
#   3. Lets you change email (press Enter to keep current)
#   4. Prompts for a new password (hidden input, never printed)
#   5. Generates a bcryptjs hash locally
#   6. Uploads only the changed fields to the server .env.local
#   7. Restarts PM2
#   8. Verifies /admin/login responds

set -euo pipefail

SSH_USER="master_udndspcyhr"
SERVER="157.245.207.99"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
APP="/home/master/applications/dgcmdxxpjx/public_html"
ENV_FILE="$APP/.env.local"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Use ControlMaster socket if available, otherwise direct SSH
if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH_CMD="ssh -S $SOCKET $SSH_USER@$SERVER"
  RSYNC_SSH="ssh -S $SOCKET"
  echo "Using existing ControlMaster socket."
else
  SSH_CMD="ssh $SSH_USER@$SERVER"
  RSYNC_SSH="ssh"
  echo "No ControlMaster socket — will prompt for SSH password as needed."
fi

echo ""
echo "=== Guidex Admin Credential Reset ==="
echo ""

# Step 1: Back up .env.local on server
TS=$(date +%Y%m%d-%H%M%S)
echo "Step 1/6: Backing up server .env.local..."
$SSH_CMD "cp \"$ENV_FILE\" \"${ENV_FILE}.backup-${TS}\" && echo '  Backup: ${ENV_FILE}.backup-${TS}'"

# Step 2: Show current email
echo ""
echo "Step 2/6: Current admin credentials:"
CURRENT_EMAIL=$($SSH_CMD "grep '^ADMIN_EMAIL=' \"$ENV_FILE\" | cut -d= -f2")
echo "  ADMIN_EMAIL: $CURRENT_EMAIL"

# Step 3: Optionally change email
echo ""
echo -n "New ADMIN_EMAIL (press Enter to keep '$CURRENT_EMAIL'): "
read NEW_EMAIL
if [ -z "$NEW_EMAIL" ]; then
  NEW_EMAIL="$CURRENT_EMAIL"
  echo "  Keeping: $CURRENT_EMAIL"
else
  echo "  Using:   $NEW_EMAIL"
fi

# Step 4: Prompt for new password (hidden)
echo ""
while true; do
  echo -n "New admin password (input hidden): "
  read -s NEW_PASSWORD
  echo ""
  if [ -z "$NEW_PASSWORD" ]; then
    echo "  Password cannot be empty. Try again."
    continue
  fi
  echo -n "Confirm password: "
  read -s CONFIRM_PASSWORD
  echo ""
  if [ "$NEW_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
    echo "  Passwords do not match. Try again."
    continue
  fi
  break
done

# Step 5: Generate bcrypt hash locally using project's bcryptjs
echo ""
echo "Step 3/6: Generating bcrypt hash..."
TMPFILE=$(mktemp)
chmod 600 "$TMPFILE"
printf '%s' "$NEW_PASSWORD" > "$TMPFILE"
unset NEW_PASSWORD
unset CONFIRM_PASSWORD

HASH=$(node -e "
const bcrypt = require('${PROJECT_DIR}/node_modules/bcryptjs');
const fs    = require('fs');
const pwd   = fs.readFileSync('${TMPFILE}', 'utf8');
process.stdout.write(bcrypt.hashSync(pwd, 10));
")
rm -f "$TMPFILE"

if [ -z "$HASH" ]; then
  echo "Error: hash generation failed."
  exit 1
fi
echo "  Hash generated."

# Escape $ for dotenv-expand (bcrypt hashes contain $2b$10$...)
ESCAPED_HASH=$(printf '%s' "$HASH" | sed 's/\$/\\$/g')
unset HASH

# Step 6: Update .env.local on server using Python (handles special chars reliably)
echo ""
echo "Step 4/6: Updating server .env.local..."
$SSH_CMD "python3 - \"$ENV_FILE\" \"$NEW_EMAIL\" \"$ESCAPED_HASH\"" << 'PYEOF'
import sys, re

env_path   = sys.argv[1]
new_email  = sys.argv[2]
new_hash   = sys.argv[3]

with open(env_path) as f:
    content = f.read()

content = re.sub(r'^ADMIN_EMAIL=.*', f'ADMIN_EMAIL={new_email}', content, flags=re.MULTILINE)
content = re.sub(r'^ADMIN_PASSWORD_HASH=.*', f'ADMIN_PASSWORD_HASH={new_hash}', content, flags=re.MULTILINE)

with open(env_path, 'w') as f:
    f.write(content)

print('  .env.local updated.')
PYEOF

# Step 7: Restart PM2
echo ""
echo "Step 5/6: Restarting PM2..."
$SSH_CMD '
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm use 20 --silent
  pm2 restart guidex-production && echo "  PM2 restarted."
'

# Step 8: Verify /admin/login
echo ""
echo "Step 6/6: Verifying /admin/login..."
sleep 3
HTTP=$(curl -sk -o /dev/null -w "%{http_code}" "https://phpstack-1618074-6379172.cloudwaysapps.com/admin/login")
echo "  /admin/login → HTTP $HTTP"

echo ""
echo "=== Done ==="
echo "  ADMIN_EMAIL: $NEW_EMAIL"
echo "  Password:    updated (hash written to server)"
echo "  PM2:         restarted"
echo "  Login URL:   https://phpstack-1618074-6379172.cloudwaysapps.com/admin/login"

if [ "$HTTP" = "200" ]; then
  echo "  Status:      ✅ /admin/login responding"
else
  echo "  Status:      ⚠️  /admin/login returned HTTP $HTTP — check PM2 logs"
fi

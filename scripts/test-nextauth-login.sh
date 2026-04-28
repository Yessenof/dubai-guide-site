#!/usr/bin/env bash
# Test the live NextAuth credentials callback without a browser.
# Run from macOS Terminal:
#   ./scripts/test-nextauth-login.sh

set -uo pipefail

BASE_URL="https://phpstack-1618074-6379172.cloudwaysapps.com"
EMAIL="zhanbatyresenov@gmail.com"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
SSH_USER="master_asumzwhebx"
SERVER="165.245.187.15"
COOKIE_JAR=$(mktemp)
trap 'rm -f "$COOKIE_JAR"' EXIT

echo ""
echo "=== NextAuth Credentials Login Test ==="
echo "Base URL: $BASE_URL"
echo "Email:    $EMAIL"
echo ""

# ── Prompt for password (hidden) ──────────────────────────────────────────────
echo -n "Admin password (hidden): "
read -s PW
echo ""
if [ -z "${PW:-}" ]; then echo "Password cannot be empty."; exit 1; fi

# ── A. Confirm field names from code ──────────────────────────────────────────
echo ""
echo "A. CredentialsProvider expected field names (from lib/auth.ts):"
echo "   email    → \"email\""
echo "   password → \"password\""
echo "   (confirmed — no mismatch)"

# ── B. Fetch CSRF token ────────────────────────────────────────────────────────
echo ""
echo "B. Fetching CSRF token from /api/auth/csrf ..."
CSRF_RESPONSE=$(curl -sk -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -H "Accept: application/json" \
  -w "\nHTTP_STATUS:%{http_code}" \
  "$BASE_URL/api/auth/csrf")

CSRF_HTTP=$(printf '%s\n' "$CSRF_RESPONSE" | grep '^HTTP_STATUS:' | cut -d: -f2)
CSRF_BODY=$(printf '%s\n' "$CSRF_RESPONSE" | grep -v '^HTTP_STATUS:')
CSRF_TOKEN=$(printf '%s' "$CSRF_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('csrfToken',''))" 2>/dev/null || true)

echo "   HTTP status: $CSRF_HTTP"
if [ -n "$CSRF_TOKEN" ]; then
  echo "   csrfToken obtained: yes (${#CSRF_TOKEN} chars)"
else
  echo "   csrfToken: NOT FOUND in response"
  echo "   Raw response: $CSRF_BODY"
  echo ""
  echo "Cannot proceed without csrfToken. Check if /api/auth/csrf is reachable."
  exit 1
fi

# ── C. POST credentials callback ──────────────────────────────────────────────
echo ""
echo "C. POSTing to /api/auth/callback/credentials ..."
CB_RESPONSE=$(curl -sk -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  --data-urlencode "csrfToken=$CSRF_TOKEN" \
  --data-urlencode "email=$EMAIL" \
  --data-urlencode "password=$PW" \
  --data-urlencode "redirect=false" \
  --data-urlencode "callbackUrl=$BASE_URL/admin/guides" \
  --data-urlencode "json=true" \
  -w "\nHTTP_STATUS:%{http_code}" \
  "$BASE_URL/api/auth/callback/credentials")

unset PW

CB_HTTP=$(printf '%s\n' "$CB_RESPONSE" | grep '^HTTP_STATUS:' | cut -d: -f2)
CB_BODY=$(printf '%s\n' "$CB_RESPONSE" | grep -v '^HTTP_STATUS:')

echo "   HTTP status: $CB_HTTP"

# Sanitize: extract ok, url, error — never print cookie values or token values
CB_OK=$(printf '%s' "$CB_BODY" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print('ok:'    + str(d.get('ok', 'not_present')))
    print('url:'   + str(d.get('url', 'not_present')))
    print('error:' + str(d.get('error', 'none')))
except Exception as e:
    print('parse_error:' + str(e))
    print('raw_len:' + str(len(sys.stdin.read()) if hasattr(sys.stdin, 'read') else '?'))
" 2>/dev/null <<< "$CB_BODY" || true)

echo ""
echo "D. Sanitized callback result:"
printf '%s\n' "$CB_OK" | while IFS= read -r line; do echo "   $line"; done
echo "   raw_body_len: ${#CB_BODY} chars"

# ── E. PM2 logs ───────────────────────────────────────────────────────────────
echo ""
echo "E. Fetching PM2 logs for auth errors..."

if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH=( ssh -S "$SOCKET" "$SSH_USER@$SERVER" )
  echo "   (using ControlMaster socket)"
else
  SSH=( ssh "$SSH_USER@$SERVER" )
  echo "   (no ControlMaster — SSH may prompt for password)"
fi

PM2_OUT=$("${SSH[@]}" bash -s << 'PM2SCRIPT'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent 2>/dev/null
pm2 logs guidex-production --lines 80 --nostream 2>&1 | \
  grep -v 'NEXTAUTH_SECRET\|ADMIN_PASSWORD\|password\|token' | \
  grep -i 'auth\|error\|warn\|credential\|ADMIN_EMAIL\|authorize\|ENV\|env\|hash\|bcrypt\|invalid\|null' | \
  tail -40
PM2SCRIPT
)

if [ -n "$PM2_OUT" ]; then
  echo "   Relevant PM2 log lines:"
  printf '%s\n' "$PM2_OUT" | while IFS= read -r line; do echo "   $line"; done
else
  echo "   No matching auth/error lines in last 80 PM2 log lines."
fi

# ── F. Diagnosis ──────────────────────────────────────────────────────────────
echo ""
echo "=== F. Diagnosis ==="

CB_OK_VAL=$(printf '%s\n' "$CB_OK" | grep '^ok:' | cut -d: -f2)
CB_ERR_VAL=$(printf '%s\n' "$CB_OK" | grep '^error:' | cut -d: -f2-)

if [ "$CB_OK_VAL" = "True" ] || [ "$CB_OK_VAL" = "true" ]; then
  echo "✅ Credentials callback: SUCCESS (ok=true)"
  echo ""
  echo "   The API accepted your credentials. The issue is browser-side only."
  echo "   → Open in a FRESH INCOGNITO tab (Cmd+Shift+N in Chrome/Safari)"
  echo "   → Clear all autofill / saved passwords for this domain first"
  echo "   → Do NOT let password manager fill the form"
  echo ""
  echo "   Login URL: $BASE_URL/admin/login"
elif [ "$CB_HTTP" = "302" ] || [ "$CB_HTTP" = "200" ]; then
  echo "⚠️  Callback returned HTTP $CB_HTTP but ok is not clearly true."
  echo "   This may mean redirect happened (302) which is normal for successful auth."
  echo "   Check if Location header points to /admin/guides or error page."
  echo "   → Try fresh incognito login now."
else
  echo "❌ Credentials callback failed."
  echo "   HTTP: $CB_HTTP"
  echo "   error: $CB_ERR_VAL"
  echo ""
  echo "Likely causes:"
  echo "  1. ADMIN_EMAIL or ADMIN_PASSWORD_HASH not loaded in Next.js runtime"
  echo "     → process.env inside Next.js may differ from shell environment"
  echo "     → NEXTAUTH_URL mismatch may cause callback URL rejection"
  echo "  2. NEXTAUTH_SECRET missing or wrong — JWT sign/verify fails silently"
  echo "  3. authorize() returns null → check PM2 logs above for null returns"
  echo ""
  echo "Next step: read NEXTAUTH_URL from server .env.local (not secret)"
  echo "  It must equal: $BASE_URL"
fi

#!/usr/bin/env bash
# Debug and fix Guidex admin auth on Cloudways.
#
# Run in your macOS Terminal (NOT Claude Code — needs interactive password input):
#   cd /Users/batyr/Desktop/dubai-guide-site
#   ./scripts/debug-admin-auth.sh
#
# ── Escaping design ────────────────────────────────────────────────────────────
# The outer SSH heredoc is SINGLE-QUOTED (<< 'SERVERSCRIPT').
# The local shell therefore does NOT process ANY of its content.
# B64PW is injected via the SSH command itself: ssh ... "B64PW='...' bash -s"
# This means $B64PW expands locally (safe: base64 = A-Za-z0-9+/= only),
# and everything inside the heredoc runs literally on the remote.
#
# All JS files use String.fromCharCode(92) for backslash and
# String.fromCharCode(36) for dollar sign — zero backslash literals in JS.
# Each generated JS file is validated with 'node --check' before execution.

set -uo pipefail

SSH_USER="master_udndspcyhr"
SERVER="157.245.207.99"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
LOGIN_URL="https://phpstack-1618074-6379172.cloudwaysapps.com/admin/login"

# ── SSH command array ──────────────────────────────────────────────────────────
if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH=( ssh -S "$SOCKET" "$SSH_USER@$SERVER" )
  echo "Using existing ControlMaster socket."
else
  SSH=( ssh "$SSH_USER@$SERVER" )
  echo "No ControlMaster socket — SSH will prompt for password once."
fi

echo ""
echo "=== Guidex Admin Auth Debugger ==="
echo ""

# ── Read password locally (hidden, never logged) ───────────────────────────────
echo -n "Admin password to test (hidden): "
read -s PW
echo ""
if [ -z "${PW:-}" ]; then echo "Password cannot be empty."; exit 1; fi
B64PW=$(printf '%s' "$PW" | base64)
unset PW

# ── All server work in one SSH session ────────────────────────────────────────
# SINGLE-QUOTED outer heredoc: local shell reads content literally, no expansion.
# B64PW is set on the remote via: "B64PW='<base64>' bash -s"

echo "Connecting to server..."
SERVER_OUT=$("${SSH[@]}" "B64PW='$B64PW' bash -s" << 'SERVERSCRIPT'
set -uo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent

echo "NODE_VER:$(node -v)"
echo "NODE_BIN:$(which node)"

# Hardcoded — these never change on this server
ENV_FILE="/home/master/applications/dgcmdxxpjx/public_html/.env.local"
APP_PATH="/home/master/applications/dgcmdxxpjx/public_html"

# ── g_inspect.js ──────────────────────────────────────────────────────────────
# Reads .env.local, simulates dotenv-expand, reports safe fields only.
# No backslash literals: backslash = String.fromCharCode(92)
#                        dollar    = String.fromCharCode(36)
cat > /tmp/g_inspect.js << 'JSEOF'
'use strict';
var fs      = require('fs');
var envFile = process.argv[2];
var raw     = fs.readFileSync(envFile, 'utf8');
var env     = {};

for (var line of raw.split('\n')) {
  var eq = line.indexOf('=');
  if (eq < 0 || line.trimStart()[0] === '#') continue;
  env[line.slice(0, eq).trim()] = line.slice(eq + 1);
}

var BS     = String.fromCharCode(92);   // \
var DOLLAR = String.fromCharCode(36);   // $

var rawHash = env['ADMIN_PASSWORD_HASH'] || '';

// Simulate dotenv-expand: replace \$ with $
var loaded = rawHash.split(BS + DOLLAR).join(DOLLAR);

var email   = (env['ADMIN_EMAIL'] || '').trim();

// Bcrypt format: $2b$, $2a$, or $2y$ followed by cost factor
var validFmt = loaded.startsWith(DOLLAR + '2b' + DOLLAR) ||
               loaded.startsWith(DOLLAR + '2a' + DOLLAR) ||
               loaded.startsWith(DOLLAR + '2y' + DOLLAR);

console.log('EMAIL:'            + email);
console.log('HASH_RAW_LEN:'    + rawHash.length);
console.log('HASH_LOADED_LEN:' + loaded.length);
console.log('HASH_VALID:'      + validFmt);
console.log('HASH_PREFIX:'     + loaded.slice(0, 7));
JSEOF

node --check /tmp/g_inspect.js || { echo "SYNTAX_ERR:g_inspect.js"; cat -n /tmp/g_inspect.js; exit 1; }
node /tmp/g_inspect.js "$ENV_FILE"

# ── g_compare.js ──────────────────────────────────────────────────────────────
# Compares the hidden password (passed as base64 argv) with the loaded hash.
cat > /tmp/g_compare.js << 'JSEOF'
'use strict';
var fs      = require('fs');
var bcrypt  = require(process.argv[2] + '/node_modules/bcryptjs');
var envFile = process.argv[3];
var b64pw   = process.argv[4];

var BS     = String.fromCharCode(92);
var DOLLAR = String.fromCharCode(36);

var raw = fs.readFileSync(envFile, 'utf8');
var env = {};
for (var line of raw.split('\n')) {
  var eq = line.indexOf('=');
  if (eq < 0 || line.trimStart()[0] === '#') continue;
  env[line.slice(0, eq).trim()] = line.slice(eq + 1);
}

var rawHash = env['ADMIN_PASSWORD_HASH'] || '';
var hash    = rawHash.split(BS + DOLLAR).join(DOLLAR);
var pwd     = Buffer.from(b64pw, 'base64').toString('utf8');

var validFmt = hash.startsWith(DOLLAR + '2b' + DOLLAR) ||
               hash.startsWith(DOLLAR + '2a' + DOLLAR) ||
               hash.startsWith(DOLLAR + '2y' + DOLLAR);

var match = validFmt ? bcrypt.compareSync(pwd, hash) : false;

console.log('CMP_VALID:' + validFmt);
console.log('CMP_MATCH:' + match);
JSEOF

node --check /tmp/g_compare.js || { echo "SYNTAX_ERR:g_compare.js"; cat -n /tmp/g_compare.js; exit 1; }
CMP_OUT=$(node /tmp/g_compare.js "$APP_PATH" "$ENV_FILE" "$B64PW")
echo "$CMP_OUT"

CMP_MATCH=$(printf '%s\n' "$CMP_OUT" | grep '^CMP_MATCH:' | cut -d: -f2)

# ── g_fix.js (only if compare failed) ─────────────────────────────────────────
if [ "$CMP_MATCH" = "false" ]; then
  echo "FIX_NEEDED:true"

  cat > /tmp/g_fix.js << 'JSEOF'
'use strict';
var fs      = require('fs');
var bcrypt  = require(process.argv[2] + '/node_modules/bcryptjs');
var envFile = process.argv[3];
var b64pw   = process.argv[4];

var BS     = String.fromCharCode(92);
var DOLLAR = String.fromCharCode(36);

var pwd      = Buffer.from(b64pw, 'base64').toString('utf8');
var newHash  = bcrypt.hashSync(pwd, 10);

// Escape: replace $ with \$ so dotenv-expand loads it correctly
var escaped  = newHash.split(DOLLAR).join(BS + DOLLAR);

var content  = fs.readFileSync(envFile, 'utf8');
var updated  = content.split('\n').map(function(line) {
  return line.startsWith('ADMIN_PASSWORD_HASH=')
    ? 'ADMIN_PASSWORD_HASH=' + escaped
    : line;
}).join('\n');

fs.writeFileSync(envFile, updated, 'utf8');

console.log('FIX_DONE:true');
console.log('FIX_HASH_PREFIX:' + newHash.slice(0, 7));
JSEOF

  node --check /tmp/g_fix.js || { echo "SYNTAX_ERR:g_fix.js"; cat -n /tmp/g_fix.js; exit 1; }
  node /tmp/g_fix.js "$APP_PATH" "$ENV_FILE" "$B64PW"

  # Verify the fix worked
  VFY_OUT=$(node /tmp/g_compare.js "$APP_PATH" "$ENV_FILE" "$B64PW")
  VFY_MATCH=$(printf '%s\n' "$VFY_OUT" | grep '^CMP_MATCH:' | cut -d: -f2)
  echo "FIX_VERIFY:$VFY_MATCH"
else
  echo "FIX_NEEDED:false"
fi

# Cleanup
rm -f /tmp/g_inspect.js /tmp/g_compare.js /tmp/g_fix.js 2>/dev/null || true
SERVERSCRIPT
)

echo ""
echo "--- Server output ---"
echo "$SERVER_OUT"
echo "---------------------"

# ── Parse results ──────────────────────────────────────────────────────────────
_get() { printf '%s\n' "$SERVER_OUT" | grep "^$1:" | head -1 | cut -d: -f2-; }

NODE_VER=$(_get NODE_VER)
EMAIL=$(_get EMAIL)
HASH_VALID=$(_get HASH_VALID)
CMP_MATCH=$(_get CMP_MATCH)
FIX_NEEDED=$(_get FIX_NEEDED)
FIX_VERIFY=$(_get FIX_VERIFY)

# Check for syntax errors in the server run
if printf '%s\n' "$SERVER_OUT" | grep -q '^SYNTAX_ERR:'; then
  echo ""
  echo "❌ A generated JS file failed node --check. See line numbers above."
  echo "   No changes were made. Please report the error."
  exit 1
fi

# ── Restart PM2 ────────────────────────────────────────────────────────────────
echo ""
echo "Restarting PM2..."
"${SSH[@]}" 'bash -s' << 'PM2SCRIPT'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent
pm2 restart guidex-production
echo "PM2_DONE:true"
PM2SCRIPT

sleep 3

# ── Verify /admin/login ────────────────────────────────────────────────────────
HTTP=$(curl -sk -o /dev/null -w "%{http_code}" "$LOGIN_URL")

# ── Final report ───────────────────────────────────────────────────────────────
echo ""
echo "=== Results ==="
echo "A. Node version:         $NODE_VER"
echo "B. ADMIN_EMAIL:          $EMAIL"
echo "C. Hash format valid:    $HASH_VALID"
echo "D. bcrypt compare:       $CMP_MATCH"
echo "E. Fix applied:          ${FIX_NEEDED:-unknown}"
if [ "${FIX_NEEDED:-false}" = "true" ]; then
  echo "   Post-fix compare:    ${FIX_VERIFY:-unknown}"
fi
echo "F. .env.local changed:   ${FIX_NEEDED:-unknown}"
echo "G. PM2:                  restarted"
echo "H. /admin/login HTTP:    $HTTP"
echo ""

if [ "${FIX_NEEDED:-false}" = "true" ] && [ "${FIX_VERIFY:-false}" = "true" ]; then
  echo "✅ Hash was corrupted — fixed and verified. Try login now in incognito."
elif [ "${CMP_MATCH:-false}" = "true" ]; then
  echo "✅ Hash already matched. If login still fails — test in incognito window."
  echo "   Also verify ADMIN_EMAIL above matches exactly what you type in the form."
else
  echo "⚠️  Unexpected state. Check .env.local on the server manually."
fi

echo ""
echo "Browser test → open in INCOGNITO: $LOGIN_URL"

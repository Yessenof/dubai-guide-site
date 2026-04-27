#!/usr/bin/env bash
# Diagnose and fix production runtime env loading for NextAuth.
#
# Run from macOS Terminal (needs interactive input):
#   cd /Users/batyr/Desktop/dubai-guide-site
#   ./scripts/runtime-env-diag.sh
#
# What it does:
#   1. Uses @next/env loadEnvConfig on the server — exactly how Next.js loads env
#   2. Tests 4 hash variants (file raw, file unescaped, runtime, runtime unescaped)
#   3. If runtime hash is corrupted (dotenv-expand ate bare $ signs), re-escapes it
#   4. Verifies fix with loadEnvConfig before restarting PM2
#   5. Re-tests NextAuth credentials callback via curl

set -uo pipefail

SSH_USER="master_udndspcyhr"
SERVER="157.245.207.99"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
APP="/home/master/applications/dgcmdxxpjx/public_html"
BASE_URL="https://phpstack-1618074-6379172.cloudwaysapps.com"
EMAIL="zhanbatyresenov@gmail.com"

if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH=( ssh -S "$SOCKET" "$SSH_USER@$SERVER" )
  echo "Using existing ControlMaster socket."
else
  SSH=( ssh "$SSH_USER@$SERVER" )
  echo "No ControlMaster socket — SSH will prompt for password."
fi

echo ""
echo "=== Runtime Env Diagnostic ==="
echo ""

echo -n "Admin password (hidden): "
read -s PW
echo ""
if [ -z "${PW:-}" ]; then echo "Password cannot be empty."; exit 1; fi
B64PW=$(printf '%s' "$PW" | base64)
unset PW

echo "Connecting to server..."
echo ""

SERVER_OUT=$("${SSH[@]}" "B64PW='$B64PW' bash -s" << 'SERVERSCRIPT'
set -uo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent

APP="/home/master/applications/dgcmdxxpjx/public_html"
ENV_FILE="$APP/.env.local"

# ── Diagnostic JS ────────────────────────────────────────────────────────────
# No backslash literals in JS. All special chars via String.fromCharCode.
# BS=92 (\), DOLLAR=36 ($)

cat > /tmp/g_rdiag.js << 'JSEOF'
'use strict';
var fs     = require('fs');
var path   = require('path');
var bcrypt = require(process.argv[2] + '/node_modules/bcryptjs');

var DOLLAR = String.fromCharCode(36);
var BS     = String.fromCharCode(92);

// ── Read password from base64 arg ────────────────────────────────────────────
var b64pw = process.argv[3];
var pwd   = Buffer.from(b64pw, 'base64').toString('utf8');

// ── Load via @next/env — exactly as Next.js production runtime does ──────────
var runtimeHash  = null;
var runtimeEmail = null;
var runtimeUrl   = null;

try {
  var nextEnvMod = require(process.argv[2] + '/node_modules/@next/env');
  var loadEnvConfig = nextEnvMod.loadEnvConfig;

  // Clear these keys first so we are not reading inherited shell env
  delete process.env['ADMIN_PASSWORD_HASH'];
  delete process.env['ADMIN_EMAIL'];
  delete process.env['NEXTAUTH_URL'];
  delete process.env['NEXTAUTH_SECRET'];

  loadEnvConfig(process.argv[2], false);

  runtimeHash  = process.env['ADMIN_PASSWORD_HASH']  !== undefined ? process.env['ADMIN_PASSWORD_HASH']  : null;
  runtimeEmail = process.env['ADMIN_EMAIL']           !== undefined ? process.env['ADMIN_EMAIL']           : null;
  runtimeUrl   = process.env['NEXTAUTH_URL']          !== undefined ? process.env['NEXTAUTH_URL']          : null;

  console.log('NEXT_ENV_LOAD:ok');
} catch (e) {
  console.log('NEXT_ENV_LOAD:error:' + e.message);
}

// ── Read .env.local manually ─────────────────────────────────────────────────
var raw     = fs.readFileSync(process.argv[4], 'utf8');
var fileEnv = {};
for (var line of raw.split('\n')) {
  var eq = line.indexOf('=');
  if (eq < 0 || line.trimStart()[0] === '#') continue;
  fileEnv[line.slice(0, eq).trim()] = line.slice(eq + 1).replace(/\r$/, '');
}

var fileHash  = fileEnv['ADMIN_PASSWORD_HASH'] || '';
var fileHashU = fileHash.split(BS + DOLLAR).join(DOLLAR);   // simulate dotenv-expand: \$ → $

// ── Analyse a hash variant ────────────────────────────────────────────────────
function analyse(label, hash) {
  if (hash === null) {
    console.log('VARIANT:' + label + ':len=null:starts2=false:hasBS=false:valid=false:match=false');
    return;
  }
  var hasBS   = hash.indexOf(BS) >= 0;
  var starts2 = hash.startsWith(DOLLAR + '2');
  var len     = hash.length;
  var isValid = starts2 && len >= 59;
  var match   = false;
  if (isValid) {
    try { match = bcrypt.compareSync(pwd, hash); } catch (e) { match = false; }
  }
  console.log('VARIANT:' + label
    + ':len='     + len
    + ':starts2=' + starts2
    + ':hasBS='   + hasBS
    + ':valid='   + isValid
    + ':match='   + match);
}

analyse('FILE_RAW',   fileHash);
analyse('FILE_UNESC', fileHashU);

if (runtimeHash !== null) {
  var runtimeHashU = runtimeHash.split(BS + DOLLAR).join(DOLLAR);
  analyse('RUNTIME',       runtimeHash);
  analyse('RUNTIME_UNESC', runtimeHashU);
} else {
  analyse('RUNTIME',       null);
  analyse('RUNTIME_UNESC', null);
}

// ── Email ────────────────────────────────────────────────────────────────────
var fileEmail = fileEnv['ADMIN_EMAIL'] || '';
console.log('FILE_EMAIL:'    + fileEmail);
console.log('RUNTIME_EMAIL:' + (runtimeEmail !== null ? runtimeEmail : '(not loaded)'));

// ── NEXTAUTH_URL ─────────────────────────────────────────────────────────────
var fileUrl = fileEnv['NEXTAUTH_URL'] || '';
console.log('FILE_NEXTAUTH_URL:'    + fileUrl);
console.log('RUNTIME_NEXTAUTH_URL:' + (runtimeUrl !== null ? runtimeUrl : '(not loaded)'));
JSEOF

node --check /tmp/g_rdiag.js || { echo 'SYNTAX_ERR:g_rdiag.js'; cat -n /tmp/g_rdiag.js; exit 1; }
node /tmp/g_rdiag.js "$APP" "$B64PW" "$ENV_FILE"
rm -f /tmp/g_rdiag.js
SERVERSCRIPT
)

echo "--- Diagnostic output ---"
echo "$SERVER_OUT"
echo "-------------------------"
echo ""

_get() { printf '%s\n' "$SERVER_OUT" | grep "^$1:" | head -1 | cut -d: -f2-; }
_var() {
  local key="$1" field="$2"
  printf '%s\n' "$SERVER_OUT" | grep "^VARIANT:${key}:" | head -1 \
    | sed 's/.*'"${field}"'=\([^:]*\).*/\1/'
}

NEXT_ENV_LOAD=$(_get NEXT_ENV_LOAD)
FILE_EMAIL=$(_get FILE_EMAIL)
RUNTIME_EMAIL=$(_get RUNTIME_EMAIL)
FILE_URL=$(_get FILE_NEXTAUTH_URL)
RUNTIME_URL=$(_get RUNTIME_NEXTAUTH_URL)

if printf '%s\n' "$SERVER_OUT" | grep -q '^SYNTAX_ERR:'; then
  echo "❌ JS syntax error in diagnostic script. No changes made."
  exit 1
fi

echo "=== A. lib/auth.ts authorize() summary ==="
echo "  - Reads ADMIN_EMAIL from process.env"
echo "  - Reads ADMIN_PASSWORD_HASH from process.env"
echo "  - Compares email with ===, no trim/lowercase"
echo "  - Calls bcryptjs.compare(credentials.password, hash)"
echo "  - Returns null on any failure"
echo ""

echo "=== B. NEXTAUTH_URL ==="
echo "  File:    [$FILE_URL]"
echo "  Runtime: [$RUNTIME_URL]"
EXPECTED_URL="https://phpstack-1618074-6379172.cloudwaysapps.com"
if [ "$RUNTIME_URL" = "$EXPECTED_URL" ]; then
  echo "  Status:  ✅ matches expected"
elif [ -z "$RUNTIME_URL" ] || [ "$RUNTIME_URL" = "(not loaded)" ]; then
  echo "  Status:  ⚠️  not loaded in runtime"
else
  echo "  Status:  ⚠️  MISMATCH — expected $EXPECTED_URL"
fi
echo ""

echo "=== C. Hash variant comparison ==="
printf "  %-20s %-6s %-8s %-6s %-6s %s\n" "Variant" "Len" "Starts\$2" "HasBS" "Valid" "Match"
printf "  %-20s %-6s %-8s %-6s %-6s %s\n" "-------" "---" "---------" "-----" "-----" "-----"
for VARKEY in FILE_RAW FILE_UNESC RUNTIME RUNTIME_UNESC; do
  LEN=$(_var "$VARKEY" "len")
  S2=$(_var  "$VARKEY" "starts2")
  BS=$(_var  "$VARKEY" "hasBS")
  VL=$(_var  "$VARKEY" "valid")
  MT=$(_var  "$VARKEY" "match")
  printf "  %-20s %-6s %-8s %-6s %-6s %s\n" "$VARKEY" "$LEN" "$S2" "$BS" "$VL" "$MT"
done
echo ""

# ── Determine root cause ───────────────────────────────────────────────────────
FILE_RAW_MATCH=$(_var    "FILE_RAW"      "match")
FILE_UNESC_MATCH=$(_var  "FILE_UNESC"    "match")
RUNTIME_MATCH=$(_var     "RUNTIME"       "match")
RT_UNESC_MATCH=$(_var    "RUNTIME_UNESC" "match")

echo "=== D. Root cause ==="

FIX_NEEDED="false"
FIX_TYPE=""

if [ "$RUNTIME_MATCH" = "true" ]; then
  echo "  ✅ RUNTIME hash matches password — authorize() should succeed."
  echo "  The 401 is NOT caused by a bad hash."
  echo "  Possible remaining causes:"
  echo "    - CSRF token mismatch (cookie/body mismatch in the curl test)"
  echo "    - NEXTAUTH_SECRET missing → JWT fails"
  echo "    - Cloudways Nginx/Apache layer returning 401 before Next.js"
  echo "  → Try fresh incognito browser login now."
elif [ "$FILE_RAW_MATCH" = "true" ] && [ "$RUNTIME_MATCH" = "false" ]; then
  echo "  ❌ Root cause: dotenv-expand is corrupting the hash."
  echo "     .env.local has bare \$ signs. dotenv-expand sees \$<letters> as"
  echo "     an env var reference and replaces it with empty string."
  echo "     Debug script read file directly (bypassed dotenv-expand) → true."
  echo "     Next.js runtime loads via dotenv-expand → hash corrupted → false."
  echo "  Fix: re-escape the hash in .env.local (\$ → \\\$)"
  FIX_NEEDED="true"
  FIX_TYPE="re-escape"
elif [ "$FILE_UNESC_MATCH" = "true" ] && [ "$RUNTIME_MATCH" = "false" ]; then
  echo "  ❌ Root cause: .env.local has \\\$ escaped hash, but runtime is"
  echo "     NOT converting \\\$ → \$ correctly, leaving backslashes in hash."
  echo "  Fix: write hash with bare \$ (no backslash escaping)"
  FIX_NEEDED="true"
  FIX_TYPE="unescape"
elif [ "$RUNTIME_EMAIL" != "$FILE_EMAIL" ]; then
  echo "  ❌ Root cause: ADMIN_EMAIL differs between file and runtime."
  echo "     File:    [$FILE_EMAIL]"
  echo "     Runtime: [$RUNTIME_EMAIL]"
  FIX_NEEDED="false"
else
  echo "  ⚠️  All variants fail bcrypt compare. Hash may be wrong for this password."
  echo "     Run reset-admin-credentials.sh to set a fresh hash."
  FIX_NEEDED="false"
fi
echo ""

# ── Apply fix ─────────────────────────────────────────────────────────────────
if [ "$FIX_NEEDED" = "true" ]; then
  echo "=== E. Applying fix ==="

  TS=$(date +%Y%m%d-%H%M%S)

  FIX_OUT=$("${SSH[@]}" "B64PW='$B64PW' FIX_TYPE='$FIX_TYPE' bash -s" << 'FIXSCRIPT'
set -uo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent

APP="/home/master/applications/dgcmdxxpjx/public_html"
ENV_FILE="$APP/.env.local"

# Backup
TS=$(date +%Y%m%d-%H%M%S)
cp "$ENV_FILE" "${ENV_FILE}.backup-$TS"
echo "BACKUP:${ENV_FILE}.backup-${TS}"

cat > /tmp/g_fix_hash.js << 'JSEOF'
'use strict';
var fs     = require('fs');
var bcrypt = require(process.argv[2] + '/node_modules/bcryptjs');

var DOLLAR   = String.fromCharCode(36);
var BS       = String.fromCharCode(92);
var b64pw    = process.argv[3];
var fixType  = process.argv[4];
var envFile  = process.argv[5];

var raw = fs.readFileSync(envFile, 'utf8');
var fileEnv = {};
for (var line of raw.split('\n')) {
  var eq = line.indexOf('=');
  if (eq < 0 || line.trimStart()[0] === '#') continue;
  fileEnv[line.slice(0, eq).trim()] = line.slice(eq + 1).replace(/\r$/, '');
}

var fileHash = fileEnv['ADMIN_PASSWORD_HASH'] || '';

var newEnvHash;
if (fixType === 're-escape') {
  // File has bare $. Escape all $ → \$ so dotenv-expand restores correctly.
  newEnvHash = fileHash.split(DOLLAR).join(BS + DOLLAR);
} else {
  // fixType === 'unescape'
  // File has \$. Remove all backslashes before $ → bare $ (no expand)
  newEnvHash = fileHash.split(BS + DOLLAR).join(DOLLAR);
}

// Write updated file
var updated = raw.split('\n').map(function(line) {
  if (line.startsWith('ADMIN_PASSWORD_HASH=')) {
    return 'ADMIN_PASSWORD_HASH=' + newEnvHash;
  }
  return line;
}).join('\n');

fs.writeFileSync(envFile, updated, 'utf8');

// Verify: load with @next/env and check
var nextEnvMod   = require(process.argv[2] + '/node_modules/@next/env');
var loadEnvConfig = nextEnvMod.loadEnvConfig;
delete process.env['ADMIN_PASSWORD_HASH'];
loadEnvConfig(process.argv[2], false);

var runtimeHash = process.env['ADMIN_PASSWORD_HASH'] || '';
var starts2     = runtimeHash.startsWith(DOLLAR + '2');
var len         = runtimeHash.length;
var isValid     = starts2 && len >= 59;
var pwd         = Buffer.from(b64pw, 'base64').toString('utf8');
var match       = false;
if (isValid) {
  try { match = require(process.argv[2] + '/node_modules/bcryptjs').compareSync(pwd, runtimeHash); } catch(e) {}
}

console.log('POST_FIX_RUNTIME_STARTS2:' + starts2);
console.log('POST_FIX_RUNTIME_LEN:'     + len);
console.log('POST_FIX_RUNTIME_VALID:'   + isValid);
console.log('POST_FIX_RUNTIME_MATCH:'   + match);
JSEOF

node --check /tmp/g_fix_hash.js || { echo 'SYNTAX_ERR:g_fix_hash.js'; exit 1; }
node /tmp/g_fix_hash.js "$APP" "$B64PW" "$FIX_TYPE" "$ENV_FILE"
rm -f /tmp/g_fix_hash.js
FIXSCRIPT
  )

  echo "$FIX_OUT"
  echo ""

  POST_MATCH=$(printf '%s\n' "$FIX_OUT" | grep '^POST_FIX_RUNTIME_MATCH:' | cut -d: -f2)

  if [ "$POST_MATCH" = "true" ]; then
    echo "  ✅ Post-fix verification: runtime hash now matches password."
  else
    echo "  ❌ Post-fix verification failed. Check FIX_OUT above."
    echo "     Manual investigation required."
    exit 1
  fi

  # ── Restart PM2 ─────────────────────────────────────────────────────────────
  echo ""
  echo "=== F. Restarting PM2 with --update-env ==="
  "${SSH[@]}" 'bash -s' << 'PM2SCRIPT'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent
pm2 restart guidex-production --update-env
echo "PM2_DONE:true"
PM2SCRIPT
  echo "  PM2 restarted."
  sleep 4

else
  echo "=== E. No .env.local change needed ==="
  echo "=== F. PM2: not restarted (no change) ==="
fi

# ── Re-test NextAuth callback ──────────────────────────────────────────────────
echo ""
echo "=== G. Re-testing NextAuth credentials callback ==="

COOKIE_JAR=$(mktemp)
trap 'rm -f "$COOKIE_JAR"' EXIT

CSRF_RESP=$(curl -sk -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
  -H "Accept: application/json" \
  -w "\nHTTP_STATUS:%{http_code}" \
  "$BASE_URL/api/auth/csrf")

CSRF_HTTP=$(printf '%s\n' "$CSRF_RESP" | grep '^HTTP_STATUS:' | cut -d: -f2)
CSRF_BODY=$(printf '%s\n' "$CSRF_RESP" | grep -v '^HTTP_STATUS:')
CSRF_TOKEN=$(printf '%s' "$CSRF_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('csrfToken',''))" 2>/dev/null || true)

echo "  CSRF fetch: HTTP $CSRF_HTTP"
if [ -z "$CSRF_TOKEN" ]; then
  echo "  ❌ No CSRF token received. Cannot proceed."
else
  echo "  csrfToken: obtained (${#CSRF_TOKEN} chars)"

  # Read password again since we unset PW
  echo ""
  echo -n "  Re-enter admin password to test callback (hidden): "
  read -s PW2
  echo ""

  CB_RESP=$(curl -sk -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Accept: application/json" \
    --data-urlencode "csrfToken=$CSRF_TOKEN" \
    --data-urlencode "email=$EMAIL" \
    --data-urlencode "password=$PW2" \
    --data-urlencode "redirect=false" \
    --data-urlencode "callbackUrl=$BASE_URL/admin/guides" \
    --data-urlencode "json=true" \
    -w "\nHTTP_STATUS:%{http_code}" \
    "$BASE_URL/api/auth/callback/credentials")
  unset PW2

  CB_HTTP=$(printf '%s\n' "$CB_RESP" | grep '^HTTP_STATUS:' | cut -d: -f2)
  CB_BODY=$(printf '%s\n' "$CB_RESP" | grep -v '^HTTP_STATUS:')

  CB_PARSED=$(printf '%s' "$CB_BODY" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print('ok:'    + str(d.get('ok', 'n/a')))
    print('error:' + str(d.get('error', 'none')))
    url = d.get('url','')
    if url: print('url_contains_admin:' + str('admin' in url))
except Exception as e:
    print('parse_error:' + str(e))
" 2>/dev/null <<< "$CB_BODY" || true)

  echo "  Callback HTTP: $CB_HTTP"
  printf '%s\n' "$CB_PARSED" | while IFS= read -r line; do echo "    $line"; done

  CB_OK=$(printf '%s\n' "$CB_PARSED" | grep '^ok:' | cut -d: -f2)
  if [ "$CB_OK" = "True" ] || [ "$CB_OK" = "true" ]; then
    echo ""
    echo "  ✅ Credentials callback succeeded."
  else
    echo ""
    echo "  ❌ Callback still failing — see error above."
    if [ "$CB_HTTP" = "401" ]; then
      echo "     HTTP 401 = CSRF token rejected."
      echo "     Possible cause: NEXTAUTH_SECRET not set or PM2 restart changed secret."
      echo "     Check: is NEXTAUTH_SECRET present in .env.local?"
    fi
  fi
fi

echo ""
echo "=== H. Browser login instruction ==="
echo "  1. Open Chrome/Safari in a FRESH INCOGNITO window (Cmd+Shift+N)"
echo "  2. Go to: $BASE_URL/admin/login"
echo "  3. Email:    $EMAIL"
echo "  4. Password: (what you just tested)"
echo "  5. Do NOT let a password manager fill the form"

#!/usr/bin/env bash
# Switch the Cloudways deployment from temporary URL to guidex-consulting.ae.
#
# Run from macOS Terminal:
#   cd /Users/batyr/Desktop/dubai-guide-site
#   ./scripts/switch-to-real-domain.sh
#
# What it does (one SSH session):
#   1. Backs up .env.local
#   2. Updates NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL only
#   3. Prints only safe vars for verification
#   4. Runs npm run build (bakes NEXT_PUBLIC_SITE_URL into static output)
#   5. Restarts PM2 with --update-env
#   6. Tests local port 3000
#   7. Tests real domain over HTTPS

set -uo pipefail

SSH_USER="master_udndspcyhr"
SERVER="157.245.207.99"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
REAL_DOMAIN="https://guidex-consulting.ae"

if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH_CMD="ssh -S $SOCKET $SSH_USER@$SERVER"
  echo "Using existing ControlMaster socket."
else
  SSH_CMD="ssh $SSH_USER@$SERVER"
  echo "No ControlMaster socket — SSH will prompt for password once."
fi

echo ""
echo "=== Switch to Real Domain: $REAL_DOMAIN ==="
echo ""

$SSH_CMD 'bash -s' << 'SERVERSCRIPT'
set -uo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent

APP="/home/master/applications/dgcmdxxpjx/public_html"
ENV_FILE="$APP/.env.local"
REAL_DOMAIN="https://guidex-consulting.ae"

cd "$APP"

# ── A. Backup .env.local ──────────────────────────────────────────────────────
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="${ENV_FILE}.backup-${TS}"
cp "$ENV_FILE" "$BACKUP"
echo "A. BACKUP:$BACKUP"

# ── B. Update only the two URL vars — Python handles all escaping safely ──────
python3 - "$ENV_FILE" "$REAL_DOMAIN" << 'PYEOF'
import sys, re

env_path    = sys.argv[1]
real_domain = sys.argv[2]

with open(env_path) as f:
    content = f.read()

# Update NEXT_PUBLIC_SITE_URL if present, else append
if re.search(r'^NEXT_PUBLIC_SITE_URL=', content, re.MULTILINE):
    content = re.sub(r'^NEXT_PUBLIC_SITE_URL=.*', f'NEXT_PUBLIC_SITE_URL={real_domain}', content, flags=re.MULTILINE)
else:
    content = content.rstrip('\n') + '\nNEXT_PUBLIC_SITE_URL=' + real_domain + '\n'

# Update NEXTAUTH_URL if present, else append
if re.search(r'^NEXTAUTH_URL=', content, re.MULTILINE):
    content = re.sub(r'^NEXTAUTH_URL=.*', f'NEXTAUTH_URL={real_domain}', content, flags=re.MULTILINE)
else:
    content = content.rstrip('\n') + '\nNEXTAUTH_URL=' + real_domain + '\n'

with open(env_path, 'w') as f:
    f.write(content)

print('ENV_WRITE:ok')
PYEOF

echo ""

# ── Verify only safe vars — never print secret or hash ────────────────────────
SITE_URL=$(grep '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE" | cut -d= -f2-)
AUTH_URL=$(grep '^NEXTAUTH_URL='          "$ENV_FILE" | cut -d= -f2-)
ADMIN_EM=$(grep '^ADMIN_EMAIL='           "$ENV_FILE" | cut -d= -f2-)

echo "B. NEXT_PUBLIC_SITE_URL=$SITE_URL"
echo "B. NEXTAUTH_URL=$AUTH_URL"
echo "B. ADMIN_EMAIL=$ADMIN_EM"
echo ""

# Confirm secrets still present (length only — never print value)
SECRET_LEN=$(grep '^NEXTAUTH_SECRET=' "$ENV_FILE" | cut -d= -f2- | wc -c | tr -d ' ')
HASH_LEN=$(  grep '^ADMIN_PASSWORD_HASH=' "$ENV_FILE" | cut -d= -f2- | wc -c | tr -d ' ')
echo "B. NEXTAUTH_SECRET length: $SECRET_LEN chars (not printed)"
echo "B. ADMIN_PASSWORD_HASH length: $HASH_LEN chars (not printed)"
echo ""

# ── C. Build ──────────────────────────────────────────────────────────────────
echo "C. Running npm run build..."
echo "   (This takes 2–4 minutes — do not interrupt)"
echo ""
npm run build 2>&1
BUILD_EXIT=$?
echo ""
if [ $BUILD_EXIT -eq 0 ]; then
  echo "C. BUILD:success"
else
  echo "C. BUILD:FAILED (exit $BUILD_EXIT)"
  echo "   Restoring .env.local from backup..."
  cp "$BACKUP" "$ENV_FILE"
  echo "   Restored. No PM2 restart. Investigate build errors above."
  exit 1
fi

# ── D. Restart PM2 ────────────────────────────────────────────────────────────
echo ""
echo "D. Restarting PM2 with --update-env..."
pm2 restart guidex-production --update-env
sleep 3
pm2 list
echo ""
pm2 show guidex-production | grep -E 'status|restart|uptime|pid'
echo "D. PM2:restarted"

# ── E. Local port test ────────────────────────────────────────────────────────
echo ""
echo "E. Testing local port 3000..."
sleep 2

for PATH_TEST in "/" "/guides" "/admin/login"; do
  STATUS=$(curl -sk -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000${PATH_TEST}")
  echo "E. http://127.0.0.1:3000${PATH_TEST} → HTTP $STATUS"
done

# ── F. Real domain test ───────────────────────────────────────────────────────
echo ""
echo "F. Testing real domain..."
DOMAIN="https://guidex-consulting.ae"

for PATH_TEST in "/" "/guides" "/admin/login" "/robots.txt" "/sitemap.xml"; do
  STATUS=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "${DOMAIN}${PATH_TEST}" 2>/dev/null || echo "timeout/err")
  echo "F. ${DOMAIN}${PATH_TEST} → HTTP $STATUS"
done

echo ""
echo "G. SSL next step:"
echo "   Go to Cloudways Panel → SSL → Let's Encrypt"
echo "   Domain: guidex-consulting.ae"
echo "   Also add: www.guidex-consulting.ae"
echo "   Click Install Certificate."
echo "   SSL takes 1–2 minutes if DNS is already propagated."
SERVERSCRIPT

echo ""
echo "=== Switch complete. See output above. ==="
echo "Domain: $REAL_DOMAIN"
echo "Admin:  $REAL_DOMAIN/admin/login"

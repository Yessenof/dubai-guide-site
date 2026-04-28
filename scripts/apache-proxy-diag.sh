#!/usr/bin/env bash
# Diagnose Apache proxy status on recovered Cloudways server.
# Run from macOS Terminal:
#   cd /Users/batyr/Desktop/dubai-guide-site
#   ./scripts/apache-proxy-diag.sh

set -uo pipefail

SSH_USER="master_asumzwhebx"
SERVER="165.245.187.15"
APP="/home/master/applications/dgcmdxxpjx/public_html"

echo "=== Apache Proxy Diagnostic — $SERVER ==="
echo "SSH user: $SSH_USER"
echo ""

ssh "$SSH_USER@$SERVER" "APP='$APP' bash -s" << 'SERVERSCRIPT'
set -uo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent 2>/dev/null || true

# ── A. PM2 status ─────────────────────────────────────────────────────────────
echo "=== A. PM2 STATUS ==="
pm2 list 2>/dev/null || echo "PM2 not found"
echo ""
echo "--- PM2 logs (last 50 lines, secrets filtered) ---"
pm2 logs guidex-production --lines 50 --nostream 2>&1 | \
  grep -v 'NEXTAUTH_SECRET\|ADMIN_PASSWORD\|password\|secret\|token' | tail -40
echo ""

# ── B. Local port 3000 ────────────────────────────────────────────────────────
echo "=== B. LOCAL PORT 3000 ==="
for P in "/" "/guides" "/admin/login"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000${P}" 2>/dev/null || echo "FAILED")
  echo "  $CODE  http://127.0.0.1:3000${P}"
done
echo ""
ss -ltnp 2>/dev/null | grep ':3000' || echo "  (nothing listening on 3000)"
echo ""

# ── C. .htaccess ──────────────────────────────────────────────────────────────
echo "=== C. .htaccess ==="
cat "$APP/.htaccess" 2>/dev/null || echo "  .htaccess NOT FOUND at $APP"
echo ""

# ── D. Apache proxy modules ───────────────────────────────────────────────────
echo "=== D. APACHE PROXY MODULES ==="
apache2ctl -M 2>/dev/null | grep -i proxy || \
  apachectl -M  2>/dev/null | grep -i proxy || \
  echo "  (could not list modules — apache2ctl/apachectl not accessible)"
echo ""
echo "--- Enabled mods symlinks ---"
ls /etc/apache2/mods-enabled/ 2>/dev/null | grep -i proxy || \
  echo "  (cannot read /etc/apache2/mods-enabled/ — may need root)"
echo ""

# ── E. External HTTPS ─────────────────────────────────────────────────────────
echo "=== E. EXTERNAL HTTPS (from server) ==="
for U in \
  "https://guidex-consulting.ae/" \
  "https://guidex-consulting.ae/guides" \
  "https://guidex-consulting.ae/admin/login"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$U" 2>/dev/null || echo "FAILED")
  echo "  $CODE  $U"
done
echo ""

# ── Auto-restart PM2 if port is down but build exists ────────────────────────
PORT=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000/" 2>/dev/null || echo "000")
if [ "$PORT" != "200" ] && [ -d "$APP/.next" ] && [ -f "$APP/.env.local" ]; then
  echo ">>> Port 3000 down — attempting PM2 restart..."
  pm2 restart guidex-production --update-env 2>/dev/null || \
    pm2 start "$HOME/start-guidex.sh" --name guidex-production 2>/dev/null || \
    echo "  Could not restart PM2"
  sleep 5
  echo "--- Post-restart port 3000 ---"
  for P in "/" "/guides" "/admin/login"; do
    CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 8 "http://127.0.0.1:3000${P}" 2>/dev/null || echo "FAILED")
    echo "  $CODE  http://127.0.0.1:3000${P}"
  done
fi

SERVERSCRIPT

echo ""
echo "=== Mac-side: direct IP test ==="
for P in "/" "/guides" "/admin/login"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 \
    --resolve "guidex-consulting.ae:443:165.245.187.15" \
    "https://guidex-consulting.ae${P}" 2>/dev/null || echo "FAILED")
  echo "  $CODE  https://guidex-consulting.ae${P} (direct to 165.245.187.15)"
done

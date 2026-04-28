#!/usr/bin/env bash
# Emergency recovery diagnostic for restored Cloudways server.
# New server IP: 165.245.187.15
# Run from macOS Terminal:
#   cd /Users/batyr/Desktop/dubai-guide-site
#   ./scripts/recovery-diag.sh

set -uo pipefail

NEW_IP="165.245.187.15"
SSH_USER="master_asumzwhebx"

echo "=== RECOVERY DIAGNOSTIC — NEW SERVER $NEW_IP ==="
echo "SSH user: $SSH_USER"
echo ""
echo "Connecting (will prompt for SSH password)..."
echo ""

ssh "$SSH_USER@$NEW_IP" 'bash -s' << 'SERVERSCRIPT'
set -uo pipefail

echo "=== A. WHO AM I / SERVER BASICS ==="
echo "WHOAMI:$(whoami)"
echo "HOSTNAME:$(hostname)"
echo "HOME:$HOME"
echo ""

# ── Node/nvm discovery ────────────────────────────────────────────────────────
echo "=== C. NODE / NVM / PM2 ==="
NVM_READY=false
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  . "$NVM_DIR/nvm.sh"
  nvm use 20 --silent 2>/dev/null || nvm use default --silent 2>/dev/null || true
  NVM_READY=true
  echo "NVM:found"
  echo "NODE:$(node -v 2>/dev/null || echo 'not found after nvm')"
  echo "NPM:$(npm -v 2>/dev/null || echo 'not found')"
else
  echo "NVM:NOT FOUND at $HOME/.nvm"
  # Try system node
  echo "SYSTEM_NODE:$(node -v 2>/dev/null || echo 'not installed')"
fi

echo ""
if command -v pm2 &>/dev/null; then
  echo "PM2:found"
  pm2 list
  echo ""
  echo "--- PM2 logs (last 80 lines, secrets filtered) ---"
  pm2 logs guidex-production --lines 80 --nostream 2>&1 | \
    grep -v 'NEXTAUTH_SECRET\|ADMIN_PASSWORD\|password\|secret\|token' | \
    tail -60
else
  echo "PM2:NOT FOUND (not in PATH after nvm)"
fi

# ── App path discovery ────────────────────────────────────────────────────────
echo ""
echo "=== A. APP PATH DISCOVERY ==="

# Check known path first
OLD_PATH="/home/master/applications/dgcmdxxpjx/public_html"
if [ -d "$OLD_PATH" ]; then
  echo "OLD_PATH_EXISTS:yes — $OLD_PATH"
  APP="$OLD_PATH"
else
  echo "OLD_PATH_EXISTS:no — $OLD_PATH does not exist"
  APP=""
fi

# Discover actual applications folder
echo ""
echo "--- Scanning ~/applications/ ---"
if [ -d "$HOME/applications" ]; then
  ls "$HOME/applications/" 2>/dev/null | head -10
  # Find any public_html
  find "$HOME/applications" -maxdepth 3 -name "public_html" -type d 2>/dev/null | head -5
else
  echo "(no ~/applications dir found)"
fi

echo ""
echo "--- Scanning /home for app directories ---"
find /home -maxdepth 4 -name "package.json" -not -path "*/node_modules/*" 2>/dev/null | head -10

# ── Project files check ───────────────────────────────────────────────────────
echo ""
echo "=== B. PROJECT FILES ==="

# Try to find the app if old path missing
if [ -z "$APP" ]; then
  FOUND=$(find /home -maxdepth 5 -name "package.json" -not -path "*/node_modules/*" \
    -exec grep -l '"next"' {} \; 2>/dev/null | head -1)
  if [ -n "$FOUND" ]; then
    APP=$(dirname "$FOUND")
    echo "APP_DISCOVERED:$APP"
  else
    echo "APP_DISCOVERED:none — Next.js package.json not found on server"
    APP=""
  fi
fi

if [ -n "$APP" ]; then
  echo "APP_PATH:$APP"
  for F in "package.json" ".next" ".env.local" "data/guides.db" ".htaccess" "~/start-guidex.sh"; do
    FULL="$APP/$F"
    # expand tilde case
    if [ "$F" = "~/start-guidex.sh" ]; then
      FULL="$HOME/start-guidex.sh"
    fi
    if [ -e "$FULL" ]; then
      echo "  EXISTS: $F"
    else
      echo "  MISSING: $F"
    fi
  done

  # data/guides.db size
  if [ -f "$APP/data/guides.db" ]; then
    DB_SIZE=$(du -h "$APP/data/guides.db" | cut -f1)
    echo "  data/guides.db size: $DB_SIZE"
  fi

  # .next build presence
  if [ -d "$APP/.next" ]; then
    BUILD_AGE=$(find "$APP/.next" -maxdepth 1 -name "BUILD_ID" -exec stat -c '%y' {} \; 2>/dev/null | head -1 || echo "unknown")
    echo "  .next/BUILD_ID timestamp: $BUILD_AGE"
  fi
else
  echo "Cannot check project files — app path not found."
fi

# ── .env.local safe inspection ────────────────────────────────────────────────
echo ""
echo "=== F. .env.local SAFE VALUES ==="
if [ -n "$APP" ] && [ -f "$APP/.env.local" ]; then
  SITE_URL=$(grep '^NEXT_PUBLIC_SITE_URL=' "$APP/.env.local" | cut -d= -f2- || echo "(not set)")
  AUTH_URL=$(grep '^NEXTAUTH_URL='         "$APP/.env.local" | cut -d= -f2- || echo "(not set)")
  ADMIN_EM=$(grep '^ADMIN_EMAIL='          "$APP/.env.local" | cut -d= -f2- || echo "(not set)")
  SECRET_L=$(grep '^NEXTAUTH_SECRET='      "$APP/.env.local" | cut -d= -f2- | wc -c | tr -d ' ')
  HASH_L=$(  grep '^ADMIN_PASSWORD_HASH='  "$APP/.env.local" | cut -d= -f2- | wc -c | tr -d ' ')
  echo "  NEXT_PUBLIC_SITE_URL=$SITE_URL"
  echo "  NEXTAUTH_URL=$AUTH_URL"
  echo "  ADMIN_EMAIL=$ADMIN_EM"
  echo "  NEXTAUTH_SECRET length: $SECRET_L chars (not printed)"
  echo "  ADMIN_PASSWORD_HASH length: $HASH_L chars (not printed)"
else
  echo "  .env.local NOT FOUND or APP path unknown"
fi

# ── .htaccess ─────────────────────────────────────────────────────────────────
echo ""
echo "=== G. .htaccess ==="
if [ -n "$APP" ] && [ -f "$APP/.htaccess" ]; then
  cat "$APP/.htaccess"
else
  echo "  .htaccess NOT FOUND"
fi

# ── Port 3000 test ────────────────────────────────────────────────────────────
echo ""
echo "=== E. PORT 3000 TEST ==="
for PATH_TEST in "/" "/guides" "/admin/login"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000${PATH_TEST}" 2>/dev/null || echo "FAILED")
  echo "  http://127.0.0.1:3000${PATH_TEST} → $CODE"
done

echo ""
echo "--- Listening on port 3000 ---"
ss -ltnp 2>/dev/null | grep ':3000' || echo "  (nothing listening on 3000)"

# ── Auto-restart PM2 if port is down and files exist ─────────────────────────
PORT_UP=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000/" 2>/dev/null || echo "000")
if [ "$PORT_UP" != "200" ] && [ -n "$APP" ] && [ -f "$APP/.env.local" ] && [ -d "$APP/.next" ]; then
  echo ""
  echo ">>> Port 3000 down but app files + .env.local + build exist. Attempting PM2 restart..."
  if command -v pm2 &>/dev/null; then
    PM2_PROC=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
try:
    procs = json.load(sys.stdin)
    names = [p.get('name','') for p in procs]
    print('found' if 'guidex-production' in names else 'missing')
except:
    print('error')
" 2>/dev/null || echo "error")

    if [ "$PM2_PROC" = "missing" ]; then
      echo "  PM2 process missing — starting via ~/start-guidex.sh..."
      if [ -f "$HOME/start-guidex.sh" ]; then
        pm2 start "$HOME/start-guidex.sh" --name guidex-production
      else
        echo "  ~/start-guidex.sh not found — cannot auto-start"
      fi
    else
      echo "  PM2 process exists — restarting..."
      pm2 restart guidex-production --update-env
    fi
    sleep 6

    echo ""
    echo "=== POST-RESTART PORT 3000 ==="
    for PATH_TEST in "/" "/guides" "/admin/login"; do
      CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 8 "http://127.0.0.1:3000${PATH_TEST}" 2>/dev/null || echo "FAILED")
      echo "  http://127.0.0.1:3000${PATH_TEST} → $CODE"
    done
    pm2 list
  else
    echo "  PM2 not available — cannot auto-restart"
  fi
fi

# ── External URL test ─────────────────────────────────────────────────────────
echo ""
echo "=== H. EXTERNAL URL TEST (from new server) ==="
for URL in \
  "https://guidex-consulting.ae/" \
  "https://www.guidex-consulting.ae/" \
  "https://phpstack-1618074-6379172.cloudwaysapps.com/"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$URL" 2>/dev/null || echo "FAILED")
  echo "  $CODE  $URL"
done

echo ""
echo "=== DONE — paste full output back for diagnosis ==="
SERVERSCRIPT

echo ""
echo "=== LOCAL EXTERNAL CHECK (from your Mac) ==="
echo "Current DNS resolution for guidex-consulting.ae:"
dig +short guidex-consulting.ae A 2>/dev/null || host guidex-consulting.ae 2>/dev/null | grep "has address" || echo "(dig/host not available)"

echo ""
echo "Direct test against NEW IP (bypasses DNS):"
for PATH_TEST in "/" "/guides" "/admin/login"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 \
    --resolve "guidex-consulting.ae:443:165.245.187.15" \
    "https://guidex-consulting.ae${PATH_TEST}" 2>/dev/null || echo "FAILED")
  echo "  $CODE  https://guidex-consulting.ae${PATH_TEST} (via new IP)"
done

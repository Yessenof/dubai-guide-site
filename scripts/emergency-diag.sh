#!/usr/bin/env bash
# Emergency production diagnostic and auto-fix.
# Run from macOS Terminal:
#   cd /Users/batyr/Desktop/dubai-guide-site
#   ./scripts/emergency-diag.sh

set -uo pipefail

SSH_USER="master_asumzwhebx"
SERVER="165.245.187.15"
SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"

if [ -S "$SOCKET" ] && ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH="ssh -S $SOCKET $SSH_USER@$SERVER"
  echo "Using ControlMaster socket."
else
  SSH="ssh $SSH_USER@$SERVER"
  echo "No ControlMaster socket — will prompt for SSH password."
fi

echo ""
echo "=== EMERGENCY PRODUCTION DIAGNOSTIC ==="
echo ""

$SSH 'bash -s' << 'SERVERSCRIPT'
set -uo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 --silent 2>/dev/null || nvm use 20

APP="/home/master/applications/dgcmdxxpjx/public_html"

echo "NODE_VERSION:$(node -v)"
echo "NODE_BIN:$(which node)"
echo ""

# ── A. PM2 status ─────────────────────────────────────────────────────────────
echo "=== A. PM2 STATUS ==="
pm2 list
echo ""

# Capture status of guidex-production specifically
PM2_STATUS=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
procs = json.load(sys.stdin)
for p in procs:
    if p.get('name') == 'guidex-production':
        s = p.get('pm2_env', {})
        print('PM2_STATUS:' + str(s.get('status', 'unknown')))
        print('PM2_RESTARTS:' + str(p.get('pm2_env', {}).get('restart_time', '?')))
        print('PM2_PID:' + str(p.get('pid', '?')))
        print('PM2_UPTIME:' + str(s.get('pm_uptime', '?')))
" 2>/dev/null || echo "PM2_STATUS:parse_error")

echo "$PM2_STATUS"
echo ""

# ── B. PM2 logs (last 100 lines, filter secrets) ──────────────────────────────
echo "=== B. PM2 LOGS (last 100 lines, secrets filtered) ==="
pm2 logs guidex-production --lines 100 --nostream 2>&1 | \
  grep -v 'NEXTAUTH_SECRET\|ADMIN_PASSWORD\|password\|token\|secret' | \
  tail -60
echo ""

# ── C. Port 3000 test ─────────────────────────────────────────────────────────
echo "=== C. PORT 3000 TEST ==="
for PATH_TEST in "/" "/guides" "/admin/login"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000${PATH_TEST}" 2>/dev/null || echo "FAILED")
  echo "  http://127.0.0.1:3000${PATH_TEST} → $CODE"
done
echo ""

# Check what's listening on 3000
echo "=== Listening on port 3000 ==="
ss -ltnp 2>/dev/null | grep ':3000' || netstat -ltnp 2>/dev/null | grep ':3000' || echo "  (nothing found on 3000)"
echo ""

# ── D. .htaccess ──────────────────────────────────────────────────────────────
echo "=== D. .htaccess ==="
cat "$APP/.htaccess" 2>/dev/null || echo "  (.htaccess not found)"
echo ""

# ── Auto-fix if PM2 is down or port not responding ────────────────────────────
PORT_CHECK=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:3000/" 2>/dev/null || echo "000")
PM2_PROC=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
procs = json.load(sys.stdin)
for p in procs:
    if p.get('name') == 'guidex-production':
        print(p.get('pm2_env', {}).get('status', 'missing'))
" 2>/dev/null || echo "missing")

echo "=== DIAGNOSIS ==="
echo "  Port 3000 response: $PORT_CHECK"
echo "  PM2 process status: $PM2_PROC"
echo ""

if [ "$PORT_CHECK" != "200" ] || [ "$PM2_PROC" = "stopped" ] || [ "$PM2_PROC" = "errored" ] || [ "$PM2_PROC" = "missing" ]; then
  echo ">>> Port 3000 not responding or PM2 down. Attempting fix..."
  echo ""

  if [ "$PM2_PROC" = "missing" ]; then
    echo "  PM2 process missing — starting via ~/start-guidex.sh..."
    if [ -f "$HOME/start-guidex.sh" ]; then
      pm2 start "$HOME/start-guidex.sh" --name guidex-production --no-autorestart 2>&1 || true
      sleep 2
      pm2 restart guidex-production --update-env 2>&1 || true
    else
      echo "  start-guidex.sh not found at ~/start-guidex.sh"
      echo "  Manual intervention required."
    fi
  else
    echo "  PM2 process exists (status: $PM2_PROC) — restarting..."
    pm2 restart guidex-production --update-env
  fi

  echo "  Waiting 6 seconds for Next.js to start..."
  sleep 6

  echo ""
  echo "=== POST-FIX PORT 3000 TEST ==="
  for PATH_TEST in "/" "/guides" "/admin/login"; do
    CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 8 "http://127.0.0.1:3000${PATH_TEST}" 2>/dev/null || echo "FAILED")
    echo "  http://127.0.0.1:3000${PATH_TEST} → $CODE"
  done

  echo ""
  echo "=== PM2 STATUS AFTER FIX ==="
  pm2 list
else
  echo "  Port 3000 is responding (HTTP $PORT_CHECK). PM2 status: $PM2_PROC"
  echo "  Local app is UP. If external domain is 502, the issue is Apache/Nginx/Varnish."
fi

echo ""

# ── E. External URL test from server ──────────────────────────────────────────
echo "=== E. EXTERNAL URL TEST (from server) ==="
for URL in \
  "https://guidex-consulting.ae/" \
  "https://www.guidex-consulting.ae/" \
  "https://phpstack-1618074-6379172.cloudwaysapps.com/"; do
  CODE=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 10 "$URL" 2>/dev/null || echo "FAILED")
  echo "  $CODE  $URL"
done

SERVERSCRIPT

echo ""
echo "=== INTERPRETATION GUIDE ==="
echo ""
echo "If port 3000 = 200 BUT external = 502:"
echo "  → Apache/Nginx/Varnish layer not forwarding to Next.js"
echo "  → Action: Cloudways panel → Purge Varnish cache (if Varnish is in stack)"
echo "  →         Cloudways panel → Services → restart Apache (httpd) and/or Nginx"
echo "  →         Do NOT modify DNS"
echo ""
echo "If port 3000 = FAILED after fix attempt:"
echo "  → Next.js failed to start — check PM2 logs above for the exact error"
echo "  → Common: missing .env.local, wrong Node version, or build missing"
echo ""
echo "If external = 200:"
echo "  → Site is back up. Browser cache may be stale — try incognito."

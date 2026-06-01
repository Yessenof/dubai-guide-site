#!/usr/bin/env bash
# deploy-zero-downtime.sh
# Zero-downtime production deploy for guidex-consulting.ae
#
# Strategy: build while app is running, then pm2 reload (not stop+start).
# Downtime: ~2-3s per deploy (vs ~30s with the old stop-build-start approach).
#
# Run on server: bash /var/www/guidex/scripts/deploy-zero-downtime.sh
# Or from local: ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
#
# Secrets: .env.local is read by next start at runtime. Not touched by this script.

set -euo pipefail

APP_DIR="/var/www/guidex"
LOG_DIR="/tmp"
BUILD_LOG="${LOG_DIR}/guidex-build-$(date +%Y%m%d-%H%M%S).log"
HEALTH_URL="https://guidex-consulting.ae/"
PM2_NAME="guidex-production"

# ── Colours ─────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✗${NC}  $*"; exit 1; }

# ── Pre-flight ───────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Guidex Zero-Downtime Deploy                                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo "  App dir:   $APP_DIR"
echo "  Build log: $BUILD_LOG"
echo "  Started:   $(date)"
echo ""

cd "$APP_DIR" || fail "Cannot cd to $APP_DIR"

# 1. Verify PM2 process is running before we start
if ! pm2 show "$PM2_NAME" 2>/dev/null | grep -q "status.*online"; then
  warn "PM2 process '$PM2_NAME' is not online. Starting it first..."
  pm2 start ecosystem.config.js --env production
fi
ok "PM2 process is online"

# 2. Backup current .next for rollback
echo ""
echo "── Step 1/6: Backup current build ────────────────────────────"
if [ -d "${APP_DIR}/.next" ]; then
  rm -rf "${APP_DIR}/.next.bak"
  cp -r "${APP_DIR}/.next" "${APP_DIR}/.next.bak"
  ok "Current .next backed up to .next.bak ($(du -sh "${APP_DIR}/.next.bak" 2>/dev/null | cut -f1))"
else
  warn ".next directory not found — skipping backup"
fi

# 3. Pull latest code
echo ""
echo "── Step 2/6: Pull latest code ─────────────────────────────────"
git pull origin main 2>&1 | tail -5
ok "Code updated to $(git log --oneline -1)"

# 4. Build (app stays running during build — CSS mismatch risk is acceptable)
echo ""
echo "── Step 3/6: Build (app is still serving) ──────────────────────"
warn "Building while app is live. Active sessions may see brief CSS flash."
warn "This is acceptable: no 502 during build. Old .next.bak ready for rollback."
echo "  Build log: $BUILD_LOG"

START_BUILD=$(date +%s)
if ! npm run build > "$BUILD_LOG" 2>&1; then
  echo ""
  fail "Build FAILED. App is still running on old build. No impact on users.
  Check log: $BUILD_LOG
  Last 10 lines: $(tail -10 "$BUILD_LOG")"
fi
END_BUILD=$(date +%s)
BUILD_SECS=$((END_BUILD - START_BUILD))

PAGES=$(grep -o '[0-9]*/[0-9]* [0-9]*\/' "$BUILD_LOG" | tail -1 | grep -o '[0-9]*/[0-9]*' | tail -1 || echo "?")
ok "Build complete in ${BUILD_SECS}s"

# 5. Reload PM2 (graceful: ~2-3s gap, not stop+build+start which is ~30s)
echo ""
echo "── Step 4/6: Reload PM2 (graceful restart) ────────────────────"
RELOAD_START=$(date +%s)
if ! pm2 reload "$PM2_NAME" --update-env 2>&1 | tail -3; then
  warn "pm2 reload returned non-zero. Checking process..."
fi
RELOAD_END=$(date +%s)

# Wait for process to accept connections (max 15s)
echo "  Waiting for port 3000..."
MAX_WAIT=15
WAITED=0
while ! curl -s -o /dev/null --max-time 3 "http://127.0.0.1:3000/" 2>/dev/null; do
  sleep 1
  WAITED=$((WAITED + 1))
  if [ "$WAITED" -ge "$MAX_WAIT" ]; then
    echo ""
    echo "  Port 3000 not responding after ${MAX_WAIT}s — attempting rollback..."
    # Rollback: restore .next.bak
    if [ -d "${APP_DIR}/.next.bak" ]; then
      rm -rf "${APP_DIR}/.next"
      mv "${APP_DIR}/.next.bak" "${APP_DIR}/.next"
      pm2 reload "$PM2_NAME" --update-env 2>/dev/null || pm2 start ecosystem.config.js
      fail "Reload failed. Rolled back to previous build. Check PM2 logs: pm2 logs $PM2_NAME"
    else
      fail "Reload failed and no .next.bak available. Check: pm2 logs $PM2_NAME"
    fi
  fi
done
RELOAD_SECS=$((RELOAD_END - RELOAD_START + WAITED))
ok "Port 3000 accepting connections (reload + warmup: ~${WAITED}s)"

# 6. Health check
echo ""
echo "── Step 5/6: Health check ─────────────────────────────────────"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$HEALTH_URL")
if [ "$HTTP_CODE" != "200" ]; then
  warn "Health check returned HTTP $HTTP_CODE for $HEALTH_URL"
  warn "Attempting rollback..."
  if [ -d "${APP_DIR}/.next.bak" ]; then
    rm -rf "${APP_DIR}/.next"
    mv "${APP_DIR}/.next.bak" "${APP_DIR}/.next"
    pm2 reload "$PM2_NAME" --update-env 2>/dev/null || pm2 start ecosystem.config.js
    fail "Health check failed (HTTP $HTTP_CODE). Rolled back to previous build."
  fi
  fail "Health check failed (HTTP $HTTP_CODE). Manual intervention required."
fi
ok "Health check: $HEALTH_URL → HTTP $HTTP_CODE"

# Additional quick route checks
for ROUTE in "/ru" "/calendar/october-2026-dubai-calendar" "/calendar?month=2026-07"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "https://guidex-consulting.ae${ROUTE}")
  if [ "$CODE" = "200" ]; then
    ok "  $ROUTE → $CODE"
  else
    warn "  $ROUTE → $CODE (unexpected)"
  fi
done

# 7. PM2 status
echo ""
echo "── Step 6/6: Final status ──────────────────────────────────────"
pm2 status
echo ""

# Clean up old backup only after successful deploy
rm -rf "${APP_DIR}/.next.bak" 2>/dev/null || true

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Deploy complete                                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo "  Build time:   ${BUILD_SECS}s"
echo "  Reload time:  ~${WAITED}s (max 2-3s 502 window)"
echo "  Health check: HTTP $HTTP_CODE ✓"
echo "  Commit:       $(git log --oneline -1)"
echo "  Finished:     $(date)"
echo ""
echo "  Rollback command (if needed):"
echo "    ssh root@85.9.203.69 \"cd /var/www/guidex && bash scripts/rollback.sh\""
echo ""

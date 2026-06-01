#!/usr/bin/env bash
# rollback.sh — Restore previous .next build if deploy introduced a regression.
# Only works if deploy-zero-downtime.sh created a .next.bak before it cleaned up.
# If .next.bak is not present, a full rebuild is required.

set -euo pipefail

APP_DIR="/var/www/guidex"
PM2_NAME="guidex-production"

cd "$APP_DIR" || { echo "Cannot cd to $APP_DIR"; exit 1; }

echo "Guidex rollback — $(date)"

if [ ! -d "${APP_DIR}/.next.bak" ]; then
  echo "ERROR: .next.bak not found. Cannot rollback automatically."
  echo "Options:"
  echo "  1. Identify the last working commit: git log --oneline -5"
  echo "  2. Hard reset: git reset --hard <commit>"
  echo "  3. Rebuild: npm run build && pm2 reload guidex-production"
  exit 1
fi

echo "Restoring .next from .next.bak..."
rm -rf "${APP_DIR}/.next"
mv "${APP_DIR}/.next.bak" "${APP_DIR}/.next"
echo "Reloading PM2..."
pm2 reload "$PM2_NAME" --update-env || pm2 start ecosystem.config.js

sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://guidex-consulting.ae/")
echo "Health check: HTTP $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
  echo "Rollback successful. Site is up."
else
  echo "WARNING: Site returning HTTP $HTTP_CODE after rollback. Check PM2 logs: pm2 logs $PM2_NAME"
fi

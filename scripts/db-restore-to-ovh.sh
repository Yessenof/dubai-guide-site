#!/usr/bin/env bash
# Restore a local guides.db to the OVH production server.
#
# SAFETY: Always creates a timestamped server-side backup BEFORE overwriting.
#
# Usage:
#   ./scripts/db-restore-to-ovh.sh <path-to-local-guides.db>
#
# Example:
#   OVH_IP=1.2.3.4 ./scripts/db-restore-to-ovh.sh backups/production-db/guides.db.latest

set -euo pipefail

LOCAL_DB="${1:-}"
if [ -z "$LOCAL_DB" ]; then
  echo "Usage: $0 <path-to-local-guides.db>"
  exit 1
fi
if [ ! -f "$LOCAL_DB" ]; then
  echo "Error: file not found: $LOCAL_DB"
  exit 1
fi

SSH_USER="root"
SERVER="${OVH_IP:-REPLACE_WITH_OVH_IP}"
APP_PATH="/var/www/guidex"
SERVER_DB="$APP_PATH/data/guides.db"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if [ "$SERVER" = "REPLACE_WITH_OVH_IP" ]; then
  echo "Error: OVH_IP is not set. Run: OVH_IP=<ip> $0 <db-file>"
  exit 1
fi

echo "Source: $LOCAL_DB ($(du -h "$LOCAL_DB" | cut -f1))"
echo "Target: $SSH_USER@$SERVER:$SERVER_DB"
echo ""
read -rp "Proceed? This will overwrite production DB. Type YES to confirm: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted."
  exit 1
fi

echo ""
echo "Step 1/3: Creating server-side backup..."
ssh "$SSH_USER@$SERVER" \
  "cp \"$SERVER_DB\" \"${SERVER_DB}.backup-$TIMESTAMP\" && echo '  Backup: ${SERVER_DB}.backup-$TIMESTAMP'"

echo "Step 2/3: Uploading $LOCAL_DB..."
rsync -avz -e "ssh" \
  "$LOCAL_DB" \
  "$SSH_USER@$SERVER:$SERVER_DB"

echo "Step 3/3: Restarting PM2..."
ssh "$SSH_USER@$SERVER" \
  "pm2 restart guidex-production && echo '  PM2 restarted.'"

echo ""
echo "Done. Production DB updated and app restarted."
echo "Verify: https://guidex-consulting.ae/guides"

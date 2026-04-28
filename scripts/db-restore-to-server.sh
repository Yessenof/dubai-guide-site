#!/usr/bin/env bash
# Restore a local guides.db to the Cloudways production server.
#
# SAFETY: Always creates a timestamped server-side backup BEFORE overwriting.
# Never run this without verifying the source file first.
#
# Usage:
#   ./scripts/db-restore-to-server.sh <path-to-local-guides.db>
#
# Example:
#   ./scripts/db-restore-to-server.sh backups/production-db/guides.db.latest
#   ./scripts/db-restore-to-server.sh backups/production-db/guides.db.20260427-163049

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

SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
SSH_USER="master_asumzwhebx"
SERVER="165.245.187.15"
APP_PATH="/home/master/applications/dgcmdxxpjx/public_html"
SERVER_DB="$APP_PATH/data/guides.db"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  SSH_CMD="ssh -S $SOCKET"
  RSYNC_SSH="ssh -S $SOCKET"
else
  SSH_CMD="ssh"
  RSYNC_SSH="ssh"
  echo "Warning: ControlMaster socket not live — will prompt for password."
fi

echo "Source: $LOCAL_DB ($(du -h "$LOCAL_DB" | cut -f1))"
echo "Target: $SSH_USER@$SERVER:$SERVER_DB"
echo ""
read -p "Proceed? This will overwrite production DB. Type YES to confirm: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted."
  exit 1
fi

echo ""
echo "Step 1/3: Creating server-side backup..."
$SSH_CMD "$SSH_USER@$SERVER" \
  "cp \"$SERVER_DB\" \"${SERVER_DB}.backup-$TIMESTAMP\" && echo '  Backup: ${SERVER_DB}.backup-$TIMESTAMP'"

echo "Step 2/3: Uploading $LOCAL_DB..."
rsync -avz -e "$RSYNC_SSH" \
  "$LOCAL_DB" \
  "$SSH_USER@$SERVER:$SERVER_DB"

echo "Step 3/3: Restarting PM2..."
$SSH_CMD "$SSH_USER@$SERVER" \
  'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; nvm use 20 --silent; pm2 restart guidex-production && echo "  PM2 restarted."'

echo ""
echo "Done. Production DB updated and app restarted."
echo "Verify: https://phpstack-1618074-6379172.cloudwaysapps.com/guides"

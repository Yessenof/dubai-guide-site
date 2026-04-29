#!/usr/bin/env bash
# Pull the production guides.db from the OVH server to local backups.
#
# Usage:
#   ./scripts/db-backup-from-ovh.sh
#
# Output: backups/production-db/guides.db.YYYYMMDD-HHMMSS
#         backups/production-db/guides.db.latest  (symlink)

set -euo pipefail

SSH_USER="root"
SERVER="${OVH_IP:-REPLACE_WITH_OVH_IP}"       # set OVH_IP env var or edit this line
SERVER_DB="/var/www/guidex/data/guides.db"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/../backups/production-db"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEST="$BACKUP_DIR/guides.db.$TIMESTAMP"

if [ "$SERVER" = "REPLACE_WITH_OVH_IP" ]; then
  echo "Error: OVH_IP is not set. Run: OVH_IP=<ip> ./scripts/db-backup-from-ovh.sh"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "Pulling production DB from OVH ($SERVER)..."
rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
  "$SSH_USER@$SERVER:$SERVER_DB" \
  "$DEST"

SIZE=$(du -h "$DEST" | cut -f1)
echo "Saved:  $DEST  ($SIZE)"

# Verify it opens
sqlite3 "$DEST" ".tables" > /dev/null 2>&1 && echo "SQLite OK." || { echo "ERROR: backup failed SQLite check"; exit 1; }

# Update latest symlink
cd "$BACKUP_DIR"
ln -sf "guides.db.$TIMESTAMP" guides.db.latest
echo "Latest: $BACKUP_DIR/guides.db.latest → guides.db.$TIMESTAMP"

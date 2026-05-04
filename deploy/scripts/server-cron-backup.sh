#!/usr/bin/env bash
# Daily DB backup — runs ON the OVH server via cron.
# Install: add to root crontab with `crontab -e`
#   0 3 * * * /var/www/guidex/deploy/scripts/server-cron-backup.sh >> /var/log/guidex/backup.log 2>&1
#
# Keeps 30 days of backups.

set -euo pipefail

DB_SRC="/var/www/guidex/data/guides.db"
BACKUP_DIR="/var/backups/guidex"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEST="$BACKUP_DIR/guides.db.$TIMESTAMP"
KEEP_DAYS=30

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB_SRC" ]; then
  echo "[$TIMESTAMP] ERROR: DB not found at $DB_SRC"
  exit 1
fi

# Checkpoint WAL before copying (ensures backup is consistent)
sqlite3 "$DB_SRC" "PRAGMA wal_checkpoint(TRUNCATE);" 2>/dev/null || true

cp "$DB_SRC" "$DEST"
SIZE=$(du -h "$DEST" | cut -f1)
echo "[$(date +%Y-%m-%d\ %H:%M:%S)] Backed up: $DEST ($SIZE)"

# Rotate — delete backups older than KEEP_DAYS
find "$BACKUP_DIR" -name "guides.db.*" -mtime +$KEEP_DAYS -delete
echo "[$(date +%Y-%m-%d\ %H:%M:%S)] Rotation done: kept last $KEEP_DAYS days."

# Update latest symlink
ln -sf "$DEST" "$BACKUP_DIR/guides.db.latest"

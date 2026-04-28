#!/usr/bin/env bash
# Pull the production guides.db from Cloudways to local backups/production-db/.
#
# Usage:
#   ./scripts/db-backup-from-server.sh
#
# Requires an active SSH ControlMaster socket at ~/.ssh/cm/guidex-cloudways.sock,
# or will fall back to password prompt.
#
# Output: backups/production-db/guides.db.YYYYMMDD-HHMMSS
#         backups/production-db/guides.db.latest  (symlink)

set -euo pipefail

SOCKET="$HOME/.ssh/cm/guidex-cloudways.sock"
SSH_USER="master_asumzwhebx"
SERVER="165.245.187.15"
SERVER_DB="/home/master/applications/dgcmdxxpjx/public_html/data/guides.db"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/../backups/production-db"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEST="$BACKUP_DIR/guides.db.$TIMESTAMP"

mkdir -p "$BACKUP_DIR"

if ssh -S "$SOCKET" -O check "$SSH_USER@$SERVER" 2>/dev/null; then
  RSYNC_SSH="ssh -S $SOCKET"
else
  RSYNC_SSH="ssh"
  echo "Warning: ControlMaster socket not live at $SOCKET — will prompt for password."
fi

echo "Pulling production DB from $SERVER..."
rsync -avz -e "$RSYNC_SSH" \
  "$SSH_USER@$SERVER:$SERVER_DB" \
  "$DEST"

SIZE=$(du -h "$DEST" | cut -f1)
echo "Saved:  $DEST  ($SIZE)"

# Update latest symlink
cd "$BACKUP_DIR"
ln -sf "guides.db.$TIMESTAMP" guides.db.latest
echo "Latest: $BACKUP_DIR/guides.db.latest → guides.db.$TIMESTAMP"

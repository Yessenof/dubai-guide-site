#!/usr/bin/env bash
# OVH VPS initial server setup for Guidex Consulting.
# Run as root on a fresh Ubuntu 24.04 LTS server.
#
# Usage (from local machine):
#   scp scripts/ovh-server-setup.sh root@<OVH_IP>:/root/
#   ssh root@<OVH_IP> "bash /root/ovh-server-setup.sh"
#
# This script is IDEMPOTENT — safe to run again if interrupted.

set -euo pipefail

# ─── Safety check ─────────────────────────────────────────────────────────────

OS_ID=$(. /etc/os-release && echo "$ID")
OS_VERSION=$(. /etc/os-release && echo "$VERSION_ID")

if [ "$OS_ID" != "ubuntu" ] || [ "$OS_VERSION" != "24.04" ]; then
  echo "ERROR: Expected Ubuntu 24.04 LTS. Got: $OS_ID $OS_VERSION"
  echo "Stop here and re-provision the server with Ubuntu 24.04 LTS."
  exit 1
fi
echo "[OK] OS: Ubuntu $OS_VERSION"

# ─── Phase 1: Update packages and install tools ───────────────────────────────

echo ""
echo "=== Phase 1: System packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get upgrade -y -q
apt-get install -y -q \
  git \
  curl \
  unzip \
  rsync \
  sqlite3 \
  nginx \
  ufw \
  build-essential \
  logrotate \
  cron

echo "[OK] System packages installed."

# ─── Phase 2: Node.js 20 via NodeSource ──────────────────────────────────────

echo ""
echo "=== Phase 2: Node.js 20 ==="
if command -v node &>/dev/null && node -v | grep -q "^v20\."; then
  echo "[OK] Node.js 20 already installed: $(node -v)"
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
  echo "[OK] Node.js installed: $(node -v)"
fi
echo "[OK] npm: $(npm -v)"

# ─── Phase 3: PM2 ─────────────────────────────────────────────────────────────

echo ""
echo "=== Phase 3: PM2 ==="
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi
echo "[OK] PM2: $(pm2 -v)"

# ─── Phase 4: Create app and log directories ──────────────────────────────────

echo ""
echo "=== Phase 4: Directories ==="
mkdir -p /var/www/guidex/data
mkdir -p /var/log/guidex
mkdir -p /var/backups/guidex
echo "[OK] Directories created."

# ─── Phase 5: Firewall (UFW) ──────────────────────────────────────────────────

echo ""
echo "=== Phase 5: UFW firewall ==="

# Allow SSH before enabling — critical
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp

# Enable non-interactively
ufw --force enable
ufw status verbose
echo "[OK] Firewall configured."

# ─── Phase 6: Nginx ───────────────────────────────────────────────────────────

echo ""
echo "=== Phase 6: Nginx ==="
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Verify nginx starts clean
nginx -t
systemctl enable nginx
systemctl start nginx || systemctl reload nginx
echo "[OK] Nginx running."

# ─── Phase 7: Log rotation for guidex ────────────────────────────────────────

echo ""
echo "=== Phase 7: Log rotation ==="
cat > /etc/logrotate.d/guidex << 'LOGROTATE'
/var/log/guidex/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 640 root root
}
LOGROTATE
echo "[OK] Log rotation configured."

# ─── Summary ──────────────────────────────────────────────────────────────────

echo ""
echo "=== Setup complete ==="
echo "Node.js: $(node -v)"
echo "npm:     $(npm -v)"
echo "PM2:     $(pm2 -v)"
echo "Nginx:   $(nginx -v 2>&1)"
echo "UFW:     active"
echo ""
echo "Next steps:"
echo "  1. Clone repo to /var/www/guidex"
echo "  2. Create /var/www/guidex/.env.local with secrets"
echo "  3. Upload data/guides.db"
echo "  4. Run: npm ci && npm run build"
echo "  5. Run: pm2 start ecosystem.config.js --env production"
echo "  6. Run: pm2 startup && pm2 save"
echo "  7. Deploy Nginx config from deploy/nginx/guidex-consulting.ae"

# UpCloud VPS Deployment — Guidex Consulting

Last updated: 2026-05-24

Authoritative deployment runbook for the UpCloud production server.
Reference this any time you need to deploy, restart, recover, or reprovision the app.

---

## Server facts

| Item | Value |
|---|---|
| Provider | UpCloud |
| OS | Ubuntu 24.04 LTS |
| IP | `85.9.203.69` |
| SSH user | `root` |
| App path | `/var/www/guidex` |
| DB path | `/var/www/guidex/data/guides.db` |
| DB backups | `/var/backups/guidex/` |
| PM2 process | `guidex-production` |
| Port | 3000 (internal); 80/443 (public via Nginx) |
| Nginx config | `/etc/nginx/sites-available/guidex-consulting.ae` |
| PM2 logs | `/var/log/guidex/pm2-out.log`, `/var/log/guidex/pm2-error.log` |
| Swap | 2 GB `/swapfile` (persistent via `/etc/fstab`) |
| SSL | Let's Encrypt — auto-renewed via `certbot.timer` |

---

## Source of truth

| Asset | Source of truth |
|---|---|
| Code | GitHub (`Yessenof/dubai-guide-site`) |
| Database | `/var/backups/guidex/` on server + `backups/production-db/` local |
| Secrets | `.env.local` on server only — never committed |

**Pull DB before every deploy:** `./scripts/db-backup-from-upcloud.sh`

---

## Phase 1 — OS verification and server setup

### 1.1 Verify Ubuntu 24.04

```bash
ssh root@85.9.203.69
lsb_release -a
```

Expected: Ubuntu 24.04.x LTS. If different, re-provision before continuing.

### 1.2 Run server setup script (one time, idempotent)

From local machine:

```bash
scp scripts/ovh-server-setup.sh root@85.9.203.69:/root/
ssh root@85.9.203.69 "bash /root/ovh-server-setup.sh"
```

What it does:
- Updates all packages
- Installs: git, curl, unzip, rsync, sqlite3, nginx, ufw, build-essential
- Installs Node.js 20 via NodeSource (system-level, no nvm)
- Installs PM2 globally
- Opens UFW ports: SSH (22), HTTP (80), HTTPS (443)
- Removes default Nginx site
- Creates: `/var/www/guidex/`, `/var/log/guidex/`, `/var/backups/guidex/`
- Configures log rotation

### 1.3 Create swap (if not present)

```bash
ssh root@85.9.203.69 "free -h && swapon --show"
```

If Swap row shows 0B:

```bash
ssh root@85.9.203.69 "
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  free -h
"
```

---

## Phase 2 — Prepare app directory

```bash
ssh root@85.9.203.69

# Clone repo
git clone https://github.com/Yessenof/dubai-guide-site /var/www/guidex
mkdir -p /var/www/guidex/data
cd /var/www/guidex

# Install dependencies (ci = exact lock file)
npm ci
```

### Create `.env.local` on server

```bash
# Upload from local machine (safest — avoids shell history)
scp .env.local root@85.9.203.69:/var/www/guidex/.env.local
ssh root@85.9.203.69 "chmod 600 /var/www/guidex/.env.local"
```

Required keys:

```
ADMIN_EMAIL=<your-email>
ADMIN_PASSWORD_HASH=<bcrypt-hash-with-escaped-dollars>
NEXTAUTH_SECRET=<long-random-string>
NEXTAUTH_URL=https://guidex-consulting.ae
NEXT_PUBLIC_SITE_URL=https://guidex-consulting.ae
```

**Critical:** bcrypt hash must escape `$` as `\$` to prevent dotenv-expand corruption.
Verify the runtime loads it correctly (run on server after build, before pm2 start):

```bash
cd /var/www/guidex
node -e "
const { loadEnvConfig } = require('@next/env');
loadEnvConfig('/var/www/guidex', false);
const h = process.env.ADMIN_PASSWORD_HASH;
console.log('Hash present:', !!h);
console.log('Starts with \$2:', h?.startsWith('\$2'));
console.log('Length:', h?.length);
const bcrypt = require('bcryptjs');
bcrypt.compare('YOUR_PASSWORD_HERE', h).then(ok => console.log('bcrypt match:', ok));
"
```

Expected: `Starts with $2: true`, `Length: 60`, `bcrypt match: true`.

---

## Phase 3 — Database

### Check local backup state

```bash
ls -lh backups/production-db/
```

Latest verified backup: `guides.db.20260429-140304` (15 guides, 94 steps, all published, integrity ok)

### Upload DB to server

```bash
./scripts/db-restore-to-upcloud.sh backups/production-db/guides.db.latest
```

Or manually:

```bash
rsync -avz \
  backups/production-db/guides.db.20260429-140304 \
  root@85.9.203.69:/var/www/guidex/data/guides.db
chmod 664 /var/www/guidex/data/guides.db
```

### Verify on server

```bash
ssh root@85.9.203.69
sqlite3 /var/www/guidex/data/guides.db "PRAGMA integrity_check;"
sqlite3 /var/www/guidex/data/guides.db "SELECT COUNT(*) FROM guides WHERE published=1;"
sqlite3 /var/www/guidex/data/guides.db "SELECT COUNT(*) FROM steps;"
```

Expected: `ok`, 15, 94.

---

## Phase 4 — Build and run with PM2

```bash
ssh root@85.9.203.69
cd /var/www/guidex

# Build production bundle
# NEXT_PUBLIC_SITE_URL is baked at build time — .env.local must be correct first
# First deploy: PM2 is not running yet, so no race condition — plain build is safe here
npm run build

# Start with PM2 using ecosystem config
pm2 start ecosystem.config.js --env production

# Verify running
pm2 status
pm2 logs guidex-production --lines 20

# Confirm app is listening
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/
```

### Configure PM2 auto-restart on server reboot

```bash
pm2 startup systemd -u root --hp /root
pm2 save
systemctl status pm2-root
```

---

## Phase 5 — Nginx reverse proxy

### Deploy Nginx config

```bash
# From local machine
scp deploy/nginx/guidex-consulting.ae root@85.9.203.69:/etc/nginx/sites-available/

# On server
ssh root@85.9.203.69
ln -sf /etc/nginx/sites-available/guidex-consulting.ae /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### Test by IP before DNS switch

```bash
SERVER=85.9.203.69
for path in / /guides /guides/employment-visa /contact /robots.txt /sitemap.xml; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: guidex-consulting.ae" "http://$SERVER$path")
  echo "$STATUS  $path"
done
```

All should return 200.

---

## Phase 6 — Smoke tests (pre-DNS)

```bash
SERVER=85.9.203.69
for path in / /guides /guides/employment-visa /guides/golden-visa-dubai-property /contact /admin/login /robots.txt /sitemap.xml; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: guidex-consulting.ae" "http://$SERVER$path")
  echo "$STATUS  $path"
done
```

Expected: all 200. Do not switch DNS until all pass.

---

## Phase 7 — DNS switch

### DNS records to set at Tasjeel

| Type | Name | Value |
|---|---|---|
| A | `@` | `85.9.203.69` |
| A | `www` | `85.9.203.69` |

### After DNS propagation, issue SSL

```bash
ssh root@85.9.203.69

apt-get install -y certbot python3-certbot-nginx

certbot --nginx \
  -d guidex-consulting.ae \
  -d www.guidex-consulting.ae \
  --non-interactive \
  --agree-tos \
  --email <your-email> \
  --redirect

nginx -t
systemctl reload nginx
systemctl status certbot.timer
```

### Post-SSL environment update

Verify NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL in `.env.local` are `https://...`. If changed:

```bash
cd /var/www/guidex
npm run build
pm2 restart guidex-production --update-env
```

### Post-DNS smoke tests

```bash
for url in \
  https://guidex-consulting.ae/ \
  https://guidex-consulting.ae/guides \
  https://guidex-consulting.ae/guides/employment-visa \
  https://guidex-consulting.ae/contact \
  https://guidex-consulting.ae/admin/login \
  https://guidex-consulting.ae/robots.txt \
  https://guidex-consulting.ae/sitemap.xml \
  https://www.guidex-consulting.ae/; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$STATUS  $url"
done
```

---

## Phase 8 — DB backup cron

```bash
ssh root@85.9.203.69

chmod +x /var/www/guidex/deploy/scripts/server-cron-backup.sh

# Test manually first
/var/www/guidex/deploy/scripts/server-cron-backup.sh

# Install cron — runs at 3:00 AM daily
echo '0 3 * * * /var/www/guidex/deploy/scripts/server-cron-backup.sh >> /var/log/guidex/backup.log 2>&1' | crontab -

# Verify
crontab -l
ls -lh /var/backups/guidex/
```

Backups stored in `/var/backups/guidex/`, retained for 30 days.

---

## Common operations

### Restart app

```bash
ssh root@85.9.203.69
pm2 restart guidex-production --update-env
```

### Pull code update and redeploy

**MANDATORY safe deploy sequence — do NOT run `npm run build` while PM2 is serving traffic.**

Reason: Next.js deletes old static asset hashes (CSS/JS) during the compilation phase of the new build. If PM2 serves old HTML referencing those deleted hashes, users receive 500 for CSS → unstyled page. This is the Phase 6C-55 P0 incident root cause.

```bash
ssh root@85.9.203.69
cd /var/www/guidex
git pull origin main
npm ci  # if package-lock.json changed; otherwise skip
pm2 stop guidex-production          # stop BEFORE build — prevents CSS hash mismatch
nohup npm run build > /tmp/guidex-build.log 2>&1  # nohup in case SSH times out
# wait for build to complete — check: tail /tmp/guidex-build.log
pm2 start guidex-production         # start AFTER build completes
pm2 status                          # confirm online
```

The site will be unavailable for ~30 seconds during the compilation phase. Acceptable for a low-traffic content site.

**Do not use `nohup npm run build &` while PM2 is running** — the race condition window where PM2 serves stale HTML against already-deleted CSS is the exact failure mode of Phase 6C-55.

After restart, verify:
```bash
curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/
# must return 200
```

### Check app logs

```bash
ssh root@85.9.203.69
pm2 logs guidex-production --lines 50
# or
tail -f /var/log/guidex/pm2-out.log
```

### Check Nginx logs

```bash
ssh root@85.9.203.69
tail -f /var/log/nginx/guidex-error.log
```

### Manual DB backup from local

```bash
./scripts/db-backup-from-upcloud.sh
```

### Manual DB restore from local

```bash
./scripts/db-restore-to-upcloud.sh backups/production-db/guides.db.latest
```

### Update .env.local secrets

```bash
ssh root@85.9.203.69
nano /var/www/guidex/.env.local
pm2 restart guidex-production --update-env
```

### Renew SSL manually (auto-renews via certbot.timer)

```bash
ssh root@85.9.203.69
certbot renew --dry-run
```

---

## Migration checklist (completed 2026-04-29)

- [x] DB verified locally: `guides.db.20260429-140304` — 15 guides, 94 steps, integrity ok
- [x] Phase 1: Ubuntu 24.04, Node 20, PM2, Nginx, UFW, 2 GB swap
- [x] Phase 2: Repo at c127e9b, npm ci, .env.local (600 perms, 5 keys)
- [x] Phase 3: DB uploaded and verified (15 guides, 94 steps)
- [x] Phase 4: Build succeeded (62 pages, 0 errors), PM2 online, startup configured
- [x] Phase 5: Nginx deployed, nginx -t passes
- [x] Phase 6: Pre-DNS smoke tests — 8/8 routes 200
- [x] Phase 7: DNS @ + www → 85.9.203.69, SSL issued (valid to 2026-07-28), 9/9 HTTPS 200
- [x] Phase 8: Cron backup 03:00 daily, first backup verified (guides.db.20260429-140750)

---

## bcrypt hash escape rule (critical)

The `ADMIN_PASSWORD_HASH` value in `.env.local` contains `$2b$...` with multiple `$` characters.
Next.js uses dotenv-expand which treats bare `$LETTERS` as variable references.

**All `$` in the hash must be escaped as `\$` in `.env.local`.**

Generate correct hash:
```bash
cd /var/www/guidex
node -e "const b = require('bcryptjs'); b.hash('YOUR_PASSWORD', 12).then(h => console.log(h.replace(/\$/g, '\\$')))"
```

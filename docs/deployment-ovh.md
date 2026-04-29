# OVH VPS Deployment — Guidex Consulting

Last updated: 2026-04-29

This is the authoritative deployment runbook for the OVH server migration.
Reference this any time you need to deploy, restart, or recover the production app.

---

## Server facts (fill in after provisioning)

| Item | Value |
|---|---|
| Provider | OVH |
| Server name | VPS-1 |
| OS | Ubuntu 24.04 LTS |
| IP | _fill in after provisioning_ |
| SSH user | root |
| App path | `/var/www/guidex` |
| DB path | `/var/www/guidex/data/guides.db` |
| DB backups | `/var/backups/guidex/` |
| PM2 process | `guidex-production` |
| Port | 3000 (internal); 80/443 (public via Nginx) |
| Nginx config | `/etc/nginx/sites-available/guidex-consulting.ae` |
| PM2 logs | `/var/log/guidex/pm2-out.log`, `/var/log/guidex/pm2-error.log` |

---

## Source of truth

| Asset | Source of truth |
|---|---|
| Code | GitHub (`Yessenof/dubai-guide-site`) |
| Database | `/var/backups/guidex/` on server + `backups/production-db/` local |
| Secrets | `.env.local` on server only — never committed |

**Pull DB before every deploy:** `./scripts/db-backup-from-ovh.sh`

---

## Phase 1 — OS verification and server setup

### 1.1 Verify Ubuntu 24.04

```bash
ssh root@<OVH_IP>
lsb_release -a
```

Expected: Ubuntu 24.04.x LTS. If different, re-provision before continuing.

### 1.2 Run server setup script (one time)

From local machine:

```bash
# Upload setup script
scp scripts/ovh-server-setup.sh root@<OVH_IP>:/root/

# Run it — installs Node 20, PM2, Nginx, UFW
ssh root@<OVH_IP> "bash /root/ovh-server-setup.sh"
```

This is idempotent — safe to run again.

What it does:
- Updates all packages
- Installs: git, curl, unzip, rsync, sqlite3, nginx, ufw, build-essential
- Installs Node.js 20 via NodeSource (system-level, no nvm)
- Installs PM2 globally
- Opens UFW ports: SSH (22), HTTP (80), HTTPS (443)
- Removes default Nginx site
- Creates: `/var/www/guidex/`, `/var/log/guidex/`, `/var/backups/guidex/`
- Configures log rotation

---

## Phase 2 — Prepare app directory

```bash
ssh root@<OVH_IP>

# Clone repo
git clone https://github.com/Yessenof/dubai-guide-site /var/www/guidex
cd /var/www/guidex

# Install dependencies (ci = exact lock file)
npm ci
```

### Create `.env.local` on server

```bash
nano /var/www/guidex/.env.local
```

Required contents (get values from secure local copy):

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

Set permissions:
```bash
chmod 600 /var/www/guidex/.env.local
```

---

## Phase 3 — Database recovery

### Check local backup state

```bash
ls -lh backups/production-db/
```

Latest backup: `guides.db.20260429-140304` (15 guides, 94 steps, all published, integrity_check ok)

### Recover from Cloudways (if still accessible)

```bash
# From local machine — requires SSH key to Cloudways
./scripts/db-backup-from-server.sh
```

If Cloudways is not accessible, use the local backup:
```bash
ls -la backups/production-db/guides.db.latest
```

### Upload DB to OVH

```bash
# From local machine
OVH_IP=<ip> rsync -avz \
  backups/production-db/guides.db.latest \
  root@<OVH_IP>:/var/www/guidex/data/guides.db

# Or use the restore script (it creates a server-side backup and restarts PM2)
OVH_IP=<ip> ./scripts/db-restore-to-ovh.sh backups/production-db/guides.db.latest
```

### Verify on server

```bash
ssh root@<OVH_IP>
cd /var/www/guidex
sqlite3 data/guides.db ".tables"
sqlite3 data/guides.db "SELECT slug, published FROM guides ORDER BY slug;"
```

Expected: 15 rows, all published=1.

Set correct permissions:
```bash
chmod 664 /var/www/guidex/data/guides.db
```

---

## Phase 4 — Build and run with PM2

```bash
ssh root@<OVH_IP>
cd /var/www/guidex

# Build production bundle
# NEXT_PUBLIC_SITE_URL is baked at build time — .env.local must be correct first
npm run build

# Start with PM2 using ecosystem config
pm2 start ecosystem.config.js --env production

# Verify running
pm2 status
pm2 logs guidex-production --lines 20

# Confirm app is listening
curl -s http://127.0.0.1:3000/ | head -5
```

### Configure PM2 auto-restart on server reboot

```bash
# Generate systemd startup command
pm2 startup systemd

# Run the generated command (it will look like):
# env PATH=... pm2 startup systemd -u root --hp /root
# (PM2 will print the exact command — copy and run it)

# Save current process list
pm2 save
```

Verify with:
```bash
systemctl status pm2-root
```

---

## Phase 5 — Nginx reverse proxy

### Deploy Nginx config

```bash
# From local machine
scp deploy/nginx/guidex-consulting.ae root@<OVH_IP>:/etc/nginx/sites-available/

# On server
ssh root@<OVH_IP>
ln -s /etc/nginx/sites-available/guidex-consulting.ae /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Test by IP before DNS switch

```bash
# From your local machine
curl -H "Host: guidex-consulting.ae" http://<OVH_IP>/
curl -H "Host: guidex-consulting.ae" http://<OVH_IP>/guides
curl -H "Host: guidex-consulting.ae" http://<OVH_IP>/robots.txt
```

All should return 200 with Next.js HTML.

---

## Phase 6 — Smoke tests (pre-DNS)

Run these with the `Host` header override to test by IP:

```bash
OVH_IP=<ip>
for path in / /guides /guides/employment-visa /guides/golden-visa-dubai-property /contact /admin/login /robots.txt /sitemap.xml; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: guidex-consulting.ae" "http://$OVH_IP$path")
  echo "$STATUS  $path"
done
```

Expected: all 200 (admin/login may redirect to itself — 200 or 302 both OK).

Do not switch DNS until all pass.

---

## Phase 7 — DNS switch

### DNS records to set at Tasjeel

| Type | Name | Value |
|---|---|---|
| A | `@` | `<OVH_IP>` |
| A | `www` | `<OVH_IP>` |

Remove any old A records pointing to 165.245.187.15 (Cloudways).

### After DNS propagation, issue SSL

```bash
ssh root@<OVH_IP>

# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Issue cert — certbot will modify Nginx config automatically
certbot --nginx -d guidex-consulting.ae -d www.guidex-consulting.ae

# Verify HTTPS
nginx -t
systemctl reload nginx
```

Certbot adds:
- HTTPS server block on port 443
- Automatic HTTP → HTTPS redirect
- Auto-renewal via systemd timer (verify with: `systemctl status certbot.timer`)

### Post-SSL environment update

After SSL is live, verify NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL in `.env.local` are `https://...` (they should already be). If you changed them:

```bash
cd /var/www/guidex
npm run build  # rebuild required for NEXT_PUBLIC_SITE_URL bake-in
pm2 restart guidex-production --update-env
```

### Post-DNS smoke tests

```bash
for url in https://guidex-consulting.ae/ https://guidex-consulting.ae/guides https://guidex-consulting.ae/guides/employment-visa https://guidex-consulting.ae/contact https://guidex-consulting.ae/admin/login https://guidex-consulting.ae/robots.txt https://guidex-consulting.ae/sitemap.xml; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$STATUS  $url"
done
```

---

## Phase 8 — DB backup cron

### Set up daily backup on server

```bash
ssh root@<OVH_IP>

# Make backup script executable
chmod +x /var/www/guidex/deploy/scripts/server-cron-backup.sh

# Test it manually first
/var/www/guidex/deploy/scripts/server-cron-backup.sh

# Add to cron — runs at 3:00 AM daily
crontab -e
# Add this line:
# 0 3 * * * /var/www/guidex/deploy/scripts/server-cron-backup.sh >> /var/log/guidex/backup.log 2>&1

# Verify cron entry
crontab -l
```

Backups stored in `/var/backups/guidex/`, retained for 30 days.

---

## Common operations

### Restart app

```bash
pm2 restart guidex-production --update-env
```

### Pull code update

```bash
cd /var/www/guidex
git pull origin main
npm ci
npm run build
pm2 restart guidex-production --update-env
```

### Check app logs

```bash
pm2 logs guidex-production --lines 50
# or
tail -f /var/log/guidex/pm2-out.log
```

### Check Nginx logs

```bash
tail -f /var/log/nginx/guidex-error.log
```

### Manual DB backup from local

```bash
OVH_IP=<ip> ./scripts/db-backup-from-ovh.sh
```

### Manual DB restore from local

```bash
OVH_IP=<ip> ./scripts/db-restore-to-ovh.sh backups/production-db/guides.db.latest
```

### Update .env.local secrets

```bash
ssh root@<OVH_IP>
nano /var/www/guidex/.env.local
pm2 restart guidex-production --update-env
```

---

## Cloudways → UpCloud migration checklist

**MIGRATION COMPLETE 2026-04-29**

- [x] DB verified locally: `guides.db.20260429-140304` — 15 guides, 94 steps, integrity_check ok
- [x] Phase 1: Ubuntu 24.04 confirmed, Node 20 / PM2 / Nginx / UFW installed, 2 GB swap created
- [x] Phase 2: Repo cloned at c127e9b, npm ci done, .env.local created (600 perms, 5 keys present)
- [x] Phase 3: guides.db uploaded, sqlite3 verify passes (15 guides, 94 steps, integrity ok)
- [x] Phase 4: npm run build succeeded (62 pages, 0 errors), PM2 online, pm2 startup + pm2 save done
- [x] Phase 5: Nginx config deployed, nginx -t passes, nginx reloaded
- [x] Phase 6: Pre-DNS smoke tests pass (all 8 routes 200 by IP with Host header)
- [x] Phase 7: DNS A records updated at Tasjeel (@ + www → 85.9.203.69), SSL issued (Let's Encrypt, valid to 2026-07-28), post-DNS smoke tests pass (9/9 HTTPS 200, HTTP→HTTPS 301, certbot.timer active)
- [x] Phase 8: Cron backup running (0 3 * * *), first backup verified — guides.db.20260429-140750 (124K, SQLite ok)
- [ ] Cloudways cancelled — safe to cancel now (all 8 phases complete)

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

Test that production runtime loads it correctly:
```bash
cd /var/www/guidex
./scripts/runtime-env-diag.sh  # or run the inline test
```

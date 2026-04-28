# Cloudways Deployment — Guidex Consulting

## Source of Truth

| What | Source of truth | Notes |
|---|---|---|
| Application code | GitHub (`Yessenof/dubai-guide-site`) | All code, components, config, docs |
| Production DB (`guides.db`) | Cloudways server + local backups | **NOT in git** — must be backed up manually |
| Environment secrets | Local `.env.local` only | Never committed; stored out-of-band |
| Memory/docs | GitHub (committed) | `PROJECT_STATE.md`, `SESSION_LOG.md`, etc. |

**Cloudways is runtime infrastructure only.** It is not a backup. The site must survive Cloudways account suspension, server deletion, billing failure, or accidental overwrite. Keep local DB backups current.

---

## Server Facts (as deployed 2026-04-27)

| Item | Value |
|---|---|
| Provider | Cloudways DigitalOcean |
| Server IP | 165.245.187.15 |
| App ID | dgcmdxxpjx |
| SSH user | master_asumzwhebx |
| SSH socket | `~/.ssh/cm/guidex-cloudways.sock` |
| App path | `/home/master/applications/dgcmdxxpjx/public_html` |
| DB path | `/home/master/applications/dgcmdxxpjx/public_html/data/guides.db` |
| Temporary URL | https://phpstack-1618074-6379172.cloudwaysapps.com/ |
| Real domain | https://guidex-consulting.ae (not connected yet) |
| Node | v20.20.2 via nvm (user-level, no sudo) |
| PM2 process | `guidex-production` |
| Port | 3000 |
| Apache proxy | `.htaccess` — `RewriteRule ^(.*)?$ http://127.0.0.1:3000/$1 [P,L]` |

---

## SSH Access

The master SSH user requires a ControlMaster socket for non-interactive commands.
Establish it once per session in your macOS Terminal:

```bash
mkdir -p ~/.ssh/cm
ssh -fNM -S ~/.ssh/cm/guidex-cloudways.sock -o StrictHostKeyChecking=no master_asumzwhebx@165.245.187.15
# enter password when prompted
```

All subsequent commands use:
```bash
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '<command>'
```

---

## DB Backup and Restore

### Pull production DB to local machine

```bash
./scripts/db-backup-from-server.sh
```

Saves a timestamped copy to `backups/production-db/guides.db.YYYYMMDD-HHMMSS`
and updates `backups/production-db/guides.db.latest` symlink.

**Run this:**
- Before every code deployment
- After significant admin/content changes
- On a regular schedule (weekly minimum)

### Restore a local backup to production

```bash
./scripts/db-restore-to-server.sh backups/production-db/guides.db.latest
# or a specific backup:
./scripts/db-restore-to-server.sh backups/production-db/guides.db.20260427-163049
```

The script:
1. Prompts for confirmation (must type `YES`)
2. Creates a timestamped server-side backup before overwriting
3. Uploads the file
4. Restarts PM2

**Never overwrite the production DB without the script.** The confirmation and automatic server-side backup are safety rails.

---

## PM2 — Starting and Managing the App

The app starts via `~/start-guidex.sh` which sources nvm before running `npm start`:

```bash
# Start (first deploy or after server reboot)
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  pm2 start ~/start-guidex.sh --name guidex-production
  pm2 save
'

# Restart (after deploy)
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  pm2 restart guidex-production
'

# Check status and logs
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  pm2 status
  pm2 logs guidex-production --lines 30 --nostream
'
```

---

## Code Deployment (Code Change)

```bash
# 1. Pull production DB before touching anything
./scripts/db-backup-from-server.sh

# 2. rsync code to server (excludes node_modules, .next, db, env, git)
rsync -avz \
  -e 'ssh -S ~/.ssh/cm/guidex-cloudways.sock' \
  --exclude='node_modules/' \
  --exclude='.next/' \
  --exclude='data/guides.db' \
  --exclude='data/guides.db-shm' \
  --exclude='data/guides.db-wal' \
  --exclude='data/*.backup-*' \
  --exclude='backups/' \
  --exclude='.env.local' \
  --exclude='.env' \
  --exclude='.DS_Store' \
  --exclude='.git/' \
  /Users/batyr/Desktop/dubai-guide-site/ \
  master_asumzwhebx@165.245.187.15:/home/master/applications/dgcmdxxpjx/public_html/

# 3. Install dependencies
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm use 20 --silent
  cd /home/master/applications/dgcmdxxpjx/public_html
  npm ci
'

# 4. Build
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm use 20 --silent
  cd /home/master/applications/dgcmdxxpjx/public_html
  export NODE_ENV=production
  npm run build
'

# 5. Restart
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  pm2 restart guidex-production
'
```

---

## Switching to the Real Domain (guidex-consulting.ae)

Do this only when DNS and SSL are ready. NEXT_PUBLIC_* variables are baked at build time — a rebuild is mandatory when changing the domain.

```bash
# 1. Pull current production DB
./scripts/db-backup-from-server.sh

# 2. Update .env.local on server
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15\
  "sed -i 's|https://phpstack-1618074-6379172.cloudwaysapps.com|https://guidex-consulting.ae|g' \
  /home/master/applications/dgcmdxxpjx/public_html/.env.local"

# Verify (keys only, not values):
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 \
  "grep -E 'NEXT_PUBLIC_SITE_URL|NEXTAUTH_URL' \
  /home/master/applications/dgcmdxxpjx/public_html/.env.local | cut -d= -f1"

# 3. Rebuild (mandatory — NEXT_PUBLIC_* are compile-time)
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm use 20 --silent
  cd /home/master/applications/dgcmdxxpjx/public_html
  export NODE_ENV=production
  npm run build
'

# 4. Restart
ssh -S ~/.ssh/cm/guidex-cloudways.sock master_asumzwhebx@165.245.187.15 '
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  pm2 restart guidex-production
'

# 5. In Cloudways panel: add guidex-consulting.ae to the application
# 6. Point DNS A record: guidex-consulting.ae → 165.245.187.15
# 7. In Cloudways panel: enable SSL (Let's Encrypt) for guidex-consulting.ae
# 8. Smoke test on https://guidex-consulting.ae/
```

---

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Full domain, no trailing slash. Baked at build time. |
| `NEXTAUTH_URL` | Yes | Same as above. Used by NextAuth for redirects. |
| `NEXTAUTH_SECRET` | Yes | Random 32+ char string. Never share. |
| `ADMIN_EMAIL` | Yes | Login email for the admin panel. |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash. Escape `$` as `\$` in `.env.local`. |

Generate a new password hash locally:
```bash
npx tsx scripts/generate-hash.ts yourpassword
```

---

## Troubleshooting

**PM2 dead after SSH closes:**
```bash
ssh ... 'pm2 resurrect'
# if process list is empty:
ssh ... '... pm2 start ~/start-guidex.sh --name guidex-production && pm2 save'
```

**Build fails — `better-sqlite3` error:**
`npm ci` compiles native bindings. If it fails: `npm rebuild better-sqlite3` on the server using the nvm Node.

**Pages show stale content after DB update:**
Save any guide in the admin panel to trigger ISR revalidation. Or `pm2 restart guidex-production`.

**Admin login fails:**
- Verify `ADMIN_EMAIL` matches the login form exactly
- Confirm `ADMIN_PASSWORD_HASH` in `.env.local` has `\$` not bare `$`
- Regenerate: `npx tsx scripts/generate-hash.ts yourpassword`

**Apache 500 on all routes:**
Confirm `proxy_http_module` is enabled. If lost after server maintenance, ask Cloudways Support: "Please re-enable mod_proxy_http for app dgcmdxxpjx."

**Nginx serves stale cache:**
Cloudways panel → Application → Cache Management → Purge Cache.

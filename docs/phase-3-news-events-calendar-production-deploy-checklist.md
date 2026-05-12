# Phase 3 News / Events / Calendar — Production Deployment Checklist

Status: **NOT YET DEPLOYED**
Created: 2026-05-12
Applies to commits: `ed434d6` through `392a7b4` (12 commits ahead of production)

---

## 1. Executive Summary

Production cannot receive the Phase 3 code until the production database is migrated first.

The Phase 3A schema migration (`scripts/migrate-add-news-events-calendar.sql`) adds three new SQLite tables: `news_posts`, `events`, and `calendar_pages`. The Phase 3C–3E code (readers, detail routes, list pages) queries these tables at startup. If the code is deployed before the tables exist, the build will fail or the app will crash on first request.

**Required sequence — non-negotiable:**

```
1. Backup production DB locally   (run from local machine)
2. Backup production DB on server (extra safety, run via SSH)
3. Verify current DB table list
4. Apply migration SQL only if tables are missing
5. Verify migration: table list + row counts + integrity check
6. Only then: git pull → build → PM2 restart
7. Smoke test
```

Skipping or reordering steps 1–5 risks deploying broken code against an unmigrated database.

---

## 2. Current Known State

| Item | State |
|---|---|
| GitHub `origin/main` | `392a7b4` — includes Phase 3A through 3E + planning docs |
| Production server | **12 commits behind** — last deployed state is pre-Phase-3 |
| Auto-deploy | **Not configured** — no `.github/workflows/` directory |
| Deployment method | Manual: SSH → git pull → npm run build → pm2 restart |
| Production DB | Has `guides` and `steps` tables only — `news_posts`, `events`, `calendar_pages` do **not** exist yet |
| Production app | Currently running cleanly on pre-Phase-3 code — do not restart until migration + build are complete |

**Commits being deployed (Phase 3):**

```
392a7b4  docs: add Dubai Life Setup plan           (docs only — safe)
6bf0eba  docs: update memory files Phase 3E        (docs only — safe)
5a2a49d  feat: wire news events calendar lists to readers   ← requires new tables
177292d  docs: update memory files Phase 3D        (docs only — safe)
80d7cec  feat: add news events calendar detail routes       ← requires new tables
fc17f7e  docs: add old admin deprecation plan      (docs only — safe)
99245ff  docs: update project memory Phase 3C      (docs only — safe)
e0ecd26  feat: add news events calendar readers             ← requires new tables
89b0c2e  docs: add editorial AI admin rules        (docs only — safe)
563a10f  refactor: compact news events calendar hub pages   ← requires new tables
524a741  feat: add static news events calendar hub pages    (no DB reads — safe)
ed434d6  chore: add news events calendar schema             ← schema migration source
```

---

## 3. Pre-Deploy Hard Stop

**Do not run `git pull` on the production server until every item below is checked off.**

- [ ] Local production DB backup completed and verified
- [ ] Server-side DB backup completed and verified
- [ ] Production DB table list confirmed
- [ ] Migration applied (if tables missing) — or confirmed already applied (if tables exist)
- [ ] Post-migration verification complete: table counts, row counts, integrity check

---

## 4. Step 1 — Backup Production DB (run from local machine)

Run the backup script from the local project root. This pulls `data/guides.db` from the UpCloud server to `backups/production-db/` with a timestamp.

```bash
./scripts/db-backup-from-upcloud.sh
```

The script requires SSH access to `root@85.9.203.69`. It will:
1. Pull `/var/www/guidex/data/guides.db` via `rsync`
2. Save it as `backups/production-db/guides.db.YYYYMMDD-HHMMSS`
3. Update `backups/production-db/guides.db.latest` symlink
4. Run a SQLite check on the backup file

**Verify the backup succeeded:**

```bash
ls -lh backups/production-db/guides.db.latest
sqlite3 backups/production-db/guides.db.latest ".tables"
```

Expected output from `.tables`:
```
guides  steps
```

If the backup file is missing, zero bytes, or `.tables` returns nothing — **stop**. Do not proceed until the backup is confirmed good.

---

## 5. Step 2 — Production DB Migration (run via SSH on server)

SSH to the server and complete all sub-steps before leaving the session.

```bash
ssh root@85.9.203.69
```

### 5a — Navigate to app directory

```bash
cd /var/www/guidex
```

### 5b — Check git status (production must still be on pre-Phase-3 code)

```bash
git log --oneline -3
git status
```

Expected: last commit is pre-Phase-3 (e.g. `0f40d90` or earlier). Working tree clean.

### 5c — Server-side DB backup (extra safety before any DB change)

```bash
cp data/guides.db data/guides.db.pre-phase3-migration-$(date +%Y%m%d-%H%M%S)
ls -lh data/guides.db.pre-phase3-migration-*
```

Confirm the backup file exists and has non-zero size before continuing.

### 5d — Verify DB file exists

```bash
ls -lh data/guides.db
```

If `data/guides.db` does not exist — **stop**. Something is wrong with the server state.

### 5e — Check current production DB tables

```bash
sqlite3 data/guides.db ".tables"
```

Expected output (pre-migration):
```
guides  steps
```

### 5f — Apply migration only if new tables are missing

**Only run this if `news_posts`, `events`, and `calendar_pages` are NOT in the `.tables` output above.**

```bash
sqlite3 data/guides.db < scripts/migrate-add-news-events-calendar.sql
```

The migration uses `CREATE TABLE IF NOT EXISTS` for all three tables, so it is safe to re-run if already applied — it will not duplicate or overwrite data. However: only run it once per deployment.

### 5g — Verify tables exist after migration

```bash
sqlite3 data/guides.db ".tables"
```

Expected output (post-migration):
```
calendar_pages  events  guides  news_posts  steps
```

All five tables must be present before proceeding.

### 5h — Verify row counts

```bash
sqlite3 data/guides.db "
SELECT 'guides'         AS tbl, COUNT(*) AS rows FROM guides
UNION ALL
SELECT 'steps',                  COUNT(*) FROM steps
UNION ALL
SELECT 'news_posts',             COUNT(*) FROM news_posts
UNION ALL
SELECT 'events',                 COUNT(*) FROM events
UNION ALL
SELECT 'calendar_pages',         COUNT(*) FROM calendar_pages;
"
```

Expected output:
```
guides|17
steps|115
news_posts|0
events|0
calendar_pages|0
```

If `guides` ≠ 17 or `steps` ≠ 115 — **stop**. The existing data may have been corrupted. Restore from backup before continuing.

### 5i — Integrity check

```bash
sqlite3 data/guides.db "PRAGMA integrity_check;"
```

Expected output:
```
ok
```

Any output other than `ok` — **stop**. Do not deploy.

### 5j — Verify CHECK constraints on new tables (spot check)

```bash
sqlite3 data/guides.db "
SELECT name, sql FROM sqlite_master
WHERE type='table' AND name IN ('news_posts','events','calendar_pages')
ORDER BY name;
"
```

Confirm each table definition is present. Spot-check that `events` has a `date_confidence` CHECK constraint and `news_posts` has a `status` CHECK constraint — these must match the migration SQL.

### 5k — Verify indexes

```bash
sqlite3 data/guides.db "
SELECT name FROM sqlite_master WHERE type='index' ORDER BY name;
"
```

Expected: 13 indexes visible (`idx_news_posts_*`, `idx_events_*`, `idx_calendar_pages_*` plus any pre-existing indexes on `guides`/`steps`).

---

## 6. Step 3 — Code Deploy (only after migration is verified)

All sub-steps run via SSH on the server, in the same session or a new SSH session.

```bash
ssh root@85.9.203.69
cd /var/www/guidex
```

### 6a — Pull latest code

```bash
git pull origin main
```

Expected: fast-forward from pre-Phase-3 commit to `392a7b4`. Confirm no merge conflicts.

### 6b — Clear both caches before build

```bash
rm -rf .next
rm -rf node_modules/.cache
```

**Both caches must be cleared.** Turbopack persists compiled modules in `node_modules/.cache` independently of `.next`. Clearing only `.next` is insufficient when `lib/` files have changed (confirmed bug from prior session).

### 6c — Build

```bash
npm run build
```

Expected: build completes with **0 errors**. Page count should be ≥78 (pre-Phase-3 count) + 6 new list routes + 6 new detail routes + any new static pages = approximately 90 pages. Confirm the output shows the 6 new routes:

```
○  /news
○  /events
○  /calendar
○  /ru/news
○  /ru/events
○  /ru/calendar
```

And the 6 detail routes compiled (likely as dynamic/SSR):
```
λ  /news/[slug]
λ  /events/[slug]
λ  /calendar/[slug]
λ  /ru/news/[slug]
λ  /ru/events/[slug]
λ  /ru/calendar/[slug]
```

**If the build fails — do not restart PM2.** The running app is still serving the old code cleanly. Investigate the build error, fix it (may require a new commit + push + pull), then rebuild. Do not proceed until `npm run build` exits with 0 errors.

### 6d — Restart PM2

```bash
pm2 restart guidex-production
pm2 status
```

Expected: `guidex-production` status = `online`. Uptime resets to near 0. No `errored` state.

### 6e — Check PM2 logs for startup errors

```bash
pm2 logs guidex-production --lines 50
```

Look for any startup crashes or unhandled exceptions. If the app crashes on start, do not proceed to smoke tests — go to the rollback plan (§9).

---

## 7. Smoke Tests

Run all tests from outside the server (browser or curl from local machine). Confirm all responses before declaring the deploy successful.

### 7a — Existing routes must still return 200

| URL | Expected |
|---|---|
| `https://guidex-consulting.ae/` | 200 |
| `https://guidex-consulting.ae/ru` | 200 |
| `https://guidex-consulting.ae/find-my-visa` | 200 |
| `https://guidex-consulting.ae/ru/find-my-visa` | 200 |

### 7b — New list routes must return 200

| URL | Expected |
|---|---|
| `https://guidex-consulting.ae/news` | 200 — empty state renders (no news rows yet) |
| `https://guidex-consulting.ae/ru/news` | 200 — empty state renders |
| `https://guidex-consulting.ae/events` | 200 — empty state renders |
| `https://guidex-consulting.ae/ru/events` | 200 — empty state renders |
| `https://guidex-consulting.ae/calendar` | 200 — empty state renders |
| `https://guidex-consulting.ae/ru/calendar` | 200 — empty state renders |

### 7c — Unknown detail slugs must return 404

| URL | Expected |
|---|---|
| `https://guidex-consulting.ae/news/test` | 404 |
| `https://guidex-consulting.ae/events/test` | 404 |
| `https://guidex-consulting.ae/calendar/test` | 404 |
| `https://guidex-consulting.ae/ru/news/test` | 404 |
| `https://guidex-consulting.ae/ru/events/test` | 404 |
| `https://guidex-consulting.ae/ru/calendar/test` | 404 |

### 7d — Curl batch test (optional — run from local machine)

```bash
for path in / /ru /find-my-visa /ru/find-my-visa /news /ru/news /events /ru/events /calendar /ru/calendar; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://guidex-consulting.ae$path")
  echo "$status  $path"
done
```

All should return `200`.

```bash
for path in /news/test /events/test /calendar/test /ru/news/test /ru/events/test /ru/calendar/test; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://guidex-consulting.ae$path")
  echo "$status  $path"
done
```

All should return `404`.

---

## 8. SEO Safety Checks

Verify these are correct after deployment — they should be unchanged from the committed code, but confirm on the live site.

| Check | Expected state |
|---|---|
| `/news` robots | `noindex, follow` — no content yet, must not be indexed |
| `/events` robots | `noindex, follow` |
| `/calendar` robots | `noindex, follow` |
| `/ru/news` robots | `noindex, follow` |
| `/ru/events` robots | `noindex, follow` |
| `/ru/calendar` robots | `noindex, follow` |
| Detail routes `/news/[slug]` etc. | `noindex, follow` — per Phase 3D |
| Sitemap | Must NOT include `/news`, `/events`, `/calendar` or their RU equivalents |
| Homepage | No news/events/calendar modules added |
| No content rows | `news_posts`, `events`, `calendar_pages` all have 0 rows — nothing thin to index |

To check robots meta on a live page:
```bash
curl -s "https://guidex-consulting.ae/news" | grep -i "robots"
```

Expected: `<meta name="robots" content="noindex, follow" />`

---

## 9. Rollback Plan

### If build fails (step 6c)

Do not restart PM2. The running app is still on the old code and serving correctly. Fix the build error:
1. Identify the error from `npm run build` output
2. If it requires a code fix: fix locally → commit → push → `git pull` on server → rebuild
3. Do not touch the DB during a build failure recovery

### If app crashes after PM2 restart (step 6d)

1. Check `pm2 logs guidex-production --lines 100` for the crash reason
2. If the crash is unrecoverable quickly, revert to the previous commit:

```bash
git log --oneline -15        # identify the last known-good commit hash
git checkout <prev-hash>     # detach HEAD to the pre-Phase-3 commit
npm run build
pm2 restart guidex-production
pm2 status
```

Then run smoke tests again to confirm the old version is back up.

3. Push a fix from local → `git pull` → rebuild → `pm2 restart` once the fix is ready.

### DB rollback (only if migration caused data corruption)

The DB should not be corrupted by this migration (all operations are `CREATE IF NOT EXISTS` with no data writes). If integrity issues appear:

```bash
# On server — restore from the pre-migration backup taken in step 5c
cp data/guides.db.pre-phase3-migration-<TIMESTAMP> data/guides.db
sqlite3 data/guides.db "PRAGMA integrity_check;"
sqlite3 data/guides.db ".tables"
pm2 restart guidex-production
```

Also restore from local backup if needed:
```bash
./scripts/db-restore-to-upcloud.sh   # requires typing YES to confirm
```

Run smoke tests again after any rollback.

---

## 10. What Must NOT Happen

| Action | Status |
|---|---|
| `git pull` on server before DB migration complete | **Blocked by §3 hard stop** |
| Sitemap entries for empty `/news`, `/events`, `/calendar` pages | Not added — pages are `noindex` |
| Homepage news/events/calendar modules | Not added — no homepage changes in Phase 3 |
| Inserting content rows into `news_posts`, `events`, `calendar_pages` | Not part of this deployment |
| Changes to old admin (guide CRUD) | None in Phase 3 commits |
| GTM/GA4 changes | None in Phase 3 commits |
| `proxy.ts` changes | None in Phase 3 commits |
| `lib/auth.ts` changes | None in Phase 3 commits |
| PM2 restart before build succeeds | Blocked by §6c instruction |
| Skipping post-migration row count and integrity checks | Blocked by §5h and §5i |

---

## 11. Final Deployment Report Template

Copy and fill in after deployment is complete.

```
PHASE 3 PRODUCTION DEPLOYMENT REPORT
=====================================
Date / time:
Deployed by:

PRE-DEPLOY
----------
Local DB backup path:    backups/production-db/guides.db.<TIMESTAMP>
Local backup size:
Local backup .tables:    guides  steps
Server DB backup path:   /var/www/guidex/data/guides.db.pre-phase3-migration-<TIMESTAMP>

MIGRATION
---------
Tables before migration: guides  steps
Migration command run:   sqlite3 data/guides.db < scripts/migrate-add-news-events-calendar.sql
Tables after migration:  calendar_pages  events  guides  news_posts  steps
Row counts:
  guides        = 17
  steps         = 115
  news_posts    = 0
  events        = 0
  calendar_pages = 0
Integrity check:         ok

CODE DEPLOY
-----------
git pull result:         fast-forward to 392a7b4
.next cleared:           yes
node_modules/.cache cleared: yes
Build result:            success / 0 errors
Page count:
PM2 restart:             guidex-production online
PM2 uptime after restart:

SMOKE TESTS
-----------
/                        200
/ru                      200
/find-my-visa            200
/ru/find-my-visa         200
/news                    200
/ru/news                 200
/events                  200
/ru/events               200
/calendar                200
/ru/calendar             200
/news/test               404
/events/test             404
/calendar/test           404
/ru/news/test            404
/ru/events/test          404
/ru/calendar/test        404

SEO CHECKS
----------
/news robots meta:       noindex, follow
/events robots meta:     noindex, follow
/calendar robots meta:   noindex, follow
Sitemap includes /news:  no
Homepage unchanged:      yes

ROLLBACK
--------
Rollback needed:         no / yes — reason: ________________

SIGN-OFF
--------
Deploy complete and verified: yes / no
```

# Post-Deploy SEO & Uptime Checklist

**Purpose:** Run after every production deploy to confirm the site is up, healthy, and serving correct content. Takes ~2 minutes.

---

## Quick check (paste and run)

```bash
# Run this block from any terminal after deploying
BASE="https://guidex-consulting.ae"
for route in "/" "/ru" \
  "/calendar/october-2026-dubai-calendar" "/ru/calendar/october-2026-dubai-calendar" \
  "/calendar/september-2026-dubai-calendar" "/ru/calendar/september-2026-dubai-calendar" \
  "/calendar?month=2026-07" "/calendar?month=2026-08" \
  "/calendar" "/ru/calendar" \
  "/sitemap.xml" "/robots.txt"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "${BASE}${route}")
  echo "${code}  ${route}"
done
```

Expected: all routes return 200. Any non-200 is a blocker.

---

## Detailed checklist

### 1. HTTP status

| Route | Expected | Command |
|-------|----------|---------|
| / (homepage EN) | 200 | `curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/` |
| /ru (homepage RU) | 200 | `curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/ru` |
| /calendar | 200 | `curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/calendar` |
| /calendar/october-2026-dubai-calendar | 200 | |
| /ru/calendar/october-2026-dubai-calendar | 200 | |
| /calendar?month=2026-07 | 200 | |
| /calendar?month=2026-08 | 200 | |
| /sitemap.xml | 200 | `curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/sitemap.xml` |
| /robots.txt | 200 | `curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/robots.txt` |

### 2. Content checks

```bash
# Check homepage loads real content (not empty)
curl -s https://guidex-consulting.ae/ | grep -o "Guidex" | wc -l
# Expect: >0

# Check sitemap has calendar entries
curl -s https://guidex-consulting.ae/sitemap.xml | grep -o "calendar" | wc -l
# Expect: >10 (all calendar pages)

# Check robots.txt is not blocking
curl -s https://guidex-consulting.ae/robots.txt
# Expect: User-agent: * + Sitemap line visible

# Check no raw JSON on calendar page
curl -s "https://guidex-consulting.ae/calendar?month=2026-07" | grep -c '"label_en"'
# Expect: 0
```

### 3. PM2 status on server

```bash
ssh root@85.9.203.69 "pm2 status"
# Expect: guidex-production status=online, no excessive restarts
```

### 4. nginx error log (server)

```bash
ssh root@85.9.203.69 "tail -20 /var/log/nginx/guidex-error.log"
# Look for: no "connect() failed (111)" from our IP after deploy time
# Acceptable: random bot timeout errors (not our concern)
```

### 5. PM2 log for errors (server)

```bash
ssh root@85.9.203.69 "pm2 logs guidex-production --lines 20 --nostream"
# Acceptable: "Failed to find Server Action" (harmless, old-tab Server Action from previous build)
# Not acceptable: uncaught errors, crashes, OOM kills
```

---

## After-deploy: Google Search Console actions

Do these in GSC after each content deploy (new calendar pages, new guides):

1. **URL Inspection** → paste new page URL → click "Request Indexing"
2. **Sitemaps** → confirm sitemap URL is still submitted: `https://guidex-consulting.ae/sitemap.xml`
3. **Coverage** → check for any new 5xx or 404 errors (usually appears 24-48h later)
4. **Crawl Stats** → check the "Page indexing" tab 48-72h post-deploy for any server errors

If 5xx errors appear in GSC Crawl Stats, it means Googlebot hit the site during the deploy window. With the new zero-downtime deploy script, this risk is dramatically reduced.

---

## Escalation rules

| Symptom | Action |
|---------|--------|
| Any route returns 502 | SSH → `pm2 status` → if not online: `pm2 start ecosystem.config.js` |
| Any route returns 500 | SSH → `pm2 logs guidex-production --lines 50 --nostream` |
| Any route returns 404 (unexpected) | Verify DB has the record: `sqlite3 /var/www/guidex/data/guides.db "SELECT slug, status FROM calendar_pages"` |
| PM2 shows `stopped` | `pm2 start ecosystem.config.js` |
| PM2 shows `errored` | `pm2 logs guidex-production --lines 20 --nostream` then fix and restart |
| Multiple 502 in nginx log post-deploy | Run rollback: `bash /var/www/guidex/scripts/rollback.sh` |

---

## Rollback command

If a deploy breaks the site:

```bash
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

This restores `.next.bak` from before the build and does a `pm2 reload`.

---

## Related files

- `scripts/deploy-zero-downtime.sh` — new deploy script (build-first + pm2 reload)
- `scripts/rollback.sh` — restore previous build
- `docs/content-drafts/deploy/DEPLOY_502_AUDIT_6C93D.md` — root cause analysis

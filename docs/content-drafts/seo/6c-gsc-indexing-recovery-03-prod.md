# Phase 6C-GSC-INDEXING-RECOVERY-03-PROD — Production Deployment Report

**Phase:** 6C-GSC-INDEXING-RECOVERY-03-PROD  
**Date:** 2026-07-19  
**Status:** COMPLETE — all six hub pages live and indexable; database unchanged

---

## 1. Deployment objective

Deploy commit `f11ec5b` to production so the Phase 6C-GSC-INDEXING-RECOVERY-03 indexing fixes become live on `https://guidex-consulting.ae`. Six content hub pages were unblocked from indexing by removing Phase 3B legacy `noindex` directives. Sitemap freshness and hub URL coverage were also corrected.

---

## 2. Commit record

| Field | Value |
|-------|-------|
| Initial production commit (before) | `ef8b58f` |
| Approved target commit | `f11ec5b` |
| Final production commit (after) | `f11ec5b` |
| Additional hotfix commit | None |
| Commits in range | 2 (both expected) |

### Commit range (ef8b58f..f11ec5b)

| Commit | Description | Type |
|--------|-------------|------|
| `2162c99` | docs: record UpCloud DNS cutover | Docs only |
| `f11ec5b` | fix: unblock hub page indexing and fix sitemap freshness signals | Feature deploy |

Both commits inspected and confirmed expected.

---

## 3. Files deployed

**Changed by f11ec5b:**

| File | Change |
|------|--------|
| `app/(en)/(public)/events/page.tsx` | Removed `robots: { index: false }`, added RU hreflang |
| `app/ru/events/page.tsx` | Removed `robots: { index: false }`, added EN hreflang |
| `app/(en)/(public)/news/page.tsx` | Removed `robots: { index: false }`, added RU hreflang |
| `app/ru/news/page.tsx` | Removed `robots: { index: false }`, added EN hreflang |
| `app/(en)/(public)/calendar/page.tsx` | Removed `robots: { index: false }` |
| `app/ru/calendar/page.tsx` | Removed `robots: { index: false }` |
| `app/sitemap.ts` | Added `SITE_BUILD = new Date("2026-07-19")`; added 6 hub entries |
| `PROJECT_STATE.md` | Updated phase state |
| `SESSION_LOG.md` | Added session entry |
| `docs/content-drafts/seo/6c-gsc-indexing-recovery-03.md` | Audit report (new) |

---

## 4. Pre-deployment production state

| Field | Value |
|-------|-------|
| Production HEAD | `ef8b58f` |
| PM2 status | online |
| PM2 restarts | 63 |
| PM2 memory | 180 MB |
| Health (port 3000) | HTTP 200 |
| Health (nginx) | HTTP 200 |

---

## 5. Production database pre-check

| Field | Value |
|-------|-------|
| Path | `/var/www/guidex/data/guides.db` |
| Size | 888K |
| mtime | 2026-07-19 03:00:01.064876416 UTC |
| SHA-256 | `b0dc3bbd48963f5a350eb8e01b9f5b45907e8ff84d37b501016601f6eb2ab00b` |
| integrity_check | ok |
| guides (published) | 19 |
| calendar_pages (published) | 11 |
| events (published) | 7 |
| news_posts (published) | 4 |

---

## 6. Build

### Local build environment

Local filesystem restricted from Bash (macOS TCC Desktop restriction). TypeScript confirmed 0 errors at commit time in prior phase. Server build used as primary build QA.

### Server build

| Field | Value |
|-------|-------|
| Command | `NODE_ENV=production npm run build` |
| Start | 2026-07-19T19:38:04Z |
| End | 2026-07-19T19:38:41Z |
| Duration | 37 seconds |
| TypeScript result | Finished TypeScript in 15.5s — 0 errors |
| Pages generated | 92 |
| Node version | v20.20.2 |
| `npm ci` required | No (package.json unchanged) |

---

## 7. PM2 reload

| Field | Value |
|-------|-------|
| Command | `pm2 reload guidex-production --update-env` |
| Pre-reload | 2026-07-19T19:39:15Z |
| Post-reload | 2026-07-19T19:39:15Z |
| Reload duration | < 1 second (zero-downtime) |
| Observed interruption | None |

### Post-reload PM2 state

| Field | Value |
|-------|-------|
| Status | online |
| Restarts | 64 (was 63 — 1 increment) |
| Memory | 142 MB |
| CPU | 0% |
| Uptime at check | ~27 minutes |
| Ready in | 162ms |

---

## 8. Six-hub live indexability matrix

| URL | HTTP | Robots meta | X-Robots-Tag | Indexable | Canonical | Hreflang | Sitemap | lastmod |
|-----|------|-------------|--------------|-----------|-----------|----------|---------|---------|
| `/events` | 200 | NONE | NONE | ✓ | self | `ru → /ru/events` | ✓ | 2026-07-19 |
| `/ru/events` | 200 | NONE | NONE | ✓ | self | `en → /events` | ✓ | 2026-07-19 |
| `/news` | 200 | NONE | NONE | ✓ | self | `ru → /ru/news` | ✓ | 2026-07-19 |
| `/ru/news` | 200 | NONE | NONE | ✓ | self | `en → /news` | ✓ | 2026-07-19 |
| `/calendar` | 200 | NONE | NONE | ✓ | self | `ru → /ru/calendar` | ✓ | 2026-07-19 |
| `/ru/calendar` | 200 | NONE | NONE | ✓ | self | `en → /calendar` | ✓ | 2026-07-19 |

All Googlebot Smartphone checks: HTTP 200, no meta-robots, no X-Robots-Tag. Identical to normal UA.

---

## 9. Key confirmation: /ru/events noindex removed

| Check | Before | After |
|-------|--------|-------|
| `<meta name="robots">` | `content="noindex, follow"` | Not present |
| X-Robots-Tag header | None | None |
| Indexable | No | **Yes** |
| In sitemap | No | **Yes** |
| Googlebot: 200 | N/A | ✓ |

---

## 10. Hreflang QA

### Events
| Page | hreflang link rendered |
|------|----------------------|
| `/events` | `<link rel="alternate" hrefLang="ru" href="https://guidex-consulting.ae/ru/events"/>` |
| `/ru/events` | `<link rel="alternate" hrefLang="en" href="https://guidex-consulting.ae/events"/>` |

### News
| Page | hreflang link rendered |
|------|----------------------|
| `/news` | `<link rel="alternate" hrefLang="ru" href="https://guidex-consulting.ae/ru/news"/>` |
| `/ru/news` | `<link rel="alternate" hrefLang="en" href="https://guidex-consulting.ae/news"/>` |

### Calendar (pre-existing hreflang, not regressed)
| Page | hreflang link rendered |
|------|----------------------|
| `/calendar` | `<link rel="alternate" hrefLang="ru" href="https://guidex-consulting.ae/ru/calendar"/>` |
| `/ru/calendar` | `<link rel="alternate" hrefLang="en" href="https://guidex-consulting.ae/calendar"/>` |

All hreflang URLs: HTTPS, `guidex-consulting.ae` (no www), no query params, referenced pages return 200 and are indexable.

---

## 11. Sitemap live QA

`https://guidex-consulting.ae/sitemap.xml`

| Check | Result |
|-------|--------|
| HTTP status | 200 |
| Content-type | `application/xml` |
| XML parses | ✓ |
| Total entries | 108 |
| Six hub URLs present | ✓ (all 6) |
| Query-param URLs | 0 |
| HTTP (non-HTTPS) URLs | 0 |
| Duplicate `<loc>` values | 0 |
| Invalid Date entries | 0 |
| lastmod value | `2026-07-19T00:00:00.000Z` (stable SITE_BUILD) |
| Future date | No |
| Etihad Rail present | ✓ |
| July 2026 calendar present | ✓ |
| August 2026 calendar present | ✓ |

### Six hub sitemap entries

| URL | lastmod |
|-----|---------|
| `https://guidex-consulting.ae/events` | `2026-07-19T00:00:00.000Z` |
| `https://guidex-consulting.ae/calendar` | `2026-07-19T00:00:00.000Z` |
| `https://guidex-consulting.ae/news` | `2026-07-19T00:00:00.000Z` |
| `https://guidex-consulting.ae/ru/events` | `2026-07-19T00:00:00.000Z` |
| `https://guidex-consulting.ae/ru/calendar` | `2026-07-19T00:00:00.000Z` |
| `https://guidex-consulting.ae/ru/news` | `2026-07-19T00:00:00.000Z` |

---

## 12. SITE_BUILD verification

| Check | Result |
|-------|--------|
| `SITE_BUILD` defined | `const SITE_BUILD = new Date("2026-07-19")` |
| Resolves at build time | ✓ |
| Valid date | ✓ (2026-07-19) |
| Not a future date | ✓ |
| Not in the future relative to deploy | ✓ |
| Same across all sitemap entries | ✓ (`2026-07-19T00:00:00.000Z`) |
| No `Invalid Date` | ✓ |
| No runtime noise | ✓ (stable across requests) |

---

## 13. robots.txt

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/

Sitemap: https://guidex-consulting.ae/sitemap.xml
```

- No broad disallow blocks for `/events`, `/news`, `/calendar` ✓
- Sitemap URL correct (`guidex-consulting.ae`, no www, HTTPS) ✓
- No staging or localhost domain ✓

---

## 14. Dynamic calendar regression QA

| URL | HTTP | Canonical | In sitemap | Notes |
|-----|------|-----------|------------|-------|
| `/calendar?month=2026-07` | 200 | `/calendar` (hub) | No | Correct: canonical → hub |
| `/ru/calendar?month=2026-07` | 200 | `/ru/calendar` (hub) | No | Correct: canonical → hub |
| `/calendar?month=2026-08` | 200 | `/calendar` (hub) | No | Correct: canonical → hub |
| `/ru/calendar?month=2026-08` | 200 | `/ru/calendar` (hub) | No | Correct: canonical → hub |

**Behavior change vs. pre-deploy:** Query-param URLs no longer carry an explicit `noindex` (the noindex was removed from the hub page metadata which the query-param variants share). However, the canonical tag still points to the hub, so Google will treat these as canonical alternates and consolidate signals to the hub. This matches the GSC "Alternate page with proper canonical tag" category — correct behavior.

Static monthly calendar pages (`/calendar/july-2026-dubai-calendar`, etc.) retain their own canonical URLs and remain indexable. No regression.

---

## 15. Existing content regression QA

| Route | HTTP | Notes |
|-------|------|-------|
| `/` | 200 | ✓ |
| `/ru` | 200 | ✓ |
| `/guides/etihad-rail-uae` | 200 | Hreflang: en, x-default, ru ✓ |
| `/ru/guides/etihad-rail-uae` | 200 | ✓ |
| `/calendar/july-2026-dubai-calendar` | 200 | ✓ |
| `/ru/calendar/july-2026-dubai-calendar` | 200 | ✓ |
| `/calendar/august-2026-dubai-calendar` | 200 | Aug 25 + u.ae source confirmed ✓ |
| `/ru/calendar/august-2026-dubai-calendar` | 200 | ✓ |
| `/guides/employment-visa` | 200 | ✓ |
| `/events/gitex-global-2026` | 200 | ✓ |
| `/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | ✓ |
| `/robots.txt` | 200 | ✓ |
| `/sitemap.xml` | 200 | ✓ |

**Batch 01ABC content confirmed live:**
- Etihad Rail: title "How to Book and Ride Etihad Rail in the UAE" — correct ✓
- Mawlid: 25 August present, u.ae source present ✓
- July 2026 calendar: accessible ✓

---

## 16. Production logs

### PM2 startup (pm2-out.log)
```
2026-07-19T19:39:16: ▲ Next.js 16.2.3
2026-07-19T19:39:16: - Local: http://localhost:3000
2026-07-19T19:39:16: ✓ Ready in 162ms
```

### PM2 errors (pm2-error.log)
Post-reload entries show: `Error: Failed to find Server Action`. These are transient stale-client errors — expected when clients with old build hashes try to invoke server actions after a zero-downtime reload. They are not rendering failures, not database errors, and do not affect page serving or Googlebot.

### Nginx error log
Empty — no errors.

---

## 17. Production database post-check

| Field | Value |
|-------|-------|
| SHA-256 | `b0dc3bbd48963f5a350eb8e01b9f5b45907e8ff84d37b501016601f6eb2ab00b` |
| mtime | 2026-07-19 03:00:01.064876416 UTC (unchanged) |
| integrity_check | ok |
| guides (published) | 19 |
| calendar_pages (published) | 11 |
| events (published) | 7 |
| news_posts (published) | 4 |

**SHA-256 is identical to pre-deployment.** No database mutation occurred.

---

## 18. Rollback

Not required. All checks pass. No rollback condition triggered.

| Rollback trigger | Status |
|-----------------|--------|
| Build failed | No |
| TypeScript errors | No (0 errors) |
| PM2 not online | No (online) |
| Health failed | No (200) |
| Hub pages in error | No (all 200) |
| `/ru/events` still has noindex | No (confirmed removed) |
| Canonical broken | No (all self-canonical) |
| Sitemap invalid | No (valid XML, 108 entries) |
| Hub pages missing from sitemap | No (all 6 present) |
| Invalid lastmod | No (2026-07-19) |
| Regression routes failed | No (all 200) |
| DB mutation | No (SHA-256 unchanged) |
| PM2 restart loop | No (64 restarts, stable) |

---

## 19. Infrastructure

| Item | Status |
|------|--------|
| DNS changed | No |
| Nginx changed | No |
| Server infrastructure changed | No |
| Canonical domain | `https://guidex-consulting.ae` (unchanged) |
| Production server | `85.9.203.69` (UpCloud, unchanged) |

---

## 20. Known limitations

1. `SITE_BUILD` is a single date for all sitemap entries. Per-record `updated_at` dates require extending reader functions. Deferred — tracked in audit doc.
2. `/news` and `/ru/news` contain `relatedHubs` links to future hub pages (`/visas`, `/company-setup`, etc.) that return 404. Separate content architecture fix needed.
3. CalendarGrid renders no static `<a href>` links to individual month pages. Month pages are discoverable via sitemap.
4. `/ru/find-my-visa` and `/find-my-visa` have no explicit noindex but also no canonical. These are tool pages; Google's non-indexing decision on them is acceptable.

---

## 21. Manual GSC handoff

The following actions must be completed by the site owner in Google Search Console.

**Property:** `guidex-consulting.ae`

### Step 1 — Resubmit sitemap

1. Open GSC → Sitemaps
2. Confirm `https://guidex-consulting.ae/sitemap.xml` is listed
3. Click "Resubmit" or delete and resubmit to force a refresh

### Step 2 — Request indexing for six hub URLs

For each URL, in order of priority:

1. `https://guidex-consulting.ae/ru/events` ← previously reported by GSC as "noindex"
2. `https://guidex-consulting.ae/events`
3. `https://guidex-consulting.ae/ru/news`
4. `https://guidex-consulting.ae/news`
5. `https://guidex-consulting.ae/ru/calendar`
6. `https://guidex-consulting.ae/calendar`

For each URL:
1. Paste the URL into URL Inspection
2. Click "Test Live URL"
3. Confirm: URL is available to Google, indexing allowed, no robots directive blocking
4. Click "Request Indexing"
5. Record the submission date

No automatic or API-based GSC submission was performed or claimed.

### Timeline

Google controls crawl and indexing selection. Typical results in 2–4 weeks following manual URL inspection requests. No index guarantee.

---

## 22. Final production status

**LIVE AND HEALTHY.**

| Field | Value |
|-------|-------|
| Canonical domain | `https://guidex-consulting.ae` |
| Production server | `85.9.203.69` (UpCloud) |
| Production HEAD | `f11ec5b` |
| PM2 | online, 142 MB, 0% CPU |
| Health | HTTP 200 |
| Six hub pages | All indexable — confirmed via live QA |
| `/ru/events` noindex | Removed and confirmed |
| Sitemap | Valid XML, 108 entries, all 6 hubs present |
| `SITE_BUILD` | `2026-07-19T00:00:00.000Z` — stable |
| Database | Unchanged (SHA-256 identical) |
| Batch 01ABC content | Intact |

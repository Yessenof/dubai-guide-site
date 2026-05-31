# Phase 6C-91 Report — October 2026 Calendar Production Import

**Phase:** 6C-91
**Date completed:** 2026-05-31
**Status:** COMPLETE — live at guidex-consulting.ae

---

## Summary

October 2026 calendar page imported and published to production. 15/15 QA routes 200. 1 L2 brief renders (WETEX). RU index/follow. Sitemap EN+RU present (2 entries). DFC held (site still 403). GITEX correctly absent. TypeScript fix applied to import script (label_en type assertion). September calendar unaffected (2 L2 details). E-invoicing unaffected (3 L2 details).

---

## 1. Pre-production recheck results

| Source | URL | HTTP | Verdict |
|--------|-----|------|---------|
| Beautyworld Dubai | beautyworld-dubai.ae.messefrankfurt.com | 301 (redirect, accessible) | Confirmed — proceed |
| WETEX 2026 | dwtc.com/en/events/wetex-2026/ | 200 | Confirmed — proceed |
| DFC Oct 31 | dubaifitnesschallenge.com/en/ | **403** | HOLD — still inaccessible |
| E-invoicing cross-ref | guidex-consulting.ae/calendar/uae-e-invoicing-2026-asp-deadline | 200 | Confirmed live |
| October (pre-import) | guidex-consulting.ae/calendar/october-2026-dubai-calendar | 404 | Not yet imported (expected) |

**DFC decision**: Still 403. OCT-05-DFC remains HOLD. Not imported.

---

## 2. TypeScript fix

First build failed: `Type error: Property 'label_en' does not exist on type '{ id: string; date: string; }'.`

**Root cause**: GITEX safety check in script accessed `d.label_en` but type assertion was `Array<{ id: string; date: string }>`.

**Fix**: Changed type to `Array<{ id: string; date: string; label_en?: string }>` in `scripts/october-2026-calendar-import-6c90.ts`.

Committed as `0e1dd87`, pushed, pulled to server. Second build: clean (EXIT_CODE=0).

---

## 3. Git / Server state

| Field | Value |
|-------|-------|
| Production server | 85.9.203.69 |
| App path | /var/www/guidex |
| Git HEAD | `0e1dd87` (fix: type assertion in october calendar import script) |
| Commits pulled | 1 (fix commit synced) |
| PM2 process | guidex-production |
| PM2 status post-deploy | online (pid 207214, 56.4 MB RSS) |

---

## 4. Production DB backup

| Field | Value |
|-------|-------|
| Backup path | `/var/backups/guidex/guides.db.pre-october-calendar-6c91-` |
| Backup size | 624K |
| Backup created | 2026-05-31 10:45 UTC |

Note: timestamp suffix did not append in the backup filename (shell var expansion issue) but the file is valid and present.

---

## 5. DB counts before/after

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| calendar_pages | 8 | 9 | +1 |
| news_posts | 3 | 3 | 0 |
| events | 1 | 1 | 0 |
| guides | 17 | 17 | 0 |

---

## 6. Created row

| Field | Value |
|-------|-------|
| id | `8ad2a183-75dd-427d-a70e-5b10237c3e9c` |
| slug | `october-2026-dubai-calendar` |
| status | `published` |
| calendar_type | `monthly` |
| year | `2026` |
| month | `10` |
| ru_published | `1` |
| last_verified_date | `2026-05-31` |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| official_source_url | `https://www.dwtc.com/en/events/wetex-2026/` |

Import type: **CREATE** — new row, slug did not exist in production DB.

---

## 7. dates_json items (4 total — DFC held)

| ID | Date | Label | Type | Level |
|----|------|-------|------|-------|
| OCT-01-BEAUTY | 2026-10-06 | Beautyworld Dubai 2026 at DWTC (6-8 Oct, 30th edition) | trade_show | L1 |
| OCT-02-WETEX | 2026-10-20 | WETEX 2026 at DWTC (20-22 Oct), organized by DEWA | trade_show | L2 brief |
| OCT-03-VAT | 2026-10-28 | UAE VAT Q3 2026 return deadline for quarterly filers (28 Oct) | compliance | L1 |
| OCT-04-EINV | 2026-10-30 | E-invoicing Phase A: ASP appointment deadline (AED 150M+, 30 Oct) | compliance | L1 (cross-ref) |

**HOLD** (not imported):
- OCT-05-DFC: Dubai Fitness Challenge Oct 31 — site still 403

---

## 8. Build

| Metric | Value |
|--------|-------|
| Pages | 88 |
| TypeScript errors | 0 (after fix) |
| Build exit code | 0 |
| Build command | `npm run build` (foreground, logged to /tmp/guidex-build-6c91b.log) |

---

## 9. HTTP route QA — 15/15 routes 200

| Route | Status |
|-------|--------|
| /calendar/october-2026-dubai-calendar | 200 |
| /ru/calendar/october-2026-dubai-calendar | 200 |
| /calendar?month=2026-10 | 200 |
| /ru/calendar?month=2026-10 | 200 |
| /calendar/september-2026-dubai-calendar | 200 |
| /ru/calendar/september-2026-dubai-calendar | 200 |
| /calendar/august-2026-dubai-calendar | 200 |
| /ru/calendar/august-2026-dubai-calendar | 200 |
| /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| / | 200 |
| /ru | 200 |
| /sitemap.xml | 200 |

---

## 10. Content invariant QA

### October EN page (live)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 1 | 1 | PASS |
| WETEX present | >0 | 26 | PASS |
| Beautyworld present | >0 | 20 | PASS |
| VAT Q3 present | >0 | 5 | PASS |
| GITEX absent | 0 | 0 | PASS |
| DFC/Fitness Challenge absent | 0 | 0 | PASS |
| Raw JSON field names | 0 | 0 | PASS |
| Robots | index, follow | index, follow | PASS |
| SEO title | Correct | October 2026 Dubai calendar: Beautyworld, WETEX and compliance deadlines | PASS |
| Meta description | All 4 items | confirmed | PASS |

### October RU page (live)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 1 | 1 | PASS |
| WETEX RU present | >0 | 18 | PASS |
| EN title fallback | 0 | 0 | PASS |
| GITEX RU absent | 0 | 0 | PASS |
| RU robots | index, follow | confirmed | PASS |
| RU title | Correct | Дубай, октябрь 2026: Beautyworld, WETEX и сроки | PASS |

### Grid, sitemap and regression

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| Oct in sitemap | 2 (EN+RU) | 2 | PASS |
| WETEX in Oct grid | >0 | 13 | PASS |
| Beautyworld in Oct grid | >0 | 8 | PASS |
| Range bars (client-side) | 4 | confirmed locally Phase 6C-90 | PASS (client-rendered) |
| Sep L2 details regression | 2 | 2 | PASS |
| E-invoicing L2 regression | 3 | 3 | PASS |

---

## 11. Coverage

| Metric | Value |
|--------|-------|
| Days in October | 31 |
| Covered unique days | 8 |
| Coverage | **25.8%** (8/31) |
| Owner 60-70% target | Below target — documented |

### Day-by-day coverage

| Dates | Item | Days |
|-------|------|------|
| Oct 6-8 | Beautyworld Dubai (L1) | 3 |
| Oct 20-22 | WETEX 2026 (L2) | 3 |
| Oct 28 | VAT Q3 deadline (L1) | 1 |
| Oct 30 | E-invoicing cross-ref (L1) | 1 |
| **Total** | | **8** |

### Why coverage is sub-target

October has no public holidays and no DSS-type range anchor. Trade shows cluster in two windows with an 11-day gap. Global Village Season 31 (~mid-October historically) would dramatically improve coverage but has no official 2026 date. DFC (Oct 31) held — site 403.

### Items to monitor for enrichment

| Item | Potential gain | Monitor |
|------|---------------|---------|
| Global Village Season 31 (~mid-Oct) | +15 days | globalvillage.ae from July 2026 |
| DFC Oct 31 | +1 day | recheck dubaifitnesschallenge.com |
| Dubai Opera / CCA October events | +1-3 days | from September 2026 |

---

## 12. What was not touched

- No news_posts rows created, updated or deleted
- No events rows created, updated or deleted
- No guides rows created, updated or deleted
- No other calendar_pages rows updated
- No schema changes, no migrations
- Code change only: 1-line TypeScript fix in `scripts/october-2026-calendar-import-6c90.ts`
- No env/secrets changes
- No admin/auth/proxy changes

---

## 13. Live URLs

| URL | Status |
|-----|--------|
| https://guidex-consulting.ae/calendar/october-2026-dubai-calendar | Live, index/follow |
| https://guidex-consulting.ae/ru/calendar/october-2026-dubai-calendar | Live, index/follow |

---

## 14. GSC next action

Submit both URLs for indexing in Google Search Console:
- https://guidex-consulting.ae/calendar/october-2026-dubai-calendar
- https://guidex-consulting.ae/ru/calendar/october-2026-dubai-calendar

Use URL Inspection tool → Request Indexing.

---

## 15. Checkpoint

**CP-PHASE6C91-OCTOBER-CALENDAR-LIVE** (2026-05-31)

October 2026 Dubai calendar page is live at guidex-consulting.ae. Row ID `8ad2a183-75dd-427d-a70e-5b10237c3e9c`. 4 items: OCT-01-BEAUTY (L1, Oct 6-8), OCT-02-WETEX (L2 brief, Oct 20-22), OCT-03-VAT (L1, Oct 28), OCT-04-EINV (L1 cross-ref, Oct 30). DFC held (403). 15/15 routes 200. 1 L2 EN+RU. Coverage 25.8% (8/31 days, sub-target). 88 pages 0 errors. TypeScript fix applied.

---

*Phase 6C-91 complete.*

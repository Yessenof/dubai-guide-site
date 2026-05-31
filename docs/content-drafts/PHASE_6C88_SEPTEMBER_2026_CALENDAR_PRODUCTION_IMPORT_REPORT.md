# Phase 6C-88 Report — September 2026 Calendar Production Import

**Phase:** 6C-88
**Date completed:** 2026-05-31
**Status:** COMPLETE — live at guidex-consulting.ae

---

## Summary

September 2026 calendar page imported and published to production. 17/17 QA routes 200. 2 L2 briefs render (ATM + Corp Tax). RU index/follow. Sitemap EN+RU present. ATM Sep 14-17 confirmed from live DWTC source. Mawlid and Cityscape correctly absent. August calendar unaffected (0 ATM occurrences). Phase 6C-86 range visualization confirmed working in live production (July 28 bars, September 6 bars).

---

## 1. Git / Server state

| Field | Value |
|-------|-------|
| Production server | 85.9.203.69 |
| App path | /var/www/guidex |
| Git HEAD | `1d4650d` (docs: prepare september calendar local import qa) |
| Commits pulled | 1 (Phase 6C-87 commit synced) |
| PM2 process | guidex-production |
| PM2 status post-deploy | online (pid 205756, 128.5MB RSS) |

---

## 2. ATM Source Recheck

| Check | Result |
|-------|--------|
| DWTC ATM page URL | `dwtc.com/en/events/arabian-travel-market-exhibition-2026/` |
| HTTP response | 200 ✓ |
| Dates on page | **"14 - 17 Sep 2026"** — explicitly confirmed |
| August dates present | Not found |
| Conclusion | ATM Sep 14-17 confirmed from live official source |

No blocker. Import proceeded.

---

## 3. Production DB backup

| Field | Value |
|-------|-------|
| Backup path | `/var/backups/guidex/guides.db.pre-september-calendar-6c88-20260531-092503` |
| Backup size | 624K |
| Backup created | 2026-05-31 09:25:03 UTC |

---

## 4. DB counts before/after

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| calendar_pages | 7 | 8 | +1 |
| news_posts | 3 | 3 | 0 |
| events | 1 | 1 | 0 |
| guides | 17 | 17 | 0 |

---

## 5. Created row

| Field | Value |
|-------|-------|
| id | `915e1808-3130-4d97-9674-a5fef1d15e38` |
| slug | `september-2026-dubai-calendar` |
| status | `published` |
| calendar_type | `monthly` |
| year | `2026` |
| month | `9` |
| ru_published | `1` |
| last_verified_date | `2026-05-28` |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| official_source_url | `https://www.dwtc.com/en/events/` |

Import type: **CREATE** — new row, slug did not exist in production DB.

---

## 6. dates_json items (8 total)

| ID | Date | Label | Type | Level |
|----|------|-------|------|-------|
| SEP-01-MEE | 2026-09-01 | Middle East Energy 2026 (50th ed.) + Intersolar ME at DWTC (1-3 Sep) | trade_show | L1 |
| SEP-02-IPS | 2026-09-07 | International Property Show 2026 at DWTC (7-9 Sep) | trade_show | L1 |
| SEP-03-AIM | 2026-09-07 | Annual Investment Meeting Congress 2026 at DWTC (7-9 Sep) | conference | L1 |
| SEP-04-ATM | 2026-09-14 | Arabian Travel Market 2026 at DWTC (14-17 Sep) | trade_show | L2 brief |
| SEP-05-PLME | 2026-09-15 | Private Label Middle East 2026 at DWTC (15-17 Sep) | trade_show | L1 |
| SEP-06-SEAMLESS | 2026-09-22 | Seamless Middle East 2026 at DWTC (22-24 Sep) | trade_show | L1 |
| SEP-07-FOREX | 2026-09-22 | The Forex Expo Dubai 2026 at DWTC (22-23 Sep) | trade_show | L1 |
| SEP-08-TAX | 2026-09-30 | UAE Corp Tax FY2025 example deadline (Dec YE only) | compliance | L2 brief |

---

## 7. HTTP route QA — 17/17 routes 200

| Route | Status |
|-------|--------|
| /calendar/september-2026-dubai-calendar | 200 |
| /ru/calendar/september-2026-dubai-calendar | 200 |
| /calendar?month=2026-09 | 200 |
| /ru/calendar?month=2026-09 | 200 |
| /calendar/august-2026-dubai-calendar | 200 |
| /ru/calendar/august-2026-dubai-calendar | 200 |
| /calendar/july-2026-dubai-calendar | 200 |
| /ru/calendar/july-2026-dubai-calendar | 200 |
| /calendar/june-2026-dubai-calendar | 200 |
| /ru/calendar/june-2026-dubai-calendar | 200 |
| /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /calendar | 200 |
| /ru/calendar | 200 |
| / | 200 |
| /ru | 200 |
| /sitemap.xml | 200 |

---

## 8. Content invariant QA

### September EN page (live)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 2 | 2 | PASS |
| ATM brief (Arabian Travel Market) | >0 | 5 | PASS |
| ATM Sep 14-17 date text | >0 | 5 | PASS |
| Corp Tax brief (nine-month rule) | >0 | 2 | PASS |
| ATM in August | 0 | 0 | PASS |
| Mawlid | 0 | 0 | PASS |
| Cityscape | 0 | 0 | PASS |
| "all companies Sep 30" | 0 | 0 (false positives confirmed) | PASS |
| "December year-end" present | >0 | 6 | PASS |
| Raw JSON field names | 0 | 0 | PASS |
| Robots | index, follow | index, follow | PASS |
| Title | SEO title correct | September 2026 Dubai calendar: trade events, ATM and corporate tax deadline | PASS |

### September RU page (live)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 2 | 2 | PASS |
| ATM RU | >0 | 5 | PASS |
| RU Corp Tax brief | >0 | 2 | PASS |
| EN title fallback | 0 | 0 | PASS |
| ATM August RU | 0 | 0 | PASS |
| Mawlid RU | 0 | 0 | PASS |
| Robots RU | index, follow | index, follow | PASS |
| RU title | Correct | Дубай, сентябрь 2026: выставки, ATM и срок корпоративного налога | PASS |

### Grid, sitemap and regression

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| Sep range bars (live grid) | 6 | 6 | PASS |
| Sep in sitemap | 2 (EN+RU) | 2 | PASS |
| Aug in sitemap | 2 (EN+RU) | 2 | PASS |
| Aug L2 details | 1 | 1 | PASS |
| Aug ATM | 0 | 0 | PASS |
| July range bars (Phase 6C-86 system) | 28 | 28 | PASS |
| E-invoicing L2 details | 3 | 3 | PASS |

---

## 9. Coverage

| Metric | Value |
|--------|-------|
| Days in September | 30 |
| Unique covered days | 14 |
| Coverage | **46.7%** (14/30) |
| Target (60-70%) | Below target — documented |

### Covered dates

| Dates | Item |
|-------|------|
| Sep 1-3 | Middle East Energy + Intersolar ME |
| Sep 7-9 | International Property Show + AIM Congress |
| Sep 14-17 | Arabian Travel Market |
| Sep 22-24 | Seamless Middle East + Forex Expo |
| Sep 30 | Corp Tax example deadline |

### Why sub-target coverage is acceptable

September 2026 is Dubai's first post-summer month. Trade shows cluster in 5 windows; 16 gap days between clusters cannot be filled without Mawlid Al-Nabi (FAHR not announced) or Cityscape Dubai 2026 (no official 2026 dates). Sub-target coverage is fully documented and the page provides high-value professional content for the hospitality, property, fintech, energy, and compliance audiences.

### Hold items for future enrichment

| Item | Status | Monitor |
|------|--------|---------|
| Mawlid Al-Nabi (~Sep 14) | HOLD | fahr.gov.ae from late August |
| Cityscape Dubai 2026 | SOURCE_NEEDED | cityscape.ae from June |
| Gulf Print & Pack Sep 28-30 | Signal only | dwtc.com for direct page |

---

## 10. Phase 6C-86 range visibility — confirmed working live

The calendar range visualization deployed in Phase 6C-86 is confirmed working in production:
- July 2026: **28 range bars** — DSS fills Jul 4-31 ✓
- September 2026: **6 range bars** — MEE Sep 2-3, ATM Sep 15-17, Seamless Sep 24 ✓

---

## 11. What was not touched

- No news_posts rows created, updated or deleted
- No events rows created, updated or deleted
- No guides rows created, updated or deleted
- No other calendar_pages rows updated
- No schema changes, no migrations
- No code changes (UI fix was done in Phase 6C-86 — already live)
- No env/secrets changes
- No admin/auth/proxy changes

---

## 12. ATM confirmation

Arabian Travel Market confirmed Sep 14-17 from live DWTC source ("14 - 17 Sep 2026" on page). ATM is correctly absent from August:
- August calendar page: 0 occurrences of "Arabian Travel Market"

---

## 13. Live URLs

| URL | Status |
|-----|--------|
| https://guidex-consulting.ae/calendar/september-2026-dubai-calendar | Live, index/follow |
| https://guidex-consulting.ae/ru/calendar/september-2026-dubai-calendar | Live, index/follow |

---

## 14. GSC next action

Submit both URLs for indexing in Google Search Console:
- https://guidex-consulting.ae/calendar/september-2026-dubai-calendar
- https://guidex-consulting.ae/ru/calendar/september-2026-dubai-calendar

Use URL Inspection tool → Request Indexing.

---

## 15. Checkpoint

**CP-PHASE6C88-SEPTEMBER-CALENDAR-LIVE** (2026-05-31)

September 2026 Dubai calendar page is live at guidex-consulting.ae. Row ID `915e1808-3130-4d97-9674-a5fef1d15e38`. 8 items: SEP-01-MEE (L1), SEP-02-IPS (L1), SEP-03-AIM (L1), SEP-04-ATM (L2, Sep 14-17), SEP-05-PLME (L1), SEP-06-SEAMLESS (L1), SEP-07-FOREX (L1), SEP-08-TAX (L2). 17/17 routes 200. 2 L2 EN+RU. Coverage 46.7% (14/30 days, sub-target). Phase 6C-86 range bars working.

---

*Phase 6C-88 complete.*

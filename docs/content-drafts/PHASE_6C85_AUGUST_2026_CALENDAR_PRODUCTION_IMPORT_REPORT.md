# Phase 6C-85 Report — August 2026 Calendar Production Import

**Phase:** 6C-85
**Date completed:** 2026-05-29
**Status:** COMPLETE — live at guidex-consulting.ae

---

## Summary

August 2026 calendar page imported and published to production. 15/15 QA routes 200. 22/22 invariants pass. RU index/follow. Sitemap EN+RU present. Coverage 96.8%. ATM correctly absent. June/July/e-invoicing unaffected. CSS styled. PM2 online.

---

## 1. Git / Server state

| Field | Value |
|-------|-------|
| Production server | 85.9.203.69 |
| App path | /var/www/guidex |
| Git HEAD before pull | `81d21a9` (docs: prepare july calendar local import qa) |
| Git HEAD after pull | `b1a62a2` (docs: prepare august calendar local import qa) |
| Commits fast-forwarded | 3 (6C-82 report, 6C-83 draft pack, 6C-84 local QA) |
| PM2 process | guidex-production |
| PM2 status post-deploy | online |

---

## 2. Production DB backup

| Field | Value |
|-------|-------|
| Backup path | `/var/backups/guidex/guides.db.pre-august-calendar-6c85-20260529-104130` |
| Backup size | 616K |
| Backup created | 2026-05-29 10:41:30 UTC |

---

## 3. DB counts before/after

| Table | Before import | After import | Delta |
|-------|--------------|--------------|-------|
| calendar_pages | 6 | 7 | +1 |
| news_posts | 3 | 3 | 0 |
| events | 1 | 1 | 0 |
| guides | 17 | 17 | 0 |

---

## 4. Created row

| Field | Value |
|-------|-------|
| id | `8210213f-8a1b-45d7-9fa5-32e8bc94db5e` |
| slug | `august-2026-dubai-calendar` |
| status | `published` |
| calendar_type | `monthly` |
| year | `2026` |
| month | `8` |
| ru_published | `1` |
| last_verified_date | `2026-05-28` |
| featured_homepage | `0` |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| official_source_url | `https://www.visitdubai.com/en/festivals-and-events/dss` |

Import type: **CREATE** — new row, slug did not exist in production DB before this phase.

---

## 5. dates_json items imported (3 total)

| ID | Date | Label | Type | Level |
|----|------|-------|------|-------|
| AUG-01-DSS | 2026-08-01 | Dubai Summer Surprises 2026: final month, Back to School phase (through 30 August) | retail_offer | L2 (EN+RU brief) |
| AUG-02-DEFLEP | 2026-08-02 | Def Leppard live at Coca-Cola Arena (2 August) | venue_show | L1 |
| AUG-03-DIHAD | 2026-08-24 | DIHAD: Dubai International Humanitarian Aid and Development Conference at DWTC (24-26 August) | conference | L1 |

---

## 6. HTTP route QA — 15/15 routes 200

| Route | Status |
|-------|--------|
| /calendar/august-2026-dubai-calendar | 200 |
| /ru/calendar/august-2026-dubai-calendar | 200 |
| /calendar?month=2026-08 | 200 |
| /ru/calendar?month=2026-08 | 200 |
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

## 7. Content invariant QA — 22/22 pass

### August EN page (live)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 1 | 1 | PASS |
| DSS brief (Back to School retail phase) | >0 | 4 | PASS |
| Def Leppard label | >0 | 5 | PASS |
| DIHAD label | >0 | 4 | PASS |
| DFRE source label | >0 | 2 | PASS |
| DSS CTA href (visitdubai.com/dss) | 1 | 1 | PASS |
| ATM (must be absent) | 0 | 0 | PASS |
| Raw JSON field names | 0 | 0 | PASS |
| Title | SEO title | August 2026 Dubai calendar: Dubai Summer Surprises through 30 August | PASS |
| Meta description | Correct | Back to School + Def Leppard + DIHAD | PASS |
| Robots | index, follow | index, follow | PASS |

### August RU page (live)

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 1 | 1 | PASS |
| RU DSS brief (фаза Back to School) | >0 | 3 | PASS |
| Def Leppard RU | >0 | 5 | PASS |
| DIHAD RU | >0 | 4 | PASS |
| EN title fallback on RU | 0 | 0 | PASS |
| ATM on RU | 0 | 0 | PASS |
| Raw JSON field names RU | 0 | 0 | PASS |
| RU title | Correct | Дубай, август 2026: Dubai Summer Surprises до 30 августа | PASS |
| RU meta description | Correct | Back to School + Def Leppard + DIHAD RU | PASS |
| RU robots | index, follow | index, follow | PASS |

### Sitemap

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| August EN in sitemap | 2 (EN+RU) | 2 | PASS |
| July in sitemap | 2 | 2 | PASS |

---

## 8. Regression checks — all unaffected

| Page | Check | Result |
|------|-------|--------|
| July | L2 details count | 1 (unchanged) |
| June | L2 details count | 4 (unchanged) |
| E-invoicing | HTTP + title | 200, correct title |
| news_posts | Count | 3 (unchanged) |
| events | Count | 1 (unchanged) |
| guides | Count | 17 (unchanged) |

---

## 9. CSS / styling check

No CSS static asset path found via `href=` pattern (Next.js App Router bundles CSS into JS hydration). Page confirmed styled via 8 class attributes in rendered HTML. PM2 process online at 135.8MB RSS. No unstyled page issue.

---

## 10. Coverage

| Metric | Value |
|--------|-------|
| Days in August | 31 |
| Days covered (DSS umbrella Aug 1-30) | 30 |
| Gap days | 1 (Aug 31 — after DSS close) |
| Calendar-only coverage | **96.8%** (30/31) |
| Owner 60-70% target | **Exceeded** |

### Gap and hold items

| Item | Status |
|------|--------|
| Aug 31 | Gap — no confirmed event. DSS ends Aug 30. |
| DSS Back to School exact start | Monitor DFRE/visitdubai.com from late July |
| Modesh World 2026 standalone dates | Monitor dwtc.com from mid-June |
| Beat the Heat DXB Season 5 | Monitor beattheheatdxb.ae from mid-June |
| ATM | EXCLUDED — rescheduled to Sep 14-17 |

---

## 11. What was not touched

- No news_posts rows created, updated or deleted
- No events rows created, updated or deleted
- No guides rows created, updated or deleted
- No other calendar_pages rows updated
- No schema changes
- No migrations
- No code changes
- No env/secrets changes
- No admin/auth/proxy changes

---

## 12. ATM confirmation

Arabian Travel Market is correctly absent from the August 2026 calendar page:
- EN page: 0 occurrences
- RU page: 0 occurrences

ATM is scheduled for September 14-17 (corrected from the stale Aug 17-20 in batch2 B2-05). This will be handled in Phase 6C-86 (September local import QA).

---

## 13. Live URLs

| URL | Status |
|-----|--------|
| https://guidex-consulting.ae/calendar/august-2026-dubai-calendar | Live, index/follow |
| https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar | Live, index/follow |

---

## 14. GSC next action

Submit both URLs for indexing in Google Search Console:
- https://guidex-consulting.ae/calendar/august-2026-dubai-calendar
- https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar

Use URL Inspection tool → Request Indexing.

---

## 15. Checkpoint

**CP-PHASE6C85-AUGUST-CALENDAR-LIVE** (2026-05-29)

August 2026 Dubai calendar page is live at guidex-consulting.ae. Row ID `8210213f-8a1b-45d7-9fa5-32e8bc94db5e`. 3 items: AUG-01-DSS (L2), AUG-02-DEFLEP (L1), AUG-03-DIHAD (L1). 96.8% coverage (30/31 days). 15/15 routes 200. 22/22 invariants pass. EN+RU index/follow. Sitemap present.

---

*Phase 6C-85 complete. Next: Phase 6C-86 — September 2026 calendar local import QA (update batch2 B2-05 ATM dates first).*

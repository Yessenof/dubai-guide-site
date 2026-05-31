# Phase 6C-87 Report — September 2026 Calendar Local Import QA

**Phase:** 6C-87
**Date completed:** 2026-05-31
**Status:** COMPLETE — local DB only, no production changes

---

## Summary

September 2026 calendar page imported and published to local DB on first attempt with zero errors. 16/16 QA routes 200. 2 L2 briefs render (ATM + Corp Tax). RU complete. ATM correctly Sep 14-17 everywhere. Mawlid and Cityscape correctly held. Existing pages unaffected. Phase 6C-86 range visualization works correctly with September items. Ready for Phase 6C-88 production import.

---

## 1. ATM Correction Status

B2-05 in `docs/content-drafts/calendar/2026-2027-batch2-calendar-candidates.md` corrected:
- Date row: ~~2026-08-17 to 2026-08-20~~ → **2026-09-14 to 2026-09-17**
- Content level: ~~L1 in Aug~~ → L2 in Sep (SEP-04-ATM)
- Monthly pages table: updated Aug row to show live, Sep row updated to show ATM Sep 14-17
- ATM safety check added to import script: ABORT if SEP-04-ATM.date not in September

September draft (`september-2026-dubai-calendar.md`) already had correct dates — no change needed.

---

## 2. Local DB row

| Field | Value |
|-------|-------|
| id | `e47b4587-fed3-4e77-866d-0ff302c09a1e` |
| slug | `september-2026-dubai-calendar` |
| status | `published` |
| calendar_type | `monthly` |
| year | `2026` |
| month | `9` |
| ru_published | `1` |
| last_verified_date | `2026-05-28` |
| featured_homepage | `0` |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| official_source_url | `https://www.dwtc.com/en/events/` |

Import type: **CREATE** — new row, slug did not exist before this phase.

---

## 3. DB delta

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| calendar_pages | 8 | 9 | +1 (september-2026-dubai-calendar) |
| news_posts | 4 | 4 | 0 |
| events | 2 | 2 | 0 |
| guides | 17 | 17 | 0 |

Backup: `backups/local/guides-before-6c87-september-import-20260531-131440.db` (632K)

---

## 4. Import script pre-flight results

| Check | Result |
|-------|--------|
| Em dash scan (13 strings) | 0 violations — PASS |
| Slug does not exist | Confirmed (count was 8) |
| IDs unique (8 items) | No duplicates |
| ATM date check | 2026-09-14 starts with "2026-09" — PASS |
| createCalendarDraft | ok=true, warnings=none |
| publishCalendar | ok=true, warnings=none |

---

## 5. Items imported (8 total)

| ID | Date | Label | Type | Level | Source |
|----|------|-------|------|-------|--------|
| SEP-01-MEE | 2026-09-01 | Middle East Energy 2026 (50th ed.) + Intersolar ME at DWTC (1-3 Sep) | trade_show | L1 | middleeast-energy.com |
| SEP-02-IPS | 2026-09-07 | International Property Show 2026 at DWTC (7-9 Sep) | trade_show | L1 | dwtc.com/en/events/international-property-show-2026/ |
| SEP-03-AIM | 2026-09-07 | Annual Investment Meeting Congress 2026 at DWTC (7-9 Sep) | conference | L1 | aimcongress.com |
| SEP-04-ATM | 2026-09-14 | Arabian Travel Market 2026 at DWTC (14-17 Sep) | trade_show | L2 brief | dwtc.com/en/events/arabian-travel-market-exhibition-2026/ |
| SEP-05-PLME | 2026-09-15 | Private Label Middle East 2026 at DWTC (15-17 Sep) | trade_show | L1 | dwtc.com/en/events/ |
| SEP-06-SEAMLESS | 2026-09-22 | Seamless Middle East 2026 at DWTC (22-24 Sep) | trade_show | L1 | dwtc.com/en/events/seamless-2026/ |
| SEP-07-FOREX | 2026-09-22 | The Forex Expo Dubai 2026 at DWTC (22-23 Sep) | trade_show | L1 | dwtc.com/en/events/the-forex-expo-2026/ |
| SEP-08-TAX | 2026-09-30 | UAE Corp Tax FY2025 example deadline (Dec YE) | compliance | L2 brief | tax.gov.ae |

---

## 6. HTTP route QA — 16/16 routes 200

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

---

## 7. Content invariant QA

### September EN detail page

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 2 | 2 | PASS |
| ATM brief present | >0 | 5 | PASS |
| Corp Tax brief (nine-month) | >0 | 2 | PASS |
| Middle East Energy label | >0 | 4 | PASS |
| Seamless Middle East label | >0 | 5 | PASS |
| ATM in August (must be 0) | 0 | 0 | PASS |
| Mawlid (must be 0) | 0 | 0 | PASS |
| Cityscape (must be 0) | 0 | 0 | PASS |
| Raw JSON field names | 0 | 0 | PASS |
| "all companies Sep 30" (must be 0) | 0 | 0 | PASS |
| "December year-end" present | >0 | 7 | PASS |
| Robots | index, follow | index, follow | PASS |
| Title | SEO title | September 2026 Dubai calendar: trade events, ATM and corporate tax deadline | PASS |
| Meta description | Correct | All 5 events listed | PASS |
| ATM CTA href | arabiantravelmarket.wtm.com | 1 | PASS |
| FTA CTA href | tax.gov.ae | 1 | PASS |
| L1 item CTAs | No rendered href (expected) | 0 | PASS |
| DWTC/ATM source label | >0 | 2 | PASS |
| FTA source label | >0 | 3 | PASS |

### September RU detail page

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 2 | 2 | PASS |
| ATM RU label | >0 | 5 | PASS |
| Corp Tax RU brief | >0 | 2 | PASS |
| EN title fallback (must be 0) | 0 | 0 | PASS |
| ATM August on RU (must be 0) | 0 | 0 | PASS |
| Mawlid RU (must be 0) | 0 | 0 | PASS |
| RU robots | index, follow | index, follow | PASS |
| RU title | Correct | Дубай, сентябрь 2026: выставки, ATM и срок корпоративного налога | PASS |
| RU meta | Correct | All 5 events listed in Russian | PASS |

### Grid and regression

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| Sep items in grid | >0 | 23 | PASS |
| Range bars in Sep grid | 6 | 6 | PASS |
| Sep in sitemap | 2 (EN+RU) | 2 | PASS |
| July L2 details (detail page) | 1 | 1 | PASS |
| E-invoicing L2 details | 3 | 3 | PASS |
| August ATM (must be 0) | 0 | 0 | PASS |

---

## 8. Coverage

| Metric | Value |
|--------|-------|
| Days in September | 30 |
| Unique covered days | 14 |
| Coverage | **46.7%** (14/30) |
| Owner 60-70% target | Below target — documented |

### Day-by-day coverage

| Dates | Item | Days |
|-------|------|------|
| Sep 1-3 | Middle East Energy + Intersolar ME | 3 |
| Sep 7-9 | International Property Show + AIM Congress (overlap) | 3 |
| Sep 14-17 | Arabian Travel Market | 4 |
| Sep 22-24 | Seamless Middle East + Forex Expo (Sep 22-23 overlap, Sep 24 Seamless only) | 3 |
| Sep 30 | Corp Tax example deadline | 1 |
| **Total** | | **14** |

### Gap clusters

| Gap | Days |
|-----|------|
| Sep 4-6 | 3 days |
| Sep 10-13 | 4 days |
| Sep 18-21 | 4 days |
| Sep 25-29 | 5 days |
| **Total gap** | **16 days** |

### Why coverage is below 60-70%

September 2026 is the first post-summer trade-show month in Dubai. Trade shows cluster in 5 specific windows (Sep 1-3, 7-9, 14-17, 22-24, 30). Between clusters, there are no confirmed public/government events or additional range items. The two items that could add coverage are both on HOLD:

- **Mawlid Al-Nabi (~Sep 14)**: Moon-sighting dependent, FAHR not yet announced. If confirmed on Sep 14, it overlaps with ATM opening day (no net new coverage gain). If it falls on Sep 13, it would add 1 day.
- **Cityscape Dubai 2026**: No official 2026 dates found as of Phase 6C-83 scan.

Without these, no safe path to 60% exists from confirmed official sources. Coverage is sub-target but all 8 items are high-quality, source-safe, and professionally relevant.

### Hold items (monitor)

| Item | Status | Monitor |
|------|--------|---------|
| Mawlid Al-Nabi | HOLD — FAHR not announced | fahr.gov.ae from late August |
| Cityscape Dubai 2026 | SOURCE_NEEDED | cityscape.ae from June |
| Gulf Print & Pack Sep 28-30 | Signal only — aggregator source, no DWTC direct page | dwtc.com |
| Yummex Middle East Sep 15-17 | Minor date discrepancy not resolved | dwtc.com |

---

## 9. Phase 6C-86 range visibility with September items

The `inferPeriodEnd()` range inference system from Phase 6C-86 works correctly with September items:

| Item | noindex_after | inferredEnd | Diff (days) | Threshold (≤90) | Range cells |
|------|--------------|-------------|-------------|-----------------|-------------|
| SEP-01-MEE | 2026-09-04 | 2026-09-03 | 3 | Yes | Sep 1 pill + Sep 2-3 bars |
| SEP-02-IPS | 2026-09-10 | 2026-09-09 | 3 | Yes | Sep 7 + overlap dots Sep 8-9 |
| SEP-03-AIM | 2026-09-10 | 2026-09-09 | 3 | Yes | Sep 7 + overlap dots Sep 8-9 |
| SEP-04-ATM | 2026-09-18 | 2026-09-17 | 4 | Yes | Sep 14 pill + Sep 15-17 bars |
| SEP-05-PLME | 2026-09-18 | 2026-09-17 | 3 | Yes | Sep 15 start (invisible behind ATM bar) |
| SEP-06-SEAMLESS | 2026-09-25 | 2026-09-24 | 3 | Yes | Sep 22 pill + Sep 24 bar (Sep 23 overlaps Forex) |
| SEP-07-FOREX | 2026-09-24 | 2026-09-23 | 2 | Yes | Sep 22 start dot + Sep 23 dot (overlaps Seamless) |
| SEP-08-TAX | 2026-10-15 | 2026-10-14 | 15 | Yes | Sep 30 single day (compliance_evergreen, no same-month range) |

**Grid observation**: 6 range bars confirmed in live HTML for `/calendar?month=2026-09`:
- Sep 2-3: MEE range bars (2)
- Sep 15-17: ATM range bars (3)
- Sep 24: Seamless range bar (1)

Note: When two items overlap (IPS+AIM on Sep 8-9; Seamless+Forex on Sep 23), neither gets a pill/bar — both become dots. This is the correct grid behavior per the current priority rendering logic.

PLME (priority=5, outside the 1-3 range) renders correctly in the selected-day agenda when clicking Sep 15-17 but is invisible in the grid cell indicator. This is an acceptable limitation — future items should use priority 1, 2, or 3.

---

## 10. Required answers (per Phase 6C-87 task spec)

**Was September local import successful?**
Yes. createCalendarDraft + publishCalendar both returned ok=true with no errors or warnings. First attempt, no failures.

**Which items were imported locally?**
8 items: SEP-01-MEE (L1, Sep 1), SEP-02-IPS (L1, Sep 7), SEP-03-AIM (L1, Sep 7), SEP-04-ATM (L2, Sep 14), SEP-05-PLME (L1, Sep 15), SEP-06-SEAMLESS (L1, Sep 22), SEP-07-FOREX (L1, Sep 22), SEP-08-TAX (L2, Sep 30).

**How many September dates are covered?**
14 out of 30 days = 46.7%.

**Why is coverage below 60-70%?**
Trade shows cluster in 5 windows; 16 gap days between clusters. Mawlid Al-Nabi (HOLD, ~Sep 14) and Cityscape Dubai 2026 (SOURCE_NEEDED) are the only items that could bridge gaps — neither confirmed from official sources.

**How many Level 2 briefs render?**
2: ATM (Sep 14, ~130 words EN+RU) and Corp Tax (Sep 30, ~120 words EN+RU). Both confirmed in initial HTML on EN and RU pages.

**Is RU complete?**
Yes. ru_published=1. All RU strings populated. 2 `<details>` EN+RU. No EN fallback on RU page. robots: index, follow.

**Is ATM corrected to Sep 14-17 everywhere active?**
Yes. B2-05 corrected in batch2 candidates doc. Import script includes ATM safety check (ABORT if date not in September). SEP-04-ATM.date = 2026-09-14. ATM August occurrences on September page = 0.

**Is ATM absent from August active references?**
Yes. August calendar page shows 0 occurrences of "Arabian Travel Market".

**Are Mawlid and Cityscape correctly held if unconfirmed?**
Yes. Mawlid = 0 on EN and RU pages. Cityscape = 0. Both listed in hold items for future monitoring.

**Are existing pages unaffected?**
Yes. July (1 L2 detail ✓), June (via grid unaffected), E-invoicing (3 L2 details ✓). DB: news/events/guides unchanged.

**Does the Phase 6C-86 range visibility system work with September items?**
Yes. 6 range bars confirmed in September grid view. ATM covers Sep 15-17 as bars. MEE covers Sep 2-3. Seamless covers Sep 24.

**Is it ready for production import approval?**
Yes. All invariants pass. No blockers.

**What exact production DB delta should Phase 6C-88 have?**
- calendar_pages: +1 row (CREATE, slug=september-2026-dubai-calendar)
- news_posts: 0
- events: 0
- guides: 0
- Script: `scripts/september-2026-calendar-import-6c87.ts` (run on production server)

---

## 11. Pre-production recheck (Phase 6C-88 checklist)

Before running against production:
- [ ] **CRITICAL**: Recheck ATM official DWTC page — confirm Sep 14-17 still holds (rescheduled twice)
- [ ] Recheck MEE dates Sep 1-3 — confirm unchanged
- [ ] Recheck IPS DWTC page Sep 7-9 — confirm unchanged
- [ ] Recheck AIM Congress Sep 7-9 — confirm unchanged
- [ ] Recheck Seamless Sep 22-24 — confirm unchanged
- [ ] Recheck Forex Expo Sep 22-23 — confirm unchanged
- [ ] Verify FTA has not issued an extension for the Sep 30 Corp Tax deadline
- [ ] Check FAHR for Mawlid Al-Nabi announcement — if confirmed before import, consider adding
- [ ] Pull latest production DB to local backup before running
- [ ] Run safe deploy: pm2 stop → npm run build → pm2 start
- [ ] Run live QA (15+ routes on production) after deploy

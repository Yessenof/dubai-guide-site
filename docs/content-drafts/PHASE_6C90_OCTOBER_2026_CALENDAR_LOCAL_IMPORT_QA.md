# Phase 6C-90 Report — October 2026 Calendar Local Import QA

**Phase:** 6C-90
**Date completed:** 2026-05-31
**Status:** COMPLETE — local DB only, no production changes

---

## Summary

October 2026 calendar imported and published to local DB in two attempts (first failed on em dash in OCT-04-EINV label_ru; fixed and second attempt clean). 18/18 QA routes 200. 1 L2 brief (WETEX). 4 items imported (DFC held — site 403). GITEX absent from October. Global Village absent. E-invoicing cross-ref renders correctly in CalendarGrid. Range bars working: 4 bars in October grid (Oct 7-8, Oct 21-22). Ready for Phase 6C-91 production import.

---

## 1. Source recheck results (Phase 6C-90)

| Source | URL | HTTP | Verdict |
|--------|-----|------|---------|
| Beautyworld Dubai | beautyworld-dubai.ae.messefrankfurt.com | 200 | Confirmed — proceed |
| WETEX 2026 | dwtc.com/en/events/wetex-2026/ | 200 | Confirmed — proceed |
| DFC Oct 31 | dubaifitnesschallenge.com/en/ | **403** | HOLD — cannot reconfirm |
| GITEX 2026 | gitex.com/gitex-global-2026 | 200 | December confirmed — not October |
| E-invoicing page | /calendar/uae-e-invoicing-2026-asp-deadline | ✓ live | Cross-ref valid |

**DFC decision**: DFC site returns 403. Per hard restrictions: "Do NOT include DFC unless current official source can be rechecked." OCT-05-DFC is HOLD for this import. Will re-evaluate for Phase 6C-91 production import if site becomes accessible.

**GITEX decision**: Page text confirms "December 2026 in Dubai, United Arab Emirates." GITEX is correctly absent from October.

---

## 2. Em dash fix (first attempt failure)

First import attempt failed: `ABORT: em dash found in "DATES_JSON"`.

**Root cause**: OCT-04-EINV labels used "—" (em dash U+2014):
- `label_en: "...ASP appointment deadline for large businesses (AED 150M+) — 30 October"`
- `label_ru: "...для крупных компаний (от 150 млн дирхамов) — 30 октября"`

**Fix**: Replaced "—" with comma:
- `label_en: "...ASP appointment deadline for large businesses (AED 150M+, 30 October)"`
- `label_ru: "...для крупных компаний (от 150 млн дирхамов, 30 октября)"`

Second attempt: clean, no errors.

---

## 3. Local DB row

| Field | Value |
|-------|-------|
| id | `4f120d0d-0a61-4227-82a8-a8aac719f747` |
| slug | `october-2026-dubai-calendar` |
| status | `published` |
| calendar_type | `monthly` |
| year | `2026` |
| month | `10` |
| ru_published | `1` |
| last_verified_date | `2026-05-31` |
| featured_homepage | `0` |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| official_source_url | `https://www.dwtc.com/en/events/wetex-2026/` |

Import type: **CREATE** — new row.

---

## 4. DB delta

| Table | Before | After | Delta |
|-------|--------|-------|-------|
| calendar_pages | 9 | 10 | +1 (october-2026-dubai-calendar) |
| news_posts | 4 | 4 | 0 |
| events | 2 | 2 | 0 |
| guides | 17 | 17 | 0 |

Backup: `backups/local/guides-before-6c90-october-import-20260531-141612.db` (652K)

---

## 5. Items imported (4 total)

| ID | Date | Label | Type | Level |
|----|------|-------|------|-------|
| OCT-01-BEAUTY | 2026-10-06 | Beautyworld Dubai 2026 at DWTC (6-8 Oct, 30th edition) | trade_show | L1 |
| OCT-02-WETEX | 2026-10-20 | WETEX 2026 at DWTC (20-22 Oct), organized by DEWA | trade_show | L2 brief |
| OCT-03-VAT | 2026-10-28 | UAE VAT Q3 2026 return deadline for quarterly filers | compliance | L1 |
| OCT-04-EINV | 2026-10-30 | E-invoicing Phase A: ASP appointment deadline (AED 150M+, 30 October) | compliance | L1 (cross-ref) |

**HOLD** (not imported):
- OCT-05-DFC: Dubai Fitness Challenge Oct 31 — site 403, cannot reconfirm

---

## 6. HTTP route QA — 18/18 routes 200

All 18 routes returned 200:
- `/calendar/october-2026-dubai-calendar` through `/ru` — all 200 ✓

---

## 7. Content invariant QA

### October EN detail page

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 1 | 1 | PASS |
| WETEX brief (Water, Energy, Technology) | >0 | 3 | PASS |
| Beautyworld label | >0 | 5 | PASS |
| VAT Q3 references | >0 | 4 | PASS |
| GITEX (must be 0) | 0 | 0 | PASS |
| Global Village (must be 0) | 0 | 0 | PASS |
| DFC/Fitness Challenge (must be 0) | 0 | 0 | PASS |
| Raw JSON field names | 0 | 0 | PASS |
| Robots | index, follow | index, follow | PASS |
| Title | SEO title | October 2026 Dubai calendar: Beautyworld, WETEX and compliance deadlines | PASS |
| Meta description | Correct | All 4 items listed | PASS |

### E-invoicing cross-ref link

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| Link on detail page | Not rendered (expected — detail page shows label only) | 0 | PASS (expected) |
| Link in CalendarGrid page | Present in hydration payload | href="/calendar/uae-e-invoicing-2026-asp-deadline" | PASS |

The e-invoicing cross-ref (`detail_url`) renders as a clickable link in the CalendarGrid (`/calendar?month=2026-10`) when the user clicks on Oct 30. This is correct behavior — the detail page shows the label as text, while CalendarGrid renders it as a link in the agenda view.

### October RU detail page

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| L2 `<details>` count | 1 | 1 | PASS |
| WETEX RU brief (DEWA) | >0 | 5 | PASS |
| EN title fallback | 0 | 0 | PASS |
| GITEX RU | 0 | 0 | PASS |
| RU robots | index, follow | index, follow | PASS |
| RU title | Correct | Дубай, октябрь 2026: Beautyworld, WETEX и сроки | PASS |

### Grid and regression

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| Range bars in Oct grid | 4 | 4 | PASS |
| WETEX in Oct grid | >0 | 2 | PASS |
| Beautyworld in Oct grid | >0 | 2 | PASS |
| Oct in sitemap | 2 (EN+RU) | 2 | PASS |
| Sep L2 details | 2 | 2 | PASS |
| E-invoicing L2 | 3 | 3 | PASS |

---

## 8. Coverage

| Metric | Value |
|--------|-------|
| Days in October | 31 |
| Covered unique days (4 items, DFC held) | 8 |
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

**With DFC Oct 31 (if reconfirmed for Phase 6C-91)**: 9/31 = 29.0%

### Range bars (Phase 6C-86 system)

| Item | noindex_after | inferredEnd | Bars |
|------|--------------|-------------|------|
| OCT-01-BEAUTY | Oct 9 | Oct 8 | Oct 6 pill + Oct 7-8 bars (2) |
| OCT-02-WETEX | Oct 23 | Oct 22 | Oct 20 pill + Oct 21-22 bars (2) |
| OCT-03-VAT | Oct 29 | Oct 28 | single day — no bar |
| OCT-04-EINV | Oct 31 | Oct 30 | single day — no bar |

4 range bars total confirmed in live HTML ✓

### Why coverage is sub-target

October has no public holidays and no DSS-type range anchor. Trade shows cluster in two windows (Oct 6-8 and Oct 20-22) with 11-day gap between them. Global Village Season 31 (~mid-October historically) would dramatically improve coverage but has no official 2026 date. Coverage is honestly low; the content that IS there is high-quality and professionally relevant.

### What would raise coverage next

| Item | Potential gain | Status |
|------|---------------|--------|
| Global Village Season 31 (~mid-Oct) | +15 days or more | HOLD — monitor globalvillage.ae from July 2026 |
| DFC Oct 31 | +1 day | HOLD — recheck before Phase 6C-91 |
| CCA October concerts | +1-3 days | SOURCE_NEEDED |
| Dubai Opera October events | +1-3 days | Not yet announced |

---

## 9. Required answers (per Phase 6C-90 task spec)

**Was October local import successful?**
Yes. createCalendarDraft + publishCalendar returned ok=true. Two attempts needed (em dash fix in first attempt).

**Which items were imported locally?**
4: OCT-01-BEAUTY (L1), OCT-02-WETEX (L2), OCT-03-VAT (L1), OCT-04-EINV (L1 cross-ref).

**How many October dates are covered?**
8/31 = 25.8%. (With DFC if reconfirmed: 9/31 = 29.0%)

**Why is coverage below 60-70%?**
No public holidays, no DSS-type range anchor, no Global Village (HOLD). Trade shows in two clusters with 11-day gap. Honest coverage for confirmed items.

**How many Level 2 briefs render?**
1 (OCT-02-WETEX). EN+RU brief confirmed in initial HTML.

**Is RU complete?**
Yes. ru_published=1. All RU strings populated. 1 `<details>` EN+RU. No EN fallback. robots: index, follow.

**Is GITEX correctly excluded from October and marked December?**
Yes. GITEX confirmed December from live source. 0 GITEX occurrences on October page. Density report, source ledger, and phase report all document GITEX as December.

**Is Global Village correctly held if unconfirmed?**
Yes. 0 "Global Village" occurrences on October page. HOLD documented.

**Is DFC imported or held after source recheck?**
HELD. Site returned 403 during source recheck. OCT-05-DFC is excluded from this import. Must recheck before Phase 6C-91.

**Are existing pages unaffected?**
Yes. September (2 L2 details), e-invoicing (3 L2 details), all other routes unaffected.

**Does range visibility work with October items?**
Yes. 4 range bars confirmed in October grid (Oct 7-8 from Beautyworld, Oct 21-22 from WETEX).

**Is it ready for production import approval?**
Yes, for the 4-item version. DFC needs pre-production recheck.

**What exact production DB delta should Phase 6C-91 have?**
- calendar_pages: +1 (CREATE, slug=october-2026-dubai-calendar)
- news_posts: 0
- events: 0
- guides: 0
- Script: `scripts/october-2026-calendar-import-6c90.ts` (run on production)
- Pre-production: recheck DFC site; if accessible and Oct 31 confirmed, update script to add OCT-05-DFC before running

---

## 10. Pre-production recheck (Phase 6C-91 checklist)

- [ ] Recheck dubaifitnesschallenge.com — if accessible and Oct 31 confirmed, add OCT-05-DFC to script before production import
- [ ] Recheck Beautyworld Oct 6-8 still current
- [ ] Recheck WETEX Oct 20-22 still current
- [ ] Verify FTA VAT Q3 deadline not extended
- [ ] Confirm e-invoicing cross-ref page still live
- [ ] Pull latest production DB before running
- [ ] Run safe deploy: pm2 stop → npm run build → pm2 start
- [ ] Run live QA (18+ routes on production) after deploy

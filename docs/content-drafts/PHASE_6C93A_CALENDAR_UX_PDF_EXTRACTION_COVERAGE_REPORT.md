# Phase 6C-93A Report — Calendar UX, PDF Extraction & Event Coverage Recovery

**Phase:** 6C-93A
**Date completed:** 2026-05-31
**Status:** COMPLETE — local changes only, no deploy, no DB write, no push

---

## Summary

7 audit/spec/candidate documents created. Code patch applied (long-range UX fix + color improvement). Build: 88 pages, 0 errors. July/August calendar bars removed. No production changes.

---

## Files created

| File | Type |
|------|------|
| docs/content-drafts/calendar/CALENDAR_UX_AUDIT_6C93A.md | Part A — UX audit |
| docs/content-drafts/calendar/CALENDAR_UX_REDESIGN_SPEC_6C93A.md | Part B — Redesign spec |
| docs/content-drafts/calendar/CALENDAR_UX_QA_6C93A.md | Part C — QA notes |
| docs/content-drafts/compliance/PDF_MAKE_FORTUNE_2026_EXTRACTION_MATRIX.md | Part D — PDF extraction |
| docs/content-drafts/calendar/CALENDAR_SOURCE_COVERAGE_AUDIT_AUG_DEC_2026.md | Part E — Coverage audit |
| docs/content-drafts/daily-radar/6C93A-calendar-import-candidate-pack.md | Part F — Import candidates |
| docs/content-drafts/calendar/CALENDAR_SEO_RAG_CONNECTION_AUDIT_6C93A.md | Part G — SEO/RAG audit |

---

## Files changed (code)

| File | Change |
|------|--------|
| lib/calendar-helpers.ts | real_estate_event: #1B2E4B → #0D9488 (teal); business_event: #1B2E4B → #2D5FA3 (soft navy) |
| components/calendar/CalendarGrid.tsx | LONG_RANGE_DAYS=7 threshold; expandRanges skip for ≥7d; mid-range bar 4px→2px opacity-40; dot size 7px→6px opacity 55%→35%; legend colors updated |

---

## UX changes made (Part C)

### Root cause fixed
DSS (Jul 3, noindex_after Sep 1): `inferPeriodEnd` returned 2026-08-31 (60-day range, ≤ 90 threshold). Previously expanded to 29 bars in July. Same for Modesh. AUG-01-DSS expanded all 31 August days.

### Fix applied
`LONG_RANGE_DAYS = 7` constant. Items with inferred range ≥ 7 days now appear on their start date only — no grid expansion. Long-range items with explicit `period_end` ≥ 7 days show only on first visible day of month.

### Visual results
- July: Jul 3 = DSS chip. Jul 4-31 = clean.
- August: Aug 1 = DSS chip. Aug 2-31 = clean (except Aug 24-26 DIHAD = short-range 3 days, kept).
- September/October: short-range items (2-6 days) keep expansion but with 2px/40% bars instead of 4px/100%.
- Colors: business chips now #2D5FA3 (medium blue), property = #0D9488 (teal).

### What is NOT changed
- Mobile agenda behavior
- Filter chips
- Month navigation
- Agenda cards (AgendaCard, AgendaRow)
- Server-side data loading
- Route structure
- DB schema

---

## Current known issues (not fixed in this phase)

| Issue | Status | Phase to fix |
|-------|--------|-------------|
| short_label_en "Dubai Summer Surprises 2026" too long for chip | Known | Next import phase — update DB field to "DSS" |
| period_end not set on any live item | Known | Future import scripts |
| No Guidex detail pages for events (except e-invoicing) | Known | Future events phases |
| August thin content (3 items) | Known | KHDA school source needed |
| KHDA school dates not captured | Known | Research phase needed |

---

## Exact counts

### Current items by month (local DB)
| Month | Items | Unique days | Coverage |
|-------|-------|------------|----------|
| May 2026 | 4 | 9 | 29% |
| June 2026 | 8 | 14 | 47% |
| July 2026 | 3 | 3 (start days) | — |
| August 2026 | 3 | 4 | — |
| September 2026 | 8 | 14 | 47% |
| October 2026 | 4 | 8 | 26% |
| Nov 2026 | 0 | 0 | 0% |
| Dec 2026 | 0 | 0 | 0% |
| Jan 2027 | 0 | 0 | 0% |

### Candidate items by month (Part F)
| Month | READY | Pending | Signal |
|-------|-------|---------|--------|
| November 2026 | 3 (DDW, Downtown Design, Big5) | 1 (DFC) | 2 |
| December 2026 | 3 (Commemoration, National Day, GITEX) | 1 (DSF) | 2 |
| January 2027 | 2 (E-inv go-live, VAT Q4) | 1 (AML) | 2 |

### PDF content candidates (Part D)
- Total extracted: 26 candidates
- Calendar/reminder candidates: 19
- 2027 recurring candidates: 9
- Blocked (needs official source): 7

---

## Build verification

| Metric | Value |
|--------|-------|
| Pages | 88 |
| TypeScript errors | 0 |
| Build exit code | 0 |
| Local DB writes | 0 |
| Production DB writes | 0 |
| Deploy | None |
| Push | None |

---

## Next phase recommendation

**Immediate (in order):**

1. **Phase 6C-93B** — Review and approve local UX patch → push code only (no DB changes). Run local dev server first for visual confirmation.
2. **Phase 6C-94** — November 2026 calendar: local import QA (DDW + Downtown Design + Big 5). DFC HOLD until R02 confirms site recovery.
3. **Phase 6C-95** — December 2026 calendar: local import QA (Commemoration Day Dec 1 + National Day Dec 2-3 + GITEX Dec 7-11). Most value-per-item of any upcoming month.
4. **Phase 6C-96** — January 2027 calendar: E-invoicing go-live Jan 1 + VAT Q4 Jan 28.
5. **Phase 6C-97** — uae-business-compliance-calendar-2026-2027 draft calendar page: import 9 confirmed items from the compliance brief draft already in DB. Connect to individual compliance guide drafts.

**Compliance content path (parallel track):**
- Verify FTA source for corporate tax return 9-month rule → publish September-2026 supporting guide
- Verify FTA source for VAT threshold → publish uae-vat-registration-threshold guide (draft exists)
- Source AML January window from MOEI → import January 2027 AML calendar item

---

*Phase 6C-93A complete. No deploy, no push, no production changes.*

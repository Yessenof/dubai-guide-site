# July 2026 Calendar Density Update

**Phase:** 6C-80
**Date:** 2026-05-27
**Status:** Docs only — no DB, no import

---

## Current July Coverage

| Metric | Value |
|--------|-------|
| Days in July | 31 |
| Items in current draft | 2 (JUL-03-DSS, JUL-03-MODESH) |
| New items confirmed this phase | 1 (JUL-03-KHAIR) |
| Total draft items after 6C-80 | 3 |

### Already-live (separate calendar page — do NOT duplicate)

| Item | Date | Page |
|------|------|------|
| E-invoicing TAX-05A | July 1 | uae-e-invoicing-2026-asp-deadline |

---

## Coverage Table

| Date | Item | Source status |
|------|------|--------------|
| Jul 1 | E-invoicing (separate page) | live |
| Jul 2 | — (only gap in July) | — |
| Jul 3 | JUL-03-DSS (L2) — DSS opens | confirmed |
| Jul 3 | JUL-03-MODESH (L1) — Modesh World opens | confirmed (DSS umbrella) |
| Jul 3–4 | JUL-03-KHAIR (L1) — Muntazah Al Khairan @ Dubai Opera | confirmed |
| Jul 4–31 | Covered by JUL-03-DSS span (Jul 3–Aug 30) | confirmed |

**Source-safe coverage:** Jul 3–31 = 29 days = **93.5% of July calendar** (29/31 days)
**Combined with e-invoicing page:** 30/31 = **97%**
**Only gap:** Jul 2 (1 day) — no confirmed source-safe content

---

## Source-Safe Coverage (calendar-only items)

| Phase | Source-safe days | Coverage |
|-------|-----------------|----------|
| Phase 6C-80 baseline (2 items: DSS + Modesh) | 29 (Jul 3–31 via DSS span) | 93.5% |
| After adding JUL-03-KHAIR | 29 (same DSS span, Khair within Jul 3) | 93.5% |
| Including e-invoicing Jul 1 (separate page) | 30/31 | **97%** |

Note: DSS is one umbrella campaign covering Jul 3–Aug 30. The 29-day July coverage comes from DSS's span, not individual daily items. The calendar will show 3 items total: DSS (anchor), Modesh World (component), Muntazah Al Khairan (opening weekend).

---

## Items by Content Level

| Level | Item | Status |
|-------|------|--------|
| L2 (indexed brief) | JUL-03-DSS | Ready — brief written in draft |
| L1 (label + CTA) | JUL-03-MODESH | Ready |
| L1 (label + CTA) | JUL-03-KHAIR | Ready — new this phase |

**L3 (full standalone page):** Not needed. DSS at L2 brief is sufficient for the calendar page.

---

## Hold / Source Sprint Items

| Item | Block reason | Check by |
|------|-------------|----------|
| Beat the Heat DXB Season 5 | No 2026 announcement | beattheheatdxb.ae from ~mid-June |
| Great Dubai Summer Sale 2026 dates | Not announced by DFRE | visitdubai.com from ~Jul 10 |
| Modesh World 2026 specific dates/hours | No DWTC 2026 page | dwtc.com from ~mid-June |
| Timur Bey 2 at CCA Jul 9 | Signal_only (Spotify/Bandsintown) | coca-cola-arena.com or Platinumlist CCA page |
| Cinema Akil July 2026 programme | Not announced | cinemaakil.com |
| Expo City July events | No events confirmed | expocitydubai.com |

---

## Still-Empty Dates in July

| Date | Notes |
|------|-------|
| Jul 2 (Thursday) | No confirmed source-safe content. Schools may have last day Jul 2 for some Sep-start schools (conflicting KHDA data). Low calendar value. |

**Coverage gap:** 1 day (Jul 2). Acceptable — no confirmed source-safe item exists for this date.

---

## Import Readiness

**Recommendation: A — July is ready for local import QA.**

| Criteria | Status |
|----------|--------|
| At least 60% coverage | EXCEEDED — 93.5% calendar-only |
| All items source-safe | YES — official or authorized partner sources |
| No Beat the Heat 2025 dates used | CONFIRMED — Beat the Heat excluded |
| No Modesh World 2025 dates used | CONFIRMED — only DSS anchor Jul 3 |
| No unsupported phase dates in brief | CONFIRMED — brief accurately says "dates to be announced" |
| No internal notes in en_notes/ru_notes | CONFIRMED — clean user-facing notes only |
| EN/RU parity | YES — all items have EN and RU labels |
| No duplicate with e-invoicing Jul 1 | CONFIRMED — not added here |
| TypeScript import script needed | YES — Phase 6C-81 next |

### Approved import delta (Phase 6C-81 when approved)

| Operation | Detail |
|-----------|--------|
| CREATE july-2026-dubai-calendar | New row — does not exist in production yet |
| dates_json | 3 items: JUL-03-DSS (L2), JUL-03-MODESH (L1), JUL-03-KHAIR (L1) |
| Status | published |
| EN/RU strings | title, summary, body, notes, seo_title, meta_description |

**Note:** July calendar page does NOT yet exist in production. This is a CREATE operation (new row), not an UPDATE. Use `createCalendarDraft` + `publishCalendar`.

---

## Post-Import Enrichment Backlog (July)

These items can be added in a future enrichment batch once announced:

| Item | Expected announcement |
|------|----------------------|
| Beat the Heat DXB Season 5 lineup + dates | ~mid-June 2026 |
| Great Dubai Summer Sale start date | ~Jul 10-17 2026 |
| Modesh World 2026 dedicated page | ~mid-June 2026 |
| Timur Bey 2 at CCA Jul 9 (if CCA confirms) | Check CCA now or after DSS opens |
| Cinema Akil summer programme 2026 | ~late June |

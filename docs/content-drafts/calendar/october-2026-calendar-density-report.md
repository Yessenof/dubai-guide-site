# October 2026 Calendar — Density Report

**Phase:** 6C-89
**Date drafted:** 2026-05-31
**Companion draft:** october-2026-dubai-calendar.md

---

## Coverage summary

| Metric | Value |
|--------|-------|
| Days in month | 31 |
| Confirmed covered days | 9 |
| Coverage | **29.0%** (9/31) |
| Owner 60-70% target | Below target |
| 90% active-month target | Not achievable with current confirmed items |

---

## Day-by-day coverage

| Date range | Item | Days |
|------------|------|------|
| Oct 6-8 | Beautyworld Dubai 2026 (OCT-01-BEAUTY, L1) | 3 |
| Oct 20-22 | WETEX 2026 (OCT-02-WETEX, L2) | 3 |
| Oct 28 | UAE VAT Q3 2026 return deadline (OCT-03-VAT, L1) | 1 |
| Oct 30 | E-invoicing ASP cross-ref (OCT-04-EINV, L1) | 1 |
| Oct 31 | DFC launch day (OCT-05-DFC, L1) | 1 |
| **Total** | | **9** |

---

## Gap clusters

| Gap | Days |
|-----|------|
| Oct 1-5 | 5 days (before Beautyworld) |
| Oct 9-19 | 11 days (between Beautyworld and WETEX) |
| Oct 23-27 | 5 days (between WETEX and VAT deadline) |
| Oct 29 | 1 day (between VAT Q3 and e-invoicing) |
| **Total gap** | **22 days** |

---

## Range visualization (Phase 6C-86 system)

With the `inferPeriodEnd()` system deployed in Phase 6C-86, the following range bars will appear in the October grid:

| Item | noindex_after | inferredEnd | Diff | Range bars |
|------|--------------|-------------|------|------------|
| OCT-01-BEAUTY | 2026-10-09 | 2026-10-08 | 3d ≤ 90 | Oct 6 pill + Oct 7-8 bars |
| OCT-02-WETEX | 2026-10-23 | 2026-10-22 | 3d ≤ 90 | Oct 20 pill + Oct 21-22 bars |
| OCT-03-VAT | 2026-10-29 | 2026-10-28 | 1d | Same as start — no bar |
| OCT-04-EINV | 2026-10-31 | 2026-10-30 | 1d | Same as start — no bar |
| OCT-05-DFC | 2026-11-02 | 2026-11-01 | 2d ≤ 90 | Oct 31 start only (Nov 1 is outside October) |

**Grid visual result:** 4 range bars visible in October grid (Oct 7, Oct 8, Oct 21, Oct 22).

---

## Why coverage is sub-target

October 2026 has no public holidays and trade shows cluster in two windows:
- Early October: Beautyworld (Oct 6-8)
- Late October: WETEX (Oct 20-22), compliance anchors (Oct 28-31)

The 11-day gap from Oct 9-19 and the 5-day gap from Oct 1-5 cannot be filled with confirmed official items. The following HOLD items could significantly change coverage:

| Hold item | Potential coverage gain | Estimated dates |
|-----------|------------------------|-----------------|
| Global Village Season 31 | ~15+ days (open daily, runs through spring) | Est. mid-Oct 2026 based on historical pattern (Season 30 opened Oct 15) |
| Cityscape Dubai 2026 | 3-5 days | Unknown — SOURCE_NEEDED |
| CCA October concerts | 1-3 days | No confirmed events yet |
| Dubai Opera October events | 1-3 days | Not yet announced |

**If Global Village announces mid-October opening:** Coverage could jump to ~50-60%+ with a range item spanning Oct 15-31.

---

## Content level distribution

| Level | Items | Notes |
|-------|-------|-------|
| L2 (brief) | 1 | OCT-02-WETEX (energy/sustainability trade show) |
| L1 (label + CTA) | 4 | Beautyworld, VAT Q3, E-invoicing cross-ref, DFC |
| L3 (existing page) | 1 | E-invoicing page (OCT-04-EINV points to live /calendar/uae-e-invoicing-2026-asp-deadline) |

---

## Comparison with other months

| Month | Coverage | Notes |
|-------|----------|-------|
| June 2026 | 83% | Mallathon + ACW/Rumi gave good coverage |
| July 2026 | ~94% | DSS umbrella covers Jul 3-31 |
| August 2026 | 97% | DSS umbrella covers Aug 1-30 |
| September 2026 | 47% | Trade shows cluster, 16 gap days |
| October 2026 | 29% | Trade shows cluster, 22 gap days |

October and September share the "professional trade show cluster" pattern. Both are below the 60-70% threshold without a range anchor like DSS or Global Village.

---

## What would raise October coverage next

Priority actions to improve October:
1. **Monitor globalvillage.ae** for Season 31 opening announcement (expected July-August 2026). If Oct 15-ish opening confirmed, add as L2 range item — this alone would add ~15 days.
2. **Recheck CCA** when the bot-protection queuing system is accessible for October concerts.
3. **Recheck Dubai Opera** from August 2026 for October show announcements.
4. **Recheck dubaifitnesschallenge.com** — site returns 403 now; if Oct 31 is confirmed, the L1 entry is ready.
5. **Monitor for Cityscape Dubai 2026** official dates.

---

*Report prepared Phase 6C-89. For import sequence, see Phase 6C-90 (October local QA).*

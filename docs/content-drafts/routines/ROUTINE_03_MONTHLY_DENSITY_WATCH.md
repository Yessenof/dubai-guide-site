# Routine 03 — Monthly Density Watch

**Routine ID:** GUIDEX-R03
**Schedule:** 07:00 UTC daily
**Output:** `docs/content-drafts/daily-radar/YYYY-MM-DD-density-watch.md`
**Context mode:** Standard (compact) — do NOT use 1M context

---

## Purpose

Track coverage density for the three upcoming target months (November 2026, December 2026, January 2027). Compare confirmed items against the 90% active-month coverage target. Identify gap clusters that need new items and flag which gaps can be filled from already-verified sources vs. which require new research.

This routine calculates and reports only. It does not import. It does not publish.

---

## Schedule recommendation

Daily at 07:00 UTC (after Routines 01 and 02). Reads their outputs.

---

## Files to read (compact context — read only these)

1. `docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md` — safety rules
2. `docs/content-drafts/daily-radar/[TODAY]-event-radar.md` (Routine 01 output, if exists)
3. `docs/content-drafts/daily-radar/[TODAY]-source-verification.md` (Routine 02 output, if exists)

Do NOT read full source ledgers or month calendar files. Context must stay compact.

---

## Coverage baseline (as of Phase 6C-91)

### Live months (production)

| Month | Days covered | Coverage | Status |
|-------|-------------|----------|--------|
| June 2026 | live | live | Live |
| July 2026 | live (DSS Jul 1-31) | ~97% | Live |
| August 2026 | live | live | Live |
| September 2026 | 14/30 | 46.7% | Live — sub-target |
| October 2026 | 8/31 | 25.8% | Live — sub-target |

### Target months (not yet imported)

| Month | Confirmed days | Coverage | Gap |
|-------|---------------|----------|-----|
| November 2026 | See below | See below | See below |
| December 2026 | See below | See below | See below |
| January 2027 | See below | See below | See below |

### November 2026 confirmed items (as of Phase 6C-92)

| ID | Item | Dates | Days | Source | Status |
|----|------|-------|------|--------|--------|
| NOV-01-DDW | Dubai Design Week 2026 | Nov 3-8 | 6 | dubaidesignweek.ae | confirmed |
| NOV-02-DD | Downtown Design Dubai | Nov 4-8 | 5 | source_ledger | overlap with DDW |
| NOV-03-BIG5 | Big 5 Global 2026 | Nov 23-26 | 4 | thebig5construct.com | confirmed |
| NOV-04-DFC | DFC campaign | Oct 31-Nov 29 | 30 | dubaifitnesschallenge.com | HOLD (403) |
| NOV-04a | Dubai Ride | Nov 1 | 1 | part of DFC | HOLD |
| NOV-04b | Dubai Stand Up Paddle | Nov 7-8 | 2 | part of DFC | HOLD |
| NOV-04c | Dubai Run | Nov 22 | 1 | part of DFC | HOLD |
| NOV-04d | Dubai Yoga | Nov 29 | 1 | part of DFC | HOLD |

Without DFC: 6+4 = ~8 unique days = 26.7% (Nov 3-8 + Nov 23-26). Well below target.
With DFC confirmed: Oct 31-Nov 29 fills nearly the entire month = ~93% coverage.

### December 2026 confirmed items (as of Phase 6C-92)

| ID | Item | Dates | Days | Source | Status |
|----|------|-------|------|--------|--------|
| DEC-01-COMM | Commemoration Day | Dec 1 | 1 | official holiday | confirmed |
| DEC-02-NATDAY | UAE National Day | Dec 2-3 | 2 | official holiday | confirmed |
| DEC-03-GITEX | GITEX Global 2026 | Dec 7-11 | 5 | gitex.com | confirmed |
| DEC-04-DSF | Dubai Shopping Festival 2026/27 | late Dec | TBD | visitdubai.com | HOLD |
| DEC-05-SOLE | Sole DXB 2026 | early Dec | TBD | soledxb.com | HOLD |

Without DSF/Sole: 8 unique days = 25.8%. Below target.
With DSF (if confirmed, typically Dec 26-Jan): could reach 70%+ for December.

### January 2027 confirmed items (as of Phase 6C-92)

| ID | Item | Dates | Days | Source | Status |
|----|------|-------|------|--------|--------|
| JAN-01-EINV | E-invoicing Phase A go-live | Jan 1, 2027 | 1 | MOF/FTA | confirmed (cross-ref) |
| JAN-02-DSF | DSF continues | Jan TBD | TBD | visitdubai.com | HOLD |
| JAN-03-RAMA | Ramadan 1448H start | ~Feb 2027 | — | FAHR | future (not Jan) |

January is thin without DSF.

---

## Exact prompt

```
You are running the Guidex Monthly Density Watch (Routine 03).
Today's date: use the currentDate system variable.
Working directory: /Users/batyr/Desktop/dubai-guide-site

CONTEXT — read these files first (compact only):
- docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md
- docs/content-drafts/daily-radar/[TODAY]-event-radar.md (if exists)
- docs/content-drafts/daily-radar/[TODAY]-source-verification.md (if exists)
- docs/content-drafts/routines/ROUTINE_03_MONTHLY_DENSITY_WATCH.md (coverage baseline section only)

TARGET MONTHS: November 2026, December 2026, January 2027.
COVERAGE TARGET: 90% visible coverage for active months (where real source-backed ranges/events exist).

TASK:
1. Using the coverage baseline in this routine doc + any new signals from Routines 01/02, calculate current coverage for each target month.
2. Identify gap clusters (stretches of uncovered days).
3. Classify each gap as: FILLABLE (known hold item would cover it), NEEDS_RESEARCH (unknown, needs new source scan), or STRUCTURAL (no known events in this window historically).
4. Flag any month where DFC resolution would dramatically change coverage.

OUTPUT:
Write to: docs/content-drafts/daily-radar/[TODAY]-density-watch.md

Use this exact format:

---
# Guidex Daily Radar — Monthly Density Watch
Date: [TODAY]
Routine: GUIDEX-R03 Monthly Density Watch
Status: [ON_TRACK / GAPS_IDENTIFIED / ACTION_REQUIRED]
---

## November 2026

| Metric | Value |
|--------|-------|
| Days in month | 30 |
| Confirmed covered days (without holds) | [N] |
| Coverage without holds | [X%] |
| Coverage if DFC resolved | [Y%] |
| Priority action | [description] |

### Gap clusters (without DFC)

| Gap | Dates | Days | Classification |
|-----|-------|------|----------------|
| ... | ... | ... | ... |

### What would improve November coverage

| Item | Impact | Status |
|------|--------|--------|
| DFC resolution | +[N] days | HOLD — check Routine 02 |
| ... | ... | ... |

## December 2026

[same structure]

## January 2027

[same structure]

## Priority action this week

[Ordered list of the 1-3 highest-impact actions the owner should take to improve coverage]

## Hard stop confirmation
No production DB write. No import. No deploy. No schema change. No code change pushed.
Documentation output only.
```

---

## Hard restrictions

- HARD STOP: no writes to `data/`, no DB queries, no import scripts
- HARD STOP: do not invent coverage numbers — base only on confirmed items from source ledger
- HARD STOP: do not mark DFC as resolved unless Routine 02 confirms site accessible and dates visible
- If Routine 01/02 outputs not available: use baseline from this routine doc only

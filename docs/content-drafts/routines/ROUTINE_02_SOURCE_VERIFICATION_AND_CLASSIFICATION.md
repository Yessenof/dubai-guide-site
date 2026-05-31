# Routine 02 — Source Verification and Classification

**Routine ID:** GUIDEX-R02
**Schedule:** 06:30 UTC daily
**Output:** `docs/content-drafts/daily-radar/YYYY-MM-DD-source-verification.md`
**Context mode:** Standard (compact) — do NOT use 1M context

---

## Purpose

Daily recheck of every active HOLD item in the Guidex source ledgers. HOLD items are events or dates that could not be imported because their official source was inaccessible (403, no date announced, or unconfirmed). This routine detects when a HOLD item becomes importable — the DFC site recovers, Global Village announces dates, FAHR publishes Mawlid, etc.

This routine verifies only. It does not import. It does not publish.

---

## Schedule recommendation

Daily at 06:30 UTC (after Routine 01 completes). Reads Routine 01 output if available.

---

## Files to read (compact context — read only these)

1. `docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md` — safety rules
2. `docs/content-drafts/daily-radar/[TODAY]-event-radar.md` — Routine 01 output (if exists)

Do NOT read large source ledgers or full phase reports. Context must stay compact.

---

## Current HOLD items (as of Phase 6C-91)

These are the active hold items to recheck daily:

| ID | Item | Hold reason | Source to recheck | Last HTTP |
|----|------|-------------|-------------------|-----------|
| HOLD-DFC | Dubai Fitness Challenge Oct31-Nov29 | Site 403 as of 6C-91 | dubaifitnesschallenge.com/en/ | 403 |
| HOLD-GV | Global Village Season 31 (~mid-Oct) | No official 2026/27 opening date | globalvillage.ae | — |
| HOLD-MAWLID | Mawlid Al-Nabi 1448H | FAHR not announced | fahr.gov.ae/en/services/public-holidays | — |
| HOLD-ISNYR | Islamic New Year 1448H | FAHR not announced | fahr.gov.ae/en/services/public-holidays | — |
| HOLD-CITYSCAPE | Cityscape Dubai 2026 | No official 2026 dates | cityscape.ae | — |
| HOLD-DSF | Dubai Shopping Festival 2026/27 | No official dates confirmed | visitdubai.com/en/festivals-and-events/dsf | — |
| HOLD-SOLEDHD | Sole DXB 2026 | No official 2026 dates | soledxb.com | — |

---

## Exact prompt

```
You are running the Guidex Source Verification and Classification routine (Routine 02).
Today's date: use the currentDate system variable.
Working directory: /Users/batyr/Desktop/dubai-guide-site

CONTEXT — read these files first (compact only):
- docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md
- docs/content-drafts/daily-radar/[TODAY]-event-radar.md (if file exists — read for context)

HOLD ITEMS TO RECHECK TODAY:

1. DFC (Dubai Fitness Challenge)
   URL: https://dubaifitnesschallenge.com/en/
   Hold reason: site returned 403 as of Phase 6C-91 (2026-05-31)
   Known dates from source ledger: Oct 31 - Nov 29 2026
   Sub-events: Dubai Ride Nov 1, Stand Up Paddle Nov 7-8, Dubai Run Nov 22, Dubai Yoga Nov 29
   Action if 200: check if Oct 31 start date and sub-event dates are confirmed on page. If yes → HOLD_RESOLVED.

2. Global Village Season 31
   URL: https://www.globalvillage.ae/en
   Hold reason: no official 2026/27 season opening date announced
   Historical range: mid-October through April (Season 30 was Oct 2025 - Apr 2026)
   Action if new date found: capture exact URL + exact page text. Flag HOLD_RESOLVED.

3. FAHR Public Holidays — Mawlid Al-Nabi 1448H + Islamic New Year
   URL: https://www.fahr.gov.ae/en/services/public-holidays
   Hold reason: FAHR not yet announced 2026 Islamic holiday dates
   Expected window: Islamic New Year ~late Sep 2026; Mawlid ~late Sep/early Oct 2026
   Action if dates announced: capture exact URL + exact text. Flag HOLD_RESOLVED.

4. Cityscape Dubai 2026
   URL: https://www.cityscape.ae
   Hold reason: no official 2026 dates confirmed
   Historical window: typically October
   Action if date found: capture exact URL + exact text.

5. Dubai Shopping Festival 2026/27
   URL: https://www.visitdubai.com/en/festivals-and-events/dsf
   Hold reason: exact 2026/27 dates not confirmed
   Expected window: late December through January
   Action if date found: capture exact URL + exact text.

6. Sole DXB 2026
   URL: https://soledxb.com
   Hold reason: no official 2026 dates
   Historical window: typically early December

For each URL:
- Record HTTP status
- If 200: scan for the specific date information needed to resolve the hold
- If date found: capture exact URL + exact text in quotes

OUTPUT:
Write to: docs/content-drafts/daily-radar/[TODAY]-source-verification.md

Use this exact format:

---
# Guidex Daily Radar — Source Verification
Date: [TODAY]
Routine: GUIDEX-R02 Source Verification and Classification
Status: [ALL_HOLD / PARTIAL_RESOLVED / HOLDS_RESOLVED]
---

## Hold item status

| ID | Item | HTTP | Dates confirmed? | Status | Action |
|----|------|------|-----------------|--------|--------|
| HOLD-DFC | Dubai Fitness Challenge | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | [none / ready_for_candidate] |
| HOLD-GV | Global Village | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | ... |
| HOLD-MAWLID | Mawlid Al-Nabi | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | ... |
| HOLD-ISNYR | Islamic New Year | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | ... |
| HOLD-CITYSCAPE | Cityscape Dubai | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | ... |
| HOLD-DSF | Dubai Shopping Festival | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | ... |
| HOLD-SOLEDXB | Sole DXB | [HTTP] | [Yes/No] | [HOLD / HOLD_RESOLVED] | ... |

## Resolved holds (detail)

For each HOLD_RESOLVED item:
### RESOLVED: [Item name]
- Source URL: [exact URL]
- Exact text from source: "[quote]"
- Dates confirmed: [dates]
- Classification: [L1_official / L1_organizer / L2_aggregator]
- Ready for import candidate: [Yes / No — needs owner review]
- Notes: [any caveats]

## Hard stop confirmation
No production DB write. No import. No deploy. No schema change. No code change pushed.
Documentation output only.
```

---

## Hard restrictions

- HARD STOP: no writes to `data/`, no DB queries, no import scripts
- HARD STOP: do not mark a hold as RESOLVED unless you have an exact URL + exact date text from the source
- HARD STOP: do not infer dates from old seasons or historical patterns — official source required
- A site returning 200 is NOT enough — the relevant date must appear on the page
- If Routine 01 output is not available, run the checks independently

---

## Classification rules

When a hold resolves, classify the source:
- `L1_official`: government authority (FAHR, FTA, DET) — highest trust
- `L1_organizer`: event organizer official site (dubaifitnesschallenge.com, globalvillage.ae) — high trust
- `L2_aggregator`: official tourism/municipality aggregator (visitdubai.com) — use with caution, cross-check against organizer
- Never classify media/press/social as L1

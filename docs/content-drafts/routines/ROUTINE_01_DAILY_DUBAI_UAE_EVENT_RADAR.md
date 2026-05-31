# Routine 01 — Daily Dubai/UAE Event Radar

**Routine ID:** GUIDEX-R01
**Schedule:** 06:00 UTC daily
**Output:** `docs/content-drafts/daily-radar/YYYY-MM-DD-event-radar.md`
**Context mode:** Standard (compact) — do NOT use 1M context

---

## Purpose

Scan official Dubai/UAE event and authority sources each morning for new events, date announcements, and signals relevant to the Guidex calendar product. Focus on upcoming target months: November 2026, December 2026, January 2027.

This routine discovers signals. It does not import. It does not publish.

---

## Schedule recommendation

Daily at 06:00 UTC (10:00 GST / Dubai time). Runs first so all other routines can build on its output.

---

## Files to read (compact context — read only these)

1. `docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md` — safety rules
2. `docs/content-drafts/source-ledgers/dubai-2026-events-tourism-sources.md` — known events baseline
3. `docs/content-drafts/PHASE_6C91_OCTOBER_2026_CALENDAR_PRODUCTION_IMPORT_REPORT.md` — most recent live month (first 30 lines only)

Do NOT read CLAUDE.md, PROJECT_STATE.md, or other large files. Context must stay compact.

---

## Exact prompt

```
You are running the Guidex Daily Dubai/UAE Event Radar (Routine 01).
Today's date: use the currentDate system variable.
Working directory: /Users/batyr/Desktop/dubai-guide-site

CONTEXT — read these files first (compact only):
- docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md
- docs/content-drafts/source-ledgers/dubai-2026-events-tourism-sources.md (lines 1-80 only)

TARGET MONTHS: November 2026, December 2026, January 2027.

SOURCES TO CHECK — fetch each URL, check HTTP status, scan for date/event mentions:

1. dwtc.com/en/events/ — DWTC upcoming events list
2. visitdubai.com/en/events — Visit Dubai upcoming events
3. dubaidesignweek.ae — Dubai Design Week 2026 (target: Nov 3-8 confirm)
4. thebig5construct.com — Big 5 Global 2026 (target: Nov 23-26 confirm)
5. gitex.com — GITEX Global 2026 (target: Dec 7-11 confirm, already in ledger)
6. globalvillage.ae — Global Village Season 31 (HOLD: monitor for opening date)
7. fahr.gov.ae/en/services/public-holidays — FAHR public holidays (Mawlid, Islamic New Year)
8. tax.gov.ae — FTA (VAT/tax deadline updates)
9. dubaifitnesschallenge.com/en/ — DFC (HOLD: site was 403, monitor for recovery)

GITEX note: already confirmed Dec 7-11 at Expo City Dubai. Only check if dates/venue changed.

For each source:
- Record HTTP status (200/301/403/other)
- If 200: scan for any mention of November, December, or January dates not previously in ledger
- If a new date/event found: capture exact URL + exact text from page
- If site previously was 403 and is now accessible: mark as RECOVERED

OUTPUT:
Write to: docs/content-drafts/daily-radar/[TODAY]-event-radar.md

Use this exact format:

---
# Guidex Daily Radar — Event Radar
Date: [TODAY]
Routine: GUIDEX-R01 Daily Dubai/UAE Event Radar
Status: [CLEAN / SIGNALS_FOUND / ACTION_REQUIRED]
---

## Source scan results

| Source | URL | HTTP | Notes |
|--------|-----|------|-------|
| ... | ... | ... | ... |

## New signals (if any)

For each signal:
### SIGNAL: [Event Name]
- Source URL: [exact URL]
- Exact text from source: "[quote]"
- Dates mentioned: [dates]
- Target month: [Nov/Dec/Jan]
- Signal quality: [L1_official / L1_organizer / L2_aggregator / signal_only]
- Recommended action: [add_to_ledger / recheck_hold / ready_for_candidate]

## Hold item status updates

| Hold item | Site HTTP | Change? | Note |
|-----------|-----------|---------|------|
| Global Village Season 31 | [HTTP] | [Yes/No] | [dates if found] |
| DFC (site 403 as of 6C-91) | [HTTP] | [Yes/No] | [recovered?] |
| Mawlid (FAHR) | [HTTP] | [Yes/No] | [date announced?] |
| DSF (visitdubai.com) | [HTTP] | [Yes/No] | [dates confirmed?] |

## Hard stop confirmation
No production DB write. No import. No deploy. No schema change. No code change pushed.
Documentation output only.
```

---

## Hard restrictions

- HARD STOP: no writes to `data/`, no DB queries, no import scripts
- HARD STOP: do not mark media/social as official source
- HARD STOP: do not claim dates without URL + exact text from official source
- HARD STOP: do not push code changes (only docs to daily-radar)
- Signal from media outlet: label as `signal_only` — requires L1 confirmation before import candidate
- If all sources return CLEAN (no new signals): write CLEAN status output — do not fabricate signals

---

## Source priority (from strategy doc)

L1 official > L1 organizer > L2 aggregator > media signal_only. Media cannot be the final source for a date claim.

---

## What NOT to include

- Social media posts
- Unverified press releases from unknown agencies
- Events without official organizer/venue URL
- Any claim that cannot be attributed to an exact URL + exact text

# Routine 05 — Daily Import Candidate Pack

**Routine ID:** GUIDEX-R05
**Schedule:** 08:00 UTC daily
**Output:** `docs/content-drafts/daily-radar/YYYY-MM-DD-import-candidate-pack.md`
**Context mode:** Standard (compact) — do NOT use 1M context

---

## Purpose

Synthesise the outputs from Routines 01-04 into a concise, action-ready daily report. This is the only output the owner needs to read each morning. It surfaces:
1. Any hold items that resolved today (ready to import)
2. New event signals from Routine 01 that cleared source classification
3. Coverage gaps from Routine 03 ranked by urgency
4. Live site issues from Routine 04 requiring hotfix
5. A next phase recommendation

This routine synthesises only. It does not import. It does not publish. It does not push code changes.

---

## Schedule recommendation

Daily at 08:00 UTC (12:00 GST). Runs last — after Routines 01-04 have completed.

---

## Files to read (compact context — read only these)

1. `docs/content-drafts/daily-radar/[TODAY]-event-radar.md` (Routine 01 output)
2. `docs/content-drafts/daily-radar/[TODAY]-source-verification.md` (Routine 02 output)
3. `docs/content-drafts/daily-radar/[TODAY]-density-watch.md` (Routine 03 output)
4. `docs/content-drafts/daily-radar/[TODAY]-live-qa.md` (Routine 04 output)

If any of these files don't exist: note that the routine did not run and proceed with available data. Do NOT read large files or CLAUDE.md.

---

## Import candidate threshold

A candidate is "ready for import" when ALL of these are true:
- Official L1 source (organizer or authority) confirmed with URL + exact text
- Dates are specific (no "TBD", no "expected", no "historical")
- No em dash in any string
- EN content complete (title, label, brief if L2)
- RU content complete or translation pending (acceptable for L1 compliance items)
- No unsupported fee or attendance claims
- Source URL HTTP 200 confirmed today

A candidate is "import pending owner review" when:
- L1 source confirmed but EN/RU strings not yet drafted
- OR owner needs to decide on scope (sub-events vs. parent event)

---

## Exact prompt

```
You are running the Guidex Daily Import Candidate Pack (Routine 05).
Today's date: use the currentDate system variable.
Working directory: /Users/batyr/Desktop/dubai-guide-site

CONTEXT — read ONLY these files (compact):
- docs/content-drafts/daily-radar/[TODAY]-event-radar.md (if exists)
- docs/content-drafts/daily-radar/[TODAY]-source-verification.md (if exists)
- docs/content-drafts/daily-radar/[TODAY]-density-watch.md (if exists)
- docs/content-drafts/daily-radar/[TODAY]-live-qa.md (if exists)

TASK:
Synthesise the four routine outputs into a single daily summary the owner reads in 2 minutes.

For each routine output:
- If it shows ACTION_REQUIRED or SIGNALS_FOUND: extract the key action items
- If it shows CLEAN or ALL_PASS: note it briefly and move on
- Prioritise items in this order: P0 live site issues, P1 hold items resolved, P2 new confirmed signals, P3 coverage gaps

Import candidate qualification (use this standard):
- READY: L1 source + specific dates + URL confirmed today
- PENDING_OWNER: L1 source confirmed but needs owner decision on scope
- SIGNAL_ONLY: interesting but not yet L1-confirmed
- NOISE: no official source, discard

OUTPUT:
Write to: docs/content-drafts/daily-radar/[TODAY]-import-candidate-pack.md

Use this exact format:

---
# Guidex Daily Import Candidate Pack
Date: [TODAY]
Routine: GUIDEX-R05 Daily Import Candidate Pack
Status: [NO_ACTION / ACTION_REQUIRED / CRITICAL]
---

## Live site status (from Routine 04)

[One line: ALL_PASS or list of failing routes]

## Hold items resolved today (from Routine 02)

[List any HOLD_RESOLVED items — or "None today"]

## New import candidates

For each candidate:
### CANDIDATE: [Event Name]
- Target month: [Month YYYY]
- Dates: [specific dates]
- Source: [URL] ([classification])
- Status: [READY / PENDING_OWNER / SIGNAL_ONLY]
- EN label draft: "[label text]"
- RU label draft: "[label text]"
- What owner must do: [one sentence]

## Coverage gaps requiring action

| Month | Current coverage | Gap to fill | Action |
|-------|-----------------|-------------|--------|
| November 2026 | [X%] | [key gap] | [action] |
| December 2026 | [X%] | [key gap] | [action] |
| January 2027 | [X%] | [key gap] | [action] |

## Recommended next phase

[One paragraph — what the owner should do next. If DFC resolved → November import phase. If no resolves today → wait. If live QA failing → hotfix phase.]

## How to start a phase from this report

If a candidate above is READY, paste this into a new Claude Code session:
```
Continue Guidex Phase 6C-XX.
Read: CLAUDE.md, PROJECT_STATE.md, NEW_CHAT_TRANSFER.txt, docs/content-drafts/daily-radar/[TODAY]-import-candidate-pack.md

Daily import candidate pack dated [TODAY] shows [ITEM] as READY.
Proceed with Phase 6C-XX-A (local import QA) for [ITEM].
```

## Hard stop confirmation
No production DB write. No import. No deploy. No schema change. No code change pushed.
This routine synthesises documentation only.
```

---

## Hard restrictions

- HARD STOP: no writes to `data/`, no DB queries, no import scripts, no deploy
- HARD STOP: do not mark a candidate READY unless Routine 02 confirmed the source is L1 and dates are specific
- HARD STOP: do not draft import scripts — report candidate data only
- HARD STOP: do not push code changes (only docs to daily-radar)
- If all four routine inputs are unavailable: write a minimal report noting that routines did not produce output and flag for owner investigation

---

## Routine interdependency

Routine 05 depends on 01-04. If they fail silently and don't write output files, Routine 05 should detect missing files and note: "Routine [N] output not found for today — manual check required."

---

## What stays manual

Even with all 5 routines running daily, these steps always require owner approval before execution:

| Step | Why manual |
|------|-----------|
| Local DB import | Owner reviews content quality before committing |
| Production DB import | Owner approves after local QA passes |
| Production deploy | Owner runs build + PM2 restart |
| GSC submission | Owner submits via Search Console UI |
| Schema changes | Owner approves before any migration |
| Destructive deletes | Never automated |

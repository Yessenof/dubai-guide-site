# Claude Routines Setup Guide for Guidex

**Project:** Guidex Consulting — Dubai Guide Site
**Created:** 2026-05-31 (Phase 6C-92)

---

## What are Claude Code routines?

Claude Code routines are automated agents that run on a cron schedule using Claude's remote execution environment. Each routine:
- Starts fresh with a self-contained prompt
- Reads files from the project
- Fetches public web pages
- Writes output documents
- Stops — no interactive session

Routines are configured in Claude.ai or via the `schedule` skill in Claude Code.

---

## How to create Guidex routines (two methods)

### Method A — Claude Code CLI (preferred)

In the Claude Code terminal, run:
```
/schedule
```
Then follow the prompts to create a routine. You will need to paste the exact prompt from each routine doc (the block inside triple-backticks).

Or invoke directly:
```
Use the schedule skill to create a routine named "GUIDEX-R01" that runs at 06:00 UTC daily with this prompt: [paste prompt from ROUTINE_01 doc]
```

### Method B — Claude.ai web

1. Go to claude.ai → your project → Routines (or Scheduled agents)
2. Click "New routine"
3. Paste the prompt from the routine doc
4. Set the schedule (cron expression or natural language)
5. Set context mode: Standard (not Max / 1M)
6. Save

---

## Context mode — always use Standard

The Guidex routines are designed for standard/compact context:
- Each prompt reads 2-4 small files maximum
- No large codebases, no full CLAUDE.md
- Standard mode keeps cost low and fits within included runs

**Never use Max context (1M) for these routines.** The prompts will specify exactly which files to read.

---

## Recommended schedule (all UTC)

| Routine | Schedule | Cron expression |
|---------|----------|----------------|
| R01 — Event Radar | 06:00 UTC daily | `0 6 * * *` |
| R02 — Source Verification | 06:30 UTC daily | `30 6 * * *` |
| R03 — Monthly Density Watch | 07:00 UTC daily | `0 7 * * *` |
| R04 — Live Site QA | 07:30 UTC daily | `30 7 * * *` |
| R05 — Import Candidate Pack | 08:00 UTC daily | `0 8 * * *` |

Five routines × 1 daily run = 5 included runs used per day. No extra usage credits needed.

---

## How to review routine outputs each morning

1. Open `docs/content-drafts/daily-radar/` in the project
2. Look for today's date prefix files
3. Read `YYYY-MM-DD-import-candidate-pack.md` first — this is the synthesis
4. If Status = NO_ACTION: skip other files, no action today
5. If Status = ACTION_REQUIRED: read the specific routine output mentioned
6. If Status = CRITICAL (live QA): start a hotfix phase immediately

You do not need to read all 5 output files daily — only the candidate pack and any flagged files.

---

## How to avoid paid credits

- Keep total routines at 5 or fewer daily runs
- Use Standard context mode (not 1M / Max)
- Do not create additional routines beyond the 5 in this plan without first checking your included run allocation
- If a routine fails with a "usage" error: pause it and check your Claude account usage page

---

## What to do if a routine fails

| Failure type | Action |
|-------------|--------|
| Routine didn't run (no output file) | Check routine status in Claude.ai → Routines. Restart if stopped. |
| Routine ran but output is empty | Open the output file — it should explain the failure. Re-run manually if needed. |
| Routine wrote wrong file path | Check the date prefix — a new session uses today's date automatically. |
| Routine tried to import/modify DB | This should never happen. Review the prompt for the hard stop rule and re-create the routine. |
| Rate limit / API error | Wait 1 hour, then retry. Check Claude account status. |

---

## How to convert a daily output into a phase prompt

When the import-candidate-pack shows a READY candidate:

```
Continue Guidex Phase 6C-XX.

Do NOT use 1M context. Use standard/compact context only.
Read only files needed for this phase.

Read: CLAUDE.md, PROJECT_STATE.md, NEW_CHAT_TRANSFER.txt
Also read: docs/content-drafts/daily-radar/YYYY-MM-DD-import-candidate-pack.md

The daily import candidate pack shows [ITEM NAME] as READY for import.
Source: [URL] confirmed [date].
Dates: [specific dates].

Proceed with Phase 6C-XX:
1. Phase 6C-XX-A: Create local import script and QA (do not touch production)
2. Phase 6C-XX-B: Production import (after owner approval of local QA)
```

---

## How to pause or stop a routine

In Claude Code CLI:
```
/schedule
```
Select the routine → Pause or Delete.

Or in Claude.ai web → Routines → select → Pause/Delete.

---

## Routine maintenance

Update the routine prompts when:
- A new calendar month goes live (update Routine 04's route list)
- A hold item resolves permanently (remove from Routine 02's list)
- A new HOLD item appears (add to Routine 02's list)
- Coverage baseline changes significantly (update Routine 03's baseline table)

After updating a routine doc, also update the live routine prompt in Claude.ai/Claude Code.

---

## Important: these routines do not replace phase imports

Routines prepare data. Phases execute imports. The workflow is:

```
Routines (daily automated) → daily-radar files → owner reviews → phase prompt → Phase N (local import QA) → Phase N+1 (production import)
```

No routine ever imports to local or production DB. That step always requires owner involvement.

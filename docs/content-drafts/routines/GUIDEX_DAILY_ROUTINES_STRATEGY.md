# Guidex Daily Routines Strategy

**Project:** Guidex Consulting — Dubai Guide Site
**Created:** 2026-05-31 (Phase 6C-92)
**Owner:** solo operator

---

## 1. What are routines?

Claude Code routines are scheduled remote agents that run automatically on a cron schedule. Each routine executes a self-contained prompt in the Guidex project context. Routines run without owner intervention and write structured output files that the owner reviews on their own timeline.

---

## 2. Why Guidex needs them

The calendar product depends on fresh, source-backed monthly content. Without automation, the owner must manually:
- Scan 10-15 official Dubai/UAE event sources daily
- Track hold items (Global Village, DFC, Mawlid, Cityscape, DSF)
- Verify that live calendar pages are healthy
- Assemble import candidate data before each phase

This is 30-60 minutes of repetitive research daily. Routines reduce it to a 5-minute review of structured daily reports.

---

## 3. The five routines

| # | Name | Schedule | Output file | Purpose |
|---|------|----------|-------------|---------|
| 01 | Daily Dubai/UAE Event Radar | 06:00 UTC daily | YYYY-MM-DD-event-radar.md | Scan official sources for new events, dates, announcements |
| 02 | Source Verification and Classification | 06:30 UTC daily | YYYY-MM-DD-source-verification.md | Recheck hold items for site recovery and new dates |
| 03 | Monthly Density Watch | 07:00 UTC daily | YYYY-MM-DD-density-watch.md | Track coverage gaps for Nov/Dec/Jan target months |
| 04 | Live Site QA and Carousel Freshness | 07:30 UTC daily | YYYY-MM-DD-live-qa.md | Verify production routes, freshness, no stale content |
| 05 | Daily Import Candidate Pack | 08:00 UTC daily | YYYY-MM-DD-import-candidate-pack.md | Synthesise 01-04 outputs into phase-ready import candidates |

Five routines = five included daily runs. No paid usage credits required.

---

## 4. Safety model — hard stops

Every routine must refuse these actions. No exception, no override:

| Action | Status |
|--------|--------|
| Write to `data/` | HARD STOP |
| Import to production DB | HARD STOP |
| Import to local DB | HARD STOP |
| Run any import script | HARD STOP |
| Deploy to production | HARD STOP |
| Restart PM2 | HARD STOP |
| Push code changes | HARD STOP |
| Change schema/migrations | HARD STOP |
| Modify admin/auth/proxy files | HARD STOP |
| Create or enable paid API calls | HARD STOP |
| Write internal editorial notes into public fields (en_notes, ru_notes) | HARD STOP |
| Mark media/social as official source | HARD STOP |
| Invent dates without official source | HARD STOP |
| Claim facts without URL + exact text from official source | HARD STOP |

---

## 5. What routines may do

Routines are read-and-write agents for documentation only:

| Action | Allowed |
|--------|---------|
| Read any file in the project | Yes |
| Fetch public web pages (WebFetch / curl) | Yes — official sources only |
| Search the web (WebSearch) | Yes — for official source discovery, not content |
| Write to `docs/content-drafts/daily-radar/` | Yes |
| Write to `docs/content-drafts/source-ledgers/` | Yes — update hold item status |
| Write to `docs/content-drafts/routines/` | Yes — update this strategy doc |
| Commit docs-only changes | Yes — only if no code/DB files staged |
| Push docs-only commits | Yes |

---

## 6. Source priority (locked)

Routines use this hierarchy to classify sources:

| Level | Source type | Examples |
|-------|-------------|---------|
| L1 (official) | Government authority | FAHR, FTA, MOF, MOHRE, ICA, GDRFA, DET |
| L1 (organizer) | Event organizer official site | gitex.com, dwtc.com, dubaidesignweek.ae |
| L1 (venue) | Venue official page | dubaifitnesschallenge.com, globalvillage.ae |
| L2 (aggregator) | Official tourism/municipality aggregator | visitdubai.com, dubaicalendar.ae |
| L2 (media, signal only) | Trusted local media for discovery | Khaleej Times, Gulf News, Arabian Business |
| Blocked | Social media, Twitter/X, press releases from unknown agencies | — |

Media sources (L2) may flag a signal but MUST NOT be used as the final source for date claims. A routine that finds a signal via media must note it as "signal only — verify official source" and NOT include it in import candidates until an L1/L1-organizer URL confirms the same date.

---

## 7. Daily output file format

All output files go to: `docs/content-drafts/daily-radar/`

File naming: `YYYY-MM-DD-<type>.md`

Each file must start with:
```
# Guidex Daily Radar — <Type>
Date: YYYY-MM-DD
Routine: <name>
Status: <CLEAN / SIGNALS_FOUND / ACTION_REQUIRED>
```

And end with:
```
## Hard stop confirmation
No production DB write. No import. No deploy. No schema change. No code change pushed.
Documentation output only.
```

---

## 8. Review and approval flow

```
06:00  Routine 01 runs → event-radar.md written
06:30  Routine 02 runs → source-verification.md written
07:00  Routine 03 runs → density-watch.md written
07:30  Routine 04 runs → live-qa.md written
08:00  Routine 05 runs → import-candidate-pack.md written (reads 01-04 outputs)

Owner reviews import-candidate-pack.md and live-qa.md each morning
→ If import-candidate-pack shows a ready candidate → owner starts a new Phase prompt
→ If live-qa shows a failing route → owner starts a hotfix phase
→ If source-verification shows DFC/Global Village now accessible → owner starts import phase
```

---

## 9. Converting a daily output into a phase prompt

When import-candidate-pack contains an action-ready candidate, the owner creates a new Claude Code session with this prompt structure:

```
Continue Guidex Phase 6C-XX.
Read: CLAUDE.md, PROJECT_STATE.md, NEW_CHAT_TRANSFER.txt

The daily import candidate pack (docs/content-drafts/daily-radar/YYYY-MM-DD-import-candidate-pack.md)
identified [ITEM] as ready for import. Proceed with:
1. Phase 6C-XX-A: Local import + QA
2. Phase 6C-XX-B: Production import (after owner approval)
```

---

## 10. Context mode

All routines use **standard/compact context** — not 1M context. Routine prompts list exactly which files to read and read only those. This keeps cost low and prevents context bloat.

---

*Maintained by Phase 6C-92. Update when routine scope or safety rules change.*

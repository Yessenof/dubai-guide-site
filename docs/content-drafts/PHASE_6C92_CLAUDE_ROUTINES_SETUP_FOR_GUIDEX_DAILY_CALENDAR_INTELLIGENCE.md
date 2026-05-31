# Phase 6C-92 Report — Claude Routines Setup for Guidex Daily Calendar Intelligence

**Phase:** 6C-92
**Date completed:** 2026-05-31
**Status:** COMPLETE — 5 routines created and enabled

---

## Summary

Five Claude Code remote routines created and scheduled to run daily starting 2026-06-01. All documentation created (strategy doc, 5 routine templates, setup guide). Routines are live in Claude.ai and will run automatically on cron schedule. GitHub App connection required before first run succeeds (see Section 11).

---

## 1. What are the 5 routines?

| # | Name | ID | Schedule (UTC) | Next Run (UTC) | Purpose |
|---|------|----|---------------|---------------|---------|
| R01 | GUIDEX-R01-EVENT-RADAR | trig_01N7xgjFVsXJUngruD3WunYi | 06:00 daily | 2026-06-01T06:06Z | Scan official sources for new Nov/Dec/Jan event signals |
| R02 | GUIDEX-R02-SOURCE-VERIFICATION | trig_014nMNqBaHHABn91FAFEDzqn | 06:30 daily | 2026-06-01T06:32Z | Recheck all HOLD items — DFC, Global Village, Mawlid, Cityscape, DSF |
| R03 | GUIDEX-R03-DENSITY-WATCH | trig_019JU3K2PBiehmRvAzsTQTXR | 07:00 daily | 2026-06-01T07:04Z | Track Nov/Dec/Jan coverage vs 90% target, identify fillable gaps |
| R04 | GUIDEX-R04-LIVE-QA | trig_01THaHu2wafKh5ZcVzC8zqp9 | 07:30 daily | 2026-06-01T07:37Z | Daily HTTP check of all 19 production routes + freshness check |
| R05 | GUIDEX-R05-IMPORT-CANDIDATE-PACK | trig_01Bsdr3WcdsZm3dAXEZ2JT3B | 08:00 daily | 2026-06-01T08:03Z | Synthesise R01-R04 into daily import candidate pack for owner review |

Dubai time (GST = UTC+4): R01 at 10:00, R02 at 10:30, R03 at 11:00, R04 at 11:30, R05 at 12:00.

View and manage all routines: https://claude.ai/code/routines

---

## 2. What does each routine do?

### R01 — Event Radar (06:00 UTC)
Scans 8 official Dubai/UAE event and authority sources:
- DWTC events listing
- Visit Dubai events
- Dubai Design Week (target: Nov 3-8)
- The Big 5 Global (target: Nov 23-26)
- GITEX (Dec 7-11 already confirmed — only checks if changed)
- Global Village (HOLD: monitors for Season 31 opening date)
- FAHR public holidays (monitors for Mawlid Al-Nabi + Islamic New Year 1448H)
- Dubai Fitness Challenge (HOLD: was 403 — monitors for recovery + Oct31-Nov29 dates)

Output: `docs/content-drafts/daily-radar/YYYY-MM-DD-event-radar.md` with status CLEAN / SIGNALS_FOUND / ACTION_REQUIRED.

### R02 — Source Verification (06:30 UTC)
Rechecks 6 active HOLD items daily:
- DFC (was 403 as of Phase 6C-91 — sub-event dates known, site recovery pending)
- Global Village Season 31 (no 2026/27 opening date)
- Mawlid Al-Nabi 1448H (FAHR not announced)
- Cityscape Dubai 2026 (no dates)
- Dubai Shopping Festival 2026/27 (late Dec expected)
- Sole DXB 2026 (early Dec historical)

For each: records HTTP status, checks if specific dates are now visible, marks HOLD_RESOLVED when confirmed.

Output: `docs/content-drafts/daily-radar/YYYY-MM-DD-source-verification.md`.

### R03 — Density Watch (07:00 UTC)
Calculates coverage for upcoming target months using confirmed baseline:
- November 2026: 26.7% without DFC, 93% with DFC confirmed
- December 2026: 25.8% without DSF (Commemoration Day + National Day + GITEX)
- January 2027: 3.2% without DSF (e-invoicing Jan 1 only)

Identifies gap clusters and classifies as FILLABLE / NEEDS_RESEARCH / STRUCTURAL.

Output: `docs/content-drafts/daily-radar/YYYY-MM-DD-density-watch.md`.

### R04 — Live QA (07:30 UTC)
HTTP checks on 19 production routes (calendar detail pages, news, events, homepage, sitemap). Freshness checks: October calendar title/robots in EN+RU, sitemap October count, carousel stale item detection.

Output: `docs/content-drafts/daily-radar/YYYY-MM-DD-live-qa.md` with status ALL_PASS / DEGRADED / ACTION_REQUIRED.

### R05 — Import Candidate Pack (08:00 UTC)
Reads R01-R04 outputs and produces the owner's daily summary. Classifies candidates as READY / PENDING_OWNER / SIGNAL_ONLY. Includes phase prompt template ready to paste into a new Claude Code session for immediate import start.

Output: `docs/content-drafts/daily-radar/YYYY-MM-DD-import-candidate-pack.md`.

---

## 3. Were routines actually created or only templates prepared?

**Both.** All 5 routines were actually created in Claude.ai and are enabled. All 5 template docs were also created in `docs/content-drafts/routines/` for reference and maintenance.

Creation method: `RemoteTrigger` API with `action: "create"` — all 5 returned HTTP 200. All use `env_017eduszWN2ArhrAo3oEvEPH` (Default environment, Anthropic cloud).

---

## 4. Daily schedule

```
10:00 GST (06:00 UTC) — R01 Event Radar writes event-radar.md
10:30 GST (06:30 UTC) — R02 Source Verification writes source-verification.md
11:00 GST (07:00 UTC) — R03 Density Watch writes density-watch.md
11:30 GST (07:30 UTC) — R04 Live QA writes live-qa.md
12:00 GST (08:00 UTC) — R05 Import Candidate Pack reads R01-R04 → writes import-candidate-pack.md
```

First run: 2026-06-01 (tomorrow). Owner reviews import-candidate-pack.md around 12:00 GST daily.

---

## 5. What outputs will owner review?

The **only file the owner needs to read daily** is:
`docs/content-drafts/daily-radar/YYYY-MM-DD-import-candidate-pack.md`

- Status `NO_ACTION`: nothing to do today
- Status `ACTION_REQUIRED`: at least one hold resolved or new candidate ready — read the file and start an import phase
- Status `CRITICAL`: live site route failing — start hotfix phase immediately

If the owner wants details on a specific signal, they open the relevant source file (event-radar.md or source-verification.md). The density-watch.md and live-qa.md are available for deeper review.

---

## 6. What remains manual?

| Step | Why manual |
|------|-----------|
| Local DB import | Owner reviews content quality before committing |
| Production DB import | Owner approves after local QA passes |
| Production deploy (build + PM2) | Owner runs on server |
| GSC URL submission | Owner submits via Search Console UI |
| Schema/migration changes | Owner approves before any migration |
| Routine prompt updates | Owner updates when coverage baseline changes |

---

## 7. How do routines avoid unsafe production writes?

Each routine prompt contains an explicit HARD STOP section with a list of forbidden actions:
- No writes to `data/`
- No import scripts
- No npm run build
- No PM2 restart
- No SSH to server
- No code file pushes (only docs/content-drafts/daily-radar/ output files)
- No creation of import candidates without L1 source confirmation

The routines have `allowed_tools: ["Bash", "Read", "Write", "WebFetch", "Grep", "Glob"]` — they cannot directly modify DB files, but the HARD STOP instructions in the prompt reinforce the safety model at the agent reasoning level.

---

## 8. What should the next calendar phase be?

**Immediate:** Connect GitHub App to enable routines (see Section 11).

**Next import phase decision tree:**

1. If DFC resolves (R02 shows HOLD_RESOLVED) → **Phase 6C-93: November 2026 Calendar** — DFC gives 93% November coverage in one import
2. If DFC still 403 + Design Week + Big 5 confirmed → **Phase 6C-93: November 2026 Calendar** — import DDW + Big5 at 26.7% coverage (documented sub-target)
3. If DSF dates confirmed → **Phase 6C-94: December 2026 Calendar** — Dec at 25.8% without DSF; with DSF could reach 60-70%
4. **Regardless:** December should be imported soon with confirmed items (Commemoration Dec 1, National Day Dec 2-3, GITEX Dec 7-11)

**Recommended order:**
- Phase 6C-93: November 2026 Calendar (local QA) → Phase 6C-94: November production import
- Phase 6C-95: December 2026 Calendar (local QA) → Phase 6C-96: December production import

---

## 9. Documentation created

| File | Path |
|------|------|
| Strategy doc | docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md |
| R01 template | docs/content-drafts/routines/ROUTINE_01_DAILY_DUBAI_UAE_EVENT_RADAR.md |
| R02 template | docs/content-drafts/routines/ROUTINE_02_SOURCE_VERIFICATION_AND_CLASSIFICATION.md |
| R03 template | docs/content-drafts/routines/ROUTINE_03_MONTHLY_DENSITY_WATCH.md |
| R04 template | docs/content-drafts/routines/ROUTINE_04_LIVE_SITE_QA_AND_CAROUSEL_FRESHNESS.md |
| R05 template | docs/content-drafts/routines/ROUTINE_05_DAILY_IMPORT_CANDIDATE_PACK.md |
| Setup guide | docs/content-drafts/routines/CLAUDE_ROUTINES_SETUP_GUIDE_FOR_GUIDEX.md |
| Output folder | docs/content-drafts/daily-radar/ (with .gitkeep) |
| This report | docs/content-drafts/PHASE_6C92_CLAUDE_ROUTINES_SETUP_FOR_GUIDEX_DAILY_CALENDAR_INTELLIGENCE.md |

---

## 10. Validation

| Check | Result |
|-------|--------|
| Code files touched | 0 — no code changes |
| DB touched | 0 — no DB writes |
| Deploy | None |
| Production import | None |
| Secrets/env touched | None |
| Paid credits enabled | None — uses 5 included daily runs |
| Routines created | 5 (all HTTP 200 responses from API) |
| Documentation committed | Pending (this report) |

---

## 11. REQUIRED: GitHub App connection (before first run)

**Critical prerequisite.** The routines clone `https://github.com/Yessenof/dubai-guide-site` to read and write files. Without GitHub connected, the clone will fail and routines will not write output files.

**Setup steps:**
1. Go to https://claude.ai/code/onboarding?magic=github-app-setup
2. Install the Claude GitHub App on the `Yessenof/dubai-guide-site` repository
3. Or run `/web-setup` in Claude Code to sync GitHub credentials

**After connecting:** routines will automatically use the credentials on their next scheduled run (first run: 2026-06-01).

Until GitHub is connected, routines will attempt to run but will fail at the git clone step.

---

## 12. Routine management URLs

- View all routines: https://claude.ai/code/routines
- R01: https://claude.ai/code/routines/trig_01N7xgjFVsXJUngruD3WunYi
- R02: https://claude.ai/code/routines/trig_014nMNqBaHHABn91FAFEDzqn
- R03: https://claude.ai/code/routines/trig_019JU3K2PBiehmRvAzsTQTXR
- R04: https://claude.ai/code/routines/trig_01THaHu2wafKh5ZcVzC8zqp9
- R05: https://claude.ai/code/routines/trig_01Bsdr3WcdsZm3dAXEZ2JT3B

To delete a routine (if needed): https://claude.ai/code/routines (deletion must be done via web UI).

---

*Phase 6C-92 complete.*

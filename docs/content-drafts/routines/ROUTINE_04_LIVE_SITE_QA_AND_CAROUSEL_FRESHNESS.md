# Routine 04 — Live Site QA and Carousel Freshness

**Routine ID:** GUIDEX-R04
**Schedule:** 07:30 UTC daily
**Output:** `docs/content-drafts/daily-radar/YYYY-MM-DD-live-qa.md`
**Context mode:** Standard (compact) — do NOT use 1M context

---

## Purpose

Daily automated health check of guidex-consulting.ae production site. Verifies that all live calendar, news, and event routes return 200. Checks that the carousel does not surface stale or past-date content. Flags any degraded route for immediate owner attention.

This routine reads and reports only. It does not change production. It does not deploy.

---

## Schedule recommendation

Daily at 07:30 UTC (11:30 GST). Runs after source routines so its output is available when the owner checks at start of business.

---

## Files to read (compact context — read only these)

1. `docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md` — safety rules (first 50 lines only)

Do NOT read CLAUDE.md, PROJECT_STATE.md, or source ledgers. This routine fetches live URLs directly.

---

## Production routes to check

### Calendar detail pages

| Route | Expected |
|-------|----------|
| /calendar/june-2026-uae-calendar | 200 |
| /ru/calendar/june-2026-uae-calendar | 200 |
| /calendar/july-2026-dubai-calendar | 200 |
| /ru/calendar/july-2026-dubai-calendar | 200 |
| /calendar/august-2026-dubai-calendar | 200 |
| /ru/calendar/august-2026-dubai-calendar | 200 |
| /calendar/september-2026-dubai-calendar | 200 |
| /ru/calendar/september-2026-dubai-calendar | 200 |
| /calendar/october-2026-dubai-calendar | 200 |
| /ru/calendar/october-2026-dubai-calendar | 200 |
| /calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /ru/calendar/uae-e-invoicing-2026-asp-deadline | 200 |
| /calendar/uae-emiratisation-june-30-2026-reminder | 200 |
| /ru/calendar/uae-emiratisation-june-30-2026-reminder | 200 |
| /calendar/uae-long-weekends-2026-2027 | 200 |
| /ru/calendar/uae-long-weekends-2026-2027 | 200 |
| /calendar/may-2026-uae-calendar | 200 |
| /ru/calendar/may-2026-uae-calendar | 200 |

### Calendar index + grid

| Route | Expected |
|-------|----------|
| /calendar | 200 |
| /ru/calendar | 200 |
| /calendar?month=2026-10 | 200 |
| /calendar?month=2026-11 | 200 |
| /calendar?month=2026-12 | 200 |

### News detail pages

| Route | Expected |
|-------|----------|
| /news/uae-eid-al-adha-2026-federal-holiday-long-break | 200 |
| /ru/news/uae-eid-al-adha-2026-federal-holiday-long-break | 200 |
| /news/uae-emiratisation-june-30-2026-deadline | 200 |
| /ru/news/uae-emiratisation-june-30-2026-deadline | 200 |

### Event detail pages

| Route | Expected |
|-------|----------|
| /events/uae-eid-al-adha-2026 | 200 |
| /ru/events/uae-eid-al-adha-2026 | 200 |

### Core pages

| Route | Expected |
|-------|----------|
| / | 200 |
| /ru | 200 |
| /sitemap.xml | 200 |
| /life-setup | 200 |
| /ru/life-setup | 200 |

---

## Freshness checks

After HTTP checks, fetch the homepage HTML and check carousel:

1. Does the carousel contain any events/holidays that have already passed by more than 30 days?
   - Eid Al Adha 2026 (May 25-29): expected to cycle out of carousel after June 2026
   - Emiratisation Jun 30 deadline: expected to be noindex'd after Jul 10
   - If a past-date item dominates the carousel → flag as STALE

2. Do the October calendar detail pages render correct titles?
   - /calendar/october-2026-dubai-calendar: title should contain "October 2026"
   - /ru/calendar/october-2026-dubai-calendar: title should contain "октябрь 2026"

3. Does /sitemap.xml include both October EN and RU URLs?

---

## Exact prompt

```
You are running the Guidex Live Site QA and Carousel Freshness routine (Routine 04).
Today's date: use the currentDate system variable.
Working directory: /Users/batyr/Desktop/dubai-guide-site
Base URL: https://guidex-consulting.ae

CONTEXT — read these files first (compact only):
- docs/content-drafts/routines/GUIDEX_DAILY_ROUTINES_STRATEGY.md (first 60 lines only)

TASK 1 — HTTP route checks:
Check every route listed in the PRODUCTION ROUTES section of ROUTINE_04_LIVE_SITE_QA_AND_CAROUSEL_FRESHNESS.md.
For each route: curl -s -o /dev/null -w "%{http_code}" --max-time 10 <URL>
Record: route, expected status, actual status, PASS/FAIL.

TASK 2 — Freshness check:
Fetch the homepage: https://guidex-consulting.ae
Check if carousel contains items that are more than 30 days past today.
Fetch /calendar/october-2026-dubai-calendar — check title contains "October 2026".
Fetch /ru/calendar/october-2026-dubai-calendar — check title contains "октябрь 2026".
Fetch /sitemap.xml — count "october-2026" occurrences (expect 2).

TASK 3 — Robots check on October pages:
Fetch /calendar/october-2026-dubai-calendar — confirm robots: index, follow.
Fetch /ru/calendar/october-2026-dubai-calendar — confirm robots: index, follow.

OUTPUT:
Write to: docs/content-drafts/daily-radar/[TODAY]-live-qa.md

Use this exact format:

---
# Guidex Daily Radar — Live Site QA
Date: [TODAY]
Routine: GUIDEX-R04 Live Site QA and Carousel Freshness
Status: [ALL_PASS / DEGRADED / ACTION_REQUIRED]
---

## HTTP route QA

| Route | Expected | Actual | Status |
|-------|----------|--------|--------|
| /calendar/october-2026-dubai-calendar | 200 | [N] | PASS/FAIL |
| ... | | | |

Total: [N]/[N] PASS

## Freshness check

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| October EN title | contains "October 2026" | [Y/N] | PASS/FAIL |
| October RU title | contains "октябрь 2026" | [Y/N] | PASS/FAIL |
| October in sitemap | 2 entries | [N] | PASS/FAIL |
| Carousel stale items | 0 | [N] | PASS/FAIL |
| October EN robots | index, follow | [value] | PASS/FAIL |
| October RU robots | index, follow | [value] | PASS/FAIL |

## Issues found

[List any FAIL items with description and recommended action]

## Hard stop confirmation
No production DB write. No import. No deploy. No schema change. No code change pushed.
This routine reads and reports only.
```

---

## Hard restrictions

- HARD STOP: no writes to `data/`, no DB queries, no import scripts
- HARD STOP: do not attempt to fix failing routes — report only
- HARD STOP: do not SSH to server
- If a route fails: document it and flag as ACTION_REQUIRED for owner
- Do not push any code changes (only docs to daily-radar)

---

## Escalation rules

| Scenario | Severity | Owner action |
|----------|----------|--------------|
| 1+ calendar detail page → not 200 | CRITICAL | Start hotfix phase immediately |
| Homepage → not 200 | CRITICAL | Start hotfix phase immediately |
| Sitemap → not 200 | HIGH | Start fix phase |
| Carousel contains 30+ day old item | MEDIUM | Review carousel logic in next phase |
| Robots shows noindex on live page | HIGH | Start indexing fix phase |

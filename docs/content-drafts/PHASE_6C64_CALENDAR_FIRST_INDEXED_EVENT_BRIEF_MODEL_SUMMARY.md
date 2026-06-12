r# Phase 6C-64 Part 2 — Calendar-First Indexed Event Brief Model Summary

**Date:** 2026-05-25
**Phase:** 6C-64 (Part 2)
**Scope:** Planning/model only — no code, no DB, no imports, no publish, no deploy, no commits without approval

---

## What Was Done

Designed a three-level content architecture for calendar events that enables Google and AI/RAG indexability without requiring a separate article, event, or news page for every calendar item.

**Files read during this phase:**
- `docs/content-drafts/CALENDAR_SEED_ITEM_POLICY.md` — 12-part policy on public vs internal items
- `docs/content-drafts/CALENDAR_CONNECTION_MODEL.md` — Calendar item anatomy, 22 fields, 13 types
- `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md` — All 2026 calendar candidates with classification status
- `docs/content-drafts/PHASE_6C64_E_INVOICING_FRESHNESS_RECHECK_AND_IMPORT_DECISION.md` — Phase 6C-64 Part 1 output (import path, guide model finding)
- `docs/content-drafts/CONTENT_BACKLOG_ROADMAP.md` — Pipeline and planned content types
- `docs/content-drafts/NEWS_SIGNAL_RADAR_MODEL.md` — NSR framework for time-sensitive content

**Files created:**
1. `docs/content-drafts/CALENDAR_FIRST_INDEXED_EVENT_BRIEF_MODEL.md` — Full model document (three levels, decision matrix, CTA rules, SEO/RAG structure, extended dates_json schema, 2026 candidate table, HTML implementation example, future code phase recommendation)
2. `docs/content-drafts/PHASE_6C64_CALENDAR_FIRST_INDEXED_EVENT_BRIEF_MODEL_SUMMARY.md` — This file

---

## What Was Not Touched

- DB: not touched
- Admin: not touched
- Schema/migrations: not touched
- Code: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- No imports, no content creation in admin, no deployments, no commits (pending owner approval)

---

## Model Decisions Made

### The Three Content Levels

| Level | Name | What it is | When to use |
|---|---|---|---|
| 1 | Calendar Cell | ≤40 char label, date, type, confidence | Every calendar item |
| 2 | Indexed Expandable Brief | 80–180 words, SSR'd, `<details>/<summary>` | Moderate-demand events without dedicated page |
| 3 | Full Detail Page | news post / event / calendar_page slug | High-demand, evergreen, complex, monetizable |

### Indexability Rule (critical)

Brief content must be in the **initial HTML server response**. The correct implementation is `<details>/<summary>` with all text in static HTML. The forbidden pattern is client-fetching brief content after hydration (useEffect, API call on expand). Google and AI crawlers do not execute deferred fetches during first-crawl indexing.

### When NOT to Create a Full Page

- Date is confirmed only, no procedure or user action required
- One-sentence fact (e.g. "Banks are closed on Eid Al Adha")
- Short-lifecycle news with no evergreen value
- Item is already covered within a larger page (Long Weekends, monthly calendar)
- Audience is narrow (specialist compliance, not general Dubai resident)

### When Full Page IS Required

- User needs step-by-step action (register, apply, file)
- Topic drives organic search volume (e.g. "e-invoicing UAE 2026 deadline")
- Evergreen content with annual relevance and update potential
- Monetizable: affiliates, partnerships, inbound service inquiries
- Strong linkability from external authoritative sources

### CTA Types and Labels

| Scenario | CTA type | EN label | RU label |
|---|---|---|---|
| Full news post exists | view_details | View details | Подробнее |
| Full guide exists | read_guide | Read guide | Читать гайд |
| Full event page exists | open_event | View event | Открыть событие |
| Official source only | open_source | Official source | Официальный источник |
| Scheduling / personal | add_calendar | Add to calendar | Добавить в календарь |
| Service/advice inquiry | ask_guidex | Ask Guidex | Спросить Guidex |

Forbidden: "Read full", "More info", "Click here", "Learn more" (generic).

### 2026 Candidate Classifications

| ID | Item | Level | Rationale |
|---|---|---|---|
| HOL-01 | Eid Al Adha | 3 (live) | Full package already live |
| HOL-02 | Islamic New Year | 2 (brief) | Confirmed date only; FAHR-dependent |
| HOL-03 | Mawlid | 2 (brief) | Confirmed date only; FAHR-dependent |
| HOL-04 | Commemoration Day | 1+2 (inside VIRAL-01) | No standalone page; duplicate risk |
| HOL-05 | National Day | 1+2 (inside VIRAL-01) | No standalone page; duplicate risk |
| VIRAL-01 | Long Weekends 2026-27 | 3 (live) | Yearly reference page; live |
| TAX-01A | Emiratisation June 30 | 3 (live) | news post + calendar live |
| TAX-05A | E-invoicing Jul 1 pilot | 2 (brief) | Part of e-invoicing calendar row |
| TAX-05C | E-invoicing Oct 30 ASP | 2→3 | Brief now; full news post on approval |
| TAX-05D | E-invoicing Jan 1 2027 | 2 (brief) | Part of e-invoicing calendar row |
| TAX-02 | Corporate Tax Sept 30 | 2 (brief) | Guide TBD; brief sufficient now |
| DXB-02 | GITEX 2026 | 2 (brief) | Dates pending; brief when confirmed |
| AUH-01 | F1 Abu Dhabi 2026 | 2 (brief) | Dates pending; brief when confirmed |
| DXB-01 | Cityscape Dubai | 2 (brief) | Dates TBC from organizer |
| Monthly calendar pages | May–Dec 2026 | 3 (full pages) | Monthly calendar_pages (SSG) |
| TAX-03 | VAT quarterly | Internal | Not public calendar item |
| TAX-06 | ESR | Internal | Specialist compliance only |
| TAX-07 | UBO | Internal | Specialist compliance only |
| TAX-08 | Trade license | Internal | Feeds Life Setup only |
| PROP-01/02 | Rent/Ejari | Internal | Feeds Life Setup only |
| DLS-07/08 | Visa/ID renewal | Internal | Feeds Life Setup only |
| HOL-10 | Ad hoc holidays | 1 (monitoring) | Unconfirmed; hold |

### Extended dates_json Schema

New additive fields per brief item (all optional, no breaking change to existing rows):

```json
{
  "brief_en": "80–180 word brief text",
  "brief_ru": "Russian brief text or empty string",
  "who_for_en": "Audience description",
  "who_for_ru": "",
  "what_to_do_en": "Action or awareness note",
  "what_to_do_ru": "",
  "source_label_en": "Ministry of Finance",
  "source_label_ru": "Министерство финансов",
  "source_url": "https://...",
  "source_status": "confirmed",
  "cta_type": "view_details",
  "cta_url": "/news/uae-e-invoicing-2026-asp-deadline-update",
  "cta_label_en": "View details",
  "cta_label_ru": "Подробнее",
  "location_en": "",
  "location_ru": "",
  "emirate": "UAE",
  "risk_level": "high",
  "lifecycle": "time_sensitive_news",
  "noindex_after": "2027-01-15",
  "archive_action": "noindex"
}
```

Schema is additive. Existing calendar_pages rows without brief fields continue to render as Level 1 cells. No migration required to add briefs; fields are parsed conditionally.

---

## Final Report Questions

### Can Guidex rank without full articles for every event?

Yes — for moderate-demand events. Level 2 briefs (80–180 words, SSR'd, in initial HTML) are fully crawlable by Google and AI/RAG systems. Monthly calendar pages that aggregate briefs for 10–20 events can rank for long-tail queries like "UAE October 2026 deadlines" or "Dubai events November 2026" without a standalone article per item. Full articles are only required when a topic drives direct search intent (e.g. "UAE e-invoicing ASP deadline 2026") or when the content is evergreen, monetizable, or linkable.

### How can accordion content stay indexable?

Use `<details>/<summary>` HTML with all brief text inside the `<details>` block in the server-rendered HTML response. The entire brief content — heading, body, source, CTA — must exist in the initial HTML payload from the server, not fetched after hydration. Google indexes `<details>` content even when collapsed. The forbidden pattern is any JavaScript-driven fetch (useEffect, API call on click) that loads brief content after the page loads — this content will not be in the first-crawl HTML and will not be indexed.

### What should get full pages?

Items that meet one or more of:
- User needs to take action (register, apply, file, attend)
- Topic drives direct organic search volume
- Content is evergreen with annual update potential
- Monetizable via referrals, partnerships, or service inquiries
- Strongly linkable from external authoritative sources

2026 examples: HOL-01 Eid Al Adha (live), TAX-01A Emiratisation (live), VIRAL-01 Long Weekends (live), TAX-05C E-invoicing news post (pending owner approval), monthly calendar pages (SSG).

### What should stay as calendar-only expandable briefs?

Items where:
- Date/deadline is the entire user need (no action steps)
- Short lifecycle with no evergreen reuse value
- Already covered within a larger page (VIRAL-01 covers HOL-04/HOL-05)
- Source not yet confirmed (HOL-02 Islamic New Year, HOL-03 Mawlid — wait for FAHR)
- Dates not yet captured (DXB-02 GITEX 2026, AUH-01 F1 Abu Dhabi 2026)

These items live as Level 2 briefs on monthly calendar pages until a full page becomes justified.

### What CTA labels should replace "Read full"?

Replace all instances of "Read full", "More info", "Click here", "Learn more" with the specific CTA type label from the approved table:

- News post exists → **"View details"** / **"Подробнее"**
- Guide exists → **"Read guide"** / **"Читать гайд"**
- Event page exists → **"View event"** / **"Открыть событие"**
- Official source only → **"Official source"** / **"Официальный источник"**
- Calendar/personal → **"Add to calendar"** / **"Добавить в календарь"**
- Service inquiry → **"Ask Guidex"** / **"Спросить Guidex"**

CTA type is stored in `dates_json.cta_type` per item. The component selects the correct label pair from this value; the content author does not write the label directly (except for `cta_label_en/ru` override fields when a non-standard label is needed).

### How should this affect the next calendar import batch?

The model changes the import batch in three ways:

1. **E-invoicing calendar row** (TAX-05A/C/D): import as a single `important_dates` calendar_pages row (slug: `uae-e-invoicing-2026-deadlines`) with three items, each carrying Level 2 brief fields. No standalone news post is needed before import — briefs on the calendar page are the primary content vehicle until the news post is approved.

2. **HOL-02 and HOL-03** (Islamic New Year, Mawlid): when FAHR announces, import as Level 2 brief items on the relevant monthly calendar pages. Do not create standalone news posts unless search intent warrants it.

3. **HOL-04/HOL-05** (Commemoration Day, National Day): if the December 2026 monthly calendar page is approved (owner decision pending), these items get Level 2 briefs on that page. Do not import as standalone calendar_pages.

Monthly calendar pages for June–December 2026 should be built with brief-field capacity from the start, so each month's confirmed items can include Level 2 content without a schema change.

### What is the safest future code phase to implement this model?

Three components, implemented in this order:

**1. SourceLabel component** — renders source name + status badge (confirmed/expected/monitoring) from `source_label_en/ru`, `source_url`, `source_status`. No date logic. Stateless. Low risk.

**2. BriefCTA component** — renders the CTA button/link from `cta_type`, `cta_url`, `cta_label_en/ru`. Locale-aware. Pure presentational. Low risk.

**3. CalendarBrief component** — wraps `<details>/<summary>`, renders brief text, who_for, what_to_do, SourceLabel, BriefCTA. Takes item object as prop. Conditionally rendered: only if `brief_en` is present in the item. All content SSR'd. No client fetches. Medium risk (new render path for calendar cells).

**QA checklist before any code phase ships:**
- Render a monthly calendar page with JS disabled — all brief text must be visible
- `curl` the page and grep for brief text — must appear in raw HTML
- Google Search Console: request indexing for a test calendar URL; inspect cached version
- Confirm `<details>` content not behind a fetch or state update
- Check EN and RU brief rendering side by side in the same page render

This code phase should not begin until at least one complete monthly calendar page with brief-field data is import-approved and in the DB — so the component has real data to test against.

---

## Output Files Created This Phase

| File | Purpose |
|---|---|
| `docs/content-drafts/CALENDAR_FIRST_INDEXED_EVENT_BRIEF_MODEL.md` | Full model: three levels, decision matrix, CTA rules, schema, 2026 candidates, HTML pattern, code phase |
| `docs/content-drafts/PHASE_6C64_CALENDAR_FIRST_INDEXED_EVENT_BRIEF_MODEL_SUMMARY.md` | This file — phase summary and final report Q&A |

---

**Phase 6C-64 Part 2 is complete. No code was touched. No DB was modified. No content was imported or deployed.**

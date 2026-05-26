# 2026–2027 Calendar Fill Sprint Plan

**Phase:** 6C-69
**Date:** 2026-05-26
**Status:** Planning document — no code, no DB, no imports, no publish
**Scope:** Calendar content planning for June 2026 through Q1 2027

---

## Sprint goal

Fill the public calendar with source-safe, SEO-ready content for the remaining months of 2026 and Q1 2027. Prioritize items with official sources already captured, highest audience relevance, and time-sensitive windows.

---

## Indexing status — calendar detail and monthly pages

Published detail and monthly calendar pages render with `robots: index, follow` and are indexable by Google and AI crawlers. The `/calendar` and `/ru/calendar` listing pages may remain `noindex, follow` as a product decision; this does not block indexed calendar detail or monthly pages.

There is no indexing blocker on this sprint. Content may be deployed and indexed as batch gates are cleared.

*(Note: an earlier version of this document described a "P0 noindex blocker" for all calendar routes. That claim was stale and was corrected in Phase 6C-69B — 2026-05-26.)*

---

## Sprint rules (permanent — do not skip)

### Source gate
A calendar item may only be created or imported when:
1. An official, permalink-accessible source exists in a source ledger file under `docs/content-drafts/source-ledgers/`
2. The date claim is directly visible on that official page
3. The source URL has been verified (HTTP 200) recently

### Islamic date rule (strict)
Never publish an Islamic holiday date (Islamic New Year, Mawlid, Eid Al Fitr, Eid Al Adha, Ramadan) as confirmed without:
- A live FAHR official announcement URL (fahr.gov.ae/en/news)
- OR a WAM state news agency confirmation
Media signals, calendars, historical patterns, and Islamic calendar calculators are not sources.

### Event date rule
All event dates must be verified directly from the official organiser website or official venue (DWTC, Expo City Dubai, Formula 1, etc.) immediately before any import. Dates captured for planning may have changed.

### Content quality gate
Before any calendar page is imported to the DB:
1. Owner review required for all body text and dates
2. Em-dash check: no U+2014 in any string
3. Blocked claims check: no unsupported fee/fine/penalty/legal claims
4. No "all businesses must comply" framing for any compliance item — always specify the applicable scope (e.g., "businesses with annual revenue of AED 50 million or above")
5. Source recheck immediately before import (not just at time of writing)

### Level assignment rules
- **Level 1 (cell only):** Items where the date label is sufficient and no detailed content is needed. Trade-only events, sub-events within a major event, statutory fixed dates.
- **Level 2 (indexed brief):** Items where 80–180 word EN+RU brief content adds genuine value. Compliance deadlines, major public events, business-critical dates. Renders as `<details>/<summary>` in CalendarBriefSection. SSR required.
- **Level 3 (full detail page):** Items with high standalone SEO value, multiple audience segments, and enough content to support 500+ words. Rare — only for major holidays, GITEX, F1, Long Weekends, Corporate Tax. Existing Level 3 pages: HOL-01, VIRAL-01, TAX-01, TAX-05, TAX-02.

---

## Monthly calendar page plan

Each month that contains public-facing calendar items needs a dedicated `calendar_pages` row with `calendarType: "monthly"` and a `month` value. Items in these pages appear in the CalendarGrid.

| Month | Slug | Status | Key items |
|-------|------|--------|-----------|
| Jun 2026 | jun-2026-uae-calendar | to create | Emiratisation June 30 (cross-ref to topic page) |
| Jul 2026 | jul-2026-uae-calendar | to create | E-invoicing pilot Jul 1 (cross-ref), Islamic New Year (hold) |
| Aug 2026 | aug-2026-uae-calendar | to create | Arabian Travel Market Aug 17-20, Mawlid (hold) |
| Sep 2026 | sep-2026-uae-calendar | to create | IPS Sep 7-9, Private Label Sep 15-17, Corporate Tax Sep 30 |
| Oct 2026 | oct-2026-uae-calendar | to create | Beautyworld Oct 6-8, WETEX Oct 20-22, E-invoicing ASP Oct 30 (cross-ref), DFC Oct 31 |
| Nov 2026 | nov-2026-uae-calendar | to create | Design Week Nov 3-8, Downtown Design Nov 4-8, Dubai Run Nov 22, Big 5 Nov 23-26, DFC sub-events |
| Dec 2026 | dec-2026-uae-calendar | to create | Commemoration Day Dec 1, National Day Dec 2-3, Abu Dhabi GP Dec 3-6, GITEX Summit Dec 7, GITEX Expo Dec 8-11, Emiratisation Dec 31 |
| Jan 2027 | jan-2027-uae-calendar | to create | New Year Jan 1, E-invoicing mandatory Jan 1 (cross-ref) |

**Note on cross-reference items:** If a date already has a dedicated topic page (e.g., Emiratisation June 30 has `/calendar/uae-emiratisation-june-30-2026-reminder`), the monthly page item should link to it via `detail_url`. Do not duplicate the indexed brief content — use Level 1 cell with a `detail_url` instead.

---

## Standalone topic calendar page plan

These are new or existing `calendar_pages` rows with `calendarType` that is NOT monthly. They cover specific topics or multi-date events.

| Slug | Status | Type | Dates | Source status |
|------|--------|------|-------|---------------|
| uae-long-weekends-2026-2027 | **already_live — do not reimport** | yearly | New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3 | FAHR confirmed |
| uae-emiratisation-june-30-2026-reminder | **already_live — do not reimport** | important_dates | Jun 30 2026 | MoHRE confirmed |
| uae-e-invoicing-2026-asp-deadline | imported locally (Phase 6C-68) | important_dates | Jul 1, Oct 30, Jan 1 2027 | MoF confirmed |
| uae-corporate-tax-fy2025-deadline | to create | important_dates | Sep 30 2026 | FTA confirmed |
| uae-emiratisation-dec-31-2026 | to create (recycle TAX-01 pattern) | important_dates | Dec 31 2026 | MoHRE/NAFIS confirmed |
| formula-1-abu-dhabi-grand-prix-2026 | event draft exists | event | Dec 3-6 2026 | F1 + Abu Dhabi GP official |
| gitex-global-2026 | event draft exists | event | Dec 7-11 2026 | gitex.com official |
| dubai-fitness-challenge-2026 | to create | event | Oct 31 - Nov 29 2026 | DFC official |

---

## Priority batches

### Batch 1 — Immediate (before June 30 2026)

| Item | What to do | Gate |
|------|-----------|------|
| VIRAL-01 Long Weekends | **already live — do not reimport** | — |
| TAX-01A Emiratisation June 30 | **already live — do not reimport** | — |
| Push commits c774709 + a7c7fe5 | Push Phase 6C-67 + Phase 6C-68C to GitHub; safe deploy sequence: PM2 stop → build → PM2 start | Owner approval |
| E-invoicing source recheck | Recheck all MoF source URLs (TAX-05A/C/D) immediately before production import | Recheck required before import |
| Production import e-invoicing | Import TAX-05A/C/D news + calendar page with indexed briefs to production DB | Owner approval; source recheck complete |

### Batch 2 — June–July 2026

| Item | Type | Gate |
|------|------|------|
| June 2026 monthly calendar page | New monthly page | Source recheck; owner review |
| July 2026 monthly calendar page | New monthly page | Source recheck; owner review |
| Islamic New Year 1448H | HOLD — add to July page only after FAHR announces | FAHR announcement |
| E-invoicing production deploy | Deploy Phase 6C-68 records to production | Owner approval; source recheck |

### Batch 3 — August–September 2026

| Item | Type | Gate |
|------|------|------|
| Aug 2026 monthly calendar page | New monthly page | Arabian Travel Market source recheck |
| Sep 2026 monthly calendar page | New monthly page | IPS, Corporate Tax sources recheck |
| Mawlid An-Nabi 1448H | HOLD — add to Aug page only after FAHR announces | FAHR announcement |
| Corporate Tax FY2025 guide + calendar page | New topic page + guide | FTA source capture (T1-03); owner review |
| Arabian Travel Market event draft | Event draft | Source B recheck; owner review |

### Batch 4 — October 2026

| Item | Type | Gate |
|------|------|------|
| Oct 2026 monthly calendar page | New monthly page | Beautyworld, WETEX source recheck |
| Dubai Fitness Challenge event draft | Event draft | DFC source B recheck; owner review |
| WETEX event draft | Event draft | Source G recheck; owner review |

### Batch 5 — November 2026

| Item | Type | Gate |
|------|------|------|
| Nov 2026 monthly calendar page | New monthly page | Design Week, Big 5 source recheck |
| Dubai Design Week event draft | Event draft | Source D recheck; owner review |
| Big 5 Global event draft | Event draft | Source H recheck; owner review |

### Batch 6 — November–December 2026

| Item | Type | Gate |
|------|------|------|
| Dec 2026 monthly calendar page | New monthly page | F1, GITEX, National Day sources recheck |
| National Day 2026 | HOLD — add only after FAHR scope confirmed | FAHR announcement; MoHRE alignment |
| Commemoration Day 2026 | Add to Dec page as Level 1; upgrade to Level 2 when FAHR scope confirmed | FAHR announcement |
| F1 Abu Dhabi GP event page | Import existing event draft | F1 + Abu Dhabi GP source recheck; owner review |
| GITEX event page | Import existing event draft | gitex.com source recheck; owner review |
| Emiratisation Dec 31 calendar | New topic page (recycle TAX-01 pattern) | MoHRE/NAFIS source recheck |
| DSF 2026 | HOLD — add when visitdubai.com/mydsf.ae confirms dates | Official source capture |

### Batch 7 — December 2026 – January 2027

| Item | Type | Gate |
|------|------|------|
| Jan 2027 monthly calendar page | New monthly page | New Year confirmed; DSF end date if applicable |
| DSF 2026/2027 event page | HOLD until official dates confirmed | DSF official source |
| Ramadan 2027 | MONITOR — draft content template; import when FAHR confirms | FAHR announcement (expected Jan 2027) |
| HOL-07 Ramadan 1448H | Start draft template Dec 2026 | Official announcement Jan 2027 |

---

## Hold list — do not create content until gate is cleared

| Item | Hold reason | Watch from |
|------|------------|------------|
| Islamic New Year 1448H (~Jun 16-17) | FAHR announcement not yet issued | Late May 2026 |
| Mawlid An-Nabi 1448H (~Aug 25) | FAHR announcement not yet issued | July 2026 |
| Commemoration Day 2026 (holiday scope) | FAHR 2026 scope not yet announced | October 2026 |
| National Day 2026 (holiday scope) | FAHR/MoHRE 2026 scope not yet announced | October 2026 |
| Eid Al Fitr 2027 (~Mar 8-11) | Moon-sighting confirmation pending | February 2027 |
| Eid Al Adha 2027 (~May 15-19) | Moon-sighting confirmation pending | April 2027 |
| Ramadan 1448H start (~Feb 6 2027) | FAHR announcement not yet issued | December 2026 |
| Dubai Shopping Festival 2026/2027 | Official dates not confirmed | September 2026 |
| Global Village Season 31 | Official opening date not confirmed | July 2026 |
| GITEX Global 2026 dates | Already confirmed — but recheck immediately before import | September 2026 |
| F1 Abu Dhabi GP 2026 session times | Session times may change; race weekend dates confirmed | November 2026 |
| Dubai Airshow 2026 | Biennial event — confirm whether 2026 edition exists | June 2026 |

---

## Monitoring schedule

| Date | Action |
|------|--------|
| Late May 2026 | Begin monitoring FAHR for Islamic New Year 1448H announcement |
| June 2026 | Monitor FAHR weekly for Islamic New Year; confirm GITEX dates still correct; check if DSF 2026/2027 dates published |
| July 2026 | Monitor DFC official site for DFC 2026 sub-event schedule; monitor FAHR for Mawlid |
| August 2026 | Check Dubai Design Week 2026 programme; check Big 5 venue details; monitor FAHR for National Day/Commemoration Day circular |
| September 2026 | Recheck all October events (Beautyworld, WETEX); check DSF dates; check GITEX programme |
| October 2026 | Monitor FAHR for National Day 2026 holiday scope announcement; check DSF dates; recheck F1 and GITEX |
| November 2026 | Check FAHR for National Day 2026 scope if not yet announced; check Global Village Season 31; recheck F1 session schedule |

---

## Content volume estimate

| Category | Monthly pages | Topic pages | Event drafts | Total pages |
|----------|--------------|-------------|--------------|-------------|
| Currently live | 1 | 3 | 0 | 4 |
| Batch 1 (import ready) | 0 | 2 | 0 | 2 |
| Batch 2 (Jun–Jul) | 2 | 0 | 0 | 2 |
| Batch 3 (Aug–Sep) | 2 | 1 | 1 | 4 |
| Batch 4 (Oct) | 1 | 0 | 2 | 3 |
| Batch 5 (Nov) | 1 | 0 | 2 | 3 |
| Batch 6 (Nov–Dec) | 1 | 2 | 2 | 5 |
| Batch 7 (Dec–Jan) | 1 | 1 | 1 | 3 |
| **Total** | **9** | **9** | **8** | **26** |

---

## SEO window priority

Items where publishing early captures pre-event search traffic:

| Item | Publish by | Why |
|------|-----------|-----|
| Long Weekends guide (VIRAL-01) | **already live** | Post-Eid search wave + National Day planning starts — window captured |
| Emiratisation June 30 | **already live** | Deadline June 30 — window captured |
| Corporate Tax FY2025 guide | August 1 2026 | 8-week lead before Sep 30 deadline |
| GITEX Global 2026 event page | October 1 2026 | 10 weeks before December event |
| F1 Abu Dhabi GP event page | November 1 2026 | 5 weeks before race weekend |
| National Day 2026 | November 15 2026 | 2.5 weeks before Dec 2 |

---

*Planning document — internal use only. No code. No DB. No imports. No publish.*
*Created: 2026-05-26 (Phase 6C-69). Review and update when official sources are captured or batch gates are cleared.*

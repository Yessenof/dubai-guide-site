# Phase 6C-CALENDAR-EXPANSION-01 — Final Report

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-01 — November/December 2026 Calendar & Event Expansion Planning  
**Mode:** Planning and draft only.  
**Status:** Complete.

---

## Summary

Reviewed 15 candidates from prior research (6C-CALENDAR-RESEARCH-01). Audited current live November and December 2026 calendar pages and all 5 live event detail pages. Identified 7 actionable gaps. Produced full content drafts for 3 event/skeleton pages and 4 calendar item draft sets. Drafted the detail page strategy for the November–December expansion.

No DB writes. No imports. No deploy. No commit. No push. No schema changes. No admin or AI Inbox interaction.

---

## Files created

| File | Purpose |
|---|---|
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-01-current-state-audit.md` | Audit of live November/December content, gaps, EN/RU parity, risks |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-01-candidate-matrix.md` | 15-row matrix with source status, priority, recommended action, blocked claims |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-01-first-batch-plan.md` | 7-item first batch plan with rationale, source status, blocked claims per item |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-01-detail-page-strategy.md` | Detail page strategy: slugs, EN/RU routes, internal links, blocked claims, build sequence |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-01-report.md` | This file |
| `docs/content-drafts/events/dp-world-tour-championship-2026-draft.md` | Full EN+RU event page draft — confirmed, ready for import |
| `docs/content-drafts/events/global-village-dubai-season-31-draft.md` | EN+RU skeleton draft — body safe; opening date blocked |
| `docs/content-drafts/events/dubai-shopping-festival-2026-2027-draft.md` | EN+RU skeleton draft — body safe; all dates blocked |
| `docs/content-drafts/calendar/november-2026-new-items-draft.md` | 5 November calendar items (2 ready, 1 correction, 2 provisional) |
| `docs/content-drafts/calendar/december-2026-new-items-draft.md` | 5 December calendar items (2 ready, 1 hold, 1 provisional, 1 future) |

---

## Candidates reviewed

**15 total** from 6C-CALENDAR-RESEARCH-01, plus current DB state cross-check.

| Status | Count | Items |
|---|---|---|
| Confirmed | 5 | DP World Tour Championship, Dubai FinTech Summit, DFC date correction, Corporate Tax Dec 31 deadline, Emiratisation H2 deadline |
| Provisional | 3 | Global Village Season 31 (month confirmed, date not), Frieze Abu Dhabi (media signal), ILT20 Season 5 (secondary sources) |
| Blocked / Hold | 3 | DSF dates (no official source), NYE Dubai (too early), ILT20 (unverified) |
| Fold-in | 2 | Downtown Design → Design Week page; Expand North Star → GITEX page |
| Already live | 5 | Dubai Design Week, Big 5 Global, F1 Abu Dhabi GP, GITEX Global, all existing Nov/Dec calendar items |
| Out of scope | 2 | Cityscape Global (Riyadh), Money20/20 ME (Riyadh) |

---

## First batch selected (7 items)

| # | Item | Format | Month | Source status |
|---|---|---|---|---|
| 1 | DP World Tour Championship 2026 | Event page + calendar item | November | Confirmed — europeantour.com |
| 2 | UAE Corporate Tax 31 Dec 2026 deadline (March year-end) | Calendar item only | December | Confirmed — FTA 9-month rule |
| 3 | UAE Emiratisation H2 2026 deadline | Calendar item only | December | Confirmed — MoHRE policy (verify penalty figure before import) |
| 4 | Global Village Season 31 | Event page skeleton | October+ | Month confirmed; date blocked |
| 5 | Dubai Shopping Festival 2026–2027 | Event page skeleton | December | Date blocked; body safe |
| 6 | Dubai FinTech Summit 2026 | Calendar item only | November | Confirmed — reconfirm on dubaifintechsummit.com before import |
| 7 | DFC date correction | Calendar item correction | October + November | Confirmed — dubaifitnesschallenge.com |

---

## Blocked / Hold items (not in first batch)

| Item | Reason |
|---|---|
| Frieze Abu Dhabi 2026 | Source is media signal; dates need confirmation on frieze.com or abudhabiart.ae |
| ILT20 Season 5 2026 | Season window from secondary sources only; must verify on ilt20.com |
| NYE Dubai 2026 | Program not announced; recheck mid-November |
| DSF specific dates | No official DFRE/DET announcement; three conflicting aggregator guesses |
| Expand North Star fold-in | Editorial micro-edit; no urgency; can be done anytime |
| Downtown Design fold-in | Same |

---

## Official sources confirmed (used in first batch)

| Item | Source URL | Source type |
|---|---|---|
| DP World Tour Championship | https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/ | Official organizer |
| Dubai FinTech Summit | https://www.difc.com/whats-on/events/dubai-fintech-summit | Official government-linked authority |
| Dubai Fitness Challenge | https://www.dubaifitnesschallenge.com/en/ | Official organizer |
| UAE Corporate Tax deadline | https://tax.gov.ae/ | Official government (FTA) |
| UAE Emiratisation H2 | https://mohre.gov.ae/ | Official government (MoHRE) |
| Global Village Season 31 | https://www.globalvillage.ae/en/ | Official organizer (month only; date not yet) |

Sources NOT used for dating claims: Wikipedia, ArtNews, Time Out Dubai, travel2fair.com, aggregator guesses — these appear in the candidate matrix as signals only.

---

## Detail pages recommended

| Slug | Priority | Status | When to build |
|---|---|---|---|
| `dp-world-tour-championship-2026` | P0 | Draft complete | Phase 6C-CALENDAR-EXPANSION-02 |
| `global-village-dubai-season-31-2026` | P0 | Skeleton complete | Phase 6C-CALENDAR-EXPANSION-02 (import skeleton now; add opening date once confirmed) |
| `dubai-shopping-festival-2026-2027` | P0 | Skeleton complete | Phase 6C-CALENDAR-EXPANSION-02 (import skeleton now; date field locked until DFRE announces) |
| `ilt20-season-5-2026` | P1 | Not started | After ilt20.com confirms season window |
| `dubai-fintech-summit-2026` | P2 optional | Not started | Evaluate after B2B audience data |
| `frieze-abu-dhabi-2026` | P2 | Not started | After organizer-direct confirmation |

---

## Calendar items recommended

**November 2026** — ready to add (once owner approves Phase 6C-CALENDAR-EXPANSION-02):
- DP World Tour Championship (12–15 Nov) — confirmed
- Dubai FinTech Summit (2–3 Nov) — confirmed (reconfirm on summit site)
- DFC correction: add 30x30 window to existing Dubai Ride item
- Frieze Abu Dhabi (20–22 Nov) — provisional; add after source confirmed
- ILT20 Season 5 start (22 Nov) — provisional; add after ilt20.com confirms

**October 2026** — ready to add:
- DFC start (31 Oct) — new item; confirmed

**December 2026** — ready to add:
- Corporate Tax 31 Dec deadline — confirmed
- Emiratisation H2 31 Dec deadline — confirmed (verify penalty figure on mohre.gov.ae)
- DSF — hold until DFRE announces
- ILT20 December continuation — provisional

---

## EN/RU parity result

All drafts produced EN+RU simultaneously. Both locales cover identical facts with equivalent intent. RU written in natural editorial Russian (not literal translation). Blocked claims are identical across both locales. No EN-only drafts were created.

---

## Confirmations

- No DB writes: ✓
- No admin or AI Inbox: ✓
- No imports run: ✓
- No deploy: ✓
- No commit: ✓
- No push: ✓
- No schema changes: ✓
- No sitemap changes: ✓
- No live content changed: ✓ (only memory files updated)
- No unsupported facts added: ✓ (all drafts have explicit blocked claims sections)
- No invented dates, venues, prices, performers, organizers, audience figures: ✓

---

## Next recommended phase

**Phase 6C-CALENDAR-EXPANSION-02** — owner-reviewed first-batch implementation and import.

Scope:
1. Import DP World Tour Championship 2026 event page (EN+RU) to DB
2. Import Global Village Season 31 skeleton (EN+RU) to DB — body live, date field locked
3. Import Dubai Shopping Festival 2026–2027 skeleton (EN+RU) to DB — date field locked
4. Import November 2026 calendar items: DP World Tour Championship + Dubai FinTech Summit + DFC correction
5. Import October 2026 calendar item: DFC 31 Oct start
6. Import December 2026 calendar items: Corporate Tax deadline + Emiratisation H2 deadline
7. Reconfirm Dubai FinTech Summit on dubaifintechsummit.com before import
8. Verify Emiratisation H2 penalty figure on mohre.gov.ae before adding to December item label

Second-wave (Phase 6C-CALENDAR-EXPANSION-03 or later):
- ILT20 Season 5 — after ilt20.com confirms
- Frieze Abu Dhabi — after frieze.com or abudhabiart.ae confirms
- Global Village opening date — once announced
- DSF dates — once DFRE announces
- NYE Dubai — once program announced (mid-November 2026)
- Expand North Star and Downtown Design fold-ins into existing event pages

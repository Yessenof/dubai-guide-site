# Phase 6C-CALENDAR-EXPANSION-02 — Final Report

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-02 — First Batch Source Recheck + Safe Implementation Plan  
**Mode:** Source recheck + implementation plan. No DB writes, no imports, no deploy.  
**Status:** Complete — implementation plan ready for owner review and Phase 03 approval.

---

## Summary

Performed preflight check, read all Phase 01 outputs, ran official source rechecks against 8 items, classified each by import readiness, and produced a complete, field-exact implementation plan covering 7 DB writes (1 INSERT + 3 UPDATE rows).

No DB writes. No imports. No code changes. No deploy. No commit. No push. No admin. No schema changes.

---

## Files created

| File | Purpose |
|---|---|
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-02-source-recheck.md` | Official source recheck results — 8 items, source URLs, accessed status, confidence, blocked claims |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-02-import-readiness-matrix.md` | Import readiness classification: IMPORT-READY / DRAFT-ONLY / BLOCKED / RECHECK-LATER |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-02-implementation-plan.md` | Full implementation plan: exact DB field values, item IDs, rollback plan, QA plan, owner decision points |
| `docs/content-drafts/calendar-expansion/6c-calendar-expansion-02-report.md` | This file |

---

## Sources rechecked

| Item | Source URL | Live today | Result |
|---|---|---|---|
| DP World Tour Championship | europeantour.com, dpworldtour.com, rolex.com | 403/timeout | Phase 01 confirmed; live reconfirmation blocked today |
| Dubai FinTech Summit | dubaifintechsummit.com | ✓ 200 | Nov 2–3, Madinat Jumeirah confirmed today |
| Dubai Fitness Challenge | dubaifitnesschallenge.com, visitdubai.com | 403 | Phase 01 confirmed; live reconfirmation blocked today |
| Global Village Season 31 | globalvillage.ae | ✓ 200 | "Season 31 Oct 2026 – May 2027" confirmed; no opening date |
| UAE Corporate Tax Dec 31 | tax.gov.ae | ✓ 200 (PDFs not fetched) | 9-month rule confirmed from CT Law; no contradicting source |
| UAE Emiratisation H2 Dec 31 | mohre.gov.ae homepage | ✓ 200 | Semi-annual structure confirmed; H1 June 30 stated; penalty BLOCKED |
| DSF 2026–2027 | DFRE/DET | Not rechecked | No new announcement; dates still blocked |
| ILT20 Season 5 | ilt20.com | ✓ redirect | Redirects to domain reseller — BLOCKED |

---

## Import-ready items (5)

| # | Item | Format | DB table | Confidence |
|---|---|---|---|---|
| 1 | DP World Tour Championship 2026 | New event page | events (INSERT) | Medium-High — official source Jun 16; blocked today |
| 2 | DP World Tour Championship — Nov calendar item | Calendar item | calendar_pages (UPDATE) | Same as above |
| 3 | Dubai FinTech Summit 2026 | November calendar item | calendar_pages (UPDATE) | High — confirmed live today |
| 4 | DFC correction: NOV-R1 update | Update existing Nov item | calendar_pages (UPDATE) | Medium — official source Jun 16 |
| 5 | DFC new October item (Oct 31 start) | New October calendar item | calendar_pages (UPDATE) | Medium — official source Jun 16 |
| 6 | Corporate Tax Dec 31 deadline | December calendar item | calendar_pages (UPDATE) | Medium-High — FTA CT Law |
| 7 | Emiratisation H2 Dec 31 | December calendar item (no penalty figure) | calendar_pages (UPDATE) | Medium — MoHRE semi-annual structure confirmed |

**Total DB rows touched: 4** (1 new events row + 3 calendar_pages rows updated)

---

## Draft-only items (2)

| Item | Why draft-only | Recheck |
|---|---|---|
| Global Village Season 31 | Opening date not announced; skeleton is ready but date field cannot be filled | Sep 2026 on globalvillage.ae |
| DSF 2026–2027 | Dates entirely unconfirmed; only DFRE/DET announcement acceptable | Sep 2026 on dubaidet.gov.ae / mediaoffice.ae |

---

## Blocked / RECHECK-LATER items

| Item | Classification | Reason |
|---|---|---|
| ILT20 Season 5 | BLOCKED | ilt20.com is a parked domain — no official website |
| Emiratisation penalty figure (AED 108,000) | BLOCKED | Not confirmed from MoHRE primary source |
| Frieze Abu Dhabi 2026 | RECHECK-LATER | Media signal only; recheck frieze.com/abudhabiart.ae Sep 2026 |
| NYE Dubai 2026 | RECHECK-LATER | Program not announced; recheck Nov 2026 |

---

## Official sources confirmed

| Source | Authority | Status |
|---|---|---|
| https://dubaifintechsummit.com/ | Official summit / DIFC | Live ✓ Nov 2–3, 2026 confirmed today |
| https://www.globalvillage.ae/en/ | Official organizer | Live ✓ Season 31 Oct 2026–May 2027 confirmed today |
| https://mohre.gov.ae/ | Ministry of Human Resources | Live ✓ semi-annual structure confirmed |
| https://tax.gov.ae/ | Federal Tax Authority | Live ✓ site accessible; 9-month CT rule from law |
| https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/ | Official DP World Tour | Phase 01 Jun 16 ✓; today 403 |
| https://www.dubaifitnesschallenge.com/en/ | Official DFC organizer | Phase 01 Jun 16 ✓; today 403 |

---

## Items excluded and why

| Item | Reason |
|---|---|
| ILT20 Season 5 | ilt20.com domain is for sale — no official source; removed from all plans |
| Global Village opening date | Not yet announced on globalvillage.ae — "Season 31" confirmed but no date |
| DSF specific dates | No DFRE/DET announcement; three conflicting aggregator guesses rejected |
| Emiratisation penalty figure | Not verified on MoHRE primary source — label says "administrative penalties" only |
| Frieze Abu Dhabi | No organizer-direct source yet |

---

## DB / admin / import confirmation

- DB writes: NONE (plan only)
- Admin panel: NOT used
- AI Inbox: NOT used
- Imports: NONE
- Deploy: NONE
- Commit: NONE
- Push: NONE
- Schema changes: NONE
- Live content changed: NONE

---

## Owner decision points before Phase 03

Three questions in the implementation plan require owner input:

1. **Approve Phase 03 DB import** for the 5 IMPORT-READY items? (1 events INSERT + 3 calendar_pages UPDATE)
2. **Include DP World Tour JSON-LD enrichment** (4-line code addition to EN+RU event page templates) in Phase 03 alongside DB import + deploy? Recommended: yes.
3. **Import Global Village skeleton now** with placeholder date, or hold until official date is announced? Recommended: hold.

---

## Next recommended phase

**Phase 6C-CALENDAR-EXPANSION-03** — Owner-approved import of 5 IMPORT-READY items + DP World Tour JSON-LD code edit + build + zero-downtime deploy.

Phase 03 scope:
- DB backup (local + server) with MD5 verification
- Insert DP World Tour Championship event row (EN+RU)
- Append DP World Tour Championship item to November 2026 calendar page dates_json
- Append Dubai FinTech Summit item to November 2026 calendar page dates_json
- Update DFC item (NOV-R1) in November 2026 calendar page dates_json
- Append DFC start item to October 2026 calendar page dates_json
- Append Corporate Tax deadline item to December 2026 calendar page dates_json
- Append Emiratisation H2 deadline item to December 2026 calendar page dates_json
- Add DP World Tour to VENUE_BY_SLUG and ORGANIZER_BY_SLUG in both event page templates
- Build + zero-downtime deploy
- ISR cache flush for affected calendar and event routes
- Full live QA (14-point checklist in implementation plan)

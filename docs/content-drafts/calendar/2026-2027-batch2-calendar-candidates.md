# 2026–2027 Batch 2 Calendar Candidates

**Phase:** 6C-72
**Date:** 2026-05-26
**Status:** Planning document — no code, no DB, no imports, no publish
**Scope:** Batch 2 calendar content candidates selected after e-invoicing production import (Phase 6C-71B)

---

## Already-live — do not reimport

| Item | Slug | Status |
|------|------|--------|
| Long Weekends 2026-2027 | `uae-long-weekends-2026-2027` | already_live |
| Emiratisation June 30 2026 | `uae-emiratisation-june-30-2026-reminder` + news | already_live |
| Eid Al Adha 2026 | news post + May 2026 monthly | already_live |
| E-invoicing 2026 (TAX-05A/C/D) | `uae-e-invoicing-2026-asp-deadline` + news | already_live |

---

## Batch 2 candidates — ranked

---

### B2-01 — Corporate Tax FY2025 Return Deadline

| Field | Value |
|-------|-------|
| Item ID | B2-01 |
| EN title | UAE Corporate Tax FY2025: 9-month filing deadline (September 30, 2026) |
| RU title draft | Корпоративный налог в ОАЭ: срок подачи декларации за 2025 год (30 сентября 2026) |
| Date | 2026-09-30 |
| Location / emirate | UAE-wide |
| Category | compliance / tax |
| Source URL | https://tax.gov.ae/en/media.centre/news/federal.tax.authority.urges.submission.of.corporate.tax.returns.and.settlement.of.corporate.tax.liabilities.within.nine.months.from.the.end.of.the.tax.period.aspx |
| Source status | source_ready — FTA Source A captured in `uae-corporate-tax-deadline-sources.md`; recheck_before_import |
| Risk level | HIGH — must not say "all companies file Sep 30"; must present as example for Dec year-end companies only |
| Content level | L3 — standalone topic calendar page |
| CTA rule | Internal CTA to Corporate Tax guide when published; FTA EmaraTax as external source link |
| Source gap | Penalty source not yet captured; FTA EmaraTax filing steps source not yet captured |
| EN brief status | Guide draft exists: `docs/content-drafts/guides/uae-corporate-tax-deadline-9-month-rule.md`; needs review and adaptation for calendar brief |
| RU brief status | Not yet written |
| Detail page needed | Yes — topic calendar page `uae-corporate-tax-fy2025-deadline` |
| Next action | Owner reviews existing guide draft; recheck FTA Source A URL; draft calendar page body and dates_json; write EN+RU brief (80-180 words) |
| Import readiness | draft_ready (guide exists) — needs calendar topic page draft + source recheck |
| Publish by | **August 1 2026** — 8-week minimum before Sep 30 deadline |
| Notes | Frame as "Dec 31 year-end companies" example, not all companies. Never say "all UAE companies file Sep 30." Adviser caveat required. |

---

### B2-02 — GITEX Global 2026

| Field | Value |
|-------|-------|
| Item ID | B2-02 |
| EN title | GITEX Global 2026 in Dubai: dates, venue and business planning notes |
| RU title draft | GITEX Global 2026 в Дубае: даты, место и что спланировать бизнесу |
| Date | Summit: 2026-12-07; Expo: 2026-12-08 to 2026-12-11 |
| Location / emirate | Dubai Exhibition Centre, Expo City Dubai |
| Category | business_event |
| Source URL | https://www.gitex.com/gitex-global-2026; https://www.dubaiexhibitioncentre.com/en/whats-on/gitex-global-2026 |
| Source status | source_ready — confirmed from two official sources (gitex.com + Dubai Exhibition Centre), verified 2026-05-19 in `dubai-2026-events-tourism-sources.md`; recheck_before_import |
| Risk level | LOW-MEDIUM — dates confirmed; venue confirmed (Expo City, NOT DWTC — do not confuse); do not state specific speakers, ticket prices, or session details |
| Content level | L3 — standalone event page |
| CTA rule | External CTA to gitex.com when registration opens; confirm registration is live before adding CTA |
| Source gap | Programme/speaker details not sourced; ticket pricing not confirmed; registration open/closed status must be checked before publish |
| EN brief status | Event draft exists: `docs/content-drafts/events/gitex-global-2026.md` |
| RU brief status | To write alongside EN review |
| Detail page needed | Yes — event page `gitex-global-2026` |
| Next action | Owner reviews existing event draft; recheck gitex.com for current registration status; write L2 brief for Dec monthly calendar item |
| Import readiness | draft_ready (event draft exists) — needs source recheck + owner review |
| Publish by | **October 1 2026** — 10-week lead before December event |
| Notes | Venue is Expo City Dubai, NOT DWTC. "First-ever edition at Expo City." Event window: Summit Dec 7, Expo Dec 8-11. Abu Dhabi GP race day Dec 6 — consecutive events, useful planning note. |

---

### B2-03 — Dubai Fitness Challenge 2026

| Field | Value |
|-------|-------|
| Item ID | B2-03 |
| EN title | Dubai Fitness Challenge 2026: dates and key citywide events |
| RU title draft | Dubai Fitness Challenge 2026: даты и главные городские события |
| Date | 2026-10-31 to 2026-11-29 |
| Location / emirate | Dubai (citywide) |
| Category | lifestyle_event |
| Source URL | https://www.dubaifitnesschallenge.com/en/ |
| Source status | source_ready — verified 2026-05-18 in `dubai-2026-events-tourism-sources.md`; recheck_before_import |
| Risk level | LOW-MEDIUM — dates confirmed; sub-event dates confirmed; do not state registration status, routes, or fees without rechecking |
| Content level | L2 — standalone event page; L1 sub-items in Oct and Nov monthly pages |
| CTA rule | External CTA to dubaifitnesschallenge.com for registration; confirm registration is live before adding CTA |
| Source gap | Registration windows, venue details, and sub-event schedule may change — recheck from official site before import |
| EN brief status | Not yet written |
| RU brief status | Not yet written |
| Detail page needed | Yes — event page `dubai-fitness-challenge-2026` |
| Next action | Create event draft `docs/content-drafts/events/dubai-fitness-challenge-2026.md`; add to Oct 2026 and Nov 2026 monthly pages when created; recheck DFC official site before import |
| Import readiness | source_ready — content not yet drafted |
| Publish by | **September 1 2026** — 8 weeks before Oct 31 start |
| Sub-events (all L1) | Dubai Ride: Nov 1 / Stand Up Paddle: Nov 7-8 / Dubai Run: Nov 22 / Dubai Yoga: Nov 29 |
| Notes | Citywide challenge; open to residents and visitors. Do not state "exclusively for residents." Sub-events link back to DFC event page via detail_url. |

---

### B2-04 — Formula 1 Abu Dhabi Grand Prix 2026

| Field | Value |
|-------|-------|
| Item ID | B2-04 |
| EN title | Formula 1 Abu Dhabi Grand Prix 2026: dates, race weekend and Dubai travel planning |
| RU title draft | Formula 1 Abu Dhabi Grand Prix 2026: даты, гоночный уикенд и поездка из Дубая |
| Date | Practice: 2026-12-04; Qualifying: 2026-12-05; Race day: 2026-12-06; Event window: 2026-12-03 to 2026-12-06 |
| Location / emirate | **Abu Dhabi** — Yas Marina Circuit (NOT Dubai — must always show Abu Dhabi) |
| Category | sports_event / tourism_event |
| Source URL | https://www.formula1.com/en/racing/2026/united-arab-emirates; https://www.abudhabigp.com/en/ |
| Source status | source_ready — 3 official sources captured in `dubai-2026-events-tourism-sources.md`, verified 2026-05-19; recheck_before_import |
| Risk level | MEDIUM — location must always show Abu Dhabi; do not claim ticket prices; session times may change; do not call it "Dubai Grand Prix" or "Dubai event" |
| Content level | L3 — standalone event page |
| CTA rule | External CTA to abudhabigp.com/en/ for tickets; confirm ticket availability before adding CTA |
| Source gap | Ticket prices, packages, and entertainment performers not sourced; session times may be updated closer to event |
| EN brief status | Event draft exists: `docs/content-drafts/events/formula-1-abu-dhabi-grand-prix-2026.md` |
| RU brief status | To write alongside EN review |
| Detail page needed | Yes — event page `formula-1-abu-dhabi-grand-prix-2026` |
| Next action | Owner reviews existing event draft; recheck F1 official schedule; confirm Abu Dhabi location is clear in all labels |
| Import readiness | draft_ready (event draft exists) — needs source recheck + owner review |
| Publish by | **November 1 2026** — 5 weeks before race weekend |
| Notes | **Critical: Abu Dhabi event, not Dubai.** All labels must show Yas Marina Circuit, Abu Dhabi. "Dubai Grand Prix" is incorrect — never use. F1 and GITEX are consecutive (GP Dec 6, GITEX Summit Dec 7) — useful travel planning context. |

---

### B2-05 — Arabian Travel Market 2026

**DATE CORRECTION (Phase 6C-83, 2026-05-28):** ATM was rescheduled from May, then from August. Correct dates are Sep 14-17, 2026 per DWTC official page and trade press (May 22, 2026). The Aug 17-20 dates below are STALE — do not use. ATM is now imported as SEP-04-ATM in the September 2026 calendar draft.

| Field | Value |
|-------|-------|
| Item ID | B2-05 |
| EN title | Arabian Travel Market 2026, Dubai |
| RU title draft | Arabian Travel Market 2026, Дубай |
| Date | ~~2026-08-17 to 2026-08-20~~ **CORRECTED: 2026-09-14 to 2026-09-17** |
| Location / emirate | DWTC, Dubai |
| Category | tourism_event / trade_event |
| Source URL | https://www.dwtc.com/en/events/arabian-travel-market-exhibition-2026/ |
| Source status | source_ready — DWTC Sep 14-17 confirmed 2026-05-22 (trade press); recheck_before_import |
| Risk level | LOW-MEDIUM — rescheduled twice; verify current dates before import |
| Content level | L2 — item in Sep 2026 monthly calendar page (SEP-04-ATM, not August) |
| CTA rule | External CTA to arabiantravelmarket.wtm.com or DWTC page |
| EN brief status | L2 brief written in September draft |
| RU brief status | L2 brief written in September draft |
| Detail page needed | No standalone page at this stage |
| Next action | Import as SEP-04-ATM in September 2026 calendar. NOT in August. |
| Import readiness | draft_ready — included in September 2026 calendar draft (Phase 6C-83) |
| Publish by | **August 1 2026** — Sep calendar needed before Sep 14 opening |
| Notes | CRITICAL: ATM is in SEPTEMBER (Sep 14-17), not August. The Aug 17-20 dates are stale and incorrect. Do not add ATM to the August calendar. ATM was rescheduled from May to September. Recheck official site before import — rescheduled twice. |

---

### B2-06 — Dubai Design Week 2026

| Field | Value |
|-------|-------|
| Item ID | B2-06 |
| EN title | Dubai Design Week 2026 |
| RU title draft | Dubai Design Week 2026 |
| Date | 2026-11-03 to 2026-11-08 |
| Location / emirate | Dubai Design District (d3), Dubai |
| Category | design_event |
| Source URL | https://www.dubaidesignweek.ae/ |
| Source status | source_ready — verified 2026-05-18; recheck_before_import |
| Risk level | LOW-MEDIUM — do not state specific installations, artists, or exhibitions without official programme; confirm venue is d3 before import |
| Content level | L2 — item in Nov 2026 monthly calendar page |
| CTA rule | External CTA to dubaidesignweek.ae |
| Source gap | Programme details not confirmed; venue (d3 / DIFC) must be confirmed before import |
| EN brief status | Not yet written (80-180 words) |
| RU brief status | Not yet written |
| Detail page needed | No standalone page at this stage; possible later for design/property content cluster |
| Next action | Create Nov 2026 monthly page; write L2 brief focusing on design/property/interior audience |
| Import readiness | source_ready — brief not yet written |
| Publish by | **September 1 2026** |
| Notes | Runs concurrently with Downtown Design Dubai (Nov 4-8). Add both to Nov monthly page together. |

---

### B2-07 — Big 5 Global 2026

| Field | Value |
|-------|-------|
| Item ID | B2-07 |
| EN title | Big 5 Global 2026, Dubai |
| RU title draft | Big 5 Global 2026, Дубай |
| Date | 2026-11-23 to 2026-11-26 |
| Location / emirate | DWTC, Dubai |
| Category | construction_event |
| Source URL | https://www.dwtc.com/en/events/the-big-5-2026/ |
| Source status | source_ready — verified 2026-05-18; recheck_before_import |
| Risk level | LOW — dates confirmed; do not invent exhibitor list or conference agenda |
| Content level | L2 — item in Nov 2026 monthly calendar page |
| CTA rule | External CTA to DWTC or official Big 5 site if available |
| Source gap | Official Big 5 standalone site (big5constructiondubai.com) not yet checked |
| EN brief status | Not yet written |
| RU brief status | Not yet written |
| Detail page needed | No standalone page at launch; possible later for construction/property cluster |
| Next action | Add to Nov 2026 monthly page; write L2 brief for construction/property audience |
| Import readiness | source_ready — brief not yet written |
| Publish by | **September 1 2026** |
| Notes | Late November — separate from Design Week (early Nov). Both go in same monthly page. |

---

### B2-08 — International Property Show 2026

| Field | Value |
|-------|-------|
| Item ID | B2-08 |
| EN title | International Property Show 2026, Dubai |
| RU title draft | Международная выставка недвижимости 2026, Дубай |
| Date | 2026-09-07 to 2026-09-09 |
| Location / emirate | DWTC, Dubai |
| Category | real_estate_event / trade_event |
| Source URL | https://www.dwtc.com/en/events/international-property-show-2026/ |
| Source status | source_ready — verified 2026-05-18; recheck_before_import |
| Risk level | LOW — trade-only; do not present as public property fair |
| Content level | L1 — item in Sep 2026 monthly calendar page |
| CTA rule | External CTA to DWTC page or IPS official site if available |
| Source gap | IPS official site not yet checked |
| EN brief status | Not needed for L1 |
| RU brief status | Not needed for L1 |
| Detail page needed | No standalone page at this stage; possible later for property content cluster |
| Next action | Create Sep 2026 monthly page (`sep-2026-uae-calendar`); add IPS as L1 item |
| Import readiness | source_ready — no draft needed for L1 |
| Publish by | **July 15 2026** |

---

### B2-09 — Emiratisation Dec 31 2026 Annual Quota Deadline

| Field | Value |
|-------|-------|
| Item ID | B2-09 |
| EN title | Emiratisation annual quota deadline — December 31, 2026 |
| RU title draft | Эмиратизация: итоговый срок ежегодной квоты (31 декабря 2026) |
| Date | 2026-12-31 |
| Location / emirate | UAE (mainland) |
| Category | compliance |
| Source URL | https://nafis.gov.ae; https://www.mohre.gov.ae |
| Source status | source_ready — MoHRE/NAFIS confirmed in `uae-mohre-compliance-2026-sources.md`; recheck_before_import |
| Risk level | HIGH — must specify "mainland businesses with 50+ employees"; never say "all employers"; no penalty amounts without MoHRE source |
| Content level | L3 — standalone topic calendar page (recycle TAX-01 pattern from Emiratisation June 30) |
| CTA rule | Internal cross-ref to Emiratisation June 30 page; external CTA to NAFIS/MoHRE |
| Source gap | Dec 31 specific fine/penalty amounts not yet sourced from MoHRE |
| EN brief status | Not yet written; can adapt from Emiratisation June 30 pattern |
| RU brief status | Not yet written |
| Detail page needed | Yes — `uae-emiratisation-dec-31-2026` |
| Next action | Draft new topic page recycling TAX-01 pattern; recheck MoHRE/NAFIS URLs; owner review; import after GITEX/F1 event pages are done |
| Import readiness | source_ready — content not yet drafted |
| Publish by | **October 1 2026** |
| Notes | Distinct from June 30 deadline (semi-annual check). This is the full-year quota close. Same audience, different deadline. |

---

### B2-10 — WETEX 2026

| Field | Value |
|-------|-------|
| Item ID | B2-10 |
| EN title | WETEX 2026, Dubai |
| RU title draft | WETEX 2026, Дубай |
| Date | 2026-10-20 to 2026-10-22 |
| Location / emirate | DWTC, Dubai |
| Category | business_event / sustainability |
| Source URL | https://www.dwtc.com/en/events/wetex-2026/ |
| Source status | source_ready — DWTC verified 2026-05-18; WETEX official site (wetex.ae) not yet checked; recheck_before_import |
| Risk level | LOW-MEDIUM — confirm DEWA as organiser from WETEX official site before stating; do not invent exhibitor categories |
| Content level | L2 — item in Oct 2026 monthly calendar page |
| CTA rule | External CTA to DWTC or WETEX official site |
| Source gap | WETEX official site (wetex.ae) not yet confirmed; DEWA organiser claim needs confirmation from WETEX own site |
| EN brief status | Not yet written |
| RU brief status | Not yet written |
| Detail page needed | No standalone page at this stage |
| Next action | Check wetex.ae; add to Oct 2026 monthly page; write L2 brief for sustainability/energy/business audience |
| Import readiness | source_recheck_needed — DWTC confirmed; WETEX official site not yet verified |
| Publish by | **August 15 2026** |

---

## Additional L1 items for monthly pages (no separate drafts needed)

| Item | Date | Page | Source | Recheck |
|------|------|------|--------|---------|
| Private Label Middle East 2026 | Sep 15-17 2026 | sep-2026 | DWTC confirmed | Yes |
| Beautyworld Middle East 2026 | Oct 6-8 2026 | oct-2026 | DWTC confirmed | Yes |
| Downtown Design Dubai 2026 | Nov 4-8 2026 | nov-2026 | downtowndesign.com confirmed | Yes — confirm Dubai edition specifically |
| Dubai Ride 2026 | Nov 1 2026 | nov-2026 | DFC confirmed | Yes |
| Dubai Stand Up Paddle 2026 | Nov 7-8 2026 | nov-2026 | DFC confirmed | Yes |
| Dubai Run 2026 | Nov 22 2026 | nov-2026 | DFC confirmed | Yes |
| Dubai Yoga 2026 | Nov 29 2026 | nov-2026 | DFC confirmed | Yes |
| Commemoration Day 2026 | Dec 1 2026 | dec-2026 | Statute confirmed; scope pending FAHR | Yes |
| New Year 2027 | Jan 1 2027 | jan-2027 | Statute confirmed | Yes |

---

## Hold list — do not create content

| Item | Hold reason | Watch from |
|------|------------|-----------|
| Islamic New Year 1448H (~Jun 16-17) | No FAHR announcement | Late May 2026 |
| Mawlid An-Nabi 1448H (~Aug 25) | No FAHR announcement | July 2026 |
| National Day 2026 holiday scope | FAHR 2026 circular pending | October 2026 |
| Commemoration Day 2026 scope | FAHR 2026 scope pending | October 2026 |
| Dubai Shopping Festival 2026/2027 | Official dates not confirmed | September 2026 |
| Global Village Season 31 | Official opening date not confirmed | July 2026 |
| Ramadan 1448H start (~Feb 6 2027) | FAHR/WAM announcement pending | December 2026 |
| Eid Al Fitr 2027 (~Mar 8-11) | Moon-sighting pending | February 2027 |
| Eid Al Adha 2027 (~May 15-19) | Moon-sighting pending | April 2027 |
| Dubai Airshow 2026 | Biennial — confirm whether 2026 edition exists | June 2026 |

---

## New monthly calendar pages needed (in order)

| Page slug | Target create | Key items |
|-----------|--------------|-----------|
| `aug-2026-uae-calendar` | DONE — `august-2026-dubai-calendar` live | DSS final month, Def Leppard Aug 2, DIHAD Aug 24-26 |
| `sep-2026-uae-calendar` | DONE — `september-2026-dubai-calendar` in QA | MEE Sep 1-3; IPS Sep 7-9; ATM **Sep 14-17** (NOT Aug); Seamless Sep 22-24; Corp Tax Sep 30 |
| `oct-2026-uae-calendar` | August 15 2026 | Beautyworld Oct 6-8; WETEX Oct 20-22; E-invoicing ASP cross-ref; DFC Oct 31 |
| `nov-2026-uae-calendar` | September 1 2026 | DFC sub-events; Dubai Design Week; Downtown Design; Big 5; Dubai Run |
| `dec-2026-uae-calendar` | October 1 2026 | F1 Abu Dhabi GP; GITEX Summit; GITEX Expo; Commemoration Day; National Day; Emiratisation Dec 31 |
| `jan-2027-uae-calendar` | November 1 2026 | New Year 2027; E-invoicing mandatory cross-ref |

Note: Jun 2026 and Jul 2026 monthly pages are lower priority — Islamic New Year is on hold (the main Jun/Jul item). Create after Aug-Sep pages are live.

---

## Source recheck rule (applies to all Batch 2 items)

All source URLs in this document were captured in May 2026. Before any import action, every source URL must be verified as live (HTTP 200) and the date/venue claim must still be readable on the official page on the day of import. Do not treat a captured URL as a permanent source — pages change.

---

*Planning document — internal use only. No code. No DB. No imports. No publish.*
*Created: 2026-05-26 (Phase 6C-72). All dates and source statuses as of 2026-05-26.*

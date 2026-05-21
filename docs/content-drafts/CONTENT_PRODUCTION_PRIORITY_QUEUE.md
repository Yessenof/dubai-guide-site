# Content Production Priority Queue

**Version:** 1.0
**Last updated:** 2026-05-21 (Phase 6C-45 — Long Weekend import path confirmed as calendar_pages, calendarType "yearly"; import map created; VIRAL-01 is import_path_decision_complete, preferred_path_calendar_reference; do NOT import as news; blocked on D-1–D-5 owner decisions)
**Status:** Internal planning document
**Input:** CONTENT_BACKLOG_ROADMAP.md (152 rows), CONTENT_AUDIT_MATRIX.md (7 current drafts)
**Purpose:** Converts the backlog into a practical, sequenced production order.

This is not a content calendar. It is a production sequence: what to work on next, in what order, and why.

---

## Priority scoring model

Every item in the backlog is scored on 8 dimensions. Score each dimension 0 to 3.

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| SEO demand | No identifiable search demand | Low volume or niche | Medium volume | High volume, primary keyword cluster |
| RAG/AEO answerability | Cannot be machine-readable | Low structured content | Medium structured | Clean facts table, quick answer, source-backed |
| Monetization path | No service connection | Indirect (trust building only) | Clear CTA opportunity | Direct revenue path (setup, service, referral) |
| Source readiness | No source exists | Signal only | Source ledger created | Source verified and live |
| Calendar relevance | No date connection | Optional reminder | Important recurring reminder | Fixed dated item or deadline |
| EN/RU complexity | Existing EN + RU | EN only, RU draft ready | EN only, RU not started | Neither started |
| Risk level | No regulatory claims | Low risk | Medium risk | High: visa/tax/fines/fees/deadlines |
| Time sensitivity | No deadline | Useful year-round | Seasonal (3-6 months window) | Immediate: expires soon or date is close |

**Higher score = more urgent. Risk is inverted: higher risk = lower priority until source is confirmed.**

---

## Priority groups

---

## P0: Must fix before anything is published

These are blocking issues in existing drafts. Nothing else should be published first.

### P0-01: Owner review of all 7 existing drafts

**Why:** The publication gate requires owner review before any draft can go to admin. This is the universal blocker.
**Affects:** All 7 drafts (EV-01, HOL-01, CAL-01, EV-02, EV-03, CG-01, CG-02)
**Source status:** N/A
**Next action:** Owner reads each draft file; approves or flags corrections
**Blocked claims:** None introduced by this step
**Service/CTA angle:** None in this step
**Calendar link:** All 7 have calendar items; links reviewed during owner review
**RU work:** Owner confirms RU reads correctly
**Readiness target:** After owner approval, re-score each draft

### P0-02: Add missing SEO structure fields to news draft ~~[RESOLVED Phase 6C-27]~~

**Item:** HOL-01 (uae-eid-al-adha-2026-federal-holiday-long-break.md)
**Why:** Missing target_keywords_en/ru and search_intent_en/ru fields; required by publication gate
**Next action:** ~~Edit the draft to add these 4 fields; no source work needed~~ — RESOLVED in Phase 6C-27. target_keywords_en/ru, search_intent_en/ru, and full calendar item metadata added.
**Target:** ~~Immediate; 30 minutes of work~~ — complete as of 2026-05-20
**Phase 6C-29 update (2026-05-20):** News draft meta descriptions trimmed further (EN: 179 → 125 chars; RU: 173 → 128 chars). Launch decision checklist created: `docs/content-drafts/reviews/eid-al-adha-2026-launch-checklist.md`. Owner review updated with launch decision section. Calendar items A–D confirmed safe to import; items E (DGHR) and F (KHDA) remain on hold pending official permalink capture.

### P0-03: Add detail_url_en/ru to calendar items in guide drafts [PARTIALLY RESOLVED Phase 6C-28]

**Items:** CG-01 (Corporate Tax guide), ~~CG-02 (VAT guide)~~
**Why:** Calendar items in both guides were missing the detail_url fields; calendar-to-detail link cannot be built without these
**Next action:** ~~Edit both guide files~~ — CG-02 (VAT) RESOLVED in Phase 6C-28. CG-01 (Corporate Tax) still needs detail_url_en/ru added to all 3 calendar items.
**Target:** CG-01 before next publish consideration for the Corporate Tax guide
**Phase 6C-28 update (2026-05-20):** CG-02 (VAT guide) — detail_url_en/ru added + all other missing calendar item metadata fields added (lifecycle: relative_reminder, noindex_after: not_applicable, archive_action: keep_public, external_cta_status, location_display, emirate). VAT guide is now owner_review_ready.

### P0-04: Define lifecycle and noindex rules for news and calendar posts ~~[RESOLVED Phase 6C-27]~~

**Items:** HOL-01, CAL-01 (May 2026 calendar)
**Why:** Both have time-sensitive content; without lifecycle and noindex timing defined, content may rank for expired information after the date passes
**Note on CAL-01:** May 2026 ends within days of this writing; this is very urgent
**Next action:** ~~Add lifecycle: short_lived_offer and noindex_after: 2026-06-01 to CAL-01; add lifecycle: annual_news to HOL-01 with archive after 90 days~~ — RESOLVED in Phase 6C-27. All three Eid files now have lifecycle, noindex_after, and archive_action defined.
**Target:** ~~CAL-01 before end of May; HOL-01 within 2 weeks~~ — complete as of 2026-05-20
**Phase 6C-22 update:** DGHR and KHDA sources now media_confirmed — CAL-01 Dubai government and school holiday claims can reference DGHR/KHDA scope with media_confirmed framing. Owner must confirm scope framing before adding to published calendar. Partial unblock for DGHR/KHDA calendar items only.
**Phase 6C-27 update (2026-05-20):** HOL-01: lifecycle: time_sensitive_news, noindex_after: 2026-06-01, archive_action: noindex_keep. EV-01 (uae-eid-al-adha-2026): lifecycle: major_annual_event, noindex_after: 2026-12-31, archive_action: keep_public. CAL-01: lifecycle: time_sensitive_news, noindex_after: 2026-06-01, archive_action: archive. All three files owner_review_ready.

### P0-05: Resolve GITEX venue (venue_recheck_required)

**Item:** EV-02 (gitex-global-2026.md)
**Why:** venue_recheck_required: true is in metadata; publishing with uncertain venue is a factual accuracy risk
**Next action:** ~~Capture T1-04 source~~ — RESOLVED in Phase 6C-22. Update draft to confirm venue: Dubai Exhibition Centre, Expo City Dubai. Remove venue_recheck_required: true flag from metadata.
**Target:** Before Oct 2026 publish deadline — venue confirmation no longer blocking; update metadata flag now
**Phase 6C-22 update:** T1-04 resolved. Venue confirmed. Draft EV-02 needs metadata update (venue_recheck_required: false) and venue field confirmed in draft body. No other blocking items remain for venue.

### P0-06: Update Corporate Tax natural person date anchor to 2026 framing

**Item:** CG-01 (uae-corporate-tax-deadline-9-month-rule.md)
**Why:** Natural person section references March 2025 as historical anchor; this is stale for 2026-forward content
**Next action:** Edit the relevant section to frame the 2026 Gregorian year and 31 March 2027 registration deadline; flag as requiring source confirmation (capture T1-03)
**Target:** Before any publish date for this guide

---

## P1: Highest-value source-ledger-first items

These are the items where the source ledger work must happen before any draft. The draft does not start until the ledger exists.

Ordered by combined priority score (SEO demand + monetization + time sensitivity).

### P1-01: DED mainland trade license application and fees

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | Unlocks the highest-traffic company setup content cluster; direct monetization via company setup service |
| Source status | Needed (T2-01) |
| Next action | Navigate to ded.ae; capture license application process, required documents, fee schedule, processing time |
| Blocked claims | All DED application steps and fees |
| Service/CTA angle | Company setup assistance (Path C); WhatsApp CTA |
| Calendar link | Unlocks license renewal reminders (CI-03) |
| RU work | Full EN draft first; RU draft after EN owner review |
| Readiness target | Draft ready: within 2 weeks of source capture |

### P1-02: ICA UAE visa types and golden visa source ledger

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | Visa guides are the highest traffic Dubai planning category; golden visa has very high search demand |
| Source status | Needed (T2-02) |
| Next action | Navigate to icp.gov.ae > Residency; capture eligibility and application steps for employment, partner, investor, golden visa |
| Blocked claims | Specific eligibility thresholds for golden visa; step-by-step for each visa type |
| Service/CTA angle | Visa application assistance (Path D); WhatsApp CTA |
| Calendar link | Visa expiry reminder (CI-09); Emirates ID renewal (CI-10) |
| RU work | Full EN/RU parity required; Russian-speaking audience is large in this cluster |
| Readiness target | Draft ready: within 2 weeks of source capture |

### P1-03: MoHRE WPS source ledger

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | WPS compliance is mandatory for all private sector employers; high search demand from company owners |
| Source status | Needed (T2-03) |
| Next action | Navigate to mohre.gov.ae > WPS; capture registration process, monthly payroll deadline, penalty framework |
| Blocked claims | Specific WPS deadlines and penalty amounts |
| Service/CTA angle | Business compliance assistance (Path G); WhatsApp CTA |
| Calendar link | Monthly WPS payroll reminder (CI-04) |
| RU work | Required |
| Readiness target | Draft ready: within 2 weeks of source capture |

### P1-04: MoHRE ILOE source ledger

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | ILOE is mandatory for all private sector employees since Jan 2023; many companies still not fully compliant |
| Source status | Needed (T2-04) |
| Next action | Navigate to iloe.ae or mohre.gov.ae > ILOE; capture enrolment rules, deduction amount, registration deadline |
| Blocked claims | ILOE premium, exemptions, enforcement |
| Service/CTA angle | Employer compliance assistance (Path G) |
| Calendar link | ILOE monthly deduction reminder (CI-08) |
| RU work | Required |
| Readiness target | Draft ready: within 2 weeks of source capture |

### P1-05: FTA VAT return filing schedule source ledger

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | VAT return deadlines are the most commonly missed compliance obligation; high search demand |
| Source status | Needed (T2-08) |
| Next action | Navigate to tax.gov.ae > VAT > Return Filing; capture return period rules and submission deadline |
| Blocked claims | Any specific VAT return deadline date |
| Service/CTA angle | Tax compliance assistance; WhatsApp referral to tax agent |
| Calendar link | Quarterly VAT filing reminders (CI-02) |
| RU work | Required |
| Readiness target | Draft ready: within 2 weeks of source capture |

### P1-06: UAE e-invoicing 2026 content package

| Field | Value |
|---|---|
| Type | content_package — news draft + guide draft + calendar visual post |
| Why it matters | E-invoicing affects all large businesses (>= AED 50M revenue) in the UAE; mandatory compliance deadline confirmed for 30 October 2026 (ASP) and 1 January 2027 (implementation) |
| Source status | **FULLY RESOLVED — official_permalink_captured (Phase 6C-23, 2026-05-19)** |
| Content package status | **CREATED (Phase 6C-24, 2026-05-19) — draft_file_only — owner_review_required** |
| Files created | News draft: docs/content-drafts/news/uae-e-invoicing-2026-asp-deadline-update.md |
| | Guide draft: docs/content-drafts/guides/uae-e-invoicing-2026-business-readiness.md |
| | Calendar visual post: docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md |
| Unblocked in Phase 6C-23 | Official MoF permalink captured: https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ (published 10 May 2026). 30 October 2026 ASP deadline confirmed from official source. Cabinet Resolution 106 of 2025 captured as penalty source (AED 5,000/month). |
| Next action | Owner review of all three draft files; confirm EN/RU accuracy; confirm scope notes are clear; approve before any admin or publish action |
| Blocked claims | Free zone scope (not confirmed); 2026-specific penalty amounts cited without Cabinet Resolution 106 of 2025 source |
| Service/CTA angle | E-invoicing implementation assistance; accounting system readiness advisory |
| Calendar link | ASP deadline 30 Oct 2026 (priority 1); pilot start 1 Jul 2026; mandatory implementation 1 Jan 2027 — all in calendar visual post |
| RU work | RU draft included in both news and guide draft files — ready for owner review |
| Readiness target | Owner review needed before any publish consideration; recheck MoF source at time of publish |

### P1-07: ICA Emirates ID renewal source ledger

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | Emirates ID renewal is a universal Dubai resident need; extremely high search volume |
| Source status | Needed (T2-06) |
| Next action | Navigate to icp.gov.ae > Services > Emirates ID renewal; capture renewal window, documents, fees |
| Blocked claims | Specific EID renewal fees and timing |
| Service/CTA angle | Document and service assistance (Path B) |
| Calendar link | EID renewal reminder (CI-10) |
| RU work | Required |
| Readiness target | Draft ready: within 2 weeks of source capture |

### P1-08: DHA mandatory health insurance source ledger

| Field | Value |
|---|---|
| Type | source_ledger |
| Why it matters | Health insurance is mandatory in Dubai; every resident and company must understand their obligation |
| Source status | Needed (T2-07) |
| Next action | Navigate to dha.gov.ae > Health Insurance |
| Blocked claims | Health insurance minimum coverage and employer obligation details |
| Service/CTA angle | Health insurance advisory as part of relocation package (Path H) |
| Calendar link | Health insurance renewal reminder (annual) |
| RU work | Required |
| Readiness target | Draft ready: within 2 weeks of source capture |

---

## P2: First publishable evergreen guides (after sources ready)

These guides can be drafted and submitted for publication gate once their P1 source ledgers are complete.

### P2-01: Dubai mainland company setup: DED license application guide

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Highest monetization potential in company setup cluster; directly drives WhatsApp consultations |
| Source status | Blocked on P1-01 (DED source ledger) |
| Next action | Draft after P1-01 complete |
| Blocked claims | Any DED fee or step-by-step process |
| Service/CTA angle | "We can help with your company setup" (Path C) |
| Calendar link | License renewal reminders (CI-03) |
| RU work | Full EN+RU draft; Russian founders and investors are a primary audience |
| Readiness target | Publication gate ready: 4 weeks after P1-01 source capture |

### P2-02: UAE visa types comparison: which visa do I need?

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Top-of-funnel for all Dubai relocation content; drives visa service inquiries |
| Source status | Blocked on P1-02 (ICA source ledger) |
| Next action | Draft after P1-02 complete |
| Blocked claims | Specific eligibility thresholds without ICA source |
| Service/CTA angle | "We can help with your visa application" (Path D) |
| Calendar link | Visa expiry reminder (CI-09) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 4 weeks after P1-02 complete |

### P2-03: UAE golden visa: 10-year investor eligibility and process

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Golden visa is a premium, high-intent search; readers are investors with high service value |
| Source status | Blocked on P1-02 (ICA source ledger) |
| Next action | Draft after P1-02 complete |
| Blocked claims | Specific investment thresholds, eligibility categories |
| Service/CTA angle | "We help with golden visa applications" (Path D) |
| Calendar link | Visa expiry reminder (CI-09) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 5 weeks after P1-02 complete |

### P2-04: Emirates ID renewal: timing, documents, process

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Universal need for all UAE residents; very high search volume; low competitive differentiation |
| Source status | Blocked on P1-07 (ICA EID source ledger) |
| Next action | Draft after P1-07 complete |
| Blocked claims | EID renewal fees and exact processing time |
| Service/CTA angle | Document assistance (Path B) |
| Calendar link | EID renewal reminder (CI-10) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 3 weeks after P1-07 complete |

### P2-05: Corporate Tax for natural persons and freelancers: AED 1M rule

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Large and growing audience of self-employed people in Dubai; strong search demand post-2024 CT rollout |
| Source status | Partially blocked on T1-03 (FTA natural person 2026 anchor) |
| Next action | Capture T1-03 first; draft CT natural persons guide |
| Blocked claims | 31 March 2027 registration deadline (needs 2026 Gregorian year confirmation from FTA) |
| Service/CTA angle | Tax adviser referral (Path A) |
| Calendar link | Natural person CT registration reminder (CI-01 variant) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 3 weeks after T1-03 captured |

### P2-06: Ejari registration for tenants: the 30-day rule

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Every new Dubai tenant needs Ejari; medium-high search volume; direct service opportunity |
| Source status | DLD Ejari source ledger exists (partial) |
| Next action | Complete DLD Ejari source ledger; draft Ejari tenant guide |
| Blocked claims | Specific Ejari registration fee (needs verification from DLD) |
| Service/CTA angle | "We can help with your Ejari registration" (Path E) |
| Calendar link | Ejari renewal reminder (CI-06) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 3 weeks after source ledger complete |

### P2-07: Dubai rental index: how to check your rent increase

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | High search demand from tenants facing renewal pressure; DLD source ledger exists |
| Source status | DLD rental index source ledger exists |
| Next action | Draft guide using existing DLD rental index source ledger |
| Blocked claims | Any specific rent increase percentage without DLD calculation tool result |
| Service/CTA angle | "Need help with a rental dispute?" (Path E) |
| Calendar link | Rental index review reminder (CI-07) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 3 weeks from draft start |

### P2-08: MoHRE WPS: wage protection system for employers

| Field | Value |
|---|---|
| Type | guide |
| Why it matters | Every mainland employer must use WPS; high compliance stakes; strong service path |
| Source status | Blocked on P1-03 (WPS source ledger) |
| Next action | Draft after P1-03 complete |
| Blocked claims | Specific WPS penalties and deadlines |
| Service/CTA angle | Employer compliance assistance (Path G) |
| Calendar link | Monthly WPS payroll reminder (CI-04) |
| RU work | Full EN+RU required |
| Readiness target | Publication gate ready: 3 weeks after P1-03 complete |

---

## P3: Event and seasonal pages (publish before or during peak search window)

Seasonal pages must be published 4-6 weeks before the event to capture pre-event search traffic.

### P3-01: Dubai Fitness Challenge 2026 event page

| Publish target | By 1 Oct 2026 (DFC typically Oct-Nov) |
|---|---|
| Source status | Source ledger needed (T3-02) |
| Next action | Monitor dubaifitnesschallenge.com from Jul 2026; capture source by Aug 2026 |
| Calendar link | DFC dates and registration opening |

### P3-02: WETEX and Big5 Dubai 2026 event page

| Publish target | By 1 Oct 2026 |
|---|---|
| Source status | Source ledger needed (T3-09) |
| Next action | Monitor dwtc.com from Jun 2026 |

### P3-03: Dubai Design Week 2026 event page

| Publish target | By 1 Oct 2026 |
|---|---|
| Source status | Source ledger needed (T3-03) |
| Next action | Monitor dubaidesignweek.ae from Jun 2026 |

### P3-04: Global Village Season 31 event page

| Publish target | By 1 Oct 2026 |
|---|---|
| Source status | Source ledger needed (T3-05) |
| Next action | Monitor globalvillage.ae from Jul 2026 |

### P3-05: GITEX Global 2026 event page (venue now confirmed)

| Publish target | By 1 Oct 2026 |
|---|---|
| Current state | Draft exists (3/5); venue_recheck_required resolved in Phase 6C-22 |
| Next action | Update draft metadata (venue_recheck_required: false; venue: Dubai Exhibition Centre, Expo City Dubai); then owner review and publish |
| Phase 6C-22 update | Venue confirmed. P0-05 blocking issue resolved. Remaining gate: owner review. |

### P3-06: Formula 1 Abu Dhabi GP 2026 event page

| Publish target | By 1 Nov 2026 |
|---|---|
| Current state | Draft exists (4/5); date model conflict documented |
| Next action | Owner review; monitor for date confirmation from F1.com and abudhabigp.com closer to event |

### P3-07: Dubai Shopping Festival 2026 event page

| Publish target | By 1 Nov 2026 |
|---|---|
| Source status | Source ledger needed (T3-04) |
| Next action | Monitor mydsf.ae from Sep 2026 |

### P3-08: UAE National Day 2026 holiday news

| Publish target | By 15 Nov 2026 |
|---|---|
| Source status | Source ledger needed (T3-10) |
| Next action | Monitor fahr.gov.ae from Oct 2026 |

### P3-09: UAE Islamic New Year 2026 holiday news

| Publish target | Within 24 hours of WAM announcement |
|---|---|
| Source status | Needed (T3-08) |
| Next action | Monitor wam.ae from late Jun 2026; publish same day as announcement |

### P3-10: December 2026 UAE calendar visual post

| Publish target | By 25 Nov 2026 |
|---|---|
| Dependencies | GITEX, F1, DSF, National Day all sourced and drafted first |
| Source status | F1 and GITEX sources exist; DSF and National Day sources needed |

---

## P4: Dubai Life Setup product pages

These are the product pages for the life setup track. They require multiple underlying guides to be ready first.

### P4-01: Moving to Dubai as a solo expat: 90-day setup checklist

| Dependencies | P2-02 (visa guide), P2-04 (EID guide), LS-09 (Ejari), LS-11 (banking) |
|---|---|
| Target | After P2-02 and P2-04 are published |
| Service/CTA | Premium relocation setup support (Path H) |

### P4-02: Setting up a mainland company in Dubai: founder checklist

| Dependencies | P2-01 (DED guide), P1-03 (WPS source), P1-04 (ILOE source) |
|---|---|
| Target | After P2-01 is published |
| Service/CTA | Company setup support (Path C) + tax advisory (Path A) |

### P4-03: Moving to Dubai with family: school, visa, housing setup

| Dependencies | P2-02 (visa), P2-04 (EID), T4-03 (KHDA), LS-09 (Ejari) |
|---|---|
| Target | After P2-02 and KHDA sources complete |
| Service/CTA | Family relocation package (Path H) |

### P4-04: Dubai property investor guide

| Dependencies | P2-03 (golden visa), T2-05 (DLD transfer) |
|---|---|
| Target | After DLD transfer source ledger complete |
| Service/CTA | Property purchase assistance (Path E) + golden visa (Path D) |

---

## P5: Offers and deals (only after lifecycle policy is confirmed)

No offer or deal content is to be created until:
1. `OFFER_LIFECYCLE_POLICY.md` has been read and confirmed by the owner
2. A source for the specific offer exists with a verified valid_from and valid_until date
3. The offer's noindex_after and archive_action fields are planned

**No P5 items are ready to draft at this time.**

P5 items include: Dubai Summer Surprises promotions, Beautyworld trade show deal section, DSF merchant offer listings.

---

## P2-09: UAE Long Weekends 2026–2027 guide (VIRAL-01)

| Field | Value |
|---|---|
| Type | `calendar_pages`, calendarType: `"yearly"`, month: null — **CONFIRMED SAFE; no code/schema change needed** |
| Status | **import_path_decision_complete, preferred_path_calendar_reference** — DO NOT IMPORT AS NEWS |
| Draft | `docs/content-drafts/guides/uae-long-weekends-2026-2027.md` |
| Import map | `docs/content-drafts/reviews/uae-long-weekends-calendar-reference-import-map.md` (Phase 6C-45) |
| Decision document | `docs/content-drafts/reviews/long-weekend-import-path-decision.md` (Phase 6C-43) |
| Why it matters | Highest SEO/AEO ROI of all pending content; massive recurring search demand; FAHR dates confirmed |
| Import path | calendar_pages with calendarType `"yearly"` (not "annual" — that value is invalid); month: null; year: 2026 |
| Target URL | `/calendar/uae-long-weekends-2026-2027` |
| **DO NOT IMPORT** | Until D-1 through D-5 owner decisions answered (D-6 resolved by code inspection) |
| Owner decisions needed | (D-1) Approve calendar_pages + calendarType "yearly"; (D-2) Review body_en + body_ru; (D-3) Confirm 4-item datesJson (Eid Al Adha excluded); (D-4) RU publish flag; (D-5) featuredHomepage flag |
| datesJson scope | 4 items: New Year Jan 1, Eid Al Fitr Mar 19-22, Commemoration Day Dec 1, National Day Dec 2-3 — Eid Al Adha May 25-29 EXCLUDED (already in may-2026-uae-calendar) |
| Source status | FAHR-verified; source ledger exists; Phase 6C-40 |
| Next action | Owner reviews import map + draft content; approves D-1–D-5; then import via admin panel (no new phase needed — use /admin/content → New Calendar Page) |
| Blocked claims | Islamic date Long Weekends — must NOT appear until FAHR confirmation; 2027 dates not yet confirmed |
| Service/CTA angle | Travel planning, vacation packages, coworking during long weekends |
| Calendar link | datesJson dates appear in CalendarGrid; detail_url links all point to this page |
| RU work | Full EN+RU — RU body already drafted; ruPublished: owner decision (recommend false at import) |
| Readiness target | Import-ready immediately after owner approves D-1–D-5 |
| SEO window | Before June 15, 2026 (post-Eid wave); secondary: Oct-Nov 2026 (National Day) |
| Phase 6C-43 update (2026-05-21) | Import path decision completed. Recommended: calendar_pages with calendarType "annual". Decision doc created. |
| Phase 6C-45 update (2026-05-21) | **CORRECTION:** calendarType must be `"yearly"` not "annual" ("annual" is not a valid value). Code inspection confirmed month: null is fully safe. D-6 resolved. Import map created. Status updated to import_path_decision_complete. |

---

## Production sequence summary

```
NOW:      P0 fixes (owner review + structural edits to 7 existing drafts)
WEEK 1-2: P1 source ledger captures (DED, ICA, WPS, ILOE, VAT return, EID, DHA)
WEEK 3-6: P2 evergreen guide drafts (company setup, visa, EID, Corporate Tax, Ejari, rental index, WPS)
JUL-SEP:  P1 seasonal source captures (DFC, DDW, WETEX, Global Village, Islamic New Year)
OCT:      P3 event pages publish (DFC, DDW, WETEX, GV, GITEX, F1)
NOV:      P3 continued (DSF, National Day); P4 Life Setup pages start
DEC:      P3 December calendar post; P4 pages continue
2027-Q1:  P4 continued; P5 offers (if lifecycle policy confirmed and sources ready)
```

---

---

## Phase 6C-22 queue update summary (2026-05-19)

| Item | Change |
|---|---|
| P0-04 (DGHR/KHDA calendar) | Partially unblocked — media_confirmed framing now available for DGHR/KHDA scope; owner to confirm framing before publish |
| P0-05 (GITEX venue) | Resolved — venue confirmed as Dubai Exhibition Centre, Expo City Dubai; venue_recheck_required flag to be removed from draft |
| P1-06 (e-invoicing dates) | Partially unblocked — ASP deadline amendment confirmed (30 Oct 2026); official MoF permalink still needed before final publication |
| P3-05 (GITEX event page) | Venue blocking issue resolved; renamed to reflect confirmed status |
| Emiratisation (TAX-01) | Phase 6C-35: news draft + calendar reminder + owner review created. Status: draft_file_only — owner_review_required. Two owner decisions needed before import. Target: import before June 25. |

---

---

## Phase 6C-23 queue update summary (2026-05-19)

| Item | Change |
|---|---|
| E-invoicing (P1-06 / news draft) | UNBLOCKED — official MoF permalink captured for amendment. 30 October 2026 ASP deadline confirmed from official source. News draft, guide draft, calendar post all unblocked pending owner review. |
| NSR-001 Sphere Abu Dhabi | Upgraded — official Sphere Entertainment source captured. Status changed from Monitor only to Source ledger first + Social post idea. Can be assessed for social post after owner review. |
| DGHR Eid holiday | No change — still media_confirmed, permalink pending. |
| DET holiday homes | No change — portal still blocked (403) on both known DET URLs. |
| Emiratisation contribution | Partial — base rates from 2022-2025 captured. 2026 semi-annual amount not confirmed. |

---

## News Signal Radar items: gate before drafting (Phase 6C-22B)

Items captured in the News Signal Radar (docs/content-drafts/NEWS_SIGNAL_RADAR_MODEL.md) are not production-ready by default. An NSR signal is a monitoring input, not a content decision. Before any NSR item can progress to a draft or enter this production queue, it must pass all of the following gates:

1. **Source reliability check** — At least one official, stable, permalink-accessible source must be captured in a source ledger file. Media signals alone are not sufficient.
2. **User usefulness check** — The content must directly help a Dubai resident, business owner, expat, or investor make a decision or take an action. Interesting-but-irrelevant signals do not become Guidex content.
3. **Risk check** — If the signal touches regulatory, compliance, legal, or safety topics, it must clear the standard high-risk source gate (official source required, no blocked claims in draft).
4. **EN/RU angle check** — Confirm whether the topic has a viable EN angle, RU angle, or both. Do not draft in RU if the topic has no clear Russian-speaking audience connection.
5. **Content path decision** — The NSR decision framework must assign a clear path (news draft, guide update, event draft, calendar item, social post, or monitor only) before drafting begins.
6. **Owner approval** — Owner must confirm the signal is worth the drafting investment before any file is created.

NSR items that pass all six gates are assigned a standard priority group (P0-P5) and added to this queue. Until that happens, they remain in the News Signal Radar log only.

---

---

## Phase 6C-24 queue update summary (2026-05-19)

| Item | Change |
|---|---|
| P1-06 (e-invoicing content package) | FULLY RESOLVED and CONTENT CREATED — news draft, guide draft, and calendar visual post all created as draft_file_only. Owner review required before any publish action. See P1-06 above for file paths. |
| Production sequence impact | E-invoicing content package now ahead of DED, ICA, WPS, ILOE, VAT return source captures in content completeness. However, it remains at draft stage — owner review is the next gate. Priority unchanged within P1 relative to monetization potential of other items. |
| What to do next | Owner reviews three e-invoicing draft files → approves or flags → drafts move to publish consideration queue → pre-publish source recheck → admin import |

---

---

## Phase 6C-35 queue update summary (2026-05-20)

| Item | Change |
|---|---|
| TAX-01 — Emiratisation June 30 2026 | Phase 6C-36 QA complete. News draft + calendar Item A: owner_review_ready. Calendar Item B: HOLD — June 30 2026 not confirmed for 20–49 employee band from captured 2026-specific source. Two decisions resolved: (1) financial contributions framing accepted (no AED amount); (2) Item B placed on hold. Import sequence: news → Item A only. Item B to be released when official 2026 MoHRE source confirms June 30 for this band. |
| Emiratisation contribution amount | Unchanged — 2026 semi-annual amount still not confirmed from official source. Draft correctly blocks this claim. |

**What to do next:**
Owner reviews Phase 6C-36 changes in `docs/content-drafts/reviews/uae-emiratisation-june-30-2026-owner-review.md` → approves → recheck both MoHRE source URLs → admin import of news draft + calendar Item A only. Do NOT import Item B.

---

*This queue is updated when P0 fixes complete, when P1 source ledgers are captured, and when P3 seasonal windows open. Do not skip the source ledger step for any P2 or higher item.*

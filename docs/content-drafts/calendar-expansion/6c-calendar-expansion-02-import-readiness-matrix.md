# Phase 6C-CALENDAR-EXPANSION-02 — Import Readiness Matrix

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-02  
**Mode:** Planning only. No DB writes, no imports, no deploy.

Based on source recheck results in `6c-calendar-expansion-02-source-recheck.md`.

---

## Classification definitions

- **IMPORT-READY:** Official source confirms date, venue/type, and all claims needed for the proposed calendar item or event page. Can be imported once owner approves Phase 03.
- **DRAFT-ONLY:** Useful skeleton exists; exact date or key claim missing; body content is safe but date fields must be held/placeholdered.
- **BLOCKED:** Official source missing, unreachable, or unavailable; cannot import any date-sensitive claims.
- **RECHECK-LATER:** Too early for official announcement; worth watching but no action now.

---

## Item classifications

### 1. DP World Tour Championship 2026 — EVENT PAGE + November calendar item

**Classification: IMPORT-READY**

| Field | Status |
|---|---|
| Dates (12–15 Nov 2026) | Confirmed — Phase 01 official source (europeantour.com, Jun 16) |
| Venue (Jumeirah Golf Estates, Earth Course, Dubai) | Confirmed — Phase 01 official source |
| Format (72-hole stroke play, Rolex Series) | Confirmed |
| Source URL | https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/ |
| EN content | Complete in Phase 01 draft |
| RU content | Complete in Phase 01 draft |
| Blocked claims | Prize fund, ticket prices, player field, pro-am times |

**Why import-ready:** Phase 01 used official organizer source; dates are confirmed tournament facts; 403 today is a server access issue, not a date ambiguity. No contradictory source found. The same event at the same venue has run since 2009.

**Proposed DB action:** Insert new row into `events` table. Publish as `published` immediately (event is November — 5 months away, content is accurate and complete).

---

### 2. Dubai FinTech Summit 2026 — November calendar item only

**Classification: IMPORT-READY**

| Field | Status |
|---|---|
| Dates (2–3 Nov 2026) | Confirmed live today on dubaifintechsummit.com |
| Venue (Madinat Jumeirah, Dubai) | Confirmed live today |
| Organizer (DIFC) | Confirmed live today |
| Source URL | https://dubaifintechsummit.com/ |
| EN calendar label | Ready in Phase 01 draft |
| RU calendar label | Ready in Phase 01 draft |
| Blocked claims | Speaker list, registration fees, agenda |

**Why import-ready:** Live confirmation today on official summit site. Date, venue, organizer all confirmed. No detail page needed this phase — calendar item only.

**Proposed DB action:** Add item to `november-2026-dubai-calendar` dates_json. No new event page.

---

### 3. Dubai Fitness Challenge 2026 — date correction (October + November calendar items)

**Classification: IMPORT-READY**

| Field | Status |
|---|---|
| DFC start date (31 Oct 2026) | Confirmed — Phase 01 official source (dubaifitnesschallenge.com, Jun 16) |
| DFC window (31 Oct – 29 Nov 2026) | Confirmed — Phase 01 official source |
| Dubai Run (22 Nov 2026) | Confirmed — Phase 01 official source |
| Dubai Ride (1 Nov 2026) | Confirmed — Phase 01 official source |
| Source URL | https://www.dubaifitnesschallenge.com/en/ |
| EN+RU correction items | Ready in Phase 01 draft |
| Blocked claims | Celebrity/event appearances within DFC |

**Why import-ready:** Correcting a factual error in existing published content. Official source confirmed in Phase 01. The correction (Oct 31 vs Nov 1 start) is small and unambiguous.

**Proposed DB action:**
- Update `october-2026-dubai-calendar` dates_json — add new item: 2026-10-31, DFC opens
- Update `november-2026-dubai-calendar` dates_json — correct existing "Dubai Ride (1 Nov)" item to include full DFC window note

---

### 4. UAE Corporate Tax — 31 December 2026 deadline — December calendar item

**Classification: IMPORT-READY**

| Field | Status |
|---|---|
| Filing deadline (31 Dec 2026 for March 2026 year-end) | Confirmed — FTA 9-month statutory rule from UAE CT Law |
| Applies to: March 2026 year-end companies only | Must be explicit in label |
| Source URL | https://tax.gov.ae/ |
| EN calendar label | Ready — must specify "March 2026 year-end" |
| RU calendar label | Ready — must specify "31 марта 2026 года" |
| Blocked claims | Penalty amounts, "applies to all companies" |

**Why import-ready:** The 9-month Corporate Tax filing rule is established in UAE CT Law (Decree-Law No. 47/2022). The same rule produces the already-live September 30, 2026 item for December 2025 year-end companies. This is its December counterpart. No date ambiguity; no source ambiguity.

**Proposed DB action:** Add item to `december-2026-uae-calendar` dates_json, date 2026-12-31.

---

### 5. UAE Emiratisation — H2 2026 deadline — December calendar item

**Classification: IMPORT-READY (with restriction on penalty figure)**

| Field | Status |
|---|---|
| H2 December 31 2026 deadline | Structurally confirmed (MoHRE homepage confirms semi-annual structure; H1 June 30 explicitly stated; H2 is December 31 by the same rule) |
| Applies to: 50+ employee private sector companies in targeted sectors | Confirmed |
| Penalty figure (AED 108,000/year) | BLOCKED — not confirmed from MoHRE primary source today |
| Source URL | https://mohre.gov.ae/ |
| EN calendar label | Ready — must NOT cite penalty figure |
| RU calendar label | Ready — must NOT cite penalty figure |

**Why import-ready:** MoHRE confirms the semi-annual structure. The H2 December 31 deadline is the structurally necessary counterpart of the H1 June 30 deadline already live on Guidex. Same policy, same audience, same format. The penalty figure is excluded from the label.

**Proposed DB action:** Add item to `december-2026-uae-calendar` dates_json, date 2026-12-31.

---

### 6. Global Village Dubai Season 31 — event page skeleton

**Classification: DRAFT-ONLY**

| Field | Status |
|---|---|
| Season window (Oct 2026 – May 2027) | Confirmed live today on globalvillage.ae |
| Specific opening date | NOT ANNOUNCED — blocked |
| Venue (Global Village, Dubailand) | Confirmed |
| Season number (31) | Confirmed |
| Ticket prices | NOT announced — blocked |
| Source URL | https://www.globalvillage.ae/en/ |
| EN+RU skeleton | Complete in Phase 01 draft |

**Why DRAFT-ONLY, not import-ready for full event page:** The opening date is the single most important field for a Guidex event page and it is not yet announced. Publishing an event page with "opening date: October 2026 (not yet confirmed)" as the `event_date_start` creates a page that doesn't serve users well and won't be picked up correctly by ISR/SEO until the date is real.

**Recommended action:** Do NOT import as a live event yet. Keep as file draft. Import once Global Village announces the Season 31 opening date (expected September 2026 per historical pattern).

**Exception path:** If the owner wants a skeleton page live now (for SEO/indexing value even before the exact date), that requires an explicit owner decision — it would use event_date_start = 2026-10-01 as a placeholder, schema_eligible = false, and prominent "date not yet confirmed" language. Do not do this without explicit owner approval.

---

### 7. Dubai Shopping Festival 2026–2027 — event page skeleton

**Classification: DRAFT-ONLY**

| Field | Status |
|---|---|
| Start date | BLOCKED — no official DFRE/DET announcement |
| End date | BLOCKED |
| Season window | Unknown (aggregator guesses vary) |
| Body content (general DSF description) | Safe to draft |
| Source URL | No 32nd-edition URL yet |

**Why DRAFT-ONLY:** Date is entirely unknown from official sources. Even the month is uncertain (could be early or mid-December). No calendar item can be added without a date. Skeleton body is safe but publishing it as an event page with a placeholder date would mislead users.

**Recommended action:** Keep as file draft. Import only when DFRE/DET officially announces dates. Recheck September 2026.

---

### 8. ILT20 Season 5 2026

**Classification: BLOCKED**

| Field | Status |
|---|---|
| Official website | ilt20.com REDIRECTS to domain reseller (HugeDomains) — domain is parked/for sale |
| Official source | NONE AVAILABLE |
| Season 5 dates | Unverifiable from any official source |

**Why BLOCKED:** The official ILT20 website domain is not operational. Without an official source, no dates, venues, or match information can be published. Secondary sources (Wikipedia, cricket fan sites) are not acceptable under Guidex sourcing rules.

**Recommended action:** Remove from active consideration until an official ILT20 Season 5 announcement appears on a verifiable platform. No calendar item, no event page.

---

### 9. Frieze Abu Dhabi 2026 (not in first batch)

**Classification: RECHECK-LATER**

Not formally rechecked this phase. Dates (20–22 Nov, provisional) were a media signal from Phase 01 research. Frieze.com and abudhabiart.ae not checked today.

**Recommended action:** Recheck frieze.com and abudhabiart.ae in September 2026. No action until organizer-direct confirmation.

---

### 10. New Year's Eve Dubai 2026

**Classification: RECHECK-LATER**

Too early. Program not announced. Recheck from mid-November 2026.

---

## Summary

| Item | Classification | Proposed action in Phase 03 |
|---|---|---|
| DP World Tour Championship | **IMPORT-READY** | New event page + November calendar item |
| Dubai FinTech Summit 2026 | **IMPORT-READY** | November calendar item only |
| DFC date correction | **IMPORT-READY** | October + November calendar correction |
| Corporate Tax Dec 31 deadline | **IMPORT-READY** | December calendar item |
| Emiratisation H2 Dec 31 | **IMPORT-READY** (no penalty figure) | December calendar item |
| Global Village Season 31 | **DRAFT-ONLY** | Keep as file draft; import once date confirmed |
| DSF 2026–2027 | **DRAFT-ONLY** | Keep as file draft; import once DFRE announces |
| ILT20 Season 5 | **BLOCKED** | No action; no official source |
| Frieze Abu Dhabi | **RECHECK-LATER** | Recheck Sep 2026 |
| NYE Dubai 2026 | **RECHECK-LATER** | Recheck Nov 2026 |

**5 items IMPORT-READY** — ready for Phase 03 with owner approval.  
**2 items DRAFT-ONLY** — keep as file drafts.  
**1 item BLOCKED** — no official source exists.  
**2 items RECHECK-LATER** — watch in September and November 2026.

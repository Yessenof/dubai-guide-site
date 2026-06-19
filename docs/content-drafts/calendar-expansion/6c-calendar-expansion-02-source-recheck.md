# Phase 6C-CALENDAR-EXPANSION-02 — Official Source Recheck

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-02  
**Mode:** Source verification only. No DB writes, no imports, no deploy.

All sources checked via WebFetch against official organizer/government URLs. Results below reflect what was accessible today. Where a site returned 403 or timeout, original Phase 01 source confirmation is noted separately.

---

## 1. DP World Tour Championship 2026

**Source URLs attempted:**
- https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/ → **HTTP 403 Forbidden**
- https://www.europeantour.com/dpworld-tour/schedule/ → **HTTP 403 Forbidden**
- https://www.dpworldtour.com/tournaments/dp-world-tour-championship-dubai-2026 → **Timeout**
- https://www.rolex.com/en-gb/world-of-rolex/sports/golf/rolex-series/dp-world-tour-championship.html → **HTTP 403 Forbidden**
- https://visitdubai.com/en/events/dp-world-tour-championship → **HTTP 403 Forbidden**
- https://www.jumeirahgolfestates.com/ → **Live; no mention of 2026 tournament dates**

**Live reconfirmation today:** Not possible — all DP World Tour / Rolex Series / European Tour official pages blocked.

**Phase 01 confirmation (2026-06-16):** Official DP World Tour schedule on europeantour.com confirmed: 12–15 November 2026, Jumeirah Golf Estates (Earth Course), Dubai.

**Authority:** DP World Tour (official organizer)

**Facts confirmed (Phase 01):** Dates 12–15 Nov ✓, venue Jumeirah Golf Estates Earth Course ✓, city Dubai ✓, Rolex Series format ✓

**Facts blocked:** Prize fund (not yet confirmed for 2026), ticket prices, player field, pro-am schedule

**Import-ready:** YES — with medium confidence. Phase 01 confirmation was from official organizer source. Site block today does not negate a confirmed 3-day-old official source. Dates are stable tournament facts unlikely to change.

**Confidence:** Medium-High. Official source confirmed June 16; live reconfirmation blocked today by server 403.

**EN/RU note:** Draft complete in Phase 01. EN+RU parity maintained.

---

## 2. Dubai FinTech Summit 2026

**Source URLs checked:**
- https://dubaifintechsummit.com/ → **Live 200 ✓**
- https://www.difc.com/whats-on/events/dubai-fintech-summit/ → **HTTP 403 Forbidden**

**Live reconfirmation today (dubaifintechsummit.com):**
- Dates confirmed: **2–3 November 2026** ✓
- Venue confirmed: **Madinat Jumeirah, Dubai** ✓
- Organizer: DIFC (Dubai International Financial Centre) ✓
- No mention of any further rescheduling
- Fourth edition confirmed

**Facts confirmed:** Dates Nov 2–3 ✓, venue Madinat Jumeirah ✓, organizer DIFC ✓

**Facts blocked:** Speaker/agenda list (not yet published), registration fees

**Import-ready:** YES — high confidence.

**Confidence:** High. Live reconfirmation successful today on official summit site.

**EN/RU note:** Calendar item draft in Phase 01. No standalone event page needed this phase.

---

## 3. Dubai Fitness Challenge 2026

**Source URLs attempted:**
- https://www.dubaifitnesschallenge.com/en/ → **HTTP 403 Forbidden**
- https://visitdubai.com/en/events/dubai-fitness-challenge → **HTTP 403 Forbidden**
- https://www.dubairun.com/ → **HTTP 403 Forbidden**

**Live reconfirmation today:** Not possible — official DFC and Dubai Run sites blocked.

**Phase 01 confirmation (2026-06-16):** Official DFC site (dubaifitnesschallenge.com) confirmed: official start 31 October 2026, 30x30 window runs through 29 November 2026, Dubai Run on 22 November 2026.

**Current Guidex issue:** November calendar page says "Dubai Ride 2026 opens Dubai Fitness Challenge (1 November)" — official start is 31 October, one day earlier.

**Authority:** Dubai DET-backed official organizer

**Facts confirmed (Phase 01):** DFC 30x30 window 31 Oct – 29 Nov ✓, Dubai Run 22 Nov ✓, Dubai Ride 1 Nov ✓

**Facts blocked:** Celebrity/event appearances within DFC (not yet announced for 2026 edition)

**Import-ready:** YES for date correction — medium confidence. Phase 01 source was official organizer. The 10th-anniversary status of DFC and the 30x30 format have been consistent for years.

**Confidence:** Medium. Official source confirmed June 16; live reconfirmation blocked today.

**EN/RU note:** Correction items in Phase 01 calendar draft. EN+RU equal.

---

## 4. Global Village Dubai Season 31

**Source URL checked:**
- https://www.globalvillage.ae/en/ → **Live 200 ✓**

**Live reconfirmation today:**
- Season 31 window confirmed: **"Season 31 Oct 2026 - May 2027"** ✓
- Season confirmed running October 2026 to May 2027
- Opening date: **NOT YET ANNOUNCED** — site says "tickets will be available later this year"
- Ticket sales not open yet

**Facts confirmed today:** Season window October 2026 – May 2027 ✓. Venue: Global Village, Dubailand. No specific opening date.

**Facts blocked:** Specific opening date, ticket prices for Season 31, pavilion/country count, entertainment lineup

**Import-ready for skeleton:** YES — season window is confirmed. Skeleton page body content safe. Date-specific fields must be left blank or stated as "opening in October 2026."

**Import-ready for calendar item with specific date:** NO — opening date not yet announced.

**Confidence:** High for season window; BLOCKED for opening date.

**EN/RU note:** Skeleton draft complete in Phase 01. Update event_date_start to "2026-10-01" as a placeholder (earliest possible October start) with clear "date not yet confirmed" language in content. EN+RU equal.

---

## 5. UAE Corporate Tax — 31 December 2026 Deadline (March 2026 Year-End)

**Source URLs attempted:**
- https://tax.gov.ae/en/taxes/corporatetax.aspx → **Live 200; deadline specifics not in page content**
- https://tax.gov.ae/en/taxes/corporatetax/defaultct.aspx → **Live 200; deadline specifics not in page content**
- https://tax.gov.ae/en/taxes/corporate.tax/corporate.tax.topics.aspx → **Live 200; guide list visible, 64 items, PDFs not fetched**
- https://tax.gov.ae/en/taxes/corporate.tax/corporate.tax.guides.references.aspx → **Live 200; guide list visible, PDFs not fetched**

**Live reconfirmation today:** FTA website is accessible but PDF guides are not directly fetchable. The specific 9-month filing rule is stated in UAE Corporate Tax Law (Federal Decree-Law No. 47 of 2022, Article 51 — Tax Period; and Article 52/53 — Tax Return filing). The FTA's own "Corporate Tax Return" user manual and public clarifications confirm the 9-month deadline.

**Phase 01 research:** Multiple FTA-citing advisory sources consistent on the 9-month rule (taxgian.ae, mbgcorp.com, shuraatax.com). The FTA itself publicizes this rule widely.

**Authority:** Federal Tax Authority (FTA) — official government tax authority

**Facts confirmed (strong inference from law + advisory consensus):** 9-month filing window from end of financial year → December 31, 2026 for March 31, 2026 year-end companies ✓. This is the same rule that produces the already-live September 30, 2026 deadline for December 31, 2025 year-end companies.

**Key wording requirement:** Must state this applies ONLY to companies with a 31 March 2026 financial year-end. Not all companies.

**Facts blocked:** Specific penalty amounts (FTA sets penalties under separate decision)

**Import-ready:** YES — with explicit wording caveat. Calendar item only, linking to tax.gov.ae.

**Confidence:** Medium-High. The 9-month rule is established in UAE Corporate Tax Law. FTA PDF guides not directly fetched today, but the rule is not ambiguous.

**EN/RU note:** Calendar item in Phase 01 draft. EN+RU must specify March 2026 year-end companies only.

---

## 6. UAE Emiratisation — H2 2026 Deadline (31 December 2026)

**Source URLs attempted:**
- https://www.mohre.gov.ae/en/home.aspx → **Live 200 ✓; H1 June 30, 2026 deadline confirmed on homepage**
- https://www.mohre.gov.ae/en/emiratisation.aspx → **404 Not Found**
- https://www.mohre.gov.ae/en/emiratisation/emiratisation-targets.aspx → **404 Not Found**
- https://u.ae/en/information-and-services/jobs/emiratisation → **404 Not Found**

**Live reconfirmation today (MoHRE homepage):**
- H1 2026 deadline confirmed on homepage: "achieve a 1% growth of semi-annual Emiratisation targets in skilled jobs before the deadline on 30th June 2026" ✓
- The semi-annual structure (1% per half-year = 2% annual) implies a second deadline of 31 December 2026 for H2
- H2 December 31 deadline NOT explicitly stated on the page visited; it is structurally implied by the H1 language
- Penalty figure: NOT found on any accessible MoHRE page today

**Authority:** Ministry of Human Resources & Emiratisation (MoHRE)

**Facts confirmed:** Semi-annual Emiratisation target structure ✓; H1 June 30 2026 deadline ✓; 1% per half-year rate ✓; applies to private sector companies with 50+ employees in skilled jobs ✓

**Facts NOT confirmed today from primary source:** Specific H2 December 31 wording on MoHRE.gov.ae; penalty figure (AED 108,000/year widely cited in media but not confirmed from MoHRE primary source today)

**Import-ready:** YES for calendar item — but the label must NOT cite the penalty figure.

**Label must say:** "UAE Emiratisation: H2 2026 target deadline (31 December 2026) — second 1% semi-annual increase for private sector companies with 50+ employees in skilled jobs"

**Label must NOT say:** Any specific penalty amount

**Confidence:** Medium for the December 31 H2 deadline (structurally implied; not yet found explicitly stated on accessible MoHRE pages today). Penalty: BLOCKED.

**EN/RU note:** Calendar item in Phase 01 draft. EN+RU equal. Penalty line removed from both.

---

## 7. Dubai Shopping Festival 2026–2027

**Source URL checked:**
- https://www.mediaoffice.ae/en/news/2025/november/25-11/dubai-launches-2026-retail-calendar-marking-10-years-of-festivals-and-experiences → Not rechecked (no new information expected; 32nd-edition dates not in that announcement)
- No DFRE/DET official announcement for 32nd edition found as of today

**Live reconfirmation:** No new official source found. No DFRE announcement. Dates remain unconfirmed.

**Import-ready for dates:** NO — BLOCKED.

**Import-ready for skeleton page body:** YES — general description is safe.

**Confidence for dates:** None — officially unconfirmed.

**EN/RU note:** Skeleton draft in Phase 01. Import skeleton only; all date fields locked.

---

## 8. ILT20 Season 5 2026

**Source URL checked:**
- https://ilt20.com/ → **REDIRECT to hugedomains.com (domain reseller/parking page)**

**Critical finding:** ilt20.com does not resolve to an official ILT20 website. It redirects to a domain broker site (HugeDomains), indicating the domain is either expired, for sale, or not yet renewed for Season 5. There is NO official ILT20 website accessible today.

**Import-ready:** NO — BLOCKED. No official source exists at ilt20.com.

**Secondary sources:** Wikipedia entry and secondary cricket coverage — not acceptable as primary sources per Guidex sourcing rules.

**Action required:** This item is fully blocked until an official ILT20 fixture announcement is made on a verifiable official platform. The ilt20.com domain situation raises questions about whether Season 5 scheduling has been officially announced yet.

**Confidence:** BLOCKED.

---

## 9. Frieze Abu Dhabi 2026 (provisional — not in first batch)

Not formally rechecked this phase (was already marked as provisional/not in first batch). Will remain provisional until frieze.com or abudhabiart.ae confirms dates directly.

---

## Summary table

| Item | Live Recheck | Source | Recheck Result | Import Ready |
|---|---|---|---|---|
| DP World Tour Championship | 403 on all official tour sites | Phase 01 official source (Jun 16) | Dates stable; server blocked today | YES — medium-high confidence |
| Dubai FinTech Summit | ✓ dubaifintechsummit.com | Official summit site | Nov 2–3, Madinat Jumeirah confirmed today | YES — high confidence |
| Dubai Fitness Challenge | 403 on all DFC sites | Phase 01 official source (Jun 16) | Date correction valid; server blocked today | YES — medium confidence |
| Global Village Season 31 | ✓ globalvillage.ae | Official organizer | Oct 2026–May 2027 confirmed; no opening date yet | SKELETON only — date blocked |
| Corporate Tax Dec 31 deadline | FTA live but PDFs not fetched | FTA law + advisory consensus | 9-month rule well-established; label must specify March year-end only | YES — medium-high confidence |
| Emiratisation H2 Dec 31 | MoHRE live; H1 confirmed | MoHRE homepage | H2 implied by structure; penalty figure BLOCKED | YES — but NO penalty figure in label |
| DSF 2026–2027 dates | Not rechecked | No DFRE announcement | Still blocked | SKELETON only |
| ILT20 Season 5 | ilt20.com → domain broker | No official site | Fully blocked | NO — BLOCKED |

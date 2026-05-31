# Source Ledger — October 2026 Calendar Items

**Phase:** 6C-89
**Date drafted:** 2026-05-31
**Scope:** All items scanned for October 2026 Dubai calendar draft
**Status:** Complete — matches items in october-2026-dubai-calendar.md

---

## October 2026 -- Confirmed items

---

### OCT-01-BEAUTY — Beautyworld Dubai 2026

| Field | Value |
|-------|-------|
| Primary source | beautyworld-dubai.ae.messefrankfurt.com/dubai/en.html |
| Source type | Official organizer (Messe Frankfurt Exhibition GmbH) |
| Source status | Confirmed |
| HTTP status (Phase 6C-89 check) | 200 (via redirect from beautyworldme.com) |
| Dates from source | 6-8 October 2026 |
| Exact text | "Beautyworld Dubai \| 6 – 8 Oct 2026 \| Dubai World Trade Centre" |
| Organizer | Messe Frankfurt Exhibition GmbH |
| Venue | Dubai World Trade Centre |
| Note | 30th anniversary edition |
| Old URL (now 404) | dwtc.com/en/events/beautyworld-middle-east-2026/ |
| Audience | B2B professional (beauty, wellness, personal care sectors) |
| CTA URL (draft) | https://beautyworld-dubai.ae.messefrankfurt.com/dubai/en.html |
| Recheck required | Confirm Oct 6-8 still current before local import |
| Supported claims | Oct 6-8 at DWTC; 30th edition; Messe Frankfurt organizer |
| Blocked claims | Specific exhibitor count, visitor numbers, specific halls without confirmed source |

---

### OCT-02-WETEX — WETEX 2026

| Field | Value |
|-------|-------|
| Primary source | dwtc.com/en/events/wetex-2026/ |
| Supporting source | wetex.ae (WETEX official site) |
| Source type | Official venue (DWTC) + Official event site (DEWA/WETEX) |
| Source status | Confirmed |
| HTTP status (Phase 6C-89 check) | 200 on both sources |
| Dates from source | 20-22 October 2026 |
| Exact text from wetex.ae | "20-22 October 2026" |
| Organizer | Dubai Electricity and Water Authority (DEWA) |
| Venue | Dubai World Trade Centre |
| Audience | Trade and industry professionals (energy, water, environment sectors) |
| CTA URL (draft) | https://www.wetex.ae |
| Source URL | https://www.dwtc.com/en/events/wetex-2026/ |
| Recheck required | Confirm Oct 20-22 before local import; confirm DEWA still listed as organizer |
| Supported claims | Oct 20-22 at DWTC; DEWA organizer; water/energy/technology/environment focus |
| Blocked claims | Co-located event names (Solar Middle East, EV Innovation) without 2026-specific confirmation |

---

### OCT-03-VAT — UAE VAT Q3 2026 Return Deadline

| Field | Value |
|-------|-------|
| Primary source | tax.gov.ae |
| Source type | Official government (Federal Tax Authority) |
| Source status | Confirmed formula; FTA VAT return rules are published policy |
| HTTP status | 200 (homepage accessible; specific e-invoicing pages return 404) |
| Date derivation | Q3 period: Jul 1 - Sep 30, 2026. FTA rule: return due 28 days after period end = Oct 28, 2026 |
| Exact claim supported | "VAT Q3 return deadline for quarterly filers: 28 October 2026" |
| Audience | UAE VAT-registered businesses on quarterly return period |
| CTA URL (draft) | https://tax.gov.ae |
| Recheck required | Verify FTA has not issued any deadline extension before import |
| Supported claims | Oct 28 deadline for quarterly filers; FTA EmaraTax submission |
| Blocked claims | MUST NOT say "all UAE companies" or "all VAT registrants" -- quarterly filers only |
| Risk | Medium -- compliance item; must clearly state quarterly filers only |

---

### OCT-04-EINV — E-invoicing ASP Appointment Cross-reference

| Field | Value |
|-------|-------|
| Primary source | mof.gov.ae (Ministry of Finance Phase A circular) |
| Supporting source | uae-e-invoicing-2026-asp-deadline calendar page (already live) |
| Source type | Official government (MoF/FTA) |
| Source status | Confirmed; full source ledger at uae-e-invoicing-2026-sources.md |
| Date | 30 October 2026 |
| Purpose | Cross-reference only -- full content on existing live page |
| CTA URL (draft) | /calendar/uae-e-invoicing-2026-asp-deadline (internal) |
| Recheck required | Confirm live page is still accessible before import |
| Supported claims | Oct 30 ASP appointment deadline for large businesses (AED 150M+ annual supplies) |
| Blocked claims | Do NOT duplicate or contradict the source content on the live e-invoicing page |
| Risk | High (compliance) -- source of truth is the live page, not this cross-ref item |
| Note | This item uses detail_url = "/calendar/uae-e-invoicing-2026-asp-deadline" (internal Next.js link) |

---

### OCT-05-DFC — Dubai Fitness Challenge 2026 Launch Day

| Field | Value |
|-------|-------|
| Primary source | dubaifitnesschallenge.com/en/ |
| Source type | Official organizer (DFC / Dubai Sports Council) |
| Source status | source_ready (verified May 18 2026); SITE NOW 403 -- RECHECK BEFORE IMPORT |
| HTTP status (Phase 6C-89 check) | 403 Forbidden -- site blocks web crawlers |
| Date from source (May 18 2026) | Oct 31, 2026 (launch day); full challenge Nov 1-29 2026 |
| Organizer | Dubai Sports Council / Dubai Fitness Challenge |
| CTA URL (draft) | https://www.dubaifitnesschallenge.com/en/ |
| Recheck required | CRITICAL -- must recheck before local import. Site was accessible May 18 2026 with Oct 31 dates. If site still blocks at import time, do not import until dates are reconfirmed from another official source. |
| Supported claims (from May 18 2026 verification) | Oct 31 launch; 30-day citywide campaign; free to participate in core activities |
| Blocked claims | Do not say "exclusively for residents" or "for Dubai citizens only" -- open to all |
| Historical pattern | DFC Season 8 ran Nov 1-30 2024; Season 9 ran Nov 1-30 2025; 2026 reported as Oct 31 launch |
| Sub-events (all November) | Dubai Ride Nov 1; Stand Up Paddle Nov 7-8; Dubai Run Nov 22; Dubai Yoga Nov 29 |

---

## October 2026 -- Items scanned and excluded or held

| Item | Dates | Why excluded/held |
|------|-------|-------------------|
| GITEX Global 2026 | Dec 7-11 (NOT October) | Confirmed December from gitex.com + Dubai Exhibition Centre; NOT October |
| Global Village Season 31 | Estimated mid-October 2026 (no official date) | HOLD -- Season 30 ended May 31 2026; no Season 31 announcement yet |
| Dubai Airshow 2026 | DOES NOT EXIST | Biennial (odd years only); next edition Nov 2027 at DWC |
| Big 5 Global 2026 | Nov 23-26 | November, not October |
| ADIPEC 2026 | Nov 2-5, Abu Dhabi | November; Abu Dhabi, not Dubai |
| Index Dubai 2026 | Sep 28-30 | September |
| Downtown Design Dubai 2026 | Nov 4-8 | November |
| Dubai Shopping Festival 2026 | No official 2026 dates | HOLD; typically Dec-Jan |
| CCA October events | Unknown | Site blocked (Tixity queue-it); no confirmed events |
| Dubai Opera October events | None announced | No October 2026 shows visible yet |
| Expo City Dubai October events | None announced | No events visible for October 2026 |
| Cityscape Dubai 2026 | No official 2026 dates | SOURCE_NEEDED; site 403 |
| MoHRE/NAFIS October items | None | No October-specific Emiratisation deadline; next is Dec 31 |
| Dubai Fitness Challenge (sub-events) | Nov 1-29 | November, not October. Only Oct 31 launch in October |

---

## GITEX Correction Note

**GITEX 2026 is December, NOT October.**

Confirmed from two official sources (Phase 6C-89):
- gitex.com: "Summit 7 December, Expo 8-11 December 2026 at Dubai Exhibition Centre, Expo City"
- dubaiexhibitioncentre.com: same dates confirmed

If the seed matrix (uae-dubai-2026-calendar-seed-matrix.md) or batch2 doc shows GITEX in October (~Oct 13-17), that is stale. GITEX 2026 is December. The seed matrix DXB-02 entry should be updated.

---

*Ledger prepared Phase 6C-89. Do not import ledger notes into calendar_pages.en_notes or ru_notes.*

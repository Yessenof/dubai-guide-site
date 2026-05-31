# Phase 6C-89 Report — October 2026 Calendar Source Radar and Draft Pack

**Phase:** 6C-89
**Date completed:** 2026-05-31
**Status:** COMPLETE — docs only, no DB or code changes

---

## 1. What was done

Source radar scan and draft pack creation for October 2026 Dubai calendar page. Docs-only phase — no DB imports, no deployments, no code changes.

**Deliverables produced:**

| File | Description |
|------|-------------|
| `docs/content-drafts/calendar/october-2026-dubai-calendar.md` | Full draft: October 2026 calendar page (5 items, 29.0% coverage) |
| `docs/content-drafts/source-ledgers/october-2026-calendar-sources.md` | Full source ledger for all October items scanned |
| `docs/content-drafts/calendar/october-2026-calendar-density-report.md` | Coverage analysis |
| This report | Phase 6C-89 completion report |

---

## 2. What official/organizer/venue/ticketing sources were found for October?

| Source | URL | Item | Dates | Status |
|--------|-----|------|-------|--------|
| Messe Frankfurt (Beautyworld Dubai) | beautyworld-dubai.ae.messefrankfurt.com | Beautyworld Dubai 2026 | Oct 6-8 | Confirmed |
| WETEX / DEWA | wetex.ae + dwtc.com/en/events/wetex-2026/ | WETEX 2026 | Oct 20-22 | Confirmed |
| FTA (VAT rules) | tax.gov.ae | VAT Q3 return deadline | Oct 28 | Confirmed |
| MoF / existing calendar page | /calendar/uae-e-invoicing-2026-asp-deadline | E-invoicing ASP cross-ref | Oct 30 | Confirmed |
| DFC official | dubaifitnesschallenge.com/en/ | DFC launch | Oct 31 | source_ready — recheck (site now 403) |

**Not confirmed — Hold/Source_needed:**
- Global Village Season 31 (~mid-October, historical): HOLD — no 2026 announcement
- Cityscape Dubai 2026: SOURCE_NEEDED — site 403
- CCA October concerts: not accessible (Tixity queue-it bot-protection)
- Dubai Opera October events: no events visible yet

---

## 3. What did the scan find about GITEX 2026 dates?

**GITEX 2026 is December, NOT October.**

Confirmed from two official sources:
- **gitex.com**: Summit December 7, Expo December 8-11, 2026, Dubai Exhibition Centre, Expo City
- **dubaiexhibitioncentre.com**: same dates confirmed

If the seed matrix (DXB-02) or any other planning doc shows GITEX in October (~Oct 13-17), that is stale and incorrect. GITEX 2026 must be treated as a December item (Level 3 planning, Publish by October 1 2026 per B2-02).

**Dubai Airshow 2026 also does not exist** — biennial event, odd years only; next edition is November 2027 at DWC.

---

## 4. Which items are Level 1?

| ID | Item | Dates |
|----|------|-------|
| OCT-01-BEAUTY | Beautyworld Dubai 2026 | Oct 6-8 |
| OCT-03-VAT | UAE VAT Q3 2026 return deadline | Oct 28 |
| OCT-04-EINV | E-invoicing ASP cross-reference | Oct 30 |
| OCT-05-DFC | Dubai Fitness Challenge 2026 launch | Oct 31 |

---

## 5. Which items are Level 2 indexed briefs?

| ID | Item | Dates |
|----|------|-------|
| OCT-02-WETEX | WETEX 2026 (DEWA, energy/water/environment) | Oct 20-22 |

WETEX gets L2 because it has cross-sector relevance (energy, sustainability, government) and the audience is different from the standard consumer audience. Brief written: ~90 words EN + ~85 words RU.

---

## 6. Which items need Level 3 full pages?

| Item | Status | Notes |
|------|--------|-------|
| E-invoicing ASP deadline | **Already live** — `/calendar/uae-e-invoicing-2026-asp-deadline` | Cross-referenced from Oct page via detail_url |
| Dubai Fitness Challenge 2026 | **Draft needed** — `docs/content-drafts/events/dubai-fitness-challenge-2026.md` | B2-03 recommends standalone event page; sub-events (Dubai Ride, Run, etc.) link back. The October monthly page only has the Oct 31 launch day; full DFC page is a Phase 6C-90+ task |
| GITEX Global 2026 | **Draft exists** — `docs/content-drafts/events/gitex-global-2026.md` | B2-02 draft exists but is for December calendar; Publish by October 1 2026 |

---

## 7. Which items remain hold/source_sprint?

| Item | Status | Action |
|------|--------|--------|
| Global Village Season 31 | HOLD — no official 2026 opening date | Monitor globalvillage.ae from July 2026 |
| Cityscape Dubai 2026 | SOURCE_NEEDED | Monitor cityscape.ae from July 2026 |
| CCA October concerts | SOURCE_NEEDED | Recheck when Tixity bot-protection is manageable |
| Dubai Opera October events | SOURCE_NEEDED | Check from August 2026 |
| DFC Oct 31 (recheck) | source_ready but needs recheck — site 403 | Recheck before Phase 6C-90 local QA |

---

## 8. What is projected October coverage?

**29.0% (9/31 unique days)**

Range visualization breakdown:
- Oct 6-8: Beautyworld (grid: pill Oct 6 + bars Oct 7-8)
- Oct 20-22: WETEX (grid: pill Oct 20 + bars Oct 21-22)
- Oct 28, 30, 31: compliance/event (single-day items, no range bars)

Gap clusters: Oct 1-5 (5 days), Oct 9-19 (11 days), Oct 23-27 (5 days), Oct 29 (1 day) = 22 gap days.

**Path to 60%**: Global Village Season 31 mid-October opening (historical: Oct 15) would add ~15+ days if confirmed. This single item could transform October's visual coverage.

---

## 9. Are item image candidates/fallbacks documented?

| Item | Image status | Fallback |
|------|-------------|---------|
| OCT-01-BEAUTY | No Guidex-owned image. Official URL could be used if legally safe. | Category fallback: business/event (IMG_DIFC) |
| OCT-02-WETEX | No Guidex-owned image. DEWA/WETEX official OG image could be referenced if safe. | Category fallback: business (IMG_DIFC) |
| OCT-03-VAT | No image needed (compliance deadline) | Category fallback: government/compliance |
| OCT-04-EINV | Points to existing e-invoicing page which has its own image | Uses existing page image |
| OCT-05-DFC | No Guidex-owned image. DFC official images if accessible. | Category fallback: event/family (IMG_JLT) |

Page-level image: `/images/hubs/dubai-skyline-downtown.webp` (standard fallback).

Item-level thumbnails require a future schema addition — not blocking import.

---

## 10. Is October ready for local import QA?

**Ready, with one pre-import recheck required:**

The October draft is structurally complete and source-safe. Before running local import QA (Phase 6C-90):
- **DFC Oct 31**: recheck dubaifitnesschallenge.com — if site still returns 403, confirm dates from an alternative official source before including OCT-05-DFC. If unconfirmable, the page can be imported with 4 items (excluding OCT-05-DFC) and DFC added later.
- **Beautyworld**: recheck Oct 6-8 still current
- **WETEX**: recheck Oct 20-22 still current
- **VAT Q3**: verify FTA deadline unchanged

---

## 11. What exact local import QA phase should run next?

**Phase 6C-90 — October 2026 Calendar Local Import QA**

Expected scope:
- slug: october-2026-dubai-calendar
- month: 10, year: 2026
- 5 items (or 4 if DFC Oct 31 cannot be reconfirmed)
- CREATE new row (slug does not exist in local DB)
- Local QA routes: same pattern as September/August phases
- Coverage: 29.0% (sub-target; Global Village is the primary enrichment path)
- Verify E-invoicing cross-reference renders as internal link (detail_url)
- Verify WETEX L2 brief renders in initial HTML
- Verify range bars for Beautyworld (Oct 7-8) and WETEX (Oct 21-22)

---

## 12. Confirm no DB/code/deploy/import happened

**Confirmed: zero DB changes, zero code changes, zero deployments, zero imports.**

This phase was docs-only:
- `docs/content-drafts/calendar/october-2026-dubai-calendar.md` (created)
- `docs/content-drafts/source-ledgers/october-2026-calendar-sources.md` (created)
- `docs/content-drafts/calendar/october-2026-calendar-density-report.md` (created)
- This report (created)

---

## 13. Source radar rule applied

All items follow the Phase 6C-86 source radar guidance:
- Official government (FTA, MoF) for compliance items
- Official organizer (Messe Frankfurt, DEWA) for trade shows
- Official event site (DFC) for the challenge launch (with recheck flag)
- No media-only sources used as final authority
- No invented events, no fabricated dates

---

*Phase 6C-89 complete. Next: Phase 6C-90 — October 2026 calendar local import QA.*

# Calendar Source Coverage Audit — August to December 2026 + January 2027

**Date:** 2026-05-31 (Phase 6C-93A)
**Status:** Audit complete — see import candidate pack 6C93A-calendar-import-candidate-pack.md

---

## Coverage summary by month

| Month | Live items | Live days covered | Coverage | Target | Gap |
|-------|------------|------------------|----------|--------|-----|
| August 2026 | 3 items | 3 unique days* | ~10%** | 90% | CRITICAL |
| September 2026 | 8 items | 14 days | 46.7% | 90% | Significant |
| October 2026 | 4 items | 8 days | 25.8% | 90% | Critical |
| November 2026 | 0 items | 0 days | 0% | 90% | Not imported yet |
| December 2026 | 0 items | 0 days | 0% | 90% | Not imported yet |
| January 2027 | 0 items | 0 days | 0% | 90% | Not imported yet |

\* After UX patch: DSS no longer expands Aug 1-31. Real unique event days: Aug 2 (Def Leppard), Aug 24-26 (DIHAD) = 4 days.
\** DSS chip appears Aug 1 as monthly highlight but doesn't "cover" individual days in the redesigned grid.

---

## August 2026 — detailed audit

### Live items (3)

| ID | Item | Date(s) | Category | Days | Links |
|----|------|---------|----------|------|-------|
| AUG-01-DSS | Dubai Summer Surprises final month | Aug 1-30 | event | 30 (monthly highlight) | External only |
| AUG-02-DEFLEP | Def Leppard at CCA | Aug 2 | event | 1 | External only |
| AUG-03-DIHAD | DIHAD Conference at DWTC | Aug 24-26 | conference/business | 3 | External only |

### Weak categories (0 items)
- Government/compliance deadlines: 0
- Family/school: 0 (school year starts late Aug/early Sep — school date gap)
- Property/real estate: 0
- Holiday: 0

### Missing likely categories
| Category | Expected items | Why missing |
|----------|---------------|-------------|
| KHDA school year start | Late Aug / early Sep | KHDA circular not captured |
| Back-to-school compliance (KHDA) | Late Aug | No source captured |
| RTA/road events (summer) | None | Low priority |
| Corporate tax preparation reminder | Any Aug | No Aug-specific trigger |

### External-only links (all 3 items)
Every August item links out to: visitdubai.com, coca-cola-arena.com, dwtc.com. No Guidex detail pages.

### EN/RU parity
All 3 items have ru_published=1. RU parity: ✓

### Expired/held/mock risk
DSS ends Aug 30. noindex_after=2026-09-01. After Sep 1, DSS should be noindex'd. No expired mock items.

---

## September 2026 — detailed audit

### Live items (8)

| ID | Item | Date(s) | Category | Days | Links |
|----|------|---------|----------|------|-------|
| SEP-01-MEE | Middle East Energy + Intersolar | Sep 1-3 | trade_show | 3 | External |
| SEP-02-IPS | Int'l Property Show | Sep 7-9 | trade_show | 3 | External |
| SEP-03-AIM | AIM Congress | Sep 7-9 | conference | 3 | External |
| SEP-04-ATM | Arabian Travel Market | Sep 14-17 | trade_show (L2) | 4 | External |
| SEP-05-PLME | Private Label ME | Sep 15-17 | trade_show | 3 | External |
| SEP-06-SEAMLESS | Seamless ME | Sep 22-24 | trade_show | 3 | External |
| SEP-07-FOREX | Forex Expo | Sep 22-23 | trade_show | 2 | External |
| SEP-08-TAX | Corp Tax deadline example | Sep 30 | compliance (L2) | 1 | External |

### Gap clusters
| Gap | Dates | Days |
|-----|-------|------|
| Sep 4-6 | After MEE before IPS | 3 |
| Sep 10-13 | After IPS before ATM | 4 |
| Sep 18-21 | After ATM before Seamless | 4 |
| Sep 25-29 | After Seamless before Tax | 5 |

### Missing likely categories
| Category | Notes |
|----------|-------|
| KHDA school start | September is school start month — important for families |
| Mawlid Al-Nabi | HOLD — FAHR not announced (around Sep 12-15 area) |
| Cityscape Dubai | Historically Oct, not confirmed 2026 |
| UAE National Holiday planning | Sep has no public holidays confirmed |

### Items without Guidex detail page (all 8)
No Guidex-hosted detail pages. All CTAs external. SEP-08-TAX has L2 brief — closest to Guidex content.

---

## October 2026 — detailed audit

### Live items (4)

| ID | Item | Date(s) | Category | Days | Links |
|----|------|---------|----------|------|-------|
| OCT-01-BEAUTY | Beautyworld Dubai | Oct 6-8 | trade_show | 3 | External |
| OCT-02-WETEX | WETEX | Oct 20-22 | trade_show (L2) | 3 | External |
| OCT-03-VAT | VAT Q3 deadline | Oct 28 | compliance | 1 | External |
| OCT-04-EINV | E-invoicing ASP | Oct 30 | compliance | 1 | Internal (✓) |

### Gap clusters
| Gap | Dates | Days |
|-----|-------|------|
| Oct 1-5 | Before Beautyworld | 5 |
| Oct 9-19 | Between Beautyworld and WETEX | 11 |
| Oct 23-27 | Between WETEX and VAT | 5 |
| Oct 29 | Between VAT and e-inv | 1 |

### Missing likely categories
| Category | Notes |
|----------|-------|
| DFC October 31 launch | HOLD — site 403 |
| Global Village Season 31 | HOLD — no official date |
| Cityscape Dubai | SOURCE_NEEDED |
| GITEX (wrong month) | December only — correctly absent |
| School half-term | KHDA Oct break |

---

## November 2026 — audit of unimported months

### Confirmed items (not yet imported)

| ID | Item | Dates | Category | Source | Status |
|----|------|-------|----------|--------|--------|
| NOV-01-DDW | Dubai Design Week | Nov 3-8 | event/business | dubaidesignweek.ae | Confirmed |
| NOV-02-DD | Downtown Design Dubai | Nov 4-8 | event/property | source_ledger | Confirmed (overlap with DDW) |
| NOV-03-BIG5 | Big 5 Global | Nov 23-26 | trade_show | thebig5construct.com | Confirmed |
| NOV-04-DFC | DFC campaign launch | Oct 31-Nov 29 | event/lifestyle | dubaifitnesschallenge.com | HOLD (403) |
| NOV-04a | Dubai Ride | Nov 1 | event/lifestyle | DFC sub-event | HOLD |
| NOV-04b | Dubai Stand Up Paddle | Nov 7-8 | event/lifestyle | DFC sub-event | HOLD |
| NOV-04c | Dubai Run | Nov 22 | lifestyle | DFC sub-event | HOLD |
| NOV-04d | Dubai Yoga | Nov 29 | lifestyle | DFC sub-event | HOLD |

### Coverage calculation
- Without DFC: DDW Nov 3-8 (6d) + Big5 Nov 23-26 (4d) = ~8 unique days = 26.7%
- With DFC: Oct 31 through Nov 29 fills most of month = ~93%

### Missing categories
| Category | Notes |
|----------|-------|
| Compliance/tax November | VAT Q2 return? (monthly filers — Oct 28) |
| Family/school | Nov half-term (KHDA) |
| Property | IPS was September — no Nov property show confirmed |
| Concert/venue | Coca-Cola Arena Nov shows — no confirmed events captured |

### Source groups to check
- dubaidesignweek.ae — confirm Nov 3-8 still current
- thebig5construct.com — confirm Nov 23-26
- dubaifitnesschallenge.com — check if site recovered (403 as of 6C-91)
- dwtc.com/en/events/ — any other Nov shows
- Coca-Cola Arena Nov schedule

---

## December 2026 — audit of unimported months

### Confirmed items (not yet imported)

| ID | Item | Dates | Category | Source | Status |
|----|------|-------|----------|--------|--------|
| DEC-01-COMM | Commemoration Day | Dec 1 | public holiday | Official (always fixed) | Confirmed |
| DEC-02-NATDAY | UAE National Day | Dec 2-3 | public holiday | Official (always fixed) | Confirmed |
| DEC-03-GITEX | GITEX Global | Dec 7-11 | business event | gitex.com (confirmed May 2026) | Confirmed |
| DEC-04-DSF | Dubai Shopping Festival | Late Dec | event/retail | visitdubai.com | HOLD — no official date |
| DEC-05-SOLE | Sole DXB | Early Dec | lifestyle | soledxb.com | HOLD — no official dates |
| DEC-06-LONGWKND | Long weekends Dec 1-3 | Dec 1-3 | holiday | long-weekends calendar | Already live (yearly page) |

### Coverage calculation
- Without DSF/Sole: Dec 1-3 + Dec 7-11 = 8 days = 25.8%
- With DSF (late Dec, typically Dec 26+): could reach 60-70%

### Missing categories
| Category | Notes |
|----------|-------|
| DSF | HOLD — no official 2026/27 dates |
| Sole DXB | HOLD |
| Dubai Opera December concerts | Not captured |
| Ramadan 2027 planning reminder | Could add as Dec prep note |
| Corporate tax year-end preparation | Dec 31 FY reminder for Q1 filing |
| School winter break | KHDA Dec break |
| Global Village ongoing | If confirmed by then |

### Source groups to check
- gitex.com — already confirmed Dec 7-11 at Expo City Dubai
- visitdubai.com/en/festivals-and-events/dsf — DSF official dates
- soledxb.com — Sole DXB date
- dubaiopera.com — Dec concert schedule
- FAHR — National Day holiday announcement (typically Dec 1-3 confirmed months in advance)

---

## January 2027 — audit

### Confirmed items (not yet imported)

| ID | Item | Dates | Category | Source | Status |
|----|------|-------|----------|--------|--------|
| JAN-01-EINV | E-invoicing Phase A go-live | Jan 1, 2027 | compliance | MoF/FTA | Confirmed |
| JAN-02-AML | AML risk assessment window | Jan 1-31 | compliance | MOEI/goAML | HOLD — needs MOEI confirmation |
| JAN-03-DSF | DSF continues | Jan TBD | event | visitdubai.com | HOLD |
| JAN-04-VATAML | VAT Q4 2026 return | Jan 28, 2027 | compliance | FTA | Confirmed |
| JAN-05-MARATHON | Dubai Marathon | Jan TBD | lifestyle | runuae.ae | SOURCE_NEEDED |

### Coverage without holds: Jan 1 + Jan 28 = 2 days = 6.5% — critically thin.

---

## Weak source categories across all months

| Source type | Current gap |
|-------------|------------|
| KHDA / schools | Zero school-related items in any month |
| Dubai Opera / CCA | Only 1 concert item (Def Leppard Aug) |
| Abu Dhabi (UAE-wide events clearly labelled) | GITEX at Expo City Dubai is the only Abu Dhabi-adjacent item |
| DLD / RERA | No property market items |
| Government service deadlines | Only compliance items; no DED license, GDRFA, etc. |
| Global Village | No item — HOLD all months |
| DSF | No item — HOLD |
| Ramadan 2027 | Not planned yet |

---

## Items without Guidex detail page (all current live months)

Every live calendar item except OCT-04-EINV uses `detail_url: null`. All CTAs are external.

**Priority to add Guidex detail pages:**
1. GITEX December → high business relevance, warrants its own events detail page
2. ATM September → hospitality/property audience
3. Dubai Design Week November → design/property audience
4. DSS July/August → tourism/shopping audience
5. Big 5 November → construction/property audience

---

## EN/RU parity risk

All currently live months have `ru_published=1`. Parity maintained.
For upcoming months (Nov/Dec/Jan): RU content must be written before publish.
Risk: November has DFC with long RU text — if DFC resolves, RU brief must be drafted.

---

## Expired/held/mock risk

| Item | Risk |
|------|------|
| JUL-03-KHAIR (Muntazah Al Khairan Jul 3-4) | noindex_after=2026-07-05 — already past. Page should noindex this item if logic is implemented |
| AUG-02-DEFLEP (Aug 2) | noindex_after=2026-08-03 — past. Same risk. |
| AUG-03-DIHAD (Aug 24-26) | noindex_after=2026-08-27 — past. |
| SEP-* items | noindex_after=2026-09-04/10/18/24/25 — past. |
| OCT-03-VAT | noindex_after=2026-10-29 — future |
| OCT-04-EINV | noindex_after=2026-10-31 — future |

**Note:** Page-level noindex is managed at the calendar_pages row level. Individual item `noindex_after` dates are used for the range inference system, not for individual item removal from the page. Past items remain visible in the page detail view until the page itself is archived. This is by design — historical context.

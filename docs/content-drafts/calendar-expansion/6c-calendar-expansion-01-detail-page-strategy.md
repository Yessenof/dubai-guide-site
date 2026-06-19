# Phase 6C-CALENDAR-EXPANSION-01 — Detail Page Strategy

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-01  
**Mode:** Planning only. No DB writes, no imports, no deploy.

---

## 1. Which calendar items should link to Guidex detail pages

| Calendar Item | Month | Guidex Detail Page | Status |
|---|---|---|---|
| DP World Tour Championship 2026 | November | `/events/dp-world-tour-championship-2026` | To build this phase |
| Global Village Season 31 | October+ | `/events/global-village-dubai-season-31-2026` | Skeleton drafted; link once page is live in DB |
| Dubai Shopping Festival 32nd | December | `/events/dubai-shopping-festival-2026-2027` | Skeleton drafted; link once dates confirmed + page live |
| Dubai Design Week 2026 | November | `/events/dubai-design-week-2026` ✓ | Already live and linked |
| Big 5 Global 2026 | November | `/events/big-5-global-dubai-2026` ✓ | Already live and linked |
| F1 Abu Dhabi Grand Prix 2026 | December | `/events/formula-1-abu-dhabi-grand-prix-2026` ✓ | Already live and linked |
| GITEX Global 2026 | December | `/events/gitex-global-2026` ✓ | Already live and linked |
| ILT20 Season 5 2026 | November + December | `/events/ilt20-season-5-2026` | Future — after ilt20.com confirms season window |
| Dubai FinTech Summit 2026 | November | `/events/dubai-fintech-summit-2026` | Optional; calendar item alone sufficient for now |
| Frieze Abu Dhabi 2026 | November | `/events/frieze-abu-dhabi-2026` | Future — after organizer-direct source confirmed |

---

## 2. Which can temporarily link to official external source

Items that don't have a Guidex detail page yet should link to the official organizer/source until the detail page is built:

| Calendar Item | Temporary external link |
|---|---|
| Dubai FinTech Summit 2026 | https://dubaifintechsummit.com/ |
| DFC correction items | https://www.dubaifitnesschallenge.com/en/ |
| UAE Corporate Tax deadline | https://tax.gov.ae/ |
| UAE Emiratisation H2 deadline | https://mohre.gov.ae/ |
| ILT20 Season 5 (provisional) | https://ilt20.com/ (once confirmed) |
| Frieze Abu Dhabi (provisional) | https://frieze.com/fairs/frieze-abu-dhabi (once confirmed on organizer site) |
| Global Village Season 31 placeholder | https://www.globalvillage.ae/en/ |
| DSF (once dates announced) | https://www.dubaidet.gov.ae/ |

---

## 3. Which need source recheck before detail page

| Event | Recheck needed | What to verify | Recheck deadline |
|---|---|---|---|
| ILT20 Season 5 | ilt20.com official fixture | Season window dates, specific venue schedule | September 2026 |
| Frieze Abu Dhabi 2026 | frieze.com or abudhabiart.ae | Exact dates, venue confirmation | September 2026 |
| Dubai FinTech Summit 2026 | dubaifintechsummit.com | No further reschedule; final dates | Before September 2026 |
| Global Village Season 31 | globalvillage.ae | Exact opening date announcement | September–October 2026 |
| DSF 2026–2027 | dubaidet.gov.ae or mediaoffice.ae | Official 32nd-edition start/end date | September–October 2026 |
| NYE Dubai 2026 | Dubai Police / DET / Emaar | Program announcement | Mid-November 2026 |

---

## 4. Recommended slug for each future detail page

| Event | Recommended slug | Notes |
|---|---|---|
| DP World Tour Championship 2026 | `dp-world-tour-championship-2026` | Clean, year-specific, matches DP World Tour branding |
| Global Village Season 31 | `global-village-dubai-season-31-2026` | Season number + year for clarity |
| Dubai Shopping Festival 2026–2027 | `dubai-shopping-festival-2026-2027` | Two-year span as is standard for DSF |
| ILT20 Season 5 2026 | `ilt20-season-5-2026` | Season number + year |
| Dubai FinTech Summit 2026 | `dubai-fintech-summit-2026` | Year-specific |
| Frieze Abu Dhabi 2026 | `frieze-abu-dhabi-2026` | Must include "Abu Dhabi" in slug — not "dubai" |
| New Year's Eve Dubai 2026 | `new-years-eve-dubai-2026` | When program is announced |

---

## 5. EN/RU route plan

All event detail pages must ship with EN and RU versions simultaneously.

| EN route | RU route | Status |
|---|---|---|
| `/events/dp-world-tour-championship-2026` | `/ru/events/dp-world-tour-championship-2026` | To build |
| `/events/global-village-dubai-season-31-2026` | `/ru/events/global-village-dubai-season-31-2026` | To build |
| `/events/dubai-shopping-festival-2026-2027` | `/ru/events/dubai-shopping-festival-2026-2027` | To build (skeleton) |
| `/events/ilt20-season-5-2026` | `/ru/events/ilt20-season-5-2026` | Future |
| `/events/dubai-fintech-summit-2026` | `/ru/events/dubai-fintech-summit-2026` | Optional / future |
| `/events/frieze-abu-dhabi-2026` | `/ru/events/frieze-abu-dhabi-2026` | Future |

RU content must match EN in facts and intent. Natural editorial Russian, not literal translation. All blocked claims apply equally to both locales.

---

## 6. Internal links from each detail page

### DP World Tour Championship 2026 (`/events/dp-world-tour-championship-2026`)
- Back to `/calendar` 
- Back to `/calendar/november-2026-dubai-calendar`
- `/events` listing
- No related guide yet (a UAE business-traveler or golf tourism guide could exist in future)

### Global Village Season 31 (`/events/global-village-dubai-season-31-2026`)
- Back to `/calendar`
- Back to `/calendar/october-2026-dubai-calendar` (once calendar item is added)
- `/events` listing
- Future: link to a Dubai family/tourism guide if built

### Dubai Shopping Festival 2026–2027 (`/events/dubai-shopping-festival-2026-2027`)
- Back to `/calendar`
- Back to `/calendar/december-2026-uae-calendar` (once calendar item is added)
- `/events` listing
- Future: links to relevant retail guide or relocation guide

### ILT20 Season 5 (`/events/ilt20-season-5-2026`) — future
- Back to `/calendar`
- Back to `/calendar/november-2026-dubai-calendar` and `/calendar/december-2026-uae-calendar`
- `/events` listing

### Frieze Abu Dhabi 2026 (`/events/frieze-abu-dhabi-2026`) — future
- Back to `/calendar`
- Back to `/calendar/november-2026-dubai-calendar`
- Must clearly label Abu Dhabi — do not link from Dubai-only pages without clear labeling
- `/events` listing

---

## 7. Blocked claims per event (summary)

| Event | Key blocked claims |
|---|---|
| DP World Tour Championship | Ticket prices; player field; prize fund confirmation |
| Global Village Season 31 | Opening date (not confirmed); ticket prices; Season 31 pavilion count; entertainment lineup |
| DSF 2026–2027 | Any specific start/end date; Golden Ticket raffle rules; participating retailers |
| ILT20 Season 5 | Individual match dates; ticket prices; team roster |
| Frieze Abu Dhabi | Exact dates (provisional); ticket prices; exhibitor list |
| UAE Corporate Tax Dec deadline | Applies to all companies (does NOT — only March 2026 year-end); penalty figures |
| UAE Emiratisation H2 | Penalty amount (verify on MoHRE first); applies to all employers (does NOT) |
| NYE Dubai 2026 | Any specific venue or program (too early) |

---

## 8. Priority build sequence (for 6C-CALENDAR-EXPANSION-02)

1. **DP World Tour Championship 2026** — event page + November calendar item. No blockers. P0.
2. **Corporate Tax and Emiratisation December deadlines** — calendar items only. Low effort, high value. P0.
3. **DFC correction** — correct October start date and November window. Low effort. P1.
4. **Dubai FinTech Summit** — calendar item only. Reconfirm on summit site first. P1.
5. **Global Village Season 31 skeleton** — event page body without date. Hold calendar item. P1.
6. **DSF skeleton** — event page body without date. Hold calendar item. P1.
7. **ILT20 Season 5** — after ilt20.com confirms. P2.
8. **Frieze Abu Dhabi** — after organizer direct confirmation. P2.
9. **Expand North Star fold-in** — section in GITEX page. Anytime. Low effort.
10. **Downtown Design fold-in** — section in Dubai Design Week page. Anytime. Low effort.

# UAE Calendar Universe — SEO Cluster Map
**Phase:** 6C-CALENDAR-UNIVERSE-AUDIT-01
**Date:** 2026-07-14
**Status:** Architecture draft — for implementation planning

---

## 1. Core architecture principle

Every event or date on Guidex must be connected to at least one cluster hub.
No orphan pages.
Every month page is a cluster hub.
Every category should eventually become a hub.
Every major venue is a potential sub-hub.

---

## 2. Pillar pages (current + proposed)

| Pillar | URL pattern | Current status | Priority |
|--------|-------------|---------------|----------|
| Guides hub | /guides | Exists ✓ | — |
| Calendar hub | /calendar | Exists ✓ | — |
| Events hub | /events | Exists ✓ | — |
| **Etihad Rail guide** | /guides/etihad-rail-passenger-service-dubai | MISSING | P0 |
| **UAE Public Holidays** | /guides/uae-public-holidays-2026 | MISSING | P0 |
| **Dubai Shopping Festival** | /events/dubai-shopping-festival-2026 | MISSING | P0 |
| **Dubai Fitness Challenge 2026** | /events/dubai-fitness-challenge-2026 | MISSING | P0 |
| **Global Village Season 31** | /events/global-village-dubai-season-31 | MISSING | P0 |
| Concerts in Dubai 2026 hub | /calendar (filtered) | PARTIAL | P1 |
| Dubai events 2027 hub | /calendar (2027 pages) | MISSING | P1 |
| Abu Dhabi events | /calendar/abu-dhabi-... | PARTIAL | P1 |

---

## 3. Time-based cluster (month pages)

### Existing month pages (slugs)

| Page | Slug | 2027 equivalent needed |
|------|------|----------------------|
| May 2026 | /calendar/may-2026-uae-calendar | Not needed (historical) |
| June 2026 | /calendar/june-2026-dubai-calendar | Not needed (historical) |
| July 2026 | /calendar/july-2026-dubai-calendar | /calendar/july-2027-dubai-calendar (future) |
| August 2026 | /calendar/august-2026-dubai-calendar | Create when demand appears |
| September 2026 | /calendar/september-2026-dubai-calendar | Create when demand appears |
| October 2026 | /calendar/october-2026-dubai-calendar | Create when demand appears |
| November 2026 | /calendar/november-2026-dubai-calendar | Create when demand appears |
| December 2026 | /calendar/december-2026-uae-calendar | — |

### New month pages needed

| Page | Slug | Priority | Trigger |
|------|------|----------|---------|
| January 2027 | /calendar/january-2027-dubai-calendar | P0 | DSF ends Jan 11; WHX Jan 25-28; Etihad Rail |
| February 2027 | /calendar/february-2027-dubai-calendar | P1 | Marathon, Tennis, MRO |
| March 2027 | /calendar/march-2027-dubai-calendar | P1 | Gulfood, Ramadan, Etihad Rail Sharjah |

### Month page SEO targets (for existing pages)

| Month | Primary keyword | Secondary keywords |
|-------|----------------|-------------------|
| July 2026 | dubai events july 2026 | things to do dubai july, concerts dubai july |
| August 2026 | dubai events august 2026 | concerts dubai august, festivals august dubai |
| September 2026 | dubai events september 2026 | exhibitions september dubai, conferences september |
| October 2026 | dubai events october 2026 | concerts october dubai, exhibitions october |
| November 2026 | dubai events november 2026 | concerts november dubai, festivals november |
| December 2026 | dubai events december 2026 | new year dubai, dubai december concerts |
| January 2027 | dubai events january 2027 | dubai shopping festival january 2027 |

---

## 4. Category clusters (proposed hubs)

### 4.1 Concerts in Dubai
**URL:** /calendar + filter or dedicated page
**Target queries:** "concerts in dubai 2026", "dubai concerts", "live music dubai 2026"
**Key events to link:** Atif Aslam, Jony, Miami Band, Christina Aguilera, Def Leppard, Offlimits
**Page type:** CollectionPage with Event schema items
**EN/RU:** Both needed — RU has high CTR for concert queries

### 4.2 Dubai Comedy Festival
**URL:** /events/dubai-comedy-festival-2026
**Target queries:** "dubai comedy festival 2026", "comedy show dubai"
**Key events:** Mo Gilligan, Vir Das, Munawar Faruqui, Jamie Lever, Shane Todd, Amit Tandon
**Page type:** Level C event page → Event schema
**Notes:** 7+ confirmed shows at Dubai Opera + Coca-Cola Arena in October

### 4.3 Dubai Fitness Challenge 2026
**URL:** /events/dubai-fitness-challenge-2026
**Target queries:** "dubai fitness challenge 2026", "dfc 2026", "dubai 30x30"
**Key sub-events:** Dubai Run Nov 22, Dubai Ride Nov 1, Dubai Muscle Show Oct 30
**Page type:** Level D cluster
**EN/RU:** Both needed

### 4.4 Global Village Dubai Season 31
**URL:** /events/global-village-dubai-season-31
**Target queries:** "global village dubai 2026 opening date", "global village season 31"
**Page type:** Level D cluster
**Notes:** Date pending official announcement (expected Aug-Sep 2026). Create as draft, publish when confirmed.

### 4.5 Dubai Shopping Festival 2026-27
**URL:** /events/dubai-shopping-festival-2026
**Target queries:** "dubai shopping festival 2026", "dsf 2026 dates", "dubai shopping festival december"
**Page type:** Level D cluster
**Notes:** Dec 5, 2026 – Jan 11, 2027 (DET official). Massive search demand.

### 4.6 Etihad Rail passenger service guide
**URL:** /guides/etihad-rail-dubai
**Target queries:** "etihad rail passenger service", "etihad rail dubai station", "abu dhabi fujairah train", "uae national railway"
**Page type:** Level D guide cluster
**Notes:** Highest-impact missing content. Phase 1 already live. Dubai station opens Sep 30.

### 4.7 UAE Public Holidays 2026
**URL:** /guides/uae-public-holidays-2026 (or /calendar/uae-public-holidays-2026)
**Target queries:** "uae public holidays 2026", "public holidays dubai 2026", "2026 uae holidays"
**Page type:** Level E live intelligence
**Notes:** Mawlid Aug 24-25 is MISSING and is imminent.

### 4.8 Formula 1 Abu Dhabi (existing)
**URL:** /events/formula-1-abu-dhabi-grand-prix-2026 (exists)
**Sub-cluster:** F1 concerts / Yasalam
**Missing:** Andrea Bocelli Dec 2 (Yasalam Classics) page or section

### 4.9 GITEX Global 2026 (existing)
**URL:** /events/gitex-global-2026 (exists, CTR optimized)
**Sub-cluster:** Dubai tech events
**Internal links:** → /events/expand-north-star-2026 → October/November calendar → Dubai tech guide

---

## 5. Geographic clusters (proposed)

### 5.1 Abu Dhabi events
**URL:** /calendar/abu-dhabi-events OR dedicated pages per event
**Key events to connect:** Christina Aguilera, The Corrs, Offlimits, ADIPEC, F1 Yasalam, Andrea Bocelli, Etihad Arena shows
**Notes:** Many Abu Dhabi events missing. Dubai residents travel to Abu Dhabi for major events.

### 5.2 Sharjah events
**URL:** /calendar/sharjah-events OR mentions in month pages
**Key events:** Sharjah International Book Fair, Expo Centre Sharjah, Sharjah Art Foundation
**Notes:** Low priority for dedicated page; integrate into month pages first.

### 5.3 Venue sub-hubs (future)
**Venues to consider:** Coca-Cola Arena, Dubai Opera, Etihad Arena, Dubai Exhibition Centre
**Priority:** P3 — build when enough events per venue to justify hub
**URL pattern:** /venues/coca-cola-arena or /calendar?venue=coca-cola-arena

---

## 6. Audience clusters (proposed)

### 6.1 Russian-speaking events in Dubai
**URL:** /ru/calendar + specific event pages with RU priority
**Key events:** Jony (Nov 4) — highest-value RU concert identified
**Target RU queries:** "концерты в дубае 2026", "события дубай ноябрь 2026"
**Strategy:** Strong RU CTR (7-10%) confirms this audience converts. Each major event needs RU version.

### 6.2 Indian/South Asian events
**Key events:** Indie Soulfest, Thaalam Beats, Sonu Nigam, Vir Das, Atif Aslam
**URL:** integrate into month pages + event detail pages
**Notes:** No dedicated hub needed yet; tag with audience metadata

### 6.3 Filipino community events
**Key events:** SB Girls, TJ Monterde/KZ Tandingan
**URL:** integrate into month pages
**Notes:** No dedicated hub; audience tag + RU-style bilingual metadata

### 6.4 Family events
**Key events:** Modesh World, Dubai Fitness Challenge family activities, school holiday programmes
**URL:** future filter or hub
**Notes:** Not enough distinct content yet for hub; integrate into month pages

---

## 7. Industry clusters (proposed)

| Cluster | Anchor events | Target queries | Priority |
|---------|--------------|----------------|----------|
| Tech/AI | GITEX, Expand North Star | "gitex 2026", "tech events dubai" | P0 (exists) |
| Energy/Oil & Gas | ADIPEC, WETEX, Intersolar | "adipec 2026", "energy conference dubai" | P1 |
| Real estate | IPS, IREX | "property show dubai 2026" | P2 |
| Healthcare | DIHAD, WHX Dubai | "healthcare exhibition dubai 2027" | P1 |
| Food & Hospitality | Gulfood, YUMMEX, Hotel Show | "gulfood 2027", "food exhibition dubai" | P1 |
| Interior design | INDEX Dubai | "interior design show dubai" | P2 |
| Jewellery/Luxury | Jewellery Gem & Tech | "jewellery exhibition dubai" | P2 |
| Construction | Big 5 Global | "big 5 global dubai" | P0 (exists) |
| Careers/Education | NAJAH Connect, RU'YA | "education fair dubai 2026" | P2 |
| Media/Broadcast | CABSAT | "cabsat dubai 2026" | P2 |

---

## 8. SEO cannibalisation risks

| Risk | Pages at risk | Resolution |
|------|--------------|-----------|
| F1 Abu Dhabi vs F1 concerts (Yasalam) | /events/formula-1-abu-dhabi vs concert cards | Keep F1 as parent page; nest Yasalam as sections within it |
| DSF page vs December calendar | /events/dubai-shopping-festival vs /calendar/december-2026 | DSF page = canonical for "dsf 2026" queries; Dec calendar links to it |
| DFC page vs November calendar | /events/dubai-fitness-challenge vs /calendar/november-2026 | DFC page = canonical for "dfc 2026" queries |
| Etihad Rail milestones vs transport guide | Calendar items (Sep 30, Dec 30) vs /guides/etihad-rail | Guide = canonical hub; calendar items = specific date entries linking back |
| GITEX vs Expand North Star | Both at Expo City Dec 8-10 | Already separate events; cross-link |

---

## 9. URL architecture recommendations

### Event pages
- Format: `/events/[event-name-year]`
- Example: `/events/dubai-shopping-festival-2026`, `/events/global-village-dubai-season-31`
- Avoid year in slug for evergreen events (exception: annual fixtures like GITEX 2026)

### Calendar pages
- Format: `/calendar/[month-year]-dubai-calendar` (current pattern) or `/calendar/[month-year]-uae-calendar` for UAE-wide months
- Maintain existing pattern for consistency

### Guide pages
- Format: `/guides/[topic-slug]`
- Example: `/guides/etihad-rail-dubai`, `/guides/uae-public-holidays-2026`

### Internal linking rules
- Every event page → month calendar page
- Every month calendar page → event pages for that month
- Every event page → related guides (transport, visas, practical Dubai)
- Every concert page → Coca-Cola Arena or Etihad Arena venue context
- Etihad Rail milestones → Etihad Rail guide
- DSF → December calendar + January calendar
- DFC events → November calendar + October calendar

---

## 10. Schema recommendations

| Content type | Schema | Notes |
|-------------|--------|-------|
| Individual concert/show | Event (MusicEvent or TheaterEvent) | Already implemented for event pages |
| Trade exhibition | Event (ExhibitionEvent) | Implement for ADIPEC, Big 5, GITEX |
| Public holiday page | FAQPage + SpecialAnnouncement | Include moon-sighting notice |
| Etihad Rail guide | FAQPage + HowTo | Step-by-step travel guide |
| Month calendar pages | ItemList or CollectionPage | Not yet implemented — opportunity |
| Dubai Shopping Festival | Festival + FAQPage | Large seasonal event |
| Venue hub (future) | LocalBusiness + EventVenue | Future |

---

## 11. Priority SEO actions from this phase

1. **Etihad Rail guide** — biggest missing search opportunity. No competitor has a clean EN/RU guide yet.
2. **Mawlid Al Nabawi Aug 24-25** — public holiday in 7 weeks. Zero coverage.
3. **Dubai Shopping Festival page** — Dec 5 confirmed. High commercial and search value.
4. **Global Village Season 31 page** — date pending but should be created as draft now.
5. **Jony (Nov 4)** — highest-value Russian-audience concert. Should have RU-priority treatment.
6. **Chicago the Musical (Dec 16-20)** — resolves the CCA HOLD. Confirmed from The National.
7. **2027 January calendar page** — WHX + DSF end + Tamaas + Etihad Rail all converge.
8. **Dubai Comedy Festival hub** — 7 confirmed shows; no Guidex presence.

# UAE Calendar Universe — Implementation Backlog
**Phase:** 6C-CALENDAR-UNIVERSE-AUDIT-01
**Date:** 2026-07-14
**Total candidates:** 130+
**Total missing from Guidex:** ~95

---

## Batch structure overview

| Batch | Scope | Candidates | Urgency |
|-------|-------|-----------|---------|
| 1 | Immediate — next 30 days + critical missing | ~20 | CRITICAL |
| 2 | Days 31-90 (confirmed, Sep-Oct) | ~30 | HIGH |
| 3 | Days 91-180 (Nov-Dec confirmed) | ~25 | MEDIUM |
| 4 | 2027 confirmed events | ~15 | PLANNED |
| 5 | Long-tail, niche, monitoring candidates | ~25 | LOW |
| 6 | Architecture and evergreen hubs | ~8 | STRATEGIC |

---

## BATCH 1 — Immediate: next 30 days + critical missing
**Target window:** July 15 – August 14, 2026
**Rationale:** Events within 30 days require immediate calendar items. Critical missing content (transport, holidays, DSF) needs pages before Google finds competitors.

### B1-A: Critical structural pages (no DB dependency — new events/guides)

| Candidate | Type | Action | EN/RU | DB table | Priority |
|-----------|------|--------|-------|----------|----------|
| Etihad Rail passenger service guide | Guide page | Create /guides/etihad-rail-dubai | Both | guides + steps | P0 |
| Mawlid Al Nabawi 25 Aug 2026 (expected) | Calendar item | **DONE** — `AUG-NEW-02` in august-2026-dubai-calendar; date corrected to 2026-08-25 in Phase 6C-CALENDAR-UNIVERSE-BATCH-01B | Both | calendar_pages.dates_json | P0 |
| Etihad Rail Sep 30 milestone (calendar) | Calendar item | Add to september-2026-dubai-calendar | Both | calendar_pages.dates_json | P0 |
| Dubai Shopping Festival 2026 (draft) | Event page | Create /events/dubai-shopping-festival-2026 (draft) | Both | events | P0 |
| Global Village Season 31 (draft) | Event page | Create /events/global-village-dubai-season-31 (draft status) | Both | events | P0 |

### B1-B: July 2026 calendar items (imminent or current)

| Candidate ID | Event | Date | Action | EN/RU |
|-------------|-------|------|--------|-------|
| JUL-05 | Dystinct & Issam Najjar | Jul 18 | **DONE** — `JUL-NEW-04` in july-2026-dubai-calendar (Phase 6C-CALENDAR-UNIVERSE-BATCH-01C, 2026-07-18) | Both ✓ |
| JUL-06 | Michael Lives Forever (MJ tribute) | Jul 18 | **DONE** — `JUL-NEW-05` in july-2026-dubai-calendar; tribute show clearly identified; Rodrigo Teaser performer | Both ✓ |
| JUL-07 | Talal Sam & Sultan Al Murshed | Jul 25 | **DONE** — `JUL-NEW-06` in july-2026-dubai-calendar; date conflict resolved: July 25 confirmed (Case B) via Visit Dubai + Beat The Heat series schedule (Platinumlist ID 106643 showing Aug 21 is a data error — series runs Saturdays; Jul 25 = Saturday; Aug 21 = Friday) | Both ✓ |
| JUL-08 | Indie Soulfest | Jul 26 | **DONE** — `JUL-NEW-07` in july-2026-dubai-calendar; Bismil + Indian Ocean, Coca-Cola Arena | Both ✓ |

### B1-C: August 2026 calendar items (within 30 days)

| Candidate ID | Event | Date | Action | EN/RU |
|-------------|-------|------|--------|-------|
| AUG-01 | Mawlid Al Nabawi | 25 Aug (expected) | **DONE** — `AUG-NEW-02` updated in Phase 6C-CALENDAR-UNIVERSE-BATCH-01B; one-day record, date 2026-08-25, confidence=expected | Both ✓ |
| AUG-02 | Rasha Rizk | Aug 1 | Add to august-2026-dubai-calendar | Both |
| AUG-03 | SB Girls (Abu Dhabi) | Aug 8 | Add to august-2026-dubai-calendar | Both |
| AUG-04 | Al Shami & Leen Hayek | Aug 8 | Add to august-2026-dubai-calendar | EN first |
| AUG-05 | Thaalam Beats | Aug 15 | Add to august-2026-dubai-calendar | Both |
| AUG-06 | Sonu Nigam (Abu Dhabi) | Aug 21 | Add to august-2026-dubai-calendar | Both |
| AUG-09 | DUPHAT | Aug 25-27 | Add to august-2026-dubai-calendar | EN only |

**Batch 1 totals:**
- New guide pages: 1 (Etihad Rail)
- New event pages (draft): 2 (DSF, Global Village)
- Calendar items (new dates in existing pages): ~14
- DB tables affected: events (2 inserts), calendar_pages (2 updates to dates_json), guides + steps (1 insert each)
- EN/RU workload: All items need EN; high-value items (Mawlid, Etihad Rail, DSF, Global Village, concerts) need RU
- QA: Build check + 4 route checks per new event page; calendar page render check
- Risk: LOW — all dates confirmed; no schema changes

---

## BATCH 2 — Days 31-90: September + October 2026
**Target window:** August 15 – October 15, 2026
**Focus:** Confirmed exhibitions, concerts, sports, comedy events for Sep-Oct

### B2-A: September 2026 calendar additions

| Candidate ID | Event | Date | Level | EN/RU |
|-------------|-------|------|-------|-------|
| SEP-02 | Dirty Dozen Brass Band (Abu Dhabi) | Sep 5 | A | EN only |
| SEP-06 | Dubai Derma | Sep 8-10 | A | EN only |
| SEP-09 | YUMMEX Middle East | Sep 15-17 | A | EN only |
| SEP-11 | Salon du Chocolat Dubai | Sep 22-24 | B | Both |
| SEP-13 | INDEX Dubai (interior design) | Sep 28-30 | B | Both |
| SEP-14 | The Hotel Show Dubai | Sep 28-30 | A | EN only |
| SEP-15 | RU'YA (careers fair) | Sep 28-30 | B | Both |
| SEP-18 | K-Pop Fever (Abu Dhabi) | Sep 26 | B | Both |
| TRN-02 | Etihad Rail Dubai Station open | Sep 30 | B | Both |

### B2-B: October 2026 calendar additions (major)

| Candidate ID | Event | Date | Level | Notes | EN/RU |
|-------------|-------|------|-------|-------|-------|
| OCT-01 | Dubai Fitness Challenge 2026 | Oct 31–Nov 29 | D | Create event page | Both |
| OCT-05 | CABSAT 2026 | Oct 5-7 | B | Media industry | EN only |
| OCT-07 | Mohandis Al Thauq Al Aam | Oct 9-10 | A | Arabic theatre | Both |
| OCT-08 | Jamie Lever (comedy) | Oct 10 | A | Dubai Comedy Fest | EN only |
| OCT-10 | Airport Show Dubai | Oct 12-14 | B | Aviation | EN only |
| OCT-11 | Munawar Faruqui | Oct 11 | A | Dubai Comedy Fest | EN only |
| OCT-12 | TJ Monterde & KZ Tandingan | Oct 11 | B | Filipino audience | Both |
| OCT-14 | Mo Gilligan | Oct 12 | A | Dubai Comedy Fest | EN only |
| OCT-16 | Alexander Merkul | Oct 15 | A | EN only |
| OCT-17 | Shane Todd | Oct 16 | A | Dubai Comedy Fest | EN only |
| OCT-20 | Amit Tandon | Oct 18 | A | Dubai Comedy Fest | EN only |
| OCT-21 | Vir Das | Oct 18 | B | Coca-Cola Arena, Indian audience | Both |
| OCT-25 | Blue — 25 Years of Hits | Oct 25 | B | Expo City Dubai | Both |
| OCT-26 | Russell Peters (Abu Dhabi) | Oct 25 | B | EN only |
| OCT-27 | NAJAH Connect education fair | Oct 25-27 | B | Both |
| OCT-29 | Jewellery, Gem & Technology | Oct 27-29 | B | Both |
| OCT-31 | Dubai Active + Muscle Show | Oct 30–Nov 1 | B | DFC sub-event | Both |
| OCT-33 | Air Expo Abu Dhabi | Oct 14-16 | B | EN only |
| OCT-34 | Global Village Season 31 | Mid-Oct TBC | D | PUBLISH when date confirmed | Both |
| OCT-35 | Riverdance 30th Anniversary | Oct 31–Nov 1 | B | Etihad Arena | Both |

### B2-C: Dubai Comedy Festival — hub page
**Action:** Create /events/dubai-comedy-festival-2026 (Level C)
**Events to include:** Mo Gilligan, Vir Das, Munawar Faruqui, Jamie Lever, Shane Todd, Amit Tandon, others TBC
**EN/RU:** EN priority; RU if Hindi/Russian comedy acts are added

**Batch 2 totals:**
- Event pages: 2 (DFC, Dubai Comedy Festival)
- Calendar items: ~28
- DB tables: events (2 inserts), calendar_pages (2 updates)
- EN/RU: High-value items need RU; trade shows EN only
- Risk: LOW — all dates confirmed from verified sources

---

## BATCH 3 — Days 91-180: November + December 2026
**Target window:** October 15 – December 5, 2026
**Focus:** November concert season, December mega-events, DSF launch, Chicago Musical

### B3-A: November 2026 calendar additions (missing)

| Candidate ID | Event | Date | Level | Notes | EN/RU |
|-------------|-------|------|-------|-------|-------|
| NOV-05 | Jony | Nov 4 | B | **RU audience CRITICAL** | Both (RU priority) |
| NOV-11 | American Ballet Theatre (Abu Dhabi) | Nov 20 | B | EN only |
| NOV-13 | Offlimits (Shakira + Jonas Brothers) | Nov 21 | C | Flagship Abu Dhabi event | Both |
| NOV-16 | Spinneys 92 Cycle build-up ride | Nov 23 | A | Sport/lifestyle | EN only |
| NOV-17 | Algarabia | Nov 26 | A | Abu Dhabi cultural | EN only |
| NOV-20 | Tarkan (Abu Dhabi debut) | Nov 27 | B | Turkish artist — consider audience | Both |
| NOV-21 | Emirates Dubai 7s rugby | Nov 27-29 | B | Sports | Both |
| NOV-22 | Verdi Opera Gala | Nov 29 | A | Abu Dhabi classical | EN only |
| NOV-23 | Benjamin Clementine | Nov 1 | A | Dubai Opera | EN only |

### B3-B: December 2026 calendar additions (missing)

| Candidate ID | Event | Date | Level | Notes | EN/RU |
|-------------|-------|------|-------|-------|-------|
| DEC-02 | Andrea Bocelli (Yasalam Classics) | Dec 2 | B | Abu Dhabi, F1 adjacent | Both |
| DEC-07 | Dubai Shopping Festival 31 launch | Dec 5 | D | PUBLISH event page | Both |
| DEC-13 | Chicago the Musical | Dec 16-20 | C | Resolves Jun HOLD | Both |
| DEC-14 | Etihad Rail Al Dhafra stations | Dec 30 | B | Transport milestone | Both |
| DEC-15 | Dhafer Youssef | Dec 19 | A | Abu Dhabi arts | EN only |
| DEC-16 | NYE Burj Khalifa | Dec 31 | C | Publish when Emaar confirms | Both |

### B3-C: Event page upgrades

| Event | Current status | Upgrade action |
|-------|---------------|----------------|
| ADIPEC 2026 | Calendar item | Upgrade to Level C event page |
| Dubai Design Week 2026 | Event page ✓ | Add internal links to November calendar |
| F1 Abu Dhabi + Yasalam | Event page ✓ | Add Andrea Bocelli as Yasalam section |

**Batch 3 totals:**
- Event pages (new/publish): 3 (DSF, Chicago, NYE Burj Khalifa)
- Event page upgrades: 1 (ADIPEC → Level C)
- Calendar items: ~15
- EN/RU: Jony and Offlimits are highest-priority for RU
- Risk: LOW-MEDIUM — DSF and NYE need confirmed performers before publishing details

---

## BATCH 4 — 2027 confirmed events
**Target window:** October 2026 – January 2027
**Focus:** January 2027 page, February and March pages, confirmed early-2027 events

### B4-A: New calendar pages needed

| Page | Slug | Events | Priority |
|------|------|--------|----------|
| January 2027 | /calendar/january-2027-dubai-calendar | WHX Dubai, DSF end, Tamaas, Light+IB | P0 |
| February 2027 | /calendar/february-2027-dubai-calendar | MRO, Ramadaniyat, Marathon, Tennis | P1 |
| March 2027 | /calendar/march-2027-dubai-calendar | Gulfood, Arabplast, Etihad Rail Sharjah, Tribute Ziad Rahbani, Ramadan | P1 |

### B4-B: January 2027 event items

| Candidate ID | Event | Date | Level | EN/RU |
|-------------|-------|------|-------|-------|
| JAN27-03 | WHX Dubai (Arab Health) | Jan 25-28 | C | Both |
| JAN27-02 | Light + Intelligent Building ME | Jan 12-14 | B | EN only |
| JAN27-04 | Tamaas Festival (free, Abu Dhabi) | Jan 29 | A | Both |
| JAN27-05 | OMEGA Dubai Desert Classic (golf) | Jan TBC | B | Both (when confirmed) |

### B4-C: February + March 2027 event items

| Candidate ID | Event | Date | Level | EN/RU |
|-------------|-------|------|-------|-------|
| FEB27-01 | MRO Middle East | Feb 2-3 | A | EN only |
| FEB27-02 | Ramadaniyat (Abu Dhabi) | Feb 17 | A | Both |
| FEB27-03 | Dubai Marathon | Feb TBC | B | Both |
| MAR27-01 | Gulfood 2027 | Mar 15-19 | C | Both |
| MAR27-03 | Etihad Rail Sharjah Station | Mar 30 | B | Both |
| MAR27-04 | Tribute to Ziad Rahbani | Mar 26 | A | Both |
| MAR27-05 | Ramadan 2027 (when confirmed) | ~Mar 17 | E | Both |

**Batch 4 totals:**
- New calendar pages: 3 (Jan/Feb/Mar 2027)
- Event pages: 1 (WHX Dubai / Arab Health)
- Calendar items: ~12
- Risk: LOW — all confirmed dates; new pages with new slugs (no conflicts)

---

## BATCH 5 — Long-tail and niche coverage
**Target window:** Ongoing, as capacity allows
**Focus:** Secondary exhibitions, smaller concerts, niche audiences, Abu Dhabi arts, Sharjah events

### B5 candidates

| Event | Category | Level | Priority |
|-------|----------|-------|----------|
| Untitled 14km (dance, Abu Dhabi) | Arts/dance | A | P3 |
| Marilyne Naaman (Dubai Opera) | Concert | A | P3 |
| Nass (dance, Abu Dhabi) | Dance/arts | A | P3 |
| Sondra Radvanovsky (Abu Dhabi Festival) | Classical | A | P3 |
| John Achkar (Dubai Opera) | Arabic theatre | A | P3 |
| AeroEngines MENA (Abu Dhabi) | B2B conference | A | P3 |
| ArabLab Expo | Lab/science trade | A | P3 |
| Dubai Derma (already listed) | Healthcare beauty | A | P3 |
| Spinneys 92 Cycle (build-up) | Sport | A | P3 |
| Algarabia (Abu Dhabi) | Flamenco/arts | A | P3 |
| Tamaas Festival (free, Abu Dhabi) | Arts/music | A | P2 |
| Lisa Batiashvili (classical, Abu Dhabi) | Classical | A | P3 |
| Minsoo Sohn (classical, Abu Dhabi) | Classical | A | P3 |
| Dhafer Youssef (Abu Dhabi) | Jazz | A | P3 |
| Verdi Opera Gala (Abu Dhabi) | Classical | A | P3 |
| MyPlant & Garden ME (DWTC) | B2B | A | P3 |
| RAK Art Festival 2026 | Arts | B | P2 — when date confirmed |
| Sharjah Book Fair 2026 | Culture | B | P1 — already partial |
| Abu Dhabi Festival full programme | Culture | B | P2 |
| Gulf Print & Pack | B2B | A | P4 |
| ArabLab | B2B | A | P3 |
| Arabplast 2027 | B2B | A | P3 |

**Batch 5 totals:**
- Calendar items: ~25
- Event pages: 0 (all Level A—B, calendar-only)
- Risk: LOW

---

## BATCH 6 — Architecture and evergreen hubs
**Target window:** Q4 2026 – Q1 2027
**Focus:** Cluster hubs, venue hubs, evergreen guides

### B6 candidates

| Hub | URL | Action | Priority |
|-----|-----|--------|----------|
| Etihad Rail guide (done in B1) | /guides/etihad-rail-dubai | Level D full cluster | P0 |
| UAE Public Holidays 2026-27 guide | /guides/uae-public-holidays-2026 | Level E live intelligence | P0 |
| Dubai Shopping Festival (done in B3) | /events/dubai-shopping-festival-2026 | Level D | P0 |
| Global Village Season 31 (done in B1) | /events/global-village-dubai-season-31 | Level D | P0 |
| Concerts in Dubai 2026 hub | /calendar (enhanced) | Add to existing pages | P1 |
| Dubai Comedy Festival 2026 (done in B2) | /events/dubai-comedy-festival-2026 | Level C | P1 |
| January 2027 calendar (done in B4) | /calendar/january-2027-dubai-calendar | New page | P0 |
| ItemList schema on calendar pages | All month pages | Schema implementation | P2 |
| FAQPage schema on DSF, Etihad Rail, DFC | Event/guide pages | Schema implementation | P2 |

---

## Implementation sequencing — week-by-week priority

### Week 1 (Jul 14-21)
- Etihad Rail guide (draft EN)
- Mawlid Al Nabawi August calendar item
- July 2026 calendar: add 4 missing concerts (JUL-05 through JUL-08)

### Week 2 (Jul 21-28)
- Etihad Rail guide (EN complete + RU draft)
- August 2026 calendar: add 6 missing items (AUG-01 through AUG-09)
- Dubai Shopping Festival event page (draft, status: announced)
- Global Village Season 31 (draft, status: expected)

### Week 3 (Jul 28 – Aug 4)
- Publish Etihad Rail guide (if QA passes)
- Publish DSF event page (draft)
- September 2026 calendar: begin adding 9 missing items

### Week 4 (Aug 4-11)
- September 2026 calendar: complete additions
- Dubai Comedy Festival hub page (draft)
- Etihad Rail Sep 30 calendar item (publish when Sep approaches)

### Weeks 5-8 (Aug 11 – Sep 7)
- October 2026 calendar: add 20 missing items
- Dubai Fitness Challenge event page
- Watch for Global Village official date announcement

### Weeks 9-12 (Sep 7 – Oct 4)
- November 2026 calendar: add 9 missing items
- Publish Global Village page (when date confirmed)
- Begin 2027 calendar page creation

### Q4 2026 (Oct-Dec)
- December 2026 calendar: add 6 missing items
- Publish DSF page fully when performers announced
- Chicago the Musical calendar item
- NYE event page (when Emaar announces)
- January 2027 calendar page launch

---

## Per-batch risk assessment

| Batch | Risk level | Main risks | Mitigation |
|-------|------------|-----------|------------|
| 1 | LOW | Mawlid date could shift (moon sighting) | Mark as "expected" until government confirms; publish with caveat |
| 2 | LOW | DFC exact dates confirmed; all concerts confirmed | Verify DFC start date (Oct 31 vs Nov 1 discrepancy in some sources) |
| 3 | LOW-MEDIUM | DSF performers not announced; NYE not confirmed | Draft pages; publish structure now, add content when announced |
| 4 | LOW | All 2027 dates from official sources | Cross-check closer to dates |
| 5 | LOW | Long-tail events — verify they haven't changed | Re-verify 30 days before each event |
| 6 | MEDIUM | Schema requires developer implementation | Coordinate with build testing |

---

## Editorial workload estimate

| Batch | New EN content items | New RU content items | Hours (estimate) |
|-------|---------------------|---------------------|-----------------|
| 1 | 17 (guide + 2 event pages + 14 calendar items) | 10 | 8-12 hours |
| 2 | 30 calendar items + 2 event pages | 12 | 10-15 hours |
| 3 | 15 calendar items + 3 event pages | 8 | 8-12 hours |
| 4 | 12 items + 3 calendar pages + 1 event page | 6 | 6-8 hours |
| 5 | 22 calendar items | 5 | 5-8 hours |
| 6 | Architecture only | 4 hub updates | 4-6 hours |
| **Total** | **~99 items** | **~45 items** | **~41-61 hours** |

---

## QA checklist for every batch

Before marking a batch complete:
- [ ] Build passes 0 TypeScript errors
- [ ] All pages generate (no 404 in build output)
- [ ] New event pages: HTTP 200, correct `<title>`, meta description ≤155 chars, canonical URL correct
- [ ] New calendar items: appear on correct month page, correct date display
- [ ] EN/RU parity: RU items use natural Russian, no machine-translated official names, dates in dd month format
- [ ] No October 13-17 dates for GITEX (safety rule from Phase 6C-CALENDAR-CTR-OPT-01)
- [ ] No invented performers, fees, or claims not from verified sources
- [ ] All new event pages have at least one internal link to the relevant month calendar
- [ ] Mawlid Al Nabawi: marked as public holiday for both public AND private sector
- [ ] Etihad Rail guide: dates for each station opening clearly marked as confirmed vs expected

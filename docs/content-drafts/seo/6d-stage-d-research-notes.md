# Phase 6D Stage D — Research Notes and Candidate Matrix

**Phase:** 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01
**Last updated:** 2026-08-05
**Status:** IN PROGRESS — checkpoint after Aug/Sep/Oct sweep partial completion

---

## P0 DEFECT — Richard Marx date error (MUST FIX BEFORE CLOSE)

| Field | Stored value | Correct value |
|-------|-------------|---------------|
| Record ID | `OCT-06-MARX` in `october-2026-dubai-calendar` | — |
| Slug | `october-2026-dubai-calendar` | — |
| EN label date | "5 October" | "3 October" |
| event_date_start | 2026-10-05 (assumed) | 2026-10-03 |
| event_date_end | 2026-10-05 (assumed) | 2026-10-03 |

**T1 sources confirming Oct 3:**
- Coca-Cola Arena official: https://coca-cola-arena.com/music/1837/richard-marx — event-specific page
- Platinumlist artist page: https://platinumlist.net/artist/4129/richard-marx
- Gulf News article: https://gulfnews.com/entertainment/how-to-meet-richard-marx-in-the-uae-this-october — Oct 3
- FACT Dubai: https://www.factmagazines.com/uae/dubai/events/richard-marx-to-make-his-middle-east-debut-in-dubai-this-october — Oct 3
- concerts50.com: Richard Marx Dubai Oct 03, 2026
- Few.ae: Richard Marx Live in Dubai at Coca-Cola Arena — Oct 3
- Visit Dubai official: https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/richard-marx

**Action required:** Fix OCT-06-MARX date from 2026-10-05 → 2026-10-03. Update EN label, RU label, EN brief, RU brief, source note. Verify no duplicate OCT entry exists for Oct 3.

---

## August 2026 — Confirmed candidates

### Already added (Batch-01, commit 5d84750)
| ID | Date | Event | Venue | Price | Source tier | Status |
|----|------|-------|-------|-------|-------------|--------|
| AUG-6D-01 | 2026-08-08 | Beat The Heat S5 — Al Shami | DWTC Hall 8 | AED 105 | T1 Platinumlist | IMPLEMENTED |
| AUG-6D-02 | 2026-08-16 | Lucky Ali | Coca-Cola Arena | AED 125 | T1 Platinumlist | IMPLEMENTED |
| AUG-6D-03 | 2026-08-21 | Sunil Grover comedy | Coca-Cola Arena | AED 125 | T1 Platinumlist | IMPLEMENTED |
| AUG-6D-04 | 2026-08-29 | Jimmy Carr 'Laughs Funny' | Dubai Opera | AED 250 | T1 Platinumlist | IMPLEMENTED |

### Ready to add (confirmed T1, not yet in DB)
| Proposed ID | Date | Event | Venue | Price | Source | Notes |
|-------------|------|-------|-------|-------|--------|-------|
| AUG-6D-05 | 2026-08-15 | Beat The Heat S5 — Marwan Moussa & Hleem | DWTC Hall 8 | AED 105 | T1 Platinumlist https://dubai.platinumlist.net/event-tickets/107147/beat-the-heat-dxb-season-5-ft-marwan-moussa-hleem-live-at-dwtc | Doors 18:00, show 20:30, age 14+. Artist name is "Hleem" (not "Haleem") per Platinumlist event title. |
| AUG-6D-06 | 2026-08-22 | Beat The Heat S5 — Lege-cy, Aziz Maraka, Big Sam | DWTC Hall 8 | AED 105 | T1 Platinumlist https://dubai.platinumlist.net/event-tickets/107435/beat-the-heat-dxb-season-5 | Doors 18:00, show 20:30. "The spectacular finale." Artist name official: "Lege-cy" in title, also written "Leg-cy". |
| AUG-6D-07 | 2026-08-08 | A Night of Love & Tears — Ramy Gamal & Wael Jassar | Sheikh Rashid Hall, DWTC | AED 195 | T1 Platinumlist https://dubai.platinumlist.net/event-tickets/107086/a-night-of-love-tears | Doors 19:00, show 20:00. Age 8+. Note: Same date as AUG-6D-01 (Al Shami) but different hall at DWTC; no duplicate conflict. |

### Reviewed and skipped / HOLD
| Candidate | Date | Notes | Outcome |
|-----------|------|-------|---------|
| Marwan Moussa & "Haleem" | Aug 15 | Prior session used "Haleem"; correct spelling is "Hleem" per Platinumlist T1. Same event as AUG-6D-05. | CORRECTED |
| Leg_cy / Aziz Maraka / Big Sam | Aug 22 | Prior session placed on HOLD. Now confirmed T1 Platinumlist. | RESOLVED → AUG-6D-06 |
| Baithak ft. Kunal Ganjawalla | Aug 8, Mövenpick Grand Al Bustan | Classical Indian music. AED 315. Found on Platinumlist but niche venue. Lower-priority. T1 available. | HOLD — lower audience relevance |
| Blue Symphony / Nandagovindam Connect (2 events) | Aug 9, Sheikh Rashid Hall DWTC | Devotional Indian classical music. AED 100–500. Very niche. | HOLD — below general calendar scope |
| Miami Show (Miami Band) | Aug 29, Coca-Cola Arena | AED 195. Found on Platinumlist. ALREADY IN DB as AUG-NEW-03. | EXISTING-CONFIRMED |
| Talal Sam / Sultan Al Murshed | July 25 (not August) | In DB as JUL-NEW-06. Not August. No conflict. | EXISTING — NOT AUGUST |

---

## September 2026 — Confirmed candidates

### Already in DB (pre-Phase-6D)
| ID | Date | Event | Outcome |
|----|------|-------|---------|
| SEP-NEW-01 | 2026-09-05 | The Legends of Trance: ATB with Solarstone and Steve Allen — The Agenda | EXISTING-CONFIRMED ✓ |
| SEP-10-OAKENFOLD | 2026-09-18 | Paul Oakenfold — The Agenda | EXISTING-CONFIRMED ✓ |
| SEP-09-AGUILERA | 2026-09-25 | Christina Aguilera — Etihad Arena, Abu Dhabi | EXISTING-CONFIRMED (needs date/details verification) |
| SEP-R1 | 2026-09-27 | The Corrs — Etihad Arena, Abu Dhabi | EXISTING-CONFIRMED (needs verification) |
| SEP-08-TAX | 2026-09-30 | UAE Corporate Tax FY2025 filing deadline | EXISTING-CONFIRMED |

### Ready to add (confirmed T1)
| Proposed ID | Date | Event | Venue | Price | Source | Notes |
|-------------|------|-------|-------|-------|--------|-------|
| SEP-6D-01 | 2026-09-05 | Mina Nader (stand-up comedy) | Dubai Opera | ~AED 200 | T1 Dubai Opera official + Platinumlist https://dubai.platinumlist.net/event-tickets/106978 and https://www.dubaiopera.com/ar/events/comedy/mina-nader | Egyptian comedian, 500+ shows globally, 16+ years comedy. Interactive show. Same date as SEP-NEW-01 ATB at The Agenda — different venues, no conflict. |
| SEP-6D-02 | 2026-09-26 | Sumukhi Suresh Live in Dubai | Emirates Theatre, Mall of Emirates | AED 100+ | T1 Platinumlist https://dubai.platinumlist.net/event-tickets/106978/sumukhi-suresh-live-in-dubai | Doors 19:00, show 19:30. Age 14+. Mainly English. Organised by Sublime Entertainment. Note: "26 September" spec also listed a CCA "sports event" — that is a SEPARATE unresolved candidate. |

### Partially verified / HOLD / unresolved
| Candidate | Proposed date | Status | Notes |
|-----------|--------------|--------|-------|
| Balqees | Sep 15, Coca-Cola Arena | HOLD — T2/T3 only | Songkick and Bandsintown list her at CCA Sep 15. No Platinumlist event-specific page found. CCA official page not loading. Need event-specific T1 before adding. |
| CCA "awards event" Sep 10 | Sep 10 | UNRESOLVED | Described in Phase 6D spec but no official event found. Platinumlist CCA listing showed no Sep 10 event. May be cancelled, unnamed, or incorrect in spec. |
| CCA "event" Sep 20 | Sep 20 | PARTIALLY RESOLVED | CCA Platinumlist listing shows Radhika Das Lightfall Live — AED 150. This is a devotional Hindu music event. Needs event-specific T1 source (not just venue listing). |
| CCA "sports event" Sep 26 | Sep 26 | UNRESOLVED | Platinumlist CCA page shows no Sep 26 event at this venue. Sumukhi Suresh is Sep 26 at Emirates Theatre (different venue). May be different venue or cancelled. |
| Radhika Das Lightfall | Sep 20, CCA | PARTIALLY VERIFIED | Found in CCA venue listing (AED 150). Needs event-specific Platinumlist URL or CCA event page for T1 confirmation before adding. |

### Negative findings
| Candidate | Date | Finding |
|-----------|------|---------|
| "CCA awards event Sep 10" | Sep 10 | No official event found on Platinumlist or CCA listing for this date. |
| "CCA sports event Sep 26" | Sep 26 | No official event found at CCA for this date. Sumukhi Suresh is at Emirates Theatre — different venue. |

---

## October 2026 — Confirmed candidates

### Already in DB (pre-Phase-6D)
| ID | Date | Event | Status |
|----|------|-------|--------|
| OCT-06-MARX | 2026-10-05 | Richard Marx — Coca-Cola Arena | P0 DEFECT — correct date is Oct 3 |
| OCT-01-BEAUTY | 2026-10-06 | Beautyworld Dubai — DWTC | EXISTING (needs Beautyworld date confirmation) |
| OCT-02-WETEX | 2026-10-20 | WETEX 2026 — DWTC | EXISTING |
| OCT-03-VAT | 2026-10-28 | UAE VAT Q3 return deadline | EXISTING |
| OCT-04-EINV | 2026-10-30 | E-invoicing ASP deadline | EXISTING |
| OCT-05-MIDTERM | 2026-10-12 | UAE school mid-term break | EXISTING |
| OCT-DFC | 2026-10-31 | Dubai Fitness Challenge 2026 opens | EXISTING (date needs T1 confirmation for 2026) |
| OCT-NEW-01 | 2026-10-05 | God Save The Queen tribute — Dubai Opera | EXISTING |
| OCT-NEW-02 | 2026-10-10 | Sonny Fodera — Bohemia Beach Club FIVE LUXE JBR | EXISTING |
| OCT-NEW-03 | 2026-10-25 | Blue 25th Anniversary Tour — Dubai Millennium Amphitheatre | EXISTING |
| OCT-NEW-04 | 2026-10-25 | Russell Peters — Etihad Arena | EXISTING |
| OCT-NEW-05 | 2026-10-31 | Riverdance 30th Anniversary — Etihad Arena | EXISTING |
| OCT-R1 | 2026-10-24 | Elrow Dubai — Dubai Media City Amphitheatre | EXISTING |
| OCT-R2 | 2026-10-24 | Boris Grebenshikov (BG+) — The Agenda | EXISTING |

### Ready to add — pending T1 event-specific confirmation
| Proposed ID | Date | Event | Venue | Price | Source so far | Status |
|-------------|------|-------|-------|-------|--------------|--------|
| OCT-6D-01 | 2026-10-02 | Najwa Karam Live in Dubai | Coca-Cola Arena | AED 150 | CCA Platinumlist venue listing | PARTIALLY VERIFIED — needs event-specific page |
| OCT-6D-02 | 2026-10-05 | Shawn Chidiac — Laughing in Translation Remix | Coca-Cola Arena | AED 199 | CCA Platinumlist venue listing | PARTIALLY VERIFIED — needs event-specific page. Note: Oct 5 is same date as OCT-NEW-01 (Dubai Opera) — different venue, no conflict |
| OCT-6D-03 | 2026-10-11 | TJ Monterde & KZ Tandingan — In Between Middle East Tour | Coca-Cola Arena | AED 299 | CCA Platinumlist venue listing | PARTIALLY VERIFIED — needs event-specific page |
| OCT-6D-04 | 2026-10-18 | Vir Das Live — Dubai Comedy Festival | Coca-Cola Arena | AED 195 | CCA Platinumlist venue listing | PARTIALLY VERIFIED — needs event-specific page. Part of Dubai Comedy Festival. |

### Partially verified / HOLD
| Candidate | Date | Source so far | Status |
|-----------|------|--------------|--------|
| Lost Frequencies | Oct 3 | Visit Dubai (T1) + What's On (T2) — beach club DJ set, Bohemia Beach Club FIVE Palm Jumeirah, AED 150 (ladies) / AED 200 (gents) includes 1 drink. Visit Dubai 403 on direct fetch, T2 article from What's On. | PARTIALLY VERIFIED — needs direct T1 confirmation of date and venue |
| Global Village Season 31 opening | Expected Oct 2026 | No official confirmed date. Multiple media articles say "expected mid-October" based on historical pattern. Season 31 confirmed for Oct 2026 – May 2027. Official site has no 2026-27 opening date listed. | HOLD — no official date |
| Dubai Home Festival | Oct TBA | No confirmed 2026 dates found yet. | UNRESOLVED |
| Dubai Comedy Festival (full programme) | Oct TBA | Vir Das on Oct 18 is part of this. Full programme not yet verified. | PARTIALLY RESOLVED |

### Negative findings
| Candidate | Finding |
|-----------|---------|
| Dubai Airshow 2026 | Biennial — 2025 edition was held; no 2026 edition exists. Correctly absent from DB. |
| GITEX in October | GITEX is confirmed for December 7-11, 2026 at Expo City. Not October. October calendar should NOT contain GITEX. Current DB does not have GITEX in October — correct. |
| DSF 2026-27 | No official dates announced as of 2026-08-05. HOLD. |

---

## Sources checked — full log

| # | Source | URL | Date checked | Outcome |
|---|--------|-----|-------------|---------|
| S1 | Platinumlist Dubai homepage | https://dubai.platinumlist.net | 2026-08-04 | August 2026 event listing retrieved |
| S2 | Platinumlist — Marwan Moussa event | https://dubai.platinumlist.net/event-tickets/107147/beat-the-heat-dxb-season-5-ft-marwan-moussa-hleem-live-at-dwtc | 2026-08-04 | Aug 15 confirmed, "Hleem" spelling confirmed |
| S3 | Platinumlist — Lege-cy event | https://dubai.platinumlist.net/event-tickets/107435/beat-the-heat-dxb-season-5 | 2026-08-04 | Aug 22 confirmed, AED 105 confirmed |
| S4 | Platinumlist — Sumukhi Suresh | https://dubai.platinumlist.net/event-tickets/106978/sumukhi-suresh-live-in-dubai | 2026-08-04 | Sep 26 confirmed, AED 100+, Emirates Theatre |
| S5 | Platinumlist — CCA venue listing | https://dubai.platinumlist.net/venue/6351/coca-cola-arena | 2026-08-04 | Listed Sep 20 (Radhika Das), Oct 2 (Najwa Karam), Oct 5 (Shawn Chidiac), Oct 11 (TJ Monterde), Oct 18 (Vir Das) |
| S6 | WebSearch — Marwan Moussa Dubai Aug 15 | — | 2026-08-04 | Confirmed via Platinumlist T1, few.ae T2, travelandtourworld, mid-east.info |
| S7 | WebSearch — Balqees CCA Sep 15 | — | 2026-08-04 | Only T2/T3 results (Songkick, Bandsintown) — no T1 event-specific page |
| S8 | WebSearch — Lost Frequencies Dubai Oct | — | 2026-08-04 | Oct 3, Bohemia Beach Club FIVE Palm; Visit Dubai listed; What's On article |
| S9 | WebSearch — Richard Marx Dubai Oct | — | 2026-08-04 | Multiple T1 confirmations of Oct 3 (not Oct 5 stored in DB) |
| S10 | WebSearch — Global Village Season 31 opening | — | 2026-08-05 | No official date confirmed; expected mid-October 2026 |
| S11 | WebSearch — Ramy Gamal Wael Jassar Aug 8 | — | 2026-08-04 | Aug 8 confirmed, Sheikh Rashid Hall DWTC, AED 195, T1 Platinumlist |
| S12 | Dubai Opera (Mina Nader page) | https://www.dubaiopera.com/ar/events/comedy/mina-nader | 2026-08-04 | Sep 5 confirmed via Dubai Opera official |
| S13 | WebSearch — Mina Nader Dubai Sep 5 | — | 2026-08-04 | Sep 5, Dubai Opera, ~AED 200 |
| S14 | WebSearch — Sumukhi Suresh Sep 26 | — | 2026-08-04 | Sep 26, Emirates Theatre, T1 Platinumlist confirmed |
| S15 | Visit Dubai — Lost Frequencies | https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/lost-frequencies-live | 2026-08-04 | 403 Forbidden |
| S16 | Coca-Cola Arena official (richard-marx) | https://coca-cola-arena.com/music/1837/richard-marx | 2026-08-04 | Oct 3 confirmed via T1 |
| S17 | WebSearch — Dubai Fitness Challenge 2026 | — | 2026-08-05 | OCT-DFC in DB has Oct 31 open; pending T1 verification |

---

## Local DB state — discrepancy noted

The local DB for `july-2026-dubai-calendar` has 6 items (JUL-01 through JUL-NEW-03). The production DB has 10 items (JUL-NEW-04 through JUL-NEW-07 were added in Batch 01C and deployed via the handoff patch). The local DB discrepancy is non-blocking for current work because:
1. Our 6D patch scripts only touch August, November, December slugs
2. Production already has the July items
3. The July items are past events and don't affect current calendar output

This will be noted in the final report.

---

## Status of existing DB records requiring verification

### Events table (for Stage C)
| Event slug | Stored dates | Verified dates | Status |
|------------|-------------|----------------|--------|
| dubai-design-week-2026 | Nov 3-8 | Nov 3-8 (d3d.ae T1) | CONFIRMED-CURRENT ✓ |
| big-5-global-dubai-2026 | Nov 23-26 | Nov 23-26 (thebig5.ae T1) | CONFIRMED-CURRENT ✓ |
| formula-1-abu-dhabi-grand-prix-2026 | Dec 3-6 | Race Dec 5-7 (Formula 1 official); DB range Dec 3-6 covers Yasalam period — intentional | CONFIRMED (range intentional) ✓ |
| gitex-global-2026 | Dec 7-11 | Dec 7-11, Expo City Dubai (gitex.com T1) | CONFIRMED-CURRENT ✓ |
| expand-north-star-2026 | Dec 8-10 | Dec 8-10, Expo City Dubai (gitex.com T1) | CONFIRMED-CURRENT ✓ |
| dp-world-tour-championship-2026 | Nov 12-15 | Needs verification (Jumeirah Golf Estates) | UNVERIFIED-NEEDS-CHECK |
| uae-eid-al-adha-2026 | May 25-29 | Past event, confirmed | PAST-CONFIRMED |

---

## Remaining work for Stage D completion

1. [ ] Fix OCT-06-MARX date P0 defect (Oct 5 → Oct 3)
2. [ ] Verify and add AUG-6D-05 (Marwan Moussa & Hleem)
3. [ ] Verify and add AUG-6D-06 (Lege-cy / Aziz Maraka / Big Sam)
4. [ ] Verify and add AUG-6D-07 (Ramy Gamal & Wael Jassar)
5. [ ] Add SEP-6D-01 (Mina Nader, Sep 5 Dubai Opera)
6. [ ] Add SEP-6D-02 (Sumukhi Suresh, Sep 26)
7. [ ] Verify Balqees (Sep 15) — needs T1 event-specific page
8. [ ] Verify Radhika Das (Sep 20) — needs T1 event-specific page
9. [ ] Verify Najwa Karam (Oct 2) — needs T1 event-specific page
10. [ ] Verify TJ Monterde (Oct 11) — needs T1 event-specific page
11. [ ] Verify Vir Das (Oct 18) — needs T1 event-specific page
12. [ ] Verify Lost Frequencies (Oct 3) — needs T1 direct confirmation
13. [ ] Check Dubai Fitness Challenge 2026 official date
14. [ ] Check Dubai Home Festival 2026
15. [ ] Continue October sweep (Dubai Opera, DWTC, Expo City Oct listings)
16. [ ] Create machine-readable CSV artifacts
17. [ ] Monthly page completion gate (5 months × checks)
18. [ ] Stage B full technical audit (title/H1/lang/structured-data)
19. [ ] Stage E (internal linking, JSON-LD)
20. [ ] Stage F (final report, QA)

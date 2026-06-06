# UAE Calendar Batch 2B Pre-Import Review
## Phase 6C-97B | Date: 2026-06-06

---

## Scope

13 operations: 12 new inserts + 1 label/brief update on existing DEC-NEW-01.
Months affected: September, October, November, December.

---

## Current item counts (local DB confirmed)

| Month | Current items | Expected after Batch 2B |
|-------|--------------|------------------------|
| September 2026 | 11 | 12 |
| October 2026 | 11 | 13 |
| November 2026 | 6 | 14 |
| December 2026 | 6 | 7 (+ 1 existing item updated) |

---

## Item-by-item review

---

### SEP-R1 — The Corrs at Etihad Arena, Abu Dhabi, September 27, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS — 5 sources |
| Source URLs | gulfnews.com (confirmed), timeoutabudhabi.com, whatson.ae, The Filipino Times (Jun 1 2026), etihadarena.ae | PASS |
| **Source URL fix** | Candidate pack listed wrong URL (Hussain Al Jasmi event URL). Correct source: gulfnews.com article + etihadarena.ae/en/events | **FIXED in script** |
| Allowed claims | Date Sep 27, Etihad Arena Abu Dhabi, concert, Live Nation ME | PASS |
| Blocked claims | Setlist, support acts | None in brief |
| Date | 2026-09-27 | PASS |
| Emirate | Abu Dhabi | PASS — clearly labelled |
| Venue | Etihad Arena, Yas Island, Abu Dhabi | PASS |
| Category/type | festival / trade_show | PASS |
| Short label EN | The Corrs | PASS |
| Short label RU | The Corrs | PASS |
| Detail URL | null (calendar-only) | PASS |
| CTA URL | etihadarena.ae/en/events | PASS |
| noindex_after | 2026-09-28 | PASS |
| Duplicate check | No existing SEP item with this ID or date | PASS |
| September existing at Sep 27 | None | No conflict |
| Decision | **IMPORT** |

---

### OCT-R1 — Elrow Dubai at Dubai Media City Amphitheatre, October 24, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | MULTI_SOURCE_CONFIRMED | PASS |
| Source URLs | elrowdubai.com (official), whatson.ae (rescheduled to Oct 24), gulfbuzz.com, elrow.com global | PASS |
| Allowed claims | Oct 24, Dubai Media City Amphitheatre, Nowmads theme, 12,000+ capacity, rescheduled | PASS |
| Blocked claims | Specific lineup announcements (not yet named for Oct version) | None in brief |
| Date | 2026-10-24 | PASS |
| Emirate | Dubai | PASS |
| Venue | Dubai Media City Amphitheatre, Dubai | PASS |
| Short label EN | Elrow Dubai | PASS |
| Short label RU | Elrow Дубай | PASS |
| Detail URL | null | PASS |
| noindex_after | 2026-10-25 | PASS |
| Duplicate check | No existing OCT item at Oct 24 except: OCT-05-MIDTERM (Oct 12-18), OCT-02-WETEX (Oct 20), OCT-03-VAT (Oct 28) | No conflict |
| Decision | **IMPORT** |

---

### OCT-R2 — Boris Grebenshikov at The Agenda Dubai, October 24, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | MULTI_SOURCE_CONFIRMED | PASS |
| Source URLs | dubai.platinumlist.net/event-tickets/104708/boris-grebenshikov-at-the-agenda-dubai, Songkick, comingsoon.ae, theagenda.com (official venue), Instagram | PASS |
| Allowed claims | Oct 24, The Agenda Dubai Media City, BG+ project, first Dubai concert | PASS |
| Blocked claims | Exact setlist, specific guest artists | None overclaimed |
| Date | 2026-10-24 | PASS |
| Emirate | Dubai | PASS |
| Venue | The Agenda, Dubai Media City | PASS |
| Short label EN | Boris Grebenshikov | PASS |
| Short label RU | Гребенщиков (BG) | PASS |
| Detail URL | null | PASS |
| noindex_after | 2026-10-25 | PASS |
| Duplicate check | Same date as OCT-R1 (Elrow) — different venue (The Agenda vs Dubai Media City Amphitheatre). Both are in Dubai Media City area but separate events, separate audiences | PASS — no duplicate |
| Decision | **IMPORT** |

---

### NOV-R1 — Dubai Ride (DFC opener), November 1, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | dubairide.com (official Dubai Ride website, date "1 November 2026" confirmed) | PASS |
| Treatment note | This is Dubai Ride (the specific cycling event), not generic "Dubai Fitness Challenge." dubairide.com is a dedicated official site — not the problematic dubaifitnesschallenge.com (403). | PASS |
| Allowed claims | Nov 1, citywide cycling route, DFC opener, annual event | PASS |
| Date | 2026-11-01 | PASS |
| Emirate | Dubai | PASS |
| Short label EN | Dubai Ride | PASS |
| Short label RU | Dubai Ride | PASS |
| noindex_after | 2026-11-02 | PASS |
| Duplicate check | No existing NOV item at Nov 1 | No conflict |
| Decision | **IMPORT** |

---

### NOV-R2 — ANOTR at FIVE LUXE JBR (Playa Pacha), November 13, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | MULTI_SOURCE_CONFIRMED | PASS |
| Source URLs | pachaicons.com/dubai/events/131126-anotr-five-luxe (organizer), Songkick (Nov 13 FIVE LUXE JBR), Ticketmaster.com (ANOTR 2026 tour) | PASS |
| Allowed claims | Nov 13, Playa Pacha FIVE LUXE JBR, Pacha ICONS, 7:00 PM | PASS |
| Date | 2026-11-13 | PASS |
| Emirate | Dubai | PASS |
| Venue | Playa Pacha, FIVE LUXE JBR, Dubai | PASS |
| Short label EN | ANOTR | PASS |
| Short label RU | ANOTR | PASS |
| noindex_after | 2026-11-14 | PASS |
| Duplicate check | No existing NOV item near Nov 13 (closest: NOV-05-SIBF Nov 4, NOV-01-DDW Nov 3) | No conflict |
| Decision | **IMPORT** |

---

### NOV-R3 — When Chai Met Toast, November 14, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | visitdubai.com/en/festivals-and-events/dubai-events-calendar/when-chai-met-toast (Visit Dubai official), Ticketmaster UAE, Platinumlist, Bandsintown | PASS |
| Allowed claims | Nov 14, New Covent Garden Theatre Mall of the Emirates, 7:00 PM | PASS |
| Venue clarification | "New Covent Garden Theatre" is inside Mall of the Emirates, Dubai — correctly labelled as Dubai | PASS |
| Date | 2026-11-14 | PASS |
| Emirate | Dubai | PASS |
| Short label EN | When Chai Met Toast | PASS |
| Short label RU | When Chai Met Toast | PASS |
| noindex_after | 2026-11-15 | PASS |
| Duplicate check | No conflict with Nov 13 ANOTR (different venue/date) | PASS |
| Decision | **IMPORT** |

---

### NOV-R4 — Anuv Jain at Expo City Dubai (Terra), November 20, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | ticketmaster.ae/event/anuv-jain-tickets/59869255, livenation.com/event/intl_1648145, music.apple.com, platinumlist.net/event-tickets/104347, goal.com tickets guide | PASS |
| Allowed claims | Nov 20, Terra — The Sustainability Pavilion, Expo City Dubai, 8:00 PM, Dastakhat world tour, AED 149 GA | PASS |
| Venue labelling | "Terra, Expo City Dubai" — Expo City clearly identified | PASS |
| Date | 2026-11-20 | PASS |
| Emirate | Dubai | PASS |
| Short label EN | Anuv Jain | PASS |
| Short label RU | Anuv Jain | PASS |
| noindex_after | 2026-11-21 | PASS |
| Duplicate check | No existing Nov 20 item | No conflict |
| Note | Next day is OFFLIMITS Nov 21 (Abu Dhabi) and KEINEMUSIK Nov 21 (Dubai) — all distinct | PASS |
| Decision | **IMPORT** |

---

### NOV-R5 — KEINEMUSIK at Bab Al Shams Arena, November 21, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | pachaicons.com/dubai/events/21112026-keinemusik-bab-al-shams, open.spotify.com/concert/4tNQMCECljxLvvzw2cUKw7, ticketmaster.ae/artist/keinemusik/1321963, whatson.ae, Songkick | PASS |
| Allowed claims | Nov 21, Bab Al Shams Arena Dubai, &ME + Rampa + Adam Port, debut UAE desert show, 8:00 PM, AED 300 entry | PASS |
| Emirate labelling | Bab Al Shams Arena is in Dubai (desert resort near Dubai–Abu Dhabi border, officially Dubai emirate) | PASS — emirate: Dubai |
| Date | 2026-11-21 | PASS |
| Short label EN | KEINEMUSIK | PASS |
| Short label RU | KEINEMUSIK | PASS |
| noindex_after | 2026-11-22 | PASS |
| Same date as OFFLIMITS | OFFLIMITS is Abu Dhabi (Etihad Park, Yas Island). KEINEMUSIK is Dubai (Bab Al Shams). No duplicate — different emirate, venue, audience. | PASS |
| Duplicate check | NOV-NEW-02 (OFFLIMITS) exists at Nov 21 — different event, fine | PASS |
| Decision | **IMPORT** |

---

### NOV-R6 — Dubai Run 2026 (DFC flagship), November 22, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | dubairun.com — "22 November 2026" confirmed on official site | PASS |
| Treatment note | This is Dubai Run (the specific run event), not generic DFC. dubairun.com is the official dedicated site. | PASS |
| Allowed claims | Nov 22, citywide running route, free to participate, annual event | PASS |
| Date | 2026-11-22 | PASS |
| Emirate | Dubai | PASS |
| Short label EN | Dubai Run | PASS |
| Short label RU | Dubai Run | PASS |
| noindex_after | 2026-11-23 | PASS |
| Duplicate check | No existing Nov 22 item | No conflict |
| Decision | **IMPORT** |

---

### NOV-R7 — Atif Aslam at Coca-Cola Arena Dubai, November 27, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | coca-cola-arena.com/music/1798/atif-aslam (official venue), Songkick, Gulf News (rescheduling confirmed), Platinumlist, Shazam | PASS |
| Allowed claims | Nov 27, Coca-Cola Arena City Walk Dubai, rescheduled from Apr 19, 9:00 PM, AED 150 tickets | PASS |
| Distinction from JUL-NEW-01 | JUL-NEW-01 = Abu Dhabi (Etihad Arena Jul 18). NOV-R7 = Dubai (Coca-Cola Arena Nov 27). Different city, different date. | PASS — not a duplicate |
| Date | 2026-11-27 | PASS |
| Emirate | Dubai | PASS |
| Short label EN | Atif Aslam Dubai | PASS — disambiguates from Jul Abu Dhabi show |
| Short label RU | Atif Aslam Дубай | PASS |
| noindex_after | 2026-11-28 | PASS |
| Duplicate check | Same date as NOV-R8 (Hiba Tawaji, Dubai Opera Nov 27) — different venue, fine | PASS |
| Decision | **IMPORT** |

---

### NOV-R8 — Hiba Tawaji & Ibrahim Maalouf "À La Française" at Dubai Opera, November 27, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS |
| Source URLs | dubaiopera.com (official venue), visitdubai.com official, gulfnews.com, livenation.me official, comingsoon.ae | PASS |
| Allowed claims | Nov 27, Dubai Opera Downtown Dubai, 8:30 PM, AED 355-755, Live Nation ME, one-night-only | PASS |
| Title note | "À La Française" contains a non-ASCII character (À). Fine for labels; ensure encoding is correct in JSON. | CHECK in script |
| Date | 2026-11-27 | PASS |
| Emirate | Dubai | PASS |
| Short label EN | Hiba Tawaji & Maalouf | PASS |
| Short label RU | Hiba Tawaji | PASS |
| noindex_after | 2026-11-28 | PASS |
| Same date as NOV-R7 | Atif Aslam is at Coca-Cola Arena. Hiba Tawaji is at Dubai Opera. Different venues. Both Dubai. Fine. | PASS |
| Decision | **IMPORT** |

---

### DEC-R1 — Imagine Dragons at Etihad Park, Yas Island, December 5, 2026

| Field | Value | Check |
|-------|-------|-------|
| Source confidence | OFFICIAL_CONFIRMED | PASS — 6 sources |
| Source URLs | abudhabigp.com/en/yasalam-after-race-concerts (official GP), thenationalnews.com, gulfnews.com, businesswire.com (official press release), timeoutdubai.com, khaleejtimes.com | PASS |
| Allowed claims | Dec 5, Etihad Park Yas Island Abu Dhabi, F1 Yasalam concert, included with F1 ticket, Saturday night | PASS |
| Date | 2026-12-05 | PASS |
| Emirate | Abu Dhabi | PASS |
| Venue | Etihad Park, Yas Island, Abu Dhabi | PASS — not Yas Marina Circuit (the venue is the park, not the circuit) |
| Short label EN | Imagine Dragons | PASS |
| Short label RU | Imagine Dragons | PASS |
| noindex_after | 2026-12-07 | PASS |
| Duplicate check | DEC-NEW-01 is Dec 3 (Lewis Capaldi). DEC-03-F1 is Dec 4. DEC-R1 is Dec 5. All distinct dates. | PASS |
| Decision | **IMPORT** |

---

### DEC-UPDATE-1 — Update existing DEC-NEW-01 to include Zara Larsson

| Field | Value | Check |
|-------|-------|-------|
| Action | UPDATE existing item, not insert | PASS |
| Target | DEC-NEW-01 (id="DEC-NEW-01") in december-2026-uae-calendar.dates_json | CONFIRMED EXISTS |
| Current label_en | "F1 Abu Dhabi GP week concert at Yas Marina Circuit (3 December) -- Lewis Capaldi headline" | Found in DB |
| New label_en | "F1 Abu Dhabi Week -- Yasalam concert at Etihad Park, Yas Island (3 December): Lewis Capaldi & Zara Larsson" | |
| New label_ru | "F1 Абу-Даби -- концерт Yasalam в Etihad Park, Yas Island (3 декабря): Льюис Капальди и Zara Larsson" | |
| New short_label_en | "F1 Concert Night 1" | Distinguishes from Night 2 (Imagine Dragons Dec 5) |
| New short_label_ru | "F1 Концерт (3 дек)" | |
| Source for Zara Larsson | thenationalnews.com Feb 2026, arabnews.com, prnewswire.com official PR, abudhabigp.com official | PASS |
| Venue correction | "Yas Marina Circuit" → "Etihad Park, Yas Island" (Yasalam concerts are at Etihad Park, not on the circuit itself) | PASS |
| Risk | LOW — factual correction + addition | PASS |
| Decision | **UPDATE** |

---

## Hard exclusions confirmed

| Item | Exclusion reason |
|------|-----------------|
| Global Village | HOLD — no opening date |
| DSF 2026-27 | HOLD — no official dates |
| Timur Bey 2 Jul 9 | HOLD — artist identity unverified |
| Beat The Heat DXB | HOLD — no 2026 lineup |
| CCA Dec 16-20 | HOLD — unnamed event |
| Kadim Al Sahir | REJECT — past event |
| Swedish House Mafia | REJECT — cancelled |
| ATB Sep 18 | No duplicate needed — Sep 18 is Oakenfold, Sep 5 ATB already imported |
| Any other items | Not in approved Batch 2B list |

---

## Technical notes for script

1. **The Corrs source URL**: Use `https://www.etihadarena.ae/en/events` (not the hussain-al-jasmi page). CTA: same.
2. **DEC-UPDATE-1**: Implement as in-place JSON update of DEC-NEW-01 entry, then republish. Do NOT insert new row.
3. **À La Française encoding**: Use plain ASCII apostrophe in `source_label`. The `À` character in the label is fine for JSON/UTF-8.
4. **noindex_after**: All event items use `remove` archive action with day-after date.
5. **Dubai Run and Dubai Ride brief_en**: Do NOT claim "DFC 30x30 challenge" which requires the main DFC source. State only what's confirmed from the sub-event official sites.
6. **Backup**: Create `data/guides.db.backup-pre-6c97b-TIMESTAMP` before any writes.

---

## Summary: all 13 operations approved for local import

| Op | ID | Month | Type |
|----|-----|-------|------|
| 1 | SEP-R1 | Sep | insert |
| 2 | OCT-R1 | Oct | insert |
| 3 | OCT-R2 | Oct | insert |
| 4 | NOV-R1 | Nov | insert |
| 5 | NOV-R2 | Nov | insert |
| 6 | NOV-R3 | Nov | insert |
| 7 | NOV-R4 | Nov | insert |
| 8 | NOV-R5 | Nov | insert |
| 9 | NOV-R6 | Nov | insert |
| 10 | NOV-R7 | Nov | insert |
| 11 | NOV-R8 | Nov | insert |
| 12 | DEC-R1 | Dec | insert |
| 13 | DEC-UPDATE-1 | Dec | update existing DEC-NEW-01 |

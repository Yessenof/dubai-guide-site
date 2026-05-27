# June/July 2026 Calendar Event Sources

## Ledger status

```
ledger_status:           source_ledger
publish_status:          not_for_publish_yet
content_status:          source_verification_only
last_reviewed:           2026-05-27
phase:                   6C-77
admin_status:            not_used
db_status:               not_touched
```

**Topics covered:**
- A. Dubai Mallathon 2026 (Jun 15 - Sep 15)
- B. Dubai Opera June 2026 shows (RE:SET Jun 6, Bassi Jun 20, UAE National Orchestra Jun 24)
- C. Dubai Summer Surprises 2026 (Jul 3 - Aug 30) — canonical date confirmation
- D. Modesh World 2026 — status: not yet announced
- E. Beat the Heat DXB 2026 — status: HOLD (no 2026 dates)
- F. Coca-Cola Arena July 2026 — status: signal_only (no official source)

---

## Source A — Dubai Mallathon 2026

| Field | Value |
|-------|-------|
| Authority | Government of Dubai (mediaoffice.ae) + Dubai Mallathon official site |
| Source type | official_government + official_event_site |
| Reliability | confirmed |
| Primary URL | https://www.dubaimallathon.ae/ |
| Secondary URL | https://www.mediaoffice.ae/ (Sheikh Hamdan directive announcement) |
| Access date | 2026-05-26 |
| Verification status | confirmed |

**Confirmed facts:**
- Dubai Mallathon 2026 runs 15 June to 15 September 2026
- 9 participating malls: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates, Springs Souk
- Route distances: 2.5 km, 5 km, 10 km
- Routes are inside air-conditioned malls (summer-friendly)
- Participation is free
- Launched under directive from Sheikh Hamdan bin Mohammed bin Rashid Al Maktoum, Crown Prince of Dubai

**Calendar item:** JUN-15-MALLATHON (L2) — see `docs/content-drafts/calendar/june-2026-dubai-calendar.md`

**Claim constraints:**
- Do not claim specific session times or race days without rechecking dubaimallathon.ae
- Do not claim prizes or awards without official confirmation
- "Participation is free" is confirmed; do not add registration requirements unless official site says so

**Recheck before import:** Yes — confirm event is running as announced and dates are unchanged

---

## Source B — Dubai Opera June 2026

| Field | Value |
|-------|-------|
| Authority | Dubai Opera (dubaiopera.com) |
| Source type | official_venue_site |
| Reliability | confirmed |
| URL | https://www.dubaiopera.com/en-US/products-list |
| Access date | 2026-05-27 |
| Verification status | confirmed |

**Confirmed June 2026 shows (beyond already-imported Rumi Jun 4-7):**

| ID | Date | Show | Status on site | Type |
|----|------|------|----------------|------|
| JUN-06-RESET | Jun 6, 2026 | RE:SET | Selling Fast | Unknown — verify before import |
| JUN-06-NYO | Jun 6, 2026 | NYO Ensembles + National Youth Choirs | Listed | Youth/classical — Dubai Opera Studio (not main auditorium) |
| JUN-20-BASSI | Jun 20, 2026 | Bassi Live: Kisi ko Batana Mat | Selling Fast | Indian stand-up comedian |
| JUN-24-ORCH | Jun 24, 2026 | UAE National Orchestra: Rhythms Without Borders | Listed | Season Finale orchestral concert |

**Calendar items:** JUN-06-RESET (L1), JUN-20-BASSI (L1), JUN-24-ORCH (L1) — see `docs/content-drafts/calendar/june-2026-dubai-calendar.md`

**July:** No Dubai Opera shows in July 2026. Summer hiatus. No July calendar items from this source.

**Claim constraints:**
- JUN-06-RESET: Show type/genre not confirmed — owner must verify what RE:SET is before import
- JUN-06-NYO: Low consumer priority — youth orchestra at Studio (not main auditorium). Not included in current enrichment batch.
- Do not state ticket prices or availability without rechecking official page at time of import
- Use dubaiopera.com as CTA URL (or a specific show URL if one becomes stable)

**Recheck before import:** Yes — confirm shows are still scheduled and no date changes

**Cross-confirmation:**
- Bassi Jun 20 confirmed by: dubaiopera.com, platinumlist.net, whatson.ae
- UAE National Orchestra Jun 24 confirmed by: dubaiopera.com, platinumlist.net, whatson.ae
- RE:SET Jun 6 confirmed by: dubaiopera.com, platinumlist.net

---

## Source C — Dubai Summer Surprises 2026 (canonical dates)

| Field | Value |
|-------|-------|
| Authority | DFRE (Dubai Festivals and Retail Establishment) via Zawya |
| Source type | official_press_release |
| Reliability | confirmed |
| URL | https://www.zawya.com/en/press-release/events-and-conferences/dubai-unveils-2026-retail-calendar-celebrating-a-decade-of-unforgettable-festivals-shopping-and-cultural-experiences-e1j8wn9z |
| Access date | 2026-05-27 |
| Verification status | confirmed |

**Confirmed facts:**
- Dubai Summer Surprises 2026: 3 July to 30 August 2026 (59 days)
- Organizer: DFRE (Dubai Festivals and Retail Establishment), Department of Economy and Tourism
- Components confirmed: Modesh World at DWTC, Beat the Heat DXB, Great Dubai Summer Sale, Back to School phase
- Individual sub-event dates and artist lineups: NOT yet announced as of 2026-05-27

**Calendar item:** JUL-03-DSS (L2) — already in July draft

**Claim constraints:**
- Do not publish specific sub-event dates for Beat the Heat DXB, Modesh World, or Great Dubai Summer Sale without official DFRE announcement
- "July 3 - August 30" is the confirmed DSS window — safe to use in the JUL-03-DSS label and brief

---

## Source D — Modesh World 2026

| Field | Value |
|-------|-------|
| Authority | DWTC (dwtc.com) |
| Source type | official_venue_site |
| Reliability | signal_only |
| URL | https://www.dwtc.com/en/events/ |
| Access date | 2026-05-27 |
| Verification status | not_yet_announced |

**Status:**
- DWTC website shows no dedicated 2026 Modesh World page as of 2026-05-27
- The 2025 page (Aug 2-28, 2025) is still the most recent indexed entry
- DSS press release confirms Modesh World is part of DSS 2026 but gives no specific start date
- Third-party sources are speculative or carry 2024/2025 dates

**Calendar item:** JUL-03-MODESH (L1) — uses Jul 3 as DSS anchor. This is conservative and safe. Do NOT update to a specific Modesh date until dwtc.com publishes the 2026 page.

**Recheck:** Check dwtc.com/en/events/ from late June 2026 — Modesh World 2026 page expected ~2-4 weeks before DSS opening.

---

## Source E — Beat the Heat DXB 2026

| Field | Value |
|-------|-------|
| Authority | DFRE / beattheheatdxb.ae |
| Source type | official_event_site |
| Reliability | signal_only |
| URL | https://beattheheatdxb.ae/ |
| Access date | 2026-05-27 |
| Verification status | not_yet_announced |

**Status:** HOLD

**Confirmed facts (2025 edition for context only):**
- Season 4 (2025): July 4-13, 2025 at Zabeel Hall 6, DWTC
- Organizer: DFRE under DSS

**2026 status:**
- beattheheatdxb.ae shows no 2026 event listing
- No artist lineup or dates announced by DFRE as of 2026-05-27
- The July 4-13 date range circulating online is from 2025 — NOT 2026
- visitdubai.com Beat the Heat entries found are for 2025 (July 11 and July 13 specifically)
- hhoteldubai.com DSS 2026 guide confirms 2026 lineup not yet announced

**Decision:** Do NOT add Beat the Heat DXB to July 2026 calendar until official DFRE announcement. Recheck beattheheatdxb.ae and visitdubai.com from late June 2026.

---

## Source F — Coca-Cola Arena July 2026

| Field | Value |
|-------|-------|
| Authority | Coca-Cola Arena (coca-cola-arena.com) |
| Source type | official_venue_site |
| Reliability | signal_only |
| URL | https://coca-cola-arena.com/ |
| Access date | 2026-05-27 |
| Verification status | signal_only |

**Status:** Signal-only for July 2026 events.

**Signals found (third-party only — NOT confirmed by CCA official site):**
- Muntazah Al Khairan (Jul 3-4, 2026, ~$55 tickets): Platinumlist only — not found on official CCA site
- Timur Bey 2 (Jul 9, 2026): Spotify artist page only — not found on official CCA site

**Decision:** Do NOT add any CCA July 2026 events to calendar until official CCA page confirms. Recheck coca-cola-arena.com directly.

**Note:** Direct fetch of coca-cola-arena.com redirects through queue-it.net (ticketing queue system). Use Platinumlist or CCA event listing page for research, but require official CCA source for any published calendar item.

---

## Blocked items — June/July 2026

| Item | Block reason |
|------|-------------|
| Islamic New Year / Al Hijra (~Jun 15-16) | FAHR has not announced. Moon-sighting — no date can be published until official fahr.gov.ae announcement |
| Beat the Heat DXB 2026 (any date) | No 2026 official dates — do not publish any date until DFRE announces |
| Modesh World 2026 specific dates | Not yet announced — use Jul 3 DSS anchor only |
| CCA July concerts (Muntazah Al Khairan, Timur Bey 2) | Signal-only — official CCA source required before any calendar item |
| DWTC June B2B trade shows | All confirmed B2B/trade — not consumer-facing (INDEX Jun 2-4, MOVE Jun 9-10, China Home Life Jun 17-19, World Police Summit Jun 23-25) |
| RE:SET at Dubai Opera (show type unverified) | Confirmed on dubaiopera.com but show genre/format not known — owner to verify before import |

---

## Next import batch recommendation

### Batch A (Ready now — owner approval needed)

| ID | Item | Level | Gap filled |
|----|------|-------|-----------|
| JUN-15-MALLATHON | Dubai Mallathon 2026 (Jun 15 - Sep 15) | L2 | Jun 15-30 (16 days) |
| JUN-20-BASSI | Bassi Live at Dubai Opera (Jun 20) | L1 | Jun 20 |
| JUN-24-ORCH | UAE National Orchestra (Jun 24) | L1 | Jun 24 |

**Batch A projected coverage:** Jun 1, 4-11, 15-30 = ~25/30 days = ~83%

### Batch B (Pending verification)

| ID | Item | Blocker |
|----|------|---------|
| JUN-06-RESET | RE:SET at Dubai Opera | Owner must confirm show type before import |
| JUL-03-DSS | Dubai Summer Surprises Jul anchor | Already in July draft — import when July page is approved |
| JUL-03-MODESH | Modesh World (Jul 3 anchor) | Already in July draft — import when July page is approved |

### Batch C (HOLD — awaiting official announcements)

| Item | Wait for |
|------|----------|
| Islamic New Year 2026 | FAHR official announcement at fahr.gov.ae |
| Beat the Heat DXB 2026 | DFRE/beattheheatdxb.ae 2026 lineup announcement |
| Modesh World 2026 specific dates | DWTC 2026 event page (~late June) |
| CCA July concerts | Official CCA confirmation |

---

*This is a source ledger — internal use only. No DB write. No admin action. No deploy.*
*Created: 2026-05-27 (Phase 6C-77)*

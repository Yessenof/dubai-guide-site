# Draft — November 2026 Calendar: New and Corrected Items

**Phase:** 6C-CALENDAR-EXPANSION-01  
**Date drafted:** 2026-06-19  
**Status:** Draft only. Not imported to DB. Not deployed.  
**Target:** `november-2026-dubai-calendar` dates_json (new items to be appended)

---

## New calendar items for November 2026

These are the items missing from the current November 2026 calendar page that are ready to add once owner-approved.

---

### NEW-NOV-01 — DP World Tour Championship 2026

**date:** 2026-11-12  
**label_en:** DP World Tour Championship 2026 at Jumeirah Golf Estates, Earth Course (12–15 November) — Race to Dubai season finale  
**label_ru:** Чемпионат DP World Tour 2026 в Jumeirah Golf Estates (12–15 ноября) — финал Гонки в Дубай  
**type:** sports_event  
**city:** dubai  
**venue_en:** Jumeirah Golf Estates (Earth Course), Dubai  
**venue_ru:** Jumeirah Golf Estates (Earth Course), Дубай  
**source_url:** https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/  
**detail_page_link:** /events/dp-world-tour-championship-2026 (once event page is live)  
**external_link:** https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/  
**source_status:** confirmed  
**blocked_claims:** ticket prices, player field, pro-am schedule

---

### NEW-NOV-02 — Dubai FinTech Summit 2026

**date:** 2026-11-02  
**label_en:** Dubai FinTech Summit 2026 at Madinat Jumeirah (2–3 November) — DIFC-organised fintech event  
**label_ru:** Dubai FinTech Summit 2026 в Madinat Jumeirah (2–3 ноября) — финтех-форум под эгидой DIFC  
**type:** business_event  
**city:** dubai  
**venue_en:** Madinat Jumeirah, Dubai  
**venue_ru:** Madinat Jumeirah, Дубай  
**source_url:** https://www.difc.com/whats-on/events/dubai-fintech-summit  
**detail_page_link:** /events/dubai-fintech-summit-2026 (future, if built)  
**external_link:** https://dubaifintechsummit.com/  
**source_status:** confirmed (reconfirm on summit site before import — was rescheduled once previously)  
**blocked_claims:** speaker list, registration fees, agenda sessions

---

### CORRECTION-NOV-03 — Dubai Fitness Challenge 2026: start date and window

**Current item (to be corrected):**
- date: 2026-11-01
- label_en: Dubai Ride 2026 -- citywide cycling event opens Dubai Fitness Challenge (1 November)

**Problem:** DFC starts on 31 October, not 1 November. The 30x30 window (31 Oct–29 Nov) is not stated. Dubai Ride on 1 Nov does happen but is not the official DFC start.

**Corrected November item:**
- **date:** 2026-11-01  
- **label_en:** Dubai Ride 2026 — citywide cycling event, part of Dubai Fitness Challenge 30x30 (1 November). DFC runs 31 October – 29 November 2026.  
- **label_ru:** Dubai Ride 2026 — городской велозаезд в рамках Dubai Fitness Challenge 30x30 (1 ноября). DFC проходит с 31 октября по 29 ноября 2026 года.  
- **source_url:** https://www.dubaifitnesschallenge.com/en/  
- **blocked_claims:** Celebrity participants or special event lineups before official DFC announcement

**Companion item for October 2026 calendar (NEW-OCT-01):**
- **date:** 2026-10-31  
- **label_en:** Dubai Fitness Challenge 2026 opens — 10th anniversary, 30x30 challenge runs 31 October to 29 November (Dubai Ride: 1 Nov, Dubai Run: 22 Nov)  
- **label_ru:** Dubai Fitness Challenge 2026 открывается — 10-й выпуск, 30 активных дней с 31 октября по 29 ноября (Dubai Ride: 1 ноября, Dubai Run: 22 ноября)  
- **type:** sports_event  
- **source_url:** https://www.dubaifitnesschallenge.com/en/  
- **detail_page_link:** /events/ (no dedicated DFC event page this phase)  
- **external_link:** https://www.dubaifitnesschallenge.com/en/  
- **blocked_claims:** Opening ceremony details, celebrity participants

---

### PROVISIONAL-NOV-04 — Frieze Abu Dhabi 2026 (provisional)

**Status: PROVISIONAL — add only after direct confirmation on frieze.com or abudhabiart.ae**

**date:** 2026-11-20 (provisional)  
**label_en:** Frieze Abu Dhabi 2026 at Manarat Al Saadiyat, Saadiyat Island, Abu Dhabi (20–22 November, provisional) — inaugural Frieze-branded edition  
**label_ru:** Frieze Abu Dhabi 2026 в Manarat Al Saadiyat, остров Саадийят, Абу-Даби (20–22 ноября, предварительно) — первый выпуск под брендом Frieze  
**note:** Must be labeled Abu Dhabi, never Dubai  
**source_url:** https://www.artnews.com/art-news/news/frieze-abu-dhabi-fair-announced-1234756413/ (media signal — BLOCKED until organizer confirms)  
**external_link:** To be updated to frieze.com or abudhabiart.ae once confirmed  
**blocked_claims:** Exact dates until confirmed on organizer site; ticket prices; gallery/exhibitor list

---

### PROVISIONAL-NOV-05 — ILT20 Season 5 start (provisional)

**Status: PROVISIONAL — verify season window on ilt20.com first; do not import without official confirmation**

**date:** 2026-11-22 (provisional)  
**label_en:** ILT20 Season 5 2026 opens (22 November) — UAE cricket league across Dubai, Sharjah, Abu Dhabi through 20 December  
**label_ru:** Открытие 5-го сезона ILT20 (22 ноября) — крикетная лига ОАЭ в Дубае, Шардже и Абу-Даби до 20 декабря  
**type:** sports_event  
**source_url:** https://en.wikipedia.org/wiki/2026_International_League_T20 (SECONDARY SOURCE — must verify on ilt20.com)  
**blocked_claims:** Individual match dates, venues, ticket prices, team rosters — all must come from official ilt20.com fixture release

---

## Import sequence recommendation

1. **NEW-NOV-01** (DP World Tour Championship) — ready once event page is approved and built
2. **NEW-NOV-02** (Dubai FinTech Summit) — ready after reconfirm on dubaifintechsummit.com
3. **CORRECTION-NOV-03** (DFC correction + OCT companion item) — ready now, no blockers
4. **PROVISIONAL-NOV-04** (Frieze Abu Dhabi) — hold until frieze.com or abudhabiart.ae confirms
5. **PROVISIONAL-NOV-05** (ILT20) — hold until ilt20.com publishes season fixture

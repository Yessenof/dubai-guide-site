# July 2026 Dubai Calendar — Draft

**Phase:** 6C-73 (drafted) / 6C-77 (enrichment scan) / 6C-80 (source enrichment sprint)
**Date drafted:** 2026-05-26
**Last updated:** 2026-05-27 (Phase 6C-80 source scan)
**Status:** Draft — enriched. Ready for local import QA.
**Slug:** `july-2026-dubai-calendar`
**Note:** July 2026 is anchored by Dubai Summer Surprises (Jul 3–Aug 30, confirmed DFRE/Zawya). Phase 6C-80 source scan added one confirmed sub-event (Muntazah Al Khairan at Dubai Opera, Jul 3-4, within DSS). Beat the Heat DXB 2026 and Modesh World 2026 specific dates remain unannounced — DSS umbrella dates used as anchors.

**Phase 6C-80 findings:**
- DSS July 3 - August 30, 2026: CONFIRMED (unchanged from 6C-77)
- Muntazah Al Khairan at Dubai Opera (Jul 3-4): CONFIRMED — Platinumlist official Dubai Opera listing, part of DSS 2026. Arabic-language theatrical comedy production. ~75 minutes. From $54.98.
- Modesh World 2026: STILL no standalone DWTC 2026 page. Jul 3 DSS anchor safe.
- Beat the Heat DXB Season 5 (2026): NO announcement found. Remains HOLD.
- Timur Bey 2 at CCA (Jul 9): Still signal_only — Spotify/Bandsintown only, no CCA official confirmation.
- Expo City Dubai: No July 2026 events confirmed.
- Dubai Opera: Only July event found is Muntazah Al Khairan (Jul 3-4, DSS). Not a full summer programme.
- Great Dubai Summer Sale 2026 sub-phase dates: Not yet announced by DFRE.
- Cinema Akil summer programme 2026: Not yet announced (2025 edition ran Jul 11–Sep 14).
- KHDA school year end (Sep-start schools): July 3, 2026 per Gulf News/KHDA. Low calendar value — not added as standalone item.

---

## Frontmatter / Header

```
slug:           july-2026-dubai-calendar
title_en:       July 2026 in Dubai: Dubai Summer Surprises and key dates
title_ru:       Дубай, июль 2026: Dubai Summer Surprises и важные даты
calendar_type:  monthly
year:           2026
month:          7
featured_homepage: 0
noindex:        0
ru_published:   1
```

---

## dates_json draft

---

### Item 1 — JUL-03-DSS (L2: Dubai Summer Surprises)

```json
{
  "id": "JUL-03-DSS",
  "date": "2026-07-03",
  "label_en": "Dubai Summer Surprises 2026 opens (3 July – 30 August)",
  "label_ru": "Dubai Summer Surprises 2026 стартует (3 июля – 30 августа)",
  "type": "retail_offer",
  "priority": 1,
  "brief_en": "Dubai Summer Surprises (DSS) 2026 runs from Friday 3 July to Sunday 30 August, organized by Dubai Festivals and Retail Establishment (DFRE), part of the Department of Economy and Tourism. The 59-day festival is Dubai's flagship summer event, featuring citywide shopping discounts, family entertainment, hotel promotions and prize draws across major malls. Key components include the Great Dubai Summer Sale, Modesh World at Dubai World Trade Centre, the Beat the Heat DXB concert series, and a Back to School retail phase in August. Specific sub-event dates and concert lineups are published by DFRE closer to the opening date. The official programme is available at visitdubai.com.",
  "brief_ru": "Dubai Summer Surprises (DSS) 2026 проходит с пятницы, 3 июля, по воскресенье, 30 августа. Организатор — Dubai Festivals and Retail Establishment (DFRE) в составе Департамента экономики и туризма. За 59 дней фестиваль охватывает весь Дубай: скидки в торговых центрах, семейные развлечения, акции отелей и розыгрыши призов. Основные составляющие: Большая летняя распродажа в крупных моллах, Modesh World в Dubai World Trade Centre, концертная серия Beat the Heat DXB и фаза Back to School в августе. Точные даты мероприятий и концертную программу DFRE публикует ближе к открытию фестиваля. Официальная программа — на visitdubai.com.",
  "cta_type": "open_source",
  "cta_url": "https://www.visitdubai.com/en/festivals-and-events/dss",
  "source_label": "DFRE / Visit Dubai — official",
  "lifecycle": "event_seasonal",
  "noindex_after": "2026-09-01",
  "archive_action": "keep"
}
```

---

### Item 2 — JUL-03-MODESH (L1: Modesh World)

```json
{
  "id": "JUL-03-MODESH",
  "date": "2026-07-03",
  "label_en": "Modesh World opens at Dubai World Trade Centre (within DSS)",
  "label_ru": "Modesh World открывается в Dubai World Trade Centre (в рамках DSS)",
  "type": "family",
  "priority": 2,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://www.dwtc.com/en/events/",
  "source_label": "DWTC / DFRE — annual event",
  "lifecycle": "event_seasonal",
  "noindex_after": "2026-09-01",
  "archive_action": "keep"
}
```

---

### Item 3 — JUL-03-KHAIR (L1: Muntazah Al Khairan at Dubai Opera)

**Status:** NEW — added Phase 6C-80. Source confirmed.

```json
{
  "id": "JUL-03-KHAIR",
  "date": "2026-07-03",
  "label_en": "Muntazah Al Khairan: Theatrical Comedy at Dubai Opera (3–4 July, within DSS)",
  "label_ru": "Muntazah Al Khairan: театральная комедия в Dubai Opera (3–4 июля, в рамках DSS)",
  "type": "entertainment",
  "priority": 3,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaiopera.com/en-US/products-list",
  "source_label": "Dubai Opera / Platinumlist — DSS 2026 official",
  "lifecycle": "event_seasonal",
  "noindex_after": "2026-07-05",
  "archive_action": "keep"
}
```

**Source notes (for ledger only — do not import into en_notes):**
- Source: https://dubai.platinumlist.net/event-tickets/106449/muntazah-al-khairan-in-dubai-summer-surprises-2026
- Platinumlist is an authorized official ticketing partner for Dubai Opera
- Event is explicitly branded as "Dubai Summer Surprises 2026"
- Arabic-language theatrical comedy production (~75 min), by Al Qaiser promoter
- Ages 3+ (children under 3 not permitted in auditorium)
- Price from $54.98 USD / approx AED 202

---

## Page-level strings draft

### en_summary

July 2026 in Dubai is anchored by Dubai Summer Surprises, a 59-day citywide festival of shopping deals, family entertainment and events running 3 July to 30 August. Includes Modesh World, the Great Dubai Summer Sale and more.

### ru_summary

Июль 2026 года в Дубае — это Dubai Summer Surprises: 59-дневный городской фестиваль с распродажами, семейными развлечениями и мероприятиями с 3 июля по 30 августа. Включает Modesh World, Большую летнюю распродажу и другие события.

### en_notes (user-facing public only — no internal notes)

Dubai Summer Surprises 2026 (3 July–30 August): DFRE official programme. Sub-event dates and concert lineups are announced by DFRE closer to the opening date. E-invoicing Phase A (1 July): see the e-invoicing calendar entry.

### ru_notes (user-facing public only — no internal notes)

Dubai Summer Surprises 2026 (3 июля–30 августа): официальная программа DFRE. Расписание мероприятий и концертная программа публикуются DFRE ближе к открытию фестиваля. Этап A e-invoicing (1 июля): см. отдельную запись в календаре.

---

## Enrichment needed before import

| Item | Status (2026-05-27) | Source to check |
|------|---------------------|----------------|
| Beat the Heat DXB 2026 concert dates | HOLD — no Season 5 announcement found; Season 4 was Jul 4-13 2025 at Zabeel Hall 6, DWTC. Wait for DFRE announcement. | beattheheatdxb.ae, visitdubai.com/en/festivals-and-events/dss |
| Modesh World 2026 specific start date | HOLD — DWTC has no 2026 Modesh page yet; Jul 3 DSS anchor safe | dwtc.com/en/events/ |
| Great Dubai Summer Sale 2026 start date | HOLD — not yet announced by DFRE; 2025 was ~Jul 18 | dubaidet.gov.ae, visitdubai.com |
| Timur Bey 2 at CCA (Jul 9) | signal_only — Spotify/Bandsintown only; no CCA official confirmation | coca-cola-arena.com |
| Cinema Akil July 2026 programme | Not yet announced; 2025 Summer of Classics ran Jul 11–Sep 14 | cinemaakil.com, alserkal.online |
| Expo City Dubai summer programming | No July events found | expocitydubai.com/en/things-to-do/events-and-workshops/ |
| Dubai school summer holiday | Sep-start schools: ~Jul 3 (Gulf News/KHDA). Individual school dates vary. Low calendar value — not added. | web.khda.gov.ae |

---

## Pre-import checklist

- [x] `calendar_type` = monthly — verified
- [x] DSS dates confirmed Jul 3–Aug 30 (Zawya/DFRE official press release)
- [x] Muntazah Al Khairan confirmed at Dubai Opera Jul 3-4 (Platinumlist official)
- [x] Em dash / double-hyphen check: 0 em dashes in all item strings
- [x] No "complete July calendar" or "all events" claims
- [x] en_notes / ru_notes are user-facing only — no internal editorial notes
- [x] July 1 (E-invoicing TAX-05A) is NOT duplicated here — already live in uae-e-invoicing-2026-asp-deadline
- [ ] Backup production DB before import
- [ ] Verify Modesh World 2026 DWTC URL is still dwtc.com/en/events/ (or updated page)
- [ ] Verify DSS official page still shows Jul 3–Aug 30 before import
- [ ] Verify Muntazah Al Khairan event is still scheduled at Dubai Opera before import
- [ ] Run em dash scan on all strings at import time

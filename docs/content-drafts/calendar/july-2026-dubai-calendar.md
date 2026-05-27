# July 2026 Dubai Calendar — Draft

**Phase:** 6C-73 (drafted) / 6C-77 (enrichment scan)
**Date drafted:** 2026-05-26
**Last updated:** 2026-05-27 (Phase 6C-77 source scan)
**Status:** Draft only — not imported. Requires local import QA before production.
**Slug:** `july-2026-dubai-calendar`
**Note:** July content is dominated by Dubai Summer Surprises (Jul 3–Aug 30, confirmed via Zawya/DFRE official press release). Individual DSS sub-event dates not yet published by DFRE — this page will need enrichment once DFRE releases the full DSS schedule (~late June). Do NOT import until brief quality is verified and DSS sub-events are confirmed.

**Phase 6C-77 findings:**
- DSS July 3 - August 30, 2026: CONFIRMED (Zawya DFRE official press release)
- Modesh World specific start date: NOT YET ANNOUNCED — DWTC has no 2026 Modesh World page yet; using Jul 3 as DSS anchor is safe
- Beat the Heat DXB 2026: HOLD — July 4-13 were 2025 (Season 4) dates; no 2026 dates or lineup announced as of 2026-05-27
- Muntazah Al Khairan at CCA (Jul 3-4): signal_only — Platinumlist only, no official CCA confirmation
- Timur Bey 2 at CCA (Jul 9): signal_only — Spotify only, no official CCA confirmation

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
  "brief_en": "Dubai Summer Surprises (DSS) 2026 runs from Friday 3 July to Sunday 30 August, organized by Dubai Festivals and Retail Establishment (DFRE), part of the Department of Economy and Tourism. The 59-day festival is Dubai's flagship summer event, featuring citywide shopping discounts, family entertainment, hotel promotions and prize draws. Key components include the Great Dubai Summer Sale across major malls, Modesh World at Dubai World Trade Centre, Beat the Heat DXB concerts, and a Back to School retail phase. Specific sub-event dates and concert line-ups are published by DFRE closer to the opening date. The official programme is available at visitdubai.com.",
  "brief_ru": "Dubai Summer Surprises (DSS) 2026 проходит с пятницы, 3 июля, по воскресенье, 30 августа. Организатор — Dubai Festivals and Retail Establishment (DFRE) в составе Департамента экономики и туризма. За 59 дней фестиваль охватывает весь Дубай: скидки в торговых центрах, семейные развлечения, акции отелей и розыгрыши призов. Основные составляющие: Большая летняя распродажа в крупных моллах, Modesh World в Dubai World Trade Centre, концертная серия Beat the Heat DXB и фаза Back to School. Точные даты мероприятий и концертную программу DFRE публикует ближе к открытию фестиваля. Официальная программа — на visitdubai.com.",
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

## Enrichment needed before import

The following items should be added once sources are confirmed:

| Item | Status (2026-05-27) | Source to check |
|------|---------------------|----------------|
| Beat the Heat DXB 2026 concert dates | HOLD — no 2026 dates announced; 2025 was Jul 4-13 at Zabeel Hall 6. Wait for DFRE lineup announcement. | beattheheatdxb.ae, visitdubai.com/en/festivals-and-events/dss |
| Modesh World 2026 specific start date | HOLD — DWTC has no 2026 Modesh page yet; expect around DSS opening (Jul 3); recheck dwtc.com ~late June | dwtc.com/en/events/ |
| Great Dubai Summer Sale exact start | Pending — wait for DFRE DSS schedule (~late June) | dubaidet.gov.ae |
| Dubai school summer holidays start | Pending — KHDA 2025-26 calendar | web.khda.gov.ae |
| Coca-Cola Arena July concert | signal_only — Timur Bey 2 (Jul 9, Spotify only); Muntazah Al Khairan (Jul 3-4, Platinumlist only). Neither confirmed by official CCA source. | coca-cola-arena.com |
| Expo City Dubai summer programming | Pending — check once announced | expocitydubai.com |

---

## Pre-import checklist

- [ ] Verify `calendar_type` value against schema
- [ ] DSS dates confirmed at visitdubai.com (Jul 3 - Aug 30)
- [ ] Check DWTC event page for standalone Modesh World 2026 URL
- [ ] Add enrichment items listed above once sources confirmed
- [ ] Run em dash / double-hyphen scan on all brief strings
- [ ] Backup production DB before import
- [ ] Note: July 1 (E-invoicing TAX-05A) is already live in uae-e-invoicing-2026-asp-deadline — do NOT add a July 1 item here

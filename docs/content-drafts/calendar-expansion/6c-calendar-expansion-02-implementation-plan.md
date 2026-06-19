# Phase 6C-CALENDAR-EXPANSION-02 — Implementation Plan

**Date:** 2026-06-19  
**Phase:** 6C-CALENDAR-EXPANSION-02  
**Mode:** Plan document. No DB writes, no imports, no deploy. Owner approval required before Phase 03.

Based on: source recheck (`6c-calendar-expansion-02-source-recheck.md`) and import readiness matrix (`6c-calendar-expansion-02-import-readiness-matrix.md`).

---

## Items proposed for implementation (Phase 03)

### A. IMPORT-READY items

**5 items:** DP World Tour Championship event page, Dubai FinTech Summit calendar item, DFC date correction (October + November), Corporate Tax Dec 31 calendar item, Emiratisation H2 Dec 31 calendar item.

---

## B. Items held (not in Phase 03)

| Item | Reason |
|---|---|
| Global Village Season 31 skeleton | Opening date not yet announced; importing a skeleton page with a placeholder date requires explicit owner decision |
| DSF 2026–2027 skeleton | All dates blocked; no calendar item possible yet |
| ILT20 Season 5 | ilt20.com is a parked domain — no official source available |
| Frieze Abu Dhabi | Provisional — needs organizer-direct source |
| NYE Dubai | Too early |

---

## Implementation details — IMPORT-READY items

---

### ITEM 1: DP World Tour Championship 2026 — New event page

**DB table:** `events`  
**Action:** INSERT new row  
**Proposed slug:** `dp-world-tour-championship-2026`

#### Exact field values

```
id:                    [new UUID — generate at import time]
slug:                  "dp-world-tour-championship-2026"
status:                "published"
category:              "festival"
color_type:            "major-event"
tags_json:             '["golf","sports","rolex-series","jumeirah-golf-estates","race-to-dubai"]'
event_date_start:      "2026-11-12"
event_date_end:        "2026-11-15"
date_confidence:       "confirmed"
year:                  2026
source_url:            "https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/"
featured_homepage:     0
featured_digest:       0
featured_calendar:     1
schema_eligible:       1
related_guide_slug:    ""
related_news_slug:     ""
ru_published:          1
created_at:            [ISO timestamp at import time]
updated_at:            [ISO timestamp at import time]
```

#### en_title
```
DP World Tour Championship 2026: Dates, Venue and What to Plan
```

#### en_seo_title
```
DP World Tour Championship 2026 | Jumeirah Golf Estates Dubai
```

#### en_meta_description
```
The 2026 DP World Tour Championship takes place 12–15 November at Jumeirah Golf Estates (Earth Course), Dubai. Season-ending Rolex Series event and Race to Dubai finale. Dates, venue and planning guide.
```

#### en_summary
```
The DP World Tour Championship is the season-ending Rolex Series event and the finale of the Race to Dubai. The 2026 edition runs 12–15 November at Jumeirah Golf Estates (Earth Course) in Dubai.
```

#### en_body
```markdown
## Quick answer

The DP World Tour Championship 2026 takes place **12–15 November** at **Jumeirah Golf Estates (Earth Course)**, Dubai. It is the season-ending Rolex Series event and the Race to Dubai finale.

---

## Key facts

| Detail | Value |
|--------|-------|
| Dates | 12–15 November 2026 |
| Venue | Jumeirah Golf Estates, Earth Course |
| Location | Dubai, UAE |
| Format | 72-hole stroke play (4 rounds) |
| Series | Rolex Series, DP World Tour |
| Race to Dubai | Season-ending finale |
| Tickets | Via dpworldtour.com (available closer to event) |
| Prize fund | Not yet confirmed for 2026 |

---

## What it is

The DP World Tour Championship is the culminating event of the DP World Tour's Rolex Series — a set of elite tournaments with elevated prize funds and global fields. As the season-ending tournament, it determines the Race to Dubai champion, the tour's equivalent of a season-points title.

The event has been held at Jumeirah Golf Estates' Earth Course in Dubai since 2009. The 2026 edition runs 12–15 November across a four-day competitive window.

---

## Who should pay attention

Golf fans, premium sports visitors, and business travelers who want to attend one of the UAE's flagship sporting events in November. Resident expats with a golf interest, corporate hospitality buyers, and anyone planning a November trip to Dubai around a major international sporting event.

---

## Planning notes

- Jumeirah Golf Estates is located off Emirates Road in Dubai. Access is by private car or taxi; the venue is not directly on a Metro line.
- Tickets and hospitality packages are available through the official DP World Tour website (dpworldtour.com). Specific 2026 packages are not yet published as of this writing.
- The pro-am event and opening ceremony schedule are typically announced a few months before the event.
- November in Dubai: average daytime temperature around 26–30°C, low humidity, minimal rain risk — comfortable for outdoor attendance.

---

## Source note

Dates and venue confirmed from the official DP World Tour schedule (europeantour.com), June 2026: 12–15 November 2026, Jumeirah Golf Estates (Earth Course), Dubai. Prize fund and ticket details will be published by the organizer closer to the event.

---

## See the full November 2026 Dubai calendar

[November 2026 in Dubai — events, deadlines and key dates](/calendar/november-2026-dubai-calendar)

---

## Related Guidex topics

- [November 2026 UAE calendar](/calendar/november-2026-dubai-calendar)
```

#### ru_title
```
Чемпионат DP World Tour 2026 в Дубае: даты, место проведения и что учесть
```

#### ru_seo_title
```
DP World Tour Championship 2026 | Jumeirah Golf Estates, Дубай
```

#### ru_meta_description
```
Чемпионат DP World Tour 2026 пройдёт 12–15 ноября на поле Earth Course в Jumeirah Golf Estates, Дубай. Финал Гонки в Дубай и завершение сезона Rolex Series. Даты, площадка, практическая информация.
```

#### ru_summary
```
Чемпионат DP World Tour — финальный турнир серии Rolex Series и кульминация Гонки в Дубай. Выпуск 2026 года проходит 12–15 ноября на поле Earth Course в Jumeirah Golf Estates, Дубай.
```

#### ru_body
```markdown
## Коротко

Чемпионат DP World Tour 2026 проходит **12–15 ноября** на поле **Earth Course в Jumeirah Golf Estates**, Дубай. Это финальный турнир серии Rolex Series и кульминация Гонки в Дубай.

---

## Ключевые факты

| Параметр | Значение |
|--------|-------|
| Даты | 12–15 ноября 2026 |
| Площадка | Jumeirah Golf Estates, Earth Course |
| Место | Дубай, ОАЭ |
| Формат | Игра на удары, 72 лунки (4 раунда) |
| Серия | Rolex Series, DP World Tour |
| Гонка в Дубай | Финальный этап сезона |
| Билеты | Через dpworldtour.com (ближе к событию) |
| Призовой фонд | Не подтверждён для 2026 года |

---

## Что это такое

Чемпионат DP World Tour — завершающий турнир серии Rolex Series Европейского тура с усиленными призовыми фондами и международными полями участников. Именно здесь определяется победитель Гонки в Дубай — сезонного рейтинга тура.

Турнир проводится на поле Earth Course в Jumeirah Golf Estates с 2009 года. Выпуск 2026 года запланирован на 12–15 ноября (четыре игровых дня).

---

## Кому это важно

Любителям гольфа, туристам, выбирающим премиальный спортивный досуг, и деловым путешественникам, планирующим ноябрьскую поездку в Дубай. Жителям ОАЭ с интересом к гольфу и покупателям корпоративных пакетов гостеприимства.

---

## Практические заметки

- Jumeirah Golf Estates расположен вблизи Emirates Road в Дубае. Добираться удобнее на машине или такси; прямого выхода из метро нет.
- Билеты и пакеты гостеприимства — на официальном сайте dpworldtour.com. Конкретные предложения для 2026 года ещё не опубликованы.
- Расписание про-ама и церемонии открытия объявляется организаторами за несколько месяцев до турнира.
- Ноябрь в Дубае: дневная температура около 26–30 °C, низкая влажность, дождей почти нет — комфортные условия для пребывания на открытом воздухе.

---

## Источник

Даты и площадка подтверждены официальным расписанием DP World Tour (europeantour.com), июнь 2026: 12–15 ноября 2026, Jumeirah Golf Estates (Earth Course), Дубай. Детали о призовом фонде и билетах будут опубликованы организаторами ближе к событию.

---

## Ноябрьский календарь ОАЭ

[Ноябрь 2026 в Дубае — события, дедлайны и ключевые даты](/calendar/november-2026-dubai-calendar)

---

## Смежные разделы Guidex

- [Ноябрь 2026 — календарь ОАЭ](/calendar/november-2026-dubai-calendar)
```

#### VENUE_BY_SLUG entry (event page template — add in Phase 03 or later)
```ts
"dp-world-tour-championship-2026": {
  name: "Jumeirah Golf Estates (Earth Course)",
  streetAddress: "Jumeirah Golf Estates",
  city: "Dubai",
}
```

#### ORGANIZER_BY_SLUG entry
```ts
"dp-world-tour-championship-2026": {
  name: "DP World Tour",
  url: "https://www.europeantour.com/dpworld-tour/",
}
```

**Note on template changes:** Adding DP World Tour to VENUE_BY_SLUG/ORGANIZER_BY_SLUG requires editing `app/(en)/(public)/events/[slug]/page.tsx` and `app/ru/events/[slug]/page.tsx`. This is a code change — it requires a build and deploy, separate from the DB-only import. The implementation plan for Phase 03 should decide whether to do DB import only first, or DB import + code edit + deploy together.

---

### ITEM 2: DP World Tour Championship — November 2026 calendar item

**DB table:** `calendar_pages`  
**Target row:** `november-2026-dubai-calendar`  
**Action:** Append item to `dates_json` array  
**New item ID:** `NOV-DPWT`

```json
{
  "id": "NOV-DPWT",
  "date": "2026-11-12",
  "label_en": "DP World Tour Championship 2026 at Jumeirah Golf Estates, Earth Course (12–15 November) — Race to Dubai season finale",
  "label_ru": "Чемпионат DP World Tour 2026 в Jumeirah Golf Estates (12–15 ноября) — финал Гонки в Дубай",
  "short_label_en": "DP World Tour Championship",
  "short_label_ru": "Чемпионат DP World Tour",
  "type": "sports_event",
  "confidence": "confirmed",
  "priority": 1,
  "detail_url": "/events/dp-world-tour-championship-2026",
  "brief_en": "The DP World Tour Championship 2026 (12–15 November) at Jumeirah Golf Estates Earth Course, Dubai, is the season-ending Rolex Series event and Race to Dubai finale. Tickets via dpworldtour.com.",
  "brief_ru": "Чемпионат DP World Tour 2026 (12–15 ноября) на поле Earth Course в Jumeirah Golf Estates — финал Rolex Series и Гонки в Дубай. Билеты через dpworldtour.com.",
  "source_label_en": "DP World Tour: official",
  "source_label_ru": "DP World Tour: официально",
  "source_url": "https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/",
  "source_status": "confirmed",
  "cta_type": "open_detail",
  "cta_url": "/events/dp-world-tour-championship-2026",
  "cta_label_en": "Read more",
  "cta_label_ru": "Читать далее",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-16",
  "archive_action": "remove"
}
```

---

### ITEM 3: Dubai FinTech Summit 2026 — November 2026 calendar item

**DB table:** `calendar_pages`  
**Target row:** `november-2026-dubai-calendar`  
**Action:** Append item to `dates_json` array  
**New item ID:** `NOV-DFTS`

```json
{
  "id": "NOV-DFTS",
  "date": "2026-11-02",
  "label_en": "Dubai FinTech Summit 2026 at Madinat Jumeirah (2–3 November) — organised by DIFC",
  "label_ru": "Dubai FinTech Summit 2026 в Madinat Jumeirah (2–3 ноября) — организатор DIFC",
  "short_label_en": "Dubai FinTech Summit",
  "short_label_ru": "Dubai FinTech Summit",
  "type": "business_event",
  "confidence": "confirmed",
  "priority": 2,
  "detail_url": null,
  "brief_en": "The fourth edition of the Dubai FinTech Summit runs 2–3 November 2026 at Madinat Jumeirah, organised by DIFC. The summit is the region's flagship fintech event, covering payments, banking technology, regulation and investment. Registration and speaker details via dubaifintechsummit.com.",
  "brief_ru": "Четвёртый Dubai FinTech Summit пройдёт 2–3 ноября 2026 года в Madinat Jumeirah. Организатор — DIFC. Ведущее финтех-мероприятие региона: платежи, банковские технологии, регуляторика, инвестиции. Регистрация и информация о спикерах на dubaifintechsummit.com.",
  "source_label_en": "Dubai FinTech Summit: official",
  "source_label_ru": "Dubai FinTech Summit: официально",
  "source_url": "https://dubaifintechsummit.com/",
  "source_status": "confirmed",
  "cta_type": "open_source",
  "cta_url": "https://dubaifintechsummit.com/",
  "cta_label_en": "Official website",
  "cta_label_ru": "Официальный сайт",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-04",
  "archive_action": "remove"
}
```

---

### ITEM 4: DFC date correction — Update NOV-R1 (November calendar)

**DB table:** `calendar_pages`  
**Target row:** `november-2026-dubai-calendar`  
**Action:** UPDATE existing item in `dates_json` where `id == "NOV-R1"`  
**Change:** Update label_en, label_ru, brief_en, brief_ru to reflect full DFC window (30x30, Oct 31 – Nov 29)

**Updated item NOV-R1:**
```json
{
  "id": "NOV-R1",
  "date": "2026-11-01",
  "label_en": "Dubai Ride 2026 — citywide cycling event (1 November), part of Dubai Fitness Challenge 30x30 running 31 October to 29 November",
  "label_ru": "Dubai Ride 2026 — городской велозаезд (1 ноября) в рамках Dubai Fitness Challenge 30x30 (31 октября — 29 ноября)",
  "short_label_en": "Dubai Ride / Dubai Fitness Challenge",
  "short_label_ru": "Dubai Ride / Dubai Fitness Challenge",
  "type": "sports_event",
  "confidence": "confirmed",
  "priority": 2,
  "detail_url": null,
  "brief_en": "Dubai Ride 2026 on 1 November is a citywide cycling event through Dubai landmarks including Burj Khalifa and the Museum of the Future. It falls within the Dubai Fitness Challenge (DFC) 30x30 programme, which runs 31 October to 29 November 2026. The DFC challenges residents to complete 30 minutes of activity daily for 30 days. Dubai Run, the DFC flagship run, takes place on 22 November. Register at dubairide.com and dubaifitnesschallenge.com.",
  "brief_ru": "Dubai Ride 2026 (1 ноября) — городской велозаезд мимо Бурдж-Халифа и Museum of the Future. Проходит в рамках Dubai Fitness Challenge (DFC) 30x30 — марафона активности с 31 октября по 29 ноября 2026 года. Цель DFC: 30 минут активности ежедневно на протяжении 30 дней. Dubai Run (флагманский забег DFC) — 22 ноября. Регистрация на dubairide.com и dubaifitnesschallenge.com.",
  "source_label_en": "Dubai Ride: official (dubairide.com) / DFC: official",
  "source_label_ru": "Dubai Ride: официально (dubairide.com) / DFC: официально",
  "source_url": "https://www.dubaifitnesschallenge.com/en/",
  "source_status": "confirmed",
  "cta_type": "open_source",
  "cta_url": "https://www.dubairide.com/",
  "cta_label_en": "Register for Dubai Ride",
  "cta_label_ru": "Регистрация на Dubai Ride",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-30",
  "archive_action": "remove"
}
```

---

### ITEM 5: DFC date correction — New October 2026 calendar item

**DB table:** `calendar_pages`  
**Target row:** `october-2026-dubai-calendar`  
**Action:** Append item to `dates_json` array  
**New item ID:** `OCT-DFC`

```json
{
  "id": "OCT-DFC",
  "date": "2026-10-31",
  "label_en": "Dubai Fitness Challenge 2026 opens (31 October) — 30x30 active challenge runs through 29 November; Dubai Ride: 1 Nov; Dubai Run: 22 Nov",
  "label_ru": "Старт Dubai Fitness Challenge 2026 (31 октября) — 30 активных дней до 29 ноября; Dubai Ride: 1 ноября; Dubai Run: 22 ноября",
  "short_label_en": "Dubai Fitness Challenge opens",
  "short_label_ru": "Старт Dubai Fitness Challenge",
  "type": "sports_event",
  "confidence": "confirmed",
  "priority": 2,
  "detail_url": null,
  "brief_en": "The 10th edition of the Dubai Fitness Challenge (DFC) opens on 31 October 2026. DFC is a citywide initiative encouraging residents to complete 30 minutes of activity daily for 30 days. Key dates within the programme: Dubai Ride (citywide cycling) on 1 November; Dubai Run (flagship run through Downtown Dubai) on 22 November. The 30x30 window runs 31 October to 29 November. Register and track your activity at dubaifitnesschallenge.com.",
  "brief_ru": "10-й выпуск Dubai Fitness Challenge (DFC) стартует 31 октября 2026 года. DFC — городская инициатива, призывающая жителей уделять 30 минут в день физической активности на протяжении 30 дней. Ключевые даты: Dubai Ride (велозаезд по городу) — 1 ноября; Dubai Run (флагманский забег через Downtown Dubai) — 22 ноября. Окно 30x30: 31 октября — 29 ноября. Регистрация на dubaifitnesschallenge.com.",
  "source_label_en": "Dubai Fitness Challenge: official",
  "source_label_ru": "Dubai Fitness Challenge: официально",
  "source_url": "https://www.dubaifitnesschallenge.com/en/",
  "source_status": "confirmed",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaifitnesschallenge.com/en/",
  "cta_label_en": "Official website",
  "cta_label_ru": "Официальный сайт",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-30",
  "archive_action": "remove"
}
```

---

### ITEM 6: UAE Corporate Tax — 31 December 2026 deadline — December calendar item

**DB table:** `calendar_pages`  
**Target row:** `december-2026-uae-calendar`  
**Action:** Append item to `dates_json` array  
**New item ID:** `DEC-CTAX`

```json
{
  "id": "DEC-CTAX",
  "date": "2026-12-31",
  "label_en": "UAE Corporate Tax return deadline: 31 December 2026 — for companies with a 31 March 2026 financial year-end (9-month FTA rule)",
  "label_ru": "Срок подачи Corporate Tax в ОАЭ: 31 декабря 2026 — для компаний с финансовым годом до 31 марта 2026 (правило FTA: 9 месяцев)",
  "short_label_en": "Corporate Tax filing deadline",
  "short_label_ru": "Дедлайн Corporate Tax",
  "type": "compliance_deadline",
  "confidence": "confirmed",
  "priority": 1,
  "detail_url": null,
  "brief_en": "Companies with a financial year ending 31 March 2026 must file their UAE Corporate Tax return by 31 December 2026. This follows the Federal Tax Authority's 9-month filing rule (from year-end to filing deadline). The same rule produced the 30 September 2026 deadline for December 2025 year-end companies. Confirm your company's financial year-end and file through the EmaraTax portal (emaratax.ae). Source: Federal Tax Authority (tax.gov.ae).",
  "brief_ru": "Компании с финансовым годом, заканчивающимся 31 марта 2026 года, обязаны подать декларацию по UAE Corporate Tax не позднее 31 декабря 2026 года. Это следует из правила FTA: срок подачи — 9 месяцев с окончания финансового года. То же правило дало дедлайн 30 сентября 2026 года для компаний с финансовым годом до 31 декабря 2025 года. Подача через портал EmaraTax (emaratax.ae). Источник: Федеральное налоговое управление (tax.gov.ae).",
  "source_label_en": "Federal Tax Authority (FTA): official",
  "source_label_ru": "Федеральное налоговое управление (FTA): официально",
  "source_url": "https://tax.gov.ae/",
  "source_status": "confirmed",
  "cta_type": "open_source",
  "cta_url": "https://tax.gov.ae/",
  "cta_label_en": "FTA — Corporate Tax",
  "cta_label_ru": "FTA — Corporate Tax",
  "emirate": "UAE-wide",
  "risk_level": "high",
  "lifecycle": "deadline",
  "noindex_after": "2027-01-15",
  "archive_action": "archive"
}
```

---

### ITEM 7: UAE Emiratisation H2 2026 — December calendar item

**DB table:** `calendar_pages`  
**Target row:** `december-2026-uae-calendar`  
**Action:** Append item to `dates_json` array  
**New item ID:** `DEC-EMIR`

```json
{
  "id": "DEC-EMIR",
  "date": "2026-12-31",
  "label_en": "UAE Emiratisation: H2 2026 private sector target deadline (31 December) — second semi-annual 1% increase for companies with 50+ employees",
  "label_ru": "Эмиратизация ОАЭ: дедлайн II полугодия 2026 (31 декабря) — второй полугодовой прирост 1% для компаний с 50+ сотрудниками",
  "short_label_en": "Emiratisation H2 deadline",
  "short_label_ru": "Дедлайн эмиратизации II кв.",
  "type": "compliance_deadline",
  "confidence": "confirmed",
  "priority": 1,
  "detail_url": null,
  "brief_en": "Private sector companies with 50 or more employees in targeted sectors must achieve the second semi-annual 1% Emiratisation increase by 31 December 2026. This is the H2 counterpart of the H1 deadline (30 June 2026). The annual target is a 2% total increase in Emirati employees in skilled roles. Non-compliance with Emiratisation targets can result in administrative penalties under MoHRE enforcement. Source: Ministry of Human Resources and Emiratisation (mohre.gov.ae).",
  "brief_ru": "Частные компании с 50+ сотрудниками в целевых секторах обязаны выполнить второй полугодовой прирост эмиратизации на 1% до 31 декабря 2026 года. Это аналог дедлайна I полугодия (30 июня 2026). Годовая цель — совокупный рост на 2% сотрудников-граждан ОАЭ на квалифицированных должностях. Несоблюдение условий эмиратизации влечёт административные санкции согласно законодательству MoHRE. Источник: Министерство кадров и эмиратизации (mohre.gov.ae).",
  "source_label_en": "MoHRE (Ministry of Human Resources & Emiratisation): official",
  "source_label_ru": "MoHRE (Министерство кадров и эмиратизации): официально",
  "source_url": "https://mohre.gov.ae/",
  "source_status": "confirmed",
  "cta_type": "open_source",
  "cta_url": "https://mohre.gov.ae/",
  "cta_label_en": "MoHRE — Emiratisation",
  "cta_label_ru": "MoHRE — Эмиратизация",
  "emirate": "UAE-wide",
  "risk_level": "high",
  "lifecycle": "deadline",
  "noindex_after": "2027-01-15",
  "archive_action": "archive"
}
```

---

## DB tables and rows that would be touched

| Table | Row (slug) | Action | Items |
|---|---|---|---|
| `events` | `dp-world-tour-championship-2026` (new) | INSERT | ITEM 1 |
| `calendar_pages` | `november-2026-dubai-calendar` | UPDATE dates_json (append 2 items + update 1) | ITEMS 2, 3, 4 |
| `calendar_pages` | `october-2026-dubai-calendar` | UPDATE dates_json (append 1 item) | ITEM 5 |
| `calendar_pages` | `december-2026-uae-calendar` | UPDATE dates_json (append 2 items) | ITEMS 6, 7 |

**Total: 1 INSERT, 3 UPDATE rows.**

**Tables NOT touched:** All other `events` rows, all other `calendar_pages` rows, `guides` table, `steps` table, any admin or user tables.

---

## Rollback / backup plan

Before any DB write in Phase 03:

1. **Server backup:** `ssh root@85.9.203.69 "cp /var/www/guidex/data/guides.db /var/www/guidex/data/guides.db.pre-calendar-expansion-02-$(date +%Y%m%d-%H%M%S)"`
2. **Local backup:** `cp data/guides.db data/guides.db.pre-calendar-expansion-02-$(date +%Y%m%d-%H%M%S)`
3. **MD5 verification:** confirm server and local backup MD5 match before writing
4. **Rollback approach:** Restore from backup file if any write fails or produces unexpected result. The events INSERT can be reverted with a DELETE by slug. The calendar_pages dates_json updates can be reverted by restoring the backed-up JSON.

**Write order:** Local dev DB first → verify locally → production DB second.

---

## QA plan (post-import)

### Local QA (before production)

1. `npm run build` — confirm 88+ pages, zero TypeScript errors
2. Start dev server: `npm run dev -- --hostname 0.0.0.0`
3. Check `/events/dp-world-tour-championship-2026` — title, dates, venue, source link
4. Check `/ru/events/dp-world-tour-championship-2026` — RU title, RU content
5. Check `/calendar/november-2026-dubai-calendar` — verify DP World Tour (12 Nov), FinTech Summit (2 Nov), corrected DFC item (1 Nov) all appear
6. Check `/calendar/october-2026-dubai-calendar` — verify DFC start (31 Oct) appears
7. Check `/calendar/december-2026-uae-calendar` — verify Corporate Tax (31 Dec) and Emiratisation (31 Dec) items appear
8. Check `/ru/calendar/november-2026-dubai-calendar` — RU equivalents
9. Check `/ru/calendar/october-2026-dubai-calendar` — RU DFC item
10. Check `/ru/calendar/december-2026-uae-calendar` — RU compliance items
11. Verify no unrelated pages changed (GITEX, F1, Design Week, Big 5 still intact)
12. Verify sitemap.xml still 200
13. Check no "penalty" or "AED 108,000" text in Emiratisation calendar item
14. Check no "All companies" text in Corporate Tax item — must specify March year-end

### Production QA (after deploy)

15. HTTP 200 check on all 7 affected routes (4 EN + 3 RU calendar pages + 2 event pages)
16. Spot-check DP World Tour event page via curl/browser on production
17. Verify December calendar page shows both new compliance items
18. ISR flush if needed (delete .next ISR cache files + pm2 reload)

---

## Code changes required (separate from DB)

The DP World Tour event page will benefit from JSON-LD location/organizer enrichment. This requires:
- Adding `"dp-world-tour-championship-2026"` to `VENUE_BY_SLUG` in `app/(en)/(public)/events/[slug]/page.tsx`
- Adding `"dp-world-tour-championship-2026"` to `ORGANIZER_BY_SLUG` in the same file
- Same for `app/ru/events/[slug]/page.tsx`

This is a code change requiring a build + deploy. **Decision for owner:** Do this in the same Phase 03 (DB import + code edit + deploy), or do the DB import now and the code edit in a follow-up phase?

Recommendation: **Include in Phase 03** — it is a 4-line addition to two files, no logic change, and has already been tested (same pattern used for F1 and GITEX). Doing it now avoids a separate deploy.

---

## Items held — summary

| Item | Status | Action |
|---|---|---|
| Global Village Season 31 skeleton | DRAFT-ONLY | Keep as file; import skeleton page if owner explicitly approves placeholder |
| DSF 2026–2027 skeleton | DRAFT-ONLY | Keep as file; import only when DFRE announces dates |
| ILT20 Season 5 | BLOCKED | No action; ilt20.com is a parked domain |
| Frieze Abu Dhabi | RECHECK-LATER | Recheck Sep 2026 on frieze.com/abudhabiart.ae |
| NYE Dubai | RECHECK-LATER | Recheck Nov 2026 |

---

## Owner decision points before Phase 03

1. **Approve Phase 03 DB import** for the 5 IMPORT-READY items above? (Required before any DB write)
2. **Include code edit** (DP World Tour JSON-LD enrichment) in Phase 03 alongside DB import? Or defer to a separate phase? (Recommended: include)
3. **Import Global Village skeleton now** with placeholder date (`event_date_start = 2026-10-01`, date_confidence = `expected`, "date not yet confirmed" language in content)? Or hold until official date is announced? (Recommended: hold — do not import with placeholder)

# June 2026 Dubai Calendar — Draft

**Phase:** 6C-73 (drafted) / 6C-74 (local import QA passed) / 6C-74B (em dash cleanup)
**Date drafted:** 2026-05-26
**Status:** Local import QA passed. Production import pending owner approval.
**Slug:** `june-2026-dubai-calendar`
**DB record ID:** `ca207e36-589a-4c8c-a6f2-3b066d2da775`
**Import script:** `scripts/june-2026-calendar-local-import-6c74.ts`

---

## Frontmatter / Header

```
slug:              june-2026-dubai-calendar
title_en:          June 2026 in Dubai: key dates, events and deadlines
title_ru:          Дубай, июнь 2026: важные даты, события и дедлайны
calendar_type:     monthly
year:              2026
month:             6
featured_homepage: 0
noindex:           0
ru_published:      1
```

---

## dates_json draft

All items in publish order (chronological by date).
Em dashes removed from all content strings. Source labels use ":" separator.

---

### Item 1 — JUN-01-VAT (L2: Salik + Parkin VAT)

```json
{
  "id": "JUN-01-VAT",
  "date": "2026-06-01",
  "label_en": "Salik toll and Dubai parking fees: 5% VAT added",
  "label_ru": "Платные дороги Salik и парковки Dubai: добавлен НДС 5%",
  "type": "government_update",
  "priority": 1,
  "brief_en": "From 1 June 2026, a 5% VAT is applied to all Salik toll gate charges and tag activation fees across Dubai. The same date, Parkin (Dubai's main public parking operator) began adding 5% VAT to on-street and off-street parking fees, seasonal cards, and parking permits. Both companies are remitting VAT collected to the Federal Tax Authority (FTA). Parkin also ended cash payments at parking meters from 1 June as part of Dubai's Cashless Strategy. The retrospective VAT on Salik from 2022 to 2026 is covered by the Roads and Transport Authority (RTA) and is not charged to motorists.",
  "brief_ru": "С 1 июня 2026 года к тарифам на проезд через пункты Salik и к сборам за активацию тегов начисляется НДС 5%. В тот же день Parkin (основной оператор платных парковок Дубая) ввёл НДС 5% на уличные и крытые парковки, сезонные карты и разрешения. Оба оператора перечисляют собранный НДС в Федеральное налоговое управление (FTA). Кроме того, Parkin прекратил приём наличных в паркоматах с 1 июня в рамках стратегии Дубая по переходу на безналичную оплату. Ретроактивный НДС Salik за период с 2022 по 2026 год оплачивается Управлением дорог и транспорта (RTA) и не взимается с водителей.",
  "cta_type": "open_source",
  "cta_url": "https://www.salik.ae/en/news/Salik-to-Apply-VAT-on-Toll-Tariffs-Starting-1-June-2026",
  "source_label": "Salik PJSC: official announcement",
  "lifecycle": "compliance_evergreen",
  "noindex_after": "",
  "archive_action": "keep"
}
```

---

### Item 2 — JUN-01-WPS (L2: MoHRE WPS new rule)

```json
{
  "id": "JUN-01-WPS",
  "date": "2026-06-01",
  "label_en": "UAE: private sector salaries must be paid by the 1st of each month",
  "label_ru": "ОАЭ: зарплата в частном секторе не позднее 1-го числа каждого месяца",
  "type": "compliance",
  "priority": 2,
  "brief_en": "From June 2026, the Ministry of Human Resources and Emiratisation (MoHRE) requires all private sector employers in the UAE to pay monthly wages by the first day of each calendar month. Ministerial Resolution No. 0340 of 2026, issued May 12, sets the unified deadline and defines late payment penalties: electronic monitoring and a warning from Day 2, work permit suspension from Day 5, administrative fines from Day 11, and automatic labour dispute registration from Day 16. A company is considered compliant if it pays at least 85% of total wages due by the deadline. Wages must be transferred via the approved Wage Protection System (WPS).",
  "brief_ru": "С июня 2026 года Министерство трудовых ресурсов и эмиратизации (MoHRE) обязывает всех работодателей частного сектора ОАЭ выплачивать ежемесячные зарплаты не позднее первого числа каждого месяца. Это установлено Постановлением No. 0340/2026 от 12 мая. Нарушителям грозят санкции: предупреждение со 2-го дня, приостановка выдачи разрешений на работу с 5-го дня, административные штрафы с 11-го дня, автоматическая регистрация трудового спора с 16-го дня. Компания считается соответствующей требованиям, если выплатила не менее 85% всех причитающихся зарплат. Оплата через Систему защиты заработной платы (WPS).",
  "cta_type": "open_source",
  "cta_url": "https://www.mohre.gov.ae/en/media-center/news/",
  "source_label": "MoHRE: Ministerial Resolution No. 0340/2026",
  "lifecycle": "compliance_evergreen",
  "noindex_after": "",
  "archive_action": "keep"
}
```

---

### Item 3 — JUN-04-RUMI (L1: Rumi The Musical)

```json
{
  "id": "JUN-04-RUMI",
  "date": "2026-06-04",
  "label_en": "Rumi: The Musical at Dubai Opera (4-7 June)",
  "label_ru": "Мюзикл «Руми» в Dubai Opera (4-7 июня)",
  "type": "venue_show",
  "priority": 3,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaiopera.com/en-US/products-list",
  "source_label": "Dubai Opera: official",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-06-08",
  "archive_action": "remove"
}
```

---

### Item 4 — JUN-05-ACW (L2: Arab Cinema Week)

```json
{
  "id": "JUN-05-ACW",
  "date": "2026-06-05",
  "label_en": "Arab Cinema Week 2026 at Cinema Akil, Alserkal Avenue (5-11 June)",
  "label_ru": "Неделя арабского кино 2026 в Cinema Akil, Alserkal Avenue (5-11 июня)",
  "type": "event",
  "priority": 2,
  "brief_en": "Arab Cinema Week returns to Cinema Akil at Alserkal Avenue from 5 to 11 June 2026. This is the 5th annual edition, presented by Fujifilm in partnership with Alserkal Avenue. The programme features 9 feature films representing 10 Arab countries, with a particular spotlight on Lebanese cinema. Genres include fiction, documentary and experimental film. Selected films screen in the presence of their filmmakers. The public is also invited to a master class with Palestinian actor Saleh Bakri. Tickets start from AED 60 including VAT. The full programme and booking are available at cinemaakil.com.",
  "brief_ru": "С 5 по 11 июня 2026 года в Cinema Akil на территории Alserkal Avenue проходит Неделя арабского кино, пятое ежегодное издание фестиваля. Организаторы: Fujifilm при партнёрстве Alserkal Avenue. Программа включает 9 фильмов из 10 арабских стран с акцентом на ливанское кино. Жанры: игровое, документальное и экспериментальное кино. Часть фильмов демонстрируется в присутствии режиссёров. Для широкой публики предусмотрен мастер-класс с палестинским актёром Салехом Бакри. Билеты от 60 AED с учётом НДС. Полная программа и бронирование на cinemaakil.com.",
  "cta_type": "open_source",
  "cta_url": "https://www.cinemaakil.com/",
  "source_label": "Cinema Akil / Alserkal Avenue: official",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-06-12",
  "archive_action": "remove"
}
```

---

### Item 5 — JUN-11-BEACH (L1: Beach Boys)

```json
{
  "id": "JUN-11-BEACH",
  "date": "2026-06-11",
  "label_en": "The Beach Boys: 60 Years of Pet Sounds Tour, Coca-Cola Arena",
  "label_ru": "The Beach Boys: тур «60 лет Pet Sounds», Coca-Cola Arena",
  "type": "venue_show",
  "priority": 3,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://coca-cola-arena.com/music/1858/the-beach-boys-60-years-of-pet-sounds-tour",
  "source_label": "Coca-Cola Arena: official",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-06-12",
  "archive_action": "remove"
}
```

---

## Hold items — not included in this import

| Item | Reason |
|------|--------|
| Islamic New Year / Al Hijra (~Jun 15-16) | Moon-sighting — awaiting FAHR UAE official announcement |
| Emirati min wage June 30 deadline | Related to Emiratisation June 30 already-live page; risk of duplication — owner to decide |
| DWTC June trade shows | B2B shows (INDEX, MOVE, TCCA, Apparel) — verify consumer relevance and dates at dwtc.com before adding |

---

## Pre-import checklist

- [x] Verify `calendar_type` value — confirmed `monthly` (not `events`)
- [x] Verify `year` and `month` fields — confirmed 2026 / 6
- [x] Confirm MoHRE cta_url — using news page (no direct Resolution URL available)
- [x] Recheck Salik source URL — using news URL (main site returned 403 during research)
- [x] Confirm Rumi dates at dubaiopera.com — 4-7 June confirmed
- [x] Confirm Arab Cinema Week dates at cinemaakil.com — 5-11 June confirmed
- [x] Confirm Beach Boys date at coca-cola-arena.com — 11 June confirmed
- [x] Run em dash scan on all brief_en and brief_ru strings — all clean
- [x] Confirm no stale claim about specific provider counts or percentages
- [x] Write import script — `scripts/june-2026-calendar-local-import-6c74.ts`
- [x] Backup production DB before import — `backups/local/guides.db.pre-june-2026-calendar-6c74-20260526-232638`
- [ ] Production import — pending owner approval

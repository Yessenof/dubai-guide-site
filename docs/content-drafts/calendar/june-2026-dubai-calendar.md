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

## Hold items — not included in Phase 6C-75 production import

| Item | Reason |
|------|--------|
| Islamic New Year / Al Hijra (~Jun 15-16) | Moon-sighting — awaiting FAHR UAE official announcement. Still HOLD as of 2026-05-27. |
| Emirati min wage June 30 deadline | Related to Emiratisation June 30 already-live page; risk of duplication — owner to decide |
| DWTC June trade shows | B2B shows (INDEX, MOVE, TCCA, Apparel, China Home Life, World Police Summit) — all confirmed B2B/trade only, not consumer-facing |
| RE:SET at Dubai Opera (Jun 6) | Source confirmed (dubaiopera.com) but show type unverified — owner to confirm what RE:SET is before import |
| Beat the Heat DXB 2026 (July) | July 4-13 dates were for 2025 edition — no 2026 official dates announced yet. HOLD until DFRE publishes lineup. |

---

## Phase 6C-77 enrichment candidates (not yet imported)

The following items were sourced in Phase 6C-77. They are not yet in the production DB. A separate import phase is required.

---

### Item 6 — JUN-06-RESET (L1: RE:SET at Dubai Opera)

```json
{
  "id": "JUN-06-RESET",
  "date": "2026-06-06",
  "label_en": "RE:SET at Dubai Opera (6 June)",
  "label_ru": "RE:SET в Dubai Opera (6 июня)",
  "type": "venue_show",
  "priority": 3,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaiopera.com/en-US/products-list",
  "source_label": "Dubai Opera: official",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-06-07",
  "archive_action": "remove"
}
```

**Source:** dubaiopera.com official schedule — listed as "Selling Fast".
**Owner note:** Show type (genre/format) not confirmed — verify what RE:SET is before import.

---

### Item 7 — JUN-15-MALLATHON (L2: Dubai Mallathon 2026)

**HIGH PRIORITY — fills June 15-30 gap (16 days).**

```json
{
  "id": "JUN-15-MALLATHON",
  "date": "2026-06-15",
  "label_en": "Dubai Mallathon 2026 at 9 major malls (15 June - 15 September)",
  "label_ru": "Dubai Mallathon 2026 v 9 torgovykh tsentrakh (15 iyunya - 15 sentyabrya)",
  "type": "event",
  "priority": 2,
  "brief_en": "Dubai Mallathon 2026 runs from 15 June to 15 September at nine major malls across Dubai: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates and Springs Souk. The event offers 2.5 km, 5 km and 10 km walking and running routes inside air-conditioned malls, providing a summer-friendly alternative to outdoor exercise. Participation is free. The initiative was launched under a directive from Sheikh Hamdan bin Mohammed bin Rashid Al Maktoum, Crown Prince of Dubai. Route maps and details are available at dubaimallathon.ae.",
  "brief_ru": "Dubai Mallathon 2026 prokhodit s 15 iyunya po 15 sentyabrya v devyati torgovykh tsentrakh Dubaya: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates i Springs Souk. Marshruty dlinoy 2,5 km, 5 km i 10 km prokhodyat vnutri torgovykh tsentrov s konditsionirovaniyem. Uchastiye besplatnoye. Initsiativa zapushchena po direktivye sheykkha Khamdana bin Mukhammeda bin Rashida Al Maktuma, Naslednogo Printsa Dubaya. Marshruty i podrobnosti: dubaimallathon.ae.",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaimallathon.ae/",
  "source_label": "Government of Dubai (mediaoffice.ae): official announcement",
  "lifecycle": "event_seasonal",
  "noindex_after": "2026-09-16",
  "archive_action": "keep"
}
```

**Source:** mediaoffice.ae official announcement + dubaimallathon.ae official event site.
**Note:** brief_ru above is transliterated placeholder — rewrite in proper Russian before import. brief_en is import-ready.

---

### Item 8 — JUN-20-BASSI (L1: Bassi Live at Dubai Opera)

```json
{
  "id": "JUN-20-BASSI",
  "date": "2026-06-20",
  "label_en": "Bassi Live: Kisi ko Batana Mat at Dubai Opera (20 June)",
  "label_ru": "Bassi Live: Kisi ko Batana Mat v Dubai Opera (20 iyunya)",
  "type": "venue_show",
  "priority": 3,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaiopera.com/en-US/products-list",
  "source_label": "Dubai Opera: official",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-06-21",
  "archive_action": "remove"
}
```

**Source:** dubaiopera.com (official), cross-confirmed by platinumlist.net and whatson.ae.
**Note:** Bassi is an Indian stand-up comedian. label_ru needs proper Russian translation before import.

---

### Item 9 — JUN-24-ORCH (L1: UAE National Orchestra Season Finale)

```json
{
  "id": "JUN-24-ORCH",
  "date": "2026-06-24",
  "label_en": "UAE National Orchestra: Rhythms Without Borders, Dubai Opera (24 June)",
  "label_ru": "Natsionalnyy orkestr OAE: Rhythms Without Borders, Dubai Opera (24 iyunya)",
  "type": "venue_show",
  "priority": 3,
  "brief_en": "",
  "brief_ru": "",
  "cta_type": "open_source",
  "cta_url": "https://www.dubaiopera.com/en-US/products-list",
  "source_label": "Dubai Opera: official",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-06-25",
  "archive_action": "remove"
}
```

**Source:** dubaiopera.com (official), cross-confirmed by platinumlist.net and whatson.ae.
**Note:** Season Finale for the 2025/2026 Dubai Opera season. label_ru needs proper Russian translation before import.

---

## Coverage update (Phase 6C-77)

| Metric | Value |
|--------|-------|
| Production items (Phase 6C-75) | 5 items — Jun 1, 4-7, 5-11, 11 |
| Production coverage | ~33% |
| Phase 6C-77 enrichment candidates | 4 items: JUN-06-RESET, JUN-15-MALLATHON, JUN-20-BASSI, JUN-24-ORCH |
| Projected coverage after enrichment import | Jun 1, 4-11, 15-30 = approx 25 days = ~83% |
| Already-live cross-page | Jun 30 (uae-emiratisation-june-30-2026-reminder) |
| Remaining gap | Jun 12-14 (3 days) |
| Still HOLD | Islamic New Year (FAHR has not announced) |

Dubai Mallathon (JUN-15-MALLATHON) is the single highest-priority item — fills Jun 15-30 in one import.

---

## Pre-import checklist (Phase 6C-75 items — complete)

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
- [x] Production import — complete (Phase 6C-75, 2026-05-26)

## Pre-import checklist (Phase 6C-77 enrichment — pending)

- [ ] Verify RE:SET show type/genre at dubaiopera.com (owner task — confirm before JUN-06-RESET import)
- [ ] Write proper Russian labels for JUN-20-BASSI and JUN-24-ORCH
- [ ] Write proper Russian brief for JUN-15-MALLATHON
- [ ] Run em dash scan on all new brief and label strings before DB write
- [ ] Write import script for enrichment batch
- [ ] Get owner approval for enrichment import phase

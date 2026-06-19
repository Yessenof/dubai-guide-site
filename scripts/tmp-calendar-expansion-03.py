#!/usr/bin/env python3
"""
Phase 6C-CALENDAR-EXPANSION-03 import script.
Applies to the DB path passed as the first argument (defaults to data/guides.db).
"""

import sqlite3
import json
import sys
import datetime

DB_PATH = sys.argv[1] if len(sys.argv) > 1 else "data/guides.db"
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row

def verify_preconditions():
    # 1. DP World Tour event must not exist
    count = conn.execute("SELECT COUNT(*) FROM events WHERE slug=?", ("dp-world-tour-championship-2026",)).fetchone()[0]
    assert count == 0, f"ABORT: dp-world-tour-championship-2026 already exists in events"

    # 2. All 3 target calendar pages must exist
    for slug in ("november-2026-dubai-calendar", "october-2026-dubai-calendar", "december-2026-uae-calendar"):
        count = conn.execute("SELECT COUNT(*) FROM calendar_pages WHERE slug=?", (slug,)).fetchone()[0]
        assert count == 1, f"ABORT: calendar_pages row missing: {slug}"

    # 3. NOV-R1 must exist in November calendar
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='november-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    nov_ids = [x["id"] for x in items]
    assert "NOV-R1" in nov_ids, "ABORT: NOV-R1 not found in November calendar"

    # 4. New IDs must not already exist
    for item_id in ("NOV-DPWT", "NOV-DFTS", "OCT-DFC", "DEC-CTAX", "DEC-EMIR"):
        if item_id.startswith("NOV"):
            slug = "november-2026-dubai-calendar"
        elif item_id.startswith("OCT"):
            slug = "october-2026-dubai-calendar"
        else:
            slug = "december-2026-uae-calendar"
        row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug=?", (slug,)).fetchone()
        ids = [x["id"] for x in json.loads(row["dates_json"])]
        assert item_id not in ids, f"ABORT: {item_id} already exists in {slug}"

    print("Preconditions OK")

def insert_dp_world_tour_event():
    now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    en_summary = "The DP World Tour Championship is the season-ending Rolex Series event and the finale of the Race to Dubai. The 2026 edition runs 12–15 November at Jumeirah Golf Estates (Earth Course) in Dubai."
    en_body = """## Quick answer

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

The DP World Tour Championship is the culminating event of the DP World Tour’s Rolex Series — a set of elite tournaments with elevated prize funds and global fields. As the season-ending tournament, it determines the Race to Dubai champion, the tour’s equivalent of a season-points title.

The event has been held at Jumeirah Golf Estates’ Earth Course in Dubai since 2009. The 2026 edition runs 12–15 November across a four-day competitive window.

---

## Who should pay attention

Golf fans, premium sports visitors, and business travelers who want to attend one of the UAE’s flagship sporting events in November. Resident expats with a golf interest, corporate hospitality buyers, and anyone planning a November trip to Dubai around a major international sporting event.

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

- [November 2026 UAE calendar](/calendar/november-2026-dubai-calendar)"""

    ru_summary = "Чемпионат DP World Tour — финальный турнир серии Rolex Series и кульминация Гонки в Дубай. Выпуск 2026 года проходит 12–15 ноября на поле Earth Course в Jumeirah Golf Estates, Дубай."
    ru_body = """## Коротко

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

- [Ноябрь 2026 — календарь ОАЭ](/calendar/november-2026-dubai-calendar)"""

    conn.execute("""
        INSERT INTO events (
            id, slug, status, category, color_type, tags_json,
            en_title, en_summary, en_body, en_seo_title, en_meta_description,
            ru_published, ru_title, ru_summary, ru_body, ru_seo_title, ru_meta_description,
            event_date_start, event_date_end, date_confidence, year,
            source_url, featured_homepage, featured_digest, featured_calendar,
            schema_eligible, related_guide_slug, related_news_slug,
            created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        "dp-world-tour-championship-2026",  # id
        "dp-world-tour-championship-2026",  # slug
        "published",
        "festival",
        "major-event",
        '["golf","sports","rolex-series","jumeirah-golf-estates","race-to-dubai"]',
        "DP World Tour Championship 2026 — Dubai",
        en_summary,
        en_body,
        "DP World Tour Championship 2026 | Dubai — Dates, Venue & What to Expect",
        "The DP World Tour Championship 2026 runs 12–15 November at Jumeirah Golf Estates (Earth Course), Dubai. Season-ending Rolex Series event and Race to Dubai finale. Dates, venue, planning notes.",
        1,  # ru_published
        "Чемпионат DP World Tour 2026 в Дубае: даты, место проведения и что учесть",
        ru_summary,
        ru_body,
        "DP World Tour Championship 2026 | Jumeirah Golf Estates, Дубай",
        "Чемпионат DP World Tour 2026 пройдёт 12–15 ноября на поле Earth Course в Jumeirah Golf Estates, Дубай. Финал Rolex Series и Гонки в Дубай. Даты, площадка, практическая информация.",
        "2026-11-12",
        "2026-11-15",
        "confirmed",
        2026,
        "https://www.europeantour.com/dpworld-tour/dp-world-tour-championship-dubai-2026/",
        0,  # featured_homepage
        0,  # featured_digest
        1,  # featured_calendar
        1,  # schema_eligible
        "",  # related_guide_slug
        "",  # related_news_slug
        now,
        now,
    ))
    print("ITEM 1: DP World Tour event INSERT OK")

def append_nov_dpwt():
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='november-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    items.append({
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
        "archive_action": "remove",
    })
    conn.execute("UPDATE calendar_pages SET dates_json=? WHERE slug='november-2026-dubai-calendar'", (json.dumps(items, ensure_ascii=False),))
    print(f"ITEM 2: NOV-DPWT appended (November now has {len(items)} items)")

def append_nov_dfts():
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='november-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    items.append({
        "id": "NOV-DFTS",
        "date": "2026-11-02",
        "label_en": "Dubai FinTech Summit 2026 at Madinat Jumeirah (2–3 November) — organised by DIFC",
        "label_ru": "Dubai FinTech Summit 2026 в Madinat Jumeirah (2–3 ноября) — организатор DIFC",
        "short_label_en": "Dubai FinTech Summit",
        "short_label_ru": "Dubai FinTech Summit",
        "type": "business_event",
        "confidence": "confirmed",
        "priority": 2,
        "detail_url": None,
        "brief_en": "The fourth edition of the Dubai FinTech Summit runs 2–3 November 2026 at Madinat Jumeirah, organised by DIFC. The summit is the region’s flagship fintech event, covering payments, banking technology, regulation and investment. Registration and speaker details via dubaifintechsummit.com.",
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
        "archive_action": "remove",
    })
    conn.execute("UPDATE calendar_pages SET dates_json=? WHERE slug='november-2026-dubai-calendar'", (json.dumps(items, ensure_ascii=False),))
    print(f"ITEM 3: NOV-DFTS appended (November now has {len(items)} items)")

def update_nov_r1():
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='november-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    updated_item = {
        "id": "NOV-R1",
        "date": "2026-11-01",
        "label_en": "Dubai Ride 2026 — citywide cycling event (1 November), part of Dubai Fitness Challenge 30x30 running 31 October to 29 November",
        "label_ru": "Dubai Ride 2026 — городской велозаезд (1 ноября) в рамках Dubai Fitness Challenge 30x30 (31 октября — 29 ноября)",
        "short_label_en": "Dubai Ride / Dubai Fitness Challenge",
        "short_label_ru": "Dubai Ride / Dubai Fitness Challenge",
        "type": "sports_event",
        "confidence": "confirmed",
        "priority": 2,
        "detail_url": None,
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
        "archive_action": "remove",
    }
    new_items = [updated_item if x["id"] == "NOV-R1" else x for x in items]
    conn.execute("UPDATE calendar_pages SET dates_json=? WHERE slug='november-2026-dubai-calendar'", (json.dumps(new_items, ensure_ascii=False),))
    print("ITEM 4: NOV-R1 updated OK")

def append_oct_dfc():
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='october-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    items.append({
        "id": "OCT-DFC",
        "date": "2026-10-31",
        "label_en": "Dubai Fitness Challenge 2026 opens (31 October) — 30x30 active challenge runs through 29 November; Dubai Ride: 1 Nov; Dubai Run: 22 Nov",
        "label_ru": "Старт Dubai Fitness Challenge 2026 (31 октября) — 30 активных дней до 29 ноября; Dubai Ride: 1 ноября; Dubai Run: 22 ноября",
        "short_label_en": "Dubai Fitness Challenge opens",
        "short_label_ru": "Старт Dubai Fitness Challenge",
        "type": "sports_event",
        "confidence": "confirmed",
        "priority": 2,
        "detail_url": None,
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
        "archive_action": "remove",
    })
    conn.execute("UPDATE calendar_pages SET dates_json=? WHERE slug='october-2026-dubai-calendar'", (json.dumps(items, ensure_ascii=False),))
    print(f"ITEM 5: OCT-DFC appended (October now has {len(items)} items)")

def append_dec_ctax():
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='december-2026-uae-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    items.append({
        "id": "DEC-CTAX",
        "date": "2026-12-31",
        "label_en": "UAE Corporate Tax return deadline: 31 December 2026 — for companies with a 31 March 2026 financial year-end (9-month FTA rule)",
        "label_ru": "Срок подачи Corporate Tax в ОАЭ: 31 декабря 2026 — для компаний с финансовым годом до 31 марта 2026 (правило FTA: 9 месяцев)",
        "short_label_en": "Corporate Tax filing deadline",
        "short_label_ru": "Дедлайн Corporate Tax",
        "type": "compliance_deadline",
        "confidence": "confirmed",
        "priority": 1,
        "detail_url": None,
        "brief_en": "Companies with a financial year ending 31 March 2026 must file their UAE Corporate Tax return by 31 December 2026. This follows the Federal Tax Authority’s 9-month filing rule (from year-end to filing deadline). The same rule produced the 30 September 2026 deadline for December 2025 year-end companies. Confirm your company’s financial year-end and file through the EmaraTax portal (emaratax.ae). Source: Federal Tax Authority (tax.gov.ae).",
        "brief_ru": "Компании с финансовым годом, заканчивающимся 31 марта 2026 года, обязаны подать декларацию по UAE Corporate Tax не позднее 31 декабря 2026 года. Это следует из правила FTA: срок подачи — 9 месяцев с окончания финансового года. То же правило дало дедлайн 30 сентября 2026 для компаний с годом до 31 декабря 2025 года. Подача через портал EmaraTax (emaratax.ae). Источник: Федеральное налоговое управление (tax.gov.ae).",
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
        "archive_action": "archive",
    })
    conn.execute("UPDATE calendar_pages SET dates_json=? WHERE slug='december-2026-uae-calendar'", (json.dumps(items, ensure_ascii=False),))
    print(f"ITEM 6: DEC-CTAX appended (December now has {len(items)} items)")

def append_dec_emir():
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='december-2026-uae-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    items.append({
        "id": "DEC-EMIR",
        "date": "2026-12-31",
        "label_en": "UAE Emiratisation: H2 2026 private sector target deadline (31 December) — second semi-annual 1% increase for companies with 50+ employees",
        "label_ru": "Эмиратизация ОАЭ: дедлайн II полугодия 2026 (31 декабря) — второй полугодовой прирост 1% для компаний с 50+ сотрудниками",
        "short_label_en": "Emiratisation H2 deadline",
        "short_label_ru": "Дедлайн эмиратизации II пол.",
        "type": "compliance_deadline",
        "confidence": "confirmed",
        "priority": 1,
        "detail_url": None,
        "brief_en": "Private sector companies with 50 or more employees in targeted sectors must achieve the second semi-annual 1% Emiratisation increase by 31 December 2026. This is the H2 counterpart of the H1 deadline (30 June 2026). The annual target is a 2% total increase in Emirati employees in skilled roles. Non-compliance with Emiratisation targets can result in administrative penalties under MoHRE enforcement. Source: Ministry of Human Resources and Emiratisation (mohre.gov.ae).",
        "brief_ru": "Частные компании с 50+ сотрудниками в целевых секторах обязаны выполнить второй полугодовой прирост эмиратизации на 1% до 31 декабря 2026 года. Это аналог дедлайна I полугодия (30 июня 2026). Годовая цель: совокупный рост на 2% сотрудников-граждан ОАЭ на квалифицированных должностях. Несоблюдение условий эмиратизации влечёт административные санкции согласно законодательству MoHRE. Источник: Министерство кадров и эмиратизации (mohre.gov.ae).",
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
        "archive_action": "archive",
    })
    conn.execute("UPDATE calendar_pages SET dates_json=? WHERE slug='december-2026-uae-calendar'", (json.dumps(items, ensure_ascii=False),))
    print(f"ITEM 7: DEC-EMIR appended (December now has {len(items)} items)")

def verify_results():
    # Check event inserted
    row = conn.execute("SELECT slug, status, event_date_start, event_date_end FROM events WHERE slug='dp-world-tour-championship-2026'").fetchone()
    assert row, "FAIL: dp-world-tour-championship-2026 not found after INSERT"
    print(f"  Event: {row['slug']} | {row['status']} | {row['event_date_start']} – {row['event_date_end']}")

    # Check November counts and IDs
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='november-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    ids = [x["id"] for x in items]
    assert "NOV-DPWT" in ids, "FAIL: NOV-DPWT missing from November"
    assert "NOV-DFTS" in ids, "FAIL: NOV-DFTS missing from November"
    assert "NOV-R1" in ids, "FAIL: NOV-R1 missing from November"
    # Check NOV-R1 was updated
    nov_r1 = next(x for x in items if x["id"] == "NOV-R1")
    assert "30x30" in nov_r1["label_en"], "FAIL: NOV-R1 label_en not updated"
    assert nov_r1["type"] == "sports_event", "FAIL: NOV-R1 type not updated"
    assert nov_r1["noindex_after"] == "2026-11-30", "FAIL: NOV-R1 noindex_after not updated"
    print(f"  November: {len(items)} items, IDs: {ids}")

    # Check October
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='october-2026-dubai-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    ids = [x["id"] for x in items]
    assert "OCT-DFC" in ids, "FAIL: OCT-DFC missing from October"
    print(f"  October: {len(items)} items, IDs include OCT-DFC: {('OCT-DFC' in ids)}")

    # Check December
    row = conn.execute("SELECT dates_json FROM calendar_pages WHERE slug='december-2026-uae-calendar'").fetchone()
    items = json.loads(row["dates_json"])
    ids = [x["id"] for x in items]
    assert "DEC-CTAX" in ids, "FAIL: DEC-CTAX missing from December"
    assert "DEC-EMIR" in ids, "FAIL: DEC-EMIR missing from December"
    # Check no penalty figure
    dec_emir = next(x for x in items if x["id"] == "DEC-EMIR")
    assert "108,000" not in dec_emir.get("brief_en", ""), "FAIL: penalty figure found in DEC-EMIR"
    assert "108,000" not in dec_emir.get("label_en", ""), "FAIL: penalty figure found in DEC-EMIR label"
    # Check no "All companies" in DEC-CTAX
    dec_ctax = next(x for x in items if x["id"] == "DEC-CTAX")
    assert "all companies" not in dec_ctax.get("brief_en", "").lower(), "FAIL: 'all companies' found in DEC-CTAX"
    assert "March 2026" in dec_ctax.get("label_en", ""), "FAIL: March year-end not specified in DEC-CTAX label"
    print(f"  December: {len(items)} items, IDs include DEC-CTAX + DEC-EMIR: {('DEC-CTAX' in ids and 'DEC-EMIR' in ids)}")

    print("\nAll verification checks PASSED")

if __name__ == "__main__":
    print(f"Running against: {DB_PATH}")
    verify_preconditions()
    insert_dp_world_tour_event()
    append_nov_dpwt()
    append_nov_dfts()
    update_nov_r1()
    append_oct_dfc()
    append_dec_ctax()
    append_dec_emir()
    conn.commit()
    print("\nAll writes committed. Running post-write verification...")
    verify_results()
    conn.close()
    print("\nDone.")

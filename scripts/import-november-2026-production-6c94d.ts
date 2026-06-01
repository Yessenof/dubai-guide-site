/**
 * Phase 6C-94D -- November 2026 Production Import
 * PRODUCTION IMPORT -- requires explicit env flag.
 *
 * Run: CONFIRM_PRODUCTION_IMPORT_6C94D=yes npx tsx scripts/import-november-2026-production-6c94d.ts
 *
 * Imports:
 *   EVENT: dubai-design-week-2026        DDW Nov 3-8 2026  (EN+RU, published)
 *   EVENT: big-5-global-dubai-2026       Big 5 Nov 23-26   (EN+RU, published)
 *   CALENDAR: november-2026-dubai-calendar
 *     NOV-04-ADIPEC (2026-11-02)  ADIPEC 2026, Abu Dhabi   conference  L2 brief
 *     NOV-01-DDW    (2026-11-03)  Dubai Design Week 2026   trade_show  L2 brief
 *     NOV-03-BIG5   (2026-11-23)  Big 5 Global 2026        trade_show  L2 brief
 *
 * HOLD (not imported):
 *   NOV-02-DD Downtown Design -- source unreachable, OFFICIAL_PARTIAL only
 *   NOV-05-DFC Dubai Fitness Challenge -- site 403
 *   Global Village Season 31 -- no opening date
 *
 * Sources verified 2026-06-01:
 *   DDW: dubaidesignweek.ae "3 - 8 NOVEMBER 2026" (200)
 *   Big 5: dwtc.com/en/events/the-big-5-2026/ Nov 23-26 (200)
 *   ADIPEC: adipec.com Nov 2-5, Abu Dhabi (200)
 */

import path from "path";
import {
  getAllCalendarPages,
  getAllEvents,
  createEventDraft,
  publishEvent,
  createCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Production safety gate -----------------------------------------------

const CONFIRM_FLAG = process.env.CONFIRM_PRODUCTION_IMPORT_6C94D;
if (CONFIRM_FLAG !== "yes") {
  console.error("\nABORT: Production import requires explicit env flag.");
  console.error("  Run: CONFIRM_PRODUCTION_IMPORT_6C94D=yes npx tsx scripts/import-november-2026-production-6c94d.ts");
  console.error("  This script writes to the production DB. Do not run without owner approval.");
  process.exit(1);
}

const DB_PATH_RESOLVED = path.resolve(process.cwd(), "data", "guides.db");

// ---- Safety ---------------------------------------------------------------

function log(msg: string) { console.log(msg); }
function section(title: string) {
  console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`);
}

section("Production import: Phase 6C-94D -- November 2026");
log(`  DB path: ${DB_PATH_RESOLVED}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Source URLs ----------------------------------------------------------

const DDW_URL    = "https://www.dubaidesignweek.ae";
const DWTC_B5    = "https://www.dwtc.com/en/events/the-big-5-2026/";
const ADIPEC_URL = "https://www.adipec.com/";

// ---- Event: Dubai Design Week 2026 -- EN/RU strings ----------------------

const DDW_EN_TITLE =
  "Dubai Design Week 2026 -- 3 to 8 November at Dubai Design District";

const DDW_EN_SUMMARY =
  "Dubai Design Week 2026 runs 3 to 8 November at Dubai Design District (d3). " +
  "The week-long festival is the region's largest annual gathering of designers, architects, " +
  "interior professionals, and creative industry participants. " +
  "It includes Downtown Design alongside public installations, workshops, talks, exhibitions, and a marketplace.";

const DDW_EN_BODY = `## Quick answer

Dubai Design Week 2026 takes place **3-8 November** at **Dubai Design District (d3)**, Dubai. Entrance to public areas is generally free; some programme events require registration.

---

## Key facts

| Detail | Value |
|--------|-------|
| Dates | 3-8 November 2026 |
| Venue | Dubai Design District (d3), Dubai |
| Event type | Annual design and creative festival |
| Who it is for | Designers, architects, interior professionals, property developers, premium brand buyers, general public |
| Access | Public areas free; some events require registration |
| Organizer | Dubai Design Week |

---

## What it is

Dubai Design Week is the region's largest annual creative festival. It runs for six days across Dubai Design District (d3) and brings together design professionals, architects, interior specialists, brand buyers, and the general public.

The programme covers multiple strands: Downtown Design (a curated trade fair for contemporary and high-end design), public installations across d3, workshops, talks, exhibitions, and an open marketplace. The event runs under the patronage of HH Sheikha Latifa bint Mohammed bin Rashid Al Maktoum.

---

## Who should pay attention

Dubai Design Week is directly relevant if you work in interior design, architecture, or fit-out in the UAE; own or manage a holiday home; run a design, creative, or branding company in Dubai; or are a property developer with an interest in high-end interior trends.

---

## Planning notes

- d3 (Dubai Design District) is located in the Al Quoz area, off Al Khail Road. Take a taxi or rideshare; it is not directly on a Metro line.
- The full 2026 programme, individual event registration, and ticketed components are published on the official website.
- Some exhibition halls and talks have limited capacity -- check the official schedule in advance.

---

## Source note

Dates confirmed from the official Dubai Design Week website (dubaidesignweek.ae): "3 - 8 NOVEMBER 2026" on the homepage. Verified June 2026. Individual sub-event dates and programme details are published by the organizer closer to the event.

---

## See the full November 2026 Dubai calendar

[November 2026 in Dubai -- events, deadlines and key dates](/calendar/november-2026-dubai-calendar)

---

## Related Guidex topics

- [How to get a Holiday Home Permit in Dubai](/guides/holiday-home-permit-dubai)
- [How to set up a mainland company in Dubai](/guides/mainland-company-setup-dubai)`;

const DDW_EN_SEO_TITLE =
  "Dubai Design Week 2026 | 3-8 November, Dubai Design District";

const DDW_EN_META =
  "Dubai Design Week 2026 runs 3-8 November at Dubai Design District (d3). " +
  "The region's largest annual creative festival includes Downtown Design, " +
  "installations, workshops, talks and exhibitions.";

const DDW_RU_TITLE =
  "Dubai Design Week 2026 -- 3-8 ноября в Dubai Design District";

const DDW_RU_SUMMARY =
  "Dubai Design Week 2026 пройдёт с 3 по 8 ноября в Dubai Design District (d3). " +
  "Крупнейший в регионе ежегодный фестиваль дизайна, архитектуры и креативных индустрий. " +
  "Программа: Downtown Design, инсталляции, воркшопы, лекции, выставки и маркетплейс на территории d3.";

const DDW_RU_BODY = `## Быстрый ответ

Dubai Design Week 2026 проходит **3-8 ноября** в **Dubai Design District (d3)**, Дубай. Вход на публичные площадки, как правило, бесплатный; часть мероприятий требует предварительной регистрации.

---

## Ключевые факты

| Параметр | Значение |
|----------|----------|
| Даты | 3-8 ноября 2026 |
| Площадка | Dubai Design District (d3), Дубай |
| Тип события | Ежегодный фестиваль дизайна и креативных индустрий |
| Для кого | Дизайнеры, архитекторы, специалисты по интерьерам, девелоперы, байеры, широкая публика |
| Доступ | Публичные зоны бесплатно; часть мероприятий с регистрацией |
| Организатор | Dubai Design Week |

---

## Что это такое

Dubai Design Week -- крупнейший ежегодный дизайн-фестиваль региона. Шесть дней в Dubai Design District (d3): профессионалы дизайна, архитекторы, специалисты по интерьерам, байеры брендов и широкая аудитория. Программа: Downtown Design (курированная ярмарка дизайна), публичные инсталляции, воркшопы, лекции, выставки и маркетплейс. Проходит под патронажем ЕВ шейхи Латифы бинт Мухаммад бин Рашид Аль Мактум.

---

## Кому стоит обратить внимание

Dubai Design Week важен для тех, кто работает в дизайне интерьеров, архитектуре или отделке в ОАЭ; владеет апартаментами краткосрочной аренды; открывает дизайн-студию или креативное агентство в Дубае; является девелопером с интересом к трендам высококлассных интерьеров.

---

## Практические замечания

- d3 (Dubai Design District) расположен в районе Аль-Куоз, вблизи шоссе Аль-Хайл. Удобнее добираться на такси или через приложение -- прямого выхода к метро нет.
- Полная программа 2026 года, регистрация и платные компоненты публикуются на официальном сайте.
- Часть лекций и выставок с ограниченной вместимостью -- расписание лучше проверять заранее.

---

## Источник

Даты подтверждены на официальном сайте Dubai Design Week (dubaidesignweek.ae): "3 - 8 NOVEMBER 2026". Проверено июнь 2026.

---

## Полный календарь ноября 2026 в Дубае

[Ноябрь 2026 в Дубае -- события, сроки и важные даты](/ru/calendar/november-2026-dubai-calendar)

---

## Связанные материалы Guidex

- [Разрешение на краткосрочную аренду в Дубае](/ru/guides/holiday-home-permit-dubai)
- [Открытие компании на материке в Дубае](/ru/guides/mainland-company-setup-dubai)`;

const DDW_RU_SEO_TITLE =
  "Dubai Design Week 2026 | 3-8 ноября, Dubai Design District";

const DDW_RU_META =
  "Dubai Design Week 2026 пройдёт 3-8 ноября в Dubai Design District (d3). " +
  "Крупнейший в регионе ежегодный фестиваль дизайна: ярмарка Downtown Design, " +
  "инсталляции, воркшопы, лекции и выставки.";

// ---- Event: Big 5 Global 2026 -- EN/RU strings ---------------------------

const B5_EN_TITLE =
  "Big 5 Global 2026 -- 23 to 26 November at Dubai World Trade Centre";

const B5_EN_SUMMARY =
  "Big 5 Global 2026 takes place 23 to 26 November at Dubai World Trade Centre, " +
  "organised by DMG Events. " +
  "The event is the Middle East's largest trade exhibition for building, construction, " +
  "interior fit-out, and facility management. Attendance is open to trade and industry professionals only.";

const B5_EN_BODY = `## Quick answer

Big 5 Global 2026 runs **23-26 November** at **Dubai World Trade Centre**. It covers building, construction, interior fit-out, smart buildings, HVAC, and facility management. Trade professionals only -- advance registration is required.

---

## Key facts

| Detail | Value |
|--------|-------|
| Dates | 23-26 November 2026 |
| Venue | Dubai World Trade Centre (Exhibition Plaza, Halls 1-8, Za'abeel Halls, Sheikh Maktoum and Sheikh Rashid Halls) |
| Event type | Trade exhibition |
| Industry | Building, construction, interior fit-out, facility management, smart buildings, HVAC |
| Access | Trade professionals only -- registration required |
| Organizer | DMG Events |

---

## What it is

Big 5 Global is the Middle East's leading annual trade exhibition for the building and construction sector. It takes place at Dubai World Trade Centre and spans the full venue complex. The show covers structural building systems, interior fit-out and finishes, HVAC and MEP engineering, smart building technology, sustainable construction, and facility management. Organised by DMG Events.

---

## Who should pay attention

Big 5 Global is relevant if you work in construction, contracting, real estate development, or property investment in the UAE; run or are setting up a fit-out or engineering company in Dubai; supply building materials or smart home technology; or are a property developer evaluating construction technology.

---

## Planning notes

- Registration is required in advance. Check big5events.com for details.
- The event spans the full Dubai World Trade Centre complex -- plan for multiple halls across 4 days.
- Dubai World Trade Centre is directly connected to the Dubai Metro (World Trade Centre station, Red Line).

---

## Source note

Dates confirmed from the DWTC official event page (dwtc.com/en/events/the-big-5-2026/): "23 - 26 Nov 2026" and page metadata 2026-11-23 to 2026-11-26. Organizer DMG Events confirmed on the same page. Verified June 2026.

---

## See the full November 2026 Dubai calendar

[November 2026 in Dubai -- events, deadlines and key dates](/calendar/november-2026-dubai-calendar)

---

## Related Guidex topics

- [How to set up a mainland company in Dubai](/guides/mainland-company-setup-dubai)
- [How to set up a free zone company in Dubai](/guides/free-zone-company-setup-dubai)`;

const B5_EN_SEO_TITLE =
  "Big 5 Global 2026 Dubai | 23-26 November, Dubai World Trade Centre";

const B5_EN_META =
  "Big 5 Global 2026 takes place 23-26 November at Dubai World Trade Centre. " +
  "The Middle East's largest trade show for building, construction, and facility management, " +
  "organised by DMG Events. Trade professionals only.";

const B5_RU_TITLE =
  "Big 5 Global 2026 -- 23-26 ноября в Dubai World Trade Centre";

const B5_RU_SUMMARY =
  "Big 5 Global 2026 пройдёт с 23 по 26 ноября в Dubai World Trade Centre, организатор DMG Events. " +
  "Крупнейшая в регионе ежегодная отраслевая выставка по строительству, отделке и управлению объектами. " +
  "Участие только для специалистов отрасли.";

const B5_RU_BODY = `## Быстрый ответ

Big 5 Global 2026 проходит **23-26 ноября** в **Dubai World Trade Centre**. Тематика: строительство, отделка интерьеров, умные здания, HVAC и управление объектами. Только для профессионалов -- требуется предварительная регистрация.

---

## Ключевые факты

| Параметр | Значение |
|----------|----------|
| Даты | 23-26 ноября 2026 |
| Площадка | Dubai World Trade Centre (Exhibition Plaza, Залы 1-8, Za'abeel Halls, залы шейха Мактума и шейха Рашида) |
| Тип события | Отраслевая выставка |
| Отрасли | Строительство, отделка, управление объектами, умные здания, HVAC |
| Доступ | Только профессионалы -- обязательна предварительная регистрация |
| Организатор | DMG Events |

---

## Что это такое

Big 5 Global -- крупнейшая ежегодная отраслевая выставка по строительству и смежным секторам на Ближнем Востоке. Занимает весь комплекс Dubai World Trade Centre. Тематика: конструктивные системы зданий, отделка помещений, HVAC и инженерные системы, технологии умных зданий, экологичное строительство, управление объектами. Организатор: DMG Events. Участие -- только для профессионалов.

---

## Кому стоит обратить внимание

Big 5 Global важен для тех, кто работает в строительстве, девелопменте или управлении объектами в ОАЭ; открывает компанию в сфере отделки или инженерных систем в Дубае; поставляет строительные материалы или оборудование; является архитектором или девелопером.

---

## Практические замечания

- Регистрация обязательна заранее: big5events.com.
- Выставка занимает весь комплекс DWTC -- рекомендуется планировать несколько дней из четырёх.
- Dubai World Trade Centre напрямую связан с метро (станция World Trade Centre, Красная линия).

---

## Источник

Даты подтверждены на официальной странице DWTC (dwtc.com/en/events/the-big-5-2026/): "23 - 26 Nov 2026", метаданные 2026-11-23 -- 2026-11-26. Организатор DMG Events указан на той же странице. Проверено июнь 2026.

---

## Полный календарь ноября 2026 в Дубае

[Ноябрь 2026 в Дубае -- события, сроки и важные даты](/ru/calendar/november-2026-dubai-calendar)

---

## Связанные материалы Guidex

- [Открытие компании на материке в Дубае](/ru/guides/mainland-company-setup-dubai)
- [Открытие компании в свободной зоне Дубая](/ru/guides/free-zone-company-setup-dubai)`;

const B5_RU_SEO_TITLE =
  "Big 5 Global 2026 Дубай | 23-26 ноября, Dubai World Trade Centre";

const B5_RU_META =
  "Big 5 Global 2026 пройдёт 23-26 ноября в Dubai World Trade Centre. " +
  "Крупнейшая на Ближнем Востоке строительная выставка, организатор DMG Events. Только для профессионалов отрасли.";

// ---- Calendar: November 2026 page-level strings --------------------------

const CAL_EN_TITLE =
  "November 2026 in Dubai: Dubai Design Week, Big 5 Global and ADIPEC";

const CAL_RU_TITLE =
  "Ноябрь 2026 в Дубае: Dubai Design Week, Big 5 Global и ADIPEC в Абу-Даби";

const CAL_EN_SUMMARY =
  "November 2026 in Dubai brings two major professional events: " +
  "Dubai Design Week at Dubai Design District (3-8 November) and Big 5 Global at DWTC (23-26 November). " +
  "ADIPEC 2026, the world's largest energy conference, takes place 2-5 November in Abu Dhabi.";

const CAL_RU_SUMMARY =
  "В ноябре 2026 года в Дубае состоятся два крупных отраслевых события: " +
  "Dubai Design Week в Dubai Design District (3-8 ноября) и Big 5 Global в DWTC (23-26 ноября). " +
  "ADIPEC 2026, крупнейшая в мире энергетическая конференция, пройдёт 2-5 ноября в Абу-Даби.";

const CAL_EN_BODY =
  "November 2026 opens with ADIPEC (2-5 November, Abu Dhabi) and Dubai Design Week (3-8 November, d3). " +
  "The festival features Downtown Design -- the region's leading contemporary design fair -- alongside " +
  "installations, workshops, talks, and an open marketplace. " +
  "Big 5 Global, the Middle East's largest construction and fit-out trade show organized by DMG Events, " +
  "anchors the second half of the month (23-26 November, DWTC). " +
  "November has no UAE public holiday.\n\n" +
  "Source dates are drawn from official government and organizer announcements. " +
  "ADIPEC takes place in Abu Dhabi, not Dubai.";

const CAL_RU_BODY =
  "Ноябрь 2026 года открывается ADIPEC (2-5 ноября, Абу-Даби) и Dubai Design Week (3-8 ноября, d3). " +
  "В рамках фестиваля проходит Downtown Design -- ведущая в регионе ярмарка современного дизайна, -- " +
  "а также инсталляции, воркшопы, лекции и маркетплейс. " +
  "Big 5 Global, крупнейшая на Ближнем Востоке строительная и дизайн-выставка от DMG Events, " +
  "занимает вторую половину месяца (23-26 ноября, DWTC). " +
  "В ноябре праздничных дней в ОАЭ нет.\n\n" +
  "Даты основаны на официальных объявлениях организаторов и государственных органов. " +
  "ADIPEC проходит в Абу-Даби, не в Дубае.";

const CAL_EN_NOTES =
  "Dubai Design Week and Downtown Design are professional events open to the public in common areas. " +
  "Big 5 Global is trade-only; registration required. " +
  "ADIPEC is in Abu Dhabi (ADNEC), not Dubai.";

const CAL_RU_NOTES =
  "Dubai Design Week и Downtown Design -- профессиональные мероприятия с открытым доступом в общие зоны. " +
  "Big 5 Global -- только для профессионалов, требуется регистрация. " +
  "ADIPEC проходит в Абу-Даби (ADNEC), не в Дубае.";

const CAL_EN_SEO_TITLE =
  "November 2026 Dubai calendar: Dubai Design Week, Big 5 Global and ADIPEC";

const CAL_RU_SEO_TITLE =
  "Ноябрь 2026 Дубай: Dubai Design Week, Big 5 Global и ADIPEC в Абу-Даби";

const CAL_EN_META =
  "November 2026 in Dubai: Dubai Design Week at d3 (3-8 Nov), Big 5 Global at DWTC (23-26 Nov), " +
  "ADIPEC in Abu Dhabi (2-5 Nov).";

const CAL_RU_META =
  "Ноябрь 2026 в Дубае: Dubai Design Week в d3 (3-8 нояб.), Big 5 Global в DWTC (23-26 нояб.), " +
  "ADIPEC в Абу-Даби (2-5 нояб.).";

const CAL_SLUG       = "november-2026-dubai-calendar";
const DDW_EVENT_SLUG = "dubai-design-week-2026";
const B5_EVENT_SLUG  = "big-5-global-dubai-2026";

// ---- Calendar dates_json (3 items) ----------------------------------------

const DATES_JSON = JSON.stringify([

  // NOV-04-ADIPEC -- ADIPEC 2026, Abu Dhabi (Nov 2-5)
  {
    id: "NOV-04-ADIPEC",
    date: "2026-11-02",
    label_en: "ADIPEC 2026 at ADNEC, Abu Dhabi (2-5 November) -- world's largest energy exhibition",
    label_ru: "ADIPEC 2026 в ADNEC, Абу-Даби (2-5 ноября) -- крупнейшая в мире энергетическая выставка",
    short_label_en: "ADIPEC Abu Dhabi",
    short_label_ru: "ADIPEC Абу-Даби",
    type: "conference",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "ADIPEC 2026 (Abu Dhabi International Petroleum Exhibition and Conference) takes place 2-5 November at ADNEC, Abu Dhabi. It is the world's largest energy exhibition and conference, bringing together oil and gas companies, renewable energy firms, technology providers, and investors from over 160 countries. ADIPEC is in Abu Dhabi, approximately 130 km from Dubai.",
    brief_ru: "ADIPEC 2026 (Абу-Дабийская международная нефтяная выставка и конференция) пройдёт 2-5 ноября в ADNEC, Абу-Даби. Это крупнейшее в мире отраслевое событие в сфере энергетики: нефтегаз, возобновляемая энергетика, технологические компании и инвесторы из более 160 стран. ADIPEC проходит в Абу-Даби, примерно в 130 км от Дубая.",
    source_label_en: "ADIPEC: official",
    source_label_ru: "ADIPEC: официально",
    source_url: ADIPEC_URL,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: ADIPEC_URL,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Abu Dhabi",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-06",
    archive_action: "remove",
  },

  // NOV-01-DDW -- Dubai Design Week 2026 (Nov 3-8)
  {
    id: "NOV-01-DDW",
    date: "2026-11-03",
    label_en: "Dubai Design Week 2026 at Dubai Design District (3-8 November, includes Downtown Design)",
    label_ru: "Dubai Design Week 2026 в Dubai Design District (3-8 ноября, включая Downtown Design)",
    short_label_en: "Design Week",
    short_label_ru: "Design Week",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/events/dubai-design-week-2026",
    brief_en: "Dubai Design Week 2026 runs 3-8 November at Dubai Design District (d3). The region's largest annual creative festival includes Downtown Design -- a curated fair for contemporary and high-end design -- alongside public installations, workshops, talks, exhibitions, and a marketplace. The event is under the patronage of HH Sheikha Latifa bint Mohammed bin Rashid Al Maktoum.",
    brief_ru: "Dubai Design Week 2026 пройдёт с 3 по 8 ноября в Dubai Design District (d3). Крупнейший в регионе ежегодный дизайн-фестиваль включает Downtown Design -- курированную ярмарку современного и премиального дизайна, -- а также публичные инсталляции, воркшопы, лекции, выставки и маркетплейс. Проходит под патронажем ЕВ шейхи Латифы бинт Мухаммад Аль Мактум.",
    source_label_en: "Dubai Design Week: official",
    source_label_ru: "Dubai Design Week: официально",
    source_url: DDW_URL,
    source_status: "confirmed",
    cta_type: "view_details",
    cta_url: "/events/dubai-design-week-2026",
    cta_label_en: "Event details",
    cta_label_ru: "Подробнее о событии",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-09",
    archive_action: "remove",
  },

  // NOV-03-BIG5 -- Big 5 Global 2026 (Nov 23-26)
  {
    id: "NOV-03-BIG5",
    date: "2026-11-23",
    label_en: "Big 5 Global 2026 at Dubai World Trade Centre (23-26 November), organised by DMG Events",
    label_ru: "Big 5 Global 2026 в Dubai World Trade Centre (23-26 ноября), организатор DMG Events",
    short_label_en: "Big 5 Global",
    short_label_ru: "Big 5 Global",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/events/big-5-global-dubai-2026",
    brief_en: "Big 5 Global 2026 takes place 23-26 November at Dubai World Trade Centre, organised by DMG Events. The Middle East's largest trade exhibition for building, construction, interior fit-out, smart buildings, HVAC, and facility management. Attendance is for trade and industry professionals only -- advance registration required at big5events.com.",
    brief_ru: "Big 5 Global 2026 пройдёт 23-26 ноября в Dubai World Trade Centre. Организатор: DMG Events. Крупнейшая в регионе отраслевая выставка по строительству, отделке, умным зданиям, HVAC и управлению объектами. Только для профессионалов отрасли -- регистрация на big5events.com.",
    source_label_en: "DWTC: official",
    source_label_ru: "DWTC: официально",
    source_url: DWTC_B5,
    source_status: "confirmed",
    cta_type: "view_details",
    cta_url: "/events/big-5-global-dubai-2026",
    cta_label_en: "Event details",
    cta_label_ru: "Подробнее о событии",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-27",
    archive_action: "remove",
  },

]);

// ---- Pre-flight em dash validation ----------------------------------------

section("Pre-flight: em dash validation");

const EM = "—";
const ALL_STRINGS: Array<[string, string]> = [
  ["DDW_EN_TITLE",   DDW_EN_TITLE],   ["DDW_EN_SUMMARY", DDW_EN_SUMMARY],
  ["DDW_EN_BODY",    DDW_EN_BODY],    ["DDW_EN_SEO_TITLE", DDW_EN_SEO_TITLE],
  ["DDW_EN_META",    DDW_EN_META],    ["DDW_RU_TITLE",   DDW_RU_TITLE],
  ["DDW_RU_SUMMARY", DDW_RU_SUMMARY], ["DDW_RU_BODY",    DDW_RU_BODY],
  ["DDW_RU_SEO_TITLE", DDW_RU_SEO_TITLE], ["DDW_RU_META", DDW_RU_META],
  ["B5_EN_TITLE",    B5_EN_TITLE],    ["B5_EN_SUMMARY",  B5_EN_SUMMARY],
  ["B5_EN_BODY",     B5_EN_BODY],     ["B5_EN_SEO_TITLE", B5_EN_SEO_TITLE],
  ["B5_EN_META",     B5_EN_META],     ["B5_RU_TITLE",    B5_RU_TITLE],
  ["B5_RU_SUMMARY",  B5_RU_SUMMARY],  ["B5_RU_BODY",     B5_RU_BODY],
  ["B5_RU_SEO_TITLE", B5_RU_SEO_TITLE], ["B5_RU_META",   B5_RU_META],
  ["CAL_EN_TITLE",   CAL_EN_TITLE],   ["CAL_RU_TITLE",   CAL_RU_TITLE],
  ["CAL_EN_SUMMARY", CAL_EN_SUMMARY], ["CAL_RU_SUMMARY", CAL_RU_SUMMARY],
  ["CAL_EN_BODY",    CAL_EN_BODY],    ["CAL_RU_BODY",    CAL_RU_BODY],
  ["CAL_EN_NOTES",   CAL_EN_NOTES],   ["CAL_RU_NOTES",   CAL_RU_NOTES],
  ["CAL_EN_SEO_TITLE", CAL_EN_SEO_TITLE], ["CAL_RU_SEO_TITLE", CAL_RU_SEO_TITLE],
  ["CAL_EN_META",    CAL_EN_META],    ["CAL_RU_META",    CAL_RU_META],
  ["DATES_JSON",     DATES_JSON],
];

for (const [label, value] of ALL_STRINGS) {
  if (value.includes(EM)) {
    console.error(`\nABORT: em dash found in "${label}". Fix before re-running.`);
    process.exit(1);
  }
}
log("  All strings clean -- no em dashes found.");

// ---- Pre-flight: HOLD items must not appear --------------------------------

section("Pre-flight: HOLD item guards");

const parsedDates = JSON.parse(DATES_JSON) as Array<{ id: string; date: string; label_en?: string }>;

const dfc = parsedDates.find(d =>
  d.id?.includes("DFC") || d.label_en?.toLowerCase().includes("fitness challenge")
);
if (dfc) {
  console.error(`\nABORT: DFC found in DATES_JSON. DFC is HOLD (site 403) -- do not import.`);
  process.exit(1);
}
log("  DFC: not present. PASS");

const dd = parsedDates.find(d =>
  d.id === "NOV-02-DD" ||
  (d.label_en?.toLowerCase().includes("downtown design") && d.id !== "NOV-01-DDW")
);
if (dd) {
  console.error(`\nABORT: Downtown Design found as standalone item. Source unreachable -- do not import.`);
  process.exit(1);
}
log("  Downtown Design standalone: not present. PASS");

const gv = parsedDates.find(d =>
  d.label_en?.toLowerCase().includes("global village") || d.id?.includes("GV")
);
if (gv) {
  console.error(`\nABORT: Global Village found in DATES_JSON. No confirmed opening date -- do not import.`);
  process.exit(1);
}
log("  Global Village: not present. PASS");

// ADIPEC must be Abu Dhabi
const adipecItem = parsedDates.find(d => d.id === "NOV-04-ADIPEC");
if (!adipecItem) {
  console.error(`\nABORT: NOV-04-ADIPEC not found in DATES_JSON.`);
  process.exit(1);
}
if ((adipecItem as Record<string, unknown>)["emirate"] !== "Abu Dhabi") {
  console.error(`\nABORT: ADIPEC item emirate is not "Abu Dhabi". Check content before importing.`);
  process.exit(1);
}
log("  ADIPEC emirate=Abu Dhabi: confirmed. PASS");

// ---- Pre-flight: slug existence (abort if already imported) ---------------

section("Pre-flight: slug existence check");

const existingEvents = getAllEvents();
for (const slug of [DDW_EVENT_SLUG, B5_EVENT_SLUG]) {
  const found = existingEvents.find(e => e.slug === slug);
  if (found) {
    console.error(`\nABORT: Event slug "${slug}" already exists (id=${found.id}, status=${found.status}).`);
    console.error("  Production import is NOT idempotent -- delete the row or skip this import.");
    process.exit(1);
  }
}
log("  Event slugs not found -- safe to create.");

const existingCalendars = getAllCalendarPages();
const foundCal = existingCalendars.find(p => p.slug === CAL_SLUG);
if (foundCal) {
  console.error(`\nABORT: Calendar slug "${CAL_SLUG}" already exists (id=${foundCal.id}, status=${foundCal.status}).`);
  process.exit(1);
}
log(`  Calendar slug "${CAL_SLUG}" not found -- safe to create.`);
log(`  Current events count: ${existingEvents.length}`);
log(`  Current calendar_pages count: ${existingCalendars.length}`);

// ---- Validate DATES_JSON IDs ----------------------------------------------

section("Validate DATES_JSON");
const expectedIds = new Set(["NOV-04-ADIPEC", "NOV-01-DDW", "NOV-03-BIG5"]);
const seenIds = new Set<string>();
for (const item of parsedDates) {
  if (seenIds.has(item.id)) {
    console.error(`\nABORT: Duplicate id "${item.id}" in DATES_JSON.`);
    process.exit(1);
  }
  seenIds.add(item.id);
}
for (const id of expectedIds) {
  if (!seenIds.has(id)) {
    console.error(`\nABORT: Expected id "${id}" missing from DATES_JSON.`);
    process.exit(1);
  }
}
log(`  ${parsedDates.length} items, IDs: ${[...seenIds].join(", ")}. PASS`);

// ---- Import Event: Dubai Design Week 2026 ----------------------------------

section("Import Event: dubai-design-week-2026");

const ddwResult = createEventDraft({
  slug:                DDW_EVENT_SLUG,
  category:            "festival",
  color_type:          "major-event",
  tags_json:           JSON.stringify(["design","interior","architecture","d3","trade-show"]),
  en_title:            DDW_EN_TITLE,
  en_summary:          DDW_EN_SUMMARY,
  en_body:             DDW_EN_BODY,
  en_seo_title:        DDW_EN_SEO_TITLE,
  en_meta_description: DDW_EN_META,
  ru_published:        1,
  ru_title:            DDW_RU_TITLE,
  ru_summary:          DDW_RU_SUMMARY,
  ru_body:             DDW_RU_BODY,
  ru_seo_title:        DDW_RU_SEO_TITLE,
  ru_meta_description: DDW_RU_META,
  event_date_start:    "2026-11-03",
  event_date_end:      "2026-11-08",
  date_confidence:     "confirmed",
  year:                2026,
  source_url:          DDW_URL,
  featured_homepage:   0,
  featured_digest:     0,
  featured_calendar:   1,
  schema_eligible:     1,
  related_guide_slug:  "",
  related_news_slug:   "",
});

if (!ddwResult.ok) {
  console.error("  FAIL createEventDraft DDW:", ddwResult.errors);
  process.exit(1);
}
const ddwId = ddwResult.id!;
log(`  Draft created. id=${ddwId}`);

const ddwPub = publishEvent(ddwId);
if (!ddwPub.ok) {
  console.error("  FAIL publishEvent DDW:", ddwPub.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${ddwPub.warnings.length ? ddwPub.warnings.join("; ") : "none"}`);

// ---- Import Event: Big 5 Global 2026 ----------------------------------------

section("Import Event: big-5-global-dubai-2026");

const b5Result = createEventDraft({
  slug:                B5_EVENT_SLUG,
  category:            "dubai-event",
  color_type:          "major-event",
  tags_json:           JSON.stringify(["construction","trade-show","dwtc","real-estate","fit-out","facility-management"]),
  en_title:            B5_EN_TITLE,
  en_summary:          B5_EN_SUMMARY,
  en_body:             B5_EN_BODY,
  en_seo_title:        B5_EN_SEO_TITLE,
  en_meta_description: B5_EN_META,
  ru_published:        1,
  ru_title:            B5_RU_TITLE,
  ru_summary:          B5_RU_SUMMARY,
  ru_body:             B5_RU_BODY,
  ru_seo_title:        B5_RU_SEO_TITLE,
  ru_meta_description: B5_RU_META,
  event_date_start:    "2026-11-23",
  event_date_end:      "2026-11-26",
  date_confidence:     "confirmed",
  year:                2026,
  source_url:          DWTC_B5,
  featured_homepage:   0,
  featured_digest:     0,
  featured_calendar:   1,
  schema_eligible:     1,
  related_guide_slug:  "mainland-company-setup-dubai",
  related_news_slug:   "",
});

if (!b5Result.ok) {
  console.error("  FAIL createEventDraft Big5:", b5Result.errors);
  process.exit(1);
}
const b5Id = b5Result.id!;
log(`  Draft created. id=${b5Id}`);

const b5Pub = publishEvent(b5Id);
if (!b5Pub.ok) {
  console.error("  FAIL publishEvent Big5:", b5Pub.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${b5Pub.warnings.length ? b5Pub.warnings.join("; ") : "none"}`);

// ---- Import Calendar: november-2026-dubai-calendar -------------------------

section("Import Calendar: november-2026-dubai-calendar");

const calResult = createCalendarDraft({
  slug:                CAL_SLUG,
  calendar_type:       "monthly",
  year:                2026,
  month:               11,
  en_title:            CAL_EN_TITLE,
  en_summary:          CAL_EN_SUMMARY,
  en_body:             CAL_EN_BODY,
  en_notes:            CAL_EN_NOTES,
  en_seo_title:        CAL_EN_SEO_TITLE,
  en_meta_description: CAL_EN_META,
  ru_published:        1,
  ru_title:            CAL_RU_TITLE,
  ru_summary:          CAL_RU_SUMMARY,
  ru_body:             CAL_RU_BODY,
  ru_notes:            CAL_RU_NOTES,
  ru_seo_title:        CAL_RU_SEO_TITLE,
  ru_meta_description: CAL_RU_META,
  dates_json:          DATES_JSON,
  last_verified_date:  "2026-06-01",
  featured_homepage:   0,
  image_path:          "/images/hubs/dubai-skyline-downtown.webp",
  image_alt:           "Dubai, November 2026 events and key dates",
  ru_image_alt:        "Дубай, события и важные даты ноября 2026",
  official_source_url: DDW_URL,
});

if (!calResult.ok) {
  console.error("  FAIL createCalendarDraft:", calResult.errors);
  process.exit(1);
}
const calId = calResult.id!;
log(`  Draft created. id=${calId}`);

const calPub = publishCalendar(calId);
if (!calPub.ok) {
  console.error("  FAIL publishCalendar:", calPub.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${calPub.warnings.length ? calPub.warnings.join("; ") : "none"}`);

// ---- Post-import verification ---------------------------------------------

section("Post-import verification");

const verifyEvents = getAllEvents();
const ddwRow  = verifyEvents.find(e => e.slug === DDW_EVENT_SLUG);
const b5Row   = verifyEvents.find(e => e.slug === B5_EVENT_SLUG);
const verifyCals = getAllCalendarPages();
const calRow  = verifyCals.find(p => p.slug === CAL_SLUG);

let verifyFail = false;
if (!ddwRow || ddwRow.status !== "published") {
  console.error(`  FAIL: ${DDW_EVENT_SLUG} not found or not published.`);
  verifyFail = true;
} else {
  log(`  ${DDW_EVENT_SLUG}: status=${ddwRow.status}, id=${ddwRow.id} PASS`);
}

if (!b5Row || b5Row.status !== "published") {
  console.error(`  FAIL: ${B5_EVENT_SLUG} not found or not published.`);
  verifyFail = true;
} else {
  log(`  ${B5_EVENT_SLUG}: status=${b5Row.status}, id=${b5Row.id} PASS`);
}

if (!calRow || calRow.status !== "published") {
  console.error(`  FAIL: ${CAL_SLUG} not found or not published.`);
  verifyFail = true;
} else {
  log(`  ${CAL_SLUG}: status=${calRow.status}, id=${calRow.id} PASS`);
}

if (verifyFail) {
  console.error("\nIMPORT VERIFICATION FAILED -- check rows above.");
  process.exit(1);
}

// ---- Summary ---------------------------------------------------------------

section("Import complete -- summary");

log(`
DB PATH: ${DB_PATH_RESOLVED}

EVENTS CREATED AND PUBLISHED (2):

  DDW:  id=${ddwId}
        slug=${DDW_EVENT_SLUG}
        url=/events/${DDW_EVENT_SLUG}
        ru_url=/ru/events/${DDW_EVENT_SLUG}
        dates=2026-11-03 to 2026-11-08
        category=festival  color_type=major-event

  Big5: id=${b5Id}
        slug=${B5_EVENT_SLUG}
        url=/events/${B5_EVENT_SLUG}
        ru_url=/ru/events/${B5_EVENT_SLUG}
        dates=2026-11-23 to 2026-11-26
        category=dubai-event  color_type=major-event

CALENDAR CREATED AND PUBLISHED (1):

  Calendar: id=${calId}
            slug=${CAL_SLUG}
            url=/calendar/${CAL_SLUG}
            ru_url=/ru/calendar/${CAL_SLUG}
            month=11 year=2026 type=monthly
            last_verified_date=2026-06-01

DATES_JSON ITEMS (3 total):
  NOV-04-ADIPEC  ADIPEC 2026 (Abu Dhabi)    2026-11-02  conference   detail_url=null
  NOV-01-DDW     Dubai Design Week 2026     2026-11-03  trade_show   detail_url=/events/dubai-design-week-2026
  NOV-03-BIG5    Big 5 Global 2026          2026-11-23  trade_show   detail_url=/events/big-5-global-dubai-2026

HOLD (not imported):
  NOV-02-DD   Downtown Design -- source unreachable
  NOV-05-DFC  Dubai Fitness Challenge -- site 403
  Global Village Season 31 -- no opening date

ROWS INSERTED: 2 events + 1 calendar_page = 3 total
`);

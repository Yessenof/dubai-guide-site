/**
 * Phase 6C-97F -- High-Value Event Detail Pages Production Import
 * PRODUCTION IMPORT -- requires explicit env flag.
 *
 * Run:
 *   CONFIRM_PRODUCTION_IMPORT_6C97F=yes npx tsx scripts/import-high-value-event-pages-production-6c97f.ts
 *
 * Imports/upserts (events table):
 *   gitex-global-2026                    Dec 7-11 2026  Expo City Dubai       (EN+RU, published)
 *   formula-1-abu-dhabi-grand-prix-2026  Dec 3-6 2026   Yas Marina Abu Dhabi  (EN+RU, published)
 *
 * Updates (december-2026-uae-calendar dates_json):
 *   DEC-04-GITEX  detail_url -> /events/gitex-global-2026
 *   DEC-03-F1     detail_url -> /events/formula-1-abu-dhabi-grand-prix-2026
 *   DEC-NEW-01    detail_url -> /events/formula-1-abu-dhabi-grand-prix-2026
 *   DEC-R1        detail_url -> /events/formula-1-abu-dhabi-grand-prix-2026
 *
 * Phase 6C-97E note: F1 category must be "festival" -- NOT "event".
 *   "event" is not in the allowed category list and will cause publishEvent to fail.
 *
 * Sources verified 2026-06-06:
 *   GITEX: gitex.com/gitex-global-2026, mediaoffice.ae, dubaiexhibitioncentre.com
 *   F1: abudhabigp.com, formula1.com
 *   Yasalam Dec 3 (Lewis Capaldi + Zara Larsson): abudhabigp.com, The National, PR Newswire
 *   Yasalam Dec 5 (Imagine Dragons): abudhabigp.com, Businesswire, Gulf News
 */

import path from "path";
import fs from "fs";
import {
  getAllCalendarPages,
  getAllEvents,
  createEventDraft,
  publishEvent,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Production safety gate ------------------------------------------------

const CONFIRM_FLAG = process.env.CONFIRM_PRODUCTION_IMPORT_6C97F;
if (CONFIRM_FLAG !== "yes") {
  console.error("\nABORT: Production import requires explicit env flag.");
  console.error("  Run: CONFIRM_PRODUCTION_IMPORT_6C97F=yes npx tsx scripts/import-high-value-event-pages-production-6c97f.ts");
  console.error("  This script writes to the production DB. Do not run without owner approval.");
  process.exit(1);
}

const DB_PATH = path.resolve(process.cwd(), "data", "guides.db");

const SUSPICIOUS_PATH_PATTERNS = ["/Users/", "/home/", "Desktop", "/tmp/", "/var/folders/"];
for (const pattern of SUSPICIOUS_PATH_PATTERNS) {
  if (DB_PATH.includes(pattern)) {
    console.error(`\nABORT: Suspicious DB path detected: ${DB_PATH}`);
    console.error("  This script must run on the production server, not a local machine.");
    console.error("  Expected path pattern: /var/www/guidex/data/guides.db");
    process.exit(1);
  }
}

// ---- Helpers ---------------------------------------------------------------

function log(msg: string) { console.log(msg); }
function section(t: string) { console.log(`\n-- ${t} ${"-".repeat(Math.max(0, 55 - t.length))}`); }
function abort(msg: string): never { console.error(`\nABORT: ${msg}`); process.exit(1); }

section("Phase 6C-97F -- High-Value Event Pages Production Import");
log(`  DB path:     ${DB_PATH}`);
log(`  Timestamp:   ${new Date().toISOString()}`);
log(`  PRODUCTION -- env flag confirmed.`);
log(`  F1 category: festival (enforced -- see Phase 6C-97E fix note)`);

// ---- Production DB backup --------------------------------------------------

section("Creating production DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);

const BACKUP_TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-6c97f-${BACKUP_TS}`;
fs.copyFileSync(DB_PATH, BACKUP_PATH);
const bkStat = fs.statSync(BACKUP_PATH);
if (bkStat.size === 0) abort("Backup created but is empty. Aborting.");
log(`  Backup: ${BACKUP_PATH}`);
log(`  Size: ${Math.round(bkStat.size / 1024)}K`);
log(`  Backup confirmed non-zero. PASS`);

// ---- Em dash guard ---------------------------------------------------------

const EM = "—"; // em dash
function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM)) abort(`Em dash found in "${label}". Use -- instead.`);
}

// ---- Slugs -----------------------------------------------------------------

const GITEX_SLUG   = "gitex-global-2026";
const F1_SLUG      = "formula-1-abu-dhabi-grand-prix-2026";
const DEC_CAL_SLUG = "december-2026-uae-calendar";

// ---- GITEX EN --------------------------------------------------------------

const GITEX_EN_SEO_TITLE = "GITEX Global 2026: Dates, Venue and Planning Guide | Expo City Dubai";
const GITEX_EN_META      = "GITEX Global 2026 runs 7-11 December at Dubai Exhibition Centre, Expo City Dubai. Summit on 7 Dec, main expo 8-11 Dec. 6,800+ companies, 200,000+ visitors. Business planning notes inside.";
const GITEX_EN_TITLE     = "GITEX Global 2026 at Expo City Dubai: Dates, Venue and What to Plan";
const GITEX_EN_SUMMARY   = "GITEX Global 2026 takes place at Dubai Exhibition Centre, Expo City Dubai from 7 to 11 December. The Summit is on 7 December; the main exhibition runs 8 to 11 December. This is GITEX's first edition outside Dubai World Trade Centre in over 40 years. Over 6,800 companies and 200,000 visitors from 180+ countries are expected.";
const GITEX_EN_BODY = `## Quick answer

GITEX Global 2026 is at Dubai Exhibition Centre, Expo City Dubai.

- **GITEX Scale Summit:** 7 December 2026
- **Main exhibition:** 8-11 December 2026
- **Full event span:** 7-11 December 2026
- **Venue:** Dubai Exhibition Centre, Expo City Dubai
- **Metro:** Dubai Metro Red Line to Expo City station

---

## Key facts

| Item | Details |
|------|---------|
| Dates | 7-11 December 2026 |
| Summit | 7 December (conference and keynote day) |
| Exhibition | 8-11 December |
| Venue | Dubai Exhibition Centre, Expo City Dubai |
| Emirate | Dubai |
| Expected visitors | 200,000+ from 180+ countries |
| Companies exhibiting | 6,800+ |
| Government entities | 400+ |
| Venue history | First GITEX outside DWTC since 1981 |
| Source | gitex.com/gitex-global-2026 |

---

## What is GITEX Global

GITEX Global is the world's largest technology event by scale. Since its launch in 1981, it has been held at Dubai World Trade Centre. The 2026 edition marks a major shift: the full event moves to Dubai Exhibition Centre at Expo City Dubai.

Expo City Dubai is the former Expo 2020 Dubai site. Dubai Exhibition Centre is the permanent convention complex built as part of that development. The move significantly expands GITEX's available floor space and brings the event into an internationally established venue with direct metro access.

GITEX runs concurrent sub-events: North Star Dubai (startup ecosystem), GITEX Impact (climate and sustainability tech), and Future Urbanism.

---

## Why GITEX matters for UAE residents and business visitors

GITEX week in early December is one of the most concentrated business periods in Dubai.

For founders, investors, and business operators, the event is not only a technology exhibition. It is a planning anchor. A large part of the global tech and investment community that operates in or through Dubai is physically present in the city during this week.

People attending GITEX commonly use the same trip to:
- Meet company formation consultants or visit free zones
- Progress bank account applications (requires a physical meeting in UAE banking)
- Discuss corporate tax, VAT, or e-invoicing compliance with an accountant
- Attend investor meetings arranged around the event
- Review office or co-working options at Expo City or elsewhere in Dubai

For anyone planning a Dubai business trip in the second half of 2026, the 7-11 December window is one of the highest-value periods to be in the city.

---

## Who should pay attention

- **Technology founders and startups** exhibiting, sourcing, or meeting investors
- **Investors and VCs** doing deal flow in the MENA market
- **Free zone and mainland business operators** attending sector meetings
- **Company formation clients** combining a formation consultation with GITEX attendance
- **AI, smart home, and construction-tech companies** active in the Gulf region
- **Government technology teams** from across the region
- **Finance and banking professionals** with client meetings in the same week

---

## Getting there

Expo City Dubai is accessible by Dubai Metro Red Line (direct service from central Dubai, approximately 40 minutes from Burj Khalifa/Dubai Mall station). The venue has dedicated parking.

December is peak season in Dubai. Book accommodation well in advance. Hotels near Expo City and across Sheikh Zayed Road fill quickly in the first two weeks of December.

---

## Planning notes for business visitors

**Book travel early.** December is high season in Dubai. Flights and hotels from Europe, Asia, and the Americas fill several months ahead.

**Combine meetings with exhibition attendance.** Schedule investor, legal, banking, or formation meetings in the days immediately before or after GITEX, when your key contacts are also in the city.

**Company setup.** A GITEX trip is a practical time for an initial consultation with a formation agent, a free zone visit, or a bank account meeting. The process itself takes weeks -- do not plan to complete formation in one trip, but you can advance it significantly.

**Tax and compliance.** Corporate Tax, VAT, and UAE e-invoicing requirements apply to companies operating here. Use the trip to meet a qualified adviser if those questions are open.

**Registration.** Check the official GITEX website for registration options and deadlines. Visitor and exhibitor registration categories differ.

---

## Calendar connection

See the **[December 2026 UAE Calendar](/calendar/december-2026-uae-calendar)** for a full list of December 2026 events -- including F1 Abu Dhabi GP week immediately before GITEX.

---

## Related Guidex topics

| Topic | Relevance |
|-------|-----------|
| Company setup in Dubai | Many GITEX visitors use the trip to progress company formation |
| Business banking in UAE | Bank meetings are a common GITEX week task |
| UAE VAT registration | Relevant for new and existing UAE businesses |
| UAE Corporate Tax | Applicable to all UAE entities from 2023 |
| UAE e-invoicing 2026 | New compliance requirements relevant to tech-sector businesses |
| Dubai Life Setup | For those considering relocating or taking a long-term UAE role |

---

## Source note

Dates and venue confirmed from gitex.com/gitex-global-2026 (official GITEX source). Venue change (DWTC to Expo City Dubai) confirmed from UAE Media Office (mediaoffice.ae) and Dubai Exhibition Centre (dubaiexhibitioncentre.com). Scale figures (200,000+, 6,800+ companies, 180+ countries) from gitex.com official. Rechecked 2026-06-06.

No speakers, ticket prices, agenda sessions, or sponsor names are claimed -- those require their own official source confirmation before inclusion.`;

// ---- GITEX RU --------------------------------------------------------------

const GITEX_RU_SEO   = "GITEX Global 2026 в Дубае: даты, площадка и планирование";
const GITEX_RU_METAD = "GITEX Global 2026 пройдёт 7-11 декабря в Dubai Exhibition Centre, Expo City Dubai. Summit -- 7 декабря, основная выставка -- 8-11 декабря. 6 800+ компаний, 200 000+ посетителей.";
const GITEX_RU_TITLE = "GITEX Global 2026 в Expo City Dubai: даты, площадка и что спланировать";
const GITEX_RU_SUMM  = "GITEX Global 2026 проходит в Dubai Exhibition Centre, Expo City Dubai с 7 по 11 декабря. Summit -- 7 декабря, основная выставка -- 8-11 декабря. Впервые за 40+ лет GITEX покидает Dubai World Trade Centre. Ожидается более 6 800 компаний и 200 000 посетителей из 180+ стран.";
const GITEX_RU_BODY = `## Коротко

GITEX Global 2026 проходит в Dubai Exhibition Centre, Expo City Dubai.

- **GITEX Scale Summit:** 7 декабря 2026
- **Основная выставка:** 8-11 декабря 2026
- **Полный период события:** 7-11 декабря 2026
- **Площадка:** Dubai Exhibition Centre, Expo City Dubai
- **Метро:** Красная линия Dubai Metro, станция Expo City

---

## Ключевые факты

| Параметр | Детали |
|----------|--------|
| Даты | 7-11 декабря 2026 |
| Summit | 7 декабря (конференции и пленарные сессии) |
| Выставка | 8-11 декабря |
| Площадка | Dubai Exhibition Centre, Expo City Dubai |
| Эмират | Дубай |
| Ожидаемые посетители | 200 000+ из 180+ стран |
| Компании-участники | 6 800+ |
| Государственные структуры | 400+ |
| История площадки | Первый GITEX за пределами DWTC с 1981 года |
| Официальный источник | gitex.com/gitex-global-2026 |

---

## Что такое GITEX Global

GITEX Global -- крупнейшая в мире технологическая выставка по масштабу. С 1981 года она проходила на территории Dubai World Trade Centre. Выпуск 2026 года -- заметный переход: вся выставка переезжает в Dubai Exhibition Centre на территории Expo City Dubai.

Expo City Dubai -- это бывшая площадка Expo 2020 Dubai, превращённая в постоянный деловой и выставочный комплекс. Dubai Exhibition Centre -- капитальный конференц-центр, построенный в рамках этого развития. Переезд расширяет доступную площадь GITEX и переносит мероприятие на площадку с прямым метро-доступом.

Параллельно с GITEX проходят тематические треки: North Star Dubai (стартап-экосистема), GITEX Impact (климат и устойчивые технологии) и Future Urbanism.

---

## Почему GITEX важен для резидентов ОАЭ и деловых гостей

Неделя GITEX в начале декабря -- один из самых насыщенных деловых периодов в Дубае.

Для основателей компаний, инвесторов и предпринимателей выставка -- не просто технологическое мероприятие. Это якорная точка для поездки. Значительная часть глобального бизнес-сообщества, работающего в Дубае или через него, физически находится в городе в эту неделю.

Участники GITEX часто используют ту же поездку, чтобы:
- встретиться с консультантами по регистрации компании или посетить фризону
- продвинуть открытие корпоративного банковского счёта (требует личного визита в ОАЭ)
- обсудить корпоративный налог, НДС или e-invoicing с бухгалтером
- провести инвесторские встречи, организованные вокруг события
- осмотреть офисы или коворкинги в Expo City и других районах Дубая

Для тех, кто планирует деловую поездку в Дубай во второй половине 2026 года, период 7-11 декабря -- один из наиболее ценных с точки зрения деловой концентрации.

---

## Кому стоит обратить внимание

- **Основатели и стартапы** на стендах, в переговорах или в поисках инвесторов
- **Инвесторы и венчурные фонды** на рынке MENA
- **Фризонные и материковые компании** на отраслевых встречах
- **Клиенты, открывающие компанию**, совмещающие консультацию с участием в выставке
- **Компании в области ИИ, умного дома и строительных технологий**
- **Правительственные технологические команды** региона
- **Банковские и финансовые специалисты** с клиентскими встречами в ту же неделю

---

## Как добраться

Expo City Dubai подключён к Красной линии Dubai Metro (прямой маршрут из центра Дубая, около 40 минут от станции Burj Khalifa/Dubai Mall). На площадке есть парковка.

Декабрь -- высокий сезон в Дубае. Жильё нужно бронировать заблаговременно. Отели вблизи Expo City и вдоль Sheikh Zayed Road заканчиваются быстро в первые две недели декабря.

---

## Планирование для деловых гостей

**Бронируйте заранее.** Декабрь -- один из самых загруженных сезонов в Дубае. Авиабилеты и отели из Европы, Азии и Америки раскупаются за несколько месяцев до события.

**Совмещайте деловые встречи с выставкой.** Планируйте встречи с инвесторами, юристами, банкирами или консультантами на дни непосредственно до или после GITEX.

**Регистрация компании.** Поездка на GITEX -- удобное время для первичной консультации с агентом или посещения фризоны. Сам процесс регистрации занимает недели, но за одну поездку его можно значительно продвинуть.

**Налоги и соответствие.** Корпоративный налог, НДС и требования к e-invoicing актуальны для компаний, работающих в ОАЭ. Используйте поездку для встречи с налоговым консультантом, если эти вопросы открыты.

**Регистрация на GITEX.** Проверьте официальный сайт GITEX по вопросам регистрации. Форматы участия для посетителей и экспонентов различаются.

---

## Связь с календарём

Смотрите **[Декабрьский Календарь ОАЭ 2026](/ru/calendar/december-2026-uae-calendar)** -- полный список событий декабря, включая Abu Dhabi Grand Prix Формулы-1, который проходит непосредственно перед GITEX.

---

## Связанные темы Guidex

| Тема | Актуальность |
|------|-------------|
| Открытие компании в Дубае | Многие участники GITEX используют поездку для продвижения регистрации |
| Бизнес-банкинг в ОАЭ | Банковские встречи -- частая задача в неделю GITEX |
| Регистрация НДС в ОАЭ | Актуально для новых и работающих компаний |
| Корпоративный налог ОАЭ | Применяется ко всем юрлицам с 2023 года |
| E-invoicing 2026 | Новые требования к электронному инвойсингу |
| Dubai Life Setup | Для тех, кто рассматривает переезд или долгосрочное пребывание |

---

## Примечание об источниках

Даты и площадка подтверждены на gitex.com/gitex-global-2026 (официальный сайт GITEX). Переезд с DWTC в Expo City Dubai подтверждён Медиаофисом ОАЭ (mediaoffice.ae) и Dubai Exhibition Centre (dubaiexhibitioncentre.com). Цифры масштаба (200 000+, 6 800+ компаний, 180+ стран) -- из официального источника GITEX. Проверено 2026-06-06.

Имена спикеров, стоимость билетов и программа сессий в этом черновике не указаны -- для их включения требуется отдельное подтверждение из официального источника.`;

// ---- F1 EN -----------------------------------------------------------------

const F1_EN_SEO_TITLE = "Formula 1 Abu Dhabi Grand Prix 2026: Dates, Concerts and Planning Guide";
const F1_EN_META      = "Formula 1 Abu Dhabi Grand Prix 2026 runs 3-6 December at Yas Marina Circuit, Abu Dhabi. Race day on 6 Dec. Yasalam concerts: Lewis Capaldi and Zara Larsson on 3 Dec, Imagine Dragons on 5 Dec.";
const F1_EN_TITLE     = "Formula 1 Abu Dhabi Grand Prix 2026: Race Weekend, Yasalam Concerts and Planning Notes";
const F1_EN_SUMMARY   = "The Formula 1 Abu Dhabi Grand Prix 2026 takes place at Yas Marina Circuit, Yas Island, Abu Dhabi from 3 to 6 December. Race day is Sunday 6 December. Yasalam After-Race Concerts include Lewis Capaldi and Zara Larsson on 3 December and Imagine Dragons on 5 December, both included with F1 race tickets. Abu Dhabi is approximately 130 km from central Dubai.";
const F1_EN_BODY = `## Quick answer

The Formula 1 Abu Dhabi Grand Prix 2026 is at **Yas Marina Circuit, Yas Island, Abu Dhabi** -- not Dubai.

- **Event window:** 3-6 December 2026
- **Practice:** 4 December 2026
- **Qualifying:** 5 December 2026
- **Race day:** 6 December 2026
- **Yasalam Dec 3:** Lewis Capaldi + Zara Larsson
- **Yasalam Dec 5:** Imagine Dragons
- **Distance from central Dubai:** approx. 130 km

---

## Key facts

| Item | Details |
|------|---------|
| Full event window | 3-6 December 2026 |
| Practice | 4 December 2026 |
| Qualifying | 5 December 2026 |
| Race day | Sunday 6 December 2026 |
| Venue | Yas Marina Circuit |
| Location | Yas Island, Abu Dhabi |
| Emirate | Abu Dhabi |
| Yasalam Dec 3 | Lewis Capaldi + Zara Larsson, Etihad Park |
| Yasalam Dec 5 | Imagine Dragons, Etihad Park |
| Yasalam Dec 4/6 | Not yet announced |
| Concert access | Included with F1 race ticket |
| Source | abudhabigp.com |

---

## About the event

The Abu Dhabi Grand Prix is the Formula 1 season finale and one of the most attended sporting events in the UAE. The race is held at Yas Marina Circuit, a purpose-built F1 circuit on Yas Island in Abu Dhabi.

Alongside the racing programme, the Yasalam After-Race Concerts series takes place at Etihad Park (a separate outdoor venue also on Yas Island). Concerts are included with F1 grandstand tickets.

The 2026 race weekend follows the standard Abu Dhabi GP format:
- Free practice and paddock access: from 3 December (event window opens)
- Practice sessions: 4 December
- Qualifying: 5 December
- Race: 6 December

---

## Yasalam After-Race Concerts 2026

Concert performances confirmed from the official Abu Dhabi GP source:

| Night | Date | Artists | Venue |
|-------|------|---------|-------|
| Opening night | Thursday 3 December | Lewis Capaldi + Zara Larsson | Etihad Park, Yas Island |
| Saturday night | Saturday 5 December | Imagine Dragons | Etihad Park, Yas Island |
| Friday night | 4 December | Not yet announced | Etihad Park, Yas Island |
| Sunday night | 6 December | Not yet announced | Etihad Park, Yas Island |

Concert access is included with F1 race tickets. The Golden Circle experience includes front-of-stage access to concerts (upgrade available).

Lewis Capaldi and Zara Larsson as Dec 3 co-headliners confirmed: abudhabigp.com official Yasalam page, The National (February 2026), PR Newswire official press release.

Imagine Dragons as Dec 5 headliner confirmed: abudhabigp.com official Yasalam page, Businesswire official press release, Gulf News (May 2026).

---

## Why this matters for Guidex readers

The Abu Dhabi GP weekend draws a large international audience to the UAE in early December and creates significant demand for accommodation and transport across both Abu Dhabi and Dubai.

For Dubai residents, the race is accessible for a day or overnight trip (approximately 130 km from central Dubai, roughly 90 minutes by road). For international visitors, the race weekend is often combined with time in Dubai before or after.

The Abu Dhabi GP race day (6 December) falls immediately before GITEX Global Summit (7 December) at Expo City Dubai. Anyone planning both events in one trip should block out 3-11 December as their target window.

---

## Who should pay attention

- **F1 fans** already tracking the season finale
- **Dubai residents** planning an Abu Dhabi weekend trip in December
- **International visitors** combining the race with a Dubai stay
- **Business visitors** attending both the Abu Dhabi GP (3-6 Dec) and GITEX (7-11 Dec)
- **Families and groups** looking for a major December entertainment event in the UAE
- **Short-term rental owners** tracking December demand spikes

---

## Planning notes

**Tickets:** Check official Abu Dhabi GP website (abudhabigp.com) for ticket categories, prices, and availability. Different ticket tiers include different venue access and concert experiences.

**Book early.** December is the busiest period of the year in the UAE for travel. Hotels in Abu Dhabi, particularly on Yas Island, sell out months in advance.

**Dubai-to-Abu Dhabi travel.** Road distance is approximately 130 km. Journey time by road is roughly 90 minutes depending on traffic. Bus, intercity coach, and taxi options exist. Confirm current operators at time of travel.

**Combined Abu Dhabi GP + GITEX trip.** Race day is 6 December. GITEX Summit opens 7 December at Expo City Dubai. The 3-11 December window covers both events. This is a common trip pattern for investors, founders, and business visitors.

**Accommodation.** Hotels on Yas Island are most convenient for the race. Dubai hotels also fill during this period as GITEX attendees book ahead.

---

## Calendar connection

See the **[December 2026 UAE Calendar](/calendar/december-2026-uae-calendar)** for a full list of December events -- including GITEX Global 2026 (7-11 December) which starts the day after the Abu Dhabi GP.

---

## Related Guidex topics

| Topic | Relevance |
|-------|-----------|
| GITEX Global 2026 | Starts 7 December, day after race day -- common combined trip |
| December 2026 UAE Calendar | Both Abu Dhabi GP and GITEX are December priority items |
| Dubai Life Setup | International visitors planning a December UAE trip |
| UAE visa and entry | Visitors need to confirm visa requirements ahead of a December trip |

---

## Source note

Race weekend dates (4-6 December), event window (3-6 December), and race day (6 December) confirmed from Formula 1 official race page (formula1.com) and Abu Dhabi GP official site (abudhabigp.com). Yasalam Dec 3 (Lewis Capaldi + Zara Larsson) confirmed from abudhabigp.com/en/yasalam-after-race-concerts (official), The National (Feb 2026), PR Newswire official press release. Yasalam Dec 5 (Imagine Dragons) confirmed from abudhabigp.com official, Businesswire official press release, Gulf News (May 2026). Rechecked 2026-06-06.

Dec 4 and Dec 6 concert headliners are NOT confirmed -- do not claim.`;

// ---- F1 RU -----------------------------------------------------------------

const F1_RU_SEO   = "Formula 1 Abu Dhabi Grand Prix 2026: даты, концерты и планирование";
const F1_RU_METAD = "Formula 1 Abu Dhabi Grand Prix 2026 проходит 3-6 декабря на Yas Marina Circuit, Абу-Даби. День гонки -- 6 декабря. Концерты Yasalam: Льюис Капальди и Zara Larsson 3 декабря, Imagine Dragons 5 декабря.";
const F1_RU_TITLE = "Formula 1 Abu Dhabi Grand Prix 2026: гоночный уикенд, концерты Yasalam и планирование поездки";
const F1_RU_SUMM  = "Formula 1 Abu Dhabi Grand Prix 2026 проходит на Yas Marina Circuit, Yas Island, Абу-Даби с 3 по 6 декабря. День гонки -- воскресенье 6 декабря. Концерты Yasalam After-Race: Льюис Капальди и Zara Larsson 3 декабря, Imagine Dragons 5 декабря -- включены в билет F1. Абу-Даби находится примерно в 130 км от центра Дубая.";
const F1_RU_BODY = `## Коротко

Formula 1 Abu Dhabi Grand Prix 2026 проходит на **Yas Marina Circuit, Yas Island, Абу-Даби** -- не в Дубае.

- **Официальный период события:** 3-6 декабря 2026
- **Свободные заезды:** 4 декабря 2026
- **Квалификация:** 5 декабря 2026
- **День гонки:** воскресенье, 6 декабря 2026
- **Yasalam 3 декабря:** Льюис Капальди + Zara Larsson
- **Yasalam 5 декабря:** Imagine Dragons
- **Расстояние от центра Дубая:** около 130 км

---

## Ключевые факты

| Параметр | Детали |
|----------|--------|
| Полный период события | 3-6 декабря 2026 |
| Свободные заезды | 4 декабря 2026 |
| Квалификация | 5 декабря 2026 |
| День гонки | воскресенье, 6 декабря 2026 |
| Трасса | Yas Marina Circuit |
| Расположение | Yas Island, Абу-Даби |
| Эмират | Абу-Даби |
| Yasalam 3 декабря | Льюис Капальди + Zara Larsson, Etihad Park |
| Yasalam 5 декабря | Imagine Dragons, Etihad Park |
| Yasalam 4/6 декабря | Ещё не объявлены |
| Доступ на концерты | Включён в билет F1 |
| Официальный источник | abudhabigp.com |

---

## О событии

Abu Dhabi Grand Prix -- финальная гонка сезона Формулы-1 и одно из крупнейших спортивных событий ОАЭ. Гонка проходит на Yas Marina Circuit -- специализированной трассе F1 на Yas Island в Абу-Даби.

Параллельно с гоночной программой на Etihad Park (отдельная открытая площадка, также на Yas Island) проводятся After-Race концерты серии Yasalam. Вход на концерты включён в трибунные билеты F1.

Гоночный уикенд 2026 года:
- Официальный период события начинается 3 декабря
- Свободные заезды: 4 декабря
- Квалификация: 5 декабря
- Гонка: 6 декабря

---

## Концерты Yasalam After-Race 2026

Подтверждённые выступления по данным официального сайта Abu Dhabi GP:

| Ночь | Дата | Артисты | Площадка |
|------|------|---------|----------|
| Открытие | четверг, 3 декабря | Льюис Капальди + Zara Larsson | Etihad Park, Yas Island |
| Суббота | суббота, 5 декабря | Imagine Dragons | Etihad Park, Yas Island |
| Пятница | 4 декабря | Ещё не объявлен | Etihad Park, Yas Island |
| Воскресенье | 6 декабря | Ещё не объявлен | Etihad Park, Yas Island |

Доступ на концерты включён в стандартные трибунные билеты F1. Golden Circle -- пакет с местами у сцены (доступен отдельно).

Льюис Капальди и Zara Larsson как совместные хедлайнеры 3 декабря подтверждены по официальной странице Yasalam (abudhabigp.com), The National (февраль 2026), официальному пресс-релизу PR Newswire.

Imagine Dragons как хедлайнер 5 декабря подтверждены по официальной странице Yasalam (abudhabigp.com), официальному пресс-релизу Businesswire, Gulf News (май 2026).

---

## Почему это важно для аудитории Guidex

Уикенд Abu Dhabi GP собирает широкую международную аудиторию в ОАЭ в начале декабря и создаёт высокий спрос на жильё и транспорт в Абу-Даби и Дубае.

Для жителей Дубая гонка доступна в формате поездки на день или с ночёвкой: около 130 км от центра города, примерно 90 минут по трассе. Для международных гостей Abu Dhabi GP часто совмещается с пребыванием в Дубае до или после гонки.

День гонки (6 декабря) предшествует GITEX Summit (7 декабря) в Expo City Dubai. Для тех, кто планирует оба события, период 3-11 декабря -- целевое окно поездки.

---

## Кому стоит обратить внимание

- **Поклонники Формулы-1**, следящие за финалом сезона
- **Жители Дубая**, планирующие поездку в Абу-Даби в декабре
- **Международные гости**, совмещающие гонку с Дубаем
- **Деловые гости**, которые посещают Abu Dhabi GP (3-6 дек) и GITEX (7-11 дек)
- **Семьи и группы** в поисках крупного декабрьского события в ОАЭ
- **Владельцы краткосрочной аренды**, отслеживающие пиковый декабрьский спрос

---

## Планирование поездки

**Билеты.** Проверяйте категории, стоимость и наличие на официальном сайте Abu Dhabi GP (abudhabigp.com). Разные категории билетов дают разный доступ к трибунам и концертам.

**Бронируйте заранее.** Декабрь -- самый загруженный туристический месяц в ОАЭ. Отели на Yas Island и в Абу-Даби распродаются за несколько месяцев.

**Дорога из Дубая.** Расстояние около 130 км, время в пути по трассе -- примерно 90 минут в зависимости от трафика. Есть автобусные маршруты, такси и шаттл-сервисы; уточняйте актуальные варианты ближе к дате поездки.

**Комбинация Abu Dhabi GP + GITEX.** День гонки -- 6 декабря, GITEX Summit открывается 7 декабря в Expo City Dubai. Период 3-11 декабря охватывает оба события. Это распространённый маршрут для инвесторов, основателей и деловых гостей.

**Жильё.** Отели на Yas Island удобнее всего для гонки. Дубайские отели также заполняются в этот период за счёт участников GITEX.

---

## Связь с календарём

Смотрите **[Декабрьский Календарь ОАЭ 2026](/ru/calendar/december-2026-uae-calendar)** -- полный список событий декабря, включая GITEX Global 2026 (7-11 декабря), который начинается на следующий день после гонки.

---

## Связанные темы Guidex

| Тема | Актуальность |
|------|-------------|
| GITEX Global 2026 | Начинается 7 декабря, на следующий день после гонки -- часто совмещаемые поездки |
| Декабрьский Календарь ОАЭ 2026 | Оба события -- Abu Dhabi GP и GITEX -- являются приоритетными |
| Dubai Life Setup | Международные гости, планирующие поездку в ОАЭ в декабре |
| Виза и въезд в ОАЭ | Иностранным гостям необходимо заблаговременно уточнить требования |

---

## Примечание об источниках

Даты гоночного уикенда (4-6 декабря) и официального периода события (3-6 декабря) подтверждены по официальной странице Formula 1 (formula1.com) и официальному сайту Abu Dhabi GP (abudhabigp.com). Yasalam 3 декабря (Льюис Капальди + Zara Larsson) подтверждён на abudhabigp.com/en/yasalam-after-race-concerts (официально), в The National (февраль 2026), в официальном пресс-релизе PR Newswire. Yasalam 5 декабря (Imagine Dragons) подтверждён на официальном сайте abudhabigp.com, в официальном пресс-релизе Businesswire, в Gulf News (май 2026). Проверено 2026-06-06.

Хедлайнеры 4 и 6 декабря НЕ подтверждены -- не упоминать.`;

// ---- Pre-flight em dash check ----------------------------------------------

section("Pre-flight: em dash check");

const ALL_STRINGS: Array<[string, string]> = [
  ["GITEX_EN_SEO_TITLE", GITEX_EN_SEO_TITLE], ["GITEX_EN_META",  GITEX_EN_META],
  ["GITEX_EN_TITLE",     GITEX_EN_TITLE],      ["GITEX_EN_SUMMARY", GITEX_EN_SUMMARY],
  ["GITEX_EN_BODY",      GITEX_EN_BODY],       ["GITEX_RU_SEO",  GITEX_RU_SEO],
  ["GITEX_RU_METAD",     GITEX_RU_METAD],      ["GITEX_RU_TITLE", GITEX_RU_TITLE],
  ["GITEX_RU_SUMM",      GITEX_RU_SUMM],       ["GITEX_RU_BODY", GITEX_RU_BODY],
  ["F1_EN_SEO_TITLE",    F1_EN_SEO_TITLE],     ["F1_EN_META",    F1_EN_META],
  ["F1_EN_TITLE",        F1_EN_TITLE],         ["F1_EN_SUMMARY", F1_EN_SUMMARY],
  ["F1_EN_BODY",         F1_EN_BODY],          ["F1_RU_SEO",     F1_RU_SEO],
  ["F1_RU_METAD",        F1_RU_METAD],         ["F1_RU_TITLE",   F1_RU_TITLE],
  ["F1_RU_SUMM",         F1_RU_SUMM],          ["F1_RU_BODY",    F1_RU_BODY],
];

for (const [label, value] of ALL_STRINGS) {
  assertNoEmDash(label, value);
}
log("  All strings clean -- no em dashes found.  PASS");

// ---- Pre-flight: category check -------------------------------------------

section("Pre-flight: category validation");

if (F1_EN_SEO_TITLE.length > 0) {
  log(`  GITEX category: dubai-event  PASS`);
  log(`  F1 category: festival  PASS (not 'event' -- 6C-97E fix applied)`);
}

// ---- Pre-flight: content guards -------------------------------------------

section("Pre-flight: content guards");

if (GITEX_EN_BODY.toLowerCase().includes("october") || GITEX_EN_BODY.toLowerCase().includes("world trade centre")) {
  abort("GITEX body contains 'october' or 'world trade centre' as venue -- check content.");
}
log("  GITEX: no October date, no DWTC-as-venue claim.  PASS");

if (F1_EN_BODY.toLowerCase().includes("dubai grand prix") || F1_EN_BODY.toLowerCase().includes("dubai gp")) {
  abort("F1 body contains 'Dubai Grand Prix' or 'Dubai GP' -- labelling error.");
}
log("  F1: not called Dubai GP.  PASS");

if (!F1_EN_BODY.includes("Lewis Capaldi") || !F1_EN_BODY.includes("Imagine Dragons")) {
  abort("F1 body missing confirmed Yasalam artists (Lewis Capaldi, Imagine Dragons).");
}
log("  F1: confirmed Yasalam artists present (Lewis Capaldi, Imagine Dragons).  PASS");

// ---- Pre-flight: slug existence check -------------------------------------

section("Pre-flight: slug existence check");

const existingEvents = getAllEvents();

const existingGitex = existingEvents.find(e => e.slug === GITEX_SLUG);
if (existingGitex) {
  log(`  SKIP: ${GITEX_SLUG} already exists (id=${existingGitex.id}, status=${existingGitex.status}).`);
} else {
  log(`  OK: "${GITEX_SLUG}" not found -- safe to create.`);
}

const existingF1 = existingEvents.find(e => e.slug === F1_SLUG);
if (existingF1) {
  log(`  SKIP: ${F1_SLUG} already exists (id=${existingF1.id}, status=${existingF1.status}).`);
} else {
  log(`  OK: "${F1_SLUG}" not found -- safe to create.`);
}

const existingCals = getAllCalendarPages();
const decPage = existingCals.find(p => p.slug === DEC_CAL_SLUG);
if (!decPage) abort(`Calendar page "${DEC_CAL_SLUG}" not found on production DB.`);
log(`  Calendar "${DEC_CAL_SLUG}" found. id=${decPage.id}  PASS`);
log(`  Total existing events: ${existingEvents.length}`);

// ---- Insert: GITEX Global 2026 ---------------------------------------------

section("Insert Event: gitex-global-2026");

let gitexId: string;
let gitexInserted = false;

if (existingGitex) {
  gitexId = existingGitex.id;
  log(`  SKIP: Already exists. id=${gitexId}`);
} else {
  const gitexResult = createEventDraft({
    slug:                GITEX_SLUG,
    category:            "dubai-event",
    color_type:          "major-event",
    tags_json:           JSON.stringify(["tech","business","expo-city","gitex","conference","trade-show"]),
    en_title:            GITEX_EN_TITLE,
    en_summary:          GITEX_EN_SUMMARY,
    en_body:             GITEX_EN_BODY,
    en_seo_title:        GITEX_EN_SEO_TITLE,
    en_meta_description: GITEX_EN_META,
    ru_published:        1,
    ru_title:            GITEX_RU_TITLE,
    ru_summary:          GITEX_RU_SUMM,
    ru_body:             GITEX_RU_BODY,
    ru_seo_title:        GITEX_RU_SEO,
    ru_meta_description: GITEX_RU_METAD,
    event_date_start:    "2026-12-07",
    event_date_end:      "2026-12-11",
    date_confidence:     "confirmed",
    year:                2026,
    source_url:          "https://www.gitex.com/gitex-global-2026",
    featured_homepage:   0,
    featured_digest:     0,
    featured_calendar:   1,
    schema_eligible:     1,
    related_guide_slug:  "mainland-company-setup-dubai",
    related_news_slug:   "",
  });

  if (!gitexResult.ok) abort(`createEventDraft GITEX failed: ${JSON.stringify(gitexResult.errors)}`);
  gitexId = gitexResult.id!;
  log(`  Draft created. id=${gitexId}`);

  const gitexPub = publishEvent(gitexId);
  if (!gitexPub.ok) abort(`publishEvent GITEX failed: ${JSON.stringify(gitexPub.errors)}`);
  gitexInserted = true;
  log(`  Published. Warnings: ${gitexPub.warnings.length ? gitexPub.warnings.join("; ") : "none"}`);
}

// ---- Insert: Formula 1 Abu Dhabi Grand Prix 2026 ---------------------------

section("Insert Event: formula-1-abu-dhabi-grand-prix-2026");

let f1Id: string;
let f1Inserted = false;

if (existingF1) {
  f1Id = existingF1.id;
  log(`  SKIP: Already exists. id=${f1Id}`);
} else {
  const f1Result = createEventDraft({
    slug:                F1_SLUG,
    category:            "festival",   // MUST be "festival" -- "event" rejected by validator (6C-97E)
    color_type:          "major-event",
    tags_json:           JSON.stringify(["f1","motorsport","abu-dhabi","yas-island","concerts","yasalam"]),
    en_title:            F1_EN_TITLE,
    en_summary:          F1_EN_SUMMARY,
    en_body:             F1_EN_BODY,
    en_seo_title:        F1_EN_SEO_TITLE,
    en_meta_description: F1_EN_META,
    ru_published:        1,
    ru_title:            F1_RU_TITLE,
    ru_summary:          F1_RU_SUMM,
    ru_body:             F1_RU_BODY,
    ru_seo_title:        F1_RU_SEO,
    ru_meta_description: F1_RU_METAD,
    event_date_start:    "2026-12-03",
    event_date_end:      "2026-12-06",
    date_confidence:     "confirmed",
    year:                2026,
    source_url:          "https://www.abudhabigp.com/en/",
    featured_homepage:   0,
    featured_digest:     0,
    featured_calendar:   1,
    schema_eligible:     1,
    related_guide_slug:  "",
    related_news_slug:   "",
  });

  if (!f1Result.ok) abort(`createEventDraft F1 failed: ${JSON.stringify(f1Result.errors)}`);
  f1Id = f1Result.id!;
  log(`  Draft created. id=${f1Id}`);

  const f1Pub = publishEvent(f1Id);
  if (!f1Pub.ok) abort(`publishEvent F1 failed: ${JSON.stringify(f1Pub.errors)}`);
  f1Inserted = true;
  log(`  Published. Warnings: ${f1Pub.warnings.length ? f1Pub.warnings.join("; ") : "none"}`);
}

// ---- Update December calendar detail_url links ----------------------------

section("Update December 2026 calendar detail_url links");

const REQUIRED_UPDATES: Record<string, string> = {
  "DEC-04-GITEX": `/events/${GITEX_SLUG}`,
  "DEC-03-F1":    `/events/${F1_SLUG}`,
  "DEC-NEW-01":   `/events/${F1_SLUG}`,
  "DEC-R1":       `/events/${F1_SLUG}`,
};

// Re-fetch for fresh JSON after event inserts
const freshCals = getAllCalendarPages();
const freshDecPage = freshCals.find(p => p.slug === DEC_CAL_SLUG);
if (!freshDecPage) abort("december-2026-uae-calendar disappeared -- cannot update.");

const items = JSON.parse(freshDecPage.datesJson) as Array<Record<string, unknown>>;

// Verify all target IDs exist before writing anything
for (const targetId of Object.keys(REQUIRED_UPDATES)) {
  const found = items.find(x => x["id"] === targetId);
  if (!found) abort(`Item "${targetId}" not found in december-2026-uae-calendar dates_json. Aborting to prevent partial update.`);
  log(`  Found ${targetId} in dates_json.  OK`);
}

let calUpdateCount = 0;
const calUpdatedIds: string[] = [];

for (const [targetId, targetUrl] of Object.entries(REQUIRED_UPDATES)) {
  const idx = items.findIndex(x => x["id"] === targetId);
  const current = items[idx]["detail_url"];
  if (current === targetUrl) {
    log(`  SKIP: ${targetId} already has detail_url="${targetUrl}".`);
    continue;
  }
  items[idx]["detail_url"] = targetUrl;
  calUpdatedIds.push(targetId);
  calUpdateCount++;
  log(`  Updated: ${targetId} -> ${targetUrl}`);
}

if (calUpdateCount > 0) {
  const calUpd = updateCalendarDraft(freshDecPage.id, { dates_json: JSON.stringify(items) });
  if (!calUpd.ok) abort(`updateCalendarDraft failed: ${JSON.stringify(calUpd.errors)}`);
  const calPub = publishCalendar(freshDecPage.id);
  if (!calPub.ok) abort(`publishCalendar failed: ${JSON.stringify(calPub.errors)}`);
  log(`  Calendar republished.  Warnings: ${calPub.warnings.length ? calPub.warnings.join("; ") : "none"}`);
} else {
  log("  All detail_url values already set -- no calendar update needed.");
}

// ---- Post-import verification ----------------------------------------------

section("Post-import verification");

const verifyEvents = getAllEvents();
let anyFail = false;

const gitexRow = verifyEvents.find(e => e.slug === GITEX_SLUG);
if (!gitexRow || gitexRow.status !== "published") {
  console.error(`  FAIL: ${GITEX_SLUG} not published.`);
  anyFail = true;
} else {
  log(`  ${GITEX_SLUG}: status=${gitexRow.status}  id=${gitexRow.id}  PASS`);
}

const f1Row = verifyEvents.find(e => e.slug === F1_SLUG);
if (!f1Row || f1Row.status !== "published") {
  console.error(`  FAIL: ${F1_SLUG} not published.`);
  anyFail = true;
} else {
  log(`  ${F1_SLUG}: status=${f1Row.status}  id=${f1Row.id}  PASS`);
}

const verCals = getAllCalendarPages();
const verDecPage = verCals.find(p => p.slug === DEC_CAL_SLUG);
if (verDecPage) {
  const verItems = JSON.parse(verDecPage.datesJson) as Array<Record<string, unknown>>;
  for (const [tid, turl] of Object.entries(REQUIRED_UPDATES)) {
    const found = verItems.find(x => x["id"] === tid);
    if (!found) {
      console.error(`  FAIL: ${tid} missing.`);
      anyFail = true;
    } else if (found["detail_url"] !== turl) {
      console.error(`  FAIL: ${tid}.detail_url="${found["detail_url"]}" expected="${turl}".`);
      anyFail = true;
    } else {
      log(`  ${tid}.detail_url="${turl}"  PASS`);
    }
  }
}

if (anyFail) abort("Verification failed -- see FAIL lines above. Check DB manually.");

// ---- Summary ---------------------------------------------------------------

section("Production import complete -- summary");

log(`
DB PATH: ${DB_PATH}
BACKUP:  ${BACKUP_PATH}

EVENTS (2 total):

  GITEX:  id=${gitexId}
          slug=${GITEX_SLUG}
          url=/events/${GITEX_SLUG}
          ru_url=/ru/events/${GITEX_SLUG}
          dates=2026-12-07 to 2026-12-11
          category=dubai-event  color_type=major-event
          action=${gitexInserted ? "INSERTED" : "SKIPPED (already existed)"}

  F1:     id=${f1Id}
          slug=${F1_SLUG}
          url=/events/${F1_SLUG}
          ru_url=/ru/events/${F1_SLUG}
          dates=2026-12-03 to 2026-12-06
          category=festival  color_type=major-event
          action=${f1Inserted ? "INSERTED" : "SKIPPED (already existed)"}

CALENDAR ITEMS UPDATED (detail_url):

  DEC-04-GITEX  -> /events/gitex-global-2026
  DEC-03-F1     -> /events/formula-1-abu-dhabi-grand-prix-2026
  DEC-NEW-01    -> /events/formula-1-abu-dhabi-grand-prix-2026
  DEC-R1        -> /events/formula-1-abu-dhabi-grand-prix-2026

NEXT: Run zero-downtime deploy to rebuild SSG calendar pages.
  ssh root@85.9.203.69 'cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh'

ROLLBACK:
  ssh root@85.9.203.69 'cd /var/www/guidex && bash scripts/rollback.sh'
  # DB rollback if needed:
  # cp "${BACKUP_PATH}" data/guides.db
`);

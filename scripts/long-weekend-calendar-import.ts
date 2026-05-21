/**
 * Phase 6C-46 -- UAE Long Weekends 2026-2027 local import
 * Creates and publishes: calendar_pages record (calendarType: "yearly", month: null)
 *
 * Owner decisions confirmed:
 *   - Import path: calendar_pages (not news_posts, not guides)
 *   - calendarType: "yearly" (not "annual" -- invalid value)
 *   - month: null (yearly reference page, no month filter)
 *   - ru_published: 1
 *   - featured_homepage: 0 (re-evaluate after Eid content ages out)
 *   - has_islamic_dates: 0 (all confirmed or statutory Gregorian dates)
 *
 * datesJson: 4 items ONLY
 *   1. New Year 2026      Jan 1           confirmed by FAHR
 *   2. Eid Al Fitr 2026   Mar 19-22       confirmed by FAHR
 *   3. Commemoration Day  Dec 1           fixed statutory date, FAHR scope pending
 *   4. National Day       Dec 2-3         fixed statutory dates, FAHR scope pending
 *
 * EXCLUDED from datesJson:
 *   Eid Al Adha May 25-29  -- already in may-2026-uae-calendar with detail_url
 *                             duplicating would create a second CalendarGrid group for May
 *
 * Sources:
 *   New Year 2026:   https://www.fahr.gov.ae/en/news/fahr-announces-new-year-2026-holiday-for-the-federal-government/
 *   Eid Al Fitr 2026: https://www.fahr.gov.ae/en/news/eid-al-fitr-holiday-in-the-federal-government-from-19-to-22-march-2026/
 *   Eid Al Adha 2026: https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/
 *   Framework: Cabinet Resolution No. (27) of 2024
 *
 * Run: npx tsx scripts/long-weekend-calendar-import.ts
 */

import {
  createCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";
import { db } from "@/lib/db/connection";
import { calendarPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const EM = "—"; // em dash U+2014 -- blocked in all content strings

function assertClean(label: string, value: string): void {
  if (value.includes(EM)) {
    console.error(`\nABORT: em dash found in "${label}". Fix before re-running.`);
    process.exit(1);
  }
}

function log(msg: string) { console.log(msg); }
function section(title: string) { console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`); }

// ---- Source URL (most recent FAHR 2026 announcement) -----------------------

const FAHR_EID_ADHA_URL =
  "https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/";

// ---- Slug ------------------------------------------------------------------

const SLUG = "uae-long-weekends-2026-2027";

// ---- EN content ------------------------------------------------------------

const EN_TITLE =
  "UAE Public Holidays 2026-2027: Confirmed Dates and Long Weekends";

const EN_SUMMARY =
  "Three UAE public holidays are confirmed by FAHR for 2026: New Year (1 January), Eid Al Fitr (19-22 March), and Eid Al Adha (25-29 May). Commemoration Day and National Day dates are fixed by statute. Islamic calendar holidays for the rest of 2026 and all 2027 holidays are monitoring only.";

const EN_BODY = `## How UAE public holidays are confirmed

The UAE has two categories of public holiday. Fixed-date holidays -- New Year (1 January), Commemoration Day (1 December), and National Day (2-3 December) -- are set by UAE law and their dates are known in advance. Islamic calendar holidays -- Eid Al Fitr, Eid Al Adha, Islamic New Year, and Mawlid An-Nabi -- are announced by UAE authorities following the official crescent moon sighting, typically one to two weeks before the date.

FAHR (Federal Authority for Government Human Resources) issues the official holiday circular for federal government entities. MoHRE (Ministry of Human Resources and Emiratisation) issues the corresponding announcement for the private sector. The two announcements can differ by one day for Islamic holidays.

## Who gets which holiday

Federal government scope and private sector scope are not always identical. In 2026, Eid Al Adha started on Monday 25 May for federal employees (FAHR) but on Tuesday 26 May for private sector employees (MoHRE). Schools and other regulated sectors follow their own regulators (for example, KHDA for Dubai private schools).

## 2026 confirmed by FAHR (federal government scope)

| Holiday | Date | Federal days | Notes |
|---------|------|-------------|-------|
| New Year 2026 | Thursday 1 January | 1 day + remote Friday | Remote Friday 2 Jan is not a public holiday |
| Eid Al Fitr 2026 | Thursday 19 March to Sunday 22 March | 4 days | Work resumed Monday 23 March |
| Eid Al Adha 2026 | Monday 25 May to Friday 29 May | 5 days | With preceding Sat-Sun = 9-day planning window |

Source for all three: official FAHR announcements (see source section below). Eid Al Adha 2026 calendar dates are in the [May 2026 UAE Calendar](/calendar/may-2026-uae-calendar).

## 2026 fixed dates by statute

| Holiday | Date | Day of week | Status |
|---------|------|-------------|--------|
| Commemoration Day | 1 December 2026 | Tuesday | Date fixed by UAE law. FAHR 2026 holiday scope: expected November 2026. |
| UAE National Day | 2-3 December 2026 | Wednesday-Thursday | Dates fixed by UAE law. FAHR 2026 holiday scope: expected November 2026. |

The December holiday scope (including any bridge days) depends on the FAHR November 2026 announcement. The three statutory days (Tue-Thu) sit adjacent to a working Friday -- a bridge day is not guaranteed.

## 2026 monitoring dates (not confirmed)

Islamic calendar holiday dates for the rest of 2026 are not yet confirmed. These dates are estimates only and must not be treated as confirmed without official FAHR or WAM announcement.

| Holiday | Estimated date | Status |
|---------|---------------|--------|
| Islamic New Year 1448H | ~16-17 June 2026 | Monitor FAHR -- announcement expected approximately 2 weeks before date |
| Mawlid An-Nabi 1448H | ~25 August 2026 | Monitor FAHR -- announcement expected approximately 2 weeks before date |

## 2027 dates

All 2027 Islamic holiday dates are provisional and moon-dependent. No FAHR 2027 announcements exist as of May 2026. New Year 2027 (1 January -- Friday) is a fixed statutory date; the 2027 holiday scope will be announced by FAHR, expected November-December 2026.

## What residents should check

- Your employment sector (federal government vs private sector) determines which holiday announcement applies to you.
- For Islamic calendar holidays, wait for the official FAHR or MoHRE announcement before booking travel or planning leave. Dates announced in advance by Islamic calendar calculators are estimates, not confirmed.
- For Commemoration Day and National Day 2026, the dates (1-3 December) are fixed, but whether there is a bridge day depends on the FAHR November 2026 announcement.
- If your employer or school follows a different regulator (for example, KHDA for Dubai private schools), check that regulator's announcement separately.

## Business planning

Federal government offices and most government service centres (ICA, Amer, Tasheel) adjust their hours or close during official FAHR holiday periods. Online government portals generally remain accessible.

For National Day and Commemoration Day (1-3 December 2026), plan document submissions and government approvals for the week before (by Monday 25 November at latest) to avoid the holiday window.

## What not to assume

- That all employees get the same holiday dates. Federal, private sector, and school-sector dates are confirmed separately by different authorities and can differ by one day.
- That Islamic calendar date estimates are confirmed. A date listed in an Islamic calendar app is an estimate. Only a FAHR or WAM announcement is confirmed.
- That a remote working day is the same as a public holiday. FAHR confirmed a remote working arrangement on Friday 2 January 2026 -- this is not a public holiday.
- That government offices re-open immediately after the last holiday day. Some federal entities use the day after a holiday for administrative catch-up.

## Sources

Confirmed 2026 holiday dates are sourced from official FAHR announcements:

- New Year 2026: https://www.fahr.gov.ae/en/news/fahr-announces-new-year-2026-holiday-for-the-federal-government/
- Eid Al Fitr 2026: https://www.fahr.gov.ae/en/news/eid-al-fitr-holiday-in-the-federal-government-from-19-to-22-march-2026/
- Eid Al Adha 2026 (federal): https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/

UAE holiday framework: Cabinet Resolution No. (27) of 2024 (cited in FAHR announcements). UAE government public holidays reference: https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays

All monitoring-status dates are estimates based on the Islamic calendar. These must not be treated as confirmed without official FAHR or WAM announcement.`;

const EN_NOTES =
  "datesJson scope: 4 items (New Year, Eid Al Fitr, Commemoration Day, National Day). Eid Al Adha excluded -- already in may-2026-uae-calendar. Commemoration Day and National Day: dates are statutory; 2026 FAHR scope pending. FAHR scope announcement expected November 2026.";

const EN_SEO_TITLE =
  "UAE Public Holidays 2026-2027: Confirmed Dates and Long Weekends";

const EN_META =
  "UAE public holidays 2026-2027: confirmed FAHR dates for New Year, Eid Al Fitr, Eid Al Adha. Which long weekends are confirmed and which to monitor.";

// ---- RU content ------------------------------------------------------------

const RU_TITLE =
  "Праздники ОАЭ 2026-2027: подтверждённые даты и длинные выходные";

const RU_SUMMARY =
  "Три праздника в ОАЭ на 2026 год подтверждены FAHR: Новый год (1 января), Ид аль-Фитр (19-22 марта) и Ид аль-Адха (25-29 мая). Даты Дня поминовения и Национального дня закреплены законодательно. Остальные исламские праздники 2026 года и все праздники 2027 года находятся в режиме мониторинга.";

const RU_BODY = `## Как объявляются праздники в ОАЭ

В ОАЭ существует два типа официальных праздников. Праздники с фиксированными датами -- Новый год (1 января), День поминовения (1 декабря) и Национальный день (2-3 декабря) -- закреплены законодательно и известны заранее. Исламские праздники -- Ид аль-Фитр, Ид аль-Адха, Исламский Новый год и Мавлид ан-Наби -- объявляются властями ОАЭ после официального наблюдения полумесяца, как правило за одну-две недели до даты.

FAHR выпускает официальный циркуляр для федеральных ведомств. MoHRE выпускает соответствующее объявление для частного сектора. Даты в двух объявлениях могут отличаться на один день.

## Кому какие выходные положены

Для федеральных ведомств и частного сектора выходные не всегда совпадают. В 2026 году Ид аль-Адха начался в понедельник 25 мая для федеральных служащих (по объявлению FAHR) и во вторник 26 мая для сотрудников частного сектора (по объявлению MoHRE). Школы и другие регулируемые сектора могут следовать отдельным правилам.

## 2026 год -- подтверждено FAHR (федеральные ведомства)

| Праздник | Дата | Дней | Примечание |
|---------|------|------|-----------|
| Новый год 2026 | Четверг, 1 января | 1 день + удалённая пятница | Пятница 2 января -- удалённая работа, не официальный выходной |
| Ид аль-Фитр 2026 | Четверг 19 марта -- воскресенье 22 марта | 4 дня | Работа возобновилась в понедельник 23 марта |
| Ид аль-Адха 2026 | Понедельник 25 мая -- пятница 29 мая | 5 дней | С предшествующими Сб-Вс -- 9-дневный период |

Источник для всех трёх: официальные объявления FAHR. Даты Ид аль-Адха 2026 представлены в [майском календаре ОАЭ](/ru/calendar/may-2026-uae-calendar).

## 2026 год -- фиксированные даты по закону

| Праздник | Дата | День недели | Статус |
|---------|------|-------------|--------|
| День поминовения | 1 декабря 2026 | Вторник | Дата закреплена законом. Объявление FAHR о порядке выходных: ожидается в ноябре 2026 г. |
| Национальный день ОАЭ | 2-3 декабря 2026 | Среда-четверг | Даты закреплены законом. Объявление FAHR о порядке выходных: ожидается в ноябре 2026 г. |

Три праздничных дня (вт-чт) примыкают к рабочей пятнице -- наличие дополнительного выходного зависит от объявления FAHR в ноябре 2026 года.

## 2026 год -- мониторинг (не подтверждено)

Даты исламских праздников в остальной части 2026 года ещё не подтверждены официально. Приведённые ниже даты являются расчётными и не должны считаться подтверждёнными без официального объявления FAHR или WAM.

| Праздник | Примерная дата | Статус |
|---------|---------------|--------|
| Исламский Новый год 1448 г.х. | ~16-17 июня 2026 | Ждём объявления FAHR -- как правило за 2 недели до даты |
| Мавлид ан-Наби 1448 г.х. | ~25 августа 2026 | Ждём объявления FAHR -- как правило за 2 недели до даты |

## 2027 год

Даты исламских праздников на 2027 год являются предварительными и зависят от наблюдения луны. По состоянию на май 2026 года объявлений FAHR на 2027 год не существует. Новый год 2027 (1 января -- пятница) -- фиксированная дата, объявление FAHR ожидается в ноябре-декабре 2026 года.

## Что нужно проверить жителям ОАЭ

- Ваш сектор занятости (федеральные ведомства или частный бизнес) определяет, какое объявление применяется к вашей ситуации.
- Для исламских праздников не бронируйте поездки и не планируйте отпуск до официального объявления FAHR или MoHRE.
- Для Дня поминовения и Национального дня 2026 года даты зафиксированы (1-3 декабря), но будет ли добавлен дополнительный выходной -- зависит от объявления FAHR в ноябре 2026 года.
- Если ваш работодатель или школа подчиняются отдельному регулятору (например, KHDA для частных школ Дубая), проверьте объявление именно этого регулятора.

## Для бизнеса

Федеральные ведомства и большинство центров госуслуг (ICA, Amer, Tasheel) закрыты или работают в сокращённом режиме в дни официальных праздников. Онлайн-порталы госуслуг, как правило, продолжают работать.

Для подачи документов, связанных с периодом 1-3 декабря 2026 года, рекомендуем завершить всё к 25 ноября.

## Что не следует считать само собой разумеющимся

- Что у всех одинаковые выходные. Даты для федеральных ведомств, частного сектора и школ подтверждаются отдельно и могут отличаться на один день.
- Что расчётные даты исламского календаря являются официальными. Дата в приложении -- это оценка. Официальным является только объявление FAHR или WAM.
- Что удалённый режим работы равнозначен официальному выходному. Пятница 2 января 2026 была днём удалённой работы, не официальным выходным.

## Источники

Подтверждённые праздничные даты на 2026 год взяты из официальных объявлений FAHR:

- Новый год 2026: https://www.fahr.gov.ae/en/news/fahr-announces-new-year-2026-holiday-for-the-federal-government/
- Ид аль-Фитр 2026: https://www.fahr.gov.ae/en/news/eid-al-fitr-holiday-in-the-federal-government-from-19-to-22-march-2026/
- Ид аль-Адха 2026 (федеральный сектор): https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/

Все предварительные даты основаны на исламском лунном календаре и не являются официальными без объявления FAHR или WAM.`;

const RU_NOTES =
  "datesJson: 4 позиции (Новый год, Ид аль-Фитр, День поминовения, Национальный день). Ид аль-Адха исключён (уже в may-2026-uae-calendar). День поминовения и Национальный день: даты закреплены законом, порядок выходных FAHR 2026 ожидается в ноябре.";

const RU_SEO_TITLE =
  "Праздники ОАЭ 2026-2027: подтверждённые даты и длинные выходные";

const RU_META =
  "Праздники ОАЭ 2026-2027: подтверждённые даты FAHR -- Новый год, Ид аль-Фитр, Ид аль-Адха. Какие длинные выходные подтверждены, а какие ждать объявления.";

// ---- datesJson: 4 items ONLY. Eid Al Adha EXCLUDED. -----------------------

const DATES_JSON = JSON.stringify([
  {
    date: "2026-01-01",
    label_en: "New Year 2026 -- Federal Holiday (FAHR confirmed)",
    label_ru: "Новый год 2026 -- государственный праздник (подтверждено FAHR)",
    short_label_en: "New Year 2026",
    short_label_ru: "Новый год 2026",
    type: "holiday",
    confidence: "confirmed",
    priority: 1,
    detail_url: "/calendar/uae-long-weekends-2026-2027",
  },
  {
    date: "2026-03-19",
    date_end: "2026-03-22",
    label_en: "Eid Al Fitr 2026 -- Federal Holiday (FAHR confirmed)",
    label_ru: "Ид аль-Фитр 2026 -- государственный праздник (подтверждено FAHR)",
    short_label_en: "Eid Al Fitr 2026",
    short_label_ru: "Ид аль-Фитр 2026",
    type: "holiday",
    confidence: "confirmed",
    priority: 2,
    detail_url: "/calendar/uae-long-weekends-2026-2027",
  },
  {
    date: "2026-12-01",
    label_en: "Commemoration Day -- Federal Holiday (date statutory; 2026 scope pending FAHR)",
    label_ru: "День поминовения -- государственный праздник (дата по закону; порядок FAHR в ноябре)",
    short_label_en: "Commemoration Day",
    short_label_ru: "День поминовения",
    type: "holiday",
    confidence: "expected",
    priority: 3,
    detail_url: "/calendar/uae-long-weekends-2026-2027",
  },
  {
    date: "2026-12-02",
    date_end: "2026-12-03",
    label_en: "UAE National Day -- Federal Holiday (dates statutory; 2026 scope pending FAHR)",
    label_ru: "Национальный день ОАЭ -- государственный праздник (даты по закону; порядок FAHR в ноябре)",
    short_label_en: "National Day 2026",
    short_label_ru: "Национальный день 2026",
    type: "holiday",
    confidence: "expected",
    priority: 4,
    detail_url: "/calendar/uae-long-weekends-2026-2027",
  },
]);

// ---- Pre-flight em dash validation -----------------------------------------

section("Pre-flight em dash validation");

const ALL_STRINGS: Array<[string, string]> = [
  ["EN_TITLE",    EN_TITLE],
  ["EN_SUMMARY",  EN_SUMMARY],
  ["EN_BODY",     EN_BODY],
  ["EN_NOTES",    EN_NOTES],
  ["EN_SEO_TITLE",EN_SEO_TITLE],
  ["EN_META",     EN_META],
  ["RU_TITLE",    RU_TITLE],
  ["RU_SUMMARY",  RU_SUMMARY],
  ["RU_BODY",     RU_BODY],
  ["RU_NOTES",    RU_NOTES],
  ["RU_SEO_TITLE",RU_SEO_TITLE],
  ["RU_META",     RU_META],
  ["DATES_JSON",  DATES_JSON],
];

for (const [label, value] of ALL_STRINGS) {
  assertClean(label, value);
}
log("  All strings clean -- no em dashes found.");

// ---- Pre-flight duplicate guard -------------------------------------------

section("Pre-flight: check for existing record with this slug");

const existing = db
  .select({ id: calendarPages.id, status: calendarPages.status })
  .from(calendarPages)
  .where(eq(calendarPages.slug, SLUG))
  .get();

if (existing) {
  console.error(`\nABORT: Record already exists for slug "${SLUG}". id=${existing.id}, status=${existing.status}`);
  console.error("  If you want to re-import, delete the existing record first.");
  process.exit(1);
}
log(`  No existing record for slug "${SLUG}" -- safe to import.`);

// ---- datesJson pre-flight -------------------------------------------------

section("Pre-flight: datesJson validation");

const parsedDates = JSON.parse(DATES_JSON);
if (!Array.isArray(parsedDates) || parsedDates.length !== 4) {
  console.error(`\nABORT: datesJson must contain exactly 4 items. Found: ${parsedDates.length}`);
  process.exit(1);
}

const eidAdhaCheck = parsedDates.some(
  (d: Record<string, unknown>) =>
    typeof d.date === "string" && d.date.startsWith("2026-05-2"),
);
if (eidAdhaCheck) {
  console.error("\nABORT: Eid Al Adha date (May 25-29) found in datesJson. Must be excluded -- already in may-2026-uae-calendar.");
  process.exit(1);
}

log(`  datesJson: ${parsedDates.length} items.`);
for (const d of parsedDates) {
  log(`    date=${d.date}${d.date_end ? ` to ${d.date_end}` : ""} | type=${d.type} | confidence=${d.confidence} | short_label_en=${d.short_label_en}`);
}
log("  No Eid Al Adha date found -- safe to proceed.");

// ---- Import ---------------------------------------------------------------

section("Creating calendar page draft");

const calResult = createCalendarDraft({
  slug: SLUG,
  calendar_type: "yearly",
  year: 2026,
  // month: not passed -- becomes null in DB (yearly reference page)
  en_title:            EN_TITLE,
  en_summary:          EN_SUMMARY,
  en_body:             EN_BODY,
  en_notes:            EN_NOTES,
  en_seo_title:        EN_SEO_TITLE,
  en_meta_description: EN_META,
  ru_published:        1,
  ru_title:            RU_TITLE,
  ru_summary:          RU_SUMMARY,
  ru_body:             RU_BODY,
  ru_notes:            RU_NOTES,
  ru_seo_title:        RU_SEO_TITLE,
  ru_meta_description: RU_META,
  image_path:          "/images/hubs/dubai-skyline-downtown.webp",
  image_alt:           "Dubai skyline, UAE public holidays and long weekends 2026-2027",
  ru_image_alt:        "Дубай, праздники и выходные в ОАЭ 2026-2027",
  dates_json:          DATES_JSON,
  has_islamic_dates:   0,
  official_source_url: FAHR_EID_ADHA_URL,
  last_verified_date:  "2026-05-21",
  featured_homepage:   0,
});

if (!calResult.ok) {
  console.error("  FAIL createCalendarDraft:", calResult.errors);
  process.exit(1);
}
log(`  Draft created: id=${calResult.id}`);
const calId = calResult.id!;

section("Publishing calendar page");

const pubResult = publishCalendar(calId);
if (!pubResult.ok) {
  console.error("  FAIL publishCalendar:", pubResult.errors);
  process.exit(1);
}

if (pubResult.warnings.length > 0) {
  log(`  Warnings: ${pubResult.warnings.join(" | ")}`);
} else {
  log("  Warnings: none");
}
log(`  Status: published`);

// ---- Post-import DB verification -----------------------------------------

section("Post-import DB verification");

const row = db
  .select({
    id:             calendarPages.id,
    slug:           calendarPages.slug,
    status:         calendarPages.status,
    calendarType:   calendarPages.calendarType,
    year:           calendarPages.year,
    month:          calendarPages.month,
    ruPublished:    calendarPages.ruPublished,
    hasIslamicDates: calendarPages.hasIslamicDates,
    featuredHomepage: calendarPages.featuredHomepage,
    datesJson:      calendarPages.datesJson,
    officialSourceUrl: calendarPages.officialSourceUrl,
    lastVerifiedDate:  calendarPages.lastVerifiedDate,
  })
  .from(calendarPages)
  .where(eq(calendarPages.slug, SLUG))
  .get();

if (!row) {
  console.error(`\nFAIL: Could not find record after insert. slug=${SLUG}`);
  process.exit(1);
}

const verifiedDates = JSON.parse(row.datesJson);

log(`
  id:               ${row.id}
  slug:             ${row.slug}
  status:           ${row.status}
  calendarType:     ${row.calendarType}
  year:             ${row.year}
  month:            ${row.month === null ? "null (yearly)" : row.month}
  ruPublished:      ${row.ruPublished}
  hasIslamicDates:  ${row.hasIslamicDates}
  featuredHomepage: ${row.featuredHomepage}
  datesJson items:  ${verifiedDates.length}
  officialSourceUrl: ${row.officialSourceUrl.slice(0, 60)}...
  lastVerifiedDate:  ${row.lastVerifiedDate}
`);

// Assertions
let assertionsFailed = 0;

function assert(label: string, condition: boolean, detail = "") {
  if (condition) {
    log(`  PASS  ${label}`);
  } else {
    console.error(`  FAIL  ${label}${detail ? " -- " + detail : ""}`);
    assertionsFailed++;
  }
}

assert("status = published",           row.status === "published");
assert("calendarType = yearly",        row.calendarType === "yearly");
assert("month = null",                 row.month === null);
assert("year = 2026",                  row.year === 2026);
assert("ruPublished = 1",              row.ruPublished === 1);
assert("hasIslamicDates = 0",          row.hasIslamicDates === 0);
assert("featuredHomepage = 0",         row.featuredHomepage === 0);
assert("datesJson has 4 items",        verifiedDates.length === 4);
assert("No Eid Al Adha in datesJson", !verifiedDates.some(
  (d: Record<string, unknown>) => typeof d.date === "string" && d.date.startsWith("2026-05-2"),
), "Eid Al Adha (May 25-29) must not be in datesJson");

if (assertionsFailed > 0) {
  console.error(`\nFAIL: ${assertionsFailed} assertion(s) failed.`);
  process.exit(1);
}

// ---- Summary report -------------------------------------------------------

section("Import complete -- summary report");

log(`
CREATED AND PUBLISHED (1 record):

  Calendar: id=${calId}
            slug=${SLUG}
            url=/calendar/${SLUG}
            ru_url=/ru/calendar/${SLUG}
            ru_published=1
            calendarType=yearly
            month=null
            year=2026
            featuredHomepage=0
            hasIslamicDates=0

DATES_JSON (4 items -- Eid Al Adha EXCLUDED):
  1  New Year 2026             2026-01-01          holiday   confirmed
     detail_url=/calendar/uae-long-weekends-2026-2027
  2  Eid Al Fitr 2026          2026-03-19 to 2026-03-22  holiday   confirmed
     detail_url=/calendar/uae-long-weekends-2026-2027
  3  Commemoration Day         2026-12-01          holiday   expected
     detail_url=/calendar/uae-long-weekends-2026-2027
  4  National Day              2026-12-02 to 2026-12-03  holiday   expected
     detail_url=/calendar/uae-long-weekends-2026-2027

EXCLUDED (NOT in datesJson):
  Eid Al Adha May 25-29  -- already in may-2026-uae-calendar

SOURCE:
  official_source_url: FAHR Eid Al Adha 2026 announcement (HTTP 200, verified 2026-05-21)

No push. No deploy. No git commit. Owner production approval required.
`);

/**
 * Phase 6C-87 -- September 2026 Dubai Calendar Local Import QA
 * LOCAL ONLY -- do NOT run against production.
 *
 * Creates new september-2026-dubai-calendar row (does not exist in DB yet):
 *   SEP-01-MEE    (2026-09-01)  Middle East Energy + Intersolar ME at DWTC   L1
 *   SEP-02-IPS    (2026-09-07)  International Property Show at DWTC           L1
 *   SEP-03-AIM    (2026-09-07)  Annual Investment Meeting Congress at DWTC    L1
 *   SEP-04-ATM    (2026-09-14)  Arabian Travel Market at DWTC (Sep 14-17)     L2 brief
 *   SEP-05-PLME   (2026-09-15)  Private Label Middle East at DWTC             L1
 *   SEP-06-SEAMLESS (2026-09-22) Seamless Middle East at DWTC                L1
 *   SEP-07-FOREX  (2026-09-22)  Forex Expo Dubai at DWTC                      L1
 *   SEP-08-TAX    (2026-09-30)  UAE Corp Tax FY2025 example deadline (Dec YE) L2 brief
 *
 * Coverage: 14/30 unique days = 46.7% (below 60-70% target, documented).
 * ATM dates: Sep 14-17 (NOT Aug 17-20 -- corrected in Phase 6C-83).
 *
 * Source: docs/content-drafts/calendar/september-2026-dubai-calendar.md
 *         docs/content-drafts/source-ledgers/august-september-2026-calendar-sources.md
 *         docs/content-drafts/PHASE_6C83_AUGUST_SEPTEMBER_2026_CALENDAR_SOURCE_RADAR_AND_DRAFT_PACK.md
 * Run:    npx tsx scripts/september-2026-calendar-import-6c87.ts
 */

import {
  getAllCalendarPages,
  createCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Safety constants -------------------------------------------------------

const EM = "—"; // em dash U+2014 -- must not appear in any public string

function assertClean(label: string, value: string): void {
  if (value.includes(EM)) {
    console.error(`\nABORT: em dash found in "${label}". Fix before re-running.`);
    process.exit(1);
  }
}

function log(msg: string) { console.log(msg); }
function section(title: string) {
  console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`);
}

// ---- Source URLs ------------------------------------------------------------

const MEE_URL        = "https://www.middleeast-energy.com/en/home.html";
const DWTC_IPS       = "https://www.dwtc.com/en/events/international-property-show-2026/";
const AIM_URL        = "https://www.aimcongress.com/";
const DWTC_ATM       = "https://www.dwtc.com/en/events/arabian-travel-market-exhibition-2026/";
const ATM_OFFICIAL   = "https://www.arabiantravelmarket.wtm.com/";
const DWTC_EVENTS    = "https://www.dwtc.com/en/events/";
const DWTC_SEAMLESS  = "https://www.dwtc.com/en/events/seamless-2026/";
const DWTC_FOREX     = "https://www.dwtc.com/en/events/the-forex-expo-2026/";
const FTA_URL        = "https://tax.gov.ae";

// ---- Target slug ------------------------------------------------------------

const CAL_SLUG = "september-2026-dubai-calendar";

// ---- Page-level strings -----------------------------------------------------

const CAL_EN_TITLE =
  "September 2026 in Dubai: trade events, exhibitions and key deadlines";

const CAL_RU_TITLE =
  "Дубай, сентябрь 2026: деловые мероприятия, выставки и важные сроки";

const CAL_EN_SUMMARY =
  "September 2026 in Dubai brings a cluster of major trade exhibitions at Dubai World Trade Centre: Middle East Energy (1-3 Sept), the International Property Show and AIM Congress (7-9 Sept), Arabian Travel Market (14-17 Sept) and Seamless Middle East (22-24 Sept). The UAE Corporate Tax FY2025 example filing deadline falls on 30 September for December year-end companies.";

const CAL_RU_SUMMARY =
  "В сентябре 2026 года в Дубае проходит ряд крупных деловых выставок в Dubai World Trade Centre: Middle East Energy (1-3 сент.), International Property Show и AIM Congress (7-9 сент.), Arabian Travel Market (14-17 сент.) и Seamless Middle East (22-24 сент.). 30 сентября -- пример срока подачи декларации по корпоративному налогу ОАЭ за 2025 год (для компаний с годом, завершившимся 31 декабря).";

const CAL_EN_BODY =
  `September 2026 is Dubai's first full post-summer month, anchored by a concentrated run of professional trade exhibitions at Dubai World Trade Centre. Middle East Energy 2026 (50th edition) and co-located Intersolar Middle East open the month 1-3 September with energy and renewables industry focus. The International Property Show and Annual Investment Meeting both run 7-9 September. Arabian Travel Market, rescheduled from May, takes place 14-17 September. Seamless Middle East (fintech and payments) and the Forex Expo Dubai share the 22-24 September slot. For companies whose financial year ended 31 December 2025, the UAE Corporate Tax nine-month rule creates an example filing deadline of 30 September 2026.

Source dates in this calendar are drawn from official government and organizer announcements. Confirm compliance-related details with a qualified adviser before acting.`;

const CAL_RU_BODY =
  `Сентябрь 2026 года -- первый полный месяц после летнего сезона в Дубае, насыщенный профессиональными выставками в Dubai World Trade Centre. 1-3 сентября открывается юбилейная, 50-я выставка Middle East Energy 2026 с одновременной Intersolar Middle East. С 7 по 9 сентября проходят International Property Show и Annual Investment Meeting. Arabian Travel Market, перенесённая с мая, состоится 14-17 сентября. Seamless Middle East (финтех и платежи) и Forex Expo Dubai проходят параллельно 22-24 сентября. Для компаний с финансовым годом, завершившимся 31 декабря 2025 года, правило девяти месяцев в ОАЭ устанавливает пример срока подачи декларации по корпоративному налогу -- 30 сентября 2026 года.

Даты в этом календаре основаны на официальных объявлениях государственных органов и организаторов. По вопросам соблюдения требований законодательства рекомендуется проконсультироваться с квалифицированным советником.`;

// Public-facing source disclosure only -- never internal editorial notes
const CAL_EN_NOTES =
  "September deadlines: the Corporate Tax example deadline of 30 September applies to companies with a December 31 year-end only. Check your own financial year-end and consult a tax adviser before acting. Source: Federal Tax Authority (tax.gov.ae).";

const CAL_RU_NOTES =
  "Срок 30 сентября по корпоративному налогу -- пример для компаний с отчётным периодом по 31 декабря 2025 года. Уточните ваш финансовый год и проконсультируйтесь с налоговым советником. Источник: Федеральный налоговый орган ОАЭ (tax.gov.ae).";

const CAL_EN_SEO_TITLE =
  "September 2026 Dubai calendar: trade events, ATM and corporate tax deadline";

const CAL_RU_SEO_TITLE =
  "Дубай, сентябрь 2026: выставки, ATM и срок корпоративного налога";

const CAL_EN_META =
  "September 2026 in Dubai: Middle East Energy (1-3 Sept), International Property Show and AIM Congress (7-9 Sept), Arabian Travel Market (14-17 Sept), Seamless Middle East (22-24 Sept), Corporate Tax example deadline 30 Sept.";

const CAL_RU_META =
  "Сентябрь 2026 в Дубае: Middle East Energy (1-3 сент.), IPS и AIM Congress (7-9 сент.), Arabian Travel Market (14-17 сент.), Seamless Middle East (22-24 сент.), срок корпоративного налога 30 сент.";

// ---- dates_json (8 items) ---------------------------------------------------

const DATES_JSON = JSON.stringify([

  // SEP-01-MEE -- Middle East Energy + Intersolar ME (L1 -- no brief)
  {
    id: "SEP-01-MEE",
    date: "2026-09-01",
    label_en: "Middle East Energy 2026 (50th edition) and Intersolar Middle East at DWTC (1-3 September)",
    label_ru: "Middle East Energy 2026 (50-я выставка) и Intersolar Middle East в DWTC (1-3 сентября)",
    short_label_en: "Middle East Energy",
    short_label_ru: "Middle East Energy",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Middle East Energy / DWTC: official",
    source_label_ru: "Middle East Energy / DWTC: официально",
    source_url: MEE_URL,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: MEE_URL,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-04",
    archive_action: "remove",
  },

  // SEP-02-IPS -- International Property Show (L1 -- no brief)
  {
    id: "SEP-02-IPS",
    date: "2026-09-07",
    label_en: "International Property Show 2026 at Dubai World Trade Centre (7-9 September)",
    label_ru: "International Property Show 2026 в Dubai World Trade Centre (7-9 сентября)",
    short_label_en: "Int'l Property Show",
    short_label_ru: "Int'l Property Show",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "DWTC: official",
    source_label_ru: "DWTC: официально",
    source_url: DWTC_IPS,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DWTC_IPS,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-10",
    archive_action: "remove",
  },

  // SEP-03-AIM -- Annual Investment Meeting Congress (L1 -- no brief)
  {
    id: "SEP-03-AIM",
    date: "2026-09-07",
    label_en: "Annual Investment Meeting (AIM) Congress 2026 at Dubai World Trade Centre (7-9 September)",
    label_ru: "Annual Investment Meeting (AIM) Congress 2026 в Dubai World Trade Centre (7-9 сентября)",
    short_label_en: "AIM Congress 2026",
    short_label_ru: "AIM Congress 2026",
    type: "conference",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "AIM Congress: official",
    source_label_ru: "AIM Congress: официально",
    source_url: AIM_URL,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: AIM_URL,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-10",
    archive_action: "remove",
  },

  // SEP-04-ATM -- Arabian Travel Market 2026 (L2 brief -- CORRECTED Sep 14-17, NOT Aug)
  {
    id: "SEP-04-ATM",
    date: "2026-09-14",
    label_en: "Arabian Travel Market (ATM) 2026 at Dubai World Trade Centre (14-17 September)",
    label_ru: "Arabian Travel Market (ATM) 2026 в Dubai World Trade Centre (14-17 сентября)",
    short_label_en: "Arabian Travel Mkt",
    short_label_ru: "Arabian Travel Mkt",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Arabian Travel Market (ATM) 2026 takes place 14-17 September at Dubai World Trade Centre, the annual gathering for the travel, tourism and hospitality industry across the Middle East and Africa. The 2026 edition was rescheduled from its original May 2026 dates. ATM covers aviation, hotels, travel technology, destination marketing, hospitality and holiday homes. The show is primarily trade and professional but relevant to hospitality businesses, hotel operators, tourism service providers and holiday home managers. Registration and programme details are available at arabiantravelmarket.com.",
    brief_ru: "Arabian Travel Market (ATM) 2026 пройдёт с 14 по 17 сентября в Dubai World Trade Centre. Это ежегодная выставка для профессионалов туристической, гостиничной и авиационной отраслей Ближнего Востока и Африки. Выставка 2026 года перенесена с первоначально запланированного мая. ATM охватывает направления авиации, отелей, туристических технологий, маркетинга направлений и апарт-отелей. Ориентирована на представителей отрасли: операторов гостиниц, турагентства и управляющих краткосрочной арендой. Регистрация и программа: arabiantravelmarket.com.",
    source_label_en: "DWTC / ATM: official (Sep 14-17 confirmed May 22, 2026)",
    source_label_ru: "DWTC / ATM: официально (14-17 сент., подтверждено 22 мая 2026)",
    source_url: DWTC_ATM,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: ATM_OFFICIAL,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-18",
    archive_action: "remove",
  },

  // SEP-05-PLME -- Private Label Middle East (L1 -- no brief)
  {
    id: "SEP-05-PLME",
    date: "2026-09-15",
    label_en: "Private Label Middle East 2026 at Dubai World Trade Centre (15-17 September)",
    label_ru: "Private Label Middle East 2026 в Dubai World Trade Centre (15-17 сентября)",
    short_label_en: "Private Label ME",
    short_label_ru: "Private Label ME",
    type: "trade_show",
    confidence: "confirmed",
    priority: 5,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "DWTC: official",
    source_label_ru: "DWTC: официально",
    source_url: DWTC_EVENTS,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DWTC_EVENTS,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-18",
    archive_action: "remove",
  },

  // SEP-06-SEAMLESS -- Seamless Middle East (L1 -- no brief)
  {
    id: "SEP-06-SEAMLESS",
    date: "2026-09-22",
    label_en: "Seamless Middle East 2026 at Dubai World Trade Centre (22-24 September)",
    label_ru: "Seamless Middle East 2026 в Dubai World Trade Centre (22-24 сентября)",
    short_label_en: "Seamless ME 2026",
    short_label_ru: "Seamless ME 2026",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "DWTC: official",
    source_label_ru: "DWTC: официально",
    source_url: DWTC_SEAMLESS,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DWTC_SEAMLESS,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-25",
    archive_action: "remove",
  },

  // SEP-07-FOREX -- Forex Expo Dubai (L1 -- no brief)
  {
    id: "SEP-07-FOREX",
    date: "2026-09-22",
    label_en: "The Forex Expo Dubai 2026 at Dubai World Trade Centre (22-23 September)",
    label_ru: "Forex Expo Dubai 2026 в Dubai World Trade Centre (22-23 сентября)",
    short_label_en: "Forex Expo Dubai",
    short_label_ru: "Forex Expo Dubai",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "DWTC / Forex Expo: official",
    source_label_ru: "DWTC / Forex Expo: официально",
    source_url: DWTC_FOREX,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DWTC_FOREX,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-24",
    archive_action: "remove",
  },

  // SEP-08-TAX -- UAE Corporate Tax FY2025 example deadline (L2 brief -- HIGH RISK)
  {
    id: "SEP-08-TAX",
    date: "2026-09-30",
    label_en: "UAE Corporate Tax FY2025: example filing deadline for December year-end companies (30 September)",
    label_ru: "Корпоративный налог ОАЭ за 2025 год: пример срока подачи для компаний с годом по 31 декабря",
    short_label_en: "Corp Tax deadline",
    short_label_ru: "Срок корп. налога",
    type: "compliance",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Under the UAE nine-month filing rule, 30 September 2026 is the corporate tax return and payment deadline for businesses whose financial year ended on 31 December 2025. This date applies only to December 31 year-end companies. Businesses with other financial year-end dates have different deadlines calculated from their own year-end. The tax return and payment must be submitted through the Federal Tax Authority's EmaraTax portal. Penalties apply for late filing and late payment. Confirm your own year-end date and filing obligations with a qualified tax adviser. Filing guidance is available at tax.gov.ae.",
    brief_ru: "По правилу девяти месяцев в ОАЭ 30 сентября 2026 года является примером срока подачи декларации и уплаты корпоративного налога для компаний, финансовый год которых завершился 31 декабря 2025 года. Эта дата применяется только к компаниям с отчётным периодом по 31 декабря. Компании с иным финансовым годом имеют другие сроки, рассчитанные от их собственной даты окончания года. Декларация и оплата подаются через портал EmaraTax Федерального налогового органа (FTA). За нарушение сроков предусмотрены штрафы. Уточните ваш финансовый год у налогового советника. Инструкции по подаче: tax.gov.ae.",
    source_label_en: "Federal Tax Authority (FTA): official nine-month rule",
    source_label_ru: "Федеральный налоговый орган ОАЭ (FTA): правило девяти месяцев",
    source_url: FTA_URL,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: FTA_URL,
    cta_label_en: "FTA official guidance",
    cta_label_ru: "Официальные инструкции FTA",
    emirate: "UAE",
    risk_level: "high",
    lifecycle: "compliance_evergreen",
    noindex_after: "2026-10-15",
    archive_action: "keep",
  },

]);

// ---- Pre-flight em dash validation ------------------------------------------

section("Pre-flight em dash validation");

const ALL_STRINGS: Array<[string, string]> = [
  ["CAL_EN_TITLE",     CAL_EN_TITLE],
  ["CAL_RU_TITLE",     CAL_RU_TITLE],
  ["CAL_EN_SUMMARY",   CAL_EN_SUMMARY],
  ["CAL_RU_SUMMARY",   CAL_RU_SUMMARY],
  ["CAL_EN_BODY",      CAL_EN_BODY],
  ["CAL_RU_BODY",      CAL_RU_BODY],
  ["CAL_EN_NOTES",     CAL_EN_NOTES],
  ["CAL_RU_NOTES",     CAL_RU_NOTES],
  ["CAL_EN_SEO_TITLE", CAL_EN_SEO_TITLE],
  ["CAL_RU_SEO_TITLE", CAL_RU_SEO_TITLE],
  ["CAL_EN_META",      CAL_EN_META],
  ["CAL_RU_META",      CAL_RU_META],
  ["DATES_JSON",       DATES_JSON],
];

for (const [label, value] of ALL_STRINGS) {
  assertClean(label, value);
}
log("  All strings clean -- no em dashes found.");

// ---- Pre-flight: confirm slug does NOT already exist ------------------------

section("Pre-flight: confirm september-2026-dubai-calendar does not exist");

const allPages = getAllCalendarPages();
const existing = allPages.find(p => p.slug === CAL_SLUG);

if (existing) {
  console.error(`\nABORT: Slug "${CAL_SLUG}" already exists (id=${existing.id}, status=${existing.status}).`);
  console.error("       This script creates a new row. If you need to update, use updateCalendarDraft.");
  process.exit(1);
}

log(`  Slug "${CAL_SLUG}" not found -- safe to create.`);
log(`  Current calendar_pages count: ${allPages.length}`);

// ---- Pre-flight: validate dates_json IDs ------------------------------------

section("Pre-flight: validate dates_json item IDs");

const expectedIds = new Set([
  "SEP-01-MEE", "SEP-02-IPS", "SEP-03-AIM", "SEP-04-ATM",
  "SEP-05-PLME", "SEP-06-SEAMLESS", "SEP-07-FOREX", "SEP-08-TAX",
]);
const parsedDates = JSON.parse(DATES_JSON) as Array<{ id: string; date: string }>;
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

// ATM safety check: must be September, not August
const atm = parsedDates.find(d => d.id === "SEP-04-ATM");
if (!atm || !atm.date.startsWith("2026-09")) {
  console.error(`\nABORT: SEP-04-ATM date "${atm?.date}" is not in September 2026. ATM must be Sep 14-17.`);
  process.exit(1);
}

log(`  ${parsedDates.length} items, no duplicates.`);
log(`  IDs: ${[...seenIds].join(", ")}.`);
log(`  ATM date check: ${atm.date} -- confirmed September. ✓`);

// ---- Create calendar draft --------------------------------------------------

section("Create calendar draft -- september-2026-dubai-calendar");

const createResult = createCalendarDraft({
  slug:                CAL_SLUG,
  calendar_type:       "monthly",
  year:                2026,
  month:               9,
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
  last_verified_date:  "2026-05-28",
  featured_homepage:   0,
  image_path:          "/images/hubs/dubai-skyline-downtown.webp",
  image_alt:           "Dubai skyline, September 2026 key dates and events",
  ru_image_alt:        "Дубай, важные даты и события, сентябрь 2026",
  official_source_url: DWTC_EVENTS,
});

if (!createResult.ok) {
  console.error("  FAIL createCalendarDraft:", createResult.errors);
  process.exit(1);
}

const calId = createResult.id!;
log(`  Draft created. id=${calId}`);
log(`  Warnings: ${createResult.warnings.length ? createResult.warnings.join("; ") : "none"}`);

// ---- Publish ----------------------------------------------------------------

section("Publish september-2026-dubai-calendar");

const pubResult = publishCalendar(calId);
if (!pubResult.ok) {
  console.error("  FAIL publishCalendar:", pubResult.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${pubResult.warnings.length ? pubResult.warnings.join("; ") : "none"}`);

// ---- Summary report ---------------------------------------------------------

section("Import complete -- post-import report");

log(`
CREATED AND PUBLISHED (1 record):

  Calendar: id=${calId}
            slug=${CAL_SLUG}
            url=/calendar/${CAL_SLUG}
            ru_url=/ru/calendar/${CAL_SLUG}
            ru_published=1
            calendar_type=monthly
            year=2026  month=9
            last_verified_date=2026-05-28

DATES_JSON ITEMS (8 total):
  SEP-01-MEE      Middle East Energy + Intersolar ME      2026-09-01  trade_show   L1
  SEP-02-IPS      International Property Show             2026-09-07  trade_show   L1
  SEP-03-AIM      Annual Investment Meeting Congress      2026-09-07  conference   L1
  SEP-04-ATM      Arabian Travel Market (Sep 14-17)       2026-09-14  trade_show   L2 brief
  SEP-05-PLME     Private Label Middle East               2026-09-15  trade_show   L1
  SEP-06-SEAMLESS Seamless Middle East                    2026-09-22  trade_show   L1
  SEP-07-FOREX    Forex Expo Dubai                        2026-09-22  trade_show   L1
  SEP-08-TAX      Corp Tax FY2025 deadline (Dec YE only)  2026-09-30  compliance   L2 brief

ATM CORRECTION:
  Sep 14-17 (NOT Aug 17-20 -- corrected in Phase 6C-83, confirmed here)

COVERAGE:
  Sep 1-3 (MEE) + Sep 7-9 (IPS+AIM) + Sep 14-17 (ATM) + Sep 22-24 (Seamless+Forex) + Sep 30 (Tax)
  Unique days: 14/30 = 46.7% (below 60-70% target, documented)
  Gap days: Sep 4-6, 10-13, 18-21, 25-29 (16 days)
  Mawlid Al-Nabi: HOLD -- FAHR not announced
  Cityscape Dubai 2026: HOLD -- no official dates confirmed

LOCAL ONLY. No push. No deploy. No production DB write.
Production import requires separate owner approval (Phase 6C-88).
`);

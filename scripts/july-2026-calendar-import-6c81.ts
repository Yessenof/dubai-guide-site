/**
 * Phase 6C-81 -- July 2026 Dubai Calendar Local Import
 * LOCAL ONLY -- do NOT run against production.
 *
 * Creates new july-2026-dubai-calendar row (does not exist in DB yet):
 *   JUL-03-DSS   (2026-07-03)  Dubai Summer Surprises 2026 opens   L2 brief
 *   JUL-03-MODESH (2026-07-03) Modesh World at DWTC                L1
 *   JUL-03-KHAIR  (2026-07-03) Muntazah Al Khairan at Dubai Opera  L1
 *
 * Coverage: Jul 3-31 = 29/31 days = 93.5% (calendar-only).
 * Combined with e-invoicing Jul 1 (already live separately): 97%.
 *
 * Source: docs/content-drafts/calendar/july-2026-dubai-calendar.md
 *         docs/content-drafts/PHASE_6C80_JULY_2026_DSS_SUMMER_CALENDAR_ENRICHMENT.md
 * Run:    npx tsx scripts/july-2026-calendar-import-6c81.ts
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

const VISITDUBAI_DSS = "https://www.visitdubai.com/en/festivals-and-events/dss";
const DWTC_EVENTS    = "https://www.dwtc.com/en/events/";
const DUBAI_OPERA    = "https://www.dubaiopera.com/en-US/products-list";

// ---- Target slug ------------------------------------------------------------

const CAL_SLUG = "july-2026-dubai-calendar";

// ---- Page-level strings -----------------------------------------------------

const CAL_EN_TITLE =
  "July 2026 in Dubai: Dubai Summer Surprises and key dates";

const CAL_RU_TITLE =
  "Дубай, июль 2026: Dubai Summer Surprises и важные даты";

const CAL_EN_SUMMARY =
  "July 2026 in Dubai is anchored by Dubai Summer Surprises, a 59-day citywide festival of shopping deals, family entertainment and events running 3 July to 30 August. Includes Modesh World, the Great Dubai Summer Sale and more.";

const CAL_RU_SUMMARY =
  "Июль 2026 в Дубае: Dubai Summer Surprises, 59-дневный городской фестиваль с распродажами, семейными развлечениями и мероприятиями с 3 июля по 30 августа. Включает Modesh World, Большую летнюю распродажу и другие события.";

const CAL_EN_BODY =
  `July 2026 in Dubai opens with Dubai Summer Surprises (DSS) 2026, a 59-day citywide festival running 3 July to 30 August, organized by Dubai Festivals and Retail Establishment (DFRE). The festival brings shopping discounts across major malls, Modesh World at Dubai World Trade Centre, family entertainment, hotel promotions and prize draws. Sub-event dates and concert lineups are published by DFRE as the season progresses.

Source dates in this calendar are drawn from official government and organizer announcements. Confirm compliance-related details with a qualified adviser before acting.`;

const CAL_RU_BODY =
  `Июль 2026 года в Дубае открывается фестивалем Dubai Summer Surprises (DSS) 2026, который длится 59 дней с 3 июля по 30 августа. Организатор: Dubai Festivals and Retail Establishment (DFRE). Фестиваль охватывает весь город: скидки в торговых центрах, Modesh World в Dubai World Trade Centre, семейные развлечения, акции отелей и розыгрыши призов. Расписание отдельных мероприятий и концертную программу DFRE публикует по мере приближения сезона.

Даты в этом календаре основаны на официальных объявлениях государственных органов и организаторов. По вопросам соблюдения требований законодательства рекомендуется проконсультироваться с квалифицированным советником.`;

// Public-facing source disclosure only -- never internal editorial notes
const CAL_EN_NOTES =
  "Dubai Summer Surprises 2026 (3 July to 30 August): DFRE official programme. Sub-event dates and concert lineups are announced by DFRE closer to the opening date. E-invoicing Phase A (1 July): see the e-invoicing calendar entry.";

const CAL_RU_NOTES =
  "Dubai Summer Surprises 2026 (3 июля по 30 августа): официальная программа DFRE. Расписание мероприятий и концертная программа публикуются DFRE ближе к открытию фестиваля. Этап A e-invoicing (1 июля): см. отдельную запись в календаре.";

const CAL_EN_SEO_TITLE =
  "July 2026 Dubai calendar: Dubai Summer Surprises opens 3 July";

const CAL_RU_SEO_TITLE =
  "Дубай, июль 2026: Dubai Summer Surprises открывается 3 июля";

const CAL_EN_META =
  "July 2026 in Dubai: Dubai Summer Surprises (DSS) runs 3 July to 30 August with mall discounts, Modesh World at DWTC, family events and Muntazah Al Khairan at Dubai Opera on 3-4 July.";

const CAL_RU_META =
  "Июль 2026 в Дубае: фестиваль Dubai Summer Surprises с 3 июля по 30 августа, скидки в моллах, Modesh World в DWTC. Театральная комедия Muntazah Al Khairan в Dubai Opera 3-4 июля.";

// ---- dates_json (3 items) ---------------------------------------------------

const DATES_JSON = JSON.stringify([

  // JUL-03-DSS -- Dubai Summer Surprises 2026 (L2 brief)
  {
    id: "JUL-03-DSS",
    date: "2026-07-03",
    label_en: "Dubai Summer Surprises 2026 opens (3 July to 30 August)",
    label_ru: "Dubai Summer Surprises 2026 стартует (3 июля по 30 августа)",
    short_label_en: "Dubai Summer Surprises 2026",
    short_label_ru: "Dubai Summer Surprises 2026",
    type: "retail_offer",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Dubai Summer Surprises (DSS) 2026 runs from Friday 3 July to Sunday 30 August, organized by Dubai Festivals and Retail Establishment (DFRE), part of the Department of Economy and Tourism. The 59-day festival is Dubai's flagship summer event, featuring citywide shopping discounts, family entertainment, hotel promotions and prize draws across major malls. Key components include the Great Dubai Summer Sale, Modesh World at Dubai World Trade Centre, the Beat the Heat DXB concert series, and a Back to School retail phase in August. Specific sub-event dates and concert lineups are published by DFRE closer to the opening date. The official programme is available at visitdubai.com.",
    brief_ru: "Dubai Summer Surprises (DSS) 2026 проходит с пятницы, 3 июля, по воскресенье, 30 августа. Организатор: Dubai Festivals and Retail Establishment (DFRE) в составе Департамента экономики и туризма. За 59 дней фестиваль охватывает весь Дубай: скидки в торговых центрах, семейные развлечения, акции отелей и розыгрыши призов. Основные составляющие: Большая летняя распродажа в крупных моллах, Modesh World в Dubai World Trade Centre, концертная серия Beat the Heat DXB и фаза Back to School в августе. Точные даты мероприятий и концертную программу DFRE публикует ближе к открытию фестиваля. Официальная программа на visitdubai.com.",
    source_label_en: "DFRE / Visit Dubai: official",
    source_label_ru: "DFRE / Visit Dubai: официально",
    source_url: VISITDUBAI_DSS,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: VISITDUBAI_DSS,
    cta_label_en: "Official programme",
    cta_label_ru: "Официальная программа",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_seasonal",
    noindex_after: "2026-09-01",
    archive_action: "keep",
  },

  // JUL-03-MODESH -- Modesh World at DWTC (L1 -- no brief)
  {
    id: "JUL-03-MODESH",
    date: "2026-07-03",
    label_en: "Modesh World opens at Dubai World Trade Centre (within DSS)",
    label_ru: "Modesh World открывается в Dubai World Trade Centre (в рамках DSS)",
    short_label_en: "Modesh World 2026",
    short_label_ru: "Modesh World 2026",
    type: "family",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "DWTC / DFRE: annual event",
    source_label_ru: "DWTC / DFRE: ежегодное мероприятие",
    source_url: DWTC_EVENTS,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DWTC_EVENTS,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_seasonal",
    noindex_after: "2026-09-01",
    archive_action: "keep",
  },

  // JUL-03-KHAIR -- Muntazah Al Khairan at Dubai Opera (L1 -- no brief)
  {
    id: "JUL-03-KHAIR",
    date: "2026-07-03",
    label_en: "Muntazah Al Khairan: Theatrical Comedy at Dubai Opera (3-4 July, within DSS)",
    label_ru: "Muntazah Al Khairan: театральная комедия в Dubai Opera (3-4 июля, в рамках DSS)",
    short_label_en: "Muntazah Al Khairan",
    short_label_ru: "Muntazah Al Khairan",
    type: "entertainment",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Dubai Opera / Platinumlist: DSS 2026 official",
    source_label_ru: "Dubai Opera / Platinumlist: официально DSS 2026",
    source_url: DUBAI_OPERA,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DUBAI_OPERA,
    cta_label_en: "Book tickets",
    cta_label_ru: "Купить билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-07-05",
    archive_action: "remove",
  },

]);

// ---- Pre-flight em dash validation ------------------------------------------

section("Pre-flight em dash validation");

const ALL_STRINGS: Array<[string, string]> = [
  ["CAL_EN_TITLE",    CAL_EN_TITLE],
  ["CAL_RU_TITLE",    CAL_RU_TITLE],
  ["CAL_EN_SUMMARY",  CAL_EN_SUMMARY],
  ["CAL_RU_SUMMARY",  CAL_RU_SUMMARY],
  ["CAL_EN_BODY",     CAL_EN_BODY],
  ["CAL_RU_BODY",     CAL_RU_BODY],
  ["CAL_EN_NOTES",    CAL_EN_NOTES],
  ["CAL_RU_NOTES",    CAL_RU_NOTES],
  ["CAL_EN_SEO_TITLE",CAL_EN_SEO_TITLE],
  ["CAL_RU_SEO_TITLE",CAL_RU_SEO_TITLE],
  ["CAL_EN_META",     CAL_EN_META],
  ["CAL_RU_META",     CAL_RU_META],
  ["DATES_JSON",      DATES_JSON],
];

for (const [label, value] of ALL_STRINGS) {
  assertClean(label, value);
}
log("  All strings clean -- no em dashes found.");

// ---- Pre-flight: confirm slug does NOT already exist ------------------------

section("Pre-flight: confirm july-2026-dubai-calendar does not exist");

const allPages = getAllCalendarPages();
const existing = allPages.find(p => p.slug === CAL_SLUG);

if (existing) {
  console.error(`\nABORT: Slug "${CAL_SLUG}" already exists (id=${existing.id}, status=${existing.status}).`);
  console.error("       This script creates a new row. If you need to update, use updateCalendarDraft.");
  process.exit(1);
}

log(`  Slug "${CAL_SLUG}" not found -- safe to create.`);
log(`  Current calendar_pages count: ${allPages.length}`);

// ---- Pre-flight: validate dates_json IDs -----------------------------------

section("Pre-flight: validate dates_json item IDs");

const expectedIds = new Set(["JUL-03-DSS", "JUL-03-MODESH", "JUL-03-KHAIR"]);
const parsedDates = JSON.parse(DATES_JSON) as Array<{ id: string }>;
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

log(`  ${parsedDates.length} items, no duplicates. IDs: ${[...seenIds].join(", ")}.`);

// ---- Create calendar draft -------------------------------------------------

section("Create calendar draft -- july-2026-dubai-calendar");

const createResult = createCalendarDraft({
  slug:                CAL_SLUG,
  calendar_type:       "monthly",
  year:                2026,
  month:               7,
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
  last_verified_date:  "2026-05-27",
  featured_homepage:   0,
  image_path:          "/images/hubs/dubai-skyline-downtown.webp",
  image_alt:           "Dubai skyline, July 2026 key dates and events",
  ru_image_alt:        "Дубай, важные даты и события, июль 2026",
  official_source_url: VISITDUBAI_DSS,
});

if (!createResult.ok) {
  console.error("  FAIL createCalendarDraft:", createResult.errors);
  process.exit(1);
}

const calId = createResult.id!;
log(`  Draft created. id=${calId}`);
log(`  Warnings: ${createResult.warnings.length ? createResult.warnings.join("; ") : "none"}`);

// ---- Publish ----------------------------------------------------------------

section("Publish july-2026-dubai-calendar");

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
            year=2026  month=7
            last_verified_date=2026-05-27

DATES_JSON ITEMS (3 total):
  JUL-03-DSS    Dubai Summer Surprises 2026    2026-07-03  retail_offer  L2 brief (EN + RU)
  JUL-03-MODESH Modesh World at DWTC           2026-07-03  family        L1 (no brief)
  JUL-03-KHAIR  Muntazah Al Khairan (DSS)      2026-07-03  entertainment L1 (no brief)

COVERAGE:
  Jul 3-31 via DSS umbrella = 29 days = 93.5% (calendar-only)
  Combined with e-invoicing Jul 1 (separate page) = 97%

EXCLUDED (HOLD or signal_only):
  Beat the Heat DXB Season 5     HOLD -- no 2026 announcement
  Modesh World specific dates    HOLD -- no DWTC 2026 page yet
  Timur Bey 2 at CCA Jul 9      signal_only -- no CCA official source
  Great Dubai Summer Sale dates  HOLD -- not announced by DFRE

LOCAL ONLY. No push. No deploy. No production DB write.
Production import requires separate owner approval.
`);

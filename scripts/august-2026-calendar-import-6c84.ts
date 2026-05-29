/**
 * Phase 6C-84 -- August 2026 Dubai Calendar Local Import QA
 * LOCAL ONLY -- do NOT run against production.
 *
 * Creates new august-2026-dubai-calendar row (does not exist in DB yet):
 *   AUG-01-DSS    (2026-08-01)  Dubai Summer Surprises final month   L2 brief
 *   AUG-02-DEFLEP (2026-08-02)  Def Leppard at Coca-Cola Arena       L1
 *   AUG-03-DIHAD  (2026-08-24)  DIHAD Conference at DWTC             L1
 *
 * Coverage: Aug 1-30 via DSS umbrella = 30/31 days = 96.8%.
 * Aug 31 is the only gap (DSS ends Aug 30).
 *
 * Source: docs/content-drafts/calendar/august-2026-dubai-calendar.md
 *         docs/content-drafts/source-ledgers/august-september-2026-calendar-sources.md
 *         docs/content-drafts/PHASE_6C83_AUGUST_SEPTEMBER_2026_CALENDAR_SOURCE_RADAR_AND_DRAFT_PACK.md
 * Run:    npx tsx scripts/august-2026-calendar-import-6c84.ts
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
const CCA_DEFLEP     = "https://coca-cola-arena.com/music/1442/def-leppard";
const DWTC_EVENTS    = "https://www.dwtc.com/en/events/";

// ---- Target slug ------------------------------------------------------------

const CAL_SLUG = "august-2026-dubai-calendar";

// ---- Page-level strings -----------------------------------------------------

const CAL_EN_TITLE =
  "August 2026 in Dubai: Dubai Summer Surprises final month and events";

const CAL_RU_TITLE =
  "Дубай, август 2026: финальный месяц Dubai Summer Surprises и события";

const CAL_EN_SUMMARY =
  "August 2026 in Dubai is the final month of Dubai Summer Surprises, running through 30 August with shopping deals, the Back to School retail phase and family entertainment. The month also brings a live concert at Coca-Cola Arena and a major international conference at Dubai World Trade Centre.";

const CAL_RU_SUMMARY =
  "Август 2026 года в Дубае: финальный месяц фестиваля Dubai Summer Surprises, который продолжается до 30 августа с распродажами, фазой Back to School и семейными развлечениями. Также в программе: концерт в Coca-Cola Arena и крупная международная конференция в Dubai World Trade Centre.";

const CAL_EN_BODY =
  `August 2026 is the final full month of Dubai Summer Surprises (DSS) 2026, organized by Dubai Festivals and Retail Establishment (DFRE). The festival runs through Friday 30 August, with the Back to School retail phase bringing promotions on school supplies, uniforms and electronics at major Dubai malls during the second half of the month. Modesh World continues at Dubai World Trade Centre. On 2 August, Def Leppard brings their rock to Coca-Cola Arena. DIHAD, the Dubai International Humanitarian Aid and Development Conference, takes place 24-26 August at Dubai World Trade Centre.

Source dates in this calendar are drawn from official government and organizer announcements. Confirm compliance-related details with a qualified adviser before acting.`;

const CAL_RU_BODY =
  `Август 2026 года -- финальный полный месяц фестиваля Dubai Summer Surprises (DSS) 2026, организованного Dubai Festivals and Retail Establishment (DFRE). Фестиваль продолжается до пятницы, 30 августа. Фаза Back to School предлагает скидки на школьные принадлежности, форму и электронику в крупных торговых центрах во второй половине месяца. Modesh World продолжает работу в Dubai World Trade Centre. 2 августа в Coca-Cola Arena выступят Def Leppard. С 24 по 26 августа в Dubai World Trade Centre проходит DIHAD -- международная конференция по гуманитарной помощи и развитию.

Даты в этом календаре основаны на официальных объявлениях государственных органов и организаторов. По вопросам соблюдения требований законодательства рекомендуется проконсультироваться с квалифицированным советником.`;

// Public-facing source disclosure only -- never internal editorial notes
const CAL_EN_NOTES =
  "Dubai Summer Surprises 2026 runs through 30 August. Sub-event dates and Back to School phase offers are published by DFRE on visitdubai.com. Def Leppard: Coca-Cola Arena official page for ticket details.";

const CAL_RU_NOTES =
  "Dubai Summer Surprises 2026 продолжается до 30 августа. Расписание мероприятий и акции Back to School публикуются DFRE на visitdubai.com. Def Leppard: подробности на официальном сайте Coca-Cola Arena.";

const CAL_EN_SEO_TITLE =
  "August 2026 Dubai calendar: Dubai Summer Surprises through 30 August";

const CAL_RU_SEO_TITLE =
  "Дубай, август 2026: Dubai Summer Surprises до 30 августа";

const CAL_EN_META =
  "August 2026 in Dubai: Dubai Summer Surprises runs through 30 August with the Back to School retail phase. Def Leppard at Coca-Cola Arena on 2 August. DIHAD conference at DWTC 24-26 August.";

const CAL_RU_META =
  "Август 2026 в Дубае: Dubai Summer Surprises до 30 августа с фазой Back to School. Def Leppard в Coca-Cola Arena 2 августа. Конференция DIHAD в DWTC 24-26 августа.";

// ---- dates_json (3 items) ---------------------------------------------------

const DATES_JSON = JSON.stringify([

  // AUG-01-DSS -- Dubai Summer Surprises 2026 final month (L2 brief)
  {
    id: "AUG-01-DSS",
    date: "2026-08-01",
    label_en: "Dubai Summer Surprises 2026: final month, Back to School phase (through 30 August)",
    label_ru: "Dubai Summer Surprises 2026: финальный месяц, фаза Back to School (до 30 августа)",
    short_label_en: "Dubai Summer Surprises 2026",
    short_label_ru: "Dubai Summer Surprises 2026",
    type: "retail_offer",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Dubai Summer Surprises (DSS) 2026 continues through Friday 30 August, organized by Dubai Festivals and Retail Establishment (DFRE). August marks the festival's Back to School retail phase, with promotions on school supplies, uniforms and electronics at major malls across Dubai. Modesh World at Dubai World Trade Centre remains open. The festival began on 3 July and runs for 59 days in total. Specific offers, mall campaigns and Back to School phase dates are published by DFRE on visitdubai.com. August 31 falls after the festival close.",
    brief_ru: "Dubai Summer Surprises (DSS) 2026 продолжается до пятницы, 30 августа. Организатор: Dubai Festivals and Retail Establishment (DFRE). Август -- фаза Back to School: скидки на школьные принадлежности, форму и электронику в крупных торговых центрах Дубая. Modesh World в Dubai World Trade Centre продолжает работу. Фестиваль стартовал 3 июля и рассчитан на 59 дней в общей сложности. Расписание акций, кампании моллов и точные даты фазы Back to School DFRE публикует на visitdubai.com. 31 августа -- за пределами фестиваля.",
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

  // AUG-02-DEFLEP -- Def Leppard at Coca-Cola Arena (L1 -- no brief)
  {
    id: "AUG-02-DEFLEP",
    date: "2026-08-02",
    label_en: "Def Leppard live at Coca-Cola Arena (2 August)",
    label_ru: "Def Leppard: концерт в Coca-Cola Arena (2 августа)",
    short_label_en: "Def Leppard, CCA",
    short_label_ru: "Def Leppard, CCA",
    type: "venue_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Coca-Cola Arena: official",
    source_label_ru: "Coca-Cola Arena: официально",
    source_url: CCA_DEFLEP,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: CCA_DEFLEP,
    cta_label_en: "Book tickets",
    cta_label_ru: "Купить билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-08-03",
    archive_action: "remove",
  },

  // AUG-03-DIHAD -- DIHAD Conference at DWTC (L1 -- no brief)
  {
    id: "AUG-03-DIHAD",
    date: "2026-08-24",
    label_en: "DIHAD: Dubai International Humanitarian Aid and Development Conference at DWTC (24-26 August)",
    label_ru: "DIHAD: международная конференция по гуманитарной помощи в Dubai World Trade Centre (24-26 августа)",
    short_label_en: "DIHAD Conference, DWTC",
    short_label_ru: "Конференция DIHAD, DWTC",
    type: "conference",
    confidence: "confirmed",
    priority: 3,
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
    noindex_after: "2026-08-27",
    archive_action: "remove",
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

section("Pre-flight: confirm august-2026-dubai-calendar does not exist");

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

const expectedIds = new Set(["AUG-01-DSS", "AUG-02-DEFLEP", "AUG-03-DIHAD"]);
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

// ---- Create calendar draft --------------------------------------------------

section("Create calendar draft -- august-2026-dubai-calendar");

const createResult = createCalendarDraft({
  slug:                CAL_SLUG,
  calendar_type:       "monthly",
  year:                2026,
  month:               8,
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
  image_alt:           "Dubai skyline, August 2026 key dates and events",
  ru_image_alt:        "Дубай, важные даты и события, август 2026",
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

section("Publish august-2026-dubai-calendar");

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
            year=2026  month=8
            last_verified_date=2026-05-28

DATES_JSON ITEMS (3 total):
  AUG-01-DSS    Dubai Summer Surprises 2026 (final month)   2026-08-01  retail_offer  L2 brief (EN + RU)
  AUG-02-DEFLEP Def Leppard at Coca-Cola Arena              2026-08-02  venue_show    L1 (no brief)
  AUG-03-DIHAD  DIHAD Conference at DWTC                    2026-08-24  conference    L1 (no brief)

COVERAGE:
  Aug 1-30 via DSS umbrella = 30 days = 96.8% (30/31)
  Aug 31 is the only gap (DSS ends Aug 30)

EXCLUDED (HOLD):
  Beat the Heat DXB Season 5      HOLD -- no 2026 announcement
  Modesh World standalone dates   HOLD -- no DWTC 2026 standalone page
  DSS Back to School exact start  HOLD -- not published by DFRE
  ATM Aug 17-20                   EXCLUDED -- rescheduled to Sep 14-17
  Expo City August events         HOLD -- no events listed

LOCAL ONLY. No push. No deploy. No production DB write.
Production import requires separate owner approval (Phase 6C-85).
`);

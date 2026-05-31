/**
 * Phase 6C-90 -- October 2026 Dubai Calendar Local Import QA
 * LOCAL ONLY -- do NOT run against production.
 *
 * Creates new october-2026-dubai-calendar row (does not exist in DB yet):
 *   OCT-01-BEAUTY (2026-10-06)  Beautyworld Dubai 2026 at DWTC (6-8 Oct)    L1
 *   OCT-02-WETEX  (2026-10-20)  WETEX 2026 at DWTC, organized by DEWA       L2 brief
 *   OCT-03-VAT    (2026-10-28)  UAE VAT Q3 2026 return deadline (qtrly only) L1
 *   OCT-04-EINV   (2026-10-30)  E-invoicing ASP cross-ref (internal link)   L1
 *
 * HOLD (not imported): OCT-05-DFC -- Dubai Fitness Challenge Oct 31
 *   Reason: official site (dubaifitnesschallenge.com) returns 403 as of Phase 6C-90.
 *   Source was verified May 18 2026. Cannot reconfirm current date.
 *   Import when site is accessible and dates are reconfirmed.
 *
 * Coverage: 8/31 unique days = 25.8% (below target, documented).
 * GITEX: December 7-11, NOT October. Not included.
 * Global Village Season 31: HOLD -- no official 2026 date announced.
 *
 * Source: docs/content-drafts/calendar/october-2026-dubai-calendar.md
 *         docs/content-drafts/source-ledgers/october-2026-calendar-sources.md
 *         docs/content-drafts/PHASE_6C89_OCTOBER_2026_CALENDAR_SOURCE_RADAR_AND_DRAFT_PACK.md
 * Run:    npx tsx scripts/october-2026-calendar-import-6c90.ts
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

const BEAUTYWORLD_URL = "https://beautyworld-dubai.ae.messefrankfurt.com/dubai/en.html";
const DWTC_WETEX      = "https://www.dwtc.com/en/events/wetex-2026/";
const WETEX_OFFICIAL  = "https://www.wetex.ae";
const FTA_URL         = "https://tax.gov.ae";
const MOF_URL         = "https://www.mof.gov.ae";
const EINV_PAGE       = "/calendar/uae-e-invoicing-2026-asp-deadline";

// ---- Target slug ------------------------------------------------------------

const CAL_SLUG = "october-2026-dubai-calendar";

// ---- Page-level strings (DFC removed -- site 403, source cannot be reconfirmed) --

const CAL_EN_TITLE =
  "October 2026 in Dubai: trade shows, compliance deadlines and key dates";

const CAL_RU_TITLE =
  "Дубай, октябрь 2026: выставки, сроки и важные даты";

// DFC removed from summary since it is not in dates_json
const CAL_EN_SUMMARY =
  "October 2026 in Dubai brings two major DWTC exhibitions: Beautyworld Dubai (6-8 October, 30th edition) and WETEX (20-22 October, organized by DEWA). Compliance anchors include the UAE VAT Q3 return deadline (28 October) and the e-invoicing ASP appointment deadline for large businesses (30 October).";

const CAL_RU_SUMMARY =
  "В октябре 2026 года в Дубае проходят две крупные выставки в DWTC: Beautyworld Dubai (6-8 октября, юбилейное 30-е издание) и WETEX (20-22 октября, организатор DEWA). Важные даты для бизнеса: срок подачи декларации по НДС за III квартал (28 октября) и дедлайн назначения ASP для электронных счетов-фактур для крупных компаний (30 октября).";

// DFC removed from body
const CAL_EN_BODY =
  `October 2026 in Dubai opens with Beautyworld Dubai, the 30th edition of the region's leading beauty and wellness trade show at Dubai World Trade Centre (6-8 October), organized by Messe Frankfurt Exhibition GmbH. WETEX 2026, the Water, Energy, Technology and Environment Exhibition, takes place 20-22 October at DWTC, organized by Dubai Electricity and Water Authority (DEWA). Quarterly UAE VAT filers should note 28 October as the Q3 2026 (July-September period) filing deadline. The e-invoicing Phase A ASP appointment deadline falls on 30 October for large taxpayers with annual supplies of AED 150 million and above.

Source dates in this calendar are drawn from official government and organizer announcements. Confirm compliance-related details with a qualified adviser before acting.`;

const CAL_RU_BODY =
  `Октябрь 2026 года в Дубае открывается выставкой Beautyworld Dubai -- юбилейный 30-й выпуск ведущей региональной ярмарки красоты и здоровья в Dubai World Trade Centre (6-8 октября), организованной Messe Frankfurt Exhibition GmbH. Следом проходит WETEX 2026, выставка воды, энергетики, технологий и экологии (20-22 октября, DWTC), организованная Dubai Electricity and Water Authority (DEWA). Для ежеквартальных плательщиков НДС 28 октября -- срок подачи декларации за III квартал 2026 года (период июль-сентябрь). 30 октября -- дедлайн для крупных налогоплательщиков (ежегодные поставки от 150 млн дирхамов) по назначению аккредитованного поставщика услуг (ASP) для e-invoicing Фаза A.

Даты в этом календаре основаны на официальных объявлениях государственных органов и организаторов. По вопросам соблюдения требований законодательства рекомендуется проконсультироваться с квалифицированным советником.`;

// Public-facing source disclosure only -- DFC import note removed
const CAL_EN_NOTES =
  "Beautyworld Dubai and WETEX are professional trade shows; entry for industry professionals and registered visitors. UAE VAT Q3 deadline (28 October) applies to quarterly VAT return filers only. E-invoicing Oct 30 deadline: see the full e-invoicing calendar page for details.";

const CAL_RU_NOTES =
  "Beautyworld Dubai и WETEX -- профессиональные отраслевые выставки; вход для специалистов и зарегистрированных участников. Срок НДС 28 октября -- только для ежеквартальных плательщиков. E-invoicing 30 октября: подробнее на отдельной странице.";

const CAL_EN_SEO_TITLE =
  "October 2026 Dubai calendar: Beautyworld, WETEX and compliance deadlines";

const CAL_RU_SEO_TITLE =
  "Дубай, октябрь 2026: Beautyworld, WETEX и сроки";

// DFC removed from meta
const CAL_EN_META =
  "October 2026 in Dubai: Beautyworld Dubai (6-8 Oct, 30th edition), WETEX 2026 organized by DEWA (20-22 Oct), VAT Q3 filing deadline (28 Oct), e-invoicing ASP deadline (30 Oct).";

const CAL_RU_META =
  "Октябрь 2026 в Дубае: Beautyworld Dubai (6-8 окт., 30-е изд.), WETEX 2026 от DEWA (20-22 окт.), срок НДС III кв. (28 окт.), дедлайн ASP e-invoicing (30 окт.).";

// ---- dates_json (4 items -- DFC HOLD) ---------------------------------------

const DATES_JSON = JSON.stringify([

  // OCT-01-BEAUTY -- Beautyworld Dubai 2026 (L1 -- no brief)
  {
    id: "OCT-01-BEAUTY",
    date: "2026-10-06",
    label_en: "Beautyworld Dubai 2026 at Dubai World Trade Centre (6-8 October, 30th edition)",
    label_ru: "Beautyworld Dubai 2026 в Dubai World Trade Centre (6-8 октября, 30-е издание)",
    short_label_en: "Beautyworld Dubai",
    short_label_ru: "Beautyworld Dubai",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Messe Frankfurt / DWTC: official",
    source_label_ru: "Messe Frankfurt / DWTC: официально",
    source_url: BEAUTYWORLD_URL,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: BEAUTYWORLD_URL,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-09",
    archive_action: "remove",
  },

  // OCT-02-WETEX -- WETEX 2026 (L2 brief)
  {
    id: "OCT-02-WETEX",
    date: "2026-10-20",
    label_en: "WETEX 2026 at Dubai World Trade Centre (20-22 October), organized by DEWA",
    label_ru: "WETEX 2026 в Dubai World Trade Centre (20-22 октября), организатор DEWA",
    short_label_en: "WETEX 2026, DWTC",
    short_label_ru: "WETEX 2026, DWTC",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "WETEX (Water, Energy, Technology and Environment Exhibition) 2026 takes place 20-22 October at Dubai World Trade Centre, organized by Dubai Electricity and Water Authority (DEWA). WETEX is the region's annual exhibition and conference bringing together utilities, renewable energy companies, technology providers, sustainability specialists and government bodies focused on water and energy. The show features a dedicated conference programme alongside the exhibition floor. Entry is for trade and industry professionals; advance registration and exhibitor details are available at wetex.ae.",
    brief_ru: "WETEX (выставка воды, энергетики, технологий и экологии) 2026 пройдёт 20-22 октября в Dubai World Trade Centre. Организатор: Dubai Electricity and Water Authority (DEWA). WETEX -- ежегодная региональная выставка и конференция для специалистов водной и энергетической отраслей, компаний в сфере возобновляемой энергетики и экологических технологий, а также государственных органов. В программе: выставочная экспозиция и конференция. Вход для профессионалов отрасли; регистрация и информация на wetex.ae.",
    source_label_en: "DEWA / DWTC: official",
    source_label_ru: "DEWA / DWTC: официально",
    source_url: DWTC_WETEX,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: WETEX_OFFICIAL,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-23",
    archive_action: "remove",
  },

  // OCT-03-VAT -- UAE VAT Q3 2026 return deadline (L1 -- no brief)
  {
    id: "OCT-03-VAT",
    date: "2026-10-28",
    label_en: "UAE VAT Q3 2026 return deadline for quarterly filers (28 October)",
    label_ru: "Срок подачи декларации НДС за III квартал 2026 года (ежеквартальные плательщики)",
    short_label_en: "VAT Q3 deadline",
    short_label_ru: "НДС III кв.",
    type: "compliance",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Federal Tax Authority (FTA): official VAT return rules",
    source_label_ru: "Федеральный налоговый орган ОАЭ (FTA): правила подачи НДС",
    source_url: FTA_URL,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: FTA_URL,
    cta_label_en: "FTA official guidance",
    cta_label_ru: "Официальные инструкции FTA",
    emirate: "UAE",
    risk_level: "medium",
    lifecycle: "compliance_evergreen",
    noindex_after: "2026-10-29",
    archive_action: "keep",
  },

  // OCT-04-EINV -- E-invoicing ASP cross-reference (L1 -- internal link to existing page)
  {
    id: "OCT-04-EINV",
    date: "2026-10-30",
    label_en: "E-invoicing Phase A: ASP appointment deadline for large businesses (AED 150M+, 30 October)",
    label_ru: "E-invoicing Фаза A: дедлайн назначения ASP для крупных компаний (от 150 млн дирхамов, 30 октября)",
    short_label_en: "E-invoicing ASP",
    short_label_ru: "E-invoicing ASP",
    type: "compliance",
    confidence: "confirmed",
    priority: 1,
    detail_url: EINV_PAGE,
    brief_en: "",
    brief_ru: "",
    source_label_en: "UAE Ministry of Finance / FTA: official",
    source_label_ru: "Министерство финансов ОАЭ / FTA: официально",
    source_url: MOF_URL,
    source_status: "confirmed",
    cta_type: "view_details",
    cta_url: EINV_PAGE,
    cta_label_en: "See e-invoicing details",
    cta_label_ru: "Подробнее об e-invoicing",
    emirate: "UAE",
    risk_level: "high",
    lifecycle: "compliance_evergreen",
    noindex_after: "2026-10-31",
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

section("Pre-flight: confirm october-2026-dubai-calendar does not exist");

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

const expectedIds = new Set(["OCT-01-BEAUTY", "OCT-02-WETEX", "OCT-03-VAT", "OCT-04-EINV"]);
const parsedDates = JSON.parse(DATES_JSON) as Array<{ id: string; date: string; label_en?: string }>;
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

// Safety: GITEX must not be in October
const gitex = parsedDates.find(d => d.id.includes("GITEX") || d.label_en?.toLowerCase().includes("gitex"));
if (gitex) {
  console.error(`\nABORT: GITEX found in DATES_JSON. GITEX 2026 is December, not October.`);
  process.exit(1);
}

log(`  ${parsedDates.length} items, no duplicates. IDs: ${[...seenIds].join(", ")}.`);
log(`  GITEX check: not present in October. ✓`);
log(`  DFC note: OCT-05-DFC held (site 403, cannot reconfirm Oct 31 date).`);

// ---- Create calendar draft --------------------------------------------------

section("Create calendar draft -- october-2026-dubai-calendar");

const createResult = createCalendarDraft({
  slug:                CAL_SLUG,
  calendar_type:       "monthly",
  year:                2026,
  month:               10,
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
  last_verified_date:  "2026-05-31",
  featured_homepage:   0,
  image_path:          "/images/hubs/dubai-skyline-downtown.webp",
  image_alt:           "Dubai skyline, October 2026 key dates and events",
  ru_image_alt:        "Дубай, важные даты и события, октябрь 2026",
  official_source_url: DWTC_WETEX,
});

if (!createResult.ok) {
  console.error("  FAIL createCalendarDraft:", createResult.errors);
  process.exit(1);
}

const calId = createResult.id!;
log(`  Draft created. id=${calId}`);
log(`  Warnings: ${createResult.warnings.length ? createResult.warnings.join("; ") : "none"}`);

// ---- Publish ----------------------------------------------------------------

section("Publish october-2026-dubai-calendar");

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
            year=2026  month=10
            last_verified_date=2026-05-31

DATES_JSON ITEMS (4 total -- DFC held):
  OCT-01-BEAUTY Beautyworld Dubai 2026 (6-8 Oct, 30th ed.)   2026-10-06  trade_show   L1
  OCT-02-WETEX  WETEX 2026, DEWA (20-22 Oct)                 2026-10-20  trade_show   L2 brief
  OCT-03-VAT    UAE VAT Q3 return deadline (qtrly only)       2026-10-28  compliance   L1
  OCT-04-EINV   E-invoicing ASP cross-ref (internal link)     2026-10-30  compliance   L1

HOLD (not imported):
  OCT-05-DFC    Dubai Fitness Challenge Oct 31 -- site 403, cannot reconfirm

GITEX 2026: December (NOT October). Confirmed. Not in October page.

COVERAGE (4 items only, DFC excluded):
  Oct 6-8 (Beautyworld) + Oct 20-22 (WETEX) + Oct 28 (VAT Q3) + Oct 30 (E-inv) = 8 unique days
  8/31 = 25.8% (below target; documented)

Range bars expected: Oct 7-8 (Beautyworld), Oct 21-22 (WETEX) = 4 bars

LOCAL ONLY. No push. No deploy. No production DB write.
Production import requires separate owner approval (Phase 6C-91).
`);

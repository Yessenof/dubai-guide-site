/**
 * Phase 6C-78 — June 2026 Dubai Calendar Enrichment Local Update
 * LOCAL ONLY — do NOT run against production.
 *
 * Updates existing june-2026-dubai-calendar row (adds 3 enrichment items):
 *   JUN-15-MALLATHON (2026-06-15) Dubai Mallathon 2026         L2 brief
 *   JUN-20-BASSI     (2026-06-20) Bassi Live at Dubai Opera     L1
 *   JUN-24-ORCH      (2026-06-24) UAE National Orchestra        L1
 *
 * Preserves baseline 5 items from Phase 6C-74:
 *   JUN-01-VAT   JUN-01-WPS   JUN-04-RUMI   JUN-05-ACW   JUN-11-BEACH
 *
 * RE:SET (JUN-06-RESET) remains HOLD — not included (genre unverified).
 *
 * Source: docs/content-drafts/calendar/june-2026-dubai-calendar.md
 *         docs/content-drafts/source-ledgers/june-july-2026-calendar-event-sources.md
 * Run:    npx tsx scripts/june-2026-calendar-enrich-local-import-6c78.ts
 */

import {
  getAllCalendarPages,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Safety constants -------------------------------------------------------

const EM = "—"; // em dash U+2014

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

const SALIK_SOURCE =
  "https://www.salik.ae/en/news/Salik-to-Apply-VAT-on-Toll-Tariffs-Starting-1-June-2026";
const MOHRE_SOURCE =
  "https://www.mohre.gov.ae/en/media-center/news/";
const DUBAI_OPERA_SOURCE =
  "https://www.dubaiopera.com/en-US/products-list";
const CINEMA_AKIL_SOURCE =
  "https://www.cinemaakil.com/";
const COCA_COLA_ARENA_SOURCE =
  "https://coca-cola-arena.com/music/1858/the-beach-boys-60-years-of-pet-sounds-tour";
const MALLATHON_SOURCE =
  "https://www.dubaimallathon.ae/";

// ---- Target slug ------------------------------------------------------------

const CAL_SLUG = "june-2026-dubai-calendar";

// ---- Updated page-level strings --------------------------------------------

const CAL_EN_SUMMARY =
  "June 2026 brings new VAT charges on Dubai tolls and parking, a new private sector wage deadline, free mall walking and running routes at Dubai Mallathon from June 15, plus cultural events at Dubai Opera and Cinema Akil.";

const CAL_EN_BODY =
  `June 2026 marks the start of several important changes for Dubai residents and businesses. From 1 June, Salik toll and Parkin parking fees include 5% VAT under UAE tax regulations, and a new MoHRE rule requires private sector salaries to be paid by the first of each Gregorian month. From 15 June, Dubai Mallathon 2026 offers free walking and running routes inside air-conditioned malls at nine Dubai locations throughout the summer. The month also brings shows at Dubai Opera and Arab Cinema Week at Cinema Akil.

Source dates in this calendar are drawn from official government and organizer announcements. Confirm compliance-related details with a qualified adviser before acting.`;

const CAL_EN_NOTES =
  "VAT items: Salik (salik.ae official) and Parkin effective 1 June 2026. MoHRE WPS: Ministerial Resolution 0340/2026. Dubai Mallathon: mediaoffice.ae official + dubaimallathon.ae. Islamic New Year (~Jun 15-16) on hold pending FAHR moon-sighting confirmation. RE:SET (Jun 6, Dubai Opera): genre unverified, kept on hold.";

const CAL_EN_SEO_TITLE =
  "June 2026 Dubai calendar: VAT changes, wage rules, Dubai Mallathon and events";

const CAL_EN_META =
  "June 2026 in Dubai: Salik and parking VAT from June 1, MoHRE salary deadline, Dubai Mallathon free mall routes from June 15, Dubai Opera shows, Arab Cinema Week 5-11 June.";

const CAL_RU_SUMMARY =
  "В июне 2026 года вводится НДС на тарифы Salik и парковки Parkin, новый срок выплаты зарплат в частном секторе, а с 15 июня стартует Dubai Mallathon с бесплатными маршрутами в девяти торговых центрах. Также: показы в Dubai Opera и Неделя арабского кино в Cinema Akil.";

const CAL_RU_BODY =
  `Июнь 2026 года отмечен рядом важных изменений для жителей и бизнеса Дубая. С 1 июня тарифы Salik и парковки Parkin включают НДС 5% в соответствии с налоговым законодательством ОАЭ, а новое правило MoHRE обязывает работодателей частного сектора выплачивать зарплату не позднее первого числа каждого месяца. С 15 июня стартует Dubai Mallathon 2026 с бесплатными маршрутами для ходьбы и бега в девяти торговых центрах Дубая. В культурной программе: шоу в Dubai Opera и Неделя арабского кино в Cinema Akil.

Даты в этом календаре основаны на официальных объявлениях государственных органов и организаторов. По вопросам соблюдения требований законодательства рекомендуется проконсультироваться с квалифицированным советником.`;

const CAL_RU_NOTES =
  "НДС на Salik и Parkin: с 1 июня 2026. MoHRE WPS: Постановление 0340/2026. Dubai Mallathon: mediaoffice.ae (официально) + dubaimallathon.ae. Исламский Новый год (~15-16 июня) на удержании до официального объявления FAHR.";

const CAL_RU_SEO_TITLE =
  "Дубай, июнь 2026: НДС на дороги и парковки, Dubai Mallathon и события";

const CAL_RU_META =
  "Июнь 2026 в Дубае: НДС Salik и Parkin с 1 июня, дедлайн MoHRE по зарплатам, Dubai Mallathon с 15 июня, шоу в Dubai Opera, Неделя арабского кино 5-11 июня.";

// ---- Full dates_json (8 items: 5 baseline + 3 enrichment) -----------------

const DATES_JSON = JSON.stringify([

  // ---- Baseline items (Phase 6C-74) ----------------------------------------

  // JUN-01-VAT — Salik + Parkin 5% VAT (L2 brief)
  {
    id: "JUN-01-VAT",
    date: "2026-06-01",
    label_en: "Salik toll and Dubai parking fees: 5% VAT added",
    label_ru: "Платные дороги Salik и парковки Dubai: добавлен НДС 5%",
    short_label_en: "Salik & parking VAT",
    short_label_ru: "НДС Salik и парковки",
    type: "government_update",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "From 1 June 2026, a 5% VAT is applied to all Salik toll gate charges and tag activation fees across Dubai. The same date, Parkin (Dubai's main public parking operator) began adding 5% VAT to on-street and off-street parking fees, seasonal cards, and parking permits. Both companies are remitting VAT collected to the Federal Tax Authority (FTA). Parkin also ended cash payments at parking meters from 1 June as part of Dubai's Cashless Strategy. The retrospective VAT on Salik from 2022 to 2026 is covered by the Roads and Transport Authority (RTA) and is not charged to motorists.",
    brief_ru: "С 1 июня 2026 года к тарифам на проезд через пункты Salik и к сборам за активацию тегов начисляется НДС 5%. В тот же день Parkin (основной оператор платных парковок Дубая) ввёл НДС 5% на уличные и крытые парковки, сезонные карты и разрешения. Оба оператора перечисляют собранный НДС в Федеральное налоговое управление (FTA). Кроме того, Parkin прекратил приём наличных в паркоматах с 1 июня в рамках стратегии Дубая по переходу на безналичную оплату. Ретроактивный НДС Salik за период с 2022 по 2026 год оплачивается Управлением дорог и транспорта (RTA) и не взимается с водителей.",
    source_label_en: "Salik PJSC: official announcement",
    source_label_ru: "Salik PJSC: официальное объявление",
    source_url: SALIK_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: SALIK_SOURCE,
    cta_label_en: "Official source",
    cta_label_ru: "Официальный источник",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "compliance_evergreen",
    noindex_after: "",
    archive_action: "keep",
  },

  // JUN-01-WPS — MoHRE WPS unified wage deadline (L2 brief)
  {
    id: "JUN-01-WPS",
    date: "2026-06-01",
    label_en: "UAE: private sector salaries must be paid by the 1st of each month",
    label_ru: "ОАЭ: зарплата в частном секторе не позднее 1-го числа каждого месяца",
    short_label_en: "MoHRE wage deadline",
    short_label_ru: "Срок выплаты зарплат MoHRE",
    type: "compliance",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "From June 2026, the Ministry of Human Resources and Emiratisation (MoHRE) requires all private sector employers in the UAE to pay monthly wages by the first day of each calendar month. Ministerial Resolution No. 0340 of 2026, issued May 12, sets the unified deadline and defines late payment penalties: electronic monitoring and a warning from Day 2, work permit suspension from Day 5, administrative fines from Day 11, and automatic labour dispute registration from Day 16. A company is considered compliant if it pays at least 85% of total wages due by the deadline. Wages must be transferred via the approved Wage Protection System (WPS).",
    brief_ru: "С июня 2026 года Министерство трудовых ресурсов и эмиратизации (MoHRE) обязывает всех работодателей частного сектора ОАЭ выплачивать ежемесячные зарплаты не позднее первого числа каждого месяца. Это установлено Постановлением No. 0340/2026 от 12 мая. Нарушителям грозят санкции: предупреждение со 2-го дня, приостановка выдачи разрешений на работу с 5-го дня, административные штрафы с 11-го дня, автоматическая регистрация трудового спора с 16-го дня. Компания считается соответствующей требованиям, если выплатила не менее 85% всех причитающихся зарплат. Оплата через Систему защиты заработной платы (WPS).",
    source_label_en: "MoHRE: Ministerial Resolution No. 0340/2026",
    source_label_ru: "MoHRE: Постановление No. 0340/2026",
    source_url: MOHRE_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: MOHRE_SOURCE,
    cta_label_en: "Official source",
    cta_label_ru: "Официальный источник",
    emirate: "UAE",
    risk_level: "low",
    lifecycle: "compliance_evergreen",
    noindex_after: "",
    archive_action: "keep",
  },

  // JUN-04-RUMI — Rumi: The Musical, Dubai Opera (L1 -- no brief)
  {
    id: "JUN-04-RUMI",
    date: "2026-06-04",
    label_en: "Rumi: The Musical at Dubai Opera (4-7 June)",
    label_ru: "Мюзикл «Руми» в Dubai Opera (4-7 июня)",
    short_label_en: "Rumi musical",
    short_label_ru: "Мюзикл «Руми»",
    type: "venue_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Dubai Opera: official",
    source_label_ru: "Dubai Opera: официально",
    source_url: DUBAI_OPERA_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DUBAI_OPERA_SOURCE,
    cta_label_en: "Book tickets",
    cta_label_ru: "Купить билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-06-08",
    archive_action: "remove",
  },

  // JUN-05-ACW — Arab Cinema Week, Cinema Akil (L2 brief)
  {
    id: "JUN-05-ACW",
    date: "2026-06-05",
    label_en: "Arab Cinema Week 2026 at Cinema Akil, Alserkal Avenue (5-11 June)",
    label_ru: "Неделя арабского кино 2026 в Cinema Akil, Alserkal Avenue (5-11 июня)",
    short_label_en: "Arab Cinema Week",
    short_label_ru: "Неделя арабского кино",
    type: "event",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Arab Cinema Week returns to Cinema Akil at Alserkal Avenue from 5 to 11 June 2026. This is the 5th annual edition, presented by Fujifilm in partnership with Alserkal Avenue. The programme features 9 feature films representing 10 Arab countries, with a particular spotlight on Lebanese cinema. Genres include fiction, documentary and experimental film. Selected films screen in the presence of their filmmakers. The public is also invited to a master class with Palestinian actor Saleh Bakri. Tickets start from AED 60 including VAT. The full programme and booking are available at cinemaakil.com.",
    brief_ru: "С 5 по 11 июня 2026 года в Cinema Akil на территории Alserkal Avenue проходит Неделя арабского кино, пятое ежегодное издание фестиваля. Организаторы: Fujifilm при партнёрстве Alserkal Avenue. Программа включает 9 фильмов из 10 арабских стран с акцентом на ливанское кино. Жанры: игровое, документальное и экспериментальное кино. Часть фильмов демонстрируется в присутствии режиссёров. Для широкой публики предусмотрен мастер-класс с палестинским актёром Салехом Бакри. Билеты от 60 AED с учётом НДС. Полная программа и бронирование на cinemaakil.com.",
    source_label_en: "Cinema Akil / Alserkal Avenue: official",
    source_label_ru: "Cinema Akil / Alserkal Avenue: официально",
    source_url: CINEMA_AKIL_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: CINEMA_AKIL_SOURCE,
    cta_label_en: "Official programme",
    cta_label_ru: "Официальная программа",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-06-12",
    archive_action: "remove",
  },

  // JUN-11-BEACH — The Beach Boys, Coca-Cola Arena (L1 -- no brief)
  {
    id: "JUN-11-BEACH",
    date: "2026-06-11",
    label_en: "The Beach Boys: 60 Years of Pet Sounds Tour, Coca-Cola Arena",
    label_ru: "The Beach Boys: тур «60 лет Pet Sounds», Coca-Cola Arena",
    short_label_en: "Beach Boys concert",
    short_label_ru: "Концерт Beach Boys",
    type: "venue_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Coca-Cola Arena: official",
    source_label_ru: "Coca-Cola Arena: официально",
    source_url: COCA_COLA_ARENA_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: COCA_COLA_ARENA_SOURCE,
    cta_label_en: "Book tickets",
    cta_label_ru: "Купить билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-06-12",
    archive_action: "remove",
  },

  // ---- Enrichment items (Phase 6C-78) --------------------------------------

  // JUN-15-MALLATHON -- Dubai Mallathon 2026 (L2 brief)
  {
    id: "JUN-15-MALLATHON",
    date: "2026-06-15",
    label_en: "Dubai Mallathon 2026: free walking and running routes at 9 major malls (15 Jun - 15 Sep)",
    label_ru: "Dubai Mallathon 2026: бесплатные маршруты в 9 торговых центрах (15 июня - 15 сентября)",
    short_label_en: "Dubai Mallathon 2026",
    short_label_ru: "Dubai Mallathon 2026",
    type: "event",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Dubai Mallathon 2026 runs from 15 June to 15 September at nine major malls across Dubai: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates and Springs Souk. The event offers 2.5 km, 5 km and 10 km walking and running routes inside air-conditioned malls, providing a summer-friendly alternative to outdoor exercise. Participation is free. The initiative was launched under a directive from Sheikh Hamdan bin Mohammed bin Rashid Al Maktoum, Crown Prince of Dubai. Route maps and details are available at dubaimallathon.ae.",
    brief_ru: "Dubai Mallathon 2026 проходит с 15 июня по 15 сентября в девяти торговых центрах Дубая: Dubai Mall, City Centre Deira, City Centre Mirdif, Dubai Festival City, Dubai Festival Plaza, Dubai Hills Mall, Dubai Marina Mall, Mall of the Emirates и Springs Souk. Участникам предложены маршруты для ходьбы и бега длиной 2,5 км, 5 км и 10 км внутри торговых центров с кондиционированием. Участие бесплатное. Инициатива реализована по директиве шейха Хамдана бин Мухаммеда бин Рашида Аль Мактума, Наследного принца Дубая. Маршруты и подробности: dubaimallathon.ae.",
    source_label_en: "Government of Dubai (mediaoffice.ae): official announcement",
    source_label_ru: "Правительство Дубая (mediaoffice.ae): официальное объявление",
    source_url: MALLATHON_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: MALLATHON_SOURCE,
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_seasonal",
    noindex_after: "2026-09-16",
    archive_action: "keep",
  },

  // JUN-20-BASSI -- Bassi Live at Dubai Opera (L1 -- no brief)
  {
    id: "JUN-20-BASSI",
    date: "2026-06-20",
    label_en: "Bassi Live: Kisi ko Batana Mat at Dubai Opera (20 June)",
    label_ru: "Bassi Live: «Kisi ko Batana Mat» в Dubai Opera (20 июня)",
    short_label_en: "Bassi Live at Dubai Opera",
    short_label_ru: "Концерт Bassi в Dubai Opera",
    type: "venue_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Dubai Opera: official",
    source_label_ru: "Dubai Opera: официально",
    source_url: DUBAI_OPERA_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DUBAI_OPERA_SOURCE,
    cta_label_en: "Book tickets",
    cta_label_ru: "Купить билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-06-21",
    archive_action: "remove",
  },

  // JUN-24-ORCH -- UAE National Orchestra Season Finale at Dubai Opera (L1 -- no brief)
  {
    id: "JUN-24-ORCH",
    date: "2026-06-24",
    label_en: "UAE National Orchestra: Rhythms Without Borders at Dubai Opera (24 June)",
    label_ru: "Национальный оркестр ОАЭ: Rhythms Without Borders в Dubai Opera (24 июня)",
    short_label_en: "UAE National Orchestra",
    short_label_ru: "Оркестр ОАЭ в Dubai Opera",
    type: "venue_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "",
    brief_ru: "",
    source_label_en: "Dubai Opera: official",
    source_label_ru: "Dubai Opera: официально",
    source_url: DUBAI_OPERA_SOURCE,
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: DUBAI_OPERA_SOURCE,
    cta_label_en: "Book tickets",
    cta_label_ru: "Купить билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-06-25",
    archive_action: "remove",
  },

]);

// ---- Pre-flight em dash validation -----------------------------------------

section("Pre-flight em dash validation");

const ALL_STRINGS: Array<[string, string]> = [
  ["CAL_EN_SUMMARY",    CAL_EN_SUMMARY],
  ["CAL_EN_BODY",       CAL_EN_BODY],
  ["CAL_EN_NOTES",      CAL_EN_NOTES],
  ["CAL_EN_SEO_TITLE",  CAL_EN_SEO_TITLE],
  ["CAL_EN_META",       CAL_EN_META],
  ["CAL_RU_SUMMARY",    CAL_RU_SUMMARY],
  ["CAL_RU_BODY",       CAL_RU_BODY],
  ["CAL_RU_NOTES",      CAL_RU_NOTES],
  ["CAL_RU_SEO_TITLE",  CAL_RU_SEO_TITLE],
  ["CAL_RU_META",       CAL_RU_META],
  ["DATES_JSON",        DATES_JSON],
];

for (const [label, value] of ALL_STRINGS) {
  assertClean(label, value);
}
log("  All strings clean -- no em dashes found.");

// ---- Pre-flight duplicate ID check -----------------------------------------

section("Pre-flight duplicate ID check");

const expectedNewIds = new Set(["JUN-15-MALLATHON", "JUN-20-BASSI", "JUN-24-ORCH"]);
const expectedBaselineIds = new Set(["JUN-01-VAT", "JUN-01-WPS", "JUN-04-RUMI", "JUN-05-ACW", "JUN-11-BEACH"]);

const parsedDates = JSON.parse(DATES_JSON) as Array<{ id: string }>;
const seenIds = new Set<string>();
for (const item of parsedDates) {
  if (seenIds.has(item.id)) {
    console.error(`\nABORT: Duplicate id "${item.id}" in DATES_JSON.`);
    process.exit(1);
  }
  seenIds.add(item.id);
}

const allExpected = new Set([...expectedBaselineIds, ...expectedNewIds]);
for (const id of allExpected) {
  if (!seenIds.has(id)) {
    console.error(`\nABORT: Expected id "${id}" missing from DATES_JSON.`);
    process.exit(1);
  }
}
log(`  ${parsedDates.length} items, no duplicates. Baseline (5) + enrichment (3) = 8. OK.`);

// ---- Find existing local row by slug ---------------------------------------

section("Find local june-2026-dubai-calendar row");

const allPages = getAllCalendarPages();
const existing = allPages.find(p => p.slug === CAL_SLUG);

if (!existing) {
  console.error(`\nABORT: No local row found for slug "${CAL_SLUG}". Run Phase 6C-74 script first.`);
  process.exit(1);
}

log(`  Found: id=${existing.id}  status=${existing.status}  items=${JSON.parse(existing.datesJson || "[]").length}`);

const existingItems = JSON.parse(existing.datesJson || "[]") as Array<{ id: string }>;
const existingItemIds = existingItems.map(i => i.id);
log(`  Existing item IDs: ${existingItemIds.join(", ")}`);

// Safety: confirm baseline items are present
for (const id of expectedBaselineIds) {
  if (!existingItemIds.includes(id)) {
    console.error(`\nABORT: Expected baseline item "${id}" missing from existing dates_json. Check local DB state.`);
    process.exit(1);
  }
}
log("  All 5 baseline items confirmed present in existing row.");

// Safety: confirm new items are NOT already present (no duplicate import)
for (const id of expectedNewIds) {
  if (existingItemIds.includes(id)) {
    console.error(`\nABORT: Enrichment item "${id}" already exists in dates_json. Already enriched? Aborting to prevent duplicate.`);
    process.exit(1);
  }
}
log("  No enrichment items pre-exist. Safe to proceed.");

const calId = existing.id;

// ---- Update calendar draft -------------------------------------------------

section("Update calendar draft -- adding 3 enrichment items");

const updateResult = updateCalendarDraft(calId, {
  en_summary:          CAL_EN_SUMMARY,
  en_body:             CAL_EN_BODY,
  en_notes:            CAL_EN_NOTES,
  en_seo_title:        CAL_EN_SEO_TITLE,
  en_meta_description: CAL_EN_META,
  ru_summary:          CAL_RU_SUMMARY,
  ru_body:             CAL_RU_BODY,
  ru_notes:            CAL_RU_NOTES,
  ru_seo_title:        CAL_RU_SEO_TITLE,
  ru_meta_description: CAL_RU_META,
  dates_json:          DATES_JSON,
  last_verified_date:  "2026-05-27",
});

if (!updateResult.ok) {
  console.error("  FAIL updateCalendarDraft:", updateResult.errors);
  process.exit(1);
}
log(`  Draft updated. Warnings: ${updateResult.warnings.length ? updateResult.warnings.join("; ") : "none"}`);

// ---- Publish ---------------------------------------------------------------

section("Publish updated calendar page");

const pubResult = publishCalendar(calId);
if (!pubResult.ok) {
  console.error("  FAIL publishCalendar:", pubResult.errors);
  process.exit(1);
}
log(`  Published. Warnings: ${pubResult.warnings.length ? pubResult.warnings.join("; ") : "none"}`);

// ---- Summary report --------------------------------------------------------

section("Enrichment import complete -- post-import report");

log(`
UPDATED AND REPUBLISHED (1 record):

  Calendar: id=${calId}
            slug=${CAL_SLUG}
            url=/calendar/${CAL_SLUG}
            ru_url=/ru/calendar/${CAL_SLUG}
            ru_published=1
            calendar_type=monthly
            year=2026  month=6
            last_verified_date=2026-05-27

DATES_JSON ITEMS (8 total):
  --- Baseline (Phase 6C-74) ---
  JUN-01-VAT         Salik + Parkin VAT         2026-06-01  government_update  L2 brief present
  JUN-01-WPS         MoHRE WPS wage deadline    2026-06-01  compliance         L2 brief present
  JUN-04-RUMI        Rumi Musical               2026-06-04  venue_show         L1 (no brief)
  JUN-05-ACW         Arab Cinema Week           2026-06-05  event              L2 brief present
  JUN-11-BEACH       Beach Boys                 2026-06-11  venue_show         L1 (no brief)
  --- Enrichment (Phase 6C-78) ---
  JUN-15-MALLATHON   Dubai Mallathon 2026       2026-06-15  event              L2 brief present
  JUN-20-BASSI       Bassi Live, Dubai Opera    2026-06-20  venue_show         L1 (no brief)
  JUN-24-ORCH        UAE National Orchestra     2026-06-24  venue_show         L1 (no brief)

RE:SET (JUN-06-RESET) excluded -- genre unverified, remains on HOLD.

LOCAL ONLY. No push. No deploy. No production DB write.
Production import requires separate Phase 6C-79 approval.
`);

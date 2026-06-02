/**
 * Phase 6C-96C -- UAE Calendar Batch 2A Production Import
 * PRODUCTION IMPORT -- requires explicit env flag.
 *
 * Run:
 *   CONFIRM_PRODUCTION_IMPORT_6C96C=yes npx tsx scripts/import-uae-calendar-batch-2a-production-6c96c.ts
 *
 * Imports 15 approved Batch 2A calendar items across July–December 2026.
 *
 * July (+3):   Atif Aslam AD Jul 18, UFC Fight Night AD Jul 25, DSS Restaurant Week Jul 13
 * August (+3): SB Girls AD Aug 8, Mawlid expected ~Aug 24-25 [confidence=expected], Miami Show Dubai Aug 29
 * Sep (+1):    ATB Legends of Trance Dubai Sep 5
 * Oct (+5):    God Save Queen Dubai Oct 5, Sonny Fodera Dubai Oct 10, Blue Expo City Oct 25,
 *              Russell Peters AD Oct 25, Riverdance AD Oct 31-Nov 1
 * Nov (+2):    OFFLIMITS Festival AD Nov 21, Tarkan AD Nov 27
 * Dec (+1):    F1 Concert (Lewis Capaldi) AD Dec 3
 *
 * Mawlid safety: imported as confidence="expected" with moon-sighting disclaimer.
 *   The holiday itself is an official UAE public holiday (confirmed by law);
 *   the exact date is subject to official moon-sighting announcement.
 *   Label explicitly states "expected...subject to moon sighting."
 *   This is identical treatment to Eid Al Adha (also confidence=expected).
 *
 * NEVER IMPORTED (hard exclusions):
 *   DFC, Global Village, DSF, The Corrs, VAT Q3 Nov, El Row, Kadim Al Sahir,
 *   Swedish House Mafia, ATB Sep 18 disambiguation, GITEX October, Cityscape Riyadh
 */

import path from "path";
import {
  getAllCalendarPages,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Production safety gate -----------------------------------------------

const CONFIRM_FLAG = process.env.CONFIRM_PRODUCTION_IMPORT_6C96C;
if (CONFIRM_FLAG !== "yes") {
  console.error("\nABORT: Production import requires explicit env flag.");
  console.error("  Run: CONFIRM_PRODUCTION_IMPORT_6C96C=yes npx tsx scripts/import-uae-calendar-batch-2a-production-6c96c.ts");
  process.exit(1);
}

const DB_PATH = path.resolve(process.cwd(), "data", "guides.db");

function log(msg: string) { console.log(msg); }
function section(title: string) {
  console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`);
}

section("Phase 6C-96C -- UAE Calendar Batch 2A Production Import");
log(`  DB path: ${DB_PATH}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Hard exclusion guard -------------------------------------------------

const HARD_EXCLUDED_IDS = new Set([
  "DFC","NOV-05-DFC","GLOBAL-VILLAGE","DSF","THE-CORRS",
  "VAT-Q3-NOV","EL-ROW","KADIM","SHM","GITEX-OCT","CITYSCAPE-RYD",
]);

const HOLD_KEYWORDS = [
  "fitness challenge","global village","shopping festival","the corrs",
  "el row","kadim","swedish house","cityscape riyadh",
];

// ---- Em dash guard --------------------------------------------------------

const EM = "—";
function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM)) { console.error(`\nABORT: em dash in "${label}".`); process.exit(1); }
}

// ---- Types ----------------------------------------------------------------

interface DateItem {
  id: string;
  date: string;
  period_end?: string;
  label_en: string;
  label_ru: string;
  short_label_en: string;
  short_label_ru: string;
  type: string;
  confidence: string;
  priority: number;
  detail_url: string | null;
  brief_en: string;
  brief_ru: string;
  source_label_en: string;
  source_label_ru: string;
  source_url: string;
  source_status: string;
  cta_type: string;
  cta_url: string | null;
  cta_label_en: string;
  cta_label_ru: string;
  emirate: string;
  risk_level: string;
  lifecycle: string;
  noindex_after: string | null;
  archive_action: string;
}

// ---- Batch 2A items (identical to local script) --------------------------

const BATCH_2A: DateItem[] = [

  // ─── JULY ─────────────────────────────────────────────────────────────────

  {
    id: "JUL-NEW-01", date: "2026-07-18",
    label_en: "Atif Aslam live at Etihad Arena, Abu Dhabi (18 July 2026)",
    label_ru: "Концерт Атифа Аслама в Etihad Arena, Абу-Даби (18 июля 2026)",
    short_label_en: "Atif Aslam", short_label_ru: "Atif Aslam",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "Atif Aslam, Pakistan's leading pop and playback singer, performs live at Etihad Arena, Yas Bay, Abu Dhabi on 18 July 2026. Doors at 7:30 PM, show at 9:00 PM. Tickets from AED 95. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Атиф Аслам выступает в Etihad Arena, Yas Bay, Абу-Даби, 18 июля 2026. Вход в 19:30, начало в 21:00. Билеты от 95 AED. Абу-Даби -- около 130 км от Дубая.",
    source_label_en: "Etihad Arena: official + Visit Abu Dhabi",
    source_label_ru: "Etihad Arena: официально + Visit Abu Dhabi",
    source_url: "https://www.etihadarena.ae/en/event-booking/atif-aslam-live",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://abu-dhabi.platinumlist.net/event-tickets/105779/atif-aslam-live-in-abu-dhabi",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-07-19", archive_action: "remove",
  },

  {
    id: "JUL-NEW-02", date: "2026-07-25",
    label_en: "UFC Fight Night Abu Dhabi: Ankalaev vs. Rountree Jr. at Etihad Arena (25 July)",
    label_ru: "UFC Fight Night Абу-Даби: Анкалаев -- Раунтри-мл. в Etihad Arena (25 июля)",
    short_label_en: "UFC Fight Night", short_label_ru: "UFC Абу-Даби",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "UFC Fight Night returns to Etihad Arena, Yas Island, Abu Dhabi on Saturday 25 July 2026. Main event: Magomed Ankalaev vs. Khalil Rountree Jr. (light heavyweight). Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "UFC Fight Night в Etihad Arena, Yas Island, Абу-Даби, суббота 25 июля 2026. Главный бой: Магомед Анкалаев -- Халил Раунтри-мл. (полутяжёлый вес). Абу-Даби -- около 130 км от Дубая.",
    source_label_en: "UFC: official", source_label_ru: "UFC: официально",
    source_url: "https://www.ufc.com/event/ufc-fight-night-july-25-2026",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.etihadarena.ae/en/events",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-07-26", archive_action: "remove",
  },

  {
    id: "JUL-NEW-03", date: "2026-07-13", period_end: "2026-08-02",
    label_en: "Dubai Summer Surprises: Summer Restaurant Week (13 July to 2 August 2026)",
    label_ru: "DSS: Ресторанная неделя в Дубае (13 июля -- 2 августа 2026)",
    short_label_en: "Restaurant Week", short_label_ru: "Рестораны DSS",
    type: "deadline", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "Dubai Summer Surprises 2026 brings Summer Restaurant Week from 13 July to 2 August. Over 100 restaurants across Dubai offer curated set menus at special prices. Part of the wider DSS programme (2 July -- 30 August).",
    brief_ru: "В рамках Dubai Summer Surprises 2026 Ресторанная неделя проходит с 13 июля по 2 августа. Более 100 ресторанов Дубая предлагают сет-меню по специальным ценам. Часть программы DSS (2 июля -- 30 августа).",
    source_label_en: "Visit Dubai: official DSS", source_label_ru: "Visit Dubai: официально DSS",
    source_url: "https://www.visitdubai.com/en/festivals-and-events/dss",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.visitdubai.com/en/festivals-and-events/dss",
    cta_label_en: "Dubai Summer Surprises", cta_label_ru: "Dubai Summer Surprises",
    emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-08-03", archive_action: "remove",
  },

  // ─── AUGUST ───────────────────────────────────────────────────────────────

  {
    id: "AUG-NEW-01", date: "2026-08-08",
    label_en: "Get Get Aw! SB Girls live at Etihad Arena, Abu Dhabi (8 August 2026)",
    label_ru: "Get Get Aw! SB Girls в Etihad Arena, Абу-Даби (8 августа 2026)",
    short_label_en: "SB Girls Abu Dhabi", short_label_ru: "SB Girls",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "Get Get Aw! SB Girls perform a reunion show at Etihad Arena, Yas Bay, Abu Dhabi on 8 August 2026. Doors at 6:00 PM, show at 7:00 PM. Tickets from AED 299. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Get Get Aw! SB Girls выступят на Etihad Arena, Yas Bay, Абу-Даби 8 августа 2026. Открытие дверей в 18:00, начало в 19:00. Билеты от 299 AED. Абу-Даби -- около 130 км от Дубая.",
    source_label_en: "Etihad Arena: official + Yas Bay", source_label_ru: "Etihad Arena: официально + Yas Bay",
    source_url: "https://www.etihadarena.ae/en/event-booking/get-get-aww-sb-girls",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://abu-dhabi.platinumlist.net/event-tickets/105885/get-get-aww-sb-girls-live-in-abu-dhabi",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-08-09", archive_action: "remove",
  },

  {
    // Mawlid safety: confidence = "expected" (same as Eid Al Adha treatment).
    // Holiday is an official UAE public holiday established by law.
    // Exact date depends on official moon-sighting announcement.
    // Label explicitly states "expected...subject to moon sighting" — no overclaim.
    id: "AUG-NEW-02", date: "2026-08-24",
    label_en: "Prophet Muhammad's Birthday (Mawlid Al Nabi) -- UAE public holiday (expected around 24-25 August, subject to moon sighting)",
    label_ru: "День рождения Пророка Мухаммада (Маулид ан-Набий) -- праздник ОАЭ (ожидается около 24-25 августа, по лунному календарю)",
    short_label_en: "Mawlid holiday", short_label_ru: "Маулид",
    type: "public-holiday", confidence: "expected", priority: 1, detail_url: null,
    brief_en: "Prophet Muhammad's Birthday (Mawlid Al Nabi) is an official UAE public holiday, expected around 24-25 August 2026. The exact date is subject to official UAE moon-sighting announcement and may shift by one day. Government offices, schools, banks and most businesses are closed.",
    brief_ru: "День рождения Пророка Мухаммада (Маулид ан-Набий) -- официальный государственный праздник ОАЭ, ожидается около 24-25 августа 2026. Точная дата зависит от официального подтверждения по лунному календарю и может сдвинуться на один день. Учреждения, школы, банки и большинство компаний закрыты.",
    source_label_en: "UAE public holidays: official", source_label_ru: "Праздники ОАЭ: официально",
    source_url: "https://publicholidays.ae/prophet-muhammads-birthday/",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://publicholidays.ae/prophet-muhammads-birthday/",
    cta_label_en: "UAE public holidays", cta_label_ru: "Праздники ОАЭ",
    emirate: "UAE", risk_level: "low", lifecycle: "holiday",
    noindex_after: null, archive_action: "keep",
  },

  {
    id: "AUG-NEW-03", date: "2026-08-29",
    label_en: "The Miami Show -- Miami Band live at Coca-Cola Arena, Dubai (29 August 2026)",
    label_ru: "The Miami Show -- Miami Band в Coca-Cola Arena, Дубай (29 августа 2026)",
    short_label_en: "Miami Show", short_label_ru: "Miami Show",
    type: "trade_show", confidence: "confirmed", priority: 3, detail_url: null,
    brief_en: "Miami Band, the iconic Gulf pop group, perform The Miami Show at Coca-Cola Arena, City Walk, Dubai on 29 August 2026 at 8:30 PM. Tickets from AED 195.",
    brief_ru: "Miami Band выступают с шоу The Miami Show в Coca-Cola Arena, City Walk, Дубай, 29 августа 2026, 20:30. Билеты от 195 AED.",
    source_label_en: "Platinumlist + The National UAE", source_label_ru: "Platinumlist + The National UAE",
    source_url: "https://dubai.platinumlist.net/",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://dubai.platinumlist.net/",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-08-30", archive_action: "remove",
  },

  // ─── SEPTEMBER ────────────────────────────────────────────────────────────

  {
    id: "SEP-NEW-01", date: "2026-09-05",
    label_en: "The Legends of Trance: ATB with Solarstone and Steve Allen at The Agenda, Dubai (5 September)",
    label_ru: "The Legends of Trance: ATB с Solarstone и Steve Allen в The Agenda, Дубай (5 сентября)",
    short_label_en: "ATB / Trance", short_label_ru: "ATB / Транс",
    type: "trade_show", confidence: "confirmed", priority: 3, detail_url: null,
    brief_en: "ATB headlines The Legends of Trance show at The Agenda, Dubai Media City on 5 September 2026 at 8:00 PM. Support: Solarstone and Steve Allen.",
    brief_ru: "ATB -- хедлайнер шоу The Legends of Trance в The Agenda, Dubai Media City, 5 сентября 2026, 20:00. На разогреве: Solarstone и Steve Allen.",
    source_label_en: "Bandsintown + The Agenda", source_label_ru: "Bandsintown + The Agenda",
    source_url: "https://www.bandsintown.com/e/1038058672-atb-at-the-agenda",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.theagenda.com/upcoming",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-09-06", archive_action: "remove",
  },

  // ─── OCTOBER ──────────────────────────────────────────────────────────────

  {
    id: "OCT-NEW-01", date: "2026-10-05",
    label_en: "God Save The Queen -- Ultimate Queen tribute at Dubai Opera (5 October 2026)",
    label_ru: "God Save The Queen -- трибьют Queen в Dubai Opera (5 октября 2026)",
    short_label_en: "God Save Queen", short_label_ru: "Queen трибьют",
    type: "trade_show", confidence: "confirmed", priority: 3, detail_url: null,
    brief_en: "God Save The Queen, a high-production tribute to Queen, performs at Dubai Opera, Downtown Dubai on 5 October 2026. Originally scheduled for March 2026, rescheduled due to regional conflict. Tickets via Platinumlist.",
    brief_ru: "God Save The Queen -- масштабное трибьют-шоу группы Queen -- в Dubai Opera, Downtown Dubai, 5 октября 2026. Изначально запланировано на март 2026, перенесено в связи с региональным конфликтом.",
    source_label_en: "Platinumlist + Dubai Opera", source_label_ru: "Platinumlist + Dubai Opera",
    source_url: "https://dubai.platinumlist.net/event-tickets/104217/god-save-the-queen-a-tribute-in-dubai",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://dubai.platinumlist.net/event-tickets/104217/god-save-the-queen-a-tribute-in-dubai",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-10-06", archive_action: "remove",
  },

  {
    id: "OCT-NEW-02", date: "2026-10-10",
    label_en: "Sonny Fodera live at Bohemia Beach Club, FIVE LUXE JBR, Dubai (10 October 2026)",
    label_ru: "Концерт Sonny Fodera в Bohemia Beach Club, FIVE LUXE JBR, Дубай (10 октября 2026)",
    short_label_en: "Sonny Fodera", short_label_ru: "Sonny Fodera",
    type: "trade_show", confidence: "confirmed", priority: 3, detail_url: null,
    brief_en: "Sonny Fodera performs live at Bohemia Beach Club, FIVE LUXE JBR, Dubai on 10 October 2026 at 7:00 PM. Presented by Bohemia. FIVE LUXE is on Jumeirah Beach Residence.",
    brief_ru: "Sonny Fodera выступает в Bohemia Beach Club, FIVE LUXE JBR, Дубай, 10 октября 2026, 19:00. Мероприятие от Bohemia. FIVE LUXE на Jumeirah Beach Residence.",
    source_label_en: "Bohemia Dubai + Ticketmaster", source_label_ru: "Bohemia Dubai + Ticketmaster",
    source_url: "https://www.bohemiadubai.com/events/bohemia-presents-sonny-fodera",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://dubai.platinumlist.net/",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-10-11", archive_action: "remove",
  },

  {
    id: "OCT-NEW-03", date: "2026-10-25",
    label_en: "Blue 25th Anniversary Tour at Dubai Millennium Amphitheatre, Expo City Dubai (25 October)",
    label_ru: "Концерт Blue (25-летие) в Dubai Millennium Amphitheatre, Expo City Dubai (25 октября)",
    short_label_en: "Blue Concert", short_label_ru: "Blue",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "British pop group Blue bring their 25th Anniversary Tour to Dubai Millennium Amphitheatre, Expo City Dubai on 25 October 2026 at 8:00 PM. Presented by Live Nation Middle East. Tickets from AED 199.",
    brief_ru: "Британская поп-группа Blue выступает с туром в честь 25-летия в Dubai Millennium Amphitheatre, Expo City Dubai, 25 октября 2026, 20:00. Организатор: Live Nation Middle East. Билеты от 199 AED.",
    source_label_en: "Live Nation Middle East: official", source_label_ru: "Live Nation Middle East: официально",
    source_url: "https://www.livenation.me/event/blue-25th-anniversary-tour-dubai-dubai-tickets-edp1653105",
    source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.ticketmaster.ae/",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-10-26", archive_action: "remove",
  },

  {
    id: "OCT-NEW-04", date: "2026-10-25",
    label_en: "Russell Peters live at Etihad Arena, Abu Dhabi (25 October 2026) -- Abu Dhabi Showdown Week",
    label_ru: "Концерт Рассела Питерса в Etihad Arena, Абу-Даби (25 октября 2026)",
    short_label_en: "Russell Peters", short_label_ru: "Russell Peters",
    type: "trade_show", confidence: "confirmed", priority: 3, detail_url: null,
    brief_en: "Stand-up comedy legend Russell Peters performs at Etihad Arena, Yas Island, Abu Dhabi on 25 October 2026, as part of Abu Dhabi Showdown Week. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Легенда стендапа Рассел Питерс выступает в Etihad Arena, Yas Island, Абу-Даби, 25 октября 2026, в рамках Abu Dhabi Showdown Week. Абу-Даби -- около 130 км от Дубая.",
    source_label_en: "Etihad Arena + Yas Island", source_label_ru: "Etihad Arena + Yas Island",
    source_url: "https://www.etihadarena.ae/en/events", source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.etihadarena.ae/en/events",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-10-26", archive_action: "remove",
  },

  {
    id: "OCT-NEW-05", date: "2026-10-31", period_end: "2026-11-01",
    label_en: "Riverdance 30th Anniversary Tour at Etihad Arena, Abu Dhabi (31 October -- 1 November)",
    label_ru: "Riverdance 30-летие: тур в Etihad Arena, Абу-Даби (31 октября -- 1 ноября)",
    short_label_en: "Riverdance", short_label_ru: "Riverdance",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "Riverdance celebrates its 30th Anniversary Tour with two shows at Etihad Arena, Yas Island, Abu Dhabi on 31 October and 1 November 2026. One of the world's most iconic dance theatre shows. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Riverdance -- 30-летие тура, два шоу в Etihad Arena, Yas Island, Абу-Даби: 31 октября и 1 ноября 2026.",
    source_label_en: "Yas Island + Etihad Arena", source_label_ru: "Yas Island + Etihad Arena",
    source_url: "https://www.yasisland.com/en/events", source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.etihadarena.ae/en/events",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-11-02", archive_action: "remove",
  },

  // ─── NOVEMBER ─────────────────────────────────────────────────────────────

  {
    id: "NOV-NEW-02", date: "2026-11-21",
    label_en: "OFFLIMITS Music Festival at Etihad Park, Yas Island, Abu Dhabi (21 November) -- Shakira, Jonas Brothers, NE-YO",
    label_ru: "OFFLIMITS Music Festival в Etihad Park, Yas Island, Абу-Даби (21 ноября) -- Shakira, Jonas Brothers, NE-YO",
    short_label_en: "OFFLIMITS Festival", short_label_ru: "OFFLIMITS",
    type: "trade_show", confidence: "confirmed", priority: 1, detail_url: null,
    brief_en: "OFFLIMITS Music Festival returns to Etihad Park, Yas Island, Abu Dhabi on 21 November 2026. Headlined by Shakira (Las Mujeres Ya No Lloran Tour) with Jonas Brothers, NE-YO, Biffy Clyro, KALEO and more. 12 hours from 3:00 PM. Abu Dhabi is approximately 130 km from Dubai. Originally scheduled April 4, rescheduled due to regional conflict.",
    brief_ru: "OFFLIMITS Music Festival возвращается в Etihad Park, Yas Island, Абу-Даби, 21 ноября 2026. Хедлайнер: Shakira (Las Mujeres Ya No Lloran). Также: Jonas Brothers, NE-YO, Biffy Clyro, KALEO. 12 часов с 15:00. Абу-Даби -- около 130 км от Дубая.",
    source_label_en: "OFFLIMITS: official + Gulf News + What's On", source_label_ru: "OFFLIMITS: официально + Gulf News + What's On",
    source_url: "https://www.offlimits.com/", source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://abu-dhabi.platinumlist.net/event-tickets/offlimits-music-festival",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-11-22", archive_action: "remove",
  },

  {
    id: "NOV-NEW-03", date: "2026-11-27",
    label_en: "Tarkan live at Etihad Arena, Abu Dhabi -- UAE debut (27 November 2026)",
    label_ru: "Концерт Таркана в Etihad Arena, Абу-Даби -- дебют в ОАЭ (27 ноября 2026)",
    short_label_en: "Tarkan", short_label_ru: "Tarkan",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "Turkish pop icon Tarkan makes his Abu Dhabi debut at Etihad Arena, Yas Island on 27 November 2026. Famous for 'Simarik' and 'Kuzu Kuzu'. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Турецкий поп-идол Тарkan дебютирует в Абу-Даби -- выступление в Etihad Arena, Yas Island, 27 ноября 2026. Известен хитами Simarik и Kuzu Kuzu.",
    source_label_en: "Etihad Arena + Yas Island", source_label_ru: "Etihad Arena + Yas Island",
    source_url: "https://www.etihadarena.ae/en/events", source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.etihadarena.ae/en/events",
    cta_label_en: "Tickets", cta_label_ru: "Билеты",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-11-28", archive_action: "remove",
  },

  // ─── DECEMBER ─────────────────────────────────────────────────────────────

  {
    id: "DEC-NEW-01", date: "2026-12-03",
    label_en: "F1 Abu Dhabi GP week concert at Yas Marina Circuit (3 December) -- Lewis Capaldi headline",
    label_ru: "Концерт недели Гран-при Абу-Даби F1 в Yas Marina (3 декабря) -- хедлайнер Льюис Капальди",
    short_label_en: "F1 Concert", short_label_ru: "F1 Концерт",
    type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
    brief_en: "During the Formula 1 Abu Dhabi Grand Prix week, a concert takes place at Yas Marina Circuit on Thursday 3 December 2026 with Lewis Capaldi as headline performer. The F1 race runs 4-6 December at the same circuit.",
    brief_ru: "В рамках недели Гран-при Абу-Даби Формулы-1 на трассе Yas Marina Circuit 3 декабря 2026 пройдёт концерт с хедлайнером Льюисом Капальди. Гонка F1 -- 4-6 декабря на той же трассе.",
    source_label_en: "Yas Island + Abu Dhabi GP", source_label_ru: "Yas Island + Abu Dhabi GP",
    source_url: "https://www.yasisland.com/en/events", source_status: "confirmed",
    cta_type: "open_source", cta_url: "https://www.abudhabigp.com/en/",
    cta_label_en: "Abu Dhabi GP", cta_label_ru: "Abu Dhabi GP",
    emirate: "Abu Dhabi", risk_level: "low", lifecycle: "event_fixed",
    noindex_after: "2026-12-07", archive_action: "remove",
  },

];

// ---- Pre-flight validation ------------------------------------------------

section("Pre-flight validation");

for (const item of BATCH_2A) {
  if (HARD_EXCLUDED_IDS.has(item.id)) {
    console.error(`\nABORT: hard-excluded item "${item.id}" in list.`); process.exit(1);
  }
  const labelLow = item.label_en.toLowerCase();
  for (const kw of HOLD_KEYWORDS) {
    if (labelLow.includes(kw)) {
      console.error(`\nABORT: excluded keyword "${kw}" in "${item.id}".`); process.exit(1);
    }
  }
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === "string") assertNoEmDash(`${item.id}.${k}`, v);
  }
}

// Verify Mawlid uses expected (not confirmed)
const mawlid = BATCH_2A.find(x => x.id === "AUG-NEW-02");
if (mawlid && mawlid.confidence !== "expected") {
  console.error("\nABORT: Mawlid item must use confidence='expected'. Found: " + mawlid.confidence);
  process.exit(1);
}

log(`  ${BATCH_2A.length} items validated. No em dashes. No excluded items.`);
log(`  Mawlid confidence: "${mawlid?.confidence}" (expected) PASS`);

// ---- Items by target month slug ------------------------------------------

const ITEMS_BY_SLUG: Record<string, DateItem[]> = {
  "july-2026-dubai-calendar":      BATCH_2A.filter(x => ["JUL-NEW-01","JUL-NEW-02","JUL-NEW-03"].includes(x.id)),
  "august-2026-dubai-calendar":    BATCH_2A.filter(x => ["AUG-NEW-01","AUG-NEW-02","AUG-NEW-03"].includes(x.id)),
  "september-2026-dubai-calendar": BATCH_2A.filter(x => ["SEP-NEW-01"].includes(x.id)),
  "october-2026-dubai-calendar":   BATCH_2A.filter(x => ["OCT-NEW-01","OCT-NEW-02","OCT-NEW-03","OCT-NEW-04","OCT-NEW-05"].includes(x.id)),
  "november-2026-dubai-calendar":  BATCH_2A.filter(x => ["NOV-NEW-02","NOV-NEW-03"].includes(x.id)),
  "december-2026-uae-calendar":    BATCH_2A.filter(x => ["DEC-NEW-01"].includes(x.id)),
};

// ---- Helper: idempotent merge --------------------------------------------

function mergeItems(existingJson: string, newItems: DateItem[]): { json: string; added: string[]; skipped: string[] } {
  const existing = JSON.parse(existingJson) as DateItem[];
  const existingIds = new Set(existing.map(x => x.id));
  const added: string[] = [];
  const skipped: string[] = [];
  for (const item of newItems) {
    if (existingIds.has(item.id)) { skipped.push(item.id); }
    else { existing.push(item); added.push(item.id); }
  }
  return { json: JSON.stringify(existing), added, skipped };
}

// ---- Update existing calendar pages -------------------------------------

section("Update calendar pages");

const allPages = getAllCalendarPages();
let totalAdded = 0;
let totalSkipped = 0;

for (const [slug, newItems] of Object.entries(ITEMS_BY_SLUG)) {
  log(`\n  ${slug} (+${newItems.length} candidates):`);
  const page = allPages.find(p => p.slug === slug);
  if (!page) {
    console.error(`  ABORT: Page "${slug}" not found on production DB.`); process.exit(1);
  }

  const { json: mergedJson, added, skipped } = mergeItems(page.datesJson, newItems);
  if (added.length)   log(`    Added:   ${added.join(", ")}`);
  if (skipped.length) log(`    Skipped: ${skipped.join(", ")}`);

  const upd = updateCalendarDraft(page.id, { dates_json: mergedJson });
  if (!upd.ok) { console.error(`  FAIL updateCalendarDraft ${slug}:`, upd.errors); process.exit(1); }

  const pub = publishCalendar(page.id);
  if (!pub.ok) { console.error(`  FAIL publishCalendar ${slug}:`, pub.errors); process.exit(1); }

  log(`  Published. Warnings: ${pub.warnings.length ? pub.warnings.join("; ") : "none"}`);
  totalAdded += added.length;
  totalSkipped += skipped.length;
}

// ---- Post-import verification --------------------------------------------

section("Post-import verification");

const pagesAfter = getAllCalendarPages();
const expectedCounts: Record<string, number> = {
  "july-2026-dubai-calendar": 6,
  "august-2026-dubai-calendar": 8,
  "september-2026-dubai-calendar": 11,
  "october-2026-dubai-calendar": 11,
  "november-2026-dubai-calendar": 6,
  "december-2026-uae-calendar": 6,
};

let anyFail = false;
for (const [slug, expected] of Object.entries(expectedCounts)) {
  const p = pagesAfter.find(x => x.slug === slug);
  if (!p || p.status !== "published") {
    console.error(`  FAIL: ${slug} not published.`); anyFail = true; continue;
  }
  const count = (JSON.parse(p.datesJson) as unknown[]).length;
  const ok = count >= expected - 1; // allow one less if mawlid already existed
  log(`  ${slug}: status=${p.status}, items=${count} ${ok ? "PASS" : "WARN (expected ~" + expected + ")"}`);
  if (!ok) anyFail = true;
}

if (anyFail) { console.error("\nImport verification had failures -- check above."); process.exit(1); }

// ---- Summary ------------------------------------------------------------

section("Import complete -- summary");
log(`
DB PATH: ${DB_PATH}
TOTAL ADDED: ${totalAdded}
TOTAL SKIPPED (already present): ${totalSkipped}

By month:
  july-2026-dubai-calendar      +${ITEMS_BY_SLUG["july-2026-dubai-calendar"].length} (JUL-NEW-01, JUL-NEW-02, JUL-NEW-03)
  august-2026-dubai-calendar    +${ITEMS_BY_SLUG["august-2026-dubai-calendar"].length} (AUG-NEW-01, AUG-NEW-02 [Mawlid/expected], AUG-NEW-03)
  september-2026-dubai-calendar +${ITEMS_BY_SLUG["september-2026-dubai-calendar"].length} (SEP-NEW-01)
  october-2026-dubai-calendar   +${ITEMS_BY_SLUG["october-2026-dubai-calendar"].length} (OCT-NEW-01..05)
  november-2026-dubai-calendar  +${ITEMS_BY_SLUG["november-2026-dubai-calendar"].length} (NOV-NEW-02, NOV-NEW-03)
  december-2026-uae-calendar    +${ITEMS_BY_SLUG["december-2026-uae-calendar"].length} (DEC-NEW-01)

Mawlid (AUG-NEW-02): confidence="expected" -- date subject to UAE moon-sighting announcement.

ROLLBACK (if needed):
  Restore production DB from backup:
  /var/www/guidex/data/guides.db.backup-pre-6c96c-*

PRODUCTION IMPORT COMPLETE.
`);

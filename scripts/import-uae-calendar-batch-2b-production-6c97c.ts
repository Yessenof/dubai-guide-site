/**
 * Phase 6C-97C -- UAE Calendar Batch 2B Production Import
 * PRODUCTION IMPORT -- requires explicit env flag.
 *
 * Run:
 *   CONFIRM_PRODUCTION_IMPORT_6C97C=yes npx tsx scripts/import-uae-calendar-batch-2b-production-6c97c.ts
 *
 * Boris Grebenshikov (OCT-R2): CONDITIONAL VERIFIED.
 *   Verified YES_READY in UAE_CALENDAR_BATCH_2B_3_CANDIDATE_PACK_6C97A.md,
 *   Decision=IMPORT in UAE_CALENDAR_BATCH_2B_PREIMPORT_REVIEW_6C97B.md,
 *   and QA PASS in UAE_CALENDAR_BATCH_2B_LOCAL_IMPORT_QA_6C97B.md.
 *   Included.
 *
 * September (+1):  SEP-R1  The Corrs, Etihad Arena Abu Dhabi, Sep 27
 * October (+2):    OCT-R1  Elrow Dubai, Dubai Media City Amphitheatre, Oct 24
 *                  OCT-R2  Boris Grebenshikov, The Agenda Dubai Media City, Oct 24
 * November (+8):   NOV-R1  Dubai Ride (DFC opener), Nov 1
 *                  NOV-R2  ANOTR, Playa Pacha FIVE LUXE JBR, Nov 13
 *                  NOV-R3  When Chai Met Toast, New Covent Garden Theatre Dubai, Nov 14
 *                  NOV-R4  Anuv Jain, Terra Expo City Dubai, Nov 20
 *                  NOV-R5  KEINEMUSIK, Bab Al Shams Arena Dubai, Nov 21
 *                  NOV-R6  Dubai Run (DFC flagship), Nov 22
 *                  NOV-R7  Atif Aslam, Coca-Cola Arena Dubai, Nov 27
 *                  NOV-R8  Hiba Tawaji & Ibrahim Maalouf, Dubai Opera, Nov 27
 * December (+1):   DEC-R1  Imagine Dragons, Etihad Park Yas Island, Dec 5 (F1 Yasalam)
 * December update: DEC-UPDATE-1  Update existing DEC-NEW-01 with Zara Larsson + correct venue
 *
 * NEVER IMPORTED (hard exclusions):
 *   Global Village, DSF, Timur Bey 2, Beat The Heat DXB, CCA Dec 16-20,
 *   Kadim Al Sahir, Swedish House Mafia, ATB Sep 18 duplicate
 */

import path from "path";
import fs from "fs";
import {
  getAllCalendarPages,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Production safety gate ------------------------------------------------

const CONFIRM_FLAG = process.env.CONFIRM_PRODUCTION_IMPORT_6C97C;
if (CONFIRM_FLAG !== "yes") {
  console.error("\nABORT: Production import requires explicit env flag.");
  console.error("  Run: CONFIRM_PRODUCTION_IMPORT_6C97C=yes npx tsx scripts/import-uae-calendar-batch-2b-production-6c97c.ts");
  process.exit(1);
}

// ---- DB path validation ----------------------------------------------------

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

// ---- Helpers ----------------------------------------------------------------

function log(msg: string) { console.log(msg); }
function section(title: string) {
  console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`);
}
function abort(msg: string): never {
  console.error(`\nABORT: ${msg}`);
  process.exit(1);
}

section("Phase 6C-97C -- UAE Calendar Batch 2B Production Import");
log(`  DB path:     ${DB_PATH}`);
log(`  Timestamp:   ${new Date().toISOString()}`);
log(`  PRODUCTION -- env flag confirmed.`);
log(`  Boris Grebenshikov (OCT-R2): CONDITIONAL VERIFIED -- included.`);

// ---- Production DB backup --------------------------------------------------

section("Creating production DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);

const BACKUP_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-6c97c-${BACKUP_TIMESTAMP}`;

fs.copyFileSync(DB_PATH, BACKUP_PATH);
const backupStat = fs.statSync(BACKUP_PATH);
if (backupStat.size === 0) abort("Backup created but is empty. Aborting.");
log(`  Backup: ${BACKUP_PATH}`);
log(`  Backup size: ${Math.round(backupStat.size / 1024)}K`);
log(`  Backup confirmed non-zero. PASS`);

// ---- Hard exclusion guard --------------------------------------------------

const HARD_EXCLUDED_IDS = new Set([
  "GLOBAL-VILLAGE", "DSF", "TIMUR-BEY", "TIMUR-BEY-2", "BEAT-THE-HEAT",
  "CCA-DEC16", "CCA-DEC-16", "KADIM", "SHM", "ATB-SEP18", "ATB-SEP-18",
]);

const HOLD_KEYWORDS = [
  "global village", "shopping festival", "timur bey 2",
  "beat the heat dxb", "kadim al sahir", "swedish house mafia",
];

// ---- Em dash guard ---------------------------------------------------------

const EM = "—"; // em dash
function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM)) abort(`Em dash found in "${label}": ${value}`);
}

// ---- Types -----------------------------------------------------------------

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

// ---- Batch 2B new items (identical to local 6C-97B script) -----------------

const BATCH_2B_NEW: DateItem[] = [

  // --- SEPTEMBER -------------------------------------------------------------

  {
    id: "SEP-R1",
    date: "2026-09-27",
    label_en: "The Corrs live at Etihad Arena, Yas Island, Abu Dhabi (27 September 2026)",
    label_ru: "Концерт The Corrs в Etihad Arena, Yas Island, Abu Dhabi (27 September 2026)",
    short_label_en: "The Corrs",
    short_label_ru: "The Corrs",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Irish pop-rock group The Corrs perform a one-night concert at Etihad Arena, Yas Island, Abu Dhabi on 27 September 2026. Presented by Live Nation Middle East in partnership with DCT Abu Dhabi and Miral. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Ирландская поп-рок группа The Corrs выступает в Etihad Arena, Yas Island, Abu Dhabi, 27 сентября 2026. Организатор: Live Nation Middle East. Abu Dhabi -- около 130 км от Дубая.",
    source_label_en: "Gulf News + Etihad Arena + Time Out Abu Dhabi",
    source_label_ru: "Gulf News + Etihad Arena + Time Out Abu Dhabi",
    source_url: "https://www.etihadarena.ae/en/events",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.etihadarena.ae/en/events",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Abu Dhabi",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-28",
    archive_action: "remove",
  },

  // --- OCTOBER ---------------------------------------------------------------

  {
    id: "OCT-R1",
    date: "2026-10-24",
    label_en: "Elrow Dubai 2026 -- Nowmads festival at Dubai Media City Amphitheatre (24 October)",
    label_ru: "Elrow Dubai 2026 -- фестиваль Nowmads в Dubai Media City Amphitheatre (24 октября)",
    short_label_en: "Elrow Dubai",
    short_label_ru: "Elrow Dubai",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Elrow Dubai returns on 24 October 2026 at Dubai Media City Amphitheatre with the Nowmads theme -- a colourful journey through music and spectacle for over 12,000 attendees. Originally scheduled April 2026, rescheduled due to regional conflict.",
    brief_ru: "Elrow Dubai возвращается 24 октября 2026 в Dubai Media City Amphitheatre с темой Nowmads -- яркое шоу с музыкой и перфомансами. Вместимость 12 000+ человек. Перенесено с апреля 2026.",
    source_label_en: "Elrow Dubai (official) + What's On UAE",
    source_label_ru: "Elrow Dubai (официально) + What's On UAE",
    source_url: "https://www.elrowdubai.com/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.elrowdubai.com/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-25",
    archive_action: "remove",
  },

  // OCT-R2: Boris Grebenshikov -- CONDITIONAL VERIFIED (YES_READY in all 3 required docs)
  {
    id: "OCT-R2",
    date: "2026-10-24",
    label_en: "Boris Grebenshikov (BG+) live at The Agenda, Dubai Media City (24 October 2026)",
    label_ru: "Борис Гребенщиков (BG+) в The Agenda, Dubai Media City (24 октября 2026)",
    short_label_en: "Boris Grebenshikov",
    short_label_ru: "Гребенщиков (BG)",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "Boris Grebenshikov (BG), founder of the Russian rock band Aquarium, performs his first Dubai concert at The Agenda, Dubai Media City on 24 October 2026. The BG+ project presents a world ensemble with timeless hits and new material from his 2026 album.",
    brief_ru: "Борис Гребенщиков выступает впервые в Дубае: The Agenda, Dubai Media City, 24 октября 2026. Проект BG+ -- международный ансамбль, хиты Аквариума и новый материал из альбома 2026 года.",
    source_label_en: "Platinumlist + The Agenda + Songkick",
    source_label_ru: "Platinumlist + The Agenda + Songkick",
    source_url: "https://dubai.platinumlist.net/event-tickets/104708/boris-grebenshikov-at-the-agenda-dubai",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://dubai.platinumlist.net/event-tickets/104708/boris-grebenshikov-at-the-agenda-dubai",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-25",
    archive_action: "remove",
  },

  // --- NOVEMBER --------------------------------------------------------------

  {
    id: "NOV-R1",
    date: "2026-11-01",
    label_en: "Dubai Ride 2026 -- citywide cycling event opens Dubai Fitness Challenge (1 November)",
    label_ru: "Dubai Ride 2026 -- городской велозабег, старт Dubai Fitness Challenge (1 ноября)",
    short_label_en: "Dubai Ride",
    short_label_ru: "Dubai Ride",
    type: "deadline",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Dubai Ride 2026 on 1 November opens the Dubai Fitness Challenge's 30-day programme. Cyclists of all levels ride past landmarks including Burj Khalifa and the Museum of the Future. Free registration at dubairide.com.",
    brief_ru: "Dubai Ride 2026, 1 ноября -- открытие Dubai Fitness Challenge. Велозабег мимо Burj Khalifa и Museum of the Future. Бесплатная регистрация на dubairide.com.",
    source_label_en: "Dubai Ride: official (dubairide.com)",
    source_label_ru: "Dubai Ride: официально (dubairide.com)",
    source_url: "https://www.dubairide.com/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.dubairide.com/",
    cta_label_en: "Register",
    cta_label_ru: "Регистрация",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-02",
    archive_action: "remove",
  },

  {
    id: "NOV-R2",
    date: "2026-11-13",
    label_en: "ANOTR live at Playa Pacha, FIVE LUXE JBR, Dubai (13 November 2026)",
    label_ru: "ANOTR в Playa Pacha, FIVE LUXE JBR, Дубай (13 ноября 2026)",
    short_label_en: "ANOTR",
    short_label_ru: "ANOTR",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "Dutch house music duo ANOTR perform at Playa Pacha, FIVE LUXE JBR, Dubai on 13 November 2026 at 7:00 PM. Presented by Pacha ICONS. FIVE LUXE is located on Jumeirah Beach Residence.",
    brief_ru: "Голландский хаус-дуэт ANOTR выступает в Playa Pacha, FIVE LUXE JBR, Дубай, 13 ноября 2026, 19:00. Организатор: Pacha ICONS. FIVE LUXE -- набережная Jumeirah Beach Residence.",
    source_label_en: "Pacha ICONS (official) + Ticketmaster",
    source_label_ru: "Pacha ICONS (официально) + Ticketmaster",
    source_url: "https://www.pachaicons.com/dubai/events/131126-anotr-five-luxe",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.ticketmaster.ae/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-14",
    archive_action: "remove",
  },

  {
    id: "NOV-R3",
    date: "2026-11-14",
    label_en: "When Chai Met Toast live in Dubai -- New Covent Garden Theatre, Mall of the Emirates (14 November)",
    label_ru: "When Chai Met Toast в Дубае -- New Covent Garden Theatre, Mall of the Emirates (14 ноября)",
    short_label_en: "When Chai Met Toast",
    short_label_ru: "When Chai Met Toast",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "Indian indie folk band When Chai Met Toast perform live at New Covent Garden Theatre, Mall of the Emirates, Dubai on 14 November 2026 at 7:00 PM. Tickets via Ticketmaster UAE.",
    brief_ru: "Индийская инди-фолк группа When Chai Met Toast выступает в New Covent Garden Theatre, Mall of the Emirates, Дубай, 14 ноября 2026, 19:00. Билеты: Ticketmaster UAE.",
    source_label_en: "Visit Dubai (official) + Ticketmaster UAE",
    source_label_ru: "Visit Dubai (официально) + Ticketmaster UAE",
    source_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/when-chai-met-toast",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.ticketmaster.ae/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-15",
    archive_action: "remove",
  },

  {
    id: "NOV-R4",
    date: "2026-11-20",
    label_en: "Anuv Jain -- Dastakhat World Tour at Terra, Expo City Dubai (20 November 2026)",
    label_ru: "Anuv Jain -- тур Dastakhat в Terra, Expo City Dubai (20 ноября 2026)",
    short_label_en: "Anuv Jain",
    short_label_ru: "Anuv Jain",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Indian indie-pop artist Anuv Jain performs his Dastakhat World Tour at Terra -- The Sustainability Pavilion, Expo City Dubai on 20 November 2026 at 8:00 PM. General Admission from AED 149 via Ticketmaster UAE.",
    brief_ru: "Anuv Jain выступает с туром Dastakhat в Terra, Expo City Dubai, 20 ноября 2026, 20:00. Билеты от 149 AED на Ticketmaster UAE.",
    source_label_en: "Ticketmaster UAE + Live Nation Middle East",
    source_label_ru: "Ticketmaster UAE + Live Nation Middle East",
    source_url: "https://www.ticketmaster.ae/event/anuv-jain-tickets/59869255",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.ticketmaster.ae/event/anuv-jain-tickets/59869255",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-21",
    archive_action: "remove",
  },

  {
    id: "NOV-R5",
    date: "2026-11-21",
    label_en: "KEINEMUSIK (&ME, Rampa, Adam Port) -- debut desert show at Bab Al Shams Arena, Dubai (21 November)",
    label_ru: "KEINEMUSIK (&ME, Rampa, Adam Port) -- дебютное пустынное шоу, Bab Al Shams Arena, Дубай (21 ноября)",
    short_label_en: "KEINEMUSIK",
    short_label_ru: "KEINEMUSIK",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "German electronic collective KEINEMUSIK (&ME, Rampa, Adam Port) headline their debut UAE desert show at Bab Al Shams Arena, Dubai on 21 November 2026 at 8:00 PM. The largest KEINEMUSIK production staged in the UAE. Tickets from AED 300 via Ticketmaster.",
    brief_ru: "Немецкий электронный коллектив KEINEMUSIK (&ME, Rampa, Adam Port) -- дебютное пустынное шоу в Bab Al Shams Arena, Дубай, 21 ноября 2026, 20:00. Самое масштабное выступление KEINEMUSIK в ОАЭ. Билеты от 300 AED.",
    source_label_en: "Pacha ICONS (official) + Spotify + Ticketmaster + What's On",
    source_label_ru: "Pacha ICONS (официально) + Spotify + Ticketmaster + What's On",
    source_url: "https://www.pachaicons.com/dubai/events/21112026-keinemusik-bab-al-shams",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.ticketmaster.ae/artist/keinemusik-tickets/1321963",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-22",
    archive_action: "remove",
  },

  {
    id: "NOV-R6",
    date: "2026-11-22",
    label_en: "Dubai Run 2026 -- Dubai Fitness Challenge flagship run through Downtown Dubai (22 November)",
    label_ru: "Dubai Run 2026 -- главный забег Dubai Fitness Challenge по Downtown Dubai (22 ноября)",
    short_label_en: "Dubai Run",
    short_label_ru: "Dubai Run",
    type: "deadline",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Dubai Run 2026 on 22 November is the flagship event of the Dubai Fitness Challenge. Free and open to all fitness levels, the route runs past iconic Dubai landmarks. Register at dubairun.com.",
    brief_ru: "Dubai Run 2026, 22 ноября -- главное мероприятие Dubai Fitness Challenge. Бесплатный забег по маршруту мимо знаковых мест Дубая. Регистрация на dubairun.com.",
    source_label_en: "Dubai Run: official (dubairun.com)",
    source_label_ru: "Dubai Run: официально (dubairun.com)",
    source_url: "https://www.dubairun.com/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.dubairun.com/",
    cta_label_en: "Register",
    cta_label_ru: "Регистрация",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-23",
    archive_action: "remove",
  },

  {
    id: "NOV-R7",
    date: "2026-11-27",
    label_en: "Atif Aslam live at Coca-Cola Arena, Dubai (27 November 2026)",
    label_ru: "Концерт Атифа Аслама в Coca-Cola Arena, Дубай (27 ноября 2026)",
    short_label_en: "Atif Aslam Dubai",
    short_label_ru: "Atif Aslam Дубай",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Atif Aslam returns to Coca-Cola Arena, City Walk, Dubai on 27 November 2026 at 9:00 PM. Rescheduled from April 19, 2026 -- all original tickets remain valid. Tickets from AED 150.",
    brief_ru: "Атиф Аслам выступает в Coca-Cola Arena, City Walk, Дубай, 27 ноября 2026, 21:00. Перенесено с 19 апреля 2026 -- все ранее купленные билеты действительны. Билеты от 150 AED.",
    source_label_en: "Coca-Cola Arena (official) + Gulf News + Platinumlist",
    source_label_ru: "Coca-Cola Arena (официально) + Gulf News + Platinumlist",
    source_url: "https://coca-cola-arena.com/music/1798/atif-aslam",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://dubai.platinumlist.net/event-tickets/104859/atif-aslam",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-28",
    archive_action: "remove",
  },

  {
    id: "NOV-R8",
    date: "2026-11-27",
    label_en: "Hiba Tawaji & Ibrahim Maalouf -- A la Francaise live at Dubai Opera (27 November 2026, 8:30 PM)",
    label_ru: "Hiba Tawaji & Ibrahim Maalouf -- A la Francaise в Dubai Opera (27 ноября 2026, 20:30)",
    short_label_en: "Hiba Tawaji & Maalouf",
    short_label_ru: "Hiba Tawaji",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "Lebanese soprano Hiba Tawaji and Franco-Lebanese jazz trumpeter Ibrahim Maalouf perform a one-night show at Dubai Opera, Downtown Dubai on 27 November 2026 at 8:30 PM. Presented by Live Nation Middle East. Tickets from AED 355.",
    brief_ru: "Ливанская сопрано Hiba Tawaji и джазовый трубач Ibrahim Maalouf выступают в Dubai Opera, Downtown Dubai, 27 ноября 2026, 20:30. Live Nation Middle East. Билеты от 355 AED.",
    source_label_en: "Dubai Opera (official) + Visit Dubai + Gulf News + Live Nation",
    source_label_ru: "Dubai Opera (официально) + Visit Dubai + Gulf News + Live Nation",
    source_url: "https://www.dubaiopera.com/en-US/products-list",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.livenation.me/event/hiba-tawaji-invites-ibrahim-maalouf-a-la-francaise-dubai-tickets-edp1652568",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-28",
    archive_action: "remove",
  },

  // --- DECEMBER --------------------------------------------------------------

  {
    id: "DEC-R1",
    date: "2026-12-05",
    label_en: "F1 Abu Dhabi Week -- Imagine Dragons Yasalam concert at Etihad Park, Yas Island (5 December 2026)",
    label_ru: "F1 Абу-Даби -- концерт Yasalam Imagine Dragons в Etihad Park, Yas Island (5 декабря 2026)",
    short_label_en: "Imagine Dragons",
    short_label_ru: "Imagine Dragons",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Imagine Dragons headline the Saturday Yasalam After-Race Concert at Etihad Park, Yas Island, Abu Dhabi on 5 December 2026 -- part of the Formula 1 Abu Dhabi Grand Prix weekend (3-6 December). Concert included with F1 race ticket. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Imagine Dragons -- хедлайнер субботнего концерта Yasalam в Etihad Park, Yas Island, Abu Dhabi, 5 декабря 2026. Часть Гран-при Формулы-1 Абу-Даби (3-6 декабря). Включено в билет на гонку. Abu Dhabi -- около 130 км от Дубая.",
    source_label_en: "Abu Dhabi GP (official) + The National + Gulf News + Businesswire",
    source_label_ru: "Abu Dhabi GP (официально) + The National + Gulf News + Businesswire",
    source_url: "https://www.abudhabigp.com/en/yasalam-after-race-concerts",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.abudhabigp.com/en/",
    cta_label_en: "Abu Dhabi GP",
    cta_label_ru: "Abu Dhabi GP",
    emirate: "Abu Dhabi",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-12-07",
    archive_action: "remove",
  },

];

// ---- Pre-flight validation --------------------------------------------------

section("Pre-flight validation -- new items");

for (const item of BATCH_2B_NEW) {
  if (HARD_EXCLUDED_IDS.has(item.id)) abort(`Hard-excluded item "${item.id}" found in list.`);
  const labelLow = item.label_en.toLowerCase();
  for (const kw of HOLD_KEYWORDS) {
    if (labelLow.includes(kw)) abort(`Hold keyword "${kw}" found in "${item.id}" label.`);
  }
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === "string") assertNoEmDash(`${item.id}.${k}`, v);
  }
}

log(`  ${BATCH_2B_NEW.length} new items validated. No em dashes. No excluded items.`);
log(`  OCT-R2 (Boris Grebenshikov) present: CONDITIONAL VERIFIED`);

// ---- Items by target month slug --------------------------------------------

const INSERTS_BY_SLUG: Record<string, DateItem[]> = {
  "september-2026-dubai-calendar": BATCH_2B_NEW.filter(x => x.id === "SEP-R1"),
  "october-2026-dubai-calendar":   BATCH_2B_NEW.filter(x => ["OCT-R1", "OCT-R2"].includes(x.id)),
  "november-2026-dubai-calendar":  BATCH_2B_NEW.filter(x =>
    ["NOV-R1","NOV-R2","NOV-R3","NOV-R4","NOV-R5","NOV-R6","NOV-R7","NOV-R8"].includes(x.id)
  ),
  "december-2026-uae-calendar":    BATCH_2B_NEW.filter(x => x.id === "DEC-R1"),
};

// ---- Helper: idempotent merge by ID ----------------------------------------

function mergeItems(existingJson: string, newItems: DateItem[]): {
  json: string; added: string[]; skipped: string[];
} {
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

// ---- Helper: update single item by ID in existing JSON ---------------------

function updateItemById(
  existingJson: string,
  targetId: string,
  patch: Partial<DateItem>,
): { json: string; found: boolean } {
  const existing = JSON.parse(existingJson) as DateItem[];
  const idx = existing.findIndex(x => x.id === targetId);
  if (idx === -1) return { json: existingJson, found: false };
  existing[idx] = { ...existing[idx], ...patch };
  return { json: JSON.stringify(existing), found: true };
}

// ---- Step 1: Insert new items ----------------------------------------------

section("Step 1 -- Insert new items");

const allPages = getAllCalendarPages();
let totalInserted = 0;
let totalSkipped = 0;

for (const [slug, newItems] of Object.entries(INSERTS_BY_SLUG)) {
  log(`\n  ${slug} (+${newItems.length} candidates):`);
  const page = allPages.find(p => p.slug === slug);
  if (!page) abort(`Page not found on production DB: "${slug}"`);

  const { json: mergedJson, added, skipped } = mergeItems(page.datesJson, newItems);
  if (added.length)   log(`    Added:   ${added.join(", ")}`);
  if (skipped.length) log(`    Skipped: ${skipped.join(", ")} (already present)`);

  const upd = updateCalendarDraft(page.id, { dates_json: mergedJson });
  if (!upd.ok) abort(`updateCalendarDraft failed for ${slug}: ${JSON.stringify(upd.errors)}`);

  const pub = publishCalendar(page.id);
  if (!pub.ok) abort(`publishCalendar failed for ${slug}: ${JSON.stringify(pub.errors)}`);
  if (pub.warnings.length) log(`    Warnings: ${pub.warnings.join("; ")}`);

  log(`    Published ${slug}. OK`);
  totalInserted += added.length;
  totalSkipped += skipped.length;
}

// ---- Step 2: Update DEC-NEW-01 (add Zara Larsson, correct venue) -----------

section("Step 2 -- Update DEC-NEW-01 (Zara Larsson + Etihad Park venue correction)");

// Re-fetch to get fresh JSON after Step 1 December insert
const allPagesStep2 = getAllCalendarPages();
const decPage = allPagesStep2.find(p => p.slug === "december-2026-uae-calendar");
if (!decPage) abort("december-2026-uae-calendar not found");

const decPatch: Partial<DateItem> = {
  label_en: "F1 Abu Dhabi Week -- Yasalam opening concert at Etihad Park, Yas Island (3 December): Lewis Capaldi & Zara Larsson",
  label_ru: "F1 Abu Dhabi -- концерт Yasalam в Etihad Park, Yas Island (3 декабря): Льюис Капальди и Zara Larsson",
  short_label_en: "F1 Concert Night 1",
  short_label_ru: "F1 Концерт (3 дек)",
  brief_en: "The Formula 1 Abu Dhabi Grand Prix Yasalam After-Race Concert opens on Thursday 3 December 2026 at Etihad Park, Yas Island with Lewis Capaldi and Zara Larsson performing. The F1 race weekend runs 3-6 December at Yas Marina Circuit. Concert access included with F1 ticket.",
  brief_ru: "Концерты Yasalam After-Race Гран-при Абу-Даби F1 открываются в четверг 3 декабря 2026 в Etihad Park, Yas Island: выступают Льюис Капальди и Zara Larsson. Гоночный уикенд F1 -- 3-6 декабря в Yas Marina Circuit. Вход включён в билет F1.",
  source_label_en: "Abu Dhabi GP (official) + The National + Arab News + PR Newswire",
  source_label_ru: "Abu Dhabi GP (официально) + The National + Arab News + PR Newswire",
  source_url: "https://www.abudhabigp.com/en/yasalam-after-race-concerts",
};

// Validate no em dashes in patch
for (const [k, v] of Object.entries(decPatch)) {
  if (typeof v === "string") assertNoEmDash(`DEC-NEW-01.${k}`, v);
}

const { json: updatedDecJson, found: decFound } = updateItemById(
  decPage.datesJson, "DEC-NEW-01", decPatch
);
if (!decFound) abort("DEC-NEW-01 not found in december-2026-uae-calendar. Cannot update.");

const decUpd = updateCalendarDraft(decPage.id, { dates_json: updatedDecJson });
if (!decUpd.ok) abort(`updateCalendarDraft failed for December update: ${JSON.stringify(decUpd.errors)}`);

const decPub = publishCalendar(decPage.id);
if (!decPub.ok) abort(`publishCalendar failed for December update: ${JSON.stringify(decPub.errors)}`);
if (decPub.warnings.length) log(`  Warnings: ${decPub.warnings.join("; ")}`);
log(`  DEC-NEW-01 updated and republished. OK`);

// ---- Post-import verification ----------------------------------------------

section("Post-import verification");

const pagesAfter = getAllCalendarPages();
const EXPECTED_COUNTS: Record<string, number> = {
  "september-2026-dubai-calendar": 12,
  "october-2026-dubai-calendar":   13,
  "november-2026-dubai-calendar":  14,
  "december-2026-uae-calendar":    7,
};

let anyFail = false;
for (const [slug, expected] of Object.entries(EXPECTED_COUNTS)) {
  const p = pagesAfter.find(x => x.slug === slug);
  if (!p || p.status !== "published") {
    console.error(`  FAIL: ${slug} not published after import.`);
    anyFail = true;
    continue;
  }
  const items = JSON.parse(p.datesJson) as DateItem[];
  const ok = items.length === expected;
  log(`  ${slug}: status=${p.status}, items=${items.length} (expected ${expected}) ${ok ? "PASS" : "WARN"}`);
  if (!ok) {
    log(`    Item IDs: ${items.map(x => x.id).join(", ")}`);
    anyFail = true;
  }
}

// Verify DEC-NEW-01 patch applied
const decPageAfter = pagesAfter.find(p => p.slug === "december-2026-uae-calendar");
if (decPageAfter) {
  const decItems = JSON.parse(decPageAfter.datesJson) as DateItem[];
  const decNew01 = decItems.find(x => x.id === "DEC-NEW-01");
  if (!decNew01) { console.error("  FAIL: DEC-NEW-01 missing after update."); anyFail = true; }
  else {
    const hasZara = decNew01.label_en.includes("Zara Larsson");
    const hasEtihadPark = decNew01.brief_en.includes("Etihad Park");
    const hasNight1 = decNew01.short_label_en === "F1 Concert Night 1";
    log(`\n  DEC-NEW-01 verification:`);
    log(`    label_en: ${decNew01.label_en}`);
    log(`    label_ru: ${decNew01.label_ru}`);
    log(`    short_label_en: ${decNew01.short_label_en}`);
    log(`    Zara Larsson in label_en:  ${hasZara ? "PASS" : "FAIL"}`);
    log(`    Etihad Park in brief_en:   ${hasEtihadPark ? "PASS" : "FAIL"}`);
    log(`    short_label_en=Night 1:    ${hasNight1 ? "PASS" : "FAIL"}`);
    if (!hasZara || !hasEtihadPark || !hasNight1) anyFail = true;
  }
}

// Verify OCT-R2 (Boris) inserted
const octPageAfter = pagesAfter.find(p => p.slug === "october-2026-dubai-calendar");
if (octPageAfter) {
  const octItems = JSON.parse(octPageAfter.datesJson) as DateItem[];
  const borisPresent = octItems.some(x => x.id === "OCT-R2");
  log(`\n  OCT-R2 Boris Grebenshikov present: ${borisPresent ? "PASS" : "FAIL (CONDITIONAL VERIFIED -- should be present)"}`);
  if (!borisPresent) anyFail = true;
}

if (anyFail) {
  console.error("\n  IMPORT VERIFICATION FAILED -- see above. Check DB and rollback if needed.");
  process.exit(1);
}

log("\n  All post-import verifications PASSED.");

// ---- Summary ----------------------------------------------------------------

section("Import complete -- summary");
log(`
DB PATH:     ${DB_PATH}
BACKUP PATH: ${BACKUP_PATH}

NEW ITEMS INSERTED: ${totalInserted}
ITEMS SKIPPED (already present): ${totalSkipped}
ITEMS UPDATED: 1 (DEC-NEW-01)

By month:
  september-2026-dubai-calendar  +1 (SEP-R1 -- The Corrs)
  october-2026-dubai-calendar    +2 (OCT-R1 -- Elrow, OCT-R2 -- Boris Grebenshikov [CONDITIONAL VERIFIED])
  november-2026-dubai-calendar   +8 (NOV-R1 Dubai Ride, NOV-R2 ANOTR, NOV-R3 When Chai Met Toast,
                                      NOV-R4 Anuv Jain, NOV-R5 KEINEMUSIK, NOV-R6 Dubai Run,
                                      NOV-R7 Atif Aslam Dubai, NOV-R8 Hiba Tawaji)
  december-2026-uae-calendar     +1 (DEC-R1 -- Imagine Dragons) + 1 update (DEC-NEW-01)

Expected item counts after import:
  September: 12  (was 11)
  October:   13  (was 11)
  November:  14  (was 6)
  December:  7   (was 6, plus DEC-NEW-01 updated with Zara Larsson)

Boris Grebenshikov (OCT-R2): CONDITIONAL VERIFIED and imported.
Dec 3 F1 concert (DEC-NEW-01): updated with Zara Larsson + Etihad Park venue correction.

NOT IMPORTED (hard exclusions):
  Global Village, DSF, Timur Bey 2, Beat The Heat DXB,
  CCA Dec 16-20, Kadim Al Sahir, Swedish House Mafia, ATB Sep 18 duplicate

ROLLBACK (if needed):
  # DB-only rollback -- restore from backup:
  cp ${BACKUP_PATH} ${DB_PATH}

  # Or run on server:
  # ssh root@85.9.203.69 "cp ${BACKUP_PATH} /var/www/guidex/data/guides.db"

  # To remove specific inserted items by slug (if rollback is not possible):
  # Delete OCT-R2 from october-2026-dubai-calendar
  # Delete SEP-R1 from september-2026-dubai-calendar
  # Delete NOV-R1..NOV-R8 from november-2026-dubai-calendar
  # Delete DEC-R1 from december-2026-uae-calendar
  # Revert DEC-NEW-01 in december-2026-uae-calendar

PRODUCTION IMPORT COMPLETE -- Phase 6C-97C.
`);

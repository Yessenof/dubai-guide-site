/**
 * Phase 6C-95C -- UAE Calendar Batch 1 Production Import
 * PRODUCTION IMPORT -- requires explicit env flag.
 *
 * Run:
 *   CONFIRM_PRODUCTION_IMPORT_6C95C=yes npx tsx scripts/import-uae-calendar-batch-1-production-6c95c.ts
 *
 * What this script does:
 *   Adds Batch 1 items to existing monthly pages (Aug, Sep, Oct, Nov 2026)
 *   Creates December 2026 UAE calendar page
 *
 * Approved items:
 *   AUG-04-BACKSCH   Back to School UAE, Aug 31
 *   AUG-05-MICHAEL   This Is Michael, Etihad Arena Abu Dhabi, Aug 22
 *   SEP-09-AGUILERA  Christina Aguilera, Etihad Arena Abu Dhabi, Sep 25
 *   SEP-10-OAKENFOLD Paul Oakenfold, The Agenda Dubai, Sep 18
 *   OCT-05-MIDTERM   UAE school mid-term break, Oct 12-18
 *   OCT-06-MARX      Richard Marx, Coca-Cola Arena Dubai, Oct 5
 *   NOV-05-SIBF      Sharjah International Book Fair, Nov 4-15
 *   DEC-01-COMMEM    UAE Commemoration Day, Dec 1
 *   DEC-02-NATDAY    UAE National Day, Dec 2-3
 *   DEC-03-F1        F1 Abu Dhabi Grand Prix, Dec 4-6
 *   DEC-04-GITEX     GITEX Global 2026, Dec 7-11, Expo City Dubai
 *   DEC-05-WINBRK    UAE school winter break, Dec 14
 *
 * HOLD (never imported by this script):
 *   DFC  -- site 403
 *   Global Village -- no opening date
 *   DSF  -- official dates not released
 *   The Corrs Sep -- date TBC
 *   VAT Q3 Nov -- FTA date unverified
 *   RISE Expo Oct -- single source
 *   Downtown Design standalone -- source unreachable
 */

import path from "path";
import {
  getAllCalendarPages,
  updateCalendarDraft,
  publishCalendar,
  createCalendarDraft,
} from "@/lib/db/news-events-calendar-admin";

// ---- Production safety gate -----------------------------------------------

const CONFIRM_FLAG = process.env.CONFIRM_PRODUCTION_IMPORT_6C95C;
if (CONFIRM_FLAG !== "yes") {
  console.error("\nABORT: Production import requires explicit env flag.");
  console.error("  Run: CONFIRM_PRODUCTION_IMPORT_6C95C=yes npx tsx scripts/import-uae-calendar-batch-1-production-6c95c.ts");
  process.exit(1);
}

const DB_PATH_RESOLVED = path.resolve(process.cwd(), "data", "guides.db");

function log(msg: string) { console.log(msg); }
function section(title: string) {
  console.log(`\n-- ${title} ${"-".repeat(Math.max(0, 55 - title.length))}`);
}

section("Phase 6C-95C -- UAE Calendar Batch 1 Production Import");
log(`  DB path: ${DB_PATH_RESOLVED}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Em dash guard --------------------------------------------------------

const EM = "—";

function assertNoEmDash(label: string, value: string): void {
  if (value.includes(EM)) {
    console.error(`\nABORT: em dash found in "${label}".`);
    process.exit(1);
  }
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

// ---- HOLD guard: these IDs must never appear in any import ----------------

const HOLD_IDS = new Set([
  "DFC", "NOV-05-DFC", "NOV-02-DD", "GLOBAL-VILLAGE",
  "DSF", "THE-CORRS", "VAT-Q3-NOV", "RISE-OCT",
]);

const HOLD_KEYWORDS_EN = [
  "fitness challenge", "global village", "shopping festival", "the corrs",
  "downtown design", "rise expo",
];

function assertNotHold(item: DateItem): void {
  if (HOLD_IDS.has(item.id)) {
    console.error(`\nABORT: HOLD item "${item.id}" found in import list.`);
    process.exit(1);
  }
  const labelLower = item.label_en.toLowerCase();
  for (const kw of HOLD_KEYWORDS_EN) {
    if (labelLower.includes(kw)) {
      console.error(`\nABORT: HOLD keyword "${kw}" found in item "${item.id}": "${item.label_en}"`);
      process.exit(1);
    }
  }
}

// ---- New calendar items ---------------------------------------------------

const NEW_ITEMS: DateItem[] = [

  {
    id: "AUG-04-BACKSCH",
    date: "2026-08-31",
    label_en: "UAE schools reopen: start of 2026-2027 academic year (31 August)",
    label_ru: "Школы ОАЭ открываются: начало учебного года 2026-2027 (31 августа)",
    short_label_en: "Back to School",
    short_label_ru: "Школа",
    type: "deadline",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "UAE private schools in Dubai, Abu Dhabi and other emirates begin the 2026-2027 academic year on 31 August 2026. Individual staggered return dates vary by school for new and returning students. Source: KHDA official academic calendar.",
    brief_ru: "Частные школы ОАЭ (Дубай, Абу-Даби и другие эмираты) начинают учебный год 2026-2027 31 августа 2026. Конкретная дата выхода может отличаться в зависимости от школы. Источник: официальный учебный календарь KHDA.",
    source_label_en: "KHDA: official academic calendar",
    source_label_ru: "KHDA: официальный учебный календарь",
    source_url: "https://www.timeoutdubai.com/news/uae-2026-2029-school-calendar-confirmed",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://web.khda.gov.ae/en/resources/academic-calendar-dubai-private-schools",
    cta_label_en: "KHDA academic calendar",
    cta_label_ru: "Учебный календарь KHDA",
    emirate: "UAE",
    risk_level: "none",
    lifecycle: "deadline_fixed",
    noindex_after: "2026-09-07",
    archive_action: "remove",
  },

  {
    id: "AUG-05-MICHAEL",
    date: "2026-08-22",
    label_en: "This Is Michael (Michael Jackson tribute) at Etihad Arena, Abu Dhabi (22 August)",
    label_ru: "This Is Michael (трибьют Майклу Джексону) в Etihad Arena, Абу-Даби (22 августа)",
    short_label_en: "This Is Michael",
    short_label_ru: "This Is Michael",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "This Is Michael, a Michael Jackson tribute concert, takes place on 22 August 2026 at Etihad Arena on Yas Bay, Abu Dhabi. Abu Dhabi is approximately 130 km from Dubai. Tickets via Platinumlist or Etihad Arena.",
    brief_ru: "This Is Michael -- трибьют-шоу Майклу Джексону -- пройдёт 22 августа 2026 в Etihad Arena на Yas Bay, Абу-Даби. Абу-Даби находится примерно в 130 км от Дубая. Билеты: Platinumlist или Etihad Arena.",
    source_label_en: "Songkick + The National UAE",
    source_label_ru: "Songkick + The National UAE",
    source_url: "https://www.thenationalnews.com/arts-culture/music-stage/2026/05/05/concerts-events-uae-abu-dhabi-dubai/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://abu-dhabi.platinumlist.net/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Abu Dhabi",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-08-23",
    archive_action: "remove",
  },

  {
    id: "SEP-09-AGUILERA",
    date: "2026-09-25",
    label_en: "Christina Aguilera live at Etihad Arena, Abu Dhabi (25 September)",
    label_ru: "Концерт Кристины Агилеры в Etihad Arena, Абу-Даби (25 сентября)",
    short_label_en: "Christina Aguilera",
    short_label_ru: "Christina Aguilera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Christina Aguilera performs live at Etihad Arena, Yas Bay, Abu Dhabi on 25 September 2026. Abu Dhabi is approximately 130 km from Dubai. Tickets via Platinumlist or Etihad Arena.",
    brief_ru: "Кристина Агилера выступает в Etihad Arena, Yas Bay, Абу-Даби 25 сентября 2026. Абу-Даби -- около 130 км от Дубая. Билеты: Platinumlist или Etihad Arena.",
    source_label_en: "Songkick + The National UAE",
    source_label_ru: "Songkick + The National UAE",
    source_url: "https://www.thenationalnews.com/arts-culture/music-stage/2026/05/05/concerts-events-uae-abu-dhabi-dubai/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://abu-dhabi.platinumlist.net/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Abu Dhabi",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-26",
    archive_action: "remove",
  },

  {
    id: "SEP-10-OAKENFOLD",
    date: "2026-09-18",
    label_en: "Paul Oakenfold -- The Legend of Trance live at The Agenda, Dubai (18 September)",
    label_ru: "Paul Oakenfold -- The Legend of Trance в The Agenda, Дубай (18 сентября)",
    short_label_en: "Paul Oakenfold",
    short_label_ru: "Paul Oakenfold",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "Paul Oakenfold performs The Legend of Trance live at The Agenda, Dubai on 18 September 2026. The Agenda is a live music venue in Dubai Media City. Source: The National UAE (May 2026 concert roundup).",
    brief_ru: "Paul Oakenfold выступает с The Legend of Trance в The Agenda, Дубай, 18 сентября 2026. The Agenda -- концертная площадка в Dubai Media City. Источник: The National UAE (обзор концертов, май 2026).",
    source_label_en: "The National UAE",
    source_label_ru: "The National UAE",
    source_url: "https://www.thenationalnews.com/arts-culture/music-stage/2026/05/05/concerts-events-uae-abu-dhabi-dubai/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://dubai.platinumlist.net/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-19",
    archive_action: "remove",
  },

  {
    id: "OCT-05-MIDTERM",
    date: "2026-10-12",
    period_end: "2026-10-18",
    label_en: "UAE school mid-term break (12-18 October 2026) -- schools reopen 19 October",
    label_ru: "Осенние каникулы в школах ОАЭ (12-18 октября 2026) -- занятия с 19 октября",
    short_label_en: "Mid-term break",
    short_label_ru: "Каникулы",
    type: "deadline",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "UAE private schools break for mid-term from 12 to 18 October 2026. Schools reopen on Monday 19 October 2026. Applies to most private schools in Dubai, Abu Dhabi and other emirates; some schools may vary by one day. Source: KHDA official academic calendar 2026-2027.",
    brief_ru: "Осенние каникулы в частных школах ОАЭ: 12-18 октября 2026. Занятия возобновляются в понедельник 19 октября. Применимо к большинству частных школ Дубая, Абу-Даби и других эмиратов; у некоторых школ сроки могут отличаться на один день. Источник: официальный учебный календарь KHDA 2026-2027.",
    source_label_en: "KHDA: official academic calendar",
    source_label_ru: "KHDA: официальный учебный календарь",
    source_url: "https://www.timeoutdubai.com/news/uae-2026-2029-school-calendar-confirmed",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://web.khda.gov.ae/en/resources/academic-calendar-dubai-private-schools",
    cta_label_en: "KHDA academic calendar",
    cta_label_ru: "Учебный календарь KHDA",
    emirate: "UAE",
    risk_level: "none",
    lifecycle: "deadline_fixed",
    noindex_after: "2026-10-19",
    archive_action: "remove",
  },

  {
    id: "OCT-06-MARX",
    date: "2026-10-05",
    label_en: "Richard Marx live at Coca-Cola Arena, Dubai (5 October 2026)",
    label_ru: "Концерт Richard Marx в Coca-Cola Arena, Дубай (5 октября 2026)",
    short_label_en: "Richard Marx",
    short_label_ru: "Richard Marx",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en: "Richard Marx performs live at Coca-Cola Arena, Dubai on 5 October 2026. Tickets available at the official Coca-Cola Arena website. The arena is located in City Walk, Dubai.",
    brief_ru: "Richard Marx выступает в Coca-Cola Arena, Дубай, 5 октября 2026. Билеты на официальном сайте Coca-Cola Arena. Арена расположена в City Walk, Дубай.",
    source_label_en: "Coca-Cola Arena: official",
    source_label_ru: "Coca-Cola Arena: официально",
    source_url: "https://coca-cola-arena.com/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://coca-cola-arena.com/",
    cta_label_en: "Tickets",
    cta_label_ru: "Билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-06",
    archive_action: "remove",
  },

  {
    id: "NOV-05-SIBF",
    date: "2026-11-04",
    period_end: "2026-11-15",
    label_en: "Sharjah International Book Fair 2026 (4-15 November) at Expo Centre Sharjah",
    label_ru: "Международная книжная ярмарка Шарджи 2026 (4-15 ноября) в Expo Centre Sharjah",
    short_label_en: "Sharjah Book Fair",
    short_label_ru: "Книжная ярм.",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "Sharjah International Book Fair 2026 runs 4-15 November at Expo Centre Sharjah. One of the world's largest annual book fairs, attracting publishers, authors and readers from over 100 countries. Public access; most days are free to enter. Sharjah is approximately 30 km from central Dubai.",
    brief_ru: "Международная книжная ярмарка Шарджи 2026 проходит 4-15 ноября в Expo Centre Sharjah. Одна из крупнейших книжных ярмарок мира: издатели, авторы и читатели из более 100 стран. Открыта для всех; большинство дней -- бесплатный вход. Шарджа -- около 30 км от центра Дубая.",
    source_label_en: "SIBF: official + multi-source",
    source_label_ru: "SIBF: официально + несколько источников",
    source_url: "https://sibf.com/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://sibf.com/",
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Sharjah",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-11-16",
    archive_action: "remove",
  },

];

// ---- December DATES_JSON --------------------------------------------------

const DECEMBER_DATES_JSON = JSON.stringify([
  {
    id: "DEC-01-COMMEM",
    date: "2026-12-01",
    label_en: "UAE Commemoration Day (Martyrs' Day) -- public holiday (1 December)",
    label_ru: "День Памяти ОАЭ (День Мучеников) -- государственный праздник (1 декабря)",
    short_label_en: "Commemoration Day",
    short_label_ru: "День Памяти",
    type: "public-holiday",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "UAE Commemoration Day (1 December) honours UAE soldiers who died in service. Official public holiday: government offices, schools, banks and most private businesses are closed.",
    brief_ru: "День Памяти ОАЭ (1 декабря) посвящён памяти военнослужащих ОАЭ, погибших при исполнении долга. Официальный государственный праздник: учреждения, школы, банки и большинство частных компаний не работают.",
    source_label_en: "UAE government: official public holiday",
    source_label_ru: "Правительство ОАЭ: официальный государственный праздник",
    source_url: "https://publicholidays.ae/national-day/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://publicholidays.ae/national-day/",
    cta_label_en: "UAE public holidays",
    cta_label_ru: "Праздники ОАЭ",
    emirate: "UAE",
    risk_level: "none",
    lifecycle: "holiday",
    noindex_after: null,
    archive_action: "keep",
  },
  {
    id: "DEC-02-NATDAY",
    date: "2026-12-02",
    period_end: "2026-12-03",
    label_en: "UAE National Day -- Eid Al Etihad -- 2-day public holiday (2-3 December)",
    label_ru: "День независимости ОАЭ -- Ид аль-Иттихад -- государственный праздник 2 дня (2-3 декабря)",
    short_label_en: "National Day",
    short_label_ru: "День независимости",
    type: "public-holiday",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "UAE National Day is a 2-day public holiday on 2-3 December, marking the founding of the UAE in 1971. Citywide celebrations, fireworks, parades and national events. Government, schools and most businesses are closed. With Friday 4 December following, residents may enjoy a 3-4 day break.",
    brief_ru: "День независимости ОАЭ -- двухдневный государственный праздник 2-3 декабря, в честь образования ОАЭ в 1971 году. Праздничные мероприятия, фейерверки и парады по всем семи эмиратам. Учреждения, школы и большинство компаний закрыты. С пятницей 4 декабря -- возможный перерыв 3-4 дня.",
    source_label_en: "UAE government: official public holiday",
    source_label_ru: "Правительство ОАЭ: официальный государственный праздник",
    source_url: "https://publicholidays.ae/national-day/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://publicholidays.ae/national-day/",
    cta_label_en: "UAE public holidays",
    cta_label_ru: "Праздники ОАЭ",
    emirate: "UAE",
    risk_level: "none",
    lifecycle: "holiday",
    noindex_after: null,
    archive_action: "keep",
  },
  {
    id: "DEC-03-F1",
    date: "2026-12-04",
    period_end: "2026-12-06",
    label_en: "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026 at Yas Marina (4-6 December, Abu Dhabi)",
    label_ru: "Гран-при Абу-Даби Формулы-1 2026 на Yas Marina (4-6 декабря, Абу-Даби)",
    short_label_en: "F1 Abu Dhabi",
    short_label_ru: "F1 Абу-Даби",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026 takes place 4-6 December at Yas Marina Circuit, Abu Dhabi. Season finale of the 2026 F1 World Championship. Practice: Dec 4-5; qualifying: Dec 5; race: Sunday Dec 6. Abu Dhabi is approximately 130 km from Dubai.",
    brief_ru: "Гран-при Абу-Даби Формулы-1 2026 -- 4-6 декабря на трассе Yas Marina Circuit, Абу-Даби. Финальный этап чемпионата мира Формулы-1 2026. Практика: 4-5 дек; квалификация: 5 дек; гонка: воскресенье 6 дек. Абу-Даби -- около 130 км от Дубая.",
    source_label_en: "Abu Dhabi GP: official",
    source_label_ru: "Abu Dhabi GP: официально",
    source_url: "https://www.abudhabigp.com/en/",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.abudhabigp.com/en/",
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Abu Dhabi",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-12-07",
    archive_action: "remove",
  },
  {
    id: "DEC-04-GITEX",
    date: "2026-12-07",
    period_end: "2026-12-11",
    label_en: "GITEX Global 2026 at Expo City Dubai (7-11 December) -- first edition at new venue",
    label_ru: "GITEX Global 2026 в Expo City Dubai (7-11 декабря) -- первый раз на новой площадке",
    short_label_en: "GITEX",
    short_label_ru: "GITEX",
    type: "trade_show",
    confidence: "confirmed",
    priority: 1,
    detail_url: null,
    brief_en: "GITEX Global 2026 runs 7-11 December at Expo City Dubai (Dubai Exhibition Centre) -- a new venue from 2026, moving from DWTC. World's largest annual tech, AI and startup event.",
    brief_ru: "GITEX Global 2026 -- 7-11 декабря в Expo City Dubai (Dubai Exhibition Centre). Смена площадки с 2026 года. Крупнейшее в мире ежегодное мероприятие по технологиям, ИИ и стартапам.",
    source_label_en: "GITEX: official + Media Office UAE",
    source_label_ru: "GITEX: официально + Медиа-офис ОАЭ",
    source_url: "https://www.gitex.com/gitex-global-2026",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.gitex.com/gitex-global-2026",
    cta_label_en: "Official website",
    cta_label_ru: "Официальный сайт",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-12-12",
    archive_action: "remove",
  },
  {
    id: "DEC-05-WINBRK",
    date: "2026-12-14",
    period_end: "2027-01-03",
    label_en: "UAE school winter break begins (14 December 2026 to 3 January 2027)",
    label_ru: "Начало зимних каникул в школах ОАЭ (14 декабря 2026 -- 3 января 2027)",
    short_label_en: "Winter break",
    short_label_ru: "Зимние каникулы",
    type: "deadline",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en: "UAE private school winter break begins 14 December 2026. Schools reopen 4 January 2027. Applies to most private schools in Dubai, Abu Dhabi and other emirates; individual schools may vary by 1-2 days. Source: KHDA official academic calendar 2026-2027.",
    brief_ru: "Зимние каникулы в частных школах ОАЭ начинаются 14 декабря 2026. Занятия возобновляются 4 января 2027. Применимо к большинству частных школ Дубая, Абу-Даби и других эмиратов; у некоторых школ сроки могут отличаться на 1-2 дня. Источник: официальный учебный календарь KHDA 2026-2027.",
    source_label_en: "KHDA: official academic calendar",
    source_label_ru: "KHDA: официальный учебный календарь",
    source_url: "https://web.khda.gov.ae/en/resources/academic-calendar-dubai-private-schools",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://web.khda.gov.ae/en/resources/academic-calendar-dubai-private-schools",
    cta_label_en: "KHDA academic calendar",
    cta_label_ru: "Учебный календарь KHDA",
    emirate: "UAE",
    risk_level: "none",
    lifecycle: "deadline_fixed",
    noindex_after: null,
    archive_action: "keep",
  },
]);

// ---- December page fields -------------------------------------------------

const DEC_SLUG  = "december-2026-uae-calendar";
const DEC_EN_TITLE   = "December 2026 in Dubai and the UAE: National Day, F1 Abu Dhabi and GITEX";
const DEC_RU_TITLE   = "Декабрь 2026 в Дубае и ОАЭ: День независимости, Гран-при Абу-Даби и GITEX";
const DEC_EN_SUMMARY =
  "December 2026 is one of the UAE's most event-dense months. " +
  "UAE National Day (2-3 December) and Commemoration Day (1 December) create a 3-day public holiday cluster. " +
  "Formula 1 Abu Dhabi Grand Prix follows on 4-6 December at Yas Marina Circuit. " +
  "GITEX Global 2026 -- now at Expo City Dubai for the first time -- runs 7-11 December.";
const DEC_RU_SUMMARY =
  "Декабрь 2026 -- один из самых насыщенных событиями месяцев в ОАЭ. " +
  "День независимости (2-3 декабря) и День Памяти (1 декабря) создают трёхдневный кластер государственных праздников. " +
  "Гран-при Абу-Даби Формулы-1 -- 4-6 декабря на трассе Yas Marina. " +
  "GITEX Global 2026 впервые проходит в Expo City Dubai: 7-11 декабря.";
const DEC_EN_BODY =
  "December opens with three public holidays in a row: Commemoration Day (1 December) and " +
  "UAE National Day (2-3 December). With Friday 4 December following, most residents and businesses get a 3-4 day break.\n\n" +
  "The Formula 1 season finale takes place at Yas Marina Circuit, Abu Dhabi (4-6 December). " +
  "Abu Dhabi is approximately 130 km from Dubai. Race: Sunday 6 December. Qualifying: Saturday 5 December.\n\n" +
  "GITEX Global 2026 runs 7-11 December at Expo City Dubai -- a major venue change from DWTC. " +
  "This is the world's largest annual tech and startup exhibition, now anchored in the December tourism season.\n\n" +
  "School winter break begins 14 December, with classes resuming 4 January 2027.\n\n" +
  "Dubai Shopping Festival (DSF) typically begins in December. The 2026-27 edition has not yet announced official dates.";
const DEC_RU_BODY =
  "Декабрь начинается с трёх государственных праздников подряд: День Памяти (1 декабря) и " +
  "День независимости ОАЭ (2-3 декабря). С пятницей 4 декабря большинство жителей и компаний получают 3-4 выходных.\n\n" +
  "Финал сезона Формулы-1 проходит на трассе Yas Marina Circuit, Абу-Даби (4-6 декабря). " +
  "Абу-Даби -- около 130 км от Дубая. Гонка: воскресенье 6 декабря. Квалификация: суббота 5 декабря.\n\n" +
  "GITEX Global 2026 -- 7-11 декабря в Expo City Dubai. Смена площадки с DWTC на Expo City. " +
  "Крупнейшая в мире технологическая выставка и стартап-форум теперь привязана к туристическому сезону.\n\n" +
  "Зимние каникулы начинаются 14 декабря; занятия возобновляются 4 января 2027.\n\n" +
  "Dubai Shopping Festival (DSF) традиционно стартует в декабре. Официальные даты издания 2026-27 пока не объявлены.";
const DEC_EN_NOTES =
  "Commemoration Day and UAE National Day are official public holidays: government offices, banks and most businesses are closed. " +
  "F1 Abu Dhabi takes place in Abu Dhabi, not Dubai. " +
  "GITEX is at Expo City Dubai (new venue from 2026) -- not at DWTC. " +
  "School winter break applies to most UAE private schools; individual schools may vary by 1-2 days.";
const DEC_RU_NOTES =
  "День Памяти и День независимости ОАЭ -- официальные выходные: государственные учреждения, банки и большинство компаний не работают. " +
  "Гран-при Абу-Даби проходит в Абу-Даби, не в Дубае. " +
  "GITEX -- в Expo City Dubai (новая площадка с 2026 года), не в DWTC. " +
  "Зимние каникулы действуют для большинства частных школ ОАЭ; у отдельных школ даты могут отличаться на 1-2 дня.";
const DEC_EN_SEO_TITLE = "December 2026 UAE Calendar: National Day, F1 Abu Dhabi and GITEX";
const DEC_RU_SEO_TITLE = "Декабрь 2026 ОАЭ: День независимости, Гран-при Абу-Даби и GITEX";
const DEC_EN_META =
  "December 2026 in Dubai and the UAE: Commemoration Day and National Day (1-3 Dec), " +
  "F1 Abu Dhabi Grand Prix (4-6 Dec), GITEX Global at Expo City Dubai (7-11 Dec), school winter break (14 Dec).";
const DEC_RU_META =
  "Декабрь 2026 в Дубае и ОАЭ: День Памяти и День независимости (1-3 дек), " +
  "Гран-при Абу-Даби Формулы-1 (4-6 дек), GITEX Global в Expo City Dubai (7-11 дек), зимние каникулы (14 дек).";

// ---- Pre-flight: em dash and HOLD checks ---------------------------------

section("Pre-flight: em dash validation");

for (const item of NEW_ITEMS) {
  for (const [k, v] of Object.entries(item)) {
    if (typeof v === "string") assertNoEmDash(`${item.id}.${k}`, v);
  }
}
for (const [label, value] of [
  ["DEC_EN_TITLE", DEC_EN_TITLE], ["DEC_RU_TITLE", DEC_RU_TITLE],
  ["DEC_EN_SUMMARY", DEC_EN_SUMMARY], ["DEC_RU_SUMMARY", DEC_RU_SUMMARY],
  ["DEC_EN_BODY", DEC_EN_BODY], ["DEC_RU_BODY", DEC_RU_BODY],
  ["DEC_EN_NOTES", DEC_EN_NOTES], ["DEC_RU_NOTES", DEC_RU_NOTES],
  ["DEC_EN_SEO_TITLE", DEC_EN_SEO_TITLE], ["DEC_RU_SEO_TITLE", DEC_RU_SEO_TITLE],
  ["DEC_EN_META", DEC_EN_META], ["DEC_RU_META", DEC_RU_META],
  ["DECEMBER_DATES_JSON", DECEMBER_DATES_JSON],
] as [string, string][]) {
  assertNoEmDash(label, value);
}
log("  All strings clean -- no em dashes.");

section("Pre-flight: HOLD item guards");
for (const item of NEW_ITEMS) assertNotHold(item);
log("  No HOLD items in import list. PASS");

// ---- Pre-flight: December slug must not already exist --------------------

section("Pre-flight: December slug existence check");
const allPages = getAllCalendarPages();
const existingDec = allPages.find(p => p.slug === DEC_SLUG);
if (existingDec) {
  console.error(`\nABORT: "${DEC_SLUG}" already exists (id=${existingDec.id}, status=${existingDec.status}).`);
  console.error("  Production import must not run twice. DB is already up to date.");
  process.exit(1);
}
log(`  "${DEC_SLUG}" not found -- safe to create.`);
log(`  Current calendar_pages count: ${allPages.length}`);

// ---- Helper: merge items into existing dates_json -----------------------

function mergeItems(existingJson: string, newItems: DateItem[]): string {
  const existing = JSON.parse(existingJson) as DateItem[];
  const existingIds = new Set(existing.map(x => x.id));
  const added: string[] = [];
  const skipped: string[] = [];
  for (const item of newItems) {
    if (existingIds.has(item.id)) { skipped.push(item.id); }
    else { existing.push(item); added.push(item.id); }
  }
  if (added.length)   log(`    Added:   ${added.join(", ")}`);
  if (skipped.length) log(`    Skipped (already present): ${skipped.join(", ")}`);
  return JSON.stringify(existing);
}

// ---- Items by month slug -------------------------------------------------

const ITEMS_BY_SLUG: Record<string, DateItem[]> = {
  "august-2026-dubai-calendar":    NEW_ITEMS.filter(x => ["AUG-04-BACKSCH","AUG-05-MICHAEL"].includes(x.id)),
  "september-2026-dubai-calendar": NEW_ITEMS.filter(x => ["SEP-09-AGUILERA","SEP-10-OAKENFOLD"].includes(x.id)),
  "october-2026-dubai-calendar":   NEW_ITEMS.filter(x => ["OCT-05-MIDTERM","OCT-06-MARX"].includes(x.id)),
  "november-2026-dubai-calendar":  NEW_ITEMS.filter(x => ["NOV-05-SIBF"].includes(x.id)),
};

// ---- Update existing monthly pages --------------------------------------

section("Update existing monthly calendar pages");
let totalNewItems = 0;

for (const [slug, newItems] of Object.entries(ITEMS_BY_SLUG)) {
  log(`\n  Updating ${slug} (+${newItems.length} items):`);
  const page = allPages.find(p => p.slug === slug);
  if (!page) {
    console.error(`  ABORT: Page "${slug}" not found on production DB.`);
    process.exit(1);
  }
  const mergedJson = mergeItems(page.datesJson, newItems);
  const upd = updateCalendarDraft(page.id, { dates_json: mergedJson });
  if (!upd.ok) { console.error(`  FAIL updateCalendarDraft ${slug}:`, upd.errors); process.exit(1); }
  const pub = publishCalendar(page.id);
  if (!pub.ok) { console.error(`  FAIL publishCalendar ${slug}:`, pub.errors); process.exit(1); }
  log(`  Published. Warnings: ${pub.warnings.length ? pub.warnings.join("; ") : "none"}`);
  totalNewItems += newItems.length;
}

// ---- Create December 2026 calendar page ---------------------------------

section("Create December 2026 calendar page");

const decResult = createCalendarDraft({
  slug: DEC_SLUG, calendar_type: "monthly", year: 2026, month: 12,
  en_title: DEC_EN_TITLE, en_summary: DEC_EN_SUMMARY, en_body: DEC_EN_BODY,
  en_notes: DEC_EN_NOTES, en_seo_title: DEC_EN_SEO_TITLE, en_meta_description: DEC_EN_META,
  ru_published: 1,
  ru_title: DEC_RU_TITLE, ru_summary: DEC_RU_SUMMARY, ru_body: DEC_RU_BODY,
  ru_notes: DEC_RU_NOTES, ru_seo_title: DEC_RU_SEO_TITLE, ru_meta_description: DEC_RU_META,
  dates_json: DECEMBER_DATES_JSON,
  last_verified_date: "2026-06-02",
  featured_homepage: 0,
  image_path: "/images/hubs/dubai-skyline-downtown.webp",
  image_alt: "Dubai, December 2026 events and key dates",
  ru_image_alt: "Дубай, события и важные даты декабря 2026",
  official_source_url: "https://www.abudhabigp.com/en/",
});
if (!decResult.ok) { console.error("  FAIL createCalendarDraft December:", decResult.errors); process.exit(1); }
const decId = decResult.id!;
log(`  Draft created. id=${decId}`);

const decPub = publishCalendar(decId);
if (!decPub.ok) { console.error("  FAIL publishCalendar December:", decPub.errors); process.exit(1); }
log(`  Published. Warnings: ${decPub.warnings.length ? decPub.warnings.join("; ") : "none"}`);
totalNewItems += 5;

// ---- Post-import verification -------------------------------------------

section("Post-import verification");
const pagesAfter = getAllCalendarPages();

for (const slug of Object.keys(ITEMS_BY_SLUG)) {
  const p = pagesAfter.find(x => x.slug === slug);
  if (!p || p.status !== "published") { console.error(`  FAIL: ${slug} not published.`); process.exit(1); }
  const count = (JSON.parse(p.datesJson) as unknown[]).length;
  log(`  ${slug}: status=${p.status}, items=${count} PASS`);
}
const decAfter = pagesAfter.find(x => x.slug === DEC_SLUG);
if (!decAfter || decAfter.status !== "published") { console.error(`  FAIL: ${DEC_SLUG} not published.`); process.exit(1); }
log(`  ${DEC_SLUG}: status=${decAfter.status}, items=${(JSON.parse(decAfter.datesJson) as unknown[]).length} PASS`);

// ---- Summary ------------------------------------------------------------

section("Import complete -- summary");
log(`
DB PATH: ${DB_PATH_RESOLVED}

PAGES UPDATED:
  august-2026-dubai-calendar    +2 (AUG-04-BACKSCH, AUG-05-MICHAEL)
  september-2026-dubai-calendar +2 (SEP-09-AGUILERA, SEP-10-OAKENFOLD)
  october-2026-dubai-calendar   +2 (OCT-05-MIDTERM, OCT-06-MARX)
  november-2026-dubai-calendar  +1 (NOV-05-SIBF)

PAGE CREATED:
  ${DEC_SLUG}  id=${decId}
  url=/calendar/${DEC_SLUG}

TOTAL NEW ITEMS: ${totalNewItems}

ROLLBACK (if needed):
  sqlite3 /var/www/guidex/data/guides.db \\
    "DELETE FROM calendar_pages WHERE slug='${DEC_SLUG}';"
  -- Restore updated months from:
  --   /var/www/guidex/data/guides.db.backup-pre-6c95c-*

PRODUCTION IMPORT COMPLETE.
`);

/**
 * Phase 6D Stage D — Batch-02 production patch
 * Aug/Sep/Oct 2026 calendar additions + Richard Marx P0 date correction
 *
 * Items:
 *   AUG: AUG-6D-05 Marwan Moussa & Hleem (Aug 15)
 *        AUG-6D-06 Lege-cy / Aziz Maraka / Big Sam (Aug 22)
 *        AUG-6D-07 Ramy Gamal & Wael Jassar (Aug 8)
 *   SEP: SEP-6D-01 Mina Nader (Sep 5)
 *        SEP-6D-02 Sumukhi Suresh (Sep 26)
 *        SEP-6D-03 Radhika Das: Lightfall (Sep 20)
 *   OCT: OCT-6D-01 Najwa Karam (Oct 2)
 *        OCT-6D-02 Shawn Chidiac (Oct 5)
 *        OCT-6D-03 TJ Monterde & KZ Tandingan (Oct 11)
 *        OCT-6D-04 Vir Das (Oct 18)
 *        OCT-6D-05 Lost Frequencies at Bohemia FIVE Palm (Oct 3)
 *   P0:  OCT-06-MARX corrected 2026-10-05 → 2026-10-03
 *
 * Idempotent: existing IDs are skipped; Marx fix detects already-corrected date.
 */

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.GUIDEX_DB_PATH ?? path.join(process.cwd(), "data", "guides.db");
const BACKUP_DIR = process.env.GUIDEX_BACKUP_DIR ?? path.join(process.cwd(), "backups", "local");

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupPath = path.join(BACKUP_DIR, `guides.db.pre-6d-batch02-${ts}`);
fs.copyFileSync(DB_PATH, backupPath);
console.log(`✓ Backup: ${backupPath}`);

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const integ = (db.prepare("PRAGMA integrity_check").get() as { integrity_check: string })
  .integrity_check;
if (integ !== "ok") throw new Error(`integrity_check pre-patch: ${integ}`);
console.log("✓ integrity_check pre-patch: ok");

// ── Types ─────────────────────────────────────────────────────────────────────

interface CalendarItem {
  id: string;
  date: string;
  label_en: string;
  label_ru: string;
  short_label_en?: string;
  short_label_ru?: string;
  type: string;
  confidence: string;
  priority: number;
  detail_url?: string | null;
  brief_en: string;
  brief_ru: string;
  source_label_en: string;
  source_label_ru: string;
  source_url: string;
  source_status: string;
  cta_type: string;
  cta_url: string;
  cta_label_en: string;
  cta_label_ru: string;
  emirate: string;
  risk_level: string;
  lifecycle: string;
  noindex_after: string;
  archive_action: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function insertItems(slug: string, newItems: CalendarItem[]): void {
  const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(slug) as
    | { dates_json: string }
    | undefined;
  if (!row) throw new Error(`ABORT: ${slug} not found`);
  const dates: CalendarItem[] = JSON.parse(row.dates_json);
  const existing = new Set(dates.map((x) => x.id));
  let added = 0;
  for (const item of newItems) {
    if (existing.has(item.id)) {
      console.log(`  ⚠ ${item.id} already present — skipped`);
      continue;
    }
    dates.push(item);
    existing.add(item.id);
    added++;
    console.log(`  ✓ Added ${item.id} (${item.date}): ${item.label_en.slice(0, 60)}`);
  }
  if (added > 0) {
    db.prepare(
      "UPDATE calendar_pages SET dates_json=?, updated_at=datetime('now') WHERE slug=?"
    ).run(JSON.stringify(dates), slug);
    console.log(`  → ${slug}: ${dates.length} total (+${added})`);
  } else {
    console.log(`  → ${slug}: no changes`);
  }
  // Post-assertion
  const verify: CalendarItem[] = JSON.parse(
    (db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(slug) as { dates_json: string }).dates_json
  );
  const vids = new Set(verify.map((x) => x.id));
  for (const item of newItems) {
    if (!vids.has(item.id)) throw new Error(`ASSERT: ${item.id} missing after insert`);
  }
}

function fixRichardMarx(): void {
  const slug = "october-2026-dubai-calendar";
  const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(slug) as
    | { dates_json: string }
    | undefined;
  if (!row) throw new Error("ABORT: october-2026-dubai-calendar not found");
  const dates: CalendarItem[] = JSON.parse(row.dates_json);
  const entry = dates.find((x) => x.id === "OCT-06-MARX");
  if (!entry) throw new Error("ABORT: OCT-06-MARX not found");
  if (entry.date === "2026-10-03") {
    console.log("  ⚠ OCT-06-MARX already corrected — skipped");
    return;
  }
  if (entry.date !== "2026-10-05") {
    throw new Error(`ABORT: unexpected stored date "${entry.date}" — manual review needed`);
  }
  entry.date = "2026-10-03";
  entry.label_en = "Richard Marx live at Coca-Cola Arena, Dubai (3 October 2026)";
  entry.label_ru = "Концерт Richard Marx в Coca-Cola Arena, Дубай (3 октября 2026)";
  entry.brief_en =
    "Richard Marx performs live at Coca-Cola Arena, City Walk, Dubai on Saturday 3 October 2026. " +
    "The Grammy Award-winning artist makes his Middle East debut in an all-seated, intimate show " +
    'spanning four decades of hits including "Right Here Waiting", "Hazard", and "Now and Forever". ' +
    "Show time: 20:00. Children under 16 must be accompanied by an adult aged 18 or over. " +
    "Tickets from AED 225.";
  entry.brief_ru =
    "Richard Marx выступает в Coca-Cola Arena, City Walk, Дубай, в субботу 3 октября 2026 года. " +
    "Дебют удостоенного премии «Грэмми» артиста на Ближнем Востоке — концерт с закреплёнными " +
    'местами охватывает четыре десятилетия хитов: "Right Here Waiting", "Hazard", "Now and Forever" ' +
    "и другие. Начало: 20:00. Дети до 16 лет — только в сопровождении совершеннолетних (18+). " +
    "Билеты от AED 225.";
  entry.source_label_en = "Coca-Cola Arena official · Platinumlist";
  entry.source_label_ru = "Coca-Cola Arena (официально) · Platinumlist";
  entry.source_url =
    "https://dubai.platinumlist.net/event-tickets/105069/richard-marx-live-at-coca-cola-arena-in-dubai";
  entry.source_status = "confirmed";
  entry.cta_type = "ticket";
  entry.cta_url =
    "https://dubai.platinumlist.net/event-tickets/105069/richard-marx-live-at-coca-cola-arena-in-dubai";
  entry.cta_label_en = "Tickets from AED 225";
  entry.cta_label_ru = "Билеты от AED 225";
  entry.noindex_after = "2026-10-04";
  db.prepare(
    "UPDATE calendar_pages SET dates_json=?, updated_at=datetime('now') WHERE slug=?"
  ).run(JSON.stringify(dates), slug);
  console.log("  ✓ OCT-06-MARX corrected: 2026-10-05 → 2026-10-03");
}

// ── August items ──────────────────────────────────────────────────────────────

const AUG_ITEMS: CalendarItem[] = [
  {
    id: "AUG-6D-07",
    date: "2026-08-08",
    label_en: "A Night of Love and Tears: Ramy Gamal & Wael Jassar at DWTC (8 August)",
    label_ru: "Ночь любви и слёз: Ramy Gamal & Wael Jassar в DWTC (8 августа)",
    short_label_en: "Ramy Gamal & Wael Jassar",
    short_label_ru: "Ramy Gamal & Wael Jassar",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      'Ramy Gamal and Wael Jassar perform "A Night of Love and Tears" at Sheikh Rashid Hall, ' +
      "Dubai World Trade Centre on 8 August 2026. An evening of classic Arabic romantic music " +
      "uniting two of the Arab world's most celebrated voices. Doors 19:00; show 20:00. " +
      "Age 8+. Tickets from AED 195.",
    brief_ru:
      "Рами Гамаль и Ваэль Ясар представляют шоу «Ночь любви и слёз» в Sheikh Rashid Hall, " +
      "Dubai World Trade Centre, 8 августа 2026 года. Вечер классической арабской романтической " +
      "музыки с двумя выдающимися исполнителями. Двери в 19:00; начало в 20:00. Возраст 8+. " +
      "Билеты от AED 195.",
    source_label_en: "Platinumlist",
    source_label_ru: "Platinumlist",
    source_url: "https://dubai.platinumlist.net/event-tickets/107086/a-night-of-love-tears",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubai.platinumlist.net/event-tickets/107086/a-night-of-love-tears",
    cta_label_en: "Tickets from AED 195",
    cta_label_ru: "Билеты от AED 195",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-08-09",
    archive_action: "remove",
  },
  {
    id: "AUG-6D-05",
    date: "2026-08-15",
    label_en: "Beat The Heat DXB Season 5: Marwan Moussa & Hleem at DWTC Hall 8 (15 August)",
    label_ru: "Beat The Heat DXB Season 5: Марван Мусса & Хлим в DWTC Hall 8 (15 августа)",
    short_label_en: "Marwan Moussa & Hleem — Beat The Heat S5",
    short_label_ru: "Марван Мусса & Хлим в DWTC",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Marwan Moussa and Hleem perform at Hall 8, Dubai World Trade Centre as part of the " +
      "Beat The Heat DXB Season 5 weekly summer concert series. Two of Arabic hip-hop's " +
      "biggest names together for one night of beats, bars, and crowd energy. Doors 18:00; " +
      "show 20:30. Age 14+. Tickets from AED 105. Part of Dubai Summer Surprises 2026.",
    brief_ru:
      "Марван Мусса и Хлим выступают в Hall 8, Dubai World Trade Centre в рамках " +
      "еженедельной летней концертной серии Beat The Heat DXB Season 5. Две главные звезды " +
      "арабского хип-хопа на одной сцене — вечер ритмов и энергии. Двери в 18:00; начало в 20:30. " +
      "Возраст 14+. Билеты от AED 105. Часть программы Dubai Summer Surprises 2026.",
    source_label_en: "Platinumlist · Beat The Heat official",
    source_label_ru: "Platinumlist · Beat The Heat (официально)",
    source_url:
      "https://dubai.platinumlist.net/event-tickets/107147/beat-the-heat-dxb-season-5-ft-marwan-moussa-hleem-live-at-dwtc",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url:
      "https://dubai.platinumlist.net/event-tickets/107147/beat-the-heat-dxb-season-5-ft-marwan-moussa-hleem-live-at-dwtc",
    cta_label_en: "Tickets from AED 105",
    cta_label_ru: "Билеты от AED 105",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-08-16",
    archive_action: "remove",
  },
  {
    id: "AUG-6D-06",
    date: "2026-08-22",
    label_en:
      "Beat The Heat DXB Season 5 Finale: Lege-cy, Aziz Maraka & Big Sam at DWTC Hall 8 (22 August)",
    label_ru:
      "Финал Beat The Heat DXB Season 5: Lege-cy, Aziz Maraka & Big Sam в DWTC Hall 8 (22 августа)",
    short_label_en: "Lege-cy, Aziz Maraka & Big Sam — Beat The Heat S5 Finale",
    short_label_ru: "Beat The Heat S5 Финал — DWTC",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "The finale of Beat The Heat DXB Season 5 brings together Lege-cy, Aziz Maraka, " +
      "and Big Sam at Hall 8, Dubai World Trade Centre on 22 August 2026. A blend of hip-hop, " +
      "alternative Arabic music, rock, and soul. Doors 18:00; show 20:30. " +
      "Tickets from AED 105. Part of Dubai Summer Surprises 2026.",
    brief_ru:
      "Финал Beat The Heat DXB Season 5 объединяет Lege-cy, Aziz Maraka и Big Sam " +
      "в Hall 8, Dubai World Trade Centre, 22 августа 2026 года. Сочетание хип-хопа, " +
      "альтернативной арабской музыки, рока и соула. Двери в 18:00; начало в 20:30. " +
      "Билеты от AED 105. Часть программы Dubai Summer Surprises 2026.",
    source_label_en: "Platinumlist · Beat The Heat official",
    source_label_ru: "Platinumlist · Beat The Heat (официально)",
    source_url: "https://dubai.platinumlist.net/event-tickets/107435/beat-the-heat-dxb-season-5",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubai.platinumlist.net/event-tickets/107435/beat-the-heat-dxb-season-5",
    cta_label_en: "Tickets from AED 105",
    cta_label_ru: "Билеты от AED 105",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-08-23",
    archive_action: "remove",
  },
];

// ── September items ───────────────────────────────────────────────────────────

const SEP_ITEMS: CalendarItem[] = [
  {
    id: "SEP-6D-01",
    date: "2026-09-05",
    label_en: "Mina Nader — stand-up comedy at Dubai Opera (5 September)",
    label_ru: "Мина Надер — стендап в Dubai Opera (5 сентября)",
    short_label_en: "Mina Nader at Dubai Opera",
    short_label_ru: "Мина Надер в Dubai Opera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Egyptian comedian Mina Nader brings his interactive stand-up comedy show to Dubai Opera " +
      "on 5 September 2026. Known for more than 500 sold-out shows across the Middle East, " +
      "Europe, and North America, Nader draws the audience into the performance — no two shows " +
      "are the same. The show is in Arabic. Tickets from approximately AED 200.",
    brief_ru:
      "Египетский комик Мина Надер привозит своё интерактивное стендап-шоу в Dubai Opera " +
      "5 сентября 2026 года. За карьеру — более 500 аншлаговых выступлений на Ближнем Востоке, " +
      "в Европе и Северной Америке. Особенность шоу: зрители становятся его частью — каждый " +
      "вечер неповторим. Шоу на арабском языке. Билеты от примерно AED 200.",
    source_label_en: "Dubai Opera official",
    source_label_ru: "Dubai Opera (официально)",
    source_url: "https://www.dubaiopera.com/ar/events/comedy/mina-nader",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://www.dubaiopera.com/ar/events/comedy/mina-nader",
    cta_label_en: "Dubai Opera — tickets",
    cta_label_ru: "Dubai Opera — билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-06",
    archive_action: "remove",
  },
  {
    id: "SEP-6D-03",
    date: "2026-09-20",
    label_en: "Radhika Das: Lightfall — UAE debut at Coca-Cola Arena (20 September)",
    label_ru: "Radhika Das: Lightfall — дебют в ОАЭ в Coca-Cola Arena (20 сентября)",
    short_label_en: "Radhika Das: Lightfall at Coca-Cola Arena",
    short_label_ru: "Radhika Das: Lightfall в Дубае",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en:
      "Globally acclaimed devotional artist Radhika Das makes his UAE debut at Coca-Cola Arena, " +
      "Dubai with his Lightfall concert on 20 September 2026. A live band blends traditional " +
      "instruments with contemporary sounds in an immersive experience moving between " +
      "meditative and euphoric. Doors 17:30; show 18:30. Tickets from AED 150 (Bronze) " +
      "to AED 450 (VIP).",
    brief_ru:
      "Всемирно известный музыкант-бхакти Радхика Дас дебютирует в ОАЭ в Coca-Cola Arena, " +
      "Дубай, с концертом Lightfall 20 сентября 2026 года. Живой оркестр соединяет " +
      "традиционные инструменты с современным звучанием в захватывающем переживании — " +
      "от медитативного к эйфорическому. Двери в 17:30; начало в 18:30. " +
      "Билеты от AED 150 (Bronze) до AED 450 (VIP).",
    source_label_en: "Platinumlist · Coca-Cola Arena official · Visit Dubai",
    source_label_ru: "Platinumlist · Coca-Cola Arena (официально) · Visit Dubai",
    source_url: "https://dubai.platinumlist.net/event-tickets/107296/radhika-das-lightfall",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubai.platinumlist.net/event-tickets/107296/radhika-das-lightfall",
    cta_label_en: "Tickets from AED 150",
    cta_label_ru: "Билеты от AED 150",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-21",
    archive_action: "remove",
  },
  {
    id: "SEP-6D-02",
    date: "2026-09-26",
    label_en: "Sumukhi Suresh Live in Dubai at Emirates Theatre (26 September)",
    label_ru: "Сумукхи Суреш live в Дубае — Emirates Theatre (26 сентября)",
    short_label_en: "Sumukhi Suresh at Emirates Theatre",
    short_label_ru: "Сумукхи Суреш в Дубае",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Indian stand-up comedian Sumukhi Suresh performs live at Emirates Theatre, Mall of the " +
      "Emirates on 26 September 2026. The show explores conservative roots and modern " +
      "independence with brand-new material. Mainly in English with some other languages. " +
      "Doors 19:00; show 19:30. Age 14+. Tickets from AED 100.",
    brief_ru:
      "Индийская стендап-комедиантка Сумукхи Суреш выступает в Emirates Theatre, " +
      "Mall of the Emirates, 26 сентября 2026 года. Шоу с новым материалом исследует " +
      "тему традиционных ценностей и современной независимости. Преимущественно на " +
      "английском языке. Двери в 19:00; начало в 19:30. Возраст 14+. Билеты от AED 100.",
    source_label_en: "Platinumlist",
    source_label_ru: "Platinumlist",
    source_url:
      "https://dubai.platinumlist.net/event-tickets/106978/sumukhi-suresh-live-in-dubai",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url:
      "https://dubai.platinumlist.net/event-tickets/106978/sumukhi-suresh-live-in-dubai",
    cta_label_en: "Tickets from AED 100",
    cta_label_ru: "Билеты от AED 100",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-27",
    archive_action: "remove",
  },
];

// ── October items ─────────────────────────────────────────────────────────────

const OCT_ITEMS: CalendarItem[] = [
  {
    id: "OCT-6D-01",
    date: "2026-10-02",
    label_en: "Najwa Karam live at Coca-Cola Arena, Dubai (2 October)",
    label_ru: "Наджва Карам live в Coca-Cola Arena, Дубай (2 октября)",
    short_label_en: "Najwa Karam at Coca-Cola Arena",
    short_label_ru: "Наджва Карам в Дубае",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      'Lebanese singing star Najwa Karam — known as "Shams El-Ghinnieh" (Sun of Song) — ' +
      "performs live at Coca-Cola Arena, City Walk, Dubai on Friday 2 October 2026. " +
      'Her repertoire includes "Yelaan Elboaad", "Hayda Haki", "Khallini Shoufak", and ' +
      '"Maloun Abu Eleshq". Show time: 21:00. Tickets from AED 150.',
    brief_ru:
      "Ливанская певица Наджва Карам — «Шамс аль-Гинниэ» (Солнце Песни) — выступает в " +
      "Coca-Cola Arena, City Walk, Дубай, в пятницу 2 октября 2026 года. В репертуаре: " +
      '"Yelaan Elboaad", "Hayda Haki", "Khallini Shoufak", "Maloun Abu Eleshq" и другие ' +
      "хиты. Начало: 21:00. Билеты от AED 150.",
    source_label_en: "Platinumlist · Coca-Cola Arena official",
    source_label_ru: "Platinumlist · Coca-Cola Arena (официально)",
    source_url:
      "https://dubai.platinumlist.net/event-tickets/91206/najwa-karam-live-at-coca-cola-arena-dubai",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url:
      "https://dubai.platinumlist.net/event-tickets/91206/najwa-karam-live-at-coca-cola-arena-dubai",
    cta_label_en: "Tickets from AED 150",
    cta_label_ru: "Билеты от AED 150",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-03",
    archive_action: "remove",
  },
  {
    id: "OCT-6D-05",
    date: "2026-10-03",
    label_en:
      "Bohemia Presents Lost Frequencies — Season Opening Party at FIVE Palm (3 October)",
    label_ru: "Bohemia Presents Lost Frequencies — открытие сезона в FIVE Palm (3 октября)",
    short_label_en: "Lost Frequencies at Bohemia FIVE Palm",
    short_label_ru: "Lost Frequencies в FIVE Palm",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en:
      "Belgian DJ and producer Lost Frequencies opens the Bohemia Beach Club season at FIVE " +
      'Palm Jumeirah on Saturday 3 October 2026. Known for electronic hits including ' +
      '"Are You With Me", "Reality", and "Black Friday". Doors from 19:00. Admission from ' +
      "AED 150 (includes 1 drink); VIP tables available. Beach club dress code applies.",
    brief_ru:
      "Бельгийский диджей и продюсер Lost Frequencies открывает сезон Bohemia Beach Club " +
      "в FIVE Palm Jumeirah в субботу 3 октября 2026 года. Известен электронными хитами " +
      '"Are You With Me", "Reality" и "Black Friday". Двери с 19:00. Вход от AED 150 ' +
      "(включает 1 напиток); доступны VIP-столики. Действует дресс-код пляжного клуба.",
    source_label_en: "Platinumlist · Visit Dubai",
    source_label_ru: "Platinumlist · Visit Dubai",
    source_url:
      "https://dubai.platinumlist.net/event-tickets/100424/bohemia-presents-lost-frequencies-season-opening-party",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url:
      "https://dubai.platinumlist.net/event-tickets/100424/bohemia-presents-lost-frequencies-season-opening-party",
    cta_label_en: "Tickets from AED 150",
    cta_label_ru: "Билеты от AED 150",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-04",
    archive_action: "remove",
  },
  {
    id: "OCT-6D-02",
    date: "2026-10-05",
    label_en:
      "Shawn Chidiac: Laughing in Translation Remix at Coca-Cola Arena (5 October)",
    label_ru:
      "Shawn Chidiac: Laughing in Translation Remix в Coca-Cola Arena (5 октября)",
    short_label_en: "Shawn Chidiac at Coca-Cola Arena",
    short_label_ru: "Shawn Chidiac в Дубае",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en:
      'Canadian-Lebanese comedian Shawn Chidiac performs "Laughing in Translation Remix" at ' +
      "Coca-Cola Arena, Dubai on Monday 5 October 2026. Known online as " +
      '"My Parents Are Divorced", Chidiac blends rapid-fire characters, spot-on accents, ' +
      "and sharp observations on identity, family, and diaspora life. Show 20:00. " +
      "Tickets from AED 199.",
    brief_ru:
      'Канадско-ливанский комик Шон Шидиак исполняет "Laughing in Translation Remix" в ' +
      "Coca-Cola Arena, Дубай, в понедельник 5 октября 2026 года. Известен в сети как " +
      '"My Parents Are Divorced" — молниеносные персонажи, точные акценты, наблюдения ' +
      "об идентичности и жизни диаспоры. Начало: 20:00. Билеты от AED 199.",
    source_label_en: "Coca-Cola Arena official · Platinumlist",
    source_label_ru: "Coca-Cola Arena (официально) · Platinumlist",
    source_url:
      "https://coca-cola-arena.com/comedy/1816/shawn-chidiac-live-ndash-laughing-in-translation-remix",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url:
      "https://coca-cola-arena.com/comedy/1816/shawn-chidiac-live-ndash-laughing-in-translation-remix",
    cta_label_en: "Tickets from AED 199",
    cta_label_ru: "Билеты от AED 199",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-06",
    archive_action: "remove",
  },
  {
    id: "OCT-6D-03",
    date: "2026-10-11",
    label_en:
      "TJ Monterde & KZ Tandingan — In Between Middle East Tour at Coca-Cola Arena (11 October)",
    label_ru:
      "TJ Monterde & KZ Tandingan — In Between Middle East Tour в Coca-Cola Arena (11 октября)",
    short_label_en: "TJ Monterde & KZ Tandingan at Coca-Cola Arena",
    short_label_ru: "TJ Monterde & KZ Tandingan в Дубае",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en:
      'Filipino OPM power couple TJ Monterde and KZ Tandingan bring their "In Between" Middle ' +
      "East Tour to Coca-Cola Arena, Dubai on 11 October 2026, following their historic " +
      "four-night sold-out run in the Philippines. Show 20:00. Tickets from AED 199.",
    brief_ru:
      'Филиппинская эстрадная пара TJ Monterde и KZ Tandingan привозит тур "In Between" ' +
      "на Ближний Восток в Coca-Cola Arena, Дубай, 11 октября 2026 года. После четырёх " +
      "аншлаговых ночей на Филиппинах. Начало: 20:00. Билеты от AED 199.",
    source_label_en: "Platinumlist · Coca-Cola Arena official · Visit Dubai",
    source_label_ru: "Platinumlist · Coca-Cola Arena (официально) · Visit Dubai",
    source_url:
      "https://dubai.platinumlist.net/event-tickets/106743/tj-monterde-kz-tandingan-in-between-middle-east-tour",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url:
      "https://dubai.platinumlist.net/event-tickets/106743/tj-monterde-kz-tandingan-in-between-middle-east-tour",
    cta_label_en: "Tickets from AED 199",
    cta_label_ru: "Билеты от AED 199",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-12",
    archive_action: "remove",
  },
  {
    id: "OCT-6D-04",
    date: "2026-10-18",
    label_en: "Vir Das — Dubai Comedy Festival 2026 at Coca-Cola Arena (18 October)",
    label_ru: "Vir Das — Dubai Comedy Festival 2026 в Coca-Cola Arena (18 октября)",
    short_label_en: "Vir Das at Dubai Comedy Festival",
    short_label_ru: "Vir Das — Dubai Comedy Festival",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "International Emmy Award-winning Indian comedian Vir Das closes Dubai Comedy Festival " +
      "2026 with a headline show at Coca-Cola Arena on 18 October 2026. Known for Netflix " +
      'specials including the Emmy-winning "Landing" and "Fool Volume" — sharp observations ' +
      "on culture, identity, and contemporary life. Show 20:00. Age 16+. Tickets from AED 195.",
    brief_ru:
      "Обладатель международного «Эмми», индийский комик Вир Дас завершает Dubai Comedy " +
      "Festival 2026 хэдлайнерским шоу в Coca-Cola Arena 18 октября 2026 года. " +
      'Известен по Netflix-специалям — удостоенному «Эмми» "Landing" и "Fool Volume". ' +
      "Остроумные наблюдения о культуре, идентичности и современной жизни. " +
      "Начало: 20:00. Возраст 16+. Билеты от AED 195.",
    source_label_en:
      "Visit Dubai · Coca-Cola Arena official · Dubai Comedy Festival official",
    source_label_ru:
      "Visit Dubai · Coca-Cola Arena (официально) · Dubai Comedy Festival (официально)",
    source_url: "https://dubaicomedyfestival.platinumlist.net/",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubaicomedyfestival.platinumlist.net/",
    cta_label_en: "Dubai Comedy Festival — tickets",
    cta_label_ru: "Dubai Comedy Festival — билеты",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-19",
    archive_action: "remove",
  },
];

// ── Run ───────────────────────────────────────────────────────────────────────

console.log("\n── Richard Marx P0 fix ─────────────────────────────────────────────");
fixRichardMarx();

console.log("\n── August 2026 additions ───────────────────────────────────────────");
insertItems("august-2026-dubai-calendar", AUG_ITEMS);

console.log("\n── September 2026 additions ────────────────────────────────────────");
insertItems("september-2026-dubai-calendar", SEP_ITEMS);

console.log("\n── October 2026 additions ──────────────────────────────────────────");
insertItems("october-2026-dubai-calendar", OCT_ITEMS);

db.close();

const integ2 = (() => {
  const db2 = new Database(DB_PATH);
  const r = (db2.prepare("PRAGMA integrity_check").get() as { integrity_check: string })
    .integrity_check;
  db2.close();
  return r;
})();
if (integ2 !== "ok") throw new Error(`integrity_check post-patch: ${integ2}`);
console.log(`\n✓ integrity_check post-patch: ${integ2}`);
console.log("✓ Phase 6D Batch-02 patch applied.");

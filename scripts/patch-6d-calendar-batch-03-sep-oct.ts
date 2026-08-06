/**
 * Phase 6D Batch-03: Sep/Oct sweep — Boris Grebenshikov date fix + 8 new calendar items.
 *
 * Run on production: npx tsx scripts/patch-6d-calendar-batch-03-sep-oct.ts
 *
 * Idempotent: second run skips all existing items. Creates a timestamped backup first.
 *
 * Fixes:
 *   OCT-R2 Boris Grebenshikov: date 2026-10-24 → 2026-10-29 (T1: The Agenda official)
 *
 * New September:
 *   SEP-NEW-DEKA: DEKA FIT Dubai, Sep 26, Coca-Cola Arena (Visit Dubai T1)
 *
 * New October:
 *   OCT-NEW-DHF:      Dubai Home Festival 2026, Oct 16-Nov 1 (Visit Dubai T1)
 *   OCT-NEW-MARILYNE: Marilyne Naaman, Oct 6, Dubai Opera (Dubai Opera + Platinumlist T1)
 *   OCT-NEW-MUNAWAR:  Munawar Faruqui, Oct 11, Dubai Opera (Platinumlist + Visit Dubai T1)
 *   OCT-NEW-GILLIGAN: Mo Gilligan, Oct 12, Dubai Opera (Dubai Opera official T1)
 *   OCT-NEW-ACHKAR:   John Achkar, Oct 17, Dubai Opera (Visit Dubai + Dubai Opera T1)
 *   OCT-NEW-GIPSY:    Gipsy Kings Symphonic, Oct 22, Dubai Opera (Platinumlist + Dubai Opera T1)
 *   OCT-NEW-MELADZE:  Valery Meladze, Oct 25, The Agenda (Platinumlist + The Agenda T1)
 */

import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");
const BACKUP_DIR = path.join(process.cwd(), "backups", "local");

interface CalendarDateItem {
  id?: string;
  date: string;
  label_en: string;
  label_ru: string;
  short_label_en?: string;
  short_label_ru?: string;
  type: string;
  confidence: string;
  priority?: number;
  detail_url?: string | null;
  brief_en?: string;
  brief_ru?: string;
  source_label_en?: string;
  source_label_ru?: string;
  source_url?: string;
  source_status?: string;
  cta_type?: string;
  cta_url?: string;
  cta_label_en?: string;
  cta_label_ru?: string;
  emirate?: string;
  risk_level?: string;
  lifecycle?: string;
  noindex_after?: string;
  archive_action?: string;
}

// ─── Backup ──────────────────────────────────────────────────────────────────

function backupDb(): string {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dest = path.join(BACKUP_DIR, `guides.db.pre-batch03-6d-${ts}`);
  fs.copyFileSync(DB_PATH, dest);
  const size = fs.statSync(dest).size;
  const md5  = crypto.createHash("md5").update(fs.readFileSync(dest)).digest("hex");
  console.log(`  Backup: ${path.basename(dest)}  (${size} bytes, md5=${md5})`);
  return dest;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadDates(db: Database.Database, slug: string): CalendarDateItem[] {
  const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(slug) as { dates_json: string } | undefined;
  if (!row) throw new Error(`Calendar page not found: ${slug}`);
  return JSON.parse(row.dates_json) as CalendarDateItem[];
}

function saveDates(db: Database.Database, slug: string, dates: CalendarDateItem[]): void {
  db.prepare(
    "UPDATE calendar_pages SET dates_json=?, updated_at=datetime('now') WHERE slug=?"
  ).run(JSON.stringify(dates), slug);
}

function idsPresent(dates: CalendarDateItem[]): Set<string> {
  return new Set(dates.map((d) => d.id).filter(Boolean) as string[]);
}

// ─── New item definitions ─────────────────────────────────────────────────────

const NEW_SEPTEMBER_ITEMS: CalendarDateItem[] = [
  {
    id: "SEP-NEW-DEKA",
    date: "2026-09-26",
    label_en: "DEKA FIT Dubai 2026 at Coca-Cola Arena (26 September)",
    label_ru: "DEKA FIT Dubai 2026 в Coca-Cola Arena (26 сентября)",
    short_label_en: "DEKA FIT Dubai",
    short_label_ru: "DEKA FIT Dubai",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en:
      "DEKA FIT Dubai 2026, the globally recognised functional fitness challenge, takes place at Coca-Cola Arena on Saturday 26 September 2026. Participants complete 3 km of obstacles across 10 zones testing strength, endurance and agility. Doors open 7:00 AM. Tickets AED 340–440.",
    brief_ru:
      "DEKA FIT Dubai 2026 — международное испытание функциональной физической подготовки — проходит в Coca-Cola Arena в субботу 26 сентября 2026 года. Участники преодолевают 3 км из 10 зон-препятствий. Начало в 7:00. Билеты AED 340–440.",
    source_label_en: "Visit Dubai · official DEKA FIT event page",
    source_label_ru: "Visit Dubai · официальная страница DEKA FIT",
    source_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/deka-fit-dubai-2026",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/deka-fit-dubai-2026",
    cta_label_en: "Event info",
    cta_label_ru: "Информация",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-09-27",
    archive_action: "remove",
  },
];

const NEW_OCTOBER_ITEMS: CalendarDateItem[] = [
  {
    id: "OCT-NEW-DHF",
    date: "2026-10-16",
    label_en: "Dubai Home Festival 2026 begins (16 October – 1 November)",
    label_ru: "Dubai Home Festival 2026 начинается (16 октября – 1 ноября)",
    short_label_en: "Dubai Home Festival",
    short_label_ru: "Dubai Home Festival",
    type: "trade_show",
    confidence: "confirmed",
    priority: 3,
    detail_url: null,
    brief_en:
      "Dubai Home Festival (DHF) 2026 runs 16 October – 1 November across Dubai's furniture, home decor and lifestyle stores. The citywide retail event offers up to 75% discounts on homeware and interior design items, with prize draws and exclusive deals at participating retailers.",
    brief_ru:
      "Dubai Home Festival 2026 проходит с 16 октября по 1 ноября по всему Дубаю. Городской шопинг-фестиваль мебели, декора и товаров для дома: скидки до 75%, розыгрыши призов и специальные предложения в магазинах-участниках.",
    source_label_en: "Visit Dubai · Dubai Home Festival official page",
    source_label_ru: "Visit Dubai · официальная страница Dubai Home Festival",
    source_url: "https://www.visitdubai.com/en/festivals-and-events/dhf",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.visitdubai.com/en/festivals-and-events/dhf",
    cta_label_en: "Festival info",
    cta_label_ru: "О фестивале",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_recurring",
    noindex_after: "2026-11-02",
    archive_action: "keep",
  },
  {
    id: "OCT-NEW-MARILYNE",
    date: "2026-10-06",
    label_en: "Marilyne Naaman live at Dubai Opera (6 October 2026)",
    label_ru: "Марилин Нааман live в Dubai Opera (6 октября 2026)",
    short_label_en: "Marilyne Naaman at Dubai Opera",
    short_label_ru: "Марилин Нааман в Dubai Opera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Lebanese singer Marilyne Naaman performs live at Dubai Opera on Tuesday 6 October 2026. Known for her emotive vocals and rich contemporary Arabic music, she brings an intimate evening to the Main Auditorium. Show starts 8:00 PM. Tickets from AED 295.",
    brief_ru:
      "Ливанская певица Марилин Нааман выступает в Dubai Opera во вторник 6 октября 2026 года. Вечер арабской музыки — тонкий вокал, современный репертуар. Начало в 20:00. Билеты от AED 295.",
    source_label_en: "Dubai Opera official · Platinumlist",
    source_label_ru: "Dubai Opera (официально) · Platinumlist",
    source_url: "https://dubai.platinumlist.net/event-tickets/marilyn-naaman-at-dubai-opera",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubai.platinumlist.net/event-tickets/marilyn-naaman-at-dubai-opera",
    cta_label_en: "Tickets from AED 295",
    cta_label_ru: "Билеты от AED 295",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-07",
    archive_action: "remove",
  },
  {
    id: "OCT-NEW-MUNAWAR",
    date: "2026-10-11",
    label_en: "Munawar Faruqui live at Dubai Opera — Dubai Comedy Festival (11 October)",
    label_ru: "Мунавар Фаруки live в Dubai Opera — Dubai Comedy Festival (11 октября)",
    short_label_en: "Munawar Faruqui at Dubai Opera",
    short_label_ru: "Мунавар Фаруки в Dubai Opera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Munawar Faruqui performs at Dubai Opera as part of Dubai Comedy Festival 2026 on Sunday 11 October. Doors open 6:00 PM, show starts 6:30 PM. Approximately 90 minutes, no intermission. Tickets from AED 125.",
    brief_ru:
      "Мунавар Фаруки выступает в Dubai Opera в рамках Dubai Comedy Festival 2026 в воскресенье 11 октября. Двери открываются в 18:00, начало в 18:30. Продолжительность около 90 минут. Билеты от AED 125.",
    source_label_en: "Platinumlist · Visit Dubai · Dubai Comedy Festival official",
    source_label_ru: "Platinumlist · Visit Dubai · Dubai Comedy Festival",
    source_url: "https://dubai.platinumlist.net/event-tickets/106537/munawar-faruqui-live-at-dubai-comedy-festival",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubai.platinumlist.net/event-tickets/106537/munawar-faruqui-live-at-dubai-comedy-festival",
    cta_label_en: "Tickets from AED 125",
    cta_label_ru: "Билеты от AED 125",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-12",
    archive_action: "remove",
  },
  {
    id: "OCT-NEW-GILLIGAN",
    date: "2026-10-12",
    label_en: "Mo Gilligan 'The Mo You Know' Tour at Dubai Opera (12 October)",
    label_ru: "Mo Gilligan 'The Mo You Know' Tour в Dubai Opera (12 октября)",
    short_label_en: "Mo Gilligan at Dubai Opera",
    short_label_ru: "Mo Gilligan в Dubai Opera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "British comedian Mo Gilligan brings his brand-new stand-up show 'The Mo You Know World Tour 2026' to Dubai Opera on Monday 12 October, part of Dubai Comedy Festival (9–18 Oct). Doors 6:00 PM, show 6:30 PM. Approx 90 mins. 16+ only. Tickets from AED 250.",
    brief_ru:
      "Британский комик Мо Гиллиган привозит новое шоу 'The Mo You Know World Tour 2026' в Dubai Opera в понедельник 12 октября, в рамках Dubai Comedy Festival (9–18 окт). Двери в 18:00, шоу в 18:30. 16+. Билеты от AED 250.",
    source_label_en: "Dubai Opera official · Platinumlist · What's On",
    source_label_ru: "Dubai Opera (официально) · Platinumlist",
    source_url: "https://www.dubaiopera.com/en/events/comedy/mo-gilligan-live-at-dubai-comedy-festival",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.dubaiopera.com/en/events/comedy/mo-gilligan-live-at-dubai-comedy-festival",
    cta_label_en: "Tickets from AED 250 (16+)",
    cta_label_ru: "Билеты от AED 250 (16+)",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-13",
    archive_action: "remove",
  },
  {
    id: "OCT-NEW-ACHKAR",
    date: "2026-10-17",
    label_en: "John Achkar 'Feena Nehke' at Dubai Opera — Dubai Comedy Festival (17 Oct)",
    label_ru: "Джон Ашкар 'Feena Nehke' в Dubai Opera — Dubai Comedy Festival (17 окт)",
    short_label_en: "John Achkar at Dubai Opera",
    short_label_ru: "Джон Ашкар в Dubai Opera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Lebanese comedian John Achkar performs 'Feena Nehke' at Dubai Opera on Saturday 17 October as part of Dubai Comedy Festival. The show blends personal stories, family observations and relatable moments — performed in Arabic. Doors 6:00 PM, show 6:30 PM. 13+. Tickets AED 185–415.",
    brief_ru:
      "Ливанский комик Джон Ашкар представляет шоу 'Feena Nehke' в Dubai Opera в субботу 17 октября в рамках Dubai Comedy Festival. Выступление на арабском языке: личные истории, семейный юмор. 13+. Билеты AED 185–415.",
    source_label_en: "Visit Dubai · Dubai Opera official · Dubai Comedy Festival",
    source_label_ru: "Visit Dubai · Dubai Opera (официально)",
    source_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/john-achkar-dcf",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/john-achkar-dcf",
    cta_label_en: "Tickets AED 185–415 (13+)",
    cta_label_ru: "Билеты AED 185–415 (13+)",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-18",
    archive_action: "remove",
  },
  {
    id: "OCT-NEW-GIPSY",
    date: "2026-10-22",
    label_en: "Gipsy Kings Symphonic by André Reyes at Dubai Opera (22 October)",
    label_ru: "Gipsy Kings Symphonic by André Reyes в Dubai Opera (22 октября)",
    short_label_en: "Gipsy Kings Symphonic at Dubai Opera",
    short_label_ru: "Gipsy Kings Symphonic в Dubai Opera",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Gipsy Kings by André Reyes return to Dubai Opera on Thursday 22 October 2026 with a special symphonic performance alongside the UAE Philharmonic Orchestra. Expect Bamboleo, Volare and classic Gipsy Kings hits in an orchestral setting. Show starts 8:00 PM. Tickets from AED 395.",
    brief_ru:
      "Gipsy Kings by André Reyes выступают в Dubai Opera 22 октября 2026 года в симфоническом формате совместно с UAE Philharmonic Orchestra. Bamboleo, Volare и классика группы в оркестровом звучании. Начало в 20:00. Билеты от AED 395.",
    source_label_en: "Dubai Opera official · Platinumlist · Gulf News",
    source_label_ru: "Dubai Opera (официально) · Platinumlist · Gulf News",
    source_url: "https://www.dubaiopera.com/en-US/product-details?ID=a2b31b4d-45ae-f011-bbd3-002248d321c0",
    source_status: "confirmed",
    cta_type: "open_source",
    cta_url: "https://www.dubaiopera.com/en-US/product-details?ID=a2b31b4d-45ae-f011-bbd3-002248d321c0",
    cta_label_en: "Tickets from AED 395",
    cta_label_ru: "Билеты от AED 395",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-23",
    archive_action: "remove",
  },
  {
    id: "OCT-NEW-MELADZE",
    date: "2026-10-25",
    label_en: "Valery Meladze live at The Agenda, Dubai (25 October 2026)",
    label_ru: "Валерий Меладзе live в The Agenda, Дубай (25 октября 2026)",
    short_label_en: "Valery Meladze at The Agenda",
    short_label_ru: "Меладзе в The Agenda",
    type: "trade_show",
    confidence: "confirmed",
    priority: 2,
    detail_url: null,
    brief_en:
      "Russian pop star Valery Meladze performs live at The Agenda (Dubai Media City) on Sunday 25 October 2026. Doors open 7:00 PM, concert starts 8:00 PM. Age policy: 21+. Tickets from AED 300.",
    brief_ru:
      "Валерий Меладзе выступает live в The Agenda (Dubai Media City) в воскресенье 25 октября 2026 года. Двери в 19:00, начало концерта в 20:00. Возраст: 21+. Билеты от AED 300.",
    source_label_en: "Platinumlist · The Agenda official",
    source_label_ru: "Platinumlist · The Agenda (официально)",
    source_url: "https://dubai.platinumlist.net/event-tickets/92918/meladze-live-at-the-agenda-dubai",
    source_status: "confirmed",
    cta_type: "ticket",
    cta_url: "https://dubai.platinumlist.net/event-tickets/92918/meladze-live-at-the-agenda-dubai",
    cta_label_en: "Tickets from AED 300 (21+)",
    cta_label_ru: "Билеты от AED 300 (21+)",
    emirate: "Dubai",
    risk_level: "low",
    lifecycle: "event_fixed",
    noindex_after: "2026-10-26",
    archive_action: "remove",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Phase 6D Batch-03 production patch ===");

  console.log("\n[1] Backup...");
  backupDb();

  const db = new Database(DB_PATH);

  console.log("\n[2] Integrity check...");
  const ic = db.pragma("integrity_check", { simple: true }) as string;
  if (ic !== "ok") throw new Error(`integrity_check FAILED: ${ic}`);
  console.log("  integrity_check: ok");

  console.log("\n[3] Load September calendar...");
  const sepDates = loadDates(db, "september-2026-dubai-calendar");
  const sepIds   = idsPresent(sepDates);
  console.log(`  Current September items: ${sepDates.length}`);

  console.log("\n[4] Load October calendar...");
  const octDates = loadDates(db, "october-2026-dubai-calendar");
  const octIds   = idsPresent(octDates);
  console.log(`  Current October items: ${octDates.length}`);

  let sepAdded = 0, octAdded = 0, octFixed = 0;

  console.log("\n[5] Fix Boris Grebenshikov OCT-R2: 2026-10-24 → 2026-10-29...");
  const boris = octDates.find((d) => d.id === "OCT-R2");
  if (!boris) {
    console.log("  WARN: OCT-R2 not found");
  } else if (boris.date === "2026-10-24") {
    boris.date = "2026-10-29";
    boris.label_en = "Boris Grebenshikov (BG+) live at The Agenda, Dubai Media City (29 October 2026)";
    boris.label_ru = "Борис Гребенщиков (BG+) в The Agenda, Dubai Media City (29 октября 2026)";
    boris.brief_en = (boris.brief_en ?? "").replace(/24 October/g, "29 October");
    boris.brief_ru = (boris.brief_ru ?? "").replace(/24 октября/g, "29 октября");
    boris.noindex_after = "2026-10-30";
    octFixed++;
    console.log("  FIXED OCT-R2 → 2026-10-29");
  } else {
    console.log(`  SKIP OCT-R2: date already ${boris.date} (idempotent)`);
  }

  console.log("\n[6] Add new September items...");
  for (const item of NEW_SEPTEMBER_ITEMS) {
    if (sepIds.has(item.id!)) {
      console.log(`  SKIP ${item.id} (already exists)`);
    } else {
      sepDates.push(item);
      sepIds.add(item.id!);
      sepAdded++;
      console.log(`  ADD ${item.id}: ${item.label_en.slice(0, 60)}`);
    }
  }

  console.log("\n[7] Add new October items...");
  for (const item of NEW_OCTOBER_ITEMS) {
    if (octIds.has(item.id!)) {
      console.log(`  SKIP ${item.id} (already exists)`);
    } else {
      octDates.push(item);
      octIds.add(item.id!);
      octAdded++;
      console.log(`  ADD ${item.id}: ${item.label_en.slice(0, 60)}`);
    }
  }

  console.log("\n[8] Write September calendar...");
  saveDates(db, "september-2026-dubai-calendar", sepDates);

  console.log("\n[9] Write October calendar...");
  saveDates(db, "october-2026-dubai-calendar", octDates);

  console.log("\n[10] Post-assertions...");
  const sepVerify = loadDates(db, "september-2026-dubai-calendar");
  const octVerify = loadDates(db, "october-2026-dubai-calendar");
  console.log(`  September items: ${sepVerify.length}`);
  console.log(`  October items: ${octVerify.length}`);

  const borisVerify = octVerify.find((d) => d.id === "OCT-R2");
  if (borisVerify && borisVerify.date !== "2026-10-29") throw new Error(`Boris date wrong: ${borisVerify.date}`);
  if (borisVerify) console.log(`  OCT-R2 date confirmed: ${borisVerify.date}`);

  const sepVerifyIds = idsPresent(sepVerify);
  for (const item of NEW_SEPTEMBER_ITEMS) {
    if (!sepVerifyIds.has(item.id!)) throw new Error(`Missing: ${item.id}`);
  }
  const octVerifyIds = idsPresent(octVerify);
  for (const item of NEW_OCTOBER_ITEMS) {
    if (!octVerifyIds.has(item.id!)) throw new Error(`Missing: ${item.id}`);
  }
  console.log(`  All new IDs present: ${sepAdded + octAdded} new`);

  const ic2 = db.pragma("integrity_check", { simple: true }) as string;
  if (ic2 !== "ok") throw new Error(`Post-write integrity_check FAILED: ${ic2}`);
  console.log("  Post-write integrity_check: ok");

  db.close();

  console.log(`\n=== Batch-03 patch complete ===`);
  console.log(`  September: +${sepAdded} new`);
  console.log(`  October:   +${octAdded} new, ${octFixed} date fix`);
  console.log(`  Total:     +${sepAdded + octAdded} new, ${octFixed} fix`);
}

main().catch((err) => { console.error(err); process.exit(1); });

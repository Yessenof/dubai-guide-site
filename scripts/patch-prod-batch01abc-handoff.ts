/**
 * Phase 6C-CALENDAR-UNIVERSE-BATCH-01ABC — Production Handoff Patch
 *
 * Applies all three DB mutations required to bring production up to Batch 01ABC end state:
 *
 * A) Etihad Rail guide (slug: etihad-rail-uae) + 5 steps
 *    — Insert if absent. Skip if already in final state. Abort if in unknown state.
 *
 * B) AUG-NEW-02 (Mawlid Al Nabi 2026) — combined Batch-01B + FIX-01 final state
 *    — Accepts production from either pre-Batch-01B (date=2026-08-24) or mid-state.
 *    — Brings to final FIX-01 state: date=2026-08-25, u.ae source, concise labels.
 *    — Abort if confidence != "expected" (means official announcement received).
 *
 * C) July 2026 live events — insert JUL-NEW-04, JUL-NEW-05, JUL-NEW-06, JUL-NEW-07
 *    — Skip if all 4 already present in final state.
 *    — Abort if partial state (some but not all present).
 *
 * Safe to run:
 *  - When production DB is in pre-Batch-01ABC state (expected production state)
 *  - When already fully applied (idempotent exit)
 *  - NOT safe when individual patches are in unknown intermediate states
 *
 * Run: npx tsx scripts/patch-prod-batch01abc-handoff.ts
 */

import Database from "better-sqlite3";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";

const DB_PATH    = path.resolve(__dirname, "../data/guides.db");
const BACKUP_DIR = path.resolve(__dirname, "../backups/local");

// ── Helpers ────────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function sha256(filePath: string): string {
  const buf = readFileSync(filePath);
  return createHash("sha256").update(buf).digest("hex");
}

function backup(db_path: string): string {
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dest = path.join(BACKUP_DIR, `guides.db.pre-prod-batch01abc-${ts}`);
  copyFileSync(db_path, dest);
  return dest;
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  Batch 01ABC Production Handoff Patch                 ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");

  // Backup
  const backupPath = backup(DB_PATH);
  const preHash    = sha256(DB_PATH);
  console.log(`✓ Backup: ${backupPath}`);
  console.log(`  Pre-patch SHA-256: ${preHash}\n`);

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  // ── A) Etihad Rail guide ───────────────────────────────────────────────

  console.log("── Section A: Etihad Rail guide ──────────────────────────");
  patchEtihadRail(db);

  // ── B) AUG-NEW-02 Mawlid final state ──────────────────────────────────

  console.log("\n── Section B: AUG-NEW-02 Mawlid (Batch-01B + FIX-01) ────");
  patchMawlid(db);

  // ── C) July 2026 live events ───────────────────────────────────────────

  console.log("\n── Section C: July 2026 live events ──────────────────────");
  patchJulyEvents(db);

  // ── Final integrity check ──────────────────────────────────────────────

  console.log("\n── Final checks ──────────────────────────────────────────");
  const ic = (db.prepare("PRAGMA integrity_check").get() as Row)["integrity_check"];
  if (ic !== "ok") throw new Error(`ASSERT: integrity_check returned "${ic}"`);
  console.log("  integrity_check: ok ✓");

  db.close();

  const postHash = sha256(DB_PATH);
  console.log(`  Post-patch SHA-256: ${postHash}`);

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  All patches applied. DB ready for production deploy.  ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
}

// ── A: Etihad Rail ─────────────────────────────────────────────────────────

function patchEtihadRail(db: Database.Database) {
  const SLUG     = "etihad-rail-uae";
  const GUIDE_ID = "etihad-rail-uae-001";
  const EN_TITLE = "How to Book and Ride Etihad Rail in the UAE";

  const existing = db.prepare("SELECT id, slug, published, en_title FROM guides WHERE slug=?").get(SLUG) as Row | undefined;

  if (existing) {
    if (existing.en_title === EN_TITLE && existing.published === 1) {
      console.log(`  ⚠ Etihad Rail guide already present (${existing.id}). Verifying steps...`);
      const stepCount = (db.prepare("SELECT COUNT(*) as n FROM steps WHERE guide_id=?").get(GUIDE_ID) as Row).n;
      if (stepCount !== 5) throw new Error(`ASSERT: expected 5 steps, found ${stepCount}`);
      console.log(`  ⚠ Already in final state (5 steps). Skipping insertion.`);
      return;
    }
    throw new Error(`ABORT: guide slug '${SLUG}' exists but en_title doesn't match final state. Manual inspection required.`);
  }

  // Insert guide
  db.prepare(`
    INSERT INTO guides (
      id, slug, category, published, price, timeline, last_updated, created_at, updated_at,
      en_title, en_summary, en_audience, en_overview,
      ru_title, ru_summary, ru_audience, ru_overview
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'),
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `).run(
    GUIDE_ID, SLUG, "living", 1,
    "AED 55–150 per trip (Comfort and Premium, 50% launch discount active July 2026; regular fares AED 109–299)",
    "1 hour 45 minutes (Abu Dhabi to Fujairah, non-stop)",
    "July 2026",
    EN_TITLE,
    "Etihad Rail launched its first passenger service on June 30, 2026, connecting Abu Dhabi (Mohamed bin Zayed City) to Fujairah (Al Hilal City) in 1 hour 45 minutes. This guide covers how to check routes, choose your class, book a ticket, and board your train.",
    "UAE residents and visitors planning to travel between Abu Dhabi, Fujairah, and — from September 2026 — Dubai and Al Dhaid via Etihad Rail's expanding network.",
    "Etihad Rail opened its first passenger service on June 30, 2026, running non-stop between Abu Dhabi's Mohamed bin Zayed City Station and Fujairah's Al Hilal City Station. The journey takes 1 hour 45 minutes — the same route by car takes around 2 hours without traffic. Phase 2 will connect Dubai (Al Quoz station, opening September 30, 2026) and Al Dhaid (Sharjah emirate). Phase 3 will add a Sharjah station by March 2027, completing the UAE passenger rail network.\n\nTicketing is available at etihad-rail.ae, through the official app, or at station counters. Two travel classes exist: Comfort (standard seating with free Wi-Fi, onboard trolley service, and a luggage allowance of 20 kg + 7 kg carry-on) and Premium (wider seats, dedicated lounge access at stations, and premium onboard service). A 50% launch discount is active as of July 2026 — Comfort Standard tickets start at AED 55 one-way. The full booking, check-in, and boarding process takes under 20 minutes in total.",
    "Как купить билет и поехать на поезде Etihad Rail в ОАЭ",
    "Etihad Rail запустил пассажирские перевозки 30 июня 2026 года: маршрут Абу-Даби (Мохамед бин Зайед Сити) — Фуджейра (Аль-Хилал Сити), 1 час 45 минут. Гид охватывает маршруты, классы, покупку билета и посадку.",
    "Жители ОАЭ и туристы, планирующие поездку между Абу-Даби, Фуджейрой и — с сентября 2026 — Дубаем и Аль-Дхайдом по сети Etihad Rail.",
    "Etihad Rail открыл пассажирское сообщение 30 июня 2026 года. Первый маршрут — Абу-Даби (станция Мохамед бин Зайед Сити) — Фуджейра (станция Аль-Хилал Сити), время в пути 1 час 45 минут. На машине по тому же маршруту — около 2 часов без пробок. Вторая очередь откроет Дубай (станция Аль-Куоз, 30 сентября 2026) и Аль-Дхайд (эмират Шарджа). Третья очередь — станция Шарджа к марту 2027 года.\n\nБилеты — на сайте etihad-rail.ae, в мобильном приложении или в кассе на станции. Два класса: Comfort (стандартные кресла, бесплатный Wi-Fi, тележка с едой, багаж 20 кг + 7 кг ручной) и Premium (увеличенные кресла, доступ в зал ожидания, улучшенный сервис). Скидка 50% на старте — по состоянию на июль 2026 года, Comfort Standard от 55 AED в одну сторону.",
  );
  console.log(`  ✓ Guide inserted: ${GUIDE_ID}`);

  // Insert 5 steps
  const steps = [
    {
      id: "etihad-rail-step-01", order: 1,
      cost: "Free", time_est: "5 minutes",
      en_title: "Check routes and timetable",
      en_what: "Etihad Rail currently runs Abu Dhabi (Mohamed bin Zayed City) to Fujairah (Al Hilal City). No other passenger routes operate as of July 2026. Dubai (Al Quoz) opens September 30, 2026.",
      en_where: "etihad-rail.ae",
      en_address: "etihad-rail.ae (official website and mobile app)",
      en_advice: "Abu Dhabi departures: 8:19am, 1:53pm, 6:39pm. Fujairah departures: 5:34am, 10:59am, 5:28pm. Schedules may update — check the app before you travel.",
      en_warning: "",
      ru_title: "Проверьте маршруты и расписание",
      ru_what: "Etihad Rail сейчас работает только между Абу-Даби (Мохамед бин Зайед Сити) и Фуджейрой (Аль-Хилал Сити). Другие пассажирские маршруты с июля 2026 не работают. Дубай (Аль-Куоз) открывается 30 сентября 2026.",
      ru_where: "etihad-rail.ae",
      ru_address: "etihad-rail.ae (сайт и мобильное приложение)",
      ru_advice: "Расписание из Абу-Даби: 8:19, 13:53, 18:39. Из Фуджейры: 5:34, 10:59, 17:28. Расписание может меняться — проверяйте в приложении перед поездкой.",
      ru_warning: "",
    },
    {
      id: "etihad-rail-step-02", order: 2,
      cost: "Comfort Standard: AED 55 (discounted) / AED 109 (regular). Comfort Value: AED 65 / AED 129. Premium: AED 150 (discounted) / AED 299 (regular). 50% launch discount active July 2026.",
      time_est: "5 minutes",
      en_title: "Choose class and fare",
      en_what: "Two travel classes available. Comfort Class is standard seating with free Wi-Fi and onboard trolley service. Premium Class offers wider seats, lounge access at stations, and premium onboard service. Within Comfort, two price tiers exist: Standard and Value — Value includes a reserved meal.",
      en_where: "etihad-rail.ae",
      en_address: "etihad-rail.ae",
      en_advice: "Both classes include free Wi-Fi. Premium is closer to business-class comfort — worth it for the Abu Dhabi–Fujairah run if you're travelling for work. Comfort Standard is the best-value fare for most travellers.",
      en_warning: "The 50% launch discount is a promotional offer and will not last permanently. Book at current prices before the promotion ends.",
      ru_title: "Выберите класс и тариф",
      ru_what: "Два класса. Comfort — стандартные сиденья, бесплатный Wi-Fi, тележка с едой и напитками на борту. Premium — увеличенные кресла, доступ в зал ожидания на станциях, улучшенный сервис. В Comfort — два варианта: Standard и Value (включает заранее выбранное питание).",
      ru_where: "etihad-rail.ae",
      ru_address: "etihad-rail.ae",
      ru_advice: "В обоих классах бесплатный Wi-Fi. Premium ближе к бизнес-классу — особенно выгоден для деловых поездок. Comfort Standard — лучший выбор по соотношению цены и качества.",
      ru_warning: "Скидка 50% — это промоакция запуска, она не будет действовать постоянно. Бронируйте по текущим ценам, пока акция действует.",
    },
    {
      id: "etihad-rail-step-03", order: 3,
      cost: "Included in ticket price",
      time_est: "5 minutes online",
      en_title: "Book your seat",
      en_what: "Book at etihad-rail.ae, through the Etihad Rail mobile app (Android and iOS), or at the ticket counter at any Etihad Rail station.",
      en_where: "etihad-rail.ae · mobile app · station counter",
      en_address: "etihad-rail.ae — download the app from App Store or Google Play",
      en_advice: "Online and app booking is fastest and gives access to all fare tiers. Station counters are open but may have queues. You can book up to 90 days in advance.",
      en_warning: "",
      ru_title: "Купите билет",
      ru_what: "Бронирование — на сайте etihad-rail.ae, в мобильном приложении Etihad Rail (Android и iOS) или в кассе на станции.",
      ru_where: "etihad-rail.ae · мобильное приложение · касса на станции",
      ru_address: "etihad-rail.ae — приложение в App Store и Google Play",
      ru_advice: "Онлайн-бронирование и приложение дают доступ ко всем тарифам. Кассы на станции работают, но могут быть очереди. Бронирование доступно за 90 дней.",
      ru_warning: "",
    },
    {
      id: "etihad-rail-step-04", order: 4,
      cost: "Transport to station (taxi or Careem — separate cost)",
      time_est: "Allow 20–30 minutes before departure",
      en_title: "Get to your station",
      en_what: "The Abu Dhabi departure station is in Mohamed bin Zayed City. The Fujairah station is in Al Hilal City. Neither station is currently served by public buses — plan for a taxi or Careem.",
      en_where: "Mohamed bin Zayed City (Abu Dhabi) · Al Hilal City (Fujairah)",
      en_address: "Mohamed bin Zayed City Station, Abu Dhabi · Al Hilal City Station, Fujairah",
      en_advice: "Arrive at least 20 minutes before your train. Station facilities include parking, a waiting area, and basic F&B.",
      en_warning: "",
      ru_title: "Доберитесь до станции",
      ru_what: "Станция в Абу-Даби — в районе Мохамед бин Зайед Сити. В Фуджейре — в Аль-Хилал Сити. Общественный транспорт до станций пока не организован — добираться на такси или Careem.",
      ru_where: "Мохамед бин Зайед Сити (Абу-Даби) · Аль-Хилал Сити (Фуджейра)",
      ru_address: "Станция Мохамед бин Зайед Сити, Абу-Даби · Станция Аль-Хилал Сити, Фуджейра",
      ru_advice: "Приезжайте минимум за 20 минут до отправления. На станциях есть парковки, зоны ожидания и базовое питание.",
      ru_warning: "",
    },
    {
      id: "etihad-rail-step-05", order: 5,
      cost: "Included in ticket",
      time_est: "1 hour 45 minutes (Abu Dhabi to Fujairah, non-stop)",
      en_title: "Check in and board",
      en_what: "Present your booking confirmation — digital (on your phone) or printed — at the gate or platform barriers. There is no separate check-in process; show your ticket at the turnstile.",
      en_where: "Etihad Rail station platform",
      en_address: "Your departure station",
      en_advice: "Store luggage in the overhead compartment or the designated luggage area at the end of the carriage. No large-item storage in the aisle.",
      en_warning: "Trains depart on time. There is no boarding after departure is announced.",
      ru_title: "Пройдите на посадку",
      ru_what: "Предъявите подтверждение бронирования — на экране телефона или распечатку — на турникете или у ворот платформы. Отдельная регистрация не требуется.",
      ru_where: "Платформа станции отправления",
      ru_address: "Ваша станция отправления",
      ru_advice: "Ручной багаж — в верхних полках или в специальном отсеке в конце вагона. Не оставляйте вещи в проходе.",
      ru_warning: "Поезда отправляются точно по расписанию. После объявления отправления посадка прекращается.",
    },
  ];

  const insertStep = db.prepare(`
    INSERT INTO steps (
      id, guide_id, step_order, cost, time_est,
      en_title, en_what, en_where, en_address, en_advice, en_warning,
      ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of steps) {
    insertStep.run(
      s.id, GUIDE_ID, s.order, s.cost, s.time_est,
      s.en_title, s.en_what, s.en_where, s.en_address, s.en_advice, s.en_warning,
      s.ru_title, s.ru_what, s.ru_where, s.ru_address, s.ru_advice, s.ru_warning,
    );
    console.log(`  ✓ Step ${s.order} inserted: ${s.en_title}`);
  }

  // Post-assert
  const g = db.prepare("SELECT id, published, en_title FROM guides WHERE slug=?").get(SLUG) as Row;
  if (!g) throw new Error("ASSERT: guide not found after insert");
  if (g.en_title !== EN_TITLE) throw new Error("ASSERT: en_title mismatch after insert");
  if (g.published !== 1) throw new Error("ASSERT: guide not published");
  const sc = (db.prepare("SELECT COUNT(*) as n FROM steps WHERE guide_id=?").get(GUIDE_ID) as Row).n;
  if (sc !== 5) throw new Error(`ASSERT: expected 5 steps, found ${sc}`);
  console.log(`\n  ✓ Etihad Rail: guide + 5 steps verified.`);
}

// ── B: Mawlid ──────────────────────────────────────────────────────────────

function patchMawlid(db: Database.Database) {
  const CAL_SLUG    = "august-2026-dubai-calendar";
  const TARGET_ID   = "AUG-NEW-02";
  const FINAL_DATE  = "2026-08-25";
  const UAE_GOV_URL = "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays";

  const FINAL_VALUES: Record<string, unknown> = {
    date:            FINAL_DATE,
    label_en:        "Prophet Muhammad's Birthday (Mawlid Al Nabi)",
    label_ru:        "День рождения пророка Мухаммеда (Мавлид ан-Наби)",
    short_label_en:  "Prophet's Birthday",
    short_label_ru:  "День Пророка",
    brief_en: (
      "Prophet Muhammad's Birthday (Mawlid Al Nabi) is a UAE public holiday established under " +
      "Cabinet Resolution No. 27 of 2024. Expected on 25 August 2026 (12 Rabi Al Awwal 1448 AH), " +
      "subject to official UAE confirmation of the Hijri date. A transfer to Monday, 24 August " +
      "has not been officially announced and would require a separate official decision. Government " +
      "offices and federal schools close; private-sector coverage and any date transfer will be " +
      "confirmed by MoHRE and FAHR closer to August. No official 2026 circular has been issued " +
      "as of 18 July 2026."
    ),
    brief_ru: (
      "День рождения пророка Мухаммеда (Мавлид ан-Наби) — государственный праздник ОАЭ согласно " +
      "Постановлению Кабинета министров № 27 от 2024 года. Ожидаемая дата — 25 августа 2026 года " +
      "(12 Раби аль-Авваль 1448 г. х.); точная дата должна быть подтверждена властями ОАЭ в " +
      "соответствии с исламским календарём. Перенос выходного на понедельник, 24 августа, официально " +
      "не объявлен и потребует отдельного решения властей ОАЭ. Государственные учреждения и федеральные " +
      "школы закрыты; применимость в частном секторе и перенос даты будут подтверждены MoHRE и FAHR. " +
      "Официальный циркуляр на 2026 год не опубликован по состоянию на 18 июля 2026 года."
    ),
    source_url:      UAE_GOV_URL,
    cta_url:         UAE_GOV_URL,
    cta_label_en:    "Official UAE public holidays",
    cta_label_ru:    "Праздники ОАЭ (официально)",
    source_label_en: "UAE Government Portal · Cabinet Resolution No. 27/2024",
    source_label_ru: "Правительство ОАЭ · Постановление Кабинета № 27/2024",
  };

  const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(CAL_SLUG) as Row | undefined;
  if (!row) throw new Error(`ABORT: calendar page not found: ${CAL_SLUG}`);

  const dates = JSON.parse(row.dates_json as string) as Record<string, unknown>[];
  const entry = dates.find(d => d["id"] === TARGET_ID);
  if (!entry) throw new Error(`ABORT: ${TARGET_ID} not found in dates_json`);

  // Guard: don't apply if it's been officially confirmed
  if (entry["confidence"] !== "expected") {
    throw new Error(
      `ABORT: ${TARGET_ID} confidence="${entry["confidence"]}". ` +
      `If Mawlid has been officially confirmed by UAE authorities, update with the official state instead.`
    );
  }

  // Idempotency check: if already in final FIX-01 state, skip
  if (entry["label_en"] === FINAL_VALUES["label_en"] && entry["source_url"] === UAE_GOV_URL && entry["date"] === FINAL_DATE) {
    console.log(`  ⚠ AUG-NEW-02 already in final FIX-01 state. Skipping.`);
    return;
  }

  // Accept from either pre-Batch-01B (date=2026-08-24) or intermediate states
  const currentDate = entry["date"];
  if (currentDate !== "2026-08-24" && currentDate !== "2026-08-25") {
    throw new Error(
      `ABORT: ${TARGET_ID} has unexpected date="${currentDate}". ` +
      `Expected "2026-08-24" (pre-Batch-01B) or "2026-08-25" (post-Batch-01B). ` +
      `Manual inspection required.`
    );
  }

  console.log(`  BEFORE: date=${entry["date"]}, source_url=${String(entry["source_url"]).slice(0,40)}...`);

  // Apply all final values
  for (const [k, v] of Object.entries(FINAL_VALUES)) {
    entry[k] = v;
  }

  db.prepare(
    "UPDATE calendar_pages SET dates_json=?, updated_at=datetime('now') WHERE slug=?"
  ).run(JSON.stringify(dates), CAL_SLUG);

  // Post-assert
  const verify = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(CAL_SLUG) as Row;
  const vDates = JSON.parse(verify.dates_json as string) as Record<string, unknown>[];
  const v = vDates.find(d => d["id"] === TARGET_ID);
  if (!v) throw new Error("ASSERT: AUG-NEW-02 missing after update");
  if (v["date"] !== FINAL_DATE) throw new Error("ASSERT: date not set to 2026-08-25");
  if (v["confidence"] !== "expected") throw new Error("ASSERT: confidence changed");
  if (v["source_url"] !== UAE_GOV_URL) throw new Error("ASSERT: source_url not set to u.ae");
  if (v["label_en"] !== FINAL_VALUES["label_en"]) throw new Error("ASSERT: label_en mismatch");
  if (vDates.length !== dates.length) throw new Error("ASSERT: item count changed");

  console.log(`  AFTER:  date=${v["date"]}, source_url=u.ae...`);
  console.log(`  ✓ AUG-NEW-02 patched to final Batch-01B+FIX-01 state.`);
}

// ── C: July 2026 events ────────────────────────────────────────────────────

function patchJulyEvents(db: Database.Database) {
  const CAL_SLUG  = "july-2026-dubai-calendar";
  const NEW_IDS   = ["JUL-NEW-04", "JUL-NEW-05", "JUL-NEW-06", "JUL-NEW-07"];

  const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(CAL_SLUG) as Row | undefined;
  if (!row) throw new Error(`ABORT: calendar page not found: ${CAL_SLUG}`);

  const dates = JSON.parse(row.dates_json as string) as Record<string, unknown>[];
  const existingIds = new Set(dates.map(d => d["id"]));
  const presentNew  = NEW_IDS.filter(id => existingIds.has(id));

  // Idempotency: all 4 already present
  if (presentNew.length === 4) {
    const allMatch = NEW_IDS.every(id => {
      const found = dates.find(d => d["id"] === id);
      return found && found["confidence"] === "confirmed";
    });
    if (allMatch) {
      console.log(`  ⚠ All 4 July events already present (confirmed). Skipping.`);
      return;
    }
  }

  // Partial state = abort
  if (presentNew.length > 0 && presentNew.length < 4) {
    throw new Error(
      `ABORT: partial July event state. Present: ${presentNew.join(", ")}. ` +
      `Missing: ${NEW_IDS.filter(id => !existingIds.has(id)).join(", ")}. ` +
      `Manual inspection required.`
    );
  }

  // None present — insert all 4
  console.log(`  Current July items: ${dates.length}`);

  const newItems: Record<string, unknown>[] = [
    {
      id: "JUL-NEW-04", date: "2026-07-18",
      label_en: "Beat The Heat DXB S5: Dystinct & Issam Najjar at DWTC Hall 8 (18 July)",
      label_ru: "Beat The Heat DXB S5: Dystinct и Issam Najjar в DWTC (18 июля)",
      short_label_en: "Dystinct & Issam Najjar",
      short_label_ru: "Dystinct & Issam Najjar",
      type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
      brief_en: "Beat The Heat DXB Season 5 brings Moroccan-Belgian rapper Dystinct and Jordanian-Palestinian singer Issam Najjar to Hall 8 at Dubai World Trade Centre. Doors at 6 pm; show at 8:30 pm. Tickets from AED 105. Part of Dubai Summer Surprises 2026. Ages 14+; valid photo ID required.",
      brief_ru: "Beat The Heat DXB Сезон 5: марокканско-бельгийский рэпер Dystinct и иорданско-палестинский певец Issam Najjar выступают в Зале 8, Dubai World Trade Centre. Двери — 18:00, шоу — 20:30. Билеты от 105 AED. В рамках Dubai Summer Surprises 2026. Возраст 14+.",
      source_label_en: "Visit Dubai · Platinumlist",
      source_label_ru: "Visit Dubai · Platinumlist",
      source_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/beat-the-heat-dystinct-issam-najjar",
      source_status: "confirmed", cta_type: "open_source",
      cta_url: "https://dubai.platinumlist.net/event-tickets/106642/beat-the-heat-dxb-season-5-ft-dystinct-issam-najjar-live-at-dwtc",
      cta_label_en: "Tickets from AED 105", cta_label_ru: "Билеты от 105 AED",
      emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
      noindex_after: "2026-07-19", archive_action: "remove",
    },
    {
      id: "JUL-NEW-05", date: "2026-07-18",
      label_en: "Michael Lives Forever (Michael Jackson tribute) at Coca-Cola Arena (18 July)",
      label_ru: "Michael Lives Forever (трибьют Майклу Джексону) в Coca-Cola Arena (18 июля)",
      short_label_en: "Michael Lives Forever",
      short_label_ru: "Michael Lives Forever",
      type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
      brief_en: "Michael Lives Forever is a Michael Jackson tribute show at Coca-Cola Arena, Dubai. Performed by Rodrigo Teaser — one of the world's leading MJ tribute artists — with full live band and dancers. Show at 8:30 pm. Tickets from AED 125 to AED 695. Presented by AJ Entertainment; supported by Dubai Calendar.",
      brief_ru: "Michael Lives Forever — трибьют-шоу памяти Майкла Джексона в Coca-Cola Arena, Дубай. Исполнитель: Родриго Тизер — один из ведущих MJ-трибьют-артистов мира, с живым оркестром и танцорами. Начало в 20:30. Билеты от 125 до 695 AED. Организатор: AJ Entertainment, при поддержке Dubai Calendar.",
      source_label_en: "Coca-Cola Arena official · Visit Dubai",
      source_label_ru: "Coca-Cola Arena (официально) · Visit Dubai",
      source_url: "https://coca-cola-arena.com/music/1939/michael-lives-forever",
      source_status: "confirmed", cta_type: "open_source",
      cta_url: "https://dubai.platinumlist.net/event-tickets/106634/michael-lives-forever-at-coca-cola-arena-in-dubai",
      cta_label_en: "Tickets from AED 125", cta_label_ru: "Билеты от 125 AED",
      emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
      noindex_after: "2026-07-19", archive_action: "remove",
    },
    {
      id: "JUL-NEW-06", date: "2026-07-25",
      label_en: "Beat The Heat DXB S5: Talal Sam & Sultan Al Murshed at DWTC Hall 8 (25 July)",
      label_ru: "Beat The Heat DXB S5: Талал Сам и Султан аль-Муршид в DWTC (25 июля)",
      short_label_en: "Talal Sam & Sultan Al Murshed",
      short_label_ru: "Талал Сам & Султан аль-Муршид",
      type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
      brief_en: "Beat The Heat DXB Season 5 brings Kuwaiti artist Talal Sam and Saudi singer Sultan Al Murshed to Hall 8 at Dubai World Trade Centre. Doors at 6 pm; performance at 8:30 pm. Tickets from AED 105. Part of Dubai Summer Surprises 2026.",
      brief_ru: "Beat The Heat DXB Сезон 5: кувейтский артист Талал Сам и саудовский певец Султан аль-Муршид выступают в Зале 8, Dubai World Trade Centre. Двери — 18:00, выступление — 20:30. Билеты от 105 AED. В рамках Dubai Summer Surprises 2026.",
      source_label_en: "Visit Dubai · Beat The Heat official schedule",
      source_label_ru: "Visit Dubai · официальное расписание Beat The Heat",
      source_url: "https://www.visitdubai.com/en/festivals-and-events/dubai-events-calendar/beat-the-heat-dxb-talal-sam-sultan-murshed",
      source_status: "confirmed", cta_type: "open_source",
      cta_url: "https://dubai.platinumlist.net/event-tickets/106643/beat-the-heat-dxb-season-5-ft-talal-sam-sultan-murshid-live-at-dwtc",
      cta_label_en: "Tickets from AED 105", cta_label_ru: "Билеты от 105 AED",
      emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
      noindex_after: "2026-07-26", archive_action: "remove",
    },
    {
      id: "JUL-NEW-07", date: "2026-07-26",
      label_en: "Indie Soulfest: Bismil & Indian Ocean at Coca-Cola Arena (26 July)",
      label_ru: "Indie Soulfest: Bismil и Indian Ocean в Coca-Cola Arena (26 июля)",
      short_label_en: "Indie Soulfest",
      short_label_ru: "Indie Soulfest",
      type: "trade_show", confidence: "confirmed", priority: 2, detail_url: null,
      brief_en: "Indie Soulfest brings Sufi-fusion artist Bismil and Indian fusion legends Indian Ocean to Coca-Cola Arena, Dubai. Doors at 7 pm; show at 8 pm until approximately 11:30 pm. Tickets from AED 99 to AED 2,000. Part of Dubai Summer Surprises 2026.",
      brief_ru: "Indie Soulfest: суфийско-фьюжн артист Bismil и индийские рок-пионеры Indian Ocean выступают в Coca-Cola Arena, Дубай. Двери — 19:00, шоу — 20:00 (до ~23:30). Билеты от 99 до 2 000 AED. В рамках Dubai Summer Surprises 2026.",
      source_label_en: "Coca-Cola Arena official · Khaleej Times",
      source_label_ru: "Coca-Cola Arena (официально) · Khaleej Times",
      source_url: "https://coca-cola-arena.com/music/1950/indie-soulfest-with-bismil-and-indian-ocean",
      source_status: "confirmed", cta_type: "open_source",
      cta_url: "https://dubai.platinumlist.net/event-tickets/106641/indie-soulfest-with-bismil-and-indian-ocean",
      cta_label_en: "Tickets from AED 99", cta_label_ru: "Билеты от 99 AED",
      emirate: "Dubai", risk_level: "low", lifecycle: "event_fixed",
      noindex_after: "2026-07-27", archive_action: "remove",
    },
  ];

  // Verify no duplicate IDs before inserting
  for (const item of newItems) {
    if (existingIds.has(item["id"])) {
      throw new Error(`ABORT: duplicate ID would be created: ${item["id"]}`);
    }
  }

  dates.push(...newItems);

  db.prepare(
    "UPDATE calendar_pages SET dates_json=?, updated_at=datetime('now') WHERE slug=?"
  ).run(JSON.stringify(dates), CAL_SLUG);

  // Post-assert
  const verify = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug=?").get(CAL_SLUG) as Row;
  const vDates = JSON.parse(verify.dates_json as string) as Record<string, unknown>[];
  if (vDates.length !== dates.length) throw new Error("ASSERT: item count mismatch after insert");
  for (const id of NEW_IDS) {
    const found = vDates.find(d => d["id"] === id);
    if (!found) throw new Error(`ASSERT: ${id} not found after insert`);
    if (found["confidence"] !== "confirmed") throw new Error(`ASSERT: ${id} confidence wrong`);
  }
  console.log(`  ✓ July events: 4 items inserted. Total: ${vDates.length}`);
}

main();

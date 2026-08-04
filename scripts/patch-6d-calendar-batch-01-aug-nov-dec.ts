/**
 * Phase 6D-CALENDAR-Q3Q4-2026-EXPANSION-AND-FULL-SITE-AUDIT-01
 * Stage D — Calendar content batch: August/November/December 2026 additions
 *
 * Adds 7 verified new calendar items:
 *
 * August 2026 (4 items, Tier-1 source: Platinumlist homepage 2026-08-04):
 *   AUG-6D-01 — Beat The Heat S5 ft Al Shami, Aug 8, DWTC Hall 8, AED 105
 *   AUG-6D-02 — Lucky Ali, Aug 16, Coca-Cola Arena, AED 125
 *   AUG-6D-03 — Sunil Grover comedy, Aug 21, Coca-Cola Arena, AED 125
 *   AUG-6D-04 — Jimmy Carr 'Laughs Funny', Aug 29-30, Dubai Opera, AED 250
 *
 * November 2026 (2 items):
 *   NOV-6D-01 — UAE Flag Day, Nov 3 (official annual national observance)
 *   NOV-6D-02 — Diwali 2026, Nov 8 (expected; T2 source: holidayscalendar.com)
 *
 * December 2026 (1 item):
 *   DEC-6D-01 — NYE fireworks and celebrations, Dec 31 (confirmed annual event)
 *
 * Also updates AUG-NEW-02 (Mawlid brief) to reflect current date "4 August 2026"
 * instead of "18 July 2026" per Stage C content verification.
 *
 * Idempotent: each item is checked by ID before insertion; already-present items
 * are skipped. Safe to run twice.
 */

import Database from "better-sqlite3";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const DB_PATH    = path.resolve(__dirname, "../data/guides.db");
const BACKUP_DIR = path.resolve(__dirname, "../backups/local");

type DateItem = Record<string, unknown>;

interface CalPageRow {
  dates_json: string;
}

// ── New calendar items ─────────────────────────────────────────────────────────

const AUG_NEW_ITEMS: DateItem[] = [
  {
    id:              "AUG-6D-01",
    date:            "2026-08-08",
    label_en:        "Beat The Heat DXB Season 5: Al Shami live at DWTC Hall 8, Dubai (8 August)",
    label_ru:        "Beat The Heat DXB Season 5: Аль Шами live в Dubai World Trade Centre (8 августа)",
    short_label_en:  "Al Shami — Beat The Heat S5",
    short_label_ru:  "Аль Шами в DWTC",
    type:            "trade_show",
    confidence:      "confirmed",
    priority:        2,
    detail_url:      null,
    brief_en:
      "Al Shami performs at Hall 8, Dubai World Trade Centre as part of " +
      "the Beat The Heat DXB Season 5 weekly summer concert series. The series runs Saturdays through " +
      "August 2026. Doors open at 18:00; show starts at 20:30. Tickets from AED 105. Part of " +
      "Dubai Summer Surprises 2026.",
    brief_ru:
      "Аль Шами выступает в Hall 8, Dubai World Trade Centre в рамках еженедельной летней " +
      "концертной серии Beat The Heat DXB Season 5. Серия проходит по субботам до конца августа 2026 года. " +
      "Двери открываются в 18:00, концерт начинается в 20:30. Билеты от AED 105. " +
      "Мероприятие входит в программу Dubai Summer Surprises 2026.",
    source_label_en: "Platinumlist · Beat The Heat official",
    source_label_ru: "Platinumlist · Beat The Heat (официально)",
    source_url:      "https://dubai.platinumlist.net",
    source_status:   "confirmed",
    cta_type:        "ticket",
    cta_url:         "https://dubai.platinumlist.net",
    cta_label_en:    "Tickets from AED 105",
    cta_label_ru:    "Билеты от AED 105",
    emirate:         "Dubai",
    risk_level:      "low",
    lifecycle:       "event_fixed",
    noindex_after:   "2026-08-09",
    archive_action:  "remove",
  },
  {
    id:              "AUG-6D-02",
    date:            "2026-08-16",
    label_en:        "Lucky Ali live at Coca-Cola Arena, Dubai (16 August)",
    label_ru:        "Lucky Ali live в Coca-Cola Arena, Дубай (16 августа)",
    short_label_en:  "Lucky Ali at Coca-Cola Arena",
    short_label_ru:  "Lucky Ali в Дубае",
    type:            "trade_show",
    confidence:      "confirmed",
    priority:        2,
    detail_url:      null,
    brief_en:
      "Indian singer-songwriter Lucky Ali performs live at Coca-Cola Arena, City Walk, Dubai. " +
      "Known for hits including 'O Sanam', 'Teri Yaad', and 'Safarnama'. Tickets from AED 125.",
    brief_ru:
      "Индийский певец и автор песен Lucky Ali выступает в Coca-Cola Arena, City Walk, Дубай. " +
      "Известен хитами 'O Sanam', 'Teri Yaad' и 'Safarnama'. Билеты от AED 125.",
    source_label_en: "Platinumlist",
    source_label_ru: "Platinumlist",
    source_url:      "https://dubai.platinumlist.net",
    source_status:   "confirmed",
    cta_type:        "ticket",
    cta_url:         "https://dubai.platinumlist.net",
    cta_label_en:    "Tickets from AED 125",
    cta_label_ru:    "Билеты от AED 125",
    emirate:         "Dubai",
    risk_level:      "low",
    lifecycle:       "event_fixed",
    noindex_after:   "2026-08-17",
    archive_action:  "remove",
  },
  {
    id:              "AUG-6D-03",
    date:            "2026-08-21",
    label_en:        "Sunil Grover — live comedy at Coca-Cola Arena, Dubai (21 August)",
    label_ru:        "Сунил Гровер — стендап-шоу в Coca-Cola Arena, Дубай (21 августа)",
    short_label_en:  "Sunil Grover at Coca-Cola Arena",
    short_label_ru:  "Сунил Гровер в Дубае",
    type:            "trade_show",
    confidence:      "confirmed",
    priority:        2,
    detail_url:      null,
    brief_en:
      "Indian comedian and actor Sunil Grover performs live comedy at Coca-Cola Arena, Dubai. " +
      "Known for his characters on 'Comedy Nights with Kapil' and 'The Kapil Sharma Show', " +
      "and for Bollywood films including 'Bharat'. Tickets from AED 125.",
    brief_ru:
      "Индийский комик и актёр Сунил Гровер выступает с живым шоу в Coca-Cola Arena, Дубай. " +
      "Широко известен по ролям в 'Comedy Nights with Kapil' и 'The Kapil Sharma Show', " +
      "а также по фильмам Болливуда, в том числе 'Bharat'. Билеты от AED 125.",
    source_label_en: "Platinumlist",
    source_label_ru: "Platinumlist",
    source_url:      "https://dubai.platinumlist.net",
    source_status:   "confirmed",
    cta_type:        "ticket",
    cta_url:         "https://dubai.platinumlist.net",
    cta_label_en:    "Tickets from AED 125",
    cta_label_ru:    "Билеты от AED 125",
    emirate:         "Dubai",
    risk_level:      "low",
    lifecycle:       "event_fixed",
    noindex_after:   "2026-08-22",
    archive_action:  "remove",
  },
  {
    id:              "AUG-6D-04",
    date:            "2026-08-29",
    label_en:        "Jimmy Carr 'Laughs Funny' tour at Dubai Opera (29-30 August)",
    label_ru:        "Jimmy Carr — тур 'Laughs Funny' в Dubai Opera (29-30 августа)",
    short_label_en:  "Jimmy Carr at Dubai Opera",
    short_label_ru:  "Jimmy Carr в Дубае",
    type:            "trade_show",
    confidence:      "confirmed",
    priority:        2,
    detail_url:      null,
    brief_en:
      "British comedian Jimmy Carr brings his 'Laughs Funny' tour to Dubai Opera for two nights — " +
      "29 and 30 August 2026. Known for dark, deadpan stand-up and his TV work. " +
      "Tickets from AED 250.",
    brief_ru:
      "Британский комик Джимми Карр привозит тур 'Laughs Funny' в Dubai Opera на два вечера — " +
      "29 и 30 августа 2026 года. Известен мрачным дедпановым юмором и телевизионными проектами. " +
      "Билеты от AED 250.",
    source_label_en: "Platinumlist",
    source_label_ru: "Platinumlist",
    source_url:      "https://dubai.platinumlist.net",
    source_status:   "confirmed",
    cta_type:        "ticket",
    cta_url:         "https://dubai.platinumlist.net",
    cta_label_en:    "Tickets from AED 250",
    cta_label_ru:    "Билеты от AED 250",
    emirate:         "Dubai",
    risk_level:      "low",
    lifecycle:       "event_fixed",
    noindex_after:   "2026-08-31",
    archive_action:  "remove",
  },
];

const NOV_NEW_ITEMS: DateItem[] = [
  {
    id:              "NOV-6D-01",
    date:            "2026-11-03",
    label_en:        "UAE Flag Day — 3 November",
    label_ru:        "День флага ОАЭ — 3 ноября",
    short_label_en:  "UAE Flag Day",
    short_label_ru:  "День флага ОАЭ",
    type:            "important-date",
    confidence:      "confirmed",
    priority:        2,
    detail_url:      null,
    brief_en:
      "UAE Flag Day is observed every year on 3 November, commemorating the date in 1971 when the " +
      "UAE's first national flag was raised. It is not a public holiday — offices, schools, and " +
      "businesses remain open. The day is marked by flag-raising ceremonies at government buildings, " +
      "malls, and public spaces across the UAE, with residents and employees encouraged to wear the " +
      "national colours.",
    brief_ru:
      "День флага ОАЭ отмечается ежегодно 3 ноября в память о дне, когда в 1971 году был впервые " +
      "поднят национальный флаг ОАЭ. Это не выходной день — офисы, школы и предприятия работают " +
      "в обычном режиме. В честь праздника у государственных зданий, торговых центров и " +
      "общественных мест по всей стране проводятся церемонии поднятия флага; жителей и сотрудников " +
      "призывают носить национальные цвета.",
    source_label_en: "UAE Government · official annual observance",
    source_label_ru: "Правительство ОАЭ · официальный ежегодный праздник",
    source_url:      "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs",
    source_status:   "confirmed",
    cta_type:        "open_source",
    cta_url:         "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs",
    cta_label_en:    "UAE Government Portal",
    cta_label_ru:    "Правительство ОАЭ",
    emirate:         "UAE",
    risk_level:      "low",
    lifecycle:       "evergreen",
    noindex_after:   null,
    archive_action:  "keep",
  },
  {
    id:              "NOV-6D-02",
    date:            "2026-11-08",
    label_en:        "Diwali 2026 — Festival of Lights (8 November)",
    label_ru:        "Дивали 2026 — Фестиваль огней (8 ноября)",
    short_label_en:  "Diwali 2026",
    short_label_ru:  "Дивали 2026",
    type:            "holiday",
    confidence:      "expected",
    priority:        2,
    detail_url:      null,
    brief_en:
      "Diwali (Deepavali), the Hindu Festival of Lights, falls on 8 November 2026. The exact date " +
      "is set by the Hindu lunisolar calendar and may vary by one day depending on the regional " +
      "calculation used. Diwali is not a public holiday in the UAE, but is widely celebrated by " +
      "the large South Asian community across the Emirates. Dubai hosts Diwali light displays, " +
      "cultural events, and festivities at malls, Dubai Opera, and community venues including " +
      "the Little India district in Bur Dubai.",
    brief_ru:
      "Дивали (Deepavali), индуистский Фестиваль огней, в 2026 году приходится на 8 ноября. " +
      "Точная дата определяется по индусскому лунно-солнечному календарю и может отличаться " +
      "на один день в зависимости от региональных традиций. В ОАЭ это не государственный " +
      "праздник, однако он широко отмечается многочисленной южноазиатской общиной Эмиратов. " +
      "В Дубае в честь Дивали устраиваются световые инсталляции, культурные мероприятия и " +
      "праздники в торговых центрах, Dubai Opera и общественных местах, включая Маленькую Индию " +
      "в районе Бур-Дубай.",
    source_label_en: "Hindu calendar calculation · holidayscalendar.com",
    source_label_ru: "Расчёт по индусскому календарю · holidayscalendar.com",
    source_url:      "https://www.holidayscalendar.com/event/diwali/",
    source_status:   "expected",
    cta_type:        "open_source",
    cta_url:         "https://www.visitdubai.com/en/festivals-and-events",
    cta_label_en:    "Dubai events and festivals",
    cta_label_ru:    "Мероприятия в Дубае",
    emirate:         "UAE",
    risk_level:      "low",
    lifecycle:       "evergreen",
    noindex_after:   null,
    archive_action:  "keep",
  },
];

const DEC_NEW_ITEMS: DateItem[] = [
  {
    id:              "DEC-6D-01",
    date:            "2026-12-31",
    label_en:        "New Year's Eve 2026-27: Burj Khalifa fireworks and Dubai celebrations (31 December)",
    label_ru:        "Новогодняя ночь 2026-27: фейерверк у Бурдж-Халифа и праздник в Дубае (31 декабря)",
    short_label_en:  "NYE — Burj Khalifa fireworks",
    short_label_ru:  "Новый год у Бурдж-Халифа",
    type:            "holiday",
    confidence:      "confirmed",
    priority:        1,
    detail_url:      null,
    brief_en:
      "Dubai celebrates New Year's Eve with a world-renowned fireworks display at the Burj Khalifa " +
      "and Downtown Dubai at midnight on 31 December / 1 January. Viewing areas include Burj Park, " +
      "Business Bay Waterfront, and Sheikh Mohammed Bin Rashid Boulevard. Road closures apply from " +
      "late evening. Hotels, restaurants, and beach clubs across Dubai host NYE gala dinners and " +
      "parties. The Downtown area reaches capacity — arrive several hours early if attending in " +
      "person. Fireworks typically last 6-10 minutes; the broadcast streamed live on Dubai TV and " +
      "social channels.",
    brief_ru:
      "Дубай встречает Новый год грандиозным фейерверком у Бурдж-Халифа и в Downtown Dubai " +
      "в полночь 31 декабря / 1 января. Смотровые площадки: Burj Park, набережная Business Bay " +
      "и Бульвар Шейха Мохаммеда Бин Рашида. С позднего вечера вводятся дорожные ограничения. " +
      "Отели, рестораны и пляжные клубы Дубая проводят новогодние гала-ужины и вечеринки. " +
      "Территория Downtown быстро заполняется — приходите заранее. Фейерверк длится 6-10 минут; " +
      "трансляция ведётся на Dubai TV и в социальных сетях.",
    source_label_en: "Visit Dubai · Dubai Media Office — confirmed annual event",
    source_label_ru: "Visit Dubai · Dubai Media Office — ежегодное официальное мероприятие",
    source_url:      "https://www.visitdubai.com/en/festivals-and-events",
    source_status:   "confirmed",
    cta_type:        "open_source",
    cta_url:         "https://www.visitdubai.com/en/festivals-and-events",
    cta_label_en:    "Visit Dubai — NYE events",
    cta_label_ru:    "Visit Dubai — Новогодние мероприятия",
    emirate:         "Dubai",
    risk_level:      "low",
    lifecycle:       "evergreen",
    noindex_after:   "2027-01-01",
    archive_action:  "keep",
  },
];

// ── Mawlid brief update (Stage C — current date reference) ────────────────────
const MAWLID_UPDATE = {
  slug:      "august-2026-dubai-calendar",
  id:        "AUG-NEW-02",
  old_date_ref: "as of 18 July 2026",
  new_date_ref: "as of 4 August 2026",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function insertItems(
  db: Database.Database,
  slug: string,
  newItems: DateItem[],
) {
  const row = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(slug) as CalPageRow | undefined;
  if (!row) throw new Error(`ABORT: calendar page not found: ${slug}`);

  const dates: DateItem[] = JSON.parse(row.dates_json);
  const existingIds = new Set(dates.map(d => d.id as string));

  let added = 0;
  for (const item of newItems) {
    const id = item.id as string;
    if (existingIds.has(id)) {
      console.log(`  ⚠ ${id} already present — skipped`);
      continue;
    }
    dates.push(item);
    existingIds.add(id);
    added++;
    console.log(`  ✓ Added ${id}: ${item.label_en}`);
  }

  if (added > 0) {
    db.prepare(
      "UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = ?"
    ).run(JSON.stringify(dates), slug);
    console.log(`  → ${slug}: wrote ${dates.length} total items (+${added} new)`);
  } else {
    console.log(`  → ${slug}: no changes needed`);
  }

  // Post-run assertion: all expected IDs present
  const verify = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(slug) as CalPageRow;
  const verifyDates: DateItem[] = JSON.parse(verify.dates_json);
  const verifyIds = new Set(verifyDates.map(d => d.id as string));
  for (const item of newItems) {
    if (!verifyIds.has(item.id as string)) {
      throw new Error(`ASSERT: ${item.id} missing after update of ${slug}`);
    }
  }
}

function updateMawlidBrief(db: Database.Database) {
  const { slug, id, old_date_ref, new_date_ref } = MAWLID_UPDATE;
  const row = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(slug) as CalPageRow | undefined;
  if (!row) throw new Error(`ABORT: ${slug} not found`);

  const dates: DateItem[] = JSON.parse(row.dates_json);
  const entry = dates.find(d => d.id === id);
  if (!entry) throw new Error(`ABORT: ${id} not found in ${slug}`);

  const brief_en = entry.brief_en as string;
  if (!brief_en.includes(old_date_ref)) {
    if (brief_en.includes(new_date_ref)) {
      console.log(`  ⚠ Mawlid brief already updated to "${new_date_ref}" — skipped`);
    } else {
      console.log(`  ⚠ Mawlid brief does not contain "${old_date_ref}" — skipped (may need manual review)`);
    }
    return;
  }

  entry.brief_en = brief_en.replace(old_date_ref, new_date_ref);
  const brief_ru = entry.brief_ru as string;
  if (brief_ru.includes("18 июля 2026")) {
    entry.brief_ru = brief_ru.replace("18 июля 2026", "4 августа 2026");
  }

  db.prepare(
    "UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = ?"
  ).run(JSON.stringify(dates), slug);
  console.log(`  ✓ Mawlid brief updated: "${old_date_ref}" → "${new_date_ref}"`);
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(
    BACKUP_DIR,
    `guides.db.pre-6d-calendar-batch01-${ts}`
  );
  copyFileSync(DB_PATH, backupPath);
  console.log("✓ Backup:", backupPath);

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  console.log("\n── August 2026 additions ───────────────────────────────────────");
  insertItems(db, "august-2026-dubai-calendar", AUG_NEW_ITEMS);

  console.log("\n── August AUG-NEW-02 Mawlid brief update ───────────────────────");
  updateMawlidBrief(db);

  console.log("\n── November 2026 additions ──────────────────────────────────────");
  insertItems(db, "november-2026-dubai-calendar", NOV_NEW_ITEMS);

  console.log("\n── December 2026 additions ──────────────────────────────────────");
  insertItems(db, "december-2026-uae-calendar", DEC_NEW_ITEMS);

  // Final integrity check
  const integ = (db.pragma("integrity_check") as { integrity_check: string }[])[0]?.integrity_check;
  if (integ !== "ok") throw new Error(`ASSERT: integrity_check = "${integ}"`);
  console.log("\n✓ integrity_check: ok");

  db.close();
  console.log("✓ Phase 6D Stage D batch-01 patch applied.");
}

main();

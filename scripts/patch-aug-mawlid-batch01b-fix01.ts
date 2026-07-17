/**
 * Phase 6C-CALENDAR-UNIVERSE-BATCH-01B-FIX-01
 * Harden Mawlid Al Nabi 2026 (AUG-NEW-02) sourcing, titles and wording.
 *
 * Changes applied:
 *  - label_en  → concise "Prophet Muhammad's Birthday (Mawlid Al Nabi)"
 *  - label_ru  → concise "День рождения пророка Мухаммеда (Мавлид ан-Наби)"
 *  - short_label_en → "Prophet's Birthday"
 *  - short_label_ru → "День Пророка"
 *  - brief_en  → rewritten per A3/A4/A5: official-UAE-confirmation wording,
 *                transfer warning, no moon-sighting mechanism claim
 *  - brief_ru  → rewritten (natural Russian equivalent)
 *  - source_url / cta_url → UAE Government Portal (official)
 *  - cta_label_en/ru → "Official UAE public holidays" / "Праздники ОАЭ (официально)"
 *  - source_label_en/ru → "UAE Government Portal · Cabinet Resolution No. 27/2024" / RU equiv.
 *  - removes publicholidays.ae from CTA and source label
 *
 * DOES NOT change: id, date (2026-08-25), confidence (expected), source_status (expected),
 *   type, priority, emirate, lifecycle, noindex_after, archive_action, detail_url,
 *   or any other calendar_pages rows.
 *
 * Idempotent: safe to run twice. Second run detects already-applied state and exits cleanly.
 */

import Database from "better-sqlite3";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const DB_PATH   = path.resolve(__dirname, "../data/guides.db");
const BACKUP_DIR = path.resolve(__dirname, "../backups/local");
const SLUG      = "august-2026-dubai-calendar";
const TARGET_ID = "AUG-NEW-02";

const EXPECTED_DATE = "2026-08-25";
const UAE_GOV_HOLIDAYS_URL =
  "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays";

const NEW_VALUES = {
  label_en:       "Prophet Muhammad's Birthday (Mawlid Al Nabi)",
  label_ru:       "День рождения пророка Мухаммеда (Мавлид ан-Наби)",
  short_label_en: "Prophet's Birthday",
  short_label_ru: "День Пророка",
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
  source_url:      UAE_GOV_HOLIDAYS_URL,
  cta_url:         UAE_GOV_HOLIDAYS_URL,
  cta_label_en:    "Official UAE public holidays",
  cta_label_ru:    "Праздники ОАЭ (официально)",
  source_label_en: "UAE Government Portal · Cabinet Resolution No. 27/2024",
  source_label_ru: "Правительство ОАЭ · Постановление Кабинета № 27/2024",
};

type DateItem = Record<string, unknown>;

function main() {
  // ── Backup ──────────────────────────────────────────────────────────────────
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(BACKUP_DIR, `guides.db.pre-mawlid-batch01b-fix01-${ts}`);
  copyFileSync(DB_PATH, backupPath);
  console.log("✓ Backup:", backupPath);

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  // ── Pre-run checks ──────────────────────────────────────────────────────────
  const row = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(SLUG) as { dates_json: string } | undefined;
  if (!row) throw new Error(`ABORT: calendar page not found: ${SLUG}`);

  const dates: DateItem[] = JSON.parse(row.dates_json);
  const entry = dates.find(d => d.id === TARGET_ID);
  if (!entry) throw new Error(`ABORT: ${TARGET_ID} not found in dates_json`);

  // Guard: date must be the expected post-Batch-01B value
  if (entry.date !== EXPECTED_DATE) {
    throw new Error(`ABORT: date is "${entry.date}", expected "${EXPECTED_DATE}". Run Batch-01B first.`);
  }
  // Guard: must still be expected
  if (entry.confidence !== "expected") {
    throw new Error(
      `ABORT: confidence is "${entry.confidence}". If Mawlid has been officially confirmed, ` +
      `update this script with the confirmed state instead.`
    );
  }
  // Guard: must not have been already applied in full
  if (entry.label_en === NEW_VALUES.label_en && entry.source_url === UAE_GOV_HOLIDAYS_URL) {
    console.log("⚠ Patch already applied (label_en and source_url match). No changes written.");
    db.close();
    return;
  }

  console.log("\n=== BEFORE ===");
  console.log("  label_en:   ", entry.label_en);
  console.log("  source_url: ", entry.source_url);
  console.log("  total dates:", dates.length);

  // ── Apply changes ───────────────────────────────────────────────────────────
  for (const [k, v] of Object.entries(NEW_VALUES)) {
    entry[k] = v;
  }

  db.prepare(
    "UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = ?"
  ).run(JSON.stringify(dates), SLUG);

  // ── Post-run assertions ─────────────────────────────────────────────────────
  const verify = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(SLUG) as { dates_json: string };
  const verifyDates: DateItem[] = JSON.parse(verify.dates_json);
  const v = verifyDates.find(d => d.id === TARGET_ID);

  if (!v)                               throw new Error("ASSERT: AUG-NEW-02 missing after update");
  if (v.date !== EXPECTED_DATE)         throw new Error("ASSERT: date changed unexpectedly");
  if (v.confidence !== "expected")      throw new Error("ASSERT: confidence changed");
  if (v.source_status !== "expected")   throw new Error("ASSERT: source_status changed");
  if (v.label_en !== NEW_VALUES.label_en) throw new Error("ASSERT: label_en not applied");
  if (v.source_url !== UAE_GOV_HOLIDAYS_URL) throw new Error("ASSERT: source_url not applied");
  if (verifyDates.length !== dates.length) throw new Error("ASSERT: item count changed");

  // Verify no other items changed
  const otherBefore = dates.filter(d => d.id !== TARGET_ID);
  const otherAfter  = verifyDates.filter(d => d.id !== TARGET_ID);
  if (JSON.stringify(otherBefore) !== JSON.stringify(otherAfter)) {
    throw new Error("ASSERT: unrelated date items were changed");
  }

  console.log("\n=== AFTER ===");
  console.log("  label_en:   ", v.label_en);
  console.log("  source_url: ", v.source_url);
  console.log("  date:       ", v.date);
  console.log("  confidence: ", v.confidence);
  console.log("  total dates:", verifyDates.length);
  console.log("  Other items unchanged: ✓");

  db.close();
  console.log("\n✓ All assertions passed. Batch-01B-FIX-01 patch applied.");
}

main();

/**
 * AUG-NEW-02 SOURCE-LABEL-URL-MISMATCH micro-hotfix.
 *
 * source_label_en/ru named "UAE Government Media Office" as the linked
 * authority, but source_url/cta_url point to u.ae (UAE Government Portal),
 * not a Media Office announcement page. This corrects only the two label
 * fields so the visible attribution matches the actual link destination.
 *
 * Target: AUG-NEW-02 in the august-2026-dubai-calendar dates_json
 *
 * Fields changed:
 *   source_label_en: "UAE Government Media Office · Cabinet Resolution No. 27/2024"
 *                     → "UAE Government Portal · Cabinet Resolution No. 27/2024"
 *   source_label_ru: "Медиа-офис правительства ОАЭ · Постановление Кабинета № 27/2024"
 *                     → "Правительство ОАЭ · Постановление Кабинета № 27/2024"
 *
 * Fields preserved (all other AUG-NEW-02 fields and all other August items),
 * including date (2026-08-28), confidence/source_status (confirmed),
 * source_url, cta_url, brief_en, brief_ru.
 *
 * Idempotent: if labels already match the new values, the script skips
 * the update and exits cleanly.
 *
 * Safe to run twice.
 */

import Database from "better-sqlite3";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const DB_PATH    = process.env.GUIDEX_DB_PATH ?? path.resolve(__dirname, "../data/guides.db");
const BACKUP_DIR = path.resolve(__dirname, "../backups/local");

const SLUG = "august-2026-dubai-calendar";
const ITEM_ID = "AUG-NEW-02";

const OLD_SOURCE_LABEL_EN = "UAE Government Media Office · Cabinet Resolution No. 27/2024";
const OLD_SOURCE_LABEL_RU = "Медиа-офис правительства ОАЭ · Постановление Кабинета № 27/2024";
const NEW_SOURCE_LABEL_EN = "UAE Government Portal · Cabinet Resolution No. 27/2024";
const NEW_SOURCE_LABEL_RU = "Правительство ОАЭ · Постановление Кабинета № 27/2024";

const EXPECTED_URL = "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays";
const EXPECTED_DATE = "2026-08-28";

type DateItem = Record<string, unknown>;

interface CalPageRow {
  dates_json: string;
}

function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  AUG-NEW-02 SOURCE-LABEL-URL-MISMATCH micro-hotfix");
  console.log("  DB:", DB_PATH);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(BACKUP_DIR, `guides.db.pre-aug-new-02-source-label-fix-${ts}`);
  copyFileSync(DB_PATH, backupPath);
  console.log("✓ Backup:", backupPath);

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const row = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(SLUG) as CalPageRow | undefined;
  if (!row) throw new Error(`ABORT: calendar page not found: ${SLUG}`);

  const dates: DateItem[] = JSON.parse(row.dates_json);
  const matches = dates.filter(d => d.id === ITEM_ID);
  if (matches.length === 0) throw new Error(`ABORT: ${ITEM_ID} not found in ${SLUG}`);
  if (matches.length > 1) throw new Error(`ABORT: ${ITEM_ID} appears ${matches.length} times — refusing ambiguous update`);

  const entryIdx = dates.findIndex(d => d.id === ITEM_ID);
  const entry = dates[entryIdx];

  console.log("\n── Pre-patch state of AUG-NEW-02 ─────────────────────────────────");
  console.log("  date:            ", entry.date);
  console.log("  confidence:      ", entry.confidence);
  console.log("  source_status:   ", entry.source_status);
  console.log("  source_label_en: ", entry.source_label_en);
  console.log("  source_label_ru: ", entry.source_label_ru);
  console.log("  source_url:      ", entry.source_url);
  console.log("  cta_url:         ", entry.cta_url);

  // ── Protected invariants — must hold before any write ───────────────────
  if (entry.date !== EXPECTED_DATE) {
    throw new Error(`ABORT: expected date "${EXPECTED_DATE}" but found "${entry.date}". Refusing to touch a record in an unexpected state.`);
  }
  if (entry.confidence !== "confirmed" || entry.source_status !== "confirmed") {
    throw new Error(`ABORT: expected confirmed status but found confidence="${entry.confidence}" source_status="${entry.source_status}".`);
  }
  if (entry.source_url !== EXPECTED_URL || entry.cta_url !== EXPECTED_URL) {
    throw new Error(`ABORT: source_url/cta_url do not match expected u.ae URL. Refusing to write.`);
  }

  // ── Idempotency check ────────────────────────────────────────────────────
  if (entry.source_label_en === NEW_SOURCE_LABEL_EN && entry.source_label_ru === NEW_SOURCE_LABEL_RU) {
    console.log("\n⚠  Already applied — labels already match target values. No-op.");
    const integ = (db.pragma("integrity_check") as { integrity_check: string }[])[0]?.integrity_check;
    if (integ !== "ok") throw new Error(`ASSERT: integrity_check = "${integ}"`);
    console.log("✓ integrity_check: ok");
    db.close();
    return;
  }

  if (entry.source_label_en !== OLD_SOURCE_LABEL_EN) {
    throw new Error(`ABORT: expected old source_label_en "${OLD_SOURCE_LABEL_EN}" but found "${entry.source_label_en}". Manual review required.`);
  }
  if (entry.source_label_ru !== OLD_SOURCE_LABEL_RU) {
    throw new Error(`ABORT: expected old source_label_ru "${OLD_SOURCE_LABEL_RU}" but found "${entry.source_label_ru}". Manual review required.`);
  }

  // Snapshot every other field to prove nothing else changes.
  const untouchedBefore = JSON.stringify({ ...entry, source_label_en: undefined, source_label_ru: undefined });

  // ── Apply the two approved fields only ───────────────────────────────────
  entry.source_label_en = NEW_SOURCE_LABEL_EN;
  entry.source_label_ru = NEW_SOURCE_LABEL_RU;

  const untouchedAfter = JSON.stringify({ ...entry, source_label_en: undefined, source_label_ru: undefined });
  if (untouchedBefore !== untouchedAfter) {
    throw new Error("ASSERT: a field other than source_label_en/ru changed in memory — aborting before write.");
  }

  db.prepare(
    "UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = ?"
  ).run(JSON.stringify(dates), SLUG);

  console.log("\n── Post-patch verification ────────────────────────────────────────");

  const verifyRow = db
    .prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?")
    .get(SLUG) as CalPageRow | undefined;
  if (!verifyRow) throw new Error("ASSERT: row disappeared after write");

  const verifyDates: DateItem[] = JSON.parse(verifyRow.dates_json);
  const verifyEntry = verifyDates.find(d => d.id === ITEM_ID);
  if (!verifyEntry) throw new Error(`ASSERT: ${ITEM_ID} missing after write`);

  if (verifyEntry.source_label_en !== NEW_SOURCE_LABEL_EN)
    throw new Error(`ASSERT: source_label_en = "${verifyEntry.source_label_en}", expected "${NEW_SOURCE_LABEL_EN}"`);
  if (verifyEntry.source_label_ru !== NEW_SOURCE_LABEL_RU)
    throw new Error(`ASSERT: source_label_ru = "${verifyEntry.source_label_ru}", expected "${NEW_SOURCE_LABEL_RU}"`);

  // Protected invariants re-checked after write
  if (verifyEntry.date !== EXPECTED_DATE) throw new Error(`ASSERT: date changed! now "${verifyEntry.date}"`);
  if (verifyEntry.confidence !== "confirmed") throw new Error(`ASSERT: confidence changed! now "${verifyEntry.confidence}"`);
  if (verifyEntry.source_status !== "confirmed") throw new Error(`ASSERT: source_status changed! now "${verifyEntry.source_status}"`);
  if (verifyEntry.source_url !== EXPECTED_URL) throw new Error(`ASSERT: source_url changed! now "${verifyEntry.source_url}"`);
  if (verifyEntry.cta_url !== EXPECTED_URL) throw new Error(`ASSERT: cta_url changed! now "${verifyEntry.cta_url}"`);
  if (verifyEntry.brief_en !== entry.brief_en) throw new Error("ASSERT: brief_en changed!");
  if (verifyEntry.brief_ru !== entry.brief_ru) throw new Error("ASSERT: brief_ru changed!");

  console.log("  ✓ source_label_en:", verifyEntry.source_label_en);
  console.log("  ✓ source_label_ru:", verifyEntry.source_label_ru);
  console.log("  ✓ date unchanged:  ", verifyEntry.date);
  console.log("  ✓ confidence unchanged:", verifyEntry.confidence);
  console.log("  ✓ source_url unchanged:", verifyEntry.source_url);
  console.log("  ✓ cta_url unchanged:   ", verifyEntry.cta_url);

  const ids = verifyDates.map(d => d.id as string);
  const idSet = new Set(ids);
  if (idSet.size !== ids.length) throw new Error("ASSERT: duplicate IDs found in August dates_json");
  console.log("  ✓ No duplicate IDs, August count:", verifyDates.length);

  const integ = (db.pragma("integrity_check") as { integrity_check: string }[])[0]?.integrity_check;
  if (integ !== "ok") throw new Error(`ASSERT: integrity_check = "${integ}"`);
  console.log("  ✓ integrity_check: ok");

  db.close();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ✓ Patch applied. AUG-NEW-02 source_label_en/ru corrected.");
  console.log("  ✓ Backup at:", backupPath);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main();

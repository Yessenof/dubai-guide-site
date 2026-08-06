/**
 * patch-6d-final-correction-01.ts
 *
 * Phase 6D-FINAL-CORRECTION-01 DB fixes:
 * 1. DEC-04-GITEX — correct label/brief to accurately reflect split venue
 *    (Scale Summit Dec 7 at DWTC; main expo Dec 8-11 at Expo City Dubai)
 * 2. OCT-06-MARX — replace dead Platinumlist 404 URL with CCA official page
 *
 * Idempotent: can be re-run safely. Each fix checks that the ID exists and
 * is in expected state before writing.
 *
 * Run: npx ts-node --skip-project scripts/patch-6d-final-correction-01.ts
 */

import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const DB_PATH = process.env.GUIDEX_DB_PATH ?? path.resolve(process.cwd(), "data/guides.db");

function md5(filePath: string): string {
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

function integrityCheck(db: Database.Database): void {
  const result = db.prepare("PRAGMA integrity_check").get() as { integrity_check: string };
  if (result.integrity_check !== "ok") {
    throw new Error(`DB integrity_check failed: ${result.integrity_check}`);
  }
}

const db = new Database(DB_PATH);

console.log("=== patch-6d-final-correction-01 ===");
console.log(`DB path:   ${DB_PATH}`);
console.log(`DB size:   ${fs.statSync(DB_PATH).size} bytes`);
console.log(`MD5 (pre): ${md5(DB_PATH)}`);

integrityCheck(db);
console.log("Pre-write integrity_check: ok");

// ── 1. FIX DEC-04-GITEX ───────────────────────────────────────────────────────

const GITEX_LABEL_EN =
  "GITEX Global 2026 (7-11 December) — Scale Summit Dec 7 at DWTC; main expo Dec 8-11 at Expo City Dubai";
const GITEX_LABEL_RU =
  "GITEX Global 2026 (7-11 декабря) — Scale Summit 7 дек. в DWTC; основная выставка 8-11 дек. в Expo City Dubai";
const GITEX_BRIEF_EN =
  "GITEX Global 2026 spans two venues. GITEX Scale Summit (7 December) runs at Dubai World Trade Centre (DWTC). " +
  "The main GITEX Global Expo (8-11 December) moves to Expo City Dubai (Dubai Exhibition Centre), " +
  "marking the first edition at the new venue. Over 6,000 exhibitors and 180,000+ attendees expected. " +
  "The December timing coincides with Dubai's peak tourism season.";
const GITEX_BRIEF_RU =
  "GITEX Global 2026 проходит на двух площадках. GITEX Scale Summit (7 декабря) — в Dubai World Trade Centre (DWTC). " +
  "Основная выставка GITEX Global (8-11 декабря) переезжает в Expo City Dubai (Dubai Exhibition Centre) — " +
  "первое издание на новой площадке. Ожидается более 6 000 экспонентов и 180 000+ посетителей. " +
  "Декабрьские даты совпадают с пиком туристического сезона в Дубае.";

const decRow = db
  .prepare("SELECT dates_json, updated_at FROM calendar_pages WHERE slug = 'december-2026-uae-calendar'")
  .get() as { dates_json: string; updated_at: string } | undefined;

if (!decRow) throw new Error("december-2026-uae-calendar not found in DB");

const decItems = JSON.parse(decRow.dates_json) as Record<string, unknown>[];
const gitexIdx = decItems.findIndex((i) => i.id === "DEC-04-GITEX");
if (gitexIdx === -1) throw new Error("DEC-04-GITEX not found in december-2026-uae-calendar");

const gitex = decItems[gitexIdx];
const gitexPrevLabel = gitex.label_en as string;
const gitexAlreadyFixed = !gitexPrevLabel.includes("at Expo City Dubai (7-11 December)");

if (gitexAlreadyFixed) {
  console.log("DEC-04-GITEX: already corrected — skipping");
} else {
  console.log(`DEC-04-GITEX label_en (old): ${gitexPrevLabel}`);
  gitex.label_en = GITEX_LABEL_EN;
  gitex.label_ru = GITEX_LABEL_RU;
  gitex.brief_en = GITEX_BRIEF_EN;
  gitex.brief_ru = GITEX_BRIEF_RU;
  decItems[gitexIdx] = gitex;

  db.prepare(
    "UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = 'december-2026-uae-calendar'"
  ).run(JSON.stringify(decItems));

  console.log("DEC-04-GITEX: label_en updated");
  console.log("DEC-04-GITEX: label_ru updated");
  console.log("DEC-04-GITEX: brief_en updated");
  console.log("DEC-04-GITEX: brief_ru updated");
}

// Post-assertion: GITEX
const decRowPost = db
  .prepare("SELECT dates_json FROM calendar_pages WHERE slug = 'december-2026-uae-calendar'")
  .get() as { dates_json: string };
const decItemsPost = JSON.parse(decRowPost.dates_json) as Record<string, unknown>[];
const gitexPost = decItemsPost.find((i) => i.id === "DEC-04-GITEX")!;
if ((gitexPost.label_en as string).includes("at Expo City Dubai (7-11 December)")) {
  throw new Error("ASSERTION FAILED: DEC-04-GITEX label_en still has old value");
}
if (!(gitexPost.brief_en as string).includes("Scale Summit")) {
  throw new Error("ASSERTION FAILED: DEC-04-GITEX brief_en missing 'Scale Summit'");
}
if (!(gitexPost.brief_en as string).includes("DWTC")) {
  throw new Error("ASSERTION FAILED: DEC-04-GITEX brief_en missing 'DWTC'");
}
console.log("DEC-04-GITEX: post-assertions passed ✓");

// ── 2. FIX OCT-06-MARX (dead URL → CCA official) ─────────────────────────────

const MARX_CCA_URL = "https://coca-cola-arena.com/music/1837/richard-marx";
const DEAD_PL_URL =
  "https://dubai.platinumlist.net/event-tickets/105069/richard-marx-live-at-coca-cola-arena-in-dubai";

const octRow = db
  .prepare("SELECT dates_json FROM calendar_pages WHERE slug = 'october-2026-dubai-calendar'")
  .get() as { dates_json: string } | undefined;

if (!octRow) throw new Error("october-2026-dubai-calendar not found in DB");

const octItems = JSON.parse(octRow.dates_json) as Record<string, unknown>[];
const marxIdx = octItems.findIndex((i) => i.id === "OCT-06-MARX");
if (marxIdx === -1) throw new Error("OCT-06-MARX not found in october-2026-dubai-calendar");

const marx = octItems[marxIdx];
const marxAlreadyFixed = (marx.source_url as string) !== DEAD_PL_URL;

if (marxAlreadyFixed) {
  console.log("OCT-06-MARX: source_url already updated — skipping");
} else {
  console.log(`OCT-06-MARX source_url (old): ${marx.source_url}`);
  marx.source_url = MARX_CCA_URL;
  marx.cta_url = MARX_CCA_URL;
  marx.source_label_en = "Coca-Cola Arena (official)";
  marx.source_label_ru = "Coca-Cola Arena (официально)";
  octItems[marxIdx] = marx;

  db.prepare(
    "UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = 'october-2026-dubai-calendar'"
  ).run(JSON.stringify(octItems));

  console.log("OCT-06-MARX: source_url updated → CCA official");
  console.log("OCT-06-MARX: cta_url updated → CCA official");
  console.log("OCT-06-MARX: source_label_en updated");
  console.log("OCT-06-MARX: source_label_ru updated");
}

// Post-assertion: Marx
const octRowPost = db
  .prepare("SELECT dates_json FROM calendar_pages WHERE slug = 'october-2026-dubai-calendar'")
  .get() as { dates_json: string };
const octItemsPost = JSON.parse(octRowPost.dates_json) as Record<string, unknown>[];
const marxPost = octItemsPost.find((i) => i.id === "OCT-06-MARX")!;
if ((marxPost.source_url as string) === DEAD_PL_URL) {
  throw new Error("ASSERTION FAILED: OCT-06-MARX source_url still points to dead Platinumlist URL");
}
if (!(marxPost.source_url as string).includes("coca-cola-arena.com")) {
  throw new Error("ASSERTION FAILED: OCT-06-MARX source_url does not contain coca-cola-arena.com");
}
if ((marxPost.cta_url as string) === DEAD_PL_URL) {
  throw new Error("ASSERTION FAILED: OCT-06-MARX cta_url still points to dead Platinumlist URL");
}
console.log("OCT-06-MARX: post-assertions passed ✓");

// ── Post-write integrity check ─────────────────────────────────────────────────

integrityCheck(db);
console.log("Post-write integrity_check: ok");

db.close();
console.log(`MD5 (post): ${md5(DB_PATH)}`);
console.log("=== patch-6d-final-correction-01 COMPLETE ===");

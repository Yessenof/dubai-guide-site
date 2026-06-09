/**
 * Phase 6C-100C-A: Fix two DB bugs on august-2026-dubai-calendar
 *
 * Bug 1: has_islamic_dates = 0 on august-2026-dubai-calendar (should be 1 — Mawlid entry AUG-NEW-02 is present)
 * Bug 2: AUG-NEW-02 source_status = "confirmed" (should be "expected" — Mawlid not yet officially confirmed by FAHR)
 *
 * DOES NOT change: date, label, confidence, source_url, any other calendar items, news, events, or guides.
 * DOES NOT upgrade Mawlid to confirmed.
 */

import Database from "better-sqlite3";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";

const DB_PATH = path.resolve(__dirname, "../data/guides.db");
const BACKUP_DIR = path.resolve(__dirname, "../backups/local");
const SLUG = "august-2026-dubai-calendar";

function main() {
  // ── Backup ──────────────────────────────────────────────────────────────────
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(BACKUP_DIR, `guides.db.pre-mawlid-flags-6c100ca-${ts}`);
  copyFileSync(DB_PATH, backupPath);
  console.log("✓ DB backed up to:", backupPath);

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  // ── Pre-fix verification ────────────────────────────────────────────────────
  const row = db.prepare("SELECT has_islamic_dates, dates_json FROM calendar_pages WHERE slug = ?").get(SLUG) as { has_islamic_dates: number; dates_json: string } | undefined;
  if (!row) throw new Error(`Calendar page not found: ${SLUG}`);

  const dates: Array<Record<string, unknown>> = JSON.parse(row.dates_json);
  const mawlid = dates.find(d => d.id === "AUG-NEW-02");
  if (!mawlid) throw new Error("ASSERTION FAILED: AUG-NEW-02 entry not found in dates_json");

  console.log("\n=== BEFORE ===");
  console.log("  has_islamic_dates:", row.has_islamic_dates);
  console.log("  AUG-NEW-02 confidence:", mawlid.confidence);
  console.log("  AUG-NEW-02 source_status:", mawlid.source_status);
  console.log("  AUG-NEW-02 date:", mawlid.date);
  console.log("  Total dates:", dates.length);

  // Guard: confidence must remain "expected"
  if (mawlid.confidence !== "expected") {
    throw new Error(`ABORT: AUG-NEW-02 confidence is "${mawlid.confidence}" — expected "expected". Do not run this script if Mawlid has been officially confirmed.`);
  }

  // ── Fix 1: has_islamic_dates 0 → 1 ─────────────────────────────────────────
  if (row.has_islamic_dates === 1) {
    console.log("\n⚠ has_islamic_dates already 1 — skipping.");
  } else {
    db.prepare("UPDATE calendar_pages SET has_islamic_dates = 1, updated_at = datetime('now') WHERE slug = ?").run(SLUG);
  }

  // ── Fix 2: AUG-NEW-02 source_status "confirmed" → "expected" ───────────────
  if (mawlid.source_status === "expected") {
    console.log("⚠ AUG-NEW-02 source_status already 'expected' — skipping.");
  } else {
    mawlid.source_status = "expected";
    db.prepare("UPDATE calendar_pages SET dates_json = ?, updated_at = datetime('now') WHERE slug = ?").run(
      JSON.stringify(dates),
      SLUG
    );
  }

  // ── Post-fix verification ───────────────────────────────────────────────────
  const verify = db.prepare("SELECT has_islamic_dates, dates_json FROM calendar_pages WHERE slug = ?").get(SLUG) as { has_islamic_dates: number; dates_json: string };
  const verifyDates: Array<Record<string, unknown>> = JSON.parse(verify.dates_json);
  const verifyMawlid = verifyDates.find(d => d.id === "AUG-NEW-02");

  if (!verifyMawlid) throw new Error("ASSERTION FAILED: AUG-NEW-02 missing after update");
  if (verify.has_islamic_dates !== 1) throw new Error("ASSERTION FAILED: has_islamic_dates not 1 after update");
  if (verifyMawlid.source_status !== "expected") throw new Error("ASSERTION FAILED: source_status not 'expected' after update");
  if (verifyMawlid.confidence !== "expected") throw new Error("ASSERTION FAILED: confidence changed — must remain 'expected'");
  if (verifyDates.length !== dates.length) throw new Error(`ASSERTION FAILED: date count changed (${dates.length} → ${verifyDates.length})`);

  // Verify no other items changed
  const otherBefore = dates.filter(d => d.id !== "AUG-NEW-02");
  const otherAfter = verifyDates.filter(d => d.id !== "AUG-NEW-02");
  if (JSON.stringify(otherBefore) !== JSON.stringify(otherAfter)) {
    throw new Error("ASSERTION FAILED: other date items were changed");
  }

  console.log("\n=== AFTER ===");
  console.log("  has_islamic_dates:", verify.has_islamic_dates);
  console.log("  AUG-NEW-02 confidence:", verifyMawlid.confidence);
  console.log("  AUG-NEW-02 source_status:", verifyMawlid.source_status);
  console.log("  AUG-NEW-02 date:", verifyMawlid.date);
  console.log("  Total dates:", verifyDates.length);
  console.log("  Other items unchanged: ✓");

  db.close();
  console.log("\n✓ All assertions passed. Fix complete.");
}

main();

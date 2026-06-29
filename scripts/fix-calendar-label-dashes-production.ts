/**
 * Phase 6C-CALENDAR-LABEL-FIX-01 -- Calendar Label Dash Cosmetic Fix (Production)
 * PRODUCTION script -- run on server after owner approval + code deploy.
 *
 * Fixes: "  --" (double space + double dash) -> " --" (single space + double dash)
 * in label_en and label_ru of 5 affected items in November and December 2026 calendars.
 *
 * Run: npx tsx scripts/fix-calendar-label-dashes-production.ts
 */

import path from "path";
import fs from "fs";
import {
  getAllCalendarPages,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

function log(msg: string) { console.log(msg); }
function section(t: string) { console.log(`\n-- ${t} ${"-".repeat(Math.max(0, 55 - t.length))}`); }
function abort(msg: string): never { console.error(`\nABORT: ${msg}`); process.exit(1); }

section("Phase 6C-CALENDAR-LABEL-FIX-01 -- Production Fix");
const DB_PATH = path.resolve(process.cwd(), "data", "guides.db");
log(`  DB path:   ${DB_PATH}`);
log(`  Timestamp: ${new Date().toISOString()}`);

section("Creating DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);
const TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-label-fix-01-prod-${TS}`;
fs.copyFileSync(DB_PATH, BACKUP_PATH);
if (fs.statSync(BACKUP_PATH).size === 0) abort("Backup is empty.");
log(`  Backup: ${BACKUP_PATH}  PASS`);

function fixLabel(value: string | undefined): string {
  if (!value) return value ?? "";
  return value.replace(/  --/g, " --");
}

function hasEmDash(s: string): boolean { return s.includes("—"); }

const AFFECTED_IDS_NOV = new Set(["NOV-R1", "NOV-DPWT", "NOV-DFTS"]);
const AFFECTED_IDS_DEC = new Set(["DEC-CTAX", "DEC-EMIR"]);
let totalFixCount = 0;

for (const [SLUG, AFFECTED_IDS] of [
  ["november-2026-dubai-calendar", AFFECTED_IDS_NOV],
  ["december-2026-uae-calendar",   AFFECTED_IDS_DEC],
] as [string, Set<string>][]) {

  section(`Processing ${SLUG}`);

  const page = getAllCalendarPages().find(p => p.slug === SLUG);
  if (!page) abort(`Calendar page "${SLUG}" not found.`);
  log(`  id=${page.id}`);

  const items = JSON.parse(page.datesJson) as Array<Record<string, unknown>>;
  let pageFixCount = 0;

  const fixedItems = items.map(item => {
    const id = item["id"] as string;
    if (!AFFECTED_IDS.has(id)) return item;

    const origEn  = (item["label_en"]  as string | undefined) ?? "";
    const origRu  = (item["label_ru"]  as string | undefined) ?? "";
    const fixedEn = fixLabel(origEn);
    const fixedRu = fixLabel(origRu);

    const changedEn = fixedEn !== origEn;
    const changedRu = fixedRu !== origRu;

    if (!changedEn && !changedRu) {
      log(`  ${id}: already clean -- no change`);
      return item;
    }

    if (hasEmDash(fixedEn) || hasEmDash(fixedRu)) abort(`${id}: em dash detected after fix.`);

    if (changedEn) log(`  ${id} EN fixed`);
    if (changedRu) log(`  ${id} RU fixed`);

    pageFixCount++;
    totalFixCount++;
    return { ...item, label_en: fixedEn, label_ru: fixedRu };
  });

  // Guard: non-affected items must be unchanged
  for (const [orig, fixed] of items.map((o, i) => [o, fixedItems[i]])) {
    if (AFFECTED_IDS.has(orig["id"] as string)) continue;
    if (JSON.stringify(orig) !== JSON.stringify(fixed)) {
      abort(`Non-affected item ${orig["id"]} was modified unexpectedly.`);
    }
  }

  if (pageFixCount === 0) {
    log(`  No changes needed -- already clean.`);
    continue;
  }

  const upd = updateCalendarDraft(page.id, { dates_json: JSON.stringify(fixedItems) });
  if (!upd.ok) abort(`updateCalendarDraft ${SLUG} failed: ${JSON.stringify(upd.errors)}`);
  log(`  updateCalendarDraft: OK  (${pageFixCount} item(s))`);

  const pub = publishCalendar(page.id);
  if (!pub.ok) abort(`publishCalendar ${SLUG} failed: ${JSON.stringify(pub.errors)}`);
  log(`  publishCalendar: OK`);
}

section("Post-fix verification");

let anyFail = false;
const verPages = getAllCalendarPages();

for (const SLUG of ["november-2026-dubai-calendar", "december-2026-uae-calendar"]) {
  const page = verPages.find(p => p.slug === SLUG);
  if (!page) { console.error(`  FAIL: ${SLUG} not found.`); anyFail = true; continue; }

  const items = JSON.parse(page.datesJson) as Array<Record<string, unknown>>;
  let bad = 0;
  for (const item of items) {
    const en = (item["label_en"] as string | undefined) ?? "";
    const ru = (item["label_ru"] as string | undefined) ?? "";
    if (en.includes("  --") || ru.includes("  --")) {
      console.error(`  FAIL: ${item["id"]}: still has "  --"`);
      anyFail = true;
      bad++;
    }
    if (hasEmDash(en) || hasEmDash(ru)) {
      console.error(`  FAIL: ${item["id"]}: em dash present`);
      anyFail = true;
    }
  }
  if (bad === 0) log(`  ${SLUG}: clean.  PASS`);
}

if (anyFail) abort("Verification failed.");

section("Production fix complete -- ALL PASS");
log(`DB: ${DB_PATH}`);
log(`Backup: ${BACKUP_PATH}`);
log(`Items fixed: ${totalFixCount}`);

/**
 * Phase 6C-CALENDAR-LABEL-FIX-01 -- Calendar Label Dash Cosmetic Fix (Local)
 * LOCAL ONLY -- refuses to run on production server paths.
 *
 * Fixes: "  --" (double space + double dash) -> " --" (single space + double dash)
 * in label_en and label_ru of affected items in November and December 2026 calendars.
 *
 * Caused by: Phase 04B em-dash sanitization used replace(/—/g, " --") which
 * added a space before "--" but did not consume the existing space before "—",
 * resulting in double space. Only items that previously had "  --" are touched.
 *
 * Run: npx tsx scripts/fix-calendar-label-dashes-local.ts
 */

import path from "path";
import fs from "fs";
import {
  getAllCalendarPages,
  updateCalendarDraft,
  publishCalendar,
} from "@/lib/db/news-events-calendar-admin";

// ---- Local-only safety gate ------------------------------------------------

const DB_PATH = path.resolve(process.cwd(), "data", "guides.db");
const PRODUCTION_PATHS = ["/var/www/", "/var/app/", "/srv/www/"];
for (const p of PRODUCTION_PATHS) {
  if (DB_PATH.includes(p)) {
    console.error(`\nABORT: Production path detected: ${DB_PATH}`);
    process.exit(1);
  }
}

// ---- Helpers ---------------------------------------------------------------

function log(msg: string) { console.log(msg); }
function section(t: string) { console.log(`\n-- ${t} ${"-".repeat(Math.max(0, 55 - t.length))}`); }
function abort(msg: string): never { console.error(`\nABORT: ${msg}`); process.exit(1); }

section("Phase 6C-CALENDAR-LABEL-FIX-01 -- Local Fix");
log(`  DB path:   ${DB_PATH}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Backup ----------------------------------------------------------------

section("Creating DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);
const TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-label-fix-01-${TS}`;
fs.copyFileSync(DB_PATH, BACKUP_PATH);
if (fs.statSync(BACKUP_PATH).size === 0) abort("Backup is empty.");
log(`  Backup: ${BACKUP_PATH}  PASS`);

// ---- Fix function ----------------------------------------------------------

/** Replace "  --" (double space) with " --" (single space) in label fields only. */
function fixLabel(value: string | undefined): string {
  if (!value) return value ?? "";
  return value.replace(/  --/g, " --");
}

/** Verify no em dashes remain (admin API guard). */
function hasEmDash(s: string): boolean {
  return s.includes("—");
}

// ---- Apply fixes -----------------------------------------------------------

const AFFECTED_IDS_NOV = new Set(["NOV-R1", "NOV-DPWT", "NOV-DFTS"]);
const AFFECTED_IDS_DEC = new Set(["DEC-CTAX", "DEC-EMIR"]);

let totalFixCount = 0;

for (const [SLUG, AFFECTED_IDS] of [
  ["november-2026-dubai-calendar", AFFECTED_IDS_NOV],
  ["december-2026-uae-calendar",   AFFECTED_IDS_DEC],
] as [string, Set<string>][]) {

  section(`Processing ${SLUG}`);

  const pages = getAllCalendarPages();
  const page  = pages.find(p => p.slug === SLUG);
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
      log(`  ${id}: already clean -- no change needed`);
      return item;
    }

    if (hasEmDash(fixedEn) || hasEmDash(fixedRu)) {
      abort(`${id}: em dash detected after fix -- unexpected.`);
    }

    if (changedEn) {
      log(`  ${id} EN:  "${origEn.slice(0, 70)}..."`);
      log(`       -> "${fixedEn.slice(0, 70)}..."`);
    }
    if (changedRu) {
      log(`  ${id} RU:  "${origRu.slice(0, 70)}..."`);
      log(`       -> "${fixedRu.slice(0, 70)}..."`);
    }

    pageFixCount++;
    totalFixCount++;
    return { ...item, label_en: fixedEn, label_ru: fixedRu };
  });

  // Guard: verify no unintended changes
  for (const [orig, fixed] of items.map((o, i) => [o, fixedItems[i]])) {
    const id = orig["id"] as string;
    if (AFFECTED_IDS.has(id)) continue;
    // Non-affected items must be byte-identical
    if (JSON.stringify(orig) !== JSON.stringify(fixed)) {
      abort(`Non-affected item ${id} was modified unexpectedly.`);
    }
  }

  if (pageFixCount === 0) {
    log(`  No changes needed for ${SLUG} -- all items already clean.`);
    continue;
  }

  const upd = updateCalendarDraft(page.id, { dates_json: JSON.stringify(fixedItems) });
  if (!upd.ok) abort(`updateCalendarDraft ${SLUG} failed: ${JSON.stringify(upd.errors)}`);
  log(`  updateCalendarDraft: OK  (fixed ${pageFixCount} item(s))`);

  const pub = publishCalendar(page.id);
  if (!pub.ok) abort(`publishCalendar ${SLUG} failed: ${JSON.stringify(pub.errors)}`);
  log(`  publishCalendar: OK  Warnings: ${pub.warnings.length ? pub.warnings.join("; ") : "none"}`);
}

// ---- Post-fix verification -------------------------------------------------

section("Post-fix verification");

const verPages = getAllCalendarPages();
let anyFail = false;

for (const SLUG of ["november-2026-dubai-calendar", "december-2026-uae-calendar"]) {
  const page = verPages.find(p => p.slug === SLUG);
  if (!page) { console.error(`  FAIL: ${SLUG} not found.`); anyFail = true; continue; }

  const items = JSON.parse(page.datesJson) as Array<Record<string, unknown>>;

  let remaining = 0;
  for (const item of items) {
    const en = (item["label_en"] as string | undefined) ?? "";
    const ru = (item["label_ru"] as string | undefined) ?? "";
    if (en.includes("  --") || ru.includes("  --")) {
      console.error(`  FAIL: ${SLUG} / ${item["id"]}: still contains "  --"`);
      anyFail = true;
      remaining++;
    }
  }

  if (remaining === 0) {
    log(`  ${SLUG}: no "  --" remaining.  PASS`);
  }

  // Spot-check known clean items remain intact
  const decEns = SLUG.includes("december")
    ? items.find(x => x["id"] === "DEC-ENS")
    : null;
  if (decEns) {
    const label = (decEns["label_en"] as string | undefined) ?? "";
    if (!label.includes("Expand North Star") || !label.includes("-- co-located")) {
      console.error(`  FAIL: DEC-ENS label_en changed unexpectedly.`);
      anyFail = true;
    } else {
      log(`  DEC-ENS label_en intact.  PASS`);
    }
  }

  const decCtax = SLUG.includes("december")
    ? items.find(x => x["id"] === "DEC-CTAX")
    : null;
  if (decCtax) {
    const label = (decCtax["label_en"] as string | undefined) ?? "";
    if (!label.includes("31 December 2026 -- for companies")) {
      console.error(`  FAIL: DEC-CTAX label_en unexpected after fix.`);
      anyFail = true;
    } else {
      log(`  DEC-CTAX: "31 December 2026 -- for companies"  PASS`);
    }
  }

  const novGfmfg = SLUG.includes("november")
    ? items.find(x => x["id"] === "NOV-GFMFG")
    : null;
  if (novGfmfg) {
    const label = (novGfmfg["label_en"] as string | undefined) ?? "";
    if (!label.includes("Gulfood Manufacturing") || !label.includes("-- 2,500+")) {
      console.error(`  FAIL: NOV-GFMFG label_en changed unexpectedly.`);
      anyFail = true;
    } else {
      log(`  NOV-GFMFG label_en intact.  PASS`);
    }
  }

  // Confirm no em dashes in any item
  for (const item of items) {
    for (const f of ["label_en", "label_ru", "notes_en", "notes_ru"] as const) {
      const v = (item[f] as string | undefined) ?? "";
      if (hasEmDash(v)) {
        console.error(`  FAIL: ${SLUG}/${item["id"]} field "${f}" contains em dash.`);
        anyFail = true;
      }
    }
  }
  log(`  ${SLUG}: no em dashes.  PASS`);
}

if (anyFail) abort("Post-fix verification failed. See FAIL lines above.");

section("Fix complete -- summary");
log(`
DB PATH: ${DB_PATH}
BACKUP:  ${BACKUP_PATH}

Total items changed: ${totalFixCount}

Items fixed:
  DEC-CTAX  (december-2026-uae-calendar): label_en, label_ru
  DEC-EMIR  (december-2026-uae-calendar): label_en, label_ru
  NOV-R1    (november-2026-dubai-calendar): label_en, label_ru
  NOV-DPWT  (november-2026-dubai-calendar): label_en, label_ru
  NOV-DFTS  (november-2026-dubai-calendar): label_en, label_ru

Change: "  --" -> " --" (removed double space before double dash)

Facts unchanged: dates, sources, IDs, structure, detail_url, confidence, source_status.

Owner approval required before commit/deploy.
`);

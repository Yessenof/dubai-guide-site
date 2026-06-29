/**
 * Phase 6C-CALENDAR-LABEL-FIX-01 -- Calendar Label Dash Cosmetic Fix (Local)
 * LOCAL ONLY -- refuses to run on production server paths.
 *
 * Fixes: "  --" (double space + double dash) -> " --" (single space + double dash)
 * in label_en, label_ru, cta_label_en, cta_label_ru, brief_ru of affected items
 * in November and December 2026 calendars.
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

section("Phase 6C-CALENDAR-LABEL-FIX-01 -- Local Fix (extended)");
log(`  DB path:   ${DB_PATH}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Backup ----------------------------------------------------------------

section("Creating DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);
const TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-label-fix-01b-${TS}`;
fs.copyFileSync(DB_PATH, BACKUP_PATH);
if (fs.statSync(BACKUP_PATH).size === 0) abort("Backup is empty.");
log(`  Backup: ${BACKUP_PATH}  PASS`);

// ---- Fix function ----------------------------------------------------------

/** Replace "  --" (double space) with " --" (single space). */
function fixField(value: string | undefined): string {
  if (!value) return value ?? "";
  return value.replace(/  --/g, " --");
}

/** Verify no em dashes remain (admin API guard). */
function hasEmDash(s: string): boolean {
  return s.includes("—");
}

// ---- Target fields per item ID ---------------------------------------------
// November: label_en/label_ru already fixed in pass 1; add brief_ru
// December: label_en/label_ru already fixed in pass 1; add cta_label_en/ru + brief_ru

const TARGET_FIELDS: Record<string, string[]> = {
  "NOV-R1":   ["label_en", "label_ru", "brief_ru"],
  "NOV-DPWT": ["label_en", "label_ru", "brief_ru"],
  "NOV-DFTS": ["label_en", "label_ru", "brief_ru"],
  "DEC-CTAX": ["label_en", "label_ru", "cta_label_en", "cta_label_ru", "brief_ru"],
  "DEC-EMIR": ["label_en", "label_ru", "cta_label_en", "cta_label_ru", "brief_ru"],
};

const AFFECTED_IDS_NOV = new Set(["NOV-R1", "NOV-DPWT", "NOV-DFTS"]);
const AFFECTED_IDS_DEC = new Set(["DEC-CTAX", "DEC-EMIR"]);

let totalItemsChanged = 0;
let totalFieldsChanged = 0;

// ---- Apply fixes -----------------------------------------------------------

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
  let pageItemsChanged = 0;

  const fixedItems = items.map(item => {
    const id = item["id"] as string;
    if (!AFFECTED_IDS.has(id)) return item;

    const fields = TARGET_FIELDS[id] ?? [];
    const updates: Record<string, string> = {};
    let itemChanged = false;

    for (const field of fields) {
      const orig = (item[field] as string | undefined) ?? "";
      const fixed = fixField(orig);
      if (fixed !== orig) {
        if (hasEmDash(fixed)) abort(`${id}.${field}: em dash detected after fix.`);
        updates[field] = fixed;
        itemChanged = true;
        totalFieldsChanged++;
        log(`  ${id}.${field}: "${orig.slice(0, 65)}..."`);
        log(`          -> "${fixed.slice(0, 65)}..."`);
      }
    }

    if (!itemChanged) {
      log(`  ${id}: all target fields already clean.`);
      return item;
    }

    pageItemsChanged++;
    totalItemsChanged++;
    return { ...item, ...updates };
  });

  // Guard: non-affected items must be byte-identical
  for (const [orig, fixed] of items.map((o, i) => [o, fixedItems[i]])) {
    const id = orig["id"] as string;
    if (AFFECTED_IDS.has(id)) continue;
    if (JSON.stringify(orig) !== JSON.stringify(fixed)) {
      abort(`Non-affected item ${id} was modified unexpectedly.`);
    }
  }

  if (pageItemsChanged === 0) {
    log(`  No changes needed for ${SLUG} -- all fields already clean.`);
    continue;
  }

  const upd = updateCalendarDraft(page.id, { dates_json: JSON.stringify(fixedItems) });
  if (!upd.ok) abort(`updateCalendarDraft ${SLUG} failed: ${JSON.stringify(upd.errors)}`);
  log(`  updateCalendarDraft: OK  (${pageItemsChanged} item(s) changed)`);

  const pub = publishCalendar(page.id);
  if (!pub.ok) abort(`publishCalendar ${SLUG} failed: ${JSON.stringify(pub.errors)}`);
  log(`  publishCalendar: OK  Warnings: ${pub.warnings.length ? pub.warnings.join("; ") : "none"}`);
}

// ---- Post-fix verification -------------------------------------------------

section("Post-fix verification");

const verPages = getAllCalendarPages();
let anyFail = false;

const CHECK_FIELDS = ["label_en", "label_ru", "cta_label_en", "cta_label_ru", "brief_en", "brief_ru"];

for (const SLUG of ["november-2026-dubai-calendar", "december-2026-uae-calendar"]) {
  const page = verPages.find(p => p.slug === SLUG);
  if (!page) { console.error(`  FAIL: ${SLUG} not found.`); anyFail = true; continue; }

  const items = JSON.parse(page.datesJson) as Array<Record<string, unknown>>;
  let remaining = 0;

  for (const item of items) {
    for (const f of CHECK_FIELDS) {
      const v = (item[f] as string | undefined) ?? "";
      if (v.includes("  --")) {
        console.error(`  FAIL: ${item["id"]}.${f} still has "  --": ${v.slice(0,80)}`);
        anyFail = true;
        remaining++;
      }
      if (hasEmDash(v)) {
        console.error(`  FAIL: ${item["id"]}.${f} has em dash.`);
        anyFail = true;
      }
    }
  }

  if (remaining === 0) log(`  ${SLUG}: no "  --" in any checked field.  PASS`);

  // Spot-checks
  if (SLUG.includes("december")) {
    const ens = items.find(x => x["id"] === "DEC-ENS");
    if (ens) {
      const label = (ens["label_en"] as string | undefined) ?? "";
      if (!label.includes("Expand North Star") || !label.includes("-- co-located")) {
        console.error(`  FAIL: DEC-ENS label_en changed.`); anyFail = true;
      } else {
        log(`  DEC-ENS label_en intact.  PASS`);
      }
    }
    const ctax = items.find(x => x["id"] === "DEC-CTAX");
    if (ctax) {
      const label = (ctax["label_en"] as string | undefined) ?? "";
      const cta   = (ctax["cta_label_en"] as string | undefined) ?? "";
      if (!label.includes("31 December 2026 -- for companies")) {
        console.error(`  FAIL: DEC-CTAX label_en wrong.`); anyFail = true;
      } else {
        log(`  DEC-CTAX label_en clean.  PASS`);
      }
      if (cta.includes("  --")) {
        console.error(`  FAIL: DEC-CTAX cta_label_en still has "  --".`); anyFail = true;
      } else {
        log(`  DEC-CTAX cta_label_en: "${cta}"  PASS`);
      }
    }
    const emir = items.find(x => x["id"] === "DEC-EMIR");
    if (emir) {
      const cta = (emir["cta_label_en"] as string | undefined) ?? "";
      if (cta.includes("  --")) {
        console.error(`  FAIL: DEC-EMIR cta_label_en still has "  --".`); anyFail = true;
      } else {
        log(`  DEC-EMIR cta_label_en: "${cta}"  PASS`);
      }
    }
  }

  if (SLUG.includes("november")) {
    const gfmfg = items.find(x => x["id"] === "NOV-GFMFG");
    if (gfmfg) {
      const label = (gfmfg["label_en"] as string | undefined) ?? "";
      if (!label.includes("Gulfood Manufacturing") || !label.includes("-- 2,500+")) {
        console.error(`  FAIL: NOV-GFMFG label_en changed.`); anyFail = true;
      } else {
        log(`  NOV-GFMFG label_en intact.  PASS`);
      }
    }
  }
}

if (anyFail) abort("Post-fix verification failed. See FAIL lines above.");

section("Fix complete -- summary");
log(`
DB PATH: ${DB_PATH}
BACKUP:  ${BACKUP_PATH}

Items changed: ${totalItemsChanged}
Fields changed: ${totalFieldsChanged}

Items fixed (this run covers cta_label_en/ru and brief_ru):
  DEC-CTAX  (december): label_en, label_ru (already clean), cta_label_en, cta_label_ru, brief_ru
  DEC-EMIR  (december): label_en, label_ru (already clean), cta_label_en, cta_label_ru, brief_ru
  NOV-R1    (november): label_en, label_ru (already clean), brief_ru
  NOV-DPWT  (november): label_en, label_ru (already clean), brief_ru
  NOV-DFTS  (november): label_en, label_ru (already clean), brief_ru

Change: "  --" -> " --" (removed double space before double dash)

Facts unchanged: dates, sources, IDs, structure, detail_url, confidence, source_status.
`);

/**
 * Phase 6C-CALENDAR-LABEL-FIX-01 -- Calendar Label Dash Cosmetic Fix (Production)
 * PRODUCTION script -- run on server after owner approval + code deploy.
 *
 * Fixes: "  --" (double space + double dash) -> " --" (single space + double dash)
 * in label_en, label_ru, cta_label_en, cta_label_ru, brief_ru of affected items
 * in November and December 2026 calendars.
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

section("Phase 6C-CALENDAR-LABEL-FIX-01 -- Production Fix (extended)");
const DB_PATH = path.resolve(process.cwd(), "data", "guides.db");
log(`  DB path:   ${DB_PATH}`);
log(`  Timestamp: ${new Date().toISOString()}`);

section("Creating DB backup");
if (!fs.existsSync(DB_PATH)) abort(`DB not found: ${DB_PATH}`);
const TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const BACKUP_PATH = `${DB_PATH}.backup-pre-label-fix-01b-prod-${TS}`;
fs.copyFileSync(DB_PATH, BACKUP_PATH);
if (fs.statSync(BACKUP_PATH).size === 0) abort("Backup is empty.");
log(`  Backup: ${BACKUP_PATH}  PASS`);

function fixField(value: string | undefined): string {
  if (!value) return value ?? "";
  return value.replace(/  --/g, " --");
}

function hasEmDash(s: string): boolean { return s.includes("—"); }

// November: label_en/label_ru fixed in first pass; add brief_ru
// December: label_en/label_ru fixed in first pass; add cta_label_en/ru + brief_ru
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

for (const [SLUG, AFFECTED_IDS] of [
  ["november-2026-dubai-calendar", AFFECTED_IDS_NOV],
  ["december-2026-uae-calendar",   AFFECTED_IDS_DEC],
] as [string, Set<string>][]) {

  section(`Processing ${SLUG}`);

  const page = getAllCalendarPages().find(p => p.slug === SLUG);
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
      const orig  = (item[field] as string | undefined) ?? "";
      const fixed = fixField(orig);
      if (fixed !== orig) {
        if (hasEmDash(fixed)) abort(`${id}.${field}: em dash detected after fix.`);
        updates[field] = fixed;
        itemChanged = true;
        totalFieldsChanged++;
        log(`  ${id}.${field} fixed`);
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
    log(`  No changes needed -- all fields already clean.`);
    continue;
  }

  const upd = updateCalendarDraft(page.id, { dates_json: JSON.stringify(fixedItems) });
  if (!upd.ok) abort(`updateCalendarDraft ${SLUG} failed: ${JSON.stringify(upd.errors)}`);
  log(`  updateCalendarDraft: OK  (${pageItemsChanged} item(s))`);

  const pub = publishCalendar(page.id);
  if (!pub.ok) abort(`publishCalendar ${SLUG} failed: ${JSON.stringify(pub.errors)}`);
  log(`  publishCalendar: OK`);
}

section("Post-fix verification");

let anyFail = false;
const verPages = getAllCalendarPages();
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
        console.error(`  FAIL: ${item["id"]}.${f} still has "  --"`);
        anyFail = true;
        remaining++;
      }
      if (hasEmDash(v)) {
        console.error(`  FAIL: ${item["id"]}.${f} has em dash.`);
        anyFail = true;
      }
    }
  }

  if (remaining === 0) log(`  ${SLUG}: clean.  PASS`);

  if (SLUG.includes("december")) {
    const ctax = items.find(x => x["id"] === "DEC-CTAX");
    if (ctax) {
      const cta = (ctax["cta_label_en"] as string | undefined) ?? "";
      if (cta.includes("  --")) {
        console.error(`  FAIL: DEC-CTAX cta_label_en still dirty.`); anyFail = true;
      } else {
        log(`  DEC-CTAX cta_label_en: "${cta}"  PASS`);
      }
    }
    const emir = items.find(x => x["id"] === "DEC-EMIR");
    if (emir) {
      const cta = (emir["cta_label_en"] as string | undefined) ?? "";
      if (cta.includes("  --")) {
        console.error(`  FAIL: DEC-EMIR cta_label_en still dirty.`); anyFail = true;
      } else {
        log(`  DEC-EMIR cta_label_en: "${cta}"  PASS`);
      }
    }
    const ens = items.find(x => x["id"] === "DEC-ENS");
    if (ens) {
      const label = (ens["label_en"] as string | undefined) ?? "";
      if (!label.includes("Expand North Star") || !label.includes("-- co-located")) {
        console.error(`  FAIL: DEC-ENS label_en changed.`); anyFail = true;
      } else {
        log(`  DEC-ENS intact.  PASS`);
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
        log(`  NOV-GFMFG intact.  PASS`);
      }
    }
  }
}

if (anyFail) abort("Verification failed.");

section("Production fix complete -- ALL PASS");
log(`DB: ${DB_PATH}`);
log(`Backup: ${BACKUP_PATH}`);
log(`Items changed: ${totalItemsChanged}  Fields changed: ${totalFieldsChanged}`);

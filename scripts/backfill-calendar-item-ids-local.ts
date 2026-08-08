/**
 * PRE-FRESH-01-ID-02 -- Legacy Calendar Item Identity Backfill (LOCAL ONLY)
 *
 * Assigns a persisted, stable `id` to the 21 calendar_pages.dates_json items
 * that currently have none, per the PRE-FRESH-01-ID-01 audit (owner-approved
 * Option B: page-instance identity -- no id is shared across pages, even
 * when two pages describe the same real-world holiday/deadline).
 *
 * Every id below is fixed at authoring time, not derived at runtime. There
 * is no fallback identity logic anywhere in this script or in the app --
 * an item either already has an id, or this script assigns it one of the
 * exact 21 values below. Nothing else can ever produce a calendar_item id.
 *
 * Safety model:
 *   - Refuses to run without an explicit --db <path> (no default path).
 *   - Refuses any path containing a known production directory segment.
 *   - Dry-run by default; only --apply performs a write.
 *   - Preconditions (exact 123/102/21 counts, per-item content fingerprint
 *     match, id uniqueness) must all pass before any write is attempted --
 *     a fingerprint mismatch means the target item's content has drifted
 *     since the ID-01 audit, and the run aborts rather than patching stale
 *     data.
 *   - --apply backs up the DB file first, then performs all 21 assignments
 *     (5 UPDATE statements, one per page) inside a single SQLite transaction.
 *   - Post-write validation re-reads the DB and checks: final counts are
 *     123/123/0, every other field on every touched item is byte-for-byte
 *     unchanged (deep-equal, id key excluded), and there are zero exact or
 *     case-insensitive id duplicates across the full corpus. Any failure
 *     restores the pre-write backup and exits non-zero.
 *
 * Run:
 *   npx tsx scripts/backfill-calendar-item-ids-local.ts --db data/guides.db            (dry run, no writes)
 *   npx tsx scripts/backfill-calendar-item-ids-local.ts --db data/guides.db --apply    (writes, after backup)
 */

import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// ---- CLI args ---------------------------------------------------------------

function parseArgs(argv: string[]): { dbPath?: string; apply: boolean } {
  let dbPath: string | undefined;
  let apply = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--db") {
      dbPath = argv[i + 1];
      i++;
    } else if (argv[i] === "--apply") {
      apply = true;
    }
  }
  return { dbPath, apply };
}

function log(msg: string): void {
  console.log(msg);
}
function section(t: string): void {
  console.log(`\n-- ${t} ${"-".repeat(Math.max(0, 55 - t.length))}`);
}
function abort(msg: string): never {
  console.error(`\nABORT: ${msg}`);
  process.exit(1);
}

const { dbPath, apply } = parseArgs(process.argv.slice(2));

if (!dbPath) {
  abort(
    "Missing required --db <path> argument.\n" +
      "  Dry run: npx tsx scripts/backfill-calendar-item-ids-local.ts --db data/guides.db\n" +
      "  Apply:   npx tsx scripts/backfill-calendar-item-ids-local.ts --db data/guides.db --apply"
  );
}

const RESOLVED_DB_PATH = path.resolve(process.cwd(), dbPath);

// Hard production-path guard, mirroring scripts/fix-calendar-label-dashes-local.ts.
const PRODUCTION_PATHS = ["/var/www/", "/var/app/", "/srv/www/"];
for (const p of PRODUCTION_PATHS) {
  if (RESOLVED_DB_PATH.includes(p)) {
    abort(`Production path detected in --db: ${RESOLVED_DB_PATH}. This script is LOCAL ONLY.`);
  }
}

if (!fs.existsSync(RESOLVED_DB_PATH)) abort(`DB not found: ${RESOLVED_DB_PATH}`);

section("PRE-FRESH-01-ID-02 -- Calendar Item Identity Backfill");
log(`  DB path:   ${RESOLVED_DB_PATH}`);
log(`  Mode:      ${apply ? "APPLY (will write)" : "DRY RUN (no writes)"}`);
log(`  Timestamp: ${new Date().toISOString()}`);

// ---- Canonical fingerprint ---------------------------------------------------
// Sorted-key JSON of every field except `id`, hashed with SHA-256. Used to
// detect drift between the ID-01 audit (when these values were captured)
// and this run -- if a target item's content has changed since the audit,
// the fingerprint will not match and the run aborts before writing anything.

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = canonicalize((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

function fingerprint(item: Record<string, unknown>): string {
  const { id: _id, ...rest } = item;
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(rest))).digest("hex");
}

// ---- Fixed target list (21 items) -------------------------------------------
// Captured verbatim from the PRE-FRESH-01-ID-01 audit. Page-instance identity
// (owner decision, Option B): each entry is independent even when another
// page describes the same real-world fact -- e.g. LONGWKND-03-COMMEM stays
// distinct from the existing DEC-01-COMMEM.

interface Target {
  slug: string;
  idx: number;
  id: string;
  expectedFingerprint: string;
}

const TARGETS: Target[] = [
  { slug: "may-2026-uae-calendar", idx: 0, id: "MAY-01-EIDFED", expectedFingerprint: "76e88c3134cfaf5c646eaaa1465b7283b319d4a679a36b3a81cfb1b60ad0823d" },
  { slug: "may-2026-uae-calendar", idx: 1, id: "MAY-02-EIDBEGIN", expectedFingerprint: "c4b3ba18fe59dc1a23f8732c90ed91234e93d7781665164e41d3071db6a63795" },
  { slug: "may-2026-uae-calendar", idx: 2, id: "MAY-03-BRKWIN", expectedFingerprint: "35067ec257b861803f01321a4d438ef8208d5af7f0e52e5309e52cb75c4eb92c" },
  { slug: "may-2026-uae-calendar", idx: 3, id: "MAY-04-EIDPRIV", expectedFingerprint: "b562a28d1266068a1cdf3da06486368181009abe061aef683ca8999e72d94e89" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 0, id: "COMPLY-01-DMCCDIFC", expectedFingerprint: "3187850bf36c3f9eca03b6a176d7c78be6056011e2e05e02b1771372d23e7456" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 1, id: "COMPLY-02-EINVASPLARGE", expectedFingerprint: "9b9022c913d9dc3ffaf369f5d2621e1d0b356f076e59d5d4821c66f58d16c35a" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 2, id: "COMPLY-03-CTRETURN", expectedFingerprint: "3a4ecb8f294e303ac770ed160406274c12a3ada7777342594dd0a1d0dec66eac" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 3, id: "COMPLY-04-EINVGOLARGE", expectedFingerprint: "fbfb79401b8d4e8e7aab35c60bee63f470385dc69885bd2473bd9d263942d099" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 4, id: "COMPLY-05-AMLOPEN", expectedFingerprint: "507eb6ab12ed2773a69dc8b0abcc32a193a4bfcaa3afbd51950bb065d1d29a21" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 5, id: "COMPLY-06-AMLCLOSE", expectedFingerprint: "057656272986740b9a808c326509cf1f8dc0dfdc0e1f6431a00c07992c35734c" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 6, id: "COMPLY-07-EINVASPSME", expectedFingerprint: "faaba240b68b658ca6a5bbb05c402cc78544470c0a861520c2038656bdc67cb2" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 7, id: "COMPLY-08-CTREGNAT", expectedFingerprint: "1bcf078508fa707df75e66725e2ea67d56bec562d0c22d51ee295a4573e6a5b7" },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 8, id: "COMPLY-09-EINVGOSME", expectedFingerprint: "86be943e30d73792031450829d6257d530b9b2a18aa3dac4989b6ce9245161a7" },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 0, id: "EINV-01-PILOT", expectedFingerprint: "d901e96b27f1c47ffc75fb7e70bff48f6266d5dde7ab28fbd067c6ae8f18bdf1" },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 1, id: "EINV-02-ASPLARGE", expectedFingerprint: "11871b30cd427adc11563e93baa4d5a1a57cd04528270265fe6affe8b859be5c" },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 2, id: "EINV-03-GOLIVELARGE", expectedFingerprint: "d692fab8cc529f93aa7be23e3582df29f22e4abcd8eb4982f7494b01a9522b2f" },
  { slug: "uae-emiratisation-june-30-2026-reminder", idx: 0, id: "EMIRAT-01-50PLUS", expectedFingerprint: "d129e6fe6959d08d5ddf836b7cb3bc143b78e8e6ac6bfabcee7e6eba58260e38" },
  { slug: "uae-long-weekends-2026-2027", idx: 0, id: "LONGWKND-01-NEWYEAR", expectedFingerprint: "2d4ea1139faa620b0e74b200f721653044f77fe138aaf53d6e08be86475b33e1" },
  { slug: "uae-long-weekends-2026-2027", idx: 1, id: "LONGWKND-02-EIDFITR", expectedFingerprint: "48b0ec00b23e8ed83cef79986b87bcf75cfcede39022761aefe532c3bc5ad8ea" },
  { slug: "uae-long-weekends-2026-2027", idx: 2, id: "LONGWKND-03-COMMEM", expectedFingerprint: "03e5e1be5ee3bd420d9207f26994fa89cf648a91ef371cf90ccaebee3b5472ce" },
  { slug: "uae-long-weekends-2026-2027", idx: 3, id: "LONGWKND-04-NATDAY", expectedFingerprint: "6adcc4c28e3c3e2d587d194cb9bea1fbbb643e35c0bd7f2cdae6177aabba2e41" },
];

if (TARGETS.length !== 21) abort(`Internal error: TARGETS has ${TARGETS.length} entries, expected 21.`);

// ---- Open DB (read-only for preflight) ---------------------------------------

const db = new Database(RESOLVED_DB_PATH, { readonly: true, fileMustExist: true });

type CalendarItem = Record<string, unknown>;

function loadAllPages(): { slug: string; items: CalendarItem[] }[] {
  const rows = db.prepare("SELECT slug, dates_json FROM calendar_pages").all() as {
    slug: string;
    dates_json: string;
  }[];
  return rows.map((r) => ({ slug: r.slug, items: JSON.parse(r.dates_json) as CalendarItem[] }));
}

// ---- Preconditions ------------------------------------------------------------

section("Preconditions");

const pagesBefore = loadAllPages();
const allItemsBefore = pagesBefore.flatMap((p) => p.items);
const totalCount = allItemsBefore.length;
const withIdCount = allItemsBefore.filter((it) => it.id).length;
const withoutIdCount = totalCount - withIdCount;

log(`  Total items:      ${totalCount}`);
log(`  With id:          ${withIdCount}`);
log(`  Without id:       ${withoutIdCount}`);

if (totalCount !== 123) abort(`Expected 123 total items, found ${totalCount}. Corpus has changed since the ID-01 audit -- do not proceed.`);
if (withIdCount !== 102) abort(`Expected 102 items with id, found ${withIdCount}. Corpus has changed since the ID-01 audit -- do not proceed.`);
if (withoutIdCount !== 21) abort(`Expected 21 items without id, found ${withoutIdCount}. Corpus has changed since the ID-01 audit -- do not proceed.`);

log("  Count precondition: PASS (123 / 102 / 21)");

// Fingerprint match for every target item.
const pageIndex = new Map(pagesBefore.map((p) => [p.slug, p.items]));
for (const t of TARGETS) {
  const items = pageIndex.get(t.slug);
  if (!items) abort(`Target page not found: ${t.slug}`);
  const item = items[t.idx];
  if (!item) abort(`Target index out of range: ${t.slug}[${t.idx}]`);
  if (item.id) abort(`Target ${t.slug}[${t.idx}] already has an id ("${item.id}") -- refusing to overwrite an existing id.`);
  const actual = fingerprint(item);
  if (actual !== t.expectedFingerprint) {
    abort(
      `Fingerprint mismatch for ${t.slug}[${t.idx}] (intended id ${t.id}).\n` +
        `  expected: ${t.expectedFingerprint}\n` +
        `  actual:   ${actual}\n` +
        `This item's content has changed since the ID-01 audit -- do not proceed with a stale plan.`
    );
  }
}
log(`  Fingerprint precondition: PASS (all ${TARGETS.length} target items match the ID-01 audit snapshot)`);

// Proposed-id uniqueness: among themselves, and against the existing 102.
const proposedIds = TARGETS.map((t) => t.id);
const proposedSet = new Set(proposedIds);
if (proposedSet.size !== proposedIds.length) abort("Proposed IDs are not unique among themselves.");

const existingIds = allItemsBefore.map((it) => it.id).filter((v): v is string => typeof v === "string" && v.length > 0);
const existingSet = new Set(existingIds);
for (const id of proposedIds) {
  if (existingSet.has(id)) abort(`Proposed id "${id}" collides with an existing id.`);
}
const existingLower = new Set(existingIds.map((v) => v.toLowerCase()));
for (const id of proposedIds) {
  if (existingLower.has(id.toLowerCase())) abort(`Proposed id "${id}" collides case-insensitively with an existing id.`);
}
log(`  Uniqueness precondition: PASS (21 proposed ids, 0 collisions against ${existingIds.length} existing ids)`);

db.close();

if (!apply) {
  section("Dry run complete -- no writes performed");
  log("  All preconditions passed. Re-run with --apply to perform the backfill.");
  log("\n  Planned assignments:");
  for (const t of TARGETS) log(`    ${t.slug}[${t.idx}]  ->  ${t.id}`);
  process.exit(0);
}

// ---- Apply ---------------------------------------------------------------------

section("Backup");

const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19).replace("T", "-");
const backupDir = path.resolve(process.cwd(), "backups", "local");
fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, `guides-db-pre-id-backfill-${ts}.db`);
fs.copyFileSync(RESOLVED_DB_PATH, backupPath);
if (fs.statSync(backupPath).size === 0) abort("Backup is empty.");
log(`  Backup: ${backupPath}  PASS`);

section("Applying backfill (single transaction)");

const writeDb = new Database(RESOLVED_DB_PATH);

// Pre-write fingerprints of every OTHER field for every touched item, keyed
// by slug+idx, so post-write validation can prove nothing but `id` changed.
const preWriteFingerprints = new Map<string, string>();
for (const t of TARGETS) preWriteFingerprints.set(`${t.slug}[${t.idx}]`, t.expectedFingerprint);

const applyTx = writeDb.transaction(() => {
  const bySlug = new Map<string, Target[]>();
  for (const t of TARGETS) {
    if (!bySlug.has(t.slug)) bySlug.set(t.slug, []);
    bySlug.get(t.slug)!.push(t);
  }

  const selectStmt = writeDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?");
  const updateStmt = writeDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?");

  for (const [slug, targets] of bySlug) {
    const row = selectStmt.get(slug) as { dates_json: string } | undefined;
    if (!row) throw new Error(`Page disappeared mid-transaction: ${slug}`);
    const items = JSON.parse(row.dates_json) as CalendarItem[];

    for (const t of targets) {
      const item = items[t.idx];
      if (!item || item.id) throw new Error(`Target ${slug}[${t.idx}] invalid at write time.`);
      item.id = t.id; // ONLY key added -- every other key on the object is untouched.
    }

    const result = updateStmt.run(JSON.stringify(items), slug);
    if (result.changes !== 1) throw new Error(`Update did not affect exactly 1 row for ${slug} (changes=${result.changes}).`);
    log(`  ${slug}: ${targets.length} item(s) assigned an id.`);
  }
});

try {
  applyTx();
  log("  Transaction: COMMIT");
} catch (err) {
  writeDb.close();
  fs.copyFileSync(backupPath, RESOLVED_DB_PATH);
  abort(`Transaction failed, DB restored from backup: ${(err as Error).message}`);
}

writeDb.close();

// ---- Post-write validation -------------------------------------------------

section("Post-write validation");

const verifyDb = new Database(RESOLVED_DB_PATH, { readonly: true, fileMustExist: true });
const verifySelect = verifyDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?");

let validationFailed = false;
const fail = (msg: string) => {
  console.error(`  FAIL: ${msg}`);
  validationFailed = true;
};

// 1. Every target item now carries its exact proposed id, and every other
//    field is unchanged (fingerprint recomputed with id excluded again).
for (const t of TARGETS) {
  const row = verifySelect.get(t.slug) as { dates_json: string } | undefined;
  if (!row) { fail(`Page missing after write: ${t.slug}`); continue; }
  const items = JSON.parse(row.dates_json) as CalendarItem[];
  const item = items[t.idx];
  if (!item) { fail(`Item missing after write: ${t.slug}[${t.idx}]`); continue; }
  if (item.id !== t.id) { fail(`${t.slug}[${t.idx}]: expected id "${t.id}", found "${item.id}"`); continue; }
  const postFp = fingerprint(item);
  if (postFp !== t.expectedFingerprint) {
    fail(`${t.slug}[${t.idx}] (${t.id}): non-id fields changed. pre=${t.expectedFingerprint} post=${postFp}`);
  }
}

// 2. Global counts: 123 total / 123 with id / 0 without id.
const pagesAfter = loadAllPagesFrom(verifyDb);
const allItemsAfter = pagesAfter.flatMap((p) => p.items);
const totalAfter = allItemsAfter.length;
const withIdAfter = allItemsAfter.filter((it) => it.id).length;
const withoutIdAfter = totalAfter - withIdAfter;

if (totalAfter !== 123) fail(`Total item count changed: expected 123, found ${totalAfter}.`);
if (withIdAfter !== 123) fail(`With-id count wrong: expected 123, found ${withIdAfter}.`);
if (withoutIdAfter !== 0) fail(`Without-id count wrong: expected 0, found ${withoutIdAfter}.`);

// 3. Zero exact and zero case-insensitive duplicate ids across the full corpus.
const idsAfter = allItemsAfter.map((it) => it.id as string);
const exactSet = new Set(idsAfter);
if (exactSet.size !== idsAfter.length) fail(`Exact duplicate ids found: ${idsAfter.length} ids, ${exactSet.size} unique.`);
const lowerSet = new Set(idsAfter.map((v) => v.toLowerCase()));
if (lowerSet.size !== idsAfter.length) fail(`Case-insensitive duplicate ids found: ${idsAfter.length} ids, ${lowerSet.size} unique case-insensitively.`);

// 4. Non-target items (the original 102, plus any item on a target page NOT
//    in TARGETS -- none exist here, but check generically) must be byte-for-
//    byte unchanged.
const targetKeys = new Set(TARGETS.map((t) => `${t.slug}[${t.idx}]`));
for (const page of pagesBefore) {
  const afterPage = pagesAfter.find((p) => p.slug === page.slug);
  if (!afterPage) { fail(`Page missing after write: ${page.slug}`); continue; }
  for (let i = 0; i < page.items.length; i++) {
    const key = `${page.slug}[${i}]`;
    if (targetKeys.has(key)) continue;
    const before = JSON.stringify(canonicalize(page.items[i]));
    const after = JSON.stringify(canonicalize(afterPage.items[i]));
    if (before !== after) fail(`Non-target item changed unexpectedly: ${key}`);
  }
}

function loadAllPagesFrom(source: Database.Database): { slug: string; items: CalendarItem[] }[] {
  const rows = source.prepare("SELECT slug, dates_json FROM calendar_pages").all() as {
    slug: string;
    dates_json: string;
  }[];
  return rows.map((r) => ({ slug: r.slug, items: JSON.parse(r.dates_json) as CalendarItem[] }));
}

verifyDb.close();

if (validationFailed) {
  fs.copyFileSync(backupPath, RESOLVED_DB_PATH);
  abort("Post-write validation failed. DB restored from backup. See FAIL lines above.");
}

log(`  Target items:      21/21 carry their exact proposed id, all other fields unchanged.  PASS`);
log(`  Global counts:     123 total / 123 with id / 0 without id.  PASS`);
log(`  Duplicate check:   0 exact, 0 case-insensitive.  PASS`);
log(`  Non-target items:  unchanged (byte-for-byte, key order and formatting aside).  PASS`);

section("Backfill complete -- summary");
log(`
DB PATH: ${RESOLVED_DB_PATH}
BACKUP:  ${backupPath}

Items assigned an id: 21
Pages touched:        5 (may-2026-uae-calendar, uae-business-compliance-calendar-2026-2027,
                          uae-e-invoicing-2026-asp-deadline, uae-emiratisation-june-30-2026-reminder,
                          uae-long-weekends-2026-2027)

Identity model: page-instance (Option B) -- no id shared across pages.
Fallback identity logic introduced: NONE.
Fields modified per item: id only.
`);

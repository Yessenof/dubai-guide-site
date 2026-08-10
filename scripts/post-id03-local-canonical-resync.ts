/**
 * POST-ID-03 -- Local Canonical Resync (LOCAL ONLY -- NO PRODUCTION WRITES).
 *
 * Brings exactly two owner-approved production deltas into the LOCAL
 * database, derived live from a supplied WAL-safe production snapshot --
 * never reconstructed from memory or docs:
 *
 *   (A) Add the 4 missing July items (JUL-NEW-04..07) that exist in
 *       production but not locally, copied verbatim from the snapshot,
 *       appended after the existing 6 local July items in production order.
 *   (B) Replace the local AUG-NEW-02 (Mawlid Al Nabi) item with the
 *       production-canonical confirmed object (date, confidence,
 *       source_status, brief_en, brief_ru).
 *
 * Everything else in the local corpus -- including three explicitly
 * owner-approved local wording variants (JUL-NEW-02, AUG-6D-07, AUG-6D-06)
 * that differ from production on purpose -- must remain byte-for-byte
 * unchanged. This is a TARGETED resync, not a byte-identical merge: see
 * PROTECTED_ITEMS in scripts/lib/post-id03-local-canonical-resync-core.ts.
 *
 * Safety model (mirrors scripts/backfill-calendar-item-ids-local.ts):
 *   - Refuses to run without explicit --local-db <path> and
 *     --production-snapshot <path> (no defaults).
 *   - Refuses any --local-db path that resolves -- after following symlinks
 *     and ignoring case -- to a location under a known production root.
 *   - Dry-run by default; only --apply performs a write. --apply also
 *     requires an explicit --backup-dir <path>.
 *   - Preconditions (exact local/production baselines, production snapshot
 *     integrity + logical-digest match against the audited value, target
 *     presence/absence, protected-item and draft-page fingerprint capture)
 *     must all pass before any backup or write is attempted.
 *   - --apply backs up the local DB file first (WAL-safe online backup into
 *     an atomically-reserved unique directory, verified against the
 *     pre-write logical digest before the transaction proceeds), then
 *     performs both mutations inside a single SQLite transaction
 *     (BEGIN IMMEDIATE) that re-validates every invariant -- including
 *     byte-for-byte preservation of the three protected items and the
 *     local-only compliance draft page -- before allowing SQLite to commit.
 *   - Post-write: an independent re-open of the DB re-derives every
 *     invariant from disk. Any failure at any stage restores the pre-write
 *     backup and exits non-zero.
 *   - No network access. Production is never opened for write access by
 *     this script -- --production-snapshot is read-only input.
 *
 * Run:
 *   npx tsx scripts/post-id03-local-canonical-resync.ts \
 *     --local-db data/guides.db --production-snapshot <path>
 *       (dry run, no writes, --backup-dir not needed)
 *
 *   npx tsx scripts/post-id03-local-canonical-resync.ts \
 *     --local-db data/guides.db --production-snapshot <path> \
 *     --apply --backup-dir backups/local
 *       (writes, after a verified WAL-safe backup in the given directory)
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { resolveRealPathBestEffort } from "../lib/freshness/path-safety";
import { isUnderProtectedRoot, PRODUCTION_ROOTS } from "./lib/calendar-backfill-safety";
import {
  JULY_PAGE_SLUG,
  AUGUST_PAGE_SLUG,
  JULY_TARGET_IDS,
  AUGUST_TARGET_ID,
  PROTECTED_ITEMS,
  COMPLIANCE_DRAFT_PAGE_SLUG,
  EXPECTED_FINAL_TOTAL,
  EXPECTED_FINAL_WITH_ID,
  EXPECTED_FINAL_WITHOUT_ID,
  LOCAL_EXPECTED_PAGES,
  LOCAL_EXPECTED_TOTAL,
  LOCAL_EXPECTED_WITH_ID,
  LOCAL_EXPECTED_WITHOUT_ID,
  PRODUCTION_SNAPSHOT_EXPECTED_PAGES,
  PRODUCTION_SNAPSHOT_EXPECTED_TOTAL,
  PRODUCTION_SNAPSHOT_EXPECTED_WITH_ID,
  PRODUCTION_SNAPSHOT_EXPECTED_WITHOUT_ID,
  checkPreconditions,
  schemaFingerprint,
  reserveBackupDirectory,
  assertBackupDestinationAbsent,
  createOnlineBackup,
  verifyBackup,
  applyTransaction,
  independentPostCommitVerify,
} from "./lib/post-id03-local-canonical-resync-core";

// ---- CLI args ---------------------------------------------------------------

function parseArgs(argv: string[]): { localDb?: string; productionSnapshot?: string; apply: boolean; backupDir?: string } {
  let localDb: string | undefined;
  let productionSnapshot: string | undefined;
  let apply = false;
  let backupDir: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--local-db") {
      localDb = argv[i + 1];
      i++;
    } else if (argv[i] === "--production-snapshot") {
      productionSnapshot = argv[i + 1];
      i++;
    } else if (argv[i] === "--apply") {
      apply = true;
    } else if (argv[i] === "--backup-dir") {
      backupDir = argv[i + 1];
      i++;
    }
  }
  return { localDb, productionSnapshot, apply, backupDir };
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

const USAGE =
  "  Dry run: npx tsx scripts/post-id03-local-canonical-resync.ts --local-db data/guides.db --production-snapshot <path>\n" +
  "  Apply:   npx tsx scripts/post-id03-local-canonical-resync.ts --local-db data/guides.db --production-snapshot <path> --apply --backup-dir backups/local";

async function main(): Promise<void> {
  const { localDb, productionSnapshot, apply, backupDir } = parseArgs(process.argv.slice(2));

  if (!localDb) abort(`Missing required --local-db <path> argument.\n${USAGE}`);
  if (!productionSnapshot) abort(`Missing required --production-snapshot <path> argument.\n${USAGE}`);
  if (apply && !backupDir) abort(`Missing required --backup-dir <path> for --apply (no implicit cwd-relative backup location).\n${USAGE}`);

  // ---- Production-path guard (local-db only) -----------------------------------
  // Same guard as scripts/backfill-calendar-item-ids-local.ts: refuses any
  // --local-db path that resolves -- after following symlinks and ignoring
  // case -- to a location under a known production root. Not applied to
  // --production-snapshot: that argument is a read-only downloaded snapshot
  // file, never written to by this script, so the concern (accidentally
  // writing to a live production DB) does not apply to it.
  const REAL_LOCAL_DB_PATH = resolveRealPathBestEffort(localDb);
  const RESOLVED_PRODUCTION_ROOTS = PRODUCTION_ROOTS.map((literal) => ({ literal, resolved: resolveRealPathBestEffort(literal) }));
  const matchedProductionRoot = RESOLVED_PRODUCTION_ROOTS.find((r) => isUnderProtectedRoot(REAL_LOCAL_DB_PATH, r.resolved));
  if (matchedProductionRoot) {
    abort(
      `Production path detected: --local-db "${localDb}" resolves to real path "${REAL_LOCAL_DB_PATH}", which is ` +
        `under the protected root "${matchedProductionRoot.literal}" (resolved: "${matchedProductionRoot.resolved}") ` +
        "once symlinks and case are resolved away. This script is LOCAL ONLY and performs NO production writes."
    );
  }

  const RESOLVED_LOCAL_DB_PATH = path.resolve(process.cwd(), localDb);
  if (!fs.existsSync(RESOLVED_LOCAL_DB_PATH)) abort(`Local DB not found: ${RESOLVED_LOCAL_DB_PATH}`);
  const RESOLVED_PRODUCTION_SNAPSHOT_PATH = path.resolve(process.cwd(), productionSnapshot);
  if (!fs.existsSync(RESOLVED_PRODUCTION_SNAPSHOT_PATH)) abort(`Production snapshot not found: ${RESOLVED_PRODUCTION_SNAPSHOT_PATH}`);

  section("POST-ID-03 -- Local Canonical Resync");
  log(`  Local DB:            ${RESOLVED_LOCAL_DB_PATH}`);
  if (REAL_LOCAL_DB_PATH !== RESOLVED_LOCAL_DB_PATH) log(`  Local DB real path:  ${REAL_LOCAL_DB_PATH}  (symlink-resolved)`);
  log(`  Production snapshot: ${RESOLVED_PRODUCTION_SNAPSHOT_PATH}`);
  log(`  Mode:                ${apply ? "APPLY (will write)" : "DRY RUN (no writes)"}`);
  if (apply) log(`  Backup dir:          ${path.resolve(process.cwd(), backupDir!)}`);
  log(`  Timestamp:           ${new Date().toISOString()}`);

  const localDbConn = new Database(RESOLVED_LOCAL_DB_PATH, { readonly: true, fileMustExist: true });
  const prodDbConn = new Database(RESOLVED_PRODUCTION_SNAPSHOT_PATH, { readonly: true, fileMustExist: true });

  // ---- Preconditions --------------------------------------------------------------

  section("Preconditions");

  const pre = checkPreconditions(localDbConn, prodDbConn);

  log(`  Local:      ${pre.localCounts.pages} pages / ${pre.localCounts.total} total / ${pre.localCounts.withId} with id / ${pre.localCounts.withoutId} without id`);
  log(`  Production: ${pre.productionCounts.pages} pages / ${pre.productionCounts.total} total / ${pre.productionCounts.withId} with id / ${pre.productionCounts.withoutId} without id`);
  log(`  Production integrity_check: ${pre.productionIntegrityCheck}`);
  log(`  Production logical digest:  ${pre.productionLogicalDigest}`);
  log(`  Local logical digest:       ${pre.localLogicalDigest}`);

  if (!pre.ok) {
    localDbConn.close();
    prodDbConn.close();
    abort(`${pre.errors.length} precondition failure(s):\n${pre.errors.map((e) => `  - ${e}`).join("\n")}`);
  }

  log(`  Local baseline precondition:      PASS (${LOCAL_EXPECTED_PAGES} / ${LOCAL_EXPECTED_TOTAL} / ${LOCAL_EXPECTED_WITH_ID} / ${LOCAL_EXPECTED_WITHOUT_ID})`);
  log(`  Production baseline precondition: PASS (${PRODUCTION_SNAPSHOT_EXPECTED_PAGES} / ${PRODUCTION_SNAPSHOT_EXPECTED_TOTAL} / ${PRODUCTION_SNAPSHOT_EXPECTED_WITH_ID} / ${PRODUCTION_SNAPSHOT_EXPECTED_WITHOUT_ID})`);
  log("  Production integrity_check precondition: PASS (ok)");
  log("  Production logical digest precondition:  PASS (matches audited PRE-FRESH-01-ID-03B post-apply snapshot)");
  log(`  July target absence (local) / presence (production): PASS (${JULY_TARGET_IDS.join(", ")})`);
  log(`  August target presence (local + production):          PASS (${AUGUST_TARGET_ID})`);
  log(`  Protected-item capture: PASS (${PROTECTED_ITEMS.length} items: ${PROTECTED_ITEMS.map((p) => p.id).join(", ")})`);
  log(`  Local-only draft page capture: PASS (${COMPLIANCE_DRAFT_PAGE_SLUG})`);
  log("  Proposed-id uniqueness/collision precondition: PASS");

  const preWriteSchemaFingerprint = schemaFingerprint(localDbConn);

  // ---- Plan (printed on every run, dry or apply) -----------------------------------

  section("Plan");

  log(`  WOULD ADD (${JULY_PAGE_SLUG}, appended after existing local items, in production order):`);
  for (const item of pre.julyTargets) log(`    + ${item.id}  date=${item.date as string}  label_en=${item.label_en as string}`);

  log(`\n  WOULD UPDATE (${AUGUST_PAGE_SLUG}):`);
  log(`    ~ ${AUGUST_TARGET_ID}  ->  date=${pre.augustCanonical!.date as string} confidence=${pre.augustCanonical!.confidence as string} source_status=${pre.augustCanonical!.source_status as string}`);

  log("\n  PROTECTED/UNCHANGED (owner-approved local wording variants, never touched by this script):");
  for (const p of PROTECTED_ITEMS) log(`    = ${p.slug} :: ${p.id}`);
  log(`    = ${COMPLIANCE_DRAFT_PAGE_SLUG} (local-only draft page, entirely untouched)`);
  log("    = every other non-target local calendar object");

  log(`\n  Simulated final local state: ${LOCAL_EXPECTED_PAGES} pages / ${EXPECTED_FINAL_TOTAL} total / ${EXPECTED_FINAL_WITH_ID} with id / ${EXPECTED_FINAL_WITHOUT_ID} without id`);

  localDbConn.close();
  prodDbConn.close();

  if (!apply) {
    section("Dry run complete -- zero writes performed");
    log("  All preconditions passed. Re-run with --apply --backup-dir <dir> to perform the resync.");
    process.exit(0);
  }

  // ---- Apply: backup ----------------------------------------------------------------

  section("Backup (WAL-safe online backup)");

  log(`  Pre-write local logical digest: ${pre.localLogicalDigest}`);

  const RESOLVED_BACKUP_DIR = path.resolve(process.cwd(), backupDir!);
  let backupChildDir: string;
  try {
    backupChildDir = reserveBackupDirectory(RESOLVED_BACKUP_DIR);
  } catch (err) {
    abort(`Backup directory reservation failed under --backup-dir "${RESOLVED_BACKUP_DIR}": ${(err as Error).message}`);
  }
  const backupPath = path.join(backupChildDir, "guides.db");

  try {
    assertBackupDestinationAbsent(backupPath);
  } catch (err) {
    abort(`${(err as Error).message}`);
  }

  const backupSourceDb = new Database(RESOLVED_LOCAL_DB_PATH, { readonly: true, fileMustExist: true });
  try {
    await createOnlineBackup(backupSourceDb, backupPath);
  } catch (err) {
    try {
      if (fs.existsSync(backupPath)) fs.rmSync(backupPath, { force: true });
      fs.rmdirSync(backupChildDir);
    } catch {
      // best-effort only
    }
    abort(`Backup creation failed (online backup API): ${(err as Error).message}. No DB write was attempted.`);
  } finally {
    backupSourceDb.close();
  }

  const backupVerification = verifyBackup(backupPath, pre.localLogicalDigest, preWriteSchemaFingerprint);
  if (!backupVerification.ok) {
    abort(
      `Backup verification failed -- refusing to proceed to the write transaction. No DB write was attempted.\n` +
        `  Backup path: ${backupPath}\n` +
        backupVerification.errors.map((e) => `  - ${e}`).join("\n")
    );
  }
  log(`  Backup: ${backupPath}`);
  log(`  PRAGMA integrity_check: ${backupVerification.integrityCheck}  PASS`);
  log("  Logical digest match:   PASS (source == backup)");
  log("  Schema fingerprint match: PASS");

  // ---- Apply: transaction -------------------------------------------------------------

  section("Applying resync (single transaction)");

  const writeDb = new Database(RESOLVED_LOCAL_DB_PATH);
  try {
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
    log(`  Transaction: COMMIT (4 July additions + 1 August update, ${PROTECTED_ITEMS.length} protected items + compliance draft verified unchanged)`);
  } catch (err) {
    writeDb.close();
    fs.copyFileSync(backupPath, RESOLVED_LOCAL_DB_PATH);
    abort(
      `Transaction failed and was rolled back natively by SQLite -- no partial writes are possible. DB also restored from backup defensively.\n` +
        `  Reason: ${(err as Error).message}\n` +
        `  Backup remains available at: ${backupPath}`
    );
  }
  writeDb.close();

  // ---- Independent post-commit verification ---------------------------------------

  section("Independent post-commit verification");

  const post = independentPostCommitVerify(RESOLVED_LOCAL_DB_PATH, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
  if (!post.ok) {
    console.error("\nFAIL: post-commit verification found problems on the committed database:");
    for (const e of post.errors) console.error(`  - ${e}`);
    fs.copyFileSync(backupPath, RESOLVED_LOCAL_DB_PATH);
    abort(`Post-commit verification failed. DB restored from backup at ${backupPath}. See FAIL lines above.`);
  }

  log(`  Global counts: ${post.totalCount} total / ${post.withIdCount} with id / ${post.withoutIdCount} without id.  PASS`);
  log(`  4 July additions independently confirmed present, in order, exactly matching production source.  PASS`);
  log(`  ${AUGUST_TARGET_ID} independently confirmed to exactly equal the production canonical object.  PASS`);
  log(`  ${PROTECTED_ITEMS.length} protected items + local-only draft page independently confirmed byte-unchanged.  PASS`);

  section("Resync complete -- summary");
  log(`
LOCAL DB PATH: ${RESOLVED_LOCAL_DB_PATH}
BACKUP:        ${backupPath}
BACKUP LOGICAL DIGEST: ${backupVerification.logicalDigest}

Items added:   4 (${JULY_TARGET_IDS.join(", ")}) on ${JULY_PAGE_SLUG}
Items updated: 1 (${AUGUST_TARGET_ID}) on ${AUGUST_PAGE_SLUG}
Protected/unchanged: ${PROTECTED_ITEMS.map((p) => p.id).join(", ")}, plus ${COMPLIANCE_DRAFT_PAGE_SLUG} and every other local object.

Final local state: ${LOCAL_EXPECTED_PAGES} pages / ${EXPECTED_FINAL_TOTAL} total / ${EXPECTED_FINAL_WITH_ID} with id / ${EXPECTED_FINAL_WITHOUT_ID} without id.
Production writes performed by this script: NONE.
Build/PM2/deploy actions taken by this script: NONE.
`);
}

main().catch((err) => {
  console.error(`\nUNEXPECTED ERROR: ${(err as Error).stack ?? (err as Error).message}`);
  process.exit(1);
});

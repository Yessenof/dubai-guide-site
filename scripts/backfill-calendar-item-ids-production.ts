/**
 * PRE-FRESH-01-ID-03B -- Production Calendar Item Identity Backfill.
 *
 * Assigns a persisted, stable `id` to the exact 12 approved production
 * calendar_pages.dates_json items that currently have none (page-instance
 * identity, owner-approved Option B -- same model as the local ID-02
 * backfill). This is a SEPARATE target list from the local script's 21
 * items: it is a distinct constant (PRODUCTION_TARGETS in
 * scripts/lib/calendar-backfill-production-core.ts), not a filtered view of
 * the local one, so a COMPLY-* id (the 9 draft compliance-calendar items,
 * never promoted to production) is structurally impossible to reach here.
 *
 * This script deliberately does NOT reuse or invert the local script's
 * production-root guard -- it targets a production database on purpose.
 * Safety instead comes from: an explicit CLI contract with no defaults, a
 * hard live-corpus precondition check, a WAL-safe online backup (SQLite's
 * native backup API via better-sqlite3's .backup(), not a raw file copy --
 * see the comment on createOnlineBackup() in the core module for why that
 * distinction matters for a live WAL-mode database), and a single
 * transaction that validates every invariant before allowing SQLite to
 * commit.
 *
 * CLI contract:
 *   Dry run (default, no writes):
 *     npx tsx scripts/backfill-calendar-item-ids-production.ts --db <path>
 *
 *   Apply (requires ALL FOUR of the following; missing or wrong any one
 *   aborts before any backup or write is attempted):
 *     npx tsx scripts/backfill-calendar-item-ids-production.ts \
 *       --db <path> \
 *       --apply \
 *       --backup-dir <dir> \
 *       --expected-db-sha256 <64-hex-sha256-of-the-live-db-file> \
 *       --confirm ID-03B-12
 *
 * No build, PM2, SSH, or rsync logic lives in this script -- that decision
 * belongs to the separate ID-03B-04 operational-execution step. This
 * script is also local/remote path-agnostic: it has no hardcoded server
 * identity or default path. It may later be pointed at a production path
 * via --db, but it does not know that path itself.
 */

import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  PRODUCTION_TARGETS,
  REQUIRED_CONFIRM_TOKEN,
  EXPECTED_TOTAL,
  EXPECTED_WITH_ID,
  EXPECTED_WITHOUT_ID,
  checkPreconditions,
  tableLogicalDigest,
  schemaFingerprint,
  pickUniqueBackupPath,
  createOnlineBackup,
  verifyBackup,
  applyTransaction,
  independentPostCommitVerify,
} from "./lib/calendar-backfill-production-core";

// ---- CLI args ---------------------------------------------------------------

function parseArgs(argv: string[]): { dbPath?: string; apply: boolean; backupDir?: string; expectedDbSha256?: string; confirm?: string } {
  let dbPath: string | undefined;
  let apply = false;
  let backupDir: string | undefined;
  let expectedDbSha256: string | undefined;
  let confirm: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--db") {
      dbPath = argv[i + 1];
      i++;
    } else if (argv[i] === "--apply") {
      apply = true;
    } else if (argv[i] === "--backup-dir") {
      backupDir = argv[i + 1];
      i++;
    } else if (argv[i] === "--expected-db-sha256") {
      expectedDbSha256 = argv[i + 1];
      i++;
    } else if (argv[i] === "--confirm") {
      confirm = argv[i + 1];
      i++;
    }
  }
  return { dbPath, apply, backupDir, expectedDbSha256, confirm };
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

async function main(): Promise<void> {
  const { dbPath, apply, backupDir, expectedDbSha256, confirm } = parseArgs(process.argv.slice(2));

  const USAGE =
    "  Dry run: npx tsx scripts/backfill-calendar-item-ids-production.ts --db <path>\n" +
    "  Apply:   npx tsx scripts/backfill-calendar-item-ids-production.ts --db <path> --apply --backup-dir <dir> --expected-db-sha256 <64-hex> --confirm ID-03B-12";

  if (!dbPath) abort(`Missing required --db <path> argument.\n${USAGE}`);

  // --apply requires ALL FOUR of --apply, --backup-dir, --expected-db-sha256,
  // and an exact --confirm token match. Every one of these is checked before
  // anything else runs, so a missing or wrong flag aborts before backup or write.
  if (apply) {
    if (!backupDir) abort(`--apply requires --backup-dir <path> (no implicit cwd-relative backup location).\n${USAGE}`);
    if (!expectedDbSha256) abort(`--apply requires --expected-db-sha256 <64-hex> (the live pre-write hash gate).\n${USAGE}`);
    if (!/^[0-9a-fA-F]{64}$/.test(expectedDbSha256)) abort(`--expected-db-sha256 must be exactly 64 hex characters, got "${expectedDbSha256}".`);
    if (confirm !== REQUIRED_CONFIRM_TOKEN) abort(`--apply requires --confirm ${REQUIRED_CONFIRM_TOKEN} (exact literal match). Got: ${confirm === undefined ? "(missing)" : `"${confirm}"`}`);
  }

  const RESOLVED_DB_PATH = path.resolve(process.cwd(), dbPath);
  if (!fs.existsSync(RESOLVED_DB_PATH)) abort(`DB not found: ${RESOLVED_DB_PATH}`);

  section("PRE-FRESH-01-ID-03B -- Production Calendar Item Identity Backfill");
  log(`  DB path:   ${RESOLVED_DB_PATH}`);
  log(`  Mode:      ${apply ? "APPLY (will write)" : "DRY RUN (no writes)"}`);
  if (apply) log(`  Backup dir: ${path.resolve(process.cwd(), backupDir!)}`);
  log(`  Timestamp: ${new Date().toISOString()}`);

  // ---- Live pre-write hash gate ------------------------------------------------
  // Printed unconditionally (dry run just informs; apply enforces).
  const actualDbSha256 = crypto.createHash("sha256").update(fs.readFileSync(RESOLVED_DB_PATH)).digest("hex");
  log(`  Live DB sha256: ${actualDbSha256}`);

  if (apply && actualDbSha256.toLowerCase() !== expectedDbSha256!.toLowerCase()) {
    abort(
      `--expected-db-sha256 does not match the live DB file.\n` +
        `  expected: ${expectedDbSha256!.toLowerCase()}\n` +
        `  actual:   ${actualDbSha256}\n` +
        "The live database has changed since --expected-db-sha256 was captured -- re-verify before proceeding."
    );
  }

  // ---- Preconditions ------------------------------------------------------------

  section("Preconditions");

  const db = new Database(RESOLVED_DB_PATH, { readonly: true, fileMustExist: true });
  const pre = checkPreconditions(db);

  log(`  Total items:      ${pre.totalCount}`);
  log(`  With id:          ${pre.withIdCount}`);
  log(`  Without id:       ${pre.withoutIdCount}`);
  log(`  Id-less by page:  ${JSON.stringify(pre.idLessBySlug)}`);

  if (!pre.ok) {
    db.close();
    abort(`${pre.errors.length} precondition failure(s):\n${pre.errors.map((e) => `  - ${e}`).join("\n")}`);
  }

  log(`  Count precondition: PASS (${EXPECTED_TOTAL} / ${EXPECTED_WITH_ID} / ${EXPECTED_WITHOUT_ID})`);
  log(`  Id-less page/count precondition: PASS (exactly 4 approved pages, no others)`);
  log(`  Fingerprint precondition: PASS (all ${PRODUCTION_TARGETS.length} target items match the audit snapshot)`);
  log(`  Existing-corpus duplicate precondition: PASS (0 exact, 0 case-insensitive)`);
  log(`  Uniqueness precondition: PASS (${PRODUCTION_TARGETS.length} proposed ids, 0 collisions)`);
  log(`  Zero COMPLY-* ids in target list: PASS (structural, ${PRODUCTION_TARGETS.length} targets checked)`);

  if (!apply) {
    const preWriteLogicalDigest = tableLogicalDigest(db);
    db.close();
    section("Dry run complete -- no writes performed");
    log("  All preconditions passed. Re-run with --apply (plus --backup-dir, --expected-db-sha256, --confirm) to perform the backfill.");
    log(`  Pre-write logical digest (for reference, not enforced in dry run): ${preWriteLogicalDigest}`);
    log("\n  Planned assignments:");
    for (const t of PRODUCTION_TARGETS) log(`    ${t.slug}[${t.idx}]  ->  ${t.id}  (WOULD UPDATE)`);
    process.exit(0);
  }

  // ---- Apply: backup -------------------------------------------------------------

  section("Backup (WAL-safe online backup)");

  const preWriteLogicalDigest = tableLogicalDigest(db);
  const preWriteSchemaFingerprint = schemaFingerprint(db);
  log(`  Pre-write logical digest: ${preWriteLogicalDigest}`);

  const RESOLVED_BACKUP_DIR = path.resolve(process.cwd(), backupDir!);
  let backupPath: string;
  try {
    backupPath = pickUniqueBackupPath(RESOLVED_BACKUP_DIR);
  } catch (err) {
    db.close();
    abort(`Backup path selection failed for --backup-dir "${RESOLVED_BACKUP_DIR}": ${(err as Error).message}`);
  }

  try {
    await createOnlineBackup(db, backupPath);
  } catch (err) {
    db.close();
    abort(`Backup creation failed (online backup API): ${(err as Error).message}. No DB write was attempted.`);
  }
  db.close();

  const backupVerification = verifyBackup(backupPath, preWriteLogicalDigest, preWriteSchemaFingerprint);
  if (!backupVerification.ok) {
    abort(
      `Backup verification failed -- refusing to proceed to the write transaction. No DB write was attempted.\n` +
        `  Backup path: ${backupPath}\n` +
        backupVerification.errors.map((e) => `  - ${e}`).join("\n")
    );
  }
  log(`  Backup: ${backupPath}`);
  log(`  PRAGMA integrity_check: ${backupVerification.integrityCheck}  PASS`);
  log(`  Logical digest match:   PASS (source == backup)`);
  log(`  Schema fingerprint match: PASS`);

  // ---- Apply: transaction ---------------------------------------------------------

  section("Applying backfill (single transaction)");

  const writeDb = new Database(RESOLVED_DB_PATH);
  try {
    applyTransaction(writeDb, PRODUCTION_TARGETS, pre.pages);
    log(`  Transaction: COMMIT (${PRODUCTION_TARGETS.length} id assignments across 4 pages)`);
  } catch (err) {
    writeDb.close();
    abort(
      `Transaction failed and was rolled back natively by SQLite -- no partial writes are possible.\n` +
        `  Reason: ${(err as Error).message}\n` +
        `  Backup remains available at: ${backupPath}\n` +
        `  Live DB pre-write logical digest: ${preWriteLogicalDigest}`
    );
  }
  writeDb.close();

  // ---- Independent post-commit verification ---------------------------------------

  section("Independent post-commit verification");

  const post = independentPostCommitVerify(RESOLVED_DB_PATH);
  if (!post.ok) {
    console.error("\nFAIL: post-commit verification found problems on the committed database:");
    for (const e of post.errors) console.error(`  - ${e}`);
    console.error(
      `\nCONTROLLED ROLLBACK REQUIRED.\n` +
        `  This script will NOT automatically replace the live DB file -- another process may have it open.\n` +
        `  Verified backup path: ${backupPath}\n` +
        `  Pre-write logical digest: ${preWriteLogicalDigest}\n` +
        `  Restore that backup manually (as part of ID-03B-04 operational execution) after investigating why a committed transaction failed independent re-verification.`
    );
    process.exit(1);
  }

  log(`  Global counts: ${post.totalCount} total / ${post.withIdCount} with id / ${post.withoutIdCount} without id.  PASS`);
  log(`  All ${PRODUCTION_TARGETS.length} target items independently confirmed to carry their exact proposed id.  PASS`);

  section("Backfill complete -- summary");
  log(`
DB PATH: ${RESOLVED_DB_PATH}
BACKUP:  ${backupPath}
BACKUP LOGICAL DIGEST: ${backupVerification.logicalDigest}

Items assigned an id: ${PRODUCTION_TARGETS.length}
Pages touched:        4 (may-2026-uae-calendar, uae-e-invoicing-2026-asp-deadline,
                          uae-emiratisation-june-30-2026-reminder, uae-long-weekends-2026-2027)

Identity model: page-instance (Option B) -- no id shared across pages.
COMPLY-* ids touched: NONE (structurally excluded from PRODUCTION_TARGETS).
Fields modified per item: id only.
Build/PM2/deploy actions taken by this script: NONE.
`);
}

main().catch((err) => {
  console.error(`\nUNEXPECTED ERROR: ${(err as Error).stack ?? (err as Error).message}`);
  process.exit(1);
});

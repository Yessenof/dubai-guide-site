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
 *   Apply (requires ALL FIVE of the following; missing or wrong any one
 *   aborts before any backup or write is attempted):
 *     npx tsx scripts/backfill-calendar-item-ids-production.ts \
 *       --db <path> \
 *       --apply \
 *       --backup-dir <dir> \
 *       --expected-db-sha256 <64-hex-sha256-of-the-live-db-file> \
 *       --expected-calendar-digest <64-hex-tableLogicalDigest-of-calendar_pages> \
 *       --confirm ID-03B-12
 *
 * --expected-calendar-digest was added post-PRE-FRESH-01-ID-03B-02
 * independent QA (finding P1-A): a raw-file SHA256 is not a WAL-safe
 * authorization lock. SQLite in WAL mode can have a committed, fully
 * visible-to-fresh-connections write sitting in the -wal file that has not
 * yet been checkpointed into the main db file -- the raw bytes of the main
 * file, and therefore its SHA256, do not change until a checkpoint happens
 * (which is out of this script's control; it can be delayed indefinitely by
 * another process holding a connection open). --expected-db-sha256 alone
 * could therefore be satisfied by a stale value even though the calendar
 * data had already changed. --expected-calendar-digest closes that gap: it
 * is tableLogicalDigest(db), read through an actual SQLite connection (not
 * raw file bytes), so it reflects WAL-committed state regardless of
 * checkpoint timing. Both locks are required together -- the raw SHA is not
 * removed, only supplemented. Note the scope: this digest covers
 * calendar_pages only, matching the scope of this script's mutation. A
 * committed change to an unrelated table will not be caught by either lock
 * and does not need to be -- see the comment on tableLogicalDigest() in the
 * core module.
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
  reserveBackupDirectory,
  assertBackupDestinationAbsent,
  createOnlineBackup,
  verifyBackup,
  applyTransaction,
  independentPostCommitVerify,
} from "./lib/calendar-backfill-production-core";

// ---- CLI args ---------------------------------------------------------------

function parseArgs(
  argv: string[]
): { dbPath?: string; apply: boolean; backupDir?: string; expectedDbSha256?: string; expectedCalendarDigest?: string; confirm?: string } {
  let dbPath: string | undefined;
  let apply = false;
  let backupDir: string | undefined;
  let expectedDbSha256: string | undefined;
  let expectedCalendarDigest: string | undefined;
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
    } else if (argv[i] === "--expected-calendar-digest") {
      expectedCalendarDigest = argv[i + 1];
      i++;
    } else if (argv[i] === "--confirm") {
      confirm = argv[i + 1];
      i++;
    }
  }
  return { dbPath, apply, backupDir, expectedDbSha256, expectedCalendarDigest, confirm };
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
  const { dbPath, apply, backupDir, expectedDbSha256, expectedCalendarDigest, confirm } = parseArgs(process.argv.slice(2));

  const USAGE =
    "  Dry run: npx tsx scripts/backfill-calendar-item-ids-production.ts --db <path>\n" +
    "  Apply:   npx tsx scripts/backfill-calendar-item-ids-production.ts --db <path> --apply --backup-dir <dir> --expected-db-sha256 <64-hex> --expected-calendar-digest <64-hex> --confirm ID-03B-12";

  if (!dbPath) abort(`Missing required --db <path> argument.\n${USAGE}`);

  // Step 1: parse/validate CLI flags. --apply requires ALL FIVE of --apply,
  // --backup-dir, --expected-db-sha256, --expected-calendar-digest, and an
  // exact --confirm token match. Every one of these is checked before the DB
  // is even opened, so a missing or wrong flag aborts before any DB read,
  // backup, or write is attempted -- never a silent downgrade to dry-run.
  if (apply) {
    if (!backupDir) abort(`--apply requires --backup-dir <path> (no implicit cwd-relative backup location).\n${USAGE}`);
    if (!expectedDbSha256) abort(`--apply requires --expected-db-sha256 <64-hex> (the live pre-write hash gate).\n${USAGE}`);
    if (!/^[0-9a-fA-F]{64}$/.test(expectedDbSha256)) abort(`--expected-db-sha256 must be exactly 64 hex characters, got "${expectedDbSha256}".`);
    if (!expectedCalendarDigest) {
      abort(`--apply requires --expected-calendar-digest <64-hex> (the WAL-safe calendar_pages authorization lock; see the file header comment).\n${USAGE}`);
    }
    if (!/^[0-9a-fA-F]{64}$/.test(expectedCalendarDigest)) {
      abort(`--expected-calendar-digest must be exactly 64 hex characters, got "${expectedCalendarDigest}".`);
    }
    if (confirm !== REQUIRED_CONFIRM_TOKEN) abort(`--apply requires --confirm ${REQUIRED_CONFIRM_TOKEN} (exact literal match). Got: ${confirm === undefined ? "(missing)" : `"${confirm}"`}`);
  }

  // Step 2: open/read DB.
  const RESOLVED_DB_PATH = path.resolve(process.cwd(), dbPath);
  if (!fs.existsSync(RESOLVED_DB_PATH)) abort(`DB not found: ${RESOLVED_DB_PATH}`);

  section("PRE-FRESH-01-ID-03B -- Production Calendar Item Identity Backfill");
  log(`  DB path:   ${RESOLVED_DB_PATH}`);
  log(`  Mode:      ${apply ? "APPLY (will write)" : "DRY RUN (no writes)"}`);
  if (apply) log(`  Backup dir: ${path.resolve(process.cwd(), backupDir!)}`);
  log(`  Timestamp: ${new Date().toISOString()}`);

  const db = new Database(RESOLVED_DB_PATH, { readonly: true, fileMustExist: true });

  // Step 3: corpus/target/fingerprint/uniqueness preconditions -- checked
  // BEFORE either authorization lock is compared, so a corrupted or drifted
  // corpus is reported on its own terms rather than masked by a hash-gate
  // abort message.
  section("Preconditions");

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

  // Steps 4 & 6: compute both authorization-lock values. Printed
  // unconditionally on every run that reaches this point -- a dry run just
  // informs (this is the DB_FILE_SHA256 / CALENDAR_LOGICAL_DIGEST contract
  // an owner reads to construct the next --apply invocation); apply enforces.
  section("Authorization locks");

  const actualDbSha256 = crypto.createHash("sha256").update(fs.readFileSync(RESOLVED_DB_PATH)).digest("hex");
  const calendarLogicalDigest = tableLogicalDigest(db);
  const preWriteSchemaFingerprint = schemaFingerprint(db);
  log(`  DB_FILE_SHA256=${actualDbSha256}`);
  log(`  CALENDAR_LOGICAL_DIGEST=${calendarLogicalDigest}`);

  if (!apply) {
    db.close();
    section("Dry run complete -- no writes performed");
    log("  All preconditions passed. Re-run with --apply (plus --backup-dir, --expected-db-sha256, --expected-calendar-digest, --confirm) to perform the backfill.");
    log("\n  Planned assignments:");
    for (const t of PRODUCTION_TARGETS) log(`    ${t.slug}[${t.idx}]  ->  ${t.id}  (WOULD UPDATE)`);
    process.exit(0);
  }

  // Step 5: compare expected DB SHA (raw file bytes). Kept as a lock even
  // though it is not WAL-safe on its own -- see the file header comment --
  // because it still catches any change that has been checkpointed, and
  // removing it would weaken defense-in-depth for no benefit.
  if (actualDbSha256.toLowerCase() !== expectedDbSha256!.toLowerCase()) {
    db.close();
    abort(
      `--expected-db-sha256 does not match the live DB file.\n` +
        `  expected: ${expectedDbSha256!.toLowerCase()}\n` +
        `  actual:   ${actualDbSha256}\n` +
        "The live database has changed since --expected-db-sha256 was captured -- re-verify before proceeding."
    );
  }

  // Step 7: compare expected calendar logical digest. This is read through
  // an actual SQLite connection (tableLogicalDigest), not raw file bytes, so
  // it reflects WAL-committed calendar_pages state even if the main file has
  // not been checkpointed yet -- closing the P1-A gap the raw SHA cannot
  // close on its own. Scoped to calendar_pages only; see the file header
  // comment for why that scope is intentional and sufficient here.
  if (calendarLogicalDigest.toLowerCase() !== expectedCalendarDigest!.toLowerCase()) {
    db.close();
    abort(
      `CALENDAR LOGICAL DIGEST MISMATCH -- PRODUCTION DRIFT DETECTED\n` +
        `  expected: ${expectedCalendarDigest!.toLowerCase()}\n` +
        `  actual:   ${calendarLogicalDigest}\n` +
        "The live calendar_pages content has changed since --expected-calendar-digest was captured (possibly a WAL-committed, " +
        "not-yet-checkpointed write invisible to --expected-db-sha256 alone) -- re-verify before proceeding. No backup was created; no write was attempted."
    );
  }

  // ---- Apply: backup -------------------------------------------------------------

  // Step 8: create verified WAL-safe backup, into an atomically-reserved
  // unique directory (see reserveBackupDirectory in the core module for why
  // this replaced the earlier existence-check-based path selection).
  section("Backup (WAL-safe online backup)");

  log(`  Pre-write logical digest: ${calendarLogicalDigest}`);

  const RESOLVED_BACKUP_DIR = path.resolve(process.cwd(), backupDir!);
  let backupChildDir: string;
  try {
    backupChildDir = reserveBackupDirectory(RESOLVED_BACKUP_DIR);
  } catch (err) {
    db.close();
    abort(`Backup directory reservation failed under --backup-dir "${RESOLVED_BACKUP_DIR}": ${(err as Error).message}`);
  }
  const backupPath = path.join(backupChildDir, "guides.db");

  try {
    assertBackupDestinationAbsent(backupPath);
  } catch (err) {
    db.close();
    abort(`${(err as Error).message}`);
  }

  try {
    await createOnlineBackup(db, backupPath);
  } catch (err) {
    db.close();
    // Best-effort cleanup of the just-reserved, still-empty-or-partial
    // directory -- never remove anything not clearly created by this failed
    // attempt, and never let a cleanup failure mask the original error.
    try {
      if (fs.existsSync(backupPath)) fs.rmSync(backupPath, { force: true });
      fs.rmdirSync(backupChildDir);
    } catch {
      // best-effort only
    }
    abort(`Backup creation failed (online backup API): ${(err as Error).message}. No DB write was attempted.`);
  }
  db.close();

  const backupVerification = verifyBackup(backupPath, calendarLogicalDigest, preWriteSchemaFingerprint);
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
    // The same owner-supplied digest already validated at Step 7, passed
    // through so applyTransaction() can recheck it a second time from
    // inside the BEGIN IMMEDIATE transaction -- see the comment on
    // applyTransaction() in the core module for why this closes the P1
    // logical-authorization TOCTOU race the earlier, single, pre-backup
    // check alone could not.
    applyTransaction(writeDb, PRODUCTION_TARGETS, pre.pages, expectedCalendarDigest!.toLowerCase());
    log(`  Transaction: COMMIT (${PRODUCTION_TARGETS.length} id assignments across 4 pages)`);
  } catch (err) {
    writeDb.close();
    abort(
      `Transaction failed and was rolled back natively by SQLite -- no partial writes are possible.\n` +
        `  Reason: ${(err as Error).message}\n` +
        `  Backup remains available at: ${backupPath}\n` +
        `  Live DB pre-write logical digest: ${calendarLogicalDigest}`
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
        `  Pre-write logical digest: ${calendarLogicalDigest}\n` +
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

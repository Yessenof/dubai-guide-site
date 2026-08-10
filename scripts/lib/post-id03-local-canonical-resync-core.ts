// Pure, independently-testable logic for
// scripts/post-id03-local-canonical-resync.ts (POST-ID-03 -- local canonical
// resync: bring exactly two owner-approved production deltas into the LOCAL
// database without touching production and without disturbing any other
// local content).
//
// Kept separate from the CLI script (no top-level side effects, no argv
// parsing, no process.exit) so tests/freshness/post-id03-local-canonical-
// resync.test.ts can exercise every branch directly.
//
// Reuses the canonical fingerprint/digest/backup primitives already proven
// in calendar-backfill-production-core.ts (same algorithms, same safety
// properties) rather than re-implementing them, plus findDuplicates from
// calendar-backfill-safety.ts. The production-path guard itself lives in the
// CLI script, exactly like backfill-calendar-item-ids-local.ts.

import crypto from "node:crypto";
import Database from "better-sqlite3";
import {
  canonicalize,
  loadAllPages,
  tableLogicalDigest,
  schemaFingerprint,
  reserveBackupDirectory,
  assertBackupDestinationAbsent,
  createOnlineBackup,
  verifyBackup,
  type CalendarItem,
  type BackupVerification,
} from "./calendar-backfill-production-core";
import { findDuplicates } from "./calendar-backfill-safety";

export {
  canonicalize,
  loadAllPages,
  tableLogicalDigest,
  schemaFingerprint,
  reserveBackupDirectory,
  assertBackupDestinationAbsent,
  createOnlineBackup,
  verifyBackup,
};
export type { CalendarItem, BackupVerification };

// ---- Fixed scope (owner-approved, "PROCEED WITH APPROVED DELTAS ONLY") ------

export const LOCAL_EXPECTED_PAGES = 12;
export const LOCAL_EXPECTED_TOTAL = 123;
export const LOCAL_EXPECTED_WITH_ID = 123;
export const LOCAL_EXPECTED_WITHOUT_ID = 0;

export const PRODUCTION_SNAPSHOT_EXPECTED_PAGES = 11;
export const PRODUCTION_SNAPSHOT_EXPECTED_TOTAL = 118;
export const PRODUCTION_SNAPSHOT_EXPECTED_WITH_ID = 118;
export const PRODUCTION_SNAPSHOT_EXPECTED_WITHOUT_ID = 0;

// The exact WAL-safe production snapshot this resync was reconciled against
// (retrieved 2026-08-09T19:00:36Z UTC, PRE-FRESH-01-ID-03B post-apply
// state). A snapshot that does not reproduce this digest is not the audited
// one -- abort rather than derive targets from an unaudited snapshot, even
// if its shape happens to match.
export const EXPECTED_PRODUCTION_LOGICAL_DIGEST = "769a79b75986baa3dc487bd9779c1e297a513704698647004806c4923c51f6e8";

export const JULY_PAGE_SLUG = "july-2026-dubai-calendar";
export const AUGUST_PAGE_SLUG = "august-2026-dubai-calendar";
export const COMPLIANCE_DRAFT_PAGE_SLUG = "uae-business-compliance-calendar-2026-2027";

export const JULY_TARGET_IDS = ["JUL-NEW-04", "JUL-NEW-05", "JUL-NEW-06", "JUL-NEW-07"] as const;
export const AUGUST_TARGET_ID = "AUG-NEW-02";

// Owner scope decision (POST-ID-03 "OWNER SCOPE DECISION" reply): these three
// items carry genuine local wording/copy variants from production and must
// be preserved exactly as they exist locally -- NOT reconciled toward
// production wording. Tracked as a non-blocking copy-reconciliation backlog
// item, explicitly out of scope for this script.
export const PROTECTED_ITEMS: { slug: string; id: string }[] = [
  { slug: JULY_PAGE_SLUG, id: "JUL-NEW-02" },
  { slug: AUGUST_PAGE_SLUG, id: "AUG-6D-07" },
  { slug: AUGUST_PAGE_SLUG, id: "AUG-6D-06" },
];

export const EXPECTED_FINAL_TOTAL = LOCAL_EXPECTED_TOTAL + JULY_TARGET_IDS.length; // 127
export const EXPECTED_FINAL_WITH_ID = EXPECTED_FINAL_TOTAL; // 127
export const EXPECTED_FINAL_WITHOUT_ID = 0;

// ---- Fingerprints ---------------------------------------------------------------

/** Whole-object fingerprint, id included. Used for items whose id never changes -- proving "unchanged" or "now exactly equals production canonical" means comparing the entire object. */
export function fullFingerprint(item: CalendarItem): string {
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(item))).digest("hex");
}

/** Whole-row fingerprint (every calendar_pages column, dates_json parsed back into structured JSON first so formatting differences don't matter). Used to prove a page is entirely untouched. */
export function fullPageFingerprint(row: Record<string, unknown>): string {
  const clone: Record<string, unknown> = { ...row };
  if (typeof clone.dates_json === "string") {
    try {
      clone.dates_json = JSON.parse(clone.dates_json);
    } catch {
      // Leave as-is; an unparsable dates_json is itself meaningful digest input.
    }
  }
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(clone))).digest("hex");
}

function pageMetadata(row: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...row };
  delete clone.dates_json;
  return clone;
}

export function loadFullPage(db: Database.Database, slug: string): Record<string, unknown> | undefined {
  return db.prepare("SELECT * FROM calendar_pages WHERE slug = ?").get(slug) as Record<string, unknown> | undefined;
}

// ---- Preconditions ----------------------------------------------------------------

export interface PreconditionResult {
  ok: boolean;
  errors: string[];
  localCounts: { pages: number; total: number; withId: number; withoutId: number };
  productionCounts: { pages: number; total: number; withId: number; withoutId: number };
  productionIntegrityCheck: string;
  productionLogicalDigest: string;
  localLogicalDigest: string;
  julyTargets: CalendarItem[]; // production-derived, in JULY_TARGET_IDS order
  augustCanonical: CalendarItem | null;
  protectedBefore: Record<string, string>; // "slug::id" -> fullFingerprint
  complianceDraftBefore: string | null;
}

/**
 * Every precondition required before a dry-run "would update" report or an
 * --apply backup/transaction may proceed. Returns ok=false with a full list
 * of errors instead of throwing on the first failure, so a dry run can
 * report everything wrong in one pass.
 */
export function checkPreconditions(localDb: Database.Database, prodDb: Database.Database): PreconditionResult {
  const errors: string[] = [];

  // --- local baseline ---
  const localPages = loadAllPages(localDb);
  const localItems = localPages.flatMap((p) => p.items);
  const localCounts = {
    pages: localPages.length,
    total: localItems.length,
    withId: localItems.filter((it) => it.id).length,
    withoutId: 0,
  };
  localCounts.withoutId = localCounts.total - localCounts.withId;

  if (localCounts.pages !== LOCAL_EXPECTED_PAGES) errors.push(`Expected ${LOCAL_EXPECTED_PAGES} local pages, found ${localCounts.pages}. Local has drifted since baseline -- do not proceed.`);
  if (localCounts.total !== LOCAL_EXPECTED_TOTAL) errors.push(`Expected ${LOCAL_EXPECTED_TOTAL} local total items, found ${localCounts.total}. Local has drifted since baseline -- do not proceed.`);
  if (localCounts.withId !== LOCAL_EXPECTED_WITH_ID) errors.push(`Expected ${LOCAL_EXPECTED_WITH_ID} local items with id, found ${localCounts.withId}. Local has drifted since baseline -- do not proceed.`);
  if (localCounts.withoutId !== LOCAL_EXPECTED_WITHOUT_ID) errors.push(`Expected ${LOCAL_EXPECTED_WITHOUT_ID} local items without id, found ${localCounts.withoutId}. Local has drifted since baseline -- do not proceed.`);

  const localIds = localItems.map((it) => it.id).filter((v): v is string => typeof v === "string" && v.length > 0);
  const localExactDupes = findDuplicates(localIds);
  if (localExactDupes.length > 0) errors.push(`Local exact duplicate id(s): ${localExactDupes.join(", ")}.`);
  const localCiDupes = findDuplicates(localIds.map((v) => v.toLowerCase()));
  if (localCiDupes.length > 0) errors.push(`Local case-insensitive duplicate id(s): ${localCiDupes.join(", ")}.`);

  const localLogicalDigest = tableLogicalDigest(localDb);

  // --- production snapshot baseline ---
  const prodPages = loadAllPages(prodDb);
  const prodItems = prodPages.flatMap((p) => p.items);
  const productionCounts = {
    pages: prodPages.length,
    total: prodItems.length,
    withId: prodItems.filter((it) => it.id).length,
    withoutId: 0,
  };
  productionCounts.withoutId = productionCounts.total - productionCounts.withId;

  if (productionCounts.pages !== PRODUCTION_SNAPSHOT_EXPECTED_PAGES) errors.push(`Expected ${PRODUCTION_SNAPSHOT_EXPECTED_PAGES} production snapshot pages, found ${productionCounts.pages}.`);
  if (productionCounts.total !== PRODUCTION_SNAPSHOT_EXPECTED_TOTAL) errors.push(`Expected ${PRODUCTION_SNAPSHOT_EXPECTED_TOTAL} production snapshot total items, found ${productionCounts.total}.`);
  if (productionCounts.withId !== PRODUCTION_SNAPSHOT_EXPECTED_WITH_ID) errors.push(`Expected ${PRODUCTION_SNAPSHOT_EXPECTED_WITH_ID} production snapshot items with id, found ${productionCounts.withId}.`);
  if (productionCounts.withoutId !== PRODUCTION_SNAPSHOT_EXPECTED_WITHOUT_ID) errors.push(`Expected ${PRODUCTION_SNAPSHOT_EXPECTED_WITHOUT_ID} production snapshot items without id, found ${productionCounts.withoutId}.`);

  const integrityRows = prodDb.pragma("integrity_check") as { integrity_check: string }[];
  const productionIntegrityCheck = integrityRows.map((r) => r.integrity_check).join("; ");
  if (productionIntegrityCheck !== "ok") errors.push(`Production snapshot PRAGMA integrity_check did not return "ok": ${productionIntegrityCheck}.`);

  const productionLogicalDigest = tableLogicalDigest(prodDb);
  if (productionLogicalDigest !== EXPECTED_PRODUCTION_LOGICAL_DIGEST) {
    errors.push(
      `Production snapshot logical digest mismatch. expected=${EXPECTED_PRODUCTION_LOGICAL_DIGEST} actual=${productionLogicalDigest}. ` +
        "This is not the audited PRE-FRESH-01-ID-03B post-apply snapshot -- refusing to derive targets from an unaudited snapshot."
    );
  }

  // --- July: derive targets from production, verify local absence ---
  const prodJulyItems = prodPages.find((p) => p.slug === JULY_PAGE_SLUG)?.items;
  const localJulyItems = localPages.find((p) => p.slug === JULY_PAGE_SLUG)?.items;
  const julyTargets: CalendarItem[] = [];
  if (!prodJulyItems) {
    errors.push(`Production snapshot missing page: ${JULY_PAGE_SLUG}.`);
  } else {
    for (const id of JULY_TARGET_IDS) {
      const item = prodJulyItems.find((it) => it.id === id);
      if (!item) errors.push(`Production snapshot missing source item "${id}" on ${JULY_PAGE_SLUG}.`);
      else julyTargets.push(item);
    }
  }
  if (!localJulyItems) {
    errors.push(`Local DB missing page: ${JULY_PAGE_SLUG}.`);
  } else {
    for (const id of JULY_TARGET_IDS) {
      if (localJulyItems.some((it) => it.id === id)) errors.push(`Local ${JULY_PAGE_SLUG} already contains target id "${id}" -- refusing to add a duplicate.`);
    }
  }

  // --- August: derive canonical AUG-NEW-02, verify local has an existing one to update ---
  const prodAugItems = prodPages.find((p) => p.slug === AUGUST_PAGE_SLUG)?.items;
  const localAugItems = localPages.find((p) => p.slug === AUGUST_PAGE_SLUG)?.items;
  let augustCanonical: CalendarItem | null = null;
  if (!prodAugItems) {
    errors.push(`Production snapshot missing page: ${AUGUST_PAGE_SLUG}.`);
  } else {
    const item = prodAugItems.find((it) => it.id === AUGUST_TARGET_ID);
    if (!item) errors.push(`Production snapshot missing source item "${AUGUST_TARGET_ID}" on ${AUGUST_PAGE_SLUG}.`);
    else augustCanonical = item;
  }
  if (!localAugItems) {
    errors.push(`Local DB missing page: ${AUGUST_PAGE_SLUG}.`);
  } else if (!localAugItems.some((it) => it.id === AUGUST_TARGET_ID)) {
    errors.push(`Local ${AUGUST_PAGE_SLUG} is missing existing item "${AUGUST_TARGET_ID}" to update -- aborting rather than inserting a new item under an update-only operation.`);
  }

  // --- Protected items: must exist locally; capture fingerprint ---
  const protectedBefore: Record<string, string> = {};
  for (const p of PROTECTED_ITEMS) {
    const items = localPages.find((pg) => pg.slug === p.slug)?.items;
    const item = items?.find((it) => it.id === p.id);
    if (!item) {
      errors.push(`Protected item missing locally: ${p.slug}::${p.id}. Cannot prove preservation of an item that isn't there.`);
    } else {
      protectedBefore[`${p.slug}::${p.id}`] = fullFingerprint(item);
    }
  }

  // --- Local-only draft page: must exist as draft; capture fingerprint ---
  const complianceRow = loadFullPage(localDb, COMPLIANCE_DRAFT_PAGE_SLUG);
  let complianceDraftBefore: string | null = null;
  if (!complianceRow) {
    errors.push(`Local-only draft page missing: ${COMPLIANCE_DRAFT_PAGE_SLUG}. Expected to exist and remain untouched.`);
  } else {
    if (complianceRow.status !== "draft") errors.push(`Local-only draft page ${COMPLIANCE_DRAFT_PAGE_SLUG} status is "${String(complianceRow.status)}", expected "draft".`);
    complianceDraftBefore = fullPageFingerprint(complianceRow);
  }

  // --- Proposed id collisions against the full local corpus (defense in depth) ---
  const proposedIds = [...JULY_TARGET_IDS];
  const proposedDupes = findDuplicates(proposedIds);
  if (proposedDupes.length > 0) errors.push(`Proposed July ids are not unique among themselves: ${proposedDupes.join(", ")}.`);
  const localIdSet = new Set(localIds);
  const localIdLowerSet = new Set(localIds.map((v) => v.toLowerCase()));
  for (const id of proposedIds) {
    if (localIdSet.has(id)) errors.push(`Proposed id "${id}" collides with an existing local id.`);
    else if (localIdLowerSet.has(id.toLowerCase())) errors.push(`Proposed id "${id}" collides case-insensitively with an existing local id.`);
  }

  return {
    ok: errors.length === 0,
    errors,
    localCounts,
    productionCounts,
    productionIntegrityCheck,
    productionLogicalDigest,
    localLogicalDigest,
    julyTargets,
    augustCanonical,
    protectedBefore,
    complianceDraftBefore,
  };
}

// ---- Apply transaction ---------------------------------------------------------

export interface ApplyOptions {
  /** TEST-ONLY. Never set by the CLI script. Throws immediately after both page UPDATEs, before in-transaction validation, to prove a native SQLite rollback occurs (zero partial writes). */
  forceFailureAfterWrites?: boolean;
  /** TEST-ONLY. Never set by the CLI script. Called synchronously immediately after the in-transaction digest recheck passes, before either UPDATE, so a test can attempt a concurrent second-connection write and observe SQLITE_BUSY. */
  testOnlyHookAfterDigestCheck?: () => void;
}

/**
 * Performs exactly two page-level UPDATEs (July: append 4 items; August:
 * replace the AUG-NEW-02 item in place) inside one SQLite transaction, then
 * re-reads the DB from inside that same transaction and validates every
 * invariant -- including that the three owner-protected wording variants and
 * the local-only draft page are byte-for-byte unchanged -- before allowing
 * the wrapping db.transaction() to commit. Throwing anywhere here causes a
 * native ROLLBACK; nothing is persisted.
 *
 * Invoked via .immediate() (BEGIN IMMEDIATE) for the same reason
 * calendar-backfill-production-core.ts's applyTransaction is: it closes the
 * TOCTOU window between the CLI's pre-backup digest check and this
 * transaction's own recheck.
 */
export function applyTransaction(
  writeDb: Database.Database,
  julyTargets: CalendarItem[],
  augustCanonical: CalendarItem,
  expectedLocalDigest: string,
  protectedBefore: Record<string, string>,
  complianceDraftBefore: string,
  opts: ApplyOptions = {}
): void {
  const tx = writeDb.transaction(() => {
    const liveDigest = tableLogicalDigest(writeDb);
    if (liveDigest !== expectedLocalDigest) {
      throw new Error(
        `LOCAL LOGICAL DIGEST MISMATCH INSIDE WRITE TRANSACTION -- LOCAL DRIFT DETECTED\n` +
          `  expected: ${expectedLocalDigest}\n` +
          `  actual:   ${liveDigest}\n` +
          "The live local calendar_pages content changed after the pre-backup check but before this write transaction -- aborting. No UPDATE has executed."
      );
    }
    opts.testOnlyHookAfterDigestCheck?.();

    const selectStmt = writeDb.prepare("SELECT * FROM calendar_pages WHERE slug = ?");
    const updateStmt = writeDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?");

    const preAllPages = loadAllPages(writeDb);

    // --- July: recheck absence, then append the 4 production-derived objects ---
    const julyRow = selectStmt.get(JULY_PAGE_SLUG) as Record<string, unknown> | undefined;
    if (!julyRow) throw new Error(`Page disappeared mid-transaction: ${JULY_PAGE_SLUG}`);
    const julyItems = JSON.parse(julyRow.dates_json as string) as CalendarItem[];
    for (const id of JULY_TARGET_IDS) {
      if (julyItems.some((it) => it.id === id)) throw new Error(`Target ${JULY_PAGE_SLUG}::${id} unexpectedly already present at write time.`);
    }
    const julyMetaBefore = pageMetadata(julyRow);
    const newJulyItems = [...julyItems, ...julyTargets];
    const julyResult = updateStmt.run(JSON.stringify(newJulyItems), JULY_PAGE_SLUG);
    if (julyResult.changes !== 1) throw new Error(`July update did not affect exactly 1 row (changes=${julyResult.changes}).`);

    // --- August: recheck presence, then replace AUG-NEW-02 in place ---
    const augRow = selectStmt.get(AUGUST_PAGE_SLUG) as Record<string, unknown> | undefined;
    if (!augRow) throw new Error(`Page disappeared mid-transaction: ${AUGUST_PAGE_SLUG}`);
    const augItems = JSON.parse(augRow.dates_json as string) as CalendarItem[];
    const augIdx = augItems.findIndex((it) => it.id === AUGUST_TARGET_ID);
    if (augIdx === -1) throw new Error(`Target ${AUGUST_PAGE_SLUG}::${AUGUST_TARGET_ID} unexpectedly missing at write time.`);
    const augMetaBefore = pageMetadata(augRow);
    const newAugItems = [...augItems];
    newAugItems[augIdx] = augustCanonical;
    const augResult = updateStmt.run(JSON.stringify(newAugItems), AUGUST_PAGE_SLUG);
    if (augResult.changes !== 1) throw new Error(`August update did not affect exactly 1 row (changes=${augResult.changes}).`);

    if (opts.forceFailureAfterWrites) {
      throw new Error("TEST-ONLY forced failure after both writes (forceFailureAfterWrites=true).");
    }

    // ---- In-transaction post-mutation invariants ----
    const postPages = loadAllPages(writeDb);
    const postItems = postPages.flatMap((p) => p.items);

    if (postItems.length !== EXPECTED_FINAL_TOTAL) throw new Error(`In-transaction invariant failed: total=${postItems.length}, expected ${EXPECTED_FINAL_TOTAL}.`);
    const withId = postItems.filter((it) => it.id).length;
    if (withId !== EXPECTED_FINAL_WITH_ID) throw new Error(`In-transaction invariant failed: withId=${withId}, expected ${EXPECTED_FINAL_WITH_ID}.`);
    if (postItems.length - withId !== 0) throw new Error("In-transaction invariant failed: withoutId != 0.");

    const ids = postItems.map((it) => it.id as string);
    if (new Set(ids).size !== ids.length) throw new Error("In-transaction invariant failed: exact duplicate ids present after write.");
    if (new Set(ids.map((v) => v.toLowerCase())).size !== ids.length) throw new Error("In-transaction invariant failed: case-insensitive duplicate ids present after write.");

    // July: target items appended, in order, at the tail, exactly matching source.
    const postJuly = postPages.find((p) => p.slug === JULY_PAGE_SLUG)!.items;
    const tail = postJuly.slice(postJuly.length - JULY_TARGET_IDS.length);
    for (let i = 0; i < JULY_TARGET_IDS.length; i++) {
      if (!tail[i] || tail[i].id !== JULY_TARGET_IDS[i]) throw new Error(`In-transaction invariant failed: July tail order mismatch at index ${i}: expected "${JULY_TARGET_IDS[i]}".`);
      if (JSON.stringify(canonicalize(tail[i])) !== JSON.stringify(canonicalize(julyTargets[i]))) {
        throw new Error(`In-transaction invariant failed: July target "${JULY_TARGET_IDS[i]}" does not exactly match its production-derived source object.`);
      }
    }
    for (let i = 0; i < julyItems.length; i++) {
      const before = JSON.stringify(canonicalize(julyItems[i]));
      const after = JSON.stringify(canonicalize(postJuly[i]));
      if (before !== after) throw new Error(`In-transaction invariant failed: non-target July item changed unexpectedly at index ${i} (id "${julyItems[i].id}").`);
    }

    // August: AUG-NEW-02 exactly equals production canonical; every other item unchanged.
    const postAug = postPages.find((p) => p.slug === AUGUST_PAGE_SLUG)!.items;
    const postAugTarget = postAug.find((it) => it.id === AUGUST_TARGET_ID);
    if (!postAugTarget || JSON.stringify(canonicalize(postAugTarget)) !== JSON.stringify(canonicalize(augustCanonical))) {
      throw new Error(`In-transaction invariant failed: "${AUGUST_TARGET_ID}" does not exactly equal the production canonical object after write.`);
    }
    for (let i = 0; i < augItems.length; i++) {
      if (i === augIdx) continue;
      const before = JSON.stringify(canonicalize(augItems[i]));
      const after = JSON.stringify(canonicalize(postAug[i]));
      if (before !== after) throw new Error(`In-transaction invariant failed: non-target August item changed unexpectedly at index ${i} (id "${augItems[i].id}").`);
    }

    // Protected wording variants unchanged.
    for (const p of PROTECTED_ITEMS) {
      const item = postPages.find((pg) => pg.slug === p.slug)?.items.find((it) => it.id === p.id);
      if (!item) throw new Error(`In-transaction invariant failed: protected item missing after write: ${p.slug}::${p.id}.`);
      const after = fullFingerprint(item);
      const before = protectedBefore[`${p.slug}::${p.id}`];
      if (after !== before) throw new Error(`In-transaction invariant failed: protected item changed: ${p.slug}::${p.id}. This is an owner-approved local wording variant and must never be mutated by this script.`);
    }

    // Local-only draft page unchanged.
    const complianceRow = selectStmt.get(COMPLIANCE_DRAFT_PAGE_SLUG) as Record<string, unknown> | undefined;
    if (!complianceRow) throw new Error(`In-transaction invariant failed: draft page missing after write: ${COMPLIANCE_DRAFT_PAGE_SLUG}.`);
    if (fullPageFingerprint(complianceRow) !== complianceDraftBefore) throw new Error(`In-transaction invariant failed: local-only draft page changed: ${COMPLIANCE_DRAFT_PAGE_SLUG}.`);

    // Every other page (not July, not August) entirely unchanged.
    for (const prePage of preAllPages) {
      if (prePage.slug === JULY_PAGE_SLUG || prePage.slug === AUGUST_PAGE_SLUG) continue;
      const postPage = postPages.find((p) => p.slug === prePage.slug);
      if (!postPage) throw new Error(`In-transaction invariant failed: page missing after write: ${prePage.slug}`);
      const before = JSON.stringify(canonicalize(prePage.items));
      const after = JSON.stringify(canonicalize(postPage.items));
      if (before !== after) throw new Error(`In-transaction invariant failed: untouched page content changed: ${prePage.slug}`);
    }

    // July/August page metadata (non-dates_json columns) unchanged.
    const julyRowAfter = selectStmt.get(JULY_PAGE_SLUG) as Record<string, unknown>;
    if (JSON.stringify(pageMetadata(julyRowAfter)) !== JSON.stringify(julyMetaBefore)) throw new Error(`In-transaction invariant failed: page metadata changed for ${JULY_PAGE_SLUG}.`);
    const augRowAfter = selectStmt.get(AUGUST_PAGE_SLUG) as Record<string, unknown>;
    if (JSON.stringify(pageMetadata(augRowAfter)) !== JSON.stringify(augMetaBefore)) throw new Error(`In-transaction invariant failed: page metadata changed for ${AUGUST_PAGE_SLUG}.`);
  });

  tx.immediate();
}

// ---- Independent post-commit verification ---------------------------------------

export interface PostCommitVerification {
  ok: boolean;
  errors: string[];
  totalCount: number;
  withIdCount: number;
  withoutIdCount: number;
}

/** Reopens dbPath as a brand-new connection (independent of the write connection) and re-derives every invariant from disk. */
export function independentPostCommitVerify(
  dbPath: string,
  julyTargets: CalendarItem[],
  augustCanonical: CalendarItem,
  protectedBefore: Record<string, string>,
  complianceDraftBefore: string
): PostCommitVerification {
  const errors: string[] = [];
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const pages = loadAllPages(db);
    const items = pages.flatMap((p) => p.items);
    const totalCount = items.length;
    const withIdCount = items.filter((it) => it.id).length;
    const withoutIdCount = totalCount - withIdCount;

    if (totalCount !== EXPECTED_FINAL_TOTAL) errors.push(`Post-commit: total=${totalCount}, expected ${EXPECTED_FINAL_TOTAL}.`);
    if (withIdCount !== EXPECTED_FINAL_WITH_ID) errors.push(`Post-commit: withId=${withIdCount}, expected ${EXPECTED_FINAL_WITH_ID}.`);
    if (withoutIdCount !== 0) errors.push(`Post-commit: withoutId=${withoutIdCount}, expected 0.`);

    const ids = items.map((it) => it.id).filter((v): v is string => typeof v === "string" && v.length > 0);
    if (new Set(ids).size !== ids.length) errors.push("Post-commit: exact duplicate ids present.");
    if (new Set(ids.map((v) => v.toLowerCase())).size !== ids.length) errors.push("Post-commit: case-insensitive duplicate ids present.");

    const julyItems = pages.find((p) => p.slug === JULY_PAGE_SLUG)?.items ?? [];
    const tail = julyItems.slice(julyItems.length - JULY_TARGET_IDS.length);
    for (let i = 0; i < JULY_TARGET_IDS.length; i++) {
      if (!tail[i] || tail[i].id !== JULY_TARGET_IDS[i] || JSON.stringify(canonicalize(tail[i])) !== JSON.stringify(canonicalize(julyTargets[i]))) {
        errors.push(`Post-commit: "${JULY_TARGET_IDS[i]}" missing or does not exactly match its production-derived object.`);
      }
    }

    const augItem = pages.find((p) => p.slug === AUGUST_PAGE_SLUG)?.items.find((it) => it.id === AUGUST_TARGET_ID);
    if (!augItem || JSON.stringify(canonicalize(augItem)) !== JSON.stringify(canonicalize(augustCanonical))) {
      errors.push(`Post-commit: "${AUGUST_TARGET_ID}" does not exactly equal the production canonical object.`);
    }

    for (const p of PROTECTED_ITEMS) {
      const item = pages.find((pg) => pg.slug === p.slug)?.items.find((it) => it.id === p.id);
      if (!item) {
        errors.push(`Post-commit: protected item missing: ${p.slug}::${p.id}.`);
        continue;
      }
      if (fullFingerprint(item) !== protectedBefore[`${p.slug}::${p.id}`]) errors.push(`Post-commit: protected item changed: ${p.slug}::${p.id}.`);
    }

    const complianceRow = db.prepare("SELECT * FROM calendar_pages WHERE slug = ?").get(COMPLIANCE_DRAFT_PAGE_SLUG) as Record<string, unknown> | undefined;
    if (!complianceRow) errors.push(`Post-commit: draft page missing: ${COMPLIANCE_DRAFT_PAGE_SLUG}.`);
    else if (fullPageFingerprint(complianceRow) !== complianceDraftBefore) errors.push(`Post-commit: draft page changed: ${COMPLIANCE_DRAFT_PAGE_SLUG}.`);

    return { ok: errors.length === 0, errors, totalCount, withIdCount, withoutIdCount };
  } finally {
    db.close();
  }
}

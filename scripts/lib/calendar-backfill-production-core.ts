// Pure, independently-testable logic for
// scripts/backfill-calendar-item-ids-production.ts (PRE-FRESH-01-ID-03B).
//
// Kept separate from the CLI script (no top-level side effects, no argv
// parsing, no process.exit) so tests/freshness/backfill-calendar-item-ids-
// production.test.ts can exercise every branch directly -- including a
// test-only forced-failure hook in applyTransaction() used to prove native
// SQLite rollback -- without spawning the CLI for every case.
//
// This module is intentionally separate from scripts/lib/calendar-backfill-
// safety.ts's production-path guard: that guard exists to keep the LOCAL
// script (backfill-calendar-item-ids-local.ts) off production paths. This
// module is for a script that targets production on purpose, so the guard
// is not reused or inverted here. Only genuinely shared, pure, path-agnostic
// helpers (findDuplicates, defaultBackupFileName) are imported from it.

import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { findDuplicates } from "./calendar-backfill-safety";

// ---- Fixed target list (12 items, structurally excludes every COMPLY-* id) --
//
// This is a separate constant from the 21-item TARGETS array in
// backfill-calendar-item-ids-local.ts -- not a filtered view of it -- so a
// COMPLY-* id is structurally impossible to reach this script. Values are
// copied verbatim from the PRE-FRESH-01-ID-01 audit / ID-02 script and were
// independently re-verified against the frozen production snapshot
// (backups/audit/pre-fresh-01-id-03a/guides.db.snapshot.20260809-085329,
// sha256 8f7abb38b6540f1f6df55f528915fc7a649865c7c3ed65f38416bb94135fab99)
// during the PRE-FRESH-01-ID-03A2 reconciliation audit: 12/12 fingerprints
// matched, all still id-less.

export interface ProductionTarget {
  slug: string;
  idx: number;
  id: string;
  expectedFingerprint: string;
}

export const PRODUCTION_TARGETS: ProductionTarget[] = [
  { slug: "may-2026-uae-calendar", idx: 0, id: "MAY-01-EIDFED", expectedFingerprint: "76e88c3134cfaf5c646eaaa1465b7283b319d4a679a36b3a81cfb1b60ad0823d" },
  { slug: "may-2026-uae-calendar", idx: 1, id: "MAY-02-EIDBEGIN", expectedFingerprint: "c4b3ba18fe59dc1a23f8732c90ed91234e93d7781665164e41d3071db6a63795" },
  { slug: "may-2026-uae-calendar", idx: 2, id: "MAY-03-BRKWIN", expectedFingerprint: "35067ec257b861803f01321a4d438ef8208d5af7f0e52e5309e52cb75c4eb92c" },
  { slug: "may-2026-uae-calendar", idx: 3, id: "MAY-04-EIDPRIV", expectedFingerprint: "b562a28d1266068a1cdf3da06486368181009abe061aef683ca8999e72d94e89" },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 0, id: "EINV-01-PILOT", expectedFingerprint: "d901e96b27f1c47ffc75fb7e70bff48f6266d5dde7ab28fbd067c6ae8f18bdf1" },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 1, id: "EINV-02-ASPLARGE", expectedFingerprint: "11871b30cd427adc11563e93baa4d5a1a57cd04528270265fe6affe8b859be5c" },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 2, id: "EINV-03-GOLIVELARGE", expectedFingerprint: "d692fab8cc529f93aa7be23e3582df29f22e4abcd8eb4982f7494b01a9522b2f" },
  { slug: "uae-emiratisation-june-30-2026-reminder", idx: 0, id: "EMIRAT-01-50PLUS", expectedFingerprint: "d129e6fe6959d08d5ddf836b7cb3bc143b78e8e6ac6bfabcee7e6eba58260e38" },
  { slug: "uae-long-weekends-2026-2027", idx: 0, id: "LONGWKND-01-NEWYEAR", expectedFingerprint: "2d4ea1139faa620b0e74b200f721653044f77fe138aaf53d6e08be86475b33e1" },
  { slug: "uae-long-weekends-2026-2027", idx: 1, id: "LONGWKND-02-EIDFITR", expectedFingerprint: "48b0ec00b23e8ed83cef79986b87bcf75cfcede39022761aefe532c3bc5ad8ea" },
  { slug: "uae-long-weekends-2026-2027", idx: 2, id: "LONGWKND-03-COMMEM", expectedFingerprint: "03e5e1be5ee3bd420d9207f26994fa89cf648a91ef371cf90ccaebee3b5472ce" },
  { slug: "uae-long-weekends-2026-2027", idx: 3, id: "LONGWKND-04-NATDAY", expectedFingerprint: "6adcc4c28e3c3e2d587d194cb9bea1fbbb643e35c0bd7f2cdae6177aabba2e41" },
];

// Exactly these 4 pages may contain id-less items, with exactly these
// counts. Any other id-less item anywhere in the corpus aborts the run --
// there is no fuzzy/partial-match adaptation.
export const PRODUCTION_ID_LESS_EXPECTATIONS: Record<string, number> = {
  "may-2026-uae-calendar": 4,
  "uae-e-invoicing-2026-asp-deadline": 3,
  "uae-emiratisation-june-30-2026-reminder": 1,
  "uae-long-weekends-2026-2027": 4,
};

export const EXPECTED_TOTAL = 118;
export const EXPECTED_WITH_ID = 106;
export const EXPECTED_WITHOUT_ID = 12;
export const REQUIRED_CONFIRM_TOKEN = "ID-03B-12";

if (PRODUCTION_TARGETS.length !== 12) {
  throw new Error(`Internal error: PRODUCTION_TARGETS has ${PRODUCTION_TARGETS.length} entries, expected 12.`);
}
for (const t of PRODUCTION_TARGETS) {
  if (t.id.startsWith("COMPLY-")) {
    throw new Error(`Internal error: PRODUCTION_TARGETS must never contain a COMPLY-* id (found "${t.id}").`);
  }
}

// ---- Canonical fingerprint (identical algorithm to the ID-02 local script) --

export type CalendarItem = Record<string, unknown>;

export function canonicalize(value: unknown): unknown {
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

export function fingerprint(item: CalendarItem): string {
  const rest = { ...item };
  delete rest.id;
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(rest))).digest("hex");
}

// ---- Corpus loading -----------------------------------------------------------

export function loadAllPages(db: Database.Database): { slug: string; items: CalendarItem[] }[] {
  const rows = db.prepare("SELECT slug, dates_json FROM calendar_pages").all() as { slug: string; dates_json: string }[];
  return rows.map((r) => ({ slug: r.slug, items: JSON.parse(r.dates_json) as CalendarItem[] }));
}

// ---- Preconditions --------------------------------------------------------------

export interface PreconditionResult {
  ok: boolean;
  errors: string[];
  totalCount: number;
  withIdCount: number;
  withoutIdCount: number;
  idLessBySlug: Record<string, number>;
  existingIds: string[];
  pages: { slug: string; items: CalendarItem[] }[];
}

/**
 * Every precondition required before a dry-run "would update" report or an
 * --apply backup/transaction may proceed. Returns ok=false with a full list
 * of errors instead of throwing on the first failure, so a dry run can
 * report everything wrong in one pass.
 */
export function checkPreconditions(db: Database.Database): PreconditionResult {
  const errors: string[] = [];
  const pages = loadAllPages(db);
  const allItems = pages.flatMap((p) => p.items);
  const totalCount = allItems.length;
  const withIdCount = allItems.filter((it) => it.id).length;
  const withoutIdCount = totalCount - withIdCount;

  if (totalCount !== EXPECTED_TOTAL) errors.push(`Expected ${EXPECTED_TOTAL} total items, found ${totalCount}. Production corpus has drifted -- do not proceed.`);
  if (withIdCount !== EXPECTED_WITH_ID) errors.push(`Expected ${EXPECTED_WITH_ID} items with id, found ${withIdCount}. Production corpus has drifted -- do not proceed.`);
  if (withoutIdCount !== EXPECTED_WITHOUT_ID) errors.push(`Expected ${EXPECTED_WITHOUT_ID} items without id, found ${withoutIdCount}. Production corpus has drifted -- do not proceed.`);

  const idLessBySlug: Record<string, number> = {};
  for (const page of pages) {
    const c = page.items.filter((it) => !it.id).length;
    if (c > 0) idLessBySlug[page.slug] = c;
  }
  for (const [slug, count] of Object.entries(idLessBySlug)) {
    const expected = PRODUCTION_ID_LESS_EXPECTATIONS[slug];
    if (expected === undefined) {
      errors.push(`Unexpected id-less item(s) found on unapproved page "${slug}" (${count} item(s)). Exactly 4 named pages are approved for this backfill -- aborting rather than adapting.`);
    } else if (count !== expected) {
      errors.push(`Page "${slug}" has ${count} id-less item(s), expected exactly ${expected}.`);
    }
  }
  for (const [slug, expected] of Object.entries(PRODUCTION_ID_LESS_EXPECTATIONS)) {
    if (!(slug in idLessBySlug)) errors.push(`Expected page "${slug}" to have ${expected} id-less item(s), found 0 (page missing or already fully id'd).`);
  }

  const pageIndex = new Map(pages.map((p) => [p.slug, p.items]));
  for (const t of PRODUCTION_TARGETS) {
    const items = pageIndex.get(t.slug);
    if (!items) { errors.push(`Target page not found: ${t.slug}`); continue; }
    const item = items[t.idx];
    if (!item) { errors.push(`Target index out of range: ${t.slug}[${t.idx}]`); continue; }
    if (item.id) { errors.push(`Target ${t.slug}[${t.idx}] already has an id ("${item.id}") -- refusing to overwrite an existing id.`); continue; }
    const actual = fingerprint(item);
    if (actual !== t.expectedFingerprint) {
      errors.push(
        `Fingerprint mismatch for ${t.slug}[${t.idx}] (intended id ${t.id}). expected=${t.expectedFingerprint} actual=${actual}. ` +
          "This item's content has changed since the audit snapshot -- do not proceed with a stale plan."
      );
    }
  }

  const existingIds = allItems.map((it) => it.id).filter((v): v is string => typeof v === "string" && v.length > 0);
  const existingExactDupes = findDuplicates(existingIds);
  if (existingExactDupes.length > 0) errors.push(`Pre-existing exact duplicate id(s) found in the existing corpus: ${existingExactDupes.join(", ")}.`);
  const existingLowerDupes = findDuplicates(existingIds.map((v) => v.toLowerCase()));
  if (existingLowerDupes.length > 0) errors.push(`Pre-existing case-insensitive duplicate id(s) found in the existing corpus: ${existingLowerDupes.join(", ")}.`);

  const proposedIds = PRODUCTION_TARGETS.map((t) => t.id);
  const proposedExactDupes = findDuplicates(proposedIds);
  if (proposedExactDupes.length > 0) errors.push(`Proposed IDs are not unique among themselves: ${proposedExactDupes.join(", ")}`);
  const proposedLowerDupes = findDuplicates(proposedIds.map((v) => v.toLowerCase()));
  if (proposedLowerDupes.length > 0) errors.push(`Proposed IDs are not case-insensitively unique among themselves: ${proposedLowerDupes.join(", ")}`);

  const existingSet = new Set(existingIds);
  const existingLowerSet = new Set(existingIds.map((v) => v.toLowerCase()));
  for (const id of proposedIds) {
    if (existingSet.has(id)) errors.push(`Proposed id "${id}" collides with an existing id.`);
    else if (existingLowerSet.has(id.toLowerCase())) errors.push(`Proposed id "${id}" collides case-insensitively with an existing id.`);
  }

  return { ok: errors.length === 0, errors, totalCount, withIdCount, withoutIdCount, idLessBySlug, existingIds, pages };
}

// ---- Logical digest (WAL-safe backup verification AND owner-approved -----------
//      write-authorization lock) --------------------------------------------------
//
// An SQLite online backup (better-sqlite3's .backup(), wrapping SQLite's
// native backup API) is not guaranteed byte-identical to the source file --
// it can repage/reorder freelist content even when the logical row content
// is identical. Byte-for-byte SHA equality is therefore the wrong test for
// "did the backup faithfully capture the source". Instead, this digests the
// full calendar_pages table content (every column, dates_json parsed back
// into structured JSON so formatting differences don't matter, rows ordered
// by slug for determinism) into a single SHA-256. Source-pre-write and
// backup digests must match exactly before a write is allowed to proceed.
//
// This same function is ALSO the CLI's owner-approved --expected-calendar-
// digest authorization gate (added post-PRE-FRESH-01-ID-03B-02 independent
// QA, which proved --expected-db-sha256 alone is not WAL-safe: a connection
// left open elsewhere can commit a change into the WAL that is invisible to
// a raw-file SHA256 read but visible to any fresh SQLite connection -- see
// the CLI script's comment on the digest gate for the full argument). This
// digest is intentionally scoped to calendar_pages only, matching the scope
// of the mutation this script performs. It is NOT a full-database logical
// lock: a change to any other table is invisible to it. The SQLite online
// backup itself remains a full-database copy regardless -- only this
// authorization digest (and the raw file SHA) are calendar_pages-scoped.

export function tableLogicalDigest(db: Database.Database): string {
  const rows = db.prepare("SELECT * FROM calendar_pages ORDER BY slug").all() as Record<string, unknown>[];
  const canonicalRows = rows.map((r) => {
    const clone: Record<string, unknown> = { ...r };
    if (typeof clone.dates_json === "string") {
      try {
        clone.dates_json = JSON.parse(clone.dates_json);
      } catch {
        // Leave as a raw string; an unparsable dates_json is itself a
        // meaningful digest input (it will simply never match anything).
      }
    }
    return canonicalize(clone);
  });
  return crypto.createHash("sha256").update(JSON.stringify(canonicalRows)).digest("hex");
}

/** SHA-256 of the calendar_pages CREATE TABLE statement -- catches schema drift between source and backup. */
export function schemaFingerprint(db: Database.Database): string {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'calendar_pages'").get() as { sql: string } | undefined;
  return crypto.createHash("sha256").update(row?.sql ?? "").digest("hex");
}

// ---- WAL-safe online backup -----------------------------------------------------

/**
 * Atomically reserves a brand-new, uniquely-named directory under
 * `backupDir` for this run's backup to live in, using fs.mkdtempSync --
 * which wraps the OS mkdtemp(3) syscall and is inherently collision-proof.
 *
 * This replaces an earlier design (pickUniqueBackupPath, removed post-
 * PRE-FRESH-01-ID-03B-02 independent QA finding P1-B) that generated a
 * candidate filename and then separately checked fs.existsSync() before
 * writing to it. That was a check-then-use race (TOCTOU): nothing stopped
 * another process, or a second invocation of this script, from creating a
 * file at the same path in the gap between the check and the write, and
 * better-sqlite3's .backup() has no built-in exclusive-create protection --
 * it will silently overwrite an existing file at the destination path. A
 * generated name being "unlikely to collide" is not the same as being
 * structurally unable to collide.
 *
 * mkdtempSync closes that gap: the directory it returns is guaranteed to
 * have not existed a moment before this call returned, and to be owned
 * exclusively by this call. The backup file is then written inside that
 * directory (see assertBackupDestinationAbsent + createOnlineBackup call
 * sites in the CLI script), so there is no name to race over.
 */
export function reserveBackupDirectory(backupDir: string): string {
  fs.mkdirSync(backupDir, { recursive: true });
  return fs.mkdtempSync(path.join(backupDir, "id-03b-"));
}

/**
 * Defense-in-depth check called immediately before .backup() is invoked
 * against a path inside a directory just reserved by reserveBackupDirectory.
 * This should never actually find anything -- the directory is freshly
 * created and exclusively owned -- but if it somehow does, this aborts
 * rather than letting .backup() silently overwrite it.
 */
export function assertBackupDestinationAbsent(backupPath: string): void {
  if (fs.existsSync(backupPath)) {
    throw new Error(`Backup destination unexpectedly already exists: ${backupPath}. Refusing to overwrite -- aborting instead.`);
  }
}

/**
 * SQLite's online-backup API via better-sqlite3's .backup(). Unlike a raw
 * file copy, this reads through the pager layer and correctly captures
 * WAL-committed data even when the main DB file itself has not been
 * checkpointed -- the property a naive fs.copyFileSync of a live WAL-mode
 * DB cannot guarantee.
 */
export async function createOnlineBackup(sourceDb: Database.Database, backupPath: string): Promise<void> {
  await sourceDb.backup(backupPath);
}

export interface BackupVerification {
  ok: boolean;
  errors: string[];
  integrityCheck: string;
  logicalDigest: string;
  schemaFp: string;
}

/** Opens the backup independently (readonly, its own connection) and verifies integrity + logical equivalence to the pre-write source. */
export function verifyBackup(backupPath: string, expectedLogicalDigest: string, expectedSchemaFp: string): BackupVerification {
  if (!fs.existsSync(backupPath)) {
    return { ok: false, errors: [`Backup file does not exist: ${backupPath}`], integrityCheck: "", logicalDigest: "", schemaFp: "" };
  }
  if (fs.statSync(backupPath).size === 0) {
    return { ok: false, errors: [`Backup file is empty: ${backupPath}`], integrityCheck: "", logicalDigest: "", schemaFp: "" };
  }

  const errors: string[] = [];
  let integrityCheck = "";
  let logicalDigest = "";
  let schemaFp = "";
  try {
    const db = new Database(backupPath, { readonly: true, fileMustExist: true });
    try {
      const rows = db.pragma("integrity_check") as { integrity_check: string }[];
      integrityCheck = rows.map((r) => r.integrity_check).join("; ");
      if (integrityCheck !== "ok") errors.push(`Backup PRAGMA integrity_check did not return "ok": ${integrityCheck}`);

      logicalDigest = tableLogicalDigest(db);
      if (logicalDigest !== expectedLogicalDigest) {
        errors.push(`Backup logical digest does not match pre-write source. expected=${expectedLogicalDigest} actual=${logicalDigest}`);
      }

      schemaFp = schemaFingerprint(db);
      if (schemaFp !== expectedSchemaFp) {
        errors.push(`Backup schema fingerprint does not match pre-write source. expected=${expectedSchemaFp} actual=${schemaFp}`);
      }
    } finally {
      db.close();
    }
  } catch (err) {
    // A backup file that SQLite cannot even open (corruption, truncation)
    // is itself a verification failure, not a crash -- report it the same
    // way as any other backup-integrity problem.
    errors.push(`Backup file could not be opened/read as a valid SQLite database: ${(err as Error).message}`);
  }
  return { ok: errors.length === 0, errors, integrityCheck, logicalDigest, schemaFp };
}

// ---- Apply transaction ---------------------------------------------------------

export interface ApplyOptions {
  /**
   * TEST-ONLY. Never set by the CLI script. Throws immediately after the
   * Nth page-level UPDATE inside the transaction, to prove that a mid-
   * transaction failure produces a full native SQLite rollback (zero
   * partial writes) rather than a partially-applied backfill.
   */
  forceFailureAfterUpdates?: number;
}

function pageMetadata(row: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...row };
  delete clone.dates_json;
  return clone;
}

/**
 * Performs the exact 4 page-level UPDATEs (12 id assignments) inside one
 * SQLite transaction, then re-reads the DB from inside that same
 * transaction and validates every invariant before allowing the wrapping
 * db.transaction() to commit. Throwing anywhere in here -- a precondition
 * re-check, a forced test failure, an invariant violation -- causes
 * better-sqlite3 to issue a native ROLLBACK; nothing is persisted.
 */
export function applyTransaction(writeDb: Database.Database, targets: ProductionTarget[], prePages: { slug: string; items: CalendarItem[] }[], opts: ApplyOptions = {}): void {
  const tx = writeDb.transaction(() => {
    const touchedSlugs = [...new Set(targets.map((t) => t.slug))];
    const bySlug = new Map<string, ProductionTarget[]>();
    for (const t of targets) {
      if (!bySlug.has(t.slug)) bySlug.set(t.slug, []);
      bySlug.get(t.slug)!.push(t);
    }

    const selectStmt = writeDb.prepare("SELECT * FROM calendar_pages WHERE slug = ?");
    const updateStmt = writeDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?");

    const preMetaBySlug = new Map<string, Record<string, unknown>>();
    for (const slug of touchedSlugs) {
      const row = selectStmt.get(slug) as Record<string, unknown> | undefined;
      if (!row) throw new Error(`Page disappeared mid-transaction: ${slug}`);
      preMetaBySlug.set(slug, pageMetadata(row));
    }

    let updatesApplied = 0;
    for (const [slug, ts] of bySlug) {
      const row = selectStmt.get(slug) as Record<string, unknown> | undefined;
      if (!row) throw new Error(`Page disappeared mid-transaction: ${slug}`);
      const items = JSON.parse(row.dates_json as string) as CalendarItem[];

      for (const t of ts) {
        const item = items[t.idx];
        if (!item || item.id) throw new Error(`Target ${slug}[${t.idx}] invalid at write time (missing or already has an id).`);
        const actual = fingerprint(item);
        if (actual !== t.expectedFingerprint) throw new Error(`Fingerprint drift detected mid-transaction for ${slug}[${t.idx}] (intended id ${t.id}).`);
        item.id = t.id; // ONLY key added -- every other key on the object is untouched.
      }

      const result = updateStmt.run(JSON.stringify(items), slug);
      if (result.changes !== 1) throw new Error(`Update did not affect exactly 1 row for ${slug} (changes=${result.changes}).`);
      updatesApplied += 1;

      if (opts.forceFailureAfterUpdates !== undefined && updatesApplied >= opts.forceFailureAfterUpdates) {
        throw new Error(`TEST-ONLY forced failure after ${updatesApplied} update(s) inside the transaction (forceFailureAfterUpdates=${opts.forceFailureAfterUpdates}).`);
      }
    }

    // In-transaction post-mutation validation. Nothing above this point is
    // durable yet -- only a clean return from this function allows
    // db.transaction() to COMMIT.
    const postPages = loadAllPages(writeDb);
    const postItems = postPages.flatMap((p) => p.items);

    if (postItems.length !== EXPECTED_TOTAL) throw new Error(`In-transaction invariant failed: total=${postItems.length}, expected ${EXPECTED_TOTAL}.`);
    const withId = postItems.filter((it) => it.id).length;
    // Post-write, every item must carry an id: withId must equal the total
    // (EXPECTED_WITH_ID is the PRE-write count and does not apply here).
    if (withId !== EXPECTED_TOTAL) throw new Error(`In-transaction invariant failed: withId=${withId}, expected ${EXPECTED_TOTAL}.`);
    if (postItems.length - withId !== 0) throw new Error(`In-transaction invariant failed: withoutId != 0.`);

    const ids = postItems.map((it) => it.id as string);
    if (new Set(ids).size !== ids.length) throw new Error("In-transaction invariant failed: exact duplicate ids present after write.");
    if (new Set(ids.map((v) => v.toLowerCase())).size !== ids.length) throw new Error("In-transaction invariant failed: case-insensitive duplicate ids present after write.");

    for (const t of targets) {
      const page = postPages.find((p) => p.slug === t.slug);
      const item = page?.items[t.idx];
      if (!item || item.id !== t.id) throw new Error(`In-transaction invariant failed: ${t.slug}[${t.idx}] does not carry id "${t.id}".`);
    }

    for (const prePage of prePages) {
      if (!touchedSlugs.includes(prePage.slug)) continue;
      const postPage = postPages.find((p) => p.slug === prePage.slug);
      if (!postPage) throw new Error(`In-transaction invariant failed: page missing after write: ${prePage.slug}`);
      for (let i = 0; i < prePage.items.length; i++) {
        if (targets.some((t) => t.slug === prePage.slug && t.idx === i)) continue;
        const before = JSON.stringify(canonicalize(prePage.items[i]));
        const after = JSON.stringify(canonicalize(postPage.items[i]));
        if (before !== after) throw new Error(`In-transaction invariant failed: non-target item changed unexpectedly: ${prePage.slug}[${i}]`);
      }
    }

    for (const slug of touchedSlugs) {
      const row = selectStmt.get(slug) as Record<string, unknown> | undefined;
      if (!row) throw new Error(`In-transaction invariant failed: page missing after write: ${slug}`);
      const before = JSON.stringify(preMetaBySlug.get(slug));
      const after = JSON.stringify(pageMetadata(row));
      if (before !== after) throw new Error(`In-transaction invariant failed: page metadata (non-dates_json columns) changed for ${slug}.`);
    }
  });

  tx();
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
export function independentPostCommitVerify(dbPath: string): PostCommitVerification {
  const errors: string[] = [];
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const pages = loadAllPages(db);
    const items = pages.flatMap((p) => p.items);
    const totalCount = items.length;
    const withIdCount = items.filter((it) => it.id).length;
    const withoutIdCount = totalCount - withIdCount;

    if (totalCount !== EXPECTED_TOTAL) errors.push(`Post-commit: total=${totalCount}, expected ${EXPECTED_TOTAL}.`);
    // Post-write, every item must carry an id: withId must equal the total
    // (EXPECTED_WITH_ID is the PRE-write count and does not apply here).
    if (withIdCount !== EXPECTED_TOTAL) errors.push(`Post-commit: withId=${withIdCount}, expected ${EXPECTED_TOTAL}.`);
    if (withoutIdCount !== 0) errors.push(`Post-commit: withoutId=${withoutIdCount}, expected 0.`);

    const ids = items.map((it) => it.id).filter((v): v is string => typeof v === "string" && v.length > 0);
    if (new Set(ids).size !== ids.length) errors.push("Post-commit: exact duplicate ids present.");
    if (new Set(ids.map((v) => v.toLowerCase())).size !== ids.length) errors.push("Post-commit: case-insensitive duplicate ids present.");

    const pageIndex = new Map(pages.map((p) => [p.slug, p.items]));
    for (const t of PRODUCTION_TARGETS) {
      const item = pageIndex.get(t.slug)?.[t.idx];
      if (!item || item.id !== t.id) errors.push(`Post-commit: ${t.slug}[${t.idx}] does not carry id "${t.id}".`);
    }

    return { ok: errors.length === 0, errors, totalCount, withIdCount, withoutIdCount };
  } finally {
    db.close();
  }
}

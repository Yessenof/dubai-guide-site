// POST-ID-03 regression suite for
// scripts/post-id03-local-canonical-resync.ts and its extracted logic module
// scripts/lib/post-id03-local-canonical-resync-core.ts.
//
// Every mutable DB used here is a disposable temp copy. The "local" fixture
// is built by cloning the audited WAL-safe pre-resync local backup
// (backups/local/id-03b-uLqglt/guides.db -- 12/123/123/0 shape, logical
// digest matching EXPECTED_LOCAL_LOGICAL_DIGEST), NOT the live
// data/guides.db: that file is correctly reconciled to its post-resync
// 12/127/127/0 shape by design and is expected to keep failing this script's
// authorization gate on every future run (see EXPECTED_LOCAL_LOGICAL_DIGEST
// doc comment in the core module) -- sourcing fixtures from it would make
// this entire suite permanently unrunnable. The "production" fixture is
// built by cloning the audited WAL-safe production snapshot captured for
// this operation (11/118/118/0, logical digest matching
// EXPECTED_PRODUCTION_LOGICAL_DIGEST). All real files are opened read-only
// to clone; none is ever written to. Both audit artifacts are local,
// untracked files (never committed -- see project rules on DB/backup files)
// so every describe() block that needs them is skipped when either is
// absent, exactly like this repo's existing HAS_REAL_DB-gated suites. This
// makes the suite's outcome independent of data/guides.db's current shape.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import {
  JULY_PAGE_SLUG,
  AUGUST_PAGE_SLUG,
  COMPLIANCE_DRAFT_PAGE_SLUG,
  JULY_TARGET_IDS,
  AUGUST_TARGET_ID,
  PROTECTED_ITEMS,
  EXPECTED_PRODUCTION_LOGICAL_DIGEST,
  EXPECTED_LOCAL_LOGICAL_DIGEST,
  LOCAL_EXPECTED_TOTAL,
  EXPECTED_FINAL_TOTAL,
  EXPECTED_FINAL_WITH_ID,
  EXPECTED_FINAL_WITHOUT_ID,
  canonicalize,
  loadAllPages,
  fullFingerprint,
  fullPageFingerprint,
  loadFullPage,
  checkPreconditions,
  tableLogicalDigest,
  applyTransaction,
  independentPostCommitVerify,
  type CalendarItem,
} from "../../scripts/lib/post-id03-local-canonical-resync-core";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
// Live local DB -- used ONLY by test 34, which specifically verifies that a
// dry run against the REAL file never writes to it, regardless of whether
// preconditions pass or fail. No other test in this suite reads from this
// path: every other fixture is sourced from the audited pre-resync backup
// below, so the suite's outcome does not depend on this file's current shape.
const REAL_LOCAL_DB_PATH = path.join(REPO_ROOT, "data", "guides.db");
// Audited pre-resync local backup (POST-ID-03 QA artifact) -- the fixed,
// historical fixture every OTHER test in this suite builds its disposable
// "local" copies from. Its logical digest is expected to equal
// EXPECTED_LOCAL_LOGICAL_DIGEST exactly; see localBackupHasExpectedDigest().
const REAL_PRE_RESYNC_LOCAL_BACKUP_PATH = path.join(REPO_ROOT, "backups", "local", "id-03b-uLqglt", "guides.db");
const REAL_PRODUCTION_SNAPSHOT_PATH = path.join(
  REPO_ROOT,
  "backups",
  "audit",
  "post-id03-local-canonical-resync",
  "guides.db.production-snapshot.20260809T190036Z"
);
const SCRIPT_PATH = path.join("scripts", "post-id03-local-canonical-resync.ts");

const createdDirs: string[] = [];
function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `guidex-post-id03-test-${prefix}-`));
  createdDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of createdDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function localBackupHasExpectedDigest(): boolean {
  if (!fs.existsSync(REAL_PRE_RESYNC_LOCAL_BACKUP_PATH)) return false;
  const db = new Database(REAL_PRE_RESYNC_LOCAL_BACKUP_PATH, { readonly: true, fileMustExist: true });
  try {
    return tableLogicalDigest(db) === EXPECTED_LOCAL_LOGICAL_DIGEST;
  } finally {
    db.close();
  }
}

function productionSnapshotHasExpectedShape(): boolean {
  if (!fs.existsSync(REAL_PRODUCTION_SNAPSHOT_PATH)) return false;
  const db = new Database(REAL_PRODUCTION_SNAPSHOT_PATH, { readonly: true, fileMustExist: true });
  try {
    return tableLogicalDigest(db) === EXPECTED_PRODUCTION_LOGICAL_DIGEST;
  } finally {
    db.close();
  }
}

const HAS_REAL_LOCAL = localBackupHasExpectedDigest();
const HAS_REAL_SNAPSHOT = productionSnapshotHasExpectedShape();
const HAS_BOTH_FIXTURES = HAS_REAL_LOCAL && HAS_REAL_SNAPSHOT;
const SKIP_REASON = "requires both the audited pre-resync local backup (backups/local/id-03b-uLqglt/guides.db, digest matching EXPECTED_LOCAL_LOGICAL_DIGEST) and the audited PRE-FRESH-01-ID-03B production snapshot -- local, untracked audit artifacts not guaranteed present in every environment. Deliberately independent of data/guides.db's current shape.";

function buildLocalFixture(destPath: string): void {
  fs.copyFileSync(REAL_PRE_RESYNC_LOCAL_BACKUP_PATH, destPath);
}
function buildProductionFixture(destPath: string): void {
  fs.copyFileSync(REAL_PRODUCTION_SNAPSHOT_PATH, destPath);
}

function loadPageItems(dbPath: string, slug: string): CalendarItem[] | undefined {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    return loadAllPages(db).find((p) => p.slug === slug)?.items;
  } finally {
    db.close();
  }
}

function countIds(dbPath: string): { total: number; withId: number; withoutId: number } {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const items = loadAllPages(db).flatMap((p) => p.items);
    const withId = items.filter((it) => it.id).length;
    return { total: items.length, withId, withoutId: items.length - withId };
  } finally {
    db.close();
  }
}

function sha256File(p: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

function runScript(args: string[]): { status: number; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", SCRIPT_PATH, ...args], { cwd: REPO_ROOT, encoding: "utf8" });
  return { status: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

// ============================================================================
// A. Structural / scope-constant tests (no DB needed)
// ============================================================================

describe("scope constants", () => {
  test("1. exactly 4 July target ids, all distinct", () => {
    assert.equal(JULY_TARGET_IDS.length, 4);
    assert.equal(new Set(JULY_TARGET_IDS).size, 4);
  });

  test("2. exactly 3 protected items, matching the owner-approved wording-variant list", () => {
    assert.equal(PROTECTED_ITEMS.length, 3);
    assert.deepEqual(
      PROTECTED_ITEMS.map((p) => p.id).sort(),
      ["AUG-6D-06", "AUG-6D-07", "JUL-NEW-02"]
    );
    for (const p of PROTECTED_ITEMS) assert.ok(p.slug === JULY_PAGE_SLUG || p.slug === AUGUST_PAGE_SLUG);
  });

  test("3. EXPECTED_FINAL_* reflect exactly +4 items, 0 without id", () => {
    assert.equal(EXPECTED_FINAL_TOTAL, LOCAL_EXPECTED_TOTAL + 4);
    assert.equal(EXPECTED_FINAL_WITH_ID, EXPECTED_FINAL_TOTAL);
    assert.equal(EXPECTED_FINAL_WITHOUT_ID, 0);
  });

  test("4. fullFingerprint is id-sensitive (unlike the id-excluding fingerprint() it deliberately does not reuse)", () => {
    const a: CalendarItem = { id: "X-1", date: "2026-01-01", label_en: "same" };
    const b: CalendarItem = { id: "X-2", date: "2026-01-01", label_en: "same" };
    assert.notEqual(fullFingerprint(a), fullFingerprint(b));
    assert.equal(fullFingerprint(a), fullFingerprint({ ...a }));
  });

  test("5. fullPageFingerprint is stable across independent parses of equivalent dates_json formatting", () => {
    const rowA = { slug: "x", dates_json: JSON.stringify([{ id: "1", a: 1 }]), status: "draft" };
    const rowB = { slug: "x", dates_json: JSON.stringify([{ a: 1, id: "1" }], null, 2), status: "draft" };
    assert.equal(fullPageFingerprint(rowA), fullPageFingerprint(rowB));
  });

  test(
    "35. EXPECTED_LOCAL_LOGICAL_DIGEST is exactly cf0bfbbe...91bd27 and matches the audited pre-resync local backup's live-computed digest",
    { skip: !HAS_REAL_LOCAL && "requires the audited pre-resync local backup (backups/local/id-03b-uLqglt/guides.db)" },
    () => {
      assert.equal(EXPECTED_LOCAL_LOGICAL_DIGEST, "cf0bfbbe3eb23553ab21b85749b32a46a7007a22ef517785ddf085537a91bd27");
      assert.equal(EXPECTED_LOCAL_LOGICAL_DIGEST.length, 64);
      const db = new Database(REAL_PRE_RESYNC_LOCAL_BACKUP_PATH, { readonly: true, fileMustExist: true });
      try {
        assert.equal(tableLogicalDigest(db), EXPECTED_LOCAL_LOGICAL_DIGEST, "the constant must match the live-computed digest of the actual audited backup file, not just be internally self-consistent");
      } finally {
        db.close();
      }
    }
  );
});

// ============================================================================
// B. checkPreconditions() unit tests (real-fixture-based)
// ============================================================================

describe("checkPreconditions()", { skip: !HAS_BOTH_FIXTURES && SKIP_REASON }, () => {
  let localFixture: string;
  let prodFixture: string;

  before(() => {
    localFixture = path.join(tempDir("preconditions-local"), "guides.db");
    prodFixture = path.join(tempDir("preconditions-prod"), "guides.db");
    buildLocalFixture(localFixture);
    buildProductionFixture(prodFixture);
  });

  function openCopies(): { localDb: Database.Database; prodDb: Database.Database; localPath: string; prodPath: string } {
    const localPath = path.join(tempDir("preconditions-local-copy"), "guides.db");
    const prodPath = path.join(tempDir("preconditions-prod-copy"), "guides.db");
    fs.copyFileSync(localFixture, localPath);
    fs.copyFileSync(prodFixture, prodPath);
    return { localDb: new Database(localPath), prodDb: new Database(prodPath, { readonly: true }), localPath, prodPath };
  }

  test("6. happy path: ok=true, 4 ordered July targets, canonical August object, 3 protected fingerprints, draft page fingerprint captured", () => {
    const { localDb, prodDb } = openCopies();
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, true, result.errors.join("; "));
    assert.deepEqual(
      result.julyTargets.map((it) => it.id),
      [...JULY_TARGET_IDS]
    );
    assert.equal(result.augustCanonical?.id, AUGUST_TARGET_ID);
    assert.equal(Object.keys(result.protectedBefore).length, 3);
    assert.ok(result.complianceDraftBefore);
    assert.equal(result.localLogicalDigest.length, 64);
    assert.equal(result.productionLogicalDigest, EXPECTED_PRODUCTION_LOGICAL_DIGEST);
  });

  test("7. local total-count drift (extra item) fails the local baseline precondition", () => {
    const { localDb, prodDb } = openCopies();
    const row = localDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(JULY_PAGE_SLUG) as { dates_json: string };
    const items = JSON.parse(row.dates_json);
    items.push({ id: "EXTRA-DRIFT-ITEM", date: "2026-01-01", label_en: "extra" });
    localDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), JULY_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes(`Expected ${LOCAL_EXPECTED_TOTAL} local total items`)));
  });

  test("8. production snapshot logical digest mismatch against the audited value aborts", () => {
    const { localDb, prodDb } = openCopies();
    prodDb.close();
    const writableProd = new Database((prodDb as unknown as { name: string }).name ?? "");
    writableProd.close();
    // Re-open the prod copy read-write to mutate it, proving the audited-digest gate.
    const prodPathRw = path.join(tempDir("digest-mismatch"), "guides.db");
    fs.copyFileSync(prodFixture, prodPathRw);
    const prodRw = new Database(prodPathRw);
    const row = prodRw.prepare(`SELECT dates_json FROM calendar_pages WHERE slug = ?`).get(AUGUST_PAGE_SLUG) as { dates_json: string };
    const items = JSON.parse(row.dates_json);
    items[0].brief_en = "mutated content that changes the production digest";
    prodRw.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), AUGUST_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodRw);
    localDb.close();
    prodRw.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes("Production snapshot logical digest mismatch")));
  });

  test("9. a July target id already present locally aborts (refuses to add a duplicate)", () => {
    const { localDb, prodDb } = openCopies();
    const row = localDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(JULY_PAGE_SLUG) as { dates_json: string };
    const items = JSON.parse(row.dates_json);
    items.push({ id: "JUL-NEW-04", date: "2026-07-18", label_en: "already here" });
    localDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), JULY_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes('already contains target id "JUL-NEW-04"')));
  });

  test("10. a July target missing from the production snapshot aborts", () => {
    const { localDb, prodDb: prodDbRo } = openCopies();
    prodDbRo.close();
    const prodPathRw = path.join(tempDir("july-source-missing"), "guides.db");
    fs.copyFileSync(prodFixture, prodPathRw);
    const prodRw = new Database(prodPathRw);
    const row = prodRw.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(JULY_PAGE_SLUG) as { dates_json: string };
    const items = (JSON.parse(row.dates_json) as CalendarItem[]).filter((it) => it.id !== "JUL-NEW-04");
    prodRw.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), JULY_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodRw);
    localDb.close();
    prodRw.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes('Production snapshot missing source item "JUL-NEW-04"')));
  });

  test("11. AUG-NEW-02 missing locally aborts (update-only, refuses to insert a new item)", () => {
    const { localDb, prodDb } = openCopies();
    const row = localDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(AUGUST_PAGE_SLUG) as { dates_json: string };
    const items = (JSON.parse(row.dates_json) as CalendarItem[]).filter((it) => it.id !== AUGUST_TARGET_ID);
    localDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), AUGUST_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes(`missing existing item "${AUGUST_TARGET_ID}"`)));
  });

  test("12. AUG-NEW-02 missing from the production snapshot aborts", () => {
    const { localDb, prodDb: prodDbRo } = openCopies();
    prodDbRo.close();
    const prodPathRw = path.join(tempDir("aug-source-missing"), "guides.db");
    fs.copyFileSync(prodFixture, prodPathRw);
    const prodRw = new Database(prodPathRw);
    const row = prodRw.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(AUGUST_PAGE_SLUG) as { dates_json: string };
    const items = (JSON.parse(row.dates_json) as CalendarItem[]).filter((it) => it.id !== AUGUST_TARGET_ID);
    prodRw.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), AUGUST_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodRw);
    localDb.close();
    prodRw.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes(`Production snapshot missing source item "${AUGUST_TARGET_ID}"`)));
  });

  test("13. a protected item missing locally aborts (cannot prove preservation of an item that isn't there)", () => {
    const { localDb, prodDb } = openCopies();
    const row = localDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(JULY_PAGE_SLUG) as { dates_json: string };
    const items = (JSON.parse(row.dates_json) as CalendarItem[]).filter((it) => it.id !== "JUL-NEW-02");
    localDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), JULY_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes("Protected item missing locally: july-2026-dubai-calendar::JUL-NEW-02")));
  });

  test("14. the local-only compliance draft page missing aborts", () => {
    const { localDb, prodDb } = openCopies();
    localDb.prepare("DELETE FROM calendar_pages WHERE slug = ?").run(COMPLIANCE_DRAFT_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes(`Local-only draft page missing: ${COMPLIANCE_DRAFT_PAGE_SLUG}`)));
  });

  test("15. a proposed July id colliding with an existing local id (on an unrelated page) aborts", () => {
    const { localDb, prodDb } = openCopies();
    const row = localDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(COMPLIANCE_DRAFT_PAGE_SLUG) as { dates_json: string };
    const items = JSON.parse(row.dates_json) as CalendarItem[];
    items[0].id = "JUL-NEW-05";
    localDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), COMPLIANCE_DRAFT_PAGE_SLUG);
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes('Proposed id "JUL-NEW-05" collides with an existing local id')));
  });

  test("36. POST-ID-03 HOTFIX: a same-count adversarial local drift on an unrelated item (MAY-01-EIDFED.label_en, may-2026-uae-calendar) is rejected with LOCAL LOGICAL DIGEST MISMATCH -- UNAUTHORIZED LOCAL CORPUS, even though every count precondition (12/123/123/0) still passes", () => {
    const { localDb, prodDb } = openCopies();

    // Exact reproduction of the P1 finding from POST-ID-03 independent QA
    // (commit dfbfc10): mutate an unrelated item's content while preserving
    // page count, total item count, with-id count, and without-id count
    // exactly -- a drift that the pre-hotfix precondition set could not
    // detect at all.
    const row = localDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("may-2026-uae-calendar") as { dates_json: string };
    const items = JSON.parse(row.dates_json) as CalendarItem[];
    const idx = items.findIndex((it) => it.id === "MAY-01-EIDFED");
    assert.notEqual(idx, -1, "test fixture assumption: MAY-01-EIDFED must exist on may-2026-uae-calendar in the audited backup");
    (items[idx] as Record<string, unknown>).label_en = "ADVERSARIAL SAME-COUNT DRIFT";
    localDb.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "may-2026-uae-calendar");

    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();

    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some((e) => e.includes("LOCAL LOGICAL DIGEST MISMATCH") && e.includes("UNAUTHORIZED LOCAL CORPUS")),
      `expected a LOCAL LOGICAL DIGEST MISMATCH -- UNAUTHORIZED LOCAL CORPUS error, got: ${JSON.stringify(result.errors)}`
    );
    // Specifically prove the COUNT checks alone did NOT catch this -- the
    // whole point is that they cannot, by construction, since counts are
    // unchanged. Only the digest check catches it.
    assert.ok(
      !result.errors.some((e) => e.includes("local pages") || e.includes("local total items") || e.includes("local items with id") || e.includes("local items without id")),
      "the structural count preconditions must still all pass on this fixture -- the digest check is what catches this drift, not counts"
    );
  });

  test("37. POST-ID-03 HOTFIX: zero-update proof -- if a hypothetical caller bypassed checkPreconditions() entirely and called applyTransaction() directly on the same-count-drifted fixture, the in-transaction recheck against EXPECTED_LOCAL_LOGICAL_DIGEST still rejects it before any UPDATE runs", () => {
    const dbPath = path.join(tempDir("same-count-drift-apply"), "guides.db");
    fs.copyFileSync(localFixture, dbPath);

    const drifter = new Database(dbPath);
    const row = drifter.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("may-2026-uae-calendar") as { dates_json: string };
    const items = JSON.parse(row.dates_json) as CalendarItem[];
    const idx = items.findIndex((it) => it.id === "MAY-01-EIDFED");
    (items[idx] as Record<string, unknown>).label_en = "ADVERSARIAL SAME-COUNT DRIFT";
    drifter.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "may-2026-uae-calendar");
    drifter.close();

    // Fabricate plausible-looking arguments the way a caller who skipped
    // checkPreconditions() might (e.g. hand-derived from a stale in-memory
    // copy) -- the point is that applyTransaction() must not trust them; it
    // must independently recompute and compare the live digest itself.
    const prodPath = path.join(tempDir("same-count-drift-prod"), "guides.db");
    fs.copyFileSync(prodFixture, prodPath);
    const prodDbRo = new Database(prodPath, { readonly: true });
    const prodJuly = loadAllPages(prodDbRo).find((p) => p.slug === JULY_PAGE_SLUG)!.items;
    const julyTargets = JULY_TARGET_IDS.map((id) => prodJuly.find((it) => it.id === id)!);
    const augustCanonical = loadAllPages(prodDbRo).find((p) => p.slug === AUGUST_PAGE_SLUG)!.items.find((it) => it.id === AUGUST_TARGET_ID)!;
    prodDbRo.close();
    const protectedBefore: Record<string, string> = {};
    for (const p of PROTECTED_ITEMS) protectedBefore[`${p.slug}::${p.id}`] = "0".repeat(64); // stale/unknown -- irrelevant, digest gate must fire first
    const complianceDraftBefore = "0".repeat(64);

    const writeDb = new Database(dbPath);
    const changesBefore = (writeDb.prepare("SELECT total_changes() AS c").get() as { c: number }).c;
    assert.throws(
      () => applyTransaction(writeDb, julyTargets, augustCanonical, protectedBefore, complianceDraftBefore),
      /LOCAL LOGICAL DIGEST MISMATCH — UNAUTHORIZED LOCAL CORPUS \(IN-TRANSACTION\)/
    );
    const changesAfter = (writeDb.prepare("SELECT total_changes() AS c").get() as { c: number }).c;
    writeDb.close();

    assert.equal(changesAfter, changesBefore, "zero UPDATE statements (or any other write) may execute -- the digest check runs before the first SELECT/UPDATE in the transaction body");
    const finalDb = new Database(dbPath, { readonly: true });
    const finalItems = loadAllPages(finalDb).flatMap((p) => p.items);
    finalDb.close();
    assert.equal(finalItems.length, LOCAL_EXPECTED_TOTAL, "no July additions may have occurred");
    assert.ok(!finalItems.some((it) => it.id === "JUL-NEW-04"), "no July additions may have occurred");
  });
});

// ============================================================================
// C. applyTransaction() / independentPostCommitVerify() unit tests
// ============================================================================

describe("applyTransaction() / independentPostCommitVerify()", { skip: !HAS_BOTH_FIXTURES && SKIP_REASON }, () => {
  let localFixture: string;
  let prodFixture: string;

  before(() => {
    localFixture = path.join(tempDir("apply-local"), "guides.db");
    prodFixture = path.join(tempDir("apply-prod"), "guides.db");
    buildLocalFixture(localFixture);
    buildProductionFixture(prodFixture);
  });

  function freshLocalCopy(label: string): string {
    const p = path.join(tempDir(`apply-${label}`), "guides.db");
    fs.copyFileSync(localFixture, p);
    return p;
  }

  function preconditionsAgainstFreshProd(localPath: string) {
    const prodPath = path.join(tempDir("apply-prod-ro"), "guides.db");
    fs.copyFileSync(prodFixture, prodPath);
    const localDb = new Database(localPath, { readonly: true });
    const prodDb = new Database(prodPath, { readonly: true });
    const pre = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    if (!pre.ok) throw new Error(`Test setup: preconditions unexpectedly failed: ${pre.errors.join("; ")}`);
    return pre;
  }

  test("16. a successful apply adds exactly 4 July items in order at the tail and replaces AUG-NEW-02 with the exact production canonical object", () => {
    const dbPath = freshLocalCopy("success");
    const pre = preconditionsAgainstFreshProd(dbPath);

    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    writeDb.close();

    const julyItems = loadPageItems(dbPath, JULY_PAGE_SLUG)!;
    const tail = julyItems.slice(julyItems.length - 4);
    assert.deepEqual(
      tail.map((it) => it.id),
      [...JULY_TARGET_IDS]
    );
    for (let i = 0; i < 4; i++) assert.equal(JSON.stringify(canonicalize(tail[i])), JSON.stringify(canonicalize(pre.julyTargets[i])));

    const augItems = loadPageItems(dbPath, AUGUST_PAGE_SLUG)!;
    const augTarget = augItems.find((it) => it.id === AUGUST_TARGET_ID);
    assert.equal(JSON.stringify(canonicalize(augTarget)), JSON.stringify(canonicalize(pre.augustCanonical)));

    assert.deepEqual(countIds(dbPath), { total: EXPECTED_FINAL_TOTAL, withId: EXPECTED_FINAL_WITH_ID, withoutId: 0 });
  });

  test("17. a successful apply leaves the 3 protected items and the compliance draft page byte-for-byte unchanged", () => {
    const dbPath = freshLocalCopy("protected-unchanged");
    const pre = preconditionsAgainstFreshProd(dbPath);

    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    writeDb.close();

    const verifyDb = new Database(dbPath, { readonly: true });
    for (const p of PROTECTED_ITEMS) {
      const item = loadAllPages(verifyDb).find((pg) => pg.slug === p.slug)?.items.find((it) => it.id === p.id);
      assert.ok(item, `${p.slug}::${p.id} must still exist`);
      assert.equal(fullFingerprint(item!), pre.protectedBefore[`${p.slug}::${p.id}`], `${p.slug}::${p.id} must be byte-unchanged`);
    }
    const draftRow = loadFullPage(verifyDb, COMPLIANCE_DRAFT_PAGE_SLUG)!;
    assert.equal(fullPageFingerprint(draftRow), pre.complianceDraftBefore);
    verifyDb.close();
  });

  test("18. every non-target item on the July and August pages, and every other page, is unchanged (semantic diff: 4 additions + 1 update, 0 other changes)", () => {
    const dbPath = freshLocalCopy("semantic-diff");
    const beforeDb = new Database(dbPath, { readonly: true });
    const prePages = loadAllPages(beforeDb);
    const beforeCanonical = new Map(prePages.flatMap((p) => p.items.map((it) => [`${p.slug}::${it.id}`, JSON.stringify(canonicalize(it))])));
    beforeDb.close();

    const pre = preconditionsAgainstFreshProd(dbPath);
    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    writeDb.close();

    const afterDb = new Database(dbPath, { readonly: true });
    const postPages = loadAllPages(afterDb);
    afterDb.close();

    let additions = 0;
    let updates = 0;
    let otherChanges = 0;
    const julySet = new Set<string>(JULY_TARGET_IDS as readonly string[]);
    for (const page of postPages) {
      for (const it of page.items) {
        const key = `${page.slug}::${it.id}`;
        const before = beforeCanonical.get(key);
        const after = JSON.stringify(canonicalize(it));
        if (before === undefined) {
          if (page.slug === JULY_PAGE_SLUG && julySet.has(it.id as string)) additions += 1;
          else otherChanges += 1;
          continue;
        }
        if (before === after) continue;
        if (page.slug === AUGUST_PAGE_SLUG && it.id === AUGUST_TARGET_ID) updates += 1;
        else otherChanges += 1;
      }
    }
    assert.equal(additions, 4);
    assert.equal(updates, 1);
    assert.equal(otherChanges, 0);
  });

  test("19. a forced failure after both writes rolls back natively -- zero partial writes (file byte-for-byte unchanged)", () => {
    const dbPath = freshLocalCopy("forced-failure");
    const beforeSum = sha256File(dbPath);
    const before = countIds(dbPath);
    const pre = preconditionsAgainstFreshProd(dbPath);

    const writeDb = new Database(dbPath);
    assert.throws(
      () => applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!, { forceFailureAfterWrites: true }),
      /TEST-ONLY forced failure/
    );
    writeDb.close();

    assert.equal(sha256File(dbPath), beforeSum, "DB file must be byte-for-byte unchanged after a rolled-back transaction");
    assert.deepEqual(countIds(dbPath), before);
  });

  test("20. post-check TOCTOU regression: a second connection commits an unrelated same-count local drift after checkPreconditions() passes but before applyTransaction() begins -- the in-transaction recheck against the audited EXPECTED_LOCAL_LOGICAL_DIGEST constant (not a freshly-captured digest) rejects it before any UPDATE, with zero UPDATE statements executed", () => {
    const dbPath = freshLocalCopy("toctou");
    const pre = preconditionsAgainstFreshProd(dbPath); // early check passes against the audited baseline, pre-drift
    const before = countIds(dbPath);
    const beforeSum = sha256File(dbPath);

    // Second connection: an adversarial same-count content drift on an
    // unrelated item, committed AFTER checkPreconditions() already passed.
    const adversary = new Database(dbPath);
    const advRow = adversary.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(COMPLIANCE_DRAFT_PAGE_SLUG) as { dates_json: string };
    const advItems = JSON.parse(advRow.dates_json) as CalendarItem[];
    (advItems[0] as Record<string, unknown>).label_en = "ADVERSARIAL DRIFT";
    adversary.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(advItems), COMPLIANCE_DRAFT_PAGE_SLUG);
    adversary.close();

    assert.notEqual(sha256File(dbPath), beforeSum, "the adversarial write must have actually changed the file");

    const writeDb = new Database(dbPath);
    const changesBefore = (writeDb.prepare("SELECT total_changes() AS c").get() as { c: number }).c;
    assert.throws(
      () => applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!),
      /LOCAL LOGICAL DIGEST MISMATCH — UNAUTHORIZED LOCAL CORPUS \(IN-TRANSACTION\)/
    );
    const changesAfter = (writeDb.prepare("SELECT total_changes() AS c").get() as { c: number }).c;
    writeDb.close();

    assert.equal(changesAfter, changesBefore, "zero UPDATE statements (or any other write) may execute on this connection when the in-transaction digest check fails -- not just zero net effect after rollback");
    assert.deepEqual(countIds(dbPath), before, "no July/August mutation may occur when the in-transaction digest check fails");
    const finalRow = loadFullPage(new Database(dbPath, { readonly: true }), COMPLIANCE_DRAFT_PAGE_SLUG);
    assert.ok(JSON.stringify(finalRow).includes("ADVERSARIAL DRIFT"), "the concurrent writer's own committed change must remain (this script neither commits over it nor reverts it)");
  });

  test("21. a concurrent writer cannot commit a change between the digest recheck and the first UPDATE (BEGIN IMMEDIATE write reservation proof)", () => {
    const dbPath = freshLocalCopy("immediate-lock");
    const pre = preconditionsAgainstFreshProd(dbPath);

    let secondWriterError: Error | null = null;
    let hookRan = false;
    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!, {
      testOnlyHookAfterDigestCheck: () => {
        hookRan = true;
        const second = new Database(dbPath, { timeout: 100 });
        try {
          second.prepare("UPDATE calendar_pages SET dates_json = dates_json WHERE slug = ?").run(COMPLIANCE_DRAFT_PAGE_SLUG);
        } catch (err) {
          secondWriterError = err as Error;
        } finally {
          second.close();
        }
      },
    });
    writeDb.close();

    assert.ok(hookRan);
    assert.ok(secondWriterError, "a concurrent second connection's write must fail while the BEGIN IMMEDIATE reservation is held");
    assert.match((secondWriterError as unknown as Error).message, /database is locked|SQLITE_BUSY/i);
    assert.deepEqual(countIds(dbPath), { total: EXPECTED_FINAL_TOTAL, withId: EXPECTED_FINAL_WITH_ID, withoutId: 0 });
  });

  test("22. a stale/incorrect protectedBefore fingerprint passed in by the caller is caught by applyTransaction's own protected-item recheck, independently of the digest gate", () => {
    const dbPath = freshLocalCopy("protected-drift-defense-in-depth");
    const pre = preconditionsAgainstFreshProd(dbPath); // captures correct protectedBefore fingerprints from the pristine, digest-authorized state

    // Since applyTransaction() no longer accepts a caller-supplied "expected
    // digest" (the in-transaction gate is bound unconditionally to
    // EXPECTED_LOCAL_LOGICAL_DIGEST -- see test 20), it is no longer possible
    // to mutate a protected item on disk and still get past the digest gate:
    // any content change to calendar_pages changes the table digest, so that
    // class of bypass is now structurally impossible, which is the intended
    // effect of this hotfix. To still exercise the protected-item invariant
    // as an independent safety net (not merely inferred from the digest
    // gate), simulate a different, still-realistic caller-side bug: the DB
    // itself is untouched (digest still matches the audited baseline), but
    // the caller passes a stale/incorrect protectedBefore fingerprint for
    // one item (as could happen if a caller captured it from the wrong
    // source). applyTransaction must still catch the mismatch on its own.
    const staleProtectedBefore = { ...pre.protectedBefore, [`${JULY_PAGE_SLUG}::JUL-NEW-02`]: "0".repeat(64) };

    const writeDb = new Database(dbPath);
    assert.throws(
      () => applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, staleProtectedBefore, pre.complianceDraftBefore!),
      /protected item changed: july-2026-dubai-calendar::JUL-NEW-02/
    );
    writeDb.close();

    // Rolled back natively -- the July additions must NOT have committed either.
    assert.equal(countIds(dbPath).withoutId, 0);
    const julyItems = loadPageItems(dbPath, JULY_PAGE_SLUG)!;
    assert.ok(!julyItems.some((it) => it.id === "JUL-NEW-04"), "the transaction must roll back entirely, including the July additions, when the protected-item invariant fails");
  });

  test("23. independentPostCommitVerify confirms final state after a successful apply", () => {
    const dbPath = freshLocalCopy("post-commit-ok");
    const pre = preconditionsAgainstFreshProd(dbPath);
    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    writeDb.close();

    const post = independentPostCommitVerify(dbPath, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    assert.equal(post.ok, true, post.errors.join("; "));
    assert.equal(post.totalCount, EXPECTED_FINAL_TOTAL);
    assert.equal(post.withIdCount, EXPECTED_FINAL_WITH_ID);
    assert.equal(post.withoutIdCount, 0);
  });

  test("24. independentPostCommitVerify detects post-commit tampering with a protected item", () => {
    const dbPath = freshLocalCopy("post-commit-tampered");
    const pre = preconditionsAgainstFreshProd(dbPath);
    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    writeDb.close();

    const tamperer = new Database(dbPath);
    const row = tamperer.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(AUGUST_PAGE_SLUG) as { dates_json: string };
    const items = JSON.parse(row.dates_json) as CalendarItem[];
    const idx = items.findIndex((it) => it.id === "AUG-6D-06");
    (items[idx] as Record<string, unknown>).brief_en = "tampered after commit";
    tamperer.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), AUGUST_PAGE_SLUG);
    tamperer.close();

    const post = independentPostCommitVerify(dbPath, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    assert.equal(post.ok, false);
    assert.ok(post.errors.some((e) => e.includes("protected item changed: august-2026-dubai-calendar::AUG-6D-06")));
  });

  test("25. re-checking preconditions after a successful apply correctly refuses a re-run (conservative, no silent no-op)", () => {
    const dbPath = freshLocalCopy("rerun");
    const pre = preconditionsAgainstFreshProd(dbPath);
    const writeDb = new Database(dbPath);
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.protectedBefore, pre.complianceDraftBefore!);
    writeDb.close();

    const prodPath = path.join(tempDir("rerun-prod"), "guides.db");
    fs.copyFileSync(prodFixture, prodPath);
    const localDb = new Database(dbPath, { readonly: true });
    const prodDb = new Database(prodPath, { readonly: true });
    const result = checkPreconditions(localDb, prodDb);
    localDb.close();
    prodDb.close();
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes('already contains target id "JUL-NEW-04"')));
  });
});

// ============================================================================
// D. Full-CLI subprocess regressions
// ============================================================================

describe("full-CLI subprocess regressions", { skip: !HAS_BOTH_FIXTURES && SKIP_REASON }, () => {
  let localFixture: string;
  let prodFixture: string;

  before(() => {
    localFixture = path.join(tempDir("cli-local"), "guides.db");
    prodFixture = path.join(tempDir("cli-prod"), "guides.db");
    buildLocalFixture(localFixture);
    buildProductionFixture(prodFixture);
  });

  function freshCopies(label: string): { dir: string; localPath: string; prodPath: string } {
    const dir = tempDir(`cli-${label}`);
    const localPath = path.join(dir, "guides.db");
    const prodPath = path.join(dir, "prod-snapshot.db");
    fs.copyFileSync(localFixture, localPath);
    fs.copyFileSync(prodFixture, prodPath);
    return { dir, localPath, prodPath };
  }

  test("26. dry run: exits 0, reports 4 WOULD ADD lines + 1 WOULD UPDATE line, and performs zero writes", () => {
    const { localPath, prodPath } = freshCopies("dry-run");
    const beforeSum = sha256File(localPath);
    const result = runScript(["--local-db", localPath, "--production-snapshot", prodPath]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /Dry run complete -- zero writes performed/);
    const wouldAddCount = (result.stdout.match(/^\s+\+ JUL-NEW-0[4567]/gm) ?? []).length;
    assert.equal(wouldAddCount, 4);
    assert.match(result.stdout, /~ AUG-NEW-02/);
    assert.equal(sha256File(localPath), beforeSum, "dry run must not write anything");
  });

  test("27. missing --local-db aborts with usage", () => {
    const { prodPath } = freshCopies("missing-local-db");
    const result = runScript(["--production-snapshot", prodPath]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /Missing required --local-db/);
  });

  test("28. missing --production-snapshot aborts with usage", () => {
    const { localPath } = freshCopies("missing-prod-snapshot");
    const result = runScript(["--local-db", localPath]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /Missing required --production-snapshot/);
  });

  test("29. apply without --backup-dir aborts before any write", () => {
    const { localPath, prodPath } = freshCopies("no-backup-dir");
    const beforeSum = sha256File(localPath);
    const result = runScript(["--local-db", localPath, "--production-snapshot", prodPath, "--apply"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /Missing required --backup-dir/);
    assert.equal(sha256File(localPath), beforeSum);
  });

  test("30. production-path guard rejects a --local-db that resolves under a protected root, before checking file existence", () => {
    const { prodPath } = freshCopies("production-path-guard");
    const result = runScript(["--local-db", "/var/www/guidex-post-id03-test-fixture/guides.db", "--production-snapshot", prodPath]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /Production path detected/);
    assert.match(result.stderr + result.stdout, /LOCAL ONLY/);
  });

  test("31. an unwritable/invalid --backup-dir aborts before any transaction (zero DB writes)", () => {
    const { dir, localPath, prodPath } = freshCopies("invalid-backup-dir");
    const beforeSum = sha256File(localPath);
    const blockedPath = path.join(dir, "backup-dir-is-a-file");
    fs.writeFileSync(blockedPath, "not a directory");
    const result = runScript(["--local-db", localPath, "--production-snapshot", prodPath, "--apply", "--backup-dir", blockedPath]);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Backup directory reservation failed/);
    assert.equal(sha256File(localPath), beforeSum);
  });

  test("32. a successful full apply yields 127/127/0, a verified backup, exactly 4 additions + 1 update, and protected items unchanged", () => {
    const { dir, localPath, prodPath } = freshCopies("full-apply");
    const backupDir = path.join(dir, "backups");

    const protectedBeforeIds = new Map<string, string>();
    for (const p of PROTECTED_ITEMS) {
      const items = loadPageItems(localPath, p.slug)!;
      const item = items.find((it) => it.id === p.id)!;
      protectedBeforeIds.set(`${p.slug}::${p.id}`, fullFingerprint(item));
    }

    const result = runScript(["--local-db", localPath, "--production-snapshot", prodPath, "--apply", "--backup-dir", backupDir]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /Resync complete/);

    assert.deepEqual(countIds(localPath), { total: EXPECTED_FINAL_TOTAL, withId: EXPECTED_FINAL_WITH_ID, withoutId: 0 });

    const julyTail = loadPageItems(localPath, JULY_PAGE_SLUG)!.slice(-4);
    assert.deepEqual(
      julyTail.map((it) => it.id),
      [...JULY_TARGET_IDS]
    );

    const augItem = loadPageItems(localPath, AUGUST_PAGE_SLUG)!.find((it) => it.id === AUGUST_TARGET_ID);
    assert.equal(augItem?.confidence, "confirmed");
    assert.equal(augItem?.source_status, "confirmed");

    for (const p of PROTECTED_ITEMS) {
      const items = loadPageItems(localPath, p.slug)!;
      const item = items.find((it) => it.id === p.id)!;
      assert.equal(fullFingerprint(item), protectedBeforeIds.get(`${p.slug}::${p.id}`), `${p.slug}::${p.id} must be unchanged after apply`);
    }

    const childDirs = fs.readdirSync(backupDir).filter((f) => fs.statSync(path.join(backupDir, f)).isDirectory());
    assert.equal(childDirs.length, 1);
    const backupPath = path.join(backupDir, childDirs[0], "guides.db");
    assert.ok(fs.existsSync(backupPath));
    const backupDb = new Database(backupPath, { readonly: true, fileMustExist: true });
    const backupCounts = { total: 0, withId: 0 };
    const backupItems = loadAllPages(backupDb).flatMap((p) => p.items);
    backupCounts.total = backupItems.length;
    backupCounts.withId = backupItems.filter((it) => it.id).length;
    backupDb.close();
    assert.equal(backupCounts.total, LOCAL_EXPECTED_TOTAL, "backup must reflect the PRE-write local state, not the post-write state");
  });

  test("33. re-running --apply against an already-resynced disposable DB aborts on the July-target-already-present precondition (idempotency)", () => {
    const { dir, localPath, prodPath } = freshCopies("rerun-cli");
    const backupDir = path.join(dir, "backups");
    const first = runScript(["--local-db", localPath, "--production-snapshot", prodPath, "--apply", "--backup-dir", backupDir]);
    assert.equal(first.status, 0, first.stdout + first.stderr);

    const beforeSum = sha256File(localPath);
    const second = runScript(["--local-db", localPath, "--production-snapshot", prodPath, "--apply", "--backup-dir", path.join(dir, "backups2")]);
    assert.notEqual(second.status, 0);
    assert.match(second.stdout + second.stderr, /already contains target id "JUL-NEW-04"/);
    assert.equal(sha256File(localPath), beforeSum, "a rejected re-run must not touch the DB");
  });

  test("34. a dry run against the real local data/guides.db is safe (read-only) regardless of pass/fail outcome", () => {
    const { prodPath } = freshCopies("real-local-safety");
    const beforeSum = sha256File(REAL_LOCAL_DB_PATH);
    const result = runScript(["--local-db", REAL_LOCAL_DB_PATH, "--production-snapshot", prodPath]);
    assert.equal(sha256File(REAL_LOCAL_DB_PATH), beforeSum, "the real local DB must never be written to by a dry run");
    assert.ok(result.status === 0 || /precondition failure/.test(result.stdout + result.stderr));
  });
});

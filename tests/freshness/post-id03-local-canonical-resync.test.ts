// POST-ID-03 regression suite for
// scripts/post-id03-local-canonical-resync.ts and its extracted logic module
// scripts/lib/post-id03-local-canonical-resync-core.ts.
//
// Every mutable DB used here is a disposable temp copy. The "local" fixture
// is built by cloning the real local data/guides.db (already in its
// pre-resync 12/123/123/0 shape); the "production" fixture is built by
// cloning the audited WAL-safe production snapshot captured for this
// operation (11/118/118/0, logical digest matching
// EXPECTED_PRODUCTION_LOGICAL_DIGEST). Both real files are opened read-only
// to clone; neither is ever written to. The audit snapshot is a local,
// untracked artifact (never committed -- see project rules on DB/backup
// files) so every describe() block that needs it is skipped when it is
// absent, exactly like this repo's existing HAS_REAL_DB-gated suites.

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
  LOCAL_EXPECTED_TOTAL,
  LOCAL_EXPECTED_WITH_ID,
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
const REAL_LOCAL_DB_PATH = path.join(REPO_ROOT, "data", "guides.db");
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

function localDbHasExpectedShape(): boolean {
  if (!fs.existsSync(REAL_LOCAL_DB_PATH)) return false;
  const db = new Database(REAL_LOCAL_DB_PATH, { readonly: true, fileMustExist: true });
  try {
    const pre = checkPreconditionsLocalOnly(db);
    return pre.total === LOCAL_EXPECTED_TOTAL && pre.withId === LOCAL_EXPECTED_WITH_ID;
  } finally {
    db.close();
  }
}
function checkPreconditionsLocalOnly(db: Database.Database): { total: number; withId: number } {
  const items = loadAllPages(db).flatMap((p) => p.items);
  return { total: items.length, withId: items.filter((it) => it.id).length };
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

const HAS_REAL_LOCAL = localDbHasExpectedShape();
const HAS_REAL_SNAPSHOT = productionSnapshotHasExpectedShape();
const HAS_BOTH_FIXTURES = HAS_REAL_LOCAL && HAS_REAL_SNAPSHOT;
const SKIP_REASON = "requires both data/guides.db (pre-resync 12/123/123/0 shape) and the audited PRE-FRESH-01-ID-03B production snapshot -- a local, untracked audit artifact not guaranteed present in every environment";

function buildLocalFixture(destPath: string): void {
  fs.copyFileSync(REAL_LOCAL_DB_PATH, destPath);
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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
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
      () => applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!, { forceFailureAfterWrites: true }),
      /TEST-ONLY forced failure/
    );
    writeDb.close();

    assert.equal(sha256File(dbPath), beforeSum, "DB file must be byte-for-byte unchanged after a rolled-back transaction");
    assert.deepEqual(countIds(dbPath), before);
  });

  test("20. TOCTOU regression: a concurrent local mutation captured after the pre-backup digest is rejected before any UPDATE", () => {
    const dbPath = freshLocalCopy("toctou");
    const pre = preconditionsAgainstFreshProd(dbPath); // captures the "approved" digest pre-drift
    const before = countIds(dbPath);
    const beforeSum = sha256File(dbPath);

    const adversary = new Database(dbPath);
    const advRow = adversary.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(COMPLIANCE_DRAFT_PAGE_SLUG) as { dates_json: string };
    const advItems = JSON.parse(advRow.dates_json) as CalendarItem[];
    (advItems[0] as Record<string, unknown>).label_en = "ADVERSARIAL DRIFT";
    adversary.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(advItems), COMPLIANCE_DRAFT_PAGE_SLUG);
    adversary.close();

    assert.notEqual(sha256File(dbPath), beforeSum, "the adversarial write must have actually changed the file");

    const writeDb = new Database(dbPath);
    assert.throws(
      () => applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!),
      /LOCAL LOGICAL DIGEST MISMATCH INSIDE WRITE TRANSACTION/
    );
    writeDb.close();

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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!, {
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

  test("22. a protected item mutated between precondition capture and the write transaction is caught by the in-transaction safety net, not just by checkPreconditions", () => {
    const dbPath = freshLocalCopy("protected-drift-defense-in-depth");
    const pre = preconditionsAgainstFreshProd(dbPath); // captures protectedBefore fingerprints from the pristine state

    // Simulate a hypothetical caller bug: the DB is mutated on a protected
    // item AFTER precondition capture but the (now-stale) pre.protectedBefore
    // and pre.localLogicalDigest are still passed through unchanged is not
    // representative (that would trip the digest gate first, as covered by
    // test 20). Instead, prove applyTransaction's OWN protected-item
    // recheck independently by mutating the item content but keeping the
    // recorded logical digest consistent with the new state (i.e. simulate
    // the digest gate already having been (mis-)satisfied) -- this isolates
    // the protected-item invariant as its own independent safety net.
    const mutator = new Database(dbPath);
    const row = mutator.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get(JULY_PAGE_SLUG) as { dates_json: string };
    const items = JSON.parse(row.dates_json) as CalendarItem[];
    const idx = items.findIndex((it) => it.id === "JUL-NEW-02");
    (items[idx] as Record<string, unknown>).brief_en = "mutated protected wording, should never be allowed to commit";
    mutator.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), JULY_PAGE_SLUG);
    const driftedDigest = tableLogicalDigest(mutator);
    mutator.close();

    const writeDb = new Database(dbPath);
    assert.throws(
      () => applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, driftedDigest, pre.protectedBefore, pre.complianceDraftBefore!),
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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
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
    applyTransaction(writeDb, pre.julyTargets, pre.augustCanonical!, pre.localLogicalDigest, pre.protectedBefore, pre.complianceDraftBefore!);
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

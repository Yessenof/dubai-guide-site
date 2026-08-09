// PRE-FRESH-01-ID-03B-01 regression suite for
// scripts/backfill-calendar-item-ids-production.ts and its extracted logic
// module scripts/lib/calendar-backfill-production-core.ts.
//
// Every mutable DB used here is a disposable, programmatically-built
// fixture -- never the full frozen production snapshot, and never the real
// local data/guides.db. The fixture reproduces the exact production shape
// (11 pages / 118 items / 106 with id / 12 without, confined to exactly 4
// named pages) by cloning the real local data/guides.db (already
// ID-02-backfilled) for content on the 4 pages the production script
// actually targets -- their content is identical between local and
// production, independently verified during the PRE-FRESH-01-ID-03A2
// reconciliation audit -- stripping the 12 known ids back off, and padding
// the remaining 7 pages with deterministic dummy content bearing unique
// dummy ids. The real DB is opened read-only and is never written to.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import {
  PRODUCTION_TARGETS,
  PRODUCTION_ID_LESS_EXPECTATIONS,
  REQUIRED_CONFIRM_TOKEN,
  EXPECTED_TOTAL,
  EXPECTED_WITH_ID,
  EXPECTED_WITHOUT_ID,
  canonicalize,
  loadAllPages,
  checkPreconditions,
  tableLogicalDigest,
  schemaFingerprint,
  reserveBackupDirectory,
  assertBackupDestinationAbsent,
  createOnlineBackup,
  verifyBackup,
  applyTransaction,
  independentPostCommitVerify,
} from "../../scripts/lib/calendar-backfill-production-core";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const REAL_DB_PATH = path.join(REPO_ROOT, "data", "guides.db");
const SCRIPT_PATH = path.join("scripts", "backfill-calendar-item-ids-production.ts");

const TARGET_SLUGS = [...new Set(PRODUCTION_TARGETS.map((t) => t.slug))];
const KNOWN_TARGET_COORDS = PRODUCTION_TARGETS.map((t) => ({ slug: t.slug, idx: t.idx }));

// 7 dummy pages summing to 106 items -- the exact with-id count production
// has outside the 4 approved pages. Distribution doesn't matter to the
// script (it only checks totals and the 4 named pages); these numbers just
// need to sum to 106.
const DUMMY_PAGE_ITEM_COUNTS = [15, 15, 15, 15, 15, 15, 16];

const createdDirs: string[] = [];
function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `guidex-backfill-production-test-${prefix}-`));
  createdDirs.push(dir);
  return dir;
}
after(() => {
  for (const dir of createdDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function realDbHasExpectedShape(): boolean {
  if (!fs.existsSync(REAL_DB_PATH)) return false;
  const db = new Database(REAL_DB_PATH, { readonly: true, fileMustExist: true });
  try {
    const pageIndex = new Map(loadAllPages(db).map((p) => [p.slug, p.items]));
    for (const t of PRODUCTION_TARGETS) {
      const item = pageIndex.get(t.slug)?.[t.idx];
      if (!item || typeof item.id !== "string" || !item.id) return false;
    }
    return true;
  } finally {
    db.close();
  }
}

/**
 * Builds a disposable fixture DB with the exact production shape: the 4
 * real target pages (content cloned from the real local DB, the 12 known
 * ids stripped back off) plus 7 deterministic dummy pages (106 items, all
 * already carrying unique dummy ids) -- 11 pages / 118 items / 106 with id
 * / 12 without, confined to exactly the 4 approved pages.
 */
function buildProductionFixture(destPath: string): void {
  fs.copyFileSync(REAL_DB_PATH, destPath);
  const db = new Database(destPath);

  const placeholders = TARGET_SLUGS.map(() => "?").join(",");
  db.prepare(`DELETE FROM calendar_pages WHERE slug NOT IN (${placeholders})`).run(...TARGET_SLUGS);

  const remaining = db.prepare("SELECT slug FROM calendar_pages").all() as { slug: string }[];
  if (remaining.length !== TARGET_SLUGS.length) {
    db.close();
    throw new Error(`Fixture build: expected exactly ${TARGET_SLUGS.length} target pages to remain, found ${remaining.length}.`);
  }

  const bySlug = new Map<string, number[]>();
  for (const c of KNOWN_TARGET_COORDS) {
    if (!bySlug.has(c.slug)) bySlug.set(c.slug, []);
    bySlug.get(c.slug)!.push(c.idx);
  }
  const selectStmt = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?");
  const updateStmt = db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?");
  for (const [slug, idxs] of bySlug) {
    const row = selectStmt.get(slug) as { dates_json: string } | undefined;
    if (!row) { db.close(); throw new Error(`Fixture build: target page not found in real DB: ${slug}`); }
    const items = JSON.parse(row.dates_json) as Record<string, unknown>[];
    for (const idx of idxs) delete items[idx].id;
    updateStmt.run(JSON.stringify(items), slug);
  }

  const insertStmt = db.prepare("INSERT INTO calendar_pages (id, slug, dates_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
  const now = new Date().toISOString();
  DUMMY_PAGE_ITEM_COUNTS.forEach((count, pageIdx) => {
    const slug = `dummy-fixture-page-${pageIdx}`;
    const items = Array.from({ length: count }, (_, i) => ({
      id: `DUMMY-${pageIdx}-${i}`,
      date: "2026-01-01",
      label_en: `Dummy fixture item ${pageIdx}-${i}`,
    }));
    insertStmt.run(`dummy-page-id-${pageIdx}`, slug, JSON.stringify(items), now, now);
  });

  db.close();
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

/** tableLogicalDigest() through a fresh readonly connection -- the same value the CLI would compute and print as CALENDAR_LOGICAL_DIGEST. */
function calendarDigestOf(dbPath: string): string {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    return tableLogicalDigest(db);
  } finally {
    db.close();
  }
}

async function makeTrivialDb(p: string): Promise<void> {
  const db = new Database(p);
  db.exec("CREATE TABLE t (x INTEGER)");
  db.prepare("INSERT INTO t (x) VALUES (1)").run();
  db.close();
}

function runScript(args: string[]): { status: number; stdout: string; stderr: string } {
  const result = spawnSync("npx", ["tsx", SCRIPT_PATH, ...args], { cwd: REPO_ROOT, encoding: "utf8" });
  return { status: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

const HAS_REAL_DB = realDbHasExpectedShape();

// ============================================================================
// A. Structural target-list tests (no DB needed)
// ============================================================================

describe("PRODUCTION_TARGETS structural guarantees", () => {
  test("1. exactly 12 targets", () => {
    assert.equal(PRODUCTION_TARGETS.length, 12);
  });

  test("2. zero COMPLY-* ids -- structurally impossible for this list to contain one", () => {
    for (const t of PRODUCTION_TARGETS) assert.ok(!t.id.startsWith("COMPLY-"), `${t.id} must not start with COMPLY-`);
  });

  test("3. targets are confined to exactly the 4 approved slugs, with counts matching PRODUCTION_ID_LESS_EXPECTATIONS", () => {
    const counts = new Map<string, number>();
    for (const t of PRODUCTION_TARGETS) counts.set(t.slug, (counts.get(t.slug) ?? 0) + 1);
    assert.deepEqual([...counts.keys()].sort(), Object.keys(PRODUCTION_ID_LESS_EXPECTATIONS).sort());
    for (const [slug, expected] of Object.entries(PRODUCTION_ID_LESS_EXPECTATIONS)) {
      assert.equal(counts.get(slug), expected, `slug ${slug}`);
    }
  });

  test("4. proposed ids are unique among themselves (exact and case-insensitive)", () => {
    const ids = PRODUCTION_TARGETS.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(ids.map((v) => v.toLowerCase())).size, ids.length);
  });
});

// ============================================================================
// B. checkPreconditions() unit tests (disposable fixture, direct function calls)
// ============================================================================

describe(
  "checkPreconditions()",
  { skip: !HAS_REAL_DB && "data/guides.db not in the expected post-ID-02 shape (all 4 production target pages must already carry ids to strip)" },
  () => {
    let fixtureDb: string;

    before(() => {
      fixtureDb = path.join(tempDir("preconditions"), "guides.db");
      buildProductionFixture(fixtureDb);
    });

    function openFixtureCopy(): { db: Database.Database; path: string } {
      const dir = tempDir("preconditions-copy");
      const copyPath = path.join(dir, "guides.db");
      fs.copyFileSync(fixtureDb, copyPath);
      return { db: new Database(copyPath), path: copyPath };
    }

    test("5. happy-path fixture passes with exact 118/106/12 and the 4 approved pages", () => {
      const { db } = openFixtureCopy();
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, true, result.errors.join("; "));
      assert.equal(result.totalCount, EXPECTED_TOTAL);
      assert.equal(result.withIdCount, EXPECTED_WITH_ID);
      assert.equal(result.withoutIdCount, EXPECTED_WITHOUT_ID);
      assert.deepEqual(result.idLessBySlug, PRODUCTION_ID_LESS_EXPECTATIONS);
    });

    test("6. total-count mismatch (extra item) fails the count precondition", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items.push({ id: "DUMMY-EXTRA", date: "2026-01-01", label_en: "extra" });
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes(`Expected ${EXPECTED_TOTAL} total items`)));
    });

    test("7. a 13th id-less item on an unapproved page aborts (no adaptation)", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      delete items[0].id;
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("unapproved page")));
    });

    test("8. a missing target page aborts with both a coverage error and a target-not-found error", () => {
      const { db } = openFixtureCopy();
      db.prepare("DELETE FROM calendar_pages WHERE slug = ?").run("may-2026-uae-calendar");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("Target page not found: may-2026-uae-calendar")));
      assert.ok(result.errors.some((e) => e.includes('Expected page "may-2026-uae-calendar"')));
    });

    test("9. a target that already has an id aborts (refuses to overwrite)", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("uae-emiratisation-june-30-2026-reminder") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[0].id = "SOMETHING-ALREADY-HERE";
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "uae-emiratisation-june-30-2026-reminder");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("already has an id")));
    });

    test("10. a fingerprint mismatch (content drift) on a target item aborts", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("uae-e-invoicing-2026-asp-deadline") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[0].label_en = "mutated content that changes the fingerprint";
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "uae-e-invoicing-2026-asp-deadline");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("Fingerprint mismatch")));
    });

    test("11. a proposed id exactly colliding with an existing id aborts", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[0].id = "MAY-01-EIDFED";
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes('Proposed id "MAY-01-EIDFED" collides with an existing id')));
    });

    test("12. a proposed id case-insensitively colliding with an existing id aborts", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[0].id = "may-01-eidfed";
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("collides case-insensitively")));
    });

    test("13. a pre-existing exact duplicate id in the existing corpus aborts", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[1].id = items[0].id; // duplicate an existing dummy id
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("Pre-existing exact duplicate id")));
    });

    test("14. a pre-existing case-insensitive duplicate id in the existing corpus aborts", () => {
      const { db } = openFixtureCopy();
      const row = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[1].id = (items[0].id as string).toLowerCase();
      db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const result = checkPreconditions(db);
      db.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("Pre-existing case-insensitive duplicate id")));
    });
  }
);

// ============================================================================
// C. Logical digest + WAL-safe backup verification unit tests
// ============================================================================

describe(
  "tableLogicalDigest / schemaFingerprint / online backup / verifyBackup",
  { skip: !HAS_REAL_DB && "data/guides.db not in the expected post-ID-02 shape" },
  () => {
    let fixtureDb: string;
    before(() => {
      fixtureDb = path.join(tempDir("digest"), "guides.db");
      buildProductionFixture(fixtureDb);
    });

    test("15. tableLogicalDigest is deterministic and content-sensitive", () => {
      const db1 = new Database(fixtureDb, { readonly: true });
      const digestA = tableLogicalDigest(db1);
      const digestB = tableLogicalDigest(db1);
      db1.close();
      assert.equal(digestA, digestB);

      const mutated = path.join(tempDir("digest-mutated"), "guides.db");
      fs.copyFileSync(fixtureDb, mutated);
      const dbM = new Database(mutated);
      const row = dbM.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[0].label_en = "changed";
      dbM.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      const digestC = tableLogicalDigest(dbM);
      dbM.close();
      assert.notEqual(digestA, digestC);
    });

    test("16. schemaFingerprint is stable across independent connections to the same schema", () => {
      const db1 = new Database(fixtureDb, { readonly: true });
      const db2 = new Database(fixtureDb, { readonly: true });
      const fp1 = schemaFingerprint(db1);
      const fp2 = schemaFingerprint(db2);
      db1.close();
      db2.close();
      assert.equal(fp1, fp2);
      assert.match(fp1, /^[0-9a-f]{64}$/);
    });

    test("17. reserveBackupDirectory + assertBackupDestinationAbsent: fresh directory, no destination collision", () => {
      const dir = tempDir("reserve-unique");
      const first = reserveBackupDirectory(dir);
      const firstBackupPath = path.join(first, "guides.db");
      assert.doesNotThrow(() => assertBackupDestinationAbsent(firstBackupPath));
      fs.writeFileSync(firstBackupPath, "taken");

      const second = reserveBackupDirectory(dir);
      assert.notEqual(first, second);
      const secondBackupPath = path.join(second, "guides.db");
      assert.doesNotThrow(() => assertBackupDestinationAbsent(secondBackupPath));
      assert.ok(!fs.existsSync(secondBackupPath));
    });

    test("18. WAL-mode committed-state backup: online backup captures data committed via a separate connection without a checkpoint", async () => {
      const dir = tempDir("wal-backup");
      const dbPath = path.join(dir, "guides.db");
      fs.copyFileSync(fixtureDb, dbPath);

      const writer = new Database(dbPath);
      writer.pragma("journal_mode = WAL");
      const row = writer.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      const items = JSON.parse(row.dates_json);
      items[0].label_en = "WAL-committed-not-checkpointed";
      writer.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");
      // Committed (better-sqlite3 auto-commits outside an explicit transaction),
      // but deliberately not checkpointed -- the update lives in the -wal file.
      assert.ok(fs.existsSync(`${dbPath}-wal`) || writer.pragma("journal_mode", { simple: true }) === "wal");

      const reader = new Database(dbPath, { readonly: true, fileMustExist: true });
      const preDigest = tableLogicalDigest(reader);
      const preSchemaFp = schemaFingerprint(reader);

      const backupChildDir = reserveBackupDirectory(path.join(dir, "backups"));
      const backupPath = path.join(backupChildDir, "guides.db");
      assertBackupDestinationAbsent(backupPath);
      await createOnlineBackup(reader, backupPath);
      reader.close();
      writer.close();

      const verification = verifyBackup(backupPath, preDigest, preSchemaFp);
      assert.equal(verification.ok, true, verification.errors.join("; "));
      assert.equal(verification.integrityCheck, "ok");

      const backupDb = new Database(backupPath, { readonly: true, fileMustExist: true });
      const backupRow = backupDb.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
      backupDb.close();
      assert.ok(JSON.parse(backupRow.dates_json)[0].label_en === "WAL-committed-not-checkpointed", "backup must contain the WAL-committed update");
    });

    test("19. verifyBackup fails clearly when the backup file was never created", () => {
      const result = verifyBackup(path.join(tempDir("no-backup"), "does-not-exist.db"), "irrelevant", "irrelevant");
      assert.equal(result.ok, false);
      assert.ok(result.errors[0].includes("does not exist"));
    });

    test("20. verifyBackup fails clearly on an empty backup file", () => {
      const p = path.join(tempDir("empty-backup"), "empty.db");
      fs.writeFileSync(p, "");
      const result = verifyBackup(p, "irrelevant", "irrelevant");
      assert.equal(result.ok, false);
      assert.ok(result.errors[0].includes("empty"));
    });

    test("21. verifyBackup fails on a logical digest mismatch even when the backup is a structurally valid DB", () => {
      const dir = tempDir("digest-mismatch-backup");
      const backupPath = path.join(dir, "backup.db");
      fs.copyFileSync(fixtureDb, backupPath);
      const db = new Database(backupPath, { readonly: true });
      const actualSchemaFp = schemaFingerprint(db);
      db.close();
      const result = verifyBackup(backupPath, "0".repeat(64), actualSchemaFp);
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes("logical digest")));
    });

    test("22. verifyBackup reports failure instead of throwing when the backup file is corrupted/unopenable", () => {
      const p = path.join(tempDir("corrupt-backup"), "corrupt.db");
      fs.writeFileSync(p, "SQLite format 3\0this is not actually a valid database body at all, just garbage bytes to force a parse failure");
      const result = verifyBackup(p, "irrelevant", "irrelevant");
      assert.equal(result.ok, false);
      assert.ok(result.errors.length > 0);
    });
  }
);

// ============================================================================
// C2. Backup directory exclusivity (P1-B hardening: reserveBackupDirectory /
//     assertBackupDestinationAbsent, replacing the removed pickUniqueBackupPath)
// ============================================================================

describe("backup directory exclusivity (P1-B hardening)", () => {
  test("A. rapid-succession reservations under the same parent yield distinct, real directories", () => {
    const parent = tempDir("excl-a");
    const d1 = reserveBackupDirectory(parent);
    const d2 = reserveBackupDirectory(parent);
    const d3 = reserveBackupDirectory(parent);
    assert.notEqual(d1, d2);
    assert.notEqual(d2, d3);
    assert.notEqual(d1, d3);
    for (const d of [d1, d2, d3]) assert.ok(fs.statSync(d).isDirectory());
  });

  test("B. no collision across many reservations in immediate succession -- not a probabilistic guarantee (mkdtempSync is OS-atomic, not timestamp/random-byte luck)", () => {
    const parent = tempDir("excl-b");
    const dirs = new Set<string>();
    for (let i = 0; i < 50; i++) dirs.add(reserveBackupDirectory(parent));
    assert.equal(dirs.size, 50);
  });

  test("C. a pre-existing unrelated backup child directory is left untouched by a new reservation", () => {
    const parent = tempDir("excl-c");
    const unrelated = fs.mkdtempSync(path.join(parent, "id-03b-"));
    const unrelatedBackupPath = path.join(unrelated, "guides.db");
    fs.writeFileSync(unrelatedBackupPath, "pre-existing backup content");

    const fresh = reserveBackupDirectory(parent);
    assert.notEqual(fresh, unrelated);

    assert.equal(fs.readFileSync(unrelatedBackupPath, "utf8"), "pre-existing backup content", "a pre-existing backup child directory must never be touched by a later reservation");
  });

  test("D. two sequential online backups into two separately-reserved directories leave the first backup byte-for-byte unchanged after the second is created", async () => {
    const parent = tempDir("excl-d");
    const srcPath = path.join(tempDir("excl-d-src"), "src.db");
    await makeTrivialDb(srcPath);
    const src = new Database(srcPath, { readonly: true, fileMustExist: true });

    const dir1 = reserveBackupDirectory(parent);
    const backup1 = path.join(dir1, "guides.db");
    assertBackupDestinationAbsent(backup1);
    await createOnlineBackup(src, backup1);
    const backup1ContentBefore = fs.readFileSync(backup1);

    const dir2 = reserveBackupDirectory(parent);
    const backup2 = path.join(dir2, "guides.db");
    assertBackupDestinationAbsent(backup2);
    await createOnlineBackup(src, backup2);

    src.close();

    assert.deepEqual(fs.readFileSync(backup1), backup1ContentBefore, "the first backup must be unchanged after a second backup is created");
    assert.notEqual(dir1, dir2);
  });

  test("E. assertBackupDestinationAbsent throws (refuses to overwrite) when the destination unexpectedly already exists inside an owned directory", () => {
    const parent = tempDir("excl-e");
    const dir = reserveBackupDirectory(parent);
    const backupPath = path.join(dir, "guides.db");
    fs.writeFileSync(backupPath, "something already here");
    assert.throws(() => assertBackupDestinationAbsent(backupPath), /already exists/);
    assert.equal(fs.readFileSync(backupPath, "utf8"), "something already here", "must not overwrite");
  });

  test("F. concurrent reservations under the same parent all succeed with distinct paths (practical proxy: mkdtempSync's exclusivity is an OS-level guarantee independent of process count, exercised here via interleaved async scheduling)", async () => {
    const parent = tempDir("excl-f");
    const results = await Promise.all(Array.from({ length: 20 }, () => Promise.resolve().then(() => reserveBackupDirectory(parent))));
    assert.equal(new Set(results).size, 20);
  });
});

// ============================================================================
// D. applyTransaction() unit tests
// ============================================================================

describe(
  "applyTransaction()",
  { skip: !HAS_REAL_DB && "data/guides.db not in the expected post-ID-02 shape" },
  () => {
    let fixtureDb: string;
    before(() => {
      fixtureDb = path.join(tempDir("apply-tx"), "guides.db");
      buildProductionFixture(fixtureDb);
    });

    function freshCopy(label: string): string {
      const dir = tempDir(`apply-tx-${label}`);
      const p = path.join(dir, "guides.db");
      fs.copyFileSync(fixtureDb, p);
      return p;
    }

    test("23. a successful apply assigns exactly the 12 target ids and nothing else changes (semantic diff: 12 additions, 0 other changes)", () => {
      const dbPath = freshCopy("success");
      const preDb = new Database(dbPath, { readonly: true });
      const prePages = loadAllPages(preDb);
      const beforeCanonical = new Map(prePages.flatMap((p) => p.items.map((it, idx) => [`${p.slug}[${idx}]`, JSON.stringify(canonicalize(it))])));
      preDb.close();

      const writeDb = new Database(dbPath);
      applyTransaction(writeDb, PRODUCTION_TARGETS, prePages);
      writeDb.close();

      const postDb = new Database(dbPath, { readonly: true });
      const postPages = loadAllPages(postDb);
      postDb.close();

      let additions = 0;
      let otherChanges = 0;
      const targetKeys = new Set(PRODUCTION_TARGETS.map((t) => `${t.slug}[${t.idx}]`));
      for (const page of postPages) {
        page.items.forEach((it, idx) => {
          const key = `${page.slug}[${idx}]`;
          const before = beforeCanonical.get(key);
          const after = JSON.stringify(canonicalize(it));
          if (before === after) return;
          if (targetKeys.has(key)) additions += 1;
          else otherChanges += 1;
        });
      }
      assert.equal(additions, 12, "expected exactly 12 additions");
      assert.equal(otherChanges, 0, "expected exactly 0 other changes");

      const counts = countIds(dbPath);
      assert.deepEqual(counts, { total: EXPECTED_TOTAL, withId: EXPECTED_WITH_ID + 12, withoutId: 0 });
    });

    test("24. page metadata (non-dates_json columns) is unchanged for touched pages after apply", () => {
      const dbPath = freshCopy("metadata");
      const before = new Map<string, Record<string, unknown>>();
      const dbBefore = new Database(dbPath, { readonly: true });
      for (const slug of TARGET_SLUGS) {
        const row = dbBefore.prepare("SELECT * FROM calendar_pages WHERE slug = ?").get(slug) as Record<string, unknown>;
        const clone = { ...row };
        delete clone.dates_json;
        before.set(slug, clone);
      }
      const prePages = loadAllPages(dbBefore);
      dbBefore.close();

      const writeDb = new Database(dbPath);
      applyTransaction(writeDb, PRODUCTION_TARGETS, prePages);
      writeDb.close();

      const dbAfter = new Database(dbPath, { readonly: true });
      for (const slug of TARGET_SLUGS) {
        const row = dbAfter.prepare("SELECT * FROM calendar_pages WHERE slug = ?").get(slug) as Record<string, unknown>;
        const clone = { ...row };
        delete clone.dates_json;
        assert.deepEqual(clone, before.get(slug), `metadata changed for ${slug}`);
      }
      dbAfter.close();
    });

    test("25. a forced failure after 1 update rolls back natively -- zero partial writes across all 4 pages", () => {
      const dbPath = freshCopy("forced-failure");
      const beforeSum = sha256File(dbPath);
      const before = countIds(dbPath);

      const preDb = new Database(dbPath, { readonly: true });
      const prePages = loadAllPages(preDb);
      preDb.close();

      const writeDb = new Database(dbPath);
      assert.throws(() => applyTransaction(writeDb, PRODUCTION_TARGETS, prePages, { forceFailureAfterUpdates: 1 }), /TEST-ONLY forced failure/);
      writeDb.close();

      assert.equal(sha256File(dbPath), beforeSum, "DB file must be byte-for-byte unchanged after a rolled-back transaction");
      assert.deepEqual(countIds(dbPath), before);
    });

    test("26. re-checking preconditions after a successful apply correctly refuses a re-run (conservative, no silent no-op)", () => {
      const dbPath = freshCopy("rerun");
      const preDb = new Database(dbPath, { readonly: true });
      const prePages = loadAllPages(preDb);
      preDb.close();
      const writeDb = new Database(dbPath);
      applyTransaction(writeDb, PRODUCTION_TARGETS, prePages);
      writeDb.close();

      const verifyDb = new Database(dbPath, { readonly: true });
      const result = checkPreconditions(verifyDb);
      verifyDb.close();
      assert.equal(result.ok, false);
      assert.ok(result.errors.some((e) => e.includes(`Expected ${EXPECTED_WITHOUT_ID} items without id, found 0`)));
    });

    test("27. independentPostCommitVerify confirms final state after a successful apply", () => {
      const dbPath = freshCopy("post-commit");
      const preDb = new Database(dbPath, { readonly: true });
      const prePages = loadAllPages(preDb);
      preDb.close();
      const writeDb = new Database(dbPath);
      applyTransaction(writeDb, PRODUCTION_TARGETS, prePages);
      writeDb.close();

      const result = independentPostCommitVerify(dbPath);
      assert.equal(result.ok, true, result.errors.join("; "));
      assert.equal(result.totalCount, EXPECTED_TOTAL);
      assert.equal(result.withIdCount, EXPECTED_WITH_ID + 12);
      assert.equal(result.withoutIdCount, 0);
    });
  }
);

// ============================================================================
// E. Full-CLI subprocess regressions
// ============================================================================

describe(
  "full-CLI subprocess regressions",
  { skip: !HAS_REAL_DB && "data/guides.db not in the expected post-ID-02 shape" },
  () => {
    let fixtureDb: string;
    before(() => {
      fixtureDb = path.join(tempDir("cli-fixture"), "guides.db");
      buildProductionFixture(fixtureDb);
    });

    function freshCopy(label: string): { dir: string; dbPath: string } {
      const dir = tempDir(`cli-${label}`);
      const dbPath = path.join(dir, "guides.db");
      fs.copyFileSync(fixtureDb, dbPath);
      return { dir, dbPath };
    }

    test("28. dry run: exits 0, reports 12 WOULD UPDATE lines, and performs zero writes", () => {
      const { dbPath } = freshCopy("dry-run");
      const beforeSum = sha256File(dbPath);
      const result = runScript(["--db", dbPath]);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout, /Dry run complete/);
      const woudUpdateCount = (result.stdout.match(/WOULD UPDATE/g) ?? []).length;
      assert.equal(woudUpdateCount, 12);
      assert.equal(sha256File(dbPath), beforeSum, "dry run must not write anything");
      assert.match(result.stdout, /DB_FILE_SHA256=[0-9a-f]{64}/, "every successful dry run must print DB_FILE_SHA256");
      assert.match(result.stdout, /CALENDAR_LOGICAL_DIGEST=[0-9a-f]{64}/, "every successful dry run must print CALENDAR_LOGICAL_DIGEST");
    });

    test("29. dry run does not require and does not create --backup-dir", () => {
      const { dbPath, dir } = freshCopy("dry-run-no-backup");
      const result = runScript(["--db", dbPath]);
      assert.equal(result.status, 0);
      // A read of a WAL-mode DB legitimately creates -wal/-shm companion
      // files even for a readonly connection -- that's SQLite, not this
      // script writing data. What must never appear is a "backups" dir.
      assert.ok(!fs.existsSync(path.join(dir, "backups")), "no backup directory should appear during a dry run");
    });

    test("30. apply without --backup-dir aborts before any write", () => {
      const { dbPath } = freshCopy("no-backup-dir");
      const beforeSum = sha256File(dbPath);
      const result = runScript(["--db", dbPath, "--apply"]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, /--apply requires --backup-dir/);
      assert.equal(sha256File(dbPath), beforeSum);
    });

    test("31. apply without --expected-db-sha256 aborts before any write", () => {
      const { dbPath, dir } = freshCopy("no-sha");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, /--apply requires --expected-db-sha256/);
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir), "backup dir must never be created when a required apply flag is missing");
    });

    test("31b. apply without --expected-calendar-digest aborts before any write", () => {
      const { dbPath, dir } = freshCopy("no-calendar-digest");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const sha = sha256File(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, /--apply requires --expected-calendar-digest/);
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir), "backup dir must never be created when a required apply flag is missing");
    });

    test("31c. apply with a malformed --expected-calendar-digest (wrong length / non-hex) aborts before any write", () => {
      const { dbPath, dir } = freshCopy("bad-format-calendar-digest");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const sha = sha256File(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--expected-calendar-digest", "not-64-hex", "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, /--expected-calendar-digest must be exactly 64 hex characters/);
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir));
    });

    test("32. apply with a wrong --expected-db-sha256 aborts before any write", () => {
      const { dbPath, dir } = freshCopy("wrong-sha");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const wrongSha = "0".repeat(64);
      const digest = calendarDigestOf(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", wrongSha, "--expected-calendar-digest", digest, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, /does not match the live DB file/);
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir));
    });

    test("32b. apply with a wrong-but-valid-format --expected-calendar-digest aborts before any write: no backup directory created, no DB mutation", () => {
      const { dbPath, dir } = freshCopy("wrong-calendar-digest");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const sha = sha256File(dbPath);
      const wrongDigest = "f".repeat(64);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--expected-calendar-digest", wrongDigest, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /CALENDAR LOGICAL DIGEST MISMATCH/);
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir), "no backup directory may be created on a digest mismatch");
    });

    test("33. apply without --confirm aborts before any write", () => {
      const { dbPath, dir } = freshCopy("no-confirm");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const sha = sha256File(dbPath);
      const digest = calendarDigestOf(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--expected-calendar-digest", digest]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, new RegExp(`--apply requires --confirm ${REQUIRED_CONFIRM_TOKEN}`));
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir));
    });

    test("34. apply with a wrong --confirm token (including a near-miss case variant) aborts before any write", () => {
      const { dbPath, dir } = freshCopy("wrong-confirm");
      const backupDir = path.join(dir, "backups");
      const beforeSum = sha256File(dbPath);
      const sha = sha256File(dbPath);
      const digest = calendarDigestOf(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--expected-calendar-digest", digest, "--confirm", REQUIRED_CONFIRM_TOKEN.toLowerCase()]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr + result.stdout, /--apply requires --confirm/);
      assert.equal(sha256File(dbPath), beforeSum);
      assert.ok(!fs.existsSync(backupDir));
    });

    test("35. an unwritable/invalid --backup-dir aborts before any transaction (zero DB writes)", () => {
      const { dbPath, dir } = freshCopy("invalid-backup-dir");
      const beforeSum = sha256File(dbPath);
      const sha = sha256File(dbPath);
      const digest = calendarDigestOf(dbPath);
      const blockedPath = path.join(dir, "backup-dir-is-a-file");
      fs.writeFileSync(blockedPath, "not a directory");

      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", blockedPath, "--expected-db-sha256", sha, "--expected-calendar-digest", digest, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /Backup directory reservation failed/);
      assert.equal(sha256File(dbPath), beforeSum, "DB must be untouched when backup directory reservation fails");
    });

    test("36 & 37. a successful full apply yields 118/118/0, a verified backup, and exactly 12 newly-assigned ids", () => {
      const { dbPath, dir } = freshCopy("full-apply");
      const backupDir = path.join(dir, "backups");
      const sha = sha256File(dbPath);
      const digest = calendarDigestOf(dbPath);

      const beforeIdsBySlugIdx = new Map<string, unknown>();
      {
        const db = new Database(dbPath, { readonly: true });
        for (const page of loadAllPages(db)) page.items.forEach((it, idx) => beforeIdsBySlugIdx.set(`${page.slug}[${idx}]`, it.id));
        db.close();
      }

      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--expected-calendar-digest", digest, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout, /Backfill complete/);

      assert.deepEqual(countIds(dbPath), { total: EXPECTED_TOTAL, withId: EXPECTED_WITH_ID + 12, withoutId: 0 });

      let newlyAssigned = 0;
      const db = new Database(dbPath, { readonly: true });
      for (const page of loadAllPages(db)) {
        page.items.forEach((it, idx) => {
          const key = `${page.slug}[${idx}]`;
          const wasEmpty = !beforeIdsBySlugIdx.get(key);
          if (wasEmpty) {
            assert.ok(it.id, `${key} should now carry an id`);
            newlyAssigned += 1;
          } else {
            assert.equal(it.id, beforeIdsBySlugIdx.get(key), `${key} id must be unchanged`);
          }
        });
      }
      db.close();
      assert.equal(newlyAssigned, 12);

      // Each backup now lives inside its own reserveBackupDirectory()-owned
      // child directory (id-03b-*) rather than directly under --backup-dir.
      const childDirs = fs.readdirSync(backupDir).filter((f) => fs.statSync(path.join(backupDir, f)).isDirectory());
      assert.equal(childDirs.length, 1, "exactly one reserved backup child directory expected");
      const backupPath = path.join(backupDir, childDirs[0], "guides.db");
      assert.ok(fs.existsSync(backupPath));
      assert.ok(fs.statSync(backupPath).size > 0);
      const backupDb = new Database(backupPath, { readonly: true, fileMustExist: true });
      const integrity = backupDb.pragma("integrity_check") as { integrity_check: string }[];
      backupDb.close();
      assert.equal(integrity[0].integrity_check, "ok");
    });

    test("38. re-running --apply against an already-backfilled disposable DB aborts on the count precondition (idempotency)", () => {
      const { dbPath, dir } = freshCopy("rerun-cli");
      const backupDir = path.join(dir, "backups");
      const sha1 = sha256File(dbPath);
      const digest1 = calendarDigestOf(dbPath);
      const first = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha1, "--expected-calendar-digest", digest1, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.equal(first.status, 0, first.stdout + first.stderr);

      const beforeSum = sha256File(dbPath);
      const sha2 = sha256File(dbPath);
      // Preconditions (step 3) run before either authorization lock is
      // compared, so the exact digest value doesn't matter for this second
      // call to demonstrate the intended abort -- only its format does.
      const second = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha2, "--expected-calendar-digest", "1".repeat(64), "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.notEqual(second.status, 0);
      assert.match(second.stdout + second.stderr, new RegExp(`Expected ${EXPECTED_WITHOUT_ID} items without id, found 0`));
      assert.equal(sha256File(dbPath), beforeSum);
    });

    test(
      "40. WAL-authorization regression: a committed-but-uncheckpointed calendar_pages mutation is rejected via --expected-calendar-digest even though --expected-db-sha256 still matches",
      () => {
        const { dbPath, dir } = freshCopy("wal-auth-regression");
        const backupDir = path.join(dir, "backups");

        // Step 1: capture the "owner-approved" locks exactly as an operator
        // would before running --apply.
        const approvedSha = sha256File(dbPath);
        const approvedDigest = calendarDigestOf(dbPath);

        // Step 2: switch to WAL and commit a real calendar_pages change via
        // a SEPARATE connection deliberately kept open (simulating a live
        // server holding the DB open), so SQLite does not auto-checkpoint
        // the WAL into the main file on close.
        const writer = new Database(dbPath);
        writer.pragma("journal_mode = WAL");
        const row = writer.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
        const items = JSON.parse(row.dates_json);
        items[0].label_en = "SILENTLY MUTATED VIA WAL, NOT CHECKPOINTED";
        writer.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), "dummy-fixture-page-0");

        try {
          // Step 3: prove the premise -- raw file SHA is unchanged, but a
          // fresh connection already sees the new content (the exact P1-A gap).
          assert.equal(sha256File(dbPath), approvedSha, "test premise: raw file SHA must still equal the pre-mutation approved value while the writer connection is open");
          const freshReader = new Database(dbPath, { readonly: true, fileMustExist: true });
          const freshRow = freshReader.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?").get("dummy-fixture-page-0") as { dates_json: string };
          freshReader.close();
          assert.equal(
            JSON.parse(freshRow.dates_json)[0].label_en,
            "SILENTLY MUTATED VIA WAL, NOT CHECKPOINTED",
            "test premise: a fresh connection must already see the WAL-committed change"
          );

          // Step 4: run the real CLI with the STALE (pre-mutation) approved
          // sha AND the STALE approved calendar digest. This is exactly the
          // scenario PRE-FRESH-01-ID-03B-02 independent QA (finding P1-A)
          // proved a raw-SHA-only gate would silently accept.
          const result = runScript([
            "--db", dbPath,
            "--apply",
            "--backup-dir", backupDir,
            "--expected-db-sha256", approvedSha,
            "--expected-calendar-digest", approvedDigest,
            "--confirm", REQUIRED_CONFIRM_TOKEN,
          ]);

          assert.notEqual(result.status, 0, "apply must be rejected -- the calendar digest gate must catch the WAL-committed drift the raw SHA gate alone would miss");
          assert.match(result.stdout + result.stderr, /CALENDAR LOGICAL DIGEST MISMATCH/);
          assert.ok(!fs.existsSync(backupDir), "no backup directory may be created when the digest gate rejects the run");

          const finalCounts = countIds(dbPath);
          assert.equal(finalCounts.withoutId, EXPECTED_WITHOUT_ID, "no id-assignment write may have occurred -- the 12 id-less items must remain id-less");
        } finally {
          writer.close();
        }
      }
    );

    test("40b. unrelated-table mutation does not change the calendar logical digest, and a legitimate apply still succeeds (authorization scope is calendar_pages only, by design)", () => {
      const { dbPath, dir } = freshCopy("unrelated-table-scope");
      const setup = new Database(dbPath);
      setup.exec("CREATE TABLE unrelated_scope_test_table (id INTEGER PRIMARY KEY, note TEXT)");
      setup.close();

      const digestBefore = calendarDigestOf(dbPath);

      const mutator = new Database(dbPath);
      mutator.prepare("INSERT INTO unrelated_scope_test_table (note) VALUES (?)").run("unrelated mutation");
      mutator.close();

      const digestAfter = calendarDigestOf(dbPath);
      assert.equal(
        digestAfter,
        digestBefore,
        "calendar_pages logical digest must be unaffected by an unrelated-table mutation -- this is the intended, documented scope limit, not a bug"
      );

      const backupDir = path.join(dir, "backups");
      const sha = sha256File(dbPath);
      const digest = calendarDigestOf(dbPath);
      const result = runScript(["--db", dbPath, "--apply", "--backup-dir", backupDir, "--expected-db-sha256", sha, "--expected-calendar-digest", digest, "--confirm", REQUIRED_CONFIRM_TOKEN]);
      assert.equal(result.status, 0, result.stdout + result.stderr);
    });

    test("39. a dry run against the real local data/guides.db (123/123/0 shape) safely fails production preconditions, read-only", () => {
      const beforeSum = sha256File(REAL_DB_PATH);
      const result = runScript(["--db", REAL_DB_PATH]);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /precondition failure/);
      assert.equal(sha256File(REAL_DB_PATH), beforeSum, "the real local DB must never be written to by this script");
    });
  }
);

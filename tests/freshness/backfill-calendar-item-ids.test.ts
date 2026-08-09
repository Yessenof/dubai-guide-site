// PRE-FRESH-01-ID-02 safety-hotfix regression suite for
// scripts/backfill-calendar-item-ids-local.ts and its extracted helper
// module scripts/lib/calendar-backfill-safety.ts.
//
// Pins the four independent-QA findings that were fixed (symlink bypass,
// case-variant bypass, pre-existing-duplicate-id not rejected pre-write,
// backup-filename collision) as automated regressions, plus the surrounding
// behavior (dry run, disposable apply, semantic diff) so a future change
// cannot silently reopen any of them.
//
// Every mutable DB used here is a disposable temp copy — the real
// data/guides.db is opened read-only (to clone its current, already
// migrated calendar_pages content) and is never written to. The "pre-id-
// backfill" fixture is reconstructed by cloning the real DB and reversing
// the one known transformation (stripping `id` from the 21 known
// slug/index positions) rather than hand-authoring calendar content, so the
// fixture's fingerprints genuinely match what the script expects.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { resolveRealPathBestEffort } from "../../lib/freshness/path-safety";
import { isUnderProtectedRoot, findDuplicates, createExclusiveBackup, PRODUCTION_ROOTS } from "../../scripts/lib/calendar-backfill-safety";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const REAL_DB_PATH = path.join(REPO_ROOT, "data", "guides.db");
const SCRIPT_PATH = path.join("scripts", "backfill-calendar-item-ids-local.ts");

// The 21 (slug, idx) coordinates assigned an id by the approved ID-02
// backfill (commit 82f7583). Only slug+idx are needed here (to strip `id`
// back off a clone of the real DB) — the fingerprint values themselves live
// solely in the script and are not duplicated.
const KNOWN_TARGET_COORDS: { slug: string; idx: number }[] = [
  { slug: "may-2026-uae-calendar", idx: 0 },
  { slug: "may-2026-uae-calendar", idx: 1 },
  { slug: "may-2026-uae-calendar", idx: 2 },
  { slug: "may-2026-uae-calendar", idx: 3 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 0 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 1 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 2 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 3 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 4 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 5 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 6 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 7 },
  { slug: "uae-business-compliance-calendar-2026-2027", idx: 8 },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 0 },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 1 },
  { slug: "uae-e-invoicing-2026-asp-deadline", idx: 2 },
  { slug: "uae-emiratisation-june-30-2026-reminder", idx: 0 },
  { slug: "uae-long-weekends-2026-2027", idx: 0 },
  { slug: "uae-long-weekends-2026-2027", idx: 1 },
  { slug: "uae-long-weekends-2026-2027", idx: 2 },
  { slug: "uae-long-weekends-2026-2027", idx: 3 },
];

const createdDirs: string[] = [];
function tempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `guidex-backfill-hotfix-test-${prefix}-`));
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
    const rows = db.prepare("SELECT dates_json FROM calendar_pages").all() as { dates_json: string }[];
    const items = rows.flatMap((r) => JSON.parse(r.dates_json) as Record<string, unknown>[]);
    return items.length === 123 && items.every((it) => typeof it.id === "string" && it.id.length > 0);
  } finally {
    db.close();
  }
}

/** Clones the real DB and strips `id` from the 21 known coordinates, reconstructing the exact pre-backfill state. */
function buildPreBackfillFixture(destPath: string): void {
  fs.copyFileSync(REAL_DB_PATH, destPath);
  const db = new Database(destPath);
  const bySlug = new Map<string, number[]>();
  for (const t of KNOWN_TARGET_COORDS) {
    if (!bySlug.has(t.slug)) bySlug.set(t.slug, []);
    bySlug.get(t.slug)!.push(t.idx);
  }
  const selectStmt = db.prepare("SELECT dates_json FROM calendar_pages WHERE slug = ?");
  const updateStmt = db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?");
  for (const [slug, idxs] of bySlug) {
    const row = selectStmt.get(slug) as { dates_json: string } | undefined;
    if (!row) throw new Error(`Fixture build: page not found: ${slug}`);
    const items = JSON.parse(row.dates_json) as Record<string, unknown>[];
    for (const idx of idxs) delete items[idx].id;
    updateStmt.run(JSON.stringify(items), slug);
  }
  db.close();
}

function countIds(dbPath: string): { total: number; withId: number; withoutId: number } {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare("SELECT dates_json FROM calendar_pages").all() as { dates_json: string }[];
    const items = rows.flatMap((r) => JSON.parse(r.dates_json) as Record<string, unknown>[]);
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
  const result = spawnSync("npx", ["tsx", SCRIPT_PATH, ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  return { status: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

const HAS_REAL_DB = realDbHasExpectedShape();

// ---- 1-7: production-path guard (pure logic + real symlink resolution) -----

describe("production-path guard: isUnderProtectedRoot + resolveRealPathBestEffort", () => {
  test("1. literal protected-root path is rejected", () => {
    assert.ok(isUnderProtectedRoot("/var/www/html/guides.db", "/var/www"));
    assert.ok(isUnderProtectedRoot("/var/www", "/var/www"));
  });

  test("PRODUCTION_ROOTS contains exactly the three locked-down roots", () => {
    assert.deepEqual([...PRODUCTION_ROOTS].sort(), ["/srv/www", "/var/app", "/var/www"]);
  });

  // Note: every test below resolves `root` through resolveRealPathBestEffort
  // before comparison, exactly like the CLI script now does. On macOS,
  // os.tmpdir() sits under /var, which is itself a symlink to /private/var
  // -- so an *unresolved* root would never match an already-resolved --db
  // path here, for the same reason a literal "/var/www" would not match on
  // that class of host without also resolving the root (see the guard's own
  // comment in scripts/backfill-calendar-item-ids-local.ts).

  test("2. relative alias resolving into a protected root is rejected", () => {
    const parent = tempDir("relative-alias");
    const root = path.join(parent, "mimic-root");
    fs.mkdirSync(root, { recursive: true });
    fs.writeFileSync(path.join(root, "guides.db"), "x");
    const resolvedRoot = resolveRealPathBestEffort(root);

    const relativeIntoRoot = path.join(root, ".", "guides.db");
    const resolved = resolveRealPathBestEffort(relativeIntoRoot);
    assert.ok(isUnderProtectedRoot(resolved, resolvedRoot));
  });

  test("3. dot-dot alias resolving into a protected root is rejected", () => {
    const root = tempDir("dotdot-root");
    fs.mkdirSync(path.join(root, "sub"), { recursive: true });
    fs.writeFileSync(path.join(root, "guides.db"), "x");
    const resolvedRoot = resolveRealPathBestEffort(root);

    const dotDotPath = path.join(root, "sub", "..", "guides.db");
    const resolved = resolveRealPathBestEffort(dotDotPath);
    assert.ok(isUnderProtectedRoot(resolved, resolvedRoot));
  });

  test("4. final-file symlink aliasing into a protected root is rejected", () => {
    const root = tempDir("symlink-final-root");
    const realFile = path.join(root, "guides.db");
    fs.writeFileSync(realFile, "x");
    const resolvedRoot = resolveRealPathBestEffort(root);
    const outside = tempDir("symlink-final-outside");
    const aliasPath = path.join(outside, "innocent-name.db");

    let symlinkSupported = true;
    try {
      fs.symlinkSync(realFile, aliasPath);
    } catch {
      symlinkSupported = false;
    }
    if (!symlinkSupported) return; // restricted environment; skip rather than false-fail

    const resolved = resolveRealPathBestEffort(aliasPath);
    assert.ok(isUnderProtectedRoot(resolved, resolvedRoot));
  });

  test("5. parent-directory symlink aliasing into a protected root is rejected", () => {
    const root = tempDir("symlink-parent-root");
    fs.writeFileSync(path.join(root, "guides.db"), "x");
    const resolvedRoot = resolveRealPathBestEffort(root);
    const outside = tempDir("symlink-parent-outside");
    const aliasDir = path.join(outside, "alias-dir");

    let symlinkSupported = true;
    try {
      fs.symlinkSync(root, aliasDir);
    } catch {
      symlinkSupported = false;
    }
    if (!symlinkSupported) return;

    const resolved = resolveRealPathBestEffort(path.join(aliasDir, "guides.db"));
    assert.ok(isUnderProtectedRoot(resolved, resolvedRoot));
  });

  test("6. case-variant path is rejected by case-insensitive comparison, without false-positiving on a prefix sibling", () => {
    const root = "/Var/WWW";
    assert.ok(isUnderProtectedRoot("/var/www/guides.db", root));
    assert.ok(isUnderProtectedRoot("/VAR/WWW/GUIDES.DB", root));
    assert.ok(!isUnderProtectedRoot("/var/www-old/guides.db", root));
  });

  test("7. a legitimate local path outside every protected root is accepted", () => {
    const legit = tempDir("legit-local");
    const dbPath = path.join(legit, "guides.db");
    fs.writeFileSync(dbPath, "x");
    const resolved = resolveRealPathBestEffort(dbPath);
    for (const root of PRODUCTION_ROOTS) assert.ok(!isUnderProtectedRoot(resolved, root));
  });
});

// ---- 8-9: existing-corpus duplicate-id preflight (pure logic) --------------

describe("existing-corpus duplicate-id precondition: findDuplicates", () => {
  test("8. exact duplicate id among the existing corpus is detected", () => {
    const dupes = findDuplicates(["A", "B", "A", "C"]);
    assert.deepEqual(dupes, ["A"]);
  });

  test("9. case-insensitive duplicate id among the existing corpus is detected", () => {
    const ids = ["MAY-01-EIDFED", "X", "may-01-eidfed"];
    const dupes = findDuplicates(ids.map((v) => v.toLowerCase()));
    assert.deepEqual(dupes, ["may-01-eidfed"]);
  });

  test("no false-positive duplicates on an already-unique corpus", () => {
    assert.deepEqual(findDuplicates(["A", "B", "C"]), []);
  });
});

// ---- 11: exclusive-create backup never overwrites (pure logic) ------------

describe("createExclusiveBackup", () => {
  test("11. a pre-existing file at the generated name is never overwritten; a fresh name is used instead", () => {
    const dir = tempDir("backup-collision");
    const src = path.join(dir, "src.db");
    fs.writeFileSync(src, "SOURCE-CONTENT");
    const collidingName = "collide.db";
    const backupDir = path.join(dir, "backups");
    fs.mkdirSync(backupDir, { recursive: true });
    fs.writeFileSync(path.join(backupDir, collidingName), "PRE-EXISTING-DO-NOT-TOUCH");

    let calls = 0;
    const nameGenerator = () => {
      calls += 1;
      return calls === 1 ? collidingName : `unique-${calls}.db`;
    };

    const result = createExclusiveBackup(src, backupDir, { nameGenerator });

    assert.notEqual(result, path.join(backupDir, collidingName));
    assert.equal(fs.readFileSync(path.join(backupDir, collidingName), "utf8"), "PRE-EXISTING-DO-NOT-TOUCH");
    assert.equal(fs.readFileSync(result, "utf8"), "SOURCE-CONTENT");
    assert.equal(calls, 2);
  });

  test("throws after exhausting maxAttempts if every generated name collides", () => {
    const dir = tempDir("backup-collision-exhausted");
    const src = path.join(dir, "src.db");
    fs.writeFileSync(src, "x");
    const backupDir = path.join(dir, "backups");
    fs.mkdirSync(backupDir, { recursive: true });
    fs.writeFileSync(path.join(backupDir, "always.db"), "taken");

    assert.throws(() => createExclusiveBackup(src, backupDir, { nameGenerator: () => "always.db", maxAttempts: 3 }));
  });
});

// ---- 10, 12-15: full-CLI subprocess regressions ----------------------------

describe("full-CLI subprocess regressions", { skip: !HAS_REAL_DB && "data/guides.db not in the expected post-backfill (123/123/0) shape" }, () => {
  let fixtureDb: string;
  let fixtureDir: string;

  before(() => {
    fixtureDir = tempDir("cli-fixture");
    fixtureDb = path.join(fixtureDir, "guides.db");
    buildPreBackfillFixture(fixtureDb);
  });

  test("fixture reconstruction: dry run reaches the planned-assignments stage (proves fingerprints still match)", () => {
    const result = runScript(["--db", fixtureDb]);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /Dry run complete/);
    assert.match(result.stdout, /Fingerprint precondition: PASS/);
  });

  test("13. dry run performs no write and requires no --backup-dir", () => {
    const before = countIds(fixtureDb);
    const beforeSum = sha256File(fixtureDb);
    const result = runScript(["--db", fixtureDb]);
    assert.equal(result.status, 0);
    assert.equal(sha256File(fixtureDb), beforeSum);
    assert.deepEqual(countIds(fixtureDb), before);
  });

  test("--apply without --backup-dir aborts before any write", () => {
    const dir = tempDir("apply-no-backup-dir");
    const dbCopy = path.join(dir, "guides.db");
    fs.copyFileSync(fixtureDb, dbCopy);
    const beforeSum = sha256File(dbCopy);

    const result = runScript(["--db", dbCopy, "--apply"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /Missing required --backup-dir/);
    assert.equal(sha256File(dbCopy), beforeSum);
  });

  test("10. pre-existing duplicate id among the existing corpus aborts before backup or write", () => {
    const dir = tempDir("dup-preflight");
    const dbCopy = path.join(dir, "guides.db");
    fs.copyFileSync(fixtureDb, dbCopy);

    // Force a genuine pre-existing duplicate among the already-id'd items.
    const db = new Database(dbCopy);
    const rows = db.prepare("SELECT slug, dates_json FROM calendar_pages").all() as { slug: string; dates_json: string }[];
    let donorId: string | null = null;
    for (const r of rows) {
      const items = JSON.parse(r.dates_json) as Record<string, unknown>[];
      const withId = items.find((it) => typeof it.id === "string" && it.id);
      if (withId) {
        donorId = withId.id as string;
        break;
      }
    }
    assert.ok(donorId, "fixture must have at least one pre-existing id to duplicate");
    let mutated = false;
    for (const r of rows) {
      if (mutated) break;
      const items = JSON.parse(r.dates_json) as Record<string, unknown>[];
      for (const it of items) {
        if (typeof it.id === "string" && it.id && it.id !== donorId) {
          it.id = donorId;
          mutated = true;
          break;
        }
      }
      if (mutated) db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), r.slug);
    }
    db.close();
    assert.ok(mutated, "must have introduced a duplicate");

    const beforeSum = sha256File(dbCopy);
    const backupDir = path.join(dir, "backups");
    fs.mkdirSync(backupDir, { recursive: true });

    const result = runScript(["--db", dbCopy, "--apply", "--backup-dir", backupDir]);

    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Pre-existing exact duplicate id/);
    assert.equal(sha256File(dbCopy), beforeSum, "DB must be byte-for-byte unchanged");
    assert.deepEqual(fs.readdirSync(backupDir), [], "no backup file may be created on a preflight failure");
  });

  test("9b. pre-existing case-insensitive duplicate id aborts before backup or write", () => {
    const dir = tempDir("dup-ci-preflight");
    const dbCopy = path.join(dir, "guides.db");
    fs.copyFileSync(fixtureDb, dbCopy);

    const db = new Database(dbCopy);
    const rows = db.prepare("SELECT slug, dates_json FROM calendar_pages").all() as { slug: string; dates_json: string }[];
    let donorId: string | null = null;
    for (const r of rows) {
      const items = JSON.parse(r.dates_json) as Record<string, unknown>[];
      const withId = items.find((it) => typeof it.id === "string" && it.id);
      if (withId) {
        donorId = withId.id as string;
        break;
      }
    }
    assert.ok(donorId);
    let mutated = false;
    for (const r of rows) {
      if (mutated) break;
      const items = JSON.parse(r.dates_json) as Record<string, unknown>[];
      for (const it of items) {
        if (typeof it.id === "string" && it.id && it.id.toLowerCase() !== donorId!.toLowerCase()) {
          it.id = donorId!.toLowerCase() === donorId ? donorId!.toUpperCase() : donorId!.toLowerCase();
          mutated = true;
          break;
        }
      }
      if (mutated) db.prepare("UPDATE calendar_pages SET dates_json = ? WHERE slug = ?").run(JSON.stringify(items), r.slug);
    }
    db.close();
    assert.ok(mutated);

    const beforeSum = sha256File(dbCopy);
    const backupDir = path.join(dir, "backups");
    fs.mkdirSync(backupDir, { recursive: true });

    const result = runScript(["--db", dbCopy, "--apply", "--backup-dir", backupDir]);

    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /case-insensitive duplicate id/);
    assert.equal(sha256File(dbCopy), beforeSum);
    assert.deepEqual(fs.readdirSync(backupDir), []);
  });

  test("12. an unwritable/invalid --backup-dir aborts before any transaction (zero DB writes)", () => {
    const dir = tempDir("backup-dir-invalid");
    const dbCopy = path.join(dir, "guides.db");
    fs.copyFileSync(fixtureDb, dbCopy);
    const beforeSum = sha256File(dbCopy);

    // A regular file at the backup-dir path: mkdirSync(..., {recursive:true})
    // fails with ENOTDIR/EEXIST because a file already occupies that path.
    const blockedPath = path.join(dir, "backup-dir-is-a-file");
    fs.writeFileSync(blockedPath, "not a directory");

    const result = runScript(["--db", dbCopy, "--apply", "--backup-dir", blockedPath]);

    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Backup creation failed|Could not create/);
    assert.equal(sha256File(dbCopy), beforeSum, "DB must be untouched when backup creation fails");
  });

  test("14 & 15. a successful disposable apply yields 123/123/0 and exactly 21 ids are newly assigned (semantic diff)", () => {
    const dir = tempDir("full-apply");
    const dbCopy = path.join(dir, "guides.db");
    fs.copyFileSync(fixtureDb, dbCopy);
    const backupDir = path.join(dir, "backups");
    fs.mkdirSync(backupDir, { recursive: true });

    const beforeIdsBySlugIdx = new Map<string, unknown>();
    {
      const db = new Database(dbCopy, { readonly: true });
      const rows = db.prepare("SELECT slug, dates_json FROM calendar_pages").all() as { slug: string; dates_json: string }[];
      for (const r of rows) {
        const items = JSON.parse(r.dates_json) as Record<string, unknown>[];
        items.forEach((it, idx) => beforeIdsBySlugIdx.set(`${r.slug}[${idx}]`, it.id));
      }
      db.close();
    }

    const result = runScript(["--db", dbCopy, "--apply", "--backup-dir", backupDir]);
    assert.equal(result.status, 0, result.stdout + result.stderr);

    const after = countIds(dbCopy);
    assert.deepEqual(after, { total: 123, withId: 123, withoutId: 0 });

    // Exactly the 21 known coordinates flipped from no-id to id; every other
    // coordinate's id is byte-identical to before.
    let newlyAssigned = 0;
    const db = new Database(dbCopy, { readonly: true });
    const rows = db.prepare("SELECT slug, dates_json FROM calendar_pages").all() as { slug: string; dates_json: string }[];
    for (const r of rows) {
      const items = JSON.parse(r.dates_json) as Record<string, unknown>[];
      items.forEach((it, idx) => {
        const key = `${r.slug}[${idx}]`;
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
    assert.equal(newlyAssigned, 21);

    // A backup was created (exclusive-create, non-empty).
    const backupFiles = fs.readdirSync(backupDir);
    assert.equal(backupFiles.length, 1);
    assert.ok(fs.statSync(path.join(backupDir, backupFiles[0])).size > 0);
  });

  test("re-running --apply against an already-backfilled disposable DB aborts on the count precondition (idempotency)", () => {
    const dir = tempDir("rerun");
    const dbCopy = path.join(dir, "guides.db");
    fs.copyFileSync(fixtureDb, dbCopy);
    const backupDir = path.join(dir, "backups");
    fs.mkdirSync(backupDir, { recursive: true });

    const first = runScript(["--db", dbCopy, "--apply", "--backup-dir", backupDir]);
    assert.equal(first.status, 0);

    const beforeSum = sha256File(dbCopy);
    const second = runScript(["--db", dbCopy, "--apply", "--backup-dir", backupDir]);
    assert.notEqual(second.status, 0);
    assert.match(second.stdout + second.stderr, /Expected 102 items with id/);
    assert.equal(sha256File(dbCopy), beforeSum);
  });
});

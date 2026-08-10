// FRESH-01 — deterministic consistency engine test suite.
//
// Every guides.db-shaped fixture here is disposable (tests/freshness/
// consistency-test-helpers.ts, under os.tmpdir()). Every freshness.db
// fixture is bootstrapped through the real FRESH-00 migration runner
// (tests/freshness/test-helpers.ts), never a hand-maintained schema copy.
// Nothing in this file ever points a fixture path at data/guides.db except
// the single explicitly-labeled real-corpus read-only check at the bottom.

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Database from "better-sqlite3";

import { runConsistencyCheck } from "../../lib/freshness/consistency/engine";
import { ConsistencyReport } from "../../lib/freshness/consistency/types";
import {
  createGuidesTestDb,
  insertCalendarPage,
  cleanupAllGuidesTestDbs,
  sha256OfFile,
} from "./consistency-test-helpers";
import {
  freshTestDb,
  openDb,
  insertSource,
  insertWatchlistRow,
  insertChangeCandidate,
  cleanupAllTestDbs,
  REPO_ROOT_FOR_TESTS,
} from "./test-helpers";

after(() => {
  cleanupAllGuidesTestDbs();
  cleanupAllTestDbs();
});

// ─── Fixture helpers ────────────────────────────────────────────────────────

function calItem(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "TEST-01-EVENT",
    date: "2026-08-10",
    label_en: "Test event",
    type: "event",
    source: "",
    ...overrides,
  };
}

interface PageOpts {
  slug?: string;
  status?: string;
  ruPublished?: boolean;
  officialSourceUrl?: string;
}

/** Fresh guides.db with one page holding exactly the given raw items array. */
function guidesDbWithItems(items: unknown[], pageOpts: PageOpts = {}): string {
  const dbPath = createGuidesTestDb();
  insertCalendarPage(dbPath, { datesJson: JSON.stringify(items), ...pageOpts });
  return dbPath;
}

/** Fresh freshness.db with the real FRESH-00 schema and no rows. */
function emptyFreshnessDb(): string {
  return freshTestDb();
}

function runCli(args: string[]): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", "scripts/qa-consistency-check.ts", ...args], {
      cwd: REPO_ROOT_FOR_TESTS,
      stdio: "pipe",
    }).toString();
    return { status: 0, stdout, stderr: "" };
  } catch (err) {
    const e = err as { status: number; stdout: Buffer; stderr: Buffer };
    return { status: e.status, stdout: e.stdout?.toString() ?? "", stderr: e.stderr?.toString() ?? "" };
  }
}

// ─── 1. Engine / core ───────────────────────────────────────────────────────

describe("engine / core", () => {
  test("empty corpus with no findings -> PASS", () => {
    const guidesDb = guidesDbWithItems([]);
    const freshnessDb = emptyFreshnessDb();
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.equal(report.status, "PASS");
    assert.deepEqual(report.findings, []);
  });

  test("warning-only corpus -> PASS_WITH_WARNINGS", () => {
    // Missing all source/evidence fields trips EVENT-SCHEMA-007 as a WARNING only.
    const guidesDb = guidesDbWithItems([calItem({ source: "", source_url: undefined, source_label: undefined })]);
    const freshnessDb = emptyFreshnessDb();
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.equal(report.status, "PASS_WITH_WARNINGS");
    assert.ok(report.counts.warnings > 0);
    assert.equal(report.counts.blocking, 0);
    assert.equal(report.counts.hard_fail, 0);
  });

  test("blocking finding -> BLOCKED, CLI exit 1", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "" })]);
    const freshnessDb = emptyFreshnessDb();
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.equal(report.status, "BLOCKED");

    const cli = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(cli.status, 1);
  });

  test("engine hard fail -> FAIL, CLI exit 2", () => {
    const dbPath = createGuidesTestDb();
    insertCalendarPage(dbPath, { datesJson: "{ not valid json" });
    const freshnessDb = emptyFreshnessDb();
    const report = runConsistencyCheck({ guidesDbPath: dbPath, freshnessDbPath: freshnessDb });
    assert.equal(report.status, "FAIL");
    assert.ok(report.counts.hard_fail > 0);

    const cli = runCli(["--guides-db", dbPath, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(cli.status, 2);
  });

  test("stable deterministic finding order across repeated runs", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "" }), calItem({ id: "DUP" }), calItem({ id: "DUP" }), calItem({ date: "not-a-date" })]);
    const freshnessDb = emptyFreshnessDb();
    const r1 = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const r2 = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.deepEqual(r1.findings, r2.findings);
  });

  test("byte-stable JSON across repeated CLI runs", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "" }), calItem()]);
    const freshnessDb = emptyFreshnessDb();
    const run1 = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    const run2 = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(run1.stdout, run2.stdout);
  });
});

// ─── 2. Calendar identity (CAL-ITEM-SHAPE-009) ─────────────────────────────

describe("calendar identity", () => {
  test("every item has an id -> no missing-id finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "OK-01" }), calItem({ id: "OK-02" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    assert.ok(!report.findings.some((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("missing a persisted id")));
  });

  test("missing id -> blocking", () => {
    const item = calItem();
    delete (item as Record<string, unknown>).id;
    const guidesDb = guidesDbWithItems([item]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("missing a persisted id"));
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });

  test("blank id -> blocking", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "   " })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("missing a persisted id"));
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });

  test("exact duplicate id -> blocking", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "DUP-01" }), calItem({ id: "DUP-01" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("duplicated exactly"));
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });

  test("case-insensitive duplicate id -> blocking", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "Dup-Case" }), calItem({ id: "dup-case" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("differ only by case"));
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });

  test("no runtime fallback identity is ever generated for a missing id", () => {
    const item = calItem();
    delete (item as Record<string, unknown>).id;
    const guidesDb = guidesDbWithItems([item]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("missing a persisted id"));
    assert.ok(finding);
    // No entity_ref at all — never "<slug>#index" or any other generated identity.
    assert.equal(finding!.entity_ref, undefined);
  });
});

// ─── 3. Dates (CAL-DATE-010) ────────────────────────────────────────────────

describe("calendar date shape", () => {
  test("valid strict date -> no finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ date: "2026-08-10", date_end: "2026-08-12" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    assert.ok(!report.findings.some((f) => f.rule_id === "CAL-DATE-010"));
  });

  test("impossible date (2026-02-30) -> finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ date: "2026-02-30" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-DATE-010" && f.field === "date");
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });

  test("malformed date -> finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ date: "10/08/2026" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    assert.ok(report.findings.some((f) => f.rule_id === "CAL-DATE-010" && f.field === "date"));
  });

  test("date_end earlier than date -> finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ date: "2026-08-10", date_end: "2026-08-01" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "CAL-DATE-010" && f.field === "date_end" && f.message.includes("earlier than"));
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });
});

// ─── 4. Sources ─────────────────────────────────────────────────────────────

describe("source resolution", () => {
  function freshnessDbWithSources(sources: { sourceEntity: string; canonicalHostnames: string[]; labelEn: string }[]): string {
    const dbPath = freshTestDb();
    const db = openDb(dbPath);
    for (const s of sources) insertSource(db, { ...s, sourceKind: "government" });
    db.close();
    return dbPath;
  }

  test("known A vs known A -> no SRC-IDENTITY-001 finding", () => {
    const freshnessDb = freshnessDbWithSources([{ sourceEntity: "UAE Gov", canonicalHostnames: ["u.ae"], labelEn: "UAE Government Portal" }]);
    const guidesDb = guidesDbWithItems([
      calItem({ source_url: "https://u.ae/en/leadership", source_label_en: "UAE Government Portal" }),
    ]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.ok(!report.findings.some((f) => f.rule_id === "SRC-IDENTITY-001"));
  });

  test("known A vs known B -> deterministic blocking contradiction", () => {
    const freshnessDb = freshnessDbWithSources([
      { sourceEntity: "UAE Gov", canonicalHostnames: ["u.ae"], labelEn: "UAE Government Portal" },
      { sourceEntity: "GDRFA", canonicalHostnames: ["gdrfa.gov.ae"], labelEn: "GDRFA Dubai" },
    ]);
    const guidesDb = guidesDbWithItems([calItem({ source_url: "https://u.ae/en/leadership", source_label_en: "GDRFA Dubai" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "SRC-IDENTITY-001");
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });

  test("known A vs unknown label -> warning, not a confirmed contradiction", () => {
    const freshnessDb = freshnessDbWithSources([{ sourceEntity: "UAE Gov", canonicalHostnames: ["u.ae"], labelEn: "UAE Government Portal" }]);
    const guidesDb = guidesDbWithItems([calItem({ source_url: "https://u.ae/en/leadership", source_label_en: "UAE Ministry Office" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "SRC-IDENTITY-001");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("unknown vs unknown -> no fabricated SRC-IDENTITY-001 contradiction", () => {
    const freshnessDb = freshnessDbWithSources([]);
    const guidesDb = guidesDbWithItems([
      calItem({ source_url: "https://unregistered-example.test/page", source_label_en: "Some Unregistered Org" }),
    ]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.ok(!report.findings.some((f) => f.rule_id === "SRC-IDENTITY-001"));
  });

  test("registry gap: unregistered source_url hostname -> warning", () => {
    const freshnessDb = freshnessDbWithSources([]);
    const guidesDb = guidesDbWithItems([calItem({ source_url: "https://unregistered-example.test/page" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "SRC-REGISTRY-GAP-003");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("compound attribution -> SRC-COMPOUND-006 human-review finding", () => {
    const freshnessDb = freshnessDbWithSources([
      { sourceEntity: "DMCC", canonicalHostnames: ["dmcc.ae"], labelEn: "DMCC" },
      { sourceEntity: "DIFC", canonicalHostnames: ["difc.ae"], labelEn: "DIFC" },
    ]);
    const guidesDb = guidesDbWithItems([calItem({ source: "DMCC/DIFC authority portals" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "SRC-COMPOUND-006");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("alias maps only when explicitly registered — close-but-inexact label is UNKNOWN, not silently accepted or falsely blocked", () => {
    const freshnessDb = freshnessDbWithSources([{ sourceEntity: "UAE Gov", canonicalHostnames: ["u.ae"], labelEn: "UAE Government Portal" }]);
    const guidesDb = guidesDbWithItems([calItem({ source_url: "https://u.ae/en/leadership", source_label_en: "UAE Govt Portal" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "SRC-IDENTITY-001");
    // Not a false MATCH (no finding would be wrong) and not a false BLOCKING
    // contradiction (there is no second KNOWN entity) — must be WARNING.
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("SRC-IDENTITY-002: source_label_en vs source_label_ru resolve to different registered entities -> blocking", () => {
    const dbPath = freshTestDb();
    const db = openDb(dbPath);
    insertSource(db, { sourceEntity: "UAE Gov", sourceKind: "government", canonicalHostnames: ["u.ae"], labelEn: "UAE Government Portal", labelRu: "Правительство ОАЭ" });
    insertSource(db, { sourceEntity: "GDRFA", sourceKind: "government", canonicalHostnames: ["gdrfa.gov.ae"], labelEn: "GDRFA Dubai", labelRu: "ГУВД Дубая" });
    db.close();

    const guidesDb = guidesDbWithItems([calItem({ source_label_en: "UAE Government Portal", source_label_ru: "ГУВД Дубая" })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: dbPath });
    const finding = report.findings.find((f) => f.rule_id === "SRC-IDENTITY-002");
    assert.ok(finding);
    assert.equal(finding!.severity, "BLOCKING");
  });
});

// ─── 5. Pairing / evidence ──────────────────────────────────────────────────

describe("RU pairing and evidence metadata", () => {
  test("EN/RU required pair present -> no RU-PAIR-011 finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ label_en: "Holiday", label_ru: "Праздник" })], { ruPublished: true });
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    assert.ok(!report.findings.some((f) => f.rule_id === "RU-PAIR-011"));
  });

  test("RU pair missing on a RU-published page -> warning", () => {
    const guidesDb = guidesDbWithItems([calItem({ label_en: "Holiday", label_ru: "" })], { ruPublished: true });
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    const finding = report.findings.find((f) => f.rule_id === "RU-PAIR-011");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("RU pair missing on a non-RU-published page -> no finding (RU not required yet)", () => {
    const guidesDb = guidesDbWithItems([calItem({ label_en: "Holiday", label_ru: "" })], { ruPublished: false });
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: emptyFreshnessDb() });
    assert.ok(!report.findings.some((f) => f.rule_id === "RU-PAIR-011"));
  });

  test("required freshness evidence metadata missing -> MISSING-EVIDENCE-METADATA-015", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "TRACKED-01", source: "", source_url: undefined, source_label: undefined })]);
    const freshnessDb = freshTestDb();
    const db = openDb(freshnessDb);
    insertWatchlistRow(db, { entityRef: "TRACKED-01", factKey: "date", entityType: "calendar_item" });
    db.close();

    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "MISSING-EVIDENCE-METADATA-015");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("ambiguous entity -> ENTITY-REVIEW-014", () => {
    const freshnessDb = freshTestDb(); // no registered sources at all
    const guidesDb = guidesDbWithItems([calItem({ source: "Some Vague Organizer Account", source_url: undefined })]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "ENTITY-REVIEW-014");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });
});

// ─── 6. EVENT-DATE-008 (registry cross-check) ──────────────────────────────

describe("event date registry contradiction", () => {
  test("approved-but-unapplied date change candidate differing from persisted date -> warning", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "PENDING-DATE-01", date: "2026-08-10" })]);
    const freshnessDb = freshTestDb();
    const db = openDb(freshnessDb);
    const watchlistId = insertWatchlistRow(db, { entityRef: "PENDING-DATE-01", factKey: "date", entityType: "calendar_item" });
    insertChangeCandidate(db, watchlistId, { factKey: "date", proposedValue: "2026-08-17", severity: "warning", verificationStatus: "approved" });
    db.close();

    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const finding = report.findings.find((f) => f.rule_id === "EVENT-DATE-008");
    assert.ok(finding);
    assert.equal(finding!.severity, "WARNING");
  });

  test("approved candidate matching the persisted date -> no finding", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "MATCHED-DATE-01", date: "2026-08-10" })]);
    const freshnessDb = freshTestDb();
    const db = openDb(freshnessDb);
    const watchlistId = insertWatchlistRow(db, { entityRef: "MATCHED-DATE-01", factKey: "date", entityType: "calendar_item" });
    insertChangeCandidate(db, watchlistId, { factKey: "date", proposedValue: "2026-08-10", severity: "warning", verificationStatus: "approved" });
    db.close();

    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.ok(!report.findings.some((f) => f.rule_id === "EVENT-DATE-008"));
  });
});

// ─── 7. Corruption / schema ─────────────────────────────────────────────────

describe("corruption and schema hard-fails", () => {
  test("malformed dates_json -> HARD_FAIL with page evidence", () => {
    const dbPath = createGuidesTestDb();
    insertCalendarPage(dbPath, { slug: "broken-page", datesJson: "not json at all" });
    const report = runConsistencyCheck({ guidesDbPath: dbPath, freshnessDbPath: emptyFreshnessDb() });
    assert.equal(report.status, "FAIL");
    const finding = report.findings.find((f) => f.severity === "HARD_FAIL" && f.page_slug === "broken-page");
    assert.ok(finding);
  });

  test("missing required calendar_pages table -> HARD_FAIL", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "guidex-consistency-noschema-"));
    const dbPath = path.join(dir, "empty.db");
    const db = new Database(dbPath);
    db.exec("CREATE TABLE unrelated_table (id TEXT)");
    db.close();

    const report = runConsistencyCheck({ guidesDbPath: dbPath, freshnessDbPath: emptyFreshnessDb() });
    assert.equal(report.status, "FAIL");
    assert.ok(report.findings.some((f) => f.rule_id === "ENGINE-SCHEMA" && f.message.includes("calendar_pages")));
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("missing required freshness table -> HARD_FAIL", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "guidex-consistency-nofresh-"));
    const dbPath = path.join(dir, "empty-freshness.db");
    const db = new Database(dbPath);
    db.exec("CREATE TABLE unrelated_table (id TEXT)");
    db.close();

    const guidesDb = guidesDbWithItems([]);
    const report = runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: dbPath });
    assert.equal(report.status, "FAIL");
    assert.ok(report.findings.some((f) => f.rule_id === "ENGINE-SCHEMA" && f.message.includes("missing required table")));
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

// ─── 8. Read-only guarantees ─────────────────────────────────────────────────

describe("read-only guarantees", () => {
  test("guides DB file is byte-identical before and after a run", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "RO-01" }), calItem({ id: "" })]);
    const freshnessDb = emptyFreshnessDb();
    const before = sha256OfFile(guidesDb);
    runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const after = sha256OfFile(guidesDb);
    assert.equal(before, after);
  });

  test("freshness DB file is byte-identical before and after a run", () => {
    const guidesDb = guidesDbWithItems([calItem()]);
    const freshnessDb = emptyFreshnessDb();
    const before = sha256OfFile(freshnessDb);
    runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    const after = sha256OfFile(freshnessDb);
    assert.equal(before, after);
  });

  test("no WAL/SHM side files are created by a read-only run", () => {
    const guidesDb = guidesDbWithItems([calItem()]);
    const freshnessDb = emptyFreshnessDb();
    runConsistencyCheck({ guidesDbPath: guidesDb, freshnessDbPath: freshnessDb });
    assert.equal(fs.existsSync(`${guidesDb}-wal`), false);
    assert.equal(fs.existsSync(`${guidesDb}-shm`), false);
  });
});

// ─── 9. CLI ─────────────────────────────────────────────────────────────────

describe("CLI", () => {
  test("missing --guides-db -> usage error, exit 2", () => {
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--freshness-db", freshnessDb]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /--guides-db/);
  });

  test("missing --freshness-db -> usage error, exit 2", () => {
    const guidesDb = guidesDbWithItems([]);
    const result = runCli(["--guides-db", guidesDb]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /--freshness-db/);
  });

  test("invalid --format is rejected, exit 2", () => {
    const guidesDb = guidesDbWithItems([]);
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "yaml"]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Invalid --format/);
  });

  test("--format json stdout is JSON only (parses cleanly)", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "" })]);
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    const parsed = JSON.parse(result.stdout) as ConsistencyReport;
    assert.equal(parsed.status, "BLOCKED");
  });

  test("PASS -> exit 0", () => {
    const guidesDb = guidesDbWithItems([calItem({ source_url: "https://example.test/x" })]);
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(result.status, 0);
  });

  test("PASS_WITH_WARNINGS -> exit 0", () => {
    const guidesDb = guidesDbWithItems([calItem({ source: "", source_url: undefined, source_label: undefined })]);
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout) as ConsistencyReport;
    assert.equal(parsed.status, "PASS_WITH_WARNINGS");
  });

  test("BLOCKED -> exit 1", () => {
    const guidesDb = guidesDbWithItems([calItem({ id: "" })]);
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--guides-db", guidesDb, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(result.status, 1);
  });

  test("FAIL/HARD_FAIL -> exit 2", () => {
    const dbPath = createGuidesTestDb();
    insertCalendarPage(dbPath, { datesJson: "{{{not json" });
    const freshnessDb = emptyFreshnessDb();
    const result = runCli(["--guides-db", dbPath, "--freshness-db", freshnessDb, "--format", "json"]);
    assert.equal(result.status, 2);
  });
});

// ─── 10. Real-corpus read-only check (fixture-dependent findings) ─────────
//
// Runs the CLI, read-only, against the real local data/guides.db plus a
// disposable freshness.db fixture with a compatible schema and NO
// pre-seeded sources. This proves the engine can process real local
// content end to end. Any SRC-*/RU-PAIR/MISSING-EVIDENCE findings this
// produces are fixture-dependent (the disposable freshness.db has no real
// source registry) and must NOT be read as claims about actual content
// truth — only CAL-ITEM-SHAPE-009/CAL-DATE-010/EVENT-SCHEMA-007, which
// depend only on guides.db itself, are meaningful here.

describe("real-corpus read-only check (fixture-dependent findings)", () => {
  test("processes the real local data/guides.db without any mutation", () => {
    const realGuidesDb = path.join(REPO_ROOT_FOR_TESTS, "data", "guides.db");
    if (!fs.existsSync(realGuidesDb)) {
      // No local DB in this checkout — nothing to verify.
      return;
    }
    const freshnessDb = emptyFreshnessDb();
    const before = sha256OfFile(realGuidesDb);
    const report = runConsistencyCheck({ guidesDbPath: realGuidesDb, freshnessDbPath: freshnessDb });
    const after = sha256OfFile(realGuidesDb);

    assert.equal(before, after, "real data/guides.db must be byte-identical after a read-only FRESH-01 run");
    assert.ok(report.status === "PASS" || report.status === "PASS_WITH_WARNINGS" || report.status === "BLOCKED");
    // Sanity: the real corpus (per FRESH-00/POST-ID-03) has zero calendar
    // items without an id, so CAL-ITEM-SHAPE-009's missing-id case must not fire.
    assert.ok(!report.findings.some((f) => f.rule_id === "CAL-ITEM-SHAPE-009" && f.message.includes("missing a persisted id")));
  });
});

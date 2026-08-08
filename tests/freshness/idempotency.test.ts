// Idempotency + atomicity regressions. Per this phase's brief §15/§28/§25:
// a machine artifact (or an alert-generation step) processed twice must not
// multiply state, and a failed multi-insert write must not partially commit.

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import {
  freshTestDb,
  openDb,
  testId,
  insertWatchlistRow,
  insertObservation,
  insertChangeCandidate,
  insertAlert,
  cleanupAllTestDbs,
} from "./test-helpers";

after(cleanupAllTestDbs);

describe("duplicate observation_id", () => {
  test("second insert with the same observation_id is rejected — no duplicate row", () => {
    const dbPath = freshTestDb("dup-observation");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "AUG-NEW-02", factKey: "source_label_en" });
    const sharedObservationId = "obs-run-2026-08-08-0001";

    insertObservation(db, watchlistId, { observationId: sharedObservationId, observedValue: "first pass" });

    assert.throws(() => {
      insertObservation(db, watchlistId, { observationId: sharedObservationId, observedValue: "reprocessed" });
    }, /UNIQUE constraint failed/);

    const rows = db
      .prepare("SELECT observed_value FROM freshness_observations WHERE observation_id = ?")
      .all(sharedObservationId) as { observed_value: string }[];
    assert.equal(rows.length, 1, "exactly one semantic observation must exist");
    assert.equal(rows[0].observed_value, "first pass");
    db.close();
  });
});

describe("stale / duplicate run_id", () => {
  test("multiple observations may legitimately share one run_id — only observation_id is unique", () => {
    const dbPath = freshTestDb("shared-run-id");
    const db = openDb(dbPath);
    const watchlistA = insertWatchlistRow(db, { entityRef: "EVENT-A", factKey: "date" });
    const watchlistB = insertWatchlistRow(db, { entityRef: "EVENT-B", factKey: "date" });
    const runId = "run-2026-08-08-0630";

    db.prepare(
      `INSERT INTO freshness_observations (id, watchlist_id, observation_id, run_id, observed_at, result, created_at)
       VALUES (?, ?, ?, ?, datetime('now'), 'unchanged', datetime('now'))`
    ).run(testId("obs"), watchlistA, testId("obsid"), runId);
    db.prepare(
      `INSERT INTO freshness_observations (id, watchlist_id, observation_id, run_id, observed_at, result, created_at)
       VALUES (?, ?, ?, ?, datetime('now'), 'unchanged', datetime('now'))`
    ).run(testId("obs"), watchlistB, testId("obsid"), runId);

    const rows = db.prepare("SELECT COUNT(*) as n FROM freshness_observations WHERE run_id = ?").get(runId) as {
      n: number;
    };
    assert.equal(rows.n, 2);
    db.close();
  });

  test("an older stale run's observation is preserved alongside a newer run's, not overwritten", () => {
    const dbPath = freshTestDb("stale-run");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "EVENT-C", factKey: "date" });

    db.prepare(
      `INSERT INTO freshness_observations (id, watchlist_id, observation_id, run_id, observed_value, observed_at, result, created_at)
       VALUES (?, ?, ?, 'run-stale-yesterday', 'value-from-stale-run', '2026-08-07T06:30:00.000Z', 'unchanged', datetime('now'))`
    ).run(testId("obs"), watchlistId, testId("obsid"));
    db.prepare(
      `INSERT INTO freshness_observations (id, watchlist_id, observation_id, run_id, observed_value, observed_at, result, created_at)
       VALUES (?, ?, ?, 'run-current', 'value-from-current-run', '2026-08-08T06:30:00.000Z', 'unchanged', datetime('now'))`
    ).run(testId("obs"), watchlistId, testId("obsid"));

    const rows = db
      .prepare("SELECT run_id, observed_value FROM freshness_observations WHERE watchlist_id = ? ORDER BY observed_at")
      .all(watchlistId) as { run_id: string; observed_value: string }[];
    assert.equal(rows.length, 2, "the stale run's observation is never silently dropped or overwritten");
    assert.equal(rows[0].run_id, "run-stale-yesterday");
    assert.equal(rows[1].run_id, "run-current");
    db.close();
  });
});

describe("duplicate watchlist identity", () => {
  test("UNIQUE(entity_type, entity_ref, fact_key) rejects a second registration of the same fact", () => {
    const dbPath = freshTestDb("dup-watchlist");
    const db = openDb(dbPath);
    insertWatchlistRow(db, { entityRef: "employment-visa", factKey: "step-3.cost", entityType: "guide_field" });
    assert.throws(() => {
      insertWatchlistRow(db, { entityRef: "employment-visa", factKey: "step-3.cost", entityType: "guide_field" });
    }, /UNIQUE constraint failed/);
    db.close();
  });
});

describe("alert idempotency (§28) / approval separation (§29)", () => {
  test("a second alert for the same change candidate is rejected — UNIQUE(change_candidate_id)", () => {
    const dbPath = freshTestDb("dup-alert");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "CONCERT-01", factKey: "date_start" });
    const candidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "date_start",
      oldValue: "2026-09-10",
      proposedValue: "2026-10-01",
      severity: "urgent",
    });

    insertAlert(db, candidateId, { severity: "urgent" });
    assert.throws(() => {
      insertAlert(db, candidateId, { severity: "urgent" });
    }, /UNIQUE constraint failed/);

    const alerts = db
      .prepare("SELECT COUNT(*) as n FROM freshness_alerts WHERE change_candidate_id = ?")
      .get(candidateId) as { n: number };
    assert.equal(alerts.n, 1);
    db.close();
  });

  test("creating an alert never changes the candidate's verification_status — silence is never approval", () => {
    const dbPath = freshTestDb("alert-not-approval");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "CONCERT-02", factKey: "date_start" });
    const candidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "date_start",
      proposedValue: "2026-10-01",
      severity: "urgent",
    });
    insertAlert(db, candidateId, { severity: "urgent", status: "pending" });

    const candidate = db
      .prepare("SELECT verification_status FROM freshness_change_candidates WHERE id = ?")
      .get(candidateId) as { verification_status: string };
    assert.equal(candidate.verification_status, "pending", "alert delivery must never auto-approve a candidate");

    // Acknowledging/resolving the alert delivery record still must not touch approval state.
    db.prepare("UPDATE freshness_alerts SET status = 'acknowledged' WHERE change_candidate_id = ?").run(candidateId);
    const candidateAfterAck = db
      .prepare("SELECT verification_status FROM freshness_change_candidates WHERE id = ?")
      .get(candidateId) as { verification_status: string };
    assert.equal(candidateAfterAck.verification_status, "pending");
    db.close();
  });
});

describe("malformed-artifact atomicity", () => {
  test("a transaction that fails partway rolls back entirely — no partial DB write", () => {
    const dbPath = freshTestDb("atomic-rollback");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "CONCERT-03", factKey: "date_start" });

    // Pre-existing alert for a candidate id we'll collide with, forcing the
    // second insert inside the transaction below to fail on UNIQUE(change_candidate_id).
    const existingCandidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "date_start",
      proposedValue: "2026-10-01",
      severity: "urgent",
    });
    insertAlert(db, existingCandidateId, { severity: "urgent" });

    const beforeCount = db.prepare("SELECT COUNT(*) as n FROM freshness_change_candidates").get() as { n: number };

    const processArtifact = db.transaction(() => {
      // Step 1: a new, otherwise-valid candidate.
      insertChangeCandidate(db, watchlistId, {
        factKey: "venue",
        proposedValue: "New Venue",
        severity: "warning",
      });
      // Step 2: deliberately re-use the already-alerted candidate id — this
      // insert fails, simulating a malformed/duplicate machine artifact.
      insertAlert(db, existingCandidateId, { severity: "urgent" });
    });

    assert.throws(() => processArtifact());

    const afterCount = db.prepare("SELECT COUNT(*) as n FROM freshness_change_candidates").get() as { n: number };
    assert.equal(
      afterCount.n,
      beforeCount.n,
      "the candidate insert from the failed transaction must have been rolled back, not partially committed"
    );
    db.close();
  });
});

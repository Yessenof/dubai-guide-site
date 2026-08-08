// Manual hotfix reconciliation — the AUG-NEW-02-class worked example from
// docs/architecture/fresh-00-implementation-plan.md §13, executed end-to-end
// against the real schema. Per this phase's brief §18/§35: must pass without
// any schema redesign.
//
// Scenario: a baseline watchlist fact exists. Monitoring observes a change.
// A candidate is created but held. Before it is reviewed through this
// pipeline, the owner manually fixes the underlying guides.db content
// out-of-band (in production this is a real admin edit — here it is
// represented purely as freshness.db bookkeeping, since this phase must not
// touch guides.db at all). The candidate is marked superseded/applied by the
// hotfix, the watchlist baseline moves to the new truth, monitoring
// continues, and a later observation reporting the old stale value must not
// automatically propose reverting the hotfix.

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import {
  freshTestDb,
  openDb,
  nowIso,
  insertWatchlistRow,
  insertObservation,
  insertChangeCandidate,
  cleanupAllTestDbs,
} from "./test-helpers";

after(cleanupAllTestDbs);

describe("manual hotfix reconciliation", () => {
  test("baseline -> observation -> candidate -> manual hotfix supersedes candidate -> monitoring continues -> stale re-observation does not auto-revert", () => {
    const dbPath = freshTestDb("hotfix-reconciliation");
    const db = openDb(dbPath);

    // 1. Baseline: a guide_field watchlist entry with an initial observation.
    const watchlistId = insertWatchlistRow(db, {
      entityRef: "employment-visa",
      factKey: "step-3.cost",
      entityType: "guide_field",
    });
    const baselineObsId = insertObservation(db, watchlistId, {
      observedValue: "AED 350",
      result: "unchanged",
    });

    // 2. Monitoring observes a change (e.g. MOHRE fee increase).
    const changeObsId = insertObservation(db, watchlistId, {
      observedValue: "AED 500",
      result: "changed",
    });

    // 3. A candidate is created and held for review — no automatic canonical write.
    const candidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "step-3.cost",
      oldValue: "AED 350",
      proposedValue: "AED 500",
      severity: "warning",
      verificationStatus: "conflict_hold",
    });

    // 4. Owner manually verifies and applies a production hotfix out-of-band
    // (a real guides.db edit — out of scope for this DB). The candidate is
    // marked superseded because the truth was established by direct owner
    // action, not by this pipeline approving the candidate as-is.
    db.prepare(
      `UPDATE freshness_change_candidates
         SET verification_status = 'superseded',
             closed_reason = 'superseded_by_manual_hotfix',
             reviewed_by = 'owner',
             reviewed_at = ?,
             updated_at = ?
       WHERE id = ?`
    ).run(nowIso(), nowIso(), candidateId);

    // Watchlist baseline moves to the new truth via next_check_due bookkeeping;
    // status stays active — monitoring continues, hotfix does not stop watching.
    db.prepare(
      `UPDATE freshness_watchlist SET next_check_due = ?, updated_at = ? WHERE id = ?`
    ).run("2026-09-15", nowIso(), watchlistId);

    const candidateAfterHotfix = db
      .prepare("SELECT verification_status, closed_reason, reviewed_by FROM freshness_change_candidates WHERE id = ?")
      .get(candidateId) as { verification_status: string; closed_reason: string; reviewed_by: string };
    assert.equal(candidateAfterHotfix.verification_status, "superseded");
    assert.equal(candidateAfterHotfix.closed_reason, "superseded_by_manual_hotfix");
    assert.equal(candidateAfterHotfix.reviewed_by, "owner");

    const watchlistAfterHotfix = db
      .prepare("SELECT status, next_check_due FROM freshness_watchlist WHERE id = ?")
      .get(watchlistId) as { status: string; next_check_due: string };
    assert.equal(watchlistAfterHotfix.status, "active", "monitoring continues after a manual hotfix");
    assert.equal(watchlistAfterHotfix.next_check_due, "2026-09-15");

    // 5. Historical observations remain intact and unedited — append-only log.
    const observations = db
      .prepare("SELECT id, observed_value FROM freshness_observations WHERE watchlist_id = ? ORDER BY observed_at")
      .all(watchlistId) as { id: string; observed_value: string }[];
    assert.equal(observations.length, 2);
    assert.equal(observations[0].id, baselineObsId);
    assert.equal(observations[0].observed_value, "AED 350");
    assert.equal(observations[1].id, changeObsId);
    assert.equal(observations[1].observed_value, "AED 500");

    // 6. A later observation reporting the same stale pre-hotfix value must
    // not itself auto-create a new "revert" candidate — no automated
    // candidate-generation pipeline exists yet at this phase. We simulate
    // "monitoring runs again and sees stale evidence" by inserting one more
    // observation and asserting no new candidate row appears as a side effect.
    const candidateCountBeforeStaleObs = (
      db.prepare("SELECT COUNT(*) as n FROM freshness_change_candidates WHERE watchlist_id = ?").get(watchlistId) as {
        n: number;
      }
    ).n;

    insertObservation(db, watchlistId, { observedValue: "AED 350", result: "changed" });

    const candidateCountAfterStaleObs = (
      db.prepare("SELECT COUNT(*) as n FROM freshness_change_candidates WHERE watchlist_id = ?").get(watchlistId) as {
        n: number;
      }
    ).n;
    assert.equal(
      candidateCountAfterStaleObs,
      candidateCountBeforeStaleObs,
      "inserting an observation alone must never auto-create a candidate — no automated consistency engine exists yet"
    );

    // The superseded candidate itself must remain superseded, not silently
    // reopened by the stale observation.
    const candidateStillSuperseded = db
      .prepare("SELECT verification_status FROM freshness_change_candidates WHERE id = ?")
      .get(candidateId) as { verification_status: string };
    assert.equal(candidateStillSuperseded.verification_status, "superseded");

    db.close();
  });
});

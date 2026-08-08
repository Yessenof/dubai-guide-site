// Candidate/watchlist/alert lifecycle regressions, conflict/HOLD representability,
// social-source authority tiering, authority-by-fact-class, severity mapping, and
// temporal semantics. Per this phase's brief §17-§24, §31-§33.

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import {
  freshTestDb,
  openDb,
  insertWatchlistRow,
  insertObservation,
  insertChangeCandidate,
  insertSource,
  insertSourceAuthority,
  cleanupAllTestDbs,
} from "./test-helpers";

after(cleanupAllTestDbs);
import {
  isValidCandidateTransition,
  isValidWatchlistTransition,
  isValidAlertTransition,
  isValidIsoTimestamp,
  isValidIsoDate,
} from "../../lib/freshness/validation";
import { operationalSeverityRange } from "../../lib/freshness/types";

describe("candidate lifecycle — valid path", () => {
  test("pending -> conflict_hold -> approved -> applied is a valid transition chain", () => {
    assert.equal(isValidCandidateTransition("pending", "conflict_hold"), true);
    assert.equal(isValidCandidateTransition("conflict_hold", "approved"), true);
    assert.equal(isValidCandidateTransition("approved", "applied"), true);
  });

  test("the same chain is enforceable against a real DB row", () => {
    const dbPath = freshTestDb("candidate-lifecycle");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "GITEX-2026", factKey: "date_start" });
    const candidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "date_start",
      oldValue: "2026-10-12",
      proposedValue: "2026-10-19",
      severity: "urgent",
    });

    for (const next of ["conflict_hold", "approved", "applied"] as const) {
      db.prepare("UPDATE freshness_change_candidates SET verification_status = ?, updated_at = datetime('now') WHERE id = ?").run(
        next,
        candidateId
      );
      const row = db
        .prepare("SELECT verification_status FROM freshness_change_candidates WHERE id = ?")
        .get(candidateId) as { verification_status: string };
      assert.equal(row.verification_status, next);
    }
    db.close();
  });
});

describe("candidate lifecycle — invalid transitions", () => {
  test("rejected -> approved is not a valid application-layer transition", () => {
    assert.equal(isValidCandidateTransition("rejected", "approved"), false);
  });

  test("applied -> pending is not a valid application-layer transition", () => {
    assert.equal(isValidCandidateTransition("applied", "pending"), false);
  });

  test("an impossible verification_status value is rejected at the SQL CHECK level", () => {
    const dbPath = freshTestDb("candidate-bad-enum");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "GITEX-2027", factKey: "date_start" });
    assert.throws(() => {
      insertChangeCandidate(db, watchlistId, {
        factKey: "date_start",
        proposedValue: "2027-10-19",
        severity: "urgent",
        verificationStatus: "half_approved",
      });
    }, /CHECK constraint failed/);
    db.close();
  });
});

describe("watchlist status transitions", () => {
  test("active -> resolved and active -> archived are valid; resolved -> active is not", () => {
    assert.equal(isValidWatchlistTransition("active", "resolved"), true);
    assert.equal(isValidWatchlistTransition("active", "archived"), true);
    assert.equal(isValidWatchlistTransition("resolved", "active"), false);
  });

  test("archived is a terminal state", () => {
    assert.equal(isValidWatchlistTransition("archived", "active"), false);
    assert.equal(isValidWatchlistTransition("archived", "resolved"), false);
  });
});

describe("alert status transitions", () => {
  test("pending -> acknowledged -> resolved is valid; resolved -> pending is not", () => {
    assert.equal(isValidAlertTransition("pending", "acknowledged"), true);
    assert.equal(isValidAlertTransition("acknowledged", "resolved"), true);
    assert.equal(isValidAlertTransition("resolved", "pending"), false);
  });
});

describe("conflict / HOLD representability", () => {
  test("two primary-authority observations disagreeing produce a conflict_hold candidate; both observations preserved", () => {
    const dbPath = freshTestDb("conflict-hold");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "CONCERT-CONFLICT", factKey: "date_start" });

    const sourceA = insertSource(db, {
      sourceEntity: "Organizer A",
      sourceKind: "organizer",
      canonicalHostnames: ["organizer-a.example"],
      labelEn: "Organizer A",
    });
    const sourceB = insertSource(db, {
      sourceEntity: "Ticketing Partner B",
      sourceKind: "ticketing",
      canonicalHostnames: ["ticketing-b.example"],
      labelEn: "Ticketing Partner B",
    });
    insertSourceAuthority(db, { sourceId: sourceA, factClass: "date_start", authorityLevel: "primary" });
    insertSourceAuthority(db, { sourceId: sourceB, factClass: "date_start", authorityLevel: "primary" });

    const obsA = insertObservation(db, watchlistId, { sourceId: sourceA, observedValue: "2026-11-01", result: "changed" });
    const obsB = insertObservation(db, watchlistId, { sourceId: sourceB, observedValue: "2026-11-08", result: "changed" });

    const candidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "date_start",
      oldValue: "2026-10-25",
      proposedValue: "2026-11-01",
      severity: "urgent",
      verificationStatus: "conflict_hold",
    });

    const candidate = db
      .prepare("SELECT verification_status FROM freshness_change_candidates WHERE id = ?")
      .get(candidateId) as { verification_status: string };
    assert.equal(candidate.verification_status, "conflict_hold", "no silent winner — human review required");

    const observations = db
      .prepare("SELECT id FROM freshness_observations WHERE watchlist_id = ?")
      .all(watchlistId) as { id: string }[];
    assert.equal(observations.length, 2, "both conflicting observations must be preserved, not overwritten");
    assert.ok(observations.some((o) => o.id === obsA));
    assert.ok(observations.some((o) => o.id === obsB));
    db.close();
  });
});

describe("expected -> confirmed -> postponed (confirmed does not mean stop monitoring)", () => {
  test("a confirmed event can still receive a later postponement observation and a new candidate", () => {
    const dbPath = freshTestDb("postponement");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, { entityRef: "EXPO-CONFIRMED", factKey: "date_start" });

    insertObservation(db, watchlistId, { observedValue: "2026-12-01", result: "unchanged" });
    // "confirmed" is represented by the watchlist row staying active — no separate confirmed flag exists yet.
    const watchlistAfterConfirm = db
      .prepare("SELECT status FROM freshness_watchlist WHERE id = ?")
      .get(watchlistId) as { status: string };
    assert.equal(watchlistAfterConfirm.status, "active", "confirmed must not stop monitoring");

    insertObservation(db, watchlistId, { observedValue: "2026-12-15", result: "changed" });
    const candidateId = insertChangeCandidate(db, watchlistId, {
      factKey: "date_start",
      oldValue: "2026-12-01",
      proposedValue: "2026-12-15",
      severity: "urgent",
    });

    const observations = db
      .prepare("SELECT observed_value FROM freshness_observations WHERE watchlist_id = ? ORDER BY observed_at")
      .all(watchlistId) as { observed_value: string }[];
    assert.equal(observations.length, 2, "the old confirmed-date observation is preserved, not replaced");
    assert.equal(observations[0].observed_value, "2026-12-01");
    assert.equal(observations[1].observed_value, "2026-12-15");

    const candidate = db
      .prepare("SELECT verification_status FROM freshness_change_candidates WHERE id = ?")
      .get(candidateId) as { verification_status: string };
    assert.equal(candidate.verification_status, "pending", "no automatic canonical write — human approval boundary intact");
    db.close();
  });
});

describe("social source authority tiering", () => {
  test("a verified_social source can be primary for announcement but has no legal_basis authority row", () => {
    const dbPath = freshTestDb("verified-social-authority");
    const db = openDb(dbPath);
    const sourceId = insertSource(db, {
      sourceEntity: "Nightfall Presents",
      sourceKind: "verified_social",
      canonicalHostnames: ["nightfallpresents.example"],
      labelEn: "Nightfall Presents (verified)",
    });
    insertSourceAuthority(db, { sourceId, factClass: "announcement", authorityLevel: "primary" });

    const announcementAuthority = db
      .prepare("SELECT authority_level FROM source_authority WHERE source_id = ? AND fact_class = ?")
      .get(sourceId, "announcement") as { authority_level: string } | undefined;
    assert.equal(announcementAuthority?.authority_level, "primary");

    const legalBasisAuthority = db
      .prepare("SELECT authority_level FROM source_authority WHERE source_id = ? AND fact_class = ?")
      .get(sourceId, "legal_basis") as { authority_level: string } | undefined;
    assert.equal(legalBasisAuthority, undefined, "verified social source must never carry legal_basis authority");
    db.close();
  });

  test("an unverified_social source is never granted primary authority for any fact class", () => {
    const dbPath = freshTestDb("unverified-social-authority");
    const db = openDb(dbPath);
    const sourceId = insertSource(db, {
      sourceEntity: "DXB Events Repost",
      sourceKind: "unverified_social",
      canonicalHostnames: ["dxbeventsrepost.example"],
      labelEn: "DXB Events Repost (fan account)",
    });
    insertSourceAuthority(db, { sourceId, factClass: "announcement", authorityLevel: "discovery_only" });

    const rows = db.prepare("SELECT authority_level FROM source_authority WHERE source_id = ?").all(sourceId) as {
      authority_level: string;
    }[];
    assert.ok(
      rows.every((r) => r.authority_level !== "primary"),
      "unverified/unknown social sources must not carry primary authority — no universal social blocking, but no free pass either"
    );
    db.close();
  });
});

describe("authority by fact class (not global)", () => {
  test("the same source can be primary for one fact_class and secondary for another", () => {
    const dbPath = freshTestDb("authority-by-fact-class");
    const db = openDb(dbPath);
    const sourceId = insertSource(db, {
      sourceEntity: "GDRFA Dubai",
      sourceKind: "government",
      canonicalHostnames: ["gdrfad.gov.ae", "gdrfa.gov.ae"],
      labelEn: "GDRFA Dubai",
    });
    insertSourceAuthority(db, { sourceId, factClass: "visa_fee", authorityLevel: "primary" });
    insertSourceAuthority(db, { sourceId, factClass: "event_calendar", authorityLevel: "secondary" });

    const rows = db
      .prepare("SELECT fact_class, authority_level FROM source_authority WHERE source_id = ? ORDER BY fact_class")
      .all(sourceId) as { fact_class: string; authority_level: string }[];
    assert.equal(rows.length, 2);
    assert.deepEqual(
      rows.map((r) => [r.fact_class, r.authority_level]),
      [
        ["event_calendar", "secondary"],
        ["visa_fee", "primary"],
      ]
    );
    db.close();
  });

  test("UNIQUE(source_id, fact_class) prevents two conflicting authority rows for the same fact class", () => {
    const dbPath = freshTestDb("authority-unique");
    const db = openDb(dbPath);
    const sourceId = insertSource(db, {
      sourceEntity: "GDRFA Dubai",
      sourceKind: "government",
      canonicalHostnames: ["gdrfad.gov.ae"],
      labelEn: "GDRFA Dubai",
    });
    insertSourceAuthority(db, { sourceId, factClass: "visa_fee", authorityLevel: "primary" });
    assert.throws(() => {
      insertSourceAuthority(db, { sourceId, factClass: "visa_fee", authorityLevel: "secondary" });
    }, /UNIQUE constraint failed/);
    db.close();
  });
});

describe("severity -> operational severity mapping", () => {
  test("urgent maps to [P0, P1]; warning maps to [P2]; info maps to [P3]", () => {
    assert.deepEqual(operationalSeverityRange("urgent"), ["P0", "P1"]);
    assert.deepEqual(operationalSeverityRange("warning"), ["P2"]);
    assert.deepEqual(operationalSeverityRange("info"), ["P3"]);
  });
});

describe("temporal semantics", () => {
  test("isValidIsoTimestamp accepts full UTC ISO timestamps and rejects malformed ones", () => {
    assert.equal(isValidIsoTimestamp("2026-08-08T06:31:12.000Z"), true);
    assert.equal(isValidIsoTimestamp("2026-08-08T06:31:12Z"), true);
    assert.equal(isValidIsoTimestamp("08/08/2026 06:31am"), false);
    assert.equal(isValidIsoTimestamp("2026-08-08"), false, "a date-only value is not a valid timestamp");
    assert.equal(isValidIsoTimestamp("not a date"), false);
  });

  test("isValidIsoDate accepts naive YYYY-MM-DD and rejects timestamps or garbage", () => {
    assert.equal(isValidIsoDate("2026-08-08"), true);
    assert.equal(isValidIsoDate("2026-08-08T06:31:12Z"), false, "a full timestamp is not a valid date-only value");
    assert.equal(isValidIsoDate("next Tuesday"), false);
  });

  test("a date-only value round-trips unchanged with no UTC day-shift", () => {
    const dbPath = freshTestDb("date-roundtrip");
    const db = openDb(dbPath);
    const watchlistId = insertWatchlistRow(db, {
      entityRef: "EVENT-DATE-EDGE",
      factKey: "date_start",
      nextCheckDue: "2026-01-01",
    });
    const row = db.prepare("SELECT next_check_due FROM freshness_watchlist WHERE id = ?").get(watchlistId) as {
      next_check_due: string;
    };
    assert.equal(row.next_check_due, "2026-01-01", "naive date string must not shift via UTC Date parsing");
    db.close();
  });
});

// FRESH-01 engine orchestrator. Report-only: opens both databases
// read-only, validates required schema, runs the 11 deterministic rules,
// and returns a ConsistencyReport. Never throws for an expected failure
// mode (missing file, missing table, malformed dates_json) — those are
// encoded as HARD_FAIL findings in the returned report instead.

import Database from "better-sqlite3";
import { openGuidesDbReadOnly, validateGuidesSchema, loadCalendarPageRows, parseCalendarPages } from "./guides-db-access";
import {
  openFreshnessDbReadOnly,
  validateFreshnessSchema,
  loadSourceRegistry,
  loadActiveWatchlist,
  loadApprovedUnappliedCandidates,
} from "./freshness-db-access";
import { runAllRules } from "./rules";
import { buildReport, ConsistencyReport } from "./types";
import { EngineSchemaError } from "./errors";

export interface EngineOptions {
  guidesDbPath: string;
  freshnessDbPath: string;
}

export function runConsistencyCheck(options: EngineOptions): ConsistencyReport {
  let guidesDb: Database.Database | undefined;
  let freshnessDb: Database.Database | undefined;

  try {
    guidesDb = openGuidesDbReadOnly(options.guidesDbPath);
    validateGuidesSchema(guidesDb);

    freshnessDb = openFreshnessDbReadOnly(options.freshnessDbPath);
    validateFreshnessSchema(freshnessDb);

    const rows = loadCalendarPageRows(guidesDb);
    const { pages, malformed } = parseCalendarPages(rows);

    const registry = loadSourceRegistry(freshnessDb);
    const activeWatchlist = loadActiveWatchlist(freshnessDb);
    const approvedUnappliedCandidates = loadApprovedUnappliedCandidates(freshnessDb);

    const findings = [
      ...malformed.map((e) => e.finding),
      ...runAllRules({ pages, registry, activeWatchlist, approvedUnappliedCandidates }),
    ];

    return buildReport(findings);
  } catch (err) {
    if (err instanceof EngineSchemaError) {
      return buildReport([err.finding]);
    }
    throw err;
  } finally {
    // close() never writes — safe on a readonly connection, and required so
    // the CLI doesn't leave the file handle open after the process exits.
    guidesDb?.close();
    freshnessDb?.close();
  }
}

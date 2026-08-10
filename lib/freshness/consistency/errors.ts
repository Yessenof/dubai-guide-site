import { ConsistencyFinding } from "./types";

/**
 * Thrown when the engine cannot safely evaluate the supplied corpus at all
 * (missing/unreadable DB file, missing required table/column, corrupted
 * per-page data). Carries the exact HARD_FAIL finding the caller should
 * report — see §17/§18 of the FRESH-01 brief. Distinct from a normal
 * content-rule finding, which never throws.
 */
export class EngineSchemaError extends Error {
  readonly finding: ConsistencyFinding;

  constructor(finding: ConsistencyFinding) {
    super(finding.message);
    this.name = "EngineSchemaError";
    this.finding = finding;
  }
}

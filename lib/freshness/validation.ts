/**
 * Validation layer for freshness.db inputs.
 * Pure TypeScript — no DB access. Mirrors lib/admin-validation/news-events-calendar.ts's
 * style: regex constants, small coercion-free checkers, ValidationResult return shape.
 * No new dependency (no zod) — matches docs/architecture/fresh-00-implementation-plan.md §24.
 */

import {
  AlertStatus,
  ENTITY_TYPES,
  OBSERVATION_RESULTS,
  SEVERITIES,
  VERIFICATION_STATUSES,
  VerificationStatus,
  WatchlistStatus,
  NormalizedObservationInput,
  ChangeCandidateInput,
} from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

const ISO_TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * Real calendar validity, not just parseable-by-Date.parse(). Date.parse
 * (and `new Date(...)`) silently roll an out-of-range day into the next
 * month (e.g. Feb 30 -> Mar 2, Feb 29 in a non-leap year -> Mar 1), so a
 * regex + Date.parse check alone would accept impossible dates. This
 * reconstructs the date from its numeric components and rejects unless the
 * reconstruction reports back the exact same year/month/day — leap years
 * are handled correctly for free because Date.UTC's own day-count rollover
 * follows the standard Gregorian rule.
 */
function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const reconstructed = new Date(Date.UTC(year, month - 1, day));
  return (
    reconstructed.getUTCFullYear() === year &&
    reconstructed.getUTCMonth() === month - 1 &&
    reconstructed.getUTCDate() === day
  );
}

export function isValidIsoTimestamp(v: string): boolean {
  const match = ISO_TIMESTAMP.exec(v);
  if (!match) return false;
  const [, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr] = match;
  if (!isValidCalendarDate(Number(yearStr), Number(monthStr), Number(dayStr))) return false;
  // The regex alone permits 00-99 for each time component — enforce real ranges explicitly.
  return Number(hourStr) <= 23 && Number(minuteStr) <= 59 && Number(secondStr) <= 59;
}

export function isValidIsoDate(v: string): boolean {
  const match = ISO_DATE.exec(v);
  if (!match) return false;
  const [, yearStr, monthStr, dayStr] = match;
  return isValidCalendarDate(Number(yearStr), Number(monthStr), Number(dayStr));
}

function result(errors: string[], warnings: string[] = []): ValidationResult {
  return { ok: errors.length === 0, errors, warnings };
}

// ─── Normalized observation contract (Revision 02.1 §16) ──────────────────
// Strict rejection, no partial acceptance — every check below is a hard
// error, never a coercion. See docs/architecture/freshness-revision-02-plan.md
// §16: "reject (not partially accept) any malformed artifact."

export function validateNormalizedObservation(input: NormalizedObservationInput): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(input.observationId)) {
    errors.push("observationId is required.");
  }

  if (!isNonEmptyString(input.entityType)) {
    errors.push("entityType is required.");
  } else if (!(ENTITY_TYPES as readonly string[]).includes(input.entityType)) {
    errors.push(`entityType "${input.entityType}" is not one of: ${ENTITY_TYPES.join(", ")}.`);
  }

  if (!isNonEmptyString(input.entityRef)) {
    errors.push("entityRef is required.");
  }

  if (!isNonEmptyString(input.factKey)) {
    errors.push("factKey is required.");
  }

  if (!isNonEmptyString(input.sourceRef)) {
    errors.push("sourceRef is required — an observation must always cite the source it queried.");
  }

  if (!isNonEmptyString(input.observedAt)) {
    errors.push("observedAt is required.");
  } else if (!isValidIsoTimestamp(input.observedAt)) {
    errors.push(`observedAt "${input.observedAt}" is not a valid ISO timestamp (expected YYYY-MM-DDTHH:MM:SSZ).`);
  }

  if (input.publishedAt !== undefined && input.publishedAt !== "" && !isValidIsoTimestamp(input.publishedAt)) {
    errors.push(`publishedAt "${input.publishedAt}" is not a valid ISO timestamp.`);
  }

  if (
    input.effectiveAt !== undefined &&
    input.effectiveAt !== "" &&
    !isValidIsoTimestamp(input.effectiveAt) &&
    !isValidIsoDate(input.effectiveAt)
  ) {
    errors.push(`effectiveAt "${input.effectiveAt}" is neither a valid ISO timestamp nor a valid date-only value.`);
  }

  if (!isNonEmptyString(input.result)) {
    errors.push("result is required.");
  } else if (!(OBSERVATION_RESULTS as readonly string[]).includes(input.result)) {
    errors.push(`result "${input.result}" is not one of: ${OBSERVATION_RESULTS.join(", ")}.`);
  }

  return result(errors);
}

// ─── Change candidate input ────────────────────────────────────────────────

export function validateChangeCandidateInput(input: ChangeCandidateInput): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(input.factKey)) {
    errors.push("factKey is required.");
  }

  if (!isNonEmptyString(input.proposedValue)) {
    errors.push("proposedValue is required.");
  }

  if (!isNonEmptyString(input.severity)) {
    errors.push("severity is required.");
  } else if (!(SEVERITIES as readonly string[]).includes(input.severity)) {
    errors.push(`severity "${input.severity}" is malformed — not one of: ${SEVERITIES.join(", ")}.`);
  }

  if (input.verificationStatus !== undefined && input.verificationStatus !== "") {
    if (!(VERIFICATION_STATUSES as readonly string[]).includes(input.verificationStatus)) {
      errors.push(
        `verificationStatus "${input.verificationStatus}" is malformed — not one of: ${VERIFICATION_STATUSES.join(", ")}.`
      );
    }
  }

  return result(errors);
}

// ─── State machines (FRESH-00 implementation plan §14) ────────────────────
// SQL CHECK constraints only guarantee a column holds *a* valid enum value —
// they cannot see the previous row value on UPDATE. Transition legality is
// enforced here, at the application layer, by design (fresh-00-implementation-plan.md §7/§14).

const WATCHLIST_TRANSITIONS: Record<WatchlistStatus, WatchlistStatus[]> = {
  active: ["resolved", "archived"],
  resolved: ["archived"],
  archived: [],
};

export function isValidWatchlistTransition(from: WatchlistStatus, to: WatchlistStatus): boolean {
  return WATCHLIST_TRANSITIONS[from].includes(to);
}

const CANDIDATE_TRANSITIONS: Record<VerificationStatus, VerificationStatus[]> = {
  pending: ["conflict_hold", "approved", "rejected", "superseded"],
  conflict_hold: ["approved", "rejected", "superseded"],
  approved: ["applied", "superseded"],
  rejected: [],
  applied: [],
  superseded: [],
};

export function isValidCandidateTransition(from: VerificationStatus, to: VerificationStatus): boolean {
  return CANDIDATE_TRANSITIONS[from].includes(to);
}

const ALERT_TRANSITIONS: Record<AlertStatus, AlertStatus[]> = {
  pending: ["acknowledged", "resolved"],
  acknowledged: ["resolved"],
  resolved: [],
};

export function isValidAlertTransition(from: AlertStatus, to: AlertStatus): boolean {
  return ALERT_TRANSITIONS[from].includes(to);
}

// ─── Source identity registry lookup (test-model scope) ───────────────────
// This is a narrow, deterministic registry lookup — NOT the multi-rule-class
// Consistency Engine (Revision 02.1 §15 / FRESH-01's qa-consistency-check.ts,
// which runs against production guides.db with severity-tiered rule classes).
// It exists so the AUG-NEW-02 regression class (this phase's brief §13) is
// representable and testable now, without building the production engine.

export interface SourceRegistryEntry {
  sourceEntity: string;
  canonicalHostnames: string[];
  labelEn: string;
  labelRu?: string;
}

export type SourceIdentityCheck =
  | { status: "MATCH"; sourceEntity: string }
  | { status: "SOURCE_IDENTITY_MISMATCH"; reason: string }
  | { status: "SOURCE_NOT_REGISTERED"; reason: string };

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function hostnameOwnedBy(hostname: string, canonicalHostnames: string[]): boolean {
  return canonicalHostnames.some((registered) => {
    const h = registered.toLowerCase();
    return hostname === h || hostname.endsWith(`.${h}`);
  });
}

/**
 * Deterministic registry lookup: does `labelEn`/`labelRu` correctly identify
 * the source entity that owns `url`'s hostname? A syntactically valid URL is
 * not sufficient — the label must match the entity actually registered for
 * that hostname. Generalizes the AUG-NEW-02 bug class (Revision 02.1 §7).
 */
export function checkSourceIdentity(
  url: string,
  labelEn: string,
  registry: SourceRegistryEntry[],
  labelRu?: string
): SourceIdentityCheck {
  const hostname = hostnameOf(url);
  if (!hostname) {
    return { status: "SOURCE_IDENTITY_MISMATCH", reason: `"${url}" is not a valid URL.` };
  }

  const owner = registry.find((entry) => hostnameOwnedBy(hostname, entry.canonicalHostnames));

  if (!owner) {
    return {
      status: "SOURCE_NOT_REGISTERED",
      reason: `No registered source entity owns hostname "${hostname}".`,
    };
  }

  const enMatches = owner.labelEn === labelEn;
  const ruMatches = !labelRu || !owner.labelRu ? true : owner.labelRu === labelRu;

  if (!enMatches || !ruMatches) {
    return {
      status: "SOURCE_IDENTITY_MISMATCH",
      reason:
        `Hostname "${hostname}" is registered to "${owner.sourceEntity}" (label_en="${owner.labelEn}"` +
        `${owner.labelRu ? `, label_ru="${owner.labelRu}"` : ""}), but the record claims ` +
        `label_en="${labelEn}"${labelRu ? `, label_ru="${labelRu}"` : ""} — label does not match the registered entity.`,
    };
  }

  return { status: "MATCH", sourceEntity: owner.sourceEntity };
}

// Strict-rejection tests for the normalized observation contract (§11 of
// this phase's brief). No silent coercion — every malformed case must fail
// loudly with a clear error.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { validateNormalizedObservation } from "../../lib/freshness/validation";
import { NormalizedObservationInput } from "../../lib/freshness/types";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

interface NormalizedObservationsFixture {
  valid: NormalizedObservationInput;
  malformed: { caseName: string; input: NormalizedObservationInput }[];
}

function loadFixture(): NormalizedObservationsFixture {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, "normalized-observations.json"), "utf8"));
}

const fixture = loadFixture();

describe("validateNormalizedObservation — valid case", () => {
  test("a fully-formed normalized observation passes with no errors", () => {
    const result = validateNormalizedObservation(fixture.valid);
    assert.equal(result.ok, true);
    assert.deepEqual(result.errors, []);
  });
});

describe("validateNormalizedObservation — malformed cases", () => {
  for (const { caseName, input } of fixture.malformed) {
    test(`rejects: ${caseName}`, () => {
      const result = validateNormalizedObservation(input);
      assert.equal(result.ok, false, `expected "${caseName}" to fail validation`);
      assert.ok(result.errors.length > 0, `expected "${caseName}" to produce at least one error message`);
    });
  }

  test("all six mandatory malformed cases from the fixture are actually exercised", () => {
    assert.equal(fixture.malformed.length, 6);
  });
});

describe("validateNormalizedObservation — no silent coercion", () => {
  test("an empty object is rejected with multiple distinct errors, not defaulted", () => {
    const result = validateNormalizedObservation({});
    assert.equal(result.ok, false);
    assert.ok(result.errors.length >= 5, "missing observationId, entityType, entityRef, factKey, sourceRef, observedAt should each surface");
  });

  test("whitespace-only strings are treated as absent, not as valid values", () => {
    const result = validateNormalizedObservation({
      observationId: "   ",
      entityType: "calendar_item",
      entityRef: "X",
      factKey: "date",
      sourceRef: "src-1",
      observedAt: "2026-08-08T06:31:12Z",
      result: "unchanged",
    });
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes("observationId")));
  });
});

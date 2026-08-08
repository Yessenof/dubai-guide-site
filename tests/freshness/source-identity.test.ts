// AUG-NEW-02 source-identity regression class, source/CTA role separation,
// redirect/alias identity stability, and social-source discovery-vs-authority
// contrast. Per this phase's brief §13/§14/§26/§27/§30.
//
// checkSourceIdentity() is a narrow test-model registry lookup, deliberately
// distinct from FRESH-01's full Consistency Engine — see the doc comment in
// lib/freshness/validation.ts. It proves the data model CAN represent and
// reject this bug class now; it is not the production detection pipeline.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { checkSourceIdentity, SourceRegistryEntry } from "../../lib/freshness/validation";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

function loadFixture<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, name), "utf8")) as T;
}

const registry = loadFixture<SourceRegistryEntry[]>("sources-seed.json");

interface AugNew02Fixture {
  recordId: string;
  sourceUrl: string;
  sourceLabelEn: string;
  sourceLabelRu: string;
}

describe("AUG-NEW-02 regression — bad case", () => {
  test("a label claiming u.ae but registered under a different entity name fails as SOURCE_IDENTITY_MISMATCH", () => {
    const bad = loadFixture<AugNew02Fixture>("aug-new-02-bad.json");
    const check = checkSourceIdentity(bad.sourceUrl, bad.sourceLabelEn, registry);
    assert.equal(
      check.status,
      "SOURCE_IDENTITY_MISMATCH",
      "must not pass merely because the URL is syntactically valid — the label does not match the registered entity"
    );
  });
});

describe("AUG-NEW-02 regression — good case", () => {
  test("the corrected EN+RU labels for u.ae resolve to MATCH", () => {
    const good = loadFixture<AugNew02Fixture>("aug-new-02-good.json");
    const check = checkSourceIdentity(good.sourceUrl, good.sourceLabelEn, registry, good.sourceLabelRu);
    assert.equal(check.status, "MATCH");
    if (check.status === "MATCH") {
      assert.equal(check.sourceEntity, "UAE Government Portal");
    }
  });
});

describe("AUG-NEW-02 regression — RU-drift variant", () => {
  test("a correct EN label paired with a stale/incorrect RU label still fails identity", () => {
    const ruMismatch = loadFixture<AugNew02Fixture>("aug-new-02-ru-mismatch.json");
    const check = checkSourceIdentity(ruMismatch.sourceUrl, ruMismatch.sourceLabelEn, registry, ruMismatch.sourceLabelRu);
    assert.equal(
      check.status,
      "SOURCE_IDENTITY_MISMATCH",
      "EN alone matching is not sufficient — multilingual labels must both resolve to the same registered entity"
    );
  });
});

describe("source URL vs CTA URL role separation", () => {
  test("checkSourceIdentity only ever inspects the evidence/source URL — there is no ctaUrl parameter to compare against", () => {
    // This is a structural guarantee, not a runtime branch: the function
    // signature has no ctaUrl parameter, so a differing cta_url (e.g. a
    // ticketing deep link) can never be compared against source identity.
    // Demonstrate with a real case: Platinumlist is the evidence source,
    // Coca-Cola Arena would be a plausible (different) CTA target — both
    // resolve independently and correctly, proving no false equality rule exists.
    const sourceCheck = checkSourceIdentity("https://platinumlist.net/event/12345", "Platinumlist", registry);
    assert.equal(sourceCheck.status, "MATCH");
    if (sourceCheck.status === "MATCH") {
      assert.equal(sourceCheck.sourceEntity, "Platinumlist");
    }

    const differentCtaTargetCheck = checkSourceIdentity(
      "https://coca-colaarena.com/events/example",
      "Coca-Cola Arena",
      registry
    );
    assert.equal(
      differentCtaTargetCheck.status,
      "MATCH",
      "a differing CTA-style URL must resolve on its own identity, never be forced to equal the source URL's entity"
    );
  });
});

describe("source redirect / alias identity stability", () => {
  test("GDRFA Dubai's two registered hostnames both resolve to the same stable entity", () => {
    const viaPrimaryHostname = checkSourceIdentity(
      "https://gdrfad.gov.ae/en/services/visa-renewal",
      "GDRFA Dubai",
      registry
    );
    const viaAliasHostname = checkSourceIdentity(
      "https://gdrfa.gov.ae/en/services/visa-renewal",
      "GDRFA Dubai",
      registry
    );
    assert.equal(viaPrimaryHostname.status, "MATCH");
    assert.equal(viaAliasHostname.status, "MATCH");
    if (viaPrimaryHostname.status === "MATCH" && viaAliasHostname.status === "MATCH") {
      assert.equal(
        viaPrimaryHostname.sourceEntity,
        viaAliasHostname.sourceEntity,
        "identity is stable through registry hostname aliasing — exact URL-string equality is not required"
      );
    }
  });
});

describe("annual edition collision — display title is not identity", () => {
  test("the source registry lookup is independent of any edition/year text in the label", () => {
    // GITEX 2026 vs GITEX 2027 would be two distinct watchlist entity_ref
    // values (proven in schema.test.ts's annual-edition-collision case).
    // Here we confirm source identity resolution itself has no year-parsing
    // behavior that could accidentally couple to an edition string.
    const check2026 = checkSourceIdentity("https://platinumlist.net/event/gitex-2026", "Platinumlist", registry);
    const check2027 = checkSourceIdentity("https://platinumlist.net/event/gitex-2027", "Platinumlist", registry);
    assert.equal(check2026.status, "MATCH");
    assert.equal(check2027.status, "MATCH");
  });
});

describe("verified first-party social source — discovery eligibility vs publication eligibility", () => {
  test("a verified_social source resolves MATCH — social sources are not universally blocked", () => {
    const nightfall = checkSourceIdentity(
      "https://nightfallpresents.example/events/rooftop-session",
      "Nightfall Presents (verified organizer)",
      registry
    );
    assert.equal(nightfall.status, "MATCH");

    const venue = checkSourceIdentity("https://theyarddubai.com/whats-on", "The Yard Dubai", registry);
    assert.equal(venue.status, "MATCH");
  });
});

describe("third-party / unknown social contrast", () => {
  test("an unverified_social account still resolves identity (it is registered) but is a distinct source_kind — not identical authority semantics to verified", () => {
    const dxbRepost = registry.find((r) => r.sourceEntity.startsWith("DXB Events Repost"));
    assert.ok(dxbRepost, "fixture must include the unverified_social contrast entry");

    const check = checkSourceIdentity(
      "https://dxbeventsrepost.example/p/12345",
      "DXB Events Repost (fan account)",
      registry
    );
    assert.equal(check.status, "MATCH", "identity resolution succeeds — this is not a universal social block");

    // Authority-level differentiation (verified_social vs unverified_social
    // source_kind, and primary-authority eligibility) is proven at the DB
    // level in lifecycle.test.ts's "social source authority tiering" suite.
  });

  test("a completely unregistered hostname is SOURCE_NOT_REGISTERED, not silently treated as a match", () => {
    const check = checkSourceIdentity("https://totally-unknown-domain.example/post/1", "Some Rando Account", registry);
    assert.equal(check.status, "SOURCE_NOT_REGISTERED");
  });
});

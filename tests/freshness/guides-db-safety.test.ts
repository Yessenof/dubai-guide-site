// Mandatory P0 regression (this phase's brief §41) for the guides.db safety
// guard in lib/freshness/path-safety.ts. This was a previous P0 fix — it
// must not exist only as a one-off manual QA result, so it is pinned here
// as an automated, repeatable test.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { assertSafeFreshnessDbPath, resolveRealPathBestEffort } from "../../lib/freshness/path-safety";

function tempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), `guidex-safety-test-${prefix}-`));
}

describe("assertSafeFreshnessDbPath — exact name", () => {
  test("rejects the exact 'data/guides.db' path unconditionally", () => {
    assert.throws(() => assertSafeFreshnessDbPath(path.join(process.cwd(), "data", "guides.db")));
  });

  test("rejects a bare 'guides.db' filename resolved relative to an arbitrary existing directory", () => {
    const dir = tempDir("bare-name");
    assert.throws(() => assertSafeFreshnessDbPath(path.join(dir, "guides.db")));
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("accepts a legitimate freshness.db-style path without throwing", () => {
    const dir = tempDir("legit");
    assert.doesNotThrow(() => assertSafeFreshnessDbPath(path.join(dir, "freshness.db")));
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe("assertSafeFreshnessDbPath — case-insensitive filesystem", () => {
  test("rejects a case-variant path when the filesystem is actually case-insensitive", () => {
    const dir = tempDir("case-check");
    const lower = path.join(dir, "probe-guidex-case-check.tmp");
    fs.writeFileSync(lower, "x");
    const upperVariant = path.join(dir, "PROBE-GUIDEX-CASE-CHECK.tmp");
    const filesystemIsCaseInsensitive = fs.existsSync(upperVariant);

    if (filesystemIsCaseInsensitive) {
      assert.throws(() => assertSafeFreshnessDbPath(path.join(dir, "GUIDES.DB")));
      assert.throws(() => assertSafeFreshnessDbPath(path.join(dir, "Guides.db")));
    } else {
      // Case-sensitive filesystem (e.g. most Linux CI runners): a differently
      // cased filename is a genuinely different file, so no rejection is
      // expected here — the exact-name test above already covers the
      // mandatory unconditional case.
      assert.doesNotThrow(() => assertSafeFreshnessDbPath(path.join(dir, "GUIDES.DB")));
    }

    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe("assertSafeFreshnessDbPath — symlink alias", () => {
  test("rejects a symlink under a different name pointing at a file literally named guides.db", () => {
    const dir = tempDir("symlink");
    const realGuidesDb = path.join(dir, "guides.db");
    fs.writeFileSync(realGuidesDb, "");
    const aliasPath = path.join(dir, "totally-innocent-name.db");

    let symlinkSupported = true;
    try {
      fs.symlinkSync(realGuidesDb, aliasPath);
    } catch {
      symlinkSupported = false;
    }

    if (symlinkSupported) {
      assert.throws(
        () => assertSafeFreshnessDbPath(aliasPath),
        "a symlink aliasing a file literally named guides.db must still be rejected once resolved"
      );
    }

    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("rejects a symlinked directory whose target ancestor is the repo's real data/ directory containing guides.db", () => {
    const repoGuidesDb = path.join(process.cwd(), "data", "guides.db");
    if (!fs.existsSync(path.dirname(repoGuidesDb))) {
      // data/ directory not present in this checkout state — nothing to alias.
      return;
    }

    const dir = tempDir("symlink-dir");
    const aliasDir = path.join(dir, "data-alias");

    let symlinkSupported = true;
    try {
      fs.symlinkSync(path.dirname(repoGuidesDb), aliasDir);
    } catch {
      symlinkSupported = false;
    }

    if (symlinkSupported) {
      assert.throws(() => assertSafeFreshnessDbPath(path.join(aliasDir, "guides.db")));
    }

    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe("resolveRealPathBestEffort", () => {
  test("resolves a not-yet-existing tail path by walking up to the nearest existing ancestor", () => {
    const dir = tempDir("not-yet-existing");
    const notYetCreated = path.join(dir, "future-subdir", "freshness.db");
    const resolved = resolveRealPathBestEffort(notYetCreated);
    assert.equal(path.basename(resolved), "freshness.db");
    assert.ok(resolved.includes(path.basename(dir)), "resolved path must still be anchored under the real temp dir");
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test("resolves an existing path to itself modulo symlinks", () => {
    const dir = tempDir("existing");
    const filePath = path.join(dir, "freshness.db");
    fs.writeFileSync(filePath, "");
    const resolved = resolveRealPathBestEffort(filePath);
    assert.equal(fs.realpathSync(filePath), resolved);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

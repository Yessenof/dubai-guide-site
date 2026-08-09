// Local safety helpers for scripts/backfill-calendar-item-ids-local.ts.
// Kept as pure, independently testable functions (no top-level side effects,
// no CLI parsing) so tests/freshness/backfill-calendar-item-ids.test.ts can
// exercise every branch directly without spawning the CLI script.
//
// This module does not modify or duplicate lib/freshness/path-safety.ts --
// it composes with resolveRealPathBestEffort() from that file (imported by
// the CLI script), and only adds logic that is specific to this backfill
// (protected-root containment, corpus duplicate detection, exclusive-create
// backups) and has no equivalent there.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ---- Production-path guard ---------------------------------------------------

export const PRODUCTION_ROOTS = ["/var/www", "/var/app", "/srv/www"];

/**
 * True if `resolvedPath` is exactly `root` or a path-segment descendant of
 * it. Case-insensitive. Deliberately NOT a substring/`.includes()` check --
 * that would both miss a case-variant root and false-positive on an
 * unrelated sibling directory that merely shares a text prefix (e.g.
 * "/var/www-old" must NOT match root "/var/www").
 */
export function isUnderProtectedRoot(resolvedPath: string, root: string): boolean {
  const normalizedPath = resolvedPath.toLowerCase();
  const normalizedRoot = root.toLowerCase().replace(/\/+$/, "");
  return normalizedPath === normalizedRoot || normalizedPath.startsWith(normalizedRoot + path.sep);
}

// ---- Corpus duplicate detection ----------------------------------------------

/** Returns each value that appears more than once in `values`, deduplicated. */
export function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([v]) => v);
}

// ---- Exclusive-create backup --------------------------------------------------

export function defaultBackupFileName(): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = crypto.randomBytes(4).toString("hex");
  return `guides-db-pre-id-backfill-${ts}-${rand}.db`;
}

/**
 * Copies `sourcePath` into `backupDir` under a generated name, using
 * fs.constants.COPYFILE_EXCL so the OS refuses the copy outright if the
 * destination already exists -- there is no separate existence check to
 * race against (TOCTOU-safe), and an existing backup file is never
 * overwritten. On an EEXIST collision, a fresh name is generated and
 * retried up to `maxAttempts` times before throwing.
 */
export function createExclusiveBackup(
  sourcePath: string,
  backupDir: string,
  opts: { nameGenerator?: () => string; maxAttempts?: number } = {}
): string {
  const nameGenerator = opts.nameGenerator ?? defaultBackupFileName;
  const maxAttempts = opts.maxAttempts ?? 5;

  fs.mkdirSync(backupDir, { recursive: true });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = path.join(backupDir, nameGenerator());
    try {
      fs.copyFileSync(sourcePath, candidate, fs.constants.COPYFILE_EXCL);
      return candidate;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "EEXIST") continue;
      throw err;
    }
  }
  throw new Error(`Could not create a unique backup filename in "${backupDir}" after ${maxAttempts} attempts.`);
}

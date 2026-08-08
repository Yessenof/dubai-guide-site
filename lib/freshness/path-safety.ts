// Shared guard: refuses any target path that resolves to the real content
// database. Used by every scripts/freshness/*.ts entrypoint that opens a
// database file, before that file is ever opened.
//
// The old per-script guard compared path.basename() of the raw CLI string
// against the literal text "guides.db". That is bypassable two ways:
//   - a symlink under any other name pointing at the real guides.db
//     (better-sqlite3 follows symlinks transparently)
//   - a differently-cased path ("GUIDES.DB", "Guides.db") on a
//     case-insensitive filesystem (macOS/Windows default), which the OS
//     resolves to the exact same on-disk file as "guides.db"
// This guard instead resolves the target to its real, symlink-free,
// OS-canonicalized absolute path first, and only then inspects it — so
// aliasing tricks are resolved away before the safety decision is made.

import fs from "node:fs";
import path from "node:path";

const PROTECTED_BASENAME = "guides.db";

/**
 * Resolves `targetPath` to its real, symlink-free absolute path, even when
 * the final path component does not exist yet (freshness.db is created by
 * migrate.ts on first run, so a plain fs.realpathSync would throw ENOENT).
 * Walks up to the nearest existing ancestor, resolves that ancestor with
 * fs.realpathSync (following any symlinked directories in the chain,
 * including a symlinked parent directory), then re-appends the tail that
 * doesn't exist yet.
 */
export function resolveRealPathBestEffort(targetPath: string): string {
  const absolute = path.resolve(targetPath);

  let existingAncestor = absolute;
  const missingTail: string[] = [];

  while (!fs.existsSync(existingAncestor)) {
    const parent = path.dirname(existingAncestor);
    if (parent === existingAncestor) {
      // Walked all the way to the filesystem root and found nothing real.
      return absolute;
    }
    missingTail.unshift(path.basename(existingAncestor));
    existingAncestor = parent;
  }

  const resolvedAncestor = fs.realpathSync(existingAncestor);
  return missingTail.length > 0 ? path.join(resolvedAncestor, ...missingTail) : resolvedAncestor;
}

/**
 * Throws if `dbPath` resolves — after following symlinks, normalizing
 * relative segments, and ignoring case — to the protected content
 * database. Must be called before any database library opens the path.
 */
export function assertSafeFreshnessDbPath(dbPath: string): void {
  const resolved = resolveRealPathBestEffort(dbPath);
  const resolvedBasename = path.basename(resolved).toLowerCase();

  if (resolvedBasename === PROTECTED_BASENAME) {
    throw new Error(
      `Refusing to use path "${dbPath}" — it resolves to real path "${resolved}", whose ` +
        `filename matches the protected content database ("${PROTECTED_BASENAME}") once ` +
        "symlinks, relative segments, and case are resolved away. This tool is for " +
        "freshness.db only and must never touch the guides database."
    );
  }

  const repoGuidesDb = resolveRealPathBestEffort(path.join(process.cwd(), "data", PROTECTED_BASENAME));
  if (resolved === repoGuidesDb) {
    throw new Error(
      `Refusing to use path "${dbPath}" — it resolves to the repository's real content ` +
        `database at "${repoGuidesDb}". This tool is for freshness.db only and must never ` +
        "touch the guides database."
    );
  }
}

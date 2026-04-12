# Checkpoints — Dubai Guide Site

Stable, verified milestones. Each entry represents a state the project can be
safely restored to or continued from. Add a new entry only after full verification.

---

## CP-03 — Phase 3A complete

**Date:** 2026-04-12
**Branch/commit:** uncommitted (Phase 3A verification pass complete)

**What is confirmed stable:**
- Guide CRUD: create, edit, save draft, save and publish, unpublish, delete
- Single-form intent pattern: field edits and publish happen in one DB write
- Unsaved-changes guard: dirty tracking, `beforeunload`, back-nav confirm dialog
- Success banner: shows on save redirect, auto-hides after 3s
- React key correctness: no duplicate sibling keys anywhere
- ISR revalidation: public page updates immediately after admin save
- Build: clean — 0 errors, 0 TypeScript errors, 0 deprecation warnings, 11/11 pages

**What was verified:**
- SQLite write paths tested programmatically: save draft preserves published,
  unpublish sets published=0, save and publish atomically sets field + published=1
- Public page curl confirmed returning updated content after DB write
- Static code audit: only one `key={saved ?? "init"}` in the codebase
  (on outer `<GuideEditForm>` in the page — inner elements carry no keys)
- `npm run build` output reviewed line by line — no warnings

**Known state going in:**
- 1 guide seeded: `employment-visa` (published)
- Steps table exists and public page renders steps; no admin step UI yet
- RU fields in DB and admin form; public site renders EN only

**Phase next:** Phase 4 — step management in the admin

---

## CP-02 — Phase 2 complete (admin foundation)

**Date:** 2026-04-12

**What is confirmed stable:**
- NextAuth.js v4 credentials login working
- Route protection via `proxy.ts` working
- Admin layout isolated from public site
- Guide list page shows all guides (draft + published)
- bcrypt auth bug fixed (dotenv-expand `$` escaping)
- `middleware.ts` → `proxy.ts` migration done

**Phase next:** Phase 3A — guide CRUD

---

## CP-01 — Phase 1 complete (SQLite migration)

**Date:** 2026-04-12

**What is confirmed stable:**
- All guide data migrated from MDX to SQLite
- Public site renders identically to pre-migration state
- Zero SEO regression — same URLs, same HTML output
- Employment-visa guide seeded with all steps
- MDX files and metadata.ts retired

**Phase next:** Phase 2 — admin foundation

# Session Log — Dubai Guide Site

Reverse chronological. One entry per meaningful implementation step.
Trivial edits (typos, comment fixes) do not get entries.

---

## 2026-04-12 — Memory system and Phase 3A checkpoint

**What changed:**
- Created project-memory workflow: `NEW_CHAT_TRANSFER.txt`, `SESSION_LOG.md`,
  `CHECKPOINTS.md`, `PROJECT_STATE.md`, `DECISIONS.md`, `ROADMAP.md`,
  `SEO_STRATEGY.md`, `HANDOFF_PROMPT.md`
- Added Claude Code hook in `.claude/settings.json` + `.claude/memory-guard.sh`
  to warn when source files change without memory file updates
- Updated `CLAUDE.md` with project-memory maintenance rule, category taxonomy,
  language rules, React key rule

**What was verified:**
- Production build: clean (0 errors, 0 warnings, 11/11 pages)
- SQLite write paths: save draft, unpublish, save and publish — all confirmed correct
- React key audit: no duplicate sibling keys anywhere in the codebase
- Public page reads fresh data from SQLite after a DB write

**Next step:** Phase 4 — step management in the admin

---

## 2026-04-12 — Fix duplicate React key warning

**What changed:**
- Removed `key={savedTs}` from `<SavedBanner>` inside `GuideEditForm`
- Removed `key={savedTs ?? "init"}` from `<form>` inside `GuideEditForm`
- Removed now-unnecessary `useEffect` that manually cleared dirty state
- Root cause: both siblings had value `savedTs` when it was set — collided

**What was verified:**
- Static code audit: only one `key={saved ?? "init"}` remains, on the outer
  `<GuideEditForm>` in the page — inner elements carry no keys
- Production build: clean

**Next step:** Phase 3A verification pass + checkpoint

---

## 2026-04-12 — Fix owner-workflow publish bug (Phase 3A complete)

**What changed:**
- Merged separate Publish form into the main edit form using `name="intent"`
  (`value="draft"` and `value="publish"` submit buttons)
- `updateGuideAction` now reads `intent` and spreads `{ published: true }` when
  `intent === "publish"`
- Unpublish remains a safe standalone form (no field data at risk)
- Created `components/admin/GuideEditForm.tsx` (client component):
  dirty tracking via `useRef` + `useState`, `beforeunload` guard, back-nav
  confirm dialog, "Unsaved changes" indicator
- Simplified `app/admin/guides/[slug]/page.tsx` to thin server component
- Updated `CLAUDE.md` with Admin QA Rules section

**What was verified:**
- Publish no longer discards unsaved field edits
- Save draft preserves published state correctly

**Next step:** Fix the React key bug introduced by this change

---

## 2026-04-12 — Fix stale defaultValue after save redirect

**What changed:**
- `updateGuideAction` redirects to `/admin/guides/${slug}?saved=${Date.now()}`
  (timestamp forces URL change on every save)
- Edit page passes `key={saved ?? "init"}` to `<GuideEditForm>` so the
  component fully remounts when the URL changes
- Added `SavedBanner` component (3s auto-hide green success banner)

**What was verified:**
- After saving, the edit form shows the newly saved values (not stale inputs)
- DB write was always correct — this was a React rendering issue only

**Next step:** Fix publish discarding unsaved changes

---

## 2026-04-12 — Phase 3A: Guide CRUD

**What changed:**
- `app/admin/guides/new/page.tsx` + `createGuideAction`
- `app/admin/guides/[slug]/page.tsx` + `updateGuideAction`, `setPublishedAction`,
  `deleteGuideAction`
- `components/admin/GuideFormFields.tsx` (shared field inputs, server component)
- `components/admin/DeleteGuideButton.tsx`
- `lib/revalidate.ts` — calls `revalidatePath` for guide + list + home after save
- ISR on-demand revalidation wired to every save action

**What was verified:**
- Create guide → appears in guide list → publishes to public site
- Edit guide → public page updates after save
- Delete guide → redirects to list, public page gone

**Next step:** Fix stale defaultValue on same-URL redirect

---

## 2026-04-12 — Rename middleware.ts → proxy.ts

**What changed:**
- Renamed `middleware.ts` to `proxy.ts` (Next.js 16 convention)

**What was verified:**
- Build no longer shows deprecation warning
- Route protection still works

---

## 2026-04-12 — Fix bcrypt hash corruption by dotenv-expand

**What changed:**
- Escaped all `$` as `\$` in `ADMIN_PASSWORD_HASH` in `.env.local`
- Added `scripts/debug-auth.ts` — reads `.env.local` raw, bypasses dotenv-expand,
  calls `bcryptjs.compare()` for diagnosis

**What was verified:**
- `debug-auth.ts` confirmed hash length 60, `starts with $2b$: true`
- Admin login works correctly

---

## 2026-04-12 — Phase 2: Admin foundation

**What changed:**
- `lib/auth.ts` — NextAuth.js v4 + CredentialsProvider + bcryptjs
- `app/admin/layout.tsx` — isolated layout, no public Header
- `app/admin/login/page.tsx` — credentials form with `signIn`
- `app/admin/guides/page.tsx` — lists all guides (draft + published)
- `proxy.ts` — route protection for `/admin/guides` and subpaths
- `scripts/generate-hash.ts` — generates bcrypt hash for `.env.local`

**What was verified:**
- Login works with correct credentials
- Wrong credentials show error
- `/admin/guides` redirects to login when unauthenticated

**Next step:** Phase 3A — guide CRUD

---

## 2026-04-12 — Phase 1: SQLite migration

**What changed:**
- Installed `better-sqlite3`, `drizzle-orm`, `drizzle-kit`, `@types/better-sqlite3`
- `lib/db/schema.ts` — Drizzle schema (guides + steps, bilingual flat columns)
- `lib/db/connection.ts` — SQLite singleton (WAL mode, FK enforcement)
- `lib/db/reader.ts` — public read-only queries
- `lib/db/writer.ts` — admin queries
- `scripts/seed.ts` — seeded employment-visa guide from old MDX
- Updated public guide page to render from DB
- Deleted MDX files, `metadata.ts`, `@next/mdx` config
- Added `serverExternalPackages: ["better-sqlite3"]` to `next.config.ts`

**What was verified:**
- Public site output identical before and after migration
- Employment-visa guide renders correctly from SQLite
- Build clean, zero SEO regression

**Next step:** Phase 2 — admin foundation

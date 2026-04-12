# Handoff Prompt — Dubai Guide Site

Paste this into a new chat to continue this project with minimal context loss.

---

## Prompt to paste

I'm working on a Next.js website called Dubai Guide. It's a premium, mobile-first content site that helps expats and entrepreneurs understand Dubai procedures (visas, company setup, hiring, relocation). It's not a web app — it's a content site with an owner-only admin panel.

Please read these files first before doing anything else:

1. `CLAUDE.md` — permanent project rules (architecture, admin QA rules, language rules, memory maintenance rule)
2. `PROJECT_STATE.md` — current project status, what's built, what's not, current blockers
3. `NEW_CHAT_TRANSFER.txt` — fastest current-state summary and rules list
4. `CHECKPOINTS.md` — last verified stable milestone
5. `SESSION_LOG.md` — recent implementation steps
6. `ROADMAP.md` — completed phases and current phase
7. `DECISIONS.md` — major architecture decisions and why they were made

---

## What's already built (as of 2026-04-12)

**Tech stack:**
- Next.js 16.2.3 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- SQLite via `better-sqlite3` + Drizzle ORM — database at `data/guides.db`
- NextAuth.js v4 + bcryptjs — owner-only admin auth (credentials, JWT sessions)
- Route protection: `proxy.ts` (NOT `middleware.ts` — deprecated in Next.js 16)

**Public site (`app/(public)/`):**
- Home, guide list (`/guides`), guide detail (`/guides/[slug]`), about, contact
- Reads from `lib/db/reader.ts` — SSG + on-demand ISR
- 1 guide seeded: `employment-visa` with full steps
- Russian fields exist in DB but public site only renders English

**Admin (`app/admin/`):**
- Login page with credentials auth
- Guide list (drafts + published)
- Create guide form
- Edit guide form with: Save draft, Save and publish, Unpublish, Delete, unsaved-changes warning
- No step management yet — this is the next thing to build

**Key files:**
- `app/admin/guides/[slug]/page.tsx` — thin server component, passes guide to GuideEditForm
- `components/admin/GuideEditForm.tsx` — client component, dirty tracking, single form with intent buttons
- `app/admin/actions.ts` — all Server Actions (create, update, delete, publish)
- `lib/db/schema.ts` — Drizzle schema for guides + steps tables
- `lib/db/reader.ts` — public read queries
- `lib/db/writer.ts` — admin read queries (writes go through actions.ts directly)
- `lib/revalidate.ts` — revalidatePath wrapper called after every save
- `proxy.ts` — route protection

---

## Current next step

**Phase 4: Step management in the admin.**

Add inline step CRUD to `/admin/guides/[slug]`:
- List existing steps below the guide fields
- Add step (appended at end with next order number)
- Edit each step: EN fields (title, what, where, address, advice, warning), RU fields, cost, time_est
- Delete step (confirm dialog)
- Reorder: up/down buttons swapping integer `step_order` values
- Server Actions: createStepAction, updateStepAction, deleteStepAction, reorderStepAction
- Call `revalidateGuide(slug)` after every step mutation

---

## Rules that must not be broken

1. **Single form + intent pattern:** Never split guide field-editing and publishing into separate `<form>` elements. The locked pattern is one form with `name="intent" value="draft/publish"` buttons. Unpublish is the only allowed standalone form.

2. **Public/admin separation:** Public pages import only `lib/db/reader.ts`. Admin pages use `lib/db/writer.ts` for reads. Never cross-import.

3. **No inner `key` collisions:** The page puts `key={saved ?? "init"}` on `<GuideEditForm>`. Inner elements must NOT use the same key value — that creates duplicate sibling keys and React warnings. Remount of the outer component handles all resets.

4. **bcrypt hash escaping:** `ADMIN_PASSWORD_HASH` in `.env.local` must escape `$` as `\$`. dotenv-expand silently corrupts unescaped hashes.

5. **proxy.ts not middleware.ts:** Next.js 16 renamed the convention. Using `middleware.ts` triggers a build warning.

6. **`serverExternalPackages: ["better-sqlite3"]` in next.config.ts:** Must stay. Prevents Turbopack from bundling the native module.

7. **After every meaningful implementation step, update:** `PROJECT_STATE.md`, `ROADMAP.md`, and `DECISIONS.md` / `HANDOFF_PROMPT.md` if the project state changed materially.

---

## Environment

- Dev: `npm run dev -- --hostname 0.0.0.0`
- Build: `npm run build`
- Local IP: `ipconfig getifaddr en0`
- `.env.local` required (not committed): ADMIN_EMAIL, ADMIN_PASSWORD_HASH, NEXTAUTH_SECRET, NEXTAUTH_URL
- No deployment yet — local development only

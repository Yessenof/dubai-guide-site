# Project State — Dubai Guide Site

Last updated: 2026-04-12 (memory system created)

---

## Project Summary

A premium, mobile-first Dubai knowledge hub. Owner-only admin panel built into the same Next.js project. Content stored in SQLite. No external services. Deployed target: Cloudways (Node.js VPS).

---

## Current Architecture

```
app/
  (public)/           ← public routes, route group (URLs unaffected)
    layout.tsx        ← wraps public pages with Header
    page.tsx          ← home page / hero
    guides/
      page.tsx        ← guide list (reads from reader.ts)
      [slug]/
        page.tsx      ← guide detail (SSG, reads from reader.ts)
    about/
    contact/
  admin/              ← owner-only, isolated layout
    layout.tsx        ← no public Header; protected by proxy.ts
    login/page.tsx    ← credentials login (NextAuth)
    guides/
      page.tsx        ← list all guides (drafts + published)
      new/page.tsx    ← create guide form
      [slug]/page.tsx ← edit guide (thin server component)
    actions.ts        ← all Server Actions (create, update, delete, publish)
  api/auth/[...nextauth]/ ← NextAuth handler
  layout.tsx          ← root layout (no Header)

components/
  Header.tsx          ← public navigation
  GuideHeader.tsx     ← guide page header (title, price, timeline, etc.)
  StepCard.tsx        ← individual step rendering
  TopicCard.tsx       ← guide card on list page
  Hero.tsx            ← home page hero
  admin/
    GuideEditForm.tsx ← client component: dirty tracking, unsaved-changes guard,
                        single form with Save draft / Save and publish buttons
    GuideFormFields.tsx ← server component: all guide input fields (shared by new + edit)
    SavedBanner.tsx   ← green success banner (auto-hides after 3s)
    AdminLogout.tsx   ← sign-out button
    DeleteGuideButton.tsx ← (legacy, currently unused — delete logic is inline in GuideEditForm)

lib/
  db/
    schema.ts         ← Drizzle table definitions + inferred types (Guide, Step)
    connection.ts     ← SQLite singleton (WAL mode, FK enforcement)
    reader.ts         ← read-only queries for public pages
    writer.ts         ← read queries for admin (create/update/delete via actions.ts)
  auth.ts             ← NextAuth config (CredentialsProvider + bcryptjs)
  revalidate.ts       ← revalidatePath wrapper called after every save

data/
  guides.db           ← SQLite database (single file, not committed to git)

proxy.ts              ← Next.js 16 route protection (replaces deprecated middleware.ts)
drizzle.config.ts     ← Drizzle migration config
scripts/
  generate-hash.ts    ← generate bcrypt hash for .env.local
  debug-auth.ts       ← diagnose login failures (reads .env.local raw, bypasses dotenv-expand)
docs/
  admin-architecture.md ← detailed architecture reference (some sections now partially outdated)
```

**Key dependencies:**
- `next` (16.2.3), `react`, `react-dom`
- `better-sqlite3` + `drizzle-orm` — database
- `next-auth` (v4) + `bcryptjs` — auth
- `tailwindcss` v4 — styling
- `drizzle-kit`, `tsx`, `typescript` — dev tools

---

## Public Site Status

| Page | Status |
|---|---|
| Home (`/`) | Live, renders from SQLite |
| Guide list (`/guides`) | Live, published-only from SQLite |
| Guide detail (`/guides/[slug]`) | Live, SSG + on-demand ISR |
| About (`/about`) | Live (static) |
| Contact (`/contact`) | Live (static) |

Currently **1 guide** in DB: `employment-visa` (seeded from old MDX).

**Steps:** The steps table schema is in place and the public guide page renders steps from the DB. However, step management in the admin is **not yet built** — steps must currently be added via seed script or direct DB manipulation.

---

## Admin Status

| Feature | Status |
|---|---|
| Login (`/admin/login`) | Working |
| Route protection (`proxy.ts`) | Working |
| Guide list (`/admin/guides`) | Working — shows all guides (draft + published) |
| Create guide (`/admin/guides/new`) | Working — saves as draft |
| Edit guide (`/admin/guides/[slug]`) | Working — single form, Save draft + Save and publish |
| Publish / unpublish | Working — Unpublish is a standalone safe form; publish is part of the main save form |
| Delete guide | Working — inline confirm dialog |
| Unsaved-changes guard | Working — dirty state tracking, `beforeunload` warning, back-nav confirm dialog |
| Success banner | Working — green banner auto-hides after 3s on save redirect |
| Step management | **NOT BUILT** |
| RU content admin fields | Present in the form (ru_title, ru_summary, ru_audience, ru_overview) — editable but not rendered on public site yet |

---

## Current Blockers / Known Issues

1. **Step CRUD not built.** The steps table exists and the public page renders steps, but there is no admin UI to add, edit, delete, or reorder steps. This is the primary missing piece.

2. **`DeleteGuideButton.tsx` is now unused.** Delete logic was moved inline into `GuideEditForm.tsx`. The file should be cleaned up.

3. **`docs/admin-architecture.md` is partially outdated.** It references `middleware.ts` (deprecated — now `proxy.ts`) and describes `writer.ts` as having full CRUD functions, but the actual implementation uses `actions.ts` with direct `db` calls. The doc is useful for architecture context but should not be used as a literal code reference.

4. **Russian language not live on public site.** RU fields are in the DB and editable in admin, but the public site always renders EN. Locale routing and fallback logic not yet implemented.

5. **No `sitemap.xml`.** Not yet generated.

6. **No deployment.** Site runs locally only. Cloudways deployment not yet set up.

---

## Current Next Step

**Phase 4: Step management in the admin.**

Add inline step CRUD to `/admin/guides/[slug]`:
- List existing steps below the guide fields
- Add step (appended at end)
- Edit each step's fields (both EN and RU)
- Delete step (confirm dialog)
- Reorder: up/down buttons (v1), drag-and-drop optional later

---

## Recent Completed Work

- **Phase 1:** SQLite migration. Replaced MDX + metadata.ts with better-sqlite3 + Drizzle ORM. Seeded employment-visa guide. Retired legacy files.
- **Phase 2:** Admin foundation. NextAuth.js credentials login, admin layout isolated, route protection, guide list page.
- **Phase 3A:** Guide CRUD. Create form, edit form, Server Actions for create/update/delete/publish. ISR revalidation on save.
- **Bugfixes:**
  - Fixed dotenv-expand corrupting bcrypt hash (`$` → `\$` in `.env.local`)
  - Fixed React stale `defaultValue` after save (timestamp in redirect URL + `key` on outer component)
  - Fixed Publish discarding unsaved changes (merged into single form with `name="intent"` pattern)
  - Fixed duplicate React key warning (`<SavedBanner key={savedTs}>` and `<form key={savedTs}>` were siblings with the same key — removed inner keys since outer `<GuideEditForm key={...}>` handles remount)
  - Renamed `middleware.ts` → `proxy.ts` (Next.js 16 convention)

---

## Environment / Local Dev Notes

- Dev server: `npm run dev -- --hostname 0.0.0.0`
- Local IP (current): `192.168.1.120`
- Desktop: `http://localhost:3000`
- iPhone: `http://192.168.1.120:3000`
- `.env.local` required — not committed to git
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt, `$` escaped as `\$`), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `data/guides.db` — not committed to git (add to `.gitignore` if not already)

---

## Deployment Notes

- Target: Cloudways (Node.js VPS, Ubuntu/Debian)
- `better-sqlite3` requires native bindings — compiled on deploy via `npm install`
- `data/guides.db` must exist on the server filesystem (writable, persistent)
- Backup = copy `data/guides.db` to safe location
- `NEXTAUTH_URL` must be set to the production domain in `.env.local` on server
- No deployment has been done yet

---

## Files to Check First

**Fastest start:** Open `NEW_CHAT_TRANSFER.txt` — it tells you exactly what to attach and paste.

When continuing this project in a new session, read these files first:

1. `CLAUDE.md` — rules, architecture constraints, QA rules
2. `PROJECT_STATE.md` — this file (current status, blockers, next step)
3. `NEW_CHAT_TRANSFER.txt` — copy-paste handoff for a new chat
4. `CHECKPOINTS.md` — last verified stable state
5. `SESSION_LOG.md` — recent steps taken

Then for code context:
6. `app/admin/guides/[slug]/page.tsx` — current edit page entry point
7. `components/admin/GuideEditForm.tsx` — main admin form logic
8. `app/admin/actions.ts` — all Server Actions
9. `lib/db/schema.ts` — database schema

## Memory Guard

`.claude/settings.json` + `.claude/memory-guard.sh` — Stop hook that warns
when source files (`app/`, `components/`, `lib/`, `proxy.ts`, `next.config.ts`)
are newer than `PROJECT_STATE.md`. Exits 0 (warns, never blocks).

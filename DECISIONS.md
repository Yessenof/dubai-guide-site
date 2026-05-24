# Architecture & Product Decisions — Dubai Guide Site

Major decisions, why each was made, and what was rejected. Treat these as locked unless the owner explicitly revisits them.

---

## Data Storage: SQLite instead of JSON files

**Decision:** Guide and step data lives in `data/guides.db` — a single SQLite file managed via `better-sqlite3` + Drizzle ORM.

**Why chosen:**
- Steps have integer order fields — updating order is a single `UPDATE`, not rewriting an entire JSON file
- Flat bilingual columns (`en_*`, `ru_*`) are clean, queryable, and require no parsing
- CRUD operations are proper DB transactions — no manual file locking or JSON merge issues
- Zero external services — single file on disk, works on any Node.js VPS
- Easy to back up (copy one file), inspect (SQLite browser), and migrate

**Alternatives rejected:**
- **JSON files:** Simple for one guide, but fragile for step reordering, concurrency, and growing content. Rejected.
- **PostgreSQL / MySQL:** Requires external service, connection pooling, credentials management. Overkill for a single-owner site. Rejected.
- **External CMS (Contentful, Sanity, etc.):** Adds ongoing cost, external dependency, and complexity. Conflicts with the lightweight-first principle. Rejected.

---

## Admin Architecture: Owner-only panel inside the same Next.js project

**Decision:** Admin panel lives at `/admin/*` inside the same Next.js app. No separate deployment, no separate codebase.

**Why chosen:**
- Single deployment to manage. No cross-origin auth complexity.
- Route-level code splitting means admin JS never loads on public pages.
- Owner is the only user — no multi-role complexity needed.
- Admin and public share the same SQLite file — no sync needed.

**Alternatives rejected:**
- **Separate Next.js app for admin:** Two deployments to manage. No benefit for a single owner. Rejected.
- **Headless CMS with admin UI:** Adds external service, cost, and complexity. Conflicts with no-heavy-CMS rule. Rejected.

---

## No Heavy CMS

**Decision:** All content is managed through the owner-built admin panel backed by SQLite. No third-party CMS.

**Why chosen:**
- Zero ongoing cost or external dependency for content management
- Full control over content structure and admin UX
- Keeps the public site fast — no API calls to external services at render time
- Owner has technical capability to manage a custom admin

**Alternatives rejected:**
- **Contentful, Sanity, Strapi, etc.:** All add cost, lock-in, or self-hosting complexity. Rejected.

---

## Auth: NextAuth.js with credentials provider, single owner

**Decision:** NextAuth.js v4 with a CredentialsProvider. Single owner. Password stored as a bcrypt hash in environment variables. JWT session (no DB sessions table).

**Why chosen:**
- No external auth service (no Auth0, Clerk, etc.)
- Minimal dependencies — NextAuth is already well-integrated with Next.js
- Single owner = no user management needed
- bcryptjs (pure JS) chosen over `bcrypt` (native bindings) to avoid compilation issues

**Critical gotcha (learned in production):** `$` characters in bcrypt hashes in `.env.local` must be escaped as `\$`. dotenv-expand treats unescaped `$` as variable references, corrupting the hash silently. Double-quotes do NOT prevent this.

**Alternatives rejected:**
- **Auth0 / Clerk:** External services, cost, complexity for a single-user case. Rejected.
- **Magic link / email auth:** Requires email service. Overkill for one owner. Rejected.
- **Database sessions:** Adds a sessions table, more complexity. JWT sessions are sufficient. Rejected.

---

## Public/Admin Separation via reader.ts / writer.ts

**Decision:** Public pages import only `lib/db/reader.ts`. Admin pages import only `lib/db/writer.ts`. Both use the same `lib/db/connection.ts` singleton.

**Why chosen:**
- Enforces at import level that public pages can never accidentally call write operations
- Makes it trivially auditable — grep for `writer` in `app/(public)` should return nothing
- Admin JS bundle never leaks into public pages

**Alternatives rejected:**
- **Single db module:** Harder to audit separation. Rejected.

---

## English as Source of Truth

**Decision:** English is the primary language. Russian is secondary. EN fields are required; RU fields default to empty string.

**Why chosen:**
- Owner writes content in English first
- Russian audience is secondary — content is added after EN is complete
- EN fallback for RU prevents empty pages before translation is done
- Keeps the initial content workflow simple

**Future plan:** Admin will support "Generate RU draft from EN" via Claude API — populates `ru_*` fields with a draft translation. Not built yet.

---

## Controlled Category Taxonomy

**Decision:** Categories are a controlled list managed in code (`GuideFormFields.tsx`). Not free-text.

**Why chosen:**
- Prevents typos and inconsistent category names in the DB
- Enables clean filtering and navigation by category on the public site
- Easy to update by changing one constant

**Current five values in code:** `visas`, `company-setup`, `hiring`, `living`, `government`

**Status: NOT owner-approved as final.** The category taxonomy is defined in code but has not been explicitly confirmed by the owner as the permanent taxonomy. Do not treat these five values as locked in future sessions without explicit owner confirmation. Any change requires updating the `CATEGORIES` constant in `components/admin/GuideFormFields.tsx` and the CategoryIcon component.

---

## Social Distribution Instead of Contact Form

**Decision:** Distribution via WhatsApp, Instagram, Facebook links. No contact form.

**Why chosen:**
- Simpler — no form handling, no spam filtering, no email infrastructure
- Matches how the target audience (expats, business owners) actually communicates
- The `/contact` page exists but is a simple page with social/WhatsApp links

**Alternatives rejected:**
- **Contact form with email delivery:** Requires email service setup (SendGrid, Resend, etc.), spam handling. Not worth the complexity. Rejected.

---

## Flat Bilingual Columns Instead of Translations Table

**Decision:** Each localizable field has two flat columns: `en_title`, `ru_title`. No separate `guide_translations` join table.

**Why chosen:**
- No JOIN needed on public page queries — simpler and faster
- Admin form maps directly to column names — no locale-keyed nesting
- For exactly two languages, flat columns are cleaner than a translations table
- Adding a third language later is a simple `ALTER TABLE`

**Alternatives rejected:**
- **Translations table (`guide_id`, `locale`, `field`, `value`):** More normalized but adds complexity for two languages and a single owner. Rejected.
- **JSON blob column for translations:** Loses type safety, harder to query. Rejected.

---

## React Form Reset: Outer Component key, Not Inner Form key

**Decision:** After a save redirect, the page passes `key={saved ?? "init"}` to `<GuideEditForm>`. This remounts the entire component, resetting all state and `defaultValue` attrs. Inner elements (`<form>`, `<SavedBanner>`) do NOT carry their own keys.

**Why chosen:**
- Remounting the whole component resets everything in one pass: `defaultValue` attrs re-read from fresh DB data, dirty state resets, `SavedBanner` starts fresh
- Giving inner siblings the same key value as each other causes React's duplicate-key warning
- Learned from a real bug: `<SavedBanner key={savedTs}>` and `<form key={savedTs}>` were siblings with the same key when `savedTs` was set

---

## Safe Production Deploy Sequence: Stop PM2 Before Build

**Decision:** For all production code deploys that run `npm run build` on the live server, PM2 must be stopped before the build starts and started again only after the build completes.

```bash
pm2 stop guidex-production
nohup npm run build > /tmp/guidex-build.log 2>&1
pm2 start guidex-production
```

**Why chosen:**
Next.js (Turbopack) deletes old static asset files (CSS, JS) and writes new ones during the compilation phase — before static page generation finishes. If PM2 is serving traffic while the build runs, it will serve old HTML that references the now-deleted old asset hashes. Users will receive 500/404 for CSS → unstyled page.

**Root cause incident (Phase 6C-55, 2026-05-23):** nohup build ran while PM2 was live. Turbopack deleted `0i59pw~swdt7w.css` during compilation. PM2 continued serving HTML referencing that hash for ~4 minutes. Real user devices saw unstyled HTML. Confirmed in Nginx access log: `GET /_next/static/chunks/0i59pw~swdt7w.css → 500`.

**Acceptable downtime:** ~30 seconds during compilation on this server. Acceptable for a low-traffic content site.

**User impact of the old (broken) approach:** CSS 500 → unstyled page for users during the build window. Hard refresh fixes affected clients after PM2 is restarted with the correct build.

**Future optional improvement (not required now):** Build to a staging `.next.new/` directory, then atomically swap `mv .next .next.old && mv .next.new .next && pm2 restart`. Zero downtime, no race condition. Not implemented — complexity not justified yet.

**Alternatives rejected:**
- **nohup build with PM2 running:** Creates the race condition described above. Rejected after Phase 6C-55 incident.
- **pm2 restart after nohup build completes:** Also safe if PM2 is not touching .next/ during build, but the deletion of old static files happens early in compilation — overlap window exists. Stop is safer than restart-after.

---

## proxy.ts Instead of middleware.ts (Next.js 16)

**Decision:** Route protection file is named `proxy.ts`, not `middleware.ts`.

**Why:** Next.js 16 deprecated the `middleware.ts` convention in favor of `proxy.ts`. Using `middleware.ts` triggers a build warning and may break in future versions. Renamed during Phase 2 after the warning was observed.

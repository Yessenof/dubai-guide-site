# Roadmap — Dubai Guide Site

---

## Completed Phases

### Phase 1 — SQLite Data Layer Migration ✅
Replaced the MDX + metadata.ts content system with SQLite via better-sqlite3 + Drizzle ORM.

- Installed `better-sqlite3`, `drizzle-orm`, `drizzle-kit`
- Created `lib/db/schema.ts` (guides + steps tables, bilingual flat columns)
- Created `lib/db/connection.ts` (singleton, WAL mode, FK enforcement)
- Wrote `lib/db/reader.ts` (public read-only queries)
- Updated public guide pages to render from DB
- Seeded employment-visa guide with all steps from old MDX
- Retired MDX files, `metadata.ts`, `@next/mdx` config
- Zero SEO regression — URLs and rendered HTML identical

### Phase 2 — Admin Foundation ✅
Built the owner-only admin panel with auth and guide listing.

- Installed `next-auth` v4 + `bcryptjs`
- Created `lib/auth.ts` (CredentialsProvider, bcryptjs.compare, JWT sessions)
- Created `app/admin/layout.tsx` (isolated from public, no shared Header)
- Created `app/admin/login/page.tsx` (credentials form, `signIn` with `redirect: false`)
- Added `proxy.ts` for route protection (protects `/admin/guides` and subpaths)
- Created `app/admin/guides/page.tsx` (lists all guides: drafts + published)
- Diagnosed and fixed bcrypt hash corruption by dotenv-expand (escape `$` as `\$`)
- Renamed `middleware.ts` → `proxy.ts` (Next.js 16 convention)

### Phase 3A — Guide CRUD ✅
Full create / edit / delete / publish workflow for guides (without steps).

- Created `app/admin/guides/new/page.tsx` + `createGuideAction`
- Created `app/admin/guides/[slug]/page.tsx` (thin server component)
- Created `components/admin/GuideEditForm.tsx` (client component: dirty tracking, unsaved-changes guard, single form with Save draft + Save and publish)
- Created `components/admin/GuideFormFields.tsx` (shared field inputs)
- Created `components/admin/SavedBanner.tsx` (3s auto-hide success banner)
- Implemented `updateGuideAction` with `intent` field (draft/publish in one write)
- Implemented `setPublishedAction` (Unpublish-only standalone form)
- Implemented `deleteGuideAction` with confirm dialog
- ISR revalidation after every save via `lib/revalidate.ts`
- Fixed stale `defaultValue` on same-URL redirect (timestamp in URL + `key` on outer component)
- Fixed duplicate React key warning (removed redundant inner keys)

---

## Current Phase

### Phase 4 — Step Management (IN PROGRESS)

Add inline step CRUD to the guide edit page.

**Scope:**
- [ ] List existing steps below guide fields in `/admin/guides/[slug]`
- [ ] Add step button (appends new step at end)
- [ ] Edit each step: EN fields (title, what, where, address, advice, warning), RU fields, cost, time_est
- [ ] Delete step (confirm dialog)
- [ ] Reorder steps: up/down buttons (swap integer `step_order`)
- [ ] Server Actions: `createStepAction`, `updateStepAction`, `deleteStepAction`, `reorderStepAction`
- [ ] ISR revalidation after every step change

**Design constraint:** Steps appear as an inline list below the guide form. No separate page. No drag-and-drop in v1 (up/down buttons are sufficient).

---

## Next Phase

### Phase 5 — Russian Language (PUBLIC RENDERING)

Currently, Russian content fields are stored in the DB and editable in the admin, but the public site always renders English.

**Scope:**
- [ ] Add locale routing to public pages (`/guides/[slug]` = EN, `/ru/guides/[slug]` = RU)
- [ ] Add `next-intl` (or similar) for locale context
- [ ] Add language switcher to public `Header.tsx`
- [ ] Update `reader.ts` to accept a locale parameter
- [ ] EN fallback when RU field is empty
- [ ] Update `generateStaticParams` to generate both locale variants
- [ ] Update SEO metadata per locale

---

## Later Phases

### Phase 6 — RU Content Drafting via Claude API
- Add "Generate RU draft from EN" button to admin guide edit form
- Calls Claude API to populate `ru_*` fields with a draft translation
- Fields remain editable before saving
- Requires: stable EN content workflow (Phase 4 complete)

### Phase 7 — Sitemap + Structured Data
- Generate `sitemap.xml` from published guides (DB query at build or dynamic route)
- Add JSON-LD structured data per guide page
- Add Open Graph image (og:image) per guide or a global default

### Phase 8 — Cloudways Deployment
- Set up Node.js app on Cloudways
- Configure `NEXTAUTH_URL` and credentials in production `.env.local`
- Copy `data/guides.db` to server
- Set up `npm run build && npm start` or PM2
- Verify public URLs, admin login, ISR revalidation in production
- Set up `data/guides.db` backup (cron job)

### Phase 9 — Step Reorder v2 (Optional)
- Replace up/down buttons with drag-and-drop using `@dnd-kit/sortable`
- Only if up/down buttons feel too slow in practice

### Phase 10 — Multi-guide Content + Category Pages
- Add more guides across all five categories
- Add category index pages (`/guides/category/visas`, etc.)
- Internal linking between related guides
- Guide count is the primary SEO growth driver

# Admin Architecture — Dubai Guide

## Overview

The admin system allows the owner to create, edit, publish, and manage guides without touching code. It is a lightweight, owner-only panel built inside the same Next.js project, architecturally isolated from the public site.

The public site must remain statically rendered, fast, and SEO-clean at all times. The admin must never add weight to public pages.

**Storage decision: SQLite via `better-sqlite3` + Drizzle ORM.**
JSON files were considered but rejected in favour of SQLite because:
- Better for reordering steps (UPDATE integer field vs. rewriting an entire file)
- Better for bilingual content (flat columns, clean queries)
- Better for CRUD operations (proper transactions, no manual file parsing)
- Still zero external services — the database is a single file on disk
- Still works perfectly on Cloudways (standard Node.js VPS)
- Easier to back up, inspect, and migrate than a growing JSON file

---

## Guiding Principles

- Admin is only for the owner — no multi-user, no roles in v1
- No heavy CMS, no external content platform
- Public pages remain statically generated or ISR — never client-fetched
- Admin and public routes share no layout, no state, no rendering components
- All guide content is fully editable: every field, every step
- Steps can be added, deleted, and reordered
- English is the primary language; Russian is secondary
- All database columns are bilingual from day one
- Admin adds zero weight to public page bundles

---

## SQLite Schema

Two tables. Bilingual fields stored as flat columns — no joins, no lookup tables, no JSON blobs.

### `guides` table

```sql
CREATE TABLE guides (
  id           TEXT    PRIMARY KEY,            -- UUID
  slug         TEXT    UNIQUE NOT NULL,        -- URL-safe, e.g. "employment-visa"
  category     TEXT    NOT NULL,               -- "visas" | "company-setup" | "hiring" | "living" | "government"
  published    INTEGER NOT NULL DEFAULT 0,     -- 0 = draft, 1 = live on public site
  price        TEXT    NOT NULL DEFAULT '',    -- Shared field, e.g. "AED 3,000 – 5,000"
  timeline     TEXT    NOT NULL DEFAULT '',    -- Shared field, e.g. "3–5 weeks"
  last_updated TEXT    NOT NULL DEFAULT '',    -- Human-readable display date, e.g. "April 2025"
  created_at   TEXT    NOT NULL,               -- ISO 8601 datetime
  updated_at   TEXT    NOT NULL,               -- ISO 8601 datetime

  -- English content
  en_title     TEXT    NOT NULL DEFAULT '',
  en_summary   TEXT    NOT NULL DEFAULT '',    -- Shown in cards and meta description
  en_audience  TEXT    NOT NULL DEFAULT '',    -- "Who this is for"
  en_overview  TEXT    NOT NULL DEFAULT '',    -- Multi-paragraph intro before steps

  -- Russian content (empty strings in v1, filled when translated)
  ru_title     TEXT    NOT NULL DEFAULT '',
  ru_summary   TEXT    NOT NULL DEFAULT '',
  ru_audience  TEXT    NOT NULL DEFAULT '',
  ru_overview  TEXT    NOT NULL DEFAULT ''
);
```

### `steps` table

```sql
CREATE TABLE steps (
  id          TEXT    PRIMARY KEY,             -- UUID, stable even when order changes
  guide_id    TEXT    NOT NULL,                -- FK → guides.id
  step_order  INTEGER NOT NULL,               -- 1-indexed display order
  cost        TEXT    NOT NULL DEFAULT '',     -- Shared, e.g. "AED 220" or "Free"
  time_est    TEXT    NOT NULL DEFAULT '',     -- Shared, e.g. "2–4 business days"

  -- English content
  en_title    TEXT    NOT NULL DEFAULT '',
  en_what     TEXT    NOT NULL DEFAULT '',     -- What to do
  en_where    TEXT    NOT NULL DEFAULT '',     -- Authority / office / portal name
  en_address  TEXT    NOT NULL DEFAULT '',     -- Physical address or URL
  en_advice   TEXT    NOT NULL DEFAULT '',     -- Practical tip
  en_warning  TEXT    NOT NULL DEFAULT '',     -- Optional caveat (empty = no warning shown)

  -- Russian content
  ru_title    TEXT    NOT NULL DEFAULT '',
  ru_what     TEXT    NOT NULL DEFAULT '',
  ru_where    TEXT    NOT NULL DEFAULT '',
  ru_address  TEXT    NOT NULL DEFAULT '',
  ru_advice   TEXT    NOT NULL DEFAULT '',
  ru_warning  TEXT    NOT NULL DEFAULT '',

  FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
);

CREATE INDEX idx_steps_guide ON steps(guide_id);
CREATE INDEX idx_steps_order ON steps(guide_id, step_order);
```

### Why flat columns, not a translations table

A separate `guide_translations(guide_id, locale, title, ...)` table is more normalised but adds a JOIN to every public page query and more complexity to every admin form. For two languages and a single owner, flat columns are cleaner, faster, and easier to understand. If a third language is ever added, it is a simple ALTER TABLE.

---

## Drizzle ORM Schema (TypeScript)

```ts
// lib/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const guides = sqliteTable("guides", {
  id:          text("id").primaryKey(),
  slug:        text("slug").unique().notNull(),
  category:    text("category").notNull(),
  published:   integer("published", { mode: "boolean" }).notNull().default(false),
  price:       text("price").notNull().default(""),
  timeline:    text("timeline").notNull().default(""),
  lastUpdated: text("last_updated").notNull().default(""),
  createdAt:   text("created_at").notNull(),
  updatedAt:   text("updated_at").notNull(),

  enTitle:    text("en_title").notNull().default(""),
  enSummary:  text("en_summary").notNull().default(""),
  enAudience: text("en_audience").notNull().default(""),
  enOverview: text("en_overview").notNull().default(""),

  ruTitle:    text("ru_title").notNull().default(""),
  ruSummary:  text("ru_summary").notNull().default(""),
  ruAudience: text("ru_audience").notNull().default(""),
  ruOverview: text("ru_overview").notNull().default(""),
});

export const steps = sqliteTable("steps", {
  id:        text("id").primaryKey(),
  guideId:   text("guide_id").notNull().references(() => guides.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(),
  cost:      text("cost").notNull().default(""),
  timeEst:   text("time_est").notNull().default(""),

  enTitle:   text("en_title").notNull().default(""),
  enWhat:    text("en_what").notNull().default(""),
  enWhere:   text("en_where").notNull().default(""),
  enAddress: text("en_address").notNull().default(""),
  enAdvice:  text("en_advice").notNull().default(""),
  enWarning: text("en_warning").notNull().default(""),

  ruTitle:   text("ru_title").notNull().default(""),
  ruWhat:    text("ru_what").notNull().default(""),
  ruWhere:   text("ru_where").notNull().default(""),
  ruAddress: text("ru_address").notNull().default(""),
  ruAdvice:  text("ru_advice").notNull().default(""),
  ruWarning: text("ru_warning").notNull().default(""),
});

export type Guide = typeof guides.$inferSelect;
export type Step  = typeof steps.$inferSelect;
```

---

## Database Connection

```ts
// lib/db/connection.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "guides.db");

// Singleton connection — re-used across requests in the same Node process
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");   // Better concurrent read performance
sqlite.pragma("foreign_keys = ON");    // Enforce FK constraints

export const db = drizzle(sqlite, { schema });
```

`WAL` (Write-Ahead Logging) mode allows reads during writes — important because ISR page renders (reads) can overlap with admin saves (writes).

---

## File and Dependency Layout

```
data/
  guides.db               ← SQLite database file (created on first run)

lib/
  db/
    schema.ts             ← Drizzle table definitions and inferred types
    connection.ts         ← Single db instance (better-sqlite3 + drizzle)
    reader.ts             ← Read-only queries — imported ONLY by public pages
    writer.ts             ← Write queries — imported ONLY by admin routes

app/
  (public)/               ← all public-facing routes
    layout.tsx
    page.tsx
    guides/
      page.tsx
      [slug]/
        page.tsx
    about/
    contact/
  admin/                  ← owner-only, completely isolated layout
    layout.tsx            ← no public Header/Footer
    login/
      page.tsx
    guides/
      page.tsx            ← list all guides
      new/
        page.tsx          ← create guide
      [slug]/
        page.tsx          ← edit guide + steps

middleware.ts             ← protects /admin/* routes via session check

drizzle.config.ts         ← Drizzle migration config
```

### Separation rule

- Public pages import only from `lib/db/reader.ts`
- Admin pages import only from `lib/db/writer.ts`
- `reader.ts` and `writer.ts` both use `lib/db/connection.ts`
- Admin JS bundle is never included in public pages (Next.js route-based code splitting)

---

## Reader and Writer Shape

```ts
// lib/db/reader.ts — used by public pages only
export function getAllPublishedGuides(): GuideListItem[]
export function getPublishedGuideBySlug(slug: string): GuideWithSteps | null

// lib/db/writer.ts — used by admin only
export function getAllGuides(): GuideListItem[]            // includes drafts
export function getGuideBySlug(slug: string): GuideWithSteps | null
export function createGuide(data: NewGuide): Guide
export function updateGuide(id: string, data: Partial<Guide>): Guide
export function deleteGuide(id: string): void
export function setPublished(id: string, published: boolean): void

export function getStepsByGuideId(guideId: string): Step[]
export function createStep(data: NewStep): Step
export function updateStep(id: string, data: Partial<Step>): Step
export function deleteStep(id: string): void
export function reorderSteps(guideId: string, orderedIds: string[]): void
```

---

## Bilingual Content

### Storage

- Every localizable field has a flat `en_*` and `ru_*` column
- Shared fields (`price`, `timeline`, `cost`, `time_est`) are stored once
- Russian columns default to empty string — valid in v1

### Public rendering fallback

```ts
// When rendering a guide page, fall back to English if Russian is empty
function getLocalisedGuide(guide: Guide, locale: "en" | "ru") {
  if (locale === "ru" && guide.ruTitle) {
    return { title: guide.ruTitle, summary: guide.ruSummary, ... }
  }
  return { title: guide.enTitle, summary: guide.enSummary, ... }
}
```

### Language switcher

- Added to public top navigation in a future phase
- URL pattern: `/guides/employment-visa` (EN default) + `/ru/guides/employment-visa`
- Handled by `next-intl` when the time comes — no structural changes needed before then
- Russian content is added and managed in the admin alongside English

---

## Auth Approach

**NextAuth.js with credentials provider. No external auth service.**

```
.env.local
  ADMIN_EMAIL=owner@example.com
  ADMIN_PASSWORD_HASH=$2b$10$...   ← bcrypt hash generated once with a script
  NEXTAUTH_SECRET=64_char_random_string
  NEXTAUTH_URL=https://yourdomain.com
```

### Flow

1. Owner visits `/admin/login`
2. Submits email + password
3. NextAuth credentials provider runs bcrypt.compare against `ADMIN_PASSWORD_HASH`
4. On success: issues a signed JWT session cookie (httpOnly, secure, 24h expiry)
5. On fail: returns error message, no redirect

### Middleware protection

```ts
// middleware.ts
export { default } from "next-auth/middleware";
export const config = { matcher: ["/admin/:path*"] };
```

All `/admin/*` routes are protected automatically. Unauthenticated requests redirect to `/admin/login`.

Sessions are JWT-based (stored in cookie) — no sessions table needed in SQLite.

---

## Admin Page Structure

### `/admin/login`
- Email + password form
- On success → redirect to `/admin/guides`
- Error shown inline on fail

### `/admin/guides`
- Table: title (EN), category, published status, last updated
- Actions per row: Edit, Toggle publish, Delete (with confirmation)
- "New guide" button → `/admin/guides/new`

### `/admin/guides/new`
- All guide fields: slug (auto-generated from EN title, editable), category, price, timeline
- EN fields: title, summary, audience, overview
- RU fields: title, summary, audience, overview (all optional)
- Save as draft → stays unpublished
- "Save and publish" → sets published = true, triggers ISR revalidation

### `/admin/guides/[slug]`
- Same fields as create form, pre-filled
- Below guide fields: inline step list
  - Each step shows all EN and RU fields, cost, time_est
  - Add step (appended at end with next order number)
  - Delete step (confirm dialog)
  - Reorder: up/down buttons in v1, drag-and-drop in v2
- "Save" button → updates DB, triggers `revalidatePath` for the guide page
- "View on site" link → opens `/guides/[slug]` in new tab (only if published)

---

## ISR and Public Site Update Strategy

Guide pages use **Incremental Static Regeneration (ISR)**:
- `export const revalidate = 300` on guide list page (5 min background refresh)
- On-demand revalidation triggered immediately after admin saves a guide

```ts
// lib/revalidate.ts
import { revalidatePath } from "next/cache";

export function revalidateGuide(slug: string) {
  revalidatePath(`/guides/${slug}`);
  revalidatePath("/guides");
  revalidatePath("/");
}
```

This is called at the end of every admin save and publish action. Public pages update within seconds of an admin change — no rebuild required.

---

## Cloudways Compatibility

`better-sqlite3` requires native Node.js bindings, compiled on the server. On Cloudways:

1. The deployment runs `npm install` which triggers `node-gyp` for native modules
2. Cloudways VPS (Ubuntu/Debian) has build tools available by default
3. The SQLite file at `data/guides.db` lives on the VPS filesystem — writable, persistent
4. Backup = copy `data/guides.db` to a safe location (simple cron job or manual)

If native bindings fail during deployment (unlikely but possible):
- Fallback: replace `better-sqlite3` with `@libsql/client` in file mode — pure JS, no native bindings, same SQLite file format, slightly different query API

---

## Migration from Current MDX + metadata.ts System

### Current state

```
content/guides/metadata.ts          ← guide headers as TypeScript object
content/guides/employment-visa.mdx  ← overview text + steps as JSX components
lib/guides.ts                        ← reads from metadata.ts
app/guides/[slug]/page.tsx           ← dynamically imports MDX
```

### Target state after migration

```
data/guides.db                       ← SQLite database with all guide data
lib/db/schema.ts                     ← Drizzle schema
lib/db/connection.ts                 ← DB singleton
lib/db/reader.ts                     ← public read queries
lib/db/writer.ts                     ← admin write queries
app/(public)/guides/[slug]/page.tsx  ← reads from DB via reader.ts, renders StepCard
```

### Migration steps

**Step 1 — Install packages and create schema**
```
npm install better-sqlite3 drizzle-orm
npm install --save-dev @types/better-sqlite3 drizzle-kit
```
Create `lib/db/schema.ts`, `lib/db/connection.ts`.
Run initial migration to create `data/guides.db` with empty tables.

**Step 2 — Seed with current guide data**
Write a one-time seed script (`scripts/seed.ts`) that reads the current `metadata.ts` and MDX file, extracts all fields and steps, and inserts them into the DB.

**Step 3 — Rewrite `lib/db/reader.ts`**
Implement `getAllPublishedGuides()` and `getPublishedGuideBySlug()` reading from SQLite. Public API surface stays the same so no public page logic breaks.

**Step 4 — Update public guide page**
Replace the dynamic MDX import in `app/guides/[slug]/page.tsx` with `getPublishedGuideBySlug(slug)` from `reader.ts`. Render `guide.steps` using the existing `<StepCard>` component. Visual output is identical.

**Step 5 — Confirm identical output, then retire old files**
Build and visually verify. Then delete:
- `content/guides/metadata.ts`
- `content/guides/employment-visa.mdx`
- `content/guides/` directory if empty
- `@next/mdx` configuration from `next.config.ts` (optional)

**Step 6 — Build admin**
DB layer is ready. Add NextAuth.js, build admin routes.

### What stays the same after migration

- All public URLs (`/guides/employment-visa`)
- All visual rendering (GuideHeader, StepCard components unchanged)
- All SEO metadata (title, description, Open Graph)
- Static/ISR generation behaviour
- Build process

### What changes

- Guide content lives in `data/guides.db` instead of code files
- Steps are structured DB rows, not JSX in MDX
- `@next/mdx` is no longer needed
- New guides are created in the admin, not by creating files

---

## Recommended Build Order

### Phase 1 — Data layer migration (zero visual change)

1. Install `better-sqlite3`, `drizzle-orm`, `drizzle-kit`
2. Create `lib/db/schema.ts` and `lib/db/connection.ts`
3. Run `drizzle-kit generate` and `migrate` to create `data/guides.db`
4. Write `scripts/seed.ts` to import current guide into the DB
5. Write `lib/db/reader.ts` with `getAllPublishedGuides` and `getPublishedGuideBySlug`
6. Update `app/(public)/guides/[slug]/page.tsx` to render from DB
7. Confirm build is clean and public site looks identical
8. Delete MDX files and `metadata.ts`

### Phase 2 — Admin foundation

1. Install `next-auth` + `bcryptjs`
2. Create `.env.local` with admin credentials
3. Create `app/admin/layout.tsx` (isolated, no public header/footer)
4. Create `app/admin/login/page.tsx` with credentials form
5. Add `middleware.ts` to protect `/admin/*`
6. Create `app/admin/guides/page.tsx` — read-only list using `writer.ts`

### Phase 3 — Guide CRUD

1. Create `app/admin/guides/new/page.tsx` — create guide form
2. Create `app/admin/guides/[slug]/page.tsx` — edit guide form
3. Wire Server Actions for create, update, delete, publish/unpublish
4. Add `revalidateGuide()` call after every save

### Phase 4 — Step management

1. Add inline step list to `/admin/guides/[slug]`
2. Server Actions: add step, update step, delete step
3. Reorder: up/down buttons (simple integer swap)
4. Reorder v2: drag-and-drop (add later if needed)

### Phase 5 — Russian language

1. Add RU fields to admin forms (tab or side-by-side columns)
2. Add `next-intl` to public site
3. Add language switcher to public navigation
4. Update public guide pages to render by locale with EN fallback

---

## SEO and Public Site Speed — No Regression

### SEO

- Guide pages remain SSG/ISR — no server-rendering delay
- `<title>`, `<meta description>`, and Open Graph tags still read from guide data
- URL structure does not change
- `sitemap.xml` is generated from DB query at build time or via dynamic route
- JSON-LD structured data can be added per guide in Phase 3+

### Speed

- Public pages query SQLite synchronously at render time (faster than file I/O for structured data)
- Drizzle queries are simple `SELECT` with no joins — sub-millisecond
- `better-sqlite3` is synchronous, no async overhead in the render path
- Admin bundle is never loaded by public pages (Next.js code splitting by route)
- No client-side data fetching for guide content on public pages

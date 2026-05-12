# Unified Guidex Admin — Technical Architecture Plan

Status: Planning only — no code, no DB, no routes, no deployment until approved
Last updated: 2026-05-12
Relates to: docs/guidex-ai-editorial-automation-plan.md (Phase 4A–4E)

---

## 1. Existing Admin Audit

### 1a. Route and file inventory

```
app/admin/
  layout.tsx                   Shared admin shell — nav bar + main container
  login/page.tsx               Login form (client component)
  guides/page.tsx              Guide list (all guides including drafts)
  guides/new/page.tsx          Create new guide form
  guides/[slug]/page.tsx       Edit guide + step management
  actions.ts                   All server actions — guide CRUD + step CRUD (250 lines)

components/admin/
  AdminLogout.tsx              Logout button (client component)
  DeleteGuideButton.tsx        Delete guide with confirmation
  GuideEditForm.tsx            Guide metadata edit form (client component)
  GuideFormFields.tsx          Field components: title, summary, category, etc.
  SavedBanner.tsx              Post-save confirmation banner
  StepCard.tsx                 Individual step edit form
  StepList.tsx                 Step list with add/delete controls

lib/db/
  connection.ts                better-sqlite3 + Drizzle connection (12 lines)
  schema.ts                    Drizzle table definitions — guides + steps + 3 new tables (151 lines)
  writer.ts                    Admin read functions — getAllGuides, getGuideBySlug, getStepsByGuideId (48 lines)
  reader.ts                    Public read functions — all public queries (240 lines)
  news-events-calendar.ts      Public read functions — news/events/calendar (451 lines)

proxy.ts                       NextAuth withAuth — protects /admin/guides and /admin/guides/:path*
lib/auth.ts                    NextAuth authOptions — CredentialsProvider, JWT, bcryptjs
```

### 1b. Auth protection pattern

**`proxy.ts`** uses `withAuth` from `next-auth/middleware`:

```typescript
export const config = {
  matcher: ["/admin/guides", "/admin/guides/:path*"],
};
```

**Critical gap:** The matcher covers only `/admin/guides` and its children. It does NOT cover:
- `/admin/` (root)
- `/admin/content` and its subroutes (the future unified content admin)
- Any other future admin subroutes

Any new admin route added under `/admin/` must be explicitly added to the proxy.ts matcher or it will be publicly accessible. This is a mandatory dedicated implementation step — not optional, and not done speculatively before the route exists.

The `app/admin/layout.tsx` calls `getServerSession` and shows the logout button if a session exists, but does **not** redirect unauthenticated users. Auth enforcement is 100% in `proxy.ts`. The layout is purely cosmetic.

### 1c. Login and session flow

1. Unauthenticated request to `/admin/guides` → proxy redirects to `/admin/login`
2. Login form (`app/admin/login/page.tsx`) calls `signIn("credentials", { redirect: false })`
3. `lib/auth.ts` `authorize()` checks email against `ADMIN_EMAIL` env var, password against `ADMIN_PASSWORD_HASH` (bcryptjs)
4. On success: JWT session created, router pushes to `/admin/guides`
5. Subsequent requests: proxy validates JWT token, allows access

**Session strategy:** JWT (no database session table). Single owner user — no role system.

### 1d. Existing guide editing workflow

1. List: `/admin/guides` → `getAllGuides()` from writer.ts → table of all guides
2. Edit: `/admin/guides/[slug]` → `getGuideBySlug()` + `getStepsByGuideId()` from writer.ts
3. Save: `GuideEditForm` submits to `updateGuideAction()` in `actions.ts`
4. Publish: same form, `name="intent"` button with `value="publish"` — single form, single action (locked pattern per CLAUDE.md)
5. Steps: managed via `StepList` / `StepCard` — each step has its own form, separate from guide form (DOM siblings, no nesting)

**Actions pattern:** `app/admin/actions.ts` imports directly from `@/lib/db/connection` and `@/lib/db/schema` for write operations. It does NOT use `writer.ts` for writes — writer.ts is read-only. This is the correct pattern: writer.ts = admin reads, actions.ts = DB writes via Drizzle.

### 1e. DB write pattern (existing)

Write operations in `actions.ts` use Drizzle ORM directly:
```typescript
import { db } from "@/lib/db/connection";
import { guides, steps } from "@/lib/db/schema";
// ...
db.insert(guides).values({ ... }).run();
db.update(guides).set({ ... }).where(eq(guides.slug, slug)).run();
```

All writes are inside `"use server"` functions — never called from client code directly.

### 1f. Schema state for new content types

All three new tables (`news_posts`, `events`, `calendar_pages`) have complete Drizzle table definitions in `lib/db/schema.ts` (added in Phase 3A). The exported TypeScript types are:
- `NewsPost = typeof newsPosts.$inferSelect`
- `HubEvent = typeof eventsTable.$inferSelect`
- `CalendarPage = typeof calendarPages.$inferSelect`

**No writer functions exist yet** for these three tables. `lib/db/writer.ts` covers only guides and steps. The new writer functions and server actions are the first concrete implementation task.

### 1g. Files that must not be touched during MVP build

| File | Why |
|---|---|
| `proxy.ts` | Read-only during audit. Matcher WILL need extending — but only when adding new routes, with explicit approval per change. |
| `lib/auth.ts` | Auth works. Single owner. No changes needed for content admin MVP. |
| `app/admin/login/page.tsx` | Works. No changes. |
| `app/admin/layout.tsx` | May need minor nav additions later — not during MVP Phase 4A-1 through 4A-3. |
| `app/admin/actions.ts` | Existing guide actions must not be modified. New actions go in separate files. |
| `app/admin/guides/**` | All existing guide admin pages are off-limits. |
| `components/admin/GuideEditForm.tsx` | Off-limits — locked patterns per CLAUDE.md. |
| `components/admin/GuideFormFields.tsx` | Off-limits. |
| `components/admin/StepCard.tsx` | Off-limits. |
| `components/admin/StepList.tsx` | Off-limits. |
| `lib/db/reader.ts` | Public reads only — must not be imported in admin. |
| `lib/db/news-events-calendar.ts` | Public reads only — must not be imported in admin. |

---

## 2. Where the New Unified Admin Should Live

### Four options compared

**Option A — Replace existing `/admin/` immediately**

Tear out existing guide admin, rebuild everything from scratch under `/admin/`.

- Pros: Clean slate. No legacy.
- Cons: Breaks the only working content management tool during the rebuild. Guides become uneditable. High risk. Irreversible until rebuild is complete.
- **Verdict: Rejected.**

**Option B — Build separate top-level admin modules: `/admin/news`, `/admin/events`, `/admin/calendar`**

Add one top-level admin module per content type alongside existing `/admin/guides`.

- Pros: Incremental. Each module is independently buildable.
- Cons: **Creates separate admin systems, not a unified admin.** Each module gets its own layout, navigation, and proxy matcher entry. There is no single admin shell tying them together. As content types multiply (areas, life setup, media, homepage modules), the admin fragments into disconnected islands. This is the exact problem the unified admin architecture is designed to prevent.
- **Verdict: Rejected.** Do not build separate top-level admin modules per content type.

**Option C — Build a unified content admin shell at `/admin/content/`**

One new subroute `/admin/content` acts as the unified shell for all new content types. Content types are sections inside it, not separate modules.

- Pros: One admin shell. One navigation. One layout. One auth scope (two proxy matcher lines cover all content types). One shared validation system. One preview workflow. One audit log. One AI assistant layer later. Adding a new content type is additive inside the shell — not a new top-level module.
- Cons: proxy.ts must be extended once (two lines: `/admin/content` + `/admin/content/:path*`) when the shell is created. Slightly deeper URL structure than flat `/admin/news`.
- **Verdict: Recommended — correct architecture.**

**Option D — Separate route outside `/admin/`**

Build at a new top-level route (e.g. `/editor/`, `/cms/`).

- Pros: Complete isolation.
- Cons: Requires a second auth system or session sharing. Login duplication. Users manage two entry points. Doubles the auth surface area. High engineering cost for no user benefit.
- **Verdict: Rejected.**

### Recommendation: Option C — Unified shell at `/admin/content/`

**The new admin is one unified content admin shell, not separate admin systems per content type.**

All new content management lives under `/admin/content/`. Content types are sections/subroutes inside a single shell that shares one layout, one navigation, one auth scope, one validation system, one preview/publish workflow, one audit log, and one future AI assistant layer.

```
/admin/                             (existing — login redirects to /admin/guides)
/admin/guides                       (existing — unchanged, off-limits)
/admin/guides/[slug]                (existing — unchanged, off-limits)

/admin/content                      (new — unified content admin shell)
/admin/content/news                 (new — News section inside unified shell)
/admin/content/news/new             (new)
/admin/content/news/[id]            (new)
/admin/content/events               (new — Events section)
/admin/content/events/new           (new)
/admin/content/events/[id]          (new)
/admin/content/calendar             (new — Calendar Visual Posts section)
/admin/content/calendar/new         (new)
/admin/content/calendar/[id]        (new)

Future sections (same shell, additive):
/admin/content/guides               → guide management migrated here in Phase 4E
/admin/content/services             → future
/admin/content/life-setup           → Phase 4E
/admin/content/areas                → Phase 4E
/admin/content/media                → Phase 4D
/admin/content/homepage             → future
```

**proxy.ts matcher extension — one dedicated implementation step:**

When `/admin/content` is first created (Phase 4A-3), the proxy.ts matcher is extended with exactly two lines — and nothing more:

```typescript
export const config = {
  matcher: [
    "/admin/guides",
    "/admin/guides/:path*",
    "/admin/content",          // added in Phase 4A-3 — one-time extension
    "/admin/content/:path*",   // covers all current and future content sections
  ],
};
```

This two-line extension covers every future content type added under `/admin/content/` — no further proxy changes are needed as new sections are added. This is a single approved implementation step, not a per-content-type change.

**This is the critical architectural advantage of the unified shell:** proxy, layout, navigation, auth, and validation are set up once and shared by all content types. Contrast with Option B, where each new content type requires a new proxy matcher entry, a new layout decision, and independent navigation.

---

## 3. Full Unified Admin Navigation (future state)

This is the target navigation when the unified admin is complete. Not all sections are built in MVP.

All content management sections live inside the unified shell at `/admin/content/`. The old guide admin at `/admin/guides` remains separate until Phase 4E migration.

| Section | Route | MVP | Phase |
|---|---|---|---|
| Unified content shell | `/admin/content` | ✓ (shell only) | 4A-3 |
| AI Inbox | `/admin/content/inbox` | — | 4B |
| News | `/admin/content/news` | ✓ | 4A-4 |
| Events | `/admin/content/events` | ✓ | 4A-5 |
| Calendar Visual Posts | `/admin/content/calendar` | ✓ | 4A-6 |
| Guides / Articles | `/admin/content/guides` | — | 4E (migrated from `/admin/guides`) |
| Services | `/admin/content/services` | — | future |
| Dubai Life Setup | `/admin/content/life-setup` | — | 4E |
| Areas / Map Data | `/admin/content/areas` | — | 4E |
| Tools / Checklists | `/admin/content/tools` | — | future |
| Media Library | `/admin/content/media` | — | 4D |
| Homepage Modules | `/admin/content/homepage` | — | future |
| SEO / Indexing Review | `/admin/content/seo` | — | future |
| Audit Log | `/admin/content/audit` | — | future |
| Settings | `/admin/settings` | — | future |
| Legacy guide admin | `/admin/guides` | existing (untouched) | removed in Phase 4E |

---

## 4. MVP Admin Navigation (Phase 4A only)

The MVP admin creates the unified content shell and three initial content sections inside it. Everything else is deferred.

```
/admin/guides                    (existing — unchanged, off-limits)

/admin/content                   (new — unified shell: nav + layout, Phase 4A-3)
/admin/content/news              (new — Phase 4A-4)
/admin/content/news/new          (new — Phase 4A-4)
/admin/content/news/[id]         (new — Phase 4A-4)
/admin/content/events            (new — Phase 4A-5)
/admin/content/events/new        (new — Phase 4A-5)
/admin/content/events/[id]       (new — Phase 4A-5)
/admin/content/calendar          (new — Phase 4A-6)
/admin/content/calendar/new      (new — Phase 4A-6)
/admin/content/calendar/[id]     (new — Phase 4A-6)
```

The unified shell at `/admin/content` has its own layout component (`app/admin/content/layout.tsx`) with a left-hand or top navigation listing all content sections. This layout is separate from the existing `app/admin/layout.tsx` — no modification to the old layout is needed at MVP.

The proxy.ts matcher is extended with two lines (once, in Phase 4A-3): `/admin/content` and `/admin/content/:path*`. No further proxy changes as sections are added.

No dashboard. No AI Inbox. No media. No homepage editor. No old admin changes.

---

## 5. Data Access and Writer Architecture

### Separation rules (unchanged from CLAUDE.md)

- Public pages import only from `lib/db/reader.ts` or `lib/db/news-events-calendar.ts`
- Admin pages import only from `lib/db/news-events-calendar-admin.ts` (reads) and `app/admin/content/actions/` (writes via server actions)
- Never cross-import
- Existing `lib/db/writer.ts` is not extended — it remains the guide-only admin read module, untouched

### Writer functions — where they live

New admin read functions for news/events/calendar go into a **new dedicated file**: `lib/db/news-events-calendar-admin.ts`.

This keeps the new content admin completely isolated from the existing guide admin (`lib/db/writer.ts`). The two files are independent — `writer.ts` remains the guide-only module, unchanged.

```typescript
// lib/db/news-events-calendar-admin.ts (planned — not yet written)
// Admin reads only — import in admin pages and actions, never in public pages

export function getNewsPostById(id: string): NewsPost | null { ... }
export function getAllNewsPosts(): NewsPostListItem[] { ... }
export function getEventById(id: string): HubEvent | null { ... }
export function getAllEvents(): EventListItem[] { ... }
export function getCalendarPageById(id: string): CalendarPage | null { ... }
export function getAllCalendarPages(): CalendarPageListItem[] { ... }
```

### Validation layer — where it lives

Validation logic goes into a **new dedicated directory**: `lib/admin-validation/`.

```
lib/admin-validation/
  news-events-calendar.ts    Validation functions for all 3 new content types
```

This keeps validation isolated from DB access. Validation functions are pure TypeScript — no DB reads, no server actions, no imports from DB modules. They take plain data objects and return `ValidationResult` — testable independently.

### Server actions — where they live

New server actions go into the unified content admin actions directory, NOT added to the existing `app/admin/actions.ts`:

```
app/admin/content/actions/
  news.ts        News CRUD server actions
  events.ts      Events CRUD server actions
  calendar.ts    Calendar Visual Post CRUD server actions
```

`app/admin/actions.ts` (existing guide actions) is untouched and must not be modified.

### Full file isolation summary

| Old guide admin | New content admin |
|---|---|
| `lib/db/writer.ts` | `lib/db/news-events-calendar-admin.ts` |
| `app/admin/actions.ts` | `app/admin/content/actions/news.ts` etc. |
| `app/admin/guides/**` | `app/admin/content/**` |
| `components/admin/GuideEditForm.tsx` etc. | `components/admin/content/**` (future) |

No file from the old guide admin column is imported by or modified by the new content admin. They are completely separate.

### DB write pattern (same as existing)

All DB writes are inside `"use server"` functions. Actions import from `@/lib/db/connection` and `@/lib/db/schema` directly — not from reader.ts or news-events-calendar.ts.

```typescript
"use server";
import { db } from "@/lib/db/connection";
import { newsPosts } from "@/lib/db/schema";
// ... Drizzle write calls
```

No client component ever calls the DB directly. All mutations go through server actions.

### Status handling

All three new content types use a three-state status:

```
draft      → saved but not public
published  → live on public routes
archived   → hidden from public, preserved in DB
```

Status transitions:
- `draft → published`: requires passing the publish validation gate (see §6)
- `published → archived`: always allowed, no validation required
- `archived → draft`: allowed (restore for editing)
- `published → draft` (unpublish): allowed as a standalone form action (same exception as guide unpublish in CLAUDE.md)

### RU publish gate

`ru_published` is a separate field, independent of `status`. Rules:
- `ru_published` defaults to `0`
- `ru_published = 1` only when `ru_title` and `ru_body` are both non-empty
- Server action must enforce this: attempting to set `ru_published = 1` with empty RU fields throws a validation error
- AI never sets `ru_published = 1` — only a human action can

### No English fallback

If `ru_published = 0`, the RU public route returns `notFound()`. This is enforced in the reader functions (`lib/db/news-events-calendar.ts`) and must never be changed by admin code.

---

## 6. Validation Rules

### News — publish gate

| Field | Rule |
|---|---|
| `enTitle` | Required, non-empty, under 70 characters |
| `enSummary` | Required, non-empty, 1–2 sentences |
| `enBody` | Required, non-empty, minimum 3 sentences |
| `sourceUrl` | Required — no sourceless news. Must be a valid URL. |
| `sourceLabel` | Required — must be one of: `media`, `official`, `government`, `internal` |
| `status` | Must be one of: `draft`, `published`, `archived` |
| `category` | Must be one of: `visa`, `company`, `tax`, `government`, `tourism`, `banking` |
| `datePublished` | Required before publish — ISO date format `YYYY-MM-DD` |
| `noindex` | Warning shown if set to 1 while status = published |

**RU publish gate:**
- `ru_published = 1` only allowed if `ru_title` ≠ "" AND `ru_body` ≠ ""
- Server action throws if this constraint is violated

**Save as draft:** Only `enTitle` is required. All other fields optional for draft save.

### Events — publish gate

| Field | Rule |
|---|---|
| `enTitle` | Required |
| `enSummary` | Required |
| `eventDateStart` | Required before publish — ISO date `YYYY-MM-DD` |
| `eventDateEnd` | Required — if single-day, must equal `eventDateStart` |
| `dateConfidence` | Required — must be one of: `confirmed`, `expected`, `subject_to_official_confirmation` |
| `sourceUrl` | Required when `dateConfidence = confirmed` — no confirmed date without source |
| `colorType` | Required — must be one of: `public-holiday`, `important-date-deadline` |
| `category` | Required — must be one of: `holiday`, `deadline`, `festival`, `government`, `school`, `dubai-event` |
| `year` | Required — integer, derived from `eventDateStart` or manually set |
| `schemaEligible` | Warning: must be `0` if `dateConfidence ≠ confirmed` |

**Islamic date rule:** If `category = holiday` and title contains keywords associated with Islamic holidays (Eid, Ramadan, Mawlid, Muharram, etc.), system warns: "Islamic dates require `subject_to_official_confirmation` until officially announced by UAE authorities." Cannot set `dateConfidence = confirmed` without `sourceUrl` pointing to an official UAE government announcement.

### Calendar Visual Posts — publish gate

| Field | Rule |
|---|---|
| `enTitle` | Required |
| `enSummary` | Required |
| `enBody` | Required — minimum 2 sentences of contextual content (HTML date list is not a substitute for body text) |
| `year` | Required — integer > 2024 |
| `calendarType` | Required — must be one of: `monthly`, `yearly`, `holidays`, `important_dates`, `ramadan` |
| `datesJson` | Required before publish — must be valid JSON array with at least 1 entry |
| `hasIslamicDates` | If `1`, Islamic date disclaimer must be shown in preview — warning if not visible |
| `lastVerifiedDate` | Required before publish — must be a non-empty date string |
| `officialSourceUrl` | Required if any date in `datesJson` has `confirmed: true` |
| `imagePath` | Optional at MVP. If set, `imageAlt` is required. |
| `imageAlt` | Required if `imagePath` is non-empty |

**Image-only rule:** If `imagePath` is set but `datesJson` is empty or `enBody` is empty — publish is blocked. A calendar post must have substantive text content independent of the image.

---

## 7. Preview Architecture

Preview renders a full page representation of the draft content before any publish action. It is a read operation — no DB writes.

### Preview components

| Panel | Content |
|---|---|
| **Page Preview** | Full render of how the content will appear on the public route — EN or RU depending on selected language tab |
| **Warnings Panel** | All validation failures and warnings — blocking (red) vs advisory (amber) |
| **Source Panel** | Source URL, source label, date checked — verifiable before publish |
| **SEO Panel** | SEO title, meta description, canonical URL, noindex status, sitemap eligibility indicator |
| **Language Toggle** | Switch between EN and RU preview — RU preview only shown if `ru_title` and `ru_body` are non-empty |
| **noindex Indicator** | Prominent badge if `noindex = 1` or `status ≠ published` |
| **Sitemap Indicator** | Whether this page is currently in sitemap — gated by status + noindex + content quality |

### Preview routing (two options for implementation)

**Option A — Inline preview panel** (recommended for MVP)

Preview renders below the edit form in the same page. No separate route needed. Server component reads draft state from DB and renders the preview server-side.

**Option B — Separate preview route** (`/admin/news/[id]/preview`)

Cleaner URL. Better for future "share preview" feature. More complex — requires passing draft state.

**Recommendation: Option A for MVP.** Option B can be added later when "share preview" is needed.

### Preview does not publish

The preview is a read-only render. Publish is a separate explicit action (a form submission with `intent = "publish"`). The single-form + intent pattern from CLAUDE.md applies to all new content types — no separate publish button outside the main form.

---

## 8. Forms and Component Architecture

All new admin components go into `components/admin/` (existing directory). No new top-level component directories.

### Planned components

| Component | Type | Purpose |
|---|---|---|
| `ContentTypeTabs` | server | Tab bar switching between News / Events / Calendar in a shared listing view |
| `StatusBadge` | server | Colour-coded badge: draft (grey) / published (green) / archived (amber) |
| `LanguageGatePanel` | server/client | EN/RU section with completeness indicator and ru_published toggle |
| `SourcePanel` | server | Source URL + source label input + date checked display |
| `SeoPanel` | server | SEO title + meta description + canonical + noindex + sitemap eligibility |
| `RelatedContentPanel` | server | Related guide slug + related news slug + related service slug selectors |
| `CalendarDatesEditor` | client | JSON array editor for `dates_json` — add/remove/edit date entries with red/orange toggle |
| `EventDatePanel` | server/client | Start date + end date + date_confidence selector + year (auto-derived) |
| `PreviewFrame` | server | Full-page preview render of draft content |
| `ValidationWarnings` | server | List of blocking errors and advisory warnings before publish |
| `PublishControls` | server/client | Save draft / Save and publish / Unpublish — single `<form>` with `name="intent"` buttons |

### Locked pattern reminder

The single-form + intent pattern (CLAUDE.md §Admin QA Rules) applies to all new content type forms:
- One `<form>` per page section
- `<button name="intent" value="draft">Save draft</button>`
- `<button name="intent" value="publish">Save and publish</button>`
- Unpublish only: may be a separate standalone form (no field data risk)
- Never two separate forms for field edit and publish

---

## 9. Server Actions (planned — not yet implemented)

Location: `app/admin/content/actions/news.ts`, `app/admin/content/actions/events.ts`, `app/admin/content/actions/calendar.ts`

All are `"use server"` files. All validate inputs before DB writes. All return typed results or throw on validation failure.

### News actions

```
createNewsDraft(formData: FormData)     → NewsPost
updateNewsDraft(id, formData: FormData) → NewsPost
publishNews(id, formData: FormData)     → NewsPost   (validates publish gate first)
unpublishNews(id)                       → NewsPost   (standalone form — no field data)
archiveNews(id)                         → void
setNewsRuPublished(id, value: 0 | 1)   → NewsPost   (validates RU completeness first)
```

### Events actions

```
createEventDraft(formData: FormData)     → HubEvent
updateEventDraft(id, formData: FormData) → HubEvent
publishEvent(id, formData: FormData)     → HubEvent
unpublishEvent(id)                       → HubEvent
archiveEvent(id)                         → void
setEventRuPublished(id, value: 0 | 1)   → HubEvent
```

### Calendar actions

```
createCalendarDraft(formData: FormData)     → CalendarPage
updateCalendarDraft(id, formData: FormData) → CalendarPage
publishCalendar(id, formData: FormData)     → CalendarPage
unpublishCalendar(id)                       → CalendarPage
archiveCalendar(id)                         → void
setCalendarRuPublished(id, value: 0 | 1)   → CalendarPage
```

### Action implementation rules

- Every action starts with auth check: `const session = await getServerSession(authOptions); if (!session) throw new Error("Unauthorized");`
- Publish actions run full validation gate before any DB write — throw with field-level error messages on failure
- Draft saves run minimal validation only (enTitle non-empty)
- All writes use `db.insert(...).values({...}).run()` or `db.update(...).set({...}).where(...).run()` — Drizzle ORM directly
- All writes set `updatedAt: new Date().toISOString()`
- No client-side DB access

---

## 10. Security and Permissions

### Auth — reuse existing

The existing NextAuth.js v4 setup is sufficient for MVP. Single owner user. JWT session. No changes to `lib/auth.ts`.

**Required change — one dedicated step in Phase 4A-3:** Extend `proxy.ts` matcher with exactly two lines when `/admin/content` is first created. Do not touch `proxy.ts` before that. Do not add lines speculatively.

```typescript
// proxy.ts — Phase 4A-3 addition only (two lines, covers all future content sections)
"/admin/content",
"/admin/content/:path*",
```

This single extension protects every current and future route under `/admin/content/` — no further proxy changes are needed when new content sections are added inside the shell.

### Server action auth check

Every server action must verify session before any DB operation:

```typescript
const session = await getServerSession(authOptions);
if (!session) throw new Error("Unauthorized");
```

This is defense-in-depth — proxy.ts already blocks unauthenticated requests, but server actions are callable from anywhere and must not assume the caller is authenticated.

### CSRF

Next.js App Router Server Actions have built-in CSRF protection via the `Origin` header check. No additional CSRF token handling is needed. Do not bypass this by using raw fetch to call server actions.

### AI cannot publish or delete

The AI assistant (Phase 4B+) calls server actions on behalf of the manager, but:
- AI-proposed changes land as `status = draft` only
- AI cannot call `publishNews`, `publishEvent`, or `publishCalendar`
- AI cannot call any archive or delete action
- AI cannot modify `proxy.ts`, `lib/auth.ts`, schema, or routes
- These constraints are enforced by the system prompt and by the action layer — AI is never given direct DB access

### Audit log (future — Phase 4A+)

An audit log table will be added to the DB in a later phase. For MVP, all changes are written to the DB with `updatedAt` timestamps. Full before/after diff logging is deferred.

---

## 11. Media Approach

### MVP: manual `image_path`

At MVP, image management is a text field. The manager uploads a file to the server (via SSH or a simple file drop), then pastes the relative path into the `image_path` field in the admin form.

No upload UI. No media library. No image processing.

If `image_path` is set, `image_alt` is required — enforced by the publish validation gate.

### Future: Media Library (Phase 4D)

| Feature | Description |
|---|---|
| Image upload UI | File input in admin, server-side write to `public/uploads/` or CDN |
| File size warning | Flag images over 500 KB before upload |
| WebP conversion guidance | Recommend WebP; warn on oversized JPEG/PNG |
| Image metadata | Alt text (EN + RU), credit/attribution, upload date |
| Image assignment | Attach to news post, event, calendar post, area page, or homepage module |
| Preview | Show image in context before saving |
| Media browser | Gallery view of all uploaded images with search |

---

## 12. AI Runtime (deferred — Phase 4B)

The AI draft assistant is not part of the MVP admin build. When it is added:

| Component | Description |
|---|---|
| Claude API key | Stored in `.env.local` as `ANTHROPIC_API_KEY` — never exposed to browser |
| API route | `app/api/admin/ai-draft/route.ts` — server-side proxy, checks session before calling Claude |
| System prompt | Strict instructions: output format, rules, refusals, no hallucination, source must be attached |
| Prompt versioning | Every system prompt has a version ID — logged with every API call |
| Response logging | Every Claude response stored in `ai_draft_log` table (future schema addition) |
| Human approval | AI output pre-fills form fields — manager edits and approves before any save |
| No direct publish | AI output always lands as `status = draft`, `ru_published = 0` |

---

## 13. Old Admin Migration Strategy

### Current state

The existing guide admin (`/admin/guides`) is the only working content management interface. It must remain fully functional throughout the new admin build.

### Rules during MVP build

| Rule | Detail |
|---|---|
| Do not delete old admin | `/admin/guides` and all its files remain untouched |
| Do not expand old admin | No new features or content types added to old admin files |
| Do not modify `app/admin/actions.ts` | Existing guide actions must not be touched |
| Do not modify guide admin components | `GuideEditForm`, `GuideFormFields`, `StepCard`, `StepList` — off-limits |
| Do not import from old admin files | New content admin files must not import from `writer.ts`, `actions.ts`, or guide admin components |
| Build new content admin in its own shell | All new routes live under `/admin/content/` — completely separate from old admin |

**The new admin is intended to eventually replace the old admin — but during MVP it is built as a parallel unified content admin shell, beside the old guide admin, without breaking or deleting it.** Guide management moves to the new shell only in Phase 4E, after the shell is stable and the migration is explicitly approved.

### Guide migration (Phase 4E — future)

When the unified admin is complete and stable, guide content management will be migrated to the new system. This requires:
1. New guide admin pages matching or exceeding existing guide admin functionality
2. EN/RU field management (existing guides use a different column structure than news/events/calendar)
3. Step management equivalence
4. Feature parity verified and owner-approved

**Old admin removed only after explicit owner approval of feature parity.** No timeline is set for this — it depends on how quickly Phase 4A–4D are completed and validated.

---

## 14. Implementation Phases

### Phase 4A-1 — Audit and plan (this document)

Audit existing admin structure. Write unified admin architecture plan. No code.

### Phase 4A-2 — Writer functions and validation layer

Before any UI or routes are created, write the pure-logic foundation that all later phases build on.

- Create `lib/db/news-events-calendar-admin.ts` — 6 admin read functions for news, events, calendar (do NOT extend `writer.ts`)
- Create `lib/admin-validation/news-events-calendar.ts` — pure validation functions, no DB access
- Create server action stubs in `app/admin/content/actions/news.ts`, `events.ts`, `calendar.ts` — signatures + auth checks only, no UI wired yet
- Verify: `npm run build` passes with 0 errors
- No admin UI. No routes created. No proxy.ts changes. No DB schema changes. Existing guide admin untouched.

> See §16 for the exact implementation prompt for this phase.

### Phase 4A-3 — Unified content admin shell

- Create `app/admin/content/layout.tsx` — unified shell layout with section navigation (News / Events / Calendar)
- Create `app/admin/content/page.tsx` — minimal shell landing page (content index)
- **Extend `proxy.ts` matcher** with two lines: `/admin/content` and `/admin/content/:path*` — this is the one approved proxy change for all content sections
- Verify auth: unauthenticated access to `/admin/content` is blocked; existing `/admin/guides` still works
- `app/admin/layout.tsx` is NOT modified — old admin shell remains as-is

### Phase 4A-4 — News CRUD

- `/admin/content/news` — list all news posts (draft / published / archived filter)
- `/admin/content/news/new` — create news draft
- `/admin/content/news/[id]` — edit: all fields, EN/RU, source, SEO, publish controls
- Preview panel inline
- Validation warnings panel
- All news server actions wired
- Local QA: create draft → fill fields → publish → verify public reader returns it on `/news`

### Phase 4A-5 — Events CRUD

- Same structure inside `/admin/content/events/`
- `EventDatePanel` component: start date, end date, date_confidence selector
- Islamic date warning wired
- `schemaEligible` auto-set based on `dateConfidence`
- Local QA: create event → publish → verify reader returns it on `/events`

### Phase 4A-6 — Calendar Visual Posts CRUD

- Same structure inside `/admin/content/calendar/`
- `CalendarDatesEditor` client component: JSON array editor for `dates_json`
- `hasIslamicDates` toggle wired to Islamic disclaimer in preview
- `lastVerifiedDate` required before publish
- Local QA: create calendar post → publish → verify reader returns it on `/calendar`

### Phase 4A-7 — Preview and publish gates

- Full preview panel implemented across all three content types
- Blocking validation errors prevent publish (UI enforces, server action enforces)
- Advisory warnings shown but do not block
- RU completeness indicator
- noindex indicator
- Sitemap eligibility indicator

### Phase 4A-8 — Local QA with sample content

- Insert one real news post, one event, one calendar page via the new admin
- Verify: list view, edit, save-as-draft, publish, RU fields, preview, reader pick-up
- Verify: existing guide admin still works (regression check)
- Verify: no admin bundle contamination in public pages (`npm run build` + check output)

### Phase 4A-9 — Production DB migration and deploy

- Follow `docs/phase-3-news-events-calendar-production-deploy-checklist.md`
- DB migration already planned (tables exist in SQL — already applied locally)
- On production: confirm tables exist, run code deploy, smoke test
- Sample content inserted after deploy verified

### Phase 4B — AI draft assistant

Claude API integrated into admin. AI Inbox page. Manager pastes source → AI fills draft fields → human edits and publishes. No autopublish.

### Phase 4C — Source monitoring

Source Registry. Suggestion queue. Assisted monitoring. Human selects what becomes a draft.

### Phase 4D — Media library

Image upload, alt text, preview, WebP guidance, media browser.

### Phase 4E — Old admin replacement

Dubai Life Setup area/map data admin. Guide content migration. Old admin removed after feature parity confirmed and owner-approved.

---

## 15. What Must Not Be Done in MVP

| Action | Status |
|---|---|
| AI runtime / Claude API calls | Deferred to Phase 4B |
| Autopublish of any content | Never in Phase 4A |
| Source monitoring | Deferred to Phase 4C |
| Old admin deletion | Deferred to Phase 4E — only after feature parity |
| Guide content migration | Deferred to Phase 4E |
| Homepage editor | Not in scope for Phase 4A |
| Sitemap automation | Not in scope — sitemap updated manually |
| Media upload UI | Deferred to Phase 4D — manual `image_path` at MVP |
| Production deploy in this planning task | Not yet — deploy is Phase 4A-9 |
| DB schema changes | Not needed — schema already complete (Phase 3A) |
| Changes to `proxy.ts` | Only when new routes are built — not speculatively |
| Changes to `lib/auth.ts` | Not needed |
| Changes to existing guide admin | Off-limits |

---

## 16. Exact Next Step After Approval

**Phase 4A-2: Writer functions and validation layer — local only.**

The smallest safe next implementation step is to write the pure-logic validation layer and new admin read functions, with no UI, no new routes, and no proxy changes.

Before beginning implementation, prepare a Phase 4A-2 implementation prompt that gives the implementation session full context:
- Reference this document (§5, §6, §9)
- State which files to create and which files must NOT be touched
- State the exact function signatures to implement
- State the build verification step
- State that no routes, no proxy changes, and no UI are part of this step

### What Phase 4A-2 creates

1. **`lib/db/news-events-calendar-admin.ts`** — 6 new admin read functions (do NOT modify `writer.ts`):
   - `getAllNewsPosts()` → `NewsPostListItem[]`
   - `getNewsPostById(id: string)` → `NewsPost | null`
   - `getAllEvents()` → `EventListItem[]`
   - `getEventById(id: string)` → `HubEvent | null`
   - `getAllCalendarPages()` → `CalendarPageListItem[]`
   - `getCalendarPageById(id: string)` → `CalendarPage | null`

2. **`lib/admin-validation/news-events-calendar.ts`** — pure validation functions (no DB access):
   - `validateNewsPublish(data)` → `ValidationResult`
   - `validateEventPublish(data)` → `ValidationResult`
   - `validateCalendarPublish(data)` → `ValidationResult`
   - `validateRuPublish(data)` → `ValidationResult` (shared across types)
   - `ValidationResult` type: `{ valid: boolean; errors: string[]; warnings: string[] }`

3. **`app/admin/content/actions/news.ts`**, **`events.ts`**, **`calendar.ts`** — server action stubs:
   - `"use server"` directive
   - Auth check at top of every action
   - Calls to validation functions
   - No full DB write implementation yet (stubs return `TODO` or throw `new Error("Not yet implemented")`)

4. **Verify**: `npm run build` passes with 0 errors. No new routes appear in build output. No admin UI changed. Existing guide admin works.

### What Phase 4A-2 does NOT touch

| File | Status |
|---|---|
| `proxy.ts` | No changes — no routes exist yet |
| `app/admin/layout.tsx` | No changes |
| `lib/db/writer.ts` | No changes — guide admin only, off-limits |
| `lib/db/reader.ts` | No changes |
| `lib/db/news-events-calendar.ts` | No changes — public reads only |
| Any `app/admin/guides/**` file | Off-limits |
| Any existing `components/admin/` file | Off-limits |
| Production server | Not touched |

This step produces working, tested server-side logic that Phase 4A-3 through 4A-6 build on. It can be reviewed and the build verified in isolation before any UI is built.

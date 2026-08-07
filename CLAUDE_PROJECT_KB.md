# Dubai Guide Site — Claude Project Knowledge Base

**Version:** 2026-08-07
**Source of truth:** This file is a snapshot derived from the repo's `PROJECT_STATE.md`, `CLAUDE.md`, `DECISIONS.md`, `ROADMAP.md`, and `SESSION_LOG.md`. When in doubt, the repo files are authoritative.

---

## What This Project Is

A premium, mobile-first Dubai knowledge hub. It helps expats and entrepreneurs understand official UAE procedures step by step — visas, company setup, hiring, relocation, government processes. It is a **content site with an owner-only admin panel**, not a web app. It has no users, no sign-up flow, and no customer-facing auth.

**Product mission:** Be the clearest, most useful English reference for Dubai procedures. Rank on Google. Be cited by AI answer engines. Help the reader understand the process before they hire a consultant.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3, App Router, Turbopack |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (with custom `@theme` color tokens) |
| Database | SQLite via `better-sqlite3` + Drizzle ORM (file: `data/guides.db`) |
| Admin auth | NextAuth.js v4, CredentialsProvider, bcryptjs, JWT sessions |
| Route protection | `proxy.ts` (NOT `middleware.ts` — deprecated in Next.js 16) |
| Deployment target | UpCloud VPS — 85.9.203.69 (Ubuntu 24.04), PM2: guidex-production, app path: /var/www/guidex |

**No external services.** No CMS, no cloud DB, no email service, no analytics SDK.

---

## Architecture

### Directory structure (key paths)

```
app/
  (public)/             ← public site — route group, no URL effect
    layout.tsx          ← wraps all public pages in Header
    page.tsx            ← home page
    guides/
      page.tsx          ← guide list — all published guides
      [slug]/page.tsx   ← guide detail — SSG + on-demand ISR
    about/   contact/
  admin/                ← owner-only panel — isolated layout, no public Header
    layout.tsx
    login/page.tsx      ← credentials login
    guides/
      page.tsx          ← guide list (drafts + published)
      new/page.tsx      ← create guide
      [slug]/page.tsx   ← edit guide (thin server component)
    actions.ts          ← ALL Server Actions for guides and steps
  api/auth/[...nextauth]/

components/
  CategoryIcon.tsx      ← 5 inline SVG micro-icons (14×14, currentColor)
  GuideHeader.tsx       ← guide page header block
  StepCard.tsx          ← public step rendering
  TopicCard.tsx         ← guide card on list pages
  Hero.tsx              ← home page hero section
  Header.tsx            ← public navigation bar
  admin/
    GuideEditForm.tsx   ← client component — single form, dirty tracking
    GuideFormFields.tsx ← server component — guide input fields
    StepCard.tsx        ← admin per-step edit card
    StepList.tsx        ← step list + Add step button
    SavedBanner.tsx     ← 3s auto-hide success banner
    AdminLogout.tsx
    DeleteGuideButton.tsx ← legacy/unused

lib/
  db/
    schema.ts           ← Drizzle schema: guides + steps tables
    connection.ts       ← SQLite singleton (WAL mode, FK enforcement)
    reader.ts           ← read-only queries — public pages only
    writer.ts           ← admin read queries — writes go through actions.ts
  auth.ts               ← NextAuth config
  revalidate.ts         ← revalidatePath wrapper called after every save
proxy.ts                ← route protection
```

### Key architectural patterns

**Public/admin code separation (hard rule):** Public pages import only `lib/db/reader.ts`. Admin pages use `lib/db/writer.ts` for reads. Never cross-import. Admin JS bundle never loads on public pages.

**Server Actions:** All writes go through `app/admin/actions.ts`. No direct DB mutations in page components.

**Single-form intent pattern (hard rule):** Guide save and publish happen in one `<form>` with `name="intent" value="draft|publish"` buttons. A standalone Publish form would silently discard unsaved field edits — this is a known anti-pattern that was fixed and must not be reintroduced. Unpublish is the only allowed standalone form.

**Step mutations use `router.refresh()`, not redirect:** Step CRUD actions (create/update/delete/reorder) do not redirect. The client calls `router.refresh()` after each action so server components re-render with fresh data while the guide form (which may have unsaved edits) keeps its client state.

**`key` on outer form component:** After a guide save redirect, the page passes `key={saved ?? "init"}` to `<GuideEditForm>`. This forces a full remount, resetting `defaultValue` attrs to show fresh DB data. Inner elements must NOT carry a key with the same timestamp value — that causes React's duplicate-key warning.

**bcrypt hash in `.env.local`:** All `$` characters in `ADMIN_PASSWORD_HASH` must be escaped as `\$`. dotenv-expand treats unescaped `$` as variable references and silently corrupts the hash.

**`serverExternalPackages: ["better-sqlite3"]` in `next.config.ts`:** Must stay. Prevents Turbopack from attempting to bundle the native SQLite module.

---

## Database Schema

### `guides` table

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID |
| slug | text unique | URL-safe identifier, e.g. `employment-visa` |
| category | text | One of: `visas`, `company-setup`, `hiring`, `living`, `government` |
| published | integer (boolean) | 0 = draft, 1 = published |
| price | text | e.g. "AED 4,900 – 7,300" |
| timeline | text | **Required.** e.g. "2–4 weeks" |
| last_updated | text | e.g. "April 2025" |
| created_at | text | ISO timestamp |
| updated_at | text | ISO timestamp |
| en_title | text | English title |
| en_summary | text | 1–2 sentence summary / meta description |
| en_audience | text | Who the guide is for |
| en_overview | text | Multi-paragraph overview (paragraphs separated by `\n\n`) |
| ru_title, ru_summary, ru_audience, ru_overview | text | Russian equivalents — default empty string |

### `steps` table

| Column | Type | Notes |
|---|---|---|
| id | text PK | UUID |
| guide_id | text FK | References guides.id, cascade delete |
| step_order | integer | 1-based, contiguous |
| cost | text | e.g. "AED 323" |
| time_est | text | **Required.** e.g. "2–3 days" |
| en_title | text | 3–6 word action title |
| en_what | text | 1–2 sentences — the action |
| en_where | text | Authority or service center name |
| en_address | text | "Any [name] branch in Dubai" or portal URL |
| en_advice | text | Optional practical tip |
| en_warning | text | Optional — only for genuine risk |
| ru_* | text | Russian equivalents — default empty string |

---

## Completed Phases

| Phase | What | Status |
|---|---|---|
| 1 | SQLite data layer migration (replaced MDX + metadata.ts) | ✅ |
| 2 | Admin foundation: auth, guide list, route protection | ✅ |
| 3A | Guide CRUD: create, edit, publish, unpublish, delete, ISR | ✅ |
| 4 | Inline step management: add, edit (per-step save), delete with renumber, up/down reorder | ✅ |
| 4.5 | Public visual identity polish (navy/brass tokens, CategoryIcon, stone-50 cards, navy CTA card) | ✅ |
| 4.6 | Real production guide + content writing standard + required timeline validation | ✅ |

---

## Public Site — Current State

### Pages

| URL | Status |
|---|---|
| `/` | Live — hero + guide list from SQLite |
| `/guides` | Live — all published guides |
| `/guides/[slug]` | Live — SSG + on-demand ISR |
| `/about` | Live — static |
| `/contact` | Live — static (WhatsApp / Instagram / Facebook links) |

### Current published guides: 1

**`employment-visa`** — "How to Get an Employment Visa in Dubai Without Leaving the UAE"
- Category: visas
- Route: inside-country (status change, no UAE departure)
- Price: AED 4,900 – 7,300 (depends on labor category)
- Timeline: 2–4 weeks overall
- Last updated: April 2025

**8 steps:**

| # | Title | Cost | Time |
|---|---|---|---|
| 1 | Submit Offer Letter, Labor Card, and Work Permit | AED 278 | 2–3 days |
| 2 | Pay Labor Card Insurance and MOHRE Labor Fee | AED 189 + AED 1,285 (Cat 1/2) or 3,555 (Cat 3) | 2–3 days |
| 3 | Apply for Inside-Country Entry Permit | AED 1,126 | 2–3 days |
| 4 | Change Visa Status | AED 676 | 2–3 days |
| 5 | Complete Medical Fitness Test | AED 323 | 2–3 days |
| 6 | Register for Emirates ID | AED 386 | 2–3 days |
| 7 | Final Labor Card Submission | AED 78 (skilled/Tasheel) or AED 152 (limited skilled/Tawjeeh) | 2–3 days |
| 8 | Residence Visa Issuance | AED 546 | 2–3 days |

Service centers: Tasheel (Steps 1–2, 7 skilled), Amer (Steps 3–6, 8), Tawjeeh (Step 7 limited skilled)

---

## Visual Design System

**Brand color tokens (Tailwind v4 `@theme` in `globals.css`):**

| Token | Value | Usage |
|---|---|---|
| `--color-navy` | `#1B2E4B` | Step number bubbles, advice blocks, guide CTA card |
| `--color-brass` | `#B5935A` | Category icons, section overlines, category pill backgrounds, CTA link color |

**Component visual state:**
- `TopicCard`: `bg-stone-50 border-stone-200` surface; `bg-brass/[.08] text-brass/80` category pill
- `StepCard` (public): `bg-navy` step bubble; `bg-navy/[.06] text-navy` advice block
- `Hero`: value cards have `border-l-2 border-brass`
- `GuideHeader`: brass CategoryIcon beside category label
- Guide detail page: brass overline (`w-6 h-0.5 bg-brass`) above Overview and Steps headings
- Guide detail page: navy CTA card (`bg-navy rounded-2xl`) at the bottom of every guide

**CategoryIcon.tsx:** 5 inline SVG icons — visas (passport), company-setup (building), hiring (person), living (house), government (seal). 14×14, 1.5px stroke, round caps, `currentColor`, `aria-hidden="true"`.

**No new dependencies were added.** All visual work used Tailwind utilities and inline SVG.

---

## Admin — Current Features

| Feature | Status |
|---|---|
| Login (`/admin/login`) | Working |
| Route protection (proxy.ts) | Working |
| Guide list | Working — shows all (draft + published) |
| Create guide | Working — saves as draft |
| Edit guide | Working — single form, Save draft + Save and publish |
| Publish / unpublish | Working |
| Delete guide | Working — inline confirm dialog |
| Unsaved-changes guard | Working — dirty tracking, `beforeunload`, back-nav confirm dialog |
| Success banner | Working — 3s auto-hide green banner |
| Step management | Working — inline below guide form |
| Guide timeline required | Working — `required` HTML + server-side throw |
| Step timeEst required | Working — `required` HTML + server-side throw |
| RU content fields | Present in form — editable but not rendered on public site |

---

## Content Writing Standard

All guides must follow this standard. The full binding rule is in `CLAUDE.md`. Summary:

**Per field:**
- **Title:** specific, searchable, ≤70 chars — no "Ultimate Guide" framing
- **Summary:** 1–2 sentences max — works as meta description
- **Who this is for:** 1–2 sentences — exact reader, not vague category
- **Overview:** 2 paragraphs max — (1) route + who handles it, (2) cost + timeline + reader's role
- **Step title:** 3–6 words, action-oriented
- **Step what:** 1–2 sentences — the action, not the background
- **Step where:** authority name only
- **Step address:** "Any [name] branch in Dubai" or portal URL — never invented
- **Advice:** only if it adds real value the reader couldn't guess
- **Warning:** only for genuine risk of error, delay, or money lost

**Style:**
- Short declarative sentences
- No em-dash-heavy phrasing
- No theatrical framing
- No filler transitions
- Specific numbers: AED amounts, day counts
- Official terms: MOHRE, ICA, GDRFA, Tasheel, Amer, Tawjeeh

**SEO:** complete pages, natural keyword presence (official process terms, service center names, fee ranges), no keyword stuffing, every guide rankable as a direct Google landing page.

**Reference implementation:** the `employment-visa` guide.

---

## Validation Rules (enforced in code)

- Guide `timeline`: required in form + server action throws if empty
- Step `timeEst`: required in form + server action throws if empty
- Guide `enTitle`: required in form (existing)

---

## SEO Architecture

- Public pages are SSG (statically generated) + on-demand ISR after admin save
- `<title>`: `{guide.title} — Dubai Guide`
- `<meta description>`: `{guide.summary}`
- URL slugs are set at creation and must never change after publication
- Russian pages at `/ru/guides/[slug]` planned for Phase 5 — not yet live

---

## Open Decisions (not finalized)

**Category taxonomy — NOT owner-approved as final.**
The five values currently in code are: `visas`, `company-setup`, `hiring`, `living`, `government`. These exist as working defaults. The owner has not confirmed this is the permanent taxonomy. Do not treat it as locked in discussions. Any future change requires updating the `CATEGORIES` constant in `components/admin/GuideFormFields.tsx` and the `CategoryIcon.tsx` component.

**Russian public rendering (Phase 5) — not yet planned in detail.** RU fields exist in DB and admin. No locale routing built.

**Sitemap.xml and JSON-LD (Phase 7) — not yet built.**

**Cloudways deployment (Phase 8) — not yet done.**

---

## Current Next Step

**Second article: Dependent / Family Visa guide for children.**
- Two variants expected: inside-country and outside-country
- Owner decides which variant to write first and provides pricing source
- Same writing standard as `employment-visa` guide
- Same 8-field step structure

After that: Phase 5 (Russian public rendering), Phase 7 (sitemap + structured data), or Phase 8 (Cloudways deployment) — owner priority call.

---

## Memory and Continuity Workflow

**Claude Code is the source of truth.** All code, content, and architecture live in the repo. The following files maintain project state and must be updated after every meaningful implementation step:

| File | Purpose |
|---|---|
| `CLAUDE.md` | Permanent rules — architecture, admin QA, content writing standard, memory maintenance rule |
| `PROJECT_STATE.md` | Current project status — what's built, blockers, next step |
| `SESSION_LOG.md` | Reverse-chronological implementation log |
| `CHECKPOINTS.md` | Verified stable milestones |
| `ROADMAP.md` | Phase history and upcoming phases |
| `DECISIONS.md` | Architecture decisions and rationale |
| `HANDOFF_PROMPT.md` | Full new-chat handoff with rules list |
| `NEW_CHAT_TRANSFER.txt` | Compact new-chat transfer with paste text |
| `CLAUDE_PROJECT_KB.md` | **This file** — Claude Project knowledge base snapshot |

**Automated guard:** `.claude/settings.json` runs `.claude/memory-guard.sh` on Claude Code session stop. The script warns (exits 0, never blocks) when source files in `app/`, `components/`, `lib/`, `proxy.ts`, or `next.config.ts` are newer than `PROJECT_STATE.md`, or when `PROJECT_STATE.md` is newer than `CLAUDE_PROJECT_KB.md`.

---

## Known Cleanup Debt

- `components/admin/DeleteGuideButton.tsx` — unused. Delete logic was moved inline to `GuideEditForm.tsx`. Safe to delete.
- `docs/admin-architecture.md` — partially outdated. References old `middleware.ts` and old `writer.ts` patterns. Useful for architectural context but not a literal code reference.

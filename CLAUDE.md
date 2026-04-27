# Dubai Guide Site — Project Instructions

This is the permanent project rulebook. These rules override any default assistant behavior. Do not deviate without explicit owner approval.

---

## Project Overview

A premium, mobile-first Dubai knowledge hub. Lightweight, calm, Apple-inspired. Not a web app — a content site with an owner-only admin panel built into the same Next.js project.

**Goal:** Help users understand Dubai procedures — company setup, visas, hiring, relocation, government processes — through clean, structured, step-by-step guides.

---

## Architecture Rules (locked)

- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS v4
- **Database:** SQLite via `better-sqlite3` + Drizzle ORM — file at `data/guides.db`
- **Public pages** import only from `lib/db/reader.ts` (read-only queries)
- **Admin pages** import only from `lib/db/writer.ts` (read/write queries)
- Admin and public share **no layout, no state, no rendering components**
- Admin JS bundle must **never** appear in public page bundles (Next.js route-level code splitting enforces this)
- No heavy CMS. No external content platform. No external auth service.
- `next.config.ts` must keep `serverExternalPackages: ["better-sqlite3"]` to prevent Turbopack from bundling the native module
- Route protection uses `proxy.ts` (Next.js 16 convention — NOT `middleware.ts`, which is deprecated in this version)
- Auth: NextAuth.js v4, CredentialsProvider, bcryptjs (pure JS — NOT native `bcrypt`)
- bcrypt hashes in `.env.local` must escape `$` as `\$` to prevent dotenv-expand corruption

---

## Public Site Rules (locked)

- Mobile-first. Clean white background. No visual clutter.
- Articles must scroll as one beautiful vertical experience — no swipe-based step screens
- First screen shows as much useful information as possible without feeling overloaded
- Do not invent random styles. Preserve all existing design patterns.
- No stock photos of people. Micro-visual system only — no random illustrations.
- Public URLs must never change without explicit approval (`/guides/[slug]`)
- All guide pages render from SQLite via `reader.ts` — never import admin or writer code

---

## Content Structure (locked)

**Every guide has:**
- Title, short summary (for cards + meta description), estimated price, estimated timeline
- "Who this is for" (audience)
- Multi-paragraph overview
- Chronological steps (managed separately via the steps table)

**Every step has:**
- Step number, what to do, where to go, address/place, estimated cost, estimated time, advice, warning (optional)

---

## Category Taxonomy (locked)

Categories are a fixed, centrally managed list. Do not allow free-text category input. The five valid values are:

| Value | Label |
|---|---|
| `visas` | Visas |
| `company-setup` | Company Setup |
| `hiring` | Hiring |
| `living` | Living |
| `government` | Government |

Any change to this list requires updating both the schema and the `CATEGORIES` constant in `components/admin/GuideFormFields.tsx`.

---

## Language Rules (locked)

- **English is the primary language and source of truth**
- Russian is the secondary language
- All DB columns are bilingual from day one (`en_*` and `ru_*` flat columns)
- Russian fields default to empty string — valid until translated
- When Russian is live, a language switcher must exist in the top navigation
- URL pattern: `/guides/[slug]` for EN default, `/ru/guides/[slug]` for Russian
- **Future:** Admin should support "Generate RU draft from EN" using the Claude API — populates `ru_*` fields with a draft translation, editable before saving. Do not build this until EN content workflow is complete and stable.
- Public pages must fall back to EN if the Russian field is empty

---

## SEO Rules (locked)

- Organic search and AI discoverability are the primary acquisition channel
- All guide pages must be statically rendered (SSG/ISR) — never client-fetched
- `<title>` and `<meta description>` must always be populated from guide data
- URL structure must not change
- Structure all content clearly for search engines and AI readability
- No unnecessary JavaScript on public pages

---

## Admin QA Rules (mandatory — do not skip)

- **Never split field-edits and publish into separate HTML `<form>` elements.** Clicking a standalone Publish form submits only the hidden toggle — all unsaved field edits are silently discarded. The locked solution is: single `<form>` with `name="intent"` submit buttons (`value="draft"` and `value="publish"`).
- **Every save action must write all editable fields.** Never write a Server Action that only updates a subset of columns while a full edit form is on the same page.
- **Unpublish is the only standalone toggle allowed** — it carries no field data risk. Even so, the UI must show a dirty-state warning if the form has unsaved changes.
- **After any admin form change, manually test:** edit a field → click "Save and publish" → verify the field change AND the published flag are both written to the DB.
- **React key rule:** Never give two sibling elements the same key. In `GuideEditForm`, the outer `<GuideEditForm key={saved ?? "init"}>` in the page handles full remount on save — inner elements (`<form>`, `<SavedBanner>`) must NOT also carry a `key` set to the same timestamp value.

---

## Project-Memory Maintenance Rule (mandatory)

After every meaningful implementation step, always update the relevant memory files **before declaring the step complete**.

### What counts as a meaningful step

Update memory when you complete any of these:
- A new feature or phase (even partially)
- A bugfix that changed observable behavior
- An architecture or workflow decision
- A new blocker discovered or resolved
- A verified stable milestone (add a checkpoint)

Do NOT update memory for: typo fixes, comment edits, reformatting, failed experiments that were reverted, or trivial config tweaks.

### Files to update

| File | Update when |
|---|---|
| `PROJECT_STATE.md` | After every meaningful step — current status, blockers, next step |
| `SESSION_LOG.md` | After every meaningful step — one short reverse-chronological entry |
| `CHECKPOINTS.md` | When a phase or milestone is fully verified |
| `NEW_CHAT_TRANSFER.txt` | When current phase or next step changes |
| `ROADMAP.md` | When a phase starts, completes, or scope changes |
| `DECISIONS.md` | When a new architecture or product decision is made |
| `HANDOFF_PROMPT.md` | When project state changes materially |
| `SEO_STRATEGY.md` | When search or content strategy changes |
| `CLAUDE_PROJECT_KB.md` | When project state changes materially — this is the Claude Project knowledge base snapshot; keep it in sync with `PROJECT_STATE.md` |

### Automated guard

`.claude/settings.json` configures a `Stop` hook that runs `.claude/memory-guard.sh` when Claude finishes a task. The script warns (but does not block) if files in `app/`, `components/`, `lib/`, `proxy.ts`, or `next.config.ts` are newer than `PROJECT_STATE.md`.

If the guard fires and the step was meaningful — update the memory files. If the step was trivial — you can ignore it.

This is a permanent workflow requirement, not optional. Future sessions depend on these files being accurate.

---

## Local Dev Server Rules

Whenever starting the local dev server:

1. Bind to `0.0.0.0`: `npm run dev -- --hostname 0.0.0.0`
2. Detect local IP: `ipconfig getifaddr en0` (or `en1` as fallback)
3. Stop any running dev server first
4. Always print both URLs:
   - Desktop: `http://localhost:3000`
   - iPhone: `http://<LOCAL_IP>:3000`
5. If port differs from 3000, print the actual port
6. If local IP cannot be detected, say so explicitly

---

## Content Writing Standard (locked)

All guides must follow this standard. Apply when writing new guides and reviewing existing ones. The reference implementation is the `employment-visa` guide (April 2025 rewrite).

### One intent per guide

- Each guide targets one clear search query and user intent
- Every guide page must be able to rank as a standalone article — no homepage context required
- Keyword focus: official process names, service center names (Tasheel, Amer, Tawjeeh, GDRFA, MOHRE, ICA), fee ranges, visa/license type names

### Field-level rules

**Title** — specific, searchable, direct. No "Ultimate Guide" framing. No vague questions.
- Good: "How to Get an Employment Visa in Dubai Without Leaving the UAE"
- Bad: "Everything You Need to Know About Dubai Employment Visas"

**Summary** — 1–2 sentences max. Must work as the meta description. States what the guide covers, the process type, and notable specifics (fees, service centers). No sentence over 30 words.

**Who this is for** — 1–2 sentences. Describes the exact reader, not a vague category.
- Good: "Employees already in the UAE on any visa status, sponsored by a Dubai mainland employer."
- Bad: "People who want to work in Dubai."

**Overview** — 2 short paragraphs max.
- Para 1: what the route is + who handles it
- Para 2: total cost range, timeline, the reader's role
- Do not restate the step list. Do not narrate what is about to happen.

**Steps**
- Title: short, action-oriented, 3–6 words
- What: 1–2 sentences max — describe the action, not the background
- Where: name of authority or service center only
- Address/portal: "Any [name] branch in Dubai" or a specific portal URL — never invent physical addresses
- Advice: only when it adds real value the reader could not guess
- Warning: only for genuine risk of error, delay, or money lost

### Style rules (all fields)

- Short declarative sentences
- No em-dash-heavy phrasing
- No theatrical framing ("This is the pivot of the process")
- No filler transitions ("Once complete, you will then proceed to…")
- No repeated explanations across fields — say it once, in the right field
- Specific numbers when available: AED amounts, day counts, year durations
- Use official terms where they exist: MOHRE, ICA, GDRFA, Tasheel, Amer, Tawjeeh

### SEO rules for content

- Pages must be complete, not thin — all structural fields filled per step
- 2 solid overview paragraphs > 4 bloated ones
- Keyword presence through accurate content — process names, service centers, official body names, fee ranges appear naturally
- No keyword stuffing
- Every guide must be linkable and rankable as a direct Google landing page

---

## Deployment and Source-of-Truth Rules (locked)

- **Code source of truth: GitHub** (`Yessenof/dubai-guide-site`). All code, components, config, docs, and memory files must be committed and pushed.
- **Production DB source of truth: local backups** (`backups/production-db/`). `data/guides.db` is never committed to git. Pull it from Cloudways before every deploy using `./scripts/db-backup-from-server.sh`.
- **Cloudways is runtime only.** It is not a backup. The site must survive server deletion, billing failure, or accidental overwrite.
- **Env secrets are stored out-of-band.** `.env.local` is never committed. Keep a secure local copy.
- **Never overwrite production DB without a server-side timestamped backup first.** Use `./scripts/db-restore-to-server.sh` — it enforces this.
- **When switching domains:** `NEXT_PUBLIC_SITE_URL` is baked at build time. Changing it requires updating `.env.local` on the server AND running `npm run build` before restarting PM2. Never skip the rebuild.
- **Memory files are code.** `PROJECT_STATE.md`, `SESSION_LOG.md`, `CHECKPOINTS.md`, `NEW_CHAT_TRANSFER.txt`, `DECISIONS.md`, `ROADMAP.md`, `HANDOFF_PROMPT.md`, `SEO_STRATEGY.md`, `CLAUDE_PROJECT_KB.md` must be committed after every meaningful implementation step.

---

## Workflow Rules

- Always preserve design consistency and mobile-first layout
- Do not change the information architecture without owner approval
- Do not add features beyond what was asked
- Do not overengineer. Do not add abstractions for one-time operations.
- Keep components reusable. Keep the project lightweight.
- Structure all pages clearly for SEO and AI readability.

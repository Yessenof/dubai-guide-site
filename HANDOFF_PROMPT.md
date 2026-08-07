# Handoff Prompt — Dubai Guide Site

Paste this into a new chat to continue this project with minimal context loss.

---

## Prompt to paste

I'm working on a Next.js website called Dubai Guide. It's a premium, mobile-first content site helping expats and entrepreneurs understand Dubai procedures (visas, company setup, hiring, relocation). It's a content site with an owner-only admin panel — not a web app.

Please read these files first before doing anything else:

1. `CLAUDE.md` — permanent rules (architecture, admin QA, content writing standard, memory maintenance)
2. `PROJECT_STATE.md` — current project status, what's built, blockers, next step
3. `NEW_CHAT_TRANSFER.txt` — compact current-state summary and rules list
4. `CHECKPOINTS.md` — last verified stable milestones
5. `SESSION_LOG.md` — recent implementation steps

---

## What's built (as of 2026-08-07)

**Tech stack:**
- Next.js 16.2.3 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- SQLite via `better-sqlite3` + Drizzle ORM — database at `data/guides.db`
- NextAuth.js v4 + bcryptjs — owner-only admin auth (credentials, JWT sessions)
- Route protection: `proxy.ts` (NOT `middleware.ts` — deprecated in Next.js 16)
- No external services

**Public site (`app/(public)/`):**
- Home, guide list (`/guides`), guide detail (`/guides/[slug]`), about, contact
- Reads from `lib/db/reader.ts` — SSG + on-demand ISR
- 1 published guide: `employment-visa` — real production content (see below)
- Russian fields exist in DB but public site only renders English
- Brand design tokens: `--color-navy: #1B2E4B`, `--color-brass: #B5935A`
- CategoryIcon.tsx: 5 inline SVG micro-icons per category
- TopicCard: stone-50 surface, brass/8 category pill
- Guide detail: navy CTA card at bottom of every guide

**Admin (`app/admin/`):**
- Login page with credentials auth
- Guide list (drafts + published)
- Create guide form
- Edit guide form: Save draft, Save and publish, Unpublish, Delete, unsaved-changes guard
- Full inline step management: add, edit (per-step save), delete with renumber, up/down reorder
- Timeline (guide-level) is required — validation in form + server action
- Step timeEst is required — validation in form + server action

**Employment-visa guide (current content):**
- Title: "How to Get an Employment Visa in Dubai Without Leaving the UAE"
- Route: inside-country (status change, no departure)
- 8 steps across Tasheel (Steps 1–2, 7), Amer (Steps 3–6, 8), Tawjeeh (Step 7 alt)
- Fees: AED 4,900–7,300 depending on labor category
- Timeline: 2–4 weeks overall; 2–3 days per step
- Written to the content writing standard in `CLAUDE.md`

**Key files:**
- `app/admin/guides/[slug]/page.tsx` — thin server component; passes guide + steps to form and StepList
- `components/admin/GuideEditForm.tsx` — client component; dirty tracking; single form with intent buttons
- `components/admin/StepCard.tsx` — admin per-step edit card (14 fields)
- `components/admin/StepList.tsx` — step list + Add step
- `app/admin/actions.ts` — all Server Actions (guide + step CRUD)
- `lib/db/schema.ts` — Drizzle schema for guides + steps tables
- `lib/db/reader.ts` — public read queries
- `lib/db/writer.ts` — admin read queries (writes go through actions.ts directly)
- `lib/revalidate.ts` — revalidatePath called after every save
- `proxy.ts` — route protection

---

## Current next step

**Second article: Dependent / Family Visa guide (children).**
Inside-country and outside-country variants. Same writing standard as employment-visa guide.
Owner decides which variant to write first and provides pricing source.

---

## Rules that must not be broken

1. **Single form + intent pattern.** Never split guide field-editing and publishing into separate `<form>` elements. The locked pattern: one form with `name="intent" value="draft/publish"` buttons. Unpublish is the only allowed standalone form.

2. **Public/admin separation.** Public pages import only `lib/db/reader.ts`. Admin pages use `lib/db/writer.ts` for reads. Never cross-import.

3. **No inner key collisions.** The page puts `key={saved ?? "init"}` on `<GuideEditForm>`. Inner elements must NOT use the same key value.

4. **bcrypt hash escaping.** `ADMIN_PASSWORD_HASH` in `.env.local` must escape `$` as `\$`. dotenv-expand silently corrupts unescaped hashes.

5. **proxy.ts not middleware.ts.** Next.js 16 convention. Using `middleware.ts` triggers a build warning.

6. **`serverExternalPackages: ["better-sqlite3"]` in next.config.ts.** Must stay. Prevents Turbopack from bundling the native module.

7. **Timeline is required.** Guide `timeline` and step `timeEst` are required fields. Server actions throw if empty. Do not remove this validation.

8. **Content writing standard.** All new guide content must follow the "Content Writing Standard" section in `CLAUDE.md`. Short fields, no AI verbosity, no em-dash chains.

9. **Category taxonomy is NOT finalized.** Five categories exist in code but are not owner-approved as permanent. Do not treat them as locked.

10. **After every meaningful implementation step, update:** `PROJECT_STATE.md`, `SESSION_LOG.md`, and `CHECKPOINTS.md` (if milestone reached) before declaring the step complete.

---

## Environment

- Dev: `npm run dev -- --hostname 0.0.0.0`
- Build: `npm run build`
- Local IP: `ipconfig getifaddr en0`
- `.env.local` required (not committed): `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `data/guides.db` — not committed to git
- No deployment yet — local development only

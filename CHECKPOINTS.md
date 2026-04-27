# Checkpoints — Dubai Guide Site

Stable, verified milestones. Each entry represents a state the project can be
safely restored to or continued from. Add a new entry only after full verification.

---

## CP-10 — Phase 11: Cloudways deployment live on temporary URL

**Date:** 2026-04-27

**What is confirmed stable:**

*Server:*
- Cloudways DigitalOcean VPS — 157.245.207.99 — app ID dgcmdxxpjx
- Node v20.20.2 via nvm (user-level, no sudo)
- PM2 v6.0.14 — `guidex-production` online, 0 restarts, saved to dump

*Deployment:*
- All project files rsync'd to `/home/master/applications/dgcmdxxpjx/public_html/`
- `data/guides.db` uploaded (124K), backed up locally as `guides.db.backup-20260427-163049`
- `.env.local` on server: 5 vars, permissions 600, NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → temporary URL
- `npm ci` + `npm run build` — 38/38 pages, 0 errors
- `~/start-guidex.sh` — PM2 entry point (sources nvm, cd, PORT=3000)
- `.htaccess` — `RewriteRule ^(.*)?$ http://127.0.0.1:3000/$1 [P,L]`
- `mod_proxy_http` enabled by Cloudways Support
- `index.php` renamed to `index.php.placeholder` (preserved as backup)

*Smoke test (all 200, Next.js confirmed):*
- / /guides /guides/employment-visa /guides/golden-visa-dubai-property
- /contact /admin/login /robots.txt /sitemap.xml

**Not yet done:** Real domain (guidex-consulting.ae) — DNS and SSL not connected.

**Backup/sync workflow established:**
- `scripts/db-backup-from-server.sh` — pull production DB to `backups/production-db/`
- `scripts/db-restore-to-server.sh` — restore with server-side backup + PM2 restart
- Source-of-truth rules locked in `CLAUDE.md` and `docs/deployment-cloudways.md`

---

## CP-09 — Phase 6 launch-readiness complete

**Date:** 2026-04-25

**What is confirmed stable:**

*Technical SEO:*
- `sitemap.xml` — static, pre-rendered, 12 static pages + 11 guide pages
- `robots.txt` — static, blocks /admin/ and /api/auth/
- `metadataBase` in root layout — canonical and og:url resolve correctly
- Group redirect slugs: `permanent: true` (301)

*Deployment:*
- `.env.example` — 5 vars documented
- `docs/deployment-cloudways.md` — complete VPS guide
- `.gitignore` — guides.db added (manual `git rm --cached` still pending)

*Cleanup:*
- 5 Next.js boilerplate SVGs removed from `public/`

**Build:** Clean — 35 pages, 0 TypeScript errors.

**Remaining pre-launch actions:**
1. `git rm --cached data/guides.db && git commit` — untrack DB from git
2. Set domain and DNS on Cloudways
3. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` in `.env.local` on server
4. Add Plausible or other analytics when domain is live

---

## CP-08 — Calculator v1 live at /find-my-visa

**Date:** 2026-04-22

**What is confirmed stable:**

*Route finder / calculator:*
- `/find-my-visa` — static page, build clean, TypeScript clean
- `lib/route-finder-config.ts` — config-first, no DB deps, 6 question nodes, 13 resolutions
- `components/RouteFinderFlow.tsx` — client component, state machine, instant tap = answer
- All 14 guide slugs verified published before build. Zero mismatches.

*Coverage:*
- Family visa (new): spouse/child × outside/inside UAE → 4 guide resolutions
- Family visa (renew): 1 resolution
- Newborn visa: 1 resolution
- Employment (inside UAE): 1 resolution
- Employment (outside UAE): advisor state ("guide coming soon")
- Golden visa (property): 1 resolution; other routes → hub + WhatsApp
- Company setup: mainland / free zone / bank account / unsure → 3 guides + hub
- Supporting service injection: attestation on outside-country family routes; Amer on inside/renew; PRO on company routes

*Hub page CTAs added:*
- `/visas/family` — "Find My Route" CTA above guide cards
- `/visas/golden` — "Find My Route" CTA above guide cards
- `/company-setup` — "Find My Route" CTA above route cards

*Header:* "Find My Route" added as first nav item

**Build:** Clean — 31 pages. No TypeScript errors. `/find-my-visa` ○ Static.

**State going forward:**
- Calculator is production-ready. Next content priority: Employment Visa Outside-Country (upgrades the one advisor state to a full guide resolution).

---

## CP-07 — Government pillar fully live + visa pillar 6/7 live (14 guides published)

**Date:** 2026-04-22

**What is confirmed stable:**

*Government pillar (3/3 live):*
- `/guides/document-attestation-dubai` — published, 3 steps, MOFA attestation
- `/guides/amer-center-dubai` — published, 4 steps, service center orientation
- `/guides/pro-services-dubai` — published, 5 steps, PRO services orientation
- PrimaryServices: Government group fully live (was removed when 0 items live)

*Visa pillar (6/7 live):*
- `/guides/renew-family-visa-dubai` — published, 4 steps, in-country renewal route (adults 18+ medical; children exempt)
- PrimaryServices Visas group: Employment + New Family + Renew Family + Newborn + Golden + Property = 6 live. Maid Visa remains "Soon".

*Guide count:* 14 published, 0 drafts

**Build:** Clean — `[+11 more paths]` on `/guides/[slug]` static generation.

**Fee discipline established:**
- No AED ranges without official tariff backing (Amer, PRO services, notary PoA — all removed)
- Medical fitness test (AED 250–450) retained — well-supported GDRFA-approved center range
- "Varies by visa duration and family file status. Amer confirms at submission." — pattern for government-variable fees

**State going forward:**
- Next priority: Employment Visa Outside-Country (most common first-hire path)
- All three service pillars live: Visas ✅ Business Setup ✅ Government ✅

---

## CP-06 — Company-setup pillar fully live + homepage service-first reset

**Date:** 2026-04-21

**What is confirmed stable:**

*Company-setup pillar (3/3 routes live):*
- `/guides/mainland-company-setup-dubai` — published, 8 steps, DED mainland route
- `/guides/free-zone-company-setup-dubai` — published, 8 steps, general free zone route
- `/guides/open-business-bank-account-dubai` — published, 8 steps, post-formation banking
- `/company-setup` hub — all 3 route cards active as `<Link>` (not `soon`)
- Hub intro updated: "All three guides are live."

*Homepage service-first reset (Phase 5.14–5.17):*
- `PrimaryServices` component — 2 groups (Visas/Business Setup), no dead placeholders
- Employment Visa in Visas group (live, position 1)
- Business Setup: Company Setup + Mainland + Free Zone + Bank Account (all 4 live)
- Government & Legal removed until first real service is live
- WhatsApp CTA live in Header, Hero, FreeAdviceCta (all → wa.me/971506304817)

*Guide count:* 9 published (was 6 at CP-05)

**Build:** Clean — 24 pages. `/guides/[slug]` shows [+6 more paths].

**State going forward:**
- Company-setup pillar: complete
- Visa pillar: employment + spouse + child + golden/property = 8 guides (5 slugs, 2 group pages)
- Next: first new visa content (employment outside-country, newborn, or maid visa)

---

## CP-05 — Phases 4.5 + 4.6 complete (visual polish + real content + validation)

**Date:** 2026-04-17

**What is confirmed stable:**

*Visual identity (Phase 4.5):*
- `globals.css` — `@theme` with `--color-navy: #1B2E4B`, `--color-brass: #B5935A`
- `CategoryIcon.tsx` — 5 inline SVG micro-icons (14×14, 1.5px stroke, currentColor)
- `StepCard.tsx` (public) — step bubble `bg-navy`; advice block `bg-navy/[.06] text-navy`
- `Hero.tsx` — value cards `border-l-2 border-brass`; divider `border-stone-200`
- `TopicCard.tsx` — `bg-stone-50 border-stone-200`; category pill `bg-brass/[.08] text-brass/80`; brass CategoryIcon
- `GuideHeader.tsx` — brass CategoryIcon beside category label
- `guides/[slug]/page.tsx` — brass overlines above section h2s; navy CTA card at guide bottom

*Real guide content (Phase 4.6):*
- Employment-visa guide: "How to Get an Employment Visa in Dubai Without Leaving the UAE"
  — 8 steps, exact Tasheel/Amer/Tawjeeh fees, inside-country route, April 2025
  — Timeline: 2–4 weeks overall, 2–3 days per step
- Content writing standard locked in `CLAUDE.md` and `docs/article-template.md`

*Validation:*
- Guide `timeline` field: `required` HTML + server-side throw in `createGuideAction`, `updateGuideAction`
- Step `timeEst` field: `required` HTML + server-side throw in `updateStepAction`

**Build:** clean — 0 errors, 0 TypeScript errors, 11/11 pages
**DB confirmed:** guide timeline `2–4 weeks`; all 8 steps `2–3 days`; overview text consistent

**State going forward:**
- 1 published guide: `employment-visa` (real production content)
- Admin: full guide + step CRUD working
- Public visual system: complete
- Next: second article (dependent/family visa guide)

---

## CP-04 — Phase 4 complete (step management)

**Date:** 2026-04-12
**Branch/commit:** committed

**What is confirmed stable:**
- Full inline step CRUD in `/admin/guides/[slug]`
- `createStepAction` — appends empty step at `max(stepOrder) + 1`
- `updateStepAction` — writes all 14 fields (cost, timeEst, EN×6, RU×6)
- `deleteStepAction` — deletes + renumbers remaining steps contiguously
- `reorderStepAction` — swaps `stepOrder` integers with adjacent step
- `router.refresh()` pattern — no redirect on step mutations, guide form unsaved state preserved
- `StepCard.tsx` — per-step form: Save, Delete (confirm), ↑/↓ reorder, `useTransition` pending state
- `StepList.tsx` — step list + Add step button, empty state message
- DOM structure: `<GuideEditForm>` and `<StepList>` are siblings — no nested forms
- Build: clean (0 errors, 0 warnings)

**What was verified:**
- SQLite mutation logic tested directly: create appends correctly, delete renumbers
  `[1,2,3,4,5] → delete 3 → [1,2,3,4]`, reorder swaps adjacent integers
- 5 seeded employment-visa steps confirmed intact after test and restore
- Production build clean

**Phase next:** Phase 4.5 — public visual identity polish

---

## CP-03 — Phase 3A complete

**Date:** 2026-04-12
**Branch/commit:** uncommitted (Phase 3A verification pass complete)

**What is confirmed stable:**
- Guide CRUD: create, edit, save draft, save and publish, unpublish, delete
- Single-form intent pattern: field edits and publish happen in one DB write
- Unsaved-changes guard: dirty tracking, `beforeunload`, back-nav confirm dialog
- Success banner: shows on save redirect, auto-hides after 3s
- React key correctness: no duplicate sibling keys anywhere
- ISR revalidation: public page updates immediately after admin save
- Build: clean — 0 errors, 0 TypeScript errors, 0 deprecation warnings, 11/11 pages

**What was verified:**
- SQLite write paths tested programmatically: save draft preserves published,
  unpublish sets published=0, save and publish atomically sets field + published=1
- Public page curl confirmed returning updated content after DB write
- Static code audit: only one `key={saved ?? "init"}` in the codebase
  (on outer `<GuideEditForm>` in the page — inner elements carry no keys)
- `npm run build` output reviewed line by line — no warnings

**Known state going in:**
- 1 guide seeded: `employment-visa` (published)
- Steps table exists and public page renders steps; no admin step UI yet
- RU fields in DB and admin form; public site renders EN only

**Phase next:** Phase 4 — step management in the admin

---

## CP-02 — Phase 2 complete (admin foundation)

**Date:** 2026-04-12

**What is confirmed stable:**
- NextAuth.js v4 credentials login working
- Route protection via `proxy.ts` working
- Admin layout isolated from public site
- Guide list page shows all guides (draft + published)
- bcrypt auth bug fixed (dotenv-expand `$` escaping)
- `middleware.ts` → `proxy.ts` migration done

**Phase next:** Phase 3A — guide CRUD

---

## CP-01 — Phase 1 complete (SQLite migration)

**Date:** 2026-04-12

**What is confirmed stable:**
- All guide data migrated from MDX to SQLite
- Public site renders identically to pre-migration state
- Zero SEO regression — same URLs, same HTML output
- Employment-visa guide seeded with all steps
- MDX files and metadata.ts retired

**Phase next:** Phase 2 — admin foundation

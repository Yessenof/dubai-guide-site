# Project State — Dubai Guide Site

Last updated: 2026-04-28 (Strategic planning docs created — RU/EN SEO strategy, platform roadmap, content audit)

---

## Project Summary

A premium, mobile-first Dubai knowledge hub. Owner-only admin panel built into the same Next.js project. Content stored in SQLite. No external services. Deployment target: Cloudways (Node.js VPS).

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
        page.tsx      ← guide detail (SSG + on-demand ISR, reads from reader.ts)
    about/
    contact/
  admin/              ← owner-only, isolated layout
    layout.tsx        ← no public Header; protected by proxy.ts
    login/page.tsx    ← credentials login (NextAuth)
    guides/
      page.tsx        ← list all guides (drafts + published)
      new/page.tsx    ← create guide form
      [slug]/page.tsx ← edit guide (thin server component, passes guide + steps)
    actions.ts        ← all Server Actions (guide + step create/update/delete/publish)
  api/auth/[...nextauth]/ ← NextAuth handler
  layout.tsx          ← root layout (no Header)

components/
  CategoryIcon.tsx    ← 5 inline SVG micro-icons (visas/company-setup/hiring/living/government)
  Header.tsx          ← public navigation
  GuideHeader.tsx     ← guide page header (title, category+icon, price, timeline, audience)
  StepCard.tsx        ← public step rendering (navy bubble, navy advice block)
  TopicCard.tsx       ← guide card on list page (stone-50 surface, brass category pill)
  Hero.tsx            ← home page hero (brass border on value cards)
  admin/
    GuideEditForm.tsx ← client component: dirty tracking, unsaved-changes guard,
                        single form with Save draft / Save and publish buttons
    GuideFormFields.tsx ← server component: all guide input fields (timeline required *)
    StepCard.tsx      ← admin per-step edit card (14 fields, timeEst required *)
    StepList.tsx      ← admin step list + Add step button
    SavedBanner.tsx   ← green success banner (auto-hides after 3s)
    AdminLogout.tsx   ← sign-out button
    DeleteGuideButton.tsx ← legacy/unused — delete logic is inline in GuideEditForm

lib/
  db/
    schema.ts         ← Drizzle table definitions + inferred types (Guide, Step)
    connection.ts     ← SQLite singleton (WAL mode, FK enforcement)
    reader.ts         ← read-only queries for public pages
    writer.ts         ← admin read queries (writes go through actions.ts directly)
  auth.ts             ← NextAuth config (CredentialsProvider + bcryptjs)
  revalidate.ts       ← revalidatePath wrapper called after every save

data/
  guides.db           ← SQLite database (single file, NOT committed to git)

proxy.ts              ← Next.js 16 route protection (NOT middleware.ts — deprecated)
drizzle.config.ts     ← Drizzle migration config
scripts/
  seed.ts             ← one-time seed (ran once; kept for reference)
  update-employment-visa.ts ← one-time content update (ran; kept for reference)
  generate-hash.ts    ← generate bcrypt hash for .env.local
  debug-auth.ts       ← diagnose login failures (reads .env.local raw)
docs/
  article-template.md ← universal guide structure + writing spec (updated April 2025)
  admin-architecture.md ← partially outdated (references middleware.ts, old writer.ts)
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

**Current guide count:** 15 — all published ✅

| Guide | Status |
|---|---|
| `employment-visa` | ✅ Published |
| `child-dependent-visa-dubai-outside-country` | ✅ Published |
| `child-dependent-visa-dubai-inside-country` | ✅ Published |
| `spouse-dependent-visa-dubai-outside-country` | ✅ Published |
| `spouse-dependent-visa-dubai-inside-country` | ✅ Published |
| `golden-visa-dubai-property` | ✅ Published |
| `mainland-company-setup-dubai` | ✅ Published |
| `free-zone-company-setup-dubai` | ✅ Published |
| `open-business-bank-account-dubai` | ✅ Published |
| `newborn-visa-dubai` | ✅ Published |
| `document-attestation-dubai` | ✅ Published |
| `amer-center-dubai` | ✅ Published |
| `pro-services-dubai` | ✅ Published |
| `renew-family-visa-dubai` | ✅ Published |
| `employment-visa-dubai-outside-uae` | ✅ Published |

Group pages live:
- `/guides/child-dependent-visa-dubai` — tab view (outside/inside)
- `/guides/spouse-dependent-visa-dubai` — tab view (outside/inside)

**Guide content:** "How to Get an Employment Visa in Dubai Without Leaving the UAE"
- Inside-country route (status change without departing UAE)
- 8 steps with exact fees: Tasheel (Steps 1–2, 7), Amer (Steps 3–6, 8), Tawjeeh (Step 7 alt)
- Total fees: AED 4,900–7,300 depending on labor category
- Timeline: 2–4 weeks overall; 2–3 days per step
- Written to the content writing standard defined in `CLAUDE.md`

**Visual design tokens (live):**
- `--color-navy: #1B2E4B` — step bubbles, advice blocks, CTA card
- `--color-brass: #B5935A` — category icons, section overlines, pill backgrounds, CTA link

---

## Admin Status

| Feature | Status |
|---|---|
| Login (`/admin/login`) | Working |
| Route protection (`proxy.ts`) | Working |
| Guide list (`/admin/guides`) | Working — shows all guides (draft + published) |
| Create guide (`/admin/guides/new`) | Working — saves as draft |
| Edit guide (`/admin/guides/[slug]`) | Working — single form, Save draft + Save and publish |
| Publish / unpublish | Working — Unpublish is standalone; publish is part of main save form |
| Delete guide | Working — inline confirm dialog |
| Unsaved-changes guard | Working — dirty state tracking, `beforeunload`, back-nav confirm |
| Success banner | Working — green banner auto-hides after 3s |
| Step management | Working — inline below guide form, per-step save/delete/reorder |
| Timeline (guide) required | Working — `required` on input + server-side throw if empty |
| Timeline (step) required | Working — `required` on input + server-side throw if empty |
| RU content fields | Present in the form — editable but not rendered on public site yet |

---

## Current Blockers / Known Issues

1. **`DeleteGuideButton.tsx` is unused.** Delete logic moved inline into `GuideEditForm.tsx`. Safe to clean up but not blocking anything.

2. **`docs/admin-architecture.md` is partially outdated.** References `middleware.ts` (now `proxy.ts`) and describes old writer.ts patterns. Useful for architectural context but not a literal code reference.

3. **Russian language not live on public site.** RU fields are in the DB and editable in admin, but the public site always renders EN. Locale routing not yet implemented.

4. **Category taxonomy not owner-approved as final.** Five categories are currently defined in code (`visas`, `company-setup`, `hiring`, `living`, `government`) but have not been explicitly confirmed by the owner as the permanent list. Treat as current working taxonomy, not a locked decision.

5. **No analytics.** Plausible recommended. Non-blocking for launch.

---

## Deployment Status

**Phase 12 complete (2026-04-27). Site is LIVE on real domain with HTTPS.**

| Item | Status |
|---|---|
| Server | Cloudways — Recovered-guidex-main-server — 165.245.187.15 |
| SSH user | master_asumzwhebx |
| App ID | dgcmdxxpjx |
| Temporary URL | https://phpstack-1618074-6379172.cloudwaysapps.com/ |
| Production domain | https://guidex-consulting.ae ✅ LIVE |
| WWW | https://www.guidex-consulting.ae ✅ LIVE |
| SSL | Let's Encrypt — installed for both apex + www |
| HTTP → HTTPS redirect | ✅ Enabled |
| Node | v20.20.2 via nvm under master user |
| PM2 | guidex-production — online |
| App path | /home/master/applications/dgcmdxxpjx/public_html |
| data/guides.db | Backed up locally: `backups/production-db/guides.db.20260427-223918` |
| .env.local on server | NEXT_PUBLIC_SITE_URL + NEXTAUTH_URL → guidex-consulting.ae |
| mod_proxy_http | Re-enabled by Cloudways Support after recovery |
| DNS A record | guidex-consulting.ae → 165.245.187.15 (updated after recovery) |
| Smoke test (real domain) | 8/8 HTTPS routes 200 ✅ — Next.js confirmed serving |
| GitHub | fea9411 — up to date |

**Recovery note (2026-04-28):** Server was suspended/recovered by Cloudways. New IP assigned (165.245.187.15), new SSH user (master_asumzwhebx). App files, .env.local, data/guides.db, and .next build survived the recovery. mod_proxy_http modules were re-enabled by Cloudways Support. DNS A record updated in Tasjeel to new IP.

---

## Current Next Step

**Phase 1 — Russian language layer (NOW)**

See `docs/platform-roadmap.md` Phase 1 for full implementation plan.

1. **Implement `/ru/` routing** — `app/ru/` route group, `reader.ts` locale param, RU fallback to EN
2. **Language switcher** in Header.tsx — shows when current page has a RU equivalent
3. **hreflang + canonical** on all guide pages (EN and RU)
4. **Translate first 12 pages** — see `docs/ru-launch-plan.md` for page-by-page plan

Pre-RU launch (pending):
- Run fresh production DB backup: `./scripts/db-backup-from-server.sh`
- Submit sitemap to Google Search Console: https://guidex-consulting.ae/sitemap.xml
- Add Plausible analytics

**Content fix queue (parallel with RU work):**
- Fix em dashes in `open-business-bank-account-dubai` (steps 1–8)
- Fix em dashes in `mainland-company-setup-dubai` (steps 1, 3, 4, 5) + audience self-reference
- Fix em dashes in `free-zone-company-setup-dubai` (steps 2, 5, 8)
- See `docs/content-audit-ai-tone.md` for full priority queue

Government pillar is fully live. Business Setup pillar fully live. Visas: 7/7 live (Maid Visa now WhatsApp link). Calculator: all 13 resolution states covered.

---

## Completed Phases

| Phase | What | Status |
|---|---|---|
| Phase 1 | SQLite data layer migration | ✅ |
| Phase 2 | Admin foundation (auth, guide list, route protection) | ✅ |
| Phase 3A | Guide CRUD (create, edit, publish, delete, ISR) | ✅ |
| Phase 4 | Step management (inline CRUD, reorder, router.refresh pattern) | ✅ |
| Phase 4.5 | Public visual identity polish (navy, brass, CategoryIcon, stone-50 cards) | ✅ |
| Phase 4.6 | Real guide content + writing standard + required timeline validation | ✅ |
| Phase 4.7 | 5 draft guides created (child x2, spouse x2, golden visa property) | ✅ |
| Phase 4.8 | Tab-based group pages (child + spouse), GuideTabs component, redirects | ✅ |
| Phase 4.9 | Strategic planning: 10 docs covering IA, hubs, calculator, SEO rules, roadmap | ✅ |
| Phase 4.10 | RouteSnapshot component: fast-answer UX layer on guide + group pages | ✅ |
| Phase 4.11 | RouteSnapshotBand on homepage + sentence-boundary truncation fix | ✅ |
| Phase 4.12 | QuickDecisionCards on homepage — 6-card 2-col grid with inline SVG icons | ✅ |
| Phase 5.1 | Launch skeleton complete: 6 guides published, sticky tabs, all links live | ✅ |
| Phase 5.2 | Homepage Phase 2: Hero rewrite, HowItWorks, shared CtaCard | ✅ |
| Phase 5.3 | Phase 2.9: Featured Guides — 3 most recent, brass overline, "See all →" link | ✅ |
| Phase 5.4 | Phase 3: Visa hub pages — /visas, /visas/family, /visas/golden (all static SSG) | ✅ |
| Phase 5.5 | Hero compression: eyebrow/pills/secondary CTA removed; all 6 QDC cards above fold at 375px | ✅ |
| Phase 5.6 | Header nav: Visas + Guides only, active state via usePathname, About/Contact to new Footer | ✅ |
| Phase 5.7 | BrowseByService section: full service map (12 services, 3 groups, stone-50 surface, soon pills) | ✅ |
| Phase 5.8 | /company-setup hub: compare table, 7-step process overview, 3 route cards (coming-soon) | ✅ |
| Phase 5.9 | Draft guide: mainland-company-setup-dubai — 8 steps, company-setup category, draft only | ✅ |
| Phase 5.10 | Company Setup pillar live: guide published, hub activated, header + QDC updated | ✅ |
| Phase 5.11 | Draft guide: free-zone-company-setup-dubai — 8 steps, company-setup category, draft only | ✅ |
| Phase 5.12 | Free zone guide published, company-setup hub fully activated (2/3 routes live) | ✅ |
| Phase 5.13 | Draft guide: open-business-bank-account-dubai — 8 steps, company-setup category, draft only | ✅ |
| Phase 5.14 | Homepage hard reset v3: service-first IA, WhatsApp header, PrimaryServices block, new section order | ✅ |
| Phase 5.15 | Homepage polish pass: WhatsApp CTA live (971506304817), PrimaryServices visual polish, Business Setup expanded | ✅ |
| Phase 5.16 | PrimaryServices v2: Employment Visa added, Government & Legal removed (0 live items — hurts trust) | ✅ |
| Phase 5.17 | Bank account guide audited, fixed, published. Company-setup pillar fully live (3/3 routes). | ✅ |
| Phase 5.18 | Draft guide: newborn-visa-dubai — 6 steps, visas category, draft only (fee review recommended before publish) | ✅ |
| Phase 5.19 | newborn-visa-dubai published: fee audit pass, overview wording fix, PrimaryServices updated | ✅ |
| Phase 5.20 | Draft guide: document-attestation-dubai — 5 steps, government category, first guide in category | ✅ |
| Phase 5.21 | document-attestation-dubai published: scope tightened to 3 steps, Government group restored in PrimaryServices | ✅ |
| Phase 5.22 | Draft guide: amer-center-dubai — 4 steps, government category, service-center orientation | ✅ |
| Phase 5.23 | amer-center-dubai published: fee wording fixed (removed AED range), Amer Services activated in PrimaryServices | ✅ |
| Phase 5.24 | Draft guide: pro-services-dubai — 5 steps, government category, service-provider orientation | ✅ |
| Phase 5.25 | pro-services-dubai published: notary fee range removed, PRO Services activated in PrimaryServices. Government group fully live (3/3). | ✅ |
| Phase 5.26 | Draft guide: renew-family-visa-dubai — 4 steps, visas category, in-country renewal route | ✅ |
| Phase 5.27 | renew-family-visa-dubai published: medical fee confirmed (AED 250–450), fee wording tightened, PrimaryServices activated. Visas group 6/7 live. | ✅ |
| Phase 7 | Calculator v1 live at /find-my-visa — 6 question nodes, 13 resolution states, config-first, server-pre-fetched guide data, supporting service injection | ✅ |
| Phase 8 (UX) | Phase 3+4 UX redesign: employer outside-UAE guide published, calculator wired, golden visa 4-route hub, gray-500→600, maid visa WhatsApp link | ✅ |
| Phase 8 (content) | Phase 5 content compression: 34 DB writes across 14 guides (summaries, audiences, overviews, step titles, step advice/warning) | ✅ |
| Phase 9 | Phase 6 launch-readiness: sitemap.xml, robots.txt, metadataBase, permanent redirects, DB gitignore, .env.example, deployment docs, build verified (35 pages, 0 errors) | ✅ |
| Phase 9b | Launch-prep audit: guide list redirect-slug fix, calculator GROUP_HREFS, visas hub outside-UAE employment visa card | ✅ |
| Phase 10 | Guidex Consulting brand integration: all "Dubai Guide" text replaced, logo image in header, favicons replaced, all metadata titles updated, manifest.webmanifest added, all assets RGB-optimized, build verified (38 pages, 0 errors) | ✅ |
| Phase 11 | Cloudways deployment live on temporary URL: nvm + Node 20 + PM2, rsync deploy, DB upload, Apache proxy, mod_proxy_http enabled by Support, smoke test 8/8 ✅ | ✅ |
| Phase 12 | Real domain launch: guidex-consulting.ae live with HTTPS + www, DNS A record → 157.245.207.99, SSL Let's Encrypt, rebuild + PM2 restart, smoke test 8/8 ✅, production DB backup ✅ | ✅ |

---

## Environment / Local Dev Notes

- Dev server: `npm run dev -- --hostname 0.0.0.0`
- Local IP: `ipconfig getifaddr en0`
- Desktop: `http://localhost:3000`
- iPhone: `http://192.168.1.120:3000` (IP may change)
- `.env.local` required — not committed to git
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt, `$` escaped as `\$`), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `data/guides.db` — not committed to git

---

## Deployment Notes

- Target: Cloudways (Node.js VPS, Ubuntu/Debian)
- `better-sqlite3` requires native bindings — compiled on deploy via `npm install`
- `data/guides.db` must exist on the server filesystem (writable, persistent)
- Backup = copy `data/guides.db` to a safe location
- `NEXTAUTH_URL` must be set to the production domain in `.env.local` on server
- NEXT_PUBLIC_SITE_URL and NEXTAUTH_URL → https://guidex-consulting.ae
- Rebuild ran on server after domain switch — NEXT_PUBLIC_* baked into static output
- `./scripts/db-backup-from-server.sh` — pulls production DB, last run 2026-04-27-223918

---

## Files to Read First in a New Session

**Fastest start:** Open `NEW_CHAT_TRANSFER.txt` — exact attach list and paste text.

1. `CLAUDE.md` — rules, architecture constraints, QA rules, content writing standard
2. `PROJECT_STATE.md` — this file
3. `NEW_CHAT_TRANSFER.txt` — compact handoff for a new chat
4. `CHECKPOINTS.md` — last verified stable states
5. `SESSION_LOG.md` — recent implementation steps

For code context:
6. `app/admin/guides/[slug]/page.tsx` — edit page entry point
7. `components/admin/GuideEditForm.tsx` — main admin form logic
8. `app/admin/actions.ts` — all Server Actions
9. `lib/db/schema.ts` — database schema

## Memory Guard

`.claude/settings.json` + `.claude/memory-guard.sh` — Stop hook that warns when source files
(`app/`, `components/`, `lib/`, `proxy.ts`, `next.config.ts`) are newer than `PROJECT_STATE.md`.
Exits 0 (warns, never blocks).

# Project State — Dubai Guide Site

Last updated: 2026-05-11 (Phase 3D dynamic detail routes — 6 detail pages for news/events/calendar EN+RU committed, not deployed)

---

## Project Summary

A premium, mobile-first Dubai knowledge hub. Owner-only admin panel built into the same Next.js project. Content stored in SQLite. No external services. Deployment: UpCloud VPS, Ubuntu 24.04, `85.9.203.69`.

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
    schema.ts         ← Drizzle table definitions + inferred types (Guide, Step, NewsPost, HubEvent, CalendarPage)
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
| Home (`/`) | Live — 5 route-hub category cards (3 active, 2 soon); "Browse all guides →" text link |
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

3. **Russian content partially populated.** All 17 guides have RU content. Spouse dependent visa pair deploying now — after deploy, all RU content will be live.

4. **Category taxonomy not owner-approved as final.** Five categories are currently defined in code (`visas`, `company-setup`, `hiring`, `living`, `government`) but have not been explicitly confirmed by the owner as the permanent list. Treat as current working taxonomy, not a locked decision.

5. **No analytics.** Plausible recommended. Non-blocking for launch.

---

## Deployment Status

**UpCloud migration complete (2026-04-29). Site is LIVE on UpCloud with HTTPS.**

| Item | Status |
|---|---|
| Provider | UpCloud |
| Server IP | 85.9.203.69 |
| SSH user | root |
| App path | /var/www/guidex |
| DB path | /var/www/guidex/data/guides.db |
| DB backups (server) | /var/backups/guidex/ |
| DB backups (local) | backups/production-db/ |
| PM2 process | guidex-production — online |
| PM2 startup | pm2-root.service enabled (systemd) |
| Node | v20.20.2 (system, NodeSource) |
| Nginx | /etc/nginx/sites-enabled/guidex-consulting.ae |
| Production domain | https://guidex-consulting.ae ✅ LIVE |
| WWW | https://www.guidex-consulting.ae ✅ LIVE |
| SSL | Let's Encrypt — valid to 2026-07-28, auto-renewal via certbot.timer |
| HTTP → HTTPS redirect | ✅ 301 |
| DNS A record | @ + www → 85.9.203.69 (updated at Tasjeel 2026-04-29) |
| Smoke test | 9/9 HTTPS routes 200 ✅, HTTP→HTTPS 301 ✅ |
| GitHub | 3927e4c — up to date |
| Swap | 2 GB swapfile (persistent via /etc/fstab) |

**Previous host:** Cloudways (165.245.187.15) — decommissioned after migration.

---

## Current Next Step

**Phase 3D dynamic detail route skeletons committed (2026-05-11, commit 80d7cec). Not deployed.**

6 dynamic detail pages created for news, events, calendar (EN + RU). `generateStaticParams` returns `[]` on all 6 — SSR on demand. Unknown slugs → `notFound()` → 404. `robots: { index: false, follow: true }` on all 6. No structured data. RU pages enforce no EN fallback (return `notFound()` if reader returns null). Build: 78 pages, 0 errors. 404 smoke: 6/6. No sitemap/homepage/admin/DB changes.

**Next:** Phase 3D wire-up — wire readers into the 6 list skeleton pages (/news, /events, /calendar + RU). Or Phase 3E — admin UI for news_posts / events / calendar_pages.

---

**Phase 3B skeleton pages (2026-05-11, commits 524a741 + 563a10f). Local only — committed, not deployed.**

6 static skeleton pages created (all committed, not deployed):

| Route | File |
|---|---|
| `/news` | `app/(public)/news/page.tsx` |
| `/events` | `app/(public)/events/page.tsx` |
| `/calendar` | `app/(public)/calendar/page.tsx` |
| `/ru/news` | `app/ru/news/page.tsx` |
| `/ru/events` | `app/ru/events/page.tsx` |
| `/ru/calendar` | `app/ru/calendar/page.tsx` |

All 6: zero DB reads, zero sitemap entries, zero homepage changes. Compact inline header, category chips, empty state, WhatsApp CTA. Calendar pages include Islamic holiday amber disclaimer. `robots: { index: false, follow: true }` on all 6. Build: 78 pages (was 72 + 6). Smoke: 6/6 routes 200.

---

**Phase 3A local schema migration (2026-05-11, commit ed434d6).**

Three new tables added to `data/guides.db` (local) via `scripts/migrate-add-news-events-calendar.sql`:
- `news_posts` — news/regulatory updates content type
- `events` — UAE public holidays and business events
- `calendar_pages` — yearly and monthly calendar landing pages

`lib/db/schema.ts` appended with Drizzle definitions for all three tables. Type exports: `NewsPost`, `HubEvent`, `CalendarPage`.

Verification: `integrity_check` = ok, guides = 17, steps = 115 (unchanged), all 3 new tables = 0 rows. All 13 indexes created. All 3 tables have `status` CHECK (draft/published/archived). `events.date_confidence` CHECK (confirmed/expected/subject_to_official_confirmation). Build: 72 pages, 0 errors. No routes added. No sitemap changes. No production changes.

Local DB backup: `data/guides.db.backup-before-news-events-calendar-schema-20260511-113849`.

**Analytics layer (2026-05-10, commit 85f5519):** All GTM/GA4 dataLayer events wired:

| Event | Source |
|---|---|
| `language_switch_click` | `Header.tsx` |
| `whatsapp_click` (source: header) | `Header.tsx` |
| `route_finder_start` | `RouteFinderFlow.tsx` (first answer), `StickyRouteCta.tsx` |
| `route_finder_result_view` | `RouteFinderFlow.tsx` (useEffect on result phase) |
| `route_finder_whatsapp_click` | `RouteFinderFlow.tsx` (3 WA links in results) |
| `homepage_service_card_click` | `components/ServiceCardLink.tsx` (EN + RU homepages) |
| `guide_cta_click` | `components/GuideCta.tsx` (all guide pages — route_finder, whatsapp CTAs) |
| `whatsapp_click` (source: guide) | `components/GuideCta.tsx` (guide WhatsApp CTAs, dual-fires with guide_cta_click) |

GTM container: `GTM-M7F5X37N` — active in production.

**Next steps:**
1. Submit sitemap to Google Search Console: https://guidex-consulting.ae/sitemap.xml
2. Configure GTM: set up triggers for each event, wire GA4 G-33C9N3B68T
3. Phase 3B: admin UI for news_posts / events / calendar_pages (routes, forms, server actions)
4. Phase 3C: public-facing pages for new content types

---

**RU hub parity batch deployed (commit 60deb84). All systems green.**

Batch added: `/ru/banking-tax`, `/ru/tourism` hub pages. Fixed sitemap (4 new entries), added canonical + hreflang to all 4 hub pages. Activated RU homepage cards. Build: 60 pages, 0 errors. All 9 smoke test routes 200.

Production state (2026-05-04):
- Git HEAD: `60deb84` (working tree clean)
- PM2: `guidex-production` online
- DB: 17 published guides, 115 steps (unchanged)
- `/ru/banking-tax`: live — TRC card links to EN guide with "· EN" label
- `/ru/tourism`: live — links to `/ru/guides/holiday-home-permit-dubai`
- RU homepage: all 5 cards active (no more `soon:true`)
- Sitemap: all 4 hub URLs present (banking-tax, tourism, ru/banking-tax, ru/tourism)

**Production state (2026-05-04):**
- Git HEAD: `b588201` (working tree clean)
- PM2: `guidex-production` online
- DB: 17 published guides, 115 steps (unchanged)
- `/ru/government`: live — 3 broken guide links replaced with "Скоро" cards; WhatsApp CTA intact
- No broken `/ru/guides/` links remain on any RU hub page

**Next options (priority order — updated after RU TRC complete locally):**
1. Commit + deploy RU TRC batch (pending owner approval) — `feat: add Russian TRC guide and custom RU route`
2. newborn-visa-dubai RU
3. renew-family-visa-dubai RU
4. Government guide batch: document-attestation, amer-center, pro-services RU (flips cards from soon to linked)

**RU TRC local status (2026-05-04):**
- `scripts/add-ru-trc.ts` run: 8 ru_* step fields + 4 guide fields written to local DB (17 guides, 115 steps — count unchanged)
- `app/ru/guides/tax-residency-certificate-uae/page.tsx` created — custom static RU premium page (navy hero, WHY_CARDS RU, Russian CTAs)
- `app/ru/guides/[slug]/page.tsx` — CUSTOM_PAGE_SLUGS filter added (excludes TRC from generic RU route)
- `app/(public)/guides/tax-residency-certificate-uae/page.tsx` — hreflang `"ru"` key added
- `app/ru/banking-tax/page.tsx` — TRC card href updated to `/ru/guides/tax-residency-certificate-uae`, meta `· EN` label removed
- Build: 61 pages, 0 errors. `/ru/guides/tax-residency-certificate-uae` = `○ (Static)`. Generic RU `[slug]` = 6 paths (TRC excluded).
- Smoke tests: 9/9 routes 200 ✅

---

**CP-HH-RU-02A complete: holiday-home-permit-dubai Russian content polished locally.**

- 5 weak phrases patched in `scripts/add-ru-holiday-home-permit-guide.ts`
- Script rerun: 1 guide row + 12 step rows updated, all guards passed, 0 em-dashes
- Build: 55 pages, 0 errors. RU guide pre-rendered. Sitemap includes `/ru/guides/holiday-home-permit-dubai`.
- Local DB backup: `data/guides.db.backup-holiday-home-ru-phrase-polish-1777743683`

**CP-BATCH-RU-02 complete: Bank Account RU + Holiday Homes RU live on production.**

- `open-business-bank-account-dubai` RU: https://guidex-consulting.ae/ru/guides/open-business-bank-account-dubai
- `holiday-home-permit-dubai` RU: https://guidex-consulting.ae/ru/guides/holiday-home-permit-dubai
- DB backup: `/var/backups/guidex/guides.db.pre-batch-ru-bank-hh-20260502-180053`
- Production HEAD: b18971e

**Next:** Continue RU content population — newborn-visa-dubai, document-attestation-dubai, amer-center-dubai, pro-services-dubai.

**CP-26: RU bank account guide — local only, pending deploy.**

- `open-business-bank-account-dubai` RU content complete locally (all 9 steps)
- ru_title: "Открыть бизнес-счёт в банке ОАЭ для компании в Дубае"
- 6 new localize-value.ts mappings for step/guide-level EN values
- Production DB not yet updated with RU content

**RU content in progress (5/9 done)**
- `employment-visa` complete (deployed)
- `golden-visa-dubai-property` complete (deployed)
- `mainland-company-setup-dubai` complete (deployed)
- `free-zone-company-setup-dubai` complete (deployed)
- `open-business-bank-account-dubai` complete locally (pending deploy)
- Remaining order: newborn-visa-dubai, document-attestation-dubai, amer-center-dubai, pro-services-dubai

Pre-RU launch (pending):
- Submit sitemap to Google Search Console: https://guidex-consulting.ae/sitemap.xml
- Add Plausible analytics

**Step 1A complete: RU content em-dash hygiene**
- All 4 completed RU guides scanned and cleaned
- Source scripts updated: 0 content em-dashes
- Local DB patched: guide=OK steps=OK for all 4
- Production DB patched (backup at /var/backups/guidex/guides.db.pre-ru-em-dash-cleanup-*)
- Patch script: `scripts/patch-ru-em-dashes-completed-guides.ts`
- Build: 63 pages, 0 errors. PM2 online.
- Remaining HTML em-dashes are in `<title>` separator (intentional) and EN step `time_est` values (Category B, not in scope)

**Step 2 complete: UI label localization**
- `RouteSnapshot.tsx`: `locale` prop added; 6 labels (Gov. fee→Стоимость, Timeline→Срок, For→Для кого, Steps→Шаги, Start→С чего начать, Last updated→Обновлено)
- `StepCard.tsx`: `locale` prop added; 6 labels (Where to go→Куда идти, Address/portal→Адрес/портал, Est. cost→Стоимость, Est. time→Срок, Advice→Совет, Note→Важно)
- `GuideHeader.tsx`: `locale` prop added; category map (visas→Визы, company-setup→Компании, government→Госуслуги)
- `app/ru/guides/[slug]/page.tsx`: passes `locale="ru"` to all three components

**Step 3 complete: display-level value localization (CP-23)**
- `lib/localize-value.ts`: 21 A-class exact-match mappings + month-name regex
- Applied in `app/ru/guides/[slug]/page.tsx` for price, timeline, lastUpdated, cost, timeEst
- Commit: 665744e

**Step 4 complete: full RU value localization + D-class em-dash fix (CP-24)**
- `lib/localize-value.ts`: expanded to 47 mappings (3 guide price, 2 guide timeline, 10 step cost, 7 step timeEst duration+context, 2 post-D-fix)
- `scripts/patch-d-class-timeest-em-dashes.ts`: removed em-dash from mainland step 6 and free-zone step 8 `time_est` (EN field, both EN and RU pages)
- Remaining English on RU pages: only pure AED amounts (internationally understood, no change needed)
- Build: 63 pages, 0 errors. Production smoke test: all 4 RU guides + EN verified ✅
- Commit: bcf98b9. **RU visible cleanup complete.**

**Remaining English on RU pages (intentional — B-class pure AED, no change needed):**
- AED 278, AED 1,126, AED 676, AED 323, AED 386, AED 546 (employment-visa step costs)
- AED 8,031.75, AED 700, AED 1,153 (golden-visa step costs)
- AED 620–720 (mainland step 3 cost)
- AED 4,900 – 7,300 (employment-visa guide price)
These are internationally understood in Dubai financial context.

**Next recommended action:** Continue RU content population — `open-business-bank-account-dubai` is next.

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
| UpCloud migration | Migrated production from Cloudways to UpCloud (85.9.203.69). All 8 phases complete. DNS switched. HTTPS live. Cron daily backup. 9/9 smoke tests. | ✅ |
| Phase 1B | Russian routing infrastructure: Locale type, pick() fallback, RU guide routes, language switcher, hreflang, sitemap dual-language. Build: 62 pages, 0 errors. | ✅ |
| RU content: employment-visa | ru_title, ru_summary, ru_audience, ru_overview, all 8 steps populated. RU hreflang and sitemap entry active. Build: 62 pages, 0 errors. | ✅ |
| RU content: golden-visa-dubai-property | ru_title, ru_summary, ru_audience, ru_overview, all 7 steps populated. RU hreflang and sitemap entry active. Build: 62 pages, 0 errors. | ✅ |
| RU content: mainland-company-setup-dubai | ru_title, ru_summary, ru_audience, ru_overview, all 8 steps populated. RU hreflang and sitemap entry active. Build: 62 pages, 0 errors. | ✅ |
| RU locale navigation fix | Footer and StickyRouteCta made locale-aware. lib/locale-path.ts helper created. Audit confirmed TopicCard and GuideTabs already correct. Build: 62 pages, 0 errors. | ✅ |
| Homepage IA restructure (CP-19) | EN and RU homepages now use matching 5-card route-hub layout. /ru/government created. PrimaryServices removed from EN homepage (file kept). Build: 63 pages, 0 errors. | ✅ |
| RU content: free-zone-company-setup-dubai (CP-20) | ru_title, ru_summary, ru_audience, ru_overview, all 8 steps populated. 0 em-dashes. RU hreflang and sitemap entry active. Build: 63 pages, 0 errors. | ✅ |

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

- Target: UpCloud VPS — Ubuntu 24.04, `root@85.9.203.69`, app at `/var/www/guidex`
- `better-sqlite3` requires native bindings — compiled on deploy via `npm ci`
- `data/guides.db` must exist on the server filesystem (writable, persistent)
- `NEXTAUTH_URL` must be set to the production domain in `.env.local` on server
- `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` → `https://guidex-consulting.ae`
- `NEXT_PUBLIC_*` vars are baked at build time — rebuild required after any change
- `./scripts/db-backup-from-upcloud.sh` — pull production DB to local backups
- `./scripts/db-restore-to-upcloud.sh` — restore local DB to server (with server-side backup + PM2 restart)
- Latest verified local DB: `backups/production-db/guides.db.20260429-140304` (15 guides, 94 steps)

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

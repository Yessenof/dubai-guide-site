# Roadmap — Dubai Guide Site

Last updated: 2026-04-25

---

## Completed Phases

### Phase 1 — SQLite Data Layer Migration ✅
Replaced MDX + metadata.ts with SQLite via better-sqlite3 + Drizzle ORM.

### Phase 2 — Admin Foundation ✅
Auth, route protection (proxy.ts), guide listing.

### Phase 3A — Guide CRUD ✅
Create / edit / delete / publish workflow. ISR revalidation.

### Phase 4 — Step Management ✅
Inline step CRUD, reorder (up/down), router.refresh pattern.

### Phase 4.5–4.6 — Visual Identity + Content Standard ✅
Navy/brass tokens, CategoryIcon, RouteSnapshot, StepCard, GuideHeader.
Real guide content. Content writing standard locked in CLAUDE.md.

### Phase 4.7–4.8 — Group Pages ✅
Tab-based group pages for spouse/child family visas. GuideTabs component.
Redirects from individual slugs to group page.

### Phase 4.9–4.12 — Strategic Planning + UX Components ✅
RouteSnapshot, RouteSnapshotBand, QuickDecisionCards, strategic docs.

### Phase 5.x — Content Pillars Live (15 guides) ✅
All three content pillars published:
- Visas (9 guides including group pages)
- Business Setup (3 guides)
- Government (3 guides)

Hub pages live: /visas, /visas/family, /visas/golden, /company-setup, /government.
PrimaryServices, Hero, HowItWorks, FreeAdviceCta, Footer, BrowseByService.

### Phase 7 — Calculator / Route Finder ✅
/find-my-visa live — 6 question nodes, 13 resolution states, config-first.
All 15 guide slugs wired. Supporting service injection.

### Phase 8 (UX) — UX + Copy + Visibility Redesign ✅
Phase 3+4 UX pass: copy compression, gray-500→600, WhatsApp header,
golden visa 4-route hub, maid visa WhatsApp link, all hubs active.

### Phase 8 (Content) — Guide Content Compression ✅
Phase 5 content cleanup: 34 DB writes across 14 guides.
Summaries, audiences, overviews, step titles, advice/warning all tightened.

### Phase 9 — Launch-Readiness ✅
sitemap.xml, robots.txt, metadataBase, permanent redirects (301),
.gitignore fix, .env.example, deployment docs, build verified (35 pages).

### Phase 9b — Launch-Prep Audit ✅
Guide list: removed 4 redirect-slug duplicates, injected 2 group page entries.
Calculator: GROUP_HREFS — canonical URLs for family visa results.
Visas hub: added outside-UAE employment visa card.

### Phase 10 — Guidex Consulting Brand Integration ✅
All "Dubai Guide" text replaced with "Guidex Consulting" across 14 files.
Header logo replaced with `<Image>` from `public/brand/logo-header.png` (480×120).
Favicon, icon.png, apple-icon.png all replaced with Guidex brand assets.
Build verified: 37 pages, 0 errors.

---

## Next Steps (priority order)

### 1. Pre-launch git cleanup ← DO FIRST
```bash
git rm --cached data/guides.db
git commit -m "chore: untrack guides.db — managed outside version control"
```
The DB is currently tracked in git (was committed before .gitignore was updated).
This does not delete the local database file.

### 2. Deploy to Cloudways
Full guide: `docs/deployment-cloudways.md`
Steps: git pull, npm install, npm run build, PM2, nginx proxy, .env.local.

### 3. DNS + SSL
Point domain to Cloudways IP. Let's Encrypt via Cloudways.
Set NEXT_PUBLIC_SITE_URL and NEXTAUTH_URL in .env.local on server.

### 4. Verify social handles
Contact page links to instagram.com/dubaiguide and facebook.com/dubaiguide.
Confirm these are registered handles or update to correct URLs.

---

## Later Phases

### Russian Language (Public Rendering)
- Locale routing: /guides/[slug] (EN), /ru/guides/[slug] (RU)
- Language switcher in Header.tsx
- reader.ts: accept locale param, EN fallback for empty RU fields
- generateStaticParams: generate both locale variants
- Requires: stable EN content and deployment first

### RU Content Drafting via Claude API
- "Generate RU draft from EN" button in admin
- Calls Claude API to populate ru_* fields
- Fields editable before saving
- Requires: Russian routing live first

### Analytics
- Plausible Analytics recommended (no cookie consent, lightweight, UAE-safe)
- Add after domain is live and confirmed

### Structured Data (JSON-LD)
- Add HowTo schema per guide page
- Add Organization schema on homepage
- Improves rich result eligibility in Google

### OpenGraph Image
- Global og:image (site logo or branded card)
- Per-guide og:image (optional — branded card with title/fees)

### New Content — Priority Queue
- Maid Visa / Domestic Worker guide (currently WhatsApp link in PrimaryServices)
- Golden Visa — Professional route guide
- Golden Visa — Business Investor guide
- Emirates ID renewal guide
- Driving license transfer guide

### Rate Limiting / Scraping Friction
- After traffic justifies it
- Max 60 req/min per IP via nginx or Next.js middleware
- See docs/anti-copy-friction-plan.md

### Step Reorder v2 (Optional)
- Drag-and-drop via @dnd-kit/sortable if up/down buttons feel slow

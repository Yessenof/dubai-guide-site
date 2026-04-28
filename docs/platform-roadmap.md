# Platform Roadmap — Guidex Consulting

Last updated: 2026-04-28

This is the forward-looking roadmap. Completed phases are in ROADMAP.md (root).
This document covers Phase 1 onward from the current live state.

---

## Current state (baseline)

- 15 guides published in English
- Site live at https://guidex-consulting.ae
- Admin panel working
- Russian fields exist in DB and admin but not rendered publicly
- No analytics, no structured data, no user accounts

---

## Phase 1 — Stability + Russian language layer

**Priority: NOW**

This is not a small feature. Russian is a primary business language for Guidex clients from day one. It goes into Phase 1.

### 1A. Runtime stability

- [ ] Production DB backup script running reliably (`./scripts/db-backup-from-server.sh`)
- [ ] SSH ControlMaster socket setup documented and stable
- [ ] PM2 configured to restart on server reboot (`pm2 startup` saved)
- [ ] Cloudways recovery runbook in `docs/deployment-cloudways.md` — keep updated
- [ ] Monthly manual backup reminder (or cron on local machine)

### 1B. RU public routing

**URL design (locked):**
- English: `/guides/[slug]` — unchanged, no `/en/` prefix ever
- Russian: `/ru/guides/[slug]`
- Russian homepage: `/ru`
- Russian guides index: `/ru/guides`
- Russian hub pages: `/ru/company-setup`, `/ru/visas`, etc.

**Implementation approach:**
- Add optional `[locale]` segment only for Russian routes — do not restructure English
- Next.js App Router: new route group `app/(ru)/` or `app/ru/` alongside `app/(public)/`
- `reader.ts` accepts `locale` param: returns `ru_*` fields when `locale === 'ru'`, `en_*` otherwise
- Fallback rule: if `ru_*` field is empty string, fall back to `en_*` content (never show blank)
- `generateStaticParams` for `/ru/guides/[slug]`: only generate for guides where at least `ru_title` is non-empty

### 1C. Language switcher

- Header component: add language toggle when on `/ru/*` or when the current page has a RU equivalent
- Toggle: shows current language, switches to the other
- Do not show the toggle on pages with no RU content yet (suppressed by checking `ru_title` non-empty)
- URL pattern: `https://guidex-consulting.ae/ru/guides/employment-visa` ↔ `https://guidex-consulting.ae/guides/employment-visa`

### 1D. Hreflang and canonical SEO

- Every English page: `<link rel="alternate" hreflang="en" href="https://guidex-consulting.ae/guides/[slug]" />`
- Every Russian page: `<link rel="alternate" hreflang="ru" href="https://guidex-consulting.ae/ru/guides/[slug]" />`
- Both pages: `<link rel="alternate" hreflang="x-default" href="https://guidex-consulting.ae/guides/[slug]" />`
- Canonical on English pages: self-referencing (`/guides/[slug]`)
- Canonical on Russian pages: self-referencing (`/ru/guides/[slug]`) — do NOT point to English
- Sitemap: separate `<url>` entries for EN and RU, with `<xhtml:link>` alternates

### 1E. First pages to translate (minimum RU launch)

See `docs/ru-launch-plan.md` for full page-by-page plan.

Priority 1 (launch with):
1. Homepage (`/ru`)
2. Contact (`/ru/contact`)
3. Guides index (`/ru/guides`)
4. Employment visa
5. Golden visa property
6. Mainland company setup
7. Free zone company setup
8. Bank account
9. Newborn visa
10. Document attestation
11. Amer center
12. PRO services

### 1F. Admin: RU content workflow

- Admin already has `ru_*` fields — no code change needed for now
- Workflow: write EN first, then manually fill RU fields in admin
- Future: "Generate RU draft from EN" button calling Claude API (Phase 2)
- Do not build the API integration until EN content is fully stable

---

## Phase 2 — Content expansion

**Priority: After Phase 1 RU is live**

### New EN guides (priority queue)

- Maid Visa / Domestic Worker — currently WhatsApp link only
- Golden Visa — Professional route (talent/skills)
- Golden Visa — Business Investor route
- Emirates ID (new and renewal)
- Driving license transfer (foreign to UAE)
- Freelance permit / freelance visa

### RU content for all Phase 2 guides

- Write EN first, translate/adapt to RU within same release cycle
- RU must not sound like a translation — see `docs/content-style-guide-ru-en.md`

### Structured data (JSON-LD)

- HowTo schema on all guide pages (EN + RU)
- Organization schema on homepage
- FAQ schema on hub pages if FAQ blocks are added
- Service schema on service-style landing pages

### OpenGraph image

- Branded og:image for all pages (single site-wide image is acceptable for Phase 2)
- Per-guide og:image is optional — add in Phase 3 if needed

---

## Phase 3 — News and articles system

**Priority: After content pillars are fully bilingual**

- Short-form articles: policy updates, fee changes, processing time announcements
- URL: `/news/[slug]` and `/ru/news/[slug]`
- Schema: Article + NewsArticle JSON-LD
- No CMS — same SQLite/admin pattern as guides
- Admin: separate "articles" table or flag on guides table (TBD)
- No automated news scraping — all content written manually

---

## Phase 4 — Tools and calculators

**Priority: After strong content foundation**

- Route Finder already live (`/find-my-visa`)
- New tools: visa cost estimator, timeline estimator, company type selector
- Tools are bilingual from day one (same pattern as guides)
- No server-side processing needed — config-based like the route finder

---

## Phase 5 — User accounts (optional)

**Decision required before building.**

- Allow users to save progress, checklists, or document status
- Requires PostgreSQL migration (SQLite cannot support multi-user concurrent writes safely)
- Significant complexity — do not build until business demand is confirmed

---

## Phase 6 — Dashboard, checklists, status tracking

**Depends on Phase 5.**

- Personal checklist per guide (mark steps as done)
- Document upload (for consultant workflow)
- Status tracking for applications
- Requires auth infrastructure from Phase 5

---

## Phase 7 — Database migration to PostgreSQL (if needed)

**Trigger condition:** User accounts go live OR traffic/concurrency requires it.

- SQLite is fine for a read-heavy content site with one admin user
- Migration: Drizzle ORM makes this manageable (schema stays the same)
- Do not migrate preemptively — SQLite is an asset until it isn't

---

## Phase 8 — Kazakh language

**After Russian is stable and Russian content is substantially complete.**

- URL pattern: `/kz/guides/[slug]`
- Same fallback rules as Russian
- Same admin field pattern — add `kz_*` columns when ready
- Do not plan in detail now

---

## What is explicitly NOT being built

| Item | Reason |
|---|---|
| User login | No use case confirmed yet |
| Document uploads | Requires auth + storage + security |
| Complex dashboard | Depends on auth |
| PostgreSQL migration | SQLite sufficient until user accounts needed |
| Kazakh language | After Russian is fully live |
| Payment system | No confirmed service to sell |
| Automated news scraping | Content must be reviewed — never auto-publish |
| `/en/` URL prefix | Breaks existing URLs and SEO |
| Separate EN domain | Unnecessary complexity |
| Rate limiting at app level | Handle at Cloudways/Nginx level when needed |

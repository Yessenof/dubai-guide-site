# Implementation Roadmap — Master

Version: 1.0 — April 2026
Status: Planning. Based on 9 planning documents created in this session.

Ordering principle: fastest SEO + content impact first, infrastructure deepening after.

---

## Phase 1: Content Launch Skeleton
**Goal:** Get 6 published guides live. Make the site credible for first organic visitors.
**Timeline estimate:** 1–3 days

### Tasks
1. Run `/guide-content-qa` on each of the 5 draft guides (owner task)
2. Make any corrections flagged by QA
3. Publish via admin: child outside, child inside, spouse outside, spouse inside, golden visa property
4. Verify group pages (`/guides/child-dependent-visa-dubai`, `/guides/spouse-dependent-visa-dubai`) work correctly in production

### Pages/components affected
- `data/guides.db` — published flags flip to 1
- No code changes needed

### Content dependencies
- All 5 draft guides must pass content QA
- Fee data in child/spouse guides is Tier B (owner source) — acceptable for launch, upgrade to Tier A later

### SEO considerations
- 6 published guides = credible minimum for site indexing
- GuideTabs group pages are statically rendered — both tab datasets in initial HTML (SEO-safe)
- Each individual guide URL is redirected to its group page (307) — Google will follow redirect and settle on group page as canonical

### Risk
- Low. No schema change, no new components.

### Done criteria
- 6 guides show `published = 1` in DB
- All 6 guide pages render correctly on production
- Group pages show correct tab content for both routes

---

## Phase 2: Homepage Restructure
**Goal:** Replace the current placeholder homepage with task-entry + topic-navigation layout.
**Timeline estimate:** 2–4 days

### Tasks
1. Refactor `Hero.tsx` — new h1 and subheadline per `homepage-restructure-plan.md`
2. Build `QuickDecisionCards` component (6 intent cards)
3. Build `HowItWorks` component (3 trust items — static)
4. Add bottom CTA card (reuse from guide pages)
5. Update `app/(public)/page.tsx` to compose new sections

### Pages/components affected
- `app/(public)/page.tsx`
- `components/Hero.tsx` (refactor)
- `components/QuickDecisionCards.tsx` (new)
- `components/HowItWorks.tsx` (new)

### Content dependencies
- Quick Decision Cards must only link to published guides or live pages
- Do not add hub card until hub pages exist (Phase 4)

### SEO considerations
- Homepage h1 change — low risk, homepage rarely ranks for high-value queries
- Internal links from homepage to guide pages improve guide crawl depth

### Risk
- Low. Static components, no new DB queries.

### Done criteria
- Homepage shows Hero + Quick Decision Cards + Featured Guides + How It Works + Bottom CTA
- All Quick Decision Card links resolve to real published pages
- Mobile layout correct (2-column cards, no horizontal scroll)

---

## Phase 3: Priority 2 Content — 6 New Guides
**Goal:** Fill the most-searched gaps with well-sourced, publishable guides.
**Timeline estimate:** 1–2 weeks (depending on writing pace)

### Guides to write (in order)
1. `employment-visa-dubai-outside-country` — distinct from inside-country; employee exits UAE for medical + stamping
2. `spouse-dependent-visa-dubai-renewal` — shorter guide; renewal is a 4-step process
3. `child-dependent-visa-dubai-renewal` — same structure as spouse renewal
4. `newborn-visa-dubai` — two-phase process; birth cert attestation + Dubai registration
5. `ejari-registration-dubai` — RERA process; required document for sponsorship applications
6. `emirates-id-renewal-dubai` — FAIC/ICP process; standalone from visa renewal

### Pages/components affected
- `data/guides.db` — new guide rows + step rows per guide
- No component changes needed — all use existing guide page template

### Content dependencies
- All guides follow Content Writing Standard from `CLAUDE.md`
- Fee data from owner source (Tier B) is acceptable at launch
- Employment visa outside-country: verify Tasheel/MOHRE fees for outside-country route

### SEO considerations
- Each guide targets a distinct query with its own URL — no duplication risk
- Outside-country employment visa slug must be distinct from existing `employment-visa` slug

### Risk
- Low. No infrastructure changes. Pure content.

### Done criteria
- All 6 guides pass `/guide-content-qa`
- All 6 guides published
- Employment outside-country guide does NOT use same slug as existing employment guide

---

## Phase 4: Service Hub Pages
**Goal:** Add hub-level navigation layer for family visas and golden visa.
**Timeline estimate:** 3–5 days

### Prerequisites
- Phase 1 complete (6 published guides)
- Phase 3 complete for renewal guides (so family hub has 4+ guides)

### Tasks
1. Design `HubHero`, `RouteCards`, `RoadmapBlock`, `CalculatorCTA`, `ContactCTACard` components per `service-hub-architecture.md`
2. Create `/app/(public)/visas/family/page.tsx`
3. Create `/app/(public)/visas/golden/page.tsx`
4. Add guide count by category query to `lib/db/reader.ts`
5. Wire hub tiles into homepage Section 3 (Service Hubs Grid)

### Pages/components affected
- `app/(public)/visas/family/page.tsx` (new)
- `app/(public)/visas/golden/page.tsx` (new)
- `components/HubHero.tsx` (new)
- `components/RouteCards.tsx` (new)
- `components/HubsGrid.tsx` (new — for homepage)
- `lib/db/reader.ts` — add `getGuideCountByCategory()`

### Content dependencies
- Family hub needs 3+ published guides behind it before building
- Golden hub needs at least golden-visa-dubai-property published

### SEO considerations
- Hub pages are not SEO targets — they are navigation layers
- Do not duplicate full step content on hub pages
- Hub pages earn authority through internal links TO and FROM guide pages

### Risk
- Medium. New URL structure. If hubs are built before enough content exists, they will be thin pages.

### Done criteria
- `/visas/family` shows route cards for all published family/dependent guides
- `/visas/golden` shows golden visa property guide card
- RouteCards data comes from DB, not hardcoded
- Hub pages do not duplicate guide step content

---

## Phase 5: Guide List + Category Filter
**Goal:** Make the `/guides` list page more navigable as content volume grows.
**Timeline estimate:** 1–2 days

### Tasks
1. Add category filter buttons to `/guides` page (client-side, no new route)
2. Filter state: URL param (`?category=visas`) — SSR-friendly, bookmarkable
3. Keep all guide cards in initial HTML (not JS-injected) — per SEO Rule 4

### Pages/components affected
- `app/(public)/guides/page.tsx`
- `components/GuideListFilter.tsx` (new client component)

### Content dependencies
- Most useful when 10+ guides published

### SEO considerations
- Filter must not use JavaScript to hide/show cards that aren't in initial HTML
- Best approach: render all cards on server, use CSS/JS to toggle visibility — cards remain in HTML

### Risk
- Low.

### Done criteria
- Filter buttons work on `/guides`
- All cards present in initial HTML (verify with JS disabled)
- URL updates on filter change (bookmarkable)

---

## Phase 6: Priority 3 Content — Verified Guides
**Goal:** Publish the 7 guides that require official source verification before writing.
**Timeline estimate:** 2–4 weeks (verification is the bottleneck)

### Guides (in verification order)
1. `golden-visa-dubai-professional` — AED 30K/month salary threshold — verify ICA/GDRFA
2. `golden-visa-dubai-company-owner` — AED 2M capital, 2-year audit — verify ICA
3. `golden-visa-dubai-bank-deposit` — AED 2M deposit, eligible account types — verify ICA
4. `retirement-visa-dubai-property` — AED 1M, age 55+ — verify ICA/GDRFA
5. `investor-visa-dubai-property` — AED 750K minimum — verify ICA (may be discontinued)
6. `domestic-worker-visa-dubai` — AED 25K household income — verify MOHRE
7. `parent-dependent-visa-dubai` — higher income requirements than child/spouse — verify GDRFA

### Verification sources
- GDRFA portal (gdrfa.gov.ae)
- ICA portal (ica.gov.ae)
- DLD for property-related thresholds
- MOHRE for employment/domestic worker rules

### Pages/components affected
- `data/guides.db` — 7 new guide + step rows

### Risk
- Medium. If fees/thresholds are wrong, incorrect guides rank and attract negative signals.
- Do NOT publish any guide in this group without source verification.

### Done criteria
- Each guide has a verified source noted in the content
- `last_updated` field set to month/year of verification
- Content accuracy tier upgraded to Tier A

---

## Phase 7: Route Finder / Calculator
**Goal:** Build the personalized guide selector per `route-finder-calculator-spec-v1.md`.
**Timeline estimate:** 5–8 days

### Prerequisites
- Minimum 6 published guides (done after Phase 1)
- Fee data verified (Phase 6 ideally complete, or at least Phase 3)
- Config covers 80%+ of user question paths

### Tasks
1. Create `lib/route-finder-config.ts` — full question tree + resolution map
2. Create `/app/(public)/find-my-visa/page.tsx` — SSR page
3. Create `RouteFinderFlow` component — generic config renderer
4. Wire fee + timeline data from guide DB into result cards
5. Update homepage Section 1 CTA to link to `/find-my-visa`
6. Update hub pages "Find My Route" CTAs

### Architecture rules (non-negotiable)
- `lib/route-finder-config.ts` is server-only — never exposed as a public REST endpoint
- No `/api/route-finder` endpoint
- Results are SSR — no client-fetched API calls for fee data
- See `anti-copy-friction-plan.md` §2 for rationale

### Pages/components affected
- `lib/route-finder-config.ts` (new — server-only)
- `app/(public)/find-my-visa/page.tsx` (new)
- `components/RouteFinderFlow.tsx` (new)
- `app/(public)/page.tsx` — CTA link update

### Risk
- Medium. Config tree complexity. Each new guide requires a config entry update.

### Done criteria
- All 5 sub-trees functional (self/spouse/child/employee/property)
- Results link to published guide pages
- Unpublished route shows "coming soon" message
- No public API endpoint for calculator logic

---

## Phase 8: HowTo Schema (Structured Data)
**Goal:** Add JSON-LD HowTo schema to all published guides for Google rich result eligibility.
**Timeline estimate:** 1–2 days

### Prerequisites
- All guide fees verified against official sources (Tier A)
- `last_updated` field populated on all published guides

### Tasks
1. Add `generateHowToSchema(guide: GuideData)` function to `lib/seo.ts`
2. Inject schema in guide page `<head>` via `<script type="application/ld+json">`
3. Validate with Google Rich Results Test

### Pages/components affected
- `lib/seo.ts` (new utility)
- `app/(public)/guides/[slug]/page.tsx` — schema injection
- `app/(public)/guides/child-dependent-visa-dubai/page.tsx` — schema injection
- `app/(public)/guides/spouse-dependent-visa-dubai/page.tsx` — schema injection

### Risk
- High if fees are unverified. Google can demote rich results if schema data is inaccurate.
- Do not implement until all published guides reach Tier A accuracy.

### Done criteria
- HowTo schema validates in Google Rich Results Test for all published guides
- Schema fee data matches visible guide content exactly

---

## Phase 9: PDF Export
**Goal:** Allow users to download a route summary PDF from the calculator result page.
**Timeline estimate:** 3–5 days

### Prerequisites
- Phase 7 (calculator) complete
- Phase 8 (structured data) — optional but recommended first

### Tasks
1. Build server-side PDF generation endpoint (not client-side jsPDF)
2. Add watermark: "Dubai Guide — dubaiuide.com" + generation date
3. Include route summary, fee estimate, abbreviated step list
4. Rate-limit PDF generation by IP via Next.js middleware

### Architecture rules
- PDF generated server-side — business logic never client-exposed
- Watermark is non-removable (embedded in PDF render)
- No client-side PDF generation

### Pages/components affected
- `app/api/pdf/route.ts` (new — server action, rate-limited)
- Calculator result page — "Download Summary" button

### Risk
- Low. Optional feature that adds value without breaking existing pages.

### Done criteria
- PDF generates correctly server-side
- Watermark present
- Rate limiting active (max N requests per IP per hour)

---

## Phase 10: Multilingual (Russian)
**Goal:** Activate Russian-language versions of all published guides.
**Timeline estimate:** 1–2 weeks

### Prerequisites
- All `ru_*` fields populated in DB (either manually or via Claude API translation draft)
- Language switcher UI designed
- URL routing defined (`/ru/guides/[slug]`)

### Tasks
1. Build language switcher in top navigation
2. Create `/ru/guides/[slug]` route — reads `ru_*` fields from DB
3. Build "Generate RU draft" admin action using Claude API
4. Populate all `ru_*` fields via admin workflow
5. Publish Russian versions

### Pages/components affected
- `app/(public)/ru/guides/[slug]/page.tsx` (new)
- `components/LanguageSwitcher.tsx` (new)
- `app/admin/guides/[slug]/page.tsx` — RU draft generation button
- `lib/db/writer.ts` — store RU draft

### Risk
- Low on architecture (bilingual columns already in schema).
- Medium on content quality — machine-generated Russian needs human review before publishing.

### Done criteria
- Language switcher navigates between `/guides/[slug]` and `/ru/guides/[slug]`
- All published guides have verified Russian content
- Page falls back to English if `ru_*` field is empty

---

## Dependency Map

```
Phase 1 (Publish drafts)
  └── Phase 2 (Homepage) — independent, can overlap
  └── Phase 3 (6 new guides)
        └── Phase 4 (Hub pages) — needs Phase 1 + partial Phase 3
              └── Phase 5 (Guide filter) — independent, can overlap with Phase 4
  └── Phase 6 (Verified guides) — independent, can start after Phase 1
        └── Phase 7 (Calculator) — needs Phase 1 + partial Phase 6
              └── Phase 8 (HowTo schema) — needs Phase 7 + all verified
                    └── Phase 9 (PDF export) — needs Phase 7
  └── Phase 10 (Russian) — needs all EN content complete
```

---

## Out of Scope (Current Roadmap)

| Feature | Reason |
|---|---|
| Blog / news section | High maintenance, not part of current product vision |
| User accounts / saved results | Phase 3+ only; no auth complexity yet |
| Mainland LLC company setup guide | Requires deep DED process knowledge |
| Free zone company comparison | Multiple free zones; each needs its own source verification |
| DMCA automation | Too early; no real content worth protecting at this traffic level |
| Trademark registration | Phase 1 is too early |
| Third-party chat widget | External dependency; WhatsApp link sufficient |
| Email capture on calculator result | Phase 3 feature — build after calculator is proven |
| A/B testing infrastructure | Out of scope until significant traffic |

---

## Admin Restructuring Notes (Future)

The current admin is functional for single-guide editing. As content volume grows, the admin will need:

1. **Guide list with bulk actions** — currently each guide requires navigating to its own edit page. A sortable list with inline published/draft toggle will save time at 20+ guides.
2. **Step reordering UI** — currently steps must be deleted and re-created to reorder. A drag-and-drop or up/down arrow step reorder is needed by Phase 3.
3. **Russian draft generation button** — per CLAUDE.md spec: "Generate RU draft from EN" using Claude API. Build in Phase 10, not before.
4. **Content QA checklist per guide** — currently a manual mental checklist. A checklist UI in the admin (one-time per guide before publish) would reduce errors.
5. **last_updated field management** — currently set manually. A "Mark as reviewed today" button would ensure freshness dates are accurate.

None of these are blocking for Phase 1–3. Schedule for Phase 5 or later.

---

## Summary: Fastest Path to Launch

| Step | What | Time |
|---|---|---|
| 1 | QA + publish 5 draft guides | 1 day |
| 2 | Homepage restructure | 2–4 days |
| 3 | Write 6 priority guides | 1 week |
| 4 | Build 2 hub pages | 3–5 days |
| **= Launch** | **12–16 published guides, hub navigation, restructured homepage** | **~3 weeks** |

# Execution Checklist — Dubai Guide Site

Version: 1.0 — April 2026
Source: Full planning pack (10 docs) → atomic executable tasks

Status labels: `do now` | `do after launch skeleton` | `verify first` | `postpone`

---

## Definition of "Launch-Ready Skeleton"

The site is launch-ready when ALL of the following are true:

- [ ] 6 guides are published (1 existing + 5 currently draft)
- [ ] Both group pages (`/guides/child-dependent-visa-dubai`, `/guides/spouse-dependent-visa-dubai`) render published content correctly
- [ ] Homepage has a task-entry hero (not a brand statement)
- [ ] Homepage has Quick Decision Cards linking to real published pages
- [ ] No broken links from homepage to unpublished or nonexistent pages
- [ ] Guide list at `/guides` returns all 6 published guides
- [ ] Mobile layout passes manual check (no horizontal scroll, readable at 375px)
- [ ] `<title>` and `<meta description>` populated on all 6 guide pages

Everything after this is post-launch improvement.

---

## Exact First 5 Tasks to Execute Today (in order)

1. Run `/guide-content-qa` on `child-dependent-visa-dubai-outside-country`
2. Run `/guide-content-qa` on `child-dependent-visa-dubai-inside-country`
3. Run `/guide-content-qa` on `spouse-dependent-visa-dubai-outside-country`
4. Run `/guide-content-qa` on `spouse-dependent-visa-dubai-inside-country`
5. Run `/guide-content-qa` on `golden-visa-dubai-property`, verify AED 9,884.75 total matches step cost sum

---

## Phase 1 — Immediate Launch (Must Ship Fast)

### Task 1.1 — QA child outside-country guide
**Label:** `do now`
**What:** Run `/guide-content-qa` on `child-dependent-visa-dubai-outside-country`. Check: all step fields populated, costs in AED text format, `time_est` uses consistent format ("X business days"), advice/warning fields contain real content (not placeholder). Verify `last_updated` is set.
**Where:** Admin → `/admin/guides/child-dependent-visa-dubai-outside-country`
**Expected result:** Checklist passes or produces a list of specific corrections to make before publish.
**Risk:** Low

---

### Task 1.2 — QA child inside-country guide
**Label:** `do now`
**What:** Run `/guide-content-qa` on `child-dependent-visa-dubai-inside-country`. Same checklist as Task 1.1. Pay specific attention to Step 1 cost — was "Varies by country" which is acceptable, confirm it reads naturally in context.
**Where:** Admin → `/admin/guides/child-dependent-visa-dubai-inside-country`
**Expected result:** Checklist passes or correction list produced.
**Risk:** Low

---

### Task 1.3 — QA spouse outside-country guide
**Label:** `do now`
**What:** Run `/guide-content-qa` on `spouse-dependent-visa-dubai-outside-country`. Check all 7 steps for: step title ≤ 6 words, `what` field ≤ 2 sentences, `where` = authority name only (not a full address), cost in AED text, advice/warning populated where relevant.
**Where:** Admin → `/admin/guides/spouse-dependent-visa-dubai-outside-country`
**Expected result:** Checklist passes or correction list produced.
**Risk:** Low

---

### Task 1.4 — QA spouse inside-country guide
**Label:** `do now`
**What:** Run `/guide-content-qa` on `spouse-dependent-visa-dubai-inside-country`. Same checklist as Task 1.3.
**Where:** Admin → `/admin/guides/spouse-dependent-visa-dubai-inside-country`
**Expected result:** Checklist passes or correction list produced.
**Risk:** Low

---

### Task 1.5 — QA golden visa property guide
**Label:** `do now`
**What:** Run `/guide-content-qa` on `golden-visa-dubai-property`. Additionally: (a) confirm sum of all step costs = AED 9,884.75 (main applicant); (b) confirm timeline field reads "7–10 business days"; (c) confirm overview paragraph ends with "7–10 business days" (not "4–8 weeks"); (d) confirm Step 7 (family sponsorship) is clearly labelled as optional.
**Where:** Admin → `/admin/guides/golden-visa-dubai-property`
**Expected result:** Checklist passes or correction list produced.
**Risk:** Low

---

### Task 1.6 — Apply all QA corrections
**Label:** `do now`
**What:** For each guide that produced corrections in Tasks 1.1–1.5: open the guide in admin, edit the flagged fields, click "Save draft" (NOT publish yet), verify the saved banner confirms write succeeded.
**Where:** Admin → each guide's edit page
**Expected result:** All 5 guides in draft state with corrected content.
**Risk:** Low

---

### Task 1.7 — Publish child-dependent-visa-dubai-outside-country
**Label:** `do now`
**What:** Open guide in admin. Click "Save and publish". Confirm `published = 1` by checking the guide appears on `/guides` public page. Navigate to `/guides/child-dependent-visa-dubai?route=outside` and verify the Outside UAE tab renders this guide's content.
**Where:** Admin → `/admin/guides/child-dependent-visa-dubai-outside-country`; verify at `/guides/child-dependent-visa-dubai`
**Expected result:** Guide live on public site. Outside UAE tab shows correct content.
**Risk:** Low

---

### Task 1.8 — Publish child-dependent-visa-dubai-inside-country
**Label:** `do now`
**What:** Open guide in admin. Click "Save and publish". Navigate to `/guides/child-dependent-visa-dubai?route=inside` and verify Inside UAE tab renders this guide's content.
**Where:** Admin → `/admin/guides/child-dependent-visa-dubai-inside-country`; verify at `/guides/child-dependent-visa-dubai`
**Expected result:** Both tabs on child group page now show published content.
**Risk:** Low

---

### Task 1.9 — Publish spouse-dependent-visa-dubai-outside-country
**Label:** `do now`
**What:** Open guide in admin. Click "Save and publish". Navigate to `/guides/spouse-dependent-visa-dubai?route=outside` and verify Outside UAE tab renders this guide's content.
**Where:** Admin → `/admin/guides/spouse-dependent-visa-dubai-outside-country`; verify at `/guides/spouse-dependent-visa-dubai`
**Expected result:** Guide live. Outside UAE tab shows correct content.
**Risk:** Low

---

### Task 1.10 — Publish spouse-dependent-visa-dubai-inside-country
**Label:** `do now`
**What:** Open guide in admin. Click "Save and publish". Navigate to `/guides/spouse-dependent-visa-dubai?route=inside` and verify Inside UAE tab renders this guide's content.
**Where:** Admin → `/admin/guides/spouse-dependent-visa-dubai-inside-country`; verify at `/guides/spouse-dependent-visa-dubai`
**Expected result:** Both tabs on spouse group page now show published content.
**Risk:** Low

---

### Task 1.11 — Publish golden-visa-dubai-property
**Label:** `do now`
**What:** Open guide in admin. Click "Save and publish". Navigate to `/guides/golden-visa-dubai-property` and verify: (a) all 7 steps render, (b) timeline shows "7–10 business days", (c) price shows AED 9,884.75.
**Where:** Admin → `/admin/guides/golden-visa-dubai-property`; verify at `/guides/golden-visa-dubai-property`
**Expected result:** Guide live. 6 total published guides on site.
**Risk:** Low

---

### Task 1.12 — Verify guide list shows all 6 guides
**Label:** `do now`
**What:** Navigate to `/guides`. Confirm all 6 published guides appear as cards. Confirm no draft guide is visible. Confirm mobile layout at 375px: cards stack vertically, no horizontal scroll, category pill visible.
**Where:** `/guides`
**Expected result:** 6 guide cards. Clean mobile layout.
**Risk:** Low

---

### Task 1.13 — Verify 307 redirects work for all 4 individual guide slugs
**Label:** `do now`
**What:** Navigate directly to each of these URLs and confirm redirect to correct group page + tab:
- `/guides/child-dependent-visa-dubai-outside-country` → `/guides/child-dependent-visa-dubai?route=outside`
- `/guides/child-dependent-visa-dubai-inside-country` → `/guides/child-dependent-visa-dubai?route=inside`
- `/guides/spouse-dependent-visa-dubai-outside-country` → `/guides/spouse-dependent-visa-dubai?route=outside`
- `/guides/spouse-dependent-visa-dubai-inside-country` → `/guides/spouse-dependent-visa-dubai?route=inside`
**Where:** `next.config.ts` (redirects already defined — this is a verification task only)
**Expected result:** All 4 redirects resolve to the correct tab.
**Risk:** Low

---

### Task 1.14 — Verify `<title>` and `<meta description>` on all 6 guide pages
**Label:** `do now`
**What:** Open DevTools → Elements → `<head>` on each of these pages and confirm `<title>` and `<meta name="description">` are populated with guide-specific text (not empty, not default fallback):
- `/guides/employment-visa`
- `/guides/child-dependent-visa-dubai?route=outside`
- `/guides/child-dependent-visa-dubai?route=inside`
- `/guides/spouse-dependent-visa-dubai?route=outside`
- `/guides/spouse-dependent-visa-dubai?route=inside`
- `/guides/golden-visa-dubai-property`
**Where:** Public guide pages
**Expected result:** All 6 pages have unique, populated `<title>` and `<meta description>`.
**Risk:** Low

---

## Phase 2 — Homepage + UX Upgrade

### Task 2.1 — Update Hero h1
**Label:** `do after launch skeleton`
**What:** In `components/Hero.tsx`, replace the current h1 text with: `Dubai Visas and Procedures — Step by Step`. Remove any tagline phrasing, superlatives, or question-format text. h1 must be a single declarative line.
**Where:** `components/Hero.tsx`
**Expected result:** Homepage h1 is direct and keyword-relevant. No marketing language.
**Risk:** Low

---

### Task 2.2 — Update Hero subheadline
**Label:** `do after launch skeleton`
**What:** In `components/Hero.tsx`, replace the subheadline paragraph with: `Step-by-step guides to visas, company setup, and relocation in Dubai. Costs, timelines, and official process — in plain English.` Maximum 30 words. Must be a single `<p>` tag.
**Where:** `components/Hero.tsx`
**Expected result:** Subheadline communicates site scope in one sentence. No vague promises.
**Risk:** Low

---

### Task 2.3 — Replace Hero primary CTA with "Browse All Guides"
**Label:** `do after launch skeleton`
**What:** In `components/Hero.tsx`, change the primary CTA button text to `Browse All Guides` and its `href` to `/guides`. Use existing navy button style. This CTA should be full-width on mobile.
**Where:** `components/Hero.tsx`
**Expected result:** Primary CTA takes users directly to the guide list.
**Risk:** Low

---

### Task 2.4 — Add secondary CTA to Hero: "Find My Route"
**Label:** `do after launch skeleton`
**What:** In `components/Hero.tsx`, add a secondary CTA link below the primary button. Text: `Find My Route →`. Link to `/guides` (temporary — will point to `/find-my-visa` when Phase 4 is built). Style: brass text color (`--color-brass`), no button border, plain text link. On mobile: full-width, stacked below primary button.
**Where:** `components/Hero.tsx`
**Expected result:** Two CTAs visible on hero. Primary = navy button. Secondary = brass text link.
**Risk:** Low

---

### Task 2.5 — Build QuickDecisionCards component
**Label:** `do after launch skeleton`
**What:** Create `components/QuickDecisionCards.tsx`. This is a server component. It renders a 2-column grid on mobile, 3-column on desktop. Each card contains: (a) a `CategoryIcon` or new inline SVG icon (16px), (b) a short action label (5 words max), (c) an `href`. No fees, no timelines. Cards are stone-50 surface with brass icon color and navy text. Hover state: subtle shadow. Use these 6 cards:
1. "Sponsor my spouse" → `/guides/spouse-dependent-visa-dubai`
2. "Bring my child to Dubai" → `/guides/child-dependent-visa-dubai`
3. "Get a Golden Visa" → `/guides/golden-visa-dubai-property`
4. "Get an employment visa" → `/guides/employment-visa`
5. "Set up a company" → `/guides` (placeholder)
6. "Find the right route" → `/guides` (placeholder until calculator)
**Where:** `components/QuickDecisionCards.tsx` (new file)
**Expected result:** 6 intent cards below hero. Mobile: 2 per row. Desktop: 3 per row.
**Risk:** Low

---

### Task 2.6 — Add QuickDecisionCards to homepage
**Label:** `do after launch skeleton`
**What:** In `app/(public)/page.tsx`, import `QuickDecisionCards` and render it as the second section, directly below `<Hero />`. Add a section heading above it: `<h2>` with text "What do you need to do?" styled as brass overline (existing overline pattern). No top/bottom margin inconsistencies — match spacing to existing section gaps.
**Where:** `app/(public)/page.tsx`
**Expected result:** Homepage shows Hero → section heading → QuickDecisionCards.
**Risk:** Low

---

### Task 2.7 — Build HowItWorks component
**Label:** `do after launch skeleton`
**What:** Create `components/HowItWorks.tsx`. This is a server component. It renders 3 items in a row (desktop) / stacked (mobile). Each item: small navy number (1/2/3) or inline SVG icon + label (`<h3>`) + 1-line description (`<p>`). Content:
- Item 1: "Real process, real costs" — "Government fees and timelines from official sources."
- Item 2: "Step by step" — "Every guide breaks the process into clear, actionable steps."
- Item 3: "Always free" — "No paywalls, no sales pitches, no hidden upsells."
Style: white background, navy text for labels, stone-500 for descriptions. No card borders.
**Where:** `components/HowItWorks.tsx` (new file)
**Expected result:** 3-item trust strip. Desktop: horizontal row. Mobile: vertical stack.
**Risk:** Low

---

### Task 2.8 — Add HowItWorks to homepage
**Label:** `do after launch skeleton`
**What:** In `app/(public)/page.tsx`, add `<HowItWorks />` as the section immediately after QuickDecisionCards. No section heading above it — the component is self-describing.
**Where:** `app/(public)/page.tsx`
**Expected result:** QuickDecisionCards → HowItWorks visible in sequence on homepage.
**Risk:** Low

---

### Task 2.9 — Update Featured Guides on homepage to show newest published guides
**Label:** `do after launch skeleton`
**What:** In `app/(public)/page.tsx`, update the guide cards section to pull the 3 most recently published guides from `lib/db/reader.ts` using the existing `getPublishedGuides()` query with a `LIMIT 3 ORDER BY created_at DESC`. Do NOT change `TopicCard.tsx`. Add "See all guides →" as a brass text link below the cards, linking to `/guides`.
**Where:** `app/(public)/page.tsx`, `lib/db/reader.ts` (add `LIMIT` variant or filter in-page)
**Expected result:** Featured guides section shows 3 most recent published guides. "See all" link below.
**Risk:** Low

---

### Task 2.10 — Move bottom CTA card to homepage
**Label:** `do after launch skeleton`
**What:** The navy CTA card used at the bottom of individual guide pages should also appear as the last section on the homepage. Extract the CTA card markup into a shared component `components/CtaCard.tsx`. Props: `heading`, `body`, `ctaText`, `ctaHref`. Replace the inline CTA in guide pages with `<CtaCard>`. Add `<CtaCard heading="Not sure where to start?" body="We can help you find the right route and what it costs." ctaText="Contact Us" ctaHref="/contact" />` as the final section on `app/(public)/page.tsx`.
**Where:** `components/CtaCard.tsx` (new), `app/(public)/guides/[slug]/page.tsx` (replace inline CTA), `app/(public)/page.tsx` (add CTA card)
**Expected result:** Homepage ends with the same navy CTA card used on guide pages. Consistent across site.
**Risk:** Low

---

### Task 2.11 — Verify homepage mobile layout
**Label:** `do after launch skeleton`
**What:** Open homepage at 375px viewport width. Check: (a) hero h1 does not overflow, (b) subheadline wraps to max 2 lines, (c) QuickDecisionCards: exactly 2 cards per row, (d) HowItWorks stacks vertically, (e) featured guide cards stack 1-per-row, (f) no horizontal scroll at any point, (g) all CTA buttons are full-width.
**Where:** Homepage `/`
**Expected result:** Passes all 7 mobile checks.
**Risk:** Low

---

## Phase 3 — Service Hubs

### Task 3.1 — Add getGuidesByCategory query to reader.ts
**Label:** `do after launch skeleton`
**What:** In `lib/db/reader.ts`, add a function `getPublishedGuidesByCategory(category: string): GuideData[]` that returns all published guides in a given category, ordered by `created_at DESC`. Use existing Drizzle query pattern. Do NOT change the schema. Do NOT add new columns.
**Where:** `lib/db/reader.ts`
**Expected result:** Hub pages can fetch their relevant guides from DB without hardcoding slugs.
**Risk:** Low

---

### Task 3.2 — Build HubHero component
**Label:** `do after launch skeleton`
**What:** Create `components/HubHero.tsx`. Props: `title: string`, `summary: string`, `category: string`. Renders: (a) `CategoryIcon` for the given category at 24px, (b) brass overline with category label, (c) `<h1>` with title, (d) `<p>` with summary. White background. Same spacing rhythm as guide page `GuideHeader`. No CTA inside this component — the hub page adds CTAs separately.
**Where:** `components/HubHero.tsx` (new file)
**Expected result:** Hub pages have a consistent, on-brand header.
**Risk:** Low

---

### Task 3.3 — Build RouteCards component
**Label:** `do after launch skeleton`
**What:** Create `components/RouteCards.tsx`. Props: `guides: GuideData[]`. Renders one card per guide. Each card: guide title as `<h3>`, one-line summary (`guide.summary` truncated to 80 chars if needed), price range (`guide.price`), timeline (`guide.timeline`), brass "View guide →" link to `/guides/[guide.slug]`. Stone-50 surface. Border on hover. 1-column on mobile, 2-column on desktop. Do NOT duplicate step content — card shows guide-level fields only.
**Where:** `components/RouteCards.tsx` (new file)
**Expected result:** Hub pages show a grid of guides with price + timeline visible without clicking through.
**Risk:** Low

---

### Task 3.4 — Build /visas/family hub page
**Label:** `do after launch skeleton`
**What:** Create `app/(public)/visas/family/page.tsx`. This is a server component. It must:
1. Export `metadata` with `title: "Family and Dependent Visas Dubai — Step-by-Step Guides"` and a specific `description`.
2. Render `<HubHero title="Family and Dependent Visas in Dubai" summary="..." category="visas" />`.
3. Call `getPublishedGuidesByCategory("visas")` and pass the result to `<RouteCards guides={...} />`.
4. Render a static 3–5 bullet roadmap block: "How family sponsorship works" — plain `<ul>` with navy bullets, no new component needed.
5. Render `<CtaCard heading="Need help choosing the right route?" ... />` at the bottom.
Do NOT duplicate step content from any guide. Do NOT invent fees or timelines not in DB.
**Where:** `app/(public)/visas/family/page.tsx` (new file)
**Expected result:** `/visas/family` renders a hub page with live guide cards from DB.
**Risk:** Low — new page, no changes to existing pages.

---

### Task 3.5 — Build /visas/golden hub page
**Label:** `do after launch skeleton`
**What:** Create `app/(public)/visas/golden/page.tsx`. Same pattern as Task 3.4. Metadata title: `"Golden Visa Dubai — Routes, Costs, and Eligibility"`. Hero title: `"Golden Visa Dubai"`. Roadmap bullets (static): 3 bullets on what the golden visa is and who it targets. `getPublishedGuidesByCategory("visas")` — initially only `golden-visa-dubai-property` will show; additional routes will populate automatically as published. Do NOT hardcode individual slugs in this file.
**Where:** `app/(public)/visas/golden/page.tsx` (new file)
**Expected result:** `/visas/golden` live with golden visa property guide card shown.
**Risk:** Low

---

### Task 3.6 — Build HubsGrid component for homepage
**Label:** `do after launch skeleton`
**What:** Create `components/HubsGrid.tsx`. This is a server component. Props: `hubs: { title: string, description: string, href: string, category: string }[]`. Renders: 1-column on mobile, 2-column on tablet, 3-column on desktop. Each tile: `CategoryIcon` at 20px, tile title as `<h3>`, 2-line description, brass "Explore →" link. Stone-50 background. Same surface styling as `TopicCard`. Do NOT show a hub tile if its `href` page does not yet exist.
**Where:** `components/HubsGrid.tsx` (new file)
**Expected result:** Reusable hub grid for homepage and future use.
**Risk:** Low

---

### Task 3.7 — Add HubsGrid to homepage (Section 3)
**Label:** `do after launch skeleton`
**What:** In `app/(public)/page.tsx`, import `HubsGrid` and add it as Section 3, between `HowItWorks` and Featured Guides. Pass two hubs only (those with live pages after Phase 3):
- `{ title: "Family Visas", description: "Spouse and child sponsorship — inside and outside UAE routes.", href: "/visas/family", category: "visas" }`
- `{ title: "Golden Visa", description: "Property investor route with official DLD fees.", href: "/visas/golden", category: "visas" }`
Add more hub entries as new hub pages are built.
**Where:** `app/(public)/page.tsx`
**Expected result:** Homepage shows 2 hub tiles in Section 3.
**Risk:** Low

---

### Task 3.8 — Add /visas parent route (navigation placeholder)
**Label:** `do after launch skeleton`
**What:** Create `app/(public)/visas/page.tsx`. This is a server component. It renders a simple page with: (a) `<h1>Dubai Visa Guides</h1>`, (b) the `HubsGrid` component with all live visa hubs, (c) `<CtaCard>` at the bottom. Export `metadata` with `title: "Dubai Visa Guides — All Routes and Requirements"`. This page is a navigation layer — it does NOT contain original guide content.
**Where:** `app/(public)/visas/page.tsx` (new file)
**Expected result:** `/visas` resolves (no 404). Shows hub tiles for family and golden visa.
**Risk:** Low

---

### Task 3.9 — Update QuickDecisionCards hub links
**Label:** `do after launch skeleton`
**What:** After Task 3.4 and 3.5 are complete, update `components/QuickDecisionCards.tsx`: change card 2 ("Sponsor my spouse") href from `/guides/spouse-dependent-visa-dubai` to `/visas/family`. Change card 3 ("Get a Golden Visa") href from `/guides/golden-visa-dubai-property` to `/visas/golden`.
**Where:** `components/QuickDecisionCards.tsx`
**Expected result:** Quick Decision Cards for spouse and golden visa route through hub pages.
**Risk:** Low

---

### Task 3.10 — Write employment-visa-dubai-outside-country guide
**Label:** `do after launch skeleton`
**What:** Create a new guide in admin (or via script). Slug: `employment-visa-dubai-outside-country`. This is a distinct route from `employment-visa` (which covers inside-UAE status change). This guide covers: employee exits UAE → applies for new work permit from outside → re-enters on entry permit → attends medical → gets visa stamped. Steps: 7 steps minimum. Title must be distinct from existing employment-visa title. Published: false (draft). Follow content writing standard in `CLAUDE.md`. Do NOT reuse step titles from `employment-visa`.
**Where:** Admin → `/admin/guides/new`
**Expected result:** New draft guide exists in DB. Slug is unique. Passes content writing standard.
**Risk:** Low

---

### Task 3.11 — Write spouse-dependent-visa-dubai-renewal guide
**Label:** `do after launch skeleton`
**What:** Create a new guide in admin. Slug: `spouse-dependent-visa-dubai-renewal`. 4–5 steps: check expiry date → gather documents (passport, Emirates ID) → apply at GDRFA or ICA → pay renewal fee → collect visa. Title: `"How to Renew a Spouse Dependent Visa in Dubai"`. Price: owner-verified AED amount. Timeline: owner-verified. Published: false (draft).
**Where:** Admin → `/admin/guides/new`
**Expected result:** New draft guide in DB. Distinct from new-application guides.
**Risk:** Low

---

### Task 3.12 — Write child-dependent-visa-dubai-renewal guide
**Label:** `do after launch skeleton`
**What:** Create a new guide in admin. Slug: `child-dependent-visa-dubai-renewal`. Same structure as Task 3.11. Title: `"How to Renew a Child Dependent Visa in Dubai"`. Fees and steps may differ from spouse renewal — populate accurately from owner knowledge.
**Where:** Admin → `/admin/guides/new`
**Expected result:** New draft guide in DB. Distinct from new-application child guides.
**Risk:** Low

---

### Task 3.13 — Write newborn-visa-dubai guide
**Label:** `do after launch skeleton`
**What:** Create a new guide in admin. Slug: `newborn-visa-dubai`. Two-phase process: Phase A = birth certificate attestation (hospital → MOHRE → MOFAIC); Phase B = Dubai Health Authority + residency permit + Emirates ID. Steps: 6–8. Title: `"How to Get a Residence Visa for a Newborn Baby in Dubai"`. Published: false (draft). Do NOT mix the birth certificate phase with the visa application phase — they are sequential, not parallel.
**Where:** Admin → `/admin/guides/new`
**Expected result:** New draft guide in DB covering both phases clearly.
**Risk:** Low

---

### Task 3.14 — Write ejari-registration-dubai guide
**Label:** `do after launch skeleton`
**What:** Create a new guide in admin. Slug: `ejari-registration-dubai`. Steps: contract signing → Ejari registration at RERA typing centre or Dubai REST app → receive Ejari certificate. Include: where to register (RERA, Dubai REST app), cost (owner-verified), why it is required (links sponsorship applications). Title: `"How to Register Ejari for a Tenancy Contract in Dubai"`. Published: false (draft).
**Where:** Admin → `/admin/guides/new`
**Expected result:** New draft guide in DB. Covers both in-person and app-based registration.
**Risk:** Low

---

### Task 3.15 — Write emirates-id-renewal-dubai guide
**Label:** `do after launch skeleton`
**What:** Create a new guide in admin. Slug: `emirates-id-renewal-dubai`. Steps: receive renewal notification from ICA → upload documents on ICA portal or visit ICA service centre → pay fee → collect new ID or receive by post. Include: ICA portal URL in address field, fee (AED amount from owner source), timeline. Title: `"How to Renew an Emirates ID in Dubai"`. Published: false (draft). This is a standalone guide — do NOT bundle with visa renewal.
**Where:** Admin → `/admin/guides/new`
**Expected result:** New draft guide in DB. Standalone from visa renewal.
**Risk:** Low

---

## Phase 4 — Conversion Layer (Calculator + Route Finder)

### Task 4.1 — Create lib/route-finder-config.ts (server-only)
**Label:** `do after launch skeleton`
**What:** Create `lib/route-finder-config.ts`. This file must never be imported in a client component or exposed via a public API route. Define the full `ROUTE_FINDER_CONFIG` object per the spec in `docs/route-finder-calculator-spec-v1.md`. Include all 5 sub-trees: `q1-who` → `q2-self` / `q2-location` / `q2-emp-loc` / `q2-property`. Define `resolutions` for all routes that have a published guide. For routes without a published guide, set `type: 'coming-soon'`. TypeScript types: `Question`, `RouteOption`, `RouteResolution` as defined in the spec.
**Where:** `lib/route-finder-config.ts` (new file — server-only)
**Expected result:** Config file exists with full question tree and resolution map. No browser API imports.
**Risk:** Medium — logic complexity; test each resolution path manually before wiring to UI.

---

### Task 4.2 — Build RouteFinderFlow client component
**Label:** `do after launch skeleton`
**What:** Create `components/RouteFinderFlow.tsx`. This is a client component (`"use client"`). Props: `config: typeof ROUTE_FINDER_CONFIG` (passed from server component — the config itself never executes client-side). State: `currentQuestionId: string`, `answers: Record<string, string>`. Renders: one question at a time. Each option is a button (navy border, white background, navy text on hover). On final answer, derives resolution and renders result card. Result card: guide title, estimated cost, estimated timeline, 3 key facts, "View Full Guide →" button (brass), "Contact Us →" secondary link. No loading spinner. No animation. No external data fetch — all data passed from server via props.
**Where:** `components/RouteFinderFlow.tsx` (new file)
**Expected result:** Multi-step question flow that resolves to a guide recommendation. No network call on answer selection.
**Risk:** Medium — state machine logic; test all branches manually.

---

### Task 4.3 — Build /find-my-visa page
**Label:** `do after launch skeleton`
**What:** Create `app/(public)/find-my-visa/page.tsx`. This is a server component. It must: (a) import `ROUTE_FINDER_CONFIG` from `lib/route-finder-config.ts`; (b) call `getPublishedGuides()` from `reader.ts` to hydrate guide data into resolution objects; (c) merge guide data (price, timeline, summary) into the config resolutions for the guides that are published; (d) render `<RouteFinderFlow config={hydratedConfig} />`. Export `metadata` with `title: "Find My Dubai Visa Route — Interactive Guide"`. Do NOT create any `/api/route-finder` endpoint. All logic must be in this server component or in `lib/route-finder-config.ts`.
**Where:** `app/(public)/find-my-visa/page.tsx` (new file)
**Expected result:** `/find-my-visa` renders the question flow. Result cards show accurate price/timeline from DB.
**Risk:** Medium — first time wiring config to live DB data.

---

### Task 4.4 — Update Hero primary CTA to /find-my-visa
**Label:** `do after launch skeleton`
**What:** In `components/Hero.tsx`, change "Find My Route" secondary CTA `href` from `/guides` (temporary placeholder from Task 2.4) to `/find-my-visa`. Also update the matching Quick Decision Card in `components/QuickDecisionCards.tsx`: card 6 ("Find the right route") href → `/find-my-visa`.
**Where:** `components/Hero.tsx`, `components/QuickDecisionCards.tsx`
**Expected result:** Both hero secondary CTA and QuickDecisionCard card 6 route to `/find-my-visa`.
**Risk:** Low

---

### Task 4.5 — Add "Find My Route" CTA to hub pages
**Label:** `do after launch skeleton`
**What:** In `app/(public)/visas/family/page.tsx` and `app/(public)/visas/golden/page.tsx`, add a `<CtaCard>` with `heading="Not sure which route applies to you?"`, `body="Answer 3 questions to find the right guide."`, `ctaText="Find My Route"`, `ctaHref="/find-my-visa"`. This CTA must appear above `<RouteCards>`, not at the bottom. Bottom of each hub page keeps the contact CTA.
**Where:** `app/(public)/visas/family/page.tsx`, `app/(public)/visas/golden/page.tsx`
**Expected result:** Hub pages show a calculator entry CTA before the guide list.
**Risk:** Low

---

### Task 4.6 — Verify calculator logic is never exposed as a public API
**Label:** `do after launch skeleton`
**What:** After Tasks 4.1–4.3 are built: (a) search the entire `app/api/` directory for any route that imports or exposes `route-finder-config.ts` — there must be none; (b) confirm `lib/route-finder-config.ts` does NOT have `"use client"` directive; (c) open browser DevTools Network tab, use the calculator, and confirm no request is made to any `/api/` endpoint during question answering or resolution display.
**Where:** `app/api/` (search), `lib/route-finder-config.ts` (verify no client directive), browser Network tab
**Expected result:** Zero API calls visible in DevTools during calculator use. Config is server-only.
**Risk:** Low (verification task)

---

## Phase 5 — Scale and Optimization

### Task 5.1 — Build guide list category filter
**Label:** `postpone`
**What:** Create `components/GuideListFilter.tsx` as a client component. Props: `categories: string[]`. Renders one button per category + "All" button. On click, sets `?category=visas` in URL via `router.replace(..., { scroll: false })`. In `app/(public)/guides/page.tsx`: read `searchParams.category` on the server; pass matching published guides to the guide list; render ALL guide cards in the initial HTML (not JS-injected) — use CSS or a `data-category` attribute + JS to show/hide, NOT conditional rendering that removes cards from the DOM. This preserves SEO Rule 4 (all content in initial HTML).
**Where:** `components/GuideListFilter.tsx` (new), `app/(public)/guides/page.tsx`
**Expected result:** Category filter buttons visible at `/guides`. URL updates on click. All guide cards present in page source.
**Risk:** Low — after 10+ guides exist; not worth building for 6.

---

### Task 5.2 — Add admin step reorder UI
**Label:** `postpone`
**What:** In `components/admin/StepList.tsx`, add up/down arrow buttons on each step card. Up arrow on the first step is hidden; down arrow on the last step is hidden. On click, call a new server action `reorderStepAction(guideId, stepId, direction: "up" | "down")` in `app/admin/actions.ts`. The action swaps `step_order` values between the target step and its neighbor. No drag-and-drop — arrow buttons only (simpler, accessible, no extra dependency).
**Where:** `components/admin/StepList.tsx`, `app/admin/actions.ts`
**Expected result:** Steps can be reordered in admin without deleting and recreating them.
**Risk:** Low — additive to existing step management.

---

### Task 5.3 — Add HowTo JSON-LD schema to guide pages
**Label:** `verify first`
**What:** PREREQUISITE: All published guide fees must be Tier A (verified against official source). Create `lib/seo.ts` with a `generateHowToSchema(guide: GuideData): object` function. Schema structure: `@type: HowTo`, `name: guide.title`, `totalCost: { @type: MonetaryAmount, currency: AED, value: guide.price }`, `step: guide.steps.map(s => ({ @type: HowToStep, name: s.title, text: s.what }))`. In `app/(public)/guides/[slug]/page.tsx`, inject `<script type="application/ld+json">{JSON.stringify(generateHowToSchema(guide))}</script>` inside `<head>` via Next.js metadata or a `<Script>` tag. Validate with Google Rich Results Test after deploy.
**Where:** `lib/seo.ts` (new), `app/(public)/guides/[slug]/page.tsx`
**Expected result:** Guide pages have valid HowTo schema. Rich results eligible in Google.
**Risk:** High if fees are unverified — incorrect schema data causes rich result removal.

---

### Task 5.4 — Upgrade child/spouse guide fee data to Tier A
**Label:** `verify first`
**What:** For each of the 4 child/spouse guides: (a) check each step cost against GDRFA portal (gdrfa.gov.ae) or ICA portal (ica.gov.ae); (b) if confirmed, update `last_updated` in DB to the month/year of verification; (c) mark each guide as Tier A in `docs/content-migration-and-gap-plan.md`. Do NOT publish updated fees without owner verification. This task is an owner task with Claude support for DB updates once data is confirmed.
**Where:** `data/guides.db` via admin, `docs/content-migration-and-gap-plan.md`
**Expected result:** Child and spouse guides upgraded from Tier B to Tier A. `last_updated` reflects verification date.
**Risk:** Low if done carefully — incorrect fee updates would be worse than leaving at Tier B.

---

### Task 5.5 — Write golden-visa-dubai-professional guide
**Label:** `verify first`
**What:** PREREQUISITE: Verify AED 30,000/month salary threshold against current ICA/GDRFA requirements (not the spec doc — confirm from official source at time of writing). If verified: create draft guide in admin. Slug: `golden-visa-dubai-professional`. Steps: salary proof → documents → ICA submission → medical → Emirates ID. Published: false. If threshold cannot be verified: do not write this guide yet.
**Where:** Admin → `/admin/guides/new` (only after verification)
**Expected result:** Draft guide exists only if eligibility criteria confirmed from official source.
**Risk:** High if unverified — incorrect eligibility rules published = major SEO + credibility risk.

---

### Task 5.6 — Write golden-visa-dubai-company-owner guide
**Label:** `verify first`
**What:** PREREQUISITE: Verify AED 2M capital requirement and 2-year audit requirement from ICA portal. If verified: create draft guide. Slug: `golden-visa-dubai-company-owner`. Do NOT write if either threshold is unconfirmed.
**Where:** Admin → `/admin/guides/new` (only after verification)
**Expected result:** Draft guide exists only if requirements confirmed.
**Risk:** High if unverified.

---

### Task 5.7 — Write golden-visa-dubai-bank-deposit guide
**Label:** `verify first`
**What:** PREREQUISITE: Verify AED 2M deposit requirement, eligible account types, and participating bank list from ICA portal. If verified: create draft guide. Slug: `golden-visa-dubai-bank-deposit`. Do NOT write if deposit structure or eligible banks cannot be confirmed.
**Where:** Admin → `/admin/guides/new` (only after verification)
**Expected result:** Draft guide exists only if deposit structure confirmed.
**Risk:** High if unverified.

---

### Task 5.8 — Investigate investor-visa-dubai-property status
**Label:** `verify first`
**What:** Before writing any investor-visa guide: check ICA portal and GDRFA portal to confirm whether the AED 750K investor visa route is still active (it may have been superseded by the AED 2M golden visa). If active: create draft guide, slug `investor-visa-dubai-property`. If discontinued or replaced: do NOT create the guide.
**Where:** Check: ica.gov.ae, gdrfa.gov.ae
**Expected result:** Confirmed status (active/discontinued). Guide written only if route is confirmed active.
**Risk:** High if written for a discontinued visa category.

---

### Task 5.9 — Write retirement-visa-dubai-property guide
**Label:** `verify first`
**What:** PREREQUISITE: Verify AED 1M minimum property value and age 55+ requirement from ICA/GDRFA. If verified: create draft. Slug: `retirement-visa-dubai-property`. Do NOT combine with investor visa or golden visa — this is a distinct retirement route.
**Where:** Admin → `/admin/guides/new` (only after verification)
**Expected result:** Draft guide exists only if requirements confirmed from official source.
**Risk:** High if unverified.

---

### Task 5.10 — Write domestic-worker-visa-dubai guide
**Label:** `verify first`
**What:** PREREQUISITE: Verify AED 25,000 household income threshold and process from MOHRE portal. If verified: create draft. Slug: `domestic-worker-visa-dubai`. Steps involve MOHRE domestic worker contract + standard residency permit flow. Do NOT invent contract terms.
**Where:** Admin → `/admin/guides/new` (only after verification)
**Expected result:** Draft guide exists only if MOHRE threshold confirmed.
**Risk:** High if unverified.

---

### Task 5.11 — Write parent-dependent-visa-dubai guide
**Label:** `verify first`
**What:** PREREQUISITE: Verify income requirements for sponsoring parents (higher than child/spouse). Source: GDRFA portal. If verified: create draft. Slug: `parent-dependent-visa-dubai`. Note in the guide that income threshold is higher than for spouse/child sponsorship — include the specific AED threshold in Step 1.
**Where:** Admin → `/admin/guides/new` (only after verification)
**Expected result:** Draft guide exists only if requirements confirmed.
**Risk:** High if unverified.

---

### Task 5.12 — Build PDF export for calculator results
**Label:** `postpone`
**What:** PREREQUISITE: Phase 4 (calculator) complete. Create `app/api/pdf/route.ts` as a Next.js API route handler. Uses a server-side PDF generation library (e.g., `@react-pdf/renderer` or `pdfkit`). Input: guide slug + user answers (as query params or POST body). Output: PDF file download. PDF must include: (a) guide title, (b) recommended route, (c) fee estimate breakdown, (d) abbreviated step list (titles only), (e) watermark: "DubaiGuide.com — Generated [date]". Rate-limit: max 10 PDF requests per IP per 60 minutes via middleware. Do NOT expose fee calculation logic in the URL params — resolve it server-side from the config.
**Where:** `app/api/pdf/route.ts` (new), middleware or rate-limit utility
**Expected result:** "Download Summary" button on calculator result page generates a watermarked PDF.
**Risk:** Medium — library dependency; server-side PDF generation adds build complexity.

---

### Task 5.13 — Add sitemap.xml generation
**Label:** `postpone`
**What:** Create `app/sitemap.ts` (Next.js App Router convention). Fetch all published guide slugs from `lib/db/reader.ts`. Return a sitemap array including: homepage (`/`), guides list (`/guides`), each published guide (`/guides/[slug]`), each group page (`/guides/child-dependent-visa-dubai`, `/guides/spouse-dependent-visa-dubai`), and hub pages once live (`/visas/family`, `/visas/golden`). `lastModified` for guides: use `guide.lastUpdated`. `priority`: guide pages = 0.9, hub pages = 0.8, homepage = 1.0. Do NOT include admin routes.
**Where:** `app/sitemap.ts` (new)
**Expected result:** `/sitemap.xml` returns valid XML with all public URLs.
**Risk:** Low

---

### Task 5.14 — Add Russian language routing
**Label:** `postpone`
**What:** PREREQUISITE: All `ru_*` fields in DB must be populated and owner-reviewed. Create `app/(public)/ru/guides/[slug]/page.tsx`. This is a server component. Reads `ru_*` fields from the guide via a new `getRussianGuideBySlug(slug)` function in `reader.ts`. Falls back to EN if `ru_title` or `ru_overview` is empty (per CLAUDE.md rule). Add `LanguageSwitcher` component to `components/Header.tsx`. Language switcher shows "EN / RU" links. Active language is highlighted. Do NOT implement until all `ru_*` fields are fully translated and owner-approved.
**Where:** `app/(public)/ru/guides/[slug]/page.tsx` (new), `lib/db/reader.ts` (new query), `components/Header.tsx`, `components/LanguageSwitcher.tsx` (new)
**Expected result:** `/ru/guides/[slug]` renders Russian content. Language switcher navigates between EN and RU versions.
**Risk:** Medium — URL routing change; test all redirects and fallbacks carefully.

---

### Task 5.15 — Add "Generate RU draft" button to admin guide editor
**Label:** `postpone`
**What:** PREREQUISITE: Russian routing (Task 5.14) must be built first. Add a button "Generate Russian Draft" in `app/admin/guides/[slug]/page.tsx`. On click, it calls a new server action `generateRussianDraftAction(guideId)` in `app/admin/actions.ts`. The action uses the Anthropic API (Claude) to translate `en_*` field values into Russian and writes the result into `ru_*` fields as a draft. Owner must review and manually save. Do NOT auto-publish translated content. Do NOT send guide content containing PII to the API. Follow CLAUDE.md spec: "populate `ru_*` fields with a draft translation, editable before saving."
**Where:** `app/admin/guides/[slug]/page.tsx`, `app/admin/actions.ts`
**Expected result:** Admin can generate a Russian draft for any guide in one click. Draft populates `ru_*` fields for review before saving.
**Risk:** Medium — external API call from admin; handle Anthropic API errors gracefully.

---

## Items Explicitly Out of Scope — Do Not Build

| Item | Reason |
|---|---|
| Blog / news section | Not in product vision; high maintenance; no content plan |
| Mainland LLC company setup guide | Requires deep DED source verification; postponed to Phase 3/4 |
| Free zone company comparison | Multiple free zones; needs per-zone guides first |
| Trade license renewal guide | Requires DED source verification |
| Freelance permit guide | Multiple issuers (DED + free zones); complex coverage risk |
| MOFA attestation standalone guide | Currently covered in guide advice fields; standalone needs more depth |
| Power of attorney guide | Legal service area; thin guide version is risky without legal review |
| User accounts / saved routes | Phase 3+ only; adds auth complexity before enough traffic |
| `/api/route-finder` public endpoint | Exposes business logic; anti-copy rule from `docs/anti-copy-friction-plan.md` |
| CAPTCHA on public pages | Harms SEO and UX; not worth it |
| JavaScript obfuscation | Harms dev experience; no real protection |
| Login wall for public guides | Destroys SEO entirely |
| Email capture on calculator result page | Phase 3 feature; do not add to V1 calculator |
| "Amer Services" booking page | We are a content site, not a service provider |
| "Legal Translation Services" page | Service provider content; out of scope |
| Fake trust badges ("5-star service", "trusted by X users") | Dishonest; harms premium positioning |
| Competitor comparison table | Cheapens the brand; not a content site pattern |
| Chat widget (3rd party) | External dependency; slows page; WhatsApp link sufficient |
| A/B testing infrastructure | Out of scope until significant traffic |
| Trademark registration | Too early for Phase 1 |
| DMCA automation | No real content worth protecting at current traffic level |

---

## Task Summary by Label

| Label | Count | Phases |
|---|---|---|
| `do now` | 14 | Phase 1 |
| `do after launch skeleton` | 28 | Phase 2, 3, 4 |
| `verify first` | 11 | Phase 5 (content), Phase 5 (schema) |
| `postpone` | 7 | Phase 5 (infrastructure) |
| **Total** | **60** | |

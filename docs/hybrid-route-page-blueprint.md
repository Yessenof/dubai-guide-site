# Hybrid Route Page Blueprint

Version: 1.0 — April 2026

Applies to:
- Group guide pages: `/guides/child-dependent-visa-dubai`, `/guides/spouse-dependent-visa-dubai`
- Individual guide pages: `/guides/[slug]`
- Future hub pages: `/visas/family`, `/visas/golden`

Product rule: Quick entry first. Deep content below.
Two user modes: fast (ad traffic — cost/timeline/fit check) and deep (SEO — full step-by-step).

---

## The Core Problem This Solves

Currently, guide pages serve deep readers well. The full step-by-step content is rich, accurate, and complete.

But for ad-traffic users, the page layout requires scrolling through 2+ paragraphs of overview text before reaching any cost or step information. A user who clicked a "Dubai family visa cost" ad and lands on this page cannot get their answer in the first screen.

The hybrid route page fixes this by inserting a compact fast-answer block between the guide header and the overview text. Deep readers skip past it to the overview. Fast users get their answer and either leave satisfied or choose to read on.

Neither user mode is penalized. Neither is forced to use the other mode's entry path.

---

## Page Types and Their Structures

There are three distinct page types in the route system. Each has its own section order.

---

## Page Type 1 — Group Guide Page (Tab Variant)

**Applies to:** `/guides/child-dependent-visa-dubai`, `/guides/spouse-dependent-visa-dubai`

**Used when:** Two related routes exist (inside UAE / outside UAE) that the user needs to distinguish between before reading.

### Section Order (Exact)

```
Section A  — Page Header
Section B  — Variant Tab Bar
Section C  — Route Snapshot Block (fast-answer layer)
Section D  — Who This Is For
Section E  — Process Overview
Section F  — Full Steps
Section G  — CTA Card
```

---

### Section A — Page Header

**Purpose:** Establish context. Confirm to the user that they are in the right place.

**What belongs here:**
- `h1`: the parent guide title (e.g., "How to Sponsor a Child Dependent Visa in Dubai")
- Category icon + category label (brass pill — existing `GuideHeader` pattern)
- Do NOT show price or timeline here on the group page header — those differ per tab, so they belong in Section C

**What does NOT belong here:**
- Tab switcher (that is Section B)
- Price or timeline (those are tab-specific)
- Audience description (that is Section D, per tab)

**Mobile behavior:**
- h1 wraps at 2–3 lines at 375px — acceptable.
- Category pill below h1. Consistent with existing `GuideHeader` component.

**SEO considerations:**
- h1 must match the parent concept, not a specific variant. The tab mechanism means both variants are on one URL.
- The page renders all tab data in the initial HTML (already implemented in `GuideTabs`). Both variants are indexable.

---

### Section B — Variant Tab Bar

**Purpose:** Immediately surface the route choice. The user must decide which variant applies before reading further. This is the primary UX decision point on this page.

**What belongs here:**
- 2 tabs: "Outside UAE" and "Inside UAE" (or whichever variants exist for the group)
- Active tab: navy background, white text
- Inactive tab: stone-100 background, navy text, hover state (stone-200)
- Tab bar is sticky on scroll — it stays visible as the user reads the steps below
  - Sticky position: `position: sticky; top: 0;` or at `top: [header height]`
  - Reason: users reading step 5 may realize they're on the wrong tab. Sticky tabs let them switch without scrolling back to the top.
  - On mobile: sticky tab bar must not overlap page content. Use appropriate `z-index` and background color.

**What does NOT belong here:**
- Three or more tabs (if three route variants exist, use a different pattern — see Page Type 3)
- Dropdown menu (the visual presence of the two tabs communicates the choice; a dropdown hides it)
- Price or timeline in the tab label

**Mobile behavior:**
- Tab bar: full-width row, equal-width tabs. Each tab 50% width.
- Tab text: 14px, no wrapping.
- Sticky at top of viewport (below the global navigation header).
- Tapping a tab switches instantly (client-side state, no network call).

**SEO considerations:**
- Sticky tab bar is client-side only. It does not affect the HTML structure of the page content.
- Both tab datasets are already in the initial RSC HTML payload — the sticky bar is a display affordance, not a content gate.

**Ad-traffic considerations:**
- If a user arrived from a specific ad ("Dubai family visa outside UAE"), the URL should include `?route=outside` so the correct tab is pre-selected. This is already implemented in the redirect system.
- The tab bar must be immediately visible on page load — it is the first interactive element.

---

### Section C — Route Snapshot Block

**Purpose:** The fast-answer layer. Shows total cost, total timeline, and 3–4 key steps as plain text — for users who need to assess fit without reading the full guide.

**This is a new section that does not currently exist. It must be inserted between the tab bar and the overview text.**

**What belongs here:**
- Heading: no `h2` — just a small brass overline label: `At a glance`
- Price: `guide.price` displayed as "Estimated cost: AED X – Y"
- Timeline: `guide.timeline` displayed as "Estimated time: Z weeks"
- 3–4 key step titles as plain text bullets (first 3–4 `step.title` values from the active tab's guide)
  - These are step titles only, not the full step content
  - Displayed as a simple `<ul>` with stone-500 text
- One-line eligibility note from `guide.audience` (truncated to 80 chars if needed)
- "See full steps below ↓" link styled as brass text, scroll-to-steps anchor

**Visual treatment:**
- Stone-50 background. 1px stone-200 border. 12px rounded corners. 16px padding all sides.
- Price and timeline in a 2-column row: price left, timeline right
- Step bullets below the price/timeline row
- Audience note in stone-500 below bullets
- This block must feel compact and scannable — not a summary of the article, but a spec sheet

**What does NOT belong here:**
- Step addresses, costs, or advice (those are in the full steps)
- The overview paragraphs (those are Section E)
- A CTA (the CTA is at the bottom of the page)
- A "Download PDF" button (that is Phase 5)
- More than 4 step titles — showing all 7 defeats the purpose

**Component:** `RouteSnapshot.tsx`
- Server component (or rendered within `GuideTabs.tsx` as part of active guide data)
- Props: `price: string, timeline: string, steps: { title: string }[], audience: string`
- Renders the stone-50 block described above

**Mobile behavior:**
- Full-width, below tab bar.
- Price row: 2-column. Price left, timeline right. Each value in navy `font-semibold`.
- Step bullets: 1-column list. 4 items max. Each item 1 line.
- "See full steps below ↓": centered, brass text link. 44px tap target.
- On mobile, this block should be the first thing visible after the tab bar — within the first screen if possible.

**CTA logic:**
- The only interactive element is "See full steps below ↓" — a same-page anchor scroll to the steps section.
- No navigation away from the page in this block. Users who want the full guide continue reading on this page.

**SEO considerations:**
- The step titles in this block are a subset of the full step content below. They are not duplicate content — they are a preview.
- Google may extract the `guide.price` and `guide.timeline` from this block as featured snippet data.
- This block is in the initial HTML — not JS-injected. Fully indexable.

**Ad-traffic considerations:**
- This block is the primary ROI element for paid ads. A user who clicked "Dubai child visa cost" lands here and sees "AED 1,800 – 2,200 | 3–6 weeks" within 2 seconds. That's the answer. They either qualify (read on) or don't (leave, which is also a win — no wasted consultation time).

---

### Section D — Who This Is For

**Purpose:** Eligibility confirmation. Fast users verify they are in the right process before reading.

**What belongs here:**
- Label: brass overline, text: `Who this is for`
- Content: `guide.audience` field (1–2 sentences, existing data)
- No additional content

**What does NOT belong here:**
- Long eligibility checklists (those go in Step 1 advice/warning fields)
- Comparison with other routes ("if you are not eligible for this route, consider...")

**Mobile behavior:**
- Plain text block. No card border. stone-700 text. Consistent with existing guide page rendering.

---

### Section E — Process Overview

**Purpose:** Context for deep readers. Explains the route structure, who handles what, and what the general flow is before they read the steps.

**What belongs here:**
- `guide.overview` field (2 paragraphs, existing data)
- No modification to this field's content

**What does NOT belong here:**
- Fees or timelines (those are in Section C and in the steps)
- Step-by-step content (that is Section F)
- CTAs

**Mobile behavior:**
- Plain text. Same existing rendering. No changes required.

---

### Section F — Full Steps

**Purpose:** The complete process. Step-by-step detail for users who are executing or planning.

**What belongs here:**
- All `StepCard` components (existing), in order
- Each StepCard: title, what, where, address/portal, cost, time, advice, warning

**What does NOT belong here:**
- Any modification to the existing StepCard component
- A collapsed/accordion version of the steps (all steps must be visible in initial HTML — SEO Rule 4)

**Mobile behavior:**
- Existing StepCard mobile behavior. No changes required.

---

### Section G — CTA Card

**Purpose:** Conversion for users who have read the guide and want help executing it.

**What belongs here:**
- Reuse `CtaCard` component (navy card, consistent with current guide pages)
- Heading: `Ready to start?` or `Need help with this process?`
- CTA: `Contact Us` → `/contact`

---

## Page Type 2 — Individual Guide Page

**Applies to:** `/guides/[slug]` — guides without variants (e.g., `employment-visa`, `golden-visa-dubai-property`)

### Section Order (Exact)

```
Section A  — Guide Header
Section B  — Route Snapshot Block
Section C  — Who This Is For
Section D  — Process Overview
Section E  — Full Steps
Section F  — CTA Card
```

**Differences from Page Type 1:**
- No tab bar (this page covers one route only)
- `GuideHeader` shows `guide.price` and `guide.timeline` (they are fixed for a single-route guide)
- Route Snapshot Block is still present — it provides a compact version of the cost/step preview even on single-route pages

**Route Snapshot Block on individual guide pages:**
- Same component as Page Type 1 (`RouteSnapshot.tsx`)
- Position: below `GuideHeader`, above `Who This Is For`
- Props come from the single guide's data
- On pages where `GuideHeader` already shows price and timeline prominently, the Route Snapshot Block serves a different function: it shows the 3–4 key step titles and the audience note as a scannable spec sheet. Users see "Is this really 7 steps? What are they?" before committing to reading.

**SEO considerations (individual guide pages):**
- These pages are the primary SEO assets. Each one ranks for its specific query.
- The Route Snapshot Block does not add new content — it surfaces existing content earlier. No duplicate content risk.
- `<title>` = `{guide.title} — Dubai Guide`. `<meta description>` = `{guide.summary}`.

**Ad-traffic considerations:**
- Individual guide pages are the correct landing pages for specific paid ads ("Dubai employment visa cost", "Golden Visa property Dubai").
- The Route Snapshot Block delivers the cost/timeline answer within the first screen, preventing the bounce that happens when users must scroll to find pricing.

---

## Page Type 3 — Hub Page (Service Hub)

**Applies to:** `/visas/family`, `/visas/golden`, `/visas`, future hubs

Hub pages are navigation + decision layers. They are NOT articles. They do NOT have steps.

### Section Order (Exact)

```
Section A  — Hub Hero (h1, subhead, primary CTA)
Section B  — Quick Decision Cards (2–4 cards, route intents)
Section C  — Route Cards with Price + Timeline (from DB)
Section D  — Short Roadmap Block (3–5 bullets)
Section E  — Calculator CTA (when calculator exists)
Section F  — Full Guide Links
Section G  — CTA Card
Section H  — Trust Signal
Section I  — Related Hubs
```

**Key constraint:** No step content on hub pages. No StepCard components. No copying of overview text from guide pages.

**Route Cards (Section C):**
- Each card: route title, 1-line eligibility note, `guide.price`, `guide.timeline`, "Full guide →" link
- Data from DB — not hardcoded
- Only published guides show cards
- This is the hub page's version of the Route Snapshot Band from the homepage

**Short Roadmap Block (Section D):**
- 3–5 plain text bullets summarizing the general process sequence
- Uses `<ol>` or `<ul>` only — no StepCard component
- Text is original to the hub page — not copied from any guide's overview
- Example for family visa hub:
  1. Open a family file at an Amer Centre
  2. Apply for entry permit (if family member is outside UAE)
  3. Family member enters Dubai on the permit
  4. Medical test and Emirates ID application
  5. Residence visa stamping

**Mobile behavior for hub pages:**
- Section B (Quick Decision Cards): 1-col stack on mobile
- Section C (Route Cards): 1-col stack on mobile, with price/timeline as 2-col mini-row inside each card
- Section D (Roadmap): plain bullet list, 16px padding

**CTA logic on hub pages:**
- Section B cards: direct navigation to the relevant group guide or individual guide
- Section C cards: "Full guide →" links directly to the guide page
- Section E (Calculator CTA): "Find My Route →" → `/find-my-visa`
- Section G (CTA Card): "Contact Us" → `/contact`

**SEO considerations:**
- Hub pages have `<h1>` = hub title, `<meta description>` = one-sentence hub summary
- They are NOT primary rankers for specific visa queries — the guide pages are
- Hub pages rank for broader queries ("Dubai family visa options", "types of Dubai golden visa")
- Hub pages must not duplicate full guide content — Google will split relevance between hub and guide, weakening both

**Ad-traffic considerations:**
- Hub pages are appropriate landing pages for broad ad campaigns ("Dubai family visa — all routes")
- They are NOT appropriate for specific intent ads ("Dubai spouse visa cost") — those should land on the specific guide page
- The Route Cards (Section C) serve the same fast-answer function as the Route Snapshot Band on the homepage

---

## Tab Stickiness — Technical Requirement

The variant tab bar (Section B in Page Type 1) must be sticky during scroll.

**Why:** Users reading step 4 of the "Outside UAE" variant may realize they need the "Inside UAE" variant. Without sticky tabs, they must scroll back to the top to switch. With sticky tabs, they switch instantly from wherever they are on the page.

**Implementation:**
- Tab bar container: `position: sticky; top: [nav height]px; z-index: 10; background: white;`
- The nav height is the height of the public Header component (currently approximately 56–64px)
- A `box-shadow: 0 1px 0 0 #e7e5e4` (stone-200) below the sticky tab bar separates it visually from page content during scroll

**Mobile implementation:**
- Same sticky behavior
- Tab bar must remain full-width
- The sticky tab bar must not collapse or disappear on scroll — it must stay in place for the full page length

**What NOT to do:**
- Do NOT use `position: fixed` — that takes the tab bar out of document flow and can cause layout shift
- Do NOT collapse the tab bar to a dropdown on mobile — the visual presence of the two tabs is the UX
- Do NOT animate the tab switch — instant state change only

---

## Calculator Result → Full Guide Flow

When the calculator (`/find-my-visa`) resolves to a guide recommendation, the result card must lead naturally into the guide.

**Result card structure:**
1. Route title (from `guide.title`)
2. 3 key facts (from `RouteResolution.keyFacts` in the config)
3. Estimated cost (from `guide.price`)
4. Estimated timeline (from `guide.timeline`)
5. Primary CTA: `View Full Step-by-Step Guide →` → `href="/guides/[guideSlug]"` (brass button or navy button)
6. Secondary link: `Contact Us →` → `/contact`

**When user taps "View Full Step-by-Step Guide →":**
- Full navigation to the guide page (not a modal, not an embed)
- The guide page opens to its top, with the Route Snapshot Block visible immediately
- The user transitions from calculator result (fast answer) to guide page (deep content) in one click
- This transition is the natural progression from fast mode to deep mode — the two layers connect seamlessly

**When the resolved guide is not yet published:**
- Result card shows: `This guide is in progress.`
- Primary CTA becomes: `Contact us for this process →` → `/contact`
- Do NOT link to a draft guide or a 404

---

## Recommended Route Page Structure

**For group guides (tab variants):** Page Header → Sticky Tab Bar → Route Snapshot Block → Who This Is For → Overview → Full Steps → CTA Card

**For individual guides:** Guide Header → Route Snapshot Block → Who This Is For → Overview → Full Steps → CTA Card

**For hub pages:** Hub Hero → Quick Decision Cards → Route Cards with Price/Timeline → Short Roadmap → Calculator CTA → Guide Links → CTA Card → Trust Signal → Related Hubs

The single most impactful change to implement first is **adding the Route Snapshot Block** (Section C in Page Type 1, Section B in Page Type 2) to existing guide and group pages. This requires one new component (`RouteSnapshot.tsx`) and a one-line insertion in the existing page templates. No schema change. No change to existing content. High impact for ad-traffic conversion.

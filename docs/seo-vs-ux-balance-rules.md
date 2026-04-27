# SEO vs UX Balance Rules

Version: 1.0 — April 2026

These are product-level rules. They define what content belongs where,
how to prevent UX improvements from harming SEO, and how to prevent
SEO requirements from creating a poor user experience.

---

## Core Tension

UX improvements that harm SEO:
- Moving step content into tab/accordion/JS-toggled elements (reduces crawler visibility)
- Splitting guide content across multiple sub-pages with thin individual content
- Route-finder-only entry (if calculator is the only path to content, Google can't index the content)
- Merging all guides into one mega-page (destroys URL-level targeting)

SEO requirements that create poor UX:
- Long walls of text for keyword density (harms readability)
- Keyword-stuffed titles that aren't human-friendly
- Forcing users through guide pages when they want a quick answer
- Duplicating step content across hub pages and guide pages (confuses both users and crawlers)

---

## Rule Set

### Rule 1: Full step content belongs only in guide pages

**What belongs in `/guides/[slug]`:**
- Complete step-by-step content
- Per-step costs and timelines
- Specific addresses and portals
- Advice and warning fields

**What does NOT belong in guide pages:**
- Sales CTAs beyond the bottom CTA card
- Calculator widgets embedded mid-guide
- "Related services" upsell sections
- Competitor comparisons

**Reason:** Guide pages are the SEO assets. Diluting them with commercial content reduces their topical authority and increases bounce rate.

---

### Rule 2: Hub pages summarize, they do not duplicate

**What belongs in `/visas/family` (hub):**
- Quick decision cards
- Route cards with fees + timeline pulled from guide DB
- Short roadmap (3–5 bullets — not StepCard components)
- Links to full guide pages

**What does NOT belong in hub pages:**
- Full step content copied from guides
- New original content that should be in a guide
- Duplicate fee tables that diverge from guide data

**Reason:** If a hub page duplicates a guide's content, Google will canonicalize one and ignore the other, or split relevance between them. Hub pages should derive their authority from internal links, not from original content.

---

### Rule 3: Calculator pages are conversion tools, not SEO targets

**What the calculator page (`/find-my-visa`) is:**
- A tool that routes users to the right guide
- A cost/timeline estimator
- A lead generation entry point

**What it is NOT:**
- An SEO landing page for specific visa queries
- A replacement for guide content
- A way to hide content from Google

**Implementation rule:** The result of the calculator always links to a published guide page. The guide page is the SEO asset. The calculator is the UX layer.

**Reason:** If calculator results are only visible after form completion, Google cannot index them. That is fine — the guide pages carry the SEO value. Do not try to make the calculator itself rank.

---

### Rule 4: JavaScript-gated content requires a fallback

The tab-based group pages (`/guides/child-dependent-visa-dubai`) use client-side tab switching.
The initial server-rendered HTML contains both tab datasets (both guides are preloaded).

**Rule:** Any content that switches via JavaScript must also exist in the initial HTML.

**Applies to:**
- GuideTabs component — both guide datasets are in the RSC payload ✓ (already correct)
- Any future accordion or expand/collapse components
- Any future category filter on the guide list

**Not acceptable:** Using JavaScript to show/hide content that is not in the initial HTML.
This makes content invisible to Google.

---

### Rule 5: Every published guide must be able to rank standalone

**Rule:** A guide page must answer its specific question completely, without requiring the user to visit the hub or the homepage first.

**Checklist per guide:**
- [ ] h1 matches the guide's primary keyword
- [ ] Summary explains the topic in 1–2 sentences (usable as meta description)
- [ ] Overview explains the full process in plain language
- [ ] Steps contain real costs, timelines, and locations
- [ ] last_updated field is populated
- [ ] No section says "see our other guide for..." as the only answer

**Reason:** Most organic traffic lands directly on a guide page from Google. If the guide requires hub context to make sense, it will not rank.

---

### Rule 6: Category-level pages become SEO assets only after content volume

Category pages (e.g., `/visas`) will rank for broad terms like "Dubai visa guide" only when:
- They link to 8+ published guides in that category
- The guides are high-quality and each covers a distinct subtopic
- The hub page has at least 300 words of original introductory content (not duplicated from guides)

**Phase rule:** Do not build category hub pages for SEO purposes until minimum content volume is reached.
Build them for navigation purposes first, then add original overview content in Phase 3.

---

### Rule 7: Guide URLs never change after publication

This is already in `SEO_STRATEGY.md` and `CLAUDE.md`. Restated here for visibility.

- `/guides/employment-visa` — locked ✓
- `/guides/spouse-dependent-visa-dubai-outside-country` — locked once published
- `/guides/child-dependent-visa-dubai-outside-country` — locked once published

If a guide title changes, the slug does not change.
If a guide scope changes significantly, create a new guide with a new slug — do not redirect arbitrarily.

---

### Rule 8: Paid ad landing pages should be guides, not hub pages

When running ads for specific queries (e.g., "Dubai spouse visa cost"), the landing page should be the guide page directly — not the hub page.

**Reason:** Hub pages are discovery layers with multiple topics. A user clicking a specific ad expects a specific answer. Guide pages provide that.

**Hub pages** can be used as landing pages only for very broad ad campaigns (e.g., "Dubai family visa — all routes").

---

### Rule 9: Content depth > content volume

It is better to have 5 excellent well-verified guides than 20 thin or inaccurate ones.

- Do not publish a guide until content meets the quality bar in `CLAUDE.md`
- Do not rush to publish guides with unverified fee data
- Inaccurate guides rank briefly, then accumulate negative signals (high bounce, low CTR)
- One guide with real, useful, accurate content is worth more SEO investment than three placeholder guides

---

### Rule 10: Structured data (HowTo schema) is Phase 7

HowTo JSON-LD schema for step guides significantly improves Google rich result eligibility.

Do not implement it now — the schema must be accurate, and adding it to guides with unverified fees creates a risk of rich result removal.

Implementation order:
1. Verify all published guide fees against official sources
2. Add `lastUpdated` dates
3. Implement HowTo schema in Phase 7

---

## Summary Table

| What | Where it belongs | SEO role | UX role |
|---|---|---|---|
| Full steps, per-step costs | Guide page (`/guides/[slug]`) | Primary ranker | Deep information |
| Quick route cards with fees | Hub page (`/visas/family`) | Internal link cluster | Discovery layer |
| Short roadmap bullets | Hub page | Supporting context | Orientation |
| Calculator / route finder | `/find-my-visa` | Not a direct ranker | Conversion tool |
| FAQ-style content | Guide advice/warning fields | Snippet extraction | Problem solver |
| Trust signals | Homepage + guide footer | Authority signal | Confidence builder |
| Meta description | `guide.summary` field | Click-through rate | Summary |

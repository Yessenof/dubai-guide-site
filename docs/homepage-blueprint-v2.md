# Homepage Blueprint v2

Version: 1.0 — April 2026
Replaces: `homepage-restructure-plan.md` (v1 is still valid for context; this doc is the build reference)

Product rule: Quick entry first. Deep content below.
Two user modes served simultaneously — ad traffic (fast, intent-driven) and SEO traffic (deep, research-driven).

---

## Design Philosophy

The homepage is not a brochure. It is a routing surface.

Ad-traffic users arrive from a specific search or ad click. They want to know: does this site cover my situation, how much will it cost, and how long will it take? They form this judgment in under 10 seconds. If the first scroll does not answer these questions, they leave.

SEO users arrive organically, often less certain of exactly what they need. They want to explore, verify, and understand before committing. They will scroll. They will read. They reward depth and accuracy.

These two modes are NOT in conflict. The homepage satisfies both by:
- Putting fast answers at the top (decision cards, cost/timeline band)
- Putting deep content below (featured guides, how it works)
- Never hiding either layer behind the other

---

## Section Order (Exact — Do Not Reorder)

```
Section 1  — Hero
Section 2  — Quick Decision Cards
Section 3  — Route Snapshot Band
Section 4  — Featured Guides
Section 5  — How It Works
Section 6  — Service Hubs Grid (Phase 3 — add when 2+ hubs exist)
Section 7  — Trust Bar
Section 8  — Bottom CTA
```

---

## Section 1 — Hero

**Purpose:** First impression for paid ad traffic. Immediate clarity on what the site is. One entry CTA.

**What belongs here:**
- `h1`: One direct line. No tagline framing. No question format.
  - Use: `Dubai Visas and Procedures — Step by Step`
  - Acceptable alternative: `Dubai Visa Guides — Costs, Steps, and Official Process`
  - Do NOT use: "Everything You Need to Know", "Ultimate Guide", "We Help You Navigate"
- Subheadline: one sentence, 25 words max. States scope.
  - Use: `Step-by-step guides to visas, company setup, and relocation in Dubai. Government fees and official process — in plain English.`
- Primary CTA button: `Browse All Guides` → `/guides`
  - Style: navy background (`--color-navy`), white text, full-width on mobile
  - This is the safe primary CTA until the calculator is built
- Secondary CTA: `Find My Route →` → `/find-my-visa` (update href when Phase 4 is live; point to `/guides` as interim)
  - Style: brass text (`--color-brass`), no button border, plain inline link

**What does NOT belong here:**
- Stock photos or illustrations
- Testimonials or review badges
- "As seen in" logos
- Countdown timers or urgency copy
- Chat widget embed
- Any fee amounts (those go in Section 3)

**Mobile behavior:**
- h1: max 2 lines at 375px. Font size must not overflow.
- Subheadline: max 3 lines. Truncate with line-clamp if needed.
- Primary CTA: 100% width, 48px height minimum.
- Secondary CTA: centered below primary button, 16px gap.
- No image. Clean white background only.

**CTA logic:**
- Primary: directs to guide list. Works without the calculator existing. No dead links.
- Secondary: directs to calculator (Phase 4). Until calculator is live, this link points to `/guides` — do NOT disable or hide the link on the homepage.

**SEO considerations:**
- h1 is the homepage's primary keyword signal. "Dubai Visas and Procedures" captures broad navigational intent.
- Subheadline can be used as the homepage `<meta description>` — it is under 155 characters.
- No JavaScript required for this section. Renders server-side.

**Ad-traffic considerations:**
- For paid ads targeting "Dubai visa process" or "Dubai family visa cost", the hero must confirm relevance within 2 seconds.
- The h1 should match or closely echo the ad headline. If running specific ads (e.g., "Dubai spouse visa"), consider using a custom landing page (`/guides/spouse-dependent-visa-dubai`) rather than the homepage.

---

## Section 2 — Quick Decision Cards

**Purpose:** Fast intent-based routing for ad-traffic users who know what they want. Answers "what are my options?" without requiring any scroll on desktop.

**What belongs here:**
- 6 intent cards. Each card:
  - Short action label: 5 words max, starts with a verb or noun
  - No description text, no fees, no timelines
  - One tap/click destination
  - Small icon (CategoryIcon or extended icon set at 16px)
- Section heading above cards: `h2` styled as brass overline, text: `What do you need?`

**The 6 cards (exact):**
1. "Sponsor my spouse" → `/guides/spouse-dependent-visa-dubai`
   (Update to `/visas/family` when Phase 3 hub is live)
2. "Bring my child to Dubai" → `/guides/child-dependent-visa-dubai`
3. "Get a Golden Visa" → `/guides/golden-visa-dubai-property`
   (Update to `/visas/golden` when Phase 3 hub is live)
4. "Get an employment visa" → `/guides/employment-visa`
5. "Set up a company" → `/guides` (placeholder; update to `/company` when hub exists)
6. "Find the right route" → `/find-my-visa` (update href in Phase 4; interim: `/guides`)

**Rule: Only show a card if its destination is a real, published page. If a page does not exist, remove the card — do not leave a link to a 404 or an unpublished guide.**

**What does NOT belong here:**
- Fees or timelines (those are in Section 3)
- Sub-labels or descriptions (the action label must be sufficient)
- More than 6 cards
- A "See all" link under the cards (that goes under Featured Guides in Section 4)

**Mobile behavior:**
- 2-column grid. 3 rows. Each card: 48px minimum tap target.
- Card label text: 14px, one line. No wrapping.
- Icon: 16px, left-aligned or centered above label.
- On scroll, these cards must NOT stick — they are part of the page flow, not a sticky nav.

**CTA logic:**
- Each card is a navigation shortcut. No modals, no accordions on tap.
- Tap navigates directly to the destination. Full page navigation.

**SEO considerations:**
- These cards do not contain full h2 text that would compete with guide pages.
- Internal links from homepage to guide pages improve crawl depth for each linked guide.
- Cards with placeholder links (`/guides`) do not create SEO risk — they just link to the guide list.

**Ad-traffic considerations:**
- This section serves users who clicked a generic ad ("Dubai visa help") and now need to self-select their situation.
- The card labels are short imperative phrases — they match the mental model of someone mid-task, not someone researching abstractly.
- Cards resolve within one tap. No intermediate confirmation or modal.

---

## Section 3 — Route Snapshot Band

**Purpose:** The primary fast-answer layer for ad-traffic users. Shows cost and timeline for the 3–4 most-searched routes without requiring navigation. This section is what differentiates the homepage from a generic guide site.

**What belongs here:**
- 3–4 route cards pulled from the guide DB
- Each card shows:
  - Route title (e.g., "Employment Visa — Inside UAE")
  - Who it is for: 1-line audience description from `guide.audience` (truncated to 60 chars)
  - Estimated total cost: from `guide.price` (e.g., "AED 4,900 – 7,300")
  - Estimated timeline: from `guide.timeline` (e.g., "2–4 weeks")
  - "Full guide →" link in brass text
- Section heading: `h2` styled as brass overline, text: `Common Routes and Costs`

**Route selection for this band (in order):**
1. Employment visa inside UAE (`employment-visa`) — highest organic search volume
2. Spouse dependent visa (`spouse-dependent-visa-dubai`) — second highest
3. Child dependent visa (`child-dependent-visa-dubai`) — pairs with spouse
4. Golden Visa property (`golden-visa-dubai-property`) — highest revenue intent

**Data source:** `lib/db/reader.ts` — `getPublishedGuides()` filtered to these 4 slugs. If a guide is not published, that card is omitted. Component renders only what is live.

**What does NOT belong here:**
- Full step content
- Step-level cost breakdowns (those are in the full guides)
- Fees that are not in the guide DB (no hardcoded numbers in this component)
- More than 4 cards on desktop (the section becomes noise above 4)
- Calculator or form inputs

**Mobile behavior:**
- 1-column stack at 375px. Each card full-width.
- Price and timeline rendered in a 2-column mini-row inside each card: price left, timeline right.
- "Full guide →" link: right-aligned, 44px tap target height.
- On desktop (1024px+): 2-column grid, 2 rows.

**Component:** `RouteSnapshotBand.tsx`
- Server component
- Props: `guides: { slug, title, audience, price, timeline }[]`
- Fetched in `app/(public)/page.tsx` using targeted slug array
- Renders 0–4 cards depending on how many guides are published

**CTA logic:**
- Each card: one CTA only — "Full guide →" links to the guide page.
- No "Contact us" CTA in this section. The bottom CTA (Section 8) handles that.

**SEO considerations:**
- Content in this section (price/timeline data) reinforces topical authority of the homepage.
- These are not duplicate content — they are summary extracts from the guide pages, which are the canonical source.
- Google can extract these cost/timeline data points as featured snippet candidates.

**Ad-traffic considerations:**
- This section is the main ROI for paid traffic. A user who clicks a "Dubai employment visa cost" ad and immediately sees "AED 4,900 – 7,300 | 2–4 weeks" has their question answered before they consider leaving.
- Keep this section at or near the top of the viewport on desktop (below the fold is acceptable on mobile — they will scroll after the Quick Decision Cards).

---

## Section 4 — Featured Guides

**Purpose:** Depth entry for SEO users. Showcases the quality and range of guide content. Secondary navigation for users who want to read in full before deciding.

**What belongs here:**
- 3 guide cards using the existing `TopicCard` component (unchanged)
- Selection: 3 most recently published guides OR owner-curated set
- "See all guides →" brass text link below the cards, pointing to `/guides`
- Section heading: `h2`, text: `Step-by-Step Guides`

**What does NOT belong here:**
- Draft guides
- Cards for hub pages (hub pages go in Section 6)
- A search box or filter (those are on the `/guides` page)
- Guide step content or fee breakdowns (those are in the guides themselves)

**Mobile behavior:**
- 1-column stack at 375px. Cards at full width.
- "See all guides →" link: full-width centered, 24px top margin.

**CTA logic:**
- Each TopicCard links to its guide page. No modal preview.
- "See all guides →" takes users to the full guide list.

**SEO considerations:**
- Internal links to published guide pages from homepage strengthen guide page authority.
- TopicCard renders guide title and summary — both are indexable content.

**Ad-traffic considerations:**
- Ad traffic users who are not satisfied by the Quick Decision Cards or Route Snapshot Band may scan this section. The card titles must be specific enough to confirm relevance.

---

## Section 5 — How It Works

**Purpose:** Reduce first-visit bounce rate. Explain the site's model in 3 lines for users who are not sure whether to trust or use the content.

**What belongs here:**
- 3 items, each with a short label and 1-line description:
  - "Real process, real costs" — Government fees and timelines from official sources.
  - "Step by step" — Every guide breaks the process into clear, actionable steps.
  - "Always free" — No paywalls, no sales pitches, no hidden upsells.
- No section heading. The 3 items are self-explanatory.
- No icons required (optional: small inline SVG at 16px per item)

**What does NOT belong here:**
- Feature list with 10 bullet points
- "About us" marketing copy
- Any claim that cannot be verified (e.g., "Over 10,000 users helped")
- Fake social proof

**Mobile behavior:**
- 1-column vertical stack at 375px.
- Each item: label in navy (`font-semibold`), description in stone-600, 12px gap between label and description, 24px gap between items.

**CTA logic:**
- No CTA in this section. It is a trust signal, not a conversion point.

**SEO considerations:**
- This content reinforces the E-E-A-T signals that support guide page authority. "Official sources" and "real costs" are signals of expertise and authority.

**Ad-traffic considerations:**
- Ad traffic users often arrive skeptical (they've been burned by low-quality Dubai "guide" sites that are actually service funnels). This section reduces that friction. Keep it short. 3 items maximum.

---

## Section 6 — Service Hubs Grid

**Purpose:** Topic-level navigation for users who want to explore a specific area. Secondary SEO internal linking layer.

**Build trigger:** Do NOT add this section until at least 2 hub pages exist at `/visas/family` and `/visas/golden`. Until then, this section is absent from the homepage.

**What belongs here (when built):**
- Hub tiles for each live sub-hub
- Each tile: `CategoryIcon` at 20px, hub title as `h3`, 2-line description, "Explore →" brass link
- Layout: 1-col mobile, 2-col tablet, 3-col desktop
- Initial tiles (when first built): Visas (linking to `/visas`), Family Visas (linking to `/visas/family`), Golden Visa (linking to `/visas/golden`)

**What does NOT belong here:**
- A tile for a hub that doesn't exist yet
- A tile for `/company` or `/living` until those hub pages are built

**Mobile behavior:**
- 1-column stack. Each tile full-width. Same stone-50 surface as TopicCard.

**SEO considerations:**
- Hub pages are navigation layers, not primary SEO assets. These links improve crawl efficiency but are not the primary internal linking mechanism. Guide links (Section 4) are higher SEO priority.

---

## Section 7 — Trust Bar

**Purpose:** Accuracy and freshness signal for SEO users and first-time visitors. Supports E-E-A-T.

**What belongs here:**
- One line of text: `Fees verified against official UAE government sources.`
- Second line: `Last updated: [most recent guide.last_updated date pulled from DB]`
- Optional: a small lock icon or check icon at 14px (inline SVG only — no external icon library)

**What does NOT belong here:**
- Star ratings
- "Trusted by X users" claims (fabricated or unverified)
- Media logo badges unless genuinely earned
- Any claim sourced from marketing copy rather than verified fact

**Mobile behavior:**
- Centered text. 14px. Stone-500 color. 16px padding top and bottom.

**CTA logic:** None. This is a signal section, not a conversion point.

**SEO considerations:**
- "Verified against official UAE government sources" is a topical authority signal.
- "Last updated" date signals freshness — important for queries with recency intent ("Dubai visa requirements 2025").

---

## Section 8 — Bottom CTA

**Purpose:** Final conversion point for users who scrolled the entire homepage without clicking anything. Reduces bounce for indecisive users.

**What belongs here:**
- Reuse `CtaCard` component (same navy CTA card from guide pages)
- Heading: `Not sure where to start?`
- Body: `We can help you find the right route and what it costs.`
- CTA button: `Contact Us` → `/contact`
- Secondary link: `Browse All Guides` → `/guides`

**What does NOT belong here:**
- An inline contact form (that creates its own support burden; link to the contact page instead)
- A WhatsApp floating button (that goes in the layout/header when the site is ready for consultations)
- A newsletter signup

**Mobile behavior:**
- Full-width navy card. CTA button full-width, 48px height. Secondary link centered below.

---

## Complete Homepage Structure at Phase 1 (Launch)

Present at launch:
- Section 1: Hero ✅
- Section 2: Quick Decision Cards ✅
- Section 3: Route Snapshot Band ✅ (loads from published guides)
- Section 4: Featured Guides ✅
- Section 5: How It Works ✅
- Section 7: Trust Bar ✅
- Section 8: Bottom CTA ✅

Absent at launch (add later):
- Section 6: Service Hubs Grid — add after `/visas/family` and `/visas/golden` are built

---

## Recommended Homepage Structure

This is the single best structure for this project:

**Hero → Quick Decision Cards → Route Snapshot Band → Featured Guides → How It Works → Trust Bar → Bottom CTA**

Rationale:
- Ad-traffic users get price/timeline in 2 scrolls on mobile (Hero → Quick Decision → Route Snapshot)
- SEO users get full guide access in the same 2 scrolls and can continue to Featured Guides
- The Route Snapshot Band is the differentiating element — FamilyVisa.ae hides costs behind a calculator; we show them openly. This is the content moat expressed at the homepage level.
- The structure does not require the calculator to exist. Every section works today.

# Interaction Patterns — Mobile First

Version: 1.0 — April 2026

Applies to all public pages. Admin is excluded.

These are concrete, build-ready patterns. No general principles. No vague guidance.
Every pattern describes exact behavior, exact CSS approach, and what NOT to do.

---

## Design Constraints (Non-Negotiable)

1. Minimum tap target: 44px height AND 44px width on all interactive elements
2. No horizontal scroll on any page at 375px viewport
3. No content hidden in initial HTML that is visible to the user (SEO Rule 4)
4. No JavaScript required to read any guide content
5. All interactive enhancements (tab switching, sticky bar, filter) are progressive — the page must be functional without them
6. Touch targets must not overlap or be closer than 8px to an adjacent touch target

---

## Pattern 1 — Sticky Tab Bar (Group Guide Pages)

**Used on:** `/guides/child-dependent-visa-dubai`, `/guides/spouse-dependent-visa-dubai`

**Behavior:**
- Tab bar starts at its natural position in the document (below the page h1 and category header)
- On scroll, once the tab bar reaches the top of the viewport (minus nav header height), it becomes sticky
- Tab bar remains sticky for the entire remaining scroll length of the page
- On tab tap: active tab switches to navy background/white text; inactive tab switches to stone-100/navy text
- Tab switch triggers instant client-side state change (`useState` in `GuideTabs.tsx`) — no network request
- URL updates after tab switch via `router.replace(?route=outside, { scroll: false })` — already implemented
- Scroll position does not change on tab switch

**CSS for sticky behavior:**
```css
.tab-bar {
  position: sticky;
  top: 56px; /* height of public Header */
  z-index: 10;
  background: white;
  box-shadow: 0 1px 0 0 theme('colors.stone.200');
}
```
The `56px` offset assumes the current Header height. If the Header height changes, this value must be updated.

**Tab bar dimensions:**
- Container: full viewport width, 48px height
- Each tab: 50% width, 48px height, centered text
- Active tab: `background: var(--color-navy); color: white;`
- Inactive tab: `background: stone-100; color: var(--color-navy);`
- Hover state (desktop): inactive tab background changes to stone-200
- No border radius on tab bar — it is a full-width element

**What NOT to do:**
- Do NOT use `position: fixed` — removes element from document flow, causes layout shift
- Do NOT collapse tabs to a dropdown select on mobile — the visual tab bar communicates the choice
- Do NOT animate the background color change on tab switch — instant only
- Do NOT add a third tab without redesigning this component (2-tab assumption is structural)

**Scroll behavior:**
- When a user scrolls UP past the tab bar's natural position, the tab bar un-sticks and returns to its document position
- This is default browser sticky behavior — no custom JS needed

---

## Pattern 2 — Quick Decision Card Tap

**Used on:** Homepage (Section 2), Hub pages (Section B)

**Behavior:**
- Each card is a full-area anchor (`<a>` wrapping the entire card content)
- Tap anywhere on the card navigates to the destination href
- No animation on tap
- No modal preview on tap
- Full page navigation only

**Visual feedback:**
- Default state: stone-50 background, 1px stone-200 border, no shadow
- Hover state (desktop): `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` — subtle lift
- Active/pressed state (mobile): `background: stone-100` — immediate visual feedback on touch
- Transition: `transition: box-shadow 150ms ease, background-color 100ms ease`

**Touch target:**
- Card height: minimum 72px (to comfortably exceed the 44px minimum)
- Card width: full column width in the 2-col grid
- No padding reduction on mobile — maintain 16px internal padding

**What NOT to do:**
- Do NOT use `onClick` with `router.push` — use plain `<a href>` for full-area tap
- Do NOT add a chevron icon that is a separate touch target — the whole card is the target
- Do NOT show a tooltip on hover — card label must be self-explanatory at 5 words

**Grid behavior:**
- Mobile (375px): 2-column grid, `grid-template-columns: repeat(2, 1fr)`, 8px gap
- Tablet (768px+): 3-column grid
- Desktop (1024px+): 3-column grid

---

## Pattern 3 — Route Snapshot Block

**Used on:** Individual guide pages, group guide pages (per active tab), hub pages

**Behavior:**
- This block is fully static — no JavaScript interaction
- It renders server-side as part of the page HTML
- "See full steps below ↓" is an in-page anchor link pointing to the steps section: `href="#steps"`
- Steps section must have `id="steps"` on the containing element

**Scroll behavior for anchor link:**
- Use CSS `scroll-behavior: smooth` on the `html` element — already a standard declaration
- Do NOT use `window.scrollTo()` or `scrollIntoView()` — the CSS smooth scroll handles it
- On mobile, the sticky tab bar must be accounted for: use `scroll-margin-top: [tab-bar-height]px` on the `#steps` element so the steps section does not scroll under the sticky bar

```css
#steps {
  scroll-margin-top: 104px; /* 56px nav + 48px tab bar */
}
```

**Block dimensions:**
- Padding: 16px all sides
- Border: 1px stone-200
- Border radius: 8px
- Background: stone-50

**Price/timeline row:**
- 2-column CSS grid: `grid-template-columns: 1fr 1fr`
- Price cell: label in stone-500 (12px), value in navy `font-semibold` (16px)
- Timeline cell: same
- 12px gap between label and value within each cell
- This 2-column row works at 375px — no wrapping needed

**Step titles list:**
- `<ul>` with no bullets (`list-style: none`)
- Custom bullet: a 4px solid navy circle rendered via `::before` pseudo-element
- Text: stone-700, 14px
- Line height: 1.5
- 4px gap between items
- Maximum 4 items — do NOT render more than 4 step titles here

**Audience note:**
- Stone-500, 13px, italic
- Single line. Truncate with CSS `text-overflow: ellipsis` if needed.

**What NOT to do:**
- Do NOT make this block collapsible/expandable — it is always visible
- Do NOT add a "hide" or "compact" toggle — deep readers scroll past it; the block is short enough not to be an obstacle
- Do NOT render per-step costs here — only the guide-level total cost (`guide.price`)

---

## Pattern 4 — Calculator Question Flow (Mobile)

**Used on:** `/find-my-visa`

**Behavior:**
- One question visible at a time
- User taps an option button → immediate state change to next question
- No "Submit" or "Next" button — tapping an option IS the submit action
- Back navigation: a `←` back link above the question returns to the previous question
- Progress indicator: `Question X of Y` text in stone-500 above each question
- Result card appears in place of the question after the final answer

**Question card layout:**
- Question text: h2 or equivalent prominence, navy, 18px, 600 weight
- Option buttons: full-width, stacked, 1 per line
- Option button height: 52px minimum
- Option button style: white background, 1px stone-200 border, navy text, 14px
- Hover state (desktop): stone-50 background
- Active/selected state: navy background, white text

**Transition between questions:**
- No slide animation
- No fade animation
- Instant render of next question — React state update only
- Reason: animations on touch devices cause perceived lag and jank. The instant transition feels faster.

**Back navigation:**
- Positioned above the question text
- Label: `← Back`
- Tap returns to previous question by decrementing the answer stack
- On the first question, back link is hidden (nothing to go back to)
- Do NOT use browser `history.back()` — that would leave the `/find-my-visa` page. Use internal state.

**Progress indicator:**
- `Question 2 of 3` — renders above question text
- Stone-500, 13px, no bold
- Updates with each answer

**Result card layout (mobile):**
- Same width as the question card
- Title: `h2` (guide title), 18px navy
- Key facts: 3 bullet points, stone-700, 14px
- Cost: "Estimated cost: AED X – Y" — navy, 16px, 600 weight
- Timeline: "Estimated time: Z weeks" — navy, 16px, 600 weight
- Primary CTA button: `View Full Step-by-Step Guide →` — full-width, navy background
- Secondary link: `Contact Us` — centered below button, brass text

**What NOT to do:**
- Do NOT use a progress bar with animation (adds complexity, serves no real purpose)
- Do NOT slide questions in from the side (animation-induced jank on mobile)
- Do NOT require a "Submit" button after selecting an option — selection IS the action
- Do NOT show more than one question at a time

---

## Pattern 5 — Guide List Category Filter

**Used on:** `/guides` page (Phase 5)

**Behavior:**
- Filter buttons rendered above the guide card grid
- Tapping a category button filters the visible cards by that category
- "All" button resets the filter (default state)
- URL updates with `?category=visas` on filter change — bookmarkable, shareable
- Filter state is read from URL `searchParams` on the server: the server renders only the matching cards in the initial HTML
- IMPORTANT: All guide cards must be present in the initial HTML — even if visually hidden by the filter. This is SEO Rule 4.
  - Implementation: render ALL cards; add `data-category="visas"` attribute to each card; use CSS class toggling via JavaScript to show/hide
  - If JavaScript is disabled: all cards remain visible (no hidden content penalty)

**Filter button style:**
- Default: stone-100 background, stone-700 text, 1px stone-200 border
- Active: navy background, white text, no border
- Height: 36px
- Border radius: 18px (pill shape)
- Font size: 14px

**Filter row layout:**
- Mobile: horizontal scroll row (`overflow-x: auto; white-space: nowrap`)
- Desktop: flex row, wrapped if needed
- 8px gap between buttons
- On mobile, leftmost button is at left edge of page (no indent) — allows scrolling to see all options

**Scroll behavior on filter tap:**
- Do NOT scroll to top of guide list on filter change
- Do NOT scroll at all — use `{ scroll: false }` in `router.replace`
- Cards that hide/show do so in place

**What NOT to do:**
- Do NOT use JavaScript to inject filtered cards that are not in the initial HTML
- Do NOT hide cards by removing them from the DOM (they must stay in HTML for SEO)
- Do NOT use a select dropdown for the filter on desktop — pill buttons are more scannable

---

## Pattern 6 — Mobile Navigation (Header)

**Current behavior:** Public Header with site name + nav links

**Required additions as content grows:**
- When guide count exceeds 10: add a "Guides" nav link pointing to `/guides`
- When hub pages exist: add a "Visas" nav link pointing to `/visas`
- When calculator exists: add "Find My Route" nav link pointing to `/find-my-visa`

**Mobile hamburger behavior (when nav links are added):**
- Tapping hamburger: nav slides down from header (not a full-screen overlay)
- Nav items: full-width, 52px height, stone-50 background, navy text
- Tap on nav item: navigates and closes menu
- Tap outside menu: closes menu
- No animation — instant expand/collapse (same reasoning as question flow: animations feel slower on mobile)

**What NOT to do:**
- Do NOT add a hamburger menu until there are 3+ nav links to justify it
- Do NOT use a full-screen dark overlay menu (premium sites don't use this pattern; it obscures content)
- Do NOT put search in the mobile header (no search functionality built yet)

---

## Pattern 7 — CTA Card (Consistent Across All Pages)

**Used on:** Bottom of guide pages, bottom of homepage, bottom of hub pages

**This is a shared component (`CtaCard.tsx`) used everywhere. The visual treatment must be identical across all usages.**

**Visual spec:**
- Background: `var(--color-navy)` (#1B2E4B)
- Text color: white
- Heading: 20px, 600 weight, white
- Body: 14px, white, opacity 0.85
- Primary button: `var(--color-brass)` background, white text, no border, 48px height
- Border radius of card: 8px
- Padding: 24px all sides

**Mobile behavior:**
- Full-width card
- Heading: max 2 lines
- Primary button: full-width, 48px height
- Body text: max 3 lines — keep it short in props

**Placement rules:**
- Always the last section before the footer on any page
- Never floated or sticky — it is a block element at end of content
- Never appears mid-article (between steps)

**What NOT to do:**
- Do NOT use different visual treatments on different pages — the navy card is the single consistent CTA pattern
- Do NOT add a WhatsApp floating button that overlaps page content (add a WhatsApp link inside the CTA card instead when ready)
- Do NOT add more than one primary CTA button in this card

---

## Pattern 8 — Step Cards (Existing Pattern — Do Not Break)

**Reference:** `components/StepCard.tsx`

**Current behavior:**
- Navy step number bubble
- Step title as h3
- what, where, address, cost, time fields rendered in plain text
- Navy advice block (when advice is present)
- Red warning block (when warning is present)

**Do NOT change:**
- Step card visual design
- Collapsed/hidden step behavior (there is none — all content is visible — keep it that way)
- Mobile layout of step cards (they already stack correctly)

**Required addition:** Add `id="steps"` to the step list container so the Route Snapshot Block's anchor link works.

In `app/(public)/guides/[slug]/page.tsx` and `components/GuideTabs.tsx`, find the element that wraps the step list and add:
```tsx
<section id="steps" ...>
  {steps.map(...)}
</section>
```

---

## Pattern 9 — Trust Bar (Slim Accuracy Signal)

**Used on:** Homepage (Section 7), Hub pages (Section H), optionally guide page footer

**Behavior:** Static. No interaction.

**Visual spec:**
- Stone-100 background OR plain white with stone-200 top border
- Text: stone-500, 13px, centered
- Two lines: accuracy claim + last-updated date
- No icons (keeps it minimal)
- Height: 40px total

**Mobile behavior:** Same as desktop. Centered text. Full width.

**What NOT to do:**
- Do NOT use colored backgrounds (green "verified" badges look marketing-y)
- Do NOT use star ratings or badge shapes
- Do NOT show a `last_updated` date that is more than 12 months old — if the date is stale, update the guide, not the display

---

## Pattern 10 — RouteSnapshot Band on Homepage

**Used on:** Homepage (Section 3)

**Behavior:**
- Server-rendered. No client interaction.
- Each card: plain `<a>` block-level element
- Tap navigates to guide page

**Layout at 375px (mobile):**
- 1-column stack
- Each card: full width, 1px stone-200 border, 8px border radius, 16px padding
- Price/timeline row: 2-column CSS grid inside each card
  - Left cell: "Est. cost" label (12px stone-500) + AED value (16px navy bold)
  - Right cell: "Est. time" label (12px stone-500) + weeks value (16px navy bold)
- Audience note: 13px stone-600, 1 line, below price/timeline row
- "Full guide →" link: brass, 14px, right-aligned, 44px minimum tap height
- Gap between cards: 12px

**Layout at 1024px (desktop):**
- 2-column grid, 2 rows (for 4 cards)
- Cards: same internal layout
- No change to card internals on desktop

**Data source:**
- `lib/db/reader.ts` — fetched by slug array in `app/(public)/page.tsx`
- If a slug is not published, the card is omitted (no empty card, no "coming soon" placeholder)

**What NOT to do:**
- Do NOT add a "Compare" checkbox to these cards
- Do NOT add step previews to these cards (step previews go on the guide page in the Route Snapshot Block)
- Do NOT hardcode fees — all fee data comes from `guide.price` in the DB

---

## Touch Sizing Reference

All interactive elements must pass this minimum spec:

| Element | Min height | Min width | Notes |
|---|---|---|---|
| Primary CTA button | 48px | 100% (mobile) | Full-width on mobile |
| Secondary text link | 44px line-height or padding | Intrinsic | Add padding-top/bottom if needed |
| Tab bar button | 48px | 50% | Inherits from tab bar height |
| Quick Decision Card | 72px | Full column | Entire card is tappable |
| Filter pill button | 36px | Auto | Pills are short but wide enough |
| Step card (no interaction) | n/a | n/a | Not interactive |
| Back link in calculator | 44px | 44px | Add padding if text is short |
| Calculator option button | 52px | 100% | Full-width |

---

## Viewport Breakpoints Reference

| Name | Width | Description |
|---|---|---|
| mobile | 375px | iPhone SE / small Android — design target |
| mobile-lg | 430px | iPhone 14 / large mobile |
| tablet | 768px | iPad portrait |
| desktop | 1024px | Laptop and desktop |
| desktop-lg | 1280px | Wide desktop |

Tailwind classes used:
- `sm:` = 640px (not a primary breakpoint for this project)
- `md:` = 768px
- `lg:` = 1024px
- `xl:` = 1280px

Primary design is at 375px. Tablet and desktop are progressive enhancements.

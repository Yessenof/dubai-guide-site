# Homepage Restructure Plan

Version: 1.0 — April 2026
Status: Planning. No implementation yet.
Current homepage: Hero + value cards + guide list preview

---

## Goals

1. Work for both paid ad traffic (fast entry, immediate clarity) and organic search (structure, trust, depth)
2. Feel premium and minimal — not busy, not salesy
3. Guide users to the right hub or guide within 2 scrolls
4. Not copy competitor visual patterns — our own system

---

## Current Homepage Problems

- Hero is brand-statement focused, not task-entry focused
- No visible topic grouping (users don't know what categories exist)
- Guide list preview shows everything without organization
- No quick decision / "what do I need?" entry
- No trust signals
- No conversion action until the bottom CTA in each guide

---

## Target Audience by Traffic Source

| Source | User state | What they need first |
|---|---|---|
| Paid ad (Meta / Google) | High intent, specific situation | Fast route to relevant guide or calculator |
| Organic search (guide slug) | Lands on guide page directly | Already past homepage — not affected |
| Organic search (homepage) | Exploring what site covers | Topic overview + guide list |
| Direct / referral | Returning or referred | Quick access to topic area |

---

## New Homepage Section Order

### Section 1: Hero

**Purpose:** First impression + primary CTA for paid traffic

**Content:**
- `h1`: One clear, direct line — not a tagline
  - Option A: "Dubai Visas and Procedures — Step by Step"
  - Option B: "How to Handle Any Dubai Procedure — Free Guides"
  - Avoid: clever wordplay, vague promises, superlatives
- Subheadline: 1 sentence — what the site is
  - "Step-by-step guides to visas, company setup, and relocation in Dubai. Costs, timelines, and official process — in plain English."
- Primary CTA button: "Find My Route" → links to `/find-my-visa` (or `/visas` until calculator is built)
- Secondary CTA: "Browse All Guides" → `/guides`
- Visual: None. Clean white + navy/brass tokens. No illustration, no photo.

**Mobile:** Both CTAs stack. Subheadline truncates to 2 lines max.

---

### Section 2: Quick Decision Cards ("I need to...")

**Purpose:** Speed + clarity for paid ad traffic and decisive users

**Content:**
- 4–6 cards. Each represents one of the most searched intents.
- Each card:
  - Short action label: "Sponsor my spouse", "Get a Golden Visa", "Set up a company", "Bring my child to Dubai"
  - One small icon (CategoryIcon or new extended icon)
  - One-tap destination → relevant hub or group guide
- Layout: 2-column grid on mobile, 3-column on desktop
- No fees or timelines here — just navigation

**Example cards:**
1. Sponsor my spouse → `/visas/family` or `/guides/spouse-dependent-visa-dubai`
2. Bring my child to Dubai → `/guides/child-dependent-visa-dubai`
3. Get a Golden Visa → `/visas/golden`
4. Get an employment visa → `/guides/employment-visa`
5. Set up a company → `/company` (placeholder until built)
6. Find the right route → `/find-my-visa`

**Rule:** Only show cards that have real content behind them. If hub or guide doesn't exist, skip the card.

---

### Section 3: Service Hubs Grid

**Purpose:** Topic cluster entry for organic and returning users

**Content:**
- 4–6 hub tiles, one per major topic
- Each tile:
  - Topic name (e.g., "Visas")
  - 2-line description
  - Guide count (e.g., "8 guides")
  - Arrow link

**Layout:** Stone-50 card surface (consistent with TopicCard). 2-column on mobile, 3 on desktop.

**Rule:** Guide count is pulled from DB — not hardcoded. If a topic has no published guides, hide its hub tile.

---

### Section 4: Featured Guides

**Purpose:** Showcase depth, support SEO internal linking, help returning users navigate

**Content:**
- 3–4 guide cards (TopicCard component — unchanged)
- Selection logic: newest published guides OR manually curated by owner
- No special visual treatment — same TopicCard as `/guides` page
- "See all guides →" link below

---

### Section 5: How It Works (Trust Layer)

**Purpose:** Reduce bounce rate, explain the site's value proposition in 3 lines

**Content:**
3 short items (icon + label + 1-line description):
1. "Real process, real costs" — Government fees and timelines from official sources
2. "Step-by-step" — Every guide breaks the process into clear, actionable steps
3. "Always free" — No paywalls, no sales pitches, no hidden upsells

**Layout:** 3-column row on desktop, 1-column stack on mobile. No graphics — text only.

---

### Section 6: Trust Signals

**Purpose:** Authority and freshness signals for SEO and first-time visitors

**Content:**
- "All fees verified against official UAE government sources"
- "Last updated: [most recent guide last_updated date pulled from DB]"
- Option (future): "Featured in [media name]" — only if real media coverage earned
- Do NOT use fake trust badges ("5-star service", "trusted by X users")

**Visual:** Simple gray text line or small badge. No visual noise.

---

### Section 7: Persistent Bottom CTA

**Purpose:** Conversion for users who scrolled everything but didn't click

**Content:**
- Same navy CTA card used at the bottom of individual guides
- Text: "Not sure where to start? We can help."
- CTA: "Contact Us" or "Find My Route" (consistent with Section 1)

---

## What To Remove / Not Add

| Element | Decision | Reason |
|---|---|---|
| Stock photos | Remove / never add | Premium minimalist direction; photos add visual noise |
| Testimonials section | Skip for now | Not authentic without real user data |
| "As seen in" logos | Skip until earned | Do not fabricate trust signals |
| Blog preview | Skip for now | No blog exists yet |
| Countdown / urgency timers | Never | Dishonest; harms premium positioning |
| Chat widget (3rd party) | Skip | External dependency; slows page; WhatsApp link is sufficient |
| Cookie banner | Required only when analytics added | Not needed yet |

---

## Mobile Priorities

- Hero: Full-width, CTA button full-width, subheadline max 2 lines
- Quick Decision Cards: 2-column grid (3 per row is too small on mobile)
- Service Hubs: 1-column on mobile, 2 on tablet, 3 on desktop
- No horizontal scroll anywhere
- Featured guides: 1-column stack on mobile

---

## What Can Launch in Phase 1 (Before Calculator Exists)

Section 1: Hero — CTA goes to `/visas` or `/guides` until calculator is built
Section 2: Quick Decision Cards — all cards link to existing published guides/hubs
Section 4: Featured Guides — same TopicCard components already exist
Section 5: How It Works — static copy, no dependencies
Section 7: Bottom CTA — already exists, just move to homepage

Sections 3 (Service Hubs) and 6 (Trust Signals) can be added in Phase 2 when hub pages exist.

---

## Implementation Notes

- Homepage is currently `app/(public)/page.tsx` (server component)
- Existing `Hero.tsx` component handles Section 1 — refactor it, don't replace
- `TopicCard.tsx` already handles Section 4 — reuse unchanged
- New components needed: `QuickDecisionCards`, `HubsGrid`, `HowItWorks`, `TrustBar`
- All data from DB via `lib/db/reader.ts` — no new queries needed except guide count by category
- No schema change needed

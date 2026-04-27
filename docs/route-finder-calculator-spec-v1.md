# Route Finder / Calculator — Spec v1

Version: 2.0 — April 2026 (updated from v1.0; 14 guides now live)
Status: Design spec only. Implementation ready.
Phase: Phase 7 per implementation-roadmap-master.md

---

## Purpose

The route finder answers three user questions in sequence:
1. **Which route applies to me?** → route resolution
2. **How much will it cost?** → fee estimate from published guide data
3. **How long will it take?** → timeline from published guide data

It is a personalized guide selector + cost/timeline estimator backed by published, verified fee data.
It is NOT a price calculator in the commercial sense.
It is NOT a replacement for the guides — it is a fast entry point into the right guide.

---

## Competitive Context

FamilyVisa.ae has a working calculator. Their advantage is route resolution and location-based branching. Their weakness is hidden fees (they sell services; we publish fees). Our calculator must match their UX efficiency and exceed their transparency.

**Three product decisions this drives:**
1. Questions frame from the user's world ("my spouse / my child") not from visa taxonomy
2. Location (inside/outside UAE) is the critical branch — ask it early
3. Result card leads with cost + timeline before the guide title

---

## Design Principle: Config-First

The route finder is NOT hardcoded page spaghetti.

All routes, questions, branching logic, fees, and timelines are defined in a single config file:
`lib/route-finder-config.ts`

- Adding a new guide route = editing the config, not the component
- Updating a fee = editing the config, not touching the UI
- The component is a generic renderer of the config tree
- The config is the business logic

---

## Entry Points

The calculator is reachable from:
1. `/find-my-visa` — primary standalone URL, added to Header nav when built
2. Hub pages — "Find My Route" CTA button on `/visas`, `/visas/family`, `/visas/golden`, `/company-setup`
3. Homepage — optional "Find My Route" button in the Hero or PrimaryServices section
4. Guide page — optional "Not sure if this is the right route for you?" link

---

## Mobile Interaction Principles (from interaction-patterns-mobile-first.md Pattern 4)

- One question visible at a time
- Tapping an option IS the submit — no separate Next/Submit button
- Back navigation: `← Back` link above the question
- Progress indicator: `Question X of Y` in stone-500, 13px, above question text
- No slide or fade animations — instant React state update
- Option buttons: full-width, 52px minimum height, stacked
- Result card replaces the question in place — same viewport area

---

## Question Flow — Full Tree

### Q1: What do you need help with?

**User-facing text:** "What are you trying to do?"

| Option | Value | Next |
|---|---|---|
| Get a visa for my spouse or child | `family-new` | Q2-family-type |
| Renew a family visa | `family-renew` | → resolve: `renew-family-visa-dubai` |
| Register a newborn | `newborn` | → resolve: `newborn-visa-dubai` |
| Get an employment visa | `employment` | Q2-employment-location |
| Get a Golden Visa | `golden` | Q2-golden-basis |
| Set up a company | `company` | Q2-company-type |
| Something else | `other` | → resolve: advisor |

**Why "renew" branches immediately:** Renewal route is the same for both spouse and child. No need to ask who — the guide covers both. This saves one question.

**Why "newborn" is separate from "family-new":** The newborn process is completely different (birth cert + DHA + Amer vs. entry permit route). Putting it under a family branch would require an extra question to separate it. Separate Q1 option resolves it immediately.

---

### Q2-family-type: Who is this for?

**User-facing text:** "Who are you applying for?"

Shown when Q1 = `family-new`

| Option | Value | Next |
|---|---|---|
| My spouse | `spouse` | Q3-location (context: spouse) |
| My child | `child` | Q3-location (context: child) |

---

### Q3-location: Where are they now?

**User-facing text:** "Where is your [spouse / child] right now?"

Shown after Q2-family-type

| Option | Value | Next |
|---|---|---|
| Outside the UAE | `outside` | → resolve: `spouse-dependent-visa-dubai-outside-country` OR `child-dependent-visa-dubai-outside-country` |
| Inside the UAE | `inside` | → resolve: `spouse-dependent-visa-dubai-inside-country` OR `child-dependent-visa-dubai-inside-country` |

**Resolution uses the Q2 context (spouse vs. child) to pick the correct slug.**

---

### Q2-employment-location: Where are you now?

**User-facing text:** "Where are you currently based?"

Shown when Q1 = `employment`

| Option | Value | Next |
|---|---|---|
| I'm in the UAE | `inside` | → resolve: `employment-visa` |
| I'm outside the UAE | `outside` | → resolve: advisor-employment-outside |

---

### Q2-golden-basis: What is your basis for the Golden Visa?

**User-facing text:** "What is the basis for your Golden Visa?"

Shown when Q1 = `golden`

| Option | Value | Next |
|---|---|---|
| I own property in Dubai worth AED 2M or more | `property` | → resolve: `golden-visa-dubai-property` |
| I'm a professional, executive, or investor | `professional` | → resolve: hub-golden + advisor |
| I'm not sure | `unsure` | → resolve: hub-golden |

---

### Q2-company-type: What type of company?

**User-facing text:** "What type of company are you setting up?"

Shown when Q1 = `company`

| Option | Value | Next |
|---|---|---|
| Mainland company (trade freely across UAE) | `mainland` | → resolve: `mainland-company-setup-dubai` |
| Free zone company (specific zone, simplified setup) | `freezone` | → resolve: `free-zone-company-setup-dubai` |
| I need to open a business bank account | `bankaccount` | → resolve: `open-business-bank-account-dubai` |
| I'm not sure which type | `unsure` | → resolve: hub-company |

---

## Route Resolutions — Complete Map

### resolve: `spouse-dependent-visa-dubai-outside-country`

```typescript
{
  type: 'guide',
  guideSlug: 'spouse-dependent-visa-dubai-outside-country',
  keyFacts: [
    'Your spouse applies from outside the UAE',
    'Marriage certificate must be attested before starting',
    'Sponsor submits entry permit application first'
  ],
  supportingServices: ['document-attestation-dubai'],
  supportingNote: 'Marriage certificate attestation is required before this process — see our attestation guide.'
}
```

### resolve: `spouse-dependent-visa-dubai-inside-country`

```typescript
{
  type: 'guide',
  guideSlug: 'spouse-dependent-visa-dubai-inside-country',
  keyFacts: [
    'Your spouse is already in the UAE on a visit or other visa',
    'No entry permit — status is changed in-country',
    'Medical test required; Amer handles submission'
  ],
  supportingServices: ['amer-center-dubai']
}
```

### resolve: `child-dependent-visa-dubai-outside-country`

```typescript
{
  type: 'guide',
  guideSlug: 'child-dependent-visa-dubai-outside-country',
  keyFacts: [
    'Your child applies from outside the UAE',
    'Birth certificate must be attested before starting',
    'Sponsor submits entry permit application first'
  ],
  supportingServices: ['document-attestation-dubai'],
  supportingNote: 'Birth certificate attestation is required before this process — see our attestation guide.'
}
```

### resolve: `child-dependent-visa-dubai-inside-country`

```typescript
{
  type: 'guide',
  guideSlug: 'child-dependent-visa-dubai-inside-country',
  keyFacts: [
    'Your child is already in the UAE',
    'No entry permit — status is changed in-country',
    'Amer handles submission'
  ],
  supportingServices: ['amer-center-dubai']
}
```

### resolve: `renew-family-visa-dubai`

```typescript
{
  type: 'guide',
  guideSlug: 'renew-family-visa-dubai',
  keyFacts: [
    'Covers both spouse and child renewals',
    'Adults 18+ need a medical fitness test first',
    'Children under 18 are exempt from the medical test'
  ],
  supportingServices: ['amer-center-dubai']
}
```

### resolve: `newborn-visa-dubai`

```typescript
{
  type: 'guide',
  guideSlug: 'newborn-visa-dubai',
  keyFacts: [
    'For children born in the UAE',
    'Covers birth certificate, DHA registration, and residence visa',
    'Submit before the child is 120 days old to avoid overstay fees'
  ],
  supportingServices: []
}
```

### resolve: `employment-visa`

```typescript
{
  type: 'guide',
  guideSlug: 'employment-visa',
  keyFacts: [
    'You are already in the UAE on any visa status',
    'Your Dubai mainland employer handles Tasheel and Amer steps',
    'No UAE departure required'
  ],
  supportingServices: []
}
```

### resolve: advisor-employment-outside

```typescript
{
  type: 'advisor',
  heading: 'Employment Visa (Outside UAE) — Guide Coming Soon',
  body: 'This route is for employees joining a Dubai employer from outside the UAE. A detailed guide is in progress. For now, contact us and we will walk you through the process.',
  whatsapp: true
}
```

### resolve: `golden-visa-dubai-property`

```typescript
{
  type: 'guide',
  guideSlug: 'golden-visa-dubai-property',
  keyFacts: [
    'Property must be valued at AED 2M or above',
    'Both ready and off-plan properties may qualify',
    'DLD title deed or Oqood is the primary document'
  ],
  supportingServices: []
}
```

### resolve: hub-golden

```typescript
{
  type: 'hub',
  hubUrl: '/visas/golden',
  heading: 'Golden Visa Routes',
  body: 'Several Golden Visa routes exist — property, professional, company owner, and bank deposit. The property route guide is live. For other routes, contact us for a personalised assessment.',
  whatsapp: true
}
```

### resolve: `mainland-company-setup-dubai`

```typescript
{
  type: 'guide',
  guideSlug: 'mainland-company-setup-dubai',
  keyFacts: [
    'Mainland companies can trade freely across all UAE',
    'Licensed by Dubai DED',
    'Requires a local service agent or Emirati partner for some activities'
  ],
  supportingServices: ['pro-services-dubai']
}
```

### resolve: `free-zone-company-setup-dubai`

```typescript
{
  type: 'guide',
  guideSlug: 'free-zone-company-setup-dubai',
  keyFacts: [
    '100% foreign ownership in most free zones',
    'Activity is restricted to the free zone or international trade',
    'Each free zone has its own authority and fee structure'
  ],
  supportingServices: ['pro-services-dubai']
}
```

### resolve: `open-business-bank-account-dubai`

```typescript
{
  type: 'guide',
  guideSlug: 'open-business-bank-account-dubai',
  keyFacts: [
    'Requires an active trade license before applying',
    'Document requirements vary by bank',
    'UAE banks perform KYC — timeline 2–6 weeks'
  ],
  supportingServices: []
}
```

### resolve: hub-company

```typescript
{
  type: 'hub',
  hubUrl: '/company-setup',
  heading: 'Company Setup in Dubai',
  body: 'Three routes are covered: mainland company, free zone company, and business bank account. See the full comparison on our company setup page.',
  whatsapp: false
}
```

### resolve: advisor (catch-all)

```typescript
{
  type: 'advisor',
  heading: 'This Route Needs Expert Review',
  body: 'Your situation has details that go beyond what our current guides cover. Contact us on WhatsApp and we will help you find the right route.',
  whatsapp: true
}
```

---

## Result Card Structure

**For type: 'guide'**

```
┌─────────────────────────────────────┐
│  Your Route                          │
│  [Guide Title]                       │
│                                      │
│  Estimated cost:  [guide.price]      │
│  Estimated time:  [guide.timeline]   │
│                                      │
│  Key facts:                          │
│  • [keyFact 1]                       │
│  • [keyFact 2]                       │
│  • [keyFact 3]                       │
│                                      │
│  [View Full Step-by-Step Guide →]   │  ← primary CTA, navy bg
│  [Talk to an expert →]              │  ← secondary, brass text
│                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  You may also need:                  │
│  → Document Attestation Guide       │  ← only if supportingServices populated
└─────────────────────────────────────┘
```

**For type: 'advisor'**

```
┌─────────────────────────────────────┐
│  [heading]                           │
│                                      │
│  [body text — 2 sentences max]       │
│                                      │
│  [Contact us on WhatsApp →]         │  ← primary CTA, navy bg
└─────────────────────────────────────┘
```

**For type: 'hub'**

```
┌─────────────────────────────────────┐
│  [heading]                           │
│                                      │
│  [body text — 2 sentences max]       │
│                                      │
│  [See All Routes →]                 │  ← links to hubUrl
│  [Talk to an expert →]              │  ← if whatsapp: true
└─────────────────────────────────────┘
```

---

## Supporting Service Injection Logic

When a resolution includes `supportingServices`, the result card shows a slim section below the primary CTA:

- Header: "You may also need:"
- Each service: `→ [service guide title]` as a plain link
- Maximum 1 supporting service per result in v1 (don't inject 2+ — result becomes cluttered)
- Only inject when the supporting service is genuinely required for the route (attestation for outside-country) or highly relevant (Amer for inside-country)
- PRO services injection is appropriate for company setup routes

These are content links — not ads. No upsell framing.

---

## CTA Logic

| State | Primary CTA | Secondary CTA |
|---|---|---|
| Guide resolved | "View Full Step-by-Step Guide →" → `/guides/[slug]` | "Talk to an expert →" → WhatsApp |
| Advisor (no guide) | "Contact us on WhatsApp →" → WhatsApp | — |
| Hub resolved | "See All Routes →" → hub URL | "Talk to an expert →" → WhatsApp (if whatsapp: true) |

WhatsApp number: `971506304817` (same as rest of site — wa.me/971506304817)

---

## Excluded Routes (v1) — Explicit

These routes must NOT be added to the config until a published guide exists and fees are verified.

| Route | Excluded because |
|---|---|
| Employment Visa (outside UAE) | No guide published. Priority 1 next content. Resolve to `advisor-employment-outside` until live. |
| Parent Visa | No guide. Higher sponsor income requirements — unverified. → `advisor` |
| Golden Visa (professional / salary AED 30K+) | AED 30K threshold unverified from ICA official. → `hub-golden` |
| Golden Visa (company owner) | Capital + audit requirements unverified. → `hub-golden` |
| Golden Visa (bank deposit) | Deposit type + eligible accounts unverified. → `hub-golden` |
| Investor Visa (AED 750K property) | Potentially discontinued. Unverified. → `hub-golden` |
| Retirement Visa (AED 1M, age 55+) | Age + threshold unverified from ICA. → `hub-golden` |
| Maid / Domestic Worker Visa | AED 25K household income threshold unverified. No guide. → `advisor` |
| Child / Spouse Renewal (separate) | Currently merged into `renew-family-visa-dubai`. Single resolution is correct. |

When a guide is published and fees are verified: add a resolution entry to the config and add the option to the appropriate Q2. Do not change Q1.

---

## Fee Data Source

All cost and timeline data in the result card comes from:
- `guide.price` → displayed as "Estimated cost"
- `guide.timeline` → displayed as "Estimated time"

No separate fee database. No hardcoded numbers in the config.
The config references guide slugs — the renderer fetches live guide data from the DB at render time.

If a slug is not published (should not happen in v1 since all resolutions point to published guides), show:
"Guide details coming soon — contact us for current fees."

---

## Architecture Rules (Non-Negotiable)

- `lib/route-finder-config.ts` is **server-only** — never exposed as a public REST endpoint
- No `/api/route-finder` endpoint — resolution logic stays server-side
- The page at `/find-my-visa` uses **client-side React state** for question progression (no page reload per question)
- Fee data is fetched **server-side at page load** for all possible resolution slugs — loaded into the client component as a prop map, not fetched on demand
- This keeps fees out of the public API surface while allowing instant result display
- The component is a generic renderer — all product logic is in the config file

**Why pre-fetch all guide data at page load:**
There are at most ~10 possible guide resolutions in v1. Fetching all of them on the server at `page.tsx` load is cheap (single SQLite query). This avoids any client-side data fetching and keeps fees server-controlled.

```typescript
// app/(public)/find-my-visa/page.tsx (not built yet — spec)

// On the server:
const guideData = await getGuidesBySlug([
  'spouse-dependent-visa-dubai-outside-country',
  'spouse-dependent-visa-dubai-inside-country',
  'child-dependent-visa-dubai-outside-country',
  'child-dependent-visa-dubai-inside-country',
  'renew-family-visa-dubai',
  'newborn-visa-dubai',
  'employment-visa',
  'golden-visa-dubai-property',
  'mainland-company-setup-dubai',
  'free-zone-company-setup-dubai',
  'open-business-bank-account-dubai',
]);

// Pass as prop to client component:
<RouteFinderFlow config={ROUTE_FINDER_CONFIG} guideData={guideData} />
```

---

## Config Structure (Implementation-Ready Draft)

```typescript
// lib/route-finder-config.ts

export type ResolutionType = 'guide' | 'hub' | 'advisor';

export interface GuideResolution {
  type: 'guide';
  guideSlug: string;
  keyFacts: string[];
  supportingServices: string[]; // guide slugs for supporting service links
  supportingNote?: string;
}

export interface HubResolution {
  type: 'hub';
  hubUrl: string;
  heading: string;
  body: string;
  whatsapp: boolean;
}

export interface AdvisorResolution {
  type: 'advisor';
  heading: string;
  body: string;
  whatsapp: boolean;
}

export type Resolution = GuideResolution | HubResolution | AdvisorResolution;

export interface QuestionOption {
  value: string;
  label: string;
  next: string; // question id OR resolution id
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  contextParam?: string; // if set, carry this answer forward as context for later branching
}

export const ROUTE_FINDER_CONFIG = {
  startQuestion: 'q1',
  questions: {
    'q1': {
      id: 'q1',
      text: 'What are you trying to do?',
      options: [
        { value: 'family-new',    label: 'Get a visa for my spouse or child', next: 'q2-family-type' },
        { value: 'family-renew',  label: 'Renew a family visa',               next: 'r-renew' },
        { value: 'newborn',       label: 'Register a newborn',                next: 'r-newborn' },
        { value: 'employment',    label: 'Get an employment visa',             next: 'q2-emp-loc' },
        { value: 'golden',        label: 'Get a Golden Visa',                  next: 'q2-golden' },
        { value: 'company',       label: 'Set up a company',                   next: 'q2-company' },
        { value: 'other',         label: "I'm not sure / something else",      next: 'r-advisor' },
      ]
    },
    'q2-family-type': {
      id: 'q2-family-type',
      text: 'Who are you applying for?',
      contextParam: 'familyType', // carries 'spouse' or 'child' into q3
      options: [
        { value: 'spouse', label: 'My spouse',  next: 'q3-location' },
        { value: 'child',  label: 'My child',   next: 'q3-location' },
      ]
    },
    'q3-location': {
      id: 'q3-location',
      text: 'Where are they right now?',
      options: [
        // Resolution determined by renderer using q3-location answer + familyType context
        { value: 'outside', label: 'Outside the UAE', next: 'r-family-outside' },
        { value: 'inside',  label: 'Inside the UAE',  next: 'r-family-inside' },
      ]
    },
    'q2-emp-loc': {
      id: 'q2-emp-loc',
      text: 'Where are you currently based?',
      options: [
        { value: 'inside',  label: "I'm in the UAE",        next: 'r-employment-inside' },
        { value: 'outside', label: "I'm outside the UAE",   next: 'r-employment-outside' },
      ]
    },
    'q2-golden': {
      id: 'q2-golden',
      text: 'What is the basis for your Golden Visa?',
      options: [
        { value: 'property',     label: 'I own property in Dubai worth AED 2M+', next: 'r-golden-property' },
        { value: 'professional', label: 'I am a professional or executive',      next: 'r-hub-golden' },
        { value: 'unsure',       label: "I'm not sure",                          next: 'r-hub-golden' },
      ]
    },
    'q2-company': {
      id: 'q2-company',
      text: 'What type of company are you setting up?',
      options: [
        { value: 'mainland',    label: 'Mainland company (trade freely across UAE)',   next: 'r-mainland' },
        { value: 'freezone',    label: 'Free zone company (specific zone)',             next: 'r-freezone' },
        { value: 'bankaccount', label: 'I need to open a business bank account',       next: 'r-bankaccount' },
        { value: 'unsure',      label: "I'm not sure which type",                     next: 'r-hub-company' },
      ]
    },
  },
  resolutions: {
    // Family — outside country (guide slug set by renderer from familyType context)
    'r-family-outside': {
      type: 'guide' as const,
      guideSlug: null, // renderer substitutes: spouse→ or child→ slug based on context
      guideSlugByContext: {
        spouse: 'spouse-dependent-visa-dubai-outside-country',
        child:  'child-dependent-visa-dubai-outside-country',
      },
      keyFacts: [
        'Your family member applies from outside the UAE',
        'Marriage/birth certificate must be attested before starting',
        'You submit the entry permit application as the sponsor',
      ],
      supportingServices: ['document-attestation-dubai'],
      supportingNote: 'Your certificate needs MOFA attestation before this process. See our attestation guide.',
    },
    // Family — inside country
    'r-family-inside': {
      type: 'guide' as const,
      guideSlug: null,
      guideSlugByContext: {
        spouse: 'spouse-dependent-visa-dubai-inside-country',
        child:  'child-dependent-visa-dubai-inside-country',
      },
      keyFacts: [
        'Your family member is already in the UAE',
        'No entry permit — status is changed in-country',
        'Amer service center handles the submission',
      ],
      supportingServices: ['amer-center-dubai'],
    },
    'r-renew': {
      type: 'guide' as const,
      guideSlug: 'renew-family-visa-dubai',
      keyFacts: [
        'Covers both spouse and child visa renewals',
        'Adults 18+ must complete a medical fitness test first',
        'Children under 18 are exempt from the medical test',
      ],
      supportingServices: ['amer-center-dubai'],
    },
    'r-newborn': {
      type: 'guide' as const,
      guideSlug: 'newborn-visa-dubai',
      keyFacts: [
        'For children born in the UAE',
        'Covers birth registration, DHA enrollment, and residence visa',
        'Submit before the child is 120 days old to avoid overstay fees',
      ],
      supportingServices: [],
    },
    'r-employment-inside': {
      type: 'guide' as const,
      guideSlug: 'employment-visa',
      keyFacts: [
        'You are already in the UAE on any visa status',
        'Your Dubai mainland employer handles Tasheel and Amer steps',
        'No departure from the UAE required',
      ],
      supportingServices: [],
    },
    'r-employment-outside': {
      type: 'advisor' as const,
      heading: 'Employment Visa (Outside UAE) — Guide Coming Soon',
      body: 'This route is for employees joining a Dubai employer from outside the UAE. A full step-by-step guide is in progress. Contact us and we will walk you through the current process.',
      whatsapp: true,
    },
    'r-golden-property': {
      type: 'guide' as const,
      guideSlug: 'golden-visa-dubai-property',
      keyFacts: [
        'Property must be valued at AED 2M or above',
        'Both completed and off-plan properties may qualify',
        'DLD title deed or Oqood is the primary document',
      ],
      supportingServices: [],
    },
    'r-hub-golden': {
      type: 'hub' as const,
      hubUrl: '/visas/golden',
      heading: 'Golden Visa — Multiple Routes Available',
      body: 'Golden Visas are available via property, professional salary, company ownership, or bank deposit. The property route guide is live now. Contact us for other routes.',
      whatsapp: true,
    },
    'r-mainland': {
      type: 'guide' as const,
      guideSlug: 'mainland-company-setup-dubai',
      keyFacts: [
        'Mainland companies can trade freely across the UAE',
        'Licensed by Dubai DED',
        'Some activities require a local service agent',
      ],
      supportingServices: ['pro-services-dubai'],
    },
    'r-freezone': {
      type: 'guide' as const,
      guideSlug: 'free-zone-company-setup-dubai',
      keyFacts: [
        '100% foreign ownership in most free zones',
        'Activity restricted to the zone or international trade',
        'Each free zone has its own authority and fee structure',
      ],
      supportingServices: ['pro-services-dubai'],
    },
    'r-bankaccount': {
      type: 'guide' as const,
      guideSlug: 'open-business-bank-account-dubai',
      keyFacts: [
        'Active trade license required before applying',
        'Document requirements vary by bank',
        'KYC process typically takes 2–6 weeks',
      ],
      supportingServices: [],
    },
    'r-hub-company': {
      type: 'hub' as const,
      hubUrl: '/company-setup',
      heading: 'Company Setup in Dubai',
      body: 'Three routes are covered: mainland company, free zone company, and business bank account. See the comparison on our company setup page.',
      whatsapp: false,
    },
    'r-advisor': {
      type: 'advisor' as const,
      heading: 'Let Us Point You in the Right Direction',
      body: 'Your situation may go beyond our current guide coverage. Contact us on WhatsApp and we will help you identify the right route.',
      whatsapp: true,
    },
  }
};
```

---

## Files to Create for Implementation

| File | Description |
|---|---|
| `lib/route-finder-config.ts` | Full config as above. Server-only. Never imported from client code. |
| `app/(public)/find-my-visa/page.tsx` | Server component. Fetches all guide data by slug array. Passes to `RouteFinderFlow`. |
| `components/RouteFinderFlow.tsx` | Client component (`'use client'`). Renders question/result from config + guide data props. |
| `lib/db/reader.ts` | Add `getGuidesBySlugArray(slugs: string[])` if not already present. |

**No new DB schema. No new admin actions. No API routes.**

---

## Implementation Checklist (Before Building)

- [x] At least 6 guides published (✅ 14 guides live)
- [x] Fee data verified and present in each guide (✅ all guides audited)
- [x] Config covers 80%+ of user question paths (✅ defined above)
- [x] Mobile interaction spec documented (✅ interaction-patterns-mobile-first.md Pattern 4)
- [ ] `lib/db/reader.ts` has `getGuidesBySlugArray()` or equivalent
- [ ] Header nav updated to include "Find My Route" link
- [ ] Hub page CTAs updated to link to `/find-my-visa`

---

## What NOT to Build in v1

- No saved results / user accounts
- No email capture on result page
- No PDF generation (Phase 9 per roadmap)
- No multi-language calculator
- No salary calculator or tax breakdown
- No route comparison table (link to hub page instead)
- No "book a consultation" deep integration (just a WhatsApp CTA link)
- No public API endpoint for calculator logic
- No loading spinner between questions (instant state update only)
- No progress bar with animation (text "Question X of Y" only)
- No "Back to start" button (use browser back or the `← Back` per-question link)

---

## Anti-Scraping Notes

- Business logic in `lib/route-finder-config.ts` — server-only, never a public endpoint
- Fee data derived from guide DB at server render time — not a static JSON endpoint
- Guide data is pre-fetched on the server and passed as a prop map — no `/api/fees` route
- Result page is SSR — no public REST endpoint for route resolution

---

## When to Add New Routes to the Calculator

Add a route to the config when ALL THREE are true:
1. A published guide exists for that route
2. Fee data in the guide has been audited and verified
3. The decision path from Q1 → Q2 → resolution is unambiguous

Do NOT add a route if the user would need to answer 4+ questions to reach it (design around the 3-question budget).

Priority additions after v1 launch:
1. Employment Visa (outside UAE) — when `employment-visa-dubai-outside-country` is published
2. Golden Visa (professional) — when salary threshold is verified and guide is published
3. Parent Visa — when guide is published and income requirements are confirmed

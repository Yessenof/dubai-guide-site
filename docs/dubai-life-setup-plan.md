# Dubai Life Setup — Strategic Architecture and Implementation Plan

Working title: **Dubai Life Setup by Guidex**
Status: Planning only — no code, no routes, no DB, no deployment until owner approves
Last updated: 2026-05-12

---

## 1. Executive Summary

Dubai Life Setup is a new organic SEO and AI-discoverable product hub within the existing Guidex Consulting website. It targets people who are planning or actively executing a move to Dubai — not just visa seekers, but people making the full suite of life decisions: where to live, what to budget, how to set up banking and utilities, where to send children to school, how to navigate the Islamic calendar for business timing.

The hub is additive. It sits alongside the existing guide library and links into it heavily. It does not replace or restructure existing routes.

The system is built config-first for MVP. No new DB tables. No DB migrations. No changes to the existing admin. All data lives in TypeScript config files until content volume and edit frequency justify a DB migration.

The conversion goal is WhatsApp consultation. Every page ends with a WhatsApp CTA. The Setup Finder routes users to a specific WhatsApp message pre-loaded with their situation context.

Target metrics: organic rankings for "moving to Dubai" cluster queries, AI answer inclusion (ChatGPT, Perplexity, Gemini citations), and WhatsApp lead generation from setup-intent users.

**Mobile-first is non-negotiable.** The primary user opens the site on a phone with 10 seconds of attention. No hero section. No full-screen takeover. The first screen must orient and convert.

**EN MVP ships first.** No RU routes until EN page quality, internal linking, and conversion path are stable and validated.

---

## 1A. Platform Positioning: One Function Inside the Larger Guidex Hub

### What Dubai Life Setup is

Dubai Life Setup is **one of several productized functions** within the Guidex UAE platform. It is not the whole website, and it must not be built or positioned as if it were.

The existing Guidex hub already contains distinct, commercially active functions:

| Existing function | Primary route |
|---|---|
| Find My Visa | `/find-my-visa`, `/ru/find-my-visa` |
| Visas | `/guides/[slug]` (employment, golden, spouse, child, dependent) |
| Company Setup | `/guides/[slug]` (mainland, free zone) |
| Government Services | `/government`, `/ru/government` |
| Banking & Tax | `/banking-tax`, `/ru/banking-tax` |
| Tourism & Holiday Homes | `/tourism`, `/ru/tourism` |
| News / Updates | `/news`, `/ru/news` |
| Events | `/events`, `/ru/events` |
| Calendar | `/calendar`, `/ru/calendar` |

Dubai Life Setup connects to all of these. It does not replace any of them.

### Positioning rules (locked)

1. **Dubai Life Setup is an entry point for a specific user intent** — people setting up life in Dubai holistically. It is not a universal homepage replacement.

2. **Existing commercial service paths must not be buried.** Visa guides, company setup, and Find My Visa are the primary revenue-generating paths. Dubai Life Setup links into them; it does not compete with them for homepage prominence.

3. **On the homepage, Dubai Life Setup appears as one strong entry point** among several — not as the whole homepage. The homepage remains the central Guidex dashboard that routes users into the right function based on their intent.

4. **Each function owns its own space:** its own route tree, its own config files, its own components directory, its own analytics events, its own internal link cluster. Functions must not become tangled.

5. **Shared components are encouraged** where the pattern is genuinely identical (e.g. `RelatedGuides`, `SetupWhatsAppCTA`, breadcrumb schema). Shared components live in `components/` root or a `components/shared/` subdirectory — not inside `components/life-setup/`. Do not fork a component when reuse is clean.

### The Guidex platform is growing modularly

Future Guidex will have multiple similar productized functions, each with its own route, config, and component set:

| Planned function | Route (indicative) | Status |
|---|---|---|
| Find My Visa | `/find-my-visa` | Live |
| Dubai Life Setup | `/life-setup` | This plan |
| UAE Calendar | `/calendar` + `/events` | Phase 3 (built, not fully live) |
| Company Setup Route Finder | `/company-setup/find-my-route` | Future |
| Tax / TRC Checker | `/banking-tax/trc-checker` | Future |
| Holiday Home Permit Checker | `/tourism/permit-checker` | Future |
| Area Map | `/life-setup/areas` | This plan |
| Document Route Checker | `/government/document-checker` | Future |

Each function:
- Has its own route tree (no shared URL namespace)
- Reads from its own config file(s) in `lib/`
- Has its own component directory in `components/`
- Has its own analytics event names (namespaced, e.g. `dubai_setup_*`, `route_finder_*`)
- Has its own internal linking cluster
- Is independently deployable without touching other functions

### Homepage architecture rule

The main Guidex homepage (`/` and `/ru`) remains the **central dashboard**. It routes users into the right function based on their situation. It must:
- Show clear entry points to all major functions
- Not be dominated by any single function
- Not require a restructure when a new function is added — new functions slot in as additional cards or navigation entries, not as a homepage redesign

Adding Dubai Life Setup as a homepage entry point requires explicit owner approval of the navigation change. The internal architecture and routes can be built without that approval — only the homepage surface change needs it.

---

## 2. System Architecture

The hub is composed of six interconnected subsystems. They must link to each other — disconnected features are the primary risk.

```
Dubai Life Setup Hub (/life-setup)
│
├── Setup Finder              (/life-setup/find-my-setup)
│   └── Result inline in page
│
├── Area Index + Map          (/life-setup/areas)
│   └── Area Detail Pages     (/life-setup/areas/[area-slug])
│
├── Life Checklist            (/life-setup/checklist)
│
├── Budget Estimator          (/life-setup/budget)
│
├── Calendar / Key Dates      (/life-setup/calendar)
│
└── Existing Guide Library    (/guides/[slug], /ru/guides/[slug])
    └── Linked from all hub pages via RelatedGuides component
```

**Conversion layer** — WhatsApp CTA on every page, every area card, every result card. Pre-loaded messages carry situation context (area, family size, timeline, visa type).

**SEO layer** — Every hub page is a standalone rankable article. Fast user layer (tool/answer) + SEO layer (depth, FAQ, schema, internal links). Not thin pages.

**RU layer** — Deferred. RU routes are built only after EN content, internal links, and conversion path are stable. See §3 RU Rollout Rule.

### Mobile-First Dashboard Rule (locked)

`/life-setup` and `/life-setup/find-my-setup` must NOT use large hero sections, full-screen images, or decorative banners. These are dashboard-style pages, not landing pages.

**Within the first screen on a 390px-wide mobile viewport, the user must see:**

1. A one-line label identifying the section (e.g. "Dubai Life Setup")
2. A one-sentence description of what the hub does
3. Primary CTA: "Build my Dubai setup plan" — links to `/life-setup/find-my-setup`
4. Secondary CTA: "Explore area map" — links to `/life-setup/areas`
5. At least 3 situation cards (scrollable horizontally if needed — must not require scroll to reach)
6. WhatsApp help option visible without scrolling (sticky footer or inline)

**What is not allowed in the first screen:**
- Hero images or illustrations
- Decorative gradients or animations
- More than 2 sentences of introductory text
- Any section heading that pushes content below the fold
- A navigation bar that uses more than 40px of vertical space

The hub design must match the existing site's compact, calm, Apple-inspired style — not a redesign.

---

## 3. MVP Cutoff

This section is a strict list of what the MVP will NOT include. Adding any of these without explicit owner approval is overbuilding.

| Will NOT include | Reason |
|---|---|
| Live property prices | No API, no live data. All costs are sourced ranges with review dates. |
| Paid map API (Google Maps, Mapbox, MapLibre tile server) | See §7. Pure SVG only for MVP. |
| MapLibre GL JS | Heavy bundle, external tile dep, mobile perf risk. Phase 2+ only. |
| DB migration for life-setup data | Config files are sufficient and safer for MVP. |
| Admin integration for life-setup content | No new admin pages, no new CRUD. |
| RU routes until EN MVP is stable | RU only after EN quality and conversion are validated. |
| 30-area expansion | 10 areas for MVP. Expand only after map UX is validated. |
| Automatic weekly content updates | No cron jobs, no scraping, no live data feeds. |
| Fake live data ("Updated daily") | All data is static and labeled with a review date. |
| Homepage navigation takeover | Homepage changes require explicit owner approval. |
| Schools, healthcare, pets, driving sub-hubs | Phase 2+. Not in MVP scope. |
| Any analytics event implementation | Analytics events are defined in §9 but implemented in a separate pass after pages are live. |

---

## 4. Proposed Route Tree

### MVP Routes (Phase 1 — build and rank)

```
/life-setup                                    Hub — situation cards + finder CTA + area strip
/life-setup/find-my-setup                      Setup Finder — 5-question flow → result
/life-setup/areas                              Area index — filterable area card grid + SVG map
/life-setup/areas/[area-slug]                  Area detail page — 14 sections (see §10)
/life-setup/checklist                          Life setup checklist — ordered task list
/life-setup/budget                             Budget estimator — config-driven ranges
/life-setup/calendar                           Key dates — Islamic calendar, school terms, deadlines
```

### Future Routes (Phase 2+)

```
/life-setup/schools                            School finder — area + curriculum filter
/life-setup/healthcare                         Healthcare setup guide
/life-setup/banking                            Banking setup (linked from existing banking-tax hub)
/life-setup/pets                               Pet import and setup guide
/life-setup/driving                            License conversion and car purchase guide
```

### RU Rollout Rule (locked)

RU routes for Dubai Life Setup are deferred until all of the following are true:

1. All EN MVP pages are live, indexed, and have stable content.
2. Internal linking between life-setup pages and existing EN guides is complete.
3. At least one WhatsApp conversion has been traced back to the hub.
4. RU content is written for all pages (no stubs, no empty fields).

When RU is built:
- Mirror routes under `/ru/life-setup/` with locale-aware components.
- RU config extends EN config with `ru_*` fields — same pattern as existing guides.
- Two-gate model applies: `ru_published=1` required before any RU page renders.
- No English fallback on any RU life-setup page. If `ru_*` fields are empty, the page does not render — `notFound()` instead.
- Add hreflang to EN pages only after RU content is live.
- Add `/ru/life-setup/find-my-setup` as the RU entry point, linked from `/ru` homepage.

---

## 5. Data and Config Architecture

### Config-first for MVP

No new DB tables. All life setup data lives in TypeScript config files in `lib/life-setup/`. The config object shape maps 1:1 to future DB columns so migration is mechanical when needed.

```
lib/life-setup/
  setup-finder-config.ts    5-question tree + resolution objects
  areas-config.ts           Area definitions (slug, name, tags, sections, tabs)
  checklist-config.ts       Ordered task list with guide links
  budget-config.ts          Cost range tables (rent, school, car, utilities)
  calendar-config.ts        Key dates (Islamic, school terms, visa renewal windows)
  related-guides-config.ts  Slug + title + category index for RelatedGuides component
  cta-config.ts             WhatsApp message templates per situation
```

### Full TypeScript Interfaces

```typescript
// lib/life-setup/setup-finder-config.ts

export type SetupOption = {
  value: string;
  label: string;
  next: string | null;   // ID of next question, or null to resolve
};

export type SetupQuestion = {
  id: string;
  text: string;
  subtext?: string;      // optional clarifying line beneath question
  options: SetupOption[];
};

export type SetupResult = {
  type: "guide" | "hub" | "checklist";
  contextKey: string;    // e.g. "employed_family_outside_uae" — unique per resolution
  headline: string;      // e.g. "Employment visa + family setup from outside UAE"
  summary: string;       // 1–2 sentences
  primaryCta: {
    label: string;
    href: string;        // always an existing guide slug or hub route
  };
  whatsappMessage: string; // pre-filled message — references contextKey
  relatedGuides: string[]; // guide slugs — 2–4 max
  areaRecommendation: "budget" | "mid" | "premium" | null; // derived from budget question
};

export const SETUP_FINDER_QUESTIONS: SetupQuestion[] = [ /* ... */ ];
export const SETUP_RESOLUTIONS: Record<string, SetupResult> = { /* contextKey → result */ };
```

```typescript
// lib/life-setup/areas-config.ts

export type AreaTab = {
  id: string;   // "rent" | "commute" | "schools" | "shopping" | "healthcare" | etc.
  label: string;
  body: string; // max 3 sentences — no invented numbers
  dataPoints?: string[]; // exact figures only, each with inline source
  lastReviewed: string;  // "RERA Q1 2026" or "May 2026" — required for all cost data
};

export type DubaiArea = {
  slug: string;
  name: string;
  shortName: string;      // for map label and card badge
  tags: string[];         // ["family-friendly", "affordable", "near-metro"] — from controlled list
  summary: string;        // 1–2 sentences for card — no cost claims
  svgId: string;          // must match <path id="..."> in dubai-areas-map.svg
  population: "low" | "medium" | "high";
  rentTier: "budget" | "mid" | "premium";
  suitedFor: string[];    // descriptive only — ["solo professionals", "young families"]
  notSuitedFor: string[]; // honest limitations — max 3
  tabs: AreaTab[];
  relatedGuides: string[]; // guide slugs — 3+ required before indexing
  faq: { question: string; answer: string }[]; // 3–5 — defensible answers only
  lastReviewed: string;   // "May 2026" — shown on page, required field
  ru?: {
    name: string;
    summary: string;
    tabs?: Partial<Record<string, Partial<AreaTab>>>;
    suitedFor?: string[];
    notSuitedFor?: string[];
    faq?: { question: string; answer: string }[];
  };
};
```

```typescript
// lib/life-setup/calendar-config.ts

export type LifeSetupReminder = {
  id: string;
  type: "islamic" | "school" | "government" | "business" | "visa";
  title: string;
  description: string;   // 1–2 sentences
  year: number;
  dateApprox?: string;   // "Mar–Apr 2026" — for Islamic dates (not confirmed)
  dateConfirmed?: string; // ISO date — only when officially announced
  islamicFlag: boolean;  // triggers amber disclaimer on page
  relatedGuide?: string; // guide slug — links to existing guide
  relatedLifeSetupRoute?: string; // internal hub route — optional
};
```

```typescript
// lib/life-setup/related-guides-config.ts

export type RelatedGuideLink = {
  slug: string;
  title: string;          // short display title — may differ from full guide title
  category: "visas" | "company-setup" | "hiring" | "living" | "government";
  relevantFor: string[];  // tags matching DubaiArea.tags and SetupResult.contextKey
};

export const RELATED_GUIDES: RelatedGuideLink[] = [ /* ... */ ];
```

```typescript
// lib/life-setup/cta-config.ts

export type SetupCta = {
  contextKey: string;     // matches SetupResult.contextKey
  whatsappMessage: string; // must not exceed 200 characters — readable on mobile
};

export const SETUP_CTAS: SetupCta[] = [ /* ... */ ];

// Default CTA used on hub page and pages without contextKey
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I'm planning to set up my life in Dubai and would like your help.";
```

### Budget Config Shape

```typescript
// lib/life-setup/budget-config.ts

export type BudgetItem = {
  id: string;
  label: string;
  min: number;
  max: number;
  unit: "AED/month" | "AED/year" | "AED one-off";
  note?: string;    // only when range driver is non-obvious (e.g. "varies by DEWA zone")
  source: string;   // required — "RERA Q1 2026", "school fee schedule 2025-26", etc.
  lastReviewed: string; // required — "May 2026"
};

export type BudgetCategory = {
  id: string;
  label: string;
  items: BudgetItem[];
};
```

Fee discipline applies here identically to the guide standard: no invented ranges, name the variation driver when exact figure is unknown, cite source and review date for every figure.

---

## 6. Component Architecture

All components are new files in `components/life-setup/`. No existing component is modified.

```
components/life-setup/
  DubaiLifeSetupHub.tsx       Hub page layout — dashboard style, no hero
  SetupFinderFlow.tsx         5-question wizard — reads setup-finder-config.ts (CLIENT)
  SetupResultCard.tsx         Result card — headline + guide links + WhatsApp CTA
  AreaMapLite.tsx             SVG map — area highlight on hover/tap (CLIENT)
  AreaGrid.tsx                Filterable area card grid (CLIENT — filter state only)
  AreaCard.tsx                Compact area card — name + rent tier + tags + CTA (SERVER)
  AreaTabs.tsx                Tab navigation for area sections (CLIENT)
  AreaSnapshot.tsx            Quick-facts band — rent tier + commute + school tier (SERVER)
  LifeSetupChecklist.tsx      Ordered task list with guide links (SERVER)
  BudgetEstimator.tsx         Config-driven range table (SERVER)
  ReminderCalendarPreview.tsx Key dates list — links to /calendar pages (SERVER)
  RelatedGuides.tsx           Compact guide link list — reused across all hub pages (SERVER)
  SetupWhatsAppCTA.tsx        Pre-loaded WhatsApp button with situation context (SERVER)
```

**Rendering rules:**
- All components are server components by default.
- `SetupFinderFlow` — client component. State: `currentStep` (string | null) + `answers` (Record<string, string>). No other state.
- `AreaMapLite` — client component. Passive event listeners only. No reflow on hover.
- `AreaGrid` — client component only for filter state. Card rendering is server-ready HTML; filter hides/shows via CSS class, not re-render.
- All others — server components. No `useEffect`, no `fetch`, no `useState`.
- Data comes from config imports in `lib/life-setup/` only, or `lib/db/reader.ts` for existing guide data.
- No imports from `lib/db/writer.ts`. No admin imports.

---

## 7. SEO Architecture

### Page-level metadata

Every hub page exports a static `metadata` object. Title and description derived from config. Canonical always set.

```typescript
export const metadata: Metadata = {
  title: "Setting Up Life in Dubai — Where to Live, Costs, and What to Do | Guidex",
  description: "Step-by-step guide to setting up life in Dubai: choose your area, get your visa, open a bank account, and enrol your children in school.",
  alternates: { canonical: `${BASE}/life-setup` },
};
```

### Canonical and hreflang

- EN canonical: `https://guidex-consulting.ae/life-setup/[path]`
- RU canonical: `https://guidex-consulting.ae/ru/life-setup/[path]` (future)
- hreflang added to EN pages only after RU content is live
- x-default always points to EN

### Breadcrumbs (JSON-LD)

Every area detail page and tool sub-page includes BreadcrumbList structured data.

```json
{ "@type": "BreadcrumbList", "itemListElement": [
  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://guidex-consulting.ae" },
  { "@type": "ListItem", "position": 2, "name": "Dubai Life Setup", "item": ".../life-setup" },
  { "@type": "ListItem", "position": 3, "name": "Marina", "item": ".../life-setup/areas/marina" }
]}
```

### FAQ schema

Area detail pages and the hub page include FAQPage structured data. Questions are drawn from the `faq` field of the config (not invented — only real questions with defensible answers).

### Sitemap Gating (per route)

| Route | Default robots | Sitemap-eligible when | Priority |
|---|---|---|---|
| `/life-setup` | `index` | Hub content fully written (situation cards, FAQ, overview) | 0.7 |
| `/life-setup/find-my-setup` | `index` | All question resolutions written and tested | 0.6 |
| `/life-setup/areas` | `noindex` until ≥3 area cards ready | ≥3 area detail pages indexed | 0.6 |
| `/life-setup/areas/[slug]` | `noindex` until content complete | All 14 sections written, reviewed, no invented numbers | 0.6 |
| `/life-setup/checklist` | `noindex` | All checklist phases written, ≥5 guide links wired | 0.5 |
| `/life-setup/budget` | `noindex` | All budget categories sourced with review dates | 0.5 |
| `/life-setup/calendar` | `noindex` | ≥8 key dates written with correct Islamic flags | 0.5 |

Skeleton or placeholder pages must carry `robots: { index: false, follow: true }` until the content gate is cleared. Never add a page to the sitemap while it is a stub.

### Internal Linking Matrix

Every row represents a page. Every column represents a destination it must link to. ✓ = required before page is indexed. (future) = after Phase 2.

| From \ To | `/life-setup` | `/find-my-setup` | `/areas` | `/areas/[slug]` | `/checklist` | `/budget` | `/calendar` | Existing guides | WhatsApp CTA |
|---|---|---|---|---|---|---|---|---|---|
| `/life-setup` | — | ✓ | ✓ | ✓ (3 areas) | ✓ | ✓ | ✓ | ✓ (3–5 guides) | ✓ |
| `/find-my-setup` | ✓ | — | ✓ | ✓ (via result) | ✓ (via result) | — | — | ✓ (result guides) | ✓ |
| `/areas` | ✓ | ✓ | — | ✓ (all area cards) | ✓ | ✓ | — | ✓ | ✓ |
| `/areas/[slug]` | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ (3+ guides) | ✓ |
| `/checklist` | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ (per task) | ✓ |
| `/budget` | ✓ | ✓ | ✓ | — | — | — | — | ✓ (banking, setup) | ✓ |
| `/calendar` | ✓ | — | — | — | ✓ | — | — | ✓ (visa renewal) | ✓ |
| Existing guides | — | (future) | — | (future) | — | — | — | — | — |

**Back-link from existing guides:** After hub pages are indexed, relevant existing guides (employment-visa, golden-visa, mainland-company-setup, spouse-dependent, child-dependent) will link to `/life-setup` or `/life-setup/find-my-setup` via a `RelatedGuides` component added to the guide page layout. This is a Week 6 task — not during initial page build.

---

## 8. Analytics Plan

These event names are defined now for consistency. **Do not implement until hub pages are live and stable.** All events are wired via GTM dataLayer pushes in a separate analytics pass, identical to the existing guide events.

### Key events (primary conversion signals)

| Event name | Trigger | Required parameters |
|---|---|---|
| `dubai_setup_finder_start` | User clicks first Setup Finder option (Q1) | `{ page_location }` |
| `dubai_setup_finder_result_view` | Result card renders after Q5 | `{ context_key, area_tier }` |
| `dubai_setup_result_whatsapp_click` | WhatsApp button on result card | `{ context_key, area_tier }` |
| `area_detail_cta_click` | WhatsApp CTA on any area detail page | `{ area_slug }` |

### Supporting engagement events

| Event name | Trigger | Required parameters |
|---|---|---|
| `area_map_area_click` | User taps/clicks an area on SVG map | `{ area_slug }` |
| `area_map_tab_click` | User switches tab on area detail page | `{ area_slug, tab_id }` |
| `life_setup_checklist_click` | User clicks a checklist guide link | `{ task_id, guide_slug }` |
| `life_setup_calendar_click` | User clicks a calendar entry | `{ entry_id, entry_type }` |

**Implementation rule:** Do not fire events from server components. All dataLayer pushes come from client components (`SetupFinderFlow`, `AreaMapLite`, `AreaGrid`, `AreaTabs`). Supporting events may be deferred to Phase 2.

---

## 9. Lightweight Map MVP Technical Approach

### Options compared

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| Pure SVG (hand-drawn) | Zero deps, fast, full control, no API key | Time to draw, simplified shapes | **MVP choice** |
| Simplified GeoJSON → SVG (one-time script) | Accurate shapes, maintainable | Needs d3-geo or similar (bundle weight) | Phase 2 |
| MapLibre GL JS + OpenStreetMap tiles | Real map, interactive | Heavy JS bundle, tile server dep, mobile perf risk | Not for MVP — separately approved only |
| Google Maps Embed | Easy | Paid API, external dep, no style control | Never |

### MVP approach: Pure inline SVG

- One SVG file: `public/images/dubai-areas-map.svg`
- Each area is a `<path>` with `id="area-marina"`, `id="area-jvc"`, etc. matching `DubaiArea.svgId`
- `AreaMapLite.tsx` imports the SVG and applies Tailwind fill classes per area slug
- Hover (desktop): highlight area + tooltip card (name + rent tier + arrow link)
- Tap (mobile): highlight area + bottom sheet summary card (name + rent tier + CTA)
- No tile server. No external API call. No API key.

### Map disclaimer (mandatory — must appear on every page that shows the map)

> "Area boundaries are simplified for lifestyle guidance and are not legal or official community boundaries."

**Rule:** Do not visually imply exact legal boundaries. SVG paths are approximate polygons for orientation only. Do not label boundaries, streets, or coordinates on the map. Do not add a north arrow or scale bar that implies survey accuracy.

### SVG map areas (10 initial)

```
marina, jbr, downtown, business-bay, difc,
jvc, mirdif, al-barsha, deira, bur-dubai
```

Each path shape is a simplified polygon — geographically oriented but not cadastre-accurate. The goal is orientation, not navigation. Do not expand beyond 10 areas until map UX is validated.

### Phase 2 upgrade path

When area count exceeds 15 and map accuracy becomes important, generate SVG paths from OpenStreetMap GeoJSON using a one-time Node script. Output remains a static SVG — no runtime geo dependency. MapLibre only if separately approved and mobile perf is confirmed acceptable.

---

## 10. Content Outline for Hub Pages

Each page outline includes: search intent, mobile-first fast layer, SEO depth layer, index/noindex, sitemap eligibility gates, minimum content required before indexing, required internal links, and last-reviewed requirement.

---

### /life-setup — Hub

**Search intent:** "moving to Dubai guide", "Dubai relocation checklist", "living in Dubai"

**Fast user layer (first screen — mobile 390px):**
- Section label: "Dubai Life Setup"
- One-line description: what the hub does
- Primary CTA button: "Build my Dubai setup plan" → `/life-setup/find-my-setup`
- Secondary CTA: "Explore area map" → `/life-setup/areas`
- 7 situation cards (horizontal scroll if needed — must be visible without scrolling)
- WhatsApp help: visible without scrolling

**Situation cards (7):**
1. Relocating with family — Employment + family visa + school setup
2. Solo professional — Employment visa + housing + banking
3. Starting a business — Company setup + banking + work permits
4. Buying property — Golden visa + mortgage + residency
5. Retiree / long-term stay — Golden visa + healthcare + banking
6. Returning resident — Visa renewal + address update + banking
7. Moving kids to school — Child visa + school admission + area selection

**SEO layer (below fold):**
- "What you need to set up in Dubai" — ordered overview: visa → housing → banking → school → utilities → driving (no more than 6 bullets)
- Area overview strip with SVG map (links to `/life-setup/areas`)
- Related guides cluster: 3–5 existing guides
- FAQ: 5 questions
- WhatsApp CTA block

**robots:** `index`
**Sitemap-eligible:** When all 7 situation cards, overview, FAQ, and 3 guide links are written
**Minimum before indexing:** All situation cards link somewhere real. FAQ has 5 real questions. Overview section exists.
**Required internal links:** finder, areas, checklist, budget, calendar, ≥3 existing guides
**Last reviewed:** Not required (no cost claims on hub page)

---

### /life-setup/find-my-setup — Setup Finder

**Search intent:** "which Dubai visa do I need", "Dubai relocation which area", "what do I need to move to Dubai"

**Fast user layer:** 5-question flow renders immediately — no loading, no skeleton, config is static
- Question → options rendered as tappable cards (not dropdowns)
- Progress: step indicator "2 of 5"
- Back button on every step
- Result card renders inline after Q5 — no page navigation

**5 questions:**
1. "What best describes your situation?" — Employed by company / Starting a business / Buying property / Retired or investor / Already here, extending
2. "Are you moving alone or with family?" — Alone / With partner / With partner + children / Children only
3. "Where are you relocating from?" — Inside UAE / Outside UAE (GCC) / Outside UAE (other)
4. "What is your target timeline?" — Within 1 month / 1–3 months / 3–6 months / Planning ahead
5. "What is your approximate monthly budget for housing?" — Under AED 6,000 / AED 6,000–12,000 / AED 12,000–20,000 / Over AED 20,000

**Result card format:**
- Situation headline (derived from contextKey)
- Primary guide CTA (links to matching existing guide)
- Recommended area tier (budget / mid / premium — from Q5)
- Next steps list: 3–5 bullets, each linking to a guide or hub sub-page
- WhatsApp CTA: "Get a personalised setup plan →" (pre-loaded contextKey message)

**robots:** `index`
**Sitemap-eligible:** All question resolutions written and tested end-to-end
**Minimum before indexing:** Every Q1 option leads to a complete resolution. No dead ends.
**Required internal links:** hub, area index, ≥1 guide per result card, WhatsApp CTA
**Last reviewed:** Not required (no cost claims)

---

### /life-setup/areas — Area Index

**Search intent:** "best areas to live in Dubai", "Dubai neighborhoods guide", "where to live in Dubai"

**Fast user layer:**
- Filter bar (rent tier: budget / mid / premium; tags: family-friendly / near-metro / beach / quiet)
- Area card grid (10 areas, filter state client-side — no re-render, CSS visibility)
- SVG map above or alongside cards (highlights active filter)
- Map disclaimer visible

**SEO layer:**
- Comparison table: area / rent tier / commute / school tier / vibe
- "How to choose your area in Dubai" — 3–4 short paras
- Related guides: employment-visa, open-business-bank-account-dubai
- FAQ: 5 questions
- WhatsApp CTA

**robots:** `noindex` until ≥3 area pages indexed; then `index`
**Sitemap-eligible:** ≥3 area detail pages are indexed
**Minimum before indexing:** Filter works. ≥3 area cards link to live detail pages.
**Required internal links:** hub, find-my-setup, ≥3 area detail pages, ≥2 existing guides
**Last reviewed:** Not required (no cost claims on index page)

---

### /life-setup/areas/[area-slug] — Area Detail

**Search intent:** "living in [area] Dubai", "[area] Dubai rent prices", "[area] Dubai family friendly"

**Fast user layer (first screen):**
- Area name + rent tier badge + tags
- Quick snapshot band: rent range / commute / school tier / vibe
- Tab bar for 14 sections (sticky on scroll)
- WhatsApp CTA visible above fold

**14 tab sections (ordered):**
1. Who it suits — descriptive, no demographic stats
2. Who it may not suit — honest, ≤3 points
3. Rent overview — RERA-sourced ranges, bedroom count, review date
4. Property notes — purchase price tier, no exact figures without source; disclaimer: "property values change; verify with a licensed agent"
5. Transport and commute — named metro stations, road links, parking notes
6. Setup notes — what is easy or hard to set up from this area (utility connections, postal address quirks)
7. Supermarkets and daily shopping — named stores, not generic chains
8. Schools and nurseries — named schools, curriculum type (GEMS, KHDA-licensed, etc.)
9. Healthcare — named hospitals or clinics in or near the area
10. Gyms, parks, outdoor — named facilities
11. Community feel — 2–3 sentences, honest character
12. Common mistakes — 2–3 honest pain points new residents discover
13. FAQ — 3–5 questions with defensible answers (FAQPage JSON-LD)
14. Related guides + WhatsApp CTA

**Area content quality rules (mandatory before indexing):**
- Sections 1, 2, 3, 4, 5, 12, 13, and 14 must be complete. Others may be stubs initially.
- All rent ranges must cite RERA or a dated source. No invented numbers.
- No unsupported nationality claims ("popular with Indians", "Russian expat area"). Descriptive framing only.
- No exact price claims (purchase AED/sqft) without a source and review date.
- `lastReviewed` field is required and shown on page. Minimum review: before indexing.
- Named places (schools, hospitals, stores) must be verifiable — do not invent or guess.
- No superlatives ("best", "cheapest", "most popular") without support.
- No invented commute times. If unknown, say "varies by traffic".

**robots:** `noindex` until content quality gate is cleared; then `index`
**Sitemap-eligible:** All 8 mandatory sections complete, lastReviewed date set, ≥3 guide links wired
**Minimum before indexing:** Sections 1–5, 12–14 complete. No placeholder text. No invented numbers.
**Required internal links:** hub, areas index, find-my-setup, checklist, budget, ≥3 existing guides
**Last reviewed:** Required — shown on page, required field in config

---

### /life-setup/checklist — Life Setup Checklist

**Search intent:** "Dubai relocation checklist", "moving to Dubai what to do first", "Dubai setup steps"

**Fast user layer:**
- Section label + one-line description
- Checklist starts immediately — no intro paragraph blocking it
- Grouped by phase: Before you arrive / Week 1 / Month 1 / Month 3+
- Each task: checkbox (client-side, no persistence) + guide link + estimated time
- WhatsApp CTA between Phase 2 and Phase 3 (not only at bottom)

**SEO layer:**
- Phase descriptions (1 para each — after the phase tasks, not before)
- "Common mistakes" section (3–5 points)
- Related guides cluster
- WhatsApp CTA at bottom

**robots:** `noindex` until all phases written; then `index`
**Sitemap-eligible:** All 4 phases written, ≥5 guide links wired
**Minimum before indexing:** All phases have ≥3 tasks. Every task links to a real page.
**Required internal links:** hub, find-my-setup, areas, budget, calendar, ≥5 existing guides
**Last reviewed:** Not required unless cost estimates appear in tasks

---

### /life-setup/budget — Budget Estimator

**Search intent:** "Dubai living costs 2026", "cost of living in Dubai", "Dubai monthly budget"

**Fast user layer:**
- Family size toggle: Single / Couple / Family with children (client-side, CSS show/hide)
- Budget table renders immediately — no loading
- Each category: min / typical / max (AED/month)
- Source and review date shown per category

**SEO layer:**
- "What drives costs in Dubai" — 3–4 paras (area, lifestyle, school choice, car vs metro)
- Fee discipline: all ranges cite source and review date. No invented figures.
- Related guides: banking setup, company setup
- WhatsApp CTA

**robots:** `noindex` until all categories sourced; then `index`
**Sitemap-eligible:** All budget categories have sourced ranges and review dates
**Minimum before indexing:** All categories written. Every item has `source` and `lastReviewed`.
**Required internal links:** hub, checklist, areas, ≥2 existing guides
**Last reviewed:** Required — shown on page per category and in page header

---

### /life-setup/calendar — Key Dates

**Search intent:** "Dubai public holidays 2026", "UAE school term dates", "Ramadan 2026 Dubai business"

**Fast user layer:**
- Year selector (current + next year)
- Grouped list: Islamic holidays / School terms / Government deadlines / Business-critical
- Islamic date disclaimer (amber block — same as existing `/calendar` pages)
- Islamic entries show "approximate" badge until date confirmed

**SEO layer:**
- "Planning around Islamic dates in Dubai" — 2–3 paras
- "School year overview" — 2 paras
- Links to existing `/calendar` detail pages
- WhatsApp CTA

**robots:** `noindex` until ≥8 entries written; then `index`
**Sitemap-eligible:** ≥8 entries with correct Islamic flags and descriptions
**Minimum before indexing:** ≥2 per category. Islamic disclaimer visible. No fake confirmed dates.
**Required internal links:** hub, checklist, ≥1 visa guide (visa renewal timing)
**Last reviewed:** Not required per entry, but page-level "Updated for [year]" label required

---

## 11. Implementation Sequence

The sequence is deliberate. Each phase validates before the next is built. Do not jump ahead.

### Phase 1 — Hub and Finder (Weeks 1–2)

**Goal:** Get `/life-setup` and `/life-setup/find-my-setup` live and converting.

Week 1:
- [ ] Create `lib/life-setup/` with all config stubs (typed shapes, no content yet)
- [ ] Create `components/life-setup/` with component stubs
- [ ] Create `/life-setup` route — static hub page, mobile dashboard layout, no finder, no map
- [ ] Write all 7 situation cards (content only — no component needed yet)
- [ ] Write hub SEO layer: overview, FAQ, related guides section
- [ ] Add `/life-setup` to sitemap as `noindex` (placeholder, not yet eligible)

Week 2:
- [ ] Write `lib/life-setup/setup-finder-config.ts` — all 5 questions + all resolutions
- [ ] Write `lib/life-setup/cta-config.ts` — WhatsApp messages per contextKey
- [ ] Build `SetupFinderFlow.tsx` (client, minimal state)
- [ ] Build `SetupResultCard.tsx`
- [ ] Build `SetupWhatsAppCTA.tsx`
- [ ] Wire finder into `/life-setup/find-my-setup`
- [ ] Test all resolution paths locally — no dead ends
- [ ] **Validate hub + finder on mobile before proceeding**

**Gate to Phase 2:** Hub renders correctly on 390px. Finder has no dead ends. WhatsApp CTA fires correct pre-loaded message for at least 3 contextKeys.

---

### Phase 2 — Area Map and Index (Week 3)

**Goal:** Area map UX validated before individual area pages are built.

> **Time note:** Drawing the SVG map and mobile-testing tap targets may require an extra 1–2 days beyond the week estimate. Plan for this. The map must not delay the hub + finder MVP — those ship independently.

**SVG map priority:** The first version must prioritize clarity and tap targets over geographic perfection. Large, clearly separated path shapes that are easy to tap on a phone matter more than accurate outlines. Accuracy can be improved in a later pass.

**Fallback if SVG takes longer than expected:** Launch `/life-setup/areas` first with area cards only and a simplified visual placeholder (e.g. a static labelled district diagram or a neutral grey panel with "Interactive map coming soon"). The hub, finder, and area cards are fully usable without the SVG map. Add the map in the next pass — do not hold the areas page for it.

- [ ] Write area data for 10 areas in `lib/life-setup/areas-config.ts` — stubs only (name, slug, svgId, tags, rentTier, summary)
- [ ] Draw `public/images/dubai-areas-map.svg` — 10 simplified paths with correct IDs; prioritise large tap targets, not boundary accuracy
- [ ] Build `AreaMapLite.tsx` — tap/hover highlight, mobile bottom sheet
- [ ] Build `AreaCard.tsx` and `AreaGrid.tsx` — filter state, CSS show/hide
- [ ] Create `/life-setup/areas` page (index, map, cards — noindex)
- [ ] Add map disclaimer to every map render
- [ ] **Validate map UX on mobile before building area detail pages**

**Gate to Phase 3:** Map highlights correct area on tap (or fallback placeholder is live). Filter works. Area cards link to (not-yet-live) area slugs without errors.

---

### Phase 3 — Area Detail Pages (Weeks 4–5)

**Goal:** 3 priority area pages fully written and indexed.

Week 4:
- [ ] Write full 14-section content for Marina, JVC, Downtown (in `areas-config.ts`)
- [ ] Build `AreaTabs.tsx`, `AreaSnapshot.tsx`
- [ ] Create `app/(public)/life-setup/areas/[area-slug]/page.tsx`
- [ ] Add BreadcrumbList JSON-LD
- [ ] Add FAQPage JSON-LD
- [ ] QA each page: no invented numbers, all places verifiable, lastReviewed set
- [ ] Add 3 pages to sitemap (set index when gate is cleared)

Week 5:
- [ ] Write content for remaining 7 areas (Al Barsha, Business Bay, JBR, DIFC, Mirdif, Deira, Bur Dubai)
- [ ] QA all 7: same gate as Week 4
- [ ] Add all 7 to sitemap when gates clear

---

### Phase 4 — Checklist, Budget, Calendar (Week 6)

- [ ] Write `lib/life-setup/checklist-config.ts` (all phases, all tasks, all guide links)
- [ ] Write `lib/life-setup/budget-config.ts` (all categories, all sourced ranges)
- [ ] Write `lib/life-setup/calendar-config.ts` (≥8 entries, correct Islamic flags)
- [ ] Build `LifeSetupChecklist.tsx`, `BudgetEstimator.tsx`, `ReminderCalendarPreview.tsx`
- [ ] Create `/life-setup/checklist`, `/life-setup/budget`, `/life-setup/calendar`
- [ ] Verify all internal links are wired per the linking matrix in §7

---

### Phase 5 — Cross-linking and SEO Audit (Weeks 7–8)

Week 7:
- [ ] Add `RelatedGuides` component to relevant existing guide pages (employment-visa, golden-visa, mainland-company-setup, spouse-dependent, child-dependent → link to `/life-setup` or `/life-setup/find-my-setup`)
- [ ] Update all area pages with internal links per linking matrix
- [ ] Verify checklist tasks all link to live pages

Week 8:
- [ ] Metadata audit: all pages have title + description + canonical
- [ ] Structured data audit: breadcrumbs + FAQ on all area pages
- [ ] Mobile layout QA on all new pages (390px and 430px)
- [ ] Build: 0 errors, all new routes 200
- [ ] Update sitemap: set eligible pages to `index`, confirm priorities
- [ ] Submit updated sitemap to Google Search Console
- [ ] Update memory files (PROJECT_STATE.md, SESSION_LOG.md, CHECKPOINTS.md, NEW_CHAT_TRANSFER.txt)
- [ ] Deploy

---

## 12. Files to Create and Modify

### New files (create — no code until owner approves)

```
lib/life-setup/setup-finder-config.ts
lib/life-setup/areas-config.ts
lib/life-setup/checklist-config.ts
lib/life-setup/budget-config.ts
lib/life-setup/calendar-config.ts
lib/life-setup/related-guides-config.ts
lib/life-setup/cta-config.ts

components/life-setup/DubaiLifeSetupHub.tsx
components/life-setup/SetupFinderFlow.tsx       (CLIENT)
components/life-setup/SetupResultCard.tsx
components/life-setup/AreaMapLite.tsx            (CLIENT)
components/life-setup/AreaGrid.tsx               (CLIENT — filter only)
components/life-setup/AreaCard.tsx
components/life-setup/AreaTabs.tsx               (CLIENT)
components/life-setup/AreaSnapshot.tsx
components/life-setup/LifeSetupChecklist.tsx
components/life-setup/BudgetEstimator.tsx
components/life-setup/ReminderCalendarPreview.tsx
components/life-setup/RelatedGuides.tsx
components/life-setup/SetupWhatsAppCTA.tsx

app/(public)/life-setup/page.tsx
app/(public)/life-setup/find-my-setup/page.tsx
app/(public)/life-setup/areas/page.tsx
app/(public)/life-setup/areas/[area-slug]/page.tsx
app/(public)/life-setup/checklist/page.tsx
app/(public)/life-setup/budget/page.tsx
app/(public)/life-setup/calendar/page.tsx

public/images/dubai-areas-map.svg
```

### Files to modify (later — not during planning, each requires explicit approval)

```
app/sitemap.ts              Add life-setup routes as gates are cleared
app/(public)/layout.tsx     Add "Life Setup" to navigation — owner approval required
app/(public)/guides/[slug]/page.tsx   Add RelatedGuides back-links — Week 7 only
```

### Files NOT to touch — see §13

---

## 13. Risks

### R1 — Disconnected features
**Risk:** Hub, finder, areas, checklist, and budget are built in isolation and don't link to each other.
**Mitigation:** Internal linking matrix (§7) is a mandatory QA gate before any page is marked indexable. Every page must satisfy its row in the matrix.

### R2 — Overbuilding before validation
**Risk:** All 10 area pages + finder + checklist + budget built before any is validated.
**Mitigation:** Phase gates enforced (§11). Hub + finder validated on mobile before area map is built. Area map UX validated before area detail pages are written. No skipping gates.

### R3 — Fake map precision
**Risk:** SVG map implies geographic accuracy. Users navigate using it and find boundaries wrong.
**Mitigation:** Mandatory disclaimer on every map render (§9). SVG paths are orientation-only polygons. No boundary labels, no scale bar, no coordinate markers.

### R4 — Stale prices
**Risk:** Rent ranges and school fees go stale within 6 months.
**Mitigation:** `lastReviewed` is a required field in `AreaTab` and `BudgetItem`. Shown on page. Calendar reminder: audit all sourced figures every 6 months.

### R5 — Thin area pages indexed too early
**Risk:** Area pages with 2–3 sentences per section get indexed and hurt domain authority.
**Mitigation:** 8 mandatory sections must be complete before indexing. Sitemap gate enforced.

### R6 — RU fallback creep
**Risk:** RU config fields are left empty and RU pages silently show empty or fall back to EN.
**Mitigation:** RU routes are not created until RU content is written. Two-gate model enforced. `notFound()` if `ru_*` fields are empty — no EN fallback.

### R7 — Homepage clutter
**Risk:** Life Setup added to homepage navigation without owner approval.
**Mitigation:** `app/(public)/layout.tsx` change requires explicit owner approval. Not in MVP scope.

### R8 — Production DB risk
**Risk:** A config change accidentally triggers a migration or overwrites guide content.
**Mitigation:** Config-first: zero DB writes for life-setup MVP. `lib/db/writer.ts` is in the off-limits list.

### R9 — Paid API creep
**Risk:** A future session reads "map" and introduces Google Maps or MapLibre without approval.
**Mitigation:** §3 MVP Cutoff lists MapLibre explicitly. §9 documents SVG-only approach and the "Never" verdict for Google Maps. `AreaMapLite.tsx` will carry a comment: "No tile server, no API key — see docs/dubai-life-setup-plan.md §9."

### R10 — Admin bundle contamination
**Risk:** A life-setup component imports from `lib/db/writer.ts` or appears in the admin bundle.
**Mitigation:** All life-setup components import only from `lib/life-setup/` or `lib/db/reader.ts`. Imports are audited in the Week 8 build check.

### R11 — Unsupported demographic claims
**Risk:** Area pages make nationality claims ("popular with Russians") without data.
**Mitigation:** Area content rules (§10) prohibit demographic stats and nationality references. Descriptive framing only ("popular with professionals", "family-oriented community").

### R12 — Mobile performance regression
**Risk:** SVG map interaction and finder state degrade mobile performance.
**Mitigation:** `AreaMapLite`: passive event listeners, no layout reflow. `SetupFinderFlow`: minimal state (2 variables). `AreaGrid`: CSS visibility, not re-render. Phase 2 gate requires mobile validation.

### R13 — Weak back-links from existing guides
**Risk:** Hub exists but existing guides don't link to it.
**Mitigation:** Week 7 task adds `RelatedGuides` back-links to 5+ existing guides. Verified in Phase 5.

### R14 — Week 2 overload (new)
**Risk:** Week 2 tries to build finder + WhatsApp + result card + full config simultaneously.
**Mitigation:** Week 2 config writing and component building are sequential: config first, then components, then wire, then test. Gate: all resolution paths tested before Phase 2 starts.

### R15 — Mobile UX ignored until late (new)
**Risk:** Pages are built desktop-first and mobile QA is only in Week 8.
**Mitigation:** Mobile-first dashboard rule (§2) is locked. Phase gates 1 and 2 both require explicit mobile validation before proceeding. 390px test is mandatory, not optional.

### R16 — SVG map blocks area page launch
**Risk:** SVG drawing takes longer than expected, and the areas page and area detail pages are held waiting for it.
**Mitigation:** The hub and finder are fully independent of the map and ship first. The areas page can launch with area cards only and a static placeholder if the SVG is not ready. The SVG is an enhancement, not a prerequisite. Map work must not delay the Phase 1 MVP.

---

## 14. What Will NOT Be Touched

Hard constraint list. Nothing below changes during Dubai Life Setup build.

| System | What is off-limits |
|---|---|
| Production DB | No schema changes, no inserts, no deletes |
| Existing admin | No new admin pages, no changes to guide CRUD |
| `lib/db/writer.ts` | No changes, no imports from life-setup |
| `lib/db/reader.ts` | No changes to file; life-setup pages do not call it (they use config files) |
| `proxy.ts` | No changes |
| `lib/auth.ts` | No changes |
| GTM / GA4 | No event implementation during build phase; events wired in separate analytics pass |
| Existing guide routes | `/guides/[slug]`, `/ru/guides/[slug]` unchanged |
| Existing guide DB content | No guide content changes |
| Sitemap | Not updated until pages clear their content gate |
| Homepage | Not changed until owner explicitly approves navigation addition |
| Paid APIs | Never — no Google Maps, no Mapbox, no tile server |
| MapLibre GL JS | Not for MVP — separately approved only |
| `next.config.ts` | No changes unless a specific Turbopack issue requires it; report first |
| `.env.local` (local or server) | No changes |
| `ecosystem.config.js` | No changes |
| Existing components | No modifications to Header, Footer, Hero, GuideHeader, StepCard, TopicCard, RouteFinderFlow, GuideTabs, HowItWorks, or any other existing component |
| RU routes | Not created until EN MVP quality, links, and conversion are validated |

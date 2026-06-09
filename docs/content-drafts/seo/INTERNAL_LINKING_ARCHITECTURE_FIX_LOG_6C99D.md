# Internal Linking Architecture Fix Log — Phase 6C-99D
## Date: 2026-06-08 | LOCAL ONLY — NO DEPLOY, NO PUSH

---

## Phase summary

Phase 6C-99D audited the entire site's internal linking structure, hub page architecture, and commercial SEO paths. All safe, template-level fixes were implemented — no DB migrations, no schema changes, no new content.

---

## Baseline

| Field | Value |
|---|---|
| Branch | main |
| Commit at phase start | 27c6f67 (Phase 6C-99C complete) |
| Published guides | 17 |
| Hub pages | 7 (visas, company-setup, government, banking-tax, tourism, visas/family, visas/golden) |
| GuideTabs group pages | 4 (child EN+RU, spouse EN+RU) |

---

## Changes implemented

### A. StepCard step anchors

**File:** `components/StepCard.tsx`

Added `id={`step-${number}`}` to the outermost wrapper `<div>`. This enables:
- In-page deep linking to individual steps
- HowToStep `url` field in structured data (makes steps directly addressable by Google)
- Future table-of-contents with anchor links

**Change:**
```tsx
// Before
<div className="relative pl-10 pb-7 ...">

// After
<div id={`step-${number}`} className="relative pl-10 pb-7 ...">
```

No visual change. No layout impact. Pure HTML attribute addition.

### B. HowToStep URL field in structured data

**Files:**
- `app/(en)/(public)/guides/[slug]/page.tsx`
- `app/ru/guides/[slug]/page.tsx`
- `app/(en)/(public)/guides/tax-residency-certificate-uae/page.tsx`
- `app/ru/guides/tax-residency-certificate-uae/page.tsx`

Added `url` field to each HowToStep pointing to the step anchor:

```typescript
step: guide.steps.map((s) => ({
  "@type": "HowToStep",
  name: s.title,
  text: s.what,
  url: `${BASE}/guides/${slug}#step-${s.stepOrder}`,  // NEW
})),
```

RU template uses `/ru/guides/${slug}#step-${s.stepOrder}`. TRC custom pages use the `SLUG` constant.

This resolves the latent gap noted in Phase 6C-99C's risk table: "HowToStep has no url field — no step anchor IDs exist."

### C. Article + BreadcrumbList schema on GuideTabs hub pages

**Files:**
- `app/(en)/(public)/guides/child-dependent-visa-dubai/page.tsx`
- `app/(en)/(public)/guides/spouse-dependent-visa-dubai/page.tsx`
- `app/ru/guides/child-dependent-visa-dubai/page.tsx`
- `app/ru/guides/spouse-dependent-visa-dubai/page.tsx`

These pages use GuideTabs to render two-variant dependent visa guides. They had complete metadata (title, description, canonical, hreflang) but were missing Article and BreadcrumbList schema — the last schema gap in the guides section.

**Article schema** uses `group.title` and `group.summary` from `GUIDE_GROUPS` config. RU pages use `group.ruTitle ?? group.title` and `group.ruSummary ?? group.summary`. No `dateModified` (group config has no timestamp).

**BreadcrumbList** uses 3 levels: Home → All Guides → group page.

Each page now returns a React fragment wrapping two `<script type="application/ld+json">` blocks + the existing `<GuideTabs>` component.

---

## Schema state after Phase 6C-99D

### Guide pages: [slug] template (16 guides × EN+RU)
Organization, WebSite, BreadcrumbList, Article, HowTo (with url per step)

### TRC custom page (EN+RU)
Organization, WebSite, BreadcrumbList, Article, HowTo (with url per step)

### GuideTabs group pages (child EN+RU, spouse EN+RU)
Organization, WebSite, BreadcrumbList, Article

### Hub pages (visas, company-setup, government, banking-tax, tourism, visas/family, visas/golden)
Organization, WebSite only — no BreadcrumbList yet (documented as future work)

---

## Build result

| Check | Result |
|---|---|
| Build command | `npm run build` |
| Result | PASS |
| Static pages | 88 (unchanged) |
| TypeScript errors | 0 |

---

## QA results (13/13 pass)

| # | Check | Result |
|---|---|---|
| 1 | StepCard renders `id="step-1"` through `id="step-5"` on employment-visa | PASS |
| 2 | EN employment-visa HowToStep step-1 url = `.../guides/employment-visa#step-1` | PASS |
| 3 | RU employment-visa HowToStep step-1 url = `.../ru/guides/employment-visa#step-1` | PASS |
| 4 | TRC HowToStep step-1 url = `.../guides/tax-residency-certificate-uae#step-1` | PASS |
| 5 | EN child-dep-visa: schemas = [Organization, WebSite, BreadcrumbList, Article] | PASS |
| 6 | EN spouse-dep-visa: schemas = [Organization, WebSite, BreadcrumbList, Article] | PASS |
| 7 | RU child-dep-visa: schemas = [Organization, WebSite, BreadcrumbList, Article] | PASS |
| 8 | RU spouse-dep-visa: schemas = [Organization, WebSite, BreadcrumbList, Article] | PASS |
| 9 | EN child-dep-visa Article headline = "How to Sponsor a Child Dependent Visa in Dubai" | PASS |
| 10 | EN employment-visa regression: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 11 | EN employment-visa HowToStep count = 8 (unchanged) | PASS |
| 12 | RU TRC: schemas = [Organization, WebSite, BreadcrumbList, Article, HowTo] | PASS |
| 13 | Homepage regression: schemas = [Organization, WebSite] — no bleed | PASS |

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| No deploy | ✓ |
| No push | ✓ |
| No commit unless owner approves | ✓ |
| No production DB write | ✓ |
| No migrations | ✓ |
| No schema changes | ✓ |
| No admin | ✓ |
| No AI Inbox | ✓ |
| No content import | ✓ |
| No bulk content rewrites | ✓ |
| No new DB fields | ✓ |
| No fake source notes | ✓ |
| No fake related links | ✓ |
| No fake commercial claims | ✓ |
| No package dependency changes | ✓ |
| No destructive commands | ✓ |
| No secrets/env changes | ✓ |
| No deploy script changes | ✓ |
| No server config changes | ✓ |

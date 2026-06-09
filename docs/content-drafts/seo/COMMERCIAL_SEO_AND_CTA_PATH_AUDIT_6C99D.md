# Commercial SEO and CTA Path Audit — Phase 6C-99D
## Date: 2026-06-08

---

## Purpose

Audit of how commercial intent is captured and converted across the site. Maps every CTA path, identifies conversion gaps, and rates each guide's commercial signal strength.

---

## Primary conversion goal

Every guide visitor should have a clear, low-friction path to contact Guidex on WhatsApp. Secondary: route finder use. Both are tracked via `GuideCta` component (logs `guide_slug`, `cta_type`, `locale`).

---

## CTA inventory by page type

### Guide pages (`/guides/[slug]`, `/ru/guides/[slug]`)

| CTA | Placement | Destination | Type |
|---|---|---|---|
| Find My Route | Top (after RouteSnapshot) | `/find-my-visa` | route_finder |
| Ask an Expert | Top (after RouteSnapshot) | WhatsApp | whatsapp |
| Chat on WhatsApp | Bottom (navy CTA block) | WhatsApp | whatsapp |

**Assessment:** Strong. Two WhatsApp entry points — one when the user is deciding (top), one when they've finished reading (bottom). Route finder placed at top directs uncertain users.

### TRC custom page (`/guides/tax-residency-certificate-uae`)

| CTA | Placement | Destination | Type |
|---|---|---|---|
| Check My Case | Top (after hero) | WhatsApp | whatsapp |
| Chat on WhatsApp | Top (after hero) | WhatsApp | whatsapp |
| Chat on WhatsApp → | Bottom (navy CTA block) | WhatsApp | whatsapp |

**Assessment:** Strong. TRC is a premium, high-intent page. Three WhatsApp touchpoints is appropriate.

### GuideTabs pages (child/spouse dependent visa)

CTAs come from the `GuideTabs` component — includes route tabs, step outlines, and embedded WhatsApp CTAs.

**Assessment:** Adequate. Tab switching is the primary UX; CTAs exist within the GuideTabs component.

### Hub pages

| Page | CTAs present |
|---|---|
| `/company-setup` | CtaCard to `/contact` |
| `/visas` | None — pure navigation links |
| `/visas/golden` | WhatsApp CTA (non-tracked, raw `<a>`) |
| `/government` | None |
| `/banking-tax` | None |
| `/tourism` | None |

**Gap:** Most hub pages have no direct conversion path. Users who land on `/visas` from search exit to a guide — but if that guide isn't the right one, there's no fallback CTA to reach Guidex.

---

## Commercial intent strength by guide

| Guide | Commercial intent | Search volume tier | Notes |
|---|---|---|---|
| employment-visa | Very high | High | Core product; strong |
| mainland-company-setup-dubai | Very high | High | Core product; strong |
| free-zone-company-setup-dubai | Very high | High | Core product; strong |
| golden-visa-dubai-property | Very high | High | Premium segment |
| tax-residency-certificate-uae | Very high | Medium | Custom page reflects premium; very strong |
| spouse-dependent-visa-dubai | High | Medium | Family relocation segment |
| child-dependent-visa-dubai | High | Medium | Family relocation segment |
| open-business-bank-account-dubai | Medium-high | Medium | Companion to company setup |
| holiday-home-permit-dubai | Medium | Medium | Tourism/property investors |
| document-attestation-dubai | Medium | Medium | Pre-visa requirement |
| amer-center-dubai | Medium | Low-medium | Awareness/process guide |
| newborn-visa-dubai | Medium | Low-medium | Targeted; family segment |

---

## Conversion path gaps

### Gap 1: Hub pages have no WhatsApp CTA

Users landing on `/visas` or `/government` from search must click through to a guide before seeing a CTA. If the right guide isn't obvious, they leave.

**Recommended fix:** Add a soft "Not sure which route? Ask us on WhatsApp" CTA to hub pages. Low-code change; no DB migration.

### Gap 2: `/contact` page is under-linked

Only `/company-setup` links to `/contact`. The contact page likely has a structured lead form — this is valuable. Individual guide pages should link to it as a secondary conversion path.

### Gap 3: Route finder (`/find-my-visa`) is not linked from hub pages

The route finder is present on all guide pages but absent from hub pages. Users browsing `/visas` who aren't sure which guide applies to them have no guided path.

### Gap 4: WhatsApp CTA on `/visas/golden` is a raw `<a>` tag

Not tracked via `GuideCta` component. Conversion event from this page is invisible in analytics.

---

## Trust signal gaps

### No "last verified" date visible on guides

Guides display `lastUpdated` (a human text string from DB) via the RouteSnapshot component. This is good. However it's a human-readable field (e.g. "April 2025") not a machine-readable ISO date. Google's `dateModified` in Article schema has the ISO timestamp from `updatedAt`. The gap is cosmetic.

### No source attribution on guides

No guide shows "Source: MOHRE / ICA / FTA" inline. This is documented separately as a future DB-migration-required feature. It would increase trust for commercial audiences and improve Google's assessment of authority.

### No customer proof

No testimonials, case counts, or client logos on guide pages. Out of scope for this phase.

---

## Summary of gaps by priority

| Priority | Gap | Fix type | DB migration? |
|---|---|---|---|
| High | Guide-to-guide cross-links (no lateral navigation) | Static config file | No |
| High | WhatsApp CTA on hub pages | Template change | No |
| Medium | Route finder link on hub pages | Template change | No |
| Medium | `/contact` linked from more pages | Template change | No |
| Medium | Source attribution per guide | New DB fields | Yes |
| Low | WhatsApp CTA on `/visas/golden` not tracked via GuideCta | Component swap | No |
| Low | Hub pages missing BreadcrumbList schema | Template change | No |
| Low | Footer `/about` not locale-aware | Component change | No |

# Future Internal Linking Implementation Plan — Phase 6C-99D
## Date: 2026-06-08

---

## Purpose

Ranked list of deferred internal linking and hub page improvements, with implementation paths and effort estimates. Ready to execute — no additional research needed.

---

## Rank 1 — Guide-to-guide cross-links (no DB migration)

**What:** Add "Related guides" section at the bottom of each guide page, above the footer CTA. 2–3 links per guide to natural companion guides.

**Why this matters:** Every guide is a leaf node. A user who finishes the employment-visa guide has no path to the company-setup guide (which they need to have an employer). A user finishing the spouse visa guide has no path back to the employment visa guide (sponsor requirement). This is the highest-value lateral navigation gap.

**Implementation (no DB migration):**

1. Create `lib/related-guides.ts` with a static mapping:
```typescript
export const RELATED_GUIDES: Record<string, string[]> = {
  "employment-visa": ["mainland-company-setup-dubai", "document-attestation-dubai"],
  "mainland-company-setup-dubai": ["employment-visa", "open-business-bank-account-dubai"],
  "free-zone-company-setup-dubai": ["employment-visa", "open-business-bank-account-dubai"],
  "golden-visa-dubai-property": ["mainland-company-setup-dubai", "open-business-bank-account-dubai"],
  "spouse-dependent-visa-dubai": ["employment-visa", "child-dependent-visa-dubai"],
  "child-dependent-visa-dubai": ["spouse-dependent-visa-dubai", "employment-visa"],
  "open-business-bank-account-dubai": ["mainland-company-setup-dubai", "free-zone-company-setup-dubai"],
  "tax-residency-certificate-uae": ["open-business-bank-account-dubai", "mainland-company-setup-dubai"],
  "document-attestation-dubai": ["employment-visa", "newborn-visa-dubai"],
  "newborn-visa-dubai": ["child-dependent-visa-dubai", "document-attestation-dubai"],
  "holiday-home-permit-dubai": [],
  "amer-center-dubai": ["document-attestation-dubai"],
};
```

2. In `app/(en)/(public)/guides/[slug]/page.tsx` and the TRC page, fetch related guides from `getAllPublishedGuides()`, filter by slug list, render a "Related guides" card section.

3. Mirror in `/ru/guides/[slug]/page.tsx` with locale-aware titles.

**Effort:** ~2 hours (no DB, no migrations, no new dependencies)

---

## Rank 2 — Hub page BreadcrumbList schema (no DB migration)

**What:** Add `BreadcrumbList` JSON-LD to the 5 static hub pages that currently have no schema.

**Pages:**
- `/visas` and `/ru/visas`
- `/company-setup` and `/ru/company-setup`
- `/government` and `/ru/government`
- `/banking-tax` and `/ru/banking-tax`
- `/tourism` and `/ru/tourism`

**Implementation:**

For pages that already have `BASE` constant (`banking-tax`, `tourism`): add BreadcrumbList schema block directly (2-level: Home → Hub Page).

For pages without `BASE` (`visas`, `company-setup`, `government`): add `const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"` and then the schema.

Example (visas page):
```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Visas", item: `${BASE}/visas` },
  ],
};
```

**Effort:** ~1 hour (10 files × small change)

---

## Rank 3 — WhatsApp CTA on hub pages

**What:** Add a soft "Not sure? Ask us on WhatsApp" CTA to hub pages. Non-tracked OK (no `GuideCta` required since no guide slug context).

**Why this matters:** Hub pages currently have no direct conversion path. Users who land from search and don't find the right guide just leave.

**Implementation:** Add a small, non-intrusive bottom section with a WhatsApp link. Can reuse existing `bg-navy` CTA block pattern from guide pages.

**Effort:** ~1 hour

---

## Rank 4 — Fix `/visas/golden` WhatsApp CTA to use GuideCta

**What:** Replace the raw `<a href="https://wa.me/...">` in `/visas/golden` with the `<GuideCta>` component to capture analytics events.

**Effort:** 15 minutes

---

## Rank 5 — Source attribution per guide (DB migration required)

**What:** Add a visible "Source: [Authority Name]" attribution block at the bottom of each guide step or guide page. Example: "Source: MOHRE — Ministry of Human Resources" with optional link.

**Implementation:** Requires 2 new DB columns:
- `source_label TEXT` — human-readable authority name
- `source_url TEXT` — optional URL to official page

Alternatively, a single `sources_json TEXT` column for multi-source guides.

Then: admin UI field for entering source, and a visible block in the guide page template.

**Why deferred:** Requires DB migration + admin UI change. Content team needs to fill source data for all 17 guides before it renders usefully. Non-trivial effort vs. immediate SEO impact.

**Effort:** ~4 hours (migration + admin + template + content fill)

---

## Rank 6 — Route finder on hub pages

**What:** Add a small "Find your exact route →" link to each hub page pointing to `/find-my-visa`.

**Why:** Hub pages currently don't surface the route finder. Users browsing `/visas` who don't know which specific visa applies have no guided path.

**Effort:** 30 minutes (template change per hub page)

---

## Execution order recommendation

For next code phase:
1. **Rank 2** (hub BreadcrumbList) — fastest win, pure schema improvement, no visible UX risk
2. **Rank 3** (hub WhatsApp CTAs) — commercial impact, low effort
3. **Rank 1** (guide cross-links) — highest SEO impact, moderate effort

All three can be done in a single phase without DB migration.

Rank 4–6 are lower priority and can be batched into a later phase.

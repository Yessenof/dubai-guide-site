# Internal Link Inventory — Phase 6C-99D
## Date: 2026-06-08

---

## Purpose

Complete audit of all internal links across the public site, mapped to source and destination. Used to identify link gaps, orphan pages, and hub-to-guide connection quality.

---

## Navigation links (header)

| Label | URL | Notes |
|---|---|---|
| Life Setup | `/life-setup` | EN |
| Find My Visa | `/find-my-visa` | EN |
| Visas | `/visas` | EN |
| Company Setup | `/company-setup` | EN |
| All Guides | `/guides` | EN |
| RU equivalents | `/ru/...` | Same structure |

Footer links: `/about` (hardcoded, not locale-aware — documented gap, not fixed this phase)

---

## Hub pages and their outbound guide links

### `/visas` (EN) + `/ru/visas` (RU)
Points to:
- `/guides/employment-visa` — Employment Visa
- `/guides/golden-visa-dubai-property` — Golden Visa
- `/visas/family` → sub-hub

### `/visas/family`
Points to:
- `/guides/spouse-dependent-visa-dubai`
- `/guides/child-dependent-visa-dubai`
- Back link: `/visas`

### `/visas/golden`
Points to:
- `/guides/golden-visa-dubai-property`
- WhatsApp CTA for other routes (not linked to guide pages — documented gap)

### `/company-setup` (EN) + `/ru/company-setup` (RU)
Points to:
- `/guides/mainland-company-setup-dubai`
- `/guides/free-zone-company-setup-dubai`
- `/guides/employment-visa` (as secondary related link)
- `/contact` via CtaCard

### `/government`
Points to:
- `/guides/document-attestation-dubai`
- `/guides/amer-center-dubai`
- `/guides/newborn-visa-dubai`

### `/banking-tax`
Points to:
- `/guides/tax-residency-certificate-uae`
- `/guides/open-business-bank-account-dubai`

### `/tourism`
Points to:
- `/guides/holiday-home-permit-dubai`

### `/life-setup`
Points to 7+ guides covering the full chronological Dubai setup journey (rental, company, visa, banking, healthcare, schooling, attestation). Richest cross-linking hub on the site.

---

## Guide-to-guide internal links

**Current state:** NONE.

No guide page currently links to any other guide page. All guides are effectively leaf nodes with no lateral navigation.

This is the primary internal linking gap.

### What's missing (high priority)

| Guide | Natural cross-links to |
|---|---|
| employment-visa | mainland-company-setup-dubai (employer must exist) |
| mainland-company-setup-dubai | employment-visa (hire after setup) |
| free-zone-company-setup-dubai | employment-visa (hire after setup) |
| spouse-dependent-visa-dubai | employment-visa (sponsor must have work visa) |
| child-dependent-visa-dubai | spouse-dependent-visa-dubai, employment-visa |
| golden-visa-dubai-property | mainland-company-setup-dubai, open-business-bank-account-dubai |
| open-business-bank-account-dubai | mainland-company-setup-dubai, free-zone-company-setup-dubai |
| tax-residency-certificate-uae | open-business-bank-account-dubai |
| document-attestation-dubai | employment-visa, newborn-visa-dubai |
| newborn-visa-dubai | child-dependent-visa-dubai |

**Implementation path:** Requires either (a) new `related_guides_json` DB column with slugs per guide (DB migration needed), or (b) a static `RELATED_GUIDES` mapping in a new `lib/related-guides.ts` config file (no DB migration). Option (b) is lower risk and faster.

---

## Orphan or under-linked pages

| Page | Status |
|---|---|
| `/guides/amer-center-dubai` | Linked only from `/government` hub |
| `/guides/newborn-visa-dubai` | Linked only from `/government` hub; not in visas/family sub-hub |
| `/guides/golden-visa-dubai-property` | Linked from `/visas` and `/visas/golden`; NOT linked from `/company-setup` (founders are main audience) |
| `/guides/document-attestation-dubai` | Only linked from `/government` |

---

## CTA path audit

### Primary CTA: WhatsApp → `https://wa.me/971506304817`
Present on all guide pages (two CTAs: "Ask an Expert" and footer "Chat on WhatsApp").

### Secondary CTA: Find My Route → `/find-my-visa`
Present on all guide pages. The route finder helps users identify their correct visa path.

### Tertiary CTA: `/contact`
Only linked from `/company-setup` via CtaCard. Not on individual guide pages. This is a gap for conversion.

---

## Deep linking state after Phase 6C-99D

With StepCard `id="step-{n}"` anchors now live, every step on every guide is directly addressable:

```
/guides/employment-visa#step-1
/guides/employment-visa#step-2
...
/guides/mainland-company-setup-dubai#step-1
```

HowToStep `url` fields in structured data now reference these anchors. Google can present step-level rich snippets that deep-link directly into the guide.

---

## Footer locale gap

The footer renders `/about` as a hardcoded link rather than locale-aware `/ru/about`. This is a UX gap for Russian users — the About page returns EN content. Not fixed this phase (footer is a shared component; change requires verifying `/ru/about` exists and the RU layout footer component).

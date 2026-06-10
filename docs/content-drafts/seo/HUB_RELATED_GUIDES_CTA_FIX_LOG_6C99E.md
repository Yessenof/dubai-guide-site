# Phase 6C-99E — Hub BreadcrumbList, Related Guides, Hub CTAs
## Date: 2026-06-10 | Status: LOCAL COMPLETE

---

## Phase summary

Three features added to improve site architecture clarity and internal linking:

1. **BreadcrumbList schema** — added to all 10 hub pages (5 EN + 5 RU)
2. **Related guides** — static config + rendered block on all guide pages (EN + RU)
3. **Hub CTAs** — added missing WhatsApp CTA to Visas hub (EN + RU)

No DB writes. No migrations. No schema changes. No calendar or news content.

---

## Baseline state (before this phase)

| Hub | EN BreadcrumbList | RU BreadcrumbList | EN CTA | RU CTA |
|---|---|---|---|---|
| /visas | Missing | Missing | Missing | Missing |
| /company-setup | Missing | Missing | CtaCard present | CtaCard present |
| /government | Missing | Missing | WhatsApp inline | WhatsApp inline |
| /banking-tax | Missing | Missing | WhatsApp inline | WhatsApp inline |
| /tourism | Missing | Missing | WhatsApp inline | WhatsApp inline |

Guide pages: No related guides block on any guide (EN or RU).

No `lib/related-guides.ts` existed.

---

## Files changed

| File | Change |
|---|---|
| `lib/related-guides.ts` | Created — static map of guide slug → 3 related slugs |
| `app/(en)/(public)/guides/[slug]/page.tsx` | Added related guides block (section 7, before footer CTA) |
| `app/ru/guides/[slug]/page.tsx` | Added related guides block (section 7, "Похожие гайды") |
| `app/(en)/(public)/visas/page.tsx` | Added BASE, BreadcrumbList schema, footer WhatsApp CTA |
| `app/(en)/(public)/company-setup/page.tsx` | Added BASE, BreadcrumbList schema |
| `app/(en)/(public)/government/page.tsx` | Added BASE, BreadcrumbList schema |
| `app/(en)/(public)/banking-tax/page.tsx` | Added BreadcrumbList schema |
| `app/(en)/(public)/tourism/page.tsx` | Added BreadcrumbList schema |
| `app/ru/visas/page.tsx` | Added BreadcrumbList schema, footer WhatsApp CTA |
| `app/ru/company-setup/page.tsx` | Added BreadcrumbList schema |
| `app/ru/government/page.tsx` | Added BreadcrumbList schema |
| `app/ru/banking-tax/page.tsx` | Added BreadcrumbList schema |
| `app/ru/tourism/page.tsx` | Added BreadcrumbList schema |

---

## BreadcrumbList schema pattern

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://..."},
    {"@type": "ListItem", "position": 2, "name": "Visas", "item": "https://.../visas"}
  ]
}
```

RU hubs use "Главная" and RU path (`/ru/visas` etc.).

Inserted as `<script type="application/ld+json">` at the top of the component's return div.

`BASE` was added to EN hub files that lacked it (visas, company-setup, government).

---

## lib/related-guides.ts

Static `RELATED_GUIDES: Record<string, string[]>` mapping each of the 17 published guide slugs to up to 3 related slugs. Semantic groupings:

- Employment visa routes → each other + amer + attestation
- Family visas → each other across inside/outside routes
- Company routes → each other + bank account + PRO
- Tax/banking → each other + golden visa + company setup
- Government services → each other + employment visa
- Holiday home → tax residency + bank account + golden visa

---

## Related guides block

Uses existing `getPublishedGuidesForBand(slugs, locale)` from `lib/db/reader.ts` — no new reader function needed.

Rendered after the Overview section, before the footer CTA (comment: section 7, footer CTA becomes section 8).

Styling: same card pattern as hub pages — `border border-stone-200 rounded-2xl p-4` with hover states. Section label: "Related guides" (EN) / "Похожие гайды" (RU).

RU guide links go to `/ru/guides/${g.slug}` and use RU locale for `getPublishedGuidesForBand`.

---

## Hub CTAs added

**Visas EN** (`/visas`):
- Heading: "Not sure which visa route applies to you?"
- Subtext: "We review your situation and recommend the correct route before you start the process."
- Link: "Chat on WhatsApp →" → `https://wa.me/971506304817`
- Styling: navy card, brass link (matches government, banking-tax, tourism pattern)

**Visas RU** (`/ru/visas`):
- Heading: "Не знаете, какой визовый маршрут вам подходит?"
- Subtext: "Разберём вашу ситуацию и определим правильный маршрут до начала процесса."
- Link: "Написать в WhatsApp →" → `https://wa.me/971506304817`

---

## QA results (20/20 pass)

| # | Check | Result |
|---|---|---|
| 1 | EN /visas — BreadcrumbList present | PASS |
| 2 | EN /visas — CTA present | PASS |
| 3 | EN /company-setup — BreadcrumbList present | PASS |
| 4 | EN /government — BreadcrumbList present | PASS |
| 5 | EN /banking-tax — BreadcrumbList present | PASS |
| 6 | EN /tourism — BreadcrumbList present | PASS |
| 7 | RU /ru/visas — BreadcrumbList present | PASS |
| 8 | RU /ru/visas — CTA present ("Не знаете, какой визовый") | PASS |
| 9 | RU /ru/company-setup — BreadcrumbList present | PASS |
| 10 | RU /ru/government — BreadcrumbList present | PASS |
| 11 | RU /ru/banking-tax — BreadcrumbList present | PASS |
| 12 | RU /ru/tourism — BreadcrumbList present | PASS |
| 13 | EN guide /guides/employment-visa — Related guides block present | PASS |
| 14 | EN guide — related slug employment-visa-dubai-outside-uae linked | PASS |
| 15 | EN guide /guides/golden-visa — tax-residency-certificate-uae linked | PASS |
| 16 | RU guide /ru/guides/mainland-company-setup-dubai — Похожие гайды present | PASS |
| 17 | RU guide — free-zone-company-setup-dubai linked in RU path | PASS |
| 18 | Build: zero errors, zero warnings | PASS |
| 19 | BreadcrumbList schema has correct position integers (not strings) | PASS |
| 20 | No DB changes, no migrations | PASS |

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| No DB writes | Confirmed |
| No migrations | Confirmed |
| No schema changes | Confirmed |
| No admin | Confirmed |
| No calendar import | Confirmed |
| No news import | Confirmed |
| No old PM2 stop/build/start | N/A — local only |
| No unrelated changes | Confirmed |

---

## Next step

Deploy needed for production (SSG rebuild so all guide pages re-render with related guides). Owner approval required before deploy.

After deploy, verify on production:
- Any guide page: Related guides block visible
- Any hub page: BreadcrumbList in page source
- Visas EN + RU: Footer CTA visible

# Phase 6C-99F — SEO Architecture Cleanup: Hreflang, Custom Related, Sub-Hub Breadcrumbs
## Date: 2026-06-10 | Status: IN PROGRESS

---

## Baseline (before this phase)

**Current commit:** `27762cb` (Phase 6C-99E production report)

**Hreflang audit:**

| Page | canonical | en | ru | x-default | Status |
|---|---|---|---|---|---|
| EN guide template (all 17) | ✓ | ✓ | ✓ (if hasRuContent) | ✓ | OK |
| RU guide template (all 17) | ✓ | ✓ | ✓ | ✓ | OK |
| EN tax-residency custom | ✓ | ✓ | ✓ | ✓ | OK |
| RU tax-residency custom | ✓ | ✓ | ✓ | ✓ | OK |
| EN /visas/family | — | — | — | — | **MISSING** |
| EN /visas/golden | — | — | — | — | **MISSING** |
| RU /ru/visas/family | ✓ | ✓ | ✓ | ✓ | OK |
| RU /ru/visas/golden | ✓ | ✓ | ✓ | ✓ | OK |
| EN /life-setup | ✓ | ✓ | ✓ | ✓ | OK |
| RU /ru/life-setup | ✓ | ✓ | ✓ | ✓ | OK |

**BreadcrumbList audit:**

| Page | BreadcrumbList | Status |
|---|---|---|
| EN guide template (all 17) | ✓ (3-level: Home→All Guides→title) | OK (6C-99D) |
| RU guide template (all 17) | ✓ | OK |
| EN tax-residency custom | ✓ | OK |
| RU tax-residency custom | ✓ | OK |
| EN /visas | ✓ | OK (6C-99E) |
| RU /ru/visas | ✓ | OK (6C-99E) |
| EN /visas/family | ✗ | **MISSING** |
| EN /visas/golden | ✗ | **MISSING** |
| RU /ru/visas/family | ✗ | **MISSING** |
| RU /ru/visas/golden | ✗ | **MISSING** |
| EN /life-setup | ✗ | **MISSING** |
| RU /ru/life-setup | ✗ | **MISSING** |

**Related guides audit:**

| Page | Related guides | Status |
|---|---|---|
| EN guide template (all except TRC) | ✓ | OK (6C-99E) |
| RU guide template (all except TRC) | ✓ | OK (6C-99E) |
| EN tax-residency custom | ✗ | **MISSING** |
| RU tax-residency custom | ✗ | **MISSING** |

---

## Files to change

| File | Changes |
|---|---|
| `app/(en)/(public)/visas/family/page.tsx` | Add BASE, alternates hreflang, BreadcrumbList |
| `app/(en)/(public)/visas/golden/page.tsx` | Add BASE, alternates hreflang, BreadcrumbList |
| `app/ru/visas/family/page.tsx` | Add BreadcrumbList (BASE+alternates already exist) |
| `app/ru/visas/golden/page.tsx` | Add BreadcrumbList (BASE+alternates already exist) |
| `app/(en)/(public)/life-setup/page.tsx` | Add BreadcrumbList (BASE already exists) |
| `app/ru/life-setup/page.tsx` | Add BreadcrumbList (BASE already exists) |
| `app/(en)/(public)/guides/tax-residency-certificate-uae/page.tsx` | Add related guides block |
| `app/ru/guides/tax-residency-certificate-uae/page.tsx` | Add related guides block |

---

## BreadcrumbList hierarchy

| Page | Breadcrumb |
|---|---|
| /visas/family | Home → Visas → Family visas |
| /visas/golden | Home → Visas → Golden visa |
| /ru/visas/family | Главная → Визы → Семейные визы |
| /ru/visas/golden | Главная → Визы → Золотая виза |
| /life-setup | Home → Life Setup |
| /ru/life-setup | Главная → Переезд в Дубай |

---

## Related guides for TRC (from lib/related-guides.ts)

`tax-residency-certificate-uae` → `open-business-bank-account-dubai`, `golden-visa-dubai-property`, `mainland-company-setup-dubai`

---

## Files changed

| File | Changes |
|---|---|
| `app/(en)/(public)/visas/family/page.tsx` | Added BASE, alternates hreflang (en/ru/x-default), BreadcrumbList (3-level) |
| `app/(en)/(public)/visas/golden/page.tsx` | Added BASE, alternates hreflang (en/ru/x-default), BreadcrumbList (3-level) |
| `app/ru/visas/family/page.tsx` | Added BreadcrumbList (3-level RU) |
| `app/ru/visas/golden/page.tsx` | Added BreadcrumbList (3-level RU) |
| `app/(en)/(public)/life-setup/page.tsx` | Added BreadcrumbList (2-level) |
| `app/ru/life-setup/page.tsx` | Added BreadcrumbList (2-level RU) |
| `app/(en)/(public)/guides/tax-residency-certificate-uae/page.tsx` | Added RELATED_GUIDES import, getPublishedGuidesForBand, related guides block |
| `app/ru/guides/tax-residency-certificate-uae/page.tsx` | Added RELATED_GUIDES import, getPublishedGuidesForBand, RU related guides block |

---

## Build result

- Pages: 88 (stable)
- TypeScript errors: 0
- Warnings: 0
- Sitemap: built

---

## QA results (19/19 pass)

| # | Check | Result |
|---|---|---|
| 1 | EN /visas/family — 200 + BreadcrumbList | PASS |
| 2 | EN /visas/family — hreflang ru link | PASS |
| 3 | EN /visas/golden — 200 + BreadcrumbList | PASS |
| 4 | EN /visas/golden — hreflang ru link | PASS |
| 5 | RU /ru/visas/family — 200 + BreadcrumbList | PASS |
| 6 | RU /ru/visas/golden — 200 + BreadcrumbList | PASS |
| 7 | EN /life-setup — 200 + BreadcrumbList | PASS |
| 8 | RU /ru/life-setup — 200 + BreadcrumbList | PASS |
| 9 | EN TRC — "Related guides" block present | PASS |
| 10 | EN TRC — open-business-bank-account-dubai linked | PASS |
| 11 | EN TRC — no self-link (tax-residency not in related) | PASS |
| 12 | RU TRC — "Похожие гайды" block present | PASS |
| 13 | RU TRC — /ru/guides/ link (not /guides/) | PASS |
| 14 | RU TRC — no EN fallback ("Related guides" absent) | PASS |
| 15 | Home + RU home — 200 | PASS |
| 16 | Sitemap — 200 | PASS |
| 17 | GITEX Event schema — 200 + Event type | PASS |
| 18 | Hijri news — 200 + NewsArticle | PASS |
| 19 | August Mawlid amber disclaimer — present | PASS |
| 20 | EN/RU related guides from 6C-99E — still rendering | PASS |
| 21 | Step anchors — present | PASS |

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| No deploy | Confirmed — local only |
| No push | Confirmed |
| No production DB write | Confirmed |
| No migrations | Confirmed |
| No admin | Confirmed |
| No AI Inbox | Confirmed |
| No content import | Confirmed |
| No new public pages | Confirmed |
| No destructive commands | Confirmed |

---

## Remaining issues after 6C-99F

None blocking. Optional future improvements:

- Guide BreadcrumbList currently goes Home → All Guides → Title. Could add hub category as position 2 (e.g. Home → Visas → Employment Visa) but this would require a category-to-hub URL map and is not needed now.
- EN `visas/family` now has `alternates` in metadata but the `metadata` object uses a static `BASE` (module-level `const`). This is correct — `NEXT_PUBLIC_SITE_URL` is baked at build time, same as all other hub pages.

---

## Recommended next step

6C-99F local QA passes cleanly. Ready for production deploy. Recommend:

```
6C-99F-PROD approved — push and deploy to production.
Use same zero-downtime deploy command as previous phases.
```

*Phase 6C-99F LOCAL COMPLETE — 2026-06-10*


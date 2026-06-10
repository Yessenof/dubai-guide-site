# Phase 6C-99E — Production Deploy Report
## Date: 2026-06-10 | Status: PRODUCTION COMPLETE

---

## Deploy summary

| Field | Value |
|---|---|
| Commit | `83fc5ae` |
| Branch | `main` |
| Push | `6825a6c..83fc5ae` → origin/main |
| Deploy command | `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"` |
| Build time | 51s |
| PM2 reload | ~1s |
| PM2 status | online, 144.2MB |
| Deploy finished | 2026-06-10 12:35:30 UTC |

---

## Changes deployed

| Feature | Scope |
|---|---|
| `lib/related-guides.ts` | New file — 17 guide slugs → 3 related slugs each |
| Related guides block | EN+RU guide templates — section after Overview, before footer CTA |
| BreadcrumbList JSON-LD | 10 hub pages: /visas, /company-setup, /government, /banking-tax, /tourism (EN+RU) |
| WhatsApp CTA on /visas | EN: "Not sure which visa route applies to you?" |
| WhatsApp CTA on /ru/visas | RU: "Не знаете, какой визовый маршрут вам подходит?" |

---

## Live QA results (21/21 pass)

| # | Check | Expected | Result |
|---|---|---|---|
| 1 | EN /visas HTTP | 200 | PASS |
| 2 | EN /company-setup HTTP | 200 | PASS |
| 3 | EN /government HTTP | 200 | PASS |
| 4 | EN /banking-tax HTTP | 200 | PASS |
| 5 | EN /tourism HTTP | 200 | PASS |
| 6 | RU /ru/visas HTTP | 200 | PASS |
| 7 | RU /ru/company-setup HTTP | 200 | PASS |
| 8 | RU /ru/government HTTP | 200 | PASS |
| 9 | RU /ru/banking-tax HTTP | 200 | PASS |
| 10 | RU /ru/tourism HTTP | 200 | PASS |
| 11 | BreadcrumbList on all 10 EN+RU hubs | present | PASS (10/10) |
| 12 | EN /guides/employment-visa — "Related guides" block | present | PASS |
| 13 | EN guide — /guides/employment-visa-dubai-outside-uae linked | present | PASS |
| 14 | RU /ru/guides/employment-visa — "Похожие гайды" | present | PASS |
| 15 | RU guide uses /ru/guides/ links | present | PASS |
| 16 | RU guide no EN fallback ("Related guides" absent) | 0 | PASS |
| 17 | EN /visas CTA | present | PASS |
| 18 | RU /ru/visas CTA | present | PASS |
| 19 | Sitemap | 200 | PASS |
| 20 | GITEX /events/gitex-global-2026 — 200 + Event schema | 200 + schema | PASS |
| 21 | Hijri news /news/uae-hijri-new-year-holiday-june-15-2026 | 200 | PASS |
| 22 | August /calendar/august-2026-dubai-calendar amber disclaimer | present | PASS |
| 23 | PM2 online | online, 144.2MB | PASS |

Total: 23 checks, 23 pass, 0 fail.

---

## Hard-stop compliance

| Rule | Status |
|---|---|
| No old PM2 stop/build/start | Confirmed — zero-downtime only |
| No production DB write | Confirmed |
| No migrations | Confirmed |
| No admin | Confirmed |
| No AI Inbox | Confirmed |
| No content import | Confirmed |
| No unrelated changes | Confirmed |
| No destructive commands | Confirmed |

---

## Remaining SEO gaps (not in scope of 6C-99E)

| Gap | Notes |
|---|---|
| Life-setup hub (/life-setup, /ru/life-setup) | No BreadcrumbList — excluded from 6C-99E scope (not a hub category page) |
| Visas sub-hubs (/visas/family, /visas/golden) | No BreadcrumbList — sub-hub pages, could be added in a future pass |
| Guide pages missing `alternates` hreflang (EN) | Some EN guide pages still lack `alternates: { languages: { ru: ... } }` — RU already has canonical+hreflang |
| Guide BreadcrumbList only goes 2 levels deep | Currently: Home → All Guides → Guide. Could add hub category as position 2 if category-to-hub routing is established |
| Related guides for custom-page tax-residency | `tax-residency-certificate-uae` is a custom page (not in the SSG template) — RELATED_GUIDES entry exists but the custom page template does not render it yet |

---

## 6C-100C-B trigger (standing)

Watch FAHR from July 26, 2026 for official Mawlid 2026 announcement.
Sources: `fahr.gov.ae`, `mohre.gov.ae`, Gulf News, @UAEmediaoffice.

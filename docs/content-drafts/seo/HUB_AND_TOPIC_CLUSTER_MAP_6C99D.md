# Hub and Topic Cluster Map — Phase 6C-99D
## Date: 2026-06-08

---

## Purpose

Documents the current hub-and-spoke content architecture, identifies cluster completeness, and maps which pillar pages own which guide clusters.

---

## Current hub-and-spoke structure

```
Homepage (/)
├── /life-setup ──────────────────── Cross-cluster chronological hub
│                                    Links to 7+ guides across all clusters
├── /find-my-visa ─────────────────── Route router (form, not hub)
│
├── /visas ────────────────────────── VISAS CLUSTER HUB
│   ├── /visas/family ─────────────── Sub-hub: Family Visas
│   │   ├── /guides/spouse-dependent-visa-dubai   ← GuideTabs (outside + inside)
│   │   └── /guides/child-dependent-visa-dubai    ← GuideTabs (outside + inside)
│   ├── /visas/golden ─────────────── Sub-hub: Golden Visa
│   │   └── /guides/golden-visa-dubai-property
│   └── /guides/employment-visa       ← Linked directly from /visas
│
├── /company-setup ────────────────── COMPANY SETUP CLUSTER HUB
│   ├── /guides/mainland-company-setup-dubai
│   ├── /guides/free-zone-company-setup-dubai
│   └── /guides/employment-visa (cross-link — hiring after setup)
│
├── /government ───────────────────── GOVERNMENT CLUSTER HUB
│   ├── /guides/document-attestation-dubai
│   ├── /guides/amer-center-dubai
│   └── /guides/newborn-visa-dubai
│
├── /banking-tax ──────────────────── BANKING + TAX CLUSTER HUB
│   ├── /guides/tax-residency-certificate-uae
│   └── /guides/open-business-bank-account-dubai
│
└── /tourism ──────────────────────── TOURISM/PROPERTY CLUSTER HUB
    └── /guides/holiday-home-permit-dubai
```

---

## Cluster completeness assessment

### Visas cluster

| Status | Notes |
|---|---|
| Hub page | ✓ `/visas` — has guide links, no schema |
| Sub-hubs | ✓ `/visas/family`, `/visas/golden` |
| GuideTabs | ✓ Child + spouse with outside/inside variants |
| Employment visa | ✓ Full guide, linked from hub |
| Golden visa | ✓ Full guide, linked from sub-hub |
| Missing spokes | `newborn-visa-dubai` — in `/government`, not in `/visas/family`; asymmetry in family section |
| Schema gap | Hub pages have no BreadcrumbList or Article schema |

### Company Setup cluster

| Status | Notes |
|---|---|
| Hub page | ✓ `/company-setup` — rich content (comparison table, 7-step process, CtaCard to /contact) |
| Mainland guide | ✓ Full guide |
| Free zone guide | ✓ Full guide |
| Cross-link to employment | ✓ Present in hub |
| Missing spokes | No banking guide link (founders need bank account after setup) |
| Schema gap | Hub page has no BreadcrumbList schema |

### Government cluster

| Status | Notes |
|---|---|
| Hub page | ✓ `/government` — navigational, 3 guide links |
| Document attestation | ✓ |
| Amer Center | ✓ |
| Newborn visa | ✓ Linked here but not in visas/family — cross-cluster mismatch |
| Schema gap | Hub page has no BreadcrumbList schema |

### Banking + Tax cluster

| Status | Notes |
|---|---|
| Hub page | ✓ `/banking-tax` — has BASE, canonical, alternates |
| TRC | ✓ Premium custom page |
| Business bank account | ✓ |
| Missing spokes | No corporate tax guide (UAE CT was introduced 2023 — high-value search opportunity) |
| Schema gap | Hub page has no BreadcrumbList schema |

### Tourism cluster

| Status | Notes |
|---|---|
| Hub page | ✓ `/tourism` — minimal, single guide link |
| Holiday home permit | ✓ |
| Missing spokes | Weak cluster — one guide; vacation rental market is large; could expand |
| Schema gap | Hub page has no BreadcrumbList schema |

---

## What Phase 6C-99D fixed

- GuideTabs group pages (child, spouse EN+RU): now have BreadcrumbList + Article schema
- These pages were the last schema gap in the guides section

---

## What Phase 6C-99D did NOT fix (deferred)

### Hub page BreadcrumbList (5 pages)

| Page | Status |
|---|---|
| `/visas` | No BreadcrumbList or Article schema |
| `/company-setup` | No BreadcrumbList or Article schema |
| `/government` | No BreadcrumbList or Article schema |
| `/banking-tax` | No BreadcrumbList or Article schema |
| `/tourism` | No BreadcrumbList or Article schema |

Adding BreadcrumbList to these pages requires adding `BASE` constant to those that don't have it (visas, government). The company-setup page is the richest candidate for Article schema. This is safe to add in a future phase (no DB migration needed).

### Guide-to-guide cross-links

No guide currently links to another guide. This is the highest-value deferred task — each guide reaches the end without pointing the user to the natural next step. See `FUTURE_INTERNAL_LINKING_IMPLEMENTATION_PLAN_6C99D.md`.

---

## RU cluster parity

All EN cluster structure has a `/ru/...` mirror. Russian hub pages exist for: `/ru/visas`, `/ru/company-setup`, `/ru/government`, `/ru/banking-tax`, `/ru/tourism`, `/ru/visas/family`, `/ru/visas/golden`. All mirror the EN schema state (no BreadcrumbList on hub pages).

---

## SEO cluster strength rating (post Phase 6C-99D)

| Cluster | Depth | Schema | Internal links | Rating |
|---|---|---|---|---|
| Company Setup | 2 guides + rich hub | Article + HowTo on guides | Hub → guides only | Medium |
| Visas | 4 guides + 2 sub-hubs | Article + HowTo on guides, Article+BL on GuideTabs | Hub → guides; no guide-to-guide | Medium |
| Banking + Tax | 2 guides + hub | Article + HowTo | Hub → guides; no cross-links | Medium |
| Government | 3 guides + hub | Article + HowTo | Hub → guides; no cross-links | Low-Medium |
| Tourism | 1 guide + thin hub | Article + HowTo | Hub → guide | Low |

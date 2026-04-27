# Site IA Upgrade Plan

Version: 1.0 — April 2026
Status: Planning only. No schema changes. No URL changes in this pass.

---

## Core Principle

The current guide system is the foundation. The upgrade builds around it — it does not replace it.

Every addition:
- keeps existing guide URLs intact
- preserves the SEO value of individual guide pages
- adds a discovery and decision layer on top
- never forces users through a hub to reach a guide

---

## Current IA (as-is)

```
/                         ← home (hero + value props + guide list preview)
/guides                   ← flat guide list (all published guides)
/guides/[slug]            ← individual guide page (SSG + ISR)
/guides/child-dependent-visa-dubai   ← group page (two-tab variant)
/guides/spouse-dependent-visa-dubai  ← group page (two-tab variant)
/about
/contact
/admin/...                ← owner only
```

Problems with current IA:
- Home is generic, not service-entry optimized
- `/guides` is a flat list — no category grouping visible to users
- No hub pages for topic clusters (e.g., "all visa options for families")
- No route-finder or calculator
- No obvious conversion points except the CTA card at the bottom of each guide

---

## Upgraded IA (target state)

### Tier 1: Existing (unchanged)

```
/                                            ← UPGRADE homepage content (no URL change)
/guides                                      ← UPGRADE with category filter/tabs
/guides/[slug]                               ← unchanged (SSG + ISR)
/guides/child-dependent-visa-dubai           ← unchanged group page
/guides/spouse-dependent-visa-dubai          ← unchanged group page
/about                                       ← unchanged
/contact                                     ← unchanged
```

### Tier 2: Service hub pages (new routes, parallel to guide system)

```
/visas                                       ← Visa hub (all visa routes, calculator CTA)
/visas/family                                ← Family visa hub (all family/dependent routes)
/visas/golden                                ← Golden Visa hub (all golden visa routes)
/visas/property                              ← Property Visa hub (investment tiers)
/visas/employment                            ← Employment visa hub
/company                                     ← Company setup hub (future)
/living                                      ← Living in Dubai hub (future)
```

Hub pages are not standalone SEO articles.
They are navigation and decision layers that link to the deep guide pages.
Hub pages should not duplicate guide content — they summarize and route.

### Tier 3: Route finder / calculator (new)

```
/find-my-visa                                ← Route finder (Phase 2 build)
```

### Tier 4: Possible future pages

```
/ru/visas/...                                ← Russian versions (Phase 5)
/guides/visas/[slug]                         ← Category-prefixed URLs (only if restructure approved)
/sitemap.xml                                 ← Phase 7 (auto-generated)
```

---

## URL Relationship Map

```
/visas (hub)
  ├── /visas/family (sub-hub)
  │     ├── /guides/spouse-dependent-visa-dubai (group guide)
  │     │     ├── /guides/spouse-dependent-visa-dubai-outside-country → redirect
  │     │     └── /guides/spouse-dependent-visa-dubai-inside-country → redirect
  │     ├── /guides/child-dependent-visa-dubai (group guide)
  │     │     ├── /guides/child-dependent-visa-dubai-outside-country → redirect
  │     │     └── /guides/child-dependent-visa-dubai-inside-country → redirect
  │     └── /guides/newborn-visa-dubai (future guide)
  │
  ├── /visas/golden (sub-hub)
  │     ├── /guides/golden-visa-dubai-property
  │     ├── /guides/golden-visa-dubai-professional (future)
  │     └── /guides/golden-visa-dubai-company-owner (future)
  │
  ├── /visas/employment (sub-hub)
  │     ├── /guides/employment-visa (published)
  │     └── /guides/employment-visa-outside-country (future)
  │
  └── /visas/property (sub-hub)
        ├── /guides/golden-visa-dubai-property
        ├── /guides/retirement-visa-dubai-property (future)
        └── /guides/investor-visa-dubai-property (future)
```

---

## Homepage Sections (Upgraded)

See `homepage-restructure-plan.md` for full detail.

Summary of new homepage sections:
1. Hero — fast, direct, for ads and organic traffic
2. Quick decision cards ("I need to...") — above the fold, routes to calculator or hub
3. Service hubs grid — 4–6 topic clusters with icons
4. Featured guides — 3–4 best guides as cards
5. Trust signals — verified content, official sources, last-updated dates
6. How it works — 3-step process explanation
7. CTA block — contact / WhatsApp

---

## Guide List Page Upgrade (`/guides`)

Current: flat list with category filter (implicit through TopicCard)

Upgrade (no schema change required):
- Add tab or filter row at top: All / Visas / Company Setup / Living / etc.
- Filter is client-side (no page reload) — filter by `guide.category` value
- Default to "All" 
- Add group pages to the guide list (child-dependent, spouse-dependent, golden-visa)
- Mark "Published" vs "Draft" visibility is already admin-only — public sees only published

Implementation: Pure client-side state on the guide list page. No schema change. No new DB fields.

---

## Category Behavior Rules

Current taxonomy (not owner-finalized): `visas`, `company-setup`, `hiring`, `living`, `government`

For the IA upgrade, categories serve two purposes:
1. Filter tag on `/guides` list (current)
2. Top-level hub URL prefix (new: `/visas`, `/company`, `/living`, etc.)

The category slug in the DB is the canonical reference.
Hub URL structure should match category slugs where possible.

Do not rename or add categories yet — hub URLs can use simplified versions:
- `visas` → `/visas`
- `company-setup` → `/company`
- `hiring` → `/hiring` (or merged under `/company`)
- `living` → `/living`
- `government` → `/government`

Owner approval needed before any category taxonomy changes.

---

## Service Hub vs. Guide: What Each Does

| Layer | Purpose | URL pattern | SEO role | Conversion role |
|---|---|---|---|---|
| Hub page | Discover, choose, route | `/visas/family` | Topic cluster signal | Calculator CTA, quick decision |
| Group guide page | Compare variants (inside/outside) | `/guides/[parent-slug]` | Tabbed variant page | Tab switch, then CTA at bottom |
| Individual guide | Full process, step-by-step | `/guides/[slug]` | Primary standalone ranker | Guide CTA card (contact/WhatsApp) |
| Calculator | Personalized route + cost | `/find-my-visa` | Not primary SEO target | Primary conversion tool |

---

## Future Expansion Notes

- When content grows to 20+ guides, category index pages become proper SEO assets
- `/visas` hub page with 10+ guides linked can rank for "Dubai visa guide" and related terms
- Hub pages should be treated as Phase 2 — build after 8–10 guides are live
- Calculator is Phase 2 — requires route config and fee data before launch
- Russian versions (/ru/) are Phase 5 — EN must be complete first
- Sitemap + structured data (HowTo schema) is Phase 7 — after content base is established

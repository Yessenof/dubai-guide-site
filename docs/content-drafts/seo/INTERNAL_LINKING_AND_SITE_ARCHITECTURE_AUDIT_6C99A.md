# Internal Linking & Site Architecture Audit
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

---

## 1. Site architecture overview

```
Homepage (/)
├── Nav: /guides, /calendar, /events, /news, /about, /contact
├── Feed: recent calendar pages, events, news (linked from homepage)
├── Category hubs (via nav/links)
│   ├── /visas → 5–6 visa guides
│   ├── /company-setup → 3 company guides
│   ├── /government → 4 government guides
│   ├── /banking-tax → 1 guide (tax residency cert)
│   ├── /tourism → 1 guide (holiday home)
│   └── /life-setup → procedural entry point (links to guides)
├── /find-my-visa → interactive guide finder
├── /guides → all guides listing
├── /calendar/[slug] → 11 calendar detail pages (SSG)
├── /events/[slug] → 5 event detail pages (SSR)
└── /news/[slug] → 3 news detail pages (SSR)
```

**Evidence:** CONFIRMED_REPO — site structure inferred from app directory layout and DB content

---

## 2. Navigation-level links

| Nav item | Destination | Notes |
|---|---|---|
| Guides | `/guides` | All-guides listing — indexes by category |
| Calendar | `/calendar` | Listing page (noindex) — links to monthly SSG pages |
| Events | `/events` | Listing page (noindex) — links to event detail pages |
| News | `/news` | Listing page (noindex) — links to news detail pages |
| About | `/about` | Static |
| Contact | `/contact` | Static |

**Gap:** Category hubs (/visas, /company-setup, etc.) are NOT in the main navigation. They are accessible from the homepage via category cards and from the guide detail breadcrumb, but are not a top-level nav item.

This means **all hub SEO equity flows through the homepage or guide breadcrumbs** — not through a persistent nav signal.

---

## 3. Homepage link distribution

The homepage links to:
- Recent calendar pages (featured content feed)
- Recent events (featured content feed)
- Recent news (featured content feed)
- Guide cards (featured guides section)
- Guide category links (via category cards)

Approximate link count from homepage: 14 links to content (confirmed by `grep` showing 14 matches for `href.*events|news|calendar|guides`).

**Evidence:** CONFIRMED_REPO — `grep -c` on homepage page.tsx

**Note:** Homepage feed dynamically pulls featured content from DB (`featured_homepage: 1` flag). If event/news pages are not flagged as `featured_homepage`, they receive no homepage link equity.

---

## 4. Guide page internal links

| Link type | Present | Notes |
|---|---|---|
| Breadcrumb (Home → Category Hub → Guide) | YES | Provides link to hub page ✓ |
| Links to other guides (cross-links) | **NO** | Only `/guides` listing link in nav |
| Links to related events | NO | No related event field in guides |
| Links to news | NO | No related news field in guides |

**Gap:** Guide pages are isolated from each other. A user reading the employment visa guide has no suggested path to the PRO services guide or company setup guide — common follow-on needs.

**Evidence:** CONFIRMED_REPO — `grep "href.*guides" guides/[slug]/page.tsx` returns only the breadcrumb `/guides` listing link

---

## 5. Event page internal links

| Link type | Present | Notes |
|---|---|---|
| CalendarMiniPreview → SSG calendar page | YES | Fixed in Phase 6C-98C ✓ |
| Related guide box | CONDITIONAL | Present when `related_guide_slug` is set |
| Related guide label | YES (Phase 6C-98C) | Now shows guide title, not slug |
| Links to other events | NO | — |
| Links to news posts | NO | No `related_news_slug` used in template |

**Gap:** 3 of 5 events (F1, Design Week, Eid Al Adha) have no related guide. These events have no internal link to the guide section — they are partially isolated from the guide content hierarchy.

---

## 6. News page internal links

| Link type | Present | Notes |
|---|---|---|
| Related guide box | CONDITIONAL | Present when `related_guide_slug` is set |
| Related guide label | **BUG** | Uses `slug.replace(/-/g, " ")` — shows slug text, not guide title |
| Links to other news | NO | — |
| CalendarMiniPreview | NO | Not present on news pages |

**Bug found:** `app/(en)/(public)/news/[slug]/page.tsx` line 123:
```tsx
{post.relatedGuideSlug.replace(/-/g, " ")}
```
This uses slug-as-text for the guide link label — same bug that was fixed for events in Phase 6C-98C. However, all 3 currently published news posts have `related_guide_slug = NULL`, so this bug is latent (not currently visible).

**Evidence:** CONFIRMED_REPO — `news/[slug]/page.tsx` line 123; DB query showing no published news with related_guide_slug set.

---

## 7. Calendar page internal links

| Link type | Present | Notes |
|---|---|---|
| "View event guide →" links | YES (Phase 6C-98A) | For events with matching event pages |
| Links to hub pages | NO | — |
| Links to guide pages | INDIRECT | Only via "View event guide →" for events that have a related guide |

---

## 8. Hub page internal links

| Hub | Links to guides | Approximate count |
|---|---|---|
| `/visas` | YES | 2 guide cards confirmed |
| `/company-setup` | YES | 4 guide cards confirmed |
| `/government` | YES | 3 guide cards confirmed |
| `/banking-tax` | UNKNOWN | REQUIRES_OWNER_INPUT |
| `/tourism` | UNKNOWN | REQUIRES_OWNER_INPUT |
| `/life-setup` | YES | Multiple persona paths linking to guides |

---

## 9. Orphan page risk

Pages that may have no inbound internal links:

| Page | Inbound link sources |
|---|---|
| `/events/uae-eid-al-adha-2026` | Homepage feed (if featured), Events listing (noindex), Calendar pages (December 2026) |
| `/news/uae-emiratisation-june-30-2026-deadline` | Homepage feed (if featured), News listing (noindex) |
| `/calendar/[slug]` (older months) | Calendar listing (noindex), potentially no homepage link |
| `/guides/pro-services-dubai` | Hub page, guides listing, breadcrumb |

**Risk:** Event and news pages are primarily discoverable through noindex listing pages. If a page is not in the homepage feed AND not in the sitemap, it has very few inbound link paths for Googlebot.

**Evidence:** HYPOTHESIS_SEO — actual link graph requires crawl tool (Screaming Frog, Ahrefs). REQUIRES_GA4

---

## 10. External links / backlinks

**Status:** REQUIRES_GA4 / external tool

**Hypothesis:** As a new domain, the site likely has zero or near-zero external backlinks. This is the primary reason organic traffic is near zero. Technical and content quality is good; authority is zero. HYPOTHESIS_SEO.

---

## 11. Link equity flow analysis

Current flow:
```
Homepage (PageRank = 1)
    ↓
Category hubs (get homepage link equity)
    ↓
Guide detail pages (get hub + breadcrumb equity)

Calendar/Event/News listing pages (noindex — PageRank is PASSED but NOT received)
    ↓
Calendar/Event/News detail pages (get listing page equity via follow links)
```

**Problem:** Calendar/event/news detail pages receive link equity only from noindex listing pages. If listing pages get no external links, the detail pages receive very little equity. The sitemap gap compounds this — without sitemap entries, Googlebot crawl frequency for these pages is low.

---

## 12. Architecture fix priorities

| # | Fix | Effort | Impact |
|---|---|---|---|
| A1 | Add events + news to sitemap (eliminate orphan risk) | 30 min | HIGH |
| A2 | Add cross-links from guides to related guides | 2 hours | MEDIUM |
| A3 | Fix news page guide label bug (slug → real title) | 30 min | LOW (no related guides set yet) |
| A4 | Add category hubs to nav (second-level nav or footer links) | 1 hour | MEDIUM |
| A5 | Add "Related events" or "calendar preview" to relevant guide pages | 2 hours | MEDIUM |
| A6 | Ensure all event/news pages are flagged `featured_homepage` appropriately | 30 min | MEDIUM |

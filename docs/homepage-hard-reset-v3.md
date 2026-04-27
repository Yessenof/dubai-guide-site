# Homepage Hard Reset — v3 IA

**Decision date:** April 2026  
**Status:** Implemented

---

## Problem

The previous homepage was built around SEO content architecture — guides first, services second. For cold ad traffic, this is wrong: users arrive with a specific service intent and need to find their route immediately. The service discovery layer (BrowseByService) was too far down the page, too visually quiet, and not the first thing a mobile user saw.

Secondary issues:
- Hero CTA ("Browse All Guides") was wrong for cold users — no intent match
- QuickDecisionCards (6-card grid) were visually small and covered too narrow a slice of the service catalog
- "Common routes and costs" was too early — users who haven't picked a route don't need cost data yet
- No conversion action visible above the fold for ad traffic

---

## New Homepage Order

| Position | Section | Notes |
|---|---|---|
| 1 | Hero | Stronger H1, one CTA — "Get Free Advice" → WhatsApp/contact |
| 2 | PrimaryServices | Full-width stacked service rows, all 12 services, live/soon |
| 3 | FreeAdviceCta | Navy CTA block after services — converts undecided users |
| 4 | HowItWorks | Trust signals — moved down from above-fold zone |
| 5 | RouteSnapshotBand | Common routes and costs — demoted below trust block |
| 6 | Featured Guides | 3 recent guides — remains but demoted |
| Footer | Footer | About + Contact links |

---

## Sections Demoted or Retired

| Component | Action | Reason |
|---|---|---|
| `QuickDecisionCards` | Retired from homepage | Replaced by PrimaryServices — full service catalog |
| `BrowseByService` | Retired from homepage | Replaced by PrimaryServices — redundant |
| `RouteSnapshotBand` | Demoted to position 5 | Content useful but not first-screen priority |
| Featured Guides | Demoted to position 6 | Guide catalog accessible via nav and dedicated page |

Retired components remain in the codebase but are no longer imported on the homepage.

---

## PrimaryServices Design Rationale

- Full-width stacked rows in a card container per category group
- Category groups: Visas (navy accent), Business Setup (brass accent), Government & Legal (slate accent)
- Live services: font-medium, category-colored arrow — clearly interactive
- Soon services: muted text, stone pill — honest about coverage without hiding the roadmap
- All 12 requested services included from launch; 4 live, 8 soon

Live services at launch:
- New Family Visa → `/visas/family`
- Golden Visa → `/visas/golden`
- Property Visa → `/guides/golden-visa-dubai-property`
- Company Setup → `/company-setup`

---

## Hero Change Rationale

Old CTA ("Browse All Guides") sent cold users to a generic list page — no intent match for ad traffic. New CTA ("Get Free Advice") converts immediately. WhatsApp button also persistent in header.

H1 expanded to include the full service scope: visas + company setup + government services.

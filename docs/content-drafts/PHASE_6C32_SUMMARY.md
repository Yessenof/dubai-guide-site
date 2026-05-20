# Phase 6C-32 Summary
# Full Calendar, News Radar and Opportunity Matrix

**Date:** 2026-05-20
**Phase:** 6C-32
**Type:** Planning and strategy — no content created, no imports, no code changes, no DB writes.

---

## Files Created This Phase

| File | Purpose |
|------|---------|
| `FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` | Complete UAE/Dubai/Abu Dhabi opportunity matrix — 85 items across 15 categories |
| `CALENDAR_SEED_ITEM_POLICY.md` | Policy: when calendar items can go public, CTA rules, offer rules, EN/RU parity |
| `HOMEPAGE_AND_CAROUSEL_CONTENT_MODEL.md` | Homepage carousel logic, priority order, image rules, CTA logic, EN/RU rules |
| `DUBAI_LIFE_SETUP_LAUNCH_MATRIX.md` | 12 Life Setup modules with checklists, guides, service paths, SEO/RAG angles |
| `PHASE_6C32_SUMMARY.md` | This file |

## Files Modified This Phase

None. All existing files untouched.

---

## P0 Technical Launch Blocker

> **This blocker affects every item in the matrix. No news/event/calendar SEO or RAG value can be realized until it is resolved.**

**Problem:** All three public route files hardcode `robots: { index: false, follow: true }`:
- `app/(public)/news/[slug]/page.tsx`
- `app/(public)/events/[slug]/page.tsx`
- `app/(public)/calendar/[slug]/page.tsx`

**Impact:**
- Eid Al Adha 2026 (news + event + calendar) — published but invisible to Google/AI
- All future news, events, and calendar pages will also be invisible
- The entire SEO and RAG investment is zero until this is fixed

**Required code phase — Dynamic Index/Noindex Policy:**

| Rule | Condition |
|------|-----------|
| EN page can index | `status=published` AND `noindex=0` AND not past `noindex_after` date |
| RU page can index | All EN conditions AND `ru_published=1` |
| Always noindex | draft, archived, `noindex=1`, past `noindex_after`, offer past `valid_until` |
| Calendar seed items | Without linked detail page → noindex (no broken SEO orphan surface) |
| No EN fallback on RU | If `ru_title` or `ru_body` empty → 404; never thin page |

**Priority:** P0 — resolve before next content deploy.
**This must be a dedicated code phase. Do not mix with content work.**

---

## Key Opportunity Clusters Found

### Cluster A — Immediate Action (within 2 weeks)
| ID | Item | Action |
|----|------|--------|
| HOL-01 | Eid Al Adha 2026 | Deploy to production (pending owner approval) |
| P0 blocker | noindex fix | Code phase required before deploy has SEO value |
| TAX-01 | Emiratisation June 30 quota | Build + publish news within 5 days |
| VIRAL-01 / SOC-01 | Long weekend guide 2026 | Highest ROI content piece — build now |

### Cluster B — Next 60 Days (June–July 2026)
| ID | Item | Action |
|----|------|--------|
| TAX-02 | Corporate Tax FY2025 return (Sept 30) | Build guide + news by August 1 |
| TAX-05 | E-invoicing ASP deadline | Import existing draft (owner_review_ready) |
| HOL-02 | Islamic New Year (~July 17) | Monitor; build draft template |
| SOC-04 | Golden Visa expansion guide | Expand existing guide |
| DXB-02 | GITEX Global 2026 | Monitor gitex.com; draft event page template |

### Cluster C — Q3 2026
| ID | Item | Action |
|----|------|--------|
| HOL-03 | Mawlid Al-Nabi (~Sept 15) | Monitor from Sept 1 |
| AUH-01 | F1 Abu Dhabi 2026 | Import existing draft when dates confirmed |
| DXB-01 | Cityscape Dubai 2026 | Monitor; event page + property CTA |
| PROP-01/02 | Rent 90-day rule + Ejari | Build guides (evergreen, high traffic) |
| SCH-01 | School enrollment guide | Build (high family-audience value) |

### Cluster D — Q4 2026
| ID | Item | Action |
|----|------|--------|
| HOL-04/05 | Commemoration Day + National Day | Calendar + news event pages |
| DXB-06 | Dubai Shopping Festival 2026-27 | Event + offer page |
| TAX-04 | Emiratisation Dec 31 quota | Recycle TAX-01 content |

---

## Public Calendar Candidates

Items ready to appear in public calendar when calendar UI is built and P0 noindex is resolved:

| ID | Item | Condition |
|----|------|-----------|
| HOL-01 | Eid Al Adha 2026 (dates: May 25–29) | Published ✅ — deploy pending |
| HOL-04 | Commemoration Day Nov 30 | Fixed date — safe to add |
| HOL-05 | UAE National Day Dec 2–3 | Fixed date — safe to add |
| HOL-06 | New Year's Day Jan 1, 2027 | Fixed date — safe to add |
| TAX-03 | VAT quarterly deadlines | Official FTA dates — safe to add (internal calendar) |
| DLS-* | Life Setup relative reminders | Safe as relative guides; not calendar items until personalization built |

---

## Internal-Only Candidates

Items with confirmed data that should feed internal planning but not public calendar:

| ID | Item | Why internal |
|----|------|-------------|
| HOL-02 | Islamic New Year (~July 17) | Approximate date — await official confirmation |
| HOL-03 | Mawlid Al-Nabi (~Sept 15) | Approximate date — await official confirmation |
| TAX-06/07 | ESR + UBO filings | Compliance-sensitive; internal business calendar only |
| VIRAL-01 | Long weekend calculator | Powers social content; not a standalone calendar item |
| DLS-01 to DLS-08 | Life Setup reminders | Relative dates; need personalization before calendar |

---

## News Radar Candidates

Items to monitor actively for news post opportunities:

| ID | Item | Monitor source | Trigger for news post |
|----|------|---------------|----------------------|
| HOL-02 | Islamic New Year 1448H | FAHR / WAM | Official UAE announcement |
| HOL-03 | Mawlid Al-Nabi | FAHR / WAM | Official UAE announcement |
| TAX-01 | Emiratisation June 30 | NAFIS / MoHRE | ~June 15 build; publish now |
| TAX-02 | Corporate Tax Sept 30 | FTA | Build by August 1 |
| PROP-03 | RERA rental index update | DLD portal | When RERA publishes 2026 update |
| TRN-01 | Dubai Metro expansion | RTA | When new station/line confirmed |
| ATTR-01 | Dubai Creek Tower milestone | Emaar | When official milestone announced |
| VIRAL-02 | UAE visa fee update | ICA / MOHRE | When official change announced |
| VIRAL-03 | Golden Visa expansion | ICA | When new categories announced |
| VIRAL-04 | Real estate price index | DLD / ValuStrat | Quarterly |

---

## Social-First Candidates

Items best suited for social media posts, with linked guides for depth:

| ID | Item | Social format | Linked guide |
|----|------|--------------|-------------|
| SOC-01 / VIRAL-01 | UAE long weekends 2026 | Carousel image: "All UAE long weekends" | Long weekend guide (build) |
| SOC-02 | UAE corporate tax who pays | Short explainer thread | Corporate tax guide (build) |
| SOC-03 | Mainland vs free zone | Comparison infographic | Comparison guide (build) |
| SOC-04 | Golden Visa 2026 who qualifies | "6 ways to qualify" thread | Expand existing guide |
| SOC-06 | How to check visa validity | Step-by-step screenshot post | Life Setup M12 |
| HOL-05 | UAE National Day long weekend 2026 | Bridge day calculator | Long weekend guide |
| AUH-01 | F1 Abu Dhabi 2026 | Event announcement + ticket tips | F1 event page (import existing draft) |

---

## Offers and Deals Candidates

Items that qualify as time-limited offers:

| ID | Item | When to publish | Expiry |
|----|------|----------------|--------|
| OFFER-01 | GITEX 2026 tickets | When GITEX opens registration | After event |
| OFFER-02 | F1 Abu Dhabi 2026 tickets | When Yas Marina opens sales | After race |
| OFFER-03 | DSF 2026-27 promotions | When DSF officially opens | After DSF ends |

**All offers require:** `valid_from`, `valid_until`, `expires_at`, source URL, noindex after expiry.

---

## Dubai Life Setup Launch Candidates

Modules that can start being built now:

| Module | Priority | What to build first |
|--------|----------|---------------------|
| M07 Business Owner | High | Corporate tax guide, emiratisation guide |
| M01 Before Arrival | High | UAE visa types comparison guide |
| M03 First 30 Days | High | Emirates ID, Ejari, health insurance guides |
| M08 Property Owner | Medium | Ejari, RERA rental index, DLD transfer guides |
| M06 Family + School | Medium | School enrollment guide |
| M05 Annual Reminders | Medium | Visa renewal, Emirates ID renewal guides |
| M02 Days 0–7 | Medium | DEWA, bank account guides |
| M12 Renewal | Medium | Dubai visa renewal dedicated guide |
| M09 Pet Owner | Low | UAE pet import guide |
| M10 Holiday Home | Low | DET permit guide |
| M11 Investor | Low | Golden Visa expansion, UAE tax residency |

---

## Source Gaps Identified

| Area | Source needed | Status |
|------|--------------|--------|
| Islamic dates (HOL-02, 03, 07, 08, 09) | Official FAHR/WAM announcement | Missing — monitor |
| DGHR Dubai government holiday | Official DGHR permalink | Missing — hold item E |
| KHDA school holiday circular | Official KHDA URL | Missing — hold item F |
| Cityscape Dubai 2026 dates | cityscape.com | Missing — monitor |
| GITEX 2026 dates | gitex.com | Missing — monitor |
| F1 Abu Dhabi 2026 exact dates | formula1.com/2026 | Missing — monitor |
| Emiratisation June 30 details | NAFIS / MoHRE | Available — build now |
| Corporate tax FY2025 return | FTA | Available — build now |
| RERA rental index 2026 | DLD portal | Available — monitor |
| DED trade license renewal fees | dubaided.gov.ae | Available — build |
| DET holiday home permit | visitdubai/DET | Available — build |

---

## SEO/RAG Implications

### What's working (existing 15 guides)
- 15 published guides covering visas, company setup, hiring, living, government
- All statically rendered (SSG); all have proper `<title>` and `<meta description>`
- Employment visa guide is reference quality

### What's blocked (news/events/calendar)
- All three route types hardcode `robots: { index: false }` — zero indexing
- Eid content (3 records) will remain invisible until P0 is resolved
- No AI crawler can discover or cite news/events/calendar content until noindex removed

### Highest-ROI SEO opportunities (build next)
1. UAE long weekend guide 2026–2027 (VIRAL-01) — massive search volume, annual refresh
2. Dubai Life Setup hub (M01–M12) — high-intent queries; drives service conversions
3. Corporate Tax guide + deadlines (TAX-02) — high B2B audience; monetization
4. Ejari + RERA rental guide (PROP-01/02) — very high expat search volume
5. Emirates ID registration guide (DLS-02) — searched by every new Dubai resident
6. Golden Visa comprehensive guide (SOC-04) — expand existing; very high search volume

---

## Monetization Implications

| Content type | Monetization mechanism | Priority |
|--------------|----------------------|---------|
| Company setup (mainland + free zone) | WhatsApp CTA → consultation | Active (guides live) |
| Visa assistance | WhatsApp CTA → consultation | Active (guides live) |
| Corporate tax + compliance | WhatsApp CTA → tax advisor referral | Build TAX-02 first |
| Property (DLD, Ejari, RERA) | WhatsApp CTA → property consultation | Build PROP guides |
| Holiday home (DET) | WhatsApp CTA → STR advisory | Build DET guides |
| Events (F1, GITEX) | External ticket CTA + company setup angle | Build event pages |
| Life Setup modules (M01–M12) | WhatsApp CTA at each step | Build module guides |
| School enrollment | WhatsApp CTA → education advisory | Build school guide |

---

## Recommended Next Phases

### Immediate: Phase 6C-33 — P0 Noindex Code Fix
**What:** Implement dynamic index/noindex policy across news, event, and calendar routes.
**Why:** All SEO investment is zero until this is done. Every article deployed without this is invisible.
**Scope:** Code change only — no content, no DB schema change.
**Files:** `app/(public)/news/[slug]/page.tsx`, `app/(public)/events/[slug]/page.tsx`, `app/(public)/calendar/[slug]/page.tsx`
**Test:** After fix, verify `<meta name="robots" content="index, follow">` appears on published EN pages; `noindex` appears on draft/archived/RU-only pages.

### Phase 6C-34 — Emiratisation and Corporate Tax Compliance Sprint
**What:** Build and import:
- News: Emiratisation June 30 quota (TAX-01) — urgent, 10 days
- News+Guide: Corporate Tax FY2025 return deadline Sept 30 (TAX-02)
- Import: E-invoicing ASP deadline (TAX-05) — existing draft, owner-review-ready
**Why:** High B2B monetization; two deadlines imminent.

### Phase 6C-35 — UAE Long Weekend Guide and Social Infrastructure
**What:** Build: "UAE Long Weekends 2026–2027 — Complete Planning Guide" (VIRAL-01)
**Why:** Highest ROI single content piece; evergreen; drives traffic to all holiday content.
**Scope:** One guide + associated social post templates.

### Phase 6C-36 — Dubai Life Setup Hub (Phase 1)
**What:** Build M01–M03 content (Before Arrival, Week 1, First 30 Days) with:
- Emirates ID guide
- Ejari guide
- DEWA guide
- UAE bank account guide
- Visa types comparison guide
**Why:** High-intent search cluster; drives service conversions.

### Phase 6C-37 — Events Import Sprint
**What:** Import existing event drafts:
- F1 Abu Dhabi Grand Prix 2026 (`formula-1-abu-dhabi-grand-prix-2026.md`)
- GITEX Global 2026 (when dates confirmed)
**Why:** Event pages are high-traffic; GITEX drives company setup conversions.

### Phase 6C-38 — Property Guide Sprint
**What:** Build M08 core guides:
- Ejari registration guide
- RERA rental index and 90-day notice guide
- DLD property transfer guide
**Why:** Very high search volume; large Dubai expat renter audience.

---

## Validation

### No new articles / guides / event drafts created: ✅
No new article, event, guide, or calendar draft files were created.

### No admin / AI Inbox / DB writes: ✅
No DB writes, no admin actions, no schema changes.

### No publish / push / deploy / production: ✅
No git operations. No deployment actions.

### No code or app files touched: ✅
Only `docs/content-drafts/` files written.

---

## Git Status (Phase 6C-32 additions)

Untracked new files added this phase:
- `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md`
- `docs/content-drafts/CALENDAR_SEED_ITEM_POLICY.md`
- `docs/content-drafts/HOMEPAGE_AND_CAROUSEL_CONTENT_MODEL.md`
- `docs/content-drafts/DUBAI_LIFE_SETUP_LAUNCH_MATRIX.md`
- `docs/content-drafts/PHASE_6C32_SUMMARY.md`

No existing files modified.
No git add, no commit, no push.

---

*Phase 6C-32 complete — 2026-05-20.*

# Phase 6C-SEO-OPERATING-SYSTEM-01 — Report

**Date:** 2026-07-01  
**Production commit:** `6da016d`  
**Status:** LOCAL COMPLETE — no DB writes, no deploy, no push

---

## Files created

| File | Purpose |
|---|---|
| `docs/content-drafts/seo/6c-seo-operating-system-01.md` | Master SEO operating system |
| `docs/content-drafts/seo/6c-seo-weekly-checklist-template.md` | Reusable weekly review template |
| `docs/content-drafts/seo/6c-seo-cluster-backlog-01.md` | Prioritised content backlog across 4 clusters |
| `docs/content-drafts/seo/6c-seo-operating-system-01-report.md` | This report |

---

## Main system decisions documented

### Operating principle

Guidex grows as a compounding SEO/RAG machine. Speed is secondary to correctness. No weak page is published. No claim is made without a source label. GSC data drives investment decisions — not assumptions.

### Source labeling

The AMER data framing rule from the visa phases is now codified as a permanent system rule:
- AMER fees → "Amer service-centre notes reviewed by Guidex"
- Salary/deposit references → "Amer filing guideline, reviewed case by case at GDRFA"
- Official ICA/GDRFA data → "Based on ICA/GDRFA official guidelines"
- No mixing of source types in a single claim

### EN/RU parity rule

Documented as a non-negotiable rule with the specific mechanism that breaks it: if `ru_title` is empty, the guide is excluded from RU static params by `getRuPublishedGuidesSlugs()`. Always confirm RU content is populated.

### Dead slug prevention

Added to regression-safe checklist with the specific pattern discovered: `spouse-dependent-dubai-inside` / `child-dependent-dubai-inside` — short slug forms that never existed in DB. Rule: always verify slugs against `SELECT slug FROM guides WHERE published=1` before committing to `related-guides.ts`.

---

## Cluster priorities

| Cluster | Current state | Priority |
|---|---|---|
| Visa Guides | 9 guides live, links cleaned, AMER data integrated | Strengthen existing → selective expansion |
| Dubai Calendar | Monthly pages live, event pages live | Gap: Aug/Sep/Nov things-to-do pages |
| Life Setup | Hub live, few guides | High gap: Ejari, DEWA, driving license, relocation checklist |
| Company/Business | 4 guides live | High gap: VAT registration, corporate tax, trade license renewal |

**Next investment recommendation: Life Setup cluster** — lowest source risk, high search volume, natural conversion path from visa guides.

---

## Weekly workflow summary

The documented weekly workflow is 6 steps:

1. **GSC export** — Performance, Coverage, Enhancements, Sitemaps
2. **Identify** — CTR gap pages, position 8–30 pages, indexing issues
3. **Update** — title/meta, content improvements, internal links
4. **QA** — build, routes, EN/RU parity, canonical, hreflang, schema, forbidden phrases, dead slugs
5. **Log** — SESSION_LOG.md entry, phase code, expected SEO effect
6. **Submit** — GSC URL inspection + Request Indexing for all changed pages

Time estimate: 30–45 minutes weekly.

---

## Regression-safe checklist summary

16 content mistake patterns documented with past incidents:
- AMER data overclaiming (AED fees framed as official)
- Salary/deposit threshold without case-by-case label
- Event performer/attendance claims without official source
- Ukraine-specific content in general UAE guides

11 technical mistake patterns documented:
- Dead slugs in related-guides.ts (specific pattern: old short-form slug names)
- RU English fallback (specific mechanism: empty `ru_title`)
- DB committed to git
- Local DB copied over production DB
- tsx/node script failures on macOS (use python3)
- Manual PM2 stop/start
- Build not run locally before commit

---

## Cluster backlog summary

**A. Dubai Calendar** — 12 items prioritised
- P0 (4): Things to do Aug/Sep/Nov, UAE public holidays 2026
- P1 (6): School holidays, exhibitions, GITEX full guide, F1 guide, DSF, Global Village
- P2 (2): Ramadan 2027

**B. Dubai Visa Guides** — 13 items prioritised
- P0 (5): Visa cancellation, Emirates ID renewal, medical fitness test guide, family visa cost, dependent visa sponsorship
- P1 (7): Sponsorship transfer, maid visa, grace period, Golden Visa professional, freelancer visa
- P2 (3): Tourist visa, retirement visa, investor visa

**C. Life Setup Dubai** — 10 items prioritised
- P0 (7): Ejari, DEWA, rent documents, driving license, health insurance, SIM card, relocation checklist
- P1 (2): Personal bank account, school enrolment
- P2 (1): NIN/UAE digital ID

**D. Company/Business Setup** — 12 items prioritised
- P0 (6): VAT registration, corporate tax, trade license renewal, MOHRE file, immigration card, employee visa guide
- P1 (4): Restaurant license, freelance vs company, Emiratisation, employee visa company perspective
- P2 (3): Fit-out license, LLC vs sole establishment, mainland vs free zone comparison

**Total backlog items documented: 47**

---

## Next recommended implementation phase

**Phase 6C-LIFE-SETUP-GUIDES-01** — Ejari + DEWA guides

Rationale:
- Lowest source risk in the backlog (official portals with clear documented processes)
- High search volume from expats setting up their first Dubai apartment
- Natural cross-link target from visa guides (Ejari mentioned in parents visa as sponsorship requirement)
- No AMER data needed — official process only
- Fits existing guide template perfectly: steps, cost, time, documents

Alternatively, if GSC shows strong impressions for "VAT registration UAE" queries:
- **Phase 6C-BUSINESS-TAX-01** — VAT registration + corporate tax guides
- Higher commercial intent, similar low source risk

Wait for GSC data before choosing — let real demand decide.

---

## Confirmed

- No DB writes
- No deploy
- No push
- No schema changes
- No migrations
- No admin / AI Inbox / auth / proxy changes
- No manual PM2 stop/start
- No public content edited
- No new public pages created

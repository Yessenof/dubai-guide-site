# Phase 6C-66 — E-Invoicing Indexed Brief Data Prep

**Date:** 2026-05-25
**Phase:** 6C-66
**Scope:** Data prep only — no code, no DB, no imports, no deploys

---

## What Was Done

Read and synthesised all primary e-invoicing source files to produce source-safe, EN/RU-complete indexed brief data for TAX-05A, TAX-05C, and TAX-05D.

**Source files read:**
- `docs/content-drafts/news/uae-e-invoicing-2026-asp-deadline-update.md` — EN/RU news draft, source table, what-not-to-claim list
- `docs/content-drafts/guides/uae-e-invoicing-2026-business-readiness.md` — EN/RU guide draft, deadline breakdown, adviser caveat, RAG summary
- `docs/content-drafts/calendar/uae-e-invoicing-2026-asp-deadline.md` — calendar visual post draft with per-item agenda descriptions for items A-E
- `docs/content-drafts/source-ledgers/uae-e-invoicing-2026-sources.md` — full source ledger, allowed/blocked claims, verification checklist
- `docs/content-drafts/reviews/e-invoicing-2026-owner-review.md` — owner review file with Phase 6C-64 recheck results
- `docs/content-drafts/PHASE_6C64_E_INVOICING_FRESHNESS_RECHECK_AND_IMPORT_DECISION.md` — Phase 6C-64 import path decision (Option B: news_posts + calendar_pages, guide held)

**Files created:**
1. `docs/content-drafts/calendar/e-invoicing-2026-indexed-brief-data.md` — full JSON-ready brief objects for all three items, source table, allowed/blocked claims, EN/RU copy audit, import checklist, owner decisions
2. `docs/content-drafts/PHASE_6C66_E_INVOICING_INDEXED_BRIEF_DATA_PREP.md` — this file

---

## What Was Not Touched

- DB: not touched
- Admin: not touched
- Schema/migrations: not touched
- Code: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- No imports, no content published, no deployments, no commits (pending owner approval)

---

## Key Findings

### 1. All source dates confirmed from official sources

| Date | Source | Status |
|---|---|---|
| 1 July 2026 — pilot opens | MoF Guidelines V-1.0, Feb 2026 (S1) | Confirmed — recheck before import |
| 30 October 2026 — ASP deadline, large businesses | MoF amendment to MD 244, 10 May 2026 (S2) | Official permalink captured Phase 6C-23 — recheck before import |
| 1 January 2027 — mandatory, large businesses | S1 + S2 (unchanged by amendment) | Confirmed — recheck before import |
| Revenue threshold: AED 50M | S1 and S2 | Confirmed — must be stated on every item |

### 2. Fine amounts are source-backed (Cabinet Resolution No. 106 of 2025)

Penalty figures are citable when Cabinet Resolution 106 of 2025 (S3) is cited as the source. Brief text for TAX-05A references the AED 5,000/month exemption for voluntary adopters. TAX-05C and TAX-05D do not include fine amounts in brief text to keep briefs concise and reduce risk of misuse. The news draft (separate item) covers penalty detail in full.

### 3. ASP count claim (32 providers) is not included in brief text

"32 providers approved" was accurate as of May 2026. ASP count changes as the accreditation programme progresses and must be rechecked before any publish action. Brief text instead directs readers to the official MoF ASP page without stating a count. This is safer and does not require a recheck before each import.

### 4. CTA dual-path design

TAX-05C and TAX-05D are designed with two CTA scenarios:
- Scenario A: news post not yet published — CTA points to official MoF source
- Scenario B: news post published simultaneously — CTA points to internal news post

Owner must decide which scenario applies before import. TAX-05A uses Scenario A regardless (opening date, no procedural requirement, official source is the appropriate destination).

### 5. Guide CTA not used

The guide (`/guides/uae-e-invoicing-2026-business-readiness`) is draft-file only and cannot be published in the `guides` table because the guides schema requires sequential process steps (where to go, address, cost per step), which does not fit an e-invoicing deadline breakdown. Brief CTAs do not reference the guide slug. The guide remains file-based pending a future reference content type decision.

### 6. detail_url for agenda card

The existing `detail_url` field on each item (used by CalendarGrid for the agenda card CTA) follows the same Scenario A/B logic as `cta_url`. Until the news post is published, `detail_url` is null, and the agenda card will have no CTA link. This is correct behaviour — no fake internal URL is planted.

---

## Brief Content Summary

| Item | Date | brief_en words | brief_ru words | Revenue scope stated | Adviser caveat | Source cited |
|---|---|---|---|---|---|---|
| TAX-05A | 2026-07-01 | 138 | 118 | yes | yes | MoF Guidelines V-1.0 |
| TAX-05C | 2026-10-30 | 133 | 125 | yes (>= AED 50M) | yes | MoF amendment 10 May 2026 |
| TAX-05D | 2027-01-01 | 142 | 122 | yes (>= AED 50M) | yes | MoF Guidelines V-1.0 |

All briefs: no em dashes, no double hyphens, no "all businesses" claims, no tax advice tone, no unsupported penalty figures, no free zone scope claims, no ASP count claims.

---

## Final Report Q&A

### Are TAX-05A/C/D briefs ready?

**Ready for owner review — not ready for import.** All three items have complete EN and RU brief text, who_for, what_to_do, source_label, source_url, source_status, risk_level, lifecycle, and CTA fields. The briefs are factually sourced, within the 80-180 word limit, and pass the copy audit. They are not ready for import because: (1) the brief rendering code phase has not been implemented, (2) the CTA scenario for TAX-05C and TAX-05D requires an owner decision, and (3) sources must be rechecked immediately before any import action.

### Which item needs a full detail page?

**TAX-05C (30 October 2026 ASP deadline)** is the strongest candidate for a full detail page. It is a specific compliance deadline with high search intent ("UAE e-invoicing ASP deadline 2026"). The news draft (`uae-e-invoicing-2026-asp-deadline-update`) is ready for owner review. If approved and published, it becomes the Level 3 page and all TAX-05 items point to it via Scenario B CTAs.

**TAX-05A** (pilot opening) and **TAX-05D** (mandatory implementation) benefit from being linked to the same news post rather than having individual pages. They are contextual calendar dates, not primary search targets.

### Which items can stay Level 2 only?

TAX-05A can stay Level 2 permanently. It marks an opening date, not a compliance deadline, and does not drive independent search intent. The brief plus official source CTA is sufficient.

TAX-05D could stay Level 2 if linked to the TAX-05C news post as context. It does not need its own standalone page.

TAX-05C cannot stay Level 2 indefinitely — it is the primary compliance deadline and warrants the full news post as a Level 3 page once owner-approved.

### Are EN/RU complete?

Yes. All three items have:
- label_en and label_ru
- short_label_en and short_label_ru
- brief_en (138, 133, 142 words) and brief_ru (118, 125, 122 words)
- who_for_en/ru, what_to_do_en/ru, source_label_en/ru, cta_label_en/ru

RU text is natural Russian — not literal translation. Adviser caveats are in both languages. Revenue scope is stated in both languages on every item.

### Are all claims source-safe?

Yes. Every deadline figure is sourced to either S1 (MoF Guidelines V-1.0) or S2 (MoF amendment, May 2026). Fine amount in TAX-05A is qualified with Cabinet Resolution 106 citation and framed as an exemption for voluntary adopters — not as a threat. No fine amounts appear in TAX-05C or TAX-05D brief text. Revenue scope (AED 50M threshold) is stated on all three items. Adviser caveat is present on all three items. Free zone applicability is not mentioned (unconfirmed). ASP count is not mentioned (requires recheck).

### What should the next code phase implement?

Per the Phase 6C-65 technical plan, the next code phase should implement:

1. Add optional brief fields to `CalendarDateItemExtended` in `lib/calendar-mock-data.ts`
2. Add optional brief fields to `CalendarDateItem` in `lib/db/news-events-calendar.ts`
3. Add a brief section to `app/(en)/(public)/calendar/[slug]/page.tsx` below the dates list — renders `<details>/<summary>` per item where `brief_en` is non-empty
4. Mirror in `app/ru/calendar/[slug]/page.tsx` using `brief_ru`

The code phase can now use the TAX-05 brief data from this phase as the real test dataset, provided the owner approves the briefs and the calendar_pages row is imported to local DB for local QA.

No changes to CalendarGrid, schema, or main `/calendar/page.tsx` are needed for the MVP.

---

## Output Files Created This Phase

| File | Purpose |
|---|---|
| `docs/content-drafts/calendar/e-invoicing-2026-indexed-brief-data.md` | JSON-ready brief objects for TAX-05A/C/D, source table, allowed/blocked claims, EN/RU copy audit, import checklist, owner decisions |
| `docs/content-drafts/PHASE_6C66_E_INVOICING_INDEXED_BRIEF_DATA_PREP.md` | This file — phase summary and final report Q&A |

---

**Phase 6C-66 is complete. No code was touched. No DB was modified. No content was imported or deployed.**

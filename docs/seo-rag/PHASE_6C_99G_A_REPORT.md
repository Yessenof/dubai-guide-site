# Phase 6C-99G-A Report — Source Notes + Content Trust Model

**Date:** 2026-06-11
**Status:** COMPLETE — docs/design only
**Production readiness:** NO

---

## Files Created

| File | Purpose |
|---|---|
| `docs/seo-rag/SOURCE_NOTES_MODEL.md` | Canonical field definitions, source types, authority types, status values, risk levels, blocked claims rule, recheck cadence |
| `docs/seo-rag/CONTENT_TRUST_RULES.md` | 7 trust rules governing what may be published and with what source backing |
| `docs/seo-rag/SOURCE_NOTE_UI_PLAN.md` | Per-page-group audit, SourceNote component spec, 99G-B scope |
| `docs/seo-rag/PHASE_6C_99G_A_REPORT.md` | This file |

---

## Model Summary

### Source note fields
13 fields per source note:
`source_name`, `source_url`, `source_type`, `authority_type`, `last_checked`, `status`, `applies_to`, `risk_level`, `visible_note_en`, `visible_note_ru`, `blocked_claims`, `verification_notes`, `next_recheck_date`

### Source types (trust hierarchy)
```
official  →  organizer  →  media_signal / social_signal  →  pdf (unofficial)  →  internal_verification
```

`media_signal` and `social_signal` are signals only. They can never be the sole source for high-risk claims.

### Status values
`confirmed` / `provisional` / `pending` (not publishable) / `historical` / `expired`

### Risk levels
- **HIGH:** visa rules, tax, fines, Islamic dates, public holidays, government fees, employment law, property rules
- **MEDIUM:** event dates/programme, general company setup steps
- **LOW:** general knowledge, past facts, overviews with no fee/deadline claims

### 7 trust rules summary
1. Official source required before publishing high-risk claims
2. Media/social sources are signals only — never sole source for high-risk content
3. Islamic holidays must show confirmed/provisional status and official source
4. Events must distinguish organizer, venue, ticketing, and media layers; expired events must be archived
5. Offers must have valid_from, valid_until, source_url, and an expiry/archive plan before publishing
6. EN/RU parity — same facts, same status, natural Russian, no EN fallback
7. UI rules — ≤30 words, calm tone, no "disclaimer", no raw URLs, mobile-first

---

## High-Risk Content Groups

| Page group | Risk | Gap | Action |
|---|---|---|---|
| `/visas/family` + `/ru/visas/family` | HIGH | No source note | 99G-B priority 1 |
| `/visas/golden` + `/ru/visas/golden` | HIGH | No source note | 99G-B priority 1 |
| TRC custom pages EN + RU | HIGH | No source note | 99G-B priority 1 |
| `/guides/golden-visa-dubai-property` | HIGH | No source note | 99G-B priority 2 |
| `/guides/mainland-company-setup-dubai` | HIGH | No source note | 99G-B priority 2 |
| `/guides/open-business-bank-account-dubai` | MEDIUM-HIGH | No source note | 99G-B priority 2 |
| GITEX Global 2026 event page | MEDIUM | No visible source note (Event schema present) | 99G-B priority 3 |
| Mawlid 1448 (August 2026) | HIGH | Amber box live but provisional — FAHR not confirmed | Watch from Jul 26 |
| Hijri New Year June 2026 | HIGH | CONFIRMED — amber box + news post adequate | No gap |
| `/life-setup` + `/ru/life-setup` | MEDIUM | No source note | 99G-B priority 3 |

---

## Recommended 99G-B Implementation Scope

### Phase 99G-B goal
Build the `SourceNote` component and apply it to the 6 highest-risk page groups.
No DB changes. No admin changes. Static props in component. No JSON-LD changes.

### Build order

**Round 1 — HIGH risk (visa + TRC custom pages):**
1. `SourceNote` component — two variants: `confirmed` (gray) + `provisional` (amber)
2. `/visas/family` + `/ru/visas/family` — source note, authority: ICA/GDRFA
3. `/visas/golden` + `/ru/visas/golden` — source note, authority: ICA/GDRFA/DLD
4. TRC EN + RU custom pages — source note, authority: FTA/EmaraTax

**Round 2 — HIGH risk (standard guide templates):**
5. `/guides/golden-visa-dubai-property` — source note, authority: ICA/GDRFA/DLD
6. `/guides/mainland-company-setup-dubai` — source note, authority: DED
7. `/guides/open-business-bank-account-dubai` — source note, authority: CBUAE

**Round 3 — MEDIUM risk:**
8. GITEX event page — source note, authority: GITEX organizer
9. Hub-level note on `/life-setup` + `/ru/life-setup`

### Estimated file changes in 99G-B
- 1 new component: `components/SourceNote.tsx`
- 2 modified: `/visas/family/page.tsx`, `/ru/visas/family/page.tsx`
- 2 modified: `/visas/golden/page.tsx`, `/ru/visas/golden/page.tsx`
- 2 modified: TRC custom pages EN + RU
- 3 modified: golden-visa-property, mainland-company, open-business guides (standard template)
- 1 modified: GITEX event page
- 2 modified: `/life-setup/page.tsx`, `/ru/life-setup/page.tsx`

Total: 1 new + ~13 modified. Manageable as one deploy.

---

## What Not to Touch Yet

| Scope | Reason |
|---|---|
| DB schema (source_notes table) | Static component props are sufficient for now; DB layer adds complexity before trust model is validated in production |
| Admin UI for source notes | No content editor is managing this yet — owner edits files directly |
| JSON-LD changes | Schema.org already has `citation` and `source` properties, but adding them requires research; not needed for user-visible trust in 99G-B |
| AI Inbox / content import pipeline | Trust model for AI-generated content is a later problem |
| Remaining 10 standard guides | Start with the 6 high-risk groups; validate pattern before expanding |
| Offer/deal pages | No offer pages exist yet; expiry logic can wait |
| F1 Abu Dhabi GP | Confirm page exists before adding source note |
| News post source notes | Confirmed news posts (Hijri New Year) are adequate; not high priority |

---

## Standing Trigger Reminder

**6C-100C-B** — Mawlid 1448 upgrade:
- Watch FAHR / MoHRE from **July 26, 2026**
- When official Mawlid 1448 date is announced: upgrade AUG-NEW-02 from `provisional` → `confirmed`, add FAHR URL, update visible note, create news post
- Do not touch until official announcement

---

## Hard-Stop Compliance

| Rule | Status |
|---|---|
| No deploy | Confirmed |
| No push | Docs only — no push required |
| No production DB write | Confirmed |
| No migrations | Confirmed |
| No admin changes | Confirmed |
| No AI Inbox | Confirmed |
| No content import | Confirmed |
| No live template edits | Confirmed |
| No new public pages | Confirmed |
| No destructive commands | Confirmed |

---

## Next Step

**Phase 6C-99G-B** — implement `SourceNote` component and apply to 6 high-risk page groups.

Prerequisite: owner approves 99G-B scope and component design.

*Phase 6C-99G-A COMPLETE — 2026-06-11*

# Phase 6C-69B — Noindex Stale Claim Cleanup

**Date:** 2026-05-26
**Phase:** 6C-69B
**Scope:** Documentation cleanup only — no code, no DB, no imports, no publish, no deploy, no push

---

## What was done

Removed a stale false claim from three Phase 6C-69 planning documents. The claim described a "P0 noindex blocker" stating that all calendar, news, and event detail pages were hardcoded `robots: { index: false, follow: true }` and that no calendar content was indexed. This claim was incorrect: published detail and monthly calendar pages pass `robots: index, follow` and are indexable.

---

## Files modified

| File | Change |
|------|--------|
| `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md` | Replaced `## P0 blocker — must fix before any calendar SEO value is realized` section with corrected indexing status section; added stale-claim note. |
| `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md` | Replaced `### 1. P0 noindex blocker (critical)` with corrected `### 1. Indexing status — corrected (Phase 6C-69B)`; removed `Code phase: dynamic noindex` from "What comes next"; updated next actions to reflect correct sequence. |

The `2026-2027-first-30-calendar-candidates.md` file contained no noindex language — no changes required.

---

## Exact stale claims removed

### Sprint plan (`2026-2027-calendar-fill-sprint-plan.md`)

**Removed:**
> ## P0 blocker — must fix before any calendar SEO value is realized
>
> **All calendar, news, and event detail pages are currently hardcoded as `noindex`.** The files `app/(en)/(public)/calendar/[slug]/page.tsx`, `app/(public)/news/[slug]/page.tsx`, and `app/(public)/events/[slug]/page.tsx` all contain `robots: { index: false, follow: true }` — hardcoded. The DB `noindex` field is ignored.
>
> This means every calendar page we publish is invisible to Google and AI crawlers until a code phase fixes this. **Resolving this blocker must be scheduled before or alongside the next content deploy.**

### Phase summary (`PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md`)

**Removed:**
> ### 1. P0 noindex blocker (critical)
>
> All calendar, news, and event detail pages are hardcoded as `robots: { index: false, follow: true }`. The DB `noindex` field is ignored. **No calendar content currently indexed by Google or AI crawlers.** This requires a code fix (add dynamic noindex logic based on DB `status`, `noindex`, and `noindex_after` fields) before any content has SEO value.

**Also removed from "What comes next":**
> 4. **Code phase: dynamic noindex** — schedule as the next code phase (before next content wave)

---

## Corrected indexing statement

> Published detail and monthly calendar pages render with `robots: index, follow` and are indexable by Google and AI crawlers. The `/calendar` and `/ru/calendar` listing pages may remain `noindex, follow` as a product decision; this does not block indexed calendar detail or monthly pages. There is no indexing blocker on the calendar fill sprint.

---

## Corrected next actions (further refined in Phase 6C-69C)

> Phase 6C-69B corrected the noindex claim. Phase 6C-69C (2026-05-26) further removed stale references to "Long Weekends D1–D5" and "Emiratisation import" — both are already live and must not be reimported. See `PHASE_6C69C_FINAL_STALE_NEXT_ACTIONS_CLEANUP.md` for the corrected sequence.

1. Owner reviews Phase 6C-69 output — sprint plan and 30 candidates
2. Owner approves push — Phase 6C-67 (commit c774709) + Phase 6C-68C (commit a7c7fe5) to GitHub; Long Weekends and Emiratisation are already live — do not reimport
3. Production deploy — safe deploy sequence (PM2 stop → build → PM2 start); recheck all MoF e-invoicing source URLs immediately before production import
4. Production import e-invoicing — import TAX-05A/C/D news + calendar page with indexed briefs; separate owner approval required
5. First source-safe calendar batches — run Batch 2+ as monthly pages are created and gates cleared
6. Corporate Tax FY2025 guide — highest-priority new content (target: August 1 2026)

---

## Validation

- No code files touched
- No DB touched
- No admin actions
- No deploy
- No push
- 30-candidate list unchanged
- Month fill strategy unchanged
- Source statuses unchanged

---

## Safe to commit

**Yes.** Three doc files only. No code, no DB, no risk.

Files for commit:
- `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md`
- `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md`
- `docs/content-drafts/PHASE_6C69B_NO_INDEX_STALE_CLAIM_CLEANUP.md`

---

**Phase 6C-69B complete. Documentation cleanup only. No code. No DB. No imports. No push. No deploy.**

# Phase 6C-69C — Final Stale Next-Actions Cleanup

**Date:** 2026-05-26
**Phase:** 6C-69C
**Scope:** Documentation cleanup only — no code, no DB, no imports, no publish, no deploy, no push

---

## What was done

Removed stale next-action references from three Phase 6C-69/69B planning documents:

- "Resolve Long Weekends D1–D5" — Long Weekends 2026–2027 is already live in production. No D1–D5 decisions needed. Do not reimport.
- "Approve Emiratisation import" — Emiratisation June 30 news + calendar page is already live in production. Do not reimport.
- "Phase 6C-68 + 6C-68C commit — Pending owner approval" — Phase 6C-68C is committed as `a7c7fe5`. Phase 6C-68 records are in local DB pending production deploy.

Also updated cross-reference and SEO window entries to reflect that Long Weekends and Emiratisation are already live.

---

## Files modified

| File | Sections changed |
|------|-----------------|
| `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md` | Standalone topic table: status for Long Weekends and Emiratisation; Batch 1 table: full revision; SEO window priority: marked already-live items |
| `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md` | Import-ready backlog table; sprint timeline "Now" row; "What comes next" item 2; cross-reference Phase 6C-68C status |
| `docs/content-drafts/PHASE_6C69B_NO_INDEX_STALE_CLAIM_CLEANUP.md` | "Corrected next actions" section: removed stale D1–D5 and Emiratisation references; added 6C-69C forward-reference note |

---

## Exact stale claims removed

### Sprint plan (`2026-2027-calendar-fill-sprint-plan.md`)

**Standalone topic table — removed stale statuses:**
- `uae-long-weekends-2026-2027 | import-ready pending D1–D5` → `already_live — do not reimport`
- `uae-emiratisation-june-30-2026-reminder | import-ready` → `already_live — do not reimport`

**Batch 1 table — removed stale rows:**
- `VIRAL-01 Long Weekends import | Resolve D1–D5 owner decisions; import via admin | Owner D1–D5 decisions`
- `TAX-01A Emiratisation calendar | Import news + calendar Item A | Owner approval; MoHRE source recheck`
- `Phase 6C-68 + 6C-68C commit | Commit visual polish + e-invoicing import | Owner approval`

**SEO window priority — marked already-live:**
- `Long Weekends guide (VIRAL-01) | June 15 2026` → `already live`
- `Emiratisation June 30 | June 20 2026` → `already live`

### Phase summary (`PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md`)

**Import-ready backlog table — corrected statuses:**
- `Long Weekends 2026–2027 (VIRAL-01) | Pending D1–D5 owner decisions` → `already_live — do not reimport`
- `Emiratisation June 30 2026 (TAX-01A) | Pending owner approval + source recheck` → `already_live — do not reimport`
- `Phase 6C-68 + 6C-68C commit | Pending owner approval` → split into two rows with correct commit hashes

**Sprint timeline — removed stale imports from "Now" row:**
- Removed: `Long Weekends import, Emiratisation import`

**"What comes next" item 2 — removed stale actions:**
- Removed: `resolve Long Weekends D1–D5`
- Removed: `approve Emiratisation import`

**Cross-reference — updated Phase 6C-68C status:**
- `(local only, not committed)` → `(committed as a7c7fe5; pending production deploy)`

### Phase 6C-69B doc (`PHASE_6C69B_NO_INDEX_STALE_CLAIM_CLEANUP.md`)

**"Corrected next actions" section:**
- Removed: `resolve Long Weekends D1–D5; approve Emiratisation import`
- Added: `Long Weekends and Emiratisation are already live — do not reimport`

---

## Corrected next-action sequence

1. Owner reviews Phase 6C-69/69B/69C output
2. Owner approves push — Phase 6C-67 (commit c774709) + Phase 6C-68C (commit a7c7fe5) to GitHub
3. Production deploy — safe deploy sequence (PM2 stop → build → PM2 start)
4. Recheck all MoF e-invoicing source URLs (TAX-05A/C/D) immediately before production import
5. Production import e-invoicing — import TAX-05A/C/D news + calendar page with indexed briefs; separate owner approval required
6. First source-safe calendar batches — run Batch 2+ monthly pages as gates cleared
7. Corporate Tax FY2025 guide — highest-priority new content (target: August 1 2026)

**Long Weekends 2026–2027: already live — do not reimport.**
**Emiratisation June 30 2026: already live — do not reimport.**

---

## Indexing status — confirmed correct across all docs

- Published detail and monthly calendar pages: `robots: index, follow` — indexable
- `/calendar` listing route: `noindex, follow` — product decision, does not block detail pages
- No indexing blocker on the calendar fill sprint

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

**Yes.** Four doc files only. No code, no DB, no risk.

Files for commit (combined with Phase 6C-69/69B docs):
- `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md`
- `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md`
- `docs/content-drafts/PHASE_6C69B_NO_INDEX_STALE_CLAIM_CLEANUP.md`
- `docs/content-drafts/PHASE_6C69C_FINAL_STALE_NEXT_ACTIONS_CLEANUP.md`
- `docs/content-drafts/calendar/2026-2027-first-30-calendar-candidates.md` (unchanged — included in original 6C-69 commit scope)

---

**Phase 6C-69C complete. Documentation cleanup only. No code. No DB. No imports. No push. No deploy.**

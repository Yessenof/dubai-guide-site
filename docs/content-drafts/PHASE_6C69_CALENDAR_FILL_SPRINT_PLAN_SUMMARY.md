# Phase 6C-69 — Calendar Fill Sprint Plan Summary

**Date:** 2026-05-26
**Phase:** 6C-69
**Scope:** Documentation only — calendar fill sprint plan and first 30 source-safe candidates for 2026-2027

---

## What was done

Phase 6C-69 is a planning-only phase. No code changed. No DB records created. No admin actions. No commits without approval.

The following documents were created based on a full read of all relevant source material:

| Document | Path | Purpose |
|----------|------|---------|
| Sprint plan | `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md` | Complete plan for filling the public calendar June 2026 through Q1 2027 |
| First 30 candidates | `docs/content-drafts/calendar/2026-2027-first-30-calendar-candidates.md` | 30 individually documented source-safe calendar date item candidates |
| This summary | `docs/content-drafts/PHASE_6C69_CALENDAR_FILL_SPRINT_PLAN_SUMMARY.md` | Phase completion summary |

**Sources reviewed:**
- `docs/content-drafts/calendar/uae-dubai-2026-calendar-seed-matrix.md`
- `docs/content-drafts/CALENDAR_FIRST_INDEXED_EVENT_BRIEF_MODEL.md`
- `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md`
- `docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md`
- `docs/content-drafts/SOURCE_RESEARCH_QUEUE.md`
- `docs/content-drafts/calendar/e-invoicing-2026-indexed-brief-data.md`
- `docs/content-drafts/source-ledgers/dubai-2026-events-tourism-sources.md`
- `docs/content-drafts/source-ledgers/uae-long-weekends-2026-2027-sources.md`

---

## Key findings

### 1. Indexing status — corrected (Phase 6C-69B)

> **Stale claim removed.** An earlier version of this section described a "P0 noindex blocker (critical)" stating all calendar detail pages were hardcoded `noindex`. This was incorrect and has been corrected in Phase 6C-69B (2026-05-26).

Published detail and monthly calendar pages render with `robots: index, follow` and are indexable by Google and AI crawlers. The `/calendar` listing route may remain `noindex, follow` as a product decision; it does not block indexed calendar detail pages. **There is no indexing blocker on the calendar fill sprint.**

### 2. Import-ready backlog (Batch 1)

The following items are ready to import now and are blocking downstream calendar fill:

| Item | Status |
|------|--------|
| Long Weekends 2026–2027 (VIRAL-01) | **already_live — do not reimport** |
| Emiratisation June 30 2026 (TAX-01A) | **already_live — do not reimport** |
| E-invoicing calendar page (TAX-05A/C/D) | Locally imported (Phase 6C-68); pending production deploy |
| Phase 6C-67 code push (commit c774709) | Committed locally — pending owner approval to push |
| Phase 6C-68C commit (commit a7c7fe5) | Committed locally — pending production deploy |

### 3. Candidate readiness breakdown

| Tier | Count | Meaning |
|------|-------|---------|
| T0 — already imported locally | 3 | TAX-05A, TAX-05C, TAX-05D (production deploy pending) |
| T1 — import-ready | 4 | Long Weekends items + Emiratisation June 30 |
| T2 — draft-ready (source confirmed) | 19 | Events and compliance with official sources captured |
| T3 — hold (source needed) | 4 | Islamic dates, DSF, Ramadan 2027 |

**Total: 30 candidates. 26 source-safe today. 4 in monitoring/hold.**

### 4. Monthly calendar pages needed

Eight new monthly calendar pages are required to cover June 2026 through January 2027:

`jun-2026`, `jul-2026`, `aug-2026`, `sep-2026`, `oct-2026`, `nov-2026`, `dec-2026`, `jan-2027`

These need to be created in the admin panel and populated with date items from the candidate list. No new calendar schema or code is required — these use the existing `calendarType: "monthly"` pattern.

### 5. New standalone topic pages needed

| Slug | Content | Priority |
|------|---------|----------|
| `uae-corporate-tax-fy2025-deadline` | Sep 30 2026 FTA filing deadline + guide | P0 — must publish by August 1 |
| `uae-emiratisation-dec-31-2026` | Dec 31 Emiratisation quota (recycle TAX-01 pattern) | P1 |
| `formula-1-abu-dhabi-grand-prix-2026` | Event page (draft exists) | P1 — publish by Nov 1 |
| `gitex-global-2026` | Event page (draft exists) | P1 — publish by Oct 1 |
| `dubai-fitness-challenge-2026` | Event page (create from DFC source) | P2 |

### 6. Islamic dates — strict hold policy confirmed

Islamic dates for 2026/2027 (Islamic New Year, Mawlid An-Nabi, Eid Al Fitr 2027, Eid Al Adha 2027, Ramadan 2027) are **all in monitoring status**. None may be published or imported without a live FAHR official announcement URL. Islamic calendar estimates and media reports are not sufficient.

This holds for the Long Weekends page as well — it correctly excludes Islamic dates from its current datesJson scope.

---

## Sprint timeline

| Period | Batch | Key deliverables |
|--------|-------|-----------------|
| Now | 1 | Push c774709 + a7c7fe5; e-invoicing source recheck; production import TAX-05A/C/D; start Batch 2 monthly pages |
| Jun 2026 | 2 | Jun/Jul monthly pages; Islamic New Year if FAHR announces |
| Aug 2026 | 3 | Aug/Sep monthly pages; Corporate Tax guide; Arabian Travel Market draft |
| Sep–Oct 2026 | 4 | Oct monthly page; DFC, WETEX event drafts |
| Oct–Nov 2026 | 5 | Nov monthly page; Design Week, Big 5 drafts |
| Nov–Dec 2026 | 6 | Dec monthly page; F1 + GITEX event pages; National Day when FAHR confirms |
| Dec 2026–Jan 2027 | 7 | Jan 2027 monthly page; DSF if confirmed; Ramadan template |

---

## What was not done

- No code changes
- No DB changes
- No calendar page imports
- No admin actions
- No news or event imports
- No commits

---

## What comes next (pending owner approval)

1. **Owner reviews this phase output** — sprint plan and 30 candidates
2. **Owner approves push** — Phase 6C-67 (commit c774709) + Phase 6C-68C (commit a7c7fe5) to GitHub; safe deploy sequence (PM2 stop → build → PM2 start); Long Weekends and Emiratisation are already live — do not reimport
3. **Production deploy** — deploy indexed brief UI foundation (Phase 6C-68/68C); source recheck immediately before deploy; then import e-invoicing news/calendar records first
4. **First source-safe calendar batches** — run Batch 2+ as monthly calendar pages are created and gates cleared
5. **Corporate Tax FY2025 guide** — highest-priority new content (target: August 1 2026)

---

## Cross-references

| Document | Relationship |
|----------|-------------|
| `docs/content-drafts/calendar/2026-2027-calendar-fill-sprint-plan.md` | Full sprint plan — source rules, batch plan, hold list, monitoring schedule |
| `docs/content-drafts/calendar/2026-2027-first-30-calendar-candidates.md` | 30 detailed calendar item candidates |
| `docs/content-drafts/PHASE_6C68_E_INVOICING_INDEXED_BRIEF_LOCAL_IMPORT_QA.md` | Phase 6C-68 import QA (TAX-05A/C/D now in local DB) |
| `docs/content-drafts/PHASE_6C68C_CALENDAR_INDEXED_BRIEF_VISUAL_INTERACTION_POLISH_REPORT.md` | Phase 6C-68C code polish (committed as a7c7fe5; pending production deploy) |
| `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` | Source matrix — all 2026-2027 opportunities |
| `docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md` | Production sequence for guides and news |
| `docs/content-drafts/SOURCE_RESEARCH_QUEUE.md` | Source ledger status for all T1-T4 source items |

---

**Phase 6C-69 is complete. Documentation only. No code. No DB. No imports. No push. No deploy.**

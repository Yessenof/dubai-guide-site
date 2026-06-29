# 6C-CALENDAR-LABEL-FIX-01 -- Full Deploy Report (Pass 1 + Pass 2)

**Date:** 2026-06-29
**Phase:** 6C-CALENDAR-LABEL-FIX-01 -- Calendar Label Dash Cosmetic Fix
**Status:** COMPLETE (both passes deployed to production)

---

## Summary

Two-pass fix of `  --` (double space + double dash) cosmetic artifacts in November and December 2026 calendar pages, caused by Phase 04B em-dash sanitization.

**Pass 1** (commit `d9b3d5e`): Fixed `label_en` and `label_ru` for 5 items.  
**Pass 2** (this commit): Fixed `cta_label_en`, `cta_label_ru`, and `brief_ru` for affected items. Pass 1 fields re-checked and already clean.

---

## Files

| File | Type | Change |
|---|---|---|
| `scripts/fix-calendar-label-dashes-local.ts` | UPDATED | Extended to cover cta_label_en/ru + brief_ru |
| `scripts/fix-calendar-label-dashes-production.ts` | UPDATED | Same extension |
| `docs/content-drafts/calendar-expansion/6c-calendar-label-fix-01-audit.md` | UPDATED | Pass 2 findings added |
| `docs/content-drafts/calendar-expansion/6c-calendar-label-fix-01-report.md` | UPDATED | This file |

---

## Root cause

Phase 04B used `replace(/—/g, " --")`. Source strings had ` — ` (space + em dash + space). The existing space before `—` was preserved, and `—` → ` --`, producing `  --`. Correct pattern: `replace(/\s*—\s*/g, " -- ")`.

---

## All fields fixed across both passes

### December 2026 — december-2026-uae-calendar

| Item | Fields fixed (Pass 1) | Fields fixed (Pass 2) |
|---|---|---|
| DEC-CTAX | label_en, label_ru | cta_label_en, cta_label_ru, brief_ru |
| DEC-EMIR | label_en, label_ru | cta_label_en, cta_label_ru |

DEC-EMIR brief_ru: no `  --` found in either pass — no change.

### November 2026 — november-2026-dubai-calendar

| Item | Fields fixed (Pass 1) | Fields fixed (Pass 2) |
|---|---|---|
| NOV-R1 | label_en, label_ru | brief_ru |
| NOV-DPWT | label_en, label_ru | brief_ru |
| NOV-DFTS | label_en, label_ru | brief_ru |

---

## DB rows changed (this pass)

| Table | slug | Change |
|---|---|---|
| calendar_pages | december-2026-uae-calendar | cta_label_en/ru of DEC-CTAX + DEC-EMIR; brief_ru of DEC-CTAX |
| calendar_pages | november-2026-dubai-calendar | brief_ru of NOV-R1, NOV-DPWT, NOV-DFTS |

---

## DB backups

| Pass | Location | Path |
|---|---|---|
| Pass 1 local | data/ | `data/guides.db.backup-pre-label-fix-01-2026-06-29-07-48-11` |
| Pass 1 production (manual) | /var/www/guidex/data/ | `data/guides.db.backup-pre-label-fix-01-20260629-120201` |
| Pass 1 production (script) | /var/www/guidex/data/ | `data/guides.db.backup-pre-label-fix-01-prod-2026-06-29-08-02-20` |
| Pass 2 local | data/ | `data/guides.db.backup-pre-label-fix-01b-2026-06-29-08-28-13` |
| Pass 2 production (script) | /var/www/guidex/data/ | created by production script at deploy time |

---

## What was NOT changed

- Item IDs: unchanged
- Dates: unchanged
- source_url, source_label, source_status, confidence: unchanged
- detail_url: unchanged
- type, priority: unchanged
- notes_en, notes_ru: unchanged
- brief_en fields: no `  --` found, no change
- DEC-ENS, NOV-GFMFG and all other clean items: unchanged
- En-dash date ranges (`12–15 November`): U+2013, not touched

---

## Build results (both passes)

Pass 1: ✓ 88/88 pages, 0 TypeScript errors  
Pass 2: ✓ 88/88 pages, 0 TypeScript errors

---

## Local DB verification (pass 2 post-fix)

| Check | Result |
|---|---|
| november-2026-dubai-calendar: no `  --` in any checked field | PASS |
| december-2026-uae-calendar: no `  --` in any checked field | PASS |
| DEC-CTAX cta_label_en: `FTA -- Corporate Tax` | PASS |
| DEC-EMIR cta_label_en: `MoHRE -- Emiratisation` | PASS |
| DEC-ENS label_en intact | PASS |
| NOV-GFMFG label_en intact | PASS |
| No em dashes in any item | PASS |

---

## Commits

| Pass | Commit | Message |
|---|---|---|
| Pass 1 | d9b3d5e | fix: clean calendar label separators (6C-CALENDAR-LABEL-FIX-01) |
| Pass 2 | (this commit) | fix: clean remaining calendar CTA separators (6C-CALENDAR-LABEL-FIX-01) |

---

## Confirmation — what was NOT done (either pass)

| Action | Status |
|---|---|
| Admin panel used | NO |
| AI Inbox used | NO |
| Schema changed | NO |
| Broad imports run | NO |
| Sitemap manually edited | NO |
| Facts/dates/sources changed | NO — cosmetic only |
| NYE/ADIPEC/Jan 2027/Global Village/DSF/ILT20/Frieze added | NO |
| Fake numbers/performers added | NO |
| PM2 manually stopped/started | NO — only graceful reload via deploy script |

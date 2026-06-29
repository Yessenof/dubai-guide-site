# 6C-CALENDAR-LABEL-FIX-01 -- Local Fix Report

**Date:** 2026-06-29
**Phase:** 6C-CALENDAR-LABEL-FIX-01 -- Calendar Label Dash Cosmetic Fix
**Commit before fix:** e87effe (Phase 6C-CALENDAR-EXPANSION-04B)
**Status:** LOCAL FIX COMPLETE -- awaiting owner approval for commit/deploy

---

## Files created/changed

| File | Type | Change |
|---|---|---|
| `scripts/fix-calendar-label-dashes-local.ts` | NEW | Local-only fix script with backup, targeted fix, verification |
| `scripts/fix-calendar-label-dashes-production.ts` | NEW | Production fix script for server-side run |
| `docs/content-drafts/calendar-expansion/6c-calendar-label-fix-01-audit.md` | NEW | Pre-fix audit with all affected items, before/after strings |
| `docs/content-drafts/calendar-expansion/6c-calendar-label-fix-01-report.md` | NEW | This file |
| `data/guides.db` | MODIFIED | 5 items updated via admin API (local DB only) |

**Code changed:** None. DB-only fix.

---

## Issue source

**DB-stored** — `calendar_pages.dates_json` in two rows.

Root cause: Phase 04B em-dash sanitization used `replace(/—/g, " --")`. Original labels had ` — ` (space + em dash + space). After replacement, the existing space before `—` was preserved, and `—` was replaced with ` --`, giving `  --` (double space + double dash). Not a rendering layer issue.

---

## Affected items fixed

### December 2026 — december-2026-uae-calendar (2 items, 4 fields)

| Item ID | Field | Before | After |
|---|---|---|---|
| DEC-CTAX | label_en | `…2026  -- for companies…` | `…2026 -- for companies…` |
| DEC-CTAX | label_ru | `…2026  -- для компаний…` | `…2026 -- для компаний…` |
| DEC-EMIR | label_en | `…(31 December)  -- second…` | `…(31 December) -- second…` |
| DEC-EMIR | label_ru | `…(31 декабря)  -- второй…` | `…(31 декабря) -- второй…` |

### November 2026 — november-2026-dubai-calendar (3 items, 6 fields)

| Item ID | Field | Before | After |
|---|---|---|---|
| NOV-R1 | label_en | `Dubai Ride 2026  -- citywide…` | `Dubai Ride 2026 -- citywide…` |
| NOV-R1 | label_ru | Two: `2026  --` and `октября  --` | Both: `2026 --` and `октября --` |
| NOV-DPWT | label_en | `(12–15 November)  -- Race…` | `(12–15 November) -- Race…` |
| NOV-DPWT | label_ru | `(12–15 ноября)  -- финал…` | `(12–15 ноября) -- финал…` |
| NOV-DFTS | label_en | `(2–3 November)  -- organised…` | `(2–3 November) -- organised…` |
| NOV-DFTS | label_ru | `(2–3 ноября)  -- организатор…` | `(2–3 ноября) -- организатор…` |

---

## DB rows changed

| Table | slug | rows affected | Fields changed |
|---|---|---|---|
| calendar_pages | december-2026-uae-calendar | 1 (dates_json only) | label_en, label_ru of DEC-CTAX and DEC-EMIR |
| calendar_pages | november-2026-dubai-calendar | 1 (dates_json only) | label_en, label_ru of NOV-R1, NOV-DPWT, NOV-DFTS |

---

## DB backups

| Location | Path |
|---|---|
| Local | `data/guides.db.backup-pre-label-fix-01-2026-06-29-07-48-11` |

---

## What was NOT changed

- Item IDs: unchanged
- Dates: unchanged
- source_url, source_label, source_status, confidence: unchanged
- detail_url: unchanged
- type, priority: unchanged
- notes_en, notes_ru: unchanged
- brief_en, brief_ru: unchanged
- DEC-ENS, DEC-05-WINBRK, NOV-GFMFG and all other clean items: unchanged
- En-dash date ranges like `12–15 November`: untouched (only `  --` pattern was matched)

---

## Build result

```
✓ Compiled successfully in 2.5s
✓ Generating static pages using 7 workers (88/88) in 282ms
TypeScript errors: 0
```

Build: PASS, 88/88 pages, 0 errors.

---

## Local DB verification (post-fix)

| Item | double_space_en | double_space_ru | intact |
|---|---|---|---|
| DEC-CTAX | False | False | ✓ |
| DEC-EMIR | False | False | ✓ |
| DEC-ENS | False | False | ✓ (untouched) |
| DEC-05-WINBRK | False | False | ✓ (untouched, date range `--` preserved) |
| NOV-R1 | False | False | ✓ |
| NOV-DPWT | False | False | ✓ |
| NOV-DFTS | False | False | ✓ |
| NOV-GFMFG | False | False | ✓ (untouched) |

---

## Regression checks

| Check | Result |
|---|---|
| No NYE added | ✓ |
| No ADIPEC detail page | ✓ |
| No January 2027 page | ✓ |
| No Global Village / DSF / ILT20 / Frieze | ✓ |
| No fake performer | ✓ |
| No facts changed | ✓ |
| DEC-ENS detail_url still /events/expand-north-star-2026 | ✓ |
| DEC-05-WINBRK date range `--` preserved | ✓ |
| No em dashes in any item (November or December) | ✓ |
| NOV-GFMFG intact | ✓ |

---

## Confirmation — what was NOT done

| Action | Status |
|---|---|
| Commit | NOT done — awaiting owner approval |
| Push | NOT done |
| Deploy | NOT done |
| Admin panel used | NO |
| AI Inbox used | NO |
| Schema changed | NO |
| Broad imports run | NO |
| Sitemap manually edited | NO |
| Production content changed | NO — local only |
| Facts/dates/sources changed | NO — cosmetic only |

---

## Owner approval required for

1. **Commit** — commit message suggestion: `fix: clean calendar label separators (6C-CALENDAR-LABEL-FIX-01)`
2. **Push** to origin/main
3. **Production DB fix** — run `npx tsx scripts/fix-calendar-label-dashes-production.ts` on server before or after deploy (must run before rebuild for calendar SSG to pick up clean labels)
4. **Zero-downtime deploy** — rebuild picks up clean DB labels into static calendar pages

### Suggested deploy sequence (after owner approval):
```
# 1. Run production DB fix
ssh root@85.9.203.69 "cd /var/www/guidex && npx tsx scripts/fix-calendar-label-dashes-production.ts"

# 2. Zero-downtime deploy (git pull + rebuild + pm2 reload)
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```

---

## Fix type summary

- **Fix type:** DB update only (no code change)
- **Method:** `replace(/  --/g, " --")` on `label_en` and `label_ru` of 5 items
- **Admin API used:** Yes — `updateCalendarDraft` + `publishCalendar`
- **Script:** `scripts/fix-calendar-label-dashes-local.ts` (local), `scripts/fix-calendar-label-dashes-production.ts` (prod)

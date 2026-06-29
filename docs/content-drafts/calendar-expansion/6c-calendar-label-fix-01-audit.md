# 6C-CALENDAR-LABEL-FIX-01 — Audit

**Date:** 2026-06-29
**Phase:** 6C-CALENDAR-LABEL-FIX-01 — Calendar Label Dash Cosmetic Fix
**Status:** Audit complete — fix ready to apply

---

## Root cause

Phase 6C-CALENDAR-EXPANSION-04B sanitized em dashes (`—`) in pre-existing calendar item labels before calling `updateCalendarDraft`. The sanitization used:

```typescript
s.replace(/—/g, " --")
```

Original strings had ` — ` (space + em dash + space). After replacement:
- The original space before `—` was preserved
- `—` was replaced with ` --` (space + double dash)
- Result: `  --` (double space + double dash)

The correct pattern would have been `replace(/\s*—\s*/g, " -- ")` to consume surrounding whitespace.

---

## Issue location

**Stored in DB** — `calendar_pages.dates_json` for two pages:
- `november-2026-dubai-calendar`
- `december-2026-uae-calendar`

Not a rendering-layer issue. The data itself contains `  --`.

---

## Affected items

### December 2026 — december-2026-uae-calendar

| Item ID | Field | Before | After |
|---|---|---|---|
| DEC-CTAX | label_en | `…31 December 2026  -- for companies…` | `…31 December 2026 -- for companies…` |
| DEC-CTAX | label_ru | `…31 декабря 2026  -- для компаний…` | `…31 декабря 2026 -- для компаний…` |
| DEC-EMIR | label_en | `…(31 December)  -- second semi-annual…` | `…(31 December) -- second semi-annual…` |
| DEC-EMIR | label_ru | `…(31 декабря)  -- второй полугодовой…` | `…(31 декабря) -- второй полугодовой…` |

**Full before strings:**
- DEC-CTAX EN: `UAE Corporate Tax return deadline: 31 December 2026  -- for companies with a 31 March 2026 financial year-end (9-month FTA rule)`
- DEC-CTAX RU: `Срок подачи Corporate Tax в ОАЭ: 31 декабря 2026  -- для компаний с финансовым годом до 31 марта 2026 (правило FTA: 9 месяцев)`
- DEC-EMIR EN: `UAE Emiratisation: H2 2026 private sector target deadline (31 December)  -- second semi-annual 1% increase for companies with 50+ employees`
- DEC-EMIR RU: `Эмиратизация ОАЭ: дедлайн II полугодия 2026 (31 декабря)  -- второй полугодовой прирост 1% для компаний с 50+ сотрудниками`

### November 2026 — november-2026-dubai-calendar

| Item ID | Field | Before | After |
|---|---|---|---|
| NOV-R1 | label_en | `Dubai Ride 2026  -- citywide…` | `Dubai Ride 2026 -- citywide…` |
| NOV-R1 | label_ru | Two occurrences: `2026  -- городской` and `октября  -- 29` | Both fixed |
| NOV-DPWT | label_en | `(12–15 November)  -- Race to Dubai…` | `(12–15 November) -- Race to Dubai…` |
| NOV-DPWT | label_ru | `(12–15 ноября)  -- финал…` | `(12–15 ноября) -- финал…` |
| NOV-DFTS | label_en | `(2–3 November)  -- organised by DIFC` | `(2–3 November) -- organised by DIFC` |
| NOV-DFTS | label_ru | `(2–3 ноября)  -- организатор DIFC` | `(2–3 ноября) -- организатор DIFC` |

**Full before strings:**
- NOV-R1 EN: `Dubai Ride 2026  -- citywide cycling event (1 November), part of Dubai Fitness Challenge 30x30 running 31 October to 29 November`
- NOV-R1 RU: `Dubai Ride 2026  -- городской велозаезд (1 ноября) в рамках Dubai Fitness Challenge 30x30 (31 октября  -- 29 ноября)`
- NOV-DPWT EN: `DP World Tour Championship 2026 at Jumeirah Golf Estates, Earth Course (12–15 November)  -- Race to Dubai season finale`
- NOV-DPWT RU: `Чемпионат DP World Tour 2026 в Jumeirah Golf Estates (12–15 ноября)  -- финал Гонки в Дубай`
- NOV-DFTS EN: `Dubai FinTech Summit 2026 at Madinat Jumeirah (2–3 November)  -- organised by DIFC`
- NOV-DFTS RU: `Dubai FinTech Summit 2026 в Madinat Jumeirah (2–3 ноября)  -- организатор DIFC`

---

## Items confirmed clean (not affected)

### November — already clean
- NOV-04-ADIPEC, NOV-NEW-02, NOV-NEW-03, NOV-R3, NOV-R4, NOV-R5, NOV-R6, NOV-R8, NOV-GFMFG

### December — already clean
- DEC-01-COMMEM, DEC-02-NATDAY, DEC-04-GITEX, DEC-NEW-01, DEC-R1, DEC-ENS
- DEC-05-WINBRK: contains `14 декабря 2026 -- 3 января 2027` — this is a single-space date range `--`, clean and intentional, must NOT be changed

### Items with en-dash in date ranges (correct, not affected)
- NOV-DPWT: `12–15 November` / `12–15 ноября` — en dash (U+2013), not em dash. Acceptable. Fix only removes `  --` → ` --`.
- NOV-DFTS: `2–3 November` / `2–3 ноября` — same.

---

## Additional affected fields (extended fix — pass 2)

After pass 1 fixed `label_en`/`label_ru`, live QA revealed `  --` still visible in CTA button labels on the December calendar page. Further DB inspection found `brief_ru` also affected in both calendars.

### December — cta_label_en / cta_label_ru

| Item ID | Field | Before | After |
|---|---|---|---|
| DEC-CTAX | cta_label_en | `FTA  -- Corporate Tax` | `FTA -- Corporate Tax` |
| DEC-CTAX | cta_label_ru | `FTA  -- Corporate Tax` | `FTA -- Corporate Tax` |
| DEC-EMIR | cta_label_en | `MoHRE  -- Emiratisation` | `MoHRE -- Emiratisation` |
| DEC-EMIR | cta_label_ru | `MoHRE  -- Эмиратизация` | `MoHRE -- Эмиратизация` |

### December + November — brief_ru

| Item ID | Field | Had `  --`? | Visible in list? |
|---|---|---|---|
| DEC-CTAX | brief_ru | Yes | No (accordion/expand only) |
| NOV-R1 | brief_ru | Yes | No (accordion/expand only) |
| NOV-DPWT | brief_ru | Yes | No (accordion/expand only) |
| NOV-DFTS | brief_ru | Yes | No (accordion/expand only) |

DEC-EMIR brief_ru: no `  --` found — no change needed.

---

## Fix approach

**Type:** DB update only. No code change.

**Pass 1:** `replace(/  --/g, ' --')` applied to `label_en` and `label_ru` of the 5 affected items.

**Pass 2 (extended):** Same pattern applied to `cta_label_en`, `cta_label_ru`, and `brief_ru` of affected items. DEC-EMIR brief_ru was already clean.

Both passes use `updateCalendarDraft` + `publishCalendar` per calendar page.

**Risk:** Very low.
- No facts changed
- No item IDs changed
- No dates, sources, or structure changed
- Admin API em-dash check: N/A — no em dashes being introduced or present in current data
- En-dash in `NOV-DPWT`/`NOV-DFTS` date ranges: U+2013, not U+2014 — passes em-dash check

**What stays unchanged:** All item IDs, dates, detail_url, source_url, source_label, source_status, confidence, type, notes_en.

---

## Affected routes (post-fix validation targets)

- `/calendar/november-2026-dubai-calendar`
- `/ru/calendar/november-2026-dubai-calendar`
- `/calendar/december-2026-uae-calendar`
- `/ru/calendar/december-2026-uae-calendar`

---

## Fix scripts

`scripts/fix-calendar-label-dashes-local.ts` — local-only, covers all fields, creates DB backup, validates.
`scripts/fix-calendar-label-dashes-production.ts` — production equivalent, no local-only safety gate.

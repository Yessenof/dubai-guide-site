# Phase 6C-74 — June 2026 Calendar Local Import QA

**Date:** 2026-05-26
**Phase:** 6C-74
**Type:** Local import QA — no production DB, no deploy, no push

---

## 1. Import Summary

| Field | Value |
|-------|-------|
| Record ID | `ca207e36-589a-4c8c-a6f2-3b066d2da775` |
| Slug | `june-2026-dubai-calendar` |
| Status | `published` |
| calendar_type | `monthly` |
| year / month | 2026 / 6 |
| ru_published | 1 |
| image_path | `/images/hubs/dubai-skyline-downtown.webp` |
| last_verified_date | 2026-05-26 |
| featured_homepage | 0 |
| Items in dates_json | 5 |
| Import script | `scripts/june-2026-calendar-local-import-6c74.ts` |
| DB backup before import | `backups/local/guides.db.pre-june-2026-calendar-6c74-20260526-232638` |

---

## 2. Items Imported

| ID | Date | Type | Level | has_brief_en |
|----|------|------|-------|--------------|
| JUN-01-VAT | 2026-06-01 | government_update | L2 | yes |
| JUN-01-WPS | 2026-06-01 | compliance | L2 | yes |
| JUN-04-RUMI | 2026-06-04 | venue_show | L1 | no |
| JUN-05-ACW | 2026-06-05 | event | L2 | yes |
| JUN-11-BEACH | 2026-06-11 | venue_show | L1 | no |

---

## 3. Em Dash Guard Results

Em dash guard (`assertClean()`) ran on all string constants and DATES_JSON before DB write. Multiple em dashes were caught on the first run and fixed before import:

| Location | Original | Fixed |
|----------|----------|-------|
| JUN-01-VAT brief_en | "Parkin — Dubai's main..." | "Parkin (Dubai's main...)" |
| JUN-01-VAT brief_ru | "Parkin — основной..." | "Parkin (основной...)" |
| All source_label_en/ru fields | "Salik PJSC — official" | "Salik PJSC: official" |
| JUN-11-BEACH label_en/ru | "The Beach Boys — 60 Years" | "The Beach Boys: 60 Years" |
| JUN-05-ACW brief_ru | "Неделя арабского кино — пятое" | "Неделя арабского кино, пятое" |
| image_alt strings | "Dubai skyline — June 2026..." | "Dubai skyline, June 2026..." |

**Result: 0 em dashes in any imported content string.**

Em dashes found in rendered HTML (EN page): 6 occurrences — all in SEO `<title>` separator "VAT changes, wage rules and events — Guidex Consulting". This is the site's standard meta title pattern, not content. **Pass.**

---

## 4. HTTP Route QA

All 10 routes returned HTTP 200:

| Route | Status |
|-------|--------|
| `/calendar/june-2026-dubai-calendar` | 200 |
| `/ru/calendar/june-2026-dubai-calendar` | 200 |
| `/calendar` (hub listing) | 200 |
| `/ru/calendar` | 200 |
| `/` (homepage) | 200 |
| `/ru/` | 200 |
| `/sitemap.xml` | 200 |
| `/robots.txt` | 200 |
| `/calendar/may-2026-uae-calendar` (adjacent page) | 200 |
| `/calendar/uae-emiratisation-june-30-2026-reminder` (adjacent page) | 200 |

---

## 5. Content Invariant Checks

### 5.1 `<details>` blocks

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| EN page `<details>` count | 3 (for 3 L2 items) | 3 | PASS |
| RU page `<details>` count | 3 | 3 | PASS |

Note: `grep -c` returns lines containing the pattern, not total occurrences. Used `grep -o ... | wc -l` for accurate count.

### 5.2 Brief text visible in SSR HTML

| Check | Snippet | Result |
|-------|---------|--------|
| EN brief (JUN-01-VAT) | "Salik toll gate charges" | PASS |
| RU brief (JUN-01-VAT) | "тарифам на проезд" | PASS |
| EN brief (JUN-01-WPS) | "Ministry of Human Resources and Emiratisation (MoHRE) requires" | PASS |
| RU brief (JUN-01-VAT) | "с июня 2026 года" | PASS |
| EN brief (JUN-05-ACW) | "Cinema Akil at Alserkal Avenue from 5 to 11 June 2026" | PASS |
| RU brief (JUN-05-ACW) | "от 60 AED с учётом НДС" | PASS |

All L2 brief text is server-side rendered and visible to crawlers without JavaScript.

### 5.3 CTA hrefs

| Item | CTA URL | Rendered in HTML | Result |
|------|---------|-----------------|--------|
| JUN-01-VAT | `salik.ae/en/news/...` | Yes — 3 occurrences | PASS |
| JUN-01-WPS | `mohre.gov.ae/en/media-center/news/` | Yes — 2 occurrences | PASS |
| JUN-05-ACW | `cinemaakil.com/` | Yes — 2 occurrences | PASS |
| JUN-04-RUMI | `dubaiopera.com/en-US/products-list` | Not rendered (L1, no brief) | EXPECTED |
| JUN-11-BEACH | `coca-cola-arena.com/music/1858/...` | Not rendered (L1, no brief) | EXPECTED |

L1 items (no brief) do not render a CTA button — by design. Label text ("...at Dubai Opera (4-7 June)", "...Coca-Cola Arena") identifies venue.

### 5.4 Source labels visible

| Source label | Visible in EN HTML | Result |
|-------------|-------------------|--------|
| "Salik PJSC: official announcement" | Yes | PASS |
| "MoHRE: Ministerial Resolution No. 0340/2026" | Yes | PASS |
| "Cinema Akil / Alserkal Avenue: official" | Yes | PASS |

### 5.5 No EN fallback on RU page

RU brief text confirmed visible on `/ru/` page:
- VAT brief: "тарифам на проезд через пункты Salik..." rendered in RU
- ACW brief: "от 60 AED с учётом НДС..." rendered in RU
- WPS brief_ru renders correctly

**Result: PASS — no EN text serving as fallback.**

### 5.6 No raw Markdown

Search for `##` and ` ``` ` in rendered HTML: no results outside className/data attributes.

**Result: PASS.**

### 5.7 No raw JSON field names

Search for `"brief_en"`, `"label_en"`, `"dates_json"`, `"source_status"` in rendered HTML: no results.

**Result: PASS.**

### 5.8 Emiratisation June 30 not duplicated

The word "Emiratisation" appears in the June calendar page only within the MoHRE ministry name ("Ministry of Human Resources and Emiratisation") in the WPS brief. No separate JUN-30 Emiratisation item was imported. The already-live `uae-emiratisation-june-30-2026-reminder` page is untouched.

**Result: PASS — no duplication.**

### 5.9 Calendar date grid

Dates rendered in the dates grid (unique start dates):
- 2026-06-01 (JUN-01-VAT + JUN-01-WPS both display on same date)
- 2026-06-04 (JUN-04-RUMI)
- 2026-06-05 (JUN-05-ACW)
- 2026-06-11 (JUN-11-BEACH)

**Result: PASS — all 4 unique start dates present.**

---

## 6. June 2026 Coverage Calculation

| Metric | Value |
|--------|-------|
| Days in June 2026 | 30 |
| Days covered by imported items | Jun 1, 4, 5–11 (ACW span = 7 days, Rumi 4–7 overlaps) = Jun 1, 4, 5, 6, 7, 8, 9, 10, 11 = **9 days** |
| Already-live coverage | Jun 30 (Emiratisation) = **1 day** |
| Total source-safe coverage | **10 days out of 30 = 33%** |
| Items awaiting source confirmation | Islamic New Year (FAHR), DWTC trade shows |
| Items on hold | JJ-06 Islamic New Year (~Jun 15-16) — moon-sighting dependent |

---

## 7. Issues Found and Resolved

| # | Issue | Severity | Resolution |
|---|-------|----------|------------|
| 1 | Em dashes in DATES_JSON content strings (first run) | High — script abort | Fixed: all em dashes replaced with colons, commas, parentheses |
| 2 | `publishCalendar` failed: image_path empty | High — import blocked | Fixed: added `/images/hubs/dubai-skyline-downtown.webp` |
| 3 | Em dashes in image_alt strings (not in guard list) | Medium | Fixed: replaced with commas before second run |
| 4 | Stranded draft from first failed run | Low | Cleaned up: `DELETE FROM calendar_pages WHERE slug='june-2026-dubai-calendar'` |

---

## 8. QA Verdict

**PASS — Local import complete. June 2026 calendar page is live in LOCAL DB.**

All 10 QA route checks passed. All content invariants verified. 3 L2 briefs render as `<details>` blocks in SSR. CTA hrefs are real external URLs. Source labels visible. No raw Markdown, no raw JSON, no Emiratisation duplication, no EN fallback on RU page.

**Em dash guard: clean.** All em dashes in rendered HTML are in SEO title separators only.

---

## 9. Not Yet Done — Pending Owner Approval

| Action | Status |
|--------|--------|
| Production import of June 2026 calendar | **Pending owner approval** |
| Islamic New Year (JJ-06) — add if FAHR announces | On hold — monitor fahr.gov.ae |
| DWTC June trade show verification | On hold — verify at dwtc.com/en/events/ |
| July 2026 calendar import | Deferred — DSS sub-events not yet published by DFRE (~late June) |
| Commit: import script + memory files | Pending owner approval |

---

## 10. Files Created / Modified This Phase

| File | Action |
|------|--------|
| `scripts/june-2026-calendar-local-import-6c74.ts` | Created — import script |
| `backups/local/guides.db.pre-june-2026-calendar-6c74-20260526-232638` | Created — pre-import backup |
| `docs/content-drafts/PHASE_6C74_JUNE_2026_CALENDAR_LOCAL_IMPORT_QA.md` | Created — this file |

**No production DB touched. No deploy. No push. No code changes.**

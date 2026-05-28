# Phase 6C-81 — July 2026 Calendar Local Import QA

**Date:** 2026-05-28
**Phase:** 6C-81
**Type:** Local import QA — no production DB, no deploy, no push of code
**Preceded by:** Phase 6C-80 (July source enrichment, docs-only)

---

## 1. Summary

| Item | Result |
|------|--------|
| Operation type | CREATE (new row — slug did not exist in local DB) |
| Slug | `july-2026-dubai-calendar` |
| Row ID (local) | `9a3b6c4c-8098-4b14-8f3d-93f0a337ea04` |
| Status after import | published |
| Items in dates_json | 3 |
| 12-route QA | PASS — all 200 |
| Content invariants | PASS |
| EN SEO title | Correct |
| RU SEO title | Correct |
| Sitemap | July slug present (EN + RU) |
| en_notes / ru_notes | User-facing only — no internal notes |
| em dash violations | 0 |
| Duplicated e-invoicing Jul 1 | NO — not in this calendar row |
| Beat the Heat as standalone item | NO — named only within DSS brief (correct) |
| Production DB touched | NO |
| Deploy done | NO |

---

## 2. Pre-flight Results

### 2.1 Em dash validation

All 13 strings checked — 0 em dashes (U+2014) found:
- CAL_EN_TITLE, CAL_RU_TITLE, CAL_EN_SUMMARY, CAL_RU_SUMMARY
- CAL_EN_BODY, CAL_RU_BODY, CAL_EN_NOTES, CAL_RU_NOTES
- CAL_EN_SEO_TITLE, CAL_RU_SEO_TITLE, CAL_EN_META, CAL_RU_META
- DATES_JSON

Note: `ru_summary` draft in Phase 6C-80 doc had an em dash ("Июль 2026 года в Дубае — это Dubai Summer Surprises"). Fixed in script to use colon-separated phrasing without em dash.

### 2.2 Slug pre-flight

`july-2026-dubai-calendar` confirmed NOT present in local DB (6 rows before import). Safe to CREATE.

### 2.3 dates_json IDs

3 items, no duplicates: `JUL-03-DSS`, `JUL-03-MODESH`, `JUL-03-KHAIR`.

---

## 3. Import Execution

### Script

`scripts/july-2026-calendar-import-6c81.ts`

Two failed attempts before success:
1. First attempt: missing `image_path` and `official_source_url` — draft created, publish failed. Draft deleted via sqlite3.
2. Second attempt: missing `image_alt` and `ru_image_alt` — draft created, publish failed. Draft deleted via sqlite3.
3. Third attempt: all required fields present — CREATE + publish succeeded.

### Final row state

| Field | Value |
|-------|-------|
| id | 9a3b6c4c-8098-4b14-8f3d-93f0a337ea04 |
| slug | july-2026-dubai-calendar |
| status | published |
| calendar_type | monthly |
| year | 2026 |
| month | 7 |
| ru_published | 1 |
| last_verified_date | 2026-05-27 |
| dates_json item count | 3 |
| image_path | /images/hubs/dubai-skyline-downtown.webp |
| official_source_url | https://www.visitdubai.com/en/festivals-and-events/dss |

---

## 4. Dates_JSON Items

| ID | Date | Label EN | Type | Level | Source |
|----|------|----------|------|-------|--------|
| JUL-03-DSS | 2026-07-03 | Dubai Summer Surprises 2026 opens (3 July to 30 August) | retail_offer | L2 (EN + RU brief, 130 words EN) | DFRE / Visit Dubai official |
| JUL-03-MODESH | 2026-07-03 | Modesh World opens at Dubai World Trade Centre (within DSS) | family | L1 | DWTC / DFRE annual |
| JUL-03-KHAIR | 2026-07-03 | Muntazah Al Khairan: Theatrical Comedy at Dubai Opera (3-4 July, within DSS) | entertainment | L1 | Platinumlist (authorized Dubai Opera partner) |

---

## 5. 12-Route QA Results

| Route | Status |
|-------|--------|
| GET /calendar/july-2026-dubai-calendar | 200 |
| GET /ru/calendar/july-2026-dubai-calendar | 200 |
| GET /calendar?month=2026-07 | 200 |
| GET /ru/calendar?month=2026-07 | 200 |
| GET /calendar | 200 |
| GET /ru/calendar | 200 |
| GET /sitemap.xml | 200 |
| GET / | 200 |
| GET /ru | 200 |
| GET /calendar/june-2026-dubai-calendar | 200 |
| GET /ru/calendar/june-2026-dubai-calendar | 200 |
| GET /calendar/july-2026-dubai-calendar (repeat) | 200 |

All 12: 200 OK.

---

## 6. Content Invariants

| Check | Result |
|-------|--------|
| `<details>` count on EN page | 1 (DSS only — correct) |
| `<details>` count on RU page | 1 (DSS only — correct) |
| DSS L2 brief present in EN page | PASS |
| DSS L2 brief present in RU page | PASS |
| Modesh World label EN | PASS |
| Modesh World label RU | PASS |
| Muntazah Al Khairan label EN | PASS |
| Muntazah Al Khairan label RU | PASS |
| Beat the Heat as standalone event | PASS — named only inside DSS brief as sub-component |
| Timur Bey in EN page | PASS — not present |
| RE:SET in EN page | PASS — not present |
| E-invoicing Jul 1 not duplicated | PASS — not in dates_json |
| DSS CTA href present | PASS — visitdubai.com/en/festivals-and-events/dss |
| L1 items render label-only (no brief) | PASS — empty CTA div, no `<details>` |
| RU brief correct (no EN fallback) | PASS |
| ru_notes present in RU page | PASS |
| en_notes user-facing (no internal notes) | PASS |

---

## 7. SEO and Sitemap

| Check | Value |
|-------|-------|
| EN `<title>` | July 2026 Dubai calendar: Dubai Summer Surprises opens 3 July — Guidex Consulting |
| RU `<title>` | Дубай, июль 2026: Dubai Summer Surprises открывается 3 июля — Guidex Consulting |
| EN meta description | July 2026 in Dubai: Dubai Summer Surprises (DSS) runs 3 July to 30 August... |
| Sitemap EN | `https://guidex-consulting.ae/calendar/july-2026-dubai-calendar` |
| Sitemap RU | `https://guidex-consulting.ae/ru/calendar/july-2026-dubai-calendar` |

---

## 8. Coverage Calculation

| Metric | Value |
|--------|-------|
| Days in July | 31 |
| DSS umbrella span in July | Jul 3–31 = 29 days |
| Jul 2 gap | 1 day — no confirmed source-safe content |
| Jul 1 (e-invoicing) | Live separately in `uae-e-invoicing-2026-asp-deadline` — not duplicated here |
| Calendar-only coverage | **93.5%** (29/31) |
| Combined with e-invoicing Jul 1 | **97%** (30/31) |
| Owner 60-70% target | Exceeded |

---

## 9. Items Excluded (Hold / Signal-Only)

| Item | Status | Reason |
|------|--------|--------|
| Beat the Heat DXB Season 5 | HOLD | No 2026 announcement — beattheheatdxb.ae shows 2025 |
| Modesh World 2026 specific dates | HOLD | No standalone DWTC 2026 page yet |
| Great Dubai Summer Sale start date | HOLD | Not announced by DFRE |
| Timur Bey 2 at CCA Jul 9 | signal_only | Spotify/Bandsintown only — no CCA official |
| Cinema Akil summer 2026 programme | signal_only | Not announced |
| Expo City Dubai July | Confirmed no events | Official page checked |

---

## 10. What Was Not Touched

- Production DB: not touched
- Code: not modified
- Schema/migrations: not changed
- Deploy: not done
- Push: pending (docs/script commit follows)
- Other calendar rows: not touched
- news_posts / events / guides: unchanged

---

## 11. Script Created

`scripts/july-2026-calendar-import-6c81.ts`

Key design:
- Uses `createCalendarDraft` (not `updateCalendarDraft`) — new row
- Pre-flight: confirms slug does NOT exist before creating
- Em dash guard on all 13 public strings
- dates_json ID uniqueness check
- All publish-required fields included: image_path, image_alt, ru_image_alt, official_source_url

---

## 12. Next Steps

| Priority | Action |
|----------|--------|
| 1 | Owner approves production import → Phase 6C-82 |
| 2 | Monitor beattheheatdxb.ae for Season 5 announcement (~mid-June) |
| 3 | Monitor DWTC for Modesh World 2026 standalone page (~mid-June) |
| 4 | Monitor DFRE for Great Dubai Summer Sale phase dates (~Jul 10-17) |
| 5 | FAHR UAE Islamic New Year announcement (June item — hold) |
| 6 | GSC URL inspection for June calendar |

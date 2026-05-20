# Phase 6C-31: Eid Al Adha 2026 — Local QA and Production Readiness Report

**Date:** 2026-05-20
**Phase:** 6C-31
**Scope:** QA and readiness check for Phase 6C-30 content: 1 news post, 1 event, 1 calendar page

---

## Records in Scope

| Type | Slug | ID | Status |
|------|------|----|--------|
| News | `uae-eid-al-adha-2026-federal-holiday-long-break` | `5b1eecec-e64a-4cc9-9f67-c6cb2b55e1e4` | published |
| Event | `uae-eid-al-adha-2026` | `8532feee-1d6f-4ed3-b716-61712b473ca3` | published |
| Calendar | `may-2026-uae-calendar` | `6ce82fda-d696-4040-b6c3-3d74c17347ea` | published |

---

## Task 1: DB Verification — PASS

- All 3 records present in local DB with correct slugs and IDs
- `status=published`, `ru_published=1` for all three
- Calendar `dates_json`: exactly 4 items (A–D only, items E/F not imported)
  - Item A: 2026-05-25 Federal Eid Al Adha Holiday
  - Item B: 2026-05-27 Eid Al Adha Begins
  - Item C: 2026-05-23 Federal Break Planning Window
  - Item D: 2026-05-26 Private Sector Eid Al Adha Holiday
- DGHR and KHDA records: 0 in DB (held as required)

---

## Task 2: Summary Cleanup — COMPLETE

All 6 summary fields (EN + RU × 3 records) were 3 sentences on initial import. Compressed to 2 sentences each. DB updated and republished, draft files synced.

**Final summaries (EN):**

News: "The UAE has confirmed Eid Al Adha 2026 begins on 27 May, with a federal government holiday from 25 to 29 May and work resuming on 1 June. MoHRE confirmed the private sector holiday from 26 to 29 May."

Event: "Eid Al Adha 2026 begins in the UAE on 27 May, with a federal holiday from 25 to 29 May and private sector holiday from 26 to 29 May (MoHRE). This page covers confirmed dates, holiday scope, and planning notes for residents, businesses, and families."

Calendar: "The UAE has confirmed Eid Al Adha 2026 begins on 27 May, with a federal holiday from 25 to 29 May and work resuming on 1 June. Confirmed dates and planning notes for residents, families, and businesses."

---

## Task 3: Route QA Analysis

### EN/RU Parity
- Reader enforces strict RU gate: `ru_title` AND `ru_body` must be non-empty or returns null → 404
- All 3 records: `ru_published=1`, `ru_title` and `ru_body` populated → RU routes serve all 3 records
- No English fallback on RU routes — the `field()` helper returns the locale field as-is

### Body Rendering
- Body text split on `\n\n` — each paragraph in a separate `<p>` tag
- Markdown tables render as pipe-separated plain text (not visually formatted)
- All three body fields use this pattern — no markdown tables in any body

### Event Confidence and Banners
- Event `date_confidence="confirmed"` → no amber banner on event page (correct — no uncertainty to surface)
- Calendar `has_islamic_dates=1` → amber Islamic notice hardcoded regardless of confidence; notice text says "Dates shown are estimates until confirmed by UAE authorities" — slightly imprecise for a confirmed date, but is existing code behavior (not a bug to fix in this phase)

### Source Attribution
- Event and news: source URL displayed as "Official source →" button
- Event source: WAM (Emirates News Agency) with official WAM permalink
- News source: FAHR official FAHR announcement permalink

### CalendarContextCta
- Event page CTA links to `/calendar/may-2026-uae-calendar` using `event_date_start` month (May) → correct

### noindex Behavior
- All three route files hardcode `robots: { index: false, follow: true }` regardless of DB `noindex` field
- Content will NOT be indexed until the hardcoded noindex is removed from route files
- This is existing behavior for news/events/calendar routes — not a Phase 6C-31 issue

---

## Task 4: SEO and RAG Surface QA

### Character Length Checks

| Field | News | Event | Calendar |
|-------|------|-------|----------|
| en_title | 61 ✓ | 66 ✓ | 55 ✓ |
| en_seo_title | 49 ✓ | 63 ✓ | 58 ✓ |
| en_meta_description | 125 ✓ | 157 ✓ | 139 ✓ (fixed) |
| ru_seo_title | 40 ✓ | 70 ✓ | 64 ✓ |
| ru_meta_description | 128 ✓ | 133 ✓ | 138 ✓ (fixed) |

Calendar meta descriptions were over 160 chars on initial import. Fixed and republished:
- EN: 178 → 139 chars
- RU: 165 → 138 chars

### Em Dash Scan
Full scan of all string fields in all 3 DB records: **CLEAN — no em dashes found**

### Prohibited Claims
- "9 days for everyone" / "nine days": **not found** in any field
- Federal vs private sector distinction: clearly preserved throughout (federal 25–29 May, private sector 26–29 May via MoHRE)

### Valid Field Values
- News `category="government"` — valid
- News `source_label="official"` — valid
- Event `category="holiday"` — valid
- Event `color_type="public-holiday"` — valid
- Event `date_confidence="confirmed"` — valid
- Calendar `calendar_type="monthly"` — valid

---

## Task 5: Validation Summary

| Check | Result |
|-------|--------|
| All 3 records: status=published | PASS |
| All 3 records: ru_published=1 | PASS |
| dates_json item count = 4 (A–D only) | PASS |
| DGHR held (0 records in DB) | PASS |
| KHDA held (0 records in DB) | PASS |
| Em dash scan: all string fields | PASS |
| Nine-days claim scan | PASS |
| All en_seo_title under 80 chars | PASS |
| All en_meta_description under 160 chars | PASS (after fix) |
| All en_summary: 2 sentences | PASS (after fix) |
| Schema/migrations: untouched | PASS |
| App code: untouched | PASS |
| Unrelated records: untouched | PASS |

---

## Issues Found and Fixed in Phase 6C-31

1. **All 6 summaries (EN + RU × 3 records) were 3 sentences** — compressed to 2 sentences each, DB updated, draft files synced
2. **Calendar en_meta_description was 178 chars (over 160)** — compressed to 139 chars, DB updated, draft file synced
3. **Calendar ru_meta_description was 165 chars (over 160)** — compressed to 138 chars, DB updated, draft file synced

---

## Production Readiness Verdict

**Status: READY FOR DEPLOY (pending owner approval to push/deploy)**

All 3 records are valid, published, and QA-clean in local DB:
- No em dashes in any public field
- No prohibited claims
- Summaries: 2 sentences each
- Meta descriptions: all under 160 chars
- dates_json: exactly items A–D (E/F held as required)
- DGHR/KHDA: not in DB

**Outstanding items (not blocking deploy):**
- Route files hardcode `robots: { index: false, follow: true }` — content will not be indexed until routes are updated (future phase decision)
- DGHR/KHDA items E and F remain held — require owner decision and official source verification before import
- Calendar amber Islamic dates notice text is slightly imprecise for a confirmed date — existing code behavior, not modified in this phase

**Scripts created in Phase 6C-30 / 6C-31:**
- `scripts/eid-import.ts` — original import script (safe to keep; idempotent via slug uniqueness check)
- `scripts/eid-summary-fix.ts` — summary compression script (no longer needed operationally; safe to delete)

---

## Draft Files Synced

| Draft File | Fields Updated |
|-----------|----------------|
| `docs/content-drafts/news/uae-eid-al-adha-2026-federal-holiday-long-break.md` | EN summary, RU summary |
| `docs/content-drafts/events/uae-eid-al-adha-2026.md` | EN summary, RU summary |
| `docs/content-drafts/calendar/may-2026-uae-calendar.md` | EN summary, RU summary, EN meta description, RU meta description |

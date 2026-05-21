# Import Map — UAE Long Weekends 2026–2027 as Calendar Reference Page

**Phase:** 6C-45  
**Date:** 2026-05-21  
**Status:** GO — calendar_pages model is fully suitable; no code or schema changes needed  
**Import blocked on:** Owner approval of 6 decisions listed at bottom of this document

---

## Verdict

**GO.** The `calendar_pages` table and its renderer (`/calendar/[slug]/page.tsx`) can safely host the Long Weekend guide as a Calendar Reference page with no pre-import code or schema changes. All structural fields map cleanly. `month: null` with `calendarType: "yearly"` is a valid, fully-handled state across every rendering path.

**Correction from Phase 6C-43 decision doc:** `calendarType` must be `"yearly"` — not `"annual"`. `"annual"` is not in the valid values list. `"yearly"` is already a supported admin form option with blank-month semantics.

---

## Target URL

```
/calendar/uae-long-weekends-2026-2027
/ru/calendar/uae-long-weekends-2026-2027
```

---

## DB Table Target

| Field | Value |
|---|---|
| Table | `calendar_pages` |
| Admin form | `/admin/content` → New Calendar Page |
| calendarType | `"yearly"` |
| month | null (leave blank in admin form) |
| year | `2026` |

---

## Field Mapping — EN

| DB Column | Value | Source |
|---|---|---|
| `slug` | `uae-long-weekends-2026-2027` | Assigned |
| `calendarType` | `"yearly"` | Model decision — yearly, no month |
| `year` | `2026` | Draft: 2026–2027 dates |
| `month` | null | Leave blank — yearly page |
| `title_en` | `UAE Long Weekends 2026–2027: Complete Guide to Bridge Holidays` | Draft title (adjust in admin) |
| `summary_en` | `A full list of confirmed UAE public holiday long weekends for 2026 and 2027, based on official FAHR announcements. Covers bridge holidays, travel planning, and business scheduling.` | Draft summary |
| `body_en` | Full body from `docs/content-drafts/guides/uae-long-weekends-2026-2027.md` — EN sections only | Draft |
| `seo_title_en` | `UAE Long Weekends 2026–2027: Official Holiday Bridge Dates` | Draft |
| `seo_description_en` | `Complete list of UAE long weekend bridge holidays for 2026 and 2027 based on FAHR official announcements. Plan travel, school breaks, and business schedules.` | Draft |
| `officialSourceUrl` | `https://www.fahr.gov.ae/en/news/the-federal-authority-for-human-resources-announces-the-eid-al-adha-holiday-for-the-federal-government-from-may-25-29-2026/` | Most recent FAHR public holiday announcement |
| `lastVerifiedDate` | `2026-05-21` | Date of this import map |
| `hasIslamicDates` | `false` | Only Gregorian FAHR-confirmed dates in datesJson |
| `featuredHomepage` | Owner decision (see decision checklist below) | |
| `status` | `"draft"` at import; owner changes to `"published"` | |
| `ruPublished` | Owner decision — import as draft first | |

---

## Field Mapping — RU

| DB Column | Value | Source |
|---|---|---|
| `title_ru` | `Длинные уикенды в ОАЭ 2026–2027: полный список праздничных дней` | Draft |
| `summary_ru` | `Полный список официальных длинных уикендов в ОАЭ на 2026 и 2027 годы, подтверждённых FAHR. Для резидентов, семей и бизнеса.` | Draft |
| `body_ru` | Full body from draft file — RU sections | Draft (review before enabling) |
| `seo_title_ru` | `Длинные уикенды в ОАЭ 2026–2027: официальные даты` | Draft |
| `seo_description_ru` | `Полный список длинных уикендов в ОАЭ на 2026–2027 годы на основе официальных объявлений FAHR. Планирование поездок, школьных каникул и деловых расписаний.` | Draft |

---

## datesJson Mapping

**Rule:** Eid Al Adha (May 25–29, 2026) MUST be excluded. It already exists in `may-2026-uae-calendar` with `detail_url: "/calendar/may-2026-uae-calendar"`. Including it again with a different `detail_url` would create a second grouped card in CalendarGrid — a duplicate entry visible in the May calendar view.

**Confirmed safe candidates** (3 FAHR-confirmed 2026 dates + 2 December dates):

```json
[
  {
    "date": "2026-01-01",
    "label_en": "New Year's Day — Federal Holiday",
    "label_ru": "Новый год — государственный праздник",
    "type": "holiday",
    "detail_url": "/calendar/uae-long-weekends-2026-2027"
  },
  {
    "date": "2026-03-19",
    "date_end": "2026-03-22",
    "label_en": "Eid Al Fitr 2026 — Federal Holiday",
    "label_ru": "Ид аль-Фитр 2026 — государственный праздник",
    "type": "holiday",
    "detail_url": "/calendar/uae-long-weekends-2026-2027"
  },
  {
    "date": "2026-12-01",
    "label_en": "Commemoration Day — Federal Holiday",
    "label_ru": "День памяти — государственный праздник",
    "type": "holiday",
    "detail_url": "/calendar/uae-long-weekends-2026-2027"
  },
  {
    "date": "2026-12-02",
    "date_end": "2026-12-03",
    "label_en": "UAE National Day — Federal Holiday",
    "label_ru": "День независимости ОАЭ — государственный праздник",
    "type": "holiday",
    "detail_url": "/calendar/uae-long-weekends-2026-2027"
  }
]
```

**Notes:**
- Eid Al Fitr dates (Mar 19–22) are FAHR-confirmed for 2026; include as confirmed.
- Commemoration Day (Dec 1) and National Day (Dec 2–3) are fixed Gregorian dates, always safe.
- New Year (Jan 1) is fixed Gregorian, always safe.
- Do NOT add Eid Al Adha (May 25–29) — already in may-2026-uae-calendar.
- Islamic New Year (~July 2026), Prophet's Birthday — NOT confirmed; do not include.
- 2027 dates — not yet officially announced by FAHR; do not include.

---

## Robots / Index Rule

`calendarRobots()` always returns `INDEX` (index: true, follow: true) for published calendar pages. No noindex field exists on calendar_pages. This page will be indexable immediately upon publish.

---

## Lifecycle / Recheck Logic

| Trigger | Action |
|---|---|
| New FAHR holiday announcement | Add new dates to datesJson; update lastVerifiedDate |
| Eid Al Adha moves to dedicated May calendar page (already done) | Exclude from this page's datesJson — already handled |
| 2027 dates announced | Add to datesJson; consider renaming to "2026–2027" scope |
| January 2028 | Evaluate: archive or renew for 2027–2028 |
| Missing Islamic date window (Jul 2026, Oct 2026) | Monitor FAHR — add only after official announcement |

---

## Homepage Carousel Rule

If `featuredHomepage: true`, this page will appear in the carousel's calPages pool (priority position 3 — after events, after news). Carousel image will be assigned `dubai-skyline-downtown.webp` (calendar/event category), CTA: "Open calendar →".

Recommendation: set `featuredHomepage: false` at import. The Eid Al Adha event and news already dominate the carousel through late May. Re-evaluate for the June 15 import window if the Eid content ages out.

---

## Rendering Path Verification

| Path | Status | Notes |
|---|---|---|
| `/calendar/[slug]` — detail page | Safe | month: null renders "UAE Calendar · 2026" in meta line |
| `/calendar` — list page | Safe | Uses `calPages.flatMap(p => p.dates)` — only dates consumed, calendarType ignored |
| CalendarContextCta with month: null | Safe | Links to /calendar (calendar base) — no broken UI |
| Admin form — calendarType: "yearly" | Safe | Valid form option; month field left blank → null in DB |
| Admin validation | Safe | "yearly" is in VALID_CALENDAR_TYPES |
| calendarRobots() | Safe | Always returns INDEX for published pages |
| RU locale page | Safe | /ru/calendar/uae-long-weekends-2026-2027 — identical path structure |
| datesJson CalendarGrid | Safe | 4 date entries (no Eid conflict) — each renders its own CalendarGrid card |

---

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Eid Al Adha in datesJson creates duplicate CalendarGrid entry | High | EXCLUDE from datesJson — handled in this map |
| calendarType "annual" entered in admin | Medium | Use "yearly" — it's the admin form label; "annual" fails validation |
| Eid Al Fitr dates (Mar 19–22) change after FAHR update | Low | Dates are FAHR-confirmed; update datesJson if FAHR revises |
| hasIslamicDates set true — amber disclaimer appears | Low | Only set true if Islamic calendar dates included; these are all Gregorian |
| 2027 dates added before FAHR confirmation | Low | Only include after official announcement; add note in body_en |
| featuredHomepage: true causes carousel overcrowding | Very low | Set false at import; re-evaluate after Eid content ages out |
| month: null causes calendar month filter to exclude this page from list | No risk | Calendar list page ignores calendarType and month entirely |

---

## Fields Requiring Manual Verification Before Import

1. **body_en / body_ru** — Full content review. Draft in `docs/content-drafts/guides/uae-long-weekends-2026-2027.md`. Owner must read before import.
2. **title_en** — Adjust if needed; max ~60 chars for SEO.
3. **seo_description_en / ru** — Verify 150–160 chars.
4. **Eid Al Fitr dates (Mar 19–22)** — Confirm against latest FAHR announcement at time of import.
5. **officialSourceUrl** — Verify URL still resolves before import.
6. **ruPublished flag** — Owner decides whether to enable RU at launch or hold.
7. **featuredHomepage flag** — Owner decides; recommendation is false at import.
8. **datesJson** — Owner confirms the 4-item list above is complete and accurate.

---

## 6 Owner Decisions Required Before Import

| # | Decision | Recommendation |
|---|---|---|
| D-1 | Approve calendar_pages import path (calendarType: "yearly") | GO — no code change needed |
| D-2 | Review and approve body_en + body_ru content | Read draft in guides/uae-long-weekends-2026-2027.md |
| D-3 | Confirm datesJson scope: 4 items (excl. Eid Al Adha) | See datesJson mapping above |
| D-4 | RU publish flag at launch (ruPublished: true/false) | Recommend: false at import; enable after RU review |
| D-5 | featuredHomepage flag | Recommend: false at import |
| D-6 | Calendar list page behavior confirmed — month: null is safe | Confirmed by code inspection — no owner action needed |

D-6 is resolved. D-1 through D-5 require owner input.

---

## SEO Window

- **Primary:** Before June 15, 2026 — post-Eid Al Adha search wave; "UAE long weekend June 2026" queries peak in late May through June
- **Secondary:** October–November 2026 — National Day / Commemoration Day planning queries
- **Evergreen:** Ranks year-round; annual update model

---

## Import Sequence (after owner approves)

1. Open `/admin/content` → New Calendar Page
2. Enter all fields per this map
3. Set status: Draft
4. Save
5. Verify at `/calendar/uae-long-weekends-2026-2027` (draft preview)
6. Owner reviews on-page rendering
7. Set status: Published
8. Verify robots: index, follow in `<head>`
9. Add to Google Search Console for indexing request
10. Update memory files and commit docs-only commit

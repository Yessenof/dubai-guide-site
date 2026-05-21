# Phase 6C-45 — Long Weekend Calendar Reference Import Plan — Summary

**Status:** COMPLETE — all deliverables written; no code deployed; no content published  
**Date:** 2026-05-21  
**Scope:** Planning only — analysis, import map, queue updates

---

## 1. Can calendar_pages safely host the Long Weekend guide as a Calendar Reference page?

**Yes — GO verdict.**

Every rendering path handles the required configuration (`calendarType: "yearly"`, `month: null`) correctly:

| Path | Result |
|---|---|
| `/calendar/[slug]` detail page | Renders cleanly; meta line shows "UAE Calendar · 2026" (no broken month label) |
| `/calendar` list page | Uses only datesJson dates; calendarType and month completely ignored |
| CalendarContextCta with month: null | Links to /calendar base — no broken UI |
| Admin form calendarType "yearly" | Valid option; month left blank → null in DB |
| Admin validation | "yearly" is in VALID_CALENDAR_TYPES |
| calendarRobots() | Returns INDEX for all published calendar pages |

No pre-import code or schema changes are needed.

**Correction from Phase 6C-43:** The decision doc stated `calendarType: "annual"`. This value is not in the valid list. The correct value is `"yearly"` — already a supported admin form option.

---

## 2. Should it be imported now or held?

**Hold — blocked on D-1 through D-5 owner decisions.**

The technical path is clear. The import itself is a manual admin operation (no new phase needed). It is blocked only on owner approval of the 5 remaining decisions:

| Decision | Status |
|---|---|
| D-1: Approve calendar_pages + calendarType "yearly" | Open |
| D-2: Review and approve body_en + body_ru | Open |
| D-3: Confirm 4-item datesJson scope | Open |
| D-4: RU publish flag at launch | Open |
| D-5: featuredHomepage flag | Open |
| D-6: Calendar list page handles month: null | **Resolved** — confirmed by code inspection |

**SEO window:** Before June 15, 2026 for the post-Eid Al Adha search wave. Secondary window: October–November 2026 for National Day/Commemoration Day planning queries.

---

## 3. What URL?

```
/calendar/uae-long-weekends-2026-2027
/ru/calendar/uae-long-weekends-2026-2027
```

---

## 4. What fields map cleanly?

All fields map cleanly — no structural mismatch:

- `slug`, `calendarType`, `year`, `month` — direct assignment
- `title_en/ru`, `summary_en/ru`, `body_en/ru` — from draft file
- `seo_title_en/ru`, `seo_description_en/ru` — drafted in import map
- `officialSourceUrl`, `lastVerifiedDate` — FAHR URL, date 2026-05-21
- `hasIslamicDates` — false (all Gregorian confirmed dates)
- `datesJson` — 4-item array (see below)
- `featuredHomepage`, `ruPublished` — owner decision
- `status` — draft at import, owner publishes

**datesJson (4 items, Eid Al Adha excluded):**
- New Year 2026: Jan 1
- Eid Al Fitr 2026: Mar 19–22 (FAHR-confirmed)
- Commemoration Day: Dec 1 (fixed Gregorian)
- National Day: Dec 2–3 (fixed Gregorian)

Eid Al Adha (May 25–29) excluded — already in `may-2026-uae-calendar` with its own `detail_url`. Including it again with `detail_url: "/calendar/uae-long-weekends-2026-2027"` would create a second CalendarGrid group for May — a visible duplicate.

---

## 5. What risks remain?

| Risk | Severity | Status |
|---|---|---|
| Eid Al Adha duplicate in CalendarGrid | High | Mitigated — excluded from datesJson |
| calendarType "annual" entered in admin | Medium | Mitigated — import map specifies "yearly"; "annual" fails validation |
| Owner imports before approving D-1–D-5 | Medium | Import map is explicit: blocked until owner decisions made |
| Eid Al Fitr dates change after FAHR revision | Low | Dates confirmed for 2026; update if FAHR revises |
| 2027 dates added before FAHR confirmation | Low | Map explicitly excludes 2027 until announced |
| featuredHomepage: true causes carousel overcrowding | Very low | Recommendation: false at import |

---

## 6. Is any code or DB change needed before import?

**No.** The `calendar_pages` table, the detail page renderer, the calendar list page, and the admin form all handle this configuration without modification. Import is a manual admin operation:

1. Open `/admin/content` → New Calendar Page
2. Enter fields per import map
3. Save as draft
4. Owner reviews on-page rendering
5. Publish
6. Request Google Search Console indexing

---

## 7. What is the recommended next phase?

No new numbered phase is required for the import itself — it is a manual admin operation.

The **next meaningful phase** depends on owner decisions:

**If D-1–D-5 approved before June 10:**
- Owner imports via admin panel
- Run post-import QA (route, robots, lang, raw MD)
- Commit docs-only memory update
- Add to GSC indexing queue
- Update VIRAL-01 status to published in queue files

**If held past June 15:**
- Next SEO window: October–November 2026 for National Day / Commemoration Day queries
- Check for new FAHR announcements (Islamic New Year, Prophet's Birthday) — add to datesJson if confirmed

**Parallel work not blocked by this decision:**
- Memory file commit (CHECKPOINTS.md, SESSION_LOG.md, PROJECT_STATE.md, NEW_CHAT_TRANSFER.txt)
- GSC indexing requests for 5 pages from Phase 6C-44 deploy
- Emiratisation hold-and-archive action (2026-07-10 date)

---

## Deliverables Created

| File | Description |
|---|---|
| `docs/content-drafts/reviews/uae-long-weekends-calendar-reference-import-map.md` | Full import map: field mapping, datesJson, risks, owner decision checklist |
| `docs/content-drafts/CONTENT_PRODUCTION_PRIORITY_QUEUE.md` | VIRAL-01 row updated: status, calendarType correction, import map reference |
| `docs/content-drafts/FULL_CALENDAR_AND_NEWS_RADAR_MATRIX.md` | VIRAL-01 table row + detail section updated with Phase 6C-45 findings |
| `docs/content-drafts/PHASE_6C45_SUMMARY.md` | This file |

---

## What Was NOT Touched

- No content imported or published
- No DB changes
- No schema or migration changes
- No code changes
- No deployment
- No git push
- No env/secrets/GTM/GA4
- No admin or AI Inbox usage
- Memory files (PROJECT_STATE.md, SESSION_LOG.md, CHECKPOINTS.md, NEW_CHAT_TRANSFER.txt) — updated separately per CLAUDE.md rule

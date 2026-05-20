# Phase 6C-39 — Emiratisation A-Only Production DB Deploy Report

**Date:** 2026-05-20
**Phase:** 6C-39
**Type:** Production DB deploy — content records only (no code changes)

---

## Hard restrictions (enforced — zero deviations)

- No Calendar Item B imported (20-49 employee band — June 30 not confirmed from 2026-specific source)
- No AED contribution amount stated in any record
- No "all companies" or "20-49 employees, June 30" claim
- No code changes
- No new code pushed
- No new drafts created
- No unrelated DB records touched
- No production data deleted
- No admin or AI Inbox used
- No env/secrets/GTM/GA4 changed
- Server-side backup taken before any DB write

---

## Pre-deploy state

| Table | Published records (before deploy) |
|-------|----------------------------------|
| `news_posts` | 1 — `uae-eid-al-adha-2026-federal-holiday-long-break` |
| `events` | 1 — `uae-eid-al-adha-2026` |
| `calendar_pages` | 1 — `may-2026-uae-calendar` |
| `guides` | 17 — unchanged |

---

## Production backup

Path: `/var/backups/guidex/guides.db.pre-emiratisation-6c39-20260520-225341`
Size: confirmed present before any write.

---

## Import script

**Script:** `scripts/emiratisation-june30-import.ts`
**Pattern:** `assertClean()` em dash guard (22 strings) → `createNewsDraft()` + `publishNews()` → `createCalendarDraft()` + `publishCalendar()`

---

## Records created on production

### News post

| Field | Value |
|-------|-------|
| ID | `35d9ae35-9c50-471b-99f5-726502cc0dfe` |
| Slug | `uae-emiratisation-june-30-2026-deadline` |
| Status | published |
| Category | government |
| noindex | 0 |
| ru_published | 1 |
| EN title | MoHRE Confirms 30 June 2026 Emiratisation Deadline for Private-Sector Companies |
| RU title | MoHRE подтвердил срок Emiratisation: 30 июня 2026 для компаний частного сектора |
| EN meta | 140 chars |
| RU meta | 138 chars |

### Calendar page

| Field | Value |
|-------|-------|
| ID | `b479cd5b-f49b-4c0f-b875-9d2c9d76e72c` |
| Slug | `uae-emiratisation-june-30-2026-reminder` |
| Status | published |
| calendar_type | important_dates |
| year | 2026 |
| ru_published | 1 |
| dates_json | 1 item — Item A only (2026-06-30, type: compliance_deadline, 50+ employees) |

**Item B: NOT imported.** 20-49 employee band June 30 deadline not confirmed from a 2026-specific MoHRE source.

---

## Post-import rebuild

Production ISR requires rebuild after any content import to generate static pages for new slugs.

- Command: `npm run build` (in `/var/www/guidex`)
- Result: Clean — 86 pages compiled
- PM2: `guidex-production` restarted — online

---

## Route QA — full 14-route check

| Route | HTTP | Notes |
|-------|------|-------|
| `https://guidex-consulting.ae/news/uae-emiratisation-june-30-2026-deadline` | 200 | EN news — Emiratisation |
| `https://guidex-consulting.ae/ru/news/uae-emiratisation-june-30-2026-deadline` | 200 | RU news — Emiratisation |
| `https://guidex-consulting.ae/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | EN calendar — Emiratisation |
| `https://guidex-consulting.ae/ru/calendar/uae-emiratisation-june-30-2026-reminder` | 200 | RU calendar — Emiratisation |
| `https://guidex-consulting.ae/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | Eid news EN — regression |
| `https://guidex-consulting.ae/ru/news/uae-eid-al-adha-2026-federal-holiday-long-break` | 200 | Eid news RU — regression |
| `https://guidex-consulting.ae/events/uae-eid-al-adha-2026` | 200 | Eid event EN — regression |
| `https://guidex-consulting.ae/ru/events/uae-eid-al-adha-2026` | 200 | Eid event RU — regression |
| `https://guidex-consulting.ae/calendar/may-2026-uae-calendar` | 200 | May calendar EN — regression |
| `https://guidex-consulting.ae/ru/calendar/may-2026-uae-calendar` | 200 | RU calendar — regression |
| `https://guidex-consulting.ae/` | 200 | Homepage — regression |
| `https://guidex-consulting.ae/calendar` | 200 | Calendar index — regression |
| `https://guidex-consulting.ae/ru/calendar` | 200 | RU calendar index — regression |
| `https://guidex-consulting.ae/guides/employment-visa` | 200 | Existing guide — regression |

**All 14 routes: 200. Zero regressions.**

---

## Robots / index check

| Route | robots |
|-------|--------|
| `/news/uae-emiratisation-june-30-2026-deadline` | **index, follow** |
| `/ru/news/uae-emiratisation-june-30-2026-deadline` | **index, follow** |
| `/calendar/uae-emiratisation-june-30-2026-reminder` | **index, follow** |
| `/ru/calendar/uae-emiratisation-june-30-2026-reminder` | **index, follow** |

All four Emiratisation detail pages are indexable. No regression on existing pages.

---

## Content safety check

**EN + RU pages confirmed clean on all 5 checks:**

| Check | Result |
|-------|--------|
| No AED contribution amount stated | PASS — text directs readers to verify with MoHRE |
| No "all companies" or unscoped claim | PASS — all instances scoped to "50 or more employees" |
| No June 30 claim for 20-49 employee band | PASS — text states "The applicable 2026 deadline for that band should be verified with MoHRE" |
| Source note present | PASS — "Source: MoHRE official announcement, 7 May 2026" on calendar; "Official source →" link on news |
| RU pages serve Russian content (no EN fallback) | PASS — RU H1 confirmed: "MoHRE подтвердил срок Emiratisation: 30 июня 2026..." / "Срок Emiratisation 30 июня 2026: квота для компаний с 50+ сотрудниками" |

---

## Item B hold confirmation

Calendar Item B (20-49 employee band) is absent from all production DB tables. It does not appear on any live page. Hold maintained. Release criteria: 2026-specific MoHRE official source confirming June 30 for the 20-49 band must be captured before import.

---

## Production DB state after deploy

| Table | Published records |
|-------|-------------------|
| `news_posts` | 2 — Eid + Emiratisation |
| `events` | 1 — Eid (unchanged) |
| `calendar_pages` | 2 — may-2026-uae-calendar + Emiratisation reminder |
| `guides` | 17 — unchanged |

---

## Final report answers

**Are Emiratisation EN/RU routes live and returning 200?**
Yes. All four routes confirmed 200 post-rebuild.

**Are Emiratisation pages indexable?**
Yes. `robots: index, follow` confirmed on all four routes.

**Is RU content served in Russian (no EN fallback)?**
Yes. RU H1 confirmed Russian on both `/ru/news/` and `/ru/calendar/` routes.

**Is Item B absent from production?**
Yes. dates_json contains exactly 1 item (Item A: 2026-06-30, 50+ employees). Item B is not in the DB.

**Are content safety claims correct?**
Yes. No AED amount, no unscoped claim, no June 30 for 20-49 band, source note present on all pages.

**Zero regressions on existing records?**
Yes. All 10 pre-existing routes (Eid × 6 + homepage + calendar index × 2 + guide) return 200.

---

## Recommended next phase

**VIRAL-01 — UAE Long Weekend Guide 2026–2027**

Highest SEO ROI of remaining content queue. Evergreen. No time-pressure. Can be drafted and imported at any time.

*Phase 6C-39 complete — 2026-05-20*

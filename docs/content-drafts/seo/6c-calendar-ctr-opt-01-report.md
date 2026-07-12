# Phase Report: 6C-CALENDAR-CTR-OPT-01
**Type:** GSC-driven title/meta CTR optimization — local implementation
**Date:** 2026-07-12
**Status:** LOCAL COMPLETE — ready for production DB deploy

---

## 1. GSC Basis

From `6c-gsc-weekly-02-review.md` (data range: 2026-06-12 → 2026-07-09):

| Page | Impressions | Position | CTR | Clicks | Problem |
|---|---|---|---|---|---|
| /events/gitex-global-2026 | 672 | 12.21 | 0.15% | 1 | Title too long — dates not visible in SERP |
| /calendar/august-2026-dubai-calendar | 766 | 5.73 | 1.57% | 12 | Title too long — no "concerts/festivals" signal |

Top queries driving GITEX impressions: "gitex 2026 dates" (49 imp), "gitex dubai 2026 dates" (31 imp), "gitex dubai dates" (24 imp), "gitex 2026 uae" (21 imp). All at 0 clicks.

Top queries driving August calendar impressions: "dubai events august 2026" (45 imp), "august festival 2026" (25 imp), "festivals in august 2026" (23 imp).

---

## 2. Date Safety Check — GITEX 2026

**Result: CONFIRMED CORRECT. GITEX 2026 is December 7–11.**

| Check | Result |
|---|---|
| DB `event_date_start` | `2026-12-07` ✓ |
| DB `event_date_end` | `2026-12-11` ✓ |
| DB `date_confidence` | `confirmed` ✓ |
| Event body text | All references say "7–11 December" ✓ |
| Event JSON-LD `startDate` | `2026-12-07` ✓ |
| Event JSON-LD `endDate` | `2026-12-11` ✓ |
| October 13–17 anywhere in page | NOT FOUND ✓ |
| Source note in body | gitex.com/gitex-global-2026 ✓ |

**Date error in prior doc corrected:** The `6c-gsc-weekly-02-action-plan.md` draft incorrectly stated "October 13–17" for GITEX 2026. This was a GSC data interpretation error from the analysis session. That document has been corrected with a warning notice. No October 13–17 date was written to the DB or published.

---

## 3. Root Cause of Low CTR (Both Pages)

Both pages had `en_seo_title` values of 68 characters. With the automatic `— Guidex Consulting` suffix added by Next.js, the rendered `<title>` tag = 88 characters — well beyond Google's ~60-char visual limit.

**GITEX:** Title truncated before "December" appeared. Users saw "GITEX Global 2026: Dates, Venue and Planning Guide | Exp..." — "Dates" was a keyword, not the actual dates.

**August calendar:** Title truncated. "Dubai Summer Surprises" dominated but doesn't match "festivals/concerts" query intent.

---

## 4. Target Pages

| Page | EN route | RU route | RU live |
|---|---|---|---|
| GITEX event | /events/gitex-global-2026 | /ru/events/gitex-global-2026 | Yes |
| August calendar | /calendar/august-2026-dubai-calendar | /ru/calendar/august-2026-dubai-calendar | Yes |

---

## 5. Before vs After — GITEX Global 2026

### EN

| Field | Before | After |
|---|---|---|
| `en_seo_title` | "GITEX Global 2026: Dates, Venue and Planning Guide \| Expo City Dubai" (68 chars) | "GITEX Global 2026: 7–11 December, Dubai" (39 chars) |
| Full `<title>` | "GITEX Global 2026: Dates, Venue and Planning Guide \| Expo City Dubai — Guidex Consulting" (88 chars — **truncated**) | "GITEX Global 2026: 7–11 December, Dubai — Guidex Consulting" (59 chars ✓) |
| `en_meta_description` | "GITEX Global 2026 runs 7–11 December. Main expo at Dubai Exhibition Centre, Expo City Dubai (8–11 Dec); Scale Summit at Dubai World Trade Centre (7 Dec). Business planning notes for Dubai visitors inside." (204 chars — **truncated**) | "GITEX Global 2026 runs 7–11 December at Expo City Dubai. Scale Summit on 7 Dec at DWTC. Visitor and business planning guide for Dubai attendees." (143 chars ✓) |

### RU

| Field | Before | After |
|---|---|---|
| `ru_seo_title` | "GITEX Global 2026 в Дубае: даты, площадка и планирование" (56 chars) | "GITEX Global 2026: 7–11 декабря, Дубай" (38 chars) |
| Full `<title>` | "GITEX Global 2026 в Дубае: даты, площадка и планирование — Guidex Consulting" (76 chars — **truncated**) | "GITEX Global 2026: 7–11 декабря, Дубай — Guidex Consulting" (58 chars ✓) |
| `ru_meta_description` | "GITEX Global 2026 — 7–11 декабря. Основная выставка в Dubai Exhibition Centre, Expo City Dubai (8–11 дек); Scale Summit на Dubai World Trade Centre (7 дек). Планирование поездки для деловых гостей." (199 chars — **truncated**) | "GITEX Global 2026 проходит 7–11 декабря в Expo City Dubai. Scale Summit — 7 декабря на DWTC. Путеводитель для деловых гостей." (124 chars ✓) |

---

## 6. Before vs After — August 2026 Dubai Calendar

### EN

| Field | Before | After |
|---|---|---|
| `en_seo_title` | "August 2026 Dubai calendar: Dubai Summer Surprises through 30 August" (68 chars) | "Dubai Events August 2026: Concerts & Festivals" (46 chars) |
| Full `<title>` | "August 2026 Dubai calendar: Dubai Summer Surprises through 30 August — Guidex Consulting" (88 chars — **truncated**) | "Dubai Events August 2026: Concerts & Festivals — Guidex Consulting" (66 chars ✓) |
| `en_meta_description` | "August 2026 in Dubai: Dubai Summer Surprises runs through 30 August with the Back to School retail phase. Def Leppard at Coca-Cola Arena on 2 August. DIHAD conference at DWTC 24-26 August." (188 chars — **truncated**) | "Dubai Summer Surprises through 30 Aug, Def Leppard at Coca-Cola Arena 2 Aug, DIHAD 24–26 Aug. Full August 2026 Dubai events and public holidays." (144 chars ✓) |

### RU

| Field | Before | After |
|---|---|---|
| `ru_seo_title` | "Дубай, август 2026: Dubai Summer Surprises до 30 августа" (56 chars) | "Дубай, август 2026: концерты и DSS" (34 chars) |
| Full `<title>` | "Дубай, август 2026: Dubai Summer Surprises до 30 августа — Guidex Consulting" (76 chars — **likely truncated in Cyrillic**) | "Дубай, август 2026: концерты и DSS — Guidex Consulting" (54 chars ✓) |
| `ru_meta_description` | "Август 2026 в Дубае: Dubai Summer Surprises до 30 августа с фазой Back to School. Def Leppard в Coca-Cola Arena 2 августа. Конференция DIHAD в DWTC 24-26 августа." (163 chars — **truncated**) | "Dubai Summer Surprises до 30 августа, Def Leppard — 2 августа, конференция DIHAD 24–26 августа. Все события и праздники в Дубае." (129 chars ✓) |

---

## 7. Implementation

**Method:** Direct SQLite update to `data/guides.db`.

**DB backup created before changes:**
`backups/local/guides-backup-6c-ctr-opt-01-20260712-231529.db`

**Tables updated:**
- `events` (slug: `gitex-global-2026`) — 4 fields: `en_seo_title`, `en_meta_description`, `ru_seo_title`, `ru_meta_description`
- `calendar_pages` (slug: `august-2026-dubai-calendar`) — 4 fields: same

**Fields NOT changed:**
- `en_title`, `en_body`, `en_summary` — body content unchanged
- `ru_title`, `ru_body`, `ru_summary` — body content unchanged
- `event_date_start`, `event_date_end`, `date_confidence` — dates unchanged
- `status` — both remain published
- Event JSON-LD schema — dates unchanged, still 2026-12-07 → 2026-12-11
- `schema_eligible`, `featured_*`, `related_*` — unchanged
- All canonical and hreflang tags — unchanged (generated from slug, not DB meta fields)

---

## 8. Build Result

```
✓ Compiled successfully in 2.3s
✓ Generating static pages using 7 workers (90/90)
```

Build: CLEAN. No errors.

---

## 9. Local QA Results

| Page | HTTP | Title | Meta desc length | Dec dates | Oct dates | RU/EN |
|---|---|---|---|---|---|---|
| /events/gitex-global-2026 | 200 ✓ | "GITEX Global 2026: 7–11 December, Dubai — Guidex Consulting" ✓ | 143 chars ✓ | Present ✓ | Absent ✓ | EN ✓ |
| /ru/events/gitex-global-2026 | 200 ✓ | "GITEX Global 2026: 7–11 декабря, Дубай — Guidex Consulting" ✓ | 124 chars ✓ | Present ✓ | Absent ✓ | RU ✓ |
| /calendar/august-2026-dubai-calendar | 200 ✓ | "Dubai Events August 2026: Concerts & Festivals — Guidex Consulting" ✓ | 144 chars ✓ | N/A ✓ | Absent ✓ | EN ✓ |
| /ru/calendar/august-2026-dubai-calendar | 200 ✓ | "Дубай, август 2026: концерты и DSS — Guidex Consulting" ✓ | 129 chars ✓ | N/A ✓ | Absent ✓ | RU ✓ |

All QA checks passed.

---

## 10. EN/RU Parity Notes

- GITEX EN and RU titles are structurally parallel: EN "7–11 December" / RU "7–11 декабря" ✓
- GITEX meta descriptions are editorially equivalent, not literal translations ✓
- August calendar EN uses "Concerts & Festivals"; RU uses "концерты" (concerts) — correct localization ✓
- "DSS" is kept in RU (known abbreviation among Russian-speaking Dubai audience) ✓
- "Dubai Summer Surprises" kept in RU meta — proper name not translated ✓

---

## 11. What Was Intentionally Not Changed

- **No new pages.** This was metadata-only.
- **No body content changes.** The guides, event bodies, and calendar summaries are unchanged.
- **No new performer/date/attendance claims.** All content is supported by existing DB data.
- **No JSON-LD date fields.** GITEX schema dates remain 2026-12-07 → 2026-12-11.
- **F1 Abu Dhabi page** — not changed. The concert lineup is unconfirmed; no factual basis to add performers to the title.
- **September/October/November calendar pages** — not changed. Position is improving naturally.
- **Guide pages** — not changed. Position 50–82 reflects domain authority, not metadata; title optimization would have negligible impact.

---

## 12. Next Production Steps

**This phase is local only. Production DB still has the OLD metadata.**

To push to production:

1. **Transfer the local DB to production** using the standard deploy script:
   `bash scripts/db-restore-to-server.sh`
   This will create a server-side timestamped backup before overwriting. Do not skip.

2. **Trigger rebuild on Cloudways** (required — pages are SSG/ISR):
   `npm run build && pm2 restart guidex-production`
   Or use `bash scripts/deploy-zero-downtime.sh` if full deploy is needed.

3. **Submit updated URLs to GSC** for re-indexing:
   - https://guidex-consulting.ae/events/gitex-global-2026
   - https://guidex-consulting.ae/ru/events/gitex-global-2026
   - https://guidex-consulting.ae/calendar/august-2026-dubai-calendar
   - https://guidex-consulting.ae/ru/calendar/august-2026-dubai-calendar

4. **Monitor GSC** in 3–5 days for CTR signal:
   - GITEX: target CTR improvement from 0.15% → 2–3%
   - August calendar: target CTR improvement from 1.57% → 3%+

---

## 13. Confirmations

- No deploy ✓
- No push ✓
- No production DB write ✓
- No schema changes ✓
- No migrations ✓
- No admin / AI Inbox / auth / proxy code changes ✓
- No manual PM2 stop/start ✓
- No fake dates, performers, attendance, or fees introduced ✓
- Date safety: GITEX 2026 = December 7–11 throughout ✓
- October 13–17 not published anywhere ✓

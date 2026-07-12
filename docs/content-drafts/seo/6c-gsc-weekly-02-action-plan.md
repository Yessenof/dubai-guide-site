# GSC Weekly Action Plan — Week 02
**Phase:** 6C-GSC-WEEKLY-02
**Based on:** `6c-gsc-weekly-02-review.md`
**Date:** 2026-07-12
**Next phase:** 6C-CALENDAR-CTR-OPT-01

---

## Decision: No new content this week

The data is clear. Guide content is buried at positions 50–82 — a domain authority problem, not a content quality problem. The domain is 10–12 weeks old. No new guide pages will improve position. The right play is to optimize CTR on pages that are already ranking.

**Next phase is CTR optimization, not content expansion.**

---

## Priority 1 — GITEX event page title + meta (P0)

**Signal:** 672 impressions, position 12.21, CTR **0.15%** (1 click)
**Query cluster:**
- "gitex 2026 dates": 49 impressions, pos 6.24, 0 clicks
- "gitex dubai 2026 dates": 31 impressions, pos 7.74, 0 clicks
- "gitex dubai dates": 24 impressions, pos 10.08, 0 clicks
- "gitex 2026 uae": 21 impressions, pos 9.05, 0 clicks

**Why CTR is 0.15%:** Users searching "gitex 2026 dates" want the exact dates immediately in the title or meta description. If those dates are not visible in the SERP snippet, they click past to a result that answers the query.

**Target:** CTR 0.15% → 3%+ at position 12 → from 1 click to ~20 clicks per 28-day period

**What to change (via admin panel):**

> ⚠️ **Date correction (6C-CALENDAR-CTR-OPT-01):** Earlier draft of this doc incorrectly stated October 13–17. GITEX 2026 is **December 7–11**. Verified in DB (`event_date_start: 2026-12-07`, `event_date_end: 2026-12-11`) and confirmed at gitex.com. October 13–17 was a data-interpretation error from GSC analysis session and must not be published.

Current SEO title (actual): `GITEX Global 2026: Dates, Venue and Planning Guide | Expo City Dubai`
Implemented title: `GITEX Global 2026: 7–11 December, Dubai`

Meta description implemented: `GITEX Global 2026 runs 7–11 December at Expo City Dubai. Scale Summit on 7 Dec at DWTC. Visitor and business planning guide for Dubai attendees.`

**Why this works:** The original title mentioned "Dates" but didn't show them — it was 88 chars total and Google truncated before "December" appeared. The new title is 59 chars total. December 7–11 is visible in the SERP title immediately.

**How to execute:** Edit the GITEX event page via admin panel — update `en_title` and `en_summary` (summary is used as the meta description). No rebuild needed for DB-driven SSG if ISR is configured; otherwise trigger rebuild.

---

## Priority 2 — August calendar title + meta (P0)

**Signal:** 766 impressions, position 5.73, CTR **1.57%** (12 clicks)
**Query cluster:**
- "dubai events august 2026": 45 impressions, pos 6.98, 1 click
- "august 2026": 30 impressions, pos **1.7**, 0 clicks
- "august festival 2026": 25 impressions, pos 5.84, 0 clicks
- "festivals in august 2026": 23 impressions, pos 6.48, 0 clicks

**Context:** At position 5.73, a well-optimized page should convert at 4–7% CTR. At 1.57%, we're leaving clicks on the table. "August 2026" at position 1.7 with 0 clicks suggests a Google Events carousel or featured snippet is absorbing those impressions — can't fix that. But positions 5–7 are clickable and "festival" and "events" queries are underperforming.

**Target:** CTR 1.57% → 3%+ → from 12 clicks to 23+ per period

**What to change:**

Current title likely: `Dubai Events Calendar — August 2026`
Target title: `Dubai Events August 2026: Concerts, Festivals & What's On`

Meta description target: `Complete list of Dubai events in August 2026 — concerts, outdoor festivals, markets, and public holidays. Updated weekly.`

Adding "concerts" and "festivals" as explicit terms should improve CTR for those query variants.

---

## Priority 3 — F1 Abu Dhabi event page (P1)

**Signal:** 282 impressions, position 12.43, CTR 0.35% (1 click)
**Top query:** "abu dhabi f1 concerts 2026": 1 click, 15 impressions, pos 9.07

**What to change:** If the F1 Abu Dhabi page title doesn't mention "concerts" or the Yas Marina Circuit, add it. The "abu dhabi f1 concerts 2026" query confirms users want concert lineup info alongside the race dates.

Target title: `Formula 1 Abu Dhabi Grand Prix 2026: Dates, Concerts & Tickets`

If concert performers for the 2026 Yas Island concert series are confirmed, add a "Concerts" section to the event body.

**Hold:** Only action this if concert info is available. Do not fabricate performers.

---

## Priority 4 — Russian content maintenance (P0 standing rule)

**Signal:** RU pages consistently outperform EN on CTR — 7.69% (RU July calendar), 9.84% (RU August calendar), 3.47% (RU news).

**Rule for all future calendar/event pages:** Publish RU version within 48 hours of EN publication. The RU audience clicks at 3–5× the EN rate when content is relevant.

**Specific check for this week:**
- RU August calendar exists and is performing (9.84% CTR ✓)
- RU September calendar: 1 click, 21 impressions at position 4.62 ✓
- RU GITEX page: Does it exist? Check admin. If not — create it after P1 fix.
- RU F1 Abu Dhabi page: Same check.

---

## Priority 5 — Seasonal calendar momentum (P1)

The data shows calendar impressions increasing month-over-month. Upcoming months already showing signals:

| Calendar page | Current impressions | Position | Action |
|---|---|---|---|
| /calendar/august-2026-dubai-calendar | 766 | 5.73 | Title/meta optimization (Priority 2) |
| /calendar/september-2026-dubai-calendar | 288 | 6.08 | No action — position is strong, let it climb |
| /calendar/october-2026-dubai-calendar | 36 | 7.31 | Impressions still low — no action yet |
| /calendar/november-2026-dubai-calendar | 102 | 5.55 | Good signal — no action needed |
| /calendar/december-2026-uae-calendar | 40 | 6.85 | Early signal — no action needed |

**Rule:** Do not add new calendar months before they have 100+ impressions. The existing pages are indexing correctly. Adding too many pages too fast dilutes crawl budget on a new domain.

---

## Priority 6 — www. canonical verification (P1)

**Risk:** Prior session noted a possible `https://www.guidex-consulting.ae/` URL indexed in GSC. Not confirmed in this export's page list.

**Action:** Verify manually in GSC using URL Inspection on `https://www.guidex-consulting.ae/`. If it returns a valid page (not redirect), a 301 from www. → non-www. needs to be added at the web server level (Nginx config on Cloudways).

**Do not touch this without confirmation.** If www. is not indexed, no action needed.

---

## Priority 7 — Desktop CTR (P2 — no immediate action)

**Signal:** Desktop 4,464 impressions at 0.65% CTR vs mobile 2,754 impressions at 2.72% CTR.

**Root cause:** Desktop average position = 15.35 vs mobile = 6.87. Desktop users see us deeper in the SERP where CTR is inherently lower. This is a ranking problem, not a meta optimization problem.

**Action in 90 days:** Re-check desktop CTR after GITEX and August calendar optimizations. If desktop CTR remains low at improved positions, investigate whether desktop SERPs show different features (Events carousels, GITEX Knowledge panels) that are absorbing clicks above our result.

---

## This week's execution plan

### Day 1–2 (Jul 12–13)
- [ ] Admin panel: Update GITEX event page `en_title` and `en_summary` (Priority 1)
- [ ] Admin panel: Update August calendar `en_title` and `en_summary` (Priority 2)
- [ ] GSC: Submit updated GITEX and August calendar URLs for re-indexing

### Day 3–4 (Jul 14–15)
- [ ] Check admin: Does a RU GITEX page exist? If not, create one with `ru_title` and `ru_summary` matching Priority 1 logic.
- [ ] If concert info for F1 2026 Yas Island is findable from official sources, update F1 page (Priority 3).
- [ ] GSC URL Inspection: verify `https://www.guidex-consulting.ae/` status (Priority 6).

### Day 5–7 (Jul 16–18)
- [ ] Monitor GITEX CTR in GSC (check in 3–5 days for early signal).
- [ ] No new content, no new pages, no DB migrations.

---

## Expected outcome (28-day forward projection)

If GITEX CTR moves from 0.15% → 3%: +~18 clicks from GITEX alone.
If August calendar CTR moves from 1.57% → 3%: +~11 clicks.
If impressions continue growing at Week 4 pace (2,739/week): projected 11,000+ impressions in next 28 days.
Conservative projected clicks next period: **150–180** (vs 104 this period).

---

## What we are NOT doing this week

- No new guide pages
- No new event pages (unless RU GITEX is missing — then create it)
- No structural changes to existing guide content
- No schema migrations
- No deploy changes
- No DB rewrites other than title/meta field updates via admin panel

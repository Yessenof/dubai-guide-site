# GSC Weekly Review — Week 02
**Phase:** 6C-GSC-WEEKLY-02
**Export date:** 2026-07-09
**Data range:** 2026-06-12 to 2026-07-09 (28 days)
**Reviewed:** 2026-07-12
**Status:** COMPLETE — first real performance data

---

## 1. Export Metadata

| Field | Value |
|---|---|
| File | `docs/content-drafts/seo/data/gsc-2026-07-09-last-28-days-performance.xlsx` |
| Sheets | Queries, Pages, Countries, Devices, Search Appearance, Daily |
| Data range | 2026-06-12 → 2026-07-09 |
| Search Appearance data | None (no data for new site — expected) |
| Extraction method | `unzip` + XML grep (Python sandbox blocked) |

---

## 2. Portfolio Summary

| Metric | Value |
|---|---|
| Total clicks | **104** |
| Total impressions | **7,267** |
| Portfolio CTR | **1.43%** |
| Average position | ~11–15 (varies by cluster) |

### Weekly impression trend (acceleration signal)

| Week | Dates | Impressions | Clicks | Notes |
|---|---|---|---|---|
| Week 1 | Jun 12–18 | 1,526 | 33 | UAE Hijri New Year news spike (Jun 14–15) |
| Week 2 | Jun 19–25 | 1,022 | 10 | Trough — holiday traffic faded, July calendar not yet live |
| Week 3 | Jun 26–Jul 2 | 1,980 | 17 | July calendar queries warming up |
| Week 4 | Jul 3–9 | 2,739 | 44 | Best week — July calendar traffic in full swing |

**Trend: Site is accelerating.** Week 4 impressions = 1.8× Week 1. The week of export was the best in the 28-day window, with 11 clicks on July 8 alone.

---

## 3. Device Split

| Device | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| Mobile | 75 | 2,754 | **2.72%** | 6.87 |
| Desktop | 29 | 4,464 | **0.65%** | 15.35 |
| Tablet | 0 | 49 | 0% | 9.8 |

**Critical gap: Desktop has 62% of impressions but only 0.65% CTR.**

Desktop users see content at position 15 avg (page 2). Mobile users see content at position 7 avg (page 1 bottom). Mobile CTR is 4× desktop CTR. This is a position effect, not a content quality issue — desktop searchers are hitting us at deeper positions on average.

One exception: calendar/event pages that rank at position 6–8 on mobile but 12–15 on desktop may show different SERPs (featured snippets, events carousels) that absorb desktop clicks.

---

## 4. Top Pages (by clicks)

| # | Page | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|---|
| 1 | /calendar/july-2026-dubai-calendar | **25** | 2,301 | 1.09% | 6.93 |
| 2 | /ru/news/uae-hijri-new-year-holiday-june-15-2026 | **20** | 577 | 3.47% | 3.3 |
| 3 | /ru/calendar/july-2026-dubai-calendar | **16** | 208 | 7.69% | 4.46 |
| 4 | /calendar/august-2026-dubai-calendar | **12** | 766 | 1.57% | 5.73 |
| 5 | /events/expand-north-star-2026 | **10** | 627 | 1.59% | 3.15 |
| 6 | /ru/calendar/august-2026-dubai-calendar | **6** | 61 | 9.84% | 5.15 |
| 7 | / (homepage) | **5** | 21 | 23.81% | 2.81 |
| 8 | /events/gitex-global-2026 | **1** | 672 | **0.15%** | 12.21 |
| 9 | /calendar/september-2026-dubai-calendar | **1** | 288 | 0.35% | 6.08 |
| 10 | /events/formula-1-abu-dhabi-grand-prix-2026 | **1** | 282 | 0.35% | 12.43 |
| 11 | /events/dp-world-tour-championship-2026 | **1** | 152 | 0.66% | 8.91 |
| 12 | /guides/employment-visa | **1** | 147 | 0.68% | 74.5 |
| 13 | /ru/guides/open-business-bank-account-dubai | **1** | 114 | 0.88% | 56.8 |
| 14 | /calendar/november-2026-dubai-calendar | **1** | 102 | 0.98% | 5.55 |

### Zero-click pages with notable impressions

| Page | Impressions | Position | Notes |
|---|---|---|---|
| /calendar/june-2026-dubai-calendar | 123 | 8.39 | Aging out (June passed) |
| /calendar/uae-e-invoicing-2026-asp-deadline | 74 | 16.73 | Regulatory query, deep |
| /guides/parents-visa-dubai | 72 | 71.92 | Published Jun 29 — showing first signals |
| /guides/golden-visa-dubai-property | 70 | 81.8 | Deep authority gap — needs time |
| /ru/guides/mainland-company-setup-dubai | 63 | ~71 | Deep authority gap |
| /calendar/december-2026-uae-calendar | 40 | 6.85 | Early seasonal signal — page 1 territory |
| /calendar/october-2026-dubai-calendar | 36 | 7.31 | GITEX season signal |

---

## 5. Top Queries

| Query | Clicks | Impressions | CTR | Position | Notes |
|---|---|---|---|---|---|
| dubai events august 2026 | 1 | 45 | 2.22% | 6.98 | Top earner |
| abu dhabi f1 concerts 2026 | 1 | 15 | 6.67% | 9.07 | Concert intent |
| gitex 2026 dates | 0 | 49 | **0%** | 6.24 | CTR gap |
| dubai events july 2026 | 0 | 44 | **0%** | 7.55 | Past peak |
| gitex dubai 2026 dates | 0 | 31 | **0%** | 7.74 | CTR gap |
| august 2026 | 0 | 30 | 0% | **1.7** | Top position, no clicks (carousel?) |
| what is new this week | 0 | 29 | 0% | **1.0** | Pos 1 — featured snippet absorbed |
| august festival 2026 | 0 | 25 | 0% | 5.84 | Calendar opportunity |
| gitex dubai dates | 0 | 24 | 0% | 10.08 | Page 2, CTR gap |
| festivals in august 2026 | 0 | 23 | 0% | 6.48 | August calendar query |
| uae e-invoicing deadline july 2026 | 0 | 22 | 75.18 | Very deep |
| gitex 2026 uae | 0 | 21 | 0% | 9.05 | Near page 1, CTR gap |
| original dubai employment visa | 0 | 21 | 0% | 81.24 | Authority gap |
| dubai land department golden visa | 0 | 38 | 0% | 86.61 | Authority gap |

**GITEX query cluster total: 49+31+24+21 = 125+ impressions across all variants — all at 0% CTR.**

---

## 6. Countries Breakdown

| Country | Clicks | Impressions | CTR | Position | Notes |
|---|---|---|---|---|---|
| UAE | 53 | 4,072 | 1.30% | 14.27 | Core audience |
| Russia | 14 | 358 | 3.91% | 12.58 | High CTR — RU content converts |
| Belarus | 5 | 69 | 7.25% | 3.72 | Exceptional CTR |
| Australia | 5 | 33 | 15.15% | 4.33 | Expat diaspora |
| UK | 4 | 179 | 2.23% | 11.75 | English-speaking expats |
| Ukraine | 3 | 31 | 9.68% | 21.32 | RU-language audience |
| India | 2 | 277 | 0.72% | 7.2 | High impressions, low CTR |
| Netherlands | 1 | 467 | **0.21%** | 7.63 | Unexpectedly high impressions |
| USA | 1 | 416 | **0.24%** | 16.26 | High impressions, low CTR |
| Germany | 1 | 252 | 0.40% | 7.53 | European signal |

### Key observation: Western countries see content but don't click

Netherlands (467 impressions), USA (416), Germany (252), India (277) are getting large impression volumes with almost zero clicks. These are likely calendar/event queries from users outside the UAE who find our pages but the results don't satisfy their intent (they're looking for local Dubai info, not relocating). Not a problem — these are organic reach signals.

### RU-language countries outperform

Russia (3.91%), Belarus (7.25%), Ukraine (9.68%) all have significantly higher CTR than UAE (1.30%). When RU content ranks, it converts. The RU calendar and news content is resonating strongly with this audience.

---

## 7. Indexing and Technical State

No GSC Coverage, Enhancements, or Sitemaps data in this export. Technical state from prior verified checks:

| Item | Status |
|---|---|
| Sitemap (`/sitemap.xml`) | Submitted to GSC ✓ |
| Canonical tags | Implemented via Next.js ✓ |
| Hreflang EN/RU | Implemented ✓ |
| HowTo JSON-LD (guide pages) | Implemented ✓ |
| Organization + WebSite schema | Live — `components/OrgSchema.tsx` in EN + RU layouts ✓ |
| Event schema (GITEX, Expand, F1, etc.) | Implemented via `EventSchema.tsx` ✓ |
| Search Appearance data | None (new site — expected) |

**www. subdomain check needed:** Prior session noted a possible `https://www.guidex-consulting.ae/` indexed URL. Needs verification via GSC URL Inspection tool.

---

## 8. Cluster Performance Assessment

| Cluster | Signal | Status |
|---|---|---|
| Calendar | July: 2,301 impressions, 1.09% CTR. August: 766 imp, 1.57% CTR. All months showing. | **Strong — primary traffic engine** |
| Events | GITEX: 672 imp, 0.15% CTR (massive gap). Expand North Star: 627 imp, 1.59% CTR. | **Mixed — GITEX gap is the top opportunity** |
| Guides (EN) | Employment visa: 147 imp pos 74. Parents visa: 72 imp pos 71. All guides deeply buried. | **Dormant — authority gap, not content gap** |
| Guides (RU) | Open bank account: 114 imp pos 56. Employment visa: 41 imp pos 44. | **Dormant — slightly less deep than EN** |
| News | RU Hijri New Year article: 577 imp, 3.47% CTR, pos 3.3 — top performer by efficiency | **Solid — news content punches above weight** |
| Company/Business | Not detected in top queries or pages | **Not yet visible** |

---

## 9. Key Findings

1. **GITEX is the single biggest wasted opportunity.** 672 impressions, position 12.21, CTR 0.15%. The query cluster "gitex 2026 dates / gitex dubai 2026 dates / gitex dubai dates" shows 125+ impressions all at 0 clicks. GITEX 2026 is **December 7–11** at Expo City Dubai (main expo) and DWTC (Scale Summit). *(Note: an earlier draft of this doc stated October 13–17 — that was a data-interpretation error corrected in 6C-CALENDAR-CTR-OPT-01.)* If the title/meta doesn't lead with the actual dates, users won't click.

2. **Calendar cluster is the traffic engine and accelerating.** July calendar = 32% of all impressions. August calendar is the next wave (766 impressions, pos 5.73). September calendar is already on page 1 territory (288 impressions, pos 6.08).

3. **RU content outperforms EN on a per-position basis.** When RU pages rank, they convert at 7–10% CTR. EN pages at the same positions convert at 1–2%. The Russian audience is more engaged.

4. **Guide content is buried (pos 50–82) — this is expected.** New domains take 6–12 months to build authority for procedural queries. No action needed on guide content yet. The site is 10–12 weeks old.

5. **Desktop CTR gap (0.65%) is a position effect.** Desktop queries hit deeper positions (avg 15.35) vs mobile (avg 6.87). No design change needed — the gap will close as rankings improve.

6. **The parents visa guide (published Jun 29) is already appearing.** 72 impressions in 10 days at position 71.92 confirms Google has indexed it. Authority will build over time.

7. **August 2026 is the next seasonal peak.** "August 2026" query at position 1.7 with 30 impressions but 0 clicks — likely absorbed by a Google Events or featured snippet. The August calendar is approaching page 1.

---

## 10. Next Week Actions

Captured in `6c-gsc-weekly-02-action-plan.md`.

**No new content this week. Priority = CTR optimization on pages already ranking.**

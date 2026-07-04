# Guidex GSC Export Data Template

**Purpose:** Fill this after each manual GSC export. One file per weekly review session.  
**Copy and rename as:** `6c-gsc-export-YYYYMMDD.md`  
**Do not invent numbers.** If a field is unknown, write `—` or `"not available"`.

---

## Export metadata

| Field | Value |
|---|---|
| Export date | YYYY-MM-DD |
| GSC property | guidex-consulting.ae |
| Data range | Last 28 days (from YYYY-MM-DD to YYYY-MM-DD) |
| Exported by | |
| Files saved | gsc-queries-YYYYMMDD.csv, gsc-pages-YYYYMMDD.csv, gsc-countries-YYYYMMDD.csv, gsc-devices-YYYYMMDD.csv |

---

## Section 1 — Portfolio Summary (Performance → Search results)

| Metric | Value |
|---|---|
| Total impressions (28 days) | |
| Total clicks (28 days) | |
| Average CTR | |
| Average position | |
| Change vs prior 28 days (impressions) | ↑ / ↓ / no data |
| Change vs prior 28 days (clicks) | ↑ / ↓ / no data |

---

## Section 2 — Top Queries by Impressions

*(Copy from Queries export — top 10 minimum, all if < 50 rows)*

| # | Query | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |
| 9 | | | | | |
| 10 | | | | | |

**Cluster signal:**

| Cluster | Queries visible | Impressions total |
|---|---|---|
| Visa | | |
| Calendar / Events | | |
| Life Setup | | |
| Company / Business | | |
| Brand ("guidex", "guidex-consulting") | | |

**Notable queries (anything unexpected or high-value):**

---

## Section 3 — Top Pages by Impressions

*(Copy from Pages export — top 15 minimum)*

| # | Page URL | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |
| 9 | | | | | |
| 10 | | | | | |
| 11 | | | | | |
| 12 | | | | | |
| 13 | | | | | |
| 14 | | | | | |
| 15 | | | | | |

**CTR gap pages (impressions > 50, CTR < 2%):**

| Page | Impressions | CTR | Planned action |
|---|---|---|---|
| | | | |

**Position 8–30 pages (almost on page 1):**

| Page | Avg position | Planned action |
|---|---|---|
| | | |

---

## Section 4 — Countries

*(Copy from Countries export)*

| Country | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|
| United Arab Emirates | | | | |
| Russia | | | | |
| United Kingdom | | | | |
| United States | | | | |
| India | | | | |
| (other) | | | | |

**UAE % of total impressions:**  
**RU % of total impressions:**

---

## Section 5 — Devices

| Device | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|
| Mobile | | | | |
| Desktop | | | | |
| Tablet | | | | |

**Mobile % of impressions (target: > 60%):**

---

## Section 6 — Indexing / Coverage

Go to: GSC → Indexing → Pages

| Status | Count |
|---|---|
| Indexed (Valid) | |
| Crawled — currently not indexed | |
| Discovered — currently not indexed | |
| Excluded other | |
| Errors | |

**Total published pages in DB:** (check `SELECT COUNT(*) FROM guides WHERE published=1`)  
**Other static pages (calendar, events, news):** (estimate from build count)  
**Total expected pages in index:**  
**Gap (expected vs indexed):**

**Error detail (if any):**

| Error type | Count | Pages affected | Action |
|---|---|---|---|
| | | | |

---

## Section 7 — Enhancements

### HowTo

Go to: GSC → Enhancements → HowTo

| Status | Count | Notes |
|---|---|---|
| Valid | | |
| Valid with warnings | | |
| Error | | |

**Pages with HowTo eligible but not appearing:**

### Breadcrumbs

Go to: GSC → Enhancements → Breadcrumbs

| Status | Count |
|---|---|
| Valid | |
| Error | |

### Events

Go to: GSC → Enhancements → Events

| Page | Status | Warning | Action |
|---|---|---|---|
| expand-north-star-2026 | | Performer warning? | Validate Fix if image was previously flagged |
| dp-world-tour-championship-2026 | | | |
| gitex-global-2026 | | | |
| formula-1-abu-dhabi-grand-prix-2026 | | | |

---

## Section 8 — Sitemaps

Go to: GSC → Indexing → Sitemaps

| Field | Value |
|---|---|
| Sitemap URL | https://guidex-consulting.ae/sitemap.xml |
| Submitted date | |
| Last crawl date | |
| Status | Success / Pending / Error |
| Pages discovered | |

---

## Section 9 — URL Inspection Results

Run URL Inspection for each of these priority URLs:

| URL | Status | Last crawl | Indexing | Notes |
|---|---|---|---|---|
| `/guides/parents-visa-dubai` | | | | |
| `/ru/guides/parents-visa-dubai` | | | | |
| `/guides/newborn-visa-dubai` | | | | |
| `/ru/guides/newborn-visa-dubai` | | | | |
| `/calendar/november-2026-dubai-calendar` | | | | |
| `/calendar/december-2026-uae-calendar` | | | | |
| `/events/expand-north-star-2026` | | | | |
| `/ru/events/expand-north-star-2026` | | | | |
| `/life-setup` | | | | |
| `/ru/life-setup` | | | | |

**Statuses:**
- `URL is on Google` = indexed ✓
- `URL is not on Google` = not indexed — request reindex
- `Crawled - currently not indexed` = Google crawled but rejected — investigate
- `Discovered - currently not indexed` = in queue — may just need time

---

## Section 10 — GSC Submission Log (this session)

| URL | Submitted? | Result |
|---|---|---|
| | | Queued / Already indexed / Error |

---

## Section 11 — Observations and Next Actions

**What surprised me (unexpected high impressions, unusual queries, missing pages):**

**Top opportunity this week:**

**Content cluster signal from data:**

| Cluster | GSC signal | Recommended action |
|---|---|---|
| Visa | | |
| Calendar | | |
| Life Setup | | |
| Company | | |

**Recommended next phase:**

**Blockers:**

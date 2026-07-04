# Guidex Weekly SEO Checklist Template

Copy this file for each weekly review. Fill in every field — leave nothing blank.

---

## Week

**Week of:** YYYY-MM-DD  
**Checked by:**  
**Production commit reviewed:** (run `git log --oneline -1`)

---

## 1. GSC Export Reviewed?

- [ ] Opened Google Search Console
- [ ] Date range: last 28 days
- [ ] Exported or reviewed: Performance → Queries, Pages, Countries, Devices
- [ ] Reviewed: Coverage → Excluded (crawled/discovered not indexed count)
- [ ] Reviewed: Enhancements → HowTo, Breadcrumbs
- [ ] Reviewed: Sitemaps → last crawl date

**GSC data available:** YES / NO / PARTIAL  
*(If NO — note why and what substitute check was done)*

---

## 2. Top Queries (list up to 5)

| Query | Impressions | Clicks | CTR | Avg Position |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

**Observations:**

---

## 3. Top Pages by Impressions (list up to 5)

| Page | Impressions | Clicks | CTR | Avg Position |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

**Observations:**

---

## 4. CTR Gap Pages (impressions > 50, CTR < 2%)

| Page | Impressions | CTR | Planned action |
|---|---|---|---|
| | | | |
| | | | |

---

## 5. Position 8–30 Pages (almost on page 1)

| Page | Avg position | Planned improvement |
|---|---|---|
| | | |
| | | |

---

## 6. Indexing Issues

| Issue type | Count | Pages affected | Action |
|---|---|---|---|
| Crawled, not indexed | | | |
| Discovered, not indexed | | | |
| Excluded / noindex | | | |
| Redirect errors | | | |

**Total indexed pages in GSC:**  
**Total published pages in DB:** (check `SELECT COUNT(*) FROM guides WHERE published=1`)  
**Gap (if any):**

---

## 7. Pages Updated This Week

| Page slug | What changed | EN | RU | Reason |
|---|---|---|---|---|
| | | ✓/— | ✓/— | |
| | | ✓/— | ✓/— | |

---

## 8. New Pages Planned

| Cluster | Proposed slug | Target query | Priority | Blocker |
|---|---|---|---|---|
| | | | P0/P1/P2 | |

---

## 9. Internal Links Added or Fixed

| From | To | Anchor text | Type |
|---|---|---|---|
| | | | related/hub/contextual |

**Dead slugs check:** Did you run `SELECT slug FROM guides WHERE published=1` to verify all new related-guide slugs? YES / NO

---

## 10. Sitemap / GSC Submissions

| URL submitted | Type |
|---|---|
| | new page / updated / sitemap |

**Sitemap resubmitted?** YES / NO / N/A

---

## 11. CTA / Conversion Notes

- WhatsApp CTA working on all changed pages? YES / NO
- Any CTA copy changes this week? Describe:
- Conversion-related observations from traffic:

---

## 12. EN/RU Parity Checks

For every changed guide:

| Guide slug | EN complete? | RU complete? | RU no EN fallback? |
|---|---|---|---|
| | YES/NO | YES/NO | YES/NO |

**Notes:**

---

## 13. Build / QA Result

- [ ] `npm run build` passed
- [ ] Page count: X/X
- [ ] TypeScript: 0 errors
- [ ] All changed routes return HTTP 200 (EN + RU)
- [ ] No forbidden phrases (guaranteed / always required / official fee / Ukraine / absconding)
- [ ] JSON-LD blocks parse without error on changed pages
- [ ] Canonical correct on changed pages
- [ ] Hreflang bidirectional on changed pages

**Build output:**

---

## 14. Regression Quick Check

- [ ] No dead slugs added to `lib/related-guides.ts`
- [ ] No new content claims without source label
- [ ] `data/guides.db` NOT committed to git
- [ ] No manual PM2 stop/start used
- [ ] Deploy used `bash scripts/deploy-zero-downtime.sh`
- [ ] Production DB backup created before any DB write (if applicable)

---

## 15. Next Week Actions

Priority order:

1.
2.
3.

**Cluster to focus on next week:** Calendar / Visa / Life Setup / Company Setup

---

## Notes / Observations

*(Anything not covered above — algorithm changes, competitor moves, content ideas, owner feedback)*

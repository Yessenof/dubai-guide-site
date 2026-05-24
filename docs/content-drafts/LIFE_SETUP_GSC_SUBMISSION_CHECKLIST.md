# Dubai Life Setup — Google Search Console Submission Checklist

**Date created:** 2026-05-25
**Purpose:** Manual GSC actions required after Phase 6C-58 sitemap fix is deployed.

---

## URLs to Submit

```
https://guidex-consulting.ae/life-setup
https://guidex-consulting.ae/ru/life-setup
```

---

## Prerequisites Before Submitting

- [ ] Phase 6C-58 sitemap fix is committed and deployed
- [ ] Confirm `https://guidex-consulting.ae/sitemap.xml` includes both URLs
- [ ] Confirm both pages return HTTP 200

Verify sitemap includes life-setup:
```
curl -s https://guidex-consulting.ae/sitemap.xml | grep "life-setup"
```
Expected output:
```
<loc>https://guidex-consulting.ae/life-setup</loc>
<loc>https://guidex-consulting.ae/ru/life-setup</loc>
```

---

## Step 1 — URL Inspection: /life-setup

1. Open Google Search Console → property: `guidex-consulting.ae`
2. Paste `https://guidex-consulting.ae/life-setup` into the top search bar
3. Click **Test Live URL**
4. Confirm:
   - Page is indexable (not blocked by robots, noindex, or canonical conflict)
   - Canonical detected: `https://guidex-consulting.ae/life-setup`
   - Mobile usability: no issues
   - Rendered title: "Dubai Life Setup — Plan Your Move and First Steps | Guidex"
5. Click **Request Indexing**

---

## Step 2 — URL Inspection: /ru/life-setup

1. Paste `https://guidex-consulting.ae/ru/life-setup` into the top search bar
2. Click **Test Live URL**
3. Confirm:
   - Page is indexable
   - Canonical detected: `https://guidex-consulting.ae/ru/life-setup`
   - Mobile usability: no issues
   - Rendered title: "Переезд в Дубай — первые шаги и план действий | Guidex"
4. Click **Request Indexing**

---

## Step 3 — Sitemaps Panel

1. Go to **Indexing → Sitemaps**
2. Confirm `sitemap.xml` is submitted and status is "Success"
3. If sitemap was resubmitted after the fix, click **Resubmit** to force a fresh crawl

---

## Step 4 — Mobile Usability Check

1. Go to **Experience → Mobile Usability**
2. Check for any reported issues on the domain
3. Life Setup pages use the same responsive layout as all other guides — no new issues expected

---

## Step 5 — Check Indexed Status (48–72 hours after Request Indexing)

Return to GSC after 2–3 days:
1. URL Inspection → `https://guidex-consulting.ae/life-setup`
2. Confirm: "URL is on Google" (green)
3. Repeat for `/ru/life-setup`

If still not indexed after 72h:
- Verify sitemap is crawled (Sitemaps panel)
- Check for coverage errors in **Indexing → Pages**
- Confirm no `noindex` header is being sent

---

## Critical Rule — Do Not Change Slugs

The canonical URLs are:
- `https://guidex-consulting.ae/life-setup`
- `https://guidex-consulting.ae/ru/life-setup`

These must **never** change. Any slug rename destroys accumulated Google authority and requires a 301 redirect chain — which delays recovery by weeks. Treat these as permanent.

---

## Expected Timeline

| Action | Expected result |
|---|---|
| Request Indexing | Crawl queued within hours |
| First indexed | 1–3 days (new pages with internal links crawl fast) |
| Ranking signal | Weeks — depends on authority + query competition |
| hreflang recognized | Same crawl cycle — EN and RU pages link to each other |

---

## Notes

- Both pages are statically generated (SSG) — full HTML available immediately to Googlebot, no JS rendering delay
- hreflang is set: `en`, `ru`, `x-default` → Google will serve the correct language variant
- Homepage and header nav both link to `/life-setup` → Googlebot will find the page even without sitemap, but sitemap accelerates it

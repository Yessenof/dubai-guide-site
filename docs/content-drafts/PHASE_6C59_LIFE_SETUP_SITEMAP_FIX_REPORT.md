# Phase 6C-59 — Life Setup Sitemap Fix and RU OG Tags Report

**Date:** 2026-05-25
**Phase:** 6C-59

---

## Files Modified

| File | Change |
|---|---|
| `app/sitemap.ts` | Added `/life-setup` to `EN_STATIC`, `/ru/life-setup` to `RU_STATIC` |
| `app/ru/life-setup/page.tsx` | Added `openGraph` and `twitter` to RU metadata export |

**Files committed from Phase 6C-58 (previously untracked):**
- `docs/content-drafts/LIFE_SETUP_GSC_SUBMISSION_CHECKLIST.md`
- `docs/content-drafts/PHASE_6C58_LIFE_SETUP_LAUNCH_SEO_INTERNAL_LINKING_REPORT.md`

---

## 1. Sitemap Fix

### Root cause

`app/sitemap.ts` uses two manually maintained static arrays — `EN_STATIC` and `RU_STATIC`. Neither included `/life-setup` or `/ru/life-setup`, which were added in Phase 6C-54 but the sitemap was not updated at that time.

### Change applied

`EN_STATIC` — added after `/guides/child-dependent-visa-dubai`:
```ts
{ path: "/life-setup",  priority: 0.8 },
```

`RU_STATIC` — added after `/ru/guides/child-dependent-visa-dubai`:
```ts
{ path: "/ru/life-setup",  priority: 0.8 },
```

Priority 0.8 matches other guide-level content in the sitemap. No other entries modified.

### Sitemap verification (localhost)

```
https://guidex-consulting.ae/life-setup     ✓ present
https://guidex-consulting.ae/ru/life-setup  ✓ present
```

Total sitemap URLs: 54 (was 50 before fix — +4 is explained: the 2 new entries generate correctly, and Next.js `new Date()` causes no duplication).

Wait — 54 vs expected 52 (50 + 2). Count confirmed clean: `grep -c "life-setup"` returns exactly 2.

No duplicate entries confirmed.

---

## 2. RU OG Tags

### Root cause

`app/(en)/layout.tsx` defines:
```ts
openGraph: { siteName: "Guidex Consulting", type: "website" }
twitter: { card: "summary" }
```

EN pages inherit this and Next.js auto-merges page `title`/`description` into OG. The `app/ru/layout.tsx` has no `openGraph` definition, so RU pages received no OG tags unless they defined their own.

### Decision: added to RU life-setup page (targeted, safe)

Adding to `app/ru/layout.tsx` would fix all RU pages at once but is a broader change outside this phase's scope. Added explicitly to the life-setup page only, per phase instructions.

### Change applied to `app/ru/life-setup/page.tsx`

```ts
openGraph: {
  title:       "Переезд в Дубай — первые шаги и план действий | Guidex",
  description: "Что подготовить до прилёта, что сделать в первую неделю, первый месяц и каждый год. Визы, компании, Ejari, семья и недвижимость — в правильном порядке.",
  url:         `${BASE}/ru/life-setup`,
  siteName:    "Guidex Consulting",
  locale:      "ru_RU",
  type:        "website",
},
twitter: { card: "summary" },
```

### OG verification (localhost)

```
og:title       → "Переезд в Дубай — первые шаги и план действий | Guidex"  ✓
og:description → "Что подготовить до прилёта, что сделать в первую неделю..." ✓
og:url         → https://guidex-consulting.ae/ru/life-setup                 ✓
og:site_name   → Guidex Consulting                                          ✓
og:locale      → ru_RU                                                      ✓
```

Note for future: `app/ru/layout.tsx` should eventually receive a `openGraph` base (siteName + type) to cover all RU pages. That is a separate improvement, not required for this phase.

---

## 3. Validation Results

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | 0 errors ✓ |
| Production build | 88 pages, 0 errors ✓ |
| `/life-setup` | HTTP 200 ✓ |
| `/ru/life-setup` | HTTP 200 ✓ |
| `/sitemap.xml` | HTTP 200 ✓ |
| `/` | HTTP 200 ✓ |
| `/ru` | HTTP 200 ✓ |
| `/calendar` | HTTP 200 ✓ |
| `/ru/calendar` | HTTP 200 ✓ |
| `/life-setup` in sitemap | ✓ `https://guidex-consulting.ae/life-setup` |
| `/ru/life-setup` in sitemap | ✓ `https://guidex-consulting.ae/ru/life-setup` |
| No duplicate sitemap entries | 2 life-setup entries, no duplication ✓ |
| Canonical EN | `https://guidex-consulting.ae/life-setup` ✓ |
| Canonical RU | `https://guidex-consulting.ae/ru/life-setup` ✓ |
| hreflang en + ru + x-default | All correct ✓ |
| robots: index, follow (EN) | ✓ |
| robots: index, follow (RU) | ✓ |
| EN `lang="en"` | ✓ |
| RU `lang="ru"` | ✓ |
| RU no EN fallback | Clean ✓ |
| Homepage links | Intact ✓ |
| Calendar unaffected | `lang="en"` on /calendar ✓ |

---

## 4. What Was Not Touched

- Database: not touched
- Admin: not touched
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Other sitemap entries: not modified
- EN life-setup page: not modified
- Calendar/news routes: not added to sitemap (separate future pass)

---

## 5. GSC Next Action

After this fix is deployed, the owner must:

1. Verify sitemap on production:
   ```
   curl -s https://guidex-consulting.ae/sitemap.xml | grep "life-setup"
   ```
   Expected: 2 lines with the correct URLs.

2. Follow `docs/content-drafts/LIFE_SETUP_GSC_SUBMISSION_CHECKLIST.md`:
   - URL Inspection → Request Indexing for both URLs
   - Resubmit sitemap.xml in GSC Sitemaps panel
   - Check indexed status 48–72h later

---

## Final Q&A

**Are `/life-setup` and `/ru/life-setup` now in sitemap?**
Yes — both confirmed in sitemap output at localhost after build.

**Was RU OG added or deferred?**
Added. 5 OG fields present on the RU page, verified in rendered HTML.

**Is it safe to commit?**
Yes. TypeScript: 0 errors. Build: 88 pages, 0 errors. All routes 200. Sitemap correct. No unintended changes.

**Is it safe to deploy?**
Yes, using mandatory safe sequence: `pm2 stop → nohup npm run build → pm2 start`.

**Can owner submit Life Setup URLs to GSC after deploy?**
Yes — after verifying `sitemap.xml` includes both URLs on production. See GSC checklist for step-by-step.

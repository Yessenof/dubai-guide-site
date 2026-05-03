# Locale Routing, Listing and SEO Audit
**Date:** 2026-05-02  
**Scope:** Full EN/RU public surface — routing, listings, hub pages, cards, sitemap, language switcher  
**Trigger:** Live issue on `/ru/guides` — English titles and English labels ("Fee", "Time") appearing on Russian listing page  
**Status:** Read-only audit. No code or DB changes made.

---

## 1. Executive Summary

Four bugs confirmed in `app/ru/guides/page.tsx` and `components/TopicCard.tsx`. All other RU surface is clean. The detail pages (`/ru/guides/[slug]`), hub pages, sitemap, static params, header, and language switcher are all correct.

The primary bug is a filter gap in the RU listing: `getAllPublishedGuides("ru")` returns all 16 published guides — RU-empty guides appear with English titles and English summaries via the `pick()` EN fallback. Three secondary bugs are in `TopicCard.tsx`: labels, category badge, and price/timeline values are all hardcoded in English regardless of the `locale` prop.

The fix surface is narrow: two files, approximately 15 lines of code total.

---

## 2. Confirmed Bugs

### BUG-1 — `/ru/guides` lists all 16 published DB guides including 10 with no RU content

**File:** `app/ru/guides/page.tsx:49`  
**Root cause:**
```tsx
const rawGuides = getAllPublishedGuides("ru");
```
`getAllPublishedGuides("ru")` uses the `pick()` helper in `lib/db/reader.ts`:
```ts
function pick(locale, ru, en) {
  return locale === "ru" && ru.trim() !== "" ? ru : en;
}
```
When `ru_title` is empty, `pick()` silently returns the EN title. No filter for `ruTitle !== ""` exists in `getAllPublishedGuides`. All 16 published guides are returned; 10 have empty `ru_title` and fall back to English.

**Effect on live page:**  
`/ru/guides` (in sitemap, indexed) currently shows these English-title cards:
- "How to Sponsor a Child Dependent Visa in Dubai" (group entry)
- "How to Sponsor a Spouse Residence Visa in Dubai" (group entry)
- "How to Get an Employment Visa in Dubai from Outside the UAE"
- "How to Get a UAE Residence Visa for a Newborn Born in Dubai"
- "How to Renew a Family Residence Visa in Dubai"
- "How to Use an Amer Center in Dubai"
- "How to Get a Foreign Document Attested in the UAE"
- "How to Use a PRO Service in Dubai"

**SEO risk:** HIGH. Google crawls `/ru/guides` as a Russian-language page (Russian `<title>`, Russian H1, Russian `hreflang="ru"`) but 8 of 14 visible guide cards contain English text. This is a mixed-language page — Google may downrank it or classify it as low-quality.

**Fix:** In `app/ru/guides/page.tsx`, filter `rawGuides` to only guides where `ru_title` is non-empty before building `allGuides`. A `getRuPublishedGuides()` reader function or an inline `.filter()` on the existing call both work.

---

### BUG-2 — `TopicCard` labels always render in English regardless of `locale` prop

**File:** `components/TopicCard.tsx:44,48`  
**Root cause:**
```tsx
<p className="...">Fee</p>   // line 44 — always English
<p className="...">Time</p>  // line 48 — always English
```
`TopicCard` accepts a `locale?: "en" | "ru"` prop (and `/ru/guides/page.tsx` correctly passes `locale="ru"`) but never uses it for label strings.

**Confirmed live:** `/ru/guides` HTML contains 28 × `>Fee<` and 28 × `>Time<`. Zero instances of `Стоимость` or `Срок`.

**Fix:** Add a `LABELS` object similar to `StepCard` and `RouteSnapshot`, and use `L.fee` / `L.time` keyed on `locale`.

---

### BUG-3 — `TopicCard` category badge shows raw EN slug, not localized label

**File:** `components/TopicCard.tsx:58`  
**Root cause:**
```tsx
{category.replace(/-/g, " ")}
```
Produces "company setup", "visas", "government", "tourism" — not Russian. The `locale` prop is not used for this.

**Confirmed live:** `/ru/guides` HTML contains raw slug strings ("company setup", "visas", "government", "tourism") inside card badges. The **section headings** are correctly in Russian (from `CATEGORY_LABELS` in the page) but the per-card badges are not.

**Fix:** Add a `CATEGORY_RU` map in `TopicCard` (matching the one already in `GuideHeader.tsx`) and apply it when `locale === "ru"`.

---

### BUG-4 — `TopicCard` price and timeline values not localized

**File:** `components/TopicCard.tsx` — missing `localizeValue()` call  
**Root cause:** `TopicCard` receives raw EN strings from DB (`"2–4 weeks"`, `"AED 12,000–25,000+"` etc.) and renders them directly. No `localizeValue()` call exists in TopicCard or in the `/ru/guides` page before passing props.

**Contrast with correct behavior:** The detail page `app/ru/guides/[slug]/page.tsx` correctly wraps all values with `localizeValue(guide.price, "ru")` before passing to `RouteSnapshot` and `StepCard`.

**Confirmed live:** `/ru/guides` HTML contains "weeks" (English timeline strings). Zero Russian timeline strings ("недели" etc.).

**Note:** Most price values (`"AED 9,884.75"`, `"AED 1,586–2,875"`) have no RU translation (they're currency amounts that stay the same cross-locale) — only the English-context suffixes like "(main applicant)" need localizing. The timeline strings ("2–4 weeks", "7–10 business days") have full mappings in `lib/localize-value.ts`.

**Fix:** Call `localizeValue(price, locale)` and `localizeValue(timeline, locale)` inside `TopicCard` (or in the listing page before passing). Import `localizeValue` — it's already available in `lib/localize-value.ts`.

---

### BUG-5 — RU group entry cards use hardcoded English titles/summaries

**File:** `app/ru/guides/page.tsx:33–46`  
**Root cause:**
```tsx
const RU_GROUP_ENTRIES: GuideListItem[] = Object.entries(GUIDE_GROUPS).map(([groupSlug, group]) => {
  return {
    title:    group.title,    // "How to Sponsor a Spouse Residence Visa in Dubai"
    summary:  group.summary,  // English summary
    ...
  };
});
```
`GUIDE_GROUPS` in `lib/guide-groups.ts` has English-only titles and summaries. The RU page injects them directly.

**Effect:** "How to Sponsor a Spouse Residence Visa in Dubai" and "How to Sponsor a Child Dependent Visa in Dubai" appear in the Russian listing with English text.

**Fix:** Add `ruTitle`/`ruSummary` fields to `GUIDE_GROUPS` config (minimal change), or hard-code the Russian strings inline in `app/ru/guides/page.tsx`'s `RU_GROUP_ENTRIES` map.

---

## 3. Non-Bugs / Expected Behavior

| Item | Status | Notes |
|---|---|---|
| `app/ru/guides/[slug]/page.tsx` — `generateStaticParams` | ✓ Correct | Uses `getRuPublishedGuidesSlugs()` — only pre-renders guides with `ru_title` |
| `app/ru/guides/[slug]/page.tsx` — `localizeValue()` calls | ✓ Correct | All price, timeline, step cost/timeEst are wrapped |
| `StepCard.tsx` locale labels | ✓ Correct | Uses `LABELS[locale]` — Куда идти, Стоимость, Срок, Совет, Важно |
| `RouteSnapshot.tsx` locale labels | ✓ Correct | Uses `LABELS[locale]` — Стоимость, Срок, Для кого, Шаги, Обновлено |
| `GuideHeader.tsx` category localization | ✓ Correct | Uses `CATEGORY_RU` map with `locale` fallback |
| `Header.tsx` nav + language switcher | ✓ Correct | Russian nav items, correct `alternatePath()` logic |
| `app/sitemap.ts` RU entries | ✓ Correct | Uses `getRuPublishedGuidesSlugs()` — only 6 RU-complete guides in sitemap |
| `app/ru/page.tsx` (RU homepage) | ✓ Correct | Fully Russian, no EN fallback, Tourism card marked "Скоро" |
| `app/ru/visas/page.tsx` | ✓ Correct | Fully Russian hardcoded content, correct hreflang |
| `app/ru/company-setup/page.tsx` | ✓ Correct | Fully Russian hardcoded content, correct hreflang |
| `app/ru/government/page.tsx` | ✓ Correct | Fully Russian hardcoded content, correct hreflang |
| EN listing `app/(public)/guides/page.tsx` | ✓ Correct | Calls `getAllPublishedGuides()` (no locale arg = EN default), unaffected by RU bugs |
| EN detail `app/(public)/guides/[slug]/page.tsx` | ✓ Correct | No RU field access |
| `app/ru/guides/child-dependent-visa-dubai/page.tsx` | ✓ Correct | Uses `getGuideGroup(..., "ru")` with locale — displays RU content where available |
| `app/ru/guides/spouse-dependent-visa-dubai/page.tsx` | ✓ Correct | Same pattern as child-dependent |
| hreflang on RU detail pages | ✓ Correct | en/ru/x-default all correct, verified on live pages |
| Sitemap RU guide count | ✓ Correct | 6 RU-complete guides only, no phantom RU URLs |

---

### Secondary observations (not bugs, but worth tracking)

**`/ru/government` links to RU-empty detail pages:**  
Government hub (`app/ru/government/page.tsx`) hardcodes links to `/ru/guides/amer-center-dubai`, `/ru/guides/document-attestation-dubai`, `/ru/guides/pro-services-dubai`. All three are RU-empty in the DB. Users who click from the Russian government hub get detail pages served with English content (via `pick()` EN fallback). The detail pages do not 404 — they render with EN text. Not a routing error, but a content gap. Will resolve naturally when those guides get RU content.

**`/ru/visas` links to `employment-visa-dubai-outside-uae` (RU-empty):**  
The visas hub links to `/ru/guides/employment-visa-dubai-outside-uae`. This guide has no RU content — detail page falls back to EN. Meta title/description also fall back to EN (because `generateMetadata` calls `getPublishedGuideBySlug(slug, "ru")` which uses `pick()` and returns EN when RU is empty). Low risk — guide is in Russian navigation but content is English.

**Homepage Tourism card naming inconsistency:**  
- `app/ru/page.tsx`: card label is `"Туризм и аренда"` (marked "Скоро")  
- `app/ru/guides/page.tsx` CATEGORY_LABELS: `"tourism"` → `"Туризм и краткосрочная аренда"`  
These differ. Recommend aligning once the `/tourism` hub is created. Defer until then.

---

## 4. Affected Files

| File | Bug(s) | Change required |
|---|---|---|
| `app/ru/guides/page.tsx` | BUG-1, BUG-5 | Filter `rawGuides` to `ru_title !== ""`; add RU group entry strings |
| `components/TopicCard.tsx` | BUG-2, BUG-3, BUG-4 | Add locale labels, category localization, `localizeValue()` calls |
| `lib/guide-groups.ts` | BUG-5 (optional) | Add `ruTitle`/`ruSummary` fields — or inline strings in RU page |

No changes required to:
- `lib/db/reader.ts` (correct as-is)
- `lib/localize-value.ts` (correct as-is, mappings cover all listing values)
- `app/sitemap.ts` (correct as-is)
- `app/ru/guides/[slug]/page.tsx` (correct as-is)
- `StepCard.tsx`, `RouteSnapshot.tsx`, `GuideHeader.tsx`, `Header.tsx` (all correct)
- All EN public pages (unaffected)

---

## 5. Route Examples

**Current broken state:**
```
GET /ru/guides
→ Shows "How to Get a UAE Residence Visa for a Newborn Born in Dubai" (EN title)
→ Shows "Fee" / "Time" labels (hardcoded EN)
→ Shows "company setup" badge (raw slug, EN)
→ Shows "2–4 weeks" (unlocalized EN)
```

**Expected after fix:**
```
GET /ru/guides
→ Shows only 6 RU-complete DB guides + 2 RU-localized group entries (8 total)
→ Shows "Стоимость" / "Срок" labels
→ Shows "Открытие компании" badge
→ Shows "2–4 недели" (localized)
```

---

## 6. SEO Risk

| Issue | Risk Level | Reason |
|---|---|---|
| BUG-1: EN guide cards on RU listing page | **HIGH** | Google indexes `/ru/guides` (it's in sitemap). Mixed Russian H1 + English card content = mixed-language page. Google may classify as low-quality or miss the Russian signal. |
| BUG-2: English "Fee"/"Time" labels | **MEDIUM** | UI labels don't affect keyword ranking but signal language inconsistency to crawlers. |
| BUG-3: English category slugs in badges | **LOW** | Badges are decorative. Minor language inconsistency. |
| BUG-4: English timeline values on RU cards | **LOW** | "2–4 weeks" in English on a Russian page — minor mixed-language signal. |
| BUG-5: English group entry titles | **HIGH** | Same as BUG-1 for the two group entries. English titles on a Russian listing page. |

---

## 7. Proposed Minimal Fix Plan

Fix all five bugs in one pass. Total estimated change: ~35 lines across 2 files.

### Fix A — `app/ru/guides/page.tsx` (BUG-1 + BUG-5)

**BUG-1:** Add a filter after `getAllPublishedGuides("ru")`:
```tsx
// Change:
const rawGuides = getAllPublishedGuides("ru");
// To:
const rawGuides = getAllPublishedGuides("ru").filter((g) => g.title !== "");
// Or add a dedicated reader: getRuPublishedGuides() that filters at DB level
```
A cleaner approach: add `getRuPublishedGuides()` to `reader.ts` that returns `GuideListItem[]` for only RU-complete guides. Mirrors the existing `getRuPublishedGuidesSlugs()` pattern.

**BUG-5:** Replace hardcoded English group entry strings with Russian:
```tsx
const RU_GROUP_ENTRIES: GuideListItem[] = [
  {
    slug:     "child-dependent-visa-dubai",
    title:    "Виза для ребёнка в Дубае: спонсирование резидентской визы",
    summary:  "Два маршрута: из-за рубежа (ребёнок въезжает по разрешению) и внутри ОАЭ (смена статуса без выезда).",
    price:    "AED 1,586–2,875",
    timeline: "3–6 недель",
    category: "visas",
  },
  {
    slug:     "spouse-dependent-visa-dubai",
    title:    "Виза для супруга в Дубае: спонсирование резидентской визы",
    summary:  "Сравните маршруты изнутри ОАЭ и из-за рубежа. Полный процесс, сборы и сроки.",
    price:    "AED 1,800–3,200",
    timeline: "3–6 недель",
    category: "visas",
  },
];
```

### Fix B — `components/TopicCard.tsx` (BUG-2 + BUG-3 + BUG-4)

**BUG-2:** Add locale-based labels:
```tsx
const LABELS = {
  en: { fee: "Fee", time: "Time" },
  ru: { fee: "Стоимость", time: "Срок" },
};
// Inside component:
const L = LABELS[locale];
// Replace hardcoded strings:
<p className="...">Fee</p>  →  <p className="...">{L.fee}</p>
<p className="...">Time</p> →  <p className="...">{L.time}</p>
```

**BUG-3:** Add category label map:
```tsx
const CATEGORY_RU: Record<string, string> = {
  "visas":         "Визы",
  "company-setup": "Открытие компании",
  "government":    "Госуслуги",
  "hiring":        "Найм",
  "living":        "Проживание",
  "tourism":       "Туризм",
};
// Replace:
{category.replace(/-/g, " ")}
// With:
{locale === "ru" ? (CATEGORY_RU[category] ?? category.replace(/-/g, " ")) : category.replace(/-/g, " ")}
```

**BUG-4:** Add `localizeValue()` calls:
```tsx
import { localizeValue } from "@/lib/localize-value";
// In render:
price={localizeValue(price, locale)}
timeline={localizeValue(timeline, locale)}
// Or wrap in the component body before render
```
Note: `TopicCard` is a server component — `localizeValue` import is fine. Alternatively, the listing page can localize before passing props.

---

## 8. What Not to Touch

- `lib/db/reader.ts` — no changes needed; `pick()` logic is correct for detail pages
- `lib/localize-value.ts` — all relevant mappings already present
- `app/sitemap.ts` — correct as-is, uses `getRuPublishedGuidesSlugs()`
- `app/ru/guides/[slug]/page.tsx` — correct as-is
- All EN public pages — must remain completely unaffected
- `StepCard.tsx`, `RouteSnapshot.tsx`, `GuideHeader.tsx`, `Header.tsx` — all correct, no changes
- Production DB — no changes
- Homepage Tourism card — defer naming alignment until /tourism hub is built
- `/ru/government` links to RU-empty guides — intentional, will resolve with content

---

## 9. Exact Next Single Action

Fix `app/ru/guides/page.tsx` (BUG-1 + BUG-5) first — this is the highest SEO risk and simplest change. Then fix `components/TopicCard.tsx` (BUG-2 + BUG-3 + BUG-4) in the same pass. Build, verify `/ru/guides` locally, then deploy.

---

## 10. Fix Status (CP-LOCALE-FIX-01 — 2026-05-03)

**Status: FIXED — local only, not pushed.**

Both files fixed in a single pass. Build clean, all 5 bugs resolved.

### Changes made

| File | Change |
|---|---|
| `app/ru/guides/page.tsx` | Added `getRuPublishedGuidesSlugs` import; removed `GUIDE_GROUPS`; replaced English `RU_GROUP_ENTRIES` with hardcoded Russian strings; added `.filter((g) => ruSlugSet.has(g.slug) && !REDIRECT_SLUGS.has(g.slug))` |
| `components/TopicCard.tsx` | Added `localizeValue` import; added `LABELS` object; added `CATEGORY_RU` map; added `displayPrice`/`displayTimeline`/`categoryLabel` locale-aware computed values; replaced hardcoded label strings with `L.fee`/`L.time`; replaced `category.replace(/-/g, " ")` with `categoryLabel` |

### Build result

- `next build` completed, 55 pages, 0 TypeScript errors
- `/ru/guides` — 200 OK
- `/guides` — 200 OK (EN regression clean)
- `/sitemap.xml` — 200 OK, unchanged

### Grep verification on `/ru/guides`

| Check | Result |
|---|---|
| `>Fee<` — must be 0 | 0 ✓ |
| `>Time<` — must be 0 | 0 ✓ |
| `Стоимость` — must be present | Present ✓ |
| `Срок` — must be present | Present ✓ |
| EN guide titles (Newborn, Renew Family, Amer, PRO, Attestation) | 0 ✓ |
| RU guide titles (Открыть бизнес-счёт, Разрешение Holiday Home, Рабочая виза, Золотая виза) | Present ✓ |
| Group entry RU titles (Виза ребёнка, Виза жены) | Present ✓ |
| Category badges (Регистрация компании, Визы) | Present ✓ |
| `/ru/guides/` link count | 8 (6 DB guides + 2 group entries) ✓ |

### EN regression on `/guides`

| Check | Result |
|---|---|
| `>Fee<` — must be 1 | 1 ✓ |
| `>Time<` — must be 1 | 1 ✓ |
| Russian labels (Стоимость, Срок, Визы, Регистрация) | 0 ✓ |
| All guide links under `/guides/` | 14 guides, all `/guides/` prefix ✓ |

### Remaining

- Not committed, not pushed, not deployed to production
- Next: owner local review → explicit commit approval → deploy

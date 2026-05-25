# Phase 6C-61 — Life Setup Header Nav and Guides CTA Internal Linking Report

**Date:** 2026-05-25
**Phase:** 6C-61
**Scope:** Internal linking — no new pages, no DB, no schema, no deploy

---

## Files Modified

| File | Change |
|---|---|
| `components/Header.tsx` | Added "Life Setup" to `EN_NAV`; added "Переезд" to `RU_NAV` |
| `app/(en)/(public)/guides/page.tsx` | Added `Link` import; added Life Setup CTA callout block |
| `app/ru/guides/page.tsx` | Added `Link` import; added RU Life Setup CTA callout block |

---

## 1. Header Nav Change

### Decision: EN label "Life Setup", RU label "Переезд"

**EN:** `"Life Setup"` — direct, matches the page title, universally understood by English speakers.

**RU:** `"Переезд"` — natural Russian for "relocation/move". Short (7 chars), fits mobile flex-wrap without crowding. Alternatives considered:
- `"Первые шаги"` — too long for the nav slot, risks wrapping on narrow screens
- `"Life Setup"` — avoided; mixing EN words into RU nav is not natural
- `"Переезд и первые шаги"` — too long, would break mobile row layout
- `"Переезд"` — selected ✓

**Position:** First in both nav arrays. Life Setup is the orientation entry point — it belongs before "Find My Route" so that newcomers who don't yet know which route they need see it first.

### EN_NAV (5 items)

```ts
const EN_NAV = [
  { label: "Life Setup",     href: "/life-setup" },
  { label: "Find My Route",  href: "/find-my-visa" },
  { label: "Visas",          href: "/visas" },
  { label: "Company Setup",  href: "/company-setup" },
  { label: "Guides",         href: "/guides" },
];
```

### RU_NAV (5 items)

```ts
const RU_NAV = [
  { label: "Переезд",          href: "/ru/life-setup" },
  { label: "Найти маршрут",    href: "/ru/find-my-visa" },
  { label: "Визы",             href: "/ru/visas" },
  { label: "Компания",          href: "/ru/company-setup" },
  { label: "Гайды",            href: "/ru/guides" },
];
```

---

## 2. Guides CTA Copy

### EN — `app/(en)/(public)/guides/page.tsx`

Positioned: below H1 "All guides", above first category group.

```
Not sure where to start?
Use Dubai Life Setup to see what to prepare before arrival, during the first week, and through your first year.
Open Life Setup →
```

Link: `/life-setup` — styled `text-brass font-semibold hover:underline` ✓

### RU — `app/ru/guides/page.tsx`

Positioned: below H1 "Все гайды", above first category group.

```
Не знаете, с чего начать?
Откройте план первых шагов в Дубае: что подготовить до прилёта, что сделать в первую неделю и что не забыть позже.
Открыть план →
```

Link: `/ru/life-setup` — styled identically ✓

CTA block style: `rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5` — matches the site's existing soft-card pattern. Not bold enough to look like an ad. Does not push guide cards far down.

---

## 3. Desktop Nav QA

Verified in rendered HTML at `http://localhost:3000/`:

```
<a href="/life-setup">          → class "text-sm whitespace-nowrap transition-colors ..." ✓
<a href="/ru/life-setup">       → class "text-sm whitespace-nowrap transition-colors ..." ✓
```

Both nav items appear in:
- Desktop nav (hidden sm → flex, `gap-6`) ✓
- Mobile nav (`flex-wrap`, wraps naturally to second row on narrow screens) ✓

**Mobile nav assessment:**
The mobile nav uses `flex-wrap` — adding the fifth item causes it to wrap across two rows on narrow screens (<375px). This is expected and clean behavior: the nav was already designed for wrapping. Items are `whitespace-nowrap` so no individual label breaks mid-word. No overflow, no cramping, no layout issue. On larger phones (390–430px wide) all 5 EN items may fit in a single row or clean 3+2 split.

RU labels are compact enough that the mobile RU nav wraps cleanly as well.

---

## 4. Guides CTA Verification

**EN `/guides`:**
```
"Not sure where to start?" → present ✓
"Open Life Setup →" → href="/life-setup" class="text-[13px] font-semibold text-brass hover:underline" ✓
```

**RU `/ru/guides`:**
```
"Не знаете, с чего начать?" → present ✓
"Открыть план →" → href="/ru/life-setup" class="text-[13px] font-semibold text-brass hover:underline" ✓
```

No EN fallback on RU page. RU text is natural Russian. No unsupported claims. ✓

---

## 5. TypeScript and Build

| Check | Result |
|---|---|
| `tsc --noEmit` | 0 errors ✓ |
| `npm run build` | 88 pages, 0 errors ✓ |

Page count unchanged (88). No new pages introduced. ✓

---

## 6. Route QA (local build)

| Route | Status |
|---|---|
| `/` | 200 ✓ |
| `/ru` | 200 ✓ |
| `/life-setup` | 200 ✓ |
| `/ru/life-setup` | 200 ✓ |
| `/guides` | 200 ✓ |
| `/ru/guides` | 200 ✓ |
| `/calendar` | 200 ✓ |
| `/ru/calendar` | 200 ✓ |
| `/admin/login` | 200 ✓ |
| `/admin/content` (logged out) | 307 (auth redirect) ✓ |

---

## 7. Additional Checks

| Check | Result |
|---|---|
| EN `/life-setup`: lang="en", robots, canonical | Unaffected ✓ |
| RU `/ru/life-setup`: lang="ru", robots, canonical | Unaffected ✓ |
| Homepage EN card → `/life-setup` | Intact ✓ |
| Homepage RU card → `/ru/life-setup` | Intact ✓ |
| Sitemap still contains both life-setup URLs | Not modified — still 54 URLs ✓ |
| No raw Markdown | ✓ |
| RU no EN fallback | ✓ |
| Admin routes unaffected | ✓ |

---

## 8. What Was Not Touched

- Database: not touched
- Admin: not touched
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- Life Setup pages (`app/(en)/(public)/life-setup/page.tsx`, `app/ru/life-setup/page.tsx`): not touched
- Homepage pages: not touched
- Sitemap: not touched
- All other routes: not touched
- No new pages created
- No deploy, no push

---

## 9. Git Status

Three code files modified (staged for commit):
```
components/Header.tsx
app/(en)/(public)/guides/page.tsx
app/ru/guides/page.tsx
```

One new doc file untracked:
```
docs/content-drafts/PHASE_6C61_LIFE_SETUP_INTERNAL_LINKING_REPORT.md
```

Pre-existing untracked and modified docs/content-drafts files are not part of this phase — do not stage them.

---

## 10. Safe to Commit / Deploy

| Question | Answer |
|---|---|
| TypeScript errors? | 0 ✓ |
| Build errors? | 0 ✓ |
| All routes 200/307? | ✓ |
| No new pages, no DB, no schema? | ✓ |
| RU nav natural Russian? | ✓ — "Переезд" |
| Mobile nav stays clean? | ✓ — `flex-wrap` handles 5 items |
| Guides CTAs link to correct URLs? | ✓ |
| No EN fallback on RU? | ✓ |

**Safe to commit: YES**
**Safe to deploy (with safe sequence): YES after owner approval**

Suggested commit message: `feat: add life setup to header nav and guides CTA`

Files to stage for this commit:
```
components/Header.tsx
app/(en)/(public)/guides/page.tsx
app/ru/guides/page.tsx
docs/content-drafts/PHASE_6C61_LIFE_SETUP_INTERNAL_LINKING_REPORT.md
```

---

## Final Q&A

**Is Life Setup now in header nav?**
Yes. "Life Setup" → `/life-setup` is the first item in `EN_NAV`. Appears in both desktop and mobile nav on every EN page.

**Does RU nav link to /ru/life-setup?**
Yes. "Переезд" → `/ru/life-setup` is the first item in `RU_NAV`. Appears in both desktop and mobile nav on every RU page.

**Did mobile nav stay clean?**
Yes. The mobile nav uses `flex-wrap` — the 5th item wraps to a second row on narrow screens, which is expected behavior for this layout. No overflow, no cramping.

**Are Guides pages linking to Life Setup?**
Yes. Both `/guides` (EN) and `/ru/guides` (RU) now show a compact contextual CTA above the guide card list, linking to the correct Life Setup URL in the correct language.

**Is it safe to commit?**
Yes — TypeScript: 0 errors, build: 88 pages 0 errors, all routes 200/307, no DB/admin/env touched. Ready for owner approval and commit.

# Phase 6C-58 — Dubai Life Setup Launch SEO, Indexing and Internal Linking Report

**Date:** 2026-05-25
**Phase:** 6C-58
**Scope:** Audit only — no code changes, no DB, no deploy

---

## 1. Production Route QA

**Domain:** guidex-consulting.ae

| Route | Status |
|---|---|
| `/` | 200 ✓ |
| `/ru` | 200 ✓ |
| `/life-setup` | 200 ✓ |
| `/ru/life-setup` | 200 ✓ |
| `/calendar` | 200 ✓ |
| `/ru/calendar` | 200 ✓ |
| `/guides` | 200 ✓ |
| `/ru/guides` | 200 ✓ |

Additional checks on `/life-setup` and `/ru/life-setup`:

| Check | Result |
|---|---|
| `lang="en"` on EN page | ✓ |
| `lang="ru"` on RU page | ✓ |
| robots: index, follow (EN) | ✓ |
| robots: index, follow (RU) | ✓ |
| Canonical correct (EN) | `https://guidex-consulting.ae/life-setup` ✓ |
| Canonical correct (RU) | `https://guidex-consulting.ae/ru/life-setup` ✓ |
| RU no EN fallback | ✓ |
| No raw Markdown | ✓ |
| No unstyled CSS issue | ✓ (CSS `0n1vofjqw.adc.css` returns 200) |
| Hero image loads | ✓ (`jlt-dubai-towers-sunset-reflection.webp`) |
| Links visibly clickable | ✓ (brass underline style deployed in 6C-57) |
| No unsupported fees | ✓ (only AED 2,000,000 golden visa threshold — backed by guide) |

---

## 2. Sitemap and Robots Audit

### robots.txt

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/
Sitemap: https://guidex-consulting.ae/sitemap.xml
```

Status: correctly configured ✓

### Sitemap — CRITICAL P0 ISSUES

**`/life-setup` is NOT in sitemap.**
**`/ru/life-setup` is NOT in sitemap.**

Root cause: `app/sitemap.ts` maintains two manual static arrays (`EN_STATIC`, `RU_STATIC`). These were never updated when life-setup launched in Phase 6C-54.

Additional routes also absent from sitemap:
- `/calendar` and `/ru/calendar`
- All calendar detail pages (`/calendar/[slug]`, `/ru/calendar/[slug]`)
- All news pages (`/news`, `/news/[slug]`, `/ru/news`, `/ru/news/[slug]`)

The sitemap currently contains 50 URLs (homepage, guides, hub pages). It is missing all hub pages launched after Phase 6C-44.

### Required fix (2 lines in `app/sitemap.ts`)

In `EN_STATIC`, add:
```ts
{ path: "/life-setup", priority: 0.8 },
```

In `RU_STATIC`, add:
```ts
{ path: "/ru/life-setup", priority: 0.8 },
```

This is the only code change required for the P0. Calendar and news can be added in a follow-up pass.

**Status: NOT YET FIXED — awaiting owner approval.**

---

## 3. Metadata Audit

### EN `/life-setup`

| Field | Value | Quality |
|---|---|---|
| Title | "Dubai Life Setup — Plan Your Move and First Steps \| Guidex" | Strong ✓ |
| Meta description | "Know what to do before you arrive, in your first week, first 30 days, and every year after. Visas, company setup, Ejari, family, property and more." | Good — 158 chars, covers key topics ✓ |
| Robots | index, follow | ✓ |
| Canonical | `https://guidex-consulting.ae/life-setup` | ✓ |
| OG title | "Dubai Life Setup — Plan Your Move and First Steps \| Guidex" | ✓ |
| OG description | Same as meta description | ✓ |
| OG site_name | "Guidex Consulting" | ✓ |
| OG type | website | ✓ |
| hreflang en | `https://guidex-consulting.ae/life-setup` | ✓ |
| hreflang ru | `https://guidex-consulting.ae/ru/life-setup` | ✓ |
| hreflang x-default | `https://guidex-consulting.ae/life-setup` | ✓ |

No "Coming soon" remnants. No weak placeholder wording. Title and description are specific and searchable.

Suggested improvement (optional, not blocking): The title could include the word "checklist" or "step-by-step" to improve CTR for procedural searches. Current title is fine for launch.

### RU `/ru/life-setup`

| Field | Value | Quality |
|---|---|---|
| Title | "Переезд в Дубай — первые шаги и план действий \| Guidex" | Strong ✓ |
| Meta description | "Что подготовить до прилёта, что сделать в первую неделю, первый месяц и каждый год. Визы, компании, Ejari, семья и недвижимость — в правильном порядке." | Good — natural Russian, covers key topics ✓ |
| Robots | index, follow | ✓ |
| Canonical | `https://guidex-consulting.ae/ru/life-setup` | ✓ |
| hreflang | en + ru + x-default all correct | ✓ |
| OG tags | **NOT PRESENT** | ⚠ P2 |

The RU page is missing Open Graph tags. EN has them. OG tags affect appearance when the URL is shared on social platforms. This is P2 — it won't block indexing, but should be fixed before social sharing.

---

## 4. Internal Linking Audit

### Current inbound links to `/life-setup`

| Source | Link | Type |
|---|---|---|
| EN homepage | `/life-setup` — card in hub section | Card link ✓ |
| RU homepage | `/ru/life-setup` — card in hub section | Card link ✓ |
| Header nav (EN) | `/life-setup` — appears in nav | Nav link ✓ |
| Language switcher (when on EN) | `/ru/life-setup` | Header switcher ✓ |

**Header nav discovery:** `/life-setup` is present in the site header, which means it receives a link from every page. This is a strong signal for Googlebot and compensates somewhat for the sitemap absence.

### Missing internal links (not yet added)

| Source | Recommended link | Priority | Reason |
|---|---|---|---|
| `/guides` page | "Not sure where to start? See the Dubai Life Setup guide →" | High | Guides page has no orientation entry point — life-setup would serve as one |
| `/calendar` | "New to Dubai? Start with the Life Setup guide →" | Medium | Calendar users may be newcomers needing the full timeline |
| Individual guide detail pages | "See the full Dubai Life Setup timeline →" | Medium | Each guide could link back to the hub as context |
| `/news` page | "New to Dubai? Start here →" | Low | News audience is less relocation-focused |
| Footer | `/life-setup` under "Get Started" | Low | Footer links are very light currently (only about + contact) |
| `/ru/guides` | Same RU link | High | Mirrors EN recommendation |

### Header/nav assessment

`/life-setup` is already in the header nav. This is appropriate — it is a primary hub page and should remain there. No change needed.

### Recommendation

The highest-value addition is a contextual link on the `/guides` listing page. A user landing on `/guides` may be a first-timer who needs the full timeline, not just one guide. A single line CTA ("New to Dubai? Start with Life Setup →") would improve navigation without redesign.

**No links added in this phase — report only.**

---

## 5. Content / RAG Audit

### EN `/life-setup`

**First paragraph (SEO/RAG lead):**
> "Dubai Life Setup helps newcomers, families, business owners, investors, and property owners plan exactly what to do before arrival, in the first 7 days, in the first 30 days, and every year after. Each stage links to the relevant official guides."

Directly answers the user intent. Names 5 audience types. Names 4 time windows. Indexable above the fold. ✓

**Timeline structure:** 5 stages with named timeframes (30–90 days before, Days 0–7, Days 1–30, Days 31–90, Every year). ✓
**Route cards:** 7 user types (family, business, property, pet, holiday home, investor, renewal). ✓
**Guide links:** 14 internal guide links. ✓
**Authority names used:** KHDA, MOCCAE, GDRFA, ICA, MoHRE, WPS, FTA, DED, DET, ICP, DEWA — all present naturally. ✓
**WhatsApp CTA:** Present (multiple, appropriate). ✓
**No keyword stuffing:** Clean. ✓
**No unsupported claims:** Clean. ✓

| Dimension | Score | Notes |
|---|---|---|
| SEO clarity | 5/5 | H1 specific, meta complete, authorities named, hreflang set |
| RAG answerability | 4/5 | First paragraph answers "what is life setup?" directly; individual steps would be better if broken into structured data, but prose is adequate |
| Mobile scanability | 5/5 | Numbered stage cards, task bullets, route grid, hero image — all scan well |
| Internal conversion | 4/5 | 14 guide links, 6+ WA CTAs, section headings clear; could improve with footer CTA to GSC-verified guide |

### RU `/ru/life-setup`

**First paragraph:**
> "Этот раздел помогает заранее понять, что подготовить до прилёта, какие шаги закрыть в первую неделю, что проверить в первый месяц и какие напоминания поставить на будущее. Каждый этап ведёт к актуальным официальным гайдам."

Natural Russian. Answers intent. ✓

**Proper nouns preserved:** Emirates ID, Ejari, DEWA, Corporate Tax, Golden Visa, MOCCAE, KHDA, MoHRE, WPS, FTA, DET, ICA, GDRFA, DED — all correct. ✓
**No "Landlord" (fixed in 6C-56):** ✓
**No EN fallback:** ✓

| Dimension | Score | Notes |
|---|---|---|
| SEO clarity | 4/5 | Title and description strong; missing OG tags (P2) |
| RAG answerability | 4/5 | Same as EN — natural, complete |
| Mobile scanability | 5/5 | Identical layout to EN |
| Internal conversion | 4/5 | Same WA CTAs, RU guide links present |

---

## 6. GSC Submission Checklist

**Created:** `docs/content-drafts/LIFE_SETUP_GSC_SUBMISSION_CHECKLIST.md`

The checklist covers:
- URLs to submit: `https://guidex-consulting.ae/life-setup` and `https://guidex-consulting.ae/ru/life-setup`
- Prerequisite: sitemap fix deployed and verified
- Step-by-step: URL Inspection → Test Live URL → Request Indexing (for both URLs)
- Sitemaps panel resubmission
- Mobile usability check
- 48–72h indexed status check
- Slug permanence rule

**Owner action required:** GSC actions are manual — they cannot be done by Claude. Owner must log into GSC after sitemap fix is deployed.

---

## 7. Social Launch Hooks

### EN — 5 short hooks

```
1. Moving to Dubai? Here's what to do before you fly, in your first week, and every year after.
   guidex-consulting.ae/life-setup

2. Dubai Life Setup: 5 stages — from pre-arrival to annual renewals.
   Visa, Emirates ID, Ejari, DEWA, trade licence. All in order.
   guidex-consulting.ae/life-setup

3. Most people miss the 30-day Ejari deadline.
   The Dubai Life Setup timeline tells you what to do before that clock starts.
   guidex-consulting.ae/life-setup

4. Business owner? Investor? Moving with family? Pet?
   Each situation has a different setup path in Dubai. See yours →
   guidex-consulting.ae/life-setup

5. The honest Dubai arrival checklist:
   Before you land. First 7 days. First 30 days. Every year.
   No fluff, just the steps — guidex-consulting.ae/life-setup
```

### RU — 5 short хуков

```
1. Переезд в Дубай: что сделать до прилёта, в первую неделю и каждый год.
   Все шаги в правильном порядке — guidex-consulting.ae/ru/life-setup

2. Большинство не знают, что Ejari нужно зарегистрировать в первые 30 дней.
   Полный план действий → guidex-consulting.ae/ru/life-setup

3. Переезд с семьёй, открытие бизнеса, посуточная аренда, золотая виза.
   У каждой ситуации свой маршрут — найдите свой.
   guidex-consulting.ae/ru/life-setup

4. 5 этапов: до прилёта → первая неделя → первый месяц → 90 дней → каждый год.
   Без воды, только конкретные шаги.
   guidex-consulting.ae/ru/life-setup

5. Переезд в Дубай — это не один шаг, а 30.
   Вот они в правильном порядке: guidex-consulting.ae/ru/life-setup
```

No hype. No unsupported claims. WhatsApp CTA is on the landing page itself — hooks do not need to include it separately.

---

## 8. Issues Summary

### P0 — Must Fix Before GSC Submission

| Issue | File | Fix |
|---|---|---|
| `/life-setup` missing from sitemap | `app/sitemap.ts` | Add `{ path: "/life-setup", priority: 0.8 }` to `EN_STATIC` |
| `/ru/life-setup` missing from sitemap | `app/sitemap.ts` | Add `{ path: "/ru/life-setup", priority: 0.8 }` to `RU_STATIC` |

Fix is 2 lines. Requires commit, deploy (safe sequence), and sitemap resubmission in GSC.

### P2 — Recommended, Not Blocking

| Issue | File | Fix |
|---|---|---|
| RU `/ru/life-setup` has no OG tags | `app/ru/life-setup/page.tsx` | Add `openGraph: { ... }` to RU metadata export |
| Calendar/news pages also absent from sitemap | `app/sitemap.ts` | Separate broader sitemap update pass |

### P3 — Future Internal Linking (no code required now)

| Addition | Priority |
|---|---|
| `/guides` page: contextual link to `/life-setup` | High |
| Guide detail pages: "See the full timeline" back-link | Medium |
| `/calendar` page: entry point to life-setup for newcomers | Medium |
| Footer: add `/life-setup` under "Get Started" | Low |

---

## Final Q&A

**Are `/life-setup` and `/ru/life-setup` ready for indexing?**
Yes — both pages are live, 200, correctly structured, with complete metadata, hreflang, and canonical. The P0 sitemap fix is the only thing needed before manual GSC submission. Google will find the pages via the homepage and header nav regardless, but sitemap is required for reliable and fast indexing.

**Are they in sitemap?**
No — both are missing. This is a P0 code fix required in `app/sitemap.ts`.

**Are canonical/hreflang correct?**
Yes — canonical and hreflang are set correctly in both page metadata exports and verified in the live HTML.

**Is RU quality acceptable?**
Yes — natural Russian, correct proper nouns, no EN fallback, no "Landlord" bug, complete metadata. Missing OG tags (P2) but not a quality blocker.

**What manual GSC actions must owner do?**
1. After sitemap fix is deployed: verify sitemap.xml includes both URLs
2. URL Inspection → Request Indexing for both URLs in GSC
3. Resubmit sitemap.xml in GSC Sitemaps panel
4. Check indexed status 48–72h later
See `docs/content-drafts/LIFE_SETUP_GSC_SUBMISSION_CHECKLIST.md` for step-by-step.

**What internal links should be added next?**
Primary: a contextual link on the `/guides` page pointing to `/life-setup` (and `/ru/guides` → `/ru/life-setup`). This is the highest-value gap.

**Is any code fix required before moving on?**
Yes — one fix:
- `app/sitemap.ts`: add 2 entries to `EN_STATIC` and `RU_STATIC` (Phase 6C-59 candidate)

Optionally:
- `app/ru/life-setup/page.tsx`: add OG tags to RU metadata (Phase 6C-59B candidate)

---

## What Was Not Touched

- Database: not touched
- Admin: not touched
- Code: not touched (audit only)
- Schema/migrations: not touched
- Env/secrets: not touched
- GTM/GA4: not touched
- No commits made
- No push/deploy

## Git Status

No changes staged or committed in Phase 6C-58. Two new files created (untracked):
- `docs/content-drafts/LIFE_SETUP_GSC_SUBMISSION_CHECKLIST.md`
- `docs/content-drafts/PHASE_6C58_LIFE_SETUP_LAUNCH_SEO_INTERNAL_LINKING_REPORT.md`

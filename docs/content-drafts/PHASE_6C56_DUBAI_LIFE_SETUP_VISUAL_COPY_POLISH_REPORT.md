# Phase 6C-56 — Dubai Life Setup Visual Hero and Copy Polish Report

**Date:** 2026-05-24
**Phase:** 6C-56
**Scope:** Visual/copy polish for `/life-setup` and `/ru/life-setup` only

---

## Files Modified

| File | Status |
|---|---|
| `app/(en)/(public)/life-setup/page.tsx` | Modified |
| `app/ru/life-setup/page.tsx` | Modified |

No other files were touched. No DB changes. No admin changes. No new content. No schema changes.

---

## Changes: EN (`app/(en)/(public)/life-setup/page.tsx`)

### Hero — replaced plain text with full hero image card

**Before:** Plain text header — eyebrow label + H1 + paragraph, no image, no visual impact.

**After:** Full-bleed rounded-card hero with:
- Image: `jlt-dubai-towers-sunset-reflection.webp` (warm JLT towers sunset — chosen for life/relocation theme)
- Container: `relative w-full rounded-2xl overflow-hidden mb-8 h-[268px] sm:h-[330px]`
- Image: `fill object-cover` with `sizes="(max-width: 672px) calc(100vw - 40px), 632px"` and `priority`
- Gradient: `bg-gradient-to-t from-black/90 via-black/55 to-black/10`
- Eyebrow: "Dubai Life Setup" (`text-[10px] uppercase tracking-widest text-white/60`)
- H1: "Plan your life in Dubai" (`text-[24px] sm:text-[28px] font-bold text-white` with textShadow)
- Subtitle: "What to prepare before arrival, what to do in your first week, and what to stay on top of every year."
- CTA 1: `href="#timeline"` → "Start with the timeline" (white pill button, anchor scroll, no JS)
- CTA 2: WhatsApp → "Ask Guidex →" (ghost border button)

### First-screen SEO/RAG answer paragraph

Added immediately below hero:

> "Dubai Life Setup helps newcomers, families, business owners, investors, and property owners plan exactly what to do before arrival, in the first 7 days, in the first 30 days, and every year after. Each stage links to the relevant official guides."

Appears above the fold on mobile. Answers the core intent query directly. Indexable as a rich page summary.

### Section headings — upgraded

**Timeline section:**
- Wrapped in `<div id="timeline">` (anchor target for hero CTA)
- Heading: `text-[20px] font-bold text-gray-900` — was `text-xs text-gray-400`
- Subheading added: "Five stages — from before you land to your annual obligations."
- Brass accent rule (`w-6 h-0.5 bg-brass`) above heading

**Routes section:**
- Wrapped in `<div id="routes">`
- Heading "Your situation": `text-[20px] font-bold text-gray-900`
- Subheading added: "Choose the path that fits your reason for being in Dubai."
- Brass accent rule above heading

### Stage card — minor upgrades

- Stage badge: `w-7 h-7` (was `w-6 h-6`) — slightly larger, easier to read
- Stage h3: `text-[17px]` (was `text-[16px]`)
- Route title corrected: "Renewal for residents" (was "Existing resident — renewal")

### Bottom CTA

- Heading: `text-[16px] font-bold` (was `text-[14px] font-semibold`)

---

## Changes: RU (`app/ru/life-setup/page.tsx`)

### Hero — same pattern as EN, fully in Russian

- Same image: `jlt-dubai-towers-sunset-reflection.webp`
- Same container/gradient/sizing
- Eyebrow: "Переезд и первые шаги"
- H1: "Переезд и первые шаги в Дубае"
- Subtitle: "Короткий план: что подготовить до прилёта, что сделать в первую неделю и что не забыть позже."
- CTA 1: `href="#plan"` → "Начать с плана" (anchor scroll to plan section)
- CTA 2: WhatsApp → "Написать в Guidex →"

### First-screen SEO/RAG paragraph (RU)

> "Этот раздел помогает заранее понять, что подготовить до прилёта, какие шаги закрыть в первую неделю, что проверить в первый месяц и какие напоминания поставить на будущее. Каждый этап ведёт к актуальным официальным гайдам."

Natural, non-literal Russian. Does not use calque phrasings from English.

### Section headings — upgraded

**Plan section:**
- Wrapped in `<div id="plan">` (anchor target for hero CTA)
- Heading: "Ваш план действий" — `text-[20px] font-bold text-gray-900`
- Subheading: "Пять этапов — от подготовки до прилёта до ежегодных обязательств."
- Brass accent rule

**Routes section:**
- Wrapped in `<div id="marshrut">`
- Heading: "Ваш маршрут" — `text-[20px] font-bold text-gray-900`
- Subheading: "Выберите ситуацию, которая описывает вас."
- Brass accent rule

### Bottom CTA heading (RU)

"Есть вопрос по переезду в Дубай?" — more natural than "по обустройству". Confirmed natural Russian phrasing.

---

## RU Naturalness Audit

| Check | Result |
|---|---|
| "Landlord" (EN word in RU context) | Fixed → "Арендодатель" |
| "Настройка жизни" (bad calque) | Not present — page uses "Переезд и первые шаги" |
| "маршрут питомца" | Not present — uses "С питомцем" |
| Proper nouns preserved | Emirates ID, Ejari, DEWA, Corporate Tax, Golden Visa, MOCCAE, KHDA, MoHRE, WPS, FTA, DET, ICA, GDRFA, DED — all preserved |
| Literal EN→RU calques | None detected |
| Grammar/naturalness spot check | "Арендодатель обязан зарегистрировать Ejari" ✓, "Выберите ситуацию, которая описывает вас" ✓, "не откладывайте до последней недели" ✓ |

---

## SEO / RAG Assessment

| Check | Result |
|---|---|
| H1 unique, specific, searchable | EN: "Plan your life in Dubai" ✓ / RU: "Переезд и первые шаги в Дубае" ✓ |
| Meta description populated | EN ✓ / RU ✓ |
| Canonical + hreflang set | EN `/life-setup` / RU `/ru/life-setup` / x-default EN ✓ |
| First-screen intent answer | Present in both languages ✓ |
| Official authority names used | KHDA, MOCCAE, GDRFA, ICA, MoHRE, WPS, FTA, DED, DET, ICP — all present ✓ |
| No unsupported fees or timelines | No invented claims. AED 2,000,000 golden visa threshold backed by published guide ✓ |
| Page linkable as standalone | Yes — every stage and route is self-contained ✓ |

---

## Visual QA

| Check | Result |
|---|---|
| Hero image loads | `jlt-dubai-towers-sunset-reflection.webp` present in EN and RU HTML ✓ |
| EN H1 "Plan your life in Dubai" | ✓ |
| RU H1 "Переезд и первые шаги в Дубае" | ✓ |
| Gradient overlay renders | Present (`from-black/90 via-black/55 to-black/10`) ✓ |
| Hero CTAs present | "Start with the timeline" / "Начать с плана" ✓ |
| Section heading "Your timeline" | ✓ |
| Section heading "Your situation" | ✓ |
| No EN fallback text on RU page | ✓ |
| No "Landlord" on RU page | ✓ |
| `id="timeline"` anchor exists EN | ✓ |
| `id="plan"` anchor exists RU | ✓ |
| RU homepage card href="/ru/life-setup" | ✓ |

---

## Build / TypeScript Validation

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | 0 errors ✓ |
| Production build (`npm run build`) | 88 pages, 0 errors ✓ |
| `/life-setup` route | HTTP 200 ✓ |
| `/ru/life-setup` route | HTTP 200 ✓ |
| `/` (EN homepage) | HTTP 200 ✓ |
| `/ru` (RU homepage) | HTTP 200 ✓ |
| `/calendar` | HTTP 200 ✓ |
| `/guides/employment-visa` | HTTP 200 ✓ |

---

## Git Status

**Modified, not staged:**
- `app/(en)/(public)/life-setup/page.tsx`
- `app/ru/life-setup/page.tsx`

**No other files changed.** All other working tree files are either committed or unrelated to this phase.

---

## Final Q&A

**Does `/life-setup` now look like a real product page?**
Yes. The hero image card gives it immediate visual presence. H1 is large, white-on-image, and searchable. CTAs are clear. Section headings are bold and structured. The first-screen SEO paragraph answers the core intent. Route cards are well-organised and link to guides.

**Does `/ru/life-setup` now look like a real product page?**
Yes. Identical layout and visual quality to EN. All copy is native Russian — no calques, no misused English words, proper authority names preserved. The RU hero H1 "Переезд и первые шаги в Дубае" is strong and natural.

**Is there a hero image at the top?**
Yes — `jlt-dubai-towers-sunset-reflection.webp`, 268px mobile / 330px sm+, full-bleed rounded card, gradient overlay from-black/90.

**Is the first screen strong for SEO/RAG?**
Yes. H1 is above the fold and specific. SEO/RAG paragraph immediately follows hero and directly states page intent with official terminology. No thin content.

**Is RU natural and visually equal to EN?**
Yes. Natural phrasing throughout. "Landlord" bug fixed. No bad calques. Visually identical structure and weight.

**Is it safe to commit?**
Yes. Two files only. TypeScript: 0 errors. Build: 0 errors. All routes 200. No DB changes. No admin changes. No new content outside existing data.

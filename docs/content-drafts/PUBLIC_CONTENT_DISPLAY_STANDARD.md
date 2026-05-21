# Public Content Display Standard — Guidex Consulting

**Version:** 1.0  
**Date:** 2026-05-21  
**Status:** Active — applies to all public detail pages (news, events, calendar, guides)  
**Authority:** This document overrides any per-session improvisation. Changes require owner approval.

---

## 1. First-Screen Rule

Every news, event, calendar, and guide detail page must show the following information **above the fold** (before any body text begins):

| Element | Required | Notes |
|---|---|---|
| Back navigation link | Yes | One line, text link, no button |
| Meta line (category · date) | Yes | Uppercase, 11px, gray-400 |
| `<h1>` title | Yes | 22px, font-bold, leading-snug |
| Summary (1–2 sentences) | Yes | 15px, gray-600, leading-[1.6] |
| Source trust block | Yes — if `sourceUrl` or `officialSourceUrl` exists | Left-border pill, 11px, brass link |
| Key facts / dates block | Yes — if content has specific dates or thresholds | Calendar detail dates list, event confidence notice |
| Calendar context strip | Yes — for events and calendar pages | CalendarContextCta with date pills |

**Sequence (events):** Back link → meta → h1 → summary → source block → confidence notice → CalendarContextCta → body

**Sequence (news):** Back link → meta → h1 → summary → source block → body → CalendarContextCta

**Sequence (calendar):** Back link → meta → h1 → summary → source block → Islamic dates notice → CalendarContextCta → body → dates list

**Sequence (guides):** Back link → meta → h1 → who-this-is-for → overview → steps

The user must be able to answer their primary question **within the first viewport** without scrolling.

---

## 2. First Paragraph SEO/RAG Rule

The first paragraph of every detail page body must include all of the following elements in natural language:

| Element | Example |
|---|---|
| Main entity / topic | "UAE federal government employees" |
| Location / emirate if relevant | "in Dubai" / "across the UAE" |
| Date or deadline if relevant | "from 25–29 May 2026" |
| Affected user group | "private sector employers with 50+ employees" |
| Source-safe claim | "as announced by FAHR" / "per Cabinet Resolution No. X" |
| Practical meaning | "businesses must…" / "this means…" |

**The first paragraph must answer the reader's primary intent within 10 seconds.** Do not open with background context, history, or definitions. State the fact, the date, the audience, and the implication — in that order.

**Good first paragraph:**  
> UAE federal government employees will observe a public holiday from **25–29 May 2026** for Eid Al Adha, as announced by the Federal Authority for Human Resources (FAHR). The five-day break covers the Eid period and the day of Arafat. Private sector holidays follow MOHRE guidance, typically aligned with the same dates.

**Bad first paragraph:**  
> Eid Al Adha is one of the most significant Islamic holidays in the UAE. Every year, the government announces the dates based on the Islamic lunar calendar…

---

## 3. Bold Usage Rule

Use `**bold**` only for the following content types:

| Use bold for | Example |
|---|---|
| Dates and deadlines | **25–29 May 2026**, **30 June 2026** |
| Official thresholds or amounts | **AED 375,000**, **50+ employees** |
| Source-backed obligations | **must**, **required by law** |
| Affected audience | **UAE private sector employers** |
| Caution or warning phrase | **Note:**, **Important:** |
| Key action step | **submit the application**, **renew before** |

**Do NOT bold:**
- Entire sentences or paragraphs
- Decorative words or transitions
- Repeated phrases across the same article
- Organisation names unless they are the obligation-holder
- Anything you want to emphasise but can't justify with the above categories

**Threshold:** No more than 3–4 bolded phrases per 250 words of body text.

---

## 4. Typography and Readability Rule

All public detail pages must meet these standards:

| Property | Value | Applied in |
|---|---|---|
| Body paragraph size | `text-[15px]` | MarkdownBody `<p>` |
| Body line height | `leading-[1.72]` | MarkdownBody `<p>`, `<li>` |
| Body color | `text-gray-700` | MarkdownBody |
| Summary size | `text-[15px]` | All detail pages, above body |
| Summary color | `text-gray-600` | All detail pages |
| Summary line height | `leading-[1.6]` | All detail pages |
| Container spacing | `space-y-4` | MarkdownBody container |
| Section heading (h4) | `text-[15px] font-semibold + border-t border-stone-100 pt-5` | MarkdownBody |
| Section heading (h3) | `text-[17px] font-semibold + border-t border-stone-200 pt-6` | MarkdownBody |
| Section heading (h2) | `text-[19px] font-semibold + border-t-2 border-stone-200 pt-7` | MarkdownBody |
| Bold inline | `font-semibold text-gray-900` | MarkdownBody `<strong>` |
| List item size | `text-[15px]` | MarkdownBody `<li>` |
| List item spacing | `space-y-2` | MarkdownBody `<ul>` |
| Section divider (`---`) | `h-px bg-stone-100 my-3` | MarkdownBody HR |
| Max content width | `max-w-2xl` | All detail page containers |
| Horizontal padding | `px-5` | All detail page containers |

**Do not deviate from these values for body text.** Typography decisions are not per-article — they are system-level.

---

## 5. Table and Card Rule

All tables in MarkdownBody are wrapped in a responsive container:

```
overflow-x-auto rounded-xl border border-stone-200
```

Inside: `text-[14px]`, zebra rows, `px-3 py-2.5` cells, `last:border-b-0` on the last row.

**Rules:**
- Tables must be readable on mobile (overflow-x-auto handles this)
- Header row: `text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-stone-50`
- Data cells: `text-gray-700 align-top leading-snug`
- No fixed column widths unless the content is tabular numbers (use `tabular-nums`)
- If a table needs more than 4 columns, consider a card list instead
- Key facts (dates, amounts, thresholds) should appear in a table **above** the prose body when the article leads with data

**Dates list (calendar detail pages):**  
Use the `border border-stone-100 rounded-xl px-3 py-2.5` card format with date column at `w-[88px]` and pill badges for type (holiday, deadline, etc.).

---

## 6. Calendar Context Rule

**Events and calendar pages** must show `CalendarContextCta` **before the body**:
- Shows the event's date(s) as navy pill chips
- Links to the relevant month in `/calendar`
- Provides a secondary "Open calendar →" link only when `calendarMonth` is set

**News pages** must show `CalendarContextCta` **after the body**:
- News articles do not have a specific event date, so the calendar promo is secondary
- Position: after all body content, before the WhatsApp CTA block

**Rules:**
- One `CalendarContextCta` per page — no duplicates
- If `calendarMonth` is undefined, only one CTA button renders ("Open Dubai Calendar")
- If `calendarMonth` is set, two links render: month-specific + general calendar
- Date pills are navy background, white text, 12px — do not use other colors for these
- No broken links — `calendarBase` must always be `/calendar` (EN) or `/ru/calendar` (RU)
- CalendarContextCta links are internal only (no external URLs as calendarBase)

---

## 7. RU Content Standard

Russian content is an **editorial adaptation**, not a literal translation.

**Rules:**
- RU `<html lang="ru">` must be confirmed on every `/ru/*` route before deploy
- No EN fallback: if `ru_title` or `ru_body` is empty, the page returns 404 (not EN content)
- The RU first paragraph must answer the **same user intent** as the EN first paragraph — in natural Russian, not word-for-word translation
- RU label strings must use the RU versions in all components (`Источник:`, `Официальный источник ↗`, `Написать в WhatsApp →`, etc.)
- RU category labels and month names use the genitive case where grammatically required
- The RU confidence notices and Islamic dates disclaimers must be present in all calendar/event pages
- RU body text uses the same typography rules as EN — same px sizes, line heights, spacing

**Before publishing any RU article, verify:**
1. `lang="ru"` on the page HTML element
2. All visible UI strings are in Russian
3. No raw EN text visible in the rendered page (not even in trust blocks or badge labels)
4. Source block label is "Источник:" not "Source:"
5. WhatsApp CTA uses "Написать в WhatsApp →" not "Chat on WhatsApp →"

---

## 8. SEO, RAG, and AEO Rule

Every public detail page must support all four discovery modes:

| Mode | Requirement |
|---|---|
| Google Search | `<title>` and `<meta description>` populated from `seoTitle` / `metaDescription` or `title` / `summary`. `robots: index, follow` on published pages. Canonical URL set. |
| AI answer extraction (RAG/AEO) | First paragraph answers the main intent directly. Structured headings (h2/h3/h4) break content by subtopic. Bold marks key facts. Source trust block provides verifiable reference. |
| Calendar connection | All date-based content links to the relevant calendar month via `CalendarContextCta`. |
| Internal linking | Published events should link to related guides via `relatedGuideSlug`. Guide steps link to service centers where relevant. |
| Service path | Every detail page ends with a WhatsApp CTA for service lead capture. |
| Social repurposing | First 2 sentences of summary are self-contained and quote-worthy. |

**`hreflang` rules:**
- EN pages: `canonical` = EN URL, `x-default` = EN URL
- RU pages: `canonical` = RU URL, `languages.ru` = RU URL, `languages.en` = EN URL, `x-default` = EN URL

**Never set `noindex` on a published page.** Only draft/unpublished content should be noindexed.

---

## 9. Public/Internal Separation Rule

The following must **never appear** in public-facing rendered content:

| Category | Examples |
|---|---|
| Import notes or source research notes | "Source confidence: medium", "Verify before publish", "TODO: check dates" |
| Admin field names | `sourceLabel`, `hasIslamicDates`, `dateConfidence` |
| Internal uncertainty | "We are not certain of this date", "This may change" |
| Blocked claims (unchecked) | Any claim that has not been source-verified against an official UAE government source |
| Placeholder content | Lorem ipsum, "Example city", "test@example.com", test slugs |

**Acceptable public-facing uncertainty signals:**
- Islamic dates notice: "Dates depend on official UAE moon-sighting announcements and are subject to change."
- Confidence badge: "Expected" (amber pill) or "Subject to confirmation" (amber pill)
- Source trust block: links to the official source so the reader can verify independently

Do not invent softening language that isn't backed by a real uncertainty (e.g., "roughly around this time" when a confirmed date exists).

---

## 10. Pre-Publish Visual QA Checklist

Run this checklist before any import, publish, or deploy of new content.

### Desktop check
- [ ] Title visible and readable at viewport top
- [ ] Summary below title, legible at 15px
- [ ] Source trust block visible (if source URL exists)
- [ ] Body text renders cleanly — no raw Markdown symbols (`##`, `**`, `|`)
- [ ] Headings have visible section separators
- [ ] Tables have border container and readable cells
- [ ] CalendarContextCta visible with correct date pills (for events/calendar)
- [ ] WhatsApp CTA block at bottom, not broken

### Mobile check (375px viewport)
- [ ] All text is legible at mobile scale
- [ ] Tables scroll horizontally (overflow-x-auto)
- [ ] Date pills wrap correctly on small screens
- [ ] CalendarContextCta buttons are tappable (minimum 36px touch target)
- [ ] No horizontal overflow on the page

### EN/RU parity check
- [ ] EN route returns 200 with `html lang="en"`
- [ ] RU route returns 200 with `html lang="ru"` (or 404 if no RU content)
- [ ] All visible UI strings on RU pages are in Russian
- [ ] No EN fallback text visible on RU pages
- [ ] Source block label says "Источник:" on RU, "Source:" on EN

### Content integrity check
- [ ] No raw Markdown in HTML output
- [ ] No placeholder, lorem, or test data
- [ ] No broken internal links (guide slug, calendar link)
- [ ] No broken external links (sourceUrl returns 200)
- [ ] Source trust block links to a real, live URL

### SEO check
- [ ] `robots: index, follow` on the published page
- [ ] `<title>` populated (not default site title)
- [ ] `<meta description>` populated
- [ ] Canonical URL set correctly
- [ ] `hreflang` alternates set (EN ↔ RU when both versions exist)

### CTA check
- [ ] CalendarContextCta month link is correct (matches the event/calendar month)
- [ ] "Open calendar" link goes to `/calendar` (EN) or `/ru/calendar` (RU)
- [ ] WhatsApp link is `https://wa.me/971506304817`
- [ ] No duplicate CTAs on the same page
- [ ] No CTA links to a 404

---

## Component Reference

| Component | Purpose | Location |
|---|---|---|
| `MarkdownBody` | Renders DB body text (Markdown subset) | `components/MarkdownBody.tsx` |
| `CalendarContextCta` | Date context strip + calendar links | `components/calendar/CalendarContextCta.tsx` |
| `CalendarGrid` | Interactive month grid for /calendar pages | `components/calendar/CalendarGrid.tsx` |
| News detail page | `/news/[slug]` | `app/(en)/(public)/news/[slug]/page.tsx` |
| Event detail page | `/events/[slug]` | `app/(en)/(public)/events/[slug]/page.tsx` |
| Calendar detail page | `/calendar/[slug]` | `app/(en)/(public)/calendar/[slug]/page.tsx` |
| RU news detail | `/ru/news/[slug]` | `app/ru/news/[slug]/page.tsx` |
| RU event detail | `/ru/events/[slug]` | `app/ru/events/[slug]/page.tsx` |
| RU calendar detail | `/ru/calendar/[slug]` | `app/ru/calendar/[slug]/page.tsx` |

---

## Change Log

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-21 | Initial standard — established after Phase 6C-41 reading system improvements |

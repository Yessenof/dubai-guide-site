# UAE Calendar Rename Audit
## Phase 6C-95A | Date: 2026-06-01

Product name change: **Dubai Calendar → UAE Calendar / Календарь Дубая → Календарь ОАЭ**

---

## 1. Files changed

| File | Change |
|------|--------|
| `app/(en)/(public)/calendar/page.tsx` | H1, H2, metadata title, metadata description, SEO body paragraph |
| `app/ru/calendar/page.tsx` | H1, H2, metadata title, metadata description, SEO body paragraph |
| `app/(en)/(public)/page.tsx` | Carousel badge, nav label chip, "Open Dubai Calendar →", "Full Dubai calendar →" |
| `app/ru/page.tsx` | Carousel badge, hero card H2 |
| `app/(en)/(public)/life-setup/page.tsx` | calendarNote, ctaLabel |
| `app/ru/life-setup/page.tsx` | calendarNote, ctaLabel |
| `components/calendar/CalendarContextCta.tsx` | Label chip, title strings, description strings (EN+RU) |
| `components/calendar/CalendarMiniPreview.tsx` | Label chip (EN+RU), CTA label (RU base) |
| `components/calendar/CalendarGrid.tsx` | "This month in Dubai" → "This month in the UAE" (EN+RU, 2 occurrences) |

---

## 2. New text applied

### EN product name
- **Product label (chip):** UAE Calendar
- **H1:** UAE Calendar
- **H1 subtitle:** Dubai, Abu Dhabi and key UAE dates, events and deadlines
- **Metadata title:** UAE Calendar: Holidays, Events and Deadlines in Dubai and Abu Dhabi | Guidex
- **Metadata description:** UAE public holidays, corporate tax and compliance deadlines, business events, concerts and key dates for Dubai and Abu Dhabi residents and companies. Month-by-month UAE calendar.
- **H2 about section:** About UAE Calendar
- **CTA:** Open UAE Calendar →, Full UAE Calendar →
- **Grid panel:** This month in the UAE

### RU product name
- **Product label (chip):** Календарь ОАЭ
- **H1:** Календарь ОАЭ
- **H1 subtitle:** важные даты, события и дедлайны в Дубае, Абу-Даби и ОАЭ
- **Metadata title:** Календарь ОАЭ: праздники, события и дедлайны в Дубае и Абу-Даби | Guidex
- **CTA:** Открыть Календарь ОАЭ →
- **Grid panel:** В этом месяце в ОАЭ

---

## 3. Places where "Dubai" is intentionally kept for SEO

| Location | Text kept | Reason |
|----------|-----------|--------|
| Monthly calendar page slugs | `/calendar/august-2026-dubai-calendar` | URL must not change per CLAUDE.md |
| Monthly calendar page titles (DB) | "August 2026 in Dubai..." | Per-page SEO for Dubai-specific content; accurate |
| Monthly calendar DB en_seo_title | e.g. "August 2026 Dubai calendar: ..." | SEO — these are Dubai-specific pages |
| Event detail pages | e.g. "Dubai Design Week 2026" | Event names are proper nouns |
| Guide SEO content | References to Dubai procedures | Topic-accurate, not branding |

The product name is "UAE Calendar" but individual monthly pages can still reference Dubai in their title if the content is Dubai-specific. The product label (chip) and H1 on the index page have changed to UAE.

---

## 4. Remaining instances NOT changed (intentional)

| File | Text | Reason |
|------|------|--------|
| `app/(en)/(public)/calendar/[slug]/page.tsx` | `UAE Calendar · ${year}${monthLabel}` (eyebrow) | Already uses UAE Calendar — no change needed |
| `app/ru/calendar/[slug]/page.tsx` | `Календарь ОАЭ · ${year}${monthLabel}` (eyebrow) | Already correct — no change needed |
| `app/(en)/(public)/events/page.tsx` | `UAE Calendar` | Already correct |
| `app/ru/events/page.tsx` | `Календарь ОАЭ` | Already correct |
| DB calendar page content (en_title, ru_title) | Dubai-specific monthly titles | Content is accurate (Dubai-focused months); URL stable |

---

## 5. Verdict

All product-facing "Dubai Calendar" labels updated to "UAE Calendar" / "Календарь ОАЭ".
Dubai-specific SEO content on per-page level intentionally preserved.

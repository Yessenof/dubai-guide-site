# [Event Draft Title — EN]

## Draft metadata

```
draft_id:              EVT-[YYYYMMDD]-[slug-prefix]
content_type:          event
slug:                  [url-safe-slug]
status:                draft_file_only
publish_status:        not_for_publish_yet
risk_level:            [low | medium | medium_high | high]
source_reliability:    [official | government | organizer | media | internal]
verification_required: [true | false]
date_reviewed:         [YYYY-MM-DD]
last_updated:          [YYYY-MM-DD]

calendar_category:     [holiday | event | business_event | government_deadline | real_estate_event | relocation | family_school]
calendar_priority:     [1 | 2 | 3]
event_date_start:      [YYYY-MM-DD]
event_date_end:        [YYYY-MM-DD or leave blank if single day]
date_confidence:       [confirmed | expected | subject_to_official_confirmation | source_signal_only]
has_islamic_dates:     [true | false]

is_external:           [true | false]
external_url:          [URL if is_external=true — official organizer or ticket page]
external_cta_en:       [e.g. "Buy tickets" or "Register now"]
external_cta_ru:       [e.g. "Купить билеты" or "Зарегистрироваться"]

category:              [event | deadline | conference | exhibition | holiday | cultural]
```

---

## Sources

| # | Source | Type | URL | Access date | Reliability | Covers what claim |
|---|---|---|---|---|---|---|
| 1 | [Organizer or authority — document or page title] | [official / organizer / media] | [URL] | [YYYY-MM-DD] | [official / trusted / signal_only] | [dates / venue / details] |

**Sources still needed:**

- [ ] [What still needs to be confirmed and from which source]

---

## Calendar item this event produces

| Label EN | Label RU | Date | Type | Confidence |
|---|---|---|---|---|
| [Short chip label] | [Short RU chip label] | [YYYY-MM-DD] | [event/deadline/holiday] | [confirmed/expected] |

---

## EN draft

### Title

[Specific, searchable. Includes event name + location + year. Under 70 chars if possible.]

### Summary

[1–2 sentences. What the event is + when + where. Under 155 characters.]

### Body

[Paragraph 1: What the event is — brief, factual]

[Paragraph 2: Key dates, venue, who it's for]

[Paragraph 3: How to attend or register — CTA direction]

[Source note: Based on [Authority / Organizer], [page title], [access date].]

### SEO title

[Under 60 characters. Event name + year + city.]

### Meta description

[Under 155 characters. Event + dates + city + who it's for.]

---

## RU draft

### Title

[Естественный русский заголовок — не калька с английского.]

### Summary

[1–2 предложения на естественном русском. До 155 символов.]

### Body

[Абзац 1: Что за мероприятие]

[Абзац 2: Даты, место, для кого]

[Абзац 3: Как попасть или зарегистрироваться]

[Источник: На основании [название организатора], [страница], [дата проверки].]

### SEO title

[До 60 символов. Название события + год + город.]

### Meta description

[До 155 символов.]

---

## Verification still needed

- [ ] [Confirm dates on official organizer website]
- [ ] [Confirm venue]
- [ ] [Check ticket/registration link]

---

## What not to claim in this draft

- Do not claim attendance figures as confirmed
- Do not claim exact program lineup without official announcement
- Do not claim dates as confirmed if only from media sources

---

## Related Guidex content

| Type | Slug | Relevance |
|---|---|---|
| Guide | [slug] | [why related] |
| Calendar | [slug] | [why related] |

---

## Future admin/import notes

When ready for DB:

- content_type: event
- Admin module: Events admin (`/admin/content/events`)
- Status on import: draft
- ru_published: 0
- noindex: true (until owner explicitly publishes)
- is_external: [true/false depending on whether event has its own page]

**This file is a draft only. No admin action until explicitly approved.**

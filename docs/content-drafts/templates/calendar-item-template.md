# [Calendar Item Title — EN]

## Draft metadata

```
draft_id:              CAL-[YYYYMMDD]-[slug-prefix]
content_type:          calendar_visual_post
slug:                  [url-safe-slug]
status:                draft_file_only
publish_status:        not_for_publish_yet
risk_level:            [low | medium | medium_high | high]
source_reliability:    [official | government | organizer | media | internal]
verification_required: [true | false]
date_reviewed:         [YYYY-MM-DD]
last_updated:          [YYYY-MM-DD]

calendar_category:     [holiday | event | business_event | government_deadline | tax_deadline | aml_deadline | real_estate_event | relocation | family_school | news_update | guide_update | calendar_visual_post]
calendar_priority:     [1 | 2 | 3]
year:                  [YYYY]
month:                 [1-12]
date_start:            [YYYY-MM-DD or leave blank for month-level post]
date_end:              [YYYY-MM-DD or leave blank]
date_confidence:       [confirmed | expected | subject_to_official_confirmation | source_signal_only]
has_islamic_dates:     [true | false]
```

---

## Sources

| # | Source | Type | URL | Access date | Reliability | Covers what claim |
|---|---|---|---|---|---|---|
| 1 | [Authority — document or page title] | [official / government / organizer / media] | [URL] | [YYYY-MM-DD] | [official / trusted / signal_only] | [which dates or facts] |

**Sources still needed:**

- [ ] [What needs to be verified]

---

## Dates list

Individual date entries this calendar item contains. Each becomes a row in the `dates` JSON field in DB.

| Date | Label EN | Label RU | Type | Confidence |
|---|---|---|---|---|
| [YYYY-MM-DD] | [Short EN label — no em dash] | [Short RU label] | [public-holiday / important-date / deadline / other] | [confirmed / expected / subject_to_official_confirmation] |

---

## EN draft

### Title

[Specific. Describes what this month/period covers. No "Ultimate" framing.]

### Summary

[1–2 sentences. What dates this covers + who it's useful for. Under 155 characters.]

### Body

[Paragraph 1: What this month/period covers — key dates summary]

[Paragraph 2: Who needs to plan around these dates — residents, businesses, or both]

[Paragraph 3: Any official notes or caveats — e.g. Islamic dates subject to confirmation]

[Source note: Based on [Authority/Authorities], verified [date].]

### Notes field (displayed under the date list)

[Short caveats shown on the detail page below the dates — e.g. "Islamic holiday dates depend on official UAE moon-sighting announcements."]

### SEO title

[Under 60 characters. Key dates + month + year.]

### Meta description

[Under 155 characters. Key dates + who it affects.]

---

## RU draft

### Title

[Естественный русский заголовок — не калька с английского.]

### Summary

[1–2 предложения. До 155 символов.]

### Body

[Абзац 1: Что охватывает этот месяц/период]

[Абзац 2: Кому важно планировать с учётом этих дат]

[Абзац 3: Официальные оговорки если необходимы]

[Источник: На основании [названия органов], проверено [дата].]

### Notes (RU)

[Короткая оговорка под списком дат на RU страницах.]

### SEO title RU

[До 60 символов.]

### Meta description RU

[До 155 символов.]

---

## Verification still needed

- [ ] [Specific date or claim to confirm — which authority — which URL]

---

## What not to claim in this draft

- Do not present any Islamic holiday date as confirmed without UAE moon-sighting announcement
- Do not claim private sector holiday durations without MoHRE official source
- Do not claim school closure without KHDA source

---

## Related Guidex content

| Type | Slug | Relevance |
|---|---|---|
| News | [slug] | [why related] |
| Event | [slug] | [why related] |
| Guide | [slug] | [why related] |

---

## Future admin/import notes

When ready for DB:

- content_type: calendar_visual_post
- Admin module: Calendar admin (`/admin/content/calendar`)
- Status on import: draft
- ru_published: 0
- noindex: true
- has_islamic_dates: [0 or 1]

**This file is a draft only. No admin action until explicitly approved.**

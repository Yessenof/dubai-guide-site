# [News Draft Title — EN]

## Draft metadata

```
draft_id:              NEWS-[YYYYMMDD]-[slug-prefix]
content_type:          news
slug:                  [url-safe-slug]
status:                draft_file_only
publish_status:        not_for_publish_yet
risk_level:            [low | medium | medium_high | high]
source_reliability:    [official | government | media | internal]
verification_required: [true | false]
date_reviewed:         [YYYY-MM-DD]
last_updated:          [YYYY-MM-DD]

calendar_category:     [holiday | event | business_event | government_deadline | tax_deadline | aml_deadline | real_estate_event | relocation | family_school | news_update | guide_update]
calendar_priority:     [1 | 2 | 3]
date_start:            [YYYY-MM-DD]
date_end:              [YYYY-MM-DD or leave blank]
date_confidence:       [confirmed | expected | subject_to_official_confirmation | source_signal_only]
has_islamic_dates:     [true | false]

category:              [visa | company-setup | hiring | living | government | tax | property | events]
```

---

## Sources

List every source used or needed. For each:

| # | Source | Type | URL | Access date | Reliability | Covers what claim |
|---|---|---|---|---|---|---|
| 1 | [Authority name — document or page title] | [official / government / media / internal] | [URL] | [YYYY-MM-DD] | [official / trusted / signal_only] | [what claim this source supports] |

**Sources still needed:**

- [ ] [Claim that needs a source]
- [ ] [Claim that needs a source]

---

## Calendar items this news connects to

List any calendar dates that should be created as separate calendar items once this news is in DB:

| Label EN | Label RU | Date | Type | Confidence |
|---|---|---|---|---|
| [Short label] | [Short RU label] | [YYYY-MM-DD] | [holiday/deadline/event] | [confirmed/expected] |

---

## EN draft

### Title

[Specific, searchable, direct. No "Ultimate Guide" framing. Under 70 chars if possible.]

### Summary

[1–2 sentences. Must work as meta description. Under 155 characters. States what happened, when, who is affected.]

### Body

[Paragraph 1: Who this affects + the key fact]

[Paragraph 2: What changed or what the date is + key detail]

[Paragraph 3: What readers should do]

[Source note: Based on [Authority], [document/page title], [date accessed].]

### SEO title

[H1-quality. Under 60 characters. Includes key entity name + year.]

### Meta description

[Under 155 characters. Answers: what happened, when, who it affects.]

---

## RU draft

### Title

[Natural Russian — not a literal translation. Specific and clear.]

### Summary

[1–2 sentences in natural Russian. Under 155 characters. Must work as standalone meta description.]

### Body

[Абзац 1: Кого касается + ключевой факт]

[Абзац 2: Что изменилось или какая дата + детали]

[Абзац 3: Что делать читателю]

[Источник: На основании [название органа], [документ/страница], [дата проверки].]

### SEO title

[Под 60 символов. Включает ключевое название + год.]

### Meta description

[До 155 символов. Отвечает: что произошло, когда, кого касается.]

---

## Verification still needed

List everything that must be verified before this draft can be considered for publish:

- [ ] [Specific claim — which authority must confirm it — which URL to check]
- [ ] [Specific claim]

---

## What not to claim in this draft

List forbidden claims — things that must NOT appear in the published version without proper sourcing:

- Do not claim [X] without official source from [Authority]
- Do not claim [Y] — applies only to [specific audience], not all
- Do not state [penalty/fee amount] without FTA/official URL

---

## Related Guidex content

| Type | Slug | Relevance |
|---|---|---|
| Guide | [slug] | [why it's related] |
| Event | [slug] | [why it's related] |
| Calendar | [slug] | [why it's related] |

---

## Future admin/import notes

When this draft is ready for DB:

- content_type: news
- Admin module: News admin (`/admin/content/news`)
- Status on import: draft
- ru_published: 0
- noindex: true (until owner explicitly publishes)
- Do not import until verification_required items are resolved

**This file is a draft only. No admin action until explicitly approved.**

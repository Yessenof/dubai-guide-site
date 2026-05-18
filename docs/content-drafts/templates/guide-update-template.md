# [Guide Update Title — EN]

## Draft metadata

```
draft_id:              GU-[YYYYMMDD]-[slug-prefix]
content_type:          guide_update
target_guide_slug:     [slug of the existing guide to update]
status:                draft_file_only
publish_status:        not_for_publish_yet
risk_level:            [low | medium | medium_high | high]
source_reliability:    [official | government | media | internal]
verification_required: [true | false]
date_reviewed:         [YYYY-MM-DD]
last_updated:          [YYYY-MM-DD]
update_type:           [fee_change | step_change | deadline_update | authority_change | new_step | calendar_link_addition | general_refresh]
```

---

## What changed and why

[1–3 sentences: what specifically changed in the regulation, fee, or process — and the official source that confirms it.]

**Official source confirming the change:**

| Source | Type | URL | Access date |
|---|---|---|---|
| [Authority — document] | [official / government] | [URL] | [YYYY-MM-DD] |

---

## Existing guide section to update

**Guide slug:** [slug]  
**Section:** [Which section/step needs updating — e.g. "Step 3: Pay the visa fee"]  
**Current text (approximate):** [Quote or describe what the guide currently says]  
**Problem with current text:** [Why it needs updating — old fee, outdated step, missing info]

---

## EN update draft

### Proposed change to the guide text

**Step/section title (if changing):**

[Proposed new title or unchanged]

**Proposed new body text for this section:**

[New paragraph(s) — short, factual, direct]

**Source note to add:**

[Source attribution — "Based on [Authority], [document], [access date]"]

---

## RU update draft

### Предлагаемое изменение раздела

**Предлагаемый новый текст (RU):**

[Новые абзацы — естественный русский, не калька]

**Источник:**

[Ссылка на источник — «На основании [название органа], [документ], [дата проверки]»]

---

## Calendar relevance

If this update creates a new date-relevant reminder for the calendar:

| Label EN | Label RU | Date / trigger | Type | Confidence |
|---|---|---|---|---|
| [Short label] | [Short RU label] | [Date or "rolling"] | [deadline/reminder] | [confirmed/expected] |

---

## Verification still needed

- [ ] [What must be confirmed before this update can be published]

---

## What not to change in this guide

- Do not remove [existing step] — still valid
- Do not change [fee amount] until [authority] confirms new amount
- Do not alter the general structure without owner approval

---

## Future admin/import notes

When ready for DB:

- Open the existing guide in admin at `/admin/guides/[id]/edit`
- Apply changes to the specific fields noted above
- Do not change publish status — keep existing published state unless a full re-review is warranted
- Record `last_verified_date` field after update

**This file is a draft only. No admin action until explicitly approved.**

# Guidex AI Editorial Admin — Rules and Workflow

**Status:** Planning document — not yet implemented  
**Version:** 1.0 (2026-05-11)  
**Scope:** Content types: news, events, calendar, guides, service pages, tools, reference pages

---

## 1. Executive Summary

One admin panel. One AI-assisted editorial workflow. All content types.

Guidex is growing from a guide site into a large UAE/Dubai knowledge hub. Rather than building separate admin systems for each content type, the editorial admin is a single interface where a manager can paste raw information — source links, press releases, notes, unofficial reports, date lists — and the AI content assistant converts it into the correct structured content type with proper EN/RU fields, SEO metadata, source attribution, and publishing rules.

The AI handles text preparation and structure. Humans approve and publish. The AI never deploys, never touches code, never modifies the database schema, and never publishes without explicit human sign-off.

---

## 2. Allowed AI Tasks

The AI content assistant may perform the following editorial tasks only:

**Content creation:**
- Create a draft for any supported content type from raw input (source text, link, notes, dates)
- Classify raw input as the most appropriate content type (news, event, calendar page, guide, service page, tool, reference)
- Suggest slug, category, and tags based on content
- Propose related guides, service pages, or tools to link internally

**Text editing:**
- Rewrite or tighten existing draft text on request
- Translate EN content into RU draft, flagged as "AI translation — review before publishing"
- Generate SEO title and meta description from content body
- Extract structured facts from a source article or press release
- Mark whether the source is official (government body) or media
- Summarise long source material into the required field lengths

**Dates and calendar:**
- Prepare `dates_json` arrays from raw date lists
- Set `date_confidence` correctly based on source type
- Flag Islamic holidays as `subject_to_official_confirmation` unless an official UAE announcement is provided
- Suggest `has_islamic_dates = 1` when Ramadan, Eid, or other lunar-calendar events are included

**Publishing preparation:**
- Update an existing draft's fields
- Archive content on request
- Prepare a text preview of the page before publish
- Suggest `featured_homepage`, `featured_digest`, or `featured_calendar` flags based on content relevance
- Propose `noindex` where content is thin or preparatory

---

## 3. Forbidden AI Tasks

The AI content assistant must never perform the following, regardless of instruction:

| Category | Forbidden action |
|---|---|
| Code | Modify any `.ts`, `.tsx`, `.js`, `.css`, or config file |
| Database schema | Add, remove, or alter columns, tables, or indexes |
| Routes | Create or delete URL routes or page files |
| SEO infrastructure | Modify `sitemap.ts`, hreflang, canonical tags |
| Analytics | Modify GTM, GA4, or any dataLayer event |
| Deployment | Run builds, restart servers, or push to production |
| Migrations | Run `sqlite3` commands or Drizzle Kit commands |
| Publishing | Set `status = published` without explicit human approval |
| Legal claims | State that a rule is "confirmed" or "official" without a primary government source |
| Holiday confirmation | Mark any Islamic holiday as `date_confidence = confirmed` unless an official UAE moon-sighting announcement is cited |

If the manager asks the AI to perform any of the above, the AI must refuse, explain why, and suggest the correct human action instead.

---

## 4. EN/RU Content Rules

### Preparation
- EN and RU drafts should be prepared together in the same session when possible
- The AI produces an EN draft first, then generates an RU translation draft
- RU draft is always marked as "AI draft — requires human review before publishing"
- RU must be natural human Russian — not machine-literal translation

### Publishing gates
- A page's EN content publishes when `status = published`
- A page's RU content is visible only when both `status = published` AND `ru_published = 1`
- `ru_published = 1` requires at minimum: `ru_title` non-empty, `ru_body` non-empty (for news/guides), or `ru_title` non-empty (for events)
- If RU is not complete or not reviewed: keep `ru_published = 0`

### Language discipline
- No English text on RU-locale pages except established brand names (WhatsApp, Airbnb, EmaraTax, DTCM, GDRFA, MOHRE, DLD, FTA, RTA, DED, Amer, Tasheel, Tawjeeh, ICA, KHDA)
- No mixed-language labels (e.g. do not write "Найти маршрут / Find My Route" — pick the locale)
- Public-facing fallback to EN is not acceptable for published RU routes
- If RU is unavailable, the RU route must not render at all (controlled by `ru_published` flag)

---

## 5. Writing Standard

### Style rules (all content types)
- Short declarative sentences. Mobile-first paragraph lengths.
- No em-dash-heavy constructions. Use a comma, period, or new sentence instead.
- No filler: no "In today's world", no "It is important to note", no "As we all know"
- No overpromising: do not state that a process is "simple", "quick", or "guaranteed"
- State facts first. Context second. No buried lede.
- Numbers when available: AED amounts, day counts, year durations, percentage changes
- Use official entity names: GDRFA, ICA, MOHRE, DLD, FTA, RTA, DED, Amer, Tasheel, Tawjeeh, DTCM, KHDA — not invented shorthand

### For news
- Lead with what changed, not with background
- Second paragraph: who is affected and how
- Third paragraph (if needed): what to do next, what the official source says
- Mark speculation clearly: "as of this report, the official announcement has not been confirmed"

### For events and calendar
- State the date first, then what it means
- If the date is expected but not confirmed, say so in the body, not just in the `date_confidence` field
- Include the official source URL when available

### Prohibited
- Thin content: a title and two sentences is not a publishable news post
- Keyword stuffing: do not repeat "Dubai visa" or "UAE" unnaturally
- Invented facts: no invented AED amounts, no invented addresses, no invented authority names
- Guaranteed timelines: never promise a visa will be approved in X days

---

## 6. SEO Rules

### Metadata
- `en_seo_title`: readable, under 60 characters, includes the primary keyword naturally
- `en_meta_description`: 140–160 characters, describes the page content and any notable specifics
- One clear search intent per page — do not try to rank for multiple unrelated queries from one URL
- Duplicate slugs are not allowed (enforced by DB unique constraint)

### Entities and keywords
Use official entity names naturally where they belong — they are already the primary keyword:
- GDRFA, ICA, MOHRE, DLD, FTA, RTA, DED for government authority contexts
- Amer, Tasheel, Tawjeeh for service center contexts
- DTCM for tourism/short-term rental contexts
- KHDA for school holiday contexts

### Internal links
- Every news post should link to at least one related guide or service page if one exists
- Every event should link to a related guide if the event has procedural implications (e.g. visa renewal deadlines)
- Calendar pages should link to related event entries and guides

### Thin content
- Do not publish monthly calendar pages that contain only a list of dates with no explanatory body
- Do not publish news posts shorter than ~150 words unless the fact is so clear it needs no context
- Use `noindex = 1` for preparatory or placeholder pages that are not yet ready for search

### Images
- Every image must have `image_alt` populated in EN
- If the page has RU content, `ru_image_alt` must also be populated before `ru_published = 1`
- Calendar visual images are allowed as supplementary — the HTML date list is mandatory for SEO

---

## 7. News Content Rules

### Required fields before publishing

| Field | Requirement |
|---|---|
| `slug` | URL-safe, unique, descriptive — matches EN title intent |
| `status` | `published` only after human approval |
| `category` | One of the defined news categories |
| `tags_json` | At least one tag |
| `en_title` | Non-empty, under 80 characters |
| `en_summary` | 1–2 sentences, suitable as meta description |
| `en_body` | Minimum 150 words |
| `en_seo_title` | Non-empty |
| `en_meta_description` | Non-empty |
| `source_url` | URL of the primary source (government site or media outlet) |
| `source_label` | `official` / `media` / `other` |
| `date_published` | ISO 8601 date string |
| `date_updated` | Same as `date_published` on first publish; updated on corrections |
| `related_guide_slug` | Optional but required when a related guide exists |

### RU fields required for `ru_published = 1`

`ru_title`, `ru_summary`, `ru_body`, `ru_seo_title`, `ru_meta_description`, `ru_image_alt` (if image present)

### Source classification
- **Official:** UAE government ministry, authority, or official portal (MOHRE, ICA, GDRFA, FTA, DLD, RTA, DTCM, KHDA, UAEgov.ae, etc.)
- **Media:** UAE or international press (Khaleej Times, Gulf News, Arabian Business, Bloomberg, Reuters, etc.)
- **Other:** Social media, community reports — treat as unverified; do not state as fact unless confirmed from official source

---

## 8. Events Content Rules

### Required fields before publishing

| Field | Requirement |
|---|---|
| `slug` | Unique, descriptive, year-scoped where relevant (e.g. `uae-national-day-2026`) |
| `status` | `published` only after human approval |
| `category` | One of: `holiday`, `deadline`, `industry-event`, `government-event`, `cultural` |
| `color_type` | `public-holiday` / `important-date` / `deadline` / `other` |
| `en_title` | Non-empty |
| `en_summary` | 1–2 sentences |
| `en_body` | Optional but recommended for events with procedural implications |
| `event_date_start` | ISO 8601 date string |
| `event_date_end` | Same as start for single-day events |
| `date_confidence` | `confirmed` / `expected` / `subject_to_official_confirmation` |
| `year` | Integer year of the event |
| `source_url` | URL of the source for the date (government announcement or media) |
| `schema_eligible` | `1` only for confirmed events with a precise date |
| `featured_calendar` | `1` by default |

### Date confidence rules

| Situation | `date_confidence` value |
|---|---|
| Government has officially announced the date | `confirmed` |
| Date is widely expected based on prior years but not announced | `expected` |
| Islamic holiday (Eid, Ramadan, etc.) not yet announced | `subject_to_official_confirmation` |

- `schema_eligible = 1` must only be set when `date_confidence = confirmed`
- The body or notes must include a plain-language disclaimer when `date_confidence` is not `confirmed`

### Calendar colour mapping
- **Red:** public holidays and official days off (`color_type = public-holiday`)
- **Orange:** important deadlines, renewal dates, compliance dates (`color_type = deadline` or `important-date`)
- **Neutral:** other events and cultural dates

---

## 9. Calendar Page Rules

### Required fields before publishing

| Field | Requirement |
|---|---|
| `slug` | Format: `uae-public-holidays-2026` / `uae-holidays-january-2026` |
| `status` | `published` only after human approval |
| `calendar_type` | `yearly` / `monthly` / `holidays` / `ramadan` / `school` |
| `year` | Integer |
| `month` | Integer 1–12 for monthly pages; NULL for yearly or thematic pages |
| `en_title` | Non-empty |
| `en_summary` | 1–2 sentences |
| `en_body` | Minimum: one paragraph explaining the holiday list or month context |
| `en_notes` | Optional: sourcing notes, disclaimers, last-verified note |
| `en_seo_title` | Non-empty |
| `en_meta_description` | Non-empty |
| `dates_json` | Non-empty JSON array of date objects |
| `has_islamic_dates` | `1` if page includes any Ramadan, Eid, or lunar-calendar dates |
| `official_source_url` | URL of the UAE government source for the holiday list |
| `last_verified_date` | ISO 8601 date — when the dates were last checked against official source |
| `image_alt` | Non-empty if `image_path` is set |

### `dates_json` structure (per entry)

```json
{
  "date": "2026-12-02",
  "label_en": "UAE National Day",
  "label_ru": "День образования ОАЭ",
  "type": "public-holiday",
  "confidence": "confirmed",
  "source": "https://u.ae/en/about-the-uae/public-holidays"
}
```

### Islamic holiday rule
- Any page with `has_islamic_dates = 1` must display the disclaimer in the body or notes:
  - EN: *"Islamic holiday dates depend on official UAE moon-sighting announcements and are subject to change. Treat expected dates as provisional until confirmed by UAE authorities."*
  - RU: *"Даты исламских праздников зависят от официального решения властей ОАЭ по наблюдению луны и могут быть изменены. Предварительные даты следует считать ориентировочными до официального подтверждения."*

### SEO requirement
- A visual calendar image alone is not sufficient for SEO
- The HTML date list rendered from `dates_json` is mandatory
- Do not publish thin monthly pages that list dates without any explanatory content

---

## 10. Content Type Classification

When a manager pastes raw information, the AI must first classify the correct content type before drafting. Decision rules:

| Input characteristics | Recommended content type |
|---|---|
| A regulatory announcement, rule change, or policy update | **News post** |
| A specific date or multi-day period (holiday, deadline, ceremony) | **Event** |
| A list of dates for a month or year (all UAE holidays for 2026) | **Calendar page** |
| A step-by-step procedure a person must follow | **Guide / article** |
| A description of what Guidex does for a client | **Service landing page** |
| A decision-support flow (visa type selector, checklist) | **Tool** |
| A list of addresses, fees, or contacts (e.g. all Amer centers) | **Reference / directory page** |

### Classification conflicts
- If a news post announces a change to a procedure that already has a guide, the correct action is: publish a **news post**, then update the existing **guide** — not replace the guide with a news post
- If a press release contains both a date announcement and a policy change, split into: **event** (for the date) and **news post** (for the policy)
- If a topic could be a guide or a service page, use the guide format if the content describes a DIY procedure, and the service page format if the content describes what Guidex does for a client

---

## 11. Admin Workflow

### Session flow

```
1. Manager pastes raw input
   (source link, press release, notes, date list, internal brief)

2. AI identifies content type
   → Confirms with manager: "This looks like a news post about visa rule changes.
     Confirm or redirect."

3. AI asks clarifying questions — only if critical
   Examples of critical questions:
   - "Is this date officially confirmed or expected?"
   - "Is this for EN and RU, or EN only?"
   - "Which existing guide should this link to, if any?"
   Do not ask about non-critical fields — use sensible defaults.

4. AI generates draft
   → All required EN fields
   → RU draft (marked as AI translation)
   → Suggested slug, category, tags
   → Suggested related guide/service/tool links
   → SEO title and meta description

5. Manager reviews preview
   → Edits fields as needed
   → Approves or rejects RU translation
   → Sets ru_published = 1 if RU is ready

6. Manager saves as draft
   → status = draft (default)
   → No public visibility

7. Manager explicitly approves for publish
   → status = published
   → If ru_published = 1, RU route becomes active

8. System records publish action in audit log
   (editor ID, timestamp, content type, slug)
```

### AI question budget
The AI should complete the draft with at most 1–2 clarifying questions per session. Asking 5 questions before producing anything is bad UX. Default values should be used where reasonable, and the manager can correct them in review.

---

## 12. Permission Model

| Role | Can do |
|---|---|
| **Editor** | Create draft, edit draft, request AI assistance, preview |
| **Manager** | Everything Editor can do, plus: approve for publish, set `ru_published`, flag for homepage |
| **Admin** | Everything Manager can do, plus: delete, archive, restore from archive |
| **AI assistant** | Create/edit draft text and structured fields, suggest classification and links, generate SEO metadata — nothing else |

### Hard limits regardless of role
- No one can publish without changing `status` to `published` via an explicit button — not via a toggle or auto-save
- No one can set `ru_published = 1` without first checking that `ru_title` and the relevant `ru_body` fields are non-empty
- The AI cannot trigger any status change — it can only prepare content and suggest values

---

## 13. Homepage Feature Workflow

The AI may suggest that content should appear on the homepage in one of these positions:

| Slot | When to suggest |
|---|---|
| **Important This Month** | Events or calendar entries for the current or next calendar month |
| **Latest UAE Updates** | News posts published within the past 14 days |
| **Calendar Preview** | Upcoming holiday or important date within the next 30 days |
| **Popular Guides** | Guides that are linked from a newly published news post or event |

### Approval required
- The AI sets a suggestion flag (e.g. `featured_homepage = 1` proposed in draft)
- The manager must confirm the flag before it takes effect on the live homepage
- Homepage layout changes — adding a new slot type, reordering modules, or changing the UI — are code changes and must not be handled by the AI or the content admin

---

## 14. Future Implementation Notes

### Architecture principles
- One admin panel for all content types — not separate admin interfaces per type
- One AI content assistant accessible from any content type's edit screen
- Structured field forms are always visible alongside the AI chat — the AI fills fields, not a free-text blob
- The AI output populates individual form fields (title, body, slug, tags) — not a single monolithic "content" field

### Phased implementation order (suggested)

| Phase | What to build |
|---|---|
| Phase 3B | Static skeleton pages for news, events, calendar (done) |
| Phase 3C | DB queries + reader functions for new content types |
| Phase 3D | Public-facing pages for news, events, calendar |
| Phase 4A | Admin forms for news, events, calendar (no AI yet) |
| Phase 4B | AI assistant integrated into admin forms (text generation only) |
| Phase 4C | EN/RU translation draft via Claude API |
| Phase 4D | SEO suggestion module (title/meta/slug/tags from body) |
| Phase 5A | Homepage feature slots wired to DB flags |
| Phase 5B | Audit log for publish actions |
| Phase 5C | Rollback and archive support |
| Future | Image upload, source verification, digest/email export |

### Claude API integration notes (Phase 4B+)
- Use the Claude API (not Claude Code) for content drafting — the AI assistant is a content tool, not a developer tool
- The system prompt for the content assistant must embed this document's rules explicitly
- The assistant must refuse forbidden tasks even if a manager requests them (with a polite explanation)
- All AI-generated text must be clearly labelled "AI draft" until a human edits and approves it
- Token usage should be logged per content session for cost awareness

---

## 15. Hard Checklist Before Publishing

This checklist must be completed before any content item moves from `draft` to `published`. The admin UI should present this as a blocking checklist, not a suggestion.

### Required for all content types
- [ ] Source checked: URL resolves and the content matches what is stated
- [ ] `en_title` non-empty and under 80 characters
- [ ] `en_summary` non-empty and under 200 characters
- [ ] `en_body` non-empty and meets minimum length for the content type
- [ ] `en_seo_title` non-empty and under 60 characters
- [ ] `en_meta_description` non-empty and 140–160 characters
- [ ] No em-dashes in any EN field (use comma or period instead)
- [ ] No unconfirmed claims stated as fact
- [ ] No invented AED amounts, addresses, or authority names
- [ ] `slug` is unique and URL-safe
- [ ] At least one internal link (related guide, service, or tool) added where applicable
- [ ] Preview checked in the admin preview panel

### Required for RU publishing (`ru_published = 1`)
- [ ] `ru_title` non-empty
- [ ] `ru_body` (or `ru_summary` for events) non-empty
- [ ] `ru_seo_title` non-empty
- [ ] `ru_meta_description` non-empty
- [ ] `ru_image_alt` non-empty if image is present
- [ ] No English text in any `ru_*` field except permitted brand names
- [ ] RU text reviewed by a human — not published as raw AI output

### Required for events and calendar
- [ ] `event_date_start` present and in ISO 8601 format
- [ ] `date_confidence` is set correctly — not `confirmed` unless official source confirms it
- [ ] Islamic holiday disclaimer present in body or notes if `has_islamic_dates = 1`
- [ ] `schema_eligible = 0` if `date_confidence` is not `confirmed`

### Required for calendar pages
- [ ] `dates_json` non-empty and valid JSON array
- [ ] `official_source_url` populated
- [ ] `last_verified_date` updated to today
- [ ] HTML date list rendered from `dates_json` (not image-only)
- [ ] Islamic disclaimer present in body if `has_islamic_dates = 1`

### Final gate
- [ ] Human approval recorded (manager or admin explicitly clicked Publish — not auto-publish)

---

*This document is the authoritative rulebook for the Guidex AI Editorial Admin. Any implementation of the content assistant must embed these rules in the system prompt and enforce forbidden-task refusal at the application level.*

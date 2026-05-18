# Content Draft Bank — Guidex

**Workspace type:** File-based draft storage — planning and research only  
**Status:** Active — internal use only  
**Created:** 2026-05-18  

---

## What this folder is

This is a file-based draft workspace for Guidex content.

Everything here is:
- Planning and research material
- Draft text for future review
- Source records and verification notes
- EN/RU content packages in progress

Nothing here is published. Nothing here writes to any database. Nothing here uses the admin panel or AI Inbox.

---

## What this folder is NOT

- This is not a content management system
- This is not connected to the site DB (`data/guides.db`)
- This is not connected to the admin panel (`/admin`)
- This is not connected to the AI Inbox import pipeline
- Files here do not appear on the public site in any form

---

## Folder structure

```
docs/content-drafts/
  README.md                    This file
  news/                        Draft news posts (EN/RU)
  events/                      Draft event pages (EN/RU)
  calendar/                    Draft calendar visual posts and calendar items
  guides/                      Draft new guides (EN/RU)
  guide-updates/               Updates to existing published guides
  source-ledgers/              Per-topic source tracking and research notes
  verification/                Verification status records per content item
  templates/                   Draft templates for each content type
```

---

## Rules for all drafts

### EN/RU parity

Every draft must include both EN and RU fields. RU must be natural Russian — not a literal translation of EN. No English fallback on RU.

Allowed English in RU copy: Guidex, WhatsApp, GITEX, Dubai Opera, AED, FTA, DLD, MOHRE, ICP, GDRFA, DTCM, DMCC, DIFC, ADGM, KHDA, DHA, DEWA, WAM, FAHR — official acronyms and proper nouns only.

### Official source requirement for high-risk topics

Any draft covering the following topics must have an official UAE government source URL recorded before it can be considered for publishing:

- Islamic holiday dates (Eid, Ramadan, Hijri New Year, Mawlid)
- Tax deadlines and penalty amounts (FTA, MoF)
- Visa rules and renewal timelines (ICP, GDRFA)
- Company/license requirements (DED, free zone authorities)
- E-invoicing phase dates (MoF, FTA)
- AML/DNFBP compliance requirements (MOEI, goAML)
- School holiday and academic calendar (KHDA)
- Medical insurance requirements (DHA)
- Any claim involving AED amounts or day/week counts as penalties or deadlines

### No copying from sources

Do not reproduce text from official government portals, competitor documents, advisory PDFs, media articles, or any external source. Paraphrasing close to the original is also not acceptable. All content must be original to Guidex.

### No long em dashes

Do not use `—` in visible body text or titles. Use a colon, comma, or new sentence.

### No fabricated dates

Do not present a date as confirmed unless an official UAE government source (not media) confirms it. For Islamic holidays, never present the date as confirmed without a UAE moon-sighting announcement.

### Date confidence assignment

Every draft with a calendar date must include one of:

- `confirmed` — official UAE government source confirms the specific date
- `expected` — estimated from prior-year pattern, no official announcement yet
- `subject_to_official_confirmation` — depends on moon-sighting or ministerial decision
- `source_signal_only` — media or PDF only, not yet verified officially

### Verification before publish

All `verification_required: true` items must have a verified official source URL recorded in the `sources` section before they can be considered for admin import or publishing.

---

## Workflow

1. Researcher or owner identifies a topic
2. A source ledger file is created in `source-ledgers/` with research notes
3. A draft file is created in the relevant folder using the template
4. EN draft is written — facts first, official attribution, no copying
5. RU draft is written — natural Russian, independent of EN
6. Verification notes are added — what is confirmed, what is still needed
7. Owner reviews the draft file
8. Only after owner approval: consider admin import or DB creation

---

## Publishing path (future — not now)

When a draft is ready for publishing:
1. Owner reviews and approves the file
2. Draft is manually entered via admin panel OR imported via AI Inbox (when that workflow is approved)
3. Admin status stays `draft` with `noindex: true` for second review
4. Owner publishes explicitly via admin

This two-step review ensures nothing goes live without intent.

---

## What does NOT happen from this folder

- No automatic DB writes
- No admin panel actions
- No sitemap updates
- No schema changes
- No AI Inbox submissions (until explicitly approved)
- No publish
- No push to production

---

*Last updated: 2026-05-18*

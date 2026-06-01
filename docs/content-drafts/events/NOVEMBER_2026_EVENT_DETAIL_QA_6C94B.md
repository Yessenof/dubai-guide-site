# November 2026 Event Detail Pages — QA Audit

**Phase:** 6C-94B
**Date:** 2026-06-01
**Files audited:** dubai-design-week-2026.md, ru-dubai-design-week-2026.md, big-5-global-dubai-2026.md, ru-big-5-global-dubai-2026.md

---

## Implementation method

File-based drafts only. The events route (`/events/[slug]`) reads from the DB via `getEventBySlug()`. Creating live pages requires inserting rows into the `events` table. DB writes are out of scope for Phase 6C-94B (hard rule: no DB write). These drafts contain all required content and DB field mappings ready for Phase 6C-94C import.

---

## Dubai Design Week 2026 — EN

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| SEO title present | Yes | "Dubai Design Week 2026 \| 3–8 November, Dubai Design District" | ✓ |
| Meta description present | Yes | Present, ≤160 chars | ✓ |
| H1 / en_title present | Yes | Present, includes dates and venue | ✓ |
| Quick answer block | Yes | Present — dates, venue, access note | ✓ |
| Key facts table | Yes | Present — 7 rows | ✓ |
| Dates correct | Nov 3-8 | "3–8 November 2026" | ✓ |
| Venue correct | d3 | "Dubai Design District (d3)" | ✓ |
| Source note present | Yes | Source and verification date stated | ✓ |
| Calendar backlink present | Yes | Link to /calendar/november-2026-dubai-calendar | ✓ |
| Related guides present | Yes | 2 guides linked | ✓ |
| No unsupported claims | Yes | Sub-event dates not claimed, deferred to official site | ✓ |
| No long paragraphs | Yes | Max 2-3 sentences per paragraph | ✓ |
| No em dashes | Yes | Uses -- not — | ✓ |
| No copied source text | Yes | No direct quotes from dubaidesignweek.ae | ✓ |
| DB fields mapped | Yes | slug, dates, category, source_url, seo_title, meta, body | ✓ |
| related_guide_slug set | Yes | "mainland-company-setup-dubai" (set in Big 5) | N/A for DDW |
| ru_published: 1 flag | Yes | Stated | ✓ |
| noindex: 0 | Yes | Stated | ✓ |

---

## Dubai Design Week 2026 — RU

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| ru_seo_title present | Yes | Present, Russian | ✓ |
| ru_meta_description present | Yes | Present, Russian | ✓ |
| ru_title present | Yes | Present, Russian | ✓ |
| Natural Russian (not literal translation) | Yes | Different structure from EN, editorial tone | ✓ |
| EN fallback absent | Yes | No English text in RU body | ✓ |
| Quick answer in Russian | Yes | Present | ✓ |
| Key facts table in Russian | Yes | Present, Russian labels | ✓ |
| Source note in Russian | Yes | "Проверено июнь 2026" | ✓ |
| Calendar backlink in Russian | Yes | Link to /ru/calendar/november-2026-dubai-calendar | ✓ |
| Related guides in RU | Yes | Links to /ru/guides/ paths | ✓ |
| No em dashes (-- not —) | Yes | Uses -- throughout | ✓ |
| No copied source text | Yes | ✓ | ✓ |

---

## Big 5 Global 2026 — EN

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| SEO title present | Yes | "Big 5 Global 2026 Dubai \| 23–26 November, Dubai World Trade Centre" | ✓ |
| Meta description present | Yes | Present, ≤160 chars | ✓ |
| H1 / en_title present | Yes | Present, includes dates and venue | ✓ |
| Quick answer block | Yes | Present — dates, venue, access, registration note | ✓ |
| Key facts table | Yes | Present — 7 rows | ✓ |
| Dates correct | Nov 23-26 | "23–26 November 2026" | ✓ |
| Venue correct | DWTC | Full DWTC complex description | ✓ |
| Organizer stated | DMG Events | Confirmed on DWTC source page | ✓ |
| Trade-only access noted | Yes | "Trade professionals only" | ✓ |
| Source note present | Yes | DWTC page + metadata + verification date | ✓ |
| Calendar backlink present | Yes | Link to /calendar/november-2026-dubai-calendar | ✓ |
| Related guides present | Yes | 2 guides linked | ✓ |
| related_guide_slug set | Yes | "mainland-company-setup-dubai" | ✓ |
| No unsupported claims | Yes | No exhibitor count, no specific hall assignments | ✓ |
| No em dashes | Yes | ✓ | ✓ |
| DB fields mapped | Yes | All required fields present | ✓ |

---

## Big 5 Global 2026 — RU

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| ru_seo_title present | Yes | Present, Russian | ✓ |
| ru_meta_description present | Yes | Present, Russian | ✓ |
| ru_title present | Yes | Present, Russian | ✓ |
| Natural Russian | Yes | Editorial structure, not word-for-word translation | ✓ |
| EN fallback absent | Yes | No English text in RU body | ✓ |
| Quick answer in Russian | Yes | Present | ✓ |
| Key facts table in Russian | Yes | Present, Russian labels | ✓ |
| Trade-only note in Russian | Yes | "Только для профессионалов" | ✓ |
| Source note in Russian | Yes | "Проверено июнь 2026" | ✓ |
| Calendar backlink in Russian | Yes | Link to /ru/calendar/november-2026-dubai-calendar | ✓ |
| Related guides in RU | Yes | Links to /ru/guides/ paths | ✓ |
| No em dashes | Yes | Uses -- throughout | ✓ |

---

## Internal detail_url plan

| Calendar item | detail_url to set | Page status |
|--------------|------------------|-------------|
| NOV-01-DDW | /events/dubai-design-week-2026 | Draft ready — needs DB import in 6C-94C |
| NOV-02-DD | /events/dubai-design-week-2026 (shared) | Same page |
| NOV-03-BIG5 | /events/big-5-global-dubai-2026 | Draft ready — needs DB import in 6C-94C |
| NOV-04-ADIPEC | null (external CTA only) | No detail page planned |

---

## What prevents rendering now (DB-only route)

The `/events/[slug]` route calls `getEventBySlug(slug, "en")` which reads from the `events` table with `status = 'published'`. Until the event rows are inserted into the DB and published:
- `/events/dubai-design-week-2026` returns 404 (notFound())
- `/events/big-5-global-dubai-2026` returns 404

This is expected. DB import is Phase 6C-94C.

---

## No local build run

No build run needed for docs-only phase. Markdown drafts have no impact on the Next.js build.

---

## Canonical / hreflang (when pages are live)

Once events are imported and published, the existing route logic handles:
- EN page: canonical=`/events/[slug]`, hreflang en + x-default
- RU page: canonical=`/ru/events/[slug]`, hreflang ru + en + x-default

Both are correct in the existing route code (no code changes needed).

---

## Verdict

Both event drafts pass all quality checks. Ready for Phase 6C-94C import into the events table.

| Event | EN | RU | DB fields | Ready |
|-------|----|----|-----------|-------|
| Dubai Design Week 2026 | ✓ | ✓ | ✓ | YES |
| Big 5 Global 2026 | ✓ | ✓ | ✓ | YES |

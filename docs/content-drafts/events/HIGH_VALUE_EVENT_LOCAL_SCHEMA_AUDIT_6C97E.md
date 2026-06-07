# High-Value Event Detail Pages — Local Schema Audit
## Phase 6C-97E | Date: 2026-06-07

---

## 1. events table — required fields

Source: `lib/db/schema.ts` (eventsTable definition)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | text PK | (generated uuid) | |
| slug | text UNIQUE NOT NULL | — | Must be unique |
| status | text | "draft" | "draft" / "published" / "archived" |
| category | text | "holiday" | free-text category label |
| color_type | text | "important-date" | display color hint |
| tags_json | text | "[]" | JSON array of strings |
| en_title | text | "" | |
| en_summary | text | "" | |
| en_body | text | "" | Markdown body |
| en_seo_title | text | "" | |
| en_meta_description | text | "" | |
| ru_published | integer | 0 | 1 = RU fields populated and publishable |
| ru_title | text | "" | |
| ru_summary | text | "" | |
| ru_body | text | "" | |
| ru_seo_title | text | "" | |
| ru_meta_description | text | "" | |
| event_date_start | text | "" | ISO date YYYY-MM-DD |
| event_date_end | text | "" | ISO date YYYY-MM-DD |
| date_confidence | text | "confirmed" | "confirmed" / "estimated" |
| year | integer | 0 | Calendar year |
| source_url | text | "" | Official external source |
| featured_homepage | integer | 0 | 1 = show on homepage carousel |
| featured_digest | integer | 0 | 1 = show in digest |
| featured_calendar | integer | 1 | 1 = shown in calendar UI |
| schema_eligible | integer | 1 | 1 = Event schema markup eligible |
| related_guide_slug | text | "" | FK to guides.slug (soft) |
| related_news_slug | text | "" | FK to news_posts.slug (soft) |
| created_at | text | (auto) | ISO timestamp |
| updated_at | text | (auto) | ISO timestamp |

**Note:** `noindex` is NOT a column on the events table (it is on news_posts). Events use a noindex_after pattern stored in the calendar dates_json items, not in the events table itself.

---

## 2. EN/RU handling for event detail pages

- EN fields are the primary fields: `en_title`, `en_summary`, `en_body`, `en_seo_title`, `en_meta_description`
- RU fields: `ru_title`, `ru_summary`, `ru_body`, `ru_seo_title`, `ru_meta_description`
- `ru_published = 1` enables RU rendering on `/ru/events/[slug]`
- `ru_published = 0` means only EN version is live; RU route falls back to EN or returns 404 (depends on route handling)
- `publishEvent()` validates that if `ru_published = 1`, `ru_title` and `ru_body` must be non-empty
- For these two imports, both EN and RU are ready: set `ru_published = 1`

---

## 3. Slug uniqueness rules

- `slug` column has UNIQUE constraint in SQLite
- Import must check slug does not already exist before inserting
- Local import script uses pre-flight existence check via `getAllEvents()`
- Slugs are permanent once published — changing a slug requires a redirect

---

## 4. Status / indexing fields

- `status = "draft"` — visible in admin, not indexed by SSG
- `status = "published"` — rendered as SSG route `/events/[slug]` and `/ru/events/[slug]`
- `schema_eligible = 1` — enables Event schema.org markup
- `featured_homepage = 0` for both imports (not in carousel yet; activate from Oct 2026 for F1, from Oct 2026 for GITEX per linkage plan)

---

## 5. Source fields

- `source_url` — canonical external source URL (gitex.com, abudhabigp.com)
- No `cta_url` or `detail_url` column on events table (those live on calendar items in dates_json)

---

## 6. Calendar item storage format

Calendar items are stored in `calendar_pages.dates_json` as a JSON array. Each item is an object with the shape confirmed from existing imports (see Batch 2B script). Key fields per item:

| Field | Type | Notes |
|-------|------|-------|
| id | string | Stable unique ID (e.g. "DEC-04-GITEX") |
| date | string | ISO date of the primary display day |
| label_en | string | Full EN label |
| label_ru | string | Full RU label |
| short_label_en | string | Short display label |
| detail_url | string or null | Internal Guidex event page URL |
| brief_en | string | EN tooltip/card brief |
| brief_ru | string | RU tooltip/card brief |
| source_url | string | External source |
| cta_url | string or null | CTA link (external or internal) |
| ... | ... | Other display/meta fields |

---

## 7. detail_url storage field

`detail_url` is a field within each item object in `dates_json`. It is NOT a separate DB column.

To update `detail_url` for an item:
1. Fetch the calendar page (by slug)
2. Parse `dates_json` as JSON array
3. Find the item by its `id` field
4. Set `item.detail_url = "/events/[slug]"`
5. Call `updateCalendarDraft(pageId, { dates_json: JSON.stringify(updatedArray) })`
6. Call `publishCalendar(pageId)`

---

## 8. How calendar pages / dates_json are updated

Pattern from existing scripts:
```typescript
const page = allPages.find(p => p.slug === "december-2026-uae-calendar");
const items = JSON.parse(page.datesJson) as DateItem[];
const idx = items.findIndex(x => x.id === TARGET_ID);
items[idx].detail_url = "/events/some-slug";
const updResult = updateCalendarDraft(page.id, { dates_json: JSON.stringify(items) });
const pubResult = publishCalendar(page.id);
```

`updateCalendarDraft` merges the provided input with existing fields — only `dates_json` needs to be passed for a partial update.

---

## 9. Exact calendar item IDs / slugs confirmed from local DB

Source: `sqlite3 data/guides.db` query on `calendar_pages` where slug = `december-2026-uae-calendar`.

**Calendar page:** `december-2026-uae-calendar`
**Calendar page ID:** `bbe409dc-8367-452a-84a2-7212bd6dee46`
**Status:** published

| Item ID | Date | Label (EN, truncated) | detail_url (current) |
|---------|------|----------------------|---------------------|
| DEC-01-COMMEM | 2026-12-01 | UAE Commemoration Day | None |
| DEC-02-NATDAY | 2026-12-02 | UAE National Day | None |
| **DEC-03-F1** | 2026-12-04 | Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026 | **None → update** |
| **DEC-04-GITEX** | 2026-12-07 | GITEX Global 2026 at Expo City Dubai | **None → update** |
| DEC-05-WINBRK | 2026-12-14 | UAE school winter break begins | None |
| **DEC-NEW-01** | 2026-12-03 | F1 Abu Dhabi Week -- Yasalam opening concert (Lewis Capaldi & Zara Larsson) | **None → update** |
| **DEC-R1** | 2026-12-05 | F1 Abu Dhabi Week -- Imagine Dragons Yasalam | **None → update** |

**Items to update with detail_url:**
- `DEC-04-GITEX` → `/events/gitex-global-2026`
- `DEC-03-F1` → `/events/formula-1-abu-dhabi-grand-prix-2026`
- `DEC-NEW-01` → `/events/formula-1-abu-dhabi-grand-prix-2026`
- `DEC-R1` → `/events/formula-1-abu-dhabi-grand-prix-2026`

**Note on DEC-03-F1 date:** The date field is `2026-12-04` (practice day), not `2026-12-03`. The event window opens Dec 3 but the calendar item date anchors to Dec 4. This is correct — do not change it.

---

## 10. Duplicate check — event detail pages

Query: `SELECT id, slug, status FROM events WHERE slug IN ('gitex-global-2026', 'formula-1-abu-dhabi-grand-prix-2026');`

**Result: 0 rows returned.** Neither slug exists in local DB.

Confirmed safe to insert.

---

## 11. related_guide_slug confirmed

| Event | related_guide_slug | DB verified |
|-------|-------------------|-------------|
| GITEX Global 2026 | `mainland-company-setup-dubai` | YES — slug exists in guides table |
| F1 Abu Dhabi GP 2026 | (empty) | N/A — no direct guide match |

---

## Summary

Schema audit complete. No blockers. Safe to proceed with local import script creation and execution.

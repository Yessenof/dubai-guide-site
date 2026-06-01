# November 2026 Local Import -- Schema Audit
## Phase 6C-94C | Audit date: 2026-06-01

---

## 1. Script identity

| Item | Value |
|------|-------|
| Script | `scripts/november-2026-local-import-6c94c.ts` |
| Phase | 6C-94C |
| Audit date | 2026-06-01 |
| DB target | `data/guides.db` (local, via `lib/db/connection.ts`) |

---

## 2. DB target safety

The import uses `lib/db/news-events-calendar-admin.ts` which imports `lib/db/connection.ts`.
`connection.ts` line 6: `const DB_PATH = path.join(process.cwd(), "data", "guides.db");`

When `npx tsx` runs from the project root, `process.cwd()` resolves to
`/Users/batyr/Desktop/dubai-guide-site/data/guides.db`.

**No SSH. No remote DB connection. No env variable pointing to production.**
The script cannot reach the production DB without explicit SSH access.

Minor gap: the script does not `console.log` the resolved DB path at runtime.
This is noted but does not affect safety since no production path is possible locally.

---

## 3. HOLD items confirmed absent

| Item | Guard mechanism | Result |
|------|-----------------|--------|
| Dubai Fitness Challenge (DFC) | Line 600-604: aborts if `id.includes("DFC")` or `label_en` mentions "fitness challenge" | NOT present in DATES_JSON |
| Global Village Season 31 | Not referenced anywhere in script | NOT present |
| Downtown Design (standalone) | Line 605-609: aborts if `id === "NOV-02-DD"` or `label_en` includes "downtown design" with `id !== "NOV-01-DDW"` | NOT present as standalone |
| Downtown Design mentioned in DDW | The guard correctly exempts NOV-01-DDW from the check | Present only inside DDW label text -- correct |

---

## 4. Events schema match

Comparing script `createEventDraft()` fields against `eventsTable` in `lib/db/schema.ts`:

| Script field | Schema column | Present | Type |
|---|---|---|---|
| slug | slug | YES | text unique |
| category | category | YES | text |
| color_type | color_type | YES | text |
| tags_json | tags_json | YES | text |
| en_title | en_title | YES | text |
| en_summary | en_summary | YES | text |
| en_body | en_body | YES | text |
| en_seo_title | en_seo_title | YES | text |
| en_meta_description | en_meta_description | YES | text |
| ru_published | ru_published | YES | integer |
| ru_title | ru_title | YES | text |
| ru_summary | ru_summary | YES | text |
| ru_body | ru_body | YES | text |
| ru_seo_title | ru_seo_title | YES | text |
| ru_meta_description | ru_meta_description | YES | text |
| event_date_start | event_date_start | YES | text |
| event_date_end | event_date_end | YES | text |
| date_confidence | date_confidence | YES | text |
| year | year | YES | integer |
| source_url | source_url | YES | text |
| featured_homepage | featured_homepage | YES | integer |
| featured_digest | featured_digest | YES | integer |
| featured_calendar | featured_calendar | YES | integer |
| schema_eligible | schema_eligible | YES | integer |
| related_guide_slug | related_guide_slug | YES | text |
| related_news_slug | related_news_slug | YES | text |

**Schema match: FULL. No missing or extra fields.**

---

## 5. Calendar pages schema match

Comparing script `createCalendarDraft()` fields against `calendarPages` in `lib/db/schema.ts`:

| Script field | Schema column | Present | Type |
|---|---|---|---|
| slug | slug | YES | text unique |
| calendar_type | calendar_type | YES | text |
| year | year | YES | integer |
| month | month | YES | integer |
| en_title | en_title | YES | text |
| en_summary | en_summary | YES | text |
| en_body | en_body | YES | text |
| en_notes | en_notes | YES | text |
| en_seo_title | en_seo_title | YES | text |
| en_meta_description | en_meta_description | YES | text |
| ru_published | ru_published | YES | integer |
| ru_title | ru_title | YES | text |
| ru_summary | ru_summary | YES | text |
| ru_body | ru_body | YES | text |
| ru_notes | ru_notes | YES | text |
| ru_seo_title | ru_seo_title | YES | text |
| ru_meta_description | ru_meta_description | YES | text |
| dates_json | dates_json | YES | text |
| last_verified_date | last_verified_date | YES | text |
| featured_homepage | featured_homepage | YES | integer |
| image_path | image_path | YES | text |
| image_alt | image_alt | YES | text |
| ru_image_alt | ru_image_alt | YES | text |
| official_source_url | official_source_url | YES | text |

**Schema match: FULL. No missing or extra fields.**

---

## 6. DATES_JSON items

3 items confirmed in DATES_JSON:

| ID | Date | Type | Emirate | detail_url |
|---|---|---|---|---|
| NOV-04-ADIPEC | 2026-11-02 | conference | Abu Dhabi | null |
| NOV-01-DDW | 2026-11-03 | trade_show | Dubai | /events/dubai-design-week-2026 |
| NOV-03-BIG5 | 2026-11-23 | trade_show | Dubai | /events/big-5-global-dubai-2026 |

ADIPEC correctly labelled as Abu Dhabi (emirate field). detail_url is null (no Guidex page for ADIPEC -- correct, it is an Abu Dhabi event).

---

## 7. Pre-flight duplicate slug guards

The script calls `getAllEvents()` and `getAllCalendarPages()` and aborts with `process.exit(1)` if any target slug already exists.

Local DB state at audit time:
- Events: `uae-eid-al-adha-2026` (published), `uae-e-invoicing-asp-deadline-july-2026` (draft)
- Calendar pages: 10 pages (may through october 2026, plus three compliance/long-weekend pages)
- `dubai-design-week-2026`: NOT present
- `big-5-global-dubai-2026`: NOT present
- `november-2026-dubai-calendar`: NOT present

**All three target slugs are absent. Pre-flight will pass.**

---

## 8. Em dash guard

The script validates all 33 string constants against U+2014 (—) before any DB write.
Script uses `--` (double hyphen) consistently, not em dashes.
**Em dash guard: PASS (expected).**

---

## 9. Rollback instructions (local only)

```sql
DELETE FROM events WHERE slug IN ('dubai-design-week-2026','big-5-global-dubai-2026');
DELETE FROM calendar_pages WHERE slug='november-2026-dubai-calendar';
```

Provided in the script summary block.

---

## 10. Verdict

**SCHEMA AUDIT: PASS**

All schema fields match. All HOLD guards verified. DB target is local only.
Safe to run against local dev DB.

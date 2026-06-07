# High-Value Event Detail Pages — Production Approval Draft
## Phase 6C-97E | For owner review before 6C-97F production import

---

## Production import plan

Import 2 high-value event detail pages and update 4 December 2026 calendar item detail_url links.

All content is locally QA-verified. Build passes. All routes return 200. No blockers.

---

## Production script name

`scripts/import-high-value-event-pages-production-6c97f.ts`

---

## Env confirmation flag

```
CONFIRM_PRODUCTION_IMPORT_6C97F=yes npx tsx scripts/import-high-value-event-pages-production-6c97f.ts
```

---

## DB backup requirement

The production script must create a timestamped DB backup before any write:
`guides.db.backup-pre-6c97f-{TIMESTAMP}`

No production write may proceed until backup is confirmed non-zero.

---

## Exact event pages to import

### 1. GITEX Global 2026

| Field | Value |
|-------|-------|
| slug | gitex-global-2026 |
| category | dubai-event |
| color_type | major-event |
| event_date_start | 2026-12-07 |
| event_date_end | 2026-12-11 |
| source_url | https://www.gitex.com/gitex-global-2026 |
| ru_published | 1 |
| featured_homepage | 0 |
| schema_eligible | 1 |
| related_guide_slug | mainland-company-setup-dubai |
| status after import | published |

Content source: `docs/content-drafts/events/gitex-global-2026.md` (EN) + `docs/content-drafts/events/ru-gitex-global-2026.md` (RU)

### 2. Formula 1 Abu Dhabi Grand Prix 2026

| Field | Value |
|-------|-------|
| slug | formula-1-abu-dhabi-grand-prix-2026 |
| category | festival |
| color_type | major-event |
| event_date_start | 2026-12-03 |
| event_date_end | 2026-12-06 |
| source_url | https://www.abudhabigp.com/en/ |
| ru_published | 1 |
| featured_homepage | 0 |
| schema_eligible | 1 |
| related_guide_slug | (empty) |
| status after import | published |

**IMPORTANT:** category must be `"festival"`, NOT `"event"`. `"event"` is not in the allowed category list and will cause publishEvent to fail.

Content source: `docs/content-drafts/events/formula-1-abu-dhabi-grand-prix-2026.md` (EN) + `docs/content-drafts/events/ru-formula-1-abu-dhabi-grand-prix-2026.md` (RU)

---

## Exact calendar items to update (by verified ID)

Calendar page: `december-2026-uae-calendar`
Calendar page ID (production DB will differ from local): fetch by slug, do NOT hardcode ID.

| Item ID | detail_url to set |
|---------|------------------|
| DEC-04-GITEX | /events/gitex-global-2026 |
| DEC-03-F1 | /events/formula-1-abu-dhabi-grand-prix-2026 |
| DEC-NEW-01 | /events/formula-1-abu-dhabi-grand-prix-2026 |
| DEC-R1 | /events/formula-1-abu-dhabi-grand-prix-2026 |

Script must fetch the calendar page by slug (not hardcoded ID), parse dates_json, update detail_url for each target ID, then call updateCalendarDraft + publishCalendar.

If any item ID is not found in dates_json, script must ABORT (not silently skip).

---

## Production safety checks required in script

- Env flag gate: `CONFIRM_PRODUCTION_IMPORT_6C97F=yes`
- Production path guard: DB path must contain `/var/www/` (abort if it contains `/Users/`, `/home/`, `Desktop`, `/tmp/`, `/var/folders/`)
- Backup before write: non-zero timestamped backup confirmed
- Em dash guard on all string content
- Slug existence check: if either event slug already exists, skip (not duplicate)
- Calendar item ID check: abort if target ID not found in dates_json
- Post-import verification: both events published, all 4 detail_url values verified

---

## Live QA routes (check after deploy)

| Route | Expected |
|-------|----------|
| /events/gitex-global-2026 | 200, GITEX content, Expo City Dubai, Dec 7-11 |
| /ru/events/gitex-global-2026 | 200, Russian content, no EN fallback |
| /events/formula-1-abu-dhabi-grand-prix-2026 | 200, F1 content, Abu Dhabi, Yasalam confirmed |
| /ru/events/formula-1-abu-dhabi-grand-prix-2026 | 200, Russian content, Абу-Даби, no EN fallback |
| /calendar?month=2026-12 | 200, shows /events/gitex-global-2026 and /events/formula-1-abu-dhabi-grand-prix-2026 links |
| /calendar/december-2026-uae-calendar | 200, detail links visible after deploy rebuild |

---

## Deploy command

Use the new zero-downtime script ONLY. Do NOT use old PM2 stop/build/start flow.

```bash
ssh root@85.9.203.69 'cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh'
```

A deploy IS required for this phase because:
- Event detail pages are server-rendered on demand -- they become live as soon as published in DB (no rebuild needed for new event page content)
- However, the `/calendar/december-2026-uae-calendar` SSG page needs a rebuild to reflect the new detail_url values

---

## Rollback command

```bash
ssh root@85.9.203.69 'cd /var/www/guidex && bash scripts/rollback.sh'
```

If production DB must be reverted:
```bash
# On production server -- substitute actual backup filename
cp guides.db.backup-pre-6c97f-{TIMESTAMP} data/guides.db
```

---

## Owner approval required

This draft is for owner review. Do NOT run any production import or deploy until the owner explicitly approves.

When approved, create `scripts/import-high-value-event-pages-production-6c97f.ts` following the same safety pattern as `scripts/import-uae-calendar-batch-2b-production-6c97c.ts`.

# November 2026 Production Approval Draft
## Phase 6C-94C → 6C-94D | Prepared: 2026-06-01

---

## Recommendation

**APPROVE_WITH_NOTES**

All local QA checks pass. One script fix was required and applied (enum values for `category` and `color_type`). Three items remain on HOLD with documented reasons. Content is accurate, sources verified 2026-06-01.

---

## Items approved for production import

### Event 1 — Dubai Design Week 2026

| Field | Value |
|-------|-------|
| Slug | dubai-design-week-2026 |
| URL | /events/dubai-design-week-2026 |
| RU URL | /ru/events/dubai-design-week-2026 |
| Dates | 2026-11-03 to 2026-11-08 |
| Category | festival |
| color_type | major-event |
| source_url | https://www.dubaidesignweek.ae |
| date_confidence | confirmed |
| ru_published | 1 |
| Source verification | dubaidesignweek.ae: "3 - 8 NOVEMBER 2026" homepage (200, checked 2026-06-01) |

### Event 2 — Big 5 Global 2026

| Field | Value |
|-------|-------|
| Slug | big-5-global-dubai-2026 |
| URL | /events/big-5-global-dubai-2026 |
| RU URL | /ru/events/big-5-global-dubai-2026 |
| Dates | 2026-11-23 to 2026-11-26 |
| Category | dubai-event |
| color_type | major-event |
| source_url | https://www.dwtc.com/en/events/the-big-5-2026/ |
| date_confidence | confirmed |
| ru_published | 1 |
| Source verification | dwtc.com: "23 - 26 Nov 2026" and page metadata (200, checked 2026-06-01) |

### Calendar page — November 2026

| Field | Value |
|-------|-------|
| Slug | november-2026-dubai-calendar |
| URL | /calendar/november-2026-dubai-calendar |
| RU URL | /ru/calendar/november-2026-dubai-calendar |
| Year/Month | 2026 / 11 |
| Type | monthly |
| last_verified_date | 2026-06-01 |
| DATES_JSON items | 3 (NOV-04-ADIPEC, NOV-01-DDW, NOV-03-BIG5) |
| ru_published | 1 |

---

## HOLD items (not for production import)

| Item | Reason | Resolution path |
|------|--------|----------------|
| Downtown Design 2026 (standalone) | Source unreachable at audit date (OFFICIAL_PARTIAL only) | Check dubaidesignweek.ae for Downtown Design sub-page closer to event; can be added as standalone item in NOV-02-DD position if confirmed |
| Dubai Fitness Challenge 2026 (DFC) | dfcdubai.com returns 403 at audit date | Retry source check; if confirmed, add as NOV-05-DFC with emirate=Dubai, large date range (Oct-Nov) |
| Global Village Season 31 | No confirmed opening date | Monitor globalvillage.ae for Season 31 announcement; add when date is official |

---

## Notes

1. **Script enum fix:** The import script had `category: "event"` and `color_type: "event"` which are not in the allowed validator enums. Fixed to `festival`/`major-event` (DDW) and `dubai-event`/`major-event` (Big 5) before production import. Script file updated. **The production import script is now `scripts/november-2026-local-import-6c94c.ts` with these fixes applied.**

2. **en_summary warnings:** Both events trigger a non-blocking warning about summary length (3 sentences). The content is accurate and the 3rd sentence is contextually important in both cases. No change recommended before production.

3. **Calendar coverage:** 3/30 November dates covered by DATES_JSON items, spanning 11 unique days (ADIPEC 2-5, DDW 3-8, Big 5 23-26). Coverage will improve significantly when DFC and Downtown Design are resolved.

4. **ADIPEC note:** ADIPEC is correctly marked as `emirate: "Abu Dhabi"` with `detail_url: null`. No Guidex event page exists for ADIPEC (Abu Dhabi event, out of scope). Calendar label correctly states "Abu Dhabi".

5. **Downtown Design mention:** Downtown Design appears inside DDW's label text ("includes Downtown Design") but NOT as a standalone DATES_JSON item. This is intentional — DDW subsumes Downtown Design in the same dates and venue.

---

## Production import procedure (Phase 6C-94D)

When owner approves:

1. Pull production DB backup: `./scripts/db-backup-from-server.sh`
2. Run script against production DB (requires updating DB_PATH or running on server)
3. Verify routes live on production
4. Commit updated memory files

**Deploy command (zero-downtime, requires explicit approval):**
```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```

**Rollback command:**
```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

---

## Local verification sign-off

| Check | Result |
|-------|--------|
| Schema audit | PASS |
| Em dash guard | PASS |
| DFC not in DATES_JSON | PASS |
| Global Village not in DATES_JSON | PASS |
| Downtown Design not standalone | PASS |
| Slug pre-flight guards | PASS |
| Local DB import | SUCCESS (3 rows created, 2 events + 1 calendar page) |
| /events/dubai-design-week-2026 | 200 |
| /ru/events/dubai-design-week-2026 | 200 |
| /events/big-5-global-dubai-2026 | 200 |
| /ru/events/big-5-global-dubai-2026 | 200 |
| /calendar/november-2026-dubai-calendar | 200 |
| /ru/calendar/november-2026-dubai-calendar | 200 |
| /calendar?month=2026-11 | 200 |
| /ru/calendar?month=2026-11 | 200 |
| Dev server errors | NONE |
| Production DB written | NO |
| Push/deploy | NO |

**Phase 6C-94C verdict: COMPLETE. Ready for 6C-94D production approval.**

# November 2026 Production Import Report
## Phase 6C-94D | Date: 2026-06-01

---

## Final status: DEPLOYED_AND_IMPORTED

---

## Commit

| Field | Value |
|-------|-------|
| Commit hash | c157861 |
| Message | Import November 2026 calendar drafts and production import script |
| Branch | main |
| Push status | SUCCESS — pushed to github.com/Yessenof/dubai-guide-site |
| Files committed | 20 (scripts, docs/content-drafts/calendar, docs/content-drafts/events, memory files) |

---

## Deploy

| Field | Value |
|-------|-------|
| Deploy command | `ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"` |
| Deploy result | SUCCESS |
| Build time | 54s |
| Reload time | ~1s |
| Health check | HTTPS guidex-consulting.ae/ → HTTP 200 |
| PM2 status | online, 0% CPU, 136.5mb memory |
| PM2 errors | NONE |
| Old flow used | NO — zero-downtime script used as required |

---

## Production DB backup

| Field | Value |
|-------|-------|
| Backup path | `/var/www/guidex/data/guides.db.backup-pre-nov2026-6c94d-20260601-120456` |
| Backup size | 652K |
| Backup created | Before deploy |
| Production DB written | After deploy, after deploy health check passed |

---

## Production import

| Field | Value |
|-------|-------|
| Import script | `scripts/import-november-2026-production-6c94d.ts` |
| Env gate | `CONFIRM_PRODUCTION_IMPORT_6C94D=yes` |
| DB path logged | `/var/www/guidex/data/guides.db` |
| Timestamp | 2026-06-01T08:06:44.446Z |
| Result | SUCCESS |
| Rows inserted | 3 (2 events + 1 calendar_page) |
| Migrations | NONE |

### Events created

| Slug | ID | Dates | Status |
|------|----|-------|--------|
| dubai-design-week-2026 | 8d67fd22-4673-4df9-84b7-02355e128a26 | 2026-11-03 to 2026-11-08 | published |
| big-5-global-dubai-2026 | a4aa3f84-9769-4314-bd21-dda980bc1a0d | 2026-11-23 to 2026-11-26 | published |

### Calendar page created

| Slug | ID | Month/Year | Status |
|------|----|-----------|--------|
| november-2026-dubai-calendar | 3347c9a7-54e7-405b-975f-4be0e9b53595 | 11/2026 | published |

### DATES_JSON items (3)

| ID | Date | Type | Emirate | detail_url |
|---|---|---|---|---|
| NOV-04-ADIPEC | 2026-11-02 | conference | Abu Dhabi | null |
| NOV-01-DDW | 2026-11-03 | trade_show | Dubai | /events/dubai-design-week-2026 |
| NOV-03-BIG5 | 2026-11-23 | trade_show | Dubai | /events/big-5-global-dubai-2026 |

### HOLD items (not imported)

| Item | Reason |
|------|--------|
| Downtown Design (standalone) | Source unreachable (OFFICIAL_PARTIAL only) |
| Dubai Fitness Challenge (DFC) | Site returns 403 |
| Global Village Season 31 | No confirmed opening date |

---

## Live QA results

All 12 routes checked against https://guidex-consulting.ae

| Route | HTTP | Content check |
|-------|------|--------------|
| / | 200 | Homepage ok |
| /ru | 200 | RU homepage ok |
| /events/dubai-design-week-2026 | 200 | Title: "Dubai Design Week 2026 \| 3-8 November, Dubai Design District" |
| /ru/events/dubai-design-week-2026 | 200 | Title: "Dubai Design Week 2026 \| 3-8 ноября, Dubai Design District" |
| /events/big-5-global-dubai-2026 | 200 | Title: "Big 5 Global 2026 Dubai \| 23-26 November, Dubai World Trade Centre" |
| /ru/events/big-5-global-dubai-2026 | 200 | Title: "Big 5 Global 2026 Дубай \| 23-26 ноября, Dubai World Trade Centre" |
| /calendar/november-2026-dubai-calendar | 200 | Title: "November 2026 Dubai calendar: Dubai Design Week, Big 5 Global and ADIPEC" |
| /ru/calendar/november-2026-dubai-calendar | 200 | RU page renders ok |
| /calendar?month=2026-11 | 200 | Design Week, Big 5, ADIPEC, Abu Dhabi all present; no DFC, no Global Village |
| /ru/calendar?month=2026-11 | 200 | RU index renders ok |
| /calendar/september-2026-dubai-calendar | 200 | Regression check: unchanged |
| /ru/calendar/september-2026-dubai-calendar | 200 | Regression check: unchanged |

**All 12 routes: PASS (200 OK)**

### Content spot-checks passed

- DDW EN: Quick answer, Key facts, Source note, November 2026 calendar backlink, Downtown Design, 3-8 November — all present
- Big 5 EN: Quick answer, Key facts, Source note, DMG Events, 23-26 November — all present
- Calendar index: Design Week, Big 5, ADIPEC, Abu Dhabi present; DFC absent; Global Village absent
- ADIPEC clearly labelled as Abu Dhabi throughout
- DDW calendar item links to `/events/dubai-design-week-2026`
- Big 5 calendar item links to `/events/big-5-global-dubai-2026`
- No raw Markdown or JSON visible
- No downtown Design standalone calendar item

---

## Known notes

1. Both event `en_summary` fields are 3 sentences (vs. 1-2 guideline). Non-blocking; content is accurate and informative.
2. Local DB also has these rows (imported in 6C-94C QA). Local and production are independent.
3. Local dev server process (PID 94330) is still running in background from 6C-94C — stop manually if needed.

---

## Rollback command

```
ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/rollback.sh"
```

To also remove DB rows:
```sql
sqlite3 /var/www/guidex/data/guides.db "DELETE FROM events WHERE slug IN ('dubai-design-week-2026','big-5-global-dubai-2026');"
sqlite3 /var/www/guidex/data/guides.db "DELETE FROM calendar_pages WHERE slug='november-2026-dubai-calendar';"
```

---

## Confirmation checklist

| Item | Result |
|------|--------|
| No migrations | CONFIRMED |
| No admin/AI Inbox | CONFIRMED |
| No unrelated features modified | CONFIRMED |
| No DFC imported | CONFIRMED |
| No Global Village imported | CONFIRMED |
| No Downtown Design standalone | CONFIRMED |
| Production DB backup exists before import | CONFIRMED |
| Zero-downtime deploy script used | CONFIRMED |
| Old PM2 stop/build/start flow NOT used | CONFIRMED |
| Commit hash pushed to GitHub | c157861 |

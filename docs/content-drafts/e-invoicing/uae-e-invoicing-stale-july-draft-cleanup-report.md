# Phase 6C-CONTENT-01-CLEANUP — Stale E-invoicing July Draft Cleanup

**Date:** 2026-06-17 | **Mode:** Local DB write only (dev DB). No deploy, no commit, no push, no schema changes, no admin/AI Inbox use.

---

## 1. Executive summary

The stale unpublished draft event `uae-e-invoicing-asp-deadline-july-2026` was found exclusively in the local development database (`data/guides.db`) and was NOT present in production at all. It carried the superseded deadline of 31 July 2026 (now extended to 30 October 2026 per the official MoF May 2026 amendment), status "draft", date_confidence "subject_to_official_confirmation", and zero inbound links, zero feature flags, and schema_eligible=0. All four deletion criteria were met. The row was deleted from the local dev DB using a parameterized Python/sqlite3 script after a timestamped backup. Production DB was not touched. The October 2026 live calendar page continues to show the correct AED 50M+ threshold (confirmed via live curl after cleanup).

---

## 2. Why cleanup was needed

Phase 6C-CONTENT-01 surfaced `uae-e-invoicing-asp-deadline-july-2026` as a known stale draft. It contained:
- `event_date_start: 2026-07-31` — the original ASP deadline, superseded by the official MoF May 2026 amendment that extended the deadline to 30 October 2026.
- `date_confidence: "subject_to_official_confirmation"` — explicitly marked as unverified at time of creation.
- The title implied the old date and was never updated after the extension was confirmed.

Keeping the stale draft in the dev DB creates risk: if an admin session inadvertently toggled it to "published", a live event page with the wrong (superseded) July 31 date would appear publicly.

---

## 3. Locations searched

| Location | How | Result |
|---|---|---|
| Production DB — `events` table | SSH → sqlite3, WHERE slug = 'uae-e-invoicing-asp-deadline-july-2026' | **Not present** — never imported to production |
| Production DB — `calendar_pages`, `news_posts`, `guides` | Same | Not present |
| Local dev DB — `events` table | sqlite3 local | **Present** — 1 draft row |
| Local dev DB — all other tables | sqlite3 local | Not present in calendar_pages, news_posts, or guides |
| Repo files (app/, components/, docs/, lib/, scripts/) | rg -i — multiple search patterns incl. "july 31", "31 july", "e-invoic.*july", the full slug | 0 matches in active/runnable code files. Historical mentions only in archived phase-summary docs (NOVEMBER_2026_LOCAL_IMPORT_SCHEMA_AUDIT_6C94C.md:135 and uae-events-research-2026-source-ledger.md:225) — neither file can cause an import or publish. |

---

## 4. All stale July draft mentions found

| File | Line(s) | Type | Risk |
|---|---|---|---|
| `data/guides.db` → `events` table (local only) | — | DB draft row — the target of this cleanup | Eliminated by deletion |
| `docs/content-drafts/calendar/NOVEMBER_2026_LOCAL_IMPORT_SCHEMA_AUDIT_6C94C.md` | 135 | Historical reference in an audit doc ("uae-e-invoicing-asp-deadline-july-2026 (draft)") | Zero — this doc is a read-only audit record, cannot import or publish anything |
| `docs/content-drafts/calendar-research/uae-events-research-2026-source-ledger.md` | 225 | Research flag from today's research pass, noting the conflict | Zero — internal research note, already resolved by Phase 6C-CONTENT-01/FIX |

No runnable script, import file, admin route, or public-facing code references the stale slug.

---

## 5. Public exposure check

| Criterion | Status |
|---|---|
| Published? | No — `status = 'draft'` |
| Accessible via public URL? | No — `reader.ts` queries events `WHERE status = 'published'` only; draft events return 404 |
| Indexed? | No — `schema_eligible = 0`; no JSON-LD would be generated even if somehow published |
| Featured on homepage? | No — `featured_homepage = 0` |
| Featured on calendar? | No — `featured_calendar = 0` |
| Linked from any other DB row? | No — inbound link check across all tables returned zero results |
| Used by any live relation? | No |
| Present in production? | **No** — confirmed by direct SSH query against production DB at 85.9.203.69 |

---

## 6. DB/file changes made

**Local dev DB (`data/guides.db`):**
- 1 row deleted: `events` table, `slug = uae-e-invoicing-asp-deadline-july-2026`, `id = 4c1e9d07-86a1-4d6c-9ce7-48387b9c77b8`
- Delete used a parameterized Python/sqlite3 script with pre-check (`status = 'draft'`), row count assertion (expected rowcount = 1), and post-check (row not present; total count went from 6 → 5)
- All 5 remaining events confirmed untouched (uae-eid-al-adha-2026, dubai-design-week-2026, big-5-global-dubai-2026, formula-1-abu-dhabi-grand-prix-2026, gitex-global-2026 — all published)

**Production DB (`/var/www/guidex/data/guides.db` on 85.9.203.69):**
- Not touched this phase. The stale draft was never present in production. No production DB change was needed or made.

**Files created this phase:**
- `docs/content-drafts/e-invoicing/uae-e-invoicing-stale-july-draft-cleanup-report.md` (this file)

---

## 7. Backup path

Local backup taken before deletion: `data/guides.db.pre-einvoicing-july-draft-cleanup-6c-content-01-cleanup-20260617-112027` (819,200 bytes). No server-side backup needed since production DB was not touched.

---

## 8. Final status of uae-e-invoicing-asp-deadline-july-2026

**Before:** `status = draft`, local dev DB only, stale date 2026-07-31, date_confidence = subject_to_official_confirmation, not in production.

**After:** Deleted from local dev DB. Does not exist in any DB (local or production). Does not exist in any importable script. Cannot be accidentally published.

---

## 9. Confirmation that October 2026 live AED 50M fix remains intact

Verified via live curl after cleanup:
- EN: `AED 50M+, 30 October` visible; zero AED 150 matches for e-invoicing content
- RU: `от 50 млн дирхамов, 30 октября` visible; zero `150 млн` matches for e-invoicing content
- Oct 30, 2026 deadline: present and unchanged
- HTTP 200 on both EN and RU October 2026 calendar pages

---

## 10. Confirmation: no deploy/commit/push/admin/AI Inbox/schema changes

- No `git commit` or `git push` run
- No deploy script or PM2 command run
- No admin or AI Inbox route used
- No schema file touched
- No code file in `app/`, `components/`, `lib/`, `proxy.ts`, or `next.config.ts` changed
- Local working tree changes (from phases 6C-CONTENT-01 and 6C-CONTENT-01-FIX): `docs/content-drafts/calendar/october-2026-dubai-calendar.md` (M) and `scripts/october-2026-calendar-import-6c90.ts` (M) — both correct 150M→50M fixes from the prior phase, unchanged by this cleanup phase

---

## 11. Remaining follow-ups

None blocking. All three e-invoicing cleanup tasks initiated in Phase 6C-CONTENT-01 are now complete:

| Task | Phase | Status |
|---|---|---|
| Verify correct threshold (AED 50M vs 150M) via official MoF source | 6C-CONTENT-01 | Done |
| Fix live October 2026 OCT-04-EINV label from AED 150M+ to AED 50M+ | 6C-CONTENT-01-FIX | Done |
| Remove stale July 2026 draft from dev DB | 6C-CONTENT-01-CLEANUP | Done |

Non-blocking watchlist items (already noted in prior phase reports):
- Re-confirm "32 approved ASPs" count from official MoF list before publishing any content that cites a specific number (currently only appears in draft files, not live)
- SME deadlines (31 March 2027 / 1 July 2027) sourced to MoF Guidelines PDF V-1.0 — re-confirm against a fetchable official URL before new content using those dates goes live
- Monitor mof.gov.ae for any further e-invoicing amendments closer to Oct 2026 and Jan 2027 go-live

---

## 12. Next recommended phase

Phase 6C-UI-02 — Premium Visual Refresh.

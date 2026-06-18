# Phase 6C-CONTENT-01-DEV-SYNC — Local Dev DB E-invoicing Consistency Patch

**Date:** 2026-06-17 | **Mode:** Local DB write only. No deploy, no commit, no push, no SSH, no admin, no AI Inbox, no schema changes.

---

## 1. Why local sync was needed

Phase 6C-CONTENT-01-FIX (2026-06-16) patched the **production** database only — the October 2026 `calendar_pages` row, OCT-04-EINV dates_json item: changed `label_en`/`label_ru` from AED 150M+ to AED 50M+. The local dev database (`data/guides.db`) was never patched at that time.

Phase 6C-UI-02 automated visual QA (2026-06-17) surfaced this: the local October calendar page returned "AED 150M+" in page content while production correctly showed "AED 50M+". Future local imports, QA runs, or visual checks against localhost would reflect the stale threshold unless the local DB was brought into sync.

---

## 2. Pre-patch state

### dates_json — OCT-04-EINV (stale)

| Field | Old value |
|---|---|
| `label_en` | `E-invoicing Phase A: ASP appointment deadline for large businesses (AED 150M+, 30 October)` |
| `label_ru` | `E-invoicing Фаза A: дедлайн назначения ASP для крупных компаний (от 150 млн дирхамов, 30 октября)` |

### en_body (stale)

Prose text ending with: `…large taxpayers with annual supplies of AED 150 million and above.`

### ru_body (stale)

Prose text containing: `крупных налогоплательщиков (ежегодные поставки от 150 млн дирхамов)…`

---

## 3. Backup path

```
data/guides.db.pre-local-einvoicing-dev-sync-6c-content-01-dev-sync-20260617-203053
```

Size: 800 KB. Taken before any DB write.

---

## 4. Exact local DB row/item changed

**Table:** `calendar_pages`  
**Slug:** `october-2026-dubai-calendar`  
**Affected fields:** `dates_json` (item `OCT-04-EINV`), `en_body`, `ru_body`, `updated_at`

No other rows touched. No other tables touched.

---

## 5. Old value → new value

### dates_json OCT-04-EINV

| Field | Old | New |
|---|---|---|
| `label_en` | `AED 150M+, 30 October` | `AED 50M+, 30 October` |
| `label_ru` | `от 150 млн дирхамов, 30 октября` | `от 50 млн дирхамов, 30 октября` |

All other OCT-04-EINV fields unchanged: `id`, `date` (2026-10-30), `short_label_en/ru`, `type`, `confidence`, `priority`, `detail_url`, `source_*`, `cta_*`, `emirate`, `risk_level`, `lifecycle`, `noindex_after`, `archive_action`.

### en_body

`AED 150 million and above` → `AED 50 million and above`

### ru_body

`ежегодные поставки от 150 млн дирхамов` → `ежегодные поставки от 50 млн дирхамов`

---

## 6. Verification: only OCT-04-EINV changed in dates_json

Python structural diff confirmed exactly one item changed within the dates_json array (the 13-item array). All other 12 items are byte-identical to the backup.

The `en_body` and `ru_body` patches are within the same calendar_pages row — one substitution each, confirmed by assertion (`count == 1` before and after replacement).

---

## 7. Route content verification

### EN `/calendar/october-2026-dubai-calendar`

| Check | Result |
|---|---|
| e-invoicing + 150M proximity hits | **0** ✓ |
| e-invoicing + 50M+ hits | **2** ✓ |

### RU `/ru/calendar/october-2026-dubai-calendar`

| Check | Result |
|---|---|
| `150 млн` hits on page | **0** ✓ |
| `50 млн` hits on page | **4** ✓ |

Note: 4 EN "150" pattern hits in the raw HTML were false positives — React RSC internal element IDs (`$150`) and the WhatsApp phone number JSON payload, not e-invoicing content.

---

## 8. Production DB — not touched

This phase made zero production changes. No SSH. No remote DB writes. Production `data/guides.db` on `85.9.203.69` was confirmed correct in Phase 6C-CONTENT-01-FIX and verified via SSH in Phase 6C-UI-02. It remains unchanged.

**Note:** Production `en_body` and `ru_body` also contain the stale "150 million" / "150 млн" prose text — those were not patched in Phase 6C-CONTENT-01-FIX (which targeted only the dates_json label). A production body text patch is a future task if the prose text matters for page rendering. The dates_json labels (the visible calendar items) are correct on production.

---

## 9. Confirmations

- No `git commit` or `git push` run
- No deploy script or PM2 command run
- No SSH to production server
- No admin or AI Inbox route used
- No schema file touched
- No unrelated DB rows modified
- No UI files touched (components, app/, lib/, proxy.ts, next.config.ts)
- Local backup taken before any write
- Parameterized queries only (no string interpolation in SQL)

# Phase 6C-CONTENT-01-FIX-BODY — Production October E-invoicing Body Text Correction

**Date:** 2026-06-18 | **Mode:** Production DB write + PM2 cache reload. No code deploy, no commit, no push, no schema changes.

---

## 1. Why this patch was needed

Phase 6C-CONTENT-01-FIX (2026-06-16) corrected the production `dates_json` label for OCT-04-EINV from AED 150M+ to AED 50M+. However, the `en_body` and `ru_body` prose fields on the same row were not patched at that time — they still contained:

- `en_body`: `…large taxpayers with annual supplies of AED 150 million and above.`
- `ru_body`: `…крупных налогоплательщиков (ежегодные поставки от 150 млн дирхамов)…`

Phase 6C-CONTENT-01-DEV-SYNC (2026-06-17) discovered this gap and corrected the local dev DB. Phase 6C-CONTENT-01-FIX-BODY closes the same gap on production.

---

## 2. Backup paths

**Server backup:**
`/var/www/guidex/data/guides.db.pre-einvoicing-body-fix-6c-content-01-fix-body-20260618-093925`

**Local backup:**
`backups/production-db/guides.db.pre-einvoicing-body-fix-6c-content-01-fix-body-20260618-093925`

**Byte-for-byte verification:** MD5 `6a0700ba3b7b6f822950ad402184e010` — matched local and remote ✓

---

## 3. Exact row and columns patched

| Field | Value |
|---|---|
| Table | `calendar_pages` |
| Slug | `october-2026-dubai-calendar` |
| Columns changed | `en_body`, `ru_body`, `updated_at` |
| Row count affected | 1 |

---

## 4. Old body values (stale)

**en_body** (final sentence, before):
> The e-invoicing Phase A ASP appointment deadline falls on 30 October for large taxpayers with annual supplies of **AED 150 million and above**.

**ru_body** (final sentence, before):
> 30 октября — дедлайн для крупных налогоплательщиков (ежегодные поставки **от 150 млн дирхамов**) по назначению аккредитованного поставщика услуг (ASP) для e-invoicing Фаза A.

---

## 5. New body values (corrected)

**en_body** (final sentence, after):
> The e-invoicing Phase A ASP appointment deadline falls on 30 October for large taxpayers with annual supplies of **AED 50 million and above**.

**ru_body** (final sentence, after):
> 30 октября — дедлайн для крупных налогоплательщиков (ежегодные поставки **от 50 млн дирхамов**) по назначению аккредитованного поставщика услуг (ASP) для e-invoicing Фаза A.

One substitution per field. All other body text unchanged.

---

## 6. dates_json OCT-04-EINV — confirmed correct, not touched

Pre-patch verification confirmed `dates_json` was already correct from Phase 6C-CONTENT-01-FIX:
- `label_en`: `E-invoicing Phase A: ASP appointment deadline for large businesses (AED 50M+, 30 October)` ✓
- `label_ru`: `E-invoicing Фаза A: дедлайн назначения ASP для крупных компаний (от 50 млн дирхамов, 30 октября)` ✓
- `date`: `2026-10-30` ✓

`dates_json` was not modified in this phase.

---

## 7. Cache management

After the DB patch, the production Next.js app was serving a cached ISR render containing the old body text. Action taken:

1. Deleted stale ISR cache files for both routes from `.next/server/app/`:
   - `/calendar/october-2026-dubai-calendar.{html,rsc,meta}` and `.segments/`
   - `/ru/calendar/october-2026-dubai-calendar.{html,rsc,meta}` and `.segments/`
2. Ran `pm2 reload guidex-production` — graceful reload, zero downtime, no rebuild, no code change — to flush the in-process Next.js route cache.
3. PM2 status confirmed: `online`, `unstable restarts: 0`.

---

## 8. Live EN/RU QA results

| Check | EN | RU |
|---|---|---|
| HTTP status | 200 ✓ | 200 ✓ |
| `AED 150 million` in body | 0 hits ✓ | — |
| `AED 150M+` in page | 0 hits ✓ | — |
| `150 млн` in page | — | 0 hits ✓ |
| `AED 50 million and above` | 2 hits ✓ | — |
| `AED 50M+, 30 October` label | 2 hits ✓ | — |
| `от 50 млн дирхамов` | — | 4 hits ✓ (2 body + 2 label) |
| `Oct 30` / `30 октября` | 6 hits ✓ | ≥1 ✓ |

No "AED 150" or "150 млн" hits anywhere on either page. All "AED 150" pattern matches in raw HTML verified to be React RSC internal IDs (`$150`) or phone number strings — not e-invoicing content.

---

## 9. Unrelated DB rows

Post-patch DB query: `calendar_pages` rows updated in the last 5 minutes with slug ≠ `october-2026-dubai-calendar` → **0 rows**. No unrelated rows were touched.

---

## 10. Confirmations

- No `git commit` or `git push` run
- No `npm run build` or deploy script run
- No admin or AI Inbox route used
- No schema file touched
- No UI files touched (`app/`, `components/`, `lib/`, `proxy.ts`, `next.config.ts`)
- No unrelated DB rows modified
- No new tax/legal/compliance claims introduced
- Oct 30 deadline unchanged (confirmed: 6 hits of "30 October" on EN page)
- EN/RU facts are now equal: both show 50M+ threshold in label and body prose
- PM2 graceful reload used for cache flush only — not a code deployment

---

## 11. E-invoicing threshold: final production state

All three e-invoicing threshold corrections are now complete in production:

| Phase | Fix | Status |
|---|---|---|
| 6C-CONTENT-01-FIX | `dates_json` OCT-04-EINV label: 150M+ → 50M+ | ✓ Live |
| 6C-CONTENT-01-FIX-BODY | `en_body` / `ru_body` prose: 150M → 50M | ✓ Live |
| 6C-CONTENT-01-DEV-SYNC | Same fixes in local dev DB | ✓ Applied |

---

## 12. Next recommended step

Commit and zero-downtime deploy for **Phase 6C-UI-02** (premium visual refresh):

```bash
git add components/FeaturedSlider.tsx components/detail/DetailHero.tsx \
        components/StickyRouteCta.tsx \
        app/(en)/(public)/page.tsx app/ru/page.tsx \
        NEW_CHAT_TRANSFER.txt PROJECT_STATE.md SESSION_LOG.md \
        docs/content-drafts/ui/ \
        docs/content-drafts/e-invoicing/ \
        package.json package-lock.json \
        docs/content-drafts/calendar/ \
        scripts/october-2026-calendar-import-6c90.ts
git commit -m "feat: premium visual refresh + e-invoicing dev DB sync (6C-UI-02 + 6C-CONTENT-01-DEV-SYNC)"
# Then: ssh root@85.9.203.69 "cd /var/www/guidex && bash scripts/deploy-zero-downtime.sh"
```

# Phase 6C-INFRA-UPCLOUD-DNS-CUTOVER-01 — UpCloud Infrastructure Migration Report

**Phase:** 6C-INFRA-UPCLOUD-DNS-CUTOVER-01  
**Date:** 2026-07-18  
**Status:** COMPLETE — Primary domain confirmed live on UpCloud. Content verified. No DNS change required.

---

## 1. Objective

Verify and complete the migration of the Guidex production website to UpCloud (`85.9.203.69`), ensuring the canonical production domain serves the new Batch 01ABC content (Etihad Rail guide, Mawlid FIX-01, 4 July 2026 live events).

---

## 2. Approved scope

- Confirm canonical production domain
- Verify UpCloud DNS and application state
- Validate new Batch 01ABC content is live
- Handle `guidex.ae` secondary domain
- Document complete infrastructure state
- No GSC Indexing Recovery phase in this task

---

## 3. Domain clarification

### Finding

A prior session detected a 404 at `guidex.ae` and incorrectly identified it as "the production domain." Investigation confirmed:

- **`guidex-consulting.ae`** — canonical, primary, live production domain
- **`guidex.ae`** — secondary domain, not canonical, purpose unclear (registered alias, planned rebrand, or legacy redirect target)

**No domain-name migration occurred. `guidex-consulting.ae` remains the canonical domain.**

### Evidence

- `PROJECT_STATE.md`: "Production domain: https://guidex-consulting.ae ✅ LIVE"
- `PROJECT_STATE.md`: "Nginx: /etc/nginx/sites-enabled/guidex-consulting.ae"
- `PROJECT_STATE.md`: "DNS A record: @ + www → 85.9.203.69 (updated at Tasjeel 2026-04-29)"
- `.env.local` convention: `NEXT_PUBLIC_SITE_URL=https://guidex-consulting.ae`
- Nginx `server_name guidex-consulting.ae www.guidex-consulting.ae`
- All canonical tags: `href="https://guidex-consulting.ae/..."`
- All hreflang: `href="https://guidex-consulting.ae/..."`
- All sitemap entries: `https://guidex-consulting.ae/...`

---

## 4. Final canonical domain

`https://guidex-consulting.ae`

No change from existing architecture. Sitemap, canonical tags, hreflang, and GSC property all preserved.

---

## 5. Purpose of `guidex.ae`

- Current DNS: `guidex.ae` A → `139.162.173.118` (old server)
- Same nameservers as primary: `ns3.tasjeel.ae`, `ns4.tasjeel.ae`
- Serves LiteSpeed 404s for new routes (Etihad Rail, new calendar items)
- Not the canonical domain, not referenced in application code
- **Purpose undetermined** — likely a registered alias or future rebrand domain
- **No DNS change made** (no Tasjeel API credentials available; purpose unclear)
- Recommended future action: point `guidex.ae` → `85.9.203.69` and configure 301 redirect to `https://guidex-consulting.ae`

---

## 6. Old production origin

| Field | Value |
|-------|-------|
| Old Cloudways server | `165.245.187.15` — decommissioned April 2026 |
| Linode/unknown server | `139.162.173.118` — `guidex.ae` still points here |
| Note | Neither is the canonical production origin |

---

## 7. New UpCloud origin

| Field | Value |
|-------|-------|
| IP | `85.9.203.69` |
| OS | Ubuntu 24.04 |
| App path | `/var/www/guidex` |
| DB path | `/var/www/guidex/data/guides.db` |
| PM2 process | `guidex-production` |
| Node | v20.20.2 |

---

## 8. UpCloud preflight results

| Check | Result |
|-------|--------|
| Git HEAD | `ef8b58f` (patch-prod-batch01abc-handoff) |
| PM2 status | online |
| Uptime | 73 minutes |
| Restarts | 63 (0 unstable) |
| Memory | 149.7 MB |
| CPU | 0% |
| Next.js ready | ✓ in 169ms |
| Direct HTTP on port 3000 | 200 on all routes |
| Nginx active | Yes — `/etc/nginx/sites-enabled/guidex-consulting.ae` |
| Nginx server_name | `guidex-consulting.ae www.guidex-consulting.ae` |
| HTTP → HTTPS redirect | 301 ✓ |
| Error log | Empty — no errors |

---

## 9. TLS results

| Field | Value |
|-------|--------|
| Certificate CN | guidex-consulting.ae |
| Issuer | Let's Encrypt, YE2 |
| SANs | guidex-consulting.ae, www.guidex-consulting.ae |
| Valid from | 2026-06-28 |
| Valid to | 2026-09-26 (70 days remaining) |
| Auto-renewal | certbot.timer active — next trigger 2026-07-18 21:16 UTC |
| Chain | Full chain at `/etc/letsencrypt/live/guidex-consulting.ae/fullchain.pem` |
| Hostname mismatch | None |
| HTTPS outage risk | None |

---

## 10. Nginx/server-name results

- `server_name guidex-consulting.ae www.guidex-consulting.ae;`
- HTTP → HTTPS: `return 301 https://$host$request_uri` for both hostnames
- `www.guidex-consulting.ae`: HTTPS 200 (not redirected to apex — existing project convention); canonical tag correctly set to apex
- Proxy pass: `http://127.0.0.1:3000`
- Maintenance page: `/var/www/maintenance/maintenance.html` on 502/503

---

## 11. Database integrity result

| Field | Value |
|-------|--------|
| Path | `/var/www/guidex/data/guides.db` |
| Size | 888,832 bytes (868K) |
| Patch applied | 2026-07-18 via `scripts/patch-prod-batch01abc-handoff.ts` |
| integrity_check | ok |
| guides | 19 |
| steps | 127 |
| calendar_pages | 11 |

---

## 12. Required content verification

### Etihad Rail

| Check | Result |
|-------|--------|
| DB: guide exists, published=1 | ✓ |
| DB: 5 steps | ✓ |
| EN page title | "How to Book and Ride Etihad Rail in the UAE — Guidex Consulting" |
| RU page title | "Как купить билет и поехать на поезде Etihad Rail в ОАЭ — Guidex Consulting" |
| Step 1: Check routes | ✓ |
| Step 3: Book your seat | ✓ |
| Step 5: Check in and board | ✓ |
| Price AED 55 | ✓ |
| Canonical | `https://guidex-consulting.ae/guides/etihad-rail-uae` |
| hreflang en | `https://guidex-consulting.ae/guides/etihad-rail-uae` |
| hreflang x-default | `https://guidex-consulting.ae/guides/etihad-rail-uae` |
| hreflang ru | `https://guidex-consulting.ae/ru/guides/etihad-rail-uae` |
| Sitemap | `/guides/etihad-rail-uae` present |

### July 2026 calendar

| Check | Result |
|-------|--------|
| DB: July items | 10 (was 6) |
| JUL-NEW-04: Dystinct & Issam Najjar, 18 Jul, confirmed | ✓ |
| JUL-NEW-05: Michael Lives Forever, 18 Jul, confirmed | ✓ |
| JUL-NEW-06: Talal Sam & Sultan Al Murshed, 25 Jul, confirmed | ✓ |
| JUL-NEW-07: Indie Soulfest, 26 Jul, confirmed | ✓ |
| 18 Jul events render as separate items | ✓ (two distinct "18 July 2026" entries) |
| "tribute" label for Michael Lives Forever | ✓ |
| RU: Талал Сам | ✓ |
| RU: трибьют | ✓ |

### August 2026 calendar (Mawlid)

| Check | Result |
|-------|--------|
| DB: AUG-NEW-02 date | 2026-08-25 |
| DB: confidence | expected |
| DB: source_url | https://u.ae/... |
| DB: label_en | "Prophet Muhammad's Birthday (Mawlid Al Nabi)" |
| Live: "25 August" rendered | ✓ |
| Live: u.ae source | ✓ |
| Live: publicholidays.ae absent | ✓ |
| Live: "official UAE confirmation" wording | ✓ |
| No 24 August stale version | ✓ |
| No "24-25 August" range | ✓ |
| RU: Мавлид | ✓ |
| RU: Правительство ОАЭ | ✓ |

---

## 13. Authoritative DNS provider

**Tasjeel** (`ns3.tasjeel.ae`, `ns4.tasjeel.ae`) — UAE domain registrar managing both `.ae` domains. Web-only panel; no API CLI available.

---

## 14. Nameservers

Both `guidex-consulting.ae` and `guidex.ae` use:
- `ns3.tasjeel.ae`
- `ns4.tasjeel.ae`

---

## 15. DNS records — before (pre-this-task)

Already correct for primary domain. No change required.

| Hostname | Type | Value | TTL |
|----------|------|-------|-----|
| guidex-consulting.ae | A | 85.9.203.69 | 14400 |
| www.guidex-consulting.ae | CNAME | guidex-consulting.ae | 14400 |
| guidex.ae | A | 139.162.173.118 | ~14400 |
| www.guidex.ae | CNAME | guidex.ae | ~14400 |

---

## 16. DNS records — after (post-this-task)

**No DNS changes made.** Records unchanged. Primary was already correct.

---

## 17. TTL

- `guidex-consulting.ae`: 14400 (4 hours) at Tasjeel
- Effective propagation: already fully propagated since April 2026

---

## 18. Proxy state

No CDN proxy. Direct origin connection. All resolvers return the same A record.

---

## 19. AAAA decision

No AAAA records exist for either domain. UpCloud has no IPv6 configured for production. No change made. No IPv6 conflict.

---

## 20. DNS backup

Pre-task DNS state recorded:

| Hostname | Type | Value |
|----------|------|-------|
| guidex-consulting.ae | A | 85.9.203.69 |
| www.guidex-consulting.ae | CNAME | guidex-consulting.ae |
| guidex.ae | A | 139.162.173.118 |
| www.guidex.ae | CNAME | guidex.ae |

Rollback not applicable — no DNS was changed.

---

## 21. Rollback values

N/A — no DNS mutations performed. Rollback target if UpCloud deployment fails: previous build at `d8a79bc` (pre-Batch-01ABC). Old Cloudways server at `165.245.187.15` was decommissioned April 2026; not available for rollback.

---

## 22. Authoritative DNS verification

Queried `ns3.tasjeel.ae` and `ns4.tasjeel.ae` directly:
- `guidex-consulting.ae` A → `85.9.203.69` ✓

---

## 23. Public-resolver propagation

| Resolver | guidex-consulting.ae A |
|----------|------------------------|
| 1.1.1.1 (Cloudflare) | 85.9.203.69 ✓ |
| 8.8.8.8 (Google) | 85.9.203.69 ✓ |
| 9.9.9.9 (Quad9) | 85.9.203.69 ✓ |
| Local resolver | 85.9.203.69 ✓ |

Fully propagated globally. No resolver discrepancy.

---

## 24. HTTP redirect results

| Request | Response |
|---------|----------|
| http://guidex-consulting.ae/ | 301 → https://guidex-consulting.ae/ ✓ |
| http://www.guidex-consulting.ae/ | 301 → https://www.guidex-consulting.ae/ ✓ |
| https://www.guidex-consulting.ae/ | 200 (canonical tag → apex) ✓ |

---

## 25. Live route QA

All 16 routes tested — 16/16 pass:

| Route | Status |
|-------|--------|
| / | 200 ✓ |
| /ru | 200 ✓ |
| /calendar | 200 ✓ |
| /ru/calendar | 200 ✓ |
| /guides | 200 ✓ |
| /ru/guides | 200 ✓ |
| /guides/etihad-rail-uae | 200 ✓ |
| /ru/guides/etihad-rail-uae | 200 ✓ |
| /calendar/july-2026-dubai-calendar | 200 ✓ |
| /ru/calendar/july-2026-dubai-calendar | 200 ✓ |
| /calendar/august-2026-dubai-calendar | 200 ✓ |
| /ru/calendar/august-2026-dubai-calendar | 200 ✓ |
| /guides/employment-visa | 200 ✓ |
| /events/gitex-global-2026 | 200 ✓ |
| /sitemap.xml | 200 ✓ |
| /robots.txt | 200 ✓ |

---

## 26. Schema and canonical QA

| Check | Result |
|-------|--------|
| Canonical on Etihad Rail EN | `https://guidex-consulting.ae/guides/etihad-rail-uae` ✓ |
| hreflang en | `https://guidex-consulting.ae/guides/etihad-rail-uae` ✓ |
| hreflang x-default | `https://guidex-consulting.ae/guides/etihad-rail-uae` ✓ |
| hreflang ru | `https://guidex-consulting.ae/ru/guides/etihad-rail-uae` ✓ |
| Canonical on www | apex URL (no www) ✓ |
| Sitemap includes etihad-rail-uae | ✓ |
| Sitemap includes july-2026-dubai-calendar | ✓ |
| Sitemap includes august-2026-dubai-calendar | ✓ |
| No localhost URLs in HTML | ✓ |

---

## 27. PM2 and log results

| Field | Value |
|-------|-------|
| Status | online |
| PID | 702499 |
| Uptime | 73m |
| Restarts | 63 |
| Unstable restarts | 0 |
| Memory | 149.7 MB |
| CPU | 0% |
| Error log | Empty |
| Nginx error log | Empty |
| Nginx access log | 200s for all new routes |

---

## 28. Cache handling

No CDN cache. Nginx does not cache HTML responses (only `/_next/static/` gets immutable cache). SSG pages are served directly from the `.next/server/app/` build output. No cache purge required or performed.

---

## 29. Rollback required

**No.** All checks pass. No rollback triggered.

---

## 30. Known propagation limitations

None. DNS has been pointing to UpCloud since April 2026. Full global propagation confirmed across all major resolvers.

---

## 31. Final production status

**LIVE and HEALTHY.**

- Canonical: `https://guidex-consulting.ae`
- Origin: `85.9.203.69` (UpCloud)
- Build: `ef8b58f` (Batch 01ABC production handoff)
- Database: patched, integrity_check=ok, all Batch 01ABC content present
- PM2: online, stable
- SSL: valid to 2026-09-26, auto-renewal active
- All 16 QA routes: 200 ✓

---

## 32. Recommended next phase

**`guidex.ae` secondary domain cleanup** (manual — requires Tasjeel panel access):

1. Log into Tasjeel panel
2. Update `guidex.ae` A record from `139.162.173.118` to `85.9.203.69`
3. After propagation, configure Nginx on UpCloud to serve `guidex.ae` with 301 redirect to `https://guidex-consulting.ae`

**Then:** Phase 6C-INFRA-GSC-INDEXING-RECOVERY-01 — Submit new Etihad Rail, July calendar, August calendar URLs to Google Search Console for indexing.

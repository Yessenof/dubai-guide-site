# Deploy 502 Audit — Phase 6C-93D

**Date:** 2026-05-31
**Status:** Root cause confirmed, fix implemented

---

## 1. Exact root cause

**`pm2 stop` before build drops port 3000 for ~30 seconds.**

nginx proxies all requests to `127.0.0.1:3000`. When `pm2 stop` is called:
- Node.js process exits immediately
- Port 3000 is released
- nginx receives incoming requests and tries to connect to 127.0.0.1:3000
- Connection refused (errno 111) — nginx returns 502 Bad Gateway

The build takes ~25 seconds on the server. PM2 stop + build + PM2 start = approximately **30 seconds of 502** per deploy.

---

## 2. Evidence from nginx error log

The Phase 6C-93C deploy at 16:47 UTC shows this exact pattern in `/var/log/nginx/guidex-error.log`:

```
2026/05/31 16:47:35 [error] connect() failed (111: Connection refused) ... request: "GET /guides?_rsc=lmijs"
2026/05/31 16:47:36 [error] connect() failed (111: Connection refused) ... request: "GET /ru/calendar?_rsc=lmijs"
2026/05/31 16:47:37 [error] connect() failed (111: Connection refused) ... request: "GET /calendar"
2026/05/31 16:47:37 [error] connect() failed (111: Connection refused) ... request: "GET /favicon.ico"
2026/05/31 16:47:43 [error] connect() failed (111: Connection refused) ... request: "GET /"
2026/05/31 16:47:46 [error] connect() failed (111: Connection refused) ... request: "GET /"
2026/05/31 16:47:49 [error] connect() failed (111: Connection refused) ... request: "GET /"
```

14+ seconds of logged 502 errors from a real user browsing the site during our deploy.

---

## 3. Current deploy steps (causing 502)

```bash
# ON SERVER:
git pull origin main                          # 0 downtime
pm2 stop guidex-production                   # ← STARTS 502 WINDOW
nohup npm run build > /tmp/build.log 2>&1    # 25 seconds, 502 throughout
pm2 start ecosystem.config.js               # ← ENDS 502 WINDOW (after warmup)
```

Total 502 window: **~30 seconds per deploy.**

---

## 4. Stack configuration

| Component | Detail |
|-----------|--------|
| nginx upstream | `proxy_pass http://127.0.0.1:3000` |
| PM2 mode | `fork` (single process) |
| PM2 script | `node_modules/.bin/next start` |
| PM2 cwd | `/var/www/guidex` |
| Next.js build output | `/var/www/guidex/.next/` |
| No nginx 502 error_page | Default nginx 502 sent to users |
| nginx proxy_read_timeout | 60s |
| nginx proxy_connect_timeout | 10s |
| Server RAM | 2 GB + 2 GB swap |

---

## 5. Why the old "stop before build" rule was added

Phase 6C-55 (P0 incident): Building while PM2 served traffic caused CSS hash mismatch. The theory: `npm run build` overwrites `.next/static/` with new hashed filenames. The running process still serves the old HTML referencing old CSS hashes. Users with those old pages would get 404 on static assets.

**The revised understanding:** The CSS hash mismatch only affects users with active open tabs during the build window. It does not cause 502. It causes broken styles for ~25 seconds for users who already loaded a page. This is a lower-severity problem than a full 502 for all users.

---

## 6. SEO/RAG risk level

| Risk | Severity |
|------|----------|
| Googlebot hitting site during deploy | HIGH — 502 is treated as a server error, can affect crawl budget |
| AI crawler (GPTBot, ClaudeBot, etc.) during deploy | HIGH — same effect |
| Google Search Console 5xx reporting | MEDIUM — prolonged 5xx patterns can depress ranking |
| User bounce during 502 | HIGH — confirmed real users hit 502 in today's deploy |

With deploys happening roughly weekly, **~30 seconds × deploy frequency = compounding SEO/crawl risk**.

---

## 7. Recommended deploy model

**Build first, reload after.**

1. `git pull` — app runs, no downtime
2. `npm run build` — app runs from old `.next/`, no 502 (CSS mismatch risk for active sessions only)
3. `pm2 reload guidex-production --update-env` — ~2-3 second reload gap vs 30 seconds
4. Health check — verify 200 before declaring deploy done

**Why `pm2 reload` is better than `pm2 restart`:**
- `pm2 reload` sends SIGINT to old process, starts new one
- In fork mode, the gap is only the Node.js process restart time (~2-3s)
- My test today: port 3000 returned 200 within 2 seconds of reload completing

**Total downtime reduction: 30 seconds → ~2-3 seconds (90% improvement)**

---

## 8. Additional safety net: nginx 502 error page

Even with reload, brief 502s can occur. Adding a friendly maintenance page to nginx means users see a meaningful message instead of a blank nginx error. Applied in Phase 6C-93D.

---

## 9. Rollback strategy

- Keep `.next.bak/` (copy of last working build) before each new build
- If new build causes issues: `pm2 stop guidex-production && rm -rf .next && mv .next.bak .next && pm2 start ecosystem.config.js`
- Rollback time: ~5 seconds (no rebuild needed)

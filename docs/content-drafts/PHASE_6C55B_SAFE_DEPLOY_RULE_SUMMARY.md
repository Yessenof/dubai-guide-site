# Phase 6C-55B — Safe Production Deploy Rule Documentation Summary

**Date:** 2026-05-24
**Type:** Documentation-only — no code, no DB, no deploy
**Status:** COMPLETE

---

## What This Phase Did

Documented the mandatory safe production deploy sequence as a permanent rule following the Phase 6C-55 P0 incident. No code, DB, or production changes.

---

## Incident Summary (Phase 6C-55)

**What happened:** During the Phase 6C-54 production deploy, `npm run build` (nohup) ran while PM2 was still serving traffic. Next.js Turbopack deleted the old CSS file (`0i59pw~swdt7w.css`) during the compilation phase before the new file (`0gqktdxjmy9t5.css`) was in service. PM2 continued serving HTML referencing the deleted old CSS hash for ~4 minutes. Real user devices received 500 for CSS and saw fully unstyled HTML.

**Root cause:** Build race condition — old static asset deleted before PM2 stopped serving old HTML that referenced it.

**Evidence:**
```
# Nginx access log at 23/May/2026 20:03:51
5.38.41.155 GET /_next/static/chunks/0i59pw~swdt7w.css → 500
```

**Resolution:** Self-healed after `pm2 restart` at end of deploy. Old CSS: 404 (gone). New CSS: 200, 67,846 bytes, correct Tailwind utilities, all key routes styled.

**User fix:** Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`) on any affected device.

---

## Mandatory Future Deploy Sequence

**For all production code deploys that run `npm run build` on the live server:**

```bash
ssh root@85.9.203.69
cd /var/www/guidex
git pull origin main
npm ci        # only if package-lock.json changed; otherwise skip
pm2 stop guidex-production          # STOP BEFORE BUILD
nohup npm run build > /tmp/guidex-build.log 2>&1
# wait for completion: grep "Generating static pages" /tmp/guidex-build.log
pm2 start guidex-production         # START AFTER BUILD
pm2 status
curl -s -o /dev/null -w "%{http_code}" https://guidex-consulting.ae/
```

**Warning:** Do NOT run `npm run build` (with or without nohup) while PM2 is serving traffic. The race condition window starts at the compilation phase — well before static pages are generated.

**Acceptable downtime:** ~30 seconds during compilation. Acceptable for a low-traffic content site.

---

## Files Updated

### `docs/deployment-upcloud.md`

**"Pull code update and redeploy" section (Common operations):**
- Old: `git pull → npm ci → npm run build → pm2 restart`
- New: `git pull → npm ci → pm2 stop → nohup npm run build → pm2 start` with full explanation of why
- Added warning block and post-deploy verification curl

**Phase 4 — Build and run with PM2:**
- Added inline note clarifying that the first-time build (before PM2 exists) does not have this race condition risk

**Last updated:** bumped from 2026-04-29 → 2026-05-24

### `DECISIONS.md`

New entry added: **"Safe Production Deploy Sequence: Stop PM2 Before Build"**
- Documents the decision, the root cause incident, acceptable downtime, future optional improvement (atomic directory swap), and alternatives rejected

---

## What Was Not Touched

- No code files changed
- No DB records created, modified, or deleted
- No schema or migrations
- No admin or AI Inbox used
- No content imported or published
- No env/secrets/GTM/GA4 accessed
- No push or deploy performed

---

## Future Optional Improvement (Not Required Now)

Zero-downtime atomic swap strategy:

```bash
npm run build -- --no-lint  # build to default .next/
# Before: copy .next to .next.prev
# After: pm2 restart (picks up new .next)
```

Or with staging directory (full atomic approach):

```bash
# Build into separate directory, swap atomically
NEXT_DIST_DIR=.next.new npm run build
mv .next .next.old-$(date +%Y%m%d-%H%M%S)
mv .next.new .next
pm2 restart guidex-production
```

Not implemented — complexity is not justified for current traffic levels. The 30-second stop/build/start window is acceptable.

---

## Commit Recommended?

**Yes** — both `docs/deployment-upcloud.md` and `DECISIONS.md` are checked-in docs per project rules. Recommend including in the next memory files commit alongside `PROJECT_STATE.md`, `SESSION_LOG.md`, `NEW_CHAT_TRANSFER.txt`, `CHECKPOINTS.md`.

Suggested commit message: `docs: document safe production deploy rule after Phase 6C-55 CSS incident`

---

*Phase 6C-55B complete. 2026-05-24. Docs only. No code. No DB. No deploy.*

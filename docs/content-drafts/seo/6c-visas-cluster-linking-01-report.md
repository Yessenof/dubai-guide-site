# Phase 6C-VISAS-CLUSTER-LINKING-01 — Report

**Date:** 2026-06-30  
**Production commit at start:** `043ada3`  
**Status:** LOCAL COMPLETE — no deploy, no push

---

## Current link graph audit

### `lib/related-guides.ts` issues found

| Key | Referenced slugs | Problem |
|---|---|---|
| `spouse-dependent-dubai-inside` | `spouse-dependent-dubai-outside`, `child-dependent-dubai-inside`, `renew-family-visa-dubai` | Key is a wrong slug — no DB entry matches this key. Dead entry. |
| `spouse-dependent-dubai-outside` | `spouse-dependent-dubai-inside`, `child-dependent-dubai-outside`, `renew-family-visa-dubai` | Same — dead entry. |
| `child-dependent-dubai-inside` | `child-dependent-dubai-outside`, `spouse-dependent-dubai-inside`, `renew-family-visa-dubai` | Same — dead entry. |
| `child-dependent-dubai-outside` | `child-dependent-dubai-inside`, `spouse-dependent-dubai-outside`, `renew-family-visa-dubai` | Same — dead entry. |
| `renew-family-visa-dubai` | `spouse-dependent-dubai-inside` (MISSING), `child-dependent-dubai-inside` (MISSING), `amer-center-dubai` | 2 of 3 related guides silently missing. Rendered only 1 related guide. |
| `golden-visa-dubai-property` | `tax-residency-certificate-uae`, `mainland-company-setup-dubai`, `open-business-bank-account-dubai` | No family/parents link despite guide containing parent sponsorship content (from AMER integration). |

### Note on spouse/child guide routing

The actual DB slugs (`spouse-dependent-visa-dubai-inside-country`, etc.) have 308 permanent redirects defined in `next.config.ts` pointing to canonical custom group pages (`/guides/spouse-dependent-visa-dubai?route=inside`). The custom group pages use a separate rendering component (GuideTabs) that does not use the `RELATED_GUIDES` system. The dead entries in `related-guides.ts` are harmless (never match) but the real issue was `renew-family-visa-dubai` silently losing 2 out of 3 related guides.

### Family hub card order (before)

1. Spouse
2. Child
3. Newborn
4. Renew
5. Parents

---

## Changes made

### `lib/related-guides.ts`

**`renew-family-visa-dubai`** — replaced 2 dead entries with real working slugs:

Before:
```typescript
"renew-family-visa-dubai": [
  "spouse-dependent-dubai-inside",   // MISSING — slug does not exist in DB
  "child-dependent-dubai-inside",    // MISSING — slug does not exist in DB
  "amer-center-dubai",
],
```

After:
```typescript
"renew-family-visa-dubai": [
  "parents-visa-dubai",
  "newborn-visa-dubai",
  "amer-center-dubai",
],
```

Rationale: renew family visa is directly relevant to parents visa holders (they'll need renewal), and newborn visa is a natural related journey. Both slugs exist in the DB and are published.

**`golden-visa-dubai-property`** — added parents visa link:

Before:
```typescript
"golden-visa-dubai-property": [
  "tax-residency-certificate-uae",
  "mainland-company-setup-dubai",
  "open-business-bank-account-dubai",
],
```

After:
```typescript
"golden-visa-dubai-property": [
  "parents-visa-dubai",
  "tax-residency-certificate-uae",
  "mainland-company-setup-dubai",
],
```

Rationale: Golden Visa property guide includes confirmed parent sponsorship content (added in AMER integration phase). `open-business-bank-account-dubai` was the least relevant for a property buyer. `parents-visa-dubai` is now the most natural next step for Golden Visa holders who want to sponsor parents.

### `app/(en)/(public)/visas/family/page.tsx` + `app/ru/visas/family/page.tsx`

Family hub card order updated — Parents promoted above Newborn:

New order (EN + RU):
1. Spouse
2. Child
3. Parents ← promoted from position 5
4. Newborn
5. Renew

Rationale: Parents visa is a primary visa sponsorship action (same as spouse/child). Newborn and Renew are more specific/follow-up scenarios.

---

## Files changed

| File | Type of change |
|---|---|
| `lib/related-guides.ts` | Updated 2 entries (renew-family, golden-visa) |
| `app/(en)/(public)/visas/family/page.tsx` | Hub card reorder only |
| `app/ru/visas/family/page.tsx` | Hub card reorder only |

---

## DB backup path

No DB writes — no backup required.

---

## No DB slugs changed

All changes are in static TypeScript files only.

---

## EN/RU parity

Hub cards reordered identically in EN and RU. All card hrefs and content are consistent between languages.

---

## Build result

90/90 static pages, 0 TypeScript errors.

---

## Local QA result

All 16 routes HTTP 200:

| Route | Status |
|---|---|
| `/guides/parents-visa-dubai` | 200 ✓ |
| `/ru/guides/parents-visa-dubai` | 200 ✓ |
| `/guides/golden-visa-dubai-property` | 200 ✓ |
| `/ru/guides/golden-visa-dubai-property` | 200 ✓ |
| `/guides/employment-visa` | 200 ✓ |
| `/ru/guides/employment-visa` | 200 ✓ |
| `/guides/spouse-dependent-visa-dubai` | 200 ✓ |
| `/ru/guides/spouse-dependent-visa-dubai` | 200 ✓ |
| `/guides/child-dependent-visa-dubai` | 200 ✓ |
| `/ru/guides/child-dependent-visa-dubai` | 200 ✓ |
| `/guides/renew-family-visa-dubai` | 200 ✓ |
| `/ru/guides/renew-family-visa-dubai` | 200 ✓ |
| `/visas/family` | 200 ✓ |
| `/ru/visas/family` | 200 ✓ |
| `/visas/golden` | 200 ✓ |
| `/ru/visas/golden` | 200 ✓ |

Content checks:
- `renew-family-visa-dubai` related section: "Parents Visa Dubai" + "Newborn Visa" cards visible ✓ (was silently empty for 2 of 3 slots)
- `golden-visa-dubai-property` related section: "Parents Visa Dubai" card visible ✓
- `parents-visa-dubai` related section: renew + golden + employment all present ✓
- EN hub card order: Spouse → Child → Parents → Newborn → Renew ✓
- RU hub card order: identical ✓
- RU no EN fallback ✓

---

## Full updated link graph (visa cluster)

| Page | Related guides (after fix) |
|---|---|
| `parents-visa-dubai` | renew-family-visa-dubai, golden-visa-dubai-property, employment-visa |
| `golden-visa-dubai-property` | **parents-visa-dubai** (new), tax-residency-certificate-uae, mainland-company-setup-dubai |
| `renew-family-visa-dubai` | **parents-visa-dubai** (new), **newborn-visa-dubai** (fixed), amer-center-dubai |
| `employment-visa` | employment-visa-dubai-outside-uae, amer-center-dubai, document-attestation-dubai |
| `newborn-visa-dubai` | child-dependent-dubai-inside (dead key, harmless), spouse-dependent-dubai-inside (dead key, harmless), renew-family-visa-dubai |

Note: `newborn-visa-dubai` key in related-guides.ts still references old dead spouse/child slug names. These produce empty results for those 2 slots but `renew-family-visa-dubai` renders correctly. This could be a future cleanup item if newborn guide SEO is prioritised.

---

## Confirmed

- No DB writes
- No deploy
- No push
- No schema changes
- No migrations
- No admin / AI Inbox / auth / proxy changes
- No manual PM2 stop/start
- No new visa claims, fees, salaries or requirements added
- EN/RU parity maintained

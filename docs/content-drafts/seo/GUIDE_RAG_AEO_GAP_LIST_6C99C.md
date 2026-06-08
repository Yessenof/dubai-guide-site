# Guide RAG/AEO Gap List — Phase 6C-99C
## Date: 2026-06-08 | AUDIT ONLY — NO DEPLOY

---

## Scope

This lists current gaps in guide pages that affect RAG/AEO answerability, machine readability, or Google/AI interpretation quality. These are documentation items — no code changes required beyond what was implemented in Phase 6C-99C.

---

## 1. Quick answer / RouteSnapshot (visible)

| Gap | Status |
|---|---|
| RouteSnapshot block already renders: cost, timeline, audience, steps count, "start" (first step) | PRESENT |
| `lastUpdated` shown as human text ("April 2026") | PRESENT — usable for display; not ISO for schema |
| No `datePublished` in ISO format in DB | GAP — `created_at` is admin entry time; `last_updated` is editorial but human-readable |
| No source link visible to user | GAP — most guides have no visible "Source: MOHRE / GDRFA" link on page |
| No inline disambiguation of fee ranges vs. total costs | MINOR GAP — some guides have complex fee notes |

**Recommended future fix:** Add a `datePublished` text field to guides (ISO format, set by admin at first publication). Use it for both display and Article schema. This requires a DB migration — out of scope for this phase.

---

## 2. Key facts block (visible)

| Gap | Status |
|---|---|
| Cost shown in RouteSnapshot | PRESENT |
| Timeline shown in RouteSnapshot | PRESENT |
| Audience shown in RouteSnapshot | PRESENT |
| Step count shown in RouteSnapshot | PRESENT |
| No separate "Key Facts" card | The RouteSnapshot effectively serves this role. Not a significant gap. |
| No authority/issuing body shown in RouteSnapshot | GAP — "Where" is in steps, but no "Issued by: MOHRE / ICA / DED" at the top |

**Recommended future fix:** Add an optional "Issued by" field (authority name) to the guides table and show it in RouteSnapshot. Low risk, high AEO value.

---

## 3. Source note (visible)

| Gap | Status |
|---|---|
| No visible source attribution on any guide page | GAP — all 17 guides have no "Source: MOHRE / FTA" visible link |
| No `lastVerifiedDate` (ISO) in schema | GAP — `lastUpdated` is human text, not ISO |
| No official government URL linked per guide | GAP — official portal URLs appear in step `address` fields but not as a standalone source block |

**Recommended future fix:** Add an optional `sourceUrl` and `sourceLabel` field to guides table (like news_posts already has). Render a "Source" row in the overview section. Would improve both user trust and AI citation quality. Requires DB migration.

---

## 4. Visible steps (step rendering)

| Gap | Status |
|---|---|
| Full steps rendered via StepCard component | PRESENT |
| Step list outline above detailed steps | PRESENT |
| Steps have title, what, where, address, cost, time, advice, warning | PRESENT |
| Steps have RU content for all 17 guides | PRESENT |
| No step anchor IDs (e.g., `id="step-1"`) | GAP — HowToStep URL cannot be added without stable anchors; prevents in-page step linking |
| `step_order` integers present and consistent | PRESENT |

**Recommended future fix:** Add `id="step-{stepOrder}"` to each StepCard's outer div. This enables HowToStep URL references and deep-linking to individual steps. Low-effort template change, no DB migration.

---

## 5. RU parity

| Gap | Status |
|---|---|
| All 17 guides have ru_title, ru_summary, ru_audience, ru_overview | PRESENT |
| All steps have ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning | PRESENT |
| RU template uses `locale="ru"` and localizeValue | PRESENT |
| RU guide pages have correct hreflang (en/ru/x-default) | PRESENT |
| No English fallback leak detected in RU step content | VERIFIED |

**Status: RU parity is complete for all 17 guides.**

---

## 6. CTA quality

| Gap | Status |
|---|---|
| Two CTAs above the fold: "Find My Route" + "Ask an Expert (WhatsApp)" | PRESENT |
| Footer CTA: "Need help with this process?" + WhatsApp | PRESENT |
| No upsell repetition (CTAs appear twice max) | PRESENT |
| TRC page has "Check My Case" + "Chat on WhatsApp" CTAs | PRESENT |
| No pricing CTA or misleading call-to-action | PRESENT |

**Status: CTA implementation is clean. No gaps.**

---

## 7. Related guide links (internal linking)

| Gap | Status |
|---|---|
| No "Related guides" section on any guide detail page | GAP — template has no related-guides block |
| No cross-linking between companion guides (e.g., inside-country vs. outside-country visa) | GAP |
| Tab hub pages (`child-dependent-visa-dubai`, `spouse-dependent-visa-dubai`) link to companion guides via tabs | PARTIAL — hub pages help but individual slugs don't cross-link |
| No link from guide to related event or news | GAP |
| No link from guide to related calendar page | GAP |

**Recommended future fix (Phase 6C-99D target):** Add a `related_guides_json` field (array of slugs) to the guides table. Render as a "Related guides" section below the overview. Also link to related calendar/news slugs. Requires DB migration.

---

## 8. Official source recheck

| Guide | Last updated | Risk | Notes |
|---|---|---|---|
| `employment-visa` | April 2025 | medium | Oldest guide. MOHRE fee changes possible in 1+ year. |
| `child-dependent-visa-dubai-outside-country` | April 2025 | medium | Same vintage. Fees may need review. |
| `free-zone-company-setup-dubai` | April 2026 | low | Recent |
| `mainland-company-setup-dubai` | April 2026 | low | Recent |
| `open-business-bank-account-dubai` | April 2026 | low | Recent |
| `holiday-home-permit-dubai` | May 2026 | low | Recent |
| `tax-residency-certificate-uae` | May 2026 | low | Recent |

**Action recommended:** Owner should review `employment-visa` and `child-dependent-visa-dubai-outside-country` guides for fee accuracy — both are 14+ months old. No code changes needed.

---

## 9. Hub pages (tab-based)

| Page | Status |
|---|---|
| `/guides/child-dependent-visa-dubai` | Tab hub rendering 2 guide variants; no Article/HowTo schema added this phase |
| `/guides/spouse-dependent-visa-dubai` | Same |
| `/ru/guides/child-dependent-visa-dubai` | Same |
| `/ru/guides/spouse-dependent-visa-dubai` | Same |

**Recommended future treatment:** These hub pages could receive a custom Article schema with the group-level title/summary. HowTo is not appropriate since they render two guides in tabs. Defer to Phase 6C-99D or later.

---

## 10. Schema gaps still open after Phase 6C-99C

| Gap | Priority | Requires |
|---|---|---|
| `HowToStep.url` (deep-link to each step) | MEDIUM | Add `id="step-{n}"` to StepCard — template change only, no DB |
| `datePublished` (ISO) in Article schema | MEDIUM | New DB field `date_published` on guides table — migration required |
| `sourceUrl` / `sourceLabel` visible on page | HIGH | New DB fields + admin UI + template change — migration required |
| `issuedBy` / authority in RouteSnapshot | MEDIUM | New DB field — migration required |
| Related guides cross-links | HIGH | `related_guides_json` DB field — migration required |
| HowTo `totalTime` / `estimatedCost` in ISO/structured format | LOW | Human-readable text currently; requires structured DB fields |
| FAQPage schema | LOW | No visible FAQ blocks exist on any guide page |
| Hub page Article schema | LOW | Can be added without migration — title/summary from guide-groups config |

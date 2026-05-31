# Calendar SEO/RAG Connection Audit — Phase 6C-93A

**Date:** 2026-05-31
**Status:** Audit complete

---

## 1. Internal detail page inventory

| Calendar item | detail_url | Has Guidex page | External CTA | Internal value |
|--------------|------------|-----------------|--------------|----------------|
| OCT-04-EINV | /calendar/uae-e-invoicing-2026-asp-deadline | ✓ YES | No | High — links within Guidex |
| All others (30+) | null | ✗ NO | Yes | Zero internal SEO |

**One out of ~31 live calendar items has an internal Guidex detail_url. All others send users directly off-site.**

---

## 2. Items sending users off-site (external-only)

Every live calendar item except OCT-04-EINV has `detail_url: null` with `cta_url` pointing to:
- visitdubai.com (DSS, DSF)
- dwtc.com (trade shows)
- individual event websites (ATM, Seamless, WETEX, etc.)
- tax.gov.ae (compliance items)
- gitex.com (future)

**Impact:** Users who arrive at a Guidex calendar page and tap an event CTA immediately leave Guidex. Guidex gets zero engagement depth, no pageviews after first, no time-on-site from event interest.

---

## 3. Items that need Guidex briefs (L2 details)

L2 briefs (`brief_en`, `brief_ru`) render as `<details>` elements on the calendar detail page. These are indexable content. They provide Guidex-hosted event descriptions that search engines and AI can cite.

### Currently have L2 briefs (correct)

| Item | Brief type |
|------|-----------|
| AUG-01-DSS (59-day festival) | Full L2 brief |
| SEP-04-ATM (Arabian Travel Market) | Full L2 brief |
| SEP-08-TAX (Corp Tax deadline) | Full L2 brief |
| OCT-02-WETEX (WETEX) | Full L2 brief |
| JUL-03-DSS | Full L2 brief |

### Should have L2 briefs but don't

| Item | Why brief is needed |
|------|---------------------|
| GITEX Global Dec (future) | Highest business relevance — needs Guidex context |
| Big 5 Global Nov (future) | Construction/property audience |
| Dubai Design Week Nov (future) | Design/property audience |
| SEP-01-MEE (Middle East Energy) | Energy/tech audience |
| OCT-01-BEAUTY (Beautyworld) | Beauty/retail audience |
| AUG-03-DIHAD (humanitarian) | Conference audience |
| SEP-02-IPS (Property Show) | Property audience — strong Guidex alignment |

### Calendar-only items (no brief needed — correct)

| Item | Reason |
|------|--------|
| Public holidays (Dec 1, Dec 2-3) | Self-explanatory, no brief needed |
| Short single-day events (Def Leppard) | Ticket link is the only CTA |
| VAT Q3 deadline | Brief in SEP-08-TAX is the reference — cross-link |
| E-invoicing ASP (Oct 30) | Cross-ref to e-invoicing detail page |

---

## 4. Items that need full Guidex events detail pages

These items warrant a `/events/[slug]` or `/calendar/[slug]` detail page:

| Item | Priority | Why |
|------|----------|-----|
| GITEX Global Dec 2026 | P0 | Business founders audience, Guidex company setup overlap |
| Dubai Fitness Challenge (if confirmed) | P1 | Citywide event, lifestyle/family audience |
| Arabian Travel Market Sep | P1 | Tourism/holiday-home operator audience |
| Dubai Design Week Nov | P2 | Property/interior/lifestyle audience |
| Big 5 Global Nov | P2 | Construction/property audience |
| DSS Jul-Aug | P3 | Large audience but low business-guide overlap |

---

## 5. Calendar items that should link to existing Guidex guides

| Calendar item | Related Guidex guide | Link direction |
|--------------|---------------------|----------------|
| Corp Tax deadline (SEP-08-TAX) | Future: corporate-tax-return-deadline guide | Calendar → Guide |
| E-invoicing (OCT-04-EINV) | uae-e-invoicing-2026-asp-deadline calendar | Calendar ↔ Calendar |
| VAT Q3 (OCT-03-VAT) | Future: uae-vat-registration-threshold guide | Calendar → Guide |
| GITEX (future) | mainland-company-setup-dubai | Event detail → Guide |
| ATM (SEP-04-ATM) | holiday-home-permit-dubai | Calendar → Guide |
| IPS (SEP-02-IPS) | Future: property-related guide | Calendar → Guide |
| DFC (future) | relocation/living guides | Calendar → Guide |
| DSS/DSF (lifestyle) | No clear guide overlap | — |

---

## 6. Guide pages that should link back to calendar

| Guide | Should link to |
|-------|---------------|
| uae-e-invoicing (future) | uae-e-invoicing-2026-asp-deadline calendar page |
| corporate-tax-return (future) | september-2026-dubai-calendar (SEP-08-TAX) |
| vat-registration-threshold (in progress) | october-2026-dubai-calendar (OCT-03-VAT) |
| holiday-home-permit-dubai | september-2026-dubai-calendar (ATM context) |
| mainland/free-zone guides | december-2026-dubai-calendar (GITEX context) |

---

## 7. Missing schema/date/status fields

| Field | Missing on | Impact |
|-------|-----------|--------|
| `period_end` | All live items (range inferred from noindex_after) | Inaccurate grid expansion; brittle |
| `is_external` | Most items | Missing "external link" badge in AgendaCard |
| `last_verified_date` | Per-item (only page-level set) | Can't show freshness per event |
| Structured data (JSON-LD Event schema) | No event schema on any page | Not eligible for rich results |
| hreflang on calendar detail pages | Verify — may be present | |

**Priority fix: `period_end`** — Setting explicit `period_end` on multi-day events removes dependency on `noindex_after` for range inference. This is the root cause of the July/August bar spam. With the UX patch, the immediate problem is solved for long-range items. But explicit `period_end` would be the correct long-term fix.

---

## 8. SEO/RAG value model per item type

| Content type | SEO value | AI/RAG value | Action |
|-------------|-----------|-------------|--------|
| Calendar page with L2 briefs | Medium — Guidex-hosted content | Medium — AI can cite the brief | Keep writing briefs for major events |
| Calendar item with detail_url | High — internal anchor, user stays | High — AI cites Guidex for event info | Priority: create detail pages for top events |
| Calendar item — external only | Low — just a link directory | Zero — AI cites the external site, not Guidex | Add briefs; eventually detail pages |
| Calendar item — compliance | High — official process content | High — business owners search for deadlines | Link to or create Guidex compliance guides |
| Monthly calendar hub page | Medium-high — covers the whole month | Medium — AI knows "Guidex covers Dubai Oct 2026" | Ensure every month is published, indexed |

---

## 9. Noindex risk items

These items should be verified for correct indexing:

| Item | Status | Risk |
|------|--------|------|
| june-2026-uae-calendar | live, index/follow | ✓ |
| july-2026-dubai-calendar | live, index/follow | ✓ |
| august-2026-dubai-calendar | live, index/follow | ✓ — but only 3 items, thin content |
| uae-business-compliance-calendar-2026-2027 | draft | Should be noindex while draft |

**August 2026 concern:** 3 items, very thin content (only 3 events + 1 DSS monthly highlight). Google may classify this as thin content and not index it meaningfully. Adding KHDA school items or a compliance anchor would improve page depth.

---

## 10. Priority actions from this audit

| Priority | Action | Impact |
|----------|--------|--------|
| P0 | Import December 2026 calendar (holidays + GITEX) | Fills Dec gap; GITEX is highest-value event |
| P0 | Import November 2026 calendar (DDW + Big5) | First November content |
| P0 | Import January 2027 calendar (e-invoicing + VAT Q4) | Compliance chain completion |
| P1 | Add L2 briefs to GITEX, Big5, DDW when imported | Internal SEO content |
| P1 | Create GITEX events detail page | High-value business audience |
| P1 | Set explicit period_end on all multi-day items (DB fix, future phase) | Fix root cause of range inference |
| P2 | Add `is_external: true` to external CTA items | Better UX badge |
| P2 | Link VAT guide to October calendar page | Internal link network |
| P2 | Create corporate tax return guide | Supports Sep/Oct compliance items |
| P3 | Add KHDA school dates to Aug/Sep calendar | Family audience coverage |
| P3 | Add JSON-LD Event schema to calendar detail pages | Rich results eligibility |

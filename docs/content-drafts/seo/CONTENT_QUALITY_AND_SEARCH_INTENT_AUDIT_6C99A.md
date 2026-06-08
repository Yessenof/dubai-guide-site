# Content Quality & Search Intent Audit
## Phase 6C-99A | Date: 2026-06-08 | AUDIT ONLY — NO CODE CHANGES

---

## 1. Content inventory

| Type | Total | Published | Draft | With RU |
|---|---|---|---|---|
| Guides | 17 | 17 | 0 | 17 |
| Events | 6 | 5 | 1 | 5 (ru_published field exists) |
| News posts | 4 | 3 | 1 | REQUIRES_OWNER_INPUT |
| Calendar pages | 11 | 11 | 0 | 11 |

**Evidence:** CONFIRMED_REPO — DB queries via node/better-sqlite3

Total indexed pages (EN): 17 guides + 5 events + 3 news + 11 calendar = **36 unique content pages**  
Plus hub pages (~10): visas, company-setup, government, banking-tax, tourism, life-setup, find-my-visa, about, contact, guides listing  
Total EN indexed: **~46 pages**

---

## 2. Guide content quality

### Title quality assessment

| Slug | Title | Assessment |
|---|---|---|
| `employment-visa` | "How to Get an Employment Visa in Dubai Without Leaving the UAE" | GOOD — specific query target, visa type named |
| `employment-visa-dubai-outside-uae` | "How to Get an Employment Visa in Dubai from Outside the UAE" | GOOD — differentiates from inside-UAE route |
| `mainland-company-setup-dubai` | "How to Set Up a Mainland Company in Dubai" | GOOD — clear, searchable |
| `free-zone-company-setup-dubai` | "How to Set Up a Free Zone Company in Dubai" | GOOD |
| `golden-visa-dubai-property` | "How to Get a Dubai Golden Visa Through Property (AED 2 Million+)" | GOOD — includes fee signal |
| `child-dependent-visa-dubai-inside-country` | "How to Sponsor a Child Dependent Visa in Dubai from Inside the UAE" | GOOD |
| `spouse-dependent-visa-dubai-inside-country` | "How to Sponsor a Spouse Residence Visa in Dubai Without Leaving" | GOOD |
| `newborn-visa-dubai` | "How to Get a UAE Residence Visa for a Newborn Born in Dubai" | GOOD — specific audience |
| `renew-family-visa-dubai` | "How to Renew a Family Residence Visa in Dubai" | GOOD |
| `open-business-bank-account-dubai` | "Open a Business Bank Account in Dubai for a UAE Company" | GOOD — excludes personal account queries |
| `amer-center-dubai` | "How to Use an Amer Center in Dubai" | MODERATE — could be more specific (which services?) |
| `document-attestation-dubai` | "How to Get a Foreign Document Attested in the UAE" | GOOD |
| `pro-services-dubai` | "How to Use a PRO Service in Dubai" | MODERATE — "PRO service" is known term; could add "for company setup" |
| `tax-residency-certificate-uae` | "Tax Residency Certificate in UAE" | MODERATE — missing "how to get" framing |
| `holiday-home-permit-dubai` | "Holiday Home Permit in Dubai: Register or Renew for Airbnb and Short-Term Rental" | GOOD — specific use case named |
| `child-dependent-visa-dubai-outside-country` | "How to Sponsor a Child Dependent Visa in Dubai from Outside the UAE" | GOOD |
| `spouse-dependent-visa-dubai-outside-country` | "How to Sponsor a Spouse Residence Visa in Dubai from Outside the UAE" | GOOD |

**Overall guide title quality: HIGH.** 14/17 follow the CLAUDE.md content standard. 3 are moderate — not harmful, just opportunities.

### Metadata structure for guides

- **Title field:** `guide.en_title` → `{title} — Guidex Consulting`
- **Description field:** `guide.en_summary` (same field used for card text AND meta description)
- **No dedicated `en_seo_title` or `en_meta_description` columns in `guides` table**

**Evidence:** CONFIRMED_REPO — `PRAGMA table_info(guides)` — columns: `en_title`, `en_summary`, no seo variants

**Risk:** Using `en_summary` as the meta description means the card excerpt text and the SERP snippet are always identical. This is acceptable if summaries are written to CLAUDE.md content standard (1-2 sentences, searchable). It limits the ability to write a different, CTR-optimized SERP snippet vs a concise card summary.

### Content depth

The reference implementation (`employment-visa`) demonstrates the content standard:
- 2 overview paragraphs
- 8+ steps with what/where/address/cost/time/advice
- Audience defined
- All structural fields filled

This standard appears to be applied consistently across guides. **Content depth is a strength for this site vs. thin-content risk.** HYPOTHESIS_SEO — full content review not performed here.

---

## 3. Event content quality

Events have dedicated `en_seo_title` and `en_meta_description` fields — all 5 published events have both filled.

| Slug | SEO title | SEO title quality |
|---|---|---|
| `uae-eid-al-adha-2026` | "Eid Al Adha 2026 UAE: Confirmed Dates and Federal Holiday Guide" | GOOD |
| `dubai-design-week-2026` | "Dubai Design Week 2026 \| 3-8 November, Dubai Design District" | GOOD — dates + venue inline |
| `big-5-global-dubai-2026` | "Big 5 Global 2026 Dubai \| 23-26 November, Dubai World Trade Centre" | GOOD |
| `gitex-global-2026` | "GITEX Global 2026: Dates, Venue and Planning Guide \| Expo City Dubai" | GOOD |
| `formula-1-abu-dhabi-grand-prix-2026` | "Formula 1 Abu Dhabi Grand Prix 2026: Dates, Concerts and Planning Guide" | GOOD |

**Event content quality: HIGH.** SEO titles are specific, include dates and venues.

**But content is not in sitemap and has no structured data** — quality is irrelevant until discoverability issues are fixed.

---

## 4. News content quality

| Slug | Title | Status |
|---|---|---|
| `uae-emiratisation-june-30-2026-deadline` | "MoHRE Confirms 30 June 2026 Emiratisation Deadline for Private Sector" | Published, good title |
| `uae-e-invoicing-2026-asp-deadline-update` | "UAE e-invoicing 2026: MoF extends ASP deadline to 30 October" | Published, includes updated date |
| `uae-eid-al-adha-2026-federal-holiday-long-break` | "UAE Eid Al Adha 2026: Federal Holiday Confirmed for 25–29 May" | Published |

News pages are clearly time-sensitive and regulatory. Good for "UAE [topic] 2026" query clusters.

**Gap:** No `datePublished` metadata is visible in HTML for news pages (only in DB as `date_published`). This affects Google's ability to identify the freshness of the news content and potentially qualify it for "Top Stories" or news-type featured snippets. The field exists in DB — it just needs to be in the schema output.

---

## 5. Calendar content quality

Calendar pages are month-level aggregations: "November 2026 Dubai Calendar — Key Dates, Events, Deadlines".  
These serve a different intent than guide pages: planning/reference rather than procedural.

**Strengths:**
- Month-level pages with structured date items (holidays, events, deadlines in one view)
- Content is genuinely useful for users planning trips, renewals, compliance

**Gaps:**
- Calendar pages not outputting `ItemList` or `Event` schema (structured date items exist in `dates_json` but are only rendered as HTML)
- No cross-link from calendar pages to guide pages for relevant procedures (partially addressed in Phase 6C-98A with "View event guide →" links, but only for events that have event pages)

---

## 6. Hub page content quality

Hub pages (/visas, /company-setup, /government, /banking-tax, /tourism, /life-setup) are:
- Indexable (not noindex)
- In the sitemap
- Each links to 2-4 guides in its category

**Risk:** Hub pages may be considered thin if they only list guide cards without substantive content. A hub page with 200–400 words of introductory content ("Company setup in Dubai requires...") would:
1. Give Google more signals for the hub's ranking topic
2. Provide answer-engine content for broad queries
3. Justify indexing hub pages alongside detail pages

**Evidence:** REQUIRES_OWNER_INPUT — content depth of hub pages not read in this audit.

---

## 7. Content gap analysis

High-traffic Dubai procedural queries with no current page:

| Query cluster | Search intent | Opportunity |
|---|---|---|
| "Dubai visa status check" | Tool/task | Government link guide |
| "UAE work permit types" | Informational | Guide: types of work permits in UAE |
| "Ejari registration Dubai" | Procedural | Guide: how to register Ejari |
| "UAE driving licence" | Procedural | Guide: convert driving licence in Dubai |
| "Dubai company formation cost" | Commercial | Guide with cost breakdown table |
| "UAE tourist visa 2026" | Informational | Guide: tourist visa types and how to apply |
| "Dubai healthcare system expats" | Informational | Guide: how healthcare works for expats |
| "ICA smart services" | Procedural | Guide: what ICA Smart Services offers |
| "GDRFA Dubai" | Navigational/procedural | Guide: what GDRFA handles |
| "UAE corporate tax registration" | Procedural | Guide: how to register for corporate tax |

**Note:** The site has strong coverage for employment visa, company setup, family visas, and golden visa. The next tier of high-value procedural content (Ejari, driving licence, healthcare, corporate tax) is absent.

**Evidence:** HYPOTHESIS_SEO — keyword volume not confirmed without GSC/keyword tool data.

---

## 8. Summary

**Content quality strengths:**
- Guide titles follow SEO best practice — specific, action-oriented, searchable
- Event titles include dates and venues inline — snippet-ready
- Step-by-step guide structure is well-suited for HowTo schema and AI parsing
- Bilingual (EN + RU) — all 17 guides have full RU translations

**Content quality gaps:**
- 36 unique content pages is a thin site overall — Google needs signal that the site is an authority on Dubai procedures
- No dedicated `en_seo_title` / `en_meta_description` on guides (summary doubles as meta description)
- No visible `datePublished` in HTML for any page (news pages especially need this)
- Hub pages may be thin — REQUIRES_OWNER_INPUT
- No content for large procedural categories: Ejari, driving licence, healthcare, tourist visa

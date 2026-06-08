# Schema Implementation Notes — Phase 6C-99B
## Date: 2026-06-08 | AUDIT-ONLY — NO CODE CHANGES IN THIS FILE

---

## 1. Organization schema

**Component:** `components/OrgSchema.tsx`  
**Present before this phase:** YES — already in both EN and RU layouts  
**Change in this phase:** Renamed variable from `schema` → `orgSchema` for clarity; no field changes

### Fields used

| Field | Value | Source |
|---|---|---|
| `@type` | `Organization` | Static |
| `name` | `Guidex Consulting` | Brand name |
| `url` | `NEXT_PUBLIC_SITE_URL` (falls back to `https://guidex-consulting.ae`) | Env var |
| `logo` | `${BASE}/brand/logo-header.png` | File at `public/brand/logo-header.png` (verified exists) |
| `contactPoint.@type` | `ContactPoint` | Static |
| `contactPoint.contactType` | `customer support` | Static |
| `contactPoint.url` | `https://wa.me/971506304817` | WhatsApp business link |

### Fields intentionally omitted

| Field | Reason |
|---|---|
| `sameAs` | No verified social profiles in repo/config |
| `foundingDate` | Not in repo/config |
| `address` | No structured address in repo/config |
| `areaServed` | Not in repo/config |
| `email` | Not in repo/config |
| `telephone` | Not in repo/config (WhatsApp is the contact channel) |
| `numberOfEmployees` | Not applicable |

---

## 2. WebSite schema

**Component:** `components/OrgSchema.tsx` (added in this phase)

### Fields used

| Field | Value | Source |
|---|---|---|
| `@type` | `WebSite` | Static |
| `name` | `Guidex Consulting` | Brand name |
| `url` | `NEXT_PUBLIC_SITE_URL` | Env var |

### Fields intentionally omitted

| Field | Reason |
|---|---|
| `potentialAction` (SearchAction) | No working site search URL pattern exists on the site. The `find-my-visa` page is a guided flow, not a standard search endpoint. |
| `description` | Not required for valid schema |
| `inLanguage` | Would need to list both `en` and `ru` — not a critical field |

---

## 3. Event schema

**Pages:** `app/(en)/(public)/events/[slug]/page.tsx` and `app/ru/events/[slug]/page.tsx`  
**Gate:** `event.schemaEligible === 1` (uses the `schema_eligible` DB column)

### Fields used

| Field | Source | Notes |
|---|---|---|
| `@type` | `Event` | Static |
| `name` | `event.seoTitle || event.title` | Uses SEO title for better query alignment |
| `description` | `event.metaDescription || event.summary` | Meta description preferred |
| `startDate` | `event.eventDateStart` | ISO 8601 date from DB |
| `endDate` | `event.eventDateEnd` | Only included when non-empty AND different from `startDate` |
| `eventStatus` | `https://schema.org/EventScheduled` | Static — all published events are considered scheduled |
| `url` | Canonical URL of the page | EN: `/events/${slug}`, RU: `/ru/events/${slug}` |

### Fields intentionally omitted

| Field | Reason |
|---|---|
| `location` | No structured `venue_name` or `venue_address` column in `events` table. Location is mentioned in body text but cannot be reliably extracted programmatically without a dedicated DB field. **Do not add as a follow-up without a DB venue field.** See Note 1 below. |
| `eventAttendanceMode` | Omitted because `location` is omitted. Per phase instructions: "Use eventAttendanceMode only if location is present." |
| `organizer` | Not in DB |
| `performer` | Not in DB |
| `offers` | Not in DB — do not invent ticket prices or registration links |
| `image` | No stable image URL field in events table |

### Note 1 — Location preservation

The phase instructions specifically require:
- For GITEX Global 2026: preserve "Expo City Dubai / Dubai Exhibition Centre" — this is in the description field and is correctly reflected there.
- For F1 Abu Dhabi GP 2026: preserve "Yas Marina Circuit / Abu Dhabi" — this is in the description field and is correctly reflected there. The `url` points to the canonical event page, not a Dubai URL.

Since `location` is omitted from schema, no Dubai/Abu Dhabi mislabeling risk exists in the current schema output.

### Events with schema output

| Slug | schema_eligible | JSON-LD output |
|---|---|---|
| `uae-eid-al-adha-2026` | 1 | YES — startDate 2026-05-25, endDate 2026-05-29 |
| `dubai-design-week-2026` | 1 | YES — startDate 2026-11-03, endDate 2026-11-08 |
| `big-5-global-dubai-2026` | 1 | YES — startDate 2026-11-23, endDate 2026-11-26 |
| `gitex-global-2026` | 1 | YES — startDate 2026-12-07, endDate 2026-12-11 |
| `formula-1-abu-dhabi-grand-prix-2026` | 1 | YES — startDate 2026-12-03, endDate 2026-12-06 |

No events were skipped from schema. All 5 published events have `schema_eligible = 1`.

---

## 4. NewsArticle schema

**Pages:** `app/(en)/(public)/news/[slug]/page.tsx` and `app/ru/news/[slug]/page.tsx`  
**Gate:** `post.noindex !== 1` (only output schema for indexable posts)

### Fields used

| Field | Source | Notes |
|---|---|---|
| `@type` | `NewsArticle` | Static |
| `headline` | `post.seoTitle || post.title` | Uses SEO title preferred |
| `description` | `post.metaDescription || post.summary` | Meta description preferred |
| `datePublished` | `post.datePublished` | Only included when non-empty (all 3 current posts have it) |
| `dateModified` | `post.dateUpdated` | Only included when non-empty AND different from `datePublished` |
| `mainEntityOfPage` | `{ "@type": "WebPage", "@id": canonical URL }` | Standard pattern |
| `publisher` | `{ "@type": "Organization", "name": "Guidex Consulting", "url": BASE }` | Matches OrgSchema |

### Fields intentionally omitted

| Field | Reason |
|---|---|
| `author` | Not in DB. Do not invent. |
| `image` | No stable public image URLs in `news_posts` table (`image_path` = NULL for all 3 published posts) |
| `articleSection` | Not critical; could be derived from `category` in future |
| `keywords` | Not in DB |

### News posts with schema output

| Slug | noindex | JSON-LD output |
|---|---|---|
| `uae-e-invoicing-2026-asp-deadline-update` | 0 | YES |
| `uae-eid-al-adha-2026-federal-holiday-long-break` | 0 | YES |
| `uae-emiratisation-june-30-2026-deadline` | 0 | YES |

---

## 5. Known gaps and future improvements

| Gap | Priority | Notes |
|---|---|---|
| Event `location` field | HIGH | Add `venue_name` + `venue_address` columns to `events` table, then add to Event schema. Currently blocked by "no schema changes" constraint. |
| HowTo schema on guides | HIGH | Phase 6C-99C — requires guide step data. Steps are in `steps` table with `en_title`, `en_what`, `cost`, `time`. |
| FAQPage on hub pages | MEDIUM | `/life-setup`, `/find-my-visa` have FAQ-style content. |
| NewsArticle `image` | LOW | Add stable image URLs to news posts. |
| NewsArticle `author` | LOW | If author attribution is added to the editorial workflow. |
| `datePublished` in guide pages | LOW | Guides have `created_at` in DB but it's not exposed in rendered HTML or schema. |

---

## 6. Validation notes

All JSON-LD validated structurally by `JSON.parse()` during QA (Python parsing of live HTML). No parse errors.

Google Rich Results Test (https://search.google.com/test/rich-results) not run during this phase — requires live deployment. Recommend running after Phase 6C-99B is deployed.

**Potential validator warnings (known):**
- Event schema missing `location` — not an error, but Rich Results may not show full event card
- NewsArticle missing `image` — required by Google for enhanced NewsArticle appearance; post image upload is a future step

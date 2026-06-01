# November 2026 — Detail Page Recovery Plan

**Phase:** 6C-94A
**Date:** 2026-06-01
**Background:** Phase 6C-93A found only 1 of 31 live calendar items has an internal Guidex `detail_url`. November 2026 should fix this pattern for at least 2 of its key events.

---

## Priority 1 — Dubai Design Week 2026 detail page

**Should it have a Guidex detail page?** YES — highest priority for November.

**Why:**
- High search intent: "Dubai Design Week 2026", "DDW 2026", "Downtown Design Dubai 2026"
- Direct audience match: interior designers, property developers, premium lifestyle readers, expat professionals
- Currently no Guidex content about this event — blank SEO opportunity
- AI/RAG: Guidex could become a cited source for "what is Dubai Design Week" for UAE-based searchers

**Type:** Events brief (calendar detail page at `/events/dubai-design-week-2026`)

**Required sections:**

| Section | Content |
|---------|---------|
| Quick answer (hero) | What is Dubai Design Week, when, where — 2 sentences |
| Key dates table | Nov 3-8 overall / Downtown Design Nov 4-8 (inferred) |
| Who it is for | Interior designers, architects, property developers, premium brand buyers, curious public |
| Why it matters | Largest regional design and creative festival; annually sets design trends for Dubai market |
| Location | Dubai Design District (d3), Dubai — with d3 address context |
| Programme overview | DDW + Downtown Design + Installations + Workshops + Talks + Marketplace |
| Source note | Official: dubaidesignweek.ae — last verified June 2026 |
| Related Guidex topics | Holiday home permit guide (short-term rental operators), mainland company setup (design studios) |
| Open calendar backlink | "See the full November 2026 Dubai calendar" |
| CTA | Official website → dubaidesignweek.ae |

**EN slug:** `/events/dubai-design-week-2026`
**RU slug:** `/ru/events/dubai-design-week-2026`

**Internal linking plan:**
- From `/calendar/november-2026-dubai-calendar` → this page (detail_url on DDW item)
- From `/calendar/november-2026-dubai-calendar` → this page (Downtown Design item shares same detail_url)
- From `/guides/holiday-home-permit-dubai` → sidebar mention of DDW (design/decor visitors)
- From `/guides/mainland-company-setup-dubai` → mention for design/architecture firms

**Status:** Draft sections in this document. Full draft → Phase 6C-94B.

---

## Priority 2 — Big 5 Global 2026 detail page

**Should it have a Guidex detail page?** YES — strong business/property audience.

**Why:**
- "Big 5 Global Dubai 2026" has clear search demand from construction, real estate, fit-out professionals
- Direct Guidex audience: company setup for construction/fit-out firms, property investors
- Currently zero Guidex content on this event
- 4-day DWTC event — major calendar anchor for late November

**Type:** Events brief (calendar detail page at `/events/big-5-global-dubai-2026`)

**Required sections:**

| Section | Content |
|---------|---------|
| Quick answer (hero) | What is Big 5 Global, when, where, who attends — 2 sentences |
| Key dates table | Nov 23-26, DWTC |
| Who it is for | Construction companies, real estate developers, interior fit-out firms, architects, facility management, smart building suppliers |
| Why it matters | Middle East's largest construction trade show; sourcing, networking, contracts |
| Location | Dubai World Trade Centre, full complex detail |
| Industries covered | Building, construction, facility management, fit-out, HVAC, smart buildings |
| Registration note | Trade only — advance registration on big5events.com |
| Source note | DWTC official: dwtc.com/en/events/the-big-5-2026/ — verified June 2026 |
| Related Guidex topics | Mainland company setup (construction firms), free zone setup, employment visa |
| Open calendar backlink | "See the full November 2026 Dubai calendar" |
| CTA | Official website → big5events.com or dwtc.com event page |

**EN slug:** `/events/big-5-global-dubai-2026`
**RU slug:** `/ru/events/big-5-global-dubai-2026`

**Internal linking plan:**
- From `/calendar/november-2026-dubai-calendar` → this page
- From `/guides/mainland-company-setup-dubai` → Big 5 mention (trade visitors)
- From `/guides/free-zone-company-setup-dubai` → Big 5 mention (manufacturing/construction)

**Status:** Draft sections in this document. Full draft → Phase 6C-94B.

---

## Priority 3 — ADIPEC 2026

**Should it have a Guidex detail page?** NO for now — calendar item only.

**Why not:**
- Abu Dhabi event — not core Guidex geography (Dubai focus)
- External CTA to adipec.com is the natural action
- Limited internal linking potential
- Consider a future UAE energy sector company setup guide that could reference ADIPEC

**Calendar item only:** External CTA → adipec.com

---

## Priority 4 — Downtown Design Dubai 2026

**Should it have a Guidex detail page?** NO — shares detail page with DDW.

Downtown Design is a programme component of Dubai Design Week. Both calendar items use the same `detail_url = /events/dubai-design-week-2026`. The DDW detail page mentions Downtown Design explicitly.

---

## Page structure template (events detail pages)

For Dubai Design Week and Big 5:

```
/events/[slug]
  <title>       — SEO title with event name + year + Dubai
  <h1>          — Event name + dates + "Dubai"
  
  Quick answer  — 2 sentences: what, when, where
  
  Key details   — Table: Dates / Venue / Organizer / Who it's for / Access
  
  Overview      — 2 paragraphs: what the event is, who attends, why it matters
  
  Programme     — Bullet list of main components (if applicable)
  
  Location      — Where exactly, how to get there (d3 is accessible by Metro)
  
  Register      — Where to register (external CTA)
  
  Source note   — Official source URL + verification date
  
  Related       — 2-3 Guidex guides or calendar links
  
  Calendar link — "See the full November 2026 Dubai calendar →"
```

---

## Calendar items that should link to existing Guidex guides

| Calendar item | Existing guide | Link direction |
|--------------|----------------|----------------|
| Big 5 (construction) | mainland-company-setup-dubai | Calendar detail → guide (sidebar) |
| Big 5 (construction) | free-zone-company-setup-dubai | Calendar detail → guide (sidebar) |
| DDW (interior/property) | holiday-home-permit-dubai | Calendar detail → guide |
| DDW (design studios) | mainland-company-setup-dubai | Calendar detail → guide |
| ADIPEC (energy firms) | No current guide | Future: UAE energy company setup |

---

## Detail pages NOT to build in November (calendar-only items)

| Item | Reason |
|------|--------|
| ADIPEC | Abu Dhabi — not core geography. External CTA only. |
| Downtown Design | Subsumed into DDW detail page |
| DFC (if resolved) | YES — warrants its own events page (citywide 30-day campaign) |

---

## Next phase: 6C-94B

Phase 6C-94B should produce:
1. Full draft for `/events/dubai-design-week-2026` (EN + RU)
2. Full draft for `/events/big-5-global-dubai-2026` (EN + RU)
3. These drafts feed into the November calendar import so `detail_url` values are live before or simultaneously with the calendar page

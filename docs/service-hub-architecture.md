# Service Hub Architecture

Version: 1.0 — April 2026
Status: Planning. No implementation yet.

---

## What Is a Service Hub Page?

A hub page is the entry point for a topic cluster.
It does not replace the deep guide pages.
It organizes and routes users to the right guide or tool.

Hub pages are conversion + navigation layers, not content articles.
They are shorter than guides. They do not repeat step content.
Their SEO value comes from being well-structured, internally linked, and topically authoritative.

---

## Hub Page URL Pattern

```
/visas                    ← top-level visa hub
/visas/family             ← family visa sub-hub
/visas/golden             ← golden visa sub-hub
/visas/employment         ← employment visa sub-hub
/visas/property           ← property visa sub-hub
/company                  ← company setup hub (future)
/living                   ← living in Dubai hub (future)
```

---

## Hub Page Structure (Standard Pattern)

Every hub page follows this exact section order:

### Section 1: Hero / Promise Block
- `h1`: Clear topic statement — not clever, not vague
  - Example: "Family Visa Dubai — All Routes Explained"
- One-sentence subhead: what this hub covers, who it's for
- Single primary CTA: "Find My Route" → links to calculator or route card below
- Visual: Minimal — brass overline + clean white background (consistent with guide pages)

### Section 2: Quick Decision Cards ("I need to...")
- 3–5 cards, each representing the most common user intent
- Each card:
  - Short label: "Sponsor my spouse"
  - One-line context: "Both inside and outside UAE routes"
  - Arrow link → relevant group guide or individual guide
- Layout: 2-column grid on desktop, 1-column stack on mobile
- No icons unless CategoryIcon system is extended
- This section answers "what are my options?" without requiring scroll

### Section 3: Route Cards (Full Overview)
- Each route shown as a card with:
  - Route title
  - Key eligibility fact (e.g., "Spouse must be outside UAE")
  - Fee range (e.g., "AED 1,800 – 2,200")
  - Timeline (e.g., "3–6 weeks")
  - "Full guide →" link
- Cards are pulled from the guide DB — not hardcoded
- Fees and timelines come from the `price` and `timeline` fields of each guide
- No card without a real published guide behind it

### Section 4: Short Roadmap Block
- 3–5 bullet summary of the general process sequence
- NOT a replacement for the full guide steps
- Purpose: orient the user, reduce anxiety, not substitute the guide
- Example:
  1. Gather documents (attestation if needed)
  2. Open family file at Amer
  3. Apply for entry permit
  4. Medical test (if required)
  5. Emirates ID + residence stamping
- Plain bullet list — no step numbers rendered as full StepCard components

### Section 5: Calculator CTA (when calculator exists)
- Appears after the roadmap block
- Simple block: "Not sure which route applies to you?"
- CTA button: "Use the Route Finder →"
- Links to `/find-my-visa`
- If calculator not built yet: omit this section (do not show broken or placeholder)

### Section 6: Full Guide Links
- Explicit links to all individual guides in this topic cluster
- Shown as a simple list or small card grid
- Label each with guide title + one-line description
- Marked as "Full Step-by-Step Guide" to distinguish from hub summary content
- Each link must go to a published guide — no links to draft guides

### Section 7: WhatsApp / Contact CTA
- Consistent with the navy CTA card used at the bottom of guide pages
- Text: Short, action-oriented — not "we're here to help" filler
- WhatsApp link: `https://wa.me/[owner-number]` when business WhatsApp is ready
- Until WhatsApp is ready: link to `/contact`

### Section 8: Trust / Accuracy Signal
- 1–2 short lines: "Fees based on official DLD/GDRFA sources. Last verified: [month year]."
- No fake badges or stars
- Last-updated date drawn from the most recently updated guide in the cluster

### Section 9: Related Hubs
- 2–3 links to adjacent topic hubs
- Example on family visa hub: link to Golden Visa hub, Employment Visa hub
- Simple inline links, not a full card grid

---

## What Hub Pages Do NOT Contain

- Full step cards (those belong in `/guides/[slug]`)
- Pricing tables trying to be comprehensive (give ranges, not tables)
- Competitor comparisons
- Long marketing copy
- Videos (unless clearly marked as optional future enhancement)
- Blog-style content
- FAQ sections (those belong in individual guides as advice/warning fields)

---

## Hub Page Tech Requirements

- Server component (no client interactivity needed)
- Static or ISR — revalidate when any child guide changes
- Data source: `lib/db/reader.ts` — query published guides by category
- No new DB schema needed
- Metadata: title = `{hub topic} Dubai — Full Guide`, description = one-sentence hub summary
- Canonical: hub URL is canonical (guides are canonical for their own URLs)

---

## Hub Page Component Breakdown

```
HubPage (server component)
  ├── HubHero
  │     └── h1, subhead, primary CTA
  ├── QuickDecisionCards
  │     └── 3–5 static cards (hardcoded per hub or driven by GUIDE_GROUPS)
  ├── RouteCards
  │     └── Pulled from DB: published guides matching hub category
  ├── RoadmapBlock
  │     └── Static 3–5 step bullet list (no StepCard component)
  ├── CalculatorCTA (optional — only when calculator exists)
  ├── GuideLinks
  │     └── List of full guide links in this cluster
  ├── ContactCTACard (same as guide page navy card)
  ├── TrustSignal
  └── RelatedHubs
```

---

## First Hub to Build

**`/visas/family`** — Family Visa Hub

Reason: We have the most content depth here already (4 draft guides: spouse + child, inside + outside).
Once those 4 guides are published, this hub page has real route cards to link to.

Do not build the family visa hub until at least 2 family guides are published.
Do not build any hub until it has at least 2 linked published guides to show.

---

## Build Order for Hubs

1. `/visas/family` — after spouse and child guides are published
2. `/visas/golden` — after golden visa property guide is published + at least 1 more golden visa route
3. `/visas/employment` — after employment-outside guide is written
4. `/visas` (top-level) — after at least 3 sub-hubs exist
5. `/company`, `/living` — Phase 3/4 content expansion

# Tech Stack — Dubai Guide

## Chosen Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | Latest stable |
| Language | TypeScript | Latest stable |
| Styling | Tailwind CSS | v3 |
| Content | MDX (Markdown + JSX) | via next-mdx-remote or @next/mdx |
| Code hosting | GitHub | — |
| Server hosting | Cloudways | Managed server, connected to GitHub |

---

## Why This Stack Fits the Project

**Next.js**
Static Site Generation (SSG) means every guide page is pre-rendered as plain HTML. This gives the site near-instant load times, excellent SEO out of the box, and full compatibility with Google, AI crawlers, and social preview cards — all without a backend. The App Router enables a clean, file-based page structure that maps naturally to the site's content hierarchy.

**TypeScript**
Catches errors at write time rather than at runtime. For a content-driven site with structured data (guide metadata, step cards), TypeScript ensures that every article object conforms to the expected shape. This makes the codebase easy to maintain even after months away from it.

**Tailwind CSS**
Utility-first styling keeps the CSS footprint small and eliminates unused styles at build time. It enforces consistent spacing, typography, and color usage without requiring a separate design system. Mobile-first responsive utilities (`sm:`, `md:`, `lg:`) make it natural to build the phone layout first and scale up.

**MDX**
Markdown handles 90% of article content (headings, paragraphs, lists). The JSX escape hatch in MDX allows structured components — like step cards — to be embedded directly in the content file when needed. This keeps articles human-readable and editable in any text editor, with no CMS login required.

**GitHub + Cloudways**
Code is stored in the GitHub repository. Cloudways provides the managed server environment and is connected to GitHub for deployment. Pushing to `main` triggers a build and deploy on Cloudways. No manual file transfers, no FTP — the GitHub repo is the single source of truth for all code and content.

---

## What We Are Intentionally NOT Using in Version 1

| Excluded | Reason |
|---|---|
| Database (Postgres, Supabase, etc.) | All content is static files — no dynamic data at launch |
| CMS (Contentful, Sanity, Strapi) | Adds complexity and cost for content that changes rarely |
| GraphQL / REST API | No user accounts, no dynamic queries — not needed |
| Authentication | No login-protected content in v1 |
| State management (Redux, Zustand) | No complex client state — React's built-in state is sufficient |
| CSS-in-JS (Styled Components, Emotion) | Adds runtime overhead; Tailwind handles all styling needs |
| Heavy UI libraries (MUI, Chakra) | Design is custom and minimal — a component library would add bloat |
| Internationalization (i18n) | English-only in v1; can be added later if needed |

---

## How Articles Are Stored and Updated

Each guide is a single `.mdx` file stored in the `content/guides/` directory.

```
content/
  guides/
    mainland-llc-setup.mdx
    employment-visa.mdx
    emirates-id.mdx
    golden-visa.mdx
    ...
```

**Frontmatter** at the top of each file holds the article metadata:

```yaml
---
title: "How to Set Up a Mainland LLC in Dubai"
summary: "A step-by-step guide to registering a mainland limited liability company in Dubai."
price: "AED 15,000 – 25,000"
timeline: "2–4 weeks"
audience: "Founders setting up a trading or services business in Dubai"
category: "company-setup"
lastUpdated: "2025-04-01"
---
```

The article body contains the process overview and step cards in MDX.

**To update a guide:** edit the relevant `.mdx` file, commit to `main`, and Cloudways redeploys automatically via the GitHub connection. No CMS dashboard, no database migration, no API calls.

---

## How the Site Can Scale Later

The stack is intentionally chosen so that adding complexity is straightforward when genuinely needed — not before.

| Future need | How to add it |
|---|---|
| More guides | Add new `.mdx` files — no code changes required |
| Arabic language support | Add `next-intl` for i18n routing; translate content files |
| Search | Add Algolia DocSearch or a local Flexsearch index built at compile time |
| CMS for non-technical editors | Migrate MDX files into Sanity or Contentful; keep the same data shape |
| User accounts / saved guides | Add NextAuth.js + a database (Supabase or PlanetScale) |
| Newsletter or lead capture | Add a form endpoint (Resend, Loops, or a simple API route) |
| Analytics | Plausible or similar — one script tag to add |

Each of these is a contained addition. Nothing in the v1 stack blocks or complicates any of them.

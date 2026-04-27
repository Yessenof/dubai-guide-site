# Anti-Copy Friction Plan

Version: 1.0 — April 2026

This document covers practical measures to make the site harder to casually copy or scrape.
The goal is friction, not impossibility.
A determined competitor with resources will always be able to copy a website.
The goal is to make casual copying expensive enough that low-effort competitors give up.

---

## Threat Model

Who is likely to try to copy this site?

1. **Cheap service providers** who want a professional-looking website quickly
2. **Content scrapers** who republish Dubai procedure content on thin affiliate sites
3. **Copycat startups** who take the calculator/UX logic and rebrand
4. **AI content farms** that scrape and rephrase at scale

What they typically do:
- Copy-paste text from pages
- Screenshot UI and rebuild in a template
- Use tools like HTTrack or wget to mirror a site
- Use GPT to rephrase scraped content
- Copy fee tables and pass them off as verified data

---

## What Is Worth Doing

### 1. Design System Uniqueness

**Current navy (#1B2E4B) + brass (#B5935A) system is already distinctive.**

Make it more specific:
- Use precise Tailwind custom tokens everywhere — no generic blue/gray
- Apply brass accents in compound ways (border + background + text combos) that are non-obvious
- Use the CategoryIcon SVG system — 14px inline SVGs with specific stroke widths
- The visual system should require effort to replicate in Tailwind — not just "change the colors"

**Why this works:** Template-copy sites default to Bootstrap or basic Tailwind defaults. A highly specific custom token system cannot be cloned by swapping a theme.

**What not to do:** Obfuscate CSS class names (Tailwind JIT won't help here, and it harms dev experience).

---

### 2. Calculator / Route Finder Logic — Keep Server-Side

**Rule:** The route-finder config and resolution logic must never be exposed as a public REST endpoint.

**Implementation:**
- `lib/route-finder-config.ts` is server-only
- Calculator results are rendered server-side (SSR) — not via a client-fetched API
- No `/api/calculator` endpoint
- No `/api/routes` JSON feed
- Fee data is embedded in the server render, not fetched separately by the browser

**Why this works:** Competitors cannot scrape the branching logic or fee formulas because they are never sent to the browser as structured data. They would need to reverse-engineer the question flow manually.

**What not to do:** Build a `/api/recommend-visa` endpoint for the calculator — this would expose the entire decision tree as a public JSON API.

---

### 3. Component Logic Complexity

Write the calculator, GuideTabs, and route-finder components so they are:
- Config-driven from a single, non-obvious config file
- Using custom TypeScript types that are non-trivial to reproduce
- Internally structured so that extracting any one piece requires understanding the whole

**Why this works:** A developer copying a single component from DevTools will get the rendered HTML but not the config, state management, or data source. Reconstructing it requires starting from scratch.

**What not to do:** Obfuscate variable names or minify intentionally — this harms your own dev experience and does not stop a determined competitor.

---

### 4. Content Differentiation — Accuracy as the Moat

The hardest thing to copy is accurate, verified, up-to-date information.

**Rules:**
- Every guide cites or reflects an official source
- Fee data should be verifiable against GDRFA, DLD, ICA official pages
- Add `lastUpdated` date to all guides and make it visible
- Content writing standard (no AI verbosity, specific numbers, cautious wording where unverified) creates a distinctive voice

**Why this works:** Content farms and copycats rephrase text but do not verify it. Over time, our guides stay accurate and competitors' copied versions become stale and incorrect. Google signals this through bounce rate and CTR.

**What not to do:** Chase word count or keyword density. Thin, padded content is easy to replicate at scale.

---

### 5. PDF / Export Layer (Future)

When the calculator PDF feature is built:

**Rules:**
- Generated server-side (not client-side jsPDF)
- Include a watermark with site URL and generation date
- File metadata includes site URL
- PDF content is not a simple copy of the web page — include a unique structure
- Rate-limit PDF generation by IP (via server middleware)

**Why this works:** Downloaded PDFs carry identity. Users sharing PDFs spread the brand. Watermarked content is harder to strip and republish.

---

### 6. Scraping Friction

**Implement (when traffic justifies):**
- Rate limiting on guide pages via Next.js middleware or Cloudways config (e.g., max 60 req/min per IP)
- User-agent blocking for known scraper bots in `proxy.ts` or nginx config
- Honeypot links: invisible to users, visible to scrapers — triggers flagging (server-side only, do not expose logic)

**Do NOT implement:**
- CAPTCHAs on public content pages (harms SEO and UX)
- JavaScript obfuscation (slows page, no real protection)
- Login walls for public guides (destroys SEO entirely)
- Image-only content (anti-accessibility, anti-SEO)

---

### 7. Public Asset Exposure

**Images (when added):**
- Compress and watermark any proprietary infographics
- Do not serve large original-resolution images
- Use Next.js `<Image>` optimization — this serves resized, reformatted versions, not the originals
- Do not put high-value visual assets in `/public/` without subdirectory that is not obvious to guess

**SVG icons:**
- CategoryIcon SVGs are inline (not files in /public) — already correct
- Inline SVGs cannot be directly hot-linked; they must be extracted from HTML

**Database:**
- `data/guides.db` is not committed to git — correct ✓
- Never expose DB file paths in error messages or API responses

---

### 8. Domain and Brand Protection

**Practical measures:**
- Register common typo domains (dubaigiude.com, dubaiiguide.com, etc.) when budget allows
- Use consistent brand name across all social profiles before launch
- Register `dubaiuide.com` alternatives in `.ae`, `.co`, `.io` if relevant

**Not worth doing:**
- Trademark registration in Phase 1 — too early
- DMCA automation — adds no value before you have real content worth protecting

---

### 9. Code Structure as Friction

The codebase structure itself creates friction for copycats:

- Custom Drizzle schema with bilingual flat columns — not obvious to reconstruct
- Server Actions pattern with intent-based form submission — not a standard template
- GuideTabs group page pattern with GUIDE_GROUPS config — needs to be understood before it can be copied
- Memory guard hook system — signals a mature, well-maintained codebase

**Why this works:** A copycat who clones the repository faces a non-trivial custom stack. Rebuilding it requires understanding, not just changing colors.

---

## What Is NOT Worth Doing

| Measure | Why it's not worth it |
|---|---|
| CSS class name obfuscation | Harms your own dev experience; minified names can be decoded |
| JavaScript bundle encryption | Does not exist in any real sense for web apps |
| "View source disabled" | Not possible in browsers |
| Canvas-rendered text | Anti-accessibility, anti-SEO, anti-mobile |
| Removing `Last updated` dates | Loses freshness signal; does not prevent copying |
| Hiding fees from page | Destroys your SEO advantage over FamilyVisa.ae |
| Server-side rendering ALL pages with no caching | Slows site significantly for no copy protection gain |
| Requiring email to read guides | Destroys SEO entirely |

---

## Summary: Prioritized Anti-Copy Measures

| Measure | Phase | Effort | Real Impact |
|---|---|---|---|
| Calculator logic server-only (no public API) | Phase 2 | Low (by default) | High |
| Accurate, verified content | Ongoing | High | Very high (moat) |
| PDF watermark + server-gen | Phase 3 | Medium | Medium |
| Rate limiting on guide pages | Phase 4+ | Low | Medium |
| Design system specificity | Phase 1 (now) | Low | Low-Medium |
| Domain typo registration | Pre-launch | Low | Low |
| Honeypot links | Phase 4+ | Low | Low |
| Asset compression + no /public exposure | Phase 2 | Low | Low |

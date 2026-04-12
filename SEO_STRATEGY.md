# SEO Strategy — Dubai Guide Site

---

## Primary Acquisition Goal

**Organic search is the #1 acquisition channel.** Every content and architecture decision must serve this.

Secondary goals:
- AI discoverability — articles should appear in LLM answers (ChatGPT, Perplexity, Claude) when users ask procedural Dubai questions
- Social distribution via WhatsApp and Instagram (amplification only, not primary)

---

## Target Audience

The site targets three overlapping groups:

1. **Expats relocating to Dubai** — visa, housing, driving license, government registration
2. **Entrepreneurs setting up a business** — company formation, freezone vs mainland, bank accounts, hiring
3. **Employers and HR teams** — employment visas, work permits, payroll compliance

All three groups share a behavior: they search for step-by-step procedural information before taking action. They want to understand the process before they pay a consultant. This is the primary search intent the site must satisfy.

---

## Content Structure Goals

Every guide must satisfy this content structure to rank well:

1. **Title** — clear, keyword-rich, matches search intent (e.g. "How to Get an Employment Visa in Dubai")
2. **Summary** — used in meta description and guide cards; 1-2 sentences, action-oriented
3. **Estimated cost and timeline** — immediately visible above the fold; high-value for featured snippets
4. **Who this is for** — narrows the audience, reduces bounce rate
5. **Multi-paragraph overview** — explains the full process in plain language; optimised for AI-readable comprehension
6. **Chronological steps** — structured, scannable; satisfies "how to" search intent; targets rich result snippets

**Critical rule:** Every guide must answer the full question. Thin content that says "contact a consultant" without explaining the process will not rank.

---

## Search Intent Rules

| Guide type | Target intent | Example query |
|---|---|---|
| Visa guides | Informational + procedural | "how to get employment visa dubai" |
| Company setup | Informational + commercial | "how to set up llc dubai" |
| Hiring | Procedural + commercial | "how to sponsor employee visa dubai" |
| Living | Informational | "how to get dubai driving license" |
| Government | Procedural | "how to renew emirates id" |

- Write for the **searcher who wants to understand before they act** — not for someone already mid-process
- Each guide targets one primary keyword cluster
- Don't try to cover every edge case in one guide — create separate guides per distinct procedure

---

## URL Structure (locked — must not change)

```
/guides                           ← guide index
/guides/[slug]                    ← individual guide (EN default)
/ru/guides/[slug]                 ← Russian version (future)
```

- Slugs are set at creation and must not change after publication
- Slugs should be descriptive and keyword-rich: `employment-visa`, `company-setup-llc`, `emirates-id-renewal`
- Do not use numeric IDs in URLs

---

## On-Page SEO Requirements (per guide)

Every published guide must have:

- `<title>` — `{guide.title} — Dubai Guide` (populated from DB, never empty)
- `<meta description>` — `{guide.summary}` (1-2 sentences, under 160 chars)
- `<h1>` — matches title
- Structured `<h2>` headings for Overview and Steps sections
- `lastUpdated` field populated and visible on the page (signals freshness)

Future additions (Phase 7):
- JSON-LD structured data (HowTo schema for step-by-step guides)
- Open Graph image per guide or global default
- `sitemap.xml` generated from published guides

---

## AI Discoverability Rules

LLMs (ChatGPT, Perplexity, Claude, Google AI Overviews) increasingly answer procedural questions by citing web sources. To be cited:

- Content must be **clear, structured, and factually complete** — not vague or consultant-bait
- Use plain `<p>`, `<h2>`, `<ol>/<ul>` HTML — LLMs parse clean HTML better than JavaScript-rendered content
- Include specific numbers: costs in AED, timelines in days/weeks, specific authority names
- Keep sentences short and declarative
- Overview paragraphs should stand alone as a coherent explanation (for snippet extraction)
- Step titles should be imperative verbs: "Submit the application", "Pay the fee", "Collect the Emirates ID"

---

## Internal Linking Strategy (Phase 10+)

- Each guide should link to 1-3 related guides where relevant (e.g. employment visa guide → company setup guide)
- The guide list page (`/guides`) links to all published guides — keep it well-organised
- Future: category index pages (`/guides/visas`, `/guides/company-setup`) as SEO entry points
- Do not force internal links where they don't serve the reader

---

## Bilingual SEO Approach

**English first, always.**

- EN guides are the primary SEO investment
- Russian versions are secondary and will target `ru.dubai-guide.com` or `/ru/` subpath
- RU content should be translated (not machine-translated without review) for quality
- Hreflang tags will be needed when RU routes go live
- EN and RU pages must have independent `<title>` and `<meta description>` in their respective language
- Do not launch RU pages with empty or stub content — empty content is worse than no page

---

## Admin Fields Needed for SEO (Future)

Fields not yet in the DB but needed for full SEO capability:

| Field | Purpose | Priority |
|---|---|---|
| `ogImage` (per guide) | Open Graph image for social sharing | Medium |
| `metaTitle` override | Allow custom `<title>` separate from display title | Low |
| `metaDescription` override | Allow custom meta description | Low |
| `canonicalUrl` | For syndicated or translated content | Low |
| `jsonLd` flag / auto-generate | HowTo schema for step guides | High (Phase 7) |
| `focusKeyword` | Internal SEO reminder for the owner | Low |

Currently the `summary` field doubles as the meta description. This is acceptable until content volume grows.

---

## Content Quality Bar

Before publishing a guide, it must meet these standards:

- [ ] Has a real, complete title that matches the procedure name
- [ ] Summary is under 160 characters and action-oriented
- [ ] Overview explains the full process in plain language (not just "here are the steps")
- [ ] At least 3 steps with real content (not placeholder text)
- [ ] Cost and timeline fields are populated (even if approximate)
- [ ] `lastUpdated` is set to the month/year the content was verified
- [ ] English content is complete before the guide is published

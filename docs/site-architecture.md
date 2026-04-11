# Site Architecture — Dubai Guide

## Purpose

A premium, mobile-first knowledge hub that helps people navigate Dubai's official procedures clearly and confidently. The site covers company setup, visas, hiring, relocation, and key government processes — presented as structured, step-by-step guides that are easy to read and act on.

---

## Target Audience

- Entrepreneurs and founders planning to set up a company in Dubai or the UAE
- Expats relocating to Dubai for work or lifestyle
- HR and operations teams hiring employees in the UAE
- Digital nomads and remote workers exploring visa options
- Anyone dealing with UAE government procedures for the first time

---

## Design Direction

- **Aesthetic:** Apple-inspired — clean, minimal, calm, premium
- **Background:** White (#FFFFFF) with subtle off-white or light grey section separation
- **Typography:** System font stack (San Francisco / -apple-system) or a clean sans-serif like Inter
- **Spacing:** Generous padding, breathing room between elements
- **Color accents:** One primary accent color (e.g. deep blue or slate) used sparingly
- **No visual clutter:** No gradients, no heavy shadows, no decorative elements that don't serve content
- **Mobile-first:** Designed at 390px width first, then scaled to desktop
- **Images:** Minimal — icons and structured text carry the UI, not photography

---

## Recommended Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | SSG/SSR for SEO, fast performance, great DX |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS | Utility-first, consistent spacing, mobile-first |
| Content | MDX files | Lightweight, no CMS needed initially |
| Code hosting | GitHub | Version control, deployment trigger |
| Server hosting | Cloudways | Managed server, connected to GitHub for deployment |
| Analytics | Plausible | Lightweight, privacy-friendly |

No database needed at this stage. All guides are static content files.

---

## Full Page Structure

```
/                        → Homepage
/guides                  → All guides index
/guides/[slug]           → Individual guide article
/about                   → About the site
/contact                 → Contact / help form
/privacy                 → Privacy policy
/terms                   → Terms of use
```

---

## Homepage Section Order

1. **Hero** — One-line headline explaining the site. Short subheading. No CTA overload.
2. **Popular Guides** — 3–4 most-visited or most-useful guides as cards
3. **All Topics** — Category grid linking to topic groups
4. **Recently Updated** — 2–3 guides that were recently added or refreshed
5. **Help / Contact** — Simple prompt: "Have a question? Reach out."

**Mobile UX principle:** The first screen (above the fold) must communicate the site's purpose instantly. Only the Hero and the start of Popular Guides should appear on first load.

---

## Topic / Category Structure

| Category | Slug | Guides included |
|---|---|---|
| Company Setup | /topics/company-setup | Mainland LLC, Free Zone, Offshore, Trade License |
| Visas | /topics/visas | Employment visa, Investor visa, Freelance visa, Golden Visa, Tourist visa extension |
| Hiring | /topics/hiring | WPS, Labour contracts, Quota, Termination |
| Living & Relocation | /topics/living | Emirates ID, Health insurance, Driving license, School enrollment |
| Government Processes | /topics/government | Ejari, DEWA setup, Tenancy contract, Notarization |

---

## Main Navigation Structure

**Mobile (bottom nav or hamburger):**
- Home
- Guides
- Topics
- Contact

**Desktop (top nav):**
- Logo / Site name (left)
- Guides | Topics | About | Contact (right)

Keep navigation minimal. No mega-menus.

---

## Required Utility Pages

| Page | Purpose |
|---|---|
| `/about` | Briefly explain who runs the site and why it exists |
| `/contact` | Simple form or email link for questions |
| `/privacy` | Privacy policy (required for any analytics or forms) |
| `/terms` | Terms of use |

---

## Lead / Contact Flow

- No aggressive lead capture
- Single contact page with a simple form: name, email, message
- Optional: "What are you trying to do?" dropdown to categorize inquiries
- No popups, no newsletter gates, no mandatory sign-ups
- Consider a subtle inline prompt at the bottom of guide articles: "Need help with this? Contact us."

---

## SEO and AI-Readability Principles

- Every guide page has a unique `<title>` and `<meta description>`
- H1 = guide title, H2 = section headings, H3 = step titles
- Clean, semantic HTML — no div soup
- Structured data (JSON-LD) for articles where relevant
- Canonical URLs on all pages
- Sitemap generated at build time (`/sitemap.xml`)
- `robots.txt` allowing all crawlers
- Guide content written in plain, factual language — easy for AI models to parse and summarize
- Avoid JavaScript-only rendering for content — all guide text must be in the HTML source

---

## Mobile-First UX Principles

- Design and test at 390px (iPhone 15 Pro) first
- Touch targets minimum 44×44px
- No horizontal scroll at any breakpoint
- Font size minimum 16px for body text
- Line height 1.6–1.7 for readability on small screens
- Articles scroll vertically as one continuous experience — no pagination, no tabs, no swipe steps
- Sticky header kept minimal (logo + one action) to preserve vertical space
- Avoid modals on mobile — use inline patterns instead
- Forms should be single-column on mobile

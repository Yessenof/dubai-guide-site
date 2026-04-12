# Dubai Guide Site - Project Instructions

## Project Overview
A premium mobile-first Dubai knowledge hub website. This is not a heavy web app. It should feel elegant, minimal, calm, and Apple-inspired.

## Main Goal
Build a lightweight website that helps users understand Dubai procedures:
- Company setup
- Visas
- Hiring
- Living and relocation
- Key government-related processes

## Design Principles
- Mobile-first approach
- Clean white background
- Simple typography
- Premium spacing
- Elegant and readable design
- No visual clutter
- No swipe-based step screens
- Articles must scroll as one beautiful vertical experience
- First screen should show as much useful information as possible without feeling overloaded

## Content Structure
Every guide page should have:
- Title
- Short explanation
- Estimated price
- Estimated timeline
- Short overview of the full process
- Chronological steps

Every step card should support:
- Step number
- What to do
- Where to go
- Address or place type
- Estimated cost
- Estimated time
- Useful advice
- Note or warning

## Technical Principles
- Keep the project lightweight
- Keep components reusable
- Make all article sections editable
- Prioritize mobile readability over desktop complexity
- Structure pages clearly for SEO and AI readability
- Do not overengineer
- Avoid unnecessary APIs unless clearly needed

## Workflow Rules
- Always preserve design consistency
- Always preserve mobile-first layout
- Always preserve the article structure system
- Do not invent random styles
- Do not change the information architecture without approval

## Confirmed Project Decisions
These decisions are locked. Do not deviate from them without explicit approval.

**Architecture**
- The public site must stay lightweight and fast — no unnecessary dependencies
- The admin panel is owner-only, built inside the same Next.js project under `/admin`
- Public pages and admin must stay architecturally separated — admin never weighs down the public site
- Public pages import only from `lib/db/reader.ts` (read-only)
- Admin pages import only from `lib/db/writer.ts` (read/write)
- No heavy CMS on the public site
- Guide data lives in `data/guides.db` — SQLite via `better-sqlite3` + Drizzle ORM
- Full admin architecture is documented in `docs/admin-architecture.md`

**Admin system (planned, not yet built)**
- Auth: NextAuth.js with credentials provider, single owner, password stored as bcrypt hash in env vars
- Storage: SQLite (`data/guides.db`) — single file on disk, no external services
- Admin routes: `/admin/login`, `/admin/guides`, `/admin/guides/new`, `/admin/guides/[slug]`
- Every guide field and every step field must be editable from the admin
- Steps must be addable, deletable, and reorderable
- Publish/unpublish per guide
- On-demand ISR revalidation triggered by admin after save

**Migration plan (planned)**
- Current MDX + metadata.ts system will be migrated to SQLite
- Step 1: install better-sqlite3, drizzle-orm, drizzle-kit; create schema + connection
- Step 2: run drizzle-kit migrate to create data/guides.db; seed with current guide data
- Step 3: write lib/db/reader.ts; update public guide page to render from DB
- Step 4: retire MDX files and metadata.ts
- Step 5: build admin CRUD on top of the DB layer
- Zero SEO regression — public URLs and rendered HTML stay identical

**Content and language**
- English is the primary language
- Russian is the secondary language
- A language switcher must exist in the top navigation when Russian is added
- All data structures are bilingual from day one (en/ru fields per guide and step)
- Do not use stock photos of people
- Use only a small, consistent micro-visual system — no random generated illustrations

**Acquisition and distribution**
- SEO and organic search are the primary acquisition channel
- Social links (WhatsApp, Instagram, Facebook) support distribution, but article SEO is the main traffic source
- Structure all guide pages clearly for search engines and AI readability

## Local Dev Server Rules
Whenever starting the local dev server for this project, always:
1. Bind to 0.0.0.0 so the site is accessible from other devices on the same Wi-Fi network:
   `npm run dev -- --hostname 0.0.0.0`
2. Detect the current local network IP of this Mac using:
   `ipconfig getifaddr en0` (or en1 as fallback)
3. Stop any incorrectly running dev server before starting a new one
4. Always print both URLs clearly at the end:
   - Desktop: http://localhost:3000
   - iPhone:  http://<LOCAL_IP>:3000
5. If the port differs from 3000, print the actual port
6. If the local IP cannot be detected, clearly say so and explain why
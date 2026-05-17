# Phase 5D — Connected Calendar, Content Bank, and Publishing Architecture

**Status:** Planning only. No code, no DB changes, no commit, no deploy.  
**Date:** 2026-05-17  
**Builds on:** `phase-5a-connected-calendar-homepage-plan.md`, `content-brief-uae-business-compliance-calendar-2026-2027.md`  
**Current committed state:** Phase 5B homepage (fdf5c59). Phase 5C RU parity complete locally, not committed.  

---

## 0. What Already Exists

Do not repeat work already done. Reference it.

| Doc | What it covers |
|---|---|
| `phase-5a-connected-calendar-homepage-plan.md` | Calendar UX design, cell color system, tab structure, mobile wireframes, data model for `dates_json`, content type decision rules, Phase 5B–5F implementation sequence |
| `content-brief-uae-business-compliance-calendar-2026-2027.md` | PDF compliance calendar breakdown, source verification checklist, event extraction table, writing style rules, MVP content plan |

Phase 5D does not redesign what Phase 5A defined. It operationalizes the next layer: what content to build, how it connects, how to produce and publish it correctly.

---

## 1. Product Definition — Dubai Life Calendar by Guidex

### What it is

A practical UAE life and business planning layer. One destination where a resident, new mover, business owner, investor, or family can understand what is happening, what is due, and what to do next — in any given month.

It is not a generic events listing. It is not a copied public holiday page. It is a connected, source-aware, editorially controlled planning system that links dates to explanations.

**Practical definition:** The Dubai Life Calendar is a time-structured interface for Guidex content. Every piece of content — news, events, guides, calendar pages — has a date dimension. The calendar is the entry point for users who navigate by time rather than by topic.

### What it covers

| Layer | Examples |
|---|---|
| UAE official holidays | Eid Al Adha, National Day, Islamic New Year, Prophet's Birthday |
| Dubai public events | GITEX, Dubai Design Week, Art Dubai, Dubai Marathon, Formula 1 |
| Business compliance | Corporate tax deadlines, VAT thresholds, e-invoicing phases, audit windows |
| Government deadlines | License renewal, Emirates ID renewal, Ejari, DEWA, labor file |
| Relocation and family | School term start/end, KHDA admissions, summer moving window, first 30 days |
| Property and investment | RERA reminders, service charge windows, DLD registration windows |
| Visa and residency | Renewal advisory dates, golden visa, digital nomad renewal |

### What it is not

- Not legal advice. Not tax advice. Not certified compliance guidance.
- Not an auto-scrape of another calendar.
- Not a copy of any competitor document (see: `content-brief-uae-business-compliance-calendar-2026-2027.md` Section 10).
- Not a standalone app — it is integrated into the Guidex content site.
- Not a listing of every event in Dubai. It is an editorially curated selection.
- Not auto-published. Every item is human-reviewed and manually published.

### Who it serves

| Audience | Primary use case |
|---|---|
| Business owners | Track compliance deadlines, plan for tax/license renewals |
| New movers | Understand school year, family visa, setup sequence, first 30 days |
| Residents | Know holiday dates, plan around UAE rhythm |
| Investors / property owners | Track DLD, RERA, rental compliance windows |
| Families | School admissions, visa renewals, Emirates ID |
| Freelancers | VAT threshold awareness, ILOE, license renewal |
| Premium clients | Clear authoritative reminders with source links |

---

## 2. Connected Content Model

### Content type definitions

**`news_posts`** — A significant official development, rule change, or confirmed announcement that a UAE resident, business owner, or mover needs to know. News is timely. It either changes a previous understanding or confirms a major date. News links to related calendar entries and guides.

- Rule: Only publish if the content is newsworthy (new information or confirmed change). Do not create a news post to explain existing rules — that is a Guide.
- Gate: Must have a traceable official or reliable source. No rumors, no unverified social posts.
- Shelf life: Short. Mark with publication date. Update if superseded.

**`events`** — A specific public or business event with a location, date range, and defined audience. A user would plan around it or attend it.

- Rule: Must have confirmed date + venue + source. Do not create an Event for a deadline (that belongs in calendar_pages dates_json).
- Examples: GITEX Global, Dubai Design Week, Art Dubai, Formula 1, KHDA Parent Orientation.
- Shelf life: Medium. Useful until the event passes. Keep for historical context but delist from active feed.

**`calendar_pages`** — A calendar document that organizes multiple date entries by month or theme. Currently `dates_json` stores the individual entries as JSON. Calendar pages are the containers.

- Rule: One calendar page per thematic cluster (e.g., "UAE Business Compliance Calendar 2026–2027") or per month (e.g., "May 2026 — Dubai Calendar").
- The individual entries inside `dates_json` are the actual calendar items shown on the homepage "This Month in Dubai" block and the `/calendar` page.
- See Phase 5A Section 12 for `dates_json` entry structure.

**`guides`** — Evergreen procedural explanations. A guide explains what to do, step by step, with official costs and timelines. Guides do not expire. They are updated when rules change.

- Rule: One guide per procedure or topic. Not one guide per deadline.
- Update rule: When a rule change is confirmed, update the guide AND create a News post about the change.

**Dubai Life Setup** — A curated planning layer for new movers. Links multiple guides and calendar items into a sequential checklist: first 30 days, home, family, school, bank, transport. Currently referenced but not a formal content type in the DB. Lives as a thematic hub page.

**Homepage sections** — The EN and RU homepages surface connected content:
- `FeaturedSlider` → recent published guides
- `This Month in Dubai` → calendar_pages dates_json entries (current 60-day window)
- `Latest guides / feed` → news_posts + events (fallback to recent guides)
- `RouteSnapshotBand` → editorially selected guides

### How they connect

```
Calendar Entry
  ├─ links to: News article (the confirmation story)
  ├─ links to: Event page (if it is an event)
  └─ links to: Guide (if it is a deadline explained by a procedure)

News Article
  ├─ links to: Calendar entries (key dates from the story)
  ├─ links to: Guide (the procedure this news affects)
  └─ appears in: Homepage feed, Latest updates section

Event Page
  ├─ links to: Calendar entries (event dates)
  ├─ links to: Related guides (e.g., company registration if it is a business event)
  └─ appears in: Homepage feed, /events listing

Guide
  ├─ links to: Calendar entries (relevant deadlines for this year)
  ├─ links to: News (recent rule changes affecting this guide)
  └─ appears in: FeaturedSlider, RouteSnapshotBand, Latest guides
```

### Cross-reference implementation (no schema change required)

For MVP, cross-references are editorial (manually placed in article body, summary, or `detail_url` inside `dates_json` entries). The `dates_json` entry shape already supports `detail_url` and `linked_content_slug` fields per Phase 5A Section 12.

Full relational linking (foreign keys, many-to-many `calendar_entries` table) is deferred to Phase 6A.

### Auto-date linking — connected calendar intelligence

The calendar is a date intelligence layer, not a standalone page. When any content type carries a date or date range that a user would plan around, the calendar must reflect it automatically via editorial action.

**Trigger rule:** Whenever a News post, Event, Calendar Visual Post, Guide update, or Government deadline has a date relevant to users, the owner adds a corresponding `dates_json` entry to an existing or new `calendar_pages` document. That entry then propagates to:

- The `/calendar` and `/ru/calendar` pages (full calendar view)
- The "This Month in Dubai" / "В этом месяце в Дубае" homepage block (60-day lookahead window)
- Future guide detail pages "Related 2026 Dates" section
- Future news detail pages "Key dates from this article"

**Content types that must generate calendar entries:**

| Content type | When to add calendar entry | Entry label source | Link target |
|---|---|---|---|
| News post | Announcement has a specific deadline or event date | `short_label_en` / `short_label_ru` from news title | `/news/{slug}` |
| Event page | Event has a defined start date | Event name (short form) | `/events/{slug}` |
| Calendar Visual Post | Thematic cluster (e.g., VAT deadlines 2026) | Individual entry labels in `dates_json` | `/calendar/{slug}` or `/news/{slug}` |
| Guide update | A procedure has a 2026 deadline (e.g., license renewal month) | Short action label | `/guides/{slug}` |
| Government deadline | Official date with penalty risk | Authority name + action (e.g., "FTA CT Return due") | Official source or future guide |
| Business compliance | Tax, AML, e-invoicing, audit windows | Short descriptor + authority | Related guide or news article |
| UAE public holiday | Federal declaration | Holiday name (official) | `/calendar/{slug}` with full holiday info |
| Major Dubai event | GITEX, F1, Art Dubai, Dubai Marathon, ADIPEC | Event name | `/events/{slug}` |

**Calendar entry link field:**

Each `dates_json` entry should include a `detail_url` pointing to the most relevant Guidex page for that date. This is what the homepage "This Month" block uses for the `→` arrow. If no Guidex page exists yet, leave `detail_url` empty — show the date without a link.

**The calendar auto-link principle:** No calendar item should be a dead end. Every item in the calendar should either explain itself (via label + body in the calendar page) or link to a page that explains it further. The calendar is the index; the content is the destination.

**Editorial workflow for date linkage:**

1. Owner creates or updates a News / Event / Guide / Calendar page draft
2. Owner identifies any key dates in that content
3. Owner opens the relevant `calendar_pages` document in admin
4. Owner adds a `dates_json` entry with: `date`, `label_en`, `label_ru`, `type`, `detail_url` pointing to the new content
5. Owner publishes the calendar page entry (after source verification if compliance-related)
6. The date now appears in the homepage "This Month" block and calendar page automatically

This is a manual editorial step. There is no auto-scraping, no AI trigger, no backend hook. The calendar is correct because a human reviewed and placed each entry.

---

## 3. Calendar Item Taxonomy

### Categories

| Category key | Display EN | Display RU | Color system |
|---|---|---|---|
| `holiday` | UAE Holiday | Праздник ОАЭ | Green (`#22C55E` / `#86EFAC` expected) |
| `event` | Dubai Event | Событие Дубая | Blue (`#3B82F6`) |
| `business` | Business | Бизнес | Navy (`#1E3A5F`) |
| `government` | Government | Госуслуги | Red/Amber (`#EF4444` / `#F59E0B`) |
| `family` | Family | Семья | Purple (`#A855F7`) |
| `relocation` | Relocation | Переезд | Purple (`#A855F7`) |
| `property` | Property | Недвижимость | Navy (`#1E3A5F`) |
| `visa` | Visa | Виза | Red (`#EF4444`) |
| `tax` | Tax | Налоги | Red (`#EF4444`) |
| `company` | Company | Компания | Navy (`#1E3A5F`) |
| `school` | School | Школа | Purple (`#A855F7`) |
| `banking` | Banking | Банки | Amber (`#F59E0B`) |
| `tourism` | Tourism | Туризм | Blue (`#3B82F6`) |
| `compliance` | Compliance | Compliance | Red (`#EF4444`) |

### Priority levels (for calendar cell display when dates overlap)

| Priority | Condition |
|---|---|
| 1 — Critical | Hard deadline with penalty risk (confirmed official source) |
| 2 — Official holiday | Confirmed public holiday (federal declaration) |
| 3 — Major public event | Confirmed major event (GITEX, F1, Art Dubai) |
| 4 — Business event | Business exhibition, conference, investment forum |
| 5 — Family / relocation | School term, admission deadline, move window |
| 6 — Advisory | Non-binding reminder, best practice, rolling obligation |

### Date confidence

| Value | Meaning | Display treatment |
|---|---|---|
| `confirmed` | Official government announcement or declaration | Show as stated |
| `expected` | Based on official pattern, not yet confirmed | No visual qualifier needed unless Islamic calendar |
| `subject_to_moon_sighting` | Islamic calendar date — officially approximate | Show with note: "Subject to official moon sighting confirmation" |
| `advisory` | Internal estimate, not government-sourced | Show with note: "Advisory — verify with authority" |

### Source reliability

| Value | Meaning |
|---|---|
| `official` | Direct government portal (FTA, ICP, UAE Cabinet, MOHRE, DHA, free zone authority) |
| `legislation` | UAE Federal Decree-Law, Cabinet Decision — authoritative text |
| `trusted_media` | Khaleej Times, Gulf News, Reuters, The National — credible, not sufficient alone for compliance claims |
| `advisory_pdf` | Professional services publication (competitor PDF, big 4 firm) — signal only |
| `public_social` | Public social/Telegram — signal only, never publishable without official verification |
| `internal_note` | Owner note, internal estimate |
| `unknown` | Source not yet identified |

### Verification requirement

| Level | Meaning | Admin behavior |
|---|---|---|
| `none` | Holiday, major confirmed event — publish freely | No block |
| `recommended` | Rolling compliance reminder — official source should be attached | Soft warning if no source URL |
| `required` | Compliance deadline with penalty, legal requirement — must not publish without official URL | Hard block on publish if source_url empty |

### Risk level (for internal admin display only)

| Level | Meaning |
|---|---|
| `low` | Lifestyle, tourism, community events |
| `medium` | Procedural reminders, advisory deadlines |
| `high` | Legal/tax compliance claims with potential penalty exposure |

### Calendar item type system — detailed

Each item type has a defined color, short label style, and visual priority. Designed for a month-grid view where space is limited.

| Type key | Color | Short label style | Priority | Notes |
|---|---|---|---|---|
| `holiday` | Emerald `#22C55E` | Bold, all caps short name. "EID AL ADHA" | 1 | Federal holidays visually strongest. Islamic dates require `subject_to_moon_sighting`. |
| `government_deadline` | Red `#EF4444` | Action + authority. "CT Return — FTA" | 1 | Hard deadlines. `verification_required`. |
| `tax_deadline` | Red `#EF4444` | Tax type + brief. "VAT Return Q2" | 1 | FTA-sourced only. |
| `visa_deadline` | Amber `#F59E0B` | Visa type + action. "Residence Renewal" | 2 | Advisory — actual dates per individual case. |
| `event` | Blue `#3B82F6` | Short event name. "GITEX 2026" | 2 | Confirmed events with dates + venue. |
| `real_estate_event` | Navy `#1B2E4B` | Prefix + name. "PROP · Cityscape" | 3 | Major property exhibitions and DLD windows. |
| `business_event` | Navy `#1B2E4B` | Event name short. "ADIPEC" | 3 | Business conferences, trade shows, investment forums. |
| `aml_deadline` | Red `#EF4444` | "AML · Risk Assessment" | 1 | MOEI/goAML verified. High risk. |
| `family_school` | Purple `#A855F7` | "KHDA · Admissions" | 4 | School year, admissions, KHDA dates. |
| `relocation` | Purple `#A855F7` | Short reminder. "Move Window" | 4 | Advisory best-practice dates for movers. |
| `news_update` | Gray `#6B7280` | "News · [category]" | 5 | News item with a specific date impact. |

Colors are intentionally clustered: Red/Amber = deadlines/alerts. Blue = events. Navy = business. Emerald = holidays. Purple = family/life. Gray = informational.

### Multi-item day behavior

When multiple calendar items fall on the same date, the UI must remain readable and prioritized.

**Month grid cell (mobile and desktop):**

- Show the 1–2 highest-priority items as short label pills inside the cell
- Use the `type` color as the pill background
- For additional items beyond the visible limit, show a "+N more" indicator (gray, tappable)
- Tapping/clicking the cell opens a day panel or scrolls to the day agenda

**Day agenda view (panel or list below grid):**

- Groups items by priority: Critical deadlines first → Holidays → Major events → Business events → Advisory
- Each item shows: short label (colored dot), date, full label_en or label_ru, optional `detail_url` CTA ("More details →" / "Подробнее →")
- Items without a `detail_url` show the label only (no broken link)

**Mobile layout:**

- Month grid: compact 7-column grid, each cell shows max 1 pill + "+N" if needed
- Below grid: selected day agenda list — tapping a day updates the list
- No horizontal scroll inside the calendar grid
- Pill labels must never overflow their cell — use `truncate` + max-width

**Desktop layout:**

- Month grid cells can show up to 2 label pills
- Right side or below: expanded agenda panel updates as user clicks/hovers a date
- Grid should remain fully visible without scrolling on a standard laptop viewport

**Overflow handling rules:**

- Always show holiday items (priority 1) even if cell is full — replace a lower-priority item if needed
- Never truncate a hard deadline item (priority 1) from the grid
- The "+N more" count is always accurate — never discard items silently

---

## 4. Content Production Pipeline

### A. Signal Collection

Owner collects signals from:

| Source type | Examples | How to handle |
|---|---|---|
| Official government portals | FTA, ICP, MOHRE, DHA, UAE Cabinet, DLD, KHDA, Emirates Media Council | Primary source — use directly |
| Official PDFs and announcements | Ministry press releases, authority circulars | Extract claim, record URL, use as `official` |
| Trusted UAE media | Khaleej Times, Gulf News, Reuters, The National | Signal only — must find official source before publishing compliance claims |
| Owner notes / research | Competitor calendar, market observation | `internal_note` — always requires official verification before publish |
| Uploaded PDFs | UAE Business Compliance Calendar (Make Fortune) | Signal only — see `content-brief-uae-business-compliance-calendar-2026-2027.md` for breakdown |
| Telegram / social | UAE expat groups, PRO networks, government social accounts | `public_social` — never sufficient alone |

### B. Classification Decision

For every signal, the owner decides:

```
Signal received →

1. Is it newsworthy (new rule, confirmed date, official announcement)?
   YES → News post (draft)
   
2. Is it a specific event with date + venue?
   YES → Event page (draft)
   
3. Is it a date or deadline with no full article needed?
   YES → Calendar entry inside existing or new calendar_pages (draft)
   
4. Does it affect an existing guide?
   YES → Guide update (mark guide for revision)
   
5. Does it justify a new evergreen guide?
   YES → New guide (draft)
   
6. Is it too uncertain, outside scope, or not original?
   YES → Ignore. Log reason.
```

### C. Editorial Decision Record

For every signal that enters the pipeline, record:

- Content type chosen
- Why it matters (who is affected and how)
- Target audience
- EN title idea
- RU title idea
- Primary keyword EN
- Primary keyword RU
- Official source needed
- Source URL if found
- Verification status
- Risk level
- Priority (how soon to publish)
- Related guides or calendar items to link

### D. Draft Package

Every draft enters the system as a structured JSON package via the AI Inbox import workflow (`/admin/content/ai-inbox`).

Import JSON template:

```json
{
  "type": "news | event | calendar",
  "slug": "slug-here",
  "en_title": "...",
  "ru_title": "...",
  "en_summary": "...",
  "ru_summary": "...",
  "en_body": "...",
  "ru_body": "...",
  "en_seo_title": "...",
  "ru_seo_title": "...",
  "en_meta_description": "...",
  "ru_meta_description": "...",
  "category": "...",
  "date_published": "YYYY-MM-DD",
  "event_date_start": "YYYY-MM-DD",
  "source_label": "...",
  "source_url": "...",
  "verification_status": "verified | pending | required",
  "risk_level": "low | medium | high",
  "linked_guides": ["slug-1", "slug-2"],
  "image_path": "/images/...",
  "image_alt": "...",
  "ru_image_alt": "..."
}
```

Import rule: always `status: draft`. Never auto-publish. Never auto-set `ru_published: true`.

### E. Human Review

Before any publish:

1. Owner reviews EN content — facts, tone, source
2. Owner reviews RU content — natural language, no machine translation artifacts
3. Owner checks source URL is accessible and confirms the claim
4. Owner verifies risk level is appropriate
5. Owner previews in admin
6. Owner clicks publish manually
7. For RU: owner clicks RU publish separately after reviewing RU fields

---

## 5. PDF Compliance Calendar — Content Bank

Source: UAE Business Compliance Calendar 2026 (Make Fortune Business Solutions). Do not copy. Use as topic signal only. All claims must be independently verified. See `content-brief-uae-business-compliance-calendar-2026-2027.md` for full breakdown.

The table below maps PDF topics to Guidex content opportunities with priority, verification need, and audience.

### Corporate Tax cluster

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| CT registration for legal entities (rolling) | UAE Corporate Tax Registration: When Does Your Company Need to Register? | Регистрация по корпоративному налогу в ОАЭ: когда и как | UAE corporate tax registration | регистрация корпоративный налог ОАЭ | Company founders, free zone companies, mainland | Calendar entry: rolling reminder | FTA — tax.gov.ae | High | P1 |
| CT registration for natural persons (March 31) | UAE Corporate Tax: When Do Sole Professionals and Freelancers Need to Register? | Корпоративный налог ОАЭ для физических лиц: кто обязан зарегистрироваться | UAE corporate tax natural persons threshold | корпоративный налог физические лица ОАЭ | Freelancers, sole practitioners, investors | Calendar entry: 31 March 2027 (advisory) | FTA | High | P1 |
| CT return and payment (9 months after FY end) | UAE Corporate Tax Return: When to File and When to Pay | Декларация по корпоративному налогу ОАЭ: сроки подачи | UAE corporate tax return deadline | декларация корпоративный налог срок | Mainland + free zone companies | Calendar entry: 30 Sep 2026 (FY Dec 31), plus rolling | FTA | High | P1 |
| FTA portal company data update (20-day rule) | Keeping Your FTA Record Current: What to Update After a Company Change | Обновление данных компании в FTA: что важно знать | FTA company data update UAE | обновление данных FTA ОАЭ | All registered companies | Calendar entry: rolling reminder | FTA / Cabinet Decision 74 of 2023 | Medium | P2 |
| CT deregistration | How to Deregister a UAE Company from Corporate Tax | Дерегистрация компании в системе корпоративного налога ОАЭ | UAE corporate tax deregistration | дерегистрация корпоративный налог | Company founders closing entities | Not date-specific | FTA | Medium | P3 |

### VAT cluster

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| VAT registration threshold | UAE VAT Registration: When Does Your Business Need to Register? | Регистрация по НДС в ОАЭ: порог и сроки | UAE VAT registration threshold | НДС регистрация ОАЭ порог | Small businesses approaching AED 375K | Calendar entry: rolling threshold reminder | FTA — tax.gov.ae VAT section | High | P1 |
| VAT deregistration | UAE VAT Deregistration: When and How | Дерегистрация по НДС ОАЭ | UAE VAT deregistration | дерегистрация НДС ОАЭ | Businesses below threshold or closing | Rolling | FTA | Medium | P2 |
| VAT compliance checklist | UAE VAT Compliance Checklist for Small Businesses | Чеклист по НДС для малого бизнеса в ОАЭ | UAE VAT compliance checklist | НДС чеклист малый бизнес ОАЭ | SMEs, freelancers with >AED 375K | Not date-specific | FTA | High | P2 |

### Accounting and Audit cluster

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| Mainland audit requirement | Is Audit Mandatory for Dubai Mainland Companies? | Обязателен ли аудит для компаний на материке в Дубае? | mainland company audit UAE | аудит компания материк Дубай | Mainland company owners | Calendar entry: annual advisory | Federal Decree-Law 32 of 2021 / DED | High | P1 |
| DMCC audit deadline (30 June) | DMCC Company Audit: Submission Deadline and Requirements | Аудит для компаний DMCC: сроки и требования | DMCC audit deadline | DMCC аудит срок | DMCC companies | Calendar entry: 30 Jun 2026 (pending DMCC confirmation) | DMCC portal — dmcc.ae | High | P1 |
| DIFC audit | DIFC Company Audit Requirements | Аудит для компаний DIFC | DIFC audit requirements | DIFC аудит требования | DIFC companies | Calendar entry: annual | DIFC Registrar — difc.ae | High | P2 |
| ADGM audit | ADGM Company Audit Obligations | Аудит компаний ADGM | ADGM audit | ADGM аудит | ADGM companies | Rolling by FY end | ADGM Registration Authority | High | P2 |
| QFZP audit relevance | UAE QFZP Status: What It Means for Your Tax and Audit Requirements | Статус QFZP в ОАЭ: влияние на налоги и аудит | UAE QFZP qualifying free zone | QFZP ОАЭ | Free zone companies seeking 0% CT | Conditional on QFZP status | FTA | High | P3 |

### Company operations cluster

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| Trade license renewal (mainland) | How to Renew a Dubai Trade License: Timeline and Process | Как продлить торговую лицензию в Дубае | Dubai trade license renewal | продление торговой лицензии Дубай | All mainland companies | Calendar entry: rolling annual reminder | DED — ded.gov.ae | Medium | P1 |
| Trade license renewal (free zone) | Renewing a Free Zone Business License in Dubai and UAE | Продление лицензии в свободной зоне ОАЭ | free zone license renewal UAE | продление лицензии свободная зона ОАЭ | Free zone companies | Rolling — varies by zone | Each free zone portal | Medium | P1 |
| Establishment card renewal | UAE Establishment Card: What It Is and When to Renew | Establishment Card ОАЭ: что это и как продлевать | UAE establishment card renewal | Establishment Card ОАЭ продление | Mainland companies with employees | Rolling annual | MOHRE | Medium | P2 |
| Labor file and Ejari | Ejari Registration and Renewal for Dubai Businesses | Ejari для бизнеса в Дубае: регистрация и продление | Ejari registration Dubai | Ejari Дубай регистрация | Businesses with commercial space | Rolling | RERA / DLD | Medium | P2 |
| Bank and telecom data updates | Updating Company Details After Renewal: Banks, Telecom, Portals | Обновление данных компании в банках и у операторов | UAE company data update after license renewal | обновление данных компания банки ОАЭ | All companies | Advisory after license renewal | Best practice — no single official source | Low | P3 |

### Visa and HR cluster

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| UAE residency visa renewal (2-year) | How to Renew a UAE Residency Visa: Timeline and Steps | Продление резидентской визы ОАЭ: сроки и порядок | UAE residency visa renewal | продление резидентской визы ОАЭ | All UAE residents | Calendar entry: rolling every 2 years | ICP — icp.gov.ae | Medium | P1 (guide update) |
| Golden Visa renewal (10-year) | Renewing a UAE Golden Visa: What to Know | Продление Золотой визы ОАЭ | UAE Golden Visa renewal | золотая виза ОАЭ продление | Golden Visa holders | Calendar entry: rolling every 10 years | ICP | Medium | P2 |
| Digital nomad visa renewal (annual) | UAE Digital Nomad Visa: How to Renew | Виза цифрового кочевника ОАЭ: продление | UAE digital nomad visa renewal | виза цифрового кочевника ОАЭ | Remote workers | Rolling annual | ICP | Medium | P2 |
| ILOE unemployment insurance | UAE Unemployment Insurance (ILOE): Who Needs It and How to Register | ILOE — страхование от безработицы ОАЭ: регистрация | UAE ILOE unemployment insurance | ILOE страхование безработица ОАЭ | All work visa holders | Calendar entry: register after each visa activation | ILOE.ae / MOHRE | Medium | P1 |
| Medical insurance (Dubai) | Medical Insurance Requirements for Dubai Visa Holders | Медицинская страховка для резидентов Дубая | Dubai medical insurance requirement | медицинская страховка Дубай | All Dubai residents | Annual reminder | DHA — dha.gov.ae | Medium | P1 |

### AML and Compliance cluster

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| AML risk assessment (Jan window) | UAE AML Risk Assessment for DNFBP: Annual Window and Requirements | Оценка рисков ОМЛ (DNFBP) в ОАЭ: ежегодное окно | UAE AML risk assessment DNFBP | ОМЛ оценка рисков DNFBP ОАЭ | Real estate, gold, accounting firms meeting DNFBP criteria | Calendar entry: 1–31 Jan 2027 | MOEI / goAML | High | P1 |
| goAML registration and KYC | Getting Started with goAML: Registration and KYC for UAE Businesses | Регистрация в системе goAML: руководство для бизнеса | UAE goAML registration | goAML регистрация ОАЭ | DNFBP entities | Not date-specific | MOEI | High | P2 |
| Related-party transactions and transfer pricing | UAE Transfer Pricing: Who Needs Documentation and When | Трансфертное ценообразование в ОАЭ | UAE transfer pricing documentation | трансфертное ценообразование ОАЭ | MNEs, related-party companies | Linked to CT return | FTA | High | P2 |
| Excise tax registration | UAE Excise Tax: Who Needs to Register | Акцизный налог в ОАЭ: кто обязан регистрироваться | UAE excise tax registration | акцизный налог ОАЭ | Manufacturers, importers, Designated Zone operators | Rolling — triggered by activity | FTA | Medium | P3 |
| Media permit for sponsored content | UAE Media Permit: When Does Your Business Need One? | Медиа-разрешение в ОАЭ: когда оно нужно | UAE media permit requirement | медиа-разрешение ОАЭ | Agencies, influencers, businesses running paid content | Rolling — event-triggered | Emirates Media Council | Medium | P3 |

### E-Invoicing cluster (highest urgency in 2026)

| Content idea | EN title direction | RU title direction | Keyword EN | Keyword RU | Audience | Calendar relevance | Official source | Risk | Priority |
|---|---|---|---|---|---|---|---|---|---|
| E-Invoicing overview | UAE E-Invoicing 2026–2027: What Every Business Needs to Know | Электронный счёт-фактура в ОАЭ 2026–2027: что нужно знать | UAE e-invoicing 2026 | электронный счёт-фактура ОАЭ 2026 | All UAE businesses | Calendar entries: Jul 2026, Jan 2027, Mar 2027, Jul 2027 | MoF / FTA — mof.gov.ae | High | P1 (highest) |
| ASP appointment for large businesses | UAE E-Invoicing: How to Appoint an Accredited Service Provider | Выбор аккредитованного провайдера для e-invoicing в ОАЭ | UAE e-invoicing accredited service provider | e-invoicing ASP ОАЭ | Large businesses (≥ AED 50M turnover) | Calendar entry: 31 Jul 2026 deadline (verify) | MoF official e-invoicing portal | High | P1 |
| What is not enough (Excel warning) | Why Spreadsheets Won't Work for UAE E-Invoicing Compliance | Почему Excel не заменит e-invoicing систему в ОАЭ | UAE e-invoicing Excel compliance | e-invoicing Excel ОАЭ | SMEs preparing early | Not date-specific | MoF guidance | Medium | P2 |
| SME preparation guide | UAE E-Invoicing for SMEs: Prepare Now for the 2027 Deadline | E-Invoicing для малого бизнеса ОАЭ: подготовка к 2027 | UAE e-invoicing SME deadline 2027 | e-invoicing малый бизнес ОАЭ 2027 | SMEs < AED 50M | Calendar entry: 31 Mar 2027, 1 Jul 2027 | MoF | High | P2 |

---

## 6. 2026 Public Calendar Research Plan

All dates and claims must be verified before entering the calendar as `confirmed`. Do not invent, estimate, or assume.

### Islamic holiday dates — rule

Islamic holidays are calculated by lunar calendar and officially confirmed by moon sighting committees. **Do not treat any Islamic holiday date as fixed until officially confirmed by UAE authorities.**

For pre-publication planning, use `date_confidence: "subject_to_moon_sighting"` and show in the admin and the public-facing calendar:

> "Expected around [date]. Subject to official moon sighting confirmation."

Never display an Islamic holiday date without this qualifier until the UAE Cabinet or Supreme Court officially announces it.

Known 2026 Islamic dates (approximate — not confirmed at time of writing):

| Holiday | Approximate dates | Confidence |
|---|---|---|
| Eid Al Fitr 2026 | ~ 20–24 March 2026 | Expected — likely already confirmed (check UAE Cabinet) |
| Eid Al Adha 2026 | ~ 27–30 May 2026 | Expected — check UAE Cabinet announcement |
| Islamic New Year 1448 | ~ 27 Jun 2026 | Expected — not confirmed |
| Prophet's Birthday | ~ 4 Sep 2026 | Expected — not confirmed |

### Fixed UAE public holidays 2026 (Gregorian)

| Date | Holiday | Confidence |
|---|---|---|
| 1 Jan 2026 | New Year's Day | Confirmed — always Jan 1 |
| 2–3 Dec 2026 | UAE National Day | Confirmed — always Dec 2–3 |

Confirm current federal declarations at: uae.gov.ae, or official government social accounts / press releases.

### Verification sources by category

| Category | Primary source | Secondary | Notes |
|---|---|---|---|
| UAE federal public holidays | UAE Government portal (u.ae) | UAE Cabinet Office announcements | Islamic holidays confirmed annually |
| Dubai-specific government events | Dubai Media Office | Dubai Government portal | Not all Dubai events are federal |
| KHDA school calendar | KHDA — khda.gov.ae | Individual school announcements | Private school calendar may vary |
| Corporate tax deadlines | FTA — tax.gov.ae | Ministry of Finance | Confirm 9-month rule, verify FY assumptions |
| VAT compliance | FTA — tax.gov.ae | Federal Decree-Law No. 8 of 2017 | |
| E-invoicing | Ministry of Finance — mof.gov.ae | FTA | Highest priority — July 2026 deadline approaching |
| AML/DNFBP | MOEI — moec.gov.ae | goAML UAE portal | Annual window Jan 1–31 |
| DMCC events/deadlines | DMCC — dmcc.ae | | June 30 audit deadline — verify |
| DIFC events/deadlines | DIFC — difc.ae | | |
| ADGM | ADGM — adgm.com | | |
| ICP / GDRFA (visa) | ICP — icp.gov.ae | GDRFA Dubai — gdrfad.gov.ae | Visa validity, renewal rules |
| MOHRE (employment) | MOHRE — mohre.gov.ae | | Domestic worker rules, labor contracts |
| DLD / RERA | DLD — dubailand.gov.ae | RERA | Property registration, Ejari |
| DHA / health | DHA — dha.gov.ae | DOH Abu Dhabi for federal reference | Medical insurance |
| GITEX / DWTC events | GITEX official, DWTC | | Event dates typically announced 6–12 months ahead |
| Dubai Design Week | Dubai Design District (d3) | | |
| Dubai World Cup / Formula 1 | Official event organizers | | Confirm dates each season |

### How to handle uncertain dates before publishing

If a date has not been officially confirmed:

1. Record it as `date_confidence: "expected"` in `dates_json`
2. In the agenda display, show: "Expected — check official announcement"
3. Do not link to the calendar entry from the homepage "This Month" block until confirmed
4. Add `source_url: ""` and `verification_status: "pending"`
5. When confirmed: update `date_confidence` to `"confirmed"`, add `source_url`, set `verification_status: "verified"`, re-publish

---

## 7. EN/RU Content Parity Rules

These rules apply to every piece of content entering the Guidex system from this point forward.

### Every content item must have

| Field | EN | RU | Rule |
|---|---|---|---|
| Title | Required | Required | Natural language, not literal translation |
| Summary | Required | Required | Same information, natural phrasing in each language |
| Body | Required | Required before RU publish | Equivalent depth and quality |
| SEO title | Required | Required before RU publish | Different keywords, same intent |
| Meta description | Required | Required before RU publish | Under 160 chars each |
| Source label | Required | Translate if it adds clarity | Official body names stay in their official form |
| Image alt | Required | Required before RU publish | Describe the image in the language |
| Category | Required | Same category key | Category display name translates |

### RU publish gate

- EN content must be complete and published first
- RU fields must be filled and reviewed — no empty RU fields on a published RU item
- RU is published by flipping `ru_published: 1` separately from the EN publish
- `ru_published: 0` means the item exists in DB but does not appear on RU routes
- No item with `ru_published: 1` and empty `ru_title` or `ru_body` should exist — this is a data quality error

### RU copy quality rules

- Written by a fluent Russian speaker or quality-checked by the owner before publish
- No literal machine translation artifacts ("в современном мире...," "кроме того, следует отметить...") 
- No awkward literal rendering of English phrases
- No em dashes in long chains — use short sentences or commas
- Short sentences. Active voice preferred.
- Official terms stay in their standard form: FTA, ICP, GDRFA, DMCC, Ejari — spelled out once, abbreviated after
- Government authority names translated where a standard Russian name exists: Министерство финансов ОАЭ, Федеральная налоговая служба ОАЭ
- Tone: calm, practical, premium — same as EN

### What is allowed to stay in English on RU pages

- Brand names: Guidex, Dubai Life Calendar, Dubai Life Setup
- Official proper nouns with no established Russian translation: GITEX, DMCC, ADGM, Ejari, goAML, FTA, ICP
- File format names, technical terms with no natural Russian equivalent
- Quoted official terms: "Qualifying Free Zone Person (QFZP)"

### What must never be in English on RU public pages

- Section headings and labels
- CTAs and button text
- Body text
- Navigation labels
- Category chips and tags displayed to users
- Error messages and empty states

---

## 8. SEO / AEO / RAG Writing Standards for All Future Drafts

### Core principle

Every Guidex article should directly answer a question a UAE resident, business owner, mover, or investor would ask. The answer should be useful without needing to read anything else first.

### Article structure for SEO and AI retrieval

Every article should contain:

1. **Summary** (1–2 sentences at the top) — what the article covers and who it is for
2. **Who it affects** — exact audience, not vague ("if you are a mainland company with employees..." not "businesses in the UAE")
3. **Key dates or facts** — the number, deadline, or threshold up front
4. **What changed or why it matters** — only if there is a new development; otherwise skip
5. **What to do next** — the concrete action (register on FTA portal / go to Amer center / contact your free zone authority)
6. **Official source** — linked. Name the authority and the URL.
7. **Related Guidex guides** — 1–3 internal links
8. **Related calendar items** — link to the calendar or the specific date

### Writing rules

- **Facts first.** Lead with the obligation, threshold, or date. Explain context second.
- **One clear keyword focus.** Each page targets one main search intent. Do not stuff multiple unrelated keywords.
- **Entity-rich, not keyword-stuffed.** Include official body names (FTA, ICP, GDRFA, DMCC, DHA, RERA) naturally in the text. These are retrieval entities for AI systems. Do not insert them artificially.
- **Short paragraphs.** Maximum 3 sentences. On mobile, 2 is better.
- **No em-dash chains.** A full stop or comma is cleaner.
- **No filler.** No "In the ever-evolving landscape of..." No "It is worth noting that..." No "As we have seen above..."
- **No unsupported claims.** No AED penalty amounts without a cited official source URL.
- **No AI-looking text.** Each article should sound like it was written by someone who actually works in UAE procedure — specific, slightly opinionated, direct.
- **Headings are concrete.** "Who Needs to Register for UAE Corporate Tax" not "Registration Overview." Users and search engines both benefit from specific headings.

### AEO / RAG-specific considerations

AI systems retrieve content that:
- Answers questions directly (not buried in paragraph 4)
- Uses the exact official terminology users and systems expect
- Has a clear hierarchy: summary → who → what → when → how → source
- Cites official sources (improves trustworthiness signal)
- Contains entity names consistently (FTA, ICP, not "the authority" or "they")
- Links internally to related official explanations

For Guidex: the goal is to be the source an AI assistant quotes when someone asks "when do I need to register for UAE corporate tax?" or "what are the UAE e-invoicing deadlines for 2027?" That requires direct, sourced, entity-rich, well-structured content.

### Localization for Russian RAG

Russian-language AI retrieval benefits from the same principles applied in Russian:
- Use Russian search entities naturally: "корпоративный налог ОАЭ", "резидентская виза ОАЭ", "Дубай компания регистрация", "переезд в Дубай", "Ejari продление"
- Russian users often search with slightly different phrasing than EN users — write for the Russian reader, not a translation of the EN article
- Russian summary and h1 should target Russian intent, not just translate the English headline

---

## 9. Admin / Import Publishing Workflow

### Current system (as of Phase 4B-2E)

- AI Inbox at `/admin/content/ai-inbox`
- Import mode: owner pastes JSON, system parses, creates draft
- Save path: `saveGeneratedNewsAction` / `saveGeneratedEventAction` / `saveGeneratedCalendarDraftAction`
- All saves force `status: draft`, `ru_published: 0`
- No auto-publish anywhere in the system

### Ideal content session workflow (owner perspective)

1. **Collect signal** — official source, PDF, media report
2. **Open AI Inbox** — paste import JSON with the draft content
3. **Review draft preview** — check EN and RU fields, category, dates
4. **Check source panel** — source label, source URL, risk level
5. **Save as draft** — system creates DB row, stays unpublished
6. **Preview on admin detail page** — see full article as it would appear
7. **Verify facts against source URL** — open the official source, confirm claims
8. **Fix any issues** — edit fields directly in admin
9. **Publish EN** — click "Publish" (sets `status: published`)
10. **Review RU fields** — are they complete and natural?
11. **Publish RU** — click "Publish RU" (sets `ru_published: 1`)

### Ideal future admin UX improvements (Phase 5E scope)

The following are not implemented yet. Plan them for Phase 5E:

- **Source/risk panel** — show `source_url`, `source_label`, `risk_level`, `verification_status` on the admin detail page. Flag items with `risk_level: high` and empty `source_url` with a warning before publish.
- **Related content suggestions** — show related guides by category at draft time. "This news item is in the 'tax' category — related guides: Corporate Tax guide, VAT guide."
- **Calendar date mapping** — on Event and News admin pages, show a mini widget: "Linked calendar entries for these dates."
- **RU publish warning** — if any RU field is empty when `ru_published` is being set, show a warning: "RU summary is empty. This item will show an empty summary on /ru routes."
- **Verification checklist** — for high-risk items, show a pre-publish checklist: source URL present ✓ / no unsupported penalty claims ✓ / official body named ✓

### What must never change

- `status = draft` default on every import — enforced in server action
- `ru_published = 0` default — enforced in server action
- No auto-publish trigger anywhere
- `"use server"` files only export async functions — never constants or types

---

## 10. Launch Gate

The new portal homepage design and connected calendar system should NOT be deployed until the following gate conditions are met. This is a quality gate, not a technical gate.

### Code and build gate

- [ ] EN homepage committed and clean (done: fdf5c59)
- [ ] RU homepage committed and matching EN structure (Phase 5C/5C-R1 — pending commit)
- [ ] RU homepage uses `getRecentPublishedGuidesLocale` — no EN guide titles in RU slider (Phase 5C-R1)
- [ ] RU card titles ("Календарь жизни в Дубае", "Настройка жизни в Дубае") are Russian (Phase 5C-R1)
- [ ] Desktop nav has `whitespace-nowrap` on all items — "Найти маршрут" does not wrap (Phase 5C-R1)
- [ ] TypeScript: 0 errors
- [ ] QA: all existing suites pass
- [ ] Build: clean
- [ ] No hydration errors on EN or RU homepage
- [ ] No broken internal links on EN and RU homepage
- [ ] EN/RU toggle works correctly on all homepage blocks
- [ ] Desktop and mobile layout QA: EN and RU visually equivalent at 375px, 640px, 1280px, 1440px

### Content gate

- [ ] At least 3 calendar_pages entries with real `dates_json` entries published (not empty)
- [ ] At least 2026 UAE public holidays marked with correct `date_confidence`
- [ ] At least 1 wave of Business Compliance calendar items (compliance cluster) with verified sources
- [ ] At least 3 News drafts ready for publish (can be the 3 existing drafts after source verification)
- [ ] At least 3 Events drafts ready for publish
- [ ] "This Month in Dubai" block shows at least 2–3 real items (not empty state) on the homepage
- [ ] "Latest guides/feed" shows real content (news/events, not just guides as fallback)
- [ ] FeaturedSlider shows correct recent guides

### Quality gate

- [ ] No English fallback on any RU public route where Russian is expected
- [ ] All high-risk content items have `source_url` populated
- [ ] No compliance claims without official source
- [ ] No Islamic holiday dates published without `date_confidence: "subject_to_moon_sighting"` or `"confirmed"` (after official announcement)
- [ ] No copied text from competitor PDF or any other source
- [ ] RU fields complete and natural for all published RU items

### Owner review gate

- [ ] Owner reviews EN homepage screenshots on mobile and desktop
- [ ] Owner reviews RU homepage screenshots on mobile and desktop
- [ ] Owner approves calendar content quality
- [ ] Owner approves first wave of news/events drafts
- [ ] Owner confirms deploy window and production backup plan

---

## 11. What NOT to Do

| Prohibited action | Reason |
|---|---|
| Publish draft content automatically | Human review is required for all content |
| Push to production | No deploy until launch gate is cleared |
| Copy text from competitor PDF | Originality requirement — see content-brief-uae-business-compliance-calendar-2026-2027.md Section 10 |
| Publish compliance claims without an official source URL | Legal risk, credibility risk |
| Show Islamic holiday dates without `subject_to_moon_sighting` or confirmed status | Factual risk — these dates are officially announced, not predictable |
| Create generic AI-looking articles | Guidex tone is specific, sourced, direct |
| Let RU pages fall behind EN pages | EN/RU parity is a permanent requirement |
| Auto-fill `ru_published: 1` | RU fields must be individually reviewed and published |
| Run DB migrations without a server-side backup | Data safety rule |
| Change DB schema without Phase 5F planning | Schema changes are a deploy event |
| Deploy without commit + push to GitHub | GitHub is the source of truth for code |
| Turn the calendar into a simple events list | The calendar is a life/business planning system |
| Add auto-scraping or paid APIs | All signals are manually reviewed |
| Build Area Map before core calendar is stable | Explicitly deferred |

---

## 12. Recommended Next Phases

### Phase 5D-a — Content Verification Sprint (before launch)

Owner verifies top 5 compliance sources:
1. MoF e-invoicing portal — confirm July 31, 2026 ASP deadline and Jan 1, 2027 go-live
2. FTA corporate tax return — confirm 9-month rule and FY assumptions
3. MOEI/goAML — confirm January 1–31 annual risk assessment window
4. FTA VAT — confirm AED 375,000 threshold and 30-day application window
5. DMCC/DIFC — confirm June 30 audit submission deadline

After verification, create first wave of admin drafts (news + events + calendar entries) for the confirmed items. Keep status: draft. Prepare for owner review.

### Phase 5E — Calendar Page and Content Publishing

Rebuild `/calendar` and `/ru/calendar` pages with full interactive calendar (Phase 5A Section 5 design). Add verified content from Phase 5D-a. Publish first wave of news/events/calendar items. Update `dates_json` entry shape to include `detail_url`, `short_label_ru`, `confidence`, `source_url` fields per Phase 5A Section 12. EN/RU parity at every step.

### Phase 5F — Production Deploy

Full deploy to production after launch gate is cleared. Includes: local DB backup, server-side timestamped backup, new build on server, PM2 restart, post-deploy smoke test, git push of all committed phases.

### Phase 6A — Connected Links and Extended Content

- Add `calendar_entries` DB table for per-entry SQL queries (currently stored in dates_json)
- Implement cross-reference links: news/events/guides show related calendar entries
- Guide detail pages show "Related dates — 2026" section
- News detail pages show "Key dates from this article"
- Event detail pages link to relevant guides

---

## 13. Code and Architecture Assumptions (Current)

Discovered during Phase 5C audit:

| Assumption | Current state |
|---|---|
| `getPublishedNewsPosts("ru")` | Returns only `ru_published: 1` items. Currently returns [] — all content is draft. |
| `getPublishedEvents("ru")` | Same gate. Currently returns []. |
| `getPublishedCalendarPages("ru")` | Same gate. Returns []. |
| Homepage "This Month" block | Shows empty state correctly with Russian copy on RU page |
| `FeaturedSlider` locale prop | Implemented in Phase 5C — supports `locale="ru"` |
| `RouteSnapshotBand` locale prop | Implemented in Phase 5C — supports `locale="ru"` |
| `getRecentPublishedGuidesLocale(7, "ru")` | Added in Phase 5C-R1. Returns guides with non-empty `ru_title`, ordered by recency. RU page uses this for both the FeaturedSlider and Latest guides fallback. All 17 guides confirmed to have `ru_title` in DB as of 2026-05-17. |
| `dates_json` entry shape | Basic shape: `date`, `label_en`, `label_ru`, `type`. Does not yet include `short_label_en`, `short_label_ru`, `confidence`, `source_url`, `detail_url`, `priority`, `period_end`. These can be added to JSON entries without a schema migration. |
| Image fields | `news_posts` and `calendar_pages` have `image_path`, `image_alt`, `ru_image_alt`. Events table has NO image columns. |
| Admin content types | News, Events, Calendar Visual Posts — all functional in admin with dark theme (committed 19786e8) |

---

*End of Phase 5D planning document. This document is planning only. No code, DB, or production changes were made.*

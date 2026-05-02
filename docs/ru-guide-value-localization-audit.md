# RU Guide Value Localization Audit
**Date:** 2026-04-30
**Scope:** 4 completed RU guides. No code or DB changes made during this audit.

---

## 1. Executive Summary

RU guide pages now show Russian UI labels (Step 2 complete). The remaining English on RU pages comes from 6 DB fields that have no `ru_*` equivalents: guide-level `price`, `timeline`, `lastUpdated`, `category` (already fixed via display map), and step-level `cost`, `timeEst`.

Across the 4 guides there are 37 unique English value strings that render on RU pages. They fall into 4 classes:

| Class | Description | Count | Action |
|-------|-------------|-------|--------|
| A | Pure English text — direct Russian mapping safe | 22 | Display-level helper |
| B | AED amounts or universal numerics — leave as-is | 9 | No change needed |
| C | AED amount + English context — translate context | 9 | Schema redesign later |
| D | EN em-dashes in `cost`/`timeEst` EN fields — visible on both EN and RU pages | 2 | Separate EN content fix |

Recommendation: implement Option A (display-level mapping helper) for the 22 A-class values. Leave C-class for a future schema upgrade. Flag the 2 D-class EN em-dashes as a separate bug.

---

## 2. Unique Guide-Level Values

Values rendered in the RouteSnapshot component on each RU guide page.

| Slug | Price | Timeline | LastUpdated |
|------|-------|----------|-------------|
| employment-visa | AED 4,900 – 7,300 | 2–4 weeks | April 2025 |
| golden-visa-dubai-property | AED 9,884.75 (main applicant) | 7–10 business days | April 2026 |
| mainland-company-setup-dubai | AED 12,000–25,000+ (government fees only) | 2–4 weeks (without external approvals) | April 2026 |
| free-zone-company-setup-dubai | AED 6,000–20,000+ per year (varies by free zone and package) | 1–2 weeks (varies by free zone) | April 2026 |

**Classification:**

| Field | Value | Class | Recommended RU display |
|-------|-------|-------|------------------------|
| price | AED 4,900 – 7,300 | B | Leave as-is |
| price | AED 9,884.75 (main applicant) | C | Defer to schema redesign |
| price | AED 12,000–25,000+ (government fees only) | C | Defer to schema redesign |
| price | AED 6,000–20,000+ per year (varies by free zone and package) | C | Defer to schema redesign |
| timeline | 2–4 weeks | A | 2–4 недели |
| timeline | 7–10 business days | A | 7–10 рабочих дней |
| timeline | 2–4 weeks (without external approvals) | C | Defer to schema redesign |
| timeline | 1–2 weeks (varies by free zone) | C | Defer to schema redesign |
| lastUpdated | April 2025 | A | Апрель 2025 |
| lastUpdated | April 2026 | A | Апрель 2026 |

**Note:** `category` is already handled by the `GuideHeader` locale map (CP-22). Not listed here.

---

## 3. Unique Step-Level Values

All values rendered in StepCard on the 4 RU guide pages.

### employment-visa (8 steps)

| Step | Cost | Class | TimeEst | Class |
|------|------|-------|---------|-------|
| 1 | AED 278 | B | 2–3 days | A |
| 2 | AED 189 insurance + AED 1,285 (Cat 1/2) or AED 3,555 (Cat 3) labor fee | C | 2–3 days | A |
| 3 | AED 1,126 | B | 2–3 days | A |
| 4 | AED 676 | B | 2–3 days | A |
| 5 | AED 323 | B | 2–3 days | A |
| 6 | AED 386 | B | 2–3 days | A |
| 7 | AED 78 (skilled, via Tasheel) or AED 152 (limited skilled, via Tawjeeh) | C | 2–3 days | A |
| 8 | AED 546 | B | 2–3 days | A |

### golden-visa-dubai-property (7 steps)

| Step | Cost | Class | TimeEst | Class |
|------|------|-------|---------|-------|
| 1 | Free | A | 1–2 days | A |
| 2 | Free | A | 1–5 days | A |
| 3 | Varies (if required) | A | 2–5 days | A |
| 4 | AED 8,031.75 | B | 3–5 days | A |
| 5 | AED 700 | B | 1–2 days | A |
| 6 | AED 1,153 | B | 2–3 days (card delivery 5–10 days) | C |
| 7 | AED 5,774.50 + AED 318.75 per file | C | 2–4 weeks per person | A |

### mainland-company-setup-dubai (8 steps)

| Step | Cost | Class | TimeEst | Class |
|------|------|-------|---------|-------|
| 1 | No fee | A | 1 day | A |
| 2 | No fee at this stage | A | 1 day | A |
| 3 | AED 620–720 | B | 1–2 business days | A |
| 4 | AED 100–1,000 (varies by activity) | C | 1–3 business days | A |
| 5 | AED 220 registration fee (office rent is separate) | C | 1–2 business days after signing the lease | C |
| 6 | Varies by sector | A | Varies — 4–10+ weeks if required | D |
| 7 | AED 8,000–20,000+ (license fee varies by activity and structure) | C | 1–3 business days after submission | C |
| 8 | Included in Step 7 | A | 1–3 business days after payment | C |

### free-zone-company-setup-dubai (8 steps)

| Step | Cost | Class | TimeEst | Class |
|------|------|-------|---------|-------|
| 1 | No fee | A | 1–2 days (research) | C |
| 2 | No fee at this stage | A | 1 day | A |
| 3 | Included in license package price | A | 1 day | A |
| 4 | AED 100–500 (varies by zone; often included in the application fee) | C | 1–2 business days | A |
| 5 | Application fee: AED 500–2,000 (varies by zone; often included in package price) | C | 1–3 business days for review | C |
| 6 | AED 6,000–20,000+ (total first-year package: license + office + registration fees, varies by zone) | C | Payment processed same day | A |
| 7 | Included in Step 6 | A | 1–5 business days after payment | C |
| 8 | Varies by free zone and next step | A | Varies — bank account may take 2–6 weeks | D |

---

## 4. Visible English Values on RU Pages

All confirmed from live production HTML via curl.

| Page | Visible string | Source field | Class | Recommended fix |
|------|---------------|--------------|-------|-----------------|
| employment-visa | 2–4 weeks | guide.timeline | A | Map → "2–4 недели" |
| employment-visa | April 2025 | guide.lastUpdated | A | Map → "Апрель 2025" |
| employment-visa | 2–3 days (×8) | step.timeEst | A | Map → "2–3 дня" |
| employment-visa | AED 278, AED 1,126, etc. | step.cost | B | Leave as-is |
| employment-visa | AED 189 insurance + … | step.cost | C | Defer — too complex |
| employment-visa | AED 78 (skilled…) | step.cost | C | Defer — too complex |
| golden-visa | 7–10 business days | guide.timeline | A | Map → "7–10 рабочих дней" |
| golden-visa | April 2026 | guide.lastUpdated | A | Map → "Апрель 2026" |
| golden-visa | Free (×2) | step.cost | A | Map → "Бесплатно" |
| golden-visa | Varies (if required) | step.cost | A | Map → "По необходимости" |
| golden-visa | AED 8,031.75, AED 700, etc. | step.cost | B | Leave as-is |
| golden-visa | AED 5,774.50 + AED 318.75 per file | step.cost | C | Defer |
| golden-visa | 1–2 days, 1–5 days, etc. | step.timeEst | A | Map → "1–2 дня", "1–5 дней", etc. |
| golden-visa | 2–3 days (card delivery 5–10 days) | step.timeEst | C | Defer |
| golden-visa | 2–4 weeks per person | step.timeEst | A | Map → "2–4 недели на каждого" |
| mainland | 2–4 weeks (without external approvals) | guide.timeline | C | Defer |
| mainland | April 2026 | guide.lastUpdated | A | Map → "Апрель 2026" |
| mainland | No fee | step.cost | A | Map → "Без сборов" |
| mainland | No fee at this stage | step.cost | A | Map → "Без сборов на этом этапе" |
| mainland | AED 620–720, AED 8,000–20,000+, etc. | step.cost | B / C | Leave or defer |
| mainland | Varies by sector | step.cost | A | Map → "Зависит от сектора" |
| mainland | Included in Step 7 | step.cost | A | Map → "Включено в шаг 7" |
| mainland | 1 day (×2) | step.timeEst | A | Map → "1 день" |
| mainland | 1–2 business days (×2) | step.timeEst | A | Map → "1–2 рабочих дня" |
| mainland | 1–3 business days | step.timeEst | A | Map → "1–3 рабочих дня" |
| mainland | 1–2 business days after signing the lease | step.timeEst | C | Defer |
| mainland | **Varies — 4–10+ weeks if required** | step.timeEst | **D** | **EN em-dash bug — separate fix** |
| mainland | 1–3 business days after submission | step.timeEst | C | Defer |
| mainland | 1–3 business days after payment | step.timeEst | C | Defer |
| free-zone | 1–2 weeks (varies by free zone) | guide.timeline | C | Defer |
| free-zone | April 2026 | guide.lastUpdated | A | Map → "Апрель 2026" |
| free-zone | No fee | step.cost | A | Map → "Без сборов" |
| free-zone | No fee at this stage | step.cost | A | Map → "Без сборов на этом этапе" |
| free-zone | Included in license package price | step.cost | A | Map → "Включено в стоимость пакета" |
| free-zone | Included in Step 6 | step.cost | A | Map → "Включено в шаг 6" |
| free-zone | AED 100–500 (varies by zone…) | step.cost | C | Defer |
| free-zone | Application fee: AED 500–2,000 (…) | step.cost | C | Defer |
| free-zone | AED 6,000–20,000+ (total first-year…) | step.cost | C | Defer |
| free-zone | Varies by free zone and next step | step.cost | A | Map → "Зависит от зоны и следующего шага" |
| free-zone | 1–2 days (research) | step.timeEst | C | Defer (drop context: "1–2 дня") |
| free-zone | 1 day (×2) | step.timeEst | A | Map → "1 день" |
| free-zone | 1–2 business days | step.timeEst | A | Map → "1–2 рабочих дня" |
| free-zone | 1–3 business days for review | step.timeEst | C | Defer |
| free-zone | Payment processed same day | step.timeEst | A | Map → "Оплата в тот же день" |
| free-zone | 1–5 business days after payment | step.timeEst | C | Defer |
| free-zone | **Varies — bank account may take 2–6 weeks** | step.timeEst | **D** | **EN em-dash bug — separate fix** |

---

## 5. Proposed Display Mapping

### 5a. Safe A-class mappings (all exact-match, no risk of data loss)

These are the only values that should be mapped in the initial implementation. All are direct string lookups.

| Source value (exact) | RU display | Safe | Notes |
|----------------------|-----------|------|-------|
| `Free` | Бесплатно | Yes | golden-visa steps 1/2 |
| `No fee` | Без сборов | Yes | mainland step 1, free-zone step 1 |
| `No fee at this stage` | Без сборов на этом этапе | Yes | mainland step 2, free-zone step 2 |
| `Included in license package price` | Включено в стоимость пакета | Yes | free-zone step 3 |
| `Included in Step 6` | Включено в шаг 6 | Yes | free-zone step 7 |
| `Included in Step 7` | Включено в шаг 7 | Yes | mainland step 8 |
| `Varies (if required)` | По необходимости | Yes | golden-visa step 3 |
| `Varies by sector` | Зависит от сектора | Yes | mainland step 6 |
| `Varies by free zone and next step` | Зависит от зоны и следующего шага | Yes | free-zone step 8 |
| `Payment processed same day` | Оплата в тот же день | Yes | free-zone step 6 |
| `1 day` | 1 день | Yes | mainland steps 1/2, free-zone steps 2/3 |
| `2–3 days` | 2–3 дня | Yes | employment-visa all 8 steps |
| `1–2 days` | 1–2 дня | Yes | golden-visa steps 1/5 |
| `1–5 days` | 1–5 дней | Yes | golden-visa step 2 |
| `2–5 days` | 2–5 дней | Yes | golden-visa step 3 |
| `3–5 days` | 3–5 дней | Yes | golden-visa step 4 |
| `2–4 weeks per person` | 2–4 недели на каждого | Yes | golden-visa step 7 |
| `1–2 business days` | 1–2 рабочих дня | Yes | mainland steps 3/5, free-zone step 4 |
| `1–3 business days` | 1–3 рабочих дня | Yes | mainland step 4 |
| `7–10 business days` | 7–10 рабочих дней | Yes | also guide timeline for golden-visa |
| `2–4 weeks` | 2–4 недели | Yes | guide timeline for employment-visa, mainland |

### 5b. Month name mapping (for lastUpdated field)

All 4 current guides use "April 2025" or "April 2026". A simple month → Russian month table covers all future guides.

| Source | RU display |
|--------|-----------|
| `January YYYY` | Январь YYYY |
| `February YYYY` | Февраль YYYY |
| `March YYYY` | Март YYYY |
| `April YYYY` | Апрель YYYY |
| `May YYYY` | Май YYYY |
| `June YYYY` | Июнь YYYY |
| `July YYYY` | Июль YYYY |
| `August YYYY` | Август YYYY |
| `September YYYY` | Сентябрь YYYY |
| `October YYYY` | Октябрь YYYY |
| `November YYYY` | Ноябрь YYYY |
| `December YYYY` | Декабрь YYYY |

Month mapping uses regex replace: `/^(January|February|...) (\d{4})$/`.

### 5c. Values NOT mapped (B-class — leave as-is)

AED amounts are internationally understood and used in financial contexts worldwide. Russian speakers in Dubai know them.

- All `AED NNN` values (AED 278, AED 1,126, AED 8,031.75, etc.)
- `AED 4,900 – 7,300` (guide price, employment-visa)

### 5d. Values deferred to schema redesign (C-class)

These contain AED amounts plus meaningful English context. Translating the context alone requires string manipulation rather than simple lookup, and any mapping would be fragile if the DB value changes. Safer to add `ru_price`, `ru_timeline`, `ru_cost`, `ru_timeEst` schema columns when guide content is next redesigned.

- `AED 9,884.75 (main applicant)` — parenthetical "main applicant"
- `AED 12,000–25,000+ (government fees only)` — parenthetical qualifier
- `AED 6,000–20,000+ per year (varies by free zone and package)` — multi-word context
- `2–4 weeks (without external approvals)` — conditional
- `1–2 weeks (varies by free zone)` — conditional
- `AED 189 insurance + AED 1,285 (Cat 1/2) or AED 3,555 (Cat 3) labor fee` — conditional, abbreviations
- `AED 78 (skilled, via Tasheel) or AED 152 (limited skilled, via Tawjeeh)` — conditional, labor categories
- `AED 5,774.50 + AED 318.75 per file` — compound AED expression
- `AED 100–500 (varies by zone; often included in the application fee)` — conditional
- `Application fee: AED 500–2,000 (varies by zone; often included in package price)` — complex
- `AED 6,000–20,000+ (total first-year package: license + office + registration fees, varies by zone)` — complex description
- `AED 100–1,000 (varies by activity)` — conditional
- `AED 220 registration fee (office rent is separate)` — explanatory
- `AED 8,000–20,000+ (license fee varies by activity and structure)` — conditional
- `2–3 days (card delivery 5–10 days)` — compound time expression
- `1–2 days (research)` — context tag
- `1–3 business days for review` — purpose clause
- `1–5 business days after payment` — sequence clause
- `1–3 business days after submission` — sequence clause
- `1–3 business days after payment` — sequence clause
- `1–2 business days after signing the lease` — long sequence clause

### 5e. D-class items (EN em-dashes in timeEst fields — visible on both EN and RU pages)

These are bugs in the **English** DB content, not RU content issues. They are outside the scope of this localization step. They need a separate EN content fix.

| Guide | Step | Field | Value |
|-------|------|-------|-------|
| mainland-company-setup-dubai | 6 | timeEst | `Varies — 4–10+ weeks if required` |
| free-zone-company-setup-dubai | 8 | timeEst | `Varies — bank account may take 2–6 weeks` |

These render identically on both `/guides/mainland-company-setup-dubai` and `/ru/guides/mainland-company-setup-dubai`.

---

## 6. Recommended Implementation Plan

**Strategy: Option A — display-level mapping helper, code-only, no schema changes**

### Where the helper lives

New file: `lib/localize-value.ts`

```ts
import type { Locale } from "@/lib/db/reader";

const EXACT_MAP: Record<string, string> = {
  // cost values
  "Free":                                    "Бесплатно",
  "No fee":                                  "Без сборов",
  "No fee at this stage":                    "Без сборов на этом этапе",
  "Included in license package price":       "Включено в стоимость пакета",
  "Included in Step 6":                      "Включено в шаг 6",
  "Included in Step 7":                      "Включено в шаг 7",
  "Varies (if required)":                    "По необходимости",
  "Varies by sector":                        "Зависит от сектора",
  "Varies by free zone and next step":       "Зависит от зоны и следующего шага",
  "Payment processed same day":              "Оплата в тот же день",
  // timeEst values
  "1 day":                                   "1 день",
  "2–3 days":                                "2–3 дня",
  "1–2 days":                                "1–2 дня",
  "1–5 days":                                "1–5 дней",
  "2–5 days":                                "2–5 дней",
  "3–5 days":                                "3–5 дней",
  "2–4 weeks per person":                    "2–4 недели на каждого",
  "1–2 business days":                       "1–2 рабочих дня",
  "1–3 business days":                       "1–3 рабочих дня",
  "7–10 business days":                      "7–10 рабочих дней",
  "2–4 weeks":                               "2–4 недели",
};

const MONTHS: Record<string, string> = {
  January: "Январь", February: "Февраль", March: "Март",
  April: "Апрель", May: "Май", June: "Июнь",
  July: "Июль", August: "Август", September: "Сентябрь",
  October: "Октябрь", November: "Ноябрь", December: "Декабрь",
};

export function localizeValue(value: string, locale: Locale): string {
  if (locale === "en") return value;
  const mapped = EXACT_MAP[value];
  if (mapped) return mapped;
  // Month + year pattern for lastUpdated
  const monthMatch = value.match(/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/);
  if (monthMatch) return `${MONTHS[monthMatch[1]]} ${monthMatch[2]}`;
  return value; // safe fallback — return original if no mapping exists
}
```

### Which components use it

Applied in `app/ru/guides/[slug]/page.tsx` only:
- `localizeValue(guide.price, "ru")` → passed as `price` to RouteSnapshot
- `localizeValue(guide.timeline, "ru")` → passed as `timeline` to RouteSnapshot
- `localizeValue(guide.lastUpdated, "ru")` → passed as `lastUpdated` to RouteSnapshot
- `localizeValue(step.cost, "ru")` → passed as `cost` to each StepCard
- `localizeValue(step.timeEst, "ru")` → passed as `time` to each StepCard

RouteSnapshot, StepCard, and GuideHeader themselves do **not** call the helper — they remain pure presentational components.

The EN guide page (`app/(public)/guides/[slug]/page.tsx`) does **not** import or call the helper.

### What is not changed

- No DB changes
- No schema changes
- No changes to `lib/db/reader.ts`
- No changes to RouteSnapshot, StepCard, GuideHeader props beyond what Step 2 already added
- No changes to EN guide page
- No changes to hub pages, homepage, or routing

### Verification checklist

After implementation:

1. Build: 63 pages, 0 TypeScript errors
2. EN `/guides/employment-visa`: values unchanged (AED 4,900 – 7,300, 2–4 weeks, 2–3 days)
3. RU `/ru/guides/employment-visa`: guide timeline shows "2–4 недели", step timeEst shows "2–3 дня"
4. RU `/ru/guides/golden-visa-dubai-property`: step 1 cost shows "Бесплатно", guide timeline shows "7–10 рабочих дней"
5. RU `/ru/guides/mainland-company-setup-dubai`: step 1 cost shows "Без сборов", step 2 "Без сборов на этом этапе"
6. RU `/ru/guides/free-zone-company-setup-dubai`: step 2 cost shows "Без сборов на этом этапе", step 6 timeEst shows "Оплата в тот же день"
7. Values not in the map (AED 278, AED 189 insurance + ...) unchanged on RU pages — fallback is safe
8. C-class values (AED + English context) unchanged on RU pages — expected for this step

---

## 7. Exact Next Single Action

**Create `lib/localize-value.ts` with the mapping from Section 6 and apply it in `app/ru/guides/[slug]/page.tsx`.**

That is one file created + one file edited. No DB changes, no schema changes, no new components. Build, verify 8 checklist items, commit, deploy.

After this step, all A-class English strings will be Russian on RU pages. C-class strings (AED + English context) will remain — those require a schema-level fix deferred to a future content redesign phase.

The 2 D-class EN em-dashes (`Varies — 4–10+ weeks if required`, `Varies — bank account may take 2–6 weeks`) should be fixed as a separate EN content hygiene task, not during RU localization.

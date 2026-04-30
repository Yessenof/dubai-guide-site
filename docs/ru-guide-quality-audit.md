# RU Guide Quality Audit
**Date:** 2026-04-30
**Scope:** 4 live RU guide pages. No code or DB changes made during this audit.

---

## 1. Executive Summary

Russian guide pages have correct Russian H1, title, summary, audience, overview, and all step content fields (title, what, where, address, advice, warning). The core translation work is solid.

Two categories of defects remain:

**Category A — UI labels hardcoded in English (code fix required)**
12 labels in `RouteSnapshot.tsx` and `StepCard.tsx` and the category pill in `GuideHeader.tsx` have no locale prop. Every RU guide page displays English labels alongside Russian content.

**Category B — DB values with no RU equivalents (schema + content fix required)**
6 field values — `price`, `timeline`, `lastUpdated` (guide level) and `cost`, `timeEst` (step level) and `category` — have no `ru_*` columns. Values display in English regardless of locale.

**Category C — Em-dash contamination in production DB (script + DB fix required)**
The `free-zone-company-setup-dubai` guide has em-dashes in at least 4 step fields in the production DB. The script file `scripts/add-ru-free-zone-company-setup.ts` was never updated after the local DB patch — it still contains em-dashes in source. Any re-run on a fresh DB would reintroduce them.

---

## 2. UI Label Inventory

### 2a. RouteSnapshot.tsx — 6 hardcoded labels

No `locale` prop exists on this component. Source: `components/RouteSnapshot.tsx`.

| Line | Current (EN) | Expected (RU) |
|------|-------------|---------------|
| 43 | `Gov. fee` | `Гос. сбор` |
| 47 | `Timeline` | `Срок` |
| 53 | `For` | `Для кого` |
| 57 | `Steps` | `Шагов` |
| 64 | `Start` | `Первый шаг` |
| 71 | `Last updated: ` | `Обновлено: ` |

### 2b. StepCard.tsx — 6 hardcoded labels

No `locale` prop exists on this component. Source: `components/StepCard.tsx`.

| Line | Current (EN) | Expected (RU) |
|------|-------------|---------------|
| 46 | `Where to go` | `Куда обращаться` |
| 50 | `Address / portal` | `Адрес / портал` |
| 58 | `Est. cost` | `Ориент. стоимость` |
| 62 | `Est. time` | `Ориент. срок` |
| 69 | `Advice` | `Совет` |
| 76 | `Note` | `Внимание` |

### 2c. GuideHeader.tsx — category pill

Source: `components/GuideHeader.tsx`, line 24.

```tsx
{category.replace(/-/g, " ")}
```

Renders raw DB slug: `"visas"`, `"company-setup"` → `"company setup"`, `"government"`. No locale mapping. Expected RU values:

| DB value | EN display | Expected RU display |
|----------|-----------|---------------------|
| `visas` | Visas | Визы |
| `company-setup` | Company Setup | Регистрация компании |
| `government` | Government | Государственные услуги |
| `hiring` | Hiring | Найм персонала |
| `living` | Living | Проживание |

### 2d. Page-level text already in Russian (no action needed)

These are hardcoded directly in `app/ru/guides/[slug]/page.tsx` and are already correct:

- `← Все гайды` (line 55)
- `Найти маршрут →` (line 62), `Найти маршрут` (line 89)
- `Спросить эксперта` (line 97)
- `Читать полное руководство ↓` (line 118)
- `Пошагово` (line 127)
- `Обзор` (line 149)
- `Нужна помощь?` (line 162)
- `Написать в WhatsApp →` (line 170)

---

## 3. Schema Gaps

Fields that appear on every guide page but have no `ru_*` column in the DB. Source: `lib/db/reader.ts` — these are passed through from the schema without locale resolution.

### 3a. Guide-level fields

| Field | DB column | Reader line | Component | Label shown | Example EN value |
|-------|-----------|-------------|-----------|-------------|-----------------|
| `price` | `guides.price` | 44 | RouteSnapshot | Gov. fee | `AED 4,900–7,300` |
| `timeline` | `guides.timeline` | 45 | RouteSnapshot | Timeline | `2–4 weeks` |
| `lastUpdated` | `guides.lastUpdated` | 46 | RouteSnapshot | Last updated | `April 2025` |
| `category` | `guides.category` | 43 | GuideHeader | Category pill | `visas` |

### 3b. Step-level fields

| Field | DB column | Reader line | Component | Label shown | Example EN value |
|-------|-----------|-------------|-----------|-------------|-----------------|
| `cost` | `steps.cost` | 32 | StepCard | Est. cost | `AED 278` |
| `timeEst` | `steps.timeEst` | 33 | StepCard | Est. time | `2–3 days` |

### 3c. Schema gap options

Three approaches, in order of complexity:

1. **Display-level mapping (recommended for `category` and `lastUpdated`)** — translate common known values at render time, no schema change. E.g., map `"visas"` → `"Визы"` in a locale dictionary.

2. **Content-level rewrite (recommended for `price`, `timeline`, `cost`, `timeEst`)** — rewrite EN values to be language-neutral where possible. `"AED 4,900–7,300"` needs no translation; `"2–4 weeks"` → `"2–4 нед."` does. Low-complexity DB patch per guide.

3. **Add `ru_*` schema columns** — full solution, highest complexity. Requires migration + admin form update + RU content fill for all 15 guides. Overkill until all EN content is complete.

**Recommendation:** Use display-level mapping for category and date labels (option 1); rewrite time/duration values to avoid pure English words (option 2). Defer schema addition (option 3).

---

## 4. Em-Dash Audit

### Rule
Zero em-dashes (`—`) in any RU content field. Applies to all `ru_*` columns in both `guides` and `steps` tables.

### Status by guide

| Guide | Em-dashes in DB | Em-dashes in script file |
|-------|----------------|--------------------------|
| `employment-visa` | 0 (verified) | 0 (script clean) |
| `golden-visa-dubai-property` | 0 (verified) | 0 (script clean) |
| `mainland-company-setup-dubai` | 0 (verified) | 0 (script clean) |
| `free-zone-company-setup-dubai` | **YES — production DB** | **YES — script file** |

### free-zone em-dash locations (script file `scripts/add-ru-free-zone-company-setup.ts`)

Em-dashes present in these locations in the script source:

| Step | Field | Offending text |
|------|-------|----------------|
| 1 | `ru_advice` | `"JAFZA — для логистики и импорта/экспорта."` |
| 2 | `ru_what` | `"отличается в каждой зоне — убедитесь"` |
| overview | `ru_overview` | 1 em-dash in para 1 (confirmed in earlier session) |

**Production consequence:** All 3 em-dashes are live in the production DB and visible to users. The local DB patch from the previous session fixed the local DB only. The script file retains the em-dashes, meaning any re-run (e.g., on a fresh restore) would reintroduce them.

**Fix required:** (a) Update script file with em-dash-free text; (b) patch production DB directly via SSH. Both must be done together.

---

## 5. Per-Guide RU Content Assessment

### 5a. employment-visa

**RU title:** (from DB — not captured in audit; source script: `scripts/add-ru-employment-visa.ts`)
**SEO target keywords:** рабочая виза Дубай, рабочая виза ОАЭ без выезда, виза сотрудника ОАЭ

**Content state:**
- Guide-level: ru_title, ru_summary, ru_audience, ru_overview all populated ✓
- Steps: 8/8 ru_* fields populated ✓
- Em-dashes: 0 ✓

**Production visible (from live page):**
- Russian H1 ✓
- Russian step titles ✓
- "For" cell shows Russian audience text ✓
- "Start" cell shows Russian step 1 what text ✓
- "Gov. fee: AED 4,900–7,300" — EN label, bilingual-neutral value ✓ (AED is universal)
- "Timeline: 2–4 weeks" — EN label + EN duration text ✗ (needs display mapping)
- Step cost "AED 278" — neutral ✓; "AED 189 insurance + AED 1,285…" — EN label ✗
- Step time "2–3 days" — EN ✗ (needs display mapping)

**SEO assessment:** Strong. Title is specific to process type and entry condition. Summary covers service centers and fee range. Slug `employment-visa` is EN-only but all traffic routes through `/ru/guides/employment-visa` correctly. Hreflang active ✓.

**Score: 4/5** — deduction for step time/duration values in English.

---

### 5b. golden-visa-dubai-property

**SEO target keywords:** золотая виза Дубай недвижимость, золотая виза ОАЭ через недвижимость

**Content state:**
- Guide-level: all ru_* fields populated ✓
- Steps: 7/7 ru_* fields populated ✓
- Em-dashes: 0 ✓

**Production visible:**
- Russian H1 ✓, Russian step titles ✓
- "Gov. fee: Free" — "Free" is English; ideally "Без сборов" for RU context
- "Timeline: Varies (if required)" — English; should be Russian
- "visas" category (English)
- Step costs "No fee" (English), step times "1–2 days", "1–5 days" (English)

**SEO assessment:** Good. "Золотая виза" is the universal Russian search term. Property-based qualifier is correct. Risk: no `ru_*` for `price` and `timeline` means these fields show English text; less critical for golden visa since cost is non-specific. Hreflang active ✓.

**Score: 3.5/5** — deductions for English "Free", "Varies", all step durations in English.

---

### 5c. mainland-company-setup-dubai

**SEO target keywords:** регистрация компании на материке Дубай, мейнленд компания ОАЭ, открыть бизнес Дубай

**Content state:**
- Guide-level: all ru_* fields populated ✓
- Steps: 8/8 ru_* fields populated ✓
- Em-dashes: 0 ✓

**Production visible:**
- Russian H1 ✓, Russian step titles ✓
- "company setup" category (English — renders as "company setup" not "company-setup")
- "No fee" cost values per step (English)
- "1 day", "1–2 days" step time values (English)
- "No fee at this stage" (English)

**SEO assessment:** Good. "Mainland" is borrowed into Russian usage but "на материке" is also searched. The guide covers DED/DET licencing flow which is the primary search intent. Hreflang active ✓.

**Score: 3.5/5** — deductions for category and step time/cost in English.

---

### 5d. free-zone-company-setup-dubai

**SEO target keywords:** компания в фри зоне Дубай, free zone компания ОАЭ, регистрация компании free zone

**Content state:**
- Guide-level: all ru_* fields populated ✓
- Steps: 8/8 ru_* fields populated ✓
- Em-dashes: **3+ in production DB** ✗ (CRITICAL)

**Production visible:**
- Russian H1 ✓, Russian step titles ✓
- Em-dashes visible in rendered text (Step 1 ru_advice, Step 2 ru_what, overview)
- "company setup" category (English)
- "No fee", "1–2 days (research)", "1 day" (English)

**SEO assessment:** Title "Открыть компанию в free zone в Дубае: лицензия, визы и банковский счёт" is strong — covers the full intent cluster. Summary covers zone selection risk and cost range (AED 6k–20k+). Key entities present: IFZA, DMCC, JAFZA, RAKEZ, flexi desk, establishment card, trade license, VAT, corporate tax. Hreflang active ✓.

**Score: 3/5** — em-dash violation reduces score significantly; English step data is the same issue as other guides.

---

## 6. Web App Hub Compatibility

The 4 guides are linked from the following RU hub pages:

| Hub page | Links to | Status |
|----------|----------|--------|
| `/ru/visas` | employment-visa, golden-visa-dubai-property, and others | Guide cards show RU titles ✓ |
| `/ru/company-setup` | mainland-company-setup-dubai, free-zone-company-setup-dubai, open-business-bank-account-dubai | Guide cards show RU titles ✓ |
| `/ru` (homepage) | Hub cards only, no direct guide links | No issue |

Hub pages use `getAllPublishedGuides("ru")` which correctly resolves `ru_title` and `ru_summary` via the `pick()` helper. No defects at hub level for the 4 completed guides.

`open-business-bank-account-dubai` appears in the `/ru/company-setup` hub card list but has no RU content yet — it falls back to EN title and summary. This is expected behavior, not a bug.

---

## 7. Recommended Fix Plan

In priority order:

### Step 1 — Fix em-dashes in free-zone script and production DB [CRITICAL, do first]

- Update `scripts/add-ru-free-zone-company-setup.ts`: replace all `—` with commas or restructured sentences in Step 1 ru_advice, Step 2 ru_what, and ru_overview
- SSH to production server, run targeted UPDATE SQL to patch the 3 affected fields directly
- Verify 0 em-dashes on production `/ru/guides/free-zone-company-setup-dubai`
- Commit updated script file

### Step 2 — Localize UI labels in RouteSnapshot and StepCard

- Add `locale?: "en" | "ru"` prop to `components/RouteSnapshot.tsx` and `components/StepCard.tsx`
- Add label dictionaries (12 labels total across both components)
- Add category translation map in `components/GuideHeader.tsx`
- Pass `locale="ru"` from `app/ru/guides/[slug]/page.tsx` to all three components
- Test all 4 live RU guides

No DB changes. No schema changes. Build and deploy.

### Step 3 — Handle English DB values for time/duration fields

- Identify all unique values in `steps.timeEst` and `steps.cost` that contain pure English words (not AED amounts): "1 day", "2–3 days", "No fee", "Varies", etc.
- Decision: either rewrite EN values to be neutral (e.g. "1–2 дн." in Russian) or add display-level mapping for known values
- Do not add schema columns unless the list of unique values is too large to map

### Step 4 — Handle `price` and `timeline` guide-level values

- Same approach as Step 3 but at guide level
- These are fewer rows (15 guides) and values are more varied
- Preferred: rewrite EN duration/timeline values to avoid pure English words

### Step 5 — Continue RU content population for remaining 5 guides

Priority order per `docs/ru-launch-plan.md`:
1. `open-business-bank-account-dubai`
2. `newborn-visa-dubai`
3. `document-attestation-dubai`
4. `amer-center-dubai`
5. `pro-services-dubai`

Steps 1–2 should be completed before adding more RU content, so new guides benefit from localized labels from the start.

---

## 8. Files Referenced

| File | Role |
|------|------|
| `components/RouteSnapshot.tsx` | 6 English labels — no locale prop |
| `components/StepCard.tsx` | 6 English labels — no locale prop |
| `components/GuideHeader.tsx` | Category pill — no locale mapping |
| `app/ru/guides/[slug]/page.tsx` | Passes no locale to RouteSnapshot/StepCard |
| `lib/db/reader.ts` | `price`, `timeline`, `lastUpdated`, `category`, `cost`, `timeEst` not locale-resolved |
| `scripts/add-ru-free-zone-company-setup.ts` | Contains em-dashes in source — script file not updated after local DB patch |

# Source Note UI Plan — Guidex

## Purpose

Defines how source notes should appear on each priority page group.
UI implementation is deferred to Phase 6C-99G-B.
This document is the design spec and audit input for that phase.

---

## UI Component Spec (for 99G-B)

### SourceNote component

```tsx
// Proposed signature — not yet built
interface SourceNoteProps {
  note: string              // visible_note_en or visible_note_ru
  status: "confirmed" | "provisional"
  sourceLabel: string       // e.g. "GDRFA Dubai", "GITEX Global"
  lastChecked: string       // formatted: "Checked May 2026"
  variant?: "inline" | "footer"  // default: footer
}
```

### Visual treatment

**Confirmed source:**
```
● Based on GDRFA official guidance · Checked May 2026
```
- Color: `text-gray-400`
- Font: `text-[11px]`
- Dot: filled circle, `text-gray-400`

**Provisional source (Islamic dates / unconfirmed):**
```
◐ Expected holiday. Date subject to official FAHR moon-sighting announcement.
  Last checked: Jun 2026
```
- Background: amber tint (consistent with existing amber box on calendar pages)
- Color: `text-amber-700`
- Font: `text-[12px]`

### Placement rule

| Page type | Primary placement | Fallback placement |
|---|---|---|
| Guide pages | After the first step or fee mention | Page footer, above CTA |
| Hub pages | Below the page intro / below first card grid | Bottom of page |
| News posts | Below the publication date | Bottom of article |
| Event pages | Near the dates section | Bottom of page |
| Calendar pages | Per-entry (already implemented via Islamic disclaimer) | N/a |

### What NOT to do in UI

- Do not show raw URLs in user-facing text
- Do not stack more than 2 source notes in one visible block
- Do not add a source note to every paragraph — one per content block at most
- Do not use the word "disclaimer"
- Do not make it the most prominent element on the page

---

## Audit: Priority Page Groups

---

### 1. /visas/family + /ru/visas/family

**Current state:** Page live, no source note, no visible trust signal.
**Risk level:** HIGH — describes legal visa eligibility and required documents.

| Field | Value |
|---|---|
| Required source type | `official` |
| Authority | ICA (Federal), GDRFA Dubai (emirate-level) |
| Status | `confirmed` — procedures are published |
| Next recheck | 2026-12-01 |

**Suggested visible note EN:**
> Based on ICA and GDRFA official guidelines. Eligibility requirements and document lists may be updated. Check with a registered PRO or GDRFA before applying.

**Suggested visible note RU:**
> Информация основана на официальных правилах ICA и GDRFA. Требования к документам могут изменяться. Уточняйте актуальные условия у PRO или в GDRFA перед подачей.

**Implement in 99G-B:** Yes — HIGH priority.

---

### 2. /visas/golden + /ru/visas/golden

**Current state:** Page live, no source note, no visible trust signal.
**Risk level:** HIGH — AED 2M property threshold, eligibility categories, Golden Card process.

| Field | Value |
|---|---|
| Required source type | `official` |
| Authority | ICA, GDRFA, DLD |
| Status | `confirmed` — thresholds published |
| Next recheck | 2026-12-01 |

**Suggested visible note EN:**
> Golden Visa routes and thresholds based on ICA and GDRFA official guidelines. Investment categories and minimum values are periodically reviewed.

**Suggested visible note RU:**
> Маршруты и пороговые значения Golden Visa основаны на официальных данных ICA и GDRFA. Инвестиционные категории и минимальные суммы периодически пересматриваются.

**Implement in 99G-B:** Yes — HIGH priority.

---

### 3. Tax Residency Certificate — EN + RU custom pages

**Current state:** Custom-layout pages live, no source note.
**Risk level:** HIGH — FTA eligibility rules, EmaraTax process, applicant categories (individual, company, investor).

| Field | Value |
|---|---|
| Required source type | `official` |
| Authority | FTA (Federal Tax Authority) |
| Status | `confirmed` — FTA has published TRC guidance |
| Next recheck | 2026-12-01 |

**Suggested visible note EN:**
> TRC eligibility and process based on FTA official guidelines via EmaraTax. Requirements differ by applicant type and residency route.

**Suggested visible note RU:**
> Условия и процедура получения TRC основаны на официальных правилах FTA через EmaraTax. Требования зависят от типа заявителя и основания резидентства.

**Placement:** After the "Why Guidex for TRC" section, before steps.
**Implement in 99G-B:** Yes — HIGH priority.

---

### 4. Open Business Bank Account — /guides/open-business-bank-account-dubai

**Current state:** Standard guide template, no source note.
**Risk level:** MEDIUM-HIGH — account types, CBUAE regulations, bank-specific requirements.

| Field | Value |
|---|---|
| Required source type | `official` for CBUAE rules; `media_signal` acceptable for bank-specific tips |
| Authority | CBUAE (Central Bank of UAE) |
| Status | `confirmed` for regulatory framework; bank-specific details may vary |
| Next recheck | 2026-12-01 |

**Suggested visible note EN:**
> Account opening requirements vary by bank and business type. Regulatory framework based on CBUAE guidelines.

**Suggested visible note RU:**
> Требования к открытию счёта зависят от банка и типа компании. Регуляторная база — в соответствии с правилами CBUAE.

**Implement in 99G-B:** Yes — MEDIUM priority.

---

### 5. Golden Visa Property Guide — /guides/golden-visa-dubai-property

**Current state:** Standard guide template, no source note.
**Risk level:** HIGH — AED 2M threshold, DLD registration, ICA eligibility.

| Field | Value |
|---|---|
| Required source type | `official` |
| Authority | ICA, GDRFA, DLD |
| Status | `confirmed` |
| Next recheck | 2026-12-01 |

**Suggested visible note EN:**
> Property route eligibility and DLD requirements based on ICA and GDRFA official guidance. Minimum property value thresholds may be revised.

**Suggested visible note RU:**
> Требования к имущественному маршруту и процедуры DLD основаны на официальных данных ICA и GDRFA. Минимальная стоимость недвижимости может пересматриваться.

**Implement in 99G-B:** Yes — HIGH priority.

---

### 6. Mainland Company Setup — /guides/mainland-company-setup-dubai

**Current state:** Standard guide template, no source note.
**Risk level:** HIGH — DED fees, trade name rules, Ejari, regulated sector approvals.

| Field | Value |
|---|---|
| Required source type | `official` |
| Authority | DED (Department of Economic Development), Dubai Economy |
| Status | `confirmed` — standard process documented |
| Next recheck | 2026-12-01 |

**Suggested visible note EN:**
> Company formation process based on DED (Dubai Economy) official procedures. Regulated activities require additional approvals not covered in this guide.

**Suggested visible note RU:**
> Процедура регистрации компании основана на официальных требованиях DED (Dubai Economy). Для лицензируемых видов деятельности требуются дополнительные согласования.

**Implement in 99G-B:** Yes — HIGH priority.

---

### 7. GITEX Global 2026 — /events/gitex-global-2026

**Current state:** Event page live with Event JSON-LD schema. No visible source note.
**Risk level:** MEDIUM — event dates and venue confirmed; programme may change.

| Field | Value |
|---|---|
| Required source type | `organizer` |
| Authority | GITEX Global (event organizer) |
| Status | `confirmed` — dates and venue published |
| Next recheck | 2026-09-01 |

**Suggested visible note EN:**
> Event dates and venue sourced from GITEX Global. Programme details and keynote speakers are subject to change.

**Suggested visible note RU:**
> Даты и площадка получены с официального сайта GITEX Global. Программа и список спикеров могут меняться.

**Implement in 99G-B:** Yes — MEDIUM priority.

---

### 8. Formula 1 Abu Dhabi GP 2026 (if/when live)

**Current state:** Not confirmed live — check `/events/` for current slug.
**Risk level:** MEDIUM — F1 race dates, venue, ticket info.

| Field | Value |
|---|---|
| Required source type | `organizer` |
| Authority | Formula 1 (fia.com / formula1.com), Yas Marina Circuit |
| Status | `provisional` until official calendar published by FIA |
| Next recheck | When FIA publishes 2026 calendar |

**Suggested visible note EN:**
> Race dates sourced from Formula 1 official calendar. Subject to FIA confirmation.

**Suggested visible note RU:**
> Даты гонки получены с официального календаря Formula 1. Требуют подтверждения FIA.

**Implement in 99G-B:** Only after confirming the event page exists and is published.

---

### 9. Hijri New Year / Mawlid 1448 / Islamic holiday content

**Current state:**
- Hijri New Year news post: CONFIRMED (source: Gulf News + MoHRE citing FAHR)
- August 2026 calendar — Mawlid AUG-NEW-02: PROVISIONAL (source: publicholidays.ae projection)
- Islamic amber box already renders on August calendar page

**Risk level:** HIGH — public holiday dates directly affect work, travel, finance decisions.

| Field | Hijri New Year | Mawlid 1448 |
|---|---|---|
| Source type | `social_signal` (UAE Media Office) + `media_signal` | `internal_verification` |
| Status | `confirmed` | `provisional` |
| Visible note needed | Minimal — confirmed | Yes — amber box already present |
| Next recheck | n/a | 2026-07-26 (FAHR watch) |

**Hijri New Year source note (already confirmed — minimal note OK):**
EN: "Public holiday confirmed by FAHR and MoHRE."
RU: "Официальный выходной день подтверждён FAHR и MoHRE."

**Mawlid 1448 source note (already showing amber box — verify wording matches):**
EN: "Expected public holiday. Date subject to official FAHR/MoHRE moon-sighting announcement."
RU: "Ожидаемый выходной день. Точная дата подтверждается FAHR/MoHRE после наблюдения луны."

**Implement in 99G-B:** Islamic amber box already live. Audit existing wording for compliance with these standards. Hijri New Year news post may benefit from a small confirmed-source note near publication date.

---

### 10. /life-setup + /ru/life-setup

**Current state:** Hub pages live, BreadcrumbList added in 6C-99F. No source notes.
**Risk level:** MEDIUM — general life setup guidance, links to sub-guides. Less claim-dense than visa/tax pages.

| Field | Value |
|---|---|
| Required source type | Varies by section — government procedures need `official`; general tips are `low` risk |
| Authority | Varies: GDRFA, KHDA, DEWA, DLD, CBUAE |
| Status | Most content: `confirmed` general knowledge |
| Next recheck | 12 months for general content |

**Suggested visible note EN (hub-level, general):**
> This guide covers general residency and life setup steps in Dubai. Requirements for specific procedures may change — verify with the relevant government authority before acting.

**Suggested visible note RU:**
> Гайд охватывает основные шаги по переезду и обустройству жизни в Дубае. Требования к конкретным процедурам могут меняться — уточняйте в соответствующих государственных органах.

**Implement in 99G-B:** LOW-MEDIUM priority. General hub note at bottom of page is sufficient. Specific sub-guide pages (DEWA setup, school enrollment, etc.) need individual notes when built.

---

## 99G-B Implementation Scope (Recommended)

### Build first

1. `SourceNote` component — confirmed + provisional variants
2. Source note on `/visas/family` and `/ru/visas/family`
3. Source note on `/visas/golden` and `/ru/visas/golden`
4. Source note on TRC custom pages EN + RU
5. Source note on `/guides/golden-visa-dubai-property`
6. Source note on `/guides/mainland-company-setup-dubai`

### Build second

7. Source note on `/guides/open-business-bank-account-dubai`
8. Source note on GITEX event page
9. Hub-level note on `/life-setup` and `/ru/life-setup`

### Defer to later phase

- Per-guide source notes for remaining 10 guides (employment-visa, document-attestation, etc.)
- F1 Abu Dhabi GP (confirm page exists first)
- News post source notes (Hijri New Year, Emiratisation deadline, etc.)
- Offer/deal content source note + expiry logic (no offer pages exist yet)

---

## What NOT to Do in 99G-B

- Do not add source notes to every single guide in one pass — start with the 6 high-risk groups above
- Do not change JSON-LD schemas — that is separate from visible notes
- Do not add source notes to admin pages
- Do not create a DB table for source notes yet — static config in component props is sufficient for 99G-B
- Do not implement auto-recheck scheduling — manual cadence is fine for now

---

## Version

UI Plan version: 1.0 | Created: 2026-06-11 | Phase: 6C-99G-A

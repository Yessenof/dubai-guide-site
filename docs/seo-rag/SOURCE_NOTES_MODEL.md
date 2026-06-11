# Source Notes Model — Guidex

## Purpose

Defines the canonical structure for source notes across all Guidex content types.
Every piece of published content that makes factual, procedural, legal, financial, or date-sensitive claims
must have at least one source note attached or an explicit waiver explaining why one is not needed.

This model is the single source of truth for:
- what counts as a valid source
- what fields a source note must have
- how content trust is assessed before publishing
- what triggers a re-check cycle

---

## Source Note Fields

| Field | Type | Required | Values / Notes |
|---|---|---|---|
| `source_name` | string | yes | Human-readable name. E.g. "Federal Tax Authority", "GITEX Global official site" |
| `source_url` | string | yes (where available) | Official URL. Empty string if print-only or unavailable. |
| `source_type` | enum | yes | See Source Types below |
| `authority_type` | enum | yes | See Authority Types below |
| `last_checked` | ISO date | yes | Date the URL was verified to exist and contain the cited claim |
| `status` | enum | yes | See Status Values below |
| `applies_to` | enum[] | yes | See Content Targets below |
| `risk_level` | enum | yes | `low` / `medium` / `high` — see Risk Rules below |
| `visible_note_en` | string | yes (for high-risk) | Short, factual sentence shown to users in EN. ≤ 30 words. |
| `visible_note_ru` | string | yes (for high-risk) | RU equivalent. Natural editorial Russian. Not a literal translation. |
| `blocked_claims` | string[] | no | Claims that must NOT appear without upgrading this source to a stronger type |
| `verification_notes` | string | no | Internal notes. Not visible to users. |
| `next_recheck_date` | ISO date | no | Required for Islamic dates, holiday claims, regulatory deadlines, and event details |

---

## Source Types

| Value | Meaning | Trust level |
|---|---|---|
| `official` | Directly from the issuing government body, regulator, or event organizer's own domain | Highest |
| `organizer` | From the event organizer's official website, press release, or verified social channel | High |
| `media_signal` | Reputable media outlet citing or quoting an official source | Medium — signal only |
| `social_signal` | Official social channel (UAE Media Office, verified government account) | Medium — signal only |
| `pdf` | Official PDF from government site or event organizer | High if from official domain; medium if sourced elsewhere |
| `internal_verification` | Cross-referenced across multiple media_signal sources with consistent data | Low — use only to bridge while seeking official source |

### Source type escalation rule

`media_signal`, `social_signal`, and `internal_verification` sources **may only be used** to:
- Seed content as `provisional`
- Confirm an already-published `official` claim has not been retracted

They may **never** be the sole source for a `confirmed` status claim about:
visa rules, tax rates, fines, government fees, Islamic dates, public holidays, deadlines, employment rules, rental/property regulations.

---

## Authority Types

| Value | Meaning | Examples |
|---|---|---|
| `government` | UAE or GCC federal or emirate-level government body | GDRFA, ICA, MOHRE, MoHAP, DLD, DET, CBUAE, Dubai Municipality |
| `regulator` | Licensing or enforcement body | FTA, DED, DHA, KHDA, CAA, SCA |
| `event_organizer` | Company or entity running the event | GITEX organizers, Yas Marina Circuit, Dubai Calendar |
| `venue` | Physical venue or facility | Expo Centre Sharjah, DWTC, Yas Island |
| `company` | Private company publishing official product/service info | Property developer, bank, airline |
| `media` | News outlet | Gulf News, Khaleej Times, The National, Arabian Business |
| `internal` | Guidex editorial judgment or cross-reference | Used only for `internal_verification` source type |

---

## Status Values

| Value | Meaning | Required for publishing |
|---|---|---|
| `confirmed` | Verified from an official source with a working URL and matching claim | Yes, for high-risk claims |
| `provisional` | Sourced from media/social signal; official confirmation not yet found | Allowed with visible note |
| `pending` | Source found but not yet verified (URL checked but claim not read carefully) | NOT publishable as factual claim |
| `historical` | Source was valid; content describes past facts | OK for past-tense content; must be clearly framed as past |
| `expired` | Deadline or validity period has passed | Must be archived or noindexed; never presented as current |

---

## Content Targets

| Value | Applies to |
|---|---|
| `guide` | Guide pages (`/guides/[slug]`) — all 17 current guides |
| `news` | News posts (`/news/[slug]`) |
| `event` | Event pages (`/events/[slug]`) |
| `calendar` | Calendar month pages and calendar detail entries |
| `life_setup` | `/life-setup` hub and sub-sections |
| `visa_hub` | `/visas`, `/visas/family`, `/visas/golden` and RU equivalents |
| `custom_page` | TRC, Open Business Bank Account, and other custom-layout guide pages |

---

## Risk Levels

| Level | Triggers | Required source type | Visible note required |
|---|---|---|---|
| `high` | Visa eligibility, tax rates, fines, government fees, Islamic dates, public holiday dates, employment rules, rental/property regulations, FTA/MOHRE/ICA procedures, financial deadlines | `official` | Yes |
| `medium` | Event dates, event tickets, event programme, company setup steps that don't involve fees, general lifestyle guides | `organizer` or `official` | Recommended |
| `low` | General knowledge (Dubai geography, culture, timezone), expired past facts, generic process overviews with no fee/deadline claims | Any | No |

---

## Blocked Claims Rule

`blocked_claims` is an optional array of claim patterns that must NOT appear in content using this source.

Example:
```yaml
source_type: media_signal
blocked_claims:
  - "The fee is AED [X]"
  - "Applications are processed in [X] days"
  - "The visa costs [X]"
```

If a content page uses a `media_signal` source but contains fee or timeline claims, those claims must either:
1. Be removed, or
2. Have an additional `official` source note attached for that specific claim

---

## Next Recheck Dates — Required Cases

A `next_recheck_date` is **mandatory** for:

| Situation | Suggested recheck interval |
|---|---|
| Islamic holiday (provisional) | After FAHR/MoHRE official announcement, or 30 days before expected date |
| Public holiday (confirmed) | 6 months |
| Government fee or tax rate | 6 months or upon any budget/regulatory announcement |
| Visa rule or eligibility | 6 months |
| Event dates (upcoming) | 30 days before event |
| Regulatory deadline | 30 days before deadline |
| Expired/historical content | n/a — mark as `expired` or `historical`, no recheck needed |

---

## Example: Mawlid 1448 (August 2026)

```
source_name: FAHR (Federal Authority for Government Human Resources)
source_url: (pending — not yet published)
source_type: internal_verification
authority_type: government
last_checked: 2026-06-09
status: provisional
applies_to: [calendar]
risk_level: high
visible_note_en: "Expected public holiday. Date subject to official FAHR/MoHRE moon-sighting announcement."
visible_note_ru: "Ожидаемый выходной день. Точная дата подтверждается FAHR/MoHRE после наблюдения луны."
next_recheck_date: 2026-07-26
verification_notes: "Seeded from publicholidays.ae projection. FAHR has not yet published official 2026 Mawlid date."
```

---

## Example: GITEX Global 2026

```
source_name: GITEX Global official website
source_url: https://www.gitex.com
source_type: organizer
authority_type: event_organizer
last_checked: 2026-06-10
status: confirmed
applies_to: [event]
risk_level: medium
visible_note_en: "Event dates and details sourced from GITEX Global. Programme subject to change."
visible_note_ru: "Даты и информация получены с официального сайта GITEX Global. Программа может меняться."
next_recheck_date: 2026-09-01
```

---

## Example: Dubai Golden Visa (property route)

```
source_name: GDRFA Dubai
source_url: https://gdrfa.gov.ae
source_type: official
authority_type: government
last_checked: 2026-05-01
status: confirmed
applies_to: [guide, visa_hub]
risk_level: high
visible_note_en: "Visa eligibility and requirements based on GDRFA and ICA official guidelines. Thresholds and categories may be updated."
visible_note_ru: "Требования и маршруты соответствуют официальным правилам GDRFA и ICA. Пороговые значения и категории могут обновляться."
next_recheck_date: 2026-11-01
```

---

## Version

Model version: 1.0 | Created: 2026-06-11 | Phase: 6C-99G-A

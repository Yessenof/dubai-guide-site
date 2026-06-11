# Content Trust Rules — Guidex

## Purpose

These rules govern what may be published on Guidex, in what form, and with what source backing.
They apply to all content types: guides, news, events, calendar items, hub pages, and custom pages.

Rules are written to protect users from acting on outdated or unofficial information,
and to protect Guidex from serving low-trust content to Google, AI Overviews, and RAG systems.

---

## Rule 1 — Official Source Required for High-Risk Claims

Before publishing any claim about the following topics, an `official` source (government, regulator, or event organizer) must be identified, the URL must be checked, and the content must match what the source actually says.

**Topics requiring official source:**
- Visa eligibility, categories, quotas, and required documents
- Tax rates, registration thresholds, VAT rules, corporate tax
- Fines and penalties (MOHRE, DED, FTA, GDRFA)
- Government fees (DLD, GDRFA, ICA, FTA, AMER, Tasheel)
- Islamic holiday dates (Eid, Mawlid, Isra Wal Miraj)
- Public holiday dates (all UAE-wide and emirate-level)
- Government procedures (visa application steps, trade license steps, residency)
- Regulatory deadlines (e-invoicing, corporate tax filing, Emiratisation quotas)
- Employment and labour law rules (MOHRE, DIFC, ADGM)
- Property and rental regulations (DLD, RERA, Ejari)

**If no official source is available:**
- Status must be set to `provisional`
- A visible note must be shown to users
- The content must not assert the claim as settled fact
- `next_recheck_date` must be set

---

## Rule 2 — Media and Social Sources Are Signals Only

Media outlets, Telegram channels, screenshots, and social posts are **research signals**, not sources of record.

They may be used to:
- Identify that a claim exists and is circulating
- Indicate that an official announcement has been made (triggering a search for the primary source)
- Confirm that an already-verified official claim has not been retracted

They must **never** be the sole source for:
- Fee amounts
- Timeline or processing durations
- Visa rules
- Tax rules
- Public holiday dates
- Government procedure steps
- Fine amounts

**PDF rule:** A PDF is only as trustworthy as its domain. A PDF from `gdrfa.gov.ae` is an official source. A PDF shared in a Telegram group or hosted on a third-party site is a media_signal at best.

---

## Rule 3 — Islamic Holidays: Status Must Be Explicit

Islamic holiday content must always show:
1. The current confirmation status: `confirmed` or `provisional`
2. The official source (FAHR, MoHRE, UAE Media Office) — or a note that it is not yet published
3. The last-checked date
4. No language suggesting certainty before FAHR/MoHRE announces

**Banned phrases when status is `provisional`:**
- "The holiday is on [date]"
- "UAE government has announced [date]"
- "The public holiday falls on [date]"
- Any phrasing that presents the date as a settled fact

**Required phrasing when status is `provisional`:**
- EN: "Expected on [date]. Subject to official moon-sighting announcement."
- RU: "Ожидается [дата]. Точная дата зависит от официального объявления FAHR/MoHRE."

**Confirmation trigger:** When FAHR or MoHRE publishes an official circular or social post:
- Status upgrades from `provisional` → `confirmed`
- Source URL must be added
- visible_note must be updated
- next_recheck_date removed or pushed to 12 months out

---

## Rule 4 — Events: Source Layers Must Be Explicit

Event content must distinguish between four source layers:

| Layer | Source type | Example |
|---|---|---|
| Official dates and venue | `organizer` | GITEX Global website, Formula 1 official site |
| Venue confirmation | `organizer` or `venue` | DWTC floor plan, Yas Marina Circuit page |
| Ticketing | `organizer` | Official ticket sales page |
| Third-party signal | `media_signal` | Gulf News article mentioning dates |

**Expiry rule:** When an event has passed:
- The event page must be marked `status: historical`
- It must be framed as a past event
- Ticketing CTAs must be removed or hidden
- The page should not rank for queries suggesting the event is upcoming (title/meta must reflect past tense)

**No speculation rule:** Do not publish event dates, ticket prices, or keynote speakers without an organizer or official source. Estimated dates (e.g. inferred from previous years) may only appear with a `provisional` status note.

---

## Rule 5 — Offers and Deals Must Not Behave Like Evergreen Guides

Any content that describes a promotional offer, limited-time deal, or time-bound service must include:

| Field | Required |
|---|---|
| `valid_from` | Yes |
| `valid_until` | Yes (or "ongoing" with source confirming) |
| `source_url` | Yes |
| `source_type` | Yes |
| Expiry / archive logic | Must be planned before publishing |

**Evergreen confusion rule:** If an offer page is still live after `valid_until` and does not show an expiry notice, Google and users may believe the offer is active. This is a trust violation.

Offers that have expired must either:
- Be archived with a clear "This offer is no longer available" notice, OR
- Be noindexed and removed from sitemap

This logic does not need to be built before publishing offers, but it must be **planned and documented** before publishing the first offer page.

---

## Rule 6 — EN/RU Parity

RU content must carry the same factual claims, same status signals, and same source authority as EN content.

| Requirement | Rule |
|---|---|
| Same facts | If EN says fee is AED 4,200, RU must not say AED 3,500 |
| Same status | If EN shows `provisional`, RU must also show `provisional` |
| Same source meaning | If EN cites GDRFA, RU must reference GDRFA by its Russian name or transliteration |
| Natural Russian | visible_note_ru must be natural editorial Russian. Not Google Translate output. |
| No EN fallback | If RU content is not ready, the page should either not be published in RU or show a clear note — it must not silently fall back to English fact claims |

**Checklist before publishing any RU page:**
- [ ] All fee amounts match EN exactly
- [ ] All dates match EN exactly
- [ ] Status is the same (confirmed / provisional)
- [ ] Source authority name is recognizable in RU (GDRFA, ICA, FTA — these names are used as-is or transliterated)
- [ ] visible_note_ru is natural Russian, reviewed for editorial tone

---

## Rule 7 — UI Rules for Source Notes

Source notes are the visible manifestation of the trust model. They must follow these rules:

**Placement:**
- Near the key claim they support (preferred), OR
- At the bottom of the page in a dedicated "Source" or "О достоверности" section

**Length:**
- EN: ≤ 30 words per note
- RU: ≤ 35 words per note (Russian phrasing is naturally slightly longer)

**Tone:**
- Factual and calm. Not a disclaimer. Not a warning label.
- "Based on GDRFA official guidance" — good
- "WARNING: this information may be incorrect" — bad

**Prohibited:**
- Do not use the word "disclaimer" in user-facing text
- Do not show raw source URLs to users (show source name only)
- Do not show internal fields (last_checked, next_recheck_date, verification_notes) to users
- Do not stack more than 2 source notes on a single visible section

**Visual rules:**
- Mobile-first. Max width: full content column.
- Small text (≤ 12px / text-[12px] in Tailwind)
- Subtle color: `text-gray-400` or `text-gray-500`
- Optional icon: a small dot, checkmark, or lock — no decorative illustrations
- Should not compete with the guide's primary hierarchy (title, steps, CTAs)
- Islamic date provisional notes: amber/yellow treatment (consistent with existing amber box on calendar pages)

**Component pattern (to be defined in 99G-B):**
A `SourceNote` component that accepts:
```tsx
{
  note: string           // visible_note_en or visible_note_ru
  status: "confirmed" | "provisional"
  sourceLabel: string    // source_name (not URL)
  lastChecked: string    // ISO date — formatted as "Checked: MMM YYYY"
  variant?: "inline" | "footer"
}
```

---

## Trust Hierarchy Summary

```
official  ──────────────────────────────────────────────► Highest trust
  organizer  ─────────────────────────────────────────► High
    media_signal / social_signal  ──────────────────► Medium (signal only)
      pdf (unofficial domain)  ───────────────────► Medium
        internal_verification  ─────────────────► Low (provisional only)
```

---

## Maintenance Cadence

| Content type | Minimum recheck cadence |
|---|---|
| Islamic holiday (provisional) | Monitor FAHR/MoHRE; trigger recheck 30 days before expected date |
| Public holiday (confirmed) | 6 months |
| Visa rules | 6 months |
| Government fees | 6 months |
| Events (upcoming) | 30 days before event |
| Tax/regulatory deadlines | 30 days before deadline |
| Evergreen guides (low-risk) | 12 months |
| Offers/deals | Before valid_until — must archive or noindex on expiry |

---

## Version

Rules version: 1.0 | Created: 2026-06-11 | Phase: 6C-99G-A

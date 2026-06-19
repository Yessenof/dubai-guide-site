# Phase 6C-EVENTS-DB-01 — GITEX Global 2026 DB Accuracy Audit

**Date:** 2026-06-18  
**Slug:** `gitex-global-2026`  
**Mode:** Local and production DB patch. No code deploy, no commit, no push.

---

## Official source

- URL: https://www.gitex.com/gitex-global-2026
- Authority: Dubai World Trade Centre / GITEX organizers (gitexsales@dwtc.com)
- Verified 2026-06-18

Key finding: Scale Summit on 7 December listed at **Dubai World Trade Centre**. Main Expo (8–11 December) listed at **Expo City Dubai** (Dubai Exhibition Centre). Visitor/company figures show as placeholder text — not confirmed for 2026.

---

## Stale phrase inventory

| Phrase | Fields | Occurrences | Issue |
|---|---|---|---|
| `200,000` | en_summary, en_body(×2), en_meta_description | 4 | Unconfirmed for 2026 |
| `200 000` | ru_summary, ru_body(×2), ru_meta_description | 4 | Unconfirmed for 2026 |
| `6,800` | en_summary, en_body(×2), en_meta_description | 4 | Unconfirmed for 2026 |
| `6 800` | ru_summary, ru_body(×2), ru_meta_description | 4 | Unconfirmed for 2026 |
| `outside DWTC` | en_body(×1) | 1 | Summit IS at DWTC — claim is wrong |
| `since 1981` | en_body(×1) | 1 | Part of wrong "first outside DWTC" claim |
| `за пределами DWTC` | ru_body(×1) | 1 | Russian equivalent of wrong claim |
| `с 1981 года` | ru_body(×1) | 1 | Part of wrong claim |
| `вся выставка переезжает` | ru_body(×1) | 1 | "whole event moves" — wrong; Summit stays at DWTC |
| `Впервые за 40+ лет GITEX покидает DWTC` | ru_summary(×1) | 1 | Wrong — Summit still at DWTC |
| `full event moves` | en_body(×1) | 1 | Wrong — Summit stays at DWTC |
| Whole-event venue implication | en_title, en_summary, en_meta_description, ru_title, ru_summary, ru_meta_description | — | "at Expo City Dubai" applied to entire 7–11 Dec span |

### Note on safe "Expo City" references
Not all "Expo City" occurrences are wrong. The main expo (8–11 December) IS at Expo City Dubai. Only occurrences implying the whole event (including Summit) is at Expo City need fixing. There are 10 occurrences each in en_body/ru_body — most are legitimate references to the main expo venue and are not changed.

---

## Fields to patch

| Field | Change type |
|---|---|
| `en_title` | Full replacement — remove "at Expo City Dubai" from title |
| `en_summary` | Full replacement — correct venue wording, remove DWTC claim, block scale figures |
| `en_body` | Surgical replacements (8 targeted changes) |
| `en_meta_description` | Full replacement — correct venue wording, remove scale figures |
| `ru_title` | Full replacement — remove "в Expo City Dubai" from title |
| `ru_summary` | Full replacement — correct venue wording, remove DWTC claim, block scale figures |
| `ru_body` | Surgical replacements (8 targeted changes) |
| `ru_meta_description` | Full replacement — correct venue wording, remove scale figures |
| `en_seo_title` | **Not changed** — "| Expo City Dubai" suffix refers to main expo venue, accurate |
| `ru_seo_title` | **Not changed** — neutral, no overclaim |
| `updated_at` | Updated to patch timestamp |

---

## Fields NOT changed

- `event_date_start`: 2026-12-07 ✓
- `event_date_end`: 2026-12-11 ✓
- `source_url`: https://www.gitex.com/gitex-global-2026 ✓
- `en_seo_title`: retained as-is (Expo City Dubai = main expo venue, correct)
- `ru_seo_title`: retained as-is
- All other non-content fields (id, slug, status, category, schema_eligible, etc.)

---

## Risk level

**Low.** All changes are content corrections to existing fields. Dates unchanged. DB write is a single row UPDATE. Backup created before patch. ISR cache flush required after patch.

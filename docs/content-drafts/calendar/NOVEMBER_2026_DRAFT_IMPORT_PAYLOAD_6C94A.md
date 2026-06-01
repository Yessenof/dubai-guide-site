# November 2026 — Draft Import Payload

**Phase:** 6C-94A
**Date:** 2026-06-01
**IMPORTANT: Draft only. Do NOT execute. Do NOT write DB.**
This document describes exactly what the import script would contain if approved.

---

## Page-level fields (calendar_pages row)

```
slug:                november-2026-dubai-calendar
calendar_type:       monthly
year:                2026
month:               11
status:              draft (→ published after QA)
ru_published:        1

en_title:            November 2026 in Dubai: Dubai Design Week, Big 5 Global and key business events
ru_title:            Ноябрь 2026 в Дубае: Dubai Design Week, Big 5 Global и деловые события

en_summary:          November 2026 in Dubai brings two major design and construction events:
                     Dubai Design Week (3–8 November) at Dubai Design District and Big 5 Global
                     (23–26 November) at DWTC. ADIPEC 2026 takes place 2–5 November in Abu Dhabi.
ru_summary:          В ноябре 2026 года в Дубае состоятся две крупные отраслевые недели:
                     Dubai Design Week (3–8 ноября) в Dubai Design District и Big 5 Global
                     (23–26 ноября) в DWTC. ADIPEC 2026 пройдёт 2–5 ноября в Абу-Даби.

en_body:             [see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — compose from individual briefs]
ru_body:             [see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md]

en_notes:            Dubai Design Week includes Downtown Design — the region's leading contemporary
                     design fair. Big 5 Global is trade-only; registration required. ADIPEC is in
                     Abu Dhabi, not Dubai.
ru_notes:            Dubai Design Week включает Downtown Design. Big 5 Global -- только для
                     профессионалов отрасли. ADIPEC проходит в Абу-Даби, не в Дубае.

en_seo_title:        November 2026 Dubai calendar: Dubai Design Week, Big 5 Global and ADIPEC
ru_seo_title:        Ноябрь 2026 Дубай: Dubai Design Week, Big 5 Global и деловые события

en_meta_description: November 2026 in Dubai: Dubai Design Week at d3 (3-8 Nov), Big 5 Global
                     at DWTC (23-26 Nov), ADIPEC in Abu Dhabi (2-5 Nov). Business, design and
                     construction events.
ru_meta_description: Ноябрь 2026 в Дубае: Dubai Design Week в d3 (3-8 нояб.), Big 5 Global
                     в DWTC (23-26 нояб.), ADIPEC в Абу-Даби (2-5 нояб.).

last_verified_date:  2026-06-01
featured_homepage:   0
image_path:          /images/hubs/dubai-skyline-downtown.webp
image_alt:           Dubai, November 2026 key events and dates
ru_image_alt:        Дубай, ключевые события и даты ноября 2026

official_source_url: https://www.dubaidesignweek.ae
```

---

## dates_json items (4 total)

### NOV-01-DDW

```json
{
  "id": "NOV-01-DDW",
  "date": "2026-11-03",
  "label_en": "Dubai Design Week 2026 at Dubai Design District (3-8 November)",
  "label_ru": "Dubai Design Week 2026 в Dubai Design District (3-8 ноября)",
  "short_label_en": "Design Week",
  "short_label_ru": "Design Week",
  "type": "trade_show",
  "confidence": "confirmed",
  "priority": 1,
  "detail_url": "/events/dubai-design-week-2026",
  "brief_en": "[see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — EN brief for DDW]",
  "brief_ru": "[see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — RU brief for DDW]",
  "source_label_en": "Dubai Design Week: official",
  "source_label_ru": "Dubai Design Week: официально",
  "source_url": "https://www.dubaidesignweek.ae",
  "source_status": "confirmed",
  "cta_type": "view_details",
  "cta_url": "/events/dubai-design-week-2026",
  "cta_label_en": "Event details",
  "cta_label_ru": "Подробнее о событии",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-09",
  "archive_action": "remove"
}
```

**Note:** `detail_url` is `/events/dubai-design-week-2026`. This page must be created (Phase 6C-94B) before or simultaneously with this import. If detail page is not ready: set `detail_url: null` and `cta_type: "open_source"` + `cta_url: "https://www.dubaidesignweek.ae"`.

### NOV-02-DD

```json
{
  "id": "NOV-02-DD",
  "date": "2026-11-04",
  "label_en": "Downtown Design Dubai 2026 (4-8 November, part of Dubai Design Week)",
  "label_ru": "Downtown Design Dubai 2026 (4-8 ноября, в рамках Dubai Design Week)",
  "short_label_en": "Downtown Design",
  "short_label_ru": "Downtown Design",
  "type": "trade_show",
  "confidence": "confirmed",
  "priority": 2,
  "detail_url": "/events/dubai-design-week-2026",
  "brief_en": "",
  "brief_ru": "",
  "source_label_en": "Dubai Design Week programme: official",
  "source_label_ru": "Программа Dubai Design Week: официально",
  "source_url": "https://www.dubaidesignweek.ae",
  "source_status": "confirmed",
  "cta_type": "view_details",
  "cta_url": "/events/dubai-design-week-2026",
  "cta_label_en": "See DDW details",
  "cta_label_ru": "Подробнее о DDW",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-09",
  "archive_action": "remove"
}
```

**Note:** Source confidence is OFFICIAL_PARTIAL (dates inferred from DDW Nov 3-8 window + 2025 pattern). If owner prefers to skip Downtown Design until downtowndesign.ae is accessible and confirms 2026 dates, remove this item and keep NOV-01-DDW only.

### NOV-03-BIG5

```json
{
  "id": "NOV-03-BIG5",
  "date": "2026-11-23",
  "label_en": "Big 5 Global 2026 at Dubai World Trade Centre (23-26 November)",
  "label_ru": "Big 5 Global 2026 в Dubai World Trade Centre (23-26 ноября)",
  "short_label_en": "Big 5 Global",
  "short_label_ru": "Big 5 Global",
  "type": "trade_show",
  "confidence": "confirmed",
  "priority": 1,
  "detail_url": "/events/big-5-global-dubai-2026",
  "brief_en": "[see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — EN brief for Big 5]",
  "brief_ru": "[see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — RU brief for Big 5]",
  "source_label_en": "DWTC: official",
  "source_label_ru": "DWTC: официально",
  "source_url": "https://www.dwtc.com/en/events/the-big-5-2026/",
  "source_status": "confirmed",
  "cta_type": "view_details",
  "cta_url": "/events/big-5-global-dubai-2026",
  "cta_label_en": "Event details",
  "cta_label_ru": "Подробнее о событии",
  "emirate": "Dubai",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-27",
  "archive_action": "remove"
}
```

**Note:** Same `detail_url` caveat — create the Big 5 events page in Phase 6C-94B first. Fallback: `cta_type: "open_source"`, `cta_url: "https://www.dwtc.com/en/events/the-big-5-2026/"`.

### NOV-04-ADIPEC

```json
{
  "id": "NOV-04-ADIPEC",
  "date": "2026-11-02",
  "label_en": "ADIPEC 2026 at ADNEC, Abu Dhabi (2-5 November)",
  "label_ru": "ADIPEC 2026 в ADNEC, Абу-Даби (2-5 ноября)",
  "short_label_en": "ADIPEC Abu Dhabi",
  "short_label_ru": "ADIPEC Абу-Даби",
  "type": "conference",
  "confidence": "confirmed",
  "priority": 2,
  "detail_url": null,
  "brief_en": "[see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — EN brief for ADIPEC]",
  "brief_ru": "[see NOVEMBER_2026_SHORT_BRIEFS_6C94A.md — RU brief for ADIPEC]",
  "source_label_en": "ADIPEC: official",
  "source_label_ru": "ADIPEC: официально",
  "source_url": "https://www.adipec.com/",
  "source_status": "confirmed",
  "cta_type": "open_source",
  "cta_url": "https://www.adipec.com/",
  "cta_label_en": "Official website",
  "cta_label_ru": "Официальный сайт",
  "emirate": "Abu Dhabi",
  "risk_level": "low",
  "lifecycle": "event_fixed",
  "noindex_after": "2026-11-06",
  "archive_action": "remove"
}
```

**CRITICAL NOTE for import:** `emirate` field MUST be "Abu Dhabi". This event is not in Dubai. EN label, RU label, brief, all calendar page notes must specify Abu Dhabi. Verify the calendar_pages schema supports emirate field at the item level. If not, add an explicit note in `brief_en`/`brief_ru` that the event is in Abu Dhabi.

---

## Items NOT included (and why)

| Item | Status | Reason |
|------|--------|--------|
| NOV-05-DFC | HOLD | dubaifitnesschallenge.com returns 403. Cannot verify Oct31-Nov29 dates. |
| NOV-06-VAT-MONTHLY | HOLD | FTA rule implies Nov 28 deadline for monthly filers, but no explicit FTA page captured. Needs verification before import. |
| Global Village S31 | HOLD | Season 31 announced but no opening date from globalvillage.ae. |
| Cityscape Dubai | BLOCKED | Source inaccessible. No 2026 dates. |
| CCA shows | NO | Behind queue system, no November shows captured. |
| Dubai Opera shows | NO | Dynamic content, no November shows captured. |

---

## Source gaps to resolve before 6C-94C import

| Gap | Resolution needed |
|-----|------------------|
| Downtown Design 2026 exact dates | Wait for downtowndesign.ae to become accessible, or accept OFFICIAL_PARTIAL based on DDW Nov 3-8 overlap |
| DFC dates | Wait for dubaifitnesschallenge.com to become accessible (403 today) |
| Detail pages for DDW and Big 5 | Create /events/dubai-design-week-2026 and /events/big-5-global-dubai-2026 before or during import |
| VAT monthly Nov 28 | Verify FTA page explicitly shows 28-day rule for monthly filers |
| ADIPEC emirate field | Verify calendar_pages schema handles emirate at item level |

---

## Questions for owner before 6C-94C import

1. **Downtown Design**: Accept as OFFICIAL_PARTIAL (grouped with DDW, inferred Nov 4-8) or wait for downtowndesign.ae to be accessible?

2. **ADIPEC**: Include as a UAE business event clearly labelled Abu Dhabi, or exclude from the Dubai-focused calendar?

3. **Detail pages first or simultaneously?**: Should Phase 6C-94B build the two events detail pages before the calendar import (Phase 6C-94C), or import the calendar now with external CTAs and add detail pages later?

4. **DFC**: If DFC resolves before Phase 6C-94C — should November be held until DFC is confirmed (for coverage reasons), or import the 4 confirmed items now and add DFC via patch?

---

## Suggested next phases

| Phase | Action |
|-------|--------|
| 6C-94B | Build events detail pages: /events/dubai-design-week-2026 + /events/big-5-global-dubai-2026 (EN + RU content) |
| 6C-94C | November calendar local import QA (4 items: DDW + DD + Big5 + ADIPEC) |
| 6C-94D | November calendar production import (using new deploy script) |
| 6C-94E | If DFC resolves: patch November calendar with DFC item (Oct31-Nov29 + sub-events) |

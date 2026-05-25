# UAE e-invoicing 2026 — Indexed Calendar Brief Data

**Phase:** 6C-66
**Date:** 2026-05-25
**Status:** Draft — brief content owner-approved; CTA scenario decided; code phase required before DB import
**Scope:** Brief field data for TAX-05A, TAX-05C, TAX-05D only

---

## Owner decision — CTA scenario (2026-05-25)

**Scenario B is approved for TAX-05C and TAX-05D.**

- CTA points to the Guidex e-invoicing news post (`/news/uae-e-invoicing-2026-asp-deadline-update`) when the news post is imported or published in the same batch or already exists.
- Do not use the internal news post URL until it is live. Use `open_source` (official MoF URL) during any pre-news testing phase.
- Official MoF/WAM sources remain visible as `source_url` and `source_label` trust references on every item — they are not replaced by the internal CTA.
- TAX-05A: may also link to the main e-invoicing news post once it exists (`view_details`). During pre-news testing, use `open_source` pointing to the official MoF e-invoicing page.

**Resolved: no dual-path ambiguity. Scenario A applies only during pre-news-post testing; Scenario B is the production target.**

---

## Source table

| # | Source | Type | URL | Status |
|---|---|---|---|---|
| S1 | MoF — UAE Electronic Invoicing Guidelines V-1.0 (23 Feb 2026) | official | https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoicing-Guidelines_V-1.0-23Feb2026.pdf | captured — recheck before import |
| S2 | MoF — Targeted amendments to eInvoicing decisions (10 May 2026) | official | https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ | official permalink captured — recheck before import |
| S3 | Cabinet Resolution No. 106 of 2025 — Administrative Fines | official | https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-cabinet-resolution-on-administrative-fines-related-to-electronic-invoicing-system/ | captured — recheck before import |
| S4 | MoF — e-invoicing landing page | official | https://mof.gov.ae/en/about-us/initiatives/einvoicing/ | captured — timeline in image only; use as CTA target, not for date claims |

---

## Allowed claims

These facts are source-safe and may appear in published brief content.

| Claim | Source | Notes |
|---|---|---|
| Pilot programme opens 1 July 2026 | S1 | MoF Guidelines V-1.0; date unchanged by May 2026 amendment |
| Voluntary adoption open from 1 July 2026 | S1 | Same source; confirmed |
| Voluntary adopters exempt from fines | S3 | Cabinet Resolution 106 of 2025 explicitly exempts voluntary pilot participants |
| ASP deadline for large businesses (>= AED 50M): 30 October 2026 | S2 | MoF amendment to MD 244 of 2025; official permalink confirmed Phase 6C-23 |
| Original ASP deadline was 31 July 2026 (now extended) | S1 + S2 | Stating the extension context is accurate and required |
| Mandatory implementation for large businesses: 1 January 2027 | S1 + S2 | Confirmed in both baseline and amendment; unchanged |
| ASP deadline for SMEs (< AED 50M): 31 March 2027 | S1 | Baseline; unchanged by amendment |
| Mandatory implementation for SMEs: 1 July 2027 | S1 | Baseline; unchanged by amendment |
| Fine: AED 5,000/month for failure to implement or appoint ASP | S3 | Cabinet Resolution 106 — must cite S3 when stating this amount |
| Businesses must select ASP from official MoF list | S1 + S4 | Confirmed in guideline and MoF ASP page |
| Confirm revenue category with a qualified adviser | original — editorial | Standard adviser caveat, not a claim about the law |

---

## Blocked claims

These must NOT appear in any published brief, calendar item, or CTA.

| Claim | Why blocked |
|---|---|
| "All UAE businesses must comply" | Revenue threshold determines applicability; SMEs and government have separate dates |
| "Free zone companies must comply" | Not confirmed in reviewed official sources |
| "32 ASP providers approved" as a current live fact | Count was accurate as of May 2026; must recheck before any publish action |
| Exact fine amounts without citing Cabinet Resolution 106 of 2025 | Must cite S3 when stating any fine figure |
| "Excel is no longer allowed" | Not how MoF guidance is framed; do not invent |
| Legal or tax advice of any kind | Guidex is an information resource |
| Any deadline stated as "confirmed" without noting the pre-publish recheck requirement | Sources must be rechecked before import |
| Detail URL for guide (/guides/uae-e-invoicing-2026-business-readiness) as a live link | Guide is draft-only; guide schema does not fit the steps table; do not use as detail_url until guide is published |

---

## CTA decision logic

Owner decision (2026-05-25): Scenario B is the production target for TAX-05C and TAX-05D. TAX-05A also uses Scenario B once the news post exists.

**Scenario A — pre-news testing only (temporary)**
- cta_type: `open_source`
- cta_url: official MoF source URL (per item)
- cta_label_en: "Official source"
- cta_label_ru: "Официальный источник"
- detail_url: null
- Use: local QA only, before news post is published

**Scenario B — production target (decided)**
- cta_type: `view_details`
- cta_url: `/news/uae-e-invoicing-2026-asp-deadline-update`
- cta_label_en: "View details"
- cta_label_ru: "Подробнее"
- detail_url: `/news/uae-e-invoicing-2026-asp-deadline-update`
- Use: production import — news post must be live before or simultaneously with calendar row
- Official MoF source URL remains in `source_url` and `source_label` fields on every item — visible as a trust reference alongside the internal CTA

---

## JSON-ready brief objects

### TAX-05A — 1 July 2026: pilot opens, voluntary adoption

```json
{
  "date": "2026-07-01",
  "label_en": "UAE e-invoicing pilot opens: voluntary adoption",
  "label_ru": "Запуск пилота: добровольные электронные инвойсы в ОАЭ",
  "short_label_en": "E-invoicing pilot",
  "short_label_ru": "Старт е-инвойсов",
  "type": "important-date",
  "confidence": "confirmed",
  "priority": 2,
  "detail_url": null,

  "brief_en": "The UAE Ministry of Finance opens voluntary electronic invoicing from 1 July 2026. Businesses that adopt e-invoicing during this pilot phase can exchange compliant digital invoices through an Accredited Service Provider (ASP) ahead of mandatory deadlines. Voluntary adopters during the pilot phase are exempt from fines under Cabinet Resolution No. 106 of 2025. No mandatory requirement applies on this date. The applicable deadline depends on annual revenue: businesses with annual revenue of AED 50 million or above must have an ASP appointed by 30 October 2026 and be fully live by 1 January 2027. Smaller businesses have separate, later deadlines. If your business is considering early adoption, this is the earliest date to start using a compliant ASP. Confirm your revenue category and applicable deadline with a qualified adviser before acting. Source: UAE Ministry of Finance Electronic Invoicing Guidelines V-1.0, February 2026.",

  "brief_ru": "С 1 июля 2026 года Министерство финансов ОАЭ открывает добровольное внедрение электронных инвойсов. Компании, присоединяющиеся к программе в пилотной фазе, могут обмениваться инвойсами через аккредитованного поставщика (ASP) до наступления обязательных сроков. Согласно Постановлению Кабинета министров № 106 от 2025 года, добровольные участники пилота освобождены от штрафов. Обязательного требования на эту дату нет. Сроки зависят от годовой выручки: компаниям с выручкой от AED 50 млн необходимо выбрать ASP до 30 октября 2026 года и полностью перейти на электронные инвойсы с 1 января 2027 года. Для малого и среднего бизнеса установлены отдельные, более поздние сроки. Если ваша компания рассматривает раннее внедрение, 1 июля 2026 года является первой возможной датой для подключения через аккредитованного поставщика. Перед принятием любых решений уточните применимую к вам категорию у квалифицированного советника.",

  "who_for_en": "UAE-based businesses planning early adoption of e-invoicing, and compliance teams tracking the programme rollout.",
  "who_for_ru": "Компании в ОАЭ, рассматривающие досрочное внедрение электронных инвойсов, и специалисты по комплаенсу, отслеживающие этапы программы.",

  "what_to_do_en": "No mandatory action required on this date. Monitor MoF communications and confirm your applicable deadline based on annual revenue.",
  "what_to_do_ru": "Обязательных действий на эту дату нет. Следите за сообщениями МФ ОАЭ и уточните применимый к вашей компании срок на основе годовой выручки.",

  "source_label_en": "Ministry of Finance UAE",
  "source_label_ru": "Министерство финансов ОАЭ",
  "source_url": "https://mof.gov.ae/en/about-us/initiatives/einvoicing/",
  "source_status": "confirmed",

  "cta_type": "open_source",
  "cta_url": "https://mof.gov.ae/en/about-us/initiatives/einvoicing/",
  "cta_label_en": "Official source",
  "cta_label_ru": "Официальный источник",

  "location_en": "",
  "location_ru": "",
  "emirate": "UAE",
  "risk_level": "medium",
  "lifecycle": "compliance_evergreen",
  "noindex_after": "",
  "archive_action": "keep"
}
```

**Word count (brief_en):** ~138 words. Within 80-180.
**Word count (brief_ru):** ~118 words. Within 80-180.

---

### TAX-05C — 30 October 2026: ASP appointment deadline (large businesses)

Two CTA variants — owner must choose Scenario A or B before import.

```json
{
  "date": "2026-10-30",
  "label_en": "E-invoicing: ASP appointment deadline (large businesses)",
  "label_ru": "Е-инвойсы: срок назначения ASP (крупный бизнес)",
  "short_label_en": "E-invoicing ASP due",
  "short_label_ru": "Срок ASP: кр. бизнес",
  "type": "deadline",
  "confidence": "confirmed",
  "priority": 1,

  "detail_url": "[Scenario A: null] [Scenario B: /news/uae-e-invoicing-2026-asp-deadline-update]",

  "brief_en": "30 October 2026 is the deadline for businesses with annual revenue of AED 50 million or above to appoint an Accredited Service Provider (ASP) under the UAE e-invoicing programme. The Ministry of Finance extended this deadline from 31 July 2026 in May 2026. The mandatory go-live date of 1 January 2027 for this category is unchanged. An ASP is a Ministry of Finance-certified technology platform that handles compliant e-invoice exchange and reporting. Businesses must select from the official MoF ASP list, complete onboarding, and test invoice exchange before the mandatory implementation date. This deadline applies only to businesses at or above the AED 50 million revenue threshold. Businesses below this threshold have a separate ASP deadline of 31 March 2027. Confirm your applicable category with a qualified accountant or adviser before acting. Source: Ministry of Finance amendment to MD No. 244 of 2025, 10 May 2026.",

  "brief_ru": "30 октября 2026 года является крайним сроком для компаний с годовой выручкой от AED 50 млн по назначению аккредитованного поставщика услуг (ASP) в рамках программы электронных инвойсов ОАЭ. Министерство финансов ОАЭ продлило этот срок с 31 июля 2026 года поправкой в мае 2026 года. Дата обязательного перехода для этой категории, 1 января 2027 года, не изменилась. ASP является аккредитованной платформой, сертифицированной Министерством финансов для обмена электронными инвойсами и отчётности. Компании должны выбрать поставщика из официального списка МФ, завершить подключение и протестировать систему до даты обязательного внедрения. Этот срок применяется только к компаниям с выручкой от AED 50 млн. Компании с более низкой выручкой имеют отдельный срок выбора ASP: 31 марта 2027 года. Перед принятием решений подтвердите применимую к вам категорию у квалифицированного бухгалтера или советника.",

  "who_for_en": "Businesses with annual revenue of AED 50 million or above operating in the UAE.",
  "who_for_ru": "Компании с годовой выручкой от AED 50 млн, работающие в ОАЭ.",

  "what_to_do_en": "Select an Accredited Service Provider from the official Ministry of Finance ASP list and begin onboarding before this date.",
  "what_to_do_ru": "Выберите аккредитованного поставщика услуг из официального списка Министерства финансов и начните подключение до наступления этого срока.",

  "source_label_en": "Ministry of Finance UAE",
  "source_label_ru": "Министерство финансов ОАЭ",
  "source_url": "https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/",
  "source_status": "confirmed",

  "cta_type": "[Scenario A: open_source] [Scenario B: view_details]",
  "cta_url": "[Scenario A: https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/] [Scenario B: /news/uae-e-invoicing-2026-asp-deadline-update]",
  "cta_label_en": "[Scenario A: Official source] [Scenario B: View details]",
  "cta_label_ru": "[Scenario A: Официальный источник] [Scenario B: Подробнее]",

  "location_en": "",
  "location_ru": "",
  "emirate": "UAE",
  "risk_level": "high",
  "lifecycle": "compliance_evergreen",
  "noindex_after": "",
  "archive_action": "keep"
}
```

**Word count (brief_en):** ~133 words. Within 80-180.
**Word count (brief_ru):** ~125 words. Within 80-180.

---

### TAX-05D — 1 January 2027: mandatory e-invoicing for large businesses

```json
{
  "date": "2027-01-01",
  "label_en": "E-invoicing mandatory for large businesses (UAE)",
  "label_ru": "Электронные инвойсы обязательны: крупный бизнес",
  "short_label_en": "E-invoicing mandatory",
  "short_label_ru": "Е-инвойсы обязательны",
  "type": "deadline",
  "confidence": "confirmed",
  "priority": 1,

  "detail_url": "[Scenario A: null] [Scenario B: /news/uae-e-invoicing-2026-asp-deadline-update]",

  "brief_en": "From 1 January 2027, electronic invoicing becomes mandatory for businesses with annual revenue of AED 50 million or above in the UAE. By this date, affected businesses must have an Accredited Service Provider (ASP) appointed and the e-invoicing system live and operational. The requirement applies to invoices issued from 1 January 2027. This date was confirmed by the UAE Ministry of Finance and was not changed by the May 2026 amendment, which only extended the ASP appointment deadline to 30 October 2026. Businesses in this category should appoint their ASP by 30 October 2026 and use the remaining months for testing and onboarding. Businesses with annual revenue below AED 50 million have a separate mandatory date of 1 July 2027. Confirm your applicable category with a qualified adviser before acting on any deadline. Source: UAE Ministry of Finance Electronic Invoicing Guidelines V-1.0, February 2026.",

  "brief_ru": "С 1 января 2027 года использование электронных инвойсов становится обязательным для компаний с годовой выручкой от AED 50 млн в ОАЭ. К этой дате компании из данной категории обязаны иметь назначенного аккредитованного поставщика услуг (ASP) и запущенную систему электронных инвойсов. Требование распространяется на инвойсы, выставленные с 1 января 2027 года. Эта дата подтверждена Министерством финансов ОАЭ и не была изменена поправкой в мае 2026 года, которая продлила только срок выбора ASP до 30 октября 2026 года. Компаниям данной категории следует назначить ASP до 30 октября 2026 года и использовать оставшееся время для тестирования и подключения системы. Компании с годовой выручкой менее AED 50 млн имеют отдельный обязательный срок: 1 июля 2027 года. Перед принятием любых решений уточните применимую к вам категорию у квалифицированного советника.",

  "who_for_en": "Businesses with annual revenue of AED 50 million or above operating in the UAE.",
  "who_for_ru": "Компании с годовой выручкой от AED 50 млн, работающие в ОАЭ.",

  "what_to_do_en": "Confirm your ASP is appointed and your e-invoicing system is live before this date. If your ASP deadline was 30 October 2026, use the interval for testing and system validation.",
  "what_to_do_ru": "Убедитесь, что ASP назначен и система электронных инвойсов запущена до этой даты. Если срок выбора ASP приходился на 30 октября 2026 года, используйте оставшееся время для тестирования и проверки системы.",

  "source_label_en": "Ministry of Finance UAE",
  "source_label_ru": "Министерство финансов ОАЭ",
  "source_url": "https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoicing-Guidelines_V-1.0-23Feb2026.pdf",
  "source_status": "confirmed",

  "cta_type": "[Scenario A: open_source] [Scenario B: view_details]",
  "cta_url": "[Scenario A: https://mof.gov.ae/en/about-us/initiatives/einvoicing/] [Scenario B: /news/uae-e-invoicing-2026-asp-deadline-update]",
  "cta_label_en": "[Scenario A: Official source] [Scenario B: View details]",
  "cta_label_ru": "[Scenario A: Официальный источник] [Scenario B: Подробнее]",

  "location_en": "",
  "location_ru": "",
  "emirate": "UAE",
  "risk_level": "high",
  "lifecycle": "compliance_evergreen",
  "noindex_after": "",
  "archive_action": "keep"
}
```

**Word count (brief_en):** ~142 words. Within 80-180.
**Word count (brief_ru):** ~122 words. Within 80-180.

---

## Calendar_pages row metadata

These are the proposed top-level fields for the `calendar_pages` DB row that will contain all three items.

```
slug:              uae-e-invoicing-2026-deadlines
calendar_type:     important_dates
year:              2026
month:             null
status:            draft (do not publish without owner approval)
ru_published:      0

en_title:          UAE e-invoicing 2026: key deadlines
en_summary:        The UAE Ministry of Finance is rolling out mandatory e-invoicing in phases. Key dates for large businesses (annual revenue AED 50M+): voluntary adoption from 1 July 2026, ASP deadline 30 October 2026, mandatory implementation 1 January 2027. Separate later deadlines apply to SMEs.
en_seo_title:      UAE e-invoicing 2026: key deadlines and dates
en_meta_description: Key UAE e-invoicing deadlines: pilot opens 1 Jul 2026, ASP deadline 30 Oct 2026 for large businesses, mandatory e-invoicing 1 Jan 2027. Separate SME deadlines apply.

ru_title:          Электронные инвойсы в ОАЭ 2026: ключевые сроки
ru_summary:        Министерство финансов ОАЭ поэтапно вводит обязательные электронные инвойсы. Ключевые даты для крупного бизнеса (выручка от AED 50 млн): добровольное внедрение с 1 июля 2026, срок выбора ASP 30 октября 2026, обязательный переход с 1 января 2027. Для МСБ установлены отдельные, более поздние сроки.
ru_seo_title:      Электронные инвойсы ОАЭ 2026: ключевые сроки и даты
ru_meta_description: Сроки е-инвойсов ОАЭ: пилот с 1 июл 2026, срок ASP 30 окт 2026 для крупного бизнеса, обязательное внедрение с 1 янв 2027. Для МСБ отдельные сроки.

official_source_url: https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/
last_verified_date:  2026-05-25
has_islamic_dates:   0
featured_homepage:   0
```

---

## EN/RU copy audit

| Field | TAX-05A | TAX-05C | TAX-05D |
|---|---|---|---|
| label_en present | yes | yes | yes |
| label_ru present | yes | yes | yes |
| short_label_en present | yes | yes | yes |
| short_label_ru present | yes | yes | yes |
| brief_en 80-180 words | yes (138) | yes (133) | yes (142) |
| brief_ru 80-180 words | yes (118) | yes (125) | yes (122) |
| who_for_en present | yes | yes | yes |
| who_for_ru present | yes | yes | yes |
| what_to_do_en present | yes | yes | yes |
| what_to_do_ru present | yes | yes | yes |
| source_label_en present | yes | yes | yes |
| source_label_ru present | yes | yes | yes |
| source_url present | yes | yes | yes |
| source_status set | yes | yes | yes |
| No em dashes | pass | pass | pass |
| No double hyphens | pass | pass | pass |
| No tax advice tone | pass | pass | pass |
| No unsupported "all businesses" claim | pass | pass | pass |
| Revenue scope stated | yes | yes | yes |
| Adviser caveat present | yes | yes | yes |
| Source cited in brief | yes | yes | yes |
| cta_type valid | open_source | A/B dual | A/B dual |
| CTA not "Read full article" | pass | pass | pass |

**EN copy: ready for owner review.**
**RU copy: ready for owner review.**

---

## Import readiness checklist

### Pre-import actions required

- [ ] Owner reviews EN briefs for TAX-05A, TAX-05C, TAX-05D
- [ ] Owner reviews RU briefs for TAX-05A, TAX-05C, TAX-05D
- [ ] Owner decides Scenario A or B for TAX-05C and TAX-05D (open_source vs view_details CTA)
- [ ] If Scenario B: news post `uae-e-invoicing-2026-asp-deadline-update` must be imported and published BEFORE or simultaneously with calendar row
- [ ] Recheck MoF amendment article URL is still live (S2) immediately before import
- [ ] Recheck MoF Guidelines PDF URL is still live (S1) immediately before import
- [ ] Recheck Cabinet Resolution 106 URL is still live (S3) if citing in any brief text
- [ ] Verify code phase is complete (brief section renders on /calendar/[slug]/page.tsx)
- [ ] Test brief rendering locally on calendar detail page with a synthetic record before production write
- [ ] Owner screenshot approval of rendered brief section on mobile and desktop

### Blocked by code (not yet implemented)

- Brief rendering on `/calendar/[slug]/page.tsx` — Phase 6C-65 identified this as the next code phase. Data is ready; code is not. Do NOT import brief fields until the rendering code exists and is tested locally.

---

## Remaining owner decisions

| Decision | Options | Impact |
|---|---|---|
| CTA scenario for TAX-05C and TAX-05D | Scenario A (open_source) or Scenario B (view_details linking to news post) | If Scenario B, news post must be imported first or simultaneously |
| News post publish decision | Publish `uae-e-invoicing-2026-asp-deadline-update` now, later, or as calendar-only | If now, Scenario B becomes available; if not, use Scenario A |
| Guide model decision | Guide stays file-based, or becomes a news_posts row | Does not block calendar import; affects cross-linking only |
| December 2026 monthly calendar page | Build it or keep HOL-04/HOL-05 inside Long Weekends only | Unrelated to e-invoicing — pending from Phase 6C-63 |

---

*This is a draft data file. Internal use only. Not for publish. No admin action. No DB write.*
*Created: 2026-05-25 (Phase 6C-66). Owner review required before any import action.*

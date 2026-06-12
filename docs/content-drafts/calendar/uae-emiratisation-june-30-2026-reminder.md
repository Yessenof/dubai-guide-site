# UAE Emiratisation 30 June 2026: Quota Deadline for Private-Sector Companies

## Draft metadata

```
draft_id:              CAL-20260520-uae-emiratisation-june-30-2026-reminder
content_type:          calendar_visual_post
slug:                  uae-emiratisation-june-30-2026-reminder
status:                item_a_published_local — item_b_hold
publish_status:        item_a_published_local — pending_production_deploy — item_b_hold_source_pending
risk_level:            high
source_reliability:    official — recheck_before_publish
verification_required: true
date_reviewed:         2026-05-20
last_updated:          2026-05-20 (Phase 6C-36 — Item B reclassified to hold)

primary_date:          2026-06-30
calendar_priority:     1
date_confidence:       item_a_official_source_confirmed — item_b_source_pending
has_islamic_dates:     false
category:              business / compliance / hiring

lifecycle:             compliance_deadline
noindex_after:         2026-07-10
archive_action:        keep_public

phase_6c36_note:       Item A (50+ employees, June 30 2026) confirmed from captured MoHRE 2026 source. Item B (20–49 employees, June 30 2026) NOT confirmed from captured 2026-specific source — held pending official source. Do not import Item B until a MoHRE 2026 announcement explicitly confirms June 30 applies to the 20–49 employee band.
```

---

## Sources

Primary source ledger for this draft:
`docs/content-drafts/source-ledgers/uae-mohre-compliance-2026-sources.md`

Verification file:
`docs/content-drafts/verification/uae-emiratisation-30-june-2026-source-check.md`
(Decision: `can_proceed_to_draft` — confirmed 2026-05-20)

| # | Source | Type | Status |
|---|---|---|---|
| 1 | MoHRE official Emiratisation portal (mohre.gov.ae) | official | captured — recheck URL at publish |
| 2 | MoHRE WAM news release confirming Q2 2026 deadline | official | captured — recheck at publish |

**Scope in source:** Private-sector mainland companies only. Two employee-count thresholds. Free zone companies: separate Emiratisation framework — do not include in these calendar items.

**Sources still needed before publish:**
- [ ] Recheck MoHRE source is live and June 30 deadline is unchanged at time of publish
- [ ] Confirm no MoHRE amendment has extended or modified the Q2 2026 deadline
- [ ] Owner to confirm financial contributions claim is within approved scope before publish

---

## Calendar items in this draft

### A. Emiratisation Q2 2026 quota deadline — companies with 50+ employees (primary)

```
label_en:      Emiratisation deadline: 50+ employee companies
label_ru:      Срок Emiratisation: компании 50+ сотрудников
date_start:    2026-06-30
date_end:      (single day — deadline)
type:          compliance_deadline
priority:      1
confidence:    official_source_confirmed — recheck_before_publish
source:        MoHRE news 7 May 2026 + MoHRE Emiratisation targets page — both captured 2026-05-19
scope_note:    Applies to private-sector mainland companies with 50 or more employees only. Item B (20–49 employees) is held — June 30 2026 not confirmed for that band. Free zone companies are out of scope.
publish_status: owner_review_ready — recheck_source_before_import
detail_url_en:  /news/uae-emiratisation-june-30-2026-deadline
detail_url_ru:  /ru/news/uae-emiratisation-june-30-2026-deadline
lifecycle:      compliance_deadline
noindex_after:  2026-07-10
archive_action: keep_public
external_cta_status: not_applicable
```

**Calendar cell label (short):**
- EN: Emiratisation deadline (50+)
- RU: Срок Emiratisation (50+)

**Agenda description (EN):**
30 June 2026 is the end of the Q2 2026 Emiratisation quota period for private-sector mainland companies with 50 or more employees. Companies in this category are required to meet a 1% semi-annual Emiratisation quota by this date. Companies that do not meet the quota by 30 June become subject to financial contributions from 1 July 2026. Applies to mainland companies only; separate rules apply to companies in free zones.

**Agenda description (RU):**
30 июня 2026 года завершается квартал Q2 2026 по программе Emiratisation для компаний частного сектора материкового ОАЭ с численностью 50 и более сотрудников. Компании данной категории обязаны выполнить норму в 1% на полугодие к этой дате. При невыполнении квоты к 30 июня финансовые взносы начисляются с 1 июля 2026 года. Распространяется только на материковые компании; для компаний в свободных зонах действуют отдельные правила.

**Risk notes:**
- Do not state the AED amount of financial contributions — amount is blocked (out of approved source scope)
- Do not say "all companies" — scope is specifically 50+ employee private-sector mainland companies
- Do not give legal advice — use "consult MoHRE or a registered HR consultant" as CTA
- Source must be cited as MoHRE official; recheck URL is live at time of publish

---

### B. Emiratisation deadline — companies with 20 to 49 employees — HOLD

**Status: HOLD — source_pending — NOT importable**

**Blocked claim:** "30 June 2026 applicability to the 20–49 employee band is not confirmed by the captured official source." The MoHRE news article published 7 May 2026 (the source that names June 30 as the 2026 Emiratisation deadline) does not clearly confirm this date applies to the 20–49 employee band. The existing source for the 20–49 threshold is the January 2024 MoHRE announcement about beginning implementation of targets for this band — this does not establish June 30 2026 as the current deadline for that band. Do not import this item until a 2026-specific official MoHRE source explicitly confirms June 30 applies to companies with 20–49 employees.

```
label_en:      Emiratisation deadline: 20–49 employee companies
label_ru:      Срок Emiratisation: компании 20–49 сотрудников
date_start:    NOT CONFIRMED FOR 2026 — hold
date_end:      NOT CONFIRMED FOR 2026 — hold
type:          compliance_deadline
priority:      HOLD
confidence:    source_pending — 2026_deadline_not_confirmed_for_this_band
source:        MoHRE Emiratisation targets page confirms the threshold exists; a 2026-specific MoHRE source confirming June 30 applies to this band has not been captured
blocked_claim: "30 June 2026 applicability to the 20–49 employee band is not confirmed by the captured official source."
publish_status: hold — source_pending — do_not_import
detail_url_en:  (not assigned — item on hold)
detail_url_ru:  (not assigned — item on hold)
lifecycle:      compliance_deadline (hold — assign lifecycle when source confirmed)
noindex_after:  (not assigned — item on hold)
archive_action: (not assigned — item on hold)
external_cta_status: internal_only — not for publish
```

**Calendar cell label (short): [HOLD — NOT FOR IMPORT]**
- EN: Emiratisation deadline (20–49) — HOLD
- RU: Срок Emiratisation (20–49) — HOLD

**Agenda description (EN): [INTERNAL ONLY — NOT FOR PUBLISH]**
Separate Emiratisation requirements apply to private-sector mainland companies with 20 to 49 employees. These companies are required to have at least one UAE national employed in a skilled job under the Emiratisation programme. The applicable 2026 deadline for this band has not been confirmed from a 2026-specific official MoHRE source. Do not publish this item as a June 30 2026 deadline. Check MoHRE official communications for the current deadline for this category.

**Agenda description (RU): [INTERNAL ONLY — NOT FOR PUBLISH]**
Для компаний частного сектора материкового ОАЭ с численностью от 20 до 49 сотрудников действуют отдельные требования по программе Emiratisation. Такие компании обязаны трудоустроить как минимум одного гражданина ОАЭ на квалифицированную должность. Применимый срок 2026 года для этой категории не подтверждён официальным источником MoHRE 2026 года. Не публиковать этот пункт как срок 30 июня 2026. Проверьте актуальный срок для данной категории на сайте MoHRE.

**Hold conditions — release Item B only when:**
- A 2026-specific MoHRE official source (news article, circular, or guidance page update) explicitly confirms that June 30 2026 is the deadline for companies with 20–49 employees
- The source URL is captured and recorded in `docs/content-drafts/source-ledgers/uae-mohre-compliance-2026-sources.md`
- Owner reviews and approves the updated source before import

**Risk notes:**
- Do NOT import this item under any circumstances until the hold condition is met
- The threshold itself (1 UAE national in a skilled job) is confirmed — only the June 30 2026 date for this band is unconfirmed
- Do not state AED contribution amounts for this band (blocked regardless of hold status)
- Do not merge with Item A — they have different quota requirements and different source status

---

## EN calendar overview text

**For use in a calendar section header or calendar post intro:**

30 June 2026 is the end of the Q2 2026 Emiratisation quota period for private-sector mainland companies with 50 or more employees. Companies in this category must meet a 1% semi-annual Emiratisation quota by this date. Non-compliant companies become subject to financial contributions from 1 July 2026. Free zone companies follow a separate framework. Separate Emiratisation requirements apply to companies with 20 to 49 employees — the applicable 2026 deadline for that band should be verified with MoHRE.

**Short version (calendar card — Item A only):**
Emiratisation Q2 deadline: 30 June 2026. Private-sector companies with 50+ employees: 1% semi-annual Emiratisation quota. Contributions from 1 July if unmet. [20–49 employee band deadline: verify with MoHRE — not confirmed for this calendar item.]

---

## RU calendar overview text

**Для заголовка раздела или вводного текста поста:**

30 июня 2026 года завершается расчётный период Q2 2026 по программе Emiratisation для компаний частного сектора материкового ОАЭ с численностью 50 и более сотрудников. Компании данной категории обязаны выполнить квоту в 1% на полугодие к этой дате. В случае невыполнения с 1 июля 2026 года начисляются финансовые взносы. Для компаний в свободных зонах действует отдельный регулятив. Для компаний с 20–49 сотрудниками действуют отдельные требования — актуальный срок следует уточнить в MoHRE.

**Короткая версия (карточка календаря — только пункт A):**
Срок Emiratisation Q2: 30 июня 2026. Компании с 50+ сотрудниками: квота 1% за полугодие. Взносы с 1 июля при невыполнении. [Срок для компаний 20–49 сотрудников: уточнить в MoHRE — не подтверждён для данного пункта.]

---

## Blocked claims — do not use on this draft or any publish action

| Claim | Reason |
|---|---|
| AED amounts for financial contributions | Source did not confirm amounts; amount is blocked from this draft |
| Free zone companies subject to same rules | Free zones have a separate Emiratisation framework — not in scope |
| "All UAE companies must comply" | Scope is private-sector mainland only, with employee-count thresholds |
| Legal advice on penalty avoidance | Guidex does not provide legal advice |
| "30 June 2026 is the deadline for companies with 20–49 employees" | NOT CONFIRMED from the captured 2026-specific source — Item B is HOLD |
| "Skilled" jobs definition | Definition not confirmed from source — blocked |
| Importing Item B before hold is released | Phase 6C-36 hold: official 2026 source for this band's June 30 date not captured |

---

## CTA behavior

- **Primary CTA (EN):** "Read the full MoHRE breakdown" → links to `/news/uae-emiratisation-june-30-2026-deadline`
- **Primary CTA (RU):** "Читать подробнее" → links to `/ru/news/uae-emiratisation-june-30-2026-deadline`
- **Secondary CTA (optional):** "Talk to a hiring specialist" → WhatsApp CTA (standard Guidex WhatsApp flow)
- **Do NOT include:** any external MoHRE URL directly in the calendar item visible to users — link to the Guidex news post which cites the source

---

## Source note (for admin and editorial use)

**Item A (50+ employees):** Confirmed from MoHRE news article (7 May 2026) + MoHRE Emiratisation targets page. Both sources captured 2026-05-19. June 30 2026 deadline confirmed. Item A is owner_review_ready.

**Item B (20–49 employees):** HOLD. The MoHRE targets page confirms this threshold exists (1 UAE national in a skilled job). However, the 2026-specific MoHRE news article (7 May 2026) does not clearly confirm that June 30 2026 is the deadline for this band. The existing captured source for this band is from January 2024 (beginning of implementation). This is not sufficient to publish June 30 2026 as the deadline for the 20–49 band. Source needed: a 2026 MoHRE announcement explicitly naming June 30 (or any 2026 date) as the deadline for companies with 20–49 employees.

**Source ledger:** `docs/content-drafts/source-ledgers/uae-mohre-compliance-2026-sources.md`
**Phase 6C-36 decision:** Item A — owner_review_ready. Item B — hold / source_pending.

---

## Risk and editorial notes

- **High-risk topic** — employment law, government compliance. Do not add claims beyond what sources confirm.
- **Scope precision is mandatory** — every calendar item and every description must state: mainland, private-sector, and the employee-count threshold.
- **30 June date:** confirmed from MoHRE official source; recheck before publish.
- **Financial contributions note:** confirmed that non-compliant companies face contributions from 1 July 2026; AED amounts are blocked.
- **Do not conflate the two thresholds** — 50+ employees and 20–49 employees have different quota requirements and must appear as separate calendar items if both are imported.
- **noindex_after: 2026-07-10** — this is a time-sensitive deadline item; after the deadline has passed for 10 days, the page may be de-indexed (but is kept public for archival value as `keep_public`).

---

## Admin import notes

When approved for publish:

1. Import Item A (50+ employees) — owner_review_ready after Phase 6C-36. Owner approval + source recheck required.
2. Do NOT import Item B (20–49 employees) — HOLD until hold condition is met (see Item B section above).
3. Link Item A to news post: `uae-emiratisation-june-30-2026-deadline`
4. Set `noindex_after: 2026-07-10` for Item A in calendar `dates_json` when DB supports lifecycle fields
5. Item A is standalone — do not merge with any other item
6. Use slug-based queries on production (do not hardcode UUIDs)
7. Recheck MoHRE news source and targets page are live before import

---

## Phase 6C-49 correction — public notes fields

**Date:** 2026-05-22 | **Issue:** Internal label "Calendar Item B" / "Пункт B" was imported into public-facing `en_notes` / `ru_notes` fields. Also "2026-специфичным" compound in RU notes.

**Corrected `en_notes` (for Phase 6C-50 DB write):**
```
Applies to private-sector mainland companies with 50 or more employees only. For companies with 20 to 49 employees: the June 30 2026 deadline for that band has not been confirmed from an official 2026 source. Check with MoHRE for your applicable deadline.
```

**Corrected `ru_notes` (for Phase 6C-50 DB write):**
```
Распространяется только на компании частного сектора материкового ОАЭ с 50 и более сотрудниками. Для компаний с 20–49 сотрудниками: дата 30 июня 2026 года для этой категории не подтверждена официальным источником 2026 года. Уточните применимый срок в MoHRE.
```

No factual changes — scope fact preserved. Internal labels removed, RU naturalness fixed. DB write requires Phase 6C-50 approval.

---

*This is a draft file — internal use only. Not for publish. No admin action. No DB write.*
*Created: 2026-05-20 (Phase 6C-35). Updated: 2026-05-20 (Phase 6C-36) — Item B reclassified to HOLD. Item A promoted to owner_review_ready. Updated: 2026-05-22 (Phase 6C-49) — corrected public notes text added.*
*Item A: owner_review_ready — import pending owner approval + pre-import source recheck.*
*Item B: HOLD — 30 June 2026 not confirmed for 20–49 employee band from official MoHRE sources.*

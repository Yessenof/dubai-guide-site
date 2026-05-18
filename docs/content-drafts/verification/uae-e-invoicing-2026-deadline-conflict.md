# UAE E-Invoicing 2026 Deadline Conflict Verification

## Verification status

```
status:                  verification_file
publish_status:          not_for_publish_yet
risk_level:              high
topic:                   UAE e-invoicing ASP deadline
conflict:                31 July 2026 baseline vs 30 October 2026 reported extension
current_decision:        do_not_publish_final_deadline_yet
owner_review_required:   true
admin_status:            not_used
ai_inbox_status:         not_used
db_status:               not_touched
```

---

## Baseline official source

**Reference ledger:** `docs/content-drafts/source-ledgers/uae-e-invoicing-2026-sources.md`

| Field | Value |
|---|---|
| Authority | UAE Ministry of Finance (mof.gov.ae) |
| Document | UAE Electronic Invoicing Guidelines V-1.0 |
| Document date | 23 February 2026 |
| URL | https://mof.gov.ae/wp-content/uploads/2026/02/UAE-Electronic-Invoicing-Guidelines_V-1.0-23Feb2026.pdf |
| Status | official_baseline |
| Claim supported | ASP appointment deadline for businesses with annual revenue equal to or above AED 50 million: **31 July 2026** |
| Limitation | This is the February 2026 version. Later official amendments may have changed the deadline. The document must be rechecked before any deadline date is published. |

---

## Amendment signals

The following sources report that the ASP appointment deadline for large businesses (annual revenue ≥ AED 50 million) was extended from 31 July 2026 to **30 October 2026**. None of these alone are sufficient for Guidex to publish a confirmed deadline.

| # | Source | URL | Reliability | Reported claim | Can Guidex publish from this alone? | Notes |
|---|---|---|---|---|---|---|
| 1 | Khaleej Times | https://www.khaleejtimes.com/business/uae-extends-e-invoicing-service-provider-deadline-to-october-2026 | trusted_media_signal | ASP deadline extended from 31 July 2026 to 30 October 2026 for businesses with annual revenue above AED 50m | No | Reputable UAE media. Does not cite a specific MoF decision number or PDF URL. Signal only. |
| 2 | Gulf News | https://gulfnews.com/business/uae-announces-extension-of-einvoicing-provider-deadline-to-october-2026-1.500535895 | trusted_media_signal | MoF announced targeted amendments; ASP deadline moved to 30 October 2026 | No | References MoF announcement but does not link to official source document. Signal only. |
| 3 | Professional services and technology sites | Multiple — not individually captured | secondary_signal | 30 October 2026 ASP appointment deadline for large businesses | No | Multiple advisory firms and software vendors reporting consistently. Increases likelihood of a real amendment, but all may be referencing the same upstream media or an unofficial briefing. |
| 4 | UAE Ministry of Finance LinkedIn or official social | Not yet captured — to be checked | official_social_signal_if_verified | Targeted amendments to e-invoicing decisions, including ASP deadline extension | Not unless a direct official post or decision URL is captured and archived | Official social presence only qualifies if the post links to or reproduces a decision or official announcement. A post alone is not sufficient — it must lead to a citable official document. |

**Summary:** Two trusted UAE media outlets and multiple professional services firms consistently report a 30 October 2026 extension. This convergence is a strong signal that an official amendment exists. However, Guidex has not yet captured the official MoF document or decision page confirming this change. **Publication remains blocked.**

---

## Official source still needed

Complete this checklist before any content publishes the 30 October 2026 deadline as confirmed.

- [ ] **Official MoF press release or news page** announcing the e-invoicing deadline extension — check mof.gov.ae/news or mof.gov.ae/en/MediaCenter
- [ ] **Official amendment to Ministerial Decision No. 244 of 2025** — the primary legal instrument governing the e-invoicing mandate; an amendment to this decision would be the authoritative source for a revised deadline
- [ ] **Official PDF or decision document** showing 30 October 2026 as the current ASP appointment deadline for large businesses
- [ ] **Updated MoF e-invoicing landing page** — check whether mof.gov.ae/einvoicing (or equivalent) shows a current timeline with the revised date
- [ ] **Official ASP timeline or implementation schedule** — any MoF page listing current deadlines by business category

---

## Current editorial rule

Until an official MoF amendment source is captured, apply these rules in all Guidex content drafts.

**Allowed:**

- "The February 2026 MoF guideline gives a baseline ASP appointment deadline of 31 July 2026 for businesses with annual revenue of AED 50 million or more."
- "Trusted UAE media report a possible extension of this deadline to 30 October 2026. Guidex is verifying the latest official MoF amendment before publishing a confirmed date."
- "Business owners should check the current official MoF e-invoicing page for the most recent deadline before making decisions."

**Not allowed:**

- "The ASP deadline is 30 October 2026." — stated as a confirmed fact without official source
- "The ASP deadline remains 31 July 2026." — stated as the latest/current deadline without checking for amendments
- Any penalty amount or penalty description without an official Cabinet Decision or MoF/FTA source
- "All companies must comply by [date]." — deadline differs by revenue category; no single date applies to all
- "SMEs have the same deadline as large businesses." — SME ASP deadline is 31 March 2027 per the February 2026 guideline
- Any framing that implies the deadline conflict has been resolved

---

## Draft wording allowed for internal notes only

These formulations may appear in internal draft files. They are **not approved for published Guidex content** until the official amendment is captured.

**EN:**

The February 2026 MoF guideline lists 31 July 2026 as the ASP appointment deadline for businesses with annual revenue of AED 50 million or more. Later media reports indicate this deadline may have been extended to 30 October 2026. Guidex will not publish the revised deadline until the official MoF amendment is captured.

**RU:**

В февральском руководстве MoF указан срок выбора ASP до 31 июля 2026 года для компаний с годовой выручкой от AED 50 млн. Более поздние публикации в медиа сообщают о возможном переносе срока на 30 октября 2026 года. Guidex не будет публиковать обновлённую дату как подтверждённую, пока не будет зафиксирован официальный источник MoF.

---

## Impact on content production

| Content item | Impact | Status |
|---|---|---|
| News draft (`uae-e-invoicing-2026-asp-deadline-update.md`) | Remains blocked. The news angle is the deadline update itself. Cannot publish without confirming which date is current and official. | blocked |
| Guide draft (`uae-e-invoicing-2026-business-readiness.md`) | Can begin as a general readiness guide (what an ASP is, what businesses should prepare) without stating the final deadline — or wait until the conflict is resolved and include the deadline as a confirmed fact. Owner decision required. | conditional — owner to decide |
| Calendar visual post (`uae-e-invoicing-2026-deadlines.md`) | Remains blocked. The primary value of the calendar post is the deadline dates. Publishing with a contested date would be wrong. | blocked |
| Calendar item C (large business ASP deadline date) | Remains at `conflict_requires_official_latest_source`. Cannot change confidence level until official MoF amendment is captured. | blocked |
| Source ledger (`uae-e-invoicing-2026-sources.md`) | Can be updated with official amendment URL once found. Cross-link to this file already added. | open for update |
| E-invoicing as first published compliance topic | This topic should not be the first compliance topic Guidex publishes if the deadline conflict is unresolved. Eid Al Adha 2026 (federal holiday dates — fully confirmed) is a better first publication. | deferred |

---

## Next research actions

When owner approves a source verification sprint, carry out the following in order:

1. **Search mof.gov.ae for Ministerial Decision No. 244 of 2025 and any published amendment.** Check the official legislation/decisions section of the MoF site. If an amendment exists, it may be listed as a new ministerial decision or an addendum to the original.

2. **Search the MoF news and media center for e-invoicing targeted amendments.** Look for any MoF press release dated after February 2026 that references the e-invoicing programme and the 30 October deadline. The Gulf News article references "targeted amendments" — this phrasing may appear in the official release.

3. **Check the UAE legislation portal.** uaelegislation.gov.ae or cabinet.gov.ae may list the amendment to the relevant ministerial or cabinet decision. Search for e-invoicing, electronic invoicing, or the decision numbers.

4. **Check the MoF official LinkedIn page** for any post referencing the deadline extension — and follow any link in that post to the original official document. Do not cite the LinkedIn post itself; use it only as a route to the official source.

5. **Once official URL is found:** Record in the source ledger under a new "Source B — MoF Amendment" entry. Update calendar item C confidence from `conflict_requires_official_latest_source` to `confirmed`. Update the news draft unlock condition.

6. **Update this file and the source ledger** after official confirmation. Change status from `verification_file` to `resolved` and record the resolution date.

---

## Resolution log

| Date | Action | Result |
|---|---|---|
| 2026-05-18 | MoF February 2026 baseline captured | ASP deadline baseline: 31 July 2026 — official_baseline_source |
| 2026-05-18 | Khaleej Times + Gulf News signals captured | Extension to 30 October 2026 reported — source_signal_only |
| 2026-05-18 | This verification file created | Conflict documented, publication blocked, research actions defined |
| — | Official MoF amendment source search | Pending owner approval for research sprint |

---

*This is a verification file — internal use only. Nothing in this file is published. No admin action. No DB write.*  
*Last updated: 2026-05-18 — conflict documented, official MoF amendment not yet captured, all deadline-dependent content blocked.*

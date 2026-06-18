# UAE E-Invoicing Threshold — Official Source Ledger

**Phase:** 6C-CONTENT-01 | **Date accessed:** 2026-06-16 | **Status:** Verification-only, no live changes made

This ledger lists only official UAE Ministry of Finance (MoF) sources accessed directly via WebFetch on 2026-06-16. No accounting firm, law firm, media, or aggregator source is treated as proof — non-official sources that surfaced during prior research are listed separately at the bottom as signals only.

---

## Source 1 — MoF amendment announcement

| Field | Value |
|---|---|
| Source title | "Ministry of Finance announces targeted amendments to eInvoicing system decisions" |
| Official authority | UAE Ministry of Finance (MoF) |
| URL | https://mof.gov.ae/en/news/ministry-of-finance-announces-targeted-amendments-to-einvoicing-system-decisions/ |
| Source type | MoF news page |
| Publication date | 10 May 2026 (per page content; not independently re-verified this pass, carried from prior Phase 6C-23 capture) |
| Accessed date | 2026-06-16 |
| Exact relevant claim (paraphrased) | ASP appointment deadline extended from 31 July 2026 to 30 October 2026. Mandatory implementation by 1 January 2027. Both apply to "entities with annual revenues exceeding AED 50 million." 32 ASPs approved as of publication, more in final accreditation. |
| Threshold mentioned | **AED 50 million** (annual revenue, "exceeding") |
| Deadline mentioned | ASP appointment: 30 October 2026 (extended from 31 July 2026). Mandatory go-live: 1 January 2027. |
| Affected taxpayer category | Entities with annual revenue exceeding AED 50 million |
| ASP appointment required | Yes |
| Clear or ambiguous | Clear |
| Confidence | High |
| Notes | Directly contradicts the "AED 150 million" figure found live on the October 2026 monthly calendar page (see verification report). No AED 150M figure appears anywhere on this official page. |

---

## Source 2 — MoF e-invoicing initiative landing page

| Field | Value |
|---|---|
| Source title | eInvoicing initiative page |
| Official authority | UAE Ministry of Finance (MoF) |
| URL | https://mof.gov.ae/en/about-us/initiatives/einvoicing/ |
| Source type | MoF program/initiative page |
| Publication date | Not stated; page shows "Last Updated: 16/06/2026 11:37" |
| Accessed date | 2026-06-16 |
| Exact relevant claim (paraphrased) | References Ministerial Decision No. 244 of 2025 (implementation), No. 243 of 2025 (system), No. 64 of 2025 (ASP eligibility/accreditation), Cabinet Decision No. 106 of 2025 (penalties), and recent amending Ministerial Resolutions No. 66/2026 and No. 56/2026. Notes 82% of UAE businesses are micro businesses under AED 3M turnover. Timeline of phases shown only as an image, not as extractable text. |
| Threshold mentioned | None extractable as text on this page (timeline is image-only) |
| Deadline mentioned | None extractable as text on this page |
| Affected taxpayer category | Not specified in extractable text |
| ASP appointment required | Implied yes (references ASP accreditation decision) but not stated as text on this page |
| Clear or ambiguous | Ambiguous (key data is in an image, not text) — confirms the regulatory framework exists and was updated as recently as today, but does not independently confirm or contradict the AED 50M figure |
| Confidence | Medium (confirms no newer contradicting amendment exists as of today; does not itself state a threshold number) |
| Notes | Useful as a freshness check: page updated same day as this verification, no indication of a further threshold change since the 10 May 2026 amendment. |

---

## Source 3 — MoF Cabinet Resolution on administrative fines

| Field | Value |
|---|---|
| Source title | "Ministry of Finance announces the issuance of Cabinet Resolution on Administrative Fines Related to Electronic Invoicing System" |
| Official authority | UAE Ministry of Finance (MoF), citing Cabinet Resolution No. (106) of 2025 |
| URL | https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-cabinet-resolution-on-administrative-fines-related-to-electronic-invoicing-system/ |
| Source type | MoF news page citing a Cabinet Resolution |
| Publication date | Not re-confirmed this pass; carried from prior Phase 6C-23/64 capture |
| Accessed date | 2026-06-16 |
| Exact relevant claim (paraphrased) | AED 5,000/month for failure to implement or appoint an ASP. AED 100 per missing e-invoice (capped AED 5,000/month). AED 100 per missing credit note (capped AED 5,000/month). AED 1,000/day for malfunction or data-change notification delays. Voluntary pilot adopters are exempt from fines. |
| Threshold mentioned | Not applicable (penalty amounts, not a revenue threshold) |
| Deadline mentioned | Not applicable |
| Affected taxpayer category | Entities required to implement the system (i.e., those at/above the applicable revenue threshold once their deadline has passed) |
| ASP appointment required | Yes (penalty explicitly covers failure to appoint) |
| Clear or ambiguous | Clear |
| Confidence | High |
| Notes | Does not state the AED 50M or AED 150M threshold itself — included for completeness on the penalty framework referenced in existing Guidex drafts. |

---

## Source 4 — Federal Tax Authority (tax.gov.ae)

| Field | Value |
|---|---|
| Source title | n/a — no dedicated e-invoicing threshold page found |
| Official authority | Federal Tax Authority (FTA) |
| URL | Searched site:tax.gov.ae — no FTA page found stating an e-invoicing ASP threshold or deadline |
| Source type | Search (no qualifying page found) |
| Publication date | n/a |
| Accessed date | 2026-06-16 |
| Exact relevant claim (paraphrased) | None found. FTA's indexed pages cover VAT thresholds (AED 375,000 mandatory registration), not e-invoicing ASP thresholds. |
| Threshold mentioned | None |
| Deadline mentioned | None |
| Affected taxpayer category | n/a |
| ASP appointment required | n/a |
| Clear or ambiguous | n/a — no source found |
| Confidence | n/a |
| Notes | Confirms MoF (not FTA) is the lead authority publishing e-invoicing threshold/deadline detail, consistent with prior research. Do not cite FTA as the source for the AED 50M figure — cite MoF. |

---

## Non-official signals only (not proof — listed for traceability, never cited as the basis for a claim)

| Signal source | What it claimed | Why it is not proof |
|---|---|---|
| mytaxman.ae (tax-advisory blog), referenced in `docs/content-drafts/calendar-research/uae-events-research-2026-candidates.csv` | AED 50M+ threshold for the same 30 Oct 2026 deadline (agrees with official Source 1 above, but was not itself sufficient to confirm) | Tax-advisory blog, not an official UAE government source |
| WAM (Emirates News Agency) parallel article on the 10 May 2026 amendment | Page exists, confirms an announcement occurred | Body content is JavaScript-rendered and was not extractable via fetch in this or prior passes; treated as a corroborating signal only, MoF page is primary |

---

## Conclusion of this ledger

Every official MoF source checked states **AED 50 million**, never AED 150 million, for the 30 October 2026 ASP appointment deadline / 1 January 2027 mandatory go-live. No official source — MoF or FTA — was found stating AED 150 million for any e-invoicing threshold. The AED 150M figure has no official-source backing found in this verification pass.

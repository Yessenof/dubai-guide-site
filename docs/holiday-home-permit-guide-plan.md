# Holiday Home Permit Dubai — Guide Plan (CP-HH-01)

---

## Local Guide Draft Status (CP-HH-02B)

**Date:** 2026-05-02
**Status:** Draft created locally via `scripts/add-holiday-home-permit-guide.ts`

- Slug: `holiday-home-permit-dubai`
- Category: `tourism`
- Published: false (DRAFT)
- Steps: 12
- EN fields: populated
- RU fields: empty (not yet translated)
- DB backup: `data/guides.db.backup-holiday-home-guide-1777714931`
- Build: 63 pages, 0 errors
- Production: untouched

**Admin review URL:** http://localhost:3000/admin/guides/holiday-home-permit-dubai
**Public URL (after publish):** http://localhost:3000/guides/holiday-home-permit-dubai

**Next actions:**
1. Owner reviews guide via admin panel
2. Publish via admin panel (Save and Publish)
3. Deploy: commit script + category changes, push, SSH, backup production DB, run script on production, build, restart PM2

---

Planning document only. No implementation beyond what is recorded above.

---

## 1. Executive Summary

**Opportunity:** "Holiday home permit Dubai" and "Airbnb permit Dubai" are high-intent, underserved queries with growing search volume. Dubai's DET (Department of Economy and Tourism) runs a regulated permit system for short-term rentals. Anyone listing a residential unit on Airbnb, Booking.com, or similar platforms must obtain a holiday home permit. The process is multi-step and portal-based — exactly the type of procedural content this site ranks for.

**Guide profile:**
- Type: Government procedure guide (DET-regulated)
- Audience: Property owners and investors wanting to legally list Dubai units on short-term rental platforms
- Intent: "What do I need to do, in what order, to get a permit and stay compliant?"
- Scope: First-time permit only (not renewal, not operator licence — those are separate flows)
- Slug: `holiday-home-permit-dubai`
- Category: New — `tourism` (requires taxonomy update, see Section 5)

**Effort:** Medium. No script needed for EN content — standard admin panel flow. DB schema change required for new category value. Taxonomy constant update required.

---

## 2. Official Source Findings

All findings based on DET portal observation and official DET materials.

### Issuing authority
- **Department of Economy and Tourism (DET)**, formerly DTCM (Dubai Tourism and Commerce Marketing)
- Portal: Holiday Homes section within DET Apply / HH Permits portal

### Permit types (two separate licences)
1. **Holiday Home Permit** — issued per unit, to the property owner (or their authorised representative). Required before any short-term listing goes live.
2. **Holiday Home Operator Licence** — issued to the operator entity managing multiple units on behalf of owners. Not covered in this guide.

### Fee formula (per permit application)
| Component | Amount |
|---|---|
| Base permit fee | AED 300 per bedroom |
| Classification fee | AED 50 |
| Knowledge fee | AED 10 |
| Innovation fee | AED 10 |
| **1-bedroom unit total** | **AED 370** |
| **2-bedroom unit total** | **AED 670** |
| **3-bedroom unit total** | **AED 970** |

### Permit duration
- 1 year from date of issuance. Annual renewal required.

### Tourism Dirham (ongoing obligation post-permit)
- **Deluxe classification:** AED 15 per room per night
- **Standard classification:** AED 10 per room per night
- Collected from guests, remitted to DET. Not part of the permit application — a separate ongoing compliance obligation.

### Unit statuses observed in portal
- Approved
- About To Expire
- Pending
- Rejected
- Renewal Under Review
- Approved — Under Review
- Renewal Payment Pending Approval

### Classification tiers
DET classifies each unit as Deluxe or Standard based on a checklist. Classification is assessed during the inspection stage. The checklist covers approximately 8 groups of criteria (amenities, furnishing quality, safety equipment, etc.). Classification affects Tourism Dirham rate.

### Key official terms to use
- Holiday Home Permit (not "short-term rental licence")
- DET (not DTCM — rebranded)
- Tourism Dirham (specific levy name)
- Classification (Deluxe / Standard)
- Unit (not property, apartment, villa)

---

## 3. Screenshot Workflow Findings

### Portal flow observed (6 stages)
The DET holiday homes portal uses a linear multi-stage form:

| Stage | Label |
|---|---|
| 1 | Unit Information |
| 2 | Documents |
| 3 | Review |
| 4 | Associated Forms |
| 5 | Pay Fees |
| 6 | Record Issuance |

### Stage 1 — Unit Information
Applicant provides: unit details, number of bedrooms, building, location. Portal likely cross-references with DEWA account / municipality records. Exact fields: unit type, number of bedrooms, building name, area.

### Stage 2 — Documents
Upload required documents (see Section 6, Step 3 for full list). Documents validated before proceeding.

### Stage 3 — Review
DET reviews the application. This is the main processing stage — status may show "Pending" during review.

### Stage 4 — Associated Forms
Additional regulatory forms (e.g., Tourism Dirham registration confirmation, owner declarations). These must be completed before payment is allowed.

### Stage 5 — Pay Fees
Payment of AED 300/bedroom + AED 50 + AED 10 + AED 10. Online payment only. No cash.

### Stage 6 — Record Issuance
Permit issued digitally. Owner receives permit certificate. Unit can now be listed legally.

### Post-issuance compliance steps
- Display DET permit number on all listings (Airbnb, Booking.com, etc.)
- Collect Tourism Dirham from each guest
- Remit Tourism Dirham to DET (typically monthly)
- Book and pass physical classification inspection (may occur before or after initial permit approval — verify)
- Renew permit annually before expiry

---

## 4. SEO / Competitor Gap

### Primary keywords (EN)
- "holiday home permit Dubai" — high intent, low competition
- "Airbnb permit Dubai" — very high search volume, consumer-friendly framing
- "DET holiday homes registration" — official process name
- "short term rental permit Dubai" — broader variant
- "Dubai holiday home operator license" — secondary (operator route, different audience)

### Secondary keywords
- "how to rent out my apartment in Dubai legally"
- "Tourism Dirham Dubai"
- "DET holiday home classification Dubai"
- "holiday home permit Dubai cost"
- "holiday home permit Dubai renewal"

### Competitor gap
Most existing search results for "Airbnb permit Dubai" lead to:
- Real estate agency blogs (not step-by-step, outdated, promotional)
- DET's own portal pages (no process narrative)
- Airbnb's own help pages (platform-specific, not permit-focused)

None provide a clean, neutral, step-by-step procedural guide matching this site's format. This is an underserved slot.

### AI answer gap
ChatGPT and Perplexity currently provide vague, incomplete answers for "how to get a holiday home permit in Dubai" — missing exact fees, portal workflow, and Tourism Dirham obligations. A well-structured guide here can capture AI citation traffic.

### Suggested meta title
`Holiday Home Permit Dubai: DET Registration Guide (2025)`

### Suggested meta description
`Step-by-step guide to getting a DET Holiday Home Permit in Dubai. Covers documents, fees (from AED 370), the online portal workflow, classification, and Tourism Dirham obligations.`

---

## 5. IA and Naming Recommendation

### New category required
The existing 5-category taxonomy does not cover tourism or short-term rentals. This guide should not be forced into `living` or `government`. A new category is required.

| Value | Label (EN) | Label (RU) |
|---|---|---|
| `tourism` | Tourism & Short-Term Rentals | Туризм и краткосрочная аренда |

**Required taxonomy change:**
1. Add `tourism` to the `CATEGORIES` constant in [components/admin/GuideFormFields.tsx](components/admin/GuideFormFields.tsx)
2. Add the label to the category display map used in public-facing components ([components/TopicCard.tsx](components/TopicCard.tsx), [components/Header.tsx](components/Header.tsx), browse pages)
3. No DB schema change required — `category` is a free-text VARCHAR column

**Homepage card:**
- EN: "Tourism & Short-Term Rentals"
- RU: "Туризм и краткосрочная аренда"
- Future: a `/tourism` hub page linking all guides in this category (see Section 8)

### Slug
`holiday-home-permit-dubai`

### URL
`/guides/holiday-home-permit-dubai`

### Page title (H1)
`How to Get a Holiday Home Permit in Dubai`

### Guide title (DB)
`How to Get a Holiday Home Permit in Dubai`

---

## 6. Recommended Guide Structure

12 steps. Covers the full first-permit journey: pre-application prep → portal submission → compliance setup.

### Guide-level fields

**Title:** How to Get a Holiday Home Permit in Dubai

**Summary:** Step-by-step guide to registering a Dubai residential unit for short-term rental under a DET Holiday Home Permit. Covers documents, portal stages, fees from AED 370 per unit, classification, and Tourism Dirham.

**Who this is for:** Property owners in Dubai who want to legally rent out a residential unit on Airbnb, Booking.com, or similar platforms. Covers first-time permit applications only — not operator licences or renewals.

**Price:** From AED 370 per unit (AED 300 per bedroom + AED 50 classification + AED 10 Knowledge + AED 10 Innovation). A 1-bedroom unit costs AED 370; a 2-bedroom unit costs AED 670.

**Timeline:** 2–4 weeks from application submission (varies by DET review queue and inspection scheduling).

**Overview:**
Para 1: Dubai requires a DET Holiday Home Permit for any residential unit offered for short-term rental, regardless of platform. The permit is issued per unit, to the property owner or an authorised representative, and is valid for one year. It is distinct from the Holiday Home Operator Licence, which covers entities managing multiple units commercially.

Para 2: The application is submitted through the DET portal in six stages: Unit Information, Documents, Review, Associated Forms, Pay Fees, and Record Issuance. Once approved, permit holders must also collect and remit the Tourism Dirham from guests and comply with annual renewal requirements.

---

### Steps

**Step 1 — Confirm your unit qualifies**
- What: Verify the unit is a residential property (apartment or villa) in Dubai, that you hold the title deed (or a valid lease with sub-letting rights), and that the unit is not already under an active permit under a different owner or operator.
- Where: DLD (Dubai Land Department) records / Oqood
- Address/portal: dubailand.gov.ae or the DLD app
- Advice: Hotel apartments and serviced apartment buildings fall under a different regulatory category. Confirm with DET if your building type is eligible before starting the application.

**Step 2 — Prepare required documents**
- What: Gather all documents required for the portal upload stage. Incomplete submissions are a common reason for delays and rejections.
- Where: Prepare locally; upload in DET portal
- Address/portal: No physical address — digital upload
- Advice: Scan documents at high resolution. The portal validates file type and size. Use PDF or JPG.
- Required documents (standard list):
  - Title deed (original owner) or lease agreement with sub-letting clause (tenant)
  - Owner's passport copy + Emirates ID
  - Unit photos (interior and exterior — minimum count varies)
  - Floor plan
  - Building completion certificate (if new building)
  - DEWA connection confirmation (proof of active utilities)
  - No Objection Certificate from building management or developer (required for some buildings — check with your building management)

**Step 3 — Create DET portal account**
- What: Register at the DET holiday homes portal if you do not already have an account. Use your Emirates ID details.
- Where: DET Holiday Homes portal
- Address/portal: tourism.gov.ae (DET Apply section — Holiday Homes)
- Advice: Individual owner and corporate owner accounts have different registration paths. If the permit will be in a company name, register as a corporate applicant.

**Step 4 — Start application: Unit Information stage**
- What: Enter unit details — unit type, number of bedrooms, building name, and location. The portal uses this to calculate the permit fee.
- Where: DET portal — Stage 1 of 6
- Address/portal: tourism.gov.ae
- Advice: The bedroom count drives the fee formula. Count bedrooms accurately — a studio is 0 bedrooms for fee calculation (verify exact DET treatment for studios at time of application).

**Step 5 — Upload documents**
- What: Upload all documents prepared in Step 2. Complete all required fields before advancing to the Review stage.
- Where: DET portal — Stage 2 of 6
- Address/portal: tourism.gov.ae
- Warning: Incomplete or low-quality uploads will stall the application at the Review stage. DET may request re-submission, adding days to the timeline.

**Step 6 — DET review (pending stage)**
- What: DET reviews the application. No action required from the applicant during this stage. Status shows as Pending.
- Where: DET portal — Stage 3 of 6
- Estimated time: 5–10 working days (varies by review queue)
- Advice: Monitor the portal for status changes. DET may send an email or SMS notification when the review is complete or if additional information is needed.
- Warning: If status moves to Rejected, the portal provides a reason. Common rejection causes: missing NOC, title deed mismatch, incomplete document set.

**Step 7 — Complete associated forms**
- What: Complete any additional regulatory forms required before payment — typically includes Tourism Dirham registration acknowledgement and owner declarations.
- Where: DET portal — Stage 4 of 6
- Address/portal: tourism.gov.ae
- Advice: Read each form carefully. Declarations confirm awareness of Tourism Dirham obligations and permit conditions.

**Step 8 — Pay permit fee**
- What: Pay the calculated permit fee online. Fee = AED 300 × number of bedrooms + AED 50 (classification) + AED 10 (Knowledge) + AED 10 (Innovation).
- Where: DET portal — Stage 5 of 6
- Cost: AED 370 for a 1-bedroom unit; AED 670 for a 2-bedroom unit; AED 970 for a 3-bedroom unit
- Address/portal: tourism.gov.ae — online payment only
- Advice: Keep the payment receipt. It serves as proof of application completion until the permit certificate is issued.

**Step 9 — Permit issued (record issuance)**
- What: Once payment is confirmed, DET issues the holiday home permit. Download and save the permit certificate from the portal.
- Where: DET portal — Stage 6 of 6
- Address/portal: tourism.gov.ae
- Advice: The permit certificate includes your permit number. This number must appear on all platform listings (Airbnb, Booking.com, etc.) and must be displayed in the unit.

**Step 10 — Schedule classification inspection**
- What: DET conducts a physical inspection to classify the unit as Deluxe or Standard. Classification determines the Tourism Dirham rate charged to guests.
- Where: Unit location — DET inspector visits
- Time estimate: Inspection typically scheduled within 2–4 weeks of permit issuance
- Advice: Prepare the unit to meet classification requirements before the inspection. DET's checklist covers amenities, furnishing quality, safety equipment (fire extinguisher, first aid kit, smoke detector), and general condition. A Deluxe classification results in a higher Tourism Dirham rate (AED 15/room/night vs AED 10/room/night for Standard).

**Step 11 — Add listing to platform with permit number**
- What: Update your Airbnb, Booking.com, or other platform listing to include the DET permit number. Operating without a displayed permit number violates DET regulations.
- Where: Platform account settings (Airbnb Host Dashboard, Booking.com Extranet, etc.)
- Address/portal: Platform-specific — no single URL
- Warning: Platforms including Airbnb enforce permit number requirements for Dubai listings. Listings without a valid permit number may be suspended.

**Step 12 — Set up Tourism Dirham collection**
- What: Collect the Tourism Dirham from every guest at check-in and remit to DET on the required schedule (typically monthly). This is a separate ongoing obligation from the permit itself.
- Where: DET Tourism Dirham portal
- Cost: AED 15 per room per night (Deluxe) or AED 10 per room per night (Standard) — collected from guests, not an owner cost
- Advice: Build Tourism Dirham collection into your booking confirmation and check-in process from day one. Failure to remit is a regulatory violation. DET provides reporting and payment tools in the portal.

---

## 7. Privacy and Legal Cautions

**Never publish in public-facing content:**
- Owner names or Emirates ID numbers
- Specific unit numbers or flat numbers
- DEWA account numbers or consumer numbers
- DET permit numbers (they appear in screenshots but are personal identifiers)
- Payment references or transaction IDs
- Any portal screenshot that includes user-specific data

**How to handle in guide:**
- Reference "your permit number" generically — not a sample or example permit number
- Reference "your unit" — not a specific address
- Do not include real portal screenshots in guide content — describe the flow in text only

**Legal framing:**
- This site provides procedural information only, not legal advice
- Users should verify fee amounts and document lists at the official DET portal before applying — fees and requirements change
- Always direct users to tourism.gov.ae as the authoritative source

---

## 8. Future Web App Hub Opportunities

The holiday home permit process is a natural fit for interactive tools. These are future considerations only — not part of this guide build.

| Tool | Description |
|---|---|
| Fee calculator | Input bedroom count → output exact permit fee breakdown |
| Document checklist | Interactive checklist of required uploads, mark items as ready |
| Classification readiness checker | Self-assessment against Deluxe/Standard criteria |
| Renewal reminder | Email/SMS reminder 60 and 30 days before permit expiry |
| Tourism Dirham tracker | Monthly remittance calculator based on nights booked and classification |
| NOC requirement checker | Input building name/developer → flag if NOC is required |

These tools would sit under a `/tourism` hub page. The hub would link all tourism-category guides (holiday home permit, Tourism Dirham, operator licence, etc.) and surface the tools when built.

---

## 9. Implementation Plan

### Phase 1 — Taxonomy and DB prep (prerequisite)
1. Add `tourism` to `CATEGORIES` constant in [components/admin/GuideFormFields.tsx](components/admin/GuideFormFields.tsx)
2. Add label to category display maps in public components
3. No DB migration needed

### Phase 2 — Content entry
1. Create guide via admin panel at `/admin/guides/new`
   - Slug: `holiday-home-permit-dubai`
   - Category: `tourism`
   - Populate all guide-level fields per Section 6
2. Add all 12 steps via admin panel step editor
3. Save as draft. Do not publish yet.

### Phase 3 — EN content review
1. Start dev server: `npm run dev -- --hostname 0.0.0.0`
2. Preview at `/guides/holiday-home-permit-dubai`
3. Review all 12 steps for accuracy, style compliance, and SEO field quality
4. Check title, meta description, and H1
5. Fix any issues in admin panel
6. Confirm no em-dashes, no guarantee language, no personal data

### Phase 4 — Publish and deploy
1. Publish guide in admin panel (single form save-and-publish)
2. Run `npm run build` locally — verify 64 pages, 0 errors
3. Commit any taxonomy/component changes to GitHub
4. SSH into production, backup production DB, run build, restart PM2
5. Smoke test: `/guides/holiday-home-permit-dubai` returns 200, H1 correct, 12 steps visible

### Phase 5 — Post-publish
1. Submit updated sitemap to Google Search Console
2. Update `ROADMAP.md`, `PROJECT_STATE.md`, `SESSION_LOG.md`, `CHECKPOINTS.md`

### Estimated effort
- Taxonomy update: 20 minutes
- Content entry via admin panel: 45–60 minutes
- Review and polish: 30 minutes
- Deploy: 20 minutes
- Total: ~2 hours

---

## 10. Exact Next Single Action

**Add `tourism` to the CATEGORIES constant in [components/admin/GuideFormFields.tsx](components/admin/GuideFormFields.tsx).**

This is the single blocking prerequisite for all other steps. Without it, the admin panel dropdown will not offer `tourism` as a category, and the guide cannot be created in the correct taxonomy slot.

Exact change required:

```typescript
// In components/admin/GuideFormFields.tsx
export const CATEGORIES = [
  { value: "visas", label: "Visas" },
  { value: "company-setup", label: "Company Setup" },
  { value: "hiring", label: "Hiring" },
  { value: "living", label: "Living" },
  { value: "government", label: "Government" },
  { value: "tourism", label: "Tourism & Short-Term Rentals" }, // ADD THIS
] as const;
```

After adding this: update the category display map in any public component that renders category labels, then proceed to content entry.

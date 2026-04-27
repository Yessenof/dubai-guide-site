# Top Navigation Audit and Recommendation

Last updated: 2026-04-21

---

## Current State

```
Dubai Guide (logo) | Guides | About | Contact
```

### Grading each element

| Element | Grade | Problem |
|---|---|---|
| Dubai Guide logo | ✅ | Correct — logo-as-home is universal |
| Guides | C | Vague. "Guides" is a drawer, not a destination. Gives no information about what the site covers. Ad-traffic users scanning the page see no category signals. |
| About | D | Primary nav is for destinations users navigate to in their task flow. Nobody clicks About mid-task. Belongs in footer. |
| Contact | D | Same issue as About. Contact is a footer action, not a primary navigation destination. |

**Net result:** The current nav communicates nothing about the site's topical scope. A user arriving cold sees "Guides" and has no signal for whether this site covers their specific need. Category clusters — the primary navigation primitive for content-dense utility sites — are absent.

---

## Commercial Cluster Analysis

These are the top-level intent clusters for this site based on search behavior and business strategy:

| Cluster | Commercial priority | Content status | Hub status |
|---|---|---|---|
| Visas | **High** — largest search volume, widest audience | 6 guides live | ✅ `/visas`, `/visas/family`, `/visas/golden` |
| Company Setup | **High** — high-value users, low competition | 0 guides | ✗ no hub |
| Living | Medium — retention, repeat visits | 0 guides | ✗ no hub |
| Government | Medium — utility searches | 0 guides | ✗ no hub |
| Hiring | Lower — B2B, narrower audience | 0 guides | ✗ no hub |

**Navigation rule:** Do not add a nav item whose destination is an empty page or a generic guide list. Nav items must lead to a destination that delivers on the implied promise. Visas is the only cluster ready for a nav item today. Company Setup earns a nav item when the first guide ships and a hub page exists.

---

## Desktop Nav Recommendation

### Now (content-available clusters only)

```
Dubai Guide | Visas | Guides
```

- **Visas** → `/visas` — hub live, three sub-pages live, 6 guides live
- **Guides** → `/guides` — catch-all for all published guides across all categories
- About → footer
- Contact → footer

### Target (when first company-setup guide ships)

```
Dubai Guide | Visas | Company Setup | Guides
```

- **Company Setup** → `/company-setup` — hub page to build before the guide ships
- Guides stays as the universal catch-all

### Do not add

- A "Living" nav item until at least 2 living-category guides are live
- A "Government" or "Hiring" nav item at this scale of content
- A "Banking" nav item — bank account is a subroute of Company Setup, not a peer category
- A "Calculator" or "Find My Route" nav item — these are homepage features, not top-level nav destinations

---

## Mobile Nav Recommendation

The Header is `h-14` (56px). Logo occupies roughly 100px. Remaining right side holds ~160px — enough for 2–3 short nav items at the current `text-sm gap-6` pattern.

### Now

```
Dubai Guide | Visas | Guides
```

Two items. No hamburger. Same markup as desktop — the items are short enough to fit.

### Target (when Company Setup is live)

```
Dubai Guide | Visas | Company Setup | Guides
```

Three items. Still fits the current Header layout at `gap-6 text-sm`. No hamburger needed. Test at 375px when implementing — at that width, "Company Setup" at `text-sm` is ~120px, which may require reducing gap to `gap-4` or abbreviating to "Biz Setup".

**If three items do not fit at 375px:** use a hamburger only for the third item. Do not hide Visas or Guides behind a hamburger — those are primary-task links.

---

## About and Contact

**About:**
- Remove from primary nav immediately
- Add to footer: simple text link, no icon
- Rationale: nobody navigates to About mid-task. Its purpose is trust-building via footer presence, not primary navigation.

**Contact:**
- Remove from primary nav
- Keep in footer
- The CtaCard at the bottom of each guide page and the homepage already surfaces the contact action in context. A nav-level Contact link cannibalizes the in-context CTA and implies the user should navigate away before finishing reading.

---

## Company Setup in Navigation Logic

### What "Company Setup" covers

- Mainland company formation (DED)
- Freezone company formation (per freezone)
- Business bank account opening (ENBD, Mashreq, FAB, etc.)
- Office/flexi-desk requirements

### Bank account positioning

Bank account is **not** a peer category to company formation. It is Step 2 of the company setup flow for most users. Correct placement:

- Own guide: `/guides/open-business-bank-account-dubai` (standalone searchable article)
- Listed as a card within `/company-setup` hub: "Open a business bank account"
- Not a top-level QuickDecisionCard — too narrow, and implies the user already has a company formed
- Exception: if the guide attracts significant standalone search volume (users who already have a company and just need the bank account step), it can be promoted to a QuickDecisionCard at that point

### Company Setup hub structure (to build)

```
/company-setup                    → hub: mainland vs freezone decision, then bank account
/company-setup/mainland           → DED mainland formation guide
/company-setup/freezone           → freezone overview + per-zone guides
/company-setup/bank-account       → business bank account opening
```

---

## Implementation Order

1. **Now:** Update Header nav from `Guides | About | Contact` to `Visas | Guides` — About and Contact to footer
2. **When first company-setup guide ships:** Add `Company Setup` to nav + build `/company-setup` hub
3. **Do not add Living, Government, or Hiring** to nav until content exists

---

## Summary

| Decision | Recommendation |
|---|---|
| Final desktop nav | `Dubai Guide \| Visas \| Company Setup \| Guides` |
| Current desktop nav | `Dubai Guide \| Visas \| Guides` |
| Mobile nav | Same as desktop (fits h-14 at 375px with current text-sm gap-6) |
| About | Footer only |
| Contact | Footer only |
| Banking | Subroute of Company Setup hub, own guide, not a nav item |
| Add Company Setup to nav | When first company-setup guide ships |

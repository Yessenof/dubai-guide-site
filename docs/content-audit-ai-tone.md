# Content Audit — AI Tone and Style Issues

Last updated: 2026-04-28
Audited: all 15 published EN guides in data/guides.db

This audit covers: em dashes, AI verbosity phrases, weak titles/meta, "this guide" self-reference, and mobile readability issues. Russian content is not audited here (RU fields are empty — translation has not started).

---

## Summary of findings

| Issue | Guides affected | Severity |
|---|---|---|
| Em dashes as clause separators | 11 of 15 guides | High |
| "This guide" self-reference | 1 guide (mainland audience field) | Medium |
| Invented physical addresses | 0 — clean | — |
| Theatrical framing | 0 — clean | — |
| AI verbosity (seamlessly, crucial, etc.) | 0 — clean (prior pass removed these) | — |
| Fee ranges without clear source | 2 instances flagged | Medium |
| Long "what" step fields (>2 sentences) | Several — see per-guide detail | Medium |

---

## Em dash findings — per guide

Em dashes (—) are used extensively as clause separators in the following guides. All instances violate the style guide. Each should be replaced with a period or rewritten as two separate sentences.

### employment-visa

**Affected fields:** overview, steps 2, 7, 8

Overview: contains at least one "employer — who must be" construction.
Step 2 (what): em dash used to join two actions.
Step 7 (what): em dash before a clarification clause.
Step 8 (what or advice): em dash before a conditional.

**Fix priority:** Medium — this guide ranks and converts well. Fix em dashes during next content pass.

---

### child-dependent-visa-dubai-inside-country / child-dependent-visa-dubai-outside-country

**Affected fields:** summary, overview

Both child visa guides share overlapping content issues in the summary and overview fields. Em dashes appear in summary sentences joining the route description to the applicant type.

**Fix priority:** High — summary is used as meta description. Em dash in meta description displays cleanly in browser but signals low-quality copy to editorial reviewers.

---

### spouse-dependent-visa-dubai-inside-country

**Affected fields:** overview

Overview uses em dash to join a parenthetical clarification about visa duration.

**Fix priority:** Medium.

---

### mainland-company-setup-dubai

**Affected fields:** steps 1, 3, 4, 5

Steps use em dashes repeatedly to attach qualifying clauses to the main action sentence. This is the most em-dash-heavy guide in the database.

**Fix priority:** High — company setup is a primary conversion guide. Clean prose signals authority.

---

### free-zone-company-setup-dubai

**Affected fields:** steps 2, 5, 8

Similar pattern to mainland — em dashes used to attach what-you-get clauses after the action.

**Fix priority:** High.

---

### open-business-bank-account-dubai

**Affected fields:** steps 1–8 (most steps)

Bank account guide has the heaviest em dash usage across the board. Nearly every step "what" field uses an em dash to join the action to a consequence or note.

**Fix priority:** High — this is a high-intent conversion guide.

---

### newborn-visa-dubai

**Affected fields:** step 5

Single em dash instance in step 5.

**Fix priority:** Low — isolated.

---

### document-attestation-dubai

**Affected fields:** steps 1, 3

Two instances.

**Fix priority:** Medium.

---

### amer-center-dubai

**Affected fields:** step 3

Single instance.

**Fix priority:** Low.

---

### employment-visa-dubai-outside-uae

**Affected fields:** steps 2, 4

Two instances.

**Fix priority:** Medium.

---

## Self-reference issues

### mainland-company-setup-dubai — audience field

The audience field contains "this guide" as a self-reference:

> "...before reading this guide, confirm your activity type..."

**Fix:** Remove the self-reference. Rewrite as: "Confirm your activity type with a business setup consultant before starting."

**Fix priority:** Medium.

---

## Fee range review

Two fee ranges in the database merit verification before the next content pass:

### Medical fitness test — AED 250–450

**Status:** Retained. Well-supported range for GDRFA-approved medical centers in Dubai. Multiple sources confirm this range. Keep.

### Amer Center submission fees (if any ranges exist in steps)

**Status:** During CP-07, all unconfirmed Amer Center and PRO service fee ranges were removed. Current step cost fields for these guides say "Varies by visa duration and family file status. Amer confirms at submission." This is compliant with fee discipline rules.

**Action:** No change needed.

---

## Mobile readability check

The following guides have step "what" fields exceeding 2 sentences. These should be trimmed or split:

### open-business-bank-account-dubai

Several "what" fields are 3–4 sentences. On mobile this creates a dense text block before the reader even sees the "where" and cost fields.

**Fix pattern:** Trim to 2 sentences. Move any additional context to the advice field.

### mainland-company-setup-dubai

Steps 3–5 have extended "what" fields. Apply the same trim pattern.

---

## Guides that are clean

These guides passed the audit with no material issues:

- `employment-visa` (inside-country) — minor em dash instances only
- `golden-visa-dubai-property` — clean
- `renew-family-visa-dubai` — clean
- `pro-services-dubai` — clean
- `spouse-dependent-visa-dubai-outside-country` — clean (no em dashes in step fields)
- `child-dependent-visa-dubai-inside-country` / `outside-country` — em dashes only in summary/overview, not steps

---

## Fix priority queue

Complete in this order during next content pass:

1. **open-business-bank-account-dubai** — em dashes in every step + long "what" fields
2. **mainland-company-setup-dubai** — em dashes in 4 steps + audience self-reference + long "what" fields
3. **free-zone-company-setup-dubai** — em dashes in 3 steps
4. **child-dependent-visa guides** — em dash in summary (meta description)
5. **employment-visa-dubai-outside-uae** — 2 em dashes in steps
6. **employment-visa** (inside) — minor em dash cleanup
7. Remaining single-instance guides: newborn, document-attestation, amer-center, spouse-inside

---

## How to apply fixes

1. Open `/admin/guides/[slug]` in the admin panel
2. Edit the affected field
3. Replace each em dash with a period or split into two sentences
4. Click "Save and publish" — verify both the field change and published status are written
5. Confirm on the public guide page that the content updated

Use the style guide in `docs/content-style-guide-ru-en.md` as the reference for how to rewrite em-dash constructions.

---

## Next scheduled audit

Re-audit after Russian content is translated and entered into DB. Russian content should be audited against the RU-specific rules in `docs/content-style-guide-ru-en.md` before any RU page goes live.

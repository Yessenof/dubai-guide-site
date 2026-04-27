# Mobile Header Reset

**Decision date:** April 2026  
**Status:** Implemented

---

## Problem

The previous header on mobile showed: logo | Visas | Company Setup | Guides — three full text labels crowding a 375px bar. "Company Setup" alone is 13 characters. Combined with the logo and spacing, the header felt dense and gave no conversion action.

---

## New Header Pattern

**Mobile (< sm breakpoint):**
- Logo left
- WhatsApp button right — green pill, icon only on mobile

**Desktop (sm+):**
- Logo left
- Nav links (Visas, Company Setup, Guides) — centered/right
- WhatsApp button right — icon + "WhatsApp" text

**Nav on mobile:** Hidden. The PrimaryServices block on the homepage serves as the primary navigation surface for mobile users. Guide detail pages use browser back. Footer provides About/Contact.

---

## WhatsApp Button

- Color: `#25D366` (WhatsApp brand green) — deliberately breaks from navy/brass to signal a specific action
- Link: update to `https://wa.me/971XXXXXXXXX` in `components/Header.tsx` and `components/Hero.tsx` when the number is confirmed
- Currently links to `/contact` as placeholder

---

## Trade-offs

- Mobile users on deep guide pages cannot navigate to other sections from the header without scrolling back. Acceptable: content pages have a prominent "← Back" link in the guide header, and the Footer has About/Contact. If this proves a problem, a hamburger menu can be added later.
- WhatsApp green breaks the navy/brass palette — intentional: the action must be unmissable, and green carries universal "contact us" recognition.

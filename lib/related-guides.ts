/** Static map: guide slug → up to 3 related guide slugs (most relevant first). */
export const RELATED_GUIDES: Record<string, string[]> = {
  "employment-visa": [
    "employment-visa-dubai-outside-uae",
    "amer-center-dubai",
    "document-attestation-dubai",
  ],
  "employment-visa-dubai-outside-uae": [
    "employment-visa",
    "amer-center-dubai",
    "document-attestation-dubai",
  ],
  "spouse-dependent-dubai-inside": [
    "spouse-dependent-dubai-outside",
    "child-dependent-dubai-inside",
    "renew-family-visa-dubai",
  ],
  "spouse-dependent-dubai-outside": [
    "spouse-dependent-dubai-inside",
    "child-dependent-dubai-outside",
    "renew-family-visa-dubai",
  ],
  "child-dependent-dubai-inside": [
    "child-dependent-dubai-outside",
    "spouse-dependent-dubai-inside",
    "renew-family-visa-dubai",
  ],
  "child-dependent-dubai-outside": [
    "child-dependent-dubai-inside",
    "spouse-dependent-dubai-outside",
    "renew-family-visa-dubai",
  ],
  "newborn-visa-dubai": [
    "spouse-dependent-visa-dubai-inside-country",
    "spouse-dependent-visa-dubai-outside-country",
    "renew-family-visa-dubai",
  ],
  "renew-family-visa-dubai": [
    "parents-visa-dubai",
    "newborn-visa-dubai",
    "amer-center-dubai",
  ],
  "golden-visa-dubai-property": [
    "parents-visa-dubai",
    "tax-residency-certificate-uae",
    "mainland-company-setup-dubai",
  ],
  "free-zone-company-setup-dubai": [
    "mainland-company-setup-dubai",
    "open-business-bank-account-dubai",
    "pro-services-dubai",
  ],
  "mainland-company-setup-dubai": [
    "free-zone-company-setup-dubai",
    "open-business-bank-account-dubai",
    "pro-services-dubai",
  ],
  "open-business-bank-account-dubai": [
    "mainland-company-setup-dubai",
    "free-zone-company-setup-dubai",
    "tax-residency-certificate-uae",
  ],
  "tax-residency-certificate-uae": [
    "open-business-bank-account-dubai",
    "golden-visa-dubai-property",
    "mainland-company-setup-dubai",
  ],
  "document-attestation-dubai": [
    "amer-center-dubai",
    "employment-visa",
    "pro-services-dubai",
  ],
  "amer-center-dubai": [
    "document-attestation-dubai",
    "pro-services-dubai",
    "employment-visa",
  ],
  "pro-services-dubai": [
    "amer-center-dubai",
    "document-attestation-dubai",
    "mainland-company-setup-dubai",
  ],
  "holiday-home-permit-dubai": [
    "tax-residency-certificate-uae",
    "open-business-bank-account-dubai",
    "golden-visa-dubai-property",
  ],
  "parents-visa-dubai": [
    "renew-family-visa-dubai",
    "golden-visa-dubai-property",
    "employment-visa",
  ],
  "etihad-rail-uae": [
    "document-attestation-dubai",
    "employment-visa",
    "amer-center-dubai",
  ],
};

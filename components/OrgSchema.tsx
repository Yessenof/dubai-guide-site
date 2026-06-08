const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guidex-consulting.ae";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Guidex Consulting",
  url: BASE,
  logo: `${BASE}/brand/logo-header.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://wa.me/971506304817",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Guidex Consulting",
  url: BASE,
};

export function OrgSchema() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

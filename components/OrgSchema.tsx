const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guidex-consulting.ae";

const schema = {
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

export function OrgSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Dubai Government Services — Guidex Consulting",
  description:
    "Step-by-step guides for document attestation, Amer service centers, and PRO services in Dubai. Official fees and timelines.",
};

const guides = [
  {
    title: "Document Attestation in Dubai",
    description: "Attest foreign documents for use in the UAE — marriage, birth, degree, and commercial certificates.",
    href: "/guides/document-attestation-dubai",
    meta: "MOFA · Embassy · Notary",
  },
  {
    title: "Amer Service Centers",
    description: "What Amer handles, where the centers are, and how to use them for visa applications and status changes.",
    href: "/guides/amer-center-dubai",
    meta: "ICA-accredited · Visa services",
  },
  {
    title: "PRO Services in Dubai",
    description: "What a PRO does, when you need one, and how to find a reliable provider for government filings.",
    href: "/guides/pro-services-dubai",
    meta: "Government filings · Company admin",
  },
];

export default function GovernmentHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Government Services", item: `${BASE}/government` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Home
      </Link>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category="government" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Government
        </p>
      </div>

      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Dubai Government Services
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-8">
        The three services that underpin most visa and company filings in Dubai.
      </p>

      <div className="space-y-3">
        {guides.map((g) => (
          <Link key={g.href} href={g.href} className="block group">
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {g.title}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {g.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {g.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Need help navigating government processes?</p>
        <p className="text-[12px] text-white/60 mb-3">We handle attestation, GDRFA filings, and government submissions on your behalf.</p>
        <a
          href="https://wa.me/971506304817"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Chat on WhatsApp →
        </a>
      </div>

    </div>
  );
}

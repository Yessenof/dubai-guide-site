import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Banking & Tax in Dubai — Guidex Consulting",
  description:
    "Tax Residency Certificate and business bank account for UAE residents, investors, and companies with international banking or tax reporting requirements.",
  alternates: {
    canonical: `${BASE}/banking-tax`,
    languages: {
      "en":        `${BASE}/banking-tax`,
      "ru":        `${BASE}/ru/banking-tax`,
      "x-default": `${BASE}/banking-tax`,
    },
  },
};

const services = [
  {
    title: "Tax Residency Certificate",
    description:
      "UAE tax residency proof for foreign banks, tax authorities, and international income declarations. Issued by the Federal Tax Authority through EmaraTax.",
    href: "/guides/tax-residency-certificate-uae",
    meta: "FTA · EmaraTax",
  },
  {
    title: "Business Bank Account",
    description:
      "Corporate account opening for mainland and free zone companies. Required after company formation. Guidex prepares your file and advises on the right bank.",
    href: "/guides/open-business-bank-account-dubai",
    meta: "Required after licensing",
  },
];

export default function BankingTaxHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Banking & Tax", item: `${BASE}/banking-tax` },
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
        Home
      </Link>

      <PageHero
        asset={{
          src: "/images/hubs/difc-business-bay-glass-towers.webp",
          alt: "Glass tower facades in Dubai's Business Bay financial district",
          tone: "cool",
        }}
        gradientStyle="medium"
        overline="Banking and Tax"
        heading="Banking & Tax in Dubai"
        subtext="For residents, investors, and companies with international banking or tax reporting requirements."
      />

      <div className="space-y-3 mb-10">
        {services.map((s) => (
          <Link key={s.href} href={s.href} className="block group">
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {s.title}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {s.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {s.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-8 border-t border-stone-100 mb-8">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Who this is for
        </h2>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Investors and founders with international income or assets</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">UAE residents proving tax residency to a foreign bank or authority</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Companies opening a corporate account after licensing</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Free zone and mainland businesses with cross-border reporting obligations</span>
          </li>
        </ul>
      </div>

      <div className="pt-8 border-t border-stone-100 mb-10">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          How Guidex helps
        </h2>
        <p className="text-[14px] text-gray-700 leading-snug mb-3">
          We review your case before submission, confirm the correct route, and prepare your file. Where authorised, we manage the process with the relevant authority on your behalf.
        </p>
        <p className="text-[14px] text-gray-600 leading-snug">
          Not sure which document you need? Start with a free case review.
        </p>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Not sure where to start?</p>
        <p className="text-[12px] text-white/60 mb-3">We review your situation and confirm the correct document and route for your case.</p>
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

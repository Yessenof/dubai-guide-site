import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Family Residence Visas in Dubai — Guidex Consulting",
  description:
    "Sponsor a spouse or child on a Dubai residence visa. Step-by-step guides for inside-UAE and outside-UAE routes, with exact government fees and timelines.",
  alternates: {
    canonical: `${BASE}/visas/family`,
    languages: {
      "en":        `${BASE}/visas/family`,
      "ru":        `${BASE}/ru/visas/family`,
      "x-default": `${BASE}/visas/family`,
    },
  },
};

const guides = [
  {
    title: "Sponsor a Spouse Residence Visa in Dubai",
    description:
      "Inside the UAE or entering from abroad. Covers GDRFA, Amer, medicals, and Emirates ID.",
    href: "/guides/spouse-dependent-visa-dubai",
    meta: "Inside or outside UAE",
  },
  {
    title: "Sponsor a Child Dependent Visa in Dubai",
    description:
      "Inside the UAE or entering from abroad. Covers GDRFA, Amer, medicals, and Emirates ID.",
    href: "/guides/child-dependent-visa-dubai",
    meta: "Inside or outside UAE",
  },
];

export default function FamilyVisaHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Visas", item: `${BASE}/visas` },
      { "@type": "ListItem", position: 3, name: "Family visas", item: `${BASE}/visas/family` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Link
        href="/visas"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Visas
      </Link>

      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category="visas" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Visas
        </p>
      </div>

      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Family Residence Visas in Dubai
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-6">
        Sponsor a spouse or child on a Dubai residence visa. Inside-UAE and outside-UAE routes with exact government fees.
      </p>

      <Link
        href="/find-my-visa?flow=family-new"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Find My Family Visa Route</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Spouse or child · inside or outside UAE →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

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
    </div>
  );
}

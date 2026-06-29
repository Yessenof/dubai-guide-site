import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Dubai Visa Guides — Guidex Consulting",
  description:
    "Step-by-step Dubai visa guides with official government fees and timelines. Family visas, Golden Visa, employment visas, and more.",
};

const hubs = [
  {
    title: "Family Residence Visas",
    description: "Sponsor a spouse or child. Inside-UAE and outside-UAE routes.",
    href: "/visas/family",
    meta: "Spouse · Child",
  },
  {
    title: "Golden Visa",
    description: "10-year UAE residency without employer sponsorship. Property, business, and talent routes.",
    href: "/visas/golden",
    meta: "Property route live",
  },
  {
    title: "Employment Visa — Inside UAE",
    description: "Change status without leaving the UAE. Dubai mainland employers only — no border run required.",
    href: "/guides/employment-visa",
    meta: "Inside UAE · AED 4,900–7,300 · 2–4 weeks",
  },
  {
    title: "Employment Visa — From Abroad",
    description: "Your employer starts the process in Dubai while you're outside the UAE. You enter on an entry permit once it is approved.",
    href: "/guides/employment-visa-dubai-outside-uae",
    meta: "Outside UAE · AED 4,500–7,000 · 4–8 weeks",
  },
];

export default function VisasHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Visas", item: `${BASE}/visas` },
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
          <CategoryIcon category="visas" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Visas
        </p>
      </div>

      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        Dubai Visa Guides
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-6">
        Dubai residence visas cover three main categories: employment visas (employer-sponsored, mainland or free zone), family visas (sponsored by an existing UAE resident), and long-term investor visas (Golden Visa, 10 years without employer sponsorship). Each category has a distinct process, different government bodies, and separate government fees.
      </p>

      <Link
        href="/find-my-visa"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Find My Route</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Answer 2–3 questions →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      <div className="space-y-3">
        {hubs.map((hub) => (
          <Link key={hub.href} href={hub.href} className="block group">
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {hub.title}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {hub.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {hub.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Not sure which visa route applies to you?</p>
        <p className="text-[12px] text-white/60 mb-3">We review your situation and recommend the correct route before you start the process.</p>
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

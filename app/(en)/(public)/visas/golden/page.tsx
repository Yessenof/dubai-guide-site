import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import SourceNote from "@/components/SourceNote";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Dubai Golden Visa — Guidex Consulting",
  description:
    "Dubai Golden Visa grants 10-year UAE residency without employer sponsorship. Property route from AED 2 million registered with DLD. Professional salary, business investor, and special talent routes available.",
  alternates: {
    canonical: `${BASE}/visas/golden`,
    languages: {
      "en":        `${BASE}/visas/golden`,
      "ru":        `${BASE}/ru/visas/golden`,
      "x-default": `${BASE}/visas/golden`,
    },
  },
};

const WHATSAPP_HREF = "https://wa.me/971506304817";

const liveGuides = [
  {
    title: "Golden Visa Through Property Ownership",
    description:
      "Ready property valued at AED 2M+. Covers ICA application, medicals, Emirates ID, and exact government fees.",
    href: "/guides/golden-visa-dubai-property",
    meta: "AED 2M+ property · 10-year visa",
  },
];

const advisorRoutes = [
  {
    title: "Professional / Senior Talent",
    description:
      "Based on salary, professional role, or skills. Typically requires a qualifying salary tier or government-recognised profession.",
    meta: "Salary-based · 10-year visa",
    waText: "Golden Visa — Professional route",
  },
  {
    title: "Business Investor",
    description:
      "For company owners or partners with a qualifying investment in a UAE-licensed business.",
    meta: "Investment-based · 10-year visa",
    waText: "Golden Visa — Business investor route",
  },
  {
    title: "Special Talent",
    description:
      "Artists, athletes, scientists, and outstanding graduates nominated by approved UAE authorities.",
    meta: "Nomination required · 10-year visa",
    waText: "Golden Visa — Special talent route",
  },
];

export default function GoldenVisaHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Visas", item: `${BASE}/visas` },
      { "@type": "ListItem", position: 3, name: "Golden visa", item: `${BASE}/visas/golden` },
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
        Dubai Golden Visa
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-4">
        The Dubai Golden Visa grants 10-year UAE residency without employer sponsorship. The property route is open to owners of freehold property registered with DLD at a value of AED 2 million or above. Professional salary, business investor, and special talent routes have separate eligibility criteria set by ICA.
      </p>

      <div className="mb-6">
        <SourceNote
          status="confirmed"
          note="Golden Visa routes and thresholds based on ICA and GDRFA official guidelines. Investment categories and minimum values are periodically reviewed."
          sourceLabel="ICA · GDRFA · DLD"
          lastChecked="Checked May 2026"
        />
      </div>

      <Link
        href="/find-my-visa?flow=golden"
        className="flex items-center justify-between w-full mb-7 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Find My Golden Visa Route</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Answer 1–2 questions →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      {/* Live guide */}
      <div className="space-y-3 mb-6">
        {liveGuides.map((g) => (
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

      {/* Advisor routes — WhatsApp CTA */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Ask about these routes
      </p>
      <div className="space-y-3 mb-8">
        {advisorRoutes.map((r) => (
          <a
            key={r.title}
            href={`${WHATSAPP_HREF}?text=${encodeURIComponent(`Hi, I'm interested in the ${r.waText}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="border border-stone-200 rounded-2xl p-5 hover:border-stone-300 hover:bg-stone-50 transition-all">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {r.title}
                </h2>
                <span className="text-[10px] font-semibold text-white bg-navy/70 px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 uppercase tracking-wide">
                  WhatsApp
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {r.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {r.meta}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer CTA */}
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between w-full bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-gray-700 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold">Not sure which route applies?</p>
          <p className="text-xs text-gray-400 mt-0.5">Describe your situation on WhatsApp</p>
        </div>
        <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-lg">→</span>
      </a>
    </div>
  );
}

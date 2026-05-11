import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "UAE Regulatory Updates — Guidex Consulting",
  description:
    "Visa rule changes, business and tax updates, property laws, and government announcements relevant to Dubai residents, investors, and business owners.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/news`,
  },
};

const categories = [
  "Visa updates",
  "Business",
  "Tax",
  "Property",
  "Government",
  "Tourism",
];

const relatedHubs = [
  { label: "Visas", href: "/visas" },
  { label: "Company Setup", href: "/company-setup" },
  { label: "Banking & Tax", href: "/banking-tax" },
  { label: "Government Services", href: "/government" },
  { label: "Tourism & Holiday Homes", href: "/tourism" },
];

export default function NewsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Home
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        UAE Updates
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        UAE Regulatory Updates
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-7">
        Visa rule changes, business and tax updates, property laws, and government announcements for Dubai residents and investors.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((chip) => (
          <span
            key={chip}
            className="inline-block text-[11px] text-gray-500 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="border border-dashed border-stone-200 rounded-2xl px-5 py-8 text-center mb-8">
        <p className="text-[13px] text-gray-400 leading-snug">
          UAE updates are being prepared. Regulatory and practical updates will appear here as they are published.
        </p>
      </div>

      <Link
        href="/find-my-visa"
        className="flex items-center justify-between w-full mb-3 px-4 py-3.5 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Find My Route</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Answer 2–3 questions →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      <div className="pt-8 border-t border-stone-100 mb-8 mt-8">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Procedure guides
        </h2>
        <div className="space-y-0.5">
          {relatedHubs.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between py-2.5 group border-b border-stone-100 last:border-0"
            >
              <span className="text-[14px] text-gray-700 group-hover:text-gray-900 transition-colors">
                {link.label}
              </span>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Question about a rule change?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          We advise on current UAE regulations and confirm how changes affect your visa or business.
        </p>
        <a
          href={WHATSAPP_HREF}
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

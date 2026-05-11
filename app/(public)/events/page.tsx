import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "UAE Events and Key Dates — Guidex Consulting",
  description:
    "Public holidays, important deadlines, and key dates for UAE residents, businesses, and investors. Dubai government and regulatory event calendar.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/events`,
  },
};

const categories = [
  "Public holidays",
  "Important dates",
  "Deadlines",
  "Dubai events",
];

export default function EventsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        ← Home
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        UAE Events
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        UAE Dates and Events
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-7">
        Public holidays, important deadlines, and key dates for residents, businesses, and investors in the UAE.
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
          UAE dates and events are being added. Check the calendar for upcoming public holidays and important dates.
        </p>
      </div>

      <Link
        href="/calendar"
        className="flex items-center justify-between w-full mb-3 px-4 py-3.5 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
      >
        <div>
          <p className="text-[14px] font-semibold text-gray-900 leading-tight">UAE Calendar</p>
          <p className="text-[12px] text-gray-500 leading-tight mt-0.5">Public holidays and monthly dates</p>
        </div>
        <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
      </Link>

      <div className="bg-navy rounded-2xl px-5 py-5 mt-6">
        <p className="text-[14px] font-semibold text-white mb-1">
          Planning around a UAE deadline?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          We advise on timing for visa renewals, company filings, and permit deadlines.
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

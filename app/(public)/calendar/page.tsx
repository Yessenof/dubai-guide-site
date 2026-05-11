import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "UAE Public Holidays and Calendar — Guidex Consulting",
  description:
    "UAE public holidays, Ramadan, school terms, and key monthly dates for residents and businesses. Official UAE government calendar for 2025–2026.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/calendar`,
  },
};

const placeholderCards = [
  { title: "UAE Public Holidays", meta: "2025–2026" },
  { title: "This Month", meta: "Key dates" },
  { title: "Ramadan and Eid", meta: "Subject to moon sighting" },
  { title: "School Holidays", meta: "KHDA calendar" },
];

export default function CalendarPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Home
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        UAE Calendar
      </p>
      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-2">
        UAE Public Holidays and Important Dates
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        Official public holidays, Ramadan, school terms, and key deadlines for UAE residents and businesses.
      </p>

      <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-[12px] text-amber-800 leading-snug">
          Islamic holiday dates (Eid al-Fitr, Eid al-Adha, Ramadan) depend on official UAE moon-sighting announcements and are subject to change. Treat expected dates as provisional until confirmed by UAE authorities.
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {placeholderCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between border border-stone-200 rounded-xl px-4 py-3 bg-stone-50"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[13px] font-semibold text-gray-600 leading-snug">{card.title}</p>
                <span className="inline-block text-[10px] text-gray-400 mt-0.5">{card.meta}</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-0.5 rounded-full leading-none whitespace-nowrap flex-shrink-0">
              Coming soon
            </span>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-stone-200 rounded-xl px-4 py-4 text-center mb-4">
        <p className="text-[12px] text-gray-400 leading-snug">
          Calendar pages are being prepared. Full holiday lists and monthly date summaries will appear here.
        </p>
      </div>

      <div className="flex gap-2.5 mb-5">
        <Link
          href="/events"
          className="flex-1 flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          <span className="text-[13px] font-semibold text-gray-800 leading-tight">Events</span>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
        </Link>
        <Link
          href="/news"
          className="flex-1 flex items-center justify-between px-4 py-3 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          <span className="text-[13px] font-semibold text-gray-800 leading-tight">UAE Updates</span>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
        </Link>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Planning around a UAE holiday or deadline?
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

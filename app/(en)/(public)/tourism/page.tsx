import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Tourism & Holiday Homes in Dubai — Guidex Consulting",
  description:
    "Holiday home permits and short-term rental compliance for property owners in Dubai. DTCM registration with process guidance from Guidex.",
  alternates: {
    canonical: `${BASE}/tourism`,
    languages: {
      "en":        `${BASE}/tourism`,
      "ru":        `${BASE}/ru/tourism`,
      "x-default": `${BASE}/tourism`,
    },
  },
};

const services = [
  {
    title: "Holiday Home Permit",
    description:
      "Register your Dubai property for short-term rental with DTCM. Required before listing on any platform including Airbnb and Booking.com.",
    href: "/guides/holiday-home-permit-dubai",
    meta: "DTCM · Short-term rental",
  },
];

export default function TourismHubPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4 py-3 -mt-1"
      >
        Home
      </Link>

      <PageHero
        asset={{
          src: "/images/hubs/jlt-dubai-towers-sunset-reflection.webp",
          alt: "JLT residential towers in Dubai at sunset with water reflection",
          tone: "warm",
        }}
        gradientStyle="warm-light"
        overline="Tourism and Holiday Homes"
        heading="Tourism & Holiday Homes in Dubai"
        subtext="Permits, licences, and compliance for short-term rental operators and property owners."
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
            <span className="text-[14px] text-gray-700 leading-snug">Property owners listing on Airbnb, Booking.com, or similar platforms</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Investors setting up a short-term rental portfolio in Dubai</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-gray-700 leading-snug">Owners renewing or updating an existing holiday home permit</span>
          </li>
        </ul>
      </div>

      <div className="pt-8 border-t border-stone-100 mb-10">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          How Guidex helps
        </h2>
        <p className="text-[14px] text-gray-700 leading-snug mb-3">
          We handle DTCM registration, document preparation, and permit renewals. For new operators, we advise on the correct permit type before you start the process.
        </p>
        <p className="text-[13px] text-gray-500 leading-snug">
          Guides for holiday home renewal, short-term rental setup, and tourism licences are being added.
        </p>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Setting up your first holiday home?</p>
        <p className="text-[12px] text-white/60 mb-3">We handle the DTCM permit and advise on the correct setup for your property.</p>
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

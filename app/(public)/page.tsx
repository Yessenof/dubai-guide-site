import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FreeAdviceCta from "@/components/FreeAdviceCta";
import RouteSnapshotBand from "@/components/RouteSnapshotBand";
import Link from "next/link";
import { getPublishedGuidesForBand } from "@/lib/db/reader";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  alternates: {
    canonical: BASE,
    languages: {
      "en":        BASE,
      "ru":        `${BASE}/ru`,
      "x-default": BASE,
    },
  },
};

const BAND_SLUGS = [
  "employment-visa",
  "spouse-dependent-visa-dubai-outside-country",
  "child-dependent-visa-dubai-outside-country",
  "golden-visa-dubai-property",
];

type ServiceCard =
  | { label: string; description: string; meta: string; href: string }
  | { label: string; description: string; meta: string; soon: true };

const services: ServiceCard[] = [
  {
    label: "Visas",
    description: "Employment visa, family visa, Golden Visa, and renewals.",
    meta: "UAE residence visas",
    href: "/visas",
  },
  {
    label: "Company Setup",
    description: "Mainland or free zone company setup, with bank account.",
    meta: "Mainland · Free zone · Bank account",
    href: "/company-setup",
  },
  {
    label: "Government Services",
    description: "Document attestation, Amer centers, and PRO services.",
    meta: "Documents · Amer · PRO",
    href: "/government",
  },
  {
    label: "Tourism & Holiday Homes",
    description: "Holiday home permits, short-term rental setup, and tourism procedures.",
    meta: "Coming soon",
    soon: true,
  },
  {
    label: "Banking & Advice",
    description: "Banking guidance, compliance, VAT, corporate tax, and account issues.",
    meta: "Coming soon",
    soon: true,
  },
];

export default function HomePage() {
  const bandGuides = getPublishedGuidesForBand(BAND_SLUGS);

  return (
    <div>
      {/* 1. Hero — what the site does + primary CTA */}
      <Hero />

      {/* 2. Route-hub cards — self-select your domain immediately */}
      <section className="px-5 pb-10">
        <div className="max-w-2xl mx-auto space-y-3">
          {services.map((s) =>
            "soon" in s ? (
              <div
                key={s.label}
                className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h2 className="text-[15px] font-semibold text-gray-400 leading-snug">
                    {s.label}
                  </h2>
                  <span className="flex-shrink-0 text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-1 rounded-full leading-none whitespace-nowrap mt-0.5">
                    Coming soon
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 leading-snug mb-3">
                  {s.description}
                </p>
                <span className="inline-block text-[11px] text-gray-400 bg-stone-100 px-2.5 py-1 rounded-full">
                  {s.meta}
                </span>
              </div>
            ) : (
              <Link
                key={s.label}
                href={s.href}
                className="block group border border-stone-200 rounded-2xl p-5 bg-stone-50 hover:border-stone-300 hover:bg-stone-100 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                    {s.label}
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
              </Link>
            )
          )}
        </div>
      </section>

      {/* 3. Live routes with costs — show real data fast */}
      <RouteSnapshotBand guides={bandGuides} />

      {/* 4. Trust block — before the escalation CTA */}
      <HowItWorks />

      {/* 5. Human escalation — for complex or unclear situations */}
      <FreeAdviceCta />

      {/* 6. Browse all */}
      <div className="px-5 pb-10">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/guides"
            className="inline-block text-sm font-semibold text-brass hover:opacity-75 transition-opacity py-3"
          >
            Browse all guides →
          </Link>
        </div>
      </div>
    </div>
  );
}

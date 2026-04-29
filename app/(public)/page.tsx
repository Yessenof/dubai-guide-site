import Hero from "@/components/Hero";
import PrimaryServices from "@/components/PrimaryServices";
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

export default function HomePage() {
  const bandGuides = getPublishedGuidesForBand(BAND_SLUGS);

  return (
    <div>
      {/* 1. Hero — what the site does + primary CTA */}
      <Hero />

      {/* 2. Service menu — self-select your route immediately */}
      <PrimaryServices />

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

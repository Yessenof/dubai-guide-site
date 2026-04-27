import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedGuidesForBand } from "@/lib/db/reader";
import { CALCULATOR_GUIDE_SLUGS, type CalcGuideData } from "@/lib/route-finder-config";
import RouteFinderFlow from "@/components/RouteFinderFlow";

export const metadata: Metadata = {
  title: "Find My Visa Route — Guidex Consulting",
  description:
    "Answer a few questions to find the right Dubai visa, residence permit, or company setup guide. Covers family visas, employment visa, Golden Visa, and company formation.",
};

interface PageProps {
  searchParams: Promise<{ flow?: string }>;
}

export default async function FindMyVisaPage({ searchParams }: PageProps) {
  const { flow } = await searchParams;

  const guidesArray = getPublishedGuidesForBand(CALCULATOR_GUIDE_SLUGS);
  const guideDataMap: Record<string, CalcGuideData> = {};
  for (const g of guidesArray) {
    guideDataMap[g.slug] = {
      slug:     g.slug,
      title:    g.title,
      summary:  g.summary,
      price:    g.price,
      timeline: g.timeline,
    };
  }

  return (
    <div className="bg-stone-100 min-h-screen pt-4 pb-28">
      <div className="max-w-[480px] mx-auto px-4">

        {/* Tool header */}
        <div className="flex items-start justify-between mb-4 px-1">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brass mb-1">
              Guidex Consulting
            </p>
            <h1 className="text-[17px] font-bold text-gray-900 leading-tight">
              Route Finder
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Answer 2–3 questions to find the right guide.
            </p>
          </div>
          <Link
            href="/"
            className="text-[20px] text-gray-300 hover:text-gray-500 py-1 pl-4 flex-shrink-0 leading-none"
            aria-label="Close route finder"
          >
            ×
          </Link>
        </div>

        {/* Calculator card — elevated white surface */}
        <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.09)] overflow-hidden">
          <RouteFinderFlow guideDataMap={guideDataMap} startFlow={flow} />
        </div>

      </div>
    </div>
  );
}

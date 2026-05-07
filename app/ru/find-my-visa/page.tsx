import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedGuidesForBand } from "@/lib/db/reader";
import { CALCULATOR_GUIDE_SLUGS, type CalcGuideData } from "@/lib/route-finder-config";
import RouteFinderFlow from "@/components/RouteFinderFlow";

export const metadata: Metadata = {
  title: "Найти маршрут — Guidex Consulting",
  description:
    "Ответьте на 2–3 вопроса и получите подходящий гайд по визе, резидентству или открытию компании в Дубае.",
};

interface PageProps {
  searchParams: Promise<{ flow?: string }>;
}

export default async function RuFindMyVisaPage({ searchParams }: PageProps) {
  const { flow } = await searchParams;

  const guidesArray = getPublishedGuidesForBand(CALCULATOR_GUIDE_SLUGS, "ru");
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
              Подбор маршрута
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              Ответьте на 2–3 вопроса, чтобы найти нужный гайд.
            </p>
          </div>
          <Link
            href="/ru"
            className="text-[20px] text-gray-300 hover:text-gray-500 py-1 pl-4 flex-shrink-0 leading-none"
            aria-label="Закрыть"
          >
            ×
          </Link>
        </div>

        {/* Calculator card — elevated white surface */}
        <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.09)] overflow-hidden">
          <RouteFinderFlow guideDataMap={guideDataMap} startFlow={flow} locale="ru" />
        </div>

      </div>
    </div>
  );
}

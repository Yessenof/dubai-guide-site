import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { BandGuideItem } from "@/lib/db/reader";

const GROUP_HREFS: Record<string, string> = {
  "child-dependent-visa-dubai-outside-country":
    "/guides/child-dependent-visa-dubai?route=outside",
  "child-dependent-visa-dubai-inside-country":
    "/guides/child-dependent-visa-dubai?route=inside",
  "spouse-dependent-visa-dubai-outside-country":
    "/guides/spouse-dependent-visa-dubai?route=outside",
  "spouse-dependent-visa-dubai-inside-country":
    "/guides/spouse-dependent-visa-dubai?route=inside",
};

function guideHref(slug: string): string {
  return GROUP_HREFS[slug] ?? `/guides/${slug}`;
}

interface Props {
  guides: BandGuideItem[];
}

export default function RouteSnapshotBand({ guides }: Props) {
  if (guides.length === 0) return null;

  return (
    <section className="px-5 pb-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Common routes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={guideHref(guide.slug)}
              className="block group"
            >
              <div className="h-full border border-stone-200 rounded-2xl overflow-hidden bg-white hover:border-stone-300 hover:bg-stone-50 transition-all">

                {/* Category + arrow */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-brass flex-shrink-0">
                      <CategoryIcon category={guide.category} />
                    </span>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 capitalize">
                      {guide.category.replace(/-/g, " ")}
                    </p>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </div>

                {/* Title */}
                <div className="px-4 pb-3">
                  <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2">
                    {guide.title}
                  </h3>
                </div>

                {/* Cost / timeline — primary data */}
                <div className="mx-4 mb-3 grid grid-cols-2 gap-px bg-stone-100 rounded-xl overflow-hidden">
                  <div className="bg-white px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Fee</p>
                    <p className="text-[13px] font-bold text-navy leading-snug">{guide.price}</p>
                  </div>
                  <div className="bg-white px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Time</p>
                    <p className="text-[13px] font-semibold text-gray-700 leading-snug">{guide.timeline}</p>
                  </div>
                </div>

                {/* Audience */}
                <div className="px-4 pb-4">
                  <p className="text-[12px] text-gray-600 leading-snug line-clamp-2">
                    {guide.audience}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

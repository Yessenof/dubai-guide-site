import TopicCard from "@/components/TopicCard";
import { getAllPublishedGuides, type GuideListItem } from "@/lib/db/reader";
import { REDIRECT_SLUGS, GUIDE_GROUPS } from "@/lib/guide-groups";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Guides — Guidex Consulting",
  description: "Browse all step-by-step guides for company setup, visas, hiring, and relocation in Dubai.",
};

const CATEGORY_ORDER = ["visas", "company-setup", "government", "hiring", "living"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  "visas":          "Visas",
  "company-setup":  "Company Setup",
  "government":     "Government",
  "hiring":         "Hiring",
  "living":         "Living",
};

// Synthetic group-page entries — replace the 4 individual redirect slugs.
// Slugs map directly to existing group page routes (/guides/spouse-dependent-visa-dubai etc.)
const GROUP_ENTRIES: GuideListItem[] = Object.entries(GUIDE_GROUPS).map(([groupSlug, group]) => {
  const prices: Record<string, string> = {
    "spouse-dependent-visa-dubai": "AED 1,800–3,200",
    "child-dependent-visa-dubai":  "AED 1,586–2,875",
  };
  return {
    slug:     groupSlug,
    title:    group.title,
    summary:  group.summary,
    price:    prices[groupSlug] ?? "",
    timeline: "3–6 weeks",
    category: group.category,
  };
});

export default function GuidesPage() {
  const rawGuides = getAllPublishedGuides();

  // Remove individual redirect slugs; inject group page entries instead.
  const allGuides = [
    ...rawGuides.filter((g) => !REDIRECT_SLUGS.has(g.slug)),
    ...GROUP_ENTRIES,
  ];

  // Group by category, sort within each category by slug for stable ordering.
  const grouped = CATEGORY_ORDER.reduce<Record<string, GuideListItem[]>>((acc, cat) => {
    const items = allGuides
      .filter((g) => g.category === cat)
      .sort((a, b) => a.slug.localeCompare(b.slug));
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Any guide with an unexpected category goes at the end
  const knownCategories = new Set(CATEGORY_ORDER as readonly string[]);
  const uncategorised = allGuides.filter((g) => !knownCategories.has(g.category));

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <h1 className="text-[26px] font-bold text-gray-900 mb-8">
        All guides
      </h1>

      <div className="space-y-10">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="space-y-3">
              {items.map((guide) => (
                <TopicCard
                  key={guide.slug}
                  slug={guide.slug}
                  title={guide.title}
                  summary={guide.summary}
                  price={guide.price}
                  timeline={guide.timeline}
                  category={guide.category}
                />
              ))}
            </div>
          </div>
        ))}

        {uncategorised.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Other</p>
            <div className="space-y-3">
              {uncategorised.map((guide) => (
                <TopicCard
                  key={guide.slug}
                  slug={guide.slug}
                  title={guide.title}
                  summary={guide.summary}
                  price={guide.price}
                  timeline={guide.timeline}
                  category={guide.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

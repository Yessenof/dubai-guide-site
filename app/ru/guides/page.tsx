import TopicCard from "@/components/TopicCard";
import { getAllPublishedGuides } from "@/lib/db/reader";
import { REDIRECT_SLUGS, GUIDE_GROUPS } from "@/lib/guide-groups";
import type { GuideListItem } from "@/lib/db/reader";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Гайды по Дубаю — Guidex Consulting",
  description:
    "Пошаговые руководства по получению виз, регистрации компаний и работе с государственными органами ОАЭ.",
  alternates: {
    canonical: `${BASE}/ru/guides`,
    languages: {
      "en":        `${BASE}/guides`,
      "ru":        `${BASE}/ru/guides`,
      "x-default": `${BASE}/guides`,
    },
  },
};

const CATEGORY_ORDER = ["visas", "company-setup", "government", "hiring", "living"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  "visas":         "Визы",
  "company-setup": "Открытие компании",
  "government":    "Государственные услуги",
  "hiring":        "Найм сотрудников",
  "living":        "Жизнь в Дубае",
};

const RU_GROUP_ENTRIES: GuideListItem[] = Object.entries(GUIDE_GROUPS).map(([groupSlug, group]) => {
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

export default function RuGuidesPage() {
  const rawGuides = getAllPublishedGuides("ru");

  const allGuides = [
    ...rawGuides.filter((g) => !REDIRECT_SLUGS.has(g.slug)),
    ...RU_GROUP_ENTRIES,
  ];

  const grouped = CATEGORY_ORDER.reduce<Record<string, GuideListItem[]>>((acc, cat) => {
    const items = allGuides
      .filter((g) => g.category === cat)
      .sort((a, b) => a.slug.localeCompare(b.slug));
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const knownCategories = new Set(CATEGORY_ORDER as readonly string[]);
  const uncategorised = allGuides.filter((g) => !knownCategories.has(g.category));

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">

      <h1 className="text-[26px] font-bold text-gray-900 mb-8">
        Все гайды
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
                  locale="ru"
                />
              ))}
            </div>
          </div>
        ))}

        {uncategorised.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Другое</p>
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
                  locale="ru"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

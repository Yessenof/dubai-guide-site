import Link from "next/link";
import TopicCard from "@/components/TopicCard";
import { getAllPublishedGuides, getRuPublishedGuidesSlugs } from "@/lib/db/reader";
import { REDIRECT_SLUGS } from "@/lib/guide-groups";
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

const CATEGORY_ORDER = ["visas", "company-setup", "government", "hiring", "living", "tourism"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  "visas":         "Визы",
  "company-setup": "Открытие компании",
  "government":    "Государственные услуги",
  "hiring":        "Найм сотрудников",
  "living":        "Жизнь в Дубае",
  "tourism":       "Туризм и краткосрочная аренда",
};

// Hardcoded Russian entries for dynamic family visa group pages.
// These are not DB guides — they link to /ru/guides/[group] tab pages.
const RU_GROUP_ENTRIES: GuideListItem[] = [
  {
    slug:      "child-dependent-visa-dubai",
    title:     "Виза ребёнка в Дубае: оформление dependent visa",
    summary:   "Маршрут для оформления резидентской визы ребёнка в Дубае. Выберите вариант внутри ОАЭ или за пределами ОАЭ, чтобы понять шаги, документы, стоимость и сроки.",
    price:     "AED 1,586–2,875",
    timeline:  "3–6 недель",
    category:  "visas",
    updatedAt: "",
  },
  {
    slug:      "spouse-dependent-visa-dubai",
    title:     "Виза жены или мужа в Дубае: оформление dependent visa",
    summary:   "Маршрут для оформления резидентской визы супруга в Дубае. Подходит для семей, где спонсор уже имеет резидентскую визу ОАЭ.",
    price:     "AED 1,800–3,200",
    timeline:  "3–6 недель",
    category:  "visas",
    updatedAt: "",
  },
];

export default function RuGuidesPage() {
  const ruSlugSet = new Set(getRuPublishedGuidesSlugs());
  const rawGuides = getAllPublishedGuides("ru").filter(
    (g) => ruSlugSet.has(g.slug) && !REDIRECT_SLUGS.has(g.slug),
  );

  const allGuides = [
    ...rawGuides,
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

      <h1 className="text-[26px] font-bold text-gray-900 mb-5">
        Все гайды
      </h1>

      <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
        <p className="text-[13px] font-semibold text-gray-800 mb-0.5">Не знаете, с чего начать?</p>
        <p className="text-[13px] text-gray-600 mb-2">
          Откройте план первых шагов в Дубае: что подготовить до прилёта, что сделать в первую неделю и что не забыть позже.
        </p>
        <Link href="/ru/life-setup" className="text-[13px] font-semibold text-brass hover:underline">
          Открыть план →
        </Link>
      </div>

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

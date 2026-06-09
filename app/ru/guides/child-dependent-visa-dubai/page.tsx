import { GUIDE_GROUPS } from "@/lib/guide-groups";
import { getGuideGroup } from "@/lib/db/reader";
import GuideTabs from "@/components/GuideTabs";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const GROUP_KEY = "child-dependent-visa-dubai";
const group = GUIDE_GROUPS[GROUP_KEY];

export const metadata: Metadata = {
  title: `${group.ruTitle ?? group.title} — Guidex Consulting`,
  description: group.ruSummary ?? group.summary,
  alternates: {
    canonical: `${BASE}/ru/guides/${GROUP_KEY}`,
    languages: {
      "en":        `${BASE}/guides/${GROUP_KEY}`,
      "ru":        `${BASE}/ru/guides/${GROUP_KEY}`,
      "x-default": `${BASE}/guides/${GROUP_KEY}`,
    },
  },
};

interface Props {
  searchParams: Promise<{ route?: string }>;
}

export default async function RuChildDependentVisaPage({ searchParams }: Props) {
  const { route } = await searchParams;
  const guides = getGuideGroup(group.variants.map((v) => v.slug), "ru");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/ru` },
      { "@type": "ListItem", position: 2, name: "Все гайды", item: `${BASE}/ru/guides` },
      { "@type": "ListItem", position: 3, name: group.ruTitle ?? group.title, item: `${BASE}/ru/guides/${GROUP_KEY}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: group.ruTitle ?? group.title,
    description: group.ruSummary ?? group.summary,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/ru/guides/${GROUP_KEY}` },
    url: `${BASE}/ru/guides/${GROUP_KEY}`,
    inLanguage: "ru",
    publisher: { "@type": "Organization", name: "Guidex Consulting", url: BASE },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <GuideTabs
        group={group}
        guides={guides}
        defaultRoute={route ?? "outside"}
        locale="ru"
      />
    </>
  );
}

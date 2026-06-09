import { GUIDE_GROUPS } from "@/lib/guide-groups";
import { getGuideGroup } from "@/lib/db/reader";
import GuideTabs from "@/components/GuideTabs";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const GROUP_KEY = "spouse-dependent-visa-dubai";
const group = GUIDE_GROUPS[GROUP_KEY];

export const metadata: Metadata = {
  title: `${group.title} — Guidex Consulting`,
  description: group.summary,
  alternates: {
    canonical: `${BASE}/guides/${GROUP_KEY}`,
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

export default async function SpouseDependentVisaPage({ searchParams }: Props) {
  const { route } = await searchParams;
  const guides = getGuideGroup(group.variants.map((v) => v.slug));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "All Guides", item: `${BASE}/guides` },
      { "@type": "ListItem", position: 3, name: group.title, item: `${BASE}/guides/${GROUP_KEY}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: group.title,
    description: group.summary,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/${GROUP_KEY}` },
    url: `${BASE}/guides/${GROUP_KEY}`,
    inLanguage: "en",
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
      />
    </>
  );
}

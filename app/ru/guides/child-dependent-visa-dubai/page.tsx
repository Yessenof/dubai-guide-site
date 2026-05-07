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

  return (
    <GuideTabs
      group={group}
      guides={guides}
      defaultRoute={route ?? "outside"}
      locale="ru"
    />
  );
}

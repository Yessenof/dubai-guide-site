import { GUIDE_GROUPS } from "@/lib/guide-groups";
import { getGuideGroup } from "@/lib/db/reader";
import GuideTabs from "@/components/GuideTabs";
import type { Metadata } from "next";

const GROUP_KEY = "spouse-dependent-visa-dubai";
const group = GUIDE_GROUPS[GROUP_KEY];

export const metadata: Metadata = {
  title: `${group.title} — Guidex Consulting`,
  description: group.summary,
};

interface Props {
  searchParams: Promise<{ route?: string }>;
}

export default async function SpouseDependentVisaPage({ searchParams }: Props) {
  const { route } = await searchParams;
  const guides = getGuideGroup(group.variants.map((v) => v.slug));

  return (
    <GuideTabs
      group={group}
      guides={guides}
      defaultRoute={route ?? "outside"}
    />
  );
}

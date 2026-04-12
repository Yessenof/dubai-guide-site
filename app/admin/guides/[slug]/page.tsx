import { getGuideBySlug } from "@/lib/db/writer";
import GuideEditForm from "@/components/admin/GuideEditForm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit: ${slug} — Admin` };
}

export default async function AdminEditGuidePage({ params, searchParams }: Props) {
  const { slug }  = await params;
  const { saved } = await searchParams;

  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <GuideEditForm
      key={saved ?? "init"}
      guide={guide}
      savedTs={saved}
      slug={slug}
    />
  );
}

import { getGuideBySlug, getStepsByGuideId } from "@/lib/db/writer";
import GuideEditForm from "@/components/admin/GuideEditForm";
import StepList from "@/components/admin/StepList";
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

  const steps = getStepsByGuideId(guide.id);

  return (
    <>
      {/*
        GuideEditForm is a client component with its own <form>.
        StepList / StepCard each have their own <form> elements.
        They are DOM siblings — no nesting, no HTML violation.
      */}
      <GuideEditForm
        key={saved ?? "init"}
        guide={guide}
        savedTs={saved}
        slug={slug}
      />
      <StepList
        steps={steps}
        guideId={guide.id}
        slug={slug}
      />
    </>
  );
}

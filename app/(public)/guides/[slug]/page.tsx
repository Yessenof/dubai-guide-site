import { getAllPublishedGuides, getPublishedGuideBySlug } from "@/lib/db/reader";
import GuideHeader from "@/components/GuideHeader";
import StepCard from "@/components/StepCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guides = getAllPublishedGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} — Dubai Guide`,
    description: guide.summary,
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug);
  if (!guide) notFound();

  const overviewParagraphs = guide.overview.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <GuideHeader
        frontmatter={{
          title:       guide.title,
          summary:     guide.summary,
          price:       guide.price,
          timeline:    guide.timeline,
          audience:    guide.audience,
          category:    guide.category,
          lastUpdated: guide.lastUpdated,
        }}
      />

      <div className="mt-10 pt-10 border-t border-gray-100">
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
          Overview
        </h2>
        {overviewParagraphs.map((text, i) => (
          <p key={i} className="text-[15px] text-gray-600 leading-relaxed mb-5">
            {text}
          </p>
        ))}

        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5 mt-10">
          Steps
        </h2>
        <div>
          {guide.steps.map((step) => (
            <StepCard
              key={step.id}
              number={step.stepOrder}
              title={step.title}
              what={step.what}
              where={step.where}
              address={step.address}
              cost={step.cost}
              time={step.timeEst}
              advice={step.advice}
              warning={step.warning || undefined}
            />
          ))}
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Need help with this process?{" "}
          <a
            href="/contact"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Contact us →
          </a>
        </p>
      </div>
    </div>
  );
}

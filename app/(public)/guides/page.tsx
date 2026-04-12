import TopicCard from "@/components/TopicCard";
import { getAllPublishedGuides } from "@/lib/db/reader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Guides — Dubai Guide",
  description: "Browse all step-by-step guides for company setup, visas, hiring, and relocation in Dubai.",
};

export default function GuidesPage() {
  const guides = getAllPublishedGuides();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
        All Guides
      </p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Dubai procedures, step by step.
      </h1>
      <div className="space-y-3">
        {guides.map((guide) => (
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
  );
}

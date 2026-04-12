import Hero from "@/components/Hero";
import TopicCard from "@/components/TopicCard";
import { getAllPublishedGuides } from "@/lib/db/reader";

export default function HomePage() {
  const guides = getAllPublishedGuides();

  return (
    <div>
      <Hero />

      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
            Guides
          </h2>
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
      </section>

      <section className="px-5 pb-16 border-t border-gray-100 pt-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-5">
            Get in touch
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://wa.me/971000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between flex-1 bg-gray-900 text-white rounded-2xl px-4 py-3.5 hover:bg-gray-700 transition-colors group"
            >
              <span className="text-sm font-semibold">WhatsApp</span>
              <span className="text-gray-500 group-hover:text-gray-300 transition-colors">→</span>
            </a>
            <a
              href="https://instagram.com/dubaiguide"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between flex-1 border border-gray-100 bg-white rounded-2xl px-4 py-3.5 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
            >
              <span className="text-sm font-semibold text-gray-900">Instagram</span>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
            </a>
            <a
              href="https://facebook.com/dubaiguide"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between flex-1 border border-gray-100 bg-white rounded-2xl px-4 py-3.5 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
            >
              <span className="text-sm font-semibold text-gray-900">Facebook</span>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

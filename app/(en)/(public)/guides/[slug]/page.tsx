import Link from "next/link";
import { getAllPublishedGuides, getPublishedGuideBySlug } from "@/lib/db/reader";
import { GuideCta } from "@/components/GuideCta";
import GuideHeader from "@/components/GuideHeader";
import RouteSnapshot from "@/components/RouteSnapshot";
import StepCard from "@/components/StepCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const WHATSAPP_HREF = "https://wa.me/971506304817";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

const CUSTOM_PAGE_SLUGS = new Set(["tax-residency-certificate-uae"]);

export async function generateStaticParams() {
  const guides = getAllPublishedGuides();
  return guides
    .filter((g) => !CUSTOM_PAGE_SLUGS.has(g.slug))
    .map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} — Guidex Consulting`,
    description: guide.summary,
    alternates: {
      canonical: `${BASE}/guides/${slug}`,
      languages: {
        "en": `${BASE}/guides/${slug}`,
        "x-default": `${BASE}/guides/${slug}`,
        ...(guide.hasRuContent ? { "ru": `${BASE}/ru/guides/${slug}` } : {}),
      },
    },
    openGraph: {
      title: `${guide.title} — Guidex Consulting`,
      description: guide.summary,
      url: `${BASE}/guides/${slug}`,
      siteName: "Guidex Consulting",
      locale: "en_AE",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${guide.title} — Guidex Consulting`,
      description: guide.summary,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug);
  if (!guide) notFound();

  const overviewParagraphs = guide.overview.split("\n\n").filter(Boolean);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "All Guides", item: `${BASE}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${BASE}/guides/${slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/${slug}` },
    url: `${BASE}/guides/${slug}`,
    inLanguage: "en",
    dateModified: guide.updatedAt,
    publisher: { "@type": "Organization", name: "Guidex Consulting", url: BASE },
  };

  const howToSchema = guide.steps.length >= 2 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.summary,
    step: guide.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.what,
    })),
  } : null;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-5 pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4 -mx-1">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          ← All guides
        </Link>
        <Link
          href="/find-my-visa"
          className="text-xs text-brass hover:opacity-70 transition-opacity px-1 py-3"
        >
          Find my route →
        </Link>
      </div>

      {/* 1. Title + summary */}
      <GuideHeader
        frontmatter={{
          title:    guide.title,
          summary:  guide.summary,
          category: guide.category,
        }}
      />

      {/* 2. Quick-answer block: cost, timeline, for, steps count, start */}
      <RouteSnapshot
        price={guide.price}
        timeline={guide.timeline}
        audience={guide.audience}
        steps={guide.steps}
        lastUpdated={guide.lastUpdated}
      />

      {/* 3. CTAs — immediately after the answer */}
      <div className="mt-4 flex gap-2.5">
        <GuideCta
          href="/find-my-visa"
          guideSlug={slug}
          ctaType="route_finder"
          locale="en"
          className="flex-1 text-center text-[13px] font-semibold text-navy border-2 border-navy/20 py-3 rounded-xl hover:border-navy/40 transition-colors"
        >
          Find My Route
        </GuideCta>
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={slug}
          ctaType="whatsapp"
          locale="en"
          isExternal
          className="flex-1 text-center text-[13px] font-semibold bg-navy text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Ask an Expert
        </GuideCta>
      </div>

      {/* 4. Step outline — process at a glance before diving in */}
      {guide.steps.length > 0 && (
        <div className="mt-6">
          <ol className="space-y-1.5">
            {guide.steps.map((step, i) => (
              <li key={step.id} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy/[0.08] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-navy tabular-nums leading-none">{i + 1}</span>
                </span>
                <span className="text-[13px] font-medium text-gray-800 leading-snug">{step.title}</span>
              </li>
            ))}
          </ol>
          <a
            href="#steps"
            className="inline-block mt-3 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            See full step-by-step guide ↓
          </a>
        </div>
      )}

      {/* 5. Full detailed steps */}
      <div className="mt-10 pt-8 border-t border-stone-100" id="steps">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Step by step
        </h2>
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

      {/* 6. Overview — SEO depth, positioned after practical content */}
      {overviewParagraphs.length > 0 && (
        <div className="mt-10 pt-8 border-t border-stone-100">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Overview
          </h2>
          {overviewParagraphs.map((text, i) => (
            <p key={i} className="text-[15px] text-gray-600 leading-relaxed mb-4 last:mb-0">
              {text}
            </p>
          ))}
        </div>
      )}

      {/* 7. Footer CTA */}
      <div className="mt-10 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Need help with this process?</p>
        <p className="text-[12px] text-white/60 mb-3">We manage government submissions, medicals, and filings on your behalf.</p>
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={slug}
          ctaType="whatsapp"
          locale="en"
          isExternal
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Chat on WhatsApp →
        </GuideCta>
      </div>

    </div>
  );
}

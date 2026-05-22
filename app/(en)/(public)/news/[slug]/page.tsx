import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsPostBySlug } from "@/lib/db/news-events-calendar";
import { newsRobots } from "@/lib/db/indexing";
import CalendarMiniPreview from "@/components/calendar/CalendarMiniPreview";
import MarkdownBody from "@/components/MarkdownBody";
import DetailHero, { categoryImage } from "@/components/detail/DetailHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

// Temporary: slug → calendar month for known date-based news until news_posts
// has an explicit calendar_month field.
const NEWS_CALENDAR_MONTH: Record<string, string> = {
  "uae-eid-al-adha-2026-federal-holiday-long-break": "2026-05",
  "uae-emiratisation-june-30-2026-deadline":          "2026-06",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug, "en");
  if (!post) return {};
  return {
    title: `${post.seoTitle || post.title} — Guidex Consulting`,
    description: post.metaDescription || post.summary,
    robots: newsRobots(post),
    alternates: {
      canonical: `${BASE}/news/${slug}`,
      languages: {
        en: `${BASE}/news/${slug}`,
        "x-default": `${BASE}/news/${slug}`,
      },
    },
  };
}

const SOURCE_LABELS: Record<string, string> = {
  official:   "Official source",
  government: "Government portal",
  media:      "Media report",
  other:      "Source",
};

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug, "en");
  if (!post) notFound();

  const categoryLabel =
    post.category.charAt(0).toUpperCase() +
    post.category.slice(1).replace(/-/g, " ");

  const heroImage    = post.imagePath || categoryImage(post.category);
  const heroAlt      = post.imageAlt  || post.title;
  const eyebrow      = post.datePublished
    ? `${categoryLabel} · ${post.datePublished}`
    : categoryLabel;
  const calendarMonth = NEWS_CALENDAR_MONTH[slug];

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/news"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← UAE Updates
      </Link>

      <DetailHero eyebrow={eyebrow} title={post.title} image={heroImage} imageAlt={heroAlt} />

      <p className="text-[15px] text-gray-600 leading-[1.6] mb-4">
        {post.summary}
      </p>

      {post.sourceUrl && (
        <div className="flex items-center gap-2 mb-5 pl-3 border-l-2 border-stone-200">
          <span className="text-[11px] font-medium text-gray-400">
            {SOURCE_LABELS[post.sourceLabel] ?? "Source"}:
          </span>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-brass hover:opacity-75 transition-opacity"
          >
            View source ↗
          </a>
        </div>
      )}

      <CalendarMiniPreview locale="en" calendarBase="/calendar" calendarMonth={calendarMonth} />

      {post.body && (
        <MarkdownBody content={post.body} className="mb-6" />
      )}

      {post.dateUpdated && post.dateUpdated !== post.datePublished && (
        <p className="text-[11px] text-gray-400 mb-5">
          Updated: {post.dateUpdated}
        </p>
      )}

      {post.relatedGuideSlug && (
        <div className="border border-stone-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Related guide
          </p>
          <Link
            href={`/guides/${post.relatedGuideSlug}`}
            className="flex items-center justify-between group"
          >
            <span className="text-[13px] font-medium text-gray-800 group-hover:text-navy transition-colors">
              {post.relatedGuideSlug.replace(/-/g, " ")}
            </span>
            <span className="text-gray-400 group-hover:text-navy transition-colors text-sm">→</span>
          </Link>
        </div>
      )}

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Affected by this change?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          We advise on current UAE regulations and confirm how changes affect your visa or business.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Chat on WhatsApp →
        </a>
      </div>

    </div>
  );
}

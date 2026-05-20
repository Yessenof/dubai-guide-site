import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsPostBySlug } from "@/lib/db/news-events-calendar";
import { newsRobots } from "@/lib/db/indexing";
import CalendarContextCta from "@/components/calendar/CalendarContextCta";
import MarkdownBody from "@/components/MarkdownBody";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

interface Props {
  params: Promise<{ slug: string }>;
}

// Empty — DB tables have no RU content yet. Pages render on demand via SSR.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug, "ru");
  if (!post) return {};
  return {
    title: `${post.seoTitle || post.title} — Guidex Consulting`,
    description: post.metaDescription || post.summary,
    robots: newsRobots(post),
    alternates: {
      canonical: `${BASE}/ru/news/${slug}`,
      languages: {
        ru: `${BASE}/ru/news/${slug}`,
        en: `${BASE}/news/${slug}`,
        "x-default": `${BASE}/news/${slug}`,
      },
    },
  };
}

const SOURCE_LABELS_RU: Record<string, string> = {
  official:   "Официальный источник",
  government: "Государственный портал",
  media:      "Публикация в СМИ",
  other:      "Источник",
};

export default async function RuNewsDetailPage({ params }: Props) {
  const { slug } = await params;
  // Returns null if ru_title or ru_body is empty — no EN fallback.
  const post = getNewsPostBySlug(slug, "ru");
  if (!post) notFound();

  // body is stored as Markdown in the DB — rendered by MarkdownBody below
  const categoryLabel =
    post.category.charAt(0).toUpperCase() +
    post.category.slice(1).replace(/-/g, " ");

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru/news"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Обновления ОАЭ
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        {categoryLabel}{post.datePublished ? ` · ${post.datePublished}` : ""}
      </p>
      <h1 className="text-[22px] font-bold text-gray-900 leading-snug mb-2">
        {post.title}
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        {post.summary}
      </p>

      {post.sourceUrl && (
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-navy bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full transition-colors mb-5"
        >
          {SOURCE_LABELS_RU[post.sourceLabel] ?? "Источник"} →
        </a>
      )}

      <CalendarContextCta
        locale="ru"
        contentType="news"
        calendarBase="/ru/calendar"
      />

      {post.body && (
        <MarkdownBody content={post.body} className="mb-5" />
      )}

      {post.dateUpdated && post.dateUpdated !== post.datePublished && (
        <p className="text-[11px] text-gray-400 mb-5">
          Обновлено: {post.dateUpdated}
        </p>
      )}

      {post.relatedGuideSlug && (
        <div className="border border-stone-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Связанное руководство
          </p>
          <Link
            href={`/ru/guides/${post.relatedGuideSlug}`}
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
          Затронуты этим изменением?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          Консультируем по актуальному законодательству ОАЭ и объясняем, как изменения влияют на вашу визу или бизнес.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Написать в WhatsApp →
        </a>
      </div>

    </div>
  );
}

import Link from "next/link";
import { getAllPublishedGuides, getPublishedGuideBySlug } from "@/lib/db/reader";
import { localizeValue } from "@/lib/localize-value";
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

export async function generateStaticParams() {
  const guides = getAllPublishedGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug, "ru");
  if (!guide) return {};
  return {
    title: `${guide.title} — Guidex Consulting`,
    description: guide.summary,
    alternates: {
      canonical: `${BASE}/ru/guides/${slug}`,
      languages: {
        "en":        `${BASE}/guides/${slug}`,
        "ru":        `${BASE}/ru/guides/${slug}`,
        "x-default": `${BASE}/guides/${slug}`,
      },
    },
  };
}

export default async function RuGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug, "ru");
  if (!guide) notFound();

  const overviewParagraphs = guide.overview.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-5 pb-14">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4 -mx-1">
        <Link
          href="/ru/guides"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          ← Все гайды
        </Link>
        <Link
          href="/find-my-visa"
          className="text-xs text-brass hover:opacity-70 transition-opacity px-1 py-3"
        >
          Найти маршрут →
        </Link>
      </div>

      {/* 1. Title + summary */}
      <GuideHeader
        frontmatter={{
          title:    guide.title,
          summary:  guide.summary,
          category: guide.category,
        }}
        locale="ru"
      />

      {/* 2. Quick-answer block */}
      <RouteSnapshot
        price={localizeValue(guide.price, "ru")}
        timeline={localizeValue(guide.timeline, "ru")}
        audience={guide.audience}
        steps={guide.steps}
        lastUpdated={localizeValue(guide.lastUpdated, "ru")}
        locale="ru"
      />

      {/* 3. CTAs */}
      <div className="mt-4 flex gap-2.5">
        <Link
          href="/find-my-visa"
          className="flex-1 text-center text-[13px] font-semibold text-navy border-2 border-navy/20 py-3 rounded-xl hover:border-navy/40 transition-colors"
        >
          Найти маршрут
        </Link>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-[13px] font-semibold bg-navy text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Спросить эксперта
        </a>
      </div>

      {/* 4. Step outline */}
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
            Читать полное руководство ↓
          </a>
        </div>
      )}

      {/* 5. Full detailed steps */}
      <div className="mt-10 pt-8 border-t border-stone-100" id="steps">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Пошагово
        </h2>
        {guide.steps.map((step) => (
          <StepCard
            key={step.id}
            number={step.stepOrder}
            title={step.title}
            what={step.what}
            where={step.where}
            address={step.address}
            cost={localizeValue(step.cost, "ru")}
            time={localizeValue(step.timeEst, "ru")}
            advice={step.advice}
            warning={step.warning || undefined}
            locale="ru"
          />
        ))}
      </div>

      {/* 6. Overview */}
      {overviewParagraphs.length > 0 && (
        <div className="mt-10 pt-8 border-t border-stone-100">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Обзор
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
        <p className="text-[14px] font-semibold text-white mb-1">Нужна помощь?</p>
        <p className="text-[12px] text-white/60 mb-3">Берём на себя подачу документов, медосмотры и оформление.</p>
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

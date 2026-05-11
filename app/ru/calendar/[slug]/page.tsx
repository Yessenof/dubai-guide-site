import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCalendarPageBySlug,
  type CalendarDateItem,
} from "@/lib/db/news-events-calendar";

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
  const page = getCalendarPageBySlug(slug, "ru");
  if (!page) return {};
  return {
    title: `${page.seoTitle || page.title} — Guidex Consulting`,
    description: page.metaDescription || page.summary,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${BASE}/ru/calendar/${slug}`,
      languages: {
        ru: `${BASE}/ru/calendar/${slug}`,
        en: `${BASE}/calendar/${slug}`,
        "x-default": `${BASE}/calendar/${slug}`,
      },
    },
  };
}

const DATE_TYPE_STYLES_RU: Record<
  CalendarDateItem["type"],
  { pill: string; label: string }
> = {
  "public-holiday": {
    pill: "bg-red-50 border-red-200 text-red-700",
    label: "Государственный праздник",
  },
  "important-date": {
    pill: "bg-amber-50 border-amber-200 text-amber-700",
    label: "Важная дата",
  },
  deadline: {
    pill: "bg-orange-50 border-orange-200 text-orange-700",
    label: "Дедлайн",
  },
  other: { pill: "bg-stone-50 border-stone-200 text-gray-500", label: "" },
};

const CONFIDENCE_BADGE_RU: Partial<Record<CalendarDateItem["confidence"], string>> =
  {
    expected: "ориентировочно",
    subject_to_official_confirmation: "ожидает подтверждения",
  };

export default async function RuCalendarDetailPage({ params }: Props) {
  const { slug } = await params;
  // Returns null if ru_title or ru_body is empty — no EN fallback.
  const page = getCalendarPageBySlug(slug, "ru");
  if (!page) notFound();

  const bodyParagraphs = page.body.split("\n\n").filter(Boolean);
  const monthLabel = page.month ? ` · Месяц ${page.month}` : "";

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru/calendar"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Календарь ОАЭ
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        Календарь ОАЭ · {page.year}{monthLabel}
      </p>
      <h1 className="text-[22px] font-bold text-gray-900 leading-snug mb-2">
        {page.title}
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        {page.summary}
      </p>

      {page.hasIslamicDates === 1 && (
        <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[12px] text-amber-800 leading-snug">
            Даты исламских праздников (Ид аль-Фитр, Ид аль-Адха, Рамадан) зависят от
            официального решения властей ОАЭ по наблюдению луны и могут быть изменены.
            Предварительные даты следует считать ориентировочными до официального
            подтверждения.
          </p>
        </div>
      )}

      {bodyParagraphs.length > 0 && (
        <div className="space-y-4 mb-5">
          {bodyParagraphs.map((p, i) => (
            <p key={i} className="text-[15px] text-gray-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      )}

      {page.dates.length > 0 && (
        <div className="mb-5">
          <div className="w-5 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Даты
          </h2>
          <ul className="space-y-1.5">
            {page.dates.map((item, i) => {
              const style =
                DATE_TYPE_STYLES_RU[item.type] ?? DATE_TYPE_STYLES_RU.other;
              const badge = CONFIDENCE_BADGE_RU[item.confidence];
              // label_ru preferred; label_en fallback for unlocalised date entries only
              const label = item.label_ru || item.label_en;
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 border border-stone-100 rounded-xl px-3 py-2.5 bg-stone-50/50"
                >
                  <span className="flex-shrink-0 text-[12px] font-medium text-gray-500 tabular-nums w-[88px] pt-0.5">
                    {item.date}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-800 leading-snug">
                      {label}
                      {badge && (
                        <span className="ml-1.5 text-[10px] font-normal text-amber-600">
                          ({badge})
                        </span>
                      )}
                    </p>
                    {style.label && (
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border ${style.pill}`}
                      >
                        {style.label}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {page.notes && (
        <p className="text-[12px] text-gray-500 leading-snug mb-5 border-l-2 border-stone-200 pl-3">
          {page.notes}
        </p>
      )}

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Планируете с учётом праздника или дедлайна?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          Помогаем с расчётом сроков продления виз, подачей корпоративных заявок и разрешений.
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

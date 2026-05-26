import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCalendarPageBySlug,
  type CalendarDateItem,
} from "@/lib/db/news-events-calendar";
import { calendarRobots } from "@/lib/db/indexing";
import CalendarMiniPreview from "@/components/calendar/CalendarMiniPreview";
import CalendarBriefSection from "@/components/calendar/CalendarBriefSection";
import MarkdownBody from "@/components/MarkdownBody";
import DetailHero from "@/components/detail/DetailHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

const IMG_SKYLINE = "/images/hubs/dubai-skyline-downtown.webp";

const MONTHS_RU_NOM = [
  "январь","февраль","март","апрель","май","июнь",
  "июль","август","сентябрь","октябрь","ноябрь","декабрь",
];

interface Props {
  params: Promise<{ slug: string }>;
}

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
    robots: calendarRobots(page),
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

function resolveCalendarMonth(
  year: number,
  month: number | null,
  dates: CalendarDateItem[],
  calendarType?: string,
): string | undefined {
  if (month) return `${year}-${String(month).padStart(2, "0")}`;
  if (dates.length === 0) return undefined;
  const months = [...new Set(dates.map(d => d.date.slice(0, 7)))].sort();
  if (months.length === 1) return months[0];
  if (calendarType === "yearly") return undefined;
  return months[0];
}

export default async function RuCalendarDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getCalendarPageBySlug(slug, "ru");
  if (!page) notFound();

  const calendarMonth = resolveCalendarMonth(page.year, page.month, page.dates, page.calendarType);

  const monthLabel = page.month ? ` · ${MONTHS_RU_NOM[page.month - 1]}` : "";
  const eyebrow    = `Календарь ОАЭ · ${page.year}${monthLabel}`;
  const heroImage  = page.imagePath || IMG_SKYLINE;
  const heroAlt    = page.imageAlt  || page.title;

  const yearBadge  = calendarMonth ? undefined : String(page.year);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru/calendar"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Календарь ОАЭ
      </Link>

      <DetailHero eyebrow={eyebrow} title={page.title} image={heroImage} imageAlt={heroAlt} />

      <p className="text-[15px] text-gray-600 leading-[1.6] mb-4">
        {page.summary}
      </p>

      {page.officialSourceUrl && (
        <div className="flex items-center gap-2 mb-5 pl-3 border-l-2 border-stone-200">
          <span className="text-[11px] font-medium text-gray-400">Источник:</span>
          <a
            href={page.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-brass hover:opacity-75 transition-opacity"
          >
            Официальный источник ↗
          </a>
          {page.lastVerifiedDate && (
            <span className="text-[11px] text-gray-400">· проверено {page.lastVerifiedDate}</span>
          )}
        </div>
      )}

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

      <CalendarMiniPreview
        locale="ru"
        calendarBase="/ru/calendar"
        calendarMonth={calendarMonth}
        dateItems={page.dates}
        yearBadge={yearBadge}
      />

      {page.body && (
        <MarkdownBody content={page.body} className="mb-6" />
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
              const label = item.label_ru || item.label_en;
              const hasBrief = !!item.brief_ru;
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 border border-stone-100 rounded-xl px-3 py-3 bg-stone-50/50"
                >
                  <span className="flex-shrink-0 text-[12px] font-semibold text-gray-500 tabular-nums w-[88px] pt-0.5">
                    {item.date}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                      {label}
                      {badge && (
                        <span className="ml-1.5 text-[10px] font-normal text-amber-600">
                          ({badge})
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {style.label && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${style.pill}`}
                        >
                          {style.label}
                        </span>
                      )}
                      {hasBrief && (
                        <span className="text-[10px] font-medium text-navy/60 border border-navy/20 px-1.5 py-0.5 rounded">
                          детали ↓
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <CalendarBriefSection items={page.dates} locale="ru" />

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

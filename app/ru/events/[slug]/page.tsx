import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@/lib/db/news-events-calendar";
import CalendarContextCta from "@/components/calendar/CalendarContextCta";

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
  const event = getEventBySlug(slug, "ru");
  if (!event) return {};
  return {
    title: `${event.seoTitle || event.title} — Guidex Consulting`,
    description: event.metaDescription || event.summary,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${BASE}/ru/events/${slug}`,
      languages: {
        ru: `${BASE}/ru/events/${slug}`,
        en: `${BASE}/events/${slug}`,
        "x-default": `${BASE}/events/${slug}`,
      },
    },
  };
}

const CONFIDENCE_NOTICES_RU: Partial<Record<string, string>> = {
  expected:
    "Указанная дата является ориентировочной, основанной на предыдущих годах. Официального объявления ещё не было.",
  subject_to_official_confirmation:
    "Дата зависит от официального решения властей ОАЭ по наблюдению луны. Считайте показанную дату ориентировочной до официального подтверждения.",
};

export default async function RuEventDetailPage({ params }: Props) {
  const { slug } = await params;
  // Returns null if ru_title or ru_body is empty — no EN fallback.
  const event = getEventBySlug(slug, "ru");
  if (!event) notFound();

  const bodyParagraphs = event.body.split("\n\n").filter(Boolean);
  const categoryLabel =
    event.category.charAt(0).toUpperCase() +
    event.category.slice(1).replace(/-/g, " ");
  const isSingleDay =
    !event.eventDateEnd || event.eventDateStart === event.eventDateEnd;
  const dateDisplay = isSingleDay
    ? event.eventDateStart
    : `${event.eventDateStart} – ${event.eventDateEnd}`;
  const confidenceNotice = CONFIDENCE_NOTICES_RU[event.dateConfidence];
  const calendarMonth = /^\d{4}-\d{2}/.test(event.eventDateStart)
    ? event.eventDateStart.slice(0, 7)
    : undefined;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru/events"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← События
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        {categoryLabel}{dateDisplay ? ` · ${dateDisplay}` : ""}
      </p>
      <h1 className="text-[22px] font-bold text-gray-900 leading-snug mb-2">
        {event.title}
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        {event.summary}
      </p>

      {confidenceNotice && (
        <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[12px] text-amber-800 leading-snug">
            {confidenceNotice}
          </p>
        </div>
      )}

      <CalendarContextCta
        locale="ru"
        contentType="event"
        calendarBase="/ru/calendar"
        calendarMonth={calendarMonth}
      />

      {bodyParagraphs.length > 0 && (
        <div className="space-y-4 mb-5">
          {bodyParagraphs.map((p, i) => (
            <p key={i} className="text-[15px] text-gray-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      )}

      {event.sourceUrl && (
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-navy bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full transition-colors mb-5"
        >
          Официальный источник →
        </a>
      )}

      {event.relatedGuideSlug && (
        <div className="border border-stone-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Связанное руководство
          </p>
          <Link
            href={`/ru/guides/${event.relatedGuideSlug}`}
            className="flex items-center justify-between group"
          >
            <span className="text-[13px] font-medium text-gray-800 group-hover:text-navy transition-colors">
              {event.relatedGuideSlug.replace(/-/g, " ")}
            </span>
            <span className="text-gray-400 group-hover:text-navy transition-colors text-sm">→</span>
          </Link>
        </div>
      )}

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Планируете с учётом этой даты?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          Помогаем рассчитать сроки продления виз, разрешений и соблюдения дедлайнов в праздничные и важные дни ОАЭ.
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

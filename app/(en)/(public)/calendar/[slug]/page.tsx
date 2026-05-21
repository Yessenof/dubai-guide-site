import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCalendarPageBySlug,
  type CalendarDateItem,
} from "@/lib/db/news-events-calendar";
import { calendarRobots } from "@/lib/db/indexing";
import CalendarContextCta from "@/components/calendar/CalendarContextCta";
import MarkdownBody from "@/components/MarkdownBody";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

interface Props {
  params: Promise<{ slug: string }>;
}

// Empty — DB tables have no content yet. Pages render on demand via SSR.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getCalendarPageBySlug(slug, "en");
  if (!page) return {};
  return {
    title: `${page.seoTitle || page.title} — Guidex Consulting`,
    description: page.metaDescription || page.summary,
    robots: calendarRobots(page),
    alternates: {
      canonical: `${BASE}/calendar/${slug}`,
      languages: {
        en: `${BASE}/calendar/${slug}`,
        "x-default": `${BASE}/calendar/${slug}`,
      },
    },
  };
}

const DATE_TYPE_STYLES: Record<
  CalendarDateItem["type"],
  { pill: string; label: string }
> = {
  "public-holiday": {
    pill: "bg-red-50 border-red-200 text-red-700",
    label: "Public holiday",
  },
  "important-date": {
    pill: "bg-amber-50 border-amber-200 text-amber-700",
    label: "Important date",
  },
  deadline: {
    pill: "bg-orange-50 border-orange-200 text-orange-700",
    label: "Deadline",
  },
  other: { pill: "bg-stone-50 border-stone-200 text-gray-500", label: "" },
};

const CONFIDENCE_BADGE: Partial<Record<CalendarDateItem["confidence"], string>> =
  {
    expected: "expected",
    subject_to_official_confirmation: "subject to confirmation",
  };

export default async function CalendarDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getCalendarPageBySlug(slug, "en");
  if (!page) notFound();

  // body is stored as Markdown in the DB — rendered by MarkdownBody below
  const monthLabel = page.month ? ` · Month ${page.month}` : "";
  const calendarMonth = page.month
    ? `${page.year}-${String(page.month).padStart(2, "0")}`
    : undefined;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/calendar"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Calendar
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        UAE Calendar · {page.year}{monthLabel}
      </p>
      <h1 className="text-[22px] font-bold text-gray-900 leading-snug mb-3">
        {page.title}
      </h1>
      <p className="text-[15px] text-gray-600 leading-[1.6] mb-4">
        {page.summary}
      </p>

      {page.officialSourceUrl && (
        <div className="flex items-center gap-2 mb-5 pl-3 border-l-2 border-stone-200">
          <span className="text-[11px] font-medium text-gray-400">Source:</span>
          <a
            href={page.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-brass hover:opacity-75 transition-opacity"
          >
            Official source ↗
          </a>
          {page.lastVerifiedDate && (
            <span className="text-[11px] text-gray-400">· verified {page.lastVerifiedDate}</span>
          )}
        </div>
      )}

      {page.hasIslamicDates === 1 && (
        <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[12px] text-amber-800 leading-snug">
            Islamic holiday dates depend on official UAE moon-sighting announcements
            and are subject to change. Dates shown are estimates until confirmed by
            UAE authorities.
          </p>
        </div>
      )}

      <CalendarContextCta
        locale="en"
        contentType="calendar"
        calendarBase="/calendar"
        calendarMonth={calendarMonth}
      />

      {page.body && (
        <MarkdownBody content={page.body} className="mb-6" />
      )}

      {page.dates.length > 0 && (
        <div className="mb-5">
          <div className="w-5 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Dates
          </h2>
          <ul className="space-y-1.5">
            {page.dates.map((item, i) => {
              const style = DATE_TYPE_STYLES[item.type] ?? DATE_TYPE_STYLES.other;
              const badge = CONFIDENCE_BADGE[item.confidence];
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
                      {item.label_en}
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
          Planning around a holiday or deadline?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          We help with visa renewals, permit timing, and compliance deadlines around
          UAE public holidays.
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

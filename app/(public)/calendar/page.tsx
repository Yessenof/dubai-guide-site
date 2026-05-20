import type { Metadata } from "next";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import SaveCalendarCta from "@/components/calendar/SaveCalendarCta";
import { getPublishedCalendarPages } from "@/lib/db/news-events-calendar";
import type { CalendarDateItemExtended } from "@/lib/calendar-mock-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Dubai Life Calendar: Important Dates, Deadlines and Events | Guidex",
  description:
    "UAE public holidays, corporate tax deadlines, business events, and key dates for Dubai residents and companies. Planning Dubai life, month by month.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/calendar`,
    languages: { ru: `${BASE}/ru/calendar` },
  },
};

interface PageProps {
  searchParams: Promise<{ month?: string; date?: string }>;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const { month: monthParam, date: dateParam } = await searchParams;

  // Parse ?date=2026-05-28 (takes priority) or ?month=2026-05
  let initialYear: number | undefined;
  let initialMonth: number | undefined;
  let initialDate: string | undefined;

  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    initialYear = parseInt(dateParam.slice(0, 4), 10);
    initialMonth = parseInt(dateParam.slice(5, 7), 10);
    initialDate = dateParam;
  } else if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    initialYear = parseInt(monthParam.slice(0, 4), 10);
    initialMonth = parseInt(monthParam.slice(5, 7), 10);
  }

  const calPages = getPublishedCalendarPages("en");
  const calItems = calPages.flatMap((p) => p.dates) as CalendarDateItemExtended[];

  return (
    <div className="max-w-3xl mx-auto px-5 pt-4 pb-12">

      {/* Compact product label */}
      <div className="mb-3">
        <h1 className="text-[19px] font-bold text-gray-900 leading-tight">
          Dubai Calendar
        </h1>
      </div>

      <CalendarGrid
        items={calItems}
        locale="en"
        initialYear={initialYear}
        initialMonth={initialMonth}
        initialDate={initialDate}
      />

      {/* Save to phone */}
      <div className="mt-8">
        <SaveCalendarCta locale="en" />
      </div>

      {/* Notes */}
      <div className="space-y-1.5 mt-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3.5 py-2">
          <p className="text-[12px] text-amber-700 leading-snug">
            Islamic dates (Eid, Ramadan) are subject to official UAE moon-sighting announcements and may change.
          </p>
        </div>
      </div>

      {/* SEO/RAG section */}
      <div className="mt-8 mb-8">
        <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          About Dubai Calendar
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          This calendar covers UAE public holidays, corporate tax deadlines, business and real estate events,
          and key dates for residents and companies in Dubai. Islamic holiday dates are subject to official
          UAE moon-sighting confirmation and may shift by one or two days. Verify all deadlines with official
          UAE government sources before acting.
        </p>
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[15px] font-semibold text-white mb-1">
          Planning around a UAE deadline or holiday?
        </p>
        <p className="text-[13px] text-white/60 mb-3">
          We advise on timing for visa renewals, company filings, and permit deadlines.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-brass hover:opacity-75 transition-opacity py-1"
        >
          Chat on WhatsApp →
        </a>
      </div>

    </div>
  );
}

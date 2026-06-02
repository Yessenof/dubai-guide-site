import type { Metadata } from "next";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import SaveCalendarCta from "@/components/calendar/SaveCalendarCta";
import { getPublishedCalendarPages } from "@/lib/db/news-events-calendar";
import type { CalendarDateItemExtended } from "@/lib/calendar-mock-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Календарь ОАЭ: праздники, события и дедлайны в Дубае и Абу-Даби | Guidex",
  description:
    "Праздники ОАЭ, налоговые сроки, бизнес-события, концерты и важные даты для резидентов и компаний в Дубае и Абу-Даби. Помесячный календарь ОАЭ.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/ru/calendar`,
    languages: { en: `${BASE}/calendar` },
  },
};

interface PageProps {
  searchParams: Promise<{ month?: string; date?: string }>;
}

export default async function RuCalendarPage({ searchParams }: PageProps) {
  const { month: monthParam, date: dateParam } = await searchParams;

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

  const calPages = getPublishedCalendarPages("ru");
  const calItems = calPages.flatMap((p) => p.dates) as CalendarDateItemExtended[];

  return (
    <div className="max-w-3xl mx-auto px-5 pt-4 pb-12">

      {/* Compact product label */}
      <div className="mb-3">
        <h1 className="text-[19px] font-bold text-gray-900 leading-tight">
          Календарь ОАЭ
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">
          важные даты, события и дедлайны в Дубае, Абу-Даби и ОАЭ
        </p>
      </div>

      <CalendarGrid
        items={calItems}
        locale="ru"
        initialYear={initialYear}
        initialMonth={initialMonth}
        initialDate={initialDate}
      />

      {/* Save to phone */}
      <div className="mt-8">
        <SaveCalendarCta locale="ru" />
      </div>

      {/* Notes */}
      <div className="space-y-1.5 mt-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3.5 py-2">
          <p className="text-[12px] text-amber-700 leading-snug">
            Исламские даты (Ид аль-Адха, Рамадан) зависят от официального подтверждения в ОАЭ и могут меняться.
          </p>
        </div>
      </div>

      {/* SEO/RAG section */}
      <div className="mt-8 mb-8">
        <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          О Календаре ОАЭ
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          Календарь охватывает праздники ОАЭ, сроки корпоративных налогов и compliance-дедлайны, бизнес-события, концерты и выставки,
          а также важные даты для резидентов и компаний в Дубае и Абу-Даби. Даты исламских праздников зависят от
          официального подтверждения по лунному календарю и могут сдвигаться на один-два дня. Перед
          принятием решений проверяйте дедлайны в официальных источниках ОАЭ.
        </p>
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[15px] font-semibold text-white mb-1">
          Планируете с учётом праздника или срока?
        </p>
        <p className="text-[13px] text-white/60 mb-3">
          Помогаем с расчётом сроков виз, корпоративных заявок и разрешений.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-brass hover:opacity-75 transition-opacity py-1"
        >
          Написать в WhatsApp →
        </a>
      </div>

    </div>
  );
}

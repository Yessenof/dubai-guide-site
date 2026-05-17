import type { Metadata } from "next";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { MOCK_CALENDAR_ITEMS } from "@/lib/calendar-mock-data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Календарь Дубая: праздники, важные даты и события | Guidex",
  description:
    "Праздники ОАЭ, налоговые сроки, бизнес-события и важные даты для резидентов и компаний в Дубае. Планируйте жизнь в ОАЭ помесячно.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/ru/calendar`,
    languages: { en: `${BASE}/calendar` },
  },
};

export default function RuCalendarPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 pt-4 pb-12">

      {/* Compact product label — minimal above-fold footprint */}
      <div className="mb-3">
        <h1 className="text-[19px] font-bold text-gray-900 leading-tight">
          Календарь Дубая
        </h1>
      </div>

      <CalendarGrid items={MOCK_CALENDAR_ITEMS} locale="ru" />

      {/* Notes — below calendar */}
      <div className="space-y-1.5 mt-8">
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3.5 py-2">
          <p className="text-[12px] text-amber-700 leading-snug">
            Исламские даты (Ид аль-Адха, Рамадан) зависят от официального подтверждения в ОАЭ и могут меняться.
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-2">
          <p className="text-[12px] text-blue-700 leading-snug">
            <strong>Демопрототип:</strong> даты показаны только для тестирования интерфейса. Не являются официальными данными.
          </p>
        </div>
      </div>

      {/* SEO/RAG section */}
      <div className="mt-8 mb-8">
        <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          О календаре Дубая
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          Календарь охватывает праздники ОАЭ, сроки корпоративных налогов, бизнес-события и недвижимость,
          а также важные даты для резидентов и компаний в Дубае. Даты исламских праздников зависят от
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

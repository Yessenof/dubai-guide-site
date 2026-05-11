import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Важные даты и события ОАЭ — Guidex Consulting",
  description:
    "Государственные праздники, важные сроки и ключевые даты для резидентов, инвесторов и предпринимателей в ОАЭ.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${BASE}/ru/events`,
  },
};

const categories = [
  "Праздники",
  "Важные даты",
  "Сроки",
  "События Дубая",
];

export default function RuEventsPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Главная
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        События ОАЭ
      </p>
      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-2">
        Важные даты и события ОАЭ
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        Государственные праздники, важные сроки и ключевые даты для резидентов, инвесторов и предпринимателей.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((chip) => (
          <span
            key={chip}
            className="inline-block text-[11px] text-gray-500 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="border border-dashed border-stone-200 rounded-xl px-4 py-4 text-center mb-4">
        <p className="text-[12px] text-gray-400 leading-snug">
          Ключевые даты ОАЭ добавляются. Государственные праздники и важные сроки появятся здесь. Смотрите также календарь.
        </p>
      </div>

      <Link
        href="/ru/calendar"
        className="flex items-center justify-between w-full mb-4 px-4 py-3 border border-stone-200 rounded-xl group hover:border-stone-300 hover:bg-stone-50 transition-all"
      >
        <div>
          <p className="text-[14px] font-semibold text-gray-900 leading-tight">Календарь ОАЭ</p>
          <p className="text-[12px] text-gray-500 leading-tight mt-0.5">Праздники и даты по месяцам</p>
        </div>
        <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
      </Link>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Планируете с учётом дедлайна?
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

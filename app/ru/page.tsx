import Link from "next/link";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Guidex Consulting — Гайды по Дубаю: визы, компании, документы",
  description:
    "Пошаговые руководства по оформлению виз, регистрации компаний и работе с государственными органами ОАЭ.",
  alternates: {
    canonical: `${BASE}/ru`,
    languages: {
      "en":        BASE,
      "ru":        `${BASE}/ru`,
      "x-default": BASE,
    },
  },
};

const services = [
  {
    label: "Визы",
    description: "Рабочая виза, семейная виза, золотая виза, продление.",
    href: "/ru/visas",
    meta: "Резидентские визы ОАЭ",
  },
  {
    label: "Открытие компании",
    description: "Mainland или свободная зона. С банковским счётом.",
    href: "/ru/company-setup",
    meta: "Mainland · Free zone · Банковский счёт",
  },
  {
    label: "Все гайды",
    description: "Пошаговые руководства по всем процессам.",
    href: "/ru/guides",
    meta: "15 гайдов опубликовано",
  },
];

export default function RuHomePage() {
  return (
    <div>

      {/* Hero */}
      <section className="px-5 pt-12 pb-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Дубай · ОАЭ
          </p>
          <h1 className="text-[28px] font-bold text-gray-900 leading-snug mb-4">
            Гайды по Дубаю — визы, компании, документы
          </h1>
          <p className="text-[15px] text-gray-600 leading-snug mb-8 max-w-md">
            Пошаговые руководства по оформлению виз, регистрации компаний и работе с государственными органами ОАЭ. Актуальные официальные сборы и сроки.
          </p>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy text-white text-[14px] font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Получить консультацию →
          </a>
        </div>
      </section>

      {/* Service links */}
      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto space-y-3">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block group border border-stone-200 rounded-2xl p-5 bg-stone-50 hover:border-stone-300 hover:bg-stone-100 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
                  {s.label}
                </h2>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                  →
                </span>
              </div>
              <p className="text-[13px] text-gray-600 leading-snug mb-3">
                {s.description}
              </p>
              <span className="inline-block text-[11px] text-brass/80 bg-brass/[.08] px-2.5 py-1 rounded-full">
                {s.meta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-5 pb-14">
        <div className="max-w-2xl mx-auto">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-gray-700 transition-colors group"
          >
            <div>
              <p className="text-sm font-semibold">Написать в WhatsApp</p>
              <p className="text-xs text-gray-400 mt-0.5">Ответим на русском языке</p>
            </div>
            <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-lg">→</span>
          </a>
        </div>
      </section>

    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

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

type ServiceCard =
  | { label: string; description: string; meta: string; href: string }
  | { label: string; description: string; meta: string; soon: true };

const services: ServiceCard[] = [
  {
    label: "Визы",
    description: "Рабочая виза, семейная виза, золотая виза, продление.",
    href: "/ru/visas",
    meta: "Резидентские визы ОАЭ",
  },
  {
    label: "Открытие компании",
    description: "Mainland или free zone. С банковским счётом.",
    href: "/ru/company-setup",
    meta: "Mainland · Free zone · Банковский счёт",
  },
  {
    label: "Государственные услуги",
    description: "Аттестация документов, Amer, PRO услуги и официальные процедуры.",
    href: "/ru/government",
    meta: "Документы · Amer · PRO",
  },
  {
    label: "Туризм и аренда",
    description: "Holiday homes, краткосрочная аренда и туристические разрешения.",
    href: "/ru/tourism",
    meta: "DTCM · Краткосрочная аренда",
  },
  {
    label: "Банкинг и консультации",
    description: "Банки, налоговое резидентство, корпоративный счёт и практические разборы.",
    href: "/ru/banking-tax",
    meta: "FTA · EmaraTax · Банки",
  },
];

export default function RuHomePage() {
  return (
    <div>

      {/* Hero */}
      <section className="pt-8 pb-0 px-5">
        <div className="max-w-2xl mx-auto">
          <PageHero
            asset={{
              src: "/images/hubs/dubai-skyline-downtown.webp",
              alt: "Dubai Downtown skyline at dusk with Burj Khalifa rising above surrounding towers",
              tone: "cool",
            }}
            gradientStyle="light"
            overline="Дубай · ОАЭ"
            heading="Гайды по Дубаю — визы, компании, документы"
            subtext="Пошаговые руководства по оформлению виз, регистрации компаний и работе с государственными органами ОАЭ. Актуальные официальные сборы и сроки."
          >
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy text-white text-[14px] font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Получить консультацию →
            </a>
          </PageHero>
        </div>
      </section>

      {/* Service links */}
      <section className="px-5 pb-10">
        <div className="max-w-2xl mx-auto space-y-3">
          {services.map((s) =>
            "soon" in s ? (
              <div
                key={s.label}
                className="border border-stone-200 rounded-2xl p-5 bg-stone-50"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h2 className="text-[15px] font-semibold text-gray-400 leading-snug">
                    {s.label}
                  </h2>
                  <span className="flex-shrink-0 text-[10px] font-medium text-gray-400 bg-stone-200 px-2 py-1 rounded-full leading-none whitespace-nowrap mt-0.5">
                    Скоро
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 leading-snug mb-3">
                  {s.description}
                </p>
                <span className="inline-block text-[11px] text-gray-400 bg-stone-100 px-2.5 py-1 rounded-full">
                  {s.meta}
                </span>
              </div>
            ) : (
              <Link
                key={s.label}
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
            )
          )}
        </div>
      </section>

      {/* All guides text link */}
      <div className="px-5 pb-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/ru/guides"
            className="inline-block text-sm font-semibold text-brass hover:opacity-75 transition-opacity py-3"
          >
            Все гайды →
          </Link>
        </div>
      </div>

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

import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_URL = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Контакты — Guidex Consulting",
  description: "Задайте вопрос по визе, открытию компании или документам в Дубае. Отвечаем на русском языке.",
  alternates: {
    canonical: `${BASE}/ru/contact`,
    languages: {
      "en":        `${BASE}/contact`,
      "ru":        `${BASE}/ru/contact`,
      "x-default": `${BASE}/contact`,
    },
  },
};

export default function RuContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
        Контакты
      </p>
      <h1 className="text-[26px] font-bold text-gray-900 mb-3">
        Задать вопрос
      </h1>
      <p className="text-[15px] text-gray-600 leading-snug mb-10 max-w-sm">
        Есть вопрос по визе или документам? Напишите нам напрямую. Отвечаем на русском языке.
      </p>

      <div className="space-y-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-gray-900 text-white rounded-2xl px-5 py-4 hover:bg-gray-700 transition-colors group"
        >
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-gray-400 mt-0.5">Написать сообщение напрямую</p>
          </div>
          <span className="text-gray-500 group-hover:text-gray-300 transition-colors text-lg">→</span>
        </a>
      </div>
    </div>
  );
}

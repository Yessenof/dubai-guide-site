import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedNewsPosts } from "@/lib/db/news-events-calendar";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Обновления законодательства ОАЭ — Guidex Consulting",
  description:
    "Изменения визовых правил, налогов, корпоративного законодательства и государственных требований в ОАЭ для резидентов, инвесторов и владельцев бизнеса.",
  alternates: {
    canonical: `${BASE}/ru/news`,
    languages: { en: `${BASE}/news` },
  },
};

const CATEGORY_LABELS_RU: Record<string, string> = {
  visa:       "Визы",
  company:    "Бизнес",
  tax:        "Налоги",
  government: "Госуслуги",
  tourism:    "Туризм",
  banking:    "Банки",
};

const categories = [
  "Визы",
  "Бизнес",
  "Налоги",
  "Недвижимость",
  "Госуслуги",
  "Туризм",
];

const relatedHubs = [
  { label: "Визы",                    href: "/ru/visas" },
  { label: "Регистрация компании",    href: "/ru/company-setup" },
  { label: "Банкинг и налоги",        href: "/ru/banking-tax" },
  { label: "Госуслуги",               href: "/ru/government" },
  { label: "Туризм и аренда",         href: "/ru/tourism" },
];

export default async function RuNewsPage() {
  const posts = getPublishedNewsPosts("ru");

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/ru"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Главная
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        Обновления ОАЭ
      </p>
      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-2">
        Обновления законодательства ОАЭ
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        Изменения визовых правил, налогов, корпоративных требований и государственных регламентов для резидентов и инвесторов.
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

      {posts.length === 0 ? (
        <div className="border border-dashed border-stone-200 rounded-xl px-4 py-4 text-center mb-5">
          <p className="text-[12px] text-gray-400 leading-snug">
            Обновления готовятся. Актуальные изменения законодательства и практические новости появятся здесь после публикации.
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5 mb-5">
          {posts.map((post) => {
            const catLabel = CATEGORY_LABELS_RU[post.category] ?? post.category;
            return (
              <li key={post.slug}>
                <Link
                  href={`/ru/news/${post.slug}`}
                  className="flex items-start justify-between gap-3 border border-stone-100 rounded-xl px-3 py-2.5 bg-stone-50/50 hover:border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-brass">
                        {catLabel}
                      </span>
                      {post.datePublished && (
                        <>
                          <span className="text-gray-300 text-[10px]">·</span>
                          <span className="text-[11px] text-gray-400">{post.datePublished}</span>
                        </>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                      {post.title}
                    </p>
                    {post.summary && (
                      <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm flex-shrink-0 mt-0.5">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/ru/find-my-visa"
        className="flex items-center justify-between w-full mb-5 px-4 py-3 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Найти маршрут</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Ответьте на 2–3 вопроса →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      <div className="pt-5 border-t border-stone-100 mb-5">
        <div className="w-5 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Гайды по процедурам
        </h2>
        <div className="space-y-0.5">
          {relatedHubs.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between py-2 group border-b border-stone-100 last:border-0"
            >
              <span className="text-[14px] text-gray-700 group-hover:text-gray-900 transition-colors">
                {link.label}
              </span>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Вопрос по изменению правил?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          Разъясняем актуальные требования ОАЭ и помогаем понять, как изменения касаются визы или бизнеса.
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

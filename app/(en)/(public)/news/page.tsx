import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedNewsPosts } from "@/lib/db/news-events-calendar";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "UAE Regulatory Updates — Guidex Consulting",
  description:
    "Visa rule changes, business and tax updates, property laws, and government announcements relevant to Dubai residents, investors, and business owners.",
  alternates: {
    canonical: `${BASE}/news`,
    languages: { ru: `${BASE}/ru/news` },
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  visa:       "Visa",
  company:    "Business",
  tax:        "Tax",
  government: "Government",
  tourism:    "Tourism",
  banking:    "Banking",
};

const categories = [
  "Visa updates",
  "Business",
  "Tax",
  "Property",
  "Government",
  "Tourism",
];

const relatedHubs = [
  { label: "Visas",                   href: "/visas" },
  { label: "Company Setup",           href: "/company-setup" },
  { label: "Banking & Tax",           href: "/banking-tax" },
  { label: "Government Services",     href: "/government" },
  { label: "Tourism & Holiday Homes", href: "/tourism" },
];

export default async function NewsPage() {
  const posts = getPublishedNewsPosts("en");

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Home
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
        UAE Updates
      </p>
      <h1 className="text-[24px] font-bold text-gray-900 leading-snug mb-2">
        UAE Regulatory Updates
      </h1>
      <p className="text-[14px] text-gray-600 leading-snug mb-4">
        Visa rule changes, business and tax updates, property laws, and government announcements for Dubai residents and investors.
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
            Updates are being prepared. Regulatory and practical news will appear here as published.
          </p>
        </div>
      ) : (
        <ul className="space-y-1.5 mb-5">
          {posts.map((post) => {
            const catLabel = CATEGORY_LABELS[post.category] ?? post.category;
            return (
              <li key={post.slug}>
                <Link
                  href={`/news/${post.slug}`}
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
        href="/find-my-visa"
        className="flex items-center justify-between w-full mb-5 px-4 py-3 bg-navy rounded-xl group"
      >
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">Find My Route</p>
          <p className="text-[12px] text-white/60 leading-tight mt-0.5">Answer 2–3 questions →</p>
        </div>
        <span className="text-white/60 text-sm">→</span>
      </Link>

      <div className="pt-5 border-t border-stone-100 mb-5">
        <div className="w-5 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Procedure guides
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
          Question about a rule change?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          We advise on current UAE regulations and confirm how changes affect your visa or business.
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

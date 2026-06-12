import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedGuideBySlug, getPublishedGuidesForBand } from "@/lib/db/reader";
import { RELATED_GUIDES } from "@/lib/related-guides";
import StepCard from "@/components/StepCard";
import { GuideCta } from "@/components/GuideCta";
import SourceNote from "@/components/SourceNote";
import type { Metadata } from "next";

const WHATSAPP_HREF = "https://wa.me/971506304817";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SLUG = "tax-residency-certificate-uae";

export const metadata: Metadata = {
  title: "Tax Residency Certificate in UAE — Guidex Consulting",
  description:
    "Need UAE tax residency proof for a foreign bank, tax authority or international income? Guidex reviews your case, prepares the file and guides the TRC process through FTA.",
  alternates: {
    canonical: `${BASE}/guides/${SLUG}`,
    languages: {
      "en":        `${BASE}/guides/${SLUG}`,
      "ru":        `${BASE}/ru/guides/${SLUG}`,
      "x-default": `${BASE}/guides/${SLUG}`,
    },
  },
};

const WHY_CARDS = [
  {
    heading: "Eligibility confirmed before you start",
    body: "There are multiple eligibility routes and applicant types. We identify the correct one for your situation before any application is filed.",
  },
  {
    heading: "Complete file, first time",
    body: "Incomplete applications cause delays. We review every document against FTA requirements before submission.",
  },
  {
    heading: "EmaraTax managed for you",
    body: "Where authorised, Guidex manages the EmaraTax submission process. You do not need to navigate the portal yourself.",
  },
];

export default function TrcPage() {
  const guide = getPublishedGuideBySlug(SLUG, "en");
  if (!guide) notFound();

  const overviewParagraphs = guide.overview.split("\n\n").filter(Boolean);
  const relatedGuides = getPublishedGuidesForBand(RELATED_GUIDES[SLUG] ?? []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "All Guides", item: `${BASE}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${BASE}/guides/${SLUG}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/${SLUG}` },
    url: `${BASE}/guides/${SLUG}`,
    inLanguage: "en",
    dateModified: guide.updatedAt,
    publisher: { "@type": "Organization", name: "Guidex Consulting", url: BASE },
  };

  const howToSchema = guide.steps.length >= 2 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.summary,
    step: guide.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.what,
      url: `${BASE}/guides/${SLUG}#step-${s.stepOrder}`,
    })),
  } : null;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-5 pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-5 -mx-1">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          All guides
        </Link>
        <Link
          href="/banking-tax"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          Banking and Tax
        </Link>
      </div>

      {/* Navy premium header block */}
      <div className="bg-navy rounded-2xl px-5 py-8 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-3">
          Federal Tax Authority · EmaraTax
        </p>
        <h1 className="text-[26px] font-bold text-white leading-snug mb-4">
          {guide.title}
        </h1>
        <p className="text-[15px] text-white/80 leading-relaxed mb-5">
          {guide.summary}
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-white/80 leading-snug">For investors, founders, and UAE residents with international financial ties</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-white/80 leading-snug">Correct FTA eligibility route confirmed before submission</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brass mt-2" />
            <span className="text-[14px] text-white/80 leading-snug">File prepared and checked by Guidex before EmaraTax submission</span>
          </li>
        </ul>
      </div>

      {/* CTA block */}
      <div className="flex gap-2.5 mb-6">
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={SLUG}
          ctaType="whatsapp"
          locale="en"
          isExternal
          className="flex-1 text-center text-[13px] font-semibold bg-navy text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Check My Case
        </GuideCta>
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={SLUG}
          ctaType="whatsapp"
          locale="en"
          isExternal
          className="flex-1 text-center text-[13px] font-semibold text-navy border-2 border-navy/20 py-3 rounded-xl hover:border-navy/40 transition-colors"
        >
          Chat on WhatsApp
        </GuideCta>
      </div>

      {/* Two-stat strip */}
      <div className="flex items-center gap-px bg-stone-200 rounded-xl overflow-hidden mb-10">
        <div className="flex-1 bg-stone-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Issued by</p>
          <p className="text-[13px] font-semibold text-gray-800 leading-tight">Federal Tax Authority</p>
        </div>
        <div className="flex-1 bg-stone-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Process</p>
          <p className="text-[13px] font-semibold text-gray-800 leading-tight">Reviewed after complete file</p>
        </div>
      </div>

      {/* Why Guidex */}
      <div className="mb-10">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
          Why clients use Guidex for TRC
        </h2>
        <div className="space-y-3">
          {WHY_CARDS.map((c) => (
            <div key={c.heading} className="border border-stone-200 rounded-xl px-4 py-4 bg-stone-50">
              <p className="text-[14px] font-semibold text-gray-900 mb-1.5">{c.heading}</p>
              <p className="text-[13px] text-gray-600 leading-snug">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Source note */}
      <div className="mb-10">
        <SourceNote
          status="confirmed"
          note="TRC eligibility and process based on FTA official guidelines via EmaraTax. Requirements differ by applicant type and residency route."
          sourceLabel="Federal Tax Authority"
          lastChecked="Checked May 2026"
        />
      </div>

      {/* Steps */}
      {guide.steps.length > 0 && (
        <div className="mb-10" id="steps">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Step by step
          </h2>
          {guide.steps.map((step) => (
            <StepCard
              key={step.id}
              number={step.stepOrder}
              title={step.title}
              what={step.what}
              where={step.where}
              address={step.address}
              cost={step.cost}
              time={step.timeEst}
              advice={step.advice}
              warning={step.warning || undefined}
            />
          ))}
        </div>
      )}

      {/* Fees and timeline */}
      <div className="mt-10 pt-8 border-t border-stone-100">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Fees and timeline
        </h2>
        <p className="text-[14px] text-gray-700 leading-relaxed mb-3">{guide.price}</p>
        <p className="text-[14px] text-gray-700 leading-relaxed">{guide.timeline}</p>
      </div>

      {/* Overview */}
      {overviewParagraphs.length > 0 && (
        <div className="mt-10 pt-8 border-t border-stone-100">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Overview
          </h2>
          {overviewParagraphs.map((text, i) => (
            <p key={i} className="text-[15px] text-gray-600 leading-relaxed mb-4 last:mb-0">
              {text}
            </p>
          ))}
        </div>
      )}

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <div className="mt-10 pt-8 border-t border-stone-100">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Related guides
          </h2>
          <div className="space-y-2.5">
            {relatedGuides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="block group">
                <div className="border border-stone-200 rounded-2xl p-4 hover:border-stone-300 hover:bg-stone-100 transition-all bg-stone-50">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-[14px] font-semibold text-gray-900 leading-snug">
                      {g.title}
                    </h3>
                    <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 text-sm mt-0.5">
                      →
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-snug">{g.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="mt-10 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">Ready to start your TRC application?</p>
        <p className="text-[12px] text-white/60 mb-3">We review your eligibility, prepare the file, and manage the FTA process for you.</p>
        <GuideCta
          href={WHATSAPP_HREF}
          guideSlug={SLUG}
          ctaType="whatsapp"
          locale="en"
          isExternal
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          Chat on WhatsApp →
        </GuideCta>
      </div>

    </div>
  );
}

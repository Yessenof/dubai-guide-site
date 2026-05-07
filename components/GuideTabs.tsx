"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import RouteSnapshot from "@/components/RouteSnapshot";
import StepCard from "@/components/StepCard";
import { localizeValue } from "@/lib/localize-value";
import type { GuideData } from "@/lib/db/reader";
import type { GuideGroupConfig } from "@/lib/guide-groups";
import type { Locale } from "@/lib/db/reader";

const WHATSAPP_HREF = "https://wa.me/971506304817";

const STRINGS = {
  en: {
    allGuides:   "← All guides",
    findRoute:   "Find my route →",
    findMyRoute: "Find My Route",
    askExpert:   "Ask an Expert",
    seeGuide:    "See full step-by-step guide ↓",
    stepByStep:  "Step by step",
    overview:    "Overview",
    helpHeading: "Need help with this process?",
    helpBody:    "We manage government submissions, medicals, and filings on your behalf.",
    whatsapp:    "Chat on WhatsApp →",
  },
  ru: {
    allGuides:   "← Все гайды",
    findRoute:   "Найти маршрут →",
    findMyRoute: "Найти маршрут",
    askExpert:   "Спросить эксперта",
    seeGuide:    "Читать полное руководство ↓",
    stepByStep:  "Пошагово",
    overview:    "Обзор",
    helpHeading: "Нужна помощь?",
    helpBody:    "Берём на себя подачу документов, сопровождение этапов и оформление.",
    whatsapp:    "Написать в WhatsApp →",
  },
};

interface Props {
  group:        GuideGroupConfig;
  guides:       GuideData[];
  defaultRoute: string;
  locale?:      Locale;
}

export default function GuideTabs({
  group,
  guides,
  defaultRoute,
  locale = "en",
}: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const t        = STRINGS[locale];

  const guidesHref    = locale === "ru" ? "/ru/guides" : "/guides";
  const findVisaHref  = "/find-my-visa";

  const groupTitle   = locale === "ru" ? (group.ruTitle   ?? group.title)   : group.title;
  const groupSummary = locale === "ru" ? (group.ruSummary ?? group.summary) : group.summary;

  const [activeRoute, setActiveRoute] = useState(defaultRoute);

  const variantIndex = group.variants.findIndex((v) => v.routeKey === activeRoute);
  const activeIndex  = variantIndex === -1 ? 0 : variantIndex;
  const activeGuide  = guides[activeIndex];

  const overviewParagraphs = activeGuide.overview.split("\n\n").filter(Boolean);

  function switchTab(routeKey: string) {
    setActiveRoute(routeKey);
    router.replace(`${pathname}?route=${routeKey}`, { scroll: false });
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-5 pb-14">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4 -mx-1">
        <Link
          href={guidesHref}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors px-1 py-3"
        >
          {t.allGuides}
        </Link>
        <Link
          href={findVisaHref}
          className="text-xs text-brass hover:opacity-70 transition-opacity px-1 py-3"
        >
          {t.findRoute}
        </Link>
      </div>

      {/* Category */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-brass flex-shrink-0">
          <CategoryIcon category={group.category} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 capitalize">
          {group.category.replace(/-/g, " ")}
        </p>
      </div>

      {/* Title + summary */}
      <h1 className="text-[26px] font-bold text-gray-900 leading-snug mb-3">
        {groupTitle}
      </h1>
      <p className="text-[15px] text-gray-600 leading-relaxed">
        {groupSummary}
      </p>

      {/* Sticky variant tab bar */}
      <div className="sticky top-14 z-10 bg-white -mx-5 px-5 py-3 mt-5 mb-1 border-b border-stone-100">
        <div className="flex gap-2">
          {group.variants.map((v) => (
            <button
              key={v.routeKey}
              type="button"
              onClick={() => switchTab(v.routeKey)}
              className={`px-4 py-3 rounded-full text-[13px] font-medium transition-colors ${
                activeRoute === v.routeKey
                  ? "bg-navy text-white"
                  : "bg-stone-100 text-gray-500 hover:bg-stone-200"
              }`}
            >
              {locale === "ru" ? (v.ruLabel ?? v.label) : v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick-answer block */}
      <RouteSnapshot
        price={localizeValue(activeGuide.price, locale)}
        timeline={localizeValue(activeGuide.timeline, locale)}
        audience={activeGuide.audience}
        steps={activeGuide.steps}
        lastUpdated={localizeValue(activeGuide.lastUpdated, locale)}
        locale={locale}
      />

      {/* CTAs */}
      <div className="mt-4 flex gap-2.5">
        <Link
          href={findVisaHref}
          className="flex-1 text-center text-[13px] font-semibold text-navy border-2 border-navy/20 py-3 rounded-xl hover:border-navy/40 transition-colors"
        >
          {t.findMyRoute}
        </Link>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-[13px] font-semibold bg-navy text-white py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          {t.askExpert}
        </a>
      </div>

      {/* Step outline */}
      {activeGuide.steps.length > 0 && (
        <div className="mt-6">
          <ol className="space-y-1.5">
            {activeGuide.steps.map((step, i) => (
              <li key={step.id} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy/[0.08] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-navy tabular-nums leading-none">{i + 1}</span>
                </span>
                <span className="text-[13px] font-medium text-gray-800 leading-snug">{step.title}</span>
              </li>
            ))}
          </ol>
          <a
            href="#steps"
            className="inline-block mt-3 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity"
          >
            {t.seeGuide}
          </a>
        </div>
      )}

      {/* Full steps */}
      <div className="mt-10 pt-8 border-t border-stone-100" id="steps">
        <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-6">
          {t.stepByStep}
        </h2>
        {activeGuide.steps.map((step) => (
          <StepCard
            key={step.id}
            number={step.stepOrder}
            title={step.title}
            what={step.what}
            where={step.where}
            address={step.address}
            cost={localizeValue(step.cost, locale)}
            time={localizeValue(step.timeEst, locale)}
            advice={step.advice}
            warning={step.warning || undefined}
            locale={locale}
          />
        ))}
      </div>

      {/* Overview */}
      {overviewParagraphs.length > 0 && (
        <div className="mt-10 pt-8 border-t border-stone-100">
          <div className="w-6 h-0.5 bg-brass rounded-full mb-2" />
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
            {t.overview}
          </h2>
          {overviewParagraphs.map((text, i) => (
            <p key={i} className="text-[15px] text-gray-600 leading-relaxed mb-4 last:mb-0">
              {text}
            </p>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-10 bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">{t.helpHeading}</p>
        <p className="text-[12px] text-white/60 mb-3">{t.helpBody}</p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brass hover:opacity-75 transition-opacity py-2"
        >
          {t.whatsapp}
        </a>
      </div>

    </div>
  );
}

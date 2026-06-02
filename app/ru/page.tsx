import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ServiceCardLink } from "@/components/ServiceCardLink";
import FeaturedSlider from "@/components/FeaturedSlider";
import type { CarouselSlide } from "@/components/FeaturedSlider";
import RouteSnapshotBand from "@/components/RouteSnapshotBand";
import { getPublishedGuidesForBand, getRecentPublishedGuidesLocale } from "@/lib/db/reader";
import type { GuideListItem } from "@/lib/db/reader";
import { localizeValue } from "@/lib/localize-value";
import {
  getPublishedNewsPosts,
  getPublishedEvents,
  getPublishedCalendarPages,
} from "@/lib/db/news-events-calendar";
import type {
  CalendarDateItem,
  CalendarPageSummary,
  NewsPostSummary,
  EventSummary,
} from "@/lib/db/news-events-calendar";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

export const metadata: Metadata = {
  title: "Guidex Consulting — Визы, компании и жизнь в Дубае",
  description:
    "Пошаговые руководства по визам в ОАЭ, открытию компании в Дубае и переезду. Официальные сборы, сроки и порядок действий.",
  alternates: {
    canonical: `${BASE}/ru`,
    languages: {
      "en":        BASE,
      "ru":        `${BASE}/ru`,
      "x-default": BASE,
    },
  },
};

const BAND_SLUGS = [
  "employment-visa",
  "spouse-dependent-visa-dubai-outside-country",
  "child-dependent-visa-dubai-outside-country",
  "golden-visa-dubai-property",
];

const IMG_SKYLINE = "/images/hubs/dubai-skyline-downtown.webp";
const IMG_DIFC    = "/images/hubs/difc-business-bay-glass-towers.webp";
const IMG_JLT     = "/images/hubs/jlt-dubai-towers-sunset-reflection.webp";

// ─── Images ───────────────────────────────────────────────────────────────────

function guideImage(category: string): string {
  if (["visas", "government", "living", "tourism"].includes(category)) return IMG_JLT;
  return IMG_DIFC;
}

// ─── Carousel priority ────────────────────────────────────────────────────────

const GUIDE_PRIORITY_SLUGS = [
  "employment-visa",
  "golden-visa-dubai-property",
  "mainland-company-setup-dubai",
  "free-zone-company-setup-dubai",
  "spouse-dependent-visa-dubai-outside-country",
  "document-attestation-dubai",
  "holiday-home-permit-dubai",
];

function catLabelRu(cat: string): string {
  const MAP: Record<string, string> = {
    visas:           "Визы",
    "company-setup": "Компания",
    government:      "Госуслуги",
    living:          "Жизнь в Дубае",
    hiring:          "Трудоустройство",
    tourism:         "Туризм",
  };
  return MAP[cat] ?? cat.replace(/-/g, " ");
}

// Gradient bottom colors for visual variety per content type
const GRAD_CALENDAR    = "rgba(4,47,46,0.97)";
const GRAD_COMPLIANCE  = "rgba(55,28,0,0.97)";
const GRAD_EVENT       = "rgba(10,22,40,0.97)";
const GRAD_NEWS        = "rgba(18,18,40,0.97)";
const GRAD_GUIDE_VISA  = "rgba(10,22,40,0.97)";
const GRAD_GUIDE_BIZ   = "rgba(20,15,5,0.97)";

function buildCarouselSlides(
  news: NewsPostSummary[],
  events: EventSummary[],
  calPages: CalendarPageSummary[],
  guides: GuideListItem[],
  limit = 7,
): CarouselSlide[] {
  const todayDate   = new Date();
  const curYear     = todayDate.getFullYear();
  const curMonth    = todayDate.getMonth() + 1;
  const eventCutoff = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const newsCutoff  = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const slides: CarouselSlide[] = [];

  // 1. Current and upcoming monthly calendar pages
  const monthlyPages = calPages
    .filter((cp) => {
      if (!cp.year || !cp.month) return false;
      if (cp.year > curYear) return true;
      if (cp.year === curYear && cp.month >= curMonth - 1 && cp.month <= curMonth + 3) return true;
      return false;
    })
    .sort((a, b) => {
      const aDiff = Math.abs((a.year! - curYear) * 12 + ((a.month ?? 0) - curMonth));
      const bDiff = Math.abs((b.year! - curYear) * 12 + ((b.month ?? 0) - curMonth));
      return aDiff - bDiff;
    });

  const topicPages = calPages.filter((cp) => !cp.month || !cp.year);

  for (const cp of monthlyPages) {
    slides.push({
      href:         `/ru/calendar/${cp.slug}`,
      title:        cp.title,
      badge:        "Календарь ОАЭ",
      bgImage:      IMG_SKYLINE,
      cta:          "Открыть календарь →",
      gradientFrom: GRAD_CALENDAR,
    });
  }

  // 2. Current/upcoming events (not ended more than 7 days ago)
  for (const ev of events) {
    if (ev.eventDateEnd && ev.eventDateEnd < eventCutoff) continue;
    if (!ev.eventDateEnd && ev.eventDateStart < eventCutoff) continue;
    slides.push({
      href:         `/ru/events/${ev.slug}`,
      title:        ev.title,
      badge:        "Событие",
      meta:         formatShortDate(ev.eventDateStart),
      bgImage:      IMG_JLT,
      cta:          "К событию →",
      gradientFrom: GRAD_EVENT,
    });
  }

  // 3. Recent news (within 90 days)
  for (const n of news) {
    if (n.datePublished < newsCutoff) continue;
    slides.push({
      href:         `/ru/news/${n.slug}`,
      title:        n.title,
      badge:        "Новость",
      meta:         formatShortDate(n.datePublished),
      bgImage:      IMG_DIFC,
      cta:          "Читать →",
      gradientFrom: GRAD_NEWS,
    });
  }

  // 4. Topic calendar pages (compliance — always relevant)
  for (const cp of topicPages) {
    slides.push({
      href:         `/ru/calendar/${cp.slug}`,
      title:        cp.title,
      badge:        "Дедлайн ОАЭ",
      bgImage:      IMG_DIFC,
      cta:          "Подробнее →",
      gradientFrom: GRAD_COMPLIANCE,
    });
  }

  // 5. Priority guides as filler
  const guidesMap = new Map(guides.map((g) => [g.slug, g]));
  for (const slug of GUIDE_PRIORITY_SLUGS) {
    if (slides.length >= limit) break;
    const g = guidesMap.get(slug);
    if (!g) continue;
    const isVisa = ["visas", "government", "living"].includes(g.category);
    slides.push({
      href:         `/ru/guides/${g.slug}`,
      title:        g.title,
      badge:        `${catLabelRu(g.category)} — гайд`,
      meta:         g.price ? localizeValue(g.price, "ru") : undefined,
      bgImage:      guideImage(g.category),
      cta:          "Читать гайд →",
      gradientFrom: isVisa ? GRAD_GUIDE_VISA : GRAD_GUIDE_BIZ,
    });
  }

  // 6. Remaining guides as final fallback
  for (const g of guides) {
    if (slides.length >= limit) break;
    if (GUIDE_PRIORITY_SLUGS.includes(g.slug)) continue;
    const isVisa = ["visas", "government", "living"].includes(g.category);
    slides.push({
      href:         `/ru/guides/${g.slug}`,
      title:        g.title,
      badge:        `${catLabelRu(g.category)} — гайд`,
      meta:         g.price ? localizeValue(g.price, "ru") : undefined,
      bgImage:      guideImage(g.category),
      cta:          "Читать гайд →",
      gradientFrom: isVisa ? GRAD_GUIDE_VISA : GRAD_GUIDE_BIZ,
    });
  }

  return slides.slice(0, limit);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatShortDate(iso: string): string {
  try {
    const parts = iso.split("-");
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const months = ["", "янв", "фев", "мар", "апр", "май", "июн",
                    "июл", "авг", "сен", "окт", "ноя", "дек"];
    return `${d} ${months[m] ?? ""}`;
  } catch {
    return iso;
  }
}

function calendarDotColor(type: CalendarDateItem["type"]): string {
  switch (type) {
    case "public-holiday": return "bg-emerald-500";
    case "deadline":       return "bg-red-500";
    case "important-date": return "bg-blue-500";
    default:               return "bg-slate-400";
  }
}

// ─── This Month data ──────────────────────────────────────────────────────────

type MonthItem = {
  date: string; shortDate: string; label: string; dotColor: string; href?: string;
};

function buildThisMonthItems(
  pages: CalendarPageSummary[],
  events: EventSummary[],
  limit = 4,
): MonthItem[] {
  const today     = new Date().toISOString().slice(0, 10);
  const lookahead = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const items: MonthItem[] = [];
  const seenKeys = new Set<string>();

  for (const page of pages) {
    for (const d of page.dates) {
      if (d.date < today || d.date > lookahead) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ext = d as any;
      const detailUrl = ext.detail_url as string | undefined;
      const key = detailUrl ?? `${d.date}:${d.label_en}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      const shortLabelRu = ext.short_label_ru as string | undefined;
      const label = shortLabelRu ?? (d.label_ru?.trim() || d.label_en);
      const href = detailUrl ? `/ru${detailUrl}` : undefined;
      items.push({ date: d.date, shortDate: formatShortDate(d.date), label, dotColor: calendarDotColor(d.type), href });
    }
  }
  for (const ev of events) {
    if (ev.eventDateStart >= today && ev.eventDateStart <= lookahead) {
      const evHref = `/ru/events/${ev.slug}`;
      const evKey = `/events/${ev.slug}`;
      if (seenKeys.has(evKey) || seenKeys.has(evHref)) continue;
      seenKeys.add(evHref);
      items.push({ date: ev.eventDateStart, shortDate: formatShortDate(ev.eventDateStart), label: ev.title, dotColor: "bg-blue-500", href: evHref });
    }
  }
  return items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, limit);
}

// ─── Latest feed ──────────────────────────────────────────────────────────────

type FeedItem = { href: string; label: string; category: string; title: string; meta: string; };

const NEWS_CAT_RU: Record<string, string> = {
  visa: "Визы", company: "Бизнес", tax: "Налоги",
  government: "Госуслуги", tourism: "Туризм", banking: "Банки",
};

const CAT_LABEL_RU: Record<string, string> = {
  visas:           "Визы",
  "company-setup": "Компания",
  government:      "Госуслуги",
  living:          "Жизнь в Дубае",
  hiring:          "Трудоустройство",
};

function buildFeed(news: NewsPostSummary[], events: EventSummary[], limit = 4): FeedItem[] {
  const withDate = [
    ...news.map(n => ({
      _date: n.datePublished,
      item: { href: `/ru/news/${n.slug}`, label: "Новость", category: NEWS_CAT_RU[n.category] ?? n.category, title: n.title, meta: formatShortDate(n.datePublished) } satisfies FeedItem,
    })),
    ...events.map(e => ({
      _date: e.eventDateStart,
      item: { href: `/ru/events/${e.slug}`, label: "Событие", category: "Дубай", title: e.title, meta: formatShortDate(e.eventDateStart) } satisfies FeedItem,
    })),
  ];
  return withDate.sort((a, b) => b._date.localeCompare(a._date)).map(({ item }) => item).slice(0, limit);
}

// ─── Service tiles ────────────────────────────────────────────────────────────

const TILES = [
  { label: "Визы",              href: "/ru/visas",         chip: "Резидентские визы ОАЭ",  serviceKey: "visas",         dot: "#1B2E4B" },
  { label: "Компания",          href: "/ru/company-setup", chip: "Mainland · Free zone",   serviceKey: "company-setup", dot: "#374151" },
  { label: "Госуслуги",         href: "/ru/government",    chip: "Документы · PRO",        serviceKey: "government",    dot: "#57534E" },
  { label: "Банки и налоги",    href: "/ru/banking-tax",   chip: "TRC · Банкинг",          serviceKey: "banking-tax",   dot: "#B5935A" },
  { label: "Календарь",         href: "/ru/calendar",      chip: "Даты · Праздники",       serviceKey: "calendar",      dot: "#059669" },
  { label: "Туризм и аренда",   href: "/ru/tourism",       chip: "DTCM · Краткосрочная",   serviceKey: "tourism",       dot: "#DC2626" },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RuHomePage() {
  const bandGuides    = getPublishedGuidesForBand(BAND_SLUGS, "ru");
  const recentGuides  = getRecentPublishedGuidesLocale(20, "ru");
  const latestGuides  = recentGuides.slice(0, 4);
  const news          = getPublishedNewsPosts("ru");
  const events        = getPublishedEvents("ru");
  const calPages      = getPublishedCalendarPages("ru");
  const monthItems    = buildThisMonthItems(calPages, events);
  const feedItems     = buildFeed(news, events);
  const carouselSlides = buildCarouselSlides(news, events, calPages, recentGuides, 7);

  const latestDisplayItems: FeedItem[] = feedItems.length > 0
    ? feedItems
    : latestGuides.map((g): FeedItem => ({
        href:     `/ru/guides/${g.slug}`,
        label:    "Гайд",
        category: CAT_LABEL_RU[g.category] ?? g.category,
        title:    g.title,
        meta:     localizeValue(g.price, "ru"),
      }));

  return (
    <div>

      {/* ── 1. Compact intro ─────────────────────────────────────────────────── */}
      <section className="px-5 pt-2 pb-1">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brass mb-1">
            Дубай · ОАЭ
          </p>
          <h1 className="text-[22px] font-bold text-gray-900 leading-tight">
            Визы, открытие компании и жизнь в Дубае.
          </h1>
        </div>
      </section>

      {/* ── 2. Primary product pair: Calendar + Life Setup ───────────────────── */}
      <section className="px-5 pb-1.5">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2.5">

          {/* Dubai Life Calendar */}
          <Link
            href="/ru/calendar"
            aria-labelledby="cal-card-heading-ru"
            className="relative block h-[162px] rounded-2xl overflow-hidden shadow-sm group"
          >
            <Image
              src={IMG_SKYLINE}
              alt="Дубай, вид на центр города на закате"
              fill
              priority
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 672px) 45vw, 310px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/97 via-navy/72 to-navy/20" />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/65 mb-0.5">
                Календарь
              </p>
              <h2
                id="cal-card-heading-ru"
                className="text-[19px] font-bold text-white leading-tight mb-1.5"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                Календарь ОАЭ
              </h2>
              <p className="text-[12px] text-white/80 leading-snug mb-3">
                Праздники, события и важные даты в Дубае и ОАЭ.
              </p>
              <span className="self-start text-[13px] font-semibold text-white bg-white/[.18] border border-white/[.25] px-2.5 py-0.5 rounded-lg">
                Открыть →
              </span>
            </div>
          </Link>

          {/* Dubai Life Setup */}
          <Link
            href="/ru/life-setup"
            aria-labelledby="setup-card-heading-ru"
            className="relative block h-[162px] rounded-2xl overflow-hidden shadow-sm group"
          >
            <Image
              src={IMG_JLT}
              alt="Башни JLT в Дубае на закате"
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 672px) 45vw, 310px"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(75,40,5,0.97) 0%, rgba(105,60,12,0.62) 50%, rgba(165,105,38,0.10) 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/65 mb-0.5">
                Переезд
              </p>
              <h2
                id="setup-card-heading-ru"
                className="text-[19px] font-bold text-white leading-tight mb-1.5"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                Переезд и первые шаги
              </h2>
              <p className="text-[12px] text-white/80 leading-snug mb-3">
                Первые 30 дней, дом и семья.
              </p>
              <span className="self-start text-[13px] font-semibold text-white bg-white/[.18] border border-white/[.25] px-2.5 py-0.5 rounded-lg">
                Открыть →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. Featured slider ───────────────────────────────────────────────── */}
      <FeaturedSlider slides={carouselSlides} locale="ru" />

      {/* ── 4. Выберите вашу задачу — service navigation ─────────────────────── */}
      <section aria-labelledby="services-heading-ru" className="px-5 pb-2.5">
        <div className="max-w-2xl mx-auto">
          <h2
            id="services-heading-ru"
            className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5"
          >
            Выберите вашу задачу
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {TILES.map((tile) => (
              <ServiceCardLink
                key={tile.label}
                href={tile.href}
                serviceKey={tile.serviceKey}
                locale="ru"
                className="block group bg-white border border-stone-200 rounded-2xl p-3 shadow-sm hover:shadow hover:border-stone-300 transition-all"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: tile.dot }} />
                    <span className="text-[15px] font-bold text-gray-900">{tile.label}</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-600 text-sm ml-1 flex-shrink-0 transition-colors">→</span>
                </div>
                <span className="text-[12px] text-gray-600 bg-stone-100 px-2 py-0.5 rounded-full">
                  {tile.chip}
                </span>
              </ServiceCardLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. В этом месяце в Дубае — calendar preview ──────────────────────── */}
      <section aria-labelledby="this-month-heading-ru" className="px-5 pb-2.5">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-4"
            style={{ background: "linear-gradient(140deg, #0A1628 0%, #132035 60%, #1B2E4B 100%)" }}
          >
            <h2
              id="this-month-heading-ru"
              className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2"
            >
              В этом месяце в Дубае
            </h2>

            {monthItems.length === 0 ? (
              <>
                <p className="text-[15px] font-medium text-white/80 leading-snug mb-1.5">
                  Важные даты, дедлайны и события Дубая будут здесь.
                </p>
                <p className="text-[12px] text-white/50 mb-3">
                  Обновления календаря готовятся.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {["Праздники ОАЭ", "Бизнес", "Госуслуги", "События Дубая"].map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium text-white/75 bg-white/[0.12] border border-white/[0.18] px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href="/ru/calendar"
                  className="text-[15px] font-semibold text-brass hover:opacity-80 transition-opacity"
                >
                  Открыть календарь →
                </Link>
              </>
            ) : (
              <>
                {monthItems.map((item, i) => (
                  <div
                    key={`${item.date}-${i}`}
                    className="flex items-center gap-2.5 py-2 border-b border-white/[0.06] last:border-0"
                  >
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                    <span className="text-[11px] font-semibold text-white/50 w-10 flex-shrink-0">
                      {item.shortDate}
                    </span>
                    <p className="flex-1 text-[14px] font-semibold text-white/85 leading-snug truncate">
                      {item.label}
                    </p>
                    {item.href && (
                      <Link href={item.href} className="flex-shrink-0 text-xs text-white/40 hover:text-white/70">
                        →
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-2.5">
                  <Link href="/ru/calendar" className="text-[14px] font-semibold text-brass hover:opacity-80">
                    Весь календарь →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. Latest guides ─────────────────────────────────────────────────── */}
      <section aria-labelledby="latest-heading-ru" className="pb-5">
        <div className="flex items-center justify-between px-5 mb-2.5 max-w-2xl mx-auto">
          <h2
            id="latest-heading-ru"
            className="text-[10px] font-semibold uppercase tracking-widest text-gray-400"
          >
            {feedItems.length > 0 ? "Последние обновления" : "Новые гайды"}
          </h2>
          {feedItems.length > 0 && (
            <Link href="/ru/news" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
              Все →
            </Link>
          )}
        </div>

        <div className="overflow-x-auto sm:overflow-visible">
          <div className="flex gap-3 px-5 pb-2 sm:grid sm:grid-cols-2 sm:max-w-2xl sm:mx-auto sm:px-5 sm:pb-0">
            {latestDisplayItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex-shrink-0 w-56 sm:w-auto flex flex-col border border-stone-200 rounded-2xl p-3.5 bg-white shadow-sm hover:shadow hover:border-stone-300 transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brass">
                    {item.label}
                  </span>
                  <span className="text-[9px] text-gray-200">·</span>
                  <span className="text-[9px] text-gray-500 bg-stone-100 px-1.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="flex-1 text-[13px] font-bold text-gray-900 leading-snug line-clamp-3 mb-2.5">
                  {item.title}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-gray-400">{item.meta}</span>
                  <span className="text-gray-300 group-hover:text-gray-600 text-sm transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Популярные маршруты ───────────────────────────────────────────── */}
      <RouteSnapshotBand guides={bandGuides} locale="ru" />

      {/* ── 8. WhatsApp CTA ──────────────────────────────────────────────────── */}
      <section className="px-5 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-navy rounded-2xl px-6 py-7">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-3">
              Бесплатная консультация
            </p>
            <h2 className="text-[20px] font-semibold text-white leading-snug mb-2">
              Не знаете, какой маршрут подходит?
            </h2>
            <p className="text-[14px] text-white/60 leading-relaxed mb-6">
              Опишите ситуацию в WhatsApp — подберём нужный процесс, стоимость и первый шаг. Отвечаем на русском.
            </p>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-[13px] font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ServiceCardLink } from "@/components/ServiceCardLink";
import FeaturedSlider from "@/components/FeaturedSlider";
import type { CarouselSlide } from "@/components/FeaturedSlider";
import FreeAdviceCta from "@/components/FreeAdviceCta";
import RouteSnapshotBand from "@/components/RouteSnapshotBand";
import { getPublishedGuidesForBand, getRecentPublishedGuides } from "@/lib/db/reader";
import type { GuideListItem } from "@/lib/db/reader";
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
import { localizeValue } from "@/lib/localize-value";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  alternates: {
    canonical: BASE,
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

// ─── Images ───────────────────────────────────────────────────────────────────

const IMG_SKYLINE = "/images/hubs/dubai-skyline-downtown.webp";
const IMG_DIFC    = "/images/hubs/difc-business-bay-glass-towers.webp";
const IMG_JLT     = "/images/hubs/jlt-dubai-towers-sunset-reflection.webp";

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

function catLabel(cat: string): string {
  const MAP: Record<string, string> = {
    visas:           "Visas",
    "company-setup": "Company Setup",
    government:      "Government",
    living:          "Dubai Life",
    hiring:          "Hiring",
    tourism:         "Tourism",
  };
  return MAP[cat] ?? cat.replace(/-/g, " ");
}

function formatShortDate(iso: string): string {
  try {
    const parts = iso.split("-");
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d} ${months[m] ?? ""}`;
  } catch {
    return iso;
  }
}

// Gradient bottom colors for visual variety per content type
const GRAD_CALENDAR    = "rgba(4,47,46,0.97)";   // deep teal-green
const GRAD_COMPLIANCE  = "rgba(55,28,0,0.97)";   // deep amber
const GRAD_EVENT       = "rgba(10,22,40,0.97)";   // navy (default)
const GRAD_NEWS        = "rgba(18,18,40,0.97)";   // indigo-navy
const GRAD_GUIDE_VISA  = "rgba(10,22,40,0.97)";   // navy
const GRAD_GUIDE_BIZ   = "rgba(20,15,5,0.97)";    // dark brown

function buildCarouselSlides(
  news: NewsPostSummary[],
  events: EventSummary[],
  calPages: CalendarPageSummary[],
  guides: GuideListItem[],
  limit = 7,
): CarouselSlide[] {
  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date();
  const curYear  = todayDate.getFullYear();
  const curMonth = todayDate.getMonth() + 1;
  // Events that ended more than 7 days ago are stale
  const eventCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  // News older than 90 days is stale
  const newsCutoff  = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const slides: CarouselSlide[] = [];

  // 1. Current and upcoming monthly calendar pages — most time-sensitive product
  const monthlyPages = calPages
    .filter((cp) => {
      if (!cp.year || !cp.month) return false;
      // Include current month, next 3 months, and 1 previous month (for transition)
      if (cp.year > curYear) return true;
      if (cp.year === curYear && cp.month >= curMonth - 1 && cp.month <= curMonth + 3) return true;
      return false;
    })
    .sort((a, b) => {
      const aDiff = Math.abs((a.year! - curYear) * 12 + ((a.month ?? 0) - curMonth));
      const bDiff = Math.abs((b.year! - curYear) * 12 + ((b.month ?? 0) - curMonth));
      return aDiff - bDiff; // closest month first
    });

  // 2. Topic calendar pages (compliance, deadlines — no month)
  const topicPages = calPages.filter((cp) => !cp.month || !cp.year);

  for (const cp of monthlyPages) {
    slides.push({
      href:         `/calendar/${cp.slug}`,
      title:        cp.title,
      badge:        "Dubai Calendar",
      bgImage:      IMG_SKYLINE,
      cta:          "Open calendar →",
      gradientFrom: GRAD_CALENDAR,
    });
  }

  // 3. Current/upcoming events (not ended more than 7 days ago)
  for (const ev of events) {
    if (ev.eventDateEnd && ev.eventDateEnd < eventCutoff) continue;
    if (!ev.eventDateEnd && ev.eventDateStart < eventCutoff) continue;
    slides.push({
      href:         `/events/${ev.slug}`,
      title:        ev.title,
      badge:        "Event",
      meta:         formatShortDate(ev.eventDateStart),
      bgImage:      IMG_JLT,
      cta:          "View event →",
      gradientFrom: GRAD_EVENT,
    });
  }

  // 4. Recent news (within 90 days)
  for (const n of news) {
    if (n.datePublished < newsCutoff) continue;
    slides.push({
      href:         `/news/${n.slug}`,
      title:        n.title,
      badge:        "News",
      meta:         formatShortDate(n.datePublished),
      bgImage:      IMG_DIFC,
      cta:          "Read article →",
      gradientFrom: GRAD_NEWS,
    });
  }

  // 5. Topic calendar pages (compliance/deadline pages — always relevant)
  for (const cp of topicPages) {
    slides.push({
      href:         `/calendar/${cp.slug}`,
      title:        cp.title,
      badge:        "UAE Deadline",
      bgImage:      IMG_DIFC,
      cta:          "See deadline →",
      gradientFrom: GRAD_COMPLIANCE,
    });
  }

  // 6. Priority guides as filler
  const guidesMap = new Map(guides.map((g) => [g.slug, g]));
  for (const slug of GUIDE_PRIORITY_SLUGS) {
    if (slides.length >= limit) break;
    const g = guidesMap.get(slug);
    if (!g) continue;
    const isVisa = ["visas", "government", "living"].includes(g.category);
    slides.push({
      href:         `/guides/${g.slug}`,
      title:        g.title,
      badge:        `${catLabel(g.category)} guide`,
      meta:         g.price ? localizeValue(g.price, "en") : undefined,
      bgImage:      guideImage(g.category),
      cta:          "Read guide →",
      gradientFrom: isVisa ? GRAD_GUIDE_VISA : GRAD_GUIDE_BIZ,
    });
  }

  // 7. Remaining guides as final fallback
  for (const g of guides) {
    if (slides.length >= limit) break;
    if (GUIDE_PRIORITY_SLUGS.includes(g.slug)) continue;
    const isVisa = ["visas", "government", "living"].includes(g.category);
    slides.push({
      href:         `/guides/${g.slug}`,
      title:        g.title,
      badge:        `${catLabel(g.category)} guide`,
      meta:         g.price ? localizeValue(g.price, "en") : undefined,
      bgImage:      guideImage(g.category),
      cta:          "Read guide →",
      gradientFrom: isVisa ? GRAD_GUIDE_VISA : GRAD_GUIDE_BIZ,
    });
  }

  // Suppress unused variable warning: today is used in scope for futureproofing
  void today;

  return slides.slice(0, limit);
}

// ─── This Month data ──────────────────────────────────────────────────────────

type MonthItem = {
  date: string; shortDate: string; label: string; dotColor: string; href?: string;
};

function calendarDotColor(type: CalendarDateItem["type"]): string {
  switch (type) {
    case "public-holiday": return "bg-emerald-500";
    case "deadline":       return "bg-red-500";
    case "important-date": return "bg-blue-500";
    default:               return "bg-slate-400";
  }
}

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
      // Deduplicate: group items sharing the same detail_url under one entry
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ext = d as any;
      const detailUrl = ext.detail_url as string | undefined;
      const key = detailUrl ?? `${d.date}:${d.label_en}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      const shortLabel = ext.short_label_en as string | undefined;
      items.push({
        date:      d.date,
        shortDate: formatShortDate(d.date),
        label:     shortLabel ?? d.label_en,
        dotColor:  calendarDotColor(d.type),
        href:      detailUrl ?? undefined,
      });
    }
  }

  for (const ev of events) {
    if (ev.eventDateStart >= today && ev.eventDateStart <= lookahead) {
      const evHref = `/events/${ev.slug}`;
      if (seenKeys.has(evHref)) continue;
      seenKeys.add(evHref);
      items.push({
        date:      ev.eventDateStart,
        shortDate: formatShortDate(ev.eventDateStart),
        label:     ev.title,
        dotColor:  "bg-blue-500",
        href:      evHref,
      });
    }
  }

  return items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, limit);
}

// ─── Latest feed ──────────────────────────────────────────────────────────────

type FeedItem = { href: string; label: string; category: string; title: string; meta: string; };

const NEWS_CAT: Record<string, string> = {
  visa: "Visas", company: "Business", tax: "Tax",
  government: "Government", tourism: "Tourism", banking: "Banking",
};

function buildFeed(news: NewsPostSummary[], events: EventSummary[], limit = 4): FeedItem[] {
  const withDate = [
    ...news.map(n => ({
      _date: n.datePublished,
      item: { href: `/news/${n.slug}`, label: "News", category: NEWS_CAT[n.category] ?? n.category, title: n.title, meta: formatShortDate(n.datePublished) } satisfies FeedItem,
    })),
    ...events.map(e => ({
      _date: e.eventDateStart,
      item: { href: `/events/${e.slug}`, label: "Event", category: "Dubai Event", title: e.title, meta: formatShortDate(e.eventDateStart) } satisfies FeedItem,
    })),
  ];
  return withDate.sort((a, b) => b._date.localeCompare(a._date)).map(({ item }) => item).slice(0, limit);
}

// ─── Service tiles ────────────────────────────────────────────────────────────

const TILES = [
  { label: "Visas",             href: "/visas",         chip: "UAE residence visas",  serviceKey: "visas",         dot: "#1B2E4B" },
  { label: "Company Setup",     href: "/company-setup", chip: "Mainland · Free zone", serviceKey: "company-setup", dot: "#374151" },
  { label: "Government",        href: "/government",    chip: "Documents · PRO",      serviceKey: "government",    dot: "#57534E" },
  { label: "Banking & Tax",     href: "/banking-tax",   chip: "TRC · Banking",        serviceKey: "banking-tax",   dot: "#B5935A" },
  { label: "Dubai Calendar",    href: "/calendar",      chip: "Dates · Holidays",     serviceKey: "calendar",      dot: "#059669" },
  { label: "Tourism & Rentals", href: "/tourism",       chip: "DTCM · Short-term",    serviceKey: "tourism",       dot: "#DC2626" },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const recentGuides  = getRecentPublishedGuides(20);
  const latestGuides  = recentGuides.slice(0, 4);
  const news          = getPublishedNewsPosts("en");
  const events        = getPublishedEvents("en");
  const calPages      = getPublishedCalendarPages("en");
  const bandGuides    = getPublishedGuidesForBand(BAND_SLUGS);
  const monthItems    = buildThisMonthItems(calPages, events);
  const feedItems     = buildFeed(news, events);

  const carouselSlides = buildCarouselSlides(news, events, calPages, recentGuides, 7);

  const latestDisplayItems: FeedItem[] = feedItems.length > 0
    ? feedItems
    : latestGuides.map((g): FeedItem => ({
        href:     `/guides/${g.slug}`,
        label:    "Guide",
        category: catLabel(g.category),
        title:    g.title,
        meta:     g.price,
      }));

  return (
    <div>

      {/* ── 1. Compact intro ─────────────────────────────────────────────────── */}
      <section className="px-5 pt-2 pb-1">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brass mb-1">
            Dubai · UAE
          </p>
          <h1 className="text-[22px] font-bold text-gray-900 leading-tight">
            Dubai visas, company setup and life planning.
          </h1>
        </div>
      </section>

      {/* ── 2. Primary product pair: Calendar + Life Setup ───────────────────── */}
      <section className="px-5 pb-1.5">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2.5">

          {/* Dubai Life Calendar */}
          <Link
            href="/calendar"
            aria-labelledby="cal-card-heading"
            className="relative block h-[162px] rounded-2xl overflow-hidden shadow-sm group"
          >
            <Image
              src={IMG_SKYLINE}
              alt="Dubai skyline at dusk"
              fill
              priority
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 672px) 45vw, 310px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/97 via-navy/72 to-navy/20" />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/65 mb-0.5">
                Calendar
              </p>
              <h2
                id="cal-card-heading"
                className="text-[19px] font-bold text-white leading-tight mb-1.5"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                Dubai Life Calendar
              </h2>
              <p className="text-[12px] text-white/80 leading-snug mb-3">
                Holidays, events and reminders.
              </p>
              <span className="self-start text-[13px] font-semibold text-white bg-white/[.18] border border-white/[.25] px-2.5 py-0.5 rounded-lg">
                Open →
              </span>
            </div>
          </Link>

          {/* Dubai Life Setup */}
          <Link
            href="/life-setup"
            aria-labelledby="setup-card-heading"
            className="relative block h-[162px] rounded-2xl overflow-hidden shadow-sm group"
          >
            <Image
              src={IMG_JLT}
              alt="Dubai JLT towers at sunset"
              fill
              className="object-cover"
              sizes="(max-width: 672px) 45vw, 310px"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(75,40,5,0.97) 0%, rgba(105,60,12,0.62) 50%, rgba(165,105,38,0.10) 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/65 mb-0.5">
                Life Setup
              </p>
              <h2
                id="setup-card-heading"
                className="text-[19px] font-bold text-white leading-tight mb-1.5"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                Dubai Life Setup
              </h2>
              <p className="text-[12px] text-white/80 leading-snug mb-3">
                First 30 days, home and family.
              </p>
              <span className="self-start text-[13px] font-semibold text-white bg-white/[.18] border border-white/[.25] px-2.5 py-0.5 rounded-lg">
                Explore →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. Featured slider — priority carousel ────────────────────────────── */}
      <FeaturedSlider slides={carouselSlides} locale="en" />

      {/* ── 4. Start with your need — service navigation ─────────────────────── */}
      <section aria-labelledby="services-heading" className="px-5 pb-2.5">
        <div className="max-w-2xl mx-auto">
          <h2
            id="services-heading"
            className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5"
          >
            Start with your need
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {TILES.map((tile) => (
              <ServiceCardLink
                key={tile.label}
                href={tile.href}
                serviceKey={tile.serviceKey}
                locale="en"
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

      {/* ── 5. This Month in Dubai — calendar preview ────────────────────────── */}
      <section aria-labelledby="this-month-heading" className="px-5 pb-2.5">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-4"
            style={{ background: "linear-gradient(140deg, #0A1628 0%, #132035 60%, #1B2E4B 100%)" }}
          >
            <h2
              id="this-month-heading"
              className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2"
            >
              This Month in Dubai
            </h2>

            {monthItems.length === 0 ? (
              <>
                <p className="text-[15px] font-medium text-white/80 leading-snug mb-1.5">
                  Key UAE dates, deadlines and Dubai events will appear here.
                </p>
                <p className="text-[12px] text-white/50 mb-3">
                  Calendar updates are being prepared.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {["UAE Holidays", "Business", "Government", "Dubai Events"].map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium text-white/75 bg-white/[0.12] border border-white/[0.18] px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href="/calendar"
                  className="text-[15px] font-semibold text-brass hover:opacity-80 transition-opacity"
                >
                  Open Dubai Calendar →
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
                      <Link
                        href={item.href}
                        className="flex-shrink-0 text-xs text-white/40 hover:text-white/70 transition-colors"
                      >
                        →
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-2.5">
                  <Link href="/calendar" className="text-[14px] font-semibold text-brass hover:opacity-80">
                    Full Dubai calendar →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. Latest updates ────────────────────────────────────────────────── */}
      <section aria-labelledby="latest-heading" className="pb-5">
        <div className="flex items-center justify-between px-5 mb-2.5 max-w-2xl mx-auto">
          <h2
            id="latest-heading"
            className="text-[10px] font-semibold uppercase tracking-widest text-gray-400"
          >
            {feedItems.length > 0 ? "Latest updates" : "Latest guides"}
          </h2>
          {feedItems.length > 0 && (
            <Link href="/news" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors">
              View all →
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

      {/* ── 7. Popular visa routes ───────────────────────────────────────────── */}
      <RouteSnapshotBand guides={bandGuides} />

      {/* ── 8. WhatsApp CTA ──────────────────────────────────────────────────── */}
      <FreeAdviceCta />

    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@/lib/db/news-events-calendar";
import { eventRobots } from "@/lib/db/indexing";
import CalendarMiniPreview from "@/components/calendar/CalendarMiniPreview";
import MarkdownBody from "@/components/MarkdownBody";
import DetailHero, { categoryImage } from "@/components/detail/DetailHero";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_HREF = "https://wa.me/971506304817";

// Per-slug venue and organizer data for JSON-LD enrichment
const VENUE_BY_SLUG: Record<string, { name: string; streetAddress: string; city: string }> = {
  "formula-1-abu-dhabi-grand-prix-2026": {
    name:          "Yas Marina Circuit",
    streetAddress: "Yas Island",
    city:          "Abu Dhabi",
  },
  "gitex-global-2026": {
    name:          "Dubai Exhibition Centre at Expo City Dubai",
    streetAddress: "Expo City Dubai",
    city:          "Dubai",
  },
  "dp-world-tour-championship-2026": {
    name:          "Jumeirah Golf Estates (Earth Course)",
    streetAddress: "Jumeirah Golf Estates",
    city:          "Dubai",
  },
  "expand-north-star-2026": {
    name:          "Dubai Exhibition Centre",
    streetAddress: "Expo City Dubai",
    city:          "Dubai",
  },
};

const ORGANIZER_BY_SLUG: Record<string, { name: string; url: string }> = {
  "formula-1-abu-dhabi-grand-prix-2026": {
    name: "Abu Dhabi Motorsport Management",
    url:  "https://www.abudhabigp.com/",
  },
  "gitex-global-2026": {
    name: "Dubai World Trade Centre",
    url:  "https://www.gitex.com/",
  },
  "dp-world-tour-championship-2026": {
    name: "DP World Tour",
    url:  "https://www.europeantour.com/dpworld-tour/",
  },
  "expand-north-star-2026": {
    name: "DWTC / Dubai Chamber of Digital Economy",
    url:  "https://www.expandnorthstar.com/",
  },
};

function sourceDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return "Official source"; }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug, "en");
  if (!event) return {};
  return {
    title: `${event.seoTitle || event.title} — Guidex Consulting`,
    description: event.metaDescription || event.summary,
    robots: eventRobots(event),
    alternates: {
      canonical: `${BASE}/events/${slug}`,
      languages: {
        en: `${BASE}/events/${slug}`,
        ...(event.ruPublished ? { ru: `${BASE}/ru/events/${slug}` } : {}),
        "x-default": `${BASE}/events/${slug}`,
      },
    },
  };
}

const CONFIDENCE_NOTICES: Partial<Record<string, string>> = {
  expected:
    "The date shown is an estimate based on prior years. An official announcement has not yet been made.",
  subject_to_official_confirmation:
    "This date is subject to official moon-sighting confirmation by UAE authorities. Treat the date shown as provisional until officially announced.",
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug, "en");
  if (!event) notFound();

  const categoryLabel =
    event.category.charAt(0).toUpperCase() +
    event.category.slice(1).replace(/-/g, " ");
  const isSingleDay =
    !event.eventDateEnd || event.eventDateStart === event.eventDateEnd;
  const dateDisplay = isSingleDay
    ? event.eventDateStart
    : `${event.eventDateStart} – ${event.eventDateEnd}`;
  const confidenceNotice = CONFIDENCE_NOTICES[event.dateConfidence];

  const calendarMonth = /^\d{4}-\d{2}/.test(event.eventDateStart)
    ? event.eventDateStart.slice(0, 7)
    : undefined;

  const heroImage = categoryImage(event.category);
  const eyebrow   = `${categoryLabel} · ${dateDisplay}`;

  const venue    = VENUE_BY_SLUG[slug];
  const organizer = ORGANIZER_BY_SLUG[slug];

  const eventSchema = event.schemaEligible
    ? {
        "@context": "https://schema.org",
        "@type":    "Event",
        name:        event.seoTitle || event.title,
        description: event.metaDescription || event.summary,
        image:       `${BASE}${heroImage}`,
        startDate:   event.eventDateStart,
        ...(event.eventDateEnd && event.eventDateEnd !== event.eventDateStart
          ? { endDate: event.eventDateEnd }
          : {}),
        eventStatus:          "https://schema.org/EventScheduled",
        eventAttendanceMode:  "https://schema.org/OfflineEventAttendanceMode",
        url:                  `${BASE}/events/${event.slug}`,
        ...(venue ? {
          location: {
            "@type": "Place",
            name:    venue.name,
            address: {
              "@type":          "PostalAddress",
              streetAddress:    venue.streetAddress,
              addressLocality:  venue.city,
              addressCountry:   "AE",
            },
          },
        } : {}),
        ...(organizer ? {
          organizer: {
            "@type": "Organization",
            name:    organizer.name,
            url:     organizer.url,
          },
        } : {}),
      }
    : null;

  return (
    <div className="max-w-2xl mx-auto px-5 pt-4 pb-10">

      {eventSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      )}

      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3 py-1.5"
      >
        ← Events
      </Link>

      <DetailHero eyebrow={eyebrow} title={event.title} image={heroImage} imageAlt={event.title} />

      <p className="text-[15px] text-gray-600 leading-[1.6] mb-4">
        {event.summary}
      </p>

      {event.sourceUrl && (
        <div className="flex items-center gap-2 mb-5 pl-3 border-l-2 border-stone-200">
          <span className="text-[11px] font-medium text-gray-400">Source:</span>
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-brass hover:opacity-75 transition-opacity"
          >
            {sourceDomain(event.sourceUrl)} ↗
          </a>
        </div>
      )}

      {confidenceNotice && (
        <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-[12px] text-amber-800 leading-snug">
            {confidenceNotice}
          </p>
        </div>
      )}

      <CalendarMiniPreview
        locale="en"
        calendarBase="/calendar"
        calendarMonth={calendarMonth}
        range={{ start: event.eventDateStart, end: event.eventDateEnd ?? undefined }}
        detailSlug={event.calendarDetailSlug}
      />

      {event.body && (
        <MarkdownBody content={event.body} className="mb-6" />
      )}

      {event.relatedGuideSlug && (
        <div className="border border-stone-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Related guide
          </p>
          <Link
            href={`/guides/${event.relatedGuideSlug}`}
            className="flex items-center justify-between group"
          >
            <span className="text-[13px] font-medium text-gray-800 group-hover:text-navy transition-colors">
              {event.relatedGuideTitle || event.relatedGuideSlug.replace(/-/g, " ")}
            </span>
            <span className="text-gray-400 group-hover:text-navy transition-colors text-sm">→</span>
          </Link>
        </div>
      )}

      <div className="bg-navy rounded-2xl px-5 py-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Planning around this date?
        </p>
        <p className="text-[12px] text-white/60 mb-3">
          We help with visa renewals, permit timing, and compliance deadlines around UAE holidays and events.
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

import { MetadataRoute } from "next";
import { getAllPublishedGuides, getRuPublishedGuidesSlugs } from "@/lib/db/reader";
import {
  getPublishedCalendarPages,
  getPublishedEvents,
  getPublishedNewsPosts,
} from "@/lib/db/news-events-calendar";

// Variant slugs are redirected to group hub pages — exclude from sitemap.
const REDIRECT_SLUGS = new Set([
  "spouse-dependent-visa-dubai-outside-country",
  "spouse-dependent-visa-dubai-inside-country",
  "child-dependent-visa-dubai-outside-country",
  "child-dependent-visa-dubai-inside-country",
]);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const EN_STATIC: Array<{ path: string; priority: number }> = [
  { path: "",                                    priority: 1.0 },
  { path: "/guides",                             priority: 0.9 },
  { path: "/guides/spouse-dependent-visa-dubai", priority: 0.8 },
  { path: "/guides/child-dependent-visa-dubai",  priority: 0.8 },
  { path: "/life-setup",                         priority: 0.8 },
  { path: "/visas",                              priority: 0.7 },
  { path: "/visas/family",                       priority: 0.7 },
  { path: "/visas/golden",                       priority: 0.7 },
  { path: "/company-setup",                      priority: 0.7 },
  { path: "/government",                         priority: 0.7 },
  { path: "/banking-tax",                        priority: 0.7 },
  { path: "/tourism",                            priority: 0.7 },
  { path: "/find-my-visa",                       priority: 0.6 },
  { path: "/about",                              priority: 0.4 },
  { path: "/contact",                            priority: 0.4 },
];

const RU_STATIC: Array<{ path: string; priority: number }> = [
  { path: "/ru",                                 priority: 0.9 },
  { path: "/ru/guides",                          priority: 0.8 },
  { path: "/ru/guides/spouse-dependent-visa-dubai", priority: 0.7 },
  { path: "/ru/guides/child-dependent-visa-dubai",  priority: 0.7 },
  { path: "/ru/life-setup",                      priority: 0.8 },
  { path: "/ru/visas",                           priority: 0.7 },
  { path: "/ru/visas/family",                    priority: 0.7 },
  { path: "/ru/visas/golden",                    priority: 0.7 },
  { path: "/ru/company-setup",                   priority: 0.7 },
  { path: "/ru/banking-tax",                     priority: 0.7 },
  { path: "/ru/tourism",                         priority: 0.7 },
  { path: "/ru/find-my-visa",                    priority: 0.6 },
  { path: "/ru/contact",                         priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const enSlugs = getAllPublishedGuides()
    .map((g) => g.slug)
    .filter((s) => !REDIRECT_SLUGS.has(s));

  const ruSlugs = getRuPublishedGuidesSlugs()
    .filter((s) => !REDIRECT_SLUGS.has(s));

  const enCalendarSlugs = getPublishedCalendarPages("en").map((p) => p.slug);
  const ruCalendarSlugs = getPublishedCalendarPages("ru").map((p) => p.slug);

  // Events: status=published. getPublishedEvents("ru") gates on ru_published=1 + non-empty ru_title.
  const enEventSlugs = getPublishedEvents("en").map((e) => e.slug);
  const ruEventSlugs = getPublishedEvents("ru").map((e) => e.slug);

  // News: status=published. getPublishedNewsPosts does not expose the noindex field in NewsPostSummary.
  // All currently published news have noindex=0, so including all is correct.
  // If a future post needs noindex=1 but stays published, it would also need to be excluded here.
  const enNewsSlugs = getPublishedNewsPosts("en").map((p) => p.slug);
  const ruNewsSlugs = getPublishedNewsPosts("ru").map((p) => p.slug);

  const enGuideEntries = enSlugs.map((slug) => ({
    url:             `${BASE_URL}/guides/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  const ruGuideEntries = ruSlugs.map((slug) => ({
    url:             `${BASE_URL}/ru/guides/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  const enCalendarEntries = enCalendarSlugs.map((slug) => ({
    url:             `${BASE_URL}/calendar/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  const ruCalendarEntries = ruCalendarSlugs.map((slug) => ({
    url:             `${BASE_URL}/ru/calendar/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  const enEventEntries = enEventSlugs.map((slug) => ({
    url:             `${BASE_URL}/events/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  const ruEventEntries = ruEventSlugs.map((slug) => ({
    url:             `${BASE_URL}/ru/events/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  const enNewsEntries = enNewsSlugs.map((slug) => ({
    url:             `${BASE_URL}/news/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  const ruNewsEntries = ruNewsSlugs.map((slug) => ({
    url:             `${BASE_URL}/ru/news/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.5,
  }));

  const enStaticEntries = EN_STATIC.map(({ path, priority }) => ({
    url:             `${BASE_URL}${path}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const ruStaticEntries = RU_STATIC.map(({ path, priority }) => ({
    url:             `${BASE_URL}${path}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  return [
    ...enStaticEntries,
    ...enGuideEntries,
    ...enCalendarEntries,
    ...enEventEntries,
    ...enNewsEntries,
    ...ruStaticEntries,
    ...ruGuideEntries,
    ...ruCalendarEntries,
    ...ruEventEntries,
    ...ruNewsEntries,
  ];
}

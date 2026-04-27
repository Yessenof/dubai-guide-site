import { MetadataRoute } from "next";
import { getAllPublishedGuides } from "@/lib/db/reader";

// These slugs have DB entries but are redirected to group hub pages.
// Their canonical URLs are the group pages — exclude from sitemap.
const REDIRECT_SLUGS = new Set([
  "spouse-dependent-visa-dubai-outside-country",
  "spouse-dependent-visa-dubai-inside-country",
  "child-dependent-visa-dubai-outside-country",
  "child-dependent-visa-dubai-inside-country",
]);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PAGES: Array<{ path: string; priority: number }> = [
  { path: "",                                    priority: 1.0 },
  { path: "/guides",                             priority: 0.9 },
  { path: "/guides/spouse-dependent-visa-dubai", priority: 0.8 },
  { path: "/guides/child-dependent-visa-dubai",  priority: 0.8 },
  { path: "/visas",                              priority: 0.7 },
  { path: "/visas/family",                       priority: 0.7 },
  { path: "/visas/golden",                       priority: 0.7 },
  { path: "/company-setup",                      priority: 0.7 },
  { path: "/government",                         priority: 0.7 },
  { path: "/find-my-visa",                       priority: 0.6 },
  { path: "/about",                              priority: 0.4 },
  { path: "/contact",                            priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const guideEntries = getAllPublishedGuides()
    .filter((g) => !REDIRECT_SLUGS.has(g.slug))
    .map((g) => ({
      url:             `${BASE_URL}/guides/${g.slug}`,
      lastModified:    new Date(),
      changeFrequency: "monthly" as const,
      priority:        0.8,
    }));

  const staticEntries = STATIC_PAGES.map(({ path, priority }) => ({
    url:             `${BASE_URL}${path}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  return [...staticEntries, ...guideEntries];
}

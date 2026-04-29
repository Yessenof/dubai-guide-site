export type Locale = "en" | "ru";

/**
 * Returns the guide detail path for the given slug and locale.
 * For group hub pages (spouse/child visa) pass the group slug, not a variant slug.
 */
export function getGuidePath(slug: string, locale: Locale): string {
  const prefix = locale === "ru" ? "/ru/guides" : "/guides";
  return `${prefix}/${slug}`;
}

/**
 * Prefixes a root-relative path with /ru when locale is "ru".
 * Use for non-guide paths like /visas, /company-setup, /contact.
 */
export function getLocalePath(path: string, locale: Locale): string {
  if (locale !== "ru") return path;
  return "/ru" + path;
}

/**
 * Detects locale from a Next.js pathname string.
 */
export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  return "en";
}

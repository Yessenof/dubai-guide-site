import type { CalendarDateItemExtended } from "./calendar-mock-data";

// ─── Category type resolution ─────────────────────────────────────────────────

export function itemCategoryType(item: CalendarDateItemExtended): string {
  if (item.category_type) return item.category_type;
  // Handle runtime type values that may come from DB outside the TypeScript union
  const t = item.type as string;
  if (t === "compliance_deadline") return "government_deadline";
  switch (item.type) {
    case "public-holiday": return "holiday";
    case "deadline":       return "tax_deadline";
    case "important-date": return "event";
    default:               return "news_update";
  }
}

// ─── Priority ────────────────────────────────────────────────────────────────

const P1_CATS = new Set(["holiday", "government_deadline", "tax_deadline", "aml_deadline"]);
const P2_CATS = new Set(["event", "real_estate_event", "business_event", "family_school", "calendar_visual_post"]);

export function itemPriority(item: CalendarDateItemExtended): 1 | 2 | 3 {
  if (item.priority) return item.priority;
  const cat = itemCategoryType(item);
  if (P1_CATS.has(cat)) return 1;
  if (P2_CATS.has(cat)) return 2;
  return 3;
}

// ─── Color ────────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  holiday:              "#22C55E",
  government_deadline:  "#F59E0B",
  tax_deadline:         "#EF4444",
  aml_deadline:         "#EF4444",
  event:                "#3B82F6",
  real_estate_event:    "#1B2E4B",
  business_event:       "#1B2E4B",
  family_school:        "#A855F7",
  relocation:           "#0D9488",
  news_update:          "#6B7280",
  guide_update:         "#B5935A",
  calendar_visual_post: "#3B82F6",
};

export function itemColor(item: CalendarDateItemExtended): string {
  return COLOR_MAP[itemCategoryType(item)] ?? "#6B7280";
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const BADGE_EN: Record<string, string> = {
  holiday:              "Holiday",
  government_deadline:  "Deadline",
  tax_deadline:         "Tax",
  aml_deadline:         "AML",
  event:                "Event",
  real_estate_event:    "Property",
  business_event:       "Business",
  family_school:        "School",
  relocation:           "Relocation",
  news_update:          "News",
  guide_update:         "Guide",
  calendar_visual_post: "Calendar",
};
const BADGE_RU: Record<string, string> = {
  holiday:              "Праздник",
  government_deadline:  "Срок",
  tax_deadline:         "Налог",
  aml_deadline:         "AML",
  event:                "Событие",
  real_estate_event:    "Недвижимость",
  business_event:       "Бизнес",
  family_school:        "Школа",
  relocation:           "Переезд",
  news_update:          "Новость",
  guide_update:         "Гайд",
  calendar_visual_post: "Календарь",
};

export function itemBadgeLabel(item: CalendarDateItemExtended, locale: "en" | "ru"): string {
  const cat = itemCategoryType(item);
  return (locale === "ru" ? BADGE_RU[cat] : BADGE_EN[cat]) ?? cat;
}

export function itemShortLabel(item: CalendarDateItemExtended, locale: "en" | "ru"): string {
  if (locale === "ru" && item.short_label_ru) return item.short_label_ru;
  if (locale === "en" && item.short_label_en) return item.short_label_en;
  const label = locale === "ru" ? item.label_ru : item.label_en;
  return label.length > 12 ? label.slice(0, 11) + "…" : label;
}

export function itemLabel(item: CalendarDateItemExtended, locale: "en" | "ru"): string {
  return locale === "ru" ? item.label_ru : item.label_en;
}

// ─── CTA labels ───────────────────────────────────────────────────────────────

const CTA_EN: Record<string, string> = {
  holiday:              "See holiday →",
  government_deadline:  "Deadline details →",
  tax_deadline:         "Tax deadline →",
  aml_deadline:         "AML deadline →",
  event:                "Event details →",
  real_estate_event:    "Event details →",
  business_event:       "Event details →",
  family_school:        "See details →",
  relocation:           "Read guide →",
  news_update:          "Read update →",
  guide_update:         "Read guide →",
  calendar_visual_post: "Open calendar →",
};
const CTA_RU: Record<string, string> = {
  holiday:              "К праздничным датам →",
  government_deadline:  "К дедлайну →",
  tax_deadline:         "К налоговому сроку →",
  aml_deadline:         "Подробнее →",
  event:                "К событию →",
  real_estate_event:    "К событию →",
  business_event:       "К событию →",
  family_school:        "Подробнее →",
  relocation:           "Читать →",
  news_update:          "Читать →",
  guide_update:         "Читать гайд →",
  calendar_visual_post: "Открыть календарь →",
};

export function itemCtaLabel(item: CalendarDateItemExtended, locale: "en" | "ru"): string {
  // Custom CTA overrides type-based default
  if (locale === "ru" && item.custom_cta_ru) return item.custom_cta_ru;
  if (locale === "en" && item.custom_cta_en) return item.custom_cta_en;
  const cat = itemCategoryType(item);
  return (locale === "ru" ? CTA_RU[cat] : CTA_EN[cat]) ?? (locale === "ru" ? "Подробнее →" : "Details →");
}

// ─── Filter matching ──────────────────────────────────────────────────────────

export function filterMatchesCat(filter: string, cat: string): boolean {
  switch (filter) {
    case "all":      return true;
    case "holidays": return cat === "holiday";
    case "events":   return cat === "event" || cat === "news_update" || cat === "guide_update" || cat === "calendar_visual_post" || cat === "relocation" || cat === "family_school";
    case "business": return cat === "business_event" || cat === "government_deadline" || cat === "tax_deadline" || cat === "aml_deadline";
    case "property": return cat === "real_estate_event";
    default:         return true;
  }
}

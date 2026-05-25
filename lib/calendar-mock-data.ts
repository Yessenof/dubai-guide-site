// PROTOTYPE MOCK DATA — Phase 5E-a visual prototype
// These items are DEMO data for UI testing only.
// Not official UAE government information. Not confirmed real dates.
// Do not use for planning or legal/compliance purposes.
// Connection to real DB data: Phase 5E-b.

export interface CalendarDateItemExtended {
  date:            string;   // ISO 8601 "2026-06-09"
  label_en:        string;
  label_ru:        string;
  type:            "public-holiday" | "important-date" | "deadline" | "other";
  confidence:      "confirmed" | "expected" | "subject_to_official_confirmation";
  source?:         string;
  // Extended optional fields — backward compatible with existing CalendarDateItem
  detail_url?:     string;
  priority?:       1 | 2 | 3;
  category_type?:  string;   // see lib/calendar-helpers.ts for valid values
  short_label_en?: string;
  short_label_ru?: string;
  period_end?:     string;   // ISO date for multi-day events/holidays
  // External link support — when true, detail_url is an external URL
  is_external?:    boolean;
  custom_cta_en?:  string;   // overrides default CTA label (EN)
  custom_cta_ru?:  string;   // overrides default CTA label (RU)
  // Optional indexed brief fields — mirrors CalendarDateItem brief extension
  brief_en?:        string;
  brief_ru?:        string;
  who_for_en?:      string;
  who_for_ru?:      string;
  what_to_do_en?:   string;
  what_to_do_ru?:   string;
  source_label_en?: string;
  source_label_ru?: string;
  source_url?:      string;
  source_status?:   "confirmed" | "expected" | "monitoring";
  cta_type?:        "view_details" | "read_guide" | "open_event" | "open_source" | "add_calendar" | "ask_guidex";
  cta_url?:         string;
  cta_label_en?:    string;
  cta_label_ru?:    string;
  location_en?:     string;
  location_ru?:     string;
  risk_level?:      "low" | "medium" | "high";
  lifecycle?:       string;
  noindex_after?:   string;
  archive_action?:  string;
}

// ─── Prototype items — May, June, October, December 2026 ─────────────────────
// Islamic holiday dates are approximate. All dates are demo-only.
export const MOCK_CALENDAR_ITEMS: CalendarDateItemExtended[] = [

  // ── May 2026 ────────────────────────────────────────────────────────────────

  {
    date:           "2026-05-15",
    label_en:       "School Admissions Window: Dubai Private Schools",
    label_ru:       "Период записи в частные школы Дубая",
    short_label_en: "Schools",
    short_label_ru: "Школы",
    type:           "important-date",
    category_type:  "family_school",
    confidence:     "expected",
    priority:       2,
    detail_url:     "/events/mock-school-admissions-2026",
  },
  {
    date:           "2026-05-17",
    label_en:       "UAE Corporate Tax: Key Clarifications 2026",
    label_ru:       "Корпоративный налог ОАЭ: разъяснения 2026",
    short_label_en: "Tax Update",
    short_label_ru: "Налог: инфо",
    type:           "other",
    category_type:  "news_update",
    confidence:     "confirmed",
    priority:       3,
    detail_url:     "/news/mock-corporate-tax-update",
  },
  {
    date:           "2026-05-20",
    label_en:       "Golden Visa via Property: 2026 Requirements Updated",
    label_ru:       "Золотая виза через недвижимость: изменения 2026",
    short_label_en: "Golden Visa",
    short_label_ru: "Золотая виза",
    type:           "other",
    category_type:  "guide_update",
    confidence:     "confirmed",
    priority:       3,
    detail_url:     "/guides/golden-visa-property-dubai",
  },
  {
    date:           "2026-05-28",
    label_en:       "VAT Return: Q1 2026 Filing Deadline",
    label_ru:       "НДС: срок подачи декларации за Q1 2026",
    short_label_en: "VAT Q1",
    short_label_ru: "НДС Q1",
    type:           "deadline",
    category_type:  "tax_deadline",
    confidence:     "confirmed",
    priority:       1,
    detail_url:     "/guides/corporate-tax-uae",
    source:         "https://tax.gov.ae",
  },
  {
    date:           "2026-05-28",
    label_en:       "Trade License Renewal Reminder, DED Mainland",
    label_ru:       "Напоминание: продление торговой лицензии DED",
    short_label_en: "License",
    short_label_ru: "Лицензия",
    type:           "deadline",
    category_type:  "government_deadline",
    confidence:     "expected",
    priority:       1,
    detail_url:     "/calendar/mock-license-renewal",
  },
  {
    date:           "2026-05-28",
    label_en:       "DMCC Business Summit 2026",
    label_ru:       "Бизнес-саммит DMCC 2026",
    short_label_en: "DMCC",
    short_label_ru: "DMCC",
    type:           "important-date",
    category_type:  "business_event",
    confidence:     "confirmed",
    priority:       2,
    detail_url:     "/events/mock-dmcc-summit",
  },

  // ── June 2026 ───────────────────────────────────────────────────────────────

  {
    date:           "2026-06-06",
    label_en:       "Eid Al Adha, 1st Day (Expected)",
    label_ru:       "Ид аль-Адха, первый день (ожидаемая дата)",
    short_label_en: "Eid",
    short_label_ru: "Ид",
    type:           "public-holiday",
    category_type:  "holiday",
    confidence:     "subject_to_official_confirmation",
    priority:       1,
    period_end:     "2026-06-09",
    detail_url:     "/news/mock-eid-holiday",
  },
  {
    date:           "2026-06-07",
    label_en:       "Eid Al Adha, 2nd Day (Expected)",
    label_ru:       "Ид аль-Адха, второй день (ожидаемая дата)",
    short_label_en: "Eid",
    short_label_ru: "Ид",
    type:           "public-holiday",
    category_type:  "holiday",
    confidence:     "subject_to_official_confirmation",
    priority:       1,
    detail_url:     "/news/mock-eid-holiday",
  },
  {
    date:           "2026-06-08",
    label_en:       "Eid Al Adha, 3rd Day (Expected)",
    label_ru:       "Ид аль-Адха, третий день (ожидаемая дата)",
    short_label_en: "Eid",
    short_label_ru: "Ид",
    type:           "public-holiday",
    category_type:  "holiday",
    confidence:     "subject_to_official_confirmation",
    priority:       1,
    detail_url:     "/news/mock-eid-holiday",
  },
  {
    date:           "2026-06-09",
    label_en:       "Eid Al Adha, 4th Day (Expected)",
    label_ru:       "Ид аль-Адха, четвёртый день (ожидаемая дата)",
    short_label_en: "Eid",
    short_label_ru: "Ид",
    type:           "public-holiday",
    category_type:  "holiday",
    confidence:     "subject_to_official_confirmation",
    priority:       1,
    detail_url:     "/news/mock-eid-holiday",
  },
  {
    date:           "2026-06-15",
    label_en:       "Dubai Summer Surprises: Opens",
    label_ru:       "Dubai Summer Surprises: старт",
    short_label_en: "DSS",
    short_label_ru: "DSS",
    type:           "important-date",
    category_type:  "event",
    confidence:     "expected",
    priority:       2,
    period_end:     "2026-08-31",
    detail_url:     "/events/mock-dubai-summer-surprises",
  },
  {
    date:           "2026-06-18",
    label_en:       "School Year End, KHDA Dubai Schools",
    label_ru:       "Конец учебного года, школы KHDA",
    short_label_en: "School End",
    short_label_ru: "Конец года",
    type:           "important-date",
    category_type:  "family_school",
    confidence:     "expected",
    priority:       2,
    detail_url:     "/events/mock-school-year-end",
  },
  {
    date:           "2026-06-22",
    label_en:       "Summer Relocation Window",
    label_ru:       "Летний период для переезда",
    short_label_en: "Move Window",
    short_label_ru: "Переезд",
    type:           "other",
    category_type:  "relocation",
    confidence:     "expected",
    priority:       3,
    detail_url:     "/guides/mock-summer-relocation",
  },
  {
    date:           "2026-06-24",
    label_en:       "Cityscape Global: Dubai Real Estate Forum",
    label_ru:       "Cityscape Global: форум недвижимости Дубая",
    short_label_en: "Cityscape",
    short_label_ru: "Cityscape",
    type:           "important-date",
    category_type:  "real_estate_event",
    confidence:     "expected",
    priority:       2,
    period_end:     "2026-06-26",
    detail_url:     "/events/mock-cityscape",
  },
  {
    date:           "2026-06-27",
    label_en:       "Dubai Opera: Summer Gala Concert",
    label_ru:       "Dubai Opera: Летний гала-концерт",
    short_label_en: "Opera",
    short_label_ru: "Опера",
    type:           "important-date",
    category_type:  "event",
    confidence:     "confirmed",
    priority:       2,
    is_external:    true,
    detail_url:     "https://tickets.example.com/mock-dubai-opera-summer-2026",
    custom_cta_en:  "Buy tickets →",
    custom_cta_ru:  "Купить билеты →",
  },
  {
    date:           "2026-06-30",
    label_en:       "Corporate Tax Return: FY Ending 31 Dec 2025",
    label_ru:       "Декларация по корпоративному налогу: ФГ до 31 дек 2025",
    short_label_en: "CT Due",
    short_label_ru: "КН декл.",
    type:           "deadline",
    category_type:  "tax_deadline",
    confidence:     "confirmed",
    priority:       1,
    detail_url:     "/guides/corporate-tax-uae",
    source:         "https://tax.gov.ae",
  },
  {
    date:           "2026-06-30",
    label_en:       "Emirates ID Renewal Reminder",
    label_ru:       "Emirates ID: напоминание о продлении",
    short_label_en: "EID Renewal",
    short_label_ru: "EID прод.",
    type:           "deadline",
    category_type:  "government_deadline",
    confidence:     "expected",
    priority:       1,
    detail_url:     "/calendar/mock-emirates-id-renewal",
  },

  // ── October 2026 ────────────────────────────────────────────────────────────

  {
    date:           "2026-10-13",
    label_en:       "GITEX Global 2026",
    label_ru:       "GITEX Global 2026",
    short_label_en: "GITEX",
    short_label_ru: "GITEX",
    type:           "important-date",
    category_type:  "business_event",
    confidence:     "expected",
    priority:       2,
    period_end:     "2026-10-17",
    detail_url:     "/events/mock-gitex",
  },

  // ── December 2026 ───────────────────────────────────────────────────────────

  {
    date:           "2026-12-02",
    label_en:       "UAE National Day",
    label_ru:       "День государства ОАЭ",
    short_label_en: "National Day",
    short_label_ru: "День ОАЭ",
    type:           "public-holiday",
    category_type:  "holiday",
    confidence:     "confirmed",
    priority:       1,
    detail_url:     "/news/mock-uae-national-day",
  },
  {
    date:           "2026-12-03",
    label_en:       "UAE National Day, Public Holiday (Observed)",
    label_ru:       "День государства ОАЭ, выходной (перенесённый)",
    short_label_en: "National Day",
    short_label_ru: "День ОАЭ",
    type:           "public-holiday",
    category_type:  "holiday",
    confidence:     "confirmed",
    priority:       1,
    detail_url:     "/news/mock-uae-national-day",
  },
];

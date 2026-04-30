import type { Locale } from "@/lib/db/reader";

const EXACT_MAP: Record<string, string> = {
  // ── guide-level price (AED + English context) ──────────────────────────────
  "AED 9,884.75 (main applicant)":                                    "AED 9,884.75 (основной заявитель)",
  "AED 12,000–25,000+ (government fees only)":                        "AED 12,000–25,000+ (только государственные сборы)",
  "AED 6,000–20,000+ per year (varies by free zone and package)":     "AED 6,000–20,000+ в год (зависит от зоны и пакета)",

  // ── guide-level timeline ───────────────────────────────────────────────────
  "2–4 weeks":                                "2–4 недели",
  "7–10 business days":                       "7–10 рабочих дней",
  "2–4 weeks (without external approvals)":   "2–4 недели (без внешних согласований)",
  "1–2 weeks (varies by free zone)":          "1–2 недели (зависит от зоны)",

  // ── step cost — status/included strings ───────────────────────────────────
  "Free":                                     "Бесплатно",
  "No fee":                                   "Без сборов",
  "No fee at this stage":                     "Без сборов на этом этапе",
  "Included in license package price":        "Включено в стоимость пакета",
  "Included in Step 6":                       "Включено в шаг 6",
  "Included in Step 7":                       "Включено в шаг 7",
  "Varies (if required)":                     "По необходимости",
  "Varies by sector":                         "Зависит от сектора",
  "Varies by free zone and next step":        "Зависит от зоны и следующего шага",
  "Payment processed same day":               "Оплата в тот же день",

  // ── step cost — AED + English context ─────────────────────────────────────
  "AED 189 insurance + AED 1,285 (Cat 1/2) or AED 3,555 (Cat 3) labor fee":
    "AED 189 (страховка) + сбор MOHRE: AED 1,285 (категория 1/2) или AED 3,555 (категория 3)",
  "AED 78 (skilled, via Tasheel) or AED 152 (limited skilled, via Tawjeeh)":
    "AED 78 (квалифицированные, Tasheel) или AED 152 (ограниченно квалифицированные, Tawjeeh)",
  "AED 5,774.50 + AED 318.75 per file":       "AED 5,774.50 + AED 318.75 за досье",
  "AED 100–1,000 (varies by activity)":       "AED 100–1,000 (зависит от вида деятельности)",
  "AED 220 registration fee (office rent is separate)":
    "AED 220 (регистрационный сбор; аренда офиса отдельно)",
  "AED 8,000–20,000+ (license fee varies by activity and structure)":
    "AED 8,000–20,000+ (лицензионный сбор зависит от вида деятельности и структуры)",
  "AED 100–500 (varies by zone; often included in the application fee)":
    "AED 100–500 (зависит от зоны; часто включено в сбор за заявку)",
  "Application fee: AED 500–2,000 (varies by zone; often included in package price)":
    "Сбор за заявку: AED 500–2,000 (зависит от зоны; часто включено в стоимость пакета)",
  "AED 6,000–20,000+ (total first-year package: license + office + registration fees, varies by zone)":
    "AED 6,000–20,000+ (пакет первого года: лицензия + офис + регистрационные сборы, зависит от зоны)",

  // ── step timeEst — simple durations ───────────────────────────────────────
  "1 day":                                    "1 день",
  "1–2 days":                                 "1–2 дня",
  "2–3 days":                                 "2–3 дня",
  "1–5 days":                                 "1–5 дней",
  "2–5 days":                                 "2–5 дней",
  "3–5 days":                                 "3–5 дней",
  "1–2 business days":                        "1–2 рабочих дня",
  "1–3 business days":                        "1–3 рабочих дня",
  "2–4 weeks per person":                     "2–4 недели на каждого",

  // ── step timeEst — duration + context ─────────────────────────────────────
  "1–2 days (research)":                      "1–2 дня (исследование)",
  "2–3 days (card delivery 5–10 days)":       "2–3 дня (доставка карты 5–10 дней)",
  "1–3 business days for review":             "1–3 рабочих дня на проверку",
  "1–2 business days after signing the lease":"1–2 рабочих дня после подписания договора аренды",
  "1–3 business days after submission":       "1–3 рабочих дня после подачи",
  "1–3 business days after payment":          "1–3 рабочих дня после оплаты",
  "1–5 business days after payment":          "1–5 рабочих дней после оплаты",

  // ── step timeEst — D-class fixed (em-dash removed from EN field) ───────────
  "Varies: 4–10+ weeks if required":          "Сроки варьируются: 4–10+ недель (если требуется)",
  "Varies: bank account may take 2–6 weeks":  "Сроки варьируются: открытие счёта 2–6 недель",
};

const MONTHS: Record<string, string> = {
  January: "Январь", February: "Февраль", March: "Март",
  April: "Апрель", May: "Май", June: "Июнь",
  July: "Июль", August: "Август", September: "Сентябрь",
  October: "Октябрь", November: "Ноябрь", December: "Декабрь",
};

export function localizeValue(value: string, locale: Locale): string {
  if (locale === "en") return value;
  const mapped = EXACT_MAP[value];
  if (mapped) return mapped;
  const monthMatch = value.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/
  );
  if (monthMatch) return `${MONTHS[monthMatch[1]]} ${monthMatch[2]}`;
  return value;
}

import type { Locale } from "@/lib/db/reader";

const EXACT_MAP: Record<string, string> = {
  // cost values
  "Free":                                   "Бесплатно",
  "No fee":                                 "Без сборов",
  "No fee at this stage":                   "Без сборов на этом этапе",
  "Included in license package price":      "Включено в стоимость пакета",
  "Included in Step 6":                     "Включено в шаг 6",
  "Included in Step 7":                     "Включено в шаг 7",
  "Varies (if required)":                   "По необходимости",
  "Varies by sector":                       "Зависит от сектора",
  "Varies by free zone and next step":      "Зависит от зоны и следующего шага",
  "Payment processed same day":             "Оплата в тот же день",
  // timeEst values
  "1 day":                                  "1 день",
  "2–3 days":                               "2–3 дня",
  "1–2 days":                               "1–2 дня",
  "1–5 days":                               "1–5 дней",
  "2–5 days":                               "2–5 дней",
  "3–5 days":                               "3–5 дней",
  "2–4 weeks per person":                   "2–4 недели на каждого",
  "1–2 business days":                      "1–2 рабочих дня",
  "1–3 business days":                      "1–3 рабочих дня",
  "7–10 business days":                     "7–10 рабочих дней",
  "2–4 weeks":                              "2–4 недели",
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

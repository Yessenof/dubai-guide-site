import type { Locale } from "@/lib/db/reader";

const EXACT_MAP: Record<string, string> = {
  // ── guide-level price (AED + English context) ──────────────────────────────
  "AED 9,884.75 (main applicant)":                                    "AED 9,884.75 (основной заявитель)",
  "AED 12,000–25,000+ (government fees only)":                        "AED 12,000–25,000+ (только государственные сборы)",
  "AED 6,000–20,000+ per year (varies by free zone and package)":     "AED 6,000–20,000+ в год (зависит от зоны и пакета)",

  // ── guide-level timeline ───────────────────────────────────────────────────
  "2–4 weeks":                                "2–4 недели",
  "4–8 weeks":                                "4–8 недель",
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
  "Included in MOHRE work permit":            "Включено в разрешение на работу MOHRE",
  "Flight costs (not government fee)":        "Стоимость перелёта (не государственный сбор)",
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
  "1–2 working days":                         "1–2 рабочих дня",
  "2–4 working days":                         "2–4 рабочих дня",
  "3–5 working days":                         "3–5 рабочих дней",
  "Travel day":                               "День перелёта",
  "3–5 working days for card delivery":       "3–5 рабочих дней до получения карты",

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

  // ── bank account guide — step cost ────────────────────────────────────────
  "No fee (regulatory registration costs are separate)":
    "Без комиссии (государственная регистрация оплачивается отдельно)",
  "No government fee. Bank package, monthly subscription, account opening, card, cheque book, or transfer fees depend on the bank and account package.":
    "Государственных сборов нет. Комиссии зависят от банка и пакета: ежемесячная подписка, открытие счёта, карты, чековая книжка и переводы.",

  // ── bank account guide — step timeEst ─────────────────────────────────────
  "Allow additional weeks if RERA or goAML registration is required.":
    "Заложите дополнительные недели, если потребуется регистрация RERA или goAML.",
  "2–6 weeks from submission (varies by bank and compliance review)":
    "2–6 недель с момента подачи (зависит от банка и compliance-проверки)",

  // ── holiday home guide — step timeEst ────────────────────────────────────
  "5 minutes":                                 "5 минут",
  "15 minutes":                                "15 минут",
  "15-30 minutes":                             "15-30 минут",
  "20-30 minutes":                             "20-30 минут",
  "30-60 minutes":                             "30-60 минут",
  "1-2 hours":                                 "1-2 часа",
  "10 minutes for first-time registration; instant for returning users":
    "10 минут при первичной регистрации; мгновенно для существующих аккаунтов",
  "Variable. DET targets 1 business day for service delivery, but review, comments and resubmissions can extend the timeline.":
    "Сроки варьируются. DET указывает 1 рабочий день для оказания услуги, но проверка, комментарии и повторная подача могут увеличить срок.",
  "1-3 business days after payment confirmation":
    "1-3 рабочих дня после подтверждения оплаты",

  // ── holiday home guide — step cost ────────────────────────────────────────
  "No additional fee":                         "Без дополнительных сборов",
  "AED 50 (classification fee, included in the total permit fee paid in Step 8)":
    "AED 50 (сбор за классификацию, включён в общий сбор, уплачиваемый на шаге 8)",
  "From AED 370 (1-bedroom). AED 670 for 2-bedroom, AED 970 for 3-bedroom. Formula: AED 300 per bedroom + AED 50 classification + AED 10 Knowledge + AED 10 Innovation.":
    "От AED 370 (1 спальня). AED 670 (2 спальни), AED 970 (3 спальни). Формула: AED 300 за спальню + AED 50 (классификация) + AED 10 (Knowledge) + AED 10 (Innovation).",
  "From AED 370 (see Step 8 for full breakdown). Online payment only.":
    "От AED 370 (расчёт в шаге 8). Оплата только онлайн.",
  "No government fee. Tourism Dirham is collected from guests: AED 15 per room per night (Deluxe) or AED 10 per room per night (Standard).":
    "Государственных сборов нет. Tourism Dirham взимается с гостей: AED 15 за номер в сутки (Deluxe) или AED 10 за номер в сутки (Standard).",

  // ── holiday home guide — guide-level price and timeline ───────────────────
  "From AED 370 for a 1-bedroom unit (AED 300 per bedroom + AED 50 classification + AED 10 Knowledge + AED 10 Innovation). Final fee depends on bedroom count and portal calculation.":
    "От AED 370 за юнит с одной спальней (AED 300 за спальню + AED 50 за классификацию + AED 10 Knowledge + AED 10 Innovation). Итоговый сбор зависит от количества спален и расчёта в портале.",
  "DET lists 1 business day as the target service delivery time. Review, comments, payment confirmation and record issuance can add additional days.":
    "DET указывает 1 рабочий день как целевой срок оказания услуги. Проверка, комментарии, подтверждение оплаты и выпуск записи могут добавить дни к сроку.",

  // ── newborn visa guide — step cost ───────────────────────────────────────
  "AED 50–100 (birth certificate fee; often included in hospital discharge process)":
    "AED 50–100 (сбор за свидетельство о рождении, часто входит в процесс выписки из больницы)",
  "Varies by nationality (typically equivalent to USD 50–200)":
    "Зависит от гражданства, обычно эквивалент USD 50–200",
  "Included in Step 2 consulate fees":
    "Включено в консульские сборы из шага 2",
  "AED 510 (residence visa issuance; if family file already exists) or AED 762 (AED 252 family file + AED 510 residence, if opening a new file)":
    "AED 510, если family file уже открыт, или AED 762 при открытии нового файла: AED 252 + AED 510",
  "AED 385 (Emirates ID fee)":
    "AED 385 (сбор за Emirates ID)",

  // ── newborn visa guide — step timeEst ────────────────────────────────────
  "1–3 working days":
    "1–3 рабочих дня",
  "1–5 working days (registration visit); passport takes 2–8 weeks":
    "1–5 рабочих дней на визит для регистрации; паспорт обычно занимает 2–8 недель",
  "2–8 weeks from initial consulate registration (varies by nationality)":
    "2–8 недель после первичной регистрации в консульстве, зависит от гражданства",
  "2–5 working days":
    "2–5 рабочих дней",
  "5–10 working days for card delivery after application":
    "5–10 рабочих дней на доставку карты после подачи",
  "2–5 working days (visa stamp); 5–10 working days (Emirates ID delivered by post)":
    "2–5 рабочих дней на визу; 5–10 рабочих дней на доставку Emirates ID по почте",

  // ── renew-family-visa guide — guide-level price and timeline ─────────────
  "AED 250–450 (medical test, adults 18+ only; children under 18 exempt). Visa and EID fees confirmed at Amer.":
    "AED 250–450 (медосмотр, для лиц от 18 лет; дети до 18 лет освобождены). Сборы за визу и Emirates ID подтверждаются в Amer.",
  "Medical results: 1–3 working days. Amer processing: 2–5 working days. EID delivered by post within 5–10 working days.":
    "Результаты медосмотра: 1–3 рабочих дня. Обработка в Amer: 2–5 рабочих дней. Emirates ID доставляется по почте в течение 5–10 рабочих дней.",

  // ── renew-family-visa guide — step cost ───────────────────────────────────
  "No cost":
    "Без сборов",
  "AED 250–450 (fee varies by approved medical center)":
    "AED 250–450 (зависит от аккредитованного медцентра)",
  "Residence visa renewal and Emirates ID fees vary by visa duration and family file status. Amer confirms the combined total and service fee at submission.":
    "Сборы за продление residence visa и Emirates ID зависят от срока визы и статуса family file. Сумму и сервисный сбор Amer подтверждает при подаче.",

  // ── renew-family-visa guide — step timeEst ────────────────────────────────
  "5–10 minutes":
    "5–10 минут",
  "1–3 working days for results to be uploaded to the ICA system":
    "1–3 рабочих дня до появления результата в системе",
  "Counter visit 30–60 minutes. Residence visa processed within 2–5 working days.":
    "Визит в офис: 30–60 минут. Residence visa обрабатывается в течение 2–5 рабочих дней.",
  "Visa stamp: 2–5 working days after Amer submission. Emirates ID: delivered by post within 5–10 working days after visa approval.":
    "Штамп визы: 2–5 рабочих дней после подачи в Amer. Emirates ID: доставляется по почте в течение 5–10 рабочих дней после одобрения визы.",

  // ── document-attestation guide — guide-level price and timeline ──────────
  "AED 150 (UAE MOFA, standard processing). Home-country and UAE Embassy fees vary by nationality.":
    "AED 150 (UAE MOFA, стандартная обработка). Расходы на стороне страны выдачи и сбор UAE Embassy зависят от гражданства.",
  "2–6 weeks end-to-end. UAE MOFA step: 1–3 working days.":
    "2–6 недель от начала до конца. Шаг UAE MOFA: 1–3 рабочих дня.",

  // ── document-attestation guide — step cost ────────────────────────────────
  "Varies by country. Notarization typically equivalent to USD 20–80. UAE Embassy attestation fee typically USD 30–100.":
    "Зависит от страны. Нотариальное заверение: обычно эквивалент USD 20–80. Сбор UAE Embassy: обычно USD 30–100.",
  "AED 150 per document (standard, 1–3 working days). Express processing is available for a higher fee. Approved typing centers charge an additional service fee of AED 50–150.":
    "AED 150 за документ (стандарт, 1–3 рабочих дня). Экспресс-обработка доступна за доп. сбор. Авторизованные typing centers берут сервисный сбор AED 50–150.",

  // ── document-attestation guide — step timeEst ─────────────────────────────
  "1–4 weeks depending on your country and UAE Embassy workload":
    "1–4 недели в зависимости от страны и загруженности UAE Embassy",
  "1–3 working days (standard); same-day or next-day (express)":
    "1–3 рабочих дня (стандарт); в тот же день или на следующий (экспресс)",
  "Included in step 2 processing time":
    "Включено в срок обработки шага 2",

  // ── amer-center guide — guide-level price and timeline ────────────────────
  "Service fee + applicable UAE government fee per transaction. Total varies by service — see the guide for your specific procedure.":
    "Сбор Amer + государственный сбор ОАЭ за транзакцию. Итоговая сумма зависит от услуги.",
  "1–5 working days. Walk-in: 30–90 min wait; appointment: 10–20 min.":
    "1–5 рабочих дней. Без записи: 30–90 минут ожидания; по записи: 10–20 минут.",

  // ── amer-center guide — step cost ─────────────────────────────────────────
  "No booking fee":
    "Запись бесплатна",
  "AED 2–5 per page for photocopies at Amer, if needed":
    "AED 2–5 за страницу для копий в Amer (при необходимости)",
  "Amer typing fee plus applicable UAE government fees. Staff confirm the total before payment. See the guide for your specific transaction for a detailed fee breakdown.":
    "Сбор Amer за оформление плюс государственные сборы ОАЭ. Сотрудник подтверждает итоговую сумму до оплаты.",

  // ── amer-center guide — step timeEst ──────────────────────────────────────
  "Appointments typically available within 1–3 working days":
    "Запись, как правило, доступна в течение 1–3 рабочих дней",
  "15–30 minutes to prepare":
    "15–30 минут на подготовку",
  "Counter transaction 15–30 minutes once called. Total branch time 30–90 minutes including wait (less with appointment).":
    "Транзакция у стойки: 15–30 минут после вызова. Общее время в центре: 30–90 минут с очередью (меньше по записи).",
  "1–5 working days for most transactions. Emirates ID takes an additional 5–10 working days after residence visa approval and is delivered by post.":
    "1–5 рабочих дней для большинства транзакций. Emirates ID: ещё 5–10 рабочих дней после одобрения визы, доставляется по почте.",

  // ── pro-services guide — guide-level price and timeline ───────────────────
  "Set by provider — not government-regulated. Typically per-transaction or monthly retainer. Request written quotes before committing.":
    "Устанавливается провайдером. Обычно за транзакцию или ежемесячный абонемент. Запросите письменные предложения до подписания.",
  "PRO engagement: 1–3 working days to set up. Transaction timelines depend on the relevant government department.":
    "Привлечение PRO: 1–3 рабочих дня. Сроки транзакций зависят от соответствующего госоргана.",

  // ── pro-services guide — step cost ────────────────────────────────────────
  "No cost to research and request quotes":
    "Без сборов за исследование и запрос предложений",
  "Letter of authorization: no cost to issue. Notarized power of attorney: notary fees apply if required. Confirm the exact cost with the notary center before proceeding.":
    "Письмо о полномочиях: без стоимости выдачи. Нотариальная доверенность: нотариальный сбор при необходимости. Уточните стоимость в нотариальном центре до подписания.",
  "No additional fee beyond the agreed service charge":
    "Без дополнительных сборов сверх согласованной стоимости услуг",

  // ── pro-services guide — step timeEst ─────────────────────────────────────
  "30–60 minutes to assess":
    "30–60 минут на оценку",
  "1–3 working days to collect and compare quotes":
    "1–3 рабочих дня на сбор и сравнение предложений",
  "Same-day to 2 working days":
    "В тот же день или до 2 рабочих дней",
  "Document handover: same-day. Government processing time varies by transaction. See the guide for your specific procedure.":
    "Передача документов: в тот же день. Срок обработки в госоргане зависит от транзакции.",
  "Varies by transaction. See individual guides for government processing timelines.":
    "Зависит от транзакции. Сроки по конкретным процессам указаны в соответствующих гайдах.",

  // ── bank account guide — guide-level timeline and price ───────────────────
  "2–6 weeks (varies by bank, compliance review, and business activity)":
    "2–6 недель (зависит от банка, compliance-проверки и вида деятельности)",
  "No government fee. Bank package costs vary: some digital bank packages charge a monthly subscription fee with no minimum balance; some traditional bank packages may require an average monthly balance, a relationship balance, or additional documents. Compare packages before applying.":
    "Государственных сборов нет. Стоимость банковского обслуживания варьируется: у одних цифровых банков действует ежемесячная подписка без минимального остатка; у других банков могут потребоваться средний остаток, relationship balance или дополнительные документы. Сравните пакеты перед подачей.",
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

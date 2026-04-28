# Russian Launch Plan — Guidex Consulting

Last updated: 2026-04-28

This is the page-by-page plan for the minimum Russian language launch. It covers the 12 priority pages from `docs/platform-roadmap.md` Phase 1E.

Each entry includes: RU URL, primary RU keyword, secondary keywords, title direction, meta description direction, and content notes for translation/adaptation.

---

## Priority order

1. Homepage (`/ru`)
2. Contact (`/ru/contact`)
3. Guides index (`/ru/guides`)
4. Employment visa (inside UAE)
5. Golden visa — property route
6. Mainland company setup
7. Free zone company setup
8. Bank account
9. Newborn visa
10. Document attestation
11. Amer center
12. PRO services

---

## Page 1 — Homepage (`/ru`)

**RU URL:** `/ru`
**EN reference:** `/`

**Primary keyword:** переезд в дубай
**Secondary keywords:** виза в дубае, открыть компанию в дубае, документы ОАЭ, консультация дубай

**Title direction:**
> Гайд по Дубаю — визы, компании, документы | Guidex

**Meta description direction:**
> Пошаговые руководства по оформлению виз, регистрации компаний и работе с государственными органами в Дубае. Актуально для переезжающих и резидентов.

**Content notes:**
- The H1 and hero copy must feel like a warm, direct welcome — not a marketing pitch
- Emphasis on RU-speaking clients being served: "Работаем с русскоязычными клиентами"
- Service cards link to RU versions of hub pages (`/ru/visas`, `/ru/company-setup`)
- WhatsApp CTA: same number (971506304817), copy in Russian: "Написать нам в WhatsApp"
- No auto-redirect from `/` to `/ru` — the language switcher handles it

---

## Page 2 — Contact (`/ru/contact`)

**RU URL:** `/ru/contact`
**EN reference:** `/contact`

**Primary keyword:** консультация по визе дубай
**Secondary keywords:** связаться guidex, консультант по ОАЭ

**Title direction:**
> Связаться с нами | Guidex Consulting

**Meta description direction:**
> Задайте вопрос по визе, компании или документам в Дубае. Отвечаем на русском языке.

**Content notes:**
- Contact page is mostly a form + WhatsApp link — minimal copy
- Copy should say: "Отвечаем на русском языке" prominently
- No content divergence from EN page other than language

---

## Page 3 — Guides index (`/ru/guides`)

**RU URL:** `/ru/guides`
**EN reference:** `/guides`

**Primary keyword:** руководства по дубаю
**Secondary keywords:** виза дубай пошагово, как оформить документы ОАЭ

**Title direction:**
> Руководства по Дубаю — визы, компании, документы | Guidex

**Meta description direction:**
> Пошаговые руководства по получению виз, регистрации компаний и работе с государственными органами ОАЭ. На русском языке.

**Content notes:**
- Guide cards must display RU title and summary from DB where available
- Cards for guides without RU content should not appear on this page (or appear with EN fallback marked as "перевод готовится")
- Prefer: only show guides where `ru_title` is non-empty

---

## Page 4 — Employment visa (inside UAE)

**Slug:** `employment-visa`
**RU URL:** `/ru/guides/employment-visa`
**EN reference:** `/guides/employment-visa`

**Primary keyword:** рабочая виза дубай
**Secondary keywords:** рабочая виза ОАЭ оформление, как получить рабочую визу в дубае, трудовая виза дубай

**RU title direction:**
> Рабочая виза в Дубае без выезда из ОАЭ: пошаговое руководство

**RU meta description direction:**
> Как оформить рабочую визу в Дубае, не покидая ОАЭ. Процесс через Tasheel и Amer Center, государственные сборы и сроки. Обновлено 2025.

**Content notes:**
- This is the highest-priority guide for Russian-speaking job seekers
- Step translations must preserve all specific service center names: Tasheel, Amer, Tawjeeh, MOHRE, GDRFA
- Fees must be identical to EN (AED amounts are not localised)
- Do not translate MOHRE, ICA, GDRFA — use acronyms in both languages
- The audience field: "Сотрудники, уже находящиеся в ОАЭ на любом визовом статусе, под спонсорством работодателя на материковой части Дубая."

---

## Page 5 — Golden visa (property route)

**Slug:** `golden-visa-dubai-property`
**RU URL:** `/ru/guides/golden-visa-dubai-property`
**EN reference:** `/guides/golden-visa-dubai-property`

**Primary keyword:** золотая виза дубай через недвижимость
**Secondary keywords:** золотая виза ОАЭ недвижимость, золотая виза дубай условия, резидентская виза через покупку недвижимости

**RU title direction:**
> Золотая виза ОАЭ через недвижимость: условия и процесс получения

**RU meta description direction:**
> Как получить золотую визу в Дубае через покупку недвижимости. Минимальная стоимость объекта, необходимые документы, сроки оформления.

**Content notes:**
- "Golden visa" in Russian is consistently "золотая виза" (widely established)
- Emphasise: 10-летняя виза (10-year visa) — this angle resonates strongly with Russian property investors
- Investment threshold (AED 2 million+) must be stated clearly in the overview
- RU audience frequently arrives via property investment angle — lead with investment benefit, not process bureaucracy

---

## Page 6 — Mainland company setup

**Slug:** `mainland-company-setup-dubai`
**RU URL:** `/ru/guides/mainland-company-setup-dubai`
**EN reference:** `/guides/mainland-company-setup-dubai`

**Primary keyword:** регистрация компании в дубае mainland
**Secondary keywords:** mainland компания дубай, лицензия DED дубай, торговая лицензия дубай, открыть компанию в дубае континентальная

**RU title direction:**
> Регистрация компании Mainland в Дубае: пошаговое руководство

**RU meta description direction:**
> Как зарегистрировать mainland-компанию в Дубае. Лицензия DED, торговая лицензия, требования и этапы процесса.

**Content notes:**
- "Mainland" is widely used in Russian business community as-is (not translated)
- DED — used as acronym in both languages
- Avoid translating terms that Russian-speaking entrepreneurs in Dubai use in English (mainland, free zone, DED)
- Step translations must preserve all cost estimates exactly

---

## Page 7 — Free zone company setup

**Slug:** `free-zone-company-setup-dubai`
**RU URL:** `/ru/guides/free-zone-company-setup-dubai`
**EN reference:** `/guides/free-zone-company-setup-dubai`

**Primary keyword:** регистрация компании в свободной зоне дубай
**Secondary keywords:** free zone компания дубай, DMCC IFZA регистрация, открыть компанию в ОАЭ иностранец, 100 процентное владение компанией ОАЭ

**RU title direction:**
> Регистрация компании в свободной зоне Дубая: Free Zone и 100% иностранное владение

**RU meta description direction:**
> Как открыть компанию в свободной зоне Дубая. DMCC, IFZA, JAFZA — выбор зоны, этапы регистрации и стоимость.

**Content notes:**
- "Free zone" is used as-is in Russian business context — do not attempt a pure Russian translation
- "фризона" (transliteration) is acceptable as a synonym
- 100% иностранное владение — this angle is critical for Russian audience who assume they need a local partner
- Specific free zone names (DMCC, IFZA, JAFZA) must appear in RU content for searchability

---

## Page 8 — Bank account

**Slug:** `open-business-bank-account-dubai`
**RU URL:** `/ru/guides/open-business-bank-account-dubai`
**EN reference:** `/guides/open-business-bank-account-dubai`

**Primary keyword:** открыть счет в дубае компания
**Secondary keywords:** банковский счет для компании ОАЭ, корпоративный счет дубай, открыть расчетный счет ОАЭ, счет для бизнеса дубай иностранцу

**RU title direction:**
> Как открыть банковский счёт для компании в Дубае

**RU meta description direction:**
> Пошаговое руководство по открытию корпоративного счёта в Дубае. Какие банки работают с иностранцами, необходимые документы и реальные сроки.

**Content notes:**
- Bank account guide is high-conversion for Russian founders who just registered a company
- "Иностранцу" (for foreigners) is a key intent signal — include in content
- Realistic timelines matter especially here — Russian audience has heard stories of delays
- Do not invent bank names unless confirmed in EN content
- "Расчётный счёт" is natural Russian for corporate/business account

---

## Page 9 — Newborn visa

**Slug:** `newborn-visa-dubai`
**RU URL:** `/ru/guides/newborn-visa-dubai`
**EN reference:** `/guides/newborn-visa-dubai`

**Primary keyword:** виза новорожденному дубай
**Secondary keywords:** регистрация новорожденного дубай, документы на новорожденного ОАЭ, свидетельство о рождении дубай

**RU title direction:**
> Виза и регистрация новорождённого в Дубае: что делать после родов

**RU meta description direction:**
> Как оформить визу и зарегистрировать новорождённого в ОАЭ. Порядок действий, документы, сроки — пошаговое руководство для родителей-экспатов.

**Content notes:**
- This is high-urgency — parent is reading this immediately after having a baby
- Lead with: what to do first and in what order — do not bury the lead
- "Свидетельство о рождении" vs "Birth certificate" — use Russian term in RU content
- Emotional tone: calm, practical, reassuring — not bureaucratic
- RU audience may not know that the newborn visa must be obtained within a limited window — state this clearly in overview

---

## Page 10 — Document attestation

**Slug:** `document-attestation-dubai`
**RU URL:** `/ru/guides/document-attestation-dubai`
**EN reference:** `/guides/document-attestation-dubai`

**Primary keyword:** легализация документов дубай
**Secondary keywords:** апостиль документов для ОАЭ, MOFA атестация документов дубай, аттестация иностранных документов ОАЭ, заверение документов для визы дубай

**RU title direction:**
> Легализация и апостиль документов для ОАЭ: пошаговое руководство

**RU meta description direction:**
> Как легализовать иностранные документы для использования в ОАЭ. Апостиль, нотариальное заверение, MOFA — порядок действий и стоимость.

**Content notes:**
- Russian audience often arrives with documents from Russia, Kazakhstan, Ukraine — context matters
- "Апостиль" is the most-searched Russian term for this process — use it prominently
- MOFA = Министерство иностранных дел (МИД) — do not translate MOFA; explain what it is once
- Note which countries are Hague Convention members vs require full legalisation chain
- This guide feeds into all family visa and company setup guides — internal links critical

---

## Page 11 — Amer center

**Slug:** `amer-center-dubai`
**RU URL:** `/ru/guides/amer-center-dubai`
**EN reference:** `/guides/amer-center-dubai`

**Primary keyword:** Amer центр дубай
**Secondary keywords:** Амер центр дубай услуги, визовый центр дубай, центр подачи документов дубай

**RU title direction:**
> Amer Center Дубай: что это такое и как им пользоваться

**RU meta description direction:**
> Полное руководство по Amer Center в Дубае — список услуг, процесс подачи документов и советы для первого визита.

**Content notes:**
- Russian-speaking users often do not know what Amer Center is at all — the title and intro must explain it, not assume knowledge
- Use "Амер" and "Amer Center" interchangeably in RU content — both spellings appear in searches
- "Визовый центр" is close enough in RU — acceptable as a description, not as an official name
- Mention that all family visa and residence steps run through Amer — sets context for linked guides

---

## Page 12 — PRO services

**Slug:** `pro-services-dubai`
**RU URL:** `/ru/guides/pro-services-dubai`
**EN reference:** `/guides/pro-services-dubai`

**Primary keyword:** PRO услуги дубай
**Secondary keywords:** про-сервис дубай, оформление документов для компании дубай

**RU title direction:**
> PRO-услуги в Дубае: что это и когда они нужны компании

**RU meta description direction:**
> Что такое PRO-услуги в Дубае, какие задачи они решают и сколько стоят. Руководство для владельцев бизнеса.

**Content notes:**
- "PRO" is used as-is in Russian business community — do not translate
- "Про-сервис" or "PRO-услуги" both acceptable
- Audience: company owners who have registered a business and now need government document handling
- Emphasise that PRO saves time vs doing it yourself — this is the key value proposition for RU audience

---

## Translation workflow

1. Write or finalise EN content first — RU is never done before EN is stable
2. Translate/adapt each field manually — do not machine-translate and publish raw
3. Apply `docs/content-style-guide-ru-en.md` rules throughout
4. Enter RU content into admin `ru_*` fields directly
5. Run QA: no em dashes, short sentences, natural Russian phrasing, no translated-English feel
6. Set `generateStaticParams` to include this slug in `/ru/guides/[slug]` generation (only when `ru_title` is non-empty)

---

## Go/no-go criteria for RU launch

- [ ] At least 6 of the 12 priority pages have `ru_title` non-empty
- [ ] `/ru` homepage renders without errors
- [ ] Language switcher works: `/guides/employment-visa` ↔ `/ru/guides/employment-visa`
- [ ] hreflang tags present on both EN and RU versions of each translated page
- [ ] Fallback renders EN content on any RU page where `ru_title` is empty
- [ ] RU sitemap entries added for all translated pages
- [ ] Google Search Console property updated with RU alternate URLs

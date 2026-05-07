/**
 * Route Finder / Calculator — Config v1
 *
 * All question tree and resolution logic lives here.
 * No DB dependencies — safe to import in client components.
 * Do not add a /api/route-finder endpoint. Resolution stays in this file.
 *
 * To add a new route: add a resolution entry and wire it into the question tree.
 * Do not modify RouteFinderFlow.tsx — the component is a generic config renderer.
 *
 * ─── Future Admin Migration Path ──────────────────────────────────────────────
 *
 * This config is deliberately shaped to map 1:1 to future DB tables.
 * When admin editability is needed, migrate these config keys:
 *
 *  Config key              → Future DB table / column
 *  ─────────────────────────────────────────────────────────────────────
 *  questions[id].text      → route_finder_questions.text
 *  questions[id].options   → route_finder_options (question_id FK, value, label, next_id, context_key, display_order)
 *  resolutions[id].type    → route_finder_resolutions.type
 *  resolutions[id].guideSlug    → route_finder_resolutions.guide_slug
 *  resolutions[id].contextSlugMap → route_finder_context_slugs (resolution_id FK, context_key, context_value, guide_slug)
 *  resolutions[id].keyFacts     → route_finder_resolution_facts (resolution_id FK, body, display_order)
 *  resolutions[id].supportingServices → route_finder_supporting_services (resolution_id FK, service_slug, display_order)
 *  resolutions[id].supportingNote    → route_finder_resolutions.supporting_note
 *  resolutions[id].hubUrl / heading / body / whatsapp → route_finder_resolutions columns
 *
 * The component (RouteFinderFlow.tsx) reads config shape generically.
 * It does not know the names of any specific questions, context keys, or slugs.
 * Swapping a static config object for a DB-fetched object requires zero component changes.
 *
 * Admin-editable fields (priority order for Phase 8):
 *  1. Question text + option labels (UX copy changes without redeploy)
 *  2. Resolution keyFacts (keeps result cards accurate as rules change)
 *  3. guideSlug mappings (when new guides are published, map them instantly)
 *  4. supportingServices injection (toggle without code change)
 *  5. whatsapp flag per resolution (enable/disable expert CTA per route)
 * ──────────────────────────────────────────────────────────────────────────────
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CalcGuideData {
  slug: string;
  title: string;
  summary?: string;
  price: string;
  timeline: string;
}

export interface GuideResolution {
  type: "guide";
  /** Direct slug — use when the slug doesn't depend on prior answers */
  guideSlug?: string;
  /**
   * Context-dependent slug map.
   * contextKey: which key in the answer context to look up (e.g. "familyType")
   * slugs: map from context value → guide slug (e.g. { spouse: "...", child: "..." })
   *
   * The renderer reads contextSlugMap.contextKey from state.context generically.
   * It does NOT hardcode context key names — those live here in the config only.
   *
   * DB migration: becomes route_finder_context_slugs table
   *   (resolution_id, context_key, context_value, guide_slug)
   */
  contextSlugMap?: {
    contextKey: string;
    slugs: Record<string, string>;
  };
  keyFacts: string[];
  /** Slugs of supporting service guides to inject below the CTA */
  supportingServices: string[];
  /** Optional explanatory note above the supporting service links */
  supportingNote?: string;
}

export interface HubResolution {
  type: "hub";
  hubUrl: string;
  heading: string;
  body: string;
  /** Optional CTA button label — defaults to "See All Routes →" in the renderer */
  ctaLabel?: string;
  whatsapp: boolean;
}

export interface AdvisorResolution {
  type: "advisor";
  heading: string;
  body: string;
  whatsapp: boolean;
}

export type Resolution = GuideResolution | HubResolution | AdvisorResolution;

export interface QuestionOption {
  value: string;
  label: string;
  /** Optional supporting line shown under the label in the answer card */
  sublabel?: string;
  /** ID of the next question or resolution */
  next: string;
  /**
   * If set, save this option's value to context under this key.
   * Used to carry family type (spouse/child) into the location question.
   */
  contextKey?: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface RouteFinderConfig {
  startQuestion: string;
  /** WhatsApp contact URL — admin-editable in Phase 8 */
  whatsappHref: string;
  questions: Record<string, Question>;
  resolutions: Record<string, Resolution>;
}

// ---------------------------------------------------------------------------
// Question tree
// ---------------------------------------------------------------------------

export const ROUTE_FINDER_CONFIG: RouteFinderConfig = {
  startQuestion: "q1",
  whatsappHref: "https://wa.me/971506304817",

  questions: {
    q1: {
      id: "q1",
      text: "What are you trying to do?",
      options: [
        { value: "family-new",   label: "Get a visa for my spouse or child",  sublabel: "Entry permit + residence visa",         next: "q2-family-type" },
        { value: "family-renew", label: "Renew an existing family visa",       sublabel: "For spouse or child already on a visa", next: "r-renew"        },
        { value: "newborn",      label: "Register a newborn born in the UAE",  sublabel: "Birth registration + first residence",  next: "r-newborn"      },
        { value: "employment",   label: "Get an employment visa",              sublabel: "Mainland Dubai employer required",       next: "q2-emp-loc"     },
        { value: "golden",       label: "Get a Golden Visa",                   sublabel: "10-year renewable UAE residence",        next: "q2-golden"      },
        { value: "company",      label: "Set up a company",                    sublabel: "Mainland, free zone, or bank account",  next: "q2-company"     },
        { value: "other",        label: "Something else / not sure",           sublabel: "We'll help find the right path",        next: "r-advisor"      },
      ],
    },

    "q2-family-type": {
      id: "q2-family-type",
      text: "Who are you sponsoring?",
      options: [
        { value: "spouse", label: "My spouse", sublabel: "Husband or wife",                     next: "q3-location", contextKey: "familyType" },
        { value: "child",  label: "My child",  sublabel: "Son, daughter, or dependent student", next: "q3-location", contextKey: "familyType" },
      ],
    },

    "q3-location": {
      id: "q3-location",
      text: "Where are they right now?",
      options: [
        { value: "outside", label: "Outside the UAE", sublabel: "They will travel to Dubai after approval", next: "r-family-outside" },
        { value: "inside",  label: "Inside the UAE",  sublabel: "Status change without departing",          next: "r-family-inside"  },
      ],
    },

    "q2-emp-loc": {
      id: "q2-emp-loc",
      text: "Where are you currently based?",
      options: [
        { value: "inside",  label: "I am in the UAE",      sublabel: "No departure required",  next: "r-employment-inside"  },
        { value: "outside", label: "I am outside the UAE", sublabel: "Applying from abroad",   next: "r-employment-outside" },
      ],
    },

    "q2-golden": {
      id: "q2-golden",
      text: "How are you applying for a Golden Visa?",
      options: [
        { value: "property",     label: "I own property worth AED 2M+",              sublabel: "Completed or off-plan property",       next: "r-golden-property" },
        { value: "professional", label: "I'm a professional or senior talent",        sublabel: "Based on salary, role, or investment", next: "r-hub-golden"      },
        { value: "unsure",       label: "I'm not sure which route applies",           sublabel: "See all Golden Visa options",          next: "r-hub-golden"      },
      ],
    },

    "q2-company": {
      id: "q2-company",
      text: "What do you need?",
      options: [
        { value: "mainland",    label: "Mainland company",              sublabel: "DED-licensed, trade anywhere in the UAE", next: "r-mainland"    },
        { value: "freezone",    label: "Free zone company",             sublabel: "100% ownership, export-focused",          next: "r-freezone"    },
        { value: "bankaccount", label: "Open a business bank account",  sublabel: "Requires an active trade license",        next: "r-bankaccount" },
        { value: "unsure",      label: "I'm not sure which I need",     sublabel: "See a full comparison",                   next: "r-hub-company" },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Resolution states
  // ---------------------------------------------------------------------------

  resolutions: {
    "r-family-outside": {
      type: "guide",
      contextSlugMap: {
        contextKey: "familyType",
        slugs: {
          spouse: "spouse-dependent-visa-dubai-outside-country",
          child:  "child-dependent-visa-dubai-outside-country",
        },
      },
      keyFacts: [
        "Your family member travels to Dubai after the entry permit is approved",
        "Marriage or birth certificate must be attested before starting",
        "You submit the entry permit application as the sponsor",
      ],
      supportingServices: ["document-attestation-dubai"],
      supportingNote: "Certificate attestation is required before this process begins:",
    },

    "r-family-inside": {
      type: "guide",
      contextSlugMap: {
        contextKey: "familyType",
        slugs: {
          spouse: "spouse-dependent-visa-dubai-inside-country",
          child:  "child-dependent-visa-dubai-inside-country",
        },
      },
      keyFacts: [
        "No departure required — your family member stays in the UAE throughout",
        "Status is changed in-country — no entry permit needed",
        "Amer service center handles the submission",
      ],
      supportingServices: ["amer-center-dubai"],
      supportingNote: "Your submission will go through Amer:",
    },

    "r-renew": {
      type: "guide",
      guideSlug: "renew-family-visa-dubai",
      keyFacts: [
        "Covers both spouse and child renewal",
        "Adults 18 and older must complete a medical fitness test first",
        "Children under 18 are exempt from the medical test",
      ],
      supportingServices: ["amer-center-dubai"],
      supportingNote: "Renewal is submitted at Amer:",
    },

    "r-newborn": {
      type: "guide",
      guideSlug: "newborn-visa-dubai",
      keyFacts: [
        "For children born in the UAE",
        "Covers birth registration, DHA enrolment, and residence visa",
        "Submit before the child is 120 days old to avoid overstay fees",
      ],
      supportingServices: [],
    },

    "r-employment-inside": {
      type: "guide",
      guideSlug: "employment-visa",
      keyFacts: [
        "This route applies to mainland Dubai employers only — free zone employees follow a different process",
        "Your employer handles the Tasheel and Amer steps on your behalf",
        "No departure from the UAE required",
      ],
      supportingServices: [],
    },

    "r-employment-outside": {
      type: "guide",
      guideSlug: "employment-visa-dubai-outside-uae",
      keyFacts: [
        "Your employer starts the process in Dubai — you don't need to be in the UAE yet",
        "An entry permit is issued first; you travel to Dubai once it is ready",
        "Medical test, Emirates ID, and visa stamping all happen after arrival",
      ],
      supportingServices: [],
    },

    "r-golden-property": {
      type: "guide",
      guideSlug: "golden-visa-dubai-property",
      keyFacts: [
        "Property must be valued at AED 2M or above",
        "Both completed and off-plan properties may qualify",
        "DLD title deed or Oqood certificate is the primary document",
      ],
      supportingServices: [],
    },

    "r-hub-golden": {
      type: "hub",
      hubUrl: "/visas/golden",
      heading: "Golden Visa — Choose Your Route",
      body: "Routes include property ownership (AED 2M+), professional salary, company ownership, and qualifying professions. The property route guide is fully covered. Speak to us for other routes.",
      whatsapp: true,
    },

    "r-mainland": {
      type: "guide",
      guideSlug: "mainland-company-setup-dubai",
      keyFacts: [
        "Mainland companies can trade freely across the UAE",
        "Licensed by Dubai DED",
        "Some activities require a local service agent",
      ],
      supportingServices: ["pro-services-dubai"],
      supportingNote: "PRO services can handle your government filings:",
    },

    "r-freezone": {
      type: "guide",
      guideSlug: "free-zone-company-setup-dubai",
      keyFacts: [
        "100% foreign ownership in most free zones",
        "Activity is restricted to the zone or international trade",
        "Each free zone has its own authority and fee structure",
      ],
      supportingServices: ["pro-services-dubai"],
      supportingNote: "PRO services can handle your government filings:",
    },

    "r-bankaccount": {
      type: "guide",
      guideSlug: "open-business-bank-account-dubai",
      keyFacts: [
        "An active trade license is required before applying",
        "Document requirements vary by bank",
        "KYC process typically takes 2–6 weeks",
      ],
      supportingServices: [],
    },

    "r-hub-company": {
      type: "hub",
      hubUrl: "/company-setup",
      heading: "Company Setup in Dubai",
      body: "Three routes are covered: mainland company, free zone company, and business bank account. See the full comparison on the company setup page.",
      ctaLabel: "Compare Your Options →",
      whatsapp: false,
    },

    "r-advisor": {
      type: "advisor",
      heading: "We'll help you find the right route",
      body: "Describe your situation on WhatsApp and we'll identify the correct process, fees, and first step — usually within a few hours.",
      whatsapp: true,
    },
  },
};

// ---------------------------------------------------------------------------
// Russian config — parallel to EN, all strings translated
// ---------------------------------------------------------------------------

export const ROUTE_FINDER_CONFIG_RU: RouteFinderConfig = {
  startQuestion: "q1",
  whatsappHref: "https://wa.me/971506304817",

  questions: {
    q1: {
      id: "q1",
      text: "Что вам нужно оформить?",
      options: [
        { value: "family-new",   label: "Оформить визу для супруга или ребёнка",  sublabel: "Entry permit и residence visa",                 next: "q2-family-type" },
        { value: "family-renew", label: "Продлить семейную визу",                  sublabel: "Для супруга или ребёнка с действующей визой",   next: "r-renew"        },
        { value: "newborn",      label: "Зарегистрировать новорождённого в ОАЭ",   sublabel: "Регистрация рождения и первая residence visa",   next: "r-newborn"      },
        { value: "employment",   label: "Получить рабочую визу",                   sublabel: "Работодатель на материке Дубая",                next: "q2-emp-loc"     },
        { value: "golden",       label: "Получить Золотую визу",                   sublabel: "10-летнее резидентство ОАЭ",                    next: "q2-golden"      },
        { value: "company",      label: "Открыть компанию",                        sublabel: "Mainland, free zone или банковский счёт",        next: "q2-company"     },
        { value: "other",        label: "Другое или не уверен",                    sublabel: "Поможем найти правильный путь",                 next: "r-advisor"      },
      ],
    },

    "q2-family-type": {
      id: "q2-family-type",
      text: "Кого вы спонсируете?",
      options: [
        { value: "spouse", label: "Супруга или супругу", sublabel: "Муж или жена",                          next: "q3-location", contextKey: "familyType" },
        { value: "child",  label: "Ребёнка",             sublabel: "Сын, дочь или студент на иждивении",    next: "q3-location", contextKey: "familyType" },
      ],
    },

    "q3-location": {
      id: "q3-location",
      text: "Где они находятся сейчас?",
      options: [
        { value: "outside", label: "За пределами ОАЭ", sublabel: "Въедут в Дубай после одобрения",  next: "r-family-outside" },
        { value: "inside",  label: "В ОАЭ",            sublabel: "Смена статуса без выезда",         next: "r-family-inside"  },
      ],
    },

    "q2-emp-loc": {
      id: "q2-emp-loc",
      text: "Где вы находитесь сейчас?",
      options: [
        { value: "inside",  label: "Я в ОАЭ",            sublabel: "Выезд не нужен",      next: "r-employment-inside"  },
        { value: "outside", label: "Я за пределами ОАЭ", sublabel: "Подача из-за рубежа", next: "r-employment-outside" },
      ],
    },

    "q2-golden": {
      id: "q2-golden",
      text: "Как вы планируете получить Золотую визу?",
      options: [
        { value: "property",     label: "У меня недвижимость от AED 2M",      sublabel: "Готовая или строящаяся недвижимость",          next: "r-golden-property" },
        { value: "professional", label: "Я специалист или топ-менеджер",       sublabel: "На основе зарплаты, должности или инвестиций", next: "r-hub-golden"      },
        { value: "unsure",       label: "Не уверен, какой маршрут подходит",   sublabel: "Посмотреть все варианты Золотой визы",         next: "r-hub-golden"      },
      ],
    },

    "q2-company": {
      id: "q2-company",
      text: "Что вам нужно?",
      options: [
        { value: "mainland",    label: "Mainland компания",            sublabel: "Лицензия DED, торговля по всему ОАЭ",    next: "r-mainland"    },
        { value: "freezone",    label: "Компания в свободной зоне",    sublabel: "100% иностранное владение",               next: "r-freezone"    },
        { value: "bankaccount", label: "Открыть бизнес-счёт",         sublabel: "Требуется действующая торговая лицензия",  next: "r-bankaccount" },
        { value: "unsure",      label: "Не уверен, что нужно",        sublabel: "Посмотреть сравнение маршрутов",           next: "r-hub-company" },
      ],
    },
  },

  resolutions: {
    "r-family-outside": {
      type: "guide",
      contextSlugMap: {
        contextKey: "familyType",
        slugs: {
          spouse: "spouse-dependent-visa-dubai-outside-country",
          child:  "child-dependent-visa-dubai-outside-country",
        },
      },
      keyFacts: [
        "Член семьи въезжает в Дубай после одобрения entry permit",
        "Свидетельство о браке или рождении необходимо аттестовать до начала процесса",
        "Вы подаёте заявку на entry permit как спонсор",
      ],
      supportingServices: ["document-attestation-dubai"],
      supportingNote: "Аттестация документов необходима до начала процесса:",
    },

    "r-family-inside": {
      type: "guide",
      contextSlugMap: {
        contextKey: "familyType",
        slugs: {
          spouse: "spouse-dependent-visa-dubai-inside-country",
          child:  "child-dependent-visa-dubai-inside-country",
        },
      },
      keyFacts: [
        "Выезд не нужен: член семьи остаётся в ОАЭ",
        "Статус меняется внутри страны, entry permit не нужен",
        "Подача через сервисный центр Amer",
      ],
      supportingServices: ["amer-center-dubai"],
      supportingNote: "Подача через Amer:",
    },

    "r-renew": {
      type: "guide",
      guideSlug: "renew-family-visa-dubai",
      keyFacts: [
        "Подходит для продления визы супруга и ребёнка",
        "Лица от 18 лет обязаны пройти medical fitness test",
        "Дети до 18 лет освобождены от медосмотра",
      ],
      supportingServices: ["amer-center-dubai"],
      supportingNote: "Продление оформляется через Amer:",
    },

    "r-newborn": {
      type: "guide",
      guideSlug: "newborn-visa-dubai",
      keyFacts: [
        "Для детей, рождённых в ОАЭ",
        "Регистрация рождения, постановка на учёт в DHA и residence visa",
        "Подайте документы до 120 дней со дня рождения, чтобы избежать штрафов",
      ],
      supportingServices: [],
    },

    "r-employment-inside": {
      type: "guide",
      guideSlug: "employment-visa",
      keyFacts: [
        "Только для работодателей на материке Дубая: сотрудники free zone проходят другой процесс",
        "Работодатель выполняет шаги в Tasheel и Amer от вашего имени",
        "Выезд из ОАЭ не нужен",
      ],
      supportingServices: [],
    },

    "r-employment-outside": {
      type: "guide",
      guideSlug: "employment-visa-dubai-outside-uae",
      keyFacts: [
        "Работодатель начинает процесс в Дубае: ваше присутствие в ОАЭ не требуется",
        "Сначала оформляется entry permit, затем вы въезжаете в Дубай",
        "Медосмотр, Emirates ID и оформление визы проходят после приезда",
      ],
      supportingServices: [],
    },

    "r-golden-property": {
      type: "guide",
      guideSlug: "golden-visa-dubai-property",
      keyFacts: [
        "Стоимость недвижимости от AED 2M",
        "Подходит как готовая, так и строящаяся недвижимость",
        "Основной документ: DLD title deed или Oqood",
      ],
      supportingServices: [],
    },

    "r-hub-golden": {
      type: "hub",
      hubUrl: "/ru/visas/golden",
      heading: "Золотая виза: выберите маршрут",
      body: "Маршруты: через недвижимость (от AED 2M), профессиональный статус, владение компанией и признанные таланты. Гайд по маршруту через недвижимость готов. По другим маршрутам свяжитесь с нами.",
      whatsapp: true,
    },

    "r-mainland": {
      type: "guide",
      guideSlug: "mainland-company-setup-dubai",
      keyFacts: [
        "Mainland компании работают по всему ОАЭ без ограничений",
        "Лицензируется Dubai DED",
        "Некоторые виды деятельности требуют местного сервисного агента",
      ],
      supportingServices: ["pro-services-dubai"],
      supportingNote: "PRO услуги возьмут на себя подачу документов:",
    },

    "r-freezone": {
      type: "guide",
      guideSlug: "free-zone-company-setup-dubai",
      keyFacts: [
        "100% иностранное владение в большинстве свободных зон",
        "Деятельность ограничена зоной или международной торговлей",
        "У каждой зоны своя администрация и структура сборов",
      ],
      supportingServices: ["pro-services-dubai"],
      supportingNote: "PRO услуги возьмут на себя подачу документов:",
    },

    "r-bankaccount": {
      type: "guide",
      guideSlug: "open-business-bank-account-dubai",
      keyFacts: [
        "Для подачи нужна действующая торговая лицензия",
        "Требования к документам зависят от банка",
        "KYC-процесс обычно занимает 2–6 недель",
      ],
      supportingServices: [],
    },

    "r-hub-company": {
      type: "hub",
      hubUrl: "/ru/company-setup",
      heading: "Открытие компании в Дубае",
      body: "Три маршрута: mainland компания, компания в свободной зоне и бизнес-счёт. Полное сравнение на странице company setup.",
      ctaLabel: "Сравнить маршруты →",
      whatsapp: false,
    },

    "r-advisor": {
      type: "advisor",
      heading: "Поможем найти правильный маршрут",
      body: "Опишите вашу ситуацию в WhatsApp, и мы определим правильный процесс, сборы и первый шаг. Обычно отвечаем в течение нескольких часов.",
      whatsapp: true,
    },
  },
};

// ---------------------------------------------------------------------------
// Slugs pre-fetched server-side for the calculator
// ---------------------------------------------------------------------------

/** All guide slugs the calculator may reference. Pre-fetched at page load. */
export const CALCULATOR_GUIDE_SLUGS: string[] = [
  // Primary guide resolutions
  "spouse-dependent-visa-dubai-outside-country",
  "spouse-dependent-visa-dubai-inside-country",
  "child-dependent-visa-dubai-outside-country",
  "child-dependent-visa-dubai-inside-country",
  "renew-family-visa-dubai",
  "newborn-visa-dubai",
  "employment-visa",
  "employment-visa-dubai-outside-uae",
  "golden-visa-dubai-property",
  "mainland-company-setup-dubai",
  "free-zone-company-setup-dubai",
  "open-business-bank-account-dubai",
  // Supporting service injections (need title for display)
  "document-attestation-dubai",
  "amer-center-dubai",
  "pro-services-dubai",
];

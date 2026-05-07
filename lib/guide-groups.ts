export interface GuideVariant {
  slug:     string;
  label:    string;
  ruLabel?: string;
  routeKey: string;
}

export interface GuideGroupConfig {
  title:      string;
  ruTitle?:   string;
  summary:    string;
  ruSummary?: string;
  category:   string;
  variants:   GuideVariant[];
}

export const GUIDE_GROUPS: Record<string, GuideGroupConfig> = {
  "spouse-dependent-visa-dubai": {
    title:    "How to Sponsor a Spouse Residence Visa in Dubai",
    summary:
      "Compare inside-country and outside-country routes for sponsoring a spouse residence visa in Dubai. Includes full process, fees, and timelines.",
    category: "visas",
    variants: [
      {
        slug:     "spouse-dependent-visa-dubai-outside-country",
        label:    "Outside UAE",
        routeKey: "outside",
      },
      {
        slug:     "spouse-dependent-visa-dubai-inside-country",
        label:    "Inside UAE",
        routeKey: "inside",
      },
    ],
  },
  "child-dependent-visa-dubai": {
    title:     "How to Sponsor a Child Dependent Visa in Dubai",
    ruTitle:   "Виза ребёнку в Дубае: dependent visa внутри или из-за пределов ОАЭ",
    summary:
      "Step-by-step guide to sponsoring a child residence visa in Dubai. Two routes: outside the UAE (child travels in on a permit) and inside the UAE (change of status, no travel required).",
    ruSummary:
      "Выберите маршрут в зависимости от того, где сейчас находится ребёнок: за пределами ОАЭ или уже внутри страны. " +
      "Guidex помогает подготовить документы, подать заявку через правильный канал и завершить residence visa и Emirates ID.",
    category: "visas",
    variants: [
      {
        slug:     "child-dependent-visa-dubai-outside-country",
        label:    "Outside UAE",
        ruLabel:  "Из-за пределов ОАЭ",
        routeKey: "outside",
      },
      {
        slug:     "child-dependent-visa-dubai-inside-country",
        label:    "Inside UAE",
        ruLabel:  "Внутри ОАЭ",
        routeKey: "inside",
      },
    ],
  },
};

/**
 * Canonical group page URLs for each variant slug.
 * Used by RouteFinderFlow and guide lists to avoid redirect hops.
 */
export const GROUP_HREFS: Record<string, string> = Object.fromEntries(
  Object.entries(GUIDE_GROUPS).flatMap(([groupKey, group]) =>
    group.variants.map((v) => [
      v.slug,
      `/guides/${groupKey}?route=${v.routeKey}`,
    ])
  )
);

/**
 * Set of individual variant slugs that redirect to group pages.
 * Used to filter these slugs out of flat guide lists.
 */
export const REDIRECT_SLUGS = new Set(
  Object.values(GUIDE_GROUPS).flatMap((g) => g.variants.map((v) => v.slug))
);

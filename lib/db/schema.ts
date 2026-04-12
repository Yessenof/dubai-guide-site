import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const guides = sqliteTable("guides", {
  id:          text("id").primaryKey(),
  slug:        text("slug").unique().notNull(),
  category:    text("category").notNull(),
  published:   integer("published", { mode: "boolean" }).notNull().default(false),
  price:       text("price").notNull().default(""),
  timeline:    text("timeline").notNull().default(""),
  lastUpdated: text("last_updated").notNull().default(""),
  createdAt:   text("created_at").notNull(),
  updatedAt:   text("updated_at").notNull(),

  enTitle:    text("en_title").notNull().default(""),
  enSummary:  text("en_summary").notNull().default(""),
  enAudience: text("en_audience").notNull().default(""),
  enOverview: text("en_overview").notNull().default(""),

  ruTitle:    text("ru_title").notNull().default(""),
  ruSummary:  text("ru_summary").notNull().default(""),
  ruAudience: text("ru_audience").notNull().default(""),
  ruOverview: text("ru_overview").notNull().default(""),
});

export const steps = sqliteTable("steps", {
  id:        text("id").primaryKey(),
  guideId:   text("guide_id").notNull().references(() => guides.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(),
  cost:      text("cost").notNull().default(""),
  timeEst:   text("time_est").notNull().default(""),

  enTitle:   text("en_title").notNull().default(""),
  enWhat:    text("en_what").notNull().default(""),
  enWhere:   text("en_where").notNull().default(""),
  enAddress: text("en_address").notNull().default(""),
  enAdvice:  text("en_advice").notNull().default(""),
  enWarning: text("en_warning").notNull().default(""),

  ruTitle:   text("ru_title").notNull().default(""),
  ruWhat:    text("ru_what").notNull().default(""),
  ruWhere:   text("ru_where").notNull().default(""),
  ruAddress: text("ru_address").notNull().default(""),
  ruAdvice:  text("ru_advice").notNull().default(""),
  ruWarning: text("ru_warning").notNull().default(""),
});

export type Guide = typeof guides.$inferSelect;
export type Step  = typeof steps.$inferSelect;

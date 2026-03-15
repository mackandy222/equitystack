import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const executives = sqliteTable("executives", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  linkedin: text("linkedin"),
  title: text("title").notNull(), // e.g. "CFO", "CTO", "VP Marketing"
  bio: text("bio").notNull(),
  skills: text("skills").notNull(), // JSON array
  sectors: text("sectors").notNull(), // JSON array of preferred sectors
  yearsExperience: integer("years_experience").notNull(),
  currentRole: text("current_role"), // what they do now (if employed elsewhere)
  hoursPerMonth: integer("hours_per_month").default(20),
  minEquityBps: integer("min_equity_bps").default(25), // minimum equity in basis points
  maxEquityBps: integer("max_equity_bps").default(200),
  preferredStages: text("preferred_stages"), // JSON array of startup stages
  availableFrom: text("available_from"),
  status: text("status", {
    enum: ["active", "paused", "unavailable"],
  }).default("active"),
  vetted: integer("vetted", { mode: "boolean" }).default(false),
  rating: real("rating").default(0),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export type Executive = typeof executives.$inferSelect;
export type NewExecutive = typeof executives.$inferInsert;

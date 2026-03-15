import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const startups = sqliteTable("startups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stage: text("stage", {
    enum: [
      "pre_revenue",
      "early_revenue",
      "post_accelerator",
      "pre_seed",
      "seed",
    ],
  }).notNull(),
  accelerator: text("accelerator"),
  sector: text("sector").notNull(),
  website: text("website"),
  founderName: text("founder_name").notNull(),
  founderEmail: text("founder_email").notNull(),
  founderLinkedin: text("founder_linkedin"),
  teamSize: integer("team_size").default(1),
  monthlyRevenue: integer("monthly_revenue").default(0),
  fundingRaised: integer("funding_raised").default(0),
  pitchSummary: text("pitch_summary"),
  rolesNeeded: text("roles_needed"), // JSON array of role descriptions
  equityBudget: integer("equity_budget"), // basis points available (e.g. 500 = 5%)
  status: text("status", {
    enum: ["active", "paused", "closed"],
  }).default("active"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export type Startup = typeof startups.$inferSelect;
export type NewStartup = typeof startups.$inferInsert;

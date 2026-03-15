import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { startups } from "./startup";
import { executives } from "./executive";

export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  startupId: text("startup_id")
    .notNull()
    .references(() => startups.id),
  executiveId: text("executive_id")
    .notNull()
    .references(() => executives.id),
  role: text("role").notNull(), // the role being filled
  score: real("score").notNull(), // 0-100 compatibility score
  rationale: text("rationale").notNull(), // AI-generated explanation
  skillMatch: real("skill_match"), // sub-score
  sectorMatch: real("sector_match"), // sub-score
  stageMatch: real("stage_match"), // sub-score
  status: text("status", {
    enum: [
      "proposed",
      "startup_accepted",
      "executive_accepted",
      "both_accepted",
      "trial_active",
      "confirmed",
      "rejected",
      "expired",
    ],
  }).default("proposed"),
  startupNotes: text("startup_notes"),
  executiveNotes: text("executive_notes"),
  proposedAt: text("proposed_at").default("(datetime('now'))"),
  acceptedAt: text("accepted_at"),
  trialStartedAt: text("trial_started_at"),
  confirmedAt: text("confirmed_at"),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

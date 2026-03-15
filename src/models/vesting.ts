import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { matches } from "./match";

export const vestingSchedules = sqliteTable("vesting_schedules", {
  id: text("id").primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id),
  totalEquityBps: integer("total_equity_bps").notNull(), // total equity in basis points
  vestingPeriodWeeks: integer("vesting_period_weeks").default(60), // total vesting period
  trancheCount: integer("tranche_count").default(5), // number of tranches
  trancheIntervalWeeks: integer("tranche_interval_weeks").default(12), // weeks between tranches
  startDate: text("start_date").notNull(),
  status: text("status", {
    enum: ["pending", "active", "completed", "terminated"],
  }).default("pending"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

export const vestingTranches = sqliteTable("vesting_tranches", {
  id: text("id").primaryKey(),
  scheduleId: text("schedule_id")
    .notNull()
    .references(() => vestingSchedules.id),
  trancheNumber: integer("tranche_number").notNull(),
  equityBps: integer("equity_bps").notNull(), // equity for this tranche in basis points
  vestDate: text("vest_date").notNull(),
  status: text("status", {
    enum: ["pending", "vested", "forfeited"],
  }).default("pending"),
  vestedAt: text("vested_at"),
  certificateId: text("certificate_id"),
});

export type VestingSchedule = typeof vestingSchedules.$inferSelect;
export type VestingTranche = typeof vestingTranches.$inferSelect;

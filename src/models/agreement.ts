import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { matches } from "./match";

export const agreements = sqliteTable("agreements", {
  id: text("id").primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id),
  type: text("type", {
    enum: [
      "equity_grant",
      "consulting_agreement",
      "nda",
      "ip_assignment",
      "board_observer",
    ],
  }).notNull(),
  content: text("content").notNull(), // generated agreement text
  templateVersion: text("template_version").notNull(),
  status: text("status", {
    enum: ["draft", "sent", "signed_startup", "signed_executive", "executed", "voided"],
  }).default("draft"),
  startupSignedAt: text("startup_signed_at"),
  executiveSignedAt: text("executive_signed_at"),
  executedAt: text("executed_at"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

export type Agreement = typeof agreements.$inferSelect;
export type NewAgreement = typeof agreements.$inferInsert;

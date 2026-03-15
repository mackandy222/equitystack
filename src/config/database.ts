import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as startupSchema from "../models/startup";
import * as executiveSchema from "../models/executive";
import * as matchSchema from "../models/match";
import * as vestingSchema from "../models/vesting";
import * as agreementSchema from "../models/agreement";

const sqlite = new Database("equitystack.db");
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = ON;");

export const db = drizzle(sqlite, {
  schema: {
    ...startupSchema,
    ...executiveSchema,
    ...matchSchema,
    ...vestingSchema,
    ...agreementSchema,
  },
});

export { sqlite };

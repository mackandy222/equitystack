import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env";
import { startupsRouter } from "./api/startups/routes";
import { executivesRouter } from "./api/executives/routes";
import { matchesRouter } from "./api/matches/routes";
import { vestingRouter } from "./api/vesting/routes";
import { agreementsRouter } from "./api/agreements/routes";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/", (c) =>
  c.json({
    name: "equitystack",
    version: "0.1.0",
    status: "running",
  })
);

// API routes
app.route("/api/startups", startupsRouter);
app.route("/api/executives", executivesRouter);
app.route("/api/matches", matchesRouter);
app.route("/api/vesting", vestingRouter);
app.route("/api/agreements", agreementsRouter);

console.log(`EquityStack API running on http://localhost:${env.PORT}`);

export default {
  port: env.PORT,
  fetch: app.fetch,
};

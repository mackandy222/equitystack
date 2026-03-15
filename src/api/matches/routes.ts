import { Hono } from "hono";
import { db } from "../../config/database";
import { matches } from "../../models/match";
import { eq } from "drizzle-orm";
import { MatchingEngine } from "../../services/matching/engine";

export const matchesRouter = new Hono();

// List all matches
matchesRouter.get("/", async (c) => {
  const results = await db.select().from(matches);
  return c.json(results);
});

// Get matches for a startup
matchesRouter.get("/startup/:startupId", async (c) => {
  const startupId = c.req.param("startupId");
  const results = await db
    .select()
    .from(matches)
    .where(eq(matches.startupId, startupId));
  return c.json(results);
});

// Get matches for an executive
matchesRouter.get("/executive/:executiveId", async (c) => {
  const executiveId = c.req.param("executiveId");
  const results = await db
    .select()
    .from(matches)
    .where(eq(matches.executiveId, executiveId));
  return c.json(results);
});

// Generate matches for a startup
matchesRouter.post("/generate/:startupId", async (c) => {
  const startupId = c.req.param("startupId");
  const body = await c.req.json().catch(() => ({}));
  const role = body.role || "general";
  const limit = body.limit || 5;

  const engine = new MatchingEngine();
  const newMatches = await engine.generateMatches(startupId, role, limit);

  return c.json(newMatches, 201);
});

// Update match status (accept/reject)
matchesRouter.patch("/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status, notes, side } = await c.req.json();

  const updateData: Record<string, string> = { status };
  if (side === "startup" && notes) updateData.startupNotes = notes;
  if (side === "executive" && notes) updateData.executiveNotes = notes;
  if (status === "both_accepted") updateData.acceptedAt = new Date().toISOString();
  if (status === "trial_active") updateData.trialStartedAt = new Date().toISOString();
  if (status === "confirmed") updateData.confirmedAt = new Date().toISOString();

  await db.update(matches).set(updateData).where(eq(matches.id, id));

  return c.json({ id, ...updateData });
});

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../../config/database";
import { startups } from "../../models/startup";
import { eq } from "drizzle-orm";
import { newId } from "../../lib/id";

export const startupsRouter = new Hono();

const createStartupSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  stage: z.enum([
    "pre_revenue",
    "early_revenue",
    "post_accelerator",
    "pre_seed",
    "seed",
  ]),
  accelerator: z.string().optional(),
  sector: z.string().min(1),
  website: z.string().url().optional(),
  founderName: z.string().min(1),
  founderEmail: z.string().email(),
  founderLinkedin: z.string().optional(),
  teamSize: z.number().int().positive().optional(),
  monthlyRevenue: z.number().int().min(0).optional(),
  fundingRaised: z.number().int().min(0).optional(),
  pitchSummary: z.string().optional(),
  rolesNeeded: z.array(z.string()).optional(),
  equityBudget: z.number().int().min(0).max(10000).optional(),
});

// List all startups
startupsRouter.get("/", async (c) => {
  const results = await db.select().from(startups);
  return c.json(results);
});

// Get a single startup
startupsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(startups).where(eq(startups.id, id));
  if (result.length === 0) return c.json({ error: "Startup not found" }, 404);
  return c.json(result[0]);
});

// Create a startup
startupsRouter.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createStartupSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

  const data = parsed.data;
  const id = newId();

  await db.insert(startups).values({
    id,
    ...data,
    rolesNeeded: data.rolesNeeded ? JSON.stringify(data.rolesNeeded) : null,
  });

  return c.json({ id, ...data }, 201);
});

// Update a startup
startupsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  await db
    .update(startups)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(startups.id, id));

  return c.json({ id, ...body });
});

// Delete a startup
startupsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(startups).where(eq(startups.id, id));
  return c.json({ deleted: true });
});

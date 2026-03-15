import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../config/database";
import { executives } from "../../models/executive";
import { eq } from "drizzle-orm";
import { newId } from "../../lib/id";

export const executivesRouter = new Hono();

const createExecutiveSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  linkedin: z.string().optional(),
  title: z.string().min(1),
  bio: z.string().min(10),
  skills: z.array(z.string()),
  sectors: z.array(z.string()),
  yearsExperience: z.number().int().positive(),
  currentRole: z.string().optional(),
  hoursPerMonth: z.number().int().min(5).max(160).optional(),
  minEquityBps: z.number().int().min(1).optional(),
  maxEquityBps: z.number().int().max(5000).optional(),
  preferredStages: z.array(z.string()).optional(),
  availableFrom: z.string().optional(),
});

// List all executives
executivesRouter.get("/", async (c) => {
  const results = await db.select().from(executives);
  return c.json(results);
});

// Get a single executive
executivesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db
    .select()
    .from(executives)
    .where(eq(executives.id, id));
  if (result.length === 0)
    return c.json({ error: "Executive not found" }, 404);
  return c.json(result[0]);
});

// Create an executive
executivesRouter.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createExecutiveSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

  const data = parsed.data;
  const id = newId();

  await db.insert(executives).values({
    id,
    ...data,
    skills: JSON.stringify(data.skills),
    sectors: JSON.stringify(data.sectors),
    preferredStages: data.preferredStages
      ? JSON.stringify(data.preferredStages)
      : null,
  });

  return c.json({ id, ...data }, 201);
});

// Update an executive
executivesRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  await db
    .update(executives)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(executives.id, id));

  return c.json({ id, ...body });
});

// Delete an executive
executivesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(executives).where(eq(executives.id, id));
  return c.json({ deleted: true });
});

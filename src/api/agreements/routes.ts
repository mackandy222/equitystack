import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../config/database";
import { agreements } from "../../models/agreement";
import { eq } from "drizzle-orm";
import { AgreementService } from "../../services/legal/agreements";

export const agreementsRouter = new Hono();

// Get agreements for a match
agreementsRouter.get("/match/:matchId", async (c) => {
  const matchId = c.req.param("matchId");
  const results = await db
    .select()
    .from(agreements)
    .where(eq(agreements.matchId, matchId));
  return c.json(results);
});

// Generate agreement for a match
agreementsRouter.post("/generate", async (c) => {
  const body = await c.req.json();
  const { matchId, type } = body;

  if (!matchId || !type)
    return c.json({ error: "matchId and type are required" }, 400);

  const service = new AgreementService();
  const agreement = await service.generateAgreement(matchId, type);

  return c.json(agreement, 201);
});

// Sign an agreement
agreementsRouter.post("/:id/sign", async (c) => {
  const id = c.req.param("id");
  const { side } = await c.req.json();

  if (side !== "startup" && side !== "executive")
    return c.json({ error: "side must be 'startup' or 'executive'" }, 400);

  const now = new Date().toISOString();
  const updateData: Record<string, string> =
    side === "startup"
      ? { status: "signed_startup", startupSignedAt: now }
      : { status: "signed_executive", executiveSignedAt: now };

  // Check if both sides have signed
  const existing = await db
    .select()
    .from(agreements)
    .where(eq(agreements.id, id));
  if (existing.length === 0)
    return c.json({ error: "Agreement not found" }, 404);

  const agreement = existing[0];
  if (
    (side === "startup" && agreement.executiveSignedAt) ||
    (side === "executive" && agreement.startupSignedAt)
  ) {
    updateData.status = "executed";
    updateData.executedAt = now;
  }

  await db.update(agreements).set(updateData).where(eq(agreements.id, id));

  return c.json({ id, ...updateData });
});

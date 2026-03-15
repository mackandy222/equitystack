import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../config/database";
import { vestingSchedules, vestingTranches } from "../../models/vesting";
import { eq } from "drizzle-orm";
import { VestingService } from "../../services/equity/vesting";

export const vestingRouter = new Hono();

const createVestingSchema = z.object({
  matchId: z.string(),
  totalEquityBps: z.number().int().min(1).max(5000),
  vestingPeriodWeeks: z.number().int().min(12).max(260).default(60),
  trancheCount: z.number().int().min(1).max(20).default(5),
  trancheIntervalWeeks: z.number().int().min(4).max(52).default(12),
  startDate: z.string(),
});

// Get vesting schedule for a match
vestingRouter.get("/match/:matchId", async (c) => {
  const matchId = c.req.param("matchId");
  const schedule = await db
    .select()
    .from(vestingSchedules)
    .where(eq(vestingSchedules.matchId, matchId));

  if (schedule.length === 0)
    return c.json({ error: "No vesting schedule found" }, 404);

  const tranches = await db
    .select()
    .from(vestingTranches)
    .where(eq(vestingTranches.scheduleId, schedule[0].id));

  return c.json({ schedule: schedule[0], tranches });
});

// Create a vesting schedule
vestingRouter.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createVestingSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

  const service = new VestingService();
  const result = await service.createSchedule(parsed.data);

  return c.json(result, 201);
});

// Vest a tranche (mark as vested)
vestingRouter.post("/tranches/:id/vest", async (c) => {
  const id = c.req.param("id");
  const service = new VestingService();
  const result = await service.vestTranche(id);
  return c.json(result);
});

// Terminate a vesting schedule
vestingRouter.post("/:id/terminate", async (c) => {
  const id = c.req.param("id");
  const service = new VestingService();
  const result = await service.terminateSchedule(id);
  return c.json(result);
});

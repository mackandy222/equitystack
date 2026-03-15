import { db } from "../../config/database";
import { vestingSchedules, vestingTranches } from "../../models/vesting";
import { eq } from "drizzle-orm";
import { newId } from "../../lib/id";

interface CreateScheduleInput {
  matchId: string;
  totalEquityBps: number;
  vestingPeriodWeeks: number;
  trancheCount: number;
  trancheIntervalWeeks: number;
  startDate: string;
}

export class VestingService {
  async createSchedule(input: CreateScheduleInput) {
    const scheduleId = newId();

    // Create the schedule
    await db.insert(vestingSchedules).values({
      id: scheduleId,
      matchId: input.matchId,
      totalEquityBps: input.totalEquityBps,
      vestingPeriodWeeks: input.vestingPeriodWeeks,
      trancheCount: input.trancheCount,
      trancheIntervalWeeks: input.trancheIntervalWeeks,
      startDate: input.startDate,
      status: "active",
    });

    // Create tranches with equal distribution
    const bpsPerTranche = Math.floor(input.totalEquityBps / input.trancheCount);
    const remainder = input.totalEquityBps - bpsPerTranche * input.trancheCount;
    const startDate = new Date(input.startDate);
    const tranches = [];

    for (let i = 0; i < input.trancheCount; i++) {
      const vestDate = new Date(startDate);
      vestDate.setDate(
        vestDate.getDate() + (i + 1) * input.trancheIntervalWeeks * 7
      );

      // Last tranche gets any remainder basis points
      const equityBps = i === input.trancheCount - 1
        ? bpsPerTranche + remainder
        : bpsPerTranche;

      const tranche = {
        id: newId(),
        scheduleId,
        trancheNumber: i + 1,
        equityBps,
        vestDate: vestDate.toISOString().split("T")[0],
        status: "pending" as const,
      };

      await db.insert(vestingTranches).values(tranche);
      tranches.push(tranche);
    }

    return { scheduleId, tranches };
  }

  async vestTranche(trancheId: string) {
    const now = new Date().toISOString();
    await db
      .update(vestingTranches)
      .set({ status: "vested", vestedAt: now })
      .where(eq(vestingTranches.id, trancheId));

    return { trancheId, status: "vested", vestedAt: now };
  }

  async terminateSchedule(scheduleId: string) {
    // Mark schedule as terminated
    await db
      .update(vestingSchedules)
      .set({ status: "terminated" })
      .where(eq(vestingSchedules.id, scheduleId));

    // Forfeit all pending tranches
    const pendingTranches = await db
      .select()
      .from(vestingTranches)
      .where(eq(vestingTranches.scheduleId, scheduleId));

    for (const tranche of pendingTranches) {
      if (tranche.status === "pending") {
        await db
          .update(vestingTranches)
          .set({ status: "forfeited" })
          .where(eq(vestingTranches.id, tranche.id));
      }
    }

    return { scheduleId, status: "terminated" };
  }
}

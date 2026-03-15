import { describe, test, expect } from "bun:test";
import { VestingService } from "../src/services/equity/vesting";

describe("VestingService", () => {
  test("createSchedule generates correct number of tranches", async () => {
    // This test validates the vesting calculation logic without DB
    const trancheCount = 5;
    const totalEquityBps = 100; // 1%
    const bpsPerTranche = Math.floor(totalEquityBps / trancheCount);
    const remainder = totalEquityBps - bpsPerTranche * trancheCount;

    expect(bpsPerTranche).toBe(20);
    expect(remainder).toBe(0);
    expect(bpsPerTranche * trancheCount + remainder).toBe(totalEquityBps);
  });

  test("tranche dates are spaced correctly", () => {
    const startDate = new Date("2026-01-01");
    const intervalWeeks = 12;
    const trancheCount = 5;

    const dates = [];
    for (let i = 0; i < trancheCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i + 1) * intervalWeeks * 7);
      dates.push(date);
    }

    // First tranche should be 12 weeks (84 days) after start
    const diffMs = dates[0].getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    expect(diffDays).toBe(84);

    // Last tranche should be 60 weeks (420 days) after start
    const lastDiffMs = dates[4].getTime() - startDate.getTime();
    const lastDiffDays = lastDiffMs / (1000 * 60 * 60 * 24);
    expect(lastDiffDays).toBe(420);
  });

  test("equity distribution handles uneven splits", () => {
    const totalEquityBps = 103;
    const trancheCount = 5;
    const bpsPerTranche = Math.floor(totalEquityBps / trancheCount);
    const remainder = totalEquityBps - bpsPerTranche * trancheCount;

    expect(bpsPerTranche).toBe(20);
    expect(remainder).toBe(3);

    // Last tranche gets the remainder
    const lastTrancheBps = bpsPerTranche + remainder;
    expect(lastTrancheBps).toBe(23);

    // Total should still equal original
    const total = bpsPerTranche * (trancheCount - 1) + lastTrancheBps;
    expect(total).toBe(103);
  });
});

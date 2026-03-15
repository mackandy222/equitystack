import { describe, test, expect } from "bun:test";
import { AccountingService } from "../src/services/accounting/treatment";

describe("AccountingService", () => {
  test("generates guidance with correct fair value", () => {
    const service = new AccountingService();
    const guidance = service.generateGuidance({
      equityBps: 100, // 1%
      vestingPeriodWeeks: 60,
      trancheCount: 5,
      startDate: "2026-01-01",
      estimatedCompanyValue: 1000000,
    });

    // 1% of £1M = £10,000
    expect(guidance.startupTreatment).toContain("10000.00");
    expect(guidance.executiveTreatment).toContain("10000.00");
    expect(guidance.keyDates).toHaveLength(5);
    expect(guidance.warnings.length).toBeGreaterThan(0);
  });

  test("generates correct number of key dates", () => {
    const service = new AccountingService();
    const guidance = service.generateGuidance({
      equityBps: 50,
      vestingPeriodWeeks: 48,
      trancheCount: 4,
      startDate: "2026-03-01",
      estimatedCompanyValue: 500000,
    });

    expect(guidance.keyDates).toHaveLength(4);
    expect(guidance.keyDates[0].event).toBe("Tranche 1 vests");
    expect(guidance.keyDates[3].event).toBe("Tranche 4 vests");
  });
});

/**
 * Accounting treatment guidance for equity-for-services arrangements.
 *
 * This module provides automated accounting guidance for both startups
 * and executives involved in equity-for-services arrangements.
 *
 * Key considerations:
 * - IFRS 2 / FRS 102 share-based payment accounting for startups
 * - Income recognition timing for executives
 * - Fair value estimation at grant date
 * - Expense recognition over vesting period
 */

interface AccountingGuidance {
  startupTreatment: string;
  executiveTreatment: string;
  keyDates: { event: string; date: string; action: string }[];
  warnings: string[];
}

export class AccountingService {
  /**
   * Generate accounting guidance for an equity-for-services arrangement.
   */
  generateGuidance(params: {
    equityBps: number;
    vestingPeriodWeeks: number;
    trancheCount: number;
    startDate: string;
    estimatedCompanyValue: number;
  }): AccountingGuidance {
    const equityPercent = params.equityBps / 100;
    const fairValue =
      (params.estimatedCompanyValue * params.equityBps) / 10000;
    const expensePerTranche = fairValue / params.trancheCount;

    const keyDates = [];
    const startDate = new Date(params.startDate);
    const intervalWeeks = params.vestingPeriodWeeks / params.trancheCount;

    for (let i = 0; i < params.trancheCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (i + 1) * intervalWeeks * 7);
      keyDates.push({
        event: `Tranche ${i + 1} vests`,
        date: date.toISOString().split("T")[0],
        action: `Recognise expense of £${expensePerTranche.toFixed(2)} and credit equity reserve`,
      });
    }

    return {
      startupTreatment: `
SHARE-BASED PAYMENT (FRS 102 Section 26 / IFRS 2)

Grant date fair value: £${fairValue.toFixed(2)} (${equityPercent.toFixed(2)}% of estimated £${params.estimatedCompanyValue.toLocaleString()} valuation)

Recognition:
- Recognise total expense of £${fairValue.toFixed(2)} over the ${params.vestingPeriodWeeks}-week vesting period
- Each tranche: Dr Staff Costs £${expensePerTranche.toFixed(2)} / Cr Equity Reserve £${expensePerTranche.toFixed(2)}
- Expense is recognised as services are received, not when shares vest
- If engagement is terminated early, reverse unrecognised expense

Notes:
- Fair value should be estimated using an appropriate valuation method
- For early-stage companies, recent funding round price or independent valuation
- Disclose in notes to accounts: number of arrangements, terms, fair value method
      `.trim(),

      executiveTreatment: `
INCOME TAX TREATMENT (UK — seek specific advice for other jurisdictions)

Potential tax events:
1. GRANT DATE: If shares have existing value, potential income tax charge on acquisition
2. VESTING DATE: If restrictions are lifted, potential income tax on value at vesting
3. DISPOSAL: Capital gains tax on disposal (sale, company exit, etc.)

EMI Scheme (if eligible):
- No income tax on grant or exercise if at market value
- Preferential 10% CGT rate on disposal (Business Asset Disposal Relief)
- Company should consider whether EMI scheme applies

Section 431 Election:
- Consider filing within 14 days of share acquisition
- Elects to pay income tax on unrestricted market value at grant
- For early-stage companies this is often minimal
- Avoids potentially higher income tax charge at vesting/disposal

Estimated values (based on current valuation):
- Value per tranche: £${expensePerTranche.toFixed(2)}
- Total value: £${fairValue.toFixed(2)}

IMPORTANT: This is guidance only. Both parties should seek professional tax advice.
      `.trim(),

      keyDates,

      warnings: [
        "Fair value estimation is critical — get a professional valuation if possible",
        "EMI scheme eligibility should be checked (company size, independence, etc.)",
        "Section 431 election must be filed within 14 days of share acquisition",
        "Different tax treatment may apply in Scotland / other jurisdictions",
        "National Insurance may also be due — check employer and employee NI obligations",
      ],
    };
  }
}

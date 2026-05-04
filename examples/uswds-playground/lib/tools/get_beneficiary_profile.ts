import { tool } from "ai";
import { z } from "zod";

const PROFILE = {
  beneficiaryId: "DEMO-0001",
  displayName: "Sample Beneficiary",
  age: 68,
  medicareNumber: "DEMO-1A2B-3C4",
  state: "Oregon",
  zipCode: "97201",
  entitlements: {
    partA: { enrolled: true, effectiveDate: "2023-05-01", monthlyPremium: 0 },
    partB: { enrolled: true, effectiveDate: "2023-05-01", monthlyPremium: 185 },
    partD: { enrolled: true, effectiveDate: "2024-01-01" },
  },
  currentEnrollment: {
    planId: "H1234-002",
    planName: "Pioneer Value HMO",
    planType: "MA-PD",
    organization: "Pioneer Health",
    effectiveDate: "2024-01-01",
    renewalStatus: "renewing" as const,
  },
  subsidies: {
    lisStatus: "none" as const,
    lisLevel: null as number | null,
    medicaidStatus: "none" as const,
    extraHelpEligible: false,
  },
  otherHealthInsurance: [] as Array<{ type: "VA" | "TRICARE" | "employer" | "retiree"; name: string }>,
  deductiblesYTD: {
    partAMet: 0,
    partBMet: 260,
    drugDeductibleMet: 100,
  },
  dataSource: "demo",
  disclaimer: "Fictional sample beneficiary. No PHI. Not connected to a live BEDAP environment.",
};

export const get_beneficiary_profile = tool({
  description:
    "Return the signed-in beneficiary's demographic summary, current Part A/B/D enrollments, plan details, LIS and Medicaid status, and year-to-date deductibles met. Use as the starting point for questions about 'my coverage' or 'my plan'. Demo data only.",
  inputSchema: z.object({
    beneficiaryId: z.string().nullish(),
    includeDeductibles: z.boolean().nullish(),
  }),
  execute: async ({ beneficiaryId, includeDeductibles }) => {
    const base = {
      ...PROFILE,
      beneficiaryId: beneficiaryId ?? PROFILE.beneficiaryId,
    };
    if (includeDeductibles === false) {
      const { deductiblesYTD: _, ...rest } = base;
      return rest;
    }
    return base;
  },
});

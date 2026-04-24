import { tool } from "ai";
import { z } from "zod";

type PhaseCost = {
  phase: "deductible" | "initial" | "coverage_gap" | "catastrophic";
  copay: number;
  coinsurancePct: number;
  beneficiaryMonthlyCost: number;
};

type DrugCost = {
  drugName: string;
  ndc?: string;
  tier: 1 | 2 | 3 | 4 | 5;
  covered: boolean;
  monthlySupplyCost: number;
  annualCost: number;
  restrictions: Array<"prior_authorization" | "step_therapy" | "quantity_limit">;
  phases: PhaseCost[];
};

const DRUG_PRICING: Record<string, { tier: 1 | 2 | 3 | 4 | 5; monthlyRetail: number; restrictions: DrugCost["restrictions"] }> = {
  lisinopril: { tier: 1, monthlyRetail: 8, restrictions: [] },
  atorvastatin: { tier: 1, monthlyRetail: 10, restrictions: [] },
  eliquis: { tier: 3, monthlyRetail: 594, restrictions: [] },
  apixaban: { tier: 3, monthlyRetail: 594, restrictions: [] },
  jardiance: { tier: 3, monthlyRetail: 612, restrictions: ["step_therapy"] },
  empagliflozin: { tier: 3, monthlyRetail: 612, restrictions: ["step_therapy"] },
  ozempic: { tier: 4, monthlyRetail: 998, restrictions: ["prior_authorization", "step_therapy", "quantity_limit"] },
  semaglutide: { tier: 4, monthlyRetail: 998, restrictions: ["prior_authorization", "step_therapy", "quantity_limit"] },
  gabapentin: { tier: 1, monthlyRetail: 12, restrictions: [] },
  vytorin: { tier: 3, monthlyRetail: 410, restrictions: ["step_therapy"] },
};

const PLAN_PARAMS: Record<string, { drugDeductible: number; tierCopays: Record<1 | 2 | 3 | 4 | 5, number>; gapCoveragePct: number }> = {
  "H1234-001": { drugDeductible: 0, tierCopays: { 1: 0, 2: 5, 3: 45, 4: 90, 5: 280 }, gapCoveragePct: 0.25 },
  "H1234-002": { drugDeductible: 100, tierCopays: { 1: 3, 2: 10, 3: 47, 4: 100, 5: 300 }, gapCoveragePct: 0.25 },
  "H9876-010": { drugDeductible: 0, tierCopays: { 1: 0, 2: 3, 3: 42, 4: 85, 5: 250 }, gapCoveragePct: 0.25 },
  "S5555-020": { drugDeductible: 545, tierCopays: { 1: 0, 2: 4, 3: 47, 4: 100, 5: 310 }, gapCoveragePct: 0.25 },
  "S5555-021": { drugDeductible: 0, tierCopays: { 1: 2, 2: 8, 3: 47, 4: 100, 5: 300 }, gapCoveragePct: 0.25 },
  "H2222-050": { drugDeductible: 0, tierCopays: { 1: 0, 2: 0, 3: 20, 4: 75, 5: 100 }, gapCoveragePct: 0.25 },
};

const DEFAULT_PLAN = PLAN_PARAMS["H1234-002"]!;

function costForDrug(drug: string, planId: string): DrugCost {
  const key = drug.toLowerCase().trim();
  const pricing = DRUG_PRICING[key];
  const plan = PLAN_PARAMS[planId] ?? DEFAULT_PLAN;
  if (!pricing) {
    return {
      drugName: drug,
      tier: 3,
      covered: false,
      monthlySupplyCost: 0,
      annualCost: 0,
      restrictions: [],
      phases: [],
    };
  }
  const deductibleCost = Math.min(pricing.monthlyRetail, plan.drugDeductible);
  const initialCopay = plan.tierCopays[pricing.tier];
  const gapCost = pricing.monthlyRetail * plan.gapCoveragePct;
  const catastrophicCost = 0;
  const monthlyCost = initialCopay;

  return {
    drugName: drug,
    tier: pricing.tier,
    covered: true,
    monthlySupplyCost: Math.round(monthlyCost * 100) / 100,
    annualCost: Math.round(monthlyCost * 12 * 100) / 100,
    restrictions: pricing.restrictions,
    phases: [
      {
        phase: "deductible",
        copay: Math.round(deductibleCost * 100) / 100,
        coinsurancePct: 100,
        beneficiaryMonthlyCost: Math.round(deductibleCost * 100) / 100,
      },
      {
        phase: "initial",
        copay: initialCopay,
        coinsurancePct: 0,
        beneficiaryMonthlyCost: initialCopay,
      },
      {
        phase: "coverage_gap",
        copay: 0,
        coinsurancePct: plan.gapCoveragePct * 100,
        beneficiaryMonthlyCost: Math.round(gapCost * 100) / 100,
      },
      {
        phase: "catastrophic",
        copay: catastrophicCost,
        coinsurancePct: 0,
        beneficiaryMonthlyCost: catastrophicCost,
      },
    ],
  };
}

export const calculate_drug_costs = tool({
  description:
    "Estimate beneficiary out-of-pocket drug costs for a plan and drug list. Returns per-drug tier, monthly and annual costs, utilization restrictions, and the four Part D payment phases (deductible / initial / coverage gap / catastrophic). Pass a planId from search_medicare_plans to price against a specific plan.",
  inputSchema: z.object({
    planId: z.string().describe("Plan contract-plan ID returned by search_medicare_plans."),
    drugs: z.array(z.string()).describe("Brand or generic drug names to price."),
    monthlyDoses: z.number().nullish().describe("Optional monthly dose count override (default 1 per drug)."),
  }),
  execute: async ({ planId, drugs }) => {
    const breakdown = drugs.map((d) => costForDrug(d, planId));
    const annualTotal = breakdown.reduce((sum, b) => sum + b.annualCost, 0);
    const monthlyTotal = breakdown.reduce((sum, b) => sum + b.monthlySupplyCost, 0);
    const annualCatastrophicCap = 2000;
    return {
      planId,
      drugCount: drugs.length,
      estimatedMonthlyOutOfPocket: Math.round(monthlyTotal * 100) / 100,
      estimatedAnnualOutOfPocket: Math.min(Math.round(annualTotal * 100) / 100, annualCatastrophicCap),
      catastrophicCap: annualCatastrophicCap,
      perDrug: breakdown,
      disclaimer:
        "Estimates assume a 30-day supply at preferred pharmacy retail and no Extra Help. Actual costs depend on pharmacy network, refill history, and current payment phase.",
    };
  },
});

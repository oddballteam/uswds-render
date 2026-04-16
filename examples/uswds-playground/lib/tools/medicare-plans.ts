import { tool } from "ai";
import { z } from "zod";

const CATALOG: Record<string, {
  name: string;
  monthlyPremium: string;
  deductible: string;
  copay: string;
  prescriptionCoverage: boolean;
  dentalVision: boolean;
  maxOutOfPocket: string;
}> = {
  original: {
    name: "Original Medicare (Part A & B)",
    monthlyPremium: "$174.70",
    deductible: "$257/year",
    copay: "20% after deductible",
    prescriptionCoverage: false,
    dentalVision: false,
    maxOutOfPocket: "No limit",
  },
  "plan-g": {
    name: "Medicare Plan G",
    monthlyPremium: "$145.00",
    deductible: "$257/year (Part B only)",
    copay: "$0 after deductible",
    prescriptionCoverage: false,
    dentalVision: false,
    maxOutOfPocket: "$257/year",
  },
  "plan-n": {
    name: "Medicare Plan N",
    monthlyPremium: "$115.00",
    deductible: "$257/year (Part B only)",
    copay: "$20 office / $50 ER",
    prescriptionCoverage: false,
    dentalVision: false,
    maxOutOfPocket: "$257/year + copays",
  },
  advantage: {
    name: "Medicare Advantage (Part C)",
    monthlyPremium: "$35.00",
    deductible: "$0",
    copay: "$10 primary / $45 specialist",
    prescriptionCoverage: true,
    dentalVision: true,
    maxOutOfPocket: "$4,900/year",
  },
};

function resolve(query: string) {
  const q = query.toLowerCase();
  if (q.includes("original") || q === "a" || q === "b" || q.includes("part a") || q.includes("part b")) return CATALOG.original;
  if (q.includes("plan g") || q === "g") return CATALOG["plan-g"];
  if (q.includes("plan n") || q === "n") return CATALOG["plan-n"];
  if (q.includes("advantage") || q.includes("part c")) return CATALOG.advantage;
  return CATALOG.original;
}

export const compareMedicarePlans = tool({
  description:
    "Compare two Medicare plans side by side. Accepts plan names like 'Original Medicare', 'Plan G', 'Plan N', 'Medicare Advantage'.",
  inputSchema: z.object({
    currentPlan: z.string(),
    compareTo: z.string(),
  }),
  execute: async ({ currentPlan, compareTo }) => {
    return {
      plans: [resolve(currentPlan), resolve(compareTo)],
    };
  },
});

import { tool } from "ai";
import { z } from "zod";

type Plan = {
  planId: string;
  name: string;
  organization: string;
  planType: "MA" | "MA-PD" | "PDP" | "C-SNP" | "D-SNP";
  networkType: "HMO" | "PPO" | "PDP";
  premium: number;
  medicalDeductible: number;
  drugDeductible: number;
  maxOutOfPocket: number;
  starRating: number;
  supplementalBenefits: {
    dental: boolean;
    vision: boolean;
    hearing: boolean;
    silverSneakers: boolean;
    transportation: boolean;
    mealDelivery: boolean;
  };
  formularyTiers: number;
  preferredPharmacy: string[];
  fipsCodes: string[];
  snpType?: "C-SNP" | "D-SNP";
  highlights: string[];
};

const PLANS: Plan[] = [
  {
    planId: "H1234-001",
    name: "Pioneer Advantage Choice (PPO)",
    organization: "Pioneer Health",
    planType: "MA-PD",
    networkType: "PPO",
    premium: 0,
    medicalDeductible: 0,
    drugDeductible: 0,
    maxOutOfPocket: 4900,
    starRating: 4.5,
    supplementalBenefits: {
      dental: true,
      vision: true,
      hearing: true,
      silverSneakers: true,
      transportation: false,
      mealDelivery: true,
    },
    formularyTiers: 5,
    preferredPharmacy: ["CVS", "Walgreens"],
    fipsCodes: ["06037", "41051", "36061"],
    highlights: [
      "$0 monthly premium",
      "Includes Part D",
      "$0 primary care copay",
    ],
  },
  {
    planId: "H1234-002",
    name: "Pioneer Value HMO",
    organization: "Pioneer Health",
    planType: "MA-PD",
    networkType: "HMO",
    premium: 19,
    medicalDeductible: 0,
    drugDeductible: 100,
    maxOutOfPocket: 3900,
    starRating: 4.0,
    supplementalBenefits: {
      dental: true,
      vision: true,
      hearing: true,
      silverSneakers: true,
      transportation: true,
      mealDelivery: false,
    },
    formularyTiers: 5,
    preferredPharmacy: ["Walgreens"],
    fipsCodes: ["06037", "41051", "17031"],
    highlights: [
      "Low max out-of-pocket",
      "Transportation to medical appointments",
      "Routine dental, vision, hearing included",
    ],
  },
  {
    planId: "H9876-010",
    name: "Golden Eagle PPO 5-Star",
    organization: "Golden Eagle",
    planType: "MA-PD",
    networkType: "PPO",
    premium: 42,
    medicalDeductible: 250,
    drugDeductible: 0,
    maxOutOfPocket: 5500,
    starRating: 5.0,
    supplementalBenefits: {
      dental: true,
      vision: true,
      hearing: true,
      silverSneakers: true,
      transportation: true,
      mealDelivery: true,
    },
    formularyTiers: 6,
    preferredPharmacy: ["CVS", "Rite Aid", "Mail Order"],
    fipsCodes: ["06037", "41051", "33101", "48453"],
    highlights: [
      "5-star CMS rating",
      "Qualifies for year-round enrollment",
      "Premium dental + vision allowance",
    ],
  },
  {
    planId: "S5555-020",
    name: "SilverBridge Saver PDP",
    organization: "SilverBridge",
    planType: "PDP",
    networkType: "PDP",
    premium: 8.5,
    medicalDeductible: 0,
    drugDeductible: 545,
    maxOutOfPocket: 2000,
    starRating: 3.5,
    supplementalBenefits: {
      dental: false,
      vision: false,
      hearing: false,
      silverSneakers: false,
      transportation: false,
      mealDelivery: false,
    },
    formularyTiers: 5,
    preferredPharmacy: ["Walgreens", "Mail Order"],
    fipsCodes: ["06037", "41051", "36061", "33101", "17031", "48453"],
    highlights: [
      "Lowest-premium Part D in most markets",
      "Mail-order $0 Tier 1",
      "Broad formulary",
    ],
  },
  {
    planId: "S5555-021",
    name: "SilverBridge Premier PDP",
    organization: "SilverBridge",
    planType: "PDP",
    networkType: "PDP",
    premium: 54.2,
    medicalDeductible: 0,
    drugDeductible: 0,
    maxOutOfPocket: 2000,
    starRating: 4.5,
    supplementalBenefits: {
      dental: false,
      vision: false,
      hearing: false,
      silverSneakers: false,
      transportation: false,
      mealDelivery: false,
    },
    formularyTiers: 6,
    preferredPharmacy: ["CVS", "Walgreens", "Mail Order"],
    fipsCodes: ["06037", "41051", "36061", "33101", "17031", "48453"],
    highlights: [
      "$0 drug deductible",
      "Enhanced tier coverage for brand-name drugs",
      "Gap coverage on select Tier 3 drugs",
    ],
  },
  {
    planId: "H2222-050",
    name: "Liberty Dual Complete (D-SNP)",
    organization: "Liberty Health",
    planType: "D-SNP",
    networkType: "HMO",
    premium: 0,
    medicalDeductible: 0,
    drugDeductible: 0,
    maxOutOfPocket: 3000,
    starRating: 4.0,
    supplementalBenefits: {
      dental: true,
      vision: true,
      hearing: true,
      silverSneakers: true,
      transportation: true,
      mealDelivery: true,
    },
    formularyTiers: 5,
    preferredPharmacy: ["CVS", "Walgreens"],
    fipsCodes: ["06037", "41051", "36061", "33101"],
    snpType: "D-SNP",
    highlights: [
      "For people with both Medicare and Medicaid",
      "$0 copays on Tier 1 and Tier 2 drugs",
      "Care coordinator assigned",
    ],
  },
];

export const search_medicare_plans = tool({
  description:
    "Search Medicare Advantage and Part D plans available in a given county (FIPS code). Filters cover plan type, network type, minimum star rating, premium ceiling, and supplemental benefits. Returns a ranked list of plans with costs, ratings, and benefits — consume directly to render comparison cards or tables.",
  inputSchema: z.object({
    fipsCode: z.string().describe("5-digit county FIPS code from resolve_location."),
    planType: z.enum(["MA", "MA-PD", "PDP", "C-SNP", "D-SNP", "any"]).nullish(),
    networkType: z.enum(["HMO", "PPO", "PDP", "any"]).nullish(),
    maxPremium: z.number().nullish().describe("Only return plans at or below this monthly premium."),
    minStarRating: z.number().min(0).max(5).nullish(),
    supplementalBenefits: z
      .array(z.enum(["dental", "vision", "hearing", "silverSneakers", "transportation", "mealDelivery"]))
      .nullish()
      .describe("Require every listed benefit."),
    sortBy: z.enum(["premium", "starRating", "maxOutOfPocket"]).nullish(),
  }),
  execute: async ({ fipsCode, planType, networkType, maxPremium, minStarRating, supplementalBenefits, sortBy }) => {
    let results = PLANS.filter((p) => p.fipsCodes.includes(fipsCode));
    if (results.length === 0) results = PLANS;

    if (planType && planType !== "any") results = results.filter((p) => p.planType === planType);
    if (networkType && networkType !== "any") results = results.filter((p) => p.networkType === networkType);
    if (typeof maxPremium === "number") results = results.filter((p) => p.premium <= maxPremium);
    if (typeof minStarRating === "number") results = results.filter((p) => p.starRating >= minStarRating);
    if (supplementalBenefits && supplementalBenefits.length > 0) {
      results = results.filter((p) =>
        supplementalBenefits.every((b) => p.supplementalBenefits[b]),
      );
    }

    const sort = sortBy ?? "starRating";
    results = [...results].sort((a, b) => {
      if (sort === "premium") return a.premium - b.premium;
      if (sort === "maxOutOfPocket") return a.maxOutOfPocket - b.maxOutOfPocket;
      return b.starRating - a.starRating;
    });

    return {
      fipsCode,
      appliedFilters: {
        planType: planType ?? "any",
        networkType: networkType ?? "any",
        maxPremium: maxPremium ?? null,
        minStarRating: minStarRating ?? null,
        supplementalBenefits: supplementalBenefits ?? [],
        sortBy: sort,
      },
      resultCount: results.length,
      plans: results,
    };
  },
});

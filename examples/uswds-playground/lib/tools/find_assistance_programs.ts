import { tool } from "ai";
import { z } from "zod";

type Program = {
  id: string;
  name: string;
  type: "LIS" | "SPAP" | "PAP" | "medicare_savings" | "charity";
  coverage: string;
  eligibilitySummary: string;
  appliesToDrugs: string[] | "any";
  applyUrl: string;
  phone?: string;
  states?: string[];
  nextSteps: string[];
};

const PROGRAMS: Program[] = [
  {
    id: "lis",
    name: "Extra Help (Low Income Subsidy)",
    type: "LIS",
    coverage:
      "Pays Part D premium, deductible, and caps brand copays at $11.20 / generic at $4.50 in 2025.",
    eligibilitySummary:
      "Single income ≤ $23,895; married ≤ $32,335. Resource limits apply. Full LIS for Medicaid dual-eligible beneficiaries.",
    appliesToDrugs: "any",
    applyUrl: "https://www.ssa.gov/medicare/prescriptionhelp",
    phone: "1-800-772-1213",
    nextSteps: [
      "Apply through Social Security — fastest path",
      "Or contact your state Medicaid office",
      "Have pay stubs and resource statements ready",
    ],
  },
  {
    id: "msp",
    name: "Medicare Savings Programs",
    type: "medicare_savings",
    coverage: "Pays Part B premium and may pay Part A deductible and copays.",
    eligibilitySummary:
      "Four levels (QMB, SLMB, QI, QDWI) based on income and resources. Typical QMB income cap ~ $1,275/month single.",
    appliesToDrugs: "any",
    applyUrl: "https://www.medicare.gov/basics/costs/help/medicare-savings-programs",
    phone: "1-800-633-4227",
    nextSteps: [
      "Apply through your state Medicaid office",
      "Qualifying for a Medicare Savings Program automatically qualifies you for Extra Help",
    ],
  },
  {
    id: "spap-ny-epic",
    name: "NY EPIC (Elderly Pharmaceutical Insurance Coverage)",
    type: "SPAP",
    coverage: "Secondary Part D payer for NY residents 65+. Pays after Part D.",
    eligibilitySummary: "NY resident age 65+, income ≤ $75,000 single / $100,000 married.",
    appliesToDrugs: "any",
    applyUrl: "https://www.health.ny.gov/health_care/epic/",
    phone: "1-800-332-3742",
    states: ["NY"],
    nextSteps: [
      "Apply online through NY Dept. of Health",
      "Continue to enroll in a Medicare Part D plan",
    ],
  },
  {
    id: "spap-pa-pace",
    name: "PA PACE / PACENET",
    type: "SPAP",
    coverage: "Secondary Part D payer for PA residents 65+. Low fixed copays.",
    eligibilitySummary: "PA resident age 65+, income ≤ $14,500 single (PACE) or ≤ $33,500 (PACENET).",
    appliesToDrugs: "any",
    applyUrl: "https://pacecares.magellanhealth.com/",
    states: ["PA"],
    nextSteps: ["Apply through the PA Dept. of Aging"],
  },
  {
    id: "pap-eliquis",
    name: "Bristol-Myers Squibb Patient Assistance (Eliquis)",
    type: "PAP",
    coverage: "Free Eliquis for eligible uninsured and Medicare beneficiaries who meet income rules.",
    eligibilitySummary: "Income ≤ 400% FPL; denied from LIS or uninsured.",
    appliesToDrugs: ["Eliquis", "apixaban"],
    applyUrl: "https://www.bmspaf.org",
    phone: "1-800-736-0003",
    nextSteps: [
      "Prescriber submits PAP enrollment form",
      "Provide proof of income",
    ],
  },
  {
    id: "pap-jardiance",
    name: "Boehringer Ingelheim Cares (Jardiance)",
    type: "PAP",
    coverage: "Free Jardiance or Trajenta for eligible Medicare Part D beneficiaries.",
    eligibilitySummary: "Income ≤ 500% FPL; spent ≥ $600 on BI medicines in past 12 months.",
    appliesToDrugs: ["Jardiance", "empagliflozin"],
    applyUrl: "https://www.bipatientassistance.com",
    phone: "1-800-556-8317",
    nextSteps: ["Prescriber submits application", "Include recent Part D denial or spending record"],
  },
  {
    id: "pap-ozempic",
    name: "Novo Nordisk Patient Assistance (Ozempic)",
    type: "PAP",
    coverage: "Free Ozempic for eligible Medicare Part D beneficiaries who cannot afford the copay.",
    eligibilitySummary: "Income ≤ 400% FPL; spent ≥ $1,000 on Part D drugs this year.",
    appliesToDrugs: ["Ozempic", "semaglutide"],
    applyUrl: "https://www.novocare.com",
    phone: "1-866-310-7549",
    nextSteps: ["Prescriber completes PAP form", "Plan denial or spend documentation"],
  },
];

export const find_assistance_programs = tool({
  description:
    "Find prescription cost assistance programs — federal Extra Help (LIS), State Pharmaceutical Assistance Programs (SPAPs), manufacturer Patient Assistance Programs (PAPs), and Medicare Savings Programs. Filter by drug name, state, or program type.",
  inputSchema: z.object({
    drugName: z.string().nullish().describe("Brand or generic name to find manufacturer PAPs for."),
    state: z.string().nullish().describe("Two-letter state code to surface state SPAPs."),
    programType: z.enum(["LIS", "SPAP", "PAP", "medicare_savings", "any"]).nullish(),
    includeLIS: z.boolean().nullish().describe("Always include Extra Help / LIS in results. Default true."),
  }),
  execute: async ({ drugName, state, programType, includeLIS }) => {
    const showLIS = includeLIS ?? true;
    const stateUpper = state ? state.toUpperCase() : null;
    const drugLower = drugName ? drugName.toLowerCase() : null;

    let results = PROGRAMS.filter((p) => {
      if (programType && programType !== "any" && p.type !== programType) return false;
      if (p.type === "SPAP") {
        if (!stateUpper) return false;
        return Boolean(p.states?.includes(stateUpper));
      }
      if (p.type === "PAP" && drugLower) {
        return p.appliesToDrugs !== "any" && p.appliesToDrugs.some((d) => d.toLowerCase() === drugLower);
      }
      if (p.type === "PAP" && !drugLower) return false;
      return true;
    });

    if (showLIS && !results.some((p) => p.id === "lis")) {
      const lis = PROGRAMS.find((p) => p.id === "lis");
      if (lis) results = [lis, ...results];
    }

    return {
      filters: {
        drugName: drugName ?? null,
        state: stateUpper,
        programType: programType ?? "any",
      },
      resultCount: results.length,
      programs: results,
      disclaimer:
        "Assistance programs change frequently. Confirm eligibility and apply via the linked official site or phone number.",
    };
  },
});

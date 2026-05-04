import { tool } from "ai";
import { z } from "zod";

type DrugRecord = {
  rxcui: string;
  brandName: string;
  genericName: string;
  drugClass: string;
  usedFor: string;
  forms: Array<{
    form: "tablet" | "capsule" | "oral solution" | "injection" | "inhaler" | "topical";
    strengths: string[];
    ndc: string;
  }>;
  typicalTier: 1 | 2 | 3 | 4 | 5;
  restrictions: Array<"prior_authorization" | "step_therapy" | "quantity_limit">;
};

const DRUGS: DrugRecord[] = [
  {
    rxcui: "855332",
    brandName: "Prinivil / Zestril",
    genericName: "lisinopril",
    drugClass: "ACE inhibitor",
    usedFor: "High blood pressure, heart failure",
    forms: [
      { form: "tablet", strengths: ["2.5mg", "5mg", "10mg", "20mg", "40mg"], ndc: "00006-0019-54" },
    ],
    typicalTier: 1,
    restrictions: [],
  },
  {
    rxcui: "83367",
    brandName: "Lipitor",
    genericName: "atorvastatin",
    drugClass: "Statin",
    usedFor: "High cholesterol",
    forms: [
      { form: "tablet", strengths: ["10mg", "20mg", "40mg", "80mg"], ndc: "00071-0155-23" },
    ],
    typicalTier: 1,
    restrictions: [],
  },
  {
    rxcui: "1659929",
    brandName: "Eliquis",
    genericName: "apixaban",
    drugClass: "Anticoagulant",
    usedFor: "Stroke prevention in atrial fibrillation, DVT",
    forms: [
      { form: "tablet", strengths: ["2.5mg", "5mg"], ndc: "00003-0894-21" },
    ],
    typicalTier: 3,
    restrictions: [],
  },
  {
    rxcui: "1545658",
    brandName: "Jardiance",
    genericName: "empagliflozin",
    drugClass: "SGLT2 inhibitor",
    usedFor: "Type 2 diabetes, heart failure, chronic kidney disease",
    forms: [
      { form: "tablet", strengths: ["10mg", "25mg"], ndc: "00597-0152-30" },
    ],
    typicalTier: 3,
    restrictions: ["step_therapy"],
  },
  {
    rxcui: "1807632",
    brandName: "Ozempic",
    genericName: "semaglutide",
    drugClass: "GLP-1 agonist",
    usedFor: "Type 2 diabetes",
    forms: [
      { form: "injection", strengths: ["0.25mg", "0.5mg", "1mg", "2mg"], ndc: "00169-4130-12" },
    ],
    typicalTier: 4,
    restrictions: ["prior_authorization", "step_therapy", "quantity_limit"],
  },
  {
    rxcui: "745679",
    brandName: "Neurontin",
    genericName: "gabapentin",
    drugClass: "Anticonvulsant",
    usedFor: "Nerve pain, seizures",
    forms: [
      { form: "capsule", strengths: ["100mg", "300mg", "400mg"], ndc: "00071-0803-24" },
      { form: "tablet", strengths: ["600mg", "800mg"], ndc: "00071-0513-24" },
      { form: "oral solution", strengths: ["250mg/5mL"], ndc: "00071-2012-23" },
    ],
    typicalTier: 1,
    restrictions: [],
  },
  {
    rxcui: "198014",
    brandName: "Vytorin",
    genericName: "ezetimibe/simvastatin",
    drugClass: "Cholesterol combo",
    usedFor: "High cholesterol",
    forms: [
      { form: "tablet", strengths: ["10mg/10mg", "10mg/20mg", "10mg/40mg"], ndc: "66582-0313-54" },
    ],
    typicalTier: 3,
    restrictions: ["step_therapy"],
  },
];

function matchDrug(query: string): DrugRecord[] {
  const q = query.toLowerCase().trim();
  return DRUGS.filter(
    (d) =>
      d.brandName.toLowerCase().includes(q) ||
      d.genericName.toLowerCase().includes(q) ||
      d.rxcui === q ||
      d.forms.some((f) => f.ndc === q),
  );
}

export const search_drugs_and_dosages = tool({
  description:
    "Look up prescription drug details by brand or generic name. Returns dosage forms, strengths, RxCUI, NDC, drug class, and typical Part D tier and utilization restrictions. Call this before calculate_drug_costs so NDCs are available.",
  inputSchema: z.object({
    drugNames: z.array(z.string()).describe("Brand or generic drug names to look up."),
  }),
  execute: async ({ drugNames }) => {
    const results = drugNames.map((name) => {
      const matches = matchDrug(name);
      return {
        query: name,
        matched: matches.length > 0,
        drugs: matches,
      };
    });
    return {
      resultCount: results.reduce((sum, r) => sum + r.drugs.length, 0),
      results,
    };
  },
});

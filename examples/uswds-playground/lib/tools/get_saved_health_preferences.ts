import { tool } from "ai";
import { z } from "zod";

const SAVED_PROFILE = {
  beneficiaryId: "DEMO-0001",
  displayName: "Sample Beneficiary",
  savedDrugs: [
    { name: "Eliquis", genericName: "apixaban", dosage: "5mg tablet", monthlyDoses: 60 },
    { name: "Jardiance", genericName: "empagliflozin", dosage: "10mg tablet", monthlyDoses: 30 },
    { name: "atorvastatin", genericName: "atorvastatin", dosage: "20mg tablet", monthlyDoses: 30 },
    { name: "lisinopril", genericName: "lisinopril", dosage: "10mg tablet", monthlyDoses: 30 },
  ],
  savedPharmacies: [
    { npi: "1234567890", name: "CVS Pharmacy #1234", type: "retail", preferred: true, address: "123 Main St, Portland, OR 97201" },
    { npi: "2345678901", name: "Walgreens #5678", type: "retail", preferred: true, address: "456 Oak Ave, Portland, OR 97205" },
    { npi: "3456789012", name: "Mail Order Rx", type: "mail_order", preferred: true, address: "Delivered by mail" },
  ],
  savedProviders: [
    { npi: "9876543210", name: "Dr. Aisha Patel, MD", specialty: "Primary Care", network: "in-network" },
    { npi: "8765432109", name: "Dr. Marcus Chen, MD", specialty: "Cardiology", network: "in-network" },
  ],
  preferences: {
    preferLowPremium: false,
    preferMailOrder: true,
    preferPPO: true,
    preferLowTotalCost: true,
  },
};

export const get_saved_health_preferences = tool({
  description:
    "Return the signed-in beneficiary's saved drug list, preferred pharmacies, saved providers, and shopping preferences. Use to personalize plan search and cost calculations. Demo data only — not real beneficiary information.",
  inputSchema: z.object({
    beneficiaryId: z.string().nullish(),
  }),
  execute: async ({ beneficiaryId }) => {
    return {
      ...SAVED_PROFILE,
      beneficiaryId: beneficiaryId ?? SAVED_PROFILE.beneficiaryId,
      dataSource: "demo",
      disclaimer: "Sample beneficiary profile for demonstration. No PHI.",
    };
  },
});

import { tool } from "ai";
import { z } from "zod";

export const getGIBillBenefits = tool({
  description:
    "Get the veteran's GI Bill education benefits summary: remaining entitlement, current school enrollment, and recent payment history.",
  inputSchema: z.object({
    veteranId: z.string().nullish(),
  }),
  execute: async () => {
    return {
      program: "Post-9/11 GI Bill (Chapter 33)",
      eligibilityPercentage: 100,
      totalEntitlement: "36 months",
      used: "24 months 15 days",
      remaining: "11 months 15 days",
      expirationDate: "2030-06-15",
      currentEnrollment: {
        school: "Portland State University",
        program: "Computer Science, BS",
        enrollmentStatus: "Full-time",
      },
      recentPayments: [
        { date: "2026-04-01", type: "Housing Allowance", amount: "$2,100.00" },
        { date: "2026-04-01", type: "Tuition & Fees", amount: "$4,500.00" },
        { date: "2026-03-01", type: "Housing Allowance", amount: "$2,100.00" },
        { date: "2026-03-01", type: "Tuition & Fees", amount: "$4,500.00" },
        { date: "2026-02-01", type: "Housing Allowance", amount: "$2,100.00" },
      ],
    };
  },
});

import { tool } from "ai";
import { z } from "zod";

export const getClaimStatus = tool({
  description:
    "Get the veteran's current VA disability compensation claim status, including a timeline of review steps and required documents.",
  inputSchema: z.object({
    claimNumber: z.string().nullish(),
  }),
  execute: async ({ claimNumber }) => {
    return {
      claimNumber: claimNumber ?? "12345678",
      type: "Disability Compensation",
      status: "Evidence Gathering",
      filedDate: "2026-01-15",
      lastUpdated: "2026-04-10",
      steps: [
        { name: "Claim Received", status: "complete", date: "2026-01-15" },
        { name: "Initial Review", status: "complete", date: "2026-02-01" },
        { name: "Evidence Gathering", status: "current", date: "2026-02-15" },
        { name: "Rating Decision", status: "pending" },
        { name: "Notification", status: "pending" },
      ],
      documents: [
        { name: "DD214", status: "received" },
        { name: "Medical Records", status: "requested" },
        { name: "Service Treatment Records", status: "received" },
      ],
    };
  },
});

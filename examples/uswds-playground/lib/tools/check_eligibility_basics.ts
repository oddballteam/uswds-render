import { tool } from "ai";
import { z } from "zod";

type EnrollmentWindow = {
  name: string;
  code: "IEP" | "AEP" | "MA-OEP" | "GEP" | "SEP";
  startDate: string;
  endDate: string;
  description: string;
};

export const check_eligibility_basics = tool({
  description:
    "Determine basic Medicare eligibility and current or upcoming enrollment windows (IEP, AEP, MA-OEP, GEP, SEP) based on age and any qualifying conditions. Use when the user provides an age, birthday, or enrollment trigger (moving, losing coverage, disability). Does not query real beneficiary data.",
  inputSchema: z.object({
    age: z.number().int().min(0).max(120).describe("Current age in years."),
    monthsToBirthday: z
      .number()
      .int()
      .min(-12)
      .max(12)
      .nullish()
      .describe("Months until the next birthday (negative if already past). Default 0."),
    hasQualifyingDisability: z.boolean().nullish(),
    qualifyingEvent: z
      .enum(["moving", "lost_employer_coverage", "lost_medicaid", "qualified_for_lis", "none"])
      .nullish()
      .describe("Life event that may trigger a Special Enrollment Period."),
  }),
  execute: async ({ age, monthsToBirthday, hasQualifyingDisability, qualifyingEvent }) => {
    const months = monthsToBirthday ?? 0;
    const eligible = age >= 65 || Boolean(hasQualifyingDisability);
    const turning65Soon = age === 64 && months >= -3 && months <= 7;

    const windows: EnrollmentWindow[] = [];

    if (turning65Soon || (age === 65 && months >= -3 && months <= 3)) {
      windows.push({
        name: "Initial Enrollment Period",
        code: "IEP",
        startDate: "2026-02-01",
        endDate: "2026-08-31",
        description:
          "7-month window around your 65th birthday. Sign up during the 3 months before your birthday month to avoid a gap in coverage.",
      });
    }

    windows.push({
      name: "Annual Enrollment Period",
      code: "AEP",
      startDate: "2026-10-15",
      endDate: "2026-12-07",
      description:
        "Anyone with Medicare can change or drop a Medicare Advantage or Part D plan for the next plan year.",
    });

    if (eligible) {
      windows.push({
        name: "Medicare Advantage Open Enrollment",
        code: "MA-OEP",
        startDate: "2027-01-01",
        endDate: "2027-03-31",
        description:
          "Members in a Medicare Advantage plan can switch to a different MA plan or return to Original Medicare once during this window.",
      });
    }

    if (qualifyingEvent && qualifyingEvent !== "none") {
      windows.push({
        name: `Special Enrollment Period — ${qualifyingEvent.replace(/_/g, " ")}`,
        code: "SEP",
        startDate: "2026-04-01",
        endDate: "2026-06-30",
        description:
          "You qualify for a Special Enrollment Period because of a recent life event. You typically have 2 months to enroll in or change a plan.",
      });
    }

    const steps = [
      eligible
        ? "You are eligible for Medicare today."
        : `You will be eligible at age 65${hasQualifyingDisability ? " or sooner based on a qualifying disability" : ""}.`,
      "Create or sign in to a Medicare.gov account to see plans in your area.",
      "Compare Original Medicare + Part D vs Medicare Advantage using your drug list and preferred providers.",
      "Enroll through Medicare.gov, your plan sponsor, or SSA (for Part A and Part B).",
    ];

    return {
      age,
      eligibleNow: eligible,
      turning65Soon,
      qualifyingEvent: qualifyingEvent ?? "none",
      windows,
      nextSteps: steps,
      disclaimer:
        "Generic enrollment guidance. Confirm your exact dates on Medicare.gov — they depend on your birthday and current coverage.",
    };
  },
});

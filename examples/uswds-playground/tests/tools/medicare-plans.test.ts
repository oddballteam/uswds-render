import { describe, expect, it } from "vitest";
import { compareMedicarePlans } from "../../lib/tools/medicare-plans";

describe("compareMedicarePlans", () => {
  it("returns two plans with comparable fields", async () => {
    const result = await (compareMedicarePlans.execute as any)(
      { currentPlan: "Original Medicare", compareTo: "Plan G" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.plans).toHaveLength(2);
    for (const plan of result.plans) {
      expect(plan).toMatchObject({
        name: expect.any(String),
        monthlyPremium: expect.any(String),
        deductible: expect.any(String),
        copay: expect.any(String),
        prescriptionCoverage: expect.any(Boolean),
        dentalVision: expect.any(Boolean),
        maxOutOfPocket: expect.any(String),
      });
    }
  });
});

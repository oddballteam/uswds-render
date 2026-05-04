import { describe, expect, it } from "vitest";
import { search_medicare_plans } from "../../lib/tools/search_medicare_plans";

describe("search_medicare_plans", () => {
  it("returns plans in a FIPS code with costs and ratings", async () => {
    const result = await (search_medicare_plans.execute as any)(
      { fipsCode: "41051" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.plans.length).toBeGreaterThan(0);
    const p = result.plans[0];
    expect(p).toMatchObject({
      planId: expect.any(String),
      name: expect.any(String),
      planType: expect.any(String),
      premium: expect.any(Number),
      starRating: expect.any(Number),
      maxOutOfPocket: expect.any(Number),
      supplementalBenefits: expect.any(Object),
    });
  });

  it("filters by PPO + 4-star minimum", async () => {
    const result = await (search_medicare_plans.execute as any)(
      { fipsCode: "41051", networkType: "PPO", minStarRating: 4 },
      { messages: [], toolCallId: "test" },
    );
    expect(result.plans.every((p: any) => p.networkType === "PPO")).toBe(true);
    expect(result.plans.every((p: any) => p.starRating >= 4)).toBe(true);
  });
});

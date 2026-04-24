import { describe, expect, it } from "vitest";
import { calculate_drug_costs } from "../../lib/tools/calculate_drug_costs";

describe("calculate_drug_costs", () => {
  it("prices a drug list against a plan with per-phase breakdown", async () => {
    const result = await (calculate_drug_costs.execute as any)(
      { planId: "H1234-001", drugs: ["Eliquis", "Jardiance"] },
      { messages: [], toolCallId: "test" },
    );
    expect(result.perDrug).toHaveLength(2);
    for (const d of result.perDrug) {
      expect(d.covered).toBe(true);
      expect(d.phases.map((p: any) => p.phase)).toEqual([
        "deductible",
        "initial",
        "coverage_gap",
        "catastrophic",
      ]);
    }
    expect(result.estimatedAnnualOutOfPocket).toBeGreaterThan(0);
    expect(result.estimatedAnnualOutOfPocket).toBeLessThanOrEqual(result.catastrophicCap);
  });
});

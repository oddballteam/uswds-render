import { describe, expect, it } from "vitest";
import { get_beneficiary_profile } from "../../lib/tools/get_beneficiary_profile";

describe("get_beneficiary_profile", () => {
  it("returns sample Part A/B/D enrollments and YTD deductibles", async () => {
    const result = await (get_beneficiary_profile.execute as any)(
      {},
      { messages: [], toolCallId: "test" },
    );
    expect(result.entitlements.partA.enrolled).toBe(true);
    expect(result.entitlements.partB.enrolled).toBe(true);
    expect(result.currentEnrollment.planId).toMatch(/^[HS]\d{4}-\d{3}$/);
    expect(result.deductiblesYTD).toBeDefined();
    expect(result.dataSource).toBe("demo");
  });

  it("drops YTD deductibles when includeDeductibles=false", async () => {
    const result = await (get_beneficiary_profile.execute as any)(
      { includeDeductibles: false },
      { messages: [], toolCallId: "test" },
    );
    expect(result.deductiblesYTD).toBeUndefined();
  });
});

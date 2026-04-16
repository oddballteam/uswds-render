import { describe, expect, it } from "vitest";
import { getGIBillBenefits } from "../../lib/tools/gi-bill";

describe("getGIBillBenefits", () => {
  it("returns GI Bill entitlement + enrollment + payments", async () => {
    const result = await (getGIBillBenefits.execute as any)(
      {},
      { messages: [], toolCallId: "test" },
    );
    expect(result).toMatchObject({
      program: expect.any(String),
      eligibilityPercentage: expect.any(Number),
      totalEntitlement: expect.any(String),
      used: expect.any(String),
      remaining: expect.any(String),
      expirationDate: expect.any(String),
      currentEnrollment: expect.objectContaining({
        school: expect.any(String),
        program: expect.any(String),
        enrollmentStatus: expect.any(String),
      }),
      recentPayments: expect.any(Array),
    });
    expect(result.recentPayments.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { getClaimStatus } from "../../lib/tools/claim-status";

describe("getClaimStatus", () => {
  it("returns a claim with timeline steps and documents", async () => {
    const result = await (getClaimStatus.execute as any)(
      {},
      { messages: [], toolCallId: "test" },
    );
    expect(result).toMatchObject({
      claimNumber: expect.any(String),
      type: expect.any(String),
      status: expect.any(String),
      filedDate: expect.any(String),
      lastUpdated: expect.any(String),
      steps: expect.any(Array),
      documents: expect.any(Array),
    });
    expect(result.steps.length).toBeGreaterThan(0);
    for (const step of result.steps) {
      expect(step).toMatchObject({
        name: expect.any(String),
        status: expect.stringMatching(/complete|current|pending/),
      });
    }
  });
});

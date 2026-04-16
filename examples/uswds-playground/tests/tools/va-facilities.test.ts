import { describe, expect, it } from "vitest";
import { searchVAFacilities } from "../../lib/tools/va-facilities";

describe("searchVAFacilities", () => {
  it("returns a list of facilities with required fields", async () => {
    const result = await (searchVAFacilities.execute as any)(
      { location: "Portland, OR" },
      { messages: [], toolCallId: "test" },
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const f of result) {
      expect(f).toMatchObject({
        name: expect.any(String),
        type: expect.stringMatching(/health|benefits|cemetery/),
        address: expect.any(String),
        phone: expect.any(String),
        distance: expect.any(String),
        hours: expect.any(String),
        services: expect.any(Array),
      });
    }
  });

  it("filters by serviceType when provided", async () => {
    const result = await (searchVAFacilities.execute as any)(
      { location: "Portland, OR", serviceType: "benefits" },
      { messages: [], toolCallId: "test" },
    );
    for (const f of result) {
      expect(f.type).toBe("benefits");
    }
  });
});

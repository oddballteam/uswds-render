import { describe, expect, it } from "vitest";
import { resolve_location } from "../../lib/tools/resolve_location";

describe("resolve_location", () => {
  it("returns a county FIPS code for a known ZIP", async () => {
    const result = await (resolve_location.execute as any)(
      { zip: "97201" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.matched).toBe("zip");
    expect(result.location).toMatchObject({
      zip: "97201",
      state: "Oregon",
      fipsCode: expect.any(String),
    });
    expect(result.location.fipsCode).toMatch(/^\d{5}$/);
  });

  it("falls back to a default demo market for unknown ZIPs", async () => {
    const result = await (resolve_location.execute as any)(
      { zip: "00000" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.matched).toBe("default");
    expect(result.location.fipsCode).toMatch(/^\d{5}$/);
  });
});

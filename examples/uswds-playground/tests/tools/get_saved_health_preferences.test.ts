import { describe, expect, it } from "vitest";
import { get_saved_health_preferences } from "../../lib/tools/get_saved_health_preferences";

describe("get_saved_health_preferences", () => {
  it("returns sample saved drugs, pharmacies, and providers", async () => {
    const result = await (get_saved_health_preferences.execute as any)(
      {},
      { messages: [], toolCallId: "test" },
    );
    expect(result.savedDrugs.length).toBeGreaterThan(0);
    expect(result.savedPharmacies.length).toBeGreaterThan(0);
    expect(result.savedProviders.length).toBeGreaterThan(0);
    expect(result.dataSource).toBe("demo");
    expect(result.disclaimer.toLowerCase()).toContain("sample");
  });
});

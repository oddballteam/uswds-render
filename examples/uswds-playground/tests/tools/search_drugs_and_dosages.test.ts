import { describe, expect, it } from "vitest";
import { search_drugs_and_dosages } from "../../lib/tools/search_drugs_and_dosages";

describe("search_drugs_and_dosages", () => {
  it("returns NDCs and dosage forms for Eliquis and Jardiance", async () => {
    const result = await (search_drugs_and_dosages.execute as any)(
      { drugNames: ["Eliquis", "Jardiance"] },
      { messages: [], toolCallId: "test" },
    );
    expect(result.results).toHaveLength(2);
    for (const r of result.results) {
      expect(r.matched).toBe(true);
      expect(r.drugs[0]).toMatchObject({
        rxcui: expect.any(String),
        brandName: expect.any(String),
        genericName: expect.any(String),
        forms: expect.any(Array),
        typicalTier: expect.any(Number),
      });
      expect(r.drugs[0].forms[0].ndc).toMatch(/^\d{5}-\d{4}-\d{2}$/);
    }
  });
});

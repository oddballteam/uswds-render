import { describe, expect, it } from "vitest";
import { find_assistance_programs } from "../../lib/tools/find_assistance_programs";

describe("find_assistance_programs", () => {
  it("returns Extra Help plus a drug-specific PAP when a drug is provided", async () => {
    const result = await (find_assistance_programs.execute as any)(
      { drugName: "Eliquis" },
      { messages: [], toolCallId: "test" },
    );
    const ids = result.programs.map((p: any) => p.id);
    expect(ids).toContain("lis");
    expect(ids).toContain("pap-eliquis");
  });

  it("includes a state SPAP when a state is provided", async () => {
    const result = await (find_assistance_programs.execute as any)(
      { state: "NY" },
      { messages: [], toolCallId: "test" },
    );
    const types = result.programs.map((p: any) => p.type);
    expect(types).toContain("SPAP");
  });
});

import { describe, expect, it } from "vitest";
import { check_eligibility_basics } from "../../lib/tools/check_eligibility_basics";

describe("check_eligibility_basics", () => {
  it("returns an IEP window when turning 65 soon", async () => {
    const result = await (check_eligibility_basics.execute as any)(
      { age: 64, monthsToBirthday: 3 },
      { messages: [], toolCallId: "test" },
    );
    const codes = result.windows.map((w: any) => w.code);
    expect(codes).toContain("IEP");
    expect(codes).toContain("AEP");
    expect(result.eligibleNow).toBe(false);
    expect(result.turning65Soon).toBe(true);
  });

  it("adds an SEP window for qualifying events", async () => {
    const result = await (check_eligibility_basics.execute as any)(
      { age: 68, qualifyingEvent: "moving" },
      { messages: [], toolCallId: "test" },
    );
    const codes = result.windows.map((w: any) => w.code);
    expect(codes).toContain("SEP");
    expect(result.eligibleNow).toBe(true);
  });
});

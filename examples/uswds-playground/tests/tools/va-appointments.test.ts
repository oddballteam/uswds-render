import { describe, expect, it } from "vitest";
import { getVAAppointments } from "../../lib/tools/va-appointments";

describe("getVAAppointments", () => {
  it("returns past_month appointments with required fields", async () => {
    const result = await (getVAAppointments.execute as any)(
      { timeframe: "past_month" },
      { messages: [], toolCallId: "test" },
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const apt of result) {
      expect(apt).toMatchObject({
        id: expect.any(String),
        date: expect.any(String),
        provider: expect.any(String),
        facility: expect.any(String),
        type: expect.stringMatching(/telehealth|in_person/),
        department: expect.any(String),
        status: expect.any(String),
      });
    }
  });

  it("filters by type when provided", async () => {
    const result = await (getVAAppointments.execute as any)(
      { timeframe: "upcoming", type: "telehealth" },
      { messages: [], toolCallId: "test" },
    );
    for (const apt of result) {
      expect(apt.type).toBe("telehealth");
    }
  });
});

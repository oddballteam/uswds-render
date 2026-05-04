import { describe, expect, it } from "vitest";
import { search_medicare_knowledge } from "../../lib/tools/search_medicare_knowledge";

describe("search_medicare_knowledge", () => {
  it("returns ranked articles for a basics query about Parts A/B/C/D", async () => {
    const result = await (search_medicare_knowledge.execute as any)(
      { query: "difference between Original Medicare and Advantage" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.articles.length).toBeGreaterThan(0);
    expect(result.articles[0]).toMatchObject({
      title: expect.any(String),
      summary: expect.any(String),
      body: expect.any(String),
      url: expect.stringContaining("medicare.gov"),
    });
  });

  it("filters by topic when provided", async () => {
    const result = await (search_medicare_knowledge.execute as any)(
      { query: "prior authorization", topic: "drugs" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.articles.every((a: any) => a.topic === "drugs")).toBe(true);
  });
});

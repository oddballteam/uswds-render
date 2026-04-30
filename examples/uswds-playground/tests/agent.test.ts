import { describe, it, expect } from "vitest";
import { buildCdnSection, type CdnEntry } from "@/lib/agent";

const ENTRY: CdnEntry = {
  key: "PlanInformation",
  tagName: "cms-plan-information",
  description: "Medicare plan summary panel.",
  example: { planType: "Original Medicare", partACoverageDate: "8/12/2019" },
  bundleUrl: "http://localhost:4000/components/cms-plan-information.js",
};

describe("buildCdnSection", () => {
  it("returns empty string for empty entries", () => {
    expect(buildCdnSection([])).toBe("");
  });

  it("includes the catalog key in bold", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain("**PlanInformation**");
  });

  it("includes the tag name as a reference (not the type to use)", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain("cms-plan-information");
  });

  it("instructs to use catalog key as type, not tag name", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain('"type": "PlanInformation"');
    expect(result).toContain('NOT');
    expect(result).toContain('"cms-plan-information"');
  });

  it("includes the description text", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain("Medicare plan summary panel.");
  });

  it("includes serialised example props", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain('"planType":"Original Medicare"');
    expect(result).toContain('"partACoverageDate":"8/12/2019"');
  });

  it("includes all entries when multiple provided", () => {
    const second: CdnEntry = {
      key: "AppointmentCard",
      tagName: "cms-appointment-card",
      description: "VA appointment summary card.",
      example: { providerName: "Dr. Chen" },
      bundleUrl: "http://localhost:4000/components/cms-appointment-card.js",
    };
    const result = buildCdnSection([ENTRY, second]);
    expect(result).toContain("PlanInformation");
    expect(result).toContain("AppointmentCard");
  });

  it("includes a section header prompting preference over primitives", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toMatch(/CDN COMPONENTS/i);
    expect(result).toMatch(/prefer/i);
  });
});

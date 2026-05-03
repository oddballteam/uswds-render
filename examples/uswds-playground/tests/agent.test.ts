import { describe, it, expect } from "vitest";
import { buildCdnSection, buildCdnRules, buildCdnScenarios } from "@/lib/agent";
import type { CdnEntry } from "@/lib/cdn-types";

const ENTRY: CdnEntry = {
  key: "PlanInformation",
  tagName: "cms-plan-information",
  description: "Medicare plan summary panel. Shows plan type header and coverage dates. Prefer over Card+Text.",
  example: { planType: "Original Medicare", partACoverageDate: "8/12/2019" },
  bundleUrl: "http://localhost:4000/components/cms-plan-information.js",
  propDescriptions: {
    planType: "Plan category label, e.g. 'Original Medicare'",
    partACoverageDate: "Part A coverage start date, e.g. '8/12/2019'",
  },
};

const ENTRY_NO_PROPS: CdnEntry = {
  key: "AppointmentCard",
  tagName: "cms-appointment-card",
  description: "VA appointment summary card. Shows provider and status.",
  example: { providerName: "Dr. Chen" },
  bundleUrl: "http://localhost:4000/components/cms-appointment-card.js",
};

describe("buildCdnSection", () => {
  it("returns empty string for empty entries", () => {
    expect(buildCdnSection([])).toBe("");
  });

  it("includes the catalog key in bold", () => {
    expect(buildCdnSection([ENTRY])).toContain("**PlanInformation**");
  });

  it("instructs to use catalog key as type, not tag name", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain('"type": "PlanInformation"');
    expect(result).toContain("NOT");
    expect(result).toContain('"cms-plan-information"');
  });

  it("includes the description text", () => {
    expect(buildCdnSection([ENTRY])).toContain("Medicare plan summary panel");
  });

  it("includes serialised example props", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain('"planType":"Original Medicare"');
    expect(result).toContain('"partACoverageDate":"8/12/2019"');
  });

  it("includes prop descriptions when present", () => {
    const result = buildCdnSection([ENTRY]);
    expect(result).toContain("Props:");
    expect(result).toContain("planType");
    expect(result).toContain("Plan category label");
  });

  it("omits Props line when propDescriptions absent", () => {
    const result = buildCdnSection([ENTRY_NO_PROPS]);
    expect(result).not.toContain("Props:");
  });

  it("includes all entries when multiple provided", () => {
    const result = buildCdnSection([ENTRY, ENTRY_NO_PROPS]);
    expect(result).toContain("PlanInformation");
    expect(result).toContain("AppointmentCard");
  });

  it("includes a section header", () => {
    expect(buildCdnSection([ENTRY])).toMatch(/CDN COMPONENTS/i);
  });
});

describe("buildCdnRules", () => {
  it("returns empty string for empty entries", () => {
    expect(buildCdnRules([])).toBe("");
  });

  it("lists all CDN component keys in the rule header", () => {
    const result = buildCdnRules([ENTRY, ENTRY_NO_PROPS]);
    expect(result).toContain("PlanInformation");
    expect(result).toContain("AppointmentCard");
  });

  it("includes no-children rule", () => {
    expect(buildCdnRules([ENTRY])).toContain("no children");
  });

  it("includes no-repeat rule", () => {
    expect(buildCdnRules([ENTRY])).toContain("repeat");
  });

  it("includes type-key rule", () => {
    expect(buildCdnRules([ENTRY])).toContain("catalog key");
  });

  it("includes flat-sibling list rule", () => {
    expect(buildCdnRules([ENTRY])).toContain("flat sibling");
  });
});

describe("buildCdnScenarios", () => {
  it("returns empty string for empty entries", () => {
    expect(buildCdnScenarios([])).toBe("");
  });

  it("includes first sentence of each description as trigger", () => {
    const result = buildCdnScenarios([ENTRY]);
    expect(result).toContain("Medicare plan summary panel");
  });

  it("includes the catalog key as the target", () => {
    expect(buildCdnScenarios([ENTRY])).toContain("**PlanInformation**");
  });

  it("includes all entries when multiple provided", () => {
    const result = buildCdnScenarios([ENTRY, ENTRY_NO_PROPS]);
    expect(result).toContain("PlanInformation");
    expect(result).toContain("AppointmentCard");
  });

  it("includes a section header", () => {
    expect(buildCdnScenarios([ENTRY])).toMatch(/CDN SCENARIO RECIPES/i);
  });

  it("uses only first sentence of description (before first period-space)", () => {
    const result = buildCdnScenarios([ENTRY]);
    // Second sentence "Shows plan type header..." should NOT appear
    expect(result).not.toContain("Shows plan type header");
  });

  it("does not truncate at decimal numbers (period not followed by space)", () => {
    const entry: CdnEntry = {
      key: "VersionCard",
      tagName: "cms-version-card",
      description: "Displays version 3.5 of the component. Prefer over Text.",
      example: {},
      bundleUrl: "http://localhost:4000/components/cms-version-card.js",
    };
    const result = buildCdnScenarios([entry]);
    // "3.5" has no space after period — must not split there
    expect(result).toContain("version 3.5");
  });
});

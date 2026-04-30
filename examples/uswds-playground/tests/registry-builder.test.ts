/**
 * Tests buildRegistry() from registry.ts directly — not a reimplementation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";
import { buildRegistry, getRegistry, clearRegistryCache } from "@/lib/render/registry";

const CDN_CATALOG = [
  {
    key: "PlanInformation",
    tagName: "cms-plan-information",
    description: "Medicare plan summary panel.",
    example: { planType: "Original Medicare" },
    bundleUrl: "http://localhost:4000/components/cms-plan-information.js",
  },
  {
    key: "AppointmentCard",
    tagName: "cms-appointment-card",
    description: "VA appointment summary card.",
    example: { providerName: "Dr. Chen" },
    bundleUrl: "http://localhost:4000/components/cms-appointment-card.js",
  },
  {
    key: "ClaimStatusTimeline",
    tagName: "cms-claim-status-timeline",
    description: "VA claim status timeline.",
    example: { claimType: "Disability" },
    bundleUrl: "http://localhost:4000/components/cms-claim-status-timeline.js",
  },
  {
    key: "BenefitSummary",
    tagName: "cms-benefit-summary",
    description: "GI Bill entitlement summary.",
    example: { program: "Post-9/11 GI Bill" },
    bundleUrl: "http://localhost:4000/components/cms-benefit-summary.js",
  },
  {
    key: "FacilityCard",
    tagName: "cms-facility-card",
    description: "VA facility locator card.",
    example: { facilityName: "VA Portland" },
    bundleUrl: "http://localhost:4000/components/cms-facility-card.js",
  },
];

describe("buildRegistry()", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchSpy: any;

  beforeEach(() => {
    clearRegistryCache();
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("includes an adapter for every CDN entry; cdnAvailable=true", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(CDN_CATALOG), { status: 200 }),
    );

    const { registry, cdnAvailable } = await buildRegistry();

    expect(cdnAvailable).toBe(true);
    for (const { key } of CDN_CATALOG) {
      expect(
        (registry as Record<string, unknown>)[key],
        `registry["${key}"] should be present`,
      ).toBeDefined();
    }
  });

  it("returns cdnAvailable=false and preserves base primitives when fetch fails", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("Network error"));

    const { registry, cdnAvailable } = await buildRegistry();

    expect(cdnAvailable).toBe(false);
    expect((registry as Record<string, unknown>)["Button"]).toBeDefined();
    expect(
      (registry as Record<string, unknown>)["PlanInformation"],
    ).toBeUndefined();
  });

  it("treats non-ok HTTP response same as network failure (cdnAvailable=false)", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("Not Found", { status: 404 }));

    const { cdnAvailable, registry } = await buildRegistry();

    expect(cdnAvailable).toBe(false);
    expect((registry as Record<string, unknown>)["Button"]).toBeDefined();
    expect(
      (registry as Record<string, unknown>)["PlanInformation"],
    ).toBeUndefined();
  });

  it("cdnAvailable=true even when CDN returns empty catalog", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const { cdnAvailable, registry } = await buildRegistry();

    expect(cdnAvailable).toBe(true);
    // No CDN adapters — base primitives intact
    expect((registry as Record<string, unknown>)["Button"]).toBeDefined();
    expect(
      (registry as Record<string, unknown>)["PlanInformation"],
    ).toBeUndefined();
  });

  it("getRegistry() returns same promise on repeated calls; fetch called once", async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify(CDN_CATALOG), { status: 200 }),
    );

    const p1 = getRegistry();
    const p2 = getRegistry();
    expect(p1).toBe(p2);

    await p1;
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("every uswdsComponentDefinitions example validates against its Zod schema", () => {
    for (const [name, def] of Object.entries(uswdsComponentDefinitions)) {
      const result = def.props.safeParse(def.example);
      if (!result.success) {
        throw new Error(
          `Example for "${name}" failed schema validation: ${result.error.message}`,
        );
      }
    }
  });
});

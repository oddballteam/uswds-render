import { describe, expect, it } from "vitest";
import { uswdsComponentDefinitions } from "../src/catalog";
import { uswdsComponents } from "../src/components";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";

describe("uswds catalog contract", () => {
  it("every catalog entry has a matching component implementation", () => {
    const catalogKeys = Object.keys(uswdsComponentDefinitions).sort();
    const componentKeys = Object.keys(uswdsComponents).sort();
    expect(componentKeys).toEqual(catalogKeys);
  });

  it("every example validates against its own schema", () => {
    for (const [name, def] of Object.entries(uswdsComponentDefinitions)) {
      const result = def.props.safeParse(def.example);
      if (!result.success) {
        throw new Error(
          `Example for "${name}" failed schema validation: ${result.error.message}`,
        );
      }
    }
  });

  // Re-enabled in the finalization phase once all 36 components land.
  it.skip("is a key-superset of @json-render/shadcn catalog", () => {
    const shadcnKeys = Object.keys(shadcnComponentDefinitions);
    const uswdsKeys = new Set(Object.keys(uswdsComponentDefinitions));
    const missing = shadcnKeys.filter((k) => !uswdsKeys.has(k));
    expect(missing).toEqual([]);
  });
});

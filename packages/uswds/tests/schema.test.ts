import { describe, expect, it } from "vitest";
import { uswdsComponentDefinitions, UNSUPPORTED_COMPONENTS } from "../src/catalog";

describe("uswds catalog schema contract", () => {
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

  it("UNSUPPORTED_COMPONENTS is exported and is an array", () => {
    expect(Array.isArray(UNSUPPORTED_COMPONENTS)).toBe(true);
    expect(UNSUPPORTED_COMPONENTS.length).toBeGreaterThan(0);
  });

  it("no UNSUPPORTED_COMPONENTS key exists in the catalog", () => {
    const catalogKeys = new Set(Object.keys(uswdsComponentDefinitions));
    const conflicts = (UNSUPPORTED_COMPONENTS as readonly string[]).filter((k) =>
      catalogKeys.has(k),
    );
    expect(conflicts).toEqual([]);
  });
});

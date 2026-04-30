import { describe, it, expect } from "vitest";
import type { Spec } from "@json-render/react";
import { isRenderable, withSafeElementProps } from "@/lib/render/spec-utils";

// Minimal valid spec shape for testing
function makeSpec(overrides: Record<string, unknown> = {}): Spec {
  return {
    root: "root",
    elements: {
      root: { type: "Text", props: { text: "hello" } },
    },
    ...overrides,
  } as unknown as Spec;
}

describe("isRenderable", () => {
  it("returns true for a complete spec", () => {
    expect(isRenderable(makeSpec())).toBe(true);
  });

  it("returns false when root is missing", () => {
    expect(isRenderable(makeSpec({ root: undefined }))).toBe(false);
  });

  it("returns false when root is empty string", () => {
    expect(isRenderable(makeSpec({ root: "" }))).toBe(false);
  });

  it("returns false when elements is missing", () => {
    expect(isRenderable(makeSpec({ elements: undefined }))).toBe(false);
  });

  it("returns false when elements is null", () => {
    expect(isRenderable(makeSpec({ elements: null }))).toBe(false);
  });

  it("returns false when elements is not an object (string)", () => {
    expect(isRenderable(makeSpec({ elements: "bad" }))).toBe(false);
  });

  it("returns false when root key is not in elements", () => {
    expect(
      isRenderable(makeSpec({ root: "missing-key" })),
    ).toBe(false);
  });

  it("returns true when root key exists in elements", () => {
    const spec = makeSpec({
      root: "btn",
      elements: { btn: { type: "Button", props: {} } },
    });
    expect(isRenderable(spec)).toBe(true);
  });
});

describe("withSafeElementProps", () => {
  it("returns spec unchanged when all props are valid objects", () => {
    const spec = makeSpec();
    expect(withSafeElementProps(spec)).toBe(spec);
  });

  it("replaces null props with empty object", () => {
    const spec = makeSpec({
      elements: {
        root: { type: "Text", props: null },
      },
    });
    const result = withSafeElementProps(spec) as unknown as {
      elements: Record<string, { props: unknown }>;
    };
    expect(result.elements.root.props).toEqual({});
  });

  it("replaces array props with empty object", () => {
    const spec = makeSpec({
      elements: {
        root: { type: "Text", props: ["bad"] },
      },
    });
    const result = withSafeElementProps(spec) as unknown as {
      elements: Record<string, { props: unknown }>;
    };
    expect(result.elements.root.props).toEqual({});
  });

  it("replaces string props with empty object", () => {
    const spec = makeSpec({
      elements: {
        root: { type: "Text", props: "bad" },
      },
    });
    const result = withSafeElementProps(spec) as unknown as {
      elements: Record<string, { props: unknown }>;
    };
    expect(result.elements.root.props).toEqual({});
  });

  it("replaces number props with empty object", () => {
    const spec = makeSpec({
      elements: { root: { type: "Text", props: 42 } },
    });
    const result = withSafeElementProps(spec) as unknown as {
      elements: Record<string, { props: unknown }>;
    };
    expect(result.elements.root.props).toEqual({});
  });

  it("fixes only the bad element, leaves valid ones untouched", () => {
    const validEl = { type: "Button", props: { label: "Go" } };
    const spec = makeSpec({
      root: "root",
      elements: {
        root: { type: "Section", props: null },
        btn: validEl,
      },
    });
    const result = withSafeElementProps(spec) as unknown as {
      elements: Record<string, { props: unknown }>;
    };
    expect(result.elements.root.props).toEqual({});
    expect(result.elements.btn.props).toEqual({ label: "Go" });
  });

  it("returns a new spec object (does not mutate) when a fix is needed", () => {
    const spec = makeSpec({
      elements: { root: { type: "Text", props: null } },
    });
    const result = withSafeElementProps(spec);
    expect(result).not.toBe(spec);
  });

  it("returns same spec reference when no fix needed (no copy)", () => {
    const spec = makeSpec();
    expect(withSafeElementProps(spec)).toBe(spec);
  });

  it("returns spec unchanged when elements is missing", () => {
    const spec = makeSpec({ elements: undefined });
    expect(withSafeElementProps(spec)).toBe(spec);
  });
});

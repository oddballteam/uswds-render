import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { createWebComponentAdapter } from "@/lib/render/web-component-envelope";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createWebComponentAdapter", () => {
  it("returns a function component", () => {
    const Adapter = createWebComponentAdapter("cms-test");
    expect(typeof Adapter).toBe("function");
  });

  it("sets displayName", () => {
    const Adapter = createWebComponentAdapter("cms-display", "http://cdn/bundle.js");
    expect(Adapter.displayName).toBe("WebComponent(cms-display)");
  });

  describe("no bundleUrl — renders immediately", () => {
    it("renders the custom element tag", () => {
      const Adapter = createWebComponentAdapter("cms-no-bundle");
      const { container } = render(<Adapter />);
      expect(container.querySelector("cms-no-bundle")).toBeTruthy();
    });

    it("sets kebab-case attributes from camelCase props", () => {
      const Adapter = createWebComponentAdapter("cms-attrs");
      const { container } = render(
        <Adapter props={{ firstName: "Alice", planType: "Medicare" }} />,
      );
      const el = container.querySelector("cms-attrs")!;
      expect(el.getAttribute("first-name")).toBe("Alice");
      expect(el.getAttribute("plan-type")).toBe("Medicare");
    });

    it("converts multi-word camelCase to kebab", () => {
      const Adapter = createWebComponentAdapter("cms-kebab");
      const { container } = render(
        <Adapter props={{ currentStepNumber: "3", estimatedDecisionDate: "June" }} />,
      );
      const el = container.querySelector("cms-kebab")!;
      expect(el.getAttribute("current-step-number")).toBe("3");
      expect(el.getAttribute("estimated-decision-date")).toBe("June");
    });

    it("removes attribute when prop value is null", () => {
      const Adapter = createWebComponentAdapter("cms-null");
      const { container, rerender } = render(
        <Adapter props={{ status: "scheduled" }} />,
      );
      const el = container.querySelector("cms-null")!;
      expect(el.getAttribute("status")).toBe("scheduled");

      rerender(<Adapter props={{ status: null }} />);
      expect(el.getAttribute("status")).toBeNull();
    });

    it("removes attribute when prop value is undefined", () => {
      const Adapter = createWebComponentAdapter("cms-undef");
      const { container, rerender } = render(
        <Adapter props={{ notes: "initial" }} />,
      );
      const el = container.querySelector("cms-undef")!;
      expect(el.getAttribute("notes")).toBe("initial");

      rerender(<Adapter props={{ notes: undefined }} />);
      expect(el.getAttribute("notes")).toBeNull();
    });

    it("envelope props win over top-level props", () => {
      const Adapter = createWebComponentAdapter("cms-merge");
      const { container } = render(
        // @ts-expect-error testing runtime merge behaviour with extra prop
        <Adapter status="top-level" props={{ status: "envelope" }} />,
      );
      const el = container.querySelector("cms-merge")!;
      expect(el.getAttribute("status")).toBe("envelope");
    });

    it("converts prop values to strings for attributes", () => {
      const Adapter = createWebComponentAdapter("cms-types");
      const { container } = render(
        <Adapter props={{ currentStepNumber: 3, active: true }} />,
      );
      const el = container.querySelector("cms-types")!;
      expect(el.getAttribute("current-step-number")).toBe("3");
      expect(el.getAttribute("active")).toBe("true");
    });

    it("ignores emit and children (does not set them as attributes)", () => {
      const emit = vi.fn();
      const Adapter = createWebComponentAdapter("cms-ignore");
      const { container } = render(
        <Adapter emit={emit} props={{ name: "test" }}>
          <span>child</span>
        </Adapter>,
      );
      const el = container.querySelector("cms-ignore")!;
      // emit/children must not appear as attributes
      expect(el.getAttribute("emit")).toBeNull();
      expect(el.getAttribute("children")).toBeNull();
      expect(el.getAttribute("name")).toBe("test");
    });
  });

  describe("with bundleUrl — async loading", () => {
    it("renders null before bundle resolves", () => {
      // import() of an http URL in Node never resolves — loading stays true
      const Adapter = createWebComponentAdapter(
        "cms-loading",
        "http://localhost:4000/never.js",
      );
      const { container } = render(<Adapter props={{ foo: "bar" }} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders the element after bundle load fails (graceful degradation)", async () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      // Node.js cannot import HTTP URLs — the dynamic import will reject,
      // the catch handler sets loaded=true and the component renders.
      const Adapter = createWebComponentAdapter(
        "cms-degraded",
        "http://localhost:4000/will-fail.js",
      );
      const { container } = render(<Adapter props={{ foo: "bar" }} />);

      expect(container.firstChild).toBeNull();

      await waitFor(() => {
        expect(container.querySelector("cms-degraded")).toBeTruthy();
      });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load bundle for <cms-degraded>"),
        expect.anything(),
      );
    });
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Tabs", () => {
  const Tabs = uswdsComponents.Tabs;

  it("renders a tablist", () => {
    render(
      <Tabs
        defaultValue="a"
        items={[
          { value: "a", title: "Tab A", content: "Content A" },
          { value: "b", title: "Tab B", content: "Content B" },
        ]}
      />,
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab A" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab B" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Tabs
        defaultValue="a"
        items={[
          { value: "a", title: "Tab A", content: "Content A" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

const ITEMS = [
  {
    id: "acc-1",
    title: "First section",
    content: "First content",
    expanded: false,
    headingLevel: "h4" as const,
  },
  {
    id: "acc-2",
    title: "Second section",
    content: "Second content",
    expanded: true,
    headingLevel: "h4" as const,
  },
];

describe("Accordion", () => {
  const Accordion = uswdsComponents.Accordion as React.ComponentType<any>;

  it("renders all item titles", () => {
    render(<Accordion items={ITEMS} />);
    expect(screen.getByText("First section")).toBeInTheDocument();
    expect(screen.getByText("Second section")).toBeInTheDocument();
  });

  it("applies usa-accordion class", () => {
    const { container } = render(<Accordion items={ITEMS} />);
    expect(container.querySelector(".usa-accordion")).toBeInTheDocument();
  });

  it("renders bordered variant", () => {
    const { container } = render(<Accordion items={ITEMS} bordered />);
    expect(container.querySelector(".usa-accordion--bordered")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Accordion items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(<Accordion items={[]} props={{ items: ITEMS }} />);
    expect(screen.getByText("First section")).toBeInTheDocument();
  });

  it("renders with empty items array without crashing", () => {
    expect(() => render(<Accordion items={[]} />)).not.toThrow();
  });
});

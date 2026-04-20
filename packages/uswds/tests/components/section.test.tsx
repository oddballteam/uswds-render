import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { uswdsComponents } from "../../src/components";

describe("Section", () => {
  const Section = uswdsComponents.Section as React.ComponentType<any>;

  it("renders children inside a div", () => {
    render(<Section>Hello</Section>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <Section>
        <span>A</span>
        <span>B</span>
      </Section>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders as a div with no USWDS class", () => {
    const { container } = render(<Section>Content</Section>);
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    expect(div?.className).toBe("");
  });

  it("merges envelope props", () => {
    render(<Section props={{}}>Envelope</Section>);
    expect(screen.getByText("Envelope")).toBeInTheDocument();
  });
});

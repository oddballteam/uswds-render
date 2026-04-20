import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Card", () => {
  const Card = uswdsComponents.Card as React.ComponentType<any>;

  it("renders children inside a card", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Card>Card content</Card>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders as a div element (not li)", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector("div.usa-card")).toBeInTheDocument();
    expect(container.querySelector("li")).not.toBeInTheDocument();
  });

  it("applies usa-card class", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector(".usa-card")).toBeInTheDocument();
  });

  it("renders flagDefault layout", () => {
    const { container } = render(<Card layout="flagDefault">Content</Card>);
    expect(container.querySelector(".usa-card--flag")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <Card props={{ layout: "flagDefault" }}>Content</Card>
    );
    expect(container.querySelector(".usa-card--flag")).toBeInTheDocument();
  });

  it("can be nested without invalid HTML", () => {
    const { container } = render(
      <Card>
        <Card>Nested</Card>
      </Card>
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(container.querySelector("li")).not.toBeInTheDocument();
  });
});

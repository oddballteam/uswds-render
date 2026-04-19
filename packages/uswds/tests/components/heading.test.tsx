import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Heading", () => {
  const Heading = uswdsComponents.Heading as React.ComponentType<any>;

  it("renders text prop as heading content", () => {
    render(<Heading level="h2" text="Hello world" />);
    expect(screen.getByRole("heading", { name: "Hello world" })).toBeInTheDocument();
  });

  it("renders children when text prop is absent", () => {
    render(<Heading level="h3">Children heading</Heading>);
    expect(screen.getByRole("heading", { name: "Children heading" })).toBeInTheDocument();
  });

  it("defaults to h2 when level is not provided", () => {
    render(<Heading text="Default level" />);
    expect(screen.getByRole("heading", { name: "Default level", level: 2 })).toBeInTheDocument();
  });

  it("applies usa-prose class", () => {
    const { container } = render(<Heading level="h2" text="Styled" />);
    const heading = container.querySelector("h2");
    expect(heading?.className).toMatch(/usa-prose/);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Heading level="h2" text="Accessible" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(<Heading level="h3" props={{ text: "Envelope text", level: "h4" }} />);
    expect(screen.getByRole("heading", { name: "Envelope text", level: 4 })).toBeInTheDocument();
  });
});

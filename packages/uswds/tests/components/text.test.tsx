import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Text", () => {
  const Text = uswdsComponents.Text as React.ComponentType<any>;

  it("renders text prop as paragraph content", () => {
    render(<Text text="Hello paragraph" />);
    expect(screen.getByText("Hello paragraph")).toBeInTheDocument();
  });

  it("renders children when text prop is absent", () => {
    render(<Text>Children text</Text>);
    expect(screen.getByText("Children text")).toBeInTheDocument();
  });

  it("defaults to p element", () => {
    const { container } = render(<Text text="Default" />);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders as span when as='span'", () => {
    const { container } = render(<Text as="span" text="Inline" />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders as div when as='div'", () => {
    const { container } = render(<Text as="div" text="Block" />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("applies size class for xs", () => {
    const { container } = render(<Text size="xs" text="Tiny" />);
    const el = container.querySelector("p");
    expect(el?.className).toMatch(/font-sans-xs/);
  });

  it("applies size class for lg", () => {
    const { container } = render(<Text size="lg" text="Large" />);
    const el = container.querySelector("p");
    expect(el?.className).toMatch(/font-sans-lg/);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Text text="Accessible" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(<Text as="p" props={{ text: "Envelope text" }} />);
    expect(screen.getByText("Envelope text")).toBeInTheDocument();
  });
});

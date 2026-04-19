import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Button", () => {
  const Button = uswdsComponents.Button;

  it("renders with required props", () => {
    render(<Button type="button">Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Button type="button">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("forwards native onClick when emit is absent", () => {
    const onClick = vi.fn();
    render(<Button type="button" onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls emit('press') when emit is provided and button is clicked", () => {
    const emit = vi.fn();
    render(<Button type="button" emit={emit}>Submit</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(emit).toHaveBeenCalledWith("press");
  });

  it("renders as secondary variant", () => {
    const { container } = render(<Button type="button" variant="secondary">Secondary</Button>);
    expect(container.querySelector(".usa-button--secondary")).toBeInTheDocument();
  });

  it("renders as outline variant", () => {
    const { container } = render(<Button type="button" variant="outline">Outline</Button>);
    expect(container.querySelector(".usa-button--outline")).toBeInTheDocument();
  });

  it("renders as big size", () => {
    const { container } = render(<Button type="button" size="big">Big</Button>);
    expect(container.querySelector(".usa-button--big")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button type="button" disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("merges envelope props over rest props", () => {
    render(<Button type="button" props={{ disabled: true }}>Merged</Button>);
    expect(screen.getByRole("button", { name: "Merged" })).toBeDisabled();
  });
});

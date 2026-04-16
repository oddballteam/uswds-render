import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Toggle", () => {
  const Toggle = uswdsComponents.Toggle;

  it("renders with aria-pressed", () => {
    render(<Toggle pressed={false}>Bold</Toggle>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Toggle pressed={false}>Bold</Toggle>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Checkbox", () => {
  const Checkbox = uswdsComponents.Checkbox;

  it("renders with accessible name", () => {
    render(<Checkbox label="Subscribe" />);
    expect(
      screen.getByRole("checkbox", { name: "Subscribe" }),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Checkbox label="Subscribe" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

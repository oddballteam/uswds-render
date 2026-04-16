import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Switch", () => {
  const Switch = uswdsComponents.Switch;

  it("renders with accessible name", () => {
    render(<Switch label="Notifications" />);
    expect(
      screen.getByRole("switch", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Switch label="Notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Popover", () => {
  const Popover = uswdsComponents.Popover;

  it("renders trigger button", () => {
    render(
      <Popover side="bottom">
        <p>Popover content</p>
      </Popover>,
    );
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Popover side="bottom">
        <p>Popover content</p>
      </Popover>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

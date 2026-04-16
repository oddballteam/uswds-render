import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Collapsible", () => {
  const Collapsible = uswdsComponents.Collapsible;

  it("renders trigger button with title", () => {
    render(<Collapsible title="Details">Hidden content</Collapsible>);
    expect(
      screen.getByRole("button", { name: "Details" }),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Collapsible title="Details">Hidden content</Collapsible>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

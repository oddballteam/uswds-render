import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Separator", () => {
  const Separator = uswdsComponents.Separator;

  it("renders with required props", () => {
    render(<Separator orientation="horizontal" />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Separator orientation="horizontal" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Badge", () => {
  const Badge = uswdsComponents.Badge;

  it("renders with required props", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Badge>Active</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

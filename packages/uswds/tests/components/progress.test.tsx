import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Progress", () => {
  const Progress = uswdsComponents.Progress;

  it("renders with required props", () => {
    render(<Progress value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Progress value={40} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

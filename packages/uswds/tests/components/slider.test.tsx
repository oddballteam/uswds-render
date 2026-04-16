import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Slider", () => {
  const Slider = uswdsComponents.Slider;

  it("renders with slider role", () => {
    render(<Slider label="Volume" min={0} max={100} value={50} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Slider label="Volume" min={0} max={100} value={50} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

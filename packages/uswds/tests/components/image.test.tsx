import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Image", () => {
  const Image = uswdsComponents.Image;

  it("renders with required props", () => {
    render(<Image src="/test.png" alt="Logo" />);
    expect(screen.getByRole("img", { name: "Logo" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Image src="/test.png" alt="Logo" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

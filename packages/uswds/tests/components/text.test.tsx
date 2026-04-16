import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Text", () => {
  const Text = uswdsComponents.Text;

  it("renders with required props", () => {
    render(<Text size="base">Hello</Text>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Text size="base">Hello</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

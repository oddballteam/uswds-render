import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Spinner", () => {
  const Spinner = uswdsComponents.Spinner;

  it("renders with animate-spin class", () => {
    const { container } = render(<Spinner size="md" />);
    expect(container.querySelector("svg")).toHaveClass("animate-spin");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Spinner size="md" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

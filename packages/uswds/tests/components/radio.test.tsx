import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Radio", () => {
  const Radio = uswdsComponents.Radio;

  const options = [
    { value: "s", label: "Small" },
    { value: "m", label: "Medium" },
    { value: "l", label: "Large" },
  ];

  it("renders all radio options", () => {
    render(<Radio label="Size" options={options} />);
    expect(screen.getAllByRole("radio")).toHaveLength(options.length);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Radio label="Size" options={options} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Select", () => {
  const Select = uswdsComponents.Select;

  it("renders with label and combobox role", () => {
    render(
      <Select
        label="State"
        options={[{ value: "va", label: "Virginia" }]}
      />,
    );
    expect(
      screen.getByRole("combobox", { name: "State" }),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Select
        label="State"
        options={[{ value: "va", label: "Virginia" }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

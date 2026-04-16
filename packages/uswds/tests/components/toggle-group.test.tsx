import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("ToggleGroup", () => {
  const ToggleGroup = uswdsComponents.ToggleGroup;

  it("renders N buttons matching options", () => {
    render(
      <ToggleGroup
        type="single"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
          { value: "c", label: "C" },
        ]}
      />,
    );
    const buttons = screen.getAllByRole("radio");
    expect(buttons).toHaveLength(3);
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ToggleGroup
        type="single"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

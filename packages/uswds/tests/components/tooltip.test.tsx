import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Tooltip", () => {
  const Tooltip = uswdsComponents.Tooltip;

  it("renders trigger child without error", () => {
    const { container } = render(
      <Tooltip content="More info">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(container.querySelector("button")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Tooltip content="More info">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

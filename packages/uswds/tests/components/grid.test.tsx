import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Grid", () => {
  const Grid = uswdsComponents.Grid;

  it("renders with required props", () => {
    const { container } = render(
      <Grid columns={3} gap="md">
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass("grid");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Grid columns={3} gap="md">
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Grid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

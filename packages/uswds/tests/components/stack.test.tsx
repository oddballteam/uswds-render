import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Stack", () => {
  const Stack = uswdsComponents.Stack;

  it("renders with required props", () => {
    const { container } = render(
      <Stack direction="vertical" gap="md">
        <span>a</span>
        <span>b</span>
      </Stack>,
    );
    expect(container.firstChild).toHaveClass("flex", "flex-col");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Stack direction="vertical" gap="md">
        <span>a</span>
        <span>b</span>
      </Stack>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

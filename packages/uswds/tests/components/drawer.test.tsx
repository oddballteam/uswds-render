import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Drawer", () => {
  const Drawer = uswdsComponents.Drawer;

  it("renders without error", () => {
    const { container } = render(
      <Drawer title="Settings" direction="bottom">
        <p>Drawer content</p>
      </Drawer>,
    );
    // Drawer with open=false (default) should mount without error
    expect(container).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Drawer title="Settings" direction="bottom">
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

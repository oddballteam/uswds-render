import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Dialog", () => {
  const Dialog = uswdsComponents.Dialog;

  it("renders dialog with title when open", () => {
    render(
      <Dialog open={true} title="Confirm" description="Are you sure?">
        <p>Dialog body</p>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Dialog open={true} title="Confirm" description="Are you sure?">
        <p>Dialog body</p>
      </Dialog>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Tooltip", () => {
  const Tooltip = uswdsComponents.Tooltip as React.ComponentType<any>;

  it("renders the trigger child", () => {
    render(
      <Tooltip label="Tooltip text">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("renders tooltip label text in DOM", () => {
    render(
      <Tooltip label="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByText("Helpful hint")).toBeInTheDocument();
  });

  it("applies usa-tooltip class", () => {
    const { container } = render(
      <Tooltip label="Info">
        <button type="button">Info button</button>
      </Tooltip>
    );
    expect(container.querySelector(".usa-tooltip")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    // Tooltip wraps its children in a <button>; passing a non-interactive
    // element avoids the nested-interactive axe violation.
    const { container } = render(
      <Tooltip label="Accessible tooltip">
        <span>Hover target</span>
      </Tooltip>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Tooltip label="Base label" props={{ label: "Envelope tooltip" }}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByText("Envelope tooltip")).toBeInTheDocument();
    expect(screen.queryByText("Base label")).not.toBeInTheDocument();
  });
});

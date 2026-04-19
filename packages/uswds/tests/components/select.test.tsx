import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

const OPTIONS = [
  { value: "va", label: "Virginia" },
  { value: "md", label: "Maryland" },
  { value: "dc", label: "DC" },
];

describe("Select", () => {
  const Select = uswdsComponents.Select as React.ComponentType<any>;

  it("renders a select element", () => {
    render(<Select id="state" name="state" options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select id="state" name="state" options={OPTIONS} />);
    expect(screen.getByRole("option", { name: "Virginia" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Maryland" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DC" })).toBeInTheDocument();
  });

  it("renders with label when label prop is provided", () => {
    render(
      <Select id="state" name="state" label="State" options={OPTIONS} />
    );
    expect(screen.getByLabelText("State")).toBeInTheDocument();
  });

  it("applies usa-select class", () => {
    const { container } = render(
      <Select id="s" name="s" options={OPTIONS} />
    );
    expect(container.querySelector(".usa-select")).toBeInTheDocument();
  });

  it("has no a11y violations with label", async () => {
    const { container } = render(
      <Select id="a11y" name="a11y" label="Accessible select" options={OPTIONS} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Select
        id="base"
        name="base"
        options={[]}
        props={{ label: "Envelope label", id: "env-sel", name: "envSel", options: OPTIONS }}
      />
    );
    expect(screen.getByLabelText("Envelope label")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Virginia" })).toBeInTheDocument();
  });
});

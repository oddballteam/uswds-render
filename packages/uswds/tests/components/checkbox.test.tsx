import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Checkbox", () => {
  const Checkbox = uswdsComponents.Checkbox as React.ComponentType<any>;

  it("renders a checkbox input", () => {
    render(<Checkbox id="agree" name="agree" label="I agree" />);
    expect(screen.getByRole("checkbox", { name: "I agree" })).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<Checkbox id="terms" name="terms" label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders tile variant", () => {
    const { container } = render(
      <Checkbox id="tile" name="tile" label="Tile option" tile />
    );
    expect(container.querySelector(".usa-checkbox__input--tile")).toBeInTheDocument();
  });

  it("applies usa-checkbox class", () => {
    const { container } = render(
      <Checkbox id="cb" name="cb" label="Check" />
    );
    expect(container.querySelector(".usa-checkbox")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Checkbox id="a11y" name="a11y" label="Accessible checkbox" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Checkbox
        id="base"
        name="base"
        label="Base label"
        props={{ label: "Envelope label", id: "env-cb", name: "envCb" }}
      />
    );
    expect(screen.getByRole("checkbox", { name: "Envelope label" })).toBeInTheDocument();
  });
});

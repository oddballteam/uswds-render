import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Radio", () => {
  const Radio = uswdsComponents.Radio as React.ComponentType<any>;

  it("renders a radio input", () => {
    render(<Radio id="opt-a" name="choice" label="Option A" />);
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<Radio id="opt-b" name="choice" label="Option B" />);
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("renders tile variant", () => {
    const { container } = render(
      <Radio id="tile" name="tile" label="Tile radio" tile />
    );
    expect(container.querySelector(".usa-radio__input--tile")).toBeInTheDocument();
  });

  it("applies usa-radio class", () => {
    const { container } = render(
      <Radio id="r" name="r" label="Radio" />
    );
    expect(container.querySelector(".usa-radio")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Radio id="a11y" name="a11y-group" label="Accessible radio" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("multiple radios sharing a name form a group", () => {
    render(
      <>
        <Radio id="opt-1" name="group" label="One" />
        <Radio id="opt-2" name="group" label="Two" />
        <Radio id="opt-3" name="group" label="Three" />
      </>
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    radios.forEach((r) => expect(r).toHaveAttribute("name", "group"));
  });

  it("merges envelope props", () => {
    render(
      <Radio
        id="base"
        name="base"
        label="Base label"
        props={{ label: "Envelope label", id: "env-r", name: "envRadio" }}
      />
    );
    expect(screen.getByRole("radio", { name: "Envelope label" })).toBeInTheDocument();
  });
});

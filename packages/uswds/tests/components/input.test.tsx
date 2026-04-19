import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Input (TextInput)", () => {
  const Input = uswdsComponents.Input as React.ComponentType<any>;

  it("renders with required id and name", () => {
    render(<Input id="first-name" name="firstName" type="text" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a label when label prop is provided", () => {
    render(
      <Input id="email" name="email" type="email" label="Email address" />
    );
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("renders hint text when hint prop is provided", () => {
    render(
      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone"
        hint="Format: 555-555-5555"
      />
    );
    expect(screen.getByText("Format: 555-555-5555")).toBeInTheDocument();
  });

  it("applies error validation status", () => {
    const { container } = render(
      <Input id="bad" name="bad" type="text" validationStatus="error" />
    );
    expect(container.querySelector(".usa-input--error")).toBeInTheDocument();
  });

  it("applies success validation status", () => {
    const { container } = render(
      <Input id="good" name="good" type="text" validationStatus="success" />
    );
    expect(container.querySelector(".usa-input--success")).toBeInTheDocument();
  });

  it("has no a11y violations with label", async () => {
    const { container } = render(
      <Input id="a11y" name="a11y" type="text" label="Accessible input" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Input
        id="base"
        name="base"
        type="text"
        props={{ label: "Envelope label", id: "env-input", name: "envInput" }}
      />
    );
    expect(screen.getByLabelText("Envelope label")).toBeInTheDocument();
  });
});

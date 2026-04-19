import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Textarea", () => {
  const Textarea = uswdsComponents.Textarea as React.ComponentType<any>;

  it("renders a textarea element", () => {
    render(<Textarea id="comments" name="comments" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with label when label prop is provided", () => {
    render(
      <Textarea id="comments" name="comments" label="Your comments" />
    );
    expect(screen.getByLabelText("Your comments")).toBeInTheDocument();
  });

  it("renders hint text when hint prop is provided", () => {
    render(
      <Textarea
        id="bio"
        name="bio"
        label="Bio"
        hint="Max 500 characters"
      />
    );
    expect(screen.getByText("Max 500 characters")).toBeInTheDocument();
  });

  it("sets rows attribute", () => {
    render(<Textarea id="notes" name="notes" rows={6} />);
    const el = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(el.rows).toBe(6);
  });

  it("applies usa-textarea class", () => {
    const { container } = render(<Textarea id="t" name="t" />);
    expect(container.querySelector(".usa-textarea")).toBeInTheDocument();
  });

  it("has no a11y violations with label", async () => {
    const { container } = render(
      <Textarea id="a11y" name="a11y" label="Accessible textarea" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Textarea
        id="base"
        name="base"
        props={{ label: "Envelope label", id: "env-ta", name: "envTa" }}
      />
    );
    expect(screen.getByLabelText("Envelope label")).toBeInTheDocument();
  });
});

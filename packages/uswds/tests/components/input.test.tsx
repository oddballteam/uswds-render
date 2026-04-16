import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Input", () => {
  const Input = uswdsComponents.Input;

  it("renders with label and placeholder", () => {
    render(<Input label="Name" placeholder="Jane Doe" type="text" />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Doe")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Input label="Name" placeholder="Jane Doe" type="text" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

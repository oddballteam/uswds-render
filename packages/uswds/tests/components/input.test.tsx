import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("supports controlled value with onChange", () => {
    const onChange = vi.fn();
    render(
      <Input
        label="Name"
        placeholder="Jane Doe"
        type="text"
        value="a"
        onChange={onChange}
      />,
    );
    const field = screen.getByLabelText("Name");
    expect(field).toHaveValue("a");
    fireEvent.change(field, { target: { value: "ab" } });
    expect(onChange).toHaveBeenCalled();
  });
});

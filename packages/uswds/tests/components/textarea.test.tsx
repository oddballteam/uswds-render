import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Textarea", () => {
  const Textarea = uswdsComponents.Textarea;

  it("renders with label and placeholder", () => {
    render(<Textarea label="Comments" placeholder="Enter your comments" />);
    expect(screen.getByLabelText("Comments")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your comments"),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Textarea label="Comments" placeholder="Enter your comments" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("supports controlled value with onChange", () => {
    const onChange = vi.fn();
    render(
      <Textarea
        label="Comments"
        placeholder="Enter your comments"
        value="hello"
        onChange={onChange}
      />,
    );
    const field = screen.getByLabelText("Comments");
    expect(field).toHaveValue("hello");
    fireEvent.change(field, { target: { value: "hello!" } });
    expect(onChange).toHaveBeenCalled();
  });
});

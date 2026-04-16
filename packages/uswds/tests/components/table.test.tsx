import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Table", () => {
  const Table = uswdsComponents.Table;

  it("renders with required props", () => {
    render(<Table caption="Users">Table content</Table>);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Table caption="Users">Table content</Table>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

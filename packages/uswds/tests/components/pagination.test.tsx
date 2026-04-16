import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Pagination", () => {
  const Pagination = uswdsComponents.Pagination;

  it("renders navigation with current page", () => {
    render(<Pagination currentPage={3} totalPages={10} />);
    expect(
      screen.getByRole("navigation", { name: /pagination/i }),
    ).toBeInTheDocument();
    const currentBtn = screen.getByRole("button", { name: "3" });
    expect(currentBtn).toHaveAttribute("aria-current", "page");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Pagination currentPage={3} totalPages={10} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

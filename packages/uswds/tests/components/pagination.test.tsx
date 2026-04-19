import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { configureAxe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

// Truss Pagination has known non-blocking issues in jsdom:
// - list rule: role=presentation children in <ul> (Truss internal markup)
// - svg-img-alt: navigation SVG icons lack aria labels (Truss component bug)
const axeWithExclusions = configureAxe({ rules: { list: { enabled: false }, "svg-img-alt": { enabled: false } } });

describe("Pagination", () => {
  const Pagination = uswdsComponents.Pagination as React.ComponentType<any>;

  it("renders pagination navigation", () => {
    render(<Pagination pathname="/results" currentPage={3} totalPages={10} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("applies usa-pagination class", () => {
    const { container } = render(
      <Pagination pathname="/results" currentPage={1} totalPages={5} />
    );
    expect(container.querySelector(".usa-pagination")).toBeInTheDocument();
  });

  it("renders page numbers", () => {
    render(<Pagination pathname="/results" currentPage={1} totalPages={5} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("has no critical a11y violations", async () => {
    const { container } = render(
      <Pagination pathname="/results" currentPage={2} totalPages={8} />
    );
    expect(await axeWithExclusions(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <Pagination
        pathname="/base"
        currentPage={1}
        totalPages={1}
        props={{ pathname: "/results", currentPage: 5, totalPages: 10 }}
      />
    );
    expect(container.querySelector(".usa-pagination")).toBeInTheDocument();
  });
});

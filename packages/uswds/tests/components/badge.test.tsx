import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Badge (Tag)", () => {
  const Badge = uswdsComponents.Badge;

  it("renders with text prop", () => {
    render(<Badge text="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders children when text prop is absent", () => {
    render(<Badge>Fallback</Badge>);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Badge text="Active" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the usa-tag class from Truss Tag", () => {
    const { container } = render(<Badge text="Tag" />);
    expect(container.querySelector(".usa-tag")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<Badge props={{ text: "Envelope text" }} />);
    expect(screen.getByText("Envelope text")).toBeInTheDocument();
  });
});

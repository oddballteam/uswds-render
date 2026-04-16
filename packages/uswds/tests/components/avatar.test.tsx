import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Avatar", () => {
  const Avatar = uswdsComponents.Avatar;

  it("renders fallback initials when src absent", () => {
    render(<Avatar fallback="JD" size="md" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Avatar fallback="JD" size="md" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

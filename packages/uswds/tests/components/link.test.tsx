import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Link", () => {
  const Link = uswdsComponents.Link;

  it("renders with required props", () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Link href="/about">About</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

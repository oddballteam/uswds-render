import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Heading", () => {
  const Heading = uswdsComponents.Heading;

  it("renders with required props", () => {
    render(<Heading level="h2">Title</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Title");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Heading level="h2">Title</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

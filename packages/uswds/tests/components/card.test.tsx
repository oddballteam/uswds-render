import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Card", () => {
  const Card = uswdsComponents.Card;

  it("renders with required props", () => {
    render(
      <Card title="Overview" description="Summary">
        <p>Body</p>
      </Card>,
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Card title="Overview" description="Summary">
        <p>Body</p>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

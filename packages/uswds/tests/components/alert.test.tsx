import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Alert", () => {
  const Alert = uswdsComponents.Alert;

  it("renders with required props", () => {
    render(<Alert variant="info" title="Heads up">Alert body</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Alert variant="info" title="Heads up">Alert body</Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

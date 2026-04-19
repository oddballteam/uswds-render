import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Alert", () => {
  const Alert = uswdsComponents.Alert;

  it("renders with required props", () => {
    render(<Alert type="info" headingLevel="h4" heading="Heads up">Alert body text</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Alert type="info" headingLevel="h4" heading="Heads up">Alert body text</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders success variant", () => {
    const { container } = render(<Alert type="success" headingLevel="h4" heading="Done">Success body</Alert>);
    expect(container.querySelector(".usa-alert--success")).toBeInTheDocument();
  });

  it("renders slim variant", () => {
    const { container } = render(<Alert type="info" headingLevel="h4" slim>Slim alert</Alert>);
    expect(container.querySelector(".usa-alert--slim")).toBeInTheDocument();
  });

  it("renders noIcon variant", () => {
    const { container } = render(<Alert type="info" headingLevel="h4" noIcon>No icon</Alert>);
    expect(container.querySelector(".usa-alert--no-icon")).toBeInTheDocument();
  });

  it("accepts variant prop as alias for type", () => {
    const { container } = render(<Alert variant="success" headingLevel="h4" heading="Via variant">Body</Alert>);
    expect(container.querySelector(".usa-alert--success")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<Alert type="info" headingLevel="h4" props={{ heading: "Envelope heading" }}>Body</Alert>);
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("ButtonGroup", () => {
  const ButtonGroup = uswdsComponents.ButtonGroup;
  const Button = uswdsComponents.Button;

  it("renders children buttons", () => {
    render(<ButtonGroup><Button type="button">One</Button><Button type="button">Two</Button></ButtonGroup>);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<ButtonGroup><Button type="button">One</Button></ButtonGroup>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the usa-button-group class from Truss", () => {
    const { container } = render(<ButtonGroup><Button type="button">A</Button></ButtonGroup>);
    expect(container.querySelector(".usa-button-group")).toBeInTheDocument();
  });

  it("renders segmented type", () => {
    const { container } = render(<ButtonGroup type="segmented"><Button type="button">A</Button><Button type="button">B</Button></ButtonGroup>);
    expect(container.querySelector(".usa-button-group--segmented")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    const { container } = render(<ButtonGroup props={{ type: "segmented" }}><Button type="button">Y</Button></ButtonGroup>);
    expect(container.querySelector(".usa-button-group--segmented")).toBeInTheDocument();
  });
});

import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Grid", () => {
  const Grid = uswdsComponents.Grid as React.ComponentType<any>;

  it("renders children", () => {
    render(<Grid>Grid content</Grid>);
    expect(screen.getByText("Grid content")).toBeInTheDocument();
  });

  it("applies grid-row class when row prop is true", () => {
    const { container } = render(<Grid row>Row content</Grid>);
    expect(container.querySelector(".grid-row")).toBeInTheDocument();
  });

  it("applies column class when col prop is set", () => {
    const { container } = render(<Grid col={6}>Column</Grid>);
    expect(container.querySelector(".grid-col-6")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Grid col={12}>Content</Grid>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    const { container } = render(<Grid props={{ col: 4 }}>Content</Grid>);
    expect(container.querySelector(".grid-col-4")).toBeInTheDocument();
  });
});

describe("GridContainer", () => {
  const GridContainer = uswdsComponents.GridContainer as React.ComponentType<any>;

  it("renders children", () => {
    render(<GridContainer>Container content</GridContainer>);
    expect(screen.getByText("Container content")).toBeInTheDocument();
  });

  it("applies grid-container class", () => {
    const { container } = render(<GridContainer>Container</GridContainer>);
    expect(container.querySelector(".grid-container")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<GridContainer>Container</GridContainer>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <GridContainer props={{ className: "custom-container" }}>Content</GridContainer>
    );
    expect(container.querySelector(".custom-container")).toBeInTheDocument();
  });
});

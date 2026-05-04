import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Table", () => {
  const Table = uswdsComponents.Table as React.ComponentType<any>;

  it("drops children — Table renders no arbitrary child elements", () => {
    // Table intentionally ignores children. Passing div-rendering components
    // (Section, Card, etc.) as children of <table> causes a hydration crash
    // because <div> is not a valid child of <table>. The catalog rule is
    // "Table has no children" — this test enforces the adapter honours it.
    const { container } = render(
      <Table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
      </Table>
    );
    expect(container.querySelector("thead")).toBeNull();
    expect(container.querySelector(".usa-table")).toBeInTheDocument();
  });

  it("renders a caption when provided", () => {
    render(
      <Table caption="User list">
        <tbody>
          <tr>
            <td>Row</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText("User list")).toBeInTheDocument();
  });

  it("applies usa-table class", () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>X</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(container.querySelector(".usa-table")).toBeInTheDocument();
  });

  it("renders striped variant", () => {
    const { container } = render(
      <Table striped>
        <tbody>
          <tr>
            <td>X</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(container.querySelector(".usa-table--striped")).toBeInTheDocument();
  });

  it("renders compact variant", () => {
    const { container } = render(
      <Table compact>
        <tbody>
          <tr>
            <td>X</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(container.querySelector(".usa-table--compact")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Table caption="Test table">
        <thead>
          <tr>
            <th scope="col">Column</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Value</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <Table props={{ striped: true }}>
        <tbody>
          <tr>
            <td>X</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(container.querySelector(".usa-table--striped")).toBeInTheDocument();
  });
});

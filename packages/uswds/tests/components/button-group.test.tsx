import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("ButtonGroup", () => {
  const ButtonGroup = uswdsComponents.ButtonGroup;
  const Button = uswdsComponents.Button;

  it("renders children buttons in a flex container", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

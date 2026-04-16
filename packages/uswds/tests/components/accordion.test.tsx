import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Accordion", () => {
  const Accordion = uswdsComponents.Accordion;

  it("renders trigger buttons for items", () => {
    render(
      <Accordion
        type="single"
        items={[
          { value: "one", title: "Section 1", content: "Content 1" },
          { value: "two", title: "Section 2", content: "Content 2" },
        ]}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Section 1/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Section 2/ }),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Accordion
        type="single"
        items={[
          { value: "one", title: "Section 1", content: "Content 1" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("DropdownMenu", () => {
  const DropdownMenu = uswdsComponents.DropdownMenu;

  it("renders trigger", () => {
    render(
      <DropdownMenu
        items={[
          { value: "edit", label: "Edit" },
          { value: "delete", label: "Delete" },
        ]}
      >
        <button>Actions</button>
      </DropdownMenu>,
    );
    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <DropdownMenu
        items={[
          { value: "edit", label: "Edit" },
          { value: "delete", label: "Delete" },
        ]}
      >
        <button>Actions</button>
      </DropdownMenu>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

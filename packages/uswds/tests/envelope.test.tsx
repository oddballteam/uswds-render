import * as React from "react";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { uswdsComponents } from "../src/components";
import { uswdsComponentDefinitions } from "../src/catalog";

// The production code path: `@json-render/react` invokes each adapter as
// `<Component props={...} emit={...}>{slot}</Component>` (the "envelope" shape),
// not the plain-React-prop shape that the per-component tests cover. If an
// adapter forgets to merge `envelopeProps`, every other test still passes
// because they bypass the envelope. This file is the only thing that catches
// that regression — one parameterized test per registered component, each
// driven by the catalog `example`.

type Fixture = {
  children?: ReactNode;
  // `assert` runs after the component has rendered; if `"no-throw"`, only
  // verify that rendering didn't throw (used for closed dialogs/drawers/
  // tooltips that produce no observable DOM).
  assert: (() => void) | "no-throw";
};

type ComponentName = keyof typeof uswdsComponentDefinitions;

const FIXTURES: Record<ComponentName, Fixture> = {
  Button: {
    children: "Click me",
    assert: () =>
      expect(
        screen.getByRole("button", { name: "Click me" }),
      ).toBeInTheDocument(),
  },
  Card: {
    children: "card body",
    assert: () =>
      expect(screen.getByText("Overview")).toBeInTheDocument(),
  },
  Stack: {
    children: <span>stack child</span>,
    assert: () =>
      expect(screen.getByText("stack child")).toBeInTheDocument(),
  },
  Grid: {
    children: <span>grid child</span>,
    assert: () =>
      expect(screen.getByText("grid child")).toBeInTheDocument(),
  },
  Separator: {
    assert: () =>
      expect(screen.getByRole("separator")).toBeInTheDocument(),
  },
  Heading: {
    assert: () =>
      expect(
        screen.getByRole("heading", { name: "Welcome" }),
      ).toBeInTheDocument(),
  },
  Text: {
    assert: () =>
      expect(screen.getByText("Hello, world!")).toBeInTheDocument(),
  },
  Image: {
    assert: () =>
      expect(
        screen.getByRole("img", { name: "Logo" }),
      ).toBeInTheDocument(),
  },
  Avatar: {
    assert: () => expect(screen.getByText("JD")).toBeInTheDocument(),
  },
  Badge: {
    assert: () => expect(screen.getByText("Active")).toBeInTheDocument(),
  },
  Alert: {
    children: "alert body",
    assert: () => expect(screen.getByText("Heads up")).toBeInTheDocument(),
  },
  Progress: {
    assert: () =>
      expect(screen.getByRole("progressbar")).toBeInTheDocument(),
  },
  Skeleton: { assert: "no-throw" },
  Spinner: { assert: "no-throw" },
  Table: {
    children: (
      <tbody>
        <tr>
          <td>cell</td>
        </tr>
      </tbody>
    ),
    assert: () => expect(screen.getByText("Users")).toBeInTheDocument(),
  },
  Radio: {
    assert: () => expect(screen.getByText("Size")).toBeInTheDocument(),
  },
  Checkbox: {
    assert: () =>
      expect(
        screen.getByRole("checkbox", { name: "Subscribe" }),
      ).toBeInTheDocument(),
  },
  Select: {
    assert: () => expect(screen.getByText("State")).toBeInTheDocument(),
  },
  Textarea: {
    assert: () => expect(screen.getByText("Comments")).toBeInTheDocument(),
  },
  Input: {
    assert: () => expect(screen.getByText("Name")).toBeInTheDocument(),
  },
  ButtonGroup: {
    children: (
      <button type="button">btn</button>
    ),
    assert: () =>
      expect(
        screen.getByRole("button", { name: "btn" }),
      ).toBeInTheDocument(),
  },
  Link: {
    assert: () =>
      expect(
        screen.getByRole("link", { name: "Learn more" }),
      ).toBeInTheDocument(),
  },
  Slider: {
    assert: () => expect(screen.getByText("Volume")).toBeInTheDocument(),
  },
  Tabs: {
    assert: () =>
      expect(screen.getByRole("tab", { name: "Tab A" })).toBeInTheDocument(),
  },
  Collapsible: {
    children: "collapsible body",
    assert: () =>
      expect(
        screen.getByRole("button", { name: "Details" }),
      ).toBeInTheDocument(),
  },
  Accordion: {
    assert: () =>
      expect(
        screen.getByRole("button", { name: /Section 1/ }),
      ).toBeInTheDocument(),
  },
  ToggleGroup: {
    // Radix gives single-mode ToggleGroup items role="radio".
    assert: () => {
      expect(screen.getByRole("radio", { name: "A" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "B" })).toBeInTheDocument();
    },
  },
  Toggle: {
    children: "press me",
    assert: () =>
      expect(
        screen.getByRole("button", { name: "press me" }),
      ).toBeInTheDocument(),
  },
  Switch: {
    assert: () =>
      expect(
        screen.getByRole("switch", { name: "Notifications" }),
      ).toBeInTheDocument(),
  },
  Carousel: {
    assert: () =>
      expect(screen.getByAltText("A")).toBeInTheDocument(),
  },
  // open=false by default; adapter renders the portal but content is hidden.
  Drawer: { children: "drawer body", assert: "no-throw" },
  Dialog: { children: "dialog body", assert: "no-throw" },
  // Closed by default; trigger fallback proves the adapter ran.
  DropdownMenu: {
    assert: () =>
      expect(
        screen.getByRole("button", { name: "Menu" }),
      ).toBeInTheDocument(),
  },
  Popover: {
    assert: () =>
      expect(
        screen.getByRole("button", { name: "Open" }),
      ).toBeInTheDocument(),
  },
  Tooltip: { assert: "no-throw" },
  Pagination: {
    assert: () =>
      expect(
        screen.getByRole("button", { name: "3" }),
      ).toHaveAttribute("aria-current", "page"),
  },
};

describe("envelope props passthrough", () => {
  for (const [name, Component] of Object.entries(uswdsComponents)) {
    const componentName = name as ComponentName;
    const fixture = FIXTURES[componentName];
    const example = uswdsComponentDefinitions[componentName].example;

    it(`${name}: catalog example renders via { props } envelope`, () => {
      const Cmp = Component as ComponentType<{
        props?: unknown;
        emit?: (event: string) => void;
        children?: ReactNode;
      }>;

      const renderEnvelope = () =>
        render(
          <Cmp props={example} emit={() => {}}>
            {fixture.children}
          </Cmp>,
        );

      if (fixture.assert === "no-throw") {
        expect(renderEnvelope).not.toThrow();
      } else {
        renderEnvelope();
        fixture.assert();
      }
    });
  }

  it("envelope.props wins over top-level props (precedence)", () => {
    // Top-level says disabled; envelope says enabled. Adapter merges with
    // envelopeProps last, so the rendered button must be enabled. If someone
    // flips the merge order or drops envelopeProps, this fails.
    const Button = uswdsComponents.Button as ComponentType<{
      disabled?: boolean;
      props?: { disabled?: boolean };
      children?: ReactNode;
    }>;
    render(
      <Button disabled={true} props={{ disabled: false }}>
        precedence
      </Button>,
    );
    expect(
      screen.getByRole("button", { name: "precedence" }),
    ).not.toBeDisabled();
  });
});

/**
 * envelope.test.tsx
 *
 * Exercises every entry in uswdsComponents via the json-render envelope shape:
 *   { props: <catalog example>, emit: vi.fn(), children: <optional> }
 *
 * This is the ONLY file that exercises the production envelope code path.
 * Per-component tests in tests/components/ exercise the plain-React-prop path.
 *
 * "no-throw" — component renders without throwing; no additional assertions.
 */

import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { uswdsComponents } from "../src/components"
import { uswdsComponentDefinitions } from "../src/catalog"

type Fixture = {
  children?: React.ReactNode
  assert: (() => void) | "no-throw"
}

type ComponentName = keyof typeof uswdsComponents

const emit = vi.fn()

const FIXTURES: Record<ComponentName, Fixture> = {
  // ─── Batch A ────────────────────────────────────────────────────────────

  Button: {
    assert() {
      expect(screen.getByRole("button")).toBeTruthy()
    },
  },

  ButtonGroup: {
    children: (
      <>
        <button type="button">Back</button>
        <button type="button">Next</button>
      </>
    ),
    assert: "no-throw",
  },

  Alert: {
    assert() {
      expect(screen.getByRole("alert")).toBeTruthy()
    },
  },

  Text: {
    assert() {
      expect(screen.getByText(/body copy goes here/i)).toBeTruthy()
    },
  },

  Heading: {
    assert() {
      expect(screen.getByRole("heading")).toBeTruthy()
    },
  },

  Link: {
    assert() {
      expect(screen.getByRole("link")).toBeTruthy()
    },
  },

  Badge: {
    assert() {
      expect(screen.getByText(/active/i)).toBeTruthy()
    },
  },

  // ─── Batch B ────────────────────────────────────────────────────────────

  Card: {
    assert: "no-throw",
  },

  Grid: {
    children: <div>Cell</div>,
    assert: "no-throw",
  },

  GridContainer: {
    children: <div>Content</div>,
    assert: "no-throw",
  },

  Table: {
    assert() {
      expect(screen.getByRole("table")).toBeTruthy()
    },
  },

  Accordion: {
    assert() {
      expect(screen.getAllByText(/first section/i).length).toBeGreaterThanOrEqual(1)
    },
  },

  // ─── Batch C ────────────────────────────────────────────────────────────

  Input: {
    assert() {
      expect(screen.getByRole("textbox")).toBeTruthy()
    },
  },

  Textarea: {
    assert() {
      expect(screen.getByRole("textbox")).toBeTruthy()
    },
  },

  Select: {
    assert() {
      expect(screen.getByRole("combobox")).toBeTruthy()
    },
  },

  Checkbox: {
    assert() {
      expect(screen.getByRole("checkbox")).toBeTruthy()
    },
  },

  Radio: {
    assert() {
      expect(screen.getByRole("radio")).toBeTruthy()
    },
  },

  Pagination: {
    assert: "no-throw",
  },

  Modal: {
    assert: "no-throw",
  },

  // ─── Batch D ────────────────────────────────────────────────────────────

  Tooltip: {
    children: <button type="button">Hover me</button>,
    assert: "no-throw",
  },

  // ─── Batch E ────────────────────────────────────────────────────────────

  Icon: {
    assert: "no-throw",
  },

  SiteAlert: {
    assert() {
      expect(screen.getByText(/covid-19 information/i)).toBeTruthy()
    },
  },

  Breadcrumb: {
    assert() {
      expect(screen.getByRole("navigation")).toBeTruthy()
      expect(screen.getByText(/home/i)).toBeTruthy()
    },
  },

  SideNav: {
    assert() {
      expect(screen.getByText(/overview/i)).toBeTruthy()
    },
  },

  InPageNavigation: {
    assert() {
      expect(screen.getByText(/on this page/i)).toBeTruthy()
    },
  },

  StepIndicator: {
    assert() {
      expect(screen.getByText(/personal info/i)).toBeTruthy()
    },
  },

  ProcessList: {
    assert() {
      expect(screen.getByText(/submit your application online/i)).toBeTruthy()
    },
  },

  SummaryBox: {
    assert() {
      expect(screen.getByText(/key information/i)).toBeTruthy()
    },
  },

  Search: {
    assert: "no-throw",
  },

  // ─── Batch F ────────────────────────────────────────────────────────────

  Collection: {
    assert() {
      expect(screen.getByText(/benefit update/i)).toBeTruthy()
    },
  },

  Banner: {
    assert: "no-throw",
  },

  Identifier: {
    assert: "no-throw",
  },

  Header: {
    assert() {
      expect(screen.getByText(/agency portal/i)).toBeTruthy()
    },
  },

  Footer: {
    assert: "no-throw",
  },

  LanguageSelector: {
    assert() {
      expect(screen.getByText(/english/i)).toBeTruthy()
    },
  },

  IconList: {
    assert() {
      expect(screen.getByText(/direct deposit available/i)).toBeTruthy()
    },
  },

  MediaBlock: {
    assert() {
      expect(screen.getByText(/design for impact/i)).toBeTruthy()
    },
  },

  // ─── Batch G ────────────────────────────────────────────────────────────

  ComboBox: {
    assert: "no-throw",
  },

  DatePicker: {
    assert: "no-throw",
  },

  DateRangePicker: {
    assert: "no-throw",
  },

  FileInput: {
    assert: "no-throw",
  },

  RangeInput: {
    assert: "no-throw",
  },

  TimePicker: {
    assert: "no-throw",
  },

  FormGroup: {
    children: <input type="text" id="test" />,
    assert: "no-throw",
  },

  Label: {
    assert() {
      expect(screen.getByText(/first name/i)).toBeTruthy()
    },
  },

  ErrorMessage: {
    assert() {
      expect(screen.getByText(/enter a valid date of birth/i)).toBeTruthy()
    },
  },

  CharacterCount: {
    assert: "no-throw",
  },

  TextInputMask: {
    assert: "no-throw",
  },

  Section: {
    assert: "no-throw",
  },
}

describe("envelope passthrough — all components", () => {
  const names = Object.keys(uswdsComponents) as ComponentName[]

  it.each(names)("%s renders via envelope shape without throwing", (name) => {
    const Component = uswdsComponents[name] as React.ComponentType<any>
    expect(Component, `uswdsComponents["${name}"] is missing`).toBeDefined()

    const fixture = FIXTURES[name]
    expect(fixture, `FIXTURES["${name}"] is missing — add an entry`).toBeDefined()

    const def = (uswdsComponentDefinitions as Record<string, { example?: unknown }>)[name]
    const example = def?.example ?? {}

    const { container } = render(
      <Component props={example} emit={emit}>
        {fixture.children}
      </Component>
    )

    expect(container).toBeTruthy()

    if (fixture.assert !== "no-throw") {
      fixture.assert()
    }
  })

  it("envelope.props wins over top-level props (precedence)", () => {
    // Top-level says disabled; envelope says enabled. Adapter merges with
    // envelopeProps last, so the rendered button must be enabled. If someone
    // flips the merge order or drops envelopeProps, this fails.
    const Button = uswdsComponents.Button as React.ComponentType<{
      disabled?: boolean
      props?: { disabled?: boolean }
      children?: React.ReactNode
    }>
    render(
      <Button disabled={true} props={{ disabled: false }}>
        precedence
      </Button>
    )
    expect(
      screen.getByRole("button", { name: "precedence" })
    ).not.toBeDisabled()
  })
})

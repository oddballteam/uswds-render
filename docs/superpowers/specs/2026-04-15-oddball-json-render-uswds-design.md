# `@oddball/json-render-uswds` — Design

**Date:** 2026-04-15
**Status:** Approved for implementation planning
**Owner:** Oddball Labs

## Summary

A component library package for [json-render](https://github.com/json-render/json-render) that lets AI agents generate US Web Design System (USWDS) interfaces. Mirrors the existing `@json-render/shadcn` package structure and component inventory (36 components), but swaps shadcn/Radix visuals for USWDS-styled ones built on Tailwind via the [`uswds-tailwind`](https://github.com/IHIutch/uswds-tailwind) design-token preset. Ships as a single published npm package.

## Goals

- Drop-in theme swap: a consumer using `@json-render/shadcn` can switch to `@oddball/json-render-uswds` with minimal diff — same catalog keys, same prop shapes where sensible.
- Gov-compliance story: visual parity with USWDS via shared design tokens.
- Ship v1 in one week with a 2-person team (engineer + product).

## Non-goals

- Full fidelity to USWDS vanilla-JS component behavior (we accept minor behavioral drift by using Radix/React Aria for interactive primitives).
- Consumption of `@uswds/uswds` SCSS as a peer dependency.
- A CLI-based copy-paste distribution model (shadcn-style). This is a published npm package.

## Architecture

### Package

- **Name:** `@oddball/json-render-uswds`
- **Location:** new package at `json-render/packages/uswds/` in the existing json-render monorepo (same tree as `packages/shadcn/`).
- **Build:** tsup, matching shadcn package. Outputs CJS + ESM + type declarations.
- **Peer deps:** `react`, `react-dom`, `@json-render/core`, `tailwindcss`.
- **Runtime deps:** `zod`, `clsx`, `tailwind-merge`, Radix UI primitives (per component, as used by shadcn).
- **Design tokens:** consumer extends their `tailwind.config.js` with the `uswds-tailwind` preset (documented in README; preset is re-exported from `/lib/tokens` for convenience). Not bundled — avoids CSS duplication.

### Surface

```text
@oddball/json-render-uswds
  ├─ index           → { uswdsComponentDefinitions, components }
  ├─ /catalog        → Zod catalog only (no React) — for server/agent validation
  └─ /components     → React components only — for tree-shaken consumers
```

- `uswdsComponentDefinitions`: `Record<ComponentName, { props: ZodSchema, slots?: string[], description: string, example: unknown }>`. Identical shape to `shadcnComponentDefinitions`.
- `components`: `Record<ComponentName, ReactComponent>` consumed by the json-render runtime.
- Both records are keyed by the same names. A contract test enforces lockstep.

### Data flow

1. AI emits JSON matching `uswdsComponentDefinitions` Zod schema (validated by json-render core).
2. json-render core maps each node → `components[name]` React component.
3. Components render semantic HTML with Tailwind classes resolved against the `uswds-tailwind` token preset.
4. Interactive components wrap Radix primitives (Dialog, Tabs, Accordion, etc.), restyled with USWDS tokens.

No runtime divergence from the shadcn package — only the component implementations and class names differ.

## Component inventory (36, parity with `@json-render/shadcn`)

**Layout:** Card, Stack, Grid, Separator

**Disclosure / navigation:** Tabs, Accordion, Collapsible, Dialog, Drawer, Carousel, Pagination, DropdownMenu

**Content:** Table, Heading, Text, Image, Avatar, Badge, Alert, Progress, Skeleton, Spinner

**Overlays:** Tooltip, Popover

**Forms:** Input, Textarea, Select, Checkbox, Radio, Switch, Slider

**Actions:** Button, Link, Toggle, ToggleGroup, ButtonGroup

Each component maps to a USWDS visual equivalent where one exists; where USWDS has no direct analogue (e.g., Switch, Slider, Carousel), we style Radix primitives with USWDS tokens and document the departure.

## Repo layout

```text
json-render/packages/uswds/
  package.json           → "@oddball/json-render-uswds"
  tsup.config.ts
  tsconfig.json
  src/
    catalog.ts           → uswdsComponentDefinitions (Zod)
    components.tsx       → React implementations registry
    lib/
      cn.ts              → clsx + tailwind-merge helper
      tokens.ts          → re-export of uswds-tailwind preset
    ui/                  → per-component source (Button.tsx, Card.tsx, ...)
    index.ts             → barrel
  tests/
    catalog.test.ts      → contract + parity tests
    components/*.test.tsx
  README.md
  CHANGELOG.md
```

Mirrors `packages/shadcn/` layout exactly.

## Testing

- **Unit (vitest):** each component — renders, prop variants, a11y snapshot via axe-core + `@testing-library/jest-dom`.
- **Catalog contract:** `Object.keys(uswdsComponentDefinitions) === Object.keys(components)`; each Zod `example` validates against its own schema.
- **Parity contract:** `Object.keys(uswdsComponentDefinitions) ⊇ Object.keys(shadcnComponentDefinitions)`. CI fails if shadcn adds a component uswds hasn't mirrored.
- **Visual:** Storybook with `@storybook/test-runner`. Chromatic optional; defer if timeline is tight.
- **No e2e** in v1.

## Milestones (1 week, 2 people)

- **Day 1:** Scaffold package, wire tsup/tsconfig, install `uswds-tailwind` + Radix deps, set up Storybook. Product starts catalog Zod schemas in parallel.
- **Day 2:** 16 static/simple components — Card, Stack, Grid, Separator, Heading, Text, Image, Avatar, Badge, Alert, Skeleton, Spinner, Table, Link, Button, ButtonGroup.
- **Day 3:** Form primitives — Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Progress.
- **Day 4:** Interactive — Accordion, Collapsible, Tabs, Toggle, ToggleGroup, Pagination, Tooltip, Popover, DropdownMenu.
- **Day 5:** Overlays — Dialog, Drawer, Carousel. Catalog contract + parity tests.
- **Day 6:** Storybook polish, README, example app using the package.
- **Day 7:** Buffer, a11y audit, publish release candidate.

## Open risks

- **Radix ↔ USWDS behavioral drift** on keyboard models (notably date-picker, which is deferred, but also Combobox-like patterns if added in v2). Acceptable for v1; revisit if a gov auditor flags it.
- **`uswds-tailwind` coverage gaps:** the preset may not expose every USWDS token we need. Mitigation: extend the preset locally in `lib/tokens.ts`; upstream patches where possible.
- **Prop-shape parity vs. USWDS idioms:** some shadcn props won't map cleanly (e.g., `Badge` variants). We default to shadcn prop names for parity and document USWDS-specific variants as additive.

## Out of scope for v1 (reserved names, v2 candidates)

Date-picker, combo-box, file-input with drag, header with mobile menu toggle, step-indicator, side-nav, in-page-nav, character-count, time-picker, memorable-date, search, hero, collection, process-list, tag, summary-box, banner, breadcrumb, footer, fieldset, form wrapper, error-message, hint. These USWDS-specific components are deferred until after parity v1 ships; they'll be added as additive catalog entries in v2.

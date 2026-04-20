# Trussworks Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all custom CVA/Tailwind/Radix component primitives in `packages/uswds/` with `@trussworks/react-uswds`, achieving official USWDS compliance.

**Architecture:** Delete `src/ui/` CVA primitives and `src/lib/tokens/`. Rewrite `catalog.ts` with Zod schemas matching Truss props exactly. Rewrite `components.tsx` adapters to call Truss components. Drop ~18 non-USWDS components; add ~30 new Truss components.

**Tech Stack:** `@trussworks/react-uswds`, `@uswds/uswds` CSS (via Truss's compiled bundle), Zod, Vitest, React 18

## Full File Map

This table covers all files touched across the entire migration (all four quarters), so engineers have the complete picture before starting.

### DELETE — `packages/uswds/src/ui/` (all files)

```
packages/uswds/src/ui/accordion.tsx
packages/uswds/src/ui/alert.tsx
packages/uswds/src/ui/avatar.tsx
packages/uswds/src/ui/badge.tsx
packages/uswds/src/ui/button-group.tsx
packages/uswds/src/ui/button.tsx
packages/uswds/src/ui/card.tsx
packages/uswds/src/ui/carousel.tsx
packages/uswds/src/ui/checkbox.tsx
packages/uswds/src/ui/collapsible.tsx
packages/uswds/src/ui/dialog.tsx
packages/uswds/src/ui/drawer.tsx
packages/uswds/src/ui/dropdown-menu.tsx
packages/uswds/src/ui/grid.tsx
packages/uswds/src/ui/heading.tsx
packages/uswds/src/ui/image.tsx
packages/uswds/src/ui/input.tsx
packages/uswds/src/ui/link.tsx
packages/uswds/src/ui/pagination.tsx
packages/uswds/src/ui/popover.tsx
packages/uswds/src/ui/progress.tsx
packages/uswds/src/ui/radio-group.tsx
packages/uswds/src/ui/select.tsx
packages/uswds/src/ui/separator.tsx
packages/uswds/src/ui/skeleton.tsx
packages/uswds/src/ui/slider.tsx
packages/uswds/src/ui/spinner.tsx
packages/uswds/src/ui/stack.tsx
packages/uswds/src/ui/switch.tsx
packages/uswds/src/ui/table.tsx
packages/uswds/src/ui/tabs.tsx
packages/uswds/src/ui/text.tsx
packages/uswds/src/ui/textarea.tsx
packages/uswds/src/ui/toggle-group.tsx
packages/uswds/src/ui/toggle.tsx
packages/uswds/src/ui/tooltip.tsx
```

### DELETE — `packages/uswds/src/lib/` (all files)

```
packages/uswds/src/lib/cn.ts
packages/uswds/src/lib/tokens/           ← entire directory
```

### DELETE — test files for dropped components

```
packages/uswds/tests/components/avatar.test.tsx
packages/uswds/tests/components/carousel.test.tsx
packages/uswds/tests/components/collapsible.test.tsx
packages/uswds/tests/components/dialog.test.tsx
packages/uswds/tests/components/drawer.test.tsx
packages/uswds/tests/components/dropdown-menu.test.tsx
packages/uswds/tests/components/image.test.tsx
packages/uswds/tests/components/popover.test.tsx
packages/uswds/tests/components/progress.test.tsx
packages/uswds/tests/components/separator.test.tsx
packages/uswds/tests/components/skeleton.test.tsx
packages/uswds/tests/components/slider.test.tsx
packages/uswds/tests/components/spinner.test.tsx
packages/uswds/tests/components/stack.test.tsx
packages/uswds/tests/components/switch.test.tsx
packages/uswds/tests/components/tabs.test.tsx
packages/uswds/tests/components/toggle-group.test.tsx
packages/uswds/tests/components/toggle.test.tsx
```

### REWRITE — core source files

```
packages/uswds/package.json               ← dep swap + export cleanup
packages/uswds/src/catalog.ts             ← full Zod schema rewrite
packages/uswds/src/components.tsx         ← full adapter rewrite
packages/uswds/src/index.ts               ← remove Tabs re-export
```

### REWRITE — existing component tests (Batch A, Q1)

```
packages/uswds/tests/components/button.test.tsx
packages/uswds/tests/components/alert.test.tsx
packages/uswds/tests/components/badge.test.tsx
packages/uswds/tests/components/link.test.tsx
packages/uswds/tests/components/button-group.test.tsx
```

### REWRITE — existing component tests (Batches B–D, Q2–Q3)

```
packages/uswds/tests/components/accordion.test.tsx
packages/uswds/tests/components/card.test.tsx
packages/uswds/tests/components/checkbox.test.tsx
packages/uswds/tests/components/grid.test.tsx
packages/uswds/tests/components/heading.test.tsx
packages/uswds/tests/components/input.test.tsx
packages/uswds/tests/components/pagination.test.tsx
packages/uswds/tests/components/radio.test.tsx
packages/uswds/tests/components/select.test.tsx
packages/uswds/tests/components/table.test.tsx
packages/uswds/tests/components/text.test.tsx
packages/uswds/tests/components/textarea.test.tsx
packages/uswds/tests/components/tooltip.test.tsx
```

### CREATE — new component tests (Batches E–G, Q3–Q4)

```
packages/uswds/tests/components/icon.test.tsx
packages/uswds/tests/components/site-alert.test.tsx
packages/uswds/tests/components/breadcrumb.test.tsx
packages/uswds/tests/components/side-nav.test.tsx
packages/uswds/tests/components/step-indicator.test.tsx
packages/uswds/tests/components/process-list.test.tsx
packages/uswds/tests/components/summary-box.test.tsx
packages/uswds/tests/components/search.test.tsx
packages/uswds/tests/components/combo-box.test.tsx
packages/uswds/tests/components/date-picker.test.tsx
packages/uswds/tests/components/file-input.test.tsx
packages/uswds/tests/components/form-group.test.tsx
packages/uswds/tests/components/label.test.tsx
packages/uswds/tests/components/error-message.test.tsx
packages/uswds/tests/components/character-count.test.tsx
packages/uswds/tests/components/banner.test.tsx
packages/uswds/tests/components/footer.test.tsx
packages/uswds/tests/components/header.test.tsx
packages/uswds/tests/components/identifier.test.tsx
packages/uswds/tests/components/collection.test.tsx
packages/uswds/tests/components/icon-list.test.tsx
packages/uswds/tests/components/media-block.test.tsx
packages/uswds/tests/components/in-page-navigation.test.tsx
packages/uswds/tests/components/modal.test.tsx
packages/uswds/tests/components/range-input.test.tsx
packages/uswds/tests/components/time-picker.test.tsx
packages/uswds/tests/components/date-range-picker.test.tsx
```

### MODIFY — consumer apps

```
examples/uswds-demo/src/styles.css                  ← remove @source line, add JS import
examples/uswds-demo/src/main.tsx                    ← add import '@trussworks/react-uswds/lib/uswds.css'
examples/uswds-playground/app/globals.css           ← remove @source line
examples/uswds-playground/app/layout.tsx            ← add import '@trussworks/react-uswds/lib/uswds.css'
examples/uswds-playground/app/tokens/               ← entire directory DELETE (no more token vendoring)
examples/uswds-playground/components/spec-viewer.tsx ← rewrite Tabs to state-based toggle
examples/uswds-playground/package.json              ← remove tailwind peer dep transients if needed
```

---

## Task 1 — Update `packages/uswds/package.json`

**Goal:** Swap deps so the package installs Truss and sheds all CVA/Radix/Tailwind weight.

### Steps

- [ ] Open `packages/uswds/package.json` and make ALL of the following edits atomically (one Edit call):

**Remove from `dependencies`:**
- `class-variance-authority`
- `clsx`
- `embla-carousel-react`
- `lucide-react`
- `radix-ui`
- `tailwind-merge`
- `vaul`

**Add to `dependencies`:**
- `"@trussworks/react-uswds": "^8.0.0"`

**Change `peerDependencies`:**
- Change `"react": "^19.0.0"` → `"react": "^18.0.0"`
- Change `"react-dom": "^19.0.0"` → `"react-dom": "^18.0.0"`
- Remove: `"tailwindcss"`, `"@tailwindcss/forms"`, `"@tailwindcss/typography"`, `"@iconify/tailwind4"`, `"tailwindcss-animate"`

**Update `description`:**
- Change to: `"USWDS-compliant component library for @json-render/core. JSON becomes federally-compliant React components powered by @trussworks/react-uswds."`

**Update `keywords`:**
- Remove: `"tailwind"`, `"radix"`

**Remove from `exports`:**
- The `"./tokens"` export block
- The `"./tokens.css"` export entry

**Update `files` array:**
- Change to: `["dist"]`
- Remove: `"src/lib/tokens/index.css"`, `"LICENSE-uswds-tailwind"`, `"NOTICES.md"`

**Remove from `devDependencies`:**
- `"@iconify/tailwind4"`
- `"@tailwindcss/forms"`
- `"@tailwindcss/postcss"`
- `"@tailwindcss/typography"`
- `"@tailwindcss/vite"`
- `"tailwindcss-animate"`
- `"@storybook/addon-essentials"`, `"@storybook/react"`, `"@storybook/react-vite"`, `"storybook"` (Storybook not part of migration scope — remove if desired, else leave)

**Final `package.json` result:**

```json
{
  "name": "@oddball/json-render-uswds",
  "version": "0.1.0",
  "license": "Apache-2.0",
  "description": "USWDS-compliant component library for @json-render/core. JSON becomes federally-compliant React components powered by @trussworks/react-uswds.",
  "keywords": ["json", "ui", "react", "uswds", "ai", "generative-ui", "llm", "renderer", "components"],
  "publishConfig": { "access": "public" },
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./catalog": {
      "types": "./dist/catalog.d.ts",
      "import": "./dist/catalog.mjs",
      "require": "./dist/catalog.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "check-types": "tsc --noEmit",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@json-render/core": "^0.17.0",
    "@json-render/react": "^0.17.0",
    "@trussworks/react-uswds": "^8.0.0"
  },
  "devDependencies": {
    "@json-render/shadcn": "^0.17.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^18.3.0",
    "jest-axe": "^9.0.0",
    "jsdom": "^25.0.0",
    "tsup": "^8.0.2",
    "typescript": "^5.4.5",
    "vitest": "^2.1.0",
    "zod": "^4.3.6"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "zod": "^4.0.0"
  }
}
```

- [ ] From repo root, run:
  ```bash
  pnpm install
  ```
  Verify: no install errors. `node_modules/@trussworks/react-uswds` exists under `packages/uswds/`.

---

## Task 2 — Delete old source files; update `index.ts`

**Goal:** Remove all CVA primitives, token infrastructure, and the `cn` utility. Fix the `index.ts` Tabs re-export.

### Steps

#### 2a — Delete `src/ui/` directory

- [ ] Delete the entire `packages/uswds/src/ui/` directory:
  ```bash
  rm -rf packages/uswds/src/ui
  ```

#### 2b — Delete `src/lib/` directory

- [ ] Delete the entire `packages/uswds/src/lib/` directory:
  ```bash
  rm -rf packages/uswds/src/lib
  ```

#### 2c — Delete test files for dropped components

- [ ] Delete all test files for components that have no Truss equivalent:
  ```bash
  rm packages/uswds/tests/components/avatar.test.tsx
  rm packages/uswds/tests/components/carousel.test.tsx
  rm packages/uswds/tests/components/collapsible.test.tsx
  rm packages/uswds/tests/components/dialog.test.tsx
  rm packages/uswds/tests/components/drawer.test.tsx
  rm packages/uswds/tests/components/dropdown-menu.test.tsx
  rm packages/uswds/tests/components/image.test.tsx
  rm packages/uswds/tests/components/popover.test.tsx
  rm packages/uswds/tests/components/progress.test.tsx
  rm packages/uswds/tests/components/separator.test.tsx
  rm packages/uswds/tests/components/skeleton.test.tsx
  rm packages/uswds/tests/components/slider.test.tsx
  rm packages/uswds/tests/components/spinner.test.tsx
  rm packages/uswds/tests/components/stack.test.tsx
  rm packages/uswds/tests/components/switch.test.tsx
  rm packages/uswds/tests/components/tabs.test.tsx
  rm packages/uswds/tests/components/toggle-group.test.tsx
  rm packages/uswds/tests/components/toggle.test.tsx
  ```

#### 2d — Update `src/index.ts`

- [ ] Replace the contents of `packages/uswds/src/index.ts` with:

```typescript
export { uswdsComponents } from "./components";
export {
  uswdsComponentDefinitions,
  type ComponentDefinition,
  type UswdsProps,
} from "./catalog";
```

(The `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` re-exports are removed because Truss has no Tabs component.)

#### 2e — Verify TypeScript can find no leftover imports

- [ ] Run typecheck — it will fail because `catalog.ts` and `components.tsx` still import from deleted paths, but the error list should be only those two files:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck 2>&1 | head -40
  ```
  Expected: errors only about `./ui/*` and `./lib/cn` imports in `catalog.ts` / `components.tsx`. No errors in `index.ts`.

---

## Task 3 — Scaffold empty `catalog.ts` and `components.tsx`

**Goal:** Replace the old files with clean shells — correct imports, correct `Envelope` type, empty `{}` objects — so that the contract tests and typecheck can be run incrementally as components are added in Tasks 4+.

### Steps

#### 3a — Replace `catalog.ts` with empty scaffold

- [ ] Write `packages/uswds/src/catalog.ts`:

```typescript
import { z } from "zod";

export type ComponentDefinition = {
  props: z.ZodTypeAny;
  slots?: string[];
  description: string;
  example: unknown;
};

// Populated incrementally in Tasks 4–16.
// Each entry: { props: ZodSchema, slots?, description, example }
export const uswdsComponentDefinitions = {} as Record<string, ComponentDefinition>;

// Derive per-component prop types from Zod schemas for use in adapter type signatures.
export type UswdsProps = {
  [K in keyof typeof uswdsComponentDefinitions]: z.infer<
    (typeof uswdsComponentDefinitions)[K]["props"]
  >;
};
```

**Note on `UswdsProps`:** Because `uswdsComponentDefinitions` is initially `{}`, `UswdsProps` will be `{}`. As entries are added below, TypeScript will infer the correct per-component types automatically. No manual type maintenance required.

#### 3b — Replace `components.tsx` with empty scaffold

- [ ] Write `packages/uswds/src/components.tsx`:

```typescript
"use client";

import type { ReactNode } from "react";
import type { UswdsProps } from "./catalog";

// Re-exported so callers (registry definition sites) don't need to import React directly.
export type { ComponentType } from "react";

/**
 * Envelope shape injected by @json-render/react when rendering a component
 * from a flat-tree spec. Adapters must accept BOTH this shape AND plain React
 * props to satisfy the dual render path (json-render pipeline + standalone/test).
 */
export type Envelope<P> = {
  props?: Partial<P>;
  emit?: (event: string) => void;
  children?: ReactNode;
};

// Populated incrementally in Tasks 4–16.
// Each value is a React function component that accepts both envelope and plain-prop shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uswdsComponents: Record<string, React.ComponentType<any>> = {};

// Named re-export for catalog parity tests.
export type { UswdsProps };
```

- [ ] Add `import * as React from "react";` to the top of the scaffold (needed for `React.ComponentType` in the export type annotation):

The corrected scaffold:

```typescript
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type { UswdsProps } from "./catalog";

/**
 * Envelope shape injected by @json-render/react when rendering a component
 * from a flat-tree spec. Adapters must accept BOTH this shape AND plain React
 * props to satisfy the dual render path (json-render pipeline + standalone/test).
 */
export type Envelope<P> = {
  props?: Partial<P>;
  emit?: (event: string) => void;
  children?: ReactNode;
};

// Populated incrementally in Tasks 4–16.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uswdsComponents: Record<string, React.ComponentType<any>> = {};

export type { UswdsProps };
```

#### 3c — Verify scaffold compiles cleanly

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck
  ```
  Expected: zero errors (both files are syntactically valid; `uswdsComponentDefinitions = {}` satisfies the `Record` type).

#### 3d — Verify test suite runs (with expected failures)

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -20
  ```
  Expected: tests that reference specific components (button, alert, etc.) will fail because `uswdsComponents.Button` etc. are `undefined`. The catalog contract test will pass trivially (empty objects match). The envelope test will pass trivially. This is the expected TDD baseline.

---

## Task 4 — Batch A: Button, ButtonGroup, Alert, Badge/Tag, Link

**Goal:** Implement the five most fundamental components. After this task the test suite for these five must pass fully. Each component follows the same three-step TDD cycle: write test → watch fail → implement → watch pass.

### Truss imports reference

All five components live in `@trussworks/react-uswds`:

```typescript
import { Button } from "@trussworks/react-uswds";
import { ButtonGroup } from "@trussworks/react-uswds";
import { Alert } from "@trussworks/react-uswds";
import { Tag } from "@trussworks/react-uswds";      // replaces Badge
import { Link } from "@trussworks/react-uswds";
```

---

### Step 4a — Write all five test files (TDD: red phase)

- [ ] Write `packages/uswds/tests/components/button.test.tsx`:

```typescript
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Button", () => {
  const Button = uswdsComponents.Button;

  it("renders with required props", () => {
    render(<Button type="button">Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Button type="button">Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("forwards native onClick when emit is absent", () => {
    const onClick = vi.fn();
    render(<Button type="button" onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls emit('press') when emit is provided and button is clicked", () => {
    const emit = vi.fn();
    render(<Button type="button" emit={emit}>Submit</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(emit).toHaveBeenCalledWith("press");
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it("renders as secondary variant", () => {
    const { container } = render(
      <Button type="button" variant="secondary">Secondary</Button>
    );
    // Truss renders usa-button--secondary class
    expect(container.querySelector(".usa-button--secondary")).toBeInTheDocument();
  });

  it("renders as outline variant", () => {
    const { container } = render(
      <Button type="button" variant="outline">Outline</Button>
    );
    expect(container.querySelector(".usa-button--outline")).toBeInTheDocument();
  });

  it("renders as big size", () => {
    const { container } = render(
      <Button type="button" size="big">Big</Button>
    );
    expect(container.querySelector(".usa-button--big")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button type="button" disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("merges envelope props over rest props", () => {
    render(
      <Button
        type="button"
        props={{ disabled: true }}
      >
        Merged
      </Button>
    );
    expect(screen.getByRole("button", { name: "Merged" })).toBeDisabled();
  });
});
```

- [ ] Write `packages/uswds/tests/components/alert.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Alert", () => {
  const Alert = uswdsComponents.Alert;

  it("renders with required props", () => {
    render(
      <Alert type="info" headingLevel="h4" heading="Heads up">
        Alert body text
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Alert type="info" headingLevel="h4" heading="Heads up">
        Alert body text
      </Alert>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders success variant", () => {
    const { container } = render(
      <Alert type="success" headingLevel="h4" heading="Done">
        Success body
      </Alert>
    );
    expect(container.querySelector(".usa-alert--success")).toBeInTheDocument();
  });

  it("renders warning variant", () => {
    const { container } = render(
      <Alert type="warning" headingLevel="h4" heading="Warning">
        Warning body
      </Alert>
    );
    expect(container.querySelector(".usa-alert--warning")).toBeInTheDocument();
  });

  it("renders error variant", () => {
    const { container } = render(
      <Alert type="error" headingLevel="h4" heading="Error">
        Error body
      </Alert>
    );
    expect(container.querySelector(".usa-alert--error")).toBeInTheDocument();
  });

  it("renders slim variant", () => {
    const { container } = render(
      <Alert type="info" headingLevel="h4" slim>
        Slim alert
      </Alert>
    );
    expect(container.querySelector(".usa-alert--slim")).toBeInTheDocument();
  });

  it("renders noIcon variant", () => {
    const { container } = render(
      <Alert type="info" headingLevel="h4" noIcon>
        No icon
      </Alert>
    );
    expect(container.querySelector(".usa-alert--no-icon")).toBeInTheDocument();
  });

  it("accepts variant prop as alias for type (catalog shape)", () => {
    // The catalog uses 'variant' for AI-generated specs; adapter maps it to Truss 'type'
    render(
      <Alert variant="success" headingLevel="h4" heading="Via variant">
        Body
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const { container } = render(
      <Alert variant="success" headingLevel="h4" heading="Via variant 2">
        Body
      </Alert>
    );
    expect(container.querySelector(".usa-alert--success")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(
      <Alert
        type="info"
        headingLevel="h4"
        props={{ heading: "Envelope heading" }}
      >
        Body
      </Alert>
    );
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/badge.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Badge (Tag)", () => {
  const Badge = uswdsComponents.Badge;

  it("renders with text prop", () => {
    render(<Badge text="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders children when text prop is absent", () => {
    render(<Badge>Fallback</Badge>);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Badge text="Active" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the usa-tag class from Truss Tag", () => {
    const { container } = render(<Badge text="Tag" />);
    expect(container.querySelector(".usa-tag")).toBeInTheDocument();
  });

  it("renders with background color override", () => {
    const { container } = render(<Badge text="Custom" background="#005ea2" />);
    const el = container.querySelector(".usa-tag") as HTMLElement | null;
    expect(el).toBeInTheDocument();
    expect(el?.style.background).toBe("#005ea2");
  });

  it("merges envelope props", () => {
    render(<Badge props={{ text: "Envelope text" }} />);
    expect(screen.getByText("Envelope text")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/link.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Link", () => {
  const Link = uswdsComponents.Link;

  it("renders with label prop as link text", () => {
    render(<Link href="/about" label="About" />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("renders children when label prop is absent", () => {
    render(<Link href="/about">About us</Link>);
    expect(screen.getByRole("link", { name: "About us" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Link href="/about" label="About" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("sets href correctly", () => {
    render(<Link href="/contact" label="Contact" />);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders external variant", () => {
    const { container } = render(
      <Link href="https://example.com" label="External" variant="external" />
    );
    // Truss Link with variant="external" adds usa-link--external class
    expect(
      container.querySelector(".usa-link--external")
    ).toBeInTheDocument();
  });

  it("renders unstyled variant", () => {
    const { container } = render(
      <Link href="/plain" label="Plain" variant="unstyled" />
    );
    expect(
      container.querySelector(".usa-link--unstyled") ??
      container.querySelector("[class*='unstyled']")
    ).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<Link href="/base" props={{ label: "Envelope label", href: "/overridden" }} />);
    expect(screen.getByRole("link", { name: "Envelope label" })).toHaveAttribute(
      "href",
      "/overridden"
    );
  });
});
```

- [ ] Write `packages/uswds/tests/components/button-group.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("ButtonGroup", () => {
  const ButtonGroup = uswdsComponents.ButtonGroup;
  const Button = uswdsComponents.Button;

  it("renders children buttons", () => {
    render(
      <ButtonGroup>
        <Button type="button">One</Button>
        <Button type="button">Two</Button>
      </ButtonGroup>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ButtonGroup>
        <Button type="button">One</Button>
        <Button type="button">Two</Button>
      </ButtonGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the usa-button-group class from Truss", () => {
    const { container } = render(
      <ButtonGroup>
        <Button type="button">A</Button>
      </ButtonGroup>
    );
    expect(container.querySelector(".usa-button-group")).toBeInTheDocument();
  });

  it("renders segmented type", () => {
    const { container } = render(
      <ButtonGroup type="segmented">
        <Button type="button">A</Button>
        <Button type="button">B</Button>
      </ButtonGroup>
    );
    expect(
      container.querySelector(".usa-button-group--segmented")
    ).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(
      <ButtonGroup props={{ type: "segmented" }}>
        <Button type="button">X</Button>
      </ButtonGroup>
    );
    const { container } = render(
      <ButtonGroup props={{ type: "segmented" }}>
        <Button type="button">Y</Button>
      </ButtonGroup>
    );
    expect(
      container.querySelector(".usa-button-group--segmented")
    ).toBeInTheDocument();
  });
});
```

- [ ] Run tests to confirm all five test files fail at the `uswdsComponents.X` access (red phase):
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/button.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/alert.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/badge.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/link.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/button-group.test.tsx
  ```

---

### Step 4b — Add catalog entries to `catalog.ts` (green setup)

- [ ] Replace `packages/uswds/src/catalog.ts` with the Batch A catalog entries:

```typescript
import { z } from "zod";

export type ComponentDefinition = {
  props: z.ZodTypeAny;
  slots?: string[];
  description: string;
  example: unknown;
};

export const uswdsComponentDefinitions = {
  // ── Button ───────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Button.
  // variant prop is a catalog-level convenience alias; adapter converts to Truss bool props.
  Button: {
    props: z.object({
      type: z.enum(["button", "submit", "reset"]).nullish(),
      variant: z
        .enum([
          "default",
          "secondary",
          "base",
          "accent-cool",
          "accent-warm",
          "outline",
          "unstyled",
        ])
        .nullish(),
      size: z.enum(["default", "big"]).nullish(),
      disabled: z.boolean().nullish(),
      onClick: z.string().nullish().describe("Action binding name"),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS button (usa-button). variant=default is the filled blue primary; secondary/outline/etc map to Truss bool props. Pass label text as children.",
    example: { type: "button", variant: "default" },
  },

  // ── ButtonGroup ───────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds ButtonGroup.
  ButtonGroup: {
    props: z.object({
      type: z.enum(["default", "segmented"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "Group of related USWDS buttons (usa-button-group). Children should be Button elements. Use type='segmented' for a pill-style segmented control.",
    example: { type: "default" },
  },

  // ── Alert ─────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Alert.
  // 'variant' is accepted as an alias for 'type' for AI-generated spec compatibility.
  Alert: {
    props: z.object({
      type: z
        .enum(["success", "warning", "error", "info"])
        .nullish()
        .describe("Alert severity. Required unless using variant alias."),
      variant: z
        .enum(["success", "warning", "error", "info", "emergency"])
        .nullish()
        .describe(
          "Alias for type — use this in AI-generated specs for consistency with other components.",
        ),
      heading: z.string().nullish(),
      headingLevel: z
        .enum(["h1", "h2", "h3", "h4", "h5", "h6"])
        .nullish()
        .describe("Required by Truss Alert. Defaults to h4."),
      slim: z.boolean().nullish(),
      noIcon: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS alert (usa-alert). Required: type (or variant alias) and headingLevel. Children = body text. Use heading prop for the bold title line.",
    example: { type: "info", heading: "Heads up", headingLevel: "h4" },
  },

  // ── Badge ─────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Tag.
  // Named Badge in catalog to match shadcn parity contract; renders as Truss Tag.
  Badge: {
    props: z.object({
      text: z.string().nullish().describe("Tag label. Pass via text prop, not children."),
      background: z.string().nullish().describe("Optional CSS color for the tag background."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS tag (usa-tag). Small inline label for statuses. Pass content via the 'text' prop.",
    example: { text: "Active" },
  },

  // ── Link ──────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Link.
  Link: {
    props: z.object({
      label: z.string().nullish().describe("Visible link text. Pass via label prop, not children."),
      href: z.string().describe("Navigation target. Required."),
      variant: z.enum(["external", "unstyled", "nav"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS anchor link (usa-link). Pass visible text via the 'label' prop. Use variant='external' for off-site links.",
    example: { label: "Learn more", href: "/about" },
  },
};

// Derive per-component prop types from Zod schemas for use in adapter type signatures.
export type UswdsProps = {
  [K in keyof typeof uswdsComponentDefinitions]: z.infer<
    (typeof uswdsComponentDefinitions)[K]["props"]
  >;
};
```

---

### Step 4c — Add adapter functions to `components.tsx` (green phase)

- [ ] Replace `packages/uswds/src/components.tsx` with the Batch A adapters:

```typescript
"use client";

import * as React from "react";
import type { ReactNode } from "react";
import {
  Button as TrussButton,
  ButtonGroup as TrussButtonGroup,
  Alert as TrussAlert,
  Tag,
  Link as TrussLink,
} from "@trussworks/react-uswds";
import type { UswdsProps } from "./catalog";

/**
 * Envelope shape injected by @json-render/react when rendering a component
 * from a flat-tree spec. Adapters must accept BOTH this shape AND plain React
 * props to satisfy the dual render path (json-render pipeline + standalone/test).
 */
export type Envelope<P> = {
  props?: Partial<P>;
  emit?: (event: string) => void;
  children?: ReactNode;
};

// ── Button ───────────────────────────────────────────────────────────────────
type ButtonAdapterProps = Partial<UswdsProps["Button"]> &
  Envelope<UswdsProps["Button"]>;

function Button(all: ButtonAdapterProps) {
  const { props: envelopeProps, emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  // Resolve onClick: emit wins; fall back to native onClick if present and a function.
  const rawClick = (p as unknown as { onClick?: unknown }).onClick;
  const nativeOnClick =
    !emit && typeof rawClick === "function"
      ? (rawClick as React.MouseEventHandler<HTMLButtonElement>)
      : undefined;

  // Map catalog variant → Truss boolean props.
  const variant = p.variant ?? "default";
  const secondary = variant === "secondary";
  const base = variant === "base";
  const accentStyle: "cool" | "warm" | undefined =
    variant === "accent-cool" ? "cool" : variant === "accent-warm" ? "warm" : undefined;
  const outline = variant === "outline";
  const unstyled = variant === "unstyled";

  return (
    <TrussButton
      type={p.type ?? "button"}
      secondary={secondary || undefined}
      base={base || undefined}
      accentStyle={accentStyle}
      outline={outline || undefined}
      unstyled={unstyled || undefined}
      size={p.size === "big" ? "big" : undefined}
      disabled={p.disabled ?? false}
      className={p.className ?? undefined}
      onClick={emit ? () => emit("press") : nativeOnClick}
    >
      {children}
    </TrussButton>
  );
}

// ── ButtonGroup ──────────────────────────────────────────────────────────────
type ButtonGroupAdapterProps = Partial<UswdsProps["ButtonGroup"]> &
  Envelope<UswdsProps["ButtonGroup"]>;

function ButtonGroup(all: ButtonGroupAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussButtonGroup
      type={p.type === "segmented" ? "segmented" : "default"}
      className={p.className ?? undefined}
    >
      {children}
    </TrussButtonGroup>
  );
}

// ── Alert ────────────────────────────────────────────────────────────────────
// Truss Alert requires `type` (not `variant`) and `headingLevel`.
// Catalog uses `variant` as an AI-friendly alias — adapter resolves both.
// `emergency` maps to `error` because Truss Alert has no emergency type;
// use SiteAlert (added in Batch E) for the USWDS emergency site-wide banner.
type AlertAdapterProps = Partial<UswdsProps["Alert"]> &
  Envelope<UswdsProps["Alert"]>;

function Alert(all: AlertAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  // Resolve type from either `type` or `variant` alias.
  const rawType = p.type ?? p.variant;
  const resolvedType: "success" | "warning" | "error" | "info" =
    rawType === "emergency" ? "error" : (rawType as "success" | "warning" | "error" | "info") ?? "info";

  return (
    <TrussAlert
      type={resolvedType}
      heading={p.heading ?? undefined}
      headingLevel={
        (p.headingLevel as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") ?? "h4"
      }
      slim={p.slim ?? undefined}
      noIcon={p.noIcon ?? undefined}
      className={p.className ?? undefined}
    >
      {children}
    </TrussAlert>
  );
}

// ── Badge (Tag) ───────────────────────────────────────────────────────────────
// Named Badge in the catalog/registry for shadcn parity. Renders as Truss Tag.
type BadgeAdapterProps = Partial<UswdsProps["Badge"]> &
  Envelope<UswdsProps["Badge"]>;

function Badge(all: BadgeAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <Tag
      background={p.background ?? undefined}
      className={p.className ?? undefined}
    >
      {p.text ?? children}
    </Tag>
  );
}

// ── Link ──────────────────────────────────────────────────────────────────────
type LinkAdapterProps = Partial<UswdsProps["Link"]> &
  Envelope<UswdsProps["Link"]> & { href?: string };

function Link(all: LinkAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const variant = p.variant;

  return (
    <TrussLink
      href={p.href ?? "#"}
      variant={variant ?? undefined}
      className={p.className ?? undefined}
    >
      {p.label ?? children}
    </TrussLink>
  );
}

// ── Registry ──────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uswdsComponents: Record<string, React.ComponentType<any>> = {
  Button,
  ButtonGroup,
  Alert,
  Badge,
  Link,
};

export type { UswdsProps };
```

---

### Step 4d — Run Batch A tests (green phase)

- [ ] Run each test file individually to confirm it goes green:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/button.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/alert.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/badge.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/link.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/button-group.test.tsx
  ```

- [ ] Run the full suite to check baseline (other component tests will still fail — that is expected until Tasks 5–16):
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -30
  ```

- [ ] Run typecheck to confirm no regressions:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck
  ```

---

### Step 4e — Verify catalog contract test passes for Batch A entries

The `tests/catalog.test.ts` contract test checks:
1. Every key in `uswdsComponentDefinitions` also exists in `uswdsComponents`.
2. Every catalog `example` validates against its own Zod schema.
3. Every key in `@json-render/shadcn`'s catalog is present in ours (parity).

Points 1 and 2 should pass after Batch A. Point 3 will fail until enough components are added in later batches to satisfy the parity set. That is acceptable — the test failure count will decrease monotonically as batches land.

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/catalog.test.ts 2>&1
  ```
  Expected: key-match test passes, example-validation test passes, parity test fails with a clear list of missing shadcn-parity keys (the remaining components to implement in Tasks 5–16).

## Task 5 — Batch B: Card, Heading, Text, Accordion, Table

**Goal:** Implement five structural/content components. Card uses Truss's composite sub-components. Heading and Text are thin HTML wrappers (no Truss equivalent). Accordion uses Truss's items-array API. Table passes children through to Truss's Table.

### Truss imports reference

```typescript
import { Card, CardBody, CardHeader, CardFooter, CardMedia } from "@trussworks/react-uswds";
import { Accordion } from "@trussworks/react-uswds";
import { Table } from "@trussworks/react-uswds";
// Heading and Text: no Truss equivalent — thin HTML wrappers
```

---

### Step 5a — Write all five test files (TDD: red phase)

- [ ] Write `packages/uswds/tests/components/card.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Card", () => {
  const Card = uswdsComponents.Card;

  it("renders children inside a card", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Card>Card content</Card>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders as an li element", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector("li")).toBeInTheDocument();
  });

  it("applies usa-card class", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector(".usa-card")).toBeInTheDocument();
  });

  it("renders flagDefault layout", () => {
    const { container } = render(<Card layout="flagDefault">Content</Card>);
    expect(container.querySelector(".usa-card--flag")).toBeInTheDocument();
  });

  it("renders flagMediaRight layout", () => {
    const { container } = render(
      <Card layout="flagMediaRight">Content</Card>
    );
    const el = container.querySelector(".usa-card--flag");
    expect(el).toBeInTheDocument();
    expect(container.querySelector(".usa-card--media-right")).toBeInTheDocument();
  });

  it("renders headerFirst when prop is true", () => {
    const { container } = render(<Card headerFirst>Content</Card>);
    expect(container.querySelector(".usa-card__header-first")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <Card props={{ layout: "flagDefault" }}>Content</Card>
    );
    expect(container.querySelector(".usa-card--flag")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/heading.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Heading", () => {
  const Heading = uswdsComponents.Heading;

  it("renders text prop as heading content", () => {
    render(<Heading level="h2" text="Hello world" />);
    expect(screen.getByRole("heading", { name: "Hello world" })).toBeInTheDocument();
  });

  it("renders children when text prop is absent", () => {
    render(<Heading level="h3">Children heading</Heading>);
    expect(
      screen.getByRole("heading", { name: "Children heading" })
    ).toBeInTheDocument();
  });

  it("defaults to h2 when level is not provided", () => {
    render(<Heading text="Default level" />);
    expect(
      screen.getByRole("heading", { name: "Default level", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders each heading level correctly", () => {
    const levels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
    for (const level of levels) {
      const { unmount } = render(
        <Heading level={level} text={`Level ${level}`} />
      );
      expect(
        screen.getByRole("heading", { name: `Level ${level}` })
      ).toBeInTheDocument();
      unmount();
    }
  });

  it("applies usa-prose class", () => {
    const { container } = render(<Heading level="h2" text="Styled" />);
    const heading = container.querySelector("h2");
    expect(heading?.className).toMatch(/usa-prose/);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Heading level="h2" text="Accessible" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(<Heading level="h3" props={{ text: "Envelope text", level: "h4" }} />);
    expect(
      screen.getByRole("heading", { name: "Envelope text", level: 4 })
    ).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/text.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Text", () => {
  const Text = uswdsComponents.Text;

  it("renders text prop as paragraph content", () => {
    render(<Text text="Hello paragraph" />);
    expect(screen.getByText("Hello paragraph")).toBeInTheDocument();
  });

  it("renders children when text prop is absent", () => {
    render(<Text>Children text</Text>);
    expect(screen.getByText("Children text")).toBeInTheDocument();
  });

  it("defaults to p element", () => {
    const { container } = render(<Text text="Default" />);
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders as span when as='span'", () => {
    const { container } = render(<Text as="span" text="Inline" />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders as div when as='div'", () => {
    const { container } = render(<Text as="div" text="Block" />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("applies size class for xs", () => {
    const { container } = render(<Text size="xs" text="Tiny" />);
    const el = container.querySelector("p");
    expect(el?.className).toMatch(/font-sans-xs/);
  });

  it("applies size class for lg", () => {
    const { container } = render(<Text size="lg" text="Large" />);
    const el = container.querySelector("p");
    expect(el?.className).toMatch(/font-sans-lg/);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Text text="Accessible" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(<Text as="p" props={{ text: "Envelope text" }} />);
    expect(screen.getByText("Envelope text")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/accordion.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

const ITEMS = [
  {
    id: "acc-1",
    title: "First section",
    content: "First content",
    expanded: false,
    headingLevel: "h4" as const,
  },
  {
    id: "acc-2",
    title: "Second section",
    content: "Second content",
    expanded: true,
    headingLevel: "h4" as const,
  },
];

describe("Accordion", () => {
  const Accordion = uswdsComponents.Accordion;

  it("renders all item titles", () => {
    render(<Accordion items={ITEMS} />);
    expect(screen.getByText("First section")).toBeInTheDocument();
    expect(screen.getByText("Second section")).toBeInTheDocument();
  });

  it("renders expanded item content", () => {
    render(<Accordion items={ITEMS} />);
    // "Second content" is in the expanded item
    expect(screen.getByText("Second content")).toBeInTheDocument();
  });

  it("applies usa-accordion class", () => {
    const { container } = render(<Accordion items={ITEMS} />);
    expect(container.querySelector(".usa-accordion")).toBeInTheDocument();
  });

  it("renders bordered variant", () => {
    const { container } = render(<Accordion items={ITEMS} bordered />);
    expect(
      container.querySelector(".usa-accordion--bordered")
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Accordion items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(<Accordion items={[]} props={{ items: ITEMS }} />);
    expect(screen.getByText("First section")).toBeInTheDocument();
  });

  it("renders with empty items array without crashing", () => {
    render(<Accordion items={[]} />);
    // Should render an empty accordion without throwing
  });
});
```

- [ ] Write `packages/uswds/tests/components/table.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Table", () => {
  const Table = uswdsComponents.Table;

  it("renders table children", () => {
    render(
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane</td>
            <td>Active</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
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

  it("renders bordered variant", () => {
    const { container } = render(
      <Table bordered>
        <tbody>
          <tr>
            <td>X</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(container.querySelector(".usa-table--borderless")).not.toBeInTheDocument();
    // bordered=true is the default style; usa-table is present
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
```

- [ ] Run tests to confirm all five fail (red phase):
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/card.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/heading.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/text.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/accordion.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/table.test.tsx
  ```

---

### Step 5b — Add Batch B catalog entries to `catalog.ts`

- [ ] Append the following entries inside the `uswdsComponentDefinitions` object in `packages/uswds/src/catalog.ts` (after the Link entry, before the closing `}`):

```typescript
  // ── Card ──────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Card + CardBody.
  // Adapter wraps children in CardBody inside Card.
  // No title/description props on Card itself — nest CardHeader etc. as children.
  Card: {
    props: z.object({
      layout: z
        .enum(["standardDefault", "flagDefault", "flagMediaRight"])
        .nullish(),
      headerFirst: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS card (usa-card). Children are wrapped in CardBody automatically. Use layout='flagDefault' for horizontal media cards. Nest CardHeader, CardFooter as needed.",
    example: { layout: "standardDefault" },
  },

  // ── Heading ───────────────────────────────────────────────────────────────
  // No Truss equivalent. Thin HTML wrapper using USWDS typography classes.
  // Renders: <h1|h2|...|h6 className="usa-prose">{text ?? children}</h...>
  Heading: {
    props: z.object({
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullish(),
      text: z.string().nullish().describe("Heading text. Pass via text prop, not children."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS-styled heading (h1–h6). Pass content via the 'text' prop. Defaults to h2. Applies usa-prose class.",
    example: { level: "h2", text: "Section title" },
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  // No Truss equivalent. Thin HTML wrapper using USWDS font-size utility classes.
  // Weight and color intentionally omitted — use className override for those.
  Text: {
    props: z.object({
      as: z.enum(["p", "span", "div"]).nullish(),
      size: z.enum(["xs", "sm", "base", "lg", "xl"]).nullish(),
      text: z.string().nullish().describe("Text content. Pass via text prop, not children."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS-styled text block. Pass content via the 'text' prop. Defaults to <p>. Use size for USWDS font-sans-* utility sizes.",
    example: { as: "p", size: "base", text: "Body copy goes here." },
  },

  // ── Accordion ─────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Accordion.
  // items array carries all content — no children needed.
  Accordion: {
    props: z.object({
      bordered: z.boolean().nullish(),
      multiselectable: z.boolean().nullish(),
      items: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            expanded: z.boolean(),
            headingLevel: z
              .enum(["h2", "h3", "h4", "h5", "h6"])
              .nullish()
              .describe("Defaults to h4."),
            className: z.string().nullish(),
          })
        )
        .describe("Accordion item definitions."),
      className: z.string().nullish(),
    }),
    description:
      "USWDS accordion (usa-accordion). Pass all sections via the items array — no children. Each item needs id, title, content, expanded.",
    example: {
      items: [
        {
          id: "acc-1",
          title: "First section",
          content: "First section body.",
          expanded: false,
          headingLevel: "h4",
        },
      ],
    },
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Table.
  // Children pass through as-is (thead/tbody/tr/th/td). Caption handled by Truss.
  Table: {
    props: z.object({
      bordered: z.boolean().nullish(),
      caption: z.string().nullish(),
      fullWidth: z.boolean().nullish(),
      fixed: z.boolean().nullish(),
      scrollable: z.boolean().nullish(),
      striped: z.boolean().nullish(),
      compact: z.boolean().nullish(),
      stackedStyle: z.enum(["none", "default", "headers"]).nullish(),
      stickyHeader: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS table (usa-table). Pass thead/tbody/tr/th/td as children. Use caption prop for an accessible caption. Truss has no columns/rows API — children only.",
    example: { caption: "Sample data", striped: true },
  },
```

---

### Step 5c — Add Batch B adapter functions to `components.tsx`

- [ ] Add the following imports to `packages/uswds/src/components.tsx` (add to the existing `@trussworks/react-uswds` import):

```typescript
import {
  Button as TrussButton,
  ButtonGroup as TrussButtonGroup,
  Alert as TrussAlert,
  Tag,
  Link as TrussLink,
  Card as TrussCard,
  CardBody,
  Accordion as TrussAccordion,
  Table as TrussTable,
} from "@trussworks/react-uswds";
```

- [ ] Add the following adapter functions to `packages/uswds/src/components.tsx` (after the Link adapter, before the Registry section):

```typescript
// ── Card ─────────────────────────────────────────────────────────────────────
// Wraps children in CardBody inside Truss Card.
// CardHeader, CardFooter, CardMedia can be passed as children directly when needed.
type CardAdapterProps = Partial<UswdsProps["Card"]> &
  Envelope<UswdsProps["Card"]>;

function Card(all: CardAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussCard
      layout={p.layout ?? "standardDefault"}
      headerFirst={p.headerFirst ?? undefined}
      className={p.className ?? undefined}
    >
      <CardBody>{children}</CardBody>
    </TrussCard>
  );
}

// ── Heading ───────────────────────────────────────────────────────────────────
// No Truss equivalent — thin HTML wrapper with USWDS usa-prose class.
type HeadingAdapterProps = Partial<UswdsProps["Heading"]> &
  Envelope<UswdsProps["Heading"]>;

function Heading(all: HeadingAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const level = p.level ?? "h2";
  const className = ["usa-prose", p.className].filter(Boolean).join(" ");
  const content = p.text ?? children;

  return React.createElement(level, { className }, content);
}

// ── Text ──────────────────────────────────────────────────────────────────────
// No Truss equivalent — thin HTML wrapper with USWDS font-sans-* utility class.
const TEXT_SIZE_CLASS: Record<string, string> = {
  xs: "font-sans-xs",
  sm: "font-sans-sm",
  base: "font-sans-md",
  lg: "font-sans-lg",
  xl: "font-sans-xl",
};

type TextAdapterProps = Partial<UswdsProps["Text"]> &
  Envelope<UswdsProps["Text"]>;

function Text(all: TextAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const tag = p.as ?? "p";
  const sizeClass = p.size ? TEXT_SIZE_CLASS[p.size] : undefined;
  const className = [sizeClass, p.className].filter(Boolean).join(" ") || undefined;
  const content = p.text ?? children;

  return React.createElement(tag, { className }, content);
}

// ── Accordion ─────────────────────────────────────────────────────────────────
type AccordionItem = {
  id: string;
  title: string;
  content: string;
  expanded: boolean;
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6" | null;
  className?: string | null;
};

type AccordionAdapterProps = Partial<UswdsProps["Accordion"]> &
  Envelope<UswdsProps["Accordion"]>;

function Accordion(all: AccordionAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as AccordionItem[];

  // Truss Accordion expects AccordionItemProps[] with headingLevel as required string
  const trussItems = items.map((item) => ({
    id: item.id,
    title: item.title as React.ReactNode,
    content: item.content as React.ReactNode,
    expanded: item.expanded,
    headingLevel: (item.headingLevel ?? "h4") as "h2" | "h3" | "h4" | "h5" | "h6",
    className: item.className ?? undefined,
  }));

  return (
    <TrussAccordion
      bordered={p.bordered ?? undefined}
      multiselectable={p.multiselectable ?? undefined}
      items={trussItems}
      className={p.className ?? undefined}
    />
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
// Passes children through to Truss Table. Caption handled by Truss internally.
type TableAdapterProps = Partial<UswdsProps["Table"]> &
  Envelope<UswdsProps["Table"]>;

function Table(all: TableAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussTable
      bordered={p.bordered ?? undefined}
      caption={p.caption ?? undefined}
      fullWidth={p.fullWidth ?? undefined}
      fixed={p.fixed ?? undefined}
      scrollable={p.scrollable ?? undefined}
      striped={p.striped ?? undefined}
      compact={p.compact ?? undefined}
      stackedStyle={p.stackedStyle ?? undefined}
      stickyHeader={p.stickyHeader ?? undefined}
      className={p.className ?? undefined}
    >
      {children}
    </TrussTable>
  );
}
```

- [ ] Add `Card`, `Heading`, `Text`, `Accordion`, `Table` to the registry object in `uswdsComponents`:

```typescript
export const uswdsComponents: Record<string, React.ComponentType<any>> = {
  Button,
  ButtonGroup,
  Alert,
  Badge,
  Link,
  Card,
  Heading,
  Text,
  Accordion,
  Table,
};
```

---

### Step 5d — Run Batch B tests (green phase)

- [ ] Run each test file:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/card.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/heading.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/text.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/accordion.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/table.test.tsx
  ```

- [ ] Run typecheck:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts packages/uswds/src/components.tsx \
    packages/uswds/tests/components/card.test.tsx \
    packages/uswds/tests/components/heading.test.tsx \
    packages/uswds/tests/components/text.test.tsx \
    packages/uswds/tests/components/accordion.test.tsx \
    packages/uswds/tests/components/table.test.tsx
  git commit -m "feat(uswds): Batch B — Card, Heading, Text, Accordion, Table"
  ```

---

## Task 6 — Batch C: Input, Textarea, Select, Checkbox, Radio

**Goal:** Implement all five form components. TextInput, Select, and Textarea get FormGroup+Label wrappers when `label` prop is present. Checkbox and Radio have label as a direct Truss prop — no wrapper needed.

### Truss imports reference

```typescript
import {
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Radio,
  FormGroup,
  Label,
} from "@trussworks/react-uswds";
```

---

### Step 6a — Write all five test files (TDD: red phase)

- [ ] Write `packages/uswds/tests/components/input.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Input (TextInput)", () => {
  const Input = uswdsComponents.Input;

  it("renders with required id and name", () => {
    render(<Input id="first-name" name="firstName" type="text" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a label when label prop is provided", () => {
    render(
      <Input id="email" name="email" type="email" label="Email address" />
    );
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("renders without a label when label prop is absent", () => {
    render(<Input id="search" name="q" type="text" />);
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("renders hint text when hint prop is provided", () => {
    render(
      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone"
        hint="Format: 555-555-5555"
      />
    );
    expect(screen.getByText("Format: 555-555-5555")).toBeInTheDocument();
  });

  it("applies error validation status", () => {
    const { container } = render(
      <Input id="bad" name="bad" type="text" validationStatus="error" />
    );
    expect(container.querySelector(".usa-input--error")).toBeInTheDocument();
  });

  it("applies success validation status", () => {
    const { container } = render(
      <Input id="good" name="good" type="text" validationStatus="success" />
    );
    expect(container.querySelector(".usa-input--success")).toBeInTheDocument();
  });

  it("has no a11y violations with label", async () => {
    const { container } = render(
      <Input id="a11y" name="a11y" type="text" label="Accessible input" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Input
        id="base"
        name="base"
        type="text"
        props={{ label: "Envelope label", id: "env-input", name: "envInput" }}
      />
    );
    expect(screen.getByLabelText("Envelope label")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/textarea.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Textarea", () => {
  const Textarea = uswdsComponents.Textarea;

  it("renders a textarea element", () => {
    render(<Textarea id="comments" name="comments" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with label when label prop is provided", () => {
    render(
      <Textarea id="comments" name="comments" label="Your comments" />
    );
    expect(screen.getByLabelText("Your comments")).toBeInTheDocument();
  });

  it("renders hint text when hint prop is provided", () => {
    render(
      <Textarea
        id="bio"
        name="bio"
        label="Bio"
        hint="Max 500 characters"
      />
    );
    expect(screen.getByText("Max 500 characters")).toBeInTheDocument();
  });

  it("sets rows attribute", () => {
    render(<Textarea id="notes" name="notes" rows={6} />);
    const el = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(el.rows).toBe(6);
  });

  it("applies usa-textarea class", () => {
    const { container } = render(<Textarea id="t" name="t" />);
    expect(container.querySelector(".usa-textarea")).toBeInTheDocument();
  });

  it("has no a11y violations with label", async () => {
    const { container } = render(
      <Textarea id="a11y" name="a11y" label="Accessible textarea" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Textarea
        id="base"
        name="base"
        props={{ label: "Envelope label", id: "env-ta", name: "envTa" }}
      />
    );
    expect(screen.getByLabelText("Envelope label")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/select.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

const OPTIONS = [
  { value: "va", label: "Virginia" },
  { value: "md", label: "Maryland" },
  { value: "dc", label: "DC" },
];

describe("Select", () => {
  const Select = uswdsComponents.Select;

  it("renders a select element", () => {
    render(<Select id="state" name="state" options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select id="state" name="state" options={OPTIONS} />);
    expect(screen.getByRole("option", { name: "Virginia" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Maryland" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DC" })).toBeInTheDocument();
  });

  it("renders with label when label prop is provided", () => {
    render(
      <Select id="state" name="state" label="State" options={OPTIONS} />
    );
    expect(screen.getByLabelText("State")).toBeInTheDocument();
  });

  it("applies usa-select class", () => {
    const { container } = render(
      <Select id="s" name="s" options={OPTIONS} />
    );
    expect(container.querySelector(".usa-select")).toBeInTheDocument();
  });

  it("applies error validation status", () => {
    const { container } = render(
      <Select
        id="err"
        name="err"
        options={OPTIONS}
        validationStatus="error"
      />
    );
    expect(container.querySelector(".usa-input--error")).toBeInTheDocument();
  });

  it("has no a11y violations with label", async () => {
    const { container } = render(
      <Select id="a11y" name="a11y" label="Accessible select" options={OPTIONS} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Select
        id="base"
        name="base"
        options={[]}
        props={{ label: "Envelope label", id: "env-sel", name: "envSel", options: OPTIONS }}
      />
    );
    expect(screen.getByLabelText("Envelope label")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Virginia" })).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/checkbox.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Checkbox", () => {
  const Checkbox = uswdsComponents.Checkbox;

  it("renders a checkbox input", () => {
    render(<Checkbox id="agree" name="agree" label="I agree" />);
    expect(screen.getByRole("checkbox", { name: "I agree" })).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<Checkbox id="terms" name="terms" label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders tile variant", () => {
    const { container } = render(
      <Checkbox id="tile" name="tile" label="Tile option" tile />
    );
    expect(container.querySelector(".usa-checkbox--tile")).toBeInTheDocument();
  });

  it("applies usa-checkbox class", () => {
    const { container } = render(
      <Checkbox id="cb" name="cb" label="Check" />
    );
    expect(container.querySelector(".usa-checkbox")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Checkbox id="a11y" name="a11y" label="Accessible checkbox" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Checkbox
        id="base"
        name="base"
        label="Base label"
        props={{ label: "Envelope label", id: "env-cb", name: "envCb" }}
      />
    );
    expect(screen.getByRole("checkbox", { name: "Envelope label" })).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/radio.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Radio", () => {
  const Radio = uswdsComponents.Radio;

  it("renders a radio input", () => {
    render(<Radio id="opt-a" name="choice" label="Option A" />);
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<Radio id="opt-b" name="choice" label="Option B" />);
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("renders tile variant", () => {
    const { container } = render(
      <Radio id="tile" name="tile" label="Tile radio" tile />
    );
    expect(container.querySelector(".usa-radio--tile")).toBeInTheDocument();
  });

  it("applies usa-radio class", () => {
    const { container } = render(
      <Radio id="r" name="r" label="Radio" />
    );
    expect(container.querySelector(".usa-radio")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Radio id="a11y" name="a11y-group" label="Accessible radio" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("multiple radios sharing a name form a group", () => {
    render(
      <>
        <Radio id="opt-1" name="group" label="One" />
        <Radio id="opt-2" name="group" label="Two" />
        <Radio id="opt-3" name="group" label="Three" />
      </>
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    radios.forEach((r) => expect(r).toHaveAttribute("name", "group"));
  });

  it("merges envelope props", () => {
    render(
      <Radio
        id="base"
        name="base"
        label="Base label"
        props={{ label: "Envelope label", id: "env-r", name: "envRadio" }}
      />
    );
    expect(screen.getByRole("radio", { name: "Envelope label" })).toBeInTheDocument();
  });
});
```

- [ ] Run tests to confirm all five fail (red phase):
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/input.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/textarea.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/select.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/checkbox.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/radio.test.tsx
  ```

---

### Step 6b — Add Batch C catalog entries to `catalog.ts`

- [ ] Append the following entries inside `uswdsComponentDefinitions` (after the Table entry):

```typescript
  // ── Input (TextInput) ─────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds TextInput.
  // Catalog name is "Input" for AI-friendliness; renders as Truss TextInput.
  // Adapter wraps in FormGroup + Label when label prop is present.
  Input: {
    props: z.object({
      id: z.string().describe("Required. Unique field id."),
      name: z.string().describe("Required. Form field name."),
      type: z
        .enum(["text", "email", "number", "password", "search", "tel", "url"])
        .nullish(),
      label: z.string().nullish().describe("Visible label above the input."),
      hint: z.string().nullish().describe("Helper text rendered below the label."),
      validationStatus: z.enum(["error", "success"]).nullish(),
      inputSize: z.enum(["small", "medium"]).nullish(),
      placeholder: z.string().nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS text input (usa-input). Provide id and name. Add label for an accessible label. Add hint for helper text. validationStatus='error' shows the error state.",
    example: { id: "first-name", name: "firstName", type: "text", label: "First name" },
  },

  // ── Textarea ──────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Textarea.
  // Adapter wraps in FormGroup + Label when label prop is present.
  Textarea: {
    props: z.object({
      id: z.string().describe("Required. Unique field id."),
      name: z.string().describe("Required. Form field name."),
      label: z.string().nullish().describe("Visible label above the textarea."),
      hint: z.string().nullish(),
      placeholder: z.string().nullish(),
      rows: z.number().nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      error: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS textarea (usa-textarea). Provide id and name. Add label for an accessible label. Use rows to control height.",
    example: { id: "comments", name: "comments", label: "Comments", rows: 4 },
  },

  // ── Select ────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Select.
  // Adapter generates <option> elements from the options array.
  Select: {
    props: z.object({
      id: z.string().describe("Required. Unique field id."),
      name: z.string().describe("Required. Form field name."),
      label: z.string().nullish(),
      options: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .describe("Select options list."),
      validationStatus: z.enum(["error", "success"]).nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS select dropdown (usa-select). Pass options as [{value, label}] array. Add label for an accessible label.",
    example: {
      id: "state",
      name: "state",
      label: "State",
      options: [
        { value: "va", label: "Virginia" },
        { value: "md", label: "Maryland" },
      ],
    },
  },

  // ── Checkbox ──────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Checkbox.
  // label is a direct Truss prop — no FormGroup wrapper needed.
  Checkbox: {
    props: z.object({
      id: z.string().describe("Required. Unique input id."),
      name: z.string().describe("Required. Form field name."),
      label: z.string().describe("Required. Visible label text."),
      tile: z.boolean().nullish(),
      labelDescription: z.string().nullish(),
      defaultChecked: z.boolean().nullish(),
      disabled: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS checkbox (usa-checkbox). label prop is required — it is the visible text. Use tile=true for the tile variant.",
    example: { id: "subscribe", name: "subscribe", label: "Subscribe to updates" },
  },

  // ── Radio ─────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Radio.
  // Single radio button. For a group, render multiple Radio elements sharing the same name.
  Radio: {
    props: z.object({
      id: z.string().describe("Required. Must be unique across all radios."),
      name: z.string().describe("Required. All radios in a group share the same name."),
      label: z.string().describe("Required. Visible label text."),
      tile: z.boolean().nullish(),
      labelDescription: z.string().nullish(),
      defaultChecked: z.boolean().nullish(),
      disabled: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS radio button (usa-radio). Single button — render multiple Radio elements sharing the same name for a radio group.",
    example: { id: "opt-yes", name: "confirm", label: "Yes" },
  },
```

---

### Step 6c — Add Batch C adapter functions to `components.tsx`

- [ ] Add the following imports to the existing `@trussworks/react-uswds` import block:

```typescript
import {
  // ... existing imports ...
  TextInput,
  Select as TrussSelect,
  Textarea as TrussTextarea,
  Checkbox as TrussCheckbox,
  Radio as TrussRadio,
  FormGroup,
  Label,
} from "@trussworks/react-uswds";
```

- [ ] Add the following adapter functions after the Table adapter:

```typescript
// ── Input (TextInput) ─────────────────────────────────────────────────────────
// Wraps in FormGroup + Label when label prop is present.
type InputAdapterProps = Partial<UswdsProps["Input"]> &
  Envelope<UswdsProps["Input"]>;

function Input(all: InputAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const id = p.id ?? "input";
  const name = p.name ?? id;

  const input = (
    <TextInput
      id={id}
      name={name}
      type={p.type ?? "text"}
      validationStatus={p.validationStatus ?? undefined}
      inputSize={p.inputSize ?? undefined}
      placeholder={p.placeholder ?? undefined}
      defaultValue={p.defaultValue ?? undefined}
      disabled={p.disabled ?? false}
      required={p.required ?? undefined}
      className={p.className ?? undefined}
    />
  );

  if (!p.label) return input;

  return (
    <FormGroup>
      <Label htmlFor={id}>{p.label}</Label>
      {p.hint && (
        <span className="usa-hint" id={`${id}-hint`}>
          {p.hint}
        </span>
      )}
      {input}
    </FormGroup>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
// Wraps in FormGroup + Label when label prop is present.
type TextareaAdapterProps = Partial<UswdsProps["Textarea"]> &
  Envelope<UswdsProps["Textarea"]>;

function Textarea(all: TextareaAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const id = p.id ?? "textarea";
  const name = p.name ?? id;

  const ta = (
    <TrussTextarea
      id={id}
      name={name}
      placeholder={p.placeholder ?? undefined}
      rows={p.rows ?? undefined}
      defaultValue={p.defaultValue ?? undefined}
      disabled={p.disabled ?? false}
      required={p.required ?? undefined}
      error={p.error ?? undefined}
      className={p.className ?? undefined}
    />
  );

  if (!p.label) return ta;

  return (
    <FormGroup>
      <Label htmlFor={id}>{p.label}</Label>
      {p.hint && (
        <span className="usa-hint" id={`${id}-hint`}>
          {p.hint}
        </span>
      )}
      {ta}
    </FormGroup>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
// Generates <option> children from the options array.
// Wraps in FormGroup + Label when label prop is present.
type SelectOption = { value: string; label: string };

type SelectAdapterProps = Partial<UswdsProps["Select"]> &
  Envelope<UswdsProps["Select"]>;

function Select(all: SelectAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const id = p.id ?? "select";
  const name = p.name ?? id;
  const options = (p.options ?? []) as SelectOption[];

  const select = (
    <TrussSelect
      id={id}
      name={name}
      validationStatus={p.validationStatus ?? undefined}
      defaultValue={p.defaultValue ?? undefined}
      disabled={p.disabled ?? false}
      required={p.required ?? undefined}
      className={p.className ?? undefined}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </TrussSelect>
  );

  if (!p.label) return select;

  return (
    <FormGroup>
      <Label htmlFor={id}>{p.label}</Label>
      {select}
    </FormGroup>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
// label is a direct Truss prop — no FormGroup wrapper needed.
type CheckboxAdapterProps = Partial<UswdsProps["Checkbox"]> &
  Envelope<UswdsProps["Checkbox"]>;

function Checkbox(all: CheckboxAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussCheckbox
      id={p.id ?? "checkbox"}
      name={p.name ?? "checkbox"}
      label={p.label ?? ""}
      tile={p.tile ?? undefined}
      labelDescription={p.labelDescription ?? undefined}
      defaultChecked={p.defaultChecked ?? undefined}
      disabled={p.disabled ?? false}
      className={p.className ?? undefined}
    />
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────────
// label is a direct Truss prop — no FormGroup wrapper needed.
type RadioAdapterProps = Partial<UswdsProps["Radio"]> &
  Envelope<UswdsProps["Radio"]>;

function Radio(all: RadioAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussRadio
      id={p.id ?? "radio"}
      name={p.name ?? "radio"}
      label={p.label ?? ""}
      tile={p.tile ?? undefined}
      labelDescription={p.labelDescription ?? undefined}
      defaultChecked={p.defaultChecked ?? undefined}
      disabled={p.disabled ?? false}
      className={p.className ?? undefined}
    />
  );
}
```

- [ ] Add `Input`, `Textarea`, `Select`, `Checkbox`, `Radio` to the registry object.

---

### Step 6d — Run Batch C tests (green phase)

- [ ] Run each test file:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/input.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/textarea.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/select.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/checkbox.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/radio.test.tsx
  ```

- [ ] Run typecheck:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts packages/uswds/src/components.tsx \
    packages/uswds/tests/components/input.test.tsx \
    packages/uswds/tests/components/textarea.test.tsx \
    packages/uswds/tests/components/select.test.tsx \
    packages/uswds/tests/components/checkbox.test.tsx \
    packages/uswds/tests/components/radio.test.tsx
  git commit -m "feat(uswds): Batch C — Input, Textarea, Select, Checkbox, Radio"
  ```

---

## Task 7 — Batch D: Modal, Pagination, Tooltip, Grid, GridContainer

**Goal:** Implement five structural/overlay components. Modal uses `isInitiallyOpen` instead of a ref because AI-generated specs cannot manage refs. Pagination maps pathname + page numbers. Tooltip wraps children. Grid and GridContainer are thin wrappers.

### Truss imports reference

```typescript
import {
  Modal,
  ModalHeading,
  ModalFooter,
  ModalRef,
  Pagination,
  Tooltip,
  Grid,
  GridContainer,
} from "@trussworks/react-uswds";
import { useRef } from "react";
```

---

### Step 7a — Write all five test files (TDD: red phase)

- [ ] Write `packages/uswds/tests/components/modal.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Modal", () => {
  const Modal = uswdsComponents.Modal;

  it("renders when open is true", () => {
    render(
      <Modal id="test-modal" open heading="Modal title">
        Modal body content
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal title")).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("does not render dialog when open is false", () => {
    render(
      <Modal id="test-modal" open={false} heading="Hidden modal">
        Hidden content
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaults to not open when open prop is absent", () => {
    render(
      <Modal id="test-modal" heading="Default">
        Content
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders isLarge modal", () => {
    const { container } = render(
      <Modal id="large-modal" open isLarge heading="Large">
        Content
      </Modal>
    );
    expect(container.querySelector(".usa-modal--lg")).toBeInTheDocument();
  });

  it("renders heading inside ModalHeading", () => {
    render(
      <Modal id="h-modal" open heading="My heading">
        Body
      </Modal>
    );
    // Truss ModalHeading renders as a heading element
    const heading = screen.getByText("My heading");
    expect(heading).toBeInTheDocument();
  });

  it("has no a11y violations when open", async () => {
    const { container } = render(
      <Modal id="a11y-modal" open heading="Accessible modal">
        Body text
      </Modal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Modal
        id="base"
        open={false}
        props={{ open: true, heading: "Envelope heading", id: "env-modal" }}
      >
        Body
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/pagination.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Pagination", () => {
  const Pagination = uswdsComponents.Pagination;

  it("renders pagination navigation", () => {
    render(
      <Pagination pathname="/results" currentPage={3} totalPages={10} />
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("applies usa-pagination class", () => {
    const { container } = render(
      <Pagination pathname="/results" currentPage={1} totalPages={5} />
    );
    expect(container.querySelector(".usa-pagination")).toBeInTheDocument();
  });

  it("renders page numbers", () => {
    render(
      <Pagination pathname="/results" currentPage={1} totalPages={5} />
    );
    // Page 1 should be visible
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Pagination pathname="/results" currentPage={2} totalPages={8} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <Pagination
        pathname="/base"
        currentPage={1}
        totalPages={1}
        props={{ pathname: "/results", currentPage: 5, totalPages: 10 }}
      />
    );
    expect(container.querySelector(".usa-pagination")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/tooltip.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Tooltip", () => {
  const Tooltip = uswdsComponents.Tooltip;

  it("renders the trigger child", () => {
    render(
      <Tooltip label="Tooltip text">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("renders tooltip label text in DOM", () => {
    render(
      <Tooltip label="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    // Truss renders tooltip text in the DOM (hidden until hover)
    expect(screen.getByText("Helpful hint")).toBeInTheDocument();
  });

  it("applies usa-tooltip class", () => {
    const { container } = render(
      <Tooltip label="Info">
        <button type="button">Info button</button>
      </Tooltip>
    );
    expect(container.querySelector(".usa-tooltip")).toBeInTheDocument();
  });

  it("applies position class when position prop is provided", () => {
    const { container } = render(
      <Tooltip label="Top tooltip" position="top">
        <button type="button">Top</button>
      </Tooltip>
    );
    // Truss adds usa-tooltip__body--top when position is top
    expect(
      container.querySelector(".usa-tooltip__body--top")
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Tooltip label="Accessible tooltip">
        <button type="button">Hover</button>
      </Tooltip>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Tooltip label="Base label" props={{ label: "Envelope tooltip" }}>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.getByText("Envelope tooltip")).toBeInTheDocument();
  });
});
```

- [ ] Write `packages/uswds/tests/components/grid.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Grid", () => {
  const Grid = uswdsComponents.Grid;

  it("renders children", () => {
    render(<Grid>Grid content</Grid>);
    expect(screen.getByText("Grid content")).toBeInTheDocument();
  });

  it("applies usa-grid class when row prop is true", () => {
    const { container } = render(<Grid row>Row content</Grid>);
    // Truss Grid with row renders grid__row class
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
  const GridContainer = uswdsComponents.GridContainer;

  it("renders children", () => {
    render(<GridContainer>Container content</GridContainer>);
    expect(screen.getByText("Container content")).toBeInTheDocument();
  });

  it("applies grid-container class", () => {
    const { container } = render(
      <GridContainer>Container</GridContainer>
    );
    expect(container.querySelector(".grid-container")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <GridContainer>Container</GridContainer>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    const { container } = render(
      <GridContainer props={{ className: "custom-container" }}>
        Content
      </GridContainer>
    );
    expect(container.querySelector(".custom-container")).toBeInTheDocument();
  });
});
```

- [ ] Run tests to confirm all five fail (red phase):
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/modal.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/pagination.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/tooltip.test.tsx
  pnpm --filter @oddball/json-render-uswds test tests/components/grid.test.tsx
  ```

---

### Step 7b — Add Batch D catalog entries to `catalog.ts`

- [ ] Append the following entries inside `uswdsComponentDefinitions` (after the Radio entry):

```typescript
  // ── Modal ─────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Modal.
  // Uses isInitiallyOpen instead of a ModalRef because AI-generated specs
  // cannot manage refs. open=true → isInitiallyOpen=true; open=false → don't render.
  Modal: {
    props: z.object({
      id: z.string().describe("Required. Unique modal id."),
      open: z.boolean().nullish().describe("Whether the modal is shown. Defaults to false."),
      heading: z.string().nullish().describe("Modal heading text, rendered inside ModalHeading."),
      isLarge: z.boolean().nullish(),
      forceAction: z.boolean().nullish().describe("Forces user to take action before dismissing."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS modal dialog (usa-modal). Set open=true to show. Pass heading prop for the modal title. Children = modal body. Truss Modal normally requires a ref; this adapter uses isInitiallyOpen for AI-spec compatibility.",
    example: { id: "confirm-modal", open: true, heading: "Confirm action" },
  },

  // ── Pagination ────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Pagination.
  Pagination: {
    props: z.object({
      pathname: z.string().describe("Required. Base path for page links."),
      currentPage: z.number().describe("Required. Current page number (1-indexed)."),
      totalPages: z.number().nullish(),
      maxSlots: z.number().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS pagination (usa-pagination). Provide pathname and currentPage. totalPages controls how many pages render. Use onClickPageNumber for SPA navigation.",
    example: { pathname: "/results", currentPage: 3, totalPages: 10 },
  },

  // ── Tooltip ───────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Tooltip.
  // Truss Tooltip wraps children in a button trigger by default.
  Tooltip: {
    props: z.object({
      label: z.string().describe("Required. Tooltip text shown on hover."),
      position: z.enum(["top", "bottom", "left", "right"]).nullish(),
      wrapperclasses: z.string().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS tooltip (usa-tooltip). Pass label for tooltip text. Children = the trigger element (button, icon, etc.). Position defaults to top.",
    example: { label: "More information", position: "top" },
  },

  // ── Grid ──────────────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds Grid.
  Grid: {
    props: z.object({
      row: z.boolean().nullish().describe("Renders as a grid row."),
      col: z.union([z.number(), z.string()]).nullish().describe("Column span (1–12 or 'auto')."),
      gap: z.union([z.number(), z.string()]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS grid cell or row (grid-col / grid-row). Use col to set column span. Use row to create a flex row. Nest inside GridContainer.",
    example: { col: 6 },
  },

  // ── GridContainer ─────────────────────────────────────────────────────────
  // Maps to @trussworks/react-uswds GridContainer.
  GridContainer: {
    props: z.object({
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS grid container (grid-container). Outer wrapper for a Grid layout. Contains Grid row/col children.",
    example: {},
  },
```

---

### Step 7c — Add Batch D adapter functions to `components.tsx`

- [ ] Add the following imports to the existing `@trussworks/react-uswds` import block:

```typescript
import {
  // ... existing imports ...
  Modal as TrussModal,
  ModalHeading,
  ModalRef,
  Pagination as TrussPagination,
  Tooltip as TrussTooltip,
  Grid as TrussGrid,
  GridContainer as TrussGridContainer,
} from "@trussworks/react-uswds";
import { useRef } from "react";
```

- [ ] Add the following adapter functions after the Radio adapter:

```typescript
// ── Modal ─────────────────────────────────────────────────────────────────────
// Renders Truss Modal with isInitiallyOpen when open=true.
// When open=false the component returns null — no DOM output.
// Heading is rendered inside ModalHeading. Children = modal body.
type ModalAdapterProps = Partial<UswdsProps["Modal"]> &
  Envelope<UswdsProps["Modal"]>;

function Modal(all: ModalAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const modalRef = useRef<ModalRef>(null);

  if (!p.open) return null;

  return (
    <TrussModal
      id={p.id ?? "modal"}
      ref={modalRef}
      isLarge={p.isLarge ?? undefined}
      forceAction={p.forceAction ?? undefined}
      isInitiallyOpen
      className={p.className ?? undefined}
      aria-labelledby={p.heading ? `${p.id ?? "modal"}-heading` : undefined}
      aria-describedby={`${p.id ?? "modal"}-description`}
    >
      {p.heading && (
        <ModalHeading id={`${p.id ?? "modal"}-heading`}>
          {p.heading}
        </ModalHeading>
      )}
      <div id={`${p.id ?? "modal"}-description`}>{children}</div>
    </TrussModal>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
type PaginationAdapterProps = Partial<UswdsProps["Pagination"]> &
  Envelope<UswdsProps["Pagination"]>;

function Pagination(all: PaginationAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussPagination
      pathname={p.pathname ?? "/"}
      currentPage={p.currentPage ?? 1}
      totalPages={p.totalPages ?? undefined}
      maxSlots={p.maxSlots ?? undefined}
      className={p.className ?? undefined}
    />
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
// Truss Tooltip requires children as the trigger element.
// Falls back to a plain span if no children provided.
type TooltipAdapterProps = Partial<UswdsProps["Tooltip"]> &
  Envelope<UswdsProps["Tooltip"]>;

function Tooltip(all: TooltipAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const trigger = children ?? <span>{p.label}</span>;

  return (
    <TrussTooltip
      label={p.label ?? ""}
      position={p.position ?? undefined}
      wrapperclasses={p.wrapperclasses ?? undefined}
      className={p.className ?? undefined}
    >
      {trigger}
    </TrussTooltip>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
type GridAdapterProps = Partial<UswdsProps["Grid"]> &
  Envelope<UswdsProps["Grid"]>;

function Grid(all: GridAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussGrid
      row={p.row ?? undefined}
      col={p.col ?? undefined}
      gap={p.gap ?? undefined}
      className={p.className ?? undefined}
    >
      {children}
    </TrussGrid>
  );
}

// ── GridContainer ─────────────────────────────────────────────────────────────
type GridContainerAdapterProps = Partial<UswdsProps["GridContainer"]> &
  Envelope<UswdsProps["GridContainer"]>;

function GridContainer(all: GridContainerAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussGridContainer className={p.className ?? undefined}>
      {children}
    </TrussGridContainer>
  );
}
```

- [ ] Add `Modal`, `Pagination`, `Tooltip`, `Grid`, `GridContainer` to the registry object.

---

### Step 7d — Run Batch D tests (green phase)

- [ ] Run each test file:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/modal.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/pagination.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/tooltip.test.tsx
  ```
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/grid.test.tsx
  ```

- [ ] Run typecheck:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts packages/uswds/src/components.tsx \
    packages/uswds/tests/components/modal.test.tsx \
    packages/uswds/tests/components/pagination.test.tsx \
    packages/uswds/tests/components/tooltip.test.tsx \
    packages/uswds/tests/components/grid.test.tsx
  git commit -m "feat(uswds): Batch D — Modal, Pagination, Tooltip, Grid, GridContainer"
  ```

---

## Task 8 — Update `catalog.test.ts`

**Goal:** Remove the `@json-render/shadcn` parity test (we are no longer required to be a superset of shadcn). Add a test that `UNSUPPORTED_COMPONENTS` is exported from `catalog.ts` and is an array. Keep the two surviving tests unchanged.

### Step 8a — Add `UNSUPPORTED_COMPONENTS` to `catalog.ts`

- [ ] Add the following export to `packages/uswds/src/catalog.ts` (at the bottom of the file, after `UswdsProps`):

```typescript
/**
 * Components that existed in the previous CVA/Radix implementation but have
 * no @trussworks/react-uswds equivalent and are not part of the USWDS design
 * system. They are explicitly dropped rather than silently removed.
 */
export const UNSUPPORTED_COMPONENTS = [
  "Avatar",
  "Carousel",
  "Collapsible",
  "Dialog",       // replaced by Modal
  "Drawer",
  "DropdownMenu",
  "Image",
  "Popover",
  "Progress",
  "Separator",
  "Skeleton",
  "Slider",
  "Spinner",
  "Stack",
  "Switch",
  "Tabs",
  "ToggleGroup",
  "Toggle",
] as const;
```

---

### Step 8b — Rewrite `catalog.test.ts`

- [ ] Replace `packages/uswds/tests/catalog.test.ts` with:

```typescript
import { describe, expect, it } from "vitest";
import { uswdsComponentDefinitions, UNSUPPORTED_COMPONENTS } from "../src/catalog";
import { uswdsComponents } from "../src/components";

describe("uswds catalog contract", () => {
  it("every catalog entry has a matching component implementation", () => {
    const catalogKeys = Object.keys(uswdsComponentDefinitions).sort();
    const componentKeys = Object.keys(uswdsComponents).sort();
    expect(componentKeys).toEqual(catalogKeys);
  });

  it("every example validates against its own schema", () => {
    for (const [name, def] of Object.entries(uswdsComponentDefinitions)) {
      const result = def.props.safeParse(def.example);
      if (!result.success) {
        throw new Error(
          `Example for "${name}" failed schema validation: ${result.error.message}`
        );
      }
    }
  });

  it("UNSUPPORTED_COMPONENTS is exported and is an array", () => {
    expect(Array.isArray(UNSUPPORTED_COMPONENTS)).toBe(true);
    expect(UNSUPPORTED_COMPONENTS.length).toBeGreaterThan(0);
  });

  it("no UNSUPPORTED_COMPONENTS key exists in the catalog", () => {
    const catalogKeys = new Set(Object.keys(uswdsComponentDefinitions));
    const conflicts = (UNSUPPORTED_COMPONENTS as readonly string[]).filter((k) =>
      catalogKeys.has(k)
    );
    expect(conflicts).toEqual([]);
  });
});
```

---

### Step 8c — Run updated catalog tests

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/catalog.test.ts 2>&1
  ```
  Expected: all four tests pass. The shadcn import error is gone. Key-match and example-validation pass because Batches A–D are complete. The `UNSUPPORTED_COMPONENTS` tests pass because we just exported it.

- [ ] Run the full suite to confirm no regressions:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -30
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts packages/uswds/tests/catalog.test.ts
  git commit -m "test(uswds): update catalog.test.ts — drop shadcn parity, add UNSUPPORTED_COMPONENTS guard"
  ```

## Task 9 — New top-level components, Batch E: Icon, SiteAlert, Breadcrumb, SideNav, InPageNavigation, StepIndicator, ProcessList, SummaryBox, Search

### Step 9a — Add Batch E Zod schemas to `catalog.ts`

- [ ] Open `packages/uswds/src/catalog.ts`. After the last Batch D entry, append the following nine schemas:

  ```typescript
  Icon: {
    props: z.object({
      name: z.string().describe("Icon name exported from Truss Icon namespace, e.g. 'Search', 'AccountBalance', 'Star'"),
      size: z.union([z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9)]).optional().describe("Icon size in units"),
      className: z.string().optional(),
    }),
    description: "Renders a USWDS icon from the @trussworks/react-uswds Icon namespace.",
    example: { name: "Star", size: 4 },
  },

  SiteAlert: {
    props: z.object({
      variant: z.enum(["info", "emergency"]).describe("Alert variant: 'info' (blue) or 'emergency' (red)"),
      heading: z.string().optional().describe("Bold heading text inside the alert"),
      children: z.string().optional().describe("Body text of the alert"),
      showIcon: z.boolean().optional().describe("Whether to show the leading icon (default true)"),
      slim: z.boolean().optional().describe("Renders the slim (compact) variant"),
      className: z.string().optional(),
    }),
    description: "Full-width site-level alert banner (USWDS SiteAlert).",
    example: { variant: "info", heading: "COVID-19 information", children: "Visit CDC.gov for the latest guidance." },
  },

  Breadcrumb: {
    props: z.object({
      crumbs: z.array(
        z.object({
          label: z.string(),
          href: z.string().optional(),
          current: z.boolean().optional(),
        })
      ).describe("Ordered list of breadcrumb items. The last item is treated as current page."),
      variant: z.enum(["default", "wrap"]).optional(),
      className: z.string().optional(),
    }),
    description: "USWDS breadcrumb navigation bar. Pass an ordered array of crumbs; the last is auto-marked current.",
    example: {
      crumbs: [
        { label: "Home", href: "/" },
        { label: "Benefits", href: "/benefits" },
        { label: "Health care", current: true },
      ],
    },
  },

  SideNav: {
    props: z.object({
      items: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          current: z.boolean().optional(),
        })
      ).describe("Navigation items rendered as anchor tags"),
      isSubnav: z.boolean().optional().describe("Renders as a sub-navigation list (indented)"),
      className: z.string().optional(),
    }),
    description: "USWDS side navigation menu.",
    example: {
      items: [
        { label: "Overview", href: "#overview" },
        { label: "Details", href: "#details", current: true },
        { label: "Documents", href: "#documents" },
      ],
    },
  },

  InPageNavigation: {
    props: z.object({
      title: z.string().describe("Heading text for the in-page navigation section (e.g. 'On this page')"),
      items: z.array(
        z.object({
          text: z.string(),
          href: z.string().describe("Anchor href, e.g. '#section-1'"),
        })
      ),
      headingUswdsStyle: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional().describe("Heading level for the title (default 'h4')"),
      className: z.string().optional(),
    }),
    description: "USWDS in-page navigation (table of contents) component.",
    example: {
      title: "On this page",
      headingUswdsStyle: "h4",
      items: [
        { text: "Eligibility", href: "#eligibility" },
        { text: "How to apply", href: "#apply" },
        { text: "After you apply", href: "#after" },
      ],
    },
  },

  StepIndicator: {
    props: z.object({
      steps: z.array(
        z.object({
          label: z.string(),
          status: z.enum(["complete", "current", "incomplete"]).optional().describe("Defaults to 'incomplete'"),
        })
      ).describe("Ordered list of steps"),
      headingLevel: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional().describe("Heading level used for step labels (default 'h4')"),
      showLabels: z.boolean().optional().describe("Show text labels below step circles"),
      counters: z.enum(["none", "default", "small"]).optional().describe("Counter style inside step circles"),
      centered: z.boolean().optional(),
      className: z.string().optional(),
    }),
    description: "USWDS step indicator showing progress through a multi-step process.",
    example: {
      headingLevel: "h4",
      showLabels: true,
      steps: [
        { label: "Personal info", status: "complete" },
        { label: "Household members", status: "current" },
        { label: "Review", status: "incomplete" },
      ],
    },
  },

  ProcessList: {
    props: z.object({
      steps: z.array(z.string()).describe("Ordered list of step description strings"),
      className: z.string().optional(),
    }),
    description: "USWDS process list — numbered sequential steps rendered as an ordered list.",
    example: {
      steps: [
        "Submit your application online.",
        "Wait for confirmation email within 3 business days.",
        "Schedule your in-person appointment.",
      ],
    },
  },

  SummaryBox: {
    props: z.object({
      heading: z.string().optional().describe("Optional bold heading rendered inside the box"),
      items: z.array(z.string()).optional().describe("Bullet-point summary items"),
      className: z.string().optional(),
    }),
    description: "USWDS summary box — highlighted box used to call out key information.",
    example: {
      heading: "Key information",
      items: [
        "Applications are accepted year-round.",
        "Processing takes 4–6 weeks.",
        "You will be notified by mail.",
      ],
    },
  },

  Search: {
    props: z.object({
      label: z.string().optional().describe("Accessible label for the search input (default 'Search')"),
      size: z.enum(["big", "small"]).optional().describe("Size variant — omit for default"),
      inputId: z.string().optional(),
      onSubmit: z.string().nullish().describe("Action binding name called with the search query string on submit"),
      className: z.string().optional(),
    }),
    description: "USWDS search bar component.",
    example: { label: "Search", size: "small" },
  },
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts
  git commit -m "feat(uswds): add Batch E catalog schemas (Icon, SiteAlert, Breadcrumb, SideNav, InPageNavigation, StepIndicator, ProcessList, SummaryBox, Search)"
  ```

---

### Step 9b — Add Batch E adapters to `components.tsx`

- [ ] Open `packages/uswds/src/components.tsx`. After the last Batch D adapter, append:

  ```tsx
  // ─── Batch E ──────────────────────────────────────────────────────────────

  Icon: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const merged = { ...envelopeProps, ...rest }
    const { name, size, className, ...iconRest } = merged
    // Icon namespace — each icon is a sub-component: Icon.Search, Icon.Star, etc.
    const IconComponent = (TrussIcon as any)[name]
    if (!IconComponent) {
      return <span className={className}>?</span>
    }
    return <IconComponent size={size} className={className} {...iconRest} />
  },

  SiteAlert: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { children: bodyText, ...merged } = { ...envelopeProps, ...rest }
    return (
      <TrussSiteAlert {...merged}>
        {bodyText}
      </TrussSiteAlert>
    )
  },

  Breadcrumb: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { crumbs = [], variant, className, ...merged } = { ...envelopeProps, ...rest }
    return (
      <TrussBreadcrumbBar variant={variant} className={className}>
        {(crumbs as Array<{ label: string; href?: string; current?: boolean }>).map((crumb, i) => {
          const isCurrent = crumb.current ?? i === crumbs.length - 1
          return (
            <TrussBreadcrumb key={i} current={isCurrent}>
              {isCurrent ? crumb.label : <a href={crumb.href ?? "#"}>{crumb.label}</a>}
            </TrussBreadcrumb>
          )
        })}
      </TrussBreadcrumbBar>
    )
  },

  SideNav: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { items = [], isSubnav, className, ...merged } = { ...envelopeProps, ...rest }
    const navItems = (items as Array<{ label: string; href: string; current?: boolean }>).map((item, i) => (
      <a key={i} href={item.href} className={item.current ? "usa-current" : undefined}>
        {item.label}
      </a>
    ))
    return <TrussSideNav items={navItems} isSubnav={isSubnav} className={className} />
  },

  InPageNavigation: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { title = "On this page", items = [], headingUswdsStyle = "h4", className, ...merged } = { ...envelopeProps, ...rest }
    return (
      <TrussInPageNavigation
        title={title}
        items={items}
        headingUswdsStyle={headingUswdsStyle}
        className={className}
      />
    )
  },

  StepIndicator: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { steps = [], headingLevel = "h4", showLabels, counters, centered, className } = { ...envelopeProps, ...rest }
    return (
      <TrussStepIndicator
        headingLevel={headingLevel}
        showLabels={showLabels}
        counters={counters}
        centered={centered}
        className={className}
      >
        {(steps as Array<{ label: string; status?: "complete" | "current" | "incomplete" }>).map((step, i) => (
          <TrussStepIndicatorStep
            key={i}
            label={step.label}
            status={step.status ?? "incomplete"}
          />
        ))}
      </TrussStepIndicator>
    )
  },

  ProcessList: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { steps = [], className } = { ...envelopeProps, ...rest }
    return (
      <TrussProcessList className={className}>
        {(steps as string[]).map((step, i) => (
          <TrussProcessListItem key={i}>{step}</TrussProcessListItem>
        ))}
      </TrussProcessList>
    )
  },

  SummaryBox: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { heading, items = [], className } = { ...envelopeProps, ...rest }
    return (
      <TrussSummaryBox className={className}>
        {heading && <p className="usa-summary-box__heading">{heading}</p>}
        {(items as string[]).length > 0 && (
          <ul className="usa-list">
            {(items as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </TrussSummaryBox>
    )
  },

  Search: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label = "Search", size, inputId, onSubmit, className, ...searchRest } = { ...envelopeProps, ...rest }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const fd = new FormData(e.currentTarget)
      const query = fd.get("search") as string
      if (onSubmit && emit) emit(onSubmit, query)
    }
    return (
      <TrussSearch
        label={label}
        size={size}
        inputId={inputId ?? "search-input"}
        onSubmit={handleSubmit}
        className={className}
        {...searchRest}
      />
    )
  },
  ```

- [ ] Add imports for new Truss components at top of `components.tsx`:
  ```tsx
  import {
    // … existing imports …
    Icon as TrussIcon,
    SiteAlert as TrussSiteAlert,
    BreadcrumbBar as TrussBreadcrumbBar,
    Breadcrumb as TrussBreadcrumb,
    SideNav as TrussSideNav,
    InPageNavigation as TrussInPageNavigation,
    StepIndicator as TrussStepIndicator,
    StepIndicatorStep as TrussStepIndicatorStep,
    ProcessList as TrussProcessList,
    ProcessListItem as TrussProcessListItem,
    SummaryBox as TrussSummaryBox,
    Search as TrussSearch,
  } from "@trussworks/react-uswds"
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/components.tsx
  git commit -m "feat(uswds): add Batch E adapters (Icon, SiteAlert, Breadcrumb, SideNav, InPageNavigation, StepIndicator, ProcessList, SummaryBox, Search)"
  ```

---

### Step 9c — Smoke-test Batch E

- [ ] Run per-component smoke tests (create `tests/components/batch-e.test.tsx` if not yet auto-generated — see Step 3a pattern). Minimum: render each component with its catalog `example` props, assert no throw and non-empty container.
- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -20
  ```
- [ ] Fix any import or render errors before proceeding.

---

## Task 10 — New top-level components, Batch F: Collection, Banner (GovBanner), Identifier, Header, Footer, LanguageSelector, IconList, MediaBlock

> These are complex compound components. Catalog entries expose simplified flat props sufficient for AI-generated specs. Adapters compose Truss sub-components internally. Mark "use with caution — limited AI support" where layout complexity is high.

### Step 10a — Add Batch F Zod schemas to `catalog.ts`

- [ ] Append to `packages/uswds/src/catalog.ts`:

  ```typescript
  Collection: {
    props: z.object({
      items: z.array(
        z.object({
          heading: z.string().describe("Title of the collection item"),
          href: z.string().optional().describe("URL the heading links to"),
          description: z.string().optional(),
          meta: z.array(z.string()).optional().describe("Short metadata strings shown below description"),
        })
      ),
      className: z.string().optional(),
    }),
    description: "USWDS collection — a list of items each with a heading, optional description, and metadata. Use with caution — limited AI support for rich media variants.",
    example: {
      items: [
        { heading: "Benefit update", href: "#", description: "New rates effective January 1.", meta: ["Jan 1, 2026", "Benefits"] },
        { heading: "System maintenance", href: "#", description: "Scheduled downtime this weekend." },
      ],
    },
  },

  Banner: {
    props: z.object({
      language: z.enum(["english", "spanish"]).optional().describe("Language variant (default 'english')"),
      tld: z.enum(["gov", "mil"]).optional().describe("Domain TLD shown in the banner (default 'gov')"),
      className: z.string().optional(),
    }),
    description: "USWDS GovBanner — the 'An official website of the United States government' top-of-page banner. Use with caution — limited AI support; place at top of page layout only.",
    example: { language: "english", tld: "gov" },
  },

  Identifier: {
    props: z.object({
      identity: z.object({
        ariaLabel: z.string().optional(),
        domain: z.string().describe("Agency domain, e.g. 'agency.gov'"),
        disclaimerText: z.string().optional(),
      }),
      logoSrc: z.string().optional().describe("URL of agency logo image"),
      logoAlt: z.string().optional(),
      links: z.array(
        z.object({ label: z.string(); href: z.string() })
      ).optional().describe("Footer identifier links (About, Accessibility, etc.)"),
      className: z.string().optional(),
    }),
    description: "USWDS Identifier — agency identity footer block with logo, domain, and standard gov links. Use with caution — limited AI support.",
    example: {
      identity: { domain: "agency.gov", disclaimerText: "An official website of the Department of Example Affairs." },
      links: [
        { label: "About", href: "#about" },
        { label: "Accessibility statement", href: "#accessibility" },
      ],
    },
  },

  Header: {
    props: z.object({
      title: z.string().describe("Site title shown in the header"),
      navItems: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          current: z.boolean().optional(),
        })
      ).optional().describe("Primary nav links"),
      basic: z.boolean().optional().describe("Use basic (non-extended) header variant (default true)"),
      className: z.string().optional(),
    }),
    description: "USWDS site header with title and optional primary navigation. Use with caution — limited AI support for megamenu or extended variants.",
    example: {
      title: "Agency Portal",
      navItems: [
        { label: "Home", href: "/", current: true },
        { label: "Benefits", href: "/benefits" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },

  Footer: {
    props: z.object({
      columns: z.array(
        z.object({
          heading: z.string(),
          links: z.array(z.object({ label: z.string(); href: z.string() })),
        })
      ).optional().describe("Navigation columns for the slim/medium footer"),
      logoSrc: z.string().optional(),
      logoAlt: z.string().optional(),
      size: z.enum(["slim", "medium", "big"]).optional().describe("Footer size variant (default 'slim')"),
      className: z.string().optional(),
    }),
    description: "USWDS site footer. Use with caution — limited AI support for big footer variant.",
    example: {
      size: "slim",
      columns: [
        {
          heading: "About",
          links: [
            { label: "Mission & vision", href: "#mission" },
            { label: "Leadership", href: "#leadership" },
          ],
        },
      ],
    },
  },

  LanguageSelector: {
    props: z.object({
      langs: z.array(
        z.object({
          label: z.string().describe("Language name in the target language, e.g. 'Español'"),
          lang: z.string().describe("BCP-47 lang code, e.g. 'es'"),
          href: z.string().optional(),
        })
      ),
      small: z.boolean().optional().describe("Compact display variant"),
      className: z.string().optional(),
    }),
    description: "USWDS language selector for multilingual sites.",
    example: {
      langs: [
        { label: "English", lang: "en" },
        { label: "Español", lang: "es" },
      ],
    },
  },

  IconList: {
    props: z.object({
      items: z.array(
        z.object({
          iconName: z.string().describe("Icon name from Truss Icon namespace, e.g. 'Check', 'Close'"),
          text: z.string().describe("Text content for this list item"),
          iconColor: z.string().optional().describe("CSS color class or value for the icon"),
        })
      ),
      className: z.string().optional(),
    }),
    description: "USWDS icon list — an unordered list where each item has a leading USWDS icon.",
    example: {
      items: [
        { iconName: "Check", text: "Direct deposit available" },
        { iconName: "Check", text: "Online application" },
        { iconName: "Close", text: "Paper forms discontinued" },
      ],
    },
  },

  MediaBlock: {
    props: z.object({
      imgSrc: z.string().describe("Image URL"),
      imgAlt: z.string().optional(),
      heading: z.string().optional(),
      body: z.string().optional().describe("Body text rendered next to the image"),
      reversed: z.boolean().optional().describe("Places image on the right side"),
      className: z.string().optional(),
    }),
    description: "USWDS media block — image paired with text content. Use with caution — limited AI support for complex slot compositions.",
    example: {
      imgSrc: "https://designsystem.digital.gov/img/home/hero.png",
      imgAlt: "USWDS hero image",
      heading: "Design for impact",
      body: "Build accessible, mobile-friendly government websites faster with USWDS.",
    },
  },
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts
  git commit -m "feat(uswds): add Batch F catalog schemas (Collection, Banner, Identifier, Header, Footer, LanguageSelector, IconList, MediaBlock)"
  ```

---

### Step 10b — Add Batch F adapters to `components.tsx`

- [ ] Append to `packages/uswds/src/components.tsx`:

  ```tsx
  // ─── Batch F ──────────────────────────────────────────────────────────────

  Collection: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { items = [], className } = { ...envelopeProps, ...rest }
    return (
      <TrussCollection className={className}>
        {(items as Array<{ heading: string; href?: string; description?: string; meta?: string[] }>).map((item, i) => (
          <TrussCollectionItem key={i}>
            <TrussCollectionHeading>
              {item.href ? <a href={item.href}>{item.heading}</a> : item.heading}
            </TrussCollectionHeading>
            {item.description && <TrussCollectionDescription>{item.description}</TrussCollectionDescription>}
            {item.meta && item.meta.length > 0 && (
              <TrussCollectionMeta>
                {item.meta.map((m, j) => (
                  <TrussCollectionMetaItem key={j}>{m}</TrussCollectionMetaItem>
                ))}
              </TrussCollectionMeta>
            )}
          </TrussCollectionItem>
        ))}
      </TrussCollection>
    )
  },

  Banner: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { language = "english", tld = "gov", className } = { ...envelopeProps, ...rest }
    return <TrussGovBanner language={language} tld={tld} className={className} />
  },

  Identifier: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { identity = {}, logoSrc, logoAlt, links = [], className } = { ...envelopeProps, ...rest }
    return (
      <TrussIdentifier className={className}>
        <TrussIdentifierMasthead aria-label={identity.ariaLabel}>
          <TrussIdentifierLogos>
            <TrussIdentifierLogo>
              {logoSrc ? <img src={logoSrc} alt={logoAlt ?? ""} /> : null}
            </TrussIdentifierLogo>
          </TrussIdentifierLogos>
          <TrussIdentifierIdentity domain={identity.domain}>
            <p>{identity.disclaimerText}</p>
          </TrussIdentifierIdentity>
        </TrussIdentifierMasthead>
        {links.length > 0 && (
          <TrussIdentifierLinks>
            {(links as Array<{ label: string; href: string }>).map((link, i) => (
              <TrussIdentifierLink key={i}>
                <a href={link.href}>{link.label}</a>
              </TrussIdentifierLink>
            ))}
          </TrussIdentifierLinks>
        )}
        <TrussIdentifierGov />
      </TrussIdentifier>
    )
  },

  Header: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { title = "", navItems = [], basic = true, className } = { ...envelopeProps, ...rest }
    const primaryNavItems = (navItems as Array<{ label: string; href: string; current?: boolean }>).map((item, i) => (
      <a key={i} href={item.href} className={item.current ? "usa-current" : undefined}>
        {item.label}
      </a>
    ))
    return (
      <TrussHeader basic={basic} className={className}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <TrussTitle>{title}</TrussTitle>
          </div>
          {primaryNavItems.length > 0 && (
            <TrussPrimaryNav items={primaryNavItems} mobileExpanded={false} onToggleMobileNav={() => {}} />
          )}
        </div>
      </TrussHeader>
    )
  },

  Footer: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { columns = [], logoSrc, logoAlt, size = "slim", className } = { ...envelopeProps, ...rest }
    const navColumns = (columns as Array<{ heading: string; links: Array<{ label: string; href: string }> }>).map((col, i) => (
      <TrussFooterNav key={i} size={size} links={col.links.map((l, j) => <a key={j} href={l.href}>{l.label}</a>)} />
    ))
    return (
      <TrussFooter
        size={size}
        className={className}
        primary={navColumns.length > 0 ? <>{navColumns}</> : undefined}
        secondary={
          logoSrc ? (
            <TrussLogo
              size={size}
              image={<img src={logoSrc} alt={logoAlt ?? ""} />}
            />
          ) : undefined
        }
      />
    )
  },

  LanguageSelector: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { langs = [], small, className } = { ...envelopeProps, ...rest }
    return (
      <TrussLanguageSelector
        small={small}
        className={className}
        langs={langs}
      />
    )
  },

  IconList: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { items = [], className } = { ...envelopeProps, ...rest }
    return (
      <TrussIconList className={className}>
        {(items as Array<{ iconName: string; text: string; iconColor?: string }>).map((item, i) => {
          const IconComp = (TrussIcon as any)[item.iconName]
          return (
            <TrussIconListItem key={i}>
              <TrussIconListIcon color={item.iconColor}>
                {IconComp ? <IconComp /> : null}
              </TrussIconListIcon>
              <TrussIconListContent>{item.text}</TrussIconListContent>
            </TrussIconListItem>
          )
        })}
      </TrussIconList>
    )
  },

  MediaBlock: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { imgSrc, imgAlt = "", heading, body, reversed, className } = { ...envelopeProps, ...rest }
    return (
      <div className={["usa-media-block", reversed ? "usa-media-block--reversed" : "", className].filter(Boolean).join(" ")}>
        {imgSrc && <img className="usa-media-block__img" src={imgSrc} alt={imgAlt} />}
        <TrussMediaBlockBody>
          {heading && <h2 className="usa-media-block__heading">{heading}</h2>}
          {body && <p>{body}</p>}
        </TrussMediaBlockBody>
      </div>
    )
  },
  ```

- [ ] Add imports for Batch F Truss components:
  ```tsx
  import {
    // … existing imports …
    Collection as TrussCollection,
    CollectionItem as TrussCollectionItem,
    CollectionHeading as TrussCollectionHeading,
    CollectionDescription as TrussCollectionDescription,
    CollectionMeta as TrussCollectionMeta,
    CollectionMetaItem as TrussCollectionMetaItem,
    GovBanner as TrussGovBanner,
    Identifier as TrussIdentifier,
    IdentifierMasthead as TrussIdentifierMasthead,
    IdentifierLogos as TrussIdentifierLogos,
    IdentifierLogo as TrussIdentifierLogo,
    IdentifierIdentity as TrussIdentifierIdentity,
    IdentifierLinks as TrussIdentifierLinks,
    IdentifierLink as TrussIdentifierLink,
    IdentifierGov as TrussIdentifierGov,
    Header as TrussHeader,
    Title as TrussTitle,
    PrimaryNav as TrussPrimaryNav,
    Footer as TrussFooter,
    FooterNav as TrussFooterNav,
    Logo as TrussLogo,
    LanguageSelector as TrussLanguageSelector,
    IconList as TrussIconList,
    IconListIcon as TrussIconListIcon,
    IconListContent as TrussIconListContent,
    IconListItem as TrussIconListItem,
    MediaBlockBody as TrussMediaBlockBody,
  } from "@trussworks/react-uswds"
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/components.tsx
  git commit -m "feat(uswds): add Batch F adapters (Collection, Banner, Identifier, Header, Footer, LanguageSelector, IconList, MediaBlock)"
  ```

---

### Step 10c — Smoke-test Batch F

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -20
  ```
- [ ] Note: Header, Footer, Identifier, and Banner import multiple sub-components. If any named export doesn't exist in the installed Truss version, the import will fail at build time. Check `@trussworks/react-uswds` version and adjust sub-component names to match.
- [ ] Fix any import or render errors before proceeding.

---

## Task 11 — New form components, Batch G: ComboBox, DatePicker, DateRangePicker, FileInput, RangeInput, TimePicker, FormGroup, Label, ErrorMessage, CharacterCount, TextInputMask

### Step 11a — Add Batch G Zod schemas to `catalog.ts`

- [ ] Append to `packages/uswds/src/catalog.ts`:

  ```typescript
  ComboBox: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      options: z.array(
        z.object({ value: z.string(), label: z.string() })
      ).describe("List of selectable options"),
      defaultValue: z.string().optional(),
      disabled: z.boolean().optional(),
      assistiveHint: z.string().optional(),
      noResults: z.string().optional().describe("Message shown when no options match input"),
      onChange: z.string().nullish().describe("Action binding name — called with selected value string or null"),
    }),
    description: "USWDS combo box — filterable select with keyboard navigation.",
    example: {
      id: "fruit",
      name: "fruit",
      options: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
      ],
    },
  },

  DatePicker: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      validationStatus: z.enum(["error", "success"]).optional(),
      disabled: z.boolean().optional(),
      required: z.boolean().optional(),
      defaultValue: z.string().optional().describe("ISO date string YYYY-MM-DD"),
      minDate: z.string().optional().describe("Earliest selectable date, YYYY-MM-DD"),
      maxDate: z.string().optional().describe("Latest selectable date, YYYY-MM-DD"),
      label: z.string().optional().describe("Accessible label rendered above the field"),
    }),
    description: "USWDS date picker with calendar popover.",
    example: { id: "appt-date", name: "apptDate", label: "Appointment date" },
  },

  DateRangePicker: {
    props: z.object({
      startDateId: z.string(),
      startDateName: z.string(),
      endDateId: z.string(),
      endDateName: z.string(),
      startDateLabel: z.string().optional(),
      endDateLabel: z.string().optional(),
      minDate: z.string().optional().describe("ISO date string YYYY-MM-DD"),
      maxDate: z.string().optional().describe("ISO date string YYYY-MM-DD"),
    }),
    description: "USWDS date range picker — two linked date pickers for start and end dates.",
    example: {
      startDateId: "start",
      startDateName: "startDate",
      endDateId: "end",
      endDateName: "endDate",
      startDateLabel: "Start date",
      endDateLabel: "End date",
    },
  },

  FileInput: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      multiple: z.boolean().optional().describe("Allow multiple file selection"),
      accept: z.string().optional().describe("Accepted MIME types or extensions, e.g. '.pdf,.docx'"),
      disabled: z.boolean().optional(),
      dragText: z.string().optional().describe("Text shown in drag target (default 'Drag file here or')"),
      chooseText: z.string().optional().describe("Text for the choose-file button"),
      label: z.string().optional(),
    }),
    description: "USWDS file input with drag-and-drop support.",
    example: { id: "doc-upload", name: "docUpload", accept: ".pdf,.docx", label: "Upload supporting documents" },
  },

  RangeInput: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      defaultValue: z.number().optional(),
      disabled: z.boolean().optional(),
      label: z.string().optional(),
    }),
    description: "USWDS range input (slider).",
    example: { id: "satisfaction", name: "satisfaction", min: 1, max: 10, step: 1, label: "Satisfaction (1–10)" },
  },

  TimePicker: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      defaultValue: z.string().optional().describe("Default time string HH:MM"),
      minTime: z.string().optional().describe("Earliest selectable time HH:MM"),
      maxTime: z.string().optional().describe("Latest selectable time HH:MM"),
      step: z.number().optional().describe("Minute increment between options (default 30)"),
      disabled: z.boolean().optional(),
      label: z.string().optional(),
    }),
    description: "USWDS time picker dropdown.",
    example: { id: "appt-time", name: "apptTime", label: "Appointment time", minTime: "09:00", maxTime: "17:00" },
  },

  FormGroup: {
    props: z.object({
      error: z.boolean().optional().describe("Applies error styling to the group"),
      className: z.string().optional(),
    }),
    description: "USWDS form group wrapper — groups a label, input, and optional error message with consistent spacing.",
    example: { error: false },
  },

  Label: {
    props: z.object({
      htmlFor: z.string().describe("id of the associated form control"),
      text: z.string().describe("Label text content"),
      hint: z.string().optional().describe("Hint text shown below the label"),
      error: z.boolean().optional().describe("Applies error styling to the label"),
      className: z.string().optional(),
    }),
    description: "USWDS form label.",
    example: { htmlFor: "first-name", text: "First name", hint: "As it appears on your ID" },
  },

  ErrorMessage: {
    props: z.object({
      text: z.string().describe("Error message text"),
      id: z.string().optional().describe("id for aria-describedby association"),
    }),
    description: "USWDS inline form error message.",
    example: { text: "Enter a valid date of birth.", id: "dob-error" },
  },

  CharacterCount: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      maxLength: z.number().int().positive().describe("Maximum number of characters allowed"),
      isTextArea: z.boolean().optional().describe("Renders a textarea instead of an input"),
      defaultValue: z.string().optional(),
      label: z.string().optional().describe("Accessible label text rendered with the field"),
    }),
    description: "USWDS character count — input or textarea with live remaining-character count.",
    example: { id: "comments", name: "comments", maxLength: 150, isTextArea: true, label: "Additional comments" },
  },

  TextInputMask: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      mask: z.string().describe("Input mask pattern string, e.g. '___ - __ - ____' for SSN"),
      label: z.string().describe("Accessible label text"),
      type: z.enum(["text", "tel", "email", "number", "search", "url"]).optional(),
      defaultValue: z.string().optional(),
      disabled: z.boolean().optional(),
    }),
    description: "USWDS text input with a display mask (e.g. SSN, phone number).",
    example: { id: "ssn", name: "ssn", mask: "___ - __ - ____", label: "Social Security Number" },
  },
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/catalog.ts
  git commit -m "feat(uswds): add Batch G catalog schemas (ComboBox, DatePicker, DateRangePicker, FileInput, RangeInput, TimePicker, FormGroup, Label, ErrorMessage, CharacterCount, TextInputMask)"
  ```

---

### Step 11b — Add Batch G adapters to `components.tsx`

- [ ] Append to `packages/uswds/src/components.tsx`:

  ```tsx
  // ─── Batch G ──────────────────────────────────────────────────────────────

  ComboBox: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { onChange, ...merged } = { ...envelopeProps, ...rest }
    const handleChange = (val?: string) => {
      if (onChange && emit) emit(onChange, val)
    }
    return <TrussComboBox {...merged} onChange={handleChange} />
  },

  DatePicker: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label, ...merged } = { ...envelopeProps, ...rest }
    return (
      <div>
        {label && <TrussLabel htmlFor={merged.id}>{label}</TrussLabel>}
        <TrussDatePicker {...merged} />
      </div>
    )
  },

  DateRangePicker: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const {
      startDateId,
      startDateName,
      endDateId,
      endDateName,
      startDateLabel,
      endDateLabel,
      minDate,
      maxDate,
    } = { ...envelopeProps, ...rest }
    return (
      <TrussDateRangePicker
        startDatePickerProps={{ id: startDateId, name: startDateName, minDate, maxDate }}
        endDatePickerProps={{ id: endDateId, name: endDateName, minDate, maxDate }}
        startDateLabel={startDateLabel}
        endDateLabel={endDateLabel}
      />
    )
  },

  FileInput: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label, ...merged } = { ...envelopeProps, ...rest }
    return (
      <div>
        {label && <TrussLabel htmlFor={merged.id}>{label}</TrussLabel>}
        <TrussFileInput {...merged} />
      </div>
    )
  },

  RangeInput: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label, ...merged } = { ...envelopeProps, ...rest }
    return (
      <div>
        {label && <TrussLabel htmlFor={merged.id}>{label}</TrussLabel>}
        <TrussRangeInput {...merged} />
      </div>
    )
  },

  TimePicker: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label, ...merged } = { ...envelopeProps, ...rest }
    return (
      <div>
        {label && <TrussLabel htmlFor={merged.id}>{label}</TrussLabel>}
        <TrussTimePicker {...merged} />
      </div>
    )
  },

  FormGroup: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { error, className, ...merged } = { ...envelopeProps, ...rest }
    return (
      <TrussFormGroup error={error} className={className}>
        {children}
      </TrussFormGroup>
    )
  },

  Label: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { text, hint, htmlFor, error, className } = { ...envelopeProps, ...rest }
    return (
      <TrussLabel htmlFor={htmlFor} hint={hint} error={error} className={className}>
        {text ?? children}
      </TrussLabel>
    )
  },

  ErrorMessage: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { text, id } = { ...envelopeProps, ...rest }
    return <TrussErrorMessage id={id}>{text ?? children}</TrussErrorMessage>
  },

  CharacterCount: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label, ...merged } = { ...envelopeProps, ...rest }
    return (
      <TrussCharacterCount
        {...merged}
        label={label ?? ""}
      />
    )
  },

  TextInputMask: ({ props, emit, children, ...rest }: any) => {
    const envelopeProps = props ?? {}
    const { label, ...merged } = { ...envelopeProps, ...rest }
    return (
      <TrussTextInputMask
        {...merged}
        label={label}
      />
    )
  },
  ```

- [ ] Add imports for Batch G Truss components:
  ```tsx
  import {
    // … existing imports …
    ComboBox as TrussComboBox,
    DatePicker as TrussDatePicker,
    DateRangePicker as TrussDateRangePicker,
    FileInput as TrussFileInput,
    RangeInput as TrussRangeInput,
    TimePicker as TrussTimePicker,
    FormGroup as TrussFormGroup,
    Label as TrussLabel,
    ErrorMessage as TrussErrorMessage,
    CharacterCount as TrussCharacterCount,
    TextInputMask as TrussTextInputMask,
  } from "@trussworks/react-uswds"
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/src/components.tsx
  git commit -m "feat(uswds): add Batch G adapters (ComboBox, DatePicker, DateRangePicker, FileInput, RangeInput, TimePicker, FormGroup, Label, ErrorMessage, CharacterCount, TextInputMask)"
  ```

---

### Step 11c — Smoke-test Batch G

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -20
  ```
- [ ] Fix any import or render errors before proceeding.
- [ ] Note: `ComboBox`, `DatePicker`, `DateRangePicker`, and `TimePicker` from Truss may require USWDS JS initialisation for interactive behaviour. In Vitest (jsdom), they should render without error but may not be fully interactive. Assert no-throw in tests; do not assert open/close behaviour.

---

## Task 12 — Update `envelope.test.tsx` (FIXTURES map)

### Step 12a — Rewrite `tests/envelope.test.tsx`

- [ ] Replace the entire contents of `packages/uswds/tests/envelope.test.tsx` with:

  ```tsx
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

  import React from "react"
  import { describe, it, expect, vi } from "vitest"
  import { render, screen } from "@testing-library/react"
  import { uswdsComponents } from "../src/components"
  import { uswdsComponentDefinitions } from "../src/catalog"

  type Fixture = {
    children?: React.ReactNode
    assert: (() => void) | "no-throw"
  }

  type ComponentName = keyof typeof uswdsComponentDefinitions

  const emit = vi.fn()

  const FIXTURES: Record<ComponentName, Fixture> = {
    // ─── Batch A ────────────────────────────────────────────────────────────

    Button: {
      assert() {
        expect(screen.getByRole("button", { name: /submit/i })).toBeTruthy()
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
        expect(screen.getByText(/lorem ipsum/i)).toBeTruthy()
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
        expect(screen.getByText(/new/i)).toBeTruthy()
      },
    },

    // ─── Batch B ────────────────────────────────────────────────────────────

    Card: {
      assert() {
        expect(screen.getByText(/card heading/i)).toBeTruthy()
      },
    },

    CardGroup: {
      children: (
        <div className="usa-card__container">
          <div className="usa-card__header">
            <h2 className="usa-card__heading">Card A</h2>
          </div>
        </div>
      ),
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
        expect(screen.getByText(/eligibility requirements/i)).toBeTruthy()
      },
    },

    Tag: {
      assert() {
        expect(screen.getByText(/active/i)).toBeTruthy()
      },
    },

    // ─── Batch C ────────────────────────────────────────────────────────────

    TextInput: {
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

    RadioButton: {
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

    ModalToggleButton: {
      assert() {
        expect(screen.getByRole("button")).toBeTruthy()
      },
    },

    // ─── Batch D ────────────────────────────────────────────────────────────

    Tooltip: {
      children: <button type="button">Hover me</button>,
      assert: "no-throw",
    },

    DateInput: {
      assert: "no-throw",
    },

    DateInputGroup: {
      children: <div />,
      assert: "no-throw",
    },

    Fieldset: {
      children: <legend>Group</legend>,
      assert: "no-throw",
    },

    Form: {
      children: <input type="text" />,
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
        expect(screen.getByRole("navigation")).toBeTruthy()
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
        expect(screen.getByText(/submit your application/i)).toBeTruthy()
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
        expect(screen.getByText(/español/i)).toBeTruthy()
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
      assert() {
        expect(screen.getByRole("combobox")).toBeTruthy()
      },
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
        expect(screen.getByText(/enter a valid date/i)).toBeTruthy()
      },
    },

    CharacterCount: {
      assert: "no-throw",
    },

    TextInputMask: {
      assert: "no-throw",
    },
  }

  describe("envelope passthrough — all components", () => {
    const names = Object.keys(uswdsComponentDefinitions) as ComponentName[]

    it.each(names)("%s renders via envelope shape without throwing", (name) => {
      const Component = uswdsComponents[name]
      expect(Component, `uswdsComponents["${name}"] is missing`).toBeDefined()

      const fixture = FIXTURES[name]
      expect(fixture, `FIXTURES["${name}"] is missing — add an entry`).toBeDefined()

      const example = uswdsComponentDefinitions[name].example

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
  })
  ```

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/envelope.test.tsx 2>&1
  ```
  Expected: all tests pass (one per component). Any failure = missing adapter, missing catalog entry, or fixture mismatch.

- [ ] Fix failures:
  - Missing `FIXTURES` entry → add it.
  - `uswdsComponents[name]` undefined → check adapter was added in Batches A–G.
  - Text assertion fails → update `assert` to match actual rendered text from `example`.

- [ ] Run full suite:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -30
  ```

- [ ] Commit:
  ```bash
  git add packages/uswds/tests/envelope.test.tsx
  git commit -m "test(uswds): rewrite envelope.test.tsx — all migrated components + Batch E–G fixtures"
  ```

## Task 13 — Delete dropped test files + confirm migrated test suite

### 13a — Delete test files for dropped components

These 16 files test components that have no Truss equivalent and were removed from the catalog in Tasks 1–2. Delete them:

- [ ] Delete the following files:
  ```
  packages/uswds/tests/components/avatar.test.tsx
  packages/uswds/tests/components/carousel.test.tsx
  packages/uswds/tests/components/collapsible.test.tsx
  packages/uswds/tests/components/drawer.test.tsx
  packages/uswds/tests/components/dropdown-menu.test.tsx
  packages/uswds/tests/components/image.test.tsx
  packages/uswds/tests/components/popover.test.tsx
  packages/uswds/tests/components/progress.test.tsx
  packages/uswds/tests/components/separator.test.tsx
  packages/uswds/tests/components/skeleton.test.tsx
  packages/uswds/tests/components/slider.test.tsx
  packages/uswds/tests/components/spinner.test.tsx
  packages/uswds/tests/components/stack.test.tsx
  packages/uswds/tests/components/switch.test.tsx
  packages/uswds/tests/components/toggle.test.tsx
  packages/uswds/tests/components/toggle-group.test.tsx
  ```
  ```bash
  git rm \
    packages/uswds/tests/components/avatar.test.tsx \
    packages/uswds/tests/components/carousel.test.tsx \
    packages/uswds/tests/components/collapsible.test.tsx \
    packages/uswds/tests/components/drawer.test.tsx \
    packages/uswds/tests/components/dropdown-menu.test.tsx \
    packages/uswds/tests/components/image.test.tsx \
    packages/uswds/tests/components/popover.test.tsx \
    packages/uswds/tests/components/progress.test.tsx \
    packages/uswds/tests/components/separator.test.tsx \
    packages/uswds/tests/components/skeleton.test.tsx \
    packages/uswds/tests/components/slider.test.tsx \
    packages/uswds/tests/components/spinner.test.tsx \
    packages/uswds/tests/components/stack.test.tsx \
    packages/uswds/tests/components/switch.test.tsx \
    packages/uswds/tests/components/toggle.test.tsx \
    packages/uswds/tests/components/toggle-group.test.tsx
  ```

### 13b — Confirm migrated component tests pass (Batches A–D)

All rewrites happened inline during Tasks 4–7. This step runs the full rewritten suite to confirm correctness.

Rewritten files (for reference — do not rewrite again):
- **Batch A** (Tasks 3–4): `button.test.tsx`, `button-group.test.tsx`, `alert.test.tsx`, `badge.test.tsx`, `link.test.tsx`
- **Batch B** (Task 5): `card.test.tsx`, `heading.test.tsx`, `text.test.tsx`, `accordion.test.tsx`, `table.test.tsx`
- **Batch C** (Task 6): `input.test.tsx`, `textarea.test.tsx`, `select.test.tsx`, `checkbox.test.tsx`, `radio.test.tsx`
- **Batch D** (Task 7): `dialog.test.tsx`, `pagination.test.tsx`, `tooltip.test.tsx`, `grid.test.tsx`

Each rewritten test asserts Truss rendered output (`<button class="usa-button">`, `<div class="usa-alert">`, etc.) rather than the old CVA class API.

- [ ] Run the full component test suite:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -40
  ```
  Expected: all Batch A–D tests pass. No test should reference a CVA variant or a class like `bg-primary` / `text-sm` from the old CVA system.

- [ ] If any Batch A–D test fails, the likely cause is:
  - Test still queries by old CVA class (`bg-primary-dark`, `rounded-full`, etc.) → update assertion to query Truss class (`usa-button--secondary`, `usa-alert--error`, etc.)
  - Truss component renders a wrapper element the test did not expect → adjust `getByRole` or `container.querySelector` target
  - Missing `uswds.css` import in test setup → add to `packages/uswds/tests/setup.ts`

- [ ] Commit after all Batch A–D tests pass:
  ```bash
  git add packages/uswds/tests/components/
  git commit -m "test(uswds): delete dropped-component tests, confirm Batch A-D migrated tests pass"
  ```

---

## Task 14 — Add new component test files (Batches E–G)

Create test files for all new Truss components added in Tasks 9–11. Every test follows the same pattern: render via the catalog `example` prop (plain React prop path, not envelope), assert no throw, assert no a11y violations with axe, and for observable components assert one key DOM element.

**Note:** `TextInputMask` test is intentionally omitted — mask initialization breaks in jsdom. If a smoke test is desired, add a single "no-throw" assertion with no axe call.

### Pattern (all 27 files are structurally identical — swap names and assertions)

```tsx
import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"
import { ComponentName } from "../../src/ui/component-name"
import { uswdsComponentDefinitions } from "../../src/catalog"

const example = uswdsComponentDefinitions.ComponentName.example as React.ComponentProps<typeof ComponentName>

describe("ComponentName", () => {
  it("renders without throwing", () => {
    const { container } = render(<ComponentName {...example} />)
    expect(container).toBeTruthy()
  })

  it("has no a11y violations", async () => {
    const { container } = render(<ComponentName {...example} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("renders key DOM element", () => {
    const { container } = render(<ComponentName {...example} />)
    expect(container.querySelector(".usa-component-class")).toBeTruthy()
  })
})
```

### 14a — `packages/uswds/tests/components/icon.test.tsx` (complete)

- [ ] Create file:
  ```tsx
  import { render } from "@testing-library/react"
  import { axe } from "jest-axe"
  import { describe, expect, it } from "vitest"
  import { Icon } from "../../src/ui/icon"
  import { uswdsComponentDefinitions } from "../../src/catalog"

  const example = uswdsComponentDefinitions.Icon.example as React.ComponentProps<typeof Icon>

  describe("Icon", () => {
    it("renders without throwing", () => {
      const { container } = render(<Icon {...example} />)
      expect(container).toBeTruthy()
    })

    it("has no a11y violations", async () => {
      const { container } = render(<Icon {...example} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("renders an svg element", () => {
      const { container } = render(<Icon {...example} />)
      expect(container.querySelector("svg")).toBeTruthy()
    })
  })
  ```

### 14b — `packages/uswds/tests/components/site-alert.test.tsx` (complete)

- [ ] Create file:
  ```tsx
  import { render } from "@testing-library/react"
  import { axe } from "jest-axe"
  import { describe, expect, it } from "vitest"
  import { SiteAlert } from "../../src/ui/site-alert"
  import { uswdsComponentDefinitions } from "../../src/catalog"

  const example = uswdsComponentDefinitions.SiteAlert.example as React.ComponentProps<typeof SiteAlert>

  describe("SiteAlert", () => {
    it("renders without throwing", () => {
      const { container } = render(<SiteAlert {...example} />)
      expect(container).toBeTruthy()
    })

    it("has no a11y violations", async () => {
      const { container } = render(<SiteAlert {...example} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("renders usa-site-alert element", () => {
      const { container } = render(<SiteAlert {...example} />)
      expect(container.querySelector(".usa-site-alert")).toBeTruthy()
    })
  })
  ```

### 14c — `packages/uswds/tests/components/breadcrumb.test.tsx` (complete)

- [ ] Create file:
  ```tsx
  import { render } from "@testing-library/react"
  import { axe } from "jest-axe"
  import { describe, expect, it } from "vitest"
  import { Breadcrumb } from "../../src/ui/breadcrumb"
  import { uswdsComponentDefinitions } from "../../src/catalog"

  const example = uswdsComponentDefinitions.Breadcrumb.example as React.ComponentProps<typeof Breadcrumb>

  describe("Breadcrumb", () => {
    it("renders without throwing", () => {
      const { container } = render(<Breadcrumb {...example} />)
      expect(container).toBeTruthy()
    })

    it("has no a11y violations", async () => {
      const { container } = render(<Breadcrumb {...example} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("renders usa-breadcrumb nav", () => {
      const { container } = render(<Breadcrumb {...example} />)
      expect(container.querySelector("nav.usa-breadcrumb")).toBeTruthy()
    })
  })
  ```

### 14d — `packages/uswds/tests/components/step-indicator.test.tsx` (complete)

- [ ] Create file:
  ```tsx
  import { render } from "@testing-library/react"
  import { axe } from "jest-axe"
  import { describe, expect, it } from "vitest"
  import { StepIndicator } from "../../src/ui/step-indicator"
  import { uswdsComponentDefinitions } from "../../src/catalog"

  const example = uswdsComponentDefinitions.StepIndicator.example as React.ComponentProps<typeof StepIndicator>

  describe("StepIndicator", () => {
    it("renders without throwing", () => {
      const { container } = render(<StepIndicator {...example} />)
      expect(container).toBeTruthy()
    })

    it("has no a11y violations", async () => {
      const { container } = render(<StepIndicator {...example} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it("renders usa-step-indicator element", () => {
      const { container } = render(<StepIndicator {...example} />)
      expect(container.querySelector(".usa-step-indicator")).toBeTruthy()
    })
  })
  ```

### 14e–14aa — Remaining 23 test files

Apply the identical pattern from 14a–14d. For each entry below, create the file, swap `ComponentName` / import path / CSS selector, and the three test blocks are complete:

| File | Component | Import path | Key CSS selector |
|---|---|---|---|
| `sidenav.test.tsx` | `SideNav` | `../../src/ui/sidenav` | `.usa-sidenav` |
| `in-page-navigation.test.tsx` | `InPageNavigation` | `../../src/ui/in-page-navigation` | `.usa-in-page-nav` |
| `process-list.test.tsx` | `ProcessList` | `../../src/ui/process-list` | `.usa-process-list` |
| `summary-box.test.tsx` | `SummaryBox` | `../../src/ui/summary-box` | `.usa-summary-box` |
| `search.test.tsx` | `Search` | `../../src/ui/search` | `[role="search"]` |
| `collection.test.tsx` | `Collection` | `../../src/ui/collection` | `.usa-collection` |
| `banner.test.tsx` | `Banner` | `../../src/ui/banner` | `.usa-banner` |
| `identifier.test.tsx` | `Identifier` | `../../src/ui/identifier` | `.usa-identifier` |
| `header.test.tsx` | `Header` | `../../src/ui/header` | `.usa-header` |
| `footer.test.tsx` | `Footer` | `../../src/ui/footer` | `.usa-footer` |
| `language-selector.test.tsx` | `LanguageSelector` | `../../src/ui/language-selector` | `.usa-language-container` |
| `icon-list.test.tsx` | `IconList` | `../../src/ui/icon-list` | `.usa-icon-list` |
| `media-block.test.tsx` | `MediaBlock` | `../../src/ui/media-block` | `.usa-media-block` |
| `combobox.test.tsx` | `ComboBox` | `../../src/ui/combobox` | `.usa-combo-box` |
| `date-picker.test.tsx` | `DatePicker` | `../../src/ui/date-picker` | `.usa-date-picker` |
| `date-range-picker.test.tsx` | `DateRangePicker` | `../../src/ui/date-range-picker` | `.usa-date-range-picker` |
| `file-input.test.tsx` | `FileInput` | `../../src/ui/file-input` | `.usa-file-input` |
| `range-input.test.tsx` | `RangeInput` | `../../src/ui/range-input` | `input[type="range"]` |
| `time-picker.test.tsx` | `TimePicker` | `../../src/ui/time-picker` | `.usa-time-picker` |
| `form-group.test.tsx` | `FormGroup` | `../../src/ui/form-group` | `.usa-form-group` |
| `label.test.tsx` | `Label` | `../../src/ui/label` | `.usa-label` |
| `error-message.test.tsx` | `ErrorMessage` | `../../src/ui/error-message` | `.usa-error-message` |
| `character-count.test.tsx` | `CharacterCount` | `../../src/ui/character-count` | `.usa-character-count` |

- [ ] Create all 23 files following the pattern. Each file is ~30 lines.

- [ ] Run the new tests in isolation to confirm no import errors before the full suite:
  ```bash
  pnpm --filter @oddball/json-render-uswds test tests/components/icon.test.tsx tests/components/site-alert.test.tsx tests/components/breadcrumb.test.tsx tests/components/step-indicator.test.tsx 2>&1
  ```
  Then run remaining new files in batches of 5–6.

- [ ] Commit:
  ```bash
  git add packages/uswds/tests/components/
  git commit -m "test(uswds): add 27 new component tests for Truss Batch E-G components"
  ```

---

## Task 15 — Update playground + demo apps

### 15a — Remove `@source` directive from playground globals

- [ ] Edit `examples/uswds-playground/app/globals.css`. Remove:
  ```css
  @source "../node_modules/@oddball/json-render-uswds/dist/**/*.{js,mjs}";
  ```
  Truss components ship USWDS classes in a pre-built stylesheet; Tailwind scanning of dist output is no longer needed for styling.

### 15b — Add Truss CSS import to playground layout

- [ ] Edit `examples/uswds-playground/app/layout.tsx`. At the very top, before the Tailwind/global CSS import:
  ```typescript
  import '@trussworks/react-uswds/lib/uswds.css'
  ```
  This injects the full USWDS stylesheet. It must load before `globals.css` so Tailwind utility overrides take precedence.

### 15c — Rewrite `suggestion-chips.tsx`

- [ ] Edit `examples/uswds-playground/components/suggestion-chips.tsx`.

  **Before:**
  ```tsx
  <UswdsButton variant="outline" size="sm" className="..." onClick={() => onSelect(s)}>
    {s}
  </UswdsButton>
  ```

  **After:**
  ```tsx
  <UswdsButton type="button" outline className="..." onClick={() => onSelect(s)}>
    {s}
  </UswdsButton>
  ```

  Truss `Button` uses a boolean `outline` prop rather than `variant="outline"`. Truss has no `size="sm"` — only `size="big"`. Remove the `size` prop entirely for default (normal) size.

### 15d — Rewrite `oddball-banner.tsx`

- [ ] Edit `examples/uswds-playground/components/oddball-banner.tsx`.

  **UswdsText before:**
  ```tsx
  <UswdsText as="span" size="sm" color="muted" text="An" />
  ```
  **UswdsText after:**
  ```tsx
  <UswdsText as="span" size="sm" className="!text-base-dark" text="An" />
  ```
  Drop the `color` prop (removed in migration). Move the muted color intent to a Tailwind utility class via `className`.

  **UswdsLink before:**
  ```tsx
  <UswdsLink external label="Oddball Labs" href="https://oddball.io" className="..." />
  ```
  **UswdsLink after:**
  ```tsx
  <UswdsLink href="https://oddball.io" variant="external" className="...">
    Oddball Labs
  </UswdsLink>
  ```
  Truss `Link` uses `variant="external"` instead of a boolean `external` prop. Content moves from `label` prop to React children.

### 15e — Rewrite `spec-viewer.tsx`

The current file imports `Tabs` from `@oddball/json-render-uswds`, which no longer exports Tabs. Replace with a plain state toggle.

- [ ] Replace the full contents of `examples/uswds-playground/components/spec-viewer.tsx` with:

  ```tsx
  "use client"
  import { useState } from "react"
  import type { Spec } from "@json-render/react"
  import { PlaygroundRenderer } from "@/lib/render/renderer"

  interface SpecViewerProps {
    spec: Spec | null
    loading?: boolean
  }

  export function SpecViewer({ spec, loading }: SpecViewerProps) {
    const [tab, setTab] = useState<"preview" | "code">("preview")

    if (!spec) return null

    return (
      <div className="overflow-hidden rounded-lg border-2 border-base-light bg-gray-1 font-sans text-ink shadow-sm">
        <div className="flex w-full border-b-2 border-base-light bg-base-lightest px-2">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "px-4 py-2 text-sm font-medium capitalize",
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-base-dark hover:text-ink",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "preview" ? (
          <div className="p-4">
            <PlaygroundRenderer spec={spec} loading={loading} />
          </div>
        ) : (
          <pre className="max-h-[min(70vh,32rem)] overflow-x-auto overflow-y-auto border-t-0 bg-base-lightest p-4 font-mono text-xs leading-relaxed text-primary-darker">
            <code>{JSON.stringify(spec, null, 2)}</code>
          </pre>
        )}
      </div>
    )
  }
  ```

  Key changes from old version:
  - Removes `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@oddball/json-render-uswds"` (Tabs component dropped)
  - `useState<"preview" | "code">` drives tab selection
  - Tab buttons are plain `<button>` elements with Tailwind active/inactive classes
  - Otherwise structurally identical — same `PlaygroundRenderer` usage, same layout classes

### 15f — Update `examples/uswds-playground/app/page.tsx`

The file is ~330 lines. Apply three targeted diffs — do not rewrite the whole file.

#### Diff 1 — Ghost button → unstyled

**Before:**
```tsx
<UswdsButton variant="ghost" onClick={handleClear} ...>
  Clear
</UswdsButton>
```
**After:**
```tsx
<UswdsButton unstyled onClick={handleClear} ...>
  Clear
</UswdsButton>
```
Truss `Button` has no `variant="ghost"`. The closest equivalent is `unstyled` (boolean prop).

#### Diff 2 — Textarea missing required props

**Before:**
```tsx
<UswdsTextarea
  placeholder="Describe what you need..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  ...
/>
```
**After:**
```tsx
<UswdsTextarea
  id="message"
  name="message"
  placeholder="Describe what you need..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  ...
/>
```
Truss `Textarea` requires `id` and `name` (used for label association). Add both with value `"message"`.

#### Diff 3 — UswdsText drop `weight` / `color` props

**Before:**
```tsx
<UswdsText weight="bold" color="primary" text="Ask a question..." />
```
**After:**
```tsx
<UswdsText className="font-bold text-primary" text="Ask a question..." />
```
`weight` and `color` props removed from Text in migration. Move intent to Tailwind utility classes via `className`.

- [ ] Apply all three diffs. Run `pnpm --filter uswds-playground typecheck` after to confirm no residual prop errors.

### 15g — Update `examples/uswds-demo/src/styles.css`

- [ ] Remove `@source` directive (same reason as 15a — Truss stylesheet replaces class-scanning):
  ```css
  /* REMOVE: */
  @source "../node_modules/@oddball/json-render-uswds/dist/**/*.{js,mjs}";
  ```

- [ ] Add Truss CSS import at the top of `styles.css` (before `@import "tailwindcss"`):
  ```css
  @import '@trussworks/react-uswds/lib/uswds.css';
  ```

### 15h — Audit and clean `examples/uswds-demo/src/specs/*.json`

- [ ] Find affected spec files:
  ```bash
  grep -rl "Stack\|Grid\|Carousel\|Collapsible\|Drawer\|DropdownMenu\|Popover\|Progress\|Skeleton\|Spinner\|Slider\|Toggle\|Switch\|Avatar\|Image\|Separator\|Tabs" examples/uswds-demo/src/specs/
  ```

- [ ] For each file returned by the grep:
  1. Identify every `elements` entry whose `type` matches a dropped component name.
  2. Remove that entry from the `elements` record.
  3. Remove the matching key from any `children` array that references it (scan all sibling elements for references).
  4. If removing an element leaves a container's `children` array empty, either remove the container too or replace with a surviving equivalent component.

  No replacement is required — clean deletion is sufficient. The spec files are only used by the demo; removing unsupported elements means those demo presets render without error instead of crashing.

- [ ] Run the demo locally to verify presets load without console errors:
  ```bash
  pnpm --filter uswds-demo dev
  ```
  Open `localhost:5173` and cycle through each preset in the left panel.

- [ ] Commit playground + demo changes:
  ```bash
  git add examples/uswds-playground/ examples/uswds-demo/
  git commit -m "feat(apps): update playground + demo for Truss migration — remove @source, add uswds.css, fix dropped props + components"
  ```

---

## Task 16 — Final build, typecheck, and full test run

### 16a — Install (lockfile sync)

- [ ] From repo root:
  ```bash
  pnpm install
  ```
  Expected: lockfile updates to reflect `@trussworks/react-uswds` as a dependency and removal of old CVA/shadcn deps. No errors.

### 16b — Build the package

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds build 2>&1
  ```
  Expected indicators of success:
  - `dist/index.js` (CJS) written
  - `dist/index.mjs` (ESM) written
  - `dist/index.d.ts` (types) written
  - `dist/tokens.js`, `dist/tokens.css` written (subpath exports)
  - No TypeScript errors in tsup output
  - Build time under 30s

  If build fails: most likely cause = a new Truss component file has a TypeScript error. Run `pnpm --filter @oddball/json-render-uswds typecheck` to get the exact error location.

### 16c — Typecheck

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds typecheck 2>&1
  ```
  Expected: `0 errors`. Any errors at this stage are either:
  - Wrong Truss prop type (e.g., passing `string` where Truss expects a union) → check `@trussworks/react-uswds` types for the correct prop signature
  - Missing `uswdsComponentDefinitions` entry that `catalog.test.ts` will also catch → add to catalog

- [ ] Run typecheck on both example apps:
  ```bash
  pnpm --filter uswds-demo typecheck 2>&1
  pnpm --filter uswds-playground typecheck 2>&1
  ```
  Fix any residual prop errors flagged from Task 15 changes (removed `color`, `weight`, `variant`, `size` props, etc.).

### 16d — Full test run

- [ ] Run:
  ```bash
  pnpm --filter @oddball/json-render-uswds test 2>&1 | tail -50
  ```
  Expected test counts:
  - Per-component smoke tests: 19 surviving migrated components x ~3 tests = ~57
  - New Truss component tests (Task 14): 27 files x 3 tests = ~81
  - `catalog.test.ts` contract tests: ~10
  - `envelope.test.tsx` passthrough tests: 1 per component (all ~46 components) = ~46
  - **Total expected: ~194+ tests, all passing**

  If tests fail:
  - `catalog.test.ts` key mismatch → component in `uswdsComponentDefinitions` but not `uswdsComponents` or vice versa
  - `catalog.test.ts` shadcn parity failure → a shadcn component key is not present in our catalog; either add the component or update the parity exclusion list
  - `envelope.test.tsx` failure → adapter missing `envelopeProps` merge (see Task 12 setup)
  - Individual component test failure → Truss renders different DOM structure than assertion expects; update the CSS selector

- [ ] Run workspace-wide test (optional, confirms no regressions in demo/playground):
  ```bash
  pnpm -r test 2>&1 | tail -30
  ```

### 16e — Smoke-test demo app

- [ ] Start dev server:
  ```bash
  pnpm --filter uswds-demo dev
  ```
  Navigate to `localhost:5173`. Verify:
  - Page loads without white-screen
  - All preset JSON specs render USWDS-styled output (not unstyled HTML)
  - No console errors about unknown component types or missing registry entries
  - CodeMirror editor accepts edits and re-renders live

### 16f — Smoke-test playground app

- [ ] Ensure `.env.local` exists in `examples/uswds-playground/` with at least one of:
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  OPENAI_API_KEY=sk-...
  ```
- [ ] Start dev server:
  ```bash
  pnpm --filter uswds-playground dev
  ```
  Navigate to `localhost:3000`. Verify:
  - Chat input renders
  - Sending a message triggers streaming response
  - Streamed spec renders as USWDS-styled components (not unstyled HTML)
  - Suggestion chips appear and are clickable
  - No console errors about missing Tabs, variant props, or unknown components

### 16g — Final commit

- [ ] Stage all remaining changes and create final commit:
  ```bash
  git add -A
  git status  # review — confirm no unintended files staged
  git commit -m "feat(uswds): complete Trussworks migration — 46 components, all tests passing"
  ```

  Commit message body (optional):
  ```
  - Replace all CVA/shadcn primitives with @trussworks/react-uswds components
  - Catalog: 16 dropped components, 27 new USWDS-native components added
  - Tests: 16 old test files deleted, 27 new files added, Batches A-D rewritten
  - Apps: playground + demo updated for Truss API (no @source, uswds.css import, prop fixes)
  - Envelope passthrough verified for all 46 catalog entries
  ```

---

## Plan Complete

| Metric | Value |
|---|---|
| Total tasks | 16 (Tasks 1–16) |
| Quarters | 4 (Q1: Tasks 1–4, Q2: Tasks 5–8, Q3: Tasks 9–12, Q4: Tasks 13–16) |
| Components migrated (CVA → Truss) | 19 |
| Components dropped (no Truss equivalent) | 16 |
| Components added (new Truss-native) | 27 |
| **Total catalog size after migration** | **46** |
| Test files deleted | 16 |
| Test files rewritten (Batches A–D) | 19 |
| Test files created (Batches E–G, Task 14) | 27 |
| **Expected final test count** | **~194+** |
| Apps updated | 2 (`uswds-demo`, `uswds-playground`) |

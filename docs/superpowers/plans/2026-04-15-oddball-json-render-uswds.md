# `@oddball/json-render-uswds` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a json-render component library package that mirrors `@json-render/shadcn`'s 36-component catalog but styles components with USWDS design tokens via the `uswds-tailwind` preset, published as `@oddball/json-render-uswds`.

**Architecture:** New pnpm workspace package at `json-render/packages/uswds/`, structurally identical to `packages/shadcn/`. Zod catalog (`uswdsComponentDefinitions`) + React component registry (`uswdsComponents`). Radix UI primitives handle interactive behavior; Tailwind classes resolved against `uswds-tailwind` tokens handle visuals. Contract tests enforce catalog↔component parity plus shadcn key-superset parity.

**Tech Stack:** React 19, TypeScript 5, Tailwind 4, Zod 4, Radix UI, Embla (Carousel), Vaul (Drawer), Lucide (icons), tsup, vitest, `@testing-library/react`, `jest-axe`, Storybook 8, pnpm workspaces.

**Reference package:** `json-render/packages/shadcn/` — an **untracked external checkout** at the repo root, present for reference only. Read its files when implementing each component (many patterns are identical), but do NOT modify, symlink, or depend on it as a workspace member.

**Spec:** `docs/superpowers/specs/2026-04-15-oddball-json-render-uswds-design.md`

---

## Environment Overrides (supersede anything in task bodies below)

1. **Package location:** `packages/uswds/` at the repo root (NOT `json-render/packages/uswds/`). Ignore any `json-render/packages/uswds/` path referenced later — use `packages/uswds/`.
2. **Workspace setup:** this repo has no existing package.json or workspace. Task 1 is expanded to include scaffolding: create a root `package.json` with `"packageManager": "pnpm@9.x"`, a `pnpm-workspace.yaml` listing `packages/*` and `examples/*`, and a root `.gitignore` containing `node_modules/`, `dist/`, `.turbo/`, `json-render/`.
3. **Dependencies:** replace every `"workspace:*"` reference in task bodies with published npm versions:
   - `@json-render/core`: `^0.17.0`
   - `@json-render/react`: `^0.17.0`
   - `@json-render/shadcn`: `^0.17.0` (devDependency, used only by the parity test)
4. **Drop:** `@internal/typescript-config` workspace dependency. Inline the tsconfig:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "Bundler",
       "jsx": "react-jsx",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "declaration": true,
       "outDir": "dist",
       "lib": ["ES2022", "DOM", "DOM.Iterable"]
     },
     "include": ["src"]
   }
   ```
5. **Example app location (Task F-3):** `examples/uswds-demo/` at the repo root (NOT inside `json-render/examples/`).
6. **Commit granularity:** one commit per completed task (per the plan's existing step 5 in each per-component task). Scope commit paths to `packages/uswds/...` plus any root-level scaffolding; NEVER `git add json-render/`.

---

## File Structure

```
json-render/packages/uswds/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── README.md
├── CHANGELOG.md
├── src/
│   ├── index.ts                     barrel; re-exports catalog + components
│   ├── catalog.ts                   uswdsComponentDefinitions (Zod)
│   ├── components.tsx               uswdsComponents registry
│   ├── lib/
│   │   ├── cn.ts                    clsx + tailwind-merge helper
│   │   └── tokens.ts                re-export of uswds-tailwind preset
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── ...                      (one file per visual primitive)
│       └── ...
└── tests/
    ├── catalog.test.ts              contract + parity tests
    └── components/
        ├── button.test.tsx
        └── ...
```

Each `src/ui/*.tsx` file owns one visual primitive (or a related family, matching shadcn's grouping — e.g., `card.tsx` exports `Card`, `CardHeader`, `CardTitle`, `CardContent`). `src/components.tsx` is the adapter layer that wraps primitives with json-render bindings (`useBoundProp`, `useStateBinding`, `useFieldValidation`).

---

## Foundation

### Task 1: Scaffold package skeleton

**Files:**
- Create: `json-render/packages/uswds/package.json`
- Create: `json-render/packages/uswds/tsconfig.json`
- Create: `json-render/packages/uswds/tsup.config.ts`
- Create: `json-render/packages/uswds/README.md`
- Create: `json-render/packages/uswds/CHANGELOG.md`
- Create: `json-render/packages/uswds/src/index.ts`
- Create: `json-render/packages/uswds/src/catalog.ts`
- Create: `json-render/packages/uswds/src/components.tsx`
- Create: `json-render/packages/uswds/src/lib/cn.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "@oddball/json-render-uswds",
  "version": "0.1.0",
  "license": "Apache-2.0",
  "description": "USWDS-styled component library for @json-render/core. JSON becomes federally-compliant Tailwind-styled React components.",
  "keywords": ["json", "ui", "react", "uswds", "tailwind", "radix", "ai", "generative-ui", "llm", "renderer", "components"],
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
    "test": "vitest run",
    "test:watch": "vitest",
    "check-types": "tsc --noEmit",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@json-render/core": "workspace:*",
    "@json-render/react": "workspace:*",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "lucide-react": "^0.564.0",
    "radix-ui": "^1.4.3",
    "tailwind-merge": "^3.4.1",
    "uswds-tailwind": "^0.1.0",
    "vaul": "^1.1.2"
  },
  "devDependencies": {
    "@internal/typescript-config": "workspace:*",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@types/react": "19.2.3",
    "jest-axe": "^9.0.0",
    "jsdom": "^25.0.0",
    "tsup": "^8.0.2",
    "typescript": "^5.4.5",
    "vitest": "^2.1.0",
    "zod": "^4.3.6"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "zod": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "@internal/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/catalog.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@json-render/core",
    "@json-render/react",
    "zod",
  ],
});
```

- [ ] **Step 4: Create `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Create empty placeholders**

`src/catalog.ts`:
```ts
import { z } from "zod";

export type ComponentDefinition = {
  props: z.ZodTypeAny;
  slots?: string[];
  description: string;
  example: unknown;
};

export const uswdsComponentDefinitions: Record<string, ComponentDefinition> = {};

export type UswdsProps = Record<string, unknown>;
```

`src/components.tsx`:
```tsx
"use client";

import type { ComponentType } from "react";

export const uswdsComponents: Record<string, ComponentType<any>> = {};
```

`src/index.ts`:
```ts
export { uswdsComponents } from "./components";
export {
  uswdsComponentDefinitions,
  type ComponentDefinition,
  type UswdsProps,
} from "./catalog";
```

- [ ] **Step 6: Install deps + verify build**

Run from repo root:
```bash
pnpm install
pnpm --filter @oddball/json-render-uswds build
```
Expected: tsup emits `dist/index.{js,mjs,d.ts}` and `dist/catalog.{js,mjs,d.ts}`.

- [ ] **Step 7: Commit**

```bash
git add json-render/packages/uswds
git commit -m "feat(uswds): scaffold empty package"
```

---

### Task 2: Tokens preset re-export

**Files:**
- Create: `json-render/packages/uswds/src/lib/tokens.ts`

- [ ] **Step 1: Create tokens re-export**

```ts
// Consumers do:
//   import uswdsPreset from "@oddball/json-render-uswds/tokens";
//   export default { presets: [uswdsPreset], ... };
import preset from "uswds-tailwind/tailwind-config";
export default preset;
```

- [ ] **Step 2: Add `/tokens` subpath export to `package.json`**

Add to `exports` block:
```json
"./tokens": {
  "types": "./dist/tokens.d.ts",
  "import": "./dist/tokens.mjs",
  "require": "./dist/tokens.js"
}
```

Add `"src/lib/tokens.ts"` to `tsup.config.ts` entry array.

- [ ] **Step 3: Build and verify**

```bash
pnpm --filter @oddball/json-render-uswds build
ls json-render/packages/uswds/dist/ | grep tokens
```
Expected: `tokens.js`, `tokens.mjs`, `tokens.d.ts` present.

- [ ] **Step 4: Commit**

```bash
git add json-render/packages/uswds
git commit -m "feat(uswds): expose uswds-tailwind preset at /tokens"
```

---

### Task 3: Vitest setup

**Files:**
- Create: `json-render/packages/uswds/vitest.config.ts`
- Create: `json-render/packages/uswds/tests/setup.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 2: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
```

- [ ] **Step 3: Verify vitest runs**

```bash
pnpm --filter @oddball/json-render-uswds test
```
Expected: "No test files found" (zero tests, exit 0).

- [ ] **Step 4: Commit**

```bash
git add json-render/packages/uswds
git commit -m "test(uswds): wire vitest + jest-axe setup"
```

---

### Task 4: Catalog contract tests

**Files:**
- Create: `json-render/packages/uswds/tests/catalog.test.ts`

- [ ] **Step 1: Write contract test**

```ts
import { describe, expect, it } from "vitest";
import { uswdsComponentDefinitions } from "../src/catalog";
import { uswdsComponents } from "../src/components";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";

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
          `Example for "${name}" failed schema validation: ${result.error.message}`,
        );
      }
    }
  });

  it("is a key-superset of @json-render/shadcn catalog", () => {
    const shadcnKeys = Object.keys(shadcnComponentDefinitions);
    const uswdsKeys = new Set(Object.keys(uswdsComponentDefinitions));
    const missing = shadcnKeys.filter((k) => !uswdsKeys.has(k));
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Add `@json-render/shadcn` as a devDependency**

In `json-render/packages/uswds/package.json`, add to `devDependencies`:
```json
"@json-render/shadcn": "workspace:*"
```
Then `pnpm install`.

- [ ] **Step 3: Run tests — expect all three to PASS (vacuously — empty catalog passes #1 and #2; #3 will FAIL)**

```bash
pnpm --filter @oddball/json-render-uswds test
```
Expected: tests #1 and #2 pass; #3 fails with a long missing list. This is the acceptance gate — components will fill this in.

- [ ] **Step 4: Mark the parity test as a todo-skip until components are added**

Wrap the third `it(...)` in `it.skip(...)` with a comment:
```ts
// Re-enable in Task 42 when all 36 components have landed.
it.skip("is a key-superset of @json-render/shadcn catalog", () => { ... });
```

- [ ] **Step 5: Re-run — all tests pass**

```bash
pnpm --filter @oddball/json-render-uswds test
```
Expected: 3 tests (1 skipped), exit 0.

- [ ] **Step 6: Commit**

```bash
git add json-render/packages/uswds
git commit -m "test(uswds): add catalog contract + parity tests"
```

---

## Component Tasks (per-component pattern)

Every component task follows the same five-step pattern. The template is given once here; each per-component task below specifies only the fields that change (Zod schema, USWDS class recipe, Radix primitive, test assertions).

**Pattern template** (applies to each component task `C-N`):

1. **Write failing unit test** at `tests/components/<name>.test.tsx`:

   ```tsx
   import { describe, expect, it } from "vitest";
   import { render, screen } from "@testing-library/react";
   import { axe } from "jest-axe";
   import { uswdsComponents } from "../../src/components";

   describe("<ComponentName>", () => {
     const Comp = uswdsComponents.<ComponentName>;

     it("renders with required props", () => {
       render(<Comp {...EXAMPLE_PROPS}>{EXAMPLE_CHILDREN}</Comp>);
       // per-component assertion
     });

     it("has no a11y violations", async () => {
       const { container } = render(<Comp {...EXAMPLE_PROPS}>{EXAMPLE_CHILDREN}</Comp>);
       expect(await axe(container)).toHaveNoViolations();
     });
   });
   ```

2. **Run test** — expect FAIL (`uswdsComponents.<ComponentName>` is undefined).

3. **Implement visual primitive** at `src/ui/<name>.tsx` (copy shadcn's `src/ui/<name>.tsx` as starting point, then swap Tailwind classes to USWDS token classes per the recipe in the task).

4. **Add to catalog + registry**:
   - Append Zod definition to `src/catalog.ts` inside `uswdsComponentDefinitions`.
   - Append adapter to `src/components.tsx` inside `uswdsComponents`.

5. **Run tests → PASS → commit** with message `feat(uswds): add <ComponentName>`.

**Key guidance for class recipes:** The `uswds-tailwind` preset exposes USWDS tokens as Tailwind utilities (e.g., `bg-primary`, `text-base-darkest`, `font-sans`, `radius-md`). Cross-reference `uswds-tailwind` Storybook for canonical class names per component. When a token is missing, extend the preset in `src/lib/tokens.ts` rather than hardcoding hex values.

---

### Task C-1: Button

**Schema:**
```ts
Button: {
  props: z.object({
    variant: z.enum(["default", "secondary", "outline", "accent-cool", "accent-warm", "base", "ghost", "link"]).nullable(),
    size: z.enum(["default", "sm", "lg", "big"]).nullable(),
    disabled: z.boolean().nullable(),
    type: z.enum(["button", "submit", "reset"]).nullable(),
    onClick: z.string().nullable().describe("Action binding name"),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "USWDS button. Map `variant=default` to usa-button, `secondary` to usa-button--secondary, etc.",
  example: { variant: "default", size: "default" },
},
```

**USWDS class recipe (CVA base + variants):**
- Base: `inline-flex items-center justify-center font-bold font-sans rounded-md px-5 py-3 text-base leading-tight cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`
- `variant.default`: `bg-primary text-white hover:bg-primary-dark active:bg-primary-darker`
- `variant.secondary`: `bg-secondary text-white hover:bg-secondary-dark`
- `variant.outline`: `bg-transparent text-primary border-2 border-primary hover:bg-primary-lighter`
- `variant.accent-cool`: `bg-accent-cool text-ink hover:bg-accent-cool-dark`
- `variant.accent-warm`: `bg-accent-warm text-ink hover:bg-accent-warm-dark`
- `variant.base`: `bg-base text-white hover:bg-base-dark`
- `variant.ghost`: `bg-transparent text-primary hover:bg-primary-lighter`
- `variant.link`: `bg-transparent text-primary underline-offset-4 hover:underline p-0`
- `size.default`: (none beyond base)
- `size.sm`: `text-sm px-3 py-2`
- `size.lg`: `text-lg px-6 py-4`
- `size.big`: `text-xl px-8 py-5`

**Radix primitive:** none — plain `<button>`. Uses `radix-ui` Slot only for `asChild`.

**Test assertion:**
```tsx
const EXAMPLE_PROPS = {};
const EXAMPLE_CHILDREN = "Click me";
// in "renders" test:
expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
```

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Button`.

---

### Task C-2: Card

**Schema:**
```ts
Card: {
  props: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    maxWidth: z.enum(["sm", "md", "lg", "full"]).nullable(),
    centered: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Container card for content sections. Maps to usa-card.",
  example: { title: "Overview", description: "Your account summary" },
},
```

**USWDS class recipe:**
- Card root: `border-1px border-base-lighter bg-white rounded-md shadow-sm overflow-hidden`
- CardHeader: `px-4 pt-4 pb-2`
- CardTitle: `text-lg font-bold font-sans text-ink leading-tight`
- CardDescription: `text-sm text-base-dark mt-1`
- CardContent: `px-4 pb-4`
- `maxWidth.sm`: `max-w-sm`, `md`: `max-w-md`, `lg`: `max-w-lg`, `full`: `max-w-full`
- `centered=true`: `mx-auto`

**Test assertion:**
```tsx
const EXAMPLE_PROPS = { title: "Overview", description: "Summary" };
const EXAMPLE_CHILDREN = <p>Body</p>;
expect(screen.getByText("Overview")).toBeInTheDocument();
expect(screen.getByText("Body")).toBeInTheDocument();
```

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Card`.

---

### Task C-3: Stack

**Schema:**
```ts
Stack: {
  props: z.object({
    direction: z.enum(["horizontal", "vertical"]).nullable(),
    gap: z.enum(["none", "sm", "md", "lg", "xl"]).nullable(),
    align: z.enum(["start", "center", "end", "stretch"]).nullable(),
    justify: z.enum(["start", "center", "end", "between", "around"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Flex container for layouts",
  example: { direction: "vertical", gap: "md" },
},
```

**USWDS class recipe:** pure Tailwind flex utilities (no USWDS-specific classes).
- Base: `flex`
- `direction.vertical`: `flex-col`; `horizontal`: `flex-row`
- `gap.none`: `gap-0`; `sm`: `gap-2`; `md`: `gap-4`; `lg`: `gap-6`; `xl`: `gap-8`
- `align.start|center|end|stretch`: `items-start|items-center|items-end|items-stretch`
- `justify.start|center|end|between|around`: `justify-start|justify-center|justify-end|justify-between|justify-around`

**Test assertion:**
```tsx
const EXAMPLE_PROPS = { direction: "vertical", gap: "md" };
const EXAMPLE_CHILDREN = <><span>a</span><span>b</span></>;
const { container } = render(<Comp {...EXAMPLE_PROPS}>{EXAMPLE_CHILDREN}</Comp>);
expect(container.firstChild).toHaveClass("flex", "flex-col");
```

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Stack`.

---

### Task C-4: Grid

**Schema:**
```ts
Grid: {
  props: z.object({
    columns: z.number().nullable(),
    gap: z.enum(["sm", "md", "lg", "xl"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Grid layout (1-6 columns), built on USWDS grid-row/grid-col",
  example: { columns: 3, gap: "md" },
},
```

**USWDS class recipe:** mirrors `usa-grid-row` / `usa-grid-col`. Keep simple with Tailwind grid utilities:
- Base: `grid`
- `columns`: dynamic — `grid-cols-${columns}` (or `grid-cols-1` fallback when null).
- `gap.sm|md|lg|xl`: `gap-2|gap-4|gap-6|gap-8`

**Test assertion:** container has `grid` class.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Grid`.

---

### Task C-5: Separator

**Schema:**
```ts
Separator: {
  props: z.object({
    orientation: z.enum(["horizontal", "vertical"]).nullable(),
  }),
  description: "Visual separator line",
  example: { orientation: "horizontal" },
},
```

**USWDS class recipe:**
- horizontal: `w-full h-px bg-base-lighter` rendered as `<hr>` (USWDS uses `<hr>` with border-top).
- vertical: `h-full w-px bg-base-lighter` rendered as `<div role="separator" aria-orientation="vertical">`.

**Radix primitive:** none (shadcn uses `@radix-ui/react-separator`; optional here — native `<hr>` is fine).

**Test assertion:** `getByRole("separator")` present.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Separator`.

---

### Task C-6: Heading

**Schema:**
```ts
Heading: {
  props: z.object({
    level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Semantic heading element, USWDS type-scale",
  example: { level: "h2" },
},
```

**USWDS class recipe:** USWDS type scale.
- `h1`: `font-sans text-5xl font-bold leading-tight text-ink`
- `h2`: `font-sans text-4xl font-bold leading-tight text-ink`
- `h3`: `font-sans text-3xl font-bold leading-tight text-ink`
- `h4`: `font-sans text-2xl font-bold leading-tight text-ink`
- `h5`: `font-sans text-xl font-bold leading-tight text-ink`
- `h6`: `font-sans text-lg font-bold leading-tight text-ink`

**Test assertion:**
```tsx
const EXAMPLE_PROPS = { level: "h2" };
expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Title");
```

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Heading`.

---

### Task C-7: Text

**Schema:**
```ts
Text: {
  props: z.object({
    size: z.enum(["xs", "sm", "base", "lg", "xl"]).nullable(),
    weight: z.enum(["normal", "medium", "semibold", "bold"]).nullable(),
    color: z.enum(["default", "muted", "primary", "error", "success"]).nullable(),
    as: z.enum(["p", "span", "div"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Text/paragraph with USWDS type styles",
  example: { size: "base" },
},
```

**USWDS class recipe:**
- `size.xs|sm|base|lg|xl`: `text-xs|text-sm|text-base|text-lg|text-xl`
- `weight.normal|medium|semibold|bold`: `font-normal|font-medium|font-semibold|font-bold`
- `color.default`: `text-ink`; `muted`: `text-base-dark`; `primary`: `text-primary`; `error`: `text-error-dark`; `success`: `text-success-dark`
- All: `font-sans leading-normal`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Text`.

---

### Task C-8: Image

**Schema:**
```ts
Image: {
  props: z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    className: z.string().nullable(),
  }),
  description: "Image element (<img>)",
  example: { src: "/logo.png", alt: "Logo" },
},
```

**USWDS class recipe:** `max-w-full h-auto` base.

**Test assertion:** `getByRole("img", { name: "Logo" })` present.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Image`.

---

### Task C-9: Avatar

**Schema:**
```ts
Avatar: {
  props: z.object({
    src: z.string().nullable(),
    alt: z.string().nullable(),
    fallback: z.string().nullable(),
    size: z.enum(["sm", "md", "lg"]).nullable(),
    className: z.string().nullable(),
  }),
  description: "Avatar image with fallback initials (uses @radix-ui/react-avatar)",
  example: { fallback: "JD", size: "md" },
},
```

**Radix primitive:** `@radix-ui/react-avatar` from `radix-ui`.

**USWDS class recipe:**
- Root: `inline-flex items-center justify-center overflow-hidden rounded-full bg-base-lighter`
- `size.sm`: `size-6`; `md`: `size-10`; `lg`: `size-14`
- Fallback: `text-ink font-bold font-sans`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Avatar`.

---

### Task C-10: Badge

**Schema:**
```ts
Badge: {
  props: z.object({
    variant: z.enum(["default", "secondary", "success", "warning", "error", "info"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Small status/label pill. Maps to USWDS tag component.",
  example: { variant: "default" },
},
```

**USWDS class recipe (maps to `usa-tag`):**
- Base: `inline-block rounded-sm px-2 py-0.5 text-xs font-bold font-sans uppercase tracking-wider`
- `default`: `bg-base-darker text-white`
- `secondary`: `bg-base-lighter text-ink`
- `success`: `bg-success text-white`
- `warning`: `bg-warning text-ink`
- `error`: `bg-error text-white`
- `info`: `bg-info text-white`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Badge`.

---

### Task C-11: Alert

**Schema:**
```ts
Alert: {
  props: z.object({
    variant: z.enum(["info", "success", "warning", "error", "emergency"]).nullable(),
    title: z.string().nullable(),
    slim: z.boolean().nullable(),
    noIcon: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "USWDS alert (usa-alert). Variants: info/success/warning/error/emergency.",
  example: { variant: "info", title: "Heads up" },
},
```

**USWDS class recipe (usa-alert):**
- Root: `border-l-8 p-4 font-sans` + variant color
- `info`: `border-info-dark bg-info-lighter`
- `success`: `border-success-dark bg-success-lighter`
- `warning`: `border-warning-dark bg-warning-lighter`
- `error`: `border-error-dark bg-error-lighter`
- `emergency`: `border-error-darker bg-error-dark text-white`
- Title: `text-lg font-bold text-ink mb-1`
- Body: `text-base text-ink`
- Icon: Lucide icon keyed by variant (`Info`, `CheckCircle`, `AlertTriangle`, `AlertOctagon`, `AlertOctagon`) positioned `inline-block mr-2`. Omit when `noIcon=true`.
- `slim=true`: `py-2`

**Test assertion:** `getByRole("alert")` present with title text.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Alert`.

---

### Task C-12: Progress

**Schema:**
```ts
Progress: {
  props: z.object({
    value: z.number().nullable(),
    max: z.number().nullable(),
    className: z.string().nullable(),
  }),
  description: "Progress bar (uses @radix-ui/react-progress)",
  example: { value: 40 },
},
```

**Radix primitive:** `@radix-ui/react-progress`.

**USWDS class recipe:**
- Root: `relative h-2 w-full overflow-hidden rounded-full bg-base-lighter`
- Indicator: `h-full bg-primary transition-all`

**Test assertion:** `getByRole("progressbar")`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Progress`.

---

### Task C-13: Skeleton

**Schema:**
```ts
Skeleton: {
  props: z.object({
    className: z.string().nullable(),
  }),
  description: "Loading placeholder",
  example: {},
},
```

**USWDS class recipe:** `animate-pulse rounded-md bg-base-lighter`.

**Test assertion:** root has `animate-pulse` class.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Skeleton`.

---

### Task C-14: Spinner

**Schema:**
```ts
Spinner: {
  props: z.object({
    size: z.enum(["sm", "md", "lg"]).nullable(),
    className: z.string().nullable(),
  }),
  description: "Loading spinner",
  example: { size: "md" },
},
```

**USWDS class recipe:** Lucide `Loader2` with `animate-spin text-primary`. `size.sm`: `size-4`; `md`: `size-6`; `lg`: `size-8`.

**Test assertion:** element has `animate-spin` class.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Spinner`.

---

### Task C-15: Table

**Schema:**
```ts
Table: {
  props: z.object({
    caption: z.string().nullable(),
    striped: z.boolean().nullable(),
    borderless: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "USWDS table (usa-table). Children are TableHeader/TableBody rows.",
  example: { caption: "Users", striped: true },
},
```

**USWDS class recipe (usa-table):**
- Table: `w-full border-collapse font-sans text-base`
- `striped`: `[&_tbody_tr:nth-child(odd)]:bg-base-lightest`
- `borderless=false`: `border border-base-light` and cells `border-b border-base-light`
- TableHeader th: `bg-base-lighter text-ink font-bold text-left px-4 py-2`
- TableCell td: `px-4 py-2`
- Caption: `caption-top text-left font-bold text-lg mb-2`

**Test assertion:** `getByRole("table")` + caption visible.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Table`.

---

### Task C-16: Link

**Schema:**
```ts
Link: {
  props: z.object({
    href: z.string(),
    external: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Anchor link with USWDS styling",
  example: { href: "/about" },
},
```

**USWDS class recipe:** `text-primary underline underline-offset-2 hover:text-primary-dark visited:text-violet focus-visible:outline-2 focus-visible:outline-primary`. When `external=true`, append Lucide `ExternalLink` icon.

**Test assertion:** `getByRole("link", { name: "About" })`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Link`.

---

### Task C-17: ButtonGroup

**Schema:**
```ts
ButtonGroup: {
  props: z.object({
    orientation: z.enum(["horizontal", "vertical"]).nullable(),
    attached: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Group of related buttons (usa-button-group)",
  example: { orientation: "horizontal" },
},
```

**USWDS class recipe:** `inline-flex`; `orientation.horizontal`: `flex-row gap-2`; `vertical`: `flex-col gap-2`; `attached=true`: `gap-0 [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add ButtonGroup`.

---

### Task C-18: Input

**Schema:**
```ts
Input: {
  props: z.object({
    type: z.enum(["text", "email", "password", "tel", "url", "number", "search"]).nullable(),
    placeholder: z.string().nullable(),
    disabled: z.boolean().nullable(),
    name: z.string().nullable(),
    label: z.string().nullable(),
    hint: z.string().nullable(),
    error: z.string().nullable(),
    value: z.string().nullable().describe("Data-bound value"),
    className: z.string().nullable(),
  }),
  description: "USWDS text input (usa-input)",
  example: { type: "text", label: "Name", placeholder: "Jane Doe" },
},
```

**USWDS class recipe (usa-input):**
- Label: `block font-bold font-sans text-ink mb-1`
- Hint: `block text-sm text-base-dark mb-1`
- Input: `block w-full max-w-md border border-base-dark rounded-md px-3 py-2 text-base font-sans focus-visible:outline-2 focus-visible:outline-primary disabled:bg-base-lighter disabled:cursor-not-allowed`
- Error wrapper: `border-l-4 border-error-dark pl-3`
- Error message: `text-error-dark font-bold text-sm mt-1`

**json-render adapter:** use `useBoundProp` for `value`, `useFieldValidation` for error display (see shadcn `components.tsx:~200-260` Input adapter).

**Test assertion:** `getByLabelText("Name")` present, error message rendered when `error` prop set.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Input`.

---

### Task C-19: Textarea

**Schema:** same as Input minus `type`, plus `rows: z.number().nullable()`.

**USWDS class recipe:** identical to Input plus `min-h-[100px] resize-y`. Element is `<textarea>`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Textarea`.

---

### Task C-20: Select

**Schema:**
```ts
Select: {
  props: z.object({
    label: z.string().nullable(),
    hint: z.string().nullable(),
    error: z.string().nullable(),
    placeholder: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).nullable(),
    value: z.string().nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "USWDS select (usa-select). Uses @radix-ui/react-select for behavior.",
  example: { label: "State", options: [{ value: "va", label: "Virginia" }] },
},
```

**Radix primitive:** `@radix-ui/react-select`.

**USWDS class recipe:**
- Trigger: `block w-full max-w-md border border-base-dark rounded-md px-3 py-2 text-base font-sans bg-white flex items-center justify-between focus-visible:outline-2 focus-visible:outline-primary`
- Content: `bg-white border border-base-light rounded-md shadow-md mt-1 max-h-60 overflow-auto`
- Item: `px-3 py-2 cursor-pointer hover:bg-primary-lighter focus:bg-primary-lighter outline-none`
- Label/hint/error: same as Input.

**json-render adapter:** `useBoundProp` for `value`.

**Test assertion:** `getByRole("combobox", { name: "State" })`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Select`.

---

### Task C-21: Checkbox

**Schema:**
```ts
Checkbox: {
  props: z.object({
    label: z.string().nullable(),
    hint: z.string().nullable(),
    name: z.string().nullable(),
    checked: z.boolean().nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "USWDS checkbox (usa-checkbox). Uses @radix-ui/react-checkbox.",
  example: { label: "Subscribe" },
},
```

**Radix primitive:** `@radix-ui/react-checkbox`.

**USWDS class recipe (usa-checkbox):**
- Wrapper: `flex items-start gap-2`
- Box: `size-5 border-2 border-ink rounded-sm bg-white data-[state=checked]:bg-primary data-[state=checked]:border-primary flex items-center justify-center`
- Indicator (inside): Lucide `Check` `size-3 text-white`
- Label: `font-sans text-base text-ink cursor-pointer`
- Hint: `text-sm text-base-dark block`

**json-render adapter:** `useBoundProp` for `checked`.

**Test assertion:** `getByRole("checkbox", { name: "Subscribe" })`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Checkbox`.

---

### Task C-22: Radio (RadioGroup)

**Schema:**
```ts
Radio: {
  props: z.object({
    label: z.string().nullable(),
    name: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), label: z.string(), hint: z.string().nullable() })).nullable(),
    value: z.string().nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "USWDS radio group (usa-radio). Uses @radix-ui/react-radio-group.",
  example: { label: "Size", options: [{ value: "s", label: "Small" }, { value: "m", label: "Medium" }] },
},
```

**Radix primitive:** `@radix-ui/react-radio-group`.

**USWDS class recipe:**
- Group: `flex flex-col gap-2`
- Item wrapper: `flex items-start gap-2`
- Item button: `size-5 border-2 border-ink rounded-full bg-white data-[state=checked]:border-primary flex items-center justify-center`
- Indicator: `size-2.5 rounded-full bg-primary`
- Label + hint same as Checkbox.

**json-render adapter:** `useBoundProp` for `value`.

**Test assertion:** `getAllByRole("radio")` length equals options.length.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Radio`.

---

### Task C-23: Switch

**Schema:**
```ts
Switch: {
  props: z.object({
    label: z.string().nullable(),
    name: z.string().nullable(),
    checked: z.boolean().nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "Toggle switch (uses @radix-ui/react-switch). No direct USWDS analogue — styled to match USWDS tokens.",
  example: { label: "Notifications", checked: false },
},
```

**Radix primitive:** `@radix-ui/react-switch`.

**USWDS class recipe:**
- Root: `relative h-6 w-11 rounded-full bg-base-light data-[state=checked]:bg-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary`
- Thumb: `block size-5 rounded-full bg-white translate-x-0.5 data-[state=checked]:translate-x-5 transition-transform`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Switch`.

---

### Task C-24: Slider

**Schema:**
```ts
Slider: {
  props: z.object({
    label: z.string().nullable(),
    min: z.number().nullable(),
    max: z.number().nullable(),
    step: z.number().nullable(),
    value: z.number().nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "Range slider (uses @radix-ui/react-slider). No USWDS analogue.",
  example: { label: "Volume", min: 0, max: 100, value: 50 },
},
```

**Radix primitive:** `@radix-ui/react-slider`.

**USWDS class recipe:**
- Root: `relative flex items-center w-full max-w-md h-5 touch-none select-none`
- Track: `relative h-1 grow rounded-full bg-base-lighter`
- Range: `absolute h-full bg-primary rounded-full`
- Thumb: `block size-5 rounded-full bg-primary border-2 border-white shadow focus-visible:outline-2 focus-visible:outline-primary`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Slider`.

---

### Task C-25: Toggle

**Schema:**
```ts
Toggle: {
  props: z.object({
    pressed: z.boolean().nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Two-state button (uses @radix-ui/react-toggle).",
  example: { pressed: false },
},
```

**Radix primitive:** `@radix-ui/react-toggle`.

**USWDS class recipe:** use Button outline base classes + `data-[state=on]:bg-primary data-[state=on]:text-white`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Toggle`.

---

### Task C-26: ToggleGroup

**Schema:**
```ts
ToggleGroup: {
  props: z.object({
    type: z.enum(["single", "multiple"]).nullable(),
    value: z.union([z.string(), z.array(z.string())]).nullable(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).nullable(),
    disabled: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "Group of toggles (uses @radix-ui/react-toggle-group).",
  example: { type: "single", options: [{ value: "a", label: "A" }, { value: "b", label: "B" }] },
},
```

**Radix primitive:** `@radix-ui/react-toggle-group`.

**USWDS class recipe:** same as ButtonGroup with `attached=true`. Each item uses Toggle classes.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add ToggleGroup`.

---

### Task C-27: Accordion

**Schema:**
```ts
Accordion: {
  props: z.object({
    type: z.enum(["single", "multiple"]).nullable(),
    items: z.array(z.object({ value: z.string(), title: z.string(), content: z.string() })).nullable(),
    bordered: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  description: "USWDS accordion (usa-accordion). Uses @radix-ui/react-accordion.",
  example: { type: "single", items: [{ value: "one", title: "Section 1", content: "..." }] },
},
```

**Radix primitive:** `@radix-ui/react-accordion`.

**USWDS class recipe (usa-accordion):**
- Root: `w-full`
- Item: `border-b border-base-lighter` (when `bordered=true`: `border-2 border-base-lighter rounded-md mb-1`)
- Trigger: `flex w-full items-center justify-between bg-base-lighter px-4 py-3 text-left font-bold font-sans text-ink hover:bg-base-light data-[state=open]:bg-base-light focus-visible:outline-2 focus-visible:outline-primary`
- Trigger icon: Lucide `ChevronDown size-5 transition-transform data-[state=open]:rotate-180`
- Content: `px-4 py-3 bg-white`

**Test assertion:** `getByRole("button", { name: /Section 1/ })` and clicking it toggles `aria-expanded`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Accordion`.

---

### Task C-28: Collapsible

**Schema:**
```ts
Collapsible: {
  props: z.object({
    open: z.boolean().nullable(),
    title: z.string().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "Single collapsible section (uses @radix-ui/react-collapsible).",
  example: { title: "Details" },
},
```

**Radix primitive:** `@radix-ui/react-collapsible`.

**USWDS class recipe:** same as Accordion item.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Collapsible`.

---

### Task C-29: Tabs

**Schema:**
```ts
Tabs: {
  props: z.object({
    defaultValue: z.string().nullable(),
    items: z.array(z.object({ value: z.string(), title: z.string(), content: z.string() })).nullable(),
    className: z.string().nullable(),
  }),
  description: "Tabs (uses @radix-ui/react-tabs). No direct USWDS analogue; styled with USWDS tokens.",
  example: { defaultValue: "a", items: [{ value: "a", title: "Tab A", content: "..." }] },
},
```

**Radix primitive:** `@radix-ui/react-tabs`.

**USWDS class recipe:**
- List: `inline-flex border-b-2 border-base-light gap-0`
- Trigger: `px-4 py-2 font-bold font-sans text-base-dark border-b-2 border-transparent -mb-0.5 data-[state=active]:text-primary data-[state=active]:border-primary focus-visible:outline-2 focus-visible:outline-primary`
- Content: `pt-4`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Tabs`.

---

### Task C-30: Pagination

**Schema:**
```ts
Pagination: {
  props: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    onPageChange: z.string().nullable().describe("Action binding"),
    className: z.string().nullable(),
  }),
  description: "USWDS pagination (usa-pagination).",
  example: { currentPage: 3, totalPages: 10 },
},
```

**Radix primitive:** none — plain nav with buttons.

**USWDS class recipe (usa-pagination):**
- Nav: `flex items-center gap-1 font-sans`
- Page button: `inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-primary hover:bg-primary-lighter aria-current:bg-primary aria-current:text-white`
- Prev/Next: Lucide `ChevronLeft`/`ChevronRight` + label
- Ellipsis: `px-2 text-base-dark`

Pagination rendering logic: show first, last, current ± 1, ellipses for gaps.

**Test assertion:** `getByRole("navigation", { name: /pagination/i })` + current page has `aria-current="page"`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Pagination`.

---

### Task C-31: Tooltip

**Schema:**
```ts
Tooltip: {
  props: z.object({
    content: z.string(),
    side: z.enum(["top", "right", "bottom", "left"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["default"],
  description: "USWDS tooltip (usa-tooltip). Uses @radix-ui/react-tooltip.",
  example: { content: "More info" },
},
```

**Radix primitive:** `@radix-ui/react-tooltip`.

**USWDS class recipe:**
- Content: `bg-ink text-white text-sm px-2 py-1 rounded-md shadow-md z-50 max-w-xs`
- Arrow: `fill-ink`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Tooltip`.

---

### Task C-32: Popover

**Schema:**
```ts
Popover: {
  props: z.object({
    side: z.enum(["top", "right", "bottom", "left"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["trigger", "default"],
  description: "Popover (uses @radix-ui/react-popover).",
  example: { side: "bottom" },
},
```

**Radix primitive:** `@radix-ui/react-popover`.

**USWDS class recipe:** `bg-white border border-base-light rounded-md shadow-lg p-4 z-50 max-w-sm`.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Popover`.

---

### Task C-33: DropdownMenu

**Schema:**
```ts
DropdownMenu: {
  props: z.object({
    items: z.array(z.object({ value: z.string(), label: z.string(), disabled: z.boolean().nullable() })).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["trigger"],
  description: "Dropdown menu (uses @radix-ui/react-dropdown-menu).",
  example: { items: [{ value: "edit", label: "Edit" }, { value: "delete", label: "Delete" }] },
},
```

**Radix primitive:** `@radix-ui/react-dropdown-menu`.

**USWDS class recipe:**
- Content: `bg-white border border-base-light rounded-md shadow-lg py-1 z-50 min-w-[10rem]`
- Item: `px-3 py-2 cursor-pointer font-sans text-ink hover:bg-primary-lighter focus:bg-primary-lighter outline-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add DropdownMenu`.

---

### Task C-34: Dialog

**Schema:**
```ts
Dialog: {
  props: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    open: z.boolean().nullable(),
    className: z.string().nullable(),
  }),
  slots: ["trigger", "default"],
  description: "USWDS modal (usa-modal). Uses @radix-ui/react-dialog.",
  example: { title: "Confirm", description: "Are you sure?" },
},
```

**Radix primitive:** `@radix-ui/react-dialog`.

**USWDS class recipe (usa-modal):**
- Overlay: `fixed inset-0 bg-ink/60 z-40`
- Content: `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 max-w-lg w-[90vw]`
- Title: `text-2xl font-bold font-sans text-ink mb-2`
- Description: `text-base text-base-dark mb-4`
- Close button: Lucide `X` in top-right corner `absolute right-4 top-4 size-6 text-base-dark hover:text-ink`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Dialog`.

---

### Task C-35: Drawer

**Schema:**
```ts
Drawer: {
  props: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    open: z.boolean().nullable(),
    direction: z.enum(["top", "right", "bottom", "left"]).nullable(),
    className: z.string().nullable(),
  }),
  slots: ["trigger", "default"],
  description: "Slide-in drawer (uses vaul). No direct USWDS analogue.",
  example: { title: "Settings", direction: "right" },
},
```

**Library:** `vaul`.

**USWDS class recipe:**
- Overlay: `fixed inset-0 bg-ink/60 z-40`
- Content: `fixed bg-white shadow-xl z-50 p-6` + direction-specific positioning
- Same title/description styles as Dialog.

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Drawer`.

---

### Task C-36: Carousel

**Schema:**
```ts
Carousel: {
  props: z.object({
    items: z.array(z.object({ src: z.string(), alt: z.string() })).nullable(),
    className: z.string().nullable(),
  }),
  description: "Image carousel (uses embla-carousel-react). No USWDS analogue.",
  example: { items: [{ src: "/a.jpg", alt: "A" }] },
},
```

**Library:** `embla-carousel-react`.

**USWDS class recipe:**
- Viewport: `overflow-hidden rounded-md`
- Container: `flex`
- Slide: `relative shrink-0 grow-0 basis-full`
- Prev/Next buttons: use Button outline variant + `absolute top-1/2 -translate-y-1/2`

- [ ] Follow pattern steps 1–5. Commit as `feat(uswds): add Carousel`.

---

## Finalization

### Task F-1: Enable parity test

**Files:**
- Modify: `json-render/packages/uswds/tests/catalog.test.ts`

- [ ] **Step 1: Remove the `.skip` added in Task 4**

Change `it.skip("is a key-superset ...")` back to `it("is a key-superset ...")`.

- [ ] **Step 2: Run tests**

```bash
pnpm --filter @oddball/json-render-uswds test
```
Expected: all three contract tests pass (36 components, matching shadcn keys).

- [ ] **Step 3: Commit**

```bash
git add json-render/packages/uswds/tests/catalog.test.ts
git commit -m "test(uswds): enable shadcn parity test"
```

---

### Task F-2: Storybook

**Files:**
- Create: `json-render/packages/uswds/.storybook/main.ts`
- Create: `json-render/packages/uswds/.storybook/preview.ts`
- Create: `json-render/packages/uswds/src/ui/*.stories.tsx` (one story file per component)

- [ ] **Step 1: Install Storybook**

```bash
cd json-render/packages/uswds
pnpm dlx storybook@latest init --type react-vite --skip-install
pnpm install
```

- [ ] **Step 2: Configure preview to load uswds-tailwind + global styles**

`.storybook/preview.ts`:
```ts
import "../src/storybook.css"; // imports `@import "tailwindcss";` + uswds-tailwind preset
export const parameters = { actions: { argTypesRegex: "^on[A-Z].*" } };
```

- [ ] **Step 3: Author one story per component**

Template for `src/ui/button.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = { component: Button };
export default meta;

export const Default: StoryObj<typeof Button> = { args: { children: "Click me" } };
export const Secondary: StoryObj<typeof Button> = { args: { variant: "secondary", children: "Secondary" } };
export const Outline: StoryObj<typeof Button> = { args: { variant: "outline", children: "Outline" } };
```

Repeat for each component with at least a `Default` story exercising the catalog `example`.

- [ ] **Step 4: Run Storybook locally and verify visuals**

```bash
pnpm --filter @oddball/json-render-uswds storybook
```
Expected: Storybook launches at `localhost:6006` with all 36 components visible.

- [ ] **Step 5: Commit**

```bash
git add json-render/packages/uswds/.storybook json-render/packages/uswds/src
git commit -m "chore(uswds): add Storybook with per-component stories"
```

---

### Task F-3: Example app

**Files:**
- Create: `json-render/examples/uswds-demo/` (scaffolded next to other examples)

- [ ] **Step 1: Scaffold example**

Copy structure from an existing `json-render/examples/<shadcn-demo>/`; swap `@json-render/shadcn` imports for `@oddball/json-render-uswds`.

- [ ] **Step 2: Wire tokens into the example's Tailwind config**

`tailwind.config.ts`:
```ts
import uswdsPreset from "@oddball/json-render-uswds/tokens";
export default {
  presets: [uswdsPreset],
  content: ["./src/**/*.{ts,tsx}", "../../packages/uswds/dist/**/*.js"],
};
```

- [ ] **Step 3: Render a sample JSON payload exercising every component**

Create `src/sample.json` with one node per catalog entry; render via the standard json-render React entry.

- [ ] **Step 4: Run example**

```bash
pnpm --filter uswds-demo dev
```
Expected: page renders with all 36 components visible.

- [ ] **Step 5: Commit**

```bash
git add json-render/examples/uswds-demo
git commit -m "docs(uswds): add example app exercising catalog"
```

---

### Task F-4: README + a11y audit

**Files:**
- Modify: `json-render/packages/uswds/README.md`

- [ ] **Step 1: Write README**

Cover: install, peer deps, Tailwind config setup with `/tokens` preset, import patterns (`/catalog` vs top-level vs `/components`), component list, usage example, link to spec + plan.

- [ ] **Step 2: Run full a11y audit**

```bash
pnpm --filter @oddball/json-render-uswds test
```
Expected: every per-component a11y test passes with zero violations.

- [ ] **Step 3: Run typecheck + build**

```bash
pnpm --filter @oddball/json-render-uswds check-types
pnpm --filter @oddball/json-render-uswds build
```
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add json-render/packages/uswds/README.md
git commit -m "docs(uswds): add README"
```

---

### Task F-5: Release candidate

- [ ] **Step 1: Bump CHANGELOG**

Add `## 0.1.0-rc.1 — 2026-04-22` entry listing initial component set.

- [ ] **Step 2: Publish dry-run**

```bash
pnpm --filter @oddball/json-render-uswds publish --dry-run --tag rc --access public
```
Expected: tarball contents list only `dist/` + `package.json` + `README.md` + `CHANGELOG.md`.

- [ ] **Step 3: Publish rc (maintainer runs interactively, not via plan)**

Stop here. Hand off to a maintainer with npm publish rights; the plan's automated portion is complete.

- [ ] **Step 4: Commit CHANGELOG**

```bash
git add json-render/packages/uswds/CHANGELOG.md
git commit -m "chore(uswds): 0.1.0-rc.1"
```

---

## Self-review notes

- **Spec coverage:** Package/surface/data-flow → Tasks 1–2. Tokens → Task 2. Testing → Tasks 3–4 + per-component. 36 components → Tasks C-1..C-36. Repo layout matches. Milestone grouping in the spec maps to task ordering here. Parity test reservation satisfied by F-1.
- **Placeholder scan:** Each component task has concrete Zod schema + class recipe + test assertion. No "TBD"s. One deliberate deferral: json-render-specific binding adapter code (`useBoundProp` etc.) is referenced by location in `packages/shadcn/src/components.tsx` — engineers must read that file while implementing form-input adapters. This is acceptable because the binding API is owned by `@json-render/react` and mirrored across all catalog packages.
- **Type consistency:** `uswdsComponentDefinitions`, `uswdsComponents`, `ComponentDefinition` used identically throughout. Prop keys align with shadcn's catalog in all overlapping components.

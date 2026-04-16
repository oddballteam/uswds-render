# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

pnpm workspace with three members:

- **`packages/uswds/`** — `@oddball/json-render-uswds`: the publishable component library. 36 USWDS-styled React components plus a Zod catalog, wired to consume `@json-render/core` as a peer. Published to npm.
- **`examples/uswds-demo/`** — Vite SPA. Split-pane json-render playground with a CodeMirror JSON editor on the left and a live `@json-render/react` preview on the right. Ships 4 preset specs (`src/specs/*.json`) demonstrating the spec format. No AI.
- **`examples/uswds-playground/`** — Next.js 15 App Router. AI chat playground: prompt → Vercel AI SDK ToolLoopAgent → `pipeJsonRender` stream → inline USWDS render. 5 mock gov-service tools (VA appointments, claim status, Medicare plans, GI Bill, VA facilities).

`json-render/` at the repo root is an **untracked external checkout** of the upstream `vercel-labs/json-render` monorepo, kept as read-only reference for forking patterns (notably `examples/chat/`). It is gitignored. Do not modify it, do not import from it, do not commit it.

## Commands

From repo root unless noted.

```bash
# Install all workspace deps
pnpm install

# Build everything
pnpm -r build

# Typecheck everything
pnpm -r typecheck

# Test everything
pnpm -r test

# Per-workspace (examples)
pnpm --filter @oddball/json-render-uswds build        # tsup CJS+ESM+types
pnpm --filter @oddball/json-render-uswds test         # vitest (75 tests: unit + axe + catalog contract + shadcn parity)
pnpm --filter @oddball/json-render-uswds storybook    # localhost:6006
pnpm --filter uswds-demo dev                           # localhost:5173
pnpm --filter uswds-playground dev                     # localhost:3000 (requires .env.local)
```

Run a single vitest file:

```bash
pnpm --filter @oddball/json-render-uswds test tests/components/button.test.tsx
```

## Architecture

### Catalog / registry model (core abstraction)

The `@oddball/json-render-uswds` package exports two parallel records keyed by identical component names:

- `uswdsComponentDefinitions` (in `packages/uswds/src/catalog.ts`) — a `Record<string, { props: ZodSchema, slots?, description, example }>` used for AI output validation and `@json-render/core`'s `defineCatalog`.
- `uswdsComponents` (in `packages/uswds/src/components.tsx`) — a `Record<string, ComponentType>` consumed by `@json-render/react`'s `defineRegistry`. Each entry is a thin adapter that accepts both the json-render envelope shape (`{ props, emit, children }`) and plain React props (passthrough for standalone/test usage).

A contract test (`tests/catalog.test.ts`) enforces that the two records stay in lockstep and that every key in `@json-render/shadcn`'s catalog is present in ours (parity guarantee).

Visual primitives live in `packages/uswds/src/ui/<name>.tsx` (CVA-based, identical pattern to shadcn's `packages/shadcn/src/ui/`). The adapter layer in `src/components.tsx` wraps each primitive and handles the envelope shape.

### Text-bearing components

`Text`, `Heading`, `Badge`, and `Link` accept their content via a `text` prop (or `label` for Link) — NOT only via React children. This matches the shadcn catalog convention and is load-bearing for AI-generated flat-tree specs where `children` is an array of element key references, not inline strings. Adapters fall back to React children when the prop is absent.

### Token CSS

`packages/uswds/src/lib/tokens/` vendors the Tailwind v4 preset from `IHIutch/uswds-tailwind` (MIT, see `NOTICES.md` + `LICENSE-uswds-tailwind`). It is exposed to consumers as:

- `@oddball/json-render-uswds/tokens` — JS preset export (re-exports the tailwind.config.ts object).
- `@oddball/json-render-uswds/tokens.css` — the CSS layer with `@theme`, `@utility`, semantic aliases (primary, base, ink, etc.), and USWDS color palette.

The preset's raw palette is USWDS-specific (`blue-60v`, `gray-cool-60`, …). A semantic-alias `@theme` block in `tokens/index.css` maps common names (`primary`, `primary-dark`, `ink`, `success`, …) to raw palette variables so USWDS-idiomatic class strings in our components resolve. See `docs/superpowers/notes/uswds-tailwind-class-map.md` for the full mapping table.

`tokens.css` loads four Tailwind plugins via `@plugin`: `@tailwindcss/forms`, `@tailwindcss/typography`, `@iconify/tailwind4`, `tailwindcss-animate`. These are declared as peerDependencies — consumers must install them.

### Tailwind class scanning (important gotcha)

Consumers of `@oddball/json-render-uswds` must tell Tailwind to scan the package's built output so the utility classes used internally by components actually get emitted:

```css
@source "../node_modules/@oddball/json-render-uswds/dist/**/*.{js,mjs}";
```

Without this, components render structurally but have no styling (plain-text appearance). `examples/uswds-demo/src/styles.css` and `examples/uswds-playground/app/globals.css` both do this against the workspace-local package path.

### Json-render rendering pipeline

Both demo apps follow the same shape:

1. Define a local catalog: `defineCatalog(schema, { components: uswdsComponentDefinitions, actions: {} })`.
2. Define a registry: `defineRegistry(catalog, { components: uswdsComponents as Components<typeof catalog> })`. The cast is required because the package exports components as a loose `Record<string, ComponentType<any>>`.
3. Wrap `Renderer` with `StateProvider`, `VisibilityProvider`, `ActionProvider`.
4. Pass in a `Spec` with `root` + `elements` (flat-tree format).
5. Guard against partial mid-stream specs: the Renderer crashes on "Cannot convert undefined or null to object" if the `root` key is not yet present in `elements`. See `examples/uswds-playground/lib/render/renderer.tsx` for the `isRenderable()` guard + `loading` prop plumbing.

### Playground (AI chat) specifics

- Fork of `json-render/examples/chat/` structurally; chat chrome uses vanilla shadcn primitives (vendored into `components/ui/`), rendered output uses USWDS.
- `lib/agent.ts` builds the system prompt with `WORKFLOW` / `RULES` / `DATA BINDING` / `SCENARIO RECIPES` sections plus `playgroundCatalog.prompt({ mode: "inline", customRules: [...] })` appended. The customRules array is the place to land catalog-level guidance (e.g., "Table has no columns/rows API", "Text content goes in props, not children").
- `lib/provider.ts` picks between `@ai-sdk/anthropic` and `@ai-sdk/openai` based on which env var is set first (`ANTHROPIC_API_KEY` preferred). No interactive configuration; devs use `.env.local`.
- Token CSS is vendored into `examples/uswds-playground/app/tokens/` with `@config "./tailwind.config.ts"` (relative) because the package's `@config` directive references `@uswds-tailwind/theme` which is not published.
- Light mode only: `<html className="light">` forced in `app/layout.tsx`. `ThemeProvider` was removed.

## Specs and plans

`docs/superpowers/specs/*.md` contain design docs. `docs/superpowers/plans/*.md` contain bite-sized implementation plans the agent executed. `docs/superpowers/notes/*.md` contain reference material (e.g., the class-map doc). These are the canonical descriptions of how pieces were built and why.

## Known follow-ups

- The vendored typography-plugin config in `packages/uswds/src/lib/tokens/tailwind.config.ts` is loaded by neither the package nor consumers (the `@config` directive was removed from `tokens/index.css` to fix consumer resolution). It remains in-tree only for historical reference.
- The cast `uswdsComponents as unknown as Components<C>` in the demo apps' renderer files could go away if the package narrows its `uswdsComponents` type to a mapped type keyed by `keyof typeof uswdsComponentDefinitions`.

## When forking a new demo app

Read the corresponding equivalent file in `json-render/examples/chat/` before copying Vercel AI SDK or `@json-render/*` streaming patterns. Both APIs churn between minor versions; the upstream reference is the source of truth.

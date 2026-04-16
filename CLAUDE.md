# CLAUDE.md

Guide Claude Code (claude.ai/code) when working in this repo.

## Repository layout

pnpm workspace, three members:

- **`packages/uswds/`** — `@oddball/json-render-uswds`: publishable component library. 36 USWDS-styled React components + Zod catalog, consumes `@json-render/core` as peer. Published to npm.
- **`examples/uswds-demo/`** — Vite SPA. Split-pane json-render playground: CodeMirror JSON editor left, live `@json-render/react` preview right. 4 preset specs (`src/specs/*.json`) show spec format. No AI.
- **`examples/uswds-playground/`** — Next.js 15 App Router. AI chat playground: prompt → Vercel AI SDK ToolLoopAgent → `pipeJsonRender` stream → inline USWDS render. 5 mock gov-service tools (VA appointments, claim status, Medicare plans, GI Bill, VA facilities).

`json-render/` at repo root = **untracked external checkout** of upstream `vercel-labs/json-render` monorepo, read-only reference for forking patterns (notably `examples/chat/`). Gitignored. Do not modify, import from, or commit it.

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
pnpm --filter @oddball/json-render-uswds test         # vitest (112 tests: per-component smoke + axe + catalog contract + shadcn parity + envelope passthrough)
pnpm --filter @oddball/json-render-uswds storybook    # localhost:6006
pnpm --filter uswds-demo dev                           # localhost:5173
pnpm --filter uswds-playground dev                     # localhost:3000 (requires .env.local)
```

Run single vitest file:

```bash
pnpm --filter @oddball/json-render-uswds test tests/components/button.test.tsx
```

## Architecture

### Catalog / registry model (core abstraction)

`@oddball/json-render-uswds` exports two parallel records keyed by identical component names:

- `uswdsComponentDefinitions` (`packages/uswds/src/catalog.ts`) — `Record<string, { props: ZodSchema, slots?, description, example }>` used for AI output validation + `@json-render/core`'s `defineCatalog`.
- `uswdsComponents` (`packages/uswds/src/components.tsx`) — `Record<string, ComponentType>` consumed by `@json-render/react`'s `defineRegistry`. Each entry = thin adapter accepting both json-render envelope shape (`{ props, emit, children }`) + plain React props (passthrough for standalone/test use).

Two contract tests guard lockstep:

- `tests/catalog.test.ts` — `uswdsComponentDefinitions` keys ↔ `uswdsComponents` keys, every `example` validates against own Zod schema, every key in `@json-render/shadcn`'s catalog present in ours (parity guarantee).
- `tests/envelope.test.tsx` — every entry in `uswdsComponents` renders correctly when invoked via json-render envelope shape `{ props: example, emit, children }` using catalog `example`. Per-component tests in `tests/components/` exercise plain-React-prop path; this file = only thing exercising production code path. Adapter forgets to merge `envelopeProps` → this fails.

Visual primitives live in `packages/uswds/src/ui/<name>.tsx` (CVA-based, identical pattern to shadcn's `packages/shadcn/src/ui/`). Adapter layer in `src/components.tsx` wraps each primitive, handles envelope shape.

### Text-bearing components

`Text`, `Heading`, `Badge`, `Link` accept content via `text` prop (or `label` for Link) — NOT only React children. Matches shadcn catalog convention, load-bearing for AI-generated flat-tree specs where `children` = array of element key refs, not inline strings. Adapters fall back to React children when prop absent.

### Token CSS

`packages/uswds/src/lib/tokens/` vendors Tailwind v4 preset from `IHIutch/uswds-tailwind` (MIT, see `NOTICES.md` + `LICENSE-uswds-tailwind`). Exposed to consumers as:

- `@oddball/json-render-uswds/tokens` — JS preset export (re-exports tailwind.config.ts object).
- `@oddball/json-render-uswds/tokens.css` — CSS layer with `@theme`, `@utility`, semantic aliases (primary, base, ink, etc.), USWDS color palette.

Preset raw palette = USWDS-specific (`blue-60v`, `gray-cool-60`, …). Semantic-alias `@theme` block in `tokens/index.css` maps common names (`primary`, `primary-dark`, `ink`, `success`, …) to raw palette vars so USWDS-idiomatic class strings in components resolve. See `docs/superpowers/notes/uswds-tailwind-class-map.md` for full mapping table.

`tokens.css` loads four Tailwind plugins via `@plugin`: `@tailwindcss/forms`, `@tailwindcss/typography`, `@iconify/tailwind4`, `tailwindcss-animate`. Declared as peerDependencies — consumers must install.

### Tailwind class scanning (important gotcha)

Consumers of `@oddball/json-render-uswds` must tell Tailwind to scan package's built output so utility classes used internally by components get emitted:

```css
@source "../node_modules/@oddball/json-render-uswds/dist/**/*.{js,mjs}";
```

Without this, components render structurally but unstyled (plain-text). `examples/uswds-demo/src/styles.css` + `examples/uswds-playground/app/globals.css` both do this against workspace-local package path.

### Json-render rendering pipeline

Both demo apps same shape:

1. Define local catalog: `defineCatalog(schema, { components: uswdsComponentDefinitions, actions: {} })`.
2. Define registry: `defineRegistry(catalog, { components: uswdsComponents as Components<typeof catalog> })`. Cast required because package exports components as loose `Record<string, ComponentType<any>>`.
3. Wrap `Renderer` with `StateProvider`, `VisibilityProvider`, `ActionProvider`.
4. Pass `Spec` with `root` + `elements` (flat-tree format).
5. Guard partial mid-stream specs: Renderer crashes on "Cannot convert undefined or null to object" if `root` key not yet in `elements`. See `examples/uswds-playground/lib/render/renderer.tsx` for `isRenderable()` guard + `loading` prop plumbing.

### Playground (AI chat) specifics

- Fork of `json-render/examples/chat/` structurally; chat chrome uses vanilla shadcn primitives (vendored into `components/ui/`), rendered output uses USWDS.
- `lib/agent.ts` builds system prompt with `WORKFLOW` / `RULES` / `DATA BINDING` / `SCENARIO RECIPES` sections + `playgroundCatalog.prompt({ mode: "inline", customRules: [...] })` appended. customRules array = place for catalog-level guidance (e.g., "Table has no columns/rows API", "Text content goes in props, not children").
- `lib/provider.ts` picks between `@ai-sdk/anthropic` + `@ai-sdk/openai` based on which env var set first (`ANTHROPIC_API_KEY` preferred). No interactive config; devs use `.env.local`.
- Token CSS vendored into `examples/uswds-playground/app/tokens/` with `@config "./tailwind.config.ts"` (relative) because package's `@config` directive references `@uswds-tailwind/theme` which is unpublished.
- Light mode only: `<html className="light">` forced in `app/layout.tsx`. `ThemeProvider` removed.

## Specs and plans

`docs/superpowers/specs/*.md` = design docs. `docs/superpowers/plans/*.md` = bite-sized implementation plans agent executed. `docs/superpowers/notes/*.md` = reference material (e.g., class-map doc). Canonical descriptions of how pieces built + why.

## Known follow-ups

- Vendored typography-plugin config in `packages/uswds/src/lib/tokens/tailwind.config.ts` loaded by neither package nor consumers (`@config` directive removed from `tokens/index.css` to fix consumer resolution). Remains in-tree for historical reference only.
- Cast `uswdsComponents as unknown as Components<C>` in demo apps' renderer files could go away if package narrows `uswdsComponents` type to mapped type keyed by `keyof typeof uswdsComponentDefinitions`.

## When forking a new demo app

Read corresponding equivalent file in `json-render/examples/chat/` before copying Vercel AI SDK or `@json-render/*` streaming patterns. Both APIs churn between minor versions; upstream reference = source of truth.
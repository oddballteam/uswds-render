# uswds-render

A pnpm monorepo that generates rich, USWDS-styled government service UIs from AI prompts. A user describes what they need — VA appointments, Medicare plan comparisons, GI Bill balance — the AI fetches real data via tools, then streams a USWDS component tree rendered inline in the chat.

The system is built around a catalog/registry model: a publishable component library (`@oddball/json-render-uswds`) wraps Truss Works React USWDS components; a mock CDN demonstrates how domain-specific components (CMS-authored web components) can be added without touching the core repo.

---

## Workspace layout

| Path | Package | Purpose |
|---|---|---|
| `packages/uswds/` | `@oddball/json-render-uswds` | Publishable USWDS component library. 48 components + Zod catalog. |
| `packages/mock-cdn/` | — | Simulates an external CDN. Serves web component bundles and `catalog.json`. |
| `examples/uswds-playground/` | `uswds-playground` | Next.js 15 AI chat playground. Prompt → agent → streamed USWDS UI. |
| `examples/uswds-demo/` | `uswds-demo` | Vite SPA. Static JSON editor with live component preview. No AI. |

---

## Prerequisites

- **Node.js** 20+
- **pnpm** 9.15+ (`npm install -g pnpm`)
- An **Anthropic** or **OpenAI** API key (playground only)

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build the component library

The playground imports from `@oddball/json-render-uswds`. Build it once before running any app:

```bash
pnpm --filter @oddball/json-render-uswds build
```

### 3. Configure the playground environment

Create `examples/uswds-playground/.env.local`:

```env
# Pick one — Anthropic is preferred
ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-...

# Mock CDN (required for domain-specific components)
COMPONENT_CDN_URL=http://localhost:4000
NEXT_PUBLIC_COMPONENT_CDN_URL=http://localhost:4000
```

### 4. Start the mock CDN

The CDN serves domain-specific web components (appointment cards, plan summaries, etc.). The playground degrades gracefully without it, but those components will not render.

Run from the repo root:

```bash
node packages/mock-cdn/server.mjs
```

Listens on `http://localhost:4000`. Auto-restart on file changes:

```bash
node --watch packages/mock-cdn/server.mjs
```

### 5. Start the playground

```bash
pnpm --filter uswds-playground dev
```

Open `http://localhost:3000`. Type a prompt — e.g. "Show my VA appointments" or "Compare Medicare plans" — and the AI fetches data and renders a live USWDS UI inline.

---

## Other apps

### USWDS demo (static JSON editor)

No API key or CDN needed.

```bash
pnpm --filter uswds-demo dev
```

Opens at `http://localhost:5173`. Edit JSON on the left, see the rendered USWDS component tree on the right. Useful for testing component specs without the AI layer.

---

## Common commands

```bash
# Install all workspace deps
pnpm install

# Build everything
pnpm -r build

# Typecheck everything
pnpm -r typecheck

# Test everything
pnpm -r test

# Test a single file
pnpm --filter @oddball/json-render-uswds test tests/components/button.test.tsx
```

---

## Docs

Additional context on architecture decisions and implementation plans lives in `docs/`.

# USWDS Playground

AI-powered chat playground that generates USWDS-styled government interfaces from natural-language prompts. An Oddball Labs product.

## Run locally

```bash
# 1. From repo root, install deps
pnpm install

# 2. Build the uswds package once
pnpm --filter @oddball/json-render-uswds build

# 3. Copy the env template and add an API key
cp examples/uswds-playground/.env.local.example examples/uswds-playground/.env.local
# Edit .env.local — set ANTHROPIC_API_KEY (preferred) or OPENAI_API_KEY

# 4. Start the dev server
pnpm --filter uswds-playground dev
```

Open `http://localhost:3000`.

## How it works

The app is a fork of `json-render/examples/chat/` with two targeted changes:

1. The rendering layer uses `@oddball/json-render-uswds` (catalog + components) instead of `@json-render/shadcn`.
2. The tools are 5 mock gov-service functions (VA appointments, disability claims, Medicare plan comparison, GI Bill benefits, VA facility search).

The chat chrome (message bubbles, input, header) still uses vanilla shadcn primitives — separating "container UI" (shadcn) from "AI-generated UI" (USWDS).

## Provider detection

`lib/provider.ts` picks the first configured provider:

1. `ANTHROPIC_API_KEY` → Claude Haiku 4.5
2. `OPENAI_API_KEY` → GPT-4o

## Structure

- `app/` — Next.js App Router
- `components/ui/` — shadcn primitives (chat chrome)
- `components/` — app-specific composition (banner, spec viewer, chips, theme)
- `lib/agent.ts` — agent + system prompt
- `lib/render/` — json-render wiring to `@oddball/json-render-uswds`
- `lib/tools/` — 5 gov-service mock tools

See `docs/superpowers/specs/2026-04-15-uswds-playground-design.md` in the repo root for the full design rationale.

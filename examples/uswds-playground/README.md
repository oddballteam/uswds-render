# USWDS Playground

AI-powered chat playground that generates USWDS-styled government interfaces from natural-language prompts. Currently configured as a CMS / Medicare demo. An Oddball Labs product.

## Run locally

```bash
# 1. From repo root, install deps
pnpm install

# 2. Build the uswds package once (demos consume its dist/, not src)
pnpm --filter @oddball/json-render-uswds build

# 3. Copy the env template and add an API key
cp examples/uswds-playground/.env.local.example examples/uswds-playground/.env.local
# Edit .env.local — set OPENAI_API_KEY (preferred) or ANTHROPIC_API_KEY

# 4. Start the dev server
pnpm --filter uswds-playground dev
```

Open `http://localhost:3000`.

After editing anything under `packages/uswds/src/`, rebuild the package (`pnpm --filter @oddball/json-render-uswds build`) before the demo picks up the change — stale `dist/` is the most common source of "my change did not take effect" confusion here.

## How it works

The app is a fork of `json-render/examples/chat/` with targeted changes for the CMS showcase:

1. The rendering layer uses `@oddball/json-render-uswds` (catalog + components) instead of `@json-render/shadcn`.
2. The tools are nine mock CMS / Medicare functions with `snake_case` names matching `docs/example_questions.csv`:
   `search_medicare_knowledge`, `check_eligibility_basics`, `resolve_location`, `search_medicare_plans`, `search_drugs_and_dosages`, `calculate_drug_costs`, `get_saved_health_preferences`, `get_beneficiary_profile`, `find_assistance_programs`. Each returns deterministic, clearly-fictional sample data.
3. The agent prompt carries no hand-written tool index — tool selection falls out of each tool's `description` field, matching the upstream chat agent. Two inline JSONL exemplars (plan-cards grid, knowledge answer with a `Collection` of sources) anchor the spec shape. An inline-props rule and a pre-flight "no empty headings" rule minimise the two most common failure modes (broken `$state` bindings and orphaned section headings).

Five legacy VA tool files (`va-appointments`, `claim-status`, `medicare-plans`, `gi-bill`, `va-facilities`) remain on disk with tests but are commented out of the agent's tool map in `lib/agent.ts`.

The chat chrome (message bubbles, input, header) still uses vanilla shadcn primitives — separating "container UI" (shadcn) from "AI-generated UI" (USWDS).

## Provider configuration

`lib/provider.ts` picks the first configured provider:

1. `OPENAI_API_KEY` → `gpt-5.5` (Responses API) with `reasoningEffort: "medium"`.
2. `ANTHROPIC_API_KEY` → `claude-haiku-4-5-20251001`.

Optional env vars:

| Variable | Effect |
|---|---|
| `OPENAI_REASONING_EFFORT` | `"low"` / `"medium"` / `"high"` — override the default `"medium"`. `"high"` produces denser specs but adds 20–40 s per turn. |

## Observability

`app/api/generate/route.ts` assigns every request an 8-char id. Server logs prefixed `[generate <rid>]` capture provider selection, message preview, per-step tool calls with truncated inputs + outputs, token usage, and the final finish reason. SDK errors are dumped with their full shape (`responseBody`, `statusCode`, `url`, `requestBodyValues` when present). Sync failures return JSON `{ error, requestId }` so the browser surface matches the server log.

## Structure

- `app/` — Next.js App Router (`api/generate/route.ts` is the streaming endpoint).
- `components/ui/` — shadcn primitives (chat chrome).
- `components/` — app-specific composition (banner, spec viewer, suggestion chips, theme).
- `lib/agent.ts` — agent + system prompt + per-step / run-complete logging hooks.
- `lib/provider.ts` — OpenAI / Anthropic selection, reasoning-effort wiring.
- `lib/render/` — json-render wiring to `@oddball/json-render-uswds`.
- `lib/tools/` — nine CMS mock tools plus five disabled VA tool files.
- `tests/tools/` — one happy-path Vitest per tool; `tests/suggestion-chips.test.tsx` asserts the exact six CMS chips.

See `docs/superpowers/specs/2026-04-15-uswds-playground-design.md` in the repo root for the original design rationale; the CMS pivot is captured in the `feat/cms-demo` PR and in `TODO.md`.

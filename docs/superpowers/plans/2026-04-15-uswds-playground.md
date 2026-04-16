# USWDS Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Next.js AI chat playground at `examples/uswds-playground/` that generates USWDS-styled gov interfaces in real-time, using `@oddball/json-render-uswds` as the rendered-output layer.

**Architecture:** Fork `json-render/examples/chat/` (the reference chat demo in the untracked reference checkout) into our repo. Keep the chat UI chrome (shadcn primitives, streaming, message pattern). Replace the rendered-output layer (catalog + registry + system prompt + tools) with USWDS + gov-service mock tools. Add an Oddball banner, Preview/Code tab toggle, env-var-based AI provider detection, and gov-relevant suggestion chips.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind v4, Vercel AI SDK v6 (`ai` + `@ai-sdk/anthropic` + `@ai-sdk/openai` + `@ai-sdk/react`), `@json-render/core`, `@json-render/react`, `@oddball/json-render-uswds` (workspace:*), radix-ui, streamdown, next-themes, sonner, zod, vitest.

**Reference (read-only, DO NOT modify):** `json-render/examples/chat/` — the source we're forking from. Read the exact files as you implement each task to copy patterns verbatim where sensible.

**Spec:** `docs/superpowers/specs/2026-04-15-uswds-playground-design.md`

---

## File Structure

```
examples/uswds-playground/
├── app/
│   ├── api/generate/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # shadcn primitives (chat chrome only)
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   ├── oddball-banner.tsx     # "An Oddball Labs Product" banner
│   ├── spec-viewer.tsx         # Preview | Code tab toggle wrapping ExplorerRenderer
│   ├── suggestion-chips.tsx    # Empty-state gov scenario chips
│   ├── theme-toggle.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── agent.ts                # ToolLoopAgent config + gov system prompt
│   ├── provider.ts             # Env-var provider detection (Anthropic/OpenAI)
│   ├── utils.ts
│   ├── render/
│   │   ├── catalog.ts          # Thin wrapper re-exporting uswdsComponentDefinitions
│   │   └── renderer.tsx        # ExplorerRenderer (copied from fork, registry swapped)
│   └── tools/
│       ├── va-appointments.ts
│       ├── claim-status.ts
│       ├── medicare-plans.ts
│       ├── gi-bill.ts
│       └── va-facilities.ts
├── tests/
│   ├── setup.ts
│   └── tools/
│       ├── va-appointments.test.ts
│       ├── claim-status.test.ts
│       ├── medicare-plans.test.ts
│       ├── gi-bill.test.ts
│       └── va-facilities.test.ts
├── .env.local.example
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

**Responsibility boundaries:**
- `app/` — routing, page-level composition, API route.
- `components/ui/` — shadcn primitives for chat chrome only. Don't import from here in `app/api/` or `lib/`.
- `components/*.tsx` (top-level) — app-specific composition: banner, spec viewer, chips, theme.
- `lib/render/` — json-render rendering layer using `@oddball/json-render-uswds`.
- `lib/tools/` — mock gov-service tool implementations (one file per tool).
- `lib/agent.ts` — agent config + system prompt. No tool logic.
- `lib/provider.ts` — env-var provider detection only.
- `tests/tools/` — one test file per tool; schema + happy-path assertions.

---

## Foundation

### Task 1: Scaffold `uswds-playground` workspace package

**Files:**
- Create: `examples/uswds-playground/package.json`
- Create: `examples/uswds-playground/tsconfig.json`
- Create: `examples/uswds-playground/next.config.ts`
- Create: `examples/uswds-playground/postcss.config.mjs`
- Create: `examples/uswds-playground/.env.local.example`
- Create: `examples/uswds-playground/.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "uswds-playground",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "check-types": "tsc --noEmit",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@oddball/json-render-uswds": "workspace:*",
    "@json-render/core": "^0.17.0",
    "@json-render/react": "^0.17.0",
    "@json-render/shadcn": "^0.17.0",
    "@ai-sdk/anthropic": "^1.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "@ai-sdk/react": "^3.0.84",
    "ai": "^6.0.33",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.563.0",
    "next": "^15.0.0",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sonner": "^2.0.7",
    "streamdown": "^2.2.0",
    "tailwind-merge": "^3.4.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@oddball/json-render-uswds"],
};

export default nextConfig;
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 5: Create `.env.local.example`**

```
# USWDS Playground — AI provider configuration
#
# Set ONE of the following. First key found wins (Anthropic preferred).

# Claude (default, recommended)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (fallback)
# OPENAI_API_KEY=sk-proj-...
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
.next/
.env.local
*.log
```

- [ ] **Step 7: Install dependencies and verify scaffold**

From repo root:
```bash
pnpm install
```
Expected: the new workspace member is picked up. No build yet — no source files exist.

- [ ] **Step 8: Commit**

```bash
git add examples/uswds-playground pnpm-lock.yaml pnpm-workspace.yaml
git commit -m "feat(playground): scaffold uswds-playground package"
```

`pnpm-workspace.yaml` already has `examples/*` from the parent uswds plan. If not, add it.

---

### Task 2: Provider detection

**Files:**
- Create: `examples/uswds-playground/lib/provider.ts`
- Create: `examples/uswds-playground/lib/utils.ts`

- [ ] **Step 1: Create `lib/utils.ts`** (copied from the chat fork's 6-line utility)

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create `lib/provider.ts`**

```ts
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type ProviderName = "anthropic" | "openai";

export function detectProvider(): { name: ProviderName; model: LanguageModel } {
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      name: "anthropic",
      model: anthropic("claude-haiku-4-5-20251001"),
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      name: "openai",
      model: openai("gpt-4o"),
    };
  }
  throw new Error(
    "No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local. See .env.local.example.",
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0. Types for `@ai-sdk/anthropic`, `@ai-sdk/openai`, and `ai` must all resolve.

If `LanguageModel` is not exported from `ai` in the installed version, replace the return type with `ReturnType<typeof anthropic>` — the actual type name varies between AI SDK major versions. Run typecheck after the substitution; it must pass.

- [ ] **Step 4: Commit**

```bash
git add examples/uswds-playground/lib
git commit -m "feat(playground): add provider detection + cn helper"
```

---

### Task 3: Vitest setup

**Files:**
- Create: `examples/uswds-playground/vitest.config.ts`
- Create: `examples/uswds-playground/tests/setup.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 2: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add `--passWithNoTests` so the empty suite exits 0**

Edit `examples/uswds-playground/package.json`. Change:
```json
"test": "vitest run"
```
to:
```json
"test": "vitest run --passWithNoTests"
```

- [ ] **Step 4: Verify test runner**

```bash
pnpm --filter uswds-playground test
```
Expected: "No test files found", exit 0.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/vitest.config.ts examples/uswds-playground/tests/setup.ts examples/uswds-playground/package.json
git commit -m "test(playground): wire vitest"
```

---

## Chat Chrome

### Task 4: Copy shadcn UI primitives from fork

**Files:**
- Create: `examples/uswds-playground/components/ui/accordion.tsx`
- Create: `examples/uswds-playground/components/ui/alert.tsx`
- Create: `examples/uswds-playground/components/ui/badge.tsx`
- Create: `examples/uswds-playground/components/ui/button.tsx`
- Create: `examples/uswds-playground/components/ui/card.tsx`
- Create: `examples/uswds-playground/components/ui/input.tsx`
- Create: `examples/uswds-playground/components/ui/label.tsx`
- Create: `examples/uswds-playground/components/ui/progress.tsx`
- Create: `examples/uswds-playground/components/ui/radio-group.tsx`
- Create: `examples/uswds-playground/components/ui/select.tsx`
- Create: `examples/uswds-playground/components/ui/separator.tsx`
- Create: `examples/uswds-playground/components/ui/skeleton.tsx`
- Create: `examples/uswds-playground/components/ui/table.tsx`
- Create: `examples/uswds-playground/components/ui/tabs.tsx`

- [ ] **Step 1: Copy each file verbatim**

Copy each of the 14 files from `json-render/examples/chat/components/ui/<name>.tsx` to `examples/uswds-playground/components/ui/<name>.tsx` using the filesystem (not editing — literal copy).

Do NOT copy `components/ui/chart.tsx` — we're not using recharts.

The fork's files import `@/lib/utils`. Our tsconfig has `@/*` aliased to the package root, and `lib/utils.ts` exists (Task 2). So imports resolve without edits.

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0. If any shadcn file references a radix import we don't have (unlikely — the package.json includes `radix-ui`), add it and retry.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/components/ui
git commit -m "feat(playground): vendor shadcn chat-chrome primitives from fork"
```

---

### Task 5: Theme toggle + provider

**Files:**
- Create: `examples/uswds-playground/components/theme-toggle.tsx`
- Create: `examples/uswds-playground/components/theme-provider.tsx`

- [ ] **Step 1: Create `components/theme-provider.tsx`** (copy verbatim from fork)

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2: Create `components/theme-toggle.tsx`** (copy verbatim from `json-render/examples/chat/components/theme-toggle.tsx`)

Use the filesystem to copy the file. It's 36 lines; the exact content must come from the fork. After copying, verify the only imports are from `react`, `next-themes`, `lucide-react`, and `@/components/ui/button` — all of which exist.

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add examples/uswds-playground/components/theme-provider.tsx examples/uswds-playground/components/theme-toggle.tsx
git commit -m "feat(playground): add theme provider + toggle from fork"
```

---

### Task 6: Oddball banner

**Files:**
- Create: `examples/uswds-playground/components/oddball-banner.tsx`

- [ ] **Step 1: Create the banner component**

```tsx
export function OddballBanner() {
  return (
    <div className="w-full border-b border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <span>An</span>
        <a
          href="https://oddball.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
        >
          Oddball Labs
        </a>
        <span>product</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/components/oddball-banner.tsx
git commit -m "feat(playground): add Oddball Labs attribution banner"
```

---

### Task 7: Suggestion chips

**Files:**
- Create: `examples/uswds-playground/components/suggestion-chips.tsx`
- Test: `examples/uswds-playground/tests/suggestion-chips.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestionChips, SUGGESTIONS } from "../components/suggestion-chips";

describe("SuggestionChips", () => {
  it("renders all gov scenarios", () => {
    render(<SuggestionChips onSelect={() => {}} />);
    for (const s of SUGGESTIONS) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
  });

  it("calls onSelect with the chip text when clicked", () => {
    const onSelect = vi.fn();
    render(<SuggestionChips onSelect={onSelect} />);
    fireEvent.click(screen.getByText(SUGGESTIONS[0]));
    expect(onSelect).toHaveBeenCalledWith(SUGGESTIONS[0]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter uswds-playground test
```
Expected: FAIL with "Cannot find module '../components/suggestion-chips'".

- [ ] **Step 3: Create `components/suggestion-chips.tsx`**

```tsx
"use client";

export const SUGGESTIONS = [
  "Compare my current Medicare plan with Plan G",
  "Show my VA appointments from the past month",
  "Check the status of my disability claim",
  "Help me understand my GI Bill benefits remaining",
  "Find VA facilities near Portland, OR",
] as const;

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter uswds-playground test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/components/suggestion-chips.tsx examples/uswds-playground/tests/suggestion-chips.test.tsx
git commit -m "feat(playground): add gov-service suggestion chips"
```

---

## Rendering Layer

### Task 8: Catalog wrapper

**Files:**
- Create: `examples/uswds-playground/lib/render/catalog.ts`

- [ ] **Step 1: Create the catalog wrapper**

```ts
import { defineCatalog } from "@json-render/core";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";

export const playgroundCatalog = defineCatalog({
  components: uswdsComponentDefinitions,
  actions: {},
});
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

If `defineCatalog`'s signature in `@json-render/core` doesn't match (e.g., it expects `{ schema, components }` instead), inspect the fork's `lib/render/catalog.ts` line 1-30 to see the exact shape and adjust. The source of truth is the installed `@json-render/core` type definitions — not this plan.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/lib/render/catalog.ts
git commit -m "feat(playground): wire uswds catalog via defineCatalog"
```

---

### Task 9: Renderer wrapper

**Files:**
- Create: `examples/uswds-playground/lib/render/renderer.tsx`

- [ ] **Step 1: Create the renderer**

```tsx
"use client";

import { type ReactNode } from "react";
import {
  Renderer,
  type ComponentRenderer,
  type Spec,
  StateProvider,
  VisibilityProvider,
  ActionProvider,
  defineRegistry,
} from "@json-render/react";
import { uswdsComponents } from "@oddball/json-render-uswds";

const registry = defineRegistry(uswdsComponents);

function Fallback({ type }: { type: string }) {
  return (
    <div className="rounded border border-dashed border-zinc-400 p-2 text-xs text-zinc-500">
      Unknown component: <code>{type}</code>
    </div>
  );
}

const fallback: ComponentRenderer = ({ element }) => (
  <Fallback type={element.type} />
);

interface PlaygroundRendererProps {
  spec: Spec | null;
}

export function PlaygroundRenderer({ spec }: PlaygroundRendererProps): ReactNode {
  if (!spec) return null;

  return (
    <StateProvider initialState={spec.state ?? {}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer spec={spec} registry={registry} fallback={fallback} />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

If `defineRegistry` accepts a different argument shape in the installed version (e.g., requires a catalog + components object), inspect the fork's `lib/render/registry.tsx` line 1-80 to see how it's called there and mirror the pattern. Use `defineRegistry` exactly as the installed `@json-render/react` types dictate.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/lib/render/renderer.tsx
git commit -m "feat(playground): render uswds components via PlaygroundRenderer"
```

---

### Task 10: Spec viewer with Preview | Code tabs

**Files:**
- Create: `examples/uswds-playground/components/spec-viewer.tsx`

- [ ] **Step 1: Create the viewer**

```tsx
"use client";

import { useState } from "react";
import type { Spec } from "@json-render/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaygroundRenderer } from "@/lib/render/renderer";

interface SpecViewerProps {
  spec: Spec | null;
}

export function SpecViewer({ spec }: SpecViewerProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  if (!spec) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "preview" | "code")}>
        <TabsList className="w-full justify-start rounded-none border-b bg-zinc-50 px-2 dark:bg-zinc-900">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-4">
          <PlaygroundRenderer spec={spec} />
        </TabsContent>
        <TabsContent value="code" className="m-0">
          <pre className="overflow-x-auto bg-zinc-950 p-4 text-xs text-zinc-100">
            <code>{JSON.stringify(spec, null, 2)}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/components/spec-viewer.tsx
git commit -m "feat(playground): spec viewer with Preview | Code tabs"
```

---

## Mock Tools

Each tool follows the same pattern: Zod input schema, `execute()` returning a Promise of mock data, a vitest test asserting the return shape. The AI SDK's `tool()` factory from `ai` is the same one the chat fork uses (see `lib/tools/weather.ts:7`).

### Task 11: `getVAAppointments` tool

**Files:**
- Create: `examples/uswds-playground/lib/tools/va-appointments.ts`
- Test: `examples/uswds-playground/tests/tools/va-appointments.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from "vitest";
import { getVAAppointments } from "../../lib/tools/va-appointments";

describe("getVAAppointments", () => {
  it("returns past_month appointments with required fields", async () => {
    const result = await (getVAAppointments.execute as any)(
      { timeframe: "past_month" },
      { messages: [], toolCallId: "test" },
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const apt of result) {
      expect(apt).toMatchObject({
        id: expect.any(String),
        date: expect.any(String),
        provider: expect.any(String),
        facility: expect.any(String),
        type: expect.stringMatching(/telehealth|in_person/),
        department: expect.any(String),
        status: expect.any(String),
      });
    }
  });

  it("filters by type when provided", async () => {
    const result = await (getVAAppointments.execute as any)(
      { timeframe: "upcoming", type: "telehealth" },
      { messages: [], toolCallId: "test" },
    );
    for (const apt of result) {
      expect(apt.type).toBe("telehealth");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter uswds-playground test tests/tools/va-appointments.test.ts
```
Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Create `lib/tools/va-appointments.ts`**

```ts
import { tool } from "ai";
import { z } from "zod";

const ALL_APPOINTMENTS = [
  {
    id: "apt-001",
    date: "2026-03-15T10:00:00Z",
    provider: "Dr. Sarah Chen",
    facility: "VA Portland Medical Center",
    type: "in_person" as const,
    department: "Primary Care",
    status: "completed",
    notes: "Annual physical exam",
  },
  {
    id: "apt-002",
    date: "2026-03-22T14:30:00Z",
    provider: "Dr. Michael Ramirez",
    facility: "VA Portland Medical Center",
    type: "telehealth" as const,
    department: "Mental Health",
    status: "completed",
    notes: "Follow-up session",
  },
  {
    id: "apt-003",
    date: "2026-04-02T09:00:00Z",
    provider: "Dr. Lisa Park",
    facility: "VA Portland Medical Center",
    type: "in_person" as const,
    department: "Cardiology",
    status: "completed",
    notes: "Stress test results review",
  },
  {
    id: "apt-004",
    date: "2026-04-20T11:00:00Z",
    provider: "Dr. James Wilson",
    facility: "VA Portland Medical Center",
    type: "in_person" as const,
    department: "Primary Care",
    status: "scheduled",
    notes: "Routine checkup",
  },
  {
    id: "apt-005",
    date: "2026-04-28T15:00:00Z",
    provider: "Dr. Sarah Chen",
    facility: "VA Portland Medical Center",
    type: "telehealth" as const,
    department: "Primary Care",
    status: "scheduled",
    notes: "Lab results discussion",
  },
];

export const getVAAppointments = tool({
  description:
    "Get VA medical appointments for the veteran. Use timeframe='past_month' for completed visits, 'upcoming' for future ones. Optionally filter by type (telehealth or in_person).",
  inputSchema: z.object({
    timeframe: z.enum(["past_month", "upcoming"]),
    type: z.enum(["telehealth", "in_person"]).nullish(),
  }),
  execute: async ({ timeframe, type }) => {
    const status = timeframe === "past_month" ? "completed" : "scheduled";
    return ALL_APPOINTMENTS.filter((a) => {
      if (a.status !== status) return false;
      if (type && a.type !== type) return false;
      return true;
    });
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter uswds-playground test tests/tools/va-appointments.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/lib/tools/va-appointments.ts examples/uswds-playground/tests/tools/va-appointments.test.ts
git commit -m "feat(playground): add getVAAppointments mock tool"
```

---

### Task 12: `getClaimStatus` tool

**Files:**
- Create: `examples/uswds-playground/lib/tools/claim-status.ts`
- Test: `examples/uswds-playground/tests/tools/claim-status.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from "vitest";
import { getClaimStatus } from "../../lib/tools/claim-status";

describe("getClaimStatus", () => {
  it("returns a claim with timeline steps and documents", async () => {
    const result = await (getClaimStatus.execute as any)(
      {},
      { messages: [], toolCallId: "test" },
    );
    expect(result).toMatchObject({
      claimNumber: expect.any(String),
      type: expect.any(String),
      status: expect.any(String),
      filedDate: expect.any(String),
      lastUpdated: expect.any(String),
      steps: expect.any(Array),
      documents: expect.any(Array),
    });
    expect(result.steps.length).toBeGreaterThan(0);
    for (const step of result.steps) {
      expect(step).toMatchObject({
        name: expect.any(String),
        status: expect.stringMatching(/complete|current|pending/),
      });
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter uswds-playground test tests/tools/claim-status.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Create `lib/tools/claim-status.ts`**

```ts
import { tool } from "ai";
import { z } from "zod";

export const getClaimStatus = tool({
  description:
    "Get the veteran's current VA disability compensation claim status, including a timeline of review steps and required documents.",
  inputSchema: z.object({
    claimNumber: z.string().nullish(),
  }),
  execute: async ({ claimNumber }) => {
    return {
      claimNumber: claimNumber ?? "12345678",
      type: "Disability Compensation",
      status: "Evidence Gathering",
      filedDate: "2026-01-15",
      lastUpdated: "2026-04-10",
      steps: [
        { name: "Claim Received", status: "complete", date: "2026-01-15" },
        { name: "Initial Review", status: "complete", date: "2026-02-01" },
        { name: "Evidence Gathering", status: "current", date: "2026-02-15" },
        { name: "Rating Decision", status: "pending" },
        { name: "Notification", status: "pending" },
      ],
      documents: [
        { name: "DD214", status: "received" },
        { name: "Medical Records", status: "requested" },
        { name: "Service Treatment Records", status: "received" },
      ],
    };
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter uswds-playground test tests/tools/claim-status.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/lib/tools/claim-status.ts examples/uswds-playground/tests/tools/claim-status.test.ts
git commit -m "feat(playground): add getClaimStatus mock tool"
```

---

### Task 13: `compareMedicarePlans` tool

**Files:**
- Create: `examples/uswds-playground/lib/tools/medicare-plans.ts`
- Test: `examples/uswds-playground/tests/tools/medicare-plans.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from "vitest";
import { compareMedicarePlans } from "../../lib/tools/medicare-plans";

describe("compareMedicarePlans", () => {
  it("returns two plans with comparable fields", async () => {
    const result = await (compareMedicarePlans.execute as any)(
      { currentPlan: "Original Medicare", compareTo: "Plan G" },
      { messages: [], toolCallId: "test" },
    );
    expect(result.plans).toHaveLength(2);
    for (const plan of result.plans) {
      expect(plan).toMatchObject({
        name: expect.any(String),
        monthlyPremium: expect.any(String),
        deductible: expect.any(String),
        copay: expect.any(String),
        prescriptionCoverage: expect.any(Boolean),
        dentalVision: expect.any(Boolean),
        maxOutOfPocket: expect.any(String),
      });
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter uswds-playground test tests/tools/medicare-plans.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Create `lib/tools/medicare-plans.ts`**

```ts
import { tool } from "ai";
import { z } from "zod";

const CATALOG: Record<string, {
  name: string;
  monthlyPremium: string;
  deductible: string;
  copay: string;
  prescriptionCoverage: boolean;
  dentalVision: boolean;
  maxOutOfPocket: string;
}> = {
  original: {
    name: "Original Medicare (Part A & B)",
    monthlyPremium: "$174.70",
    deductible: "$257/year",
    copay: "20% after deductible",
    prescriptionCoverage: false,
    dentalVision: false,
    maxOutOfPocket: "No limit",
  },
  "plan-g": {
    name: "Medicare Plan G",
    monthlyPremium: "$145.00",
    deductible: "$257/year (Part B only)",
    copay: "$0 after deductible",
    prescriptionCoverage: false,
    dentalVision: false,
    maxOutOfPocket: "$257/year",
  },
  "plan-n": {
    name: "Medicare Plan N",
    monthlyPremium: "$115.00",
    deductible: "$257/year (Part B only)",
    copay: "$20 office / $50 ER",
    prescriptionCoverage: false,
    dentalVision: false,
    maxOutOfPocket: "$257/year + copays",
  },
  advantage: {
    name: "Medicare Advantage (Part C)",
    monthlyPremium: "$35.00",
    deductible: "$0",
    copay: "$10 primary / $45 specialist",
    prescriptionCoverage: true,
    dentalVision: true,
    maxOutOfPocket: "$4,900/year",
  },
};

function resolve(query: string) {
  const q = query.toLowerCase();
  if (q.includes("original") || q === "a" || q === "b" || q.includes("part a") || q.includes("part b")) return CATALOG.original;
  if (q.includes("plan g") || q === "g") return CATALOG["plan-g"];
  if (q.includes("plan n") || q === "n") return CATALOG["plan-n"];
  if (q.includes("advantage") || q.includes("part c")) return CATALOG.advantage;
  return CATALOG.original;
}

export const compareMedicarePlans = tool({
  description:
    "Compare two Medicare plans side by side. Accepts plan names like 'Original Medicare', 'Plan G', 'Plan N', 'Medicare Advantage'.",
  inputSchema: z.object({
    currentPlan: z.string(),
    compareTo: z.string(),
  }),
  execute: async ({ currentPlan, compareTo }) => {
    return {
      plans: [resolve(currentPlan), resolve(compareTo)],
    };
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter uswds-playground test tests/tools/medicare-plans.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/lib/tools/medicare-plans.ts examples/uswds-playground/tests/tools/medicare-plans.test.ts
git commit -m "feat(playground): add compareMedicarePlans mock tool"
```

---

### Task 14: `getGIBillBenefits` tool

**Files:**
- Create: `examples/uswds-playground/lib/tools/gi-bill.ts`
- Test: `examples/uswds-playground/tests/tools/gi-bill.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from "vitest";
import { getGIBillBenefits } from "../../lib/tools/gi-bill";

describe("getGIBillBenefits", () => {
  it("returns GI Bill entitlement + enrollment + payments", async () => {
    const result = await (getGIBillBenefits.execute as any)(
      {},
      { messages: [], toolCallId: "test" },
    );
    expect(result).toMatchObject({
      program: expect.any(String),
      eligibilityPercentage: expect.any(Number),
      totalEntitlement: expect.any(String),
      used: expect.any(String),
      remaining: expect.any(String),
      expirationDate: expect.any(String),
      currentEnrollment: expect.objectContaining({
        school: expect.any(String),
        program: expect.any(String),
        enrollmentStatus: expect.any(String),
      }),
      recentPayments: expect.any(Array),
    });
    expect(result.recentPayments.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter uswds-playground test tests/tools/gi-bill.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Create `lib/tools/gi-bill.ts`**

```ts
import { tool } from "ai";
import { z } from "zod";

export const getGIBillBenefits = tool({
  description:
    "Get the veteran's GI Bill education benefits summary: remaining entitlement, current school enrollment, and recent payment history.",
  inputSchema: z.object({
    veteranId: z.string().nullish(),
  }),
  execute: async () => {
    return {
      program: "Post-9/11 GI Bill (Chapter 33)",
      eligibilityPercentage: 100,
      totalEntitlement: "36 months",
      used: "24 months 15 days",
      remaining: "11 months 15 days",
      expirationDate: "2030-06-15",
      currentEnrollment: {
        school: "Portland State University",
        program: "Computer Science, BS",
        enrollmentStatus: "Full-time",
      },
      recentPayments: [
        { date: "2026-04-01", type: "Housing Allowance", amount: "$2,100.00" },
        { date: "2026-04-01", type: "Tuition & Fees", amount: "$4,500.00" },
        { date: "2026-03-01", type: "Housing Allowance", amount: "$2,100.00" },
        { date: "2026-03-01", type: "Tuition & Fees", amount: "$4,500.00" },
        { date: "2026-02-01", type: "Housing Allowance", amount: "$2,100.00" },
      ],
    };
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter uswds-playground test tests/tools/gi-bill.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/lib/tools/gi-bill.ts examples/uswds-playground/tests/tools/gi-bill.test.ts
git commit -m "feat(playground): add getGIBillBenefits mock tool"
```

---

### Task 15: `searchVAFacilities` tool

**Files:**
- Create: `examples/uswds-playground/lib/tools/va-facilities.ts`
- Test: `examples/uswds-playground/tests/tools/va-facilities.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, expect, it } from "vitest";
import { searchVAFacilities } from "../../lib/tools/va-facilities";

describe("searchVAFacilities", () => {
  it("returns a list of facilities with required fields", async () => {
    const result = await (searchVAFacilities.execute as any)(
      { location: "Portland, OR" },
      { messages: [], toolCallId: "test" },
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const f of result) {
      expect(f).toMatchObject({
        name: expect.any(String),
        type: expect.stringMatching(/health|benefits|cemetery/),
        address: expect.any(String),
        phone: expect.any(String),
        distance: expect.any(String),
        hours: expect.any(String),
        services: expect.any(Array),
      });
    }
  });

  it("filters by serviceType when provided", async () => {
    const result = await (searchVAFacilities.execute as any)(
      { location: "Portland, OR", serviceType: "benefits" },
      { messages: [], toolCallId: "test" },
    );
    for (const f of result) {
      expect(f.type).toBe("benefits");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm --filter uswds-playground test tests/tools/va-facilities.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Create `lib/tools/va-facilities.ts`**

```ts
import { tool } from "ai";
import { z } from "zod";

const ALL_FACILITIES = [
  {
    name: "VA Portland Medical Center",
    type: "health" as const,
    address: "3710 SW US Veterans Hospital Rd, Portland, OR 97239",
    phone: "(503) 220-8262",
    distance: "3.2 miles",
    hours: "Mon-Fri 8:00 AM - 4:30 PM",
    services: ["Primary Care", "Mental Health", "Pharmacy", "Lab"],
    waitTime: "12 days average",
  },
  {
    name: "Portland VA Regional Benefits Office",
    type: "benefits" as const,
    address: "100 SW Main St, Portland, OR 97204",
    phone: "(800) 827-1000",
    distance: "0.5 miles",
    hours: "Mon-Fri 8:00 AM - 4:00 PM",
    services: ["Disability Claims", "Education", "Home Loans", "Vocational Rehab"],
    waitTime: "Walk-in or appointment",
  },
  {
    name: "Willamette National Cemetery",
    type: "cemetery" as const,
    address: "11800 SE Mt Scott Blvd, Portland, OR 97086",
    phone: "(503) 273-5250",
    distance: "9.8 miles",
    hours: "Daily 8:00 AM - sunset",
    services: ["Burial", "Memorial Services", "Grounds"],
    waitTime: "N/A",
  },
  {
    name: "Vancouver VA Clinic",
    type: "health" as const,
    address: "1601 E 4th Plain Blvd, Vancouver, WA 98661",
    phone: "(360) 759-1901",
    distance: "11.4 miles",
    hours: "Mon-Fri 7:30 AM - 4:00 PM",
    services: ["Primary Care", "Mental Health", "Women's Health"],
    waitTime: "6 days average",
  },
];

export const searchVAFacilities = tool({
  description:
    "Search for VA facilities near a location. Optionally filter by serviceType (health, benefits, cemetery).",
  inputSchema: z.object({
    location: z.string(),
    serviceType: z.enum(["health", "benefits", "cemetery"]).nullish(),
    radius: z.number().nullish(),
  }),
  execute: async ({ serviceType }) => {
    return ALL_FACILITIES.filter((f) => {
      if (serviceType && f.type !== serviceType) return false;
      return true;
    });
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm --filter uswds-playground test tests/tools/va-facilities.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add examples/uswds-playground/lib/tools/va-facilities.ts examples/uswds-playground/tests/tools/va-facilities.test.ts
git commit -m "feat(playground): add searchVAFacilities mock tool"
```

---

### Task 16: Agent configuration

**Files:**
- Create: `examples/uswds-playground/lib/agent.ts`

- [ ] **Step 1: Create the agent**

```ts
import { ToolLoopAgent, stepCountIs } from "ai";
import { detectProvider } from "./provider";
import { playgroundCatalog } from "./render/catalog";
import { getVAAppointments } from "./tools/va-appointments";
import { getClaimStatus } from "./tools/claim-status";
import { compareMedicarePlans } from "./tools/medicare-plans";
import { getGIBillBenefits } from "./tools/gi-bill";
import { searchVAFacilities } from "./tools/va-facilities";

const SYSTEM_PROMPT = `You are a helpful assistant for US veterans and government service users.

When a user asks about their VA appointments, disability claim, Medicare plans, GI Bill benefits, or VA facilities, CALL THE APPROPRIATE TOOL to fetch the data. Then render a UI that presents the information clearly using the json-render spec format.

ALWAYS prefer rendering data as a visual UI (tables, cards, alerts, progress indicators) rather than explaining it in prose. A brief one-sentence preamble is fine, then the UI.

The UI components available to you are USWDS (US Web Design System) styled. Key components to use:

- **Table** — for appointment lists, payment history, plan comparisons. Prefer striped tables.
- **Card** — for grouping related information with a title and optional description.
- **Alert** — for important status messages. Use variant "info" for neutral, "success" for completed items, "warning" for attention-needed, "error" for problems.
- **Badge** — for inline status indicators (e.g., "completed", "scheduled", "pending").
- **Progress** — for showing percentages like GI Bill entitlement used or claim progress.
- **Stack** — for vertical/horizontal layouts with consistent gaps.
- **Grid** — for side-by-side plan comparisons.
- **Heading** — for section titles.
- **Text** — for paragraphs.
- **Link** — for outbound references to va.gov or facility websites.

Use the catalog's exact component names and prop names. Always include a top-level Stack or Card wrapping the content.

When presenting a claim, prefer an Alert summarizing the status, then a Table showing the step timeline.
When presenting appointments, prefer a Table with columns for date, provider, type, status.
When comparing Medicare plans, use a Grid of Cards or a comparison Table.
When showing GI Bill benefits, use Progress for entitlement used and a Table for recent payments.
When showing facilities, use Cards in a Stack, one Card per facility with services as Badges.`;

export function makeAgent() {
  const { model } = detectProvider();
  return new ToolLoopAgent({
    model,
    temperature: 0.7,
    instructions: [
      SYSTEM_PROMPT,
      playgroundCatalog.prompt({ mode: "inline" }),
    ].join("\n\n"),
    tools: {
      getVAAppointments,
      getClaimStatus,
      compareMedicarePlans,
      getGIBillBenefits,
      searchVAFacilities,
    },
    stopWhen: stepCountIs(5),
  });
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

If `ToolLoopAgent` or `stepCountIs` is not exported from `ai` in this major version, inspect the fork's `lib/agent.ts` (lines 1-30) for the exact import paths and match. The chat fork uses `ai@^6.0.33` — our dependencies pin the same.

If `playgroundCatalog.prompt({ mode: "inline" })` fails because the catalog object has a different API, check `@json-render/core` typings — the fork calls `explorerCatalog.prompt()` with no args on line 82 of `lib/agent.ts`; use whatever call shape is typed.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/lib/agent.ts
git commit -m "feat(playground): configure agent with gov prompt + 5 mock tools"
```

---

## API Route + Page

### Task 17: API route

**Files:**
- Create: `examples/uswds-playground/app/api/generate/route.ts`

- [ ] **Step 1: Create the route**

```ts
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { pipeJsonRender } from "@json-render/core";
import { makeAgent } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const agent = makeAgent();
  const modelMessages = convertToModelMessages(messages);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = await agent.stream({ messages: modelMessages });
      await pipeJsonRender(result.toUIMessageStream()).pipeTo(
        writer.toReadableStreamWriter(),
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

The exact imports and call shape in `ai@^6.0.33` may differ slightly from the fork's. Read `json-render/examples/chat/app/api/generate/route.ts` (62 lines total) verbatim and mirror the pipeline — especially the `pipeJsonRender(result.toUIMessageStream())` pattern on lines 45-55 of the fork. Do NOT copy the rate-limiting section (lines ~15-30 of the fork); we're skipping it.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/app/api/generate/route.ts
git commit -m "feat(playground): POST /api/generate streams via pipeJsonRender"
```

---

### Task 18: Root layout + globals.css

**Files:**
- Create: `examples/uswds-playground/app/layout.tsx`
- Create: `examples/uswds-playground/app/globals.css`

- [ ] **Step 1: Create `app/globals.css`**

```css
@import "tailwindcss";
@import "@oddball/json-render-uswds/tokens.css";

@source "../../../packages/uswds/src/**/*.tsx";
@source "../../components/**/*.tsx";
@source "../../app/**/*.tsx";

@variant dark (&:where(.dark, .dark *));

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

html, body { height: 100%; }
body {
  font-family: var(--font-sans);
  background: white;
  color: #1b1b1b;
}
.dark body {
  background: #111827;
  color: #e5e7eb;
}
```

The `@source` directives ensure Tailwind v4 scans both the vendored USWDS component classes (from the built package) and our local components.

- [ ] **Step 2: Create `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "streamdown/styles.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "USWDS Playground",
  description: "AI-generated USWDS interfaces. An Oddball Labs product.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add examples/uswds-playground/app/layout.tsx examples/uswds-playground/app/globals.css
git commit -m "feat(playground): root layout with USWDS token CSS + Tailwind sources"
```

---

### Task 19: Page (chat UI)

**Files:**
- Create: `examples/uswds-playground/app/page.tsx`

**Prerequisite reading:** before writing this task's step 1, re-read `json-render/examples/chat/app/page.tsx` in full. It's 493 lines; the segments-loop on lines 138-199 and the render loop on lines 225-276 are the load-bearing patterns. Our version is a simpler adaptation of the same structure.

- [ ] **Step 1: Create `app/page.tsx`**

```tsx
"use client";

import { useChat, type DefaultChatTransport } from "@ai-sdk/react";
import { DefaultChatTransport as ChatTransport } from "ai";
import {
  SPEC_DATA_PART_TYPE,
  type SpecDataPart,
} from "@json-render/core";
import type { Spec } from "@json-render/react";
import { useMemo, useRef } from "react";
import { Streamdown } from "streamdown";
import { OddballBanner } from "@/components/oddball-banner";
import { SpecViewer } from "@/components/spec-viewer";
import { SuggestionChips } from "@/components/suggestion-chips";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SpecSegment { kind: "spec"; spec: Spec }
interface TextSegment { kind: "text"; text: string }
type Segment = TextSegment | SpecSegment;

function segmentsFromMessage(message: { parts: any[] }): Segment[] {
  const segments: Segment[] = [];
  let buf = "";
  for (const part of message.parts) {
    if (part.type === "text") {
      buf += part.text ?? "";
    } else if (part.type === SPEC_DATA_PART_TYPE) {
      if (buf) { segments.push({ kind: "text", text: buf }); buf = ""; }
      const data = part.data as SpecDataPart["data"];
      if (data?.spec) segments.push({ kind: "spec", spec: data.spec });
    }
  }
  if (buf) segments.push({ kind: "text", text: buf });
  return segments;
}

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);
  const transport = useMemo(
    () => new ChatTransport({ api: "/api/generate" }) as unknown as DefaultChatTransport,
    [],
  );
  const { messages, sendMessage, status, setMessages } = useChat({ transport });
  const isEmpty = messages.length === 0;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ text });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <OddballBanner />
      <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-6 py-3 text-white dark:border-zinc-800">
        <div className="text-lg font-semibold">USWDS Playground</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
            Start Over
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {isEmpty ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-24">
              <h1 className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                What do you want to build?
              </h1>
              <SuggestionChips onSelect={handleSend} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((m) => {
                const segments = segmentsFromMessage(m);
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={isUser ? "flex justify-end" : "flex justify-start"}>
                    <div className={isUser ? "max-w-[80%] rounded-2xl rounded-br-md bg-sky-700 px-4 py-2 text-white" : "flex w-full max-w-[90%] flex-col gap-3"}>
                      {segments.map((seg, i) =>
                        seg.kind === "text" ? (
                          <div key={i} className="prose prose-sm dark:prose-invert max-w-none">
                            <Streamdown>{seg.text}</Streamdown>
                          </div>
                        ) : (
                          <SpecViewer key={i} spec={seg.spec} />
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          className="border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950"
          onSubmit={(e) => {
            e.preventDefault();
            const value = inputRef.current?.value ?? "";
            handleSend(value);
          }}
        >
          <div className="mx-auto flex max-w-3xl gap-2">
            <Input
              ref={inputRef}
              name="message"
              placeholder="Describe a government UI to build..."
              disabled={status === "submitted" || status === "streaming"}
              className="flex-1"
            />
            <Button type="submit" disabled={status === "submitted" || status === "streaming"}>
              Send
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

`DefaultChatTransport` in `@ai-sdk/react@^3` may come from that package directly rather than from `ai`. If typecheck fails on the transport import, open the fork's `app/page.tsx` line 1-25 and mirror its imports. The segments-loop (`segmentsFromMessage` in our version, lines ~138-199 in the fork) is the correct load-bearing pattern regardless of how transport is imported.

- [ ] **Step 3: Commit**

```bash
git add examples/uswds-playground/app/page.tsx
git commit -m "feat(playground): chat page with inline USWDS spec rendering"
```

---

### Task 20: Build + smoke test

**Files:**
- (no new files)

- [ ] **Step 1: Ensure the uswds package is built**

```bash
pnpm --filter @oddball/json-render-uswds build
```
Expected: exit 0.

- [ ] **Step 2: Type-check the whole playground**

```bash
pnpm --filter uswds-playground check-types
```
Expected: exit 0.

- [ ] **Step 3: Production build**

```bash
pnpm --filter uswds-playground build
```
Expected: Next.js build completes. One warning about no API key in env is fine during build (we only fail at request time). If the build fails because `detectProvider()` throws at build time (it should only throw at request time), move the call inside the route handler — our Task 16 version already does this via `makeAgent()`, which is called per-request.

- [ ] **Step 4: Run unit tests**

```bash
pnpm --filter uswds-playground test
```
Expected: 11 tests pass (1 suggestion-chips + 2 each for 5 tools).

- [ ] **Step 5: Commit any fixes needed from build/test**

If Task 20 revealed issues, the fix goes in a commit like `fix(playground): <what>`. If no fixes needed, skip this step.

---

### Task 21: Manual verification (recorded in a note)

**Files:**
- Create: `examples/uswds-playground/VERIFICATION.md`

- [ ] **Step 1: Start the dev server**

```bash
# In a separate terminal, after setting ANTHROPIC_API_KEY in .env.local
pnpm --filter uswds-playground dev
```

- [ ] **Step 2: Manually test each suggestion chip**

Open `http://localhost:3000`. For each of the 5 suggestion chips, click it, wait for the AI response, and verify:
- The chip text appears as a user message (right, blue).
- Tool call indicator appears (e.g., "Fetching appointments…").
- USWDS-styled output renders inline in a bordered frame.
- Toggling Preview/Code shows the JSON spec in the Code tab.
- The rendered components are styled (colors, typography, spacing) — not plain text.

- [ ] **Step 3: Write `VERIFICATION.md`**

```md
# USWDS Playground — Manual Verification Log

Date: <fill in on run>
AI Provider: <fill in — anthropic or openai>

## Suggestion chip results

| Chip | Tool called | USWDS components rendered | Styled correctly? | Notes |
|---|---|---|---|---|
| Compare Medicare | compareMedicarePlans | Table / Grid / Card | ✓ / ✗ | ... |
| VA appointments | getVAAppointments | Table / Badge | ✓ / ✗ | ... |
| Disability claim | getClaimStatus | Alert / Table / Progress | ✓ / ✗ | ... |
| GI Bill | getGIBillBenefits | Progress / Table | ✓ / ✗ | ... |
| VA facilities | searchVAFacilities | Card / Grid | ✓ / ✗ | ... |

## Known issues / follow-ups

- (list anything found)
```

Fill in the actual results.

- [ ] **Step 4: Commit**

```bash
git add examples/uswds-playground/VERIFICATION.md
git commit -m "docs(playground): manual verification log"
```

---

### Task 22: README

**Files:**
- Create: `examples/uswds-playground/README.md`

- [ ] **Step 1: Write the README**

```md
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
```

- [ ] **Step 2: Commit**

```bash
git add examples/uswds-playground/README.md
git commit -m "docs(playground): README with setup + architecture notes"
```

---

## Self-Review Notes

- **Spec coverage:**
  - Architecture / two-layer rendering → Tasks 8–10, 19 (page composes both layers).
  - AI pipeline → Task 17 (route) + Task 16 (agent).
  - Provider detection → Task 2.
  - Layout (empty state + after-response) → Task 19 (page) + Task 6 (banner) + Task 7 (chips) + Task 10 (spec viewer tabs).
  - 5 mock tools → Tasks 11–15.
  - Delta from chat fork → implicit via per-file Create tasks; no "Modify" entries because we copy primitives verbatim (Task 4) and recreate everything else.
  - File structure → mirrored in the Task files list.
  - Testing → Task 3 (setup), Tasks 11–15 (per-tool tests), Task 7 (chips test), Task 20 (smoke), Task 21 (manual).
  - Dependencies → Task 1.
- **Placeholder scan:** No `TODO`, `TBD`, "similar to Task N" with missing code, or "write tests for the above" without test code. Each tool task includes full mock data + full test code. Each component task includes full implementation.
- **Type consistency:** `playgroundCatalog` (Task 8) is consumed by `makeAgent` (Task 16). `PlaygroundRenderer` (Task 9) is consumed by `SpecViewer` (Task 10) and transitively by `app/page.tsx` (Task 19). Tool names match between `lib/tools/<name>.ts` exports, `lib/agent.ts` imports, and test files. `SUGGESTIONS` constant shape matches between `components/suggestion-chips.tsx` and its test.
- **Intentional "read the fork" instructions:** Tasks 5, 17, 19 each include a directive to read specific line ranges of the reference `json-render/examples/chat/` files. This is deliberate — Vercel AI SDK's streaming/transport API churns frequently between minor versions, and mirroring the fork's exact pattern at implementation time is more reliable than freezing a specific call shape in the plan.

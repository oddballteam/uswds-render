# USWDS Playground — Design

**Date:** 2026-04-15
**Status:** Approved for implementation planning
**Owner:** Oddball Labs

## Summary

An AI-powered chat playground that generates USWDS-styled government interfaces in real-time. Users describe a gov-service scenario in natural language; the AI calls mock tools for data, then streams a json-render spec that renders as live USWDS components inline in the chat. Built by forking the existing `json-render/examples/chat/` app and swapping the rendering layer to `@oddball/json-render-uswds`.

## Goals

- Demonstrate `@oddball/json-render-uswds` in an interactive, end-to-end AI workflow.
- Showcase gov-relevant use cases (VA appointments, Medicare plans, claims status, GI Bill benefits, facility search).
- Ship as a self-contained Next.js app at `examples/uswds-playground/` in the existing repo.

## Non-goals

- Production deployment or hosting.
- Real gov API integrations (all tools return mock data).
- Consumer-facing API key management UI (devs use `.env.local`).
- 3D or chart components (outside USWDS catalog scope).
- Rate limiting or abuse prevention.

## Architecture

### Two-layer rendering

- **Chat chrome:** shadcn/Radix UI primitives kept from the chat fork. Handles message bubbles, input bar, header, theme toggle. Not the demo's focus — just the container.
- **Rendered output:** `@oddball/json-render-uswds` catalog and components. When the AI generates a json-render spec, it renders inline in the chat as live USWDS components inside a bordered frame with Preview/Code tab toggle.

### AI pipeline

1. User types prompt in chat input.
2. `useChat()` (Vercel AI SDK) POSTs to `/api/generate`.
3. API route detects provider from env vars, creates a ToolLoopAgent.
4. Agent calls mock gov-service tools as needed, then generates a json-render spec.
5. Response streams through `pipeJsonRender()` which extracts `SpecDataPart` entries.
6. Client renders text progressively + USWDS components as specs arrive.

### Provider detection

`lib/provider.ts` checks env vars in order:
1. `ANTHROPIC_API_KEY` → `@ai-sdk/anthropic` with `claude-haiku-4-5-20251001`
2. `OPENAI_API_KEY` → `@ai-sdk/openai` with `gpt-4o`

First found wins. No key = startup error with clear message.

## Layout

### Empty state

- **Oddball banner** at very top: "An Oddball Labs Product" link to oddball.io
- **Dark header:** "USWDS Playground" title, "Start Over" button, theme toggle.
- **Center area:** "What do you want to build?" heading with suggestion chips:
  - "Compare my current Medicare plan with Plan G"
  - "Show my VA appointments from the past month"
  - "Check the status of my disability claim"
  - "Help me understand my GI Bill benefits remaining"
- **Bottom input bar:** textarea + Send button.

### After AI responds

- **User message:** right-aligned blue bubble.
- **AI response:** left-aligned with:
  - Explanatory text (streamed markdown).
  - Tool call blocks (expandable, show "Fetching appointments..." → result).
  - Rendered USWDS spec in a bordered frame:
    - **Preview tab** (default): live rendered USWDS components.
    - **Code tab:** exportable React source.
  - Collapsible "Show JSON spec" for power users.

## Mock tools (5)

### `getVAAppointments`

**Input:** `{ timeframe: "past_month" | "upcoming", type?: "telehealth" | "in_person" }`

**Returns:** Array of appointments :
```json
[{
  "id": "apt-001",
  "date": "2026-03-15T10:00:00Z",
  "provider": "Dr. Sarah Chen",
  "facility": "VA Portland Medical Center",
  "type": "in_person",
  "department": "Primary Care",
  "status": "completed",
  "notes": "Annual physical exam"
}]
```

**Showcases:** Table, Card, Badge (status), Stack.

### `getClaimStatus`

**Input:** `{ claimNumber?: string }`

**Returns:**
```json
{
  "claimNumber": "12345678",
  "type": "Disability Compensation",
  "status": "Evidence Gathering",
  "filedDate": "2026-01-15",
  "lastUpdated": "2026-04-10",
  "steps": [
    { "name": "Claim Received", "status": "complete", "date": "2026-01-15" },
    { "name": "Initial Review", "status": "complete", "date": "2026-02-01" },
    { "name": "Evidence Gathering", "status": "current", "date": "2026-02-15" },
    { "name": "Rating Decision", "status": "pending" },
    { "name": "Notification", "status": "pending" }
  ],
  "documents": [
    { "name": "DD214", "status": "received" },
    { "name": "Medical Records", "status": "requested" }
  ]
}
```

**Showcases:** Alert, Progress, Table, Badge, Card.

### `compareMedicarePlans`

**Input:** `{ currentPlan: string, compareTo: string }`

**Returns:**
```json
{
  "plans": [
    {
      "name": "Original Medicare (Part A & B)",
      "monthlyPremium": "$174.70",
      "deductible": "$257/year",
      "copay": "20% after deductible",
      "prescriptionCoverage": false,
      "dentalVision": false,
      "maxOutOfPocket": "No limit"
    },
    {
      "name": "Medicare Plan G",
      "monthlyPremium": "$145.00",
      "deductible": "$257/year (Part B only)",
      "copay": "$0 after deductible",
      "prescriptionCoverage": false,
      "dentalVision": false,
      "maxOutOfPocket": "$257/year"
    }
  ]
}
```

**Showcases:** Table (comparison), Card, Grid, Alert (recommendation).

### `getGIBillBenefits`

**Input:** `{ veteranId?: string }`

**Returns:**
```json
{
  "program": "Post-9/11 GI Bill (Chapter 33)",
  "eligibilityPercentage": 100,
  "totalEntitlement": "36 months",
  "used": "24 months 15 days",
  "remaining": "11 months 15 days",
  "expirationDate": "2030-06-15",
  "currentEnrollment": {
    "school": "Portland State University",
    "program": "Computer Science, BS",
    "enrollmentStatus": "Full-time"
  },
  "recentPayments": [
    { "date": "2026-04-01", "type": "Housing Allowance", "amount": "$2,100.00" },
    { "date": "2026-04-01", "type": "Tuition & Fees", "amount": "$4,500.00" },
    { "date": "2026-03-01", "type": "Housing Allowance", "amount": "$2,100.00" }
  ]
}
```

**Showcases:** Progress (entitlement used), Table (payments), Card, Text.

### `searchVAFacilities`

**Input:** `{ location: string, serviceType?: "health" | "benefits" | "cemetery", radius?: number }`

**Returns:**
```json
[{
  "name": "VA Portland Medical Center",
  "type": "health",
  "address": "3710 SW US Veterans Hospital Rd, Portland, OR 97239",
  "phone": "(503) 220-8262",
  "distance": "3.2 miles",
  "hours": "Mon-Fri 8:00 AM - 4:30 PM",
  "services": ["Primary Care", "Mental Health", "Pharmacy", "Lab"],
  "waitTime": "12 days average"
}]
```

**Showcases:** Card, Grid, Link, Badge, Stack.

## Delta from chat fork

### Keep

- `app/page.tsx` chat UI structure (useChat, message thread, input bar)
- `app/api/generate/route.ts` streaming pipeline (ToolLoopAgent + pipeJsonRender)
- `components/ui/*` shadcn primitives for chat chrome
- Theme toggle, dark mode, layout structure
- Message rendering pattern (text + tool blocks + inline spec)

### Replace

| File | From | To |
|---|---|---|
| `lib/render/catalog.ts` | 50+ custom component defs | `import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog"` |
| `lib/render/registry.tsx` | 974-line custom registry | `import { uswdsComponents } from "@oddball/json-render-uswds"` |
| `lib/tools/*.ts` | weather, github, crypto, HN, search | 5 gov-service mock tools |
| `lib/agent.ts` | Generic system prompt | Gov-focused prompt with USWDS catalog guidance |
| Provider setup | `@ai-sdk/gateway` | `@ai-sdk/anthropic` + `@ai-sdk/openai` with env detection |

### Add

- `components/gov-banner.tsx` — static USWDS gov banner
- `components/spec-viewer.tsx` — Preview/Code tab toggle for rendered specs
- `components/suggestion-chips.tsx` — empty-state gov scenario suggestions
- `lib/provider.ts` — env-var provider detection
- `.env.local.example` — documents `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
- `@source` directive in `globals.css` for USWDS class scanning

### Remove

- 3D components (react-three-fiber, drei)
- Charts (recharts)
- Rate limiting (Upstash Redis, rate-limit.ts)
- `@ai-sdk/gateway` dependency
- Tool files: weather.ts, github.ts, crypto.ts, hackernews.ts, search.ts

## File structure

```
examples/uswds-playground/
├── app/
│   ├── api/generate/
│   │   └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    (shadcn chat chrome)
│   ├── gov-banner.tsx
│   ├── chat-message.tsx
│   ├── spec-viewer.tsx
│   └── suggestion-chips.tsx
├── lib/
│   ├── agent.ts
│   ├── provider.ts
│   ├── render/
│   │   ├── catalog.ts
│   │   └── renderer.tsx
│   └── tools/
│       ├── va-appointments.ts
│       ├── claim-status.ts
│       ├── medicare-plans.ts
│       ├── gi-bill.ts
│       └── va-facilities.ts
├── .env.local.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Testing

- **Smoke test:** app builds (`next build`), starts (`next dev`), renders empty state.
- **Tool tests (vitest):** each mock tool returns well-formed data matching its schema.
- **Manual:** send each suggestion chip prompt, verify USWDS components render inline, verify Preview/Code toggle works.
- No e2e automation in v1.

## Dependencies

```json
{
  "@oddball/json-render-uswds": "workspace:*",
  "@json-render/core": "^0.17.0",
  "@json-render/react": "^0.17.0",
  "ai": "^6.0.0",
  "@ai-sdk/anthropic": "^1.0.0",
  "@ai-sdk/openai": "^1.0.0",
  "@ai-sdk/react": "^1.0.0",
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "next-themes": "^0.4.0",
  "streamdown": "^0.1.0",
  "tailwindcss": "^4.0.0"
}
```

Plus shadcn UI primitives copied from the chat fork (Button, Input, ScrollArea, etc. — already vendored as source files in `components/ui/`).

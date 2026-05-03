# TASKS.md

Live task tracker. Original plans preserved verbatim in `CMS_Transformation.md` and `CMS_registry_decoupling.md` — do not modify those files.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` complete · `[!]` blocked

---

## Track 1 — CMS Meta Components

### T1-1: Audit and define CMS meta component vocabulary [x]

Research `@cmsgov/ds-medicare-gov` and https://design.cms.gov/components to identify 5–8 CMS-domain composite components suitable as catalog entries. For each, document:
- Proposed catalog key (e.g., `PlanInformation`, `CoverageComparison`, `BenefitSummary`)
- Data props (names, types, required/optional)
- Visual description
- Which CMS Design System primitives it composes internally

Deliverable: a reference doc or comment block — not code yet. This vocabulary is the contract everything else builds on.

**Starting point:** `CMS_Transformation.md` contains image of `PlanInformation` as the first example.

---

### T1-2: Add Zod schemas to catalog for each meta component [x]

In `packages/uswds/src/catalog.ts`, add entries for each component defined in T1-1. Each entry needs:
- `props`: Zod schema covering all data props
- `description`: one-sentence AI guidance string
- `example`: valid example object that satisfies the schema (required for contract tests)
- Optionally `slots` if the component accepts named child regions

Run `pnpm --filter @oddball/json-render-uswds test tests/catalog.test.ts` — catalog contract test must pass (keys exist, examples validate against schemas).

---

### T1-3: Implement React adapter components for each meta component [x]

In `packages/uswds/src/components.tsx`, add a named function adapter for each new catalog entry. Each adapter must:
- Accept both json-render envelope shape `{ props, emit, children }` AND plain React props (passthrough pattern already established in file)
- Extract data props from `props` (envelope) or top-level (plain React)
- Render using `@trussworks/react-uswds` and plain JSX only — do NOT use `@cmsgov/ds-medicare-gov` here; that package is web components and belongs in Track 2
- Export and add to `uswdsComponents` record

Run `pnpm --filter @oddball/json-render-uswds test` — catalog lockstep test and envelope passthrough test must pass.

---

### T1-4: Add per-component tests for meta components [x]

In `tests/components/`, add a test file per new component (following existing pattern, e.g., `tests/components/plan-information.test.tsx`). Each test file must cover:
- Plain React prop render (smoke test)
- Axe accessibility check
- Envelope shape render (verify adapter handles `{ props: example, emit, children }`)

---

### T1-5: Update playground AI system prompt to bias toward meta components [x]

In `examples/uswds-playground/lib/agent.ts`, update the `customRules` array and `SCENARIO RECIPES` section to:
- Name each new meta component and describe when AI should emit it
- Discourage primitive composition when a meta component covers the use case
- Add at least one scenario recipe demonstrating a meta component in a plausible CMS gov-service flow

---

### T1-6: Add playground preset specs for meta components [x]

In `examples/uswds-demo/src/specs/`, add at least one new preset JSON spec demonstrating meta components in a realistic CMS scenario. This gives the demo app a concrete example and validates the full rendering pipeline end to end.

---

## Track 2 — External Web Component Catalog with Dynamic Loading

### T2-1: Audit `@cmsgov/ds-medicare-gov` and plan component mapping [x]

Do NOT install `@cmsgov/ds-medicare-gov` in `packages/uswds/` — that would bundle implementations and contradict the CDN model. Install it only in the mock CDN package (T2-3), which builds bundles from it and serves them. `packages/uswds/` must remain ignorant of specific implementations.

For this task: read `@cmsgov/ds-medicare-gov` docs and exported custom element tag names + prop/attribute interfaces (install locally or read npm/docs). Map each Track 1 meta component to the CMS Design System primitives it will compose. This mapping drives T2-3 (what the mock CDN must bundle) and T2-2 (what prop maps the envelope factory needs).

---

### T2-2: Design and implement the generic web component envelope factory [x]

Create `packages/uswds/src/web-component-envelope.ts`. This module exports a factory function, e.g.:

```ts
createWebComponentAdapter(tagName: string, propMap: PropMap): ComponentType
```

Where `PropMap` describes how json-render props translate to web component attributes vs. DOM properties vs. event listeners.

The returned component must:
- Accept the json-render envelope shape `{ props, emit, children }`
- Set attributes/properties on the custom element per `propMap`
- Bridge `emit` to custom element events per `propMap`
- Forward `children` correctly
- Be TypeScript-typed without per-component manual types

Handle the core React/web-component interop problems:
- React passes unknown props as attributes (strings only); DOM properties need `ref`-based assignment
- Custom events are not synthetic React events; need manual `addEventListener`
- SSR/jsdom: custom elements may not be defined; factory must degrade gracefully in test environment

**Loading strategy (critical — resolve before writing any adapter code):** Custom elements must be registered via `customElements.define()` before React renders them, or they render as unknown HTML tags. The factory-generated adapter is not sufficient alone — the component JS bundle must be dynamically imported first. Concrete approach: the factory should accept an optional `bundleUrl` and use a `useEffect` on mount to dynamically import it, rendering null or a placeholder until the bundle resolves and the custom element is registered. Wire this loading gate into the factory so every CDN-sourced component gets it automatically — not per-component.

**SSR boundary (critical):** Node.js cannot `import()` remote HTTP URLs — this only works in the browser. The envelope factory and every adapter it generates must be marked `"use client"` (Next.js App Router). Do not attempt to render web components server-side. The `"use client"` directive must be at the top of `web-component-envelope.ts` so all generated adapters inherit it. Verify Next.js does not attempt SSR for any component that uses the factory.

---

### T2-3: Set up mock CDN server [x]

Create a mock CDN in the repo, e.g., `packages/mock-cdn/`. It must serve:

1. **`/catalog.json`** — JSON array of component descriptors. Each descriptor has exactly four fields: `key` (string, matches catalog key), `description` (string, injected into AI prompt), `example` (object, valid example props), `bundleUrl` (string, full URL to the component's JS bundle). No prop schema — Zod stays local and is authoritative for validation. This is what the playground fetches at prompt-build time to dynamically construct the AI catalog and at render-time to load component bundles.

2. **`/components/{tagName}.js`** — web component JS bundles (or re-exports from `@cmsgov/ds-medicare-gov`) for each catalog entry.

The server should be startable with a single command and have a documented base URL (e.g., `http://localhost:4000`). The playground reads this URL from an env var (e.g., `COMPONENT_CDN_URL`).

This simulates what an external team would publish to at their leisure without touching this project.

---

### T2-4: Implement dynamic catalog fetch at prompt-build time [x]

In `examples/uswds-playground/lib/agent.ts`, replace or augment the static `uswdsComponentDefinitions` catalog with a runtime fetch from `COMPONENT_CDN_URL/catalog.json`.

Requirements:
- **`AGENT_INSTRUCTIONS` must move out of module scope.** Currently it is a top-level `const` evaluated once at import. Convert `makeAgent()` to `async function makeAgent()` and rebuild the instructions string on every call by awaiting the CDN fetch first.
- Fetch `COMPONENT_CDN_URL/catalog.json` at the start of each `makeAgent()` call (per conversation).
- Fetched catalog JSON provides description, example, and implementation pointer per component. Zod schemas remain local (source of truth for validation and type safety) — CDN does not replace them.
- Merge fetched descriptions/examples into the prompt string that was previously generated by the static `playgroundCatalog.prompt(...)` call.
- Fetch failure must degrade gracefully: fall back to static local catalog, log a warning.
- Downstream: `makeAgent()` callers in the playground route handler must be updated to `await makeAgent()`.

---

### T2-4b: Build dynamic registry from CDN catalog at render-time [x]

T2-4 handles the AI prompt side. This task handles the renderer side — both must stay in sync or the AI emits a component keyword the renderer doesn't know about.

**Architecture (Option B):** `packages/uswds/src/components.tsx` contains only static Truss primitive adapters. CDN-sourced meta components are never added there — the playground's dynamic registry builder owns them entirely. `components.tsx` stays ignorant of CDN and web components.

In `examples/uswds-playground/lib/render/catalog.ts` (where `defineRegistry` is called), replace the static `uswdsComponents` import with an async runtime registry builder:

- Fetch `COMPONENT_CDN_URL/catalog.json`
- For each entry in the fetched catalog, call the envelope factory from T2-2 with `{ tagName, bundleUrl }` to produce a factory-generated adapter
- Merge these factory adapters with the static `uswdsComponents` import (Truss base primitives) — CDN entries take precedence on key conflict
- Pass merged result to `defineRegistry`
- Store the built registry in React state; render `null` until ready

The registry-ready check is the concrete render gate: add a `registryReady: boolean` flag (alongside the existing `isRenderable()` spec guard in `renderer.tsx`). Renderer does not mount until both `isRenderable()` AND `registryReady` are true.

Fetch failure: fall back to static `uswdsComponents` only (base primitives), log warning — same pattern as T2-4 prompt fallback.

---

### T2-5: Remove meta component React implementations from `components.tsx` [x]

For each meta component added in Track 1:
- Remove the React implementation from `packages/uswds/src/components.tsx`
- Remove its entry from the `uswdsComponents` record
- Do NOT add a factory call in its place — factory-generated adapters are built at runtime in T2-4b's dynamic registry builder, not in this file

After removal, `packages/uswds/src/components.tsx` should contain only static Truss primitive adapters. The catalog lockstep test (`tests/catalog.test.ts`) will fail after this step — that test is deleted in T2-6, not fixed. Do not attempt to restore lockstep; CDN is now the authoritative implementation source.

The CDN catalog entry (from T2-3) provides `tagName` and `bundleUrl` for each removed component. T2-4b's builder uses these to generate the adapter at runtime. Custom element bundle loading is handled by the factory's built-in gate (T2-2) — no additional wiring needed here.

---

### T2-6: Replace static lockstep test; update envelope and component tests [x]

**Delete `tests/catalog.test.ts` entirely.** The static lockstep test (`uswdsComponents` keys === `uswdsComponentDefinitions` keys) is a pre-CDN artifact. After Track 2, CDN is the authoritative source for component implementations — a static registry check no longer makes sense.

Replace it with a new test that verifies the dynamic registry builder:
- Mock the CDN catalog fetch to return a fixture matching `uswdsComponentDefinitions` keys
- Call the dynamic registry builder from T2-4b
- Assert it produces an adapter for every key in `uswdsComponentDefinitions`
- Assert every `example` in `uswdsComponentDefinitions` still validates against its Zod schema (schema validation contract survives)

Update `tests/envelope.test.tsx` for web component adapters:
- jsdom does not support custom elements or dynamic `import()` of remote URLs; mock both `customElements.define` and the bundle fetch
- Verify envelope shape `{ props: example, emit, children }` works through factory-generated adapters
- Per-component tests in `tests/components/` that tested React implementations removed in T2-5 should be deleted; CDN component behavior is tested via the dynamic registry builder test above

---

### T2-7: Document CDN contract [x]

Add a short spec (could be a README in `packages/mock-cdn/`) defining:
- The required shape of `catalog.json` (what fields, what format)
- The expected module format for component bundles (ESM, custom element class, registration pattern)
- How to add a new component (what an external team must publish and in what format)

This is the contract another team would implement against.

---

## Registry Decoupling — CMS_registry_decoupling.md

### RD-1: Remove CDN meta component entries from `packages/uswds/src/catalog.ts` [x]

Delete `PlanInformation`, `AppointmentCard`, `ClaimStatusTimeline`, `BenefitSummary`, `FacilityCard` from `uswdsComponentDefinitions`. After removal, `uswdsComponentDefinitions` has 48 entries (Truss primitives only).

**Validation:** `pnpm --filter @oddball/json-render-uswds test` passes. No reference to the five removed keys remains in `packages/uswds/`.

---

### RD-2: Update `packages/uswds/tests/schema.test.ts` [x]

Reconcile counts and any direct key references after RD-1 removes 5 entries. No new tests — just fix what breaks.

**Validation:** `pnpm --filter @oddball/json-render-uswds test` passes, all green.

---

### RD-3: Build dynamic extended catalog inside `buildRegistry()` [x]

In `examples/uswds-playground/lib/render/registry.ts`:
- Import `defineCatalog` from `@json-render/core` and `schema` from `@json-render/react/schema`
- After fetching CDN entries, generate `{ props: z.record(z.unknown()), description, example }` per entry
- Build `extendedCatalog = defineCatalog(schema, { components: { ...uswdsComponentDefinitions, ...cdnDefs }, actions: {} })`
- Pass `extendedCatalog` to `defineRegistry` (not `playgroundCatalog`)
- CDN-down fallback uses `playgroundCatalog` (48 primitives only)
- Remove `playgroundCatalog` import from `registry.ts`

**Validation:** `pnpm --filter uswds-playground typecheck` passes.

---

### RD-4: Update `examples/uswds-playground/tests/registry-builder.test.ts` [x]

Add test: a CDN entry whose key is NOT in `uswdsComponentDefinitions` still appears in the built registry. This is machine-verifiable proof of the decoupling goal.

**Validation:** `pnpm --filter uswds-playground test tests/registry-builder.test.ts` passes including the new test.

---

### RD-5: Full test suite green [x]

`pnpm -r test` passes. `pnpm -r typecheck` passes.

---

### RD-6: Manual end-to-end validation [ ]

Start playground + mock CDN. Add a new component entry to mock CDN `catalog.json` and `components/` only — zero changes to `examples/uswds-playground/` or `packages/uswds/`. Reload page. Ask AI to render it. Confirm it appears.

**Validation:** Component renders with no code change to the render application.

---

## Registry Decoupling Fixes — CMS_registry_decoupling.md § Fixes

### RDF-1: Add `propDescriptions` to `CdnEntry` type and `catalog.json` [x]

Add optional `propDescriptions?: Record<string, string>` to the `CdnEntry` type. Update `packages/mock-cdn/catalog.json` with field-level hints for all 5 components (only non-obvious fields: enum values, formats, ranges).

**Validation:** `catalog.json` valid JSON. `CdnEntry` type updated.

---

### RDF-2: Extract shared `CdnEntry` type to `lib/cdn-types.ts` [x]

Create `examples/uswds-playground/lib/cdn-types.ts` — type-only file, no runtime code, no `"use client"`. Move `CdnEntry` there. Update imports in `agent.ts` and `registry.ts`.

**Validation:** `pnpm --filter uswds-playground typecheck` passes. No duplicate `CdnEntry` definitions remain.

---

### RDF-3: Extend `buildCdnSection()` to format `propDescriptions` [x]

Add a `Props:` line per entry when `propDescriptions` is present. Omit when absent (backwards compatible). Format: `Props: fieldName (hint) · fieldName (hint)`.

**Validation:** `agent.test.ts` updated and passing.

---

### RDF-4: Add `buildCdnRules(entries)` — dynamic CDN rules block [x]

New exported pure function. Generates "CDN components accept no children" rule with key list derived from `entries.map(e => e.key)`. Returns `""` when entries empty.

**Validation:** Unit tested. Keys derived from entries not hardcoded. Empty → `""`.

---

### RDF-5: Add `buildCdnScenarios(entries)` — dynamic scenario recipes [x]

New exported pure function. Generates one recipe per entry from first sentence of `description`. Returns `""` when entries empty.

**Validation:** Unit tested. First sentence of each description present in output. Empty → `""`.

---

### RDF-6: Update `makeAgent()` — wire new functions, strip hardcoded names [x]

Wire `buildCdnRules()` and `buildCdnScenarios()` into instructions. Remove `SCENARIO RECIPES` section and the hardcoded-name `customRules` entry from `STATIC_INSTRUCTIONS`.

**Validation:** `STATIC_INSTRUCTIONS` contains none of `PlanInformation`, `AppointmentCard`, `ClaimStatusTimeline`, `BenefitSummary`, `FacilityCard` as string literals.

---

### RDF-7: Document object prop limitation in `packages/mock-cdn/README.md` [x]

Add "Prop value constraints" section: primitives only, `String(value)` coercion, JSON workaround for structured data.

**Validation:** README updated.

---

### RDF-8: Update `agent.test.ts` for new functions [x]

Update `buildCdnSection` tests for `Props:` line. Add tests for `buildCdnRules` and `buildCdnScenarios`.

**Validation:** `pnpm --filter uswds-playground test` passes.

---

### RDF-9: Full suite green [x]

`pnpm -r test` passes. `pnpm --filter uswds-playground typecheck` passes.

---

## Polish Fixes

### PF-1: Fix fragile sentence split in `buildCdnScenarios` [x]

Change `e.description.split(".")[0]` to `e.description.split(/\.\s/)[0]`. Splits on period-then-whitespace, so abbreviations like `"Dr."` or `"e.g."` don't truncate mid-word. Document the sentence convention in `packages/mock-cdn/README.md`.

**Validation:** Existing `buildCdnScenarios` tests still pass. Add test: description containing `"Dr. Smith"` abbreviation does not truncate at `"Dr"`.

---

### PF-2: Remove dead `CdnEntry` re-export from `registry.ts` [x]

`export type { CdnEntry }` in `registry.ts` is unused — nothing imports `CdnEntry` from there. Remove it.

**Validation:** `pnpm --filter uswds-playground typecheck` passes. `grep "from.*registry" tests/` shows no `CdnEntry` import.

---

### PF-3: Move `CdnEntry` import in tests to canonical source [x]

Update `agent.test.ts` to import `CdnEntry` from `@/lib/cdn-types` instead of `@/lib/agent`. Remove the `export type { CdnEntry }` re-export from `agent.ts` — it only exists to support the stale test import.

**Validation:** `pnpm --filter uswds-playground test` passes. `agent.ts` no longer re-exports `CdnEntry`.

---

### PF-4: Full suite green [x]

`pnpm -r test` passes. `pnpm --filter uswds-playground typecheck` passes.

---

## CDN Component Selection Fix

### CF-1: CDN components excluded from AVAILABLE COMPONENTS list [x]

**Root cause:** `generatePrompt` (from `@json-render/core`) emits `"ONLY use component types from the AVAILABLE COMPONENTS list below"` and lists only the components registered in the catalog passed to `.prompt()`. `playgroundCatalog` was built from `uswdsComponentDefinitions` (48 Truss primitives only). CDN components were appended as separate text sections AFTER the `playgroundCatalog.prompt()` call — outside the AVAILABLE COMPONENTS list — so the model correctly obeyed the restriction and never emitted them.

**Fix:** `makeAgent()` now builds `extendedCatalog = defineCatalog(schema, { ...uswdsComponentDefinitions, ...cdnDefs })` using live CDN entries and calls `extendedCatalog.prompt()` instead of `playgroundCatalog.prompt()`. CDN components now appear inside AVAILABLE COMPONENTS (count goes from 48 to 48+N). `buildCdnSection`/`buildCdnRules`/`buildCdnScenarios` remain as supplementary preference/usage guidance appended after the catalog section.

**Validation:** `pnpm --filter uswds-playground typecheck` and `pnpm --filter uswds-playground test` pass. CDN entries visible in server log. Agent emits CDN component types in spec output.

---

### CF-2: CDN components not prioritised hard enough over primitives [x]

Even after CF-1 added CDN components to AVAILABLE COMPONENTS, the agent still defaulted to primitives in some responses. Three competing signals pulled it toward primitives:

1. `STATIC_INSTRUCTIONS` had unconditional positive rules: `"Use Card to group related information"`, `"Use Badge for inline status pills"`, `"Use Text for paragraphs and labels"`.
2. `cdnDefs` description used the CDN team's soft `"Prefer over Card+Text"` language.
3. The CDN override `customRule` was last in the rules array.

**Fix — three changes in `agent.ts`:**
- Added `COMPONENT PRIORITY` block to `STATIC_INSTRUCTIONS`: "CDN components are ALWAYS the first choice."
- Qualified primitive rules with `"ONLY when no CDN component covers the domain"`.
- Prefixed `cdnDefs` description with `"ALWAYS USE FOR THIS DOMAIN — NEVER substitute Card/Badge/Text: "` (strips CDN team's soft "Prefer over" language).
- Moved CDN override `customRule` to first position in the array.

**Validation:** Agent consistently selects CDN components for their respective domains before falling back to primitives.

---

## Bug Fixes

### BF-1: `<div>` inside `<table>` hydration crash [x]

**Symptom:** React hydration error — `"In HTML, <div> cannot be a child of <table>"`. Occurred when agent placed a `Section` (renders `<div>`) inside a `Table` element.

**Root cause:** `Table` adapter in `packages/uswds/src/components.tsx` was passing `{children}` through to `<TrussTable>` which wraps them in `<table>`. Any child that renders a block element causes invalid HTML.

**Fix:**
- `Table` adapter (`components.tsx`): renamed `children` to `_children`, self-closes `<TrussTable />` — never passes children to the underlying `<table>`.
- Prompt rule in `agent.ts`: `"Table MUST have an empty children array []. Any child will cause a hydration crash."` — explicit consequence so model avoids it.
- `tests/components/table.test.tsx`: replaced `"renders table children"` test with `"drops children — Table renders no arbitrary child elements"` to document and enforce the new behaviour.

**Files changed:** `packages/uswds/src/components.tsx`, `packages/uswds/tests/components/table.test.tsx`, `examples/uswds-playground/lib/agent.ts`.

**Validation:** `pnpm -r test` passes (376 total). Hydration error no longer occurs when agent emits children on Table.

---

### BF-2: Orphaned elements silently not rendered [x]

**Symptom:** Elements defined in the `elements` map but not referenced in any parent's `children` array render silently — user sees nothing with no error. Observed when agent produced `key-differences` card that never appeared.

**Root cause:** json-render only traverses elements reachable from `root` via the children chain. Orphaned elements are legal JSON but dead.

**Fix:** Added prompt rule to `agent.ts`: "Every key in the elements map MUST appear in exactly one parent's children array. Elements not referenced in any children array are orphaned and will never render — verify every element key is reachable from root via the children chain."

**Files changed:** `examples/uswds-playground/lib/agent.ts`.

**Validation:** Model now verifies reachability before emitting spec.

---

## CDN Component Updates

### UC-1: Extend `PlanInformation` with cost summary props [x]

See `docs/Update_CDN.md` for full detail.

**Summary:** `cms-plan-information.js` and `catalog.json` extended with four new optional props: `monthlyPremium`, `annualDeductible`, `coinsuranceAfterDeductible`, `outOfPocketMax`. Component renders a "Cost summary" section when any cost prop is present; hidden when all omitted (backwards compatible). Agent now populates all cost fields inside `PlanInformation` blocks instead of generating a separate `GridContainer` of `Text` elements.

**Files changed:** `packages/mock-cdn/components/cms-plan-information.js`, `packages/mock-cdn/catalog.json`. Zero render-app changes.

---

## Bug Fixes (continued)

### BF-3: Grid layout missing required row wrapper [x]

**Symptom:** Agent emits `GridContainer → Grid(col=N)` without an intermediate `Grid(row=true)`, causing column elements to stack vertically instead of laying out side-by-side. In some cases the section appeared not to render at all (orphan element).

**Root cause:** The `Grid(row=true) → Grid(col=N)` pattern was only mentioned inside the Table rule as a remediation example, not as a standalone constraint. Model did not apply it to general Grid layout.

**Fix:** Added explicit Grid layout rule to `customRules` in `agent.ts`: "Grid layout requires THREE layers: GridContainer → Grid(row=true) → Grid(col=N). NEVER skip the row Grid — placing Grid(col=N) as a direct child of GridContainer omits the flex container and columns will stack vertically instead of side by side."

**Files changed:** `examples/uswds-playground/lib/agent.ts`.

**Validation:** Model now emits correct three-layer Grid structure for multi-column layouts.

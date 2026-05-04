# CMS Registry Decoupling

## Overview

Remove the tight coupling between the render application and CDN component schemas. Today, adding a new CDN component to the external CDN requires a Zod schema entry in `packages/uswds/src/catalog.ts` before the renderer will surface it — a code change and deploy to this repo. After this work, the CDN is the sole authority for CDN components: an external team publishes a new component to the CDN, and the playground picks it up automatically with no code change here.

**The gap being closed:** `buildRegistry()` calls `defineRegistry(playgroundCatalog, ...)`. `playgroundCatalog` is built statically from `uswdsComponentDefinitions` at module load. If a CDN component's key is not in `uswdsComponentDefinitions`, `defineRegistry` never surfaces it — the adapter exists in memory but the renderer treats the type as unknown and drops it. This forces a local schema entry for every CDN component, coupling this repo's deploy cycle to the CDN team's deploy cycle.

**What does NOT change:**
- The agent already learns about CDN components dynamically from `fetchCdnCatalog()` at request time — no change needed there.
- `packages/uswds/src/components.tsx` stays Truss-primitives-only — no CDN adapters go there.
- `examples/uswds-playground/lib/render/catalog.ts` / `playgroundCatalog` stays as 48 Truss primitives. It is no longer used to drive the agent prompt — see CF-1 below.

---

## Key Concepts

**Two uses of `playgroundCatalog`:** It currently serves two purposes — (1) generating the agent system prompt via `.prompt()`, and (2) as the catalog for `defineRegistry`. After this change, purpose 1 is unchanged. Purpose 2 switches to a dynamically-extended catalog built inside `buildRegistry()`.

**Dynamic catalog extension:** Inside `buildRegistry()`, after fetching CDN entries, generate a permissive Zod definition for each CDN component (`z.record(z.unknown())`) and merge it with `uswdsComponentDefinitions`. Call `defineCatalog` with this merged set, then pass that extended catalog to `defineRegistry`. CDN components are now recognized by the renderer without any static schema.

**Permissive Zod schema for CDN components:** CDN components use `z.record(z.unknown())` as their props schema — accepts any key/value. The CDN's `catalog.json` `example` field provides the agent with concrete props to emit. Runtime prop correctness is the web component's own responsibility; Zod validation here is only a gate against malformed specs.

**Single source of truth per concern:**
- Truss primitive schemas → `packages/uswds/src/catalog.ts` (unchanged)
- CDN component descriptions, examples, and implementations → CDN's `catalog.json` (external)
- Agent prompt coverage of CDN components → `buildCdnSection()` in `agent.ts` (unchanged)

---

## Task List

---

### T1 — Remove CDN meta component entries from `packages/uswds/src/catalog.ts`

Delete the five entries added in Track 1 of CMS_Transformation — `PlanInformation`, `AppointmentCard`, `ClaimStatusTimeline`, `BenefitSummary`, `FacilityCard` — from `uswdsComponentDefinitions` in `packages/uswds/src/catalog.ts`.

These schemas were added as a temporary coupling while Track 2 was being built. The CDN's `catalog.json` now carries `description` and `example` for each component, which is sufficient for both the agent and the dynamic catalog extension. Keeping them in `uswdsComponentDefinitions` would contradict the decoupling goal — they would pin the Zod schema to this repo even after the CDN team changes the component's prop surface.

After removal, `uswdsComponentDefinitions` has 48 entries (Truss primitives only).

**Validation:** `pnpm --filter @oddball/json-render-uswds test` passes. No reference to the five removed keys should remain in `packages/uswds/`.

---

### T2 — Update `packages/uswds/tests/schema.test.ts`

After T1, the schema test may reference the five removed entries directly or have counts that assumed 53 components. Audit and update so tests reflect the new 48-component `uswdsComponentDefinitions`. No new tests needed — just reconcile with the removal.

**Validation:** `pnpm --filter @oddball/json-render-uswds test` passes with all tests green.

---

### T3 — Build a dynamic extended catalog inside `buildRegistry()`

In `examples/uswds-playground/lib/render/registry.ts`:

1. Add imports: `defineCatalog` from `@json-render/core`, `schema` from `@json-render/react/schema`, `uswdsComponentDefinitions` from `@oddball/json-render-uswds/catalog`.

2. After fetching CDN entries, generate a definition for each:
   ```ts
   const cdnDefs = Object.fromEntries(
     cdnEntries.map((e) => [
       e.key,
       { props: z.record(z.unknown()), description: e.description, example: e.example },
     ])
   );
   ```

3. Build an extended catalog with merged definitions:
   ```ts
   const mergedDefs = { ...uswdsComponentDefinitions, ...cdnDefs };
   const extendedCatalog = defineCatalog(schema, { components: mergedDefs, actions: {} });
   ```

4. Pass `extendedCatalog` (not `playgroundCatalog`) to `defineRegistry`:
   ```ts
   const { registry } = defineRegistry(extendedCatalog, {
     components: merged as unknown as Components<typeof extendedCatalog>,
     actions: {},
   });
   ```

5. When CDN is unavailable (`cdnAvailable=false`), fall back to `playgroundCatalog` for `defineRegistry` — same behavior as today, base primitives only.

6. Remove the `playgroundCatalog` import from `registry.ts` — it is no longer used here. `catalog.ts` / `playgroundCatalog` remains used only by `agent.ts` for prompt generation.

**Validation:** `pnpm --filter uswds-playground typecheck` passes. The `as unknown as Components<...>` cast is expected — the dynamic merged type cannot be statically narrowed.

---

### T4 — Update `examples/uswds-playground/tests/registry-builder.test.ts`

Add a test that proves the decoupling goal: a CDN component key that is NOT in `uswdsComponentDefinitions` still appears in the built registry.

Concretely: mock the CDN catalog to return an entry whose key (`"NewCdnWidget"`) does not exist in `uswdsComponentDefinitions`. Call `buildRegistry()`. Assert that `registry["NewCdnWidget"]` is defined.

This test is the machine-verifiable proof that an external team can add a new CDN component with zero changes to this repo and have it render.

**Validation:** `pnpm --filter uswds-playground test tests/registry-builder.test.ts` passes. The new test must be in the passing set.

---

### T5 — Verify end-to-end: add a new component to mock CDN only

Manual validation step — not a code change. Start the playground (`pnpm --filter uswds-playground dev`) and the mock CDN (`node packages/mock-cdn/server.mjs`). Add a new entry to the mock CDN's `catalog.json` and a corresponding JS web component file without touching any file in `examples/uswds-playground/` or `packages/uswds/`. Reload the page. Ask the playground AI to render the new component. Confirm it appears.

This is the acceptance test for the entire plan. If it works, the decoupling is real.

**Validation:** Component renders from AI-generated spec without any code change to the render application.

---

## Acceptance Criteria

- `uswdsComponentDefinitions` in `packages/uswds/src/catalog.ts` contains 48 entries (Truss primitives only — no CDN meta component schemas).
- `pnpm -r test` passes (360+ tests, all green).
- `pnpm -r typecheck` passes.
- A new component added to the mock CDN's `catalog.json` and `components/` directory — with no other changes — renders correctly in the playground.
- `registry-builder.test.ts` includes a test asserting a CDN-only key (not in `uswdsComponentDefinitions`) is present in the built registry.

---

## Files Changed

| File | Change |
|------|--------|
| `packages/uswds/src/catalog.ts` | Remove 5 CDN meta component entries |
| `packages/uswds/tests/schema.test.ts` | Reconcile counts and references after removal |
| `examples/uswds-playground/lib/render/registry.ts` | Dynamic catalog extension; remove `playgroundCatalog` import |
| `examples/uswds-playground/tests/registry-builder.test.ts` | Add CDN-only-key registry presence test |

Files NOT changed: `catalog.ts` (playground), `renderer.tsx`, `web-component-envelope.ts`, `components.tsx`, `mock-cdn/`.

> **Note:** `agent.ts` was subsequently changed by CF-1 and CF-2 below — the table above reflects only the registry decoupling scope.

---

## Fixes

### Theory

Three residual coupling problems remain after the registry decoupling work above.

---

**Fix 2 — Agent prompt hardcodes CDN component names**

`STATIC_INSTRUCTIONS` in `agent.ts` names `PlanInformation`, `AppointmentCard`, `ClaimStatusTimeline`, `BenefitSummary`, `FacilityCard` in two places:

1. `SCENARIO RECIPES` — usage patterns per component
2. `customRules[8]` — `"CDN components (PlanInformation, AppointmentCard, ...) accept no children"`

When a new CDN component is added, both must be hand-edited. This is the same coupling problem that motivated the registry decoupling, just on the prompt side.

The fix: the render app derives all CDN-specific prompt guidance automatically from the CDN catalog entries it fetches at runtime. The CDN team provides component metadata; the render app translates that metadata into agent instructions. CDN teams should not need to understand agent prompt engineering.

Three new pure functions replace the hardcoded sections:

- `buildCdnSection(entries)` — already exists; extended to include per-field prop hints (see Fix 3)
- `buildCdnRules(entries)` — generates the "CDN components accept no children" rule with the actual key list derived from `entries.map(e => e.key)`. No hardcoding.
- `buildCdnScenarios(entries)` — generates scenario recipes from `entries`. Each entry's `description` field already says "Prefer over Card+Text for X display" — the render app extracts the first sentence and formats: `"[description first sentence] → use **[key]**"`. Fully automatic, zero hardcoding.

`STATIC_INSTRUCTIONS` retains only domain-agnostic instructions: WORKFLOW, primitive RULES (Alert/Card/Badge/etc.), and the universal flat-tree / no-repeat rules that apply to all specs regardless of CDN content.

---

**Fix 3 — Field-level prop guidance lost from Zod `.describe()` strings**

The old Zod schemas in `uswdsComponentDefinitions` had `.describe()` on each field: `"Active step 1–5: 1=Received, 2=Review, 3=Evidence, 4=Rating, 5=Decision"`. This appeared in `playgroundCatalog.prompt()` output. After removing those schemas the agent only sees `example` — no per-field hints.

The fix: add `propDescriptions: Record<string, string>` to CDN catalog entries in `catalog.json`. This is component metadata, not prompt guidance — the CDN team describes their props (allowed values, format, e.g. `"in_person | telehealth"`). The render app formats those descriptions into the prompt via `buildCdnSection()`.

The CDN catalog shape gains one optional field per entry:
```json
"propDescriptions": {
  "appointmentType": "in_person | telehealth",
  "status": "scheduled | completed | cancelled",
  "currentStepNumber": "1–5: 1=Received, 2=Review, 3=Evidence, 4=Rating, 5=Decision"
}
```

`buildCdnSection()` formats these alongside the example:
```
Props: appointmentType (in_person | telehealth) · status (scheduled | completed | cancelled) · ...
```

Field-level guidance is restored. The render app owns the formatting; the CDN team owns the content.

---

**Fix 4 — Object/array props silently corrupted by `String(value)` coercion**

The envelope factory calls `el.setAttribute(attr, String(value))` for every prop. Objects stringify to `"[object Object]"`, arrays to `"item1,item2"`. This is not a bug — DOM attributes are strings and this is correct for primitive props. But it is a sharp edge that will surprise CDN component authors who try to pass structured data.

The fix is documentation, not code. `packages/mock-cdn/README.md` should state:
- All prop values passed from the spec must be string, number, or boolean
- Object/array props are not supported through the attribute channel
- If a component needs structured data, serialize to a JSON string in the spec and parse in the component's `attributeChangedCallback`

---

**Fix 1 (bonus) — `CdnEntry` type duplicated in `agent.ts` and `registry.ts`**

Identical type declared independently in two files. Since `registry.ts` is `"use client"` and `agent.ts` is a server module, they cannot import from each other. A neutral type-only file `lib/cdn-types.ts` (no `"use client"`, no runtime code) can be imported by both — TypeScript types are erased at build time and cross the client/server boundary freely.

---

### Task List

---

#### RDF-1: Add `propDescriptions` to CDN catalog shape and populate `catalog.json`

Add the optional field `propDescriptions?: Record<string, string>` to the `CdnEntry` type. Update `packages/mock-cdn/catalog.json` to include `propDescriptions` for all five components, carrying the field-level hints that were previously in Zod `.describe()` strings.

Only include fields where the hint is non-obvious (e.g., `appointmentType: "in_person | telehealth"`, `currentStepNumber: "1–5: 1=Received 2=Review 3=Evidence 4=Rating 5=Decision"`). Omit fields whose name is self-explanatory (e.g., `notes`, `phone`).

**Validation:** `catalog.json` is valid JSON. Mock CDN serves the updated shape. `CdnEntry` type updated in `agent.ts` and `registry.ts` (or in `lib/cdn-types.ts` if RDF-2 done first).

---

#### RDF-2: Extract shared `CdnEntry` type to `lib/cdn-types.ts`

Create `examples/uswds-playground/lib/cdn-types.ts` — a type-only file with no runtime code and no `"use client"` directive. Move `CdnEntry` there. Update imports in `agent.ts` and `registry.ts`.

**Validation:** `pnpm --filter uswds-playground typecheck` passes. No duplicate type definitions remain.

---

#### RDF-3: Extend `buildCdnSection()` to format `propDescriptions`

Update the per-entry block to include a `Props:` line when `propDescriptions` is present:

```
**AppointmentCard** (use "type": "AppointmentCard"):
VA appointment summary card. Shows provider, facility, date/time, type badge, and status.
Props: appointmentType (in_person | telehealth) · status (scheduled | completed | cancelled) · ...
Example: {"providerName":"Dr. Sarah Chen",...}
```

When `propDescriptions` is absent or empty, omit the `Props:` line — backwards compatible with CDN components that don't provide it.

**Validation:** `agent.test.ts` updated and passing. `buildCdnSection` output verified to include prop hints when present and omit them when absent.

---

#### RDF-4: Add `buildCdnRules(entries)` — dynamic CDN rules block

New exported pure function. When `entries` is non-empty, generates:

```
CDN COMPONENT RULES (apply to AppointmentCard, PlanInformation, ...):
- Accept no children — all data in props only.
- For lists: emit one element per data item as a flat sibling in elements, with all data inlined in props and a unique key per item (e.g. 'apt-001', 'apt-002'). Add all keys to the parent Section's children array.
- The type field must exactly match the catalog key — NEVER the HTML tag name.
- NEVER use repeat, $item, or $template bindings.
```

The component name list `(AppointmentCard, PlanInformation, ...)` is `entries.map(e => e.key).join(', ')` — derived dynamically, never hardcoded.

Returns empty string when `entries` is empty (CDN down) — no orphaned rules reference non-existent components.

**Validation:** Unit tested. Empty input → `""`. Non-empty input → contains all entry keys, contains required rules.

---

#### RDF-5: Add `buildCdnScenarios(entries)` — dynamic scenario recipes

New exported pure function. Derives one scenario recipe per CDN entry from `description` (first sentence only — everything before the first `.`):

```
CDN SCENARIO RECIPES — match user intent to the right CDN component:
- Medicare plan summary panel → use **PlanInformation**
- VA appointment summary card → use **AppointmentCard**
- VA claim status timeline → use **ClaimStatusTimeline**
- GI Bill / benefit entitlement summary panel → use **BenefitSummary**
- VA facility locator card → use **FacilityCard**
```

Returns empty string when `entries` is empty.

**Validation:** Unit tested. First sentence of description used as the recipe trigger. All keys present in output. Empty input → `""`.

---

#### RDF-6: Update `makeAgent()` — wire new functions, strip hardcoded names

In `makeAgent()`:
- Call `buildCdnRules(cdnEntries)` and include in `instructions` (replaces hardcoded `customRules[8]`)
- Call `buildCdnScenarios(cdnEntries)` and include in `instructions` (replaces `SCENARIO RECIPES` block)

In `STATIC_INSTRUCTIONS`:
- Remove the `SCENARIO RECIPES` section entirely — now generated by `buildCdnScenarios()`
- Remove the `customRules` entry that lists CDN component names by name — now generated by `buildCdnRules()`
- Retain all other `customRules` (they are domain-agnostic and do not reference CDN component names)

After this change, `STATIC_INSTRUCTIONS` contains zero CDN component names. Adding a new CDN component requires no changes to `agent.ts`.

**Validation:** `makeAgent()` builds without errors. Instructions string does not contain any of `PlanInformation`, `AppointmentCard`, `ClaimStatusTimeline`, `BenefitSummary`, `FacilityCard` as literals. Those names only appear in the dynamically-generated CDN sections.

---

#### RDF-7: Document object prop limitation in `packages/mock-cdn/README.md`

Add a section "Prop value constraints" explaining:
- All prop values from the spec must be string, number, or boolean
- Object and array props are not supported — the envelope sets attributes via `String(value)`, which produces `"[object Object]"` for objects
- Workaround: serialize to JSON string in the spec, parse with `JSON.parse(this.getAttribute(...))` in `attributeChangedCallback`

**Validation:** README updated. No code changes.

---

#### RDF-8: Update `agent.test.ts` for new functions

- Update `buildCdnSection` tests for the new `Props:` line format (present when `propDescriptions` provided, absent when not)
- Add tests for `buildCdnRules`: empty → `""`, non-empty → contains all entry keys, contains key rules
- Add tests for `buildCdnScenarios`: empty → `""`, non-empty → first sentence of each description present, each key present

**Validation:** `pnpm --filter uswds-playground test` passes.

---

#### RDF-9: Full suite green

`pnpm -r test` passes. `pnpm --filter uswds-playground typecheck` passes. `STATIC_INSTRUCTIONS` string in `agent.ts` contains no CDN component names as literals.

---

### Acceptance Criteria

- `STATIC_INSTRUCTIONS` contains no CDN component names (`PlanInformation`, `AppointmentCard`, etc.) as string literals
- Adding a new CDN component to `catalog.json` — with no other code changes — causes the agent to receive its scenario recipe, usage rules, and field hints on the next request
- `CdnEntry` type defined in exactly one place
- `propDescriptions` documented in `packages/mock-cdn/README.md` as part of the catalog contract
- All tests pass

---

## Prompt-Side Fixes (post-RDF)

### CF-1 — CDN components excluded from `AVAILABLE COMPONENTS` list

**Root cause discovered during testing.** `@json-render/core`'s `generatePrompt` emits this hard constraint:

> `ONLY use component types from the AVAILABLE COMPONENTS list below.`

`playgroundCatalog` is built from `uswdsComponentDefinitions` (48 Truss primitives). `makeAgent()` was calling `playgroundCatalog.prompt()`, so the AVAILABLE COMPONENTS list contained only primitives. The three CDN sections (`buildCdnSection`, `buildCdnRules`, `buildCdnScenarios`) were appended as plain text after that block — outside the list the model was told to exclusively draw from. The model correctly obeyed the constraint and never emitted CDN component types.

**Fix:** `makeAgent()` now builds `extendedCatalog` from CDN entries + primitives and calls `extendedCatalog.prompt()`:

```ts
const cdnDefs = Object.fromEntries(
  cdnEntries.map((e) => [
    e.key,
    {
      props: z.record(z.string(), z.unknown()),
      description: `ALWAYS USE FOR THIS DOMAIN — NEVER substitute Card/Badge/Text: ${e.description...}`,
      example: e.example,
    },
  ]),
);
const extendedCatalog = defineCatalog(schema, {
  components: { ...uswdsComponentDefinitions, ...cdnDefs },
  actions: {},
});
```

CDN component types now appear inside `AVAILABLE COMPONENTS (53)` — the model can legally select them. The `buildCdnSection`/`buildCdnRules`/`buildCdnScenarios` blocks remain as supplementary guidance appended after the catalog section.

`playgroundCatalog` import removed from `agent.ts`. New imports: `defineCatalog` (`@json-render/core`), `schema` (`@json-render/react/schema`), `z` (`zod`), `uswdsComponentDefinitions` (`@oddball/json-render-uswds/catalog`). `schema.js` is pure data — no React imports, safe to use server-side.

**Files changed:** `examples/uswds-playground/lib/agent.ts` only.

---

### CF-2 — CDN components not prioritized hard enough over primitives

**Problem.** Even after CF-1, CDN components appeared in AVAILABLE COMPONENTS but the model still sometimes defaulted to primitives because:

1. `STATIC_INSTRUCTIONS` contained unconditional positive instructions for primitives: `"Use Card to group related information"`, `"Use Badge for inline status pills"`, `"Use Text for paragraphs and labels"`. These compete directly with CDN components at the same domain.
2. CDN component descriptions in the catalog carried the CDN team's soft `"Prefer over Card+Text"` language — weak guidance at the point the model selects a component type.
3. The CDN override `customRule` was the last item in the rules array — middle-ranked by the time baseRules and earlier customRules are prepended.

**Fix — three changes in `agent.ts`:**

**1. `COMPONENT PRIORITY` block in `STATIC_INSTRUCTIONS`** (appears before the catalog):
```
CDN components are ALWAYS the first choice. When a CDN component exists for the data
you are displaying, you MUST use it — never fall back to Card/Badge/Text primitives
for the same domain. Primitives are only for layout and content that no CDN component covers.
```

**2. Qualify primitive rules in `STATIC_INSTRUCTIONS`** — the generic positive instructions now carry explicit carve-outs:
- `"Use Card to group related information ONLY when no CDN component covers the domain."`
- `"Use Badge for inline status pills ONLY when no CDN component covers the domain."`
- `"Use Text for paragraphs and labels ONLY when no CDN component covers the domain."`

**3. Strengthen `cdnDefs` description** — strips the CDN team's soft `"Prefer over"` language and replaces with a hard mandate so the model sees it at component-selection time inside AVAILABLE COMPONENTS:
```ts
description: `ALWAYS USE FOR THIS DOMAIN — NEVER substitute Card/Badge/Text: ${e.description.replace(/\.\s*Prefer over[^.]*\./gi, ".")}`
```

**4. CDN override rule moved to first in `customRules`** — ensures it appears before the structural/formatting rules rather than after them.

**Files changed:** `examples/uswds-playground/lib/agent.ts` only.

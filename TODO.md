# TODO — `feat/cms-demo` follow-ups

Captured at the end of the CMS-playground session (PR [#2](https://github.com/oddballteam/uswds-render/pull/2)). Items below are either surfaced by Playwright QA of Q1 (Medicare parts explainer) and Q3 (plans in ZIP 97201), or deferred from the original plan.

## Rendering quality — prompt / agent
- [ ] **Enforce "no nested Cards" more aggressively.** Model emits a tinted inner Card for "Plan highlights" inside each plan Card despite the explicit rule. Either lift highlights into `SummaryBox` in the worked exemplar, or tighten the rule (and call out `SummaryBox` as the right primitive for in-card highlights).
- [ ] **Default plan grid to 2 columns (`col=6`)** in the exemplar. At `col=4` in the chat bubble text wraps at ~17 characters and pages look broken.
- [ ] **Stop the model from re-deriving JSON spec shape on knowledge questions.** Even with inline-props rule, knowledge answers occasionally emit empty "sources" or orphan headings on complex prompts — consider adding a third exemplar for enrollment-timeline answers.
- [ ] **Benchmark `reasoningEffort: "high"` vs `"medium"`** on the same six questions. Currently defaulted to `"medium"` (env override available) but no scored A/B yet.

## Catalog / component fixes (`packages/uswds`)
- [ ] **Badge row spacing.** Multiple `Badge` children inside a `Section` render edge-to-edge (`$0 premium4.5-starMA-PDPPO`). Fix options: (a) add horizontal margin to the Truss `Tag` wrapper, (b) expose a `BadgeRow` / `Tags` grouping component, or (c) give Section a `gap` prop that emits a USWDS flex-gap utility class.
- [ ] **Confirm `List` / `ListItem` registration.** Accessibility snapshots show `list`/`listitem` roles rendering without bullet discs in "Plan highlights" and "Quick takeaways". Either the List adapter uses `list-none` USWDS styling and needs a bulleted variant, or it's unregistered and we should steer the model explicitly to `SummaryBox`/`IconList`/`Collection` (already partially in the prompt).
- [ ] **Tighten `uswdsComponents` typing.** Currently `Record<string, ComponentType<any>>`, forcing a cast in demo renderers. Narrow to a mapped type keyed by `keyof typeof uswdsComponentDefinitions` so `defineRegistry(catalog, { components })` types without `as unknown as Components<C>`.

## Data shape
- [ ] **Flatten verbose tool outputs.** `search_medicare_plans` returns nested `supplementalBenefits` + `formularyTiers` + `fipsCodes` arrays. Flatten top-level fields ("dental: true") so the model has fewer tempting nested $state pointers. Revisit `get_beneficiary_profile` similarly.
- [ ] **Clean up `docs/example_questions.csv`.** Trailing lines with stray quotes and 200+ empty rows. Trim to populated rows; consider splitting into `docs/examples/cms.csv` once we add other agency domains.

## Observability
- [ ] **Streaming "thinking…" placeholder in the UI** while gpt-5.5 reasons (30–60s on `"high"`, ~15–30s on `"medium"`). Currently the chat shows a disabled textbox and no progress — users think it's broken.
- [ ] **Wire the request id into a browser toast on stream error** so users can quote it to a support channel. Server already logs `[generate <rid>]` on every line; the UI just drops the `[rid] <message>` prefix we emit via `onError`.
- [ ] **Increase `maxDuration` in `app/api/generate/route.ts`** from 60s when `OPENAI_REASONING_EFFORT=high`, or fail fast with a clearer error when reasoning exceeds the budget.

## Provider / SDK hygiene
- [ ] **Remove `gpt-5.5 as any` cast** once `@ai-sdk/openai` ships updated model-id types. Bump the SDK and drop the cast.
- [ ] **Replace local `ProviderOptions = Record<string, JSONObject>` shim** in `lib/provider.ts` with the real type once `ai` re-exports it (currently only available via `@ai-sdk/provider-utils`, not a declared dependency here).
- [ ] **Runtime-verify gpt-5.5** with a real `OPENAI_API_KEY`. This session could not exercise the OpenAI endpoint directly; Playwright QA ran against whichever provider was configured in dev's `.env.local`. If the slug is rejected in CI, upgrade `@ai-sdk/openai` first, then fall back.

## Testing
- [ ] **End-to-end agent stream test.** Existing tests cover tool execute-paths and suggestion-chip rendering. None exercise the `/api/generate` route with a mocked model. Add a Vitest integration test using `simulateStreamingMiddleware` from the AI SDK, asserting: provider selected, tools invoked, final spec parseable.
- [ ] **Tool input-schema negative tests.** Confirm each CMS tool rejects malformed input and returns a helpful `matched: false` shape rather than throwing. Only happy-path tests exist today.

## Housekeeping
- [ ] **`.gitignore`** — add `.playwright-mcp/`, `.superpowers/`, local QA screenshots (`q*-*.png`). These tracked up in untracked status during this session.
- [ ] **Retire or re-enable legacy VA tools.** `lib/tools/va-*.ts` + `lib/tools/claim-status.ts` + `lib/tools/gi-bill.ts` + `lib/tools/medicare-plans.ts` are still on disk with passing tests, but commented out of the agent map. Either delete them (and their tests) or re-enable behind a `DEMO_MODE=va` flag.
- [ ] **Drop the `SCENARIO_RECIPES` debt note** from `CLAUDE.md` once we're confident the minimal-prompt approach is stable.

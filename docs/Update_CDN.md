# CDN Component Update Log

Changes made to `packages/mock-cdn/` only. Zero changes to `examples/uswds-playground/` or `packages/uswds/` — this is the proof of the CDN decoupling model working as designed.

---

## UC-1: Extend `PlanInformation` with cost summary props [x]

**Problem:** Agent generated a grid of `Text` elements for plan comparison data (monthly premium, annual deductible, coinsurance, out-of-pocket max) because `cms-plan-information` had no props for those fields. Cost data had nowhere to go in the component, so the agent fell back to primitives.

**Root cause:** CDN component capability gap — `PlanInformation` only exposed coverage dates and a details link. The comparison data (premium/deductible/coinsurance/OOP) is core to any Medicare plan comparison flow.

**Fix — CDN only:**

### `packages/mock-cdn/components/cms-plan-information.js`

Added four new observed attributes:
- `monthly-premium`
- `annual-deductible`
- `coinsurance-after-deductible`
- `out-of-pocket-max`

Added a "Cost summary" section to `_render()` that appears between the coverage dates and the details link when any cost prop is present. Each cost field renders as a label/value row. The section is omitted entirely when no cost props are passed (backwards compatible).

### `packages/mock-cdn/catalog.json` — `PlanInformation` entry

Updated `example` to include all four new props with realistic values:
```json
"monthlyPremium": "$174.70/month",
"annualDeductible": "$257/year",
"coinsuranceAfterDeductible": "20%",
"outOfPocketMax": "No limit"
```

Updated `propDescriptions` to document all new fields:
- `monthlyPremium` — monthly premium string, e.g. `'$174.70/month'`. Omit if unknown.
- `annualDeductible` — annual deductible string, e.g. `'$257/year'`. Omit if unknown.
- `coinsuranceAfterDeductible` — coinsurance rate, e.g. `'20%'` or `'$0 (fully covered)'`
- `outOfPocketMax` — out-of-pocket maximum, e.g. `'No limit'` or `'$257/year'`

Also updated `description` to mention the cost summary so the agent's scenario recipe reflects the full capability.

**Validation:**
- Restart mock CDN (`node packages/mock-cdn/server.mjs`) — no code change needed
- Ask agent to compare Medicare plans — it should now emit all cost fields inside each `PlanInformation` block instead of a separate `GridContainer` of `Text` elements
- `partACoverageDate` / `partBCoverageDate` accept either a date string or a coverage description (e.g. `"Covers Part A coinsurance"`) — the `propDescriptions` wording was updated to reflect this

**Render app changes:** None. The CDN update is self-contained — `buildRegistry()` and `makeAgent()` pick up the new props automatically from `catalog.json` on the next request.
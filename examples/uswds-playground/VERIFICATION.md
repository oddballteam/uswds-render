# USWDS Playground — Manual Verification Log

Fill this in whenever you re-test the six CMS suggestion chips against a new model, new prompt, or new Truss release. One row per chip.

- Date:
- AI Provider / model:
- `OPENAI_REASONING_EFFORT`:
- uswds package commit / version:

## CMS suggestion chip results

| Chip | Tool chain expected | USWDS components rendered | Latency | Notes |
|---|---|---|---|---|
| "What's the difference between Original Medicare, Medicare Advantage, and Part D?" | `search_medicare_knowledge` | Alert, Heading, SummaryBox, Grid of Cards, Collection | | |
| "When can I join, switch, or drop a Medicare Advantage or Part D plan?" | `search_medicare_knowledge` + `check_eligibility_basics` | Alert, Heading, ProcessList or Timeline, Cards for each enrollment window | | |
| "What Medicare Advantage plans are available in ZIP 97201?" | `resolve_location` → `search_medicare_plans` | Alert with resolved location, Grid of plan Cards (Heading + Badge row + Text), outbound Link to Medicare.gov | | |
| "Which Part D plans cover Eliquis and Jardiance?" | `search_drugs_and_dosages` → `search_medicare_plans` (PDP) → `calculate_drug_costs` | Alert, plan Cards with tier/cost Badges, per-drug cost breakdown | | |
| "Use my saved drugs and pharmacies to show me the best Part D options." | `get_saved_health_preferences` → `search_medicare_plans` → `calculate_drug_costs` | Alert, SummaryBox of saved prefs, plan Cards ranked by total cost | | |
| "I can't afford this drug — what help should I look at first?" | `get_beneficiary_profile` → `find_assistance_programs` | Alert, prioritized program Cards with apply Links, Extra Help / LIS always surfaced | | |

## Regression checks

- [ ] Every heading you see on screen has non-empty content below it (no orphan sections).
- [ ] At least one `Badge` appears in every plan / program / drug Card.
- [ ] No `Table` element emitted (catalog Table has no columns/rows API).
- [ ] No `Stack`, `Separator`, `Tabs`, or other unregistered component errors in the browser console.
- [ ] Server log shows `[generate <rid>]` provider + step + finish lines with a sane tool-call chain.
- [ ] Sync failures return JSON `{ error, requestId }` with a 500 status.

## Known issues / follow-ups

See repo-root `TODO.md` for the live follow-up list. Add session-specific findings below:

-

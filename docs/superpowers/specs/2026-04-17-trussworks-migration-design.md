# Design: Migrate @oddball/json-render-uswds to @trussworks/react-uswds

**Date:** 2026-04-17
**Status:** Approved

## Goal

Replace all custom CVA/Tailwind/Radix component primitives in `packages/uswds/` with official `@trussworks/react-uswds` components backed by the real `@uswds/uswds` CSS bundle. This achieves official USWDS compliance/certification rather than approximate styling via token CSS.

## Decisions

| Question | Decision |
|---|---|
| Migration driver | Official USWDS compliance |
| Non-USWDS components | Drop from catalog entirely |
| Tailwind | Strip from component primitives; demo apps keep Tailwind for layout |
| Catalog prop API | Match Truss props exactly (no abstraction layer) |
| React peer dep | Downgrade to `^18.0.0` in `packages/uswds` |
| Component scope | All Truss components (full catalog) |

## Component Scope

### Migrated (existing → Truss equivalent)

| Current name | Truss component |
|---|---|
| Accordion | `Accordion` |
| Alert | `Alert` |
| Badge | `Tag` |
| Button | `Button` |
| ButtonGroup | `ButtonGroup` |
| Card | `Card` |
| Checkbox | `Checkbox` |
| Dialog | `Modal` |
| Grid | `GridContainer` / `Grid` |
| Input | `TextInput` |
| Link | `Link` |
| Pagination | `Pagination` |
| RadioGroup | `Radio` |
| Select | `Select` |
| Table | `Table` |
| Tabs | `Tabs` |
| Textarea | `Textarea` |
| Tooltip | `Tooltip` |

### Kept as ultra-thin HTML wrappers (USWDS typography classes, no CVA)

- **Heading** — renders `<h1>`–`<h6>` with USWDS heading classes. Props: `level`, `className`, `text`.
- **Text** — renders `<p>`/`<span>` with USWDS body text classes. Props: `as`, `size`, `className`, `text`. `weight` and `color` props dropped; use `className` override.

Rationale: USWDS defines typography; Truss has no React wrapper. These components are load-bearing for AI-generated flat-tree specs. Not custom implementations — purely `<h2 className="usa-prose">` etc.

### Dropped (no official USWDS equivalent)

Avatar, Carousel, Collapsible, Drawer, DropdownMenu, Image, Popover, Progress, Separator, Skeleton, Slider, Spinner, Stack, Switch, Toggle, ToggleGroup

### New (Truss components not previously in catalog)

**Top-level:**
Icon, SiteAlert, Breadcrumb, SideNav, InPageNavigation, StepIndicator, ProcessList, SummaryBox, Search, Collection, Banner, Identifier, Header, Footer, LanguageSelector, IconList, MediaBlock

**Form:**
ComboBox, DatePicker, DateRangePicker, FileInput, RangeInput (replaces Slider), TimePicker, Form, FormGroup, Fieldset, Label, ErrorMessage, CharacterCount, TextInputMask

**Note on compound components (Header, Footer, Banner, Identifier):** These are complex in Truss with sub-components for nav, menus, columns, etc. Catalog entries expose simplified flat props (e.g., `siteName`, `primaryLinks[]`). Adapters compose Truss sub-components internally. Catalog descriptions mark these as "use with caution — limited AI support."

**Total catalog size:** ~50 components (up from 36, down from 36 in terms of original components, net new).

## Architecture

### Package file structure changes

```
packages/uswds/src/
  ui/           ← DELETE entire directory (all CVA primitives)
  lib/tokens/   ← DELETE (token CSS layer removed)
  lib/cn.ts     ← DELETE (no longer needed)
  components.tsx ← REWRITE (import from @trussworks/react-uswds)
  catalog.ts     ← REWRITE (Zod schemas match Truss prop API exactly)
  index.ts       ← UPDATE exports
```

### Dependency changes

**Removed from `dependencies`:**
- `class-variance-authority`
- `radix-ui`
- `lucide-react`
- `embla-carousel-react`
- `vaul`
- `tailwind-merge`
- `clsx`

**Added to `dependencies`:**
- `@trussworks/react-uswds`

**Peer deps removed:**
- `tailwindcss`
- `@tailwindcss/forms`
- `@tailwindcss/typography`
- `@iconify/tailwind4`
- `tailwindcss-animate`

**React peer dep:** downgraded to `^18.0.0`

**Package exports removed:** `./tokens` and `./tokens.css`. The `src/lib/tokens.ts` JS file also deleted.

### CSS loading

**Before (consumers):**
```css
@source "../node_modules/@oddball/json-render-uswds/dist/**/*.{js,mjs}";
```

**After (consumers):**
```ts
import '@trussworks/react-uswds/lib/uswds.css';
```

Truss ships compiled USWDS CSS — no SCSS compilation or Tailwind scanning required.

Demo apps (`uswds-demo`, `uswds-playground`) remove `@source` directive and add Truss CSS import to their app entry. Both keep their own Tailwind config for layout utilities.

## Catalog & Adapter Pattern

Zod schemas in `catalog.ts` rewritten to match Truss prop API exactly. No prop translation in adapters — catalog API = Truss API.

Key prop API changes from current:

| Component | Old prop | New prop |
|---|---|---|
| Button | `variant="outline"` | `outline={true}` |
| Button | `variant="secondary"` | `secondary={true}` |
| Button | `variant="ghost"` | `unstyled={true}` |
| Button | `size="sm"` | `size="small"` |
| Alert | `variant="info"` | `type="info"` |
| Badge/Tag | `variant="...color"` | `background="..."` |

Adapter in `components.tsx` remains thin — unwrap envelope `{ props, emit, children }`, pass props directly to Truss component. No translation layer needed since catalog matches Truss API.

## Playground Updates (`examples/uswds-playground`)

All playground components that use USWDS components use surviving Truss equivalents. No "drop and do nothing" cases apply.

| File | Change |
|---|---|
| `components/suggestion-chips.tsx` | Button: `variant="outline"` → `outline`, `size="sm"` → `size="small"` |
| `components/oddball-banner.tsx` | Text + Link prop API updates |
| `components/spec-viewer.tsx` | Tabs API rewrite (Truss Tabs API differs from current Radix-based) |
| `app/page.tsx` | Button, Textarea, Text prop API updates |
| `app/globals.css` | Replace `@source` directive with Truss CSS import |

`lucide-react` (`ArrowDown`) in `page.tsx` is a direct playground dep — keep as-is.

## Demo App Updates (`examples/uswds-demo`)

- Replace `@source` directive with Truss CSS import in `src/styles.css`
- Audit `src/specs/*.json` preset specs: remove or rewrite elements that use dropped components (Stack, Grid, Carousel, etc.)

## Tests

### Delete (dropped components, 16 files)

`avatar`, `carousel`, `collapsible`, `drawer`, `dropdown-menu`, `image`, `popover`, `progress`, `separator`, `skeleton`, `slider`, `spinner`, `stack`, `switch`, `toggle`, `toggle-group`

### Rewrite (surviving components, new prop API + rendered output, 20 files)

`accordion`, `alert`, `badge`, `button`, `button-group`, `card`, `checkbox`, `dialog`, `grid`, `heading`, `input`, `link`, `pagination`, `radio`, `select`, `table`, `tabs`, `text`, `textarea`, `tooltip`

### Add (new Truss components, ~27 files)

`icon`, `site-alert`, `breadcrumb`, `sidenav`, `in-page-navigation`, `step-indicator`, `process-list`, `summary-box`, `search`, `collection`, `banner`, `identifier`, `header`, `footer`, `language-selector`, `icon-list`, `media-block`, `combobox`, `date-picker`, `date-range-picker`, `file-input`, `range-input`, `time-picker`, `form-group`, `label`, `error-message`, `character-count`, `text-input-mask`

### Catalog test (`catalog.test.ts`)

- Keys ↔ registry parity: survives
- Example validates against Zod schema: survives (schemas rewritten)
- **Shadcn parity test: remove** — no longer targeting shadcn parity. Replace with an exported `UNSUPPORTED_COMPONENTS` constant in `catalog.ts` listing explicitly dropped components, with a comment explaining they have no official USWDS equivalent.

### Envelope test (`envelope.test.tsx`)

Survives unchanged — adapter pattern same, Truss internals instead of CVA.

**Net test count:** delete 16, rewrite 20, add ~27 → ~47 test files total (~150+ individual tests).

# @oddball/json-render-uswds

USWDS-styled component library for [@json-render/core](https://json-render.dev). Drop-in replacement for `@json-render/shadcn` with US Web Design System visuals.

## Install

```bash
pnpm add @oddball/json-render-uswds
```

### Peer dependencies

```bash
pnpm add react react-dom tailwindcss zod \
  @tailwindcss/forms @tailwindcss/typography \
  @iconify/tailwind4 tailwindcss-animate
```

The four Tailwind plugins are required — the vendored USWDS token CSS loads them via `@plugin` directives.

## Tailwind setup

Import the token CSS in your app's stylesheet:

```css
@import "tailwindcss";
@import "@oddball/json-render-uswds/tokens.css";
```

You also need Tailwind to scan the package's component classes. In your Tailwind entry CSS, add:

```css
@source "../node_modules/@oddball/json-render-uswds/dist/**/*.{js,mjs}";
```

(Adjust the relative path to your project structure.)

If using Vite, add `@tailwindcss/vite` to your Vite config. If using Next.js, use `@tailwindcss/postcss` in `postcss.config.mjs`.

## Usage

### With json-render

```tsx
import { createRenderer } from "@json-render/react";
import { uswdsComponentDefinitions, uswdsComponents } from "@oddball/json-render-uswds";

const renderer = createRenderer({
  catalog: uswdsComponentDefinitions,
  components: uswdsComponents,
});
```

### Standalone (without json-render)

```tsx
import { uswdsComponents } from "@oddball/json-render-uswds";

const { Button, Card, Alert } = uswdsComponents;

function App() {
  return (
    <Card title="Hello">
      <Alert variant="info" title="Welcome">Content here</Alert>
      <Button variant="default">Submit</Button>
    </Card>
  );
}
```

### Catalog only (server-side validation)

```ts
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";
```

## Components (36)

**Layout:** Card, Stack, Grid, Separator
**Content:** Heading, Text, Image, Avatar, Badge, Alert, Progress, Skeleton, Spinner, Table
**Actions:** Button, Link, ButtonGroup, Toggle, ToggleGroup
**Forms:** Input, Textarea, Select, Checkbox, Radio, Switch, Slider
**Navigation:** Tabs, Accordion, Collapsible, Pagination
**Overlays:** Dialog, Drawer, Tooltip, Popover, DropdownMenu, Carousel

## Attribution

This package vendors the Tailwind preset from [uswds-tailwind](https://github.com/IHIutch/uswds-tailwind) (MIT). See `LICENSE-uswds-tailwind` and `NOTICES.md`.

## License

Apache-2.0

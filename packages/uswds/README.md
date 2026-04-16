# @oddball/json-render-uswds

USWDS-styled component library for [@json-render/core](https://json-render.dev). Drop-in replacement for `@json-render/shadcn` with US Web Design System visuals.

## Install

```bash
pnpm add @oddball/json-render-uswds
```

### Peer dependencies

```bash
pnpm add react react-dom tailwindcss zod
```

## Tailwind setup

This package vendors a USWDS Tailwind v4 preset. Import the token CSS in your app's stylesheet:

```css
@import "tailwindcss";
@import "@oddball/json-render-uswds/tokens.css";
```

If using Vite, add `@tailwindcss/vite` to your Vite config.

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

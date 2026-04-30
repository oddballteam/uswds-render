# mock-cdn

Simulates an external component CDN that serves CMS-domain web component bundles. An external team can publish new component implementations here without touching the main repo.

## Running

```bash
node server.mjs          # or: npm start
node --watch server.mjs  # or: npm run dev  (auto-restart on change)
```

Listens on `http://localhost:4000` by default. Override with `PORT=<n> node server.mjs`.

Set `COMPONENT_CDN_URL=http://localhost:4000` and `NEXT_PUBLIC_COMPONENT_CDN_URL=http://localhost:4000` in the playground's `.env.local`.

---

## CDN Contract

### `GET /catalog.json`

Returns a JSON array. Every entry must have exactly these fields:

| Field | Type | Description |
|---|---|---|
| `key` | `string` | Matches the key in `uswdsComponentDefinitions` in `packages/uswds/src/catalog.ts`. This is how the playground maps an AI-generated spec element to an adapter. |
| `tagName` | `string` | The custom element tag name (e.g. `cms-plan-information`). Must match the `customElements.define()` call inside the bundle. |
| `description` | `string` | One-sentence AI guidance injected into the agent system prompt. Should describe when the AI should use this component over primitives. |
| `example` | `object` | A valid example props object. Must satisfy the local Zod schema for this key (not validated here — validated locally by `schema.test.ts`). |
| `bundleUrl` | `string` | Full URL to the component's ES module bundle. Fetched at render-time via dynamic `import()` in the browser. |

Example:

```json
[
  {
    "key": "PlanInformation",
    "tagName": "cms-plan-information",
    "description": "Medicare plan summary panel. Shows plan type header, bold plan name, Part A/B coverage start dates, and a details link.",
    "example": {
      "planType": "Original Medicare",
      "planName": "Hospital Insurance (Part A)\nMedical Insurance (Part B)",
      "partACoverageDate": "8/12/2019",
      "partBCoverageDate": "8/12/2019",
      "detailsHref": "/plan-details"
    },
    "bundleUrl": "http://localhost:4000/components/cms-plan-information.js"
  }
]
```

### `GET /components/{tagName}.js`

Returns the component's JavaScript bundle. Must be a valid ES module that:

1. Defines a class extending `HTMLElement`
2. Uses `static observedAttributes` to declare which kebab-case attributes it watches
3. Implements `connectedCallback()` and `attributeChangedCallback()` to render
4. Calls `customElements.define(tagName, ClassName)` guarded by `if (!customElements.get(tagName))`

The bundle is loaded via `import(bundleUrl)` in the browser (dynamic import, browser-native). It must not have side effects beyond registering the custom element.

CORS headers (`Access-Control-Allow-Origin: *`) are required because the playground's Next.js frontend fetches from a different origin.

---

## Adding a new component

1. Write a new web component file in `components/`. Follow the pattern of existing files (observedAttributes, connectedCallback, attributeChangedCallback, innerHTML with inline styles).
2. Add an entry to `catalog.json`.
3. Add a matching Zod schema entry to `packages/uswds/src/catalog.ts` in the main repo. This is the authoritative schema — the CDN does not own validation.
4. Update the mock-cdn `catalog.json` entry's `description` and `example` to match.
5. The playground will automatically pick up the new component on next restart (no code changes required in the playground or uswds package).

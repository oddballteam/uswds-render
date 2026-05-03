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
| `key` | `string` | Catalog key used as the `type` in AI-generated specs. The playground creates a registry adapter keyed by this value. |
| `tagName` | `string` | The custom element tag name (e.g. `cms-plan-information`). Must match the `customElements.define()` call inside the bundle. |
| `description` | `string` | Human-readable description injected into the agent system prompt. **The first sentence** (text before the first `. ` period-followed-by-space) becomes the scenario recipe trigger — e.g. `"VA appointment summary card"` → `"VA appointment summary card → use AppointmentCard"`. Write the first sentence as a concise noun phrase with no abbreviations containing periods (`Dr.`, `e.g.`, `U.S.`) — those will cause early truncation. Subsequent sentences describe usage preference. |
| `example` | `object` | A representative props object shown to the agent as a usage example. Should include all commonly-used props. |
| `bundleUrl` | `string` | Full URL to the component's ES module bundle. Fetched at render-time via dynamic `import()` in the browser. |
| `propDescriptions` | `object` | *(Optional)* Field-level hints for non-obvious props. Keys are prop names; values are short descriptions (e.g. `"in_person \| telehealth"`, `"1–5: 1=Received 2=Review…"`). Injected into the agent prompt alongside the example. Omit self-explanatory props. |

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

## Prop value constraints

All prop values passed from the spec to a CDN component must be **string, number, or boolean**. The envelope factory sets props via `el.setAttribute(attr, String(value))` — objects and arrays are not supported through this channel.

- `{ status: "scheduled" }` ✓
- `{ count: 3 }` ✓
- `{ active: true }` ✓
- `{ data: { foo: "bar" } }` ✗ → attribute set to `"[object Object]"`

**Workaround for structured data:** serialize to a JSON string in the spec and parse in the component:

```js
// spec prop:  { "config": "{\"key\":\"value\"}" }
// in attributeChangedCallback:
const config = JSON.parse(this.getAttribute("config") ?? "{}");
```

---

## Adding a new component

1. Write a new web component file in `components/`. Follow the pattern of existing files (observedAttributes, connectedCallback, attributeChangedCallback, innerHTML with inline styles).
2. Add an entry to `catalog.json` with `key`, `tagName`, `description`, `example`, `bundleUrl`, and `propDescriptions` for any non-obvious props.
3. The playground picks up the new component automatically on the next page load — no code changes required in `examples/uswds-playground/` or `packages/uswds/`.

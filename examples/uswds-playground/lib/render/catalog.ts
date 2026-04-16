import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";

/**
 * USWDS Playground catalog.
 *
 * Wraps the full `uswdsComponentDefinitions` export from
 * `@oddball/json-render-uswds` so the ToolLoopAgent can emit specs whose
 * component types are drawn from the USWDS set. No chat-chrome / shadcn
 * components leak into the catalog — renders are USWDS-only.
 */
export const playgroundCatalog = defineCatalog(schema, {
  components: uswdsComponentDefinitions,
  actions: {},
});

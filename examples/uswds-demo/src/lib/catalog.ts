import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";

export const playgroundCatalog = defineCatalog(schema, {
  components: uswdsComponentDefinitions,
  actions: {},
});

"use client";

import { type ReactNode } from "react";
import {
  Renderer,
  type ComponentRenderer,
  type Components,
  type Spec,
  StateProvider,
  VisibilityProvider,
  ActionProvider,
  defineRegistry,
} from "@json-render/react";
import { uswdsComponents } from "@oddball/json-render-uswds";
import { playgroundCatalog } from "./catalog";

// defineRegistry takes (catalog, options) — matches the fork's
// lib/render/registry.tsx:202. The uswds package exports its components
// as a loose Record<string, ComponentType<any>>; Components<C> expects
// a specific named key for each catalog entry. Since uswdsComponents and
// uswdsComponentDefinitions are keyed the same way by construction, we
// cast through the catalog-typed Components<C>.
const { registry } = defineRegistry(playgroundCatalog, {
  components: uswdsComponents as unknown as Components<typeof playgroundCatalog>,
});

function Fallback({ type }: { type: string }) {
  return (
    <div className="rounded border border-dashed border-zinc-400 p-2 text-xs text-zinc-500">
      Unknown component: <code>{type}</code>
    </div>
  );
}

const fallback: ComponentRenderer = ({ element }) => (
  <Fallback type={element.type} />
);

interface PlaygroundRendererProps {
  spec: Spec | null;
}

export function PlaygroundRenderer({
  spec,
}: PlaygroundRendererProps): ReactNode {
  if (!spec) return null;

  return (
    <StateProvider initialState={{}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer spec={spec} registry={registry} fallback={fallback} />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}

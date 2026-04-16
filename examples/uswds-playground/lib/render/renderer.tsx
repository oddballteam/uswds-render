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
  loading?: boolean;
}

// Returns true if the spec is a complete, renderable flat-tree: it has a
// root key and that root exists in the elements map. Partial specs that
// arrive mid-stream can have a root pointing at a key not yet in elements,
// which crashes Renderer with "Cannot convert undefined or null to object".
function isRenderable(spec: Spec): boolean {
  const s = spec as unknown as {
    root?: string;
    elements?: Record<string, unknown>;
  };
  if (!s.root) return false;
  if (!s.elements || typeof s.elements !== "object") return false;
  return Object.prototype.hasOwnProperty.call(s.elements, s.root);
}

export function PlaygroundRenderer({
  spec,
  loading,
}: PlaygroundRendererProps): ReactNode {
  if (!spec) return null;
  if (!isRenderable(spec)) {
    if (loading) {
      return (
        <div className="p-3 text-xs text-zinc-500">Rendering UI…</div>
      );
    }
    return null;
  }

  return (
    <StateProvider initialState={{}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer
            spec={spec}
            registry={registry}
            fallback={fallback}
            loading={loading}
          />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}

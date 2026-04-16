import { useMemo } from "react";
import {
  Renderer,
  StateProvider,
  VisibilityProvider,
  ActionProvider,
  defineRegistry,
  type Components,
  type ComponentRenderer,
  type Spec,
} from "@json-render/react";
import { uswdsComponents } from "@oddball/json-render-uswds";
import { playgroundCatalog } from "../lib/catalog";

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

interface SpecPreviewProps {
  spec: unknown;
}

function isRenderable(spec: unknown): spec is Spec {
  if (!spec || typeof spec !== "object") return false;
  const s = spec as { root?: string; elements?: Record<string, unknown> };
  if (!s.root || !s.elements || typeof s.elements !== "object") return false;
  return Object.prototype.hasOwnProperty.call(s.elements, s.root);
}

export function SpecPreview({ spec }: SpecPreviewProps) {
  const valid = useMemo(() => isRenderable(spec), [spec]);

  if (!valid) {
    return (
      <div className="p-6 text-sm text-zinc-500">
        Spec is missing a valid <code>root</code> or <code>elements</code> map.
      </div>
    );
  }

  return (
    <StateProvider initialState={{}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer spec={spec as Spec} registry={registry} fallback={fallback} />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}

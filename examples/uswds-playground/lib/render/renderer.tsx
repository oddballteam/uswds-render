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
  actions: {},
});

// Renderer-level fallback for unknown element types.
//
// The fallback element can appear anywhere in the output tree — including
// as a direct child of <table>, <tr>, <select>, or other containers whose
// HTML content model is restrictive. There is no single element that is
// valid in every container, so emitting any DOM node (a <div>, <span>,
// <tr>, etc.) risks triggering React's "cannot be a child of" hydration
// error somewhere.
//
// Instead: don't put anything in the DOM. Surface the unknown type to
// developers via console.warn and let the SpecViewer's "code" tab carry
// the detail for humans who need to see it. This keeps the rendered page
// valid regardless of where the unknown element happened to land.
const warnedTypes = new Set<string>();
const fallback: ComponentRenderer = ({ element }) => {
  if (process.env.NODE_ENV !== "production" && !warnedTypes.has(element.type)) {
    warnedTypes.add(element.type);
    console.warn(
      `[PlaygroundRenderer] Unknown component type "${element.type}" — dropped from DOM. See the Spec tab for details.`,
    );
  }
  return null;
};

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

// resolveElementProps / resolveBindings in @json-render/core use Object.entries(props).
// Streamed specs sometimes emit props: null or non-object props; that crashes the renderer.
function withSafeElementProps(spec: Spec): Spec {
  const s = spec as unknown as {
    elements?: Record<string, { props?: unknown } & Record<string, unknown>>;
  };
  const els = s.elements;
  if (!els || typeof els !== "object") return spec;

  let elements = els;
  let copied = false;
  const ensureCopy = () => {
    if (!copied) {
      elements = { ...els };
      copied = true;
    }
  };

  for (const key of Object.keys(els)) {
    const el = els[key];
    if (!el || typeof el !== "object") continue;
    const p = el.props;
    if (p !== null && typeof p === "object" && !Array.isArray(p)) continue;
    ensureCopy();
    elements[key] = { ...el, props: {} };
  }

  return copied ? ({ ...spec, elements } as unknown as Spec) : spec;
}

export function PlaygroundRenderer({
  spec,
  loading,
}: PlaygroundRendererProps): ReactNode {
  if (!spec) return null;
  if (!isRenderable(spec)) {
    if (loading) {
      return (
        <div className="p-3 text-xs text-base-dark">Rendering UI…</div>
      );
    }
    return null;
  }

  const safeSpec = withSafeElementProps(spec);

  return (
    <StateProvider initialState={{}}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer
            spec={safeSpec}
            registry={registry}
            fallback={fallback}
            loading={loading}
          />
        </ActionProvider>
      </VisibilityProvider>
    </StateProvider>
  );
}

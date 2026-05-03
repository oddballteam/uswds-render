"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Renderer,
  type ComponentRenderer,
  type Spec,
  StateProvider,
  VisibilityProvider,
  ActionProvider,
} from "@json-render/react";
import { getRegistry, type RegistryResult } from "./registry";
import { isRenderable, withSafeElementProps } from "./spec-utils";

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

export function PlaygroundRenderer({
  spec,
  loading,
}: PlaygroundRendererProps): ReactNode {
  const [result, setResult] = useState<RegistryResult | null>(null);

  useEffect(() => {
    getRegistry().then(setResult);
  }, []);

  if (!spec) return null;

  if (!result) {
    return (
      <div className="p-3 text-xs text-base-dark">Loading components…</div>
    );
  }

  const { registry, cdnAvailable } = result;

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
    <>
      {!cdnAvailable && (
        <div
          role="alert"
          className="usa-alert usa-alert--warning usa-alert--slim margin-bottom-2"
        >
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              Component CDN unavailable — domain-specific panels (appointments,
              claims, plans, benefits, facilities) will not render.
            </p>
          </div>
        </div>
      )}
      <StateProvider initialState={(safeSpec.state as Record<string, unknown>) ?? {}}>
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
    </>
  );
}

import type { Spec } from "@json-render/react";

/**
 * Returns true only when the spec is a complete, renderable flat-tree: it has
 * a root key and that root exists in the elements map.
 *
 * Partial specs that arrive mid-stream can have a root pointing at a key not
 * yet in elements — passing one to Renderer crashes with
 * "Cannot convert undefined or null to object".
 */
export function isRenderable(spec: Spec): boolean {
  const s = spec as unknown as {
    root?: string;
    elements?: Record<string, unknown>;
  };
  if (!s.root) return false;
  if (!s.elements || typeof s.elements !== "object") return false;
  return Object.prototype.hasOwnProperty.call(s.elements, s.root);
}

/**
 * Guards against streamed specs that emit null or non-object props on an
 * element. resolveElementProps / resolveBindings in @json-render/core call
 * Object.entries(props), which throws when props is null or a primitive.
 */
export function withSafeElementProps(spec: Spec): Spec {
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

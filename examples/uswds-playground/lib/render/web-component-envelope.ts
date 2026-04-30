"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";

export type WCEnvelopeProps = {
  props?: Record<string, unknown>;
  emit?: Record<string, unknown>;
  children?: unknown;
  [key: string]: unknown;
};

function toKebab(camel: string): string {
  return camel.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Factory that wraps any custom element into a json-render adapter.
 *
 * Accepts the json-render envelope shape { props, emit, children } and
 * sets all data props as both camelCase DOM properties and kebab-case
 * HTML attributes on the element via a ref.
 *
 * When bundleUrl is provided, dynamically imports the bundle in the browser
 * only (never in SSR/Node). Renders null until the bundle resolves and the
 * custom element is registered.
 */
export function createWebComponentAdapter(
  tagName: string,
  bundleUrl?: string,
): ComponentType<WCEnvelopeProps> {
  function Adapter(all: WCEnvelopeProps) {
    const {
      props: envelopeProps,
      emit: _emit,
      children: _children,
      ...rest
    } = all;
    const merged: Record<string, unknown> = { ...rest, ...(envelopeProps ?? {}) };

    const ref = useRef<HTMLElement>(null);
    const [loaded, setLoaded] = useState(!bundleUrl);

    useEffect(() => {
      if (!bundleUrl) return;
      let active = true;
      // webpackIgnore + vite-ignore: prevent bundlers from statically analysing
      // this import. The URL is an external HTTP resource resolved at runtime.
      import(/* webpackIgnore: true */ /* @vite-ignore */ bundleUrl)
        .then(() => {
          if (active) setLoaded(true);
        })
        .catch((err) => {
          console.warn(
            `[web-component-envelope] Failed to load bundle for <${tagName}>:`,
            err,
          );
          if (active) setLoaded(true);
        });
      return () => {
        active = false;
      };
      // bundleUrl is constant per adapter instance
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Push props to DOM after every render so attribute changes are reflected.
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      for (const [key, value] of Object.entries(merged)) {
        (el as unknown as Record<string, unknown>)[key] = value;
        const attr = toKebab(key);
        if (value == null) {
          el.removeAttribute(attr);
        } else {
          el.setAttribute(attr, String(value));
        }
      }
    });

    if (!loaded) return null;

    return React.createElement(tagName, { ref });
  }

  Adapter.displayName = `WebComponent(${tagName})`;
  return Adapter as ComponentType<WCEnvelopeProps>;
}

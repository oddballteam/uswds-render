"use client";

import { z } from "zod";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry, type Components } from "@json-render/react";
import { uswdsComponents } from "@oddball/json-render-uswds";
import { uswdsComponentDefinitions } from "@oddball/json-render-uswds/catalog";
import { createWebComponentAdapter } from "./web-component-envelope";
import type { CdnEntry } from "../cdn-types";

const CDN_URL =
  process.env.NEXT_PUBLIC_COMPONENT_CDN_URL ?? "http://localhost:4000";

export type RegistryResult = {
  registry: ReturnType<typeof defineRegistry>["registry"];
  cdnAvailable: boolean;
};

export async function buildRegistry(): Promise<RegistryResult> {
  let cdnEntries: CdnEntry[] = [];
  let cdnAvailable = false;

  try {
    const res = await fetch(`${CDN_URL}/catalog.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cdnEntries = (await res.json()) as CdnEntry[];
    cdnAvailable = true;
  } catch (err) {
    console.warn(
      "[registry] CDN unavailable — rendering with base primitives only:",
      err instanceof Error ? err.message : err,
    );
  }

  // Build permissive definitions for CDN components. Zod validation for CDN
  // components is intentionally permissive — the web component itself is
  // responsible for prop correctness. This lets the CDN team add/change props
  // without any schema update in this repo.
  const cdnDefs = Object.fromEntries(
    cdnEntries.map((e) => [
      e.key,
      { props: z.record(z.string(), z.unknown()), description: e.description, example: e.example },
    ]),
  );

  // Extend the static catalog with CDN entries at runtime. CDN keys take
  // precedence on conflict so a CDN component can shadow a primitive.
  const extendedCatalog = defineCatalog(schema, {
    components: { ...uswdsComponentDefinitions, ...cdnDefs },
    actions: {},
  });

  const cdnAdapters = Object.fromEntries(
    cdnEntries.map((e) => [
      e.key,
      createWebComponentAdapter(e.tagName, e.bundleUrl),
    ]),
  );

  // CDN adapters take precedence over static primitives on key conflict
  const merged = { ...uswdsComponents, ...cdnAdapters };

  const { registry } = defineRegistry(extendedCatalog, {
    components: merged as unknown as Components<typeof extendedCatalog>,
    actions: {},
  });

  return { registry, cdnAvailable };
}

// Module-level cache — one fetch per page load, shared across all renderer
// instances in the same conversation.
let cached: Promise<RegistryResult> | null = null;

export function getRegistry(): Promise<RegistryResult> {
  if (!cached) {
    cached = buildRegistry();
  }
  return cached;
}

// Exposed for tests that need a fresh registry without cache side-effects.
export function clearRegistryCache(): void {
  cached = null;
}

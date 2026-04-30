"use client";

import { defineRegistry, type Components } from "@json-render/react";
import { uswdsComponents } from "@oddball/json-render-uswds";
import { createWebComponentAdapter } from "./web-component-envelope";
import { playgroundCatalog } from "./catalog";

const CDN_URL =
  process.env.NEXT_PUBLIC_COMPONENT_CDN_URL ?? "http://localhost:4000";

export type CdnEntry = {
  key: string;
  tagName: string;
  description: string;
  example: Record<string, unknown>;
  bundleUrl: string;
};

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

  const cdnAdapters = Object.fromEntries(
    cdnEntries.map((e) => [
      e.key,
      createWebComponentAdapter(e.tagName, e.bundleUrl),
    ]),
  );

  // CDN adapters take precedence over static primitives on key conflict
  const merged = { ...uswdsComponents, ...cdnAdapters };

  const { registry } = defineRegistry(playgroundCatalog, {
    components: merged as unknown as Components<typeof playgroundCatalog>,
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

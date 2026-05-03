"use client";

import { useRef } from "react";
import {
  applySpecPatch,
  nestedToFlat,
  SPEC_DATA_PART_TYPE,
  type SpecDataPart,
} from "@json-render/core";
import type { Spec } from "@json-render/react";

type AnyPart = { type: string; data?: unknown; text?: string };

function buildSpecFromNestedParts(parts: readonly AnyPart[]): Spec | null {
  const accumulated: Record<string, unknown> = {};
  let hasSpec = false;

  for (const part of parts) {
    if (part.type === SPEC_DATA_PART_TYPE) {
      const payload = part.data as SpecDataPart | undefined;
      if (payload?.type === "patch") {
        hasSpec = true;
        applySpecPatch(accumulated as unknown as Spec, payload.patch);
      }
    }
  }

  if (!hasSpec) return null;

  // Nested tree — has "type" at root (no "root"/"elements" keys)
  if ("type" in accumulated) {
    return nestedToFlat(accumulated) as Spec;
  }

  // Flat spec passthrough (compatibility if agent reverts to flat format)
  return accumulated as unknown as Spec;
}

function getTextFromParts(parts: readonly AnyPart[]): string {
  return parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => (p.text as string).trim())
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Drop-in replacement for useJsonRenderMessage that expects JSONL patches
 * building a nested tree ({type, props, children:[...inline...]}) instead of
 * the flat {root, elements} format. Calls nestedToFlat() before returning so
 * the renderer always receives a proper flat Spec. Orphaned elements are
 * structurally impossible in the nested format — every element is defined
 * exactly once, inline inside its parent's children array.
 */
export function useNestedSpec(parts: readonly AnyPart[]) {
  const prevPartsRef = useRef<readonly AnyPart[]>([]);
  const prevResultRef = useRef<{ spec: Spec | null; text: string }>({
    spec: null,
    text: "",
  });

  const prev = prevPartsRef.current;
  const changed =
    parts !== prev &&
    (parts.length !== prev.length ||
      parts[parts.length - 1] !== prev[prev.length - 1]);

  if (changed || prev.length === 0) {
    prevPartsRef.current = parts;
    prevResultRef.current = {
      spec: buildSpecFromNestedParts(parts),
      text: getTextFromParts(parts),
    };
  }

  const { spec, text } = prevResultRef.current;
  return { spec, text, hasSpec: spec !== null };
}

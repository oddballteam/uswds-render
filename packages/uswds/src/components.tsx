"use client";

import type { ComponentType, ReactNode } from "react";
import { Button as ButtonPrimitive } from "./ui/button";
import type { UswdsProps } from "./catalog";

type ButtonAdapterProps = Partial<UswdsProps["Button"]> & {
  props?: Partial<UswdsProps["Button"]>;
  emit?: (event: string) => void;
  children?: ReactNode;
};

function Button(all: ButtonAdapterProps) {
  const { props: envelopeProps, emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const variant = (p.variant ?? "default") as
    | "default"
    | "secondary"
    | "outline"
    | "accent-cool"
    | "accent-warm"
    | "base"
    | "ghost"
    | "link";
  const size = (p.size ?? "default") as "default" | "sm" | "lg" | "big";

  return (
    <ButtonPrimitive
      variant={variant}
      size={size}
      disabled={p.disabled ?? false}
      type={p.type ?? "button"}
      className={p.className ?? undefined}
      onClick={emit ? () => emit("press") : undefined}
    >
      {children}
    </ButtonPrimitive>
  );
}

export const uswdsComponents: Record<string, ComponentType<any>> = {
  Button,
};

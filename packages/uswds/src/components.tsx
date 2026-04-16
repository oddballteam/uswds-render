"use client";

import * as React from "react";
import type { ComponentType, ReactNode } from "react";
import { Button as ButtonPrimitive } from "./ui/button";
import {
  Card as CardPrimitive,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "./lib/cn";
import type { UswdsProps } from "./catalog";

type Envelope<P> = {
  props?: Partial<P>;
  emit?: (event: string) => void;
  children?: ReactNode;
};

// ── Button ──────────────────────────────────────────────────────────────
type ButtonAdapterProps = Partial<UswdsProps["Button"]> &
  Envelope<UswdsProps["Button"]>;

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

// ── Card ────────────────────────────────────────────────────────────────
type CardAdapterProps = Partial<UswdsProps["Card"]> &
  Envelope<UswdsProps["Card"]>;

function Card(all: CardAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const maxWidthClass =
    p.maxWidth === "sm"
      ? "max-w-sm"
      : p.maxWidth === "md"
        ? "max-w-md"
        : p.maxWidth === "lg"
          ? "max-w-lg"
          : p.maxWidth === "full"
            ? "max-w-full"
            : "";
  const centeredClass = p.centered ? "mx-auto" : "";

  return (
    <CardPrimitive
      className={cn(maxWidthClass, centeredClass, p.className ?? undefined)}
    >
      {(p.title || p.description) && (
        <CardHeader>
          {p.title && <CardTitle>{p.title}</CardTitle>}
          {p.description && <CardDescription>{p.description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </CardPrimitive>
  );
}

export const uswdsComponents: Record<string, ComponentType<any>> = {
  Button,
  Card,
};

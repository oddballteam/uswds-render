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
import { Stack as StackPrimitive } from "./ui/stack";
import { Grid as GridPrimitive } from "./ui/grid";
import { Separator as SeparatorPrimitive } from "./ui/separator";
import { Heading as HeadingPrimitive } from "./ui/heading";
import { Text as TextPrimitive } from "./ui/text";
import { Image as ImagePrimitive } from "./ui/image";
import {
  Avatar as AvatarPrimitive,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";
import { Badge as BadgePrimitive } from "./ui/badge";
import { Alert as AlertPrimitive } from "./ui/alert";
import { Progress as ProgressPrimitive } from "./ui/progress";
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

// ── Stack ───────────────────────────────────────────────────────────────
type StackAdapterProps = Partial<UswdsProps["Stack"]> &
  Envelope<UswdsProps["Stack"]>;

function Stack(all: StackAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <StackPrimitive
      direction={p.direction ?? "vertical"}
      gap={p.gap ?? "md"}
      align={p.align ?? undefined}
      justify={p.justify ?? undefined}
      className={p.className ?? undefined}
    >
      {children}
    </StackPrimitive>
  );
}

// ── Grid ────────────────────────────────────────────────────────────────
type GridAdapterProps = Partial<UswdsProps["Grid"]> &
  Envelope<UswdsProps["Grid"]>;

function Grid(all: GridAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <GridPrimitive
      columns={p.columns ?? 1}
      gap={p.gap ?? "md"}
      className={p.className ?? undefined}
    >
      {children}
    </GridPrimitive>
  );
}

// ── Separator ───────────────────────────────────────────────────────────
type SeparatorAdapterProps = Partial<UswdsProps["Separator"]> &
  Envelope<UswdsProps["Separator"]> & { className?: string };

function Separator(all: SeparatorAdapterProps) {
  const { props: envelopeProps, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    orientation?: "horizontal" | "vertical" | null;
    className?: string;
  };

  return (
    <SeparatorPrimitive
      orientation={p.orientation ?? "horizontal"}
      className={p.className ?? undefined}
    />
  );
}

// ── Heading ─────────────────────────────────────────────────────────────
type HeadingAdapterProps = Partial<UswdsProps["Heading"]> &
  Envelope<UswdsProps["Heading"]>;

function Heading(all: HeadingAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <HeadingPrimitive
      level={p.level ?? "h2"}
      className={p.className ?? undefined}
    >
      {children}
    </HeadingPrimitive>
  );
}

// ── Text ────────────────────────────────────────────────────────────────
type TextAdapterProps = Partial<UswdsProps["Text"]> &
  Envelope<UswdsProps["Text"]>;

function Text(all: TextAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TextPrimitive
      size={p.size ?? "base"}
      weight={p.weight ?? "normal"}
      color={p.color ?? "default"}
      as={p.as ?? "p"}
      className={p.className ?? undefined}
    >
      {children}
    </TextPrimitive>
  );
}

// ── Image ───────────────────────────────────────────────────────────────
type ImageAdapterProps = Partial<UswdsProps["Image"]> &
  Envelope<UswdsProps["Image"]>;

function Image(all: ImageAdapterProps) {
  const { props: envelopeProps, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    src?: string;
    alt?: string;
    width?: number | null;
    height?: number | null;
    className?: string;
  };

  return (
    <ImagePrimitive
      src={p.src ?? ""}
      alt={p.alt ?? ""}
      width={p.width ?? undefined}
      height={p.height ?? undefined}
      className={p.className ?? undefined}
    />
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────
type AvatarAdapterProps = Partial<UswdsProps["Avatar"]> &
  Envelope<UswdsProps["Avatar"]>;

function Avatar(all: AvatarAdapterProps) {
  const { props: envelopeProps, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    src?: string | null;
    alt?: string | null;
    fallback?: string | null;
    size?: "sm" | "md" | "lg" | null;
    className?: string | null;
  };

  const sizeClass =
    p.size === "sm" ? "size-6" : p.size === "lg" ? "size-14" : "size-10";

  return (
    <AvatarPrimitive className={cn(sizeClass, p.className ?? undefined)}>
      {p.src ? <AvatarImage src={p.src} alt={p.alt ?? ""} /> : null}
      <AvatarFallback>{p.fallback ?? ""}</AvatarFallback>
    </AvatarPrimitive>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────
type BadgeAdapterProps = Partial<UswdsProps["Badge"]> &
  Envelope<UswdsProps["Badge"]>;

function Badge(all: BadgeAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const variant = (p.variant ?? "default") as
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";

  return (
    <BadgePrimitive
      variant={variant}
      className={p.className ?? undefined}
    >
      {children}
    </BadgePrimitive>
  );
}

// ── Alert ───────────────────────────────────────────────────────────────
type AlertAdapterProps = Partial<UswdsProps["Alert"]> &
  Envelope<UswdsProps["Alert"]>;

function Alert(all: AlertAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const variant = (p.variant ?? "info") as
    | "info"
    | "success"
    | "warning"
    | "error"
    | "emergency";

  return (
    <AlertPrimitive
      variant={variant}
      title={p.title ?? undefined}
      slim={p.slim ?? false}
      noIcon={p.noIcon ?? false}
      className={p.className ?? undefined}
    >
      {children}
    </AlertPrimitive>
  );
}

// ── Progress ────────────────────────────────────────────────────────────
type ProgressAdapterProps = Partial<UswdsProps["Progress"]> &
  Envelope<UswdsProps["Progress"]>;

function Progress(all: ProgressAdapterProps) {
  const { props: envelopeProps, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    value?: number | null;
    max?: number | null;
    className?: string | null;
  };

  return (
    <ProgressPrimitive
      value={p.value ?? 0}
      max={p.max ?? 100}
      className={p.className ?? undefined}
    />
  );
}

export const uswdsComponents: Record<string, ComponentType<any>> = {
  Button,
  Card,
  Stack,
  Grid,
  Separator,
  Heading,
  Text,
  Image,
  Avatar,
  Badge,
  Alert,
  Progress,
};

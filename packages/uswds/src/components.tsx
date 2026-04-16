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
import { Skeleton as SkeletonPrimitive } from "./ui/skeleton";
import { Spinner as SpinnerPrimitive } from "./ui/spinner";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox as CheckboxPrimitive } from "./ui/checkbox";
import {
  Select as SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Input as InputPrimitive } from "./ui/input";
import { Textarea as TextareaPrimitive } from "./ui/textarea";
import { ButtonGroup as ButtonGroupPrimitive } from "./ui/button-group";
import { Link as LinkPrimitive } from "./ui/link";
import {
  Table as TablePrimitive,
  TableHeader as TableHeaderPrimitive,
  TableBody as TableBodyPrimitive,
  TableRow as TableRowPrimitive,
  TableHead as TableHeadPrimitive,
  TableCell as TableCellPrimitive,
  TableCaption as TableCaptionPrimitive,
} from "./ui/table";
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

// ── Skeleton ────────────────────────────────────────────────────────────
type SkeletonAdapterProps = Partial<UswdsProps["Skeleton"]> &
  Envelope<UswdsProps["Skeleton"]>;

function Skeleton(all: SkeletonAdapterProps) {
  const { props: envelopeProps, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    className?: string | null;
  };

  return <SkeletonPrimitive className={p.className ?? undefined} />;
}

// ── Spinner ─────────────────────────────────────────────────────────────
type SpinnerAdapterProps = Partial<UswdsProps["Spinner"]> &
  Envelope<UswdsProps["Spinner"]>;

function Spinner(all: SpinnerAdapterProps) {
  const { props: envelopeProps, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    size?: "sm" | "md" | "lg" | null;
    className?: string | null;
  };

  return (
    <SpinnerPrimitive
      size={p.size ?? "md"}
      className={p.className ?? undefined}
    />
  );
}

// ── Radio ──────────────────────────────────────────────────────────────
type RadioAdapterProps = Partial<UswdsProps["Radio"]> &
  Envelope<UswdsProps["Radio"]>;

function Radio(all: RadioAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    label?: string | null;
    name?: string | null;
    options?: Array<{ value: string; label: string; hint?: string | null }> | null;
    value?: string | null;
    disabled?: boolean | null;
    className?: string | null;
  };

  const groupId = React.useId();
  const options = p.options ?? [];

  return (
    <div className={p.className ?? undefined}>
      {p.label && (
        <span
          id={`${groupId}-label`}
          className="block font-bold font-sans text-ink mb-2"
        >
          {p.label}
        </span>
      )}
      <RadioGroup
        defaultValue={p.value ?? undefined}
        disabled={p.disabled ?? false}
        aria-labelledby={p.label ? `${groupId}-label` : undefined}
      >
        {options.map((opt, idx) => {
          const itemId = `${groupId}-${idx}`;
          return (
            <div key={opt.value} className="flex items-start gap-2">
              <RadioGroupItem
                value={opt.value}
                id={itemId}
                aria-labelledby={`${itemId}-label`}
              />
              <div>
                <label
                  id={`${itemId}-label`}
                  htmlFor={itemId}
                  className="font-sans text-base text-ink cursor-pointer"
                >
                  {opt.label}
                </label>
                {opt.hint && (
                  <span className="text-sm text-base-dark block">
                    {opt.hint}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

// ── Checkbox ───────────────────────────────────────────────────────────
type CheckboxAdapterProps = Partial<UswdsProps["Checkbox"]> &
  Envelope<UswdsProps["Checkbox"]>;

function Checkbox(all: CheckboxAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    label?: string | null;
    hint?: string | null;
    name?: string | null;
    checked?: boolean | null;
    disabled?: boolean | null;
    className?: string | null;
  };

  return (
    <CheckboxPrimitive
      label={p.label ?? undefined}
      hint={p.hint ?? undefined}
      name={p.name ?? undefined}
      defaultChecked={p.checked ?? false}
      disabled={p.disabled ?? false}
      className={p.className ?? undefined}
    />
  );
}

// ── Select ─────────────────────────────────────────────────────────────
type SelectAdapterProps = Partial<UswdsProps["Select"]> &
  Envelope<UswdsProps["Select"]>;

function Select(all: SelectAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    label?: string | null;
    hint?: string | null;
    error?: string | null;
    placeholder?: string | null;
    options?: Array<{ value: string; label: string }> | null;
    value?: string | null;
    disabled?: boolean | null;
    className?: string | null;
  };

  const selectId = React.useId();
  const options = p.options ?? [];

  return (
    <div className={cn(p.error && "border-l-4 border-error-dark pl-3", p.className ?? undefined)}>
      {p.label && (
        <label
          id={`${selectId}-label`}
          className="block font-bold font-sans text-ink mb-1"
        >
          {p.label}
        </label>
      )}
      {p.hint && (
        <span className="block text-sm text-base-dark mb-1">{p.hint}</span>
      )}
      {p.error && (
        <span className="text-error-dark font-bold text-sm mt-1 block">
          {p.error}
        </span>
      )}
      <SelectRoot
        defaultValue={p.value ?? undefined}
        disabled={p.disabled ?? false}
      >
        <SelectTrigger aria-labelledby={p.label ? `${selectId}-label` : undefined}>
          <SelectValue placeholder={p.placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  );
}

// ── Textarea ───────────────────────────────────────────────────────────
type TextareaAdapterProps = Partial<UswdsProps["Textarea"]> &
  Envelope<UswdsProps["Textarea"]>;

function Textarea(all: TextareaAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    placeholder?: string | null;
    disabled?: boolean | null;
    name?: string | null;
    label?: string | null;
    hint?: string | null;
    error?: string | null;
    value?: string | null;
    rows?: number | null;
    className?: string | null;
  };

  return (
    <TextareaPrimitive
      placeholder={p.placeholder ?? undefined}
      disabled={p.disabled ?? false}
      name={p.name ?? undefined}
      label={p.label ?? undefined}
      hint={p.hint ?? undefined}
      error={p.error ?? undefined}
      defaultValue={p.value ?? undefined}
      rows={p.rows ?? 3}
      className={p.className ?? undefined}
    />
  );
}

// ── Input ──────────────────────────────────────────────────────────────
type InputAdapterProps = Partial<UswdsProps["Input"]> &
  Envelope<UswdsProps["Input"]>;

function Input(all: InputAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    type?: "text" | "email" | "password" | "tel" | "url" | "number" | "search" | null;
    placeholder?: string | null;
    disabled?: boolean | null;
    name?: string | null;
    label?: string | null;
    hint?: string | null;
    error?: string | null;
    value?: string | null;
    className?: string | null;
  };

  return (
    <InputPrimitive
      type={p.type ?? "text"}
      placeholder={p.placeholder ?? undefined}
      disabled={p.disabled ?? false}
      name={p.name ?? undefined}
      label={p.label ?? undefined}
      hint={p.hint ?? undefined}
      error={p.error ?? undefined}
      defaultValue={p.value ?? undefined}
      className={p.className ?? undefined}
    />
  );
}

// ── ButtonGroup ────────────────────────────────────────────────────────
type ButtonGroupAdapterProps = Partial<UswdsProps["ButtonGroup"]> &
  Envelope<UswdsProps["ButtonGroup"]>;

function ButtonGroup(all: ButtonGroupAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <ButtonGroupPrimitive
      orientation={p.orientation ?? "horizontal"}
      attached={p.attached ?? false}
      className={p.className ?? undefined}
    >
      {children}
    </ButtonGroupPrimitive>
  );
}

// ── Link ───────────────────────────────────────────────────────────────
type LinkAdapterProps = Partial<UswdsProps["Link"]> &
  Envelope<UswdsProps["Link"]>;

function Link(all: LinkAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) } as {
    href?: string;
    external?: boolean | null;
    className?: string | null;
  };

  return (
    <LinkPrimitive
      href={p.href ?? "#"}
      external={p.external ?? false}
      className={p.className ?? undefined}
    >
      {children}
    </LinkPrimitive>
  );
}

// ── Table ──────────────────────────────────────────────────────────────
type TableAdapterProps = Partial<UswdsProps["Table"]> &
  Envelope<UswdsProps["Table"]>;

function Table(all: TableAdapterProps) {
  const { props: envelopeProps, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TablePrimitive
      striped={p.striped ?? false}
      borderless={p.borderless ?? false}
      className={p.className ?? undefined}
    >
      {p.caption && <TableCaptionPrimitive>{p.caption}</TableCaptionPrimitive>}
      {children}
    </TablePrimitive>
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
  Skeleton,
  Spinner,
  Table,
  Radio,
  Checkbox,
  Select,
  Textarea,
  Input,
  ButtonGroup,
  Link,
};

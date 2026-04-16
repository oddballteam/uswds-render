import * as React from "react";

import { cn } from "../lib/cn";

// ── Table ──────────────────────────────────────────────────────────────

function Table({
  className,
  striped,
  borderless,
  children,
  ...props
}: React.ComponentProps<"table"> & {
  striped?: boolean | null;
  borderless?: boolean | null;
}) {
  return (
    <table
      data-slot="table"
      className={cn(
        "w-full border-collapse font-sans text-base",
        striped && "[&_tbody_tr:nth-child(odd)]:bg-base-lightest",
        !borderless && "border border-base-light",
        className,
      )}
      {...props}
    >
      {children}
    </table>
  );
}

// ── TableHeader ────────────────────────────────────────────────────────

function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

// ── TableBody ──────────────────────────────────────────────────────────

function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

// ── TableRow ───────────────────────────────────────────────────────────

function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />;
}

// ── TableHead ──────────────────────────────────────────────────────────

function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "bg-base-lighter text-ink font-bold text-left px-4 py-2",
        className,
      )}
      {...props}
    />
  );
}

// ── TableCell ──────────────────────────────────────────────────────────

function TableCell({
  className,
  borderless,
  ...props
}: React.ComponentProps<"td"> & { borderless?: boolean | null }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-2",
        !borderless && "border-b border-base-light",
        className,
      )}
      {...props}
    />
  );
}

// ── TableCaption ───────────────────────────────────────────────────────

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("caption-top text-left font-bold text-lg mb-2", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};

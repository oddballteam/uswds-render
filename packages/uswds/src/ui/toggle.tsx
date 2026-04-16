"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "../lib/cn";

function Toggle({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold font-sans border-2 border-ink text-ink bg-white hover:bg-base-lighter disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary focus-visible:outline-2 focus-visible:outline-primary transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export { Toggle };

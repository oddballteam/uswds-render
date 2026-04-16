"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "../lib/cn";

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("border-b border-base-lighter", className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        "flex w-full items-center justify-between bg-base-lighter px-4 py-3 text-left font-bold font-sans text-ink hover:bg-base-light data-[state=open]:bg-base-light focus-visible:outline-2 focus-visible:outline-primary [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="size-5 transition-transform duration-200"
        aria-hidden="true"
      />
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className="overflow-hidden"
      {...props}
    >
      <div className={cn("px-4 py-3 bg-white", className)}>{children}</div>
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

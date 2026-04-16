"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "../lib/cn";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  bordered,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  bordered?: boolean;
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        bordered
          ? "border-2 border-base-lighter rounded-md mb-1"
          : "border-b border-base-lighter",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
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
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden"
      {...props}
    >
      <div className={cn("px-4 py-3 bg-white", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

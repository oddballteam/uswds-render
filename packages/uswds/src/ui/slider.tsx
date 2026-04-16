"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "../lib/cn";

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue"
> & {
  label?: string | null;
  value?: number | null;
};

function Slider({ className, label, id, value, min = 0, max = 100, ...props }: SliderProps) {
  const autoId = React.useId();
  const sliderId = id ?? autoId;
  const labelId = `${sliderId}-label`;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          id={labelId}
          htmlFor={sliderId}
          className="block font-bold font-sans text-ink mb-2"
        >
          {label}
        </label>
      )}
      <SliderPrimitive.Root
        data-slot="slider"
        id={sliderId}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ?? "Slider"}
        defaultValue={value != null ? [value] : [min]}
        min={min}
        max={max}
        className="relative flex items-center w-full max-w-md h-5 touch-none select-none"
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-base-lighter">
          <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={label ?? "Slider"}
          className="block size-5 rounded-full bg-primary border-2 border-white shadow focus-visible:outline-2 focus-visible:outline-primary"
        />
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };

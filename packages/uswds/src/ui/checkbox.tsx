"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";

import { cn } from "../lib/cn";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: string | null;
  hint?: string | null;
};

function Checkbox({
  className,
  label,
  hint,
  id,
  ...props
}: CheckboxProps) {
  const autoId = React.useId();
  const checkboxId = id ?? autoId;

  const labelId = `${checkboxId}-label`;

  return (
    <div className={cn("flex items-start gap-2", className)}>
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        id={checkboxId}
        aria-labelledby={label ? labelId : undefined}
        className="size-5 border-2 border-ink rounded-sm bg-white data-[state=checked]:bg-primary data-[state=checked]:border-primary flex items-center justify-center shrink-0 mt-0.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-3 text-white" aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {(label || hint) && (
        <div>
          {label && (
            <label
              id={labelId}
              htmlFor={checkboxId}
              className="font-sans text-base text-ink cursor-pointer"
            >
              {label}
            </label>
          )}
          {hint && (
            <span className="text-sm text-base-dark block">{hint}</span>
          )}
        </div>
      )}
    </div>
  );
}

export { Checkbox };

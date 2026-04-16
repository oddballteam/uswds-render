"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "../lib/cn";

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  label?: string | null;
};

function Switch({ className, label, id, ...props }: SwitchProps) {
  const autoId = React.useId();
  const switchId = id ?? autoId;
  const labelId = `${switchId}-label`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SwitchPrimitive.Root
        data-slot="switch"
        id={switchId}
        aria-labelledby={label ? labelId : undefined}
        className="relative h-6 w-11 rounded-full bg-base-light data-[state=checked]:bg-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-white translate-x-0.5 data-[state=checked]:translate-x-5 transition-transform" />
      </SwitchPrimitive.Root>
      {label && (
        <label
          id={labelId}
          htmlFor={switchId}
          className="font-sans text-base text-ink cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
}

export { Switch };

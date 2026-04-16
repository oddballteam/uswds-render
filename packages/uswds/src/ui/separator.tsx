import * as React from "react";

import { cn } from "../lib/cn";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical" | null;
  className?: string;
};

function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        data-slot="separator"
        role="separator"
        aria-orientation="vertical"
        className={cn("h-full w-px bg-base-lighter", className)}
      />
    );
  }
  return (
    <hr
      data-slot="separator"
      className={cn(
        "w-full h-px border-0 bg-base-lighter my-0",
        className,
      )}
    />
  );
}

export { Separator };

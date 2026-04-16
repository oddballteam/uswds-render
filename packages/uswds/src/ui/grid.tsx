import * as React from "react";

import { cn } from "../lib/cn";

const gapMap: Record<string, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

type GridProps = React.ComponentProps<"div"> & {
  columns?: number | null;
  gap?: "sm" | "md" | "lg" | "xl" | null;
};

function Grid({
  className,
  columns,
  gap,
  style,
  ...props
}: GridProps) {
  const n = Math.max(1, Math.min(12, columns ?? 1));
  const gapClass = gapMap[gap ?? "md"] ?? "gap-4";

  return (
    <div
      data-slot="grid"
      className={cn("grid", gapClass, className)}
      style={{
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    />
  );
}

export { Grid };

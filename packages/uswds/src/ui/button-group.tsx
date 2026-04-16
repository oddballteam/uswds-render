import * as React from "react";

import { cn } from "../lib/cn";

type ButtonGroupProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical" | null;
  attached?: boolean | null;
};

function ButtonGroup({
  className,
  orientation,
  attached,
  children,
  ...props
}: ButtonGroupProps) {
  const dir = orientation ?? "horizontal";

  return (
    <div
      data-slot="button-group"
      className={cn(
        "inline-flex",
        dir === "horizontal" ? "flex-row" : "flex-col",
        attached
          ? "gap-0 [&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md"
          : "gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { ButtonGroup };

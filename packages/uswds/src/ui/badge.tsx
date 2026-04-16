import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-block rounded-sm px-2 py-0.5 text-xs font-bold font-sans uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-base-darker text-white",
        secondary: "bg-base-lighter text-ink",
        success: "bg-success text-white",
        warning: "bg-warning text-ink",
        error: "bg-error text-white",
        info: "bg-info text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

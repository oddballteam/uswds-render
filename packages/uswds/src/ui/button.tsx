import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold font-sans rounded-md px-5 py-3 text-base leading-tight cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark active:bg-primary-darker",
        secondary: "bg-secondary text-white hover:bg-secondary-dark",
        outline:
          "bg-transparent text-primary border-2 border-primary hover:bg-primary-lighter",
        "accent-cool":
          "bg-accent-cool text-ink hover:bg-accent-cool-dark",
        "accent-warm":
          "bg-accent-warm text-ink hover:bg-accent-warm-dark",
        base: "bg-base text-white hover:bg-base-dark",
        ghost: "bg-transparent text-primary hover:bg-primary-lighter",
        link: "bg-transparent text-primary underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "",
        sm: "text-sm px-3 py-2",
        lg: "text-lg px-6 py-4",
        big: "text-xl px-8 py-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const textVariants = cva("font-sans leading-normal", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-ink",
      muted: "text-base-dark",
      primary: "text-primary",
      error: "text-error-dark",
      success: "text-success-dark",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    color: "default",
  },
});

type TextAs = "p" | "span" | "div";

type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: TextAs | null;
  };

function Text({
  as,
  size,
  weight,
  color,
  className,
  children,
  ...props
}: TextProps) {
  const Component = (as ?? "p") as TextAs;
  return React.createElement(
    Component,
    {
      "data-slot": "text",
      className: cn(textVariants({ size, weight, color }), className),
      ...props,
    },
    children,
  );
}

export { Text, textVariants };

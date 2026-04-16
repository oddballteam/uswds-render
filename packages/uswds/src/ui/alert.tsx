import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

import { cn } from "../lib/cn";

const alertVariants = cva("border-l-8 p-4 font-sans", {
  variants: {
    variant: {
      info: "border-info-dark bg-info-lighter",
      success: "border-success-dark bg-success-lighter",
      warning: "border-warning-dark bg-warning-lighter",
      error: "border-error-dark bg-error-lighter",
      emergency: "border-error-darker bg-error-dark text-white",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertOctagon,
  emergency: AlertOctagon,
} as const;

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title?: string | null;
    slim?: boolean | null;
    noIcon?: boolean | null;
  };

function Alert({
  className,
  variant = "info",
  title,
  slim,
  noIcon,
  children,
  ...props
}: AlertProps) {
  const resolvedVariant = variant ?? "info";
  const IconComp = iconMap[resolvedVariant];

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({ variant: resolvedVariant }),
        slim && "py-2",
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-2">
        {!noIcon && IconComp && (
          <IconComp className="inline-block mr-2 size-5 shrink-0 mt-0.5" aria-hidden="true" />
        )}
        <div>
          {title && (
            <div className={cn("text-lg font-bold mb-1", resolvedVariant === "emergency" ? "text-white" : "text-ink")}>
              {title}
            </div>
          )}
          {children && (
            <div className={cn("text-base", resolvedVariant === "emergency" ? "text-white" : "text-ink")}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Alert, alertVariants };

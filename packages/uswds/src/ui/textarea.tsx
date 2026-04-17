import * as React from "react";

import { cn } from "../lib/cn";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string | null;
  hint?: string | null;
  error?: string | null;
};

function Textarea({
  className,
  label,
  hint,
  error,
  id,
  rows,
  ...props
}: TextareaProps) {
  const autoId = React.useId();
  const textareaId = id ?? autoId;

  return (
    <div className={cn(error && "border-l-4 border-error-dark pl-3", className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block font-bold font-sans text-ink mb-1"
        >
          {label}
        </label>
      )}
      {hint && (
        <span className="block text-sm text-base-dark mb-1">{hint}</span>
      )}
      {error && (
        <span className="text-error-dark font-bold text-sm mt-1 block">
          {error}
        </span>
      )}
      <textarea
        data-slot="textarea"
        id={textareaId}
        rows={rows ?? 3}
        className="block w-full max-w-full border border-base-dark rounded-md px-3 py-2 text-base font-sans focus-visible:outline-2 focus-visible:outline-primary disabled:bg-base-lighter disabled:cursor-not-allowed min-h-[100px] resize-y"
        {...props}
      />
    </div>
  );
}

export { Textarea };

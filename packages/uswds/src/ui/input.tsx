import * as React from "react";

import { cn } from "../lib/cn";

type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type?:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "number"
    | "search"
    | null;
  label?: string | null;
  hint?: string | null;
  error?: string | null;
};

function Input({
  className,
  type,
  label,
  hint,
  error,
  id,
  ...props
}: InputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <div className={cn(error && "border-l-4 border-error-dark pl-3", className)}>
      {label && (
        <label
          htmlFor={inputId}
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
      <input
        data-slot="input"
        id={inputId}
        type={type ?? "text"}
        className="block w-full max-w-md border border-base-dark rounded-md px-3 py-2 text-base font-sans focus-visible:outline-2 focus-visible:outline-primary disabled:bg-base-lighter disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
}

export { Input };

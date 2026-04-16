import * as React from "react";

import { cn } from "../lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const levelClasses: Record<HeadingLevel, string> = {
  h1: "text-5xl",
  h2: "text-4xl",
  h3: "text-3xl",
  h4: "text-2xl",
  h5: "text-xl",
  h6: "text-lg",
};

type HeadingProps = React.ComponentProps<"h2"> & {
  level?: HeadingLevel | null;
};

function Heading({
  level,
  className,
  children,
  ...props
}: HeadingProps) {
  const lvl: HeadingLevel = level ?? "h2";
  return React.createElement(
    lvl,
    {
      "data-slot": "heading",
      className: cn(
        "font-sans font-bold leading-tight text-ink",
        levelClasses[lvl],
        className,
      ),
      ...props,
    },
    children,
  );
}

export { Heading };

import * as React from "react";

import { cn } from "../lib/cn";

function Image({
  className,
  ...props
}: React.ComponentProps<"img">) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      data-slot="image"
      className={cn("max-w-full h-auto", className)}
      {...props}
    />
  );
}

export { Image };

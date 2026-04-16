import * as React from "react";
import { ExternalLink } from "lucide-react";

import { cn } from "../lib/cn";

type LinkProps = React.ComponentProps<"a"> & {
  external?: boolean | null;
};

function Link({ className, external, children, ...props }: LinkProps) {
  return (
    <a
      data-slot="link"
      className={cn(
        "text-primary underline underline-offset-2 hover:text-primary-dark visited:text-violet focus-visible:outline-2 focus-visible:outline-primary",
        className,
      )}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...props}
    >
      {children}
      {external && (
        <ExternalLink
          className="inline-block ml-1 size-3.5 align-text-bottom"
          aria-hidden="true"
        />
      )}
    </a>
  );
}

export { Link };

import { z } from "zod";

export type ComponentDefinition = {
  props: z.ZodTypeAny;
  slots?: string[];
  description: string;
  example: unknown;
};

export const uswdsComponentDefinitions = {
  Button: {
    props: z.object({
      variant: z
        .enum([
          "default",
          "secondary",
          "outline",
          "accent-cool",
          "accent-warm",
          "base",
          "ghost",
          "link",
        ])
        .nullish(),
      size: z.enum(["default", "sm", "lg", "big"]).nullish(),
      disabled: z.boolean().nullish(),
      type: z.enum(["button", "submit", "reset"]).nullish(),
      onClick: z.string().nullish().describe("Action binding name"),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS button. variant=default maps to usa-button, secondary to usa-button--secondary, etc.",
    example: { variant: "default", size: "default" },
  },
} satisfies Record<string, ComponentDefinition>;

export type UswdsProps = {
  [K in keyof typeof uswdsComponentDefinitions]: z.infer<
    (typeof uswdsComponentDefinitions)[K]["props"]
  >;
};

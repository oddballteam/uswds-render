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
  Card: {
    props: z.object({
      title: z.string().nullish(),
      description: z.string().nullish(),
      maxWidth: z.enum(["sm", "md", "lg", "full"]).nullish(),
      centered: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Container card for content sections. Maps to usa-card.",
    example: { title: "Overview", description: "Your account summary" },
  },
  Stack: {
    props: z.object({
      direction: z.enum(["horizontal", "vertical"]).nullish(),
      gap: z.enum(["none", "sm", "md", "lg", "xl"]).nullish(),
      align: z.enum(["start", "center", "end", "stretch"]).nullish(),
      justify: z
        .enum(["start", "center", "end", "between", "around"])
        .nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Flex container for layouts",
    example: { direction: "vertical", gap: "md" },
  },
  Grid: {
    props: z.object({
      columns: z.number().nullish(),
      gap: z.enum(["sm", "md", "lg", "xl"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Grid layout (1-12 columns), built on USWDS grid-row/grid-col",
    example: { columns: 3, gap: "md" },
  },
} satisfies Record<string, ComponentDefinition>;

export type UswdsProps = {
  [K in keyof typeof uswdsComponentDefinitions]: z.infer<
    (typeof uswdsComponentDefinitions)[K]["props"]
  >;
};

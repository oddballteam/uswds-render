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
  Separator: {
    props: z.object({
      orientation: z.enum(["horizontal", "vertical"]).nullish(),
    }),
    description: "Visual separator line",
    example: { orientation: "horizontal" },
  },
  Heading: {
    props: z.object({
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Semantic heading element, USWDS type-scale",
    example: { level: "h2" },
  },
  Text: {
    props: z.object({
      size: z.enum(["xs", "sm", "base", "lg", "xl"]).nullish(),
      weight: z.enum(["normal", "medium", "semibold", "bold"]).nullish(),
      color: z
        .enum(["default", "muted", "primary", "error", "success"])
        .nullish(),
      as: z.enum(["p", "span", "div"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Text/paragraph with USWDS type styles",
    example: { size: "base" },
  },
  Image: {
    props: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number().nullish(),
      height: z.number().nullish(),
      className: z.string().nullish(),
    }),
    description: "Image element (<img>)",
    example: { src: "/logo.png", alt: "Logo" },
  },
  Avatar: {
    props: z.object({
      src: z.string().nullish(),
      alt: z.string().nullish(),
      fallback: z.string().nullish(),
      size: z.enum(["sm", "md", "lg"]).nullish(),
      className: z.string().nullish(),
    }),
    description:
      "Avatar image with fallback initials (uses @radix-ui/react-avatar)",
    example: { fallback: "JD", size: "md" },
  },
  Badge: {
    props: z.object({
      variant: z
        .enum(["default", "secondary", "success", "warning", "error", "info"])
        .nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "Small status/label pill. Maps to USWDS tag component.",
    example: { variant: "default" },
  },
  Alert: {
    props: z.object({
      variant: z
        .enum(["info", "success", "warning", "error", "emergency"])
        .nullish(),
      title: z.string().nullish(),
      slim: z.boolean().nullish(),
      noIcon: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS alert (usa-alert). Variants: info/success/warning/error/emergency.",
    example: { variant: "info", title: "Heads up" },
  },
  Progress: {
    props: z.object({
      value: z.number().nullish(),
      max: z.number().nullish(),
      className: z.string().nullish(),
    }),
    description: "Progress bar (uses @radix-ui/react-progress)",
    example: { value: 40 },
  },
  Skeleton: {
    props: z.object({
      className: z.string().nullish(),
    }),
    description: "Loading placeholder",
    example: {},
  },
  Spinner: {
    props: z.object({
      size: z.enum(["sm", "md", "lg"]).nullish(),
      className: z.string().nullish(),
    }),
    description: "Loading spinner",
    example: { size: "md" },
  },
  Table: {
    props: z.object({
      caption: z.string().nullish(),
      striped: z.boolean().nullish(),
      borderless: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS table (usa-table). Children are TableHeader/TableBody rows.",
    example: { caption: "Users", striped: true },
  },
  Textarea: {
    props: z.object({
      placeholder: z.string().nullish(),
      disabled: z.boolean().nullish(),
      name: z.string().nullish(),
      label: z.string().nullish(),
      hint: z.string().nullish(),
      error: z.string().nullish(),
      value: z.string().nullish().describe("Data-bound value"),
      rows: z.number().nullish(),
      className: z.string().nullish(),
    }),
    description: "USWDS textarea (usa-textarea)",
    example: { label: "Comments", placeholder: "Enter your comments" },
  },
  Input: {
    props: z.object({
      type: z
        .enum(["text", "email", "password", "tel", "url", "number", "search"])
        .nullish(),
      placeholder: z.string().nullish(),
      disabled: z.boolean().nullish(),
      name: z.string().nullish(),
      label: z.string().nullish(),
      hint: z.string().nullish(),
      error: z.string().nullish(),
      value: z.string().nullish().describe("Data-bound value"),
      className: z.string().nullish(),
    }),
    description: "USWDS text input (usa-input)",
    example: { type: "text", label: "Name", placeholder: "Jane Doe" },
  },
  ButtonGroup: {
    props: z.object({
      orientation: z.enum(["horizontal", "vertical"]).nullish(),
      attached: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Group of related buttons (usa-button-group)",
    example: { orientation: "horizontal" },
  },
  Link: {
    props: z.object({
      href: z.string(),
      external: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Anchor link with USWDS styling",
    example: { href: "/about" },
  },
} satisfies Record<string, ComponentDefinition>;

export type UswdsProps = {
  [K in keyof typeof uswdsComponentDefinitions]: z.infer<
    (typeof uswdsComponentDefinitions)[K]["props"]
  >;
};

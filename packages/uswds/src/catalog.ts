import { z } from "zod";

export type ComponentDefinition = {
  props: z.ZodTypeAny;
  slots?: string[];
  description: string;
  example: unknown;
};

export const uswdsComponentDefinitions: Record<string, ComponentDefinition> = {};

export type UswdsProps = Record<string, unknown>;

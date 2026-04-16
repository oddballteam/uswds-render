import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "Components/Skeleton",
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { className: "h-6 w-48" } };

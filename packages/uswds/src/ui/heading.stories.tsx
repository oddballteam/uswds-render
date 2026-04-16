import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
  component: Heading,
  title: "Components/Heading",
};
export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = { args: { children: "Page Heading", level: "h2" } };

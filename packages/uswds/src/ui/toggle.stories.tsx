import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  component: Toggle,
  title: "Components/Toggle",
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = { args: { children: "Bold" } };

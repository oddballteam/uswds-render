import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: "Components/Checkbox",
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { label: "I agree to the terms" } };

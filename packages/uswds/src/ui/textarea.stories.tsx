import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  title: "Components/Textarea",
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { label: "Comments", placeholder: "Enter your comments" } };

import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Components/Input",
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { label: "Full name", placeholder: "Enter your name" } };
export const WithError: Story = { args: { label: "Email", error: "Please enter a valid email address", placeholder: "email@example.com" } };

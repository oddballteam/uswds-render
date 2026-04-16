import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Components/Badge",
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Default" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
export const Success: Story = { args: { variant: "success", children: "Success" } };
export const Warning: Story = { args: { variant: "warning", children: "Warning" } };
export const ErrorVariant: Story = { args: { variant: "error", children: "Error" } };
export const Info: Story = { args: { variant: "info", children: "Info" } };

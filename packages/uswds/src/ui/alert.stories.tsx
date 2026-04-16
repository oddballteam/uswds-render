import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: "Components/Alert",
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = { args: { variant: "info", title: "Informational", children: "This is an informational alert." } };
export const Success: Story = { args: { variant: "success", title: "Success", children: "Operation completed successfully." } };
export const Warning: Story = { args: { variant: "warning", title: "Warning", children: "Please review before continuing." } };
export const Error: Story = { args: { variant: "error", title: "Error", children: "Something went wrong." } };
export const Emergency: Story = { args: { variant: "emergency", title: "Emergency", children: "Immediate action required." } };

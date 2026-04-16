import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Components/Button",
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Default" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
export const Outline: Story = { args: { variant: "outline", children: "Outline" } };
export const AccentCool: Story = { args: { variant: "accent-cool", children: "Accent Cool" } };
export const AccentWarm: Story = { args: { variant: "accent-warm", children: "Accent Warm" } };
export const Base: Story = { args: { variant: "base", children: "Base" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Ghost" } };
export const LinkVariant: Story = { args: { variant: "link", children: "Link" } };

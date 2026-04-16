import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = {
  component: ToggleGroup,
  title: "Components/ToggleGroup",
};
export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};

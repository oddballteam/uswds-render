import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Components/Select",
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option One</SelectItem>
        <SelectItem value="option2">Option Two</SelectItem>
        <SelectItem value="option3">Option Three</SelectItem>
      </SelectContent>
    </Select>
  ),
};

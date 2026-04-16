import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: "Components/Popover",
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>This is the popover content.</PopoverContent>
    </Popover>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { Button } from "./button";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "Components/Tooltip",
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

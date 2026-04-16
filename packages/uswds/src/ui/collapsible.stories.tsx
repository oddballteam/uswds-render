import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  component: Collapsible,
  title: "Components/Collapsible",
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
      <CollapsibleContent>This is the collapsible content area.</CollapsibleContent>
    </Collapsible>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ButtonGroup } from "./button-group";
import { Button } from "./button";

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
  title: "Components/ButtonGroup",
};
export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </ButtonGroup>
  ),
};

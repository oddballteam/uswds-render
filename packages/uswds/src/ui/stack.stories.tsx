import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Stack } from "./stack";

const meta: Meta<typeof Stack> = {
  component: Stack,
  title: "Components/Stack",
};
export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: () => (
    <Stack>
      <div>Item one</div>
      <div>Item two</div>
      <div>Item three</div>
    </Stack>
  ),
};

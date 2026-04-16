import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "Components/Avatar",
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar className="size-10">
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";
import { Button } from "./button";

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
  title: "Components/DropdownMenu",
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

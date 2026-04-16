import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "./drawer";
import { Button } from "./button";

const meta: Meta<typeof Drawer> = {
  component: Drawer,
  title: "Components/Drawer",
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>This is a description of the drawer content.</DrawerDescription>
        </DrawerHeader>
        <div className="p-6">Drawer body content goes here.</div>
      </DrawerContent>
    </Drawer>
  ),
};

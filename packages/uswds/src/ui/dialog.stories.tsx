import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import { Button } from "./button";

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: "Components/Dialog",
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a description of the dialog content.</DialogDescription>
        </DialogHeader>
        <p>Dialog body content goes here.</p>
      </DialogContent>
    </Dialog>
  ),
};

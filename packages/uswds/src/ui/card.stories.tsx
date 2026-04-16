import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";

const meta: Meta<typeof Card> = {
  component: Card,
  title: "Components/Card",
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A brief description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card body content. It can contain any elements.</p>
      </CardContent>
    </Card>
  ),
};

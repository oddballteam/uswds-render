import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: "Components/Tabs",
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab One</TabsTrigger>
        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        <TabsTrigger value="tab3">Tab Three</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for tab one.</TabsContent>
      <TabsContent value="tab2">Content for tab two.</TabsContent>
      <TabsContent value="tab3">Content for tab three.</TabsContent>
    </Tabs>
  ),
};

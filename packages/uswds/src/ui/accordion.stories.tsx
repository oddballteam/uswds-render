import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: "Components/Accordion",
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>Content for the first section.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>Content for the second section.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>Content for the third section.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" bordered>
        <AccordionTrigger>Bordered item one</AccordionTrigger>
        <AccordionContent>Content for bordered item one.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" bordered>
        <AccordionTrigger>Bordered item two</AccordionTrigger>
        <AccordionContent>Content for bordered item two.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

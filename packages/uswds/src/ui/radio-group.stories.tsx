import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  title: "Components/RadioGroup",
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="r1" />
        <label htmlFor="r1">Option One</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="r2" />
        <label htmlFor="r2">Option Two</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option3" id="r3" />
        <label htmlFor="r3">Option Three</label>
      </div>
    </RadioGroup>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  component: Text,
  title: "Components/Text",
};
export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = { args: { children: "This is a paragraph of body text styled with USWDS tokens." } };

import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./link";

const meta: Meta<typeof Link> = {
  component: Link,
  title: "Components/Link",
};
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = { args: { href: "#", children: "Internal link" } };

import type { Meta, StoryObj } from "@storybook/react";
import { Image } from "./image";

const meta: Meta<typeof Image> = {
  component: Image,
  title: "Components/Image",
};
export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = { args: { src: "https://via.placeholder.com/300x200", alt: "Placeholder image" } };

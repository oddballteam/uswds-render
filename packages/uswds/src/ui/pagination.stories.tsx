import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "Components/Pagination",
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = { args: { currentPage: 3, totalPages: 10 } };

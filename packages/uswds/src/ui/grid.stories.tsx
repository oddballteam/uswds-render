import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Grid } from "./grid";

const meta: Meta<typeof Grid> = {
  component: Grid,
  title: "Components/Grid",
};
export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  render: () => (
    <Grid columns={3}>
      <div style={{ background: "#e0e0e0", padding: 16 }}>Column 1</div>
      <div style={{ background: "#d0d0d0", padding: 16 }}>Column 2</div>
      <div style={{ background: "#c0c0c0", padding: 16 }}>Column 3</div>
    </Grid>
  ),
};

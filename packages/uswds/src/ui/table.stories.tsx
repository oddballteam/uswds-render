import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "./table";

const meta: Meta<typeof Table> = {
  component: Table,
  title: "Components/Table",
};
export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Sample data table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice Johnson</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>Inactive</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  render: () => (
    <Table striped>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Row 1</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Row 2</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Row 3</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

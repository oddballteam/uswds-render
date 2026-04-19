import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Modal", () => {
  const Modal = uswdsComponents.Modal as React.ComponentType<any>;

  it("renders when open is true", () => {
    render(
      <Modal id="test-modal" open heading="Modal title">
        Modal body content
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal title")).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("does not render dialog when open is false", () => {
    render(
      <Modal id="test-modal" open={false} heading="Hidden modal">
        Hidden content
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaults to not open when open prop is absent", () => {
    render(<Modal id="test-modal" heading="Default">Content</Modal>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders isLarge modal", () => {
    const { container } = render(
      <Modal id="large-modal" open isLarge heading="Large">Content</Modal>
    );
    expect(container.querySelector(".usa-modal--lg")).toBeInTheDocument();
  });

  it("renders heading text", () => {
    render(<Modal id="h-modal" open heading="My heading">Body</Modal>);
    expect(screen.getByText("My heading")).toBeInTheDocument();
  });

  it("has no a11y violations when open", async () => {
    const { container } = render(
      <Modal id="a11y-modal" open heading="Accessible modal">Body text</Modal>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("merges envelope props", () => {
    render(
      <Modal id="base" open={false} props={{ open: true, heading: "Envelope heading", id: "env-modal" }}>
        Body
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Envelope heading")).toBeInTheDocument();
  });
});

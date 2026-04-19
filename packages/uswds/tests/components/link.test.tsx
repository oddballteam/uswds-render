import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Link", () => {
  const Link = uswdsComponents.Link;

  it("renders with label prop as link text", () => {
    render(<Link href="/about" label="About" />);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("renders children when label prop is absent", () => {
    render(<Link href="/about">About us</Link>);
    expect(screen.getByRole("link", { name: "About us" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Link href="/about" label="About" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("sets href correctly", () => {
    render(<Link href="/contact" label="Contact" />);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });

  it("renders external variant", () => {
    const { container } = render(<Link href="https://example.com" label="External" variant="external" />);
    expect(container.querySelector(".usa-link--external")).toBeInTheDocument();
  });

  it("merges envelope props", () => {
    render(<Link href="/base" props={{ label: "Envelope label", href: "/overridden" }} />);
    expect(screen.getByRole("link", { name: "Envelope label" })).toHaveAttribute("href", "/overridden");
  });
});

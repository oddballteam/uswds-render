import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { uswdsComponents } from "../../src/components";

describe("Carousel", () => {
  const Carousel = uswdsComponents.Carousel;

  it("renders at least one slide", () => {
    render(
      <Carousel
        items={[
          { src: "/a.jpg", alt: "Image A" },
          { src: "/b.jpg", alt: "Image B" },
        ]}
      />,
    );
    const slides = screen.getAllByRole("group");
    expect(slides.length).toBeGreaterThanOrEqual(1);
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Carousel
        items={[
          { src: "/a.jpg", alt: "Image A" },
          { src: "/b.jpg", alt: "Image B" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

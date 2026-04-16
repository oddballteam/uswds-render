import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel";

const meta: Meta<typeof Carousel> = {
  component: Carousel,
  title: "Components/Carousel",
};
export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <div className="mx-16">
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <div className="bg-base-lighter p-8 text-center rounded-md">Slide 1</div>
          </CarouselItem>
          <CarouselItem>
            <div className="bg-base-lighter p-8 text-center rounded-md">Slide 2</div>
          </CarouselItem>
          <CarouselItem>
            <div className="bg-base-lighter p-8 text-center rounded-md">Slide 3</div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

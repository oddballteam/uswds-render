import { uswdsComponents } from "@oddball/json-render-uswds";

const UswdsText = uswdsComponents.Text;
const UswdsLink = uswdsComponents.Link;

export function OddballBanner() {
  return (
    <div className="w-full border-b-2 border-base-light bg-white px-4 py-2 text-sm sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1 gap-y-1 font-sans text-green-50v">
        <UswdsText as="span" size="sm" color="muted" className="!text-green-50v" text="An" />
        <UswdsLink
          href="https://oddball.io"
          external
          label="Oddball Labs"
          className="font-semibold text-green underline-offset-2 hover:underline"
        />
        <UswdsText as="span" size="sm" color="muted" className="!text-green-50v" text="product" />
      </div>
    </div>
  );
}

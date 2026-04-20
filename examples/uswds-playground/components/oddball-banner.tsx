import { uswdsComponents } from "@oddball/json-render-uswds";

const UswdsText = uswdsComponents.Text;
const UswdsLink = uswdsComponents.Link;

export function OddballBanner() {
  return (
    <div className="w-full border-b border-base-light bg-white px-4 py-2 text-sm sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1 gap-y-1 font-sans text-blue-60v">
        <UswdsText as="span" size="sm" className="!text-blue-60v" text="An" />
        <UswdsLink
          href="https://oddball.io"
          variant="external"
          className="font-semibold text-blue-60v underline-offset-2 hover:underline"
          label="Oddball Labs"
        />
        <UswdsText as="span" size="sm" className="!text-blue-60v" text="product" />
      </div>
    </div>
  );
}

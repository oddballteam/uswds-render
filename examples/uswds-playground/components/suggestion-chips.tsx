"use client";

import { uswdsComponents } from "@oddball/json-render-uswds";

const UswdsButton = uswdsComponents.Button;

export const SUGGESTIONS = [
  "What's the difference between Original Medicare, Medicare Advantage, and Part D?",
  "When can I join, switch, or drop a Medicare Advantage or Part D plan?",
  "What Medicare Advantage plans are available in ZIP 97201?",
  "Which Part D plans cover Eliquis and Jardiance?",
  "Use my saved drugs and pharmacies to show me the best Part D options.",
  "I can't afford this drug — what help should I look at first?",
] as const;

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((s) => (
        <UswdsButton
          key={s}
          type="button"
          className="max-w-full whitespace-normal text-left font-sans font-medium !bg-blue-5v !text-ink !border-blue-60v hover:!bg-primary-darker hover:!text-blue-5v hover:!border-primary-darker"
          onClick={() => onSelect(s)}
        >
          {s}
        </UswdsButton>
      ))}
    </div>
  );
}

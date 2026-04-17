"use client";

import { uswdsComponents } from "@oddball/json-render-uswds";

const UswdsButton = uswdsComponents.Button;

export const SUGGESTIONS = [
  "Compare my current Medicare plan with Plan G",
  "Show my VA appointments from the past month",
  "Check the status of my disability claim",
  "Help me understand my GI Bill benefits remaining",
  "Find VA facilities near Portland, OR",
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
          variant="outline"
          size="sm"
          className="max-w-full whitespace-normal text-left font-sans font-medium !border-green !text-green hover:!bg-green-5v"
          onClick={() => onSelect(s)}
        >
          {s}
        </UswdsButton>
      ))}
    </div>
  );
}

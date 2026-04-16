"use client";

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
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

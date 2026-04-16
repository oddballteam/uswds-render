export function OddballBanner() {
  return (
    <div className="w-full border-b border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      <div className="mx-auto flex max-w-6xl items-center gap-2">
        <span>An</span>
        <a
          href="https://oddball.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
        >
          Oddball Labs
        </a>
        <span>product</span>
      </div>
    </div>
  );
}

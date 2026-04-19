"use client"
import { useState } from "react"
import type { Spec } from "@json-render/react"
import { PlaygroundRenderer } from "@/lib/render/renderer"

interface SpecViewerProps {
  spec: Spec | null
  loading?: boolean
}

export function SpecViewer({ spec, loading }: SpecViewerProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview")

  if (!spec) return null

  return (
    <div className="overflow-hidden rounded-lg border-2 border-base-light bg-gray-1 font-sans text-ink shadow-sm">
      <div className="flex w-full border-b-2 border-base-light bg-base-lightest px-2">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "px-4 py-2 text-sm font-medium capitalize",
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-base-dark hover:text-ink",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "preview" ? (
        <div className="p-4">
          <PlaygroundRenderer spec={spec} loading={loading} />
        </div>
      ) : (
        <pre className="max-h-[min(70vh,32rem)] overflow-x-auto overflow-y-auto border-t-0 bg-base-lightest p-4 font-mono text-xs leading-relaxed text-primary-darker">
          <code>{JSON.stringify(spec, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}

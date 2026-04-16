import { useEffect, useMemo, useState } from "react";
import { SpecEditor } from "./components/SpecEditor";
import { SpecPreview } from "./components/SpecPreview";
import { PresetPicker } from "./components/PresetPicker";
import { PRESETS, DEFAULT_PRESET, type PresetKey } from "./specs";

function formatSpec(spec: unknown): string {
  return JSON.stringify(spec, null, 2);
}

export function App() {
  const [preset, setPreset] = useState<PresetKey>(DEFAULT_PRESET);
  const [source, setSource] = useState(() => formatSpec(PRESETS[DEFAULT_PRESET].spec));
  const [debouncedSource, setDebouncedSource] = useState(source);

  useEffect(() => {
    setSource(formatSpec(PRESETS[preset].spec));
  }, [preset]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSource(source), 150);
    return () => window.clearTimeout(id);
  }, [source]);

  const parsed = useMemo(() => {
    try {
      return { ok: true, value: JSON.parse(debouncedSource) as unknown };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, [debouncedSource]);

  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <div>
          <div className="text-lg font-semibold text-zinc-900">USWDS · json-render demo</div>
          <div className="text-xs text-zinc-500">Edit the spec on the left. The preview updates live.</div>
        </div>
        <PresetPicker value={preset} onChange={setPreset} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-2/5 flex-col border-r border-zinc-200 bg-white">
          <div className="flex-1 overflow-hidden">
            <SpecEditor value={source} onChange={setSource} />
          </div>
          {!parsed.ok && (
            <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-800">
              <strong>JSON error:</strong> {parsed.error}
            </div>
          )}
        </div>
        <div className="w-3/5 overflow-auto p-6">
          {parsed.ok ? <SpecPreview spec={parsed.value} /> : null}
        </div>
      </div>
    </div>
  );
}

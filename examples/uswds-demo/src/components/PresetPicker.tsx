import { PRESETS, type PresetKey } from "../specs";

interface PresetPickerProps {
  value: PresetKey;
  onChange: (key: PresetKey) => void;
}

export function PresetPicker({ value, onChange }: PresetPickerProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-700">
      <span className="font-medium">Preset:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PresetKey)}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm"
      >
        {(Object.keys(PRESETS) as PresetKey[]).map((k) => (
          <option key={k} value={k}>
            {PRESETS[k].label}
          </option>
        ))}
      </select>
    </label>
  );
}

import login from "./login.json";
import claimStatus from "./claim-status.json";
import dashboard from "./dashboard.json";
import blank from "./blank.json";

export type PresetKey = "login" | "claim-status" | "dashboard" | "blank";

export const PRESETS: Record<PresetKey, { label: string; spec: unknown }> = {
  dashboard: { label: "Benefits dashboard", spec: dashboard },
  "claim-status": { label: "Disability claim status", spec: claimStatus },
  login: { label: "Login form", spec: login },
  blank: { label: "Blank canvas", spec: blank },
};

export const DEFAULT_PRESET: PresetKey = "dashboard";

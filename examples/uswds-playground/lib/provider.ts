import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
type JSONObject = { [key: string]: JSONValue };
type ProviderOptions = Record<string, JSONObject>;

export type ProviderName = "anthropic" | "openai";

export type ProviderSelection = {
  name: ProviderName;
  model: LanguageModel;
  modelLabel: string;
  providerOptions?: ProviderOptions;
};

export function detectProvider(): ProviderSelection {
  if (process.env.OPENAI_API_KEY) {
    const modelLabel = "gpt-6-astra";
    return {
      name: "openai",
      model: openai(modelLabel),
      modelLabel,
      providerOptions: {
        openai: {
          // "high" produces better specs but 30–60s latency per turn.
          // "medium" halves latency and still gives good USWDS output with
          // the worked examples in the prompt. Override per-request later if needed.
          reasoningEffort: process.env.OPENAI_REASONING_EFFORT ?? "medium",
        },
      },
    };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    const modelLabel = "claude-fable-5-1";
    return {
      name: "anthropic",
      model: anthropic(modelLabel),
      modelLabel,
    };
  }
  throw new Error(
    "No AI provider configured. Set OPENAI_API_KEY (preferred) or ANTHROPIC_API_KEY in .env.local. See .env.local.example.",
  );
}

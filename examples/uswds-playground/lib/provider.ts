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
    const modelLabel = "gpt-5.5";
    return {
      name: "openai",
      // Cast required: @ai-sdk/openai typings currently top out at gpt-5.4.
      // GPT-5.5 is accepted by the Responses API per the model's official guide.
      model: openai(modelLabel as any),
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
    const modelLabel = "claude-haiku-4-5-20251001";
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

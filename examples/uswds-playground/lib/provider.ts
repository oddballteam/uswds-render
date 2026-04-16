import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type ProviderName = "anthropic" | "openai";

export function detectProvider(): { name: ProviderName; model: LanguageModel } {
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      name: "anthropic",
      model: anthropic("claude-haiku-4-5-20251001"),
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      name: "openai",
      model: openai("gpt-4o"),
    };
  }
  throw new Error(
    "No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local. See .env.local.example.",
  );
}

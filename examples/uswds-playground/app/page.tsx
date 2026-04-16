"use client";

import { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  SPEC_DATA_PART,
  SPEC_DATA_PART_TYPE,
  type SpecDataPart,
} from "@json-render/core";
import { useJsonRenderMessage } from "@json-render/react";
import { Streamdown } from "streamdown";
import { OddballBanner } from "@/components/oddball-banner";
import { SpecViewer } from "@/components/spec-viewer";
import { SuggestionChips } from "@/components/suggestion-chips";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// =============================================================================
// Types + transport
// =============================================================================

type AppDataParts = { [SPEC_DATA_PART]: SpecDataPart };
type AppMessage = UIMessage<unknown, AppDataParts>;

const transport = new DefaultChatTransport({ api: "/api/generate" });

// =============================================================================
// Message Bubble
// =============================================================================

function MessageBubble({ message }: { message: AppMessage }) {
  const isUser = message.role === "user";
  const { spec, text, hasSpec } = useJsonRenderMessage(message.parts);

  // Build ordered segments: collapse adjacent text, mark spec insertion point.
  const segments: Array<
    | { kind: "text"; text: string }
    | { kind: "spec" }
  > = [];
  let specInserted = false;

  for (const part of message.parts) {
    if (part.type === "text") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = (part as any).text as string | undefined;
      if (!t || !t.trim()) continue;
      const last = segments[segments.length - 1];
      if (last?.kind === "text") {
        last.text += t;
      } else {
        segments.push({ kind: "text", text: t });
      }
    } else if (part.type === SPEC_DATA_PART_TYPE && !specInserted) {
      segments.push({ kind: "spec" });
      specInserted = true;
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        {text && (
          <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-sky-700 px-4 py-2 text-sm leading-relaxed text-white">
            {text}
          </div>
        )}
      </div>
    );
  }

  const showSpecAtEnd = hasSpec && !specInserted;

  return (
    <div className="flex justify-start">
      <div className="flex w-full max-w-[90%] flex-col gap-3">
        {segments.map((seg, i) => {
          if (seg.kind === "text") {
            return (
              <div
                key={`text-${i}`}
                className="prose prose-sm max-w-none text-sm leading-relaxed dark:prose-invert"
              >
                <Streamdown>{seg.text}</Streamdown>
              </div>
            );
          }
          if (!hasSpec || !spec) return null;
          return <SpecViewer key={`spec-${i}`} spec={spec} />;
        })}
        {showSpecAtEnd && spec && <SpecViewer spec={spec} />}
      </div>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function Page() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, status, setMessages } = useChat<AppMessage>({
    transport,
  });
  const isStreaming = status === "streaming" || status === "submitted";
  const isEmpty = messages.length === 0;

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    void sendMessage({ text: trimmed });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <OddballBanner />
      <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-6 py-3 text-white dark:border-zinc-800">
        <div className="text-lg font-semibold">USWDS Playground</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-zinc-800 hover:text-white"
            onClick={() => setMessages([])}
          >
            Start Over
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {isEmpty ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-24">
              <h1 className="text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                What do you want to build?
              </h1>
              <SuggestionChips onSelect={handleSend} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          )}
        </div>

        <form
          className="border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
        >
          <div className="mx-auto flex max-w-3xl gap-2">
            <Input
              ref={inputRef}
              name="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a government UI to build..."
              disabled={isStreaming}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" disabled={isStreaming || !input.trim()}>
              Send
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

"use client";

import { type ChangeEvent, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  SPEC_DATA_PART,
  SPEC_DATA_PART_TYPE,
  type SpecDataPart,
} from "@json-render/core";
import { useNestedSpec } from "@/lib/render/use-nested-spec";
import { uswdsComponents } from "@oddball/json-render-uswds";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Streamdown } from "streamdown";
import { OddballBanner } from "@/components/oddball-banner";
import { SpecViewer } from "@/components/spec-viewer";
import { SuggestionChips } from "@/components/suggestion-chips";

const UswdsButton = uswdsComponents.Button;
const UswdsTextarea = uswdsComponents.Textarea;
const UswdsText = uswdsComponents.Text;

// =============================================================================
// Types + transport
// =============================================================================

type AppDataParts = { [SPEC_DATA_PART]: SpecDataPart };
type AppMessage = UIMessage<unknown, AppDataParts>;

const transport = new DefaultChatTransport({ api: "/api/generate" });

// =============================================================================
// Message Bubble
// =============================================================================

function MessageBubble({
  message,
  loading,
}: {
  message: AppMessage;
  loading?: boolean;
}) {
  const isUser = message.role === "user";
  const { spec, text, hasSpec } = useNestedSpec(message.parts);

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
          <div className="max-w-[85%] whitespace-pre-wrap rounded-lg border-2 border-blue-60v bg-blue-60v px-4 py-2 text-sm font-sans font-medium leading-relaxed text-white">
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
                className="prose prose-sm max-w-none text-sm font-sans leading-relaxed text-ink prose-headings:text-ink prose-p:text-ink prose-strong:text-ink prose-li:text-ink prose-code:text-primary-darker"
              >
                <Streamdown>{seg.text}</Streamdown>
              </div>
            );
          }
          if (!hasSpec || !spec) return null;
          return <SpecViewer key={`spec-${i}`} spec={spec} loading={loading} />;
        })}
        {showSpecAtEnd && spec && <SpecViewer spec={spec} loading={loading} />}
      </div>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function Page() {
  const [input, setInput] = useState("");
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
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <OddballBanner />
      <header className="flex items-center justify-between border-b border-base-light bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-sans text-base font-semibold text-blue-60v">
          <span className="inline-flex h-7 w-7 items-center justify-center text-blue-60v" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-4 w-4" focusable="false">
              <circle cx="12" cy="12" r="8" fill="currentColor" />
            </svg>
          </span>
          <span className="text-blue-70v">/</span>
          <span>USWDS Playground</span>
        </div>
        <UswdsButton
          type="button"
          unstyled
          className="!text-blue-60v hover:!bg-blue-5v focus-visible:!outline-blue-70v"
          onClick={() => setMessages([])}
        >
          Start Over
        </UswdsButton>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {isEmpty ? (
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 pt-1 sm:gap-6 sm:pt-4">
              <h1 className="mx-auto flex w-full max-w-6xl flex-row flex-nowrap items-center justify-center gap-x-2 px-2 text-center font-sans font-bold leading-none text-blue-60v sm:gap-x-3 sm:px-4">
                <span className="shrink-0 text-3xl sm:text-4xl md:text-5xl">
                  Prompt
                </span>
                <ArrowRight
                  className="h-7 w-7 shrink-0 sm:h-9 sm:w-9 md:h-11 md:w-11"
                  aria-hidden
                />
                <span className="shrink-0 text-3xl sm:text-4xl md:text-5xl">
                  Custom USWDS UI
                </span>
              </h1>
              <div className="flex max-w-2xl flex-col gap-3 text-center">
                <UswdsText
                  as="p"
                  size="lg"
                  className="!text-blue-60v"
                  text="Dynamic, personalized, reliable government-service UIs from prompts."
                />
                <UswdsText
                  as="p"
                  size="base"
                  className="!text-blue-60v"
                  text="Predefined USWDS components for safe, predictable output."
                />
              </div>

              <form
                className="w-full max-w-3xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
              >
                <div className="relative rounded-lg border border-base-light bg-white px-3 py-1 shadow-sm transition-colors focus-within:border-blue-60v">
                  <UswdsTextarea
                    name="message"
                    id="message"
                    rows={2}
                    placeholder="Describe what you want to do..."
                    disabled={isStreaming}
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    autoFocus
                    className="!block !w-full !max-w-none !min-h-0 !resize-none !border-0 !bg-transparent !p-0 !pr-10 !shadow-none !outline-none !ring-0 focus:!outline-none focus-visible:!outline-none"
                  />
                  <UswdsButton
                    type="submit"
                    disabled={isStreaming || !input.trim()}
                    className="absolute bottom-1 right-1 !h-7 !w-7 !min-w-0 !rounded-full !border-0 !bg-blue-60v !p-0 !text-white hover:!bg-blue-70v focus-visible:!outline-blue-70v"
                    aria-label="Send message"
                  >
                    <ArrowDown className="mx-auto h-3.5 w-3.5 shrink-0" aria-hidden />
                  </UswdsButton>
                </div>
                <div className="mt-4">
                  <SuggestionChips onSelect={handleSend} />
                </div>
              </form>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  loading={isStreaming && m.id === messages[messages.length - 1]?.id}
                />
              ))}
            </div>
          )}
        </div>

        {!isEmpty && (
          <form
            className="border-t border-base-light bg-white px-4 py-4 sm:px-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <div className="relative mx-auto max-w-3xl rounded-lg border border-base-light bg-white px-3 py-1 shadow-sm transition-colors focus-within:border-blue-60v">
              <UswdsTextarea
                name="message"
                id="message"
                rows={2}
                placeholder="Describe a government UI to build..."
                disabled={isStreaming}
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
                className="!block !w-full !max-w-none !min-h-0 !resize-none !border-0 !bg-transparent !p-0 !pr-10 !shadow-none !outline-none !ring-0 focus:!outline-none focus-visible:!outline-none"
              />
              <UswdsButton
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="absolute bottom-1 right-1 !h-7 !w-7 !min-w-0 !rounded-full !border-0 !bg-blue-60v !p-0 !text-white hover:!bg-blue-70v focus-visible:!outline-blue-70v"
                aria-label="Send message"
              >
                <ArrowDown className="mx-auto h-3.5 w-3.5 shrink-0" aria-hidden />
              </UswdsButton>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

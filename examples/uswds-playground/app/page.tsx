"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  SPEC_DATA_PART,
  SPEC_DATA_PART_TYPE,
  type SpecDataPart,
} from "@json-render/core";
import { useJsonRenderMessage } from "@json-render/react";
import { uswdsComponents } from "@oddball/json-render-uswds";
import { ArrowDown } from "lucide-react";
import { Streamdown } from "streamdown";
import { OddballBanner } from "@/components/oddball-banner";
import { SpecViewer } from "@/components/spec-viewer";
import { SUGGESTIONS, SuggestionChips } from "@/components/suggestion-chips";

const UswdsButton = uswdsComponents.Button;
const UswdsTextarea = uswdsComponents.Textarea;
const UswdsText = uswdsComponents.Text;

const HERO_ROTATE_MS = 4500;
const HERO_SLIDE_MS = 480;

function HeroPromptCarousel() {
  const count = SUGGESTIONS.length;
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % count),
      HERO_ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [count]);

  const slideTextClass =
    "box-border shrink-0 px-4 py-2.5 text-center text-xl font-bold leading-snug text-green sm:px-7 sm:py-3 sm:text-2xl md:text-3xl";

  return (
    <div
      className="relative min-h-[3.25rem] w-full flex-1 overflow-x-hidden overflow-y-visible py-2 sm:min-h-[3.75rem] sm:py-2.5"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="flex will-change-transform"
        style={{
          width: `${count * 100}%`,
          transform: `translate3d(calc(-100% * ${index} / ${count}), 0, 0)`,
          transition: reduceMotion
            ? undefined
            : `transform ${HERO_SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        {SUGGESTIONS.map((line) => (
          <p
            key={line}
            style={{ flex: `0 0 calc(100% / ${count})` }}
            className={slideTextClass}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

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
  const { spec, text, hasSpec } = useJsonRenderMessage(message.parts);

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
          <div className="max-w-[85%] whitespace-pre-wrap rounded-lg border-2 border-green-50v bg-green px-4 py-2 text-sm font-sans font-medium leading-relaxed text-white">
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
      <header className="flex items-center justify-between border-b-2 border-base-light bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-sans text-base font-semibold text-green">
          <span className="inline-flex h-7 w-7 items-center justify-center text-green" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-4 w-4" focusable="false">
              <circle cx="12" cy="12" r="8" fill="currentColor" />
            </svg>
          </span>
          <span className="text-green-40v">/</span>
          <span>USWDS Playground</span>
        </div>
        <UswdsButton
          type="button"
          unstyled
          className="!text-green hover:!bg-green-5v"
          onClick={() => setMessages([])}
        >
          Start Over
        </UswdsButton>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
          {isEmpty ? (
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 pt-6 sm:pt-16">
              <UswdsText
                as="p"
                size="sm"
                className="text-center font-semibold uppercase tracking-[0.2em] !text-green"
                text="The generative UI framework"
              />
              <h1 className="mx-auto flex w-full max-w-6xl flex-row flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2 text-left font-sans font-bold leading-snug sm:gap-x-5 sm:px-4">
                <span className="shrink-0 text-3xl text-green sm:text-4xl md:text-5xl">
                  Prompt
                </span>
                <span
                  className="shrink-0 text-3xl text-green sm:text-4xl md:text-5xl"
                  aria-hidden="true"
                >
                  →
                </span>
                <HeroPromptCarousel />
              </h1>
              <div className="flex max-w-2xl flex-col gap-3 text-center">
                <UswdsText
                  as="p"
                  size="lg"
                  className="!text-green-50v"
                  text="Dynamic, personalized, reliable government-service UIs from prompts."
                />
                <UswdsText
                  as="p"
                  size="base"
                  className="!text-green-50v"
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
                <div className="relative rounded-lg border-2 border-base-light bg-white p-2 shadow-sm">
                  <UswdsTextarea
                    name="message"
                    id="message"
                    rows={4}
                    placeholder="Describe what you want to do..."
                    disabled={isStreaming}
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(e.target.value)
                    }
                    autoFocus
                    className="max-w-none border-0 bg-transparent pr-14 shadow-none [&_textarea]:border-0 [&_textarea]:bg-transparent [&_textarea]:shadow-none [&_textarea]:ring-0 [&_textarea]:focus-visible:outline-none"
                  />
                  <UswdsButton
                    type="submit"
                    disabled={isStreaming || !input.trim()}
                    className="absolute bottom-3 right-3 !h-10 !w-10 !min-w-0 !rounded-full !border-0 !bg-green !p-0 !text-white hover:!bg-green-40v focus-visible:!outline-green-40v"
                    aria-label="Send message"
                  >
                    <ArrowDown className="mx-auto h-5 w-5 shrink-0" aria-hidden />
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
            className="border-t-2 border-base-light bg-white px-4 py-4 sm:px-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <div className="relative mx-auto max-w-3xl rounded-lg border-2 border-base-light bg-white p-2 shadow-sm">
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
                className="max-w-none border-0 bg-transparent pr-14 shadow-none [&_textarea]:border-0 [&_textarea]:bg-transparent [&_textarea]:shadow-none [&_textarea]:ring-0 [&_textarea]:focus-visible:outline-none"
              />
              <UswdsButton
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="absolute bottom-3 right-3 !h-10 !w-10 !min-w-0 !rounded-full !border-0 !bg-green !p-0 !text-white hover:!bg-green-40v focus-visible:!outline-green-40v"
                aria-label="Send message"
              >
                <ArrowDown className="mx-auto h-5 w-5 shrink-0" aria-hidden />
              </UswdsButton>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

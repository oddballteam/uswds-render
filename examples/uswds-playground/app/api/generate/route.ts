import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { pipeJsonRender } from "@json-render/core";
import { makeAgent } from "@/lib/agent";

export const maxDuration = 60;

function makeRequestId(): string {
  return (globalThis.crypto?.randomUUID?.() ?? `rid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`).slice(0, 8);
}

function describeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    const out: Record<string, unknown> = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    const cause = (err as { cause?: unknown }).cause;
    if (cause) out.cause = describeError(cause);
    const aiProps = [
      "responseBody",
      "statusCode",
      "url",
      "requestBodyValues",
      "data",
    ] as const;
    const errRecord = err as unknown as Record<string, unknown>;
    for (const key of aiProps) {
      const value = errRecord[key];
      if (value !== undefined) out[key] = value;
    }
    return out;
  }
  return { value: String(err) };
}

function lastUserPreview(messages: UIMessage[]): string | undefined {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return undefined;
  const text = last.parts
    ?.map((p) => (p as { type: string; text?: string }).type === "text" ? (p as { text?: string }).text ?? "" : "")
    .join(" ")
    .trim();
  if (!text) return undefined;
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

export async function POST(req: Request) {
  const rid = makeRequestId();
  let uiMessages: UIMessage[] = [];

  try {
    const body = await req.json();
    uiMessages = body.messages;

    if (!uiMessages || !Array.isArray(uiMessages) || uiMessages.length === 0) {
      console.warn(`[generate ${rid}] invalid request — empty messages`);
      return new Response(JSON.stringify({ error: "messages array is required", requestId: rid }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(
      `[generate ${rid}] request received`,
      JSON.stringify({
        messageCount: uiMessages.length,
        lastUser: lastUserPreview(uiMessages),
      }),
    );

    const agent = await makeAgent(rid);
    const modelMessages = await convertToModelMessages(uiMessages);
    console.log(`[generate ${rid}] starting stream`, JSON.stringify({ modelMessageCount: modelMessages.length }));

    const result = await agent.stream({ messages: modelMessages });

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        writer.merge(pipeJsonRender(result.toUIMessageStream()));
      },
      onError: (err) => {
        console.error(`[generate ${rid}] stream error`, JSON.stringify(describeError(err), null, 2));
        const message = err instanceof Error ? err.message : String(err);
        return `[${rid}] ${message}`;
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (err) {
    console.error(`[generate ${rid}] top-level error`, JSON.stringify(describeError(err), null, 2));
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
        requestId: rid,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

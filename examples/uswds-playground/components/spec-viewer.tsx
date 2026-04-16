"use client";

import { useState } from "react";
import type { Spec } from "@json-render/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaygroundRenderer } from "@/lib/render/renderer";

interface SpecViewerProps {
  spec: Spec | null;
  loading?: boolean;
}

export function SpecViewer({ spec, loading }: SpecViewerProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  if (!spec) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "preview" | "code")}>
        <TabsList className="w-full justify-start rounded-none border-b bg-zinc-50 px-2 dark:bg-zinc-900">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-4">
          <PlaygroundRenderer spec={spec} loading={loading} />
        </TabsContent>
        <TabsContent value="code" className="m-0">
          <pre className="overflow-x-auto bg-zinc-950 p-4 text-xs text-zinc-100">
            <code>{JSON.stringify(spec, null, 2)}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}

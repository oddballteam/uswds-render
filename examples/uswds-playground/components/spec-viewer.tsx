"use client";

import { useState } from "react";
import type { Spec } from "@json-render/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@oddball/json-render-uswds";
import { PlaygroundRenderer } from "@/lib/render/renderer";

interface SpecViewerProps {
  spec: Spec | null;
  loading?: boolean;
}

export function SpecViewer({ spec, loading }: SpecViewerProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  if (!spec) return null;

  return (
    <div className="overflow-hidden rounded-lg border-2 border-base-light bg-gray-1 font-sans text-ink shadow-sm">
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "preview" | "code")}
        className="w-full"
      >
        <TabsList className="w-full justify-start rounded-none border-b-2 border-base-light bg-base-lightest px-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-4">
          <PlaygroundRenderer spec={spec} loading={loading} />
        </TabsContent>
        <TabsContent value="code" className="m-0">
          <pre className="max-h-[min(70vh,32rem)] overflow-x-auto overflow-y-auto border-t-0 bg-base-lightest p-4 font-mono text-xs leading-relaxed text-primary-darker">
            <code>{JSON.stringify(spec, null, 2)}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}

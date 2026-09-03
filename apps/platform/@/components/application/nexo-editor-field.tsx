"use client";

import type { Content } from "@tiptap/react";
import dynamic from "next/dynamic";

const LazyNexoEditor = dynamic(
  () => import("./nexo-editor-client").then((mod) => mod.NexoEditorClient),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-48 rounded-lg border border-dashed border-border/60 bg-muted/20" />
    ),
  }
);

type NexoEditorFieldProps = {
  content: Content;
  onChange: (content: Content, markdown: string) => void;
  placeholder?: string;
};

export default function NexoEditorField(props: NexoEditorFieldProps) {
  return <LazyNexoEditor {...props} />;
}

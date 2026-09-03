"use client";

import type { Content, JSONContent } from "@tiptap/react";
import { renderToMarkdown } from "@tiptap/static-renderer";
import { defaultExtensions, NexoEditor } from "nexo-editor";
import "nexo-editor/index.css";

type NexoEditorClientProps = {
  content: Content;
  onChange: (content: Content, markdown: string) => void;
  placeholder?: string;
};

export function NexoEditorClient({
  content,
  onChange,
  placeholder,
}: NexoEditorClientProps) {
  return (
    <NexoEditor
      content={content}
      onChange={(nextContent) => {
        const markdown = renderToMarkdown({
          content: nextContent as JSONContent,
          extensions: defaultExtensions,
        });
        onChange(nextContent as Content, markdown);
      }}
      placeholder={placeholder}
    />
  );
}

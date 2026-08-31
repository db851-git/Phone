"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders product descriptions written in Markdown (tables, lists, bold, etc.)
// into clean, styled content. Staff can paste a spec table and it formats nicely.
export default function Markdown({ children }) {
  if (!children) return null;
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

"use client";

import clsx from "clsx";

type MarkdownContentProps = {
  markdown: string;
  className?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: string[] = [];
  let listItems: string[] = [];
  let orderedItems: string[] = [];

  const flushUnordered = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  };

  const flushOrdered = () => {
    if (!orderedItems.length) return;
    blocks.push(`<ol>${orderedItems.join("")}</ol>`);
    orderedItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushUnordered();
      flushOrdered();
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushUnordered();
      flushOrdered();
      blocks.push(`<h1>${applyInlineMarkdown(trimmed.slice(2))}</h1>`);
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushUnordered();
      flushOrdered();
      blocks.push(`<h2>${applyInlineMarkdown(trimmed.slice(3))}</h2>`);
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushOrdered();
      listItems.push(`<li>${applyInlineMarkdown(trimmed.slice(2))}</li>`);
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushUnordered();
      orderedItems.push(
        `<li>${applyInlineMarkdown(trimmed.replace(/^\d+\.\s/, ""))}</li>`
      );
      return;
    }

    flushUnordered();
    flushOrdered();
    blocks.push(`<p>${applyInlineMarkdown(trimmed)}</p>`);
  });

  flushUnordered();
  flushOrdered();

  return blocks.join("");
}

export default function MarkdownContent({
  markdown,
  className,
}: MarkdownContentProps) {
  return (
    <div
      className={clsx(
        "space-y-4 text-sm text-white/70 leading-relaxed [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-white [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_strong]:text-white",
        className
      )}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
    />
  );
}

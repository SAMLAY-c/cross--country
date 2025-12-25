"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

/**
 * Markdown 预览组件
 * 使用 react-markdown + remark-gfm 渲染 Markdown 内容
 */
export default function MarkdownPreview({ content }: Props) {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a] p-6 text-[#a1a1aa] prose prose-invert prose-headings:text-white prose-a:text-[var(--accent)] prose-strong:text-white prose-code:text-[var(--accent)] max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mt-6 mb-4 border-b border-[#333333] pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-white mt-5 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-white mt-3 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-3 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-3 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-3 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-4 italic text-white/80 bg-white/5 py-2">
              {children}
            </blockquote>
          ),
          code: ({ inline, children, className }: { inline?: boolean; children: React.ReactNode; className?: string }) => {
            if (inline) {
              return (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-[var(--accent)]">
                  {children}
                </code>
              );
            }
            return (
              <code className={`block bg-[#121212] p-4 rounded-lg my-4 text-sm overflow-x-auto border border-[#333333] ${className || ""}`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-[#121212] p-4 rounded-lg my-4 overflow-x-auto border border-[#333333]">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <img
              src={src as string}
              alt={alt as string}
              className="rounded-lg my-4 max-w-full h-auto border border-[#333333]"
            />
          ),
          a: ({ href, children }) => (
            <a
              href={href as string}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--accent)] transition-colors"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-[#333333]" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-[#333333] rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/5">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-[#333333]">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-white font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2">{children}</td>
          ),
        }}
      >
        {content || "*开始编写内容...*"}
      </ReactMarkdown>
    </div>
  );
}

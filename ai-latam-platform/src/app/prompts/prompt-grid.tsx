"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";

export type PromptItem = {
  id: number;
  title: string;
  category: string;
  platforms: string[];
  preview: string;
  prompt: string;
  coverImage?: string | null;
};

type PromptGridProps = {
  prompts: PromptItem[];
};

export default function PromptGrid({ prompts }: PromptGridProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <>
      <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {prompts.map((prompt) => (
        <article
          key={prompt.id}
          className="group cursor-pointer rounded-2xl bg-[#1a2622] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:bg-[#212f2a]"
          role="button"
          tabIndex={0}
          onClick={() => setActivePrompt(prompt)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setActivePrompt(prompt);
            }
          }}
        >
          {prompt.coverImage ? (
            <div className="mb-5 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prompt.coverImage}
                alt={prompt.title}
                className="h-36 w-full object-cover"
              />
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-white/55">
              {prompt.category}
            </span>
            <div className="flex gap-2">
              {prompt.platforms.map((platform) => (
                <span
                  key={`${prompt.id}-${platform}`}
                  className="rounded-md bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">
            {prompt.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm text-white/60 leading-relaxed">
            {prompt.preview}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleCopy(prompt.prompt, prompt.id);
              }}
              className={clsx(
                "inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition",
                copiedId === prompt.id
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                  : "hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
              )}
            >
              {copiedId === prompt.id ? "已复制" : "复制"}
              {copiedId === prompt.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            <span className="text-xs text-white/50">一键</span>
          </div>
        </article>
      ))}
    </section>

      {activePrompt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="提示词详情"
          onClick={() => setActivePrompt(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-[#1a2622] p-8 text-white shadow-[0_40px_90px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            {activePrompt.coverImage ? (
              <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePrompt.coverImage}
                  alt={activePrompt.title}
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/55">
                  {activePrompt.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  {activePrompt.title}
                </h2>
              </div>
              <button
                onClick={() => setActivePrompt(null)}
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-contrast)] transition hover:brightness-110"
              >
                关闭
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {activePrompt.platforms.map((platform) => (
                <span
                  key={`${activePrompt.id}-${platform}-modal`}
                  className="rounded-md bg-white/10 px-3 py-1 text-white/70"
                >
                  {platform}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-4 text-sm text-white/85">
              <div className="rounded-2xl bg-[#202d28] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  效果预览
                </p>
                <p className="mt-3 text-white/70 leading-relaxed">
                  {activePrompt.preview}
                </p>
              </div>
              <div className="rounded-2xl bg-[#202d28] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  提示词
                </p>
                <p className="mt-2 whitespace-pre-line text-white/90">
                  {activePrompt.prompt}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => handleCopy(activePrompt.prompt, activePrompt.id)}
                className={clsx(
                "inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition",
                copiedId === activePrompt.id
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                    : "hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
              )}
              >
                {copiedId === activePrompt.id ? "已复制" : "复制提示词"}
                {copiedId === activePrompt.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <span className="text-xs text-white/60">点击空白处关闭</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import Link from "next/link";
import Nav from "@/components/nav";
import MarkdownContent from "@/components/markdown-content";

const markdownBody = `# Prompt Engineering 基本功

整理 Few-shot、Chain-of-Thought、自洽性等关键策略，形成可复制的提示词模板。

## 关键策略速览
- **Few-shot**：用少量示例对齐风格与格式
- **Chain-of-Thought**：引导模型分步推理
- **Self-Consistency**：多轮采样后择优汇总

## 实操建议
1. 先定义输出结构，再填充内容
2. 对关键步骤加上校验标准
3. 使用 \`CheckList\` 保证稳定输出
`;

export default function MockCardPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#a1a1aa] [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#d4ff00",
        ["--accent-glow" as unknown as string]: "rgba(212,255,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0a0a0a",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.12),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(0,255,148,0.12),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(120,200,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.2),rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 bg-[url('/eco-hero.svg')] bg-cover bg-center opacity-35 grayscale" />
        <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />

        <main className="relative w-full flex min-h-screen flex-col px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav />

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Mock Card
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl [font-family:var(--font-display)] text-white">
                学习笔记卡片演示页
              </h1>
              <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                这个页面用于快速调整学习笔记卡片与正文样式，正文以
                Markdown 格式渲染。
              </p>
            </div>

            <article className="flex h-full flex-col rounded-2xl border border-[#333333] bg-[#121212] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    提示词工程
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Prompt Engineering 基本功
                  </h2>
                </div>
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#333333]">
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(212,255,0,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.12),transparent_55%),linear-gradient(135deg,#0a0a0a,#121212)] text-xs font-semibold tracking-[0.3em] text-white/60">
                    AI
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                整理 Few-shot、Chain-of-Thought、自洽性等关键策略，形成可复制的提示词模板。
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span className="rounded-full border border-[#2a2a2a] px-3 py-1">
                  更新 2025.01.12
                </span>
                <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-white/60">
                  Few-shot
                </span>
                <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-white/60">
                  CoT
                </span>
                <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-white/60">
                  Self-Consistency
                </span>
              </div>
              <Link
                href="/learning/1-prompt-engineering-core"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/16"
              >
                查看笔记 →
              </Link>
            </article>
          </section>

          <section className="mt-14">
            <div className="rounded-3xl border border-[#333333] bg-[#121212]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <MarkdownContent markdown={markdownBody} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

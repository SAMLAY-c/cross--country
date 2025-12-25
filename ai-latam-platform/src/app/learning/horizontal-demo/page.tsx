"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Nav from "@/components/nav";

type ScrollMetrics = {
  distance: number;
  start: number;
  end: number;
};

const DEMO_CARDS = [
  {
    title: "设定角色",
    desc: "明确输出风格、语气与专业背景。",
    tag: "步骤 01",
  },
  {
    title: "定义目标",
    desc: "限定任务范围与期望的最终结果。",
    tag: "步骤 02",
  },
  {
    title: "拆分过程",
    desc: "把复杂任务拆成可执行的子步骤。",
    tag: "步骤 03",
  },
  {
    title: "加入约束",
    desc: "提供格式、长度、来源等约束条件。",
    tag: "步骤 04",
  },
  {
    title: "补充示例",
    desc: "用示例对齐输出风格与结构。",
    tag: "步骤 05",
  },
  {
    title: "校验清单",
    desc: "列出检查项避免偏题或遗漏。",
    tag: "步骤 06",
  },
  {
    title: "迭代优化",
    desc: "根据反馈逐步收敛到最优方案。",
    tag: "步骤 07",
  },
  {
    title: "交付输出",
    desc: "输出可执行、可复用的最终结果。",
    tag: "步骤 08",
  },
];

export default function HorizontalScrollDemoPage() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<ScrollMetrics>({
    distance: 0,
    start: 0,
    end: 0,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) {
      return;
    }

    let raf = 0;

    const applyTransform = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { distance, start, end } = metricsRef.current;
        const scrollY = window.scrollY;
        const span = Math.max(1, end - start);
        const progress = Math.min(1, Math.max(0, (scrollY - start) / span));
        const translateX = -distance * progress;
        content.style.transform = `translate3d(${translateX}px, 0, 0)`;
      });
    };

    const updateMetrics = () => {
      const distance = Math.max(0, content.scrollWidth - window.innerWidth);
      const height = Math.max(window.innerHeight, window.innerHeight + distance);
      wrapper.style.height = `${height}px`;
      const start = wrapper.offsetTop;
      const end = start + height - window.innerHeight;
      metricsRef.current = { distance, start, end };
      applyTransform();
    };

    const handleScroll = () => applyTransform();
    const handleResize = () => updateMetrics();

    updateMetrics();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

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

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                横向滑动模拟
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl [font-family:var(--font-display)] text-white">
                用纵向滚动驱动横向位移的视觉实验。
              </h1>
              <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                当内容进入视窗后固定在顶部，根据滚动进度水平移动卡片。
                适合展示流程、案例或连续信息。
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                <span className="rounded-full border border-[#2a2a2a] px-3 py-1">
                  滑动区域为下一段
                </span>
                <span className="rounded-full border border-[#2a2a2a] px-3 py-1">
                  触控/滚轮都可驱动
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-[#333333] bg-[#121212]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                结构提示
              </p>
              <div className="mt-6 space-y-4 text-sm text-white/60 leading-relaxed">
                <p>外层 wrapper 负责制造滚动距离。</p>
                <p>中层 sticky 容器固定在视窗顶部。</p>
                <p>内层内容按滚动进度向左移动。</p>
              </div>
              <Link
                href="/learning"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/16"
              >
                返回学习页 →
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <div ref={wrapperRef} className="relative">
              <div className="sticky top-0 flex h-screen items-center">
                <div className="w-full overflow-hidden">
                  <div
                    ref={contentRef}
                    className="flex items-stretch gap-6 pr-12 transition-transform duration-150"
                  >
                    {DEMO_CARDS.map((card) => (
                      <article
                        key={card.title}
                        className="flex h-full min-w-[260px] max-w-[320px] flex-col justify-between rounded-2xl border border-[#333333] bg-[#121212] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:min-w-[300px] lg:min-w-[340px]"
                      >
                        <div className="space-y-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                            {card.tag}
                          </p>
                          <h3 className="text-2xl font-semibold text-white">
                            {card.title}
                          </h3>
                          <p className="text-sm text-white/60 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                        <div className="mt-6 text-xs text-white/50">
                          横向滚动展示
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20 rounded-3xl border border-[#333333] bg-[#121212]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              返回说明
            </p>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              如果你要将这套效果放到学习页，可复用同样的结构与
              scrollWidth 计算逻辑，再把卡片内容替换成真实笔记。
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

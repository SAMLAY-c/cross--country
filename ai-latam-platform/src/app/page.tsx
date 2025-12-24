import Link from "next/link";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#a1a1aa] [font-family:var(--font-body)]"
      style={{
        ["--accent" as unknown as string]: "#d4ff00",
        ["--accent-glow" as unknown as string]: "rgba(212,255,0,0.4)",
        ["--accent-contrast" as unknown as string]: "#0a0a0a",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(212,255,0,0.12),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(0,255,148,0.12),transparent_45%),radial-gradient(circle_at_30%_85%,rgba(120,190,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(10,10,10,0.2),rgba(0,0,0,0.9))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(212,255,0,0.06),transparent_30%,transparent_70%,rgba(212,255,0,0.06))] mix-blend-screen" />
        <main className="relative w-full flex min-h-screen flex-col gap-20 px-6 pb-24 pt-8 sm:px-10 lg:px-20">
          <Nav currentPath="/" />

          <section
            id="hero"
            className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
          >
            <div className="space-y-8 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
                DIGITAL ALCHEMIST
              </p>
              <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-white">
                以 <span className="text-accent-gradient">AI</span>{" "}
                <span className="text-accent-gradient">重塑个体创造力</span>，
                <span className="text-[var(--accent)]">打造你的数字化第二大脑。</span>
              </h1>
              <p className="max-w-2xl text-base text-white/65 sm:text-lg leading-relaxed">
                我是 Sam，专注把科技的锋芒转化为品牌的气质。从概念、视觉到自动化落地，
                我不仅仅交付代码，更连接 AI 与真实商业场景。
              </p>
              <div className="relative h-12 overflow-hidden text-lg font-semibold text-white/80 sm:text-xl">
                <span className="hero-word hero-word-1">AI CREATOR</span>
                <span className="hero-word hero-word-2">SOLOPRENEUR</span>
                <span className="hero-word hero-word-3">SYSTEM ARCHITECT</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#works"
                  className="rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
                >
                  探索我的宇宙
                </Link>
                <Link
                  href="/#contact"
                  className="rounded-md border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  预约协作
                </Link>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#333333] bg-white/[0.03] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-[10px]">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                  <span>BOOT SEQUENCE</span>
                  <span className="text-[var(--accent)]">99%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="loading-bar h-full w-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_16px_var(--accent-glow)]" />
                </div>
                <div className="mt-5 space-y-2 font-mono text-xs text-white/55">
                  <p>Initializing creativity matrix...</p>
                  <p>User: Sam connected.</p>
                  <p>Loading AI modules: vision, automation, narrative.</p>
                  <p>Sync complete. Ready to launch.</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-[#333333] bg-white/[0.03] p-8 backdrop-blur-[10px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,255,0,0.15)_0%,transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),rgba(0,0,0,0))]" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                    NEURAL FIELD
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    粒子矩阵记录你的灵感轨迹，移动鼠标时它们会躲避或跟随，象征你在数字世界中对数据的绝对掌控。
                  </p>
                  <div className="h-28 rounded-2xl bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:16px_16px] opacity-80 animate-pulse-soft" />
                </div>
              </div>
            </div>
          </section>

          <section
            id="stack"
            className="rounded-3xl border border-[#333333] bg-white/[0.03] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-[10px]"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
                  TECH ARSENAL
                </p>
                <h2 className="text-3xl font-semibold sm:text-4xl [font-family:var(--font-display)]">
                  我的工具栈：<span className="text-[var(--accent)]">流动的数字化武器库。</span>
                </h2>
                <p className="max-w-2xl text-sm text-white/60">
                  从视觉生成到自动化工作流，每一个图标都代表我掌握的武器，随时准备组合出击。
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                HOVER TO SPARK
              </span>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#333333] bg-[#121212]/70 py-4">
              <div className="marquee flex items-center gap-8 px-6">
                {[
                  "Midjourney",
                  "GPT-4o",
                  "Claude",
                  "Python",
                  "React",
                  "Figma",
                  "Spline",
                  "GSAP",
                  "Notion",
                  "Supabase",
                  "LangChain",
                  "ElevenLabs",
                ].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-[#333333] px-5 py-2 text-xs uppercase tracking-[0.25em] text-white/55 transition hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_15px_var(--accent-glow)]"
                  >
                    {tool}
                  </span>
                ))}
                {[
                  "Midjourney",
                  "GPT-4o",
                  "Claude",
                  "Python",
                  "React",
                  "Figma",
                  "Spline",
                  "GSAP",
                  "Notion",
                  "Supabase",
                  "LangChain",
                  "ElevenLabs",
                ].map((tool) => (
                  <span
                    key={`${tool}-dup`}
                    className="rounded-full border border-[#333333] px-5 py-2 text-xs uppercase tracking-[0.25em] text-white/55 transition hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_15px_var(--accent-glow)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="works" className="space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
                  SELECTED WORKS
                </p>
                <h2 className="text-4xl font-semibold [font-family:var(--font-display)]">
                  横向叙事，沿着<span className="text-[var(--accent)]">问题到方案</span>的轨迹。
                </h2>
              </div>
              <p className="max-w-xl text-sm text-white/60">
                页面在此处锁定为横向移动，展示每一个关键节点。
              </p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {[
                {
                  title: "LATAM AI 平台重构",
                  label: "01 / Strategy",
                  text: "将传统 B2B 平台叙事转化为个人品牌主场，用 GSAP 动画强调风格与互动体验。",
                },
                {
                  title: "视频脚本自动化引擎",
                  label: "02 / Automation",
                  text: "搭建 Carrot 工作流，从灵感输入到分镜生成，全流程可复用的自动化模板。",
                },
                {
                  title: "极简主义品牌视觉",
                  label: "03 / Identity",
                  text: "霓虹绿 + 玻璃质感，构建赛博极简的视觉符号，让品牌在喧嚣中突围。",
                },
                {
                  title: "AI 咨询产品化",
                  label: "04 / Systems",
                  text: "将非标的咨询服务，封装为可规模化交付的 Notion + AI 数字产品。",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="snap-center min-w-[260px] max-w-sm rounded-3xl border border-[#333333] bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-[10px]"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">
                    {item.label}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm text-white/60 leading-relaxed">
                    {item.text}
                  </p>
                  <div className="mt-6 h-1 w-full rounded-full bg-white/10">
                    <div className="h-full w-1/2 rounded-full bg-[var(--accent)]" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="method"
            className="grid gap-10 rounded-3xl border border-[#333333] bg-[#121212]/70 p-10 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="relative flex items-center justify-center">
              <div className="orb-container relative h-64 w-64">
                <div className="orb-core absolute inset-0 rounded-full" />
                <div className="orb-ring absolute inset-0 rounded-full" />
                <div className="orb-ring orb-ring-alt absolute inset-8 rounded-full" />
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
                METHODOLOGY
              </p>
              <h2 className="text-4xl font-semibold [font-family:var(--font-display)]">
                三步构建你的 AI 驱动系统
              </h2>
              <div className="space-y-5">
                {[
                  {
                    step: "01",
                    title: "洞察 Insight",
                    text: "解构你的行业语境与增长瓶颈，形成可计算的创意方向，而非盲目跟风。",
                  },
                  {
                    step: "02",
                    title: "构建 Build",
                    text: "把灵感转为可复用资产，搭建视觉规范、内容库与自动化管线 (Pipeline)。",
                  },
                  {
                    step: "03",
                    title: "自动化 Automate",
                    text: "用 AI Agent 实现持续产出，让系统替你完成 80% 的重复劳动，扩张影响力。",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-[#333333] bg-white/[0.03] p-5 backdrop-blur-[10px]"
                  >
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                      <span className="text-[var(--accent)]">{item.step}</span>
                      <span>{item.title}</span>
                    </div>
                    <p className="mt-3 text-sm text-white/60 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="insights" className="space-y-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
                INSIGHTS
              </p>
              <h2 className="text-4xl font-semibold [font-family:var(--font-display)]">
                人机对话感的<span className="text-[var(--accent)]">思考碎片</span>
              </h2>
              <p className="max-w-2xl text-sm text-white/60">
                把博客变成 Prompt 对话，阅读像是在与 AI 共创。
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                {
                  prompt: "如何用 Midjourney V6 保持品牌视觉的一致性？",
                  reply: "AI 回复：正在生成总结与参数建议... [点击阅读]",
                },
                {
                  prompt: "RAG 实战：个人知识库从 0 到 1 的搭建逻辑。",
                  reply: "AI 回复：正在检索 Sam 的实战笔记... [点击阅读]",
                },
                {
                  prompt: "GPT-4o 视频脚本模板能帮我节省多少时间？",
                  reply: "AI 回复：正在分析效率数据... [点击阅读]",
                },
                {
                  prompt: "2025年，超级个体如何利用 AI 建立护城河？",
                  reply: "AI 回复：正在生成战略建议... [点击阅读]",
                },
              ].map((item, index) => (
                <div
                  key={item.prompt}
                  className="rounded-2xl border border-[#333333] bg-white/[0.03] p-6 backdrop-blur-[10px]"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                    Prompt {index + 1}
                  </p>
                  <div className="mt-4 space-y-3">
                    <p className="text-lg font-semibold text-white">{item.prompt}</p>
                    <span
                      className="type-line text-sm text-white/60"
                      style={{ animationDelay: `${index * 0.8}s` }}
                    >
                      {item.reply}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="grid gap-10 rounded-3xl border border-[#333333] bg-[#121212]/70 p-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
                FINAL CONNECTION
              </p>
              <h2 className="text-4xl font-semibold [font-family:var(--font-display)]">
                用一个超大 Logo，完成最后的连接。
              </h2>
              <p className="text-sm text-white/60">
                订阅 Sam 的数字游民通讯录，获取实战手册与最新案例。
              </p>
              <div className="flex flex-wrap gap-4">
                <input
                  type="email"
                  placeholder="16629076367@163.com"
                  className="w-full max-w-xs border-b border-[#333333] bg-transparent pb-2 text-sm text-white/70 placeholder:text-white/30 focus:border-[var(--accent)] focus:text-white focus:outline-none"
                />
                <button className="rounded-md bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]">
                  加入通讯录
                </button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="logo-orbit relative h-56 w-56">
                <div className="absolute inset-0 rounded-full border border-[var(--accent)]/60 shadow-[0_0_40px_var(--accent-glow)]" />
                <div className="absolute inset-8 rounded-full border border-[#333333]" />
                <div className="absolute inset-[5.5rem] rounded-full bg-[var(--accent)] shadow-[0_0_30px_var(--accent-glow)]" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

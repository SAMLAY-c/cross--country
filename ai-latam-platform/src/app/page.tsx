import Link from "next/link";
import Script from "next/script";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#0d1714] text-white [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#ccff00",
        ["--accent-glow" as unknown as string]: "rgba(204,255,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0d1714",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(175,210,200,0.18),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(90,150,138,0.22),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,210,152,0.2),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,22,18,0.2),rgba(8,12,10,0.62))]" />
        <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-80" />
        <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />
        <main className="relative w-full flex min-h-screen flex-col gap-16 px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav currentPath="/" />

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-8 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                首页
              </p>
              <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
                中文<span className="text-[var(--accent)]">AI 平台</span>，
                为增长与效率而生。
              </h1>
              <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                发掘在拉美地区创建数字业务的资源、课程和实战手册。
                精心策划、清晰明了、随时准备商业化。
              </p>
              <div className="flex flex-wrap gap-3">
                {["联盟目录", "可下载资源", "课程指南", "提示词库"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="rounded-md bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/14"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/tools"
                  className="rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
                >
                  进入工具目录
                </Link>
                <Link
                  href="/prompts"
                  className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/16"
                >
                  探索提示词
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-[#17221e] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                免费获取指南
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                订阅并下载拉美 AI 实战手册。
              </h2>
              <div className="mt-6 rounded-2xl bg-[#202d28] p-4">
                <iframe
                  data-tally-src="https://tally.so/embed/ODlo4a?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  title="订阅"
                />
              </div>
              <p className="mt-4 text-xs text-white/55 leading-relaxed">
                提交表单后，即可立即获取 PDF 访问权限。
              </p>
            </div>
          </div>

          <section className="grid w-full gap-6 md:grid-cols-3">
            {[
              {
                title: "探索工具",
                text: "包含快速筛选和现成联盟链接的动态目录。",
              },
              {
                title: "学习销售",
                text: "在拉美市场完成销售的实际案例和指南。",
              },
              {
                title: "立即自动化",
                text: "面向团队和自由职业者的可操作模板和提示词。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-[#1a2622] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </section>

          <section className="w-full space-y-12 pt-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                Insights
              </p>
              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl [font-family:var(--font-display)]">
                <span className="text-[var(--accent)]">INSIGHTS.</span> 记录 AI 的每一次进化。
              </h2>
              <p className="max-w-2xl text-sm text-white/55 sm:text-base leading-relaxed">
                深度测评、提示词拆解、工具对比。内容以可落地为先，持续更新。
              </p>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative overflow-hidden rounded-2xl bg-[#1a2622] shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,10,8,0.25),rgba(5,10,8,0.65))]" />
                <div className="relative flex min-h-[320px] items-end p-6 sm:p-8">
                  <span className="rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-contrast)]">
                    深度测评
                  </span>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/40">
                  <span>8 Min Read</span>
                  <span>2025.12.23</span>
                </div>
                <h3 className="text-3xl font-extrabold leading-tight text-white">
                  Midjourney V6 <span className="text-[var(--accent)]">提示词工程</span> 全面指南
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  从光影控制到材质渲染，深入解析 V6 的底层逻辑与实战案例，让作品更像电影。
                </p>
                <button className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/16">
                  阅读全文 →
                </button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 text-xs uppercase tracking-[0.25em] text-white/60">
              {["深度测评", "提示词拆解", "工具对比", "增长实验", "自动化案例"].map(
                (pill) => (
                  <span
                    key={pill}
                    className="shrink-0 rounded-md bg-white/10 px-4 py-2 text-white/70 transition hover:bg-white/16"
                  >
                    {pill}
                  </span>
                )
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                "如何用 Claude 做客户调研",
                "GPT-4o 视频脚本的黄金模板",
                "RAG 实战：从 0 到可用",
              ].map((title) => (
                <article
                  key={title}
                  className="rounded-2xl bg-[#1a2622] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition hover:-translate-y-1"
                >
                  <div className="aspect-video rounded-xl bg-[#202d28]"></div>
                  <h4 className="mt-4 text-lg font-semibold text-white transition group-hover:text-[var(--accent)]">
                    {title}
                  </h4>
                </article>
              ))}
            </div>

            <div className="rounded-2xl bg-[#1a2622] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Daily Prompt
              </p>
              <div className="mt-4 rounded-xl bg-[#202d28] p-4 font-mono text-sm text-white/80">
                <p>2025-12-23</p>
                <p className="mt-2">
                  /imagine prompt: a futuristic dashboard with neon green accents,
                  glass panels, cinematic lighting --v 6.0
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]">
                复制提示词
              </button>
            </div>
          </section>
        </main>
      </div>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </div>
  );
}

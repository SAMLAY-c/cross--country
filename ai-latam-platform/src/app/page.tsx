import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1714] text-white [font-family:var(--font-eco)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(175,210,200,0.18),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(90,150,138,0.22),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,210,152,0.2),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,22,18,0.2),rgba(8,12,10,0.62))]" />
        <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-80" />
        <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 pb-20 pt-10 sm:px-10 lg:px-16">
          <nav className="flex items-center justify-between rounded-full bg-[#121f1b]/80 px-6 py-3 text-sm font-medium text-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                AI LATAM Platform
              </span>
              <Link className="hidden sm:inline hover:text-amber-100" href="/tools">
                工具目录
              </Link>
              <Link className="hidden sm:inline hover:text-amber-100" href="/prompts">
                提示词广场
              </Link>
              <span className="hidden sm:inline">课程</span>
              <span className="hidden sm:inline">资源</span>
            </div>
            <button className="rounded-md bg-[#ccff00] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0d1714] transition hover:bg-[#d7ff33] hover:shadow-[0_10px_30px_rgba(204,255,0,0.35)]">
              获取指南
            </button>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-8 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                首页
              </p>
              <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
                中文<span className="text-[#ccff00]">AI 平台</span>，
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
                  className="rounded-md bg-[#ccff00] px-6 py-3 text-sm font-semibold text-[#0d1714] transition hover:bg-[#d7ff33] hover:shadow-[0_12px_30px_rgba(204,255,0,0.35)]"
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
        </main>
      </div>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
    </div>
  );
}

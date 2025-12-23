import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import clsx from "clsx";

const DUMMY_TOOLS = [
  {
    id: 1,
    name: "Kling AI",
    tag: "视频",
    description: "中国最强大的视频生成工具，Sora 的竞争对手。",
    price: "免费试用",
  },
  {
    id: 2,
    name: "Midjourney",
    tag: "图像",
    description: "艺术图像生成的黄金标准。",
    price: "付费",
  },
  {
    id: 3,
    name: "HeyGen",
    tag: "数字人",
    description: "声音克隆和逼真视频数字人，用于营销推广。",
    price: "免费增值",
  },
  {
    id: 4,
    name: "Notion AI",
    tag: "生产力",
    description: "你的第二大脑，现在拥有魔法般的写作能力。",
    price: "付费",
  },
  {
    id: 5,
    name: "Gamma",
    tag: "演示",
    description: "用 AI 在几秒钟内创建演示文稿。",
    price: "免费增值",
  },
];

const PLACEHOLDER_LOGO =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='24' fill='%23f1f5f9'/%3E%3Cpath d='M34 86c10-22 50-22 60 0' stroke='%2394a3b8' stroke-width='8' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='46' cy='54' r='6' fill='%2394a3b8'/%3E%3Ccircle cx='82' cy='54' r='6' fill='%2394a3b8'/%3E%3C/svg%3E";

const priceBadgeStyles: Record<string, string> = {
  "免费试用": "bg-emerald-200/90 text-emerald-950",
  "免费增值": "bg-emerald-200/90 text-emerald-950",
  "付费": "bg-white/80 text-slate-900",
};

function ToolCard({
  name,
  tag,
  description,
  price,
}: {
  name: string;
  tag: string;
  description: string;
  price: string;
}) {
  return (
    <article className="group rounded-2xl bg-[#1a2622] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:bg-[#212f2a]">
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1f5f9] p-2 shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
          <div className="relative h-8 w-8 overflow-hidden rounded-md bg-white">
            <Image src={PLACEHOLDER_LOGO} alt={name} fill sizes="40px" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <span className="inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
            {tag}
          </span>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-white/60 leading-relaxed">
        {description}
      </p>
      <div className="mt-6 flex items-center justify-between">
        <span
          className={clsx(
            "rounded-md px-3 py-1 text-xs font-semibold",
            priceBadgeStyles[price] || priceBadgeStyles.Paid
          )}
        >
          {price}
        </span>
        <button className="inline-flex items-center gap-2 rounded-md bg-[#ccff00] px-4 py-2 text-sm font-semibold text-[#0d1714] transition hover:bg-[#d7ff33] hover:shadow-[0_12px_30px_rgba(204,255,0,0.35)]">
          访问网站 -&gt;
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function ToolsDirectory() {
  return (
    <div className="min-h-screen bg-[#0d1714] py-8 text-white [font-family:var(--font-eco)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-[28px] bg-[#0d1714] shadow-[0_60px_160px_rgba(5,12,9,0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(175,210,200,0.18),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(90,150,138,0.22),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,210,152,0.2),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,22,18,0.2),rgba(8,12,10,0.62))]" />
          <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-80" />
          <div className="relative min-h-[85vh] px-6 pb-14 pt-10 sm:px-10 lg:px-16">
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

            <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-8 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  工具目录
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
                  发现<span className="text-[#ccff00]">AI 工具</span>，直接提升你的业务效率。
                </h1>
                <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                  精心策划的工具库，覆盖视频、图像、生产力与增长场景。每个条目都为落地场景而设计。
                </p>
                <div className="flex flex-wrap gap-3">
                  {["视频", "图像", "生产力", "营销", "自动化"].map((pill) => (
                    <span
                      key={pill}
                      className="rounded-md bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/14"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-[#17221e] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  焦点
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  每周更新热门 AI 工具榜单
                </h2>
                <p className="mt-4 text-sm text-white/55 leading-relaxed">
                  从增长、设计、营销到效率工具，第一时间获取最值得关注的工具清单。
                </p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#ccff00] px-4 py-2 text-sm font-semibold text-[#0d1714] transition hover:bg-[#d7ff33] hover:shadow-[0_12px_30px_rgba(204,255,0,0.35)]">
                  查看榜单 -&gt;
                </button>
              </div>
            </div>

            <section className="mt-16">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {DUMMY_TOOLS.map((tool) => (
                  <ToolCard key={tool.id} {...tool} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

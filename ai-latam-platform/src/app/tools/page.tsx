import Nav from "@/components/nav";
import { DUMMY_TOOLS } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";
import clsx from "clsx";

type Tool = {
  id: number;
  name: string;
  tag: string;
  description: string;
  price: string;
  url?: string | null;
};

const DUMMY_TOOLS_TYPED: Tool[] = DUMMY_TOOLS;

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
  url,
}: {
  name: string;
  tag: string;
  description: string;
  price: string;
  url?: string | null;
}) {
  return (
    <article className="group rounded-2xl bg-[#1a2622] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:bg-[#212f2a]">
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
          <span className="text-xl font-semibold text-white/70">
            {name.slice(0, 1)}
          </span>
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
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
          >
            访问网站 -&gt;
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/60">
            暂无链接
          </span>
        )}
      </div>
    </article>
  );
}

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function getTools(): Promise<Tool[]> {
  try {
    const response = await fetch(`${API_BASE}/api/tools`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return DUMMY_TOOLS_TYPED;
    }
    const data = (await response.json()) as { tools?: Tool[] };
    if (!data.tools?.length) {
      return DUMMY_TOOLS_TYPED;
    }
    return data.tools.map((row) => ({
      id: row.id,
      name: row.name,
      tag: row.tag || row.category || "工具",
      description: row.description || "暂无描述。",
      price: row.price || "付费",
      url: row.url ?? null,
    }));
  } catch {
    return DUMMY_TOOLS_TYPED;
  }
}

export default async function ToolsDirectory() {
  const tools = await getTools();

  return (
    <div
      className="min-h-screen bg-[#0d1714] text-white [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#b8ef00",
        ["--accent-glow" as unknown as string]: "rgba(184,239,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0d1714",
      }}
    >
      <div className="relative overflow-hidden bg-[#0d1714]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(175,210,200,0.18),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(90,150,138,0.22),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,210,152,0.2),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,22,18,0.2),rgba(8,12,10,0.62))]" />
          <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-80" />
          <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />
          <div className="relative min-h-[85vh] px-8 pb-14 pt-10 sm:px-12 lg:px-20">
            <Nav currentPath="/tools" />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-8 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  工具目录
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
                  发现<span className="text-[var(--accent)]">AI 工具</span>，直接提升你的业务效率。
                </h1>
                <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                  精心策划的工具库，覆盖视频、图像、生产力与增长场景。每个条目都为落地场景而设计。
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  {[
                    { label: "全部", active: true },
                    { label: "视频视觉", active: false },
                    { label: "图像生成", active: false },
                    { label: "生产力", active: false },
                    { label: "营销自动化", active: false },
                    { label: "开发编程", active: false },
                  ].map((item, index) => (
                    <button
                      key={item.label}
                      className={`rounded-full px-6 py-2.5 text-sm transition-all duration-300 border ${
                        index === 0
                          ? "bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] font-bold"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30"
                      }`}
                      type="button"
                    >
                      {item.label}
                    </button>
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
                <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]">
                  查看榜单 -&gt;
                </button>
              </div>
            </div>

            <section className="mt-16">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} {...tool} />
                ))}
              </div>
            </section>
          </div>
        </div>
    </div>
  );
}

import Nav from "@/components/nav";
import PromptGrid, { type PromptItem } from "./prompt-grid";
import { DUMMY_PROMPTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const DUMMY_PROMPTS_TYPED: PromptItem[] = DUMMY_PROMPTS;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function getPrompts(): Promise<PromptItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/prompts`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return DUMMY_PROMPTS_TYPED;
    }
    const data = (await response.json()) as { prompts?: PromptItem[] };
    if (!data.prompts?.length) {
      return DUMMY_PROMPTS_TYPED;
    }
    return data.prompts.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      platforms: Array.isArray(row.platforms) ? row.platforms : [],
      preview: row.preview || row.prompt?.slice(0, 120) || "",
      prompt: row.prompt,
      coverImage: (row as { cover_image?: string | null }).cover_image ?? null,
    }));
  } catch {
    return DUMMY_PROMPTS_TYPED;
  }
}

export default async function PromptSquarePage() {
  const prompts = await getPrompts();

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#a1a1aa] [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#d4ff00",
        ["--accent-glow" as unknown as string]: "rgba(212,255,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0a0a0a",
      }}
    >
      <div className="relative overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.12),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(0,255,148,0.12),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(120,200,255,0.12),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.2),rgba(0,0,0,0.7))]" />
          <div className="absolute inset-0 bg-[url('/eco-hero.svg')] bg-cover bg-center opacity-35 grayscale" />
          <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative min-h-[85vh] px-8 pb-14 pt-10 sm:px-12 lg:px-20">
            <Nav currentPath="/prompts" />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-8 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  提示词广场
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-white">
                  一键复制<span className="text-[var(--accent)]">提示词</span>，
                  直接用于销售、创作与自动化。
                </h1>
                <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                  每条提示词都针对特定平台优化。复制即可使用。
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  {[
                    { label: "全部", active: true },
                    { label: "营销", active: false },
                    { label: "产品", active: false },
                    { label: "广告", active: false },
                    { label: "社媒", active: false },
                    { label: "创意", active: false },
                  ].map((item, index) => (
                    <button
                      key={item.label}
                      className={`rounded-full px-6 py-2.5 text-sm transition-all duration-300 border ${
                        index === 0
                          ? "bg-[var(--accent)] text-[var(--accent-contrast)] border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] font-bold"
                          : "bg-white/5 text-white/60 border-[#333333] hover:bg-white/10 hover:text-white hover:border-white/30"
                      }`}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-[#333333] bg-[#121212] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  平台
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs">
                  {["GPT-4", "Claude", "Gemini", "Midjourney"].map((platform) => (
                    <span
                      key={platform}
                      className="rounded-md bg-white/8 px-3 py-1 text-white/70"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm text-white/55 leading-relaxed">
                  选择平台并复制提示词，立即使用。
                </p>
              </div>
            </div>

            <PromptGrid prompts={prompts} />
          </div>
        </div>
    </div>
  );
}

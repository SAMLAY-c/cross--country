import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PromptGrid, { type PromptItem } from "./prompt-grid";

export const dynamic = "force-dynamic";

const DUMMY_PROMPTS: PromptItem[] = [
  {
    id: 1,
    title: "Reels 爆款脚本",
    category: "营销",
    platforms: ["GPT-4", "Claude"],
    preview:
      "你是创意策略师。为一个带货 Reels 生成 30 秒脚本...",
    prompt:
      "你是创意策略师。为[产品]生成一个 30 秒 Reels 脚本。开头 3 秒必须有强钩子，包含快速演示，并以直接 CTA 结尾。语气：高能、鼓舞。",
  },
  {
    id: 2,
    title: "产品发布简报",
    category: "产品",
    platforms: ["GPT-4", "Gemini"],
    preview:
      "你是资深 PMM，为新产品撰写发布简报...",
    prompt:
      "你是资深产品市场经理。为[产品]撰写发布简报，包含目标人群、价值主张、定位、关键信息、渠道与 KPI。",
  },
  {
    id: 3,
    title: "广告创意点子",
    category: "广告",
    platforms: ["GPT-4"],
    preview:
      "为某品牌生成 10 条 Meta Ads 广告创意...",
    prompt:
      "为[行业]品牌生成 10 条 Meta Ads 创意，包含格式、钩子、主文案与 CTA。",
  },
  {
    id: 4,
    title: "内容计划表",
    category: "社媒",
    platforms: ["Claude", "GPT-4"],
    preview:
      "生成 30 天内容日历，包含主题与目标...",
    prompt:
      "为[品牌]生成 30 天内容日历，每天包含主题、形式、目标与 CTA。",
  },
  {
    id: 5,
    title: "Midjourney 画面提示词",
    category: "创意",
    platforms: ["Midjourney"],
    preview:
      "为夜景暖光画面生成电影感提示词...",
    prompt:
      "生成电影感提示词：夜晚木屋场景，室内暖光，潮湿森林，轻雾，编辑风摄影，35mm，景深明显，低调光。",
  },
  {
    id: 6,
    title: "销售邮件模板",
    category: "销售",
    platforms: ["GPT-4", "Claude"],
    preview:
      "撰写一封咨询式 B2B 销售邮件...",
    prompt:
      "为[产品]撰写咨询式 B2B 销售邮件，包含痛点、价值主张、社会证明与预约演示 CTA。",
  },
];

async function getPrompts(): Promise<PromptItem[]> {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return DUMMY_PROMPTS;
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    platforms: Array.isArray(row.platforms)
      ? row.platforms
      : row.platforms
        ? [row.platforms]
        : [],
    preview: row.preview || row.prompt?.slice(0, 120) || "",
    prompt: row.prompt,
  }));
}

export default async function PromptSquarePage() {
  const prompts = await getPrompts();

  return (
    <div className="min-h-screen bg-[#0d1714] py-8 text-white [font-family:var(--font-eco)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-[28px] bg-[#0d1714] shadow-[0_60px_160px_rgba(5,12,9,0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(175,210,200,0.18),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(90,150,138,0.22),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,210,152,0.2),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,22,18,0.2),rgba(8,12,10,0.62))]" />
          <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-80" />
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
            }}
          />
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
                  提示词广场
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
                  一键复制<span className="text-[#ccff00]">提示词</span>，
                  直接用于销售、创作与自动化。
                </h1>
                <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                  每条提示词都针对特定平台优化。复制即可使用。
                </p>
                <div className="flex flex-wrap gap-3">
                  {["营销", "产品", "广告", "社媒", "创意"].map(
                    (pill) => (
                      <span
                        key={pill}
                        className="rounded-md bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/14"
                      >
                        {pill}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="rounded-3xl bg-[#17221e] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
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
    </div>
  );
}

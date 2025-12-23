import Nav from "@/components/nav";
import StickyFilterBar from "@/components/sticky-filter-bar";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  readTime: string;
  publishedAt: string;
};

const POSTS: Post[] = [
  {
    id: 1,
    title: "Midjourney V6 提示词工程全面指南",
    excerpt:
      "从光影控制到材质渲染，拆解 V6 版本的核心逻辑与实战技巧。",
    tag: "深度测评",
    read: "8 Min Read",
    date: "2025.12.23",
  },
  {
    id: 2,
    title: "Claude 做客户调研的高效流程",
    excerpt:
      "用结构化提示词建立用户洞察框架，提高调研质量与效率。",
    tag: "增长实验",
    read: "6 Min Read",
    date: "2025.12.19",
  },
  {
    id: 3,
    title: "GPT-4o 视频脚本黄金模板",
    excerpt:
      "一套可复用的短视频脚本框架，适用于带货与品牌传播。",
    tag: "提示词拆解",
    read: "5 Min Read",
    date: "2025.12.12",
  },
];

export const dynamic = "force-dynamic";

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return POSTS;
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || "暂无摘要。",
    tag: row.tag || "深度测评",
    readTime: row.read_time || "5 Min Read",
    publishedAt: row.published_at || "2025.12.23",
  }));
}

export default async function BlogPage() {
  const posts = await getPosts();
  const featured = posts[0];

  return (
    <div
      className="min-h-screen bg-[#0d1714] text-white [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#c2f700",
        ["--accent-glow" as unknown as string]: "rgba(194,247,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0d1714",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(175,210,200,0.18),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(90,150,138,0.22),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,210,152,0.2),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,22,18,0.2),rgba(8,12,10,0.62))]" />
        <div className="absolute inset-0 bg-[url('/eco-hero.jpg')] bg-cover bg-center opacity-80" />
        <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />
        <main className="relative w-full flex min-h-screen flex-col gap-16 px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav currentPath="/blog" />

          <section className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                Blog
              </p>
              <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
                洞察<span className="text-[var(--accent)]">AI</span>趋势，
                记录每一次增长。
              </h1>
              <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                长文评测、Prompt 拆解、增长案例。每篇内容围绕真实业务场景，帮助你快速落地。
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#151a18]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f2937] via-[#0d1714] to-[#000000]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.35em] text-[var(--accent)]">
                    Featured
                  </span>
                  <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-[var(--accent)]">
                    {featured?.title || "暂无推荐"}
                  </h2>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                    <span>{featured?.readTime || "5 Min Read"}</span>
                    <span className="text-white/80">阅读全文 →</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <StickyFilterBar
            items={["全部", "深度测评", "提示词拆解", "工具对比", "增长实验"]}
          />

          <div className="mt-12">
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-[#1a2622] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/45">
                  <span>{post.readTime}</span>
                  <span>{post.publishedAt}</span>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/50">
                  {post.tag}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/16">
                  阅读全文 →
                </button>
              </article>
            ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

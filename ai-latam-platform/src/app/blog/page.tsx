import Nav from "@/components/nav";
import StickyFilterBar from "@/components/sticky-filter-bar";
import { DUMMY_POSTS } from "@/lib/mock-data";
import RealtimePostsList from "@/components/realtime-posts-list";
import { RealtimePostsProvider } from "@/components/realtime-posts-provider";
import RealtimeFeaturedPost from "@/components/realtime-featured-post";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  readTime: string;
  publishedAt: string;
  sourceUrl?: string | null;
  coverImage?: string | null;
  gallery?: string[] | null;
};

const DUMMY_POSTS_TYPED: Post[] = DUMMY_POSTS;

const REVALIDATE_SECONDS = 60 * 5;

export const revalidate = REVALIDATE_SECONDS;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

function formatPublishedAt(value?: string | null): string {
  if (!value) {
    return "2025.12.23";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "2025.12.23";
  }

  return date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");
}

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE}/api/posts`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      return DUMMY_POSTS_TYPED;
    }
    const data = (await response.json()) as { posts?: Post[] };
    if (!data.posts?.length) {
      return DUMMY_POSTS_TYPED;
    }
    return data.posts.map((row) => ({
      id: row.id,
      title: row.title,
      excerpt: (row as { excerpt?: string | null }).excerpt || "暂无摘要。",
      tag: (row as { tag?: string | null }).tag || "深度测评",
      readTime: (row as { read_time?: string | null }).read_time || "5 Min Read",
      publishedAt: formatPublishedAt((row as { published_at?: string | null }).published_at),
      sourceUrl: (row as { source_url?: string | null }).source_url ?? null,
      coverImage: (row as { cover_image?: string | null }).cover_image ?? null,
      gallery: (row as { gallery?: string[] | null }).gallery ?? null,
    }));
  } catch {
    return DUMMY_POSTS_TYPED;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

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
        <main className="relative w-full flex min-h-screen flex-col gap-16 px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav currentPath="/blog" />

          <RealtimePostsProvider initialPosts={posts}>
            <section className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-8">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  Blog
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-white">
                  洞察<span className="text-[var(--accent)]">AI</span>趋势，
                  记录每一次增长。
                </h1>
                <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                  长文评测、Prompt 拆解、增长案例。每篇内容围绕真实业务场景，帮助你快速落地。
                </p>
              </div>
              <div className="lg:col-span-7">
                <RealtimeFeaturedPost />
              </div>
            </section>

            <StickyFilterBar
              items={["全部", "深度测评", "提示词拆解", "工具对比", "增长实验"]}
            />

            <div className="mt-12">
              <RealtimePostsList />
            </div>
          </RealtimePostsProvider>
        </main>
      </div>
    </div>
  );
}
